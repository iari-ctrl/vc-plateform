import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EMPTY_LEARNING_WORKSPACE,
  LEARNING_WORKSPACE_LIMITS,
  learningActivityKey,
  learningWorkspace,
  parseLearningWorkspace,
  productionStageAtLeast,
} from './learningWorkspace';
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

describe('learning workspace', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageStub());
    learningWorkspace.reload();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    learningWorkspace.reload();
  });

  it('rejects unknown schemas and malformed nested entries', () => {
    expect(parseLearningWorkspace({ schemaVersion: 99 })).toBe(EMPTY_LEARNING_WORKSPACE);
    expect(parseLearningWorkspace({
      schemaVersion: 1,
      diagnostics: { d1: { answers: { q1: 'o1', q2: 2 }, updatedAt: '2026-07-22' } },
      productions: { p1: { stage: 'reviewed', note: 'Note', updatedAt: '2026-07-22' }, broken: { stage: 'unknown' } },
    })).toBe(EMPTY_LEARNING_WORKSPACE);
  });

  it('migre le contrat v1 sans perdre diagnostics ni productions', () => {
    expect(parseLearningWorkspace({
      schemaVersion: 1,
      diagnostics: { d1: { answers: { q1: 'o1' }, updatedAt: '2026-07-22T00:00:00.000Z' } },
      productions: { p1: { stage: 'reviewed', note: 'Note', updatedAt: '2026-07-22T00:00:00.000Z' } },
    })).toMatchObject({
      schemaVersion: 2,
      diagnostics: { d1: { answers: { q1: 'o1' } } },
      productions: { p1: { stage: 'reviewed', note: 'Note' } },
      activities: {},
    });
  });

  it('ignores malformed stored JSON without overwriting the original', () => {
    const raw = JSON.stringify({ schemaVersion: 1, diagnostics: [], productions: {} });
    const local = localStorageStub({ 'vcpx:learning-workspace': raw });
    vi.stubGlobal('localStorage', local);
    learningWorkspace.reload();

    expect(learningWorkspace.getSnapshot()).toBe(EMPTY_LEARNING_WORKSPACE);
    expect(storageErrors.getSnapshot()).toMatchObject({
      reason: 'validation',
      operation: 'read',
      key: 'learning-workspace',
    });
    expect(local.getItem('vcpx:learning-workspace')).toBe(raw);
  });

  it('rejects free text above the workspace limit without changing the in-memory snapshot', () => {
    const result = learningWorkspace.updateProduction('vp-recommandation-soutien', {
      note: 'x'.repeat(LEARNING_WORKSPACE_LIMITS.freeText + 1),
    });

    expect(result).toMatchObject({ ok: false, reason: 'limit', key: 'learning-workspace' });
    expect(learningWorkspace.getSnapshot().productions).toEqual({});
  });

  it('rejects stored collections above the workspace limit', () => {
    const diagnostics = Object.fromEntries(Array.from(
      { length: LEARNING_WORKSPACE_LIMITS.diagnostics + 1 },
      (_, index) => [`d${index}`, { answers: {}, updatedAt: '2026-07-22T00:00:00.000Z' }],
    ));
    vi.stubGlobal('localStorage', localStorageStub({
      'vcpx:learning-workspace': JSON.stringify({ schemaVersion: 1, diagnostics, productions: {} }),
    }));
    learningWorkspace.reload();

    expect(learningWorkspace.getSnapshot()).toBe(EMPTY_LEARNING_WORKSPACE);
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'limit', operation: 'read' });
  });

  it('uses the empty workspace when localStorage is unavailable', () => {
    vi.stubGlobal('localStorage', localStorageStub({}, {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    }));
    learningWorkspace.reload();

    expect(learningWorkspace.getSnapshot()).toBe(EMPTY_LEARNING_WORKSPACE);
    expect(storageErrors.getSnapshot()).toMatchObject({ reason: 'unavailable', operation: 'read' });
  });

  it('persists diagnostic answers under the namespaced versioned key', () => {
    expect(learningWorkspace.saveDiagnosticAnswer('diag-vp-entree', 'comptes', 'option-b')).toEqual({ ok: true });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'vcpx:learning-workspace',
      expect.stringContaining('"schemaVersion":2'),
    );
    learningWorkspace.reload();
    expect(learningWorkspace.getSnapshot().diagnostics['diag-vp-entree'].answers).toEqual({ comptes: 'option-b' });
  });

  it('stores notes, external-file declarations, review mode, ratings and the change log', () => {
    expect(learningWorkspace.updateProduction('vp-recommandation-soutien', {
      note: 'Hypothèse à vérifier',
      externalFileProduced: true,
      reviewMode: 'practitioner',
      rubricRatings: { mandat: 'solide' },
      changeLog: 'Version 2 : scénario prudent ajouté.',
    })).toEqual({ ok: true });

    learningWorkspace.reload();
    expect(learningWorkspace.getSnapshot().productions['vp-recommandation-soutien']).toMatchObject({
      stage: 'started',
      note: 'Hypothèse à vérifier',
      externalFileProduced: true,
      reviewMode: 'practitioner',
      rubricRatings: { mandat: 'solide' },
      changeLog: 'Version 2 : scénario prudent ajouté.',
    });
  });

  it('ne termine un cas ou un simulateur qu’après une action explicite bornée au parcours', () => {
    const key = learningActivityKey('p-serie-a', 'simulator', 'dilution');

    expect(learningWorkspace.getSnapshot().activities[key]).toBeUndefined();
    expect(learningWorkspace.completeActivity('p-serie-a', 'simulator', 'dilution')).toEqual({ ok: true });

    expect(learningWorkspace.getSnapshot().activities[key]).toMatchObject({
      parcoursId: 'p-serie-a',
      kind: 'simulator',
      id: 'dilution',
      completed: true,
      completedAt: expect.any(String),
    });
    learningWorkspace.reload();
    expect(learningWorkspace.getSnapshot().activities[key]?.completed).toBe(true);
  });

  it('rejette une clé d’activité trop longue sans muter le snapshot', () => {
    const result = learningWorkspace.completeActivity('p-serie-a', 'case', 'x'.repeat(LEARNING_WORKSPACE_LIMITS.id + 1));

    expect(result).toMatchObject({ ok: false, reason: 'limit', key: 'learning-workspace' });
    expect(learningWorkspace.getSnapshot().activities).toEqual({});
  });

  it('keeps production stages monotonic and reveals the correction after a first version', () => {
    expect(learningWorkspace.revealCorrection('vp-recommandation-soutien')).toMatchObject({ ok: false });
    expect(learningWorkspace.advanceProduction('vp-recommandation-soutien', 'first-version-completed')).toEqual({ ok: true });
    expect(learningWorkspace.revealCorrection('vp-recommandation-soutien')).toEqual({ ok: true });
    const revealedAt = learningWorkspace.getSnapshot().productions['vp-recommandation-soutien'].correctionRevealedAt;
    expect(revealedAt).toEqual(expect.any(String));

    expect(learningWorkspace.advanceProduction('vp-recommandation-soutien', 'started')).toEqual({ ok: true });
    expect(learningWorkspace.getSnapshot().productions['vp-recommandation-soutien']).toMatchObject({
      stage: 'first-version-completed',
      correctionRevealedAt: revealedAt,
    });
  });

  it('declares the final milestone complete only after revision and observable evidence', () => {
    expect(learningWorkspace.advanceProduction('vp-recommandation-soutien', 'reviewed')).toEqual({ ok: true });
    expect(learningWorkspace.declareComplete('vp-recommandation-soutien')).toMatchObject({ ok: false });
    expect(learningWorkspace.advanceProduction('vp-recommandation-soutien', 'revised')).toEqual({ ok: true });
    expect(learningWorkspace.declareComplete('vp-recommandation-soutien')).toMatchObject({ ok: false });
    expect(learningWorkspace.updateProduction('vp-recommandation-soutien', {
      note: 'Version de travail produite hors plateforme.',
      externalFileProduced: true,
      reviewMode: 'peer',
      rubricRatings: { mandat: 'acceptable' },
      changeLog: 'Retour intégré et arbitrage principal corrigé.',
    })).toEqual({ ok: true });
    expect(learningWorkspace.declareComplete('vp-recommandation-soutien')).toEqual({ ok: true });
    expect(learningWorkspace.getSnapshot().productions['vp-recommandation-soutien'].declaredCompleteAt).toEqual(
      expect.any(String),
    );
    expect(productionStageAtLeast('revised', 'reviewed')).toBe(true);
  });
});
