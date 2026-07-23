import { useMemo, useState } from 'react';
import { Briefcase, Ghost, ScrollText } from 'lucide-react';
import { CASE_STUDIES } from '@/content/caseStudies';
import { MEMOS } from '@/content/memos';
import { ANTI_PORTFOLIO } from '@/content/antiPortfolio';
import { AntiPortfolioEntryCard, CaseCard, MemoCard } from '@/components/cards';
import { SectionHeading, Reveal, EmptyState } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';
import type { AntiPortfolioEntry, CaseStudy, InvestmentMemo } from '@/content/types';

type DecisionType = 'all' | 'case' | 'memo' | 'anti-portfolio';

type DecisionItem =
  | { id: string; type: 'case'; sortYear: number; item: CaseStudy }
  | { id: string; type: 'memo'; sortYear: number; item: InvestmentMemo }
  | { id: string; type: 'anti-portfolio'; sortYear: number; item: AntiPortfolioEntry };

/** A 4-digit year pulled from a free-form date ("Septembre 2005" → 2005); 0 if absent. */
function yearFromText(value: string): number {
  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

const FILTERS: { id: DecisionType; label: string; icon: typeof Briefcase }[] = [
  { id: 'all', label: 'Tout', icon: Briefcase },
  { id: 'case', label: 'Cas', icon: Briefcase },
  { id: 'memo', label: 'Memos', icon: ScrollText },
  { id: 'anti-portfolio', label: 'Anti-portfolio', icon: Ghost },
];

export default function DecisionsIndexPage() {
  usePageMeta(
    'Décisions',
    'Cas, memos et anti-portfolio pour étudier comment une décision d’investissement se construit, se justifie ou se manque.',
  );

  const cases = CASE_STUDIES;
  const [filter, setFilter] = useState<DecisionType>('all');

  const items = useMemo<DecisionItem[]>(() => {
    const caseItems = cases.map((item) => ({ id: item.id, type: 'case' as const, sortYear: item.year, item }));
    const memoItems = MEMOS.map((item) => ({ id: item.id, type: 'memo' as const, sortYear: yearFromText(item.date), item }));
    const antiItems = ANTI_PORTFOLIO.map((item) => ({ id: item.id, type: 'anti-portfolio' as const, sortYear: item.passes[0]?.year ?? 0, item }));
    return [...caseItems, ...memoItems, ...antiItems].sort((a, b) => b.sortYear - a.sortYear);
  }, [cases]);

  const visible = filter === 'all' ? items : items.filter((item) => item.type === filter);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Décisions"
          title="Étudier la construction des décisions"
          description="Cette salle rassemble les cas, les memos annotés et les refus d’investissement documentés. Les formats restent canoniques à leurs URLs existantes ; l’index les met en regard pour comparer les logiques de décision et leurs résultats."
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Type de décision">
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${active ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant hover:text-foreground'}`}
              >
                <item.icon size={14} /> {item.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((entry, i) => (
          <Reveal key={`${entry.type}-${entry.id}`} delay={(i % 3) * 70}>
            {entry.type === 'case' && <CaseCard cs={entry.item} />}
            {entry.type === 'memo' && <MemoCard memo={entry.item} />}
            {entry.type === 'anti-portfolio' && <AntiPortfolioEntryCard entry={entry.item} />}
          </Reveal>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="mt-12">
          <EmptyState icon={<Briefcase size={26} />} title="Aucun contenu" description="Aucun élément ne correspond à ce filtre." />
        </div>
      )}
    </div>
  );
}
