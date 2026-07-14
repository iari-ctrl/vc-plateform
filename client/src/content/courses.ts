import coursesJson from '@data/courses.json';
import type { Course } from './types';

export const COURSES = coursesJson as unknown as Course[];

export const courseBySlug = (slug: string) => COURSES.find((c) => c.slug === slug);
export const courseById = (id: string) => COURSES.find((c) => c.id === id);

export const coursesForPath = (pathId: string) =>
  COURSES.filter((c) => c.pathId === pathId).sort((a, b) => a.order - b.order);
