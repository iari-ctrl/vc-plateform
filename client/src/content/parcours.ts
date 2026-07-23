// Parcours — the trajectory layer that composes library atoms (lessons, courses,
// cases, simulators, glossary) toward a named destination. The data lives in
// data/parcours.json; this module loads it, resolves each step's reference to a
// real in-app route, and exposes the ikigai → parcours routing table.
//
// See docs/parcours/README.md and parcoursTypes.ts.
import parcoursJson from '@data/parcours.json';
import profileParcoursJson from '@data/profileParcours.json';
import { courseById } from './courses';
import { publicLessonById, publishedLessonsForCourse } from './lessons';
import { CASE_STUDIES } from './caseStudies';
import { SIMULATORS } from './simulators';
import { deliverableById } from './deliverables';
import type {
  Parcours,
  ParcoursFamily,
  ParcoursStep,
  ProfileParcoursMap,
  TimeBudget,
} from './parcoursTypes';

export type {
  Parcours,
  ParcoursStep,
  ParcoursFamily,
  ParcoursMilestone,
  StepType,
  TimeBudget,
  Perspective,
  StepRefKind,
} from './parcoursTypes';

export const PARCOURS = parcoursJson as unknown as Parcours[];
export const PROFILE_PARCOURS = profileParcoursJson as unknown as ProfileParcoursMap;

/** Filtre les étapes selon la calibration définie dans profileParcours.json. */
export function visibleSteps(p: Parcours, budget: TimeBudget): ParcoursStep[] {
  const allowed = new Set(PROFILE_PARCOURS.timeCalibration[budget].show);
  return p.steps.filter((step) => allowed.has(step.type)).sort((a, b) => a.order - b.order);
}

export const parcoursBySlug = (slug: string) => PARCOURS.find((p) => p.slug === slug);
export const parcoursById = (id: string) => PARCOURS.find((p) => p.id === id);

// ── Families — the « Netflix shelves » of the catalogue, in display order ──────
export const FAMILY_ORDER: ParcoursFamily[] = [
  'decouvrir',
  'entretien',
  'levee',
  'grade',
  'maitriser',
  'express',
];

export const FAMILY_META: Record<ParcoursFamily, { label: string; tagline: string; kanji: string; accent: string }> = {
  decouvrir: { label: 'Découvrir', tagline: 'La porte d’entrée — comprendre le métier sans bullshit.', kanji: '発', accent: '#D28236' },
  entretien: { label: 'Réussir un entretien', tagline: 'Du stage au poste senior — arriver prêt le jour J.', kanji: '観', accent: '#4C6B8A' },
  levee: { label: 'Lever des fonds', tagline: 'Les deux sièges de la table — fondateur et investisseur.', kanji: '種', accent: '#3E7C6A' },
  grade: { label: 'Monter en grade', tagline: 'Déjà en poste — exercer le rôle, viser le cran d’après.', kanji: '理', accent: '#8A5A8A' },
  maitriser: { label: 'Maîtriser un sujet', tagline: 'Les obsessions mono-thème, courtes et partageables.', kanji: '契', accent: '#B0843B' },
  express: { label: 'Express', tagline: 'Tout ce qui se fait en une session — bingeable, zéro engagement.', kanji: '閃', accent: '#C2603F' },
};

/** Parcours of a family, sorted by roadmap weight (now → next → later) then title. */
export const parcoursByFamily = (family: ParcoursFamily) => {
  const weight: Record<string, number> = { now: 0, next: 1, later: 2 };
  return PARCOURS
    .filter((p) => p.family === family)
    .sort((a, b) => (weight[a.roadmap] ?? 9) - (weight[b.roadmap] ?? 9));
};

// ── Step reference resolution ─────────────────────────────────────────────────
const caseById = (id: string) => CASE_STUDIES.find((c) => c.id === id);
const simulatorById = (id: string) => SIMULATORS.find((s) => s.id === id);

export interface ResolvedStep {
  /** In-app route for the atom, or null when the content is still « à produire ». */
  href: string | null;
  /** True when the referenced atom exists and is reachable. */
  exists: boolean;
  /** The lesson id backing this step, when any (used to compute progress). */
  lessonId?: string;
  /** Lesson ids backing aggregate atoms such as courses. */
  lessonIds?: string[];
  readMin?: number;
}

/**
 * Resolve a step's `ref` to a concrete route. Milestone steps resolve, in order,
 * to a produced deliverable (`/livrables/...`), then to a written lesson (e.g.
 * the analyst mock `lea-mock`); otherwise they are an « à produire » placeholder
 * with no destination yet.
 */
export function resolveStep(step: ParcoursStep): ResolvedStep {
  const { kind, id } = step.ref;

  if (kind === 'milestone' || kind === 'deliverable') {
    const deliverable = deliverableById(id);
    if (deliverable) return { href: `/livrables/${deliverable.slug}`, exists: true, readMin: deliverable.readMin };
  }
  if (kind === 'lesson' || kind === 'milestone') {
    const lesson = publicLessonById(id);
    if (lesson) return { href: `/lessons/${lesson.slug}`, exists: true, lessonId: lesson.id, readMin: lesson.readMin };
  }
  if (kind === 'course') {
    const course = courseById(id);
    if (course) return { href: `/courses/${course.slug}`, exists: true, lessonIds: publishedLessonsForCourse(course.id).map((lesson) => lesson.id) };
  }
  if (kind === 'case') {
    const cs = caseById(id);
    if (cs) return { href: `/cases/${cs.slug}`, exists: true, readMin: cs.readMin };
  }
  if (kind === 'simulator') {
    const sim = simulatorById(id);
    if (sim) return { href: `/simulators/${sim.slug}`, exists: true };
  }
  if (kind === 'glossary') {
    return { href: `/glossary?term=${id}`, exists: true };
  }
  return { href: null, exists: false };
}

/** Lesson ids backing a parcours' steps — the basis for its progress ring. */
export const lessonIdsForParcours = (p: Parcours): string[] =>
  p.steps.flatMap((s) => {
    const resolved = resolveStep(s);
    return resolved.lessonIds ?? (resolved.lessonId ? [resolved.lessonId] : []);
  });

export const parcoursForLesson = (lessonId: string): Parcours[] =>
  PARCOURS.filter((p) => lessonIdsForParcours(p).includes(lessonId));

export const parcoursForCase = (caseId: string): Parcours[] =>
  PARCOURS.filter((p) => p.steps.some((s) => s.ref.kind === 'case' && s.ref.id === caseId));

export const parcoursForCourse = (courseId: string, lessonIds: string[] = []): Parcours[] => {
  const ids = new Set(lessonIds);
  return PARCOURS.filter((p) => {
    if (p.steps.some((s) => s.ref.kind === 'course' && s.ref.id === courseId)) return true;
    if (!ids.size) return false;
    return lessonIdsForParcours(p).some((id) => ids.has(id));
  });
};

// ── Ikigai → parcours routing (the « Ton parcours » banner) ───────────────────
export interface ProfileRoute {
  primary?: Parcours;
  then: Parcours[];
  express?: Parcours;
  cadence?: string;
}

/** Resolve the recommended parcours for an ikigai profile + time budget. */
export function routeForProfile(profileId: string | undefined, budget?: TimeBudget): ProfileRoute | null {
  if (!profileId) return null;
  const route = PROFILE_PARCOURS.byProfile?.[profileId];
  if (!route) return null;
  const cadence = budget ? PROFILE_PARCOURS.timeCalibration?.[budget]?.cadence : undefined;
  return {
    primary: parcoursById(route.primary),
    then: (route.then ?? []).map(parcoursById).filter((p): p is Parcours => !!p),
    express: route.express ? parcoursById(route.express) : undefined,
    cadence,
  };
}
