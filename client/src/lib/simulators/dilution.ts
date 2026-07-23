export interface RoundInput { pre: number; raise: number; esopTarget?: number; }
export interface RoundResult { post: number; investorPct: number; esopPct: number; founderAfter: number; }

const nonNegativeFinite = (value: number): number => (
  Number.isFinite(value) && value > 0 ? value : 0
);

const percent = (value: number): number => Math.min(100, nonNegativeFinite(value));

export function calculateDilution(rounds: RoundInput[], initialFounderPct: number = 100): RoundResult[] {
  let founder = percent(initialFounderPct);
  return rounds.map((r) => {
    const pre = nonNegativeFinite(r.pre);
    const raise = nonNegativeFinite(r.raise);
    const post = pre + raise;
    const investorPct = post > 0 ? (raise / post) * 100 : 0;
    const boundedInvestorPct = percent(investorPct);
    const esopPct = percent(r.esopTarget ?? 0);

    const newFounder = founder * (Math.max(0, 100 - boundedInvestorPct - esopPct) / 100);
    founder = newFounder;

    return { post, investorPct: boundedInvestorPct, esopPct, founderAfter: founder };
  });
}
