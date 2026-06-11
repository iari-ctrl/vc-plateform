// Calibration math for the decision journal (Workspace).
//
// A prediction is "scored" once resolved as correct/incorrect; `void` outcomes
// (premise disappeared, claim unverifiable) are excluded from every metric so
// they never distort the calibration read.
import type { DecisionJournalEntry, DecisionOutcome } from '@/content/types';

/** Below 50 % you would state the opposite claim instead. */
export const CONFIDENCE_MIN = 50;
export const CONFIDENCE_MAX = 99;

/** Resolved predictions needed before the verdict means anything. */
export const MIN_SAMPLE = 10;

/** Announced − observed gap (in points) tolerated before calling a bias. */
export const CALIBRATION_TOLERANCE = 5;

export function isDue(entry: DecisionJournalEntry, now: Date = new Date()): boolean {
  return entry.status === 'open' && new Date(entry.reviewAt).getTime() <= now.getTime();
}

/** Resolved entries that count toward calibration (void excluded). */
export function scoredEntries(entries: DecisionJournalEntry[]): DecisionJournalEntry[] {
  return entries.filter((e) => e.status === 'resolved' && (e.outcome === 'correct' || e.outcome === 'incorrect'));
}

/**
 * Mean squared error between stated probability and reality (0 = oracle,
 * 0.25 = what a coin-flipper announcing 50 % everywhere would score).
 * Returns null when nothing is scored yet.
 */
export function brierScore(entries: DecisionJournalEntry[]): number | null {
  const scored = scoredEntries(entries);
  if (!scored.length) return null;
  const sum = scored.reduce((acc, e) => {
    const p = e.confidence / 100;
    const o = e.outcome === 'correct' ? 1 : 0;
    return acc + (p - o) ** 2;
  }, 0);
  return sum / scored.length;
}

export interface CalibrationBucket {
  /** Inclusive confidence bounds, in %. */
  min: number;
  max: number;
  label: string;
  count: number;
  hits: number;
  /** Mean stated confidence of the bucket, in % — null when empty. */
  announced: number | null;
  /** Observed hit rate, in % — null when empty. */
  observed: number | null;
}

const BUCKET_BOUNDS: [number, number][] = [
  [50, 59],
  [60, 69],
  [70, 79],
  [80, 89],
  [90, 99],
];

/** Groups scored predictions by stated confidence: the calibration curve. */
export function calibrationBuckets(entries: DecisionJournalEntry[]): CalibrationBucket[] {
  const scored = scoredEntries(entries);
  return BUCKET_BOUNDS.map(([min, max]) => {
    const inBucket = scored.filter((e) => e.confidence >= min && e.confidence <= max);
    const hits = inBucket.filter((e) => e.outcome === 'correct').length;
    const announced = inBucket.length
      ? inBucket.reduce((acc, e) => acc + e.confidence, 0) / inBucket.length
      : null;
    return {
      min,
      max,
      label: `${min}–${max} %`,
      count: inBucket.length,
      hits,
      announced,
      observed: inBucket.length ? (hits / inBucket.length) * 100 : null,
    };
  });
}

export type CalibrationVerdict = 'insufficient' | 'overconfident' | 'underconfident' | 'calibrated';

export interface CalibrationSummary {
  open: number;
  due: number;
  resolved: number;
  /** Scored = resolved minus void. */
  scored: number;
  hits: number;
  /** In %, null when nothing is scored. */
  hitRate: number | null;
  /** Mean stated confidence of scored predictions, in %. */
  meanConfidence: number | null;
  /** meanConfidence − hitRate, in points; positive = overconfident. */
  gap: number | null;
  brier: number | null;
  verdict: CalibrationVerdict;
}

export function calibrationSummary(entries: DecisionJournalEntry[], now: Date = new Date()): CalibrationSummary {
  const open = entries.filter((e) => e.status === 'open').length;
  const due = entries.filter((e) => isDue(e, now)).length;
  const resolved = entries.filter((e) => e.status === 'resolved').length;
  const scored = scoredEntries(entries);
  const hits = scored.filter((e) => e.outcome === 'correct').length;
  const hitRate = scored.length ? (hits / scored.length) * 100 : null;
  const meanConfidence = scored.length
    ? scored.reduce((acc, e) => acc + e.confidence, 0) / scored.length
    : null;
  const gap = hitRate !== null && meanConfidence !== null ? meanConfidence - hitRate : null;

  let verdict: CalibrationVerdict = 'insufficient';
  if (scored.length >= MIN_SAMPLE && gap !== null) {
    verdict = gap > CALIBRATION_TOLERANCE ? 'overconfident' : gap < -CALIBRATION_TOLERANCE ? 'underconfident' : 'calibrated';
  }

  return { open, due, resolved, scored: scored.length, hits, hitRate, meanConfidence, gap, brier: brierScore(entries), verdict };
}

/** Sort for display: overdue first, then open by closest review, then resolved (recent first). */
export function sortForDisplay(entries: DecisionJournalEntry[], now: Date = new Date()): DecisionJournalEntry[] {
  const rank = (e: DecisionJournalEntry) => (isDue(e, now) ? 0 : e.status === 'open' ? 1 : 2);
  return [...entries].sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    if (a.status === 'resolved' && b.status === 'resolved') {
      return new Date(b.resolvedAt ?? b.reviewAt).getTime() - new Date(a.resolvedAt ?? a.reviewAt).getTime();
    }
    return new Date(a.reviewAt).getTime() - new Date(b.reviewAt).getTime();
  });
}

export const OUTCOME_LABEL: Record<DecisionOutcome, string> = {
  correct: 'S’est réalisée',
  incorrect: 'Ne s’est pas réalisée',
  void: 'Invérifiable',
};
