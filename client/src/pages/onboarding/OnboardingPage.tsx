import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Compass, ClipboardList } from 'lucide-react';
import { IKIGAI } from '@/content';
import { IkigaiAtlasDiagram } from '@/components/ikigai/IkigaiAtlasDiagram';
import { ReadingLevelLegend, StickyChapterHeader, ThreeModeSelector } from '@/components/ikigai/cahierUi';
import {
  DimensionsSection,
  IntersectionsSection,
  PresqueSection,
  ArchetypesSection,
  ReflectionSection,
  BrefIntrospectionView,
  InteractifIntrospectionView,
} from '@/components/ikigai/CahierSections';
import { Fleuron, FleuronDivider } from '@/components/ornaments/Ornaments';
import { NightSkyBackdrop } from '@/components/ornaments/Illustrations';
import { Reveal } from '@/components/ui/primitives';
import {
  getReadingMode,
  setReadingMode,
  getChosenArchetype,
  setChosenArchetype,
} from '@/lib/ikigaiCahier';
import { usePageMeta } from '@/lib/seo';
import { OrientationTest } from './OrientationTest';
import { MythCard } from './MythCard';
import { useIkigaiScrollPinning } from './useIkigaiScrollPinning';
import { useOnboardingMode } from './useOnboardingMode';
import type { IkigaiMode } from '@/content/types';

type SectionKey = 'dims' | 'inters' | 'presque' | 'archetypes' | 'reflection';

export default function OnboardingPage() {
  usePageMeta(
    'Cahier Ikigai — introspection avant les cours',
    'Un cahier d’introspection inspiré de l’ikigai pour comprendre pourquoi le capital-risque vous attire, explorer 13 zones de sens et révéler votre profil d’apprentissage.',
  );
  const [onboardingMode, setOnboardingMode] = useOnboardingMode();

  // The quiz phase + step live in the URL (`?test=1&q=N`) so the browser Back
  // button, refresh and shared links resume exactly where the user was.
  const [params, setParams] = useSearchParams();
  const phase: 'cahier' | 'quiz' = params.get('test') === '1' ? 'quiz' : 'cahier';
  const enterQuiz = () =>
    setParams((p) => {
      p.set('test', '1');
      p.set('q', '0');
      return p;
    });
  const exitQuiz = () =>
    setParams(
      (p) => {
        p.delete('test');
        p.delete('q');
        return p;
      },
      { replace: true },
    );

  const initialMode = getReadingMode();
  const [modes, setModes] = useState<Record<SectionKey, IkigaiMode>>({
    dims: initialMode,
    inters: initialMode,
    presque: initialMode,
    archetypes: initialMode,
    reflection: initialMode,
  });
  const setMode = (k: SectionKey) => (m: IkigaiMode) => setModes((cur) => ({ ...cur, [k]: m }));
  const setAllModes = (m: IkigaiMode) => {
    setModes({ dims: m, inters: m, presque: m, archetypes: m, reflection: m });
    setReadingMode(m);
  };

  const [activeDim, setActiveDim] = useState<string | null>(null);
  const [chosenArchetype, setChosen] = useState<string | null>(() => getChosenArchetype());

  const { pinContainerRef, scrollContentRef, scrollTo, handleRegion } = useIkigaiScrollPinning({ modes, setActiveDim });

  const chooseArchetype = (id: string | null) => {
    const result = setChosenArchetype(id);
    if (result.ok) setChosen(id);
    return result;
  };

  if (phase === 'quiz') return <OrientationTest onBack={exitQuiz} chosenArchetype={chosenArchetype} onSuggestArchetype={chooseArchetype} />;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Masthead */}
      <header className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex items-baseline gap-3">
          <span className="font-headline text-lg text-[color:var(--primary)]">生甲斐</span>
          <span className="eyebrow">cahier d’introspection · n° 01</span>
        </div>
        <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant sm:block">
          Édition FR · capital-risque européen
        </span>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Fleuron className="text-sm" /> Avant les cours, l’introspection
          </p>
          <h1 className="font-headline text-display-md font-semibold tracking-tight text-balance">
            Pourquoi le capital-risque vous attire-t-il <span className="italic">vraiment</span> ?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-surface-variant text-pretty">
            Quatre dimensions — ce que vous aimez, ce dans quoi vous êtes bon, ce dont l’écosystème a besoin, ce qui peut
            vous rémunérer — tendues vers un centre. Un outil pour examiner, sans vous mentir, où se situe votre
            trajectoire dans le venture européen.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-surface-variant">
            <span>04 dimensions</span>
            <span className="h-3 w-px bg-outline-variant" />
            <span>13 zones</span>
            <span className="h-3 w-px bg-outline-variant" />
            <span>03 archétypes</span>
            <span className="h-3 w-px bg-outline-variant" />
            <span>{String(IKIGAI.questions.length).padStart(2, '0')} questions</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={enterQuiz} className="btn-foil">
              <Compass size={16} /> Passer le test d’orientation
            </button>
            <button onClick={() => scrollTo('ikigai-section-dimensions')} className="btn-ghost">
              Lire le cahier <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <Reveal>
          <div className="map-paper grain relative isolate overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low/70 p-6 shadow-editorial-sm sm:p-8">
            {/* Dark mode: the starry navigation sky behind the diagram (light mode keeps the parchment). */}
            <NightSkyBackdrop variant="panel" />
            <IkigaiAtlasDiagram onSelect={handleRegion} activeId={activeDim} />
          </div>
        </Reveal>
      </section>

      {/* Mode Selector and Myth-Busting Section */}
      <div className="my-10 border-t border-b border-outline-variant py-8 space-y-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="font-headline text-xl font-semibold">Mode de parcours d'onboarding</h2>
            <p className="text-sm text-surface-variant">Sélectionnez la profondeur et le format d'exploration.</p>
          </div>
          <ThreeModeSelector mode={onboardingMode} onChange={setOnboardingMode} />
        </div>

        {/* Reality Check / Myth Buster */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <p className="eyebrow flex items-center justify-center sm:justify-start gap-2">
              <Fleuron className="text-xs" /> Démystification : Idées reçues vs Réalité du capital-risque en France
            </p>
            <p className="text-xs text-surface-variant mt-1">Cliquez sur une carte pour révéler la réalité opérationnelle.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {IKIGAI.myths?.map((m) => (
              <MythCard key={m.id} myth={m} />
            ))}
          </div>
        </div>
      </div>

      {onboardingMode === 'editorial' && (
        <div className="mb-14">
          <ReadingLevelLegend onSetAll={setAllModes} />
        </div>
      )}

      {onboardingMode === 'editorial' ? (
        /* Scroll pinning section for §01, §02, §03, §03.b on desktop */
        <div ref={pinContainerRef} className="relative lg:h-[350vh] mt-8">
          {/* Sticky wrapper that freezes the page on desktop */}
          <div className="lg:sticky lg:top-0 lg:h-screen lg:w-full lg:overflow-hidden lg:flex lg:items-center lg:gap-10">
            {/* Left Column: Scrollable text content */}
            <div
              ref={scrollContentRef}
              className="w-full lg:w-[52%] lg:h-full lg:overflow-hidden scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              <div className="lg:py-24">
                {/* §01 — Rappel */}
                <section id="ikigai-section-rappel" className="mb-16 scroll-mt-24 lg:scroll-mt-16">
                  <StickyChapterHeader n="01" label="rappel" title="Les quatre dimensions de l’ikigai." />
                  <div className="lg:w-full">
                    <p className="mt-8 max-w-3xl text-lg leading-relaxed text-surface-variant">
                      L’ikigai — <span className="font-headline">生き甲斐</span>, littéralement « raison d’être » — désigne le point où
                      converge ce qui nourrit une vie. Le schéma occidental, avec ses quatre cercles, en est une simplification utile :
                      quatre dimensions, des intersections, et un centre. Au centre, <em>aimer</em>, <em>être bon</em>,{' '}
                      <em>être utile</em> et <em>être payé</em> coïncident. Aux bords, l’une manque — et la trajectoire se déséquilibre
                      vers la passion sans revenu, la compétence sans sens, ou le confort sans joie.
                    </p>
                  </div>
                </section>

                {/* Sections 02, 03, 03.b containing text content and inline subheaders */}
                <div className="space-y-16 pb-24">
                  <DimensionsSection mode={modes.dims} onMode={setMode('dims')} activeDim={activeDim} onSelectDim={setActiveDim} />
                  <IntersectionsSection mode={modes.inters} onMode={setMode('inters')} activeId={activeDim} />
                  <PresqueSection mode={modes.presque} onMode={setMode('presque')} activeId={activeDim} />
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Ikigai Diagram */}
            <div className="hidden lg:flex lg:w-[45%] lg:h-full lg:items-center lg:justify-center lg:pointer-events-none">
              <div className="pointer-events-auto max-w-[360px] w-full mx-auto">
                <Reveal>
                  <IkigaiAtlasDiagram onSelect={handleRegion} activeId={activeDim} hideReadout />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Bref / Interactif layout (normal flow, side-by-side on desktop) */
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
          {onboardingMode === 'bref' ? (
            <BrefIntrospectionView activeId={activeDim} onSelectId={setActiveDim} />
          ) : (
            <InteractifIntrospectionView onSelectDimension={setActiveDim} />
          )}

          {/* Right Column: Sticky Ikigai Diagram */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-20 flex justify-center">
            <div className="max-w-[360px] w-full">
              <Reveal>
                <IkigaiAtlasDiagram onSelect={handleRegion} activeId={activeDim} />
              </Reveal>
            </div>
          </div>
        </div>
      )}

      {/* Archetypes and subsequent sections in full-width below the sticky zone */}
      <div className="mt-16 space-y-16">
        <ArchetypesSection
          mode={modes.archetypes}
          onMode={setMode('archetypes')}
          chosen={chosenArchetype}
          onChoose={chooseArchetype}
        />
        <ReflectionSection mode={modes.reflection} onMode={setMode('reflection')} />

        {/* §06 — Orientation test */}
        <section id="ikigai-section-test" className="scroll-mt-24 lg:scroll-mt-16">
          <StickyChapterHeader n="06" label="le test d’orientation" title="Traduire l’introspection en parcours." />
          <div className="premium-card grid gap-6 p-7 sm:p-9 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="mt-3 max-w-xl text-surface-variant">
                {IKIGAI.questions.length} questions courtes situent votre profil d’apprentissage et vos parcours recommandés. Aucune réponse
                n’est enregistrée tant que vous n’avez pas terminé le test.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={enterQuiz} className="btn-foil">
                  <ClipboardList size={16} /> Commencer le test ({IKIGAI.questions.length} questions)
                </button>
                <span className="self-center text-xs text-surface-variant">≈ 2 minutes</span>
              </div>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5">
              <p className="eyebrow mb-3">Ce que le test révèle</p>
              <ul className="space-y-2 text-sm text-surface-variant">
                <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--primary)]" /> Votre profil d’apprentissage parmi {IKIGAI.profiles.length}</li>
                <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--primary)]" /> Vos affinités par profil, en clair</li>
                <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--primary)]" /> Vos parcours recommandés et l’archétype relié</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Colophon */}
      <FleuronDivider className="my-16" />
      <footer className="flex flex-col items-start justify-between gap-4 border-t border-outline-variant pt-8 sm:flex-row sm:items-end">
        <p className="max-w-md font-headline text-lg italic text-surface-variant">
          Un outil pour penser, pas pour conclure. L’ikigai est un centre de gravité qui se déplace avec vous.
        </p>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant">生甲斐 × vc · édition personnelle</span>
      </footer>
    </div>
  );
}
