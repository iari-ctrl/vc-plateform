import certificationAssessmentsJson from '@data/certificationAssessments.json';
import type { CertificateType, CertificationAssessment } from './certificationTypes';

export const CERTIFICATION_ASSESSMENTS = certificationAssessmentsJson as unknown as CertificationAssessment[];

export const certificationAssessmentById = (id: string) =>
  CERTIFICATION_ASSESSMENTS.find((assessment) => assessment.id === id && assessment.status === 'published');

export const publishedAssessmentForCertification = (
  assessments: readonly CertificationAssessment[],
  certificationId: string,
) => assessments.find((assessment) => assessment.certificationId === certificationId && assessment.status === 'published');

export const assessmentForCertification = (certificationId: string) =>
  publishedAssessmentForCertification(CERTIFICATION_ASSESSMENTS, certificationId);

export type CertificationEvaluationState = 'unknown' | 'unsupported-type' | 'unavailable' | 'available';

export function resolveCertificationEvaluationState(
  certificateType: CertificateType | undefined,
  assessment: Pick<CertificationAssessment, 'status'> | undefined,
  hasActiveCharter: boolean,
): CertificationEvaluationState {
  if (!certificateType) return 'unknown';
  if (certificateType !== 'knowledge') return 'unsupported-type';
  if (!assessment || assessment.status !== 'published' || !hasActiveCharter) return 'unavailable';
  return 'available';
}

