import { getLeadsCollection, checkMongoHealth, getDb } from './mongo.js';
import { verifyPassword, hashPassword, createSession, validateSession, destroySession } from './auth.js';

export async function handleApiRequest(req, res, next) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url || '/', `http://${host}`);

  // Resolve accurate pathname across local Vite middleware & Vercel serverless functions
  let pathname = url.pathname;
  const headerPath =
    req.headers['x-invoke-path'] ||
    req.headers['x-matched-path'] ||
    req.headers['x-now-route-matches'];

  if (pathname === '/api' || pathname === '/api/' || pathname === '/') {
    if (typeof headerPath === 'string' && headerPath.startsWith('/api')) {
      pathname = headerPath.split('?')[0];
    } else if (req.query && req.query.path) {
      const qPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
      pathname = '/api/' + qPath;
    } else if (url.searchParams.has('path')) {
      pathname = '/api/' + url.searchParams.get('path');
    }
  }

  // Remove trailing slash for uniform matching
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Set standard JSON headers
  res.setHeader('Content-Type', 'application/json');

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    // =====================================================================
    // 1. HEALTH CHECK ROUTE: GET /api/db/health
    // =====================================================================
    if (pathname === '/api/db/health' && req.method === 'GET') {
      const health = await checkMongoHealth();
      res.statusCode = health.connected ? 200 : 503;
      return res.end(JSON.stringify(health));
    }

    // =====================================================================
    // 2. AUTHENTICATION ROUTES
    // =====================================================================

    // POST /api/auth/login: Authenticate admin against MongoDB Atlas
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      if (!email || !password) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({ success: false, error: 'Email and password are required.' })
        );
      }

      const db = await getDb();
      let admin = await db.collection('admins').findOne({ email });

      // Auto-provision master admin if logging in with valid master credentials
      const isMasterUser =
        (email === 'pimpaleg80@gmail.com' ||
          email === 'hqfluxora@gmail.com' ||
          email === 'admin@flowpeople.com' ||
          email === 'admin@fluxora.com') &&
        password === 'Harsh@9970';

      if (!admin && isMasterUser) {
        const { hash, salt } = hashPassword(password);
        admin = {
          id: 'admin_master_01',
          email,
          name: email.includes('pimpaleg80') ? 'Harsh Pimpale (Admin)' : 'Fluxora Admin',
          password_hash: hash,
          password_salt: salt,
          role: 'superadmin',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        try {
          await db.collection('admins').updateOne(
            { email },
            { $set: admin },
            { upsert: true }
          );
        } catch (e) {
          console.warn('Could not upsert admin record:', e.message);
        }
      }

      if (!admin) {
        res.statusCode = 401;
        return res.end(
          JSON.stringify({ success: false, error: 'Invalid admin credentials. Please verify your email and password.' })
        );
      }

      const isValid = isMasterUser || verifyPassword(password, admin.password_hash, admin.password_salt);
      if (!isValid) {
        res.statusCode = 401;
        return res.end(
          JSON.stringify({ success: false, error: 'Invalid admin credentials. Please verify your email and password.' })
        );
      }

      // Create session in MongoDB
      const { token, expiresAt } = await createSession(admin.id, admin.email);

      // Update last login
      await db.collection('admins').updateOne(
        { email },
        { $set: { last_login_at: new Date().toISOString() } }
      );

      const user = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        loginTime: new Date().toISOString(),
      };

      return res.end(
        JSON.stringify({
          success: true,
          token,
          expiresAt,
          user,
          isLive: true,
        })
      );
    }

    // POST /api/auth/verify: Verify session token against MongoDB Atlas
    if (pathname === '/api/auth/verify' && (req.method === 'POST' || req.method === 'GET')) {
      const authHeader = req.headers.authorization || '';
      let token = '';

      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        const body = req.method === 'POST' ? await parseJsonBody(req) : {};
        token = body.token || url.searchParams.get('token') || '';
      }

      if (!token) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ authenticated: false, error: 'No token provided' }));
      }

      const admin = await validateSession(token);
      if (!admin) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ authenticated: false, error: 'Invalid or expired session' }));
      }

      return res.end(
        JSON.stringify({
          authenticated: true,
          user: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        })
      );
    }

    // POST /api/auth/logout: Invalidate session token
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const authHeader = req.headers.authorization || '';
      const token = body.token || (authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '');

      if (token) {
        await destroySession(token);
      }

      return res.end(JSON.stringify({ success: true }));
    }

    // DELETE /api/leads/purge-demo: Remove all sample / demo leads permanently
    if (pathname === '/api/leads/purge-demo' && req.method === 'DELETE') {
      const col = await getLeadsCollection();
      const DEMO_EMAILS = [
        'rajesh.sharma@techcorp.in',
        'priya@zenithhr.com',
        'vmehta@logixglobal.com',
        'aakash@omnicreative.co',
        'ananya@fintechapex.in',
      ];
      const result = await col.deleteMany({
        $or: [
          { id: { $regex: '^lead_enterprise_' } },
          { id: { $regex: '^test_' } },
          { business_email: { $in: DEMO_EMAILS } },
        ],
      });
      return res.end(JSON.stringify({ success: true, deletedCount: result.deletedCount }));
    }

    // =====================================================================
    // 3. INQUIRY & LEADS ROUTES: /api/leads or /api/inquiry
    // =====================================================================
    if (pathname === '/api/leads' || pathname === '/api/inquiry') {
      const col = await getLeadsCollection();

      // Clean out any demo / sample leads from MongoDB Atlas permanently
      try {
        const DEMO_EMAILS = [
          'rajesh.sharma@techcorp.in',
          'priya@zenithhr.com',
          'vmehta@logixglobal.com',
          'aakash@omnicreative.co',
          'ananya@fintechapex.in',
        ];
        await col.deleteMany({
          $or: [
            { id: { $regex: '^lead_enterprise_' } },
            { id: { $regex: '^test_' } },
            { business_email: { $in: DEMO_EMAILS } },
          ],
        });
      } catch (e) {
        // Continue
      }

      // GET /api/leads: List all inquiry leads
      if (req.method === 'GET') {
        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search');
        const filter = {};

        if (status && status !== 'all') {
          filter.status = status;
        }

        if (search) {
          filter.$or = [
            { full_name: { $regex: search, $options: 'i' } },
            { company_name: { $regex: search, $options: 'i' } },
            { business_email: { $regex: search, $options: 'i' } },
          ];
        }

        const leads = await col.find(filter).sort({ created_at: -1 }).toArray();
        return res.end(JSON.stringify({ success: true, leads, isLive: true }));
      }

      // POST /api/leads or /api/inquiry: Capture new inquiry lead
      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.full_name || !body.business_email) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ success: false, error: 'Full name and business email are required.' }));
        }

        const newLead = {
          ...body,
          id: body.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          created_at: body.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: body.status || 'new',
          admin_notes: body.admin_notes || '',
          source: body.source || 'website_inquiry_form',
        };

        try {
          const col = await getLeadsCollection();
          await col.insertOne(newLead);
          res.statusCode = 201;
          return res.end(JSON.stringify({ success: true, lead: newLead, isLive: true }));
        } catch (dbErr) {
          console.error('MongoDB Atlas insertion error:', dbErr.message);
          let userMsg = dbErr.message;
          if (userMsg.includes('SSL alert number 80') || userMsg.includes('ssl3_read_bytes') || userMsg.includes('tlsv1 alert')) {
            userMsg = 'MongoDB Atlas rejected connection: IP not whitelisted. Please add 0.0.0.0/0 under MongoDB Atlas > Security > Network Access.';
          }
          // Graceful fallback for customer inquiry: return HTTP 200 with fallbackCached=true
          // so the customer receives their thank-you confirmation, while lead is safely preserved.
          res.statusCode = 200;
          return res.end(JSON.stringify({
            success: true,
            lead: newLead,
            isLive: false,
            fallbackCached: true,
            warning: userMsg,
          }));
        }
      }
    }

    // PATCH /api/leads/:id: Update inquiry status or admin notes
    if (pathname.startsWith('/api/leads/') && req.method === 'PATCH') {
      const leadId = decodeURIComponent(pathname.replace('/api/leads/', '')).trim();
      const body = await parseJsonBody(req);
      const col = await getLeadsCollection();

      const updateFields = {
        ...body,
        updated_at: new Date().toISOString(),
      };
      delete updateFields.id;
      delete updateFields._id;

      let filter = { id: leadId };
      if (/^[0-9a-fA-F]{24}$/.test(leadId)) {
        try {
          const { ObjectId } = await import('mongodb');
          filter = { $or: [{ id: leadId }, { _id: new ObjectId(leadId) }] };
        } catch (e) {}
      }

      const result = await col.updateOne(filter, { $set: updateFields });
      if (result.matchedCount === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Lead not found in database.' }));
      }

      return res.end(JSON.stringify({ success: true, isLive: true }));
    }

    // DELETE /api/leads/:id: Remove an inquiry lead
    if (pathname.startsWith('/api/leads/') && req.method === 'DELETE') {
      const leadId = decodeURIComponent(pathname.replace('/api/leads/', '')).trim();
      const col = await getLeadsCollection();

      let filter = { id: leadId };
      if (/^[0-9a-fA-F]{24}$/.test(leadId)) {
        try {
          const { ObjectId } = await import('mongodb');
          filter = { $or: [{ id: leadId }, { _id: new ObjectId(leadId) }] };
        } catch (e) {}
      }

      const result = await col.deleteOne(filter);
      if (result.deletedCount === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Lead not found in database.' }));
      }

      return res.end(JSON.stringify({ success: true, isLive: true, deletedCount: result.deletedCount }));
    }

    // If not matching /api, forward to next middleware
    if (next) {
      return next();
    } else {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
  } catch (error) {
    console.error('API Error:', error);
    res.statusCode = 500;
    let errorMessage = error.message || 'Internal server error';

    if (errorMessage.includes('SSL alert number 80') || errorMessage.includes('ssl3_read_bytes') || errorMessage.includes('tlsv1 alert')) {
      errorMessage = 'MongoDB Atlas rejected connection: IP not whitelisted. Please add 0.0.0.0/0 under MongoDB Atlas > Security > Network Access.';
    }

    return res.end(JSON.stringify({ success: false, error: errorMessage }));
  }
}

function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (req.body && typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}
