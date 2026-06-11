import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';

export const meRouter = Router();
meRouter.use(requireAuth);

// ── Profile & onboarding ──────────────────────────────────────────────────
meRouter.get('/profile', async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { userId: req.user!.id } });
  res.json(profile ? { profileType: profile.profileType, timeBudget: profile.timeBudget, scores: parseJson(profile.scores) } : null);
});

const profileBody = z.object({
  profileType: z.string().min(1),
  timeBudget: z.string().optional(),
  scores: z.record(z.number()).optional(),
  answers: z.array(z.object({ questionN: z.string(), optionIndex: z.number().int() })).optional(),
});

meRouter.put('/profile', async (req, res) => {
  const parsed = profileBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Données invalides.' });
  const { profileType, timeBudget, scores, answers } = parsed.data;
  const userId = req.user!.id;

  const profile = await prisma.profile.upsert({
    where: { userId },
    update: { profileType, timeBudget, scores: scores ? JSON.stringify(scores) : undefined },
    create: { userId, profileType, timeBudget, scores: scores ? JSON.stringify(scores) : undefined },
  });

  if (answers?.length) {
    await prisma.onboardingAnswer.deleteMany({ where: { userId } });
    await prisma.onboardingAnswer.createMany({
      data: answers.map((a) => ({ userId, questionN: a.questionN, optionIndex: a.optionIndex })),
    });
  }
  res.json({ profileType: profile.profileType, timeBudget: profile.timeBudget, scores: parseJson(profile.scores) });
});

// ── Notes ──────────────────────────────────────────────────────────────────
meRouter.get('/notes', async (req, res) => {
  const notes = await prisma.note.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json(notes);
});

const noteBody = z.object({
  kind: z.enum(['note', 'quote', 'highlight']).default('note'),
  body: z.string().min(1, 'Note vide.'),
  sourceType: z.string().optional(),
  sourceId: z.string().optional(),
  sourceTitle: z.string().optional(),
});

meRouter.post('/notes', async (req, res) => {
  const parsed = noteBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Données invalides.' });
  const note = await prisma.note.create({ data: { ...parsed.data, userId: req.user!.id } });
  res.status(201).json(note);
});

meRouter.delete('/notes/:id', async (req, res) => {
  await prisma.note.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  res.json({ ok: true });
});

// ── Bookmarks ────────────────────────────────────────────────────────────
meRouter.get('/bookmarks', async (req, res) => {
  const bookmarks = await prisma.bookmark.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json(bookmarks);
});

const bookmarkBody = z.object({
  itemType: z.string().min(1),
  itemId: z.string().min(1),
  title: z.string().min(1),
  href: z.string().min(1),
});

meRouter.post('/bookmarks', async (req, res) => {
  const parsed = bookmarkBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Données invalides.' });
  const { itemType, itemId, title, href } = parsed.data;
  const userId = req.user!.id;
  const bookmark = await prisma.bookmark.upsert({
    where: { userId_itemType_itemId: { userId, itemType, itemId } },
    update: { title, href },
    create: { userId, itemType, itemId, title, href },
  });
  res.status(201).json(bookmark);
});

meRouter.delete('/bookmarks/:itemType/:itemId', async (req, res) => {
  await prisma.bookmark.deleteMany({ where: { userId: req.user!.id, itemType: req.params.itemType, itemId: req.params.itemId } });
  res.json({ ok: true });
});

// ── Progress ───────────────────────────────────────────────────────────────
meRouter.get('/progress', async (req, res) => {
  const progress = await prisma.progress.findMany({ where: { userId: req.user!.id } });
  res.json(progress);
});

const progressBody = z.object({
  lessonId: z.string().min(1),
  courseId: z.string().optional(),
  pathId: z.string().optional(),
  status: z.enum(['reading', 'done']).default('reading'),
  percent: z.number().int().min(0).max(100).default(0),
});

meRouter.put('/progress', async (req, res) => {
  const parsed = progressBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Données invalides.' });
  const { lessonId, courseId, pathId, status, percent } = parsed.data;
  const userId = req.user!.id;
  const row = await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { status, percent, courseId, pathId },
    create: { userId, lessonId, courseId, pathId, status, percent },
  });
  res.json(row);
});

function parseJson(s: string | null) {
  return s ? JSON.parse(s) : null;
}
