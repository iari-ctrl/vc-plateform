import { useMemo, useState } from 'react';
import { IKIGAI } from '@/content';
import { useTheme } from '@/context/ThemeContext';
import { legibleAccent } from '@/lib/ikigaiColor';

/**
 * The 13-zone Ikigai diagram, drawn as an explorer's-atlas overlay using the
 * platform design tokens. Every zone is a focusable button with an ARIA label;
 * selecting one reveals & scrolls to the matching section of the cahier.
 *
 * Geometry (overlapping-circle regions) is fixed; colour and behaviour are
 * token-aware and motion respects `prefers-reduced-motion` (see .ikigai-zone).
 */

export type RegionKind = 'dimension' | 'intersection' | 'presque' | 'center';
export interface RegionSelect {
  kind: RegionKind;
  /** content id (dimension / intersection / presque id, or 'center') */
  id: string;
  /** DOM anchor to scroll to */
  target: string;
}

type Dim = 'A' | 'B' | 'C' | 'D';
interface RegionGeom {
  region: string;
  groups: Dim[];
  kind: RegionKind;
  id: string;
  target: string;
  path: string;
}

const DIM_OF: Record<Dim, string> = { A: 'aime', B: 'doue', C: 'besoin', D: 'remunere' };

const REGIONS: RegionGeom[] = [
  { region: 'A', groups: ['A'], kind: 'dimension', id: 'aime', target: 'ikigai-dim-aime', path: 'M 272.31 107.69 L 258.72 105.67 L 245.00 105.00 L 231.28 105.67 L 217.69 107.69 L 204.36 111.03 L 191.42 115.66 L 179.00 121.53 L 167.22 128.59 L 156.18 136.78 L 146.01 146.01 L 136.78 156.18 L 128.59 167.22 L 121.53 179.00 L 115.66 191.42 L 111.03 204.36 L 107.69 217.69 L 105.67 231.28 L 105.00 245.00 L 105.67 258.72 L 107.69 272.31 L 111.03 285.64 L 115.66 298.58 L 116.33 300.00 L 121.53 289.00 L 128.59 277.22 L 136.78 266.18 L 146.01 256.01 L 156.18 246.78 L 167.22 238.59 L 179.00 231.53 L 191.42 225.66 L 204.36 221.03 L 217.69 217.69 L 221.03 204.36 L 225.66 191.42 L 231.53 179.00 L 238.59 167.22 L 246.78 156.18 L 256.01 146.01 L 266.18 136.78 L 277.22 128.59 L 289.00 121.53 L 300.00 116.33 L 298.58 115.66 L 285.64 111.03 L 272.31 107.69 Z' },
  { region: 'B', groups: ['B'], kind: 'dimension', id: 'doue', target: 'ikigai-dim-doue', path: 'M 488.97 204.36 L 484.34 191.42 L 478.47 179.00 L 471.41 167.22 L 463.22 156.18 L 453.99 146.01 L 443.82 136.78 L 432.78 128.59 L 421.00 121.53 L 408.58 115.66 L 395.64 111.03 L 382.31 107.69 L 368.72 105.67 L 355.00 105.00 L 341.28 105.67 L 327.69 107.69 L 314.36 111.03 L 301.42 115.66 L 300.00 116.33 L 311.00 121.53 L 322.78 128.59 L 333.82 136.78 L 343.99 146.01 L 353.22 156.18 L 361.41 167.22 L 368.47 179.00 L 374.34 191.42 L 378.97 204.36 L 382.31 217.69 L 395.64 221.03 L 408.58 225.66 L 421.00 231.53 L 432.78 238.59 L 443.82 246.78 L 453.99 256.01 L 463.22 266.18 L 471.41 277.22 L 478.47 289.00 L 483.67 300.00 L 484.34 298.58 L 488.97 285.64 L 492.31 272.31 L 494.33 258.72 L 495.00 245.00 L 494.33 231.28 L 492.31 217.69 L 488.97 204.36 Z' },
  { region: 'C', groups: ['C'], kind: 'dimension', id: 'besoin', target: 'ikigai-dim-besoin', path: 'M 217.69 382.31 L 204.36 378.97 L 191.42 374.34 L 179.00 368.47 L 167.22 361.41 L 156.18 353.22 L 146.01 343.99 L 136.78 333.82 L 128.59 322.78 L 121.53 311.00 L 116.33 300.00 L 115.66 301.42 L 111.03 314.36 L 107.69 327.69 L 105.67 341.28 L 105.00 355.00 L 105.67 368.72 L 107.69 382.31 L 111.03 395.64 L 115.66 408.58 L 121.53 421.00 L 128.59 432.78 L 136.78 443.82 L 146.01 453.99 L 156.18 463.22 L 167.22 471.41 L 179.00 478.47 L 191.42 484.34 L 204.36 488.97 L 217.69 492.31 L 231.28 494.33 L 245.00 495.00 L 258.72 494.33 L 272.31 492.31 L 285.64 488.97 L 298.58 484.34 L 300.00 483.67 L 289.00 478.47 L 277.22 471.41 L 266.18 463.22 L 256.01 453.99 L 246.78 443.82 L 238.59 432.78 L 231.53 421.00 L 225.66 408.58 L 221.03 395.64 L 217.69 382.31 Z' },
  { region: 'D', groups: ['D'], kind: 'dimension', id: 'remunere', target: 'ikigai-dim-remunere', path: 'M 488.97 314.36 L 484.34 301.42 L 483.67 300.00 L 478.47 311.00 L 471.41 322.78 L 463.22 333.82 L 453.99 343.99 L 443.82 353.22 L 432.78 361.41 L 421.00 368.47 L 408.58 374.34 L 395.64 378.97 L 382.31 382.31 L 378.97 395.64 L 374.34 408.58 L 368.47 421.00 L 361.41 432.78 L 353.22 443.82 L 343.99 453.99 L 333.82 463.22 L 322.78 471.41 L 311.00 478.47 L 300.00 483.67 L 301.42 484.34 L 314.36 488.97 L 327.69 492.31 L 341.28 494.33 L 355.00 495.00 L 368.72 494.33 L 382.31 492.31 L 395.64 488.97 L 408.58 484.34 L 421.00 478.47 L 432.78 471.41 L 443.82 463.22 L 453.99 453.99 L 463.22 443.82 L 471.41 432.78 L 478.47 421.00 L 484.34 408.58 L 488.97 395.64 L 492.31 382.31 L 494.33 368.72 L 495.00 355.00 L 494.33 341.28 L 492.31 327.69 L 488.97 314.36 Z' },
  { region: 'AB', groups: ['A', 'B'], kind: 'intersection', id: 'passion', target: 'ikigai-inter-passion', path: 'M 378.97 204.36 L 374.34 191.42 L 368.47 179.00 L 361.41 167.22 L 353.22 156.18 L 343.99 146.01 L 333.82 136.78 L 322.78 128.59 L 311.00 121.53 L 300.00 116.33 L 289.00 121.53 L 277.22 128.59 L 266.18 136.78 L 256.01 146.01 L 246.78 156.18 L 238.59 167.22 L 231.53 179.00 L 225.66 191.42 L 221.03 204.36 L 217.69 217.69 L 231.28 215.67 L 245.00 215.00 L 258.72 215.67 L 272.31 217.69 L 285.64 221.03 L 298.58 225.66 L 300.00 226.33 L 301.42 225.66 L 314.36 221.03 L 327.69 217.69 L 341.28 215.67 L 355.00 215.00 L 368.72 215.67 L 382.31 217.69 L 378.97 204.36 Z' },
  { region: 'AC', groups: ['A', 'C'], kind: 'intersection', id: 'mission', target: 'ikigai-inter-mission', path: 'M 136.78 333.82 L 146.01 343.99 L 156.18 353.22 L 167.22 361.41 L 179.00 368.47 L 191.42 374.34 L 204.36 378.97 L 217.69 382.31 L 215.67 368.72 L 215.00 355.00 L 215.67 341.28 L 217.69 327.69 L 221.03 314.36 L 225.66 301.42 L 226.33 300.00 L 225.66 298.58 L 221.03 285.64 L 217.69 272.31 L 215.67 258.72 L 215.00 245.00 L 215.67 231.28 L 217.69 217.69 L 204.36 221.03 L 191.42 225.66 L 179.00 231.53 L 167.22 238.59 L 156.18 246.78 L 146.01 256.01 L 136.78 266.18 L 128.59 277.22 L 121.53 289.00 L 116.33 300.00 L 121.53 311.00 L 128.59 322.78 L 136.78 333.82 Z' },
  { region: 'BD', groups: ['B', 'D'], kind: 'intersection', id: 'profession', target: 'ikigai-inter-profession', path: 'M 382.31 382.31 L 395.64 378.97 L 408.58 374.34 L 421.00 368.47 L 432.78 361.41 L 443.82 353.22 L 453.99 343.99 L 463.22 333.82 L 471.41 322.78 L 478.47 311.00 L 483.67 300.00 L 478.47 289.00 L 471.41 277.22 L 463.22 266.18 L 453.99 256.01 L 443.82 246.78 L 432.78 238.59 L 421.00 231.53 L 408.58 225.66 L 395.64 221.03 L 382.31 217.69 L 384.33 231.28 L 385.00 245.00 L 384.33 258.72 L 382.31 272.31 L 378.97 285.64 L 374.34 298.58 L 373.67 300.00 L 374.34 301.42 L 378.97 314.36 L 382.31 327.69 L 384.33 341.28 L 385.00 355.00 L 384.33 368.72 L 382.31 382.31 Z' },
  { region: 'CD', groups: ['C', 'D'], kind: 'intersection', id: 'vocation', target: 'ikigai-inter-vocation', path: 'M 298.58 374.34 L 285.64 378.97 L 272.31 382.31 L 258.72 384.33 L 245.00 385.00 L 231.28 384.33 L 217.69 382.31 L 221.03 395.64 L 225.66 408.58 L 231.53 421.00 L 238.59 432.78 L 246.78 443.82 L 256.01 453.99 L 266.18 463.22 L 277.22 471.41 L 289.00 478.47 L 300.00 483.67 L 311.00 478.47 L 322.78 471.41 L 333.82 463.22 L 343.99 453.99 L 353.22 443.82 L 361.41 432.78 L 368.47 421.00 L 374.34 408.58 L 378.97 395.64 L 382.31 382.31 L 368.72 384.33 L 355.00 385.00 L 341.28 384.33 L 327.69 382.31 L 314.36 378.97 L 301.42 374.34 L 300.00 373.67 L 298.58 374.34 Z' },
  { region: 'ABC', groups: ['A', 'B', 'C'], kind: 'presque', id: 'plenitude', target: 'ikigai-presque-plenitude', path: 'M 215.00 245.00 L 215.67 258.72 L 217.69 272.31 L 221.03 285.64 L 225.66 298.58 L 226.33 300.00 L 231.53 289.00 L 238.59 277.22 L 246.78 266.18 L 256.01 256.01 L 266.18 246.78 L 277.22 238.59 L 289.00 231.53 L 300.00 226.33 L 298.58 225.66 L 285.64 221.03 L 272.31 217.69 L 258.72 215.67 L 245.00 215.00 L 231.28 215.67 L 217.69 217.69 L 215.67 231.28 L 215.00 245.00 Z' },
  { region: 'ABD', groups: ['A', 'B', 'D'], kind: 'presque', id: 'virtuosite', target: 'ikigai-presque-virtuosite', path: 'M 368.72 215.67 L 355.00 215.00 L 341.28 215.67 L 327.69 217.69 L 314.36 221.03 L 301.42 225.66 L 300.00 226.33 L 311.00 231.53 L 322.78 238.59 L 333.82 246.78 L 343.99 256.01 L 353.22 266.18 L 361.41 277.22 L 368.47 289.00 L 373.67 300.00 L 374.34 298.58 L 378.97 285.64 L 382.31 272.31 L 384.33 258.72 L 385.00 245.00 L 384.33 231.28 L 382.31 217.69 L 368.72 215.67 Z' },
  { region: 'ACD', groups: ['A', 'C', 'D'], kind: 'presque', id: 'ferveur', target: 'ikigai-presque-ferveur', path: 'M 245.00 385.00 L 258.72 384.33 L 272.31 382.31 L 285.64 378.97 L 298.58 374.34 L 300.00 373.67 L 289.00 368.47 L 277.22 361.41 L 266.18 353.22 L 256.01 343.99 L 246.78 333.82 L 238.59 322.78 L 231.53 311.00 L 226.33 300.00 L 225.66 301.42 L 221.03 314.36 L 217.69 327.69 L 215.67 341.28 L 215.00 355.00 L 215.67 368.72 L 217.69 382.31 L 231.28 384.33 L 245.00 385.00 Z' },
  { region: 'BCD', groups: ['B', 'C', 'D'], kind: 'presque', id: 'confort', target: 'ikigai-presque-confort', path: 'M 301.42 374.34 L 314.36 378.97 L 327.69 382.31 L 341.28 384.33 L 355.00 385.00 L 368.72 384.33 L 382.31 382.31 L 384.33 368.72 L 385.00 355.00 L 384.33 341.28 L 382.31 327.69 L 378.97 314.36 L 374.34 301.42 L 373.67 300.00 L 368.47 311.00 L 361.41 322.78 L 353.22 333.82 L 343.99 343.99 L 333.82 353.22 L 322.78 361.41 L 311.00 368.47 L 300.00 373.67 L 301.42 374.34 Z' },
  { region: 'ABCD', groups: ['A', 'B', 'C', 'D'], kind: 'center', id: 'center', target: 'ikigai-section-archetypes', path: 'M 231.53 311.00 L 238.59 322.78 L 246.78 333.82 L 256.01 343.99 L 266.18 353.22 L 277.22 361.41 L 289.00 368.47 L 300.00 373.67 L 311.00 368.47 L 322.78 361.41 L 333.82 353.22 L 343.99 343.99 L 353.22 333.82 L 361.41 322.78 L 368.47 311.00 L 373.67 300.00 L 368.47 289.00 L 361.41 277.22 L 353.22 266.18 L 343.99 256.01 L 333.82 246.78 L 322.78 238.59 L 311.00 231.53 L 300.00 226.33 L 289.00 231.53 L 277.22 238.59 L 266.18 246.78 L 256.01 256.01 L 246.78 266.18 L 238.59 277.22 L 231.53 289.00 L 226.33 300.00 L 231.53 311.00 Z' },
];

const DIM_LABEL_POS: Record<Dim, { x: number; y: number; anchor: 'start' | 'end' }> = {
  A: { x: 118, y: 86, anchor: 'start' },
  B: { x: 482, y: 86, anchor: 'end' },
  C: { x: 118, y: 524, anchor: 'start' },
  D: { x: 482, y: 524, anchor: 'end' },
};

function dimAccent(id: string): string {
  return IKIGAI.dimensions.find((d) => d.id === id)?.accent ?? 'var(--primary)';
}

function regionLabel(r: RegionGeom): { title: string; formula: string } {
  if (r.kind === 'dimension') {
    const d = IKIGAI.dimensions.find((x) => x.id === r.id)!;
    return { title: d.label, formula: '' };
  }
  if (r.kind === 'intersection') {
    const it = IKIGAI.intersections.find((x) => x.id === r.id)!;
    return { title: it.label, formula: it.subtitle };
  }
  if (r.kind === 'presque') {
    const p = IKIGAI.presqueIkigai.find((x) => x.id === r.id)!;
    return { title: p.name, formula: p.formula };
  }
  return { title: 'Ikigai', formula: 'aimer × être bon × utile × rémunéré' };
}

const INNER_PCT = {
  intersection: { rest: 20, group: 34, active: 64 },
  presque: { rest: 32, group: 44, active: 74 },
  center: { rest: 50, group: 60, active: 86 },
} as const;

function fillFor(r: RegionGeom, state: 'rest' | 'group' | 'active', dark: boolean): string {
  if (r.kind === 'dimension') {
    const pct = state === 'active' ? (dark ? 58 : 52) : state === 'group' ? (dark ? 34 : 28) : dark ? 22 : 14;
    return `color-mix(in srgb, ${legibleAccent(dimAccent(r.id), dark)} ${pct}%, transparent)`;
  }
  // Over the sky the gilded inner zones need a touch more body to read.
  const pct = INNER_PCT[r.kind][state] + (dark ? 8 : 0);
  return `color-mix(in srgb, var(--primary) ${pct}%, transparent)`;
}

export function IkigaiAtlasDiagram({
  onSelect,
  activeId,
  hideReadout = false,
}: {
  onSelect: (r: RegionSelect) => void;
  activeId?: string | null;
  hideReadout?: boolean;
}) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredRegion = useMemo(() => REGIONS.find((r) => r.region === hovered) ?? null, [hovered]);
  const groupDim: Dim | null = hoveredRegion?.kind === 'dimension' ? hoveredRegion.groups[0] : null;

  const stateOf = (r: RegionGeom): 'rest' | 'group' | 'active' => {
    if (hovered === r.region) return 'active';
    if (activeId && r.id === activeId) return 'active';
    if (groupDim && r.groups.includes(groupDim)) return 'group';
    return 'rest';
  };

  const readout = hoveredRegion ?? (activeId ? REGIONS.find((r) => r.id === activeId) ?? null : null);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 600 600"
        className="mx-auto h-auto w-full max-w-md select-none"
        role="group"
        aria-label="Diagramme de l'ikigai à 13 zones cliquables"
      >
        {/* Soft lens that darkens the starry sky directly under the circles so the
            translucent fills keep their colour, while stars stay visible around it. */}
        {dark && (
          <>
            <defs>
              <radialGradient id="ikigai-sky-scrim" cx="50%" cy="50%" r="52%">
                <stop offset="0%" stopColor="#0D0E12" stopOpacity="0.5" />
                <stop offset="58%" stopColor="#0D0E12" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#0D0E12" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="600" height="600" fill="url(#ikigai-sky-scrim)" />
          </>
        )}

        {/* Atlas rings */}
        <circle cx="300" cy="300" r="200" fill="none" stroke="color-mix(in srgb, var(--outline) 45%, transparent)" strokeWidth="0.6" />
        <circle cx="300" cy="300" r="232" fill="none" stroke="color-mix(in srgb, var(--outline) 35%, transparent)" strokeDasharray="2 5" strokeWidth="0.6" />

        {REGIONS.map((r) => {
          const st = stateOf(r);
          const { title, formula } = regionLabel(r);
          const stroke =
            st === 'active'
              ? r.kind === 'dimension'
                ? legibleAccent(dimAccent(r.id), dark)
                : 'var(--primary)'
              : `color-mix(in srgb, var(--on-surface) ${dark ? 34 : 18}%, transparent)`;
          return (
            <path
              key={r.region}
              d={r.path}
              className="ikigai-zone cursor-pointer"
              fill={fillFor(r, st, dark)}
              stroke={stroke}
              strokeWidth={st === 'active' ? 1.6 : 0.7}
              role="button"
              tabIndex={0}
              aria-label={formula ? `${title} — ${formula}` : title}
              onMouseEnter={() => setHovered(r.region)}
              onMouseLeave={() => setHovered(null)}
              onMouseDown={(event) => event.preventDefault()}
              onFocus={() => setHovered(r.region)}
              onBlur={() => setHovered(null)}
              onClick={() => onSelect({ kind: r.kind, id: r.id, target: r.target })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect({ kind: r.kind, id: r.id, target: r.target });
                }
              }}
            />
          );
        })}

        {/* Dimension corner labels (kanji) */}
        <g
          className="font-headline"
          style={{ pointerEvents: 'none', filter: dark ? 'drop-shadow(0 1px 2px rgba(5,6,8,0.85))' : undefined }}
        >
          {(Object.keys(DIM_LABEL_POS) as Dim[]).map((g) => {
            const dim = IKIGAI.dimensions.find((d) => d.id === DIM_OF[g])!;
            const pos = DIM_LABEL_POS[g];
            const lit = hoveredRegion?.groups.includes(g);
            return (
              <text
                key={g}
                x={pos.x}
                y={pos.y}
                textAnchor={pos.anchor}
                fontSize="22"
                fill={legibleAccent(dim.accent, dark)}
                opacity={lit ? 1 : 0.75}
              >
                {dim.kanji}
              </text>
            );
          })}
          {/* Centre kanji */}
          <text x="300" y="300" textAnchor="middle" dominantBaseline="central" fontSize="34" fill="var(--primary)">
            生
          </text>
        </g>
      </svg>

      {/* Hover / focus readout */}
      {!hideReadout && (
        <div className="mt-4 min-h-[3.25rem] text-center" aria-live="polite">
          {readout ? (
            <>
              <p className="font-headline text-headline-sm font-semibold" style={{ color: readout.kind === 'dimension' ? legibleAccent(dimAccent(readout.id), dark) : 'var(--primary)' }}>
                {regionLabel(readout).title}
              </p>
              {regionLabel(readout).formula && (
                <p className="mt-0.5 font-headline text-sm italic text-surface-variant">{regionLabel(readout).formula}</p>
              )}
            </>
          ) : (
            <p className="font-headline text-sm italic text-surface-variant">
              Survolez ou tabulez pour explorer · activez une zone pour ouvrir sa section
            </p>
          )}
        </div>
      )}
    </div>
  );
}
