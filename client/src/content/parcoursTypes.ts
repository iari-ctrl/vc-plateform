// Couche « Parcours » — trajectoires orientées objectif posées au-dessus des
// matières (leçons, cours, cas, simulateurs). Les conventions éditoriales sont
// décrites dans docs/parcours/README.md.

import type { Level } from './types';

/** Perspective d'apprentissage (décision n°1 : la levée se lit des deux sièges). */
export type Perspective = 'founder' | 'investor' | 'both';

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
  label: string;
  /** 'existant' = atome déjà dans la bibliothèque ; 'a-produire' = contenu neuf. */
  status: 'existant' | 'a-produire';
  /** Étape décisive pour la suite — affichée « important pour la suite » (décision n°3). */
  keystone?: boolean;
  /** Prérequis conseillé, montré en filigrane (jamais bloquant en mode soft). */
  prereqNote?: string;
  note?: string;
}

/** Le jalon : le livrable concret qui couronne le parcours (récompense, pas examen). */
export interface ParcoursMilestone {
  type: string; // 'deal-memo' | 'deck' | 'cap-table' | 'quiz' | 'none' | ...
  label: string;
  description: string;
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
  title: string;
  /** La promesse, en une phrase — affichée avant tout sommaire. */
  hook: string;
  kanji?: string;
  accent?: string;
  goal: string;
  forWhom: string[];
  /** Siège d'apprentissage explicite ; 'both' affiche le point de vue des deux parties. */
  perspective?: Perspective;
  level: Level;
  /** Niveau d'entrée conseillé (peut différer de `level`). */
  entryLevel: Level;
  time: {
    coreHours: number;
    withBonusHours?: number;
    sessions?: number;
    cadence?: string;
  };
  /** Budgets-temps auxquels le parcours convient. */
  timeFit: TimeBudget[];
  /** Ids de profils ikigai (cf. data/ikigai.json → profiles[].id). */
  recommendedForProfiles: string[];
  milestone?: ParcoursMilestone;
  steps: ParcoursStep[];
  outcomes: string[];
  prerequisites?: string[];
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
