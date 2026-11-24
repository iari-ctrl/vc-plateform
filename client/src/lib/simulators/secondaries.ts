export interface SecondarySaleParams {
  /** Capital appelé (paid-in) en M€. */
  paidInM: number;
  /** Distributions en numéraire déjà reçues par le LP vendeur, en M€. */
  distributedM: number;
  /** Valeur résiduelle (NAV) de la participation du LP vendeur en M€. */
  navM: number;
  /** Part de la NAV cédée sur le marché secondaire, 0..1. */
  soldPct: number;
  /** Décote sur la NAV au prix de transaction, 0..1 (0,2 = vente à 80 % de la NAV). */
  discountPct: number;
  /** Années restantes avant la liquidité naturelle (exits) si l'on conserve. */
  yearsToLiquidity: number;
  /** Multiple attendu sur la NAV actuelle à l'exit naturel (1 = la NAV se réalise telle quelle). */
  exitMultiple: number;
  /** Taux d'actualisation du LP (coût d'opportunité du capital), 0..1. */
  discountRate: number;
}

export interface SecondarySaleResult {
  /** NAV cédée en M€. */
  navSoldM: number;
  /** Produit net de la vente en M€ (NAV cédée × (1 − décote)). */
  proceedsM: number;
  /** Valeur abandonnée à la transaction (la décote en M€). */
  haircutM: number;
  /** Distributions reçues par le vendeur / capital versé par ce LP. */
  liquidityBefore: number | null;
  /** Distributions reçues et produit de la vente / capital versé par le vendeur. */
  liquidityAfter: number | null;
  valueBefore: number | null;
  /** Valeur économique du LP vendeur après transaction / capital appelé. */
  valueAfter: number | null;
  retainedNavRatio: number | null;
  /** Multiple d'exit sur la NAV cédée qui rend vendre et conserver équivalents en valeur actuelle. */
  breakEvenMultiple: number | null;
  /** Valeur actuelle de la NAV cédée si on la conserve jusqu'à l'exit (M€). */
  pvHoldM: number;
  /** Valeur de la vente immédiate (M€) — le produit, déjà en valeur d'aujourd'hui. */
  pvSellM: number;
  /** Comparaison des valeurs actuelles sur la part cédée. */
  comparison: 'hold' | 'sell' | 'equivalent';
}

export function calculateSecondarySale(p: SecondarySaleParams): SecondarySaleResult {
  const navSoldM = p.navM * p.soldPct;
  const proceedsM = navSoldM * (1 - p.discountPct);
  const haircutM = navSoldM - proceedsM;

  const liquidityBefore = p.paidInM > 0 ? p.distributedM / p.paidInM : null;
  const liquidityAfter = p.paidInM > 0 ? (p.distributedM + proceedsM) / p.paidInM : null;
  const valueBefore = p.paidInM > 0 ? (p.distributedM + p.navM) / p.paidInM : null;
  const navAfterM = p.navM - navSoldM;
  const valueAfter = p.paidInM > 0 ? (p.distributedM + proceedsM + navAfterM) / p.paidInM : null;
  const retainedNavRatio = p.paidInM > 0 ? navAfterM / p.paidInM : null;

  const growth = Math.pow(1 + p.discountRate, p.yearsToLiquidity);
  const breakEvenMultiple = navSoldM > 0 ? (1 - p.discountPct) * growth : null;
  const pvHoldM = growth ? (navSoldM * p.exitMultiple) / growth : 0;
  const pvSellM = proceedsM;
  const difference = pvHoldM - pvSellM;
  const tolerance = 8 * Number.EPSILON * Math.max(pvHoldM, pvSellM);

  return {
    navSoldM,
    proceedsM,
    haircutM,
    liquidityBefore,
    liquidityAfter,
    valueBefore,
    valueAfter,
    retainedNavRatio,
    breakEvenMultiple,
    pvHoldM,
    pvSellM,
    comparison: Math.abs(difference) <= tolerance ? 'equivalent' : difference > 0 ? 'hold' : 'sell',
  };
}

export interface ContinuationFundParams {
  /** NAV de l'actif (ou des actifs) transféré(s) dans le continuation fund, en M€. */
  assetNavM: number;
  /** Prix de transaction en fraction de la NAV, ex. 0,9 = 10 % de décote, 1,05 = prime. */
  pricingPctOfNav: number;
  /** Coût d'acquisition initial de l'actif pour le fonds vendeur, en M€. */
  costBasisM: number;
  /** Part des LPs existants qui roulent dans le nouveau véhicule, 0..1. Le reste sort en cash. */
  rolloverPct: number;
  /** Taux de carried interest, 0..1 (s'applique aux deux véhicules). */
  carryPct: number;
  /** Frais de gestion annuels du continuation fund, 0..1. */
  newFeeRate: number;
  /** Durée de détention dans le continuation fund, en années. */
  horizonYears: number;
  /** Multiple attendu sur la NAV actuelle à l'exit du continuation fund. */
  exitMultiple: number;
}

export interface ContinuationFundResult {
  /** Prix de transaction en M€ (NAV × pricing). */
  transactionPriceM: number;
  /** Carry cristallisé pour le GP au closing, sur la plus-value du fonds vendeur (M€). */
  crystallizedCarryM: number;
  /** Produit net revenant aux LPs existants après carry (M€). */
  netToOldLpsM: number;
  /** Cash versé aux LPs qui sortent (M€). */
  cashToSellersM: number;
  /** Produit net par unité de NAV pour un LP sortant, prime éventuelle comprise. */
  sellerRecoveryPct: number | null;
  /** Montant roulé dans le continuation fund par les LPs qui restent (M€). */
  rolledM: number;
  /** Valeur de l'actif à l'exit du continuation fund (M€). */
  exitValueM: number;
  /** Frais de gestion cumulés du continuation fund sur l'horizon (M€). */
  cvFeesM: number;
  /** Second carry du GP sur la plus-value du continuation fund (M€). */
  secondCarryM: number;
  /** Valeur nette revenant au LP qui roule, à l'exit (M€). */
  rollerNetM: number;
  /** Multiple net pour le LP qui roule (sur le montant roulé). */
  rollerNetMultiple: number | null;
  /** Économics totaux du GP sur l'opération : carry 1 + carry 2 + frais (M€). */
  gpTotalTakeM: number;
}

export function calculateContinuationFund(p: ContinuationFundParams): ContinuationFundResult {
  const transactionPriceM = p.assetNavM * p.pricingPctOfNav;
  const crystallizedCarryM = Math.max(transactionPriceM - p.costBasisM, 0) * p.carryPct;
  const netToOldLpsM = transactionPriceM - crystallizedCarryM;
  const cashToSellersM = netToOldLpsM * (1 - p.rolloverPct);
  const sellerRecoveryPct = p.assetNavM > 0 ? netToOldLpsM / p.assetNavM : null;
  const rolledM = netToOldLpsM * p.rolloverPct;

  const exitValueM = p.assetNavM * p.exitMultiple;
  const cvFeesM = transactionPriceM * p.newFeeRate * p.horizonYears;
  const secondCarryM = Math.max(exitValueM - transactionPriceM, 0) * p.carryPct;
  const netCvM = exitValueM - secondCarryM - cvFeesM;
  const rollerShare = transactionPriceM ? rolledM / transactionPriceM : 0;
  const rollerNetM = netCvM * rollerShare;
  const rollerNetMultiple = rolledM > 0 ? rollerNetM / rolledM : null;

  return {
    transactionPriceM,
    crystallizedCarryM,
    netToOldLpsM,
    cashToSellersM,
    sellerRecoveryPct,
    rolledM,
    exitValueM,
    cvFeesM,
    secondCarryM,
    rollerNetM,
    rollerNetMultiple,
    gpTotalTakeM: crystallizedCarryM + secondCarryM + cvFeesM,
  };
}
