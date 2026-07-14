import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { SearchHit } from '@/content/search';
import { SEARCH_TYPE_LABEL } from '@/content/labels';
import { SectionHeading, EmptyState } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

type SearchStatus = 'idle' | 'loading' | 'done';

export default function SearchPage() {
  usePageMeta('Recherche');
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [resultTerm, setResultTerm] = useState('');
  const submittedTerm = (params.get('q') ?? '').trim();
  const inputMatchesSearch = q.trim() === submittedTerm;
  const resultMatchesSearch = inputMatchesSearch && resultTerm === submittedTerm;

  useEffect(() => {
    const term = (params.get('q') ?? '').trim();
    setQ(term);
    if (term.length < 2) {
      setHits([]);
      setStatus('idle');
      setResultTerm(term);
      return;
    }
    let active = true;
    setHits([]);
    setStatus('loading');
    setResultTerm(term);
    (async () => {
      const { searchLocal } = await import('@/content/search');
      if (active) {
        setHits(searchLocal(term));
        setStatus('done');
      }
    })();
    return () => { active = false; };
  }, [params]);

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
        {resultMatchesSearch && status === 'loading' && (
          <p role="status" aria-live="polite" className="py-8 text-center text-sm text-surface-variant">Recherche en cours…</p>
        )}
        {resultMatchesSearch && status === 'done' && hits.length === 0 && (
          <EmptyState icon={<Search size={26} />} title={`Aucun résultat pour « ${submittedTerm} »`} description="Essayez un autre terme ou explorez les parcours." />
        )}
        <ul className="space-y-2" aria-live="polite">
          {resultMatchesSearch && status === 'done' && hits.map((hit) => (
            <li key={`${hit.type}-${hit.id}`}>
              <Link to={hit.href} className="group block rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-4 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)]">
                <div className="flex items-center gap-2">
                  <span className="font-medium transition-colors group-hover:text-[color:var(--primary)]">{hit.title}</span>
                  <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{SEARCH_TYPE_LABEL[hit.type]}</span>
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
