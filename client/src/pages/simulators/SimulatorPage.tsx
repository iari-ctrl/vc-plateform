import { useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { simulatorBySlug, publicLessonById } from '@/content';
import { SIMULATOR_COMPONENTS } from '@/components/simulators';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { Modal } from '@/components/ui/Modal';
import { InvestmentMemoSim } from '@/components/simulators/investment-memo';
import { parcoursContextForStep, parcoursContextHref, parcoursNavigationForLesson } from '@/content/parcours';
import { learningWorkspace, useLearningWorkspace, isLearningActivityComplete } from '@/lib/learningWorkspace';
import { parcoursStepNavigation } from '@/lib/parcoursProgress';
import { useResourcePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

export default function SimulatorPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const sim = slug ? simulatorBySlug(slug) : undefined;
  const workspace = useLearningWorkspace();
  const [announcement, setAnnouncement] = useState('');
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesTrigger = useRef<HTMLButtonElement>(null);
  useResourcePageMeta(Boolean(sim), sim?.title, sim?.description);

  if (!sim) return <NotFoundPage />;
  const simulatorId = sim.id;
  const isMemo = simulatorId === 'investment-memo';
  const Calculator = SIMULATOR_COMPONENTS[simulatorId];
  const context = parcoursContextForStep('simulator', simulatorId, searchParams.get('parcours'), searchParams.get('budget'));
  const navigation = context ? parcoursStepNavigation(context.parcours, context.budget, 'simulator', simulatorId) : null;
  const completed = context ? isLearningActivityComplete(workspace, context.parcours.id, 'simulator', simulatorId) : false;
  const contextualHref = (href: string) => context ? parcoursContextHref(href, context.parcours.id, context.budget) : href;

  function completeActivity() {
    if (!context) return;
    const result = learningWorkspace.completeActivity(context.parcours.id, 'simulator', simulatorId);
    setAnnouncement(result.ok ? 'Activité effectuée.' : 'L’activité n’a pas pu être enregistrée.');
  }

  return (
    <div data-memo-workspace={isMemo ? '' : undefined} className={isMemo ? 'min-w-0' : 'mx-auto max-w-[var(--content-max)] px-4 py-6 sm:px-6 sm:py-9 lg:px-8'}>
      {isMemo ? <>
        <h1 className="sr-only break-words">{sim.title}</h1>
        <InvestmentMemoSim accent={sim.accent} platformActions={<>
          <Link to={context ? `/parcours/${context.parcours.slug}?budget=${context.budget}` : '/simulators'} aria-label={context?.parcours.title ?? 'Retour aux simulateurs'} title={context?.parcours.title ?? 'Retour aux simulateurs'}><ArrowLeft size={16} aria-hidden /></Link>
          <BookmarkButton item={{ itemType: 'simulator', itemId: sim.id, title: sim.title, href: `/simulators/${sim.slug}` }} />
          <button type="button" ref={resourcesTrigger} aria-label="Ressources liées" title="Ressources liées" aria-haspopup="dialog" onClick={() => setResourcesOpen(true)}><BookOpen size={16} aria-hidden /></button>
        </>} />
      </> : <>
        <Link to={context ? `/parcours/${context.parcours.slug}?budget=${context.budget}` : '/simulators'} className="btn-quiet mb-4 -ml-3">
          <ArrowLeft size={15} aria-hidden /> {context?.parcours.title ?? 'Tous les simulateurs'}
        </Link>
        <div className="flex items-start justify-between gap-3 border-b border-outline-variant pb-5">
          <div className="min-w-0">
            <h1 className="break-words font-headline text-display-sm font-semibold tracking-tight text-balance">{sim.title}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-surface-variant sm:text-base">{sim.subtitle}</p>
          </div>
          <BookmarkButton item={{ itemType: 'simulator', itemId: sim.id, title: sim.title, href: `/simulators/${sim.slug}` }} />
        </div>
        <div className="mt-5 sm:mt-7">
          {Calculator ? <Calculator accent={sim.accent} /> : <p className="text-surface-variant">Simulateur indisponible.</p>}
        </div>
      </>}

      {context && (
        <section className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-5" aria-labelledby="activity-status-title">
          <p className="eyebrow">Progression du parcours</p>
          <h2 id="activity-status-title" className="mt-2 font-headline text-headline-sm font-semibold">Activité pratique</h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-variant">Cette page ne valide rien à l’ouverture. Marquez l’activité effectuée après avoir saisi, vérifié et interprété un scénario utile à votre dossier.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {completed ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--success)]"><CheckCircle2 size={16} aria-hidden /> Activité effectuée</span>
            ) : (
              <button type="button" onClick={completeActivity} className="btn-foil">Marquer cette activité effectuée <CheckCircle2 size={15} aria-hidden /></button>
            )}
          </div>
        </section>
      )}

      {navigation && (
        <nav className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Navigation dans le parcours">
          {navigation.previous ? (
            <Link to={contextualHref(navigation.previous.href)} className="group flex min-w-0 items-center gap-3 rounded-xl border border-outline-variant px-4 py-3 transition-colors hover:bg-surface-container-low">
              <ArrowLeft size={16} className="shrink-0 text-surface-variant" aria-hidden />
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Précédent</span><span className="block truncate text-sm font-medium">{navigation.previous.title}</span></span>
            </Link>
          ) : <span />}
          {navigation.next && (
            <Link to={contextualHref(navigation.next.href)} className="group flex min-w-0 items-center justify-end gap-3 rounded-xl border border-outline-variant px-4 py-3 text-right transition-colors hover:bg-surface-container-low">
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Suivant</span><span className="block truncate text-sm font-medium">{navigation.next.title}</span></span>
              <ArrowRight size={16} className="shrink-0 text-surface-variant" aria-hidden />
            </Link>
          )}
        </nav>
      )}

      <Modal open={isMemo && resourcesOpen} onClose={() => {
        setResourcesOpen(false);
        requestAnimationFrame(() => resourcesTrigger.current?.focus());
      }} labelledBy="memo-resources-title" className="max-w-3xl p-6 sm:p-8">
        <h2 id="memo-resources-title" className="mb-6 pr-8 font-headline text-headline-md">Ressources liées</h2>
        <SimulatorResources sim={sim} context={context} />
      </Modal>
      {!isMemo && <div className="mt-12 border-t border-outline-variant pt-8">
        <SimulatorResources sim={sim} context={context} />
      </div>}
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}

function SimulatorResources({ sim, context }: { sim: NonNullable<ReturnType<typeof simulatorBySlug>>; context: ReturnType<typeof parcoursContextForStep> }) {
  return (
      <div className="grid gap-8 md:grid-cols-2">
        <GlossaryRefList slugs={sim.glossaryRefs} />
        {sim.relatedLessonIds.length > 0 && (
          <div>
            <p className="eyebrow mb-3">Comprendre la théorie</p>
            <div className="space-y-2">
              {sim.relatedLessonIds.map((id) => {
                const l = publicLessonById(id);
                if (!l) return null;
                const lessonNavigation = context ? parcoursNavigationForLesson(l.id, context.parcours.id, context.budget) : null;
                const href = lessonNavigation ? parcoursContextHref(`/lessons/${l.slug}`, context!.parcours.id, context!.budget) : `/lessons/${l.slug}`;
                return (
                  <Link key={id} to={href} className="flex items-center justify-between rounded-xl border border-outline-variant px-4 py-2.5 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low">
                    <span>{l.title}</span>
                    <ArrowRight size={15} className="text-surface-variant" aria-hidden />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
  );
}
