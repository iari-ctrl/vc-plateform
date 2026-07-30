import { useEffect, useState, type ReactNode } from 'react';

/**
 * Dev-only responsive preview. Wraps the whole app: in "desktop" it renders the
 * site untouched; in "tablet"/"mobile" it renders the same app inside a
 * device-sized <iframe> so the real viewport — and therefore the CSS
 * breakpoints, matchMedia and `width=device-width` — actually changes (a merely
 * narrowed <div> would not). The control is a tiny, near-transparent bar in the
 * bottom-right corner that only becomes opaque on hover/focus.
 *
 * Recursion guard: the preview iframe loads the same app, so the chrome must
 * exist only in the top window. The embedded copy (window.self !== window.top)
 * renders its children plainly — no bar, no nested iframe.
 *
 * Gated behind import.meta.env.DEV: it never ships in a production build.
 */

type Device = 'desktop' | 'tablet' | 'mobile';

const SIZES: Record<Exclude<Device, 'desktop'>, { w: number; h: number; radius: number }> = {
  tablet: { w: 834, h: 1112, radius: 24 },
  mobile: { w: 390, h: 844, radius: 44 },
};

const LABELS: Record<Device, string> = {
  desktop: 'Ordinateur',
  tablet: 'Tablette',
  mobile: 'Mobile',
};

const STORAGE_KEY = 'vc:viewport-device';

const isTopFrame = typeof window !== 'undefined' && window.self === window.top;

export function ViewportSwitcher({ children }: { children: ReactNode }) {
  if (!import.meta.env.DEV || !isTopFrame) return <>{children}</>;
  return <ViewportSwitcherHost>{children}</ViewportSwitcherHost>;
}

function ViewportSwitcherHost({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<Device>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return saved === 'tablet' || saved === 'mobile' ? saved : 'desktop';
  });
  // Captured once when leaving desktop and kept stable across tablet/mobile
  // swaps, so changing the frame size does not reload the previewed page.
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (device === 'desktop') {
      setFrameSrc(null);
      return;
    }
    setFrameSrc((prev) => prev ?? window.location.href);
  }, [device]);

  useEffect(() => {
    if (device === 'desktop') return;
    const size = SIZES[device];
    const fit = () => {
      const s = Math.min(1, (window.innerWidth - 48) / size.w, (window.innerHeight - 104) / size.h);
      setScale(s > 0 ? s : 1);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [device]);

  const choose = (d: Device) => {
    setDevice(d);
    try {
      localStorage.setItem(STORAGE_KEY, d);
    } catch {
      /* private mode / storage disabled — preview still works for the session */
    }
  };

  return (
    <>
      <style>{CSS}</style>

      {device === 'desktop'
        ? children
        : (
            <div className="vcvp-stage">
              {frameSrc && (
                <div
                  style={{
                    width: SIZES[device].w,
                    height: SIZES[device].h,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <iframe
                    title={`Aperçu ${LABELS[device]}`}
                    src={frameSrc}
                    className="vcvp-frame"
                    style={{ borderRadius: SIZES[device].radius }}
                  />
                </div>
              )}
            </div>
          )}

      <div className="vcvp-bar" role="group" aria-label="Aperçu responsive" data-device={device}>
        {(Object.keys(LABELS) as Device[]).map((d) => (
          <button
            key={d}
            type="button"
            className="vcvp-btn"
            title={LABELS[d]}
            aria-label={LABELS[d]}
            aria-pressed={device === d}
            onClick={() => choose(d)}
          >
            {ICONS[d]}
          </button>
        ))}
      </div>
    </>
  );
}

const ICONS: Record<Device, ReactNode> = {
  desktop: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  tablet: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M12 17.5h.01" />
    </svg>
  ),
  mobile: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M12 17.5h.01" />
    </svg>
  ),
};

const CSS = `
.vcvp-stage {
  position: fixed;
  inset: 0;
  z-index: 2147482000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141416;
}
.vcvp-frame {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}
.vcvp-bar {
  position: fixed;
  right: 14px;
  bottom: 14px;
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: 12px;
  background: rgba(18, 18, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  opacity: 0.14;
  transition: opacity 0.18s ease;
}
.vcvp-bar[data-device="desktop"] {
  z-index: 65;
}
.vcvp-bar:not([data-device="desktop"]) {
  z-index: 2147483000;
}
.vcvp-bar:hover,
.vcvp-bar:focus-within {
  opacity: 1;
}
.vcvp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #c7c7ce;
  cursor: pointer;
}
.vcvp-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.vcvp-btn[aria-pressed="true"] {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}
`;
