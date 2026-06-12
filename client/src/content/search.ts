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
import { ANTI_PORTFOLIO } from './antiPortfolio';
import { MEMOS } from './memos';

export interface SearchHit {
  type: 'course' | 'lesson' | 'glossary' | 'case' | 'blog' | 'path' | 'simulator' | 'anti-portfolio' | 'memo';
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
    // `body` is no longer in the light index, so offline search matches
    // title / kicker / summary — enough for the palette.
    if (has(l.title, l.kicker, l.summary))
      hits.push({ type: 'lesson', id: l.id, slug: l.slug, title: l.title, excerpt: l.summary, href: `/lessons/${l.slug}` });
  for (const g of GLOSSARY)
    // `definition` is no longer in the light index, so offline search matches
    // term / latin / short (the concise summary) — enough for the palette.
    if (has(g.term, g.latin, g.short))
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
  for (const a of ANTI_PORTFOLIO)
    if (has(a.company, a.title, a.subtitle, a.summary, a.passes.map((p) => p.fund).join(' ')))
      hits.push({ type: 'anti-portfolio', id: a.id, slug: a.slug, title: a.title, excerpt: a.summary, href: `/anti-portfolio/${a.slug}` });
  for (const m of MEMOS)
    if (has(m.company, m.title, m.fund, m.author, m.summary))
      hits.push({ type: 'memo', id: m.id, slug: m.slug, title: m.title, excerpt: m.whyItMatters, href: `/memos/${m.slug}` });

  return hits.slice(0, 40);
}
