import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IKIGAI, profileById } from '@/content';
import type { IkigaiArchetype, IkigaiMode } from '@/content/types';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { Reveal } from '@/components/ui/primitives';
import { archetypePaths } from '@/lib/ikigai';
import { IkigaiText } from '../IkigaiText';
import { StickyChapterHeader } from '../cahierUi';

// ── §04 — Archétypes ──────────────────────────────────────────────────────────
export function ArchetypesSection({
  mode,
  onMode,
  chosen,
  onChoose,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  chosen: string | null;
  onChoose: (id: string | null) => void;
}) {
  return (
    <section id="ikigai-section-archetypes" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="04"
        label="trois archétypes au centre"
        mode={mode}
        onMode={onMode}
        title="Trois portraits possibles, au centre du diagramme."
        description="Ces archétypes ne sont pas étanches — une trajectoire réelle emprunte à deux d'entre eux. Choisissez celui qui vous parle pour le relier à vos profils et parcours recommandés."
      />
      <div className="mt-8 space-y-4">
        {IKIGAI.archetypes.map((a) => (
          <ArchetypeCard
            key={a.id}
            a={a}
            mode={mode}
            open={chosen === a.id}
            onToggle={() => onChoose(chosen === a.id ? null : a.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ArchetypeCard({
  a,
  mode,
  open,
  onToggle,
}: {
  a: IkigaiArchetype;
  mode: IkigaiMode;
  open: boolean;
  onToggle: () => void;
}) {
  const positioning = mode === 'decouverte' ? a.positioningDecouverte : a.positioning;
  const day = mode === 'decouverte' ? a.dayDecouverte : a.day;
  const value = mode === 'decouverte' ? a.valueDecouverte : a.value;
  const signals = mode === 'decouverte' ? a.signalsDecouverte : a.signals;
  const relatedProfiles = a.profileIds.map((id) => profileById(id)).filter(Boolean);
  const paths = archetypePaths(a);

  return (
    <Reveal>
      <div
        className="premium-card overflow-hidden"
        style={open ? { borderColor: `color-mix(in srgb, ${a.accent} 50%, transparent)` } : undefined}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center gap-4 p-6 text-left"
        >
          <KanjiSeal kanji={a.kanji} accent={a.accent} size={52} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">{a.tag}</p>
            <h3 className="font-headline text-headline-md font-semibold" style={{ color: a.accent }}>
              {a.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-surface-variant">
              <IkigaiText text={positioning} mode={mode} />
            </p>
          </div>
          <span className="shrink-0 self-start font-mono text-xs text-[color:var(--primary)]">{open ? '●' : '○'}</span>
        </button>

        {open && (
          <div className="animate-fade-in border-t border-outline-variant px-6 pb-6 pt-5">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="eyebrow mb-3">Une semaine type</p>
                <ul className="space-y-2.5">
                  {day.map((d, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <span className="w-16 shrink-0 pt-0.5 font-mono text-[0.6875rem] text-surface-variant">{d.time}</span>
                      <span className="text-surface-variant">
                        <IkigaiText text={d.text} mode={mode} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-3">Valeur créée</p>
                <p className="text-sm leading-relaxed text-surface-variant">
                  <IkigaiText text={value} mode={mode} />
                </p>
                {mode === 'avance' && (
                  <>
                    <p className="eyebrow mb-2.5 mt-6">Métriques de référence</p>
                    <div className="flex flex-wrap gap-2">
                      {a.metrics.map((m, i) => (
                        <span key={i} className="chip font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-5">
              <p className="eyebrow mb-3">Signaux — vous vous en rapprochez si…</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {signals.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-surface-variant">
                    <span className="mt-0.5 font-headline italic" style={{ color: a.accent }}>
                      →
                    </span>
                    <span>
                      <IkigaiText text={s} mode={mode} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-4 border-t border-outline-variant pt-5 sm:grid-cols-2">
              {relatedProfiles.length > 0 && (
                <div>
                  <p className="eyebrow mb-2.5">Profils d'apprentissage reliés</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedProfiles.map((p) => (
                      <span key={p!.id} className="chip">
                        {p!.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {paths.length > 0 && (
                <div>
                  <p className="eyebrow mb-2.5">Parcours recommandés</p>
                  <div className="space-y-1.5">
                    {paths.map((p) => (
                      <Link
                        key={p!.id}
                        to={`/parcours/${p!.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-outline-variant px-3 py-2 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low"
                      >
                        <span className="truncate">{p.title}</span>
                        <ArrowRight size={14} className="shrink-0 text-surface-variant" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}
