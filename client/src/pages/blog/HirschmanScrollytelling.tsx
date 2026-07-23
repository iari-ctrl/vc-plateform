import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, Footprints, MessageSquareText, Network, ShieldCheck, Split, UsersRound, type LucideIcon } from 'lucide-react';
import type { BlogPost } from '@/content/types';
import { publicAssetUrl } from '@shared/base-url.mjs';
import { ScrollytellingProgress, ScrollytellingScene } from '@/components/blog/ScrollytellingPrimitives';
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

const ASSET_BASE = publicAssetUrl('blog/exit-voice-loyalty-hirschman', import.meta.env.BASE_URL);

const HERO_IMAGE_DIMENSIONS = { width: 2688, height: 1520 } as const;
const PORTRAIT_IMAGE_DIMENSIONS = { width: 1744, height: 2336 } as const;

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  alt: string;
  icon: LucideIcon;
  notes: string[];
  question: string;
};

const scenes: Scene[] = [
  {
    id: 'triangle',
    eyebrow: '01 · Le triangle',
    title: 'Exit, voice et loyauté décrivent trois réponses au déclin d’une organisation.',
    summary:
      "Hirschman analyse leurs interactions : un départ réduit le nombre de personnes susceptibles de contester, tandis que la loyauté peut laisser à la voice le temps d'agir.",
    image: `${ASSET_BASE}/triangle.webp`,
    alt: "Instrument abstrait à trois trajectoires lumineuses représentant l'exit, la voice et la loyauté.",
    icon: Split,
    notes: [
      "L'exit sanctionne l'organisation sans préciser les causes du départ.",
      "La voice rend les motifs explicites et suppose une capacité d'influence.",
      "La loyauté peut retarder le départ et laisser du temps à la réforme.",
    ],
    question: 'L’analyse distingue ceux qui partent, protestent ou restent, ainsi que leurs motifs.',
  },
  {
    id: 'venture-voice',
    eyebrow: '02 · Illiquidité',
    title: 'L’illiquidité du capital-risque renforce la fonction de gouvernance.',
    summary:
      "L'investisseur ne peut pas vendre pendant sept à dix ans. Le board seat, les droits d'information et les protective provisions définissent alors sa capacité d'influence.",
    image: `${ASSET_BASE}/governance.webp`,
    alt: "Salle de board abstraite avec fils dorés, porte verrouillée et instruments de gouvernance.",
    icon: MessageSquareText,
    notes: [
      "En 2021, l'accès apparent à la liquidité a réduit l'incitation à exercer la voice.",
      "La fermeture d'une fenêtre de sortie accroît la dépendance de l'investisseur à ses droits d'influence.",
      "La gouvernance constitue le canal de voice attaché à un investissement illiquide.",
    ],
    question: 'L’évaluation rapproche le prix payé des droits d’influence obtenus.',
  },
  {
    id: 'founders',
    eyebrow: '03 · Origine',
    title: 'Certains projets entrepreneuriaux suivent l’échec d’une tentative de réforme interne.',
    summary:
      "Les exemples de Shockley vers Fairchild, de PARC vers Adobe ou Apple et de Cisco vers Zoom relient la création d'entreprise à un diagnostic interne qui n'a pas été retenu.",
    image: `${ASSET_BASE}/hero.webp`,
    alt: 'Carte institutionnelle abstraite avec trajectoires dorées quittant puis réorganisant une salle sombre.',
    icon: ArrowDownRight,
    notes: [
      "Le motif du départ apporte davantage d'information que la seule provenance.",
      'La voice antérieure peut laisser des alliés, des prototypes et des clients internes.',
      'Le founder-market fit peut associer un projet à un problème observé de l’intérieur.',
    ],
    question: 'La diligence documente ce que le fondateur avait tenté de modifier avant son départ.',
  },
  {
    id: 'attrition',
    eyebrow: '04 · Départs',
    title: 'La composition des départs peut signaler une dégradation avant les indicateurs agrégés.',
    summary:
      "La regretted attrition constitue un indicateur avancé. L'identité des premiers employés partis, l'ordre des départs et leur destination apportent des informations que les métriques agrégées peuvent encore masquer.",
    image: `${ASSET_BASE}/flows.webp`,
    alt: "Flux dorés quittant un vaisseau abstrait de startup avec signaux lumineux de protestation.",
    icon: Footprints,
    notes: [
      "Le churn brut doit être rapproché de l'identité des personnes parties.",
      "Les personnes parties, sélectionnées hors des références fournies, apportent des informations complémentaires.",
      "L'arrivée de talents issus des meilleures maisons du secteur constitue aussi un signal par exit.",
    ],
    question: 'L’analyse porte sur le niveau d’information des personnes parties et la chronologie de leurs départs.',
  },
  {
    id: 'loyalty',
    eyebrow: '05 · Loyauté',
    title: 'La loyauté contribue au redressement lorsqu’une possibilité de départ subsiste.',
    summary:
      "La rétention peut relever de la conviction ou de la captivité. Vesting, mission, options non liquides et coûts irrécupérables contribuent parfois à une fidélité silencieuse qui limite la voice.",
    image: `${ASSET_BASE}/governance.webp`,
    alt: 'Instruments abstraits de gouvernance et porte verrouillée, dans une palette navy, or et prune.',
    icon: ShieldCheck,
    notes: [
      'La loyauté lucide associe maintien, contestation et possibilité de départ.',
      "La loyauté captive résulte d'un coût d'exit élevé.",
      'Une thèse invalidée peut aussi retenir un investisseur en raison de coûts irrécupérables.',
    ],
    question: 'La diligence examine la nature de la rétention observée et la voice qu’elle permet.',
  },
  {
    id: 'grid',
    eyebrow: '06 · Grille',
    title: 'Les flux complètent les indicateurs de stock dans l’analyse d’une organisation.',
    summary:
      "Les effectifs, les parts de marché et la cap table décrivent un état. La grille de Hirschman y ajoute l'analyse des entrées, des sorties, des protestations, des silences et des droits de voice.",
    image: `${ASSET_BASE}/flows.webp`,
    alt: 'Carte abstraite de flux de diligence reliant employés, clients, fondateurs, LPs et investisseurs.',
    icon: Network,
    notes: [
      'Pour la startup, l’analyse porte sur les flux d’employés et de clients.',
      'Pour le fondateur, elle porte sur son histoire personnelle d’exit et de voice.',
      'Pour le fonds, elle porte sur les LPs, les re-ups, les objections et la fidélité observée.',
    ],
    question: 'La diligence examine ces flux et les personnes habilitées à y exercer une voice.',
  },
];

function sceneImageDimensions(scene: Scene) {
  return scene.image.endsWith('/hero.webp') ? HERO_IMAGE_DIMENSIONS : PORTRAIT_IMAGE_DIMENSIONS;
}

export function HirschmanScrollytelling({ post }: { post: BlogPost }) {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktopMedia = useMediaQuery('(min-width: 1024px)');
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.sceneIndex);
        if (Number.isFinite(next)) setActive(next);
      },
      { threshold: [0.32, 0.5, 0.68], rootMargin: '-18% 0px -22% 0px' },
    );

    sceneRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const activeScene = scenes[active] ?? scenes[0];
  const progress = useMemo(() => (active + 1) / scenes.length, [active]);

  return (
    <section className="mt-10" aria-label={`Version scrollytelling de ${post.title}`}>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest shadow-editorial-lg">
        <img
          src={`${ASSET_BASE}/hero.webp`}
          alt="Carte abstraite des trajectoires exit, voice et loyauté appliquées au venture capital."
          width={HERO_IMAGE_DIMENSIONS.width}
          height={HERO_IMAGE_DIMENSIONS.height}
          className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(13_14_18/0.78),rgb(13_14_18/0.28)_48%,rgb(13_14_18/0.08))]" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary-fixed">Lecture guidée</p>
            <h2 className="mt-3 font-headline text-[clamp(2.25rem,7vw,5.4rem)] font-semibold leading-[0.95] text-[#F7F0DC] text-balance">
              Les départs et les contestations dans la diligence.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#E5DECB] sm:text-lg">
              Cette lecture guidée présente en six scènes l’application de la grille de Hirschman à la gouvernance et à la diligence.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(21rem,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        {isDesktopMedia && (
          <aside className="hidden lg:sticky lg:top-[calc(var(--topbar-h)+1.25rem)] lg:block">
            <div className="relative h-[calc(100vh-var(--topbar-h)-2.5rem)] min-h-[34rem] overflow-hidden rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest shadow-editorial-md">
              {scenes.map((scene, index) => {
                const dimensions = sceneImageDimensions(scene);
                return (
                  <img
                    key={scene.id}
                    src={scene.image}
                    alt={scene.alt}
                    width={dimensions.width}
                    height={dimensions.height}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={cn(
                      'absolute inset-0 h-full w-full object-cover',
                      reducedMotion ? '' : 'transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      active === index ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                );
              })}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_14_18/0.05),rgb(13_14_18/0.58))]" />
              <div className="absolute inset-x-5 bottom-5">
                <ScrollytellingProgress eyebrow={activeScene.eyebrow} title={activeScene.title} progress={progress} reducedMotion={reducedMotion} />
              </div>
            </div>
          </aside>
        )}

        <div className="space-y-7 lg:py-[10vh]">
          {scenes.map((scene, index) => {
            const Icon = scene.icon;
            const isActive = active === index;

            return (
              <ScrollytellingScene
                key={scene.id}
                sceneRef={(node) => {
                  sceneRefs.current[index] = node;
                }}
                index={index}
                active={isActive}
              >
                {!isDesktopMedia && (
                  <figure className="mb-6 overflow-hidden rounded-[1rem] border border-outline-variant lg:hidden">
                    <img
                      src={scene.image}
                      alt={scene.alt}
                      width={sceneImageDimensions(scene).width}
                      height={sceneImageDimensions(scene).height}
                      className="aspect-[4/3] w-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </figure>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-grid h-10 w-10 place-items-center rounded-full bg-primary-container text-primary-container-foreground">
                    <Icon size={18} aria-hidden />
                  </span>
                  <p className="eyebrow">{scene.eyebrow}</p>
                </div>

                <h3 className="mt-6 max-w-3xl font-headline text-[clamp(2rem,4.4vw,4.35rem)] font-semibold leading-[0.98] tracking-tight text-balance">
                  {scene.title}
                </h3>
                <p className="mt-5 max-w-2xl text-[1.08rem] leading-8 text-surface-variant sm:text-[1.18rem]">{scene.summary}</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {scene.notes.map((note) => (
                    <div key={note} className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-sm leading-6 text-foreground">
                      {note}
                    </div>
                  ))}
                </div>

                <p className="mt-8 max-w-2xl border-t border-outline-variant pt-5 font-headline text-2xl italic leading-snug text-foreground">
                  {scene.question}
                </p>
              </ScrollytellingScene>
            );
          })}

          <section className="rounded-[1.4rem] border border-outline-variant bg-secondary px-5 py-8 text-secondary-foreground shadow-editorial-md sm:px-8">
            <div className="flex items-center gap-3">
              <UsersRound size={20} className="text-primary-fixed" aria-hidden />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-primary-fixed">Synthèse opérationnelle</p>
            </div>
            <p className="mt-4 max-w-4xl font-headline text-[clamp(1.9rem,4vw,3.7rem)] font-semibold leading-tight text-balance">
              Les flux apportent des informations complémentaires sur la trajectoire d’une startup.
            </p>
            <div className="mt-7 grid gap-4 text-sm leading-7 text-[#E7E0CE] md:grid-cols-3">
              <p>Le départ silencieux d’un client limite l’information disponible ; une plainte en précise les motifs.</p>
              <p>Les départs d’employés peuvent signaler une difficulté avant son apparition dans les indicateurs suivis par le board.</p>
              <p>Pour un investisseur illiquide, les droits de gouvernance déterminent la capacité d’influence attachée à l’investissement.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
