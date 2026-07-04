import { ArrowRight, Crosshair, FileText, Microscope, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG } from '@/content/blog';
import { ECOSYSTEMS, childEcosystems } from '@/content/ecosystems';
import { allConvictions, convictionsToReview } from '@/content/convictions';
import { BlogCard, EcosystemCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';
import type { BlogPost } from '@/content/types';

const QUICK_LINKS = [
  {
    to: '/convictions',
    label: 'Registre des convictions',
    description: 'Thèses datées, niveau de force et horizons de révision.',
    icon: Crosshair,
  },
  {
    to: '/decisions',
    label: 'Décisions',
    description: 'Cas, memos et anti-portfolio pour étudier le raisonnement.',
    icon: ScrollText,
  },
  {
    to: '/methode',
    label: 'Méthode',
    description: 'Cadres d’analyse et modèles réutilisables.',
    icon: FileText,
  },
];

export default function IntelligencePage() {
  usePageMeta(
    'Intelligence VC',
    'Surface de travail pour suivre les dossiers, convictions, analyses et décisions utiles à une pensée d’investisseur.',
  );

  const posts = BLOG;
  const latestPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const recentDossiers = [...ECOSYSTEMS].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const review = convictionsToReview().slice(0, 4);
  const convictions = allConvictions();

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Intelligence VC"
          title="Suivre les terrains, les thèses et les décisions"
          description="Cette surface rassemble les dossiers d’écosystème, les convictions datées, les analyses et les artefacts de décision. Elle sert à savoir quoi lire maintenant, quoi réviser, et où produire un raisonnement exploitable."
        />
      </Reveal>

      <Reveal delay={70}>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <Link key={item.to} to={item.to} className="premium-card premium-card-hover group p-5">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[color:var(--primary)]">
                  <item.icon size={18} />
                </span>
                <ArrowRight size={15} className="mt-1 text-surface-variant transition-transform group-hover:translate-x-0.5" />
              </div>
              <h2 className="mt-4 font-headline text-headline-sm font-semibold">{item.label}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-surface-variant">{item.description}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="premium-card p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Convictions à réviser</p>
                <h2 className="mt-2 font-headline text-headline-lg font-semibold">Les horizons arrivés à échéance</h2>
              </div>
              <Link to="/convictions" className="btn-quiet">Tout le registre <ArrowRight size={15} /></Link>
            </div>
            {review.length > 0 ? (
              <div className="mt-5 space-y-3">
                {review.map((conviction) => (
                  <Link
                    key={`${conviction.ecosystemId}-${conviction.statement}`}
                    to={`/ecosystemes/${conviction.ecosystemSlug}`}
                    className="group block rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)]"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-surface-variant">
                      <span className="font-medium text-foreground">{conviction.ecosystemName}</span>
                      <span className="chip">{conviction.horizon}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-surface-variant">{conviction.statement}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-outline-variant p-5 text-sm text-surface-variant">
                Aucune conviction n’a un horizon déjà arrivé à échéance. Le registre reste disponible pour lecture et filtrage.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="premium-card p-7">
            <p className="eyebrow flex items-center gap-2"><Microscope size={13} /> Corpus actif</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat label="dossiers" value={ECOSYSTEMS.length} />
              <Stat label="convictions" value={convictions.length} />
              <Stat label="analyses" value={posts.length} />
              <Stat label="à réviser" value={review.length} />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-surface-variant">
              Les contenus restent à leur URL canonique. Cette page ne crée pas une nouvelle couche éditoriale ; elle rend visible le travail déjà produit.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mt-14">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <SectionHeading eyebrow="Dossiers récents" title="Terrains à surveiller" />
            <Link to="/ecosystemes" className="btn-quiet">Tous les écosystèmes <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {recentDossiers.map((dossier, i) => (
            <Reveal key={dossier.id} delay={(i % 2) * 70}>
              <EcosystemCard dossier={dossier} childCount={childEcosystems(dossier.id).length} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <SectionHeading eyebrow="Analyses récentes" title="Notes de recherche" />
            <Link to="/blog" className="btn-quiet">Toutes les analyses <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {latestPosts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 70}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
      <p className="font-headline text-display-sm font-semibold leading-none">{value}</p>
      <p className="mt-1 text-xs text-surface-variant">{label}</p>
    </div>
  );
}
