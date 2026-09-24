import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Moon, Sun } from 'lucide-react';
import { CompassRose, NightSkyBackdrop } from '@/components/ornaments/Illustrations';
import { HomeEditorialBridge } from '@/components/home/HomeEditorialBridge';
import { useTheme } from '@/context/ThemeContext';
import { HOME_INTRO_HERO_DELAY, useHomeIntro } from '@/context/HomeIntroContext';
import { usePageMeta } from '@/lib/seo';
import '@/styles/home-hero.css';

const HERO_DESCRIPTION =
  "Une plateforme d'intelligence VC pour praticiens : dossiers d'écosystème, convictions datées, décisions instruites — et la formation qui les soutient.";

export default function HomePage() {
  usePageMeta(undefined, HERO_DESCRIPTION);
  const { theme, toggle } = useTheme();
  const intro = useHomeIntro();
  const heroRef = useRef<HTMLElement | null>(null);

  // Decided once, at mount: if the entrance curtain is up, the hero holds until
  // the veil dissolves. The delay counts from the start of the entrance, not
  // from this (lazily loaded) chunk's arrival, so the two stay in step. On an
  // ordinary visit there is no curtain and the inking starts immediately.
  const [inkStart] = useState(() =>
    intro.phase === 'running' ? Math.max(0, HOME_INTRO_HERO_DELAY - (Date.now() - intro.startedAt)) : 0,
  );

  // The drifting needle and the sky are the only loops the hero leaves running;
  // they stop as soon as it is out of the viewport. It
  // starts live so a late observer callback can never stall the entrance.
  const [ambientLive, setAmbientLive] = useState(true);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => setAmbientLive(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        data-home-hero-live={ambientLive ? 'true' : 'false'}
        style={{ '--home-hero-t0': `${inkStart}ms` } as CSSProperties}
        className="home-hero map-paper grain relative isolate flex min-h-[100svh] overflow-hidden"
      >
        <NightSkyBackdrop variant="hero" className="home-hero-sky" />

        <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-col items-center justify-center px-4 pb-24 pt-[calc(var(--home-topbar-h)+4rem)] text-center sm:px-6 sm:pb-28 sm:pt-[calc(var(--home-topbar-h)+5rem)] lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div
              aria-hidden="true"
              data-testid="home-compass"
              className="home-hero-rose relative mx-auto mb-8 w-fit drop-shadow-[0_6px_18px_color-mix(in_srgb,var(--primary)_32%,transparent)] sm:mb-10"
            >
              {/* Une seule instance, redimensionnée en CSS par home-hero.css.
                  Deux instances `hidden`/`sm:block` rejoueraient leur tracé au
                  franchissement du point de rupture — et, sur le chemin rideau,
                  la rose disparaîtrait 2,6 s avant de se redessiner. */}
              <CompassRose size={120} className="cursor-default" />
            </div>

            <h1
              aria-label="Documenter le raisonnement. Affûter le jugement."
              className="font-headline text-[1.7875rem] font-semibold leading-[0.98] tracking-[-0.035em] text-balance text-foreground sm:text-[2.99rem] lg:text-[3.9rem]"
            >
              <span className="home-hero-line block">Documenter le raisonnement.</span>
              <span className="home-hero-line mt-2 block italic text-[color:var(--primary)] sm:mt-3">
                Affûter le jugement.
              </span>
            </h1>

            <p className="home-hero-lede mx-auto mt-8 max-w-3xl text-[0.65rem] leading-relaxed text-surface-variant text-pretty sm:mt-10 sm:text-[0.8125rem] sm:leading-relaxed">
              {HERO_DESCRIPTION}
            </p>
          </div>
        </div>
      </section>

      <HomeEditorialBridge />

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
