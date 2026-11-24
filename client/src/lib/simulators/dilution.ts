export interface RoundInput { pre: number; raise: number; esopTarget?: number; }
export interface RoundResult { post: number; investorPct: number; esopPct: number; founderAfter: number; }

const nonNegativeFinite = (value: number): number => (
  Number.isFinite(value) && value > 0 ? value : 0
);

const percent = (value: number): number => Math.min(100, nonNegativeFinite(value));

export function exceededEsopLimit(round: RoundInput): number | null {
  const pre = nonNegativeFinite(round.pre);
  const raise = nonNegativeFinite(round.raise);
  const available = pre + raise > 0 ? (pre / (pre + raise)) * 100 : 100;
  // Allow for rounding in the division at the allocation boundary.
  return nonNegativeFinite(round.esopTarget ?? 0) > available + 1e-9 ? available : null;
}

export function calculateDilution(rounds: RoundInput[], initialFounderPct: number = 100): RoundResult[] {
  let founder = percent(initialFounderPct);
  return rounds.map((r) => {
    const pre = nonNegativeFinite(r.pre);
    const raise = nonNegativeFinite(r.raise);
    const post = pre + raise;
    const investorPct = post > 0 ? (raise / post) * 100 : 0;
    const boundedInvestorPct = percent(investorPct);
    const esopPct = percent(r.esopTarget ?? 0);
    if (exceededEsopLimit(r) !== null) {
      throw new RangeError('Le nouvel ESOP dépasse la part disponible après la levée.');
    }

    const newFounder = founder * (Math.max(0, 100 - boundedInvestorPct - esopPct) / 100);
    founder = newFounder;

    return { post, investorPct: boundedInvestorPct, esopPct, founderAfter: founder };
  });
}
