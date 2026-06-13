import { ArrowRight } from 'lucide-react';
import { IKIGAI } from '@/content';
import type { IkigaiMode } from '@/content/types';
import { Reveal } from '@/components/ui/primitives';
import { useTheme } from '@/context/ThemeContext';
import { legibleAccent } from '@/lib/ikigaiColor';
import { IkigaiText } from '../IkigaiText';
import { StickyChapterHeader, StickySubsectionHeader, SubsectionArticle } from '../cahierUi';
import { ROMAN } from './shared';

// ── §02 — Dimensions ────────────────────────────────────────────────────────
export function DimensionsSection({
  mode,
  onMode,
  activeDim,
  onSelectDim,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  activeDim: string | null;
  onSelectDim: (id: string) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <section id="ikigai-section-dimensions" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="02"
        label="les quatre dimensions"
        mode={mode}
        onMode={onMode}
        title="Ce qu'une personne passionnée de capital-risque peut y placer."
        description="Survolez le diagramme plus haut pour naviguer — ou lisez les quatre dimensions dans l'ordre."
      />
      <div className="mt-8 divide-y divide-outline-variant lg:w-[52%]">
        {IKIGAI.dimensions.map((d, i) => {
          const items = mode === 'decouverte' ? d.itemsDecouverte ?? d.items : d.items;
          const active = activeDim === d.id;
          const accent = legibleAccent(d.accent, dark);
          return (
            <SubsectionArticle key={d.id} id={`ikigai-dim-${d.id}`} active={active} hasActive={!!activeDim}>
              <StickySubsectionHeader>
                <button
                  type="button"
                  onClick={() => onSelectDim(d.id)}
                  aria-pressed={active}
                  className="group flex w-full items-center gap-3 text-left"
                >
                  <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-xs" style={{ color: active ? accent : 'var(--primary)' }}>
                      {ROMAN[i]}.
                    </span>
                    <h3 className="font-headline text-headline-md font-semibold transition-colors" style={active ? { color: accent } : undefined}>
                      {d.label}
                    </h3>
                    <span className="font-headline text-lg italic" style={{ color: accent }}>
                      {d.kanji}
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-surface-variant transition-colors group-hover:text-foreground"
                    style={active ? { color: accent } : undefined}
                  />
                </button>
              </StickySubsectionHeader>
              <Reveal className="mt-3">
                <ul className="max-w-2xl space-y-2.5">
                  {items.map((it, idx) => (
                    <li key={idx} className="flex gap-2.5 leading-relaxed text-surface-variant">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                      <span>
                        <IkigaiText text={it} mode={mode} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </SubsectionArticle>
          );
        })}
      </div>
    </section>
  );
}
