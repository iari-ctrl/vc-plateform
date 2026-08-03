import type { GlossaryTerm } from '@/content/types';

function normalizeGlossaryText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr');
}

export function matchesGlossaryQuery(term: GlossaryTerm, query: string) {
  const normalizedQuery = normalizeGlossaryText(query.trim());
  if (!normalizedQuery) return true;

  return (
    normalizeGlossaryText(term.term).includes(normalizedQuery) ||
    (term.aliases ?? []).some((alias) => normalizeGlossaryText(alias).includes(normalizedQuery))
  );
}
