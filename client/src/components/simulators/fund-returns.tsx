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
  return (
    <Panel
      inputs={
        <>
          <Field label="Capital appelé (paid-in)" suffix="M€" value={paidIn} step={5} onChange={setPaidIn} />
          <Field label="Distributions versées" suffix="M€" value={distributed} step={5} onChange={setDistributed} />
          <Field label="Valeur résiduelle (NAV)" suffix="M€" value={nav} step={5} onChange={setNav} />
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (Métriques <GlossaryPreview slug="lp" label="ILPA" />) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong><GlossaryPreview slug="dpi" label="DPI" /> (Cash rendu)</strong> = Distributions en numéraire ÷ Capital appelé (Paid-in). C'est la seule métrique qui mesure le vrai cash retourné aux LPs.</li>
              <li><strong><GlossaryPreview slug="rvpi" label="RVPI" /> (Valeur latente)</strong> = Valeur liquidative (<GlossaryPreview slug="tvpi" label="NAV" />) du portefeuille ÷ Capital appelé. C'est l'argent "virtuel" bloqué dans les startups non encore revendues.</li>
              <li><strong><GlossaryPreview slug="tvpi" label="TVPI" /> (Multiple Total)</strong> = DPI + RVPI. Le <GlossaryPreview slug="moic" label="MOIC" /> brut mesure la performance globale.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="DPI" value={formatMultiple(dpi)} accent={accent} hint="cash rendu" />
            <Stat label="RVPI" value={formatMultiple(rvpi)} hint="valeur latente" />
            <Stat label="TVPI" value={formatMultiple(tvpi)} accent={accent} hint="DPI + RVPI" />
            <Stat label="MOIC (brut)" value={formatMultiple(tvpi)} hint="multiple total" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Réalisé vs latent (sur le TVPI)</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${tvpi ? (dpi / tvpi) * 100 : 0}%`, background: accent }} />
              <div style={{ width: `${tvpi ? (rvpi / tvpi) * 100 : 0}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-surface-variant"><span>Réalisé (DPI) {formatPercent(tvpi ? (dpi / tvpi) * 100 : 0)}</span><span>Latent (RVPI) {formatPercent(tvpi ? (rvpi / tvpi) * 100 : 0)}</span></div>
          </div>
        </>
      }
    />
  );
}
