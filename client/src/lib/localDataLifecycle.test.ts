import { afterEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_PREFIX } from './storage';
import { STORAGE_CONTRACTS } from './storageDomains';
import {
  createLocalDataExport,
  importLocalDataExport,
  LOCAL_DATA_EXPORT_MAX_BYTES,
  previewLocalDataImport,
  PRODUCT_STORAGE_KEYS,
  purgeLocalData,
  serializeLocalDataExport,
} from './localDataLifecycle';

function localStorageStub(initial: Record<string, string> = {}, overrides: Partial<Storage> = {}) {
  const values = new Map(Object.entries(initial));
  const local: Storage = {
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
  return { local, values };
}

function envelope<T>(storageVersion: number, value: T): string {
  return JSON.stringify({ storageVersion, value });
}

const validNote = {
  id: 'note-1',
  kind: 'note' as const,
  body: 'Point à reprendre.',
  createdAt: '2026-07-22T00:00:00.000Z',
};

const validProfile = {
  profileType: 'analyste',
  scores: { analyse: 4 },
};

describe('local data lifecycle', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exports every known product key and excludes foreign localStorage keys', () => {
    const { local } = localStorageStub({
      [`${STORAGE_PREFIX}${STORAGE_CONTRACTS.notes.key}`]: envelope(1, [validNote]),
      'foreign:token': 'must-stay-private',
    });
    vi.stubGlobal('localStorage', local);

    const exported = createLocalDataExport({ now: '2026-07-22T12:00:00.000Z' });

    expect(exported).toMatchObject({
      formatVersion: 1,
      origin: 'vc-platform',
      exportedAt: '2026-07-22T12:00:00.000Z',
    });
    expect(Object.keys(exported.payload).sort()).toEqual([...PRODUCT_STORAGE_KEYS].sort());
    expect(exported.payload.notes).toBe(envelope(1, [validNote]));
    expect(Object.values(exported.payload)).not.toContain('must-stay-private');
  });

  it('previews an import without exposing free-text payload values', () => {
    const exported = createLocalDataExportFromPayload({
      notes: envelope(1, [validNote]),
      profile: envelope(1, validProfile),
    });

    const preview = previewLocalDataImport(serializeLocalDataExport(exported));

    expect(preview).toMatchObject({ ok: true, formatVersion: 1, domains: expect.any(Array) });
    expect(preview.ok && preview.domains).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'notes', itemCount: 1, present: true }),
      expect.objectContaining({ key: 'profile', itemCount: 1, present: true }),
    ]));
    expect(JSON.stringify(preview)).not.toContain(validNote.body);
  });

  it('rejects unknown export versions, unknown keys, oversized payloads and invalid business data before mutation', () => {
    expect(previewLocalDataImport(JSON.stringify({
      formatVersion: 99,
      origin: 'vc-platform',
      exportedAt: '2026-07-22T12:00:00.000Z',
      payload: {},
    }))).toMatchObject({ ok: false, reason: 'version' });

    expect(previewLocalDataImport(JSON.stringify({
      formatVersion: 1,
      origin: 'vc-platform',
      exportedAt: '2026-07-22T12:00:00.000Z',
      payload: { [`${STORAGE_PREFIX}notes`]: null },
    }))).toMatchObject({ ok: false, reason: 'validation' });

    expect(previewLocalDataImport('x'.repeat(LOCAL_DATA_EXPORT_MAX_BYTES + 1))).toMatchObject({ ok: false, reason: 'limit' });

    expect(previewLocalDataImport(serializeLocalDataExport(createLocalDataExportFromPayload({
      notes: envelope(1, { not: 'an-array' }),
    })))).toMatchObject({ ok: false, reason: 'validation' });
  });

  it('imports atomically and rolls storage back when a write fails mid-flight', () => {
    const previousNotes = envelope(1, [validNote]);
    const previousProfile = envelope(1, validProfile);
    const nextNotes = envelope(1, [{ ...validNote, id: 'note-2', body: 'Nouvelle note.' }]);
    const exported = createLocalDataExportFromPayload({
      notes: nextNotes,
      profile: null,
    });
    const base = localStorageStub({
      [`${STORAGE_PREFIX}notes`]: previousNotes,
      [`${STORAGE_PREFIX}profile`]: previousProfile,
      'outside': 'preserved',
    });
    const local = {
      ...base.local,
      setItem: vi.fn((key: string, value: string) => {
        base.values.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        if (key === `${STORAGE_PREFIX}profile`) throw new Error('blocked');
        base.values.delete(key);
      }),
    } as Storage;
    vi.stubGlobal('localStorage', local);

    expect(importLocalDataExport(serializeLocalDataExport(exported))).toMatchObject({ ok: false, reason: 'unavailable' });
    expect(base.values.get(`${STORAGE_PREFIX}notes`)).toBe(previousNotes);
    expect(base.values.get(`${STORAGE_PREFIX}profile`)).toBe(previousProfile);
    expect(base.values.get('outside')).toBe('preserved');
  });

  it('imports valid payloads and purges product data while preserving keys outside the namespace', () => {
    const exported = createLocalDataExportFromPayload({
      notes: envelope(1, [validNote]),
      profile: envelope(1, validProfile),
    });
    const { local, values } = localStorageStub({
      [`${STORAGE_PREFIX}bookmarks`]: envelope(1, []),
      'outside': 'preserved',
    });
    vi.stubGlobal('localStorage', local);

    expect(importLocalDataExport(serializeLocalDataExport(exported))).toEqual({ ok: true });
    expect(values.get(`${STORAGE_PREFIX}notes`)).toBe(envelope(1, [validNote]));
    expect(values.get(`${STORAGE_PREFIX}profile`)).toBe(envelope(1, validProfile));
    expect(values.get('outside')).toBe('preserved');

    expect(purgeLocalData()).toEqual({ ok: true });
    expect(values.get(`${STORAGE_PREFIX}notes`)).toBeUndefined();
    expect(values.get(`${STORAGE_PREFIX}profile`)).toBeUndefined();
    expect(values.get(`${STORAGE_PREFIX}bookmarks`)).toBeUndefined();
    expect(values.get('outside')).toBe('preserved');
  });
});

function createLocalDataExportFromPayload(partialPayload: Partial<Record<string, string | null>>) {
  return {
    formatVersion: 1 as const,
    origin: 'vc-platform' as const,
    exportedAt: '2026-07-22T12:00:00.000Z',
    payload: Object.fromEntries(PRODUCT_STORAGE_KEYS.map((key) => [key, partialPayload[key] ?? null])) as Record<string, string | null>,
  };
}
