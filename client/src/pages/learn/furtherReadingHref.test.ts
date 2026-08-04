import { describe, expect, it } from 'vitest';

import { furtherReadingHref } from './furtherReadingHref';

describe('furtherReadingHref', () => {
  it('résout un simulateur depuis son ID canonique vers son slug public', () => {
    expect(furtherReadingHref({
      kind: 'simulator',
      ref: 'power-law',
      label: 'Simuler un portefeuille power law',
    })).toBe('/simulators/power-law-portfolio');
    expect(furtherReadingHref({
      kind: 'simulator',
      ref: 'pre-post-money',
      label: 'Calculer une valorisation pré/post-money',
    })).toBe('/simulators/valorisation-pre-post-money');
  });

  it('ne transforme pas un slug en référence interne valide', () => {
    expect(furtherReadingHref({
      kind: 'simulator',
      ref: 'power-law-portfolio',
      label: 'Slug public utilisé à tort comme référence interne',
    })).toBeUndefined();
  });

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
