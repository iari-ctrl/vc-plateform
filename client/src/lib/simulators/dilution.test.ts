import { describe, it, expect } from 'vitest';
import { calculateDilution } from './dilution';

describe('calculateDilution', () => {
  it('calculates single round dilution correctly without ESOP', () => {
    const results = calculateDilution([{ pre: 8, raise: 2 }]);
    expect(results[0].post).toBe(10);
    expect(results[0].investorPct).toBe(20);
    expect(results[0].esopPct).toBe(0);
    expect(results[0].founderAfter).toBe(80);
  });

  it('calculates dilution with ESOP pool shuffle', () => {
    const results = calculateDilution([{ pre: 8, raise: 2, esopTarget: 10 }]);
    expect(results[0].post).toBe(10);
    expect(results[0].investorPct).toBe(20);
    expect(results[0].esopPct).toBe(10);
    // 100% - 20% (investor) - 10% (esop) = 70%
    expect(results[0].founderAfter).toBe(70);
  });

  it('calculates multiple rounds with and without ESOP', () => {
    const results = calculateDilution([
      { pre: 4, raise: 1, esopTarget: 10 }, // post=5, inv=20%, esop=10%, fnd=70%
      { pre: 16, raise: 4, esopTarget: 5 }  // post=20, inv=20%, esop=5%, fnd=70% * (100 - 25)% = 70 * 0.75 = 52.5%
    ]);
    expect(results[0].founderAfter).toBe(70);
    expect(results[1].investorPct).toBe(20);
    expect(results[1].esopPct).toBe(5);
    expect(results[1].founderAfter).toBe(52.5);
  });
});
