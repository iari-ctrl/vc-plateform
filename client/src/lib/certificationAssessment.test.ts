import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CertificationAssessment } from '@/content/certificationTypes';
import {
  CERTIFICATION_ASSESSMENT_LIMITS,
  EMPTY_CERTIFICATION_ASSESSMENT_STORE,
  compatibleAssessmentRecord,
  createAssessmentAttempt,
  historicalAssessmentContexts,
  persistAssessmentRecordReset,
  readCertificationAssessmentStore,
  submitAssessmentAttempt,
  withActiveAssessmentAttempt,
  writeCertificationAssessmentStore,
  type CertificationAssessmentStore,
} from './certificationAssessment';
import { storageErrors } from './storage';

function localStorageStub(initial: Record<string, string> = {}, overrides: Partial<Storage> = {}): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() {
      return values.size;
    },
    clear: vi.fn(() => values.clear()),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => values.delete(key)),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    ...overrides,
  };
}

function assessment(version: string): CertificationAssessment {
  return {
    id: 'assessment-1',
    status: 'published',
    version,
    certificationId: 'cert-1',
    candidateCharterId: 'charter-1',
    candidateCharterVersion: version,
    title: 'Évaluation',
    description: 'Description',
    competencies: [{ id: 'competency-1', label: 'Compétence' }],
    exam: {
      title: 'QCM',
      instructions: 'Instructions',
      points: 10,
      questionCount: 1,
      questionsPerCompetency: 1,
      shuffleQuestions: true,
      consultationPolicy: 'not-recommended',
      questions: [{
        id: 'question-1',
        competencyId: 'competency-1',
        prompt: 'Question ?',
        options: [
          { id: 'option-1', label: 'Réponse 1' },
          { id: 'option-2', label: 'Réponse 2' },
        ],
        correctOptionId: 'option-1',
        points: 10,
        explanation: 'Explication',
      }],
    },
    miniCases: [{
      id: 'case-1',
      title: 'Cas',
      scenario: 'Scénario',
      instructions: 'Calculer.',
      points: 10,
      questions: [{
        id: 'numeric-1',
        prompt: 'Valeur ?',
        unit: 'x',
        expectedValue: 10,
        tolerance: { mode: 'absolute', value: 0.1 },
        points: 10,
        correction: 'Correction',
      }],
    }],
    passingRules: { totalMin: 10, examMin: 5, caseMinEach: 5 },
    resourcePolicy: { exam: 'Sans ressource.', miniCases: 'Ressources autorisées.' },
    attemptPolicy: {
      unlimited: true,
      timer: false,
      technicalLocking: false,
      persistActiveAttempt: true,
      submittedHistoryLimit: 5,
      preserveBestResult: true,
      shuffleOncePerAttempt: true,
    },
    toolDeclaration: {
      required: true,
      prompt: 'Outils utilisés',
      choices: ['Aucun'],
      allowFreeText: true,
    },
  };
}

function submitVersion(
  store: CertificationAssessmentStore,
  definition: CertificationAssessment,
  now: string,
) {
  const charter = { id: definition.candidateCharterId, version: definition.candidateCharterVersion };
  const attempt = createAssessmentAttempt(definition, charter, {
    now,
    random: () => 0.5,
    charterAccepted: true,
    toolDeclaration: { toolsUsed: 'Aucun', confirmed: true },
  });
  const activeStore = withActiveAssessmentAttempt(store, attempt);
  return submitAssessmentAttempt(activeStore, definition, attempt, now);
}

describe('certification assessment persistence', () => {
  beforeEach(() => {
    let attemptIndex = 0;
    vi.stubGlobal('localStorage', localStorageStub());
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => `attempt-${++attemptIndex}`) });
    storageErrors.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    storageErrors.clear();
  });

  it('keeps prior assessment and charter versions consultable after a new version and reset', () => {
    const v1 = assessment('1.0.0');
    const v2 = assessment('2.0.0');
    const first = submitVersion(EMPTY_CERTIFICATION_ASSESSMENT_STORE, v1, '2026-07-20T10:00:00.000Z');
    const previousSubmissionId = first.submission.id;
    const retainedBest = {
      ...first.submission,
      id: 'retained-best',
      submittedAt: '2026-07-19T10:00:00.000Z',
      updatedAt: '2026-07-19T10:00:00.000Z',
    };
    const firstWithPrunedBest: CertificationAssessmentStore = {
      ...first.store,
      records: {
        ...first.store.records,
        [v1.id]: {
          ...first.store.records[v1.id],
          bestResult: retainedBest,
        },
      },
    };

    expect(historicalAssessmentContexts(firstWithPrunedBest, v2, {
      id: v2.candidateCharterId,
      version: v2.candidateCharterVersion,
    })[0].submissions.map((submission) => submission.id)).toEqual(expect.arrayContaining([
      previousSubmissionId,
      retainedBest.id,
    ]));

    const second = submitVersion(firstWithPrunedBest, v2, '2026-07-21T10:00:00.000Z');
    expect(second.store.records[v2.id].history.map((item) => item.id)).toContain(previousSubmissionId);

    const reset = persistAssessmentRecordReset(second.store, v2, {
      id: v2.candidateCharterId,
      version: v2.candidateCharterVersion,
    });
    expect(reset.result).toEqual({ ok: true });
    const previousRecord = compatibleAssessmentRecord(reset.next, v1, {
      id: v1.candidateCharterId,
      version: v1.candidateCharterVersion,
    });
    expect(previousRecord.history.map((item) => item.id)).toEqual(expect.arrayContaining([
      previousSubmissionId,
      retainedBest.id,
    ]));
    expect(previousRecord.history).toHaveLength(2);

    expect(historicalAssessmentContexts(reset.next, v2, {
      id: v2.candidateCharterId,
      version: v2.candidateCharterVersion,
    })).toEqual([expect.objectContaining({
      assessmentVersion: v1.version,
      charterId: v1.candidateCharterId,
      charterVersion: v1.candidateCharterVersion,
      submissions: expect.arrayContaining([
        expect.objectContaining({ id: previousSubmissionId }),
        expect.objectContaining({ id: retainedBest.id }),
      ]),
    })]);
  });

  it('ignores malformed stored data without overwriting it', () => {
    const raw = JSON.stringify({ schemaVersion: 1, records: [] });
    const local = localStorageStub({ 'vcpx:certification-assessments': raw });
    vi.stubGlobal('localStorage', local);

    expect(readCertificationAssessmentStore()).toBe(EMPTY_CERTIFICATION_ASSESSMENT_STORE);
    expect(storageErrors.getSnapshot()).toMatchObject({
      reason: 'validation',
      operation: 'read',
      key: 'certification-assessments',
    });
    expect(local.getItem('vcpx:certification-assessments')).toBe(raw);
  });

  it('rejects overlong tool declarations without persisting them', () => {
    const definition = assessment('1.0.0');
    const attempt = createAssessmentAttempt(
      definition,
      { id: definition.candidateCharterId, version: definition.candidateCharterVersion },
      { now: '2026-07-22T10:00:00.000Z', random: () => 0.5 },
    );
    const started = withActiveAssessmentAttempt(EMPTY_CERTIFICATION_ASSESSMENT_STORE, attempt);
    const record = started.records[definition.id];
    const oversized: CertificationAssessmentStore = {
      ...started,
      records: {
        ...started.records,
        [definition.id]: {
          ...record,
          activeAttempt: {
            ...record.activeAttempt!,
            toolDeclaration: {
              ...record.activeAttempt!.toolDeclaration,
              toolsUsed: 'x'.repeat(CERTIFICATION_ASSESSMENT_LIMITS.freeText + 1),
            },
          },
        },
      },
    };

    expect(writeCertificationAssessmentStore(oversized)).toMatchObject({
      ok: false,
      reason: 'limit',
      key: 'certification-assessments',
    });
    expect(localStorage.getItem('vcpx:certification-assessments')).toBeNull();
  });

  it('rejects impossible stored score values and aggregates', () => {
    const definition = assessment('1.0.0');
    const submitted = submitVersion(
      EMPTY_CERTIFICATION_ASSESSMENT_STORE,
      definition,
      '2026-07-22T10:00:00.000Z',
    );
    const base = submitted.submission;
    const firstQuestion = base.score.examQuestions[0];
    expect(firstQuestion).toBeDefined();
    const impossibleMiniCaseMinimum = base.score.miniCases[0].maxScore + 1;

    const invalidScores = [
      { ...base.score, totalScore: -1 },
      { ...base.score, totalScore: base.score.totalScore + 1 },
      { ...base.score, passed: !base.score.passed },
      {
        ...base.score,
        thresholds: {
          ...base.score.thresholds,
          total: { ...base.score.thresholds.total, minimum: -1 },
        },
      },
      {
        ...base.score,
        examQuestions: [
          {
            ...firstQuestion,
            correct: true,
            awardedPoints: firstQuestion.maxPoints + 1,
          },
          ...base.score.examQuestions.slice(1),
        ],
      },
      {
        ...base.score,
        passed: false,
        miniCases: base.score.miniCases.map((miniCase) => ({
          ...miniCase,
          passedThreshold: false,
        })),
        thresholds: {
          ...base.score.thresholds,
          miniCase: { minimumEach: impossibleMiniCaseMinimum, passed: false },
        },
      },
    ];

    for (const score of invalidScores) {
      const invalid: CertificationAssessmentStore = {
        schemaVersion: 1,
        records: {
          [definition.id]: {
            history: [{ ...base, score }],
          },
        },
      };
      expect(writeCertificationAssessmentStore(invalid)).toMatchObject({
        ok: false,
        reason: 'validation',
        key: 'certification-assessments',
      });
    }
    expect(localStorage.getItem('vcpx:certification-assessments')).toBeNull();
  });

  it('rejects record collections above the documented limit', () => {
    const records = Object.fromEntries(Array.from(
      { length: CERTIFICATION_ASSESSMENT_LIMITS.records + 1 },
      (_, index) => [`assessment-${index}`, { history: [] }],
    ));
    vi.stubGlobal('localStorage', localStorageStub({
      'vcpx:certification-assessments': JSON.stringify({ schemaVersion: 1, records }),
    }));

    expect(readCertificationAssessmentStore()).toBe(EMPTY_CERTIFICATION_ASSESSMENT_STORE);
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'limit', operation: 'read' });
  });

  it('falls back when localStorage access is unavailable', () => {
    vi.stubGlobal('localStorage', localStorageStub({}, {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    }));

    expect(readCertificationAssessmentStore()).toBe(EMPTY_CERTIFICATION_ASSESSMENT_STORE);
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'unavailable', operation: 'read' });
  });
});
