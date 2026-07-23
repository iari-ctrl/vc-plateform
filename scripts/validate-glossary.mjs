#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGlossaryData } from './glossary-validation.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');

const readJson = (name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8'));
const glossary = readJson('glossary.json');
const lessons = readJson('lessons.json');

const { errors, warnings } = validateGlossaryData({ glossary, lessons });

console.log('Custom glossary validation');
console.log(`-> ${glossary.length} terms checked`);

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('OK: unique slugs, HTTPS links, id=slug, resolved seeAlso, lessons, markers, and aliases.');
