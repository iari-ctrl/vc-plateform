import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { HOME_BAR_WORDMARK_ACCENT, HOME_FORMATION, HOME_INTELLIGENCE } from '@/components/chrome/homeBar';
import { cn } from '@/lib/utils';

const BRIDGE_TITLE = 'Deux pôles pour apprendre et analyser.';
const FORMATION_DESCRIPTION = 'Parcours, certifications, bibliothèque et dictionnaire structurent l’apprentissage.';
const INTELLIGENCE_DESCRIPTION =
  'Analyses, dossiers, convictions et méthode structurent la lecture des marchés et des décisions.';

// The reference arches are not ellipse halves: they use two cubic segments with
// a 3.174:1 span-to-rise ratio and a broad, nearly flat crown. These coordinates
// preserve that measured profile in the bridge's existing responsive viewBoxes.
const DESKTOP_LEFT_PATH =
  'M 8 168 C 33.30 74.81 127.09 0.40 274.00 0.40 C 420.91 0.40 517.31 74.81 540 168';
const DESKTOP_RIGHT_PATH =
  'M 992 168 C 969.31 74.81 872.91 0.40 726.00 0.40 C 579.09 0.40 485.30 74.81 460 168';
const MOBILE_LEFT_PATH =
  'M 8 300 C 54.79 127.64 228.28 -9.99 500.00 -9.99 C 771.72 -9.99 950.02 127.64 992 300';
const MOBILE_RIGHT_PATH =
  'M 992 18 C 950.02 190.36 771.72 327.99 500.00 327.99 C 228.28 327.99 54.79 190.36 8 18';

const EASING = '.76 0 .24 1';

type ArcMarker = 'formation' | 'intelligence';

type ArcDiagramProps = {
  className?: string;
  leftPath: string;
  rightPath?: string;
  leftPathId: string;
  rightPathId?: string;
  leftMarker?: ArcMarker;
  markerSize?: number;
  viewBoxHeight?: number;
  reducedMotion: boolean;
  leftStaticPosition: { x: number; y: number };
  rightStaticPosition?: { x: number; y: number };
};

type MobileArcProps = {
  className?: string;
  path: string;
  pathId: string;
  marker: ArcMarker;
  reducedMotion: boolean;
  staticPosition: { x: number; y: number };
};

function readReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return reducedMotion;
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-headline uppercase tracking-[0.18em] text-foreground', className)}>
      Maison <span className={HOME_BAR_WORDMARK_ACCENT}>Sapience VC</span>
    </span>
  );
}

function PillarLink({ className, label, to }: { className?: string; label: string; to: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex w-fit font-mono text-[0.68rem] font-medium uppercase tracking-[0.24em] transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--primary)]',
        className,
      )}
    >
      {label}
    </Link>
  );
}

function AnimatedMarker({
  pathId,
  marker,
  markerSize,
}: {
  pathId: string;
  marker: ArcMarker;
  markerSize: number;
}) {
  const offset = -markerSize / 2;

  return (
    <g>
      <animateMotion
        dur="4s"
        begin="0s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;1"
        keySplines={EASING}
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
      <g>
        <animateTransform
          attributeName="transform"
          type="scale"
          dur="4s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="spline"
          values="0;1.15;1;1;0"
          keyTimes="0;0.03;0.08;0.94;1"
          keySplines=".2 0 .2 1;.16 1 .3 1;.76 0 .24 1;.76 0 .24 1"
        />
        <rect
          x={offset}
          y={offset}
          width={markerSize}
          height={markerSize}
          fill={marker === 'formation' ? 'var(--primary)' : 'var(--secondary)'}
        />
      </g>
    </g>
  );
}

function StaticMarker({ marker, x, y, markerSize }: { marker: ArcMarker; x: number; y: number; markerSize: number }) {
  const offset = -markerSize / 2;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        data-home-bridge-static-marker=""
        x={offset}
        y={offset}
        width={markerSize}
        height={markerSize}
        fill={marker === 'formation' ? 'var(--primary)' : 'var(--secondary)'}
      />
    </g>
  );
}

function ArcDiagram({
  className,
  leftPath,
  rightPath,
  leftPathId,
  rightPathId,
  leftMarker = 'formation',
  markerSize = 9,
  viewBoxHeight = 318,
  reducedMotion,
  leftStaticPosition,
  rightStaticPosition,
}: ArcDiagramProps) {
  return (
    <svg
      data-home-bridge-svg=""
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 1000 ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      className={cn('block w-full max-w-full overflow-visible', className)}
      style={{ color: 'color-mix(in srgb, var(--outline) 76%, var(--on-background))' } as CSSProperties}
    >
      <path
        id={leftPathId}
        d={leftPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
        opacity="0.72"
      />
      {rightPath && rightPathId ? (
        <path
          id={rightPathId}
          d={rightPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
          opacity="0.72"
        />
      ) : null}

      {reducedMotion ? (
        <>
          <StaticMarker marker={leftMarker} markerSize={markerSize} x={leftStaticPosition.x} y={leftStaticPosition.y} />
          {rightStaticPosition ? (
            <StaticMarker marker="intelligence" markerSize={markerSize} x={rightStaticPosition.x} y={rightStaticPosition.y} />
          ) : null}
        </>
      ) : (
        <>
          <AnimatedMarker marker={leftMarker} markerSize={markerSize} pathId={leftPathId} />
          {rightPathId ? (
            <AnimatedMarker marker="intelligence" markerSize={markerSize} pathId={rightPathId} />
          ) : null}
        </>
      )}
    </svg>
  );
}

function MobileArc({ className, path, pathId, marker, reducedMotion, staticPosition }: MobileArcProps) {
  return (
    <>
      <ArcDiagram
        className={cn(className, 'sm:hidden')}
        leftPath={path}
        leftPathId={`${pathId}-compact`}
        leftMarker={marker}
        markerSize={24}
        reducedMotion={reducedMotion}
        leftStaticPosition={staticPosition}
      />
      <ArcDiagram
        className={cn(className, 'hidden sm:block md:hidden')}
        leftPath={path}
        leftPathId={`${pathId}-small`}
        leftMarker={marker}
        markerSize={16}
        reducedMotion={reducedMotion}
        leftStaticPosition={staticPosition}
      />
      <ArcDiagram
        className={cn(className, 'hidden md:block')}
        leftPath={path}
        leftPathId={`${pathId}-medium`}
        leftMarker={marker}
        markerSize={13}
        reducedMotion={reducedMotion}
        leftStaticPosition={staticPosition}
      />
    </>
  );
}

export function HomeEditorialBridge() {
  const rawId = useId();
  const svgId = useMemo(() => rawId.replace(/[^a-zA-Z0-9_-]/g, ''), [rawId]);
  const titleId = `${rawId}-title`;
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [hasEntered, setHasEntered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) {
      setHasEntered(true);
      return undefined;
    }

    const setSvgPaused = (paused: boolean) => {
      section.querySelectorAll<SVGSVGElement>('svg[data-home-bridge-svg]').forEach((svg) => {
        if (paused) {
          svg.pauseAnimations?.();
        } else {
          svg.unpauseAnimations?.();
        }
      });
    };

    setSvgPaused(true);

    if (typeof IntersectionObserver === 'undefined') {
      setHasEntered(true);
      setIsVisible(true);
      setSvgPaused(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setIsVisible(visible);
        if (visible) setHasEntered(true);
        setSvgPaused(!visible);
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const desktopLeftPathId = `home-bridge-${svgId}-desktop-left`;
  const desktopRightPathId = `home-bridge-${svgId}-desktop-right`;
  const mobileLeftPathId = `home-bridge-${svgId}-mobile-left`;
  const mobileRightPathId = `home-bridge-${svgId}-mobile-right`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby={titleId}
      data-home-bridge-visible={isVisible ? 'true' : 'false'}
      className="relative bg-background px-4 pb-[calc(5rem+var(--home-mobile-nav-h)+env(safe-area-inset-bottom))] pt-0 text-foreground sm:px-6 md:pb-28 lg:px-8 lg:pb-36"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <div
          aria-hidden="true"
          className={cn(
            'h-px origin-left bg-[color-mix(in_srgb,var(--outline-variant)_78%,transparent)] transition-transform duration-[1200ms] ease-[cubic-bezier(.85,0,.15,1)] motion-reduce:scale-x-100 motion-reduce:transition-none',
            hasEntered ? 'scale-x-100' : 'scale-x-0',
          )}
        />

        <h2
          id={titleId}
          className="mt-16 max-w-full font-headline text-[clamp(2.15rem,10vw,4rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-balance sm:mt-20 sm:max-w-[58rem] sm:text-[clamp(3rem,8vw,5.8rem)] lg:mt-24 lg:max-w-[55%]"
        >
          {BRIDGE_TITLE}
        </h2>

        <div className="mt-14 lg:hidden">
          <div className="max-w-[35rem]">
            <PillarLink className="text-[color:var(--primary)]" label={HOME_FORMATION.label} to={HOME_FORMATION.to} />
            <p className="mt-4 text-sm leading-relaxed text-surface-variant text-pretty sm:text-base">
              {FORMATION_DESCRIPTION}
            </p>
          </div>

          <MobileArc
            className="mt-8 aspect-[3.15/1]"
            marker="formation"
            path={MOBILE_LEFT_PATH}
            pathId={mobileLeftPathId}
            reducedMotion={reducedMotion}
            staticPosition={{ x: 992, y: 300 }}
          />

          <div className="mx-auto mt-3 max-w-[36rem] text-center">
            <Wordmark className="text-[0.86rem] sm:text-[1rem]" />
          </div>

          <MobileArc
            className="mt-3 aspect-[3.15/1]"
            marker="intelligence"
            path={MOBILE_RIGHT_PATH}
            pathId={mobileRightPathId}
            reducedMotion={reducedMotion}
            staticPosition={{ x: 8, y: 18 }}
          />

          <div className="ml-auto mt-7 max-w-[35rem] text-right">
            <PillarLink className="ml-auto text-[color:var(--secondary)]" label={HOME_INTELLIGENCE.label} to={HOME_INTELLIGENCE.to} />
            <p className="mt-4 text-sm leading-relaxed text-surface-variant text-pretty sm:text-base">
              {INTELLIGENCE_DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="mt-28 hidden lg:block">
          <ArcDiagram
            className="aspect-[5.85/1]"
            leftPath={DESKTOP_LEFT_PATH}
            rightPath={DESKTOP_RIGHT_PATH}
            leftPathId={desktopLeftPathId}
            rightPathId={desktopRightPathId}
            viewBoxHeight={171}
            reducedMotion={reducedMotion}
            leftStaticPosition={{ x: 540, y: 168 }}
            rightStaticPosition={{ x: 460, y: 168 }}
          />

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-6 font-medium">
            <PillarLink className="tracking-[0.26em] text-[color:var(--primary)]" label={HOME_FORMATION.label} to={HOME_FORMATION.to} />
            <Wordmark className="text-center text-[0.9rem] tracking-[0.2em]" />
            <PillarLink
              className="ml-auto tracking-[0.26em] text-[color:var(--secondary)]"
              label={HOME_INTELLIGENCE.label}
              to={HOME_INTELLIGENCE.to}
            />
          </div>

          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-8 border-t border-outline-variant pt-6 text-sm leading-relaxed text-surface-variant">
            <p className="text-left text-pretty">{FORMATION_DESCRIPTION}</p>
            <span aria-hidden="true" className="w-px bg-outline-variant" />
            <p className="text-right text-pretty">{INTELLIGENCE_DESCRIPTION}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
