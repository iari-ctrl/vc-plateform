import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Clapperboard,
  Coins,
  Compass,
  Eye,
  Layers,
  LayoutGrid,
  RefreshCw,
  Sparkles,
  Split,
  VolumeX,
  type LucideIcon,
} from 'lucide-react';
import type { BlogPost } from '@/content/types';
import { cn } from '@/lib/utils';

const ASSET_BASE = '/blog/la-societe-du-spectacle-leve-des-fonds';

type Tile = {
  id: string;
  label: string;
  note: string;
  image: string;
  alt: string;
};

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  /** Poster/still shown as the panel image and the reduced-motion / mobile fallback. */
  image: string;
  alt: string;
  icon: LucideIcon;
  notes: string[];
  question: string;
  /** Basename of a looping background video (e.g. 'double'); absent ⇒ still only. */
  video?: string;
  /** The eight logiques — only on the central sequence scene. */
  tiles?: Tile[];
};

const LOGIQUES: Tile[] = [
  {
    id: 'carburant',
    label: 'Carburant',
    note: "La seule à valeur d'usage : convertir du capital en expériences dont le tour suivant lira les résultats.",
    image: `${ASSET_BASE}/logique-carburant.webp`,
    alt: "Emblème d'un réservoir contenant une flamme, figurant la levée-carburant.",
  },
  {
    id: 'signal',
    label: 'Signal',
    note: "L'annonce est le produit : rassurer les acheteurs, armer le recrutement, intimider les concurrents.",
    image: `${ASSET_BASE}/logique-signal.webp`,
    alt: "Emblème d'un phare projetant un faisceau unique, figurant la levée-signal.",
  },
  {
    id: 'validation',
    label: 'Validation',
    note: "On lève pour prouver qu'on peut lever ; le communiqué parle du tour, pas de ce qu'il finance.",
    image: `${ASSET_BASE}/logique-validation.webp`,
    alt: "Emblème d'un sceau de cire pressé, figurant la levée-validation.",
  },
  {
    id: 'monnaie',
    label: 'Monnaie',
    note: "La valorisation comme monnaie interne : on retient les talents en papier, qui ne vaut que si l'image monte.",
    image: `${ASSET_BASE}/logique-monnaie.webp`,
    alt: "Emblème d'un jeton dressé sur sa tranche, figurant la levée-monnaie.",
  },
  {
    id: 'rituel',
    label: 'Rituel',
    note: "On lève tous les 18 à 24 mois parce que la liturgie du marché le prescrit ; le calendrier remplace la causalité.",
    image: `${ASSET_BASE}/logique-rituel.webp`,
    alt: "Emblème d'une roue calendaire liturgique, figurant la levée-rituel.",
  },
  {
    id: 'offre',
    label: 'Poussée par l’offre',
    note: "Côté investisseur : déployer, montrer des logos, justifier l'AUM. Le capital cherche l'entreprise.",
    image: `${ASSET_BASE}/logique-offre.webp`,
    alt: "Emblème d'un courant de capital poursuivant une petite figure, figurant la levée poussée par l'offre.",
  },
  {
    id: 'theatre',
    label: 'Théâtre',
    note: "Préserver l'image en dégradant la substance : valorisation faciale tenue, préférences multipliées dans les annexes.",
    image: `${ASSET_BASE}/logique-theatre.webp`,
    alt: "Emblème d'un masque de théâtre devant un rideau, figurant la levée-théâtre.",
  },
  {
    id: 'produit',
    label: 'Produit',
    note: "Le stade terminal : l'entreprise dont le véritable produit est le tour, jusqu'à l'insolvabilité.",
    image: `${ASSET_BASE}/logique-produit.webp`,
    alt: "Emblème d'une boucle fermée se rebouclant sur elle-même, figurant la levée-produit.",
  },
];

const scenes: Scene[] = [
  {
    id: 'ouverture',
    eyebrow: '01 · Ouverture',
    title: '« Tout ce qui était directement vécu s’est éloigné dans une représentation. »',
    summary:
      "En 1967, Debord ouvre La Société du spectacle sur ce constat : entre les hommes et le monde s'est glissée une couche d'images qui prétend être le monde. Le spectacle n'est ni la télévision ni la publicité, mais un stade du capitalisme où l'image de la chose remplace la chose. Aucune industrie n'a porté cette logique aussi loin que le venture, parce qu'aucune ne price des actifs dont la substance est à ce point future, donc narrative.",
    image: `${ASSET_BASE}/ouverture.webp`,
    alt: "Collage situationniste où une scène de rue vécue se décolle pour révéler une représentation lumineuse idéalisée.",
    icon: Clapperboard,
    notes: [
      '« Ce qui apparaît est bon, ce qui est bon apparaît. »',
      'Le spectacle est un rapport social médiatisé par des images, pas un décor.',
      "Plus l'actif est futur, plus son prix est une affaire de récit.",
    ],
    question: "Que reste-t-il de directement vécu une fois retirés l'annonce, le deck et le fondateur en scène ?",
  },
  {
    id: 'double',
    eyebrow: '02 · Le double',
    title: "La startup existe en deux exemplaires, et le financement ne touche que le second.",
    summary:
      "Une jeune entreprise existe en double : l'entreprise réelle — un produit inachevé, trois clients, des dettes techniques — et sa représentation : le deck, la démo, le communiqué, le profil du fondateur. Toute la chaîne de financement est construite pour ne toucher que le second exemplaire. Nikola, Gemini, Juicero : quand l'écart devint béant, le spectacle ne décorait pas le produit, il en tenait lieu.",
    image: `${ASSET_BASE}/double-poster.webp`,
    alt: "Une startup scindée par un miroir vertical : un atelier réel modeste d'un côté, sa représentation lustrée de l'autre.",
    icon: Split,
    video: 'double',
    notes: [
      'La data room est préparée, la démo répétée, le récit calibré.',
      'Nikola, Gemini, Juicero : la représentation tenait lieu de produit.',
      'Le test le plus rentable : utiliser le produit seul, sans le fondateur dans la pièce.',
    ],
    question: "Qu'ai-je vécu directement de cette entreprise ?",
  },
  {
    id: 'paraitre',
    eyebrow: '03 · Paraître',
    title: "Être, avoir, paraître : la troisième phase du pitch.",
    summary:
      "Thèse 17, la plus prophétique : la première phase de l'économie a dégradé l'être en avoir ; la phase présente dégrade l'avoir en paraître. Être, c'est construire ce que des gens utilisent ; avoir, c'est posséder les preuves — ARR, rétention, unit economics ; paraître, c'est optimiser les apparences de preuves. L'AI-washing en est la version industrielle ; Builder.ai, la version terminale. La version douce et quotidienne tient dans l'ARR « ajusté » et le pilote gratuit présenté comme contrat.",
    image: `${ASSET_BASE}/paraitre.webp`,
    alt: "Trois socles ascendants distingués par la seule lumière — être, avoir, paraître — le troisième le plus éclatant.",
    icon: Layers,
    notes: [
      "L'AI-washing est le paraître à l'échelle industrielle.",
      'Le paraître coûte cher à fabriquer, sa vérification reste paresseuse.',
      "Chercher la trace d'être qui ne se simule pas à coût raisonnable.",
    ],
    question: 'Pour chaque preuve présentée, où est l’être qui ne se simule pas ?',
  },
  {
    id: 'valorisation',
    eyebrow: '04 · La valorisation',
    title: '« Le capital à un tel degré d’accumulation qu’il devient image. »',
    summary:
      "Thèse 34, d'une littéralité gênante : la valorisation privée est du capital devenu image. Le statut de licorne ne correspond à aucun flux, aucune liquidité — c'est une image dont la fonction est d'être vue, par les candidats, les clients, les fonds suivants. Le TVPI d'un fonds reste une image jusqu'à ce que le DPI le confirme, comme l'industrie l'a réappris après 2021. Les méga-tours de l'ère IA poussent la logique à son terme : le montant levé comme déclaration d'inévitabilité.",
    image: `${ASSET_BASE}/valorisation-poster.webp`,
    alt: "Une tour de capital accumulé qui s'embrase au sommet et se dissout en lumière flottante.",
    icon: Coins,
    video: 'valorisation',
    notes: [
      'Le statut de licorne ne correspond à aucune liquidité.',
      'Le TVPI est une image jusqu’à ce que le DPI le confirme.',
      'Distinguer le prix — image négociée — de la valeur — espérance de flux.',
    ],
    question: 'Le prix est-il une image — le titre — ou un terme — la structure ?',
  },
  {
    id: 'markup',
    eyebrow: '05 · Le markup',
    title: '« Un rapport social médiatisé par des images. »',
    summary:
      "Thèse 4, et thèse 12 pour son mécanisme de validation : « ce qui apparaît est bon, ce qui est bon apparaît ». Une levée est un rapport social — fondateurs, fonds, LPs, concurrents — entièrement médiatisé par des images : le montant, la valorisation, les logos. La preuve y est circulaire : le seed du fonds A est validé par la série A du fonds B, validée par la série C du fonds suivant. Le social proof stack en est la forme la plus pure ; le FOMO n'en est pas l'accident mais le régime de croisière.",
    image: `${ASSET_BASE}/markup.webp`,
    alt: "Un anneau fermé de silhouettes d'investisseurs se validant l'une l'autre dans un cercle autoréférentiel.",
    icon: RefreshCw,
    notes: [
      '« Ce qui est marked-up est bon, ce qui est bon est marked-up. »',
      'Le social proof évalue le reflet d’une évaluation faite par d’autres.',
      'Re-souscrire depuis les preuves primaires, jamais depuis le tour de table.',
    ],
    question: 'Ma conviction survivrait-elle à la disparition des logos ?',
  },
  {
    id: 'vedette',
    eyebrow: '06 · La vedette',
    title: 'Le fondateur comme « représentation spectaculaire de l’homme vivant ».',
    summary:
      "Thèses 60-61 : la vedette n'est pas une personne mais une fonction — le capital abstrait a besoin d'un visage, et le système le fabrique. Theranos, le profil hagiographique retiré après l'effondrement : le cas extrême masque le biais ordinaire. Tout le funnel — intro chaleureuse, pitch de vingt minutes, demo day — sélectionne des compétences de scène, qui ne recouvrent que partiellement les compétences d'opérateur, et filtre silencieusement d'excellents opérateurs sans théâtre.",
    image: `${ASSET_BASE}/vedette-poster.webp`,
    alt: "Un fondateur minuscule sur une scène éclairée, dominé par une colossale projection vacillante de lui-même.",
    icon: Sparkles,
    video: 'vedette',
    notes: [
      'Le capital abstrait a besoin d’un visage ; le système le fabrique.',
      'Le funnel promeut le talent de scène et filtre l’opérateur sans théâtre.',
      'Séparer explicitement, dans ses notes, aptitude narrative et aptitude opératoire.',
    ],
    question: 'Ai-je vu cette personne travailler en situation, ou se représenter en entretien ?',
  },
  {
    id: 'logiques',
    eyebrow: '07 · Les huit logiques',
    title: '« Lever des fonds » recouvre huit logiques distinctes.',
    summary:
      "Officiellement, « lever des fonds » désigne une seule opération — financer l'entreprise. En réalité, le mot recouvre des logiques distinctes, souvent cumulées, parfois contradictoires. Les nommer change la lecture d'un deal : pour chaque tour, le vôtre ou celui d'un dossier, on identifie la logique dominante et on la price honnêtement.",
    image: `${ASSET_BASE}/markup.webp`,
    alt: "Grille des huit logiques de la levée.",
    icon: LayoutGrid,
    tiles: LOGIQUES,
    notes: [],
    question: 'Qu’est-ce que ce tour fait, à part exister comme annonce ?',
  },
  {
    id: 'spectateur',
    eyebrow: '08 · Le spectateur',
    title: '« Plus il contemple, moins il vit. »',
    summary:
      "Thèse 30, prolongée par le temps pseudo-cyclique, la récupération et le spectaculaire intégré. Les cycles de hype — web3, métavers, IA, agents — sont la mode du capital, qui price en temps de saison des actifs mûrissant en temps long. La critique du venture est devenue une catégorie d'investissement ; les fonds, devenus médias, produisent le récit qui valorise leurs positions, et le thermomètre appartient au patient. L'investisseur peut alors passer ses journées en pure contemplation, sans un seul contact primaire — quand l'avantage du métier fut toujours l'inverse : être là où le vécu n'est pas encore représenté.",
    image: `${ASSET_BASE}/spectateur.webp`,
    alt: "Un spectateur assis baigné dans la lueur d'un écran, une roue de cycles narratifs saisonniers tournant derrière lui.",
    icon: Eye,
    notes: [
      'Les cycles de hype sont la mode du capital ; le verdict vit en temps long.',
      'Quand une critique devient une catégorie, le thermomètre appartient au patient.',
      'Ce qui est déjà dans le flux est déjà pricé.',
    ],
    question: 'Quel est mon ratio de contact primaire ce trimestre ?',
  },
  {
    id: 'couper-le-son',
    eyebrow: '09 · Couper le son',
    title: 'La situation construite : retirer la possibilité de représentation.',
    summary:
      "Le programme des situationnistes ne fut pas la dénonciation mais la situation construite : un moment de vie directement vécu, organisé pour échapper à la médiation. En diligence comme en détection de talents, c'est le meilleur protocole anti-spectacle : un travail d'essai payé sur un problème réel, une session de travail plutôt qu'une présentation, des clients churnés appelés plutôt que les références fournies. La grille a ses garde-fous — la base rate d'abord, le récit qui reste une technologie de coordination réelle, la distribution qui est parfois le travail même.",
    image: `${ASSET_BASE}/couper-le-son.webp`,
    alt: "Les écrans éteints ; en plein jour mat, deux mains anonymes se serrent, sans spectacle.",
    icon: VolumeX,
    notes: [
      'Concevoir des situations où le réel résiste : pas de script, pas de public à charmer.',
      'Garde-fous : la base rate d’abord, le récit adossé, la distribution parfois décisive.',
      'La situation construite coûte des jours ; le spectacle coûte des millions.',
    ],
    question: 'Quelle logique domine cette levée — et qu’en ai-je vu, plutôt qu’entendu ?',
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

/** Looping, muted panel video with a poster fallback (two sources, webm then mp4). */
function SceneVideo({
  scene,
  className,
  videoRef,
  autoPlay = true,
}: {
  scene: Scene;
  className?: string;
  videoRef?: (node: HTMLVideoElement | null) => void;
  /** Off for the stacked sticky layers — playback is driven by the active-scene effect. */
  autoPlay?: boolean;
}) {
  return (
    <video
      ref={videoRef}
      className={className}
      poster={scene.image}
      muted
      loop
      playsInline
      preload="metadata"
      autoPlay={autoPlay}
      aria-label={scene.alt}
    >
      <source src={`${ASSET_BASE}/${scene.video}.webm`} type="video/webm" />
      <source src={`${ASSET_BASE}/${scene.video}.mp4`} type="video/mp4" />
    </video>
  );
}

export function DebordScrollytelling({ post }: { post: BlogPost }) {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>(() => scenes.map(() => false));
  const reducedMotion = usePrefersReducedMotion();
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const mediaLayerRef = useRef<HTMLDivElement | null>(null);
  const panelVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  // Active scene + permanent reveal flags, from a reference line at scroll time.
  // Height-independent on purpose: an IntersectionObserver keyed on
  // intersectionRatio never fires for a section taller than the detection band
  // (e.g. the eight-tiles scene on narrow viewports), leaving it unrevealed.
  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      const line = vh * 0.42;

      let nextActive = -1;
      const revealedNow: number[] = [];
      sceneRefs.current.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top < vh * 0.85 && rect.bottom > 0) revealedNow.push(index);
        if (rect.top <= line && rect.bottom > line) nextActive = index;
      });

      // Between two sections nothing crosses the line — keep the current scene.
      if (nextActive >= 0) setActive(nextActive);

      if (revealedNow.length) {
        setRevealed((prev) => {
          let changed = false;
          const next = [...prev];
          for (const index of revealedNow) {
            if (!next[index]) {
              next[index] = true;
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Play only the active scene's panel video; pause the rest (perf + battery).
  useEffect(() => {
    panelVideoRefs.current.forEach((node, index) => {
      if (!node) return;
      if (!reducedMotion && index === active) {
        const played = node.play();
        if (played && typeof played.catch === 'function') played.catch(() => {});
      } else {
        node.pause();
      }
    });
  }, [active, reducedMotion]);

  // Subtle GPU parallax on the sticky media, driven by the active scene's scroll progress.
  useEffect(() => {
    if (reducedMotion) {
      if (mediaLayerRef.current) mediaLayerRef.current.style.transform = '';
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const node = sceneRefs.current[active];
      const layer = mediaLayerRef.current;
      if (!node || !layer) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      const shift = (progress - 0.5) * 26;
      layer.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active, reducedMotion]);

  const activeScene = scenes[active] ?? scenes[0];
  const progress = useMemo(() => (active + 1) / scenes.length, [active]);

  return (
    <section className="mt-10" aria-label={`Version scrollytelling de ${post.title}`}>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest shadow-editorial-lg">
        {reducedMotion ? (
          <img
            src={`${ASSET_BASE}/hero-poster.webp`}
            alt="Auditorium obscur tourné vers un écran lumineux qui projette une version idéalisée d'une entreprise."
            className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
          />
        ) : (
          <video
            className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
            poster={`${ASSET_BASE}/hero-poster.webp`}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay
            aria-label="Auditorium obscur tourné vers un écran lumineux qui projette une version idéalisée d'une entreprise."
          >
            <source src={`${ASSET_BASE}/hero.webm`} type="video/webm" />
            <source src={`${ASSET_BASE}/hero.mp4`} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(13_14_18/0.82),rgb(13_14_18/0.34)_48%,rgb(13_14_18/0.10))]" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary-fixed">Lecture guidée</p>
            <h2 className="mt-3 font-headline text-[clamp(2.25rem,7vw,5.4rem)] font-semibold leading-[0.95] text-[#F7F0DC] text-balance">
              La société du spectacle lève des fonds.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#E5DECB] sm:text-lg">
              Même article, autre cadence : neuf scènes pour faire passer Debord du livre à la table de board.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(21rem,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <aside className="hidden lg:sticky lg:top-[calc(var(--topbar-h)+1.25rem)] lg:block">
          <div className="relative h-[calc(100vh-var(--topbar-h)-2.5rem)] min-h-[34rem] overflow-hidden rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest shadow-editorial-md">
            <div ref={mediaLayerRef} className="absolute inset-0 will-change-transform">
              {scenes.map((scene, index) => {
                const isActive = active === index;
                const layerClass = cn(
                  'absolute inset-0 h-full w-full object-cover',
                  reducedMotion ? '' : 'scale-[1.04] transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  isActive ? 'opacity-100' : 'opacity-0',
                );

                if (scene.tiles) {
                  // Central sequence scene: a montage of the eight logiques
                  // (the captioned grid lives in the scrolling column on the right).
                  return (
                    <div key={scene.id} aria-hidden className={cn(layerClass, 'bg-[#11131A]')}>
                      <div className="grid h-full w-full grid-cols-2 grid-rows-4">
                        {scene.tiles.map((tile) => (
                          <img key={tile.id} src={tile.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ))}
                      </div>
                    </div>
                  );
                }

                if (scene.video && !reducedMotion) {
                  return (
                    <SceneVideo
                      key={scene.id}
                      scene={scene}
                      className={layerClass}
                      autoPlay={false}
                      videoRef={(node) => {
                        panelVideoRefs.current[index] = node;
                      }}
                    />
                  );
                }

                return <img key={scene.id} src={scene.image} alt={scene.alt} className={layerClass} loading={index === 0 ? 'eager' : 'lazy'} />;
              })}
            </div>
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
            const isRevealed = reducedMotion || revealed[index];

            return (
              <section
                key={scene.id}
                ref={(node) => {
                  sceneRefs.current[index] = node;
                }}
                data-scene-index={index}
                data-active={isActive ? 'true' : 'false'}
                className={cn(
                  'rounded-[1.4rem] border bg-surface-container-lowest p-5 shadow-editorial-sm sm:p-7 lg:min-h-[74vh] lg:p-8',
                  isActive ? 'border-[color-mix(in_srgb,var(--primary)_55%,var(--outline-variant))]' : 'border-outline-variant',
                )}
              >
                <div
                  className={cn(
                    reducedMotion ? '' : 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  )}
                >
                  {!scene.tiles && (
                    <figure className="mb-6 overflow-hidden rounded-[1rem] border border-outline-variant lg:hidden">
                      {scene.video && !reducedMotion ? (
                        <SceneVideo scene={scene} className="aspect-[16/10] w-full object-cover" />
                      ) : (
                        <img
                          src={scene.image}
                          alt={scene.alt}
                          className="aspect-[4/5] w-full object-cover"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      )}
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

                  {scene.tiles ? (
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {scene.tiles.map((tile, tileIndex) => (
                        <figure
                          key={tile.id}
                          className={cn(
                            'overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low',
                            reducedMotion ? '' : 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                          )}
                          style={reducedMotion ? undefined : { transitionDelay: `${tileIndex * 60}ms` }}
                        >
                          <img src={tile.image} alt={tile.alt} className="aspect-square w-full object-cover" loading="lazy" />
                          <figcaption className="px-3 py-3">
                            <p className="font-headline text-sm font-semibold leading-tight text-foreground">{tile.label}</p>
                            <p className="mt-1.5 text-xs leading-5 text-surface-variant">{tile.note}</p>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {scene.notes.map((note) => (
                        <div key={note} className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-sm leading-6 text-foreground">
                          {note}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-8 max-w-2xl border-t border-outline-variant pt-5 font-headline text-2xl italic leading-snug text-foreground">
                    {scene.question}
                  </p>
                </div>
              </section>
            );
          })}

          <section className="rounded-[1.4rem] border border-outline-variant bg-secondary px-5 py-8 text-secondary-foreground shadow-editorial-md sm:px-8">
            <div className="flex items-center gap-3">
              <Compass size={20} className="text-primary-fixed" aria-hidden />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-primary-fixed">Couper le son</p>
            </div>
            <p className="mt-4 max-w-4xl font-headline text-[clamp(1.9rem,4vw,3.7rem)] font-semibold leading-tight text-balance">
              Débrancher la bande-son d’un deal pour regarder l’image muette.
            </p>
            <div className="mt-7 grid gap-4 text-sm leading-7 text-[#E7E0CE] md:grid-cols-3">
              <p>Si je retire l’annonce, le deck et le fondateur en scène, que reste-t-il de directement vécu ?</p>
              <p>Quelle logique domine ce tour, et le prix est-il une image ou un terme ?</p>
              <p>Ai-je vu cette personne en situation, et quel est mon ratio de contact primaire ce trimestre ?</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
