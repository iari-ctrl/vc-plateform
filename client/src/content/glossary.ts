import glossaryJson from '@data/glossary.json';
import type { GlossaryTerm } from './types';

export const GLOSSARY = glossaryJson as unknown as GlossaryTerm[];

export const glossaryBySlug = (slug: string) => GLOSSARY.find((g) => g.slug === slug);
