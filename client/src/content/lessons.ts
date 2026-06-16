import lessonsIndexJson from '@data/generated/lessons.index.json';
import type { Lesson, LessonBody, LessonIndexEntry } from './types';
import { coursesForPath } from './courses';

/**
 * Light lesson index — every field except the heavy reader payload
 * (`body`/`keyTakeaways`/`quiz`/`furtherReading`). Safe to import on the hot
 * path (parcours composition, atlas, related-lesson links, search). The full
 * payload lives in a separate chunk loaded on demand via {@link loadLesson}.
 *
 * Covers both the library lessons (l-*) and the Parcours-authored registers
 * (ld-*, lea-*): `scripts/split-lessons.mjs` folds data/lessons.json and
 * data/parcours/*.lessons.json into the same index + bodies outputs.
 */
export const LESSONS = lessonsIndexJson as unknown as LessonIndexEntry[];

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);

export const lessonsForCourse = (courseId: string) =>
  LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
export const lessonsForPath = (pathId: string) =>
  coursesForPath(pathId).flatMap((c) => lessonsForCourse(c.id));

let bodiesPromise: Promise<Record<string, LessonBody>> | null = null;

/** Lazily load the heavy reader payloads (own chunk). Cached after the first call. */
export function loadLessonBodies(): Promise<Record<string, LessonBody>> {
  if (!bodiesPromise) {
    bodiesPromise = import('@data/generated/lessons.bodies.json').then(
      (m) => ((m as { default?: unknown }).default ?? m) as Record<string, LessonBody>,
    );
  }
  return bodiesPromise;
}

/** A full lesson (index entry + reader payload), resolved lazily. `undefined`
 *  for an unknown slug. */
export async function loadLesson(slug: string): Promise<Lesson | undefined> {
  const entry = lessonBySlug(slug);
  if (!entry) return undefined;
  const payload = (await loadLessonBodies())[slug];
  return {
    ...entry,
    body: payload?.body ?? '',
    bodyShort: payload?.bodyShort,
    keyTakeaways: payload?.keyTakeaways ?? [],
    quiz: payload?.quiz,
    furtherReading: payload?.furtherReading,
  };
}
