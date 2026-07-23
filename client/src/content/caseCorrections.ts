import caseCorrectionsUrl from '@data/caseCorrections.json?url';
import type { CaseCorrection } from './types';
import { createRecoverableLazyLoader, fetchJsonResource } from './lazyResource';

const loadCorrectionsFromModule = () =>
  import('@data/caseCorrections.json').then((module) => {
    const payload = (module as { default?: unknown }).default ?? module;
    return payload as CaseCorrection[];
  });

const loadCorrectionsResource = createRecoverableLazyLoader((attempt) => (
  import.meta.env.MODE === 'test'
    ? loadCorrectionsFromModule()
    : fetchJsonResource<CaseCorrection[]>(caseCorrectionsUrl, attempt)
));

/**
 * Corrections stay outside the catalogue and the eager content graph. They are
 * fetched only from the voluntary reveal route.
 */
export function loadCaseCorrections(): Promise<CaseCorrection[]> {
  return loadCorrectionsResource();
}

export async function loadCaseCorrectionBySourceCaseId(caseId: string): Promise<CaseCorrection | undefined> {
  const corrections = await loadCaseCorrections();
  return corrections.find((correction) => correction.sourceCaseId === caseId);
}
