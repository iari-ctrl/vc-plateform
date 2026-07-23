import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { collectRoutes } from './collect-routes.mjs';
import { buildRobotsTxt, routesForSitemap } from './generate-sitemap.mjs';
import { routesForPrerender } from './prerender.mjs';
import { isPublishedContent } from '../shared/publication.mjs';
import {
  EXECUTABLE_ROUTE_PATTERNS,
  LEGACY_REDIRECTS,
  PUBLIC_ROUTE_PATTERNS,
  isNoindexPath,
  isPublicRoutePath,
  matchesRoutePattern,
} from '../shared/routes.mjs';

test('collectRoutes excludes draft blog posts and keeps explicitly published posts', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/blog/flatland-cecite-dimensionnelle'), false);
  assert.equal(paths.has('/blog/voir-comme-un-etat'), true);
});

test('the shared publication gate is fail-closed', () => {
  assert.equal(isPublishedContent({ slug: 'missing-status' }), false);
  assert.equal(isPublishedContent({ slug: 'draft', status: 'draft' }), false);
  assert.equal(isPublishedContent({ slug: 'published', status: 'published' }), true);
});

test('collectRoutes reserves paths for parcours and exposes only the library index', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/parcours'), true);
  assert.equal(paths.has('/parcours/le-vc-sans-bullshit'), true);
  assert.equal(paths.has('/parcours/analyst-foundations'), true);
  assert.equal(paths.has('/parcours/venture-philanthropy-foundations'), true);
  assert.equal(paths.has('/parcours/venture-philanthropy-foundations/diagnostic'), false);
  assert.equal(paths.has('/bibliotheque'), true);
  assert.equal(paths.has('/bibliotheque/decouvrir-le-capital-risque'), false);
  assert.equal([...paths].some((path) => path === '/paths' || path.startsWith('/paths/')), false);
});

test('legacy library detail URLs redirect to the filterable library index', () => {
  assert.equal(LEGACY_REDIRECTS.length, 9);
  for (const redirect of LEGACY_REDIRECTS) {
    assert.match(redirect.from, /^\/bibliotheque\/[^/]+$/);
    assert.equal(redirect.to, '/bibliotheque');
    assert.equal(isPublicRoutePath(redirect.from), false);
    assert.equal(isNoindexPath(redirect.from), true);
  }
});

test('collectRoutes indexes learner cases but excludes commented corrections', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/cases/insertion-3-regions'), true);
  assert.equal(paths.has('/cases/energie-des-vallees'), true);
  assert.equal([...paths].some((path) => path.endsWith('/correction')), false);
});

test('collectRoutes publishes certification detail routes, but never an evaluation', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/certifications'), true);
  assert.equal(paths.has('/certifications/niveaux'), true);
  assert.equal(paths.has('/certifications/analyst-foundations'), false);
  assert.equal(paths.has('/certifications/analyste-en-capital-risque'), true);
  assert.equal(paths.has('/certifications/venture-philanthropy-foundations'), false);
  assert.equal([...paths].some((path) => path.startsWith('/certifications/') && path.endsWith('/evaluation')), false);
});

test('collectRoutes excludes upcoming lessons while keeping published lessons', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/lessons/preseed-equipe-sans-historique'), false);
  assert.equal(paths.has('/lessons/gestion-pipeline-crm-investissement'), true);
  assert.equal(paths.has('/lessons/le-capital-risque-vraiment'), true);
});

test('the shared route policy covers private and nested diagnostic surfaces', () => {
  for (const path of [
    '/dashboard',
    '/notes',
    '/journal',
    '/profile',
    '/profile-result',
    '/search',
    '/design-system',
    '/bibliotheque/decouvrir-le-capital-risque',
    '/parcours/venture-philanthropy-foundations/diagnostic',
    '/certifications/analyste-en-capital-risque/evaluation',
    '/cases/energie-des-vallees/correction',
  ]) {
    assert.equal(isNoindexPath(path), true, `${path} should be noindex`);
  }

  for (const path of ['/', '/home', '/parcours/analyst-foundations', '/cases/energie-des-vallees']) {
    assert.equal(isNoindexPath(path), false, `${path} should remain indexable`);
  }
});

test('every collected route is an executable public family and never noindex', () => {
  for (const route of collectRoutes()) {
    assert.equal(isPublicRoutePath(route.path), true, `${route.path} has no public executable pattern`);
    assert.equal(isNoindexPath(route.path), false, `${route.path} is both collected and noindex`);
  }

  for (const pattern of PUBLIC_ROUTE_PATTERNS) {
    assert.equal(
      EXECUTABLE_ROUTE_PATTERNS.includes(pattern),
      true,
      `${pattern} is public but absent from the executable route registry`,
    );
  }
});

test('sitemap contains public routes while prerender also emits legacy redirects', () => {
  const publicRoutes = collectRoutes();
  assert.deepEqual(routesForSitemap(), publicRoutes);
  assert.deepEqual(
    routesForPrerender(),
    [
      ...publicRoutes,
      ...LEGACY_REDIRECTS.map(({ from, to }) => ({ path: from, redirectTo: to })),
    ].sort((a, b) => a.path.localeCompare(b.path)),
  );
});

test('the executable route registry stays aligned with the React Router tree', () => {
  const appSource = readFileSync(new URL('../client/src/App.tsx', import.meta.url), 'utf8');
  const appPatterns = new Set(
    [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)]
      .map((match) => (match[1] === '/' || match[1] === '*' ? match[1] : `/${match[1]}`)),
  );

  for (const pattern of EXECUTABLE_ROUTE_PATTERNS) {
    assert.equal(appPatterns.has(pattern), true, `${pattern} is registered but has no React route`);
  }
  for (const pattern of appPatterns) {
    if (pattern === '*') continue;
    assert.equal(
      EXECUTABLE_ROUTE_PATTERNS.some((candidate) => matchesRoutePattern(pattern, candidate)),
      true,
      `${pattern} is implemented by React but absent from the executable registry`,
    );
  }

  assert.match(
    appSource,
    /path="bibliotheque\/:slug"\s+element=\{<Navigate to="\/bibliotheque" replace \/>\}/,
  );
});

test('the committed sitemap XML contains exactly the collected routes', () => {
  const xml = readFileSync(new URL('../client/public/sitemap.xml', import.meta.url), 'utf8');
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const actualPaths = locations.map((location) => {
    const url = new URL(location);
    assert.equal(url.origin, 'https://iari-ctrl.github.io');
    assert.equal(url.pathname === '/vc-plateform' || url.pathname.startsWith('/vc-plateform/'), true);
    return url.pathname.slice('/vc-plateform'.length) || '/';
  });

  assert.deepEqual(actualPaths, collectRoutes().map((route) => route.path));
});

test('robots allows crawlers to read noindex directives instead of disallowing those routes', () => {
  const robots = buildRobotsTxt({
    baseUrl: '/vc-platform/',
    siteUrl: 'https://example.test/vc-platform',
  });

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/vc-platform\/$/m);
  assert.match(robots, /^Sitemap: https:\/\/example\.test\/vc-platform\/sitemap\.xml$/m);
  assert.doesNotMatch(robots, /^Disallow:/m);
});
