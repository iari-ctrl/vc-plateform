import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, BookOpen, BookMarked, FlaskConical, Newspaper, Route, FileText, CornerDownLeft, Ghost, ScrollText, Microscope, Dumbbell, PanelTop, Award } from 'lucide-react';
import type { SearchHit } from '@/content/search';
import { loadSearchHits } from '@/content/searchLazy';
import { SEARCH_TYPE_LABEL } from '@/content/labels';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

type PaletteStatus = 'idle' | 'loading' | 'done' | 'error';

const TYPE_ICON: Record<SearchHit['type'], typeof Search> = {
  page: PanelTop,
  certification: Award,
  course: BookMarked,
  lesson: BookOpen,
  glossary: BookMarked,
  case: FileText,
  deliverable: Dumbbell,
  blog: Newspaper,
  path: Route,
  simulator: FlaskConical,
  'anti-portfolio': Ghost,
  memo: ScrollText,
  ecosystem: Microscope,
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<PaletteStatus>('idle');
  const [searchAttempt, setSearchAttempt] = useState(0);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const homeSearchSurface = pathname === '/home';
  const trimmedQuery = q.trim();
  const showResultPanel = !homeSearchSurface || trimmedQuery.length >= 2;

  useEffect(() => {
    if (open) {
      setQ('');
      setHits([]);
      setStatus('idle');
      setSearchAttempt(0);
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let activeSearch = true;
    const handle = setTimeout(async () => {
      if (q.trim().length < 2) {
        setHits([]);
        setStatus('idle');
        return;
      }
      setStatus('loading');
      try {
        const nextHits = await loadSearchHits(q);
        if (!activeSearch) return;
        setHits(nextHits);
        setStatus('done');
      } catch {
        if (!activeSearch) return;
        setHits([]);
        setStatus('error');
      }
    }, 160);
    return () => {
      activeSearch = false;
      clearTimeout(handle);
    };
  }, [q, open, searchAttempt]);

  const grouped = useMemo(() => hits.slice(0, 24), [hits]);

  function go(hit: SearchHit) {
    onClose();
    navigate(hit.href);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, grouped.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && grouped[active]) {
      e.preventDefault();
      go(grouped[active]);
    }
  }

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      initialFocusRef={inputRef}
      showCloseButton={false}
      containerClassName={
        homeSearchSurface
          ? 'top-[var(--home-topbar-h)] z-[95] items-start px-3 pt-3 sm:items-start sm:px-6 sm:pt-3.5'
          : 'z-[95] items-start pt-[12vh] sm:items-start'
      }
      backdropClassName={homeSearchSurface ? 'top-[var(--home-topbar-h)] bg-transparent backdrop-blur-none' : undefined}
      dialogProps={
        homeSearchSurface
          ? {
              'data-home-search-surface': 'true',
            }
          : undefined
      }
      className={
        homeSearchSurface
          ? 'max-w-[min(34rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.35rem] border-[color-mix(in_srgb,var(--surface-bright)_42%,transparent)] bg-[color-mix(in_srgb,var(--surface-container-lowest)_56%,transparent)] shadow-2xl shadow-black/30 ring-1 ring-[color-mix(in_srgb,var(--surface-bright)_16%,transparent)] backdrop-blur-[34px] backdrop-saturate-[180%]'
          : 'max-w-xl overflow-hidden'
      }
    >
      <h2 id={titleId} className="sr-only">Recherche globale</h2>
        <div className={cn('flex items-center gap-3 px-4', showResultPanel && 'border-b border-outline-variant/70')}>
          <Search size={18} className="text-surface-variant" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
            type="search"
            name="q"
            aria-label="Recherche globale"
            placeholder="Rechercher un cours, un terme, une étude de cas…"
            className="w-full appearance-none border-0 bg-transparent py-4 text-[0.95rem] shadow-none outline-none placeholder:text-surface-variant focus:outline-none focus:ring-0 focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          />
          <kbd className="hidden rounded border border-outline-variant px-1.5 py-0.5 font-mono text-[0.625rem] text-surface-variant sm:block">ESC</kbd>
        </div>

        {showResultPanel && (
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {!homeSearchSurface && trimmedQuery.length < 2 && (
            <p className="px-3 py-8 text-center text-sm text-surface-variant">Tapez au moins deux caractères pour explorer toute la plateforme.</p>
          )}
          {trimmedQuery.length >= 2 && status === 'loading' && (
            <p role="status" aria-live="polite" className="px-3 py-8 text-center text-sm text-surface-variant">Recherche en cours…</p>
          )}
          {trimmedQuery.length >= 2 && status === 'error' && (
            <div role="alert" className="m-2 rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-surface-variant">
              <p className="font-medium text-foreground">La recherche n’a pas pu être chargée.</p>
              <button type="button" onClick={() => setSearchAttempt((attempt) => attempt + 1)} className="btn-ghost mt-3">
                Réessayer
              </button>
            </div>
          )}
          {trimmedQuery.length >= 2 && status === 'done' && grouped.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-surface-variant">Aucun résultat pour « {q} ».</p>
          )}
          {grouped.map((hit, i) => {
            const Icon = TYPE_ICON[hit.type];
            return (
              <button
                key={`${hit.type}-${hit.id}`}
                onClick={() => go(hit)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === active ? 'bg-surface-container' : 'hover:bg-surface-container-low'
                }`}
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-container text-surface-variant">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium">{hit.title}</span>
                    <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{SEARCH_TYPE_LABEL[hit.type]}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-surface-variant">{hit.excerpt}</span>
                </span>
                {i === active && <CornerDownLeft size={14} className="mt-1.5 shrink-0 text-surface-variant" />}
              </button>
            );
          })}
        </div>
        )}
    </Modal>
  );
}
