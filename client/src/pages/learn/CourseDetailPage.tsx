import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, Clock, Library, Route } from 'lucide-react';
import { certificationsForCourse, courseBySlug, lessonsForCourse, LEVEL_LABEL, pathsForCourse } from '@/content';
import { parcoursForCourse } from '@/content/parcours';
import { LessonRow } from '@/components/cards';
import { ProgressBar } from '@/components/ui/primitives';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const course = slug ? courseBySlug(slug) : undefined;
  const { progress } = useUserData();
  usePageMeta(course?.title, course?.summary);

  if (!course) return <NotFoundPage />;

  const lessons = lessonsForCourse(course.id);
  const publishedLessons = lessons.filter((lesson) => lesson.status !== 'upcoming');
  const professionalPaths = parcoursForCourse(course.id, lessons.map((l) => l.id));
  const cataloguePaths = pathsForCourse(course.id);
  const certifications = certificationsForCourse(course.id).filter((certification) => certification.status === 'published');
  const done = publishedLessons.filter((l) => progress[l.id]?.status === 'done').length;
  const pct = publishedLessons.length ? Math.round((done / publishedLessons.length) * 100) : 0;
  const accent = professionalPaths[0]?.accent ?? cataloguePaths[0]?.accent ?? 'var(--primary)';
  const backLink = cataloguePaths[0]
    ? { href: `/bibliotheque/${cataloguePaths[0].slug}`, label: cataloguePaths[0].title }
    : certifications[0]
      ? { href: `/certifications/${certifications[0].slug}`, label: certifications[0].shortTitle }
      : professionalPaths[0]
        ? { href: `/parcours/${professionalPaths[0].slug}`, label: professionalPaths[0].title }
        : { href: '/bibliotheque', label: 'Bibliothèque' };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={backLink.href} className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> {backLink.label}</Link>

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
          {course.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      )}

      {(cataloguePaths.length > 0 || professionalPaths.length > 0 || certifications.length > 0) && (
        <aside className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-5" aria-labelledby="course-catalogue-relations">
          <p id="course-catalogue-relations" className="eyebrow">Parcours et certifications associés</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {cataloguePaths.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-variant">
                  <Library size={14} aria-hidden /> Rayons du catalogue
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cataloguePaths.map((cataloguePath) => (
                    <Link key={cataloguePath.id} to={`/bibliotheque/${cataloguePath.slug}`} className="chip transition-colors hover:border-[color:var(--primary)] hover:text-foreground">
                      {cataloguePath.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {professionalPaths.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-variant">
                  <Route size={14} aria-hidden /> Parcours professionnels
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {professionalPaths.map((professionalPath) => (
                    <Link key={professionalPath.id} to={`/parcours/${professionalPath.slug}`} className="chip transition-colors hover:border-[color:var(--primary)] hover:text-foreground">
                      {professionalPath.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {certifications.length > 0 && (
              <div className="sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-variant">
                  <Award size={14} aria-hidden /> Certifications
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {certifications.map((certification) => (
                    <Link key={certification.id} to={`/certifications/${certification.slug}`} className="chip transition-colors hover:border-[color:var(--primary)] hover:text-foreground">
                      {certification.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
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
            upcoming={l.status === 'upcoming'}
          />
        ))}
      </div>

      {publishedLessons[0] && (
        <div className="mt-8">
          <Link to={`/lessons/${publishedLessons[0].slug}`} className="btn-foil">{pct > 0 ? 'Continuer' : 'Commencer le cours'}</Link>
        </div>
      )}
    </div>
  );
}
