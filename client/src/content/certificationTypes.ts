import type { Level } from './types';

export type CertificateType = 'knowledge' | 'professional';
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

/**
 * An ordered, non-empty subset of a course. Referential validation guarantees
 * that every lesson belongs to `courseId` and follows the course's canonical
 * order; a requirement does not have to include the whole course.
 */
export interface CourseRequirement {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  lessonIds: string[];
}

export interface AxisCourseRequirement extends CourseRequirement {
  assessmentVariantId: string;
}

export interface CertificationOption<T extends string = string> {
  id: T;
  label: string;
  certificateLabel: string;
  description: string;
  requirement: AxisCourseRequirement;
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

export interface CertificationSupplementOption<T extends string = string> {
  axisId: CertificationAxisId;
  optionId: T;
  label: string;
  certificateLabel: string;
}

export interface CertificationSupplement {
  fundStage?: CertificationSupplementOption<FundStage>;
  dealRole?: CertificationSupplementOption<DealRole>;
  specialty?: CertificationSupplementOption<CertificationSpecialty>;
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

interface CertificationBase {
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
}

export interface KnowledgeCertification extends CertificationBase {
  certificateType: 'knowledge';
  coreRequirements: CourseRequirement[];
  assessmentId: string;
  capstoneDeliverableId?: string;
  candidateCharterId: string;
  candidateCharterVersion: string;
}

export interface ProfessionalCertification extends CertificationBase {
  certificateType: 'professional';
  prerequisiteCertificationId?: string;
  recommendedPreparation: CourseRequirement[];
  axes: {
    fundStage: CertificationAxis<FundStage>;
    dealRole: CertificationAxis<DealRole>;
    specialty: CertificationAxis<CertificationSpecialty>;
  };
  finalAssessment: FinalAssessment;
  eligibilityConditions: string[];
  criticalErrors: string[];
}

export type Certification = KnowledgeCertification | ProfessionalCertification;

export interface CertificationEnrollment {
  certificationId: string;
  selection: CertificationSelection;
  createdAt: string;
  updatedAt: string;
}

export interface ResolvedCourseRequirement extends CourseRequirement {
  source: 'core' | 'recommended' | keyof CertificationSelection;
  optionId?: string;
  assessmentVariantId?: string;
}

export type CertificationLevelStatus = 'available' | 'in-construction' | 'future';

export interface CertificationLevelPromise {
  id: string;
  order: number;
  title: string;
  category: CertificateType;
  status: CertificationLevelStatus;
  promise: string;
  audience: string;
  scope: string[];
  exclusions: string[];
  certificationId?: string;
}

export interface CandidateCharterPrinciple {
  id:
    | 'authenticity'
    | 'sources'
    | 'artificial-intelligence'
    | 'confidentiality'
    | 'conflicts-of-interest'
    | 'critical-errors'
    | 'local-data-responsibility';
  title: string;
  statement: string;
}

export interface CandidateCharter {
  id: string;
  version: string;
  status: 'active' | 'archived';
  title: string;
  effectiveDate: string;
  introduction: string;
  principles: CandidateCharterPrinciple[];
  acceptanceStatement: string;
  futureSessionAnnex: {
    status: 'inactive';
    title: string;
    provisions: string[];
  };
}

export interface AssessmentOption {
  id: string;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  competencyId: string;
  prompt: string;
  options: AssessmentOption[];
  correctOptionId: string;
  points: number;
  explanation: string;
}

export interface NumericAssessmentTolerance {
  mode: 'absolute' | 'relative';
  value: number;
}

export interface NumericAssessmentQuestion {
  id: string;
  prompt: string;
  unit: string;
  expectedValue: number;
  tolerance: NumericAssessmentTolerance;
  points: number;
  correction: string;
}

export interface AssessmentMiniCase {
  id: string;
  title: string;
  scenario: string;
  instructions: string;
  points: number;
  questions: NumericAssessmentQuestion[];
}

export interface CertificationAssessment {
  id: string;
  status: CertificationStatus;
  version: string;
  certificationId: string;
  candidateCharterId: string;
  candidateCharterVersion: string;
  title: string;
  description: string;
  competencies: { id: string; label: string }[];
  exam: {
    title: string;
    instructions: string;
    points: number;
    questionCount: number;
    questionsPerCompetency: number;
    shuffleQuestions: true;
    consultationPolicy: 'not-recommended';
    questions: AssessmentQuestion[];
  };
  miniCases: AssessmentMiniCase[];
  passingRules: {
    totalMin: number;
    examMin: number;
    caseMinEach: number;
  };
  resourcePolicy: {
    exam: string;
    miniCases: string;
  };
  attemptPolicy: {
    unlimited: true;
    timer: false;
    technicalLocking: false;
    persistActiveAttempt: true;
    submittedHistoryLimit: number;
    preserveBestResult: true;
    shuffleOncePerAttempt: true;
  };
  toolDeclaration: {
    required: true;
    prompt: string;
    choices: string[];
    allowFreeText: true;
  };
}
