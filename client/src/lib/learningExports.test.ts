import { describe, expect, it } from 'vitest';
import deliverablesJson from '@data/deliverables.json';

import type { Deliverable } from '@/content/types';
import { buildReviewMarkdown, buildWorksheetMarkdown } from './learningExports';

const deliverable = (deliverablesJson as Deliverable[]).find((candidate) => candidate.id === 'vp-recommandation-soutien');

if (!deliverable) throw new Error('Le jalon Venture philanthropie doit exister.');

describe('learning exports', () => {
  it('exports a reusable worksheet with the local note and all capstone components', () => {
    const markdown = buildWorksheetMarkdown(deliverable, 'Vérifier le scénario prudent.', true);

    expect(markdown).toContain('# Recommandation de soutien en venture philanthropie');
    expect(markdown).toContain('Vérifier le scénario prudent.');
    expect(markdown).toContain('Fichier produit hors plateforme : oui');
    expect(deliverable.components?.every((component) => markdown.includes(component.title))).toBe(true);
  });

  it('exports distinct self-assessment and external-review sheets without aggregate scoring', () => {
    const ratings = { mandat: 'solide' };
    const selfAssessment = buildReviewMarkdown(deliverable, ratings, 'self');
    const externalReview = buildReviewMarkdown(deliverable, ratings, 'external');

    expect(selfAssessment).toContain('# Autoévaluation');
    expect(externalReview).toContain('# Grille de revue externe');
    expect(externalReview).toContain('sans effet certificatif');
    for (const markdown of [selfAssessment, externalReview]) {
      expect(markdown).toContain('Description observable');
      expect(markdown).toContain('Preuve attendue');
      expect(markdown).toContain('Erreur fréquente');
      expect(markdown).toContain('Question de révision');
      expect(markdown.toLowerCase()).not.toContain('score global');
    }
  });
});
