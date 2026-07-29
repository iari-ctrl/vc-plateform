import { describe, expect, it } from 'vitest';
import canonicalGlossaryJson from '@data/sources/canonical-glossary.json';
import coursesJson from '@data/courses.json';
import glossaryJson from '@data/glossary.json';
import lessonsJson from '@data/lessons.json';

import type { Course, GlossaryTerm, Lesson } from './types';

interface CanonicalGlossaryEntry {
  canonicalTerm: string;
  slug: string;
  aliases?: string[];
  status: string;
  action: string;
  modules: string[];
  sourcePaths: string[];
  sourceStatus: string;
  category: string;
  short: string;
  definition: string;
  example?: string;
  seeAlso: string[];
  relatedLessonIds: string[];
}

const courses = coursesJson as Course[];
const lessons = lessonsJson as Lesson[];
const glossary = glossaryJson as GlossaryTerm[];
const canonicalGlossary = canonicalGlossaryJson as CanonicalGlossaryEntry[];

const COURSE_ID = 'c-dt-pi-transfert';
const COURSE_SLUG = 'propriete-intellectuelle-transfert-deeptech';

const LESSON_IDS = [
  'ldt-titularite-copropriete',
  'ldt-brevet-secret',
  'ldt-licence-redevances',
  'ldt-transfert-recherche-publique',
] as const;

type LessonId = (typeof LESSON_IDS)[number];

/**
 * `l-specialty-deeptech-trl-ip` pose que « la titularité s'établit avant la
 * protection ». Le cours enchaîne donc titularité, arbitrage brevet/secret,
 * licence, puis transfert public : enseigner l'arbitrage avant la titularité
 * contredirait une leçon publiée.
 */
const PREREQUISITE_CHAIN: Record<LessonId, readonly string[]> = {
  'ldt-titularite-copropriete': ['l-specialty-deeptech-trl-ip'],
  'ldt-brevet-secret': ['ldt-titularite-copropriete'],
  'ldt-licence-redevances': ['ldt-brevet-secret'],
  'ldt-transfert-recherche-publique': ['ldt-licence-redevances'],
};

const EXPECTED_GLOSSARY_SLUGS = [
  'titularite-des-droits',
  'invention-de-mission',
  'copropriete-de-brevet',
  'secret-des-affaires',
  'licence-d-exploitation',
  'inscription-au-registre-national-des-brevets',
  'invention-d-agent-public',
  'concours-scientifique',
] as const;

const GLOSSARY_MODULE = 'Deeptech — propriété intellectuelle et transfert';
const GLOSSARY_CATEGORY = 'Juridique & Fiscalité';

const LEGIFRANCE = 'https://www.legifrance.gouv.fr/codes/article_lc';

/**
 * URL porteuses de la matrice de preuves
 * `.hermes/plans/2026-07-27_142409-deeptech-pi-transfert-evidence.md`.
 * Un corps peut en citer davantage ; il ne peut pas en citer moins.
 */
const SOURCE_URLS: Record<LessonId, readonly string[]> = {
  'ldt-titularite-copropriete': [
    `${LEGIFRANCE}/LEGIARTI000006279399`, // L611-6
    `${LEGIFRANCE}/LEGIARTI000039279789`, // L611-7
    `${LEGIFRANCE}/LEGIARTI000044502268`, // L611-7-1
    `${LEGIFRANCE}/LEGIARTI000006280362`, // R611-6
    `${LEGIFRANCE}/LEGIARTI000039279761`, // L613-29
    `${LEGIFRANCE}/LEGIARTI000006279518`, // L613-32
  ],
  'ldt-brevet-secret': [
    `${LEGIFRANCE}/LEGIARTI000037266553`, // C. com. L151-1
    `${LEGIFRANCE}/LEGIARTI000037266559`, // C. com. L151-3
    `${LEGIFRANCE}/LEGIARTI000037266579`, // C. com. L152-1
    `${LEGIFRANCE}/LEGIARTI000006279429`, // L612-5
    `${LEGIFRANCE}/LEGIARTI000006279474`, // L613-7
    'https://www.inpi.fr/ressources/propriete-intellectuelle/secret',
  ],
  'ldt-licence-redevances': [
    `${LEGIFRANCE}/LEGIARTI000006279475`, // L613-8
    `${LEGIFRANCE}/LEGIARTI000019298708`, // L613-9
    `${LEGIFRANCE}/LEGIARTI000039279761`, // L613-29 d)
  ],
  'ldt-transfert-recherche-publique': [
    `${LEGIFRANCE}/LEGIARTI000019298700`, // L611-11
    `${LEGIFRANCE}/LEGIARTI000006280369`, // R611-12
    `${LEGIFRANCE}/LEGIARTI000048780879`, // R611-14-1
    `${LEGIFRANCE}/LEGIARTI000042813353`, // Code de la recherche L531-1
    `${LEGIFRANCE}/LEGIARTI000042340720`, // Code de la recherche L531-12
    `${LEGIFRANCE}/LEGIARTI000042813343`, // Code de la recherche L531-14
  ],
};

/**
 * Le lot précédent a livré l'alias nu `pilote` sur `proof-of-concept`, trop
 * polysémique. Le vocabulaire de propriété intellectuelle est entièrement
 * nouveau au glossaire : aucun de ces mots ne doit y entrer seul.
 */
const AMBIGUOUS_BARE_ALIASES = [
  'brevet',
  'invention',
  'licence',
  'redevance',
  'secret',
  'titularité',
  'transfert',
];

const READ_WORD_RE = /\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*/gu;

function readMinForBody(body: string): number {
  return Math.ceil((body.match(READ_WORD_RE)?.length ?? 0) / 180);
}

function courseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

function lessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

function glossaryBySlug(slug: string): GlossaryTerm | undefined {
  return glossary.find((term) => term.slug === slug);
}

function canonicalBySlug(slug: string): CanonicalGlossaryEntry | undefined {
  return canonicalGlossary.find((entry) => entry.slug === slug);
}

describe('Deeptech IP and transfer course', () => {
  it('publishes a four-lesson course with a derived duration and an ordered prerequisite chain', () => {
    const course = courseById(COURSE_ID);
    const courseLessons = LESSON_IDS.map((id) => lessonById(id));

    expect(course).toMatchObject({
      id: COURSE_ID,
      slug: COURSE_SLUG,
      level: 'avance',
      durationSource: 'lesson-read-minutes',
      lessonIds: [...LESSON_IDS],
    });
    expect(course?.durationMin).toBe(
      courseLessons.reduce((total, lesson) => total + (lesson?.readMin ?? 0), 0),
    );

    LESSON_IDS.forEach((id, index) => {
      const lesson = lessonById(id);

      expect(lesson, `leçon absente : ${id}`).toBeDefined();
      expect(lesson).toMatchObject({
        courseId: COURSE_ID,
        order: index + 1,
        status: 'published',
        level: 'avance',
        optional: false,
        prerequisiteLessonIds: [...PREREQUISITE_CHAIN[id]],
      });
      expect(lesson?.practice).toBeUndefined();
      expect(lesson?.assessmentId).toBeUndefined();
      expect(JSON.stringify(lesson)).not.toContain('cs-dt-');
    });
  });

  it('keeps every body sourced, bounded and free of the duplicated takeaway block', () => {
    for (const id of LESSON_IDS) {
      const lesson = lessonById(id);
      const body = lesson?.body;

      expect(body, `corps absent : ${id}`).toBeDefined();
      expect(body).toContain('## Références');

      // `LessonPage` rend déjà `keyTakeaways` sous le titre « À retenir » :
      // une section homonyme dans le corps duplique le bloc à l'écran.
      expect(body).not.toContain('## À retenir');

      // Frontière analyste / conseil, dans la formulation de
      // `l-specialty-deeptech-trl-ip`.
      expect(body?.toLowerCase()).toContain('ne statue pas');
      expect(body?.toLowerCase()).toContain('conseil en propriété industrielle');

      // Portée géographique déclarée : aucun régime n'est étendu hors de France.
      expect(body?.toLowerCase()).toContain('droit français');

      for (const url of SOURCE_URLS[id]) {
        expect(body, `${id} ne cite pas ${url}`).toContain(url);
      }

      expect(lesson?.readMin).toBe(readMinForBody(body ?? ''));
    }
  });

  it('creates the glossary lot in both registries without any ambiguous bare alias', () => {
    for (const slug of EXPECTED_GLOSSARY_SLUGS) {
      const publicEntry = glossaryBySlug(slug);
      const canonicalEntry = canonicalBySlug(slug);

      expect(publicEntry, `entrée publique absente : ${slug}`).toBeTruthy();
      expect(canonicalEntry).toMatchObject({
        slug,
        status: 'applied',
        action: 'add',
        sourceStatus: 'source-backed',
        category: GLOSSARY_CATEGORY,
      });
      expect(canonicalEntry?.sourcePaths.length).toBeGreaterThan(0);
      expect(canonicalEntry?.modules).toContain(GLOSSARY_MODULE);

      expect(publicEntry).toMatchObject({
        id: slug,
        slug,
        term: canonicalEntry?.canonicalTerm,
        category: canonicalEntry?.category,
        short: canonicalEntry?.short,
        definition: canonicalEntry?.definition,
        example: canonicalEntry?.example,
        seeAlso: canonicalEntry?.seeAlso,
        relatedLessonIds: canonicalEntry?.relatedLessonIds,
      });
      expect(
        publicEntry?.relatedLessonIds.some((id) => LESSON_IDS.includes(id as LessonId)),
        `${slug} ne pointe vers aucune leçon du cours`,
      ).toBe(true);

      // Chaque renvoi doit résoudre vers une entrée réellement publiée.
      for (const related of canonicalEntry?.seeAlso ?? []) {
        expect(glossaryBySlug(related), `${slug} renvoie vers ${related}, absent`).toBeTruthy();
      }
    }

    const bare = new Set(AMBIGUOUS_BARE_ALIASES);
    for (const term of glossary) {
      for (const alias of term.aliases ?? []) {
        expect(
          bare.has(alias.trim().toLowerCase()),
          `alias nu ambigu « ${alias} » sur ${term.slug}`,
        ).toBe(false);
      }
    }
    for (const entry of canonicalGlossary) {
      for (const alias of entry.aliases ?? []) {
        expect(
          bare.has(alias.trim().toLowerCase()),
          `alias nu ambigu « ${alias} » sur ${entry.slug} (registre canonique)`,
        ).toBe(false);
      }
    }
  });
});
