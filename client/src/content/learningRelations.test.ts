import { describe, expect, it } from 'vitest';
import { COURSES } from './courses';
import { LESSONS } from './lessons';

describe('course and lesson relations', () => {
  it('keeps course-to-lesson and lesson-to-course references reciprocal', () => {
    const coursesById = new Map(COURSES.map((course) => [course.id, course]));
    const lessonsById = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));

    for (const course of COURSES) {
      expect(new Set(course.lessonIds).size, course.id).toBe(course.lessonIds.length);
      for (const lessonId of course.lessonIds) {
        expect(lessonsById.get(lessonId)?.courseId, `${course.id} -> ${lessonId}`).toBe(course.id);
      }
    }

    for (const lesson of LESSONS) {
      expect(coursesById.get(lesson.courseId)?.lessonIds, `${lesson.id} -> ${lesson.courseId}`).toContain(lesson.id);
    }
  });

  it('uses a unique, continuous order inside every course', () => {
    const lessonsById = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));

    for (const course of COURSES) {
      const orders = course.lessonIds.map((lessonId) => lessonsById.get(lessonId)?.order);
      expect(orders, course.id).toEqual(course.lessonIds.map((_, index) => index + 1));
    }
  });
});
