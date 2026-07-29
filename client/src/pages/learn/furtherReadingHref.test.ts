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

  it('conserve les sources externes HTTPS vérifiées', () => {
    expect(furtherReadingHref({
      kind: 'external',
      ref: 'https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews/',
      label: 'OPM — Structured Interviews',
    })).toBe('https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews/');
    expect(furtherReadingHref({
      kind: 'external',
      ref: 'HTTPS://example.com/source',
      label: 'Source avec protocole en majuscules',
    })).toBe('HTTPS://example.com/source');
  });

  it.each([
    'http://example.com/source',
    'javascript:alert(1)',
    '//example.com/source',
    'https://user:secret@example.com/source',
  ])('retire une source externe non sûre : %s', (ref) => {
    expect(furtherReadingHref({ kind: 'external', ref, label: 'Source refusée' })).toBeUndefined();
  });
});
