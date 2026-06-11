import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from '@/i18n/routing';
import { ArrowLeft, ArrowRight, Compass, ClipboardList } from 'lucide-react';
import { IKIGAI } from '@/content';
import { IkigaiAtlasDiagram, type RegionSelect } from '@/components/ikigai/IkigaiAtlasDiagram';
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
import { ProgressBar, Reveal } from '@/components/ui/primitives';
import { computeProfile, suggestedArchetype, type OnboardingAnswer } from '@/lib/ikigai';
import {
  getReadingMode,
  setReadingMode,
  getChosenArchetype,
  setChosenArchetype,
  archiveProfile,
} from '@/lib/ikigaiCahier';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';
import type { IkigaiMode, OnboardingMode, IkigaiMyth } from '@/content/types';

type SectionKey = 'dims' | 'inters' | 'presque' | 'archetypes' | 'reflection';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function OnboardingPage() {
  usePageMeta(
    'Cahier Ikigai — introspection avant les cours',
    'Un cahier d’introspection inspiré de l’ikigai pour comprendre pourquoi le capital-risque vous attire, explorer 13 zones de sens et révéler votre profil d’apprentissage.',
  );
  const navigate = useNavigate();
  const { profile: savedProfile, saveProfile } = useUserData();

  // Load onboardingMode from localStorage, default to 'editorial'
  const [onboardingMode, setOnboardingModeState] = useState<OnboardingMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboardingMode');
      if (saved === 'editorial' || saved === 'bref' || saved === 'interactif') {
        return saved as OnboardingMode;
      }
    }
    return 'editorial';
  });

  const setOnboardingMode = (m: OnboardingMode) => {
    setOnboardingModeState(m);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingMode', m);
    }
  };

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

  const pinContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Only set activeDim via observer on mobile to avoid layout calculation conflicts
      if (window.innerWidth >= 1024) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'ikigai-section-rappel') {
            setActiveDim(null);
          } else if (id.startsWith('ikigai-dim-')) {
            setActiveDim(id.replace('ikigai-dim-', ''));
          } else if (id.startsWith('ikigai-inter-')) {
            setActiveDim(id.replace('ikigai-inter-', ''));
          } else if (id.startsWith('ikigai-presque-')) {
            setActiveDim(id.replace('ikigai-presque-', ''));
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const targets = document.querySelectorAll(
      '#ikigai-section-rappel, [id^="ikigai-dim-"], [id^="ikigai-inter-"], [id^="ikigai-presque-"]'
    );
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const pinContainer = pinContainerRef.current;
      const scrollContent = scrollContentRef.current;
      if (!pinContainer || !scrollContent) return;

      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        scrollContent.scrollTop = 0;
        return;
      }

      const rect = pinContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) return;

      const scrolledPastTop = -rect.top;
      let progress = 0;
      if (scrolledPastTop > 0) {
        progress = Math.min(scrolledPastTop / totalScrollable, 1);
      }

      const contentHeight = scrollContent.scrollHeight;
      const maxScroll = Math.max(0, contentHeight - viewportHeight);
      
      // Scroll the left column programmatically
      scrollContent.scrollTop = progress * maxScroll;

      // Find the active element closest to the middle of the viewport
      const targets = scrollContent.querySelectorAll(
        '#ikigai-section-rappel, [id^="ikigai-dim-"], [id^="ikigai-inter-"], [id^="ikigai-presque-"]'
      );
      let closestId = '';
      let minDistance = Infinity;

      targets.forEach((target) => {
        const targetRect = target.getBoundingClientRect();
        const targetCenter = targetRect.top + targetRect.height / 2;
        const distance = Math.abs(targetCenter - viewportHeight / 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = target.id;
        }
      });

      if (closestId) {
        if (closestId === 'ikigai-section-rappel') {
          setActiveDim(null);
        } else if (closestId.startsWith('ikigai-dim-')) {
          setActiveDim(closestId.replace('ikigai-dim-', ''));
        } else if (closestId.startsWith('ikigai-inter-')) {
          setActiveDim(closestId.replace('ikigai-inter-', ''));
        } else if (closestId.startsWith('ikigai-presque-')) {
          setActiveDim(closestId.replace('ikigai-presque-', ''));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });
    if (scrollContentRef.current) {
      resizeObserver.observe(scrollContentRef.current);
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      resizeObserver.disconnect();
    };
  }, [modes]);

  const chooseArchetype = (id: string | null) => {
    setChosen(id);
    setChosenArchetype(id);
  };

  function scrollTo(target: string, block: ScrollLogicalPosition = 'start') {
    const el = document.getElementById(target);
    if (!el) return;

    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) {
      el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block });
      return;
    }

    const pinContainer = pinContainerRef.current;
    const scrollContent = scrollContentRef.current;
    if (!pinContainer || !scrollContent) {
      el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block });
      return;
    }

    const rect = pinContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const totalScrollable = rect.height - viewportHeight;
    const contentHeight = scrollContent.scrollHeight;
    const maxScroll = Math.max(0, contentHeight - viewportHeight);

    if (totalScrollable <= 0 || maxScroll <= 0) return;

    let elementOffsetTop = 0;
    let current: HTMLElement | null = el;
    while (current && current !== scrollContent) {
      elementOffsetTop += current.offsetTop;
      current = current.offsetParent as HTMLElement;
    }

    let targetScrollTop = 0;
    if (block === 'center') {
      targetScrollTop = elementOffsetTop - (viewportHeight / 2) + (el.offsetHeight / 2);
    } else {
      targetScrollTop = elementOffsetTop;
    }

    targetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll));
    const progress = targetScrollTop / maxScroll;
    const targetWindowScrollTop = window.scrollY + rect.top + progress * totalScrollable;

    window.scrollTo({
      top: targetWindowScrollTop,
      behavior: prefersReduced() ? 'auto' : 'smooth',
    });
  }

  function handleRegion(r: RegionSelect) {
    if (r.kind === 'dimension') {
      setActiveDim(r.id);
      scrollTo(r.target, 'center');
    } else {
      scrollTo(r.target, 'start');
    }
  }

  if (phase === 'quiz') return <OrientationTest onBack={exitQuiz} savedProfile={savedProfile} saveProfile={saveProfile} navigate={navigate} chosenArchetype={chosenArchetype} onSuggestArchetype={chooseArchetype} />;

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
            <span>07 questions</span>
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
                Sept questions courtes situent votre profil d’apprentissage et vos parcours recommandés. Aucune réponse
                n’est enregistrée tant que vous n’avez pas terminé le test.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={enterQuiz} className="btn-foil">
                  <ClipboardList size={16} /> Commencer le test (7 questions)
                </button>
                <span className="self-center text-xs text-surface-variant">≈ 2 minutes</span>
              </div>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5">
              <p className="eyebrow mb-3">Ce que le test révèle</p>
              <ul className="space-y-2 text-sm text-surface-variant">
                <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--primary)]" /> Votre profil d’apprentissage parmi six</li>
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

// ── Orientation test (scored MCQ → learning profile) ─────────────────────────
function OrientationTest({
  onBack,
  savedProfile,
  saveProfile,
  navigate,
  chosenArchetype,
  onSuggestArchetype,
}: {
  onBack: () => void;
  savedProfile: ReturnType<typeof useUserData>['profile'];
  saveProfile: ReturnType<typeof useUserData>['saveProfile'];
  navigate: ReturnType<typeof useNavigate>;
  chosenArchetype: string | null;
  onSuggestArchetype: (id: string | null) => void;
}) {
  const [params, setParams] = useSearchParams();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const questions = IKIGAI.questions;
  const last = questions.length - 1;
  const step = Math.min(Math.max(Number.parseInt(params.get('q') ?? '0', 10) || 0, 0), last);
  const q = questions[step];

  const goToStep = (n: number) =>
    setParams((p) => {
      p.set('q', String(Math.min(Math.max(n, 0), last)));
      return p;
    });

  // Record the answer only — advancing is now an explicit action (Suivant /
  // Voir mon résultat), so a mis-tap no longer skips a question.
  function choose(optionIndex: number) {
    setAnswers((cur) => ({ ...cur, [q.n]: optionIndex }));
  }

  function finish(finalAnswers: Record<string, number>) {
    const list: OnboardingAnswer[] = Object.entries(finalAnswers).map(([questionN, optionIndex]) => ({ questionN, optionIndex }));
    const result = computeProfile(list);
    if (!result) return;
    // Keep the previous result as history before overwriting it.
    archiveProfile(savedProfile);
    void saveProfile({ profileType: result.top.id, timeBudget: result.timeBudget, scores: result.scores });
    // If the cahier doesn't have a chosen archetype yet, suggest one from the profile.
    if (!chosenArchetype) {
      const suggestion = suggestedArchetype(result.top.id);
      if (suggestion) onSuggestArchetype(suggestion.id);
    }
    navigate('/profile-result', { state: { profileId: result.top.id, scores: result.scores, timeBudget: result.timeBudget } });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-surface-variant">
          <span className="font-mono">Question {step + 1} / {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <ProgressBar value={((step + (answers[q.n] != null ? 1 : 0)) / questions.length) * 100} />
      </div>

      <div key={q.n} className="animate-fade-up">
        <p className="eyebrow mb-2">{q.hint}</p>
        <h2 className="font-headline text-headline-lg font-semibold leading-tight text-balance">{q.q}</h2>

        <div className="mt-7 space-y-3">
          {q.options.map((opt, i) => {
            const selected = answers[q.n] === i;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                  selected
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                    : 'border-outline-variant hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low'
                }`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs ${selected ? 'border-[color:var(--primary)] text-[color:var(--primary)]' : 'border-outline-variant text-surface-variant'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[0.95rem] leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => (step === 0 ? onBack() : goToStep(step - 1))} className="btn-quiet">
          <ArrowLeft size={15} /> {step === 0 ? 'Retour au cahier' : 'Précédent'}
        </button>
        {answers[q.n] != null &&
          (step < last ? (
            <button onClick={() => goToStep(step + 1)} className="btn-ghost">
              Suivant <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={() => finish(answers)} className="btn-foil">
              Voir mon résultat <ArrowRight size={15} />
            </button>
          ))}
      </div>
    </div>
  );
}

function MythCard({ myth }: { myth: IkigaiMyth }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className={`relative h-64 w-full rounded-2xl border text-left transition-all duration-300 ${
        flipped
          ? 'border-[color:var(--primary)] bg-surface-container-low'
          : 'border-outline-variant hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] bg-surface-container-lowest shadow-editorial-xs'
      }`}
    >
      <div
        className="absolute inset-0 flex flex-col justify-between p-5"
        style={{ display: flipped ? 'none' : 'flex' }}
      >
        <div>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-surface-variant">Idée reçue ({myth.fundExample})</span>
          <h4 className="font-headline text-headline-sm font-semibold mt-1" style={{ color: 'var(--primary)' }}>
            {myth.title}
          </h4>
          <p className="text-xs text-surface-variant mt-3 italic leading-relaxed">
            « {myth.myth} »
          </p>
        </div>
        <span className="text-[0.625rem] font-mono text-[color:var(--primary)] uppercase tracking-wider self-end">Découvrir la réalité →</span>
      </div>
      <div
        className="absolute inset-0 flex flex-col justify-between p-5 animate-fade-in"
        style={{ display: flipped ? 'flex' : 'none' }}
      >
        <div>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[color:var(--primary)]">La réalité du terrain</span>
          <p className="text-xs leading-relaxed text-foreground mt-2">
            {myth.reality}
          </p>
        </div>
        <span className="text-[0.625rem] font-mono text-surface-variant uppercase tracking-wider self-end">← Retour</span>
      </div>
    </button>
  );
}
