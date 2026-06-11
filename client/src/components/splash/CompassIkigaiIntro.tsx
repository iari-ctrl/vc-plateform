import { useEffect, useState, type CSSProperties } from 'react';

type Phase = 'enter' | 'ikigai' | 'compass';
type Ring = { cx: number; cy: number; r: number };

const POSITIONS: Record<Phase, Ring[]> = {
  enter: [
    { cx: -560, cy: -470, r: 34 },
    { cx: 720, cy: -470, r: 34 },
    { cx: -560, cy: 630, r: 34 },
    { cx: 720, cy: 630, r: 34 },
  ],
  ikigai: [
    { cx: 63, cy: 63, r: 33 },
    { cx: 97, cy: 63, r: 33 },
    { cx: 63, cy: 97, r: 33 },
    { cx: 97, cy: 97, r: 33 },
  ],
  compass: [
    { cx: 80, cy: 80, r: 72 },
    { cx: 80, cy: 80, r: 60 },
    { cx: 80, cy: 80, r: 44 },
    { cx: 80, cy: 80, r: 28 },
  ],
};

const OPACITY: Record<Phase, number[]> = {
  enter: [0, 0, 0, 0],
  ikigai: [0.9, 0.9, 0.9, 0.9],
  compass: [0.5, 0.5, 0.4, 0.35],
};

const ROTATION: Record<Phase, number> = {
  enter: -150,
  ikigai: 30,
  compass: 0,
};

function getReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(getReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function CompassIkigaiIntro({
  size = 184,
  hue = 'var(--primary)',
  speed = 1,
  className = '',
}: {
  size?: number;
  hue?: string;
  speed?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(() => (getReducedMotion() ? 'compass' : 'enter'));
  const [introDone, setIntroDone] = useState(getReducedMotion);
  const [kanjiOn, setKanjiOn] = useState(getReducedMotion);
  const sp = speed > 0 ? speed : 1;

  useEffect(() => {
    if (reduced) {
      setPhase('compass');
      setIntroDone(true);
      setKanjiOn(true);
      return undefined;
    }

    setPhase('enter');
    setIntroDone(false);
    setKanjiOn(false);

    const timers = [
      window.setTimeout(() => setPhase('ikigai'), 120 / sp),
      window.setTimeout(() => setPhase('compass'), 4300 / sp),
      window.setTimeout(() => setKanjiOn(true), 5400 / sp),
      window.setTimeout(() => setIntroDone(true), 6700 / sp),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [reduced, sp]);

  const duration = (introDone ? 1100 : phase === 'ikigai' ? 3000 : 2200) / sp;
  const easing = 'cubic-bezier(.5,0,.2,1)';
  const rings = POSITIONS[phase];
  const kanji = [
    { text: '好', x: 25, y: 30 },
    { text: '得', x: 135, y: 30 },
    { text: '要', x: 25, y: 140 },
    { text: '報', x: 135, y: 140 },
  ];

  return (
    <div
      className={className}
      onMouseEnter={() => introDone && setPhase('ikigai')}
      onMouseLeave={() => introDone && setPhase('compass')}
      aria-hidden
    >
      <svg viewBox="0 0 160 160" width={size} height={size} className="splash-compass-svg">
        <g
          fill="none"
          stroke={hue}
          style={{
            transform: `rotate(${ROTATION[phase]}deg)`,
            transformBox: 'view-box',
            transformOrigin: '80px 80px',
            transition: `transform ${duration}ms ${easing}`,
          }}
        >
          {rings.map((ring, index) => (
            <circle
              key={index}
              strokeWidth="0.9"
              style={
                {
                  cx: `${ring.cx}px`,
                  cy: `${ring.cy}px`,
                  r: `${ring.r}px`,
                  opacity: OPACITY[phase][index],
                  transition: `cx ${duration}ms ${easing}, cy ${duration}ms ${easing}, r ${duration}ms ${easing}, opacity ${duration}ms ${easing}`,
                } as CSSProperties
              }
            />
          ))}
        </g>

        <g style={{ opacity: phase === 'compass' ? 1 : 0, transition: `opacity ${Math.round(duration * 0.7)}ms ease` }}>
          <g stroke={hue} fill="none">
            {Array.from({ length: 24 }).map((_, index) => {
              const angle = (index * 15 * Math.PI) / 180;
              const r1 = index % 2 === 0 ? 66 : 69;
              return (
                <line
                  key={index}
                  x1={80 + Math.cos(angle) * r1}
                  y1={80 + Math.sin(angle) * r1}
                  x2={80 + Math.cos(angle) * 72}
                  y2={80 + Math.sin(angle) * 72}
                  strokeWidth="0.6"
                  opacity="0.45"
                />
              );
            })}
          </g>
          <g fill={hue}>
            <path d="M80 8 L84 76 L80 80 L76 76 Z" opacity="0.9" className="splash-compass-needle" />
            <path d="M80 152 L76 84 L80 80 L84 84 Z" opacity="0.45" />
            <path d="M8 80 L76 76 L80 80 L76 84 Z" opacity="0.4" />
            <path d="M152 80 L84 84 L80 80 L84 76 Z" opacity="0.4" />
          </g>
          <g fill={hue} opacity="0.5">
            <path d="M29 29 L74 76 L80 80 L76 74 Z" />
            <path d="M131 29 L84 76 L80 80 L84 74 Z" />
            <path d="M29 131 L74 84 L80 80 L76 86 Z" />
            <path d="M131 131 L84 84 L80 80 L84 86 Z" />
          </g>
          <g fontFamily="Newsreader" fontStyle="italic" fontSize="9" fill={hue} textAnchor="middle" opacity="0.85">
            <text x="80" y="6">N</text>
            <text x="80" y="159">S</text>
            <text x="5" y="83">O</text>
            <text x="155" y="83">E</text>
          </g>
          <circle cx="80" cy="80" r="3" fill={hue} />
        </g>

        <g
          fontFamily="Newsreader"
          fill={hue}
          textAnchor="middle"
          style={{ opacity: kanjiOn ? 0.9 : 0, transition: 'opacity 900ms ease' }}
        >
          {kanji.map((item) => (
            <text key={item.text} x={item.x} y={item.y} fontSize="13" fontStyle="italic">
              {item.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
