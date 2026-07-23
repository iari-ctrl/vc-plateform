import { describe, expect, it } from 'vitest';

import { calculateDilution } from './dilution';
import { calculateFundraisingScenario } from './fundraising-scenario';
import { calculateOwnership } from './ownership';
import { calculatePrePostMoney } from './pre-post-money';

describe('simulateurs C4 — calculateurs purs', () => {
  it('borne aussi le calcul de dilution existant', () => {
    expect(calculateDilution([
      { pre: -6, raise: Number.POSITIVE_INFINITY, esopTarget: Number.NaN },
      { pre: 10, raise: 5, esopTarget: 110 },
    ])).toEqual([
      { post: 0, investorPct: 0, esopPct: 0, founderAfter: 100 },
      { post: 15, investorPct: 33.33333333333333, esopPct: 100, founderAfter: 0 },
    ]);
  });

  it('calcule pre/post-money sans produire de valeur négative ou non finie', () => {
    expect(calculatePrePostMoney({ preMoney: 8, raise: 2 })).toEqual({
      preMoney: 8,
      raise: 2,
      postMoney: 10,
      investorPct: 20,
      retainedPct: 80,
      impliedMultiple: 1.25,
    });

    expect(calculatePrePostMoney({ preMoney: -4, raise: Number.POSITIVE_INFINITY })).toEqual({
      preMoney: 0,
      raise: 0,
      postMoney: 0,
      investorPct: 0,
      retainedPct: 100,
      impliedMultiple: 0,
    });

    expect(calculatePrePostMoney({ preMoney: 0, raise: 2.5 }).investorPct).toBe(100);
  });

  it('calcule une cap table en conservant des totaux cohérents avec valeurs limites', () => {
    const result = calculateOwnership({
      valuation: 40.5,
      holders: [
        { name: 'Fondateurs', shares: 6000.5 },
        { name: 'Investisseur', shares: 1999.5 },
        { name: 'Dette invalide', shares: -200 },
        { name: 'Non fini', shares: Number.NaN },
      ],
    });

    expect(result.valuation).toBe(40.5);
    expect(result.totalShares).toBe(8000);
    expect(result.rows.map((row) => row.shares)).toEqual([6000.5, 1999.5, 0, 0]);
    expect(result.rows.reduce((sum, row) => sum + row.ownershipPct, 0)).toBeCloseTo(100, 6);
    expect(result.rows.reduce((sum, row) => sum + row.value, 0)).toBeCloseTo(40_500_000, 2);

    expect(calculateOwnership({
      valuation: Number.POSITIVE_INFINITY,
      holders: [{ name: 'Zéro', shares: 0 }],
    })).toMatchObject({ valuation: 0, totalShares: 0, rows: [{ ownershipPct: 0, value: 0 }] });
  });

  it('calcule le scénario de levée avec marge sans division par zéro', () => {
    const scenario = calculateFundraisingScenario({
      monthlyBurnK: 120,
      runwayMonths: 18,
      currentCashK: 200,
      targetDilutionPct: 18,
    });

    expect(scenario).toMatchObject({
      monthlyBurnK: 120,
      runwayMonths: 18,
      currentCashK: 200,
      targetDilutionPct: 18,
      neededM: 1.96,
      bufferedM: 2.45,
    });
    expect(scenario.postLowM).toBeCloseTo(10.88888888888889, 12);
    expect(scenario.postHighM).toBeCloseTo(13.61111111111111, 12);
    expect(scenario.preLowM).toBeCloseTo(8.92888888888889, 12);

    expect(calculateFundraisingScenario({
      monthlyBurnK: -10,
      runwayMonths: Number.NaN,
      currentCashK: Number.POSITIVE_INFINITY,
      targetDilutionPct: 0,
    })).toEqual({
      monthlyBurnK: 0,
      runwayMonths: 0,
      currentCashK: 0,
      targetDilutionPct: 0,
      neededM: 0,
      bufferedM: 0,
      postLowM: 0,
      postHighM: 0,
      preLowM: 0,
    });
  });
});
