import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { publicAssetUrl } from '@shared/base-url.mjs';
import { CompassIkigaiIntro } from '@/components/splash/CompassIkigaiIntro';
import { Fleuron } from '@/components/ornaments/Ornaments';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';
import '@/styles/splash.css';

type SplashMode = 'light' | 'dark';

// ── Mode transition ("Aube") timing ─────────────────────────────────────────
// The dawn switch: the sky tips over, a horizon flare blooms, and the stars
// light up one by one while the compass and title stay rooted in place.
const DUR = 1600;
const SPLASH_PHOTO_STYLE = {
  '--splash-photo-light': `url("${publicAssetUrl('splash/bg-claire.webp', import.meta.env.BASE_URL)}")`,
  '--splash-photo-dark': `url("${publicAssetUrl('splash/bg-sombre.webp', import.meta.env.BASE_URL)}")`,
} as CSSProperties;

// ── Constellation + scattered night stars ────────────────────────────────────
type StarPoint = { x: number; y: number; r: number; base: number; sd: string; td: string };

const CONSTELLATION: [number, number, number][] = [
  [12, 22, 1.6], [26, 14, 1.1], [38, 30, 2.1], [55, 18, 1.3], [70, 34, 1.7], [82, 20, 1.1], [90, 44, 1.9],
  [64, 52, 1.2], [44, 58, 1.5], [20, 50, 1.2], [8, 66, 1.6], [33, 76, 1.1], [58, 78, 1.8], [78, 68, 1.2],
];
const LINKS: [number, number][] = [
  [0, 1], [1, 3], [3, 5], [2, 3], [4, 6], [4, 7], [7, 8], [8, 9], [9, 10], [8, 11], [11, 12], [12, 13], [6, 13],
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Built once per session so every star keeps a stable, individual twinkle rhythm
// across re-renders (parallax updates re-render this subtree frequently).
const STARS: StarPoint[] = [
  ...CONSTELLATION.map(([x, y, r]) => ({ x, y, r, base: 0.9, sd: `${rand(0, 1.1).toFixed(2)}s`, td: `${rand(3, 6.2).toFixed(2)}s` })),
  ...Array.from({ length: 26 }, () => ({
    x: +rand(0, 100).toFixed(1),
    y: +rand(0, 72).toFixed(1),
    r: +rand(0.3, 0.85).toFixed(2),
    base: 0.7,
    sd: `${rand(0, 1.1).toFixed(2)}s`,
    td: `${rand(3, 6.2).toFixed(2)}s`,
  })),
];

function isReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useParallax(): [Pick<HTMLAttributes<HTMLElement>, 'onMouseMove' | 'onMouseLeave'>, number, number] {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const next = useRef({ x: 0, y: 0 });

  // Coalesce pointer moves to at most one state update per animation frame, so
  // the splash subtree re-renders once per frame instead of on every mousemove.
  const flush = useCallback(() => {
    frame.current = null;
    setPoint(next.current);
  }, []);

  const onMouseMove = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (isReducedMotion()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    next.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    };
    if (frame.current == null) frame.current = requestAnimationFrame(flush);
  }, [flush]);

  const onMouseLeave = useCallback(() => {
    if (frame.current != null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    next.current = { x: 0, y: 0 };
    setPoint({ x: 0, y: 0 });
  }, []);

  useEffect(
    () => () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return [{ onMouseMove, onMouseLeave }, point.x, point.y];
}

function ModeToggle({ mode, onChange }: { mode: SplashMode; onChange: (mode: SplashMode) => void }) {
  const items = [
    { id: 'light' as const, label: 'Clair', Icon: Sun },
    { id: 'dark' as const, label: 'Sombre', Icon: Moon },
  ];

  return (
    <div className="splash-mode" role="radiogroup" aria-label="Lumière du portail">
      <span className="splash-mode-caption">Choisissez votre lumière</span>
      <div className="splash-mode-track">
        {items.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            aria-label={label}
            className={cn('splash-mode-button', mode === id && 'is-active')}
            onClick={() => onChange(id)}
          >
            <Icon size={15} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}

function MemoCorners() {
  return (
    <>
      <div className="splash-memo splash-memo-left">
        TABULA VENTURA · <span>RÉF. VC-001</span>
      </div>
      <div className="splash-memo splash-memo-right">
        MMXXVI · <span>ACCÈS LIBRE</span>
      </div>
    </>
  );
}

function NightStars({ hostRef, revealed, transform }: { hostRef: RefObject<HTMLDivElement | null>; revealed: boolean; transform: string }) {
  return (
    <div ref={hostRef} className={cn('splash-stars', revealed && 'reveal')} style={{ transform }} aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="splash-cl-svg">
        <g className="splash-cl-lines" stroke="currentColor" strokeWidth="0.16">
          {LINKS.map(([a, b], i) => (
            <line key={i} x1={CONSTELLATION[a][0]} y1={CONSTELLATION[a][1]} x2={CONSTELLATION[b][0]} y2={CONSTELLATION[b][1]} />
          ))}
        </g>
        <g fill="currentColor">
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              className="splash-star"
              opacity={s.base}
              style={{ '--sd': s.sd, '--td': s.td } as CSSProperties}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function EnterCue() {
  return (
    <Link to="/home" className="splash-enter splash-rise" style={{ '--d': '2.62s' } as CSSProperties}>
      <span className="splash-enter-disc" aria-hidden>
        <span />
        <span />
        <ArrowRight size={28} />
      </span>
      <span className="splash-enter-label">Accéder à l’accueil</span>
    </Link>
  );
}

export default function SplashPage() {
  usePageMeta('Entrer', 'Un portail visuel pour entrer dans VC Premium Experience, entre atlas vivant et ciel de navigation.');

  // The "Choisissez votre lumière" toggle drives the global theme, so the light
  // chosen at the portal carries into the app (and matches the in-app toggle).
  const { theme, toggle } = useTheme();
  const [bind, mx, my] = useParallax();

  const photoLightRef = useRef<HTMLDivElement>(null);
  const photoDarkRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  // Drives the constellation reveal (lines drawing in + stars popping on) and the
  // shooting-star loop. Starts already revealed when the portal opens in dark.
  const [revealed, setRevealed] = useState(theme === 'dark');

  // Latest mode, read inside async animation callbacks that may outlive a toggle.
  const modeRef = useRef(theme);
  modeRef.current = theme;
  const anims = useRef<Animation[]>([]);
  const starsTimer = useRef<number | null>(null);
  const firstRun = useRef(true);

  // ── Transition engine ──────────────────────────────────────────────────────
  // Photo opacity/filter and the glow flare are driven imperatively (Web
  // Animations API) so they never fight React's render — which only writes the
  // parallax `transform` on these same elements.
  const finishTo = useCallback((mode: SplashMode) => {
    anims.current.forEach((a) => {
      try {
        a.cancel();
      } catch {
        /* already settled */
      }
    });
    anims.current = [];
    if (photoDarkRef.current) photoDarkRef.current.style.opacity = mode === 'dark' ? '1' : '0';
    if (photoLightRef.current) photoLightRef.current.style.filter = '';
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, []);

  const interrupt = useCallback(() => {
    if (starsTimer.current != null) {
      window.clearTimeout(starsTimer.current);
      starsTimer.current = null;
    }
    if (!anims.current.length) return;
    // Freeze the in-flight values onto inline styles before cancelling, so a
    // rapid re-toggle resumes from where it was rather than snapping.
    const dark = photoDarkRef.current;
    const light = photoLightRef.current;
    const snapOpacity = dark ? getComputedStyle(dark).opacity : '0';
    const snapFilter = light ? getComputedStyle(light).filter : 'none';
    anims.current.forEach((a) => {
      try {
        a.cancel();
      } catch {
        /* already settled */
      }
    });
    anims.current = [];
    if (dark) dark.style.opacity = snapOpacity;
    if (light) light.style.filter = snapFilter === 'none' ? '' : snapFilter;
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, []);

  const aube = useCallback(
    (toDark: boolean) => {
      const glow = glowRef.current;
      const light = photoLightRef.current;
      const dark = photoDarkRef.current;
      if (!glow || !light || !dark) return;
      const push = (a: Animation) => anims.current.push(a);

      // Horizon flare that blooms then fades through the switch.
      push(
        glow.animate([{ opacity: 0 }, { opacity: toDark ? 0.95 : 0.8, offset: 0.42 }, { opacity: 0 }], {
          duration: Math.round(DUR * 1.25),
          easing: 'cubic-bezier(.4,0,.4,1)',
        }),
      );

      if (toDark) {
        push(
          light.animate([{ filter: 'brightness(1) saturate(1)' }, { filter: 'brightness(0.45) saturate(0.7)' }], {
            duration: DUR,
            easing: 'cubic-bezier(.55,.05,.55,1)',
            fill: 'forwards',
          }),
        );
        const fade = dark.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: DUR,
          easing: 'cubic-bezier(.5,.05,.35,1)',
          fill: 'forwards',
        });
        push(fade);
        fade.finished.then(() => modeRef.current === 'dark' && finishTo('dark')).catch(() => {});
        // Stars light up once the sky is half-turned.
        starsTimer.current = window.setTimeout(() => setRevealed(true), Math.round(DUR * 0.5));
      } else {
        setRevealed(false);
        push(
          light.animate([{ filter: 'brightness(0.45) saturate(0.7)' }, { filter: 'brightness(1) saturate(1)' }], {
            duration: Math.round(DUR * 1.05),
            easing: 'cubic-bezier(.35,.1,.25,1)',
            fill: 'forwards',
          }),
        );
        const fade = dark.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: DUR,
          easing: 'cubic-bezier(.5,.1,.35,1)',
          fill: 'forwards',
        });
        push(fade);
        fade.finished.then(() => modeRef.current === 'light' && finishTo('light')).catch(() => {});
      }
    },
    [finishTo],
  );

  useLayoutEffect(() => {
    interrupt();
    if (firstRun.current) {
      // First paint: settle to the opening mode without playing a transition.
      firstRun.current = false;
      finishTo(theme);
      setRevealed(theme === 'dark');
      return;
    }
    if (isReducedMotion()) {
      finishTo(theme);
      setRevealed(theme === 'dark');
      return;
    }
    aube(theme === 'dark');
  }, [theme, aube, finishTo, interrupt]);

  // ── Shooting stars — occasional passes, dark mode only ─────────────────────
  useEffect(() => {
    if (theme !== 'dark' || isReducedMotion()) return undefined;
    let timer: number;
    let cancelled = false;

    const spawn = () => {
      const host = starsRef.current;
      if (!host) return;
      const el = document.createElement('div');
      el.className = 'splash-shoot';
      const ang = 16 + Math.random() * 24;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const rot = `rotate(${dir > 0 ? ang : 180 - ang}deg)`;
      el.style.left = `${12 + Math.random() * 72}%`;
      el.style.top = `${4 + Math.random() * 32}%`;
      host.appendChild(el);
      const dist = 300 + Math.random() * 280;
      const a = el.animate(
        [
          { transform: `${rot} translateX(0) scaleX(0.3)`, opacity: 0 },
          { opacity: 0.95, offset: 0.12 },
          { transform: `${rot} translateX(${dist * 0.7}px) scaleX(1)`, opacity: 0.85, offset: 0.7 },
          { transform: `${rot} translateX(${dist}px) scaleX(0.55)`, opacity: 0 },
        ],
        { duration: 850 + Math.random() * 650, easing: 'cubic-bezier(.25,.6,.45,1)' },
      );
      a.finished.then(() => el.remove()).catch(() => el.remove());
    };

    const loop = () => {
      timer = window.setTimeout(() => {
        if (!cancelled && !document.hidden) {
          spawn();
          // Now and then a second one follows in its wake.
          if (Math.random() < 0.35) window.setTimeout(spawn, 220 + Math.random() * 480);
        }
        loop();
      }, 3200 + Math.random() * 5800);
    };
    loop();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [theme]);

  const onChange = (next: SplashMode) => {
    if (next !== theme) toggle();
  };

  const photoTransform = `scale(1.04) translate3d(${mx * -10}px, ${my * -8}px, 0)`;
  const starsTransform = `translate3d(${mx * -14}px, ${my * -6}px, 0)`;

  return (
    <section className="splash-portal" data-mode={theme} aria-labelledby="splash-title" style={SPLASH_PHOTO_STYLE}>
      <div className="splash-stage" {...bind}>
        <div className="splash-photos" aria-hidden>
          <div ref={photoLightRef} className="splash-photo splash-photo-light" style={{ transform: photoTransform }} />
          <div ref={photoDarkRef} className="splash-photo splash-photo-dark" style={{ transform: photoTransform }} />
        </div>

        <NightStars hostRef={starsRef} revealed={revealed} transform={starsTransform} />
        <div ref={glowRef} className="splash-glow" aria-hidden />

        <MemoCorners />

        <div className="splash-content">
          <span className="splash-kicker splash-rise" style={{ '--d': '0.1s' } as CSSProperties}>
            <Fleuron className="text-[0.8rem]" /> VC Premium Experience <Fleuron className="text-[0.8rem]" />
          </span>

          <div className="splash-focal splash-rise" style={{ '--d': '0.18s' } as CSSProperties}>
            <CompassIkigaiIntro size={188} hue="currentColor" speed={1} className="splash-compass" />
          </div>

          <h1 id="splash-title" className="splash-title splash-rise" style={{ '--d': '2.4s' } as CSSProperties}>
            Comprendre le venture. <span>Vous comprendre.</span>
          </h1>

          <EnterCue />
        </div>

        <ModeToggle mode={theme} onChange={onChange} />
      </div>
    </section>
  );
}
