import { afterEach, describe, expect, it, vi } from 'vitest';

import { storage, storageErrors, type StorageContract } from './storage';
import { STORAGE_CONTRACTS, STORAGE_LIMITS } from './storageDomains';

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

function malformedCase<T>(contract: StorageContract<T>, malformed: unknown) {
  return { contract: contract as unknown as StorageContract<unknown>, malformed };
}

const malformedCases = [
  malformedCase(STORAGE_CONTRACTS.theme, 'sepia'),
  malformedCase(STORAGE_CONTRACTS.profile, { profileType: 42 }),
  malformedCase(STORAGE_CONTRACTS.notes, { id: 'not-an-array' }),
  malformedCase(STORAGE_CONTRACTS.bookmarks, [{ itemType: 'lesson' }]),
  malformedCase(STORAGE_CONTRACTS.bookmarks, [{
    itemType: 'lesson',
    itemId: 'l1',
    title: 'Titre',
    href: 'javascript:alert(1)',
    createdAt: '2026-07-22T00:00:00.000Z',
  }]),
  malformedCase(STORAGE_CONTRACTS.progress, { lesson: { lessonId: 'lesson', status: 'done', percent: 140 } }),
  malformedCase(STORAGE_CONTRACTS.journal, [{ id: 'j1', statement: 'T', confidence: 20 }]),
  malformedCase(STORAGE_CONTRACTS.journal, [{
    id: 'j1',
    statement: 'Décision',
    confidence: 70,
    category: 'deal',
    reviewAt: '2026-07-22T00:00:00.000Z',
    createdAt: '2026-07-22T00:00:00.000Z',
    status: 'open',
    links: [{ type: 'lesson', id: 'l1', title: 'Titre', href: 'data:text/html,unsafe' }],
  }]),
  malformedCase(STORAGE_CONTRACTS.onboardingMode, 'immersif'),
  malformedCase(STORAGE_CONTRACTS.certificationEnrollments, {
    cert: {
      certificationId: 'cert',
      selection: { specialty: 'unknown' },
      createdAt: '2026-07-22T00:00:00.000Z',
      updatedAt: '2026-07-22T00:00:00.000Z',
    },
  }),
  malformedCase(STORAGE_CONTRACTS.readingDepth, 'integral'),
];

function domainCase(name: string, contract: StorageContract<unknown>, valid: unknown) {
  return { name, contract, valid };
}

const majorDomainCases = [
  domainCase('theme', STORAGE_CONTRACTS.theme as StorageContract<unknown>, 'light'),
  domainCase('profile', STORAGE_CONTRACTS.profile as StorageContract<unknown>, {
    profileType: 'analyste',
    scores: { analyse: 8 },
  }),
  domainCase('notes', STORAGE_CONTRACTS.notes as StorageContract<unknown>, []),
  domainCase('bookmarks', STORAGE_CONTRACTS.bookmarks as StorageContract<unknown>, []),
  domainCase('progress', STORAGE_CONTRACTS.progress as StorageContract<unknown>, {}),
  domainCase('journal', STORAGE_CONTRACTS.journal as StorageContract<unknown>, []),
  domainCase('onboarding mode', STORAGE_CONTRACTS.onboardingMode as StorageContract<unknown>, 'bref'),
  domainCase('certification enrollments', STORAGE_CONTRACTS.certificationEnrollments as StorageContract<unknown>, {}),
  domainCase('reading depth', STORAGE_CONTRACTS.readingDepth as StorageContract<unknown>, 'profond'),
];

const validNote = {
  id: 'note',
  kind: 'note' as const,
  body: 'Note',
  createdAt: '2026-07-22T00:00:00.000Z',
};
const validBookmark = {
  itemType: 'lesson',
  itemId: 'lesson',
  title: 'Leçon',
  href: '/learn/lesson',
};
const validJournalEntry = {
  id: 'decision',
  statement: 'Décision',
  confidence: 70,
  category: 'these',
  status: 'open',
  createdAt: '2026-07-22T00:00:00.000Z',
  reviewAt: '2026-08-22T00:00:00.000Z',
};

const domainLimitCases = [
  domainCase('profile score collection', STORAGE_CONTRACTS.profile as StorageContract<unknown>, {
    profileType: 'analyste',
    scores: Object.fromEntries(Array.from({ length: STORAGE_LIMITS.scoreAxes + 1 }, (_, index) => [`score-${index}`, index])),
  }),
  domainCase('note collection', STORAGE_CONTRACTS.notes as StorageContract<unknown>, Array(STORAGE_LIMITS.notes + 1).fill(validNote)),
  domainCase('bookmark collection', STORAGE_CONTRACTS.bookmarks as StorageContract<unknown>, Array(STORAGE_LIMITS.bookmarks + 1).fill(validBookmark)),
  domainCase('progress collection', STORAGE_CONTRACTS.progress as StorageContract<unknown>, Object.fromEntries(
    Array.from({ length: STORAGE_LIMITS.progress + 1 }, (_, index) => {
      const lessonId = `lesson-${index}`;
      return [lessonId, { lessonId, status: 'reading', percent: 5 }];
    }),
  )),
  domainCase('journal collection', STORAGE_CONTRACTS.journal as StorageContract<unknown>, Array(STORAGE_LIMITS.journal + 1).fill(validJournalEntry)),
  domainCase('enrollment collection', STORAGE_CONTRACTS.certificationEnrollments as StorageContract<unknown>, Object.fromEntries(
    Array.from({ length: STORAGE_LIMITS.enrollments + 1 }, (_, index) => {
      const certificationId = `certification-${index}`;
      return [certificationId, {
        certificationId,
        selection: {},
        createdAt: '2026-07-22T00:00:00.000Z',
        updatedAt: '2026-07-22T00:00:00.000Z',
      }];
    }),
  )),
  domainCase('profile text', STORAGE_CONTRACTS.profile as StorageContract<unknown>, {
    profileType: 'x'.repeat(STORAGE_LIMITS.id + 1),
    scores: {},
  }),
  domainCase('note text', STORAGE_CONTRACTS.notes as StorageContract<unknown>, [{
    ...validNote,
    body: 'x'.repeat(STORAGE_LIMITS.freeText + 1),
  }]),
  domainCase('bookmark text', STORAGE_CONTRACTS.bookmarks as StorageContract<unknown>, [{
    ...validBookmark,
    title: 'x'.repeat(STORAGE_LIMITS.shortText + 1),
  }]),
  domainCase('progress identifier', STORAGE_CONTRACTS.progress as StorageContract<unknown>, {
    ['x'.repeat(STORAGE_LIMITS.id + 1)]: {
      lessonId: 'x'.repeat(STORAGE_LIMITS.id + 1),
      status: 'reading',
      percent: 5,
    },
  }),
  domainCase('journal text', STORAGE_CONTRACTS.journal as StorageContract<unknown>, [{
    ...validJournalEntry,
    statement: 'x'.repeat(STORAGE_LIMITS.freeText + 1),
  }]),
  domainCase('enrollment identifier', STORAGE_CONTRACTS.certificationEnrollments as StorageContract<unknown>, {
    ['x'.repeat(STORAGE_LIMITS.id + 1)]: {
      certificationId: 'x'.repeat(STORAGE_LIMITS.id + 1),
      selection: {},
      createdAt: '2026-07-22T00:00:00.000Z',
      updatedAt: '2026-07-22T00:00:00.000Z',
    },
  }),
];

describe('product storage domain contracts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    storageErrors.clear();
  });

  it.each(majorDomainCases)('reads a valid versioned $name value', ({ contract, valid }) => {
    vi.stubGlobal('localStorage', localStorageStub({
      [`vcpx:${contract.key}`]: JSON.stringify({ storageVersion: contract.version, value: valid }),
    }));

    expect(storage.getParsed(contract)).toEqual(valid);
  });

  it.each(majorDomainCases)('reads an unversioned historical $name value without rewriting it', ({ contract, valid }) => {
    const raw = JSON.stringify(valid);
    const local = localStorageStub({ [`vcpx:${contract.key}`]: raw });
    vi.stubGlobal('localStorage', local);

    expect(storage.getParsed(contract)).toEqual(valid);
    expect(local.getItem(`vcpx:${contract.key}`)).toBe(raw);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it.each(majorDomainCases)('keeps invalid JSON untouched for $name', ({ contract }) => {
    const local = localStorageStub({ [`vcpx:${contract.key}`]: '{invalid' });
    vi.stubGlobal('localStorage', local);

    expect(storage.getParsed(contract)).toEqual(contract.fallback);
    expect(local.getItem(`vcpx:${contract.key}`)).toBe('{invalid');
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it.each(majorDomainCases)('keeps a future $name version untouched', ({ contract, valid }) => {
    const raw = JSON.stringify({ storageVersion: contract.version + 1, value: valid });
    const local = localStorageStub({ [`vcpx:${contract.key}`]: raw });
    vi.stubGlobal('localStorage', local);

    expect(storage.getParsed(contract)).toEqual(contract.fallback);
    expect(local.getItem(`vcpx:${contract.key}`)).toBe(raw);
    expect(local.setItem).not.toHaveBeenCalled();
  });

  it.each(majorDomainCases)('reports unavailable reads and writes for $name', ({ contract, valid }) => {
    vi.stubGlobal('localStorage', localStorageStub({}, {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
      setItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    }));

    expect(storage.getParsed(contract)).toEqual(contract.fallback);
    expect(storage.setParsed(contract, valid)).toMatchObject({ ok: false, reason: 'unavailable' });
  });

  it.each(domainLimitCases)('rejects the documented $name limit', ({ contract, valid }) => {
    expect(contract.parse(valid)).toEqual({ ok: false, reason: 'limit' });
  });

  it.each(malformedCases)('rejects malformed runtime data for $contract.key', ({ contract, malformed }) => {
    vi.stubGlobal('localStorage', localStorageStub({
      [`vcpx:${contract.key}`]: JSON.stringify(malformed),
    }));

    expect(storage.getParsed(contract)).toEqual(contract.fallback);
    expect(storageErrors.getSnapshot()).toMatchObject({
      reason: 'validation',
      operation: 'read',
      key: contract.key,
    });
  });

  it('accepts an unversioned profile and enrollment through the declared v0 migration', () => {
    const profile = { profileType: 'analyste', timeBudget: '2h', scores: { analyse: 4 } };
    const enrollments = {
      cert: {
        certificationId: 'cert',
        selection: { fundStage: 'seed', dealRole: 'lead', specialty: 'impact' },
        createdAt: '2026-07-22T00:00:00.000Z',
        updatedAt: '2026-07-22T00:00:00.000Z',
      },
    };
    vi.stubGlobal('localStorage', localStorageStub({
      'vcpx:profile': JSON.stringify(profile),
      'vcpx:certification-enrollments': JSON.stringify(enrollments),
    }));

    expect(storage.getParsed(STORAGE_CONTRACTS.profile)).toEqual(profile);
    expect(storage.getParsed(STORAGE_CONTRACTS.certificationEnrollments)).toEqual(enrollments);
  });

  it('rejects a note body above the documented free-text limit', () => {
    vi.stubGlobal('localStorage', localStorageStub());
    const note = {
      id: 'n1',
      kind: 'note' as const,
      body: 'x'.repeat(STORAGE_LIMITS.freeText + 1),
      createdAt: '2026-07-22T00:00:00.000Z',
    };

    expect(storage.setParsed(STORAGE_CONTRACTS.notes, [note])).toMatchObject({
      ok: false,
      reason: 'limit',
      operation: 'write',
      key: 'notes',
    });
  });

  it('rejects collections above their documented item limit', () => {
    vi.stubGlobal('localStorage', localStorageStub());
    const notes = Array.from({ length: STORAGE_LIMITS.notes + 1 }, (_, index) => ({
      id: `n${index}`,
      kind: 'note' as const,
      body: 'Note',
      createdAt: '2026-07-22T00:00:00.000Z',
    }));

    expect(storage.setParsed(STORAGE_CONTRACTS.notes, notes)).toMatchObject({
      ok: false,
      reason: 'limit',
      key: 'notes',
    });
  });

  it('returns safe fallbacks when localStorage is unavailable', () => {
    vi.stubGlobal('localStorage', localStorageStub({}, {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    }));

    expect(storage.getParsed(STORAGE_CONTRACTS.profile)).toBeNull();
    expect(storage.getParsed(STORAGE_CONTRACTS.notes)).toEqual([]);
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'unavailable', operation: 'read' });
  });
});
