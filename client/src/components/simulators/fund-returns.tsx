import { useState } from 'react';
import { formatMultiple, formatPercent } from '@/lib/utils';
import { calculateFundReturns } from '@/lib/simulators/fund-returns';
import { GlossaryPreview } from '@/lib/markdown';
import { Field, Panel, Stat } from './shared';

// ── 5. Fund returns ─────────────────────────────────────────────────────────────
export function FundReturnsSim({ accent }: { accent: string }) {
  const [paidIn, setPaidIn] = useState(100);
  const [distributed, setDistributed] = useState(60);
  const [nav, setNav] = useState(180);
  const { dpi, rvpi, tvpi } = calculateFundReturns(paidIn, distributed, nav);
  const totalValue = distributed + nav;
  const distributedPct = totalValue > 0 ? (distributed / totalValue) * 100 : null;
  const latentPct = totalValue > 0 ? (nav / totalValue) * 100 : null;
  return (
    <Panel
      inputs={
        <>
          <Field label="Capital appelé et versé (paid-in)" suffix="M€" value={paidIn} step={5} onChange={setPaidIn} />
          <Field label="Distributions versées" suffix="M€" description="Inclure les espèces et la valeur des titres à la date de distribution." value={distributed} step={5} onChange={setDistributed} />
          <Field label="Valeur résiduelle (NAV)" suffix="M€" value={nav} step={5} onChange={setNav} />
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="DPI" value={formatMultiple(dpi)} accent={accent} hint="valeur distribuée" />
            <Stat label="RVPI" value={formatMultiple(rvpi)} hint="valeur latente" />
            <Stat label="TVPI" value={formatMultiple(tvpi)} accent={accent} hint="DPI + RVPI" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Distribué vs latent (sur la valeur totale)</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${distributedPct ?? 0}%`, background: accent }} />
              <div style={{ width: `${latentPct ?? 0}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            {distributedPct === null || latentPct === null
              ? <p className="mt-2 text-xs text-surface-variant">Répartition non calculable : valeur totale nulle.</p>
              : <div className="mt-2 flex justify-between text-xs text-surface-variant"><span>Distribué {formatPercent(distributedPct)}</span><span>Latent {formatPercent(latentPct)}</span></div>}
          </div>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant">
            <p className="font-semibold text-foreground mb-1">Calcul des multiples du fonds</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong><GlossaryPreview slug="dpi" label="DPI" /> (Valeur distribuée)</strong> = Distributions en espèces et en titres (évalués à la date de distribution) ÷ Capital appelé et versé (paid-in).</li>
              <li><strong><GlossaryPreview slug="rvpi" label="RVPI" /> (Valeur latente)</strong> = Valeur résiduelle de la participation du LP dans le fonds (NAV) ÷ Capital appelé et versé.</li>
              <li><strong><GlossaryPreview slug="tvpi" label="TVPI" /> (Multiple total LP)</strong> = DPI + RVPI. Le <GlossaryPreview slug="moic" label="MOIC" /> brut du portefeuille se calcule à partir du capital investi dans les participations et de leur valeur brute.</li>
            </ul>
          </div>
        </>
      }
    />
  );
}
