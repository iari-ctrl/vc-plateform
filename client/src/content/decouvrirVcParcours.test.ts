import { describe, expect, it } from 'vitest';

import coursesJson from '@data/courses.json';
import decouvrirLessonsRegister from '@data/parcours/01-le-vc-sans-bullshit.lessons.json';
import semaineLessonsRegister from '@data/parcours/02-une-semaine-vc.lessons.json';
import { courseById } from './courses';
import { glossaryBySlug, loadGlossaryDefs } from './glossary';
import { parcoursTimeSummary } from './learningTime';
import { loadLesson, publicLessonById, publishedLessonsForCourse } from './lessons';
import { parcoursBySlug, resolveStep, visibleSteps } from './parcours';

const DEC_OPENING_IDS = [
  'ld-what-is-vc',
  'ld-power-law',
  'ld-money-flow',
  'ld-stages',
  'ld-vc-job',
  'ld-roles',
  'ld-fund-lifecycle',
] as const;

const DEC_OPENING_SLUGS = [
  'c-est-quoi-le-vc-vraiment',
  '9-sur-10-vont-mourir',
  'le-voyage-de-l-argent',
  'la-grammaire-des-stades-decouverte',
  'le-vrai-job-et-les-mythes',
  'qui-fait-quoi-qui-gagne-quoi',
  'un-fonds-nait-et-meurt-aussi',
] as const;

const DEC_STEP_IDS = [
  ...DEC_OPENING_IDS,
  'cs-europe-vs-valley',
  'ld-decouvrir-vc-quiz',
] as const;

const INLINE_SOURCE_CONTRACT = {
  'ld-what-is-vc': {
    refs: [
      'https://www.franceinvest.eu/wp-content/uploads/2022/02/France-Invest-Guide-du-capital-innovation-2019-1.pdf',
      'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02013R0345-20240109',
    ],
    attributions: [/guide France Invest/u, /règlement EuVECA/u],
  },
  'ld-power-law': {
    refs: ['https://www.nber.org/papers/w8066', 'https://www.nber.org/papers/w27690'],
    attributions: [/Cochrane.*NBER w8066/u, /Ouyang.*NBER w27690/u, /pas une loi mathématique universelle/u],
  },
  'ld-money-flow': {
    refs: [
      'https://www.franceinvest.eu/wp-content/uploads/2022/02/France-Invest-Guide-du-capital-innovation-2019-1.pdf',
      'https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf',
    ],
    attributions: [/guide France Invest/u, /principes ILPA/u],
  },
  'ld-stages': {
    refs: [
      'https://www.franceinvest.eu/wp-content/uploads/2022/02/France-Invest-Guide-du-capital-innovation-2019-1.pdf',
      'https://www.nber.org/papers/w22587',
    ],
    attributions: [/« pre-seed » est une convention éditoriale/u, /enquête NBER w22587/u],
  },
  'ld-vc-job': {
    refs: [
      'https://www.nber.org/papers/w22587',
      'https://www.franceinvest.eu/wp-content/uploads/2022/02/France-Invest-Guide-du-capital-innovation-2019-1.pdf',
    ],
    attributions: [/enquête NBER w22587/u, /guide France Invest/u],
  },
  'ld-roles': {
    refs: [
      'https://www.nber.org/papers/w22587',
      'https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf',
    ],
    attributions: [/convention éditoriale/u, /NBER w22587/u, /principes ILPA/u],
  },
  'ld-fund-lifecycle': {
    refs: [
      'https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf',
      'https://www.amf-france.org/sites/institutionnel/files/private/2025-01/doc-2012-11_fr5_guide-relatif-aux-fonds-de-capital-investissement_fin-de-vie-des-fonds-ki.pdf',
    ],
    attributions: [/principes ILPA/u, /AMF DOC-2012-11/u],
  },
} as const;

const FORBIDDEN_TEXT_RE = /casino|roulette|\b(?:tu|ton|ta|tes)\b|vrais propriétaires|assurance-vie|~?\s*1\s*000|3\s*à\s*5|50\s*à\s*60|80\s*[-–]\s*100|45\s*[-–]\s*55|70\s*[-–]\s*100|60\s*[-–]\s*90|ticket|valo(?:risation)?\s*~?\s*\d|2,5\s*M|12\s*[-–]\s*15\s*M|voie royale|perle|stars|trophée|gros|pique|maligne/iu;
const WORD_RE = /\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*/gu;

type LessonRecord = (typeof decouvrirLessonsRegister.lessons)[number];

type QuizQuestion = NonNullable<LessonRecord['quiz']>[number];

function words(source: string): number {
  return source.match(WORD_RE)?.length ?? 0;
}

function allServedText(lesson: Awaited<ReturnType<typeof loadLesson>>): string {
  if (!lesson) return '';
  return [
    lesson.title,
    lesson.kicker,
    lesson.summary,
    lesson.body,
    lesson.bodyShort,
    ...(lesson.keyTakeaways ?? []),
    ...(lesson.quiz ?? []).flatMap((question) => [
      question.question,
      question.explanation,
      ...question.options.map((option) => option.text),
    ]),
  ].filter(Boolean).join('\n');
}

function expectThreeOptionQuestion(question: QuizQuestion, context: string) {
  expect(question.options, context).toHaveLength(3);
  expect(question.options.filter((option) => option.correct), context).toHaveLength(1);
  expect(question.explanation, context).toMatch(/\p{L}/u);
  expect(question.explanation, context).not.toMatch(FORBIDDEN_TEXT_RE);
}

describe('parcours Comprendre le capital-risque', () => {
  it('préserve les sept identités ld-* tout en ajoutant seulement le quiz final', () => {
    expect(decouvrirLessonsRegister.parcoursId).toBe('p-decouvrir-vc');
    expect(decouvrirLessonsRegister.courseId).toBe('c-decouvrir-vc');
    expect(decouvrirLessonsRegister.lessons.map((lesson) => lesson.id)).toEqual([
      ...DEC_OPENING_IDS,
      'ld-decouvrir-vc-quiz',
    ]);
    expect(decouvrirLessonsRegister.lessons.slice(0, 7).map((lesson) => lesson.slug)).toEqual([...DEC_OPENING_SLUGS]);
    expect(decouvrirLessonsRegister.lessons).toHaveLength(8);
    expect(new Set(decouvrirLessonsRegister.lessons.map((lesson) => lesson.courseId))).toEqual(new Set(['c-decouvrir-vc']));
  });

  it('garde le cours partagé réciproque, contigu et distinct de la respiration p-semaine-vc', () => {
    const course = courseById('c-decouvrir-vc');
    expect(course).toBeDefined();
    expect(course?.durationSource).toBe('lesson-read-minutes');
    expect(course?.subtitle).not.toMatch(/huit|neuf|\d+\s+leçons/iu);
    expect(course?.lessonIds).toEqual([
      ...DEC_OPENING_IDS,
      'lsv-vc-mise',
      'ld-decouvrir-vc-quiz',
    ]);
    expect(semaineLessonsRegister.lessons.map((lesson) => lesson.id)).toEqual(['lsv-vc-mise']);
    expect(semaineLessonsRegister.lessons[0]).toMatchObject({ courseId: 'c-decouvrir-vc', order: 8 });

    const courseLessons = publishedLessonsForCourse('c-decouvrir-vc');
    expect(courseLessons.map((lesson) => lesson.id)).toEqual(course?.lessonIds);
    expect(courseLessons.map((lesson) => lesson.order)).toEqual(courseLessons.map((_, index) => index + 1));
    expect(course?.durationMin).toBe(courseLessons.reduce((sum, lesson) => sum + lesson.readMin, 0));

    const allCourseIds = new Set((coursesJson as Array<{ id: string }>).map((course) => course.id));
    expect(allCourseIds.has('c-decouvrir-vc')).toBe(true);
  });

  it('résout neuf étapes p-decouvrir-vc dans le bon ordre sans modifier le cas Europe', () => {
    const parcours = parcoursBySlug('le-vc-sans-bullshit');
    expect(parcours).toBeDefined();
    if (!parcours) return;

    expect(parcours.time).toMatchObject({ source: 'derived', sessions: 9 });
    expect(parcours.steps.map((step) => step.order)).toEqual(DEC_STEP_IDS.map((_, index) => index + 1));
    expect(parcours.steps.map((step) => step.ref.id)).toEqual([...DEC_STEP_IDS]);
    expect(parcours.steps[7]).toMatchObject({ type: 'respiration', ref: { kind: 'case', id: 'cs-europe-vs-valley' }, status: 'existant' });
    expect(parcours.steps[8]).toMatchObject({ type: 'coeur', ref: { kind: 'milestone', id: 'ld-decouvrir-vc-quiz' }, status: 'existant' });
    expect(resolveStep(parcours.steps[8])).toMatchObject({ exists: true, href: '/lessons/quiz-comprendre-le-capital-risque', lessonId: 'ld-decouvrir-vc-quiz' });
    expect(visibleSteps(parcours, 'high').map((step) => step.ref.id)).toEqual([...DEC_STEP_IDS]);
    expect(parcoursTimeSummary(parcours).readingMinutes).toBeGreaterThanOrEqual(1);
  });

  it('remplace les formulations non sourcées et chaque leçon factuelle porte au moins deux sources HTTPS qualifiées', async () => {
    for (const lessonId of DEC_OPENING_IDS) {
      const lesson = publicLessonById(lessonId);
      expect(lesson, lessonId).toBeDefined();
      if (!lesson) continue;
      const fullLesson = await loadLesson(lesson.slug);
      expect(fullLesson?.readMin, lessonId).toBe(Math.ceil(words(fullLesson?.body ?? '') / 180));
      expect(allServedText(fullLesson), lessonId).not.toMatch(FORBIDDEN_TEXT_RE);
      const externalSources = (fullLesson?.furtherReading ?? []).filter((source) => source.kind === 'external');
      expect(externalSources, lessonId).toHaveLength(2);
      for (const source of externalSources) {
        expect(source.ref, `${lessonId}:${source.label}`).toMatch(/^https:\/\//u);
        expect(source.label, `${lessonId}:${source.ref}`).toMatch(/—/u);
        expect(source.label, `${lessonId}:${source.ref}`).not.toMatch(/source|article|rapport$/iu);
      }
      for (const question of fullLesson?.quiz ?? []) expectThreeOptionQuestion(question, lessonId);
    }
  });

  it('attribue dans la prose chaque proposition au régime documentaire retenu', async () => {
    for (const lessonId of DEC_OPENING_IDS) {
      const lesson = publicLessonById(lessonId);
      expect(lesson, lessonId).toBeDefined();
      if (!lesson) continue;

      const fullLesson = await loadLesson(lesson.slug);
      expect(fullLesson, lessonId).toBeDefined();
      if (!fullLesson) continue;

      const contract = INLINE_SOURCE_CONTRACT[lessonId];
      expect(
        (fullLesson.furtherReading ?? []).filter((source) => source.kind === 'external').map((source) => source.ref),
        lessonId,
      ).toEqual([...contract.refs]);
      for (const attribution of contract.attributions) {
        expect(fullLesson.body, `${lessonId}:${attribution.source}`).toMatch(attribution);
      }
      for (const source of fullLesson.furtherReading ?? []) {
        expect(source.label, `${lessonId}:${source.ref}`).toMatch(/—.*·.*·/u);
      }
    }
  });

  it('distingue la concentration des gains et les conditions de vérification d’une loi statistique', async () => {
    const entry = (await loadGlossaryDefs())['power-law'];
    expect(glossaryBySlug('power-law')?.short).toMatch(/raccourci sectoriel/iu);
    expect(entry?.definition).toMatch(/concentration des gains[^.]*quelques investissements/u);
    expect(entry?.definition).toMatch(/au sens statistique[^.]*exige[^.]*échantillon[^.]*période[^.]*méthode/u);
    expect(entry?.example).toMatch(/échantillon[^.]*ne se transpose pas en proportion universelle/u);
    expect(entry?.example).not.toMatch(/100x|fonds entier/iu);
  });

  it('publie un quiz final exécutable de huit questions cumulatives', async () => {
    const quiz = publicLessonById('ld-decouvrir-vc-quiz');
    expect(quiz).toMatchObject({
      slug: 'quiz-comprendre-le-capital-risque',
      courseId: 'c-decouvrir-vc',
      status: 'published',
    });
    if (!quiz) return;
    const fullQuiz = await loadLesson(quiz.slug);
    expect(fullQuiz?.quiz).toHaveLength(8);
    for (const attribution of [
      /guide France Invest/u,
      /NBER w22587/u,
      /NBER w8066/u,
      /NBER w27690/u,
      /principes ILPA/u,
      /AMF DOC-2012-11/u,
    ]) {
      expect(fullQuiz?.body, `quiz:${attribution.source}`).toMatch(attribution);
    }
    expect((fullQuiz?.furtherReading ?? []).map((source) => source.ref)).toEqual([
      'https://www.franceinvest.eu/wp-content/uploads/2022/02/France-Invest-Guide-du-capital-innovation-2019-1.pdf',
      'https://www.nber.org/papers/w22587',
      'https://www.nber.org/papers/w8066',
      'https://www.nber.org/papers/w27690',
      'https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf',
      'https://www.amf-france.org/sites/institutionnel/files/private/2025-01/doc-2012-11_fr5_guide-relatif-aux-fonds-de-capital-investissement_fin-de-vie-des-fonds-ki.pdf',
    ]);
    for (const source of fullQuiz?.furtherReading ?? []) {
      expect(source.label, `quiz:${source.ref}`).toMatch(/—.*·.*·/u);
    }
    for (const question of fullQuiz?.quiz ?? []) expectThreeOptionQuestion(question, 'quiz final');
    const quizText = allServedText(fullQuiz);
    for (const expected of ['LP', 'gestionnaire', 'fonds', 'société', 'concentration des rendements', 'stades', 'comité']) {
      expect(quizText).toMatch(new RegExp(expected, 'iu'));
    }
    expect(quizText).not.toMatch(/loi de puissance/iu);
  });
});
