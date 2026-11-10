// scripts/test-frontend-admin-flow.js
// Verifies the exact logic executed by src/lib/adminAuth.ts and src/pages/AdminPage.tsx
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cmjsjxtjijawgspklfxt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_a9yC3a5rtjth-UmnUB53xA_uNOsdHK2';

// 1. Simulate frontend client (exactly like src/lib/supabase.ts)
const frontendSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

async function testFrontendFlow() {
  console.log('-------------------------------------------------------------');
  console.log('🧪 VERIFYING FRONTEND ADMIN AUTH FLOW (src/lib/adminAuth.ts)');
  console.log('-------------------------------------------------------------\n');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be present in .env');
  }

  // STEP 1: Attempt login with invalid credentials
  console.log('[Step 1] Attempt login with wrong password...');
  const { data: badData, error: badError } = await frontendSupabase.auth.signInWithPassword({
    email: adminEmail,
    password: 'WrongPassword999!',
  });
  if (badError) {
    console.log('  ✓ Correctly rejected:', badError.message);
  } else {
    throw new Error('Should have rejected bad password!');
  }

  // STEP 2: Login with genuine admin credentials
  console.log('\n[Step 2] Attempt login with genuine admin credentials...');
  const { data: authData, error: authError } = await frontendSupabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authError || !authData.user || !authData.session) {
    throw new Error(`Login failed: ${authError?.message}`);
  }
  console.log('  ✓ Supabase Auth login succeeded!');
  console.log(`  ✓ Authenticated User ID: ${authData.user.id}`);
  console.log(`  ✓ JWT Token issued: ${authData.session.access_token.substring(0, 30)}...`);

  // STEP 3: Verify profile role in public.profiles (as performed by adminAuth.login)
  console.log('\n[Step 3] Query public.profiles with authenticated user...');
  const { data: profile, error: profileError } = await frontendSupabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error(`Profile query failed: ${profileError?.message}`);
  }
  console.log('  ✓ Profile fetched:');
  console.log(`    Full Name: ${profile.full_name}`);
  console.log(`    Email: ${profile.email}`);
  console.log(`    Role: ${profile.role}`);
  console.log(`    Is Active: ${profile.is_active}`);

  if (!['superadmin', 'admin'].includes(profile.role)) {
    throw new Error(`Role ${profile.role} is not permitted!`);
  }
  console.log('  ✓ Role verified: Administrator permissions granted!');

  // STEP 4: Fetch Leads under RLS (as performed by AdminPage.tsx / leadService.getLeads())
  console.log('\n[Step 4] Fetch leads from public.leads under RLS...');
  const { data: leads, error: leadsError } = await frontendSupabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (leadsError) {
    throw new Error(`Failed to fetch leads under admin RLS: ${leadsError.message}`);
  }
  console.log(`  ✓ Successfully fetched ${leads.length} live leads from Supabase PostgreSQL!`);
  leads.forEach((l, idx) => {
    console.log(`    [${idx + 1}] ${l.full_name} (${l.company_name}) - Plan: ${l.interested_plan} - Status: ${l.status}`);
  });

  // STEP 5: Logout (as performed by adminAuth.logout)
  console.log('\n[Step 5] Admin logout via frontend client...');
  await frontendSupabase.auth.signOut();
  const { data: sessionAfterLogout } = await frontendSupabase.auth.getSession();
  if (!sessionAfterLogout.session) {
    console.log('  ✓ Session terminated cleanly.');
  } else {
    throw new Error('Session still present after logout!');
  }

  // STEP 6: Confirm anon cannot read leads after logout
  console.log('\n[Step 6] Confirm unauthenticated client cannot read leads under RLS...');
  const { data: unauthLeads } = await frontendSupabase.from('leads').select('*');
  if (!unauthLeads || unauthLeads.length === 0) {
    console.log('  ✓ RLS confirmed: 0 leads visible to unauthenticated client.');
  } else {
    throw new Error('Unauthenticated client was able to read leads!');
  }

  console.log('\n=============================================================');
  console.log('🎉 ALL FRONTEND ADMIN DASHBOARD AUTH CHECKS PASSED 100%!');
  console.log('=============================================================\n');
}

testFrontendFlow()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  });
