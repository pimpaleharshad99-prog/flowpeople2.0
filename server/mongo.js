// server/mongo.js
import dns from 'node:dns';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Fix local ISP DNS resolution issues with MongoDB Atlas SRV records
// ONLY run in local development or Windows, never in Vercel/AWS Linux serverless
if (process.platform === 'win32' || process.env.NODE_ENV === 'development') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Ignore if not permitted in current runtime
  }
}

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://hqfluxora_db_user:dU6T6ZkddR2K1jh4@cluster0.la6tjpd.mongodb.net/flowpeople?retryWrites=true&w=majority&appName=Cluster0';

const dbName = process.env.MONGODB_DB_NAME || 'flowpeople';

const mongoOptions = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  maxPoolSize: 10,
  tls: true,
};

// Global connection caching for serverless environments (Vercel)
export async function getMongoClient() {
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, mongoOptions);
    globalThis._mongoClientPromise = client.connect().catch((err) => {
      // Clear cached promise on rejection so subsequent serverless requests can retry
      globalThis._mongoClientPromise = null;
      throw err;
    });
  }
  return globalThis._mongoClientPromise;
}

export async function getDb(databaseName = dbName) {
  const connectedClient = await getMongoClient();
  return connectedClient.db(databaseName);
}

export async function getLeadsCollection() {
  const db = await getDb();
  return db.collection('leads');
}

export async function checkMongoHealth() {
  try {
    const db = await getDb();
    const pingResult = await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    return {
      connected: pingResult.ok === 1,
      database: dbName,
      cluster: 'cluster0.la6tjpd.mongodb.net',
      collections: collections.map((c) => c.name),
    };
  } catch (error) {
    let errorMsg = error.message;
    if (errorMsg.includes('SSL alert number 80') || errorMsg.includes('ssl3_read_bytes') || errorMsg.includes('tlsv1 alert')) {
      errorMsg = 'MongoDB Atlas blocked connection: IP not whitelisted. Please add 0.0.0.0/0 to Atlas Network Access.';
    }
    return {
      connected: false,
      error: errorMsg,
    };
  }
}
