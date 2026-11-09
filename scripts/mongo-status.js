import { getDb, checkMongoHealth, closeMongoClient } from '../server/mongo.js';

async function status() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 MongoDB Atlas Cluster Status Inspector');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const health = await checkMongoHealth();
  console.log('Cluster:', health.cluster);
  console.log('Connected:', health.connected ? '✓ Yes' : '❌ No');

  if (!health.connected) {
    console.error('Error:', health.error);
    process.exit(1);
  }

  console.log('Database:', health.database);
  console.log('Collections:', health.collections.join(', ') || 'None');

  const db = await getDb();
  if (health.collections.includes('leads')) {
    const leadsCol = db.collection('leads');
    const totalLeads = await leadsCol.countDocuments();
    const indexes = await leadsCol.indexes();
    console.log(`\nCollection 'leads':`);
    console.log(`  - Document Count: ${totalLeads}`);
    console.log(`  - Indexes (${indexes.length}):`);
    indexes.forEach((idx) => console.log(`      • ${idx.name} (${JSON.stringify(idx.key)})`));

    const latest = await leadsCol
      .find({}, { projection: { full_name: 1, company_name: 1, created_at: 1, status: 1 } })
      .sort({ created_at: -1 })
      .limit(3)
      .toArray();

    if (latest.length > 0) {
      console.log('\n  - Latest 3 Leads:');
      latest.forEach((l) => console.log(`      • [${l.status}] ${l.full_name} (${l.company_name}) - ${l.created_at}`));
    }
  }

  await closeMongoClient();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

status().catch((e) => {
  console.error(e);
  process.exit(1);
});

