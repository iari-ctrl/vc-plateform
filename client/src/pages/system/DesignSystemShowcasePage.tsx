import { useState } from 'react';
import { usePageMeta } from '@/lib/seo';
import {
  Palette,
  Type,
  ToggleLeft,
  Layout,
  Compass,
  ArrowRight,
  Info,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import {
  Button,
  Chip,
  LevelBadge,
  SectionHeading,
  EmptyState,
  ProgressBar,
  ProgressRing,
  Spinner,
} from '@/components/ui/primitives';
import {
  Fleuron,
  FleuronDivider,
  GoldRule,
  KanjiSeal,
} from '@/components/ornaments/Ornaments';
import {
  CompassRose,
  SeaMonster,
  MapCartouche,
  InkStamp,
  ExLibris,
  DropCap,
  Constellation,
  NightSkyBackdrop,
  Graticule,
  WaxSeal,
} from '@/components/ornaments/Illustrations';

export default function DesignSystemShowcasePage() {
  usePageMeta(
    'Design System Showcase',
    'Découvrez le système de design de la plateforme VC Premium : couleurs, typographies, composants interactifs et ornements cartographiques.',
  );

  // Interactive states for demonstration
  const [progressVal, setProgressVal] = useState(68);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'buttons' | 'primitives' | 'cards' | 'ornaments'>('colors');

  const colorTokens = [
    {
      group: 'Palette Principale',
      description: 'L’ambiance éditoriale de la plateforme : or, marine, prune et parchemin.',
      items: [
        { name: '--primary', val: '#C5A85C', darkVal: '#D1B875', label: 'Or Garni', desc: 'Feuille d’or pour les accents premium, les états actifs et les liens.' },
        { name: '--on-primary', val: '#12131A', darkVal: '#0D0E12', label: 'Texte sur Or', desc: 'Couleur de contraste pour le texte posé sur un fond doré.' },
        { name: '--secondary', val: '#1E2D38', darkVal: '#8E9FB0', label: 'Marine Profond', desc: 'Le sérieux de l’analyse, utilisé pour l’ancrage et la structure.' },
        { name: '--tertiary', val: '#5A455C', darkVal: '#A68AA9', label: 'Prune Velours', desc: 'Nuances complémentaires pour enrichir les profils ou concepts.' },
        { name: '--background', val: '#FDFCF7', darkVal: '#0D0E12', label: 'Papier / Fond', desc: 'Texture papier parchemin en clair, encre nuit profonde en sombre.' },
        { name: '--on-background', val: '#12131A', darkVal: '#F4F2EB', label: 'Encre / Texte', desc: 'Contenu principal, contrasté pour une lecture prolongée.' },
      ],
    },
    {
      group: 'Surfaces & Conteneurs',
      description: 'Déclinaisons de teintes de fond pour hierarchiser les panneaux sans alourdir.',
      items: [
        { name: '--surface', val: '#FDFCF7', darkVal: '#0D0E12', label: 'Surface de base', desc: 'Fond général équivalent au papier de la page.' },
        { name: '--surface-container-lowest', val: '#FFFFFF', darkVal: '#050608', label: 'Container Très Clair', desc: 'Cartes et boutons de premier plan.' },
        { name: '--surface-container-low', val: '#F7F5EE', darkVal: '#131419', label: 'Container Bas', desc: 'Cartes secondaires ou fond discret au hover.' },
        { name: '--surface-container', val: '#F1EFE6', darkVal: '#1A1C22', label: 'Container Moyen', desc: 'Zones de fond secondaires et rails.' },
        { name: '--surface-container-high', val: '#EAE6DB', darkVal: '#22242B', label: 'Container Haut', desc: 'Bordures et séparations denses.' },
        { name: '--surface-container-highest', val: '#E0DBD0', darkVal: '#2D3039', label: 'Container Très Haut', desc: 'Surfaces d’accentuation locale.' },
      ],
    },
    {
      group: 'États Sémantiques & Contours',
      description: 'Signaux d’erreur, de réussite, de contours et séparateurs.',
      items: [
        { name: '--success', val: '#3E7C6A', darkVal: '#7FBBA8', label: 'Succès / Validation', desc: 'Feedback positif, validation de quiz ou sauvegardes.' },
        { name: '--error', val: '#B5544E', darkVal: '#E5928B', label: 'Erreur / Alerte', desc: 'Feedback négatif, champs invalides ou suppressions.' },
        { name: '--outline', val: '#8B8370', darkVal: '#6E685B', label: 'Contours majeurs', desc: 'Bordures structurantes et lignes d’écriture.' },
        { name: '--outline-variant', val: '#D9D2C2', darkVal: '#3F3C34', label: 'Séparateurs fins', desc: 'Lignes de séparation de listes, divisions éditoriales.' },
      ],
    },
  ];

  const sections = [
    { id: 'colors', label: 'Couleurs & Tons', icon: Palette },
    { id: 'typography', label: 'Typographie', icon: Type },
    { id: 'buttons', label: 'Boutons & Actions', icon: ToggleLeft },
    { id: 'primitives', label: 'Primitives UI', icon: Sliders },
    { id: 'cards', label: 'Cartes & Verre', icon: Layout },
    { id: 'ornaments', label: 'Ornements Atlas', icon: Compass },
  ] as const;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Graticule Background Effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[500px]">
        <Graticule className="h-full w-full opacity-10" />
      </div>

      <div className="mx-auto max-w-[var(--content-max)] px-4 pt-10 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <header className="relative isolate mb-12 flex flex-col items-center justify-center py-6 text-center">
          <MapCartouche
            title="Design System"
            sub="VC Premium Platform · MMXXVI"
            width={340}
            className="mb-6 drop-shadow-editorial-sm"
          />
          <p className="max-w-2xl font-body text-base leading-relaxed text-surface-variant">
            Ce catalogue présente les fondations visuelles et composants de la plateforme. 
            Il matérialise l'ambiance <span className="italic">« carnet d'explorateur et atlas cartographique »</span> 
            qui évite le rendu générique des SaaS classiques au profit d'un luxe éditorial sobre.
          </p>
          <FleuronDivider className="mt-8" />
        </header>

        {/* Tab Selector & Navigation */}
        <div className="mb-12 border-b border-outline-variant">
          <nav className="flex flex-wrap justify-center -mb-px gap-2 sm:gap-6" aria-label="Sections du design system">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 border-b-2 px-3 py-4 font-headline text-lg font-medium transition-colors ${
                    isActive
                      ? 'border-[color:var(--primary)] text-[color:var(--primary)]'
                      : 'border-transparent text-surface-variant hover:border-outline-variant hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Section Renderer */}
        <div className="grid gap-12">

          {/* 1. COLORS SECTION */}
          {activeTab === 'colors' && (
            <section className="animate-fade-in space-y-10" aria-label="Couleurs et Tons">
              <div className="max-w-3xl">
                <SectionHeading
                  eyebrow="Tons & contrastes"
                  title="Une palette inspirée du livre ancien"
                  description="La charte s'appuie sur la feuille d'or, le marine profond des cartes marines et le parchemin. Activez le mode sombre de la barre latérale pour observer la bascule des tokens."
                />
              </div>

              <div className="space-y-12">
                {colorTokens.map((group) => (
                  <div key={group.group} className="space-y-4">
                    <div>
                      <h3 className="font-headline text-xl font-semibold text-foreground">{group.group}</h3>
                      <p className="font-body text-xs text-surface-variant mt-1">{group.description}</p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map((token) => (
                        <div
                          key={token.name}
                          className="premium-card flex flex-col justify-between p-5"
                        >
                          <div>
                            {/* Color Preview Block */}
                            <div
                              className="h-16 w-full rounded-lg border border-outline-variant shadow-editorial-xs flex items-center justify-end px-3 font-mono text-[0.65rem]"
                              style={{
                                backgroundColor: `var(${token.name})`,
                                color: token.name.includes('--on-') || token.name === '--secondary' || token.name === '--tertiary' || token.name === '--error' || token.name === '--success' ? '#FFFFFF' : '#12131A'
                              }}
                            >
                              <span className="rounded bg-black/40 px-1.5 py-0.5 text-white backdrop-blur-sm">
                                {token.name}
                              </span>
                            </div>

                            <div className="mt-4">
                              <h4 className="font-headline text-base font-semibold leading-none">{token.label}</h4>
                              <p className="mt-1 font-mono text-[0.7rem] text-surface-variant">{token.name}</p>
                              <p className="mt-2 text-xs leading-relaxed text-surface-variant">{token.desc}</p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-outline-variant/40 pt-3 flex items-center justify-between text-[0.65rem] font-mono text-surface-variant">
                            <span>Clair: {token.val}</span>
                            <span>Sombre: {token.darkVal}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Semantic States Note */}
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-6 flex gap-4">
                <Info className="shrink-0 text-[color:var(--primary)]" size={20} />
                <div className="space-y-1">
                  <h4 className="font-headline text-sm font-semibold">Technique : Utilisation de color-mix</h4>
                  <p className="text-xs leading-relaxed text-surface-variant">
                    Pour préserver la cohérence chromatique et autoriser la transparence, nous n'utilisons jamais les modificateurs d'opacité Tailwind par défaut (ex: <code className="bg-surface px-1">bg-primary/20</code>). Nous exploitons exclusivement la fonction CSS <code className="bg-surface px-1">color-mix(in srgb, var(--primary) 20%, transparent)</code> afin que les navigateurs calculent proprement la transparence par-dessus les parchemins et ciels étoilés.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 2. TYPOGRAPHY SECTION */}
          {activeTab === 'typography' && (
            <section className="animate-fade-in space-y-10" aria-label="Typographie">
              <div className="max-w-3xl">
                <SectionHeading
                  eyebrow="Graphe & rythme"
                  title="Trois polices de caractère complémentaires"
                  description="Le lettrage distingue clairement la lecture au long cours, les indications utilitaires et les métadonnées techniques de capital-risque."
                />
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Newsreader */}
                <div className="premium-card p-6 space-y-4">
                  <div className="border-b border-outline-variant pb-3">
                    <span className="font-headline text-4xl text-[color:var(--primary)]">Aa</span>
                    <h3 className="font-headline text-lg font-semibold mt-1">Newsreader</h3>
                    <p className="font-mono text-[0.625rem] text-surface-variant uppercase tracking-wider">Titres & Citations (`font-headline`)</p>
                  </div>
                  <p className="text-xs text-surface-variant leading-relaxed">
                    Une police Serif à fort caractère éditorial. Ses italiques sont soignés pour marquer l'introspection ou le classicisme d'une citation. Pas de graisse 300.
                  </p>
                  <div className="space-y-2 pt-2">
                    <p className="font-headline text-2xl">L'Ikigai du venture</p>
                    <p className="font-headline text-2xl italic text-[color:var(--primary)]">Sérieux et ambition.</p>
                  </div>
                </div>

                {/* Plus Jakarta Sans */}
                <div className="premium-card p-6 space-y-4">
                  <div className="border-b border-outline-variant pb-3">
                    <span className="font-body text-4xl text-secondary">Aa</span>
                    <h3 className="font-headline text-lg font-semibold mt-1">Plus Jakarta Sans</h3>
                    <p className="font-mono text-[0.625rem] text-surface-variant uppercase tracking-wider">Corps & Contrôles (`font-body`)</p>
                  </div>
                  <p className="text-xs text-surface-variant leading-relaxed">
                    Une police Sans-Serif moderne et géométrique, extrêmement lisible à petite taille sur écran pour les formulaires, textes de cours et paramètres.
                  </p>
                  <div className="space-y-2 pt-2">
                    <p className="font-body text-sm font-semibold">Bouton de validation</p>
                    <p className="font-body text-sm text-surface-variant">Lisez les chapitres à votre propre rythme, sans authentification obligatoire.</p>
                  </div>
                </div>

                {/* JetBrains Mono */}
                <div className="premium-card p-6 space-y-4">
                  <div className="border-b border-outline-variant pb-3">
                    <span className="font-mono text-3xl text-tertiary">Aa</span>
                    <h3 className="font-headline text-lg font-semibold mt-1">JetBrains Mono</h3>
                    <p className="font-mono text-[0.625rem] text-surface-variant uppercase tracking-wider">Labels & Calculs (`font-mono`)</p>
                  </div>
                  <p className="text-xs text-surface-variant leading-relaxed">
                    Une police monospacée conçue pour la clarté du code. Nous l'utilisons pour les chiffres des simulateurs, les tags, les labels de statuts et les minutages.
                  </p>
                  <div className="space-y-2 pt-2">
                    <p className="font-mono text-xs font-bold text-[color:var(--primary)]">125 000 € · TME 25%</p>
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.32em] text-surface-variant">Lexicon · Vol. I</p>
                  </div>
                </div>
              </div>

              {/* Typographic Scale Table */}
              <div className="premium-card overflow-hidden">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
                  <h3 className="font-headline text-lg font-semibold">Échelle de taille et classes d'accent</h3>
                </div>
                <div className="divide-y divide-outline-variant/60 overflow-x-auto">
                  {[
                    { label: 'text-display-lg', font: 'font-headline', size: '2.6rem / 3.75rem', sample: 'Grand Héros', desc: 'Héros de page d’accueil' },
                    { label: 'text-display-md', font: 'font-headline', size: '2.25rem', sample: 'Titre de Parcours', desc: 'Titres majeurs de sections' },
                    { label: 'text-display-sm', font: 'font-headline', size: '1.875rem', sample: 'Titre de Leçon', desc: 'Titres de chapitres courants' },
                    { label: 'text-headline-md', font: 'font-headline', size: '1.5rem', sample: 'Titre de carte', desc: 'Entêtes de cartes éditoriales' },
                    { label: 'text-headline-sm', font: 'font-headline', size: '1.25rem', sample: 'Sous-section', desc: 'Sous-titres dans la prose' },
                    { label: 'prose-editorial', font: 'font-body', size: '1.0625rem / 1.85', sample: 'Le capital-risque n’est pas seulement...', desc: 'Pour les longs textes de lecture' },
                    { label: 'eyebrow', font: 'font-mono uppercase', size: '0.6875rem / 0.32em tracking', sample: 'Explorer la carte', desc: 'Surtitre de section' },
                    { label: 'running-head', font: 'font-headline italic uppercase', size: '0.6875rem / 0.4em tracking', sample: 'Tabula Ventura', desc: 'Accent de coin ou en-tête' },
                  ].map((scale) => (
                    <div key={scale.label} className="grid grid-cols-12 gap-4 p-6 items-center min-w-[700px]">
                      <div className="col-span-3">
                        <span className="font-mono text-xs font-semibold">{scale.label}</span>
                        <p className="text-[10px] text-surface-variant font-mono mt-1">{scale.font} ({scale.size})</p>
                      </div>
                      <div className="col-span-6">
                        <span className={`${scale.font} ${scale.label === 'eyebrow' ? 'eyebrow' : scale.label === 'running-head' ? 'running-head' : scale.label === 'prose-editorial' ? 'prose-editorial' : scale.label}`}>
                          {scale.sample}
                        </span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-xs text-surface-variant">{scale.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typographic Flourishes */}
              <div className="premium-card p-8 space-y-6">
                <h3 className="font-headline text-xl font-semibold border-b border-outline-variant pb-2">Ornements et fioritures de texte</h3>
                
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="eyebrow">Lettrines (DropCap)</p>
                    <div className="flex gap-4 items-start">
                      <DropCap letter="L" size={80} />
                      <p className="text-sm text-surface-variant leading-relaxed">
                        Le composant <code className="bg-surface-container px-1">DropCap</code> place une lettrine joliment encadrée au début d'un grand texte, dans le pur respect de l'édition imprimée.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="eyebrow mb-2">Surlignage d'or (underline-flourish)</p>
                      <p className="text-xl">
                        Un apprentissage <span className="underline-flourish">personnalisé</span> et à votre rythme.
                      </p>
                    </div>

                    <div>
                      <p className="eyebrow mb-2">Soulignement d'encre (ink-underline)</p>
                      <p className="text-xl">
                        Comprendre le VC avec sérieux et <span className="ink-underline">ambition.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. BUTTONS SECTION */}
          {activeTab === 'buttons' && (
            <section className="animate-fade-in space-y-10" aria-label="Boutons et Actions">
              <div className="max-w-3xl">
                <SectionHeading
                  eyebrow="Geste & action"
                  title="Une hiérarchie claire et réactive"
                  description="Les boutons de la plateforme possèdent des styles bien tranchés pour guider le clic sans perturber le confort de lecture."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Foil Button */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-6">
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Bouton Feuille d'Or</h3>
                    <p className="font-mono text-[0.625rem] text-surface-variant uppercase mt-1">`.btn-foil` / variant="foil"</p>
                    <p className="text-xs text-surface-variant mt-2 leading-relaxed">
                      L'action principale de la page (ex: commencer un test, valider un quiz). Il simule un reflet métallique avec un dégradé doré et un effet sweep au survol.
                    </p>
                  </div>
                  
                  <div className="py-4">
                    <Button variant="foil" className="sheen-host">
                      Démarrer le parcours <ArrowRight size={15} />
                    </Button>
                  </div>
                  
                  <div className="text-[10px] text-surface-variant font-mono">
                    Hover: Translation Y-0.5 + Ombre d'or accrue + Balayage diagonal (sheen)
                  </div>
                </div>

                {/* Ghost Button */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-6">
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Bouton Contraste</h3>
                    <p className="font-mono text-[0.625rem] text-surface-variant uppercase mt-1">`.btn-ghost` / variant="ghost"</p>
                    <p className="text-xs text-surface-variant mt-2 leading-relaxed">
                      Pour les actions secondaires mais visibles (ex: voir les chapitres alternatifs, retour au dictionnaire). Bordure fine et fond semi-opaque.
                    </p>
                  </div>

                  <div className="py-4">
                    <Button variant="ghost">
                      Explorer la carte
                    </Button>
                  </div>

                  <div className="text-[10px] text-surface-variant font-mono">
                    Hover: Transition vers fond opaque + Translation Y-0.5
                  </div>
                </div>

                {/* Quiet Button */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-6">
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Bouton Discret</h3>
                    <p className="font-mono text-[0.625rem] text-surface-variant uppercase mt-1">`.btn-quiet` / variant="quiet"</p>
                    <p className="text-xs text-surface-variant mt-2 leading-relaxed">
                      Pour les filtres de cartes, la commande légère ou les actions secondaires discrètes (ex: voir tout, annuler). Sans bordure.
                    </p>
                  </div>

                  <div className="py-4">
                    <Button variant="quiet">
                      Tous les simulateurs <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>

                  <div className="text-[10px] text-surface-variant font-mono">
                    Hover: Coloration du texte + Fond container low discret
                  </div>
                </div>
              </div>

              {/* State variations demo */}
              <div className="premium-card p-6">
                <h3 className="font-headline text-lg font-semibold mb-4 border-b border-outline-variant pb-2">Variations d'états techniques</h3>
                <div className="flex flex-wrap items-center justify-around gap-6 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-surface-variant">Actif standard</span>
                    <Button variant="foil" className="sheen-host">Foil Actif</Button>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-surface-variant">Avec icône et spinner</span>
                    <Button variant="foil" disabled className="gap-2">
                      <Spinner className="h-3.5 w-3.5 text-secondary" /> Enregistrement...
                    </Button>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-surface-variant">Désactivé (Disabled)</span>
                    <Button variant="ghost" disabled>Bouton verrouillé</Button>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-surface-variant">Discret désactivé</span>
                    <Button variant="quiet" disabled>Bouton discret bloqué</Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. PRIMITIVES SECTION */}
          {activeTab === 'primitives' && (
            <section className="animate-fade-in space-y-10" aria-label="Primitives UI">
              <div className="max-w-3xl">
                <SectionHeading
                  eyebrow="Structure & état"
                  title="Composants primitives interactifs"
                  description="Composants réutilisables pour afficher l'avancement pédagogique, les tags thématiques ou les retours d'erreurs."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Progress Indicators */}
                <div className="premium-card p-6 space-y-6">
                  <div className="border-b border-outline-variant pb-2 flex items-center justify-between">
                    <h3 className="font-headline text-base font-semibold">Indicateurs de progression</h3>
                    <span className="font-mono text-xs text-[color:var(--primary)]">{progressVal}%</span>
                  </div>

                  <p className="text-xs text-surface-variant leading-relaxed">
                    Les indicateurs de progression (`ProgressBar` & `ProgressRing`) acceptent une couleur d'accentuation liée au parcours thématique.
                  </p>

                  <div className="space-y-4 pt-2">
                    {/* Linear progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono text-surface-variant">
                        <span>Progression linéaire</span>
                        <span>{progressVal}%</span>
                      </div>
                      <ProgressBar value={progressVal} />
                    </div>

                    {/* Ring progress */}
                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex flex-col items-center gap-1">
                        <ProgressRing value={progressVal} size={50} label={`${progressVal}%`} />
                        <span className="text-[10px] font-mono text-surface-variant">ProgressRing</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1">
                        <ProgressRing value={progressVal} size={50} accent="var(--tertiary)" label={`${progressVal}%`} />
                        <span className="text-[10px] font-mono text-surface-variant">Coloration Plum</span>
                      </div>

                      {/* Interactive controller */}
                      <div className="flex-1 space-y-1.5">
                        <label htmlFor="progress-slider" className="text-[10px] font-mono text-surface-variant block">Simuler une progression :</label>
                        <input
                          id="progress-slider"
                          type="range"
                          min="0"
                          max="100"
                          value={progressVal}
                          onChange={(e) => setProgressVal(Number(e.target.value))}
                          className="w-full accent-[color:var(--primary)] bg-surface-container"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges and Chips */}
                <div className="premium-card p-6 space-y-6">
                  <div className="border-b border-outline-variant pb-2">
                    <h3 className="font-headline text-base font-semibold">Badges, Fiches & Chips</h3>
                  </div>

                  <p className="text-xs text-surface-variant leading-relaxed">
                    Marqueurs sémantiques discrets pour afficher les niveaux, les durées ou les types de cours.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-surface-variant block">Niveaux (`LevelBadge`) :</span>
                      <div className="flex flex-wrap gap-2">
                        <LevelBadge level="debutant" accent="#785A00" />
                        <LevelBadge level="intermediaire" accent="#24657E" />
                        <LevelBadge level="avance" accent="#6B4E71" />
                        <LevelBadge level="tous" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-surface-variant block">Tags standards (`Chip`) :</span>
                      <div className="flex flex-wrap gap-2">
                        <Chip>Term Sheet</Chip>
                        <Chip>Capital-Risque</Chip>
                        <Chip>Seed / Pre-seed</Chip>
                        <Chip>LP / GP Relations</Chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty state and Loader demo */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="premium-card p-6 space-y-4">
                  <span className="text-[10px] font-mono text-surface-variant block">État vide (`EmptyState`)</span>
                  <EmptyState
                    icon={<AlertCircle size={32} />}
                    title="Aucune note enregistrée"
                    description="Vous pouvez annoter n'importe quel paragraphe d'un cours en sélectionnant le texte pour l'ajouter à votre carnet."
                    action={<Button variant="ghost" className="px-4 py-2 text-xs">Découvrir la méthode d'annotation</Button>}
                  />
                </div>

                <div className="premium-card p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-surface-variant block mb-4">Chargement de page (`PageLoader` & `Spinner`)</span>
                    <p className="text-xs text-surface-variant leading-relaxed mb-6">
                      Des indicateurs de chargement non intrusifs dotés de contours à animer en CSS pour une navigation sans saccade.
                    </p>
                  </div>
                  
                  <div className="rounded-xl border border-outline-variant bg-surface px-6 py-8 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner className="h-6 w-6 text-[color:var(--primary)]" />
                      <span className="font-mono text-[10px] text-surface-variant">Chargement du carnet de voyage...</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. CARDS & GLASS SECTION */}
          {activeTab === 'cards' && (
            <section className="animate-fade-in space-y-10" aria-label="Cartes et Verre">
              <div className="max-w-3xl">
                <SectionHeading
                  eyebrow="Structure & volume"
                  title="Cartes éditoriales et verre dépoli"
                  description="Des bordures fines pour découper les blocs, et du verre dépoli (glassmorphism) réactif à l'ouverture pour flotter élégamment par-dessus la lecture."
                />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Premium Cards */}
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold">Les Cartes Éditoriales</h3>
                  <p className="text-xs text-surface-variant leading-relaxed">
                    Les composants <code className="bg-surface-container px-1">.premium-card</code> utilisent des ombres douces et une bordure à l'opacité contrôlée. Avec <code className="bg-surface-container px-1">.premium-card-hover</code>, le survol élève doucement la carte et fait réagir sa bordure en or fin.
                  </p>

                  <div className="grid gap-4 pt-2">
                    <div className="premium-card p-5">
                      <h4 className="font-headline text-lg font-semibold">Carte simple passive</h4>
                      <p className="text-sm text-surface-variant mt-1">Idéale pour présenter une information stable.</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-surface-variant">
                        <span>Statut : Référencé</span>
                        <span>01 Nov 2026</span>
                      </div>
                    </div>

                    <div className="premium-card premium-card-hover p-5 cursor-pointer">
                      <h4 className="font-headline text-lg font-semibold group-hover:text-[color:var(--primary)]">Carte réactive cliquable</h4>
                      <p className="text-sm text-surface-variant mt-1">Survolez-moi pour observer l'élévation d'encre.</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-surface-variant">
                        <span className="text-[color:var(--primary)] font-semibold">Explorer →</span>
                        <span>Interactif</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glassmorphism rail simulation */}
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold">Le Verre Dépoli (.glass-rail)</h3>
                  <p className="text-xs text-surface-variant leading-relaxed">
                    Le rail de navigation latérale utilise du verre dépoli. Replié, il est quasi-opaque. Ouvert, il flotte en overlay avec une ombre prononcée, une arête interne lumineuse et un flou modéré (<code className="bg-surface-container px-1">blur(14px)</code>).
                  </p>

                  <div className="rounded-xl border border-outline-variant bg-surface-container/30 p-6 flex flex-col justify-center items-center relative min-h-[200px] overflow-hidden">
                    {/* Simulated content behind */}
                    <div className="text-[9px] font-mono text-surface-variant/40 space-y-1 select-none">
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</p>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>
                    </div>

                    {/* Simulated closed rail */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-32 rounded-lg border border-outline-variant/40 glass-rail shadow-none flex items-center justify-center">
                      <span className="text-[10px] font-mono text-surface-variant text-center">Rail</span>
                    </div>

                    {/* Simulated opened glass rail overlay */}
                    <div
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-40 h-32 rounded-lg border border-outline-variant glass-rail p-3 flex flex-col justify-between shadow-editorial-md"
                      data-open="true"
                    >
                      <div>
                        <div className="h-1.5 w-8 rounded bg-primary/40 mb-2"></div>
                        <span className="text-[9px] font-semibold block text-foreground">Navigation</span>
                        <span className="text-[8px] text-surface-variant block">Dépoli en overlay</span>
                      </div>
                      <span className="text-[8px] font-mono text-right text-surface-variant">data-open="true"</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 6. ORNAMENTS SECTION */}
          {activeTab === 'ornaments' && (
            <section className="animate-fade-in space-y-10" aria-label="Ornements Atlas">
              <div className="max-w-3xl">
                <SectionHeading
                  eyebrow="Mood & boussole"
                  title="Le langage cartographique"
                  description="Des ornements dessinés à la main en SVG, sensibles au thème clair/sombre, qui apportent l'esprit atlas à la plateforme."
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. CompassRose */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-4">
                  <span className="text-[10px] font-mono text-surface-variant uppercase">Rose des vents (CompassRose)</span>
                  <div className="py-4">
                    <CompassRose size={100} />
                  </div>
                  <p className="text-xs text-surface-variant">
                    Survolez la boussole pour qu'elle s'oriente automatiquement d'un quart de tour, imitant le comportement d'une aiguille s'alignant sur un relèvement.
                  </p>
                </div>

                {/* 2. WaxSeal & KanjiSeal */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-4">
                  <span className="text-[10px] font-mono text-surface-variant uppercase">Sceaux de cire (Seals)</span>
                  <div className="flex items-center gap-6 py-6">
                    <div className="flex flex-col items-center gap-1">
                      <WaxSeal glyph="理" accent="var(--primary)" size={52} />
                      <span className="text-[9px] font-mono text-surface-variant">WaxSeal</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <KanjiSeal kanji="志" accent="var(--tertiary)" size={52} />
                      <span className="text-[9px] font-mono text-surface-variant">KanjiSeal</span>
                    </div>
                  </div>
                  <p className="text-xs text-surface-variant">
                    Le sceau de cire (<code className="bg-surface px-1">WaxSeal</code>) possède un dégradé radial imitant l'épaisseur de la cire, tandis que le sceau plat (<code className="bg-surface px-1">KanjiSeal</code>) sert de repère de parcours.
                  </p>
                </div>

                {/* 3. InkStamp */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-4">
                  <span className="text-[10px] font-mono text-surface-variant uppercase">Tampon à encre (InkStamp)</span>
                  <div className="py-6">
                    <InkStamp label="Accès libre" date="MMXXVI" hue="var(--secondary)" rotate={-5} />
                  </div>
                  <p className="text-xs text-surface-variant">
                    Simule un tampon encreur officiel légèrement incliné avec des hachures simulant un grain de papier brut en arrière-plan.
                  </p>
                </div>

                {/* 4. ExLibris */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-4 lg:col-span-1">
                  <span className="text-[10px] font-mono text-surface-variant uppercase">Ex Libris d’Explorateur</span>
                  <div className="w-full py-2">
                    <ExLibris owner="L’explorateur" num="Tome II · Atlas" className="mx-auto max-w-[200px]" />
                  </div>
                  <p className="text-xs text-surface-variant">
                    Inséré dans le pied de page pour signer l'appartenance de la plateforme à un carnet d'étude.
                  </p>
                </div>

                {/* 5. SeaMonster */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-4">
                  <span className="text-[10px] font-mono text-surface-variant uppercase">Monstre marin (SeaMonster)</span>
                  <div className="py-4">
                    <SeaMonster size={90} />
                  </div>
                  <p className="text-xs text-surface-variant">
                    Clin d'œil aux cartes anciennes ("Hic sunt dracones"). Utilisé pour meubler discrètement les angles vides et la page d'erreur 404 (terre inconnue).
                  </p>
                </div>

                {/* 6. Fleuron */}
                <div className="premium-card p-6 flex flex-col justify-between items-center text-center space-y-4">
                  <span className="text-[10px] font-mono text-surface-variant uppercase">Fleurons (Fleuron & Dividers)</span>
                  <div className="py-8 space-y-4 w-full">
                    <div className="flex justify-center">
                      <Fleuron className="text-2xl" />
                    </div>
                    <FleuronDivider />
                    <GoldRule />
                  </div>
                  <p className="text-xs text-surface-variant">
                    Le fleuron ❦ est la marque de ponctuation signature. Les séparateurs utilisent un dégradé doux s'effaçant vers les marges.
                  </p>
                </div>
              </div>

              {/* NightSkyBackdrop Demonstration */}
              <div className="premium-card overflow-hidden relative isolate p-8 min-h-[220px] flex flex-col justify-end">
                {/* Simulated Dark Mode Backdrop inside card for demo */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0D0E12]" />
                <NightSkyBackdrop variant="panel" className="block" />
                <Constellation className="pointer-events-none absolute inset-0 opacity-40" />

                <div className="max-w-xl text-white">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--primary)]">Mode Sombre Uniquement</p>
                  <h3 className="font-headline text-2xl font-semibold mt-2 text-white">Ciel étoilé & constellations (NightSky)</h3>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">
                    En mode sombre, la texture parchemin est remplacée par un fond photographique étoilé (<code className="bg-white/10 px-1 text-white">bg-sombre.webp</code>) couplé à une constellation animée en SVG pour simuler le ciel nocturne de l'explorateur.
                  </p>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Back Link */}
        <footer className="mt-16 text-center">
          <Button variant="ghost" as="link" to="/home" className="inline-flex items-center gap-2">
            Retour à l'accueil
          </Button>
        </footer>
      </div>
    </div>
  );
}
