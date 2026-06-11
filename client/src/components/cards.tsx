import { Link } from '@/i18n/routing';
import { ArrowRight, ArrowUpRight, BookOpen, Clock, FlaskConical, Layers } from 'lucide-react';
import { WaxSeal } from '@/components/ornaments/Illustrations';
import { LevelBadge, ProgressBar, ProgressRing } from '@/components/ui/primitives';
import { lessonIdsForPath } from '@/content/courses';
import { FAMILY_META, lessonIdsForParcours, t } from '@/content/parcours';
import { LEVEL_LABEL } from '@/content/labels';
import { useUserData } from '@/context/UserDataContext';
import { formatDateFr, pluralize } from '@/lib/utils';
import type { BlogPost, CaseStudy, Course, Path, Simulator } from '@/content/types';
import type { Parcours } from '@/content/parcours';

function usePathProgress(pathId: string) {
  const { progress } = useUserData();
  const lessonIds = lessonIdsForPath(pathId);
  if (!lessonIds.length) return { pct: 0, done: 0, total: 0 };
  const done = lessonIds.filter((id) => progress[id]?.status === 'done').length;
  return { pct: Math.round((done / lessonIds.length) * 100), done, total: lessonIds.length };
}

export function PathCard({ path, index = 0 }: { path: Path; index?: number }) {
  const { pct, total } = usePathProgress(path.id);
  return (
    <Link
      to={`/paths/${path.slug}`}
      className="premium-card premium-card-hover sheen-host group isolate flex flex-col p-6"
      style={{ borderTopColor: `color-mix(in srgb, ${path.accent} 50%, transparent)`, borderTopWidth: 2 }}
    >
      <span
        aria-hidden
        className="contour-field pointer-events-none absolute -right-10 -top-10 -z-10 h-44 w-44 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ '--contour': path.accent } as React.CSSProperties}
      />
      <div className="flex items-start justify-between gap-4">
        <WaxSeal
          glyph={path.kanji ?? '◆'}
          accent={path.accent}
          size={48}
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-105"
        />
        <span className="font-mono text-xs text-surface-variant">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <LevelBadge level={path.level} accent={path.accent} />
        <span className="chip">{pluralize(path.courseIds.length, 'cours')}</span>
      </div>
      <h3 className="mt-3 font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
        {path.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{path.summary}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> ≈ {path.durationHours} h</span>
        <span className="inline-flex items-center gap-1.5"><BookOpen size={13} /> {total} leçons</span>
      </div>
      {pct > 0 && (
        <div className="mt-3">
          <ProgressBar value={pct} accent={path.accent} />
          <p className="mt-1.5 text-[0.625rem] text-surface-variant">{pct}% parcouru</p>
        </div>
      )}
    </Link>
  );
}

export function ParcoursCard({ parcours, index = 0 }: { parcours: Parcours; index?: number }) {
  const { progress } = useUserData();
  const meta = FAMILY_META[parcours.family];
  const accent = parcours.accent ?? meta.accent;
  const lessonIds = lessonIdsForParcours(parcours);
  const done = lessonIds.filter((id) => progress[id]?.status === 'done').length;
  const pct = lessonIds.length ? Math.round((done / lessonIds.length) * 100) : 0;

  return (
    <Link
      to={`/paths/${parcours.slug}`}
      className="premium-card premium-card-hover sheen-host group isolate flex h-full flex-col p-6"
      style={{ borderTopColor: `color-mix(in srgb, ${accent} 50%, transparent)`, borderTopWidth: 2 }}
    >
      <span
        aria-hidden
        className="contour-field pointer-events-none absolute -right-10 -top-10 -z-10 h-44 w-44 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ '--contour': accent } as React.CSSProperties}
      />
      <div className="flex items-start justify-between gap-4">
        <WaxSeal
          glyph={parcours.kanji ?? meta.kanji}
          accent={accent}
          size={48}
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-105"
        />
        {pct > 0 ? (
          <ProgressRing value={pct} size={42} stroke={3} accent={accent} />
        ) : (
          <span className="font-mono text-xs text-surface-variant">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <LevelBadge level={parcours.level} accent={accent} />
        <span className="chip">{meta.label}</span>
      </div>
      <h3 className="mt-3 font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
        {t(parcours.title)}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{t(parcours.hook)}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> ≈ {parcours.time.coreHours} h</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)]">
          {pct > 0 ? 'Reprendre' : 'Commencer'} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function CourseCard({ course, accent }: { course: Course; accent?: string }) {
  const { progress } = useUserData();
  const lessonIds = course.lessonIds;
  const done = lessonIds.filter((id) => progress[id]?.status === 'done').length;
  const pct = lessonIds.length ? Math.round((done / lessonIds.length) * 100) : 0;
  return (
    <Link to={`/courses/${course.slug}`} className="premium-card premium-card-hover group flex flex-col p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">{LEVEL_LABEL[course.level]}</span>
        <ArrowUpRight size={16} className="text-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <h4 className="mt-2 font-headline text-headline-sm font-semibold leading-tight">{course.title}</h4>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-surface-variant">{course.subtitle}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-surface-variant">
        <span>{pluralize(lessonIds.length, 'leçon')}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {course.durationMin} min</span>
      </div>
      {pct > 0 && <ProgressBar value={pct} accent={accent} className="mt-3" />}
    </Link>
  );
}

export function LessonRow({ slug, order, title, kicker, readMin, summary, done, reading }: {
  slug: string; order: number; title: string; kicker: string; readMin: number; summary?: string; done?: boolean; reading?: boolean;
}) {
  return (
    <Link to={`/lessons/${slug}`} className="group flex items-start gap-4 rounded-xl border border-transparent px-3 py-3.5 transition-colors hover:border-outline-variant hover:bg-surface-container-low">
      <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs ${done ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[color:var(--primary)]' : reading ? 'border-[color-mix(in_srgb,var(--primary)_40%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant'}`}>
        {done ? '✓' : String(order).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{kicker}</span>
          {reading && <span className="chip !py-0 text-[0.5625rem]">en cours</span>}
        </span>
        <span className="mt-0.5 block font-medium leading-snug transition-colors group-hover:text-[color:var(--primary)]">{title}</span>
        {summary && <span className="mt-1 line-clamp-1 block text-sm text-surface-variant">{summary}</span>}
      </span>
      <span className="mt-1 shrink-0 text-xs text-surface-variant">{readMin} min</span>
    </Link>
  );
}

export function CaseCard({ cs }: { cs: CaseStudy }) {
  const KIND_LABEL: Record<string, string> = { startup: 'Startup', fund: 'Fonds', deal: 'Deal', market: 'Marché' };
  return (
    <Link to={`/cases/${cs.slug}`} className="premium-card premium-card-hover group flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-3">
        <span className="chip">{KIND_LABEL[cs.kind] ?? cs.kind}</span>
        <span className="font-mono text-xs text-surface-variant">{cs.year}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-headline text-headline-sm font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{cs.title}</h3>
        <p className="mt-1.5 text-sm italic text-surface-variant">{cs.subtitle}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{cs.summary}</p>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-surface-variant"><Clock size={13} /> {cs.readMin} min · {cs.company}</div>
      </div>
    </Link>
  );
}

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`premium-card premium-card-hover group flex flex-col p-6 ${featured ? 'md:p-8' : ''}`}>
      <div className="flex items-center gap-3 text-xs text-surface-variant">
        <span className="chip">{post.category}</span>
        <span>{formatDateFr(post.date)}</span>
      </div>
      <h3 className={`mt-4 font-headline font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)] ${featured ? 'text-display-sm' : 'text-headline-md'}`}>
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm italic text-surface-variant">{post.subtitle}</p>
      <p className={`mt-3 flex-1 text-sm leading-relaxed text-surface-variant ${featured ? 'line-clamp-4' : 'line-clamp-3'}`}>{post.excerpt}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
        <span>{post.author}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {post.readMin} min</span>
      </div>
    </Link>
  );
}

export function SimulatorCard({ sim }: { sim: Simulator }) {
  return (
    <Link to={`/simulators/${sim.slug}`} className="premium-card premium-card-hover group flex flex-col p-6" style={{ borderTopColor: `color-mix(in srgb, ${sim.accent} 50%, transparent)`, borderTopWidth: 2 }}>
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ color: sim.accent, background: `color-mix(in srgb, ${sim.accent} 12%, transparent)` }}>
          <FlaskConical size={18} />
        </span>
        <span className="chip">{sim.category}</span>
      </div>
      <h3 className="mt-4 font-headline text-headline-sm font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{sim.title}</h3>
      <p className="mt-1.5 text-sm italic text-surface-variant">{sim.subtitle}</p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{sim.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--primary)]">
        Lancer le simulateur <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function GlossaryRefList({ slugs, title = 'Termes liés' }: { slugs: string[]; title?: string }) {
  if (!slugs.length) return null;
  return (
    <div>
      <p className="eyebrow mb-3 flex items-center gap-2"><Layers size={13} /> {title}</p>
      <div className="flex flex-wrap gap-2">
        {slugs.map((s) => (
          <Link key={s} to={`/glossary?term=${s}`} className="chip transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:text-foreground">
            {s.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>
    </div>
  );
}
