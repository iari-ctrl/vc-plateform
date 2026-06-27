import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { foldAccents } from '../lib/content.js';
import { ah } from '../lib/async-handler.js';

export const searchRouter = Router();

interface Hit {
  type: 'course' | 'lesson' | 'glossary' | 'case' | 'blog' | 'path' | 'simulator';
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
}

searchRouter.get('/', ah(async (req, res) => {
  const raw = String(req.query.q ?? '').trim();
  if (raw.length < 2) return res.json({ q: raw, hits: [] });
  // Replie casse + accents pour matcher la colonne searchText (elle-même repliée
  // au seed/à l'écriture), de sorte que « ecosysteme » trouve « écosystème ».
  const q = foldAccents(raw);

  const [courses, lessons, glossary, cases, blog, paths, simulators] = await Promise.all([
    prisma.course.findMany({ where: { searchText: { contains: q } }, take: 8 }),
    prisma.lesson.findMany({ where: { searchText: { contains: q } }, take: 12 }),
    prisma.glossaryTerm.findMany({ where: { searchText: { contains: q } }, take: 12 }),
    prisma.caseStudy.findMany({ where: { searchText: { contains: q } }, take: 8 }),
    prisma.blogPost.findMany({ where: { searchText: { contains: q } }, take: 8 }),
    prisma.learningPath.findMany({ where: { id: { startsWith: 'p-' }, searchText: { contains: q } }, take: 8 }),
    prisma.simulator.findMany({ where: { searchText: { contains: q } }, take: 6 }),
  ]);

  const hits: Hit[] = [];

  for (const c of courses) {
    const d = JSON.parse(c.data);
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
  for (const p of paths) {
    const d = JSON.parse(p.data);
    hits.push({ type: 'path', id: p.id, slug: p.slug, title: d.title, excerpt: d.hook, href: `/paths/${p.slug}` });
  }
  for (const s of simulators) {
    const d = JSON.parse(s.data);
    hits.push({ type: 'simulator', id: s.id, slug: s.slug, title: d.title, excerpt: d.subtitle, href: `/simulators/${s.slug}` });
  }

  res.json({ q: raw, hits });
}));
