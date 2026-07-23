import { describe, expect, it } from 'vitest';

import type { CertificationAssessment } from './certificationTypes';
import {
  publishedAssessmentForCertification,
  resolveCertificationEvaluationState,
} from './certificationAssessments';

describe('certification assessment publication gate', () => {
  it('exposes only explicitly published assessments', () => {
    const assessments = [
      { id: 'draft', certificationId: 'cert-1', status: 'draft' },
      { id: 'published', certificationId: 'cert-1', status: 'published' },
    ] as unknown as CertificationAssessment[];

    expect(publishedAssessmentForCertification(assessments, 'cert-1')?.id).toBe('published');
    expect(publishedAssessmentForCertification(assessments, 'missing')).toBeUndefined();
  });

  it.each([
    [undefined, undefined, false, 'unknown'],
    ['professional', undefined, false, 'unsupported-type'],
    ['knowledge', undefined, true, 'unavailable'],
    ['knowledge', { status: 'draft' }, true, 'unavailable'],
    ['knowledge', { status: 'published' }, false, 'unavailable'],
    ['knowledge', { status: 'published' }, true, 'available'],
  ] as const)(
    'resolves %s / %s / charter=%s to %s',
    (certificateType, assessment, hasActiveCharter, expected) => {
      expect(resolveCertificationEvaluationState(
        certificateType,
        assessment as Pick<CertificationAssessment, 'status'> | undefined,
        hasActiveCharter,
      )).toBe(expected);
    },
  );
});
