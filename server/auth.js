import crypto from 'node:crypto';
import { getSupabaseAdmin, getSupabaseAnon, getPgPool } from './supabase.js';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

// In-memory rate limiter for login attempts
const loginRateLimitMap = new Map();

/**
 * Check rate limit for IP/email identifier
 */
export function checkRateLimit(identifier) {
  if (!identifier) return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
  const now = Date.now();
  const entry = loginRateLimitMap.get(identifier);
  if (!entry) return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };

  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginRateLimitMap.delete(identifier);
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
  }

  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    const resetInSeconds = Math.ceil((entry.firstAttempt + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, resetInSeconds };
  }

  return { allowed: true, remaining: MAX_FAILED_ATTEMPTS - entry.count };
}

export function recordFailedAttempt(identifier) {
  if (!identifier) return;
  const now = Date.now();
  const entry = loginRateLimitMap.get(identifier);
  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginRateLimitMap.set(identifier, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

export function resetRateLimit(identifier) {
  if (identifier) loginRateLimitMap.delete(identifier);
}

/**
 * Extract client IP address from HTTP request headers
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Parse Cookie header into a key-value dictionary safely without throwing URIError
 */
export function parseCookies(req) {
  const cookieHeader = req?.headers?.cookie;
  if (!cookieHeader || typeof cookieHeader !== 'string') return {};
  const cookies = {};
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const name = trimmed.substring(0, eqIdx).trim();
    const rawVal = trimmed.substring(eqIdx + 1).trim();
    if (name) {
      try {
        cookies[name] = decodeURIComponent(rawVal);
      } catch {
        cookies[name] = rawVal;
      }
    }
  }
  return cookies;
}

/**
 * Extract Supabase session token from request (Cookie or Authorization Bearer header)
 */
export function getSupabaseTokenFromRequest(req) {
  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Check Cookie
  const cookies = parseCookies(req);
  if (cookies['flowpeople_admin_session']) {
    return cookies['flowpeople_admin_session'];
  }
  if (cookies['sb-access-token']) {
    return cookies['sb-access-token'];
  }

  return null;
}

/**
 * Validate active Supabase Auth session and verify administrative permissions in profiles table
 */
export async function validateSessionFromRequest(req) {
  const token = getSupabaseTokenFromRequest(req);
  if (!token) return null;

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Verify user token via Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return null;
    }

    // 2. Verify admin role in public.profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Must be active and have superadmin or admin role
    if (profile.is_active === false || !['superadmin', 'admin'].includes(profile.role)) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: profile.full_name || user.user_metadata?.full_name || 'Administrator',
      role: profile.role,
      is_active: profile.is_active,
      created_at: profile.created_at,
    };
  } catch (error) {
    console.error('Supabase session validation error:', error.message);
    return null;
  }
}

/**
 * Cookie headers for serverless session cookie synchronization
 */
export function getSessionCookieHeader(token, isSecure = false) {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const secureFlag = isSecure ? '; Secure' : '';
  return `flowpeople_admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
}

export function getClearSessionCookieHeader(isSecure = false) {
  const secureFlag = isSecure ? '; Secure' : '';
  return `flowpeople_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
}

/**
 * Sign in admin using Supabase Auth and verify admin role in profiles table
 */
export async function loginAdmin(email, password) {
  const supabaseAnon = getSupabaseAnon();
  const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData?.user || !authData?.session) {
    return {
      success: false,
      error: authError?.message || 'Invalid email or password.',
    };
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile || !['superadmin', 'admin'].includes(profile.role)) {
    return {
      success: false,
      error: 'Access restricted: Account lacks administrative privileges.',
    };
  }

  if (profile.is_active === false) {
    return {
      success: false,
      error: 'Account has been deactivated. Contact the system administrator.',
    };
  }

  return {
    success: true,
    user: {
      id: authData.user.id,
      email: authData.user.email,
      name: profile.full_name || 'Administrator',
      role: profile.role,
    },
    token: authData.session.access_token,
    refreshToken: authData.session.refresh_token,
  };
}

/**
 * Look up user and role by raw Supabase JWT token
 */
export async function getActiveSessionUser(token) {
  if (!token) return null;
  const mockReq = { headers: { authorization: `Bearer ${token}` } };
  return validateSessionFromRequest(mockReq);
}

