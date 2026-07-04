import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DELIVERABLES } from '@/content/deliverables';
import { DeliverableCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

export default function DeliverablesPage() {
  usePageMeta(
    'Modèles & livrables',
    'Briefs, gabarits et grilles d’auto-évaluation pour produire des artefacts VC réutilisables.',
  );

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Modèles & livrables"
          title="Passer de la lecture à la production"
          description="Chaque livrable combine un brief, un gabarit, une grille d’auto-évaluation et un modèle existant à imiter. Les détails restent aux URLs `/livrables/:slug`."
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5">
          <p className="flex items-center gap-3 text-sm text-surface-variant">
            <FileText size={18} className="shrink-0 text-[color:var(--primary)]" />
            {DELIVERABLES.length} modèle{DELIVERABLES.length > 1 ? 's' : ''} disponible{DELIVERABLES.length > 1 ? 's' : ''}, relié{DELIVERABLES.length > 1 ? 's' : ''} aux parcours et à la méthode.
          </p>
          <Link to="/methode" className="btn-quiet">Voir la méthode <ArrowRight size={15} /></Link>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {DELIVERABLES.map((deliverable, i) => (
          <Reveal key={deliverable.id} delay={(i % 2) * 70}>
            <DeliverableCard deliverable={deliverable} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
