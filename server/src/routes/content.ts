import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { ah } from '../lib/async-handler.js';

export const contentRouter = Router();

const parse = <T>(s: string): T => JSON.parse(s) as T;

// ── Learning paths ──────────────────────────────────────────────────────
contentRouter.get('/paths', ah(async (_req, res) => {
  const rows = await prisma.learningPath.findMany({ where: { id: { startsWith: 'p-' } }, orderBy: { order: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));

contentRouter.get('/paths/:slug', ah(async (req, res) => {
  const path = await prisma.learningPath.findUnique({ where: { slug: req.params.slug } });
  if (!path || !path.id.startsWith('p-')) return res.status(404).json({ error: 'Parcours introuvable.' });
  const courses = await prisma.course.findMany({ where: { pathId: path.id }, orderBy: { order: 'asc' } });
  const courseIds = courses.map((c) => c.id);
  const lessons = await prisma.lesson.findMany({ where: { courseId: { in: courseIds } }, orderBy: { order: 'asc' } });
  const lessonsByCourse = (cid: string) =>
    lessons.filter((l) => l.courseId === cid).map((l) => lessonSummary(parse(l.data)));
  res.json({
    ...parse<Record<string, unknown>>(path.data),
    courses: courses.map((c) => ({ ...parse<Record<string, unknown>>(c.data), lessons: lessonsByCourse(c.id) })),
  });
}));

// ── Courses ─────────────────────────────────────────────────────────────
contentRouter.get('/courses/:slug', ah(async (req, res) => {
  const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
  if (!course) return res.status(404).json({ error: 'Cours introuvable.' });
  const lessons = await prisma.lesson.findMany({ where: { courseId: course.id }, orderBy: { order: 'asc' } });
  const path = await prisma.learningPath.findUnique({ where: { id: course.pathId } });
  res.json({
    ...parse<Record<string, unknown>>(course.data),
    path: path ? parse(path.data) : null,
    lessons: lessons.map((l) => parse(l.data)),
  });
}));

// ── Lessons ─────────────────────────────────────────────────────────────
contentRouter.get('/lessons/:slug', ah(async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });
  if (!lesson) return res.status(404).json({ error: 'Leçon introuvable.' });
  const course = await prisma.course.findUnique({ where: { id: lesson.courseId } });
  const path = course ? await prisma.learningPath.findUnique({ where: { id: course.pathId } }) : null;
  const siblings = await prisma.lesson.findMany({ where: { courseId: lesson.courseId }, orderBy: { order: 'asc' } });
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  res.json({
    ...parse<Record<string, unknown>>(lesson.data),
    course: course ? parse(course.data) : null,
    path: path ? parse(path.data) : null,
    prev: idx > 0 ? lessonSummary(parse(siblings[idx - 1].data)) : null,
    next: idx < siblings.length - 1 ? lessonSummary(parse(siblings[idx + 1].data)) : null,
  });
}));

// ── Glossary ────────────────────────────────────────────────────────────
contentRouter.get('/glossary', ah(async (_req, res) => {
  const rows = await prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));

contentRouter.get('/glossary/:slug', ah(async (req, res) => {
  const term = await prisma.glossaryTerm.findUnique({ where: { slug: req.params.slug } });
  if (!term) return res.status(404).json({ error: 'Terme introuvable.' });
  res.json(parse(term.data));
}));

// ── Case studies ────────────────────────────────────────────────────────
contentRouter.get('/case-studies', ah(async (_req, res) => {
  const rows = await prisma.caseStudy.findMany({ orderBy: { title: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));
contentRouter.get('/case-studies/:slug', ah(async (req, res) => {
  const cs = await prisma.caseStudy.findUnique({ where: { slug: req.params.slug } });
  if (!cs) return res.status(404).json({ error: 'Étude de cas introuvable.' });
  res.json(parse(cs.data));
}));

// ── Blog / research notes ─────────────────────────────────────────────────
contentRouter.get('/blog', ah(async (_req, res) => {
  const rows = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
  res.json(rows.map((r) => parse(r.data)));
}));
contentRouter.get('/blog/:slug', ah(async (req, res) => {
  const b = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  if (!b) return res.status(404).json({ error: 'Article introuvable.' });
  res.json(parse(b.data));
}));

// ── Simulators ────────────────────────────────────────────────────────────
contentRouter.get('/simulators', ah(async (_req, res) => {
  const rows = await prisma.simulator.findMany({ orderBy: { title: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));

// ── Tags ──────────────────────────────────────────────────────────────────
contentRouter.get('/tags', ah(async (_req, res) => {
  const rows = await prisma.tag.findMany({ orderBy: { count: 'desc' } });
  res.json(rows.map((t) => ({ name: t.name, count: t.count })));
}));

function lessonSummary(l: Record<string, unknown>) {
  return {
    id: l.id, slug: l.slug, courseId: l.courseId, order: l.order,
    title: l.title, kicker: l.kicker, readMin: l.readMin, summary: l.summary,
  };
}
