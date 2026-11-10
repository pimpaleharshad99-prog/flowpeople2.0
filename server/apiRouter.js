import crypto from 'node:crypto';
import { getSupabaseAdmin, getSupabaseAnon, checkSupabaseHealth, getPgPool } from './supabase.js';
import {
  validateSessionFromRequest,
  getSupabaseTokenFromRequest,
  getSessionCookieHeader,
  getClearSessionCookieHeader,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getClientIp,
} from './auth.js';

const MAX_BODY_BYTES = 100 * 1024; // 100 KB limit for incoming JSON bodies
const ALLOWED_STATUSES = ['new', 'contacted', 'qualified', 'closed', 'archived'];

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'https://flowpeoplefluxora.vercel.app',
  'https://flowpeople.in',
  'https://www.flowpeople.in',
];

// In-memory rate limiter for public inquiry form submissions: max 15 submissions per 15 mins per IP
const inquiryRateLimitMap = new Map();
const INQUIRY_WINDOW_MS = 15 * 60 * 1000;
const MAX_INQUIRIES_PER_WINDOW = 15;

function checkInquiryRateLimit(clientIp) {
  const now = Date.now();
  const entry = inquiryRateLimitMap.get(clientIp);
  if (!entry || now - entry.firstAttempt > INQUIRY_WINDOW_MS) {
    inquiryRateLimitMap.set(clientIp, { count: 1, firstAttempt: now });
    return { allowed: true };
  }
  if (entry.count >= MAX_INQUIRIES_PER_WINDOW) {
    const resetInSeconds = Math.ceil((entry.firstAttempt + INQUIRY_WINDOW_MS - now) / 1000);
    return { allowed: false, resetInSeconds };
  }
  entry.count += 1;
  return { allowed: true };
}

function getAllowedOrigins() {
  const envOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const frontendUrl = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : [];
  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins, ...frontendUrl]);
}

/**
 * Handle API Gateway Requests (Vercel Serverless & Local Express/Vite)
 */
export async function handleApiRequest(req, res, next) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url || '/', `http://${host}`);

  // 1. Check serverless proxy headers for the original requested URI
  const candidateHeaderPath =
    req.headers['x-invoke-path'] ||
    req.headers['x-original-url'] ||
    req.headers['x-forwarded-uri'] ||
    req.headers['x-matched-path'];

  let pathname = '';
  if (typeof candidateHeaderPath === 'string' && candidateHeaderPath.startsWith('/api')) {
    pathname = candidateHeaderPath.split('?')[0];
  } else {
    pathname = url.pathname;
  }

  // 2. If pathname is a router wrapper (/api, /api/index, /api/[...path], /api/leads/[id], etc.), resolve real path
  const isRouterWrapper =
    pathname === '/api' ||
    pathname === '/api/' ||
    pathname === '/' ||
    pathname === '/api/index' ||
    pathname === '/api/index.js' ||
    pathname === '/api/[...path]' ||
    pathname.startsWith('/api/[...') ||
    pathname === '/api/leads/[id]' ||
    pathname === '/api/leads/[id].js';

  if (isRouterWrapper) {
    if (req.query && req.query.id) {
      pathname = '/api/leads/' + req.query.id;
    } else if (req.query && req.query.path) {
      const qPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
      pathname = '/api/' + qPath.replace(/^\/+/, '');
    } else if (url.searchParams.has('path')) {
      const pathSegments = url.searchParams.getAll('path');
      pathname = '/api/' + pathSegments.join('/').replace(/^\/+/, '');
    } else if (url.searchParams.has('id')) {
      pathname = '/api/leads/' + url.searchParams.get('id');
    } else if (req.headers['x-now-route-matches']) {
      try {
        const matches = new URLSearchParams(req.headers['x-now-route-matches']);
        const matchVal = matches.get('1') || matches.get('path');
        if (matchVal) {
          pathname = '/api/' + decodeURIComponent(matchVal).replace(/^\/+/, '');
        }
      } catch {}
    }
  }

  // Remove trailing slash for uniform matching
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Security Headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS Configuration with strict allowlist
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.origin;

  if (origin) {
    if (allowedOrigins.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

  // Handle CORS OPTIONS preflight
  if (req.method === 'OPTIONS') {
    if (origin && !allowedOrigins.has(origin)) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Origin not permitted.' }));
    }
    res.setHeader('Access-Control-Max-Age', '86400');
    res.statusCode = 204;
    return res.end();
  }

  // Prevent cross-origin state modification from untrusted origins
  if (origin && !allowedOrigins.has(origin)) {
    if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(req.method)) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: 'Forbidden: Request origin not allowed.' }));
    }
  }

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    req.headers['x-forwarded-proto'] === 'https';

  try {
    // =====================================================================
    // 1. HEALTH CHECK ROUTE: GET /api/db/health (Supabase PostgreSQL Status)
    // =====================================================================
    if (pathname === '/api/db/health' && req.method === 'GET') {
      const health = await checkSupabaseHealth();
      res.statusCode = health.connected ? 200 : 503;
      return res.end(JSON.stringify(health));
    }

    // =====================================================================
    // 2. AUTHENTICATION ROUTES: /api/auth/* (Supabase Auth)
    // =====================================================================

    // POST /api/auth/login: Supabase Auth credentials validation
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const bodyResult = await parseJsonBody(req);
      if (!bodyResult.ok) {
        res.statusCode = bodyResult.statusCode;
        return res.end(JSON.stringify({ success: false, error: bodyResult.error }));
      }
      const body = bodyResult.data;

      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';
      const clientIp = getClientIp(req);
      const rateLimitKey = `${clientIp}:${email || 'anon'}`;

      // Rate limiting: 5 attempts per 15 minutes
      const rateCheck = checkRateLimit(rateLimitKey);
      if (!rateCheck.allowed) {
        res.statusCode = 429;
        return res.end(
          JSON.stringify({
            success: false,
            error: `Too many failed login attempts. Please try again after ${rateCheck.resetInSeconds} seconds.`,
          })
        );
      }

      if (!email || !password) {
        recordFailedAttempt(rateLimitKey);
        res.statusCode = 400;
        return res.end(
          JSON.stringify({ success: false, error: 'Email and password are required.' })
        );
      }

      const supabaseAnon = getSupabaseAnon();
      const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user || !authData.session) {
        recordFailedAttempt(rateLimitKey);
        res.statusCode = 401;
        return res.end(
          JSON.stringify({ success: false, error: 'Invalid credentials. Please verify your email and password.' })
        );
      }

      // Check profile permissions in Supabase profiles table
      const supabaseAdmin = getSupabaseAdmin();
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile || profile.is_active === false || !['superadmin', 'admin'].includes(profile.role)) {
        await supabaseAnon.auth.signOut();
        res.statusCode = 403;
        return res.end(
          JSON.stringify({
            success: false,
            error: 'Access denied: This account is deactivated or lacks administrator permissions.',
          })
        );
      }

      resetRateLimit(rateLimitKey);

      // Set HttpOnly session cookie with Supabase access token
      res.setHeader('Set-Cookie', getSessionCookieHeader(authData.session.access_token, isProduction));

      const safeUser = {
        id: authData.user.id,
        email: authData.user.email,
        name: profile.full_name || authData.user.user_metadata?.full_name || 'Administrator',
        role: profile.role,
        lastLoginAt: new Date().toISOString(),
      };

      return res.end(
        JSON.stringify({
          success: true,
          user: safeUser,
          token: authData.session.access_token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isLive: true,
        })
      );
    }

    // GET /api/auth/me: Verify active session against Supabase Auth & profiles
    if ((pathname === '/api/auth/me' || pathname === '/api/auth/verify') && (req.method === 'GET' || req.method === 'POST')) {
      const admin = await validateSessionFromRequest(req);
      if (!admin) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ authenticated: false, error: 'Unauthorized: Session expired or invalid.' }));
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

    // POST /api/auth/logout: Invalidate Supabase session and clear cookie
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const token = getSupabaseTokenFromRequest(req);
      if (token) {
        try {
          const supabase = getSupabaseAdmin();
          await supabase.auth.admin.signOut(token);
        } catch {}
      }
      res.setHeader('Set-Cookie', getClearSessionCookieHeader(isProduction));
      return res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
    }

    // =====================================================================
    // 3. INQUIRY & LEADS ROUTES: /api/leads or /api/inquiry (Supabase PostgreSQL)
    // =====================================================================
    if (pathname === '/api/leads' || pathname === '/api/inquiry') {
      const supabaseAdmin = getSupabaseAdmin();

      // GET /api/leads: List inquiry leads (PROTECTED: Requires Admin Session)
      if (req.method === 'GET') {
        const admin = await validateSessionFromRequest(req);
        if (!admin) {
          res.statusCode = 401;
          return res.end(JSON.stringify({ success: false, error: 'Unauthorized: Admin authentication required.' }));
        }

        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search');
        const pageParam = parseInt(url.searchParams.get('page'), 10);
        const limitParam = parseInt(url.searchParams.get('limit'), 10);

        const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
        const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
          .from('leads')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (status && status !== 'all' && ALLOWED_STATUSES.includes(status)) {
          query = query.eq('status', status);
        }

        if (search && typeof search === 'string' && search.trim()) {
          const cleanSearch = search.trim().slice(0, 100);
          query = query.or(`full_name.ilike.%${cleanSearch}%,company_name.ilike.%${cleanSearch}%,business_email.ilike.%${cleanSearch}%`);
        }

        const { data: leads, count, error } = await query;
        if (error) {
          throw error;
        }

        const total = count || 0;
        return res.end(
          JSON.stringify({
            success: true,
            leads: leads || [],
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit) || 1,
            },
            isLive: true,
          })
        );
      }

      // POST /api/leads or /api/inquiry: Public website inquiry capture
      if (req.method === 'POST') {
        const clientIp = getClientIp(req);
        const rateCheck = checkInquiryRateLimit(clientIp);
        if (!rateCheck.allowed) {
          res.statusCode = 429;
          return res.end(
            JSON.stringify({
              success: false,
              error: `Too many submissions. Please try again after ${rateCheck.resetInSeconds} seconds.`,
            })
          );
        }

        const bodyResult = await parseJsonBody(req);
        if (!bodyResult.ok) {
          res.statusCode = bodyResult.statusCode;
          return res.end(JSON.stringify({ success: false, error: bodyResult.error }));
        }
        const body = bodyResult.data;

        // Whitelist accepted input fields
        const fullName = typeof body.full_name === 'string' ? body.full_name.trim().slice(0, 120) : '';
        const businessEmail = typeof body.business_email === 'string' ? body.business_email.trim().toLowerCase().slice(0, 150) : '';

        if (!fullName) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ success: false, error: 'Full name is required.' }));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!businessEmail || !emailRegex.test(businessEmail)) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ success: false, error: 'A valid business email address is required.' }));
        }

        const companyName = typeof body.company_name === 'string' ? body.company_name.trim().slice(0, 150) : '';
        const phone = typeof body.phone_number === 'string' ? body.phone_number.trim().slice(0, 30) : (typeof body.phone === 'string' ? body.phone.trim().slice(0, 30) : '');
        const employeeCount = typeof body.employee_count === 'string' ? body.employee_count.trim().slice(0, 50) : '';
        const interestedPlan = typeof body.interested_plan === 'string' ? body.interested_plan.trim().slice(0, 50) : '';
        const inquiryType = typeof body.inquiry_type === 'string' ? body.inquiry_type.trim().slice(0, 50) : '';
        const designation = typeof body.designation === 'string' ? body.designation.trim().slice(0, 100) : '';
        const message = typeof body.message === 'string' ? body.message.trim().slice(0, 3000) : '';

        const newLeadRecord = {
          full_name: fullName,
          business_email: businessEmail,
          company_name: companyName,
          phone: phone,
          phone_number: phone,
          employee_count: employeeCount,
          interested_plan: interestedPlan,
          inquiry_type: inquiryType,
          designation: designation,
          message: message,
          status: 'new', // Always forced to 'new'
          admin_notes: '', // Always empty initially
          source: typeof body.source === 'string' ? body.source.slice(0, 100) : 'website_inquiry_form',
        };

        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('leads')
          .insert([newLeadRecord])
          .select();

        if (insertError) {
          console.error('Supabase lead insertion error:', insertError.message);
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              lead: newLeadRecord,
              isLive: false,
              fallbackCached: true,
            })
          );
        }

        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, lead: inserted[0], isLive: true }));
      }
    }

    // PATCH /api/leads/:id: Update inquiry status or admin notes (PROTECTED: Requires Admin Session)
    if (pathname.startsWith('/api/leads/') && req.method === 'PATCH') {
      const admin = await validateSessionFromRequest(req);
      if (!admin) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ success: false, error: 'Unauthorized: Admin authentication required.' }));
      }

      const rawId = pathname.replace('/api/leads/', '').trim();
      let leadId = '';
      try {
        leadId = decodeURIComponent(rawId).trim();
      } catch {
        res.statusCode = 400;
        return res.end(JSON.stringify({ success: false, error: 'Invalid lead ID format.' }));
      }

      const bodyResult = await parseJsonBody(req);
      if (!bodyResult.ok) {
        res.statusCode = bodyResult.statusCode;
        return res.end(JSON.stringify({ success: false, error: bodyResult.error }));
      }
      const body = bodyResult.data;

      const updateFields = {
        updated_at: new Date().toISOString(),
      };

      if (body.status !== undefined) {
        if (!ALLOWED_STATUSES.includes(body.status)) {
          res.statusCode = 400;
          return res.end(
            JSON.stringify({
              success: false,
              error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`,
            })
          );
        }
        updateFields.status = body.status;
      }

      if (body.admin_notes !== undefined) {
        if (typeof body.admin_notes !== 'string' || body.admin_notes.length > 5000) {
          res.statusCode = 400;
          return res.end(
            JSON.stringify({ success: false, error: 'admin_notes must be a string under 5000 characters.' })
          );
        }
        updateFields.admin_notes = body.admin_notes;
      }

      const supabaseAdmin = getSupabaseAdmin();
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('leads')
        .update(updateFields)
        .eq('id', leadId)
        .select();

      if (updateError || !updated || updated.length === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Lead not found.' }));
      }

      return res.end(JSON.stringify({ success: true, modifiedCount: updated.length, lead: updated[0] }));
    }

    // DELETE /api/leads/:id: Delete an inquiry lead (PROTECTED: Requires Admin Session)
    if (pathname.startsWith('/api/leads/') && req.method === 'DELETE') {
      const admin = await validateSessionFromRequest(req);
      if (!admin) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ success: false, error: 'Unauthorized: Admin authentication required.' }));
      }

      const rawId = pathname.replace('/api/leads/', '').trim();
      let leadId = '';
      try {
        leadId = decodeURIComponent(rawId).trim();
      } catch {
        res.statusCode = 400;
        return res.end(JSON.stringify({ success: false, error: 'Invalid lead ID format.' }));
      }

      const supabaseAdmin = getSupabaseAdmin();
      const { data: deleted, error: deleteError } = await supabaseAdmin
        .from('leads')
        .delete()
        .eq('id', leadId)
        .select();

      if (deleteError || !deleted || deleted.length === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Lead not found or already deleted.' }));
      }

      return res.end(JSON.stringify({ success: true, deletedCount: deleted.length }));
    }

    // 404 handler for unknown API routes
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: `Cannot ${req.method} ${pathname}` }));
  } catch (error) {
    console.error('API Router Error:', error.message);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

/**
 * Helper to safely parse JSON body from incoming HTTP request stream
 */
function parseJsonBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve({ ok: true, data: req.body });
    }

    let data = '';
    let exceeded = false;

    req.on('data', (chunk) => {
      if (exceeded) return;
      data += chunk;
      if (data.length > MAX_BODY_BYTES) {
        exceeded = true;
      }
    });

    req.on('end', () => {
      if (exceeded) {
        return resolve({
          ok: false,
          statusCode: 413,
          error: 'Payload Too Large: Request body exceeds maximum allowed size.',
        });
      }

      if (!data || !data.trim()) {
        return resolve({ ok: true, data: {} });
      }

      try {
        const parsed = JSON.parse(data);
        if (typeof parsed !== 'object' || parsed === null) {
          return resolve({ ok: false, statusCode: 400, error: 'Invalid JSON: Expected an object.' });
        }
        resolve({ ok: true, data: parsed });
      } catch {
        resolve({ ok: false, statusCode: 400, error: 'Invalid JSON body syntax.' });
      }
    });

    req.on('error', () => {
      resolve({ ok: false, statusCode: 400, error: 'Error reading request body stream.' });
    });
  });
}
