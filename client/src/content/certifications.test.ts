import { describe, expect, it } from 'vitest';
import lessonsSourceJson from '@data/lessons.json';
import { CANDIDATE_CHARTERS, candidateCharterByIdVersion } from './candidateCharters';
import { CERTIFICATION_LEVELS } from './certificationLevels';
import { courseById } from './courses';
import { loadLesson, lessonById } from './lessons';
import type { Lesson } from './types';
import {
  certificationBySlug,
  certificationDisplayTitle,
  createCertificationEnrollment,
  isProfessionalCertification,
  lessonIdsForCertification,
  resolveCertificationCurriculum,
  resolveCertificationProgress,
  resolveCertificationSupplement,
  resolveFinalAssessment,
  upsertCertificationEnrollment,
  type CertificationSelection,
  type CertificationSpecialty,
  type DealRole,
  type FundStage,
} from './certifications';

const analyst = certificationBySlug('analyste-en-capital-risque');

if (!analyst || !isProfessionalCertification(analyst)) {
  throw new Error('VC Analyst doit être publié comme certification professionnelle.');
}

const SOURCE_LESSONS = lessonsSourceJson as Lesson[];
const sourceLessonById = (id: string) => SOURCE_LESSONS.find((lesson) => lesson.id === id);

const FUND_STAGES = [undefined, 'pre-seed', 'seed', 'series-a', 'growth'] as const satisfies readonly (
  | FundStage
  | undefined
)[];
const DEAL_ROLES = [undefined, 'lead', 'co-lead', 'follower'] as const satisfies readonly (
  | DealRole
  | undefined
)[];
const SPECIALTIES = [
  undefined,
  'generalist',
  'saas',
  'deeptech',
  'climate',
  'health-biotech',
  'consumer-marketplaces',
  'impact',
] as const satisfies readonly (CertificationSpecialty | undefined)[];

const AXIS_ORDER = ['fundStage', 'dealRole', 'specialty'] as const;

// Preserve the editorial sequence used to verify quiz-answer distribution
// across the shared Analyst corpus.
const ALL_35_EDITORIAL_ORDER = [
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
  'l-founder-analysis',
  'l-team-market',
  'l-product-analysis',
  'l-traction-unit-economics',
  'lmv-market-sizing',
  'lmv-unit-economics',
  'lmv-cash-flow-scenarios',
  'lmv-pre-post-ownership',
  'lmv-dilution-cap-table',
  'lmv-valuation-economic-rights',
  'lmv-returns-waterfall',
  'l-dd-process',
  'l-dd-commercial',
  'l-dd-tech-product',
  'l-dd-team',
  'l-dd-financial',
  'l-dd-legal',
  'l-fact-hypothesis',
  'l-investment-recommendation',
  'l-ic-defense',
  'l-conflicts-conduct',
  'l-confidentiality',
  'l-ai-integrity',
  'l-critical-errors',
] as const;

const COURSE_IDS_FOR_35 = [
  'c-what-is-vc',
  'c-ecosystem',
  'c-vc-job',
  'c-deal-flow',
  'c-startup-analysis',
  'c-mathematiques-vc',
  'c-due-diligence',
  'c-investment-recommendation',
  'c-professional-integrity',
] as const;

const COMPOSITIONS: CertificationSelection[] = FUND_STAGES.flatMap((fundStage) =>
  DEAL_ROLES.flatMap((dealRole) =>
    SPECIALTIES.map((specialty) => ({ fundStage, dealRole, specialty })),
  ),
);

function compositionKey(selection: CertificationSelection): string {
  return [selection.fundStage ?? 'none', selection.dealRole ?? 'none', selection.specialty ?? 'none'].join('/');
}

describe('Corpus éditorial Analyst', () => {
  it('retire les identifiants d’évaluation inertes des 35 leçons publiées', () => {
    for (const lessonId of ALL_35_EDITORIAL_ORDER) {
      const lesson = sourceLessonById(lessonId);
      expect(lesson, lessonId).toBeDefined();
      expect(Object.prototype.hasOwnProperty.call(lesson, 'assessmentId'), lessonId).toBe(false);
    }
  });

  it('conserve la qualité éditoriale, les sources et les quiz du corpus de 35 leçons', async () => {
    const quizCorrectPositionCounts = [0, 0, 0];
    let previousQuizCorrectPosition: number | undefined;
    let repeatedQuizCorrectPositionCount = 0;

    for (const lessonId of ALL_35_EDITORIAL_ORDER) {
      const sourceEntry = sourceLessonById(lessonId);
      const entry = lessonById(lessonId);
      expect(sourceEntry, lessonId).toBeDefined();
      expect(entry, lessonId).toBeDefined();
      expect(sourceEntry?.status, lessonId).not.toBe('upcoming');
      expect(sourceEntry?.contexts, lessonId).toEqual({});
      expect(sourceEntry?.optional, lessonId).toBe(false);
      expect(sourceEntry?.learningOutcomes, lessonId).toHaveLength(3);
      expect(Object.prototype.hasOwnProperty.call(sourceEntry, 'sources'), lessonId).toBe(false);

      const lesson = entry ? await loadLesson(entry.slug) : undefined;
      expect(lesson, lessonId).toBeDefined();
      if (!lesson) continue;

      const instructionalBody = lesson.body.split('## Références')[0];
      const instructionalWords = instructionalBody.match(/\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*/gu)?.length ?? 0;
      const totalWords = lesson.body.match(/\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*/gu)?.length ?? 0;
      const references = lesson.body.split('## Références')[1] ?? '';
      const sourceLinks = references.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) ?? [];
      const referenceLines = references.split('\n').filter((line) => line.startsWith('- ['));

      expect(instructionalWords, `${lessonId}: longueur`).toBeGreaterThanOrEqual(900);
      expect(instructionalWords, `${lessonId}: longueur`).toBeLessThanOrEqual(1400);
      expect(sourceEntry?.readMin, `${lessonId}: temps de lecture`).toBe(Math.ceil(totalWords / 180));
      expect(lesson.body, `${lessonId}: cadre`).toContain('## Cadre');
      expect(lesson.body, `${lessonId}: méthode`).toContain('## Méthode');
      expect(lesson.body, `${lessonId}: exemple`).toMatch(/## (?:Exemple|Cas d'application)/u);
      expect(lesson.body, `${lessonId}: limites`).toContain('## Limites et points de contrôle');
      expect(lesson.body, `${lessonId}: exercice`).toContain('## Mise en application');
      expect(lesson.body.match(/## Références/gu), `${lessonId}: section de références`).toHaveLength(1);
      expect(sourceLinks.length, `${lessonId}: sources`).toBeGreaterThanOrEqual(2);
      expect(sourceLinks.length, `${lessonId}: sources`).toBeLessThanOrEqual(4);
      expect(referenceLines, `${lessonId}: sources structurées`).toHaveLength(sourceLinks.length);
      for (const referenceLine of referenceLines) {
        expect(referenceLine, `${lessonId}: source datée`).toMatch(/(?:19|20)\d{2}/u);
      }
      expect(lesson.keyTakeaways.length, `${lessonId}: acquis clés`).toBeGreaterThanOrEqual(3);
      expect(lesson.keyTakeaways.length, `${lessonId}: acquis clés`).toBeLessThanOrEqual(5);
      expect(lesson.quiz, `${lessonId}: quiz`).toHaveLength(4);
      const lessonCorrectPositions: number[] = [];
      for (const question of lesson.quiz ?? []) {
        expect(question.options, `${lessonId}: trois options`).toHaveLength(3);
        expect(question.options.filter((option) => option.correct), `${lessonId}: réponse unique`).toHaveLength(1);
        expect(question.explanation.trim().length, `${lessonId}: explication du quiz`).toBeGreaterThan(0);

        const correctPosition = question.options.findIndex((option) => option.correct);
        expect(correctPosition, `${lessonId}: position de la bonne réponse`).toBeGreaterThanOrEqual(0);
        if (correctPosition >= 0) {
          lessonCorrectPositions.push(correctPosition);
          quizCorrectPositionCounts[correctPosition] += 1;
          repeatedQuizCorrectPositionCount = correctPosition === previousQuizCorrectPosition
            ? repeatedQuizCorrectPositionCount + 1
            : 1;
          previousQuizCorrectPosition = correctPosition;
          expect(repeatedQuizCorrectPositionCount, `${lessonId}: répétition de la position correcte`).toBeLessThanOrEqual(2);
        }
      }
      expect(new Set(lessonCorrectPositions).size, `${lessonId}: positions des bonnes réponses`).toBeGreaterThanOrEqual(2);
    }

    for (const courseId of COURSE_IDS_FOR_35) {
      const course = courseById(courseId);
      expect(course, courseId).toBeDefined();
      let expectedDurationMin = 0;
      for (const [index, lessonId] of (course?.lessonIds ?? []).entries()) {
        const lesson = sourceLessonById(lessonId);
        expect(lesson?.courseId, lessonId).toBe(courseId);
        expect(lesson?.order, lessonId).toBe(index + 1);
        expectedDurationMin += (lesson?.readMin ?? 0) + 8;
      }
      expect(course?.durationMin, `${courseId}: durée`).toBe(expectedDurationMin);
    }

    expect(Math.max(...quizCorrectPositionCounts) - Math.min(...quizCorrectPositionCounts)).toBeLessThanOrEqual(1);
  });
});

describe('Certification professionnelle VC Analyst', () => {
  it('conserve trois blocs de préparation recommandée et leurs douze leçons', () => {
    const lessonIds = analyst.recommendedPreparation.flatMap((requirement) => requirement.lessonIds);

    expect(analyst.recommendedPreparation).toHaveLength(3);
    expect(lessonIds).toHaveLength(12);
    expect(new Set(lessonIds).size).toBe(12);
    expect(analyst.recommendedPreparation.find((requirement) => requirement.courseId === 'c-investment-recommendation')?.lessonIds)
      .toEqual(['l-investment-recommendation', 'l-ic-defense']);
  });

  it('expose les 160 compositions facultatives attendues, dont la spécialité Impact', () => {
    expect(COMPOSITIONS).toHaveLength(5 * 4 * 8);
    expect(new Set(COMPOSITIONS.map(compositionKey)).size).toBe(160);
    expect(analyst.axes.fundStage.options.map((option) => option.id)).toEqual(FUND_STAGES.slice(1));
    expect(analyst.axes.dealRole.options.map((option) => option.id)).toEqual(DEAL_ROLES.slice(1));
    expect(analyst.axes.specialty.options.map((option) => option.id)).toEqual(SPECIALTIES.slice(1));

    const impact = analyst.axes.specialty.options.find((option) => option.id === 'impact');
    expect(impact).toMatchObject({
      label: 'Impact',
      certificateLabel: 'spécialité Impact',
      requirement: {
        id: 'specialty-impact',
        title: 'Spécialité Impact',
        lessonIds: ['l-specialty-impact-intentionality', 'l-specialty-impact-measurement'],
      },
    });
    expect(impact?.requirement.summary).toMatch(/intentionnalité.*additionalité.*théorie du changement.*matérialité/i);

    const optionalLessonIds = Object.values(analyst.axes).flatMap((axis) =>
      axis.options.flatMap((option) => option.requirement.lessonIds),
    );
    expect(optionalLessonIds).toHaveLength(28);
    expect(new Set(optionalLessonIds).size).toBe(28);
    for (const lessonId of optionalLessonIds) {
      expect(lessonById(lessonId), lessonId).toMatchObject({ status: 'upcoming', optional: true });
    }
  });

  it('résout chaque composition après la préparation recommandée, sans doublon', () => {
    const recommendedIds = analyst.recommendedPreparation.map((requirement) => requirement.id);

    for (const selection of COMPOSITIONS) {
      const key = compositionKey(selection);
      const selectedOptions = AXIS_ORDER.flatMap((axisId) => {
        const selectedId = selection[axisId];
        if (!selectedId) return [];
        const option = analyst.axes[axisId].options.find((candidate) => candidate.id === selectedId);
        expect(option, `${key}:${axisId}`).toBeDefined();
        return option ? [{ axisId, option }] : [];
      });
      const expectedIds = [...recommendedIds, ...selectedOptions.map(({ option }) => option.requirement.id)];
      const expectedSources = [
        ...analyst.recommendedPreparation.map(() => 'recommended'),
        ...selectedOptions.map(({ axisId }) => axisId),
      ];
      const curriculum = resolveCertificationCurriculum(analyst, selection);

      expect(curriculum.map((requirement) => requirement.id), key).toEqual(expectedIds);
      expect(curriculum.map((requirement) => requirement.source), key).toEqual(expectedSources);
      expect(new Set(curriculum.map((requirement) => requirement.id)).size, key).toBe(curriculum.length);
      expect(new Set(curriculum.map((requirement) => requirement.courseId)).size, key).toBe(curriculum.length);

      const curriculumLessonIds = curriculum.flatMap((requirement) => requirement.lessonIds);
      expect(new Set(curriculumLessonIds).size, key).toBe(curriculumLessonIds.length);
      expect(lessonIdsForCertification(analyst, selection), key).toEqual(curriculumLessonIds);
    }
  });

  it('conserve le titre VC Analyst et résout le supplément séparément dans les 160 compositions', () => {
    for (const selection of COMPOSITIONS) {
      const key = compositionKey(selection);
      const supplement = resolveCertificationSupplement(analyst, selection);

      expect(certificationDisplayTitle(analyst, selection), key).toBe('VC Analyst');
      for (const axisId of AXIS_ORDER) {
        const selectedId = selection[axisId];
        const resolved = supplement[axisId];
        if (!selectedId) {
          expect(resolved, `${key}:${axisId}`).toBeUndefined();
          continue;
        }
        const option = analyst.axes[axisId].options.find((candidate) => candidate.id === selectedId);
        expect(resolved, `${key}:${axisId}`).toEqual({
          axisId,
          optionId: selectedId,
          label: option?.label,
          certificateLabel: option?.certificateLabel,
        });
      }
    }
  });

  it('adapte le cas final avec les seules variantes d’axe sélectionnées', () => {
    for (const selection of COMPOSITIONS) {
      const curriculum = resolveCertificationCurriculum(analyst, selection);
      const expectedVariantIds = curriculum
        .filter((requirement) => requirement.source !== 'recommended')
        .map((requirement) => requirement.assessmentVariantId);
      const assessment = resolveFinalAssessment(analyst, selection);

      expect(assessment.optionVariants.map((variant) => variant.id), compositionKey(selection)).toEqual(
        expectedVariantIds,
      );
      expect(assessment.rubricCriteria.reduce((sum, criterion) => sum + criterion.maxScore, 0)).toBe(100);
    }
  });

  it('persiste uniquement les axes renseignés et conserve la date de création', () => {
    const first = createCertificationEnrollment(
      analyst.id,
      { fundStage: 'pre-seed', dealRole: undefined, specialty: 'impact' },
      null,
      '2026-01-01T10:00:00.000Z',
    );
    const modified = createCertificationEnrollment(
      analyst.id,
      { dealRole: 'lead' },
      first,
      '2026-02-01T10:00:00.000Z',
    );
    const enrollments = upsertCertificationEnrollment({ [analyst.id]: first }, modified);

    expect(first.selection).toEqual({ fundStage: 'pre-seed', specialty: 'impact' });
    expect(modified.selection).toEqual({ dealRole: 'lead' });
    expect(modified.createdAt).toBe(first.createdAt);
    expect(modified.updatedAt).toBe('2026-02-01T10:00:00.000Z');
    expect(enrollments[analyst.id]).toEqual(modified);
  });

  it('recalcule le dénominateur sans supprimer la progression historique d’une option retirée', () => {
    const historicalProgress = {
      'l-founder-analysis': { status: 'done' as const },
      'l-stage-preseed-team': { status: 'done' as const },
    };
    const withPreSeed = resolveCertificationProgress(analyst, { fundStage: 'pre-seed' }, historicalProgress);
    const preparationOnly = resolveCertificationProgress(analyst, {}, historicalProgress);
    const restoredPreSeed = resolveCertificationProgress(analyst, { fundStage: 'pre-seed' }, historicalProgress);

    expect(withPreSeed.lessonIds).toContain('l-stage-preseed-team');
    expect(withPreSeed.lessonIds).toHaveLength(preparationOnly.lessonIds.length + 2);
    expect(withPreSeed.doneCount).toBe(2);
    expect(preparationOnly.doneCount).toBe(1);
    expect(preparationOnly.lessonIds).not.toContain('l-stage-preseed-team');
    expect(restoredPreSeed.doneCount).toBe(2);
    expect(historicalProgress['l-stage-preseed-team'].status).toBe('done');
  });
});

describe('Collections canoniques de certification', () => {
  it('publie exactement cinq promesses et n’engage rien pour les quatre niveaux supérieurs', () => {
    expect(CERTIFICATION_LEVELS.map((level) => [level.id, level.order])).toEqual([
      ['analyst', 1],
      ['associate-foundations', 2],
      ['associate', 3],
      ['senior-associate', 4],
      ['principal', 5],
    ]);
    for (const level of CERTIFICATION_LEVELS.slice(1)) {
      expect(level.status, level.id).toBe('future');
      expect(level.certificationId, level.id).toBeUndefined();
      expect(Object.prototype.hasOwnProperty.call(level, 'duration'), level.id).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(level, 'durationHours'), level.id).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(level, 'passingScore'), level.id).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(level, 'courseIds'), level.id).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(level, 'courseRequirementIds'), level.id).toBe(false);
    }
  });

  it('versionne la charte et garde l’annexe de session future inactive', () => {
    expect(CANDIDATE_CHARTERS).toHaveLength(1);
    const charter = candidateCharterByIdVersion('candidate-charter', '1.0.0');
    expect(charter?.status).toBe('active');
    expect(charter?.principles.map((principle) => principle.id)).toEqual([
      'authenticity',
      'sources',
      'artificial-intelligence',
      'confidentiality',
      'conflicts-of-interest',
      'critical-errors',
      'local-data-responsibility',
    ]);
    expect(charter?.futureSessionAnnex.status).toBe('inactive');
  });

});
