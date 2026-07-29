import { AlertTriangle } from 'lucide-react';
import { IKIGAI } from '@/content';
import type { IkigaiMode } from '@/content/types';
import { Reveal } from '@/components/ui/primitives';
import { IkigaiText } from '../IkigaiText';
import { StickyChapterHeader, StickySubsectionHeader } from '../cahierUi';
import { WARN, subsectionAnchorStyle } from './shared';

// ── §03.b — Presque-ikigai ──────────────────────────────────────────────────
export function PresqueSection({
  mode,
  onMode,
  activeId,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  activeId: string | null;
}) {
  return (
    <section id="ikigai-section-presque" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="03.b"
        label="les quatre presque-ikigai"
        mode={mode}
        onMode={onMode}
        title="Le piège des trois-sur-quatre."
        description="Trois dimensions convergent — de l'extérieur, ça ressemble à une vie réussie. Mais une seule manque, et c'est précisément celle qu'on met le plus longtemps à nommer."
      />
      <div className="mt-8 w-full divide-y divide-outline-variant">
        {IKIGAI.presqueIkigai.map((p, i) => {
          const description = mode === 'decouverte' ? p.descriptionDecouverte ?? p.description : p.description;
          const trap = mode === 'decouverte' ? p.trapDecouverte ?? p.trap : p.trap;
          const active = activeId === p.id;
          return (
            <article
              key={p.id}
              id={`ikigai-presque-${p.id}`}
              className={`py-7 transition-opacity duration-500 ease-in-out ${activeId && !active ? 'opacity-30' : 'opacity-100'} hover:opacity-100`}
              style={subsectionAnchorStyle}
            >
              <StickySubsectionHeader>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-[color:var(--primary)]">{['I', 'II', 'III', 'IV'][i]}.</span>
                  <h3 className={`font-headline text-headline-md font-semibold transition-colors duration-500 ${active ? 'text-[color:var(--primary)]' : ''}`}>{p.name}</h3>
                  <span className={`font-headline text-sm italic transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/80' : 'text-surface-variant'}`}>{p.formula}</span>
                </div>
                <p className={`eyebrow mt-1.5 !tracking-[0.16em] normal-case transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/90' : 'text-surface-variant'}`}>manque : {p.missingDim}</p>
              </StickySubsectionHeader>
              <Reveal className="mt-3">
                <p className="mt-3 max-w-2xl leading-relaxed">
                  <IkigaiText text={description} mode={mode} />
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm" style={{ color: WARN }}>
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  <span>
                    <IkigaiText text={trap} mode={mode} />
                  </span>
                </p>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
