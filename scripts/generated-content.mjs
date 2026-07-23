import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function serializeGeneratedJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function buildLessonArtifacts(library, parcoursRegisters = []) {
  if (!Array.isArray(library)) {
    throw new TypeError('data/lessons.json is not an array');
  }

  const dropIns = parcoursRegisters.flatMap((register, index) => {
    if (!Array.isArray(register?.lessons)) {
      throw new TypeError(`parcours lesson register ${index + 1} does not expose a lessons array`);
    }
    return register.lessons;
  });
  const source = [...library, ...dropIns];
  const index = [];
  const bodies = {};
  const slugs = new Set();

  for (const lesson of source) {
    if (lesson.status !== 'published' && lesson.status !== 'upcoming') {
      throw new TypeError(
        `lesson "${lesson.id ?? lesson.slug ?? 'unknown'}" must declare status "published" or "upcoming"`,
      );
    }
    if (slugs.has(lesson.slug)) {
      throw new TypeError(`duplicate slug "${lesson.slug}" — bodies are keyed by slug`);
    }

    slugs.add(lesson.slug);
    const { body, bodyShort, keyTakeaways, quiz, furtherReading, ...light } = lesson;
    index.push(light);
    if (lesson.status !== 'published') continue;

    const payload = { body: body ?? '', keyTakeaways: keyTakeaways ?? [] };
    if (bodyShort !== undefined) payload.bodyShort = bodyShort;
    if (quiz !== undefined) payload.quiz = quiz;
    if (furtherReading !== undefined) payload.furtherReading = furtherReading;
    bodies[lesson.slug] = payload;
  }

  return { index, bodies };
}

export function buildGlossaryArtifacts(source) {
  if (!Array.isArray(source)) {
    throw new TypeError('data/glossary.json is not an array');
  }

  const index = [];
  const defs = {};

  for (const term of source) {
    const { definition, example, ...light } = term;
    index.push(light);
    const def = { definition: definition ?? '' };
    if (example !== undefined) def.example = example;
    defs[term.slug] = def;
  }

  return { index, defs };
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export function checkGeneratedContent(rootUrl = new URL('../', import.meta.url)) {
  const rootDir = fileURLToPath(rootUrl);
  const dataDir = path.join(rootDir, 'data');
  const lessons = readJson(path.join(dataDir, 'lessons.json'));
  const glossary = readJson(path.join(dataDir, 'glossary.json'));
  const parcoursRegisters = readdirSync(path.join(dataDir, 'parcours'))
    .filter((file) => file.endsWith('.lessons.json'))
    .sort()
    .map((file) => readJson(path.join(dataDir, 'parcours', file)));
  const lessonArtifacts = buildLessonArtifacts(lessons, parcoursRegisters);
  const glossaryArtifacts = buildGlossaryArtifacts(glossary);
  const expectedFiles = new Map([
    ['data/generated/lessons.index.json', serializeGeneratedJson(lessonArtifacts.index)],
    ['data/generated/lessons.bodies.json', serializeGeneratedJson(lessonArtifacts.bodies)],
    ['data/generated/glossary.index.json', serializeGeneratedJson(glossaryArtifacts.index)],
    ['data/generated/glossary.defs.json', serializeGeneratedJson(glossaryArtifacts.defs)],
  ]);
  const errors = [];

  for (const [relativePath, expected] of expectedFiles) {
    let actual;
    try {
      actual = readFileSync(path.join(rootDir, relativePath), 'utf8');
    } catch {
      errors.push(`${relativePath} is missing; run npm run split:content.`);
      continue;
    }
    if (actual !== expected) {
      errors.push(`${relativePath} is stale; run npm run split:content.`);
    }
  }

  return {
    errors,
    counts: {
      lessons: lessonArtifacts.index.length,
      publishedLessonBodies: Object.keys(lessonArtifacts.bodies).length,
      glossaryTerms: glossaryArtifacts.index.length,
    },
  };
}
