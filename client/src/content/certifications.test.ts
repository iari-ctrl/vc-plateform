import { describe, expect, it } from 'vitest';
import { courseById } from './courses';
import { loadLesson, lessonById } from './lessons';
import {
  certificationBySlug,
  certificationDisplayTitle,
  createCertificationEnrollment,
  lessonIdsForCertification,
  resolveCertificationCurriculum,
  resolveCertificationProgress,
  resolveFinalAssessment,
  upsertCertificationEnrollment,
  type CertificationSelection,
  type CertificationSpecialty,
  type DealRole,
  type FundStage,
} from './certifications';

const certification = certificationBySlug('analyste-en-capital-risque');

if (!certification) {
  throw new Error('La certification Analyst en capital-risque doit être publiée dans le catalogue.');
}

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

const EXPECTED_CORE_LESSON_IDS = [
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

const COMPOSITIONS: CertificationSelection[] = FUND_STAGES.flatMap((fundStage) =>
  DEAL_ROLES.flatMap((dealRole) =>
    SPECIALTIES.map((specialty) => ({ fundStage, dealRole, specialty })),
  ),
);

function compositionKey(selection: CertificationSelection): string {
  return [selection.fundStage ?? 'none', selection.dealRole ?? 'none', selection.specialty ?? 'none'].join('/');
}

describe('Certification professionnelle Analyst en capital-risque', () => {
  it('déclare les neuf cours institutionnels du tronc commun dans l’ordre attendu', () => {
    expect(certification.coreRequirements.map((requirement) => requirement.title)).toEqual([
      'Fondamentaux du capital-risque',
      'Écosystème et chaîne de financement',
      "Fonctions et responsabilités de l'Analyst",
      'Sourcing, screening et gestion du pipeline',
      "Analyse d'une opportunité d'investissement",
      "Dimensionnement de marché, modélisation financière et structure de l'investissement",
      'Due diligence et gestion des risques',
      "Recommandation d'investissement et préparation du comité",
      "Intégrité professionnelle, confidentialité et usage déclaré de l'intelligence artificielle",
    ]);
  });

  it('publie un tronc commun complet de 35 leçons certifiantes', async () => {
    const coreLessonIds = certification.coreRequirements.flatMap((requirement) => requirement.lessonIds);

    expect(coreLessonIds).toEqual(EXPECTED_CORE_LESSON_IDS);
    expect(new Set(coreLessonIds).size).toBe(35);

    for (const requirement of certification.coreRequirements) {
      const course = courseById(requirement.courseId);
      expect(course, requirement.courseId).toBeDefined();
      expect(course?.lessonIds, requirement.courseId).toEqual(requirement.lessonIds);

      let expectedDurationMin = 0;
      for (const [courseLessonIndex, lessonId] of requirement.lessonIds.entries()) {
        const entry = lessonById(lessonId);
        const curriculumIndex = coreLessonIds.indexOf(lessonId);
        const expectedPrerequisites = curriculumIndex === 0 ? [] : [coreLessonIds[curriculumIndex - 1]];
        expect(entry, lessonId).toBeDefined();
        expect(entry?.status, lessonId).not.toBe('upcoming');
        expect(entry?.courseId, lessonId).toBe(requirement.courseId);
        expect(entry?.order, lessonId).toBe(courseLessonIndex + 1);
        expect(entry?.contexts, lessonId).toEqual({});
        expect(entry?.optional, lessonId).toBe(false);
        expect(entry?.learningOutcomes, lessonId).toHaveLength(3);
        expect(entry?.prerequisiteLessonIds, lessonId).toEqual(expectedPrerequisites);
        expect(entry?.assessmentId, lessonId).toBe(requirement.assessmentVariantId);
        expect(Object.prototype.hasOwnProperty.call(entry, 'sources'), lessonId).toBe(false);

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
        expect(lesson.readMin, `${lessonId}: temps de lecture`).toBe(Math.ceil(totalWords / 180));
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
        for (const question of lesson.quiz ?? []) {
          expect(question.options.filter((option) => option.correct), `${lessonId}: réponse unique`).toHaveLength(1);
          expect(question.explanation.trim().length, `${lessonId}: explication du quiz`).toBeGreaterThan(0);
        }
        expectedDurationMin += lesson.readMin + 8;
      }

      expect(course?.durationMin, `${requirement.courseId}: durée`).toBe(expectedDurationMin);
    }
  });

  it('expose les 160 compositions facultatives attendues, dont la spécialité Impact', () => {
    expect(COMPOSITIONS).toHaveLength(5 * 4 * 8);
    expect(new Set(COMPOSITIONS.map(compositionKey)).size).toBe(160);
    expect(certification.axes.fundStage.options.map((option) => option.id)).toEqual(FUND_STAGES.slice(1));
    expect(certification.axes.dealRole.options.map((option) => option.id)).toEqual(DEAL_ROLES.slice(1));
    expect(certification.axes.specialty.options.map((option) => option.id)).toEqual(SPECIALTIES.slice(1));

    const impact = certification.axes.specialty.options.find((option) => option.id === 'impact');
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

    const optionalLessonIds = Object.values(certification.axes).flatMap((axis) =>
      axis.options.flatMap((option) => option.requirement.lessonIds),
    );
    expect(optionalLessonIds).toHaveLength(28);
    expect(new Set(optionalLessonIds).size).toBe(28);
    for (const lessonId of optionalLessonIds) {
      expect(lessonById(lessonId), lessonId).toMatchObject({ status: 'upcoming', optional: true });
    }
  });

  it('résout chaque composition avec le tronc commun puis uniquement les blocs choisis, sans doublon', () => {
    const coreIds = certification.coreRequirements.map((requirement) => requirement.id);

    for (const selection of COMPOSITIONS) {
      const key = compositionKey(selection);
      const selectedOptions = AXIS_ORDER.flatMap((axisId) => {
        const selectedId = selection[axisId];
        if (!selectedId) return [];
        const option = certification.axes[axisId].options.find((candidate) => candidate.id === selectedId);
        expect(option, `${key}:${axisId}`).toBeDefined();
        return option ? [{ axisId, option }] : [];
      });
      const expectedIds = [...coreIds, ...selectedOptions.map(({ option }) => option.requirement.id)];
      const expectedSources = [
        ...certification.coreRequirements.map(() => 'core'),
        ...selectedOptions.map(({ axisId }) => axisId),
      ];
      const curriculum = resolveCertificationCurriculum(certification, selection);

      expect(curriculum.map((requirement) => requirement.id), key).toEqual(expectedIds);
      expect(curriculum.map((requirement) => requirement.source), key).toEqual(expectedSources);
      expect(curriculum.slice(0, coreIds.length).map((requirement) => requirement.id), key).toEqual(coreIds);
      expect(new Set(curriculum.map((requirement) => requirement.id)).size, key).toBe(curriculum.length);
      expect(new Set(curriculum.map((requirement) => requirement.courseId)).size, key).toBe(curriculum.length);

      const curriculumLessonIds = curriculum.flatMap((requirement) => requirement.lessonIds);
      expect(new Set(curriculumLessonIds).size, key).toBe(curriculumLessonIds.length);
      expect(lessonIdsForCertification(certification, selection), key).toEqual(curriculumLessonIds);
      expect(resolveCertificationCurriculum(certification, selection).map((requirement) => requirement.id), key).toEqual(
        expectedIds,
      );
    }
  });

  it('construit un titre stable qui omet chaque axe non sélectionné dans les 160 compositions', () => {
    for (const selection of COMPOSITIONS) {
      const key = compositionKey(selection);
      const selectedLabels = AXIS_ORDER.flatMap((axisId) => {
        const selectedId = selection[axisId];
        if (!selectedId) return [];
        const option = certification.axes[axisId].options.find((candidate) => candidate.id === selectedId);
        return option ? [option.certificateLabel] : [];
      });
      const expectedTitle = selectedLabels.length
        ? `${certification.title} — ${selectedLabels.join(', ')}`
        : certification.title;

      expect(certificationDisplayTitle(certification, selection), key).toBe(expectedTitle);
    }
  });

  it('adapte le cas final et sa grille avec les seules variantes sélectionnées', () => {
    for (const selection of COMPOSITIONS) {
      const curriculum = resolveCertificationCurriculum(certification, selection);
      const expectedVariantIds = curriculum
        .filter((requirement) => requirement.source !== 'core')
        .map((requirement) => requirement.assessmentVariantId);
      const assessment = resolveFinalAssessment(certification, selection);

      expect(assessment.optionVariants.map((variant) => variant.id), compositionKey(selection)).toEqual(
        expectedVariantIds,
      );
      expect(assessment.rubricCriteria.reduce((sum, criterion) => sum + criterion.maxScore, 0)).toBe(100);
    }
  });

  it('persiste uniquement les axes renseignés et conserve la date de création lors d’une modification', () => {
    const first = createCertificationEnrollment(
      certification.id,
      { fundStage: 'pre-seed', dealRole: undefined, specialty: 'impact' },
      null,
      '2026-01-01T10:00:00.000Z',
    );
    const modified = createCertificationEnrollment(
      certification.id,
      { dealRole: 'lead' },
      first,
      '2026-02-01T10:00:00.000Z',
    );
    const enrollments = upsertCertificationEnrollment({ [certification.id]: first }, modified);

    expect(first.selection).toEqual({ fundStage: 'pre-seed', specialty: 'impact' });
    expect(modified.selection).toEqual({ dealRole: 'lead' });
    expect(modified.createdAt).toBe(first.createdAt);
    expect(modified.updatedAt).toBe('2026-02-01T10:00:00.000Z');
    expect(enrollments[certification.id]).toEqual(modified);
  });

  it('recalcule le dénominateur sans supprimer la progression historique des options retirées', () => {
    const historicalProgress = {
      'l-vc-definition': { status: 'done' as const },
      'l-stage-preseed-team': { status: 'done' as const },
    };
    const withPreSeed = resolveCertificationProgress(certification, { fundStage: 'pre-seed' }, historicalProgress);
    const coreOnly = resolveCertificationProgress(certification, {}, historicalProgress);
    const restoredPreSeed = resolveCertificationProgress(certification, { fundStage: 'pre-seed' }, historicalProgress);

    expect(withPreSeed.requiredLessonIds).toContain('l-stage-preseed-team');
    expect(withPreSeed.requiredLessonIds).toHaveLength(coreOnly.requiredLessonIds.length + 2);
    expect(withPreSeed.doneCount).toBe(2);
    expect(coreOnly.doneCount).toBe(1);
    expect(coreOnly.requiredLessonIds).not.toContain('l-stage-preseed-team');
    expect(restoredPreSeed.doneCount).toBe(2);
    expect(historicalProgress['l-stage-preseed-team'].status).toBe('done');
  });

  it.each([
    [{}, 'Certification professionnelle Analyst en capital-risque'],
    [
      { fundStage: 'pre-seed' },
      'Certification professionnelle Analyst en capital-risque — orientation Pre-seed',
    ],
    [
      { dealRole: 'lead', specialty: 'impact' },
      'Certification professionnelle Analyst en capital-risque — fonds lead, spécialité Impact',
    ],
    [
      { fundStage: 'pre-seed', dealRole: 'lead', specialty: 'deeptech' },
      'Certification professionnelle Analyst en capital-risque — orientation Pre-seed, fonds lead, spécialité Deeptech',
    ],
  ] satisfies [CertificationSelection, string][])('formate le supplément facultatif pour %j', (selection, expected) => {
    expect(certificationDisplayTitle(certification, selection)).toBe(expected);
  });
});
