import { Link } from '@/i18n/routing';
import { ArrowRight, BookHeart, RotateCcw, Sparkles, History } from 'lucide-react';
import { IKIGAI, profileById } from '@/content';
import { archetypeById } from '@/lib/ikigai';
import { getChosenArchetype, getCahierAnswers, countAnswered, getHistory } from '@/lib/ikigaiCahier';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { useUserData } from '@/context/UserDataContext';
import { formatDateFr } from '@/lib/utils';

/**
 * "Mon cahier Ikigai" — a non-conclusive recap that brings together the
 * orientation scoring, the chosen archetype and the free-text answers. Shown on
 * the Profile and Notes pages. Reads guest-friendly local state; never asserts a
 * final verdict.
 */
export function IkigaiCahierSummary({ className }: { className?: string }) {
  const { profile } = useUserData();
  const learningProfile = profile ? profileById(profile.profileType) : undefined;
  const archetype = archetypeById(getChosenArchetype() ?? '');
  const answered = countAnswered(getCahierAnswers());
  const history = getHistory();
  const totalReflection = IKIGAI.reflection.decouverte.length;

  const started = !!learningProfile || !!archetype || answered > 0;

  return (
    <div className={`premium-card p-7 ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow flex items-center gap-2">
          <BookHeart size={14} /> Mon cahier Ikigai
        </p>
        <Link to="/onboarding" className="btn-quiet !px-3 !py-1.5 text-xs">
          <RotateCcw size={13} /> Repasser l’Ikigai
        </Link>
      </div>

      {!started ? (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-surface-variant">
            Vous n’avez pas encore ouvert votre cahier. Explorez le diagramme, répondez aux sept questions, et révélez
            votre profil d’apprentissage — rien n’est définitif, c’est un point de départ.
          </p>
          <Link to="/onboarding" className="btn-foil mt-4 !py-2.5">
            Ouvrir le cahier <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {learningProfile && (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low/60 p-4">
                <p className="eyebrow mb-2">Profil d’apprentissage</p>
                <div className="flex items-center gap-3">
                  <KanjiSeal kanji={learningProfile.kanji} accent={learningProfile.accent} size={42} />
                  <div className="min-w-0">
                    <p className="truncate font-headline text-headline-sm font-semibold" style={{ color: learningProfile.accent }}>
                      {learningProfile.name}
                    </p>
                    <p className="truncate text-xs text-surface-variant">{learningProfile.tag}</p>
                  </div>
                </div>
              </div>
            )}

            {archetype && (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low/60 p-4">
                <p className="eyebrow mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} /> Archétype choisi
                </p>
                <div className="flex items-center gap-3">
                  <KanjiSeal kanji={archetype.kanji} accent={archetype.accent} size={42} />
                  <div className="min-w-0">
                    <p className="truncate font-headline text-headline-sm font-semibold" style={{ color: archetype.accent }}>
                      {archetype.name}
                    </p>
                    <p className="truncate text-xs text-surface-variant">{archetype.tag}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-surface-variant">
            <span className="chip">{answered} réponse{answered > 1 ? 's' : ''} d’introspection</span>
            <span className="text-xs">sur {totalReflection} questions par niveau de lecture</span>
          </div>

          {history.length > 0 && (
            <div className="mt-5 border-t border-outline-variant pt-4">
              <p className="eyebrow mb-2.5 flex items-center gap-1.5">
                <History size={12} /> Passages précédents
              </p>
              <ul className="space-y-1.5">
                {history.slice(0, 4).map((h, i) => {
                  const p = profileById(h.profileType);
                  return (
                    <li key={i} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-surface-variant">{p?.name ?? h.profileType}</span>
                      <span className="shrink-0 font-mono text-[0.625rem] text-surface-variant">{formatDateFr(h.takenAt)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {learningProfile && (
              <Link to="/profile-result" className="btn-ghost !py-2.5">
                Voir le détail <ArrowRight size={15} />
              </Link>
            )}
            <Link to="/onboarding" className="btn-quiet">
              Reprendre le cahier
            </Link>
          </div>
          <p className="mt-4 text-xs italic text-surface-variant">
            Un résumé, pas une conclusion. Votre centre de gravité se déplace — repassez l’Ikigai quand vous le sentez.
          </p>
        </>
      )}
    </div>
  );
}
