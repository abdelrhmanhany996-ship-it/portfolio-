import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DEFAULT_CONTENT } from './src/data/portfolioData';

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';
const ROOT = process.cwd();
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (isProd ? '' : 'admin');
const SECRET = process.env.SESSION_SECRET || ADMIN_PASSWORD;
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

// ---------- storage helpers ----------
async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file);
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// ---------- auth ----------
const tokenFor = (password: string) =>
  crypto.createHmac('sha256', SECRET).update(`admin:${password}`).digest('hex');

const safeEqual = (a: string, b: string) => {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!ADMIN_PASSWORD || !token || !safeEqual(token, tokenFor(ADMIN_PASSWORD))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Naive in-memory rate limiter: `limit` hits per `windowMs` per IP.
function rateLimit(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) return res.status(429).json({ error: 'Too many requests, try again later.' });
    recent.push(now);
    hits.set(key, recent);
    next();
  };
}

const isValidContent = (c: any) =>
  c &&
  typeof c === 'object' &&
  c.profile && typeof c.profile === 'object' &&
  Array.isArray(c.projects) &&
  Array.isArray(c.services) &&
  Array.isArray(c.categories) &&
  c.settings && typeof c.settings === 'object';

// ---------- app ----------
async function main() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  if (!ADMIN_PASSWORD) console.warn('⚠ ADMIN_PASSWORD is not set — dashboard login is disabled.');
  else if (!process.env.ADMIN_PASSWORD) console.warn('⚠ Using default dev password "admin". Set ADMIN_PASSWORD.');

  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '30mb' }));

  const apiRouter = express.Router();

  apiRouter.get('/content', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await readJson(CONTENT_FILE, DEFAULT_CONTENT));
  });

  apiRouter.put('/content', requireAdmin, async (req, res) => {
    if (!isValidContent(req.body)) return res.status(400).json({ error: 'Invalid content payload' });
    await writeJson(CONTENT_FILE, req.body);
    res.json(req.body);
  });

  apiRouter.post('/login', rateLimit(10, 15 * 60_000), (req, res) => {
    if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'ADMIN_PASSWORD is not configured on the server' });
    const password = String(req.body?.password || '');
    if (!safeEqual(tokenFor(password), tokenFor(ADMIN_PASSWORD))) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    res.json({ token: tokenFor(ADMIN_PASSWORD) });
  });

  apiRouter.get('/session', requireAdmin, (_req, res) => res.json({ ok: true }));

  apiRouter.post('/upload', requireAdmin, async (req, res) => {
    const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(String(req.body?.data || ''));
    const ext = match && IMAGE_TYPES[match[1]];
    if (!match || !ext) return res.status(400).json({ error: 'Only JPG, PNG, WEBP, GIF or AVIF images are allowed' });
    const buf = Buffer.from(match[2], 'base64');
    if (buf.length > 20 * 1024 * 1024) return res.status(413).json({ error: 'Image exceeds 20MB' });
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(5).toString('hex')}.${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
    res.json({ url: `/uploads/${name}` });
  });

  apiRouter.post('/messages', rateLimit(5, 60_000), async (req, res) => {
    const name = String(req.body?.name || '').trim().slice(0, 120);
    const email = String(req.body?.email || '').trim().slice(0, 200);
    const message = String(req.body?.message || '').trim().slice(0, 5000);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
      return res.status(400).json({ error: 'Name, valid email and message are required' });
    }
    const messages = await readJson<Message[]>(MESSAGES_FILE, []);
    messages.unshift({ id: crypto.randomUUID(), name, email, message, createdAt: new Date().toISOString(), read: false });
    await writeJson(MESSAGES_FILE, messages.slice(0, 2000));
    res.status(201).json({ ok: true });
  });

  apiRouter.get('/messages', requireAdmin, async (_req, res) => {
    res.json(await readJson<Message[]>(MESSAGES_FILE, []));
  });

  apiRouter.patch('/messages/:id', requireAdmin, async (req, res) => {
    const messages = await readJson<Message[]>(MESSAGES_FILE, []);
    const msg = messages.find((m) => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: 'Not found' });
    if (typeof req.body?.read === 'boolean') msg.read = req.body.read;
    await writeJson(MESSAGES_FILE, messages);
    res.json(msg);
  });

  apiRouter.delete('/messages/:id', requireAdmin, async (req, res) => {
    const messages = await readJson<Message[]>(MESSAGES_FILE, []);
    await writeJson(MESSAGES_FILE, messages.filter((m) => m.id !== req.params.id));
    res.json({ ok: true });
  });

  app.use('/api', apiRouter);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true }));

  if (isProd) {
    const dist = path.join(ROOT, 'dist');
    app.use(express.static(dist, { index: false }));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready → http://localhost:${PORT}  (dashboard: /#/admin)`);
  });
}

main();
