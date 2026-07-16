import certificationsJson from '@data/certifications.json';
import domainsJson from '@data/domains.json';
import { lessonById } from './lessons';
import type {
  Certification,
  CertificationEnrollment,
  CertificationSelection,
  Domain,
  ResolvedFinalAssessment,
  ResolvedCourseRequirement,
} from './certificationTypes';

export type {
  CertificateType,
  Certification,
  CertificationAvailability,
  CertificationAxis,
  CertificationAxisId,
  CertificationEnrollment,
  CertificationOption,
  CertificationSelection,
  CertificationSpecialty,
  CourseRequirement,
  DealRole,
  Domain,
  FinalAssessment,
  FinalAssessmentVariant,
  FundStage,
  ResolvedFinalAssessment,
  ResolvedCourseRequirement,
  RubricCriterion,
} from './certificationTypes';

export const DOMAINS = domainsJson as unknown as Domain[];
export const CERTIFICATIONS = certificationsJson as unknown as Certification[];

export const domainById = (id: string) => DOMAINS.find((domain) => domain.id === id);
export const certificationById = (id: string) => CERTIFICATIONS.find((certification) => certification.id === id);
export const certificationBySlug = (slug: string) => CERTIFICATIONS.find((certification) => certification.slug === slug);
export const certificationsForDomain = (domainId: string) =>
  CERTIFICATIONS.filter((certification) => certification.domainId === domainId && certification.status === 'published');
export const certificationsForCourse = (courseId: string) =>
  CERTIFICATIONS.filter((certification) => {
    if (certification.coreRequirements.some((requirement) => requirement.courseId === courseId)) return true;
    return Object.values(certification.axes).some((axis) =>
      axis.options.some((option) => option.requirement.courseId === courseId),
    );
  });

const AXIS_ORDER = ['fundStage', 'dealRole', 'specialty'] as const;

/** Compose the common curriculum with only the optional blocks explicitly selected. */
export function resolveCertificationCurriculum(
  certification: Certification,
  selection: CertificationSelection = {},
): ResolvedCourseRequirement[] {
  const resolved: ResolvedCourseRequirement[] = certification.coreRequirements.map((requirement) => ({
    ...requirement,
    source: 'core',
  }));

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

export function certificationDisplayTitle(
  certification: Certification,
  selection: CertificationSelection = {},
): string {
  const labels = AXIS_ORDER.flatMap((axisId) => {
    const selectedId = selection[axisId];
    if (!selectedId) return [];
    const option = certification.axes[axisId].options.find((candidate) => candidate.id === selectedId);
    return option ? [option.certificateLabel] : [];
  });
  return labels.length ? `${certification.title} — ${labels.join(', ')}` : certification.title;
}

/** Resolve the base capstone with only the selected contextual case/rubric variants. */
export function resolveFinalAssessment(
  certification: Certification,
  selection: CertificationSelection = {},
): ResolvedFinalAssessment {
  const optionRequirements = resolveCertificationCurriculum(certification, selection).filter(
    (requirement) => requirement.source !== 'core',
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
  const requiredLessonIds = lessonIdsForCertification(certification, selection);
  const doneCount = requiredLessonIds.filter((lessonId) => progress[lessonId]?.status === 'done').length;
  const availableCount = requiredLessonIds.filter((lessonId) => {
    const lesson = lessonById(lessonId);
    return lesson && lesson.status !== 'upcoming';
  }).length;
  const upcomingCount = requiredLessonIds.filter((lessonId) => lessonById(lessonId)?.status === 'upcoming').length;

  return {
    requiredLessonIds,
    doneCount,
    availableCount,
    upcomingCount,
    percentage: requiredLessonIds.length ? Math.round((doneCount / requiredLessonIds.length) * 100) : 0,
  };
}
