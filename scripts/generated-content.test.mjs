import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

import {
  buildGlossaryArtifacts,
  buildLessonArtifacts,
  checkGeneratedContent,
  serializeGeneratedJson,
} from './generated-content.mjs';

test('split artifacts are derived deterministically from their canonical sources', () => {
  const published = {
    id: 'lesson-published',
    slug: 'lesson-published',
    status: 'published',
    title: 'Published lesson',
    body: 'Body',
    bodyShort: 'Short body',
    keyTakeaways: ['Takeaway'],
    quiz: [{ question: 'Question' }],
    furtherReading: [{ label: 'Source' }],
  };
  const upcoming = {
    id: 'lesson-upcoming',
    slug: 'lesson-upcoming',
    status: 'upcoming',
    title: 'Upcoming lesson',
    body: 'Draft body',
    keyTakeaways: ['Draft takeaway'],
  };
  const dropIn = {
    id: 'lesson-drop-in',
    slug: 'lesson-drop-in',
    status: 'published',
    title: 'Drop-in lesson',
    body: 'Drop-in body',
    keyTakeaways: [],
  };

  const lessonArtifacts = buildLessonArtifacts([published, upcoming], [{ lessons: [dropIn] }]);

  assert.deepEqual(lessonArtifacts.index, [
    {
      id: 'lesson-published',
      slug: 'lesson-published',
      status: 'published',
      title: 'Published lesson',
    },
    {
      id: 'lesson-upcoming',
      slug: 'lesson-upcoming',
      status: 'upcoming',
      title: 'Upcoming lesson',
    },
    {
      id: 'lesson-drop-in',
      slug: 'lesson-drop-in',
      status: 'published',
      title: 'Drop-in lesson',
    },
  ]);
  assert.deepEqual(lessonArtifacts.bodies, {
    'lesson-published': {
      body: 'Body',
      keyTakeaways: ['Takeaway'],
      bodyShort: 'Short body',
      quiz: [{ question: 'Question' }],
      furtherReading: [{ label: 'Source' }],
    },
    'lesson-drop-in': {
      body: 'Drop-in body',
      keyTakeaways: [],
    },
  });

  assert.throws(
    () => buildLessonArtifacts([published, { ...published, id: 'duplicate' }]),
    /duplicate slug "lesson-published"/,
  );
  assert.throws(
    () => buildLessonArtifacts([{ ...published, status: undefined }]),
    /must declare status "published" or "upcoming"/,
  );

  const glossaryArtifacts = buildGlossaryArtifacts([
    {
      id: 'term',
      slug: 'term',
      term: 'Term',
      definition: 'Definition',
      example: 'Example',
    },
  ]);
  assert.deepEqual(glossaryArtifacts, {
    index: [{ id: 'term', slug: 'term', term: 'Term' }],
    defs: { term: { definition: 'Definition', example: 'Example' } },
  });
});

test('generated-content check detects a stale file without rewriting it', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'vcpx-generated-content-'));

  try {
    const dataDir = path.join(root, 'data');
    const generatedDir = path.join(dataDir, 'generated');
    const parcoursDir = path.join(dataDir, 'parcours');
    mkdirSync(generatedDir, { recursive: true });
    mkdirSync(parcoursDir, { recursive: true });

    const lessons = [{
      id: 'lesson',
      slug: 'lesson',
      status: 'published',
      title: 'Lesson',
      body: 'Body',
      keyTakeaways: [],
    }];
    const glossary = [{ id: 'term', slug: 'term', term: 'Term', definition: 'Definition' }];
    const lessonArtifacts = buildLessonArtifacts(lessons);
    const glossaryArtifacts = buildGlossaryArtifacts(glossary);

    writeFileSync(path.join(dataDir, 'lessons.json'), serializeGeneratedJson(lessons));
    writeFileSync(path.join(dataDir, 'glossary.json'), serializeGeneratedJson(glossary));
    writeFileSync(path.join(generatedDir, 'lessons.index.json'), serializeGeneratedJson(lessonArtifacts.index));
    writeFileSync(path.join(generatedDir, 'lessons.bodies.json'), serializeGeneratedJson(lessonArtifacts.bodies));
    writeFileSync(path.join(generatedDir, 'glossary.index.json'), '[]\n');
    writeFileSync(path.join(generatedDir, 'glossary.defs.json'), serializeGeneratedJson(glossaryArtifacts.defs));

    const rootUrl = pathToFileURL(`${root}${path.sep}`);
    assert.deepEqual(checkGeneratedContent(rootUrl).errors, [
      'data/generated/glossary.index.json is stale; run npm run split:content.',
    ]);

    writeFileSync(
      path.join(generatedDir, 'glossary.index.json'),
      serializeGeneratedJson(glossaryArtifacts.index),
    );
    assert.deepEqual(checkGeneratedContent(rootUrl).errors, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('committed generated content matches the current canonical sources', () => {
  const report = checkGeneratedContent(new URL('../', import.meta.url));

  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.counts, {
    lessons: 147,
    publishedLessonBodies: 126,
    glossaryTerms: 420,
  });
});
