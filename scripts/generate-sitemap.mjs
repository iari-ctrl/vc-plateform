#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOINDEX_SEGMENTS } from '../shared/routes.mjs';
import { cleanPath, collectRoutes } from './collect-routes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'client', 'public');

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

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteUrl(path) {
  return new URL(cleanPath(path), `${siteUrl}/`).toString();
}

// The exhaustive route set (static pages + collections from data/) is shared
// with the prerender crawl via scripts/collect-routes.mjs.
const orderedRoutes = collectRoutes();

function urlEntry(route) {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(route.path))}</loc>`,
  ];
  if (route.lastmod) lines.push(`    <lastmod>${escapeXml(route.lastmod)}</lastmod>`);
  lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
  lines.push(`    <priority>${route.priority}</priority>`);
  lines.push('  </url>');
  return lines.join('\n');
}

const entries = orderedRoutes.map((route) => urlEntry(route));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
  `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  '',
].join('\n');

mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);
writeFileSync(join(publicDir, 'robots.txt'), robots);

console.log(`[sitemap] ${orderedRoutes.length} routes -> client/public/sitemap.xml`);
