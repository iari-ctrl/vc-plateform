import { useCallback, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type MouseEvent as ReactMouseEvent } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { CompassIkigaiIntro } from '@/components/splash/CompassIkigaiIntro';
import { Constellation, WaxSeal } from '@/components/ornaments/Illustrations';
import { Fleuron } from '@/components/ornaments/Ornaments';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';
import '@/styles/splash.css';

type SplashMode = 'light' | 'dark';

type Seal = {
  glyph: string;
  accent: string;
  pos: CSSProperties;
  size: number;
  motion: string;
  delay?: string;
  depth: number;
};

const LIGHT_SEALS: Seal[] = [
  { glyph: '発', accent: '#D28236', pos: { left: '8%', top: '22%' }, size: 56, motion: 'splash-float', delay: '0s', depth: 26 },
  { glyph: '業', accent: '#267A8C', pos: { right: '10%', top: '17%' }, size: 64, motion: 'splash-float-slow', delay: '1.2s', depth: 34 },
  { glyph: '観', accent: '#4C6B8A', pos: { left: '13%', bottom: '18%' }, size: 50, motion: 'splash-float-x', delay: '0.6s', depth: 20 },
  { glyph: '論', accent: '#7C4680', pos: { right: '12%', bottom: '20%' }, size: 58, motion: 'splash-float', delay: '1.8s', depth: 30 },
  { glyph: '契', accent: '#9A6A3C', pos: { right: '23%', top: '40%' }, size: 42, motion: 'splash-float-slow', delay: '2.4s', depth: 16 },
  { glyph: '報', accent: '#5A455C', pos: { left: '20%', top: '38%' }, size: 40, motion: 'splash-float', delay: '3s', depth: 14 },
];

const DARK_SEALS: Seal[] = [
  { glyph: '発', accent: '#D28236', pos: { left: 90, top: 200 }, size: 44, motion: 'splash-float', delay: '0s', depth: 30 },
  { glyph: '論', accent: '#A68AA9', pos: { right: 110, top: 230 }, size: 40, motion: 'splash-float-slow', delay: '0.7s', depth: 24 },
  { glyph: '観', accent: '#3FB0C4', pos: { left: 150, bottom: 210 }, size: 38, motion: 'splash-float-x', delay: '1.4s', depth: 20 },
  { glyph: '業', accent: '#C5A85C', pos: { right: 150, bottom: 196 }, size: 44, motion: 'splash-float', delay: '2.1s', depth: 34 },
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

function DriftingSeals({ seals, mx, my }: { seals: Seal[]; mx: number; my: number }) {
  return (
    <div className="splash-seals" aria-hidden>
      {seals.map((seal) => (
        <div
          key={seal.glyph}
          className="splash-seal-parallax"
          style={
            {
              ...seal.pos,
              transform: `translate3d(${mx * seal.depth}px, ${my * seal.depth}px, 0)`,
            } as CSSProperties
          }
        >
          <div className={seal.motion} style={{ animationDelay: seal.delay }}>
            <WaxSeal glyph={seal.glyph} accent={seal.accent} size={seal.size} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EnterCue({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link to="/home" className={cn('splash-enter splash-rise', dark && 'is-dark', className)} style={{ '--d': '2.62s' } as CSSProperties}>
      <span className="splash-enter-disc" aria-hidden>
        <span />
        <span />
        <ArrowRight size={28} />
      </span>
      <span className="splash-enter-label">Entrer dans l'atelier</span>
    </Link>
  );
}

function SplashAtlas({ active, mx, my }: { active: boolean; mx: number; my: number }) {
  return (
    <div className={cn('splash-layer splash-layer-light', active && 'is-active')} aria-hidden={!active} inert={!active}>
      <div className="splash-photo-bg" style={{ transform: `scale(1.03) translate3d(${mx * -10}px, ${my * -8}px, 0)` }} />
      <MemoCorners />
      <div className="splash-constellation-wrap" style={{ transform: `translate3d(${mx * -14}px, ${my * -6}px, 0)` }} aria-hidden>
        <Constellation className="splash-constellation splash-constellation-light" hue="var(--primary)" />
      </div>
      <DriftingSeals seals={LIGHT_SEALS} mx={mx} my={my} />

      <div className="splash-layer-center">
        <span className="splash-kicker splash-rise" style={{ '--d': '0.1s' } as CSSProperties}>
          <Fleuron className="text-[0.8rem]" /> VC Premium Experience <Fleuron className="text-[0.8rem]" />
        </span>

        <div className="splash-focal splash-focal-light">
          <CompassIkigaiIntro size={188} hue="#FFF3B0" speed={1} className="splash-compass" />
        </div>

        <h1 id={active ? 'splash-title' : undefined} className="splash-title splash-rise" style={{ '--d': '2.4s' } as CSSProperties}>
          Comprendre le venture. <span>Vous comprendre.</span>
        </h1>

        <EnterCue />
      </div>
    </div>
  );
}

function SplashConstellation({ active, mx, my }: { active: boolean; mx: number; my: number }) {
  return (
    <div className={cn('splash-layer splash-layer-dark', active && 'is-active')} aria-hidden={!active} inert={!active}>
      <div className="splash-photo-bg" style={{ transform: `scale(1.03) translate3d(${mx * -10}px, ${my * -8}px, 0)` }} />
      <div className="splash-night-veil" />
      <div className="splash-constellation-wrap" style={{ transform: `translate3d(${mx * -16}px, ${my * -8}px, 0)` }} aria-hidden>
        <Constellation className="splash-constellation splash-constellation-dark" hue="var(--primary)" />
      </div>
      <DriftingSeals seals={DARK_SEALS} mx={mx} my={my} />
      <MemoCorners />

      <div className="splash-layer-center">
        <span className="splash-kicker splash-rise" style={{ '--d': '0.1s' } as CSSProperties}>
          <Fleuron className="text-[0.8rem]" /> VC Premium Experience <Fleuron className="text-[0.8rem]" />
        </span>

        <div className="splash-focal splash-focal-dark">
          <CompassIkigaiIntro size={158} hue="var(--primary)" speed={1} className="splash-compass" />
        </div>

        <h1 id={active ? 'splash-title' : undefined} className="splash-title splash-rise" style={{ '--d': '2.4s' } as CSSProperties}>
          Comprendre le venture. <span>Vous comprendre.</span>
        </h1>

        <EnterCue dark />
      </div>
    </div>
  );
}

export default function SplashPage() {
  usePageMeta('Entrer', 'Un portail visuel pour entrer dans VC Premium Experience, entre atlas vivant et ciel de navigation.');

  // The "Choisissez votre lumière" toggle drives the global theme, so the light
  // chosen at the portal carries into the app (and matches the in-app toggle).
  const { theme, toggle } = useTheme();
  const [bind, mx, my] = useParallax();
  const dark = theme === 'dark';

  const onChange = (next: SplashMode) => {
    if (next !== theme) toggle();
  };

  return (
    <section className={cn('splash-portal', dark ? 'splash-dark' : 'splash-light')} aria-labelledby="splash-title">
      <div className="splash-stage" {...bind}>
        <SplashAtlas active={!dark} mx={mx} my={my} />
        <SplashConstellation active={dark} mx={mx} my={my} />
        <ModeToggle mode={theme} onChange={onChange} />
      </div>
    </section>
  );
}
