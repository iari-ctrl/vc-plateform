import { publicLessonById } from '@/content/lessons';
import { useUserData } from '@/context/UserDataContext';

/**
 * The lesson a returning learner should resume — i.e. one they've started but
 * not finished. `ProgressEntry` carries no timestamp, so we can't sort by true
 * recency; we surface the last in-progress entry encountered, which maps to the
 * most recently *added* reading key in the common case. Returns `undefined`
 * when nothing is in progress (caller decides the empty/first-step UI).
 */
export function useResumeLesson() {
  const { progress } = useUserData();
  const reading = Object.values(progress).filter((p) => p.status === 'reading' && publicLessonById(p.lessonId));
  if (!reading.length) return undefined;
  return publicLessonById(reading[reading.length - 1].lessonId);
}
