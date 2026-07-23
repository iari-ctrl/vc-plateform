import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Briefcase, Clock, GraduationCap, Library, Search } from 'lucide-react';
import { courseById, COURSES } from '@/content/courses';
import { courseReadingMinutes } from '@/content/learningTime';
import { LESSONS } from '@/content/lessons';
import { certificationsForCourse } from '@/content/certifications';
import { CASE_STUDIES } from '@/content/caseStudies';
import {
  FAMILY_META,
  parcoursForCourse,
  parcoursForLesson,
  parcoursForCase,
  type Parcours,
  type ParcoursFamily,
} from '@/content/parcours';
import type { Certification } from '@/content/certificationTypes';
import type { CaseStudy, Course, LessonIndexEntry, Level } from '@/content/types';
import { SectionHeading, Reveal, LevelBadge, EmptyState } from '@/components/ui/primitives';
import { CompassRose } from '@/components/ornaments/Illustrations';
import { usePageMeta } from '@/lib/seo';

type ItemType = 'all' | 'course' | 'lesson' | 'case';
type DurationFilter = 'all' | 'short' | 'medium' | 'long';

interface LibraryItem {
  id: string;
  type: 'course' | 'lesson' | 'case';
  title: string;
  subtitle: string;
  href: string;
  level: Level;
  durationMin: number;
  tags: string[];
  parcours: Parcours[];
  certifications: Certification[];
  courseTitle?: string;
}

const TYPE_FILTERS: { id: ItemType; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'course', label: 'Cours' },
  { id: 'lesson', label: 'Leçons' },
  { id: 'case', label: 'Études de cas' },
];

const LEVEL_FILTERS: { id: 'all' | Level; label: string }[] = [
  { id: 'all', label: 'Tous niveaux' },
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Intermédiaire' },
  { id: 'avance', label: 'Avancé' },
];

const DURATION_FILTERS: { id: DurationFilter; label: string }[] = [
  { id: 'all', label: 'Toutes durées' },
  { id: 'short', label: '≤ 10 min' },
  { id: 'medium', label: '11-45 min' },
  { id: 'long', label: '> 45 min' },
];

const FAMILY_OPTIONS: { id: 'all' | ParcoursFamily; label: string }[] = [
  { id: 'all', label: 'Toutes familles' },
  ...Object.entries(FAMILY_META).map(([id, meta]) => ({ id: id as ParcoursFamily, label: meta.label })),
];

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const uniqueParcours = (items: Parcours[]) =>
  items.filter((parcours, index, all) => all.findIndex((candidate) => candidate.id === parcours.id) === index);

function durationMatches(minutes: number, filter: DurationFilter) {
  if (filter === 'all') return true;
  if (filter === 'short') return minutes <= 10;
  if (filter === 'medium') return minutes > 10 && minutes <= 45;
  return minutes > 45;
}

function courseParcours(course: Course) {
  return uniqueParcours(parcoursForCourse(course.id, course.lessonIds));
}

function courseToItem(course: Course): LibraryItem {
  return {
    id: course.id,
    type: 'course',
    title: course.title,
    subtitle: course.summary,
    href: `/courses/${course.slug}`,
    level: course.level,
    durationMin: courseReadingMinutes(course),
    tags: course.tags,
    parcours: courseParcours(course),
    certifications: certificationsForCourse(course.id).filter((certification) => certification.status === 'published'),
  };
}

function lessonToItem(lesson: LessonIndexEntry): LibraryItem {
  const course = courseById(lesson.courseId);
  return {
    id: lesson.id,
    type: 'lesson',
    title: lesson.title,
    subtitle: lesson.summary,
    href: `/lessons/${lesson.slug}`,
    level: lesson.level ?? course?.level ?? 'tous',
    durationMin: lesson.readMin,
    tags: Array.from(new Set([...(course?.tags ?? []), ...lesson.glossaryRefs])),
    parcours: parcoursForLesson(lesson.id),
    certifications: [],
    courseTitle: course?.title,
  };
}

function caseToItem(caseStudy: CaseStudy): LibraryItem {
  return {
    id: caseStudy.id,
    type: 'case',
    title: caseStudy.title,
    subtitle: caseStudy.subtitle,
    href: `/cases/${caseStudy.slug}`,
    level: 'tous',
    durationMin: caseStudy.readMin,
    tags: caseStudy.tags,
    parcours: parcoursForCase(caseStudy.id),
    certifications: [],
  };
}

function ParcoursBadges({ parcours }: { parcours: Parcours[] }) {
  if (!parcours.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {parcours.slice(0, 3).map((item) => <span key={item.id} className="chip">{item.title}</span>)}
      {parcours.length > 3 && <span className="chip">+{parcours.length - 3}</span>}
    </div>
  );
}

function CertificationBadges({ certifications }: { certifications: Certification[] }) {
  if (!certifications.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {certifications.slice(0, 2).map((certification) => (
        <span key={certification.id} className="chip inline-flex items-center gap-1.5">
          <Award size={11} aria-hidden />
          {certification.shortTitle}
        </span>
      ))}
      {certifications.length > 2 && <span className="chip">+{certifications.length - 2}</span>}
    </div>
  );
}

function CaseLibraryCard({ item }: { item: LibraryItem }) {
  const accent = item.parcours[0]?.accent ?? 'var(--primary)';
  return (
    <Link
      to={item.href}
      className="premium-card premium-card-hover group flex h-full flex-col p-5"
      style={{ borderTopColor: `color-mix(in srgb, ${accent} 50%, transparent)`, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Étude de cas</span>
        <span className="font-mono text-[0.625rem] text-surface-variant">{item.tags[0] ?? ''}</span>
      </div>
      <h3 className="mt-3 font-headline text-headline-sm font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{item.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{item.subtitle}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {item.durationMin} min</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)]">Ouvrir <ArrowRight size={13} /></span>
      </div>
      <ParcoursBadges parcours={item.parcours} />
      <CertificationBadges certifications={item.certifications} />
    </Link>
  );
}

function CourseLibraryCard({ item }: { item: LibraryItem }) {
  const accent = item.parcours[0]?.accent ?? 'var(--primary)';
  return (
    <Link
      to={item.href}
      className="premium-card premium-card-hover group flex h-full flex-col p-5"
      style={{ borderTopColor: `color-mix(in srgb, ${accent} 50%, transparent)`, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Cours</span>
        <LevelBadge level={item.level} accent={accent} />
      </div>
      <h3 className="mt-3 font-headline text-headline-sm font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{item.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{item.subtitle}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {item.durationMin} min</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)]">Ouvrir <ArrowRight size={13} /></span>
      </div>
      <ParcoursBadges parcours={item.parcours} />
      <CertificationBadges certifications={item.certifications} />
    </Link>
  );
}

function LessonLibraryRow({ item }: { item: LibraryItem }) {
  const accent = item.parcours[0]?.accent ?? 'var(--primary)';
  return (
    <Link to={item.href} className="group block rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-4 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Leçon</span>
            <span className="text-xs text-surface-variant">{item.courseTitle}</span>
          </div>
          <h3 className="mt-1 font-medium leading-snug transition-colors group-hover:text-[color:var(--primary)]">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-surface-variant">{item.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-surface-variant">
          <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {item.durationMin} min</span>
          <LevelBadge level={item.level} accent={accent} />
        </div>
      </div>
      <ParcoursBadges parcours={item.parcours} />
    </Link>
  );
}

export default function LibraryPage() {
  usePageMeta(
    'Bibliothèque · ressources de formation',
    'Inventaire filtrable des cours, leçons et études de cas disponibles sur la plateforme.',
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const courseItems = useMemo(() => COURSES.map(courseToItem), []);
  const lessonItems = useMemo(
    () => LESSONS.filter((lesson) => lesson.status === 'published').map(lessonToItem),
    [],
  );
  const caseItems = useMemo(() => CASE_STUDIES.map(caseToItem), []);
  const tags = useMemo(() => {
    const all = [...courseItems, ...lessonItems, ...caseItems].flatMap((item) => item.tags);
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [courseItems, lessonItems, caseItems]);

  const rawType = searchParams.get('type');
  const rawLevel = searchParams.get('level');
  const rawFamily = searchParams.get('family');
  const rawDuration = searchParams.get('duration');
  const rawTag = searchParams.get('tag');
  const query = searchParams.get('q') ?? '';
  const type = TYPE_FILTERS.some((filter) => filter.id === rawType) ? rawType as ItemType : 'all';
  const level = LEVEL_FILTERS.some((filter) => filter.id === rawLevel) ? rawLevel as 'all' | Level : 'all';
  const family = FAMILY_OPTIONS.some((option) => option.id === rawFamily) ? rawFamily as 'all' | ParcoursFamily : 'all';
  const duration = DURATION_FILTERS.some((filter) => filter.id === rawDuration) ? rawDuration as DurationFilter : 'all';
  const tag = rawTag && tags.includes(rawTag) ? rawTag : 'all';

  const updateFilter = (
    key: string,
    value: string,
    { defaultValue = 'all', replace = false }: { defaultValue?: string; replace?: boolean } = {},
  ) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!value || value === defaultValue) next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace });
  };

  const matches = (item: LibraryItem) => {
    const normalizedQuery = normalize(query.trim());
    const haystack = normalize([
      item.title,
      item.subtitle,
      item.courseTitle,
      item.tags.join(' '),
      item.parcours.map((parcours) => parcours.title).join(' '),
      item.certifications.map((certification) => certification.title).join(' '),
    ].filter(Boolean).join(' '));
    return (
      (!normalizedQuery || haystack.includes(normalizedQuery))
      && (type === 'all' || item.type === type)
      && (level === 'all' || item.level === level || item.level === 'tous')
      && (family === 'all' || item.parcours.some((parcours) => parcours.family === family))
      && durationMatches(item.durationMin, duration)
      && (tag === 'all' || item.tags.includes(tag))
    );
  };

  const courses = courseItems.filter(matches);
  const lessons = lessonItems.filter(matches);
  const cases = caseItems.filter(matches);
  const total = courses.length + lessons.length + cases.length;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <section>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Bibliothèque"
              title={<>Ressources de <span className="ink-underline">formation</span></>}
              description="La Bibliothèque réunit les cours, les leçons et les études de cas. Les filtres permettent de les retrouver par niveau, famille de parcours, durée ou thème."
            />
            <div className="flex shrink-0 items-center gap-4">
              <CompassRose size={88} className="hidden opacity-90 sm:block" />
              <Link to="/parcours" className="btn-quiet">Voir les parcours <ArrowRight size={15} /></Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal delay={80}>
        <section className="mt-10 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-4 sm:p-5" aria-label="Filtres de bibliothèque">
          <p className="eyebrow mb-4">Filtrer les ressources</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4">
              <Search size={16} className="shrink-0 text-surface-variant" aria-hidden />
              <span className="sr-only">Rechercher dans la bibliothèque</span>
              <input
                name="library-search"
                value={query}
                onChange={(event) => updateFilter('q', event.target.value, { defaultValue: '', replace: true })}
                type="search"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-surface-variant"
                placeholder="Rechercher un cours, une leçon, un thème..."
              />
            </label>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Type de contenu">
              {TYPE_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => updateFilter('type', filter.id)}
                  aria-pressed={type === filter.id}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                    type === filter.id
                      ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
                      : 'border-outline-variant text-surface-variant hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-surface-variant">
              Niveau
              <select name="library-level" value={level} onChange={(event) => updateFilter('level', event.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                {LEVEL_FILTERS.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-surface-variant">
              Famille de parcours
              <select name="library-family" value={family} onChange={(event) => updateFilter('family', event.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                {FAMILY_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-surface-variant">
              Durée
              <select name="library-duration" value={duration} onChange={(event) => updateFilter('duration', event.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                {DURATION_FILTERS.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-surface-variant">
              Thème
              <select name="library-tag" value={tag} onChange={(event) => updateFilter('tag', event.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                <option value="all">Tous thèmes</option>
                {tags.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
        </section>
      </Reveal>

      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><Library size={15} /> {total} contenu{total > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><GraduationCap size={15} /> {courses.length} cours</span>
        <span className="inline-flex items-center gap-1.5"><BookOpen size={15} /> {lessons.length} leçon{lessons.length > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><Briefcase size={15} /> {cases.length} étude{cases.length > 1 ? 's' : ''} de cas</span>
      </div>

      {total === 0 ? (
        <div className="mt-12">
          <EmptyState icon={<Search size={26} />} title="Aucun contenu trouvé" description="Essayez un autre thème, niveau ou mot-clé." />
        </div>
      ) : (
        <>
          {courses.length > 0 && (
            <section className="mt-12 border-b border-outline-variant/30 pb-10">
              <Reveal>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="font-headline text-headline-lg font-semibold">Cours</h2>
                  <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-xs text-surface-variant">{courses.length}</span>
                </div>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 3) * 60}>
                    <CourseLibraryCard item={item} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {lessons.length > 0 && (
            <section className="mt-12 border-b border-outline-variant/30 pb-10">
              <Reveal>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="font-headline text-headline-lg font-semibold">Leçons</h2>
                  <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-xs text-surface-variant">{lessons.length}</span>
                </div>
              </Reveal>
              <div className="space-y-3">
                {lessons.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 6) * 35}>
                    <LessonLibraryRow item={item} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {cases.length > 0 && (
            <section className="mt-12">
              <Reveal>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="font-headline text-headline-lg font-semibold">Études de cas</h2>
                  <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-xs text-surface-variant">{cases.length}</span>
                </div>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cases.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 3) * 60}>
                    <CaseLibraryCard item={item} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
