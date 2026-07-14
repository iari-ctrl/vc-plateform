/** Namespaced localStorage helpers for local-first persistence. */

const PREFIX = 'vcpx:';

export type StorageFailureReason = 'quota' | 'unavailable' | 'serialization' | 'unreadable';
export type StorageOperation = 'read' | 'write' | 'remove';

export interface StorageFailure {
  ok: false;
  reason: StorageFailureReason;
  operation: StorageOperation;
  key: string;
  occurredAt: string;
}

export interface StorageSuccess {
  ok: true;
}

export type StorageResult = StorageSuccess | StorageFailure;

export const STORAGE_SUCCESS: StorageSuccess = Object.freeze({ ok: true });

type StorageErrorListener = () => void;

let lastStorageFailure: StorageFailure | null = null;
const storageErrorListeners = new Set<StorageErrorListener>();

function publishStorageFailure(failure: StorageFailure | null) {
  lastStorageFailure = failure;
  storageErrorListeners.forEach((listener) => listener());
}

function failure(reason: StorageFailureReason, operation: StorageOperation, key: string): StorageFailure {
  const result: StorageFailure = {
    ok: false,
    reason,
    operation,
    key,
    occurredAt: new Date().toISOString(),
  };
  publishStorageFailure(result);
  return result;
}

function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { code?: number; name?: string };
  return candidate.name === 'QuotaExceededError'
    || candidate.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || candidate.code === 22
    || candidate.code === 1014;
}

/** Observable registry used by the single global persistence alert. */
export const storageErrors = {
  getSnapshot(): StorageFailure | null {
    return lastStorageFailure;
  },
  subscribe(listener: StorageErrorListener): () => void {
    storageErrorListeners.add(listener);
    return () => storageErrorListeners.delete(listener);
  },
  clear(): void {
    if (lastStorageFailure) publishStorageFailure(null);
  },
};

export const storage = {
  get<T>(key: string, fallback: T): T {
    let raw: string | null;
    try {
      raw = localStorage.getItem(PREFIX + key);
    } catch {
      failure('unavailable', 'read', key);
      return fallback;
    }

    if (raw === null) return fallback;

    try {
      return JSON.parse(raw) as T;
    } catch {
      failure('unreadable', 'read', key);
      return fallback;
    }
  },
  set<T>(key: string, value: T): StorageResult {
    let serialized: string;
    try {
      const result = JSON.stringify(value);
      if (result === undefined) return failure('serialization', 'write', key);
      serialized = result;
    } catch {
      return failure('serialization', 'write', key);
    }

    try {
      localStorage.setItem(PREFIX + key, serialized);
      return STORAGE_SUCCESS;
    } catch (error) {
      return failure(isQuotaError(error) ? 'quota' : 'unavailable', 'write', key);
    }
  },
  remove(key: string): StorageResult {
    try {
      localStorage.removeItem(PREFIX + key);
      return STORAGE_SUCCESS;
    } catch {
      return failure('unavailable', 'remove', key);
    }
  },
};

export const STORAGE_KEYS = {
  theme: 'theme',
  profile: 'profile',
  notes: 'notes',
  bookmarks: 'bookmarks',
  progress: 'progress',
  journal: 'decision-journal',
  highlights: 'highlights',
  onboardingSeen: 'onboarding-seen',
  /** Reader depth preference for lessons that ship both versions ('court' | 'profond'). */
  readingDepth: 'reading-depth',
  // ── Ikigai "cahier d'introspection" ──
  ikigaiMode: 'ikigai-reading-mode',
  ikigaiAnswers: 'ikigai-cahier-answers',
  ikigaiArchetype: 'ikigai-archetype',
  ikigaiHistory: 'ikigai-history',
} as const;
