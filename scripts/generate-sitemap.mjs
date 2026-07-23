#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appRouteUrl, normalizeBaseUrl, resolveSiteBaseUrl } from '../shared/base-url.mjs';
import { collectRoutes } from './collect-routes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'client', 'public');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteUrl(path, { baseUrl, siteUrl }) {
  return new URL(appRouteUrl(path, baseUrl), new URL(siteUrl).origin).toString();
}

/** Exact ordered route set consumed by the sitemap. */
export function routesForSitemap() {
  return collectRoutes();
}

function urlEntry(route, config) {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(route.path, config))}</loc>`,
  ];
  if (route.lastmod) lines.push(`    <lastmod>${escapeXml(route.lastmod)}</lastmod>`);
  lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
  lines.push(`    <priority>${route.priority}</priority>`);
  lines.push('  </url>');
  return lines.join('\n');
}

export function buildSitemapXml({ baseUrl, siteUrl, routes = routesForSitemap() }) {
  const entries = routes.map((route) => urlEntry(route, { baseUrl, siteUrl }));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.join('\n'),
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * `noindex` pages remain crawlable so robots can read their HTML directive.
 * Hosts able to set `X-Robots-Tag` may add an equivalent header policy, but a
 * robots.txt `Disallow` must not hide the directive.
 */
export function buildRobotsTxt({ baseUrl, siteUrl }) {
  return [
    'User-agent: *',
    `Allow: ${appRouteUrl('/', baseUrl)}`,
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml', { baseUrl, siteUrl })}`,
    '',
  ].join('\n');
}

export function generateSitemap({ env = process.env, outputDirectory = publicDir } = {}) {
  const baseUrl = normalizeBaseUrl(env.VITE_BASE_URL ?? env.BASE_URL);
  const siteUrl = resolveSiteBaseUrl(env.VITE_SITE_URL?.trim(), baseUrl);
  if (!siteUrl) {
    throw new Error(
      '[sitemap] VITE_SITE_URL est requis : aucune origine canonique de production ne peut être déduite.',
    );
  }

  const routes = routesForSitemap();
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'sitemap.xml'), buildSitemapXml({ baseUrl, siteUrl, routes }));
  writeFileSync(join(outputDirectory, 'robots.txt'), buildRobotsTxt({ baseUrl, siteUrl }));
  console.log(`[sitemap] ${routes.length} routes -> client/public/sitemap.xml`);
  return { baseUrl, count: routes.length, siteUrl };
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) generateSitemap();
