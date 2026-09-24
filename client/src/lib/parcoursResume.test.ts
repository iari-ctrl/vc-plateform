import { describe, expect, it } from 'vitest';

import { lessonIdsForParcours, parcoursBySlug } from '@/content/parcours';
import type { ProgressEntry, UserProfile } from '@/content/types';
import { EMPTY_LEARNING_WORKSPACE, learningActivityKey, type LearningWorkspaceState } from './learningWorkspace';
import {
  buildParcoursSummaries,
  effectiveIndexBudget,
  lastTouchedAt,
  selectParcoursResume,
} from './parcoursResume';

const decouvrir = parcoursBySlug('le-vc-sans-bullshit');
const serieA = parcoursBySlug('preparer-ma-serie-a');
const principal = parcoursBySlug('passer-principal');
if (!decouvrir || !serieA || !principal) throw new Error('parcours de référence introuvable');

/** Marque lues les `count` premières leçons d'un parcours, sans jamais le terminer. */
function readFirstLessons(slugs: { parcoursId: string; ids: string[] }[]): Record<string, ProgressEntry> {
  const entries: [string, ProgressEntry][] = [];
  for (const { parcoursId, ids } of slugs) {
    for (const lessonId of ids) {
      entries.push([lessonId, { lessonId, status: 'done', percent: 100, pathId: parcoursId }]);
    }
  }
  return Object.fromEntries(entries);
}

const decouvrirLessons = lessonIdsForParcours(decouvrir);
const serieALessons = lessonIdsForParcours(serieA);

const withActivity = (parcoursId: string, id: string, at: string): LearningWorkspaceState => ({
  ...EMPTY_LEARNING_WORKSPACE,
  activities: {
    [learningActivityKey(parcoursId, 'case', id)]: {
      parcoursId,
      kind: 'case',
      id,
      completed: true,
      completedAt: at,
      updatedAt: at,
    },
  },
});

const resolve = (
  profile: UserProfile | null,
  progress: Record<string, ProgressEntry>,
  workspace: LearningWorkspaceState = EMPTY_LEARNING_WORKSPACE,
) => selectParcoursResume(profile, buildParcoursSummaries(progress, workspace, profile?.timeBudget), workspace);

describe('niveau d’approfondissement effectif', () => {
  it('borne le niveau demandé par le timeFit du parcours', () => {
    expect(principal.timeFit).toEqual(['high']);
    expect(effectiveIndexBudget(principal, 'low')).toBe('high');
    expect(effectiveIndexBudget(decouvrir, 'low')).toBe('low');
  });

  it('retombe sur « Complet » quand rien n’est demandé ou que la valeur est absurde', () => {
    expect(effectiveIndexBudget(decouvrir, undefined)).toBe('high');
    expect(effectiveIndexBudget(decouvrir, 'immersion-totale')).toBe('high');
  });
});

describe('dernière trace datée', () => {
  it('reste indéfinie pour un lecteur qui se contente de lire', () => {
    expect(lastTouchedAt(decouvrir, EMPTY_LEARNING_WORKSPACE)).toBeUndefined();
  });

  it('lit le parcoursId stocké sur l’activité, et ignore celles des autres parcours', () => {
    const workspace = withActivity('p-serie-a', 'cs-serie-a-alto-sas', '2026-07-25T00:00:00.000Z');
    expect(lastTouchedAt(serieA, workspace)).toBe('2026-07-25T00:00:00.000Z');
    expect(lastTouchedAt(decouvrir, workspace)).toBeUndefined();
  });
});

describe('ce que montre la zone haute de l’index', () => {
  it('sans profil ni progression, il n’y a rien à reprendre', () => {
    expect(resolve(null, {}).kind).toBe('cold');
  });

  it('avec un profil et aucune progression, elle recommande le parcours du profil', () => {
    const resume = resolve({ profileType: 'debutant-curieux', timeBudget: 'high' }, {});
    expect(resume.kind).toBe('recommended');
    if (resume.kind !== 'recommended') return;
    expect(resume.parcours.slug).toBe('le-vc-sans-bullshit');
    expect(resume.then.length).toBeGreaterThan(0);
    expect(resume.cadence).toBeTruthy();
  });

  it('sans profil, elle reprend le parcours entamé', () => {
    const progress = readFirstLessons([{ parcoursId: 'p-serie-a', ids: serieALessons.slice(0, 1) }]);
    const resume = resolve(null, progress);
    expect(resume.kind).toBe('resume');
    if (resume.kind !== 'resume') return;
    expect(resume.parcours.slug).toBe('preparer-ma-serie-a');
    expect(resume.summary.completedSteps).toBeGreaterThan(0);
    expect(resume.summary.percent).toBeLessThan(100);
  });

  it('la récence l’emporte sur l’avancement, faute d’horodatage sur les leçons', () => {
    const progress = readFirstLessons([
      { parcoursId: 'p-decouvrir-vc', ids: decouvrirLessons.slice(0, decouvrirLessons.length - 1) },
      { parcoursId: 'p-serie-a', ids: serieALessons.slice(0, 1) },
    ]);
    const workspace = withActivity('p-serie-a', 'cs-serie-a-alto-sas', '2026-07-25T00:00:00.000Z');
    const summaries = buildParcoursSummaries(progress, workspace);
    expect(summaries.get(decouvrir.id)!.percent)
      .toBeGreaterThan(summaries.get(serieA.id)!.percent);

    const resume = selectParcoursResume(null, summaries, workspace);
    expect(resume.kind).toBe('resume');
    if (resume.kind !== 'resume') return;
    expect(resume.parcours.slug).toBe('preparer-ma-serie-a');
  });

  it('le parcours déclaré du profil passe devant, même moins avancé et moins récent', () => {
    const progress = readFirstLessons([
      { parcoursId: 'p-decouvrir-vc', ids: decouvrirLessons.slice(0, 1) },
      { parcoursId: 'p-serie-a', ids: serieALessons.slice(0, 6) },
    ]);
    const workspace = withActivity('p-serie-a', 'cs-serie-a-alto-sas', '2026-08-01T00:00:00.000Z');
    const resume = selectParcoursResume(
      { profileType: 'debutant-curieux', timeBudget: 'high' },
      buildParcoursSummaries(progress, workspace, 'high'),
      workspace,
    );
    expect(resume.kind).toBe('resume');
    if (resume.kind !== 'resume') return;
    expect(resume.parcours.slug).toBe('le-vc-sans-bullshit');
  });

  it('expose une étape de reprise atteignable', () => {
    const progress = readFirstLessons([{ parcoursId: 'p-serie-a', ids: serieALessons.slice(0, 1) }]);
    const resume = resolve(null, progress);
    if (resume.kind !== 'resume') throw new Error('état inattendu');
    expect(resume.summary.resumeStep).toBeDefined();
    expect(resume.summary.resumeHref).toMatch(/^\//);
  });
});
