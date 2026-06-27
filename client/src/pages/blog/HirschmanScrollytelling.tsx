import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, Footprints, MessageSquareText, Network, ShieldCheck, Split, UsersRound, type LucideIcon } from 'lucide-react';
import type { BlogPost } from '@/content/types';
import { cn } from '@/lib/utils';

const ASSET_BASE = '/blog/exit-voice-loyalty-hirschman';

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
    title: 'Partir, protester, rester: les trois verbes qui lisent toute organisation.',
    summary:
      "Hirschman commence par une idée simple: face au déclin, l'exit et la voice ne se complètent pas toujours. Ils se disputent l'attention, l'énergie et le temps disponible pour réparer.",
    image: `${ASSET_BASE}/triangle.webp`,
    alt: "Instrument abstrait à trois trajectoires lumineuses représentant l'exit, la voice et la loyauté.",
    icon: Split,
    notes: [
      "L'exit sanctionne sans expliquer.",
      'La voice explique mais demande du pouvoir.',
      "La loyauté retarde le départ, assez longtemps pour qu'une réparation existe.",
    ],
    question: 'Qui part, qui proteste, qui reste, et pourquoi ?',
  },
  {
    id: 'venture-voice',
    eyebrow: '02 · Illiquidité',
    title: 'Le VC est une classe d’actifs où l’exit est fermé, donc la voice devient le métier.',
    summary:
      "Quand l'investisseur ne peut pas vendre pendant sept à dix ans, ses vrais instruments ne sont pas décoratifs: board seat, droits d'information, protective provisions. Le term sheet achète une capacité de parole.",
    image: `${ASSET_BASE}/governance.webp`,
    alt: "Salle de board abstraite avec fils dorés, porte verrouillée et instruments de gouvernance.",
    icon: MessageSquareText,
    notes: [
      "La liquidité facile de 2021 a rendu la voice optionnelle.",
      'Quand la fenêtre de sortie se ferme, un chèque sans influence devient une captivité.',
      'La gouvernance est un canal de réparation, pas une annexe juridique.',
    ],
    question: 'Quel canal d’influence le prix payé donne-t-il vraiment ?',
  },
  {
    id: 'founders',
    eyebrow: '03 · Origine',
    title: 'Un fondateur intéressant a souvent épuisé sa voice avant de créer son exit.',
    summary:
      "Les meilleurs départs ne sont pas des fuites molles. Ce sont des diagnostics qui n'ont pas été entendus: Shockley vers Fairchild, PARC vers Adobe ou Apple, Cisco vers Zoom.",
    image: `${ASSET_BASE}/hero.webp`,
    alt: 'Carte institutionnelle abstraite avec trajectoires dorées quittant puis réorganisant une salle sombre.',
    icon: ArrowDownRight,
    notes: [
      "La provenance compte moins que la raison du départ.",
      'La voice passée laisse des traces: alliés, prototypes, clients internes.',
      'Le founder-market fit ressemble souvent à un problème vu de l’intérieur.',
    ],
    question: 'Qu’avait-il tenté de changer avant de partir ?',
  },
  {
    id: 'attrition',
    eyebrow: '04 · Départs',
    title: 'Les moyennes mentent: les meilleurs partent souvent avant que les KPIs ne rougissent.',
    summary:
      "La regretted attrition est un capteur avancé. Les premiers employés partis, leur ordre de départ et ce qu'ils ont rejoint racontent la qualité réelle plus tôt que les métriques de surface.",
    image: `${ASSET_BASE}/flows.webp`,
    alt: "Flux dorés quittant un vaisseau abstrait de startup avec signaux lumineux de protestation.",
    icon: Footprints,
    notes: [
      'Le churn brut compte moins que les noms qui quittent.',
      "Les références fournies rassurent, les personnes parties instruisent.",
      "Le talent qui rejoint depuis une meilleure maison est aussi un vote par exit.",
    ],
    question: 'Qui savait le plus, et quand est-il parti ?',
  },
  {
    id: 'loyalty',
    eyebrow: '05 · Loyauté',
    title: 'La loyauté répare seulement si celui qui reste pourrait réellement partir.',
    summary:
      "La rétention peut être conviction ou captivité. Vesting, mission, options non liquides et coûts irrécupérables fabriquent parfois une fidélité silencieuse qui ne corrige plus rien.",
    image: `${ASSET_BASE}/governance.webp`,
    alt: 'Instruments abstraits de gouvernance et porte verrouillée, dans une palette navy, or et prune.',
    icon: ShieldCheck,
    notes: [
      'Loyauté lucide: je reste, je conteste, je pourrais partir.',
      "Loyauté captive: je reste parce que l'exit coûte trop cher.",
      'Une thèse morte peut aussi retenir un investisseur par coûts irrécupérables.',
    ],
    question: 'La rétention observée parle-t-elle encore ?',
  },
  {
    id: 'grid',
    eyebrow: '06 · Grille',
    title: 'Lire une organisation par ses flux, pas par ses stocks.',
    summary:
      "Effectifs, parts de marché et cap table sont des photographies. Hirschman pousse à demander le film: qui entre, qui sort, qui proteste, qui se tait, et qui a le droit de faire corriger le système.",
    image: `${ASSET_BASE}/flows.webp`,
    alt: 'Carte abstraite de flux de diligence reliant employés, clients, fondateurs, LPs et investisseurs.',
    icon: Network,
    notes: [
      'Startup: flux d’employés et de clients.',
      'Fondateur: histoire personnelle d’exit et de voice.',
      'Fonds: LPs, re-ups, objections et fidélité réelle.',
    ],
    question: 'Montrez-moi vos flux, et qui peut y exercer une voice.',
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function HirschmanScrollytelling({ post }: { post: BlogPost }) {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
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
          className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(13_14_18/0.78),rgb(13_14_18/0.28)_48%,rgb(13_14_18/0.08))]" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary-fixed">Lecture guidée</p>
            <h2 className="mt-3 font-headline text-[clamp(2.25rem,7vw,5.4rem)] font-semibold leading-[0.95] text-[#F7F0DC] text-balance">
              La diligence comme carte des départs.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#E5DECB] sm:text-lg">
              Même article, autre cadence: six scènes pour faire passer Hirschman du livre à la table de board.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(21rem,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <aside className="hidden lg:sticky lg:top-[calc(var(--topbar-h)+1.25rem)] lg:block">
          <div className="relative h-[calc(100vh-var(--topbar-h)-2.5rem)] min-h-[34rem] overflow-hidden rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest shadow-editorial-md">
            {scenes.map((scene, index) => (
              <img
                key={scene.id}
                src={scene.image}
                alt={scene.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover',
                  reducedMotion ? '' : 'transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  active === index ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_14_18/0.05),rgb(13_14_18/0.58))]" />
            <div className="absolute inset-x-5 bottom-5">
              <div className="rounded-2xl border border-[#D1B875]/35 bg-[#11131A]/82 p-5 text-[#F4F2EB] shadow-editorial-lg">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#D1B875]">{activeScene.eyebrow}</p>
                <p className="mt-2 font-headline text-2xl font-semibold leading-tight">{activeScene.title}</p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#F4F2EB]/16">
                  <div
                    className={cn('h-full origin-left rounded-full bg-[#D1B875]', reducedMotion ? '' : 'transition-transform duration-500 ease-out')}
                    style={{ transform: `scaleX(${progress})` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-7 lg:py-[10vh]">
          {scenes.map((scene, index) => {
            const Icon = scene.icon;
            const isActive = active === index;

            return (
              <section
                key={scene.id}
                ref={(node) => {
                  sceneRefs.current[index] = node;
                }}
                data-scene-index={index}
                className={cn(
                  'rounded-[1.4rem] border bg-surface-container-lowest p-5 shadow-editorial-sm sm:p-7 lg:min-h-[74vh] lg:p-8',
                  isActive ? 'border-[color-mix(in_srgb,var(--primary)_55%,var(--outline-variant))]' : 'border-outline-variant',
                )}
              >
                <figure className="mb-6 overflow-hidden rounded-[1rem] border border-outline-variant lg:hidden">
                  <img src={scene.image} alt={scene.alt} className="aspect-[4/3] w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                </figure>

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
              </section>
            );
          })}

          <section className="rounded-[1.4rem] border border-outline-variant bg-secondary px-5 py-8 text-secondary-foreground shadow-editorial-md sm:px-8">
            <div className="flex items-center gap-3">
              <UsersRound size={20} className="text-primary-fixed" aria-hidden />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-primary-fixed">Synthèse opérationnelle</p>
            </div>
            <p className="mt-4 max-w-4xl font-headline text-[clamp(1.9rem,4vw,3.7rem)] font-semibold leading-tight text-balance">
              Avant de juger une startup, demandez ce que ses flux ont déjà confessé.
            </p>
            <div className="mt-7 grid gap-4 text-sm leading-7 text-[#E7E0CE] md:grid-cols-3">
              <p>Les clients silencieux ne donnent pas un diagnostic, les plaintes oui.</p>
              <p>Les employés partis savent souvent avant le board ce qui a cessé de fonctionner.</p>
              <p>Un investisseur enfermé sans voice n’a pas acheté du venture, mais une option muette.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
