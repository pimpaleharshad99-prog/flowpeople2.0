import dns from 'node:dns';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Fix Windows / local ISP DNS resolution issues with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted in current runtime
}

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://hqfluxora_db_user:dU6T6ZkddR2K1jh4@cluster0.la6tjpd.mongodb.net/flowpeople?retryWrites=true&w=majority&appName=Cluster0';

const dbName = process.env.MONGODB_DB_NAME || 'flowpeople';

let client = null;
let clientPromise = null;

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 25000,
      connectTimeoutMS: 25000,
      maxPoolSize: 10,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
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
    return {
      connected: false,
      error: error.message,
      cluster: 'cluster0.la6tjpd.mongodb.net',
    };
  }
}

export async function closeMongoClient() {
  if (client) {
    await client.close();
    client = null;
    clientPromise = null;
  }
}

