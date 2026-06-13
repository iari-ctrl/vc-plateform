import type { ReactNode } from 'react';

export type SimulatorComponent = ({ accent }: { accent: string }) => ReactNode;

export function Field({ label, suffix, value, onChange, step = 1, min = 0 }: { label: string; suffix?: string; value: number; onChange: (v: number) => void; step?: number; min?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-surface-variant">
        <span>{label}</span>
        {suffix && <span className="font-mono">{suffix}</span>}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-[color:var(--primary)] focus:bg-surface-container-lowest"
      />
    </label>
  );
}

export function Slider({ label, value, onChange, min, max, step = 1, format }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format: (v: number) => string }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-surface-variant">
        <span>{label}</span>
        <span className="font-mono text-foreground">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-[color:var(--primary)]" />
    </label>
  );
}

export function Stat({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <p className="text-[0.625rem] uppercase tracking-wider text-surface-variant">{label}</p>
      <p className="mt-1 font-headline text-headline-md font-semibold" style={{ color: accent }}>{value}</p>
      {hint && <p className="mt-0.5 text-[0.625rem] text-surface-variant">{hint}</p>}
    </div>
  );
}

export function Panel({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div className="space-y-4 rounded-2xl border border-outline-variant bg-surface-container-low/50 p-6">
        <p className="eyebrow">Paramètres</p>
        {inputs}
      </div>
      <div className="space-y-4">{results}</div>
    </div>
  );
}
