export interface FundraisingScenarioInput {
  monthlyBurnK: number;
  runwayMonths: number;
  currentCashK: number;
  targetDilutionPct: number;
}

export interface FundraisingScenarioResult extends FundraisingScenarioInput {
  neededM: number;
  bufferedM: number;
  postLowM: number | null;
  postHighM: number | null;
  preLowM: number | null;
}

const nonNegativeFinite = (value: number): number => (
  Number.isFinite(value) && value > 0 ? value : 0
);

export function calculateFundraisingScenario(input: FundraisingScenarioInput): FundraisingScenarioResult {
  const monthlyBurnK = nonNegativeFinite(input.monthlyBurnK);
  const runwayMonths = nonNegativeFinite(input.runwayMonths);
  const currentCashK = nonNegativeFinite(input.currentCashK);
  const targetDilutionPct = Math.min(100, nonNegativeFinite(input.targetDilutionPct));
  const neededM = Math.max(monthlyBurnK * runwayMonths - currentCashK, 0) / 1000;
  const bufferedM = neededM * 1.25;
  const dilutionRatio = targetDilutionPct / 100;
  const postLowM = dilutionRatio > 0 && neededM > 0 ? neededM / dilutionRatio : null;
  const postHighM = dilutionRatio > 0 && neededM > 0 ? bufferedM / dilutionRatio : null;
  const preLowM = postLowM === null ? null : Math.max(postLowM - neededM, 0);

  return {
    monthlyBurnK,
    runwayMonths,
    currentCashK,
    targetDilutionPct,
    neededM,
    bufferedM,
    postLowM,
    postHighM,
    preLowM,
  };
}
