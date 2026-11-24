# Maison Sapience VC — conventions de composition

Plateforme française d'intelligence et de formation en capital-risque. Registre
éditorial sobre et institutionnel ; vocabulaire visuel de livre ancien et de
carte marine : feuille d'or, marine profond, prune, parchemin.

## Envelopper l'arbre dans `DSProvider`

```jsx
const { DSProvider, Button, ParcoursRow } = window.VCPX;

<DSProvider>
  {/* toute composition utilisant le design system */}
</DSProvider>
```

Obligatoire. `DSProvider` fournit le contexte de routage, le thème et les
données locales de l'apprenant. Sans lui :

- toute carte ou rangée (elles rendent des `Link`) lève au rendu ;
- `BookmarkButton`, `ParcoursCard` et `ParcoursRow` lèvent — ils lisent la
  progression apprenant ;
- le thème n'est pas résolu.

Thème clair par défaut. Le thème sombre s'obtient par la classe `dark` sur un
ancêtre (`<div className="dark bg-background text-foreground">`) — **ajouter
`text-foreground`** : `dark` ne redéfinit que les variables, et la couleur de
texte déjà calculée plus haut serait héritée telle quelle, laissant des titres
en encre sombre sur fond nocturne.

## Vocabulaire de classes

Tailwind v3 sur tokens CSS sémantiques. **Choisir un rôle avant une couleur.**

### Classes propres au design system

| Classe | Emploi |
| --- | --- |
| `.btn-foil` | action principale d'une zone de décision (une seule par zone) |
| `.btn-ghost` | action secondaire visible |
| `.btn-quiet` | navigation discrète, filtre, commande légère |
| `.premium-card` | carte éditoriale |
| `.premium-card-hover` | à ajouter quand la carte est cliquable |
| `.chip` | étiquette, catégorie, état court |
| `.eyebrow` | surtitre en capitales espacées |
| `.running-head` | titre courant |
| `.gold-link` | lien doré dans le corps de texte |
| `.prose-editorial` | corps d'article long (titres, listes, emphases) |
| `.ornament-rule` | filet de séparation |
| `.underline-flourish`, `.ink-underline` | soulignement calligraphié d'un mot |
| `.glass-nav`, `.glass-rail` | verre dépoli de la navigation |
| `.sheen-host` | active le balayage lumineux d'un `.btn-foil` |
| `.contour-field`, `.map-paper` | textures de fond cartographiques |

### Familles d'utilitaires

- **Couleurs** — rôles `primary`, `secondary`, `tertiary`, `surface`, `outline`,
  `error`, `success`, `background`, `foreground`, combinés aux préfixes `bg-`,
  `text-`, `border-`, `ring-`, `fill-`. Modificateurs :
  `-foreground`, `-container`, `-container-foreground`, `-container-lowest`,
  `-container-low`, `-container-high`, `-container-highest`, `-dim`, `-bright`,
  `-variant`, `-fixed`, `-fixed-dim`.
  Exemples réels : `bg-surface-container-low`, `text-surface-variant`,
  `border-outline-variant`, `bg-primary-container`.
- **Typographie** — familles `font-headline` (Newsreader, titres),
  `font-body` (Plus Jakarta Sans, corps), `font-mono` (JetBrains Mono,
  surtitres et données). Échelle : `text-display-lg|md|sm`,
  `text-headline-lg|md|sm`, `text-label-lg|md|sm`.
- **Ombres** — `shadow-editorial-xs|sm|md|lg` ; ne pas utiliser les ombres
  Tailwind par défaut.
- **Rayons** — `rounded-sm|md|lg|xl|2xl`.
- **Animations** — `animate-fade-up`, `animate-fade-in`, `animate-scale-in`,
  `animate-slide-in-right`, `animate-pulse-glow`, `animate-shimmer`,
  `animate-float`, `animate-twinkle`, `animate-sheen`, `animate-draw`,
  `animate-compass-needle`, `animate-spin-slow`.

### Le piège à connaître

**Les suffixes d'opacité ne fonctionnent pas sur les couleurs sémantiques.**
`bg-primary/20` ou `text-outline/45` ne produisent aucune règle : les tokens
sont des variables CSS, pas des valeurs que Tailwind sait décomposer. Écrire :

```jsx
<span style={{ background: 'color-mix(in srgb, var(--primary) 20%, transparent)' }} />
// ou, en classe arbitraire :
className="border-[color-mix(in_srgb,var(--primary)_45%,transparent)]"
```

Les opacités fonctionnent normalement sur les couleurs littérales
(`bg-black/40`) et sur `opacity-*`.

## Où lire la vérité

- `styles.css` et sa fermeture d'imports — toutes les classes compilées et les
  tokens.
- `components/<groupe>/<Nom>/<Nom>.prompt.md` — quand employer un composant,
  ses limites, son contrat de props. **À lire avant de composer avec lui.**
- `guidelines/` — le document de design system complet.

Sept groupes : `primitives`, `progression`, `dialogues`, `marque-et-actions`,
`cartes`, `listes`, `ornaments`.

## Exemple idiomatique

```jsx
const { DSProvider, SectionHeading, ParcoursRow, Button } = window.VCPX;

<DSProvider>
  <section className="mx-auto max-w-3xl px-6 py-12">
    <SectionHeading
      eyebrow="Formation"
      title="Choisir son parcours"
      description="Vingt-quatre trajectoires, comparables sur le temps requis et le jalon."
    />
    <ul className="mt-8 divide-y divide-outline-variant">
      <ParcoursRow parcours={parcours} summary={summary} href={`/parcours/${parcours.slug}`} />
    </ul>
    <div className="mt-8 flex items-center gap-3">
      <Button variant="foil" className="sheen-host">Commencer</Button>
      <Button variant="quiet">Tout voir</Button>
    </div>
  </section>
</DSProvider>
```

Le composant de librairie porte le contrôle ; les classes du design system
portent la mise en page autour de lui.

## Deux règles éditoriales

- **Un inventaire destiné à être comparé se rend en rangées, pas en cartes.**
  `ParcoursRow` est la forme de référence ; `ParcoursCard` sert aux
  recommandations ciblées.
- **La progression n'est jamais décorative.** `ProgressBar` et `ProgressRing`
  représentent une donnée utilisateur réelle ; leur libellé accessible nomme ce
  qui est compté et son dénominateur.

# VCPX (@vcpx/design-system@0.1.0)

This design system is the published @vcpx/design-system React library, bundled as a single
browser global. All 39 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.VCPX`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).
- `guidelines/` — the design system's own usage guidance (1 doc(s), see `guidelines/index.md`). Read these before composing larger layouts.

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.VCPX.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { AntiPortfolioEntryCard } = window.VCPX;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<AntiPortfolioEntryCard />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<DSProvider>{children}</DSProvider>
```

## Tokens

100 CSS custom properties from @vcpx/design-system. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (18): `--surface`, `--on-surface`, `--surface-dim`, …
- **spacing** (3): `--tw-ring-inset`, `--tw-space-y-reverse`, `--tw-space-x-reverse`
- **radius** (1): `--radius`
- **shadow** (4): `--tw-ring-offset-shadow`, `--tw-ring-shadow`, `--tw-shadow`, …
- **other** (74): `--primary`, `--on-primary`, `--primary-container`, …

## Components

### cartes
- `AntiPortfolioEntryCard`
- `BlogCard`
- `CaseCard`
- `DeliverableCard`
- `EcosystemCard`
- `MemoCard`
- `ParcoursCard` — La carte de recommandation  tableau de bord, rsultat de profil.
- `SimulatorCard`

### marque-et-actions
- `BookmarkButton`
- `Logo`

### primitives
- `Button`
- `Chip`
- `EmptyState`
- `LevelBadge`
- `Reveal`
- `SectionHeading`

### ornaments
- `CompassRose` — Illustrations  the explorer's atlas visual language.
- `Constellation` — A drifting field of twinkling stars joined by faint navigation lines 
- `DropCap` — A framed, illuminated initial  for opening an article or section.
- `ExLibris` — A bookplate (from the library of), for the footer and reflective panels.
- `Fleuron` — Fleuron  the gilded  mark used as a brand seal and divider accent.
- `FleuronDivider` — A centered editorial divider with a fleuron.
- `GoldRule`
- `Graticule` — Faint map graticule used as a section/hero background.
- `InkStamp` — A rubber-stamp / wax seal mark, slightly rotated, with a hatched fill.
- `KanjiSeal` — A circular wax-seal style badge bearing a kanji and tinted by an accent color.
- `MapCartouche` — A decorative title cartouche, as drawn on antique maps.
- `NightSkyBackdrop` — A photographic starry sky shown only in dark mode, sat behind the
- `SeaMonster` — Hic sunt dracones. A leviathan curling through the waves  for map corners
- `WaxSeal` — A small tinted seal carrying a glyph (e.g. a path's kanji)  the lively,

### dialogues
- `ConfirmDialog` — Accessible confirmation dialog for irreversible actions (deletes).
- `Modal`

### listes
- `GlossaryRefList`
- `LessonRow`
- `ParcoursRow` — L'unit de l'index /parcours : une range comparable, pas une carte.

### progression
- `PageLoader`
- `ProgressBar`
- `ProgressRing`
- `Spinner`
