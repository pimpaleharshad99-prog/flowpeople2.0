import { getDb, checkMongoHealth, closeMongoClient } from '../server/mongo.js';
import { hashPassword } from '../server/auth.js';

/**
 * FlowPeople AI Agent MongoDB Migration Runner
 * Ensures Atlas collections, indexes, and master authentication records are provisioned.
 */
async function runMigration() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 FlowPeople AI Agent MongoDB Migration Runner');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const health = await checkMongoHealth();
  if (!health.connected) {
    console.error('❌ Failed to connect to MongoDB Atlas:', health.error);
    process.exit(1);
  }

  console.log('✓ Successfully connected to Atlas Cluster:', health.cluster);
  console.log('✓ Target Database:', health.database);

  const db = await getDb();
  const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

  // 1. Ensure 'migrations' tracking collection
  if (!existingCollections.includes('migrations')) {
    await db.createCollection('migrations');
    console.log('✓ Created tracking collection: "migrations"');
  }

  // 2. Ensure 'admins' collection and indexes
  if (!existingCollections.includes('admins')) {
    await db.createCollection('admins');
    console.log('✓ Created collection: "admins"');
  }

  const adminsCol = db.collection('admins');
  await adminsCol.createIndex({ email: 1 }, { unique: true, name: 'idx_admins_email_unique' });
  console.log('  ✓ Index on "admins": email (unique)');

  // Provision Master Admin User: pimpaleg80@gmail.com / Harsh@9970
  const masterEmail = 'pimpaleg80@gmail.com';
  const masterPass = 'Harsh@9970';
  const { hash, salt } = hashPassword(masterPass);

  await adminsCol.updateOne(
    { email: masterEmail },
    {
      $set: {
        id: 'admin_master_01',
        email: masterEmail,
        name: 'Harsh Pimpale (Admin)',
        password_hash: hash,
        password_salt: salt,
        role: 'superadmin',
        status: 'active',
        updated_at: new Date().toISOString(),
      },
      $setOnInsert: {
        created_at: new Date().toISOString(),
      },
    },
    { upsert: true }
  );
  console.log(`✓ Master Admin Account Provisioned: ${masterEmail} (role: superadmin)`);

  // 3. Ensure 'admin_sessions' collection with TTL index
  if (!existingCollections.includes('admin_sessions')) {
    await db.createCollection('admin_sessions');
    console.log('✓ Created collection: "admin_sessions"');
  }

  const sessionsCol = db.collection('admin_sessions');
  await sessionsCol.createIndex({ token: 1 }, { unique: true, name: 'idx_sessions_token_unique' });
  await sessionsCol.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0, name: 'idx_sessions_ttl' });
  console.log('  ✓ Indexes on "admin_sessions": token (unique) & expires_at (TTL auto-cleanup)');

  // 4. Ensure 'leads' collection with performance indexes
  if (!existingCollections.includes('leads')) {
    await db.createCollection('leads');
    console.log('✓ Created primary collection: "leads"');
  }

  const leadsCol = db.collection('leads');
  console.log('\nBuilding and verifying indexes on "leads"...');
  await leadsCol.createIndex({ id: 1 }, { unique: true, name: 'idx_leads_id_unique' });
  await leadsCol.createIndex({ created_at: -1 }, { name: 'idx_leads_created_at_desc' });
  await leadsCol.createIndex({ status: 1 }, { name: 'idx_leads_status' });
  await leadsCol.createIndex({ status: 1, created_at: -1 }, { name: 'idx_leads_status_created_at' });
  await leadsCol.createIndex({ business_email: 1 }, { name: 'idx_leads_email' });
  await leadsCol.createIndex(
    { full_name: 'text', company_name: 'text', message: 'text' },
    { name: 'idx_leads_fulltext_search' }
  );
  console.log('  ✓ 6 Indexes verified on "leads"');

  // 5. Ensure 'system_meta' collection for cluster telemetry
  if (!existingCollections.includes('system_meta')) {
    await db.createCollection('system_meta');
  }

  await db.collection('system_meta').updateOne(
    { key: 'cluster_info' },
    {
      $set: {
        key: 'cluster_info',
        product: 'FlowPeople by Fluxora',
        platform: 'MongoDB Atlas',
        cluster: 'cluster0.la6tjpd.mongodb.net',
        database: health.database,
        collections: ['admins', 'admin_sessions', 'leads', 'migrations', 'system_meta'],
        last_migrated_at: new Date().toISOString(),
        migrated_by: 'Antigravity AI Agent',
        status: 'active',
      },
    },
    { upsert: true }
  );

  // Record migration history
  const migrationRecord = {
    migration_id: `mig_${Date.now()}`,
    name: '002_admin_auth_and_sessions_schema',
    applied_at: new Date().toISOString(),
    agent: 'Antigravity AI Agent',
    details: 'Provisioned admins and admin_sessions collections, master credentials, and TTL indexing.',
  };
  await db.collection('migrations').insertOne(migrationRecord);

  const leadsCount = await leadsCol.countDocuments();
  const adminsCount = await adminsCol.countDocuments();
  console.log(`\n✓ Active leads in database: ${leadsCount}`);
  console.log(`✓ Active admins in database: ${adminsCount}`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ MongoDB Atlas Auth & Schema Migration Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await closeMongoClient();
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
