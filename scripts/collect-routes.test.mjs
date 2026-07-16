import assert from 'node:assert/strict';
import test from 'node:test';

import { collectRoutes } from './collect-routes.mjs';

test('collectRoutes excludes draft blog posts and keeps default-published posts', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/blog/flatland-cecite-dimensionnelle'), false);
  assert.equal(paths.has('/blog/voir-comme-un-etat'), true);
});

test('collectRoutes keeps parcours and library subjects on distinct canonical prefixes', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/parcours'), true);
  assert.equal(paths.has('/parcours/le-vc-sans-bullshit'), true);
  assert.equal(paths.has('/bibliotheque'), true);
  assert.equal(paths.has('/bibliotheque/decouvrir-le-capital-risque'), true);
  assert.equal([...paths].some((path) => path === '/paths' || path.startsWith('/paths/')), false);
});

test('collectRoutes publishes the certification catalogue and Analyst detail route', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/certifications'), true);
  assert.equal(paths.has('/certifications/analyste-en-capital-risque'), true);
});

test('collectRoutes excludes upcoming lessons while keeping published lessons', () => {
  const paths = new Set(collectRoutes().map((route) => route.path));

  assert.equal(paths.has('/lessons/preseed-equipe-sans-historique'), false);
  assert.equal(paths.has('/lessons/gestion-pipeline-crm-investissement'), true);
  assert.equal(paths.has('/lessons/le-capital-risque-vraiment'), true);
});
