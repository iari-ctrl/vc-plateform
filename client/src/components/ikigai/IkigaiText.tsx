import { Fragment, useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Pin } from 'lucide-react';
import { glossaryBySlug, loadGlossaryDefs } from '@/content';
import { safeHttpUrl } from '@/lib/utils';
import type { GlossaryDef, IkigaiMode } from '@/content/types';

/**
 * Inline glossary for the Ikigai cahier.
 *
 *   [[slug|label]] — VC vocabulary. Active only in Avancé mode (renders as
 *                    plain text in Découverte to keep the reading light).
 *   {{slug|label}} — funds, tools, institutions. Always active, even in
 *                    Découverte, so the names stay clickable for everyone.
 *
 * Popovers are hoverable and *pinnable* on click (definition + example +
 * optional external link). This component is local to the cahier and does not
 * affect the Markdown renderer used by lessons / blog / case studies.
 */

const SPLIT = /(\[\[[^\]]+\]\]|\{\{[^}]+\}\})/g;
type PopoverPosition = { top: number; left: number; width: number; placement: 'above' | 'below' };

function GlossaryPopover({ slug, label }: { slug: string; label: string }) {
  const entry = glossaryBySlug(slug);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const [def, setDef] = useState<GlossaryDef | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  const cancelClose = () => clearTimeout(closeTimer.current);

  const positionPanel = useCallback(() => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const margin = 14;
    const width = Math.min(288, window.innerWidth - margin * 2);
    const center = rect.left + rect.width / 2;
    const left = Math.min(Math.max(center, margin + width / 2), window.innerWidth - margin - width / 2);
    const shouldOpenAbove = rect.bottom > window.innerHeight - 220 && rect.top > 220;

    setPosition({
      top: shouldOpenAbove ? rect.top - 10 : rect.bottom + 10,
      left,
      width,
      placement: shouldOpenAbove ? 'above' : 'below',
    });
  }, []);

  const openPreview = () => {
    cancelClose();
    positionPanel();
    setOpen(true);
  };

  const scheduleClose = () => {
    if (pinned) return;
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setPinned(false);
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(false);
        setOpen(false);
      }
    };
    const onMove = () => positionPanel();

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [open, positionPanel]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Pull the heavy definition lazily the first time the popover opens — the
  // short preview shows immediately while the definitions chunk loads.
  useEffect(() => {
    if (!open || def) return;
    void loadGlossaryDefs().then((all) => setDef(all[slug] ?? { definition: entry?.short ?? '' }));
  }, [open, def, slug, entry]);

  if (!entry) return <>{label}</>;

  const popover = open && position && typeof document !== 'undefined'
    ? createPortal(
        <span
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={entry.term}
          onMouseEnter={openPreview}
          onMouseLeave={scheduleClose}
          className="fixed z-[120] block max-h-[min(20rem,calc(100vh-2rem))] overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-left shadow-editorial-lg animate-fade-in"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            transform: position.placement === 'above' ? 'translate(-50%, -100%)' : 'translateX(-50%)',
          }}
        >
          <span className="mb-1.5 flex items-center justify-between gap-2">
            <span className="font-headline text-[0.95rem] font-semibold leading-tight text-foreground">{entry.term}</span>
            {pinned && <Pin size={12} className="shrink-0 text-[color:var(--primary)]" aria-hidden />}
          </span>
          <span className="block text-[0.8rem] leading-relaxed text-surface-variant">{def ? def.definition : entry.short}</span>
          {entry.aliases && entry.aliases.length > 0 && (
            <span className="mt-2 block font-mono text-[0.64rem] leading-relaxed text-surface-variant/80">
              Alias : {entry.aliases.slice(0, 5).join(', ')}
            </span>
          )}
          {def?.example && (
            <span className="mt-2 block font-headline text-[0.78rem] italic leading-relaxed text-surface-variant/90">
              {def.example}
            </span>
          )}
          {safeHttpUrl(entry.link) && (
            <a
              href={safeHttpUrl(entry.link)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="mt-2.5 inline-flex items-center gap-1.5 border-t border-outline-variant pt-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--primary)] hover:underline"
            >
              Visiter le site <ExternalLink size={11} />
            </a>
          )}
        </span>,
        document.body,
      )
    : null;

  return (
    <>
      <span
        ref={wrapRef}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        onMouseEnter={openPreview}
        onMouseLeave={scheduleClose}
        onFocus={openPreview}
        onBlur={() => !pinned && setOpen(false)}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          const next = !pinned;
          positionPanel();
          setPinned(next);
          setOpen(next);
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          event.stopPropagation();
          const next = !pinned;
          positionPanel();
          setPinned(next);
          setOpen(next);
        }}
        className="ikigai-term cursor-pointer rounded-[2px] font-medium text-foreground underline decoration-dotted decoration-[color-mix(in_srgb,var(--primary)_60%,transparent)] decoration-1 underline-offset-[3px] transition-colors hover:text-[color:var(--primary)] hover:decoration-[color:var(--primary)]"
        style={pinned ? { textDecorationColor: 'var(--primary)', color: 'var(--primary)' } : undefined}
      >
        {label}
      </span>
      {popover}
    </>
  );
}

export function IkigaiText({ text, mode }: { text: string; mode: IkigaiMode }): ReactNode {
  const parts = text.split(SPLIT);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[[') && part.endsWith(']]')) {
          const inner = part.slice(2, -2);
          const [slug, label] = inner.includes('|') ? inner.split('|') : [inner, inner];
          // VC terms are only revealed (clickable) in Avancé mode.
          if (mode !== 'avance') return <Fragment key={i}>{label.trim()}</Fragment>;
          return <GlossaryPopover key={i} slug={slug.trim()} label={label.trim()} />;
        }
        if (part.startsWith('{{') && part.endsWith('}}')) {
          const inner = part.slice(2, -2);
          const [slug, label] = inner.includes('|') ? inner.split('|') : [inner, inner];
          // Funds / tools / institutions: always active.
          return <GlossaryPopover key={i} slug={slug.trim()} label={label.trim()} />;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
