import { useCallback, useMemo, useRef, useState } from 'react';
import { ArrowRight, Compass, Map as MapIcon, RotateCcw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import type { PathAtlas as PathAtlasComponent } from '@/components/explore/PathAtlas';
import { ParcoursRow } from '@/components/cards';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { EmptyState, ProgressBar, Reveal, SectionHeading, Spinner } from '@/components/ui/primitives';
import { FAMILY_META, parcoursContextHref } from '@/content/parcours';
import { useUserData } from '@/context/UserDataContext';
import { useLearningWorkspace } from '@/lib/learningWorkspace';
import { useParcoursMorph } from '@/lib/parcoursMorph';
import {
  FAMILY_FILTER_OPTIONS,
  groupParcoursByFamily,
  parcoursIndexHref,
  parseParcoursIndexFilters,
} from '@/lib/parcoursIndex';
import {
  buildParcoursSummaries,
  selectParcoursResume,
  TIME_BUDGET_OPTIONS,
  type ParcoursSummaries,
} from '@/lib/parcoursResume';
import { usePageMeta } from '@/lib/seo';
import { cn, pluralize } from '@/lib/utils';

/** La pilule de filtre, dans le vocabulaire du curseur de `ParcoursDetailPage`. */
const pill = (active: boolean) => cn(
  'rounded-full border px-3.5 py-2 text-xs font-medium transition-colors',
  active
    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
    : 'border-outline-variant text-surface-variant hover:text-foreground',
);

const accentFor = (parcours: { accent?: string; family: keyof typeof FAMILY_META }) =>
  parcours.accent ?? FAMILY_META[parcours.family].accent;

/**
 * « Où en suis-je ? » — un seul emplacement, trois états.
 *
 * Il remplace l'ancien bandeau de recommandation et le bandeau d'appel en pied
 * de page : la même question posée deux fois, à deux endroits, avec deux
 * réponses différentes. La transition du sceau n'opère pas ici — c'est un geste
 * de liste, et deux sceaux portant le même nom avorteraient la transition.
 */
function ResumeSlot({ summaries }: { summaries: ParcoursSummaries }) {
  const { profile } = useUserData();
  const workspace = useLearningWorkspace();
  const resume = useMemo(
    () => selectParcoursResume(profile, summaries, workspace),
    [profile, summaries, workspace],
  );

  if (resume.kind === 'cold') {
    return (
      <Reveal>
        <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-outline-variant/50 py-5">
          <p className="flex min-w-0 flex-1 items-center gap-3 text-sm text-surface-variant">
            <Compass size={17} aria-hidden className="shrink-0 text-[color:var(--primary)]" />
            Vous ne savez pas par où commencer&nbsp;? Le test d’orientation mène au parcours calibré
            pour votre profil et le temps dont vous disposez.
          </p>
          <Link to="/ikigai?test=1" className="btn-ghost shrink-0">Passer le test d’orientation</Link>
        </div>
      </Reveal>
    );
  }

  const { parcours } = resume;
  const accent = accentFor(parcours);
  const seal = <KanjiSeal kanji={parcours.kanji ?? FAMILY_META[parcours.family].kanji} accent={accent} size={52} />;

  return (
    <Reveal>
      <section
        aria-labelledby="parcours-resume-title"
        className="mt-9 rounded-2xl border border-outline-variant p-6 sm:p-7"
        style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${accent} 13%, transparent), transparent 65%)` }}
      >
        <p className="eyebrow">
          {resume.kind === 'resume' ? 'Vous reprenez ici' : 'Votre parcours · d’après votre orientation'}
        </p>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {seal}
            <div className="min-w-0">
              <h2 id="parcours-resume-title" className="font-headline text-headline-lg font-semibold leading-tight">
                {parcours.title}
              </h2>

              {resume.kind === 'resume' ? (
                <>
                  {resume.summary.resumeStep && (
                    <p className="mt-1.5 text-sm text-surface-variant">
                      Prochaine étape&nbsp;: {resume.summary.resumeStep.label}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar
                      value={resume.summary.percent}
                      accent={accent}
                      className="w-32 sm:w-40"
                      label={`Progression du parcours ${parcours.title}`}
                    />
                    <span className="font-mono text-xs text-surface-variant">
                      {resume.summary.completedSteps}/{resume.summary.totalSteps} étapes
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1.5 max-w-xl text-sm text-surface-variant">{parcours.hook}</p>
                  {resume.cadence && (
                    <p className="mt-2 text-xs text-surface-variant">
                      Calibré pour vous&nbsp;: {resume.cadence.toLowerCase()}.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {resume.kind === 'resume' ? (
              <>
                <Link
                  to={resume.summary.resumeHref
                    ? parcoursContextHref(resume.summary.resumeHref, parcours.id, resume.summary.budget)
                    : `/parcours/${parcours.slug}`}
                  className="btn-foil"
                >
                  Reprendre <ArrowRight size={15} />
                </Link>
                <Link to={`/parcours/${parcours.slug}`} className="btn-quiet">Voir le parcours</Link>
              </>
            ) : (
              <Link to={`/parcours/${parcours.slug}`} className="btn-foil">
                Commencer <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>

        {resume.kind === 'recommended' && resume.then.length > 0 && (
          <p className="mt-5 border-t border-outline-variant pt-4 text-xs text-surface-variant">
            Ensuite&nbsp;: {resume.then.map((next) => next.title).join(' · ')}
          </p>
        )}
      </section>
    </Reveal>
  );
}

/**
 * La carte n'est plus montée avant d'être demandée.
 *
 * Elle pesait deux cents nœuds SVG, sa feuille de style et son fond nocturne à
 * chaque visite, repliée, y compris dans le HTML prérendu. Trois précautions
 * préservent la chorégraphie d'encrage telle qu'elle a été écrite :
 * l'import est manuel plutôt que `React.lazy`, qui imposerait une frame de repli
 * au moment précis où l'enveloppe démarre ; le premier rendu se fait replié puis
 * bascule à la frame suivante, faute de quoi montage et ouverture atterriraient
 * dans le même commit et la planche n'aurait pas à reculer ; et le composant
 * n'est plus jamais démonté, ce que `parcours-atlas.css` exige pour rejouer la
 * séquence sans remontage.
 */
function useAtlas() {
  const [Atlas, setAtlas] = useState<typeof PathAtlasComponent | null>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef<Promise<void> | null>(null);

  const preload = useCallback(() => {
    if (Atlas) return Promise.resolve();
    if (!pending.current) {
      setFailed(false);
      pending.current = import('@/components/explore/PathAtlas')
        .then((module) => { setAtlas(() => module.PathAtlas); })
        .catch(() => { pending.current = null; setFailed(true); });
    }
    return pending.current;
  }, [Atlas]);

  const toggle = useCallback(async () => {
    if (open) { setOpen(false); return; }
    await preload();
    requestAnimationFrame(() => setOpen(true));
  }, [open, preload]);

  return { Atlas, open, failed, preload, toggle };
}

export default function ParcoursPage() {
  usePageMeta(
    'Parcours · trajectoires par objectif',
    'Choisissez une destination — décrocher un entretien, préparer une levée, comprendre le métier — puis suivez la trajectoire de leçons et de cas qui y mène.',
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseParcoursIndexFilters(searchParams);
  const { progress, profile } = useUserData();
  const workspace = useLearningWorkspace();
  const { morphSlug, openParcours } = useParcoursMorph();
  const atlas = useAtlas();

  const summaries = useMemo(
    () => buildParcoursSummaries(progress, workspace, filters.budgetExplicit ? filters.budget : profile?.timeBudget),
    [progress, workspace, filters.budgetExplicit, filters.budget, profile?.timeBudget],
  );

  const groups = useMemo(
    () => groupParcoursByFamily(filters.family, filters.budget),
    [filters.family, filters.budget],
  );
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  const updateFilter = (key: 'family' | 'budget', value: string, defaultValue: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!value || value === defaultValue) next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const resetFilters = () => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete('family');
      next.delete('budget');
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <SectionHeading
            as="h1"
            className="max-w-3xl"
            eyebrow="Parcours · où voulez-vous aller ?"
            title={<>Choisissez une <span className="ink-underline">destination</span>, pas un programme</>}
            description="Un parcours enchaîne des leçons, des cas et des simulateurs de la bibliothèque jusqu’à un jalon concret, et retient votre progression. Rien n’est verrouillé : vous pouvez sauter une étape, ou suivre la version courte quand le temps manque."
          />
          <button
            type="button"
            onClick={atlas.toggle}
            onPointerEnter={atlas.preload}
            onFocus={atlas.preload}
            aria-expanded={atlas.open}
            aria-controls="parcours-map"
            className="btn-quiet group shrink-0"
          >
            <MapIcon size={15} aria-hidden className="transition-colors group-hover:text-[color:var(--primary)]" />
            {atlas.open ? 'Masquer la carte' : 'Voir la carte des parcours'}
          </button>
        </div>
      </Reveal>

      <div
        id="parcours-map"
        inert={!atlas.open}
        className={cn(
          // Le papier se déroule en 560 ms ; la planche s'encre ensuite depuis
          // `--atlas-t0` (voir parcours-atlas.css).
          'overflow-hidden transition-all duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          atlas.open ? 'mt-8 max-h-[1200px] opacity-100' : 'mt-0 max-h-0 opacity-0',
        )}
      >
        {atlas.Atlas ? (
          <atlas.Atlas collapsed={!atlas.open} />
        ) : atlas.failed ? (
          <p className="flex items-center justify-center gap-4 py-12 text-sm text-surface-variant">
            La carte n’a pas pu être chargée.
            <button type="button" onClick={atlas.toggle} className="btn-quiet">Réessayer</button>
          </p>
        ) : (
          <div className="grid place-items-center py-16"><Spinner /></div>
        )}
      </div>

      <ResumeSlot summaries={summaries} />

      <section aria-label="Filtrer les parcours" className="sticky top-14 z-30 -mx-4 mt-10 border-y border-outline-variant/60 bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-2 lg:rounded-xl lg:border lg:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Destination">
            {FAMILY_FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateFilter('family', option.id, 'all')}
                aria-pressed={filters.family === option.id}
                className={pill(filters.family === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Niveau d’approfondissement">
            {TIME_BUDGET_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateFilter('budget', option.id, 'high')}
                aria-pressed={filters.budget === option.id}
                title={option.sub}
                className={pill(filters.budget === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <p aria-live="polite" className="mt-2.5 font-mono text-xs text-surface-variant">
          {pluralize(total, 'parcours', 'parcours')}
        </p>
      </section>

      {total === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={<Compass size={26} />}
            title="Aucun parcours avec ces réglages"
            description="Cette destination n’a pas de parcours à ce niveau d’approfondissement."
            action={
              <button type="button" onClick={resetFilters} className="btn-ghost">
                <RotateCcw size={15} aria-hidden /> Réinitialiser les filtres
              </button>
            }
          />
        </div>
      ) : (
        groups.map(({ family, items }) => {
          if (!items.length) return null;
          const meta = FAMILY_META[family];
          return (
            <Reveal key={family}>
              <section id={family} className="mt-12 scroll-mt-40 lg:scroll-mt-28">
                <div className="flex items-baseline gap-3 border-b border-outline-variant/40 pb-3">
                  <h2 className="font-headline text-headline-lg font-semibold leading-tight">{meta.label}</h2>
                  <p className="hidden min-w-0 flex-1 truncate text-sm text-surface-variant sm:block">{meta.tagline}</p>
                  <span className="ml-auto shrink-0 font-mono text-xs text-surface-variant sm:ml-0">{items.length}</span>
                </div>
                <ul role="list" className="mt-2 divide-y divide-outline-variant/30">
                  {items.map((parcours) => {
                    const href = parcoursIndexHref(parcours, filters);
                    return (
                      <ParcoursRow
                        key={parcours.id}
                        parcours={parcours}
                        summary={summaries.get(parcours.id)!}
                        href={href}
                        morph={morphSlug === parcours.slug}
                        onOpen={() => openParcours(parcours.slug, href)}
                      />
                    );
                  })}
                </ul>
              </section>
            </Reveal>
          );
        })
      )}
    </div>
  );
}
