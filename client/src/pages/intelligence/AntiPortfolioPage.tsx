import { useSearchParams } from 'react-router-dom';
import { Ghost, Scale } from 'lucide-react';
import { ANTI_PORTFOLIO, ANTI_PORTFOLIO_PATTERNS } from '@/content/antiPortfolio';
import { AntiPortfolioEntryCard } from '@/components/cards';
import { WaxSeal } from '@/components/ornaments/Illustrations';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

export default function AntiPortfolioPage() {
  usePageMeta(
    'Anti-portfolio — analyse des passes',
    'Pourquoi les meilleurs fonds ont passé sur les plus grands winners : info disponible à l’époque, signal raté, contre-argument honnête. Sources publiques.',
  );
  const [params, setParams] = useSearchParams();
  const activePattern = params.get('pattern');

  const entries = activePattern
    ? ANTI_PORTFOLIO.filter((e) => e.patternIds.includes(activePattern))
    : ANTI_PORTFOLIO;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Anti-portfolio"
          title="Les chefs-d'œuvre qu'on a laissés passer"
          description="Bessemer tient l'anti-portfolio de ses propres erreurs ; personne ne le fait en analyse tierce. Pour chaque pass célèbre : ce qui était publiquement connaissable au moment de la décision, la raison du refus, le signal raté — et le contre-argument honnête, parce que juger ex post sans steelman n'est pas du jugement, c'est du confort."
        />
      </Reveal>

      <Reveal delay={80}>
        <aside className="mt-7 flex items-start gap-3 rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5 text-sm leading-relaxed text-surface-variant">
          <Scale size={16} className="mt-0.5 shrink-0 text-[color:var(--primary)]" />
          <p>
            <strong className="font-medium text-foreground">Méthode.</strong> Tout ici repose sur des sources publiques, citées en bas de chaque fiche. Les
            citations sont reproduites telles quelles ; les chiffres de « coût du pass » sont des estimations indicatives, signalées comme telles. Et une
            règle d'or traverse toute la série : <em>certains passes étaient les bonnes décisions</em> — on juge le raisonnement disponible à l'époque, jamais
            le seul résultat.
          </p>
        </aside>
      </Reveal>

      {/* Pattern taxonomy — filters + standalone reading grid */}
      <Reveal delay={140} className="mt-10">
        <p className="eyebrow mb-4">Cinq familles d'erreur</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ANTI_PORTFOLIO_PATTERNS.map((p) => {
            const active = activePattern === p.id;
            const count = ANTI_PORTFOLIO.filter((e) => e.patternIds.includes(p.id)).length;
            return (
              <button
                key={p.id}
                onClick={() => setParams(active ? {} : { pattern: p.id }, { replace: true })}
                aria-pressed={active}
                className={cn(
                  'group flex flex-col items-start rounded-2xl border p-4 text-left transition-all',
                  active
                    ? 'border-[color-mix(in_srgb,var(--primary)_50%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-[color-mix(in_srgb,var(--primary)_30%,transparent)]',
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <WaxSeal glyph={p.glyph} accent={p.accent} size={34} />
                  <span className="font-mono text-[0.625rem] text-surface-variant">{count}</span>
                </span>
                <span className="mt-3 text-sm font-semibold leading-snug">{p.label}</span>
                <span className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-surface-variant">{p.description}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <Reveal key={entry.id} delay={(i % 3) * 70}>
            <AntiPortfolioEntryCard entry={entry} />
          </Reveal>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-outline-variant py-16 text-center text-sm text-surface-variant">
          <Ghost size={22} className="mb-3" />
          Aucune fiche pour ce pattern — encore.
        </div>
      )}
    </div>
  );
}
