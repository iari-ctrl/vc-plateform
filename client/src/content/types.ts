import type { FurtherReadingKind } from '@shared/further-reading-contract.mjs';

export type Level = 'debutant' | 'intermediaire' | 'avance' | 'tous';

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  level: Level;
  durationMin: number;
  /** How the displayed reading duration is obtained. Legacy courses omit it. */
  durationSource?: 'declared' | 'lesson-read-minutes';
  summary: string;
  tags: string[];
  lessonIds: string[];
}

export interface QuizQuestion {
  question: string;
  options: { text: string; correct: boolean }[];
  explanation: string;
}

export interface FurtherReading {
  label: string;
  kind: FurtherReadingKind;
  ref: string;
}

export interface Lesson {
  id: string;
  slug: string;
  courseId: string;
  order: number;
  title: string;
  kicker: string;
  readMin: number;
  summary: string;
  /** Explicit publication state; omission is invalid and never public. */
  status: 'published' | 'upcoming';
  /** Lesson-level pedagogy used by certification curricula. */
  level?: Level;
  contexts?: {
    fundStages?: string[];
    dealRoles?: string[];
    sectors?: string[];
  };
  optional?: boolean;
  /** Contribution to a longitudinal production, kept separate from reading time. */
  practice?: {
    deliverableId: string;
    sectionId: string;
    estimatedMinutes: number;
  };
  learningOutcomes?: string[];
  prerequisiteLessonIds?: string[];
  assessmentId?: string;
  /** The full, deep version of the lesson — the default when no `bodyShort` exists. */
  body: string;
  /** Optional "essentiel" version shown by default; `body` becomes the opt-in "Profond". */
  bodyShort?: string;
  keyTakeaways: string[];
  glossaryRefs: string[];
  quiz?: QuizQuestion[];
  furtherReading?: FurtherReading[];
}

/** Light lesson entry (everything but the heavy reader payload) — eager on the
 *  hot path; see `LessonBody` for the lazily-loaded remainder. */
export type LessonIndexEntry = Omit<Lesson, 'body' | 'bodyShort' | 'keyTakeaways' | 'quiz' | 'furtherReading'>;

/** The heavy part of a lesson (reader payload), loaded lazily and keyed by slug. */
export type LessonBody = Pick<Lesson, 'body' | 'bodyShort' | 'keyTakeaways' | 'quiz' | 'furtherReading'>;

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  /** Synonyms / abbreviations indexed for search (e.g. "VC", "capital-risque"). */
  aliases?: string[];
  latin?: string;
  category: string;
  short: string;
  definition: string;
  example?: string;
  /** Optional external reference (funds, tools, institutions). */
  link?: string;
  seeAlso: string[];
  relatedLessonIds: string[];
}

/** Light glossary entry (everything but the heavy `definition`/`example`) —
 *  eager on the hot path; see `GlossaryDef` for the lazily-loaded remainder. */
export type GlossaryIndexEntry = Omit<GlossaryTerm, 'definition' | 'example'>;

/** The heavy part of a term, loaded lazily and keyed by slug. */
export interface GlossaryDef {
  definition: string;
  example?: string;
}

export interface CaseStudyTable {
  caption: string;
  columns: string[];
  rows: (string | number | null)[][];
  notes?: string[];
}

export interface CaseStudyDocument {
  id: string;
  title: string;
  kind: string;
  summary?: string;
  body?: string;
  tables?: CaseStudyTable[];
}

export interface CaseStudyDownload {
  label: string;
  href: string;
  format?: string;
  note?: string;
}

export interface CaseStudySeriesAOffer {
  id: string;
  label: string;
  primaryInvestmentM: number;
  secondaryM: number;
  preMoneyM: number;
  poolTargetPct: number;
  poolTiming: 'pre-money' | 'post-money';
  convertibleTreatment: string;
  shareClass: string;
  liquidationPreference: {
    multiple: number;
    participating: boolean;
    seniority: string;
  };
  governance: string;
}

export interface CaseStudyNumericScenario {
  id: string;
  title: string;
  summary: string;
  fullyDilutedSharesBefore: number;
  founderSharesBefore: number;
  allocatedOptionSharesBefore: number;
  unallocatedOptionPoolSharesBefore: number;
  seedInvestorSharesBefore: number;
  convertibleShareEquivalents: number;
  shareClasses: string[];
  conventions: string[];
  exitValuesM: number[];
  offers: CaseStudySeriesAOffer[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  kind: 'startup' | 'fund' | 'deal' | 'market' | string;
  company: string;
  year: number;
  readMin: number;
  summary: string;
  tags: string[];
  glossaryRefs: string[];
  sections: { heading: string; body: string }[];
  takeaways: string[];
  /** Pedagogical role. Learner dossiers never contain the worked conclusion. */
  learningRole?: 'standard' | 'learner-dossier' | 'transfer';
  documents?: CaseStudyDocument[];
  decisionQuestions?: string[];
  downloads?: CaseStudyDownload[];
  numericScenario?: CaseStudyNumericScenario;
  estimatedWorkMinutes?: number;
}

// ── Diagnostics and voluntarily revealed corrections ────────────────────────

export type DiagnosticResult = 'a-revoir' | 'acquis-a-confirmer' | 'point-maitrise';

export interface DiagnosticResourceRef {
  kind: 'lesson' | 'deliverable';
  id: string;
  label: string;
}

export interface DiagnosticOption {
  id: string;
  label: string;
  result: DiagnosticResult;
  feedback: string;
}

export interface DiagnosticItem {
  id: string;
  topic: string;
  prompt: string;
  options: DiagnosticOption[];
  resourceRefs: DiagnosticResourceRef[];
}

export interface Diagnostic {
  id: string;
  slug: string;
  parcoursId: string;
  title: string;
  summary: string;
  optional: true;
  items: DiagnosticItem[];
}

export interface CaseCorrectionDecisionBranch {
  title: string;
  decision: string;
  assumptions: string[];
  tradeoffs: string[];
  evidenceLimits: string[];
  informationNeeded: string[];
}

export interface CaseCorrection {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  readMin: number;
  sourceCaseId: string;
  revealAfterDeliverableId: string;
  sections: { heading: string; body: string }[];
  decisionBranches: CaseCorrectionDecisionBranch[];
  takeaways: string[];
}

// ── Livrables (milestones) ────────────────────────────────────────────────────
// The « do something » end of a parcours: a brief + a fill-in template + a
// self-evaluation rubric, anchored by a worked example that lives in the
// intelligence layer (an ecosystem dossier, a case, a memo). The parcours step
// references it by id via `ref.kind: 'milestone'`; see content/parcours.ts.

/** A worked example to imitate — an artefact already published elsewhere. */
export interface DeliverableModelRef {
  kind: 'ecosystem' | 'case' | 'memo' | 'lesson';
  id: string;
  /** Why this artefact is a good model — what to look at. */
  note: string;
}

/** One line of the self-evaluation grid. */
export interface DeliverableCriterion {
  /** What is being judged. */
  criterion: string;
  /** The concrete test the learner applies to their own draft. */
  check?: string;
  /** Stable key used by the local review workspace. */
  id?: string;
  description?: string;
  expectedEvidence?: string;
  commonError?: string;
  revisionQuestion?: string;
  /** Component ids covered by this criterion. Omission keeps legacy all-component behaviour. */
  componentIds?: string[];
}

export interface DeliverableRubricLevel {
  id: 'insuffisant' | 'acceptable' | 'solide' | 'non-observable' | string;
  label: string;
  description: string;
}

export interface DeliverableResource {
  label: string;
  href: string;
  format: string;
}

export interface DeliverableRoleCard {
  id: string;
  title: string;
  mandate: string;
  questions: string[];
}

/** One section of the template the learner fills in. */
export interface DeliverableTemplateSection {
  heading: string;
  /** Markdown — what goes in this section and how to write it. */
  prompt: string;
}

export interface DeliverableComponent {
  id: string;
  title: string;
  requirements: string[];
  /** Budgets for which the component is required. Omission keeps legacy all-mode behaviour. */
  requiredInBudgets?: ('low' | 'medium' | 'high')[];
}

export interface Deliverable {
  /** Matches the parcours step's `ref.id` (e.g. "todo-ic-simulation"). */
  id: string;
  slug: string;
  title: string;
  kicker?: string;
  readMin: number;
  summary: string;
  /** Markdown — the brief: what the learner produces and why. */
  brief: string;
  template: DeliverableTemplateSection[];
  rubric: DeliverableCriterion[];
  /** The exemplar to imitate, resolved to an in-app route by the page. */
  model?: DeliverableModelRef;
  /** Lessons that prepare this deliverable (theory backing the practice). */
  relatedLessonIds?: string[];
  glossaryRefs?: string[];
  tags?: string[];
  activityKind?: 'cumulative-exercise' | 'capstone' | 'worksheet' | 'workshop';
  estimatedWorkMinutes?: number;
  relatedCourseIds?: string[];
  caseStudyId?: string;
  correctionId?: string;
  components?: DeliverableComponent[];
  rubricLevels?: DeliverableRubricLevel[];
  evaluation?: ('auto' | 'peer' | 'practitioner')[];
  externalReviewMinutes?: number;
  resources?: DeliverableResource[];
  roleCards?: DeliverableRoleCard[];
  journal?: {
    sourceType: 'deliverable';
    predictionMin: number;
    predictionMax: number;
  };
}

/** Ouvrage analysé dans une « lecture oblique » (deux entrées pour un duel de livres). */
export interface BookRef {
  title: string;
  author: string;
  year?: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  /** Explicit publication gate; omission is invalid and never public. */
  status: 'draft' | 'published';
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readMin: number;
  category: string;
  excerpt: string;
  tags: string[];
  body: string;
  books?: BookRef[];
  /** Renvoi de fin d'article vers la couche structurée (slugs du glossaire). */
  glossaryRefs?: string[];
}

// ── Décortiquer un écosystème ────────────────────────────────────────────────
/** Nature du terrain décortiqué : une géographie, un secteur, ou une thèse transverse. */
export type EcosystemKind = 'geographie' | 'secteur' | 'these';

/** Degré d'assurance d'une conviction — assumé et affiché, jamais implicite. */
export type ConvictionStrength = 'exploratoire' | 'moyenne' | 'forte';

/** Une conviction datée et falsifiable — l'unité de base du dossier. */
export interface EcosystemConviction {
  /** L'affirmation — spécifique, vérifiable, à échéance. */
  statement: string;
  /** Horizon de vérification (ex. "2030"). */
  horizon?: string;
  strength: ConvictionStrength;
  /** Markdown — le raisonnement ex ante derrière la conviction. */
  rationale?: string;
}

/** Lecture directionnelle d'un signal surveillé. */
export type SignalDirection = 'haussier' | 'baissier' | 'incertain';

/** Un indicateur concret qui confirmera ou invalidera la thèse. */
export interface EcosystemSignal {
  label: string;
  direction: SignalDirection;
  /** Ce que le signal dirait s'il se confirmait / s'inversait. */
  note: string;
}

/** Acteur structurant de l'écosystème (fonds, startup, institution…). */
export interface EcosystemPlayer {
  name: string;
  role: 'fonds' | 'startup' | 'institution' | 'corporate' | string;
  note: string;
}

// ── Figures (graphiques + schémas) ───────────────────────────────────────────
/** Intensité qualitative d'une cellule de matrice comparative — rendue en pastilles. */
export type FigureRating = 'none' | 'low' | 'mid' | 'high';

/**
 * Une figure attachée à une section : graphique de données ou schéma conceptuel,
 * rendue en SVG natif theme-aware (aucun asset externe). Le contenu vit dans la
 * donnée ; le composant n'est qu'un moteur de rendu. Union discriminée par `kind`.
 */
export type EcosystemFigure =
  | {
      /** Barres horizontales — comparaisons de grandeurs (financements, volumes…). */
      kind: 'bars';
      title: string;
      caption?: string;
      /** Unité affichée à côté des valeurs (ex. "Md€", "M$", "apps"). */
      unit?: string;
      source?: string;
      bars: { label: string; value: number; valueLabel?: string; highlight?: boolean }[];
    }
  | {
      /** Courbe — une trajectoire dans le temps (valorisation, dépenses cumulées…). */
      kind: 'line';
      title: string;
      caption?: string;
      unit?: string;
      source?: string;
      points: { x: string; y: number; annotation?: string }[];
    }
  | {
      /** Matrice comparative — lignes × colonnes notées en pastilles. */
      kind: 'matrix';
      title: string;
      caption?: string;
      source?: string;
      columns: string[];
      rows: { label: string; cells: { rating: FigureRating; note?: string }[] }[];
    }
  | {
      /** Carte de positionnement — items placés sur deux axes (x, y dans [0,1]). */
      kind: 'quadrant';
      title: string;
      caption?: string;
      source?: string;
      /** Étiquettes des extrémités basse → haute de l'axe horizontal. */
      xAxis: [string, string];
      yAxis: [string, string];
      items: { label: string; x: number; y: number; highlight?: boolean }[];
    }
  | {
      /** Arborescence — une racine et ses familles, pour une taxonomie. */
      kind: 'taxonomy';
      title: string;
      caption?: string;
      source?: string;
      root: string;
      branches: { label: string; note?: string; items: string[]; highlight?: boolean }[];
    };

/** Une section d'analyse : prose markdown, plus d'éventuelles figures rendues à sa suite. */
export interface EcosystemSection {
  heading: string;
  body: string;
  figures?: EcosystemFigure[];
}

/**
 * Dossier vivant sur un écosystème : une thèse assumée, des analyses
 * structurées, des convictions datées et falsifiables, et les signaux qui
 * les confirmeront ou les invalideront. Daté à la création ET à la révision.
 *
 * Les dossiers forment un **arbre** : un dossier-racine (la synthèse d'un
 * écosystème) ouvre sur des sous-dossiers d'approfondissement via `parentId`,
 * eux-mêmes pouvant se ramifier à l'infini. Un dossier-racine porte la thèse
 * centrale ; un sous-dossier peut se contenter de ses analyses (`these` et les
 * collections de synthèse sont alors facultatives).
 */
export interface EcosystemDossier {
  id: string;
  slug: string;
  /** Nom court de l'écosystème ou du sous-thème (ex. "France", "Le Japon"). */
  name: string;
  title: string;
  subtitle: string;
  kind: EcosystemKind;
  accent: string;
  author: string;
  /** ISO — première publication du dossier. */
  createdAt: string;
  /** ISO — dernière révision (le dossier est un document vivant). */
  updatedAt: string;
  /** ISO — dernière vérification factuelle des données et sources. */
  verifiedAt?: string;
  readMin: number;
  summary: string;
  tags: string[];
  /** Id du dossier parent. Absent ⇒ dossier-racine (listé sur l'index). */
  parentId?: string;
  /** Rang parmi les frères et sœurs (croissant). À défaut, tri par date de révision. */
  order?: number;
  /** Markdown — la conviction centrale. Requise sur un dossier-racine, facultative en sous-dossier. */
  these?: string;
  /** Les analyses, section par section (chacune peut porter des figures). */
  sections: EcosystemSection[];
  convictions?: EcosystemConviction[];
  signals?: EcosystemSignal[];
  players?: EcosystemPlayer[];
  glossaryRefs: string[];
  sources?: { label: string; url: string }[];
}

// ── Anti-portfolio (pass analysis) ───────────────────────────────────────────
/** A recurring decision error, used to classify passes across entries. */
export interface AntiPortfolioPattern {
  id: string;
  label: string;
  glyph: string;
  accent: string;
  description: string;
  antidote: string;
}

export interface AntiPortfolioEntry {
  id: string;
  slug: string;
  company: string;
  title: string;
  subtitle: string;
  /** Funds (and partners, when public) that passed. */
  passes: { fund: string; partner?: string; year: number; stage: string }[];
  sector: string;
  patternIds: string[];
  readMin: number;
  summary: string;
  /** Public quote about the pass, when one exists. */
  quote?: { text: string; author: string; source: string };
  /** Verifiable, public information available at decision time. */
  knownAtTheTime: { date: string; fact: string }[];
  /** The stated reason for the pass. */
  statedReason: string;
  /** True when the reason is publicly documented (vs. reconstructed). */
  reasonIsPublic: boolean;
  /** Markdown — the signal that was there and missable. */
  missedSignal: string;
  /** Markdown — the honest ex-ante case FOR the pass (steelman). */
  steelman: string;
  /** What the company became. */
  outcome: string;
  /** Estimated cost of the pass — always framed as an estimate. */
  costEstimate?: string;
  takeaways: string[];
  glossaryRefs: string[];
  relatedMemoIds?: string[];
  sources: { label: string; url: string }[];
}

// ── Annotated memo library ───────────────────────────────────────────────────
/** Decision-logic move an annotation points at. */
export type MemoAnnotationTag =
  | 'these' | 'marche' | 'traction' | 'equipe' | 'risque' | 'deal' | 'concurrence' | 'verdict';

export interface MemoBlock {
  /** Short excerpt from the memo (translated). Kept brief — the original is linked. */
  excerpt: string;
  /** True when the passage is condensed/paraphrased rather than quoted. */
  isParaphrase?: boolean;
  /** Markdown — what the investor is doing here, decision-wise. */
  note: string;
  tag: MemoAnnotationTag;
}

export interface MemoSection {
  heading: string;
  blocks: MemoBlock[];
}

export interface InvestmentMemo {
  id: string;
  slug: string;
  company: string;
  title: string;
  fund: string;
  author: string;
  date: string;
  stage: string;
  amount?: string;
  outcome: string;
  whyItMatters: string;
  /** Link to the original, publicly published memo. */
  sourceUrl: string;
  /** Provenance — why this document is legitimately public. */
  sourceNote: string;
  readMin: number;
  summary: string;
  /** Markdown — the world at the time the memo was written. */
  context: string;
  sections: MemoSection[];
  /** What a practitioner should copy. */
  lessons: string[];
  glossaryRefs: string[];
  relatedAntiPortfolioIds?: string[];
  tags: string[];
}

export interface Simulator {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  accent: string;
  description: string;
  /** Guided time spent entering, reconciling and interpreting one scenario. */
  estimatedWorkMinutes?: number;
  relatedLessonIds: string[];
  glossaryRefs: string[];
}

/** Reading mode for the Ikigai "cahier": pedagogical vs. expert vocabulary. */
export type IkigaiMode = 'decouverte' | 'avance';

/** Onboarding interface mode choice. */
export type OnboardingMode = 'editorial' | 'bref' | 'interactif';

export interface IkigaiDimension {
  id: string;
  label: string;
  kanji: string;
  accent: string;
  /** Plain, pedagogical phrasing (Découverte). */
  itemsDecouverte?: string[];
  /** Expert phrasing with [[term]] / {{fund}} glossary markers (Avancé). */
  items: string[];
}
export interface IkigaiIntersection {
  id: string;
  label: string;
  subtitle: string;
  negative: string;
  /** Pedagogical example (Découverte). */
  exampleDecouverte?: string;
  /** Expert example with glossary markers (Avancé). */
  example: string;
  warning: string;
}
export interface PresqueIkigai {
  id: string;
  name: string;
  missingDim: string;
  formula: string;
  kanji: string;
  descriptionDecouverte?: string;
  description: string;
  trapDecouverte?: string;
  trap: string;
}
export interface LearningProfile {
  id: string;
  name: string;
  tag: string;
  kanji: string;
  accent: string;
  description: string;
  focus: string[];
  signals: string[];
}
export interface IkigaiQuestion {
  n: string;
  q: string;
  hint: string;
  options: { text: string; points: Record<string, number> }[];
}

export interface IkigaiDayItem {
  time: string;
  text: string;
}
/**
 * An "incarnated" archetype that sits at the centre of the diagram — a more
 * embodied layer above the learning profiles. Relates to one or more learning
 * profiles via `profileIds`.
 */
export interface IkigaiArchetype {
  id: string;
  name: string;
  tag: string;
  kanji: string;
  accent: string;
  positioningDecouverte: string;
  positioning: string;
  dayDecouverte: IkigaiDayItem[];
  day: IkigaiDayItem[];
  valueDecouverte: string;
  value: string;
  signalsDecouverte: string[];
  signals: string[];
  metrics: string[];
  /** Learning profiles this archetype resonates with. */
  profileIds: string[];
}

/** A free-text introspection prompt for the "cahier" (no scoring). */
export interface IkigaiReflectionQuestion {
  n: string;
  q: string;
  hint: string;
}

export interface IkigaiMyth {
  id: string;
  title: string;
  myth: string;
  reality: string;
  fundExample?: string;
}

export interface IkigaiData {
  dimensions: IkigaiDimension[];
  intersections: IkigaiIntersection[];
  presqueIkigai: PresqueIkigai[];
  profiles: LearningProfile[];
  /** Scored multiple-choice questions powering the orientation test. */
  questions: IkigaiQuestion[];
  /** Incarnated archetypes at the centre of the diagram. */
  archetypes: IkigaiArchetype[];
  /** Free-text introspection prompts (Découverte + Avancé sets). */
  reflection: {
    decouverte: IkigaiReflectionQuestion[];
    avance: IkigaiReflectionQuestion[];
  };
  myths: IkigaiMyth[];
}

// ── User-scoped types ──────────────────────────────────────────────────────
export interface UserProfile {
  profileType: string;
  timeBudget?: string;
  scores?: Record<string, number>;
}

export interface Note {
  id: string;
  kind: 'note' | 'quote' | 'highlight';
  body: string;
  sourceType?: string;
  sourceId?: string;
  sourceTitle?: string;
  createdAt: string;
}

export interface Bookmark {
  id?: string;
  itemType: string;
  itemId: string;
  title: string;
  href: string;
  createdAt?: string;
}

export interface ProgressEntry {
  lessonId: string;
  courseId?: string;
  pathId?: string;
  status: 'reading' | 'done';
  percent: number;
}

// ── Decision journal (Workspace calibration tool) ────────────────────────────
export type DecisionCategory = 'deal' | 'marche' | 'fonds' | 'these' | 'carriere' | 'autre';

/** How a resolved prediction turned out. `void` = unverifiable / premise gone. */
export type DecisionOutcome = 'correct' | 'incorrect' | 'void';

/** Pointer to any content on the platform (lesson, memo, anti-portfolio…). */
export interface DecisionLink {
  type: string;
  id: string;
  title: string;
  href: string;
}

export interface DecisionJournalEntry {
  id: string;
  /** The falsifiable claim — specific, dated, checkable. */
  statement: string;
  /** Evidence and reasoning available at prediction time (the ex-ante case). */
  rationale?: string;
  /** Stated probability the claim is true, in % (50–99). */
  confidence: number;
  category: DecisionCategory;
  /** ISO — when the prediction was made (the "dated" part). */
  createdAt: string;
  /** ISO — when to come back and confront it with reality. */
  reviewAt: string;
  status: 'open' | 'resolved';
  outcome?: DecisionOutcome;
  /** The lesson drawn at review time. */
  resolutionNote?: string;
  resolvedAt?: string;
  /** Content this prediction is grounded in. */
  links: DecisionLink[];
}
