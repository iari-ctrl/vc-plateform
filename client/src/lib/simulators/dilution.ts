export interface RoundInput { pre: number; raise: number; esopTarget?: number; }
export interface RoundResult { post: number; investorPct: number; esopPct: number; founderAfter: number; }

export function calculateDilution(rounds: RoundInput[], initialFounderPct: number = 100): RoundResult[] {
  let founder = initialFounderPct;
  return rounds.map(r => {
    const post = r.pre + r.raise;
    const investorPct = post > 0 ? (r.raise / post) * 100 : 0;
    const esopPct = r.esopTarget || 0;
    
    const newFounder = founder * (Math.max(0, 100 - investorPct - esopPct) / 100);
    founder = newFounder;
    
    return { post, investorPct, esopPct, founderAfter: founder };
  });
}
