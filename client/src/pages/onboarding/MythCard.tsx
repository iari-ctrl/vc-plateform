import { useState } from 'react';
import type { IkigaiMyth } from '@/content/types';

export function MythCard({ myth }: { myth: IkigaiMyth }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className={`relative h-64 w-full rounded-2xl border text-left transition-all duration-300 ${
        flipped
          ? 'border-[color:var(--primary)] bg-surface-container-low'
          : 'border-outline-variant hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] bg-surface-container-lowest shadow-editorial-xs'
      }`}
    >
      <div
        className="absolute inset-0 flex flex-col justify-between p-5"
        style={{ display: flipped ? 'none' : 'flex' }}
      >
        <div>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-surface-variant">Idée reçue ({myth.fundExample})</span>
          <h4 className="font-headline text-headline-sm font-semibold mt-1" style={{ color: 'var(--primary)' }}>
            {myth.title}
          </h4>
          <p className="text-xs text-surface-variant mt-3 italic leading-relaxed">
            « {myth.myth} »
          </p>
        </div>
        <span className="text-[0.625rem] font-mono text-[color:var(--primary)] uppercase tracking-wider self-end">Découvrir la réalité →</span>
      </div>
      <div
        className="absolute inset-0 flex flex-col justify-between p-5 animate-fade-in"
        style={{ display: flipped ? 'flex' : 'none' }}
      >
        <div>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[color:var(--primary)]">La réalité du terrain</span>
          <p className="text-xs leading-relaxed text-foreground mt-2">
            {myth.reality}
          </p>
        </div>
        <span className="text-[0.625rem] font-mono text-surface-variant uppercase tracking-wider self-end">← Retour</span>
      </div>
    </button>
  );
}
