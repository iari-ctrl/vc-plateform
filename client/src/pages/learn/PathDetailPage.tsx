import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock, Users, Target } from 'lucide-react';
import { pathBySlug } from '@/content/paths';
import { coursesForPath } from '@/content/courses';
import { lessonsForCourse, lessonsForPath } from '@/content/lessons';
import { LEVEL_LABEL } from '@/content/labels';
import { LessonRow } from '@/components/cards';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { ProgressBar, LevelBadge } from '@/components/ui/primitives';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';
import NotFoundPage from '@/pages/system/NotFoundPage';

export default function PathDetailPage() {
  const { slug } = useParams();
  const path = slug ? pathBySlug(slug) : undefined;
  const { progress } = useUserData();
  usePageMeta(path?.title, path?.summary);

  const [collapsedCourses, setCollapsedCourses] = useState<Record<string, boolean>>({});

  const toggleCourse = (courseId: string) => {
    setCollapsedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (!path) return <NotFoundPage />;

  const courses = coursesForPath(path.id);
  const allLessons = lessonsForPath(path.id);
  const done = allLessons.filter((l) => progress[l.id]?.status === 'done').length;
  const pct = allLessons.length ? Math.round((done / allLessons.length) * 100) : 0;
  const firstLesson = allLessons[0];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-outline-variant" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${path.accent} 8%, transparent), transparent)` }}>
        <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/bibliotheque" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Toute la bibliothèque</Link>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <KanjiSeal kanji={path.kanji ?? '◆'} accent={path.accent} size={64} />
                <div>
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant">Rayon · {String(path.order).padStart(2, '0')}</p>
                  <LevelBadge level={path.level} accent={path.accent} />
                </div>
              </div>
              <h1 className="mt-5 font-headline text-display-md font-semibold leading-[1.05] tracking-tight text-balance">{path.title}</h1>
              <p className="mt-2 font-headline text-headline-sm italic text-surface-variant">{path.subtitle}</p>
              <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-surface-variant text-pretty">{path.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-surface-variant">
                <span className="inline-flex items-center gap-1.5"><Clock size={15} /> ≈ {path.durationHours} h</span>
                <span className="inline-flex items-center gap-1.5"><Target size={15} /> {courses.length} cours · {allLessons.length} leçons</span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {firstLesson && (
                  <Link to={`/lessons/${firstLesson.slug}`} className="btn-foil">
                    {pct > 0 ? 'Reprendre le rayon' : 'Commencer le rayon'}
                  </Link>
                )}
                <BookmarkButton variant="labelled" item={{ itemType: 'path', itemId: path.id, title: path.title, href: `/paths/${path.slug}` }} />
              </div>
            </div>

            <div className="space-y-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
              {pct > 0 && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">Votre progression</span>
                    <span className="text-surface-variant">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} accent={path.accent} />
                </div>
              )}
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2"><Users size={13} /> Pour qui</p>
                <div className="flex flex-wrap gap-2">
                  {path.forWhom.map((w) => <span key={w} className="chip">{w}</span>)}
                </div>
              </div>
              <div>
                <p className="eyebrow mb-3">Ce que vous saurez faire</p>
                <ul className="space-y-2">
                  {path.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-surface-variant">
                      <Check size={15} className="mt-0.5 shrink-0" style={{ color: path.accent }} />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses & lessons */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {courses.map((course, ci) => {
            const lessons = lessonsForCourse(course.id);
            const isCollapsed = collapsedCourses[course.id];
            return (
              <div key={course.id} className="border-b border-outline-variant/30 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggleCourse(course.id)}
                    className="flex-1 text-left group cursor-pointer select-none focus:outline-none"
                    aria-expanded={!isCollapsed}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Cours {ci + 1} · {LEVEL_LABEL[course.level]}</p>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "text-surface-variant transition-transform duration-300 group-hover:text-foreground",
                          isCollapsed && "-rotate-90"
                        )}
                      />
                    </div>
                    <h3 className="font-headline text-headline-md font-semibold transition-colors group-hover:text-[color:var(--primary)] mt-1">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm text-surface-variant leading-relaxed">{course.subtitle}</p>
                  </button>
                  <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                    <span className="text-xs text-surface-variant">{course.durationMin} min</span>
                    <Link
                      to={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--primary)] hover:underline"
                    >
                      Ouvrir <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none mt-0" : "grid-rows-[1fr] opacity-100 mt-4"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-2xl border border-outline-variant bg-surface-container-low/40 p-2">
                      {lessons.map((l) => (
                        <LessonRow
                          key={l.id}
                          slug={l.slug}
                          order={l.order}
                          title={l.title}
                          kicker={l.kicker}
                          readMin={l.readMin}
                          summary={l.summary}
                          done={progress[l.id]?.status === 'done'}
                          reading={progress[l.id]?.status === 'reading'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
