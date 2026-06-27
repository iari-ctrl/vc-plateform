// Single cross-runtime source of truth for the site's route taxonomy.
//
// Consumed by BOTH runtimes, untouched:
//   • scripts/generate-sitemap.mjs   (Node) — sitemap.xml + robots.txt
//   • client/src/i18n/routes.ts      (browser) — usePageMeta noindex + OG card
//
// Before this, the static route list + crawl hints lived in the sitemap script,
// the noindex set was declared twice (robots `Disallow:` + 8 scattered
// `usePageMeta(..., { noindex: true })`), and each page hard-coded its OG image
// key. Adding a page meant remembering all three. Now they read from here.
//
// Keep this file pure data + pure functions: zero dependencies, no TypeScript,
// no DOM/Node APIs — that is what lets the same module run in Node and in the
// Vite bundle. Types are mirrored in `routes.d.mts`.

/**
 * Top-level path segments that must never be indexed (private dashboards and
 * utility surfaces). Drives both the robots `Disallow:` block and the client's
 * automatic `noindex` — so a page under one of these segments is excluded
 * everywhere without per-page wiring. Order is reflected in robots.txt.
 */
export const NOINDEX_SEGMENTS = [
  'admin',
  'dashboard',
  'notes',
  'journal',
  'profile',
  'profile-result',
  'search',
  'design-system',
];

/**
 * Hand-curated top-level pages with their sitemap crawl hints. Collection
 * pages (lessons, blog posts, ecosystem dossiers, …) are appended from `data/`
 * by the sitemap script and are intentionally NOT listed here.
 */
export const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/home', changefreq: 'weekly', priority: '0.9' },
  { path: '/intelligence', changefreq: 'weekly', priority: '0.9' },
  { path: '/onboarding', changefreq: 'monthly', priority: '0.5' },
  { path: '/paths', changefreq: 'weekly', priority: '0.8' },
  { path: '/bibliotheque', changefreq: 'weekly', priority: '0.8' },
  { path: '/glossary', changefreq: 'weekly', priority: '0.8' },
  { path: '/convictions', changefreq: 'weekly', priority: '0.8' },
  { path: '/decisions', changefreq: 'weekly', priority: '0.8' },
  { path: '/methode', changefreq: 'monthly', priority: '0.7' },
  { path: '/livrables', changefreq: 'monthly', priority: '0.7' },
  { path: '/simulators', changefreq: 'monthly', priority: '0.7' },
  { path: '/anti-portfolio', changefreq: 'monthly', priority: '0.7' },
  { path: '/memos', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/ecosystemes', changefreq: 'weekly', priority: '0.7' },
];

/**
 * Maps a route's first path segment to its bundled Open Graph image key (the
 * key → file lookup itself stays in `lib/seo.ts`). Pages no longer pass
 * `image:` — the social card is derived from the URL; an explicit option still
 * overrides. Segments absent here fall back to the default card.
 */
export const OG_IMAGE_BY_SEGMENT = {
  lessons: 'lesson',
  blog: 'blog',
  cases: 'case-study',
  courses: 'course',
  paths: 'path',
  livrables: 'path', // a deliverable is the hands-on end of a parcours — reuse its card
  intelligence: 'blog',
  convictions: 'blog',
  decisions: 'case-study',
  methode: 'path',

  bibliotheque: 'course', // the library lists courses — reuse the course card
  glossary: 'glossary',
  simulators: 'simulator',
  memos: 'memo',
  'anti-portfolio': 'anti-portfolio',
};

/** First path segment of an unlocalized, slash-prefixed path (`/blog/x` → `blog`). */
export function firstSegment(unlocalizedPath) {
  return unlocalizedPath.split('/')[1] ?? '';
}

/** Whether a page should carry `noindex`, based purely on its top-level segment. */
export function isNoindexPath(unlocalizedPath) {
  return NOINDEX_SEGMENTS.includes(firstSegment(unlocalizedPath));
}

/** OG image key for a path, or `undefined` to fall back to the default card. */
export function ogImageKeyForPath(unlocalizedPath) {
  return OG_IMAGE_BY_SEGMENT[firstSegment(unlocalizedPath)];
}
