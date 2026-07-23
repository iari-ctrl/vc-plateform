import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  appRouteUrl,
  normalizeBaseUrl,
  publicAssetUrl,
  resolveSiteBaseUrl,
} from './base-url.mjs';

test('normalizeBaseUrl returns one canonical Vite base', () => {
  const cases = [
    ['', '/'],
    ['/', '/'],
    ['/vc-platform', '/vc-platform/'],
    ['/vc-platform/', '/vc-platform/'],
    ['https://example.test/vc-platform/', '/vc-platform/'],
  ];

  for (const [input, expected] of cases) {
    assert.equal(normalizeBaseUrl(input), expected, input || '(empty)');
  }
});

test('appRouteUrl prefixes application routes without losing the root route', () => {
  assert.equal(appRouteUrl('/', '/'), '/');
  assert.equal(appRouteUrl('/home', '/'), '/home');
  assert.equal(appRouteUrl('/', '/vc-platform/'), '/vc-platform/');
  assert.equal(appRouteUrl('/home', '/vc-platform'), '/vc-platform/home');
  assert.equal(appRouteUrl('/glossary?term=moic', '/vc-platform/'), '/vc-platform/glossary?term=moic');
});

test('publicAssetUrl resolves relative and slash-prefixed public assets under the deploy base', () => {
  assert.equal(publicAssetUrl('splash/bg-claire.webp', '/'), '/splash/bg-claire.webp');
  assert.equal(publicAssetUrl('/blog/article/hero.webp', '/vc-platform/'), '/vc-platform/blog/article/hero.webp');
});

test('resolveSiteBaseUrl combines an explicit or runtime origin with the deploy base', () => {
  assert.equal(resolveSiteBaseUrl('', '/', 'https://preview.example'), 'https://preview.example');
  assert.equal(resolveSiteBaseUrl('', '/vc-platform/', 'https://preview.example'), 'https://preview.example/vc-platform');
  assert.equal(resolveSiteBaseUrl('https://public.example', '/vc-platform/'), 'https://public.example/vc-platform');
  assert.equal(
    resolveSiteBaseUrl('https://public.example/vc-platform/', '/vc-platform/'),
    'https://public.example/vc-platform',
  );
  assert.equal(resolveSiteBaseUrl('', '/vc-platform/'), undefined);
});

test('resolveSiteBaseUrl rejects a canonical path that conflicts with the deploy base', () => {
  assert.throws(
    () => resolveSiteBaseUrl('https://public.example/other/', '/vc-platform/'),
    /must match the deployment base/,
  );
});

test('the web manifest resolves its scope, start URL and icons beside the manifest file', () => {
  const manifest = JSON.parse(readFileSync(new URL('../client/public/site.webmanifest', import.meta.url), 'utf8'));
  const manifestUrl = new URL('https://example.test/vc-platform/site.webmanifest');

  assert.equal(new URL(manifest.start_url, manifestUrl).pathname, '/vc-platform/');
  assert.equal(new URL(manifest.scope, manifestUrl).pathname, '/vc-platform/');
  assert.deepEqual(
    manifest.icons.map(({ src }) => new URL(src, manifestUrl).pathname),
    ['/vc-platform/pwa-192.png', '/vc-platform/pwa-512.png'],
  );
});
