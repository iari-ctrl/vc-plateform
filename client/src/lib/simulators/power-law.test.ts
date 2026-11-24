import { describe, it, expect } from 'vitest';
import { evaluatePowerLawDraw, simulatePowerLawPortfolio, type PowerLawParams } from './power-law';

const base: PowerLawParams = {
  fundSizeM: 80,
  portfolioSize: 25,
  reservesPct: 0.4,
  ownershipPct: 0.1,
  dilutionPct: 0.4,
  failRatePct: 0.5,
  modestRatePct: 0.35,
  alpha: 2,
  maxMultiple: 300,
  runs: 2000,
  seed: 42,
};

describe('simulatePowerLawPortfolio', () => {
  it('is deterministic for a given seed', () => {
    const a = simulatePowerLawPortfolio(base);
    const b = simulatePowerLawPortfolio(base);
    expect(a.percentiles.p50).toBe(b.percentiles.p50);
    expect(a.mean).toBe(b.mean);
    expect(a.probAtLeast.x2).toBe(b.probAtLeast.x2);
  });

  it('returns zero TVPI when every line fails and no reserves', () => {
    const res = simulatePowerLawPortfolio({ ...base, failRatePct: 1, modestRatePct: 0, reservesPct: 0 });
    expect(res.percentiles.p99).toBe(0);
    expect(res.mean).toBe(0);
    expect(res.probAtLeast.x1).toBe(0);
  });

  it('returns zero on paid-in capital when every line fails, including with a reserve budget', () => {
    const res = simulatePowerLawPortfolio({ ...base, failRatePct: 1, modestRatePct: 0, reservesPct: 0.4 });
    expect(res.percentiles.p50).toBe(0);
  });

  it('keeps follow-on decisions fixed when final exits are exchanged', () => {
    const rounds = [
      { hasRound: true, milestoneMet: true, priceMultiple: 2 },
      { hasRound: true, milestoneMet: false, priceMultiple: 1 },
      { hasRound: false, milestoneMet: true, priceMultiple: 2 },
    ];
    const terms = { initialCheckM: 10, reservePoolM: 12, dilutionPct: 0.4 };
    const before = evaluatePowerLawDraw(rounds, terms, () => [0, 6, 0]);
    const after = evaluatePowerLawDraw(rounds, terms, () => [6, 0, 0]);

    expect(before.policies.allRounds.ticketsM).toEqual([6, 6, 0]);
    expect(before.policies.milestone.ticketsM).toEqual([10, 0, 0]);
    for (const policy of ['allRounds', 'milestone'] as const) {
      expect(after.policies[policy].ticketsM).toEqual(before.policies[policy].ticketsM);
      expect(after.policies[policy].tvpi).not.toBe(before.policies[policy].tvpi);
    }
    expect(before.policies.milestone.tvpi).toBeCloseTo(36 / 40);
    expect(after.policies.milestone.tvpi).toBeCloseTo(66 / 40);
    expect(before.policies.hindsight.ticketsM).toEqual([0, 10, 0]);
    expect(after.policies.hindsight.ticketsM).toEqual([10, 0, 0]);
  });

  it('excludes uncalled reserves from both proceeds and paid-in capital', () => {
    const rounds = [{ hasRound: false, milestoneMet: true, priceMultiple: 2 }];
    const terms = { initialCheckM: 48, reservePoolM: 32, dilutionPct: 0 };
    for (const exit of [0, 2]) {
      const draw = evaluatePowerLawDraw(rounds, terms, () => [exit]);
      for (const result of Object.values(draw.policies)) {
        expect(result.investedReservesM).toBe(0);
        expect(result.paidInM).toBe(48);
        expect(result.tvpi).toBe(exit);
      }
    }
  });

  it('produces identical distributions for all policies at zero reserves', () => {
    const { policies } = simulatePowerLawPortfolio({ ...base, reservesPct: 0 });
    expect(policies.milestone).toEqual(policies.allRounds);
    expect(policies.hindsight).toEqual(policies.allRounds);
  });

  it('preserves the requested exit mix and keeps live allocations independent of exit assumptions', () => {
    const mixed = simulatePowerLawPortfolio(base);
    const failed = simulatePowerLawPortfolio({ ...base, failRatePct: 1, modestRatePct: 0 });
    for (const policy of ['allRounds', 'milestone'] as const) {
      expect(mixed.policies[policy].meanInvestedReservesM).toBe(failed.policies[policy].meanInvestedReservesM);
    }
    const [failures, belowOne, belowThree] = mixed.multipleHistogram;
    expect(Math.abs(failures.share - 0.5)).toBeLessThan(0.01);
    expect(Math.abs(belowOne.share + belowThree.share - 0.35)).toBeLessThan(0.01);
  });

  it('has monotonically decreasing exceedance probabilities', () => {
    const res = simulatePowerLawPortfolio(base);
    expect(res.probAtLeast.x1).toBeGreaterThanOrEqual(res.probAtLeast.x2);
    expect(res.probAtLeast.x2).toBeGreaterThanOrEqual(res.probAtLeast.x3);
    expect(res.probAtLeast.x3).toBeGreaterThanOrEqual(res.probAtLeast.x5);
  });

  it('produces a fatter tail with lower alpha', () => {
    const fat = simulatePowerLawPortfolio({ ...base, alpha: 1.5 });
    const thin = simulatePowerLawPortfolio({ ...base, alpha: 3.5 });
    expect(fat.percentiles.p99).toBeGreaterThan(thin.percentiles.p99);
  });

  it('respects the multiple cap', () => {
    const res = simulatePowerLawPortfolio({ ...base, maxMultiple: 10 });
    const above30 = res.multipleHistogram.find((b) => b.label === '≥ 30×');
    expect(above30?.share).toBe(0);
  });

  it('computes deterministic portfolio math', () => {
    const res = simulatePowerLawPortfolio(base);
    // check initial = 80 × (1 − 0,4) / 25
    expect(res.initialCheckM).toBeCloseTo(1.92, 10);
    // post-money implicite = check / ownership
    expect(res.impliedPostMoneyM).toBeCloseTo(19.2, 10);
    // ownership à l'exit = 10% × (1 − 40%)
    expect(res.ownershipAtExitPct).toBeCloseTo(0.06, 10);
    // exit "fund returner" = 80 / 6%
    expect(res.fundReturnerExitM).toBeCloseTo(1333.333, 2);
  });

  it('produces histograms whose shares sum to 1', () => {
    const res = simulatePowerLawPortfolio(base);
    const sumTvpi = res.tvpiHistogram.reduce((s, b) => s + b.share, 0);
    const sumMult = res.multipleHistogram.reduce((s, b) => s + b.share, 0);
    expect(sumTvpi).toBeCloseTo(1, 10);
    expect(sumMult).toBeCloseTo(1, 10);
  });

  it('keeps concentration shares within [0, 1] and top3 ≥ top1', () => {
    const res = simulatePowerLawPortfolio(base);
    expect(res.medianTopLineShare).toBeGreaterThan(0);
    expect(res.medianTopLineShare).toBeLessThanOrEqual(1);
    expect(res.medianTop3Share).toBeGreaterThanOrEqual(res.medianTopLineShare);
  });

  it('clamps modest rate so probabilities never exceed 1', () => {
    const res = simulatePowerLawPortfolio({ ...base, failRatePct: 0.8, modestRatePct: 0.5 });
    // queue = 0 : aucune ligne ≥ 3× hors arrondi de bucket
    const tail = res.multipleHistogram.filter((b) => ['3–10×', '10–30×', '≥ 30×'].includes(b.label));
    expect(tail.reduce((s, b) => s + b.share, 0)).toBe(0);
  });

  it('improves outcomes with higher ownership retention (lower dilution)', () => {
    const diluted = simulatePowerLawPortfolio({ ...base, dilutionPct: 0.6 });
    const defended = simulatePowerLawPortfolio({ ...base, dilutionPct: 0.1 });
    expect(defended.percentiles.p50).toBeGreaterThan(diluted.percentiles.p50);
    expect(defended.fundReturnerExitM).toBeLessThan(diluted.fundReturnerExitM);
  });
});
