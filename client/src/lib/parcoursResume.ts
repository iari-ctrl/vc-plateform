// Une seule lecture de la progression pour l'index /parcours.
//
// Trois calculs concurrents coexistaient : ParcoursPage comptait les leçons
// déclarées lues, ParcoursCard recalculait le même ratio, PathAtlas un
// troisième. Tous ignoraient les cas, les simulateurs et les jalons, et aucun
// ne tenait compte du niveau d'approfondissement. `buildParcoursProgressSummary`
// fait déjà tout cela — ce module l'applique au catalogue entier et en tire la
// question que la page pose en premier : « où en suis-je ? ».
import {
  FAMILY_ORDER,
  PARCOURS,
  isTimeBudget,
  routeForProfile,
  type Parcours,
  type TimeBudget,
} from '@/content/parcours';
import type { ProgressEntry, UserProfile } from '@/content/types';
import { buildParcoursProgressSummary, type ParcoursProgressSummary } from './parcoursProgress';
import type { LearningWorkspaceState } from './learningWorkspace';

/**
 * Le vocabulaire du curseur, identique à celui de `ParcoursDetailPage` : le mot
 * rencontré sur l'index doit être celui retrouvé sur le détail. L'ordre est
 * croissant en profondeur et sert aussi de repli quand un parcours ne convient
 * pas au niveau demandé.
 */
export const TIME_BUDGET_OPTIONS: { id: TimeBudget; label: string; sub: string }[] = [
  { id: 'low', label: 'Essentiel', sub: 'Étapes essentielles' },
  { id: 'medium', label: 'Standard', sub: 'Cœur + pratique' },
  { id: 'high', label: 'Complet', sub: 'Toutes les étapes' },
];

/** Le défaut : `high` retient les 24 parcours, « aucun filtre » et « Complet » désignent le même ensemble. */
export const DEFAULT_TIME_BUDGET: TimeBudget = 'high';

/**
 * Le niveau réellement appliqué à un parcours, borné par son `timeFit`.
 * Reproduit la chaîne de `ParcoursDetailPage` pour que l'index et le détail ne
 * puissent pas diverger sur le même parcours.
 */
export function effectiveIndexBudget(parcours: Parcours, preferred?: string): TimeBudget {
  const requested = isTimeBudget(preferred) ? preferred : DEFAULT_TIME_BUDGET;
  if (parcours.timeFit.includes(requested)) return requested;
  return TIME_BUDGET_OPTIONS.find((option) => parcours.timeFit.includes(option.id))?.id ?? DEFAULT_TIME_BUDGET;
}

export type ParcoursSummaries = Map<string, ParcoursProgressSummary>;

/** Une passe unique sur le catalogue : la page la mémoïse et la partage avec chaque rangée. */
export function buildParcoursSummaries(
  progress: Record<string, ProgressEntry>,
  workspace: LearningWorkspaceState,
  preferred?: string,
): ParcoursSummaries {
  return new Map(PARCOURS.map((parcours) => [
    parcours.id,
    buildParcoursProgressSummary(parcours, effectiveIndexBudget(parcours, preferred), progress, workspace),
  ]));
}

/**
 * La dernière trace datée laissée sur un parcours.
 *
 * `ProgressEntry` ne porte aucun horodatage : pour un lecteur qui se contente de
 * lire, la récence est hors d'atteinte. Mais l'espace de travail en porte trois
 * — les activités (cas, simulateurs) stockent leur `parcoursId`, les productions
 * sont indexées par un id d'étape qui n'appartient qu'à un parcours, et le
 * diagnostic d'entrée est daté. La récence est donc une couche, jamais la règle
 * entière.
 */
export function lastTouchedAt(parcours: Parcours, workspace: LearningWorkspaceState): string | undefined {
  let latest: string | undefined;
  const consider = (value?: string) => {
    if (value && (latest === undefined || value > latest)) latest = value;
  };

  for (const entry of Object.values(workspace.activities)) {
    if (entry.parcoursId !== parcours.id) continue;
    consider(entry.completedAt);
    consider(entry.updatedAt);
  }
  for (const step of parcours.steps) {
    if (step.ref.kind !== 'deliverable' && step.ref.kind !== 'milestone') continue;
    consider(workspace.productions[step.ref.id]?.updatedAt);
  }
  if (parcours.entryDiagnosticId) consider(workspace.diagnostics[parcours.entryDiagnosticId]?.updatedAt);

  return latest;
}

export type ParcoursResume =
  | { kind: 'resume'; parcours: Parcours; summary: ParcoursProgressSummary }
  | { kind: 'recommended'; parcours: Parcours; then: Parcours[]; cadence?: string }
  | { kind: 'cold' };

interface Candidate {
  parcours: Parcours;
  summary: ParcoursProgressSummary;
  touchedAt?: string;
}

/** Départage stable : ordre éditorial des familles, puis slug. */
function byCatalogueOrder(a: Candidate, b: Candidate): number {
  return (
    FAMILY_ORDER.indexOf(a.parcours.family) - FAMILY_ORDER.indexOf(b.parcours.family)
    || a.parcours.slug.localeCompare(b.parcours.slug, 'fr')
  );
}

/**
 * Ce que la zone haute de l'index doit montrer, dans cet ordre :
 *
 * 1. le parcours principal du profil s'il est entamé — une déclaration
 *    explicite du lecteur, et la seule règle qui rende la zone stable au lieu
 *    de sauter à chaque parcours annexe touché ;
 * 2. sinon le parcours entamé le plus récemment touché ;
 * 3. sinon le parcours entamé le plus avancé ;
 * 4. sinon la recommandation issue du test d'orientation ;
 * 5. sinon rien à reprendre — la page propose le test.
 */
export function selectParcoursResume(
  profile: UserProfile | null,
  summaries: ParcoursSummaries,
  workspace: LearningWorkspaceState,
): ParcoursResume {
  const started: Candidate[] = [];
  for (const parcours of PARCOURS) {
    const summary = summaries.get(parcours.id);
    if (!summary || summary.completedSteps === 0 || summary.percent >= 100) continue;
    started.push({ parcours, summary, touchedAt: lastTouchedAt(parcours, workspace) });
  }

  const route = routeForProfile(
    profile?.profileType,
    isTimeBudget(profile?.timeBudget) ? profile.timeBudget : undefined,
  );

  if (route?.primary) {
    const primary = started.find((candidate) => candidate.parcours.id === route.primary?.id);
    if (primary) return { kind: 'resume', parcours: primary.parcours, summary: primary.summary };
  }

  const touched = started.filter((candidate) => candidate.touchedAt !== undefined);
  if (touched.length > 0) {
    const best = [...touched].sort((a, b) => (
      b.touchedAt!.localeCompare(a.touchedAt!) || byCatalogueOrder(a, b)
    ))[0];
    return { kind: 'resume', parcours: best.parcours, summary: best.summary };
  }

  if (started.length > 0) {
    const best = [...started].sort((a, b) => (
      b.summary.percent - a.summary.percent || byCatalogueOrder(a, b)
    ))[0];
    return { kind: 'resume', parcours: best.parcours, summary: best.summary };
  }

  if (route?.primary) {
    return { kind: 'recommended', parcours: route.primary, then: route.then, cadence: route.cadence };
  }

  return { kind: 'cold' };
}
