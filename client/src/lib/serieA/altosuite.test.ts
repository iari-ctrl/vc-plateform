import { describe, expect, it } from 'vitest';

import { caseById } from '@/content/caseStudies';
import {
  SERIE_A_WATERFALL_NOTES,
  buildSerieACapTableExportRows,
  buildSerieAOfferExportRows,
  buildSerieAOfferMarkdownTable,
  buildSerieAWaterfallExportRows,
  calculateSerieAOffer,
} from './altosuite';

const altoSuite = caseById('cs-serie-a-alto-sas');
const scenario = altoSuite?.numericScenario;

describe('contrat numérique AltoSuite Série A', () => {
  if (!altoSuite || !scenario) throw new Error('scénario numérique AltoSuite introuvable');

  it('explicite une cap table fully diluted réconciliée avec les convertibles, le seed et le pool séparé', () => {
    const table = altoSuite.documents?.find((document) => document.id === 'cap-table')?.tables?.[0];
    const shareRows = table?.rows ?? [];
    const totalShares = shareRows.reduce((sum, row) => sum + Number(row[1] ?? 0), 0);
    const totalPct = shareRows.reduce((sum, row) => sum + Number(String(row[2]).replace(',', '.').replace(/[^0-9.]/g, '')), 0);

    expect(scenario.fullyDilutedSharesBefore).toBe(10_000_000);
    expect(scenario.founderSharesBefore).toBe(5_500_000);
    expect(scenario.allocatedOptionSharesBefore).toBe(700_000);
    expect(scenario.unallocatedOptionPoolSharesBefore).toBe(500_000);
    expect(scenario.seedInvestorSharesBefore).toBe(2_400_000);
    expect(scenario.convertibleShareEquivalents).toBe(900_000);
    expect('currentOptionPoolShares' in scenario).toBe(false);
    expect(
      scenario.founderSharesBefore
      + scenario.allocatedOptionSharesBefore
      + scenario.unallocatedOptionPoolSharesBefore
      + scenario.seedInvestorSharesBefore
      + scenario.convertibleShareEquivalents,
    ).toBe(scenario.fullyDilutedSharesBefore);
    expect(totalShares).toBe(scenario.fullyDilutedSharesBefore);
    expect(totalPct).toBeCloseTo(100, 5);
    expect(shareRows.map((row) => row[0])).toEqual([
      'Fondateurs',
      'Options attribuées',
      'Réserve non attribuée',
      'Investisseurs seed',
      'Instruments convertibles',
    ]);
    expect(scenario.conventions).toEqual(expect.arrayContaining([
      expect.stringMatching(/900\s?000.*convertibles/i),
      expect.stringMatching(/secondaire.*ne finance pas la société/i),
      expect.stringMatching(/pool/i),
    ]));
    expect(scenario.shareClasses).toEqual(expect.arrayContaining(['ordinaires', 'préférence seed', 'préférence Série A']));
  });

  it('refuse une cap table pré-tour dont les cinq composantes ne totalisent pas le fully diluted', () => {
    const invalidScenario = {
      ...scenario,
      seedInvestorSharesBefore: scenario.seedInvestorSharesBefore + 1,
    };

    expect(() => calculateSerieAOffer(invalidScenario, 'offre-a')).toThrow(
      /fondateurs.*options attribuées.*réserve non attribuée.*seed.*convertibles.*10 000 001.*10 000 000/i,
    );
  });

  it('calcule deux offres selon des conventions explicites et déterministes', () => {
    const offerA = calculateSerieAOffer(scenario, 'offre-a');
    const offerB = calculateSerieAOffer(scenario, 'offre-b');

    expect(offerA.postMoneyM).toBe(35);
    expect(offerA.secondaryM).toBe(0);
    expect(offerA.optionPoolTopUpShares).toBeGreaterThan(0);
    expect(offerA.optionPoolOwnershipPostPct).toBeCloseTo(15, 4);
    expect(offerA.primaryInvestorOwnershipPct).toBeCloseTo(20, 4);

    expect(offerB.postMoneyM).toBe(41);
    expect(offerB.secondaryM).toBe(1);
    expect(offerB.optionPoolOwnershipPrePct).toBeCloseTo(18, 4);
    expect(offerB.primaryInvestorOwnershipPct).toBeCloseTo(21.9512, 4);
    expect(offerB.secondaryShares).toBeGreaterThan(0);
    expect(offerB.founderOwnershipPostPct).toBeLessThan(offerA.founderOwnershipPostPct);

    expect(offerA.liquidationPreference).toMatchObject({ multiple: 1, participating: false });
    expect(offerB.liquidationPreference).toMatchObject({ multiple: 1, participating: false });
    expect(offerB.waterfall[0]).toMatchObject({ exitValueM: scenario.exitValuesM[0] });
  });

  it('distingue le capital déployé du primaire souscrit', () => {
    expect(calculateSerieAOffer(scenario, 'offre-a').deployedCapitalM).toBe(7);
    expect(calculateSerieAOffer(scenario, 'offre-b').deployedCapitalM).toBe(10);
  });

  it('traite le secondaire de l’Offre B comme des actions ordinaires dans la waterfall', () => {
    const offerB = calculateSerieAOffer(scenario, 'offre-b');
    const [exitLow, exitMid, exitHigh] = scenario.exitValuesM;

    // Structure de capital de référence, recalculée depuis les conventions du scénario.
    const preRoundShares = 10_000_000 + ((0.18 * 10_000_000) - 1_200_000) / (1 - 0.18);
    expect(preRoundShares).toBeCloseTo(10_731_707.32, 2);
    expect(offerB.primaryInvestorShares).toBeCloseTo((9 / 32) * preRoundShares, 2);
    expect(offerB.secondaryShares).toBeCloseTo((1 / 32) * preRoundShares, 2);
    expect(offerB.primaryInvestorOwnershipPct).toBeCloseTo(21.9512, 4);
    expect(offerB.totalNewInvestorOwnershipPct).toBeCloseTo(24.3902, 4);

    // Le secondaire transfère des actions de fondateurs : ce sont des ordinaires.
    // Elles comptent dans le pourcentage de conversion mais ne portent aucune préférence.
    const secondaryShareOfCommon = 1 / 32; // 1 M de secondaire au prix implicite du pre-money 32 M
    const convertedShare = 10 / 41; // 10 M décaissés sur un post-money de 41 M

    // Sortie 30 M : le bloc préférentiel seul convertirait à 6,5854 M, sous la préférence de 9 M.
    // L'investisseur prend la préférence, puis partage le résidu au titre de ses seules
    // actions ordinaires.
    expect(0.219512 * exitLow).toBeLessThan(9);
    const investorLow = 9 + secondaryShareOfCommon * (exitLow - 9);
    expect(investorLow).toBeCloseTo(9.65625, 5);
    expect(offerB.waterfall[0]).toMatchObject({ exitValueM: exitLow, choseConvert: false });
    expect(offerB.waterfall[0].investorM).toBeCloseTo(investorLow, 3);
    expect(offerB.waterfall[0].commonM).toBeCloseTo(exitLow - investorLow, 3);

    // Sorties 60 et 120 M : la conversion l'emporte, la répartition est inchangée.
    expect(offerB.waterfall[1]).toMatchObject({ exitValueM: exitMid, choseConvert: true });
    expect(offerB.waterfall[1].investorM).toBeCloseTo(convertedShare * exitMid, 3);
    expect(offerB.waterfall[1].commonM).toBeCloseTo(exitMid - convertedShare * exitMid, 3);

    expect(offerB.waterfall[2]).toMatchObject({ exitValueM: exitHigh, choseConvert: true });
    expect(offerB.waterfall[2].investorM).toBeCloseTo(convertedShare * exitHigh, 3);
    expect(offerB.waterfall[2].commonM).toBeCloseTo(exitHigh - convertedShare * exitHigh, 3);

    // La répartition boucle exactement sur le produit de cession.
    for (const step of offerB.waterfall) {
      expect(step.investorM + step.commonM).toBe(step.exitValueM);
    }

    // Multiple brut rapporté aux 10 M déployés, primaire et secondaire confondus.
    expect(offerB.waterfall[0].investorGrossMultiple).toBeCloseTo(investorLow / 10, 3);
    expect(offerB.waterfall[0].investorGrossMultiple).toBeLessThan(1);
    expect(offerB.waterfall[2].investorGrossMultiple).toBeCloseTo((convertedShare * exitHigh) / 10, 3);
  });

  it('laisse la waterfall de l’Offre A inchangée en l’absence de secondaire', () => {
    const offerA = calculateSerieAOffer(scenario, 'offre-a');

    expect(offerA.secondaryShares).toBe(0);
    expect(offerA.totalNewInvestorOwnershipPct).toBeCloseTo(offerA.primaryInvestorOwnershipPct, 10);
    expect(offerA.waterfall).toEqual([
      { exitValueM: 30, investorM: 7, commonM: 23, choseConvert: false, investorGrossMultiple: 1 },
      { exitValueM: 60, investorM: 12, commonM: 48, choseConvert: true, investorGrossMultiple: 1.7143 },
      { exitValueM: 120, investorM: 24, commonM: 96, choseConvert: true, investorGrossMultiple: 3.4286 },
    ]);
  });

  it('produit un tableau exportable sans changer les hypothèses', () => {
    const rows = buildSerieAOfferExportRows(scenario);
    const markdown = buildSerieAOfferMarkdownTable(scenario);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ offre: 'Offre A', primaireM: 7, secondaireM: 0, preMoneyM: 28 });
    expect(rows[1]).toMatchObject({ offre: 'Offre B', primaireM: 9, secondaireM: 1, preMoneyM: 32 });
    expect(markdown).toContain('| Offre | Primaire | Secondaire | Pre-money | Post-money | Pool | Investisseur Série A | Fondateurs |');
    expect(markdown).toContain('Offre A');
    expect(markdown).toContain('Offre B');
    expect(markdown).toContain('900 000 équivalents actions convertibles');
  });

  it('produit une cap table pédagogique avant et après tour pour chaque offre', () => {
    const rows = buildSerieACapTableExportRows(scenario);
    const markdown = buildSerieAOfferMarkdownTable(scenario);
    const offerARows = rows.filter((row) => row.offre === 'Offre A');
    const offerBRows = rows.filter((row) => row.offre === 'Offre B');

    expect(offerARows.map((row) => row.ligne)).toEqual([
      'Fondateurs',
      'Options attribuées',
      'Réserve non attribuée',
      'Investisseurs seed',
      'Instruments convertibles',
      'Primaire Série A préférentiel',
      'Secondaire Série A ordinaire',
      'Total',
    ]);
    expect(offerARows.at(-1)).toMatchObject({ actionsBefore: 10_000_000 });
    expect(offerARows.at(-1)?.actionsAfter).toBeCloseTo(13_538_461.54, 2);

    const offerBFounders = offerBRows.find((row) => row.ligne === 'Fondateurs');
    const offerBSecondary = offerBRows.find((row) => row.ligne === 'Secondaire Série A ordinaire');
    const offerBPrimary = offerBRows.find((row) => row.ligne === 'Primaire Série A préférentiel');
    expect(offerBPrimary?.actionsAfter).toBeCloseTo(3_018_292.68, 2);
    expect(offerBSecondary?.actionsBefore).toBe(0);
    expect(offerBSecondary?.actionsAfter).toBeCloseTo(335_365.85, 2);
    expect(offerBFounders?.actionsBefore).toBe(5_500_000);
    expect(offerBFounders?.actionsAfter).toBeCloseTo(5_164_634.15, 2);
    expect(offerBFounders!.actionsBefore - offerBFounders!.actionsAfter).toBeCloseTo(offerBSecondary!.actionsAfter, 2);
    expect(offerBRows.at(-1)).toMatchObject({ actionsBefore: 10_000_000 });
    expect(offerBRows.at(-1)?.actionsAfter).toBeCloseTo(13_750_000, 2);

    expect(markdown).toContain('## Cap table pédagogique fully diluted');
    expect(markdown).toContain('| Offre | Ligne | Actions avant | Actions après | Part avant | Part après |');
    expect(markdown).toContain('Secondaire Série A ordinaire');
  });

  it('expose la répartition à la sortie dans un tableau distinct', () => {
    const rows = buildSerieAWaterfallExportRows(scenario);
    const markdown = buildSerieAOfferMarkdownTable(scenario);

    expect(rows).toHaveLength(scenario.offers.length * scenario.exitValuesM.length);
    expect(rows[0]).toMatchObject({
      offre: 'Offre A',
      sortieM: 30,
      investisseurM: 7,
      autresDetenteursM: 23,
      multipleBrut: 1,
      exercice: 'Préférence exercée',
    });
    expect(rows[0].investisseurPct).toBeCloseTo((7 / 30) * 100, 3);

    const offerBLowExit = rows.find((row) => row.offre === 'Offre B' && row.sortieM === 30);
    expect(offerBLowExit).toBeDefined();
    expect(offerBLowExit?.exercice).toBe('Préférence exercée');
    expect(offerBLowExit?.investisseurM).toBeCloseTo(9.65625, 3);
    expect(offerBLowExit?.autresDetenteursM).toBeCloseTo(20.34375, 3);
    expect(rows.filter((row) => row.exercice === 'Conversion')).toHaveLength(4);

    for (const row of rows) {
      expect(row.investisseurM + row.autresDetenteursM).toBe(row.sortieM);
    }

    expect(markdown).toContain('## Comparaison des offres');
    expect(markdown).toContain('## Répartition à la sortie');
    expect(markdown).toContain('| Offre | Sortie | Investisseur | Autres détenteurs modélisés | Part investisseur | Multiple brut | Exercice |');
    for (const note of SERIE_A_WATERFALL_NOTES) {
      expect(markdown).toContain(note);
    }
  });
});
