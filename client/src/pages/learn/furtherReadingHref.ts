import { CASE_STUDIES } from '@/content/caseStudies';
import { COURSES } from '@/content/courses';
import { DELIVERABLES } from '@/content/deliverables';
import { GLOSSARY } from '@/content/glossary';
import { LESSONS } from '@/content/lessons';
import { SIMULATORS } from '@/content/simulators';
import type { FurtherReading } from '@/content/types';
import { safeHttpUrl } from '@/lib/utils';
import {
  createFurtherReadingTargetRegistry,
  resolveInternalFurtherReadingHref,
} from '@shared/further-reading-contract.mjs';

const furtherReadingTargetRegistry = createFurtherReadingTargetRegistry({
  lesson: LESSONS,
  simulator: SIMULATORS,
  case: CASE_STUDIES,
  glossary: GLOSSARY,
  course: COURSES,
  deliverable: DELIVERABLES,
});

export function furtherReadingHref(furtherReading: FurtherReading): string | undefined {
  const { kind, ref } = furtherReading;
  if (kind === 'external') return safeHttpUrl(ref);
  return resolveInternalFurtherReadingHref(furtherReadingTargetRegistry, kind, ref);
}
