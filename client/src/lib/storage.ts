/** Namespaced localStorage helpers for local-first persistence. */

export const STORAGE_PREFIX = 'vcpx:';

export type StorageFailureReason =
  | 'quota'
  | 'unavailable'
  | 'serialization'
  | 'unreadable'
  | 'validation'
  | 'version'
  | 'limit';
export type StorageOperation = 'read' | 'write' | 'remove';

export type StorageParseFailureReason = Extract<StorageFailureReason, 'validation' | 'limit'>;

export type StorageParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: StorageParseFailureReason };

export interface StorageLegacyKey {
  key: string;
  decode(raw: string): unknown;
}

export interface StorageContract<T> {
  key: string;
  version: number;
  fallback: T;
  /** Maximum UTF-8 size of the complete persisted envelope. */
  maxBytes: number;
  parse(value: unknown): StorageParseResult<T>;
  /** Sequential migrations keyed by the source version; unversioned data is version 0. */
  migrations?: Partial<Record<number, (value: unknown) => unknown>>;
  /** Historical keys outside the vcpx namespace, read only when the current key is absent. */
  legacyKeys?: readonly StorageLegacyKey[];
}

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

/** Apply an in-memory state transition only when its persistence operation succeeded. */
export function commitOnStorageSuccess<T>(
  result: StorageResult,
  value: T,
  commit: (value: T) => void,
): StorageResult {
  if (result.ok) commit(value);
  return result;
}

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

interface ParsedStoredValue<T> {
  value: T;
  sourceVersion: number;
  needsMigration: boolean;
}

type StoredValueResult<T> =
  | { ok: true; parsed: ParsedStoredValue<T> }
  | { ok: false; reason: 'unreadable' | 'validation' | 'version' | 'limit' };

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasStoredEnvelope(value: unknown): value is { storageVersion: number; value: unknown } {
  if (!isRecord(value)) return false;
  const storageVersion = value.storageVersion;
  return typeof storageVersion === 'number'
    && Number.isInteger(storageVersion)
    && storageVersion >= 1
    && Object.hasOwn(value, 'value');
}

function parseVersionedValue<T>(
  contract: StorageContract<T>,
  initialValue: unknown,
  sourceVersion: number,
): StoredValueResult<T> {
  if (sourceVersion > contract.version) return { ok: false, reason: 'version' };

  let value = initialValue;
  let version = sourceVersion;
  try {
    while (version < contract.version) {
      const migration = contract.migrations?.[version];
      if (!migration) return { ok: false, reason: 'version' };
      value = migration(value);
      version += 1;
    }
  } catch {
    return { ok: false, reason: 'validation' };
  }

  const parsed = contract.parse(value);
  if (!parsed.ok) return parsed;
  return {
    ok: true,
    parsed: {
      value: parsed.value,
      sourceVersion,
      needsMigration: sourceVersion !== contract.version,
    },
  };
}

function parseStoredRaw<T>(contract: StorageContract<T>, raw: string): StoredValueResult<T> {
  if (byteLength(raw) > contract.maxBytes) return { ok: false, reason: 'limit' };

  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'unreadable' };
  }

  return hasStoredEnvelope(decoded)
    ? parseVersionedValue(contract, decoded.value, decoded.storageVersion)
    : parseVersionedValue(contract, decoded, 0);
}

function readRaw(storageKey: string, logicalKey: string): { ok: true; raw: string | null } | { ok: false } {
  try {
    return { ok: true, raw: localStorage.getItem(storageKey) };
  } catch {
    failure('unavailable', 'read', logicalKey);
    return { ok: false };
  }
}

function legacyStoredValue<T>(
  contract: StorageContract<T>,
): { raw: string; legacyKey: StorageLegacyKey; parsed: ParsedStoredValue<T> } | null {
  for (const legacyKey of contract.legacyKeys ?? []) {
    const read = readRaw(legacyKey.key, contract.key);
    if (!read.ok) return null;
    if (read.raw === null) continue;
    if (byteLength(read.raw) > contract.maxBytes) {
      failure('limit', 'read', contract.key);
      return null;
    }
    let decoded: unknown;
    try {
      decoded = legacyKey.decode(read.raw);
    } catch {
      failure('unreadable', 'read', contract.key);
      return null;
    }
    const result = parseVersionedValue(contract, decoded, 0);
    if (!result.ok) {
      failure(result.reason, 'read', contract.key);
      return null;
    }
    return { raw: read.raw, legacyKey, parsed: result.parsed };
  }
  return null;
}

function archiveRaw(key: string, sourceVersion: number, raw: string): StorageResult {
  const archiveKey = `archive:${key}:v${sourceVersion}`;
  try {
    const qualifiedKey = STORAGE_PREFIX + archiveKey;
    if (localStorage.getItem(qualifiedKey) === null) localStorage.setItem(qualifiedKey, raw);
    return STORAGE_SUCCESS;
  } catch (error) {
    return failure(isQuotaError(error) ? 'quota' : 'unavailable', 'write', archiveKey);
  }
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
  /** @deprecated Product persistence must use getParsed with a runtime-validated contract. */
  get<T>(key: string, fallback: T): T {
    let raw: string | null;
    try {
      raw = localStorage.getItem(STORAGE_PREFIX + key);
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
  /** @deprecated Product persistence must use setParsed with a runtime-validated contract. */
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
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
      return STORAGE_SUCCESS;
    } catch (error) {
      return failure(isQuotaError(error) ? 'quota' : 'unavailable', 'write', key);
    }
  },
  remove(key: string): StorageResult {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return STORAGE_SUCCESS;
    } catch {
      return failure('unavailable', 'remove', key);
    }
  },
  getParsed<T>(contract: StorageContract<T>): T {
    const current = readRaw(STORAGE_PREFIX + contract.key, contract.key);
    if (!current.ok) return contract.fallback;

    if (current.raw === null) {
      return legacyStoredValue(contract)?.parsed.value ?? contract.fallback;
    }

    const result = parseStoredRaw(contract, current.raw);
    if (!result.ok) {
      failure(result.reason, 'read', contract.key);
      return contract.fallback;
    }
    return result.parsed.value;
  },
  parseStored<T>(contract: StorageContract<T>, raw: string | null): T {
    if (raw === null) return contract.fallback;
    const result = parseStoredRaw(contract, raw);
    if (!result.ok) {
      failure(result.reason, 'read', contract.key);
      return contract.fallback;
    }
    return result.parsed.value;
  },
  setParsed<T>(contract: StorageContract<T>, value: T): StorageResult {
    const parsed = contract.parse(value);
    if (!parsed.ok) return failure(parsed.reason, 'write', contract.key);

    let serialized: string;
    try {
      serialized = JSON.stringify({ storageVersion: contract.version, value: parsed.value });
    } catch {
      return failure('serialization', 'write', contract.key);
    }
    if (byteLength(serialized) > contract.maxBytes) return failure('limit', 'write', contract.key);

    try {
      localStorage.setItem(STORAGE_PREFIX + contract.key, serialized);
      return STORAGE_SUCCESS;
    } catch (error) {
      return failure(isQuotaError(error) ? 'quota' : 'unavailable', 'write', contract.key);
    }
  },
  migrate<T>(contract: StorageContract<T>): StorageResult {
    const failureBeforeLookup = lastStorageFailure;
    const current = readRaw(STORAGE_PREFIX + contract.key, contract.key);
    if (!current.ok) return lastStorageFailure!;

    if (current.raw !== null) {
      const result = parseStoredRaw(contract, current.raw);
      if (!result.ok) return failure(result.reason, 'read', contract.key);
      if (!result.parsed.needsMigration) return STORAGE_SUCCESS;

      const archived = archiveRaw(contract.key, result.parsed.sourceVersion, current.raw);
      if (!archived.ok) return archived;
      return this.setParsed(contract, result.parsed.value);
    }

    const legacy = legacyStoredValue(contract);
    if (!legacy) {
      return lastStorageFailure !== failureBeforeLookup && lastStorageFailure
        ? lastStorageFailure
        : STORAGE_SUCCESS;
    }
    const archived = archiveRaw(contract.key, 0, legacy.raw);
    if (!archived.ok) return archived;
    const written = this.setParsed(contract, legacy.parsed.value);
    if (!written.ok) return written;
    try {
      localStorage.removeItem(legacy.legacyKey.key);
      return STORAGE_SUCCESS;
    } catch {
      return failure('unavailable', 'remove', contract.key);
    }
  },
};

/** Historical product keys intentionally no longer read or written by the application. */
export const ABANDONED_STORAGE_KEYS = Object.freeze([
  'highlights',
  'onboarding-seen',
] as const);

export const STORAGE_KEYS = {
  theme: 'theme',
  profile: 'profile',
  notes: 'notes',
  bookmarks: 'bookmarks',
  progress: 'progress',
  learningWorkspace: 'learning-workspace',
  certificationEnrollments: 'certification-enrollments',
  certificationAssessments: 'certification-assessments',
  journal: 'decision-journal',
  onboardingMode: 'onboarding-mode',
  /** Reader depth preference for lessons that ship both versions ('court' | 'profond'). */
  readingDepth: 'reading-depth',
  // ── Ikigai "cahier d'introspection" ──
  ikigaiMode: 'ikigai-reading-mode',
  ikigaiAnswers: 'ikigai-cahier-answers',
  ikigaiArchetype: 'ikigai-archetype',
  ikigaiHistory: 'ikigai-history',
} as const;
