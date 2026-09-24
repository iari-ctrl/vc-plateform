import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import { simulatorBySlug, publicLessonById } from '@/content';
import { SIMULATOR_COMPONENTS } from '@/components/simulators';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
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
  useResourcePageMeta(Boolean(sim), sim?.title, sim?.description);

  if (!sim) return <NotFoundPage />;
  const simulatorId = sim.id;
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
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
      <Link to={context ? `/parcours/${context.parcours.slug}?budget=${context.budget}` : '/simulators'} className="btn-quiet mb-6 -ml-3">
        <ArrowLeft size={15} aria-hidden /> {context?.parcours.title ?? 'Simulateurs'}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ color: sim.accent, background: `color-mix(in srgb, ${sim.accent} 12%, transparent)` }}>
            <FlaskConical size={22} aria-hidden />
          </span>
          <div className="min-w-0">
            <span className="chip">{sim.category}</span>
            <h1 className="mt-2 break-words font-headline text-display-sm font-semibold tracking-tight">{sim.title}</h1>
            <p className="mt-1 max-w-2xl text-surface-variant">{sim.description}</p>
          </div>
        </div>
        <BookmarkButton item={{ itemType: 'simulator', itemId: sim.id, title: sim.title, href: `/simulators/${sim.slug}` }} />
      </div>

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

      <div className="mt-9">
        {Calculator ? <Calculator accent={sim.accent} /> : <p className="text-surface-variant">Simulateur indisponible.</p>}
      </div>

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

      <div className="mt-12 grid gap-8 border-t border-outline-variant pt-8 md:grid-cols-2">
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
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
