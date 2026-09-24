import { CERTIFICATION_ASSESSMENT_CONTRACT } from './certificationAssessment';
import { IKIGAI_CONTRACTS } from './ikigaiCahier';
import { LEARNING_WORKSPACE_CONTRACT } from './learningWorkspace';
import { ABANDONED_STORAGE_KEYS, STORAGE_PREFIX, prepareStoredRaw, type StorageContract, type StorageFailure, type StorageFailureReason } from './storage';
import { STORAGE_CONTRACTS } from './storageDomains';
import { localDataRecovery } from './localDataRecovery';

// v2 adds the standalone memo and raw migration archives. Active envelopes are unchanged.
export const LOCAL_DATA_EXPORT_FORMAT_VERSION = 2 as const;
export const LOCAL_DATA_EXPORT_ORIGIN = 'vc-platform' as const;
export const LOCAL_DATA_EXPORT_MAX_BYTES = 64_000_000;
export const INVESTMENT_MEMO_KEY = 'vcmemo.onepager.v1';
const PRODUCT_CONTRACTS: readonly StorageContract<unknown>[] = [
  ...Object.values(STORAGE_CONTRACTS), LEARNING_WORKSPACE_CONTRACT,
  CERTIFICATION_ASSESSMENT_CONTRACT, ...Object.values(IKIGAI_CONTRACTS),
];
const CONTRACTS = new Map(PRODUCT_CONTRACTS.map(contract => [contract.key, contract]));
const V1_KEYS = PRODUCT_CONTRACTS.map(contract => contract.key);
export const PRODUCT_STORAGE_KEYS = Object.freeze([...V1_KEYS, INVESTMENT_MEMO_KEY]);
const LEGACY_KEYS = PRODUCT_CONTRACTS.flatMap(contract => (contract.legacyKeys ?? []).map(legacy => legacy.key));
const ARCHIVE_DOMAINS = [...V1_KEYS, ...ABANDONED_STORAGE_KEYS];
const physicalKey = (key: string) => key === INVESTMENT_MEMO_KEY ? key : STORAGE_PREFIX + key;
const logicalKey = (key: string) => key.startsWith(STORAGE_PREFIX) ? key.slice(STORAGE_PREFIX.length) : key;
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const bytes = (value: string) => new TextEncoder().encode(value).byteLength;

export function isProductArchiveKey(key: string): boolean {
  return LEGACY_KEYS.includes(key)
    || ABANDONED_STORAGE_KEYS.some(domain => key === STORAGE_PREFIX + domain)
    || ARCHIVE_DOMAINS.some(domain => {
      const prefix = `${STORAGE_PREFIX}archive:${domain}:v`;
      return key.startsWith(prefix) && /^\d+$/.test(key.slice(prefix.length));
    });
}

const LABELS: Record<string, [string, string]> = {
  theme: ['Apparence', 'préférence'], profile: ['Profil', 'profil'], notes: ['Carnet', 'notes et annotations'],
  bookmarks: ['Favoris', 'favoris'], progress: ['Progression', 'leçons'], 'decision-journal': ['Journal', 'décisions'],
  'onboarding-mode': ['Mode d’orientation', 'préférence'], 'reading-depth': ['Profondeur de lecture', 'préférence'],
  'certification-enrollments': ['Inscriptions', 'inscriptions'], 'certification-assessments': ['Évaluations', 'dossiers d’évaluation'],
  'learning-workspace': ['Travail de formation', 'diagnostics, productions et activités'],
  'ikigai-cahier-answers': ['Cahier Ikigai', 'réponses'], 'ikigai-reading-mode': ['Mode du cahier', 'préférence'],
  'ikigai-archetype': ['Archétype', 'choix'], 'ikigai-history': ['Historique d’orientation', 'passages'],
  [INVESTMENT_MEMO_KEY]: ['Note d’investissement', 'note d’investissement'],
};
export type LocalDataPayload = Record<string, string | null>;
export interface LocalDataExport {
  formatVersion: 1 | 2;
  origin: typeof LOCAL_DATA_EXPORT_ORIGIN;
  exportedAt: string;
  payload: LocalDataPayload;
  /** Physical keys. Kept raw, including malformed historical values. */
  archives?: Record<string, string>;
  readErrors?: string[];
  domains?: LocalDataDomainPreview[];
  complete?: boolean;
}
export interface LocalDataDomainPreview {
  key: string;
  label: string;
  unit: string;
  present: boolean;
  itemCount: number | null;
  storageVersion?: number;
  status: 'absent' | 'valid' | 'migrated' | 'raw' | 'unavailable';
  reason?: StorageFailureReason;
  warnings: string[];
  currentCount?: number | null;
  unchanged?: boolean;
  added?: number;
  replaced?: number;
  removed?: number;
}
export type LocalDataPreviewResult =
  | { ok: true; formatVersion: number; exportedAt: string; domains: LocalDataDomainPreview[]; warnings: string[]; expected: LocalDataPayload }
  | { ok: false; reason: StorageFailureReason; message: string; domains?: LocalDataDomainPreview[]; validRecoveryText?: string };
export type LocalDataResult = { ok: true } | (StorageFailure & {
  phase: 'preparation' | 'write' | 'verification' | 'recovery';
  restoration: 'untouched' | 'verified' | 'failed';
  affectedKeys: string[];
  recoveryText?: string;
});
type Preparation = { ok: true; raw: string; value: unknown; version: number; migrated: boolean } | { ok: false; reason: StorageFailureReason };

function prepareMemo(raw: string): Preparation {
  if (bytes(raw) > 8_000_000) return { ok: false, reason: 'limit' };
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return { ok: false, reason: 'unreadable' }; }
  if (!record(value)) return { ok: false, reason: 'validation' };
  // The standalone tool versions its key, not its envelope. Never rewrite its format.
  if ('storageVersion' in value && value.storageVersion !== 1) return { ok: false, reason: 'version' };
  if (!record(value.d)
    || (value.mode !== undefined && !['full', 'screen'].includes(String(value.mode)))
    || (value.lang != null && !['fr', 'en'].includes(String(value.lang)))
    || (value.step !== undefined && (!Number.isInteger(value.step) || Number(value.step) < 0))) return { ok: false, reason: 'validation' };
  for (const [key, field] of Object.entries(value.d)) {
    if (['facts', 'beliefs', 'unknowns', 'risks'].includes(key)) {
      if (!Array.isArray(field) || field.some(row => !record(row) || Object.values(row).some(cell => typeof cell !== 'string'))) return { ok: false, reason: 'validation' };
    } else if (typeof field !== 'string') return { ok: false, reason: 'validation' };
  }
  return { ok: true, raw, value, version: 1, migrated: false };
}
function prepare(key: string, raw: string): Preparation {
  if (key === INVESTMENT_MEMO_KEY) return prepareMemo(raw);
  const contract = CONTRACTS.get(key);
  if (!contract) return { ok: false, reason: 'validation' };
  const result = prepareStoredRaw(contract, raw);
  if (!result.ok) return result;
  // Parse results may normalise data (workspace v1). Store exactly what readers consume.
  const prepared = JSON.stringify({ storageVersion: contract.version, value: result.parsed.value });
  if (bytes(prepared) > contract.maxBytes) return { ok: false, reason: 'limit' };
  return { ok: true, raw: result.parsed.needsMigration ? prepared : raw, value: result.parsed.value, version: contract.version, migrated: result.parsed.needsMigration };
}
function items(key: string, value: unknown): Record<string, unknown> {
  if (value === null) return {};
  if (key === INVESTMENT_MEMO_KEY || key === 'profile' || !record(value) && !Array.isArray(value)) return { single: value };
  if (Array.isArray(value)) return Object.fromEntries(value.map((entry, i) => [
    record(entry) ? String(entry.id ?? (entry.itemType ? `${entry.itemType}:${entry.itemId}` : entry.takenAt ?? i)) : String(i), entry,
  ]));
  if (!record(value)) return {};
  if (key === 'learning-workspace') return Object.fromEntries(['diagnostics', 'productions', 'activities'].flatMap(part => Object.entries(record(value[part]) ? value[part] : {}).map(([id, v]) => [`${part}:${id}`, v])));
  if (key === 'certification-assessments' && record(value.records)) return value.records;
  if (key === 'ikigai-cahier-answers') return Object.fromEntries(Object.entries(value).filter(([, answer]) => typeof answer === 'string' && answer.trim().length > 0));
  return value;
}
function domain(key: string, raw: string | null, unavailable = false): LocalDataDomainPreview {
  const [label, unit] = LABELS[key] ?? [`Archive : ${key}`, 'archive'];
  const base = { key, label, unit, present: raw !== null, warnings: [] };
  if (unavailable) return { ...base, itemCount: null, status: 'unavailable', reason: 'unavailable' };
  if (raw === null) return { ...base, itemCount: 0, status: 'absent' };
  if (!PRODUCT_STORAGE_KEYS.includes(key)) return { ...base, itemCount: 1, status: 'raw' };
  const result = prepare(key, raw);
  return result.ok
    ? { ...base, itemCount: Object.keys(items(key, result.value)).length, storageVersion: result.version, status: result.migrated ? 'migrated' : 'valid' }
    : { ...base, itemCount: null, status: 'raw', reason: result.reason };
}

/** Enumerate only keys actually owned by this product, never an entire namespace. */
function archiveKeys(): string[] {
  const keys = new Set(LEGACY_KEYS.concat(ABANDONED_STORAGE_KEYS.map(key => STORAGE_PREFIX + key)));
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === null) throw new Error('Storage inventory changed');
    if (isProductArchiveKey(key)) keys.add(key);
  }
  return [...keys].sort();
}
export function readLocalDataSnapshot(): LocalDataPayload {
  const entries = [...PRODUCT_STORAGE_KEYS.map(physicalKey), ...archiveKeys()].map(key => [key, localStorage.getItem(key)] as const);
  return Object.fromEntries(entries);
}
function exportSnapshot(snapshot: LocalDataPayload, now = new Date().toISOString()): LocalDataExport {
  return {
    formatVersion: 2, origin: LOCAL_DATA_EXPORT_ORIGIN, exportedAt: now,
    payload: Object.fromEntries(PRODUCT_STORAGE_KEYS.map(key => [key, snapshot[physicalKey(key)] ?? null])),
    archives: Object.fromEntries(Object.entries(snapshot).filter((entry): entry is [string, string] => isProductArchiveKey(entry[0]) && entry[1] !== null)),
  };
}
export function createLocalDataExport(options: { now?: string } = {}): LocalDataExport {
  const snapshot: LocalDataPayload = {};
  const readErrors: string[] = [];
  let archives: string[] = [];
  try { archives = archiveKeys(); } catch { readErrors.push('archives'); }
  for (const key of [...PRODUCT_STORAGE_KEYS.map(physicalKey), ...archives]) {
    try { snapshot[key] = localStorage.getItem(key); } catch { readErrors.push(logicalKey(key)); }
  }
  const exported = exportSnapshot(snapshot, options.now);
  // A failed read is absent from the payload, never disguised as a known empty value.
  readErrors.forEach(key => { delete exported.payload[key]; });
  exported.readErrors = readErrors;
  exported.complete = readErrors.length === 0;
  exported.domains = [
    ...PRODUCT_STORAGE_KEYS.map(key => domain(key, snapshot[physicalKey(key)] ?? null, readErrors.includes(key))),
    ...Object.entries(exported.archives ?? {}).map(([key, raw]) => domain(key, raw)),
    ...(readErrors.includes('archives') ? [domain('archives', null, true)] : []),
  ];
  return exported;
}
export const serializeLocalDataExport = (value: LocalDataExport) => JSON.stringify(value, null, 2);

function parseFile(text: string): { ok: true; file: LocalDataExport } | { ok: false; reason: StorageFailureReason; message: string } {
  if (bytes(text) > LOCAL_DATA_EXPORT_MAX_BYTES) return { ok: false, reason: 'limit', message: 'Le fichier dépasse 64 Mo.' };
  let decoded: unknown;
  try { decoded = JSON.parse(text); } catch { return { ok: false, reason: 'unreadable', message: 'Le fichier n’est pas un JSON lisible.' }; }
  if (!record(decoded) || !record(decoded.payload)) return { ok: false, reason: 'validation', message: 'Le format de sauvegarde est invalide.' };
  if (decoded.formatVersion !== 1 && decoded.formatVersion !== 2) return { ok: false, reason: 'version', message: 'La version du fichier n’est pas prise en charge. Conservez le fichier original.' };
  if (decoded.origin !== LOCAL_DATA_EXPORT_ORIGIN || typeof decoded.exportedAt !== 'string' || !Number.isFinite(Date.parse(decoded.exportedAt))) return { ok: false, reason: 'validation', message: 'L’origine ou la date de la sauvegarde est invalide.' };
  const payload = decoded.payload;
  const required = decoded.formatVersion === 1 ? V1_KEYS : PRODUCT_STORAGE_KEYS;
  if (Object.keys(payload).some(key => !PRODUCT_STORAGE_KEYS.includes(key)) || required.some(key => !Object.hasOwn(payload, key))) return { ok: false, reason: 'validation', message: 'Le fichier contient une clé inconnue ou un domaine manquant. Il ne peut pas remplacer les données locales.' };
  if (Object.values(decoded.payload).some(raw => raw !== null && typeof raw !== 'string') || (decoded.readErrors !== undefined && (!Array.isArray(decoded.readErrors) || decoded.readErrors.length > 0))) return { ok: false, reason: 'validation', message: 'Cette copie est incomplète. Conservez-la pour récupération ; elle ne peut pas remplacer les données locales.' };
  if (decoded.formatVersion === 2 && !record(decoded.archives)) return { ok: false, reason: 'validation', message: 'L’inventaire des archives est manquant.' };
  if (decoded.archives !== undefined && (!record(decoded.archives) || Object.entries(decoded.archives).some(([key, raw]) => !isProductArchiveKey(key) || typeof raw !== 'string'))) return { ok: false, reason: 'validation', message: 'Une archive est inconnue ou invalide.' };
  return { ok: true, file: decoded as unknown as LocalDataExport };
}
function prepareFile(file: LocalDataExport) {
  const target: LocalDataPayload = {};
  const domains = Object.entries(file.payload).map(([key, raw]) => domain(key, raw));
  const invalid = domains.filter(d => d.reason);
  for (const [key, raw] of Object.entries(file.payload)) {
    if (raw === null) { target[physicalKey(key)] = null; continue; }
    const prepared = prepare(key, raw);
    if (prepared.ok) target[physicalKey(key)] = prepared.raw;
  }
  const archives = file.archives ?? {};
  Object.assign(target, archives);
  // A historical alias may be the only active value. Share the same pure migration.
  for (const contract of PRODUCT_CONTRACTS) {
    if (target[physicalKey(contract.key)] != null) continue;
    for (const legacy of contract.legacyKeys ?? []) {
      if (archives[legacy.key] === undefined) continue;
      try {
        const prepared = prepare(contract.key, JSON.stringify(legacy.decode(archives[legacy.key])));
        if (!prepared.ok) throw Error('Invalid legacy data');
        target[physicalKey(contract.key)] = prepared.raw;
      } catch { invalid.push({ ...domain(contract.key, null), reason: 'validation' }); }
    }
  }
  return { target, domains, invalid };
}
export function previewLocalDataImport(text: string): LocalDataPreviewResult {
  const parsed = parseFile(text);
  if (!parsed.ok) return parsed;
  const { file } = parsed;
  const prepared = prepareFile(file);
  if (prepared.invalid.length) {
    const validPayload = Object.fromEntries(Object.entries(file.payload).filter(([key]) => !prepared.invalid.some(d => d.key === key)));
    return { ok: false, reason: prepared.invalid[0].reason!, message: `Domaines incompatibles : ${prepared.invalid.map(d => d.label).join(', ')}. Conservez le fichier original.`, domains: prepared.domains,
      // Partial recovery is explicitly not an importable replacement. No accidental purge.
      validRecoveryText: JSON.stringify({ origin: LOCAL_DATA_EXPORT_ORIGIN, kind: 'partial-recovery', exportedAt: file.exportedAt, payload: validPayload, archives: file.archives }, null, 2) };
  }
  let current: LocalDataPayload;
  try { current = readLocalDataSnapshot(); } catch { return { ok: false, reason: 'unavailable', message: 'Lecture des données présentes impossible. Aucune donnée n’a été modifiée.' }; }
  const target = replacementTarget(file, prepared.target, current);
  const keys = [...PRODUCT_STORAGE_KEYS, ...new Set([...Object.keys(current), ...Object.keys(target)].filter(isProductArchiveKey))];
  const domains = keys.map(key => {
    const physical = PRODUCT_STORAGE_KEYS.includes(key) ? physicalKey(key) : key;
    const before = current[physical] ?? null, after = target[physical] ?? null;
    const d = domain(key, after), previous = domain(key, before);
    if (prepared.domains.some(original => original.key === key && original.status === 'migrated')) d.status = 'migrated';
    d.currentCount = previous.itemCount;
    d.unchanged = before === after;
    const a = before === null ? null : prepare(key, before);
    const b = after === null ? null : prepare(key, after);
    if (PRODUCT_STORAGE_KEYS.includes(key) && a?.ok && b?.ok) {
      const oldItems = items(key, a.value), newItems = items(key, b.value);
      d.added = Object.keys(newItems).filter(id => !Object.hasOwn(oldItems, id)).length;
      d.removed = Object.keys(oldItems).filter(id => !Object.hasOwn(newItems, id)).length;
      d.replaced = Object.keys(oldItems).filter(id => Object.hasOwn(newItems, id) && JSON.stringify(oldItems[id]) !== JSON.stringify(newItems[id])).length;
    } else if (previous.itemCount !== null && d.itemCount !== null) {
      d.added = before === null ? d.itemCount : 0;
      d.removed = after === null ? previous.itemCount : 0;
      d.replaced = before !== null && after !== null && before !== after ? d.itemCount : 0;
    }
    return d;
  });
  return { ok: true, formatVersion: file.formatVersion, exportedAt: file.exportedAt, domains, expected: current,
    warnings: file.formatVersion === 1 ? ['Sauvegarde v1 : la note d’investissement et les archives absentes du fichier restent sur cet appareil.'] : [] };
}
function replacementTarget(file: LocalDataExport, prepared: LocalDataPayload, current: LocalDataPayload): LocalDataPayload {
  const target: LocalDataPayload = { ...current };
  if (file.formatVersion === 2) Object.keys(target).forEach(key => { target[key] = null; });
  else V1_KEYS.forEach(key => { target[physicalKey(key)] = null; });
  return Object.assign(target, prepared);
}
function mismatches(expected: LocalDataPayload): string[] {
  const affected = new Set<string>();
  for (const [key, raw] of Object.entries(expected)) {
    try { if (localStorage.getItem(key) !== raw) affected.add(logicalKey(key)); } catch { affected.add(logicalKey(key)); }
  }
  try {
    for (const key of archiveKeys()) {
      if (!Object.hasOwn(expected, key) && localStorage.getItem(key) !== null) affected.add(logicalKey(key));
    }
  } catch { affected.add('archives'); }
  return [...affected];
}
export const verifyLocalDataSnapshot = (expected: LocalDataPayload) => mismatches(expected);
function writeValues(target: LocalDataPayload, continueOnError = false) {
  // Release product capacity first, including oversized imported values during rollback.
  for (const key of Object.keys(target)) {
    try { if (localStorage.getItem(key) !== target[key]) localStorage.removeItem(key); } catch (error) { if (!continueOnError) throw error; }
  }
  for (const [key, raw] of Object.entries(target)) {
    try { if (raw !== null && localStorage.getItem(key) !== raw) localStorage.setItem(key, raw); } catch (error) { if (!continueOnError) throw error; }
  }
}
function failure(operation: StorageFailure['operation'], phase: 'preparation' | 'write' | 'verification' | 'recovery', reason: StorageFailureReason = 'unavailable'): LocalDataResult & { ok: false } {
  return { ok: false, reason, operation, key: 'local-data', occurredAt: new Date().toISOString(), phase, restoration: 'untouched', affectedKeys: [] };
}
function quota(error: unknown): boolean {
  const e = error as { name?: string; code?: number } | null;
  return e?.name === 'QuotaExceededError' || e?.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e?.code === 22 || e?.code === 1014;
}
let busy = false;
async function replace(target: LocalDataPayload, before: LocalDataPayload, operation: 'write' | 'remove', synchronize?: (snapshot: LocalDataPayload) => void): Promise<LocalDataResult> {
  if (busy) return failure(operation, 'preparation');
  busy = true;
  const recoveryText = serializeLocalDataExport(exportSnapshot(before));
  try {
    try { await localDataRecovery.save(recoveryText); } catch (error) {
      const pending = await localDataRecovery.read().catch(() => null);
      return { ...failure('write', 'preparation', quota(error) ? 'quota' : 'unavailable'), recoveryText: pending ?? recoveryText };
    }
    // IndexedDB preparation is asynchronous. Refuse a stale preview/snapshot.
    if (mismatches(before).length) {
      await localDataRecovery.clear().catch(() => {});
      return failure('read', 'preparation');
    }
    let phase: 'write' | 'verification' | 'recovery' = 'write';
    try {
      writeValues(target);
      phase = 'verification';
      if (mismatches(target).length) throw new Error('Write verification failed');
      synchronize?.(target);
      if (mismatches(target).length) throw new Error('State changed during refresh');
      phase = 'recovery';
      await localDataRecovery.clear();
      phase = 'verification';
      if (mismatches(target).length) throw new Error('State changed during recovery cleanup');
      return { ok: true };
    } catch (error) {
      // Include newly introduced archive keys so rollback removes them too.
      const rollback = { ...Object.fromEntries(Object.keys(target).map(key => [key, null])), ...before };
      writeValues(rollback, true);
      const affectedKeys = mismatches(rollback);
      try { synchronize?.(readLocalDataSnapshot()); } catch { affectedKeys.push('états affichés'); }
      const result = { ...failure(operation, phase, quota(error) ? 'quota' : 'unavailable'), restoration: affectedKeys.length ? 'failed' as const : 'verified' as const, affectedKeys, recoveryText };
      if (!affectedKeys.length) await localDataRecovery.clear().catch(() => {});
      else {
        // A final read can fail after cleanup. Keep a durable copy again when possible.
        try { if (await localDataRecovery.read() === null) await localDataRecovery.save(recoveryText); } catch { /* The caller still receives the exact in-memory copy. */ }
      }
      return result;
    }
  } finally { busy = false; }
}
export async function importLocalDataExport(text: string, expected?: LocalDataPayload, synchronize?: (snapshot: LocalDataPayload) => void): Promise<LocalDataResult> {
  const parsed = parseFile(text);
  if (!parsed.ok) return failure('read', 'preparation', parsed.reason);
  const prepared = prepareFile(parsed.file);
  if (prepared.invalid.length) return failure('read', 'preparation', prepared.invalid[0].reason);
  let before: LocalDataPayload;
  try { before = readLocalDataSnapshot(); } catch { return failure('read', 'preparation'); }
  if (expected && mismatches(expected).length) return failure('read', 'preparation');
  return replace(replacementTarget(parsed.file, prepared.target, before), before, 'write', synchronize);
}
export async function purgeLocalData(expected?: LocalDataPayload, synchronize?: (snapshot: LocalDataPayload) => void): Promise<LocalDataResult> {
  let before: LocalDataPayload;
  try { before = readLocalDataSnapshot(); } catch { return failure('read', 'preparation'); }
  if (expected && mismatches(expected).length) return failure('read', 'preparation');
  return replace(Object.fromEntries(Object.keys(before).map(key => [key, null])), before, 'remove', synchronize);
}
