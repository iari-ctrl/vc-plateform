import './lib/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './lib/env.js';
import { attachUser } from './lib/auth.js';
import { authRouter } from './routes/auth.js';
import { contentRouter } from './routes/content.js';
import { meRouter } from './routes/me.js';
import { adminRouter } from './routes/admin.js';
import { searchRouter } from './routes/search.js';

// The Express app is built here (no `listen`) so it can be imported directly by
// integration tests. `index.ts` owns the production safeguards and `listen`.
export const app = express();

// Secure Express headers (allow cross-origin resource policy for the client)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// General limiter for all auth endpoints (covers /me polling, /logout…).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes ou tentatives de connexion. Veuillez réessayer dans 15 minutes.' },
});

// Stricter limiter for the credential endpoints (login/register) to slow down
// brute-force & credential-stuffing without throttling routine /me checks.
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login/register attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' },
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de recherches. Veuillez réessayer dans quelques instants.' },
});

// Allow the configured client origin. Any-localhost-port is permitted ONLY in
// development — in production the regex would let any localhost-origin browser
// session through, so it is gated behind NODE_ENV.
const isDev = ENV.NODE_ENV !== 'production';
const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed =
        !origin || // same-origin / curl / server-to-server (no Origin header)
        origin === ENV.CLIENT_ORIGIN ||
        (isDev && LOCALHOST_ORIGIN.test(origin));
      cb(null, allowed);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'vcpx-api', time: new Date().toISOString() }));

app.use('/api/auth/login', credentialLimiter);
app.use('/api/auth/register', credentialLimiter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/content', contentRouter);
app.use('/api/me', attachUser, meRouter);
app.use('/api/admin', attachUser, adminRouter);
app.use('/api/search', searchLimiter, searchRouter);

// Fallback for unknown API routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint introuvable.' }));

// Centralised error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[api error]', err);
  res.status(500).json({ error: 'Erreur serveur inattendue.' });
});
