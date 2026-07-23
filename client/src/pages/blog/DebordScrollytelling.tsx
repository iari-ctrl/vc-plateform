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
import { publicAssetUrl } from '@shared/base-url.mjs';
import { ScrollytellingProgress, ScrollytellingScene } from '@/components/blog/ScrollytellingPrimitives';
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

const ASSET_BASE = publicAssetUrl('blog/la-societe-du-spectacle-leve-des-fonds', import.meta.env.BASE_URL);

const PORTRAIT_IMAGE_DIMENSIONS = { width: 1080, height: 1350 } as const;
const TILE_IMAGE_DIMENSIONS = { width: 640, height: 640 } as const;
const VIDEO_DIMENSIONS = { width: 1280, height: 720 } as const;

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
    note: "Cette logique convertit du capital en expériences dont les résultats pourront informer le tour suivant.",
    image: `${ASSET_BASE}/logique-carburant.webp`,
    alt: "Emblème d'un réservoir contenant une flamme, figurant la levée-carburant.",
  },
  {
    id: 'signal',
    label: 'Signal',
    note: "L'annonce vise à rassurer les acheteurs, soutenir le recrutement et dissuader certains concurrents.",
    image: `${ASSET_BASE}/logique-signal.webp`,
    alt: "Emblème d'un phare projetant un faisceau unique, figurant la levée-signal.",
  },
  {
    id: 'validation',
    label: 'Validation',
    note: "La capacité à lever sert de preuve de désirabilité ; le communiqué détaille le tour sans toujours préciser son emploi.",
    image: `${ASSET_BASE}/logique-validation.webp`,
    alt: "Emblème d'un sceau de cire pressé, figurant la levée-validation.",
  },
  {
    id: 'monnaie',
    label: 'Monnaie',
    note: "La valorisation sert de monnaie interne pour attirer et retenir les talents ; la valeur du papier dépend de son évolution.",
    image: `${ASSET_BASE}/logique-monnaie.webp`,
    alt: "Emblème d'un jeton dressé sur sa tranche, figurant la levée-monnaie.",
  },
  {
    id: 'rituel',
    label: 'Rituel',
    note: "Les tours suivent parfois un rythme de 18 à 24 mois fixé par les usages du marché, indépendamment des jalons opérationnels.",
    image: `${ASSET_BASE}/logique-rituel.webp`,
    alt: "Emblème d'une roue calendaire, figurant la levée-rituel.",
  },
  {
    id: 'offre',
    label: 'Poussée par l’offre',
    note: "Les fonds répondent à leurs contraintes de déploiement, de visibilité du portefeuille et de justification de l'AUM.",
    image: `${ASSET_BASE}/logique-offre.webp`,
    alt: "Emblème d'un courant de capital poursuivant une petite figure, figurant la levée poussée par l'offre.",
  },
  {
    id: 'theatre',
    label: 'Théâtre',
    note: "La valorisation faciale est maintenue tandis que des préférences supplémentaires sont inscrites dans les annexes.",
    image: `${ASSET_BASE}/logique-theatre.webp`,
    alt: "Emblème d'un masque de théâtre devant un rideau, figurant la levée-théâtre.",
  },
  {
    id: 'produit',
    label: 'Produit',
    note: "Dans cette logique, la succession des tours devient l'activité déterminante et se poursuit jusqu'à l'insolvabilité.",
    image: `${ASSET_BASE}/logique-produit.webp`,
    alt: "Emblème d'une boucle fermée, figurant la levée-produit.",
  },
];

const scenes: Scene[] = [
  {
    id: 'ouverture',
    eyebrow: '01 · Ouverture',
    title: '« Tout ce qui était directement vécu s’est éloigné dans une représentation. »',
    summary:
      "En 1967, Debord ouvre La Société du spectacle par l'idée qu'une couche d'images intervient entre les individus et le monde. Le spectacle désigne chez lui un stade du capitalisme dans lequel l'image de la chose peut se substituer à la chose dans les rapports sociaux. Cette grille s'applique au capital-risque, qui valorise des actifs dont une part substantielle appartient encore au futur et dépend donc de récits.",
    image: `${ASSET_BASE}/ouverture.webp`,
    alt: "Collage montrant une scène de rue et sa représentation lumineuse superposée.",
    icon: Clapperboard,
    notes: [
      '« Ce qui apparaît est bon, ce qui est bon apparaît. »',
      'Le spectacle désigne un rapport social médiatisé par des images.',
      "Le prix d'un actif dont la valeur se situe largement dans le futur dépend fortement du récit qui l'accompagne.",
    ],
    question: "Que reste-t-il de directement vécu une fois retirés l'annonce, le deck et le fondateur en scène ?",
  },
  {
    id: 'double',
    eyebrow: '02 · Le double',
    title: "L'entreprise et sa représentation constituent deux objets distincts pour l'analyse.",
    summary:
      "Une jeune entreprise peut être appréhendée par ses éléments opérationnels — un produit inachevé, trois clients, des dettes techniques — et par sa représentation : le deck, la démo, le communiqué, le profil du fondateur. La chaîne de financement examine principalement cette seconde catégorie. Les cas de Nikola, Gemini et Juicero illustrent des écarts importants entre le produit observé et la représentation présentée.",
    image: `${ASSET_BASE}/double-poster.webp`,
    alt: "Vue partagée entre l'atelier d'une startup et sa représentation dans un miroir.",
    icon: Split,
    video: 'double',
    notes: [
      "L'investisseur consulte une data room préparée, une démo répétée et un récit calibré.",
      'Les cas de Nikola, Gemini et Juicero documentent des écarts importants entre représentation et produit.',
      "L'utilisation autonome du produit, hors de la présence du fondateur, fournit un test direct.",
    ],
    question: "Qu'ai-je vécu directement de cette entreprise ?",
  },
  {
    id: 'paraitre',
    eyebrow: '03 · Paraître',
    title: "Être, avoir, paraître dans la présentation d'une entreprise.",
    summary:
      "La thèse 17 décrit un passage de l'être à l'avoir, puis de l'avoir au paraître. Dans cette lecture, être consiste à construire ce que des personnes utilisent ; avoir à réunir les preuves — ARR, rétention, unit economics ; paraître à optimiser leur apparence. L'AI-washing illustre cette logique à grande échelle, et le cas Builder.ai en constitue un exemple documenté. Une forme courante concerne l'ARR « ajusté » et le pilote gratuit présenté comme contrat.",
    image: `${ASSET_BASE}/paraitre.webp`,
    alt: "Trois socles étiquetés être, avoir et paraître, éclairés avec des intensités croissantes.",
    icon: Layers,
    notes: [
      "L'AI-washing applique cette logique à grande échelle.",
      'La facilité de production des apparences détermine l’effort de vérification nécessaire.',
      "Les preuves difficiles à simuler apportent une information plus robuste.",
    ],
    question: 'Quelle preuve présentée renvoie à un élément difficile à simuler ?',
  },
  {
    id: 'valorisation',
    eyebrow: '04 · La valorisation',
    title: '« Le capital à un tel degré d’accumulation qu’il devient image. »',
    summary:
      "La thèse 34 permet de lire la valorisation privée comme une image du capital. Le statut de licorne ne fournit à lui seul aucune information sur les flux ni la liquidité ; il produit un signal destiné aux candidats, aux clients et aux fonds suivants. Le TVPI d'un fonds reste une estimation jusqu'à confirmation par le DPI, comme l'industrie l'a réappris après 2021. Les méga-tours de l'ère IA illustrent une fonction de signal lorsque le montant levé sert à présenter une trajectoire comme inévitable.",
    image: `${ASSET_BASE}/valorisation-poster.webp`,
    alt: "Tour composée de blocs représentant le capital, dont le sommet se dissout en lumière.",
    icon: Coins,
    video: 'valorisation',
    notes: [
      'Le statut de licorne ne fournit à lui seul aucune mesure de liquidité.',
      'Le TVPI est une image jusqu’à ce que le DPI le confirme.',
      'Le prix correspond à une image négociée ; la valeur, à une espérance de flux.',
    ],
    question: 'Quelle part du prix relève du titre public et quelle part des conditions contractuelles ?',
  },
  {
    id: 'markup',
    eyebrow: '05 · Le markup',
    title: '« Un rapport social médiatisé par des images. »',
    summary:
      "Les thèses 4 et 12 décrivent un rapport social et son mécanisme de validation : « ce qui apparaît est bon, ce qui est bon apparaît ». Une levée met en relation fondateurs, fonds, LPs et concurrents au moyen du montant, de la valorisation et des logos. La validation peut devenir circulaire : le seed du fonds A est validé par la série A du fonds B, puis par le tour suivant. Le social proof stack systématise cette autoréférence, tandis que la FOMO en renforce les effets.",
    image: `${ASSET_BASE}/markup.webp`,
    alt: "Un anneau fermé de silhouettes d'investisseurs se validant l'une l'autre dans un cercle autoréférentiel.",
    icon: RefreshCw,
    notes: [
      'Un markup peut devenir à la fois signal de qualité et validation de ce signal.',
      'Le social proof évalue le reflet d’une évaluation faite par d’autres.',
      "La réévaluation d'un dossier peut repartir des preuves primaires, indépendamment du tour de table.",
    ],
    question: 'Quel serait mon niveau de conviction sans les logos ?',
  },
  {
    id: 'vedette',
    eyebrow: '06 · La vedette',
    title: 'Le fondateur comme « représentation spectaculaire de l’homme vivant ».',
    summary:
      "Les thèses 60-61 attribuent à la vedette une fonction de représentation. Le capital abstrait acquiert ainsi un visage. Theranos et le profil hagiographique retiré après l'effondrement illustrent des cas extrêmes. Plus couramment, les formats de sélection — introduction chaleureuse, pitch de vingt minutes, demo day — favorisent les compétences de scène, qui ne recouvrent que partiellement les compétences opérationnelles et peuvent défavoriser des opérateurs moins à l'aise avec ces formats.",
    image: `${ASSET_BASE}/vedette-poster.webp`,
    alt: "Un fondateur sur une scène, devant une projection agrandie de son image.",
    icon: Sparkles,
    video: 'vedette',
    notes: [
      'Le système donne un visage au capital abstrait.',
      'Les formats de sélection favorisent les compétences de scène et peuvent défavoriser certains opérateurs.',
      "Les notes d'analyse peuvent distinguer aptitude narrative et aptitude opératoire.",
    ],
    question: 'Quelles observations documentent les aptitudes narrative et opératoire de cette personne ?',
  },
  {
    id: 'logiques',
    eyebrow: '07 · Les huit logiques',
    title: '« Lever des fonds » recouvre huit logiques distinctes.',
    summary:
      "« Lever des fonds » désigne couramment le financement de l'entreprise et peut remplir plusieurs fonctions, souvent cumulées et parfois contradictoires. Leur identification précise la lecture d'un dossier : l'analyse détermine la logique dominante et en évalue les effets.",
    image: `${ASSET_BASE}/markup.webp`,
    alt: "Grille des huit logiques de la levée.",
    icon: LayoutGrid,
    tiles: LOGIQUES,
    notes: [],
    question: 'Quelles fonctions opérationnelles et symboliques ce tour remplit-il ?',
  },
  {
    id: 'spectateur',
    eyebrow: '08 · Le spectateur',
    title: '« Plus il contemple, moins il vit. »',
    summary:
      "La thèse 30 peut être rapprochée du temps pseudo-cyclique, de la récupération et du spectaculaire intégré. Les cycles de hype — web3, métavers, IA, agents — organisent le capital par saisons alors que les actifs mûrissent sur un temps plus long. La critique du venture est devenue une catégorie d'investissement ; les fonds, devenus médias, produisent des récits qui valorisent leurs positions. L'investisseur peut ainsi consacrer ses journées à des contenus médiatisés sans contact primaire, alors que l'avantage informationnel repose sur une présence directe là où le vécu n'est pas encore représenté.",
    image: `${ASSET_BASE}/spectateur.webp`,
    alt: "Un spectateur assis face à un écran, avec une roue représentant des cycles narratifs en arrière-plan.",
    icon: Eye,
    notes: [
      'Les cycles de hype suivent un temps court ; les résultats des actifs apparaissent sur un temps long.',
      "L'analyse d'une critique devenue catégorie inclut les intérêts de ses producteurs.",
      'Une information déjà largement diffusée est généralement intégrée dans les prix.',
    ],
    question: 'Quel est mon ratio de contact primaire ce trimestre ?',
  },
  {
    id: 'couper-le-son',
    eyebrow: '09 · Situation construite',
    title: 'La situation construite réduit la possibilité de représentation.',
    summary:
      "Le programme positif des situationnistes est la situation construite : un moment de vie directement vécu, organisé pour échapper à la médiation. En diligence comme en détection de talents, ce principe conduit à observer des situations concrètes : un essai payé sur un problème réel, une session de travail et des échanges avec des clients churnés. Son usage requiert plusieurs garde-fous : prise en compte des fréquences de base, vérification de l'adossement du récit et reconnaissance de la distribution comme compétence déterminante dans certains secteurs.",
    image: `${ASSET_BASE}/couper-le-son.webp`,
    alt: "Deux personnes se serrent la main dans une salle éclairée, devant des écrans éteints.",
    icon: VolumeX,
    notes: [
      'Les situations sont conçues pour limiter le script et observer la réponse à des contraintes réelles.',
      'Garde-fous : fréquences de base, récit adossé à des preuves et rôle de la distribution.',
      'Le coût en journées de cette méthode s’apprécie au regard des montants engagés.',
    ],
    question: 'Quelle logique domine cette levée et quels éléments ai-je observés directement ?',
  },
];

function sceneImageDimensions(scene: Scene) {
  return scene.video ? VIDEO_DIMENSIONS : PORTRAIT_IMAGE_DIMENSIONS;
}

/** Looping, muted panel video with a poster fallback (two sources, webm then mp4). */
function SceneVideo({
  scene,
  className,
  videoRef,
  autoPlay = false,
  preload = 'none',
}: {
  scene: Scene;
  className?: string;
  videoRef?: (node: HTMLVideoElement | null) => void;
  /** Off for the stacked sticky layers — playback is driven by the active-scene effect. */
  autoPlay?: boolean;
  preload?: 'none' | 'metadata';
}) {
  return (
    <video
      ref={videoRef}
      className={className}
      poster={scene.image}
      width={VIDEO_DIMENSIONS.width}
      height={VIDEO_DIMENSIONS.height}
      muted
      loop
      playsInline
      preload={preload}
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
  const isDesktopMedia = useMediaQuery('(min-width: 1024px)');
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
            alt="Auditorium obscur face à un écran présentant une représentation idéalisée d'une entreprise."
            width={VIDEO_DIMENSIONS.width}
            height={VIDEO_DIMENSIONS.height}
            className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
          />
        ) : (
          <video
            className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
            poster={`${ASSET_BASE}/hero-poster.webp`}
            width={VIDEO_DIMENSIONS.width}
            height={VIDEO_DIMENSIONS.height}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay
            aria-label="Auditorium obscur face à un écran présentant une représentation idéalisée d'une entreprise."
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
              La Société du spectacle appliquée aux levées de fonds.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#E5DECB] sm:text-lg">
              Neuf scènes mettent en relation les concepts de Debord et les pratiques d'investissement.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(21rem,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        {isDesktopMedia && (
          <aside className="hidden lg:sticky lg:top-[calc(var(--topbar-h)+1.25rem)] lg:block">
            <div className="relative h-[calc(100vh-var(--topbar-h)-2.5rem)] min-h-[34rem] overflow-hidden rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest shadow-editorial-md">
              <div ref={mediaLayerRef} className={cn('absolute inset-0', !reducedMotion && 'will-change-transform')}>
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
                            <img
                              key={tile.id}
                              src={tile.image}
                              alt=""
                              width={TILE_IMAGE_DIMENSIONS.width}
                              height={TILE_IMAGE_DIMENSIONS.height}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
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
                        preload={isActive ? 'metadata' : 'none'}
                        videoRef={(node) => {
                          panelVideoRefs.current[index] = node;
                        }}
                      />
                    );
                  }

                  const dimensions = sceneImageDimensions(scene);
                  return (
                    <img
                      key={scene.id}
                      src={scene.image}
                      alt={scene.alt}
                      width={dimensions.width}
                      height={dimensions.height}
                      className={layerClass}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  );
                })}
              </div>
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
            const isRevealed = reducedMotion || revealed[index];

            return (
              <ScrollytellingScene
                key={scene.id}
                sceneRef={(node) => {
                  sceneRefs.current[index] = node;
                }}
                index={index}
                active={isActive}
              >
                <div
                  className={cn(
                    reducedMotion ? '' : 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  )}
                >
                  {!isDesktopMedia && !scene.tiles && (
                    <figure className="mb-6 overflow-hidden rounded-[1rem] border border-outline-variant lg:hidden">
                      {scene.video && !reducedMotion ? (
                        <SceneVideo scene={scene} className="aspect-[16/10] w-full object-cover" autoPlay={false} preload="none" />
                      ) : (
                        <img
                          src={scene.image}
                          alt={scene.alt}
                          width={sceneImageDimensions(scene).width}
                          height={sceneImageDimensions(scene).height}
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
                          <img
                            src={tile.image}
                            alt={tile.alt}
                            width={TILE_IMAGE_DIMENSIONS.width}
                            height={TILE_IMAGE_DIMENSIONS.height}
                            className="aspect-square w-full object-cover"
                            loading="lazy"
                          />
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
              </ScrollytellingScene>
            );
          })}

          <section className="rounded-[1.4rem] border border-outline-variant bg-secondary px-5 py-8 text-secondary-foreground shadow-editorial-md sm:px-8">
            <div className="flex items-center gap-3">
              <Compass size={20} className="text-primary-fixed" aria-hidden />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-primary-fixed">Questions de synthèse</p>
            </div>
            <p className="mt-4 max-w-4xl font-headline text-[clamp(1.9rem,4vw,3.7rem)] font-semibold leading-tight text-balance">
              Examiner les éléments observables d’un dossier et les fonctions de son financement.
            </p>
            <div className="mt-7 grid gap-4 text-sm leading-7 text-[#E7E0CE] md:grid-cols-3">
              <p>Après retrait de l’annonce, du deck et de la présentation du fondateur, quels éléments ai-je observés directement ?</p>
              <p>Quelle logique domine ce tour, et que révèlent le titre public et les conditions contractuelles ?</p>
              <p>Quelles observations documentent les aptitudes de cette personne, et quel est mon ratio de contact primaire ce trimestre ?</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
