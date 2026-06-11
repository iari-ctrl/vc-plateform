import lessonsJson from '@data/lessons.json';
import type { Lesson } from './types';
import { coursesForPath } from './courses';
import { PARCOURS_LESSONS } from './parcoursLessons';

// Library lessons (l-*) plus the Parcours-authored registers (ld-*/lea-*), which
// cohabit so the new flagship parcours can surface their bespoke content while
// the serious library copy stays untouched.
export const LESSONS = [
  ...(lessonsJson as unknown as Lesson[]),
  ...PARCOURS_LESSONS,
];

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);

export const lessonsForCourse = (courseId: string) =>
  LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
export const lessonsForPath = (pathId: string) =>
  coursesForPath(pathId).flatMap((c) => lessonsForCourse(c.id));
