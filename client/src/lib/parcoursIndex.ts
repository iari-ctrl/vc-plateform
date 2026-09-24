// Les deux questions que l'index /parcours pose, et rien d'autre : vers quelle
// destination, et jusqu'où. Logique pure, testable sans DOM.
//
// Le tri par durée vit ici plutôt que dans `content/parcours.ts` :
// `content/learningTime.ts` importe déjà `resolveStep` depuis `content/parcours.ts`,
// et l'import inverse fermerait un cycle ESM.
import {
  FAMILY_META,
  FAMILY_ORDER,
  PARCOURS,
  type Parcours,
  type ParcoursFamily,
  type TimeBudget,
} from '@/content/parcours';
import { parcoursTimeSummary } from '@/content/learningTime';
import { DEFAULT_TIME_BUDGET, TIME_BUDGET_OPTIONS } from './parcoursResume';

export type FamilyFilter = 'all' | ParcoursFamily;

export const FAMILY_FILTER_OPTIONS: { id: FamilyFilter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  ...FAMILY_ORDER.map((family) => ({ id: family as FamilyFilter, label: FAMILY_META[family].label })),
];

export interface ParcoursIndexFilters {
  family: FamilyFilter;
  budget: TimeBudget;
  /**
   * Vrai seulement quand le lecteur a choisi un niveau. Le défaut `high` retient
   * les 24 parcours : le propager dans les liens écraserait silencieusement le
   * budget du profil sur la page de détail.
   */
  budgetExplicit: boolean;
}

/** Tout paramètre inconnu retombe sur son défaut : une URL bricolée ne peut pas coincer la page. */
export function parseParcoursIndexFilters(params: URLSearchParams): ParcoursIndexFilters {
  const rawFamily = params.get('family');
  const rawBudget = params.get('budget');
  const budgetExplicit = TIME_BUDGET_OPTIONS.some((option) => option.id === rawBudget);
  return {
    family: FAMILY_FILTER_OPTIONS.some((option) => option.id === rawFamily)
      ? rawFamily as FamilyFilter
      : 'all',
    budget: budgetExplicit ? rawBudget as TimeBudget : DEFAULT_TIME_BUDGET,
    budgetExplicit,
  };
}

export function matchesParcoursFilters(parcours: Parcours, family: FamilyFilter, budget: TimeBudget): boolean {
  if (family !== 'all' && parcours.family !== family) return false;
  return parcours.timeFit.includes(budget);
}

/**
 * Ordre d'un rayon : la curation éditoriale d'abord — `roadmap` est un champ
 * authored, pas un artefact —, puis le temps requis croissant, puis le slug.
 *
 * Le départage doit lire `requiredMinutes` et non `time.coreHours` : quatre
 * parcours sont en `source: 'derived'` et ne portent aucun `coreHours`.
 */
const ROADMAP_WEIGHT: Record<string, number> = { now: 0, next: 1, later: 2 };

export function compareParcoursInFamily(a: Parcours, b: Parcours): number {
  return (
    (ROADMAP_WEIGHT[a.roadmap] ?? 9) - (ROADMAP_WEIGHT[b.roadmap] ?? 9)
    || parcoursTimeSummary(a).requiredMinutes - parcoursTimeSummary(b).requiredMinutes
    || a.slug.localeCompare(b.slug, 'fr')
  );
}

export interface ParcoursGroup {
  family: ParcoursFamily;
  items: Parcours[];
}

/**
 * Les six rayons dans l'ordre éditorial, les vides compris — l'appelant les
 * masque. Prend des primitives plutôt que l'objet de filtres pour rester
 * mémoïsable sans dépendance instable.
 */
export function groupParcoursByFamily(family: FamilyFilter, budget: TimeBudget): ParcoursGroup[] {
  return FAMILY_ORDER.map((shelf) => ({
    family: shelf,
    items: PARCOURS
      .filter((parcours) => parcours.family === shelf && matchesParcoursFilters(parcours, family, budget))
      .sort(compareParcoursInFamily),
  }));
}

/** Le lien d'une rangée : le niveau choisi suit le lecteur jusqu'au curseur d'étapes du détail. */
export function parcoursIndexHref(parcours: Parcours, filters: ParcoursIndexFilters): string {
  return filters.budgetExplicit
    ? `/parcours/${parcours.slug}?budget=${filters.budget}`
    : `/parcours/${parcours.slug}`;
}
