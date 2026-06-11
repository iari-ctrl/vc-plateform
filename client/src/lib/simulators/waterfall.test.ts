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
});
