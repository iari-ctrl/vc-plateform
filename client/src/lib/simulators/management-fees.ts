export function calculateManagementFees(fundSize: number, feeRate: number, teamSize: number, avgSalary: number) {
  const stepDownRate = Math.max(1.0, feeRate - 0.5);
  
  const annualBudgetInv = fundSize * (feeRate / 100);
  const annualBudgetHarvest = fundSize * (stepDownRate / 100);
  
  const totalFees = (annualBudgetInv * 5) + (annualBudgetHarvest * 5);
  
  const salaryCostM = (teamSize * avgSalary) / 1000;
  
  const remainingBudgetInv = annualBudgetInv - salaryCostM;
  const remainingBudgetHarvest = annualBudgetHarvest - salaryCostM;
  
  const salaryPctInv = annualBudgetInv > 0 ? (salaryCostM / annualBudgetInv) * 100 : 0;
  const salaryPctHarvest = annualBudgetHarvest > 0 ? (salaryCostM / annualBudgetHarvest) * 100 : 0;
  
  return {
    annualBudgetInv,
    annualBudgetHarvest,
    totalFees,
    salaryCostM,
    remainingBudgetInv,
    remainingBudgetHarvest,
    salaryPctInv,
    salaryPctHarvest,
    stepDownRate
  };
}
