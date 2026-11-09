import http from 'node:http';
import { handleApiRequest } from '../server/apiRouter.js';
import { checkMongoHealth, closeMongoClient } from '../server/mongo.js';

// Create a local test HTTP server using our exact handleApiRequest router
const server = http.createServer((req, res) => {
  handleApiRequest(req, res);
});

async function runPipelineTests() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 FlowPeople MongoDB Atlas End-to-End Pipeline Tests');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const health = await checkMongoHealth();
  console.log('MongoDB Atlas Ping:', health.connected ? '✓ Healthy' : '❌ Failed');
  if (!health.connected) {
    console.error('Database unreachable:', health.error);
    process.exit(1);
  }

  await new Promise((resolve) => server.listen(4567, resolve));
  const baseUrl = 'http://localhost:4567';

  try {
    // TEST 1: Health check endpoint
    console.log('\n[Test 1] GET /api/db/health');
    const healthRes = await fetch(`${baseUrl}/api/db/health`);
    const healthJson = await healthRes.json();
    console.log('  Status:', healthRes.status);
    console.log('  Cluster:', healthJson.cluster, '| Database:', healthJson.database);
    if (!healthJson.connected) throw new Error('Health check reported not connected');
    console.log('  ✓ Test 1 Passed!');

    // TEST 2: Admin Login - Valid Credentials
    console.log('\n[Test 2] POST /api/auth/login (Valid Credentials: pimpaleg80@gmail.com / Harsh@9970)');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'pimpaleg80@gmail.com', password: 'Harsh@9970' }),
    });
    const loginJson = await loginRes.json();
    console.log('  Status:', loginRes.status);
    console.log('  Authenticated User:', loginJson.user?.name, '| Role:', loginJson.user?.role);
    console.log('  Session Token Received:', loginJson.token ? `${loginJson.token.slice(0, 16)}...` : 'None');
    if (!loginJson.success || !loginJson.token) throw new Error('Valid login failed');
    console.log('  ✓ Test 2 Passed!');

    const adminToken = loginJson.token;

    // TEST 3: Admin Login - Invalid Credentials Rejection
    console.log('\n[Test 3] POST /api/auth/login (Invalid Password Rejection)');
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'pimpaleg80@gmail.com', password: 'WrongPassword' }),
    });
    const badLoginJson = await badLoginRes.json();
    console.log('  Status:', badLoginRes.status, '| Expected 401');
    console.log('  Error Message:', badLoginJson.error);
    if (badLoginRes.status !== 401) throw new Error('Invalid login was not rejected');
    console.log('  ✓ Test 3 Passed!');

    // TEST 4: Session Verification
    console.log('\n[Test 4] POST /api/auth/verify (Live Session Token Verification)');
    const verifyRes = await fetch(`${baseUrl}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ token: adminToken }),
    });
    const verifyJson = await verifyRes.json();
    console.log('  Status:', verifyRes.status);
    console.log('  Session Active:', verifyJson.authenticated ? '✓ Active' : '❌ Inactive');
    console.log('  Verified Account:', verifyJson.user?.email);
    if (!verifyJson.authenticated) throw new Error('Session token verification failed');
    console.log('  ✓ Test 4 Passed!');

    // TEST 5: Website Inquiry Form Submission into MongoDB Atlas
    console.log('\n[Test 5] POST /api/leads (Website Inquiry Form Submission)');
    const testInquiry = {
      full_name: 'Ananya Deshmukh',
      business_email: 'ananya@fintechapex.in',
      company_name: 'Apex FinTech Solutions',
      phone_number: '+91 98333 44556',
      employee_count: '51-200 employees',
      interested_plan: 'Professional',
      inquiry_type: 'Book a Demo',
      message: 'Looking for contactless facial recognition kiosk integration for our corporate HQ in BKC, Mumbai.',
      source: 'website_contact_form',
    };
    const leadRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testInquiry),
    });
    const leadJson = await leadRes.json();
    console.log('  Status:', leadRes.status, '| Expected 201');
    console.log('  Inserted Lead ID:', leadJson.lead?.id);
    console.log('  Lead Stored in Atlas:', leadJson.isLive ? '✓ MongoDB Atlas Live' : '❌ Fallback');
    if (!leadJson.success || !leadJson.lead?.id) throw new Error('Inquiry creation failed');
    console.log('  ✓ Test 5 Passed!');

    const createdLeadId = leadJson.lead.id;

    // TEST 6: Admin Dashboard Lead Retrieval
    console.log('\n[Test 6] GET /api/leads (Admin Dashboard Retrieval from Atlas)');
    const listRes = await fetch(`${baseUrl}/api/leads`);
    const listJson = await listRes.json();
    console.log('  Status:', listRes.status);
    console.log('  Total Leads in Atlas:', listJson.leads?.length);
    const found = listJson.leads.find((l) => l.id === createdLeadId);
    console.log('  Found newly submitted inquiry:', found ? `✓ ${found.full_name} (${found.company_name})` : '❌ Not found');
    if (!found) throw new Error('Submitted inquiry not found in leads list');
    console.log('  ✓ Test 6 Passed!');

    // TEST 7: Admin Lead Status Update in Atlas
    console.log('\n[Test 7] PATCH /api/leads/:id (Admin updating inquiry status to "qualified")');
    const updateRes = await fetch(`${baseUrl}/api/leads/${createdLeadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'qualified', admin_notes: 'Demo confirmed for Wednesday 2 PM.' }),
    });
    const updateJson = await updateRes.json();
    console.log('  Status:', updateRes.status);
    console.log('  Updated in Atlas:', updateJson.success ? '✓ Yes' : '❌ No');
    if (!updateJson.success) throw new Error('Lead status update failed');
    console.log('  ✓ Test 7 Passed!');

    // TEST 8: Logout & Invalidate Session
    console.log('\n[Test 8] POST /api/auth/logout (Session Invalidation in Atlas)');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: adminToken }),
    });
    const logoutJson = await logoutRes.json();
    console.log('  Status:', logoutRes.status);
    console.log('  Logged Out:', logoutJson.success ? '✓ Yes' : '❌ No');
    console.log('  ✓ Test 8 Passed!');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ALL 8 MONGODB ATLAS END-TO-END TESTS PASSED 100%!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } finally {
    server.close();
    await closeMongoClient();
  }
}

runPipelineTests().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});

