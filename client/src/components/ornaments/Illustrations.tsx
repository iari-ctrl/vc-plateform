import { useId, useState, type ReactNode } from 'react';
import { publicAssetUrl } from '@shared/base-url.mjs';
import { cn } from '@/lib/utils';

const NIGHT_SKY_URL = publicAssetUrl('splash/bg-sombre.webp', import.meta.env.BASE_URL);

/**
 * Illustrations — the "explorer's atlas" visual language.
 *
 * A small set of hand-built SVG ornaments (compass rose, sea monster, map
 * cartouche, ink stamp, ex-libris, drop cap, constellation) that give the
 * platform a serious-but-playful cartographic soul. Everything is token-aware
 * (uses CSS custom properties / `color-mix`) so it adapts to light & dark, and
 * every motion respects `prefers-reduced-motion` via the global media query.
 */

// ── Compass rose ────────────────────────────────────────────────────────────
/** An antique compass rose. The needle drifts gently; on hover the whole rose
 *  turns a quarter-turn, like a real instrument settling on a bearing. */
export function CompassRose({
  size = 160,
  hue = 'var(--primary)',
  className,
  floating = true,
}: {
  size?: number;
  hue?: string;
  className?: string;
  floating?: boolean;
}) {
  const [bearing, setBearing] = useState(false);
  return (
    <div
      className={cn('inline-block cursor-pointer transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]', className)}
      style={{ transform: bearing ? 'rotate(45deg)' : 'rotate(0deg)' }}
      onMouseEnter={() => setBearing(true)}
      onMouseLeave={() => setBearing(false)}
      aria-hidden
    >
      <svg viewBox="0 0 160 160" width={size} height={size} style={{ display: 'block' }}>
        {/* Rings and ticks carry `pathLength="1"`: a no-op on their own, it
            normalises their length so a caller can trace them with a
            `stroke-dasharray` of 1 whatever the radius (see home-hero.css). */}
        <g stroke={hue} fill="none">
          <circle className="compass-ring" pathLength={1} cx="80" cy="80" r="72" strokeWidth="0.6" opacity="0.4" />
          <circle className="compass-ring" pathLength={1} cx="80" cy="80" r="60" strokeWidth="0.5" opacity="0.5" />
          <circle className="compass-ring" pathLength={1} cx="80" cy="80" r="44" strokeWidth="0.4" opacity="0.3" />
          <circle className="compass-ring" pathLength={1} cx="80" cy="80" r="28" strokeWidth="0.4" opacity="0.25" />
          {/* tick marks around the bezel */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const r1 = i % 2 === 0 ? 66 : 69;
            return (
              <line
                key={i}
                className="compass-tick"
                pathLength={1}
                x1={80 + Math.cos(a) * r1}
                y1={80 + Math.sin(a) * r1}
                x2={80 + Math.cos(a) * 72}
                y2={80 + Math.sin(a) * 72}
                strokeWidth="0.6"
                opacity="0.45"
              />
            );
          })}
        </g>

        {/* cardinal star */}
        <g className="compass-points" fill={hue}>
          <path d="M80 8 L84 76 L80 80 L76 76 Z" opacity="0.9" className={floating ? 'origin-center animate-compass-needle' : undefined} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }} />
          <path d="M80 152 L76 84 L80 80 L84 84 Z" opacity="0.45" />
          <path d="M8 80 L76 76 L80 80 L76 84 Z" opacity="0.4" />
          <path d="M152 80 L84 84 L80 80 L84 76 Z" opacity="0.4" />
        </g>
        <g className="compass-points-minor" fill={hue} opacity="0.5">
          <path d="M29 29 L74 76 L80 80 L76 74 Z" />
          <path d="M131 29 L84 76 L80 80 L84 74 Z" />
          <path d="M29 131 L74 84 L80 80 L76 86 Z" />
          <path d="M131 131 L84 84 L80 80 L84 86 Z" />
        </g>

        <g className="compass-letters" fontFamily="Newsreader" fontStyle="italic" fontSize="9" fill={hue} textAnchor="middle" opacity="0.85" letterSpacing="0.12em">
          <text x="80" y="6">N</text>
          <text x="80" y="159">S</text>
          <text x="5" y="83">O</text>
          <text x="155" y="83">E</text>
        </g>
        <circle className="compass-pin" cx="80" cy="80" r="3" fill={hue} />
      </svg>
    </div>
  );
}

// ── Sea monster ───────────────────────────────────────────────────────────────
/** "Hic sunt dracones." A leviathan curling through the waves — for map corners
 *  and the terra-incognita 404. */
export function SeaMonster({ size = 120, hue = 'var(--primary)', className }: { size?: number; hue?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} style={{ display: 'block' }} aria-hidden>
      <g stroke={hue} strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round">
        <path d="M10 80 Q20 60 40 65 Q55 68 60 55 Q65 42 80 45 Q95 48 100 35" />
        <path d="M100 35 Q105 30 108 25 L112 20" />
        <path d="M100 35 L95 28" />
        <path d="M40 65 Q45 72 50 68" />
        <path d="M10 80 Q5 85 8 92 Q15 95 18 88" />
        <path d="M18 88 Q22 82 28 86" />
        <circle cx="103" cy="32" r="0.9" fill={hue} />
        <path d="M0 105 Q15 100 30 105 T60 105 T90 105 T120 105" opacity="0.45" />
        <path d="M0 112 Q15 107 30 112 T60 112 T90 112 T120 112" opacity="0.3" />
      </g>
    </svg>
  );
}

// ── Map cartouche ─────────────────────────────────────────────────────────────
/** A decorative title cartouche, as drawn on antique maps. */
export function MapCartouche({
  title = 'Tabula Ventura',
  sub = 'Carte des parcours · MMXXVI',
  hue = 'var(--primary)',
  width = 320,
  className,
}: {
  title?: string;
  sub?: string;
  hue?: string;
  width?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 320 120" width={width} height={(width * 120) / 320} className={className} style={{ display: 'block', maxWidth: '100%' }} aria-hidden>
      <g fill="none" stroke={hue} opacity="0.75">
        <path d="M10 60 Q40 20 80 20 L240 20 Q280 20 310 60 Q280 100 240 100 L80 100 Q40 100 10 60 Z" strokeWidth="1" />
        <path d="M20 60 Q45 32 85 32 L235 32 Q275 32 300 60 Q275 88 235 88 L85 88 Q45 88 20 60 Z" strokeWidth="0.5" opacity="0.6" />
        <circle cx="14" cy="60" r="3" fill={hue} />
        <circle cx="306" cy="60" r="3" fill={hue} />
      </g>
      <g fill={hue} opacity="0.35">
        <path d="M30 35 l4 4 -4 4 -4 -4 z" />
        <path d="M290 35 l4 4 -4 4 -4 -4 z" />
        <path d="M30 85 l4 4 -4 4 -4 -4 z" />
        <path d="M290 85 l4 4 -4 4 -4 -4 z" />
      </g>
      <text x="160" y="58" fontFamily="Newsreader" fontStyle="italic" fontSize="27" fill={hue} textAnchor="middle" letterSpacing="0.02em">{title}</text>
      <text x="160" y="80" fontFamily="JetBrains Mono, monospace" fontSize="8.5" fill={hue} textAnchor="middle" letterSpacing="0.28em" opacity="0.7">{sub.toUpperCase()}</text>
    </svg>
  );
}

// ── Ink stamp ─────────────────────────────────────────────────────────────────
/** A rubber-stamp / wax seal mark, slightly rotated, with a hatched fill. */
export function InkStamp({
  label = 'ACCÈS LIBRE',
  date = 'MMXXVI',
  hue = 'var(--secondary)',
  rotate = -5,
  className,
}: {
  label?: string;
  date?: string;
  hue?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-block font-headline', className)}
      style={{ transform: `rotate(${rotate}deg)`, color: hue }}
      aria-hidden
    >
      <span
        className="block px-3.5 pb-1 pt-1.5"
        style={{
          border: `2px solid ${hue}`,
          borderRadius: 6,
          opacity: 0.82,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 2px, color-mix(in srgb, var(--background) 55%, transparent) 2px 3px)',
          boxShadow: `inset 0 0 0 3px color-mix(in srgb, var(--background) 60%, transparent), inset 0 0 0 4px color-mix(in srgb, ${hue} 50%, transparent)`,
        }}
      >
        <span className="block font-body text-[0.625rem] font-bold uppercase tracking-[0.32em]">{label}</span>
        <span className="mt-px block text-center text-[0.5625rem] italic tracking-[0.1em]">{date}</span>
      </span>
    </span>
  );
}

// ── Ex-libris bookplate ─────────────────────────────────────────────────────
/** A bookplate ("from the library of…"), for the footer and reflective panels. */
export function ExLibris({
  owner = 'L’explorateur',
  num = 'Vol. I',
  hue = 'var(--primary)',
  className,
}: {
  owner?: string;
  num?: string;
  hue?: string;
  className?: string;
}) {
  return (
    <div
      className={cn('relative rounded-xl p-5 text-center font-headline', className)}
      style={{
        border: `1px solid color-mix(in srgb, ${hue} 30%, transparent)`,
        color: `color-mix(in srgb, ${hue} 30%, var(--on-background))`,
      }}
      aria-hidden
    >
      <div className="absolute inset-2 rounded-lg border" style={{ borderColor: `color-mix(in srgb, ${hue} 16%, transparent)` }} />
      <div className="relative">
        <div className="font-body text-[0.5625rem] font-semibold uppercase tracking-[0.34em] opacity-80">Ex Libris</div>
        <div className="my-1.5 text-[0.625rem] opacity-40">❦</div>
        <div className="text-[1.35rem] italic leading-none">{owner}</div>
        <div className="my-1.5 text-[0.625rem] opacity-40">❦</div>
        <div className="font-body text-[0.5625rem] uppercase tracking-[0.22em] opacity-80">{num}</div>
      </div>
    </div>
  );
}

// ── Illuminated drop cap ──────────────────────────────────────────────────────
/** A framed, illuminated initial — for opening an article or section. */
export function DropCap({
  letter,
  hue = 'var(--primary)',
  size = 96,
  className,
}: {
  letter: string;
  hue?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={{ display: 'block' }} aria-hidden>
      <rect x="4" y="4" width="92" height="92" rx="6" fill={`color-mix(in srgb, ${hue} 10%, transparent)`} stroke={hue} strokeWidth="1.2" opacity="0.9" />
      <g stroke={hue} strokeWidth="0.5" fill="none" opacity="0.6">
        <path d="M10 10 Q20 15 10 25 Q15 35 25 30 M90 10 Q80 15 90 25 Q85 35 75 30" />
        <path d="M10 90 Q20 85 10 75 Q15 65 25 70 M90 90 Q80 85 90 75 Q85 65 75 70" />
      </g>
      <text x="50" y="74" fontFamily="Newsreader" fontStyle="italic" fontSize="68" fontWeight="600" fill={hue} textAnchor="middle">{letter}</text>
    </svg>
  );
}

// ── Constellation ─────────────────────────────────────────────────────────────
type Star = { x: number; y: number; r: number };
/** A drifting field of twinkling stars joined by faint navigation lines —
 *  the night sky an explorer steers by. Purely decorative. */
export function Constellation({
  className,
  hue = 'var(--primary)',
  stars,
}: {
  className?: string;
  hue?: string;
  stars?: Star[];
}) {
  const pts: Star[] =
    stars ?? [
      { x: 12, y: 22, r: 1.6 },
      { x: 26, y: 14, r: 1.1 },
      { x: 38, y: 30, r: 2.1 },
      { x: 55, y: 18, r: 1.3 },
      { x: 70, y: 34, r: 1.7 },
      { x: 82, y: 20, r: 1.1 },
      { x: 90, y: 44, r: 1.9 },
      { x: 64, y: 52, r: 1.2 },
      { x: 44, y: 58, r: 1.5 },
      { x: 20, y: 50, r: 1.2 },
      { x: 8, y: 66, r: 1.6 },
      { x: 33, y: 76, r: 1.1 },
      { x: 58, y: 78, r: 1.8 },
      { x: 78, y: 68, r: 1.2 },
    ];
  const links: [number, number][] = [
    [0, 1], [1, 3], [3, 5], [2, 3], [4, 6], [4, 7], [7, 8], [8, 9], [9, 10], [8, 11], [11, 12], [12, 13], [6, 13],
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <g stroke={hue} strokeWidth="0.18" opacity="0.4">
        {links.map(([a, b], i) => (
          <line key={i} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} />
        ))}
      </g>
      <g fill={hue}>
        {pts.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            className="animate-twinkle"
            style={{ animationDelay: `${(i % 7) * 0.55}s`, transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}
      </g>
    </svg>
  );
}

// ── Night-sky backdrop ──────────────────────────────────────────────────────
/**
 * A photographic starry sky shown **only in dark mode**, sat behind the
 * hand-drawn cartographic lines. It gives the dark theme a realistic, premium
 * night feel in place of the parchment/vintage texture, while the drawn shapes
 * (constellation, voyage routes, seals…) keep reading on top. In light mode it
 * renders nothing, so the `map-paper` parchment shows through as before.
 *
 * Reuses the splash portal's sky. Layered at `-z-10`
 * so it covers the element's own background but stays under in-flow content.
 */
export function NightSkyBackdrop({
  variant = 'hero',
  className,
}: {
  variant?: 'hero' | 'panel';
  className?: string;
}) {
  const veil =
    variant === 'hero'
      ? // legibility darken at the very top, sky kept clear in the middle, then a
        // clean fade into the page background so the hero melts into what follows
        'linear-gradient(180deg, color-mix(in srgb, var(--background) 30%, transparent) 0%, color-mix(in srgb, var(--background) 10%, transparent) 35%, color-mix(in srgb, var(--background) 55%, transparent) 80%, var(--background) 100%)'
      : // gentle vignette so the gilded routes and place-names read over the sky
        'radial-gradient(125% 110% at 50% 42%, color-mix(in srgb, var(--background) 14%, transparent) 0%, color-mix(in srgb, var(--background) 42%, transparent) 68%, color-mix(in srgb, var(--background) 70%, transparent) 100%)';
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10 hidden dark:block', className)} aria-hidden>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${NIGHT_SKY_URL}")` }} />
      <div className="absolute inset-0" style={{ background: veil }} />
    </div>
  );
}

// ── Latitude / longitude graticule ────────────────────────────────────────────
/** Faint map graticule used as a section/hero background. */
export function Graticule({ className, hue = 'var(--outline)' }: { className?: string; hue?: string }) {
  const id = useId();
  return (
    <svg className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={`grat-${id}`} width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0 H0 V64" fill="none" stroke={hue} strokeWidth="0.5" opacity="0.25" strokeDasharray="1 7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grat-${id})`} />
    </svg>
  );
}

// ── Wax seal badge ────────────────────────────────────────────────────────────
/** A small tinted seal carrying a glyph (e.g. a path's kanji) — the lively,
 *  liftable cousin of `KanjiSeal`, with a wax-drip ring. */
export function WaxSeal({
  glyph,
  accent,
  size = 56,
  className,
}: {
  glyph: ReactNode;
  accent: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn('relative inline-grid shrink-0 place-items-center rounded-full font-headline', className)}
      style={{
        width: size,
        height: size,
        color: accent,
        background: `radial-gradient(circle at 38% 32%, color-mix(in srgb, ${accent} 22%, transparent), color-mix(in srgb, ${accent} 9%, transparent))`,
        border: `1px solid color-mix(in srgb, ${accent} 38%, transparent)`,
        boxShadow: `inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent), 0 2px 8px -2px color-mix(in srgb, ${accent} 40%, transparent)`,
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      {glyph}
    </span>
  );
}
