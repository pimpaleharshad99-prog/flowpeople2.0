// scripts/supabase-status.js
// Supabase PostgreSQL & Auth connection and health status check
import { checkSupabaseHealth, getPgPool, getSupabaseAdmin } from '../server/supabase.js';

async function main() {
  console.log('🔍 Checking FlowPeople Supabase Connection & Status...\n');

  try {
    const health = await checkSupabaseHealth();
    console.log(`Status: ${health.status.toUpperCase()}`);
    console.log(`Database Provider: ${health.provider}`);
    console.log(`Connection: ${health.connected ? '✓ Connected' : '✗ Disconnected'}`);

    // Query profiles count
    const supabase = getSupabaseAdmin();
    const { count: profileCount, error: profileErr } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (profileErr) {
      console.warn('⚠️ Profiles query warning:', profileErr.message);
    } else {
      console.log(`Registered Admin Profiles: ${profileCount}`);
    }

    // Query leads count
    const { count: leadCount, error: leadErr } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (leadErr) {
      console.warn('⚠️ Leads query warning:', leadErr.message);
    } else {
      console.log(`Active Leads in PostgreSQL: ${leadCount}`);
    }

    // Direct PostgreSQL Pool check
    const pool = getPgPool();
    const pgRes = await pool.query('SELECT version(), current_database(), current_user;');
    console.log(`\nPostgreSQL Version: ${pgRes.rows[0].version.split(' on ')[0]}`);
    console.log(`Current DB: ${pgRes.rows[0].current_database}`);
    console.log(`User: ${pgRes.rows[0].current_user}`);

    console.log('\n✓ Supabase PostgreSQL backend is fully healthy and operational.');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Supabase status check failed:', error);
    process.exit(1);
  }
}

main();

