// server/supabase.js
import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

// 1. Supabase Admin Client (Service Role for privileged serverless routes)
let _supabaseAdmin = null;
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase admin configuration missing: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

// 2. Supabase Public Client (Anon key - purely stateless for anon requests)
export function getSupabaseAnon() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase public configuration missing: SUPABASE_URL or SUPABASE_ANON_KEY not set.');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// 3. PostgreSQL Direct Pool for high-speed serverless queries
let _pgPool = null;
export function getPgPool() {
  if (!_pgPool) {
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
    if (!dbUrl) {
      throw new Error('Database connection URL missing: DATABASE_URL not set in environment.');
    }

    _pgPool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    _pgPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err.message);
    });
  }
  return _pgPool;
}

/**
 * Health check for Supabase database & auth
 */
export async function checkSupabaseHealth() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });

    if (error) {
      // Fallback to pg direct ping
      const pool = getPgPool();
      const res = await pool.query('SELECT 1 as ping');
      return {
        status: res.rows[0]?.ping === 1 ? 'ok' : 'degraded',
        database: 'connected',
        connected: true,
        provider: 'Supabase PostgreSQL',
      };
    }

    return {
      status: 'ok',
      database: 'connected',
      connected: true,
      provider: 'Supabase PostgreSQL',
    };
  } catch (error) {
    console.error('Supabase health check failed:', error.message);
    return {
      status: 'error',
      database: 'disconnected',
      connected: false,
      provider: 'Supabase PostgreSQL',
    };
  }
}

/**
 * Cleanly close connections for tests
 */
export async function closePgConnections() {
  if (_pgPool) {
    try {
      await _pgPool.end();
    } catch {}
    _pgPool = null;
  }
}
