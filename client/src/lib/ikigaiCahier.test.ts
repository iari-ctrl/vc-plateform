import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  IKIGAI_STORAGE_LIMITS,
  getCahierAnswers,
  getChosenArchetype,
  getHistory,
  getReadingMode,
  setCahierAnswers,
} from './ikigaiCahier';
import { storageErrors } from './storage';

function localStorageStub(initial: Record<string, string> = {}, overrides: Partial<Storage> = {}): Storage {
  const values = new Map(Object.entries(initial));
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

describe('Ikigai cahier persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageStub());
    storageErrors.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    storageErrors.clear();
  });

  it('ignores malformed answers without overwriting the original value', () => {
    const raw = JSON.stringify(['not', 'an', 'answer-map']);
    const local = localStorageStub({ 'vcpx:ikigai-cahier-answers': raw });
    vi.stubGlobal('localStorage', local);

    expect(getCahierAnswers()).toEqual({});
    expect(storageErrors.getSnapshot()).toMatchObject({
      reason: 'validation',
      operation: 'read',
      key: 'ikigai-cahier-answers',
    });
    expect(local.getItem('vcpx:ikigai-cahier-answers')).toBe(raw);
  });

  it('rejects overlong reflection text', () => {
    const result = setCahierAnswers({
      'guide-reflection': 'x'.repeat(IKIGAI_STORAGE_LIMITS.freeText + 1),
    });

    expect(result).toMatchObject({ ok: false, reason: 'limit', key: 'ikigai-cahier-answers' });
    expect(localStorage.getItem('vcpx:ikigai-cahier-answers')).toBeNull();
  });

  it('rejects answer collections above the documented limit', () => {
    const answers = Object.fromEntries(Array.from(
      { length: IKIGAI_STORAGE_LIMITS.answers + 1 },
      (_, index) => [`answer-${index}`, 'Réponse'],
    ));
    vi.stubGlobal('localStorage', localStorageStub({
      'vcpx:ikigai-cahier-answers': JSON.stringify(answers),
    }));

    expect(getCahierAnswers()).toEqual({});
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'limit', operation: 'read' });
  });

  it('validates the reading mode, archetype and history domains independently', () => {
    vi.stubGlobal('localStorage', localStorageStub({
      'vcpx:ikigai-reading-mode': JSON.stringify('expert'),
      'vcpx:ikigai-archetype': JSON.stringify({ id: 'operator' }),
      'vcpx:ikigai-history': JSON.stringify([{ profileType: 42, takenAt: 'yesterday' }]),
    }));

    expect(getReadingMode()).toBe('decouverte');
    expect(getChosenArchetype()).toBeNull();
    expect(getHistory()).toEqual([]);
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'validation', operation: 'read' });
  });

  it('falls back when localStorage access is unavailable', () => {
    vi.stubGlobal('localStorage', localStorageStub({}, {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    }));

    expect(getCahierAnswers()).toEqual({});
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'unavailable', operation: 'read' });
  });
});
