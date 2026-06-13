import { AlertTriangle } from 'lucide-react';
import { IKIGAI } from '@/content';
import type { IkigaiMode } from '@/content/types';
import { Reveal } from '@/components/ui/primitives';
import { IkigaiText } from '../IkigaiText';
import { StickyChapterHeader, StickySubsectionHeader, SubsectionArticle, SubsectionTitleRow } from '../cahierUi';
import { ROMAN, WARN } from './shared';

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
      <div className="mt-8 divide-y divide-outline-variant lg:w-[52%]">
        {IKIGAI.presqueIkigai.map((p, i) => {
          const description = mode === 'decouverte' ? p.descriptionDecouverte ?? p.description : p.description;
          const trap = mode === 'decouverte' ? p.trapDecouverte ?? p.trap : p.trap;
          const active = activeId === p.id;
          return (
            <SubsectionArticle key={p.id} id={`ikigai-presque-${p.id}`} active={active} hasActive={!!activeId}>
              <StickySubsectionHeader>
                <SubsectionTitleRow roman={ROMAN[i]} title={p.name} subtitle={p.formula} eyebrow={`manque : ${p.missingDim}`} active={active} />
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
            </SubsectionArticle>
          );
        })}
      </div>
    </section>
  );
}
