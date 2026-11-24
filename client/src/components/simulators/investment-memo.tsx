import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink } from 'lucide-react';
import { publicAssetUrl } from '@shared/base-url.mjs';
import { useTheme } from '@/context/ThemeContext';

const MEMO_SIMULATOR_PATH = 'tools/simulateur-memo.html';

export function InvestmentMemoSim({ platformActions }: { accent: string; platformActions?: ReactNode }) {
  const simulatorSrc = publicAssetUrl(MEMO_SIMULATOR_PATH, import.meta.env.BASE_URL);
  const { theme } = useTheme();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [actionsRoot, setActionsRoot] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(900);
  const connect = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (doc) setActionsRoot(doc.getElementById('memo-platform-actions'));
  }, []);

  useEffect(() => {
    const ready = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frameRef.current?.contentWindow && event.data?.type === 'memo:ready') connect();
    };
    window.addEventListener('message', ready);
    return () => window.removeEventListener('message', ready);
  }, [connect]);

  useEffect(() => {
    const doc = actionsRoot?.ownerDocument;
    if (!doc) return;
    doc.documentElement.classList.toggle('dark', theme === 'dark');
    doc.documentElement.dataset.embedded = 'true';
  }, [actionsRoot, theme]);

  useEffect(() => {
    const root = actionsRoot?.closest<HTMLElement>('.memo-app');
    if (!root) return;
    // An auto-height iframe does not scroll itself. Give its sticky chrome the
    // host viewport's offset without reintroducing a second scrolling surface.
    const syncViewport = () => {
      const frame = frameRef.current;
      if (!frame) return;
      const inset = window.matchMedia('(max-width: 1023px)').matches ? 56 : 0;
      root.style.setProperty('--memo-viewport-top', `${Math.max(0, inset - frame.getBoundingClientRect().top)}px`);
    };
    const resize = () => {
      setHeight(Math.ceil(root.getBoundingClientRect().height));
      syncViewport();
    };
    let viewportFrame = 0;
    const scheduleViewport = () => {
      cancelAnimationFrame(viewportFrame);
      viewportFrame = requestAnimationFrame(syncViewport);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();
    window.addEventListener('scroll', scheduleViewport, { passive: true });
    window.addEventListener('resize', scheduleViewport);
    // Keep keyboard/programmatic focus visible above the platform's mobile bar.
    let pending = 0;
    const revealFocus = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        const active = root.ownerDocument.activeElement;
        const frame = frameRef.current;
        if (!active || !frame || active === root.ownerDocument.body) return;
        // The engine can focus a newly opened section before ResizeObserver
        // has resized the host iframe. Wait for that layout, not a fixed delay.
        if (Math.abs(frame.clientHeight - root.getBoundingClientRect().height) > 1) {
          revealFocus();
          return;
        }
        const rect = active.getBoundingClientRect();
        const frameTop = frame.getBoundingClientRect().top;
        const top = frameTop + rect.top;
        const bottom = frameTop + rect.bottom;
        let inset = window.matchMedia('(max-width: 1023px)').matches ? 72 : 16;
        for (const selector of ['.memo-header', '.memo-rail']) {
          const bar = root.querySelector<HTMLElement>(selector);
          if (bar?.contains(active)) break;
          if (bar && getComputedStyle(bar).position === 'sticky') inset += bar.offsetHeight;
        }
        if (top < inset || (bottom > window.innerHeight - 16 && rect.height > window.innerHeight - inset - 16)) {
          window.scrollBy({ top: top - inset, behavior: 'instant' });
        } else if (bottom > window.innerHeight - 16) {
          window.scrollBy({ top: bottom - window.innerHeight + 16, behavior: 'instant' });
        }
      });
    };
    root.ownerDocument.addEventListener('focusin', revealFocus);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(pending);
      cancelAnimationFrame(viewportFrame);
      window.removeEventListener('scroll', scheduleViewport);
      window.removeEventListener('resize', scheduleViewport);
      root.ownerDocument.removeEventListener('focusin', revealFocus);
    };
  }, [actionsRoot]);

  return (
    <section className="min-w-0" aria-label="Rédaction de la note d’investissement">
      <iframe
        ref={frameRef}
        onLoad={connect}
        src={`${simulatorSrc}?embedded=1`}
        title="Simulateur de note d'investissement"
        allow="clipboard-write"
        className="block w-full border-0"
        style={{ height }}
      />
      {actionsRoot && createPortal(<>
        {platformActions}
        <a href={`${simulatorSrc}?theme=${theme}`} target="_blank" rel="noreferrer" className="memo-fullpage" title="Pleine page">
          <ExternalLink size={15} aria-hidden /> <span>Pleine page</span>
        </a>
      </>, actionsRoot)}
    </section>
  );
}
