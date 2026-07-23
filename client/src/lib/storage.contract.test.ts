import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { commitOnStorageSuccess, storage, storageErrors, type StorageContract } from './storage';

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

interface PreferenceState {
  mode: string;
  migrated: boolean;
}

const preferenceContract: StorageContract<PreferenceState> = {
  key: 'preferences',
  version: 2,
  fallback: { mode: 'standard', migrated: false },
  maxBytes: 1_024,
  migrations: {
    0: (value) => ({ mode: value, migrated: false }),
    1: (value) => ({ ...(value as object), migrated: true }),
  },
  parse(value) {
    if (
      typeof value === 'object'
      && value !== null
      && !Array.isArray(value)
      && typeof (value as Record<string, unknown>).mode === 'string'
      && typeof (value as Record<string, unknown>).migrated === 'boolean'
    ) {
      return { ok: true, value: value as unknown as PreferenceState };
    }
    return { ok: false, reason: 'validation' };
  },
};

describe('versioned storage contracts', () => {
  beforeEach(() => {
    storageErrors.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    storageErrors.clear();
  });

  it('parses an unversioned legacy value in memory without rewriting the original on read', () => {
    const original = JSON.stringify('compact');
    const { local, values } = localStorageStub({ 'vcpx:preferences': original });
    vi.stubGlobal('localStorage', local);

    expect(storage.getParsed(preferenceContract)).toEqual({ mode: 'compact', migrated: true });
    expect(values.get('vcpx:preferences')).toBe(original);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it('migrates sequentially while archiving the previous representation', () => {
    const original = JSON.stringify('compact');
    const { local, values } = localStorageStub({ 'vcpx:preferences': original });
    vi.stubGlobal('localStorage', local);

    expect(storage.migrate(preferenceContract)).toEqual({ ok: true });
    expect(values.get('vcpx:archive:preferences:v0')).toBe(original);
    expect(JSON.parse(values.get('vcpx:preferences') ?? '')).toEqual({
      storageVersion: 2,
      value: { mode: 'compact', migrated: true },
    });

    const writeCount = vi.mocked(local.setItem).mock.calls.length;
    expect(storage.migrate(preferenceContract)).toEqual({ ok: true });
    expect(local.setItem).toHaveBeenCalledTimes(writeCount);
  });

  it('rejects valid JSON with the wrong runtime shape without modifying it', () => {
    const original = JSON.stringify({ mode: 42 });
    const { local, values } = localStorageStub({ 'vcpx:preferences': original });
    vi.stubGlobal('localStorage', local);

    expect(storage.getParsed(preferenceContract)).toEqual(preferenceContract.fallback);
    expect(storageErrors.getSnapshot()).toMatchObject({
      reason: 'validation',
      operation: 'read',
      key: 'preferences',
    });
    expect(values.get('vcpx:preferences')).toBe(original);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it('keeps a future version untouched and reports it explicitly', () => {
    const original = JSON.stringify({ storageVersion: 99, value: { mode: 'future', migrated: true } });
    const { local, values } = localStorageStub({ 'vcpx:preferences': original });
    vi.stubGlobal('localStorage', local);

    expect(storage.getParsed(preferenceContract)).toEqual(preferenceContract.fallback);
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'version', operation: 'read' });
    expect(values.get('vcpx:preferences')).toBe(original);
  });

  it('parses a storage-event payload through the same versioned contract', () => {
    vi.stubGlobal('localStorage', localStorageStub().local);
    const raw = JSON.stringify({
      storageVersion: 2,
      value: { mode: 'event', migrated: true },
    });

    expect(storage.parseStored(preferenceContract, raw)).toEqual({ mode: 'event', migrated: true });
    expect(storage.parseStored(preferenceContract, null)).toEqual(preferenceContract.fallback);
  });

  it('rejects writes that exceed the documented byte limit', () => {
    const { local } = localStorageStub();
    vi.stubGlobal('localStorage', local);
    const boundedText: StorageContract<string> = {
      key: 'bounded-text',
      version: 1,
      fallback: '',
      maxBytes: 80,
      migrations: { 0: (value) => value },
      parse: (value) => typeof value === 'string'
        ? { ok: true, value }
        : { ok: false, reason: 'validation' },
    };

    expect(storage.setParsed(boundedText, 'x'.repeat(200))).toMatchObject({
      ok: false,
      reason: 'limit',
      operation: 'write',
      key: 'bounded-text',
    });
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it('copies and removes an unprefixed legacy key only after a successful migration', () => {
    const onboardingContract: StorageContract<'editorial' | 'bref' | 'interactif'> = {
      key: 'onboarding-mode',
      version: 1,
      fallback: 'editorial',
      maxBytes: 256,
      migrations: { 0: (value) => value },
      legacyKeys: [{ key: 'onboardingMode', decode: (raw) => raw }],
      parse: (value) => value === 'editorial' || value === 'bref' || value === 'interactif'
        ? { ok: true, value }
        : { ok: false, reason: 'validation' },
    };
    const { local, values } = localStorageStub({ onboardingMode: 'bref' });
    vi.stubGlobal('localStorage', local);

    expect(storage.getParsed(onboardingContract)).toBe('bref');
    expect(values.get('onboardingMode')).toBe('bref');
    expect(storage.migrate(onboardingContract)).toEqual({ ok: true });
    expect(values.has('onboardingMode')).toBe(false);
    expect(JSON.parse(values.get('vcpx:onboarding-mode') ?? '')).toEqual({
      storageVersion: 1,
      value: 'bref',
    });
  });

  it('leaves the legacy key in place when the namespaced write is unavailable', () => {
    const onboardingContract: StorageContract<'editorial' | 'bref'> = {
      key: 'onboarding-mode',
      version: 1,
      fallback: 'editorial',
      maxBytes: 256,
      migrations: { 0: (value) => value },
      legacyKeys: [{ key: 'onboardingMode', decode: (raw) => raw }],
      parse: (value) => value === 'editorial' || value === 'bref'
        ? { ok: true, value }
        : { ok: false, reason: 'validation' },
    };
    const base = localStorageStub({ onboardingMode: 'bref' });
    const local = {
      ...base.local,
      setItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    } as Storage;
    vi.stubGlobal('localStorage', local);

    expect(storage.migrate(onboardingContract)).toMatchObject({
      ok: false,
      reason: 'unavailable',
      operation: 'write',
    });
    expect(base.values.get('onboardingMode')).toBe('bref');
    expect(local.removeItem).not.toHaveBeenCalledWith('onboardingMode');
  });

  it('does not return an unrelated stale failure when there is nothing to migrate', () => {
    vi.stubGlobal('localStorage', localStorageStub({}, {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    }).local);
    expect(storage.getParsed(preferenceContract)).toEqual(preferenceContract.fallback);

    vi.stubGlobal('localStorage', localStorageStub().local);
    expect(storage.migrate(preferenceContract)).toEqual({ ok: true });
  });

  it('commits application state only after a successful persistent write', () => {
    const commit = vi.fn();
    const unavailable = localStorageStub({}, {
      setItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    });
    vi.stubGlobal('localStorage', unavailable.local);
    const failed = storage.setParsed(preferenceContract, { mode: 'failed', migrated: true });

    commitOnStorageSuccess(failed, 'failed', commit);
    expect(commit).not.toHaveBeenCalled();

    const removeCommit = vi.fn();
    vi.stubGlobal('localStorage', localStorageStub({}, {
      removeItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    }).local);
    const failedRemoval = storage.remove(preferenceContract.key);
    commitOnStorageSuccess(failedRemoval, 'removed', removeCommit);
    expect(removeCommit).not.toHaveBeenCalled();

    vi.stubGlobal('localStorage', localStorageStub().local);
    const succeeded = storage.setParsed(preferenceContract, { mode: 'saved', migrated: true });
    commitOnStorageSuccess(succeeded, 'saved', commit);
    expect(commit).toHaveBeenCalledOnce();
    expect(commit).toHaveBeenCalledWith('saved');
  });
});
