import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, ChevronDown, Clock, GraduationCap, Library, Route, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { courseById, coursesForPath } from '@/content/courses';
import { lessonsForPath } from '@/content/lessons';
import { PATHS } from '@/content/paths';
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
import type { CaseStudy, Course, LessonIndexEntry, Level } from '@/content/types';
import { SectionHeading, Reveal, LevelBadge, EmptyState } from '@/components/ui/primitives';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
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

function courseToItem(course: Course): LibraryItem {
  return {
    id: course.id,
    type: 'course',
    title: course.title,
    subtitle: course.summary,
    href: `/courses/${course.slug}`,
    level: course.level,
    durationMin: course.durationMin,
    tags: course.tags,
    parcours: courseParcours(course),
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
    level: course?.level ?? 'tous',
    durationMin: lesson.readMin,
    tags: Array.from(new Set([...(course?.tags ?? []), ...lesson.glossaryRefs])),
    parcours: parcoursForLesson(lesson.id),
    courseTitle: course?.title,
  };
}

function caseToItem(cs: CaseStudy): LibraryItem {
  return {
    id: cs.id,
    type: 'case',
    title: cs.title,
    subtitle: cs.subtitle,
    href: `/cases/${cs.slug}`,
    level: 'tous',
    durationMin: cs.readMin,
    tags: cs.tags,
    parcours: parcoursForCase(cs.id),
  };
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
    'Bibliothèque · rayons par thème',
    'La bibliothèque organisée par thème : 9 rayons qui exposent leurs cours, lectures et cas. Les parcours restent l’entrée par objectif.',
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const type = (searchParams.get('type') as ItemType) || 'all';

  // The 9 rayons (data/paths.json, sorted by `order`) are the backbone: each
  // carries its own courses and lessons. Parcours-module courses (pathId `p-*`)
  // belong to the « par objectif » entry (/paths) and are intentionally absent.
  const rayons = useMemo(
    () =>
      [...PATHS]
        .sort((a, b) => a.order - b.order)
        .map((path) => ({
          path,
          courses: coursesForPath(path.id).map(courseToItem),
          lessons: lessonsForPath(path.id).map(lessonToItem),
        })),
    [],
  );
  // Études de cas are transversal — they illustrate several rayons at once, so
  // they live in a residual shelf rather than under a single theme.
  const caseItems = useMemo(() => CASE_STUDIES.map(caseToItem), []);

  const tags = useMemo(() => {
    const all = [...rayons.flatMap((r) => [...r.courses, ...r.lessons]), ...caseItems].flatMap((item) => item.tags);
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [rayons, caseItems]);

  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<'all' | Level>('all');
  const [family, setFamily] = useState<'all' | ParcoursFamily>('all');
  const [duration, setDuration] = useState<DurationFilter>('all');
  const [tag, setTag] = useState('all');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleRayon = (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

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

  const matches = (item: LibraryItem) => {
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
  };

  // Filters apply *inside* the rayon structure: each shelf keeps only the items
  // that match, and a shelf with nothing left simply drops out.
  const groups = rayons
    .map((r) => ({ path: r.path, courses: r.courses.filter(matches), lessons: r.lessons.filter(matches) }))
    .filter((g) => g.courses.length || g.lessons.length);
  const cases = caseItems.filter(matches);

  const courseCount = groups.reduce((n, g) => n + g.courses.length, 0);
  const lessonCount = groups.reduce((n, g) => n + g.lessons.length, 0);
  const total = courseCount + lessonCount + cases.length;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <section>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Bibliothèque · par thème"
              title={<>Choisis un <span className="ink-underline">rayon</span>, puis explore ses cours</>}
              description="La bibliothèque est l’entrée par thème : neuf rayons qui exposent leurs cours et leurs lectures. Les parcours restent l’entrée par objectif, quand vous cherchez une destination précise."
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
          <p className="eyebrow mb-4">Filtrer les rayons</p>
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
        <span className="inline-flex items-center gap-1.5"><Library size={15} /> {total} contenu{total > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><Route size={15} /> {groups.length} rayon{groups.length > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><GraduationCap size={15} /> {courseCount} cours</span>
        <span className="inline-flex items-center gap-1.5"><BookOpen size={15} /> {lessonCount} lecture{lessonCount > 1 ? 's' : ''}</span>
        <span className="inline-flex items-center gap-1.5"><Briefcase size={15} /> {cases.length} étude{cases.length > 1 ? 's' : ''} de cas</span>
      </div>

      {total === 0 ? (
        <div className="mt-12">
          <EmptyState icon={<Search size={26} />} title="Aucun contenu trouvé" description="Essayez un autre thème, niveau ou mot-clé." />
        </div>
      ) : (
        <>
          {groups.map((g) => {
            const isCollapsed = collapsed[g.path.id];
            return (
              <section key={g.path.id} id={g.path.slug} className="mt-12 scroll-mt-24 border-b border-outline-variant/30 pb-10 last:border-0 last:pb-0">
                <Reveal>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => toggleRayon(g.path.id)}
                      aria-expanded={!isCollapsed}
                      className="flex flex-1 items-start gap-4 text-left group cursor-pointer select-none focus:outline-none"
                    >
                      <KanjiSeal kanji={g.path.kanji ?? '◆'} accent={g.path.accent} size={44} />
                      <div className="min-w-0">
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant">
                          Rayon {String(g.path.order).padStart(2, '0')}
                        </p>
                        <div className="flex items-center gap-2">
                          <h2 className="font-headline text-headline-lg font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
                            {g.path.title}
                          </h2>
                          <ChevronDown
                            size={18}
                            className={cn(
                              "text-surface-variant transition-transform duration-300 group-hover:text-foreground",
                              isCollapsed && "-rotate-90",
                            )}
                          />
                        </div>
                        <p className="mt-0.5 text-sm italic text-surface-variant">{g.path.subtitle}</p>
                      </div>
                    </button>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="chip">{g.courses.length} cours · {g.lessons.length} lectures</span>
                      <Link to={`/paths/${g.path.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--primary)] hover:underline">
                        Ouvrir le rayon <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </Reveal>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none mt-0" : "grid-rows-[1fr] opacity-100 mt-6",
                  )}
                >
                  <div className="overflow-hidden">
                    {g.courses.length > 0 && (
                      <div className="grid gap-5 pt-1 pb-1 sm:grid-cols-2 lg:grid-cols-3">
                        {g.courses.map((item, i) => (
                          <Reveal key={item.id} delay={(i % 3) * 60}>
                            <CourseLibraryCard item={item} />
                          </Reveal>
                        ))}
                      </div>
                    )}
                    {g.lessons.length > 0 && (
                      <div className={cn("space-y-3", g.courses.length > 0 && "mt-6")}>
                        {g.lessons.map((item, i) => (
                          <Reveal key={item.id} delay={(i % 6) * 35}>
                            <LessonLibraryRow item={item} />
                          </Reveal>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}

          {cases.length > 0 && (
            <section className="mt-12">
              <Reveal>
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="font-headline text-headline-lg font-semibold">Études de cas</h2>
                  <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-xs text-surface-variant">{cases.length}</span>
                </div>
                <p className="mb-5 text-sm text-surface-variant">Transversales aux rayons — elles confrontent plusieurs thèmes à la fois.</p>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cases.map((item, i) => (
                  <Reveal key={item.id} delay={(i % 3) * 60}>
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
