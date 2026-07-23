import { caseById } from '@/content/caseStudies';
import { courseById } from '@/content/courses';
import { deliverableById } from '@/content/deliverables';
import { glossaryBySlug } from '@/content/glossary';
import { lessonById } from '@/content/lessons';
import { simulatorBySlug } from '@/content/simulators';
import type { FurtherReading } from '@/content/types';

export function furtherReadingHref(furtherReading: FurtherReading): string {
  const { kind, ref } = furtherReading;
  if (kind === 'simulator') return `/simulators/${simulatorBySlug(ref)?.slug ?? ref}`;
  if (kind === 'lesson') return `/lessons/${lessonById(ref)?.slug ?? ref}`;
  if (kind === 'course') return `/courses/${courseById(ref)?.slug ?? ref}`;
  if (kind === 'case') return `/cases/${caseById(ref)?.slug ?? ref}`;
  if (kind === 'glossary') return `/glossary?term=${glossaryBySlug(ref)?.slug ?? ref}`;
  if (kind === 'deliverable') return `/livrables/${deliverableById(ref)?.slug ?? ref}`;
  return '#';
}
