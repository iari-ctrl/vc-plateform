// Offline search across the whole content bundle, used when the API is
// unavailable (guest mode / server down). It references *every* collection, so
// it is intentionally kept in its own module and loaded lazily — eager callers
// (the command palette) `import()` it on first query, keeping the 8 JSON
// collections out of the initial bundle.
import { LESSONS } from './lessons';
import { COURSES } from './courses';
import { GLOSSARY } from './glossary';
import { CASE_STUDIES } from './caseStudies';
import { BLOG } from './blog';
import { PARCOURS, t } from './parcours';
import { SIMULATORS } from './simulators';

export interface SearchHit {
  type: 'course' | 'lesson' | 'glossary' | 'case' | 'blog' | 'path' | 'simulator';
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function searchLocal(query: string): SearchHit[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  const has = (...parts: (string | undefined)[]) => norm(parts.filter(Boolean).join(' ')).includes(q);

  for (const c of COURSES)
    if (has(c.title, c.subtitle, c.summary, c.tags.join(' ')))
      hits.push({ type: 'course', id: c.id, slug: c.slug, title: c.title, excerpt: c.summary, href: `/courses/${c.slug}` });
  for (const l of LESSONS)
    if (has(l.title, l.kicker, l.summary, l.body))
      hits.push({ type: 'lesson', id: l.id, slug: l.slug, title: l.title, excerpt: l.summary, href: `/lessons/${l.slug}` });
  for (const g of GLOSSARY)
    if (has(g.term, g.latin, g.short, g.definition))
      hits.push({ type: 'glossary', id: g.id, slug: g.slug, title: g.term, excerpt: g.short, href: `/glossary?term=${g.slug}` });
  for (const c of CASE_STUDIES)
    if (has(c.title, c.subtitle, c.summary))
      hits.push({ type: 'case', id: c.id, slug: c.slug, title: c.title, excerpt: c.summary, href: `/cases/${c.slug}` });
  for (const b of BLOG)
    if (has(b.title, b.subtitle, b.excerpt, b.body))
      hits.push({ type: 'blog', id: b.id, slug: b.slug, title: b.title, excerpt: b.excerpt, href: `/blog/${b.slug}` });
  for (const p of PARCOURS)
    if (has(t(p.title), t(p.hook), t(p.goal), p.outcomes.map((o) => t(o)).join(' ')))
      hits.push({ type: 'path', id: p.id, slug: p.slug, title: t(p.title), excerpt: t(p.hook), href: `/paths/${p.slug}` });
  for (const s of SIMULATORS)
    if (has(s.title, s.subtitle, s.description))
      hits.push({ type: 'simulator', id: s.id, slug: s.slug, title: s.title, excerpt: s.subtitle, href: `/simulators/${s.slug}` });

  return hits.slice(0, 40);
}
