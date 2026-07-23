import type { Course } from './types';
import type { Parcours } from './parcoursTypes';
import { deliverableById } from './deliverables';
import { publicLessonById, publishedLessonsForCourse } from './lessons';
import { resolveStep } from './parcours';
import { caseById } from './caseStudies';

export interface ParcoursTimeSummary {
  readingMinutes: number;
  guidedPracticeMinutes: number;
  consolidationMinutes: number;
  finalMinutes: number;
  optionalMinutes: number;
  requiredMinutes: number;
  completeMinutes: number;
}

export function courseReadingMinutes(course: Course): number {
  if (course.durationSource !== 'lesson-read-minutes') return course.durationMin;
  return publishedLessonsForCourse(course.id).reduce((sum, lesson) => sum + lesson.readMin, 0);
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function parcoursTimeSummary(parcours: Parcours): ParcoursTimeSummary {
  if (parcours.time.source !== 'derived') {
    const requiredMinutes = Math.round(parcours.time.coreHours * 60);
    const completeMinutes = Math.round((parcours.time.withBonusHours ?? parcours.time.coreHours) * 60);
    return {
      readingMinutes: requiredMinutes,
      guidedPracticeMinutes: 0,
      consolidationMinutes: 0,
      finalMinutes: 0,
      optionalMinutes: Math.max(0, completeMinutes - requiredMinutes),
      requiredMinutes,
      completeMinutes,
    };
  }

  const lessonIds = unique(parcours.steps.flatMap((step) => {
    const resolved = resolveStep(step);
    return resolved.lessonIds ?? (resolved.lessonId ? [resolved.lessonId] : []);
  }));
  const lessons = lessonIds.map(publicLessonById).filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
  const readingMinutes = lessons.reduce((sum, lesson) => sum + lesson.readMin, 0);
  const guidedPracticeMinutes = lessons.reduce((sum, lesson) => sum + (lesson.practice?.estimatedMinutes ?? 0), 0);

  const seenDeliverables = new Set<string>();
  let consolidationMinutes = 0;
  let finalMinutes = 0;
  let optionalMinutes = 0;

  for (const step of parcours.steps) {
    if (step.ref.kind === 'case' && step.type === 'bonus') {
      optionalMinutes += caseById(step.ref.id)?.estimatedWorkMinutes ?? 0;
      continue;
    }
    if (step.ref.kind !== 'deliverable' && step.ref.kind !== 'milestone') continue;
    if (seenDeliverables.has(step.ref.id)) continue;
    seenDeliverables.add(step.ref.id);
    const deliverable = deliverableById(step.ref.id);
    if (!deliverable) continue;
    const minutes = deliverable.estimatedWorkMinutes ?? 0;
    if (step.type === 'bonus') {
      optionalMinutes += minutes;
    } else if (deliverable.activityKind === 'cumulative-exercise') {
      consolidationMinutes += minutes;
    } else if (deliverable.activityKind === 'capstone' || step.ref.kind === 'milestone') {
      finalMinutes += minutes;
      optionalMinutes += deliverable.externalReviewMinutes ?? 0;
    }
  }

  const requiredMinutes = readingMinutes + guidedPracticeMinutes + consolidationMinutes + finalMinutes;
  return {
    readingMinutes,
    guidedPracticeMinutes,
    consolidationMinutes,
    finalMinutes,
    optionalMinutes,
    requiredMinutes,
    completeMinutes: requiredMinutes + optionalMinutes,
  };
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${String(rest).padStart(2, '0')}`;
}
