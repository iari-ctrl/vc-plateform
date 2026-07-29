import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, Clock, FileCheck2, Route } from 'lucide-react';
import { certificationsForCourse, courseBySlug, deliverableById, lessonsForCourse, LEVEL_LABEL } from '@/content';
import { courseReadingMinutes, formatMinutes } from '@/content/learningTime';
import { parcoursContextHref, parcoursForCourse, type TimeBudget } from '@/content/parcours';
import { LessonRow } from '@/components/cards';
import { ProgressBar } from '@/components/ui/primitives';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useUserData } from '@/context/UserDataContext';
import { useResourcePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const course = slug ? courseBySlug(slug) : undefined;
  const { progress } = useUserData();
  useResourcePageMeta(Boolean(course), course?.title, course?.summary);

  if (!course) return <NotFoundPage />;

  const lessons = lessonsForCourse(course.id);
  const publishedLessons = lessons.filter((lesson) => lesson.status === 'published');
  const associatedParcours = parcoursForCourse(course.id, lessons.map((l) => l.id));
  const requestedParcoursId = searchParams.get('parcours');
  const activeParcours = requestedParcoursId
    ? associatedParcours.find((parcours) => parcours.id === requestedParcoursId)
    : undefined;
  const requestedBudget = searchParams.get('budget');
  const activeBudget = activeParcours
    && (requestedBudget === 'low' || requestedBudget === 'medium' || requestedBudget === 'high')
    && activeParcours.timeFit.includes(requestedBudget)
    ? requestedBudget as TimeBudget
    : undefined;
  const certifications = certificationsForCourse(course.id).filter((certification) => certification.status === 'published');
  const done = publishedLessons.filter((l) => progress[l.id]?.status === 'done').length;
  const pct = publishedLessons.length ? Math.round((done / publishedLessons.length) * 100) : 0;
  const accent = activeParcours?.accent ?? associatedParcours[0]?.accent ?? 'var(--primary)';
  const readingMinutes = courseReadingMinutes(course);
  const practiceMinutes = publishedLessons.reduce((sum, lesson) => sum + (lesson.practice?.estimatedMinutes ?? 0), 0);
  const practiceDeliverables = Array.from(new Set(publishedLessons.map((lesson) => lesson.practice?.deliverableId).filter((id): id is string => Boolean(id))))
    .map(deliverableById)
    .filter((deliverable): deliverable is NonNullable<typeof deliverable> => Boolean(deliverable));
  const backLink = activeParcours
    ? { href: `/parcours/${activeParcours.slug}${activeBudget ? `?budget=${activeBudget}` : ''}`, label: activeParcours.title }
    : certifications[0]
      ? { href: `/certifications/${certifications[0].slug}`, label: certifications[0].shortTitle }
      : associatedParcours[0]
        ? { href: `/parcours/${associatedParcours[0].slug}`, label: associatedParcours[0].title }
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
        <span className="inline-flex items-center gap-1.5"><Clock size={15} aria-hidden /> {readingMinutes} min de lecture</span>
        {practiceMinutes > 0 && <span className="inline-flex items-center gap-1.5"><FileCheck2 size={15} aria-hidden /> {formatMinutes(practiceMinutes)} de contributions guidées</span>}
        <div className="ml-auto"><BookmarkButton item={{ itemType: 'course', itemId: course.id, title: course.title, href: `/courses/${course.slug}` }} /></div>
      </div>

      {course.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {course.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      )}

      {(associatedParcours.length > 0 || certifications.length > 0) && (
        <aside className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-5" aria-labelledby="course-catalogue-relations">
          <p id="course-catalogue-relations" className="eyebrow">Parcours et certifications associés</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {associatedParcours.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-variant">
                  <Route size={14} aria-hidden /> Parcours associés
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {associatedParcours.map((parcours) => (
                    <Link key={parcours.id} to={`/parcours/${parcours.slug}`} className="chip transition-colors hover:border-[color:var(--primary)] hover:text-foreground">
                      {parcours.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {certifications.length > 0 && (
              <div>
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

      {pct > 0 && <ProgressBar value={pct} accent={accent} className="mt-6" label="Leçons déclarées lues dans ce cours" />}

      {practiceDeliverables.length > 0 && (
        <aside className="mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-5" aria-labelledby="course-production-title">
          <p id="course-production-title" className="eyebrow">Production longitudinale</p>
          <p className="mt-2 text-sm leading-relaxed text-surface-variant">Les contributions de ce cours alimentent une production réutilisée dans le jalon final.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {practiceDeliverables.map((deliverable) => <Link key={deliverable.id} to={`/livrables/${deliverable.slug}`} className="btn-ghost">{deliverable.title}</Link>)}
          </div>
        </aside>
      )}

      <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-2">
        {lessons.map((l) => (
          <LessonRow
            key={l.id}
            slug={l.slug}
            href={activeParcours ? parcoursContextHref(`/lessons/${l.slug}`, activeParcours.id, activeBudget) : undefined}
            order={l.order}
            title={l.title}
            kicker={l.kicker}
            readMin={l.readMin}
            practiceMin={l.practice?.estimatedMinutes}
            summary={l.summary}
            done={progress[l.id]?.status === 'done'}
            reading={progress[l.id]?.status === 'reading'}
            upcoming={l.status === 'upcoming'}
          />
        ))}
      </div>

      {publishedLessons[0] && (
        <div className="mt-8">
          <Link to={activeParcours ? parcoursContextHref(`/lessons/${publishedLessons[0].slug}`, activeParcours.id, activeBudget) : `/lessons/${publishedLessons[0].slug}`} className="btn-foil">{pct > 0 ? 'Continuer' : 'Commencer le cours'}</Link>
        </div>
      )}
    </div>
  );
}
