import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { GlossaryPreview } from '@/lib/markdown';
import { calculateOwnership } from '@/lib/simulators/ownership';
import { Panel, Slider } from './shared';

// ── 3. Ownership / cap table ────────────────────────────────────────────────────
interface Holder { id: number; name: string; shares: number }
export function OwnershipSim({ accent }: { accent: string }) {
  const [valuation, setValuation] = useState(40);
  const [holders, setHolders] = useState<Holder[]>([
    { id: 1, name: 'Fondateurs', shares: 6000 },
    { id: 2, name: 'ESOP', shares: 1000 },
    { id: 3, name: 'Seed', shares: 1800 },
    { id: 4, name: 'Series A', shares: 1200 },
  ]);
  const ownership = calculateOwnership({ valuation, holders });
  const total = ownership.totalShares;
  const rows = ownership.rows;
  return (
    <Panel
      inputs={
        <>
          <Slider label="Valorisation de l’entreprise" value={valuation} min={1} max={500} step={1} format={(v) => formatCurrency(v * 1e6)} onChange={setValuation} />
          <div className="space-y-2">
            {holders.map((h) => (
              <div key={h.id} data-ownership-row className="grid grid-cols-[minmax(0,1fr)_minmax(7rem,1fr)_auto] items-center gap-2">
                <input value={h.name} aria-label={`Nom du détenteur ${h.name || 'sans nom'}`} onChange={(e) => setHolders((hs) => hs.map((x) => (x.id === h.id ? { ...x, name: e.target.value } : x)))} className="min-w-0 rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-sm outline-none" />
                <input type="number" min={0} value={h.shares} aria-label={`Actions de ${h.name || 'ce détenteur'}`} onChange={(e) => setHolders((hs) => hs.map((x) => (x.id === h.id ? { ...x, shares: Math.max(0, Number.parseFloat(e.target.value) || 0) } : x)))} className="min-w-0 rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-sm outline-none" />
                {holders.length > 1 && <button type="button" onClick={() => setHolders((hs) => hs.filter((x) => x.id !== h.id))} aria-label={`Retirer ${h.name || 'ce détenteur'}`} className="text-surface-variant hover:text-error"><Trash2 size={14} /></button>}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setHolders((hs) => [...hs, { id: Date.now(), name: 'Nouveau', shares: 500 }])} className="btn-ghost w-full !py-2"><Plus size={15} /> Ajouter une ligne</button>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (<GlossaryPreview slug="cap-table" label="Cap Table" />) :</p>
            <p>La valeur de la participation de chaque entité se calcule simplement au prorata de ses actions :</p>
            <ul className="list-inside list-disc space-y-1 mt-1">
              <li><strong>Part (%)</strong> = (Nombre d'actions du détenteur) ÷ (Total des actions émises)</li>
              <li><strong>Valeur</strong> = Part (%) × Valorisation totale de l'entreprise</li>
            </ul>
          </div>
          <div data-scroll-region="simulator-table" className="overflow-x-auto rounded-2xl border border-outline-variant">
            <table className="min-w-[36rem] w-full text-sm">
              <caption className="sr-only">Capitalisation par détenteur</caption>
              <thead className="bg-surface-container text-left text-xs text-surface-variant"><tr><th scope="col" className="px-4 py-2.5 font-medium">Détenteur</th><th scope="col" className="px-4 py-2.5 font-medium">Actions</th><th scope="col" className="px-4 py-2.5 font-medium">Part</th><th scope="col" className="px-4 py-2.5 font-medium">Valeur</th></tr></thead>
              <tbody>
                {rows.map((h, index) => {
                  const pct = h.ownershipPct;
                  return (
                    <tr key={holders[index]?.id ?? h.name} className="border-t border-outline-variant">
                      <th scope="row" className="px-4 py-2.5 text-left font-medium">{h.name}</th>
                      <td className="px-4 py-2.5 font-mono">{formatNumber(h.shares)}</td>
                      <td className="px-4 py-2.5 font-mono">{formatPercent(pct)}</td>
                      <td className="px-4 py-2.5">{formatCurrency(h.value)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr className="border-t border-outline-variant bg-surface-container-low font-medium"><th scope="row" className="px-4 py-2.5 text-left">Total</th><td className="px-4 py-2.5 font-mono">{formatNumber(total)}</td><td className="px-4 py-2.5">{total > 0 ? '100 %' : '0 %'}</td><td className="px-4 py-2.5">{formatCurrency(ownership.valuation * 1e6)}</td></tr></tfoot>
            </table>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full">
            {rows.map((h, i) => (
              <div key={holders[i]?.id ?? h.name} style={{ width: `${h.ownershipPct}%`, background: `color-mix(in srgb, ${accent} ${100 - i * 18}%, var(--surface-container-highest))` }} title={h.name} />
            ))}
          </div>
        </>
      }
    />
  );
}
