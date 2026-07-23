import { describe, expect, it } from 'vitest';

import { furtherReadingHref } from './furtherReadingHref';

describe('furtherReadingHref', () => {
  it('résout un livrable par son identifiant canonique', () => {
    expect(furtherReadingHref({
      kind: 'deliverable',
      ref: 'vp-recommandation-soutien',
      label: 'Préparer la recommandation de soutien',
    })).toBe('/livrables/recommandation-de-soutien-venture-philanthropie');
  });
});
