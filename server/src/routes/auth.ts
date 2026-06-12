import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { attachUser, clearAuthCookie, setAuthCookie, signToken } from '../lib/auth.js';
import { ah } from '../lib/async-handler.js';

export const authRouter = Router();

// Registration enforces a minimum password strength. Login deliberately checks
// only presence (not length) so accounts created under an older, looser rule are
// never locked out by a stricter validator.
const registerSchema = z.object({
  email: z.string().email('Email invalide.'),
  password: z.string().min(8, 'Mot de passe trop court (8 caractères minimum).'),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Email invalide.'),
  password: z.string().min(1, 'Mot de passe requis.'),
});

authRouter.post('/register', ah(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Données invalides.' });
  const { email, password } = parsed.data;
  const name = parsed.data.name?.trim() || email.split('@')[0];

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Un compte existe déjà avec cet email.' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  setAuthCookie(res, token);
  res.status(201).json({ user: publicUser(user) });
}));

authRouter.post('/login', ah(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Données invalides.' });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }
  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  setAuthCookie(res, token);
  res.json({ user: publicUser(user) });
}));

authRouter.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

authRouter.get('/me', attachUser, ah(async (req, res) => {
  if (!req.user) return res.json({ user: null });
  const profile = await prisma.profile.findUnique({ where: { userId: req.user.id } });
  res.json({ user: { ...req.user }, profile: profile ? publicProfile(profile) : null });
}));

function publicUser(u: { id: string; email: string; name: string; role: string }) {
  return { id: u.id, email: u.email, name: u.name, role: u.role };
}
function publicProfile(p: { profileType: string | null; timeBudget: string | null; scores: string | null }) {
  return { profileType: p.profileType, timeBudget: p.timeBudget, scores: p.scores ? JSON.parse(p.scores) : null };
}
