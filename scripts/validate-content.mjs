#!/usr/bin/env node
/**
 * Content integrity check for the VC Premium JSON sources (`/data/*.json`,
 * `/data/blog/*.json`, and generated drop-in registries).
 *
 * Three layers of validation, from the inside out:
 *   1. SHAPE      — Zod schemas validate every JSON file's structure & types.
 *   2. REFERENCES — cross-file ids/slugs resolve (domainId, courseId, lessonIds,
 *                   relatedLessonIds, glossaryRefs, furtherReading.ref,
 *                   profile/parcours mappings …) and ids/slugs are unique.
 *   3. MARKERS    — every inline [[slug|label]] / {{slug|label}} resolves to a
 *                   glossary slug (the original check, preserved).
 *
 * Plus an explicit QUIZ rule: malformed quizzes are errors; lessons missing a
 * quiz are reported as warnings (a content gap, not a broken build).
 *
 * Run: `npm run validate:content`  — exits non-zero on any error.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { z } from 'zod';
import { safeEditorialUrl } from '../shared/editorial-url.mjs';
import {
  FURTHER_READING_KINDS,
  findEditorialToneErrors,
  findMarkdownLinkErrors,
  shouldFailValidation,
  validateCanonicalGlossaryPublication,
  validateFurtherReadingReferences,
  validateParcoursRelations,
} from './validation-core.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');

/** Minimum quiz questions expected per lesson (missing quiz → warning). */
const MIN_QUIZ_QUESTIONS = 1;

// ── Tiny report harness ──────────────────────────────────────────────────────
// Three tiers: errors (always fatal), warnings (integrity gaps — fatal under
// --strict), and softWarnings (acknowledged content backlog, e.g. lessons still
// missing a quiz — reported but never fatal, even strict). The soft tier lets
// CI run --strict for zero-tolerance on integrity without blocking on content
// that is simply not written yet.
const errors = [];
const warnings = [];
const softWarnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const soft = (msg) => softWarnings.push(msg);

const readJson = (name) => {
  try {
    return JSON.parse(readFileSync(join(dataDir, name), 'utf8'));
  } catch (e) {
    err(`${name} — illisible ou JSON invalide : ${e.message}`);
    return undefined;
  }
};

const listJsonFiles = (name) => {
  try {
    return readdirSync(join(dataDir, name))
      .filter((file) => file.endsWith('.json'))
      .sort();
  } catch (e) {
    err(`${name}/ — dossier illisible : ${e.message}`);
    return [];
  }
};

/** Validate `value` against `schema`; push prefixed issues to errors. */
const check = (label, schema, value) => {
  if (value === undefined) return undefined;
  const res = schema.safeParse(value);
  if (!res.success) {
    for (const i of res.error.issues) {
      err(`${label} ${i.path.length ? `[${i.path.join('.')}]` : ''} — ${i.message}`);
    }
    return undefined;
  }
  return res.data;
};

/** Flag duplicate values of `key` across `rows`. */
const assertUnique = (label, rows, key) => {
  const seen = new Map();
  for (let idx = 0; idx < rows.length; idx++) {
    const v = rows[idx][key];
    if (seen.has(v)) err(`${label} — ${key} en double : "${v}" (positions ${seen.get(v)} et ${idx})`);
    else seen.set(v, idx);
  }
};

// ── Shared scalars ───────────────────────────────────────────────────────────
const nonEmpty = z.string().min(1);
const slug = z.string().regex(/^[a-z0-9-]+$/, 'doit être un slug en minuscules (a-z, 0-9, -)');
const level = z.enum(['debutant', 'intermediaire', 'avance', 'tous']);
const idList = z.array(z.string());
const httpsUrl = nonEmpty.refine(
  (value) => Boolean(safeEditorialUrl(value)),
  'URL éditoriale HTTPS attendue',
);
const httpsOrInternalUrl = nonEmpty.refine(
  (value) => Boolean(safeEditorialUrl(value, { allowInternal: true, allowFragment: true })),
  'URL HTTPS, route interne ou ancre attendue',
);
const FUND_STAGE_OPTION_IDS = ['pre-seed', 'seed', 'series-a', 'growth'];
const DEAL_ROLE_OPTION_IDS = ['lead', 'co-lead', 'follower'];
const SPECIALTY_OPTION_IDS = [
  'generalist',
  'saas',
  'deeptech',
  'climate',
  'health-biotech',
  'consumer-marketplaces',
  'impact',
];

// ── Schemas ──────────────────────────────────────────────────────────────────
const courseSchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  subtitle: z.string(),
  level,
  durationMin: z.number().nonnegative(),
  durationSource: z.enum(['declared', 'lesson-read-minutes']).optional(),
  summary: nonEmpty,
  tags: z.array(z.string()),
  lessonIds: idList,
}).strict();

const quizQuestionSchema = z.object({
  question: nonEmpty,
  options: z.array(z.object({ text: nonEmpty, correct: z.boolean() })).min(2),
  explanation: nonEmpty,
}).strict();

const furtherReadingSchema = z.object({
  label: nonEmpty,
  kind: z.enum(FURTHER_READING_KINDS),
  ref: nonEmpty,
}).strict();

const lessonSchema = z.object({
  id: nonEmpty,
  slug,
  courseId: nonEmpty,
  order: z.number().int().nonnegative(),
  title: nonEmpty,
  kicker: z.string(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  status: z.enum(['published', 'upcoming']),
  level: level.optional(),
  contexts: z.object({
    fundStages: z.array(z.enum(FUND_STAGE_OPTION_IDS)).optional(),
    dealRoles: z.array(z.enum(DEAL_ROLE_OPTION_IDS)).optional(),
    sectors: z.array(z.enum(SPECIALTY_OPTION_IDS)).optional(),
  }).strict().optional(),
  optional: z.boolean().optional(),
  learningOutcomes: z.array(nonEmpty).optional(),
  prerequisiteLessonIds: idList.optional(),
  assessmentId: nonEmpty.optional(),
  practice: z.object({
    deliverableId: nonEmpty,
    sectionId: nonEmpty,
    estimatedMinutes: z.number().int().positive(),
  }).strict().optional(),
  body: nonEmpty.optional(),
  bodyShort: nonEmpty.optional(),
  keyTakeaways: z.array(z.string()).optional(),
  glossaryRefs: idList,
  quiz: z.array(quizQuestionSchema).optional(),
  furtherReading: z.array(furtherReadingSchema).optional(),
}).strict().superRefine((lesson, ctx) => {
  const { status } = lesson;
  if (status === 'published' && !lesson.body) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['body'], message: 'requis pour une leçon publiée' });
  }
  if (status === 'published' && !lesson.keyTakeaways) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['keyTakeaways'], message: 'requis pour une leçon publiée' });
  }
  if (status === 'upcoming') {
    const requiredMetadata = [
      ['level', lesson.level],
      ['contexts', lesson.contexts],
      ['optional', lesson.optional],
      ['prerequisiteLessonIds', lesson.prerequisiteLessonIds],
      ['assessmentId', lesson.assessmentId],
    ];
    for (const [field, value] of requiredMetadata) {
      if (value === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: 'métadonnée pédagogique requise pour une leçon à venir',
        });
      }
    }
    if (!lesson.learningOutcomes?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['learningOutcomes'],
        message: 'au moins un objectif pédagogique est requis pour une leçon à venir',
      });
    }
  }
});

const parcoursFamily = z.enum(['decouvrir', 'entretien', 'levee', 'grade', 'maitriser', 'express']);
const parcoursRoadmap = z.enum(['now', 'next', 'later']);
const perspective = z.enum(['founder', 'investor', 'both']);
const timeBudget = z.enum(['low', 'medium', 'high']);
const stepType = z.enum(['coeur', 'bonus', 'pratique', 'respiration']);
const stepRefKind = z.enum(['lesson', 'course', 'case', 'simulator', 'glossary', 'deliverable', 'milestone']);

const parcoursStepSchema = z.object({
  order: z.number().int().positive(),
  type: stepType,
  ref: z.object({ kind: stepRefKind, id: nonEmpty }).strict(),
  label: nonEmpty,
  status: z.enum(['existant', 'a-produire']),
  keystone: z.boolean().optional(),
  prereqNote: nonEmpty.optional(),
  note: z.string().optional(),
}).strict();

const parcoursSchema = z.object({
  id: nonEmpty,
  slug,
  family: parcoursFamily,
  roadmap: parcoursRoadmap,
  title: nonEmpty,
  hook: nonEmpty,
  kanji: z.string().optional(),
  accent: z.string().optional(),
  goal: nonEmpty,
  forWhom: z.array(nonEmpty),
  perspective: perspective.optional(),
  level,
  entryLevel: level,
  time: z.union([
    z.object({
      source: z.literal('declared').optional(),
      coreHours: z.number().nonnegative(),
      withBonusHours: z.number().nonnegative().optional(),
      sessions: z.number().int().positive().optional(),
      cadence: nonEmpty.optional(),
    }).strict(),
    z.object({
      source: z.literal('derived'),
      sessions: z.number().int().positive().optional(),
      cadence: nonEmpty.optional(),
    }).strict(),
  ]),
  timeFit: z.array(timeBudget),
  prerequisites: z.array(nonEmpty).optional(),
  recommendedForProfiles: idList,
  milestone: z.object({
    type: z.string(),
    label: nonEmpty,
    description: nonEmpty,
    evaluation: z.array(z.enum(['auto', 'peer', 'practitioner'])).optional(),
    rubricId: z.string().optional(),
    modelAnswerId: z.string().optional(),
  }).strict().optional(),
  entryDiagnosticId: nonEmpty.optional(),
  steps: z.array(parcoursStepSchema).min(1),
  outcomes: z.array(nonEmpty),
}).strict();

const parcoursRelationSchema = z.object({
  sourceId: nonEmpty,
  targetId: nonEmpty,
  kind: z.enum(['peer', 'progression']),
  evidence: z.array(z.enum([
    'explicit-prerequisite',
    'profile-route',
    'shared-content',
    'learning-outcomes',
    'maintained-reference',
  ])).min(1),
  rationale: nonEmpty,
}).strict();

const domainSchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  description: nonEmpty,
}).strict();

const courseRequirementSchema = z.object({
  id: nonEmpty,
  courseId: nonEmpty,
  title: nonEmpty,
  summary: nonEmpty,
  lessonIds: idList.min(1),
}).strict();

const axisCourseRequirementSchema = courseRequirementSchema.extend({
  assessmentVariantId: nonEmpty,
});

const certificationOptionSchema = z.object({
  id: nonEmpty,
  label: nonEmpty,
  certificateLabel: nonEmpty,
  description: nonEmpty,
  requirement: axisCourseRequirementSchema,
}).strict();

const certificationAxisSchema = (axisId, optionIds) => z.object({
  id: z.literal(axisId),
  label: nonEmpty,
  description: nonEmpty,
  options: z.array(certificationOptionSchema.extend({ id: z.enum(optionIds) })).min(1),
}).strict().superRefine((axis, ctx) => {
  const actualIds = axis.options.map((option) => option.id);
  const missingIds = optionIds.filter((optionId) => !actualIds.includes(optionId));
  const unexpectedIds = actualIds.filter((optionId) => !optionIds.includes(optionId));
  if (missingIds.length || unexpectedIds.length || actualIds.length !== optionIds.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['options'],
      message: [
        `couverture exacte attendue : ${optionIds.join(', ')}`,
        missingIds.length ? `manquante(s) : ${missingIds.join(', ')}` : '',
        unexpectedIds.length ? `inattendue(s) : ${unexpectedIds.join(', ')}` : '',
      ].filter(Boolean).join(' ; '),
    });
  }
});

const rubricCriterionSchema = z.object({
  id: nonEmpty,
  label: nonEmpty,
  description: nonEmpty,
  maxScore: z.number().int().positive().max(100),
  critical: z.boolean(),
}).strict();

const finalAssessmentVariantSchema = z.object({
  id: nonEmpty,
  axis: z.enum(['fundStage', 'dealRole', 'specialty']),
  optionId: nonEmpty,
  caseAdaptation: nonEmpty,
  rubricCriteria: z.array(nonEmpty).min(1),
}).strict();

const certificationBaseSchema = z.object({
  id: nonEmpty,
  slug,
  domainId: nonEmpty,
  title: nonEmpty,
  shortTitle: nonEmpty,
  status: z.enum(['draft', 'published']),
  availability: z.enum(['in-construction', 'open', 'closed']),
  issuer: nonEmpty,
  targetRoles: z.array(nonEmpty).min(1),
  level,
  summary: nonEmpty,
  competencies: z.array(nonEmpty).min(1),
});

const knowledgeCertificationSchema = certificationBaseSchema.extend({
  certificateType: z.literal('knowledge'),
  coreRequirements: z.array(courseRequirementSchema).min(1),
  assessmentId: nonEmpty,
  capstoneDeliverableId: nonEmpty.optional(),
  candidateCharterId: nonEmpty,
  candidateCharterVersion: nonEmpty,
}).strict();

const professionalCertificationSchema = certificationBaseSchema.extend({
  certificateType: z.literal('professional'),
  prerequisiteCertificationId: nonEmpty.optional(),
  recommendedPreparation: z.array(courseRequirementSchema).min(1),
  axes: z.object({
    fundStage: certificationAxisSchema('fundStage', FUND_STAGE_OPTION_IDS),
    dealRole: certificationAxisSchema('dealRole', DEAL_ROLE_OPTION_IDS),
    specialty: certificationAxisSchema('specialty', SPECIALTY_OPTION_IDS),
  }).strict(),
  finalAssessment: z.object({
    id: nonEmpty,
    type: z.literal('case-and-oral-defense'),
    title: nonEmpty,
    description: nonEmpty,
    deliverables: z.array(nonEmpty).min(1),
    rubricId: nonEmpty,
    rubricCriteria: z.array(rubricCriterionSchema).min(1),
    optionVariants: z.array(finalAssessmentVariantSchema),
    passingScore: z.number().min(0).max(100),
    criticalCriteriaMustPass: z.boolean(),
    evaluatorTypes: z.array(z.enum(['expert', 'jury'])).min(1),
  }).strict(),
  eligibilityConditions: z.array(nonEmpty).min(1),
  criticalErrors: z.array(nonEmpty).min(1),
}).strict();

const certificationSchema = z.discriminatedUnion('certificateType', [
  knowledgeCertificationSchema,
  professionalCertificationSchema,
]);

const certificationLevelSchema = z.object({
  id: nonEmpty,
  order: z.number().int().positive(),
  title: nonEmpty,
  category: z.enum(['knowledge', 'professional']),
  status: z.enum(['available', 'in-construction', 'future']),
  promise: nonEmpty,
  audience: nonEmpty,
  scope: z.array(nonEmpty).min(1),
  exclusions: z.array(nonEmpty).min(1),
  certificationId: nonEmpty.optional(),
}).strict();

const charterPrincipleIds = [
  'authenticity',
  'sources',
  'artificial-intelligence',
  'confidentiality',
  'conflicts-of-interest',
  'critical-errors',
  'local-data-responsibility',
];

const candidateCharterSchema = z.object({
  id: nonEmpty,
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version sémantique attendue'),
  status: z.enum(['active', 'archived']),
  title: nonEmpty,
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'date attendue au format ISO (YYYY-MM-DD)'),
  introduction: nonEmpty,
  principles: z.array(z.object({
    id: z.enum(charterPrincipleIds),
    title: nonEmpty,
    statement: nonEmpty,
  }).strict()).min(1),
  acceptanceStatement: nonEmpty,
  futureSessionAnnex: z.object({
    status: z.literal('inactive'),
    title: nonEmpty,
    provisions: z.array(nonEmpty).min(1),
  }).strict(),
}).strict();

const assessmentQuestionSchema = z.object({
  id: nonEmpty,
  competencyId: nonEmpty,
  prompt: nonEmpty,
  options: z.array(z.object({ id: nonEmpty, label: nonEmpty }).strict()).min(2),
  correctOptionId: nonEmpty,
  points: z.number().int().positive(),
  explanation: nonEmpty,
}).strict();

const numericAssessmentQuestionSchema = z.object({
  id: nonEmpty,
  prompt: nonEmpty,
  unit: nonEmpty,
  expectedValue: z.number(),
  tolerance: z.object({
    mode: z.enum(['absolute', 'relative']),
    value: z.number().positive(),
  }).strict(),
  points: z.number().int().positive(),
  correction: nonEmpty,
}).strict();

const assessmentMiniCaseSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  scenario: nonEmpty,
  instructions: nonEmpty,
  points: z.number().int().positive(),
  questions: z.array(numericAssessmentQuestionSchema).min(1),
}).strict();

const certificationAssessmentSchema = z.object({
  id: nonEmpty,
  status: z.enum(['draft', 'published']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version sémantique attendue'),
  certificationId: nonEmpty,
  candidateCharterId: nonEmpty,
  candidateCharterVersion: nonEmpty,
  title: nonEmpty,
  description: nonEmpty,
  competencies: z.array(z.object({ id: nonEmpty, label: nonEmpty }).strict()).min(1),
  exam: z.object({
    title: nonEmpty,
    instructions: nonEmpty,
    points: z.number().int().positive(),
    questionCount: z.number().int().positive(),
    questionsPerCompetency: z.number().int().positive(),
    shuffleQuestions: z.literal(true),
    consultationPolicy: z.literal('not-recommended'),
    questions: z.array(assessmentQuestionSchema).min(1),
  }).strict(),
  miniCases: z.array(assessmentMiniCaseSchema).min(1),
  passingRules: z.object({
    totalMin: z.number().nonnegative(),
    examMin: z.number().nonnegative(),
    caseMinEach: z.number().nonnegative(),
  }).strict(),
  resourcePolicy: z.object({ exam: nonEmpty, miniCases: nonEmpty }).strict(),
  attemptPolicy: z.object({
    unlimited: z.literal(true),
    timer: z.literal(false),
    technicalLocking: z.literal(false),
    persistActiveAttempt: z.literal(true),
    submittedHistoryLimit: z.number().int().positive(),
    preserveBestResult: z.literal(true),
    shuffleOncePerAttempt: z.literal(true),
  }).strict(),
  toolDeclaration: z.object({
    required: z.literal(true),
    prompt: nonEmpty,
    choices: z.array(nonEmpty).min(1),
    allowFreeText: z.literal(true),
  }).strict(),
}).strict();

const parcoursLessonsDocSchema = z.object({
  _doc: z.string().optional(),
  register: z.string().optional(),
  parcoursId: nonEmpty,
  courseId: nonEmpty,
  lessons: z.array(lessonSchema),
}).strict();

const profileParcoursSchema = z.object({
  _doc: z.string().optional(),
  byProfile: z.record(z.string(), z.object({
    primary: nonEmpty,
    then: idList,
    express: z.string().optional(),
    note: z.string().optional(),
  }).strict()),
  byArchetype: z.record(z.string(), z.object({
    label: nonEmpty,
    bundle: idList,
  }).strict()),
  timeCalibration: z.record(timeBudget, z.object({
    show: z.array(stepType),
    cadence: nonEmpty,
  }).strict()),
}).strict();

const glossarySchema = z.object({
  id: nonEmpty,
  term: nonEmpty,
  slug,
  aliases: z.array(nonEmpty).optional(),
  latin: z.string().optional(),
  category: z.string(),
  short: z.string(),
  definition: nonEmpty,
  example: z.string().optional(),
  link: httpsUrl.optional(),
  seeAlso: idList,
  relatedLessonIds: idList,
}).strict();

const caseTableSchema = z.object({
  caption: nonEmpty,
  columns: z.array(nonEmpty).min(1),
  rows: z.array(z.array(z.union([z.string(), z.number(), z.null()]))),
  notes: z.array(nonEmpty).optional(),
}).strict();

const caseDocumentSchema = z.object({
  id: nonEmpty,
  kind: nonEmpty,
  title: nonEmpty,
  summary: z.string().optional(),
  body: z.string().optional(),
  tables: z.array(caseTableSchema).optional(),
}).strict();

const caseNumericScenarioSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  summary: nonEmpty,
  fullyDilutedSharesBefore: z.number().int().positive(),
  founderSharesBefore: z.number().int().positive(),
  allocatedOptionSharesBefore: z.number().int().nonnegative(),
  unallocatedOptionPoolSharesBefore: z.number().int().nonnegative(),
  seedInvestorSharesBefore: z.number().int().nonnegative(),
  convertibleShareEquivalents: z.number().int().nonnegative(),
  shareClasses: z.array(nonEmpty).min(1),
  conventions: z.array(nonEmpty).min(3),
  exitValuesM: z.array(z.number().positive()).min(1),
  offers: z.array(z.object({
    id: nonEmpty,
    label: nonEmpty,
    primaryInvestmentM: z.number().positive(),
    secondaryM: z.number().nonnegative(),
    preMoneyM: z.number().positive(),
    poolTargetPct: z.number().positive().max(80),
    poolTiming: z.enum(['pre-money', 'post-money']),
    convertibleTreatment: nonEmpty,
    shareClass: nonEmpty,
    liquidationPreference: z.object({
      multiple: z.number().positive(),
      participating: z.boolean(),
      seniority: nonEmpty,
    }).strict(),
    governance: nonEmpty,
  }).strict()).min(2),
}).strict().superRefine((scenario, ctx) => {
  const componentTotal = scenario.founderSharesBefore
    + scenario.allocatedOptionSharesBefore
    + scenario.unallocatedOptionPoolSharesBefore
    + scenario.seedInvestorSharesBefore
    + scenario.convertibleShareEquivalents;
  if (componentTotal !== scenario.fullyDilutedSharesBefore) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['fullyDilutedSharesBefore'],
      message: `les composantes pré-tour doivent totaliser le fully diluted : fondateurs + options attribuées + réserve non attribuée + seed + convertibles = ${componentTotal}, attendu ${scenario.fullyDilutedSharesBefore}`,
    });
  }
});

const caseStudySchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  subtitle: z.string(),
  kind: z.string(),
  company: z.string(),
  year: z.number().int(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  tags: z.array(z.string()),
  glossaryRefs: idList,
  learningRole: z.enum(['standard', 'learner-dossier', 'transfer']).optional(),
  estimatedWorkMinutes: z.number().int().positive().optional(),
  numericScenario: caseNumericScenarioSchema.optional(),
  documents: z.array(caseDocumentSchema).optional(),
  decisionQuestions: z.array(nonEmpty).optional(),
  downloads: z.array(z.object({
    label: nonEmpty,
    href: httpsOrInternalUrl,
    format: nonEmpty.optional(),
  }).strict()).optional(),
  sections: z.array(z.object({ heading: nonEmpty, body: nonEmpty })).min(1),
  takeaways: z.array(z.string()),
}).strict();

const diagnosticSchema = z.object({
  id: nonEmpty,
  slug,
  parcoursId: nonEmpty,
  title: nonEmpty,
  summary: nonEmpty,
  optional: z.literal(true),
  items: z.array(z.object({
    id: nonEmpty,
    topic: nonEmpty,
    prompt: nonEmpty,
    options: z.array(z.object({
      id: nonEmpty,
      label: nonEmpty,
      result: z.enum(['a-revoir', 'acquis-a-confirmer', 'point-maitrise']),
      feedback: nonEmpty,
    }).strict()).min(2),
    resourceRefs: z.array(z.object({
      kind: z.enum(['lesson', 'deliverable']),
      id: nonEmpty,
      label: nonEmpty,
    }).strict()).min(1),
  }).strict()).length(5),
}).strict();

const caseCorrectionSchema = z.object({
  id: nonEmpty,
  sourceCaseId: nonEmpty,
  revealAfterDeliverableId: nonEmpty,
  title: nonEmpty,
  subtitle: z.string(),
  readMin: z.number().int().positive(),
  summary: nonEmpty,
  sections: z.array(z.object({ heading: nonEmpty, body: nonEmpty }).strict()).min(1),
  decisionBranches: z.array(z.object({
    title: nonEmpty,
    decision: nonEmpty,
    assumptions: z.array(nonEmpty).min(1),
    tradeoffs: z.array(nonEmpty).min(1),
    evidenceLimits: z.array(nonEmpty).min(1),
    informationNeeded: z.array(nonEmpty).min(1),
  }).strict()).min(3),
  takeaways: z.array(nonEmpty).min(1),
}).strict();

// A « livrable » is the hands-on end of a parcours milestone: a brief + a
// template + a self-assessment rubric + a pointer to an existing intelligence
// artifact used as the worked model.
const deliverableCriterionSchema = z.union([
  z.object({ criterion: nonEmpty, check: nonEmpty }).strict(),
  z.object({
    id: nonEmpty,
    criterion: nonEmpty,
    description: nonEmpty,
    expectedEvidence: nonEmpty,
    commonError: nonEmpty,
    revisionQuestion: nonEmpty,
    componentIds: idList.optional(),
  }).strict(),
]);

const deliverableSchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  kicker: z.string().optional(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  brief: nonEmpty,
  template: z.array(z.object({ heading: nonEmpty, prompt: nonEmpty }).strict()).min(1),
  rubric: z.array(deliverableCriterionSchema).min(1),
  model: z.object({
    kind: z.enum(['ecosystem', 'case', 'memo', 'lesson']),
    id: nonEmpty,
    note: z.string(),
  }).strict().optional(),
  activityKind: z.enum(['cumulative-exercise', 'capstone', 'worksheet', 'workshop']).optional(),
  estimatedWorkMinutes: z.number().int().positive().optional(),
  externalReviewMinutes: z.number().int().positive().optional(),
  relatedCourseIds: idList.optional(),
  caseStudyId: nonEmpty.optional(),
  correctionId: nonEmpty.optional(),
  components: z.array(z.object({
    id: nonEmpty,
    title: nonEmpty,
    requirements: z.array(nonEmpty).min(1),
    requiredInBudgets: z.array(z.enum(['low', 'medium', 'high'])).min(1).optional(),
  }).strict()).optional(),
  rubricLevels: z.array(z.object({
    id: z.enum(['insuffisant', 'acceptable', 'solide', 'non-observable']),
    label: nonEmpty,
    description: nonEmpty,
  }).strict()).optional(),
  evaluation: z.array(z.enum(['auto', 'peer', 'practitioner'])).optional(),
  resources: z.array(z.object({
    label: nonEmpty,
    href: httpsOrInternalUrl,
    format: nonEmpty,
  }).strict()).optional(),
  roleCards: z.array(z.object({
    id: nonEmpty,
    title: nonEmpty,
    mandate: nonEmpty,
    questions: z.array(nonEmpty).min(1),
  }).strict()).optional(),
  journal: z.object({
    sourceType: z.literal('deliverable'),
    predictionMin: z.number().int().positive(),
    predictionMax: z.number().int().positive(),
  }).strict().optional(),
  relatedLessonIds: idList.optional(),
  glossaryRefs: idList.optional(),
  tags: z.array(z.string()).optional(),
}).strict().superRefine((deliverable, ctx) => {
  const components = deliverable.components ?? [];
  const componentIds = new Set(components.map((component) => component.id));
  const criteriaWithComponents = deliverable.rubric.filter((criterion) => Array.isArray(criterion.componentIds));

  for (const [criterionIndex, criterion] of deliverable.rubric.entries()) {
    for (const componentId of criterion.componentIds ?? []) {
      if (!componentIds.has(componentId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rubric', criterionIndex, 'componentIds'],
          message: `composant introuvable pour le critère "${criterion.id ?? criterion.criterion}" : ${componentId}`,
        });
      }
    }
  }

  if (criteriaWithComponents.length > 0) {
    for (const [componentIndex, component] of components.entries()) {
      const covered = criteriaWithComponents.some((criterion) => criterion.componentIds.includes(component.id));
      if (!covered) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['components', componentIndex, 'id'],
          message: `aucun critère rattaché au composant "${component.id}"`,
        });
      }
    }
  }
});

const blogSchema = z.object({
  id: nonEmpty,
  slug,
  status: z.enum(['draft', 'published']),
  title: nonEmpty,
  subtitle: z.string(),
  author: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'date attendue au format ISO (YYYY-MM-DD)'),
  readMin: z.number().nonnegative(),
  category: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  body: nonEmpty,
  books: z.array(z.object({
    title: nonEmpty,
    author: nonEmpty,
    year: z.number().int().optional(),
  }).strict()).optional(),
  glossaryRefs: idList.optional(),
}).strict();

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'date attendue au format ISO (YYYY-MM-DD)');

// Figures attachées aux sections d'un dossier — graphiques de données ou schémas
// conceptuels, rendus en SVG. Union discriminée par `kind` (cf. EcosystemFigure).
const figureRating = z.enum(['none', 'low', 'mid', 'high']);
const ecosystemFigure = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('bars'),
    title: nonEmpty,
    caption: z.string().optional(),
    unit: z.string().optional(),
    source: z.string().optional(),
    bars: z.array(z.object({
      label: nonEmpty,
      value: z.number(),
      valueLabel: z.string().optional(),
      highlight: z.boolean().optional(),
    }).strict()).min(1),
  }).strict(),
  z.object({
    kind: z.literal('line'),
    title: nonEmpty,
    caption: z.string().optional(),
    unit: z.string().optional(),
    source: z.string().optional(),
    points: z.array(z.object({
      x: nonEmpty,
      y: z.number(),
      annotation: z.string().optional(),
    }).strict()).min(2),
  }).strict(),
  z.object({
    kind: z.literal('matrix'),
    title: nonEmpty,
    caption: z.string().optional(),
    source: z.string().optional(),
    columns: z.array(nonEmpty).min(2),
    rows: z.array(z.object({
      label: nonEmpty,
      cells: z.array(z.object({ rating: figureRating, note: z.string().optional() }).strict()).min(1),
    }).strict()).min(1),
  }).strict(),
  z.object({
    kind: z.literal('quadrant'),
    title: nonEmpty,
    caption: z.string().optional(),
    source: z.string().optional(),
    xAxis: z.tuple([nonEmpty, nonEmpty]),
    yAxis: z.tuple([nonEmpty, nonEmpty]),
    items: z.array(z.object({
      label: nonEmpty,
      x: z.number(),
      y: z.number(),
      highlight: z.boolean().optional(),
    }).strict()).min(1),
  }).strict(),
  z.object({
    kind: z.literal('taxonomy'),
    title: nonEmpty,
    caption: z.string().optional(),
    source: z.string().optional(),
    root: nonEmpty,
    branches: z.array(z.object({
      label: nonEmpty,
      note: z.string().optional(),
      items: z.array(nonEmpty),
      highlight: z.boolean().optional(),
    }).strict()).min(1),
  }).strict(),
]);

const ecosystemSchema = z.object({
  id: nonEmpty,
  slug,
  name: nonEmpty,
  title: nonEmpty,
  subtitle: z.string(),
  kind: z.enum(['geographie', 'secteur', 'these']),
  accent: z.string(),
  author: z.string(),
  createdAt: isoDate,
  updatedAt: isoDate,
  verifiedAt: isoDate.optional(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  tags: z.array(z.string()),
  // Hierarchy: `parentId` absent ⇒ dossier-racine ; `order` range les frères.
  parentId: z.string().optional(),
  order: z.number().int().optional(),
  // `these` requise sur une racine, facultative en sous-dossier (cf. refine ci-dessous).
  these: nonEmpty.optional(),
  sections: z.array(z.object({
    heading: nonEmpty,
    body: nonEmpty,
    figures: z.array(ecosystemFigure).optional(),
  }).strict()).min(1),
  convictions: z.array(z.object({
    statement: nonEmpty,
    horizon: z.string().optional(),
    strength: z.enum(['exploratoire', 'moyenne', 'forte']),
    rationale: z.string().optional(),
  }).strict()).optional(),
  signals: z.array(z.object({
    label: nonEmpty,
    direction: z.enum(['haussier', 'baissier', 'incertain']),
    note: z.string(),
  }).strict()).optional(),
  players: z.array(z.object({
    name: nonEmpty,
    role: z.string(),
    note: z.string(),
  }).strict()).optional(),
  glossaryRefs: idList,
  sources: z.array(z.object({ label: nonEmpty, url: httpsUrl }).strict()).optional(),
}).strict().refine((e) => e.parentId || (e.these && e.these.trim().length > 0), {
  message: 'un dossier-racine (sans parentId) doit porter une thèse (these)',
  path: ['these'],
});

const simulatorSchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  subtitle: z.string(),
  category: z.string(),
  accent: z.string(),
  description: z.string(),
  estimatedWorkMinutes: z.number().int().positive().optional(),
  relatedLessonIds: idList,
  glossaryRefs: idList,
}).strict();

// Memo library annotée — memos d'investissement publiés, annotés bloc par bloc.
const memoBlockSchema = z.object({
  excerpt: nonEmpty,
  isParaphrase: z.boolean(),
  note: nonEmpty,
  tag: z.string(),
}).strict();

const memoSchema = z.object({
  id: nonEmpty,
  slug,
  company: nonEmpty,
  title: nonEmpty,
  fund: nonEmpty,
  author: z.string(),
  // Date éditoriale en prose (« Septembre 2005 »), pas une date ISO.
  date: nonEmpty,
  stage: z.string(),
  amount: z.string(),
  outcome: nonEmpty,
  whyItMatters: nonEmpty,
  sourceUrl: httpsUrl,
  sourceNote: z.string(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  context: nonEmpty,
  sections: z.array(z.object({ heading: nonEmpty, blocks: z.array(memoBlockSchema).min(1) }).strict()).min(1),
  lessons: z.array(nonEmpty),
  glossaryRefs: idList,
  relatedAntiPortfolioIds: idList,
  tags: z.array(z.string()),
}).strict();

// Anti-portfolio — motifs de refus récurrents + entrées « pass » documentées.
const antiPortfolioPatternSchema = z.object({
  id: nonEmpty,
  label: nonEmpty,
  glyph: z.string(),
  accent: z.string(),
  description: nonEmpty,
  antidote: nonEmpty,
}).strict();

const antiPortfolioEntrySchema = z.object({
  id: nonEmpty,
  slug,
  company: nonEmpty,
  title: nonEmpty,
  subtitle: z.string(),
  passes: z.array(
    // `partner` est optionnel : certains passes publics ne sont attribués
    // qu'au fonds, pas à un partner nommé.
    z.object({ fund: nonEmpty, partner: nonEmpty.optional(), year: z.number().int(), stage: z.string() }).strict(),
  ).min(1),
  sector: z.string(),
  patternIds: idList,
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  quote: z.object({ text: nonEmpty, author: z.string(), source: z.string() }).strict().optional(),
  knownAtTheTime: z.array(z.object({ date: nonEmpty, fact: nonEmpty }).strict()).min(1),
  statedReason: nonEmpty,
  reasonIsPublic: z.boolean(),
  missedSignal: nonEmpty,
  steelman: nonEmpty,
  outcome: nonEmpty,
  costEstimate: z.string().optional(),
  takeaways: z.array(nonEmpty),
  glossaryRefs: idList,
  relatedMemoIds: idList,
  sources: z.array(z.object({ label: nonEmpty, url: httpsUrl }).strict()).min(1),
}).strict();

const antiPortfolioSchema = z.object({
  patterns: z.array(antiPortfolioPatternSchema).min(1),
  entries: z.array(antiPortfolioEntrySchema).min(1),
}).strict();

// Ikigai — looser than the content collections, but still structurally checked.
const dayItem = z.object({ time: z.string(), text: z.string() });
const reflectionQ = z.object({ n: z.string(), q: nonEmpty, hint: z.string() });
const ikigaiSchema = z.object({
  dimensions: z.array(z.object({
    id: nonEmpty, label: nonEmpty, kanji: z.string(), accent: z.string(),
    itemsDecouverte: z.array(z.string()).optional(),
    items: z.array(z.string()),
  })).min(1),
  intersections: z.array(z.object({
    id: nonEmpty, label: nonEmpty, subtitle: z.string(), negative: z.string(),
    exampleDecouverte: z.string().optional(), example: z.string(), warning: z.string(),
  })),
  presqueIkigai: z.array(z.object({
    id: nonEmpty, name: nonEmpty, missingDim: z.string(), formula: z.string(), kanji: z.string(),
    descriptionDecouverte: z.string().optional(), description: z.string(),
    trapDecouverte: z.string().optional(), trap: z.string(),
  })),
  profiles: z.array(z.object({
    id: nonEmpty, name: nonEmpty, tag: z.string(), kanji: z.string(), accent: z.string(),
    description: z.string(), focus: z.array(z.string()),
    signals: z.array(z.string()),
  })).min(1),
  questions: z.array(z.object({
    n: z.string(), q: nonEmpty, hint: z.string(),
    options: z.array(z.object({ text: nonEmpty, points: z.record(z.string(), z.number()) })).min(2),
  })),
  archetypes: z.array(z.object({
    id: nonEmpty, name: nonEmpty, tag: z.string(), kanji: z.string(), accent: z.string(),
    positioningDecouverte: z.string(), positioning: z.string(),
    dayDecouverte: z.array(dayItem), day: z.array(dayItem),
    valueDecouverte: z.string(), value: z.string(),
    signalsDecouverte: z.array(z.string()), signals: z.array(z.string()),
    metrics: z.array(z.string()),
    profileIds: idList,
  })),
  reflection: z.object({
    decouverte: z.array(reflectionQ),
    avance: z.array(reflectionQ),
  }),
  myths: z.array(z.object({
    id: nonEmpty,
    title: nonEmpty,
    myth: nonEmpty,
    reality: nonEmpty,
    fundExample: z.string().optional(),
  })).optional(),
}).strict();

// ── Load + shape-validate ────────────────────────────────────────────────────
const domains = check('domains.json', z.array(domainSchema), readJson('domains.json')) ?? [];
const certifications = check('certifications.json', z.array(certificationSchema), readJson('certifications.json')) ?? [];
const certificationLevels = check(
  'certificationLevels.json',
  z.array(certificationLevelSchema),
  readJson('certificationLevels.json'),
) ?? [];
const candidateCharters = check(
  'candidateCharters.json',
  z.array(candidateCharterSchema),
  readJson('candidateCharters.json'),
) ?? [];
const certificationAssessments = check(
  'certificationAssessments.json',
  z.array(certificationAssessmentSchema),
  readJson('certificationAssessments.json'),
) ?? [];
const parcours = check('parcours.json', z.array(parcoursSchema), readJson('parcours.json')) ?? [];
const parcoursRelations = check(
  'parcoursRelations.json',
  z.array(parcoursRelationSchema),
  readJson('parcoursRelations.json'),
) ?? [];
const profileParcours = check('profileParcours.json', profileParcoursSchema, readJson('profileParcours.json'));
const courses = check('courses.json', z.array(courseSchema), readJson('courses.json')) ?? [];
const lessons = check('lessons.json', z.array(lessonSchema), readJson('lessons.json')) ?? [];
const glossary = check('glossary.json', z.array(glossarySchema), readJson('glossary.json')) ?? [];
const canonicalGlossaryValue = readJson('sources/canonical-glossary.json');
const canonicalGlossary = Array.isArray(canonicalGlossaryValue) ? canonicalGlossaryValue : [];
if (canonicalGlossaryValue !== undefined && !Array.isArray(canonicalGlossaryValue)) {
  err('sources/canonical-glossary.json — un tableau est attendu');
}
const cases = check('caseStudies.json', z.array(caseStudySchema), readJson('caseStudies.json')) ?? [];
const diagnostics = check('diagnostics.json', z.array(diagnosticSchema), readJson('diagnostics.json')) ?? [];
const caseCorrections = check(
  'caseCorrections.json',
  z.array(caseCorrectionSchema),
  readJson('caseCorrections.json'),
) ?? [];
const deliverables = check('deliverables.json', z.array(deliverableSchema), readJson('deliverables.json')) ?? [];
const blogFiles = listJsonFiles('blog');
const blogDocs = blogFiles.flatMap((file) => {
  const doc = readJson(`blog/${file}`);
  return doc === undefined ? [] : [{ file, doc }];
});
const blog = check('blog/*.json', z.array(blogSchema), blogDocs.map(({ doc }) => doc)) ?? [];
const ecosystems = check('ecosystems.json', z.array(ecosystemSchema), readJson('ecosystems.json')) ?? [];
const simulators = check('simulators.json', z.array(simulatorSchema), readJson('simulators.json')) ?? [];
const memos = check('memos.json', z.array(memoSchema), readJson('memos.json')) ?? [];
const antiPortfolio = check('antiPortfolio.json', antiPortfolioSchema, readJson('antiPortfolio.json'));
const antiPortfolioPatterns = antiPortfolio?.patterns ?? [];
const antiPortfolioEntries = antiPortfolio?.entries ?? [];
const ikigai = check('ikigai.json', ikigaiSchema, readJson('ikigai.json'));

const parcoursLessonDocs = [];
try {
  for (const file of readdirSync(join(dataDir, 'parcours')).filter((f) => f.endsWith('.lessons.json')).sort()) {
    const doc = check(`parcours/${file}`, parcoursLessonsDocSchema, readJson(`parcours/${file}`));
    if (doc) parcoursLessonDocs.push({ file, ...doc });
  }
} catch (e) {
  err(`parcours/*.lessons.json — dossier illisible : ${e.message}`);
}
const parcoursLessons = parcoursLessonDocs.flatMap((doc) => doc.lessons);
const allLessons = [...lessons, ...parcoursLessons];

for (const message of validateCanonicalGlossaryPublication(canonicalGlossary, glossary)) {
  err(`sources/canonical-glossary.json — ${message}`);
}

for (const message of findEditorialToneErrors(courses, {
  collection: 'courses',
})) {
  err(message);
}
for (const message of findEditorialToneErrors(parcours, {
  collection: 'parcours',
})) {
  err(message);
}
for (const message of findEditorialToneErrors(parcoursRelations, {
  collection: 'parcoursRelations',
})) {
  err(message);
}
for (const message of findEditorialToneErrors(allLessons, {
  collection: 'lessons',
})) {
  err(message);
}

const markdownCollections = [
  ['parcours', parcours],
  ['parcoursRelations', parcoursRelations],
  ['courses', courses],
  ['lessons', allLessons],
  ['blog', blog],
  ['caseStudies', cases],
  ['caseCorrections', caseCorrections],
  ['diagnostics', diagnostics],
  ['deliverables', deliverables],
  ['ecosystems', ecosystems],
  ['memos', memos],
  ['antiPortfolio', antiPortfolioEntries],
  ['certifications', certifications],
];
for (const [collection, records] of markdownCollections) {
  for (const message of findMarkdownLinkErrors(records, { collection })) {
    err(message);
  }
}

for (const message of validateParcoursRelations(parcoursRelations, parcours)) {
  err(message);
}

// ── Uniqueness ───────────────────────────────────────────────────────────────
assertUnique('domains.json', domains, 'id');
assertUnique('domains.json', domains, 'slug');
assertUnique('certifications.json', certifications, 'id');
assertUnique('certifications.json', certifications, 'slug');
const professionalCertifications = certifications.filter((certification) => certification.certificateType === 'professional');
assertUnique(
  'certifications.json (evaluations finales)',
  professionalCertifications.map((certification) => certification.finalAssessment),
  'id',
);
assertUnique(
  'certifications.json (rubriques finales)',
  professionalCertifications.map((certification) => certification.finalAssessment),
  'rubricId',
);
assertUnique(
  'certifications.json (variantes finales)',
  professionalCertifications.flatMap((certification) => certification.finalAssessment.optionVariants),
  'id',
);
assertUnique('certificationLevels.json', certificationLevels, 'id');
assertUnique('certificationLevels.json', certificationLevels, 'order');
assertUnique(
  'candidateCharters.json',
  candidateCharters.map((charter) => ({ key: `${charter.id}@${charter.version}` })),
  'key',
);
assertUnique('certificationAssessments.json', certificationAssessments, 'id');
assertUnique('parcours.json', parcours, 'id');
assertUnique('parcours.json', parcours, 'slug');
assertUnique('courses.json', courses, 'id');
assertUnique('courses.json', courses, 'slug');
assertUnique('lessons.json', lessons, 'id');
assertUnique('lessons.json', lessons, 'slug');
assertUnique('parcours/*.lessons.json', parcoursLessons, 'id');
assertUnique('parcours/*.lessons.json', parcoursLessons, 'slug');
assertUnique('all lessons', allLessons, 'id');
assertUnique('all lessons', allLessons, 'slug');
assertUnique('glossary.json', glossary, 'id');
assertUnique('glossary.json', glossary, 'slug');
assertUnique('caseStudies.json', cases, 'id');
assertUnique('caseStudies.json', cases, 'slug');
assertUnique('diagnostics.json', diagnostics, 'id');
assertUnique('diagnostics.json', diagnostics, 'slug');
assertUnique('caseCorrections.json', caseCorrections, 'id');
assertUnique('deliverables.json', deliverables, 'id');
assertUnique('deliverables.json', deliverables, 'slug');
assertUnique('blog/*.json', blog, 'id');
assertUnique('blog/*.json', blog, 'slug');
assertUnique('ecosystems.json', ecosystems, 'id');
assertUnique('ecosystems.json', ecosystems, 'slug');
assertUnique('simulators.json', simulators, 'id');
assertUnique('simulators.json', simulators, 'slug');
assertUnique('memos.json', memos, 'id');
assertUnique('memos.json', memos, 'slug');
assertUnique('antiPortfolio.json (patterns)', antiPortfolioPatterns, 'id');
assertUnique('antiPortfolio.json (entries)', antiPortfolioEntries, 'id');
assertUnique('antiPortfolio.json (entries)', antiPortfolioEntries, 'slug');
if (ikigai) {
  assertUnique('ikigai.json (profiles)', ikigai.profiles, 'id');
  assertUnique('ikigai.json (archetypes)', ikigai.archetypes, 'id');
}

// ── Reference sets ───────────────────────────────────────────────────────────
const domainIds = new Set(domains.map((domain) => domain.id));
const parcoursIds = new Set(parcours.map((p) => p.id));
const courseIds = new Set(courses.map((c) => c.id));
const lessonIds = new Set(allLessons.map((l) => l.id));
const certificationAssessmentIds = new Set(certificationAssessments.map((assessment) => assessment.id));
const deliverableIds = new Set(deliverables.map((deliverable) => deliverable.id));
const diagnosticIds = new Set(diagnostics.map((diagnostic) => diagnostic.id));
const correctionIds = new Set(caseCorrections.map((correction) => correction.id));
const candidateCharterKeys = new Set(
  candidateCharters.map((charter) => `${charter.id}@${charter.version}`),
);
const glossarySlugs = new Set(glossary.map((g) => g.slug));
const glossaryIds = new Set(glossary.map((g) => g.id));
const caseIds = new Set(cases.map((c) => c.id));
const caseRefs = new Set([...caseIds, ...cases.map((c) => c.slug)]);
const simRefs = new Set([...simulators.map((s) => s.id), ...simulators.map((s) => s.slug)]);
const profileIds = new Set(ikigai ? ikigai.profiles.map((p) => p.id) : []);
const archetypeIds = new Set(ikigai ? ikigai.archetypes.map((a) => a.id) : []);

const isGlossary = (ref) => glossarySlugs.has(ref) || glossaryIds.has(ref);
const checkRefs = (label, refs, has, kind) => {
  for (const r of refs) if (!has(r)) err(`${label} — ${kind} introuvable : "${r}"`);
};

// ── Referential integrity ────────────────────────────────────────────────────
for (const c of courses) {
  checkRefs(`courses/${c.id}.lessonIds`, c.lessonIds, (r) => lessonIds.has(r), 'leçon');

  const declaredLessonIds = new Set(c.lessonIds);
  if (declaredLessonIds.size !== c.lessonIds.length)
    err(`courses/${c.id}.lessonIds — une leçon ne peut pas être déclarée plusieurs fois`);

  for (const lessonId of declaredLessonIds) {
    const lesson = allLessons.find((candidate) => candidate.id === lessonId);
    if (lesson && lesson.courseId !== c.id)
      err(`courses/${c.id}.lessonIds — "${lessonId}" appartient à "${lesson.courseId}"`);
  }

  const ownedLessons = allLessons.filter((lesson) => lesson.courseId === c.id);
  if (c.durationSource === 'lesson-read-minutes') {
    const derivedDuration = ownedLessons
      .filter((lesson) => lesson.status === 'published')
      .reduce((total, lesson) => total + lesson.readMin, 0);
    if (c.durationMin !== derivedDuration) {
      err(
        `courses/${c.id}.durationMin — ${c.durationMin} déclaré, ${derivedDuration} calculé depuis les leçons`,
      );
    }
  }
  for (const lesson of ownedLessons) {
    if (!declaredLessonIds.has(lesson.id))
      err(`courses/${c.id}.lessonIds — leçon réciproque manquante : "${lesson.id}"`);
  }

  const orders = ownedLessons.map((lesson) => lesson.order).sort((a, b) => a - b);
  const expectedOrders = ownedLessons.map((_, index) => index + 1);
  if (orders.some((order, index) => order !== expectedOrders[index]))
    err(`lessons/${c.id}.order — ordres attendus ${expectedOrders.join(', ')}, trouvés ${orders.join(', ')}`);
}
for (const doc of parcoursLessonDocs) {
  if (!parcoursIds.has(doc.parcoursId)) err(`parcours/${doc.file}.parcoursId — parcours introuvable : "${doc.parcoursId}"`);
  if (!courseIds.has(doc.courseId)) err(`parcours/${doc.file}.courseId — cours introuvable : "${doc.courseId}"`);
  for (const l of doc.lessons) {
    if (l.courseId !== doc.courseId) err(`parcours/${doc.file}/${l.id}.courseId — attendu "${doc.courseId}", trouvé "${l.courseId}"`);
  }
}
for (const l of allLessons) {
  if (!courseIds.has(l.courseId)) err(`lessons/${l.id}.courseId — cours introuvable : "${l.courseId}"`);
  checkRefs(`lessons/${l.id}.glossaryRefs`, l.glossaryRefs, isGlossary, 'terme de glossaire');
  checkRefs(`lessons/${l.id}.prerequisiteLessonIds`, l.prerequisiteLessonIds ?? [], (r) => lessonIds.has(r), 'leçon');
  if (l.practice) {
    if (!deliverableIds.has(l.practice.deliverableId)) {
      err(`lessons/${l.id}.practice.deliverableId — livrable introuvable : "${l.practice.deliverableId}"`);
    } else {
      const deliverable = deliverables.find((candidate) => candidate.id === l.practice.deliverableId);
      if (deliverable?.components?.length
        && !deliverable.components.some((component) => component.id === l.practice.sectionId)) {
        err(
          `lessons/${l.id}.practice.sectionId — composant "${l.practice.sectionId}" `
          + `introuvable dans "${l.practice.deliverableId}"`,
        );
      }
    }
  }
}

validateFurtherReadingReferences(allLessons, {
  collection: 'lessons',
  targetRecordsByKind: {
    lesson: allLessons,
    simulator: simulators,
    case: cases,
    glossary,
    course: courses,
    deliverable: deliverables,
  },
}).forEach(err);

for (const l of allLessons) {
  for (const fr of l.furtherReading ?? []) {
    if (fr.kind === 'external' && !safeEditorialUrl(fr.ref)) {
      err(`lessons/${l.id}.furtherReading — external introuvable par URL sûre : "${fr.ref}"`);
    }
  }
}
const validateCourseRequirement = (certificationId, requirement) => {
  if (!courseIds.has(requirement.courseId))
    err(`certifications/${certificationId}/${requirement.id}.courseId — cours introuvable : "${requirement.courseId}"`);
  checkRefs(
    `certifications/${certificationId}/${requirement.id}.lessonIds`,
    requirement.lessonIds,
    (ref) => lessonIds.has(ref),
    'leçon',
  );
  if (new Set(requirement.lessonIds).size !== requirement.lessonIds.length)
    err(`certifications/${certificationId}/${requirement.id}.lessonIds — une leçon ne peut pas être déclarée plusieurs fois`);

  const course = courses.find((candidate) => candidate.id === requirement.courseId);
  let previousPosition = -1;
  for (const lessonId of requirement.lessonIds) {
    const lesson = allLessons.find((candidate) => candidate.id === lessonId);
    if (lesson && lesson.courseId !== requirement.courseId)
      err(`certifications/${certificationId}/${requirement.id}.lessonIds — "${lessonId}" appartient à "${lesson.courseId}"`);

    if (!course) continue;
    const position = course.lessonIds.indexOf(lessonId);
    if (position < 0) {
      err(
        `certifications/${certificationId}/${requirement.id}.lessonIds — `
        + `"${lessonId}" n'appartient pas à la séquence canonique du cours "${course.id}"`,
      );
    } else if (position <= previousPosition) {
      err(
        `certifications/${certificationId}/${requirement.id}.lessonIds — `
        + `le sous-ensemble doit respecter l'ordre du cours "${course.id}"`,
      );
    }
    previousPosition = position;
  }
};

for (const certification of certifications) {
  if (!domainIds.has(certification.domainId))
    err(`certifications/${certification.id}.domainId — domaine introuvable : "${certification.domainId}"`);

  const baseRequirements = certification.certificateType === 'knowledge'
    ? certification.coreRequirements
    : certification.recommendedPreparation;
  const requirements = certification.certificateType === 'professional'
    ? [
      ...baseRequirements,
      ...Object.values(certification.axes).flatMap((axis) => axis.options.map((option) => option.requirement)),
    ]
    : baseRequirements;
  const requirementIds = new Set();
  for (const requirement of requirements) {
    if (requirementIds.has(requirement.id))
      err(`certifications/${certification.id}.requirements — id en double : "${requirement.id}"`);
    requirementIds.add(requirement.id);
    validateCourseRequirement(certification.id, requirement);
  }

  const baseLessonIds = baseRequirements.flatMap((requirement) => requirement.lessonIds);
  if (new Set(baseLessonIds).size !== baseLessonIds.length) {
    const field = certification.certificateType === 'knowledge' ? 'coreRequirements' : 'recommendedPreparation';
    err(`certifications/${certification.id}.${field} — une leçon ne peut appartenir à plusieurs blocs`);
  }

  if (certification.certificateType === 'knowledge') {
    if (certification.capstoneDeliverableId && !deliverableIds.has(certification.capstoneDeliverableId)) {
      err(
        `certifications/${certification.id}.capstoneDeliverableId — `
        + `livrable introuvable : "${certification.capstoneDeliverableId}"`,
      );
    }
    continue;
  }

  if (certification.prerequisiteCertificationId) {
    const prerequisite = certifications.find((candidate) => candidate.id === certification.prerequisiteCertificationId);
    if (!prerequisite) {
      err(
        `certifications/${certification.id}.prerequisiteCertificationId — `
        + `certification introuvable : "${certification.prerequisiteCertificationId}"`,
      );
    } else if (prerequisite.certificateType !== 'knowledge') {
      err(`certifications/${certification.id}.prerequisiteCertificationId — un certificat de connaissances est attendu`);
    }
  }

  const { finalAssessment } = certification;
  const rubricCriterionIds = finalAssessment.rubricCriteria.map((criterion) => criterion.id);
  if (new Set(rubricCriterionIds).size !== rubricCriterionIds.length) {
    err(`certifications/${certification.id}.finalAssessment.rubricCriteria — id de critère en double`);
  }
  const baseRubricWeight = finalAssessment.rubricCriteria.reduce(
    (total, criterion) => total + criterion.maxScore,
    0,
  );
  if (baseRubricWeight !== 100) {
    err(
      `certifications/${certification.id}.finalAssessment.rubricCriteria — `
      + `le total des maxScore doit être 100 (trouvé : ${baseRubricWeight})`,
    );
  }
  if (finalAssessment.criticalCriteriaMustPass
    && !finalAssessment.rubricCriteria.some((criterion) => criterion.critical)) {
    err(
      `certifications/${certification.id}.finalAssessment.rubricCriteria — `
      + 'au moins un critère doit être critique lorsque criticalCriteriaMustPass vaut true',
    );
  }

  for (const variant of finalAssessment.optionVariants) {
    if (new Set(variant.rubricCriteria).size !== variant.rubricCriteria.length) {
      err(
        `certifications/${certification.id}.finalAssessment.optionVariants/${variant.id}.rubricCriteria — `
        + 'un critère ne peut pas être déclaré plusieurs fois',
      );
    }
    const option = certification.axes[variant.axis].options.find(
      (candidate) => candidate.id === variant.optionId,
    );
    if (!option) {
      err(
        `certifications/${certification.id}.finalAssessment.optionVariants/${variant.id} — `
        + `option introuvable : ${variant.axis}.${variant.optionId}`,
      );
    } else if (option.requirement.assessmentVariantId !== variant.id) {
      err(
        `certifications/${certification.id}.finalAssessment.optionVariants/${variant.id} — `
        + `la variante n'est pas référencée par ${variant.axis}.${variant.optionId}.requirement.assessmentVariantId`,
      );
    }
  }

  for (const [axisId, axis] of Object.entries(certification.axes)) {
    const optionIds = axis.options.map((option) => option.id);
    if (new Set(optionIds).size !== optionIds.length)
      err(`certifications/${certification.id}.axes.${axisId}.options — id d'option en double`);

    const contextKey = {
      fundStage: 'fundStages',
      dealRole: 'dealRoles',
      specialty: 'sectors',
    }[axisId];
    for (const option of axis.options) {
      const matchingVariants = finalAssessment.optionVariants.filter(
        (variant) => variant.id === option.requirement.assessmentVariantId,
      );
      if (matchingVariants.length !== 1) {
        err(
          `certifications/${certification.id}.axes.${axisId}.${option.id}.requirement.assessmentVariantId — `
          + `exactement une variante finale attendue pour "${option.requirement.assessmentVariantId}" `
          + `(trouvé : ${matchingVariants.length})`,
        );
      } else if (matchingVariants[0].axis !== axisId || matchingVariants[0].optionId !== option.id) {
        err(
          `certifications/${certification.id}.axes.${axisId}.${option.id}.requirement.assessmentVariantId — `
          + `la variante "${matchingVariants[0].id}" doit cibler ${axisId}.${option.id}`,
        );
      }

      for (const lessonId of option.requirement.lessonIds) {
        const lesson = allLessons.find((candidate) => candidate.id === lessonId);
        if (!lesson) continue;
        if (!lesson.contexts?.[contextKey]?.includes(option.id)) {
          err(
            `certifications/${certification.id}.axes.${axisId}.${option.id} — `
            + `la leçon "${lesson.id}" doit déclarer contexts.${contextKey}: ["${option.id}"]`,
          );
        }
        if (lesson.optional !== true) {
          err(
            `certifications/${certification.id}.axes.${axisId}.${option.id} — `
            + `la leçon optionnelle "${lesson.id}" doit déclarer optional: true`,
          );
        }
      }
    }
  }
}

const expectedLevelIds = [
  'analyst',
  'associate-foundations',
  'associate',
  'senior-associate',
  'principal',
];
if (certificationLevels.length !== expectedLevelIds.length
  || certificationLevels.some((level, index) => level.id !== expectedLevelIds[index] || level.order !== index + 1)) {
  err(
    'certificationLevels.json — cinq niveaux attendus dans l’ordre : '
    + expectedLevelIds.join(', '),
  );
}
for (const levelPromise of certificationLevels) {
  if (!levelPromise.certificationId) continue;
  const certification = certifications.find((candidate) => candidate.id === levelPromise.certificationId);
  if (!certification) {
    err(
      `certificationLevels/${levelPromise.id}.certificationId — `
      + `certification introuvable : "${levelPromise.certificationId}"`,
    );
  } else if (certification.certificateType !== levelPromise.category) {
    err(
      `certificationLevels/${levelPromise.id}.category — `
      + `attendu "${certification.certificateType}" pour "${certification.id}"`,
    );
  }
}
for (const levelId of expectedLevelIds.slice(1)) {
  const levelPromise = certificationLevels.find((candidate) => candidate.id === levelId);
  if (!levelPromise) continue;
  if (levelPromise.status !== 'future')
    err(`certificationLevels/${levelId}.status — le niveau supérieur doit rester "future"`);
  if (levelPromise.certificationId)
    err(`certificationLevels/${levelId}.certificationId — aucun programme ne doit être engagé`);
}

for (const charter of candidateCharters) {
  const principleIds = charter.principles.map((principle) => principle.id);
  if (new Set(principleIds).size !== principleIds.length)
    err(`candidateCharters/${charter.id}@${charter.version}.principles — id en double`);
  const missingPrinciples = charterPrincipleIds.filter((principleId) => !principleIds.includes(principleId));
  const unexpectedPrinciples = principleIds.filter((principleId) => !charterPrincipleIds.includes(principleId));
  if (missingPrinciples.length || unexpectedPrinciples.length || principleIds.length !== charterPrincipleIds.length) {
    err(
      `candidateCharters/${charter.id}@${charter.version}.principles — couverture exacte attendue : `
      + charterPrincipleIds.join(', '),
    );
  }
}
if (!candidateCharters.some((charter) => charter.status === 'active'))
  err('candidateCharters.json — au moins une version active est requise');

for (const assessment of certificationAssessments) {
  const certification = certifications.find((candidate) => candidate.id === assessment.certificationId);
  if (!certification) {
    err(
      `certificationAssessments/${assessment.id}.certificationId — `
      + `certification introuvable : "${assessment.certificationId}"`,
    );
  } else if (certification.certificateType !== 'knowledge') {
    err(`certificationAssessments/${assessment.id}.certificationId — un certificat de connaissances est attendu`);
  } else {
    if (certification.assessmentId !== assessment.id) {
      err(
        `certificationAssessments/${assessment.id} — `
        + `l'évaluation doit être référencée par certifications/${certification.id}.assessmentId`,
      );
    }
    if (certification.candidateCharterId !== assessment.candidateCharterId
      || certification.candidateCharterVersion !== assessment.candidateCharterVersion) {
      err(
        `certificationAssessments/${assessment.id} — `
        + `la version de charte doit correspondre à certifications/${certification.id}`,
      );
    }
  }

  const charterKey = `${assessment.candidateCharterId}@${assessment.candidateCharterVersion}`;
  if (!candidateCharterKeys.has(charterKey))
    err(`certificationAssessments/${assessment.id}.candidateCharter — charte introuvable : "${charterKey}"`);

  const competencyIds = assessment.competencies.map((competency) => competency.id);
  if (new Set(competencyIds).size !== competencyIds.length)
    err(`certificationAssessments/${assessment.id}.competencies — id en double`);
  if (competencyIds.length !== 6)
    err(`certificationAssessments/${assessment.id}.competencies — six compétences sont attendues`);

  const questionIds = assessment.exam.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length)
    err(`certificationAssessments/${assessment.id}.exam.questions — id en double`);
  if (assessment.exam.questions.length !== assessment.exam.questionCount)
    err(
      `certificationAssessments/${assessment.id}.exam.questionCount — `
      + `${assessment.exam.questionCount} déclaré, ${assessment.exam.questions.length} question(s) trouvée(s)`,
    );
  if (assessment.exam.questionCount !== competencyIds.length * assessment.exam.questionsPerCompetency) {
    err(
      `certificationAssessments/${assessment.id}.exam — `
      + 'questionCount doit être égal au nombre de compétences multiplié par questionsPerCompetency',
    );
  }
  for (const competencyId of competencyIds) {
    const count = assessment.exam.questions.filter((question) => question.competencyId === competencyId).length;
    if (count !== assessment.exam.questionsPerCompetency) {
      err(
        `certificationAssessments/${assessment.id}.exam/${competencyId} — `
        + `${assessment.exam.questionsPerCompetency} questions attendues, ${count} trouvée(s)`,
      );
    }
  }
  for (const question of assessment.exam.questions) {
    if (!competencyIds.includes(question.competencyId)) {
      err(
        `certificationAssessments/${assessment.id}.exam.questions/${question.id}.competencyId — `
        + `compétence introuvable : "${question.competencyId}"`,
      );
    }
    const optionIds = question.options.map((option) => option.id);
    if (new Set(optionIds).size !== optionIds.length)
      err(`certificationAssessments/${assessment.id}.exam.questions/${question.id}.options — id en double`);
    if (!optionIds.includes(question.correctOptionId)) {
      err(
        `certificationAssessments/${assessment.id}.exam.questions/${question.id}.correctOptionId — `
        + `option introuvable : "${question.correctOptionId}"`,
      );
    }
  }
  const examPoints = assessment.exam.questions.reduce((total, question) => total + question.points, 0);
  if (examPoints !== assessment.exam.points)
    err(
      `certificationAssessments/${assessment.id}.exam.points — `
      + `${assessment.exam.points} déclaré, ${examPoints} trouvé dans les questions`,
    );

  const miniCaseIds = assessment.miniCases.map((miniCase) => miniCase.id);
  if (new Set(miniCaseIds).size !== miniCaseIds.length)
    err(`certificationAssessments/${assessment.id}.miniCases — id en double`);
  const numericQuestionIds = [];
  for (const miniCase of assessment.miniCases) {
    numericQuestionIds.push(...miniCase.questions.map((question) => question.id));
    const questionPoints = miniCase.questions.reduce((total, question) => total + question.points, 0);
    if (questionPoints !== miniCase.points) {
      err(
        `certificationAssessments/${assessment.id}.miniCases/${miniCase.id}.points — `
        + `${miniCase.points} déclaré, ${questionPoints} trouvé dans les questions`,
      );
    }
  }
  if (new Set(numericQuestionIds).size !== numericQuestionIds.length)
    err(`certificationAssessments/${assessment.id}.miniCases.questions — id en double`);

  const miniCasePoints = assessment.miniCases.reduce((total, miniCase) => total + miniCase.points, 0);
  if (assessment.exam.points + miniCasePoints !== 100) {
    err(
      `certificationAssessments/${assessment.id} — `
      + `le total examen + mini-cas doit être 100 (trouvé : ${assessment.exam.points + miniCasePoints})`,
    );
  }
  if (assessment.passingRules.totalMin > assessment.exam.points + miniCasePoints)
    err(`certificationAssessments/${assessment.id}.passingRules.totalMin — seuil supérieur au total disponible`);
  if (assessment.passingRules.examMin > assessment.exam.points)
    err(`certificationAssessments/${assessment.id}.passingRules.examMin — seuil supérieur au total de l'examen`);
  if (assessment.miniCases.some((miniCase) => assessment.passingRules.caseMinEach > miniCase.points))
    err(`certificationAssessments/${assessment.id}.passingRules.caseMinEach — seuil supérieur à un mini-cas`);

  const toolChoices = assessment.toolDeclaration.choices;
  if (new Set(toolChoices).size !== toolChoices.length)
    err(`certificationAssessments/${assessment.id}.toolDeclaration.choices — valeur en double`);
}

for (const certification of certifications.filter((candidate) => candidate.certificateType === 'knowledge')) {
  if (!certificationAssessmentIds.has(certification.assessmentId))
    err(`certifications/${certification.id}.assessmentId — évaluation introuvable : "${certification.assessmentId}"`);
  const charterKey = `${certification.candidateCharterId}@${certification.candidateCharterVersion}`;
  if (!candidateCharterKeys.has(charterKey))
    err(`certifications/${certification.id}.candidateCharter — charte introuvable : "${charterKey}"`);
}

const analystCertification = certifications.find((certification) => certification.id === 'cert-analyst-vc');
if (!analystCertification || analystCertification.certificateType !== 'professional') {
  err('certifications/cert-analyst-vc — certification professionnelle introuvable');
} else {
  const preparationLessonIds = analystCertification.recommendedPreparation.flatMap((requirement) => requirement.lessonIds);
  const preparationSet = new Set(preparationLessonIds);

  if (analystCertification.recommendedPreparation.length !== 3 || preparationLessonIds.length !== 12
    || preparationSet.size !== 12) {
    err('certifications/cert-analyst-vc.recommendedPreparation — trois blocs et 12 leçons distinctes sont attendus');
  }
  if (analystCertification.title !== 'VC Analyst')
    err('certifications/cert-analyst-vc.title — le titre canonique invariant doit être "VC Analyst"');
}

const expectedCertificationPrerequisites = new Map([
  ['lmv-market-sizing', ['l-pipeline-crm']],
  ['l-fact-hypothesis', ['lmv-returns-waterfall']],
  ['l-conflicts-conduct', ['l-fact-hypothesis']],
  ['l-investment-recommendation', ['l-fact-hypothesis', 'l-dd-legal']],
]);
for (const [lessonId, expectedPrerequisites] of expectedCertificationPrerequisites) {
  const lesson = allLessons.find((candidate) => candidate.id === lessonId);
  if (!lesson || JSON.stringify(lesson.prerequisiteLessonIds ?? []) !== JSON.stringify(expectedPrerequisites)) {
    err(
      `lessons/${lessonId}.prerequisiteLessonIds — `
      + `attendu ${expectedPrerequisites.join(', ')}`,
    );
  }
}

const prerequisiteState = new Map();
const prerequisiteStack = [];
const visitPrerequisites = (lessonId) => {
  const state = prerequisiteState.get(lessonId) ?? 0;
  if (state === 2) return;
  if (state === 1) {
    const cycleStart = prerequisiteStack.indexOf(lessonId);
    err(`lessons.prerequisiteLessonIds — cycle détecté : ${[...prerequisiteStack.slice(cycleStart), lessonId].join(' -> ')}`);
    return;
  }
  prerequisiteState.set(lessonId, 1);
  prerequisiteStack.push(lessonId);
  const lesson = allLessons.find((candidate) => candidate.id === lessonId);
  for (const prerequisiteId of lesson?.prerequisiteLessonIds ?? []) visitPrerequisites(prerequisiteId);
  prerequisiteStack.pop();
  prerequisiteState.set(lessonId, 2);
};
for (const lesson of allLessons) visitPrerequisites(lesson.id);

for (const g of glossary) {
  checkRefs(`glossary/${g.slug}.relatedLessonIds`, g.relatedLessonIds, (r) => lessonIds.has(r), 'leçon');
  for (const s of g.seeAlso) if (!glossarySlugs.has(s)) warn(`glossary/${g.slug}.seeAlso — slug sans cible : "${s}"`);
}
for (const c of cases) {
  checkRefs(`caseStudies/${c.id}.glossaryRefs`, c.glossaryRefs, isGlossary, 'terme de glossaire');
}
for (const b of blog) {
  if (b.glossaryRefs) checkRefs(`blog/${b.id}.glossaryRefs`, b.glossaryRefs, isGlossary, 'terme de glossaire');
  if ((b.status ?? 'published') === 'published' && /squelette|(?:à|a)\s+développer/i.test(JSON.stringify(b)))
    err(`blog/${b.id} — un article publié ne peut pas contenir de marqueur éditorial "squelette" ou "à développer"`);
}
for (const { file, doc } of blogDocs) {
  if (typeof doc?.slug === 'string' && file !== `${doc.slug}.json`)
    err(`blog/${file} — le nom du fichier doit suivre le slug : "${doc.slug}.json"`);
}
const ecosystemIds = new Set(ecosystems.map((e) => e.id));
for (const e of ecosystems) {
  checkRefs(`ecosystems/${e.id}.glossaryRefs`, e.glossaryRefs, isGlossary, 'terme de glossaire');
  if (e.parentId !== undefined) {
    if (e.parentId === e.id) err(`ecosystems/${e.id}.parentId — un dossier ne peut pas être son propre parent`);
    else if (!ecosystemIds.has(e.parentId)) err(`ecosystems/${e.id}.parentId — dossier parent introuvable : "${e.parentId}"`);
  }
}
// Cycle detection — walk each chain up to the root; a revisited id means a loop.
for (const e of ecosystems) {
  const seen = new Set([e.id]);
  let cur = e.parentId ? ecosystems.find((x) => x.id === e.parentId) : undefined;
  while (cur) {
    if (seen.has(cur.id)) { err(`ecosystems/${e.id} — cycle de parenté détecté via "${cur.id}"`); break; }
    seen.add(cur.id);
    cur = cur.parentId ? ecosystems.find((x) => x.id === cur.parentId) : undefined;
  }
}
for (const s of simulators) {
  checkRefs(`simulators/${s.id}.relatedLessonIds`, s.relatedLessonIds, (r) => lessonIds.has(r), 'leçon');
  checkRefs(`simulators/${s.id}.glossaryRefs`, s.glossaryRefs, isGlossary, 'terme de glossaire');
}
// Memo library ↔ anti-portfolio : les renvois croisés des deux collections
// doivent se résoudre, et leurs glossaryRefs pointer sur le glossaire.
const memoIds = new Set(memos.map((m) => m.id));
const antiPortfolioEntryIds = new Set(antiPortfolioEntries.map((e) => e.id));
const antiPortfolioPatternIds = new Set(antiPortfolioPatterns.map((p) => p.id));
for (const m of memos) {
  checkRefs(`memos/${m.id}.glossaryRefs`, m.glossaryRefs, isGlossary, 'terme de glossaire');
  checkRefs(
    `memos/${m.id}.relatedAntiPortfolioIds`,
    m.relatedAntiPortfolioIds,
    (r) => antiPortfolioEntryIds.has(r),
    'entrée anti-portfolio',
  );
}
for (const e of antiPortfolioEntries) {
  checkRefs(`antiPortfolio/${e.id}.patternIds`, e.patternIds, (r) => antiPortfolioPatternIds.has(r), 'motif');
  checkRefs(`antiPortfolio/${e.id}.glossaryRefs`, e.glossaryRefs, isGlossary, 'terme de glossaire');
  checkRefs(`antiPortfolio/${e.id}.relatedMemoIds`, e.relatedMemoIds, (r) => memoIds.has(r), 'mémo');
}

// Dossiers apprenants, diagnostics et corrections commentées.
// Certains dossiers ont un inventaire documentaire propre. Ne pas appliquer
// l'inventaire financier/organisationnel de Trait d'Union à tout nouveau cas
// apprenant : un dossier Série A peut rester exécutable avec un corpus plus
// ciblé, contrôlé par son livrable et ses tests dédiés.
const requiredLearnerDocumentKinds = [
  'income-statements',
  'balance-sheets',
  'trial-balance',
  'monthly-budget',
  'cash-schedule',
  'restricted-funds',
  'cofunding-agreements',
  'board-minutes',
  'organisation',
  'interviews',
  'cohorts',
  'indicator-dictionary',
  'incident-risk-register',
];
const requiredLearnerDocumentKindsByCaseId = new Map([
  ['cs-vp-insertion-3-regions', requiredLearnerDocumentKinds],
  ['cs-mathematiques-vc-dossier', requiredLearnerDocumentKinds],
]);
for (const caseStudy of cases) {
  const documents = caseStudy.documents ?? [];
  if (documents.length) {
    assertUnique(`caseStudies/${caseStudy.id}.documents`, documents, 'id');
    for (const document of documents) {
      if (!document.body && !document.tables?.length) {
        err(`caseStudies/${caseStudy.id}.documents/${document.id} — body ou table requis`);
      }
      for (const [tableIndex, table] of (document.tables ?? []).entries()) {
        for (const [rowIndex, row] of table.rows.entries()) {
          if (row.length !== table.columns.length) {
            err(
              `caseStudies/${caseStudy.id}.documents/${document.id}.tables[${tableIndex}].rows[${rowIndex}] `
              + `— ${row.length} cellules pour ${table.columns.length} colonnes`,
            );
          }
        }
      }
    }
  }
  if (caseStudy.learningRole === 'learner-dossier') {
    const kinds = new Set(documents.map((document) => document.kind));
    for (const kind of requiredLearnerDocumentKindsByCaseId.get(caseStudy.id) ?? []) {
      if (!kinds.has(kind)) err(`caseStudies/${caseStudy.id}.documents — document requis manquant : "${kind}"`);
    }
  }
}

for (const diagnostic of diagnostics) {
  if (!parcoursIds.has(diagnostic.parcoursId)) {
    err(`diagnostics/${diagnostic.id}.parcoursId — parcours introuvable : "${diagnostic.parcoursId}"`);
  }
  assertUnique(`diagnostics/${diagnostic.id}.items`, diagnostic.items, 'id');
  for (const item of diagnostic.items) {
    assertUnique(`diagnostics/${diagnostic.id}.items/${item.id}.options`, item.options, 'id');
    for (const resource of item.resourceRefs) {
      const exists = resource.kind === 'lesson'
        ? lessonIds.has(resource.id)
        : deliverableIds.has(resource.id);
      if (!exists) {
        err(
          `diagnostics/${diagnostic.id}.items/${item.id}.resourceRefs — `
          + `${resource.kind} introuvable : "${resource.id}"`,
        );
      }
    }
  }
}

for (const correction of caseCorrections) {
  if (!caseIds.has(correction.sourceCaseId)) {
    err(`caseCorrections/${correction.id}.sourceCaseId — cas introuvable : "${correction.sourceCaseId}"`);
  } else if (cases.find((candidate) => candidate.id === correction.sourceCaseId)?.learningRole !== 'learner-dossier') {
    err(`caseCorrections/${correction.id}.sourceCaseId — un dossier apprenant est attendu`);
  }
  if (!deliverableIds.has(correction.revealAfterDeliverableId)) {
    err(
      `caseCorrections/${correction.id}.revealAfterDeliverableId — `
      + `livrable introuvable : "${correction.revealAfterDeliverableId}"`,
    );
  }
}

// Livrables: relatedLessonIds, glossaryRefs and the model exemplar must resolve.
const memoRefs = new Set(memos.flatMap((m) => [m.id, m.slug]));
const modelResolvers = {
  ecosystem: (r) => ecosystemIds.has(r),
  case: (r) => caseRefs.has(r),
  memo: (r) => memoRefs.has(r),
  lesson: (r) => lessonIds.has(r),
};
for (const d of deliverables) {
  if (d.relatedLessonIds) checkRefs(`deliverables/${d.id}.relatedLessonIds`, d.relatedLessonIds, (r) => lessonIds.has(r), 'leçon');
  if (d.relatedCourseIds) checkRefs(`deliverables/${d.id}.relatedCourseIds`, d.relatedCourseIds, (r) => courseIds.has(r), 'cours');
  if (d.glossaryRefs) checkRefs(`deliverables/${d.id}.glossaryRefs`, d.glossaryRefs, isGlossary, 'terme de glossaire');
  if (d.caseStudyId && !caseIds.has(d.caseStudyId))
    err(`deliverables/${d.id}.caseStudyId — cas introuvable : "${d.caseStudyId}"`);
  if (d.correctionId && !correctionIds.has(d.correctionId))
    err(`deliverables/${d.id}.correctionId — correction introuvable : "${d.correctionId}"`);
  if (d.model && !modelResolvers[d.model.kind](d.model.id))
    err(`deliverables/${d.id}.model — ${d.model.kind} introuvable : "${d.model.id}"`);

  if (d.components) assertUnique(`deliverables/${d.id}.components`, d.components, 'id');
  if (d.roleCards) assertUnique(`deliverables/${d.id}.roleCards`, d.roleCards, 'id');
  const detailedCriteria = d.rubric.filter((criterion) => 'id' in criterion);
  if (detailedCriteria.length) assertUnique(`deliverables/${d.id}.rubric`, detailedCriteria, 'id');
  if (d.rubricLevels) assertUnique(`deliverables/${d.id}.rubricLevels`, d.rubricLevels, 'id');

  if (d.activityKind === 'capstone') {
    if (!d.evaluation?.includes('auto'))
      err(`deliverables/${d.id}.evaluation — l'autoévaluation est attendue pour le jalon final`);
    if (d.id === 'vp-recommandation-soutien') {
      if (d.components?.length !== 8)
        err(`deliverables/${d.id}.components — 8 composants attendus pour le jalon final`);
      if (d.rubric.length !== 13 || detailedCriteria.length !== 13)
        err(`deliverables/${d.id}.rubric — 13 critères détaillés attendus pour le jalon final`);
      if (d.rubricLevels?.length !== 4)
        err(`deliverables/${d.id}.rubricLevels — 4 niveaux attendus pour le jalon final`);
      if (d.roleCards?.length !== 5)
        err(`deliverables/${d.id}.roleCards — 5 cartes de rôle attendues pour le jalon final`);
    }
  }
  if (d.journal && d.journal.predictionMin > d.journal.predictionMax) {
    err(`deliverables/${d.id}.journal — predictionMin doit être inférieur ou égal à predictionMax`);
  }
}
for (const p of parcours) {
  checkRefs(`parcours/${p.id}.recommendedForProfiles`, p.recommendedForProfiles, (r) => profileIds.has(r), 'profil');
  if (p.entryDiagnosticId && !diagnosticIds.has(p.entryDiagnosticId)) {
    err(`parcours/${p.id}.entryDiagnosticId — diagnostic introuvable : "${p.entryDiagnosticId}"`);
  }
  p.steps.forEach((step) => {
    const ref = step.ref.id;
    const label = `parcours/${p.id}.steps[${step.order}]`;
    const resolvers = {
      lesson: (r) => lessonIds.has(r),
      course: (r) => courseIds.has(r),
      case: (r) => caseRefs.has(r),
      simulator: (r) => simRefs.has(r),
      glossary: isGlossary,
      deliverable: (r) => deliverableIds.has(r),
      // Mirrors resolveStep (client/src/content/parcours.ts): a milestone resolves
      // to a livrable first, then falls back to a lesson (preserves `lea-mock`).
      milestone: (r) => deliverableIds.has(r) || lessonIds.has(r),
    };
    // `a-produire` milestones with no livrable/lesson yet are intentional placeholders.
    if (step.ref.kind === 'milestone' && step.status === 'a-produire' && !deliverableIds.has(ref) && !lessonIds.has(ref)) return;
    if (!resolvers[step.ref.kind](ref)) err(`${label}.ref — ${step.ref.kind} introuvable : "${ref}"`);
  });
}
if (profileParcours) {
  for (const [profileId, route] of Object.entries(profileParcours.byProfile)) {
    if (!profileIds.has(profileId)) err(`profileParcours.byProfile — profil introuvable : "${profileId}"`);
    checkRefs(`profileParcours.byProfile/${profileId}`, [route.primary, ...(route.then ?? []), route.express].filter(Boolean), (r) => parcoursIds.has(r), 'parcours');
  }
  for (const [archetypeId, route] of Object.entries(profileParcours.byArchetype)) {
    if (!archetypeIds.has(archetypeId)) err(`profileParcours.byArchetype — archétype introuvable : "${archetypeId}"`);
    checkRefs(`profileParcours.byArchetype/${archetypeId}.bundle`, route.bundle, (r) => parcoursIds.has(r), 'parcours');
  }

  if (ikigai) {
    for (const profile of ikigai.profiles) {
      if (!Object.hasOwn(profileParcours.byProfile, profile.id))
        err(`profileParcours.byProfile — aiguillage manquant pour le profil "${profile.id}"`);

      const memberships = ikigai.archetypes.filter((archetype) => archetype.profileIds.includes(profile.id));
      if (memberships.length !== 1)
        err(`ikigai.archetypes — le profil "${profile.id}" doit appartenir à exactement un archétype (trouvé : ${memberships.length})`);
    }

    for (const archetype of ikigai.archetypes) {
      if (!Object.hasOwn(profileParcours.byArchetype, archetype.id))
        err(`profileParcours.byArchetype — aiguillage manquant pour l'archétype "${archetype.id}"`);
      if (new Set(archetype.profileIds).size !== archetype.profileIds.length)
        err(`ikigai.archetypes/${archetype.id}.profileIds — profil déclaré plusieurs fois`);
    }
  }
}
if (ikigai) {
  for (const a of ikigai.archetypes) {
    checkRefs(`ikigai.archetypes/${a.id}.profileIds`, a.profileIds, (r) => profileIds.has(r), 'profil');
  }
  ikigai.questions.forEach((q, qi) => {
    q.options.forEach((o, oi) => {
      for (const key of Object.keys(o.points))
        if (!profileIds.has(key)) err(`ikigai.questions[${qi}].options[${oi}].points — profil inconnu : "${key}"`);
    });
  });
}

// ── Quiz rule ────────────────────────────────────────────────────────────────
const lessonsWithoutQuiz = [];
for (const l of allLessons) {
  if (l.status === 'upcoming') continue;
  const quiz = l.quiz ?? [];
  if (quiz.length < MIN_QUIZ_QUESTIONS) {
    lessonsWithoutQuiz.push(l.id);
    continue;
  }
  quiz.forEach((qq, qi) => {
    const correct = qq.options.filter((o) => o.correct).length;
    if (correct !== 1)
      err(`lessons/${l.id}.quiz[${qi}] — exactement 1 bonne réponse attendue, ${correct} trouvée(s).`);
  });
}
if (lessonsWithoutQuiz.length)
  soft(`${lessonsWithoutQuiz.length}/${allLessons.length} leçon(s) sans quiz : ${lessonsWithoutQuiz.join(', ')}`);

// ── Glossary markers ([[..]] / {{..}}) ──────────────────────────────────────
const MARKER = /(?:\[\[|\{\{)([^\]}|]+)(?:\|[^\]}]*)?(?:\]\]|\}\})/g;
const MARKER_FILES = [
  'ikigai.json',
  'lessons.json',
  ...blogFiles.map((file) => `blog/${file}`),
  'ecosystems.json',
  'caseStudies.json',
  'caseCorrections.json',
  'diagnostics.json',
  'deliverables.json',
  'courses.json',
  'domains.json',
  'certifications.json',
  'certificationLevels.json',
  'candidateCharters.json',
  'certificationAssessments.json',
  'parcours.json',
  'parcoursRelations.json',
  'simulators.json',
  'memos.json',
  'antiPortfolio.json',
  ...parcoursLessonDocs.map((doc) => `parcours/${doc.file}`),
];
let markerCount = 0;
for (const file of MARKER_FILES) {
  let raw;
  try {
    raw = readFileSync(join(dataDir, file), 'utf8');
  } catch {
    continue;
  }
  for (const m of raw.matchAll(MARKER)) {
    markerCount += 1;
    const s = m[1].trim();
    if (!glossarySlugs.has(s)) err(`${file} — marqueur vers un slug inexistant : [[${s}]]`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log('Validation du contenu VC Premium');
console.log(`→ ${parcours.length} parcours · ${certifications.length} certification(s) · ${certificationLevels.length} niveau(x) · ${courses.length} cours · ${allLessons.length} leçons · ${glossary.length} termes`);
console.log(`→ ${parcoursRelations.length} relation(s) de parcours auditée(s)`);
console.log(`→ ${candidateCharters.length} charte(s) candidat · ${certificationAssessments.length} évaluation(s) de certification`);
console.log(`→ ${parcoursLessons.length} leçon(s) de parcours drop-in · ${parcoursLessonDocs.length} registre(s)`);
console.log(`→ ${cases.length} études de cas · ${caseCorrections.length} correction(s) commentée(s) · ${diagnostics.length} diagnostic(s) · ${deliverables.length} livrable(s) · ${blog.length} articles · ${ecosystems.length} dossier(s) d'écosystème · ${simulators.length} simulateurs`);
console.log(`→ ${memos.length} mémo(s) annoté(s) · ${antiPortfolioEntries.length} entrée(s) d'anti-portfolio · ${antiPortfolioPatterns.length} motif(s)`);
console.log(`→ ${markerCount} marqueur(s) [[..]] / {{..}} analysés`);

if (warnings.length) {
  console.warn(`\n⚠ ${warnings.length} avertissement(s) d'intégrité :`);
  for (const w of warnings) console.warn(`   · ${w}`);
}

if (softWarnings.length) {
  console.warn(`\n· ${softWarnings.length} lacune(s) de contenu (non bloquant, même en strict) :`);
  for (const w of softWarnings) console.warn(`   · ${w}`);
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} erreur(s) :`);
  for (const e of errors) console.error(`   · ${e}`);
  console.error('\nCorrigez les erreurs ci-dessus (data/**/*.json) avant de continuer.');
  process.exit(1);
}

// Mode strict (CI) : les avertissements d'intégrité (seeAlso sans cible,
// furtherReading non résolu, …) deviennent bloquants. Les lacunes de contenu
// (softWarnings : leçons sans quiz) restent tolérées — c'est un backlog éditorial,
// pas un build cassé. Activé via `--strict` ou VALIDATE_STRICT=1.
const strict = process.argv.includes('--strict') || process.env.VALIDATE_STRICT === '1';
if (shouldFailValidation({ errors: [], warnings, strict })) {
  console.error(`\n✗ Mode strict : ${warnings.length} avertissement(s) d'intégrité traité(s) comme erreur(s).`);
  process.exit(1);
}

console.log(`\n✓ Contenu valide : structure, références et marqueurs cohérents.${strict ? ' (strict)' : ''}`);
