# Design system — Maison Sapience VC

> [!IMPORTANT]
> **Référence maintenue.** Ce document porte les règles visuelles et interactionnelles. [PRODUCT.md](../PRODUCT.md) fixe la marque et les principes produit. Les valeurs, dimensions, délais et API courants appartiennent au code ; les liens ci-dessous permettent de les consulter sans en maintenir une seconde copie.

**Mode de lecture.** Les prescriptions décrivent le contrat à préserver, pas une conformité déjà démontrée. Les paragraphes « Implémentation » indiquent où vérifier le comportement actuel. Les risques et résultats datés restent dans [Suivis/ETAT.md](../Suivis/ETAT.md), l'historique dans [Suivis/JOURNAL.md](../Suivis/JOURNAL.md).

| Besoin | Section |
| --- | --- |
| Marque et fichiers propriétaires | [Positionnement](#positionnement), [sources](#sources) |
| Couleurs, texte, composition | [Tokens](#couleurs), [typographie](#typographie), [layout](#layout) |
| Primitives et contenu | [Composants](#composants), [lecture](#lecture) |
| Surfaces spécifiques | [Atlas](#atlas), [splash](#splash) |
| Interactions et validation | [États UI](#etats), [motion](#motion), [accessibilité](#accessibilite), [création](#creation) |
| Paramètres techniques et suivi | [Maintenance](#maintenance) |

---

<a id="positionnement"></a>

## 1. Positionnement

Maison Sapience VC associe lecture éditoriale, carnet d'apprentissage, atlas d'exploration et mémo d'investissement. La marque visible est le **mot-symbole typographique Maison Sapience VC**, avec l'accent porté sur Sapience VC. Ne pas lui adjoindre le fleuron ou le rond doré hérités ; les ornements de séparation restent distincts du logo.

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

<a id="sources"></a>

## 2. Sources techniques du design system

**Implémentation.** Consulter seulement les sources de la surface modifiée :

| Zone | Fichier |
| --- | --- |
| Valeurs de couleur et de layout | [tokens.css](../client/src/styles/tokens.css) |
| Classes communes et faces typographiques importées | [global.css](../client/src/styles/global.css) |
| Échelles, ombres, couleurs Tailwind et animations communes | [tailwind.config.ts](../client/tailwind.config.ts) |
| Barre d'accueil et copie d'introduction | [homeBar.ts](../client/src/components/chrome/homeBar.ts) |
| Layout et sélection du chrome | [MainLayout.tsx](../client/src/layouts/MainLayout.tsx) |
| Portail splash | [SplashPage.tsx](../client/src/pages/home/SplashPage.tsx), [splash.css](../client/src/styles/splash.css) |
| Intro et hero d'accueil | [HomeIntro.tsx](../client/src/components/home/HomeIntro.tsx), [HomeIntroContext.ts](../client/src/context/HomeIntroContext.ts), [home-intro.css](../client/src/styles/home-intro.css), [home-hero.css](../client/src/styles/home-hero.css) |
| Primitives UI et cartes | [primitives.tsx](../client/src/components/ui/primitives.tsx), [cards.tsx](../client/src/components/cards.tsx) |
| Ornements | [Illustrations.tsx](../client/src/components/ornaments/Illustrations.tsx), [Ornaments.tsx](../client/src/components/ornaments/Ornaments.tsx) |
| Atlas | [PathAtlas.tsx](../client/src/components/explore/PathAtlas.tsx), [parcours-atlas.css](../client/src/styles/parcours-atlas.css) |
| Lecture active | [components/reading/](../client/src/components/reading/) |
| Showcase interne, développement uniquement | [DesignSystemShowcasePage.tsx](../client/src/pages/system/DesignSystemShowcasePage.tsx), route `/design-system` |

Le projet utilise Tailwind CSS v3 avec tokens CSS sémantiques. La règle de base : utiliser les tokens existants avant d'ajouter une couleur, une taille ou une ombre.

Les surfaces chargées tôt doivent importer le module de contenu nécessaire, pas le barrel complet `@/content`. Le découpage des collections et le chargement différé sont décrits dans le [cycle du contenu](ARCHITECTURE_EDITION.md#cycle-contenu).

---

<a id="couleurs"></a>

## 3. Tokens de couleur

**Règle durable :** choisir un rôle sémantique avant une couleur. Les valeurs claires et sombres exactes sont définies uniquement dans [tokens.css](../client/src/styles/tokens.css).

### Palette principale

| Usage | Token | Rôle |
| --- | --- | --- |
| Accent principal | `--primary` | actions principales, progression, liens importants |
| Texte sur primaire | `--on-primary` | texte sur une surface primaire pleine |
| Conteneur primaire | `--primary-container` | fond d'accent discret |
| Marine éditorial | `--secondary` | navigation et accent secondaire |
| Prune | `--tertiary` | profils et nuances complémentaires |
| Fond principal | `--background` | papier clair ou fond sombre |
| Texte principal | `--on-background` | encre principale |

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

Le mode sombre est piloté par `.dark`. Il doit préserver la hiérarchie, la lisibilité et les rôles sémantiques du mode clair ; sa présence ne prouve pas que chaque surface a été qualifiée.

Spécificités mode sombre :

- le toggle « Choisissez votre lumière » du portail splash (`/`) pilote le `ThemeContext` global — le choix persiste sur l'accueil et dans toute l'app ;
- le hero de `/home` et l'atlas facultatif de `/parcours` utilisent `NightSkyBackdrop` en sombre ; l'atlas n'est pas présent sur l'accueil ;
- conserver la lisibilité des contenus au-dessus des textures et photographies.

Règles :

- ne jamais coder une couleur sombre en dur sans alternative ;
- préférer `bg-surface-*`, `text-surface-variant`, `border-outline-variant` ;
- réserver les couleurs hex directes aux accents de contenu (`path.accent`, `sim.accent`) ou aux états métier stables ;
- les conteneurs qui hébergent `NightSkyBackdrop` (photo en `-z-10`) doivent avoir `isolate` pour créer leur propre contexte d'empilement, sinon le fond semi-opaque du conteneur masque la photo.

---

<a id="typographie"></a>

## 4. Typographie

Les polices sont auto-hébergées avec `@fontsource` et importées dans `client/src/styles/global.css`.

| Usage | Police | Classe |
| --- | --- | --- |
| Titres éditoriaux et marque textuelle | Newsreader | `font-headline` |
| Corps et UI | Plus Jakarta Sans | `font-body` |
| Métadonnées, numéros et labels compacts | JetBrains Mono | `font-mono` |

### Signature typographique de `/home`

La marque conserve Newsreader et l'accent typographique sur `Sapience VC` ; les deux pôles utilisent la famille mono. **Implémentation :** `HomeIntro` et `TopBar` partagent [homeBar.ts](../client/src/components/chrome/homeBar.ts). Tailles, graisses et espacements doivent rester définis à cet endroit ; vérifier les faces réellement importées avant de modifier une graisse.

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
- n'ajouter une face typographique qu'après vérification de son usage et de son coût ;
- les paragraphes longs gardent une largeur contenue (`max-w-2xl` ou `max-w-3xl`) ;
- les labels éditoriaux utilisent `.eyebrow` ;
- ne pas surdimensionner la typographie dans les cartes compactes ;
- les tailles fluides (`clamp(...)`) sont réservées aux surfaces plein-écran (splash, hero) pour éviter les fonts minuscules sur mobile.

---

<a id="layout"></a>

## 5. Layout

Les dimensions sont portées par `--topbar-h`, `--home-topbar-h`, `--home-mobile-nav-h`, `--sidebar-w`, `--sidebar-rail`, `--content-max` et `--radius` dans [tokens.css](../client/src/styles/tokens.css). Ne pas recopier leurs valeurs dans un composant.

Règles de composition :

- pages de lecture : `max-w-2xl` pour préserver le confort ;
- pages parcours / dashboard : `max-w-[var(--content-max)]` ;
- sections : préférer des bandes ou layouts ouverts plutôt que des cartes imbriquées ;
- cartes : réserver aux éléments répétés ou outils encadrés ;
- éviter les cartes dans les cartes.

### Barre latérale (`SideNav` + `.glass-rail`)

Sur les routes qui l'utilisent, la navigation latérale desktop s'ouvre en superposition sans déplacer le contenu. Le panneau fermé reste hors écran et `inert` ; le handle demeure accessible. Préserver un repli lisible sans `backdrop-filter`.

**Implémentation :** [SideNav.tsx](../client/src/components/chrome/SideNav.tsx), `.glass-rail` dans `global.css` et `MainLayout`. Les réglages de flou, d'opacité et de transition restent dans le CSS. [navigation.ts](../client/src/lib/navigation.ts) centralise les trois piliers, mais chaque variante de chrome choisit les entrées exposées ; l'accueil n'en met en avant que deux. La V1 n'introduit pas de sélecteur de langue.

### Barre d'accueil et séquence d'entrée (`/home`)

Contrat de `/home` et `/home/` :

- à partir de 768 px : Formation à gauche, mot-symbole au centre, Intelligence VC à droite ;
- sous 768 px : marque centrale dans le header ; deux pôles dans une navigation fixe basse, hors du landmark `header`, avec safe area ;
- contrôle de thème fixe en haut à gauche sur mobile, en bas à gauche sur desktop, discret au repos mais visible au focus ; sa cible doit rester directement cliquable au-dessus du header ;
- Workspace reste secondaire, conformément à `PRODUCT.md` ;
- géométrie et typographie partagées entre la barre réelle et sa copie animée, sans saut au relais.

**Implémentation :** [homeBar.ts](../client/src/components/chrome/homeBar.ts), [TopBar.tsx](../client/src/components/chrome/TopBar.tsx), [HomePage.tsx](../client/src/pages/home/HomePage.tsx) et les tokens de hauteur. La safe area ne remplace pas le budget de barre ; conserver la cible interactive du thème indépendamment de son icône.

L'introduction peut jouer à l'arrivée directe sur `/home` ou depuis le portail, jamais lors d'un retour interne. Le rideau décoratif reste hors focus ; la barre réelle masquée ne doit pas conserver de contrôles accessibles par simple transparence. Sous mouvement réduit, la séquence n'est pas montée. La synchronisation et le prérendu sont décrits au [§11](#motion).

### Portail splash (`/`)

Le splash est hors chrome : ni TopBar, ni SideNav, ni footer. Il occupe le viewport sans mise à l'échelle d'un artboard fixe ; vérifier portrait mobile et paysage court. Voir les [règles spécifiques](#splash).

---

<a id="composants"></a>

## 6. Composants de base

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

**Implémentation :** [cards.tsx](../client/src/components/cards.tsx) porte les cartes et rangées métier ; vérifier ses exports avant d'ajouter une variante.

Règles :

- `ParcoursCard`, `EcosystemCard` et `SimulatorCard` peuvent utiliser une couleur d'accent dynamique ;
- `MemoCard`, `AntiPortfolioEntryCard` et `DeliverableCard` doivent rester lisibles comme pièces d'intelligence VC, pas comme cartes marketing ;
- `LessonRow` doit rester dense, scannable et stable ;
- les listes de contenu doivent privilégier la comparaison rapide ;
- un inventaire destiné à être comparé se rend en rangées, pas en cartes. `ParcoursRow` est la forme de référence : sceau, titre, accroche sur deux lignes au plus, puis une bande méta dont l'ordre est constant d'une rangée à l'autre (temps requis · séances · niveau · jalon). Une seule cible cliquable par rangée, séparateurs en filet, aucune boîte. `ParcoursCard` reste réservée aux emplacements où un seul parcours est mis en avant.

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

Un parcours qui comporte une production affiche la lecture et le jalon séparément. Le jalon utilise un libellé d'état textuel et reste inachevé tant que l'utilisateur ne l'a pas déclaré terminé.

Le pourcentage d'un parcours se calcule **par étapes atteignables**, via `buildParcoursProgressSummary` : leçons déclarées lues, cas et simulateurs effectués, productions déclarées terminées, le tout borné par le niveau d'approfondissement actif. C'est le même dénominateur que la ligne « Étapes effectuées X/Y » de la fiche parcours ; le libellé accessible dit donc « étapes effectuées », jamais « leçons lues ». Une surface qui affiche un parcours ne recalcule pas ce ratio pour son compte.

Le jalon se lit sur l'objet `milestone` du parcours, pas uniquement sur une étape de même type. Son **état** reste réservé aux parcours portant une production traçable : sans identifiant de production, on nomme le jalon sans lui prêter d'avancement.

### Espaces de production

- utiliser des champs natifs correctement étiquetés pour la note, la déclaration de fichier et le journal des modifications ;
- annoncer la réussite ou l'échec d'une sauvegarde avec une zone `aria-live` ;
- présenter les états dans l'ordre conseillé sans désactiver les liens de navigation ;
- rendre les grilles d'autoévaluation sous forme de groupes nommés, sans calcul de score ;
- afficher les tables de dossier avec `caption`, `th`, `scope` et un conteneur de défilement horizontal sur petit écran ;
- conserver un focus visible sur les boutons de révélation, d'export et de changement d'état.

### Fiches de certification

La présentation distingue parcours d'apprentissage et certification évaluée. Les étapes et catégories sont définies dans [l'architecture des certifications](certifications/ARCHITECTURE-CERTIFICATIONS.md), pas dans une seconde liste ici.

Règles :

- la préparation recommandée reste visible et non bloquante ;
- la progression du programme porte sur les leçons disponibles ; les leçons à venir sont comptées séparément ;
- les axes d'options s'affichent un par un ;
- le titre professionnel reste invariant et le contexte choisi apparaît dans un supplément distinct ;
- les cours et les blocs d'évaluation sont fermés par défaut ;
- les titres, libellés et retours d'état restent courts et orientés décision.

Un parcours non évalué ne doit pas présenter charte de candidat, tentative ou résultat de certification. Les quiz de leçon restent formatifs ; aucun résultat local de connaissance ne délivre le titre professionnel `VC Analyst`.

---

<a id="lecture"></a>

## 7. Langage éditorial

La prose relève de la [charte rédactionnelle](ARCHITECTURE_EDITION.md#style-editorial). Cette section couvre seulement sa présentation.

### Lecture active

Le composant `ActiveProse` rend les contenus longs et permet :

- sélection de texte ;
- surlignage ;
- citation vers le carnet ;
- feedback de sauvegarde.

La classe `.prose-editorial` définit le rythme de lecture : corps et interligne lisibles, titres en Newsreader, listes hiérarchisées. Ses réglages sont dans `global.css`.

Règles :

- une leçon doit rester lisible sans panneau latéral obligatoire ;
- les concepts doivent être liés inline via `[[slug]]` ou `[[slug|libellé]]` ;
- les longues séquences doivent être découpées par `##` et `###`.

### Dictionnaire vivant et Détection automatique

Les liens de glossaire soutiennent la compréhension. Dans les leçons, l'auto-détection dépend des termes et aliases publiés, des règles de casse et d'exclusion du matcher ; elle ne reconnaît pas arbitrairement tout terme VC. **Implémentation :** [markdown.tsx](../client/src/lib/markdown.tsx).

Règles :

- tout terme VC important (ainsi que ses alias) doit exister dans `data/glossary.json` ;
- le repère inline donne accès à une définition courte puis à la fiche détaillée, sans interrompre la lecture ;
- le texte visible doit rester naturel grâce à `[[slug|libellé]]` pour le balisage manuel (les balisages manuels priment sur l'auto-détection, et les études de cas / articles de blog restent entièrement manuels) ;
- les `glossaryRefs` doivent lister les termes vraiment utiles à la page.

### Simulateurs et Blocs pédagogiques

Pour les aides liées au dictionnaire, réutiliser `GlossaryPreview` plutôt qu'une infobulle native isolée. Ne pas supposer que tous les simulateurs utilisent les primitives de l'application : la [note d'investissement embarquée](ARCHITECTURE_EDITION.md#simulateurs) a ses propres sources.

---

<a id="atlas"></a>

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
- résout l'asset `splash/bg-sombre.webp` par `publicAssetUrl` pour respecter la base de déploiement ; limiter le nombre de fonds photographiques simultanés.

### Ornements typographiques (`ornaments/Ornaments.tsx`)

- `Fleuron` — le ❦ doré, accent de séparation ;
- `FleuronDivider` — séparateur centré avec règle fine ;
- `GoldRule` — règle horizontale gradient transparent-or-transparent ;
- `KanjiSeal` — sceau typographique compact pour les cartes.

### Textures CSS

| Classe | Effet |
| --- | --- |
| `.map-paper` | lignes de contour topographique + méridiens, papier vieilli |
| `.grain` | grain photographique discret |
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

L'atlas est une vue facultative de `/parcours`, complémentaire de la liste. **Implémentation :** [ParcoursPage.tsx](../client/src/pages/learn/ParcoursPage.tsx), [PathAtlas.tsx](../client/src/components/explore/PathAtlas.tsx) et [parcours-atlas.css](../client/src/styles/parcours-atlas.css).

| Geste | Comportement |
| --- | --- |
| Glisser (souris / tactile) | préhension (pan), le déplacement suit le curseur au pixel (conversion client → coordonnées viewBox) |
| Molette | zoom **centré sur le curseur** (le point survolé reste sous le curseur) |
| Pinch (2 doigts) | zoom tactile centré sur le milieu du geste |
| Boutons **+ / −** | zoom incrémental centré sur la carte (cluster haut-gauche, convention type Leaflet) |
| Bouton **recentrage** | retrouve la vue initiale |

Règles / garde-fous :

- borner zoom et translation pour ne pas perdre la carte hors champ ; les bornes et seuils appartiennent au composant ;
- distinguer activation et glissement : un pan ne déclenche pas de navigation ; à la souris ou au clavier, l'activation ouvre le parcours ; au tactile, le premier appui révèle les relations et le suivant ouvre le parcours ;
- le survol, le focus clavier et la sélection tactile d'un sceau produisent le même rendu relationnel, mais leurs propriétaires sont suivis séparément afin qu'une sortie de survol n'efface ni un focus ni une sélection tactile encore actifs ; les relations cartographiques ne sont jamais affichées en permanence ;
- les compléments de même niveau suivent un trait primaire pointillé sans flèche ; les progressions conseillées utilisent un trait secondaire continu et orienté. La distinction repose donc sur la forme, l'orientation et le libellé du cartouche, pas sur la couleur seule ;
- le groupe SVG des relations reste `aria-hidden` et `pointer-events="none"` pour ne pas intercepter le pan, le zoom ou le clic. Le cartouche fournit l'équivalent textuel et les sceaux reliés ne sont pas atténués ;
- la liste de chips conserve le même état au survol, au focus et au premier appui tactile, comme repli mobile et clavier ;
- chargement et ouverture sont distincts : le survol, le focus ou l'activation du bouton peuvent charger puis monter l'atlas replié ; seule l'activation l'ouvre. Le bouton reste libellé et porte `aria-expanded` / `aria-controls` ;
- le montage initial replié puis l'ouverture sont séparés pour permettre la transition ; refermer la carte ne la démonte pas.

---

<a id="splash"></a>

## 9. Portail splash

Le portail possède des tokens locaux pilotés par `data-mode`, sans second système de préférence de thème. **Implémentation :** [SplashPage.tsx](../client/src/pages/home/SplashPage.tsx) et [splash.css](../client/src/styles/splash.css).

Règles propres au portail :

- le portail est un **single stage** : les photos claire/sombre, les étoiles, les sceaux, le contenu et le toggle restent dans une seule scène `.splash-stage` ;
- les deux photos sont superposées dans `.splash-photos` et marquées `aria-hidden` ; la bascule ne duplique pas les contenus focusables ;
- la transition « Aube » est pilotée par Web Animations API dans `SplashPage.tsx` (opacité photo sombre, filtre photo claire, flare d'horizon, révélation des étoiles), tandis que React garde les éléments racine stables ;
- le toggle "Choisissez votre lumière" pilote `ThemeContext` (`useTheme().toggle`) — pas un état local ni un `localStorage` séparé ;
- conserver des assets compressés et des URL compatibles avec la base de déploiement ;
- le stage remplit le viewport sans scaling d'artboard fixe ;
- la taille du titre reste fluide ; ses valeurs et media queries sont définies dans le CSS.

---

<a id="etats"></a>

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

<a id="motion"></a>

## 11. Motion

Règles durables :

- motion discrète et informative ; pas de boucle qui concurrence la lecture longue ;
- état de repos égal à l'état final : couper une animation ne doit pas laisser le contenu invisible ;
- privilégier `opacity` et `transform` quand une animation de layout n'est pas nécessaire ;
- ne pas rejouer une entrée bloquante à chaque retour interne ;
- mettre en pause les boucles hors champ et respecter la préférence de mouvement réduit ;
- éviter les doubles instances masquées d'un même ornement animé aux différents breakpoints.

### Implémentation et mouvement réduit

| Source propriétaire | Responsabilité |
| --- | --- |
| `tailwind.config.ts`, `global.css` | animations et transitions communes |
| `tokens.css` | réduction globale des durées ; ce n'est pas une annulation de tous les délais ou effets |
| `splash.css`, `SplashPage.tsx` | animations CSS du portail, parallaxe et transition Aube |
| `home-intro.css`, `HomeIntroContext.ts` | chronologie coordonnée du rideau, du relais et du démontage |
| `HomeIntro.tsx` | non-montage de l'introduction sous mouvement réduit |
| `home-hero.css`, `parcours-atlas.css` | désactivation locale des effets concernés sous mouvement réduit |

Les délais CSS et les constantes React de l'intro doivent rester synchronisés. `HomePage` calcule `--home-hero-t0` depuis le début de la séquence, pas depuis l'arrivée du chunk. Le [prérendu](../scripts/prerender.mjs) émule le mouvement réduit pour capturer l'état final.

### Hero de `/home`

Le hero associe tracé de rose, révélation du titre et apparition de la légende. Les paramètres sont dans [home-hero.css](../client/src/styles/home-hero.css) ; conserver ces garde-fous :

- une seule `CompassRose`, redimensionnée en CSS ; le bouton d'atlas de `/parcours` utilise une icône de carte, pas cette rose ;
- masque du titre proportionné à la largeur du texte, sans rognage des accents ou jambages ;
- points d'accroche SVG et `pathLength` de `CompassRose` conservés si le tracé les utilise ;
- boucles du ciel et de l'aiguille mises en pause par `data-home-hero-live` hors champ.

---

<a id="accessibilite"></a>

## 12. Accessibilité

Le produit **vise WCAG 2.2 AA**, conformément à `PRODUCT.md`. Cette documentation et la présence de primitives accessibles ne constituent pas une attestation de conformité.

Critères à vérifier sur chaque surface modifiée :

- navigation clavier, focus visible, absence de focus piégé hors modale et restitution du focus après fermeture ;
- nom accessible des icônes seules, labels des champs et messages associés ;
- statut annoncé au chargement et retour perceptible après sauvegarde ou erreur ;
- contraste du texte et des contrôles dans les deux thèmes, notamment or sur parchemin ;
- accès clavier/tactile aux informations de l'atlas, sans dépendance à la couleur seule ;
- décor hors arbre accessible ; aucun contrôle focusable dans une zone `aria-hidden` ; utiliser `inert` pour un panneau fermé ;
- état final utilisable sous mouvement réduit et contenu non masqué par les barres fixes.

**Repères d'implémentation :** [MainLayout.tsx](../client/src/layouts/MainLayout.tsx) pour le lien d'évitement et le focus après navigation ; [SideNav.tsx](../client/src/components/chrome/SideNav.tsx) pour le panneau inerte ; [ErrorBoundary.tsx](../client/src/components/ErrorBoundary.tsx) pour l'alerte d'erreur. L'application n'a pas d'authentification : ne pas présenter des « erreurs d'auth » comme un mécanisme existant.

---

<a id="creation"></a>

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

<a id="maintenance"></a>

## 14. Maintenance

- Changer un principe visuel ou un comportement partagé : mettre à jour la section concernée et ses consommateurs.
- Changer une valeur, un délai, une borne ou une API : modifier la source propriétaire et les tests concernés, sans recopier le paramètre ici.
- Documenter une vérification, une lacune ou une priorité : utiliser [Suivis/ETAT.md](../Suivis/ETAT.md) ; consigner une livraison dans [Suivis/JOURNAL.md](../Suivis/JOURNAL.md).
- Ne pas transformer une suggestion de refonte ou un historique de réglages en règle normative.
