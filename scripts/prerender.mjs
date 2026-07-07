#!/usr/bin/env node
// Static prerender of the public routes — the SEO/social-sharing fix.
//
// The site is a pure client-rendered SPA: client/index.html ships only generic
// metadata, and the per-page <title>/<meta og:*>/<link canonical> are
// injected at runtime by usePageMeta (client/src/lib/seo.ts) inside a React
// effect. Social-share scrapers (Open Graph/Twitter, LinkedIn, Slack, Discord)
// and many crawlers do NOT execute JavaScript, so every shared link fell back to
// the generic card.
//
// This step runs AFTER `vite build`. It serves the built client/dist, drives a
// headless Chromium over every public route, waits for hydration to finish (so
// usePageMeta has run and the head carries the page-specific tags), then writes
// the rendered DOM to client/dist/<route>/index.html. A static host serving
// those files now hands a fully-populated <head> (and pre-rendered body) to
// scrapers and no-JS crawlers, while the SPA still hydrates over it for users.
//
// Why a Puppeteer crawl rather than vite-react-ssg / a true SSG: usePageMeta
// writes the metadata in a `useEffect`, which never runs during server-side
// rendering. Adopting an SSG would mean rewriting the whole SEO/head layer onto
// an SSR-safe head manager AND auditing every eagerly-rendered provider/component
// for `window`/`document`/`localStorage` access — a large, invasive migration.
// Capturing the post-hydration DOM in a real browser reproduces exactly what
// usePageMeta produces, with zero changes to the app. Content needs no API
// server: the client bundles its content and uses it as the offline/guest
// fallback (useApiData), so the bundled copy renders during the crawl.
//
// Route list is the SAME enumeration the sitemap uses (scripts/collect-routes.mjs:
// static pages from shared/routes.mjs + collections from data/). NOINDEX_SEGMENTS
// are excluded.
//
// Flags:
//   --filter=<substr>   only prerender URLs containing <substr>
//   --concurrency=<n>   parallel pages (default 6)
//   --limit=<n>         cap the number of URLs (after filtering) — for smoke tests
//   --port=<n>          static server port (default 4317)

import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { NOINDEX_SEGMENTS, isNoindexPath } from '../shared/routes.mjs';
import { collectRoutes } from './collect-routes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'client', 'dist');

const FALLBACK_SITE_URL = 'https://vcpx.io';
const SITE_URL_ENV_KEYS = ['SITE_URL', 'VITE_SITE_URL', 'CLIENT_ORIGIN'];

// --- CLI ---------------------------------------------------------------------

function readFlag(name, fallback) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

const FILTER = readFlag('filter', '');
const CONCURRENCY = Math.max(1, Number(readFlag('concurrency', '6')) || 6);
const LIMIT = Number(readFlag('limit', '0')) || 0;
const PORT = Number(readFlag('port', '4317')) || 4317;

// --- config helpers ----------------------------------------------------------

function resolveSiteUrl() {
  const configured = SITE_URL_ENV_KEYS.map((key) => process.env[key]).find(Boolean);
  if (!configured) {
    console.warn(
      `[prerender] SITE_URL/VITE_SITE_URL absent; canonical/og:url assume ${FALLBACK_SITE_URL}. ` +
        'Build with VITE_SITE_URL set so the static <head> carries the production domain.',
    );
  }
  const url = new URL(configured ?? FALLBACK_SITE_URL);
  return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
}

// --- static server over dist -------------------------------------------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json; charset=utf-8',
};

/**
 * Serve dist as an SPA. Requests for asset-like paths (those with a file
 * extension) return the file; any other path (a route) returns the original
 * index.html shell read once at startup — so the per-route files we write at the
 * end never feed back into the crawl, keeping it deterministic and idempotent.
 */
function startStaticServer(shellHtml) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const ext = extname(pathname.split('/').pop() ?? '');

      if (ext) {
        const filePath = join(distDir, pathname);
        if (filePath.startsWith(distDir) && existsSync(filePath)) {
          res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
          res.end(readFileSync(filePath));
          return;
        }
        res.writeHead(404).end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(shellHtml);
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

// --- crawl -------------------------------------------------------------------

async function renderOne(page, origin, urlPath, siteUrl) {
  await page.goto(`${origin}${urlPath}`, { waitUntil: 'load', timeout: 45_000 });

  // Detail pages (e.g. LessonPage) read their title from a lazily-imported body
  // chunk and/or an API overlay, so usePageMeta first runs with an undefined
  // title (generic card) and only re-runs with the page-specific one once that
  // async data resolves. Waiting for the network to go idle lets those chunks
  // land before we snapshot; the canonical link then confirms usePageMeta ran.
  await page.waitForNetworkIdle({ idleTime: 600, timeout: 20_000 }).catch(() => {});

  let metaReady = true;
  try {
    await page.waitForFunction(
      () =>
        !!document.querySelector('link[rel="canonical"]') &&
        !!document.title &&
        (document.getElementById('root')?.childElementCount ?? 0) > 0,
      { timeout: 15_000 },
    );
  } catch {
    metaReady = false;
  }

  let html = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`);

  // If the build did not bake VITE_SITE_URL, seo.ts derives canonical/og:url from
  // window.location.origin (the crawl host). Rewrite it to the production domain
  // so the static <head> is correct regardless. No-op when VITE_SITE_URL was set.
  html = html.split(origin).join(siteUrl);

  return { html, metaReady };
}

function outPathFor(path) {
  return join(distDir, path.replace(/^\//, ''), 'index.html');
}

async function run() {
  if (!existsSync(join(distDir, 'index.html'))) {
    console.error(`[prerender] ${join(distDir, 'index.html')} introuvable — lance d'abord le build client.`);
    process.exit(1);
  }

  const siteUrl = resolveSiteUrl();
  const routePaths = collectRoutes()
    .map((route) => route.path)
    .filter((path) => !isNoindexPath(path));

  let urls = routePaths;
  if (FILTER) urls = urls.filter((url) => url.includes(FILTER));
  if (LIMIT > 0) urls = urls.slice(0, LIMIT);

  console.log(
    `[prerender] ${routePaths.length} routes → ${urls.length} URL(s)${
      FILTER ? ` (filtre « ${FILTER} »)` : ''
    }; exclus: ${NOINDEX_SEGMENTS.join(', ')}`,
  );
  if (urls.length === 0) {
    console.warn('[prerender] aucune URL à prérendre — rien à faire.');
    return;
  }

  const shellHtml = readFileSync(join(distDir, 'index.html'), 'utf8');
  const server = await startStaticServer(shellHtml);
  const origin = `http://127.0.0.1:${PORT}`;

  // A headless browser that won't launch is an environment problem (missing
  // Chromium / system libs on a CI runner), not a build error: warn loudly and
  // skip rather than break the pipeline. The SPA still works without prerender;
  // a production deploy must ensure Chromium is available to get the static SEO.
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  } catch (err) {
    await new Promise((resolve) => server.close(resolve));
    console.warn(
      `[prerender] Chromium introuvable/illançable — étape ignorée (build non bloqué): ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return;
  }

  const warnings = [];
  let written = 0;
  let done = 0;
  const queue = [...urls];

  async function worker() {
    const page = await browser.newPage();
    // The bundle pings the (absent) API; let those requests fail fast instead of
    // logging noise, and never get stuck waiting on them.
    page.on('console', () => {});
    page.on('pageerror', () => {});
    for (let next = queue.shift(); next; next = queue.shift()) {
      const urlPath = next;
      try {
        const { html, metaReady } = await renderOne(page, origin, urlPath, siteUrl);
        const outPath = outPathFor(urlPath);
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(outPath, html);
        written += 1;
        if (!metaReady) warnings.push(`${urlPath} (métadonnées non confirmées — capturé tel quel)`);
      } catch (err) {
        warnings.push(`${urlPath} — ÉCHEC: ${err instanceof Error ? err.message : String(err)}`);
      }
      done += 1;
      if (done % 25 === 0 || done === urls.length) {
        process.stdout.write(`\r[prerender] ${done}/${urls.length} rendus`);
      }
    }
    await page.close();
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  process.stdout.write('\n');

  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  console.log(`[prerender] ${written} fichier(s) HTML écrits sous client/dist/<route>/index.html`);
  if (warnings.length) {
    console.warn(`[prerender] ${warnings.length} avertissement(s):`);
    for (const warning of warnings) console.warn(`  - ${warning}`);
  }
}

run().catch((err) => {
  console.error('[prerender] échec:', err);
  process.exit(1);
});
