import glossaryIndexJson from '@data/generated/glossary.index.json';
import type { GlossaryDef, GlossaryIndexEntry } from './types';

/**
 * Light glossary index — every field except the heavy `definition`/`example`.
 * Safe to import on the lesson/article hot path (markdown auto-linker, popover
 * previews, search). Full definitions live in a separate chunk loaded on demand
 * via {@link loadGlossaryDefs}.
 */
export const GLOSSARY = glossaryIndexJson as unknown as GlossaryIndexEntry[];

export const glossaryBySlug = (slug: string) => GLOSSARY.find((g) => g.slug === slug);

let defsPromise: Promise<Record<string, GlossaryDef>> | null = null;

/** Lazily load the heavy definitions (own chunk). Cached after the first call. */
export function loadGlossaryDefs(): Promise<Record<string, GlossaryDef>> {
  if (!defsPromise) {
    defsPromise = import('@data/generated/glossary.defs.json').then(
      (m) => ((m as { default?: unknown }).default ?? m) as Record<string, GlossaryDef>,
    );
  }
  return defsPromise;
}
