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
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
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
    dir: 'blog',
    load: () => prisma.blogPost.findMany({ orderBy: [{ date: 'desc' }, { title: 'asc' }] }),
  },
];

let anyChanged = false;
try {
  for (const collection of collections) {
    const rows = await collection.load();
    const payload = preserveExistingFileOrder(collection, rows.map((row) => parseRow(collection.label, row.id, row.data)));
    const targetLabel = collection.file ?? `${collection.dir}/`;
    const changed = collection.dir
      ? jsonDirChanged(join(dataDir, collection.dir), buildDirFiles(collection.label, payload))
      : jsonFileChanged(join(dataDir, collection.file), serializeJson(payload));
    if (changed) anyChanged = true;

    if (!dryRun && changed) {
      if (collection.dir) writeJsonDir(join(dataDir, collection.dir), buildDirFiles(collection.label, payload));
      else writeAtomic(join(dataDir, collection.file), serializeJson(payload));
    }
    console.log(`${changed ? dryRun ? 'DRY' : 'OK' : '--'} ${targetLabel} - ${rows.length} row(s)${changed ? '' : ' (unchanged)'}`);
  }
} finally {
  await prisma.$disconnect();
}

// Anti-drift gate: in --dry-run, a difference means the DB and the canonical
// JSON have diverged (seed and export are no longer inverses). Fail so CI and
// the curator notice. A normal run writes the files and exits 0.
if (dryRun && anyChanged) {
  console.error('\n✗ Drift détecté : les JSON sources diffèrent de la DB. Lance `npm run content:export` puis commit.');
  process.exitCode = 1;
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

function serializeJson(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function jsonFileChanged(target, next) {
  const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
  return current !== next;
}

function buildDirFiles(label, payload) {
  const files = new Map();
  for (const row of payload) {
    if (!row?.slug) throw new Error(`${label}/${row?.id ?? 'unknown'} - missing slug for file export`);
    const file = `${row.slug}.json`;
    if (files.has(file)) throw new Error(`${label} - duplicate export file: ${file}`);
    files.set(file, serializeJson(row));
  }
  return files;
}

function preserveExistingFileOrder(collection, payload) {
  if (!collection.file) return payload;

  const target = join(dataDir, collection.file);
  if (!existsSync(target)) return payload;

  let current;
  try {
    current = JSON.parse(readFileSync(target, 'utf8'));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`${collection.file} - invalid JSON: ${message}`);
  }
  if (!Array.isArray(current)) return payload;

  const byId = new Map();
  for (const row of payload) {
    if (!row?.id) return payload;
    byId.set(row.id, row);
  }

  const ordered = [];
  for (const row of current) {
    const id = row?.id;
    if (id && byId.has(id)) {
      ordered.push(byId.get(id));
      byId.delete(id);
    }
  }

  return [...ordered, ...byId.values()];
}

function jsonDirChanged(targetDir, nextFiles) {
  const currentFiles = existsSync(targetDir)
    ? readdirSync(targetDir).filter((file) => file.endsWith('.json')).sort()
    : [];
  if (currentFiles.length !== nextFiles.size) return true;
  for (const file of currentFiles) {
    if (!nextFiles.has(file)) return true;
    if (readFileSync(join(targetDir, file), 'utf8') !== nextFiles.get(file)) return true;
  }
  return false;
}

function writeJsonDir(targetDir, nextFiles) {
  mkdirSync(targetDir, { recursive: true });
  const keep = new Set(nextFiles.keys());
  for (const file of readdirSync(targetDir).filter((f) => f.endsWith('.json'))) {
    if (!keep.has(file)) unlinkSync(join(targetDir, file));
  }
  for (const [file, data] of nextFiles) {
    writeAtomic(join(targetDir, file), data);
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
