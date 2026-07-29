import { useEffect, useSyncExternalStore } from 'react';
import {
  commitOnStorageSuccess,
  STORAGE_PREFIX,
  storage,
  STORAGE_KEYS,
  type StorageContract,
  type StorageParseFailureReason,
  type StorageParseResult,
  type StorageResult,
} from './storage';

export const LEARNING_WORKSPACE_SCHEMA_VERSION = 2 as const;

export const LEARNING_WORKSPACE_LIMITS = Object.freeze({
  id: 200,
  activityKey: 640,
  freeText: 20_000,
  shortText: 500,
  diagnostics: 100,
  productions: 200,
  activities: 500,
  answersPerDiagnostic: 100,
  ratingsPerProduction: 100,
});

export type ProductionStage = 'started' | 'first-version-completed' | 'reviewed' | 'revised';
export type ReviewMode = 'self' | 'peer' | 'practitioner';
export type LearningActivityKind = 'case' | 'simulator';

export interface DiagnosticWorkspaceEntry {
  answers: Record<string, string>;
  updatedAt: string;
}

export interface ProductionWorkspaceEntry {
  stage: ProductionStage;
  note?: string;
  externalFileProduced?: boolean;
  reviewMode?: ReviewMode;
  rubricRatings?: Record<string, string>;
  changeLog?: string;
  correctionRevealedAt?: string;
  declaredCompleteAt?: string;
  updatedAt: string;
}

export interface LearningActivityEntry {
  parcoursId: string;
  kind: LearningActivityKind;
  id: string;
  completed: true;
  completedAt: string;
  updatedAt: string;
}

export interface LearningWorkspaceState {
  schemaVersion: typeof LEARNING_WORKSPACE_SCHEMA_VERSION;
  diagnostics: Record<string, DiagnosticWorkspaceEntry>;
  productions: Record<string, ProductionWorkspaceEntry>;
  activities: Record<string, LearningActivityEntry>;
}

export const EMPTY_LEARNING_WORKSPACE: LearningWorkspaceState = Object.freeze({
  schemaVersion: LEARNING_WORKSPACE_SCHEMA_VERSION,
  diagnostics: {},
  productions: {},
  activities: {},
});

const STAGE_ORDER: Record<ProductionStage, number> = {
  started: 0,
  'first-version-completed': 1,
  reviewed: 2,
  revised: 3,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStage(value: unknown): value is ProductionStage {
  return typeof value === 'string' && value in STAGE_ORDER;
}

function isReviewMode(value: unknown): value is ReviewMode {
  return value === 'self' || value === 'peer' || value === 'practitioner';
}

function isLearningActivityKind(value: unknown): value is LearningActivityKind {
  return value === 'case' || value === 'simulator';
}

function failure<T>(reason: StorageParseFailureReason): StorageParseResult<T> {
  return { ok: false, reason };
}

function stringReason(value: unknown, maxLength: number, allowEmpty = false): StorageParseFailureReason | null {
  if (typeof value !== 'string' || (!allowEmpty && value.length === 0)) return 'validation';
  return value.length > maxLength ? 'limit' : null;
}

function optionalStringReason(value: unknown, maxLength: number): StorageParseFailureReason | null {
  return value === undefined ? null : stringReason(value, maxLength, true);
}

function dateReason(value: unknown): StorageParseFailureReason | null {
  const reason = stringReason(value, 100);
  if (reason) return reason;
  return Number.isFinite(Date.parse(value as string)) ? null : 'validation';
}

function stringRecordReason(
  value: unknown,
  maxItems: number,
  maxValueLength: number,
): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  if (Object.keys(value).length > maxItems) return 'limit';
  for (const [key, entry] of Object.entries(value)) {
    const reason = stringReason(key, LEARNING_WORKSPACE_LIMITS.id)
      ?? stringReason(entry, maxValueLength, true);
    if (reason) return reason;
  }
  return null;
}

export function learningActivityKey(parcoursId: string, kind: LearningActivityKind, id: string): string {
  return `${parcoursId}:${kind}:${id}`;
}

function inputActivityReason(parcoursId: string, kind: LearningActivityKind, id: string): StorageParseFailureReason | null {
  return stringReason(parcoursId, LEARNING_WORKSPACE_LIMITS.id)
    ?? (isLearningActivityKind(kind) ? null : 'validation')
    ?? stringReason(id, LEARNING_WORKSPACE_LIMITS.id)
    ?? stringReason(learningActivityKey(parcoursId, kind, id), LEARNING_WORKSPACE_LIMITS.activityKey);
}

function parseDiagnostics(value: unknown): StorageParseResult<Record<string, DiagnosticWorkspaceEntry>> {
  if (!isRecord(value)) return failure('validation');
  if (Object.keys(value).length > LEARNING_WORKSPACE_LIMITS.diagnostics) return failure('limit');

  const diagnostics: Record<string, DiagnosticWorkspaceEntry> = {};
  for (const [id, entry] of Object.entries(value)) {
    if (!isRecord(entry)) return failure('validation');
    const reason = stringReason(id, LEARNING_WORKSPACE_LIMITS.id)
      ?? stringRecordReason(
        entry.answers,
        LEARNING_WORKSPACE_LIMITS.answersPerDiagnostic,
        LEARNING_WORKSPACE_LIMITS.id,
      )
      ?? dateReason(entry.updatedAt);
    if (reason) return failure(reason);
    diagnostics[id] = {
      answers: entry.answers as Record<string, string>,
      updatedAt: entry.updatedAt as string,
    };
  }
  return { ok: true, value: diagnostics };
}

function parseProductions(value: unknown): StorageParseResult<Record<string, ProductionWorkspaceEntry>> {
  if (!isRecord(value)) return failure('validation');
  if (Object.keys(value).length > LEARNING_WORKSPACE_LIMITS.productions) return failure('limit');

  const productions: Record<string, ProductionWorkspaceEntry> = {};
  for (const [id, entry] of Object.entries(value)) {
    if (!isRecord(entry) || !isStage(entry.stage)) return failure('validation');
    const reason = stringReason(id, LEARNING_WORKSPACE_LIMITS.id)
      ?? optionalStringReason(entry.note, LEARNING_WORKSPACE_LIMITS.freeText)
      ?? optionalStringReason(entry.changeLog, LEARNING_WORKSPACE_LIMITS.freeText)
      ?? (entry.rubricRatings === undefined
        ? null
        : stringRecordReason(
          entry.rubricRatings,
          LEARNING_WORKSPACE_LIMITS.ratingsPerProduction,
          LEARNING_WORKSPACE_LIMITS.shortText,
        ))
      ?? (entry.correctionRevealedAt === undefined ? null : dateReason(entry.correctionRevealedAt))
      ?? (entry.declaredCompleteAt === undefined ? null : dateReason(entry.declaredCompleteAt))
      ?? dateReason(entry.updatedAt);
    if (reason) return failure(reason);
    if (entry.externalFileProduced !== undefined && typeof entry.externalFileProduced !== 'boolean') {
      return failure('validation');
    }
    if (entry.reviewMode !== undefined && !isReviewMode(entry.reviewMode)) return failure('validation');
    productions[id] = {
      stage: entry.stage,
      note: entry.note as string | undefined,
      externalFileProduced: entry.externalFileProduced as boolean | undefined,
      reviewMode: entry.reviewMode as ReviewMode | undefined,
      rubricRatings: entry.rubricRatings as Record<string, string> | undefined,
      changeLog: entry.changeLog as string | undefined,
      correctionRevealedAt: entry.correctionRevealedAt as string | undefined,
      declaredCompleteAt: entry.declaredCompleteAt as string | undefined,
      updatedAt: entry.updatedAt as string,
    };
  }
  return { ok: true, value: productions };
}

function parseActivities(value: unknown): StorageParseResult<Record<string, LearningActivityEntry>> {
  if (!isRecord(value)) return failure('validation');
  if (Object.keys(value).length > LEARNING_WORKSPACE_LIMITS.activities) return failure('limit');

  const activities: Record<string, LearningActivityEntry> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!isRecord(entry) || !isLearningActivityKind(entry.kind) || entry.completed !== true) return failure('validation');
    const reason = stringReason(key, LEARNING_WORKSPACE_LIMITS.activityKey)
      ?? inputActivityReason(entry.parcoursId as string, entry.kind, entry.id as string)
      ?? dateReason(entry.completedAt)
      ?? dateReason(entry.updatedAt);
    if (reason) return failure(reason);
    if (key !== learningActivityKey(entry.parcoursId as string, entry.kind, entry.id as string)) return failure('validation');
    activities[key] = {
      parcoursId: entry.parcoursId as string,
      kind: entry.kind,
      id: entry.id as string,
      completed: true,
      completedAt: entry.completedAt as string,
      updatedAt: entry.updatedAt as string,
    };
  }
  return { ok: true, value: activities };
}

function parseLearningWorkspaceResult(value: unknown): StorageParseResult<LearningWorkspaceState> {
  if (!isRecord(value) || (value.schemaVersion !== 1 && value.schemaVersion !== LEARNING_WORKSPACE_SCHEMA_VERSION)) {
    return failure('validation');
  }

  const diagnostics = parseDiagnostics(value.diagnostics);
  if (!diagnostics.ok) return diagnostics;
  const productions = parseProductions(value.productions);
  if (!productions.ok) return productions;
  const activities = value.schemaVersion === 1
    ? { ok: true as const, value: {} as Record<string, LearningActivityEntry> }
    : parseActivities(value.activities);
  if (!activities.ok) return activities;

  return {
    ok: true,
    value: {
      schemaVersion: LEARNING_WORKSPACE_SCHEMA_VERSION,
      diagnostics: diagnostics.value,
      productions: productions.value,
      activities: activities.value,
    },
  };
}

export function parseLearningWorkspace(value: unknown): LearningWorkspaceState {
  const parsed = parseLearningWorkspaceResult(value);
  return parsed.ok ? parsed.value : EMPTY_LEARNING_WORKSPACE;
}

export const LEARNING_WORKSPACE_CONTRACT: StorageContract<LearningWorkspaceState> = {
  key: STORAGE_KEYS.learningWorkspace,
  version: 2,
  fallback: EMPTY_LEARNING_WORKSPACE,
  maxBytes: 4_000_000,
  migrations: { 0: (value) => value, 1: (value) => value },
  parse: parseLearningWorkspaceResult,
};

let snapshot: LearningWorkspaceState | null = null;
const listeners = new Set<() => void>();

function readSnapshot(): LearningWorkspaceState {
  if (!snapshot) snapshot = storage.getParsed(LEARNING_WORKSPACE_CONTRACT);
  return snapshot;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function persist(next: LearningWorkspaceState): StorageResult {
  const result = storage.setParsed(LEARNING_WORKSPACE_CONTRACT, next);
  return commitOnStorageSuccess(result, next, (stored) => {
    snapshot = stored;
    emit();
  });
}

function now(): string {
  return new Date().toISOString();
}

export const learningWorkspace = {
  getSnapshot: readSnapshot,
  getServerSnapshot: () => EMPTY_LEARNING_WORKSPACE,
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  saveDiagnosticAnswer(diagnosticId: string, itemId: string, optionId: string): StorageResult {
    const current = readSnapshot();
    const previous = current.diagnostics[diagnosticId];
    const next: LearningWorkspaceState = {
      ...current,
      diagnostics: {
        ...current.diagnostics,
        [diagnosticId]: {
          answers: { ...(previous?.answers ?? {}), [itemId]: optionId },
          updatedAt: now(),
        },
      },
    };
    return persist(next);
  },
  resetDiagnostic(diagnosticId: string): StorageResult {
    const current = readSnapshot();
    const diagnostics = { ...current.diagnostics };
    delete diagnostics[diagnosticId];
    return persist({ ...current, diagnostics });
  },
  completeActivity(parcoursId: string, kind: LearningActivityKind, id: string): StorageResult {
    const reason = inputActivityReason(parcoursId, kind, id);
    if (reason) return { ok: false, reason, operation: 'write', key: STORAGE_KEYS.learningWorkspace, occurredAt: now() };
    const current = readSnapshot();
    const key = learningActivityKey(parcoursId, kind, id);
    const previous = current.activities[key];
    const timestamp = now();
    return persist({
      ...current,
      activities: {
        ...current.activities,
        [key]: {
          parcoursId,
          kind,
          id,
          completed: true,
          completedAt: previous?.completedAt ?? timestamp,
          updatedAt: timestamp,
        },
      },
    });
  },
  updateProduction(
    deliverableId: string,
    patch: Partial<Pick<ProductionWorkspaceEntry, 'note' | 'externalFileProduced' | 'reviewMode' | 'rubricRatings' | 'changeLog'>>,
  ): StorageResult {
    const current = readSnapshot();
    const previous = current.productions[deliverableId];
    const entry: ProductionWorkspaceEntry = {
      ...(previous ?? { stage: 'started' as const }),
      ...patch,
      rubricRatings: patch.rubricRatings
        ? { ...(previous?.rubricRatings ?? {}), ...patch.rubricRatings }
        : previous?.rubricRatings,
      updatedAt: now(),
    };
    return persist({
      ...current,
      productions: { ...current.productions, [deliverableId]: entry },
    });
  },
  advanceProduction(deliverableId: string, stage: ProductionStage): StorageResult {
    const current = readSnapshot();
    const previous = current.productions[deliverableId];
    const currentStage = previous?.stage ?? 'started';
    const nextStage = STAGE_ORDER[stage] >= STAGE_ORDER[currentStage] ? stage : currentStage;
    const entry: ProductionWorkspaceEntry = {
      ...(previous ?? {}),
      stage: nextStage,
      updatedAt: now(),
    };
    return persist({ ...current, productions: { ...current.productions, [deliverableId]: entry } });
  },
  revealCorrection(deliverableId: string): StorageResult {
    const current = readSnapshot();
    const previous = current.productions[deliverableId];
    if (!previous || STAGE_ORDER[previous.stage] < STAGE_ORDER['first-version-completed']) {
      return { ok: false, reason: 'unavailable', operation: 'write', key: STORAGE_KEYS.learningWorkspace, occurredAt: now() };
    }
    if (previous.correctionRevealedAt) return { ok: true };
    return persist({
      ...current,
      productions: {
        ...current.productions,
        [deliverableId]: { ...previous, correctionRevealedAt: now(), updatedAt: now() },
      },
    });
  },
  declareComplete(deliverableId: string): StorageResult {
    const current = readSnapshot();
    const previous = current.productions[deliverableId];
    const hasRequiredEvidence = Boolean(
      previous?.note?.trim()
      && previous.externalFileProduced
      && previous.reviewMode
      && previous.changeLog?.trim()
      && previous.rubricRatings
      && Object.keys(previous.rubricRatings).length > 0,
    );
    if (!previous || previous.stage !== 'revised' || !hasRequiredEvidence) {
      return { ok: false, reason: 'unavailable', operation: 'write', key: STORAGE_KEYS.learningWorkspace, occurredAt: now() };
    }
    return persist({
      ...current,
      productions: {
        ...current.productions,
        [deliverableId]: { ...previous, declaredCompleteAt: previous.declaredCompleteAt ?? now(), updatedAt: now() },
      },
    });
  },
  /** Test helper and storage-event hook. */
  reload(): void {
    snapshot = null;
    emit();
  },
};

export function useLearningWorkspace(): LearningWorkspaceState {
  useEffect(() => {
    storage.migrate(LEARNING_WORKSPACE_CONTRACT);
  }, []);
  return useSyncExternalStore(
    learningWorkspace.subscribe,
    learningWorkspace.getSnapshot,
    learningWorkspace.getServerSnapshot,
  );
}

export function productionStageAtLeast(stage: ProductionStage | undefined, minimum: ProductionStage): boolean {
  return stage ? STAGE_ORDER[stage] >= STAGE_ORDER[minimum] : false;
}

export function isLearningActivityComplete(
  workspace: LearningWorkspaceState,
  parcoursId: string,
  kind: LearningActivityKind,
  id: string,
): boolean {
  return workspace.activities[learningActivityKey(parcoursId, kind, id)]?.completed === true;
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== `${STORAGE_PREFIX}${STORAGE_KEYS.learningWorkspace}`) return;
    snapshot = storage.parseStored(LEARNING_WORKSPACE_CONTRACT, event.newValue);
    emit();
  });
}
