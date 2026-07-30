import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { publicAssetUrl } from '@shared/base-url.mjs';
import {
  HOME_BAR_CELL,
  HOME_BAR_PILLAR,
  HOME_BAR_ROW,
  HOME_BAR_WORDMARK,
  HOME_BAR_WORDMARK_ACCENT,
  HOME_COMPACT_MEDIA_QUERY,
  HOME_FORMATION,
  HOME_INTELLIGENCE,
} from '@/components/chrome/homeBar';
import {
  HOME_INTRO_END_AT,
  HOME_INTRO_HANDOVER_AT,
  HOME_INTRO_IDLE,
  HomeIntroContext,
  type HomeIntroPhase,
  type HomeIntroValue,
} from '@/context/HomeIntroContext';
import { useTheme } from '@/context/ThemeContext';
import { useMediaQuery } from '@/lib/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import '@/styles/home-intro.css';

// Same two photographs the portal uses: in dark the sky is literally the image
// the hero already carries, so the veil can dissolve without anything moving.
const PHOTO_STYLE = {
  '--home-intro-photo-light': `url("${publicAssetUrl('splash/bg-claire.webp', import.meta.env.BASE_URL)}")`,
  '--home-intro-photo-dark': `url("${publicAssetUrl('splash/bg-sombre.webp', import.meta.env.BASE_URL)}")`,
} as CSSProperties;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Owns the post-splash entrance and publishes its phase to the top bar (which
 * steps aside) and to HomePage (which delays its hero reveal).
 *
 * It plays on a direct landing on /home and on the hand-off from the portal —
 * never when the home page is reached again from inside the app, where a 3.8s
 * curtain would just be in the way.
 */
export function HomeIntroProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [value, setValue] = useState<HomeIntroValue>(HOME_INTRO_IDLE);
  const previousPathRef = useRef<string | null>(null);
  const spentRef = useRef(false);

  const settle = useCallback(() => setValue((current) => (current.phase === 'idle' ? current : HOME_INTRO_IDLE)), []);

  useEffect(() => {
    const previous = previousPathRef.current;
    previousPathRef.current = pathname;

    if (pathname !== '/home') {
      settle();
      return;
    }
    if (spentRef.current) return;
    spentRef.current = true;

    const eligible = previous === null || previous === '' || previous === '/';
    if (!eligible || prefersReducedMotion()) return;

    setValue({ phase: 'running', startedAt: Date.now() });
  }, [pathname, settle]);

  // Scheduled from the elapsed time rather than from "now", so a remount (React
  // StrictMode in dev, a fast refresh) picks the timeline back up where it is
  // instead of restarting or stalling.
  useEffect(() => {
    if (value.phase === 'idle') return undefined;
    const elapsed = Date.now() - value.startedAt;
    const after = (mark: number) => Math.max(0, mark - elapsed);

    const timers = [window.setTimeout(settle, after(HOME_INTRO_END_AT))];
    if (value.phase === 'running') {
      timers.push(
        window.setTimeout(
          () => setValue((current) => (current.phase === 'running' ? { ...current, phase: 'handover' } : current)),
          after(HOME_INTRO_HANDOVER_AT),
        ),
      );
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [settle, value.phase, value.startedAt]);

  const { phase } = value;

  return (
    <HomeIntroContext.Provider value={value}>
      {children}
      {phase !== 'idle' && <HomeIntroCurtain phase={phase} />}
    </HomeIntroContext.Provider>
  );
}

function HomeIntroCurtain({ phase }: { phase: Exclude<HomeIntroPhase, 'idle'> }) {
  const { theme } = useTheme();
  const compactNavigation = useMediaQuery(HOME_COMPACT_MEDIA_QUERY);

  return (
    <div
      className={cn('home-intro', phase === 'handover' && 'is-leaving')}
      data-mode={theme}
      style={PHOTO_STYLE}
      aria-hidden
    >
      <div className="home-intro-veil">
        <div className="home-intro-veil-photo" />
        <div className="home-intro-veil-wash" />
      </div>

      <div className="home-intro-header">
        <div className={cn(HOME_BAR_ROW, compactNavigation && 'flex justify-center px-14')}>
          {!compactNavigation && (
            <span className={HOME_BAR_CELL}>
              <span className={cn('home-intro-pillar', HOME_BAR_PILLAR)}>
                <span className="whitespace-nowrap">{HOME_FORMATION.label}</span>
                <ChevronDown size={14} strokeWidth={1.6} className="shrink-0" />
              </span>
            </span>
          )}

          <span className={cn('home-intro-wordmark', HOME_BAR_WORDMARK)}>
            <span className="whitespace-nowrap">
              Maison <span className={HOME_BAR_WORDMARK_ACCENT}>Sapience VC</span>
            </span>
          </span>

          {!compactNavigation && (
            <span className={cn(HOME_BAR_CELL, 'justify-end')}>
              <span className={cn('home-intro-pillar', HOME_BAR_PILLAR, 'text-right')}>
                <span className="whitespace-nowrap">{HOME_INTELLIGENCE.label}</span>
                <ChevronDown size={14} strokeWidth={1.6} className="shrink-0" />
              </span>
            </span>
          )}
        </div>

        <span className="home-intro-rule" />
      </div>
    </div>
  );
}
