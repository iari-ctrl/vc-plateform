/* global React */
// Shared ornaments for the VC Premium splash proposals — ported from the
// product's Illustrations.tsx / Ornaments.tsx so the cartographic soul matches.
const { useState } = React;

// Mouse-parallax: returns [bind, mx, my] where mx/my are -1..1 relative to the
// element centre. Gives the portals a tangible, physical depth as the cursor
// moves. Disabled under reduced-motion.
function useParallax() {
  const [p, setP] = useState({ x: 0, y: 0 });
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    setP({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
  };
  const onLeave = () => setP({ x: 0, y: 0 });
  return [{ onMouseMove: onMove, onMouseLeave: onLeave }, p.x, p.y];
}

// A single, unmissable "enter" invitation: a gilded disc with a drifting arrow,
// a slow pulsing ring, and a quiet label. The focal call-to-action of a portal.
function EnterCue({ label = "Entrer", sub, accentOnDark = false, size = 76, className = "", style = {} }) {
  const [hover, setHover] = useState(false);
  const ring = accentOnDark ? "color-mix(in srgb, var(--primary) 60%, transparent)" : "color-mix(in srgb, var(--primary) 50%, transparent)";
  return (
    <div className={className} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 16, ...style }}>
      <button aria-label={label}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ position: "relative", width: size, height: size, borderRadius: "999px", cursor: "pointer",
          border: "1px solid color-mix(in srgb, var(--primary) 55%, transparent)",
          background: hover ? "linear-gradient(135deg, #B09247, var(--primary) 55%, #DFCA8B)" : "color-mix(in srgb, var(--primary) 10%, transparent)",
          color: hover ? "#12131A" : "var(--primary)", display: "grid", placeItems: "center",
          transition: "background .35s, transform .35s, color .35s, box-shadow .35s",
          transform: hover ? "translateY(-3px)" : "none",
          boxShadow: hover ? "0 14px 30px -8px color-mix(in srgb, var(--primary) 55%, transparent)" : "0 2px 10px -4px color-mix(in srgb, var(--primary) 30%, transparent)" }}>
        {/* pulsing rings */}
        {[0, 1].map((i) => (
          <span key={i} aria-hidden="true" style={{ position: "absolute", inset: -1, borderRadius: "999px", border: `1px solid ${ring}`, animation: "enter-ring 3.4s ease-out infinite", animationDelay: `${i * 1.7}s` }} />
        ))}
        <svg width={size * 0.34} height={size * 0.34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ animation: hover ? "none" : "nudge 2.6s ease-in-out infinite" }}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      <span className="font-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.34em", textTransform: "uppercase", color: hover ? "var(--primary)" : "var(--on-surface-variant)", transition: "color .3s" }}>{label}</span>
      {sub && <span className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.08em", color: "var(--on-surface-variant)", opacity: 0.8 }}>{sub}</span>}
    </div>
  );
}

// ── Ikigai → Compass intro ─────────────────────────────────────────────────
// A choreographed entrance: four gilded circles fade in as an ikigai, the group
// turns, then each circle tightens onto the needle to form the final compass —
// the four kanji appear at the diagonals and stay. After the intro it behaves
// like CompassRose: hover settles it on a quarter-turn bearing. CSS-driven, so
// reduced-motion jumps straight to the finished compass.
// ── Ikigai → Compass intro ─────────────────────────────────────────────────
// Choreography (~7.3s): four gilded circles sweep in from far off the sides
// while the whole group spins, cross over the middle into an overlapping ikigai,
// then tighten onto the needle to form the compass — the four forces (好得要報)
// appear and stay. Afterwards it's interactive: hovering morphs the compass back
// into the centred ikigai, and leaving settles it into a normal compass again.
// Reduced-motion jumps straight to the finished compass.
function CompassIkigaiIntro({ size = 184, hue = "var(--primary)", speed = 1, className = "", style = {} }) {
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [phase, setPhase] = useState(reduce ? "compass" : "enter");
  const [introDone, setIntroDone] = useState(reduce);
  const [kanjiOn, setKanjiOn] = useState(reduce);
  const sp = speed > 0 ? speed : 1;

  useEffect(() => {
    if (reduce) return;
    const t = [];
    t.push(setTimeout(() => setPhase("ikigai"), 120 / sp));   // sweep in + spin (3s)
    t.push(setTimeout(() => setPhase("compass"), 4300 / sp));  // tighten to compass (2.2s)
    t.push(setTimeout(() => setKanjiOn(true), 5400 / sp));     // the four forces settle in
    t.push(setTimeout(() => setIntroDone(true), 6700 / sp));   // hand over to hover
    return () => t.forEach(clearTimeout);
  }, [reduce, sp]);

  // geometry per phase — [{cx,cy,r}] for the four circles
  const POS = {
    enter:   [{ cx: -560, cy: -470, r: 34 }, { cx: 720, cy: -470, r: 34 }, { cx: -560, cy: 630, r: 34 }, { cx: 720, cy: 630, r: 34 }],
    ikigai:  [{ cx: 63, cy: 63, r: 33 }, { cx: 97, cy: 63, r: 33 }, { cx: 63, cy: 97, r: 33 }, { cx: 97, cy: 97, r: 33 }],
    compass: [{ cx: 80, cy: 80, r: 72 }, { cx: 80, cy: 80, r: 60 }, { cx: 80, cy: 80, r: 44 }, { cx: 80, cy: 80, r: 28 }],
  };
  const OPA = { enter: [0, 0, 0, 0], ikigai: [0.9, 0.9, 0.9, 0.9], compass: [0.5, 0.5, 0.4, 0.35] };
  const ROT = { enter: -150, ikigai: 30, compass: 0 };

  const dur = (introDone ? 1100 : (phase === "ikigai" ? 3000 : 2200)) / sp;
  const ease = "cubic-bezier(.5,0,.2,1)";
  const onEnter = () => { if (introDone) setPhase("ikigai"); };
  const onLeave = () => { if (introDone) setPhase("compass"); };

  const kanji = [
    { t: "好", x: 25, y: 30 }, { t: "得", x: 135, y: 30 },
    { t: "要", x: 25, y: 140 }, { t: "報", x: 135, y: 140 },
  ];

  return (
    <div className={className} style={{ display: "inline-block", cursor: "pointer", ...style }}
      onMouseEnter={onEnter} onMouseLeave={onLeave} aria-hidden="true">
      <svg viewBox="0 0 160 160" width={size} height={size} style={{ display: "block", overflow: "visible" }}>
        {/* the four circles — sweep in, cross into an ikigai, tighten into rings */}
        <g fill="none" stroke={hue}
          style={{ transform: `rotate(${ROT[phase]}deg)`, transformBox: "view-box", transformOrigin: "80px 80px", transition: `transform ${dur}ms ${ease}` }}>
          {POS[phase].map((p, i) => (
            <circle key={i} strokeWidth="0.9"
              style={{ cx: p.cx + "px", cy: p.cy + "px", r: p.r + "px", opacity: OPA[phase][i],
                transition: `cx ${dur}ms ${ease}, cy ${dur}ms ${ease}, r ${dur}ms ${ease}, opacity ${dur}ms ${ease}` }} />
          ))}
        </g>

        {/* compass detail — present only in the compass state, fades with the morph */}
        <g style={{ opacity: phase === "compass" ? 1 : 0, transition: `opacity ${Math.round(dur * 0.7)}ms ease` }}>
          <g stroke={hue} fill="none">
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * 15 * Math.PI) / 180;
              const r1 = i % 2 === 0 ? 66 : 69;
              return <line key={i} x1={80 + Math.cos(a) * r1} y1={80 + Math.sin(a) * r1} x2={80 + Math.cos(a) * 72} y2={80 + Math.sin(a) * 72} strokeWidth="0.6" opacity="0.45" />;
            })}
          </g>
          <g fill={hue}>
            <path d="M80 8 L84 76 L80 80 L76 76 Z" opacity="0.9" style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "compass-needle 9s ease-in-out infinite" }} />
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
          <g fontFamily="Newsreader" fontStyle="italic" fontSize="9" fill={hue} textAnchor="middle" opacity="0.85" letterSpacing="0.12em">
            <text x="80" y="6">N</text><text x="80" y="159">S</text><text x="5" y="83">O</text><text x="155" y="83">E</text>
          </g>
          <circle cx="80" cy="80" r="3" fill={hue} />
        </g>

        {/* the four forces — appear as the compass forms and stay */}
        <g fontFamily="Newsreader" fill={hue} textAnchor="middle"
          style={{ opacity: kanjiOn ? 0.9 : 0, transition: "opacity 900ms ease" }}>
          {kanji.map((k) => (
            <text key={k.t} x={k.x} y={k.y} fontSize="13" fontStyle="italic">{k.t}</text>
          ))}
        </g>
      </svg>
    </div>
  );
}

function Fleuron({ className = "", style = {} }) {
  return (
    <span className={"font-headline " + className} style={{ color: "var(--primary)", userSelect: "none", ...style }} aria-hidden="true">❦</span>
  );
}

function FleuronDivider({ className = "" }) {
  return (
    <div className={"fleuron-divider " + className} aria-hidden="true"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <span style={{ height: 1, width: 56, background: "linear-gradient(to right, transparent, var(--outline-variant))" }} />
      <Fleuron style={{ fontSize: ".9rem" }} />
      <span style={{ height: 1, width: 56, background: "linear-gradient(to left, transparent, var(--outline-variant))" }} />
    </div>
  );
}

// ── Compass rose — needle drifts; hover settles on a quarter-turn bearing ──
function CompassRose({ size = 160, hue = "var(--primary)", className = "", floating = true }) {
  const [bearing, setBearing] = useState(false);
  return (
    <div className={className}
      style={{ display: "inline-block", cursor: "pointer", transition: "transform 1200ms cubic-bezier(.16,1,.3,1)", transform: bearing ? "rotate(45deg)" : "rotate(0deg)" }}
      onMouseEnter={() => setBearing(true)} onMouseLeave={() => setBearing(false)} aria-hidden="true">
      <svg viewBox="0 0 160 160" width={size} height={size} style={{ display: "block" }}>
        <g stroke={hue} fill="none">
          <circle cx="80" cy="80" r="72" strokeWidth="0.6" opacity="0.4" />
          <circle cx="80" cy="80" r="60" strokeWidth="0.5" opacity="0.5" />
          <circle cx="80" cy="80" r="44" strokeWidth="0.4" opacity="0.3" />
          <circle cx="80" cy="80" r="28" strokeWidth="0.4" opacity="0.25" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const r1 = i % 2 === 0 ? 66 : 69;
            return <line key={i} x1={80 + Math.cos(a) * r1} y1={80 + Math.sin(a) * r1} x2={80 + Math.cos(a) * 72} y2={80 + Math.sin(a) * 72} strokeWidth="0.6" opacity="0.45" />;
          })}
        </g>
        <g fill={hue}>
          <path d="M80 8 L84 76 L80 80 L76 76 Z" opacity="0.9" style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: floating ? "compass-needle 9s ease-in-out infinite" : "none" }} />
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
        <g fontFamily="Newsreader" fontStyle="italic" fontSize="9" fill={hue} textAnchor="middle" opacity="0.85" letterSpacing="0.12em">
          <text x="80" y="6">N</text><text x="80" y="159">S</text><text x="5" y="83">O</text><text x="155" y="83">E</text>
        </g>
        <circle cx="80" cy="80" r="3" fill={hue} />
      </svg>
    </div>
  );
}

// ── Constellation — drifting twinkling stars joined by faint lines ─────────
function Constellation({ className = "", hue = "var(--primary)", style = {} }) {
  const pts = [
    { x: 12, y: 22, r: 1.6 }, { x: 26, y: 14, r: 1.1 }, { x: 38, y: 30, r: 2.1 }, { x: 55, y: 18, r: 1.3 },
    { x: 70, y: 34, r: 1.7 }, { x: 82, y: 20, r: 1.1 }, { x: 90, y: 44, r: 1.9 }, { x: 64, y: 52, r: 1.2 },
    { x: 44, y: 58, r: 1.5 }, { x: 20, y: 50, r: 1.2 }, { x: 8, y: 66, r: 1.6 }, { x: 33, y: 76, r: 1.1 },
    { x: 58, y: 78, r: 1.8 }, { x: 78, y: 68, r: 1.2 },
  ];
  const links = [[0,1],[1,3],[3,5],[2,3],[4,6],[4,7],[7,8],[8,9],[9,10],[8,11],[11,12],[12,13],[6,13]];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden="true">
      <g stroke={hue} strokeWidth="0.18" opacity="0.4">
        {links.map(([a, b], i) => <line key={i} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} />)}
      </g>
      <g fill={hue}>
        {pts.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} style={{ animation: "twinkle 4s ease-in-out infinite", animationDelay: `${(i % 7) * 0.55}s`, transformOrigin: `${s.x}px ${s.y}px` }} />)}
      </g>
    </svg>
  );
}

// ── Wax seal — tinted glyph with wax-drip ring ─────────────────────────────
function WaxSeal({ glyph, accent, size = 56, className = "", style = {} }) {
  return (
    <span className={"font-headline " + className} aria-hidden="true"
      style={{ position: "relative", display: "inline-grid", placeItems: "center", borderRadius: "999px",
        width: size, height: size, color: accent, fontSize: size * 0.42,
        background: `radial-gradient(circle at 38% 32%, color-mix(in srgb, ${accent} 22%, transparent), color-mix(in srgb, ${accent} 9%, transparent))`,
        border: `1px solid color-mix(in srgb, ${accent} 38%, transparent)`,
        boxShadow: `inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent), 0 2px 8px -2px color-mix(in srgb, ${accent} 40%, transparent)`, ...style }}>
      {glyph}
    </span>
  );
}

// ── Ink stamp — rubber-stamp mark, hatched fill, rotated ───────────────────
function InkStamp({ label = "ACCÈS LIBRE", date = "MMXXVI", hue = "var(--secondary)", rotate = -5, className = "", style = {} }) {
  return (
    <span className={"font-headline " + className} aria-hidden="true"
      style={{ display: "inline-block", transform: `rotate(${rotate}deg)`, color: hue, ...style }}>
      <span style={{ display: "block", padding: "0.35rem 0.875rem 0.25rem", border: `2px solid ${hue}`, borderRadius: 6, opacity: 0.85,
        backgroundImage: "repeating-linear-gradient(45deg, transparent 0 2px, color-mix(in srgb, var(--background) 55%, transparent) 2px 3px)",
        boxShadow: `inset 0 0 0 3px color-mix(in srgb, var(--background) 60%, transparent), inset 0 0 0 4px color-mix(in srgb, ${hue} 50%, transparent)` }}>
        <span className="font-body" style={{ display: "block", fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.32em" }}>{label}</span>
        <span style={{ display: "block", textAlign: "center", fontSize: "0.5625rem", fontStyle: "italic", letterSpacing: "0.1em", marginTop: 1 }}>{date}</span>
      </span>
    </span>
  );
}

// ── Drop cap — framed illuminated initial ──────────────────────────────────
function DropCap({ letter, hue = "var(--primary)", size = 96, className = "", style = {} }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={{ display: "block", ...style }} aria-hidden="true">
      <rect x="4" y="4" width="92" height="92" rx="6" fill={`color-mix(in srgb, ${hue} 10%, transparent)`} stroke={hue} strokeWidth="1.2" opacity="0.9" />
      <g stroke={hue} strokeWidth="0.5" fill="none" opacity="0.6">
        <path d="M10 10 Q20 15 10 25 Q15 35 25 30 M90 10 Q80 15 90 25 Q85 35 75 30" />
        <path d="M10 90 Q20 85 10 75 Q15 65 25 70 M90 90 Q80 85 90 75 Q85 65 75 70" />
      </g>
      <text x="50" y="74" fontFamily="Newsreader" fontStyle="italic" fontSize="68" fontWeight="600" fill={hue} textAnchor="middle">{letter}</text>
    </svg>
  );
}

// ── Ikigai diagram — four overlapping circles converging on a gilded centre.
// Each ring draws itself in, then the centre seal pulses. `animate` gates the
// draw-in so it can sync with a splash's entrance.
function IkigaiDiagram({ size = 360, animate = true, className = "", style = {} }) {
  const dims = [
    { label: "Ce que j'aime", kanji: "好", accent: "#E0954A", cx: 132, cy: 132 },
    { label: "Ce où je suis bon", kanji: "得", accent: "#3FB0C4", cx: 228, cy: 132 },
    { label: "Ce dont on a besoin", kanji: "要", accent: "#9DB0C2", cx: 132, cy: 228 },
    { label: "Ce qui a de la valeur", kanji: "報", accent: "#BB9CBE", cx: 228, cy: 228 },
  ];
  const R = 92, C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 360 360" width={size} height={size} className={className} style={{ display: "block", ...style }} aria-hidden="true">
      {dims.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={R} fill={`color-mix(in srgb, ${d.accent} 9%, transparent)`}
          stroke={d.accent} strokeWidth="1.4" opacity="0.85"
          strokeDasharray={C} strokeDashoffset={animate ? C : 0}
          style={animate ? { animation: "draw 1.6s cubic-bezier(.16,1,.3,1) forwards", animationDelay: `${0.3 + i * 0.28}s` } : {}} />
      ))}
      {dims.map((d, i) => (
        <text key={"k" + i} x={d.cx} y={d.cy} dx={d.cx < 180 ? -34 : 34} dy={d.cy < 180 ? -30 : 36}
          fontFamily="Newsreader" fontSize="22" fill={d.accent} textAnchor="middle"
          className="fade" style={{ animationDelay: `${1.4 + i * 0.18}s` }}>{d.kanji}</text>
      ))}
      {/* gilded centre */}
      <circle cx="180" cy="180" r="30" fill="color-mix(in srgb, var(--primary) 22%, transparent)" stroke="var(--primary)" strokeWidth="1.6"
        className="fade" style={{ animationDelay: "2.4s", animation: "pulse-glow 3s infinite ease-in-out, fade-in 1s ease 2.2s both" }} />
      <text x="180" y="186" fontFamily="Newsreader" fontStyle="italic" fontSize="17" fill="var(--primary)" textAnchor="middle"
        className="fade" style={{ animationDelay: "2.6s" }}>志</text>
    </svg>
  );
}

Object.assign(window, { useParallax, EnterCue, CompassIkigaiIntro, Fleuron, FleuronDivider, CompassRose, Constellation, WaxSeal, InkStamp, DropCap, IkigaiDiagram });
