import { Link, Navigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Home,
  LayoutDashboard,
  Microscope,
  type LucideIcon,
} from 'lucide-react';
import { Fleuron, FleuronDivider } from '@/components/ornaments/Ornaments';
import { Reveal } from '@/components/ui/primitives';
import { NAVIGATION_PILLARS } from '@/lib/navigation';
import { usePageMeta } from '@/lib/seo';

const PILLAR_COPY: Record<string, { cta: string; description: string; icon: LucideIcon }> = {
  intelligence: {
    cta: 'Ouvrir l’intelligence VC',
    description: 'Lire les analyses, convictions, dossiers et méthodes pour comprendre les signaux avant d’entrer dans un parcours.',
    icon: Microscope,
  },
  formation: {
    cta: 'Parcourir la formation',
    description: 'Choisir un parcours, consulter la bibliothèque, reprendre une leçon ou apprendre par thème.',
    icon: BookOpen,
  },
  workspace: {
    cta: 'Ouvrir le workspace',
    description: 'Retrouver vos notes, décisions, progression locale et recommandations personnelles.',
    icon: LayoutDashboard,
  },
};

const ONBOARDING_PILLARS = NAVIGATION_PILLARS.map((pillar) => ({
  ...pillar,
  ...PILLAR_COPY[pillar.id],
}));

export default function OnboardingPage() {
  usePageMeta(
    'Onboarding — choisir un point de départ',
    'Une entrée courte pour comprendre les espaces de la plateforme et choisir entre intelligence VC, formation, workspace ou cahier Ikigai.',
  );

  const [searchParams] = useSearchParams();
  if (searchParams.get('test') === '1') {
    const query = searchParams.toString();
    return <Navigate to={`/ikigai${query ? `?${query}` : ''}`} replace />;
  }

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <header className="grid gap-8 border-b border-outline-variant pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Fleuron className="text-sm" /> Entrée rapide
          </p>
          <h1 className="font-headline text-display-md font-semibold tracking-tight text-balance">
            Choisissez votre point de départ.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-surface-variant text-pretty">
            La plateforme se parcourt librement. Commencez par lire, apprendre, organiser votre travail, ou prenez d’abord un moment de réflexion avec le cahier Ikigai.
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5 text-sm leading-relaxed text-surface-variant">
          <p className="font-medium text-foreground">Repère simple</p>
          <p className="mt-2">
            L’onboarding ne bloque aucun contenu. Il sert seulement à choisir une première direction, surtout si vous débutez ou préparez une candidature.
          </p>
        </div>
      </header>

      <section aria-labelledby="onboarding-navigation" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Navigation principale</p>
            <h2 id="onboarding-navigation" className="font-headline text-display-sm font-semibold tracking-tight">
              Trois espaces pour avancer
            </h2>
          </div>
          <Link to="/home" className="btn-quiet">
            <Home size={15} /> Voir la vue d’ensemble
          </Link>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {ONBOARDING_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.id}>
                <Link to={pillar.to} className="premium-card premium-card-hover group flex h-full min-w-0 flex-col p-7">
                  <Icon size={22} className="text-[color:var(--primary)]" />
                  <h3 className="mt-5 font-headline text-headline-md font-semibold tracking-tight group-hover:text-[color:var(--primary)]">
                    {pillar.label}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-surface-variant text-pretty">
                    {pillar.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--primary)]">
                    {pillar.cta} <ArrowRight size={15} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <FleuronDivider className="my-12" />

      <section className="grid gap-6 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] p-7 sm:p-9 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <p className="eyebrow mb-3 flex items-center gap-2">
            <Compass size={13} /> Moment de réflexion
          </p>
          <h2 className="font-headline text-display-sm font-semibold tracking-tight text-balance">
            Clarifier votre rapport au capital-risque avant de commencer.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-surface-variant text-pretty">
            Le cahier Ikigai reste disponible si vous voulez examiner ce qui vous attire, ce que vous pouvez apporter et le parcours d’apprentissage le plus cohérent pour vous.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <Link to="/ikigai" className="btn-foil justify-center">
            Ouvrir le cahier Ikigai <ArrowRight size={16} />
          </Link>
          <Link to="/ikigai?test=1" className="btn-ghost justify-center">
            Faire seulement le test
          </Link>
        </div>
      </section>
    </div>
  );
}
