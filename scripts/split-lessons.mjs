// Splits the lessons into a light index and the heavy reader payload so the
// hot path (parcours composition, atlas, related-lesson links) ships only the
// index, while the full body/quiz loads lazily on the lesson reader.
//
//   data/lessons.json + data/parcours/*.lessons.json  (sources of truth)
//     ├─→ data/generated/lessons.index.json   every field except body/bodyShort/keyTakeaways/quiz/furtherReading
//     └─→ data/generated/lessons.bodies.json  { [slug]: { body, bodyShort?, keyTakeaways, quiz?, furtherReading? } }
//
// The parcours-authored registers (ld-*/lea-*) are folded into the same two
// outputs, in the same order the client used to concatenate them, so the split
// also moves their bodies out of the eager bundle. Deterministic output (source
// order, 2-space indent) so re-runs don't churn the diff. Wired into
// `prebuild`/`predev`; the outputs are also committed so the IDE and a fresh
// checkout resolve the imports without a generate step.

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { buildLessonArtifacts, serializeGeneratedJson } from './generated-content.mjs';

const dataDir = fileURLToPath(new URL('../data/', import.meta.url));
const generatedDir = `${dataDir}generated/`;
const readJson = (p) => JSON.parse(readFileSync(`${dataDir}${p}`, 'utf8'));

const library = readJson('lessons.json');
const parcoursFiles = readdirSync(`${dataDir}parcours`)
  .filter((f) => f.endsWith('.lessons.json'))
  .sort();
const parcoursRegisters = parcoursFiles.map((file) => readJson(`parcours/${file}`));

let artifacts;
try {
  artifacts = buildLessonArtifacts(library, parcoursRegisters);
} catch (error) {
  console.error(`split-lessons: ${error.message}`);
  process.exit(1);
}
const { index, bodies } = artifacts;

mkdirSync(generatedDir, { recursive: true });
writeFileSync(`${generatedDir}lessons.index.json`, serializeGeneratedJson(index));
writeFileSync(`${generatedDir}lessons.bodies.json`, serializeGeneratedJson(bodies));

console.log(`split-lessons: ${index.length} lessons (${library.length} library + ${index.length - library.length} parcours) → generated/lessons.index.json + generated/lessons.bodies.json`);
