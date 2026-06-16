import { useParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ArrowUpRight, Clock, ExternalLink, Landmark, Quote, Sparkles, TrendingUp } from 'lucide-react';
import { memoBySlug, MEMO_TAG_META } from '@/content/memos';
import { antiPortfolioById } from '@/content/antiPortfolio';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { FleuronDivider } from '@/components/ornaments/Ornaments';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';
import type { MemoBlock } from '@/content/types';

function AnnotatedBlock({ block, memoTitle, memoId, index }: { block: MemoBlock; memoTitle: string; memoId: string; index: number }) {
  const meta = MEMO_TAG_META[block.tag];
  return (
    <div className="grid gap-0 overflow-hidden rounded-2xl border border-outline-variant md:grid-cols-2">
      {/* The memo's words — styled as the document */}
      <figure className="relative border-b border-outline-variant bg-surface-container-low/60 p-5 sm:p-6 md:border-b-0 md:border-r">
        <Quote size={15} aria-hidden className="absolute right-5 top-5 text-surface-variant/50" />
        <figcaption className="mb-3 flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">
          Le memo
          {block.isParaphrase && <span className="rounded border border-outline-variant px-1.5 py-0.5 normal-case tracking-normal">extrait condensé</span>}
        </figcaption>
        <blockquote className="font-headline text-[1.0625rem] italic leading-relaxed text-pretty">
          {block.excerpt}
        </blockquote>
      </figure>
      {/* The annotation — what the investor is doing */}
      <div className="p-5 sm:p-6">
        <p className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Annotation {String(index + 1).padStart(2, '0')}</span>
          <span className="chip !py-0.5" style={{ color: meta.accent, borderColor: `color-mix(in srgb, ${meta.accent} 45%, transparent)` }}>
            {meta.label}
          </span>
        </p>
        <ActiveProse source={block.note} sourceType="memo" sourceId={memoId} sourceTitle={memoTitle} className="prose-editorial text-[0.95rem]" />
      </div>
    </div>
  );
}

export default function MemoPage() {
  const { slug } = useParams();
  const memo = slug ? memoBySlug(slug) : undefined;
  usePageMeta(memo?.title, memo?.summary, { type: 'article' });

  if (!memo) return <NotFoundPage />;

  const relatedEntries = (memo.relatedAntiPortfolioIds ?? [])
    .map((id) => antiPortfolioById(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  let blockIndex = -1;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/memos" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Memo library</Link>

      <header>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="chip">{memo.fund}</span>
            <span className="text-surface-variant">{memo.stage}{memo.amount ? ` · ${memo.amount}` : ''}</span>
          </div>
          <BookmarkButton item={{ itemType: 'memo', itemId: memo.id, title: memo.title, href: `/memos/${memo.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{memo.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{memo.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-outline-variant py-3 text-sm text-surface-variant">
          <span className="font-medium text-foreground">{memo.author}</span>
          <span>{memo.date}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {memo.readMin} min</span>
          <a
            href={memo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)] transition-opacity hover:opacity-80"
          >
            Document original <ExternalLink size={13} />
          </a>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-surface-variant">
          <Landmark size={13} className="mt-0.5 shrink-0" /> {memo.sourceNote}
        </p>
      </header>

      {/* Context */}
      <section className="mt-10">
        <p className="eyebrow mb-4">Le monde au moment du memo</p>
        <ActiveProse source={memo.context} sourceType="memo" sourceId={memo.id} sourceTitle={memo.title} />
      </section>

      {/* Annotated body */}
      <section className="mt-12">
        <p className="eyebrow mb-2">Lecture annotée</p>
        <p className="mb-7 text-sm text-surface-variant">À gauche, ce que dit le memo (extraits traduits) ; à droite, le geste décisionnel qu'il accomplit.</p>
        <div className="space-y-10">
          {memo.sections.map((section, si) => (
            <div key={si}>
              <h2 className="mb-4 flex items-baseline gap-3 font-headline text-headline-sm font-semibold leading-tight">
                <span className="font-mono text-xs font-normal text-surface-variant">{String(si + 1).padStart(2, '0')}</span>
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.blocks.map((block, bi) => {
                  blockIndex += 1;
                  return <AnnotatedBlock key={bi} block={block} memoTitle={memo.title} memoId={memo.id} index={blockIndex} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outcome */}
      <section className="mt-12">
        <p className="eyebrow mb-4 flex items-center gap-2"><TrendingUp size={14} /> Ce que la décision est devenue</p>
        <p className="text-[1.0625rem] leading-relaxed text-pretty">{memo.outcome}</p>
      </section>

      {/* Practitioner lessons */}
      <aside className="mt-12 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7">
        <p className="eyebrow mb-4 flex items-center gap-2"><Sparkles size={14} /> Ce qu'un praticien doit copier</p>
        <ul className="space-y-3">
          {memo.lessons.map((l, i) => (
            <li key={i} className="flex items-start gap-3 text-[0.95rem] font-medium">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] font-mono text-[0.625rem] text-[color:var(--primary)]">{i + 1}</span>
              {l}
            </li>
          ))}
        </ul>
      </aside>

      {relatedEntries.length > 0 && (
        <section className="mt-12">
          <FleuronDivider className="mb-8" />
          <p className="eyebrow mb-4">À lire en miroir — anti-portfolio</p>
          <div className="space-y-3">
            {relatedEntries.map((e) => (
              <Link key={e.id} to={`/anti-portfolio/${e.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-outline-variant p-5 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-surface-container-low">
                <div>
                  <p className="font-medium leading-snug transition-colors group-hover:text-[color:var(--primary)]">{e.title}</p>
                  <p className="mt-1 text-sm text-surface-variant">{e.passes.map((p) => p.fund).join(' · ')} · {e.passes[0].year}</p>
                </div>
                <ArrowUpRight size={16} className="shrink-0 text-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <GlossaryRefList slugs={memo.glossaryRefs} />
      </div>

      {memo.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {memo.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
        </div>
      )}
    </article>
  );
}
