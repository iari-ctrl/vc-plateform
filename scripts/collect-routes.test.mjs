import assert from 'node:assert/strict';
import test from 'node:test';

import { collectRoutes } from './collect-routes.mjs';

test('collectRoutes excludes draft blog posts and keeps default-published posts', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/blog/flatland-cecite-dimensionnelle'), false);
  assert.equal(paths.has('/blog/voir-comme-un-etat'), true);
});
