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

const COURSE_ID = 'c-dt-preuve-scientifique';
const LESSON_IDS = ['ldt-reproductibilite', 'ldt-pilote-preuve'] as const;
const EXPECTED_GLOSSARY_SLUGS = [
  'repetabilite-mesure',
  'reproductibilite-mesure',
  'replicabilite-scientifique',
  'incertitude-mesure',
  'pilote-industriel',
  'changement-echelle-industriel',
] as const;
const REPRO_SOURCE_URLS = [
  'https://doi.org/10.59161/JCGM200-2012',
  'https://doi.org/10.59161/JCGM100-2008F',
  'https://www.nationalacademies.org/read/25303/chapter/3',
] as const;
const PILOT_SOURCE_URLS = [
  'https://ec.europa.eu/research/participants/data/ref/h2020/other/wp/2018-2020/annexes/h2020-wp1820-annex-g-trl_en.pdf',
  'https://www.rand.org/pubs/reports/R2569.html',
] as const;
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

describe('Deeptech evidence learning course', () => {
  it('publishes a two-lesson course with derived duration and no certification or case dependency', () => {
    const course = courseById(COURSE_ID);
    const repro = lessonById('ldt-reproductibilite');
    const pilot = lessonById('ldt-pilote-preuve');

    expect(course).toMatchObject({
      id: COURSE_ID,
      slug: 'preuve-scientifique-deeptech',
      level: 'avance',
      durationSource: 'lesson-read-minutes',
      lessonIds: [...LESSON_IDS],
    });
    expect(course?.durationMin).toBe((repro?.readMin ?? 0) + (pilot?.readMin ?? 0));

    expect(repro).toMatchObject({
      courseId: COURSE_ID,
      order: 1,
      status: 'published',
      level: 'avance',
      optional: false,
      prerequisiteLessonIds: ['l-specialty-deeptech-trl-ip'],
    });
    expect(pilot).toMatchObject({
      courseId: COURSE_ID,
      order: 2,
      status: 'published',
      level: 'avance',
      optional: false,
      prerequisiteLessonIds: ['ldt-reproductibilite'],
    });

    for (const lesson of [repro, pilot]) {
      expect(lesson?.practice).toBeUndefined();
      expect(lesson?.assessmentId).toBeUndefined();
      expect(JSON.stringify(lesson)).not.toContain('cs-dt-');
      expect(lesson?.body).toContain('## Références');
      // `LessonPage` rend déjà `keyTakeaways` sous le titre « À retenir » :
      // une section homonyme dans le corps duplique le bloc à l'écran.
      expect(lesson?.body).not.toContain('## À retenir');
      expect(lesson?.body.toLowerCase()).toContain('expertise');
      expect(lesson?.body.toLowerCase()).toContain('ne statue pas');
      expect(lesson?.readMin).toBe(readMinForBody(lesson?.body ?? ''));
    }

    for (const url of REPRO_SOURCE_URLS) expect(repro?.body).toContain(url);
    for (const url of PILOT_SOURCE_URLS) expect(pilot?.body).toContain(url);
    expect(repro?.body).toMatch(/JCGM[\s\S]+NASEM|NASEM[\s\S]+JCGM/);
    expect(pilot?.body.toLowerCase()).toContain('44 installations');
  });

  it('keeps glossary source-backed in both registries without ambiguous pilot aliases', () => {
    const proofOfConcept = glossaryBySlug('proof-of-concept');
    const canonicalProofOfConcept = canonicalBySlug('proof-of-concept');

    expect(proofOfConcept?.aliases ?? []).not.toContain('pilote');
    expect(canonicalProofOfConcept?.aliases ?? []).not.toContain('pilote');
    expect(glossaryBySlug('scalability')?.relatedLessonIds ?? []).not.toContain('ldt-pilote-preuve');

    for (const slug of EXPECTED_GLOSSARY_SLUGS) {
      const publicEntry = glossaryBySlug(slug);
      const canonicalEntry = canonicalBySlug(slug);

      expect(publicEntry).toBeTruthy();
      expect(canonicalEntry).toMatchObject({
        slug,
        status: 'applied',
        action: 'add',
        sourceStatus: 'source-backed',
      });
      expect(canonicalEntry?.sourcePaths.length).toBeGreaterThan(0);
      expect(canonicalEntry?.modules).toContain('Deeptech — preuve scientifique');
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
      expect(publicEntry?.relatedLessonIds.some((id) => LESSON_IDS.includes(id as typeof LESSON_IDS[number]))).toBe(true);
    }
  });
});
