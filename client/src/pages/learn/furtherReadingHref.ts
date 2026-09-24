import { CASE_STUDIES } from '@/content/caseStudies';
import { COURSES } from '@/content/courses';
import { DELIVERABLES } from '@/content/deliverables';
import { GLOSSARY } from '@/content/glossary';
import { LESSONS } from '@/content/lessons';
import { SIMULATORS } from '@/content/simulators';
import type { FurtherReading } from '@/content/types';
import {
  createFurtherReadingTargetRegistry,
  resolveFurtherReadingHref,
} from '@shared/further-reading-contract.mjs';

const furtherReadingTargetRegistry = createFurtherReadingTargetRegistry({
  lesson: LESSONS,
  simulator: SIMULATORS,
  case: CASE_STUDIES,
  glossary: GLOSSARY,
  course: COURSES,
  deliverable: DELIVERABLES,
});

export function furtherReadingHref({ kind, ref }: FurtherReading): string | undefined {
  return resolveFurtherReadingHref(furtherReadingTargetRegistry, kind, ref);
}
