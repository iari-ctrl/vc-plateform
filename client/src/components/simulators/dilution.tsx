import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { calculateDilution, exceededEsopLimit } from '@/lib/simulators/dilution';
import { GlossaryPreview } from '@/lib/markdown';
import { Field, Panel, Stat } from './shared';

// ── 1. Dilution ──────────────────────────────────────────────────────────────
interface Round { id: number; label: string; pre: number; raise: number; esopTarget: number; }

export function DilutionSim({ accent }: { accent: string }) {
  const [rounds, setRounds] = useState<Round[]>([
    { id: 1, label: 'Seed', pre: 6, raise: 1.5, esopTarget: 10 },
    { id: 2, label: 'Series A', pre: 18, raise: 6, esopTarget: 5 },
    { id: 3, label: 'Series B', pre: 60, raise: 18, esopTarget: 0 },
  ]);

  const esopErrors = rounds.map((round) => {
    const limit = exceededEsopLimit(round);
    if (limit === null) return undefined;
    const maxInput = Math.floor((limit + 1e-9) * 100) / 100;
    return `ESOP trop élevé. Saisissez au plus ${formatPercent(maxInput, 2)} pour ce tour.`;
  });
  const invalidRound = esopErrors.some(Boolean);
  const results = invalidRound ? [] : calculateDilution(rounds);
  const rows = results.map((result, i) => ({ ...rounds[i], ...result }));
  const founder = results.length > 0 ? results[results.length - 1].founderAfter : 100;

  return (
    <Panel
      inputs={
        <>
          <div className="space-y-3">
            {rounds.map((r, i) => (
              <div key={r.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-3">
                <div className="mb-2 flex items-center justify-between">
                  <input value={r.label} aria-label={`Nom du tour ${i + 1}`} onChange={(e) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, label: e.target.value } : x)))} className="min-w-0 bg-transparent text-sm font-medium outline-none" />
                  {rounds.length > 1 && <button type="button" onClick={() => setRounds((rs) => rs.filter((x) => x.id !== r.id))} aria-label={`Retirer le tour ${r.label}`} className="text-surface-variant hover:text-error"><Trash2 size={14} /></button>}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Field label="Pre-money" suffix="M€" description="Valorisation avant levée, en millions d’euros." value={r.pre} step={0.5} onChange={(v) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, pre: v } : x)))} />
                  <Field label="Levée" suffix="M€" description="Montant levé, en millions d’euros." value={r.raise} step={0.5} onChange={(v) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, raise: v } : x)))} />
                  <Field label="Création ESOP" suffix="%" description="Nouveaux points de capital post-money attribués au pool, à la charge des anciens porteurs." error={esopErrors[i]} value={r.esopTarget} step={0.01} onChange={(v) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, esopTarget: v } : x)))} />
                </div>
                {!invalidRound && <p className="mt-1.5 text-[0.625rem] text-surface-variant">Cède {formatPercent(rows[i].investorPct)} aux investisseurs et {formatPercent(rows[i].esopPct)} au nouveau pool ESOP (post-money, à la charge des anciens porteurs)</p>}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRounds((rs) => {
              const getNextLabel = (len: number) => len === 0 ? 'Seed' : `Series ${String.fromCharCode(65 + len - 1)}`;
              const previous = rs[rs.length - 1];
              return [...rs, { id: Date.now(), label: getNextLabel(rs.length), pre: previous ? previous.pre + previous.raise : 80, raise: 20, esopTarget: 0 }];
            })}
            className="btn-ghost w-full !py-2"
          >
            <Plus size={15} /> Ajouter un tour
          </button>
        </>
      }
      results={
        <>
          {invalidRound ? (
            <p role="alert">Corrigez l’allocation ESOP pour afficher une répartition du capital valide.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Part fondateurs finale" value={formatPercent(founder)} accent={accent} hint="après tous les tours" />
                <Stat label="Dilution totale" value={formatPercent(100 - founder)} hint="cédée au total" />
                <Stat label="Valorisation finale" value={formatCurrency((rows[rows.length - 1]?.post ?? 0) * 1_000_000)} hint="post-money dernier tour" />
              </div>
              <div data-scroll-region="simulator-table" className="overflow-x-auto rounded-2xl border border-outline-variant">
                <table className="min-w-[44rem] w-full text-sm">
                  <caption className="sr-only">Séquence de dilution par tour de financement</caption>
                  <thead className="bg-surface-container text-left text-xs text-surface-variant">
                    <tr><th scope="col" className="px-4 py-2.5 font-medium">Tour</th><th scope="col" className="px-4 py-2.5 font-medium">Post-money</th><th scope="col" className="px-4 py-2.5 font-medium">Nouveaux inv.</th><th scope="col" className="px-4 py-2.5 font-medium">Nouvel ESOP</th><th scope="col" className="px-4 py-2.5 font-medium">Fondateurs après</th></tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-t border-outline-variant">
                        <th scope="row" className="px-4 py-2.5 text-left font-medium">{r.label}</th>
                        <td className="px-4 py-2.5">{formatCurrency(r.post * 1_000_000)}</td>
                        <td className="px-4 py-2.5">{formatPercent(r.investorPct)}</td>
                        <td className="px-4 py-2.5 text-surface-variant">{r.esopPct > 0 ? formatPercent(r.esopPct) : '-'}</td>
                        <td className="px-4 py-2.5 font-mono">{formatPercent(r.founderAfter)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant">
            <p className="font-semibold text-foreground mb-1">Méthodologie (Standard VC) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong><GlossaryPreview slug="pre-money" label="Post-money" /></strong> = <GlossaryPreview slug="pre-money" label="Pre-money" /> + Levée</li>
              <li><strong>Part Investisseur</strong> = Levée ÷ Post-money</li>
              <li><strong>Option Pool Shuffle</strong> : Le nouveau <GlossaryPreview slug="esop" label="pool ESOP" /> est exprimé en points du capital post-money, à la charge des porteurs préexistants (constitution avant la levée).</li>
              <li><strong>Nouvelle part fondateurs</strong> = Part précédente × (100% - Part Investisseur - Nouvel ESOP)</li>
            </ul>
          </div>
        </>
      }
    />
  );
}
