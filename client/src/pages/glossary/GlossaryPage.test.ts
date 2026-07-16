import { describe, expect, it } from 'vitest';

import type { GlossaryTerm } from '@/content/types';
import { matchesGlossaryQuery } from './glossarySearch';

const term: GlossaryTerm = {
  id: 'liquidation-preference',
  term: 'Liquidation Preference',
  slug: 'liquidation-preference',
  aliases: ['Préférence de liquidation', 'Liquidation pref'],
  latin: 'Praeferentia',
  category: 'Deal & Structuration',
  short: 'Protection économique accordée aux investisseurs.',
  definition: 'Détermine la répartition du produit de cession.',
  example: 'Un SAFE peut prévoir une préférence.',
  seeAlso: [],
  relatedLessonIds: [],
};

describe('matchesGlossaryQuery', () => {
  it('matches the concept title or one of its aliases', () => {
    expect(matchesGlossaryQuery(term, 'liquidation preference')).toBe(true);
    expect(matchesGlossaryQuery(term, 'préférence de liquidation')).toBe(true);
    expect(matchesGlossaryQuery(term, 'PREF')).toBe(true);
  });

  it('does not match fields outside the title and aliases', () => {
    expect(matchesGlossaryQuery(term, 'Praeferentia')).toBe(false);
    expect(matchesGlossaryQuery(term, 'Structuration')).toBe(false);
    expect(matchesGlossaryQuery(term, 'Protection économique')).toBe(false);
    expect(matchesGlossaryQuery(term, 'produit de cession')).toBe(false);
    expect(matchesGlossaryQuery(term, 'SAFE')).toBe(false);
  });

  it('keeps every term when the query is empty', () => {
    expect(matchesGlossaryQuery(term, '   ')).toBe(true);
  });
});
