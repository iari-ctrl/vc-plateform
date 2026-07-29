import type { CaseStudyNumericScenario, CaseStudySeriesAOffer } from '@/content/types';
import { calculateWaterfall } from '@/lib/simulators/waterfall';

export interface SerieAWaterfallStep {
  exitValueM: number;
  investorM: number;
  /** Résidu revenant aux actions ordinaires, dérivé par différence : investorM + commonM === exitValueM. */
  commonM: number;
  choseConvert: boolean;
  /**
   * Multiple brut sur capital déployé par l'investisseur, primaire et secondaire confondus.
   * Le multiple renvoyé par `calculateWaterfall` rapporte les produits au seul primaire et ne
   * s'applique donc pas à une offre comportant du secondaire.
   */
  investorGrossMultiple: number;
}

export interface SerieAOfferResult {
  id: string;
  label: string;
  primaryInvestmentM: number;
  secondaryM: number;
  /** Décaissement total de l'investisseur : primaire souscrit + secondaire racheté aux fondateurs. */
  deployedCapitalM: number;
  preMoneyM: number;
  postMoneyM: number;
  optionPoolTopUpShares: number;
  optionPoolOwnershipPrePct: number;
  optionPoolOwnershipPostPct: number;
  primaryInvestorShares: number;
  secondaryShares: number;
  primaryInvestorOwnershipPct: number;
  totalNewInvestorOwnershipPct: number;
  founderOwnershipPostPct: number;
  shareClass: string;
  liquidationPreference: CaseStudySeriesAOffer['liquidationPreference'];
  waterfall: SerieAWaterfallStep[];
}

export interface SerieAWaterfallExportRow {
  offre: string;
  sortieM: number;
  investisseurM: number;
  autresDetenteursM: number;
  investisseurPct: number;
  multipleBrut: number;
  exercice: string;
}

export interface SerieACapTableExportRow {
  offre: string;
  ligne: string;
  actionsBefore: number;
  actionsAfter: number;
  partBeforePct: number;
  partAfterPct: number;
}

export interface SerieAOfferExportRow {
  offre: string;
  primaireM: number;
  secondaireM: number;
  preMoneyM: number;
  postMoneyM: number;
  pool: string;
  investisseurSerieAPct: number;
  fondateursPct: number;
  preference: string;
  gouvernance: string;
}

function round(value: number, decimals = 4): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatInteger(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function currentOptionPoolShares(scenario: CaseStudyNumericScenario): number {
  return scenario.allocatedOptionSharesBefore + scenario.unallocatedOptionPoolSharesBefore;
}

function assertScenario(scenario: CaseStudyNumericScenario) {
  if (scenario.fullyDilutedSharesBefore <= 0) throw new Error('fully diluted invalide');
  if (scenario.founderSharesBefore > scenario.fullyDilutedSharesBefore) throw new Error('fondateurs invalides');
  const componentTotal = scenario.founderSharesBefore
    + scenario.allocatedOptionSharesBefore
    + scenario.unallocatedOptionPoolSharesBefore
    + scenario.seedInvestorSharesBefore
    + scenario.convertibleShareEquivalents;
  if (componentTotal !== scenario.fullyDilutedSharesBefore) {
    throw new Error(
      `cap table pré-tour non réconciliée : fondateurs + options attribuées + réserve non attribuée + seed + convertibles = ${formatInteger(componentTotal)}, attendu ${formatInteger(scenario.fullyDilutedSharesBefore)}`,
    );
  }
}

function optionPoolTopUpShares(scenario: CaseStudyNumericScenario, offer: CaseStudySeriesAOffer): number {
  const target = offer.poolTargetPct / 100;
  const currentPool = currentOptionPoolShares(scenario);
  const preShares = scenario.fullyDilutedSharesBefore;

  if (offer.poolTiming === 'pre-money') {
    const required = ((target * preShares) - currentPool) / Math.max(1 - target, 0.0001);
    return Math.max(0, required);
  }

  const postToPreRatio = (offer.preMoneyM + offer.primaryInvestmentM) / offer.preMoneyM;
  const numerator = (target * postToPreRatio * preShares) - currentPool;
  const denominator = 1 - (target * postToPreRatio);
  return Math.max(0, numerator / Math.max(denominator, 0.0001));
}

function offerById(scenario: CaseStudyNumericScenario, offerId: string): CaseStudySeriesAOffer {
  const offer = scenario.offers.find((candidate) => candidate.id === offerId);
  if (!offer) throw new Error(`Offre introuvable: ${offerId}`);
  return offer;
}

export function calculateSerieAOffer(scenario: CaseStudyNumericScenario, offerId: string): SerieAOfferResult {
  assertScenario(scenario);
  const offer = offerById(scenario, offerId);
  const optionPoolTopUp = optionPoolTopUpShares(scenario, offer);
  const preRoundShares = scenario.fullyDilutedSharesBefore + optionPoolTopUp;
  const postMoneyM = offer.preMoneyM + offer.primaryInvestmentM;
  const primaryInvestorShares = (offer.primaryInvestmentM / offer.preMoneyM) * preRoundShares;
  const secondaryShares = offer.secondaryM > 0 ? (offer.secondaryM / offer.preMoneyM) * preRoundShares : 0;
  const postShares = preRoundShares + primaryInvestorShares;
  const founderSharesPost = Math.max(0, scenario.founderSharesBefore - secondaryShares);
  const primaryInvestorOwnershipPct = (primaryInvestorShares / postShares) * 100;
  const totalNewInvestorOwnershipPct = ((primaryInvestorShares + secondaryShares) / postShares) * 100;
  const optionPoolOwnershipPrePct = ((currentOptionPoolShares(scenario) + optionPoolTopUp) / preRoundShares) * 100;
  const optionPoolOwnershipPostPct = ((currentOptionPoolShares(scenario) + optionPoolTopUp) / postShares) * 100;
  // Le secondaire transfère des actions de fondateurs : ce sont des ordinaires, comptées dans la
  // détention totale mais exclues du bloc préférentiel. Les ordinaires post-opération sont les
  // actions pré-tour (le primaire seul crée des préférentielles).
  const investorCommonOwnershipPct = preRoundShares > 0 ? (secondaryShares / preRoundShares) * 100 : 0;
  const deployedCapitalM = offer.primaryInvestmentM + offer.secondaryM;

  return {
    id: offer.id,
    label: offer.label,
    primaryInvestmentM: offer.primaryInvestmentM,
    secondaryM: offer.secondaryM,
    deployedCapitalM,
    preMoneyM: offer.preMoneyM,
    postMoneyM,
    optionPoolTopUpShares: round(optionPoolTopUp, 2),
    optionPoolOwnershipPrePct: round(optionPoolOwnershipPrePct),
    optionPoolOwnershipPostPct: round(optionPoolOwnershipPostPct),
    primaryInvestorShares: round(primaryInvestorShares, 2),
    secondaryShares: round(secondaryShares, 2),
    primaryInvestorOwnershipPct: round(primaryInvestorOwnershipPct),
    totalNewInvestorOwnershipPct: round(totalNewInvestorOwnershipPct),
    founderOwnershipPostPct: round((founderSharesPost / postShares) * 100),
    shareClass: offer.shareClass,
    liquidationPreference: offer.liquidationPreference,
    waterfall: scenario.exitValuesM.map((exitValueM) => {
      const waterfall = calculateWaterfall(
        offer.primaryInvestmentM,
        offer.liquidationPreference.multiple,
        totalNewInvestorOwnershipPct,
        exitValueM,
        offer.liquidationPreference.participating,
        investorCommonOwnershipPct,
      );
      // La ligne ordinaire est dérivée par différence : arrondir les deux lignes séparément
      // ferait diverger leur somme du produit de cession.
      const investorM = round(waterfall.investor);
      return {
        exitValueM,
        investorM,
        commonM: round(Math.max(exitValueM - investorM, 0)),
        choseConvert: waterfall.choseConvert,
        investorGrossMultiple: deployedCapitalM > 0 ? round(waterfall.investor / deployedCapitalM) : 0,
      };
    }),
  };
}

/** Normalise les séparateurs de milliers insécables produits par `toLocaleString('fr-FR')`. */
function normalizeSpaces(value: string): string {
  return value.replace(/[\u202f\u00a0]/g, ' ');
}

function formatPct(value: number): string {
  return `${round(value, 1).toLocaleString('fr-FR')} %`;
}

function formatShares(value: number): string {
  return normalizeSpaces(Math.round(value).toLocaleString('fr-FR'));
}

function formatAmountM(value: number): string {
  return `${normalizeSpaces(value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} M€`;
}

function formatMultiple(value: number): string {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
}

export const SERIE_A_WATERFALL_NOTES = [
  'La ligne « Autres détenteurs modélisés » agrège fondateurs, seed, pool et convertibles hors produits déjà attribués à l’investisseur Série A.',
  'Séniorité modélisée : les actions de préférence Série A priment les ordinaires ; les préférences seed ne sont pas modélisées dans ce waterfall pédagogique.',
  'Le multiple brut rapporte les produits au capital déployé par l’investisseur, primaire et secondaire confondus.',
] as const;

function capTableRow(
  offre: string,
  ligne: string,
  actionsBefore: number,
  actionsAfter: number,
  sharesBeforeTotal: number,
  sharesAfterTotal: number,
): SerieACapTableExportRow {
  return {
    offre,
    ligne,
    actionsBefore: round(actionsBefore, 2),
    actionsAfter: round(actionsAfter, 2),
    partBeforePct: sharesBeforeTotal > 0 ? round((actionsBefore / sharesBeforeTotal) * 100) : 0,
    partAfterPct: sharesAfterTotal > 0 ? round((actionsAfter / sharesAfterTotal) * 100) : 0,
  };
}

export function buildSerieACapTableExportRows(scenario: CaseStudyNumericScenario): SerieACapTableExportRow[] {
  assertScenario(scenario);
  return scenario.offers.flatMap((offer) => {
    const result = calculateSerieAOffer(scenario, offer.id);
    const beforeTotal = scenario.fullyDilutedSharesBefore;
    const afterTotal = scenario.fullyDilutedSharesBefore + result.optionPoolTopUpShares + result.primaryInvestorShares;
    const foundersAfter = scenario.founderSharesBefore - result.secondaryShares;
    const unallocatedAfter = scenario.unallocatedOptionPoolSharesBefore + result.optionPoolTopUpShares;
    return [
      capTableRow(offer.label, 'Fondateurs', scenario.founderSharesBefore, foundersAfter, beforeTotal, afterTotal),
      capTableRow(offer.label, 'Options attribuées', scenario.allocatedOptionSharesBefore, scenario.allocatedOptionSharesBefore, beforeTotal, afterTotal),
      capTableRow(offer.label, 'Réserve non attribuée', scenario.unallocatedOptionPoolSharesBefore, unallocatedAfter, beforeTotal, afterTotal),
      capTableRow(offer.label, 'Investisseurs seed', scenario.seedInvestorSharesBefore, scenario.seedInvestorSharesBefore, beforeTotal, afterTotal),
      capTableRow(offer.label, 'Instruments convertibles', scenario.convertibleShareEquivalents, scenario.convertibleShareEquivalents, beforeTotal, afterTotal),
      capTableRow(offer.label, 'Primaire Série A préférentiel', 0, result.primaryInvestorShares, beforeTotal, afterTotal),
      capTableRow(offer.label, 'Secondaire Série A ordinaire', 0, result.secondaryShares, beforeTotal, afterTotal),
      capTableRow(offer.label, 'Total', beforeTotal, afterTotal, beforeTotal, afterTotal),
    ];
  });
}

export function buildSerieAWaterfallExportRows(scenario: CaseStudyNumericScenario): SerieAWaterfallExportRow[] {
  return scenario.offers.flatMap((offer) => {
    const result = calculateSerieAOffer(scenario, offer.id);
    return result.waterfall.map((step) => ({
      offre: offer.label,
      sortieM: step.exitValueM,
      investisseurM: step.investorM,
      autresDetenteursM: step.commonM,
      investisseurPct: step.exitValueM > 0 ? round((step.investorM / step.exitValueM) * 100) : 0,
      multipleBrut: step.investorGrossMultiple,
      exercice: step.choseConvert ? 'Conversion' : 'Préférence exercée',
    }));
  });
}

export function buildSerieAOfferExportRows(scenario: CaseStudyNumericScenario): SerieAOfferExportRow[] {
  return scenario.offers.map((offer) => {
    const result = calculateSerieAOffer(scenario, offer.id);
    return {
      offre: offer.label,
      primaireM: offer.primaryInvestmentM,
      secondaireM: offer.secondaryM,
      preMoneyM: offer.preMoneyM,
      postMoneyM: result.postMoneyM,
      pool: `${formatPct(offer.poolTargetPct)} ${offer.poolTiming}; top-up ${formatShares(result.optionPoolTopUpShares)} actions`,
      investisseurSerieAPct: result.totalNewInvestorOwnershipPct,
      fondateursPct: result.founderOwnershipPostPct,
      preference: `${offer.liquidationPreference.multiple}x ${offer.liquidationPreference.participating ? 'participating' : 'non-participating'}`,
      gouvernance: offer.governance,
    };
  });
}

export function buildSerieAOfferMarkdownTable(scenario: CaseStudyNumericScenario): string {
  const rows = buildSerieAOfferExportRows(scenario);
  const header = '| Offre | Primaire | Secondaire | Pre-money | Post-money | Pool | Investisseur Série A | Fondateurs |';
  const separator = '|---|---:|---:|---:|---:|---|---:|---:|';
  const body = rows.map((row) => [
    row.offre,
    `${row.primaireM} M€`,
    `${row.secondaireM} M€`,
    `${row.preMoneyM} M€`,
    `${row.postMoneyM} M€`,
    row.pool,
    formatPct(row.investisseurSerieAPct),
    formatPct(row.fondateursPct),
  ].join(' | ')).map((line) => `| ${line} |`).join('\n');

  const waterfallRows = buildSerieAWaterfallExportRows(scenario);
  const capTableRows = buildSerieACapTableExportRows(scenario);
  const capTableHeader = '| Offre | Ligne | Actions avant | Actions après | Part avant | Part après |';
  const capTableSeparator = '|---|---|---:|---:|---:|---:|';
  const capTableBody = capTableRows.map((row) => [
    row.offre,
    row.ligne,
    formatShares(row.actionsBefore),
    formatShares(row.actionsAfter),
    formatPct(row.partBeforePct),
    formatPct(row.partAfterPct),
  ].join(' | ')).map((line) => `| ${line} |`).join('\n');

  const waterfallHeader = '| Offre | Sortie | Investisseur | Autres détenteurs modélisés | Part investisseur | Multiple brut | Exercice |';
  const waterfallSeparator = '|---|---:|---:|---:|---:|---:|---|';
  const waterfallBody = waterfallRows.map((row) => [
    row.offre,
    `${row.sortieM} M€`,
    formatAmountM(row.investisseurM),
    formatAmountM(row.autresDetenteursM),
    formatPct(row.investisseurPct),
    formatMultiple(row.multipleBrut),
    row.exercice,
  ].join(' | ')).map((line) => `| ${line} |`).join('\n');

  return [
    `# ${scenario.title}`,
    '',
    scenario.summary,
    '',
    `Conventions : ${formatShares(scenario.convertibleShareEquivalents)} équivalents actions convertibles ; fully diluted initial ${formatShares(scenario.fullyDilutedSharesBefore)} ; classes ${scenario.shareClasses.join(', ')}.`,
    '',
    '## Cap table pédagogique fully diluted',
    '',
    capTableHeader,
    capTableSeparator,
    capTableBody,
    '',
    '## Comparaison des offres',
    '',
    header,
    separator,
    body,
    '',
    '## Répartition à la sortie',
    '',
    waterfallHeader,
    waterfallSeparator,
    waterfallBody,
    '',
    ...SERIE_A_WATERFALL_NOTES.map((note) => `- ${note}`),
  ].join('\n');
}
