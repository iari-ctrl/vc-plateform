import './env.js';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from './env.js';
import { prisma } from './db.js';

const COOKIE = 'vcpx_token';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, ENV.JWT_SECRET, { expiresIn: '30d' });
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

/** Attaches req.user if a valid token exists. Never blocks (guest-friendly). */
export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE];
  if (token) {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUser;
      // Confirm the user still exists.
      const u = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (u) req.user = { id: u.id, email: u.email, name: u.name, role: u.role };
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
