import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import type { SearchHit } from '@/content/search';
import { useAuth } from '@/context/AuthContext';
import { SectionHeading, EmptyState } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

const TYPE_LABEL: Record<string, string> = { course: 'Cours', lesson: 'Leçon', glossary: 'Dictionnaire', case: 'Étude de cas', blog: 'Analyse', path: 'Parcours', simulator: 'Simulateur', 'anti-portfolio': 'Anti-portfolio', memo: 'Memo annoté' };

export default function SearchPage() {
  usePageMeta('Recherche');
  const [params, setParams] = useSearchParams();
  const { apiUp } = useAuth();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [hits, setHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    const term = params.get('q') ?? '';
    setQ(term);
    if (term.trim().length < 2) {
      setHits([]);
      return;
    }
    let active = true;
    (async () => {
      if (apiUp) {
        try {
          const { hits } = await api.get<{ hits: SearchHit[] }>(`/search?q=${encodeURIComponent(term)}`);
          if (active) setHits(hits);
          return;
        } catch { /* fallback */ }
      }
      const { searchLocal } = await import('@/content/search');
      if (active) setHits(searchLocal(term));
    })();
    return () => { active = false; };
  }, [params, apiUp]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Recherche globale" title="Explorer toute la plateforme" />
      <form
        onSubmit={(e) => { e.preventDefault(); setParams(q.trim() ? { q: q.trim() } : {}); }}
        className="mt-6 flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4"
      >
        <Search size={18} className="text-surface-variant" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" name="q" aria-label="Rechercher sur la plateforme" placeholder="Cours, terme, étude de cas, analyse…" className="w-full bg-transparent py-3 outline-none placeholder:text-surface-variant" autoFocus />
      </form>

      <div className="mt-8">
        {q.trim().length >= 2 && hits.length === 0 && (
          <EmptyState icon={<Search size={26} />} title={`Aucun résultat pour « ${q} »`} description="Essayez un autre terme ou explorez les parcours." />
        )}
        <ul className="space-y-2">
          {hits.map((hit) => (
            <li key={`${hit.type}-${hit.id}`}>
              <Link to={hit.href} className="group block rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-4 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)]">
                <div className="flex items-center gap-2">
                  <span className="font-medium transition-colors group-hover:text-[color:var(--primary)]">{hit.title}</span>
                  <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{TYPE_LABEL[hit.type]}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-surface-variant">{hit.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
