import { useParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react';
import { simulatorBySlug, lessonById } from '@/content';
import { SIMULATOR_COMPONENTS } from '@/components/simulators/calculators';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from './NotFoundPage';

export default function SimulatorPage() {
  const { slug } = useParams();
  const sim = slug ? simulatorBySlug(slug) : undefined;
  usePageMeta(sim?.title, sim?.description);

  if (!sim) return <NotFoundPage />;
  const Calculator = SIMULATOR_COMPONENTS[sim.id];

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/simulators" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Simulateurs</Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ color: sim.accent, background: `color-mix(in srgb, ${sim.accent} 12%, transparent)` }}>
            <FlaskConical size={22} />
          </span>
          <div>
            <span className="chip">{sim.category}</span>
            <h1 className="mt-2 font-headline text-display-sm font-semibold tracking-tight">{sim.title}</h1>
            <p className="mt-1 max-w-2xl text-surface-variant">{sim.description}</p>
          </div>
        </div>
        <BookmarkButton item={{ itemType: 'simulator', itemId: sim.id, title: sim.title, href: `/simulators/${sim.slug}` }} />
      </div>

      <div className="mt-9">
        {Calculator ? <Calculator accent={sim.accent} /> : <p className="text-surface-variant">Simulateur indisponible.</p>}
      </div>

      <div className="mt-12 grid gap-8 border-t border-outline-variant pt-8 md:grid-cols-2">
        <GlossaryRefList slugs={sim.glossaryRefs} />
        {sim.relatedLessonIds.length > 0 && (
          <div>
            <p className="eyebrow mb-3">Comprendre la théorie</p>
            <div className="space-y-2">
              {sim.relatedLessonIds.map((id) => {
                const l = lessonById(id);
                if (!l) return null;
                return (
                  <Link key={id} to={`/lessons/${l.slug}`} className="flex items-center justify-between rounded-xl border border-outline-variant px-4 py-2.5 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low">
                    <span>{l.title}</span>
                    <ArrowRight size={15} className="text-surface-variant" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
