import test from 'node:test';
import assert from 'node:assert/strict';

import { collectMediaBudget } from './media-budget.mjs';
import { renderMemoArtifact } from './build-investment-memo.mjs';

test('client public media budget remains deterministic', async () => {
  const budget = await collectMediaBudget(new URL('../client/public/', import.meta.url));

  // Keep the pre-existing media budget exact, plus the explicitly owned tool.
  // Its size follows its canonical source, not a hand-maintained byte counter.
  const memoBytes = Buffer.byteLength(await renderMemoArtifact());
  assert.equal(budget.count, 48);
  assert.equal(budget.totalBytes, 14083661 + memoBytes);
  assert.equal(budget.videoBytes, 9458888);
  assert.deepEqual(budget.formats, {
    html: 1,
    ico: 1,
    mp4: 4,
    png: 13,
    svg: 1,
    webm: 4,
    webp: 23,
    xlsx: 1,
  });
  assert.deepEqual(budget.largestFiles.slice(0, 5), [
    {
      path: 'blog/la-societe-du-spectacle-leve-des-fonds/hero.mp4',
      bytes: 1636190,
    },
    {
      path: 'blog/la-societe-du-spectacle-leve-des-fonds/hero.webm',
      bytes: 1502630,
    },
    {
      path: 'blog/la-societe-du-spectacle-leve-des-fonds/double.mp4',
      bytes: 1313489,
    },
    {
      path: 'blog/la-societe-du-spectacle-leve-des-fonds/double.webm',
      bytes: 1249850,
    },
    {
      path: 'blog/la-societe-du-spectacle-leve-des-fonds/vedette.mp4',
      bytes: 1064451,
    },
  ]);
});
