import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG } from '@/content/blog';
import { DELIVERABLES } from '@/content/deliverables';
import { BlogCard, DeliverableCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

export default function MethodePage() {
  usePageMeta(
    'Méthode',
    'Cadres d’analyse, articles méthode et modèles de travail pour transformer une lecture en raisonnement VC exploitable.',
  );

  const posts = BLOG;
  const methodPosts = posts.filter((post) => post.category === 'Méthode').sort((a, b) => b.date.localeCompare(a.date));
  const deliverablePreview = DELIVERABLES.slice(0, 2);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Méthode"
          title="Cadres d’analyse et modèles de travail"
          description="La méthode ne déplace pas les contenus : les cadres restent publiés comme analyses, les modèles restent des livrables. Cette salle les regroupe pour un usage direct."
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5 text-sm leading-relaxed text-surface-variant">
          <p>
            <strong className="font-medium text-foreground">Principe.</strong> Un cadre d’analyse sert à rendre une décision explicite : hypothèses, signaux,
            contre-arguments, vérification. Les pages de détail restent canoniques à leur emplacement d’origine.
          </p>
        </div>
      </Reveal>

      <section className="mt-12">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <SectionHeading eyebrow="Cadres d’analyse" title="Articles méthode" />
            <Link to="/blog" className="btn-quiet">Toutes les analyses <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {methodPosts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 2) * 70}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <SectionHeading
              eyebrow="Modèles & livrables"
              title="Aperçu des livrables"
              description="Cette sélection donne un accès rapide aux artefacts de travail ; le catalogue complet reste dans l’espace Livrables."
            />
            <Link to="/livrables" className="btn-quiet">Catalogue complet <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {deliverablePreview.map((deliverable, i) => (
            <Reveal key={deliverable.id} delay={(i % 2) * 70}>
              <DeliverableCard deliverable={deliverable} />
            </Reveal>
          ))}
        </div>
      </section>

      {methodPosts.length === 0 && deliverablePreview.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-outline-variant p-8 text-center text-sm text-surface-variant">
          <FileText size={24} className="mx-auto mb-3 text-surface-variant" />
          Aucun cadre méthode ou livrable n’est disponible pour l’instant.
        </div>
      )}
    </div>
  );
}
