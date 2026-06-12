/* global React, CompassIkigaiIntro, Constellation, WaxSeal, Fleuron, EnterCue, useParallax */
// Direction 1 — L'ATLAS VIVANT · entry portal (intro ikigai → boussole)
// Four gilded circles fade in as an ikigai, turn, then tighten onto the needle
// to become the compass. As it forms, the four forces (好得要報) settle in and
// the writing rises calmly to invite you in. Then the compass stays, hoverable.

function SplashAtlas({ speed = 1, enterLabel = "Entrer dans l'atelier" }) {
  const [bind, mx, my] = useParallax();
  const seals = [
    { g: "発", a: "#D28236", pos: { left: "8%", top: "22%" }, size: 56, cls: "float", d: "0s", depth: 26 },
    { g: "業", a: "#267A8C", pos: { right: "10%", top: "17%" }, size: 64, cls: "float-slow", d: "1.2s", depth: 34 },
    { g: "観", a: "#4C6B8A", pos: { left: "13%", bottom: "18%" }, size: 50, cls: "float-x", d: "0.6s", depth: 20 },
    { g: "論", a: "#7C4680", pos: { right: "12%", bottom: "20%" }, size: 58, cls: "float", d: "1.8s", depth: 30 },
    { g: "契", a: "#9A6A3C", pos: { right: "23%", top: "40%" }, size: 42, cls: "float-slow", d: "2.4s", depth: 16 },
    { g: "報", a: "#5A455C", pos: { left: "20%", top: "38%" }, size: 40, cls: "float", d: "3s", depth: 14 },
  ];

  return (
    <div className="map-paper grain font-body portal" {...bind}
      style={{ position: "relative", width: 1440, height: 900, overflow: "hidden", background: "var(--background)", color: "var(--on-background)" }}>
      {/* photographic dawn sky */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url('assets/bg-claire.png')", backgroundSize: "cover", backgroundPosition: "center top" }} />
      {/* breathing halo */}
      <div className="breathe parallax" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        transform: `translate(${mx * 10}px, ${my * 10}px)`,
        background: "radial-gradient(46% 42% at 50% 46%, color-mix(in srgb, var(--primary) 16%, transparent) 0%, transparent 70%)" }} />

      {/* memo corners — shared with the night-sky direction */}
      <div className="fade font-mono" style={{ "--d": "0.2s", position: "absolute", top: 42, left: 48, zIndex: 3, fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--on-surface-variant)", textShadow: "0 1px 10px rgba(255,251,242,0.7)" }}>
        TABULA VENTURA · <span style={{ color: "color-mix(in srgb, var(--primary) 80%, transparent)" }}>RÉF. VC-001</span>
      </div>
      <div className="fade font-mono" style={{ "--d": "0.2s", position: "absolute", top: 42, right: 48, zIndex: 3, fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--on-surface-variant)", textShadow: "0 1px 10px rgba(255,251,242,0.7)" }}>
        MMXXVI · <span style={{ color: "color-mix(in srgb, var(--primary) 80%, transparent)" }}>ACCÈS LIBRE</span>
      </div>
      <Constellation className="parallax" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 320, width: "100%", opacity: 0.55,
        transform: `translate(${mx * -14}px, ${my * -6}px)`,
        WebkitMaskImage: "linear-gradient(to bottom, black, transparent)", maskImage: "linear-gradient(to bottom, black, transparent)" }} />

      {/* drifting path seals — deeper layers move more */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        {seals.map((s, i) => (
          <div key={i} className={s.cls + " parallax"} style={{ position: "absolute", ...s.pos, animationDelay: s.d, opacity: 0.85, transform: `translate(${mx * s.depth}px, ${my * s.depth}px)` }}>
            <WaxSeal glyph={s.g} accent={s.a} size={s.size} />
          </div>
        ))}
      </div>

      {/* centre */}
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <span className="font-mono rise" style={{ "--d": "0.1s", display: "inline-flex", alignItems: "center", gap: 12, fontSize: "0.66rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--on-surface-variant)", textShadow: "0 1px 12px rgba(255,251,242,0.75)" }}>
          <Fleuron style={{ fontSize: "0.7rem" }} /> VC Premium Experience <Fleuron style={{ fontSize: "0.7rem" }} />
        </span>

        <div className="focal" style={{ position: "relative", margin: "26px 0 22px" }}>
          {/* radiant sun-halo — soft, brightest just around the compass body */}
          <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: 480, height: 480, transform: "translate(-50%, -50%)", borderRadius: "50%", pointerEvents: "none",
            background: "radial-gradient(circle, rgba(255,224,150,0.1) 0%, rgba(255,206,110,0.24) 40%, rgba(255,188,72,0.1) 60%, rgba(255,188,72,0) 78%)" }} />
          <div style={{ position: "relative", filter: "drop-shadow(0 0 1.4px rgba(64,42,14,0.9)) drop-shadow(0 0 9px rgba(255,192,72,0.55))" }}>
            <CompassIkigaiIntro size={188} speed={speed} hue="#FFF3B0" />
          </div>
        </div>

        <h1 className="font-headline rise" style={{ "--d": "2.4s", margin: 0, fontSize: "2.1rem", fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.01em", textShadow: "0 1px 16px rgba(255,251,242,0.6)" }}>
          Comprendre le venture. <span style={{ color: "var(--primary)" }}>Vous comprendre.</span>
        </h1>

        <EnterCue className="rise" style={{ "--d": "2.62s", marginTop: 38 }} label={enterLabel} />
      </div>
    </div>
  );
}
window.SplashAtlas = SplashAtlas;
