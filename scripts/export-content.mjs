#!/usr/bin/env node
/**
 * Export admin-editable DB content back to JSON source files.
 *
 * This is the reverse path of `server/prisma/seed.ts` for the three collections
 * an admin can edit in the app: glossary, case studies, and blog posts.
 *
 * Run: `npm run content:export`
 *      `npm run content:export -- --dry-run`
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const serverDir = join(root, 'server');
const dataDir = join(root, 'data');

loadEnv(join(serverDir, '.env'));
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:./dev.db';

const prisma = new PrismaClient();
const dryRun = process.argv.includes('--dry-run');

const collections = [
  {
    label: 'glossary',
    file: 'glossary.json',
    load: () => prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' } }),
  },
  {
    label: 'case studies',
    file: 'caseStudies.json',
    load: () => prisma.caseStudy.findMany({ orderBy: { title: 'asc' } }),
  },
  {
    label: 'blog',
    file: 'blog.json',
    load: () => prisma.blogPost.findMany({ orderBy: [{ date: 'desc' }, { title: 'asc' }] }),
  },
];

try {
  for (const collection of collections) {
    const rows = await collection.load();
    const payload = rows.map((row) => parseRow(collection.label, row.id, row.data));
    const target = join(dataDir, collection.file);
    const next = `${JSON.stringify(payload, null, 2)}\n`;
    const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
    const changed = current !== next;

    if (!dryRun && changed) writeAtomic(target, next);
    console.log(`${changed ? dryRun ? 'DRY' : 'OK' : '--'} ${collection.file} - ${rows.length} row(s)${changed ? '' : ' (unchanged)'}`);
  }
} finally {
  await prisma.$disconnect();
}

function parseRow(label, id, data) {
  try {
    const parsed = JSON.parse(data);
    if (parsed?.id && parsed.id !== id) {
      throw new Error(`JSON id "${parsed.id}" differs from DB id "${id}"`);
    }
    return parsed;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`${label}/${id} - invalid data JSON: ${message}`);
  }
}

function writeAtomic(target, data) {
  const tmp = `${target}.tmp-${process.pid}`;
  writeFileSync(tmp, data);
  renameSync(tmp, target);
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
