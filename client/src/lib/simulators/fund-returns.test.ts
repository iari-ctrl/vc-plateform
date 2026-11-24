import { describe, it, expect } from 'vitest';
import { calculateFundReturns } from './fund-returns';

describe('calculateFundReturns', () => {
  it('calculates correctly', () => {
    const res = calculateFundReturns(100, 60, 180);
    expect(res.dpi).toBe(0.6);
    expect(res.rvpi).toBe(1.8);
    expect(res.tvpi).toBe(2.4);
  });

  it('handles zero paid-in', () => {
    const res = calculateFundReturns(0, 0, 0);
    expect(res).toEqual({ dpi: null, rvpi: null, tvpi: null });
  });
});
