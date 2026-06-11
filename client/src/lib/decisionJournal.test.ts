import { describe, it, expect } from 'vitest';
import {
  brierScore,
  calibrationBuckets,
  calibrationSummary,
  isDue,
  sortForDisplay,
} from './decisionJournal';
import type { DecisionJournalEntry, DecisionOutcome } from '@/content/types';

const NOW = new Date('2026-06-12T12:00:00Z');

let seq = 0;
function entry(partial: Partial<DecisionJournalEntry>): DecisionJournalEntry {
  return {
    id: `e${++seq}`,
    statement: 'La startup X lèvera une série A d’ici 12 mois.',
    confidence: 70,
    category: 'deal',
    createdAt: '2026-01-01T00:00:00Z',
    reviewAt: '2026-12-01T00:00:00Z',
    status: 'open',
    links: [],
    ...partial,
  };
}

function resolved(confidence: number, outcome: DecisionOutcome): DecisionJournalEntry {
  return entry({ confidence, status: 'resolved', outcome, resolvedAt: '2026-06-01T00:00:00Z' });
}

describe('isDue', () => {
  it('is due once the review date has passed', () => {
    expect(isDue(entry({ reviewAt: '2026-06-01T00:00:00Z' }), NOW)).toBe(true);
    expect(isDue(entry({ reviewAt: '2026-07-01T00:00:00Z' }), NOW)).toBe(false);
  });

  it('resolved entries are never due', () => {
    expect(isDue(resolved(70, 'correct'), NOW)).toBe(false);
  });
});

describe('brierScore', () => {
  it('returns null without scored predictions', () => {
    expect(brierScore([])).toBeNull();
    expect(brierScore([entry({}), resolved(70, 'void')])).toBeNull();
  });

  it('scores 0 for a perfect oracle and (p − o)² otherwise', () => {
    expect(brierScore([resolved(99, 'correct')])).toBeCloseTo(0.01 ** 2, 6);
    // 80 % announced, miss → (0.8 − 0)² = 0.64 ; hit → (0.8 − 1)² = 0.04
    expect(brierScore([resolved(80, 'incorrect')])).toBeCloseTo(0.64, 6);
    expect(brierScore([resolved(80, 'correct'), resolved(80, 'incorrect')])).toBeCloseTo((0.04 + 0.64) / 2, 6);
  });

  it('excludes void outcomes from the mean', () => {
    expect(brierScore([resolved(80, 'correct'), resolved(50, 'void')])).toBeCloseTo(0.04, 6);
  });
});

describe('calibrationBuckets', () => {
  it('groups scored predictions by stated confidence', () => {
    const entries = [
      resolved(55, 'correct'),
      resolved(58, 'incorrect'),
      resolved(90, 'correct'),
      resolved(95, 'correct'),
      resolved(99, 'incorrect'),
      entry({}), // open — ignored
    ];
    const buckets = calibrationBuckets(entries);
    expect(buckets).toHaveLength(5);

    const low = buckets[0]; // 50–59
    expect(low.count).toBe(2);
    expect(low.hits).toBe(1);
    expect(low.observed).toBeCloseTo(50);
    expect(low.announced).toBeCloseTo(56.5);

    const high = buckets[4]; // 90–99
    expect(high.count).toBe(3);
    expect(high.observed).toBeCloseTo((2 / 3) * 100, 4);

    expect(buckets[1].count + buckets[2].count + buckets[3].count).toBe(0);
    expect(buckets[1].observed).toBeNull();
  });
});

describe('calibrationSummary', () => {
  it('counts open / due / resolved and ignores void in scoring', () => {
    const entries = [
      entry({ reviewAt: '2026-01-01T00:00:00Z' }), // due
      entry({ reviewAt: '2027-01-01T00:00:00Z' }), // open, not due
      resolved(80, 'correct'),
      resolved(60, 'incorrect'),
      resolved(70, 'void'),
    ];
    const s = calibrationSummary(entries, NOW);
    expect(s.open).toBe(2);
    expect(s.due).toBe(1);
    expect(s.resolved).toBe(3);
    expect(s.scored).toBe(2);
    expect(s.hits).toBe(1);
    expect(s.hitRate).toBeCloseTo(50);
    expect(s.meanConfidence).toBeCloseTo(70);
    expect(s.gap).toBeCloseTo(20);
    expect(s.verdict).toBe('insufficient'); // < 10 scored
  });

  it('declares overconfidence past the tolerance once the sample is sufficient', () => {
    // 10 predictions at 90 % announced, 5 hits → observed 50 %, gap +40.
    const entries = Array.from({ length: 10 }, (_, i) => resolved(90, i < 5 ? 'correct' : 'incorrect'));
    expect(calibrationSummary(entries, NOW).verdict).toBe('overconfident');
  });

  it('declares calibration when announced ≈ observed', () => {
    // 10 predictions at 70 % announced, 7 hits → gap 0.
    const entries = Array.from({ length: 10 }, (_, i) => resolved(70, i < 7 ? 'correct' : 'incorrect'));
    expect(calibrationSummary(entries, NOW).verdict).toBe('calibrated');
  });

  it('declares underconfidence when reality beats the announcements', () => {
    // 10 predictions at 55 % announced, 9 hits → gap −35.
    const entries = Array.from({ length: 10 }, (_, i) => resolved(55, i < 9 ? 'correct' : 'incorrect'));
    expect(calibrationSummary(entries, NOW).verdict).toBe('underconfident');
  });
});

describe('sortForDisplay', () => {
  it('puts overdue first, then open by closest review, then resolved by recency', () => {
    const overdue = entry({ id: 'overdue', reviewAt: '2026-05-01T00:00:00Z' });
    const openSoon = entry({ id: 'open-soon', reviewAt: '2026-08-01T00:00:00Z' });
    const openLater = entry({ id: 'open-later', reviewAt: '2027-01-01T00:00:00Z' });
    const oldResolved = entry({ id: 'old-resolved', status: 'resolved', outcome: 'correct', resolvedAt: '2026-02-01T00:00:00Z' });
    const newResolved = entry({ id: 'new-resolved', status: 'resolved', outcome: 'incorrect', resolvedAt: '2026-06-01T00:00:00Z' });

    const sorted = sortForDisplay([openLater, newResolved, overdue, oldResolved, openSoon], NOW);
    expect(sorted.map((e) => e.id)).toEqual(['overdue', 'open-soon', 'open-later', 'new-resolved', 'old-resolved']);
  });
});
