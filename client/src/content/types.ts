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
