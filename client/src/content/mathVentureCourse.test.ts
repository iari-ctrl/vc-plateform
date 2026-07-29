import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import caseCorrectionsJson from '@data/caseCorrections.json';
import caseStudiesJson from '@data/caseStudies.json';
import deliverablesJson from '@data/deliverables.json';
import lessonBodiesJson from '@data/generated/lessons.bodies.json';
import { courseById } from './courses';
import { lessonsForCourse } from './lessons';

type LessonBodies = Record<
  string,
  {
    body: string;
    quiz?: Array<{ explanation?: string }>;
  }
>;

const lessonBodies = lessonBodiesJson as LessonBodies;
type DeliverableContract = {
  id: string;
  slug: string;
  title: string;
  activityKind?: string;
  estimatedWorkMinutes?: number;
  relatedCourseIds?: string[];
  caseStudyId?: string;
  correctionId?: string;
  components?: Array<{ id: string; title: string; requirements: string[] }>;
  resources?: Array<{ label: string; href: string; format: string }>;
};
type CaseStudyContract = {
  id: string;
  learningRole?: string;
  downloads?: Array<{ href: string }>;
  documents?: Array<{ kind: string }>;
  sections: Array<{ heading: string; body: string }>;
};
type CaseCorrectionContract = {
  id: string;
  sourceCaseId: string;
  revealAfterDeliverableId: string;
};

const deliverables = deliverablesJson as DeliverableContract[];
const caseStudies = caseStudiesJson as CaseStudyContract[];
const caseCorrections = caseCorrectionsJson as CaseCorrectionContract[];

const bodyFor = (slug: string) => {
  const lesson = lessonBodies[slug];
  expect(lesson, `Missing generated lesson body for ${slug}`).toBeDefined();
  return lesson.body;
};

describe('cours Mathématiques du VC — corrections éditoriales prioritaires', () => {
  it('publie la formule de complément de pool avec les grandeurs initiales', () => {
    const body = bodyFor('dilution-cap-table-et-option-pool');
    const explanations = lessonBodies['dilution-cap-table-et-option-pool'].quiz?.map((item) => item.explanation ?? '').join('\n') ?? '';

    expect(body).not.toContain('Si P est le nombre de titres du pool après complément');
    expect(body).toContain('P₀');
    expect(body).toContain('T₀');
    expect(body).toContain('x = (c × T₀ − P₀) / (1 − c)');
    expect(explanations).toContain('P₀ + x');
  });

  it('spécifie le primaire, le secondaire et la trésorerie effectivement reçue', () => {
    const body = bodyFor('pre-post-money-et-ownership');

    expect(body).toContain('Sur un paiement total de 4 millions d’euros');
    expect(body).toContain('3 millions sont investis dans la société');
    expect(body).toContain('1 million rémunère un actionnaire vendeur');
    expect(body).toContain('1,5 million de titres nouveaux');
    expect(body).toContain('0,5 million de titres existants');
    expect(body).toContain('7,5 millions de titres');
    expect(body).toContain('26,67 %');
    expect(body).toContain('surestime cette trésorerie de 1 million');
  });

  it('distingue le runway jusqu’à zéro du seuil opérationnel minimal', () => {
    const body = bodyFor('modele-tresorerie-runway-scenarios');

    expect(body).toContain('4,8 / 0,35 = 13,71 mois');
    expect(body).toContain('(4,8 − 0,60) / 0,35 = 12 mois');
    expect(body).toContain('temps théorique jusqu’à épuisement de la trésorerie');
    expect(body).toContain('seuil opérationnel minimal');
  });

  it('décrit correctement le plafond 2x et la conversion au-delà du plateau', () => {
    const body = bodyFor('valorisation-transaction-droits-economiques');

    expect(body).toContain('plafonnée à 2x');
    expect(body).toContain('à 70 millions, le paiement reste plafonné à 20 millions');
    expect(body).toContain('à 100 millions, la conversion donnerait 25 millions');
    expect(body).toContain('l’écart avec une préférence participante non plafonnée reste de 7,5 millions');
  });

  it('relie les sept leçons à un dossier longitudinal, à un livrable et à une correction révélable', () => {
    const expectedComponents = [
      'market-sizing',
      'unit-economics',
      'cash-flow',
      'pre-post-ownership',
      'cap-table',
      'economic-rights',
      'returns',
    ];

    const course = courseById('c-mathematiques-vc');
    expect(course?.title).toBe('Mathématiques du capital-risque');
    expect(course?.summary).toContain('conventions');

    const vcLessons = lessonsForCourse('c-mathematiques-vc');
    expect(vcLessons.map((lesson) => lesson.id)).toEqual([
      'lmv-market-sizing',
      'lmv-unit-economics',
      'lmv-cash-flow-scenarios',
      'lmv-pre-post-ownership',
      'lmv-dilution-cap-table',
      'lmv-valuation-economic-rights',
      'lmv-returns-waterfall',
    ]);
    expect(vcLessons.map((lesson) => lesson.practice?.sectionId)).toEqual(expectedComponents);
    expect(vcLessons.every((lesson) => lesson.practice?.deliverableId === 'math-vc-dossier')).toBe(true);
    expect(vcLessons.map((lesson) => lesson.practice?.estimatedMinutes)).toEqual([45, 45, 60, 45, 75, 60, 75]);
    expect(vcLessons.map((lesson) => lesson.prerequisiteLessonIds ?? [])).toEqual([
      ['l-pipeline-crm'],
      [],
      [],
      [],
      ['lmv-pre-post-ownership'],
      ['lmv-pre-post-ownership'],
      ['lmv-valuation-economic-rights'],
    ]);

    const dossier = caseStudies.find((item) => item.id === 'cs-mathematiques-vc-dossier');
    expect(dossier?.learningRole).toBe('learner-dossier');
    expect(new Set(dossier?.documents?.map((document) => document.kind))).toEqual(new Set([
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
    ]));
    const dossierText = dossier?.sections.map((section) => `${section.heading}\n${section.body}`).join('\n') ?? '';
    expect(dossierText).toContain('cas fictif méthodologique');
    expect(dossierText).toContain('N’inscrivez aucune donnée confidentielle');
    expect(dossierText).not.toContain('corrigé');

    const correction = caseCorrections.find((item) => item.id === 'corr-mathematiques-vc-dossier');
    expect(correction).toMatchObject({
      sourceCaseId: 'cs-mathematiques-vc-dossier',
      revealAfterDeliverableId: 'math-vc-dossier',
    });

    const deliverable = deliverables.find((item) => item.id === 'math-vc-dossier');
    expect(deliverable).toMatchObject({
      slug: 'dossier-mathematiques-du-capital-risque',
      activityKind: 'cumulative-exercise',
      estimatedWorkMinutes: 450,
      caseStudyId: 'cs-mathematiques-vc-dossier',
      correctionId: 'corr-mathematiques-vc-dossier',
    });
    expect(deliverable?.relatedCourseIds).toContain('c-mathematiques-vc');
    expect(deliverable?.components?.map((component) => component.id)).toEqual(expectedComponents);
    expect(deliverable?.resources?.some((resource) => resource.href === '/downloads/mathematiques-vc/dossier-depart.xlsx')).toBe(true);

    const workbookPath = new URL('../../public/downloads/mathematiques-vc/dossier-depart.xlsx', import.meta.url);
    expect(existsSync(workbookPath)).toBe(true);
  });
});
