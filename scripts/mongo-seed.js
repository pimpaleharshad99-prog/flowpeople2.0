// scripts/mongo-seed.js
import { getLeadsCollection, checkMongoHealth } from '../server/mongo.js';

const DEMO_EMAILS = [
  'rajesh.sharma@techcorp.in',
  'priya@zenithhr.com',
  'vmehta@logixglobal.com',
  'aakash@omnicreative.co',
  'ananya@fintechapex.in',
];

async function cleanDemoLeads() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧹 FlowPeople Database Cleanup — Purging Demo Leads');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const health = await checkMongoHealth();
  if (!health.connected) {
    console.error('Database connection error:', health.error);
    process.exit(1);
  }

  const col = await getLeadsCollection();
  const filter = {
    $or: [
      { id: { $regex: '^lead_enterprise_' } },
      { id: { $regex: '^test_' } },
      { business_email: { $in: DEMO_EMAILS } },
    ],
  };

  const beforeCount = await col.countDocuments(filter);
  console.log(`Found ${beforeCount} demo/sample leads in database.`);

  const result = await col.deleteMany(filter);
  console.log(`✓ Deleted ${result.deletedCount} demo leads from MongoDB Atlas!`);

  const remainingCount = await col.countDocuments();
  console.log(`Remaining real business inquiries in 'leads': ${remainingCount}`);
  process.exit(0);
}

cleanDemoLeads().catch((err) => {
  console.error('Cleanup error:', err.message);
  process.exit(1);
});
