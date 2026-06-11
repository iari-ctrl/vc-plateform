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

export interface PowerLawResult {
  percentiles: { p5: number; p10: number; p25: number; p50: number; p75: number; p90: number; p99: number };
  mean: number;
  probAtLeast: { x1: number; x2: number; x3: number; x5: number };
  /** Médiane (sur les runs) de la part du retour total apportée par la meilleure ligne. */
  medianTopLineShare: number;
  /** Médiane de la part du retour total apportée par les 3 meilleures lignes. */
  medianTop3Share: number;
  tvpiHistogram: HistogramBucket[];
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

export function simulatePowerLawPortfolio(params: PowerLawParams): PowerLawResult {
  const {
    fundSizeM,
    portfolioSize,
    reservesPct,
    ownershipPct,
    dilutionPct,
    failRatePct,
    alpha,
    maxMultiple,
    runs = 4000,
    seed = 42,
  } = params;

  const n = Math.max(1, Math.round(portfolioSize));
  const failRate = Math.min(Math.max(failRatePct, 0), 1);
  const modestRate = Math.min(Math.max(params.modestRatePct, 0), 1 - failRate);
  const reservePoolM = fundSizeM * reservesPct;
  const initialCheckM = (fundSizeM - reservePoolM) / n;

  const rng = mulberry32(seed);
  const tvpis: number[] = [];
  const topShares: number[] = [];
  const top3Shares: number[] = [];
  const allMultiples: number[] = [];

  for (let r = 0; r < runs; r++) {
    const lineMultiples: number[] = [];
    const winners: number[] = []; // indices des lignes éligibles au follow-on (queue power law)

    for (let i = 0; i < n; i++) {
      const u = rng();
      let m: number;
      if (u < failRate) {
        m = 0;
      } else if (u < failRate + modestRate) {
        m = 0.3 + rng() * (3 - 0.3);
      } else {
        // Tirage Pareto tronqué : m = xmin × (1−u)^(−1/alpha), plafonné.
        m = Math.min(PARETO_XMIN * Math.pow(1 - rng(), -1 / alpha), maxMultiple);
        winners.push(i);
      }
      lineMultiples.push(m);
      allMultiples.push(m);
    }

    // La dilution non défendue réduit le multiple effectif du fonds sur le check initial.
    const lineProceeds = lineMultiples.map((m) => initialCheckM * m * (1 - dilutionPct));

    // Follow-ons : la réserve est déployée à parts égales dans les lignes de la queue,
    // à mi-parcours (rendement √m), pro-rata défendu donc sans dilution.
    let total = 0;
    if (winners.length > 0 && reservePoolM > 0) {
      const followOnPerWinner = reservePoolM / winners.length;
      for (const i of winners) {
        lineProceeds[i] += followOnPerWinner * Math.sqrt(lineMultiples[i]);
      }
    } else {
      // Aucune ligne défendable : réserve non appelée, restituée à 1×.
      total += reservePoolM;
    }

    for (const p of lineProceeds) total += p;
    tvpis.push(total / fundSizeM);

    const sorted = [...lineProceeds].sort((a, b) => b - a);
    const safeTotal = total || 1;
    topShares.push(sorted[0] / safeTotal);
    top3Shares.push((sorted[0] + (sorted[1] ?? 0) + (sorted[2] ?? 0)) / safeTotal);
  }

  tvpis.sort((a, b) => a - b);
  topShares.sort((a, b) => a - b);
  top3Shares.sort((a, b) => a - b);

  const probAtLeast = (x: number) => tvpis.filter((t) => t >= x).length / tvpis.length;
  const ownershipAtExit = ownershipPct * (1 - dilutionPct);

  return {
    percentiles: {
      p5: percentile(tvpis, 0.05),
      p10: percentile(tvpis, 0.1),
      p25: percentile(tvpis, 0.25),
      p50: percentile(tvpis, 0.5),
      p75: percentile(tvpis, 0.75),
      p90: percentile(tvpis, 0.9),
      p99: percentile(tvpis, 0.99),
    },
    mean: tvpis.reduce((s, t) => s + t, 0) / tvpis.length,
    probAtLeast: { x1: probAtLeast(1), x2: probAtLeast(2), x3: probAtLeast(3), x5: probAtLeast(5) },
    medianTopLineShare: percentile(topShares, 0.5),
    medianTop3Share: percentile(top3Shares, 0.5),
    tvpiHistogram: bucketize(tvpis, TVPI_BUCKETS),
    multipleHistogram: bucketize(allMultiples, MULTIPLE_BUCKETS),
    initialCheckM,
    impliedPostMoneyM: ownershipPct > 0 ? initialCheckM / ownershipPct : 0,
    ownershipAtExitPct: ownershipAtExit,
    fundReturnerExitM: ownershipAtExit > 0 ? fundSizeM / ownershipAtExit : 0,
  };
}
