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
// usePageMeta produces, with zero changes to the app. The client bundles its
// content, so the complete product renders during the crawl without a service
// dependency.
//
// Route list is the SAME enumeration the sitemap uses (scripts/collect-routes.mjs:
// static pages from shared/routes.mjs + collections from data/). Shared noindex
// route patterns are excluded by the collector.
//
// Flags:
//   --strict            fail on any incomplete route (the default)
//   --tolerant          explicit local-only fail-open mode
//   --filter=<substr>   only prerender URLs containing <substr>
//   --concurrency=<n>   parallel pages (default 6)
//   --limit=<n>         cap the number of URLs (after filtering) — for smoke tests
//   --port=<n>          static server port (default 4317)
//   --dist-dir=<path>   built client directory (default client/dist)
//   --browser-ws-endpoint=<url> reuse an explicit Chromium instance (integration only)

import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { appRouteUrl, normalizeBaseUrl, resolveSiteBaseUrl } from '../shared/base-url.mjs';
import { LEGACY_REDIRECTS } from '../shared/routes.mjs';
import { collectRoutes } from './collect-routes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'client', 'dist');
const NOT_FOUND_ROUTE = '/__vcpx-not-found__';

// --- CLI ---------------------------------------------------------------------

function readFlag(argv, name, fallback) {
  const prefix = `--${name}=`;
  const hit = argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

// --- config helpers ----------------------------------------------------------

function withoutBasePath(pathname, baseUrl) {
  const basePath = baseUrl === '/' ? '/' : baseUrl.slice(0, -1);
  if (basePath === '/') return pathname;
  if (pathname === basePath) return '/';
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
}

function resolveSiteUrl(baseUrl) {
  const resolved = resolveSiteBaseUrl(process.env.VITE_SITE_URL?.trim(), baseUrl);
  if (!resolved) {
    throw new Error(
      '[prerender] VITE_SITE_URL est requis : aucune origine canonique de production ne peut être déduite.',
    );
  }

  return resolved;
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
function startStaticServer(shellHtml, { baseUrl, directory, port }) {
  return new Promise((resolveServer, reject) => {
    const rootDirectory = resolve(directory);
    const server = createServer((req, res) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      } catch {
        res.writeHead(400).end('Bad request');
        return;
      }
      const distPathname = withoutBasePath(pathname, baseUrl);
      const ext = extname(distPathname.split('/').pop() ?? '');

      if (ext) {
        const filePath = resolve(rootDirectory, distPathname.replace(/^\/+/, ''));
        if (filePath.startsWith(`${rootDirectory}${sep}`) && existsSync(filePath)) {
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
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      resolveServer({
        origin: `http://127.0.0.1:${actualPort}`,
        close: () => new Promise((resolveClose, rejectClose) => {
          server.close((error) => (error ? rejectClose(error) : resolveClose()));
        }),
      });
    });
  });
}

// --- crawl -------------------------------------------------------------------

export function requiredMetadataIssues(metadata, options = {}) {
  const {
    allowCanonical = true,
    expectedCanonical,
    requireNoindex = false,
  } = options;
  const issues = [];
  const required = [
    ['title', metadata.title],
    ['root', metadata.rootChildCount > 0],
    ['description', metadata.description],
    ['og:title', metadata.ogTitle],
    ['og:description', metadata.ogDescription],
    ['og:image', metadata.ogImage],
    ['twitter:card', metadata.twitterCard],
    ['twitter:title', metadata.twitterTitle],
    ['twitter:description', metadata.twitterDescription],
    ['twitter:image', metadata.twitterImage],
  ];

  for (const [name, value] of required) {
    if (!value) issues.push(name);
  }

  if (allowCanonical) {
    if (!metadata.canonical || (expectedCanonical && metadata.canonical !== expectedCanonical)) {
      issues.push('canonical');
    }
    if (!metadata.ogUrl || (expectedCanonical && metadata.ogUrl !== expectedCanonical)) {
      issues.push('og:url');
    }
  } else {
    if (metadata.canonical) issues.push('canonical:unexpected');
    if (metadata.ogUrl) issues.push('og:url:unexpected');
  }

  const hasNoindex = String(metadata.robots ?? '')
    .toLowerCase()
    .split(',')
    .map((value) => value.trim())
    .includes('noindex');
  if (requireNoindex && !hasNoindex) issues.push('robots:noindex');
  if (!requireNoindex && hasNoindex) issues.push('robots:unexpected-noindex');

  return issues;
}

async function renderOne(page, request) {
  const {
    allowCanonical = true,
    baseUrl,
    origin,
    requireNoindex = false,
    siteUrl,
    urlPath,
  } = request;
  await page.goto(`${origin}${appRouteUrl(urlPath, baseUrl)}`, { waitUntil: 'load', timeout: 45_000 });

  // Detail pages (e.g. LessonPage) read their title from a lazily-imported body
  // chunk, so usePageMeta first runs with an undefined title (generic card) and
  // only re-runs with the page-specific one once that async data resolves.
  // Waiting for the network to go idle lets those chunks land before we
  // snapshot; the canonical link then confirms usePageMeta ran.
  await page.waitForNetworkIdle({ idleTime: 600, timeout: 20_000 }).catch(() => {});

  let metaReady = true;
  try {
    await page.waitForFunction(
      (canonicalAllowed, noindexRequired) => {
        const content = (selector) => document.querySelector(selector)?.getAttribute('content')?.trim() ?? '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() ?? '';
        const robots = content('meta[name="robots"]').toLowerCase().split(',').map((value) => value.trim());
        return (
          !!document.title.trim() &&
          (document.getElementById('root')?.childElementCount ?? 0) > 0 &&
          !!content('meta[name="description"]') &&
          !!content('meta[property="og:title"]') &&
          !!content('meta[property="og:description"]') &&
          !!content('meta[property="og:image"]') &&
          !!content('meta[name="twitter:card"]') &&
          !!content('meta[name="twitter:title"]') &&
          !!content('meta[name="twitter:description"]') &&
          !!content('meta[name="twitter:image"]') &&
          (canonicalAllowed ? !!canonical && !!content('meta[property="og:url"]') : !canonical && !content('meta[property="og:url"]')) &&
          (!noindexRequired || robots.includes('noindex'))
        );
      },
      { timeout: 15_000 },
      allowCanonical,
      requireNoindex,
    );
  } catch {
    metaReady = false;
  }

  const metadata = await page.evaluate(() => {
    const content = (selector) => document.querySelector(selector)?.getAttribute('content')?.trim() ?? '';
    return {
      title: document.title.trim(),
      rootChildCount: document.getElementById('root')?.childElementCount ?? 0,
      description: content('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() ?? '',
      robots: content('meta[name="robots"]'),
      ogTitle: content('meta[property="og:title"]'),
      ogDescription: content('meta[property="og:description"]'),
      ogUrl: content('meta[property="og:url"]'),
      ogImage: content('meta[property="og:image"]'),
      twitterCard: content('meta[name="twitter:card"]'),
      twitterTitle: content('meta[name="twitter:title"]'),
      twitterDescription: content('meta[name="twitter:description"]'),
      twitterImage: content('meta[name="twitter:image"]'),
    };
  });
  const expectedCanonical = allowCanonical
    ? new URL(appRouteUrl(urlPath, baseUrl), new URL(siteUrl).origin).toString()
    : undefined;
  const missingMetadata = requiredMetadataIssues(metadata, {
    allowCanonical,
    expectedCanonical,
    requireNoindex,
  });
  let html = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`);

  // VITE_SITE_URL should already be baked into the client metadata. Replacing the
  // local crawl origin is a deterministic safety net that preserves the base path.
  html = html.split(origin).join(new URL(siteUrl).origin);

  return { html, metaReady, metadata, missingMetadata };
}

export function outPathFor(path, directory) {
  const rootDirectory = resolve(directory);
  const routePath = String(path).split(/[?#]/, 1)[0];
  if (routePath.includes('\\')) throw new Error(`chemin de route invalide: ${path}`);
  const slashPrefixedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const outputPath = resolve(rootDirectory, `.${slashPrefixedPath}`, 'index.html');
  if (!outputPath.startsWith(`${rootDirectory}${sep}`)) {
    throw new Error(`sortie de pré-rendu hors du répertoire cible: ${path}`);
  }
  return outputPath;
}

/** Build a host-agnostic static redirect page for retired public URLs. */
export function buildRedirectHtml(targetPath, baseUrl = '/') {
  const target = appRouteUrl(targetPath, baseUrl);
  const scriptTarget = JSON.stringify(target).replace(/</g, '\\u003c');
  return [
    '<!doctype html>',
    '<html lang="fr">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <meta name="robots" content="noindex">',
    `  <meta http-equiv="refresh" content="0; url=${target}">`,
    '  <title>Redirection · VC Premium Experience</title>',
    `  <script>window.location.replace(${scriptTarget});</script>`,
    '</head>',
    `<body><p>Cette page a été retirée. <a href="${target}">Ouvrir la Bibliothèque</a>.</p></body>`,
    '</html>',
    '',
  ].join('\n');
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/** Exact ordered route set consumed by the prerender. */
export function routesForPrerender() {
  return [
    ...collectRoutes(),
    ...LEGACY_REDIRECTS.map(({ from, to }) => ({ path: from, redirectTo: to })),
  ].sort((a, b) => a.path.localeCompare(b.path));
}

export class PrerenderError extends Error {
  constructor(summary) {
    super(`[prerender] échec strict: ${summary.issues.join(', ')}`);
    this.name = 'PrerenderError';
    this.summary = summary;
  }
}

function finalizeSummary(summary, tolerant) {
  const issues = [];
  if (summary.infrastructureError) issues.push('infrastructure-error');
  if (summary.browserError) issues.push('browser-unavailable');
  if (summary.written !== summary.expected) issues.push('count-mismatch');
  if (summary.routeFailures.length > 0) issues.push('route-failures');
  if (summary.metadataFailures.length > 0) issues.push('metadata-failures');
  if (!summary.notFoundWritten) issues.push('404-missing');
  if (summary.notFoundFailure) issues.push('404-invalid');
  summary.issues = issues;
  summary.ok = issues.length === 0;

  if (!summary.ok && !tolerant) throw new PrerenderError(summary);
  return summary;
}

export async function runPrerender(options, injected = {}) {
  const {
    baseUrl = '/',
    concurrency = 6,
    distDir: outputDirectory = distDir,
    routes = [],
    siteUrl,
    tolerant = false,
  } = options;
  const normalizedRoutes = routes.map((route) => (
    typeof route === 'string' ? { path: route } : route
  ));
  const redirectRoutes = normalizedRoutes.filter((route) => route.redirectTo);
  const routePaths = normalizedRoutes.filter((route) => !route.redirectTo).map((route) => route.path);
  const summary = {
    mode: tolerant ? 'tolerant' : 'strict',
    expected: normalizedRoutes.length,
    attempted: 0,
    written: 0,
    routeFailures: [],
    metadataFailures: [],
    browserError: null,
    infrastructureError: null,
    notFoundWritten: false,
    notFoundFailure: null,
    issues: [],
    ok: false,
  };

  const readShell = injected.readShell ?? (() => {
    const shellPath = join(outputDirectory, 'index.html');
    if (!existsSync(shellPath)) {
      throw new Error(`${shellPath} introuvable — lance d'abord le build client.`);
    }
    return readFileSync(shellPath, 'utf8');
  });
  const launchBrowser = injected.launchBrowser ?? (() => puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }));
  const renderRoute = injected.renderRoute ?? renderOne;
  const writeHtml = injected.writeHtml ?? ((path, html) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, html);
  });
  const openServer = injected.startServer ?? ((shellHtml) => startStaticServer(shellHtml, {
    baseUrl,
    directory: outputDirectory,
    port: options.port ?? 4317,
  }));

  let server;
  let browser;
  try {
    const shellHtml = readShell();

    for (const redirect of redirectRoutes) {
      summary.attempted += 1;
      try {
        writeHtml(
          outPathFor(redirect.path, outputDirectory),
          buildRedirectHtml(redirect.redirectTo, baseUrl),
        );
        summary.written += 1;
      } catch (error) {
        summary.routeFailures.push({ path: redirect.path, message: errorMessage(error) });
      }
      injected.onProgress?.(summary.attempted, summary.expected);
    }

    server = await openServer(shellHtml);

    try {
      browser = await launchBrowser();
    } catch (error) {
      summary.browserError = errorMessage(error);
    }

    if (browser) {
      const queue = [...routePaths];
      const worker = async () => {
        let page;
        try {
          try {
            page = await browser.newPage();
          } catch (error) {
            summary.infrastructureError ??= `initialisation page Chromium: ${errorMessage(error)}`;
            return;
          }

          while (queue.length > 0) {
            const urlPath = queue.shift();
            summary.attempted += 1;
            try {
              const result = await renderRoute(page, {
                allowCanonical: true,
                baseUrl,
                origin: server.origin,
                requireNoindex: false,
                siteUrl,
                urlPath,
              });
              if (!result.metaReady || result.missingMetadata.length > 0) {
                summary.metadataFailures.push({
                  path: urlPath,
                  missing: result.missingMetadata,
                  metaReady: result.metaReady,
                });
              } else {
                writeHtml(outPathFor(urlPath, outputDirectory), result.html);
                summary.written += 1;
              }
            } catch (error) {
              summary.routeFailures.push({ path: urlPath, message: errorMessage(error) });
            }
            injected.onProgress?.(summary.attempted, summary.expected);
          }
        } finally {
          if (page) {
            try {
              await page.close();
            } catch (error) {
              summary.infrastructureError ??= `fermeture page Chromium: ${errorMessage(error)}`;
            }
          }
        }
      };

      const workerResults = await Promise.allSettled(Array.from(
        { length: Math.min(Math.max(1, concurrency), Math.max(1, routePaths.length)) },
        () => worker(),
      ));
      for (const result of workerResults) {
        if (result.status === 'rejected') {
          summary.infrastructureError ??= `worker de pré-rendu: ${errorMessage(result.reason)}`;
        }
      }

      let notFoundPage;
      try {
        notFoundPage = await browser.newPage();
        const result = await renderRoute(notFoundPage, {
          allowCanonical: false,
          baseUrl,
          origin: server.origin,
          requireNoindex: true,
          siteUrl,
          urlPath: NOT_FOUND_ROUTE,
        });
        if (!result.metaReady || result.missingMetadata.length > 0) {
          summary.notFoundFailure = {
            message: 'métadonnées 404 incomplètes',
            missing: result.missingMetadata,
            metaReady: result.metaReady,
          };
        } else {
          writeHtml(join(outputDirectory, '404.html'), result.html);
          summary.notFoundWritten = true;
        }
      } catch (error) {
        summary.notFoundFailure = errorMessage(error);
      } finally {
        if (notFoundPage) {
          try {
            await notFoundPage.close();
          } catch (error) {
            summary.infrastructureError ??= `fermeture page 404 Chromium: ${errorMessage(error)}`;
          }
        }
      }
    }
  } catch (error) {
    summary.infrastructureError = errorMessage(error);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        summary.infrastructureError ??= `fermeture Chromium: ${errorMessage(error)}`;
      }
    }
    if (server) {
      try {
        await server.close();
      } catch (error) {
        summary.infrastructureError ??= `fermeture serveur: ${errorMessage(error)}`;
      }
    }
  }

  return finalizeSummary(summary, tolerant);
}

async function runCli() {
  const argv = process.argv.slice(2);
  const strictFlag = argv.includes('--strict');
  const tolerant = argv.includes('--tolerant');
  if (strictFlag && tolerant) throw new Error('[prerender] --strict et --tolerant sont incompatibles.');

  const filter = readFlag(argv, 'filter', '');
  const concurrency = Math.max(1, Number(readFlag(argv, 'concurrency', '6')) || 6);
  const limit = Number(readFlag(argv, 'limit', '0')) || 0;
  const port = Number(readFlag(argv, 'port', '4317')) || 4317;
  const outputDirectory = resolve(readFlag(argv, 'dist-dir', distDir));
  const browserWSEndpoint = readFlag(argv, 'browser-ws-endpoint', '');
  const baseUrl = normalizeBaseUrl(process.env.VITE_BASE_URL ?? process.env.BASE_URL);
  const siteUrl = resolveSiteUrl(baseUrl);
  const allRoutes = routesForPrerender();
  let routes = allRoutes;
  if (filter) routes = routes.filter((route) => route.path.includes(filter));
  if (limit > 0) routes = routes.slice(0, limit);

  console.log(
    `[prerender] ${allRoutes.length} routes → ${routes.length} URL(s)${
      filter ? ` (filtre « ${filter} »)` : ''
    } — mode ${tolerant ? 'tolérant explicite' : 'strict'}`,
  );
  const dependencies = {
    onProgress: (done, expected) => {
      if (done % 25 === 0 || done === expected) {
        process.stdout.write(`\r[prerender] ${done}/${expected} rendus`);
      }
    },
  };
  if (browserWSEndpoint) {
    dependencies.launchBrowser = async () => {
      const connectedBrowser = await puppeteer.connect({ browserWSEndpoint });
      return {
        newPage: () => connectedBrowser.newPage(),
        close: async () => connectedBrowser.disconnect(),
      };
    };
  }

  const summary = await runPrerender({
    baseUrl,
    concurrency,
    distDir: outputDirectory,
    port,
    routes,
    siteUrl,
    tolerant,
  }, dependencies);
  if (summary.attempted > 0) process.stdout.write('\n');
  console.log(`[prerender:summary] ${JSON.stringify(summary)}`);
  if (!summary.ok) console.warn('[prerender] résultat incomplet accepté uniquement par --tolerant.');
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  runCli().catch((error) => {
    if (error instanceof PrerenderError) {
      console.error(`[prerender:summary] ${JSON.stringify(error.summary)}`);
    }
    console.error('[prerender] échec:', errorMessage(error));
    process.exitCode = 1;
  });
}
