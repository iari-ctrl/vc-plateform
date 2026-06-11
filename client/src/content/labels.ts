// Tiny, JSON-free helpers safe to import from eagerly-loaded surfaces (cards,
// primitives, the atlas) without dragging any content collection into the
// initial bundle.

export const LEVEL_LABEL: Record<string, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
  tous: 'Tous niveaux',
};

export function lessonHref(lesson: { slug: string }) {
  return `/lessons/${lesson.slug}`;
}
export function courseHref(course: { slug: string }) {
  return `/courses/${course.slug}`;
}
