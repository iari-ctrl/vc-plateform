import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass as CompassIcon, LocateFixed, Minus, Plus } from 'lucide-react';
import { IKIGAI } from '@/content/ikigai';
import { PARCOURS, FAMILY_META, lessonIdsForParcours, type Parcours } from '@/content/parcours';
import { LEVEL_LABEL } from '@/content/labels';
import { useTheme } from '@/context/ThemeContext';
import { useUserData } from '@/context/UserDataContext';
import { MapCartouche, SeaMonster, NightSkyBackdrop } from '@/components/ornaments/Illustrations';
import { legibleAccent } from '@/lib/ikigaiColor';
import { cn } from '@/lib/utils';
import type { Level } from '@/content/types';

/**
 * PathAtlas — the parcours drawn as an explorer's sea-chart.
 *
 * The levelled parcours fan out on concentric arcs (the most welcoming territory
 * — débutant — on the outside; the citadel of fund economics at the heart). The
 * cross-cutting "tous niveaux" parcours sit apart, as outlying islands. Each port
 * is a wax seal (the parcours' kanji + family accent); hovering or focusing one
 * reveals its destination both under the seal and in the inset cartouche, and
 * clicking sets sail for it. With 20+ ports, names stay hidden until hover so the
 * chart reads clean — every parcours is also listed in the index below.
 */

// — Map canvas geometry —
const W = 1280;
const H = 760;
const CX = 640;
const CY = 612;

type BandMeta = { r: number; from: number; to: number; territory: string; sub: string };
const BANDS: Partial<Record<Level, BandMeta>> = {
  debutant:      { r: 512, from: -158, to: -22, territory: 'Terra Prima',     sub: 'Les fondations' },
  intermediaire: { r: 384, from: -150, to: -30, territory: 'Mare Analytica',  sub: 'L’œil & la thèse' },
  avance:        { r: 256, from: -154, to: -26, territory: 'Haute Citadelle', sub: 'La mécanique du fonds' },
};
const ARC_LEVELS: Level[] = ['debutant', 'intermediaire', 'avance'];
// "tous niveaux" parcours become outlying islands, in order.
const ISLANDS = [
  { x: 196, y: 566 },
  { x: 1084, y: 566 },
];
const COMPASS_DIMENSIONS = ['aime', 'doue', 'besoin', 'remunere'] as const;

const rad = (deg: number) => (deg * Math.PI) / 180;
const px = (a: number, r: number) => CX + Math.cos(rad(a)) * r;
const py = (a: number, r: number) => CY + Math.sin(rad(a)) * r;

function arcPath(r: number, from: number, to: number) {
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${px(from, r)} ${py(from, r)} A ${r} ${r} 0 ${large} 1 ${px(to, r)} ${py(to, r)}`;
}

// — pan / zoom limits —
const MIN_SCALE = 0.6;
const MAX_SCALE = 3;
const clampNum = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

type View = { scale: number; tx: number; ty: number };
type CompassRingStyle = CSSProperties & {
  '--path-ikigai-accent': string;
  '--path-ikigai-fill': string;
};

function dimensionAccent(id: string) {
  return IKIGAI.dimensions.find((d) => d.id === id)?.accent ?? 'var(--primary)';
}

function compassRingStyle(id: string, dark: boolean): CompassRingStyle {
  const accent = legibleAccent(dimensionAccent(id), dark);
  return {
    '--path-ikigai-accent': accent,
    '--path-ikigai-fill': `color-mix(in srgb, ${accent} ${dark ? 22 : 14}%, transparent)`,
  };
}

/** Keep the chart from being dragged entirely off-screen (half a viewport of slack). */
function clampView(scale: number, tx: number, ty: number): View {
  const overX = W * 0.5;
  const overY = H * 0.5;
  const minTx = Math.min(0, W * (1 - scale)) - overX;
  const maxTx = Math.max(0, W * (1 - scale)) + overX;
  const minTy = Math.min(0, H * (1 - scale)) - overY;
  const maxTy = Math.max(0, H * (1 - scale)) + overY;
  return { scale, tx: clampNum(tx, minTx, maxTx), ty: clampNum(ty, minTy, maxTy) };
}

type Port = Parcours & { x: number; y: number; angle: number | null; r: number | null; island: boolean; pct: number; order: number; accent: string; kanji: string };

export function PathAtlas({
  className,
  collapsed = false,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { progress } = useUserData();
  const [activeId, setActiveId] = useState<string | null>(null);
  const dark = theme === 'dark';

  const ports = useMemo<Port[]>(() => {
    const orderOf = new Map(PARCOURS.map((p, i) => [p.id, i] as const));
    const pctOf = (p: Parcours) => {
      const ids = lessonIdsForParcours(p);
      const done = ids.filter((id) => progress[id]?.status === 'done').length;
      return ids.length ? Math.round((done / ids.length) * 100) : 0;
    };
    // Resolve the display fields a parcours leaves to its family (accent, kanji).
    const base = (p: Parcours) => {
      const meta = FAMILY_META[p.family];
      return { accent: p.accent ?? meta.accent, kanji: p.kanji ?? meta.kanji, order: orderOf.get(p.id) ?? 0, pct: pctOf(p) };
    };
    const out: Port[] = [];
    // concentric arcs, by level
    for (const lvl of ARC_LEVELS) {
      const band = BANDS[lvl]!;
      const group = [...PARCOURS]
        .filter((p) => p.level === lvl)
        .sort((a, b) => (orderOf.get(a.id) ?? 0) - (orderOf.get(b.id) ?? 0));
      group.forEach((p, i) => {
        const tt = group.length === 1 ? 0.5 : i / (group.length - 1);
        const angle = band.from + (band.to - band.from) * tt;
        out.push({ ...p, ...base(p), angle, r: band.r, island: false, x: px(angle, band.r), y: py(angle, band.r) });
      });
    }
    // islands ("tous niveaux")
    [...PARCOURS]
      .filter((p) => p.level === 'tous')
      .forEach((p, i) => {
        const spot = ISLANDS[i] ?? ISLANDS[ISLANDS.length - 1];
        out.push({ ...p, ...base(p), angle: null, r: null, island: true, x: spot.x, y: spot.y });
      });
    return out;
  }, [progress]);

  const active = activeId ? ports.find((p) => p.id === activeId) ?? null : null;
  const compassRingStyles = useMemo(() => COMPASS_DIMENSIONS.map((id) => compassRingStyle(id, dark)), [dark]);

  // — Pan / zoom: make the chart as grabbable & navigable as the reference atlas —
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [view, setView] = useState<View>({ scale: 1, tx: 0, ty: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const drag = useRef<{ id: number; startX: number; startY: number; lastX: number; lastY: number; moved: boolean } | null>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinch = useRef<{ dist: number } | null>(null);
  const dragged = useRef(false); // true once a real drag/pinch happened — suppresses the port click that follows

  // client (px) → viewBox coordinates, so panning tracks the cursor 1:1 and zoom can centre on it
  const toViewBox = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: W / 2, y: H / 2 };
    return { x: ((clientX - rect.left) / rect.width) * W, y: ((clientY - rect.top) / rect.height) * H };
  }, []);

  // zoom by a multiplicative factor, keeping `focus` (in viewBox coords) pinned under the cursor
  const applyZoom = useCallback((factor: number, focus: { x: number; y: number }) => {
    if (collapsed) return;
    setView((v) => {
      const scale = clampNum(v.scale * factor, MIN_SCALE, MAX_SCALE);
      const k = scale / v.scale;
      return clampView(scale, focus.x - (focus.x - v.tx) * k, focus.y - (focus.y - v.ty) * k);
    });
  }, [collapsed]);

  const recenter = useCallback(() => {
    if (collapsed) return;
    setView({ scale: 1, tx: 0, ty: 0 });
  }, [collapsed]);

  // wheel must be a non-passive native listener so we can preventDefault and zoom-to-cursor
  useEffect(() => {
    const el = svgRef.current;
    if (!el || collapsed) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyZoom(Math.exp(-e.deltaY * 0.0015), toViewBox(e.clientX, e.clientY));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyZoom, toViewBox, collapsed]);

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (collapsed) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      dragged.current = false;
      drag.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, moved: false };
    } else if (pointers.current.size === 2) {
      drag.current = null; // hand over to pinch
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
    }
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (collapsed) return;
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // two-finger pinch zoom (touch)
    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current.dist > 0) applyZoom(dist / pinch.current.dist, toViewBox((a.x + b.x) / 2, (a.y + b.y) / 2));
      pinch.current.dist = dist;
      dragged.current = true;
      return;
    }

    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    // ignore micro-movements so a click on a port still navigates
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 4) return;
    if (!d.moved) {
      d.moved = true;
      dragged.current = true;
      setIsPanning(true);
      svgRef.current?.setPointerCapture(e.pointerId);
    }
    const rect = svgRef.current!.getBoundingClientRect();
    const dx = (e.clientX - d.lastX) * (W / rect.width);
    const dy = (e.clientY - d.lastY) * (H / rect.height);
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    setView((v) => clampView(v.scale, v.tx + dx, v.ty + dy));
  };

  const endPointer = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (collapsed) return;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (drag.current && e.pointerId === drag.current.id) {
      if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
      drag.current = null;
      setIsPanning(false);
    }
    // a finger lifted mid-pinch → resume single-finger pan from the survivor
    if (pointers.current.size === 1) {
      const [[id, pos]] = [...pointers.current.entries()];
      drag.current = { id, startX: pos.x, startY: pos.y, lastX: pos.x, lastY: pos.y, moved: false };
    }
  };

  const effectiveView = useMemo(() => {
    if (collapsed) {
      const scale = 2.2;
      return {
        scale,
        tx: W / 2 - CX * scale,
        ty: H / 2 - CY * scale,
      };
    }
    return view;
  }, [collapsed, view]);

  return (
    <div className={className}>
      <div
        className={cn(
          "map-paper grain relative isolate flex items-center justify-center overflow-hidden transition-[max-height,border-color,opacity] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed
            ? "max-h-0 border-transparent opacity-0 pointer-events-none"
            : "max-h-[820px] rounded-2xl border border-outline-variant bg-surface-container-low/70 opacity-100"
        )}
      >
        {/* Dark mode: the starry sky behind the chart (light mode keeps the parchment). */}
        <NightSkyBackdrop variant="panel" />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none select-none shrink-0"
          style={{ cursor: collapsed ? 'default' : isPanning ? 'grabbing' : 'grab' }}
          role="group"
          aria-label="Carte interactive des parcours — glissez pour déplacer, molette ou +/− pour zoomer"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
        >
          <title>Carte des parcours — glissez pour déplacer, molette ou +/− pour zoomer, cliquez une terre pour explorer</title>

          <g
            transform={`translate(${effectiveView.tx} ${effectiveView.ty}) scale(${effectiveView.scale})`}
            style={{
              transition: isPanning ? 'none' : 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Map elements that fade out when collapsed */}
            <g
              className="transition-opacity duration-500"
              opacity={collapsed ? 0 : 1}
              style={{ pointerEvents: collapsed ? 'none' : 'auto' }}
            >
              {/* — graticule: latitudes & meridians — */}
              {[150, 256, 384, 512].map((r) => (
                <circle key={`lat-${r}`} cx={CX} cy={CY} r={r} fill="none" stroke="var(--outline)" strokeWidth="0.5" strokeDasharray="1 9" opacity="0.2" />
              ))}
              {Array.from({ length: 9 }).map((_, i) => {
                const a = rad(-164 + i * 19);
                return (
                  <line key={`mer-${i}`} x1={px(-164 + i * 19, 70)} y1={py(-164 + i * 19, 70)} x2={CX + Math.cos(a) * 540} y2={CY + Math.sin(a) * 540} stroke="var(--outline)" strokeWidth="0.5" strokeDasharray="1 12" opacity="0.14" />
                );
              })}

              {/* — band guide arcs + territory labels (set just outside each arc's left shoulder) — */}
              {ARC_LEVELS.map((lvl) => {
                const b = BANDS[lvl]!;
                const dim = active && active.level !== lvl;
                // territory names sit just *inside* each arc's upper-left shoulder,
                // so they never compete with the ports' (outward) place-names.
                const la = -128;
                const lx = px(la, b.r - 28);
                const ly = py(la, b.r - 28);
                return (
                  <g key={lvl} className="transition-opacity duration-300" opacity={dim ? 0.32 : 1}>
                    <path d={arcPath(b.r, b.from - 4, b.to + 4)} fill="none" stroke="var(--primary)" strokeWidth="1" strokeDasharray="1 7" opacity="0.4" />
                    <text x={lx} y={ly} textAnchor="middle" fontFamily="Newsreader" fontStyle="italic" fontSize="18" fill="var(--primary)" opacity="0.85" letterSpacing="0.04em">{b.territory}</text>
                    <text x={lx} y={ly + 16} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8.5" fill="var(--on-surface-variant)" letterSpacing="0.24em" opacity="0.6">{b.sub.toUpperCase()}</text>
                  </g>
                );
              })}

              {/* — island outlines for the "tous niveaux" ports — */}
              {ports.filter((p) => p.island).map((p) => (
                <g key={`isle-${p.id}`} opacity={active && active.id !== p.id ? 0.32 : 1} className="transition-opacity duration-300">
                  <circle cx={p.x} cy={p.y} r="40" fill="none" stroke="var(--outline)" strokeWidth="0.8" strokeDasharray="2 5" opacity="0.4" />
                  <circle cx={p.x} cy={p.y} r="52" fill="none" stroke="var(--outline)" strokeWidth="0.5" strokeDasharray="1 9" opacity="0.25" />
                </g>
              ))}

              {/* — cartouche (correctly sized, anchored at the top) — */}
              <g transform={`translate(${CX - 130}, 6)`}>
                <MapCartouche width={260} />
              </g>

              {/* — ports of call — */}
              {ports.map((p) => {
                const dim = active && active.id !== p.id;
                const isActive = active?.id === p.id;
                const sealR = isActive ? 22 : 18;
                // label placement
                let lx: number, ly: number, anchor: 'start' | 'middle' | 'end';
                if (p.island || p.angle === null || p.r === null) {
                  lx = p.x;
                  ly = p.y + 64;
                  anchor = 'middle';
                } else {
                  const dist = p.r > 320 ? 30 : 27;
                  lx = px(p.angle, p.r + dist);
                  ly = py(p.angle, p.r + dist);
                  const cosA = Math.cos(rad(p.angle));
                  anchor = cosA > 0.34 ? 'end' : cosA < -0.34 ? 'start' : 'middle';
                }
                const ringR = sealR + 5;
                const circ = 2 * Math.PI * ringR;
                return (
                  <g
                    key={p.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`${p.title} — ${FAMILY_META[p.family].label}, ${LEVEL_LABEL[p.level]}, environ ${p.time.coreHours} heures`}
                    className="cursor-pointer outline-none transition-opacity duration-300"
                    style={{ opacity: dim ? 0.26 : 1 }}
                    onMouseEnter={() => setActiveId(p.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onFocus={() => setActiveId(p.id)}
                    onBlur={() => setActiveId(null)}
                    onClick={() => {
                      if (dragged.current || collapsed) return; // ignore the click that ends a pan or when collapsed
                      navigate(`/parcours/${p.slug}`);
                    }}
                    onKeyDown={(e) => {
                      if (collapsed) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/parcours/${p.slug}`);
                      }
                    }}
                  >
                    {/* parchment punch-out so the seal reads above the grid */}
                    <circle cx={p.x} cy={p.y} r={sealR + 8} fill="var(--surface-container-lowest)" opacity="0.94" />
                    {p.pct > 0 && (
                      <circle cx={p.x} cy={p.y} r={ringR} fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (p.pct / 100) * circ} transform={`rotate(-90 ${p.x} ${p.y})`} opacity="0.85" />
                    )}
                    <circle cx={p.x} cy={p.y} r={sealR} fill={`color-mix(in srgb, ${p.accent} 16%, var(--surface-container-lowest))`} stroke={p.accent} strokeWidth={isActive ? 2 : 1.3} className="transition-all duration-300" />
                    {isActive && (
                      <circle cx={p.x} cy={p.y} r={sealR + 11} fill="none" stroke={p.accent} strokeWidth="1" strokeDasharray="2 4" opacity="0.6" className="animate-spin-slow" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                    )}
                    <text x={p.x} y={p.y + sealR * 0.34} textAnchor="middle" fontFamily="Newsreader" fontSize={sealR * 0.94} fill={p.accent} className="pointer-events-none select-none">{p.kanji ?? '◆'}</text>
                    {/* label — revealed on hover/focus so 20+ ports stay legible */}
                    {isActive && (
                      <text x={lx} y={ly} textAnchor={anchor} className="pointer-events-none select-none">
                        <tspan x={lx} fontFamily="JetBrains Mono, monospace" fontSize="8" fill={p.accent} letterSpacing="0.14em">{FAMILY_META[p.family].label.toUpperCase()}</tspan>
                        <tspan x={lx} dy="13" fontFamily="Newsreader" fontStyle="italic" fontSize="14.5" fill="var(--on-surface)">{p.title}</tspan>
                      </text>
                    )}
                  </g>
                );
              })}

              {/* — leviathans in the margins — */}
              <g transform={`translate(${W - 170}, ${H - 142})`}>
                <SeaMonster size={120} />
              </g>
              <g transform={`translate(46, ${H - 132}) scale(-1, 1)`}>
                <SeaMonster size={92} />
              </g>
            </g>

            {/* — compass rose at the helm (outside of fadeout so it stays visible and triggers open/retract) — */}
            <g
              transform={`translate(${CX}, ${CY})`}
              opacity="0.92"
              className="path-atlas-compass"
              role="link"
              tabIndex={0}
              aria-label="Aller au cahier d'introspection et test d'orientation (Ikigai)"
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation();
                if (!collapsed) {
                  navigate('/onboarding');
                }
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                if (!collapsed) {
                  navigate('/onboarding');
                }
              }}
            >
              <circle className="path-atlas-compass-focus" cx="0" cy="0" r="60" fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
              <g fill="transparent" stroke="var(--primary)">
                <circle className="path-atlas-compass-ring path-atlas-compass-ring-1" cx="0" cy="0" r="50" strokeWidth="0.6" vectorEffect="non-scaling-stroke" style={compassRingStyles[0]} />
                <circle className="path-atlas-compass-ring path-atlas-compass-ring-2" cx="0" cy="0" r="38" strokeWidth="0.5" vectorEffect="non-scaling-stroke" style={compassRingStyles[1]} />
                <circle className="path-atlas-compass-ring path-atlas-compass-ring-3" cx="0" cy="0" r="26" strokeWidth="0.6" vectorEffect="non-scaling-stroke" style={compassRingStyles[2]} />
                <circle className="path-atlas-compass-ring path-atlas-compass-ring-4" cx="0" cy="0" r="16" strokeWidth="0.6" vectorEffect="non-scaling-stroke" style={compassRingStyles[3]} />
              </g>
              <g className="path-atlas-compass-details">
                <g fill="var(--primary)">
                  <path d="M0 -46 L4.5 -5 L0 0 L-4.5 -5 Z" opacity="0.9" />
                  <path d="M0 46 L-4.5 5 L0 0 L4.5 5 Z" opacity="0.45" />
                  <path d="M-46 0 L-5 -4.5 L0 0 L-5 4.5 Z" opacity="0.45" />
                  <path d="M46 0 L5 4.5 L0 0 L5 -4.5 Z" opacity="0.45" />
                </g>
                <g fill="var(--primary)" opacity="0.5">
                  <path d="M-30 -30 L-5 -5 L0 0 L-5 -5 Z" />
                  <path d="M30 -30 L5 -5 L0 0 L5 -5 Z" />
                  <path d="M-30 30 L-5 5 L0 0 L-5 5 Z" />
                  <path d="M30 30 L5 5 L0 0 L5 5 Z" />
                </g>
                <circle r="2.4" fill="var(--primary)" />
                <text y="-54" textAnchor="middle" fontFamily="Newsreader" fontStyle="italic" fontSize="10" fill="var(--primary)" opacity="0.8">N</text>
              </g>
            </g>
          </g>
        </svg>

        {/* — pan / zoom controls (top-left, map convention) — */}
        <div className={cn("absolute left-3 top-3 z-10 flex flex-col gap-1.5 transition-opacity duration-300", collapsed && "opacity-0 pointer-events-none")}>
          <button
            type="button"
            aria-label="Zoom avant"
            onClick={() => applyZoom(1.3, { x: W / 2, y: H / 2 })}
            className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant bg-surface-container-lowest/85 text-surface-variant shadow-editorial-sm backdrop-blur-sm transition-colors hover:bg-surface-container-lowest hover:text-foreground"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            aria-label="Zoom arrière"
            onClick={() => applyZoom(1 / 1.3, { x: W / 2, y: H / 2 })}
            className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant bg-surface-container-lowest/85 text-surface-variant shadow-editorial-sm backdrop-blur-sm transition-colors hover:bg-surface-container-lowest hover:text-foreground"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            aria-label="Recentrer la carte"
            onClick={recenter}
            className="mt-0.5 grid h-9 w-9 place-items-center rounded-full border border-outline-variant bg-surface-container-lowest/85 text-surface-variant shadow-editorial-sm backdrop-blur-sm transition-colors hover:bg-surface-container-lowest hover:text-foreground"
          >
            <LocateFixed size={16} />
          </button>
        </div>

        {/* — inset cartouche (reads the active port) — */}
        <div className={cn("pointer-events-none absolute bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:top-4 sm:max-w-[18rem] transition-opacity duration-300", collapsed && "opacity-0 pointer-events-none")}>
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest/90 px-4 py-3 shadow-editorial-sm backdrop-blur-sm transition-all duration-300">
            {active ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: active.accent }} />
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-surface-variant">{FAMILY_META[active.family].label} · {LEVEL_LABEL[active.level]} · ≈ {active.time.coreHours} h</span>
                </div>
                <p className="mt-1.5 font-headline text-headline-sm font-semibold leading-tight">{active.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-surface-variant">{active.hook}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--primary)]">Cliquer pour mettre le cap <ArrowRight size={13} /></p>
              </>
            ) : (
              <>
                <p className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-surface-variant">
                  <CompassIcon size={13} className="text-[color:var(--primary)]" /> Tabula Ventura
                </p>
                <p className="mt-1.5 font-headline text-headline-sm font-semibold leading-tight">Survolez un parcours pour le découvrir</p>
                <p className="mt-1 text-xs leading-relaxed text-surface-variant">Les parcours, du rivage des débutants jusqu’à la haute citadelle des fonds — et les parcours « tous niveaux » en îles. Survolez un sceau pour révéler sa destination ; cliquez pour mettre le cap. Tout reste librement explorable.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* — accessible / mobile-friendly index of the same ports — */}
      <div
        className={cn(
          "mt-4 flex flex-wrap gap-2 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
          collapsed
            ? "max-h-0 opacity-0 pointer-events-none mt-0"
            : "max-h-[500px] opacity-100"
        )}
      >
        {PARCOURS.map((p) => {
          const meta = FAMILY_META[p.family];
          const accent = p.accent ?? meta.accent;
          return (
            <Link
              key={p.id}
              to={`/parcours/${p.slug}`}
              onMouseEnter={() => setActiveId(p.id)}
              onMouseLeave={() => setActiveId(null)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-xs font-medium text-surface-variant transition-colors hover:text-foreground"
              style={activeId === p.id ? { borderColor: `color-mix(in srgb, ${accent} 55%, transparent)`, color: 'var(--on-surface)' } : undefined}
            >
              <span className="font-headline text-sm" style={{ color: accent }}>{p.kanji ?? meta.kanji}</span>
              {p.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
