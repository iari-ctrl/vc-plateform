import { CERTIFICATION_ASSESSMENT_CONTRACT } from './certificationAssessment';
import { IKIGAI_CONTRACTS } from './ikigaiCahier';
import { LEARNING_WORKSPACE_CONTRACT } from './learningWorkspace';
import {
  STORAGE_PREFIX,
  type StorageContract,
  type StorageFailure,
  type StorageFailureReason,
  type StorageResult,
} from './storage';
import { STORAGE_CONTRACTS } from './storageDomains';

export const LOCAL_DATA_EXPORT_FORMAT_VERSION = 1 as const;
export const LOCAL_DATA_EXPORT_ORIGIN = 'vc-platform' as const;
export const LOCAL_DATA_EXPORT_MAX_BYTES = 20_000_000;

type ImportFailureReason = Extract<StorageFailureReason, 'unreadable' | 'validation' | 'version' | 'limit' | 'quota' | 'unavailable'>;

interface ProductContract<T = unknown> {
  key: string;
  contract: StorageContract<T>;
}

const PRODUCT_CONTRACTS: readonly ProductContract[] = Object.freeze([
  { key: STORAGE_CONTRACTS.theme.key, contract: STORAGE_CONTRACTS.theme },
  { key: STORAGE_CONTRACTS.profile.key, contract: STORAGE_CONTRACTS.profile },
  { key: STORAGE_CONTRACTS.notes.key, contract: STORAGE_CONTRACTS.notes },
  { key: STORAGE_CONTRACTS.bookmarks.key, contract: STORAGE_CONTRACTS.bookmarks },
  { key: STORAGE_CONTRACTS.progress.key, contract: STORAGE_CONTRACTS.progress },
  { key: STORAGE_CONTRACTS.journal.key, contract: STORAGE_CONTRACTS.journal },
  { key: STORAGE_CONTRACTS.onboardingMode.key, contract: STORAGE_CONTRACTS.onboardingMode },
  { key: STORAGE_CONTRACTS.certificationEnrollments.key, contract: STORAGE_CONTRACTS.certificationEnrollments },
  { key: STORAGE_CONTRACTS.readingDepth.key, contract: STORAGE_CONTRACTS.readingDepth },
  { key: LEARNING_WORKSPACE_CONTRACT.key, contract: LEARNING_WORKSPACE_CONTRACT },
  { key: CERTIFICATION_ASSESSMENT_CONTRACT.key, contract: CERTIFICATION_ASSESSMENT_CONTRACT },
  { key: IKIGAI_CONTRACTS.answers.key, contract: IKIGAI_CONTRACTS.answers },
  { key: IKIGAI_CONTRACTS.mode.key, contract: IKIGAI_CONTRACTS.mode },
  { key: IKIGAI_CONTRACTS.archetype.key, contract: IKIGAI_CONTRACTS.archetype },
  { key: IKIGAI_CONTRACTS.history.key, contract: IKIGAI_CONTRACTS.history },
]);

export const PRODUCT_STORAGE_KEYS = Object.freeze(PRODUCT_CONTRACTS.map(({ key }) => key));
const PRODUCT_CONTRACT_BY_KEY = new Map(PRODUCT_CONTRACTS.map(({ key, contract }) => [key, contract]));

export type LocalDataPayload = Record<string, string | null>;

export interface LocalDataExport {
  formatVersion: typeof LOCAL_DATA_EXPORT_FORMAT_VERSION;
  origin: typeof LOCAL_DATA_EXPORT_ORIGIN;
  exportedAt: string;
  payload: LocalDataPayload;
}

export interface LocalDataDomainPreview {
  key: string;
  present: boolean;
  itemCount: number;
  storageVersion?: number;
  warnings: string[];
}

export type LocalDataPreviewResult =
  | { ok: true; formatVersion: number; exportedAt: string; domains: LocalDataDomainPreview[]; warnings: string[] }
  | { ok: false; reason: ImportFailureReason; message: string };

type RawValidationResult =
  | { ok: true; value: unknown; storageVersion: number }
  | { ok: false; reason: ImportFailureReason };

type ExportParseResult =
  | { ok: true; exportValue: LocalDataExport }
  | { ok: false; reason: ImportFailureReason; message: string };

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function nowIso(): string {
  return new Date().toISOString();
}

function storageFailure(reason: Extract<ImportFailureReason, 'quota' | 'unavailable' | 'validation' | 'limit'>, operation: StorageFailure['operation'], key: string): StorageFailure {
  return {
    ok: false,
    reason,
    operation,
    key,
    occurredAt: nowIso(),
  };
}

function invalidPreview(reason: ImportFailureReason, message: string): LocalDataPreviewResult {
  return { ok: false, reason, message };
}

function storageWriteReason(reason: ImportFailureReason): Extract<ImportFailureReason, 'quota' | 'unavailable' | 'validation' | 'limit'> {
  if (reason === 'quota' || reason === 'unavailable' || reason === 'limit') return reason;
  return 'validation';
}

function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { code?: number; name?: string };
  return candidate.name === 'QuotaExceededError'
    || candidate.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || candidate.code === 22
    || candidate.code === 1014;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateRaw<T>(contract: StorageContract<T>, raw: string): RawValidationResult {
  if (new TextEncoder().encode(raw).byteLength > contract.maxBytes) return { ok: false, reason: 'limit' };
  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'unreadable' };
  }
  if (!isRecord(decoded)
    || typeof decoded.storageVersion !== 'number'
    || !Number.isInteger(decoded.storageVersion)
    || !hasOwn(decoded, 'value')) {
    return { ok: false, reason: 'validation' };
  }
  if (decoded.storageVersion !== contract.version) return { ok: false, reason: 'version' };
  const parsed = contract.parse(decoded.value);
  if (parsed.ok) return { ok: true, value: parsed.value, storageVersion: decoded.storageVersion };
  return { ok: false, reason: (parsed as { ok: false; reason: ImportFailureReason }).reason };
}

function itemCount(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (!isRecord(value)) return value === null ? 0 : 1;
  if (typeof value.profileType === 'string') return 1;
  if (isRecord(value.records)) return Object.keys(value.records).length;
  if (isRecord(value.diagnostics) || isRecord(value.productions)) {
    return Object.keys(value.diagnostics ?? {}).length + Object.keys(value.productions ?? {}).length;
  }
  return Object.keys(value).length || 1;
}

function parseExportText(text: string): ExportParseResult {
  if (new TextEncoder().encode(text).byteLength > LOCAL_DATA_EXPORT_MAX_BYTES) {
    return { ok: false, reason: 'limit', message: 'Le fichier dépasse la taille maximale acceptée.' };
  }

  let decoded: unknown;
  try {
    decoded = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'unreadable', message: 'Le fichier importé n’est pas un JSON lisible.' };
  }

  if (!isRecord(decoded) || !isRecord(decoded.payload)) {
    return { ok: false, reason: 'validation', message: 'Le fichier ne respecte pas le format d’export local.' };
  }
  const payloadRecord = decoded.payload;
  if (decoded.formatVersion !== LOCAL_DATA_EXPORT_FORMAT_VERSION) {
    return { ok: false, reason: 'version', message: 'La version du fichier d’export n’est pas prise en charge.' };
  }
  if (decoded.origin !== LOCAL_DATA_EXPORT_ORIGIN || typeof decoded.exportedAt !== 'string' || !Number.isFinite(Date.parse(decoded.exportedAt))) {
    return { ok: false, reason: 'validation', message: 'L’origine ou la date de l’export est invalide.' };
  }

  const keys = Object.keys(payloadRecord);
  if (keys.length !== PRODUCT_STORAGE_KEYS.length
    || keys.some((key) => !PRODUCT_CONTRACT_BY_KEY.has(key))
    || PRODUCT_STORAGE_KEYS.some((key) => !hasOwn(payloadRecord, key))) {
    return { ok: false, reason: 'validation', message: 'Le fichier contient une clé inconnue ou omet une clé produit attendue.' };
  }

  const payload: LocalDataPayload = {};
  for (const key of PRODUCT_STORAGE_KEYS) {
    const raw = payloadRecord[key];
    if (raw !== null && typeof raw !== 'string') {
      return { ok: false, reason: 'validation', message: `La clé ${key} ne contient pas une valeur exportée valide.` };
    }
    payload[key] = raw as string | null;
  }

  return {
    ok: true,
    exportValue: {
      formatVersion: LOCAL_DATA_EXPORT_FORMAT_VERSION,
      origin: LOCAL_DATA_EXPORT_ORIGIN,
      exportedAt: decoded.exportedAt,
      payload,
    },
  };
}

function validateExport(exportValue: LocalDataExport): LocalDataPreviewResult {
  const domains: LocalDataDomainPreview[] = [];
  for (const key of PRODUCT_STORAGE_KEYS) {
    const contract = PRODUCT_CONTRACT_BY_KEY.get(key);
    const raw = exportValue.payload[key];
    if (!contract) return { ok: false, reason: 'validation', message: `La clé ${key} n’est pas connue.` };
    if (raw === null) {
      domains.push({ key, present: false, itemCount: 0, warnings: [] });
      continue;
    }
    const validation = validateRaw(contract, raw);
    if (!validation.ok) {
      const failure = validation as { ok: false; reason: ImportFailureReason };
      return invalidPreview(failure.reason, `La donnée locale ${key} est invalide.`);
    }
    domains.push({
      key,
      present: true,
      itemCount: itemCount(validation.value),
      storageVersion: validation.storageVersion,
      warnings: [],
    });
  }
  return {
    ok: true,
    formatVersion: exportValue.formatVersion,
    exportedAt: exportValue.exportedAt,
    domains,
    warnings: [],
  };
}

export function createLocalDataExport(options: { now?: string } = {}): LocalDataExport {
  const payload: LocalDataPayload = {};
  for (const key of PRODUCT_STORAGE_KEYS) {
    const qualifiedKey = STORAGE_PREFIX + key;
    try {
      const raw = localStorage.getItem(qualifiedKey);
      const contract = PRODUCT_CONTRACT_BY_KEY.get(key);
      payload[key] = raw && contract && validateRaw(contract, raw).ok ? raw : null;
    } catch {
      payload[key] = null;
    }
  }
  return {
    formatVersion: LOCAL_DATA_EXPORT_FORMAT_VERSION,
    origin: LOCAL_DATA_EXPORT_ORIGIN,
    exportedAt: options.now ?? nowIso(),
    payload,
  };
}

export function serializeLocalDataExport(exportValue: LocalDataExport): string {
  return JSON.stringify(exportValue, null, 2);
}

export function previewLocalDataImport(text: string): LocalDataPreviewResult {
  const parsed = parseExportText(text);
  if (!parsed.ok) {
    const failure = parsed as { ok: false; reason: ImportFailureReason; message: string };
    return invalidPreview(failure.reason, failure.message);
  }
  return validateExport(parsed.exportValue);
}

function snapshotCurrentValues(): Record<string, string | null> {
  return Object.fromEntries(PRODUCT_STORAGE_KEYS.map((key) => [
    key,
    localStorage.getItem(STORAGE_PREFIX + key),
  ]));
}

function restoreSnapshot(snapshot: Record<string, string | null>): void {
  for (const key of PRODUCT_STORAGE_KEYS) {
    const qualifiedKey = STORAGE_PREFIX + key;
    const raw = snapshot[key];
    if (raw === null) localStorage.removeItem(qualifiedKey);
    else localStorage.setItem(qualifiedKey, raw);
  }
}

export function importLocalDataExport(text: string): StorageResult {
  const parsed = parseExportText(text);
  if (!parsed.ok) {
    const failure = parsed as { ok: false; reason: ImportFailureReason };
    return storageFailure(storageWriteReason(failure.reason), 'write', 'local-data-export');
  }
  const preview = validateExport(parsed.exportValue);
  if (!preview.ok) {
    const failure = preview as { ok: false; reason: ImportFailureReason };
    return storageFailure(storageWriteReason(failure.reason), 'write', 'local-data-export');
  }

  let snapshot: Record<string, string | null>;
  try {
    snapshot = snapshotCurrentValues();
  } catch {
    return storageFailure('unavailable', 'read', 'local-data-export');
  }

  try {
    for (const key of PRODUCT_STORAGE_KEYS) {
      const qualifiedKey = STORAGE_PREFIX + key;
      const raw = parsed.exportValue.payload[key];
      if (raw === null) localStorage.removeItem(qualifiedKey);
      else localStorage.setItem(qualifiedKey, raw);
    }
  } catch (error) {
    try {
      restoreSnapshot(snapshot);
    } catch {
      // The first failure is still the actionable failure for the caller.
    }
    return storageFailure(isQuotaError(error) ? 'quota' : 'unavailable', 'write', 'local-data-export');
  }

  return { ok: true };
}

export function purgeLocalData(): StorageResult {
  const snapshot = snapshotCurrentValues();
  try {
    for (const key of PRODUCT_STORAGE_KEYS) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    }
    return { ok: true };
  } catch (error) {
    try {
      restoreSnapshot(snapshot);
    } catch {
      // Preserve the first storage failure.
    }
    return storageFailure(isQuotaError(error) ? 'quota' : 'unavailable', 'remove', 'local-data');
  }
}
