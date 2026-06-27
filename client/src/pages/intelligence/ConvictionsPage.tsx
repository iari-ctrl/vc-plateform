import { useMemo, useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { allConvictions, convictionsToReview } from '@/content/convictions';
import { CONVICTION_STRENGTH_META } from '@/content/ecosystems';
import { EmptyState, SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';
import type { ConvictionStrength } from '@/content/types';

type StrengthFilter = 'all' | ConvictionStrength;
type HorizonFilter = 'all' | 'review' | string;

const STRENGTHS: StrengthFilter[] = ['all', 'exploratoire', 'moyenne', 'forte'];

export default function ConvictionsPage() {
  usePageMeta(
    'Registre des convictions',
    'Les convictions publiées dans les dossiers d’écosystème, avec leur force, leur horizon de vérification et leur dossier source.',
  );

  const convictions = useMemo(() => allConvictions(), []);
  const reviewKeys = useMemo(() => new Set(convictionsToReview().map((c) => `${c.ecosystemId}-${c.statement}`)), []);
  const horizons = useMemo(
    () => Array.from(new Set(convictions.map((c) => c.horizon).filter((h): h is string => Boolean(h)))).sort((a, b) => a.localeCompare(b, 'fr')),
    [convictions],
  );
  const [strength, setStrength] = useState<StrengthFilter>('all');
  const [horizon, setHorizon] = useState<HorizonFilter>('all');

  const visible = convictions.filter((conviction) => {
    const key = `${conviction.ecosystemId}-${conviction.statement}`;
    return (
      (strength === 'all' || conviction.strength === strength) &&
      (horizon === 'all' || (horizon === 'review' ? reviewKeys.has(key) : conviction.horizon === horizon))
    );
  });

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Convictions"
          title="Un registre de thèses datées"
          description="Chaque conviction vient d’un dossier source, porte un niveau d’assurance et, lorsque la donnée existe, un horizon de vérification. Le registre sert autant à explorer qu’à revenir juger les hypothèses."
        />
      </Reveal>

      <Reveal delay={80}>
        <section className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-4 sm:p-5" aria-label="Filtres des convictions">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Force de conviction">
              {STRENGTHS.map((id) => {
                const active = strength === id;
                const meta = id === 'all' ? null : CONVICTION_STRENGTH_META[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStrength(id)}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${active ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant hover:text-foreground'}`}
                  >
                    {meta?.label ?? 'Toutes forces'}
                  </button>
                );
              })}
            </div>

            <label className="text-xs font-medium text-surface-variant">
              Horizon
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="ml-0 mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none sm:ml-2 sm:mt-0 sm:w-auto"
              >
                <option value="all">Tous les horizons</option>
                <option value="review">À réviser</option>
                {horizons.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
        </section>
      </Reveal>

      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-surface-variant">
        <span>{visible.length} conviction{visible.length > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><RefreshCw size={14} /> {reviewKeys.size} à réviser</span>
      </div>

      <div className="mt-6 grid gap-4">
        {visible.length === 0 ? (
          <Reveal>
            <EmptyState
              icon={<RefreshCw size={24} />}
              title={horizon === 'review' ? 'Aucune conviction à réviser' : 'Aucune conviction pour ces filtres'}
              description={
                horizon === 'review'
                  ? "Aucune hypothèse n'arrive à échéance dans ce périmètre de filtre."
                  : "Ajustez la force ou l'horizon pour retrouver les convictions du registre."
              }
              action={
                <button
                  type="button"
                  onClick={() => {
                    setStrength('all');
                    setHorizon('all');
                  }}
                  className="btn-ghost !py-2.5"
                >
                  Réinitialiser les filtres
                </button>
              }
            />
          </Reveal>
        ) : (
          visible.map((conviction, i) => {
            const key = `${conviction.ecosystemId}-${conviction.statement}`;
            const meta = CONVICTION_STRENGTH_META[conviction.strength];
            return (
              <Reveal key={key} delay={(i % 6) * 35}>
                <Link
                  to={`/ecosystemes/${conviction.ecosystemSlug}`}
                  className="premium-card premium-card-hover group block p-5"
                  style={{ borderTopColor: `color-mix(in srgb, ${conviction.accent ?? meta.accent} 50%, transparent)`, borderTopWidth: 2 }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{conviction.ecosystemName}</span>
                        <span className="chip" style={{ color: meta.accent }}>{meta.label}</span>
                        {conviction.horizon && <span className="chip">{conviction.horizon}</span>}
                        {reviewKeys.has(key) && <span className="chip !text-[color:var(--primary)]">à réviser</span>}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-surface-variant">{conviction.statement}</p>
                      {conviction.rationale && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-surface-variant">{conviction.rationale}</p>}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[color:var(--primary)]">
                      Dossier source <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })
        )}
      </div>
    </div>
  );
}
