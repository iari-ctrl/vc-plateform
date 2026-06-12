import { useLocation } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ArrowRight, RotateCcw, Target, Sparkles, Clock, UserPlus } from 'lucide-react';
import { IKIGAI, profileById } from '@/content';
import { t } from '@/content/parcours';
import { recommendedPaths, TIME_LABEL } from '@/lib/ikigai';
import { ParcoursCard } from '@/components/cards';
import { KanjiSeal, FleuronDivider } from '@/components/ornaments/Ornaments';
import { ProgressBar, EmptyState, Button, Reveal, PageLoader } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { usePageMeta } from '@/lib/seo';

interface ResultState {
  profileId?: string;
  scores?: Record<string, number>;
  timeBudget?: string;
}

export default function ProfileResultPage() {
  const location = useLocation();
  const state = (location.state as ResultState) ?? {};
  const { profile: savedProfile, loading } = useUserData();
  const { isAuthed, apiUp } = useAuth();
  const { openAuth } = useUI();

  const profileId = state.profileId ?? savedProfile?.profileType;
  const scores = state.scores ?? savedProfile?.scores;
  const timeBudget = state.timeBudget ?? savedProfile?.timeBudget ?? 'medium';
  const profile = profileId ? profileById(profileId) : undefined;

  usePageMeta(profile ? `Votre profil — ${profile.name}` : 'Votre profil', undefined, { noindex: true });

  if (!profile) {
    // On a fresh reload the router state is gone and an authed user's saved
    // profile is still being fetched. Show a loader until we actually know there
    // is no profile, instead of flashing the empty state. (When arriving from
    // the quiz, `state.profileId` is present, so this branch is skipped.)
    if (loading && !state.profileId) {
      return <PageLoader label="Chargement de votre profil…" />;
    }
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={<Target size={28} />}
          title="Aucun profil pour l’instant"
          description="Faites le test d’orientation pour révéler votre profil d’apprentissage et obtenir des recommandations personnalisées."
          action={<Button as="link" to="/onboarding">Faire le test <ArrowRight size={16} /></Button>}
        />
      </div>
    );
  }

  const paths = recommendedPaths(profile, timeBudget);
  const maxScore = scores ? Math.max(...Object.values(scores), 1) : 1;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      {/* Reveal header */}
      <Reveal>
        <div className="text-center">
          <p className="eyebrow mb-4">Votre profil d’apprentissage</p>
          <div className="flex justify-center">
            <KanjiSeal kanji={profile.kanji} accent={profile.accent} size={84} />
          </div>
          <h1 className="mt-5 font-headline text-display-md font-semibold tracking-tight" style={{ color: profile.accent }}>
            {profile.name}
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-surface-variant">{profile.tag}</p>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-surface-variant text-pretty">{profile.description}</p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="space-y-6">
          <div className="premium-card p-7">
            <p className="eyebrow mb-4 flex items-center gap-2"><Sparkles size={14} /> Vos points de focus</p>
            <ul className="space-y-3">
              {profile.focus.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.95rem]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: profile.accent }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="premium-card p-7">
            <p className="eyebrow mb-3">Signaux qui vous caractérisent</p>
            <div className="flex flex-wrap gap-2">
              {profile.signals.map((s, i) => (
                <span key={i} className="chip">{s}</span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-surface-variant">
              <Clock size={15} /> Temps disponible estimé : <span className="font-medium text-foreground">{TIME_LABEL[timeBudget] ?? '1 à 3 h / semaine'}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="premium-card p-7">
            <p className="eyebrow mb-4">Affinités par profil</p>
            <div className="space-y-3">
              {IKIGAI.profiles
                .map((p) => ({ p, score: scores?.[p.id] ?? 0 }))
                .sort((a, b) => b.score - a.score)
                .map(({ p, score }) => (
                  <div key={p.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className={p.id === profile.id ? 'font-semibold text-foreground' : 'text-surface-variant'}>{p.name}</span>
                      <span className="font-mono text-surface-variant">{score}</span>
                    </div>
                    <ProgressBar value={(score / maxScore) * 100} accent={p.id === profile.id ? profile.accent : 'var(--outline)'} />
                  </div>
                ))}
            </div>
          </div>
        </Reveal>
      </div>

      <FleuronDivider className="my-14" />

      {/* Recommended paths */}
      <Reveal>
        <div className="mb-8 text-center">
          <h2 className="font-headline text-display-sm font-semibold tracking-tight">Votre parcours recommandé</h2>
          <p className="mx-auto mt-3 max-w-xl text-surface-variant">Un point de départ, pas une prison. Vous restez libre d’explorer n’importe quel sujet, dans n’importe quel ordre.</p>
        </div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <ParcoursCard parcours={p} index={i} />
          </Reveal>
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {paths[0] && (
          <Link to={`/paths/${paths[0].slug}`} className="btn-foil">
            Commencer « {t(paths[0].title)} » <ArrowRight size={16} />
          </Link>
        )}
        <Link to="/dashboard" className="btn-ghost">Aller à mon tableau de bord</Link>
        <Link to="/onboarding" className="btn-quiet"><RotateCcw size={14} /> Refaire le test</Link>
      </div>

      {!isAuthed && apiUp && (
        <div className="mx-auto mt-10 flex max-w-xl items-center gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] px-6 py-5">
          <UserPlus size={22} className="shrink-0 text-[color:var(--primary)]" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Conservez ce profil</p>
            <p className="text-xs text-surface-variant">Créez un espace pour retrouver votre profil, vos notes et votre progression sur tous vos appareils.</p>
          </div>
          <button onClick={() => openAuth('Créez votre espace pour conserver votre profil d’introspection et votre progression.')} className="btn-ghost shrink-0">Créer mon espace</button>
        </div>
      )}
    </div>
  );
}
