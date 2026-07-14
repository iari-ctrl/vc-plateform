import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { storage, storageErrors } from './storage';

function localStorageStub(overrides: Partial<Storage> = {}): Storage {
  const values = new Map<string, string>();
  return {
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
}

describe('storage', () => {
  beforeEach(() => {
    storageErrors.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    storageErrors.clear();
  });

  it('writes namespaced JSON and reports success', () => {
    const local = localStorageStub();
    vi.stubGlobal('localStorage', local);

    expect(storage.set('notes', [{ body: 'Une note' }])).toEqual({ ok: true });
    expect(local.setItem).toHaveBeenCalledWith('vcpx:notes', '[{"body":"Une note"}]');
    expect(storageErrors.getSnapshot()).toBeNull();
  });

  it('distinguishes quota exhaustion from an unavailable store', () => {
    const quotaError = Object.assign(new Error('full'), { name: 'QuotaExceededError' });
    vi.stubGlobal('localStorage', localStorageStub({ setItem: vi.fn(() => { throw quotaError; }) }));

    expect(storage.set('notes', [])).toMatchObject({ ok: false, reason: 'quota', operation: 'write', key: 'notes' });

    vi.stubGlobal('localStorage', localStorageStub({ setItem: vi.fn(() => { throw new Error('blocked'); }) }));
    expect(storage.set('notes', [])).toMatchObject({ ok: false, reason: 'unavailable', operation: 'write', key: 'notes' });
  });

  it('reports values that cannot be serialized', () => {
    vi.stubGlobal('localStorage', localStorageStub());
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(storage.set('profile', circular)).toMatchObject({
      ok: false,
      reason: 'serialization',
      operation: 'write',
      key: 'profile',
    });
  });

  it('returns the fallback and reports unreadable JSON', () => {
    const local = localStorageStub({ getItem: vi.fn(() => '{broken') });
    vi.stubGlobal('localStorage', local);

    expect(storage.get('profile', null)).toBeNull();
    expect(storageErrors.getSnapshot()).toMatchObject({
      ok: false,
      reason: 'unreadable',
      operation: 'read',
      key: 'profile',
    });
  });

  it('reports unavailable reads and removals', () => {
    vi.stubGlobal('localStorage', localStorageStub({ getItem: vi.fn(() => { throw new Error('blocked'); }) }));
    expect(storage.get('profile', 'fallback')).toBe('fallback');
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'unavailable', operation: 'read' });

    vi.stubGlobal('localStorage', localStorageStub({ removeItem: vi.fn(() => { throw new Error('blocked'); }) }));
    expect(storage.remove('profile')).toMatchObject({ ok: false, reason: 'unavailable', operation: 'remove' });
  });

  it('notifies subscribers when the last failure changes or is cleared', () => {
    const listener = vi.fn();
    const unsubscribe = storageErrors.subscribe(listener);
    vi.stubGlobal('localStorage', localStorageStub({ setItem: vi.fn(() => { throw new Error('blocked'); }) }));

    storage.set('notes', []);
    expect(listener).toHaveBeenCalledTimes(1);

    storageErrors.clear();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(storageErrors.getSnapshot()).toBeNull();

    unsubscribe();
  });
});
