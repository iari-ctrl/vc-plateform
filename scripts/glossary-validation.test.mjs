import assert from 'node:assert/strict';
import test from 'node:test';

import { validateGlossaryData } from './glossary-validation.mjs';

const baseEntry = {
  id: 'alpha',
  slug: 'alpha',
  term: 'Alpha',
  aliases: ['Premier terme'],
  short: 'Définition courte.',
  definition: 'Définition complète.',
  seeAlso: ['beta'],
  relatedLessonIds: ['lesson-1'],
};

const betaEntry = {
  id: 'beta',
  slug: 'beta',
  term: 'Beta',
  aliases: [],
  short: 'Définition courte.',
  definition: 'Définition complète.',
  seeAlso: [],
  relatedLessonIds: [],
};

test('glossary validation is pure and accepts a coherent fixture', () => {
  assert.deepEqual(
    validateGlossaryData({ glossary: [baseEntry, betaEntry], lessons: [{ id: 'lesson-1' }] }),
    { errors: [], warnings: [] },
  );
});

test('glossary validation reports duplicate slugs and unresolved references', () => {
  const invalid = {
    ...baseEntry,
    id: 'duplicate-id',
    definition: 'Définition avec [[missing-marker]].',
    seeAlso: ['missing-term'],
    relatedLessonIds: ['missing-lesson'],
  };
  const { errors } = validateGlossaryData({ glossary: [baseEntry, invalid], lessons: [{ id: 'lesson-1' }] });

  assert.ok(errors.some((error) => error.includes('duplicate key "alpha"')));
  assert.ok(errors.some((error) => error.includes('unknown glossary term "missing-term"')));
  assert.ok(errors.some((error) => error.includes('unknown lesson "missing-lesson"')));
  assert.ok(errors.some((error) => error.includes('missing marker slug "missing-marker"')));
});

test('glossary validation rejects alias collisions and non-HTTPS links', () => {
  const invalid = {
    ...betaEntry,
    aliases: ['Premier terme'],
    link: 'javascript:alert(1)',
  };
  const { errors } = validateGlossaryData({ glossary: [baseEntry, invalid], lessons: [{ id: 'lesson-1' }] });

  assert.ok(errors.some((error) => error.includes('alias collision')));
  assert.ok(errors.some((error) => error.includes('must be an HTTPS URL')));
});
