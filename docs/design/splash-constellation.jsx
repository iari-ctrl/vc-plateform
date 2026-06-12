/* global React, Constellation, CompassIkigaiIntro, Fleuron, WaxSeal, EnterCue, useParallax */
// Direction 4 — LA CONSTELLATION · entry portal (intro ikigai → boussole)
// On the night sky an explorer steers by, four gilded circles gather into an
// ikigai, turn, then tighten onto the needle to form the compass. As it sets,
// the four forces (好得要報) appear and the writing rises to invite you in.

function SplashConstellation({ speed = 1, enterLabel = "Entrer" }) {
  const [bind, mx, my] = useParallax();
  const corners = [
    { g: "発", a: "#D28236", s: { left: 90, top: 200 }, size: 44, cls: "float", depth: 30 },
    { g: "論", a: "#A68AA9", s: { right: 110, top: 230 }, size: 40, cls: "float-slow", depth: 24 },
    { g: "観", a: "#3FB0C4", s: { left: 150, bottom: 210 }, size: 38, cls: "float-x", depth: 20 },
    { g: "業", a: "#C5A85C", s: { right: 150, bottom: 196 }, size: 44, cls: "float", depth: 34 },
  ];
  return (
    <div className="ink grain font-body portal" {...bind}
      style={{ position: "relative", width: 1440, height: 900, overflow: "hidden", background: "var(--background)", color: "var(--on-background)" }}>
      {/* photographic night sky */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url('assets/bg-sombre.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      {/* readability veil — darken centre + ground the edges so stars/compass read */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0,
        background: "radial-gradient(120% 90% at 50% 42%, rgba(8,9,12,0.62) 0%, rgba(8,9,12,0.32) 45%, rgba(8,9,12,0.55) 100%)" }} />
      <Constellation hue="var(--primary)" className="parallax" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 560, width: "100%", opacity: 0.28, transform: `translate(${mx * -16}px, ${my * -8}px)`,
        WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)", maskImage: "linear-gradient(to bottom, black 40%, transparent)" }} />
      <div className="breathe parallax" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", transform: `translate(${mx * 10}px, ${my * 10}px)`,
        background: "radial-gradient(42% 42% at 50% 44%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 68%)" }} />

      {/* drifting seals */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        {corners.map((c, i) => (
          <div key={i} className={c.cls + " parallax"} style={{ position: "absolute", ...c.s, opacity: 0.8, animationDelay: `${i * 0.7}s`, transform: `translate(${mx * c.depth}px, ${my * c.depth}px)` }}>
            <WaxSeal glyph={c.g} accent={c.a} size={c.size} />
          </div>
        ))}
      </div>

      {/* memo corners */}
      <div className="fade font-mono" style={{ "--d": "0.2s", position: "absolute", top: 42, left: 48, zIndex: 3, fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--on-surface-variant)" }}>
        TABULA VENTURA · <span style={{ color: "color-mix(in srgb, var(--primary) 80%, transparent)" }}>RÉF. VC-001</span>
      </div>
      <div className="fade font-mono" style={{ "--d": "0.2s", position: "absolute", top: 42, right: 48, zIndex: 3, fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--on-surface-variant)" }}>
        MMXXVI · <span style={{ color: "color-mix(in srgb, var(--primary) 80%, transparent)" }}>ACCÈS LIBRE</span>
      </div>

      {/* centre */}
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <span className="font-mono rise" style={{ "--d": "0.1s", display: "inline-flex", alignItems: "center", gap: 12, fontSize: "0.66rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--on-surface-variant)" }}>
          <Fleuron style={{ fontSize: "0.7rem" }} /> VC Premium Experience <Fleuron style={{ fontSize: "0.7rem" }} />
        </span>

        <div className="focal" style={{ margin: "30px 0 26px" }}>
          <CompassIkigaiIntro size={158} hue="var(--primary)" speed={speed} />
        </div>

        <h1 className="font-headline rise" style={{ "--d": "2.4s", margin: 0, fontSize: "2.1rem", fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.01em" }}>
          Comprendre le venture. <span style={{ color: "var(--primary)" }}>Vous comprendre.</span>
        </h1>

        <EnterCue className="rise" style={{ "--d": "2.62s", marginTop: 36 }} label={enterLabel} accentOnDark={true} />
      </div>
    </div>
  );
}
window.SplashConstellation = SplashConstellation;
