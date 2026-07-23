import type {
  CandidateCharter,
  CertificationAssessment,
  NumericAssessmentQuestion,
} from '@/content/certificationTypes';
import {
  STORAGE_KEYS,
  storage,
  type StorageContract,
  type StorageParseFailureReason,
  type StorageParseResult,
  type StorageResult,
} from '@/lib/storage';

export const CERTIFICATION_ASSESSMENT_LIMITS = Object.freeze({
  id: 200,
  shortText: 500,
  freeText: 20_000,
  records: 100,
  historyPerRecord: 200,
  questionsPerAttempt: 500,
  answersPerAttempt: 500,
  scoreItems: 500,
});

export interface AssessmentToolDeclaration {
  toolsUsed: string;
  confirmed: boolean;
}

export interface CertificationAssessmentAttempt {
  id: string;
  assessmentId: string;
  assessmentVersion: string;
  charterId: string;
  charterVersion: string;
  startedAt: string;
  updatedAt: string;
  questionOrder: string[];
  answers: Record<string, string>;
  currentSectionId: string;
  charterAccepted: boolean;
  toolDeclaration: AssessmentToolDeclaration;
}

export interface ExamQuestionResult {
  questionId: string;
  correct: boolean;
  awardedPoints: number;
  maxPoints: number;
}

export interface NumericQuestionResult {
  questionId: string;
  parsedValue: number | null;
  correct: boolean;
  awardedPoints: number;
  maxPoints: number;
}

export interface MiniCaseResult {
  caseId: string;
  score: number;
  maxScore: number;
  passedThreshold: boolean;
  questions: NumericQuestionResult[];
}

export interface AssessmentScore {
  totalScore: number;
  maxScore: number;
  examScore: number;
  examMaxScore: number;
  miniCases: MiniCaseResult[];
  passed: boolean;
  thresholds: {
    total: { minimum: number; passed: boolean };
    exam: { minimum: number; passed: boolean };
    miniCase: { minimumEach: number; passed: boolean };
  };
  examQuestions: ExamQuestionResult[];
}

export interface SubmittedCertificationAssessment extends CertificationAssessmentAttempt {
  submittedAt: string;
  score: AssessmentScore;
}

export interface CertificationAssessmentRecord {
  activeAttempt?: CertificationAssessmentAttempt;
  history: SubmittedCertificationAssessment[];
  bestResult?: SubmittedCertificationAssessment;
}

export interface CertificationAssessmentStore {
  schemaVersion: 1;
  records: Record<string, CertificationAssessmentRecord>;
}

export const EMPTY_CERTIFICATION_ASSESSMENT_STORE: CertificationAssessmentStore = Object.freeze({
  schemaVersion: 1,
  records: Object.freeze({}),
});

interface CreateAttemptOptions {
  id?: string;
  now?: string;
  random?: () => number;
  currentSectionId?: string;
  charterAccepted?: boolean;
  toolDeclaration?: AssessmentToolDeclaration;
}

function fallbackAttemptId(now: string, random: () => number): string {
  return `attempt-${now.replace(/\D/g, '')}-${Math.floor(random() * 1_000_000).toString(36)}`;
}

function attemptId(now: string, random: () => number): string {
  return globalThis.crypto?.randomUUID?.() ?? fallbackAttemptId(now, random);
}

export function shuffleQuestionIds(questionIds: readonly string[], random: () => number = Math.random): string[] {
  const shuffled = [...questionIds];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createAssessmentAttempt(
  assessment: CertificationAssessment,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
  options: CreateAttemptOptions = {},
): CertificationAssessmentAttempt {
  const now = options.now ?? new Date().toISOString();
  const random = options.random ?? Math.random;
  return {
    id: options.id ?? attemptId(now, random),
    assessmentId: assessment.id,
    assessmentVersion: assessment.version,
    charterId: charter.id,
    charterVersion: charter.version,
    startedAt: now,
    updatedAt: now,
    questionOrder: shuffleQuestionIds(assessment.exam.questions.map((question) => question.id), random),
    answers: {},
    currentSectionId: options.currentSectionId ?? 'exam',
    charterAccepted: options.charterAccepted ?? false,
    toolDeclaration: options.toolDeclaration ?? { toolsUsed: '', confirmed: false },
  };
}

export function updateAssessmentAttempt(
  attempt: CertificationAssessmentAttempt,
  patch: Partial<Pick<
    CertificationAssessmentAttempt,
    'answers' | 'currentSectionId' | 'charterAccepted' | 'toolDeclaration'
  >>,
  updatedAt = new Date().toISOString(),
): CertificationAssessmentAttempt {
  return { ...attempt, ...patch, updatedAt };
}

export function setAssessmentAnswer(
  attempt: CertificationAssessmentAttempt,
  questionId: string,
  value: string,
  updatedAt = new Date().toISOString(),
): CertificationAssessmentAttempt {
  return updateAssessmentAttempt(
    attempt,
    { answers: { ...attempt.answers, [questionId]: value } },
    updatedAt,
  );
}

/** Parse French or English decimal input without guessing the unit displayed by the form. */
export function parseLocalizedNumber(rawValue: string): number | null {
  let value = rawValue.trim().replace(/[\s\u00a0\u202f]/g, '').replace(/[€%]/g, '');
  if (!value) return null;

  const comma = value.lastIndexOf(',');
  const dot = value.lastIndexOf('.');
  if (comma >= 0 && dot >= 0) {
    const decimalSeparator = comma > dot ? ',' : '.';
    const groupingSeparator = decimalSeparator === ',' ? /\./g : /,/g;
    value = value.replace(groupingSeparator, '').replace(decimalSeparator, '.');
  } else if (comma >= 0) {
    value = value.replace(',', '.');
  }

  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function numericAnswerIsCorrect(
  question: NumericAssessmentQuestion,
  rawValue: string,
): { parsedValue: number | null; correct: boolean } {
  const parsedValue = parseLocalizedNumber(rawValue);
  if (parsedValue === null) return { parsedValue, correct: false };
  const difference = Math.abs(parsedValue - question.expectedValue);
  const allowedDifference = question.tolerance.mode === 'absolute'
    ? question.tolerance.value
    : Math.abs(question.expectedValue) * question.tolerance.value;
  const floatingPointMargin = Number.EPSILON
    * Math.max(1, Math.abs(parsedValue), Math.abs(question.expectedValue), Math.abs(allowedDifference))
    * 8;
  return { parsedValue, correct: difference <= allowedDifference + floatingPointMargin };
}

export function scoreAssessment(
  assessment: CertificationAssessment,
  attempt: CertificationAssessmentAttempt,
): AssessmentScore {
  if (attempt.assessmentId !== assessment.id || attempt.assessmentVersion !== assessment.version) {
    throw new Error("La tentative ne correspond pas à la version active de l'évaluation.");
  }
  const examQuestions = assessment.exam.questions.map<ExamQuestionResult>((question) => {
    const correct = attempt.answers[question.id] === question.correctOptionId;
    return {
      questionId: question.id,
      correct,
      awardedPoints: correct ? question.points : 0,
      maxPoints: question.points,
    };
  });
  const examScore = examQuestions.reduce((total, question) => total + question.awardedPoints, 0);
  const examMaxScore = examQuestions.reduce((total, question) => total + question.maxPoints, 0);

  const miniCases = assessment.miniCases.map<MiniCaseResult>((miniCase) => {
    const questions = miniCase.questions.map<NumericQuestionResult>((question) => {
      const { parsedValue, correct } = numericAnswerIsCorrect(question, attempt.answers[question.id] ?? '');
      return {
        questionId: question.id,
        parsedValue,
        correct,
        awardedPoints: correct ? question.points : 0,
        maxPoints: question.points,
      };
    });
    const score = questions.reduce((total, question) => total + question.awardedPoints, 0);
    const maxScore = questions.reduce((total, question) => total + question.maxPoints, 0);
    return {
      caseId: miniCase.id,
      score,
      maxScore,
      passedThreshold: score >= assessment.passingRules.caseMinEach,
      questions,
    };
  });

  const totalScore = examScore + miniCases.reduce((total, miniCase) => total + miniCase.score, 0);
  const maxScore = examMaxScore + miniCases.reduce((total, miniCase) => total + miniCase.maxScore, 0);
  const totalPassed = totalScore >= assessment.passingRules.totalMin;
  const examPassed = examScore >= assessment.passingRules.examMin;
  const miniCasesPassed = miniCases.every((miniCase) => miniCase.passedThreshold);

  return {
    totalScore,
    maxScore,
    examScore,
    examMaxScore,
    miniCases,
    passed: totalPassed && examPassed && miniCasesPassed,
    thresholds: {
      total: { minimum: assessment.passingRules.totalMin, passed: totalPassed },
      exam: { minimum: assessment.passingRules.examMin, passed: examPassed },
      miniCase: { minimumEach: assessment.passingRules.caseMinEach, passed: miniCasesPassed },
    },
    examQuestions,
  };
}

export function assessmentRecord(
  store: CertificationAssessmentStore,
  assessmentId: string,
): CertificationAssessmentRecord {
  return store.records[assessmentId] ?? { history: [] };
}

export function compatibleActiveAttempt(
  store: CertificationAssessmentStore,
  assessment: Pick<CertificationAssessment, 'id' | 'version'>,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
): CertificationAssessmentAttempt | null {
  const active = assessmentRecord(store, assessment.id).activeAttempt;
  if (!active) return null;
  return active.assessmentId === assessment.id
    && active.assessmentVersion === assessment.version
    && active.charterId === charter.id
    && active.charterVersion === charter.version
    ? active
    : null;
}

export function withActiveAssessmentAttempt(
  store: CertificationAssessmentStore,
  attempt: CertificationAssessmentAttempt,
): CertificationAssessmentStore {
  const current = assessmentRecord(store, attempt.assessmentId);
  return {
    schemaVersion: 1,
    records: {
      ...store.records,
      [attempt.assessmentId]: { ...current, activeAttempt: attempt },
    },
  };
}

function isBetterResult(
  candidate: SubmittedCertificationAssessment,
  current: SubmittedCertificationAssessment | undefined,
): boolean {
  if (!current) return true;
  if (candidate.score.passed !== current.score.passed) return candidate.score.passed;
  if (candidate.score.totalScore !== current.score.totalScore) {
    return candidate.score.totalScore > current.score.totalScore;
  }
  if (candidate.score.examScore !== current.score.examScore) {
    return candidate.score.examScore > current.score.examScore;
  }
  return candidate.submittedAt > current.submittedAt;
}

function submissionMatchesContext(
  submission: SubmittedCertificationAssessment,
  assessment: Pick<CertificationAssessment, 'id' | 'version'>,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
): boolean {
  return submission.assessmentId === assessment.id
    && submission.assessmentVersion === assessment.version
    && submission.charterId === charter.id
    && submission.charterVersion === charter.version;
}

export function compatibleAssessmentRecord(
  store: CertificationAssessmentStore,
  assessment: Pick<CertificationAssessment, 'id' | 'version'>,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
): CertificationAssessmentRecord {
  const current = assessmentRecord(store, assessment.id);
  const activeAttempt = compatibleActiveAttempt(
    store,
    assessment,
    charter,
  ) ?? undefined;
  const history = current.history.filter((submission) => submissionMatchesContext(submission, assessment, charter));
  const storedBest = current.bestResult && submissionMatchesContext(current.bestResult, assessment, charter)
    ? current.bestResult
    : undefined;
  const bestResult = history.reduce<SubmittedCertificationAssessment | undefined>(
    (best, submission) => (isBetterResult(submission, best) ? submission : best),
    storedBest,
  );
  return { activeAttempt, history, bestResult };
}

export interface HistoricalAssessmentContext {
  assessmentVersion: string;
  charterId: string;
  charterVersion: string;
  submissions: SubmittedCertificationAssessment[];
  bestResult: SubmittedCertificationAssessment;
}

/** Previous assessment/charter contexts retained under the same assessment identifier. */
export function historicalAssessmentContexts(
  store: CertificationAssessmentStore,
  assessment: Pick<CertificationAssessment, 'id' | 'version'>,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
): HistoricalAssessmentContext[] {
  const groups = new Map<string, SubmittedCertificationAssessment[]>();
  const record = assessmentRecord(store, assessment.id);
  const candidates = record.bestResult
    && !record.history.some((submission) => submission.id === record.bestResult?.id)
    ? [...record.history, record.bestResult]
    : record.history;
  for (const submission of candidates) {
    if (
      submission.assessmentId !== assessment.id
      || submissionMatchesContext(submission, assessment, charter)
    ) {
      continue;
    }
    const key = [submission.assessmentVersion, submission.charterId, submission.charterVersion].join('\u0000');
    groups.set(key, [...(groups.get(key) ?? []), submission]);
  }

  return Array.from(groups.values(), (submissions) => {
    const ordered = submissions.sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
    const bestResult = ordered.reduce((best, submission) => (
      isBetterResult(submission, best) ? submission : best
    ));
    return {
      assessmentVersion: ordered[0].assessmentVersion,
      charterId: ordered[0].charterId,
      charterVersion: ordered[0].charterVersion,
      submissions: ordered,
      bestResult,
    };
  }).sort((left, right) => (
    right.submissions[0].submittedAt.localeCompare(left.submissions[0].submittedAt)
  ));
}

export function submitAssessmentAttempt(
  store: CertificationAssessmentStore,
  assessment: CertificationAssessment,
  attempt: CertificationAssessmentAttempt,
  submittedAt = new Date().toISOString(),
): { store: CertificationAssessmentStore; submission: SubmittedCertificationAssessment } {
  const submission: SubmittedCertificationAssessment = {
    ...attempt,
    updatedAt: submittedAt,
    submittedAt,
    score: scoreAssessment(assessment, attempt),
  };
  const current = assessmentRecord(store, assessment.id);
  const context = { id: attempt.charterId, version: attempt.charterVersion };
  const compatibleHistory = current.history.filter((candidate) => (
    submissionMatchesContext(candidate, assessment, context)
  ));
  const compatibleBest = current.bestResult
    && submissionMatchesContext(current.bestResult, assessment, context)
    ? current.bestResult
    : undefined;
  const contextHistory = [submission, ...compatibleHistory]
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))
    .slice(0, assessment.attemptPolicy.submittedHistoryLimit);
  const historicalVersions = current.history.filter((candidate) => (
    !submissionMatchesContext(candidate, assessment, context)
  ));
  const retainedHistoricalBest = current.bestResult
    && !submissionMatchesContext(current.bestResult, assessment, context)
    && !historicalVersions.some((candidate) => candidate.id === current.bestResult?.id)
    ? [current.bestResult]
    : [];
  const history = [...contextHistory, ...historicalVersions, ...retainedHistoricalBest]
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
  const bestResult = isBetterResult(submission, compatibleBest) ? submission : compatibleBest;

  return {
    submission,
    store: {
      schemaVersion: 1,
      records: {
        ...store.records,
        [assessment.id]: { history, bestResult },
      },
    },
  };
}

export function withoutAssessmentRecord(
  store: CertificationAssessmentStore,
  assessmentId: string,
): CertificationAssessmentStore {
  const records = { ...store.records };
  delete records[assessmentId];
  return { schemaVersion: 1, records };
}

function attemptMatchesContext(
  attempt: CertificationAssessmentAttempt,
  assessment: Pick<CertificationAssessment, 'id' | 'version'>,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
): boolean {
  return attempt.assessmentId === assessment.id
    && attempt.assessmentVersion === assessment.version
    && attempt.charterId === charter.id
    && attempt.charterVersion === charter.version;
}

export function withoutAssessmentContext(
  store: CertificationAssessmentStore,
  assessment: Pick<CertificationAssessment, 'id' | 'version'>,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
): CertificationAssessmentStore {
  const current = store.records[assessment.id];
  if (!current) return store;

  const history = current.history.filter((submission) => (
    !submissionMatchesContext(submission, assessment, charter)
  ));
  const activeAttempt = current.activeAttempt && !attemptMatchesContext(current.activeAttempt, assessment, charter)
    ? current.activeAttempt
    : undefined;
  const bestResult = current.bestResult && !submissionMatchesContext(current.bestResult, assessment, charter)
    ? current.bestResult
    : undefined;
  const records = { ...store.records };
  if (history.length || activeAttempt || bestResult) {
    records[assessment.id] = { history, activeAttempt, bestResult };
  } else {
    delete records[assessment.id];
  }
  return { schemaVersion: 1, records };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isObject(value) && Object.values(value).every((entry) => typeof entry === 'string');
}

function isAssessmentAttempt(value: unknown): value is CertificationAssessmentAttempt {
  if (!isObject(value) || !isObject(value.toolDeclaration)) return false;
  return ['id', 'assessmentId', 'assessmentVersion', 'charterId', 'charterVersion', 'startedAt', 'updatedAt', 'currentSectionId']
    .every((key) => typeof value[key] === 'string')
    && Array.isArray(value.questionOrder)
    && value.questionOrder.every((questionId) => typeof questionId === 'string')
    && isStringRecord(value.answers)
    && typeof value.charterAccepted === 'boolean'
    && typeof value.toolDeclaration.toolsUsed === 'string'
    && typeof value.toolDeclaration.confirmed === 'boolean';
}

function isQuestionResult(value: unknown, numeric: boolean): boolean {
  if (!isObject(value)) return false;
  const shapeIsValid = typeof value.questionId === 'string'
    && typeof value.correct === 'boolean'
    && isFiniteNumber(value.awardedPoints)
    && isFiniteNumber(value.maxPoints)
    && (!numeric || value.parsedValue === null || isFiniteNumber(value.parsedValue));
  if (!shapeIsValid) return false;
  const awardedPoints = value.awardedPoints as number;
  const maxPoints = value.maxPoints as number;
  return awardedPoints >= 0
    && maxPoints >= 0
    && awardedPoints <= maxPoints
    && awardedPoints === (value.correct ? maxPoints : 0);
}

function isThreshold(value: unknown, key: 'minimum' | 'minimumEach'): boolean {
  return isObject(value)
    && isFiniteNumber(value[key])
    && value[key] >= 0
    && typeof value.passed === 'boolean';
}

function isAssessmentScore(value: unknown): value is AssessmentScore {
  if (!isObject(value) || !isObject(value.thresholds)) return false;
  const shapeIsValid = isFiniteNumber(value.totalScore)
    && isFiniteNumber(value.maxScore)
    && isFiniteNumber(value.examScore)
    && isFiniteNumber(value.examMaxScore)
    && typeof value.passed === 'boolean'
    && isThreshold(value.thresholds.total, 'minimum')
    && isThreshold(value.thresholds.exam, 'minimum')
    && isThreshold(value.thresholds.miniCase, 'minimumEach')
    && Array.isArray(value.examQuestions)
    && value.examQuestions.every((question) => isQuestionResult(question, false))
    && Array.isArray(value.miniCases)
    && value.miniCases.every((miniCase) => (
      isObject(miniCase)
      && typeof miniCase.caseId === 'string'
      && isFiniteNumber(miniCase.score)
      && isFiniteNumber(miniCase.maxScore)
      && typeof miniCase.passedThreshold === 'boolean'
      && Array.isArray(miniCase.questions)
      && miniCase.questions.every((question) => isQuestionResult(question, true))
    ));
  if (!shapeIsValid) return false;

  const score = value as unknown as AssessmentScore;
  const examQuestionIds = score.examQuestions.map((question) => question.questionId);
  const miniCaseIds = score.miniCases.map((miniCase) => miniCase.caseId);
  if (new Set(examQuestionIds).size !== examQuestionIds.length
    || new Set(miniCaseIds).size !== miniCaseIds.length) return false;

  const examScore = score.examQuestions.reduce((total, question) => total + question.awardedPoints, 0);
  const examMaxScore = score.examQuestions.reduce((total, question) => total + question.maxPoints, 0);
  if (score.examScore !== examScore || score.examMaxScore !== examMaxScore) return false;

  for (const miniCase of score.miniCases) {
    const questionIds = miniCase.questions.map((question) => question.questionId);
    if (new Set(questionIds).size !== questionIds.length) return false;
    const caseScore = miniCase.questions.reduce((total, question) => total + question.awardedPoints, 0);
    const caseMaxScore = miniCase.questions.reduce((total, question) => total + question.maxPoints, 0);
    if (miniCase.score !== caseScore
      || miniCase.maxScore !== caseMaxScore
      || miniCase.passedThreshold !== (caseScore >= score.thresholds.miniCase.minimumEach)) return false;
  }

  const miniCaseScore = score.miniCases.reduce((total, miniCase) => total + miniCase.score, 0);
  const miniCaseMaxScore = score.miniCases.reduce((total, miniCase) => total + miniCase.maxScore, 0);
  const totalScore = examScore + miniCaseScore;
  const maxScore = examMaxScore + miniCaseMaxScore;
  const totalPassed = totalScore >= score.thresholds.total.minimum;
  const examPassed = examScore >= score.thresholds.exam.minimum;
  const miniCasesPassed = score.miniCases.every((miniCase) => miniCase.passedThreshold);

  return score.totalScore === totalScore
    && score.maxScore === maxScore
    && score.thresholds.total.minimum <= maxScore
    && score.thresholds.exam.minimum <= examMaxScore
    && score.miniCases.every((miniCase) => (
      score.thresholds.miniCase.minimumEach <= miniCase.maxScore
    ))
    && score.thresholds.total.passed === totalPassed
    && score.thresholds.exam.passed === examPassed
    && score.thresholds.miniCase.passed === miniCasesPassed
    && score.passed === (totalPassed && examPassed && miniCasesPassed);
}

function isSubmittedAssessment(value: unknown): value is SubmittedCertificationAssessment {
  if (!isAssessmentAttempt(value)) return false;
  const submitted = value as CertificationAssessmentAttempt & { submittedAt?: unknown; score?: unknown };
  return typeof submitted.submittedAt === 'string' && isAssessmentScore(submitted.score);
}

function isAssessmentRecord(value: unknown): value is CertificationAssessmentRecord {
  if (!isObject(value) || !Array.isArray(value.history)) return false;
  return value.history.every(isSubmittedAssessment)
    && (value.activeAttempt === undefined || isAssessmentAttempt(value.activeAttempt))
    && (value.bestResult === undefined || isSubmittedAssessment(value.bestResult));
}

function stringReason(value: unknown, maxLength: number, allowEmpty = false): StorageParseFailureReason | null {
  if (typeof value !== 'string' || (!allowEmpty && value.length === 0)) return 'validation';
  return value.length > maxLength ? 'limit' : null;
}

function dateReason(value: unknown): StorageParseFailureReason | null {
  const reason = stringReason(value, 100);
  if (reason) return reason;
  return Number.isFinite(Date.parse(value as string)) ? null : 'validation';
}

function attemptReason(value: CertificationAssessmentAttempt): StorageParseFailureReason | null {
  for (const field of [
    value.id,
    value.assessmentId,
    value.assessmentVersion,
    value.charterId,
    value.charterVersion,
    value.currentSectionId,
  ]) {
    const reason = stringReason(field, CERTIFICATION_ASSESSMENT_LIMITS.id);
    if (reason) return reason;
  }
  let reason = dateReason(value.startedAt) ?? dateReason(value.updatedAt);
  if (reason) return reason;
  if (value.questionOrder.length > CERTIFICATION_ASSESSMENT_LIMITS.questionsPerAttempt) return 'limit';
  for (const questionId of value.questionOrder) {
    reason = stringReason(questionId, CERTIFICATION_ASSESSMENT_LIMITS.id);
    if (reason) return reason;
  }
  if (Object.keys(value.answers).length > CERTIFICATION_ASSESSMENT_LIMITS.answersPerAttempt) return 'limit';
  for (const [questionId, answer] of Object.entries(value.answers)) {
    reason = stringReason(questionId, CERTIFICATION_ASSESSMENT_LIMITS.id)
      ?? stringReason(answer, CERTIFICATION_ASSESSMENT_LIMITS.shortText, true);
    if (reason) return reason;
  }
  return stringReason(value.toolDeclaration.toolsUsed, CERTIFICATION_ASSESSMENT_LIMITS.freeText, true);
}

function scoreReason(value: AssessmentScore): StorageParseFailureReason | null {
  if (value.examQuestions.length > CERTIFICATION_ASSESSMENT_LIMITS.scoreItems) return 'limit';
  if (value.miniCases.length > CERTIFICATION_ASSESSMENT_LIMITS.scoreItems) return 'limit';
  for (const question of value.examQuestions) {
    const reason = stringReason(question.questionId, CERTIFICATION_ASSESSMENT_LIMITS.id);
    if (reason) return reason;
  }
  for (const miniCase of value.miniCases) {
    let reason = stringReason(miniCase.caseId, CERTIFICATION_ASSESSMENT_LIMITS.id);
    if (reason) return reason;
    if (miniCase.questions.length > CERTIFICATION_ASSESSMENT_LIMITS.scoreItems) return 'limit';
    for (const question of miniCase.questions) {
      reason = stringReason(question.questionId, CERTIFICATION_ASSESSMENT_LIMITS.id);
      if (reason) return reason;
    }
  }
  return null;
}

function submissionReason(value: SubmittedCertificationAssessment): StorageParseFailureReason | null {
  return attemptReason(value) ?? dateReason(value.submittedAt) ?? scoreReason(value.score);
}

function recordReason(value: CertificationAssessmentRecord): StorageParseFailureReason | null {
  if (value.history.length > CERTIFICATION_ASSESSMENT_LIMITS.historyPerRecord) return 'limit';
  if (value.activeAttempt) {
    const reason = attemptReason(value.activeAttempt);
    if (reason) return reason;
  }
  if (value.bestResult) {
    const reason = submissionReason(value.bestResult);
    if (reason) return reason;
  }
  for (const submission of value.history) {
    const reason = submissionReason(submission);
    if (reason) return reason;
  }
  return null;
}

function parseAssessmentStore(value: unknown): StorageParseResult<CertificationAssessmentStore> {
  if (!isObject(value) || value.schemaVersion !== 1 || !isObject(value.records)) {
    return { ok: false, reason: 'validation' };
  }
  if (Object.keys(value.records).length > CERTIFICATION_ASSESSMENT_LIMITS.records) {
    return { ok: false, reason: 'limit' };
  }
  for (const [assessmentId, record] of Object.entries(value.records)) {
    const idReason = stringReason(assessmentId, CERTIFICATION_ASSESSMENT_LIMITS.id);
    if (idReason) return { ok: false, reason: idReason };
    if (!isAssessmentRecord(record)) return { ok: false, reason: 'validation' };
    const reason = recordReason(record);
    if (reason) return { ok: false, reason };
  }
  return { ok: true, value: value as unknown as CertificationAssessmentStore };
}

export const CERTIFICATION_ASSESSMENT_CONTRACT: StorageContract<CertificationAssessmentStore> = {
  key: STORAGE_KEYS.certificationAssessments,
  version: 1,
  fallback: EMPTY_CERTIFICATION_ASSESSMENT_STORE,
  maxBytes: 8_000_000,
  migrations: { 0: (value) => value },
  parse: parseAssessmentStore,
};

export function readCertificationAssessmentStore(): CertificationAssessmentStore {
  return storage.getParsed(CERTIFICATION_ASSESSMENT_CONTRACT);
}

export function migrateCertificationAssessmentStore(): StorageResult {
  return storage.migrate(CERTIFICATION_ASSESSMENT_CONTRACT);
}

export function writeCertificationAssessmentStore(storeValue: CertificationAssessmentStore): StorageResult {
  return storage.setParsed(CERTIFICATION_ASSESSMENT_CONTRACT, storeValue);
}

export function removeCertificationAssessmentStore(): StorageResult {
  return storage.remove(CERTIFICATION_ASSESSMENT_CONTRACT.key);
}

export function persistAssessmentRecordReset(
  storeValue: CertificationAssessmentStore,
  assessment: Pick<CertificationAssessment, 'id' | 'version'>,
  charter: Pick<CandidateCharter, 'id' | 'version'>,
): { next: CertificationAssessmentStore; result: StorageResult } {
  const next = withoutAssessmentContext(storeValue, assessment, charter);
  const result = Object.keys(next.records).length
    ? writeCertificationAssessmentStore(next)
    : removeCertificationAssessmentStore();
  return { next: result.ok ? next : storeValue, result };
}
