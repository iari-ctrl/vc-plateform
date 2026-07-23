import lessonsIndexJson from '@data/generated/lessons.index.json';
import lessonBodiesUrl from '@data/generated/lessons.bodies.json?url';
import type { Lesson, LessonBody, LessonIndexEntry, ProgressEntry } from './types';
import { createRecoverableLazyLoader, fetchJsonResource } from './lazyResource';

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

export const isPublishedLesson = (lesson: LessonIndexEntry | undefined): lesson is LessonIndexEntry =>
  lesson?.status === 'published';

export const PUBLIC_LESSONS = LESSONS.filter(isPublishedLesson);

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
export const publicLessonBySlug = (slug: string) => PUBLIC_LESSONS.find((l) => l.slug === slug);
export const publicLessonById = (id: string) => PUBLIC_LESSONS.find((l) => l.id === id);

export const lessonsForCourse = (courseId: string) =>
  LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);

export const publishedLessonsForCourse = (courseId: string) =>
  PUBLIC_LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);

export interface PublicProgressSummary {
  doneCount: number;
  readingCount: number;
  totalCount: number;
  percentage: number;
}

export function publicProgressSummary(progress: Record<string, ProgressEntry>): PublicProgressSummary {
  const publicIds = new Set(PUBLIC_LESSONS.map((lesson) => lesson.id));
  let doneCount = 0;
  let readingCount = 0;

  for (const [lessonId, entry] of Object.entries(progress)) {
    if (!publicIds.has(lessonId) || entry.lessonId !== lessonId) continue;
    if (entry.status === 'done') doneCount += 1;
    if (entry.status === 'reading') readingCount += 1;
  }

  return {
    doneCount,
    readingCount,
    totalCount: PUBLIC_LESSONS.length,
    percentage: PUBLIC_LESSONS.length ? Math.round((doneCount / PUBLIC_LESSONS.length) * 100) : 0,
  };
}

const loadBodiesFromModule = () =>
  import('@data/generated/lessons.bodies.json').then(
    (m) => ((m as { default?: unknown }).default ?? m) as Record<string, LessonBody>,
  );

const loadBodiesResource = createRecoverableLazyLoader((attempt) => (
  import.meta.env.MODE === 'test'
    ? loadBodiesFromModule()
    : fetchJsonResource<Record<string, LessonBody>>(lessonBodiesUrl, attempt)
));

/** Lazily load the heavy reader payloads (own chunk). Cached after the first call. */
export function loadLessonBodies(): Promise<Record<string, LessonBody>> {
  return loadBodiesResource();
}

/** A full lesson (index entry + reader payload), resolved lazily. `undefined`
 *  for an unknown slug. */
export async function loadLesson(slug: string): Promise<Lesson | undefined> {
  const entry = publicLessonBySlug(slug);
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
