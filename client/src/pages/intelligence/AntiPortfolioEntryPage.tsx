import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Clock, ExternalLink, Eye, FileCheck2, FilePen, Scale, Sparkles, TrendingUp } from 'lucide-react';
import { antiPortfolioBySlug, antiPortfolioPatternById } from '@/content/antiPortfolio';
import { memoById } from '@/content/memos';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { WaxSeal } from '@/components/ornaments/Illustrations';
import { FleuronDivider } from '@/components/ornaments/Ornaments';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

export default function AntiPortfolioEntryPage() {
  const { slug } = useParams();
  const entry = slug ? antiPortfolioBySlug(slug) : undefined;
  usePageMeta(entry ? `${entry.company} — anti-portfolio` : undefined, entry?.summary, { type: 'article' });

  if (!entry) return <NotFoundPage />;

  const patterns = entry.patternIds
    .map((id) => antiPortfolioPatternById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const relatedMemos = (entry.relatedMemoIds ?? [])
    .map((id) => memoById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/anti-portfolio" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Anti-portfolio</Link>

      <header>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {patterns.map((p) => (
              <Link key={p.id} to={`/anti-portfolio?pattern=${p.id}`} className="chip transition-colors hover:text-foreground" style={{ color: p.accent }}>
                {p.glyph} {p.label}
              </Link>
            ))}
          </div>
          <BookmarkButton item={{ itemType: 'anti-portfolio', itemId: entry.id, title: entry.title, href: `/anti-portfolio/${entry.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{entry.title}</h1>
        <p className="mt-3 font-headline text-headline-sm italic text-surface-variant">{entry.subtitle}</p>
        <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{entry.summary}</p>
        <p className="mt-5 inline-flex items-center gap-1.5 border-y border-outline-variant py-3 text-sm text-surface-variant">
          <Clock size={14} /> {entry.readMin} min · {entry.sector}
        </p>
      </header>

      {/* La fiche — who passed, when, at what stage */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-outline-variant">
        <p className="eyebrow border-b border-outline-variant bg-surface-container-low/60 px-5 py-3">La fiche du pass</p>
        <dl className="divide-y divide-outline-variant">
          {entry.passes.map((p, i) => (
            <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3.5">
              <dt className="font-medium">
                {p.fund}
                {p.partner && <span className="text-surface-variant"> · {p.partner}</span>}
              </dt>
              <dd className="font-mono text-xs text-surface-variant">{p.stage} · {p.year}</dd>
            </div>
          ))}
        </dl>
      </section>

      {entry.quote && (
        <blockquote className="mt-8 rounded-2xl border-l-[3px] border-[color:var(--primary)] bg-surface-container-low/60 p-6">
          <p className="font-headline text-headline-sm italic leading-snug">« {entry.quote.text} »</p>
          <footer className="mt-3 text-sm text-surface-variant">— {entry.quote.author} · <span className="italic">{entry.quote.source}</span></footer>
        </blockquote>
      )}

      {/* Ce qu'on savait à l'époque */}
      <section className="mt-12">
        <p className="eyebrow mb-2 flex items-center gap-2"><Eye size={14} /> Ce qu'on savait à l'époque</p>
        <p className="mb-5 text-sm text-surface-variant">Uniquement des informations publiques et vérifiables au moment de la décision — pas de rétro-projection.</p>
        <ol className="space-y-0">
          {entry.knownAtTheTime.map((k, i) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {i < entry.knownAtTheTime.length - 1 && (
                <span aria-hidden className="absolute left-[5px] top-4 h-full w-px bg-outline-variant" />
              )}
              <span aria-hidden className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-[color:var(--primary)] bg-surface" />
              <div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-wider text-[color:var(--primary)]">{k.date}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed">{k.fact}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* La raison du pass */}
      <section className="mt-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <p className="eyebrow flex items-center gap-2 !mb-0"><FilePen size={14} /> La raison du pass</p>
          <span className="chip inline-flex items-center gap-1.5 !py-0.5">
            <FileCheck2 size={12} />
            {entry.reasonIsPublic ? 'Raison documentée publiquement' : 'Raison reconstituée (non confirmée)'}
          </span>
        </div>
        <p className="text-[1.0625rem] leading-relaxed text-pretty">{entry.statedReason}</p>
      </section>

      {/* Le signal raté */}
      <section className="mt-12">
        <p className="eyebrow mb-4 flex items-center gap-2 text-[color:var(--primary)]"><Sparkles size={14} /> Le signal raté</p>
        <ActiveProse source={entry.missedSignal} sourceType="anti-portfolio" sourceId={entry.id} sourceTitle={entry.title} />
      </section>

      {/* Le contre-argument honnête */}
      <section className="mt-12 rounded-2xl border border-outline-variant bg-surface-container-low/50 p-6 sm:p-7">
        <p className="eyebrow mb-2 flex items-center gap-2"><Scale size={14} /> Le contre-argument honnête</p>
        <p className="mb-4 text-sm text-surface-variant">Pourquoi le pass était défendable ex ante. Sans steelman, l'analyse rétrospective n'est que du biais de rétrospection confortable.</p>
        <ActiveProse source={entry.steelman} sourceType="anti-portfolio" sourceId={entry.id} sourceTitle={entry.title} />
      </section>

      {/* Ce que c'est devenu */}
      <section className="mt-12">
        <p className="eyebrow mb-4 flex items-center gap-2"><TrendingUp size={14} /> Ce que c'est devenu</p>
        <p className="text-[1.0625rem] leading-relaxed text-pretty">{entry.outcome}</p>
        {entry.costEstimate && (
          <p className="mt-3 rounded-xl border border-dashed border-outline-variant px-4 py-3 text-sm text-surface-variant">
            <strong className="font-medium text-foreground">Coût estimé du pass :</strong> {entry.costEstimate}
          </p>
        )}
      </section>

      {/* Takeaways */}
      <aside className="mt-12 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7">
        <p className="eyebrow mb-4 flex items-center gap-2"><Sparkles size={14} /> Ce qu'il faut retenir</p>
        <ul className="space-y-3">
          {entry.takeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-[0.95rem] font-medium">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] font-mono text-[0.625rem] text-[color:var(--primary)]">{i + 1}</span>
              {t}
            </li>
          ))}
        </ul>
      </aside>

      {/* Pattern explainers */}
      <section className="mt-12">
        <FleuronDivider className="mb-8" />
        <p className="eyebrow mb-5">{patterns.length > 1 ? 'Les patterns à l’œuvre' : 'Le pattern à l’œuvre'}</p>
        <div className="space-y-4">
          {patterns.map((p) => (
            <div key={p.id} className="flex gap-4 rounded-2xl border border-outline-variant p-5">
              <WaxSeal glyph={p.glyph} accent={p.accent} size={44} className="shrink-0" />
              <div>
                <p className="font-headline text-headline-sm font-semibold leading-tight">{p.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-surface-variant">{p.description}</p>
                <p className="mt-2 text-sm leading-relaxed"><strong className="font-medium" style={{ color: p.accent }}>L'antidote :</strong> {p.antidote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {relatedMemos.length > 0 && (
        <section className="mt-12">
          <p className="eyebrow mb-4">À lire en miroir — memos annotés</p>
          <div className="space-y-3">
            {relatedMemos.map((m) => (
              <Link key={m.id} to={`/memos/${m.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-outline-variant p-5 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-surface-container-low">
                <div>
                  <p className="font-medium leading-snug transition-colors group-hover:text-[color:var(--primary)]">{m.title}</p>
                  <p className="mt-1 text-sm text-surface-variant">{m.fund} · {m.author} · {m.date}</p>
                </div>
                <ArrowUpRight size={16} className="shrink-0 text-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      <section className="mt-12">
        <p className="eyebrow mb-4">Sources publiques</p>
        <ul className="space-y-2.5">
          {entry.sources.map((s, i) => (
            <li key={i}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-2 text-sm leading-relaxed text-surface-variant transition-colors hover:text-[color:var(--primary)]">
                <ExternalLink size={14} className="mt-0.5 shrink-0" />
                <span className="underline decoration-outline-variant underline-offset-2 group-hover:decoration-current">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <GlossaryRefList slugs={entry.glossaryRefs} />
      </div>
    </article>
  );
}
