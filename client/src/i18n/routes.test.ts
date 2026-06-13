import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  NOINDEX_SEGMENTS,
  OG_IMAGE_BY_SEGMENT,
  STATIC_ROUTES,
  isNoindexPath,
  ogImageKeyForPath,
} from './routes';

const appSource = readFileSync(fileURLToPath(new URL('../App.tsx', import.meta.url)), 'utf8');

// The top-level segment of every `<Route path="…">` declared in App.tsx.
// `/`, the `/:locale` parent and the `*` catch-all are not content pages.
const routerSegments = [
  ...new Set(
    Array.from(appSource.matchAll(/path="([^"]+)"/g))
      .map((m) => m[1].replace(/^\//, '').split('/')[0])
      .filter((seg) => seg !== '' && !seg.startsWith(':') && seg !== '*'),
  ),
];

const staticSegments = new Set(STATIC_ROUTES.map((r) => r.path.replace(/^\//, '')));

/** A route is accounted for if the registry knows how to crawl/card/hide it. */
function isAccountedFor(segment: string): boolean {
  return staticSegments.has(segment) || segment in OG_IMAGE_BY_SEGMENT || NOINDEX_SEGMENTS.includes(segment);
}

describe('route registry covers the router', () => {
  it('leaves no App.tsx route orphaned from the sitemap/OG/noindex registry', () => {
    // A new page added to App.tsx but forgotten in shared/routes.mjs lands here.
    const orphans = routerSegments.filter((seg) => !isAccountedFor(seg));
    expect(orphans).toEqual([]);
  });
});

describe('registry helpers', () => {
  it('marks private segments noindex and public ones indexable', () => {
    expect(isNoindexPath('/admin')).toBe(true);
    expect(isNoindexPath('/profile-result')).toBe(true);
    expect(isNoindexPath('/dashboard/anything')).toBe(true);
    expect(isNoindexPath('/blog/foo')).toBe(false);
    expect(isNoindexPath('/')).toBe(false);
  });

  it('derives the OG image key from the first path segment', () => {
    expect(ogImageKeyForPath('/blog/foo')).toBe('blog');
    expect(ogImageKeyForPath('/cases/airbnb')).toBe('case-study');
    expect(ogImageKeyForPath('/bibliotheque')).toBe('course');
    expect(ogImageKeyForPath('/ecosystemes/healthtech')).toBeUndefined();
    expect(ogImageKeyForPath('/')).toBeUndefined();
  });

  it('points every OG segment at a real card key (keep in sync with OG_IMAGES in lib/seo.ts)', () => {
    const cardKeys = new Set([
      'default',
      'lesson',
      'blog',
      'case-study',
      'course',
      'path',
      'glossary',
      'simulator',
      'memo',
      'anti-portfolio',
    ]);
    for (const key of Object.values(OG_IMAGE_BY_SEGMENT)) {
      expect(cardKeys.has(key)).toBe(true);
    }
  });
});
