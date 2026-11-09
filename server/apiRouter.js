import { getLeadsCollection, checkMongoHealth, getDb } from './mongo.js';
import { verifyPassword, createSession, validateSession, destroySession } from './auth.js';

export async function handleApiRequest(req, res, next) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

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
      const admin = await db.collection('admins').findOne({ email });

      if (!admin) {
        res.statusCode = 401;
        return res.end(
          JSON.stringify({ success: false, error: 'Invalid admin credentials.' })
        );
      }

      const isValid = verifyPassword(password, admin.password_hash, admin.password_salt);
      if (!isValid) {
        res.statusCode = 401;
        return res.end(
          JSON.stringify({ success: false, error: 'Invalid admin credentials.' })
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

    // =====================================================================
    // 3. INQUIRY & LEADS ROUTES: /api/leads
    // =====================================================================
    if (pathname === '/api/leads') {
      const col = await getLeadsCollection();

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

      // POST /api/leads: Capture new inquiry lead
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

        await col.insertOne(newLead);
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, lead: newLead, isLive: true }));
      }
    }

    // PATCH /api/leads/:id: Update inquiry status or admin notes
    if (pathname.startsWith('/api/leads/') && req.method === 'PATCH') {
      const leadId = pathname.replace('/api/leads/', '');
      const body = await parseJsonBody(req);
      const col = await getLeadsCollection();

      const updateFields = {
        ...body,
        updated_at: new Date().toISOString(),
      };
      delete updateFields.id;
      delete updateFields._id;

      const result = await col.updateOne({ id: leadId }, { $set: updateFields });
      if (result.matchedCount === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Lead not found.' }));
      }

      return res.end(JSON.stringify({ success: true, isLive: true }));
    }

    // DELETE /api/leads/:id: Remove an inquiry lead
    if (pathname.startsWith('/api/leads/') && req.method === 'DELETE') {
      const leadId = pathname.replace('/api/leads/', '');
      const col = await getLeadsCollection();

      const result = await col.deleteOne({ id: leadId });
      if (result.deletedCount === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Lead not found.' }));
      }

      return res.end(JSON.stringify({ success: true, isLive: true }));
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
    return res.end(JSON.stringify({ success: false, error: error.message }));
  }
}

function parseJsonBody(req) {
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
