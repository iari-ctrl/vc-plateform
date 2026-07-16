import type { Level } from './types';

export type CertificateType = 'knowledge' | 'competence' | 'professional';
export type CertificationStatus = 'draft' | 'published';
export type CertificationAvailability = 'in-construction' | 'open' | 'closed';
export type CertificationAxisId = 'fundStage' | 'dealRole' | 'specialty';
export type FundStage = 'pre-seed' | 'seed' | 'series-a' | 'growth';
export type DealRole = 'lead' | 'co-lead' | 'follower';
export type CertificationSpecialty =
  | 'generalist'
  | 'saas'
  | 'deeptech'
  | 'climate'
  | 'health-biotech'
  | 'consumer-marketplaces'
  | 'impact';

export interface Domain {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export interface CourseRequirement {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  lessonIds: string[];
  assessmentVariantId: string;
}

export interface CertificationOption<T extends string = string> {
  id: T;
  label: string;
  certificateLabel: string;
  description: string;
  requirement: CourseRequirement;
}

export interface CertificationAxis<T extends string = string> {
  id: CertificationAxisId;
  label: string;
  description: string;
  options: CertificationOption<T>[];
}

export interface CertificationSelection {
  fundStage?: FundStage;
  dealRole?: DealRole;
  specialty?: CertificationSpecialty;
}

export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
  maxScore: number;
  critical: boolean;
}

export interface FinalAssessmentVariant {
  id: string;
  axis: CertificationAxisId;
  optionId: string;
  caseAdaptation: string;
  rubricCriteria: string[];
}

export interface FinalAssessment {
  id: string;
  type: 'case-and-oral-defense';
  title: string;
  description: string;
  deliverables: string[];
  rubricId: string;
  rubricCriteria: RubricCriterion[];
  optionVariants: FinalAssessmentVariant[];
  passingScore: number;
  criticalCriteriaMustPass: boolean;
  evaluatorTypes: ('expert' | 'jury')[];
}

export interface ResolvedFinalAssessment extends Omit<FinalAssessment, 'optionVariants'> {
  optionVariants: FinalAssessmentVariant[];
}

export interface Certification {
  id: string;
  slug: string;
  domainId: string;
  title: string;
  shortTitle: string;
  certificateType: CertificateType;
  status: CertificationStatus;
  availability: CertificationAvailability;
  issuer: string;
  targetRoles: string[];
  level: Level;
  summary: string;
  competencies: string[];
  coreRequirements: CourseRequirement[];
  axes: {
    fundStage: CertificationAxis<FundStage>;
    dealRole: CertificationAxis<DealRole>;
    specialty: CertificationAxis<CertificationSpecialty>;
  };
  finalAssessment: FinalAssessment;
  eligibilityConditions: string[];
  criticalErrors: string[];
}

export interface CertificationEnrollment {
  certificationId: string;
  selection: CertificationSelection;
  createdAt: string;
  updatedAt: string;
}

export interface ResolvedCourseRequirement extends CourseRequirement {
  source: 'core' | keyof CertificationSelection;
  optionId?: string;
}
