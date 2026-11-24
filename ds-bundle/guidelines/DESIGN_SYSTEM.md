# Design system — Maison Sapience VC

> [!IMPORTANT]
> **Référence maintenue.** Ce document porte les règles visuelles et interactionnelles. [PRODUCT.md](../PRODUCT.md) fixe la marque et les principes produit. Les valeurs, dimensions, délais et API courants appartiennent au code ; les liens ci-dessous permettent de les consulter sans en maintenir une seconde copie.

**Mode de lecture.** Les paragraphes « Règles » prescrivent le comportement attendu. Les paragraphes « Implémentation » décrivent les sources et leurs limites actuelles. Une règle écrite ne prouve pas sa mise en œuvre. Les résultats datés restent dans [Suivis/ETAT.md](../Suivis/ETAT.md), l'historique dans [Suivis/JOURNAL.md](../Suivis/JOURNAL.md).

| Besoin | Section |
| --- | --- |
| Préparer une intervention | [Mode d’emploi](#utilisation) |
| Marque et fichiers propriétaires | [Positionnement](#positionnement), [sources](#sources) |
| Couleurs, texte, composition | [Tokens](#couleurs), [typographie](#typographie), [layout](#layout) |
| Primitives et contenu | [Composants](#composants), [lecture](#lecture) |
| Surfaces spécifiques | [Atlas](#atlas), [splash](#splash) |
| Interactions et validation | [États UI](#etats), [motion](#motion), [accessibilité](#accessibilite), [création](#creation) |
| Paramètres techniques et suivi | [Maintenance](#maintenance) |

<a id="utilisation"></a>

### Mode d'emploi pour une intervention

1. Lire [PRODUCT.md](../PRODUCT.md) pour les principes produit, puis la section de la surface concernée ici.
2. Ouvrir la source propriétaire et ses consommateurs. Les valeurs CSS, les props TypeScript et les calculs métier font autorité sur le comportement exécuté.
3. Reprendre un [modèle de page existant](#modeles-pages) et vérifier les [limites des composants](#contrats-composants) avant de composer une nouvelle interface.
4. En cas d'écart, préciser s'il concerne une description périmée, une règle encore non appliquée ou une décision produit à prendre. Une correction documentaire n'autorise pas à changer un calcul métier pour le faire correspondre à une ancienne phrase.
5. Qualifier la surface modifiée avec les contrôles du [§13](#creation). Consigner le résultat daté et les limites ; ne pas déduire une conformité globale d'un exemple du catalogue.

La dernière revue complète de ce document et ses preuves sont consignées dans le [relevé du 2 octobre 2026](../Suivis/AUDIT/2026-10-02-design-system.md).

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
| Thème et persistance | [ThemeProvider.tsx](../client/src/context/ThemeProvider.tsx), [ThemeContext.ts](../client/src/context/ThemeContext.ts) |
| Portail splash | [CompassIkigaiIntro.tsx](../client/src/components/splash/CompassIkigaiIntro.tsx), [SplashPage.tsx](../client/src/pages/home/SplashPage.tsx), [splash.css](../client/src/styles/splash.css) |
| Intro et hero d'accueil | [HomeIntro.tsx](../client/src/components/home/HomeIntro.tsx), [HomeIntroContext.ts](../client/src/context/HomeIntroContext.ts), [home-intro.css](../client/src/styles/home-intro.css), [home-hero.css](../client/src/styles/home-hero.css) |
| Primitives UI et cartes | [primitives.tsx](../client/src/components/ui/primitives.tsx), [cards.tsx](../client/src/components/cards.tsx) |
| Ornements | [Illustrations.tsx](../client/src/components/ornaments/Illustrations.tsx), [Ornaments.tsx](../client/src/components/ornaments/Ornaments.tsx) |
| Atlas | [PathAtlas.tsx](../client/src/components/explore/PathAtlas.tsx), [parcours-atlas.css](../client/src/styles/parcours-atlas.css) |
| Lecture active | [ActiveProse.tsx](../client/src/components/reading/ActiveProse.tsx), [markdown.tsx](../client/src/lib/markdown.tsx) |
| Dialogues, focus et popovers | [Modal.tsx](../client/src/components/ui/Modal.tsx), [ConfirmDialog.tsx](../client/src/components/ui/ConfirmDialog.tsx), [layerStack.ts](../client/src/components/ui/layerStack.ts), [useAnchoredPopover.ts](../client/src/components/ui/useAnchoredPopover.ts) |
| Progression de parcours | [parcoursProgress.ts](../client/src/lib/parcoursProgress.ts), [parcoursResume.ts](../client/src/lib/parcoursResume.ts) |
| Showcase interne, développement uniquement | [DesignSystemShowcasePage.tsx](../client/src/pages/system/DesignSystemShowcasePage.tsx), route `/design-system` |

Le projet utilise Tailwind CSS v3 avec tokens CSS sémantiques. La règle de base : utiliser les tokens existants avant d'ajouter une couleur, une taille ou une ombre.

Le catalogue présente des exemples. Ses légendes de couleur et de typographie sont lues dans les styles calculés du navigateur pour le thème et la taille de fenêtre actifs. Il ne couvre pas tous les composants, états ou pages. Les actions de démonstration sans effet et les valeurs de progression fictives doivent y être annoncées comme telles.

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

### Couleurs avec opacité

Les couleurs sémantiques Tailwind pointent vers des variables CSS contenant des couleurs complètes. Avec cette configuration Tailwind 3, les formes telles que `bg-primary/20` ou `border-outline-variant/40` ne génèrent pas les règles attendues. Pour une couleur sémantique translucide, utiliser `color-mix(in srgb, var(--primary) 20%, transparent)` dans le CSS ou dans un style. Les couleurs Tailwind natives telles que `black/40` suivent leur propre prise en charge.

Des usages historiques de `/opacité` sur les couleurs sémantiques subsistent dans l'application. Vérifier le style calculé de la surface touchée ; leur présence dans le JSX ne prouve pas l'application d'une couleur.

### Mode sombre

Le mode sombre est piloté par `.dark`. Il doit préserver la hiérarchie, la lisibilité et les rôles sémantiques du mode clair ; sa présence ne prouve pas que chaque surface a été qualifiée.

Spécificités mode sombre :

- le toggle « Choisissez votre lumière » du portail splash (`/`) appelle le thème global ; `ThemeProvider` applique `.dark`, initialise le choix depuis le stockage ou la préférence système, et accepte le changement après réussite de son enregistrement local ;
- le hero de `/home`, l'atlas facultatif de `/parcours` et `/ikigai` utilisent `NightSkyBackdrop` en sombre ; l'atlas n'est pas présent sur l'accueil ;
- conserver la lisibilité des contenus au-dessus des textures et photographies.

Règles :

- ne jamais coder une couleur sombre en dur sans alternative ;
- préférer `bg-surface-*`, `text-surface-variant`, `border-outline-variant` ;
- dans les nouvelles compositions, utiliser les rôles sémantiques et les accents de contenu (`path.accent`, `sim.accent`) ; certaines primitives historiques, dont le dégradé `.btn-foil`, contiennent encore des couleurs fixes à vérifier dans leur CSS ;
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
- les tailles fluides (`clamp(...)`) concernent les compositions éditoriales spécifiques, dont le splash, le hero, `HomeEditorialBridge` et certaines synthèses de blog ; vérifier leurs bornes et le rendu sur petit écran.

### Corps de texte et structure des titres

- `SectionHeading` rend un `h2` par défaut et accepte `as` ; passer `as="h1"` pour le titre principal d'une page. La classe de taille ne détermine pas le niveau HTML.
- `.prose-editorial` possède son corps, son interligne et ses espacements entre paragraphes et titres dans `global.css`. Les listes gérées par le moteur Markdown sont simples ; ne pas présumer la prise en charge de listes imbriquées.
- Les classes `text-sm`, `text-xs` et `text-label-*` servent aux textes courts et métadonnées selon le composant. Vérifier la lisibilité au zoom et les libellés longs avant de réutiliser un exemple compact.
- Les faces effectivement chargées sont les imports `@fontsource` de `global.css`. Une classe de graisse ou d'italique ne garantit pas qu'une face correspondante soit chargée ; éviter les graisses synthétiques involontaires.

---

<a id="layout"></a>

## 5. Layout

Les dimensions communes sont portées par `--topbar-h`, `--home-topbar-h`, `--home-mobile-nav-h`, `--sidebar-w`, `--sidebar-rail` et `--content-max` dans [tokens.css](../client/src/styles/tokens.css). Ne pas recopier leurs valeurs dans un composant. Les arrondis `rounded-*` et les ombres `shadow-editorial-*` sont définis dans [tailwind.config.ts](../client/tailwind.config.ts). Le token `--radius` est déclaré mais n'est actuellement consommé par aucun composant.

Règles de composition :

- colonnes de lecture : `max-w-2xl` pour les leçons, `max-w-3xl` pour les mémos et livrables ; une page avec annexes ou tableaux peut avoir une enveloppe plus large ;
- pages parcours / dashboard : `max-w-[var(--content-max)]` ;
- sections : préférer des bandes ou layouts ouverts plutôt que des cartes imbriquées ;
- cartes : réserver aux éléments répétés ou outils encadrés ;
- éviter les cartes dans les cartes.

### Espacements, densité et petit écran

**Implémentation.** Le projet utilise l'échelle d'espacements et les breakpoints Tailwind par défaut, sans échelle d'espacements dédiée. Les modèles ci-dessous emploient notamment `px-4 sm:px-6` pour la lecture et `px-4 sm:px-6 lg:px-8` pour les index larges. Les primitives possèdent leurs propres paddings et arrondis ; leurs classes restent la source à réutiliser.

**Règles de composition :**

- conserver les marges et espacements du modèle de page choisi ; distinguer l'écart entre métadonnées, entre blocs et entre sections ;
- utiliser `min-w-0` dans les colonnes flexibles et autoriser le retour à la ligne des métadonnées ; réserver la troncature aux aperçus qui donnent accès au texte complet ;
- empiler les colonnes lorsque leur contenu ne tient plus ; une table large utilise un défilement local avec nom accessible, sans élargir tout le document ;
- conserver les commandes essentielles et leur ordre de lecture sur mobile ; tester un titre long et une liste vide ;
- réserver l'espace des éléments fixes dans le layout propriétaire. L'accueil bascule à `md`, la navigation latérale à `lg` : ces deux seuils répondent à des compositions différentes ;
- les déplacements au survol par `transform` présents sur certaines cartes et certains boutons ne doivent pas déplacer les éléments voisins.

<a id="modeles-pages"></a>

### Modèles de pages existants

Ces références décrivent des compositions implémentées. Reprendre seulement les blocs pertinents et les états associés, sans recopier leurs données métier.

| Surface | Source à consulter | Composition et points d'attention |
| --- | --- | --- |
| Index de parcours | [ParcoursPage.tsx](../client/src/pages/learn/ParcoursPage.tsx) | Titre, atlas facultatif, filtres, rangées comparables, état sans résultat. Les filtres sont de vrais boutons. |
| Bibliothèque | [LibraryPage.tsx](../client/src/pages/learn/LibraryPage.tsx) | Recherche et filtres reliés aux paramètres d'URL, inventaire puis état sans résultat. |
| Fiche de parcours | [ParcoursDetailPage.tsx](../client/src/pages/learn/ParcoursDetailPage.tsx) | Objectif, métadonnées, progression et jalon, étapes et ressources. Voir les distinctions de calcul au §6. |
| Lecture de leçon | [LessonPage.tsx](../client/src/pages/learn/LessonPage.tsx) | Métadonnées, profondeur si disponible, texte annotable, points à retenir, références et activités facultatives, déclaration de lecture, navigation précédente/suivante. |
| Mémo | [MemoPage.tsx](../client/src/pages/intelligence/MemoPage.tsx) | Lecture en colonne, métadonnées et blocs d'analyse. |
| Cas avec dossier | [CaseStudyPage.tsx](../client/src/pages/cases/CaseStudyPage.tsx) | Énoncé, pièces et tableaux à défilement local, activité et ressources. |
| Production locale | [DeliverablePage.tsx](../client/src/pages/intelligence/DeliverablePage.tsx) | Brief, éléments attendus, gabarit, espace de travail si prévu par le livrable, grille et ressources. La note et le journal ont une sauvegarde explicite. |
| Outil de simulation | [SimulatorPage.tsx](../client/src/pages/simulators/SimulatorPage.tsx) | Métadonnées, outil, ressources liées ; la note d'investissement a une enveloppe et des sources propres. |

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

L'introduction peut jouer à l'arrivée directe sur `/home` ou depuis le portail. `HomeIntroProvider` exige actuellement ce chemin exact ; `/home/` reçoit le chrome d'accueil mais ne joue pas l'introduction. Une séquence déjà consommée ne se rejoue pas lors d'un retour interne au cours du même montage du provider. Le rideau décoratif reste hors focus ; la barre réelle masquée ne doit pas conserver de contrôles accessibles par simple transparence. Si le mouvement réduit est actif à l'entrée, la séquence n'est pas montée. Un changement de préférence pendant la séquence masque le rideau par CSS sans démontage immédiat. La synchronisation et le prérendu sont décrits au [§11](#motion).

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

<a id="contrats-composants"></a>

### Contrats et limites des primitives

| Élément | Contrat actuel à préserver |
| --- | --- |
| `Button` | Trois variantes ; bouton natif avec `type="button"` par défaut. En mode lien, `to` ou `href` choisit la destination, mais les autres props ne sont actuellement pas transmises au lien. Utiliser un `Link` ou un `<a>` explicite avec la classe voulue si des attributs ARIA ou gestionnaires sont nécessaires. |
| État indisponible | Un bouton natif utilise `disabled`. Un simple `aria-disabled` décrit un état sans bloquer à lui seul l'activation ; le CSS seul ne bloque pas le clavier. |
| `Chip`, `LevelBadge` | Textes rendus dans des `span`. Un filtre nécessite un bouton, un libellé et un état tel que `aria-pressed`. |
| `ProgressBar` | `value` est un pourcentage ; `label` est le nom accessible. Le consommateur calcule le ratio métier. |
| `ProgressRing` | `label` est le texte visible ; `accessibleLabel` nomme l'indicateur pour les aides techniques. |
| `Modal` | Nom via `labelledBy`, comportement de focus et fermeture délégués à `useLayerBehavior` / `layerStack`. Réutiliser cette gestion pour les dialogues. |
| `ConfirmDialog` | Focus initial sur confirmer par défaut ; `focusCancel` permet de viser l'annulation. Ferme après appel de `onConfirm`, sans attendre automatiquement une opération asynchrone. Le consommateur traite l'échec. |
| Formulaires | Règle d’usage : donner un nom accessible à chaque champ, privilégier un label visible et associer les aides et erreurs présentes. Les pages possèdent leurs styles et leur sauvegarde. Il n'existe pas de primitive de formulaire universelle documentée ici. |

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
- un inventaire destiné à être comparé se rend en rangées, pas en cartes. `ParcoursRow` est la forme de référence : sceau, titre, accroche sur deux lignes au plus, puis une bande méta dont l'ordre est constant d'une rangée à l'autre (temps requis · étapes · niveau · jalon). Une seule cible cliquable par rangée, séparateurs en filet, aucune boîte. `ParcoursCard` est utilisée pour des recommandations ciblées, notamment dans le résultat de profil et le tableau de bord.

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

**Règle :** distinguer lecture, activités effectuées et état du jalon. Réutiliser le calcul métier de la surface et nommer son dénominateur dans le libellé accessible.

**Implémentation :** [parcoursProgress.ts](../client/src/lib/parcoursProgress.ts) définit `buildParcoursProgressSummary`, utilisé par la fiche parcours et par l'index via [parcoursResume.ts](../client/src/lib/parcoursResume.ts). Il compte les étapes atteignables au niveau d'approfondissement actif : lecture des leçons, ensemble des leçons résolues d'un cours, activité déclarée des cas et simulateurs, et états des productions. Un jalon de production exige une déclaration de fin ; une étape `deliverable` compte aussi au stade `revised`. Consulter ce résolveur avant de modifier un pourcentage.

**Écart actuel :** `ParcoursCard` et `PathAtlas` calculent encore un ratio de leçons lues. Ils ne couvrent donc pas les mêmes activités que l'index et la fiche. Ne pas présenter ces indicateurs comme équivalents ni recopier leur calcul pour une nouvelle surface.

Le jalon déclaré sur `milestone` doit être pris en compte indépendamment d'une étape du même type. La fiche distingue le jalon résolu en leçon, avec état de lecture, et le jalon de production, avec état de déclaration. Sans résolution traçable, afficher son intitulé sans lui attribuer d'avancement. Les cartes ne reprennent pas encore toutes ces distinctions.

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
- les cours du programme et les blocs du référentiel professionnel utilisent des `details` fermés par défaut ; les consignes de l’évaluation locale restent visibles ;
- les titres, libellés et retours d'état restent courts et orientés décision.

Un parcours non évalué ne doit pas présenter charte de candidat, tentative ou résultat de certification. Les quiz de leçon restent formatifs ; aucun résultat local de connaissance ne délivre le titre professionnel `VC Analyst`.

---

<a id="lecture"></a>

## 7. Langage éditorial

La prose relève de la [charte rédactionnelle](ARCHITECTURE_EDITION.md#style-editorial). Cette section couvre seulement sa présentation.

### Lecture active

Le composant `ActiveProse` rend les contenus longs et permet :

- sélection d'un passage ;
- enregistrement dans le carnet comme surlignage (`highlight`) ou citation (`quote`) ;
- retour de réussite ou d'échec de sauvegarde.

**Limite actuelle :** les notes enregistrées ne sont pas réappliquées comme surlignages colorés dans le texte à sa réouverture.

La classe `.prose-editorial` définit le rythme de lecture : corps et interligne lisibles, titres en Newsreader, listes à puces et numérotées simples. Ses réglages sont dans `global.css`.

Règles :

- une leçon doit rester lisible sans panneau latéral obligatoire ;
- les concepts doivent être liés inline via `[[slug]]` ou `[[slug|libellé]]` ;
- les longues séquences doivent être découpées par `##` et `###`.

### Dictionnaire vivant et Détection automatique

Les liens de glossaire soutiennent la compréhension. Dans les leçons, l'auto-détection dépend des termes et aliases publiés, des règles de casse et d'exclusion du matcher ; elle ne reconnaît pas arbitrairement tout terme VC. **Implémentation :** [markdown.tsx](../client/src/lib/markdown.tsx).

Règles :

- ajouter les termes et leurs alias dans le registre canonique `data/sources/canonical-glossary.json` et maintenir le glossaire publié `data/glossary.json` conformément à `CLAUDE.md` ;
- dans une leçon, le repère inline donne accès à `GlossaryPreview`, puis à la fiche détaillée ; dans les autres textes rendus par `ActiveProse`, les marqueurs manuels donnent un lien direct via `GlossaryLink`, sans cet aperçu ;
- le texte visible doit rester naturel grâce à `[[slug|libellé]]` pour le balisage manuel (les balisages manuels priment sur l'auto-détection, et les études de cas / articles de blog restent entièrement manuels) ;
- les `glossaryRefs` doivent lister les termes vraiment utiles à la page.

### Simulateurs et Blocs pédagogiques

Pour les aides liées au dictionnaire, réutiliser `GlossaryPreview` plutôt qu'une infobulle native isolée. Ne pas supposer que tous les simulateurs utilisent les primitives de l'application : la [note d'investissement embarquée](ARCHITECTURE_EDITION.md#simulateurs) a ses propres sources.

---

<a id="atlas"></a>

## 8. Langage atlas et ornements

Le langage cartographique donne de la personnalité sans transformer l'app en décor.

### Composants illustratifs (`ornaments/Illustrations.tsx`)

| Composant | Consommateurs actuels ou disponibilité |
| --- | --- |
| `CompassRose` | accueil, bibliothèque, 404 |
| `Constellation` | 404 et catalogue ; le splash possède son propre `NightStars` |
| `WaxSeal` | cartes de parcours et anti-portfolio ; le splash utilise `CompassIkigaiIntro` |
| `MapCartouche` | entête de la carte PathAtlas |
| `SeaMonster` | marges de la carte, 404 |
| `InkStamp` | disponible, exemple dans le catalogue |
| `ExLibris` | footer |
| `DropCap` | lettrine disponible, exemple dans le catalogue |
| `Graticule` | grille disponible, exemple dans le catalogue ; `PathAtlas` dessine sa propre grille |
| `NightSkyBackdrop` | fond photographique de l’accueil, de l’atlas et d’Ikigai ; masqué en clair par défaut |

#### `NightSkyBackdrop` — règles d'utilisation

- variants `hero` (fondu vertical vers le fond de page) ou `panel` (vignette radiale douce) ;
- rend `hidden dark:block` par défaut ; éviter les surcharges de `display` qui annulent ce comportement ;
- se pose en `absolute inset-0 -z-10` dans le conteneur hôte ;
- le conteneur hôte doit avoir `isolate` pour que la photo passe **au-dessus** du fond semi-opaque du conteneur mais **en dessous** du contenu in-flow ;
- résout l'asset `splash/bg-sombre.webp` par `publicAssetUrl` pour respecter la base de déploiement ; limiter le nombre de fonds photographiques simultanés.

### Ornements typographiques (`ornaments/Ornaments.tsx`)

- `Fleuron` — le ❦ doré, accent de séparation ;
- `FleuronDivider` — séparateur centré avec règle fine ;
- `GoldRule` — règle horizontale dont le centre utilise `--outline-variant` et les extrémités sont transparentes ;
- `KanjiSeal` — sceau typographique compact pour les cartes.

### Textures CSS

| Classe | Effet |
| --- | --- |
| `.map-paper` | lignes de contour topographique + méridiens, papier vieilli |
| `.grain` | bruit SVG encodé (`feTurbulence`) discret |
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
| Glisser (souris / tactile) | préhension (pan), conversion client → coordonnées viewBox, dans les limites de translation |
| Molette | zoom calculé autour du curseur, puis borné ; aux limites de translation, le point survolé peut se déplacer |
| Pinch (2 doigts) | zoom tactile calculé autour du milieu du geste, soumis aux mêmes bornes |
| Boutons **+ / −** | zoom incrémental centré sur la carte (cluster haut-gauche, convention type Leaflet) |
| Bouton **recentrage** | retrouve la vue initiale |

Règles / garde-fous :

- borner zoom et translation pour ne pas perdre la carte hors champ ; les bornes et seuils appartiennent au composant ;
- distinguer activation et glissement : un pan ne déclenche pas de navigation ; à la souris ou au clavier, l'activation ouvre le parcours ; au tactile, le premier appui révèle les relations et le suivant ouvre le parcours ;
- le survol, le focus clavier et la sélection tactile d'un sceau produisent le même rendu relationnel, mais leurs propriétaires sont suivis séparément afin qu'une sortie de survol n'efface ni un focus ni une sélection tactile encore actifs ; les relations cartographiques ne sont jamais affichées en permanence ;
- les traits de relation sont continus : primaire sans flèche pour les compléments de même niveau, secondaire plus épais avec flèche pour les progressions conseillées. Le repère du cartouche et l’anneau des sceaux reliés sont pointillés pour les compléments ; le libellé explicite la relation ;
- le groupe SVG des relations reste `aria-hidden` et `pointer-events="none"` pour ne pas intercepter le pan, le zoom ou le clic. Le cartouche fournit l'équivalent textuel et les sceaux reliés ne sont pas atténués ;
- la liste de chips conserve le même état au survol, au focus et au premier appui tactile, comme repli mobile et clavier ;
- chargement et ouverture sont distincts : le survol, le focus ou l'activation du bouton peuvent charger puis monter l'atlas replié ; seule l'activation l'ouvre. Le bouton reste libellé et porte `aria-expanded` / `aria-controls` ;
- le montage initial replié puis l'ouverture sont séparés pour permettre la transition ; refermer la carte ne la démonte pas. `ParcoursPage` rend le conteneur fermé `inert` : la prop `collapsed` du composant ne suffit pas à retirer ses contrôles du parcours clavier.

---

<a id="splash"></a>

## 9. Portail splash

Le portail possède des tokens locaux pilotés par `data-mode`, sans second système de préférence de thème. **Implémentation :** [SplashPage.tsx](../client/src/pages/home/SplashPage.tsx), [CompassIkigaiIntro.tsx](../client/src/components/splash/CompassIkigaiIntro.tsx) et [splash.css](../client/src/styles/splash.css).

Règles propres au portail :

- le portail est un **single stage** : les photos claire/sombre, les étoiles, la boussole, le contenu et le toggle restent dans une seule scène `.splash-stage` ;
- les deux photos sont superposées dans `.splash-photos` et marquées `aria-hidden` ; la bascule ne duplique pas les contenus focusables ;
- la transition « Aube » coordonne Web Animations API pour les photos et le flare d’horizon, un timer React pour l’état `revealed`, puis les animations CSS des étoiles et des traits ; les éléments racine restent stables ;
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
| Erreur de rendu d’une page | `ErrorBoundary` autour de l’`Outlet`, réinitialisé au changement de chemin ; les erreurs d’événement et de sauvegarde restent à traiter localement |
| Vide | `EmptyState` |
| Confirmation destructive | `ConfirmDialog` |
| Focus clavier | `:focus-visible` global |
| Retour d’action | message visible et annonce `aria-live`, adaptés à la réussite ou à l’échec |
| Non trouvé | `NotFoundPage` |

**Règles :** les suppressions passent par confirmation ; les champs gardent un focus visible même avec `outline-none`. Une sauvegarde ne doit être annoncée comme réussie qu'après confirmation de l'écriture.

- Un message lié à un champ reste près du champ et lui est associé. Un retour bref concerne l'action qui vient d'être effectuée ; une erreur qui exige une intervention doit rester compréhensible et permettre la reprise.
- Distinguer un inventaire vide d'une recherche sans résultat ; proposer une action adaptée, telle que modifier les filtres.
- `Spinner` est décoratif (`aria-hidden`) ; utiliser `PageLoader` ou un statut nommé pour annoncer un chargement.
- Les couleurs `--success` et `--error` sont les rôles recommandés, avec un libellé explicite. Les retours existants varient : `ActiveProse` utilise la palette secondaire et distingue les états par `role="status"` / `role="alert"` et le texte ; `DeliverablePage` possède sa zone `aria-live`.
- Les sauvegardes, confirmations et notifications appartiennent à leurs consommateurs ; ne pas présumer un service global de notifications ni une sauvegarde automatique commune à tous les champs.

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
| `CompassIkigaiIntro.tsx` | phases temporisées de la boussole du portail, état final sous mouvement réduit |
| [HomeEditorialBridge.tsx](../client/src/components/home/HomeEditorialBridge.tsx) | animations SVG SMIL, pause hors champ, repères statiques sous mouvement réduit |
| [parcoursMorph.ts](../client/src/lib/parcoursMorph.ts) | transition du sceau ; navigation ordinaire si l’API manque ou si le mouvement est réduit |
| `home-intro.css`, `HomeIntroContext.ts` | chronologie coordonnée du rideau, du relais et du démontage |
| `HomeIntro.tsx` | non-montage de l'introduction si le mouvement réduit est actif à l'entrée |
| `home-hero.css`, `parcours-atlas.css` | désactivation locale des effets concernés sous mouvement réduit |

La réduction des durées CSS ne pilote pas Web Animations API, SMIL ni les timers JavaScript ; consulter le propriétaire de chaque effet. Les délais CSS et les constantes React de l'intro doivent rester synchronisés. `HomePage` calcule `--home-hero-t0` depuis le début de la séquence, pas depuis l'arrivée du chunk. Le [prérendu](../scripts/prerender.mjs) émule le mouvement réduit pour capturer l'état final.

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
8. Vérifier les états pertinents : texte long, vide, recherche sans résultat, attente, échec et reprise. Pour une saisie locale, vérifier la réussite effective de l'écriture et le retour en cas d'échec.
9. Contrôler au navigateur les styles calculés, le zoom, le défilement local, les éléments fixes et le mouvement réduit. Une lecture du CSS ne remplace pas une recette du rendu.
10. Exécuter les contrôles proportionnés de `CLAUDE.md` ; une modification documentaire seule appelle la vérification des chemins, des ancres et du diff, sans build applicatif.

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
- Lors d'un changement partagé, vérifier les exemples du catalogue et les tests ciblés du composant. Conserver les paramètres exécutables dans leurs sources et les lire depuis les styles appliqués lorsque le catalogue les affiche.
- Toute nouvelle exception doit préciser son périmètre et sa source. Les écarts de progression, de transmission des props des liens et d’opacité décrits ici restent des limites connues, à réexaminer lors d’une intervention sur leurs consommateurs.
