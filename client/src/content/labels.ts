// Tiny, JSON-free helpers safe to import from eagerly-loaded surfaces (cards,
// primitives, the atlas) without dragging any content collection into the
// initial bundle.

export const LEVEL_LABEL: Record<string, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
  tous: 'Tous niveaux',
};

/** Nature d'un dossier « Décortiquer un écosystème ». JSON-free — usable from cards. */
export const ECOSYSTEM_KIND_LABEL: Record<string, string> = {
  geographie: 'Géographie',
  secteur: 'Secteur',
  these: 'Thèse transverse',
};

export const CASE_KIND_LABEL: Record<string, string> = {
  startup: 'Startup',
  fund: 'Fonds',
  deal: 'Deal',
  market: 'Marché',
};

export const SEARCH_TYPE_LABEL = {
  course: 'Cours',
  lesson: 'Leçon',
  glossary: 'Dictionnaire',
  case: 'Étude de cas',
  deliverable: 'Livrable',
  blog: 'Analyse',
  path: 'Parcours',
  simulator: 'Simulateur',
  'anti-portfolio': 'Anti-portfolio',
  memo: 'Memo annoté',
  ecosystem: 'Écosystème',
} as const;

export type SearchHitType = keyof typeof SEARCH_TYPE_LABEL;
