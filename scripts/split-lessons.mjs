// Splits the lessons into a light index and the heavy reader payload so the
// hot path (parcours composition, atlas, related-lesson links) ships only the
// index, while the full body/quiz loads lazily on the lesson reader.
//
//   data/lessons.json + data/parcours/*.lessons.json  (sources of truth)
//     ├─→ data/lessons.index.json   every field except body/bodyShort/keyTakeaways/quiz/furtherReading
//     └─→ data/lessons.bodies.json  { [slug]: { body, bodyShort?, keyTakeaways, quiz?, furtherReading? } }
//
// The parcours-authored registers (ld-*/lea-*) are folded into the same two
// outputs, in the same order the client used to concatenate them, so the split
// also moves their bodies out of the eager bundle. Deterministic output (source
// order, 2-space indent) so re-runs don't churn the diff. Wired into
// `prebuild`/`predev`; the outputs are also committed so the IDE and a fresh
// checkout resolve the imports without a generate step.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dataDir = fileURLToPath(new URL('../data/', import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(`${dataDir}${p}`, 'utf8'));

const library = readJson('lessons.json');
if (!Array.isArray(library)) {
  console.error('split-lessons: data/lessons.json is not an array');
  process.exit(1);
}

const parcoursFiles = readdirSync(`${dataDir}parcours`)
  .filter((f) => f.endsWith('.lessons.json'))
  .sort();
const source = [...library, ...parcoursFiles.flatMap((f) => readJson(`parcours/${f}`).lessons)];

const index = [];
const bodies = {};

for (const lesson of source) {
  if (bodies[lesson.slug]) {
    console.error(`split-lessons: duplicate slug "${lesson.slug}" — bodies are keyed by slug`);
    process.exit(1);
  }
  const { body, bodyShort, keyTakeaways, quiz, furtherReading, ...light } = lesson;
  index.push(light);
  const payload = { body: body ?? '', keyTakeaways: keyTakeaways ?? [] };
  if (bodyShort !== undefined) payload.bodyShort = bodyShort;
  if (quiz !== undefined) payload.quiz = quiz;
  if (furtherReading !== undefined) payload.furtherReading = furtherReading;
  bodies[lesson.slug] = payload;
}

writeFileSync(`${dataDir}lessons.index.json`, JSON.stringify(index, null, 2) + '\n');
writeFileSync(`${dataDir}lessons.bodies.json`, JSON.stringify(bodies, null, 2) + '\n');

console.log(`split-lessons: ${index.length} lessons (${library.length} library + ${index.length - library.length} parcours) → lessons.index.json + lessons.bodies.json`);
