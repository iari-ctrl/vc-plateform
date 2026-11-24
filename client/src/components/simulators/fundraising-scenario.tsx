import { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { GlossaryPreview } from '@/lib/markdown';
import { calculateFundraisingScenario } from '@/lib/simulators/fundraising-scenario';
import { Field, Panel, Slider, Stat } from './shared';

// ── 6. Fundraising scenario ─────────────────────────────────────────────────────
export function FundraisingSim({ accent }: { accent: string }) {
  const [burn, setBurn] = useState(120);
  const [runway, setRunway] = useState(18);
  const [cash, setCash] = useState(200);
  const [dilution, setDilution] = useState(18);

  const scenario = calculateFundraisingScenario({
    monthlyBurnK: burn,
    runwayMonths: runway,
    currentCashK: cash,
    targetDilutionPct: dilution,
  });

  return (
    <Panel
      inputs={
        <>
          <Field label="Trésorerie actuelle" suffix="k€" value={cash} step={10} onChange={setCash} />
          <Field label="Dépenses mensuelles (burn)" suffix="k€/mois" value={burn} step={5} onChange={setBurn} />
          <Slider label="Durée à financer" value={runway} min={6} max={36} step={1} format={(v) => `${v} mois`} onChange={setRunway} />
          <Slider label="Dilution acceptable" value={dilution} min={5} max={30} step={1} format={(v) => formatPercent(v, 0)} onChange={setDilution} />
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Montant à lever" value={`${formatCurrency(scenario.neededM * 1e6)} – ${formatCurrency(scenario.bufferedM * 1e6)}`} accent={accent} hint="besoin + marge de 25 %" />
            <Stat label="Valorisation post-money" value={scenario.postLowM === null || scenario.postHighM === null ? 'Non calculable' : `${formatCurrency(scenario.postLowM * 1e6)} – ${formatCurrency(scenario.postHighM * 1e6)}`} hint={`pour ${formatPercent(scenario.targetDilutionPct, 0)} de dilution`} />
            <Stat label="Dépense sur le runway" value={formatCurrency(scenario.monthlyBurnK * scenario.runwayMonths * 1000)} hint={`${scenario.monthlyBurnK} k€ × ${scenario.runwayMonths} mois`} />
            <Stat label="Pre-money impliquée" value={scenario.preLowM === null ? 'Non calculable' : `≈ ${formatCurrency(scenario.preLowM * 1e6)}`} hint="post − levée" />
          </div>
          {scenario.neededM === 0 && <p className="text-xs text-surface-variant">Aucune levée nécessaire pour l'horizon et la trésorerie saisis.</p>}
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant">
            <p className="font-semibold text-foreground mb-1">Méthode de calcul :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Besoin brut</strong> = (Burn mensuel cible × <GlossaryPreview slug="runway" label="Runway" /> souhaité) - Trésorerie actuelle en banque.</li>
              <li><strong>Montant ciblé à lever</strong> = Besoin brut + 25% de marge de sécurité nécessaire pour absorber les aléas du financement en capital-risque.</li>
              <li><strong>Valorisation <GlossaryPreview slug="pre-money" label="Post-money" /> induite</strong> = Montant à lever ÷ Dilution acceptable, si une levée est nécessaire. Une levée nulle ne permet pas d'en déduire une valorisation.</li>
            </ul>
          </div>
        </>
      }
    />
  );
}
