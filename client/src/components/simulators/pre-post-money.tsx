import { useId, useState } from 'react';
import { formatCurrency, formatMultiple, formatNumber, formatPercent } from '@/lib/utils';
import { GlossaryPreview } from '@/lib/markdown';
import { calculatePrePostMoney } from '@/lib/simulators/pre-post-money';
import { Panel, Stat } from './shared';

interface AmountProps {
  label: string;
  initial: number;
  min: number;
  max: number;
  onChange: (amount: number | null) => void;
}

// Keep the draft in the native field so a decimal or an empty entry can be edited.
function AmountInput({ label, initial, min, max, onChange }: AmountProps) {
  const id = useId();
  const [invalid, setInvalid] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium">
        {label} <span className="font-mono text-xs text-surface-variant">M€</span>
      </label>
      <input
        id={id} type="number" inputMode="decimal" required min={min} max={max} step="any"
        defaultValue={initial} aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={({ currentTarget }) => {
          setInvalid(!currentTarget.validity.valid);
          onChange(currentTarget.validity.valid ? currentTarget.valueAsNumber : null);
        }}
        className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 font-mono text-base"
      />
      {invalid && <p id={`${id}-error`} className="mt-1 text-sm text-error">Saisissez un montant entre {formatNumber(min)} et {formatNumber(max)} M€.</p>}
    </div>
  );
}

export function PrePostSim({ accent }: { accent: string }) {
  const [pre, setPre] = useState<number | null>(8);
  const [raise, setRaise] = useState<number | null>(2);
  const metrics = pre !== null && raise !== null ? calculatePrePostMoney({ preMoney: pre, raise }) : null;
  return (
    <Panel
      inputs={
        <>
          <AmountInput label="Valorisation avant le tour (pre-money)" initial={8} min={0.5} max={100} onChange={setPre} />
          <AmountInput label="Montant levé" initial={2} min={0.1} max={50} onChange={setRaise} />
        </>
      }
      results={metrics ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Part de l’investisseur" value={formatPercent(metrics.investorPct)} accent={accent} hint="du capital après le tour" />
            <Stat label="Valorisation post-money" value={formatCurrency(metrics.postMoney * 1e6)} hint="après la levée" />
            <Stat label="Part conservée" value={formatPercent(metrics.retainedPct)} hint="par les détenteurs existants" />
            <Stat label="Multiple implicite" value={formatMultiple(metrics.impliedMultiple)} hint="post-money / pre-money" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Répartition post-money</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${metrics.retainedPct}%`, background: accent }} />
              <div style={{ width: `${metrics.investorPct}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex justify-between gap-2 text-xs text-surface-variant">
              <span>Existants {formatPercent(metrics.retainedPct)}</span>
              <span>Nouvel investisseur {formatPercent(metrics.investorPct)}</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-surface-variant">La valorisation post-money est la somme de la <GlossaryPreview slug="pre-money" label="valorisation avant le tour" /> et du montant levé. La part de l’investisseur correspond au montant levé divisé par cette valorisation post-money.</p>
        </>
      ) : <p className="text-sm text-surface-variant">Renseignez les deux montants pour calculer la répartition.</p>}
    />
  );
}
