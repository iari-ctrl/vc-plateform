import { AlertTriangle } from 'lucide-react';
import { IKIGAI } from '@/content';
import type { IkigaiMode } from '@/content/types';
import { Reveal } from '@/components/ui/primitives';
import { IkigaiText } from '../IkigaiText';
import { StickyChapterHeader, StickySubsectionHeader } from '../cahierUi';
import { WARN, subsectionAnchorStyle } from './shared';

// ── §03 — Intersections ─────────────────────────────────────────────────────
export function IntersectionsSection({
  mode,
  onMode,
  activeId,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  activeId: string | null;
}) {
  return (
    <section id="ikigai-section-intersections" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="03"
        label="les quatre demi-chemins"
        mode={mode}
        onMode={onMode}
        title="Quatre demi-chemins, et leur zone d'ombre."
        description="Chaque intersection est une combinaison séduisante mais incomplète : elle ressemble à l'ikigai vue de loin, et s'en éloigne dès qu'on la regarde de près."
      />
      <div className="mt-8 w-full divide-y divide-outline-variant">
        {IKIGAI.intersections.map((it, i) => {
          const example = mode === 'decouverte' ? it.exampleDecouverte ?? it.example : it.example;
          const active = activeId === it.id;
          return (
            <article
              key={it.id}
              id={`ikigai-inter-${it.id}`}
              className={`py-7 transition-opacity duration-500 ease-in-out ${activeId && !active ? 'opacity-30' : 'opacity-100'} hover:opacity-100`}
              style={subsectionAnchorStyle}
            >
              <StickySubsectionHeader>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-[color:var(--primary)]">{['I', 'II', 'III', 'IV'][i]}.</span>
                  <h3 className={`font-headline text-headline-md font-semibold transition-colors duration-500 ${active ? 'text-[color:var(--primary)]' : ''}`}>{it.label}</h3>
                  <span className={`font-headline text-sm italic transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/80' : 'text-surface-variant'}`}>{it.subtitle}</span>
                </div>
                <p className={`eyebrow mt-1.5 !tracking-[0.16em] normal-case transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/90' : 'text-surface-variant'}`}>{it.negative}</p>
              </StickySubsectionHeader>
              <Reveal className="mt-3">
                <p className="mt-3 max-w-2xl leading-relaxed">
                  <IkigaiText text={example} mode={mode} />
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm" style={{ color: WARN }}>
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {it.warning}
                </p>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
