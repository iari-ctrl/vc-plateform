import { Fragment, useCallback, useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { glossaryBySlug, GLOSSARY } from '@/content';

/**
 * Lightweight markdown renderer tailored to the lesson/article content:
 *  - ## / ### headings
 *  - paragraphs
 *  - "- " bullet lists
 *  - **bold**, *italic*
 *  - [[slug|label]] inline glossary links (VC terms)
 *  - {{slug|label}} inline glossary links (funds, tools, institutions)
 *
 * When `glossaryPreview` is on (lesson prose), every technical term or acronym
 * from the glossary is also detected automatically — the first mention of each
 * term in the page becomes a popover trigger, so authors don't have to tag each
 * occurrence by hand. Manually tagged terms always take precedence.
 */

const INLINE = /(\[[^\]]+\]\([^)]+\)|\[\[[^\]]+\]\]|\{\{[^}]+\}\}|\*\*[^*]+\*\*|\*[^*]+\*)/g;
type PopoverPosition = { top: number; left: number; width: number; placement: 'above' | 'below' };

function GlossaryLink({ slug, label }: { slug: string; label: string }) {
  const term = glossaryBySlug(slug);
  if (!term) return <>{label}</>;
  return (
    <Link
      to={`/glossary?term=${slug}`}
      title={term.short}
      className="font-medium text-foreground underline decoration-dotted decoration-primary/60 decoration-1 underline-offset-[3px] transition-colors hover:decoration-primary hover:text-[color:var(--primary)]"
    >
      {label}
    </Link>
  );
}

export function GlossaryPreview({ slug, label }: { slug: string; label: string }) {
  const term = glossaryBySlug(slug);
  const navigate = useNavigate();
    const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();

  const clearCloseTimer = () => clearTimeout(closeTimer.current);
  const positionPanel = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const margin = 14;
    const width = Math.min(320, window.innerWidth - margin * 2);
    const center = rect.left + rect.width / 2;
    const left = Math.min(Math.max(center, margin + width / 2), window.innerWidth - margin - width / 2);
    const shouldOpenAbove = rect.bottom > window.innerHeight - 200 && rect.top > 200;

    setPosition({
      top: shouldOpenAbove ? rect.top - 10 : rect.bottom + 10,
      left,
      width,
      placement: shouldOpenAbove ? 'above' : 'below',
    });
  }, []);

  const openPreview = () => {
    clearCloseTimer();
    positionPanel();
    setOpen(true);
  };

  const closePreview = () => {
    if (pinned) return;
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  const closeIfFocusLeaves = () => {
    window.setTimeout(() => {
      const active = document.activeElement;
      if (pinned || triggerRef.current?.contains(active) || panelRef.current?.contains(active)) return;
      setOpen(false);
    }, 0);
  };

  const goToGlossary = (event: ReactMouseEvent) => {
    // Let modified clicks (new tab / window) follow the real href.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(`/glossary?term=${slug}`);
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setPinned(false);
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  if (!term) return <>{label}</>;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onMouseEnter={openPreview}
        onMouseLeave={closePreview}
        onFocus={openPreview}
        onBlur={closeIfFocusLeaves}
        onClick={() => {
          clearCloseTimer();
          positionPanel();
          setPinned((current) => {
            const next = !current;
            setOpen(next || !open);
            return next;
          });
        }}
        className="inline cursor-help rounded-[2px] font-medium text-foreground underline decoration-dotted decoration-primary/60 decoration-1 underline-offset-[3px] transition-colors hover:text-[color:var(--primary)] hover:decoration-primary focus-visible:text-[color:var(--primary)]"
      >
        {label}
      </button>
      {open && position && (
        <a
          ref={panelRef}
          id={panelId}
          href={`/glossary?term=${slug}`}
          aria-label={`${term.term} — ouvrir dans le dictionnaire`}
          onClick={goToGlossary}
          onMouseEnter={openPreview}
          onMouseLeave={closePreview}
          onFocus={openPreview}
          onBlur={closeIfFocusLeaves}
          className="group fixed z-[70] block rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-left no-underline shadow-editorial-lg transition-colors animate-fade-in hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] hover:bg-surface-container-low focus-visible:border-[color:var(--primary)]"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            transform: position.placement === 'above' ? 'translate(-50%, -100%)' : 'translateX(-50%)',
          }}
        >
          <span className="mb-1.5 flex items-start justify-between gap-3">
            <span className="block font-headline text-[0.95rem] font-semibold leading-tight text-foreground">{term.term}</span>
            <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-surface-variant transition-colors group-hover:text-[color:var(--primary)]" aria-hidden />
          </span>
          <span className="block text-[0.82rem] leading-relaxed text-surface-variant">{term.short}</span>
        </a>
      )}
    </>
  );
}

// ── Automatic glossary detection ────────────────────────────────────────────
// A single matcher over every glossary term + alias, so technical vocabulary and
// acronyms in lesson prose become popover triggers without manual tagging.
type GlossaryMatch = { slug: string; caseSensitive: boolean };

// All-caps short forms (VC, MOIC, B2B, R&D…) are matched case-sensitively so we
// don't link lowercase look-alikes buried inside ordinary words.
const ACRONYM_RE = /^[A-Z0-9][A-Z0-9&./-]*$/;

let cachedMatcher: { re: RegExp; lookup: Map<string, GlossaryMatch> } | null = null;

function getMatcher() {
  if (cachedMatcher) return cachedMatcher;
  const lookup = new Map<string, GlossaryMatch>();
  for (const term of GLOSSARY) {
    for (const raw of [term.term, ...(term.aliases ?? [])]) {
      const key = raw?.trim();
      if (!key) continue;
      const caseSensitive = key.length <= 6 && ACRONYM_RE.test(key) && /[A-Z]/.test(key);
      // Skip short/ambiguous lowercase keys that would create reading noise.
      if (!caseSensitive && key.length < 4) continue;
      const norm = key.toLowerCase();
      if (!lookup.has(norm)) lookup.set(norm, { slug: term.slug, caseSensitive });
    }
  }
  // Longest keys first so multi-word terms win over their sub-spans.
  const keys = [...lookup.keys()].sort((a, b) => b.length - a.length);
  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Unicode-aware boundaries keep accented French terms intact; a trailing "s"
  // is allowed so plurals (VCs, fonds) still resolve to their singular entry.
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${escaped.join('|')})s?(?![\\p{L}\\p{N}])`, 'giu');
  cachedMatcher = { re, lookup };
  return cachedMatcher;
}

/** Wrap the first untagged occurrence of each glossary term/acronym in `text`. */
function autoLink(text: string, keyBase: string, linkedSlugs: Set<string>): ReactNode[] {
  const { re, lookup } = getMatcher();
  re.lastIndex = 0;
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const surface = m[0];
    let core = surface;
    let entry = lookup.get(surface.toLowerCase());
    if (!entry && /s$/i.test(surface)) {
      core = surface.slice(0, -1);
      entry = lookup.get(core.toLowerCase());
    }
    if (!entry) continue;
    if (entry.caseSensitive && core !== core.toUpperCase()) continue; // acronyms must be upper-case
    if (linkedSlugs.has(entry.slug)) continue; // first occurrence only
    if (!glossaryBySlug(entry.slug)) continue;

    if (m.index > last) nodes.push(<Fragment key={`${keyBase}-t${i}`}>{text.slice(last, m.index)}</Fragment>);
    linkedSlugs.add(entry.slug);
    nodes.push(<GlossaryPreview key={`${keyBase}-g${i}`} slug={entry.slug} label={surface} />);
    last = m.index + surface.length;
    i++;
  }
  if (last < text.length) nodes.push(<Fragment key={`${keyBase}-t${i}`}>{text.slice(last)}</Fragment>);
  return nodes;
}

function renderInline(text: string, keyBase: string, glossaryPreview: boolean, linkedSlugs: Set<string>): ReactNode[] {
  const parts = text.split(INLINE);
  return parts.map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (!part) return null;
    if (part.startsWith('[') && part.endsWith(')') && part.includes('](') && !part.startsWith('[[')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, url] = match;
        const isExternal = url.startsWith('http');
        if (isExternal) {
          return (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline decoration-dotted decoration-primary/60 decoration-1 underline-offset-[3px] transition-colors hover:decoration-primary hover:text-[color:var(--primary)]">
              {label}
            </a>
          );
        }
        return (
          <Link key={key} to={url} className="font-medium text-foreground underline decoration-dotted decoration-primary/60 decoration-1 underline-offset-[3px] transition-colors hover:decoration-primary hover:text-[color:var(--primary)]">
            {label}
          </Link>
        );
      }
    }
    if ((part.startsWith('[[') && part.endsWith(']]')) || (part.startsWith('{{') && part.endsWith('}}'))) {
      const inner = part.slice(2, -2);
      const [slug, label] = inner.includes('|') ? inner.split('|') : [inner, inner];
      return glossaryPreview ? (
        <GlossaryPreview key={key} slug={slug.trim()} label={label.trim()} />
      ) : (
        <GlossaryLink key={key} slug={slug.trim()} label={label.trim()} />
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{renderInline(part.slice(2, -2), `${key}-strong`, glossaryPreview, linkedSlugs)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{renderInline(part.slice(1, -1), `${key}-em`, glossaryPreview, linkedSlugs)}</em>;
    }
    return glossaryPreview ? <Fragment key={key}>{autoLink(part, key, linkedSlugs)}</Fragment> : <Fragment key={key}>{part}</Fragment>;
  });
}

export function InlineMarkdown({ source, glossaryPreview = false }: { source: string; glossaryPreview?: boolean }) {
  const linkedSlugs = new Set<string>();
  if (glossaryPreview) {
    for (const m of source.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]|\{\{([^}|]+)(?:\|[^}]+)?\}\}/g)) {
      const slug = (m[1] ?? m[2])?.trim();
      if (slug) linkedSlugs.add(slug);
    }
  }
  return <>{renderInline(source, 'inline', glossaryPreview, linkedSlugs)}</>;
}

export function Markdown({ source, className, glossaryPreview = false }: { source: string; className?: string; glossaryPreview?: boolean }) {
  const blocks = source.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  // Page-scoped dedup set: each glossary term is auto-linked only on its first
  // mention. Manually tagged terms are seeded first so they always take over.
  const linkedSlugs = new Set<string>();
  if (glossaryPreview) {
    for (const m of source.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]|\{\{([^}|]+)(?:\|[^}]+)?\}\}/g)) {
      const slug = (m[1] ?? m[2])?.trim();
      if (slug) linkedSlugs.add(slug);
    }
  }

  return (
    <div className={className ?? 'prose-editorial'}>
      {blocks.map((block, bi) => {
        const key = `b-${bi}`;
        if (block.startsWith('## ')) {
          return <h2 key={key}>{renderInline(block.slice(3), key, glossaryPreview, linkedSlugs)}</h2>;
        }
        if (block.startsWith('### ')) {
          return <h3 key={key}>{renderInline(block.slice(4), key, glossaryPreview, linkedSlugs)}</h3>;
        }
        const lines = block.split('\n');
        if (lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={key}>
              {lines.map((l, li) => (
                <li key={`${key}-${li}`}>{renderInline(l.trim().slice(2), `${key}-${li}`, glossaryPreview, linkedSlugs)}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
          return (
            <ol key={key} className="mb-5 list-decimal space-y-2 pl-6 marker:text-[color:var(--primary)] marker:font-mono">
              {lines.map((l, li) => (
                <li key={`${key}-${li}`} className="pl-1">{renderInline(l.trim().replace(/^\d+\.\s/, ''), `${key}-${li}`, glossaryPreview, linkedSlugs)}</li>
              ))}
            </ol>
          );
        }
        return <p key={key}>{renderInline(block, key, glossaryPreview, linkedSlugs)}</p>;
      })}
    </div>
  );
}
