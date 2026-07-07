// Couche « Parcours » — trajectoires orientées objectif posées au-dessus des
// matières (leçons, cours, cas, simulateurs). Voir docs/parcours-apprentissage-conception.md.
//
// Non destructif : ce fichier vit à côté de `types.ts`. Le type `Level` y est
// déjà défini ('debutant' | 'intermediaire' | 'avance' | 'tous') — on le réimporte
// plutôt que de le redéclarer, pour rester aligné avec la bibliothèque existante.
//
// À l'intégration : `import { Parcours } from './parcoursTypes'` puis charger
// `@data/parcours.json` comme les autres jeux de données.

import type { Level } from './types';

// ── Textes FR ────────────────────────────────────────────────────────────────
// Helper conservé pour les appels existants (`t(parcours.title)`), mais la V1 ne
// sert plus de variantes localisées : les champs texte sont des chaînes FR.
export type LocalizedText = string;

export function t(text: LocalizedText | undefined): string {
  return text ?? '';
}

/** Perspective d'apprentissage (décision n°1 : la levée se lit des deux sièges). */
export type Perspective = 'founder' | 'investor' | 'both';

/** Mode de progression (décision n°3 : souple par défaut, verrou optionnel). */
export type Gating = 'soft' | 'lock';

/** Familles de parcours (les « étagères » de la page Parcours). */
export type ParcoursFamily =
  | 'decouvrir'   // la porte d'entrée
  | 'entretien'   // réussir un entretien (stage → principal)
  | 'levee'       // lever des fonds (pré-seed → Série A)
  | 'grade'       // monter en grade (analyst → GP)
  | 'maitriser'   // deep-dives mono-thème
  | 'express';    // format court, une session

/** Ordre de construction (feuille de route Now/Next/Later). */
export type ParcoursRoadmap = 'now' | 'next' | 'later';

/** Le budget-temps issu du test d'orientation ikigai. */
export type TimeBudget = 'low' | 'medium' | 'high';

/** Type d'une étape — implémente le principe de navigation libre + curseur temps. */
export type StepType =
  | 'coeur'        // la colonne vertébrale, l'indispensable
  | 'bonus'        // approfondissement, débloqué si le temps suit
  | 'pratique'     // « fais quelque chose » : simulateur, mock, livrable
  | 'respiration'; // léger et fun : une histoire de cas, un mythe démonté

/** Nature de l'atome référencé dans la bibliothèque. */
export type StepRefKind =
  | 'lesson'
  | 'course'
  | 'case'
  | 'simulator'
  | 'glossary'
  | 'milestone'; // jalon / contenu à produire (mock case, gabarit, etc.)

/** Une étape ne stocke pas de contenu : elle référence un atome par id. */
export interface ParcoursStep {
  order: number;
  type: StepType;
  ref: { kind: StepRefKind; id: string };
  label: LocalizedText;
  /** 'existant' = atome déjà dans la bibliothèque ; 'a-produire' = contenu neuf. */
  status: 'existant' | 'a-produire';
  /** Étape décisive pour la suite — affichée « important pour la suite » (décision n°3). */
  keystone?: boolean;
  /** Prérequis conseillé, montré en filigrane (jamais bloquant en mode soft). */
  prereqNote?: LocalizedText;
  note?: string;
}

/** Le jalon : le livrable concret qui couronne le parcours (récompense, pas examen). */
export interface ParcoursMilestone {
  type: string; // 'deal-memo' | 'deck' | 'cap-table' | 'quiz' | 'none' | ...
  label: LocalizedText;
  description: LocalizedText;
  /** Décision n°2 : auto-évaluation d'abord, revue par les pairs ensuite. */
  evaluation?: ('auto' | 'peer')[];
  rubricId?: string;
  modelAnswerId?: string;
}

export interface Parcours {
  id: string;
  slug: string;
  family: ParcoursFamily;
  roadmap: ParcoursRoadmap;
  title: LocalizedText;
  /** La promesse, en une phrase — affichée avant tout sommaire. */
  hook: LocalizedText;
  kanji?: string;
  accent?: string;
  goal: LocalizedText;
  forWhom: LocalizedText[];
  /** Siège d'apprentissage (décision n°1). Défaut 'investor' si absent ; 'both' pour la levée. */
  perspective?: Perspective;
  level: Level;
  /** Niveau d'entrée conseillé (peut différer de `level`). */
  entryLevel: Level;
  time: {
    coreHours: number;
    withBonusHours?: number;
    sessions?: number;
    cadence?: LocalizedText;
  };
  /** Budgets-temps auxquels le parcours convient. */
  timeFit: TimeBudget[];
  /** Mode de progression (décision n°3). Défaut 'soft' si absent. */
  gating?: Gating;
  /** Ids de profils ikigai (cf. data/ikigai.json → profiles[].id). */
  recommendedForProfiles: string[];
  milestone?: ParcoursMilestone;
  steps: ParcoursStep[];
  outcomes: LocalizedText[];
  prerequisites?: LocalizedText[];
}

/** Aiguillage profil/archétype → parcours (cf. data/profileParcours.json). */
export interface ProfileParcoursRoute {
  primary: string;
  then: string[];
  express?: string;
  note?: string;
}
export interface ArchetypeParcoursBundle {
  label: string;
  bundle: string[];
}
export interface ProfileParcoursMap {
  byProfile: Record<string, ProfileParcoursRoute>;
  byArchetype: Record<string, ArchetypeParcoursBundle>;
  timeCalibration: Record<TimeBudget, { show: StepType[]; cadence: string }>;
}

/** Filtre les étapes visibles selon le budget-temps (curseur temps). */
export function visibleSteps(p: Parcours, budget: TimeBudget): ParcoursStep[] {
  const show: Record<TimeBudget, StepType[]> = {
    low: ['coeur'],
    medium: ['coeur', 'pratique'],
    high: ['coeur', 'bonus', 'pratique', 'respiration'],
  };
  const allowed = new Set(show[budget]);
  return p.steps.filter((s) => allowed.has(s.type)).sort((a, b) => a.order - b.order);
}
