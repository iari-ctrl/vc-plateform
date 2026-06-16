import { useParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Clock, Target, CheckCircle2, BookOpen, ArrowUpRight, Sparkles } from 'lucide-react';
import { deliverableBySlug, caseById, ecosystemById, memoById, lessonById } from '@/content';
import type { Deliverable, DeliverableModelRef } from '@/content/types';
import { Markdown } from '@/lib/markdown';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { PageLoader } from '@/components/ui/primitives';
import { useApiItem } from '@/hooks/useApiData';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

/** Resolve a deliverable's model exemplar to an in-app route + label. */
function resolveModel(m: DeliverableModelRef): { href: string; title: string; typeLabel: string } | null {
  switch (m.kind) {
    case 'case': {
      const c = caseById(m.id);
      return c ? { href: `/cases/${c.slug}`, title: c.title, typeLabel: 'Étude de cas' } : null;
    }
    case 'ecosystem': {
      const e = ecosystemById(m.id);
      return e ? { href: `/ecosystemes/${e.slug}`, title: e.title, typeLabel: 'Dossier écosystème' } : null;
    }
    case 'memo': {
      const mm = memoById(m.id);
      return mm ? { href: `/memos/${mm.slug}`, title: mm.title, typeLabel: 'Memo annoté' } : null;
    }
    case 'lesson': {
      const l = lessonById(m.id);
      return l ? { href: `/lessons/${l.slug}`, title: l.title, typeLabel: 'Leçon' } : null;
    }
    default:
      return null;
  }
}

export default function DeliverablePage() {
  const { slug } = useParams();
  // Deliverables are bundled editorial content (no CMS endpoint yet): pass a null
  // path so useApiItem serves the bundle directly and never flashes a loader.
  const { item: d, pending } = useApiItem<Deliverable>(null, slug ? deliverableBySlug(slug) : undefined);
  usePageMeta(d?.title, d?.summary, { type: 'article' });

  if (pending) return <PageLoader />;
  if (!d) return <NotFoundPage />;

  const model = d.model ? resolveModel(d.model) : null;
  const relatedLessons = (d.relatedLessonIds ?? [])
    .map((id) => lessonById(id))
    .filter((l): l is NonNullable<typeof l> => !!l);

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/paths" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Parcours</Link>

      <header>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="chip">{d.kicker ?? 'Livrable'}</span>
            <span className="inline-flex items-center gap-1 text-surface-variant"><Clock size={13} /> {d.readMin} min</span>
          </div>
          <BookmarkButton item={{ itemType: 'deliverable', itemId: d.id, title: d.title, href: `/livrables/${d.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{d.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{d.summary}</p>
      </header>

      <section className="mt-8">
        <Markdown source={d.brief} className="prose-editorial" />
      </section>

      {model && (
        <Link
          to={model.href}
          className="group mt-8 flex items-start gap-4 rounded-2xl border border-outline-variant p-5 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low"
        >
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[color:var(--primary)]">
            <Sparkles size={16} />
          </span>
          <span className="min-w-0">
            <span className="eyebrow flex items-center gap-1.5">Le modèle · {model.typeLabel} <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
            <span className="mt-1 block font-headline text-headline-sm font-medium leading-snug">{model.title}</span>
            {d.model?.note && <span className="mt-1.5 block text-sm leading-relaxed text-surface-variant">{d.model.note}</span>}
          </span>
        </Link>
      )}

      <section className="mt-12">
        <p className="eyebrow mb-5 flex items-center gap-2"><Target size={14} /> Le gabarit</p>
        <ol className="space-y-7">
          {d.template.map((s, i) => (
            <li key={i}>
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] font-mono text-[0.625rem] text-[color:var(--primary)]">{i + 1}</span>
                <h2 className="font-headline text-headline-sm font-semibold leading-tight">{s.heading}</h2>
              </div>
              <div className="mt-2 pl-9 text-[0.95rem] leading-relaxed text-surface-variant">
                <Markdown source={s.prompt} className="prose-editorial" />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <aside className="mt-12 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7">
        <p className="eyebrow mb-5 flex items-center gap-2"><CheckCircle2 size={14} /> Grille d’auto-évaluation</p>
        <ul className="space-y-4">
          {d.rubric.map((r, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[color:var(--primary)]" />
              <span>
                <span className="block text-[0.95rem] font-medium">{r.criterion}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-surface-variant">{r.check}</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {relatedLessons.length > 0 && (
        <section className="mt-12">
          <p className="eyebrow mb-3">Pour préparer ce livrable</p>
          <ul className="space-y-2">
            {relatedLessons.map((l) => (
              <li key={l.id}>
                <Link to={`/lessons/${l.slug}`} className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-foreground underline decoration-dotted decoration-primary/60 decoration-1 underline-offset-[3px] transition-colors hover:decoration-primary hover:text-[color:var(--primary)]">
                  <BookOpen size={14} className="text-surface-variant" /> {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {d.glossaryRefs && d.glossaryRefs.length > 0 && (
        <div className="mt-10">
          <GlossaryRefList slugs={d.glossaryRefs} />
        </div>
      )}
    </article>
  );
}
