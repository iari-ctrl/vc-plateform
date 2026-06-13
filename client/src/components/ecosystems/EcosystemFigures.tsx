import type { ReactNode } from 'react';
import type { EcosystemFigure, FigureRating } from '@/content/types';

/**
 * Figures des dossiers d'écosystème — graphiques de données et schémas
 * conceptuels rendus sans aucune dépendance ni asset externe.
 *
 *  - Les comparaisons de grandeurs (bars), la matrice et la taxonomie sont en
 *    HTML/flex/grid : robustes, responsives, et theme-aware via les tokens.
 *  - La courbe (line) et la carte de positionnement (quadrant) sont en SVG natif,
 *    avec des couleurs pilotées par `currentColor` (classes de tokens) pour suivre
 *    le thème clair/sombre. L'`accent` du dossier colore la donnée saillante.
 *
 * Chaque figure est encadrée par <FigureFrame> (titre, légende, source) et porte
 * un libellé accessible.
 */

const RATING_DOTS: Record<FigureRating, number> = { none: 0, low: 1, mid: 2, high: 3 };
const RATING_LABEL: Record<FigureRating, string> = {
  none: 'absent',
  low: 'faible',
  mid: 'moyen',
  high: 'fort',
};

function FigureFrame({
  title,
  caption,
  source,
  ariaLabel,
  children,
}: {
  title: string;
  caption?: string;
  source?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-7 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low/40">
      <figcaption className="border-b border-outline-variant px-5 py-3">
        <p className="font-headline text-[0.95rem] font-semibold leading-tight text-foreground">{title}</p>
        {caption && <p className="mt-1 text-[0.8rem] leading-relaxed text-surface-variant">{caption}</p>}
      </figcaption>
      <div className="px-5 py-5" role="img" aria-label={ariaLabel ?? title}>
        {children}
      </div>
      {source && (
        <p className="border-t border-dashed border-outline-variant px-5 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-surface-variant">
          Source · {source}
        </p>
      )}
    </figure>
  );
}

// ── Bars — comparaison de grandeurs ──────────────────────────────────────────
function Bars({ figure, accent }: { figure: Extract<EcosystemFigure, { kind: 'bars' }>; accent: string }) {
  const max = Math.max(...figure.bars.map((b) => b.value), 0);
  return (
    <FigureFrame title={figure.title} caption={figure.caption} source={figure.source} ariaLabel={figure.title}>
      <ul className="space-y-3.5">
        {figure.bars.map((b, i) => {
          const pct = max > 0 ? Math.max((b.value / max) * 100, 1.5) : 0;
          const hot = b.highlight ?? false;
          return (
            <li key={i}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className={hot ? 'font-medium text-foreground' : 'text-surface-variant'}>{b.label}</span>
                <span className="shrink-0 font-mono text-[0.8rem] tabular-nums text-foreground">
                  {b.valueLabel ?? `${b.value}${figure.unit ? ` ${figure.unit}` : ''}`}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${pct}%`, backgroundColor: accent, opacity: hot ? 1 : 0.42 }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </FigureFrame>
  );
}

// ── Matrix — lignes × colonnes notées en pastilles ───────────────────────────
function Dots({ rating, accent }: { rating: FigureRating; accent: string }) {
  const filled = RATING_DOTS[rating];
  return (
    <span className="inline-flex items-center gap-1" title={RATING_LABEL[rating]} aria-label={RATING_LABEL[rating]}>
      {[0, 1, 2].map((d) => (
        <span
          key={d}
          className="h-2 w-2 rounded-full"
          style={d < filled ? { backgroundColor: accent } : { backgroundColor: 'var(--outline-variant)', opacity: 0.7 }}
        />
      ))}
    </span>
  );
}

function Matrix({ figure, accent }: { figure: Extract<EcosystemFigure, { kind: 'matrix' }>; accent: string }) {
  const cols = figure.columns.length;
  return (
    <FigureFrame title={figure.title} caption={figure.caption} source={figure.source} ariaLabel={figure.title}>
      <div className="-mx-1 overflow-x-auto px-1">
        <div
          className="min-w-[28rem]"
          style={{ display: 'grid', gridTemplateColumns: `minmax(0,1.5fr) repeat(${cols}, minmax(0,1fr))` }}
        >
          <div />
          {figure.columns.map((c) => (
            <div key={c} className="px-2 pb-3 text-center text-[0.78rem] font-medium leading-tight text-foreground">
              {c}
            </div>
          ))}
          {figure.rows.map((row, ri) => (
            <div key={ri} className="contents">
              <div className="border-t border-outline-variant py-3 pr-3 text-[0.82rem] leading-snug text-surface-variant">
                {row.label}
              </div>
              {row.cells.map((cell, ci) => (
                <div
                  key={ci}
                  className="flex flex-col items-center justify-center gap-1 border-t border-outline-variant py-3"
                  title={cell.note}
                >
                  <Dots rating={cell.rating} accent={accent} />
                  {cell.note && <span className="px-1 text-center text-[0.62rem] leading-tight text-surface-variant">{cell.note}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
}

// ── Taxonomy — une racine et ses familles ────────────────────────────────────
function Taxonomy({ figure, accent }: { figure: Extract<EcosystemFigure, { kind: 'taxonomy' }>; accent: string }) {
  return (
    <FigureFrame title={figure.title} caption={figure.caption} source={figure.source} ariaLabel={figure.title}>
      <div className="flex flex-col items-center">
        <span
          className="rounded-full border px-4 py-1.5 text-sm font-semibold text-foreground"
          style={{ borderColor: accent, backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)` }}
        >
          {figure.root}
        </span>
        <span className="my-2 h-5 w-px" style={{ backgroundColor: 'var(--outline-variant)' }} aria-hidden />
        <div className="grid w-full gap-3 sm:grid-cols-3">
          {figure.branches.map((br, i) => (
            <div
              key={i}
              className="rounded-xl border bg-surface-container-lowest p-4"
              style={br.highlight ? { borderColor: accent } : { borderColor: 'var(--outline-variant)' }}
            >
              <p className="font-headline text-[0.9rem] font-semibold leading-tight text-foreground">{br.label}</p>
              {br.note && <p className="mt-1 text-[0.75rem] leading-relaxed text-surface-variant">{br.note}</p>}
              {br.items.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                  {br.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-[0.8rem] leading-snug text-surface-variant">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
}

// ── Line — une trajectoire dans le temps ─────────────────────────────────────
function Line({ figure, accent }: { figure: Extract<EcosystemFigure, { kind: 'line' }>; accent: string }) {
  const W = 320;
  const H = 188;
  const padX = 30;
  const padTop = 22;
  const padBottom = 30;
  const ys = figure.points.map((p) => p.y);
  const maxY = Math.max(...ys);
  const minY = Math.min(...ys, 0);
  const n = figure.points.length;
  const px = (i: number) => padX + (i / (n - 1)) * (W - padX - 12);
  const py = (y: number) => padTop + (1 - (y - minY) / (maxY - minY || 1)) * (H - padTop - padBottom);
  const line = figure.points.map((p, i) => `${px(i)},${py(p.y)}`).join(' ');
  const area = `${px(0)},${py(minY)} ${line} ${px(n - 1)},${py(minY)}`;

  return (
    <FigureFrame title={figure.title} caption={figure.caption} source={figure.source} ariaLabel={figure.title}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }} preserveAspectRatio="xMidYMid meet">
        {/* baseline */}
        <line x1={padX} y1={py(minY)} x2={W - 12} y2={py(minY)} className="stroke-current text-outline-variant" strokeWidth={1} />
        <polygon points={area} style={{ fill: accent, opacity: 0.1 }} />
        <polyline points={line} fill="none" style={{ stroke: accent }} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {figure.points.map((p, i) => (
          <g key={i}>
            <circle cx={px(i)} cy={py(p.y)} r={3} style={{ fill: accent }} />
            <text x={px(i)} y={H - 10} textAnchor="middle" className="fill-current font-mono text-surface-variant" style={{ fontSize: 9 }}>
              {p.x}
            </text>
            {p.annotation && (
              <text
                x={Math.min(Math.max(px(i), 36), W - 36)}
                y={py(p.y) - 9}
                textAnchor="middle"
                className="fill-current font-medium text-foreground"
                style={{ fontSize: 9.5 }}
              >
                {p.annotation}
              </text>
            )}
          </g>
        ))}
      </svg>
    </FigureFrame>
  );
}

// ── Quadrant — carte de positionnement sur deux axes ─────────────────────────
function Quadrant({ figure, accent }: { figure: Extract<EcosystemFigure, { kind: 'quadrant' }>; accent: string }) {
  const W = 320;
  const H = 300;
  const m = 30; // marge pour les libellés d'axe
  const plane = { x0: m, y0: 16, x1: W - m, y1: H - m };
  const mapX = (x: number) => plane.x0 + x * (plane.x1 - plane.x0);
  const mapY = (y: number) => plane.y1 - y * (plane.y1 - plane.y0);

  return (
    <FigureFrame title={figure.title} caption={figure.caption} source={figure.source} ariaLabel={figure.title}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }} preserveAspectRatio="xMidYMid meet">
        <rect x={plane.x0} y={plane.y0} width={plane.x1 - plane.x0} height={plane.y1 - plane.y0} rx={8}
          className="fill-current text-surface-container-low" style={{ opacity: 0.5 }} />
        {/* axes médians */}
        <line x1={mapX(0.5)} y1={plane.y0} x2={mapX(0.5)} y2={plane.y1} className="stroke-current text-outline-variant" strokeWidth={1} strokeDasharray="3 4" />
        <line x1={plane.x0} y1={mapY(0.5)} x2={plane.x1} y2={mapY(0.5)} className="stroke-current text-outline-variant" strokeWidth={1} strokeDasharray="3 4" />
        {/* libellés d'axes */}
        <text x={plane.x0} y={H - 8} className="fill-current font-mono text-surface-variant" style={{ fontSize: 8.5 }}>← {figure.xAxis[0]}</text>
        <text x={plane.x1} y={H - 8} textAnchor="end" className="fill-current font-mono text-surface-variant" style={{ fontSize: 8.5 }}>{figure.xAxis[1]} →</text>
        <text x={10} y={plane.y1} className="fill-current font-mono text-surface-variant" style={{ fontSize: 8.5 }} transform={`rotate(-90 10 ${plane.y1})`}>← {figure.yAxis[0]}</text>
        <text x={10} y={plane.y0} textAnchor="end" className="fill-current font-mono text-surface-variant" style={{ fontSize: 8.5 }} transform={`rotate(-90 10 ${plane.y0})`}>{figure.yAxis[1]} →</text>
        {/* items */}
        {figure.items.map((it, i) => {
          const cx = mapX(Math.min(Math.max(it.x, 0), 1));
          const cy = mapY(Math.min(Math.max(it.y, 0), 1));
          const hot = it.highlight ?? false;
          const anchor = cx > plane.x1 - 60 ? 'end' : 'start';
          const dx = anchor === 'end' ? -7 : 7;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={hot ? 5 : 4} style={{ fill: hot ? accent : 'var(--on-surface-variant)' }} />
              <text x={cx + dx} y={cy + 3.5} textAnchor={anchor}
                className={hot ? 'fill-current font-medium text-foreground' : 'fill-current text-surface-variant'} style={{ fontSize: 9.5 }}>
                {it.label}
              </text>
            </g>
          );
        })}
      </svg>
    </FigureFrame>
  );
}

/** Dispatcher : rend une figure selon son `kind`. */
export function EcosystemFigureView({ figure, accent }: { figure: EcosystemFigure; accent: string }) {
  switch (figure.kind) {
    case 'bars':
      return <Bars figure={figure} accent={accent} />;
    case 'line':
      return <Line figure={figure} accent={accent} />;
    case 'matrix':
      return <Matrix figure={figure} accent={accent} />;
    case 'quadrant':
      return <Quadrant figure={figure} accent={accent} />;
    case 'taxonomy':
      return <Taxonomy figure={figure} accent={accent} />;
    default:
      return null;
  }
}
