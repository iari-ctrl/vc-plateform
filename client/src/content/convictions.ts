import { ECOSYSTEMS } from './ecosystems';
import type { ConvictionStrength } from './types';

export interface ConvictionRecord {
  ecosystemId: string;
  ecosystemSlug: string;
  ecosystemName: string;
  accent?: string;
  statement: string;
  horizon?: string;
  strength: ConvictionStrength;
  rationale?: string;
}

const horizonYear = (horizon?: string) => {
  const match = horizon?.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
};

export function allConvictions(): ConvictionRecord[] {
  return ECOSYSTEMS.flatMap((ecosystem) =>
    (ecosystem.convictions ?? []).map((conviction) => ({
      ecosystemId: ecosystem.id,
      ecosystemSlug: ecosystem.slug,
      ecosystemName: ecosystem.name,
      accent: ecosystem.accent,
      statement: conviction.statement,
      horizon: conviction.horizon,
      strength: conviction.strength,
      rationale: conviction.rationale,
    })),
  ).sort((a, b) => {
    const horizonA = horizonYear(a.horizon) ?? 9999;
    const horizonB = horizonYear(b.horizon) ?? 9999;
    return horizonA - horizonB || a.ecosystemName.localeCompare(b.ecosystemName, 'fr');
  });
}

export function convictionsToReview(now: Date = new Date()): ConvictionRecord[] {
  const year = now.getFullYear();
  return allConvictions().filter((conviction) => {
    const target = horizonYear(conviction.horizon);
    return target !== null && target <= year;
  });
}
