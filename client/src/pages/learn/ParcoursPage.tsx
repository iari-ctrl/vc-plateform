import { useState } from 'react';
import { Compass, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PathAtlas } from '@/components/explore/PathAtlas';
import { ParcoursCard } from '@/components/cards';
import { CompassRose } from '@/components/ornaments/Illustrations';
import { cn } from '@/lib/utils';
import {
  PARCOURS,
  FAMILY_ORDER,
  FAMILY_META,
  parcoursByFamily,
  routeForProfile,
  type TimeBudget,
} from '@/content/parcours';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';

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
        to={`/parcours/${p.slug}`}
        className="group relative mt-10 block overflow-hidden rounded-3xl border border-outline-variant p-7 sm:p-8"
        style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${accent} 14%, transparent), transparent 65%)` }}
      >
        <p className="eyebrow flex items-center gap-2"><Sparkles size={13} /> Ton parcours · d’après ton orientation</p>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <KanjiSeal kanji={p.kanji ?? FAMILY_META[p.family].kanji} accent={accent} size={56} />
            <div>
              <h2 className="font-headline text-headline-lg font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{p.title}</h2>
              <p className="mt-1.5 max-w-xl text-sm text-surface-variant">{p.hook}</p>
              {route.cadence && <p className="mt-2 text-xs text-surface-variant">Calibré pour toi : {route.cadence.toLowerCase()}.</p>}
            </div>
          </div>
          <span className="btn-foil shrink-0 self-start sm:self-center">
            Commencer <ArrowRight size={15} />
          </span>
        </div>
        {route.then.length > 0 && (
          <p className="mt-5 border-t border-outline-variant pt-4 text-xs text-surface-variant">
            Puis : {route.then.map((tp) => tp.title).join(' · ')}
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
                className="group cursor-pointer rounded-full transition-transform hover:scale-105 active:scale-95"
                title={mapCollapsed ? "Ouvrir la carte des parcours" : "Rétracter la carte des parcours"}
                aria-label={mapCollapsed ? "Ouvrir la carte des parcours" : "Rétracter la carte des parcours"}
                aria-expanded={!mapCollapsed}
                aria-controls="parcours-map"
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
            id="parcours-map"
            inert={mapCollapsed}
            aria-hidden={mapCollapsed}
            className={cn(
              "transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
              mapCollapsed
                ? "max-h-0 opacity-0 pointer-events-none mt-0"
                : "max-h-[1200px] opacity-100 mt-8"
            )}
          >
            <p className="text-sm text-surface-variant">
              <span className="font-medium text-foreground">La carte des parcours.</span> Chaque sceau est un parcours, placé du rivage des débutants à la haute citadelle des fonds. Pointez-le ou placez-y le focus pour révéler sa destination et ses relations ; sur écran tactile, un premier appui affiche ces relations et le suivant ouvre le parcours. Les étagères ci-dessous restent disponibles pour une navigation directe.
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
        const isCollapsed = collapsedFamilies[family] ?? false;
        const panelId = `parcours-family-${family}`;
        return (
          <section key={family} className="mt-14 scroll-mt-24 border-b border-outline-variant/30 pb-10 last:border-0 last:pb-0" id={family}>
            <Reveal>
              <button
                type="button"
                onClick={() => toggleFamily(family)}
                className="w-full flex items-center gap-4 text-left group cursor-pointer select-none"
                aria-expanded={!isCollapsed}
                aria-controls={panelId}
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
              id={panelId}
              inert={isCollapsed}
              aria-hidden={isCollapsed}
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none mt-0" : "grid-rows-[1fr] opacity-100 mt-6"
              )}
            >
              <div className="overflow-hidden">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-1 pb-1">
                  {items.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 60 + (fi === 0 ? 80 : 0)}>
                      <ParcoursCard parcours={p} variant="catalogue" />
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
          <Link to="/ikigai?test=1" className="btn-ghost">Passer le test</Link>
          <Link to="/bibliotheque" className="btn-quiet">Flâner dans la bibliothèque <ArrowRight size={15} /></Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-surface-variant">{PARCOURS.length} parcours · {FAMILY_ORDER.length} familles · navigation libre</p>
    </div>
  );
}
