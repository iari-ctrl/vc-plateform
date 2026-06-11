import { describe, it, expect } from 'vitest';
import { calculateManagementFees } from './management-fees';

describe('calculateManagementFees', () => {
  it('calculates step-down logic correctly', () => {
    // 100M fund, 2% fees, 5 people at 120k = 600k (0.6M) salaries
    const res = calculateManagementFees(100, 2.0, 5, 120);
    
    // Inv period: 2M budget, 0.6M salaries -> 30% of budget
    expect(res.annualBudgetInv).toBe(2.0);
    expect(res.salaryCostM).toBe(0.6);
    expect(res.salaryPctInv).toBe(30);
    expect(res.remainingBudgetInv).toBe(1.4);
    
    // Harvest period: 1.5% fees (stepdown) -> 1.5M budget, 0.6M salaries -> 40% of budget
    expect(res.stepDownRate).toBe(1.5);
    expect(res.annualBudgetHarvest).toBe(1.5);
    expect(res.salaryPctHarvest).toBe(40);
    expect(res.remainingBudgetHarvest).toBe(0.9);
    
    // Total fees over 10 years: (2 * 5) + (1.5 * 5) = 10 + 7.5 = 17.5M
    expect(res.totalFees).toBe(17.5);
  });
});
