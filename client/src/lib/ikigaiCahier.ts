/**
 * Local persistence for the Ikigai "cahier d'introspection".
 *
 * Everything here works in guest mode (localStorage) without ever touching the
 * network. Free-text answers are only *sent* anywhere on an explicit save
 * action (see `UserDataContext.addNote` usage in the cahier UI). The previous
 * orientation result is preserved as history when the test is re-taken.
 */
import type { IkigaiMode, UserProfile } from '@/content/types';
import {
  storage,
  STORAGE_KEYS,
  STORAGE_SUCCESS,
  type StorageContract,
  type StorageParseFailureReason,
  type StorageParseResult,
  type StorageResult,
} from '@/lib/storage';

export const NOTE_SOURCE = 'ikigai-cahier';

/** key = `${mode}-${questionN}` → free-text answer. */
export type CahierAnswers = Record<string, string>;

export interface IkigaiHistoryEntry {
  profileType: string;
  timeBudget?: string;
  scores?: Record<string, number>;
  archetype?: string;
  takenAt: string;
}

export const IKIGAI_STORAGE_LIMITS = Object.freeze({
  id: 200,
  shortText: 500,
  freeText: 20_000,
  answers: 100,
  history: 12,
  scoreAxes: 100,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

function success<T>(value: T): StorageParseResult<T> {
  return { ok: true, value };
}

function failure<T>(reason: StorageParseFailureReason): StorageParseResult<T> {
  return { ok: false, reason };
}

function answersParser(value: unknown): StorageParseResult<CahierAnswers> {
  if (!isRecord(value)) return failure('validation');
  if (Object.keys(value).length > IKIGAI_STORAGE_LIMITS.answers) return failure('limit');
  for (const [key, answer] of Object.entries(value)) {
    const reason = stringReason(key, IKIGAI_STORAGE_LIMITS.id)
      ?? stringReason(answer, IKIGAI_STORAGE_LIMITS.freeText, true);
    if (reason) return failure(reason);
  }
  return success(value as CahierAnswers);
}

function scoresReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  if (Object.keys(value).length > IKIGAI_STORAGE_LIMITS.scoreAxes) return 'limit';
  for (const [axis, score] of Object.entries(value)) {
    const reason = stringReason(axis, IKIGAI_STORAGE_LIMITS.id);
    if (reason) return reason;
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 1_000_000) return 'validation';
  }
  return null;
}

function historyEntryReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  return stringReason(value.profileType, IKIGAI_STORAGE_LIMITS.id)
    ?? optionalStringReason(value.timeBudget, IKIGAI_STORAGE_LIMITS.shortText)
    ?? (value.scores === undefined ? null : scoresReason(value.scores))
    ?? optionalStringReason(value.archetype, IKIGAI_STORAGE_LIMITS.id)
    ?? dateReason(value.takenAt);
}

function historyParser(value: unknown): StorageParseResult<IkigaiHistoryEntry[]> {
  if (!Array.isArray(value)) return failure('validation');
  if (value.length > IKIGAI_STORAGE_LIMITS.history) return failure('limit');
  for (const entry of value) {
    const reason = historyEntryReason(entry);
    if (reason) return failure(reason);
  }
  return success(value as IkigaiHistoryEntry[]);
}

function v1Contract<T>(
  key: string,
  fallback: T,
  maxBytes: number,
  parse: (value: unknown) => StorageParseResult<T>,
): StorageContract<T> {
  return {
    key,
    version: 1,
    fallback,
    maxBytes,
    migrations: { 0: (value) => value },
    parse,
  };
}

export const IKIGAI_CONTRACTS = {
  answers: v1Contract<CahierAnswers>(STORAGE_KEYS.ikigaiAnswers, {}, 2_000_000, answersParser),
  mode: v1Contract<IkigaiMode>(STORAGE_KEYS.ikigaiMode, 'decouverte', 256, (value) => (
    value === 'decouverte' || value === 'avance' ? success(value) : failure('validation')
  )),
  archetype: v1Contract<string | null>(STORAGE_KEYS.ikigaiArchetype, null, 512, (value) => {
    if (value === null) return success(null);
    const reason = stringReason(value, IKIGAI_STORAGE_LIMITS.id);
    return reason ? failure(reason) : success(value as string);
  }),
  history: v1Contract<IkigaiHistoryEntry[]>(STORAGE_KEYS.ikigaiHistory, [], 1_000_000, historyParser),
};

export function migrateIkigaiStorage(): StorageResult {
  const results = [
    storage.migrate(IKIGAI_CONTRACTS.mode),
    storage.migrate(IKIGAI_CONTRACTS.answers),
    storage.migrate(IKIGAI_CONTRACTS.archetype),
    storage.migrate(IKIGAI_CONTRACTS.history),
  ];
  return results.find((result) => !result.ok) ?? STORAGE_SUCCESS;
}

export const answerKey = (mode: IkigaiMode, n: string) => `${mode}-${n}`;

// ── Reading level (Découverte / Avancé) default ─────────────────────────────
export function getReadingMode(): IkigaiMode {
  return storage.getParsed(IKIGAI_CONTRACTS.mode);
}
export function setReadingMode(mode: IkigaiMode): StorageResult {
  return storage.setParsed(IKIGAI_CONTRACTS.mode, mode);
}

// ── Cahier free-text answers ────────────────────────────────────────────────
export function getCahierAnswers(): CahierAnswers {
  return storage.getParsed(IKIGAI_CONTRACTS.answers);
}
export function setCahierAnswers(answers: CahierAnswers): StorageResult {
  return storage.setParsed(IKIGAI_CONTRACTS.answers, answers);
}
/** Number of non-empty answers across both reading modes. */
export function countAnswered(answers: CahierAnswers): number {
  return Object.values(answers).filter((v) => v.trim().length > 0).length;
}

// ── Chosen archetype ────────────────────────────────────────────────────────
export function getChosenArchetype(): string | null {
  return storage.getParsed(IKIGAI_CONTRACTS.archetype);
}
export function setChosenArchetype(id: string | null): StorageResult {
  return id
    ? storage.setParsed(IKIGAI_CONTRACTS.archetype, id)
    : storage.remove(IKIGAI_CONTRACTS.archetype.key);
}

// ── Orientation history (kept on retake) ────────────────────────────────────
export function getHistory(): IkigaiHistoryEntry[] {
  return storage.getParsed(IKIGAI_CONTRACTS.history);
}
/** Archive the current saved profile before it is overwritten by a retake. */
export function archiveProfile(profile: UserProfile | null): StorageResult {
  if (!profile?.profileType) return STORAGE_SUCCESS;
  const entry: IkigaiHistoryEntry = {
    profileType: profile.profileType,
    timeBudget: profile.timeBudget,
    scores: profile.scores,
    archetype: getChosenArchetype() ?? undefined,
    takenAt: new Date().toISOString(),
  };
  const next = [entry, ...getHistory()].slice(0, IKIGAI_STORAGE_LIMITS.history);
  return storage.setParsed(IKIGAI_CONTRACTS.history, next);
}
