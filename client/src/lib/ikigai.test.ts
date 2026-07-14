import { describe, it, expect } from 'vitest';
import { IKIGAI } from '@/content';
import { PROFILE_PARCOURS, routeForProfile } from '@/content/parcours';
import { computeProfile, suggestedArchetype, type OnboardingAnswer } from './ikigai';

const questions = IKIGAI.questions;
const lastQuestion = questions[questions.length - 1];

/** Answer every question with the given option index (clamped to valid range). */
const answerAll = (optionIndex = 0): OnboardingAnswer[] =>
  questions.map((q) => ({ questionN: q.n, optionIndex: Math.min(optionIndex, q.options.length - 1) }));

describe('computeProfile', () => {
  it('returns null when there are no answers', () => {
    expect(computeProfile([])).toBeNull();
  });

  it('scores every learning profile and ranks them descending', () => {
    const result = computeProfile(answerAll(0));
    expect(result).not.toBeNull();
    const res = result!;

    for (const profile of IKIGAI.profiles) {
      expect(typeof res.scores[profile.id]).toBe('number');
    }

    const sorted = [...res.ranked].sort((a, b) => b.score - a.score);
    expect(res.ranked).toEqual(sorted);
    expect(res.top.id).toBe(res.ranked[0].profile.id);
  });

  it('maps a low-time answer on the last question to a low budget', () => {
    const res = computeProfile([{ questionN: lastQuestion.n, optionIndex: 0 }])!;
    expect(res.timeBudget).toBe('low');
  });

  it('maps a high-time answer to a high budget', () => {
    // The final question encodes available time (low → high). Guard against a
    // future content change that would shrink the option set.
    if (lastQuestion.options.length < 3) return;
    const res = computeProfile([{ questionN: lastQuestion.n, optionIndex: 2 }])!;
    expect(res.timeBudget).toBe('high');
  });

  it('defaults the time budget to medium when the last question is unanswered', () => {
    const res = computeProfile([{ questionN: questions[0].n, optionIndex: 0 }])!;
    expect(res.timeBudget).toBe('medium');
  });
});

describe('ikigai orientation mappings', () => {
  it('keeps the orientation test at nine questions', () => {
    expect(IKIGAI.questions).toHaveLength(9);
  });

  it('maps every learning profile to exactly one route and one archetype', () => {
    expect(IKIGAI.profiles).toHaveLength(7);
    expect(Object.keys(PROFILE_PARCOURS.byProfile).sort()).toEqual(
      IKIGAI.profiles.map((profile) => profile.id).sort(),
    );

    for (const profile of IKIGAI.profiles) {
      expect(routeForProfile(profile.id)?.primary, profile.id).toBeDefined();
      const matchingArchetypes = IKIGAI.archetypes.filter((archetype) => archetype.profileIds.includes(profile.id));
      expect(matchingArchetypes, profile.id).toHaveLength(1);
      expect(suggestedArchetype(profile.id)?.id).toBe(matchingArchetypes[0].id);
    }
  });

  it('routes investor relations through LP fundraising, GP thinking and carry', () => {
    const route = routeForProfile('investor-relations');

    expect(route?.primary?.id).toBe('p-levee-fonds-lp');
    expect(route?.then.map((parcours) => parcours.id)).toEqual(['p-penser-gp', 'p-carry']);
    expect(route?.express?.id).toBe('p-carry');
    expect(suggestedArchetype('investor-relations')?.id).toBe('architecte');
  });

  it('does not silently fall back for an unmapped profile', () => {
    expect(suggestedArchetype('profil-inconnu')).toBeUndefined();
  });
});
