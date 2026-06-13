import { Link } from '@/i18n/routing';
import { ArrowUpRight, Clock, ScrollText } from 'lucide-react';
import { MEMOS } from '@/content/memos';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';
import type { InvestmentMemo } from '@/content/types';

function MemoCard({ memo }: { memo: InvestmentMemo }) {
  return (
    <Link to={`/memos/${memo.slug}`} className="premium-card premium-card-hover group flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant px-6 py-3">
        <span className="chip">{memo.fund}</span>
        <span className="font-mono text-xs text-surface-variant">{memo.stage} · {memo.date}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
          {memo.company}
        </h3>
        <p className="mt-1.5 text-sm italic text-surface-variant">{memo.author}{memo.amount ? ` · ${memo.amount}` : ''}</p>
        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-surface-variant">{memo.whyItMatters}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
          <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {memo.readMin} min</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)]">
            Lire l'annotation <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function MemoLibraryPage() {
  usePageMeta(
    'Memo library annotée',
    'Memos d’investissement réellement publiés — Bessemer, Sequoia, a16z — annotés bloc par bloc : la logique décisionnelle derrière chaque paragraphe.',
  );

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Memo library"
          title="Les memos qui ont décidé, annotés"
          description="Des memos d'investissement authentiques et publics — publiés par Bessemer dans sa Memo Library, rendus publics par la justice (Sequoia × YouTube), ou assumés en ligne au moment du deal (a16z × Coinbase). Pour chacun : le document original en lien, et une annotation bloc par bloc de la logique décisionnelle — ce que fait l'investisseur à chaque paragraphe, et ce qu'un praticien doit copier."
        />
      </Reveal>

      <Reveal delay={80}>
        <aside className="mt-7 flex items-start gap-3 rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5 text-sm leading-relaxed text-surface-variant">
          <ScrollText size={16} className="mt-0.5 shrink-0 text-[color:var(--primary)]" />
          <p>
            <strong className="font-medium text-foreground">Provenance & méthode.</strong> Chaque fiche lie le document original, dont la voie de
            publication est indiquée (bibliothèque officielle du fonds, pièce judiciaire, billet public). Les extraits sont courts, traduits de l'anglais et
            signalés lorsqu'ils sont condensés — l'original fait toujours foi. Les annotations, elles, sont originales : c'est la valeur ajoutée de cet espace.
          </p>
        </aside>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {MEMOS.map((memo, i) => (
          <Reveal key={memo.id} delay={(i % 3) * 70}>
            <MemoCard memo={memo} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
