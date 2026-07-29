import { describe, expect, it } from 'vitest';

import { caseById } from './caseStudies';
import { courseById } from './courses';
import { deliverableById, selectDeliverableComponents, selectDeliverableCriteria } from './deliverables';
import { parcoursTimeSummary } from './learningTime';
import { loadLesson, publicLessonById } from './lessons';
import { parcoursBySlug, resolveStep, visibleSteps } from './parcours';
import { SIMULATORS } from './simulators';

const SERIE_A_CORE_LESSON_IDS = [
  'lsa-decision-lever',
  'lsa-registre-preuves',
  'lsa-plan-financement',
  'lsa-process-dataroom',
  'lsa-modeliser-transaction',
  'lsa-termes-gouvernance',
  'lsa-negociation-dossier',
  'lsa-closing-board',
] as const;

const SERIE_A_BONUS_LESSON_IDS = [
  'lsa-branche-sectorielle',
  'lsa-tour-complexe',
] as const;

/** Ordered `ref.id` of every step, including the case and the two simulators. */
const SERIE_A_STEP_IDS = [
  'lsa-decision-lever',
  'lsa-registre-preuves',
  'lsa-plan-financement',
  'lsa-process-dataroom',
  'cs-serie-a-alto-sas',
  'lsa-modeliser-transaction',
  'dilution',
  'waterfall',
  'lsa-termes-gouvernance',
  'lsa-negociation-dossier',
  'lsa-closing-board',
  'lsa-branche-sectorielle',
  'lsa-tour-complexe',
  'todo-attentes-serie-a',
] as const;

const SERIE_A_COMPONENT_IDS = [
  'decision',
  'preuves',
  'financement',
  'process',
  'transaction',
  'clauses',
  'negociation',
  'closing',
  'branche-sectorielle',
  'tour-complexe',
] as const;

const SERIE_A_CORE_CRITERION_IDS = [
  'decision-financement',
  'tracabilite-preuves',
  'coherence-financiere',
  'maitrise-process-dataroom',
  'integrite-cap-table',
  'lecture-termes',
  'qualite-negociation',
  'revision',
] as const;

const SERIE_A_ADVANCED_CRITERION_IDS = [
  'pertinence-adaptation-sectorielle',
  'decomposition-tour-complexe',
] as const;

const SERIE_A_READ_WORD_RE = /\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*/gu;

function readMinForBody(body: string): number {
  return Math.ceil((body.match(SERIE_A_READ_WORD_RE)?.length ?? 0) / 180);
}

const serieA = parcoursBySlug('preparer-ma-serie-a');

if (!serieA) {
  throw new Error('Le parcours Préparer ma Série A doit être publié.');
}

describe('Parcours Préparer ma Série A', () => {
  it('publie une trajectoire avancée sans seuil universel ni étape à produire', () => {
    expect(serieA).toMatchObject({
      id: 'p-serie-a',
      family: 'levee',
      roadmap: 'next',
      perspective: 'both',
      level: 'avance',
      entryLevel: 'avance',
      time: { source: 'derived', sessions: 8 },
      milestone: {
        type: 'dossier',
        label: 'Dossier Série A + négociation simulée',
        evaluation: ['auto', 'peer', 'practitioner'],
        rubricId: 'todo-attentes-serie-a',
      },
    });
    expect(serieA.hook).not.toMatch(/ARR|2,5|ancienne Série A|sans trembler/iu);
    expect(serieA.goal).toMatch(/dossier de préparation à la Série A/iu);
    expect(serieA.prerequisites?.join('\n')).not.toMatch(/aucun pré-?requis/iu);
    expect(serieA.prerequisites?.join('\n')).toMatch(/pre-money|fully diluted|term sheet/iu);

    expect(serieA.steps.map((step) => step.ref.id)).toEqual([...SERIE_A_STEP_IDS]);
    expect(serieA.steps.map((step) => step.order)).toEqual(SERIE_A_STEP_IDS.map((_, index) => index + 1));
    expect(serieA.steps.every((step) => step.status === 'existant')).toBe(true);
    expect(serieA.steps.filter((step) => step.type === 'coeur').map((step) => step.ref.id)).toEqual(SERIE_A_CORE_LESSON_IDS);
    expect(serieA.steps.filter((step) => step.type === 'bonus').map((step) => step.ref.id)).toEqual(SERIE_A_BONUS_LESSON_IDS);

    for (const step of serieA.steps) {
      expect(resolveStep(step), `${step.ref.kind}:${step.ref.id}`).toMatchObject({ exists: true });
    }
  });

  it('alterne lecture, cas et simulateurs plutôt que huit lectures consécutives', () => {
    // Le cas fournit les chiffres avant la modélisation ; les deux simulateurs
    // la rejouent juste après. Aucun des trois n'ajoute de minutes dérivées :
    // un simulateur ne porte pas de durée et un cas n'en apporte qu'en `bonus`.
    const caseStep = serieA.steps.find((step) => step.ref.kind === 'case');
    expect(caseStep).toMatchObject({ type: 'pratique', ref: { id: 'cs-serie-a-alto-sas' } });

    const simulatorSteps = serieA.steps.filter((step) => step.ref.kind === 'simulator');
    expect(simulatorSteps.map((step) => step.ref.id)).toEqual(['dilution', 'waterfall']);
    expect(simulatorSteps.every((step) => step.type === 'pratique')).toBe(true);

    const orderOf = (refId: string) => serieA.steps.find((step) => step.ref.id === refId)?.order ?? -1;
    expect(orderOf('cs-serie-a-alto-sas')).toBeLessThan(orderOf('lsa-modeliser-transaction'));
    expect(orderOf('lsa-modeliser-transaction')).toBeLessThan(orderOf('dilution'));
    expect(orderOf('waterfall')).toBeLessThan(orderOf('lsa-termes-gouvernance'));

    // La respiration et les simulateurs ne doivent pas ouvrir de trou dans la
    // séquence cœur : le jalon reste la dernière étape du parcours.
    expect(serieA.steps.at(-1)?.ref.id).toBe('todo-attentes-serie-a');
  });

  it('relie les simulateurs de transaction à la leçon de modélisation publiée', () => {
    for (const simulatorId of ['dilution', 'waterfall']) {
      const simulator = SIMULATORS.find((candidate) => candidate.id === simulatorId);
      expect(simulator, simulatorId).toBeDefined();
      expect(simulator?.relatedLessonIds).toContain('lsa-modeliser-transaction');
      expect(new Set(simulator?.relatedLessonIds).size).toBe(simulator?.relatedLessonIds.length);

      for (const lessonId of simulator?.relatedLessonIds ?? []) {
        expect(publicLessonById(lessonId), `${simulatorId}:${lessonId}`).toBeDefined();
      }
    }

    expect(SIMULATORS.find((candidate) => candidate.id === 'dilution')?.relatedLessonIds).not.toContain('lsa-tour-complexe');
    expect(SIMULATORS.find((candidate) => candidate.id === 'waterfall')?.relatedLessonIds).not.toContain('lsa-tour-complexe');
  });

  it('rattache un cours dédié et dix leçons courtes au livrable longitudinal', async () => {
    const course = courseById('c-serie-a-preparation');
    expect(course).toMatchObject({
      slug: 'preparer-une-serie-a',
      level: 'avance',
      durationMin: 22,
      durationSource: 'lesson-read-minutes',
    });
    expect(course?.lessonIds).toEqual([
      ...SERIE_A_CORE_LESSON_IDS,
      ...SERIE_A_BONUS_LESSON_IDS,
    ]);

    for (const [index, lessonId] of [...SERIE_A_CORE_LESSON_IDS, ...SERIE_A_BONUS_LESSON_IDS].entries()) {
      const lesson = publicLessonById(lessonId);
      expect(lesson, lessonId).toBeDefined();
      const fullLesson = lesson ? await loadLesson(lesson.slug) : undefined;
      expect(lesson).toMatchObject({
        courseId: 'c-serie-a-preparation',
        order: index + 1,
        readMin: readMinForBody(fullLesson?.body ?? ''),
        status: 'published',
        practice: {
          deliverableId: 'todo-attentes-serie-a',
          sectionId: SERIE_A_COMPONENT_IDS[index],
        },
      });
      if (lessonId === 'lsa-closing-board') {
        expect(lesson?.practice?.estimatedMinutes).toBe(52);
      }
      if (SERIE_A_BONUS_LESSON_IDS.includes(lessonId as typeof SERIE_A_BONUS_LESSON_IDS[number])) {
        expect(lesson?.optional, lessonId).toBe(true);
      }
    }
  });

  it('rend le mode standard exécutable et réserve les deux approfondissements au mode complet', () => {
    const mediumIds = visibleSteps(serieA, 'medium').map((step) => step.ref.id);
    const highIds = visibleSteps(serieA, 'high').map((step) => step.ref.id);

    expect(mediumIds).toEqual(SERIE_A_STEP_IDS.filter((id) => !SERIE_A_BONUS_LESSON_IDS.includes(
      id as typeof SERIE_A_BONUS_LESSON_IDS[number],
    )));
    expect(highIds).toEqual([...SERIE_A_STEP_IDS]);
    expect(mediumIds).toContain('cs-serie-a-alto-sas');
    expect(mediumIds).toEqual(expect.arrayContaining(['dilution', 'waterfall', 'todo-attentes-serie-a']));
  });

  it('calcule 652 minutes requises et 760 minutes complètes depuis toutes les activités', () => {
    expect(parcoursTimeSummary(serieA)).toEqual({
      readingMinutes: 18,
      guidedPracticeMinutes: 436,
      consolidationMinutes: 102,
      finalMinutes: 96,
      optionalMinutes: 108,
      requiredMinutes: 652,
      completeMinutes: 760,
    });
  });

  it('expose un livrable exportable, sourcé et explicitement non confidentiel', () => {
    const deliverable = deliverableById('todo-attentes-serie-a');
    expect(deliverable).toMatchObject({
      slug: 'dossier-preparation-serie-a',
      activityKind: 'capstone',
      caseStudyId: 'cs-serie-a-alto-sas',
      evaluation: ['auto', 'peer', 'practitioner'],
      estimatedWorkMinutes: 90,
      externalReviewMinutes: 45,
      model: { kind: 'case', id: 'cs-serie-a-alto-sas' },
    });
    expect(deliverable?.journal).toBeUndefined();
    expect(deliverable?.brief).toMatch(/aucune donnée confidentielle/iu);
    expect(deliverable?.brief).toMatch(/validation juridique/iu);
    expect(deliverable?.components?.map((component) => component.id)).toEqual(SERIE_A_COMPONENT_IDS);
    expect(deliverable?.components?.filter((component) => component.requiredInBudgets?.includes('medium')).map(
      (component) => component.id,
    )).toEqual(SERIE_A_COMPONENT_IDS.slice(0, 8));
    expect(deliverable?.components?.filter((component) => component.requiredInBudgets?.includes('high')).map(
      (component) => component.id,
    )).toEqual(SERIE_A_COMPONENT_IDS);
    expect(deliverable?.rubric.map((criterion) => criterion.id)).toEqual([
      ...SERIE_A_CORE_CRITERION_IDS,
      ...SERIE_A_ADVANCED_CRITERION_IDS,
    ]);
    expect(Object.fromEntries(deliverable?.rubric.map((criterion) => [criterion.id, criterion.componentIds]) ?? [])).toEqual({
      'decision-financement': ['decision'],
      'tracabilite-preuves': ['preuves'],
      'coherence-financiere': ['financement'],
      'maitrise-process-dataroom': ['process'],
      'integrite-cap-table': ['transaction'],
      'lecture-termes': ['clauses'],
      'qualite-negociation': ['negociation'],
      revision: ['closing'],
      'pertinence-adaptation-sectorielle': ['branche-sectorielle'],
      'decomposition-tour-complexe': ['tour-complexe'],
    });
    expect(deliverable?.template.map((section) => section.heading)).toEqual([
      'Décision de lever',
      'Registre des preuves',
      'Plan de financement',
      'Processus et data room',
      'Modélisation de la transaction',
      'Matrice des clauses',
      'Brief de négociation',
      'Closing et premier board',
      'Adaptation sectorielle',
      'Tour complexe',
    ]);
    expect(deliverable?.rubricLevels?.map((level) => level.id)).toEqual([
      'insuffisant',
      'acceptable',
      'solide',
      'non-observable',
    ]);
    expect(deliverable?.resources?.map((resource) => resource.href)).toEqual(expect.arrayContaining([
      'https://www.thegalionproject.com/outils/galion-term-sheet',
      'https://www.thegalionproject.com/outils/galion-fundraiser-guidelines',
      'https://www.thegalionproject.com/outils/guide-du-board',
      'https://www.franceinvest.eu/wp-content/uploads/2021/12/France-Invest-Guide-du-capital-innovation-2019.pdf',
      'https://www.ukprivatecapital.co.uk/policy/industry-guidance-standardised-documents/model-documents-for-early-stage-investments.html',
      'https://nvca.org/model-legal-documents/',
    ]));
    expect(deliverable?.resources?.find((resource) => resource.href.includes('ukprivatecapital'))?.label).toMatch(/Royaume-Uni|comparatif/i);
    expect(deliverable?.resources?.find((resource) => resource.href.includes('nvca'))?.label).toMatch(/États-Unis|comparatif/i);
  });

  it('sélectionne les composants et critères du livrable selon le budget contextualisé', () => {
    const deliverable = deliverableById('todo-attentes-serie-a');
    expect(deliverable).toBeDefined();
    if (!deliverable) return;

    expect(selectDeliverableComponents(deliverable, 'medium').map((component) => component.id)).toEqual(SERIE_A_COMPONENT_IDS.slice(0, 8));
    expect(selectDeliverableCriteria(deliverable, 'medium').map((criterion) => criterion.id)).toEqual(SERIE_A_CORE_CRITERION_IDS);
    expect(selectDeliverableComponents(deliverable, 'high').map((component) => component.id)).toEqual(SERIE_A_COMPONENT_IDS);
    expect(selectDeliverableCriteria(deliverable, 'high').map((criterion) => criterion.id)).toEqual([
      ...SERIE_A_CORE_CRITERION_IDS,
      ...SERIE_A_ADVANCED_CRITERION_IDS,
    ]);
    expect(selectDeliverableComponents(deliverable).map((component) => component.id)).toEqual(SERIE_A_COMPONENT_IDS);
  });

  it('fournit un cas apprenant et corrige la dilution composée existante', () => {
    const caseStudy = caseById('cs-serie-a-alto-sas');
    expect(caseStudy).toMatchObject({
      learningRole: 'learner-dossier',
      company: 'AltoSuite SAS · cas fictif',
      estimatedWorkMinutes: 60,
    });
    expect(caseStudy?.documents?.map((document) => document.id)).toEqual([
      'contexte',
      'metriques',
      'tresorerie',
      'cap-table',
      'offres',
      'dataroom',
    ]);

    const dilutionCase = caseById('cs-dilution-journey');
    const dilutionText = JSON.stringify(dilutionCase);
    expect(dilutionText).toContain('45,08 %');
    expect(dilutionText).not.toMatch(/~28 %|28 %/u);
  });

  it('garde les leçons dans un registre sobre, qualifié et sourcé', async () => {
    const forbidden = /playbook|garanti|parfait|sans trembler|standard de place|le standard français impose|ancienne Série A|échoue souvent|rarement|n[’']est pas ouverte en bloc|seul son conseil|validation board/iu;

    for (const lessonId of [...SERIE_A_CORE_LESSON_IDS, ...SERIE_A_BONUS_LESSON_IDS]) {
      const lessonIndex = publicLessonById(lessonId);
      expect(lessonIndex, lessonId).toBeDefined();
      if (!lessonIndex) continue;

      const lesson = await loadLesson(lessonIndex.slug);
      expect(lesson?.body, lessonId).toContain('## Production attendue');
      expect(lesson?.body, lessonId).toContain('## Références');
      const editorialSurface = JSON.stringify({
        body: lesson?.body,
        quiz: lesson?.quiz?.map((question) => ({ question: question.question, explanation: question.explanation })),
      });
      expect(editorialSurface, lessonId).not.toMatch(forbidden);
      if (lessonId === 'lsa-decision-lever') {
        expect(lesson?.quiz?.[0]?.question).toMatch(/premier livrable de ce parcours/iu);
        expect(lesson?.quiz?.[0]?.explanation).toMatch(/méthode locale|parcours/iu);
      }
      if (lessonId === 'lsa-process-dataroom') {
        expect(lesson?.quiz?.[1]?.explanation).not.toMatch(/impossible à suivre/iu);
        expect(lesson?.quiz?.[1]?.explanation).toMatch(/plus difficile/iu);
      }
      if (lessonId === 'lsa-termes-gouvernance') {
        expect(lesson?.body, lessonId).toMatch(/Royaume-Uni.*comparatif|comparatif.*Royaume-Uni/isu);
        expect(lesson?.body, lessonId).not.toMatch(/Légifrance — Code de commerce, version consultée/iu);
      }
      if (lessonId === 'lsa-tour-complexe') {
        expect(lesson?.body, lessonId).toMatch(/britannique.*américain|américain.*britannique/isu);
      }
      expect(lesson?.keyTakeaways.length, lessonId).toBeGreaterThanOrEqual(3);
      expect(lesson?.quiz, lessonId).toHaveLength(3);
      const referenceLines = lesson?.body.split('\n').filter((line) => line.startsWith('- [')) ?? [];
      expect(referenceLines.length, `${lessonId}: sources`).toBeGreaterThanOrEqual(2);
      expect(referenceLines.every((line) => /\((https:\/\/[^)]+)\)/u.test(line)), `${lessonId}: sources HTTPS`).toBe(true);
    }
  });

  it('propose des quiz qui expliquent la réponse et des distracteurs plausibles', async () => {
    const normalize = (value: string) => value.replace(/\s+/gu, ' ').replace(/[.\s]+$/u, '').toLowerCase();

    for (const lessonId of [...SERIE_A_CORE_LESSON_IDS, ...SERIE_A_BONUS_LESSON_IDS]) {
      const lessonIndex = publicLessonById(lessonId);
      if (!lessonIndex) continue;
      const lesson = await loadLesson(lessonIndex.slug);

      for (const [index, question] of (lesson?.quiz ?? []).entries()) {
        const where = `${lessonId}.quiz[${index}]`;
        const correct = question.options.filter((option) => option.correct);
        expect(correct, where).toHaveLength(1);

        // Une explication ne doit pas se contenter de recopier la bonne réponse :
        // c'est le défaut que ce parcours a corrigé.
        expect(normalize(question.explanation), where).not.toBe(normalize(correct[0].text));
        expect(question.explanation.length, where).toBeGreaterThan(correct[0].text.length);

        // Les distracteurs doivent rester des erreurs de raisonnement crédibles,
        // pas des options hors sujet qui rendent le quiz non discriminant.
        for (const option of question.options.filter((candidate) => !candidate.correct)) {
          expect(option.text.split(/\s+/u).length, `${where}: « ${option.text} »`).toBeGreaterThanOrEqual(5);
        }
      }
    }
  });
});
