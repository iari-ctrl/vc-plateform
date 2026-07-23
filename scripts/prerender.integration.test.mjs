import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { createServer as createViteServer } from 'vite';

/* global document, location */

const prerenderScript = fileURLToPath(new URL('./prerender.mjs', import.meta.url));
const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const clientRoot = fileURLToPath(new URL('../client', import.meta.url));

const fixtureHtml = `<!doctype html>
<html lang="fr">
  <head><meta charset="UTF-8"></head>
  <body>
    <div id="root"></div>
    <script>
      const appPath = location.pathname.replace(/^\\/vc-plateform(?=\\/|$)/, '') || '/';
      const notFound = appPath === '/__vcpx-not-found__';
      const canonical = 'https://example.test/vc-plateform' + (appPath === '/' ? '' : appPath);
      const title = notFound ? 'Terra Incognita' : 'Accueil';
      const description = notFound ? 'Page introuvable.' : 'Accueil de contrôle.';
      const image = 'https://example.test/vc-plateform/og/default.png';
      const upsert = (attribute, key, content) => {
        let tag = document.head.querySelector('meta[' + attribute + '="' + key + '"]');
        if (!content) { tag?.remove(); return; }
        tag ||= document.createElement('meta');
        tag.setAttribute(attribute, key);
        tag.setAttribute('content', content);
        if (!tag.parentNode) document.head.appendChild(tag);
      };
      document.title = title + ' · VC Premium Experience';
      upsert('name', 'description', description);
      upsert('name', 'robots', notFound ? 'noindex,nofollow' : '');
      upsert('property', 'og:title', document.title);
      upsert('property', 'og:description', description);
      upsert('property', 'og:url', notFound ? '' : canonical);
      upsert('property', 'og:image', image);
      upsert('name', 'twitter:card', 'summary_large_image');
      upsert('name', 'twitter:title', document.title);
      upsert('name', 'twitter:description', description);
      upsert('name', 'twitter:image', image);
      if (!notFound) {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonical;
        document.head.appendChild(link);
      }
      document.getElementById('root').innerHTML = '<main><h1>' + title + '</h1></main>';
    </script>
  </body>
</html>`;

async function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'vcpx-prerender-'));
  writeFileSync(join(directory, 'index.html'), fixtureHtml);
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function runCli(directory, port, extraEnv = {}, extraArgs = []) {
  const env = {
    ...process.env,
    VITE_BASE_URL: '/vc-plateform/',
    VITE_SITE_URL: 'https://example.test/vc-plateform',
    ...extraEnv,
  };
  if (!Object.hasOwn(extraEnv, 'PUPPETEER_EXECUTABLE_PATH')) delete env.PUPPETEER_EXECUTABLE_PATH;

  const child = spawn(process.execPath, [
    prerenderScript,
    '--strict',
    '--filter=/home',
    '--limit=1',
    '--concurrency=1',
    `--port=${port}`,
    `--dist-dir=${directory}`,
    ...extraArgs,
  ], {
    cwd: projectRoot,
    env,
  });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`prerender CLI timed out\n${stdout}\n${stderr}`));
    }, 60_000);
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('close', (status, signal) => {
      clearTimeout(timeout);
      resolve({ status, signal, stdout, stderr });
    });
  });
}

async function verifyReactHeadPolicies(browser) {
  const previousBaseUrl = process.env.VITE_BASE_URL;
  const previousSiteUrl = process.env.VITE_SITE_URL;
  const previousWorkingDirectory = process.cwd();
  process.env.VITE_BASE_URL = '/';
  process.env.VITE_SITE_URL = 'https://example.test';
  process.chdir(clientRoot);

  let vite;
  try {
    vite = await createViteServer({
      root: clientRoot,
      logLevel: 'silent',
      server: { host: '127.0.0.1', port: await availablePort(), strictPort: true },
    });
    await vite.listen();
    const address = vite.httpServer?.address();
    assert.ok(address && typeof address === 'object');

    const page = await browser.newPage();
    const browserMessages = [];
    const failedResponses = [];
    page.on('console', (message) => browserMessages.push(`${message.type()}: ${message.text()}`));
    page.on('pageerror', (error) => browserMessages.push(`pageerror: ${error.message}`));
    page.on('response', (response) => {
      if (response.status() >= 400) failedResponses.push(response);
    });
    await page.goto(`http://127.0.0.1:${address.port}/courses/slug-inexistant`, {
      waitUntil: 'networkidle0',
    });
    try {
      await page.waitForSelector('#root > *', { timeout: 10_000 });
    } catch (error) {
      const state = await page.evaluate(() => ({
        body: document.body.textContent?.trim(),
        root: document.getElementById('root')?.innerHTML,
        title: document.title,
        url: location.href,
      }));
      const failures = await Promise.all(failedResponses.map(async (response) => (
        `${response.status()} ${response.url()}\n${await response.text().catch(() => '')}`
      )));
      throw new Error(`${error.message}\n${JSON.stringify(state)}\n${browserMessages.join('\n')}\n${failures.join('\n')}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));

    const head = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector('h1')?.textContent?.trim(),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ogType: document.querySelector('meta[property="og:type"]')?.getAttribute('content'),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    }));

    assert.match(head.title, /^Terra Incognita/, browserMessages.join('\n'));
    assert.equal(head.heading, 'Terra Incognita');
    assert.equal(head.robots, 'noindex,nofollow');
    assert.equal(head.canonical, undefined);
    assert.equal(head.ogType, 'website');
    assert.equal(head.ogUrl, undefined);

    for (const { route, resourceExists } of [
      { route: '/parcours/venture-philanthropy-foundations/diagnostic', resourceExists: true },
      { route: '/certifications/analyste-en-capital-risque/evaluation', resourceExists: true },
      { route: '/cases/insertion-3-regions/correction', resourceExists: true },
    ]) {
      await page.goto(`http://127.0.0.1:${address.port}${route}`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('#root > *', { timeout: 10_000 });
      await page.waitForFunction(() => (
        document.querySelector('meta[name="robots"]')?.getAttribute('content') === 'noindex,nofollow'
        && !document.querySelector('link[rel="canonical"]')
        && !document.querySelector('meta[property="og:url"]')
      ));
      const title = await page.title();
      if (resourceExists) {
        assert.doesNotMatch(title, /^Terra Incognita/, `${route} rendered as an unknown resource`);
      } else {
        assert.match(title, /^Terra Incognita/, `${route} unexpectedly resolved to a resource`);
      }
    }
    await page.close();
  } finally {
    await vite?.close();
    if (previousBaseUrl === undefined) delete process.env.VITE_BASE_URL;
    else process.env.VITE_BASE_URL = previousBaseUrl;
    if (previousSiteUrl === undefined) delete process.env.VITE_SITE_URL;
    else process.env.VITE_SITE_URL = previousSiteUrl;
    process.chdir(previousWorkingDirectory);
  }
}

function summaryFrom(result) {
  const matches = [...`${result.stdout}\n${result.stderr}`.matchAll(/\[prerender:summary\] (\{[^\n]+\})/g)];
  assert.ok(matches.length > 0, `missing summary in output:\n${result.stdout}\n${result.stderr}`);
  return JSON.parse(matches.at(-1)[1]);
}

test('strict CLI exits non-zero when the real Chromium executable is unavailable', async (t) => {
  const directory = fixture(t);
  const result = await runCli(directory, await availablePort(), {
    PUPPETEER_EXECUTABLE_PATH: '/definitely/missing/chromium',
  });
  const summary = summaryFrom(result);

  assert.equal(result.status, 1);
  assert.equal(summary.ok, false);
  assert.deepEqual(summary.issues, ['browser-unavailable', 'count-mismatch', '404-missing']);
  assert.match(summary.browserError, /Browser was not found|executable/i);
});

test('strict CLI and React use one real Chromium for routes, 404 and noindex metadata', { timeout: 60_000 }, async (t) => {
  const directory = fixture(t);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const result = await runCli(directory, await availablePort(), {}, [
      `--browser-ws-endpoint=${browser.wsEndpoint()}`,
    ]);
    const summary = summaryFrom(result);

    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.deepEqual(summary, {
      mode: 'strict',
      expected: 1,
      attempted: 1,
      written: 1,
      routeFailures: [],
      metadataFailures: [],
      browserError: null,
      infrastructureError: null,
      notFoundWritten: true,
      notFoundFailure: null,
      issues: [],
      ok: true,
    });

    const homePath = join(directory, 'home', 'index.html');
    const notFoundPath = join(directory, '404.html');
    assert.equal(existsSync(homePath), true);
    assert.equal(existsSync(notFoundPath), true);
    const home = readFileSync(homePath, 'utf8');
    const notFound = readFileSync(notFoundPath, 'utf8');
    assert.match(home, /https:\/\/example\.test\/vc-plateform\/home/);
    assert.match(home, /<div id="root"><main><h1>Accueil<\/h1><\/main><\/div>/);
    assert.match(notFound, /name="robots" content="noindex,nofollow"/);
    assert.doesNotMatch(notFound, /rel="canonical"/);
    assert.doesNotMatch(notFound, /property="og:url"/);

    await verifyReactHeadPolicies(browser);
  } finally {
    await browser.close();
  }
});
