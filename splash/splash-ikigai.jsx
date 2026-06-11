/* global React, IkigaiDiagram, Constellation, Fleuron, EnterCue, useParallax */
// Direction 3 — L'IKIGAI · entry portal
// Introspection before content, made literal and almost wordless. On deep ink
// the four circles draw themselves in and keep breathing around a gilded centre.
// One short line, one invitation.

function SplashIkigai() {
  const [bind, mx, my] = useParallax();
  return (
    <div className="ink grain font-body portal" {...bind}
      style={{ position: "relative", width: 1440, height: 900, overflow: "hidden", display: "grid", placeItems: "center", background: "var(--background)", color: "var(--on-background)" }}>
      <Constellation hue="var(--primary)" className="parallax" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.16, transform: `translate(${mx * -12}px, ${my * -8}px)` }} />
      <div className="breathe parallax" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", transform: `translate(${mx * 10}px, ${my * 10}px)`,
        background: "radial-gradient(40% 44% at 50% 46%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <span className="font-mono rise" style={{ "--d": "0.1s", display: "inline-flex", alignItems: "center", gap: 12, fontSize: "0.66rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--on-surface-variant)" }}>
          <Fleuron style={{ fontSize: "0.7rem" }} /> VC Premium Experience <Fleuron style={{ fontSize: "0.7rem" }} />
        </span>

        <div className="focal" style={{ margin: "12px 0 6px" }}>
          <div className="breathe parallax" style={{ transform: `translate(${mx * 6}px, ${my * 6}px)` }}>
            <IkigaiDiagram size={400} animate={true} />
          </div>
        </div>

        <h1 className="font-headline rise" style={{ "--d": "0.3s", margin: 0, fontSize: "2rem", fontWeight: 500, fontStyle: "italic", letterSpacing: "-0.01em" }}>
          Quatre forces. Un centre — <span style={{ color: "var(--primary)" }}>le vôtre.</span>
        </h1>

        <EnterCue className="rise" style={{ "--d": "0.44s", marginTop: 34 }} label="Trouver mon centre" accentOnDark={true} />
      </div>
    </div>
  );
}
window.SplashIkigai = SplashIkigai;
