import { useParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { courseBySlug, lessonsForCourse, LEVEL_LABEL } from '@/content';
import type { Course } from '@/content/types';
import { parcoursById, parcoursForCourse, t } from '@/content/parcours';
import { LessonRow } from '@/components/cards';
import { ProgressBar, PageLoader } from '@/components/ui/primitives';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useApiItem } from '@/hooks/useApiData';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from './NotFoundPage';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { item: course, pending } = useApiItem<Course>(
    slug ? `/content/courses/${slug}` : null,
    slug ? courseBySlug(slug) : undefined
  );
  const { progress } = useUserData();
  usePageMeta(course?.title, course?.summary, { image: 'course' });

  if (pending) return <PageLoader />;
  if (!course) return <NotFoundPage />;

  const lessons = lessonsForCourse(course.id);
  const parcours = parcoursById(course.pathId) ?? parcoursForCourse(course.id, lessons.map((l) => l.id))[0];
  const done = lessons.filter((l) => progress[l.id]?.status === 'done').length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const accent = parcours?.accent ?? 'var(--primary)';

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {parcours ? (
        <Link to={`/paths/${parcours.slug}`} className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> {t(parcours.title)}</Link>
      ) : (
        <Link to="/bibliotheque" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Bibliothèque</Link>
      )}

      <div className="flex items-center gap-2">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant">Cours · {LEVEL_LABEL[course.level]}</span>
      </div>
      <h1 className="mt-2 font-headline text-display-sm font-semibold leading-tight tracking-tight text-balance">{course.title}</h1>
      <p className="mt-2 font-headline text-headline-sm italic text-surface-variant">{course.subtitle}</p>
      <p className="mt-4 text-[1.0625rem] leading-relaxed text-surface-variant text-pretty">{course.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><BookOpen size={15} /> {lessons.length} leçons</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {course.durationMin} min</span>
        <div className="ml-auto"><BookmarkButton item={{ itemType: 'course', itemId: course.id, title: course.title, href: `/courses/${course.slug}` }} /></div>
      </div>

      {course.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {course.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
      )}

      {pct > 0 && <ProgressBar value={pct} accent={accent} className="mt-6" />}

      <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-2">
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

      {lessons[0] && (
        <div className="mt-8">
          <Link to={`/lessons/${lessons[0].slug}`} className="btn-foil">{pct > 0 ? 'Continuer' : 'Commencer le cours'}</Link>
        </div>
      )}
    </div>
  );
}
