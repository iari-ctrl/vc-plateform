import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = readFileSync(join(root, '.github', 'workflows', 'deploy-pages.yml'), 'utf8');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

test('Pages remains manual and separates read-only build from privileged deployment', () => {
  assert.match(workflow, /^\s{2}workflow_dispatch:\s*$/m);
  assert.doesNotMatch(workflow, /^\s{2}(push|pull_request):/m);
  assert.match(workflow, /^\s{2}build:\s*$/m);
  assert.match(workflow, /^\s{2}deploy:\s*$/m);
  assert.match(workflow, /^\s{4}needs: build\s*$/m);
  assert.match(workflow, /^\s{6}contents: read\s*$/m);
  assert.match(workflow, /^\s{6}pages: write\s*$/m);
  assert.match(workflow, /^\s{6}id-token: write\s*$/m);
  assert.doesNotMatch(workflow, /contents: write/);
});

test('every action is immutable and checkout does not persist credentials', () => {
  const uses = [...workflow.matchAll(/^\s*- uses:\s*([^\s#]+)(?:\s+#\s*(.+))?$/gm)];
  assert.equal(uses.length >= 4, true);
  for (const [, reference, comment] of uses) {
    assert.match(reference, /^[\w.-]+\/[\w.-]+@[a-f0-9]{40}$/);
    assert.match(comment ?? '', /^v\d/);
  }
  assert.match(workflow, /actions\/checkout@[a-f0-9]{40}[^\n]*\n\s+with:\n\s+persist-credentials: false/);
});

test('publication runs the full gate, uploads the artifact and never copies the shell as 404', () => {
  assert.match(workflow, /^\s*- run: npm run check\s*$/m);
  assert.match(workflow, /^\s*- run: npm run build\s*$/m);
  assert.match(workflow, /actions\/upload-pages-artifact@[a-f0-9]{40}/);
  assert.match(workflow, /actions\/deploy-pages@[a-f0-9]{40}/);
  assert.doesNotMatch(workflow, /cp\s+client\/dist\/index\.html\s+client\/dist\/404\.html/);
});

test('the build lifecycle uses strict prerender by default and keeps tolerance explicit', () => {
  assert.equal(packageJson.scripts.postbuild, 'npm run prerender:strict');
  assert.equal(packageJson.scripts.prerender, 'npm run prerender:strict');
  assert.equal(packageJson.scripts['prerender:strict'], 'node scripts/prerender.mjs --strict');
  assert.equal(packageJson.scripts['prerender:tolerant'], 'node scripts/prerender.mjs --tolerant');
});

test('the root lint gate covers client code and Node ESM surfaces', () => {
  assert.equal(packageJson.scripts.lint, 'npm run lint:client && npm run lint:node');
  assert.equal(packageJson.scripts['lint:client'], 'npm run lint --workspace client');
  assert.match(packageJson.scripts['lint:node'], /scripts shared \.claude\/hooks/);
  assert.match(packageJson.scripts.check, /npm run lint/);
});
