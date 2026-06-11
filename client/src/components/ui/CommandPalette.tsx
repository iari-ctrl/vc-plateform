import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from '@/i18n/routing';
import { Search, BookOpen, BookMarked, FlaskConical, Newspaper, Route, FileText, CornerDownLeft } from 'lucide-react';
import { api } from '@/lib/api';
import type { SearchHit } from '@/content/search';
import { useAuth } from '@/context/AuthContext';

const TYPE_META: Record<SearchHit['type'], { label: string; icon: typeof Search }> = {
  course: { label: 'Cours', icon: BookMarked },
  lesson: { label: 'Leçon', icon: BookOpen },
  glossary: { label: 'Dictionnaire', icon: BookMarked },
  case: { label: 'Étude de cas', icon: FileText },
  blog: { label: 'Analyse', icon: Newspaper },
  path: { label: 'Parcours', icon: Route },
  simulator: { label: 'Simulateur', icon: FlaskConical },
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { apiUp } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setHits([]);
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handle = setTimeout(async () => {
      if (q.trim().length < 2) {
        setHits([]);
        return;
      }
      if (apiUp) {
        try {
          const { hits } = await api.get<{ hits: SearchHit[] }>(`/search?q=${encodeURIComponent(q)}`);
          setHits(hits);
          return;
        } catch {
          /* fall back */
        }
      }
      const { searchLocal } = await import('@/content/search');
      setHits(searchLocal(q));
    }, 160);
    return () => clearTimeout(handle);
  }, [q, open, apiUp]);

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
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[12vh]">
      <div className="fixed inset-0 bg-[color-mix(in_srgb,var(--secondary)_30%,transparent)] backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label="Recherche globale" className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-editorial-lg animate-scale-in">
        <div className="flex items-center gap-3 border-b border-outline-variant px-4">
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
            className="w-full bg-transparent py-4 text-[0.95rem] outline-none placeholder:text-surface-variant"
          />
          <kbd className="hidden rounded border border-outline-variant px-1.5 py-0.5 font-mono text-[0.625rem] text-surface-variant sm:block">ESC</kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {q.trim().length < 2 && (
            <p className="px-3 py-8 text-center text-sm text-surface-variant">Tapez au moins deux caractères pour explorer toute la plateforme.</p>
          )}
          {q.trim().length >= 2 && grouped.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-surface-variant">Aucun résultat pour « {q} ».</p>
          )}
          {grouped.map((hit, i) => {
            const Meta = TYPE_META[hit.type];
            const Icon = Meta.icon;
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
                    <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{Meta.label}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-surface-variant">{hit.excerpt}</span>
                </span>
                {i === active && <CornerDownLeft size={14} className="mt-1.5 shrink-0 text-surface-variant" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
