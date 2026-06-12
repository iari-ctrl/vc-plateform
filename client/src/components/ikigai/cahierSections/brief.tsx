import { AlertTriangle } from 'lucide-react';
import { IKIGAI } from '@/content';

// ── Bref / Concise View Component ──────────────────────────────────────────
export function BrefIntrospectionView({
  activeId,
  onSelectId,
}: {
  activeId: string | null;
  onSelectId: (id: string | null) => void;
}) {
  return (
    <div className="space-y-10 lg:w-[52%] animate-fade-in">
      {/* Dimensions section */}
      <section className="space-y-4">
        <h3 className="font-headline text-headline-lg font-semibold border-b border-outline-variant pb-2">
          Les 4 Dimensions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {IKIGAI.dimensions.map((d) => {
            const active = activeId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectId(active ? null : d.id)}
                className={`premium-card p-4 text-left transition-all ${
                  active ? 'border-[color:var(--primary)] bg-surface-container-low' : 'hover:bg-surface-container-low/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-headline text-headline-sm font-semibold" style={{ color: d.accent }}>
                    {d.label}
                  </span>
                  <span className="font-headline text-lg italic" style={{ color: d.accent }}>{d.kanji}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-surface-variant list-disc pl-4">
                  {d.itemsDecouverte?.slice(0, 3).map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </section>

      {/* Intersections section */}
      <section className="space-y-4">
        <h3 className="font-headline text-headline-lg font-semibold border-b border-outline-variant pb-2">
          Les Intersections (Pièges)
        </h3>
        <div className="grid gap-3">
          {IKIGAI.intersections.map((it) => {
            const active = activeId === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onSelectId(active ? null : it.id)}
                className={`premium-card p-4 text-left transition-all flex items-start gap-4 ${
                  active ? 'border-[color:var(--primary)] bg-surface-container-low' : 'hover:bg-surface-container-low/50'
                }`}
              >
                <span className="font-mono text-xs text-[color:var(--primary)] mt-1">▲</span>
                <div>
                  <h4 className="font-headline font-semibold text-[0.95rem]">{it.label} <span className="text-xs text-surface-variant font-normal">({it.subtitle})</span></h4>
                  <p className="text-xs text-surface-variant mt-1 italic">{it.negative}</p>
                  <p className="text-xs text-[color:var(--error)] mt-1 flex items-center gap-1.5"><AlertTriangle size={11} /> {it.warning}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Traps (Presque-ikigai) */}
      <section className="space-y-4">
        <h3 className="font-headline text-headline-lg font-semibold border-b border-outline-variant pb-2">
          Les Presque-Ikigai (3/4)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {IKIGAI.presqueIkigai.map((p) => {
            const active = activeId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectId(active ? null : p.id)}
                className={`premium-card p-4 text-left transition-all ${
                  active ? 'border-[color:var(--primary)] bg-surface-container-low' : 'hover:bg-surface-container-low/50'
                }`}
              >
                <h4 className="font-headline font-semibold text-[0.95rem] flex justify-between">
                  <span>{p.name}</span>
                  <span className="font-headline text-sm italic">{p.kanji}</span>
                </h4>
                <p className="text-[0.625rem] text-[color:var(--primary)] font-mono mt-1 uppercase tracking-wider">Manque : {p.missingDim}</p>
                <p className="text-xs text-surface-variant mt-2 line-clamp-3">{p.descriptionDecouverte ?? p.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
