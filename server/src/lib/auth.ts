import './env.js';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from './env.js';
import { prisma } from './db.js';

const COOKIE = 'vcpx_token';
const TOKEN_TTL = '30d';
const REFRESH_WINDOW_SECONDS = 7 * 24 * 60 * 60;
const MIN_JWT_SECRET_LENGTH = 32;
const UNSAFE_JWT_SECRETS = new Set([
  'dev-secret-change-me',
  'change-me',
  'changeme',
  'jwt-secret',
  'jwt_secret',
  'secret',
  'secret-key',
  'secret_key',
  'test-secret',
]);

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

type TokenPayload = AuthUser & jwt.JwtPayload;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, ENV.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: ENV.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE);
}

export function getJwtSecretIssue(secret = ENV.JWT_SECRET, nodeEnv = ENV.NODE_ENV): string | null {
  if (nodeEnv !== 'production') return null;

  const value = secret.trim();
  if (UNSAFE_JWT_SECRETS.has(value.toLowerCase())) {
    return 'JWT_SECRET uses a blocked unsafe value.';
  }
  if (value.length < MIN_JWT_SECRET_LENGTH) {
    return `JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters in production.`;
  }
  return null;
}

export function assertSecureJwtSecret() {
  const issue = getJwtSecretIssue();
  if (issue) throw new Error(issue);
}

export function shouldRefreshToken(payload: jwt.JwtPayload, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  return typeof payload.exp === 'number' && payload.exp - nowSeconds < REFRESH_WINDOW_SECONDS;
}

/** Attaches req.user if a valid token exists. Never blocks (guest-friendly). */
export async function attachUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE];
  if (token) {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
      // Confirm the user still exists.
      const u = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (u) {
        req.user = { id: u.id, email: u.email, name: u.name, role: u.role };
        if (shouldRefreshToken(decoded)) setAuthCookie(res, signToken(req.user));
      }
    } catch {
      /* invalid / expired token — treat as guest */
    }
  }
  next();
}

/** Requires an authenticated user. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise.' });
  next();
}

/** Requires an admin user. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise.' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
  next();
}
