import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles, BookMarked, ArrowUpRight } from 'lucide-react';
import { loadLesson, lessonById, courseById, lessonsForCourse, simulatorBySlug, caseById, glossaryBySlug } from '@/content';
import { parcoursForLesson } from '@/content/parcours';
import type { Lesson } from '@/content/types';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { QuizBlock } from '@/components/reading/QuizBlock';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { PageLoader } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import NotFoundPage from '@/pages/system/NotFoundPage';

/** Reader depth for lessons that ship both an "essentiel" and a full version. */
type ReadingDepth = 'court' | 'profond';

export default function LessonPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // The bundled lesson resolves lazily: the reader payload (body/quiz) lives
  // in its own chunk (see content/lessons.ts), fetched on demand instead of
  // weighing down the initial bundle.
  const [bundled, setBundled] = useState<Lesson | undefined>(undefined);
  const [bundledReady, setBundledReady] = useState(false);
  useEffect(() => {
    let active = true;
    setBundled(undefined);
    setBundledReady(false);
    if (!slug) {
      setBundledReady(true);
      return;
    }
    void loadLesson(slug).then((l) => {
      if (!active) return;
      setBundled(l);
      setBundledReady(true);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const lesson = bundled;
  const { progress, setProgress } = useUserData();
  const [readPct, setReadPct] = useState(0);
  const [completing, setCompleting] = useState(false);
  // Reader depth is a global, client-only preference; defaults to "court" everywhere.
  const [depth, setDepth] = useState<ReadingDepth>(() => storage.get<ReadingDepth>(STORAGE_KEYS.readingDepth, 'court'));
  const changeDepth = (d: ReadingDepth) => {
    const result = storage.set(STORAGE_KEYS.readingDepth, d);
    if (result.ok) setDepth(d);
  };
  const articleRef = useRef<HTMLDivElement>(null);
  const lastMarkedLessonId = useRef<string | null>(null);

  usePageMeta(lesson?.title, lesson?.summary, { type: 'article' });

  const course = lesson ? courseById(lesson.courseId) : undefined;
  const parcours = lesson ? parcoursForLesson(lesson.id)[0] : undefined;
  const siblings = course ? lessonsForCourse(course.id).filter((candidate) => candidate.status !== 'upcoming') : [];
  const idx = lesson ? siblings.findIndex((l) => l.id === lesson.id) : -1;
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
  const entry = lesson ? progress[lesson.id] : undefined;
  const isDone = entry?.status === 'done';

  // Mark as "reading" on first view (without downgrading a completed lesson).
  useEffect(() => {
    if (!lesson || lastMarkedLessonId.current === lesson.id) return;
    lastMarkedLessonId.current = lesson.id;
    if (progress[lesson.id]?.status !== 'done') {
      void setProgress({ lessonId: lesson.id, courseId: lesson.courseId, pathId: parcours?.id, status: 'reading', percent: Math.max(progress[lesson.id]?.percent ?? 0, 5) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  useEffect(() => {
    setReadPct(0);
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
  if (!lesson) return <NotFoundPage />;

  // "Court" (essentiel) is the default; "Profond" is the opt-in full body.
  const hasShort = typeof lesson.bodyShort === 'string' && lesson.bodyShort.length > 0;
  const bodySource = hasShort && depth === 'court' ? (lesson.bodyShort as string) : lesson.body;

  async function complete() {
    if (!lesson) return;
    if (isDone) {
      if (next) {
        navigate(`/lessons/${next.slug}`);
      } else if (course) {
        navigate(`/courses/${course.slug}`);
      }
      return;
    }
    setCompleting(true);
    try {
      const result = await setProgress({ lessonId: lesson.id, courseId: lesson.courseId, pathId: parcours?.id, status: 'done', percent: 100 });
      if (result.ok) {
        if (next) {
          navigate(`/lessons/${next.slug}`);
        } else if (course) {
          navigate(`/courses/${course.slug}`);
        }
      }
    } finally {
      setCompleting(false);
    }
  }

  return (
    <article>
      {/* reading progress */}
      <div className="sticky top-14 z-30 h-0.5 w-full bg-transparent lg:top-0">
        <div className="h-full bg-[color:var(--primary)] transition-[width] duration-150" style={{ width: `${isDone ? 100 : readPct}%` }} />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-surface-variant">
          {parcours && <Link to={`/parcours/${parcours.slug}`} className="hover:text-foreground">{parcours.title}</Link>}
          {course && <><span>/</span><Link to={`/courses/${course.slug}`} className="hover:text-foreground">{course.title}</Link></>}
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
          <ActiveProse source={bodySource} sourceType="lesson" sourceId={lesson.id} sourceTitle={lesson.title} />
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

        {/* quiz */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <div className="mt-10">
            <QuizBlock quiz={lesson.quiz} />
          </div>
        )}

        {/* glossary refs + further reading */}
        <div className="mt-10 space-y-8">
          <GlossaryRefList slugs={lesson.glossaryRefs} />
          {lesson.furtherReading && lesson.furtherReading.length > 0 && (
            <div>
              <p className="eyebrow mb-3">Pour aller plus loin</p>
              <div className="space-y-2">
                {lesson.furtherReading.map((fr, i) => {
                  const href =
                    fr.kind === 'simulator' ? `/simulators/${simulatorBySlug(fr.ref)?.slug ?? fr.ref}` :
                    fr.kind === 'lesson' ? `/lessons/${lessonById(fr.ref)?.slug ?? fr.ref}` :
                    fr.kind === 'course' ? `/courses/${courseById(fr.ref)?.slug ?? fr.ref}` :
                    fr.kind === 'case' ? `/cases/${caseById(fr.ref)?.slug ?? fr.ref}` :
                    fr.kind === 'glossary' ? `/glossary?term=${glossaryBySlug(fr.ref)?.slug ?? fr.ref}` :
                    '#';
                  return (
                    <Link key={i} to={href} className="flex items-center justify-between rounded-xl border border-outline-variant px-4 py-3 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low">
                      <span>{fr.label}</span>
                      <ArrowUpRight size={15} className="text-surface-variant" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* complete CTA */}
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-low p-7 text-center">
          <p className="font-headline text-headline-sm font-semibold">{isDone ? 'Leçon terminée' : 'Avez-vous terminé cette leçon ?'}</p>
          <p className="mt-1 text-sm text-surface-variant">{next ? `Suivant : ${next.title}` : 'Dernière leçon de ce cours.'}</p>
          <button onClick={() => void complete()} disabled={completing} className="btn-foil mt-5 disabled:opacity-50">
            {completing ? 'Enregistrement…' : isDone ? (next ? 'Continuer' : 'Revenir au cours') : 'Marquer comme terminé'}
            {next ? <ArrowRight size={16} /> : <Check size={16} />}
          </button>
        </div>

        {/* prev / next */}
        <nav className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {prev ? (
            <Link to={`/lessons/${prev.slug}`} className="group flex min-w-0 items-center gap-3 rounded-xl border border-outline-variant px-4 py-3 transition-colors hover:bg-surface-container-low">
              <ArrowLeft size={16} className="shrink-0 text-surface-variant" />
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Précédent</span><span className="block truncate text-sm font-medium">{prev.title}</span></span>
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/lessons/${next.slug}`} className="group flex min-w-0 items-center justify-end gap-3 rounded-xl border border-outline-variant px-4 py-3 text-right transition-colors hover:bg-surface-container-low">
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Suivant</span><span className="block truncate text-sm font-medium">{next.title}</span></span>
              <ArrowRight size={16} className="shrink-0 text-surface-variant" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
