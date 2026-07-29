import { describe, expect, it } from 'vitest';
import lessonsSourceJson from '@data/lessons.json';

import { CERTIFICATION_ASSESSMENTS } from './certificationAssessments';
import { certificationBySlug } from './certifications';
import { courseById } from './courses';
import { deliverableById } from './deliverables';
import { parcoursTimeSummary } from './learningTime';
import {
  lessonIdsForParcours,
  parcoursBySlug,
  parcoursContextHref,
  parcoursForCourse,
  parcoursNavigationForLesson,
  resolveStep,
} from './parcours';
import type { Lesson } from './types';

const venturePhilanthropy = parcoursBySlug('venture-philanthropy-foundations');
const analystFoundations = parcoursBySlug('analyst-foundations');
const stageVcPath = parcoursBySlug('decrocher-un-stage-en-vc');
const entretienAnalyst = parcoursBySlug('reussir-l-entretien-analyst');

if (!venturePhilanthropy) {
  throw new Error('Le parcours Venture philanthropie doit être publié.');
}
if (!analystFoundations) {
  throw new Error('Le parcours Analyst Foundations doit être publié.');
}
if (!stageVcPath) {
  throw new Error('Le parcours Décrocher un stage en VC doit être publié.');
}
if (!entretienAnalyst) {
  throw new Error('Le parcours Réussir l’entretien Analyst doit être publié.');
}

const SOURCE_LESSONS = lessonsSourceJson as Lesson[];
const sourceLessonById = (id: string) => SOURCE_LESSONS.find((lesson) => lesson.id === id);
const publishedLessonText = (id: string) => {
  const lesson = sourceLessonById(id);
  if (!lesson) return '';

  return [
    lesson.title,
    lesson.summary,
    lesson.body,
    lesson.bodyShort,
    ...(lesson.keyTakeaways ?? []),
    ...(lesson.quiz ?? []).flatMap((question) => [
      question.question,
      question.explanation,
      ...question.options.map((option) => option.text),
    ]),
    ...(lesson.furtherReading ?? []).flatMap((reading) => [reading.label, reading.ref]),
  ].join('\n');
};

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

describe('Parcours Décrocher un stage en VC', () => {
  it('résout la mini-analyse en livrable final vérifiable et sourcé', () => {
    const miniAnalysisStep = stageVcPath.steps.find((step) => step.ref.id === 'todo-mini-analyse-gabarit');

    expect(miniAnalysisStep).toMatchObject({
      type: 'pratique',
      ref: { kind: 'milestone', id: 'todo-mini-analyse-gabarit' },
      status: 'existant',
      keystone: true,
    });
    if (!miniAnalysisStep) return;

    expect(resolveStep(miniAnalysisStep)).toMatchObject({
      exists: true,
      href: '/livrables/mini-analyse-startup-candidature-vc',
    });

    const deliverable = deliverableById(miniAnalysisStep.ref.id);
    expect(deliverable).toMatchObject({
      activityKind: 'capstone',
      estimatedWorkMinutes: 90,
      evaluation: ['auto'],
      model: {
        kind: 'memo',
        id: 'memo-shopify-bessemer',
      },
    });
    expect(deliverable?.template.map((section) => section.heading)).toEqual([
      'Cadrage et adéquation au fonds',
      'Thèse en une phrase',
      'Faits déterminants',
      'Interprétation et avantage possible',
      'Risques et informations manquantes',
      'Position et vérifications suivantes',
    ]);
    expect(deliverable?.rubric).toHaveLength(5);
    expect(deliverable?.rubricLevels?.map((level) => level.id)).toEqual([
      'insuffisant',
      'acceptable',
      'solide',
      'non-observable',
    ]);
    expect(deliverable?.resources?.some((resource) => resource.href === 'https://www.bvp.com/memos/shopify')).toBe(true);
    expect(stageVcPath.milestone).toMatchObject({
      type: 'memo',
      evaluation: ['auto'],
    });
  });
});

describe('Parcours Réussir l’entretien Analyst', () => {
  it('ramène la trajectoire à 13 étapes et résout le mock en livrable local', () => {
    expect(entretienAnalyst.time).toMatchObject({ source: 'derived' });
    expect(entretienAnalyst.steps).toHaveLength(13);
    expect(entretienAnalyst.steps.some((step) => step.ref.kind === 'case')).toBe(false);
    expect(entretienAnalyst.steps.some((step) => step.ref.kind === 'simulator')).toBe(false);
    expect(entretienAnalyst.steps.map((step) => step.ref)).toContainEqual({ kind: 'course', id: 'c-mathematiques-vc' });
    expect(entretienAnalyst.steps.find((step) => step.ref.id === 'c-mathematiques-vc')?.type).toBe('coeur');
    expect(entretienAnalyst.steps.slice(7, 12).map((step) => step.ref.id)).toEqual([
      'lea-fund-research',
      'lea-pitch',
      'lea-fit',
      'lea-reverse-questions',
      'lea-jour-j',
    ]);
    expect(courseById('c-mathematiques-vc')).toMatchObject({
      durationMin: 43,
      durationSource: 'lesson-read-minutes',
    });

    const finalStep = entretienAnalyst.steps.find((step) => step.ref.kind === 'milestone' && step.ref.id === 'lea-mock');
    expect(finalStep).toMatchObject({
      order: 13,
      type: 'pratique',
      status: 'existant',
      keystone: true,
    });
    if (!finalStep) return;

    expect(resolveStep(finalStep)).toMatchObject({
      exists: true,
      href: '/livrables/mock-entretien-analyst',
    });

    const deliverable = deliverableById('lea-mock');
    expect(deliverable).toMatchObject({
      activityKind: 'capstone',
      estimatedWorkMinutes: 150,
      evaluation: ['auto', 'peer'],
      model: { kind: 'memo', id: 'memo-shopify-bessemer' },
    });
    expect(deliverable?.template.map((section) => section.heading)).toEqual([
      'Choix du fonds, de la société et des sources',
      'Thèse et recommandation provisoire',
      'Faits vérifiés et hypothèses',
      'Lecture marché, modèle et cap table',
      'Questions de diligence et risques',
      'Simulation orale et révision',
    ]);
    expect(deliverable?.brief).toMatch(/conserve localement dans le navigateur une note de suivi et les états de progression/i);
    expect(deliverable?.brief).toMatch(/ni validation externe ni certification/i);
  });

  it('sépare la charge requise des bonus sans intégrer la revue facultative', () => {
    expect(parcoursTimeSummary(entretienAnalyst)).toEqual({
      readingMinutes: 104,
      guidedPracticeMinutes: 0,
      consolidationMinutes: 0,
      finalMinutes: 156,
      optionalMinutes: 9,
      requiredMinutes: 260,
      completeMinutes: 269,
    });
  });

  it('conserve les 13 leçons sourcées du cours entretien', () => {
    const course = courseById('c-entretien-analyst');
    expect(course).toMatchObject({
      durationSource: 'lesson-read-minutes',
    });
    expect(course?.lessonIds).toHaveLength(13);

    for (const lessonId of course?.lessonIds ?? []) {
      const lesson = sourceLessonById(lessonId);
      expect(lesson, lessonId).toBeDefined();
      expect(lesson?.furtherReading?.some((reading) => reading.kind === 'external' && reading.ref.startsWith('https://')), `${lessonId}: source externe`).toBe(true);
      expect(lesson?.bodyShort, `${lessonId}: version courte`).toBeTruthy();
      expect(publishedLessonText(lessonId), `${lessonId}: faits`).not.toMatch(
        /trois à quatre tours|70 %|±15 %|élimin|différenciateur|position de force|grille universelle|ltv[^\n]{0,30}supérieur à 3|payback[^\n]{0,30}12-18 mois|doit tenir en moins de deux minutes|la plupart des erreurs|testent rarement|un fonds recrute souvent|idéalement enregistré|moins de 24 heures|MRR annualisé divisé|prépare trois histoires de 60 à 90 secondes|les 48 heures avant l'entretien|note secrète|surjoue|faire ses devoirs|processus principalement américains|destiné surtout au marché américain|formats américains|France Invest présente en 2017|250 fonds VC|canaux de recrutement selon le niveau de poste|(?:réalisés|traités) sur place|Principals non seniors|quatre familles sont directement transposables|Il justifie néanmoins de traiter le fit|N’importe pas les demandes confidentielles du DDQ|les sources sectorielles attestent|une trame en cinq temps suffit|à l'écrit, place la conclusion en haut|deux risques reliés à la décision valent mieux|Diversity VC Standard 2026|benchmark volontaire|à l'échelle internationale|source commerciale américaine|jeunes professionnels|\bde l'Analyst\b|la couleur du deck/iu,
      );
    }
  });

  it('remplace les références DGAFP et OPM par des sources spécialisées VC et private markets', () => {
    const course = courseById('c-entretien-analyst');
    const expectedSources: Record<string, string[]> = {
      'lea-process': [
        'https://www.franceinvest.eu/le-capital-investissement-recrute/',
        'https://ventureforward.org/wp-content/uploads/2025/06/VC-Human-Capital-Survey-5th-Edition-Results_FINAL.pdf',
        'https://www.goingvc.com/post/how-to-navigate-your-way-through-the-four-vc-stages-of-the-vc-interview-process',
      ],
      'lea-grille': [
        'https://www.franceinvest.eu/le-capital-investissement-recrute/',
        'https://www.nber.org/system/files/working_papers/w22587/w22587.pdf',
        'https://www.franceinvest.eu/boite-outils/diversite/diversite-et-inclusion/',
        'https://www.cfainstitute.org/sites/default/files/docs/programs/private-equity-certificate/pec-syllabus-and-learning-outcomes-v3-may-2025.pdf',
      ],
      'lea-case-study': [
        'https://www.franceinvest.eu/le-capital-investissement-recrute/',
        'https://www.ukprivatecapital.co.uk/resource/learn-the-fundamentals-of-private-equity-with-the-bvcas-flagship-foundation-course.html',
        'https://www.goingvc.com/post/how-to-prepare-for-case-studies-and-analysis-in-the-vc-interview-process',
      ],
      'lea-fit': [
        'https://www.franceinvest.eu/le-capital-investissement-recrute/',
        'https://ilpa.org/wp-content/uploads/2021/11/ILPA-DDQ-2.0.pdf',
        'https://diversity.vc/the-standard/',
      ],
      'lea-reverse-questions': [
        'https://ilpa.org/wp-content/uploads/2021/11/ILPA-DDQ-2.0.pdf',
        'https://www.goingvc.com/post/which-vc-fund-should-you-join-a-career-focused-framework',
      ],
      'lea-jour-j': [
        'https://www.franceinvest.eu/le-capital-investissement-recrute/',
        'https://www.goingvc.com/post/how-to-navigate-your-way-through-the-four-vc-stages-of-the-vc-interview-process',
        'https://www.goingvc.com/post/how-to-prepare-for-case-studies-and-analysis-in-the-vc-interview-process',
      ],
    };

    for (const lessonId of course?.lessonIds ?? []) {
      const publishedText = publishedLessonText(lessonId);
      expect(publishedText, `${lessonId}: source généraliste ou date périmée`).not.toMatch(
        /DGAFP|Direction générale de l'administration et de la fonction publique|fonction-publique\.gouv\.fr|\bOPM\b|Office of Personnel Management|opm\.gov|France Invest 2017/iu,
      );
    }

    for (const [lessonId, refs] of Object.entries(expectedSources)) {
      const lesson = sourceLessonById(lessonId);
      const actualRefs = lesson?.furtherReading?.map((reading) => reading.ref) ?? [];
      for (const ref of refs) {
        expect(actualRefs, `${lessonId}: ${ref}`).toContain(ref);
        const reading = lesson?.furtherReading?.find((entry) => entry.ref === ref);
        expect(reading?.label, `${lessonId}: géographie de ${ref}`).toMatch(/France|États-Unis|Royaume-Uni|international/iu);
        expect(reading?.label, `${lessonId}: segment de ${ref}`).toMatch(/capital-investissement|private markets|PE\/VC|\bVC\b/iu);
        expect(reading?.label, `${lessonId}: type de ${ref}`).toMatch(
          /FAQ|témoignage|rubrique métier|enquête|survey|guide commercial|syllabus|manifeste|formation|DDQ|Due Diligence Questionnaire|évaluation|certification/iu,
        );
        if (ref.startsWith('https://www.goingvc.com/')) {
          expect(reading?.label, `${lessonId}: portée GoingVC`).toMatch(
            /audience internationale.*organisme établi aux États-Unis|organisme établi aux États-Unis.*audience internationale/iu,
          );
        }
      }
    }
  });

  it('transporte explicitement le parcours et refuse un contexte étranger à la leçon', () => {
    expect(parcoursContextHref('/courses/mathematiques-du-vc', 'p-entretien-analyst')).toBe(
      '/courses/mathematiques-du-vc?parcours=p-entretien-analyst',
    );
    expect(parcoursContextHref('/glossary?term=arr', 'p-entretien-analyst')).toBe(
      '/glossary?term=arr&parcours=p-entretien-analyst',
    );
    expect(parcoursContextHref('/lessons/le-fit-why-vc-why-fund-why-you', 'p-entretien-analyst', 'medium')).toBe(
      '/lessons/le-fit-why-vc-why-fund-why-you?parcours=p-entretien-analyst&budget=medium',
    );
    expect(parcoursNavigationForLesson('lmv-market-sizing', 'p-entretien-analyst')?.prev).toMatchObject({
      href: '/lessons/lire-une-startup-unit-economics',
      title: 'Lire une startup et ses métriques',
    });
    expect(parcoursNavigationForLesson('lea-read-startup', 'p-analyst-foundations')).toBeNull();
    expect(parcoursNavigationForLesson('lea-mock', 'p-entretien-analyst')).toBeNull();
  });

  it('calcule la navigation suivante selon l’ordre du parcours plutôt que le seul cours', () => {
    expect(parcoursNavigationForLesson('lea-read-startup', 'p-entretien-analyst')?.next).toMatchObject({
      href: '/courses/mathematiques-du-vc',
      title: 'Réviser les mathématiques du VC',
    });
    expect(parcoursNavigationForLesson('lea-jour-j', 'p-entretien-analyst')?.next).toMatchObject({
      href: '/livrables/mock-entretien-analyst',
      title: 'Produire et réviser le mock final',
    });
    expect(parcoursNavigationForLesson('lmv-returns-waterfall', 'p-entretien-analyst')?.next).toMatchObject({
      href: '/lessons/le-deal-memo',
      title: 'Écrire une recommandation courte',
    });
    expect(parcoursNavigationForLesson('lea-fit', 'p-entretien-analyst', 'medium')?.next).toMatchObject({
      href: '/livrables/mock-entretien-analyst',
      title: 'Produire et réviser le mock final',
    });
  });
});
