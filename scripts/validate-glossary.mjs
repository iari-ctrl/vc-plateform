#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');

const readJson = (name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8'));
const glossary = readJson('glossary.json');
const lessons = readJson('lessons.json');

const errors = [];
const err = (message) => errors.push(message);

const normalizeAlias = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const slugs = new Map();
for (const entry of glossary) {
  if (entry.id !== entry.slug) err(`glossary/${entry.slug} has id "${entry.id}" instead of matching slug`);
  if (slugs.has(entry.slug)) err(`duplicate slug "${entry.slug}" in ${slugs.get(entry.slug)} and ${entry.term}`);
  else slugs.set(entry.slug, entry.term);
}

const slugSet = new Set(glossary.map((entry) => entry.slug));
const lessonIds = new Set(lessons.map((lesson) => lesson.id));

for (const entry of glossary) {
  for (const slug of entry.seeAlso ?? []) {
    if (!slugSet.has(slug)) err(`glossary/${entry.slug}.seeAlso references missing slug "${slug}"`);
  }
  for (const lessonId of entry.relatedLessonIds ?? []) {
    if (!lessonIds.has(lessonId)) err(`glossary/${entry.slug}.relatedLessonIds references missing lesson "${lessonId}"`);
  }
}

const MARKER = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
for (const entry of glossary) {
  for (const field of ['short', 'definition', 'example']) {
    const value = entry[field];
    if (typeof value !== 'string') continue;
    for (const marker of value.matchAll(MARKER)) {
      const slug = marker[1].trim();
      if (!slugSet.has(slug)) err(`glossary/${entry.slug}.${field} references missing marker slug "${slug}"`);
    }
  }
}

const aliasOwners = new Map();
for (const entry of glossary) {
  const searchable = [entry.term, entry.slug, ...(entry.aliases ?? [])];
  for (const value of searchable) {
    const key = normalizeAlias(value);
    if (!key) continue;
    const owners = aliasOwners.get(key) ?? new Set();
    owners.add(entry.slug);
    aliasOwners.set(key, owners);
  }
}

for (const [alias, owners] of aliasOwners) {
  if (owners.size > 1) err(`alias collision "${alias}" across ${[...owners].sort().join(', ')}`);
}

console.log('Custom glossary validation');
console.log(`-> ${glossary.length} terms checked`);

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('OK: unique slugs, id=slug, resolved seeAlso, lessons, markers, and aliases.');
