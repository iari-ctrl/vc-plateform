import { Router } from 'express';
import { prisma } from '../lib/db.js';

export const searchRouter = Router();

interface Hit {
  type: 'course' | 'lesson' | 'glossary' | 'case' | 'blog' | 'path' | 'simulator';
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
}

searchRouter.get('/', async (req, res) => {
  const q = String(req.query.q ?? '').trim().toLowerCase();
  if (q.length < 2) return res.json({ q, hits: [] });
  const like = q;

  const [courses, lessons, glossary, cases, blog, paths, simulators] = await Promise.all([
    prisma.course.findMany({ take: 80 }),
    prisma.lesson.findMany({ where: { searchText: { contains: like } }, take: 12 }),
    prisma.glossaryTerm.findMany({ where: { searchText: { contains: like } }, take: 12 }),
    prisma.caseStudy.findMany({ where: { searchText: { contains: like } }, take: 8 }),
    prisma.blogPost.findMany({ where: { searchText: { contains: like } }, take: 8 }),
    prisma.learningPath.findMany({ where: { id: { startsWith: 'p-' } }, take: 50 }),
    prisma.simulator.findMany({ take: 20 }),
  ]);

  const hits: Hit[] = [];

  for (const c of courses) {
    const d = JSON.parse(c.data);
    if (([d.title, d.subtitle, d.summary, ...(d.tags ?? [])].join(' ')).toLowerCase().includes(like))
      hits.push({ type: 'course', id: c.id, slug: c.slug, title: d.title, excerpt: d.summary, href: `/courses/${c.slug}` });
  }
  for (const l of lessons) {
    const d = JSON.parse(l.data);
    hits.push({ type: 'lesson', id: l.id, slug: l.slug, title: d.title, excerpt: d.summary, href: `/lessons/${l.slug}` });
  }
  for (const g of glossary) {
    const d = JSON.parse(g.data);
    hits.push({ type: 'glossary', id: g.id, slug: g.slug, title: d.term, excerpt: d.short, href: `/glossary?term=${g.slug}` });
  }
  for (const c of cases) {
    const d = JSON.parse(c.data);
    hits.push({ type: 'case', id: c.id, slug: c.slug, title: d.title, excerpt: d.summary, href: `/cases/${c.slug}` });
  }
  for (const b of blog) {
    const d = JSON.parse(b.data);
    hits.push({ type: 'blog', id: b.id, slug: b.slug, title: d.title, excerpt: d.excerpt, href: `/blog/${b.slug}` });
  }
  // Lightweight title-match for paths & simulators (small sets).
  for (const p of paths) {
    const d = JSON.parse(p.data);
    if (([d.title, d.hook, d.goal, ...(d.outcomes ?? [])].join(' ')).toLowerCase().includes(like))
      hits.push({ type: 'path', id: p.id, slug: p.slug, title: d.title, excerpt: d.hook, href: `/paths/${p.slug}` });
  }
  for (const s of simulators) {
    const d = JSON.parse(s.data);
    if ((d.title + ' ' + d.description).toLowerCase().includes(like))
      hits.push({ type: 'simulator', id: s.id, slug: s.slug, title: d.title, excerpt: d.subtitle, href: `/simulators/${s.slug}` });
  }

  res.json({ q, hits });
});
