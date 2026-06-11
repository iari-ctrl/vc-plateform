import caseStudiesJson from '@data/caseStudies.json';
import type { CaseStudy } from './types';

export const CASE_STUDIES = caseStudiesJson as unknown as CaseStudy[];

export const caseBySlug = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);
export const caseById = (id: string) => CASE_STUDIES.find((c) => c.id === id);
