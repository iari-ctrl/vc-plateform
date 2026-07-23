import certificationsJson from '@data/certifications.json';
import domainsJson from '@data/domains.json';
import { isPublishedContent } from '@shared/publication.mjs';
import { lessonById } from './lessons';
import type {
  Certification,
  CertificationEnrollment,
  CertificationSelection,
  CertificationSupplement,
  Domain,
  KnowledgeCertification,
  ProfessionalCertification,
  ResolvedFinalAssessment,
  ResolvedCourseRequirement,
} from './certificationTypes';

export type {
  AssessmentMiniCase,
  AssessmentOption,
  AssessmentQuestion,
  AxisCourseRequirement,
  CandidateCharter,
  CandidateCharterPrinciple,
  CertificateType,
  Certification,
  CertificationAssessment,
  CertificationAvailability,
  CertificationAxis,
  CertificationAxisId,
  CertificationEnrollment,
  CertificationLevelPromise,
  CertificationLevelStatus,
  CertificationOption,
  CertificationSelection,
  CertificationSpecialty,
  CertificationStatus,
  CertificationSupplement,
  CertificationSupplementOption,
  CourseRequirement,
  DealRole,
  Domain,
  FinalAssessment,
  FinalAssessmentVariant,
  FundStage,
  KnowledgeCertification,
  NumericAssessmentQuestion,
  NumericAssessmentTolerance,
  ProfessionalCertification,
  ResolvedFinalAssessment,
  ResolvedCourseRequirement,
  RubricCriterion,
} from './certificationTypes';

export const DOMAINS = domainsJson as unknown as Domain[];
export const CERTIFICATIONS = (certificationsJson as unknown as Certification[]).filter(isPublishedContent);

export const isKnowledgeCertification = (
  certification: Certification,
): certification is KnowledgeCertification => certification.certificateType === 'knowledge';

export const isProfessionalCertification = (
  certification: Certification,
): certification is ProfessionalCertification => certification.certificateType === 'professional';

export const domainById = (id: string) => DOMAINS.find((domain) => domain.id === id);
export const certificationById = (id: string) => CERTIFICATIONS.find((certification) => certification.id === id);
export const certificationBySlug = (slug: string) => CERTIFICATIONS.find((certification) => certification.slug === slug);
export const certificationsForDomain = (domainId: string) =>
  CERTIFICATIONS.filter((certification) => certification.domainId === domainId && certification.status === 'published');

export const certificationsForCourse = (courseId: string) =>
  CERTIFICATIONS.filter((certification) => {
    const baseRequirements = isKnowledgeCertification(certification)
      ? certification.coreRequirements
      : certification.recommendedPreparation;
    if (baseRequirements.some((requirement) => requirement.courseId === courseId)) return true;
    return isProfessionalCertification(certification) && Object.values(certification.axes).some((axis) =>
      axis.options.some((option) => option.requirement.courseId === courseId),
    );
  });

const AXIS_ORDER = ['fundStage', 'dealRole', 'specialty'] as const;

/** Resolve the canonical course blocks, then only the professional options selected. */
export function resolveCertificationCurriculum(
  certification: Certification,
  selection: CertificationSelection = {},
): ResolvedCourseRequirement[] {
  const baseRequirements = isKnowledgeCertification(certification)
    ? certification.coreRequirements.map((requirement) => ({ ...requirement, source: 'core' as const }))
    : certification.recommendedPreparation.map((requirement) => ({ ...requirement, source: 'recommended' as const }));

  if (!isProfessionalCertification(certification)) return baseRequirements;

  const resolved: ResolvedCourseRequirement[] = [...baseRequirements];
  for (const axisId of AXIS_ORDER) {
    const selectedId = selection[axisId];
    if (!selectedId) continue;
    const option = certification.axes[axisId].options.find((candidate) => candidate.id === selectedId);
    if (!option) continue;
    resolved.push({ ...option.requirement, source: axisId, optionId: option.id });
  }

  return resolved;
}

export function lessonIdsForCertification(
  certification: Certification,
  selection: CertificationSelection = {},
): string[] {
  const seen = new Set<string>();
  return resolveCertificationCurriculum(certification, selection).flatMap((requirement) =>
    requirement.lessonIds.filter((lessonId) => {
      if (seen.has(lessonId)) return false;
      seen.add(lessonId);
      return true;
    }),
  );
}

/** The credential title is canonical and never incorporates contextual options. */
export function certificationDisplayTitle(
  certification: Certification,
  _selection: CertificationSelection = {},
): string {
  return certification.title;
}

/** Resolve contextual wording separately from the invariant professional title. */
export function resolveCertificationSupplement(
  certification: ProfessionalCertification,
  selection: CertificationSelection = {},
): CertificationSupplement {
  const supplement: CertificationSupplement = {};

  for (const axisId of AXIS_ORDER) {
    const selectedId = selection[axisId];
    if (!selectedId) continue;
    const option = certification.axes[axisId].options.find((candidate) => candidate.id === selectedId);
    if (!option) continue;
    Object.assign(supplement, {
      [axisId]: {
        axisId,
        optionId: option.id,
        label: option.label,
        certificateLabel: option.certificateLabel,
      },
    });
  }

  return supplement;
}

/** Resolve the base capstone with only the selected contextual case/rubric variants. */
export function resolveFinalAssessment(
  certification: ProfessionalCertification,
  selection: CertificationSelection = {},
): ResolvedFinalAssessment {
  const optionRequirements = resolveCertificationCurriculum(certification, selection).filter(
    (requirement) => requirement.source !== 'recommended',
  );
  const optionVariants = optionRequirements.flatMap((requirement) => {
    const variant = certification.finalAssessment.optionVariants.find(
      (candidate) => candidate.id === requirement.assessmentVariantId,
    );
    return variant ? [variant] : [];
  });

  return { ...certification.finalAssessment, optionVariants };
}

export function compactCertificationSelection(selection: CertificationSelection): CertificationSelection {
  return {
    ...(selection.fundStage ? { fundStage: selection.fundStage } : {}),
    ...(selection.dealRole ? { dealRole: selection.dealRole } : {}),
    ...(selection.specialty ? { specialty: selection.specialty } : {}),
  };
}

export function createCertificationEnrollment(
  certificationId: string,
  selection: CertificationSelection,
  previous: CertificationEnrollment | null = null,
  updatedAt = new Date().toISOString(),
): CertificationEnrollment {
  return {
    certificationId,
    selection: compactCertificationSelection(selection),
    createdAt: previous?.createdAt ?? updatedAt,
    updatedAt,
  };
}

export function upsertCertificationEnrollment(
  enrollments: Record<string, CertificationEnrollment>,
  enrollment: CertificationEnrollment,
): Record<string, CertificationEnrollment> {
  return { ...enrollments, [enrollment.certificationId]: enrollment };
}

export function resolveCertificationProgress(
  certification: Certification,
  selection: CertificationSelection,
  progress: Record<string, { status: 'reading' | 'done' }>,
) {
  const lessonIds = lessonIdsForCertification(certification, selection);
  const doneCount = lessonIds.filter((lessonId) => progress[lessonId]?.status === 'done').length;
  const availableCount = lessonIds.filter((lessonId) => {
    const lesson = lessonById(lessonId);
    return lesson?.status === 'published';
  }).length;
  const upcomingCount = lessonIds.filter((lessonId) => lessonById(lessonId)?.status === 'upcoming').length;

  return {
    lessonIds,
    // Kept as an alias while consumers migrate to the neutral `lessonIds` name.
    requiredLessonIds: lessonIds,
    doneCount,
    availableCount,
    upcomingCount,
    percentage: lessonIds.length ? Math.round((doneCount / lessonIds.length) * 100) : 0,
  };
}
