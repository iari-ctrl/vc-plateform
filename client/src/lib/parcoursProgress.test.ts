import { describe, expect, it } from 'vitest';

import { parcoursBySlug, visibleSteps } from '@/content/parcours';
import type { ProgressEntry } from '@/content/types';
import { EMPTY_LEARNING_WORKSPACE, learningActivityKey, type LearningWorkspaceState } from './learningWorkspace';
import { buildParcoursProgressSummary, parcoursStepNavigation } from './parcoursProgress';

const serieA = parcoursBySlug('preparer-ma-serie-a');

function progressDone(ids: string[]): Record<string, ProgressEntry> {
  return Object.fromEntries(ids.map((lessonId) => [
    lessonId,
    { lessonId, status: 'done', percent: 100, pathId: 'p-serie-a' },
  ]));
}

function workspaceWithActivities(keys: string[]): LearningWorkspaceState {
  return {
    ...EMPTY_LEARNING_WORKSPACE,
    activities: Object.fromEntries(keys.map((key) => [key, {
      parcoursId: key.split(':')[0],
      kind: key.split(':')[1] as 'case' | 'simulator',
      id: key.split(':')[2],
      completed: true,
      completedAt: '2026-07-25T00:00:00.000Z',
      updatedAt: '2026-07-25T00:00:00.000Z',
    }])),
  };
}

describe('progression de parcours mode-aware', () => {
  if (!serieA) throw new Error('parcours Série A introuvable');

  it('utilise le même sous-ensemble visible pour le dénominateur, la reprise et les statuts', () => {
    const mediumSteps = visibleSteps(serieA, 'medium');
    const coreLessonIds = mediumSteps
      .filter((step) => step.ref.kind === 'lesson')
      .map((step) => step.ref.id);
    const workspace = workspaceWithActivities([
      learningActivityKey('p-serie-a', 'case', 'cs-serie-a-alto-sas'),
      learningActivityKey('p-serie-a', 'simulator', 'dilution'),
    ]);

    const summary = buildParcoursProgressSummary(serieA, 'medium', progressDone(coreLessonIds), workspace);

    expect(summary.totalSteps).toBe(12);
    expect(summary.completedSteps).toBe(10);
    expect(summary.percent).toBe(83);
    expect(summary.resumeStep?.ref).toEqual({ kind: 'simulator', id: 'waterfall' });
    expect(summary.steps.filter((step) => step.visible).map((step) => step.ref.id)).not.toContain('lsa-branche-sectorielle');
  });

  it('ne reprend jamais une étape high masquée par le mode medium', () => {
    const summary = buildParcoursProgressSummary(serieA, 'medium', {
      'lsa-branche-sectorielle': { lessonId: 'lsa-branche-sectorielle', status: 'reading', percent: 25, pathId: 'p-serie-a' },
    }, EMPTY_LEARNING_WORKSPACE);

    expect(summary.resumeStep?.ref).toEqual({ kind: 'lesson', id: 'lsa-decision-lever' });
  });

  it('borne précédent et suivant au mode visible demandé', () => {
    const mediumNavigation = parcoursStepNavigation(serieA, 'medium', 'lesson', 'lsa-closing-board');
    const hiddenBonusNavigation = parcoursStepNavigation(serieA, 'medium', 'lesson', 'lsa-branche-sectorielle');

    expect(mediumNavigation?.previous?.ref).toEqual({ kind: 'lesson', id: 'lsa-negociation-dossier' });
    expect(mediumNavigation?.next?.ref).toEqual({ kind: 'milestone', id: 'todo-attentes-serie-a' });
    expect(hiddenBonusNavigation).toBeNull();
  });
});
