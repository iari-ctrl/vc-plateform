import type { Course } from './types';
import type { Parcours } from './parcoursTypes';
import { deliverableById } from './deliverables';
import { publicLessonById, publishedLessonsForCourse } from './lessons';
import { resolveStep } from './parcours';
import { caseById } from './caseStudies';
import { SIMULATORS } from './simulators';

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

  const requiredLessonIds = new Set<string>();
  const optionalLessonIds = new Set<string>();
  for (const step of parcours.steps) {
    const resolved = resolveStep(step);
    const ids = resolved.lessonIds ?? (resolved.lessonId ? [resolved.lessonId] : []);
    const isOptional = step.type === 'bonus' || step.type === 'respiration';
    for (const id of ids) {
      if (isOptional) {
        if (!requiredLessonIds.has(id)) optionalLessonIds.add(id);
      } else {
        requiredLessonIds.add(id);
        optionalLessonIds.delete(id);
      }
    }
  }
  const requiredLessons = [...requiredLessonIds]
    .map(publicLessonById)
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
  const optionalLessons = [...optionalLessonIds]
    .map(publicLessonById)
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
  const parcoursDeliverableIds = new Set(parcours.steps
    .filter((step) => step.ref.kind === 'deliverable' || step.ref.kind === 'milestone')
    .map((step) => step.ref.id));
  const practiceMinutesInParcours = (lesson: NonNullable<ReturnType<typeof publicLessonById>>) => (
    lesson.practice && parcoursDeliverableIds.has(lesson.practice.deliverableId)
      ? lesson.practice.estimatedMinutes
      : 0
  );
  let readingMinutes = requiredLessons.reduce((sum, lesson) => sum + lesson.readMin, 0);
  const guidedPracticeMinutes = requiredLessons.reduce((sum, lesson) => sum + practiceMinutesInParcours(lesson), 0);

  const seenDeliverables = new Set<string>();
  let consolidationMinutes = 0;
  let finalMinutes = 0;
  let optionalMinutes = optionalLessons.reduce((sum, lesson) => (
    sum + lesson.readMin + (lesson.practice?.estimatedMinutes ?? 0)
  ), 0);

  for (const step of parcours.steps) {
    if (step.ref.kind === 'case') {
      const caseStudy = caseById(step.ref.id);
      const caseMinutes = (caseStudy?.readMin ?? 0) + (caseStudy?.estimatedWorkMinutes ?? 0);
      if (step.type === 'bonus' || step.type === 'respiration') {
        optionalMinutes += caseMinutes;
      } else {
        consolidationMinutes += caseMinutes;
      }
      continue;
    }
    if (step.ref.kind === 'simulator') {
      const simulatorMinutes = SIMULATORS.find((simulator) => simulator.id === step.ref.id)?.estimatedWorkMinutes ?? 0;
      if (step.type === 'bonus' || step.type === 'respiration') {
        optionalMinutes += simulatorMinutes;
      } else {
        consolidationMinutes += simulatorMinutes;
      }
      continue;
    }
    if (step.ref.kind !== 'deliverable' && step.ref.kind !== 'milestone') continue;
    if (seenDeliverables.has(step.ref.id)) continue;
    seenDeliverables.add(step.ref.id);
    const deliverable = deliverableById(step.ref.id);
    if (!deliverable) continue;
    const workMinutes = deliverable.estimatedWorkMinutes ?? 0;
    if (step.type === 'bonus') {
      optionalMinutes += deliverable.readMin + workMinutes;
    } else if (deliverable.activityKind === 'cumulative-exercise') {
      readingMinutes += deliverable.readMin;
      consolidationMinutes += workMinutes;
    } else if (deliverable.activityKind === 'capstone' || step.ref.kind === 'milestone') {
      finalMinutes += deliverable.readMin + workMinutes;
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
