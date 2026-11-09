import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { handleApiRequest } from './apiRouter.js';
import { checkMongoHealth } from './mongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const port = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // Handle static assets from dist
  if (fs.existsSync(distDir)) {
    let filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);

    // If no extension, try looking for .html
    if (!path.extname(filePath) && fs.existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      return fs.createReadStream(filePath).pipe(res);
    }

    // SPA fallback
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(port, async () => {
  console.log(`🚀 FlowPeople server running at http://localhost:${port}`);
  const health = await checkMongoHealth();
  if (health.connected) {
    console.log(`✓ Connected to MongoDB Atlas [${health.database}] on ${health.cluster}`);
  } else {
    console.warn(`⚠️ MongoDB Atlas connection warning:`, health.error);
  }
});

