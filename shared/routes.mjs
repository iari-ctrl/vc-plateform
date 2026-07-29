// Single cross-runtime source of truth for the site's route taxonomy.
//
// Consumed by BOTH runtimes, untouched:
//   • scripts/generate-sitemap.mjs   (Node) — sitemap.xml + robots.txt
//   • client/src/lib/seo.ts          (browser) — noindex + OG card taxonomy
//
// Before this, the static route list + crawl hints lived in the sitemap script,
// nested diagnostics/corrections were marked ad hoc in their components, and
// each page hard-coded its OG image key. The registries below keep executable
// families, public families and noindex policy testable in both runtimes.
//
// Keep this file pure data + pure functions: zero dependencies, no TypeScript,
// no DOM/Node APIs — that is what lets the same module run in Node and in the
// Vite bundle. Types are mirrored in `routes.d.mts`.

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
  { path: '/ikigai', changefreq: 'monthly', priority: '0.55' },
  { path: '/parcours', changefreq: 'weekly', priority: '0.8' },
  { path: '/certifications', changefreq: 'monthly', priority: '0.75' },
  { path: '/certifications/niveaux', changefreq: 'monthly', priority: '0.7' },
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
 * Historical library detail URLs. The former `paths.json` collection was a
 * redundant thematic grouping, not a parcours. Keep these redirects outside
 * the public route registry so old links survive without remaining indexable.
 */
export const LEGACY_REDIRECTS = [
  { from: '/bibliotheque/decouvrir-le-capital-risque', to: '/bibliotheque' },
  { from: '/bibliotheque/comprendre-le-metier-de-vc', to: '/bibliotheque' },
  { from: '/bibliotheque/analyse-de-startup', to: '/bibliotheque' },
  { from: '/bibliotheque/these-d-investissement', to: '/bibliotheque' },
  { from: '/bibliotheque/term-sheets-et-structuration', to: '/bibliotheque' },
  { from: '/bibliotheque/portfolio-management', to: '/bibliotheque' },
  { from: '/bibliotheque/fund-economics', to: '/bibliotheque' },
  { from: '/bibliotheque/levee-de-fonds-cote-entrepreneur', to: '/bibliotheque' },
  { from: '/bibliotheque/devenir-analyst-associate-principal', to: '/bibliotheque' },
];

/**
 * Route families implemented by `client/src/App.tsx`, including its explicit
 * development-only route. This is a contract registry, not a router
 * implementation: React Router remains responsible for rendering and
 * redirects. Parameter segments use the `:name` notation.
 */
export const EXECUTABLE_ROUTE_PATTERNS = [
  '/',
  '/home',
  '/onboarding',
  '/ikigai',
  '/profile-result',
  '/dashboard',
  '/parcours',
  '/parcours/:slug',
  '/parcours/:slug/diagnostic',
  '/certifications',
  '/certifications/niveaux',
  '/certifications/:slug',
  '/certifications/:slug/evaluation',
  '/bibliotheque',
  '/bibliotheque/:slug',
  '/courses/:slug',
  '/lessons/:slug',
  '/glossary',
  '/glossary/:slug',
  '/intelligence',
  '/convictions',
  '/decisions',
  '/methode',
  '/cases',
  '/cases/:slug',
  '/cases/:slug/correction',
  '/livrables',
  '/livrables/:slug',
  '/simulators',
  '/simulators/:slug',
  '/anti-portfolio',
  '/anti-portfolio/:slug',
  '/memos',
  '/memos/:slug',
  '/blog',
  '/blog/:slug',
  '/ecosystemes',
  '/ecosystemes/:slug',
  '/notes',
  '/journal',
  '/profile',
  '/search',
  '/design-system',
];

/** Public families that may be emitted by the collector, sitemap and prerender. */
export const PUBLIC_ROUTE_PATTERNS = [
  ...STATIC_ROUTES.map((route) => route.path),
  '/parcours/:slug',
  '/certifications/:slug',
  '/courses/:slug',
  '/lessons/:slug',
  '/glossary/:slug',
  '/cases/:slug',
  '/livrables/:slug',
  '/simulators/:slug',
  '/anti-portfolio/:slug',
  '/memos/:slug',
  '/blog/:slug',
  '/ecosystemes/:slug',
];

/**
 * Private or utility families. Crawlers are allowed to load them so their
 * `noindex` directive remains observable; they are never emitted by the public
 * route collector.
 */
export const NOINDEX_ROUTE_PATTERNS = [
  '/dashboard/*',
  '/notes/*',
  '/journal/*',
  '/profile/*',
  '/profile-result/*',
  '/search/*',
  '/design-system/*',
  '/bibliotheque/:slug',
  '/parcours/:slug/diagnostic/*',
  '/certifications/:slug/evaluation/*',
  '/cases/:slug/correction/*',
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
  parcours: 'path',
  certifications: 'path',
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

function pathSegments(path) {
  const pathname = String(path).split(/[?#]/, 1)[0];
  const normalized = pathname === '/' ? '/' : `/${pathname}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return normalized === '/' ? [] : normalized.slice(1).split('/');
}

/** Match exact segments, `:parameter` segments and a final zero-or-more `*`. */
export function matchesRoutePattern(path, pattern) {
  if (pattern === '*') return true;
  const pathParts = pathSegments(path);
  const patternParts = pathSegments(pattern);
  const wildcard = patternParts.at(-1) === '*';
  const comparablePattern = wildcard ? patternParts.slice(0, -1) : patternParts;
  if ((!wildcard && pathParts.length !== comparablePattern.length) || pathParts.length < comparablePattern.length) {
    return false;
  }

  return comparablePattern.every((part, index) => part.startsWith(':') || part === pathParts[index]);
}

/** Whether a page should carry `noindex`, including nested utility families. */
export function isNoindexPath(unlocalizedPath) {
  return NOINDEX_ROUTE_PATTERNS.some((pattern) => matchesRoutePattern(unlocalizedPath, pattern));
}

/** Whether a concrete path belongs to a public executable route family. */
export function isPublicRoutePath(unlocalizedPath) {
  return PUBLIC_ROUTE_PATTERNS.some((pattern) => matchesRoutePattern(unlocalizedPath, pattern));
}

/** OG image key for a path, or `undefined` to fall back to the default card. */
export function ogImageKeyForPath(unlocalizedPath) {
  return OG_IMAGE_BY_SEGMENT[firstSegment(unlocalizedPath)];
}
