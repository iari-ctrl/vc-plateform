import { describe, expect, it } from 'vitest';

import {
  LESSONS,
  PUBLIC_LESSONS,
  isPublishedLesson,
  publicLessonById,
  publicProgressSummary,
  publishedLessonsForCourse,
} from './lessons';
import type { ProgressEntry } from './types';

describe('public lesson catalogue', () => {
  it('expose une collection canonique limitée aux leçons publiées', () => {
    expect(PUBLIC_LESSONS).toHaveLength(118);
    expect(PUBLIC_LESSONS.every(isPublishedLesson)).toBe(true);
    expect(PUBLIC_LESSONS.some((lesson) => lesson.status === 'upcoming')).toBe(false);
  });

  it('calcule la progression globale sans compter les leçons à venir ni les entrées historiques', () => {
    const published = PUBLIC_LESSONS[0];
    const secondPublished = PUBLIC_LESSONS[1];
    const upcoming = LESSONS.find((lesson) => lesson.status === 'upcoming');

    expect(published).toBeDefined();
    expect(secondPublished).toBeDefined();
    expect(upcoming).toBeDefined();
    if (!published || !secondPublished || !upcoming) return;

    const progress: Record<string, ProgressEntry> = {
      [published.id]: { lessonId: published.id, status: 'done', percent: 100 },
      [secondPublished.id]: { lessonId: secondPublished.id, status: 'reading', percent: 40 },
      [upcoming.id]: { lessonId: upcoming.id, status: 'done', percent: 100 },
      'historical-deleted-lesson': { lessonId: 'historical-deleted-lesson', status: 'done', percent: 100 },
    };

    expect(publicProgressSummary(progress)).toEqual({
      doneCount: 1,
      readingCount: 1,
      totalCount: PUBLIC_LESSONS.length,
      percentage: Math.round((1 / PUBLIC_LESSONS.length) * 100),
    });
  });

  it('ne résout pas les leçons non publiques depuis les helpers de reprise', () => {
    const upcoming = LESSONS.find((lesson) => lesson.status === 'upcoming');
    expect(upcoming).toBeDefined();
    if (!upcoming) return;

    expect(publicLessonById(upcoming.id)).toBeUndefined();
    expect(publishedLessonsForCourse(upcoming.courseId).some((lesson) => lesson.id === upcoming.id)).toBe(false);
  });
});
