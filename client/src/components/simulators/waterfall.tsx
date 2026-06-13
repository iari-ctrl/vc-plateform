import { useState } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { calculateWaterfall } from '@/lib/simulators/waterfall';
import { GlossaryPreview } from '@/lib/markdown';
import { Field, Panel, Slider, Stat } from './shared';

// ── 4. Waterfall ─────────────────────────────────────────────────────────────
export function WaterfallSim({ accent }: { accent: string }) {
  const [investment, setInvestment] = useState(5);
  const [multiple, setMultiple] = useState(1);
  const [participating, setParticipating] = useState(false);
  const [ownership, setOwnership] = useState(25);
  const [exit, setExit] = useState(30);

  const { investor, common, pref, choseConvert, investorMultiple } = calculateWaterfall(investment, multiple, ownership, exit, participating);

  return (
    <Panel
      inputs={
        <>
          <Field label="Montant investi" suffix="M€" value={investment} step={0.5} onChange={setInvestment} />
          <Slider label="Multiple de préférence" value={multiple} min={1} max={3} step={0.5} format={(v) => `${v}×`} onChange={setMultiple} />
          <Slider label="Part de l’investisseur (as-converted)" value={ownership} min={1} max={80} step={1} format={(v) => formatPercent(v, 0)} onChange={setOwnership} />
          <Slider label="Produit de la sortie" value={exit} min={1} max={300} step={1} format={(v) => formatCurrency(v * 1e6)} onChange={setExit} />
          <label className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm">
            <span>Participating (double-dip)</span>
            <button onClick={() => setParticipating((p) => !p)} className={`relative h-6 w-11 rounded-full transition-colors ${participating ? 'bg-[color:var(--primary)]' : 'bg-surface-container-highest'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${participating ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (<GlossaryPreview slug="liquidation-preference" label="Liquidation Preference" />) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>1x <GlossaryPreview slug="liquidation-preference" label="Non-Participating" /> (Standard)</strong> : Lors de la revente, l'investisseur VC a le choix. Soit il récupère sa mise initiale (la préférence), soit il convertit ses parts au prorata et prend son % de la vente totale. Il choisit toujours l'option mathématiquement la plus rentable.</li>
              <li><strong><GlossaryPreview slug="liquidation-preference" label="Participating" /> (Double-dip)</strong> : L'investisseur récupère sa mise en priorité (la préférence) <em>puis</em> prend en plus son % au prorata sur le reste de la vente (le produit résiduel). C'est extrêmement punitif pour les fondateurs.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Investisseur préférentiel" value={formatCurrency(investor * 1e6)} accent={accent} hint={participating ? 'préférence + participation' : choseConvert ? 'convertit en ordinaire' : 'préférence exercée'} />
            <Stat label="Actions ordinaires" value={formatCurrency(common * 1e6)} hint="fondateurs & employés" />
            <Stat label="Préférence de liquidation" value={formatCurrency(pref * 1e6)} hint={`${multiple}× la mise`} />
            <Stat label="Multiple investisseur" value={`${formatNumber(investorMultiple, { maximumFractionDigits: 2 })}×`} hint="retour sur la mise" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Répartition du produit de sortie</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${(investor / Math.max(exit, 1)) * 100}%`, background: accent }} />
              <div style={{ width: `${(common / Math.max(exit, 1)) * 100}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-surface-variant"><span>Investisseur {formatPercent((investor / Math.max(exit, 1)) * 100)}</span><span>Ordinaires {formatPercent((common / Math.max(exit, 1)) * 100)}</span></div>
          </div>
        </>
      }
    />
  );
}
