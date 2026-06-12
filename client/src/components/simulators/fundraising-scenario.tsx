import { useState } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { GlossaryPreview } from '@/lib/markdown';
import { Field, Panel, Slider, Stat } from './shared';

// ── 6. Fundraising scenario ─────────────────────────────────────────────────────
export function FundraisingSim({ accent }: { accent: string }) {
  const [burn, setBurn] = useState(120);
  const [runway, setRunway] = useState(18);
  const [cash, setCash] = useState(200);
  const [dilution, setDilution] = useState(18);

  const needed = Math.max(burn * runway - cash, 0) / 1000; // M€
  const buffered = needed * 1.25;
  const postLow = needed > 0 ? needed / (dilution / 100) : 0;
  const postHigh = buffered > 0 ? buffered / (dilution / 100) : 0;

  return (
    <Panel
      inputs={
        <>
          <Field label="Burn mensuel" suffix="k€/mois" value={burn} step={5} onChange={setBurn} />
          <Slider label="Runway cible" value={runway} min={6} max={36} step={1} format={(v) => `${v} mois`} onChange={setRunway} />
          <Field label="Trésorerie actuelle" suffix="k€" value={cash} step={10} onChange={setCash} />
          <Slider label="Dilution acceptable" value={dilution} min={5} max={30} step={1} format={(v) => formatPercent(v, 0)} onChange={setDilution} />
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie de ciblage :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Besoin brut</strong> = (Burn mensuel cible × <GlossaryPreview slug="runway" label="Runway" /> souhaité) - Trésorerie actuelle en banque.</li>
              <li><strong>Montant ciblé à lever</strong> = Besoin brut + 25% de marge de sécurité (indispensable en Venture Capital pour absorber les aléas).</li>
              <li><strong>Valorisation <GlossaryPreview slug="pre-money" label="Post-money" /> induite</strong> = Montant à lever ÷ Dilution acceptable. La valorisation de l'entreprise est la conséquence mathématique du besoin en capital combiné à la limite de dilution que les fondateurs se fixent, pas l'inverse.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Montant à lever" value={`${formatNumber(needed, { maximumFractionDigits: 1 })} – ${formatNumber(buffered, { maximumFractionDigits: 1 })} M€`} accent={accent} hint="besoin + marge de 25 %" />
            <Stat label="Valorisation post-money" value={`${formatNumber(postLow, { maximumFractionDigits: 1 })} – ${formatNumber(postHigh, { maximumFractionDigits: 1 })} M€`} hint={`pour ${formatPercent(dilution, 0)} de dilution`} />
            <Stat label="Dépense sur le runway" value={formatCurrency(burn * runway * 1000)} hint={`${burn} k€ × ${runway} mois`} />
            <Stat label="Pre-money impliquée" value={`≈ ${formatNumber(Math.max(postLow - needed, 0), { maximumFractionDigits: 1 })} M€`} hint="post − levée" />
          </div>
        </>
      }
    />
  );
}
