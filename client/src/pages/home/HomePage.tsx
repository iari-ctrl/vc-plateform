import { useState, type CSSProperties } from 'react';
import { Moon, Sun } from 'lucide-react';
import { CompassRose, NightSkyBackdrop } from '@/components/ornaments/Illustrations';
import { Fleuron } from '@/components/ornaments/Ornaments';
import { HomeEditorialBridge } from '@/components/home/HomeEditorialBridge';
import { Reveal } from '@/components/ui/primitives';
import { useTheme } from '@/context/ThemeContext';
import { HOME_INTRO_HERO_DELAY, useHomeIntro } from '@/context/HomeIntroContext';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';

const HERO_DESCRIPTION =
  "Une plateforme d'intelligence VC pour praticiens : dossiers d'écosystème, convictions datées, décisions instruites — et la formation qui les soutient.";

const HERO_INTENT_NOTE =
  "L'ikigai n'est pas un point fixe à atteindre. C'est un centre de gravité qui se déplace avec toi. Le capital-risque, par sa temporalité longue force précisément à se demander : où sera ce centre dans une décennie ?";

export default function HomePage() {
  usePageMeta(undefined, HERO_DESCRIPTION);
  const { theme, toggle } = useTheme();
  const intro = useHomeIntro();

  // Decided once, at mount: if the entrance curtain is up, the hero holds until
  // the veil dissolves. The delay counts from the start of the entrance, not
  // from this (lazily loaded) chunk's arrival, so the two stay in step.
  const [entranceDelay] = useState(() =>
    intro.phase === 'running' ? Math.max(0, HOME_INTRO_HERO_DELAY - (Date.now() - intro.startedAt)) : null,
  );

  return (
    <>
      <section className="map-paper grain relative isolate flex min-h-[100svh] overflow-hidden">
        <NightSkyBackdrop variant="hero" />

        <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-col items-center justify-center px-4 pb-24 pt-[calc(var(--home-topbar-h)+4rem)] text-center sm:px-6 sm:pb-28 sm:pt-[calc(var(--home-topbar-h)+5rem)] lg:px-8">
          <Reveal delay={0}>
            <div
              className={cn('mx-auto max-w-5xl', entranceDelay !== null && 'home-intro-hero')}
              style={
                entranceDelay !== null
                  ? ({ '--home-intro-hero-delay': `${entranceDelay}ms` } as CSSProperties)
                  : undefined
              }
            >
              <div
                aria-hidden="true"
                data-testid="home-compass"
                className="mx-auto mb-8 w-fit drop-shadow-[0_6px_18px_color-mix(in_srgb,var(--primary)_32%,transparent)] sm:mb-10"
              >
                <CompassRose size={96} floating={false} className="cursor-default sm:hidden" />
                <CompassRose size={120} floating={false} className="hidden cursor-default sm:block" />
              </div>

              <h1
                aria-label="Documenter le raisonnement. Affûter le jugement."
                className="font-headline text-[1.7875rem] font-semibold leading-[0.98] tracking-[-0.035em] text-balance text-foreground sm:text-[2.99rem] lg:text-[3.9rem]"
              >
                <span className="block">Documenter le raisonnement.</span>
                <span className="mt-2 block italic text-[color:var(--primary)] sm:mt-3">Affûter le jugement.</span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-[0.65rem] leading-relaxed text-surface-variant text-pretty sm:mt-10 sm:text-[0.8125rem] sm:leading-relaxed">
                {HERO_DESCRIPTION}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <HomeEditorialBridge />

      <section
        aria-labelledby="home-intent-note-title"
        className="grain relative border-y border-outline-variant bg-[color:var(--surface-container-lowest)] px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8 lg:py-40"
      >
        <div className="mx-auto max-w-[var(--content-max)]">
          <Fleuron className="text-[0.975rem]" />
          <blockquote className="mx-auto mt-10 max-w-6xl font-headline text-[1.3rem] italic leading-snug tracking-[-0.015em] text-foreground text-balance sm:text-[1.95rem] sm:leading-snug lg:text-[2.34rem]">
            « {HERO_INTENT_NOTE} »
          </blockquote>
          <p id="home-intent-note-title" className="eyebrow mt-14 text-[0.52rem] sm:text-[0.56875rem]">
            Note d’intention
          </p>
        </div>
      </section>

      <button
        type="button"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
        className="group fixed left-3 top-0 z-[80] grid h-11 w-11 place-items-center text-surface-variant opacity-60 transition-[color,opacity] hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[color:var(--primary)] md:bottom-7 md:left-7 md:top-auto md:z-[70]"
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-[calc(var(--home-topbar-h)/2)] grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center md:top-1/2"
        >
          {theme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
        </span>
      </button>
    </>
  );
}
