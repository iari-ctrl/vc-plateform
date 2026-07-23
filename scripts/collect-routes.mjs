#!/usr/bin/env node
// Single enumeration of the site's public, indexable URLs.
//
// Both the sitemap generator (scripts/generate-sitemap.mjs) and the static
// prerender crawl (scripts/prerender.mjs) need the exhaustive list of routes:
// the hand-curated top-level pages from the shared registry (shared/routes.mjs)
// plus every collection page derived from `data/` (lessons, glossary, blog,
// ecosystem dossiers, …). This module owns that one enumeration so the sitemap
// and the prerender can never drift apart.
//
// Pure data reads, no DOM/Node-server concerns. Routes are returned normalized
// and de-duplicated exactly as they are served by the V1 FR app.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublishedContent } from '../shared/publication.mjs';
import { STATIC_ROUTES, isNoindexPath } from '../shared/routes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');

function readJson(name, fallback) {
  const path = join(dataDir, name);
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readJsonDir(name, fallback) {
  const dir = join(dataDir, name);
  if (!existsSync(dir)) return fallback;
  return readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => JSON.parse(readFileSync(join(dir, file), 'utf8')));
}

function readFirstArray(names) {
  for (const name of names) {
    const value = readJson(name, null);
    if (Array.isArray(value)) return value;
  }
  return [];
}

/** Normalize a path to its canonical form: leading slash, no trailing slash. */
export function cleanPath(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
}

/**
 * Enumerate every public route once, with its sitemap crawl hints.
 * Returns `{ path, changefreq, priority, lastmod }[]` sorted by path. The first
 * definition of a path wins (so a STATIC_ROUTES entry is never overridden by a
 * collection sharing the same slug). Routes are unlocalized.
 */
export function collectRoutes() {
  const routes = new Map();

  function addRoute(path, options = {}) {
    const normalized = cleanPath(path);
    if (routes.has(normalized) || isNoindexPath(normalized)) return;
    routes.set(normalized, {
      path: normalized,
      changefreq: options.changefreq ?? 'monthly',
      priority: options.priority ?? '0.6',
      lastmod: options.lastmod,
    });
  }

  function addCollection(rows, routePrefix, options = {}) {
    for (const row of rows) {
      if (row?.slug) addRoute(`${routePrefix}/${row.slug}`, options);
    }
  }

  // Static top-level pages come from the shared route registry so the sitemap,
  // the prerender and the client stay in lockstep.
  for (const route of STATIC_ROUTES) addRoute(route.path, route);

  const parcoursRows = readJson('parcours.json', []);
  addCollection(parcoursRows, '/parcours', { changefreq: 'monthly', priority: '0.75' });
  for (const parcours of parcoursRows) {
    if (parcours?.slug && parcours?.entryDiagnosticId) {
      addRoute(`/parcours/${parcours.slug}/diagnostic`, { changefreq: 'monthly', priority: '0.55' });
    }
  }
  addCollection(readJson('certifications.json', []).filter(isPublishedContent), '/certifications', {
    changefreq: 'monthly',
    priority: '0.75',
  });
  addCollection(readJson('courses.json', []), '/courses', { changefreq: 'monthly', priority: '0.65' });
  addCollection(
    readFirstArray(['generated/lessons.index.json', 'lessons.json']).filter(isPublishedContent),
    '/lessons',
    {
      changefreq: 'monthly',
      priority: '0.7',
    },
  );
  addCollection(readFirstArray(['generated/glossary.index.json', 'glossary.json']), '/glossary', {
    changefreq: 'monthly',
    priority: '0.55',
  });
  addCollection(readJson('caseStudies.json', []), '/cases', { changefreq: 'monthly', priority: '0.7' });
  addCollection(readJson('deliverables.json', []), '/livrables', { changefreq: 'monthly', priority: '0.55' });
  addCollection(readJson('simulators.json', []), '/simulators', { changefreq: 'monthly', priority: '0.65' });
  addCollection(readJson('memos.json', []), '/memos', { changefreq: 'monthly', priority: '0.65' });

  const antiPortfolio = readJson('antiPortfolio.json', { entries: [] });
  addCollection(antiPortfolio.entries ?? [], '/anti-portfolio', { changefreq: 'monthly', priority: '0.65' });

  for (const post of readJsonDir('blog', [])) {
    if (!post?.slug || !isPublishedContent(post)) continue;
    addRoute(`/blog/${post.slug}`, {
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: /^\d{4}-\d{2}-\d{2}$/.test(post.date ?? '') ? post.date : undefined,
    });
  }

  // Dossiers d'écosystème — living documents: lastmod follows the latest revision.
  for (const dossier of readJson('ecosystems.json', [])) {
    if (!dossier?.slug) continue;
    addRoute(`/ecosystemes/${dossier.slug}`, {
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: /^\d{4}-\d{2}-\d{2}$/.test(dossier.updatedAt ?? '') ? dossier.updatedAt : undefined,
    });
  }

  return Array.from(routes.values()).sort((a, b) => a.path.localeCompare(b.path));
}
