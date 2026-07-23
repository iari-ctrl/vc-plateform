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

export const LEARNING_WORKSPACE_SCHEMA_VERSION = 1 as const;

export const LEARNING_WORKSPACE_LIMITS = Object.freeze({
  id: 200,
  freeText: 20_000,
  shortText: 500,
  diagnostics: 100,
  productions: 200,
  answersPerDiagnostic: 100,
  ratingsPerProduction: 100,
});

export type ProductionStage = 'started' | 'first-version-completed' | 'reviewed' | 'revised';
export type ReviewMode = 'self' | 'peer' | 'practitioner';

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

export interface LearningWorkspaceState {
  schemaVersion: typeof LEARNING_WORKSPACE_SCHEMA_VERSION;
  diagnostics: Record<string, DiagnosticWorkspaceEntry>;
  productions: Record<string, ProductionWorkspaceEntry>;
}

export const EMPTY_LEARNING_WORKSPACE: LearningWorkspaceState = Object.freeze({
  schemaVersion: LEARNING_WORKSPACE_SCHEMA_VERSION,
  diagnostics: {},
  productions: {},
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

function parseLearningWorkspaceResult(value: unknown): StorageParseResult<LearningWorkspaceState> {
  if (
    !isRecord(value)
    || value.schemaVersion !== LEARNING_WORKSPACE_SCHEMA_VERSION
    || !isRecord(value.diagnostics)
    || !isRecord(value.productions)
  ) return failure('validation');

  if (Object.keys(value.diagnostics).length > LEARNING_WORKSPACE_LIMITS.diagnostics) return failure('limit');
  if (Object.keys(value.productions).length > LEARNING_WORKSPACE_LIMITS.productions) return failure('limit');

  const diagnostics: Record<string, DiagnosticWorkspaceEntry> = {};
  for (const [id, entry] of Object.entries(value.diagnostics)) {
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

  const productions: Record<string, ProductionWorkspaceEntry> = {};
  for (const [id, entry] of Object.entries(value.productions)) {
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

  return {
    ok: true,
    value: { schemaVersion: LEARNING_WORKSPACE_SCHEMA_VERSION, diagnostics, productions },
  };
}

export function parseLearningWorkspace(value: unknown): LearningWorkspaceState {
  const parsed = parseLearningWorkspaceResult(value);
  return parsed.ok ? parsed.value : EMPTY_LEARNING_WORKSPACE;
}

export const LEARNING_WORKSPACE_CONTRACT: StorageContract<LearningWorkspaceState> = {
  key: STORAGE_KEYS.learningWorkspace,
  version: 1,
  fallback: EMPTY_LEARNING_WORKSPACE,
  maxBytes: 4_000_000,
  migrations: { 0: (value) => value },
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
    if (!previous || previous.stage !== 'revised') {
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

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== `${STORAGE_PREFIX}${STORAGE_KEYS.learningWorkspace}`) return;
    snapshot = storage.parseStored(LEARNING_WORKSPACE_CONTRACT, event.newValue);
    emit();
  });
}
