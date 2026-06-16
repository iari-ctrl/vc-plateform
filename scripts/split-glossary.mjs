// Splits the glossary into a light index and the heavy definitions so the
// lesson/article hot path (markdown auto-linker + popovers) ships only the
// index, while full definitions load lazily on the dictionary page.
//
//   data/glossary.json  (source of truth, authored/validated)
//     ├─→ data/generated/glossary.index.json   every field except definition + example
//     └─→ data/generated/glossary.defs.json    { [slug]: { definition, example? } }
//
// Deterministic output (source order, 2-space indent) so re-runs don't churn
// the diff. Wired into `prebuild`/`predev`; the outputs are also committed so
// the IDE and a fresh checkout resolve the imports without a generate step.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dataDir = fileURLToPath(new URL('../data/', import.meta.url));
const generatedDir = `${dataDir}generated/`;
const source = JSON.parse(readFileSync(`${dataDir}glossary.json`, 'utf8'));

if (!Array.isArray(source)) {
  console.error('split-glossary: data/glossary.json is not an array');
  process.exit(1);
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

mkdirSync(generatedDir, { recursive: true });
writeFileSync(`${generatedDir}glossary.index.json`, JSON.stringify(index, null, 2) + '\n');
writeFileSync(`${generatedDir}glossary.defs.json`, JSON.stringify(defs, null, 2) + '\n');

console.log(`split-glossary: ${index.length} terms → generated/glossary.index.json + generated/glossary.defs.json`);
