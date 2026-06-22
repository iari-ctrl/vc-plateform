# Design System - VC Premium Platform

Dernière mise à jour : 2026-06-12

Objet : formaliser le système visuel et interactionnel de `vc-premium-platform` afin de garder une expérience cohérente pendant le travail éditorial, pédagogique et produit, en intégrant les derniers ajouts (i18n, auto-détection pédagogique, alignements UI).

---

## 1. Positionnement

VC Premium Platform doit se lire comme un atelier éditorial premium : carnet d'apprentissage, atlas d'exploration, dictionnaire vivant et memo d'investissement.

Le design ne doit pas ressembler à un dashboard SaaS générique. Il doit soutenir trois gestes :

- lire et comprendre ;
- annoter, sauvegarder, reprendre ;
- explorer un parcours d'apprentissage sans se sentir enfermé.

Mots-clés de direction artistique :


- cabinet d'analyse ;
- carnet d'explorateur ;
- atlas cartographique ;
- feuille d'or et papier éditorial ;
- précision VC, chaleur pédagogique.

---

## 2. Sources techniques du design system

Les primitives actuelles sont distribuées dans plusieurs fichiers :

| Zone | Fichier |
| --- | --- |
| Tokens CSS | `client/src/styles/tokens.css` |
| Styles globaux et classes composants | `client/src/styles/global.css` |
| Configuration Tailwind | `client/tailwind.config.ts` |
| Styles portail splash | `client/src/styles/splash.css` |
| Primitives UI | `client/src/components/ui/primitives.tsx` |
| Cartes éditoriales | `client/src/components/cards.tsx` |
| Ornements / langage atlas | `client/src/components/ornaments/*` |
| Splash / boussole animée | `client/src/components/splash/CompassIkigaiIntro.tsx` |
| Lecture active | `client/src/components/reading/*` |
| Découpage front | `client/src/content/*.ts` + `client/vite.config.ts` |

Le projet utilise Tailwind CSS v3 avec tokens CSS sémantiques. La règle de base : utiliser les tokens existants avant d'ajouter une couleur, une taille ou une ombre.

Les collections JSON de contenu sont séparées par modules (`paths.ts`, `courses.ts`, `lessons.ts`, etc.) et le vendor React est isolé dans le build. Les surfaces visuelles chargées tôt doivent donc importer la collection exacte dont elles ont besoin, pas le barrel complet `@/content`. Le glossaire et les leçons vont plus loin : seul l'**index léger** (`GLOSSARY`, `LESSONS`) est eager ; les définitions et corps complets se chargent à la demande (`loadGlossaryTerm`, `loadLesson`) — n'importez le contenu lourd que sur la page qui le rend réellement (lecteur de leçon, fiche de dictionnaire).

---

## 3. Tokens de couleur

### Palette principale

| Usage | Token | Valeur claire | Rôle |
| --- | --- | ---: | --- |
| Accent premium | `--primary` | `#C5A85C` | feuille d'or, CTA, progression, liens importants |
| Texte sur primaire | `--on-primary` | `#12131A` | texte sur bouton doré |
| Conteneur primaire | `--primary-container` | `#F6ECCB` | fonds doux liés à l'or |
| Marine éditorial | `--secondary` | `#1E2D38` | profondeur, navigation, ancrage sérieux |
| Prune velours | `--tertiary` | `#5A455C` | accent secondaire, profils, nuances premium |
| Fond principal | `--background` | `#FDFCF7` | papier/parchemin |
| Texte principal | `--on-background` | `#12131A` | encre principale |

### États et retours

| Usage | Token | Rôle |
| --- | --- | --- |
| Succès / Validation | `--success` | Alertes positives, feedback de sauvegarde, validation |
| Erreur / Destructif | `--error` | Alertes négatives, champs invalides, boutons de suppression |

### Surfaces

| Token | Usage recommandé |
| --- | --- |
| `--surface` | fond de page principal |
| `--surface-container-lowest` | cartes et panneaux très clairs |
| `--surface-container-low` | cartes secondaires, hover discret |
| `--surface-container` | zones de fond, états actifs doux |
| `--surface-container-high` | séparations visuelles plus denses |
| `--surface-container-highest` | fond de contraste local |
| `--on-surface-variant` | texte secondaire, métadonnées |

### Contours

| Token | Usage |
| --- | --- |
| `--outline` | contours structurants |
| `--outline-variant` | séparateurs, bordures de cartes, lignes éditoriales |

### Mode sombre

Le mode sombre est complet et piloté par `.dark`. Il ne doit pas inverser brutalement la marque : il doit conserver une ambiance "encre profonde + accents dorés + ciel de navigation".

Spécificités mode sombre (2026-06-01) :

- le toggle « Choisissez votre lumière » du portail splash (`/`) pilote désormais le `ThemeContext` global — le choix persiste sur l'accueil et dans toute l'app ;
- sur `/home`, le hero et la carte `PathAtlas` affichent le ciel étoilé photographique (`bg-sombre.webp`) en fond via `NightSkyBackdrop`, **uniquement en sombre** (`hidden dark:block`) ;
- le parchemin `map-paper` est conservé en mode clair ; en mode sombre, la photo passe derrière les tracés SVG (constellation dessinée, routes pointillées, sceaux, rose des vents).

Règles :

- ne jamais coder une couleur sombre en dur sans alternative ;
- préférer `bg-surface-*`, `text-surface-variant`, `border-outline-variant` ;
- réserver les couleurs hex directes aux accents de contenu (`path.accent`, `sim.accent`) ou aux états métier stables ;
- les conteneurs qui hébergent `NightSkyBackdrop` (photo en `-z-10`) doivent avoir `isolate` pour créer leur propre contexte d'empilement, sinon le fond semi-opaque du conteneur masque la photo.

---

## 4. Typographie

| Usage | Police | Classe |
| --- | --- | --- |
| Titres éditoriaux | Newsreader | `font-headline` |
| Corps et UI | Plus Jakarta Sans | `font-body` |
| Métadonnées, numéros, labels | JetBrains Mono | `font-mono` |

### Échelle Tailwind

| Token | Usage |
| --- | --- |
| `text-display-lg` | héros rares, première impression |
| `text-display-md` | titres de page importants |
| `text-display-sm` | titres de page courants, dashboard |
| `text-headline-lg` | sections majeures |
| `text-headline-md` | titres de cartes importantes |
| `text-headline-sm` | sous-sections et cartes |
| `text-label-*` | labels, statuts, metadata |

Règles :

- les titres de page utilisent `font-headline`, `tracking-tight`, `text-balance` ;
- aucune graisse typographique `300` n'est utilisée (retirée pour alléger le bundle) ;
- les paragraphes longs gardent une largeur contenue (`max-w-2xl` ou `max-w-3xl`) ;
- les labels éditoriaux utilisent `.eyebrow` ;
- ne pas surdimensionner la typographie dans les cartes compactes ;
- les tailles fluides (`clamp(...)`) sont réservées aux surfaces plein-écran (splash, hero) pour éviter les fonts minuscules sur mobile.

---

## 5. Layout

Tokens structurants :

| Token | Valeur | Usage |
| --- | ---: | --- |
| `--topbar-h` | `4.5rem` | hauteur de top bar |
| `--sidebar-w` | `16rem` | largeur navigation latérale |
| `--sidebar-rail` | `5rem` | rail compact |
| `--content-max` | `75rem` | largeur maximale des vues riches |
| `--radius` | `1.25rem` | rayon global historique |

Règles de composition :

- pages de lecture : `max-w-2xl` pour préserver le confort ;
- pages parcours / dashboard : `max-w-[var(--content-max)]` ;
- sections : préférer des bandes ou layouts ouverts plutôt que des cartes imbriquées ;
- cartes : réserver aux éléments répétés ou outils encadrés ;
- éviter les cartes dans les cartes.

### Barre latérale (`SideNav` + `.glass-rail`)

La navigation latérale desktop (`components/chrome/SideNav.tsx`) est un rail fixe qui s'élargit de `--sidebar-rail` (5rem) à `--sidebar-w` (16rem) **en overlay** au survol / focus clavier — le contenu, décalé seulement de `--sidebar-rail` (`PageShell`, qui remplace `MainLayout` avec des routes aplaties), ne bouge jamais.
L'architecture de l'information (IA) de la `SideNav` et de la `TopBar` est désormais alignée, et toutes deux **prévoient** le sélecteur de langue `LocaleSwitcher` (FR/EN). Celui-ci n'est rendu que si le drapeau `EN_ENABLED` (`client/src/i18n/config.ts`) est vrai ; il est **actuellement masqué** tant que l'anglais n'est pas livré.

L'effet verre est piloté par l'attribut `data-open` (= `expanded`) et la classe `.glass-rail` (définie dans `global.css`), avec **deux états distincts** :

- **Replié** (`data-open="false"`) : quasi-opaque (`--surface` ~90 %), flou léger (`blur(6px)`), aucune ombre. Rien n'est rendu derrière le rail replié (le contenu commence à `--sidebar-rail`), donc le verre serait invisible — on l'intègre au fond comme du chrome.
- **Ouvert** (`data-open="true"`) : panneau de **verre dépoli** qui flotte au-dessus du contenu qu'il recouvre — fond **très** translucide teinté d'un ton conteneur (`--surface-container-lowest` ~38 % en clair, `--surface-container-low` ~34 % en sombre), `backdrop-filter: blur(14px) saturate(165%) contrast(104%)`. Le flou volontairement **modéré** ne masque pas la page : les aplats de couleur et les grandes formes restent lisibles sous le rail, tout en gardant les libellés nets. Par-dessus : un double dégradé (voile lumineux diagonal `--surface-bright` + teinte or/prune `--primary`/`--tertiary`), une arête gauche brillante et une ombre portée multi-couches avec lisérés internes. Une règle dédiée `.dark .glass-rail[data-open]` réajuste teintes (accents `--primary`/`--secondary`) et ombres en mode sombre.

Règle critique apprise : **ne pas teinter le verre avec `--surface`** — il est strictement égal à `--background` (clair comme sombre), donc un panneau translucide en `--surface` n'a aucun contraste avec la page derrière et paraît plat/opaque sans flou perceptible. Toujours utiliser un ton `--surface-container*` distinct du fond pour qu'un panneau de verre se lise. Toutes les transitions de verre sont animées (`background-color`, `background-image`, `box-shadow`, `border-color`, `backdrop-filter`) en parallèle de l'élargissement. Un fallback `@supports not (backdrop-filter)` repasse en panneaux quasi-opaques pour la lisibilité.

### Portail splash (`/`)

La page splash est **hors chrome** (pas de TopBar ni SideNav, footer masqué). Elle remplit 100 % du viewport via `.splash-portal { height: 100svh }` et `.splash-stage { position: absolute; inset: 0 }`. La typographie du titre est fluide : `clamp(1.6rem, 2.4vw, 2.6rem)`. Des media queries couvrent le mobile portrait (≤ 760px) et le paysage court (max-height ≤ 600px).

---

## 6. Composants et classes de base

### Boutons

| Classe | Usage |
| --- | --- |
| `.btn-foil` | action principale, démarrage, complétion |
| `.btn-ghost` | action secondaire visible |
| `.btn-quiet` | navigation discrète, retour, commande légère |

Règles :

- les boutons d'action claire doivent porter une icône lucide quand elle aide la compréhension ;
- un bouton principal par zone de décision ;
- ne pas utiliser `.btn-foil` pour de simples filtres.

### Cartes

| Classe | Usage |
| --- | --- |
| `.premium-card` | carte éditoriale standard |
| `.premium-card-hover` | carte cliquable |
| `.chip` | tags, catégories, états courts |

Les cartes actuelles à stabiliser :

- `PathCard` ;
- `CourseCard` ;
- `LessonRow` ;
- `CaseCard` ;
- `BlogCard` ;
- `SimulatorCard`.

Règles :

- `PathCard` et `SimulatorCard` peuvent utiliser une couleur d'accent dynamique ;
- `LessonRow` doit rester dense, scannable et stable ;
- les listes de contenu doivent privilégier la comparaison rapide.

### Progression

Composants :

- `ProgressBar` ;
- `ProgressRing`.

Usages :

- progression globale ;
- progression de parcours ;
- reprise de lecture ;
- statut de complétion.

Ne pas utiliser la progression comme décoration : elle doit toujours représenter une donnée utilisateur réelle.

---

## 7. Langage éditorial

### Lecture active

Le composant `ActiveProse` rend les contenus longs et permet :

- sélection de texte ;
- surlignage ;
- citation vers le carnet ;
- feedback de sauvegarde.

La classe `.prose-editorial` définit le rythme de lecture :

- corps en `1.0625rem` ;
- interligne confortable ;
- titres en Newsreader ;
- listes avec puces dorées.

Règles :

- une leçon doit rester lisible sans panneau latéral obligatoire ;
- les concepts doivent être liés inline via `[[slug]]` ou `[[slug|libellé]]` ;
- les longues séquences doivent être découpées par `##` et `###`.

### Dictionnaire vivant et Détection automatique

Les liens de glossaire ne sont pas décoratifs : ils sont la couche pédagogique transversale. Dans les composants de cours (`ActiveProse`), **la détection est désormais automatique** pour tout terme ou sigle (en respectant la casse).

Règles :

- tout terme VC important (ainsi que ses alias) doit exister dans `data/glossary.json` ;
- la **première occurrence** d'un terme dans une leçon est auto-détectée et transformée en popover condensé (affichant uniquement le `term` et son champ `short`). Le panneau entier est cliquable et redirige vers la définition détaillée dans le glossaire ;
- le texte visible doit rester naturel grâce à `[[slug|libellé]]` pour le balisage manuel (les balisages manuels priment sur l'auto-détection, et les études de cas / articles de blog restent entièrement manuels) ;
- les `glossaryRefs` doivent lister les termes vraiment utiles à la page.

### Simulateurs et Blocs pédagogiques

Les simulateurs intègrent désormais des **explications pédagogiques interactives** à côté des paramètres. Ils remplacent les infobulles natives par des `GlossaryPreview` avec redirections cliquables, assurant une cohérence parfaite avec le dictionnaire vivant.

---

## 8. Langage atlas et ornements

Le langage cartographique donne de la personnalité sans transformer l'app en décor.

### Composants illustratifs (`ornaments/Illustrations.tsx`)

| Composant | Usage |
| --- | --- |
| `CompassRose` | hero, pages d'accueil, onboarding |
| `Constellation` | fond hero, hero sombre, sections de navigation |
| `WaxSeal` | sceaux de parcours, portail splash |
| `MapCartouche` | entête de la carte PathAtlas |
| `SeaMonster` | marges de la carte, 404 |
| `InkStamp` | label "Accès libre", statut de leçon terminée |
| `ExLibris` | footer, panneaux de profil |
| `DropCap` | lettrines, CTA finaux |
| `Graticule` | fond de grille cartographique |
| `NightSkyBackdrop` | ciel étoilé photographique en mode sombre uniquement |

#### `NightSkyBackdrop` — règles d'utilisation

- variants `hero` (fondu vertical vers le fond de page) ou `panel` (vignette radiale douce) ;
- rend `hidden dark:block` — invisible en clair, le parchemin s'affiche normalement ;
- se pose en `absolute inset-0 -z-10` dans le conteneur hôte ;
- le conteneur hôte doit avoir `isolate` pour que la photo passe **au-dessus** du fond semi-opaque du conteneur mais **en dessous** du contenu in-flow ;
- utilise `/splash/bg-sombre.webp` (~97 Ko) — ne pas l'appliquer à des dizaines de sections simultanées.

### Ornements typographiques (`ornaments/Ornaments.tsx`)

- `Fleuron` — le ❦ doré, accent de séparation ;
- `FleuronDivider` — séparateur centré avec règle fine ;
- `GoldRule` — règle horizontale gradient transparent-or-transparent ;
- `KanjiSeal` — sceau typographique compact pour les cartes.

### Textures CSS

| Classe | Effet |
| --- | --- |
| `.map-paper` | lignes de contour topographique + méridiens, papier vieilli |
| `.grain` | bruit de grain photographique (pseudo-élément `::after`, opacity 0.035) |
| `.contour-field` | halo de contour teinté par `--contour` |
| `.ink-underline` | soulignement à l'encre dorée manuscrit (SVG encodé) |
| `.sheen-host` | reflet de lumière doré au survol |
| `.voyage-trail` | tracé pointillé "route maritime" |

Règles :

- les ornements doivent aider l'orientation ou le rythme visuel ;
- pas d'ornement gratuit dans les zones de saisie, simulation ou lecture dense ;
- les couleurs d'accent des parcours doivent rester distinctes et lisibles ;
- sur mobile, privilégier la liste claire à la carte trop miniature.

### Navigation de la carte `PathAtlas`

La carte des parcours est **manipulable comme une vraie carte** (modèle de référence : `VC PortfolioJourney/map.html`). Tout le contenu SVG (graticule, arcs, ports, cartouche, monstres, rose des vents) est enveloppé dans un groupe `<g transform="translate(tx ty) scale(scale)">` piloté par un état `view`.

| Geste | Comportement |
| --- | --- |
| Glisser (souris / tactile) | préhension (pan), le déplacement suit le curseur au pixel (conversion client → coordonnées viewBox) |
| Molette | zoom **centré sur le curseur** (le point survolé reste sous le curseur) |
| Pinch (2 doigts) | zoom tactile centré sur le milieu du geste |
| Boutons **+ / −** | zoom incrémental centré sur la carte (cluster haut-gauche, convention type Leaflet) |
| Bouton **recentrage** | réinitialise `scale 1, tx 0, ty 0` |

Règles / garde-fous :

- zoom borné `[0.6, 3]`, translation bornée (`clampView`) pour ne jamais perdre la carte hors champ ;
- seuil de 4 px qui distingue le **clic** (navigue vers la terre) du **drag** (pan) — un drag ne déclenche jamais la navigation ;
- `touch-action: none` sur le SVG pour que pan/pinch fonctionnent ; molette en listener natif non-passif (`preventDefault`) ;
- les interactions existantes (survol → encart cartouche, focus clavier, liste de chips en repli) sont conservées intactes.

---

## 9. Portail splash (`pages/SplashPage.tsx` + `styles/splash.css`)

Le portail est une surface autonome avec son propre système de tokens (`splash-portal.splash-light` / `.splash-dark`). Il ne dépend pas des classes Tailwind génériques.

Règles propres au portail :

- les couches `.splash-layer` sont toutes deux montées (cross-fade) ; la couche inactive reçoit `inert` pour rester hors du focus clavier et de l'arbre ARIA ;
- le toggle "Choisissez votre lumière" pilote `ThemeContext` (`useTheme().toggle`) — pas un état local ni un `localStorage` séparé ;
- les fonds sont en WebP (`/splash/bg-claire.webp` ~21 Ko, `/splash/bg-sombre.webp` ~97 Ko) — ne pas les remplacer par des PNG ;
- le `stage` remplit le viewport (`position: absolute; inset: 0`) — ne pas réintroduire le scaling `Math.min(w/1440, h/900)` qui cassait le mobile ;
- la taille du titre est fluide : `clamp(1.6rem, 2.4vw, 2.6rem)`.

---

## 10. États UI

États à conserver partout :

| État | Pattern |
| --- | --- |
| Chargement global | `PageLoader` avec `role="status"` |
| Chargement transition | Loader localisé (ex: `/profile-result`) |
| Erreur de composant/route | `ErrorBoundary` au niveau de la route pour éviter le crash (écran blanc) de la SPA |
| Vide | `EmptyState` |
| Confirmation destructive | `ConfirmDialog` |
| Focus clavier | `:focus-visible` global |
| Feedback court | toast / message `aria-live` (utilisant les tokens `--error` et `--success`) |
| Non trouvé | `NotFoundPage` |

Les suppressions doivent passer par confirmation. Les champs de formulaire doivent garder un focus visible même s'ils utilisent `outline-none`.

---

## 11. Motion

Animations existantes :

- `fade-up` ;
- `fade-in` ;
- `scale-in` ;
- `slide-in-right` ;
- `pulse-glow` ;
- `float` / `float-x` / `float-slow` ;
- `twinkle` ;
- `draw` ;
- `sheen` ;
- `compass-needle` ;
- `splash-rise`, `splash-breathe`, `splash-float`, `splash-float-x`, `splash-float-slow` (portail splash uniquement, dans `splash.css` ; l'effet de parallaxe est géré de manière fluide via `requestAnimationFrame`).

Règles :

- motion discrète et informative ;
- éviter l'animation continue dans les zones de lecture longue ;
- respecter `prefers-reduced-motion` (coupé dans `tokens.css` + guard dans `splash.css` + court-circuit dans `Reveal` et `CompassIkigaiIntro`) ;
- ne pas animer layout/height quand opacity/transform suffit.

---

## 12. Accessibilité

Déjà en place :

- focus visible global ;
- focus trap et restauration dans les modales ;
- `ConfirmDialog` pour suppressions ;
- `aria-live` sur certains feedbacks ;
- `role="alert"` sur erreurs d'auth ;
- inputs de simulateurs labellisés ;
- `prefers-reduced-motion` ;
- couche splash inactive : `inert={!active}` + `aria-hidden` — lien « Entrer » non focusable quand masqué.

Règles à maintenir :

- toute icône seule doit avoir un nom accessible ;
- tout état de chargement doit annoncer son statut ;
- les contrastes or/parchemin doivent être vérifiés sur petits textes ;
- les interactions clavier doivent rester possibles dans l'atlas, les modales, la recherche et les simulateurs ;
- ne jamais combiner `aria-hidden` et éléments focusables sur le même nœud — utiliser `inert` à la place.

---

## 13. Règles de création

Avant d'ajouter un composant :

1. Vérifier si une primitive existante suffit.
2. Vérifier si une classe globale existe déjà.
3. Utiliser les tokens plutôt que des couleurs isolées.
4. Tester clair/sombre.
5. Tester mobile.
6. Tester focus clavier.
7. Si le composant utilise `-z-*` dans un conteneur à fond semi-opaque, ajouter `isolate` sur le conteneur hôte.

À éviter :

- nouvelles couleurs sans rôle ;
- cartes imbriquées ;
- gros blocs marketing sur les pages outil ;
- décor qui concurrence la lecture ;
- texte trop petit en or sur parchemin ;
- composants qui déplacent la mise en page au hover ;
- fonds PNG volumineux là où du WebP/AVIF suffit ;
- réintroduire le scaling artboard 1440×900 sur le portail splash.

---

## 14. Gaps actuels du design system

À formaliser plus tard, sans ouvrir une refonte :

- variantes de formulaire (`Input`, `Textarea`, `Select`, erreur, aide) ;
- table/list dense pour l'admin ;
- pattern de preview éditoriale ;
- table of contents pour les leçons longues ;
- états de santé éditoriale du contenu ;
- composants de dashboard "journal de bord" ;
- documentation visuelle des couleurs d'accent de parcours ;
- extension de `NightSkyBackdrop` aux autres sections de l'accueil si un ciel continu du hero jusqu'à la carte est souhaité.
