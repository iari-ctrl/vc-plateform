import type { CertificationEnrollment, CertificationSelection } from '@/content/certificationTypes';
import type {
  Bookmark,
  DecisionJournalEntry,
  Note,
  OnboardingMode,
  ProgressEntry,
  UserProfile,
} from '@/content/types';
import type { Theme } from '@/context/ThemeContext';
import {
  STORAGE_KEYS,
  type StorageContract,
  type StorageParseFailureReason,
  type StorageParseResult,
} from './storage';

export type ReadingDepth = 'court' | 'profond';
export type EnrollmentMap = Record<string, CertificationEnrollment>;

export const STORAGE_LIMITS = Object.freeze({
  id: 200,
  shortText: 500,
  freeText: 20_000,
  url: 2_048,
  notes: 500,
  bookmarks: 1_000,
  progress: 5_000,
  journal: 500,
  journalLinks: 50,
  enrollments: 100,
  scoreAxes: 100,
});

const INVALID = Object.freeze({ ok: false, reason: 'validation' as const });
const LIMIT = Object.freeze({ ok: false, reason: 'limit' as const });
const IDENTITY_MIGRATION = Object.freeze({ 0: (value: unknown) => value });

function valid<T>(value: T): StorageParseResult<T> {
  return { ok: true, value };
}

function failure<T>(reason: StorageParseFailureReason): StorageParseResult<T> {
  return reason === 'limit' ? LIMIT : INVALID;
}

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

function internalHrefReason(value: unknown): StorageParseFailureReason | null {
  const reason = stringReason(value, STORAGE_LIMITS.url);
  if (reason) return reason;
  const href = value as string;
  const hasControlCharacter = Array.from(href).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
  if (!href.startsWith('/')
    || href.startsWith('//')
    || href.includes('\\')
    || hasControlCharacter) return 'validation';
  try {
    const base = new URL('https://vc-platform.invalid');
    return new URL(href, base).origin === base.origin ? null : 'validation';
  } catch {
    return 'validation';
  }
}

function dateReason(value: unknown): StorageParseFailureReason | null {
  const reason = stringReason(value, 100);
  if (reason) return reason;
  return Number.isFinite(Date.parse(value as string)) ? null : 'validation';
}

function arrayReason(
  value: unknown,
  maxItems: number,
  itemReason: (item: unknown) => StorageParseFailureReason | null,
): StorageParseFailureReason | null {
  if (!Array.isArray(value)) return 'validation';
  if (value.length > maxItems) return 'limit';
  for (const item of value) {
    const reason = itemReason(item);
    if (reason) return reason;
  }
  return null;
}

function recordSizeReason(value: Record<string, unknown>, maxItems: number): StorageParseFailureReason | null {
  return Object.keys(value).length > maxItems ? 'limit' : null;
}

function profileReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  let reason = stringReason(value.profileType, STORAGE_LIMITS.id)
    ?? optionalStringReason(value.timeBudget, STORAGE_LIMITS.shortText);
  if (reason || value.scores === undefined) return reason;
  if (!isRecord(value.scores)) return 'validation';
  reason = recordSizeReason(value.scores, STORAGE_LIMITS.scoreAxes);
  if (reason) return reason;
  for (const [key, score] of Object.entries(value.scores)) {
    reason = stringReason(key, STORAGE_LIMITS.id);
    if (reason) return reason;
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 1_000_000) return 'validation';
  }
  return null;
}

function noteReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  const reason = stringReason(value.id, STORAGE_LIMITS.id)
    ?? stringReason(value.body, STORAGE_LIMITS.freeText, true)
    ?? dateReason(value.createdAt)
    ?? optionalStringReason(value.sourceType, STORAGE_LIMITS.id)
    ?? optionalStringReason(value.sourceId, STORAGE_LIMITS.id)
    ?? optionalStringReason(value.sourceTitle, STORAGE_LIMITS.shortText);
  if (reason) return reason;
  if (value.kind !== 'note' && value.kind !== 'quote' && value.kind !== 'highlight') return 'validation';
  return null;
}

function bookmarkReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  return optionalStringReason(value.id, STORAGE_LIMITS.id)
    ?? stringReason(value.itemType, STORAGE_LIMITS.id)
    ?? stringReason(value.itemId, STORAGE_LIMITS.id)
    ?? stringReason(value.title, STORAGE_LIMITS.shortText)
    ?? internalHrefReason(value.href)
    ?? (value.createdAt === undefined ? null : dateReason(value.createdAt));
}

function progressEntryReason(value: unknown, recordKey: string): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  const reason = stringReason(recordKey, STORAGE_LIMITS.id)
    ?? stringReason(value.lessonId, STORAGE_LIMITS.id)
    ?? optionalStringReason(value.courseId, STORAGE_LIMITS.id)
    ?? optionalStringReason(value.pathId, STORAGE_LIMITS.id);
  if (reason) return reason;
  if (value.lessonId !== recordKey) return 'validation';
  if (value.status !== 'reading' && value.status !== 'done') return 'validation';
  return typeof value.percent === 'number'
    && Number.isFinite(value.percent)
    && value.percent >= 0
    && value.percent <= 100
    ? null
    : 'validation';
}

function progressReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  let reason = recordSizeReason(value, STORAGE_LIMITS.progress);
  if (reason) return reason;
  for (const [key, entry] of Object.entries(value)) {
    reason = progressEntryReason(entry, key);
    if (reason) return reason;
  }
  return null;
}

const JOURNAL_CATEGORIES = new Set(['deal', 'marche', 'fonds', 'these', 'carriere', 'autre']);
const JOURNAL_OUTCOMES = new Set(['correct', 'incorrect', 'void']);

function journalLinkReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  return stringReason(value.type, STORAGE_LIMITS.id)
    ?? stringReason(value.id, STORAGE_LIMITS.id)
    ?? stringReason(value.title, STORAGE_LIMITS.shortText)
    ?? internalHrefReason(value.href);
}

function journalEntryReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  let reason = stringReason(value.id, STORAGE_LIMITS.id)
    ?? stringReason(value.statement, STORAGE_LIMITS.freeText)
    ?? optionalStringReason(value.rationale, STORAGE_LIMITS.freeText)
    ?? dateReason(value.createdAt)
    ?? dateReason(value.reviewAt)
    ?? optionalStringReason(value.resolutionNote, STORAGE_LIMITS.freeText)
    ?? (value.resolvedAt === undefined ? null : dateReason(value.resolvedAt));
  if (reason) return reason;
  if (typeof value.confidence !== 'number' || !Number.isInteger(value.confidence) || value.confidence < 50 || value.confidence > 99) {
    return 'validation';
  }
  if (!JOURNAL_CATEGORIES.has(value.category as string)) return 'validation';
  if (value.status !== 'open' && value.status !== 'resolved') return 'validation';
  if (value.outcome !== undefined && !JOURNAL_OUTCOMES.has(value.outcome as string)) return 'validation';
  reason = arrayReason(value.links, STORAGE_LIMITS.journalLinks, journalLinkReason);
  return reason;
}

const FUND_STAGES = new Set(['pre-seed', 'seed', 'series-a', 'growth']);
const DEAL_ROLES = new Set(['lead', 'co-lead', 'follower']);
const SPECIALTIES = new Set([
  'generalist',
  'saas',
  'deeptech',
  'climate',
  'health-biotech',
  'consumer-marketplaces',
  'impact',
]);

function selectionReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  const allowedKeys = new Set(['fundStage', 'dealRole', 'specialty']);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return 'validation';
  if (value.fundStage !== undefined && !FUND_STAGES.has(value.fundStage as string)) return 'validation';
  if (value.dealRole !== undefined && !DEAL_ROLES.has(value.dealRole as string)) return 'validation';
  if (value.specialty !== undefined && !SPECIALTIES.has(value.specialty as string)) return 'validation';
  return null;
}

function enrollmentReason(value: unknown, recordKey: string): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  const reason = stringReason(recordKey, STORAGE_LIMITS.id)
    ?? stringReason(value.certificationId, STORAGE_LIMITS.id)
    ?? selectionReason(value.selection)
    ?? dateReason(value.createdAt)
    ?? dateReason(value.updatedAt);
  if (reason) return reason;
  return value.certificationId === recordKey ? null : 'validation';
}

function enrollmentMapReason(value: unknown): StorageParseFailureReason | null {
  if (!isRecord(value)) return 'validation';
  let reason = recordSizeReason(value, STORAGE_LIMITS.enrollments);
  if (reason) return reason;
  for (const [key, enrollment] of Object.entries(value)) {
    reason = enrollmentReason(enrollment, key);
    if (reason) return reason;
  }
  return null;
}

function v1Contract<T>(
  key: string,
  fallback: T,
  maxBytes: number,
  parse: (value: unknown) => StorageParseResult<T>,
  legacyKeys?: StorageContract<T>['legacyKeys'],
): StorageContract<T> {
  return {
    key,
    version: 1,
    fallback,
    maxBytes,
    migrations: IDENTITY_MIGRATION,
    parse,
    legacyKeys,
  };
}

const theme = v1Contract<Theme | null>(STORAGE_KEYS.theme, null, 256, (value) => (
  value === null || value === 'light' || value === 'dark' ? valid(value) : INVALID
));

const profile = v1Contract<UserProfile | null>(STORAGE_KEYS.profile, null, 32_768, (value) => {
  if (value === null) return valid(null);
  const reason = profileReason(value);
  return reason ? failure(reason) : valid(value as unknown as UserProfile);
});

const notes = v1Contract<Note[]>(STORAGE_KEYS.notes, [], 4_000_000, (value) => {
  const reason = arrayReason(value, STORAGE_LIMITS.notes, noteReason);
  return reason ? failure(reason) : valid(value as Note[]);
});

const bookmarks = v1Contract<Bookmark[]>(STORAGE_KEYS.bookmarks, [], 2_000_000, (value) => {
  const reason = arrayReason(value, STORAGE_LIMITS.bookmarks, bookmarkReason);
  return reason ? failure(reason) : valid(value as Bookmark[]);
});

const progress = v1Contract<Record<string, ProgressEntry>>(STORAGE_KEYS.progress, {}, 4_000_000, (value) => {
  const reason = progressReason(value);
  return reason ? failure(reason) : valid(value as Record<string, ProgressEntry>);
});

const journal = v1Contract<DecisionJournalEntry[]>(STORAGE_KEYS.journal, [], 8_000_000, (value) => {
  const reason = arrayReason(value, STORAGE_LIMITS.journal, journalEntryReason);
  return reason ? failure(reason) : valid(value as DecisionJournalEntry[]);
});

const onboardingMode = v1Contract<OnboardingMode>(
  STORAGE_KEYS.onboardingMode,
  'editorial',
  256,
  (value) => value === 'editorial' || value === 'bref' || value === 'interactif'
    ? valid(value)
    : INVALID,
  [{ key: 'onboardingMode', decode: (raw) => raw }],
);

const certificationEnrollments = v1Contract<EnrollmentMap>(
  STORAGE_KEYS.certificationEnrollments,
  {},
  1_000_000,
  (value) => {
    const reason = enrollmentMapReason(value);
    return reason ? failure(reason) : valid(value as EnrollmentMap);
  },
);

const readingDepth = v1Contract<ReadingDepth>(STORAGE_KEYS.readingDepth, 'court', 256, (value) => (
  value === 'court' || value === 'profond' ? valid(value) : INVALID
));

export const STORAGE_CONTRACTS = Object.freeze({
  theme,
  profile,
  notes,
  bookmarks,
  progress,
  journal,
  onboardingMode,
  certificationEnrollments,
  readingDepth,
});

export function parseCertificationSelection(value: unknown): StorageParseResult<CertificationSelection> {
  const reason = selectionReason(value);
  return reason ? failure(reason) : valid(value as CertificationSelection);
}
