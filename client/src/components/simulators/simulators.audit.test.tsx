// @vitest-environment jsdom
import '@/test/setupDom';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DilutionSim } from './dilution';
import { WaterfallSim } from './waterfall';
import { FundReturnsSim } from './fund-returns';
import { PrePostSim } from './pre-post-money';
import { OwnershipSim } from './ownership';
import { FundraisingSim } from './fundraising-scenario';
import { ManagementFeesSim } from './management-fees';
import { PowerLawSim } from './power-law';
import { SecondariesSim } from './secondaries';
import { calculateDilution } from '@/lib/simulators/dilution';
import { calculateWaterfall } from '@/lib/simulators/waterfall';
import { calculateFundReturns } from '@/lib/simulators/fund-returns';
import { calculatePrePostMoney } from '@/lib/simulators/pre-post-money';
import { calculateFundraisingScenario } from '@/lib/simulators/fundraising-scenario';
import { simulatePowerLawPortfolio } from '@/lib/simulators/power-law';
import { calculateSecondarySale, calculateContinuationFund } from '@/lib/simulators/secondaries';
import simulators from '@data/simulators.json';
import { renderWithRouter } from '@/test/renderApp';

describe('audit simulateurs — allocations', () => {
  it('refuse au calcul une allocation ESOP supérieure au capital disponible', () => {
    expect(() => calculateDilution([{ pre: 1, raise: 19, esopTarget: 10 }])).toThrow(RangeError);
    expect(calculateDilution([{ pre: 1, raise: 19, esopTarget: 5 }])[0]).toMatchObject({
      post: 20, investorPct: 95, esopPct: 5, founderAfter: 0,
    });
  });

  it('signale une allocation impossible à la saisie et ne présente pas une table incohérente', () => {
    renderWithRouter(<DilutionSim accent="#123456" />);
    fireEvent.click(screen.getByRole('button', { name: /retirer le tour series a/i }));
    fireEvent.click(screen.getByRole('button', { name: /retirer le tour series b/i }));
    fireEvent.change(screen.getByRole('spinbutton', { name: /pre-money/i }), { target: { value: '1' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /levée/i }), { target: { value: '19' } });
    expect(screen.getByRole('spinbutton', { name: /création esop/i })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/esop.*5\s*%/i)).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: /séquence de dilution/i })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton', { name: /création esop/i }), { target: { value: '5' } });
    const table = screen.getByRole('table', { name: /séquence de dilution/i });
    const seed = within(table).getByRole('row', { name: /seed/i });
    expect(within(seed).getByText(/^95\s*%$/)).toBeInTheDocument();
    expect(within(seed).getByText(/^5\s*%$/)).toBeInTheDocument();
  });
  it('indique une limite ESOP saisissable et conserve la valorisation pour le tour suivant', () => {
    renderWithRouter(<DilutionSim accent="#123456" />);
    fireEvent.click(screen.getByRole('button', { name: /retirer le tour series a/i }));
    fireEvent.click(screen.getByRole('button', { name: /retirer le tour series b/i }));
    fireEvent.change(screen.getByRole('spinbutton', { name: /pre-money/i }), { target: { value: '1' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /levée/i }), { target: { value: '5' } });
    const esop = screen.getByRole('spinbutton', { name: /création esop/i });
    fireEvent.change(esop, { target: { value: '16.7' } });
    expect(esop).toHaveAccessibleDescription(/16,66\s*%/);
    fireEvent.click(screen.getByRole('button', { name: /ajouter un tour/i }));
    expect(screen.getAllByRole('spinbutton', { name: /pre-money/i })[1]).toHaveValue(6);
    fireEvent.change(esop, { target: { value: '16.66' } });
    expect(esop).toBeValid();
    expect(screen.getByRole('table', { name: /séquence de dilution/i })).toBeInTheDocument();
  });

});

describe('audit simulateurs — waterfall', () => {
  it('ne calcule pas de multiple pour une mise nulle et conserve le produit de sortie', () => {
    expect(calculateWaterfall(0, 1, 25, 30, false)).toMatchObject({
      investor: 7.5, common: 22.5, investorMultiple: null,
    });
    expect(calculateWaterfall(5, 1, 25, 30, false).investorMultiple).toBe(1.5);
    expect(calculateWaterfall(0.001, 1, 25, 30, false).investorMultiple).toBe(7500);
  });

  it('affiche le multiple indéfini sans masquer les montants distribués', () => {
    renderWithRouter(<WaterfallSim accent="#123456" />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /montant investi/i }), { target: { value: '0' } });
    expect(screen.getByText('Non calculable')).toBeInTheDocument();
    expect(screen.getByText(/7,5\s*M€/)).toBeInTheDocument();
    expect(screen.queryByText('750×')).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton', { name: /montant investi/i }), { target: { value: '5' } });
    expect(screen.getByText(/1,5×/)).toBeInTheDocument();
  });
});

describe('audit simulateurs — rendements du fonds', () => {
  it('distingue le capital appelé nul de la perte effective', () => {
    expect(calculateFundReturns(0, 60, 180)).toEqual({ dpi: null, rvpi: null, tvpi: null });
    expect(calculateFundReturns(100, 0, 0)).toEqual({ dpi: 0, rvpi: 0, tvpi: 0 });
  });

  it('présente DPI, RVPI et TVPI sans attribuer un MOIC brut aux flux LP', () => {
    renderWithRouter(<FundReturnsSim accent="#123456" />);
    expect(screen.queryByText('MOIC (brut)')).not.toBeInTheDocument();
    expect(screen.getByText('2,4×')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton', { name: /capital appelé/i }), { target: { value: '0' } });
    expect(screen.getAllByText('Non calculable')).toHaveLength(3);
    expect(screen.getByText(/distribué.*25\s*%/i)).toBeInTheDocument();
    expect(screen.getByText(/latent.*75\s*%/i)).toBeInTheDocument();
  });

  it('décrit les distributions en numéraire et en titres, et distingue la répartition nulle', () => {
    renderWithRouter(<FundReturnsSim accent="#123456" />);
    expect(screen.getAllByText(/titres.*date de distribution/i)).toHaveLength(2);
    fireEvent.change(screen.getByRole('spinbutton', { name: /distributions versées/i }), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /valeur résiduelle/i }), { target: { value: '0' } });
    expect(screen.getByText(/répartition non calculable/i)).toBeInTheDocument();
  });
});

describe('audit simulateurs — pre/post-money', () => {
  it('distingue un multiple indéfini de zéro lorsque la pre-money est nulle', () => {
    expect(calculatePrePostMoney({ preMoney: 0, raise: 2.5 })).toMatchObject({
      postMoney: 2.5, investorPct: 100, impliedMultiple: null,
    });
    expect(calculatePrePostMoney({ preMoney: 8, raise: 2 }).impliedMultiple).toBe(1.25);
  });

  it('ne promet ni troisième variable ni prix par action sans nombre d’actions', () => {
    const notice = simulators.find(item => item.id === 'pre-post-money');
    expect(notice?.description).toMatch(/pre-money.*montant levé/i);
    expect(notice?.description).not.toMatch(/prix par action|deux des trois variables/i);
    renderWithRouter(<PrePostSim accent="#123456" />);
    expect(screen.getByText('10 M€')).toBeInTheDocument();
    expect(screen.getByText('1,25×')).toBeInTheDocument();
  });
});

describe('audit simulateurs — ownership', () => {
  it('fait coïncider le total de la table et la somme des lignes quand aucune action n’existe', () => {
    renderWithRouter(<OwnershipSim accent="#123456" />);
    const table = screen.getByRole('table', { name: /capitalisation par détenteur/i });
    const total = within(table).getByRole('row', { name: /total/i });
    expect(within(total).getAllByRole('cell').at(-1)).toHaveTextContent(/40\s*M€/);
    for (const input of screen.getAllByRole('spinbutton', { name: /actions de/i })) {
      fireEvent.change(input, { target: { value: '0' } });
    }
    expect(within(total).getAllByRole('cell').at(-1)).toHaveTextContent(/0\s*€/);
    expect(within(total).getAllByRole('cell').at(-1)).not.toHaveTextContent(/40\s*M€/);
  });
});

describe('audit simulateurs — levée', () => {
  it('ne déduit aucune valorisation d’une levée nulle', () => {
    const result = calculateFundraisingScenario({ monthlyBurnK: 120, runwayMonths: 18, currentCashK: 2160, targetDilutionPct: 18 });
    expect(result).toMatchObject({ neededM: 0, postLowM: null, postHighM: null, preLowM: null });
  });

  it('ne masque pas les petites levées positives sous un arrondi en millions', () => {
    renderWithRouter(<FundraisingSim accent="#123456" />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /trésorerie actuelle/i }), { target: { value: '2150' } });
    expect(screen.getByText(/10\s*k€\s*–\s*12,5\s*k€/)).toBeInTheDocument();
    expect(screen.getByText(/55,6\s*k€\s*–\s*69,4\s*k€/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton', { name: /trésorerie actuelle/i }), { target: { value: '2160' } });
    expect(screen.getAllByText('Non calculable').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/aucune levée nécessaire/i)).toBeInTheDocument();
  });
});

describe('audit simulateurs — frais de gestion', () => {
  it('signale le déficit de récolte même si le budget initial reste positif', () => {
    renderWithRouter(<ManagementFeesSim accent="#123456" />);
    expect(screen.getByText('Budget équilibré')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider', { name: /taille de l.équipe/i }), { target: { value: '10' } });
    fireEvent.change(screen.getByRole('slider', { name: /salaire moyen chargé/i }), { target: { value: '180' } });
    expect(screen.getByText(/budget de récolte dépassé/i)).toBeInTheDocument();
    expect(screen.getByText(/300\s*k€.*déficit/i)).toBeInTheDocument();
  });
  it('reconnaît un budget de récolte de 70 000 € exactement égal aux salaires', () => {
    renderWithRouter(<ManagementFeesSim accent="#123456" />);
    for (const [name, value] of [
      [/taille du fonds/i, '5'], [/frais de gestion annuels/i, '1.9'],
      [/taille de l.équipe/i, '1'], [/salaire moyen chargé/i, '70'],
    ] as const) {
      fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
    }
    expect(screen.queryByText(/budget de récolte dépassé/i)).not.toBeInTheDocument();
  });

});

describe('audit simulateurs — power law', () => {
  it('ne promet pas de sensibilité TVPI à un ownership qui ne change pas le tirage', () => {
    const base = { fundSizeM: 80, portfolioSize: 25, reservesPct: 0.4, ownershipPct: 0.1,
      dilutionPct: 0.4, failRatePct: 0.5, modestRatePct: 0.35, alpha: 2, maxMultiple: 300, runs: 4000, seed: 42 };
    const a = simulatePowerLawPortfolio(base);
    const b = simulatePowerLawPortfolio({ ...base, ownershipPct: 0.25 });
    expect(a.percentiles.p50).toBe(b.percentiles.p50);
    expect(a.fundReturnerExitM).toBeGreaterThan(b.fundReturnerExitM);
    expect(simulators.find(item => item.id === 'power-law')?.description).not.toMatch(/sensibilité du TVPI[^.]*ownership/i);
    renderWithRouter(<PowerLawSim accent="#123456" />);
    expect(screen.getByText(/le TVPI reste constant/i)).toBeInTheDocument();
    expect(screen.queryByText(/Management Fees pour le net/i)).not.toBeInTheDocument();
  });
});

describe('audit simulateurs — secondaries', () => {
  const sale = { paidInM: 100, distributedM: 40, navM: 120, soldPct: 0.5,
    discountPct: 0, yearsToLiquidity: 4, exitMultiple: 1, discountRate: 0 };
  const continuation = { assetNavM: 100, pricingPctOfNav: 0.9, costBasisM: 40,
    rolloverPct: 0, carryPct: 0.2, newFeeRate: 0.015, horizonYears: 5, exitMultiple: 1.8 };

  it('ne calcule pas les ratios sans capital appelé ni multiple sans montant roulé', () => {
    expect(calculateSecondarySale({ ...sale, paidInM: 0 })).toMatchObject({
      liquidityBefore: null, liquidityAfter: null, valueBefore: null, valueAfter: null,
    });
    expect(calculateContinuationFund(continuation)).toMatchObject({ rolledM: 0, rollerNetMultiple: null });
  });

  it('laisse le seuil de sortie et le taux de récupération indéfinis pour une NAV nulle', () => {
    expect(calculateSecondarySale({ ...sale, navM: 0 })).toMatchObject({
      pvSellM: 0, pvHoldM: 0, breakEvenMultiple: null,
    });
    expect(calculateContinuationFund({ ...continuation, assetNavM: 0, rolloverPct: 0.3 })).toMatchObject({
      sellerRecoveryPct: null, rollerNetMultiple: null,
    });
  });

  it('présente l’égalité de vente et conservation comme une indifférence, pas une domination', () => {
    renderWithRouter(<SecondariesSim accent="#123456" />);
    fireEvent.change(screen.getByRole('slider', { name: /décote sur la nav/i }), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('slider', { name: /taux d.actualisation/i }), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('slider', { name: /multiple attendu/i }), { target: { value: '1' } });
    expect(screen.getByText(/vendre ou conserver.*équivalent/i)).toBeInTheDocument();
    expect(screen.queryByText('Vendre domine')).not.toBeInTheDocument();
  });

  it('distingue le cash du LP vendeur des distributions du fonds et ne fabrique pas un multiple sans LP roulant', () => {
    renderWithRouter(<SecondariesSim accent="#123456" />);
    expect(screen.getByText(/liquidité du lp vendeur/i)).toBeInTheDocument();
    expect(screen.queryByText('DPI avant → après')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /continuation fund \(gp-led\)/i }));
    fireEvent.change(screen.getByRole('slider', { name: /lps existants qui roulent/i }), { target: { value: '0' } });
    expect(screen.getByText('Non calculable')).toBeInTheDocument();
  });
});
