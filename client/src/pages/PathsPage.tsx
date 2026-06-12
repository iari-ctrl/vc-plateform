import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, ChevronDown, Clock, GraduationCap, Library, Route, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { COURSES, courseById } from '@/content/courses';
import { LESSONS } from '@/content/lessons';
import { CASE_STUDIES } from '@/content/caseStudies';
import {
  FAMILY_META,
  parcoursById,
  parcoursForCourse,
  parcoursForLesson,
  parcoursForCase,
  t,
  type Parcours,
  type ParcoursFamily,
} from '@/content/parcours';
import { cn } from '@/lib/utils';
import type { Course, Level } from '@/content/types';
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
  courseTitle?: string;
}

const TYPE_FILTERS: { id: ItemType; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'course', label: 'Cours' },
  { id: 'lesson', label: 'Lectures' },
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

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const uniqueParcours = (items: Parcours[]) =>
  items.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

function durationMatches(minutes: number, filter: DurationFilter) {
  if (filter === 'all') return true;
  if (filter === 'short') return minutes <= 10;
  if (filter === 'medium') return minutes > 10 && minutes <= 45;
  return minutes > 45;
}

function courseParcours(course: Course) {
  return uniqueParcours([
    ...(parcoursById(course.pathId) ? [parcoursById(course.pathId)!] : []),
    ...parcoursForCourse(course.id, course.lessonIds),
  ]);
}

function buildLibraryItems(): LibraryItem[] {
  const courseItems = COURSES.flatMap((course): LibraryItem[] => {
    const parcours = courseParcours(course);
    if (!parcours.length) return [];
    return [{
      id: course.id,
      type: 'course',
      title: course.title,
      subtitle: course.summary,
      href: `/courses/${course.slug}`,
      level: course.level,
      durationMin: course.durationMin,
      tags: course.tags,
      parcours,
    }];
  });

  const lessonItems = LESSONS.flatMap((lesson): LibraryItem[] => {
    const course = courseById(lesson.courseId);
    const parcours = parcoursForLesson(lesson.id);
    if (!parcours.length) return [];
    return [{
      id: lesson.id,
      type: 'lesson',
      title: lesson.title,
      subtitle: lesson.summary,
      href: `/lessons/${lesson.slug}`,
      level: course?.level ?? 'tous',
      durationMin: lesson.readMin,
      tags: Array.from(new Set([...(course?.tags ?? []), ...lesson.glossaryRefs])),
      parcours,
      courseTitle: course?.title,
    }];
  });

  const caseItems = CASE_STUDIES.flatMap((cs): LibraryItem[] => {
    const parcours = parcoursForCase(cs.id);
    return [{
      id: cs.id,
      type: 'case',
      title: cs.title,
      subtitle: cs.subtitle,
      href: `/cases/${cs.slug}`,
      level: 'tous',
      durationMin: cs.readMin,
      tags: cs.tags,
      parcours,
    }];
  });

  return [...courseItems, ...lessonItems, ...caseItems];
}

function ParcoursBadges({ parcours }: { parcours: Parcours[] }) {
  if (!parcours.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {parcours.slice(0, 3).map((p) => (
        <span key={p.id} className="chip">
          {t(p.title)}
        </span>
      ))}
      {parcours.length > 3 && <span className="chip">+{parcours.length - 3}</span>}
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
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Lecture</span>
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

export default function PathsPage() {
  usePageMeta(
    'Bibliothèque · cours et lectures',
    'Le catalogue des cours, lectures et études de cas qui composent les parcours VC Premium. Les simulateurs restent dans leur espace dédié.',
    { image: 'course' },
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const type = (searchParams.get('type') as ItemType) || 'all';

  const allItems = useMemo(() => buildLibraryItems(), []);
  const tags = useMemo(() => Array.from(new Set(allItems.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b, 'fr')), [allItems]);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<'all' | Level>('all');
  const [family, setFamily] = useState<'all' | ParcoursFamily>('all');
  const [duration, setDuration] = useState<DurationFilter>('all');
  const [tag, setTag] = useState('all');

  const [coursesCollapsed, setCoursesCollapsed] = useState(false);
  const [lessonsCollapsed, setLessonsCollapsed] = useState(false);
  const [casesCollapsed, setCasesCollapsed] = useState(false);

  const handleTypeChange = (newType: ItemType) => {
    setSearchParams((prev) => {
      if (newType === 'all') {
        prev.delete('type');
      } else {
        prev.set('type', newType);
      }
      return prev;
    });
  };

  const filtered = allItems.filter((item) => {
    const q = normalize(query.trim());
    const haystack = normalize([item.title, item.subtitle, item.courseTitle, item.tags.join(' '), item.parcours.map((p) => t(p.title)).join(' ')].filter(Boolean).join(' '));
    return (
      (!q || haystack.includes(q)) &&
      (type === 'all' || item.type === type) &&
      (level === 'all' || item.level === level || item.level === 'tous') &&
      (family === 'all' || item.parcours.some((p) => p.family === family)) &&
      durationMatches(item.durationMin, duration) &&
      (tag === 'all' || item.tags.includes(tag))
    );
  });

  const courses = filtered.filter((item) => item.type === 'course');
  const lessons = filtered.filter((item) => item.type === 'lesson');
  const cases = filtered.filter((item) => item.type === 'case');

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <section>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Bibliothèque · matière première"
              title={<>Cours, lectures et <span className="ink-underline">études de cas</span></>}
              description="Le catalogue des contenus qui composent les parcours : cours structurants, lectures courtes, frameworks et études de cas. Les simulateurs restent dans leur atelier dédié."
            />
            <div className="flex shrink-0 items-center gap-4">
              <CompassRose size={88} className="hidden opacity-90 sm:block" />
              <Link to="/paths" className="btn-quiet">Voir les parcours <ArrowRight size={15} /></Link>
            </div>
          </div>
        </Reveal>
      </section>
 
      <Reveal delay={80}>
        <section className="mt-10 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-4 sm:p-5" aria-label="Filtres de bibliothèque">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4">
              <Search size={16} className="shrink-0 text-surface-variant" aria-hidden />
              <span className="sr-only">Rechercher dans la bibliothèque</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-surface-variant"
                placeholder="Rechercher un cours, une lecture, un thème..."
              />
            </label>
 
            <div className="flex flex-wrap gap-2" role="group" aria-label="Type de contenu">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleTypeChange(f.id)}
                  aria-pressed={type === f.id}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                    type === f.id
                      ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
                      : 'border-outline-variant text-surface-variant hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-surface-variant">
              Niveau
              <select value={level} onChange={(e) => setLevel(e.target.value as 'all' | Level)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                {LEVEL_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-surface-variant">
              Famille
              <select value={family} onChange={(e) => setFamily(e.target.value as 'all' | ParcoursFamily)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                {FAMILY_OPTIONS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-surface-variant">
              Durée
              <select value={duration} onChange={(e) => setDuration(e.target.value as DurationFilter)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                {DURATION_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-surface-variant">
              Thème
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-foreground outline-none">
                <option value="all">Tous thèmes</option>
                {tags.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
        </section>
      </Reveal>

      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><Library size={15} /> {filtered.length} contenu{filtered.length > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><GraduationCap size={15} /> {courses.length} cours</span>
        <span className="inline-flex items-center gap-1.5"><BookOpen size={15} /> {lessons.length} lecture{lessons.length > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><Briefcase size={15} /> {cases.length} étude{cases.length > 1 ? 's' : ''} de cas</span>
        <span className="inline-flex items-center gap-1.5"><Route size={15} /> rattachés aux parcours</span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12">
          <EmptyState icon={<Search size={26} />} title="Aucun contenu trouvé" description="Essayez un autre thème, niveau ou mot-clé." />
        </div>
      ) : (
        <>
          {courses.length > 0 && (
            <section className="mt-10">
              <Reveal>
                <button
                  type="button"
                  onClick={() => setCoursesCollapsed(!coursesCollapsed)}
                  className="mb-5 flex items-center gap-3 text-left font-headline text-headline-lg font-semibold group cursor-pointer focus:outline-none select-none"
                  aria-expanded={!coursesCollapsed}
                >
                  <h2>Cours</h2>
                  <span className="font-mono text-xs text-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{courses.length}</span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "text-surface-variant transition-transform duration-300 group-hover:text-foreground",
                      coursesCollapsed && "-rotate-90"
                    )}
                  />
                </button>
              </Reveal>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  coursesCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none" : "grid-rows-[1fr] opacity-100"
                )}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-1 pb-1">
                    {courses.map((item, i) => (
                      <Reveal key={item.id} delay={(i % 3) * 60}>
                        <CourseLibraryCard item={item} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {lessons.length > 0 && (
            <section className="mt-12">
              <Reveal>
                <button
                  type="button"
                  onClick={() => setLessonsCollapsed(!lessonsCollapsed)}
                  className="mb-5 flex items-center gap-3 text-left font-headline text-headline-lg font-semibold group cursor-pointer focus:outline-none select-none"
                  aria-expanded={!lessonsCollapsed}
                >
                  <h2>Lectures</h2>
                  <span className="font-mono text-xs text-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{lessons.length}</span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "text-surface-variant transition-transform duration-300 group-hover:text-foreground",
                      lessonsCollapsed && "-rotate-90"
                    )}
                  />
                </button>
              </Reveal>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  lessonsCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none" : "grid-rows-[1fr] opacity-100"
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 pt-1 pb-1">
                    {lessons.map((item, i) => (
                      <Reveal key={item.id} delay={(i % 6) * 35}>
                        <LessonLibraryRow item={item} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {cases.length > 0 && (
            <section className="mt-12">
              <Reveal>
                <button
                  type="button"
                  onClick={() => setCasesCollapsed(!casesCollapsed)}
                  className="mb-5 flex items-center gap-3 text-left font-headline text-headline-lg font-semibold group cursor-pointer focus:outline-none select-none"
                  aria-expanded={!casesCollapsed}
                >
                  <h2>Études de cas</h2>
                  <span className="font-mono text-xs text-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{cases.length}</span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "text-surface-variant transition-transform duration-300 group-hover:text-foreground",
                      casesCollapsed && "-rotate-90"
                    )}
                  />
                </button>
              </Reveal>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  casesCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none" : "grid-rows-[1fr] opacity-100"
                )}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-1 pb-1">
                    {cases.map((item, i) => (
                      <Reveal key={item.id} delay={(i % 3) * 60}>
                        <CaseLibraryCard item={item} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
