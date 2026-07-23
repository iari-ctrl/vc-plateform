import { useState } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
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
          <Field label="Burn mensuel" suffix="k€/mois" description="Dépense mensuelle cible en milliers d’euros." value={burn} step={5} onChange={setBurn} />
          <Slider label="Runway cible" value={runway} min={6} max={36} step={1} format={(v) => `${v} mois`} onChange={setRunway} />
          <Field label="Trésorerie actuelle" suffix="k€" description="Cash disponible en milliers d’euros." value={cash} step={10} onChange={setCash} />
          <Slider label="Dilution acceptable" value={dilution} min={5} max={30} step={1} format={(v) => formatPercent(v, 0)} onChange={setDilution} />
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthode de calcul :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Besoin brut</strong> = (Burn mensuel cible × <GlossaryPreview slug="runway" label="Runway" /> souhaité) - Trésorerie actuelle en banque.</li>
              <li><strong>Montant ciblé à lever</strong> = Besoin brut + 25% de marge de sécurité nécessaire pour absorber les aléas du financement en capital-risque.</li>
              <li><strong>Valorisation <GlossaryPreview slug="pre-money" label="Post-money" /> induite</strong> = Montant à lever ÷ Dilution acceptable. Le montant à lever et la limite de dilution déterminent mathématiquement cette valorisation.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Montant à lever" value={`${formatNumber(scenario.neededM, { maximumFractionDigits: 1 })} – ${formatNumber(scenario.bufferedM, { maximumFractionDigits: 1 })} M€`} accent={accent} hint="besoin + marge de 25 %" />
            <Stat label="Valorisation post-money" value={`${formatNumber(scenario.postLowM, { maximumFractionDigits: 1 })} – ${formatNumber(scenario.postHighM, { maximumFractionDigits: 1 })} M€`} hint={`pour ${formatPercent(scenario.targetDilutionPct, 0)} de dilution`} />
            <Stat label="Dépense sur le runway" value={formatCurrency(scenario.monthlyBurnK * scenario.runwayMonths * 1000)} hint={`${scenario.monthlyBurnK} k€ × ${scenario.runwayMonths} mois`} />
            <Stat label="Pre-money impliquée" value={`≈ ${formatNumber(scenario.preLowM, { maximumFractionDigits: 1 })} M€`} hint="post − levée" />
          </div>
        </>
      }
    />
  );
}
