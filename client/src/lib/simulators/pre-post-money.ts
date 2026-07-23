export interface PrePostMoneyInput {
  preMoney: number;
  raise: number;
}

export interface PrePostMoneyResult {
  preMoney: number;
  raise: number;
  postMoney: number;
  investorPct: number;
  retainedPct: number;
  impliedMultiple: number;
}

const nonNegativeFinite = (value: number): number => (
  Number.isFinite(value) && value > 0 ? value : 0
);

export function calculatePrePostMoney(input: PrePostMoneyInput): PrePostMoneyResult {
  const preMoney = nonNegativeFinite(input.preMoney);
  const raise = nonNegativeFinite(input.raise);
  const postMoney = preMoney + raise;
  const investorPct = postMoney > 0 ? (raise / postMoney) * 100 : 0;
  const retainedPct = Math.max(0, 100 - investorPct);
  const impliedMultiple = preMoney > 0 ? postMoney / preMoney : 0;

  return {
    preMoney,
    raise,
    postMoney,
    investorPct,
    retainedPct,
    impliedMultiple,
  };
}
