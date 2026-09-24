import type { GlossaryTerm } from '@/content/types';
import { stripDiacritics } from '@/lib/utils';

function normalizeGlossaryText(value: string) {
  return stripDiacritics(value).toLocaleLowerCase('fr');
}

/** Normalized labels per slug — the source strings never change after load. */
const labelsBySlug = new Map<string, string[]>();

function normalizedLabels(term: GlossaryTerm) {
  let labels = labelsBySlug.get(term.slug);
  if (!labels) {
    labels = [term.term, ...(term.aliases ?? [])].map(normalizeGlossaryText);
    labelsBySlug.set(term.slug, labels);
  }
  return labels;
}

export function matchesGlossaryQuery(term: GlossaryTerm, query: string) {
  const normalizedQuery = normalizeGlossaryText(query.trim());
  if (!normalizedQuery) return true;

  return normalizedLabels(term).some((label) => label.includes(normalizedQuery));
}
