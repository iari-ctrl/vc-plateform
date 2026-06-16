import { useState } from 'react';
import { Clock, Compass, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PathAtlas } from '@/components/explore/PathAtlas';
import { CompassRose } from '@/components/ornaments/Illustrations';
import { cn } from '@/lib/utils';
import {
  PARCOURS,
  FAMILY_ORDER,
  FAMILY_META,
  parcoursByFamily,
  lessonIdsForParcours,
  routeForProfile,
  t,
  type Parcours,
  type TimeBudget,
} from '@/content/parcours';
import { SectionHeading, Reveal, LevelBadge, ProgressRing } from '@/components/ui/primitives';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';

function useParcoursProgress(p: Parcours) {
  const { progress } = useUserData();
  const ids = lessonIdsForParcours(p);
  if (!ids.length) return { pct: 0, started: false };
  const done = ids.filter((id) => progress[id]?.status === 'done').length;
  const started = ids.some((id) => progress[id]);
  return { pct: Math.round((done / ids.length) * 100), started };
}

function ParcoursCard({ parcours }: { parcours: Parcours }) {
  const meta = FAMILY_META[parcours.family];
  const accent = parcours.accent ?? meta.accent;
  const kanji = parcours.kanji ?? meta.kanji;
  const { pct } = useParcoursProgress(parcours);
  const hours = parcours.time.coreHours;

  return (
    <Link
      to={`/paths/${parcours.slug}`}
      className="premium-card premium-card-hover sheen-host group isolate flex h-full flex-col p-6"
      style={{ borderTopColor: `color-mix(in srgb, ${accent} 50%, transparent)`, borderTopWidth: 2 }}
    >
      <span
        aria-hidden
        className="contour-field pointer-events-none absolute -right-10 -top-10 -z-10 h-44 w-44 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ '--contour': accent } as React.CSSProperties}
      />
      <div className="flex items-start justify-between gap-4">
        <KanjiSeal kanji={kanji} accent={accent} size={46} />
        {pct > 0 ? (
          <ProgressRing value={pct} size={40} stroke={3} accent={accent} />
        ) : (
          parcours.roadmap === 'now' && (
            <span className="chip !border-[color-mix(in_srgb,var(--primary)_45%,transparent)] !text-[color:var(--primary)]">Phare</span>
          )
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <LevelBadge level={parcours.level} accent={accent} />
        {parcours.perspective === 'both' && <span className="chip">Les deux sièges</span>}
      </div>
      <h3 className="mt-3 font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
        {t(parcours.title)}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{t(parcours.hook)}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> ≈ {hours} h</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)]">
          {pct > 0 ? 'Reprendre' : 'Commencer'} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/** « Ton parcours » — the ikigai → parcours hand-off, shown when a profile exists. */
function YourParcoursBanner() {
  const { profile } = useUserData();
  const route = routeForProfile(profile?.profileType, profile?.timeBudget as TimeBudget | undefined);
  if (!route?.primary) return null;
  const p = route.primary;
  const accent = p.accent ?? FAMILY_META[p.family].accent;

  return (
    <Reveal>
      <Link
        to={`/paths/${p.slug}`}
        className="group relative mt-10 block overflow-hidden rounded-3xl border border-outline-variant p-7 sm:p-8"
        style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${accent} 14%, transparent), transparent 65%)` }}
      >
        <p className="eyebrow flex items-center gap-2"><Sparkles size={13} /> Ton parcours · d’après ton orientation</p>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <KanjiSeal kanji={p.kanji ?? FAMILY_META[p.family].kanji} accent={accent} size={56} />
            <div>
              <h2 className="font-headline text-headline-lg font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{t(p.title)}</h2>
              <p className="mt-1.5 max-w-xl text-sm text-surface-variant">{t(p.hook)}</p>
              {route.cadence && <p className="mt-2 text-xs text-surface-variant">Calibré pour toi : {route.cadence.toLowerCase()}.</p>}
            </div>
          </div>
          <span className="btn-foil shrink-0 self-start sm:self-center">
            Commencer <ArrowRight size={15} />
          </span>
        </div>
        {route.then.length > 0 && (
          <p className="mt-5 border-t border-outline-variant pt-4 text-xs text-surface-variant">
            Puis : {route.then.map((tp) => t(tp.title)).join(' · ')}
          </p>
        )}
      </Link>
    </Reveal>
  );
}

export default function ParcoursPage() {
  usePageMeta(
    'Parcours · trajectoires par objectif',
    'Choisis une destination — décrocher un entretien, lever ta seed, comprendre le métier — et suis une colonne vertébrale qui compose la bibliothèque pour t’y mener.',
  );

  const [mapCollapsed, setMapCollapsed] = useState(true);
  const [collapsedFamilies, setCollapsedFamilies] = useState<Record<string, boolean>>({});

  const toggleFamily = (family: string) => {
    setCollapsedFamilies((prev) => ({
      ...prev,
      [family]: !prev[family],
    }));
  };

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <section>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Parcours · où veux-tu aller ?"
              title={<>Choisis une <span className="ink-underline">destination</span>, pas un programme</>}
              description="Un parcours est une colonne vertébrale, pas un couloir : il compose la bibliothèque vers un jalon concret et mémorise ta progression, mais tout reste librement explorable. Le temps n’est qu’un curseur — chaque parcours a sa route express."
            />
            <div className="flex shrink-0 items-center gap-4">
              <button
                type="button"
                onClick={() => setMapCollapsed(!mapCollapsed)}
                className="group cursor-pointer transition-transform hover:scale-105 active:scale-95 outline-none rounded-full"
                title={mapCollapsed ? "Ouvrir la carte des parcours" : "Rétracter la carte des parcours"}
                aria-label={mapCollapsed ? "Ouvrir la carte des parcours" : "Rétracter la carte des parcours"}
              >
                <CompassRose size={64} className="opacity-90 sm:hidden" />
                <CompassRose size={88} className="hidden opacity-90 sm:block" />
              </button>
              <a href="#familles" className="btn-quiet">Voir les familles <ArrowRight size={15} /></a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div
            className={cn(
              "transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
              mapCollapsed
                ? "max-h-0 opacity-0 pointer-events-none mt-0"
                : "max-h-[1200px] opacity-100 mt-8"
            )}
          >
            <p className="text-sm text-surface-variant">
              <span className="font-medium text-foreground">La carte des parcours.</span> Chaque sceau est un parcours, placé du rivage des débutants à la haute citadelle des fonds. Survole-le pour révéler sa destination, clique pour mettre le cap — ou choisis ta route dans les étagères ci-dessous.
            </p>
            <PathAtlas className="mt-3" collapsed={mapCollapsed} />
          </div>
        </Reveal>
        <YourParcoursBanner />
      </section>

      <div id="familles" className="scroll-mt-24" aria-hidden />

      {FAMILY_ORDER.map((family, fi) => {
        const items = parcoursByFamily(family);
        if (!items.length) return null;
        const meta = FAMILY_META[family];
        const isCollapsed = collapsedFamilies[family];
        return (
          <section key={family} className="mt-14 scroll-mt-24 border-b border-outline-variant/30 pb-10 last:border-0 last:pb-0" id={family}>
            <Reveal>
              <button
                type="button"
                onClick={() => toggleFamily(family)}
                className="w-full flex items-center gap-4 text-left group cursor-pointer select-none focus:outline-none"
                aria-expanded={!isCollapsed}
              >
                <KanjiSeal kanji={meta.kanji} accent={meta.accent} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline text-headline-lg font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{meta.label}</h2>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "text-surface-variant transition-transform duration-300 group-hover:text-foreground",
                        isCollapsed && "-rotate-90"
                      )}
                    />
                  </div>
                  <p className="mt-0.5 text-sm text-surface-variant leading-relaxed">{meta.tagline}</p>
                </div>
                <span className="shrink-0 hidden font-mono text-xs text-surface-variant sm:block">
                  {items.length} parcours
                </span>
              </button>
            </Reveal>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none mt-0" : "grid-rows-[1fr] opacity-100 mt-6"
              )}
            >
              <div className="overflow-hidden">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-1 pb-1">
                  {items.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 60 + (fi === 0 ? 80 : 0)}>
                      <ParcoursCard parcours={p} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-6">
        <p className="flex items-center gap-3 text-sm text-surface-variant">
          <Compass size={18} className="shrink-0 text-[color:var(--primary)]" />
          Pas sûr d’où commencer ? Le test d’orientation t’aiguille vers le parcours calibré pour toi.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/onboarding" className="btn-ghost">Passer le test</Link>
          <Link to="/bibliotheque" className="btn-quiet">Flâner dans la bibliothèque <ArrowRight size={15} /></Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-surface-variant">{PARCOURS.length} parcours · 7 familles · navigation libre</p>
    </div>
  );
}
