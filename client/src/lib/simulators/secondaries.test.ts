import { describe, it, expect } from 'vitest';
import { calculateSecondarySale, calculateContinuationFund } from './secondaries';

describe('calculateSecondarySale', () => {
  const base = {
    paidInM: 100,
    distributedM: 40,
    navM: 120,
    soldPct: 0.5,
    discountPct: 0.2,
    yearsToLiquidity: 4,
    exitMultiple: 1.6,
    discountRate: 0.12,
  };

  it('calculates proceeds and haircut', () => {
    const res = calculateSecondarySale(base);
    expect(res.navSoldM).toBe(60);
    expect(res.proceedsM).toBeCloseTo(48);
    expect(res.haircutM).toBeCloseTo(12);
  });

  it('boosts DPI but lowers TVPI at marks', () => {
    const res = calculateSecondarySale(base);
    expect(res.dpiBefore).toBeCloseTo(0.4);
    expect(res.dpiAfter).toBeCloseTo(0.88);
    expect(res.tvpiBefore).toBeCloseTo(1.6);
    expect(res.tvpiAfter).toBeCloseTo(1.48); // − haircut / paid-in
    expect(res.rvpiAfter).toBeCloseTo(0.6);
  });

  it('computes the break-even multiple: (1 − d) × (1 + r)^n', () => {
    const res = calculateSecondarySale(base);
    expect(res.breakEvenMultiple).toBeCloseTo(0.8 * Math.pow(1.12, 4), 6);
  });

  it('hold wins when expected exit multiple exceeds break-even', () => {
    const res = calculateSecondarySale(base);
    expect(res.pvHoldM).toBeCloseTo((60 * 1.6) / Math.pow(1.12, 4), 6);
    expect(res.pvSellM).toBeCloseTo(48);
    expect(res.holdWins).toBe(true);
  });

  it('sell wins when the expected exit is below break-even', () => {
    const res = calculateSecondarySale({ ...base, exitMultiple: 1.0 });
    expect(res.holdWins).toBe(false);
  });

  it('handles zero paid-in', () => {
    const res = calculateSecondarySale({ ...base, paidInM: 0 });
    expect(res.dpiBefore).toBe(0);
    expect(res.tvpiAfter).toBe(0);
  });
});

describe('calculateContinuationFund', () => {
  const base = {
    assetNavM: 100,
    pricingPctOfNav: 0.9,
    costBasisM: 40,
    rolloverPct: 0.3,
    carryPct: 0.2,
    newFeeRate: 0.015,
    horizonYears: 5,
    exitMultiple: 1.8,
  };

  it('prices the transaction and crystallizes carry on the seller gain', () => {
    const res = calculateContinuationFund(base);
    expect(res.transactionPriceM).toBeCloseTo(90);
    expect(res.crystallizedCarryM).toBeCloseTo(10); // (90 − 40) × 20 %
    expect(res.netToOldLpsM).toBeCloseTo(80);
    expect(res.sellerRecoveryPct).toBeCloseTo(0.8);
  });

  it('splits old LPs between cash-out and rollover', () => {
    const res = calculateContinuationFund(base);
    expect(res.cashToSellersM).toBeCloseTo(56);
    expect(res.rolledM).toBeCloseTo(24);
  });

  it('computes the roller net multiple after fees and second carry', () => {
    const res = calculateContinuationFund(base);
    expect(res.exitValueM).toBeCloseTo(180);
    expect(res.cvFeesM).toBeCloseTo(6.75);
    expect(res.secondCarryM).toBeCloseTo(18); // (180 − 90) × 20 %
    // net CV = 180 − 18 − 6,75 = 155,25 ; part du roller = 24/90
    expect(res.rollerNetM).toBeCloseTo(155.25 * (24 / 90), 6);
    expect(res.rollerNetMultiple).toBeCloseTo((155.25 * (24 / 90)) / 24, 6);
  });

  it('sums GP take: both carries plus fees', () => {
    const res = calculateContinuationFund(base);
    expect(res.gpTotalTakeM).toBeCloseTo(10 + 18 + 6.75);
  });

  it('no second carry when the continuation fund exits below the entry price', () => {
    const res = calculateContinuationFund({ ...base, exitMultiple: 0.8 });
    expect(res.secondCarryM).toBe(0);
  });

  it('no crystallized carry when the transaction is below cost basis', () => {
    const res = calculateContinuationFund({ ...base, pricingPctOfNav: 0.3 });
    expect(res.crystallizedCarryM).toBe(0);
  });
});
