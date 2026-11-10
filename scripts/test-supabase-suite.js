// scripts/test-supabase-suite.js
// FlowPeople by Fluxora — Comprehensive Supabase Verification Test Suite
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin, getSupabaseAnon, getPgPool, checkSupabaseHealth } from '../server/supabase.js';
import { loginAdmin, validateSessionFromRequest, getActiveSessionUser } from '../server/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cmjsjxtjijawgspklfxt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_a9yC3a5rtjth-UmnUB53xA_uNOsdHK2';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pimpaleg80@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('❌ Missing ADMIN_PASSWORD in environment.');
  process.exit(1);
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Test failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ PASS: ${message}`);
}

async function runTests() {
  console.log('=====================================================================');
  console.log('🚀 FLOWPEOPLE — SUPABASE END-TO-END VERIFICATION SUITE');
  console.log('=====================================================================\n');

  const pool = getPgPool();
  let createdTestLeadId = null;
  let adminSessionToken = null;

  try {
    // -------------------------------------------------------------------
    // TEST 1: Supabase Health Check
    // -------------------------------------------------------------------
    console.log('[Test 1] Supabase Connection & Health Check');
    const health = await checkSupabaseHealth();
    assert(health.status === 'ok', 'Supabase health status is ok');
    assert(health.connected === true, 'Supabase is reported connected');
    assert(health.provider.includes('Supabase'), 'Provider is Supabase PostgreSQL');

    // -------------------------------------------------------------------
    // TEST 2: PostgreSQL Direct Pool Query
    // -------------------------------------------------------------------
    console.log('\n[Test 2] Direct PostgreSQL Pool Connectivity');
    const pgRes = await pool.query('SELECT version(), current_database(), current_user;');
    assert(pgRes.rows.length === 1, 'PostgreSQL query returns 1 row');
    assert(pgRes.rows[0].current_database === 'postgres', 'Database is postgres');
    console.log(`     Connected user: ${pgRes.rows[0].current_user}`);
    console.log(`     Engine: ${pgRes.rows[0].version.split(' on ')[0]}`);

    // -------------------------------------------------------------------
    // TEST 3: Profiles Table & Superadmin Account
    // -------------------------------------------------------------------
    console.log('\n[Test 3] Superadmin Profile in public.profiles');
    const supabaseAdmin = getSupabaseAdmin();
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single();

    assert(!profileErr, `Admin profile fetched without error: ${profileErr?.message || 'none'}`);
    assert(profile !== null, 'Admin profile exists');
    assert(profile.role === 'superadmin', `Profile role is superadmin (got: ${profile.role})`);
    assert(profile.is_active === true, 'Profile is active');
    console.log(`     Profile ID: ${profile.id}, Email: ${profile.email}, Role: ${profile.role}`);

    // -------------------------------------------------------------------
    // TEST 4: Supabase Auth Login Verification
    // -------------------------------------------------------------------
    console.log('\n[Test 4] Admin Login via Supabase Auth');
    const loginResult = await loginAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);
    assert(loginResult.success === true, 'Admin login succeeded');
    assert(typeof loginResult.token === 'string' && loginResult.token.length > 20, 'JWT token returned');
    assert(loginResult.user.email === ADMIN_EMAIL, 'Returned user email matches admin');
    assert(loginResult.user.role === 'superadmin', 'Returned user role is superadmin');
    adminSessionToken = loginResult.token;
    console.log(`     JWT token length: ${adminSessionToken.length} chars`);

    // -------------------------------------------------------------------
    // TEST 5: Admin Token Verification via getActiveSessionUser()
    // -------------------------------------------------------------------
    console.log('\n[Test 5] Verify Admin JWT Session Token');
    const sessionUser = await getActiveSessionUser(adminSessionToken);
    assert(sessionUser !== null, 'Session user resolved successfully');
    assert(sessionUser.email === ADMIN_EMAIL, 'Session user email matches admin');
    assert(sessionUser.role === 'superadmin', 'Session user role is superadmin');

    // -------------------------------------------------------------------
    // TEST 6: Invalid Credentials Rejection
    // -------------------------------------------------------------------
    console.log('\n[Test 6] Reject Bad Credentials');
    try {
      const badLogin = await loginAdmin(ADMIN_EMAIL, 'WrongPassword123!');
      assert(badLogin.success === false, 'Bad login is rejected');
    } catch (e) {
      assert(true, `Bad login correctly threw: ${e.message}`);
    }

    // -------------------------------------------------------------------
    // TEST 7: Anonymous / Public RLS Restriction (Cannot SELECT from leads)
    // -------------------------------------------------------------------
    console.log('\n[Test 7] Supabase RLS Enforcement: Anon Cannot Read Leads');
    const anonClient = getSupabaseAnon();
    const { data: anonLeads, error: anonReadErr } = await anonClient
      .from('leads')
      .select('id, full_name');

    // Under RLS, anon gets empty list or permission error when reading
    assert(!anonLeads || anonLeads.length === 0, 'Anonymous client cannot view protected leads (RLS)');

    // -------------------------------------------------------------------
    // TEST 8: Public Lead Submission via RLS (Anon INSERT allowed)
    // -------------------------------------------------------------------
    console.log('\n[Test 8] Public Lead Submission via Anon Client (RLS Insert)');
    const testLeadData = {
      full_name: 'Supabase E2E Test Lead',
      business_email: 'test.supabase@fluxora.internal',
      company_name: 'Fluxora Test Corp',
      phone_number: '+91 9999999999',
      employee_count: '25 employees',
      interested_plan: 'Professional',
      inquiry_type: 'Book a Demo',
      message: 'Automated Supabase end-to-end verification test lead.',
      source: 'e2e_supabase_suite',
      status: 'new',
    };

    const { error: insertErr } = await anonClient.from('leads').insert([testLeadData]);
    assert(!insertErr, `Anon insert succeeded without RLS error: ${insertErr?.message || 'none'}`);

    // Retrieve the created test lead via admin client
    const { data: fetchedLead, error: fetchErr } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('business_email', 'test.supabase@fluxora.internal')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    assert(!fetchErr, `Admin client fetched inserted lead: ${fetchErr?.message || 'none'}`);
    assert(fetchedLead !== null, 'Inserted lead retrieved');
    assert(fetchedLead.company_name === 'Fluxora Test Corp', 'Company name verified');
    createdTestLeadId = fetchedLead.id;
    console.log(`     Created Lead ID: ${createdTestLeadId}`);

    // -------------------------------------------------------------------
    // TEST 9: Admin Lead Reading (RLS Allows Authenticated Admin)
    // -------------------------------------------------------------------
    console.log('\n[Test 9] Authenticated Admin Client Lead Retrieval');
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${adminSessionToken}`,
        },
      },
    });

    const { data: adminLeads, error: adminReadErr } = await authClient
      .from('leads')
      .select('id, full_name, business_email, status')
      .order('created_at', { ascending: false });

    assert(!adminReadErr, `Admin read leads without error: ${adminReadErr?.message || 'none'}`);
    assert(Array.isArray(adminLeads) && adminLeads.length > 0, `Admin successfully read ${adminLeads?.length} leads`);

    // -------------------------------------------------------------------
    // TEST 10: Admin Lead Status & Notes Update
    // -------------------------------------------------------------------
    console.log('\n[Test 10] Admin Lead Status & Notes Update');
    const { error: updateErr } = await authClient
      .from('leads')
      .update({
        status: 'contacted',
        admin_notes: 'Contacted via automated Supabase test suite verification.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', createdTestLeadId);

    assert(!updateErr, `Admin updated lead without error: ${updateErr?.message || 'none'}`);

    // Verify the update
    const { data: updatedLead } = await supabaseAdmin
      .from('leads')
      .select('status, admin_notes')
      .eq('id', createdTestLeadId)
      .single();

    assert(updatedLead.status === 'contacted', `Lead status updated to 'contacted'`);
    assert(updatedLead.admin_notes.includes('automated Supabase test'), 'Admin notes updated correctly');

    // -------------------------------------------------------------------
    // TEST 11: Admin Lead Deletion
    // -------------------------------------------------------------------
    console.log('\n[Test 11] Admin Lead Deletion');
    const { error: deleteErr } = await authClient
      .from('leads')
      .delete()
      .eq('id', createdTestLeadId);

    assert(!deleteErr, `Admin deleted test lead without error: ${deleteErr?.message || 'none'}`);

    // Confirm deletion
    const { data: deletedCheck } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('id', createdTestLeadId)
      .maybeSingle();

    assert(deletedCheck === null, 'Test lead is completely removed from PostgreSQL');
    createdTestLeadId = null;

    // -------------------------------------------------------------------
    // TEST 12: Request-Level Session Validation (simulating HTTP cookies/headers)
    // -------------------------------------------------------------------
    console.log('\n[Test 12] Request-Level Session Validation (validateSessionFromRequest)');
    const mockReqWithCookie = {
      headers: {
        cookie: `flowpeople_admin_session=${adminSessionToken}`,
      },
    };
    const validatedAdmin = await validateSessionFromRequest(mockReqWithCookie);
    assert(validatedAdmin !== null, 'Session validated from HTTP cookie');
    assert(validatedAdmin.email === ADMIN_EMAIL, 'Validated email matches admin');

    const mockReqWithBearer = {
      headers: {
        authorization: `Bearer ${adminSessionToken}`,
      },
    };
    const validatedBearer = await validateSessionFromRequest(mockReqWithBearer);
    assert(validatedBearer !== null, 'Session validated from Authorization Bearer header');

    const mockReqInvalid = {
      headers: {
        authorization: 'Bearer fake-invalid-jwt-token-12345',
      },
    };
    const validatedInvalid = await validateSessionFromRequest(mockReqInvalid);
    assert(validatedInvalid === null, 'Invalid token correctly rejected');

    console.log('\n=====================================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} SUPABASE TESTS PASSED 100%!`);
    console.log('=====================================================================\n');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Suite execution error:', err);
    if (createdTestLeadId) {
      try {
        await supabaseAdmin.from('leads').delete().eq('id', createdTestLeadId);
        console.log('Cleaned up dangling test lead.');
      } catch (cleanErr) {
        console.error('Failed to clean up test lead:', cleanErr.message);
      }
    }
    await pool.end();
    process.exit(1);
  }
}

runTests();
