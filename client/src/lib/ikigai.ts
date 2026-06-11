import { IKIGAI } from '@/content';
import { PROFILE_PARCOURS, parcoursById, routeForProfile, type Parcours, type TimeBudget } from '@/content/parcours';
import type { IkigaiArchetype, LearningProfile } from '@/content/types';

export interface OnboardingAnswer {
  questionN: string;
  optionIndex: number;
}

export interface ProfileResult {
  scores: Record<string, number>;
  ranked: { profile: LearningProfile; score: number }[];
  top: LearningProfile;
  timeBudget: 'low' | 'medium' | 'high';
}

/** Scores onboarding answers and returns the best-fit learning profile. */
export function computeProfile(answers: OnboardingAnswer[]): ProfileResult | null {
  if (!answers.length) return null;
  const scores: Record<string, number> = {};
  for (const p of IKIGAI.profiles) scores[p.id] = 0;

  let timeWeight = 0;
  let timeAnswered = false;

  for (const ans of answers) {
    const question = IKIGAI.questions.find((q) => q.n === ans.questionN);
    const option = question?.options[ans.optionIndex];
    if (!option) continue;
    for (const [pid, pts] of Object.entries(option.points)) {
      scores[pid] = (scores[pid] ?? 0) + pts;
    }
    // The last question measures available time (3 options, low→high).
    if (question && question.n === IKIGAI.questions[IKIGAI.questions.length - 1].n) {
      timeWeight = ans.optionIndex;
      timeAnswered = true;
    }
  }

  const ranked = IKIGAI.profiles
    .map((profile) => ({ profile, score: scores[profile.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const timeBudget: ProfileResult['timeBudget'] = !timeAnswered ? 'medium' : timeWeight === 0 ? 'low' : timeWeight === 1 ? 'medium' : 'high';

  return { scores, ranked, top: ranked[0].profile, timeBudget };
}

export function recommendedPaths(profile: LearningProfile, timeBudget?: string): Parcours[] {
  const route = routeForProfile(profile.id, timeBudget as TimeBudget | undefined);
  if (!route) return [];
  const ordered = [route.primary, ...route.then].filter((p): p is Parcours => !!p);
  return ordered.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
}

export const archetypeById = (id: string): IkigaiArchetype | undefined =>
  IKIGAI.archetypes.find((a) => a.id === id);

export function archetypePaths(archetype: IkigaiArchetype): Parcours[] {
  const bundle = PROFILE_PARCOURS.byArchetype?.[archetype.id]?.bundle ?? [];
  return bundle.map((id) => parcoursById(id)).filter((p): p is Parcours => !!p);
}

/**
 * Suggests the incarnated archetype that best resonates with a learning
 * profile, so the orientation result and the cahier stay connected.
 */
export function suggestedArchetype(profileId?: string): IkigaiArchetype | undefined {
  if (!profileId) return undefined;
  return IKIGAI.archetypes.find((a) => a.profileIds.includes(profileId)) ?? IKIGAI.archetypes[0];
}

export const TIME_LABEL: Record<string, string> = {
  low: 'Moins d’1 h / semaine',
  medium: '1 à 3 h / semaine',
  high: 'Plusieurs heures / semaine',
};
