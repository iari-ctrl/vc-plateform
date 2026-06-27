import { execFile } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { requireAdmin } from '../lib/auth.js';
import { buildSearchText } from '../lib/content.js';
import { ah } from '../lib/async-handler.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

// server/{src,dist}/routes/admin.* → repo root (../../..)
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

// ── Dashboard stats ─────────────────────────────────────────────────────
adminRouter.get('/stats', ah(async (_req, res) => {
  const [paths, courses, lessons, glossary, cases, blog, simulators, users, notes] = await Promise.all([
    prisma.learningPath.count(), prisma.course.count(), prisma.lesson.count(),
    prisma.glossaryTerm.count(), prisma.caseStudy.count(), prisma.blogPost.count(),
    prisma.simulator.count(), prisma.user.count(), prisma.note.count(),
  ]);
  res.json({ paths, courses, lessons, glossary, cases, blog, simulators, users, notes });
}));

// ── Glossary CRUD ─────────────────────────────────────────────────────────
const glossarySchema = z.object({
  term: z.string().min(1),
  slug: z.string().optional(),
  latin: z.string().optional(),
  category: z.string().min(1),
  short: z.string().min(1),
  definition: z.string().min(1),
  example: z.string().optional(),
  seeAlso: z.array(z.string()).default([]),
  relatedLessonIds: z.array(z.string()).default([]),
});

adminRouter.get('/glossary', ah(async (_req, res) => {
  const rows = await prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' } });
  res.json(rows.map((r) => JSON.parse(r.data)));
}));

adminRouter.post('/glossary', ah(async (req, res) => {
  const parsed = glossarySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });
  const slug = parsed.data.slug || slugify(parsed.data.term);
  const id = slug;
  const obj = { id, ...parsed.data, slug };
  const searchText = buildSearchText([obj.term, obj.latin, obj.short, obj.definition, obj.example].filter(Boolean).join(' '));
  try {
    const row = await prisma.glossaryTerm.create({ data: { id, slug, term: obj.term, category: obj.category, searchText, data: JSON.stringify(obj) } });
    res.status(201).json(JSON.parse(row.data));
  } catch {
    res.status(409).json({ error: 'Un terme avec ce slug existe déjà.' });
  }
}));

adminRouter.put('/glossary/:id', ah(async (req, res) => {
  const parsed = glossarySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });
  const existing = await prisma.glossaryTerm.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Terme introuvable.' });
  const slug = parsed.data.slug || existing.slug;
  const obj = { id: existing.id, ...parsed.data, slug };
  const searchText = buildSearchText([obj.term, obj.latin, obj.short, obj.definition, obj.example].filter(Boolean).join(' '));
  const row = await prisma.glossaryTerm.update({ where: { id: existing.id }, data: { slug, term: obj.term, category: obj.category, searchText, data: JSON.stringify(obj) } });
  res.json(JSON.parse(row.data));
}));

adminRouter.delete('/glossary/:id', ah(async (req, res) => {
  await prisma.glossaryTerm.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
}));

// ── Blog CRUD ──────────────────────────────────────────────────────────────
const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  subtitle: z.string().default(''),
  author: z.string().default('L\'équipe VC Premium'),
  date: z.string().default(new Date().toISOString().slice(0, 10)),
  readMin: z.number().int().min(1).default(5),
  category: z.string().default('Réflexion'),
  excerpt: z.string().min(1),
  tags: z.array(z.string()).default([]),
  body: z.string().min(1),
});

adminRouter.get('/blog', ah(async (_req, res) => {
  const rows = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
  res.json(rows.map((r) => JSON.parse(r.data)));
}));

adminRouter.post('/blog', ah(async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });
  const slug = parsed.data.slug || slugify(parsed.data.title);
  const id = `bp-${slug}`.slice(0, 60);
  const obj = { id, ...parsed.data, slug };
  const searchText = buildSearchText([obj.title, obj.subtitle, obj.excerpt, obj.body].join(' '));
  try {
    const row = await prisma.blogPost.create({ data: { id, slug, title: obj.title, category: obj.category, date: obj.date, searchText, data: JSON.stringify(obj) } });
    res.status(201).json(JSON.parse(row.data));
  } catch {
    res.status(409).json({ error: 'Un article avec ce slug existe déjà.' });
  }
}));

adminRouter.put('/blog/:id', ah(async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });
  const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Article introuvable.' });
  const slug = parsed.data.slug || existing.slug;
  const obj = { id: existing.id, ...parsed.data, slug };
  const searchText = buildSearchText([obj.title, obj.subtitle, obj.excerpt, obj.body].join(' '));
  const row = await prisma.blogPost.update({ where: { id: existing.id }, data: { slug, title: obj.title, category: obj.category, date: obj.date, searchText, data: JSON.stringify(obj) } });
  res.json(JSON.parse(row.data));
}));

adminRouter.delete('/blog/:id', ah(async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
}));

// ── Case studies (list + update data) ───────────────────────────────────────
adminRouter.get('/case-studies', ah(async (_req, res) => {
  const rows = await prisma.caseStudy.findMany({ orderBy: { title: 'asc' } });
  res.json(rows.map((r) => JSON.parse(r.data)));
}));

const caseSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(''),
  kind: z.string().default('startup'),
  company: z.string().default(''),
  year: z.number().int().default(new Date().getFullYear()),
  readMin: z.number().int().default(8),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  glossaryRefs: z.array(z.string()).default([]),
  sections: z.array(z.object({ heading: z.string(), body: z.string() })).default([]),
  takeaways: z.array(z.string()).default([]),
});

adminRouter.put('/case-studies/:id', ah(async (req, res) => {
  const parsed = caseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });
  const existing = await prisma.caseStudy.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Étude de cas introuvable.' });
  const obj = { id: existing.id, slug: existing.slug, ...parsed.data };
  const searchText = buildSearchText([obj.title, obj.subtitle, obj.summary, ...obj.sections.map((s) => s.heading + ' ' + s.body)].join(' '));
  const row = await prisma.caseStudy.update({ where: { id: existing.id }, data: { title: obj.title, kind: obj.kind, searchText, data: JSON.stringify(obj) } });
  res.json(JSON.parse(row.data));
}));

// ── Export : DB éditable → JSON canonique ────────────────────────────────────
// Ferme la boucle d'édition. La DB n'est qu'un cache d'édition ; les JSON
// sources de data/ sont l'unique source canonique. Cet endpoint exécute le MÊME
// script que `npm run content:export` (aucune logique dupliquée) contre la DB en cours,
// puis renvoie le diff git de data/ pour relecture avant commit.
// `?dryRun=1` (ou body { dryRun: true }) n'écrit rien et signale le drift.
const execFileP = promisify(execFile);
const EXPORTED_FILES = ['data/glossary.json', 'data/caseStudies.json', 'data/blog'];

const runCmd = async (cmd: string, args: string[]) => {
  try {
    const { stdout, stderr } = await execFileP(cmd, args, { cwd: repoRoot, maxBuffer: 32 * 1024 * 1024 });
    return { code: 0, stdout, stderr };
  } catch (err) {
    const e = err as { code?: number; stdout?: string; stderr?: string };
    return { code: e.code ?? 1, stdout: e.stdout ?? '', stderr: e.stderr ?? String(err) };
  }
};

adminRouter.post('/export', ah(async (req, res) => {
  const dryRun = req.query.dryRun === '1' || req.body?.dryRun === true;
  const script = resolve(repoRoot, 'scripts/export-content.mjs');
  const exp = await runCmd(process.execPath, [script, ...(dryRun ? ['--dry-run'] : [])]);
  const diff = await runCmd('git', ['diff', '--', ...EXPORTED_FILES]);
  const changed = diff.stdout.trim().length > 0 || (dryRun && exp.code !== 0);
  res.json({
    ok: dryRun ? true : exp.code === 0,
    dryRun,
    changed,
    log: `${exp.stdout}${exp.stderr}`.trim(),
    diff: diff.stdout,
  });
}));
