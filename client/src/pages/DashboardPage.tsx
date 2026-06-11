import { Link } from '@/i18n/routing';
import { ArrowRight, BookOpen, NotebookPen, Bookmark, Compass, Crosshair, Play, Target } from 'lucide-react';
import { LESSONS, lessonById, courseById, profileById } from '@/content';
import { PARCOURS, lessonIdsForParcours, t } from '@/content/parcours';
import { recommendedPaths } from '@/lib/ikigai';
import { ParcoursCard } from '@/components/cards';
import { ProgressRing, ProgressBar, SectionHeading, Reveal } from '@/components/ui/primitives';
import { KanjiSeal, Fleuron } from '@/components/ornaments/Ornaments';
import { useUserData } from '@/context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { plainText } from '@/lib/markdown';
import { isDue } from '@/lib/decisionJournal';
import { formatDateFr } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';

export default function DashboardPage() {
  usePageMeta('Tableau de bord', 'Votre progression, vos recommandations et vos notes — votre centre de contrôle d’apprentissage.');
  const { profile, progress, notes, bookmarks, journal } = useUserData();
  const { user } = useAuth();
  const dueJournal = journal.filter((e) => isDue(e)).length;

  const learningProfile = profile ? profileById(profile.profileType) : undefined;
  const progressList = Object.values(progress);
  const doneCount = progressList.filter((p) => p.status === 'done').length;
  const globalPct = LESSONS.length ? Math.round((doneCount / LESSONS.length) * 100) : 0;

  // Find a lesson to resume: most recently "reading", else first lesson of recommended path.
  const reading = progressList.filter((p) => p.status === 'reading');
  const resumeLesson = reading.length
    ? lessonById(reading[reading.length - 1].lessonId)
    : undefined;

  const recPaths = learningProfile ? recommendedPaths(learningProfile, profile?.timeBudget) : PARCOURS.slice(0, 3);
  const suggestedLessons = learningProfile
    ? recPaths
        .flatMap((p) => lessonIdsForParcours(p).map(lessonById).filter((l): l is NonNullable<ReturnType<typeof lessonById>> => !!l))
        .filter((l) => progress[l.id]?.status !== 'done')
        .slice(0, 3)
    : LESSONS.slice(0, 3);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Greeting */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="eyebrow mb-2">Tableau de bord</p>
            <h1 className="font-headline text-display-sm font-semibold tracking-tight">
              Bonjour{user ? `, ${user.name.split(' ')[0]}` : ''}.
            </h1>
            <p className="mt-2 text-surface-variant">Reprenez là où vous vous êtes arrêté, ou laissez-vous guider.</p>
          </div>
          <div className="flex items-center gap-5 rounded-2xl border border-outline-variant bg-surface-container-low px-6 py-4">
            <ProgressRing value={globalPct} size={56} stroke={4} label={`${globalPct}%`} />
            <div className="text-sm">
              <p className="font-semibold">{doneCount} / {LESSONS.length} leçons</p>
              <p className="text-surface-variant">terminées</p>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Resume / start */}
          <Reveal>
            {resumeLesson ? (
              <Link to={`/lessons/${resumeLesson.slug}`} className="premium-card premium-card-hover group block p-7">
                <p className="eyebrow mb-3 flex items-center gap-2"><Play size={13} /> Reprendre la lecture</p>
                <h3 className="font-headline text-headline-md font-semibold transition-colors group-hover:text-[color:var(--primary)]">{resumeLesson.title}</h3>
                <p className="mt-1.5 text-sm text-surface-variant">{courseById(resumeLesson.courseId)?.title}</p>
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar value={progress[resumeLesson.id]?.percent ?? 0} className="flex-1" />
                  <span className="text-xs text-surface-variant">{progress[resumeLesson.id]?.percent ?? 0}%</span>
                </div>
              </Link>
            ) : (
              <div className="premium-card p-7">
                <p className="eyebrow mb-3 flex items-center gap-2"><Compass size={13} /> Premier pas</p>
                <h3 className="font-headline text-headline-md font-semibold">Commencez votre parcours</h3>
                <p className="mt-1.5 text-sm text-surface-variant">{learningProfile ? `Votre profil ${learningProfile.name} vous oriente vers « ${recPaths[0] ? t(recPaths[0].title) : 'un parcours'} ».` : 'Faites le test d’orientation pour une recommandation sur-mesure, ou plongez directement.'}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {recPaths[0] && <Link to={`/paths/${recPaths[0].slug}`} className="btn-foil !py-2.5">Commencer <ArrowRight size={15} /></Link>}
                  {!learningProfile && <Link to="/onboarding" className="btn-ghost !py-2.5">Faire le test</Link>}
                </div>
              </div>
            )}
          </Reveal>

          {/* Suggested lessons */}
          <Reveal delay={80}>
            <div className="premium-card p-7">
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow flex items-center gap-2"><BookOpen size={13} /> Suggéré pour vous</p>
              <Link to="/paths" className="text-xs text-surface-variant hover:text-foreground">Tous les parcours</Link>
              </div>
              <div className="-mx-2">
                {suggestedLessons.map((l) => {
                  const c = courseById(l.courseId);
                  return (
                    <Link key={l.id} to={`/lessons/${l.slug}`} className="group flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-surface-container-low">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-container font-mono text-[0.625rem] text-surface-variant">{l.readMin}′</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium transition-colors group-hover:text-[color:var(--primary)]">{l.title}</span>
                        <span className="block truncate text-xs text-surface-variant">{c?.title}</span>
                      </span>
                      <ArrowRight size={15} className="shrink-0 text-surface-variant transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Recommended paths */}
          <Reveal delay={120}>
            <SectionHeading eyebrow="Vos parcours" title="Recommandés pour votre profil" className="mb-5" />
            <div className="grid gap-5 sm:grid-cols-2">
              {recPaths.slice(0, 2).map((p, i) => (
                <ParcoursCard key={p.id} parcours={p} index={i} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Reveal>
            {learningProfile ? (
              <div className="premium-card p-7" style={{ borderColor: `color-mix(in srgb, ${learningProfile.accent} 35%, transparent)` }}>
                <div className="flex items-center gap-4">
                  <KanjiSeal kanji={learningProfile.kanji} accent={learningProfile.accent} size={52} />
                  <div>
                    <p className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Votre profil</p>
                    <h3 className="font-headline text-headline-sm font-semibold" style={{ color: learningProfile.accent }}>{learningProfile.name}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-surface-variant">{learningProfile.tag}</p>
                <Link to="/profile-result" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--primary)]">Voir le détail <ArrowRight size={14} /></Link>
              </div>
            ) : (
              <div className="premium-card p-7 text-center">
                <Fleuron className="text-base" />
                <h3 className="mt-2 font-headline text-headline-sm font-semibold">Révélez votre profil</h3>
                <p className="mt-1.5 text-sm text-surface-variant">Sept questions pour personnaliser vos recommandations.</p>
                <Link to="/onboarding" className="btn-foil mt-4 !py-2.5"><Target size={15} /> Faire le test</Link>
              </div>
            )}
          </Reveal>

          {/* Stats */}
          <Reveal delay={80}>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/notes" className="premium-card premium-card-hover p-5">
                <NotebookPen size={18} className="text-surface-variant" />
                <p className="mt-3 font-headline text-display-sm font-semibold leading-none">{notes.length}</p>
                <p className="mt-1 text-xs text-surface-variant">notes & citations</p>
              </Link>
              <Link to="/notes" className="premium-card premium-card-hover p-5">
                <Bookmark size={18} className="text-surface-variant" />
                <p className="mt-3 font-headline text-display-sm font-semibold leading-none">{bookmarks.length}</p>
                <p className="mt-1 text-xs text-surface-variant">favoris enregistrés</p>
              </Link>
              <Link
                to="/journal"
                className="premium-card premium-card-hover col-span-2 flex items-center gap-4 p-5"
                style={dueJournal > 0 ? { borderColor: 'color-mix(in srgb, var(--primary) 40%, transparent)' } : undefined}
              >
                <Crosshair size={18} className={dueJournal > 0 ? 'text-[color:var(--primary)]' : 'text-surface-variant'} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">Journal de décisions</span>
                  <span className="block text-xs text-surface-variant">
                    {dueJournal > 0
                      ? `${dueJournal} prédiction${dueJournal > 1 ? 's' : ''} à confronter au réel`
                      : journal.length > 0
                        ? `${journal.length} prédiction${journal.length > 1 ? 's' : ''} consignée${journal.length > 1 ? 's' : ''}`
                        : 'Consignez une prédiction datée, revenez la juger'}
                  </span>
                </span>
                <ArrowRight size={15} className="shrink-0 text-surface-variant" />
              </Link>
            </div>
          </Reveal>

          {/* Recent notes */}
          <Reveal delay={120}>
            <div className="premium-card p-7">
              <p className="eyebrow mb-4 flex items-center gap-2"><NotebookPen size={13} /> Dernières notes</p>
              {notes.length === 0 ? (
                <p className="text-sm text-surface-variant">Surlignez un passage pendant votre lecture pour commencer votre carnet.</p>
              ) : (
                <ul className="space-y-4">
                  {notes.slice(0, 3).map((n) => (
                    <li key={n.id} className="border-l-2 border-[color-mix(in_srgb,var(--primary)_40%,transparent)] pl-4">
                      <p className="line-clamp-3 text-sm italic leading-relaxed">“{plainText(n.body, 140)}”</p>
                      <p className="mt-1 text-[0.625rem] text-surface-variant">{n.sourceTitle ?? 'Note libre'} · {formatDateFr(n.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
              {notes.length > 0 && <Link to="/notes" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--primary)]">Tout le carnet <ArrowRight size={14} /></Link>}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
