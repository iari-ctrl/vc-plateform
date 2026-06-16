/* global React, Fleuron, EnterCue, useParallax */
// Direction 2 — LE CARNET · entry portal
// A single notebook leaf in candlelight. The platform asks short questions, one
// after another — it listens before it teaches. Warm flicker, paper grain, a
// quill-drawn flourish. One invitation: Ouvrir le carnet.
const { useState, useEffect } = React;

const PROMPTS = ["Pourquoi le venture ?", "Qu'aimez-vous explorer ?", "Où est votre centre ?", "Qu'est-ce qui compte vraiment ?"];

function useRotatingType(items, { type = 55, hold = 2200, erase = 28 } = {}) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (reduce) { setTxt(items[0]); return; }
    let t; let phase = "type"; let n = 0;
    const full = items[i];
    const step = () => {
      if (phase === "type") {
        n++; setTxt(full.slice(0, n));
        if (n >= full.length) { phase = "hold"; t = setTimeout(step, hold); return; }
        t = setTimeout(step, type);
      } else if (phase === "hold") {
        phase = "erase"; t = setTimeout(step, erase);
      } else {
        n--; setTxt(full.slice(0, Math.max(0, n)));
        if (n <= 0) { setI((p) => (p + 1) % items.length); return; }
        t = setTimeout(step, erase);
      }
    };
    t = setTimeout(step, 400);
    return () => clearTimeout(t);
  }, [i, items, type, hold, erase, reduce]);
  return txt;
}

function SplashCarnet() {
  const [bind, mx, my] = useParallax();
  const typed = useRotatingType(PROMPTS);

  return (
    <div className="grain font-body portal" {...bind}
      style={{ position: "relative", width: 1440, height: 900, overflow: "hidden", display: "grid", placeItems: "center",
        background: "radial-gradient(80% 70% at 50% 36%, #FAF6EA 0%, #F1EADA 60%, #E9E1CE 100%)", color: "var(--on-background)" }}>
      {/* candle glow */}
      <div className="flicker parallax" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "26%", width: 760, height: 520, transform: `translate(-50%,-50%) translate(${mx * 8}px, ${my * 8}px)`, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 26%, transparent) 0%, transparent 62%)" }} />

      {/* brand */}
      <span className="font-mono rise" style={{ "--d": "0.1s", position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", display: "inline-flex", alignItems: "center", gap: 10, fontSize: "0.62rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--on-surface-variant)", zIndex: 3 }}>
        <Fleuron style={{ fontSize: "0.7rem" }} /> VC Premium Experience
      </span>

      {/* the leaf */}
      <div className="focal" style={{ position: "relative", zIndex: 2, width: 760, padding: "64px 72px 56px", borderRadius: 6,
        background: "linear-gradient(180deg, #FBF7EC, #F5EFDF)", border: "1px solid color-mix(in srgb, var(--outline-variant) 80%, transparent)",
        boxShadow: "0 40px 80px -30px rgba(18,19,26,0.28), 0 2px 0 #EFE7D4, 6px 6px 0 -2px color-mix(in srgb, var(--primary) 8%, transparent)" }}>
        {/* ruled lines + margin */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: 6, opacity: 0.5, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(transparent 0 38px, color-mix(in srgb, var(--secondary) 12%, transparent) 38px 39px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 8%, black 22%, black 88%, transparent 98%)", maskImage: "linear-gradient(to bottom, transparent 8%, black 22%, black 88%, transparent 98%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: 18, bottom: 18, left: 44, width: 1.5, background: "color-mix(in srgb, var(--tertiary) 38%, transparent)" }} />

        <div style={{ position: "relative", textAlign: "center" }}>
          <p className="running-head rise" style={{ "--d": "0.2s" }}>Le carnet vous écoute</p>

          <h1 className="font-headline" style={{ margin: "22px 0 0", minHeight: "1.5em", fontSize: "3rem", fontWeight: 500, fontStyle: "italic", lineHeight: 1.15, color: "color-mix(in srgb, var(--secondary) 92%, var(--on-background))" }}>
            {typed}<span style={{ display: "inline-block", width: 3, height: "1em", marginLeft: 4, verticalAlign: "-0.12em", background: "var(--primary)", animation: "blink 1s step-end infinite" }} />
          </h1>

          {/* quill flourish */}
          <svg width="200" height="20" viewBox="0 0 200 20" style={{ margin: "20px auto 0", display: "block" }} aria-hidden="true">
            <path d="M6 12 C 50 4, 90 4, 100 10 S 150 18, 194 8" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"
              strokeDasharray="260" strokeDashoffset="260" style={{ animation: "draw 1.6s cubic-bezier(.16,1,.3,1) 0.6s forwards" }} />
          </svg>

          <p className="rise" style={{ "--d": "0.34s", margin: "20px auto 0", maxWidth: 380, fontSize: "0.92rem", lineHeight: 1.65, color: "var(--on-surface-variant)" }}>
            Il écoute avant d'enseigner. Rien n'est noté tant que vous n'écrivez pas.
          </p>

          <EnterCue className="rise" style={{ "--d": "0.48s", marginTop: 34 }} label="Ouvrir le carnet" />
        </div>
      </div>
    </div>
  );
}
window.SplashCarnet = SplashCarnet;
