import { useState } from 'react';
import { formatCurrency, formatMultiple, formatPercent } from '@/lib/utils';
import { GlossaryPreview } from '@/lib/markdown';
import { Panel, Slider, Stat } from './shared';

// ── 2. Pre / Post money ────────────────────────────────────────────────────────
export function PrePostSim({ accent }: { accent: string }) {
  const [pre, setPre] = useState(8);
  const [raise, setRaise] = useState(2);
  const post = pre + raise;
  const investorPct = post > 0 ? (raise / post) * 100 : 0;
  return (
    <Panel
      inputs={
        <>
          <Slider label="Valorisation pre-money" value={pre} min={0.5} max={100} step={0.5} format={(v) => formatCurrency(v * 1e6)} onChange={setPre} />
          <Slider label="Montant levé" value={raise} min={0.1} max={50} step={0.1} format={(v) => formatCurrency(v * 1e6)} onChange={setRaise} />
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie mathématique :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong><GlossaryPreview slug="pre-money" label="Post-money" /></strong> = <GlossaryPreview slug="pre-money" label="Pre-money" /> + Montant levé</li>
              <li><strong>Part de l’investisseur (Dilution)</strong> = Montant levé ÷ Valorisation Post-money</li>
              <li><strong>Multiple implicite</strong> = Post-money ÷ Pre-money</li>
            </ul>
            <p className="mt-2">L'erreur classique des fondateurs est de diviser la levée par la valorisation pre-money. En VC, la dilution se calcule toujours sur le <strong>Post-money</strong>.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Valorisation post-money" value={formatCurrency(post * 1e6)} accent={accent} hint="pre + montant levé" />
            <Stat label="Part de l’investisseur" value={formatPercent(investorPct)} hint="montant / post-money" />
            <Stat label="Part conservée" value={formatPercent(100 - investorPct)} hint="par les détenteurs existants" />
            <Stat label="Multiple implicite" value={formatMultiple(post / Math.max(pre, 0.01))} hint="post / pre" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Répartition post-money</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${100 - investorPct}%`, background: accent }} />
              <div style={{ width: `${investorPct}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-surface-variant">
              <span>Existants {formatPercent(100 - investorPct)}</span>
              <span>Nouvel investisseur {formatPercent(investorPct)}</span>
            </div>
          </div>
        </>
      }
    />
  );
}
