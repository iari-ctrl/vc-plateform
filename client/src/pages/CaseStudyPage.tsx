import { useParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { caseBySlug } from '@/content';
import type { CaseStudy } from '@/content/types';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { PageLoader } from '@/components/ui/primitives';
import { useApiItem } from '@/hooks/useApiData';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from './NotFoundPage';

const KIND_LABEL: Record<string, string> = { startup: 'Startup', fund: 'Fonds', deal: 'Deal', market: 'Marché' };

export default function CaseStudyPage() {
  const { slug } = useParams();
  const { item: cs, pending } = useApiItem<CaseStudy>(
    slug ? `/content/case-studies/${slug}` : null,
    slug ? caseBySlug(slug) : undefined,
  );
  usePageMeta(cs?.title, cs?.summary, { type: 'article', image: 'case-study' });

  if (pending) return <PageLoader />;
  if (!cs) return <NotFoundPage />;

  const markdown = cs.sections.map((s) => `## ${s.heading}\n\n${s.body}`).join('\n\n');

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/bibliotheque" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Études de cas</Link>

      <header>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="chip">{KIND_LABEL[cs.kind] ?? cs.kind}</span>
            <span className="text-surface-variant">{cs.company} · {cs.year}</span>
          </div>
          <BookmarkButton item={{ itemType: 'case', itemId: cs.id, title: cs.title, href: `/cases/${cs.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{cs.title}</h1>
        <p className="mt-3 font-headline text-headline-sm italic text-surface-variant">{cs.subtitle}</p>
        <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{cs.summary}</p>
        <p className="mt-5 inline-flex items-center gap-1.5 border-y border-outline-variant py-3 text-sm text-surface-variant"><Clock size={14} /> {cs.readMin} min de lecture</p>
      </header>

      <div className="mt-8">
        <ActiveProse source={markdown} sourceType="case" sourceId={cs.id} sourceTitle={cs.title} />
      </div>

      <aside className="mt-12 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7">
        <p className="eyebrow mb-4 flex items-center gap-2"><Sparkles size={14} /> Ce qu’il faut retenir</p>
        <ul className="space-y-3">
          {cs.takeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-[0.95rem] font-medium">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] font-mono text-[0.625rem] text-[color:var(--primary)]">{i + 1}</span>
              {t}
            </li>
          ))}
        </ul>
      </aside>

      <div className="mt-10">
        <GlossaryRefList slugs={cs.glossaryRefs} />
      </div>
    </article>
  );
}
