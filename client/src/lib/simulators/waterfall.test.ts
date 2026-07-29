import { describe, it, expect } from 'vitest';
import { calculateWaterfall } from './waterfall';

describe('calculateWaterfall', () => {
  it('calculates non-participating below preference', () => {
    const res = calculateWaterfall(5, 1, 20, 3, false);
    expect(res.investor).toBe(3);
    expect(res.common).toBe(0);
    expect(res.choseConvert).toBe(false);
  });

  it('calculates non-participating taking preference', () => {
    const res = calculateWaterfall(5, 1, 20, 10, false);
    expect(res.investor).toBe(5);
    expect(res.common).toBe(5);
    expect(res.choseConvert).toBe(false);
  });

  it('calculates non-participating converting', () => {
    const res = calculateWaterfall(5, 1, 20, 50, false);
    expect(res.investor).toBe(10);
    expect(res.common).toBe(40);
    expect(res.choseConvert).toBe(true);
  });

  it('calculates participating', () => {
    const res = calculateWaterfall(5, 1, 20, 50, true);
    expect(res.investor).toBe(14);
    expect(res.common).toBe(36);
    expect(res.choseConvert).toBe(false);
  });

  it('lets investor-held common shares share the residual once the preference is taken', () => {
    // 9 de préférence, 24,3902 % en converti dont 3,125 % des ordinaires acquis hors préférence.
    const res = calculateWaterfall(9, 1, 24.390243902439025, 30, false, 3.125);
    expect(res.investor).toBeCloseTo(9.65625, 10);
    expect(res.common).toBeCloseTo(20.34375, 10);
    expect(res.choseConvert).toBe(false);
  });

  it('ignores common shares once conversion wins', () => {
    const res = calculateWaterfall(9, 1, 24.390243902439025, 120, false, 3.125);
    expect(res.investor).toBeCloseTo(29.268292682926827, 10);
    expect(res.choseConvert).toBe(true);
  });

  it('defaults to the preference-only behaviour when no common shares are held', () => {
    const withDefault = calculateWaterfall(9, 1, 24.390243902439025, 30, false);
    const withZero = calculateWaterfall(9, 1, 24.390243902439025, 30, false, 0);
    expect(withDefault.investor).toBe(9);
    expect(withDefault).toEqual(withZero);
  });
});
