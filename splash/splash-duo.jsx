/* global React, SplashAtlas, SplashConstellation, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakSelect, TweakColor, TweakButton */
// Unified entry portal — one landing, two lights.
// CLAIR reveals direction 01 (L'Atlas Vivant, open parchment); SOMBRE reveals
// direction 04 (La Constellation, night sky). Both treatments are stacked and
// cross-fade, so the ikigai → compass intro plays once and the switch is seamless.
//
// Transitions are driven by timer-based JS tweens (not the CSS animation
// timeline) so the cross-fade and the sliding toggle work reliably in every
// preview frame as well as in a real browser.
const { useState, useEffect, useRef } = React;

// easeOutCubic tween over wall-clock time — independent of the rAF timeline.
function tween(from, to, dur, step, done) {
  const start = Date.now();
  const iv = setInterval(() => {
    const t = Math.min(1, (Date.now() - start) / dur);
    const e = 1 - Math.pow(1 - t, 3);
    step(from + (to - from) * e);
    if (t >= 1) { clearInterval(iv); done && done(); }
  }, 16);
  return () => clearInterval(iv);
}

// ── Tweak defaults ──────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentGold": "#C5A85C",
  "introSpeed": 1,
  "defaultMode": "auto",
  "enterLabel": "Entrer dans l'atelier"
}/*EDITMODE-END*/;

// ── Sun / moon glyphs ──────────────────────────────────────────────────────
function SunIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.6M12 19v2.6M4.2 4.2l1.9 1.9M17.9 17.9l1.9 1.9M2.4 12h2.6M19 12h2.6M4.2 19.8l1.9-1.9M17.9 6.1l1.9-1.9" />
    </svg>
  );
}
function MoonIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.2A8 8 0 0 1 9.8 4 7 7 0 1 0 20 14.2z" />
    </svg>
  );
}

// ── Clair / Sombre chooser — segmented, gilded active state ─────────────────
function ModeToggle({ mode, onChange }) {
  const dark = mode === "dark";
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const mounted = useRef(false);
  const idleColor = dark ? "#A49F93" : "#565042";

  useEffect(() => {
    const track = trackRef.current, thumb = thumbRef.current;
    if (!track || !thumb) return;
    const w = track.clientWidth;
    const left = dark ? w / 2 + 1 : 4;
    if (!mounted.current) { thumb.style.left = left + "px"; mounted.current = true; return; }
    const from = parseFloat(thumb.style.left || "4");
    return tween(from, left, 520, (v) => { thumb.style.left = v + "px"; });
  }, [dark]);

  const segs = [
    { id: "light", label: "Clair", Icon: SunIcon },
    { id: "dark", label: "Sombre", Icon: MoonIcon },
  ];
  return (
    <div style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", zIndex: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <span className="font-mono" style={{ whiteSpace: "nowrap", fontSize: "0.56rem", letterSpacing: "0.3em", textTransform: "uppercase", color: idleColor, opacity: 0.72 }}>
        Choisissez votre lumière
      </span>
      <div ref={trackRef} role="radiogroup" aria-label="Thème" style={{ position: "relative", display: "flex", gap: 2, padding: 4, borderRadius: 999,
        background: dark ? "rgba(18,20,26,0.55)" : "rgba(255,255,255,0.5)",
        border: `1px solid ${dark ? "rgba(244,242,235,0.16)" : "rgba(18,19,26,0.12)"}`,
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        boxShadow: dark ? "inset 0 1px 0 rgba(255,255,255,0.05)" : "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 10px -6px rgba(18,19,26,0.25)" }}>
        <span ref={thumbRef} aria-hidden="true" style={{ position: "absolute", top: 4, bottom: 4, left: 4, width: "calc(50% - 5px)", borderRadius: 999,
          backgroundImage: "linear-gradient(135deg, #B09247 0%, var(--primary,#C5A85C) 52%, #DFCA8B 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 3px 12px -4px rgba(176,146,71,0.6)" }} />
        {segs.map(({ id, label, Icon }) => {
          const active = mode === id;
          return (
            <button key={id} role="radio" aria-checked={active} aria-label={label} title={label} onClick={() => onChange(id)}
              style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
                border: "none", background: "transparent", cursor: "pointer", borderRadius: 999,
                width: 38, height: 32, padding: 0, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.68rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: active ? "#12131A" : idleColor, fontWeight: active ? 600 : 400 }}>
              <Icon size={14} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SplashDuo() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // resolve the visitor's system preference once for "auto"
  const systemDark = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolveMode = (m) => (m === "auto" ? (systemDark() ? "dark" : "light") : m);

  const [mode, setMode] = useState(() => resolveMode(t.defaultMode));
  const dark = mode === "dark";
  const [replayKey, setReplayKey] = useState(0);

  const atlasRef = useRef(null);
  const constRef = useRef(null);
  const mounted = useRef(false);

  // When the default-mode tweak changes, follow it.
  useEffect(() => { setMode(resolveMode(t.defaultMode)); }, [t.defaultMode]);

  // Gilded accent — override --primary on both the light root and the .ink subtree.
  useEffect(() => {
    let el = document.getElementById("tweak-gold");
    if (!el) { el = document.createElement("style"); el.id = "tweak-gold"; document.head.appendChild(el); }
    const g = t.accentGold;
    el.textContent = `:root{--primary:${g} !important;} .ink{--primary:${g} !important;}`;
  }, [t.accentGold]);

  // Intro speed → remount the portals so the choreography replays at the new
  // tempo, and re-run the text reveal in step.
  useEffect(() => { setReplayKey((k) => k + 1); }, [t.introSpeed]);
  useEffect(() => {
    window.__introSpeed = t.introSpeed;
    const id = requestAnimationFrame(() => { if (window.__playReveal) window.__playReveal(t.introSpeed); });
    return () => cancelAnimationFrame(id);
  }, [replayKey, t.introSpeed]);

  // Cross-fade the two stacked layers; carry the chosen light to the background.
  useEffect(() => {
    const bg = dark ? "#08090C" : "#ECEAE3";
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
    const stage = document.getElementById("stage");
    if (stage) stage.style.background = bg;

    const a = atlasRef.current, c = constRef.current;
    if (!a || !c) return;
    a.style.pointerEvents = dark ? "none" : "auto";
    c.style.pointerEvents = dark ? "auto" : "none";
    const aTo = dark ? 0 : 1, cTo = dark ? 1 : 0;
    if (!mounted.current) { a.style.opacity = String(aTo); c.style.opacity = String(cTo); mounted.current = true; return; }
    const stop1 = tween(parseFloat(a.style.opacity || "1"), aTo, 850, (v) => { a.style.opacity = String(v); });
    const stop2 = tween(parseFloat(c.style.opacity || "0"), cTo, 850, (v) => { c.style.opacity = String(v); });
    return () => { stop1(); stop2(); };
  }, [dark]);

  const base = { position: "absolute", inset: 0 };

  return (
    <div style={{ position: "relative", width: 1440, height: 900, overflow: "hidden" }}>
      <div ref={atlasRef} style={{ ...base, opacity: dark ? 0 : 1, pointerEvents: dark ? "none" : "auto" }}>
        <SplashAtlas key={"atlas-" + replayKey} speed={t.introSpeed} enterLabel={t.enterLabel} />
      </div>
      <div ref={constRef} style={{ ...base, opacity: dark ? 1 : 0, pointerEvents: dark ? "auto" : "none" }}>
        <SplashConstellation key={"const-" + replayKey} speed={t.introSpeed} enterLabel={t.enterLabel} />
      </div>
      <ModeToggle mode={mode} onChange={setMode} />

      <TweaksPanel>
        <TweakSection label="Lumière" />
        <TweakRadio label="Mode par défaut" value={t.defaultMode}
          options={[{ value: "light", label: "Clair" }, { value: "dark", label: "Sombre" }, { value: "auto", label: "Auto" }]}
          onChange={(v) => setTweak("defaultMode", v)} />
        <TweakColor label="Accent doré" value={t.accentGold}
          options={["#C5A85C", "#B8924B", "#D8C081", "#A67C3D"]}
          onChange={(v) => setTweak("accentGold", v)} />

        <TweakSection label="Intro" />
        <TweakSlider label="Vitesse" value={t.introSpeed} min={0.6} max={1.8} step={0.1} unit="×"
          onChange={(v) => setTweak("introSpeed", v)} />
        <TweakButton label="Rejouer l'intro" onClick={() => setReplayKey((k) => k + 1)} />

        <TweakSection label="Appel à l'action" />
        <TweakSelect label="Libellé du bouton" value={t.enterLabel}
          options={["Entrer dans l'atelier", "Entrer", "Commencer", "Découvrir", "Ouvrir l'atlas"]}
          onChange={(v) => setTweak("enterLabel", v)} />
      </TweaksPanel>
    </div>
  );
}

window.SplashDuo = SplashDuo;
