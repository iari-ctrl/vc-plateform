import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { GlossaryPreview } from '@/lib/markdown';
import { Panel, Slider, useEditableList } from './shared';

// ── 3. Ownership / cap table ────────────────────────────────────────────────────
interface Holder { id: number; name: string; shares: number }
export function OwnershipSim({ accent }: { accent: string }) {
  const [valuation, setValuation] = useState(40);
  const { items: holders, update, remove, add } = useEditableList<Holder>([
    { id: 1, name: 'Fondateurs', shares: 6000 },
    { id: 2, name: 'ESOP', shares: 1000 },
    { id: 3, name: 'Seed', shares: 1800 },
    { id: 4, name: 'Series A', shares: 1200 },
  ]);
  const total = holders.reduce((s, h) => s + h.shares, 0) || 1;
  return (
    <Panel
      inputs={
        <>
          <Slider label="Valorisation de l’entreprise" value={valuation} min={1} max={500} step={1} format={(v) => formatCurrency(v * 1e6)} onChange={setValuation} />
          <div className="space-y-2">
            {holders.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <input value={h.name} aria-label="Nom du détenteur" onChange={(e) => update(h.id, { name: e.target.value })} className="w-28 rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-sm outline-none" />
                <input type="number" value={h.shares} aria-label={`Parts de ${h.name || 'ce détenteur'}`} onChange={(e) => update(h.id, { shares: parseFloat(e.target.value) || 0 })} className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-sm outline-none" />
                {holders.length > 1 && <button onClick={() => remove(h.id)} aria-label={`Retirer ${h.name || 'ce détenteur'}`} className="text-surface-variant hover:text-error"><Trash2 size={14} /></button>}
              </div>
            ))}
          </div>
          <button onClick={() => add({ id: Date.now(), name: 'Nouveau', shares: 500 })} className="btn-ghost w-full !py-2"><Plus size={15} /> Ajouter une ligne</button>
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
          <div className="overflow-hidden rounded-2xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container text-left text-xs text-surface-variant"><tr><th className="px-4 py-2.5 font-medium">Détenteur</th><th className="px-4 py-2.5 font-medium">Actions</th><th className="px-4 py-2.5 font-medium">Part</th><th className="px-4 py-2.5 font-medium">Valeur</th></tr></thead>
              <tbody>
                {holders.map((h) => {
                  const pct = (h.shares / total) * 100;
                  return (
                    <tr key={h.id} className="border-t border-outline-variant">
                      <td className="px-4 py-2.5 font-medium">{h.name}</td>
                      <td className="px-4 py-2.5 font-mono">{formatNumber(h.shares)}</td>
                      <td className="px-4 py-2.5 font-mono">{formatPercent(pct)}</td>
                      <td className="px-4 py-2.5">{formatCurrency((pct / 100) * valuation * 1e6)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr className="border-t border-outline-variant bg-surface-container-low font-medium"><td className="px-4 py-2.5">Total</td><td className="px-4 py-2.5 font-mono">{formatNumber(total)}</td><td className="px-4 py-2.5">100 %</td><td className="px-4 py-2.5">{formatCurrency(valuation * 1e6)}</td></tr></tfoot>
            </table>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full">
            {holders.map((h, i) => (
              <div key={h.id} style={{ width: `${(h.shares / total) * 100}%`, background: `color-mix(in srgb, ${accent} ${100 - i * 18}%, var(--surface-container-highest))` }} title={h.name} />
            ))}
          </div>
        </>
      }
    />
  );
}
