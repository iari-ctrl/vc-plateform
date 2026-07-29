import { describe, expect, it } from 'vitest';
import deliverablesJson from '@data/deliverables.json';

import type { Deliverable } from '@/content/types';
import { buildReviewMarkdown, buildWorksheetMarkdown } from './learningExports';

const deliverable = (deliverablesJson as Deliverable[]).find((candidate) => candidate.id === 'vp-recommandation-soutien');
const miniAnalysisDeliverable = (deliverablesJson as Deliverable[]).find((candidate) => candidate.id === 'todo-mini-analyse-gabarit');
const serieADeliverable = (deliverablesJson as Deliverable[]).find((candidate) => candidate.id === 'todo-attentes-serie-a');

if (!deliverable) throw new Error('Le jalon Venture philanthropie doit exister.');
if (!miniAnalysisDeliverable) throw new Error('Le livrable de mini-analyse doit exister.');
if (!serieADeliverable) throw new Error('Le dossier Série A doit exister.');

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

  it('exports a source-conscious mini-analysis worksheet and self-assessment', () => {
    const worksheet = buildWorksheetMarkdown(miniAnalysisDeliverable, 'Sources consultées : page du fonds et annonce publique.', true);
    const review = buildReviewMarkdown(
      miniAnalysisDeliverable,
      { 'tracabilite-faits': 'solide', 'risques-hierarchises': 'acceptable' },
      'self',
    );

    expect(worksheet).toContain('# Écrire une mini-analyse de startup');
    expect(worksheet).toContain('sources publiques');
    expect(worksheet).toContain('Faits déterminants');
    expect(worksheet).toContain('Sources consultées : page du fonds et annonce publique.');
    expect(review).toContain('# Autoévaluation · Écrire une mini-analyse de startup');
    expect(review).toContain('Niveau : Solide');
    expect(review).toContain('Niveau : Acceptable');
    expect(review.toLowerCase()).not.toContain('score global');
  });

  it('exports the same required component subset as the selected Série A mode', () => {
    const medium = buildWorksheetMarkdown(serieADeliverable, '', false, 'medium');
    const high = buildWorksheetMarkdown(serieADeliverable, '', false, 'high');
    const mediumReview = buildReviewMarkdown(serieADeliverable, {}, 'self', 'medium');
    const highReview = buildReviewMarkdown(serieADeliverable, {}, 'self', 'high');

    for (const required of serieADeliverable.components?.slice(0, 8) ?? []) {
      expect(medium).toContain(`## ${required.title}`);
      expect(high).toContain(`## ${required.title}`);
    }
    expect(medium).not.toContain('## Adaptation sectorielle');
    expect(medium).not.toContain('## Tour complexe');
    expect(high).toContain('## Adaptation sectorielle');
    expect(high).toContain('## Tour complexe');
    expect(mediumReview).toContain('## Maîtrise du processus et de la data room');
    expect(mediumReview).not.toContain('## Pertinence de l’adaptation sectorielle');
    expect(mediumReview).not.toContain('## Décomposition d’un tour complexe');
    expect(highReview).toContain('## Pertinence de l’adaptation sectorielle');
    expect(highReview).toContain('## Décomposition d’un tour complexe');
  });
});
