#!/usr/bin/env node
/**
 * Merge curated `aliases` from the ingestion ledger
 * (`data/sources/canonical-glossary.json`) into the shipped content
 * collection (`data/glossary.json`), keyed by slug.
 *
 * Why: the ledger captures synonyms/abbreviations ("VC", "capital-risque",
 * "fonds propres"…) but they were never shipped, so glossary search can't
 * match them. This closes that gap without hand-editing 250 entries.
 *
 * Behaviour:
 *   - Idempotent — re-running yields the same file.
 *   - Only touches terms present in data/glossary.json (ledger drafts that
 *     aren't shipped are ignored).
 *   - Per term: union of existing + ledger aliases, trimmed, de-duplicated
 *     case-insensitively, with any alias equal to the term label or slug
 *     dropped, then sorted for stable diffs.
 *
 * Run: `npm run aliases:merge`  then  `npm run validate:content`
 *      (and `npm run db:seed` to push them into the API/DB).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shippedPath = join(root, 'data', 'glossary.json');
const canonicalPath = join(root, 'data', 'sources', 'canonical-glossary.json');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

const shipped = readJson(shippedPath);
const canonical = readJson(canonicalPath);

// slug -> curated aliases from the ledger
const aliasesBySlug = new Map();
for (const entry of canonical) {
  if (entry && entry.slug && Array.isArray(entry.aliases)) {
    aliasesBySlug.set(entry.slug, entry.aliases);
  }
}

const norm = (s) => s.normalize('NFKC').trim();
const key = (s) => norm(s).toLowerCase();

let withAliases = 0;
let changed = 0;
const unmatched = [];

for (const term of shipped) {
  const fromLedger = aliasesBySlug.get(term.slug) ?? [];
  const existing = Array.isArray(term.aliases) ? term.aliases : [];
  // Drop an alias that merely repeats the display label, or that is the raw
  // slug verbatim. We intentionally do NOT ban by the slug's normalized key:
  // an acronym entry's title is now its expansion (e.g. "Total Value to
  // Paid-In (TVPI)") while the bare sigle ("TVPI") lives in `aliases` so the
  // lesson auto-linker keeps wrapping it — and "TVPI" normalises to the slug.
  const banned = new Set([key(term.term)]);

  const seen = new Set();
  const merged = [];
  for (const raw of [...existing, ...fromLedger]) {
    if (typeof raw !== 'string') continue;
    const value = norm(raw);
    const k = key(value);
    if (!value || value === term.slug || banned.has(k) || seen.has(k)) continue;
    seen.add(k);
    merged.push(value);
  }
  merged.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

  const before = JSON.stringify(term.aliases ?? null);
  if (merged.length) {
    term.aliases = merged;
    withAliases += 1;
  } else {
    delete term.aliases;
    unmatched.push(term.slug);
  }
  if (JSON.stringify(term.aliases ?? null) !== before) changed += 1;
}

writeFileSync(shippedPath, `${JSON.stringify(shipped, null, 2)}\n`, 'utf8');

console.log('Fusion des aliases (canonical → data/glossary.json)');
console.log(`→ ${shipped.length} termes livrés · ${aliasesBySlug.size} entrées canonical avec aliases`);
console.log(`→ ${withAliases} termes dotés d'aliases · ${changed} fichier(s) d'entrée modifié(s)`);
if (unmatched.length) {
  const preview = unmatched.slice(0, 20).join(', ');
  console.warn(`⚠ ${unmatched.length} terme(s) sans alias dans le ledger : ${preview}${unmatched.length > 20 ? '…' : ''}`);
}
