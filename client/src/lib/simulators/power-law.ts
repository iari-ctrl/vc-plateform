export interface PowerLawParams {
  /** Taille du fonds en M€ (capital investissable, hors frais). */
  fundSizeM: number;
  /** Nombre d'investissements initiaux (lignes). */
  portfolioSize: number;
  /** Part du fonds réservée aux follow-ons, 0..1. */
  reservesPct: number;
  /** Ownership initial moyen à l'entrée, 0..1. */
  ownershipPct: number;
  /** Dilution totale subie jusqu'à l'exit sans défense pro-rata, 0..1. */
  dilutionPct: number;
  /** Part des lignes qui retournent 0×, 0..1. */
  failRatePct: number;
  /** Part des lignes en sortie modeste (0,3×–3×), 0..1. Le reste = queue power law. */
  modestRatePct: number;
  /** Exposant de la queue Pareto. Plus alpha est bas, plus la queue est grasse. */
  alpha: number;
  /** Multiple société maximum (plafond de réalisme : taille de marché). */
  maxMultiple: number;
  /** Nombre de tirages Monte Carlo. */
  runs?: number;
  /** Graine du générateur — résultats déterministes à paramètres égaux. */
  seed?: number;
}

export interface HistogramBucket {
  label: string;
  share: number; // 0..1
}

export type FollowOnPolicy = 'allRounds' | 'milestone' | 'hindsight';

export interface PolicySummary {
  meanInvestedReservesM: number;
  percentiles: { p5: number; p10: number; p25: number; p50: number; p75: number; p90: number; p99: number };
  mean: number;
  probAtLeast: { x1: number; x2: number; x3: number; x5: number };
  /** Médiane (sur les runs) de la part du retour total apportée par la meilleure ligne. */
  medianTopLineShare: number;
  /** Médiane de la part du retour total apportée par les 3 meilleures lignes. */
  medianTop3Share: number;
  tvpiHistogram: HistogramBucket[];
}

export interface PowerLawResult extends PolicySummary {
  policies: Record<FollowOnPolicy, PolicySummary>;
  multipleHistogram: HistogramBucket[];
  initialCheckM: number;
  impliedPostMoneyM: number;
  ownershipAtExitPct: number;
  /** Valeur d'exit (M€) qu'une seule société doit atteindre pour rendre 1× le fonds. */
  fundReturnerExitM: number;
}

/** PRNG déterministe (mulberry32) — suffisant pour un simulateur pédagogique. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PARETO_XMIN = 3; // la queue power law démarre au-dessus des sorties modestes (3×)

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

const TVPI_BUCKETS: { label: string; max: number }[] = [
  { label: '< 0,5×', max: 0.5 },
  { label: '0,5–1×', max: 1 },
  { label: '1–1,5×', max: 1.5 },
  { label: '1,5–2×', max: 2 },
  { label: '2–3×', max: 3 },
  { label: '3–5×', max: 5 },
  { label: '≥ 5×', max: Infinity },
];

const MULTIPLE_BUCKETS: { label: string; max: number }[] = [
  { label: '0×', max: 0.001 },
  { label: '0–1×', max: 1 },
  { label: '1–3×', max: 3 },
  { label: '3–10×', max: 10 },
  { label: '10–30×', max: 30 },
  { label: '≥ 30×', max: Infinity },
];

function bucketize(values: number[], buckets: { label: string; max: number }[]): HistogramBucket[] {
  const counts = buckets.map(() => 0);
  for (const v of values) {
    const i = buckets.findIndex((b) => v < b.max);
    counts[i === -1 ? buckets.length - 1 : i] += 1;
  }
  const total = values.length || 1;
  return buckets.map((b, i) => ({ label: b.label, share: counts[i] / total }));
}

interface FollowOnRound {
  hasRound: boolean;
  milestoneMet: boolean;
  /** Post-money du tour, en multiple de la post-money initiale. */
  priceMultiple: number;
}

interface PortfolioTerms {
  initialCheckM: number;
  reservePoolM: number;
  dilutionPct: number;
}

export function evaluatePowerLawDraw(
  rounds: FollowOnRound[],
  terms: PortfolioTerms,
  drawExits: () => number[],
) {
  const { initialCheckM, reservePoolM, dilutionPct } = terms;
  function allocate(eligible: boolean[]) {
    const count = eligible.filter(Boolean).length;
    const ticket = count > 0 ? Math.min(initialCheckM, reservePoolM / count) : 0;
    return eligible.map((canInvest) => canInvest ? ticket : 0);
  }

  const allRounds = allocate(rounds.map((round) => round.hasRound));
  const milestone = allocate(rounds.map((round) => round.hasRound && round.milestoneMet));
  const exits = drawExits();
  const hindsight = allocate(rounds.map((round, i) => round.hasRound && exits[i] >= PARETO_XMIN));

  function settle(ticketsM: number[]) {
    const investedReservesM = ticketsM.reduce((sum, ticket) => sum + ticket, 0);
    const paidInM = initialCheckM * rounds.length + investedReservesM;
    const proceeds = exits.map((multiple, i) => {
      const initialProceeds = initialCheckM * (1 - dilutionPct) * multiple;
      // Part achetée × prix de sortie. Les deux valorisations ont la même base d'entrée.
      const followOnProceeds = ticketsM[i] * multiple / rounds[i].priceMultiple;
      return initialProceeds + followOnProceeds;
    });
    const total = proceeds.reduce((sum, amount) => sum + amount, 0);
    const sorted = proceeds.sort((a, b) => b - a);
    return {
      ticketsM, investedReservesM, paidInM,
      tvpi: paidInM > 0 ? total / paidInM : 0,
      topShare: total > 0 ? sorted[0] / total : 0,
      top3Share: total > 0 ? ((sorted[0] ?? 0) + (sorted[1] ?? 0) + (sorted[2] ?? 0)) / total : 0,
    };
  }
  return { exits, policies: { allRounds: settle(allRounds), milestone: settle(milestone), hindsight: settle(hindsight) } };
}

interface PolicySamples {
  tvpis: number[];
  topShares: number[];
  top3Shares: number[];
  investedReservesM: number;
}

function summarize({ tvpis, topShares, top3Shares, investedReservesM }: PolicySamples): PolicySummary {
  tvpis.sort((a, b) => a - b);
  topShares.sort((a, b) => a - b);
  top3Shares.sort((a, b) => a - b);
  const probAtLeast = (threshold: number) => tvpis.filter((tvpi) => tvpi >= threshold).length / tvpis.length;

  return {
    percentiles: {
      p5: percentile(tvpis, 0.05), p10: percentile(tvpis, 0.1), p25: percentile(tvpis, 0.25),
      p50: percentile(tvpis, 0.5), p75: percentile(tvpis, 0.75), p90: percentile(tvpis, 0.9), p99: percentile(tvpis, 0.99),
    },
    mean: tvpis.reduce((sum, value) => sum + value, 0) / tvpis.length,
    probAtLeast: { x1: probAtLeast(1), x2: probAtLeast(2), x3: probAtLeast(3), x5: probAtLeast(5) },
    medianTopLineShare: percentile(topShares, 0.5),
    medianTop3Share: percentile(top3Shares, 0.5),
    tvpiHistogram: bucketize(tvpis, TVPI_BUCKETS),
    meanInvestedReservesM: investedReservesM / tvpis.length,
  };
}

export function simulatePowerLawPortfolio(params: PowerLawParams): PowerLawResult {
  const {
    fundSizeM, portfolioSize, reservesPct, ownershipPct, dilutionPct, alpha, maxMultiple,
    runs = 4000, seed = 42,
  } = params;
  const n = Math.max(1, Math.round(portfolioSize));
  const failRate = Math.min(Math.max(params.failRatePct, 0), 1);
  const modestRate = Math.min(Math.max(params.modestRatePct, 0), 1 - failRate);
  const reservePoolM = fundSizeM * reservesPct;
  const initialCheckM = (fundSizeM - reservePoolM) / n;
  const rng = mulberry32(seed);
  const allMultiples: number[] = [];
  const newSamples = (): PolicySamples => ({ tvpis: [], topShares: [], top3Shares: [], investedReservesM: 0 });
  const samples = { allRounds: newSamples(), milestone: newSamples(), hindsight: newSamples() };
  const policyKeys = ['allRounds', 'milestone', 'hindsight'] as const;

  function drawExit({ milestoneMet }: FollowOnRound) {
    const a = rng();
    const b = rng();
    // À 50 % de jalons atteints, le mélange équiprobable de min et max est uniforme.
    const rank = milestoneMet ? Math.max(a, b) : Math.min(a, b);
    const u = rng();
    if (rank < failRate) return 0;
    if (rank < failRate + modestRate) return 0.3 + u * (3 - 0.3);
    return Math.min(PARETO_XMIN * Math.pow(1 - u, -1 / alpha), maxMultiple);
  }

  for (let r = 0; r < runs; r++) {
    const rounds = Array.from({ length: n }, () => {
      const milestoneMet = rng() < 0.5;
      return { hasRound: rng() < 0.6, milestoneMet, priceMultiple: milestoneMet ? 2 : 1 };
    });
    const draw = evaluatePowerLawDraw(rounds, { initialCheckM, reservePoolM, dilutionPct }, () => rounds.map(drawExit));
    allMultiples.push(...draw.exits);
    for (const policy of policyKeys) {
      const result = draw.policies[policy];
      const sample = samples[policy];
      sample.tvpis.push(result.tvpi);
      sample.topShares.push(result.topShare);
      sample.top3Shares.push(result.top3Share);
      sample.investedReservesM += result.investedReservesM;
    }
  }

  const policies = {
    allRounds: summarize(samples.allRounds),
    milestone: summarize(samples.milestone),
    hindsight: summarize(samples.hindsight),
  };
  const ownershipAtExit = ownershipPct * (1 - dilutionPct);
  return {
    ...policies.allRounds,
    policies,
    multipleHistogram: bucketize(allMultiples, MULTIPLE_BUCKETS),
    initialCheckM,
    impliedPostMoneyM: ownershipPct > 0 ? initialCheckM / ownershipPct : 0,
    ownershipAtExitPct: ownershipAtExit,
    fundReturnerExitM: ownershipAtExit > 0 ? fundSizeM / ownershipAtExit : 0,
  };
}
