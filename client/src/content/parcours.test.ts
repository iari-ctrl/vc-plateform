import { describe, expect, it } from 'vitest';
import lessonsSourceJson from '@data/lessons.json';

import { CERTIFICATION_ASSESSMENTS } from './certificationAssessments';
import { certificationBySlug } from './certifications';
import { courseById } from './courses';
import { deliverableById } from './deliverables';
import { lessonIdsForParcours, parcoursBySlug, parcoursForCourse, resolveStep } from './parcours';
import type { Lesson } from './types';

const venturePhilanthropy = parcoursBySlug('venture-philanthropy-foundations');
const analystFoundations = parcoursBySlug('analyst-foundations');

if (!venturePhilanthropy) {
  throw new Error('Le parcours Venture philanthropie doit être publié.');
}
if (!analystFoundations) {
  throw new Error('Le parcours Analyst Foundations doit être publié.');
}

const SOURCE_LESSONS = lessonsSourceJson as Lesson[];
const sourceLessonById = (id: string) => SOURCE_LESSONS.find((lesson) => lesson.id === id);

const VENTURE_PHILANTHROPY_COURSE_IDS = [
  'c-vp-mandat-triage',
  'c-vp-probleme-preuves',
  'c-vp-diligence-organisationnelle',
  'c-vp-diligence-financiere',
  'c-vp-structuration-financement',
  'c-vp-partenariat-portefeuille',
] as const;

const ANALYST_FOUNDATIONS_COURSE_IDS = [
  'c-what-is-vc',
  'c-ecosystem',
  'c-vc-job',
  'c-deal-flow',
  'c-mathematiques-vc',
  'c-investment-recommendation',
  'c-professional-integrity',
] as const;

const ANALYST_FOUNDATIONS_LESSON_IDS = [
  'l-vc-definition',
  'l-power-law',
  'l-fund-lifecycle',
  'l-actors',
  'l-stages',
  'l-vc-week',
  'l-roles',
  'l-portfolio-monitoring',
  'l-sourcing',
  'l-screening',
  'l-pipeline-crm',
  'lmv-market-sizing',
  'lmv-unit-economics',
  'lmv-cash-flow-scenarios',
  'lmv-pre-post-ownership',
  'lmv-dilution-cap-table',
  'lmv-valuation-economic-rights',
  'lmv-returns-waterfall',
  'l-fact-hypothesis',
  'l-conflicts-conduct',
  'l-confidentiality',
  'l-ai-integrity',
  'l-critical-errors',
] as const;

describe('Parcours Venture philanthropie', () => {
  it('compose les six cours et leurs 21 leçons sans créer de certification', () => {
    const courseSteps = venturePhilanthropy.steps.filter((step) => step.ref.kind === 'course');
    const lessonIds = lessonIdsForParcours(venturePhilanthropy);

    expect(venturePhilanthropy).toMatchObject({
      id: 'p-venture-philanthropy-foundations',
      slug: 'venture-philanthropy-foundations',
      family: 'maitriser',
      level: 'intermediaire',
    });
    expect(courseSteps.map((step) => step.ref.id)).toEqual(VENTURE_PHILANTHROPY_COURSE_IDS);
    expect(courseSteps.every((step) => step.type === 'coeur' && step.status === 'existant')).toBe(true);
    expect(lessonIds).toHaveLength(21);
    expect(new Set(lessonIds).size).toBe(21);

    for (const courseId of VENTURE_PHILANTHROPY_COURSE_IDS) {
      const course = courseById(courseId);
      expect(course, courseId).toBeDefined();
      expect(parcoursForCourse(courseId, course?.lessonIds)).toContainEqual(
        expect.objectContaining({ id: venturePhilanthropy.id }),
      );
    }
  });

  it('conclut le parcours par le livrable longitudinal et ses revues facultatives', () => {
    const capstoneStep = venturePhilanthropy.steps.find((step) => step.ref.id === 'vp-recommandation-soutien');
    expect(capstoneStep).toMatchObject({
      type: 'pratique',
      ref: { kind: 'milestone', id: 'vp-recommandation-soutien' },
      status: 'existant',
      keystone: true,
    });
    if (!capstoneStep) return;

    const capstone = deliverableById(capstoneStep.ref.id);
    expect(capstone).toMatchObject({
      activityKind: 'capstone',
      caseStudyId: 'cs-vp-insertion-3-regions',
      correctionId: 'corr-vp-trait-union',
      estimatedWorkMinutes: 360,
    });
    expect(resolveStep(capstoneStep)).toMatchObject({
      exists: true,
      href: '/livrables/recommandation-de-soutien-venture-philanthropie',
    });
    expect(venturePhilanthropy.milestone).toMatchObject({
      type: 'memo',
      evaluation: ['auto', 'peer', 'practitioner'],
    });
  });

  it('maintient les 21 leçons dans un format court, pratique et vérifiable', () => {
    const lessonIds = lessonIdsForParcours(venturePhilanthropy);
    const expectedHeadings = [
      'Situation professionnelle',
      'Méthode de travail',
      'Cas d’application',
      'Points de contrôle',
      'Production attendue',
      'Références',
    ];

    for (const lessonId of lessonIds) {
      const lesson = sourceLessonById(lessonId);
      expect(lesson, lessonId).toBeDefined();
      if (!lesson) continue;

      const headings = [...lesson.body.matchAll(/^## (.+)$/gmu)].map((match) => match[1]);
      expect(headings, `${lessonId}: sections`).toEqual(expectedHeadings);
      expect(lesson.learningOutcomes, `${lessonId}: acquis`).toHaveLength(3);
      expect(lesson.keyTakeaways.length, `${lessonId}: points clés`).toBeGreaterThanOrEqual(3);
      expect(lesson.keyTakeaways.length, `${lessonId}: points clés`).toBeLessThanOrEqual(5);

      const [instructionalBody, references = ''] = lesson.body.split('\n\n## Références\n\n');
      const wordPattern = /\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*/gu;
      const instructionalWords = instructionalBody.match(wordPattern)?.length ?? 0;
      const totalWords = lesson.body.match(wordPattern)?.length ?? 0;
      expect(instructionalWords, `${lessonId}: concision`).toBeGreaterThanOrEqual(650);
      expect(instructionalWords, `${lessonId}: concision`).toBeLessThanOrEqual(1_000);
      expect(lesson.readMin, `${lessonId}: temps de lecture`).toBe(Math.ceil(totalWords / 180));
      expect(instructionalBody, `${lessonId}: correction`).toContain('Éléments de correction');

      const referenceLines = references.split('\n').filter((line) => line.startsWith('- ['));
      expect(referenceLines.length, `${lessonId}: sources`).toBeGreaterThanOrEqual(2);
      expect(referenceLines.length, `${lessonId}: sources`).toBeLessThanOrEqual(4);
      for (const referenceLine of referenceLines) {
        expect(referenceLine, `${lessonId}: source institutionnelle`).toMatch(
          /^- \[[^\]]+(?:19|20)\d{2}[^\]]*\]\(https:\/\/[^)]+\)(?:\s+[—-].*)?$/u,
        );
      }

      expect(lesson.quiz, `${lessonId}: quiz`).toHaveLength(4);
      for (const question of lesson.quiz ?? []) {
        expect(question.options, `${lessonId}: trois options`).toHaveLength(3);
        expect(question.options.filter((option) => option.correct), `${lessonId}: réponse unique`).toHaveLength(1);
        expect(question.explanation.trim().length, `${lessonId}: explication`).toBeGreaterThan(0);
      }
    }
  });
});

describe('Parcours Analyst Foundations', () => {
  it('conserve les sept séquences, les 23 leçons et l’ordre pédagogique du socle Analyst', () => {
    const courseSteps = analystFoundations.steps.filter((step) => step.ref.kind === 'course');
    const lessonIds = lessonIdsForParcours(analystFoundations);

    expect(analystFoundations).toMatchObject({
      id: 'p-analyst-foundations',
      slug: 'analyst-foundations',
      family: 'maitriser',
      level: 'debutant',
    });
    expect(analystFoundations.milestone).toBeUndefined();
    expect(courseSteps.map((step) => step.ref.id)).toEqual([
      'c-what-is-vc',
      'c-ecosystem',
      'c-vc-job',
      'c-deal-flow',
      'c-mathematiques-vc',
      'c-professional-integrity',
    ]);
    expect(analystFoundations.steps.map((step) => step.ref)).toEqual([
      { kind: 'course', id: 'c-what-is-vc' },
      { kind: 'course', id: 'c-ecosystem' },
      { kind: 'course', id: 'c-vc-job' },
      { kind: 'course', id: 'c-deal-flow' },
      { kind: 'course', id: 'c-mathematiques-vc' },
      { kind: 'lesson', id: 'l-fact-hypothesis' },
      { kind: 'course', id: 'c-professional-integrity' },
    ]);
    expect(analystFoundations.steps.every((step) => step.type === 'coeur' && step.status === 'existant')).toBe(true);
    expect(lessonIds).toEqual(ANALYST_FOUNDATIONS_LESSON_IDS);
    expect(new Set(lessonIds).size).toBe(23);

    for (const courseId of ANALYST_FOUNDATIONS_COURSE_IDS) {
      const course = courseById(courseId);
      expect(course, courseId).toBeDefined();
      expect(parcoursForCourse(courseId, course?.lessonIds)).toContainEqual(
        expect.objectContaining({ id: analystFoundations.id }),
      );
    }
  });

  it('reste un parcours sans certification, évaluation ni résultat local', () => {
    expect(certificationBySlug('analyst-foundations')).toBeUndefined();
    expect(CERTIFICATION_ASSESSMENTS.some((assessment) => assessment.certificationId === 'cert-analyst-foundations')).toBe(false);
  });

  it('préserve des prérequis résolubles et des leçons sans identifiant d’évaluation', () => {
    const foundationsSet = new Set<string>(ANALYST_FOUNDATIONS_LESSON_IDS);

    for (const lessonId of ANALYST_FOUNDATIONS_LESSON_IDS) {
      const lesson = sourceLessonById(lessonId);
      expect(lesson, lessonId).toBeDefined();
      expect(Object.prototype.hasOwnProperty.call(lesson ?? {}, 'assessmentId'), lessonId).toBe(false);
      for (const prerequisiteId of lesson?.prerequisiteLessonIds ?? []) {
        expect(foundationsSet.has(prerequisiteId), `${lessonId} <- ${prerequisiteId}`).toBe(true);
      }
    }

    expect(sourceLessonById('lmv-market-sizing')?.prerequisiteLessonIds).toEqual(['l-pipeline-crm']);
    expect(sourceLessonById('l-fact-hypothesis')?.prerequisiteLessonIds).toEqual(['lmv-returns-waterfall']);
    expect(sourceLessonById('l-conflicts-conduct')?.prerequisiteLessonIds).toEqual(['l-fact-hypothesis']);
  });
});
