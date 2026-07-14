import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, Sun, Moon, Target } from 'lucide-react';
import { profileById } from '@/content';
import { recommendedPaths, TIME_LABEL } from '@/lib/ikigai';
import { KanjiSeal, Fleuron } from '@/components/ornaments/Ornaments';
import { IkigaiCahierSummary } from '@/components/ikigai/IkigaiCahierSummary';
import { SectionHeading } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { useTheme } from '@/context/ThemeContext';
import { usePageMeta } from '@/lib/seo';

export default function ProfilePage() {
  usePageMeta('Mon profil', 'Votre profil d’apprentissage et vos préférences, enregistrés uniquement sur cet appareil.');
  const { profile } = useUserData();
  const { theme, toggle } = useTheme();

  const learningProfile = profile ? profileById(profile.profileType) : undefined;
  const recPaths = learningProfile ? recommendedPaths(learningProfile, profile?.timeBudget) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Votre espace" title="Mon profil" description="Votre profil, votre cahier et vos préférences sont enregistrés uniquement sur cet appareil." />

      <div className="mt-8 space-y-6">
        {/* Learning profile */}
        {learningProfile ? (
          <div className="premium-card p-7" style={{ borderColor: `color-mix(in srgb, ${learningProfile.accent} 35%, transparent)` }}>
            <p className="eyebrow mb-4">Profil d’apprentissage</p>
            <div className="flex flex-wrap items-center gap-4">
              <KanjiSeal kanji={learningProfile.kanji} accent={learningProfile.accent} size={56} />
              <div className="flex-1">
                <h3 className="font-headline text-headline-md font-semibold" style={{ color: learningProfile.accent }}>{learningProfile.name}</h3>
                <p className="text-sm text-surface-variant">{learningProfile.tag} · {TIME_LABEL[profile?.timeBudget ?? 'medium']}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-surface-variant">{learningProfile.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/profile-result" className="btn-ghost !py-2.5">Voir le détail <ArrowRight size={15} /></Link>
              <Link to="/onboarding" className="btn-quiet"><RotateCcw size={14} /> Refaire le test</Link>
            </div>
            {recPaths[0] && (
              <p className="mt-4 text-sm text-surface-variant">Parcours recommandé : <Link to={`/parcours/${recPaths[0].slug}`} className="gold-link">{recPaths[0].title}</Link></p>
            )}
          </div>
        ) : (
          <div className="premium-card p-7 text-center">
            <Fleuron className="text-base" />
            <h3 className="mt-2 font-headline text-headline-sm font-semibold">Pas encore de profil</h3>
            <p className="mt-1.5 text-sm text-surface-variant">Faites le test d’orientation pour révéler votre profil d’apprentissage.</p>
            <Link to="/onboarding" className="btn-foil mt-4 !py-2.5"><Target size={15} /> Faire le test</Link>
          </div>
        )}

        {/* Mon cahier Ikigai */}
        <IkigaiCahierSummary />

        {/* Preferences */}
        <div className="premium-card p-7">
          <p className="eyebrow mb-4">Préférences</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Apparence</p>
              <p className="text-sm text-surface-variant">Thème {theme === 'dark' ? 'sombre' : 'clair'}</p>
            </div>
            <button onClick={toggle} className="btn-ghost !py-2.5">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
