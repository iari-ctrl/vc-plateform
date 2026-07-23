import { ScrollText } from 'lucide-react';
import { MEMOS } from '@/content/memos';
import { MemoCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

export default function MemoLibraryPage() {
  usePageMeta(
    'Memo library annotée',
    'Memos d’investissement publiés par Bessemer, Sequoia et a16z, accompagnés d’annotations qui explicitent la logique décisionnelle de chaque passage.',
  );

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Memo library"
          title="Memos d’investissement publiés et annotés"
          description="La collection réunit des memos publiés par Bessemer dans sa Memo Library, versés à une procédure judiciaire (Sequoia × YouTube) ou mis en ligne au moment de l’investissement (a16z × Coinbase). Chaque fiche donne accès au document original et explicite, bloc par bloc, le rôle de chaque passage dans le raisonnement d’investissement."
        />
      </Reveal>

      <Reveal delay={80}>
        <aside className="mt-7 flex items-start gap-3 rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5 text-sm leading-relaxed text-surface-variant">
          <ScrollText size={16} className="mt-0.5 shrink-0 text-[color:var(--primary)]" />
          <p>
            <strong className="font-medium text-foreground">Provenance & méthode.</strong> Chaque fiche lie le document original, dont la voie de
            publication est indiquée (bibliothèque officielle du fonds, pièce judiciaire, billet public). Les extraits sont courts, traduits de l'anglais et
            signalés lorsqu'ils sont condensés. Le document source permet de vérifier le contexte complet ; les annotations explicitent la fonction
            décisionnelle de chaque passage.
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
