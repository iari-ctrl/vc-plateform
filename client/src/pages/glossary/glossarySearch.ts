import type { GlossaryTerm } from '@/content/types';

export function matchesGlossaryQuery(term: GlossaryTerm, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return (
    term.term.toLowerCase().includes(normalizedQuery) ||
    (term.aliases ?? []).some((alias) => alias.toLowerCase().includes(normalizedQuery))
  );
}
