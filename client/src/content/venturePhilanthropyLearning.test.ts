import { describe, expect, it } from 'vitest';
import caseCorrectionsJson from '@data/caseCorrections.json';
import caseStudiesJson from '@data/caseStudies.json';
import coursesJson from '@data/courses.json';
import deliverablesJson from '@data/deliverables.json';
import diagnosticsJson from '@data/diagnostics.json';
import lessonsJson from '@data/lessons.json';
import parcoursJson from '@data/parcours.json';

import type { Parcours } from './parcoursTypes';
import type { CaseCorrection, CaseStudy, Course, Deliverable, Diagnostic, Lesson } from './types';
import { parcoursTimeSummary } from './learningTime';

const courses = coursesJson as Course[];
const lessons = lessonsJson as Lesson[];
const cases = caseStudiesJson as CaseStudy[];
const corrections = caseCorrectionsJson as CaseCorrection[];
const diagnostics = diagnosticsJson as Diagnostic[];
const deliverables = deliverablesJson as Deliverable[];
const parcours = parcoursJson as Parcours[];

const COURSE_IDS = [
  'c-vp-mandat-triage',
  'c-vp-probleme-preuves',
  'c-vp-diligence-organisationnelle',
  'c-vp-diligence-financiere',
  'c-vp-structuration-financement',
  'c-vp-partenariat-portefeuille',
] as const;

const REQUIRED_DOCUMENT_KINDS = [
  'income-statements',
  'balance-sheets',
  'trial-balance',
  'monthly-budget',
  'cash-schedule',
  'restricted-funds',
  'cofunding-agreements',
  'board-minutes',
  'organisation',
  'interviews',
  'cohorts',
  'indicator-dictionary',
  'incident-risk-register',
] as const;

function hasForbiddenProperty(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(hasForbiddenProperty);
  return Object.entries(value).some(([key, nested]) => (
    ['score', 'points', 'badge', 'attestation', 'certificate'].includes(key)
    || hasForbiddenProperty(nested)
  ));
}

describe('Venture philanthropy learning cycle', () => {
  it('derives 111 reading minutes from six courses and 21 lessons', () => {
    const vpCourses = COURSE_IDS.map((id) => courses.find((course) => course.id === id));
    expect(vpCourses.every(Boolean)).toBe(true);
    expect(vpCourses.map((course) => course?.durationMin)).toEqual([11, 15, 20, 22, 22, 21]);
    expect(vpCourses.every((course) => course?.durationSource === 'lesson-read-minutes')).toBe(true);

    const lessonIds = vpCourses.flatMap((course) => course?.lessonIds ?? []);
    expect(lessonIds).toHaveLength(21);
    expect(new Set(lessonIds).size).toBe(21);
    expect(lessonIds.reduce((sum, id) => sum + (lessons.find((lesson) => lesson.id === id)?.readMin ?? 0), 0)).toBe(111);
  });

  it('links every lesson contribution to one of three cumulative deliverables', () => {
    const lessonIds = COURSE_IDS.flatMap((courseId) => courses.find((course) => course.id === courseId)?.lessonIds ?? []);
    const practices = lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)?.practice);
    expect(practices.every(Boolean)).toBe(true);
    expect(practices.reduce((sum, practice) => sum + (practice?.estimatedMinutes ?? 0), 0)).toBe(1_350);
    expect(new Set(practices.map((practice) => practice?.deliverableId))).toEqual(new Set([
      'vp-exercice-cumulatif-probleme-preuves',
      'vp-exercice-cumulatif-diligence',
      'vp-exercice-cumulatif-recommandation',
    ]));

    const cumulative = deliverables.filter((deliverable) => [
      'vp-exercice-cumulatif-probleme-preuves',
      'vp-exercice-cumulatif-diligence',
      'vp-exercice-cumulatif-recommandation',
    ].includes(deliverable.id));
    expect(cumulative.reduce((sum, deliverable) => sum + (deliverable.estimatedWorkMinutes ?? 0), 0)).toBe(240);
  });

  it('provides a five-topic optional diagnostic without aggregate scoring fields', () => {
    const diagnostic = diagnostics.find((candidate) => candidate.id === 'diag-vp-entree');
    expect(diagnostic).toMatchObject({
      parcoursId: 'p-venture-philanthropy-foundations',
      optional: true,
    });
    expect(diagnostic?.items).toHaveLength(5);
    expect(new Set(diagnostic?.items.flatMap((item) => item.options.map((option) => option.result)))).toEqual(
      new Set(['a-revoir', 'acquis-a-confirmer', 'point-maitrise']),
    );
    expect(hasForbiddenProperty(diagnostic)).toBe(false);
  });

  it('separates the learner dossier from its voluntarily revealed correction', () => {
    const learnerCase = cases.find((candidate) => candidate.id === 'cs-vp-insertion-3-regions');
    const correction = corrections.find((candidate) => candidate.id === 'corr-vp-trait-union');

    expect(learnerCase?.learningRole).toBe('learner-dossier');
    expect(learnerCase?.summary.toLowerCase()).not.toContain('recommandation privilégie');
    expect(new Set(learnerCase?.documents?.map((document) => document.kind))).toEqual(
      new Set(REQUIRED_DOCUMENT_KINDS),
    );
    expect(correction).toMatchObject({
      sourceCaseId: 'cs-vp-insertion-3-regions',
      revealAfterDeliverableId: 'vp-recommandation-soutien',
    });
    expect(correction?.decisionBranches.length).toBeGreaterThanOrEqual(3);
  });

  it('contains usable 13-week and 18-month source tables', () => {
    const learnerCase = cases.find((candidate) => candidate.id === 'cs-vp-insertion-3-regions');
    const cashSchedule = learnerCase?.documents?.find((document) => document.kind === 'cash-schedule');
    const monthlyBudget = learnerCase?.documents?.find((document) => document.kind === 'monthly-budget');

    expect(cashSchedule?.tables?.some((table) => table.rows.length >= 13)).toBe(true);
    expect(monthlyBudget?.tables?.some((table) => table.rows.length >= 18 || table.columns.length >= 19)).toBe(true);
  });

  it('defines the complete capstone rubric, committee and journal contract without a score', () => {
    const capstone = deliverables.find((deliverable) => deliverable.id === 'vp-recommandation-soutien');
    expect(capstone).toMatchObject({
      activityKind: 'capstone',
      estimatedWorkMinutes: 360,
      externalReviewMinutes: 60,
      caseStudyId: 'cs-vp-insertion-3-regions',
      correctionId: 'corr-vp-trait-union',
    });
    expect(capstone?.components).toHaveLength(8);
    expect(capstone?.rubric).toHaveLength(13);
    expect(capstone?.rubricLevels?.map((level) => level.id)).toEqual([
      'insuffisant',
      'acceptable',
      'solide',
      'non-observable',
    ]);
    expect(capstone?.roleCards).toHaveLength(5);
    expect(capstone?.journal).toMatchObject({ predictionMin: 2, predictionMax: 3 });
    expect(hasForbiddenProperty(capstone)).toBe(false);
  });

  it('links the dossier, exercises, capstone, legal worksheet, workshop and transfer case', () => {
    const vpPath = parcours.find((candidate) => candidate.id === 'p-venture-philanthropy-foundations');
    const stepIds = vpPath?.steps.map((step) => step.ref.id) ?? [];

    expect(vpPath).toMatchObject({ entryDiagnosticId: 'diag-vp-entree', time: { source: 'derived' } });
    expect(stepIds).toEqual(expect.arrayContaining([
      'cs-vp-insertion-3-regions',
      'vp-exercice-cumulatif-probleme-preuves',
      'vp-exercice-cumulatif-diligence',
      'vp-exercice-cumulatif-recommandation',
      'vp-fiche-escalade-juridique',
      'vp-atelier-perspective-financeur',
      'vp-recommandation-soutien',
      'cs-vp-energie-des-vallees',
    ]));
    expect(cases.find((candidate) => candidate.id === 'cs-vp-energie-des-vallees')).toMatchObject({
      learningRole: 'transfer',
      estimatedWorkMinutes: 120,
    });

    if (!vpPath) return;
    expect(parcoursTimeSummary(vpPath)).toEqual({
      readingMinutes: 128,
      guidedPracticeMinutes: 1_350,
      consolidationMinutes: 270,
      finalMinutes: 372,
      optionalMinutes: 198,
      requiredMinutes: 2_120,
      completeMinutes: 2_318,
    });
  });
});
