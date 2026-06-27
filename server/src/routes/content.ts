import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { ah } from '../lib/async-handler.js';
import { content, type RawLesson } from '../lib/content.js';

export const contentRouter = Router();

const parse = <T>(s: string): T => JSON.parse(s) as T;

// In dev (and tests), content is served straight from the JSON sources so edits
// appear on reload without a DB re-seed (the seed is non-destructive) and pages
// never blank out on an un-seeded DB. `content.*()` re-reads files on every call.
// Production keeps the DB-backed path. Both branches return the same shapes: the
// JSON branch reproduces the composition the DB queries perform (course/lesson
// resolution of a parcours, prev/next neighbours, lesson summaries). The
// `learningPath` table is seeded from parcours (ids `p-*`), so the `/paths`
// endpoints serve parcours — the JSON branch reads `content.parcours()` to match.
const DEV_JSON = process.env.NODE_ENV !== 'production';

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

// ── Learning paths (parcours) ─────────────────────────────────────────────
contentRouter.get('/paths', ah(async (_req, res) => {
  if (DEV_JSON) return res.json(content.parcours().filter((p) => p.id.startsWith('p-')));
  const rows = await prisma.learningPath.findMany({ where: { id: { startsWith: 'p-' } }, orderBy: { order: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));

contentRouter.get('/paths/:slug', ah(async (req, res) => {
  if (DEV_JSON) {
    const path = content.parcours().find((p) => p.slug === req.params.slug);
    if (!path || !path.id.startsWith('p-')) return res.status(404).json({ error: 'Parcours introuvable.' });
    const lessons = content.allLessons();
    const courses = content.courses()
      .filter((c) => c.pathId === path.id)
      .sort(byOrder)
      .map((c) => ({
        ...c,
        lessons: lessons.filter((l) => l.courseId === c.id).sort(byOrder).map(lessonSummary),
      }));
    return res.json({ ...path, courses });
  }
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
  if (DEV_JSON) {
    const course = content.courses().find((c) => c.slug === req.params.slug);
    if (!course) return res.status(404).json({ error: 'Cours introuvable.' });
    const lessons = content.allLessons().filter((l) => l.courseId === course.id).sort(byOrder);
    const path = content.parcours().find((p) => p.id === course.pathId) ?? null;
    return res.json({ ...course, path, lessons });
  }
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
  if (DEV_JSON) {
    const all = content.allLessons();
    const lesson = all.find((l) => l.slug === req.params.slug);
    if (!lesson) return res.status(404).json({ error: 'Leçon introuvable.' });
    const course = content.courses().find((c) => c.id === lesson.courseId) ?? null;
    const path = course ? content.parcours().find((p) => p.id === course.pathId) ?? null : null;
    const siblings = all.filter((l) => l.courseId === lesson.courseId).sort(byOrder);
    const idx = siblings.findIndex((l) => l.id === lesson.id);
    return res.json({
      ...lesson,
      course,
      path,
      prev: idx > 0 ? lessonSummary(siblings[idx - 1]) : null,
      next: idx < siblings.length - 1 ? lessonSummary(siblings[idx + 1]) : null,
    });
  }
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
  if (DEV_JSON) return res.json([...content.glossary()].sort((a, b) => a.term.localeCompare(b.term, 'fr')));
  const rows = await prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));

contentRouter.get('/glossary/:slug', ah(async (req, res) => {
  if (DEV_JSON) {
    const t = content.glossary().find((g) => g.slug === req.params.slug);
    return t ? res.json(t) : res.status(404).json({ error: 'Terme introuvable.' });
  }
  const term = await prisma.glossaryTerm.findUnique({ where: { slug: req.params.slug } });
  if (!term) return res.status(404).json({ error: 'Terme introuvable.' });
  res.json(parse(term.data));
}));

// ── Case studies ────────────────────────────────────────────────────────
contentRouter.get('/case-studies', ah(async (_req, res) => {
  if (DEV_JSON) return res.json([...content.caseStudies()].sort((a, b) => a.title.localeCompare(b.title, 'fr')));
  const rows = await prisma.caseStudy.findMany({ orderBy: { title: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));
contentRouter.get('/case-studies/:slug', ah(async (req, res) => {
  if (DEV_JSON) {
    const cs = content.caseStudies().find((c) => c.slug === req.params.slug);
    return cs ? res.json(cs) : res.status(404).json({ error: 'Étude de cas introuvable.' });
  }
  const cs = await prisma.caseStudy.findUnique({ where: { slug: req.params.slug } });
  if (!cs) return res.status(404).json({ error: 'Étude de cas introuvable.' });
  res.json(parse(cs.data));
}));

// ── Blog / research notes ─────────────────────────────────────────────────
contentRouter.get('/blog', ah(async (_req, res) => {
  if (DEV_JSON) return res.json([...content.blog()].sort((a, b) => b.date.localeCompare(a.date)));
  const rows = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
  res.json(rows.map((r) => parse(r.data)));
}));
contentRouter.get('/blog/:slug', ah(async (req, res) => {
  if (DEV_JSON) {
    const b = content.blog().find((p) => p.slug === req.params.slug);
    return b ? res.json(b) : res.status(404).json({ error: 'Article introuvable.' });
  }
  const b = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  if (!b) return res.status(404).json({ error: 'Article introuvable.' });
  res.json(parse(b.data));
}));

// ── Simulators ────────────────────────────────────────────────────────────
contentRouter.get('/simulators', ah(async (_req, res) => {
  if (DEV_JSON) return res.json([...content.simulators()].sort((a, b) => a.title.localeCompare(b.title, 'fr')));
  const rows = await prisma.simulator.findMany({ orderBy: { title: 'asc' } });
  res.json(rows.map((r) => parse(r.data)));
}));

// ── Tags ──────────────────────────────────────────────────────────────────
contentRouter.get('/tags', ah(async (_req, res) => {
  if (DEV_JSON) return res.json(content.tags());
  const rows = await prisma.tag.findMany({ orderBy: { count: 'desc' } });
  res.json(rows.map((t) => ({ name: t.name, count: t.count })));
}));

function lessonSummary(l: RawLesson) {
  return {
    id: l.id, slug: l.slug, courseId: l.courseId, order: l.order,
    title: l.title, kicker: l.kicker, readMin: l.readMin, summary: l.summary,
  };
}
