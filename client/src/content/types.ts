export type Level = 'debutant' | 'intermediaire' | 'avance' | 'tous';

export interface Path {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  level: Level;
  accent: string;
  kanji?: string;
  durationHours: number;
  summary: string;
  forWhom: string[];
  outcomes: string[];
  courseIds: string[];
}

export interface Course {
  id: string;
  slug: string;
  pathId: string;
  order: number;
  title: string;
  subtitle: string;
  level: Level;
  durationMin: number;
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
  kind: 'lesson' | 'simulator' | 'case' | 'glossary' | string;
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
  body: string;
  keyTakeaways: string[];
  glossaryRefs: string[];
  quiz?: QuizQuestion[];
  furtherReading?: FurtherReading[];
}

/** Light lesson entry (everything but the heavy reader payload) — eager on the
 *  hot path; see `LessonBody` for the lazily-loaded remainder. */
export type LessonIndexEntry = Omit<Lesson, 'body' | 'keyTakeaways' | 'quiz' | 'furtherReading'>;

/** The heavy part of a lesson (reader payload), loaded lazily and keyed by slug. */
export type LessonBody = Pick<Lesson, 'body' | 'keyTakeaways' | 'quiz' | 'furtherReading'>;

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

/**
 * Dossier vivant sur un écosystème : une thèse assumée, des analyses
 * structurées, des convictions datées et falsifiables, et les signaux qui
 * les confirmeront ou les invalideront. Daté à la création ET à la révision.
 */
export interface EcosystemDossier {
  id: string;
  slug: string;
  /** Nom court de l'écosystème (ex. "France", "IA appliquée"). */
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
  readMin: number;
  summary: string;
  tags: string[];
  /** Markdown — la conviction centrale du dossier, assumée et datée. */
  these: string;
  /** Les analyses, section par section. */
  sections: { heading: string; body: string }[];
  convictions: EcosystemConviction[];
  signals: EcosystemSignal[];
  players?: EcosystemPlayer[];
  glossaryRefs: string[];
  sources: { label: string; url: string }[];
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
  recommendedPathIds: string[];
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
 * profiles via `profileIds` and recommends parcours via `recommendedPathIds`.
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
  recommendedPathIds: string[];
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
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | string;
}

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
