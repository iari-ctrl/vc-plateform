import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles, BookMarked, ArrowUpRight, FileCheck2 } from 'lucide-react';
import { courseById } from '@/content/courses';
import { deliverableById } from '@/content/deliverables';
import { loadLesson, publishedLessonsForCourse } from '@/content/lessons';
import { parcoursContextHref, parcoursNavigationForLesson, type TimeBudget } from '@/content/parcours';
import type { FurtherReading, Lesson } from '@/content/types';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { QuizBlock } from '@/components/reading/QuizBlock';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { PageLoader } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { Markdown } from '@/lib/markdown';
import { useResourcePageMeta } from '@/lib/seo';
import { commitOnStorageSuccess, storage } from '@/lib/storage';
import { STORAGE_CONTRACTS, type ReadingDepth } from '@/lib/storageDomains';
import NotFoundPage from '@/pages/system/NotFoundPage';
import { furtherReadingHref } from './furtherReadingHref';

const REFERENCES_HEADING_RE = /^##\s+Références\s*$/i;
const SECTION_HEADING_RE = /^##\s+/;

function splitMarkdownReferences(source: string): { body: string; references?: string } {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => REFERENCES_HEADING_RE.test(line.trim()));
  if (start === -1) return { body: source };

  const nextSection = lines.findIndex((line, index) => index > start && SECTION_HEADING_RE.test(line.trim()));
  const end = nextSection === -1 ? lines.length : nextSection;
  const references = lines.slice(start + 1, end).join('\n').trim();
  const body = [...lines.slice(0, start), ...lines.slice(end)].join('\n').trim();

  return { body, references: references || undefined };
}

function collectMarkdownReferences(...sources: Array<string | undefined>): string | undefined {
  const seenSources = new Set<string>();
  const references: string[] = [];
  for (const source of sources) {
    if (!source || seenSources.has(source)) continue;
    seenSources.add(source);
    const section = splitMarkdownReferences(source).references;
    if (section && !references.includes(section)) references.push(section);
  }
  return references.length > 0 ? references.join('\n\n') : undefined;
}

function resolveFurtherReadings(readings: FurtherReading[] | undefined) {
  return (readings ?? []).flatMap((reading) => {
    const href = furtherReadingHref(reading);
    return href ? [{ reading, href, isExternal: reading.kind === 'external' }] : [];
  });
}

export default function LessonPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // The bundled lesson resolves lazily: the reader payload (body/quiz) lives
  // in its own chunk (see content/lessons.ts), fetched on demand instead of
  // weighing down the initial bundle.
  const [bundled, setBundled] = useState<Lesson | undefined>(undefined);
  const [bundledReady, setBundledReady] = useState(false);
  const [bundledError, setBundledError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setBundled(undefined);
    setBundledReady(false);
    setBundledError(false);
    if (!slug) {
      setBundledReady(true);
      return;
    }
    void loadLesson(slug)
      .then((l) => {
        if (!active) return;
        setBundled(l);
        setBundledReady(true);
      })
      .catch(() => {
        if (!active) return;
        setBundledError(true);
        setBundledReady(true);
      });
    return () => {
      active = false;
    };
  }, [slug, loadAttempt]);

  const lesson = bundled;
  const { progress, setProgress } = useUserData();
  const [readPct, setReadPct] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [referencesOpen, setReferencesOpen] = useState(false);
  // Reader depth is a global, client-only preference; defaults to "court" everywhere.
  const [depth, setDepth] = useState<ReadingDepth>(() => storage.getParsed(STORAGE_CONTRACTS.readingDepth));
  const changeDepth = (d: ReadingDepth) => {
    const result = storage.setParsed(STORAGE_CONTRACTS.readingDepth, d);
    commitOnStorageSuccess(result, d, setDepth);
  };
  const articleRef = useRef<HTMLDivElement>(null);
  const lastMarkedLessonId = useRef<string | null>(null);

  useEffect(() => {
    storage.migrate(STORAGE_CONTRACTS.readingDepth);
  }, []);

  useResourcePageMeta(!bundledReady || Boolean(lesson), lesson?.title, lesson?.summary, { type: 'article' });

  const course = lesson ? courseById(lesson.courseId) : undefined;
  const requestedParcoursId = searchParams.get('parcours') ?? undefined;
  const requestedBudgetParam = searchParams.get('budget');
  const requestedBudget = requestedBudgetParam === 'low' || requestedBudgetParam === 'medium' || requestedBudgetParam === 'high'
    ? requestedBudgetParam as TimeBudget
    : undefined;
  const parcoursNavigation = lesson && requestedParcoursId
    ? parcoursNavigationForLesson(lesson.id, requestedParcoursId, requestedBudget)
    : null;
  const parcours = parcoursNavigation?.parcours;
  const siblings = course ? publishedLessonsForCourse(course.id) : [];
  const idx = lesson ? siblings.findIndex((l) => l.id === lesson.id) : -1;
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
  const contextualHref = (href: string | undefined) => (
    href && parcoursNavigation ? parcoursContextHref(href, parcoursNavigation.parcours.id, requestedBudget) : href
  );
  const prevHref = contextualHref(parcoursNavigation?.prev?.href ?? (prev ? `/lessons/${prev.slug}` : undefined));
  const prevTitle = parcoursNavigation?.prev?.title ?? prev?.title;
  const nextHref = contextualHref(parcoursNavigation?.next?.href ?? (next ? `/lessons/${next.slug}` : undefined));
  const nextTitle = parcoursNavigation?.next?.title ?? next?.title;
  const entry = lesson ? progress[lesson.id] : undefined;
  const isDone = entry?.status === 'done';
  const practiceDeliverable = lesson?.practice ? deliverableById(lesson.practice.deliverableId) : undefined;

  // Mark as "reading" on first view (without downgrading a completed lesson).
  useEffect(() => {
    if (!lesson || lastMarkedLessonId.current === lesson.id) return;
    lastMarkedLessonId.current = lesson.id;
    if (progress[lesson.id]?.status !== 'done') {
      void setProgress({ lessonId: lesson.id, courseId: lesson.courseId, pathId: parcoursNavigation?.parcours.id ?? parcours?.id, status: 'reading', percent: Math.max(progress[lesson.id]?.percent ?? 0, 5) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  useEffect(() => {
    setReadPct(0);
    setReferencesOpen(false);
  }, [slug]);

  // Track reading progress for the top bar.
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const start = el.offsetTop;
      const total = el.scrollHeight - window.innerHeight * 0.6;
      const scrolled = window.scrollY - start + window.innerHeight * 0.4;
      setReadPct(Math.min(100, Math.max(0, Math.round((scrolled / Math.max(total, 1)) * 100))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lesson?.id]);

  // Hold the loader while the lazy content chunk resolves to avoid flashing a 404.
  if (!bundledReady) return <PageLoader />;
  if (bundledError) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div role="alert" className="rounded-2xl border border-outline-variant bg-surface-container-low p-6">
          <p className="font-headline text-headline-sm font-semibold">Le contenu de la leçon n’a pas pu être chargé.</p>
          <p className="mt-2 text-sm leading-relaxed text-surface-variant">Vérifiez la connexion, puis relancez le chargement de cette ressource.</p>
          <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="btn-ghost mt-5">
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  if (!lesson) return <NotFoundPage />;

  // "Court" (essentiel) is the default; "Profond" is the opt-in full body.
  const hasShort = typeof lesson.bodyShort === 'string' && lesson.bodyShort.length > 0;
  const bodySource = hasShort && depth === 'court' ? (lesson.bodyShort as string) : lesson.body;
  const splitBody = splitMarkdownReferences(bodySource);
  const markdownReferences = collectMarkdownReferences(bodySource, lesson.bodyShort, lesson.body);
  const resolvedFurtherReadings = resolveFurtherReadings(lesson.furtherReading);
  const hasReferences = Boolean(markdownReferences) || resolvedFurtherReadings.length > 0;
  const referencesPanelId = `lesson-references-${lesson.id}`;
  const referencesSection = hasReferences ? (
    <section className="mt-10 rounded-2xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
      <button
        type="button"
        aria-expanded={referencesOpen}
        aria-controls={referencesPanelId}
        onClick={() => setReferencesOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span>
          <span className="eyebrow block">Références</span>
          <span className="mt-1 block font-headline text-headline-xs font-semibold text-foreground">
            {referencesOpen ? 'Masquer les références' : 'Afficher les références'}
          </span>
        </span>
        <ArrowUpRight size={16} className="shrink-0 text-surface-variant" aria-hidden />
      </button>

      {referencesOpen && (
        <div id={referencesPanelId} className="mt-5 border-t border-outline-variant pt-5">
          <h2 className="font-headline text-headline-sm font-semibold">Références</h2>
          {markdownReferences && (
            <Markdown source={markdownReferences} className="prose-editorial mt-4" />
          )}
          {resolvedFurtherReadings.length > 0 && (
            <div className={markdownReferences ? 'mt-5' : 'mt-4'}>
              <p className="eyebrow mb-3">Pour aller plus loin</p>
              <div className="space-y-2">
                {resolvedFurtherReadings.map(({ reading, href, isExternal }, i) => {
                  const className = 'flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low';
                  if (isExternal) {
                    return (
                      <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                        <span>{reading.label}<span className="sr-only"> (s’ouvre dans un nouvel onglet)</span></span>
                        <ArrowUpRight size={15} className="text-surface-variant" aria-hidden />
                      </a>
                    );
                  }
                  return (
                    <Link key={i} to={href} className={className}>
                      <span>{reading.label}</span>
                      <ArrowUpRight size={15} className="text-surface-variant" aria-hidden />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  ) : null;

  async function complete() {
    if (!lesson) return;
    if (isDone) {
      if (nextHref) {
        navigate(nextHref);
      } else if (course) {
        navigate(contextualHref(`/courses/${course.slug}`) ?? `/courses/${course.slug}`);
      }
      return;
    }
    setCompleting(true);
    try {
      const result = await setProgress({ lessonId: lesson.id, courseId: lesson.courseId, pathId: parcoursNavigation?.parcours.id ?? parcours?.id, status: 'done', percent: 100 });
      if (result.ok) {
        if (nextHref) {
          navigate(nextHref);
        } else if (course) {
          navigate(contextualHref(`/courses/${course.slug}`) ?? `/courses/${course.slug}`);
        }
      }
    } finally {
      setCompleting(false);
    }
  }

  return (
    <article>
      {/* reading progress */}
      <div
        className="sticky top-14 z-30 h-0.5 w-full bg-transparent lg:top-0"
        role="progressbar"
        aria-label="Progression de lecture de la page"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isDone ? 100 : readPct}
      >
        <div className="h-full bg-[color:var(--primary)] transition-[width] duration-150" style={{ width: `${isDone ? 100 : readPct}%` }} />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-surface-variant">
          {parcours && <Link to={`/parcours/${parcours.slug}${requestedBudget ? `?budget=${requestedBudget}` : ''}`} className="hover:text-foreground">{parcours.title}</Link>}
          {course && <><span>/</span><Link to={contextualHref(`/courses/${course.slug}`) ?? `/courses/${course.slug}`} className="hover:text-foreground">{course.title}</Link></>}
        </nav>

        <header>
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[color:var(--primary)]">{lesson.kicker}</p>
            <div className="flex items-center gap-2">
              {isDone && <span className="inline-flex items-center gap-1 rounded-full bg-[#3E7C6A]/12 px-2.5 py-1 text-[0.625rem] font-semibold text-[#3E7C6A]"><Check size={11} /> Terminé</span>}
              <BookmarkButton item={{ itemType: 'lesson', itemId: lesson.id, title: lesson.title, href: `/lessons/${lesson.slug}` }} />
            </div>
          </div>
          <h1 className="mt-3 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{lesson.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{lesson.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-outline-variant py-3 text-sm text-surface-variant">
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {lesson.readMin} min de lecture</span>
            {lesson.practice && <span className="inline-flex items-center gap-1.5"><FileCheck2 size={14} aria-hidden /> {lesson.practice.estimatedMinutes} min de contribution guidée</span>}
            <span className="inline-flex items-center gap-1.5"><BookMarked size={14} /> Lecture active : surlignez pour citer</span>
            {hasShort && (
              <div className="ml-auto flex gap-1" role="group" aria-label="Profondeur de lecture">
                {(['court', 'profond'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => changeDepth(d)}
                    aria-pressed={depth === d}
                    title={d === 'court' ? "L'essentiel" : 'Version approfondie'}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      depth === d
                        ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
                        : 'border-outline-variant text-surface-variant hover:text-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* body */}
        <div ref={articleRef} className="mt-8">
          <ActiveProse source={splitBody.body} sourceType="lesson" sourceId={lesson.id} sourceTitle={lesson.title} />
        </div>

        {/* key takeaways */}
        {lesson.keyTakeaways.length > 0 && (
          <aside className="mt-12 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7">
            <p className="eyebrow mb-4 flex items-center gap-2"><Sparkles size={14} /> À retenir</p>
            <ul className="space-y-3">
              {lesson.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.95rem] font-medium">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] font-mono text-[0.625rem] text-[color:var(--primary)]">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {referencesSection}

        {/* quiz */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <div className="mt-10">
            <QuizBlock quiz={lesson.quiz} />
          </div>
        )}

        {lesson.practice && practiceDeliverable && (
          <aside className="mt-10 rounded-2xl border border-outline-variant bg-surface-container-low p-5 sm:p-6">
            <p className="eyebrow flex items-center gap-2"><FileCheck2 size={14} aria-hidden /> Contribution au dossier longitudinal</p>
            <h2 className="mt-2 font-headline text-headline-sm font-semibold">{practiceDeliverable.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-surface-variant">Cette leçon alimente la section « {lesson.practice.sectionId.replaceAll('-', ' ')} ». Temps de travail estimé : {lesson.practice.estimatedMinutes} min.</p>
            <Link to={`/livrables/${practiceDeliverable.slug}`} className="btn-ghost mt-4">Ouvrir la fiche de production <ArrowUpRight size={15} aria-hidden /></Link>
          </aside>
        )}

        {/* glossary refs */}
        <div className="mt-10">
          <GlossaryRefList slugs={lesson.glossaryRefs} />
        </div>

        {/* complete CTA */}
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-low p-7 text-center">
          <p className="font-headline text-headline-sm font-semibold">{isDone ? 'Leçon déclarée lue' : 'Avez-vous terminé la lecture de cette leçon ?'}</p>
          <p className="mt-1 text-sm text-surface-variant">{nextTitle ? `Suivant : ${nextTitle}` : 'Dernière leçon de ce cours.'}</p>
          <button onClick={() => void complete()} disabled={completing} className="btn-foil mt-5 disabled:opacity-50">
            {completing ? 'Enregistrement…' : isDone ? (nextHref ? 'Continuer' : 'Revenir au cours') : 'Déclarer la leçon lue'}
            {nextHref ? <ArrowRight size={16} /> : <Check size={16} />}
          </button>
        </div>

        {/* prev / next */}
        <nav className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {prevHref && prevTitle ? (
            <Link to={prevHref} className="group flex min-w-0 items-center gap-3 rounded-xl border border-outline-variant px-4 py-3 transition-colors hover:bg-surface-container-low">
              <ArrowLeft size={16} className="shrink-0 text-surface-variant" />
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Précédent</span><span className="block truncate text-sm font-medium">{prevTitle}</span></span>
            </Link>
          ) : <span />}
          {nextHref && nextTitle && (
            <Link to={nextHref} className="group flex min-w-0 items-center justify-end gap-3 rounded-xl border border-outline-variant px-4 py-3 text-right transition-colors hover:bg-surface-container-low">
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Suivant</span><span className="block truncate text-sm font-medium">{nextTitle}</span></span>
              <ArrowRight size={16} className="shrink-0 text-surface-variant" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
