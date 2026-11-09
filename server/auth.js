import crypto from 'node:crypto';
import { getDb } from './mongo.js';

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = 'sha512';

/**
 * Hash a plain text password with a random salt
 */
export function hashPassword(password, existingSalt = null) {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return { hash, salt };
}

/**
 * Verify a plain text password against stored hash and salt
 */
export function verifyPassword(password, storedHash, storedSalt) {
  const { hash } = hashPassword(password, storedSalt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Generate a cryptographically secure session token
 */
export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Find admin user by email
 */
export async function getAdminByEmail(email) {
  const db = await getDb();
  return db.collection('admins').findOne({ email: email.trim().toLowerCase() });
}

/**
 * Create or verify an active session
 */
export async function createSession(adminId, email) {
  const db = await getDb();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.collection('admin_sessions').insertOne({
    token,
    admin_id: adminId,
    email,
    created_at: new Date().toISOString(),
    expires_at: expiresAt,
  });

  return { token, expiresAt };
}

/**
 * Validate a session token against MongoDB Atlas
 */
export async function validateSession(token) {
  if (!token) return null;
  const db = await getDb();
  const session = await db.collection('admin_sessions').findOne({
    token,
    expires_at: { $gt: new Date() },
  });

  if (!session) return null;

  const admin = await db.collection('admins').findOne(
    { email: session.email },
    { projection: { password_hash: 0, password_salt: 0 } }
  );

  return admin;
}

/**
 * Invalidate a session token
 */
export async function destroySession(token) {
  if (!token) return;
  const db = await getDb();
  await db.collection('admin_sessions').deleteOne({ token });
}

