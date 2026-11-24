import { useId, useRef, type ReactNode } from 'react';

export type SimulatorComponent = ({ accent }: { accent: string }) => ReactNode;

const finiteAtLeast = (value: number, min: number): number => (
  Number.isFinite(value) ? Math.max(min, value) : min
);

interface FieldProps {
  label: string;
  suffix?: string;
  description?: string;
  error?: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  disabled?: boolean;
  readOnly?: boolean;
}

export function Field({
  label,
  suffix,
  description,
  error,
  value,
  onChange,
  step = 1,
  min = 0,
  disabled = false,
  readOnly = false,
}: FieldProps) {
  const inputId = useId();
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="block">
      <label htmlFor={inputId} className="mb-1.5 flex items-center justify-between text-xs font-medium text-surface-variant">
        <span>{label}</span>
        {suffix && <span className="font-mono">{suffix}</span>}
      </label>
      <input
        id={inputId}
        type="number"
        value={finiteAtLeast(value, min)}
        min={min}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(finiteAtLeast(Number.parseFloat(e.target.value), min))}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-[color:var(--primary)] focus:bg-surface-container-lowest disabled:cursor-not-allowed disabled:opacity-60 read-only:bg-surface-container"
      />
      {description && <p id={descriptionId} className="mt-1.5 text-[0.6875rem] leading-snug text-surface-variant">{description}</p>}
      {error && <p id={errorId} className="mt-1.5 text-[0.6875rem] leading-snug text-error">{error}</p>}
    </div>
  );
}

export function Slider({ label, value, onChange, min, max, step = 1, format }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format: (v: number) => string }) {
  const inputId = useId();
  const boundedValue = Math.min(max, finiteAtLeast(value, min));
  return (
    <div className="block">
      <label htmlFor={inputId} className="mb-1.5 flex items-center justify-between text-xs font-medium text-surface-variant">
        <span>{label}</span>
        <span className="font-mono text-foreground">{format(boundedValue)}</span>
      </label>
      <input id={inputId} type="range" min={min} max={max} step={step} value={boundedValue} onChange={(e) => onChange(finiteAtLeast(Number.parseFloat(e.target.value), min))} className="w-full accent-[color:var(--primary)]" />
    </div>
  );
}

export function Stat({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <p className="text-[0.625rem] uppercase tracking-wider text-surface-variant">{label}</p>
      <p className="mt-1 font-headline text-headline-md font-semibold" style={{ color: accent && `color-mix(in srgb, ${accent} 55%, var(--on-surface))` }}>{value}</p>
      {hint && <p className="mt-0.5 text-[0.625rem] text-surface-variant">{hint}</p>}
    </div>
  );
}

export function Panel({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  function showResults() {
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <section aria-labelledby="saisie" className="min-w-0 self-start space-y-4 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="saisie" className="font-headline text-headline-md font-semibold">Saisie</h2>
          <button type="button" onClick={showResults} className="text-sm text-primary underline underline-offset-4 lg:hidden">Voir les résultats</button>
        </div>
        {inputs}
      </section>
      <section aria-labelledby="resultats" className="min-w-0 space-y-4">
        <h2 id="resultats" ref={resultsHeading} tabIndex={-1} className="scroll-mt-20 font-headline text-headline-md font-semibold">Résultats</h2>
        {results}
      </section>
    </div>
  );
}
