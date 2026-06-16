#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOINDEX_SEGMENTS, STATIC_ROUTES } from '../shared/routes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');
const publicDir = join(root, 'client', 'public');

const LOCALES = ['fr', 'en'];
const DEFAULT_LOCALE = 'fr';
const FALLBACK_SITE_URL = 'https://vcpx.io';

const SITE_URL_ENV_KEYS = ['SITE_URL', 'VITE_SITE_URL', 'CLIENT_ORIGIN'];
const configuredSiteUrl = SITE_URL_ENV_KEYS.map((key) => process.env[key]).find(Boolean);

function normalizeSiteUrl(value) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    throw new Error(`Invalid SITE_URL/VITE_SITE_URL value: "${value}"`);
  }
}

const siteUrl = normalizeSiteUrl(configuredSiteUrl ?? FALLBACK_SITE_URL);

if (!configuredSiteUrl) {
  console.warn(
    `[sitemap] SITE_URL/VITE_SITE_URL absent; fallback temporaire utilise ${FALLBACK_SITE_URL}. ` +
      'Definir le domaine canonique avant production.',
  );
}

function readJson(name, fallback) {
  const path = join(dataDir, name);
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readFirstArray(names) {
  for (const name of names) {
    const value = readJson(name, null);
    if (Array.isArray(value)) return value;
  }
  return [];
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanPath(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
}

function localizedPath(path, locale) {
  const normalized = cleanPath(path);
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

function absoluteUrl(path, locale) {
  const localized = locale ? localizedPath(path, locale) : cleanPath(path);
  return new URL(localized, `${siteUrl}/`).toString();
}

const routes = new Map();

function addRoute(path, options = {}) {
  const normalized = cleanPath(path);
  if (routes.has(normalized)) return;
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

// Static top-level pages + crawl hints come from the shared route registry
// (shared/routes.mjs) so the sitemap and the client stay in lockstep.
for (const route of STATIC_ROUTES) addRoute(route.path, route);

addCollection(readJson('paths.json', []), '/paths', { changefreq: 'monthly', priority: '0.7' });
addCollection(readJson('parcours.json', []), '/paths', { changefreq: 'monthly', priority: '0.75' });
addCollection(readJson('courses.json', []), '/courses', { changefreq: 'monthly', priority: '0.65' });
addCollection(readFirstArray(['generated/lessons.index.json', 'lessons.json']), '/lessons', {
  changefreq: 'monthly',
  priority: '0.7',
});
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

for (const post of readJson('blog.json', [])) {
  if (!post?.slug) continue;
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

function alternateLinks(path) {
  const links = LOCALES.map(
    (locale) =>
      `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(absoluteUrl(path, locale))}" />`,
  );
  links.push(
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(path, DEFAULT_LOCALE))}" />`,
  );
  return links.map((line) => `    ${line}`).join('\n');
}

function urlEntry(route, locale) {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(route.path, locale))}</loc>`,
    alternateLinks(route.path),
  ];
  if (route.lastmod) lines.push(`    <lastmod>${escapeXml(route.lastmod)}</lastmod>`);
  lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
  lines.push(`    <priority>${route.priority}</priority>`);
  lines.push('  </url>');
  return lines.join('\n');
}

const orderedRoutes = Array.from(routes.values()).sort((a, b) => a.path.localeCompare(b.path));
const entries = orderedRoutes.flatMap((route) => LOCALES.map((locale) => urlEntry(route, locale)));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  entries.join('\n'),
  '</urlset>',
  '',
].join('\n');

// The noindex set is shared with the client (shared/routes.mjs): the same
// segments that get `Disallow:` here are what usePageMeta marks `noindex`.
const disallowBlock = (prefix) => [...NOINDEX_SEGMENTS.map((segment) => `Disallow: ${prefix}/${segment}`), ''];

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  ...disallowBlock(''),
  ...LOCALES.flatMap((locale) => disallowBlock(`/${locale}`)),
  `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  '',
].join('\n');

mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);
writeFileSync(join(publicDir, 'robots.txt'), robots);

console.log(`[sitemap] ${orderedRoutes.length} routes x ${LOCALES.length} locales -> client/public/sitemap.xml`);
