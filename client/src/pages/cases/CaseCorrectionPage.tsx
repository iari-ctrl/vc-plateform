import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpenCheck, ChevronDown, Clock, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { caseBySlug } from '@/content/caseStudies';
import { DELIVERABLES } from '@/content/deliverables';
import { loadCaseCorrectionBySourceCaseId } from '@/content/caseCorrections';
import { parcoursContextForStep, parcoursContextHref } from '@/content/parcours';
import type { CaseCorrection } from '@/content/types';
import { Markdown } from '@/lib/markdown';
import { learningWorkspace, productionStageAtLeast, useLearningWorkspace } from '@/lib/learningWorkspace';
import { useResourcePageMeta } from '@/lib/seo';
import { PageLoader } from '@/components/ui/primitives';
import NotFoundPage from '@/pages/system/NotFoundPage';

export default function CaseCorrectionPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const caseStudy = slug ? caseBySlug(slug) : undefined;
  const deliverable = caseStudy
    ? DELIVERABLES.find((candidate) => candidate.caseStudyId === caseStudy.id && candidate.correctionId)
    : undefined;
  const workspace = useLearningWorkspace();
  const production = deliverable ? workspace.productions[deliverable.id] : undefined;
  const firstVersionComplete = productionStageAtLeast(production?.stage, 'first-version-completed');
  const revealed = Boolean(production?.correctionRevealedAt);
  const [correction, setCorrection] = useState<CaseCorrection>();
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  useResourcePageMeta(
    Boolean(caseStudy && caseStudy.learningRole === 'learner-dossier' && deliverable),
    correction?.title ?? (caseStudy ? `Correction commentée · ${caseStudy.title}` : undefined),
    correction?.summary,
    { type: 'article', noindex: true, canonical: false },
  );

  useEffect(() => {
    if (!revealed || !caseStudy) return;
    let active = true;
    setLoading(true);
    setLoadFailed(false);
    void loadCaseCorrectionBySourceCaseId(caseStudy.id)
      .then((value) => {
        if (!active) return;
        setCorrection(value);
        setLoadFailed(!value);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [caseStudy, revealed, loadAttempt]);

  if (!caseStudy || caseStudy.learningRole !== 'learner-dossier' || !deliverable) return <NotFoundPage />;
  const deliverableId = deliverable.id;
  const context = parcoursContextForStep('deliverable', deliverableId, searchParams.get('parcours'), searchParams.get('budget'))
    ?? parcoursContextForStep('milestone', deliverableId, searchParams.get('parcours'), searchParams.get('budget'));
  const caseHref = context ? parcoursContextHref(`/cases/${caseStudy.slug}`, context.parcours.id, context.budget) : `/cases/${caseStudy.slug}`;
  const deliverableHref = context ? parcoursContextHref(`/livrables/${deliverable.slug}`, context.parcours.id, context.budget) : `/livrables/${deliverable.slug}`;

  function reveal() {
    const result = learningWorkspace.revealCorrection(deliverableId);
    setAnnouncement(result.ok ? 'Correction révélée. Elle restera disponible sur cet appareil.' : 'La correction n’a pas pu être révélée.');
  }

  if (loading) return <PageLoader label="Chargement de la correction commentée…" />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={caseHref} className="btn-quiet mb-6 -ml-3">
        <ArrowLeft size={15} aria-hidden /> {caseStudy.title}
      </Link>

      {!firstVersionComplete && (
        <section className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 sm:p-8" aria-labelledby="correction-gate-title">
          <p className="eyebrow flex items-center gap-2"><ShieldCheck size={14} aria-hidden /> Correction commentée</p>
          <h1 id="correction-gate-title" className="mt-3 font-headline text-display-sm font-semibold leading-tight">Terminez une première version</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-surface-variant">
            Déclarez la première version du jalon final terminée pour choisir ensuite de révéler la correction. Tous les contenus du parcours restent accessibles pendant votre production.
          </p>
          <Link to={deliverableHref} className="btn-foil mt-6">
            Ouvrir le jalon final <ArrowRight size={15} aria-hidden />
          </Link>
        </section>
      )}

      {firstVersionComplete && !revealed && (
        <section className="rounded-2xl border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-8" aria-labelledby="correction-reveal-title">
          <p className="eyebrow flex items-center gap-2"><BookOpenCheck size={14} aria-hidden /> Première version déclarée</p>
          <h1 id="correction-reveal-title" className="mt-3 font-headline text-display-sm font-semibold leading-tight">Comparer vos arbitrages</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-surface-variant">
            La correction présente plusieurs décisions défendables, leurs hypothèses et les informations encore nécessaires. Sa révélation sera mémorisée sur cet appareil.
          </p>
          <button type="button" onClick={reveal} className="btn-foil mt-6">
            <Eye size={16} aria-hidden /> Révéler la correction commentée
          </button>
        </section>
      )}

      {revealed && loadFailed && (
        <section role="alert" className="rounded-2xl border border-[color-mix(in_srgb,var(--error)_35%,transparent)] bg-surface-container-low p-6">
          <h1 className="font-headline text-headline-md font-semibold">Correction indisponible</h1>
          <p className="mt-2 text-sm text-surface-variant">Le fichier de correction n’a pas pu être chargé. Relancez le chargement de cette ressource.</p>
          <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="btn-ghost mt-4">
            Réessayer
          </button>
        </section>
      )}

      {revealed && correction && (
        <article>
          <header className="border-b border-outline-variant pb-8">
            <p className="eyebrow flex items-center gap-2"><BookOpenCheck size={14} aria-hidden /> Correction révélée volontairement</p>
            <h1 className="mt-3 font-headline text-display-sm font-semibold leading-tight tracking-tight">{correction.title}</h1>
            <p className="mt-2 font-headline text-headline-sm italic text-surface-variant">{correction.subtitle}</p>
            <p className="mt-4 text-lg leading-relaxed text-surface-variant">{correction.summary}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-surface-variant"><Clock size={14} aria-hidden /> {correction.readMin} min de lecture</p>
            <p className="mt-4 text-sm leading-relaxed text-surface-variant">Ces options servent à réviser votre raisonnement. Elles ne constituent ni une décision unique attendue, ni un avis professionnel.</p>
          </header>

          {correction.sections && correction.sections.length > 0 && (
            <div className="mt-8 prose-editorial">
              {correction.sections.map((section) => (
                <section key={section.heading} className="mt-8 first:mt-0">
                  <h2>{section.heading}</h2>
                  <Markdown source={section.body} className="prose-editorial" />
                </section>
              ))}
            </div>
          )}

          <section className="mt-12" aria-labelledby="decision-branches-title">
            <p className="eyebrow">Arbitrages commentés</p>
            <h2 id="decision-branches-title" className="mt-2 font-headline text-headline-lg font-semibold">Décisions défendables selon les hypothèses</h2>
            <div className="mt-5 space-y-3">
              {correction.decisionBranches.map((branch, index) => (
                <details key={branch.title} className="group rounded-2xl border border-outline-variant bg-surface-container-lowest open:border-[color-mix(in_srgb,var(--primary)_45%,transparent)]">
                  <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)] [&::-webkit-details-marker]:hidden">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-container font-mono text-[0.625rem] text-surface-variant">{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{branch.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-surface-variant">{branch.decision}</span>
                    </span>
                    <ChevronDown size={17} className="mt-1 shrink-0 text-surface-variant transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <div className="grid gap-5 border-t border-outline-variant px-5 py-5 sm:grid-cols-2">
                    <BranchList title="Hypothèses" values={branch.assumptions} />
                    <BranchList title="Arbitrages" values={branch.tradeoffs} />
                    <BranchList title="Limites des preuves" values={branch.evidenceLimits} />
                    <BranchList title="Informations nécessaires" values={branch.informationNeeded} />
                  </div>
                </details>
              ))}
            </div>
          </section>

          {correction.takeaways.length > 0 && (
            <aside className="mt-10 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6">
              <p className="eyebrow flex items-center gap-2"><Sparkles size={14} aria-hidden /> Points de révision</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                {correction.takeaways.map((takeaway) => <li key={takeaway} className="flex gap-3"><CheckIcon /><span>{takeaway}</span></li>)}
              </ul>
            </aside>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to={deliverableHref} className="btn-foil">Réviser ma production <ArrowRight size={15} aria-hidden /></Link>
            <Link to={caseHref} className="btn-ghost">Revoir le dossier apprenant</Link>
          </div>
        </article>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}

function CheckIcon() {
  return <span aria-hidden className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-[color:var(--primary)]" />;
}

function BranchList({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-surface-variant">
        {values.map((value) => <li key={value} className="flex gap-2"><span aria-hidden>•</span><span>{value}</span></li>)}
      </ul>
    </div>
  );
}
