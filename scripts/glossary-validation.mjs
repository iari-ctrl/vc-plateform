import { safeEditorialUrl } from '../shared/editorial-url.mjs';
import { findDuplicateErrors, findReferenceErrors } from './validation-core.mjs';

const MARKER = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

const normalizeAlias = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export function validateGlossaryData({ glossary, lessons }) {
  const errors = [
    ...findDuplicateErrors(glossary, { collection: 'glossary', key: (entry) => entry.slug }),
  ];
  const warnings = [];
  const slugSet = new Set(glossary.map((entry) => entry.slug));
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));

  for (const entry of glossary) {
    if (entry.id !== entry.slug) {
      errors.push(`glossary/${entry.slug} has id "${entry.id}" instead of matching slug`);
    }
    if (entry.link && !safeEditorialUrl(entry.link)) {
      errors.push(`glossary/${entry.slug}.link must be an HTTPS URL`);
    }
  }

  errors.push(...findReferenceErrors(glossary, {
    collection: 'glossary',
    refsFor: (entry) => entry.seeAlso ?? [],
    validIds: slugSet,
    reference: 'glossary term',
  }));
  errors.push(...findReferenceErrors(glossary, {
    collection: 'glossary',
    refsFor: (entry) => entry.relatedLessonIds ?? [],
    validIds: lessonIds,
    reference: 'lesson',
  }));

  for (const entry of glossary) {
    for (const field of ['short', 'definition', 'example']) {
      const value = entry[field];
      if (typeof value !== 'string') continue;
      for (const marker of value.matchAll(MARKER)) {
        const slug = marker[1].trim();
        if (!slugSet.has(slug)) {
          errors.push(`glossary/${entry.slug}.${field} references missing marker slug "${slug}"`);
        }
      }
    }
  }

  const aliasOwners = new Map();
  for (const entry of glossary) {
    for (const value of [entry.term, entry.slug, ...(entry.aliases ?? [])]) {
      const key = normalizeAlias(value);
      if (!key) continue;
      const owners = aliasOwners.get(key) ?? new Set();
      owners.add(entry.slug);
      aliasOwners.set(key, owners);
    }
  }
  for (const [alias, owners] of aliasOwners) {
    if (owners.size > 1) errors.push(`alias collision "${alias}" across ${[...owners].sort().join(', ')}`);
  }

  return { errors, warnings };
}
