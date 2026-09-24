# Architecture et édition — Maison Sapience VC

> [!IMPORTANT]
> **Référence maintenue.** Ce manuel porte l'architecture éditoriale, les conventions d'édition et la charte rédactionnelle (§4.0.c). Le code, les schémas et les scripts décrivent le comportement implémenté ; [PRODUCT.md](../PRODUCT.md) porte les principes produit. Les compteurs, vérifications datées et risques ouverts restent dans [Suivis/ETAT.md](../Suivis/ETAT.md).

> [!TIP]
> Modifier la source propriétaire, jamais une projection sous `data/generated/` ni un HTML assemblé du simulateur de note. Les collections structurées vivent dans `data/`, les interfaces dans `client/src`, et les sources du simulateur de note dans `nouveau simu/src/` (§4.6).

## Accès par section

Lire la section utile, pas le manuel entier à chaque intervention.

| Tâche | Sections |
| --- | --- |
| Comprendre le socle et le périmètre | [Architecture](#architecture), [positionnement et ontologie](#positionnement) |
| Modifier une source ou une projection | [Cycle du contenu](#cycle-contenu), [validation](#validation) |
| Préparer la consolidation Formation | [Distinctions et diagnostic](#preparation-formation), [contrat Parcours](parcours/README.md) |
| Modifier l'application ou la persistance | [État, stockage et routes](#application) |
| Choisir un identifiant ou rédiger | [ID/slug](#ids-slugs), [charte éditoriale §4.0.c](#style-editorial) |
| Éditer une ressource de formation | [Leçon](#lecons), [glossaire](#glossaire), [bibliothèque](#bibliotheque), [parcours](#parcours), [cours](#cours) |
| Éditer une autre collection | [Cas et analyses](#cas-analyses), [écosystèmes](#ecosystemes), [livrables](#livrables), [mémos](#memos), [anti-portfolio](#anti-portfolio), [convictions](#convictions), [certifications](#certifications), [simulateurs](#simulateurs) |
| Modifier l'interface | [Design](#design), [choix d'UX](#ux), [cahier Ikigai](#ikigai) |
| Construire ou préparer un hébergement | [Workflow](#workflow), [prérendu et hébergement](#hebergement) |
| Lire les priorités | [Suivi](#suivi) |

---

<a id="architecture"></a>

## 1. Architecture globale et technologies

Le projet est une **Single Page Application statique** sans backend applicatif. Le navigateur charge le document, les assets et les chunks depuis l'hôte statique ; aucun service worker ne garantit la poursuite de la navigation après une déconnexion.

| Couche | Technologies |
| --- | --- |
| **Front-end** (`client/`) | React · Vite · TypeScript · Tailwind CSS · React Router ; versions dans [client/package.json](../client/package.json) |
| **Stockage utilisateur** | Local au navigateur ; contrats et exceptions en [§3.2](#persistance) |
| **Contenu** (`data/`) | JSON source des collections éditoriales, bundlé par le client |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

```
vc-platform/
├── data/                      # ← SOURCES des collections éditoriales (JSON)
│   ├── courses.json  lessons.json  glossary.json
│   ├── caseStudies.json  deliverables.json  blog/ (un JSON par slug)
│   ├── simulators.json  ikigai.json
│   ├── parcours.json  parcoursRelations.json  profileParcours.json  diagnostics.json
│   ├── caseCorrections.json      # corrections révélées volontairement, hors index
│   ├── domains.json  certifications.json
│   ├── certificationLevels.json  candidateCharters.json  certificationAssessments.json
│   ├── parcours/              # registres de leçons additionnelles (*.lessons.json)
│   ├── # ── couche VC Intelligence (100 % client) ──
│   ├── ecosystems.json  memos.json  antiPortfolio.json
│   ├── generated/             # GÉNÉRÉ, ne pas éditer : lessons.index/bodies.json + glossary.index/defs.json (split:content)
│   └── sources/               # registre d'ingestion durable du glossaire
├── docs/
│   ├── parcours/              # contrat maintenu de conception des parcours
│   ├── certifications/        # architecture transverse, référentiel Analyst, gouvernance et protocole
│   ├── ARCHITECTURE_EDITION.md       # ce document
│   ├── DESIGN_SYSTEM.md              # système visuel et interactionnel
│   ├── STRATEGIE-vc-intelligence.md  # direction produit maintenue
│   └── archive/                      # documents historiques non normatifs
├── PRODUCT.md                 # contrat produit : registre, intention, principes, accessibilité
├── Suivis/                    # suivi projet vivant : ETAT.md, JOURNAL.md, PROCEDURE_PUSH.md
├── shared/                    # contrats cross-runtime, sans dépendances
│   ├── base-url.mjs           # base de déploiement, routes dures, assets publics et origine canonique
│   └── routes.mjs             # taxonomie de routes (noindex, OG-image par segment)
├── client/                    # SPA React + Vite
│   └── src/
│       ├── content/           # types.ts + modules par collection @data + recherche locale
│       ├── context/           # Theme · UserData · UI (React Context)
│       ├── lib/               # storage · markdown · ikigai · seo · utils (safeHttpUrl)
│       ├── components/        # ui · chrome · ornaments · explore · cards · reading · ikigai · simulators · ErrorBoundary
│       ├── pages/             # pages lazy-loadées, regroupées par domaine
│       └── styles/            # tokens.css (design tokens, dont --error/--success) + global.css
└── .github/workflows/deploy-pages.yml   # workflow manuel : artefact statique puis job Pages
```

> [!NOTE]
> Le client lit `data/` via l'alias Vite **`@data`** (ex. `import coursesJson from '@data/courses.json'` dans `client/src/content/courses.ts`). Chaque collection a son module afin que Rollup découpe le contenu par chunks.
>
> **Collections scindées.** Les index légers du glossaire et des leçons sont importés immédiatement ; définitions et corps sont chargés à la demande par leurs modules de contenu. Les quatre fichiers sous `data/generated/` sont versionnés mais strictement dérivés. Voir le [cycle de régénération](#cycle-contenu).

> [!IMPORTANT]
> `AGENTS.md` est l'entrée portable des agents de code et renvoie vers `CLAUDE.md`, contrat détaillé partagé par Codex, Claude Code et les autres agents. Les hooks `.claude/` ne s'exécutent que dans Claude Code et seulement sur les opérations prises en charge ; les autres agents doivent appliquer les interdictions et lancer les validations explicitement.

---

<a id="positionnement"></a>

## 1bis. Positionnement et ontologie

Maison Sapience VC est en construction. La présence de routes ou de collections ne prouve ni la complétude du contenu, ni la maturité professionnelle de la couche Intelligence VC. L'accueil privilégie Formation et Intelligence VC ; Workspace reste secondaire selon [PRODUCT.md](../PRODUCT.md). La [stratégie](STRATEGIE-vc-intelligence.md) décrit la cible, pas un bilan de livraison.

| Terme | Contrat |
| --- | --- |
| Path / Parcours | Même trajectoire de formation ordonnée par objectif ; compose des ressources existantes |
| Cours | Conteneur réutilisable de leçons |
| Leçon | Unité pédagogique autonome rattachée à un cours ; pas un simple chapitre ou bloc « À retenir » |
| Bibliothèque | Inventaire filtrable, sans collection de rayons distincte |
| Certification | Évaluation distincte du suivi de formation ; aucun résultat local ne délivre le titre professionnel `VC Analyst` |

La taxonomie envisagée (`contentKind`, `audience`, `rigor`, `evidenceLevel`) n'est pas un contrat de données généralisé. N'ajouter un champ qu'après vérification ou évolution coordonnée des types, schémas et consommateurs (§4.0.b). Les statuts déjà présents conservent leurs règles propres.

---

<a id="cycle-contenu"></a>

## 2. Le cycle de vie du contenu

### 2.1. Sources et consommateurs

C'est le concept central de la plateforme. Le contenu suit ce chemin :

```
Sources JSON → import direct OU génération → modules client → pages
```

Les modules de `client/src/content/` consomment les collections via `@data` ; les pages ne lisent pas toutes les sources directement. Les leçons et le glossaire passent par les projections de [scripts/generated-content.mjs](../scripts/generated-content.mjs). Le lecteur charge seulement les corps de leçons publiées ; l'index peut conserver les métadonnées des leçons à venir.

### 2.2. Conséquences pratiques

Il n'y a ni base de données ni CMS. Tout le contenu est géré statiquement.

| Vous éditez… | Ce qui se met à jour | L'action requise |
| --- | --- | --- |
| JSON importé directement | module client via Vite | Valider, puis vérifier la surface concernée |
| `data/lessons.json`, registre `data/parcours/*.lessons.json` ou `data/glossary.json` | index et contenu différé | Relancer `npm run split:content`, puis `npm run check:generated` |
| `data/sources/canonical-glossary.json` | registre éditorial seulement | Reporter les décisions retenues dans le glossaire publié, puis valider et régénérer |
| `nouveau simu/src/` | HTML du simulateur de note | `npm run build:memo`, puis `npm run check:memo` |

**Le HMR ne remplace pas la génération.** `predev` et `prebuild` exécutent les générateurs au lancement ; ils ne surveillent pas ensuite les sources. Commit, sauvegarde distante et publication sont des actions distinctes, uniquement sur demande.

> [!IMPORTANT]
> **Sérialiseur canonique unique.** Le format de référence est exactement la sortie de `JSON.stringify(payload, null, 2)` + `\n`. `glossary` reste trié par `term`, `caseStudies` par `title`, et le blog vit dans `data/blog/<slug>.json` avec un fichier par article.

> [!IMPORTANT]
> **Publication éditoriale.** [shared/publication.mjs](../shared/publication.mjs) retient seulement `status: "published"` pour les collections concernées, notamment leçons, articles et certifications. Les collections sans statut ne bénéficient pas de ce filtre ; les métadonnées de leçons `upcoming` peuvent être exposées sans corps lisible. Ne pas confondre statut éditorial, indexabilité et déploiement. Un fichier inclus dans le client n'est jamais confidentiel.

### 2.2.b. Cas particulier : glossaire VC

Le glossaire final consommé par l'app reste `data/glossary.json`, mais son chantier éditorial passe d'abord par `data/sources/canonical-glossary.json`.

- `canonical-glossary.json` est le registre durable : il conserve sources, modules, décisions d'édition, aliases, `action` (`add`, `update`, `merge`, `skip`) et `status` (`draft`, `needs-review`, `approved`, `applied`).
- `data/glossary.json` porte les fiches publiées, dont leurs `aliases`. Sa structure est définie dans `client/src/content/types.ts` et le validateur ; le split ne lit pas directement le registre canonique.
- Le registre d'ingestion et le glossaire publié ont des responsabilités distinctes. Leurs volumes vérifiés vivent uniquement dans `Suivis/ETAT.md`.
- Toute variante simple doit devenir un **alias** d'un terme existant plutôt qu'une fiche autonome ; une fiche finale n'est créée que si le concept a une utilité de popover ou de navigation propre.

Pour clôturer une passe glossaire : aligner registre et fiches publiées, y compris les aliases retenus ; lancer `npm run validate:glossary`, `npm run validate:content:strict`, puis `npm run split:content` et `npm run check:generated`. Le build complet dépend de la portée du changement, selon [CLAUDE.md §7](../CLAUDE.md#7-validation-proportionnée).

---

<a id="preparation-formation"></a>

### 2.2.c. Préparation de Formation : contrat existant et cible

Ne pas confondre quatre dimensions :

| Dimension | Lecture du modèle actuel |
| --- | --- |
| Publication éditoriale | Statut explicite des collections raccordées à `shared/publication.mjs` ; les parcours et cours n’ont pas encore de statut éditorial propre |
| Disponibilité pédagogique | Capacité réelle à suivre les activités promises ; ni une route existante ni une référence résolue ne suffisent à la prouver |
| Résolution d’étape | `ParcoursStep.status` distingue `existant` et `a-produire` ; il ne porte pas la publication ou la maturité du parcours |
| Mode de complétion | Connaissance, orientation ou production décrivent des promesses différentes ; aucun champ commun ne les impose encore aux parcours |

`roadmap: now | next | later` reste un ordre de construction, pas un filtre de publication. Les `prerequisites` de parcours sont actuellement textuels ; ils ne constituent pas un registre de prérequis d’entrée par identifiant de leçon. La navigation souple ne dispense pas de vérifier la cohérence pédagogique de l’ordre proposé.

Un diagnostic de préparation doit séparer les incohérences démontrables, les métadonnées non encore modélisées et les arbitrages pédagogiques. L’absence d’un contrat futur ne permet pas d’inventer un statut « exécutable » ou un mode de complétion. Les fixtures peuvent tester ces cibles sans migrer les données. Une évolution du modèle exige ensuite une décision explicite et l’alignement des types, schémas, sources et consommateurs.

Les politiques pédagogiques relèvent du [contrat Parcours](parcours/README.md#preparation-formation). Le statut des travaux et des commandes réellement disponibles relève de [Suivis/ETAT.md](../Suivis/ETAT.md#consolidation-formation). Un contrôle structurel vert, un diagnostic technique et une revue professionnelle restent trois preuves distinctes.

---

<a id="application"></a>

## 3. Logique et composants principaux

### 3.1. État & persistance (React Context — `client/src/context/`)

- **`ThemeProvider`** — clair/sombre, persistant (`localStorage`), respecte `prefers-color-scheme`.
- **`UserDataProvider`** — profil, notes, favoris, progression, surlignages, entrées du carnet de décision. La persistance s'effectue exclusivement en **local** via le `localStorage`.
- **`UIProvider`** — palette de commande (⌘K), états d'UI globaux.

<a id="persistance"></a>

### 3.2. Persistance (`client/src/lib/storage.ts`)

`storage.ts` fournit l'accès commun ; `storageDomains.ts` décrit domaines, limites et validations ; `storageMigrations.ts` porte les migrations. Les données principales utilisent des enveloppes versionnées sous `vcpx:`. Le simulateur de note conserve son format distinct, pris en charge par `localDataLifecycle.ts` pour l'export, l'import et la purge ; `localDataRecovery.ts` gère la copie de récupération dans IndexedDB.

Toute évolution incompatible exige une migration explicite et la préservation des données valides. Ces mécanismes restent locaux : ni confidentialité, ni synchronisation multi-appareil, ni garantie de sauvegarde distante. Ne pas y placer de secrets ou de dossiers d'investissement non publics.

### 3.3. Pages clés (`client/src/pages/`)

L'arborescence est rangée par domaine. Les principales surfaces implémentées sont les suivantes ; leur présence ne qualifie pas la complétude éditoriale :

- **Intelligence** (`pages/intelligence/`) : **`IntelligencePage`** (hub `/intelligence`), **`MethodePage`** (`/methode`), **`ConvictionsPage`** (`/convictions`, convictions agrégées), **`DecisionsIndexPage`** (`/decisions`, présentation du carnet de décision), **`MemoLibraryPage`** / **`MemoPage`** (`/memos`, mémos annotés — §4.5quater), **`AntiPortfolioPage`** / **`AntiPortfolioEntryPage`** (`/anti-portfolio` — §4.5quinquies), **`DeliverablesPage`** / **`DeliverablePage`** (`/livrables` — §4.5ter).
- **Écosystèmes** (`pages/ecosystems/`) : **`EcosystemsPage`** (index « Décortiquer un écosystème », `/ecosystemes`) et **`EcosystemPage`** (détail d'un dossier, `/ecosystemes/:slug`) — la couche Atlas / analyse signée (cf. §4.5bis).
- **Outils & cas** : `SimulatorsPage` / `SimulatorPage` (`/simulators`), `CaseStudyPage` (`/cases/:slug` ; l'index `/cases` redirige vers la Bibliothèque), `blog/BlogPage` / `BlogPostPage`.
- **Formation** : **`ParcoursPage`** (catalogue, `/parcours`), **`ParcoursDetailPage`** (fiche intermédiaire, `/parcours/:slug`), **`LibraryPage`** (inventaire filtrable, `/bibliotheque`), `CourseDetailPage` (`/courses/:slug`) et `LessonPage` (`/lessons/:slug`, lecture active). Les anciennes URL `/bibliotheque/:slug` redirigent vers l'inventaire et restent hors index.
- **Core & Infrastructure** : **`SplashPage`** (route index `/`), `HomePage` (`/home`), `OnboardingPage` (`/onboarding`, entrée courte vers les espaces principaux), `IkigaiPage` (`/ikigai`, cahier introspectif avec `OrientationTest` + `MythCard`), `GlossaryPage`, `SearchPage`, `system/NotFoundPage`, `system/DesignSystemShowcasePage`.
- **Workspace** (`pages/workspace/`) : `DashboardPage`, **`DecisionJournalPage`** (`/journal`, carnet de décision — §4.5sexies), `NotesPage`, plus `onboarding/ProfileResultPage` et `onboarding/ProfilePage`.

> [!IMPORTANT]
> **Parcours et Bibliothèque.** `/parcours` filtre par famille et niveau d'approfondissement (`?family=`, `?budget=`, synchronisés à l'URL), puis affiche des rangées comparables groupées par famille. Un emplacement de reprise ou d'orientation précède la liste. L'atlas facultatif peut être préchargé au survol ou au focus du bouton ; son ouverture exige une activation. La fiche `/parcours/:slug` hérite du `?budget=` choisi. `/bibliotheque` inventorie les ressources existantes, sans seconde taxonomie.

### 3.4. Routage V1 française

La V1 est française et non localisée. [App.tsx](../client/src/App.tsx) monte les routes sous `MainLayout`. Le splash est `/` ; `/home` présente Formation et Intelligence VC. `/design-system` est réservé au développement. [shared/routes.mjs](../shared/routes.mjs) distingue familles exécutables, publiques, non indexables et redirections historiques ; l'accès direct statique relève du [§6](#hebergement).

Conséquences opérationnelles :

- les liens internes utilisent les primitives de `react-router-dom` ou les helpers existants de l'app, sans wrapper de locale ;
- le sitemap et le prérendu émettent les chemins canoniques non préfixés ;
- les marqueurs `[[slug]]` / `{{slug}}` de `markdown.tsx` restent inchangés : les slugs demeurent canoniques.

---

## 4. Guide d'édition — ajouter / modifier du CONTENU

> Les types généraux sont définis dans [client/src/content/types.ts](../client/src/content/types.ts) ; les types propres aux certifications vivent dans [client/src/content/certificationTypes.ts](../client/src/content/certificationTypes.ts). **Gardez le type et le schéma de validation cohérents lorsque vous ajoutez un champ.**

<a id="ids-slugs"></a>

### 4.0. Conventions d'`id` et de `slug`

- `slug` = identifiant d'URL (kebab-case, sans accent). Doit être **unique** par type.
- `id` = clé interne stable. Respecter les conventions de la collection et préserver les identifiants existants ; les préfixes historiques ne constituent pas une liste exhaustive. Pour le glossaire, `id === slug`.
- Les ressources sont généralement reliées par `id` ; les marqueurs et références glossaire utilisent le `slug`. Vérifier le type et le résolveur du champ concerné, sans assimiler un ID de cours à un slug de dictionnaire.

```
Parcours.steps[].ref ──► ressources existantes    Course.lessonIds[] ──► Lesson.id
Certification requirements ──► Course.id + sous-ensemble ordonné de Lesson.id
Lesson.courseId ──► Course.id
Lesson.glossaryRefs[] ──► Glossary.slug  Glossary.relatedLessonIds[] ──► Lesson.id
CaseStudy.glossaryRefs[] ──► Glossary.slug   Simulator.relatedLessonIds[] ──► Lesson.id
Deliverable.model{kind,id} ──► CaseStudy.id | EcosystemDossier.id | Memo.id | Lesson.id
Deliverable.relatedLessonIds[] ──► Lesson.id   ParcoursStep.ref(milestone).id ──► Deliverable.id | Lesson.id
KnowledgeCertification.capstoneDeliverableId? ──► Deliverable.id
Lesson.furtherReading{kind=deliverable}.ref ──► Deliverable.id
```

### 4.0.b. Taxonomie et validation

Les schémas de [scripts/validate-content.mjs](../scripts/validate-content.mjs) sont stricts. Ajouter un champ exige d'aligner type, schéma, contrôles de références et consommateurs. Une nouvelle collection doit aussi entrer dans le scan des marqueurs. Ne pas confondre la taxonomie envisagée (§1bis) avec les champs déjà requis, notamment `status` pour les leçons et articles.

Valider depuis la racine. Les erreurs sont toujours bloquantes ; `validate:content:strict` rend aussi les warnings bloquants, sauf les `softWarnings` explicitement reconnus. Une validation structurelle ne prouve ni la justesse des faits ni la qualité pédagogique.

<a id="style-editorial"></a>

### 4.0.c. Style rédactionnel — charte transverse (non négociable)

Toute prose éditoriale publiée sur le site suit la **même** charte de style, quelle que soit la collection : leçons (`body`, `summary`, `keyTakeaways`, quiz), glossaire (`short`, `definition`, `example`), études de cas et analyses/blog (`sections`, `excerpt`, `body`), dossiers d'écosystème (`these`, sections, `convictions`, signaux, légendes de figures), parcours (`hook`, `goal`, `outcomes`, `prerequisites`), certifications et promesses de niveau, charte du candidat, cahier ikigai et fiches de simulateurs (`description`).

> [!IMPORTANT]
> **Autorité éditoriale.** `PRODUCT.md` porte les principes produit. La présente section est la charte transverse détaillée et canonique pour la prose publiée. `CLAUDE.md` et `AGENTS.md` n'en gardent qu'un résumé opérationnel pour les agents. Le skill [`.claude/skills/ecosystemes/SKILL.md`](../.claude/skills/ecosystemes/SKILL.md) ajoute les contraintes propres aux dossiers d'écosystème ; il ne remplace ni n'étend silencieusement la charte transverse.

Le registre visé est celui d'un analyste compétent qui rédige un mémo, pas d'un copywriter qui vend. Concrètement :

- **Ton correct, sobre, factuel et institutionnel dans chaque nouvelle section et chaque révision.** Sont proscrits les formulations sensationnelles ou promotionnelles, la dramatisation, la survente, les superlatifs, l’urgence artificielle, les slogans et les appels à l’adhésion, ainsi que les tournures assimilables au marketing de réseau ou à une prose LLM stéréotypée.
- **Prose fluide, longueurs de phrases variées.** Des phrases courtes, puis une plus longue qui prend son temps. Ouvertures *in medias res*, sans mise en bouche.
- **Une idée par paragraphe**, énoncée puis étayée. Chaque phrase apporte une information neuve ; on coupe ce qui ne fait que « sonner intelligent » (« Il est important de noter que… »).
- **Bannir les tics d'IA** : énumérations mécaniques (« Premièrement… Deuxièmement… »), une punchline à la fin de chaque paragraphe, surdensité de deux-points / tirets / appositions, gras multiples par section, méta-discours (« Notre lecture : »).
- **Registre sobre, ne pas survendre** (c'est là que les brouillons échouent le plus). Proscrits : métaphores vendeuses, superlatifs et dramatisation (« spectaculaire », « étonnamment »), aphorismes de clôture, adverbes qui dictent au lecteur ce qu'il doit ressentir.
- **Énoncer le fait, donner le chiffre avec sa source, en tirer la conséquence en mots simples, s'arrêter.** Une affirmation est plus forte à plat qu'habillée. Les titres et légendes **décrivent ce qui est montré**, ils ne performent pas une thèse.
- **Grounding** : aucun chiffre sans source vérifiée ; préférer l'ordre de grandeur honnête (« de l'ordre de », « ≈ ») à la fausse précision.

> [!NOTE]
> La charte vise les contenus VC Intelligence et **toute nouvelle production**. Des contenus historiques gardent par endroits des tournures « école » : on les aligne au fil des relectures, sans imposer de réécriture de masse.

<a id="lecons"></a>

### 4.1. Ajouter une LEÇON (`data/lessons.json`)

La leçon est une unité pédagogique autonome. Partir du type `Lesson` et de `lessonSchema` dans [le validateur](../scripts/validate-content.mjs), plutôt que d'un exemple JSON partiel.

1. Attribuer un `id` stable, un `slug` unique, un `courseId` existant et un `order` cohérent.
2. Renseigner `title`, `kicker`, `readMin`, `summary`, `glossaryRefs` et **`status`**. `published` exige `body` et `keyTakeaways` ; `upcoming` exige les métadonnées pédagogiques prévues par le schéma, sans corps accessible au lecteur.
3. Maintenir la réciprocité entre `lesson.courseId` et `course.lessonIds`. Le lecteur sélectionne par `courseId` et trie par `order` ; aligner cette séquence avec celle du cours.
4. Rédiger selon la [charte §4.0.c](#style-editorial). Vérifier quiz, prérequis, ressources `furtherReading` et éventuelle pratique structurée, sans confondre lecture et temps de production.
5. Valider, régénérer les splits, contrôler leur parité, puis vérifier la leçon et son contexte de cours/parcours (§4.8).

**Registres drop-in.** `scripts/split-lessons.mjs` fusionne `data/lessons.json` avec les tableaux `lessons` des fichiers `data/parcours/*.lessons.json`. Aucun import client manuel n'est nécessaire, mais un nouveau registre ou une modification exige de relancer le split. Les slugs en double sont bloquants.

> [!NOTE]
> **Temps de lecture opt-in Série A.** Le registre `data/parcours/05-preparer-sa-serie-a.lessons.json` applique explicitement `readMin = ceil(nombre de mots du body / 180)` avec le motif Unicode `\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*`, références incluses. Cette convention calibre uniquement ce parcours à ce stade ; elle ne migre pas les corpus historiques et ne remplace pas les temps de production `practice.estimatedMinutes`, qui restent estimés séparément.

#### La mini-syntaxe Markdown du `body`

Le rendu est assuré par [client/src/lib/markdown.tsx](../client/src/lib/markdown.tsx). Sont supportés :

| Syntaxe | Rendu |
| --- | --- |
| `## Titre` / `### Sous-titre` | titres éditoriaux |
| ligne(s) `- texte` | liste à puces |
| ligne(s) `1. texte` | liste ordonnée |
| `**gras**` · `*italique*` | emphase |
| `[[slug]]` ou `[[slug\|libellé]]` | **lien dictionnaire inline** — termes VC |
| `{{slug}}` ou `{{slug\|libellé}}` | **lien dictionnaire inline** — fonds, outils, institutions |
| ligne vide | nouveau paragraphe |

> [!TIP]
> Les marqueurs `[[slug|libellé]]` et `{{slug|libellé}}` désignent le **glossaire**, jamais un cours ou une leçon. Un slug absent peut être rendu en texte simple, mais reste une erreur de validation. Pour une autre ressource, utiliser un lien Markdown vers sa route existante. Dans le [cahier Ikigai (§8)](#ikigai), `[[..]]` est interactif en mode Avancé, `{{..}}` dans les deux modes.

#### Détection automatique des termes (prose des leçons)

`markdown.tsx` complète le balisage par une détection automatique lorsque `glossaryPreview` est actif : prose de leçon via `ActiveProse sourceType="lesson"` et définitions de `GlossaryPage`. Elle couvre les termes et aliases éligibles du glossaire, pas tout le vocabulaire technique possible ; une relecture reste nécessaire.

- Le matcher retient les termes et aliases du glossaire, sauf les formes minuscules trop courtes ou ambiguës. Il lie la première occurrence éligible dans le rendu ; les suivantes restent en texte simple.
- Les **marqueurs manuels** `[[..]]` / `{{..}}` restent prioritaires : leurs slugs sont pré-amorcés, donc la détection auto ne re-lie jamais un terme déjà balisé.
- Les **sigles** (VC, MOIC, B2B, DPI…) sont reconnus **en respectant la casse** : `VC`/`VCs` sont liés, `vc` en minuscule ou `VC` à l'intérieur d'un mot (`MVC`) ne le sont pas. Les phrases longues priment sur leurs sous-mots (« fonds VC » → `venture-capital-fund`).
- **Contenu du popover** : terme + champ `short` uniquement. Le **panneau entier** est cliquable et redirige vers `/glossary?term=slug` (lien réel : accessible clavier, clic-milieu/nouvel onglet préservés).
- **Portée** : leçons (toutes via `LessonPage`) + définitions du dictionnaire. Les **études de cas / blog** restent en balisage manuel uniquement (`glossaryPreview` désactivé).

<a id="glossaire"></a>

### 4.2. Ajouter un TERME au dictionnaire (`data/sources/canonical-glossary.json` puis `data/glossary.json`)

1. Chercher d'abord le concept et ses variantes dans le registre et le glossaire publié ; une variante simple devient un alias, pas une nouvelle fiche.
2. Documenter dans le registre la provenance réellement vérifiée, la décision (`add`, `update`, `merge`, `skip`) et son statut. Une URL valide ou un chemin local ne suffit pas à justifier `source-backed`.
3. Reporter la décision retenue dans la fiche publiée : `id === slug`, titre `term`, catégorie, `short`, définition, aliases et références cohérents. Les exemples méthodologiques doivent être explicitement distingués des faits sourcés.
4. Conserver les aliases dans **`data/glossary.json`** : la recherche et la détection ne les lisent pas directement dans le registre. `npm run aliases:merge` peut reporter les aliases approuvés ; examiner ses écritures avant validation.
5. Exécuter les [contrôles et la régénération](#validation). Ne déclarer une entrée appliquée qu'après alignement des deux couches.

`validate:glossary` contrôle notamment slugs, `id === slug`, URL HTTPS, `seeAlso`, marqueurs `[[..]]` et collisions d'aliases. **Limite actuelle :** ses `relatedLessonIds` ne sont résolus que contre `data/lessons.json`, contrairement au validateur général qui connaît aussi les registres drop-in. Ne pas contourner un échec par une fausse référence ; traiter séparément l'évolution du validateur si une référence drop-in est nécessaire.

#### Comportement de la page `/glossary`

Le dictionnaire est rendu par [GlossaryPage.tsx](../client/src/pages/glossary/GlossaryPage.tsx). Les contrôles (alphabet, domaines, recherche) sont regroupés dans un bandeau **sticky** compact :

- `activeLetter` suit la section alphabétique explorée au scroll et se met aussi à jour au clic ;
- `ResizeObserver` mesure le bandeau sticky pour alimenter `--glossary-anchor-offset` ; les ancres `letter-*` et `term-*` utilisent ce scroll-margin afin de ne jamais passer sous les filtres ;
- sur mobile, alphabet et domaines sont horizontalement scrollables ;
- tous les `scrollIntoView` respectent `prefers-reduced-motion`.

<a id="bibliotheque"></a>

### 4.3. Bibliothèque : inventaire filtrable des ressources

La Bibliothèque (`/bibliotheque`) n'est pas une collection éditoriale ni une taxonomie autonome. `LibraryPage` agrège les cours, les leçons explicitement publiées et les études de cas depuis leurs collections propriétaires. Les filtres d'URL portent sur le type, le niveau, la famille de parcours, la durée, le thème et la recherche textuelle.

Pour rendre une ressource visible, il faut donc modifier sa collection source et ses relations existantes ; ne créez pas de « rayon » ou de regroupement parallèle. Les anciennes URL `/bibliotheque/:slug` sont conservées comme redirections non indexables vers l'inventaire et sont émises comme pages de redirection par le prérendu strict.

<a id="parcours"></a>

### 4.3bis. Ajouter un PARCOURS (`data/parcours.json`)

**Path = Parcours = trajectoire de formation ordonnée par objectif, composant librement des ressources existantes.** Un parcours ne stocke pas de copie du contenu : il référence les ressources par `id`, peut réutiliser un même cours, une même leçon, un cas, un simulateur ou un livrable, et conserve une navigation libre. Le diagnostic d’entrée se raccorde séparément par `entryDiagnosticId`, pas par un nouveau `steps[].ref.kind`. Type : [`client/src/content/parcoursTypes.ts`](../client/src/content/parcoursTypes.ts) ; loader : [`client/src/content/parcours.ts`](../client/src/content/parcours.ts). Politiques transverses : [`docs/parcours/README.md`](parcours/README.md).

Définir objectif, public, niveaux, prérequis, famille, durée et jalon avant de composer `steps`. Chaque étape renseigne `order`, `type`, `ref`, `label` et `status` ; elle référence une ressource, sans en copier le contenu. Les valeurs admises et champs optionnels restent dans le type et le schéma, pas dans un modèle JSON incomplet.

> [!IMPORTANT]
> - **Le curseur temps** est implémenté par `timeFit` + le `type` des étapes : `visibleSteps(p, budget)` montre `low → coeur`, `medium → coeur+pratique`, `high → tout`. Taguez donc les étapes correctement.
> - **Temps dérivé** : `time.source: "derived"` supprime les totaux recopiés. [learningTime.ts](../client/src/content/learningTime.ts) calcule lecture, pratique guidée, consolidation, final et facultatif depuis les leçons et les activités référencées, dont cas, simulateurs et livrables. Vérifier les règles de contribution et de déduplication dans ce propriétaire ; une durée absente n’est pas une preuve de charge nulle.
> - **Résolution des `ref`** : `resolveStep` dans `content/parcours.ts` résout les ressources. `milestone` vise d'abord un livrable, puis une leçon pour compatibilité. Seule l'association `ref.kind: "milestone"` + `status: "a-produire"` autorise une référence encore absente. Le préfixe `todo-*` ne dispense jamais à lui seul de résolution.
> - **Aiguillage ikigai** : pour qu'un profil recommande ce parcours, ajoutez-le dans [`data/profileParcours.json`](../data/profileParcours.json). Les politiques transverses (progression souple, évaluation, langue V1 FR) sont dans [`docs/parcours/README.md`](parcours/README.md).
> - **Langue** : les champs texte de parcours sont des chaînes françaises simples ; aucune surcharge EN n'est servie.

#### Relations de la carte (`data/parcoursRelations.json`)

La carte `/parcours` consomme un registre d'arêtes distinct du contenu des parcours. Chaque entrée déclare `sourceId`, `targetId`, `kind` (`peer|progression`), au moins une catégorie de preuve dans `evidence[]` et une `rationale` factuelle. `peer` est non orientée dans l'interface et exige deux parcours de même `level`. `progression` est orientée et décrit une suite conseillée ; elle ne verrouille rien et ne relie pas implicitement un parcours aux niveaux de `certificationLevels.json`.

Le validateur refuse les identifiants absents, les boucles sur soi, les doublons — y compris un doublon `peer` inversé —, les relations `peer` entre niveaux différents et les cycles de progression. La pertinence ne peut pas être déduite du seul niveau : elle doit être appuyée par les prérequis, `profileParcours.json`, un recouvrement substantiel des ressources, les objectifs publiés ou un référentiel maintenu. Dans `PathAtlas`, les arêtes ne sont montées que pour le sceau survolé, focalisé ou sélectionné par un premier appui tactile ; un second appui ouvre le parcours.

<a id="cours"></a>

### 4.4. Ajouter un COURS (`data/courses.json`)

Renseigner identité, titre, sous-titre, niveau, résumé, tags, `durationMin` et `lessonIds` selon le type `Course`. Vérifier la réciprocité et l'ordre des leçons (§4.1). Le champ facultatif `durationSource: "lesson-read-minutes"` impose la somme de leurs `readMin` ; il n'inclut pas le temps de production.

Une leçon peut contribuer à un dossier longitudinal via `practice`, avec `deliverableId`, `sectionId` et `estimatedMinutes`. Ce temps de production reste distinct de `readMin`.

<a id="cas-analyses"></a>

### 4.5. Étude de cas (`data/caseStudies.json`) & Analyse/blog (`data/blog/*.json`)

> Prose soumise à la **charte de style §4.0.c** (registre sobre, pas de punchlines ni de survente).

- **Étude de cas** : `kind` ∈ `startup|fund|deal|market`, `sections[]` (`heading` + `body` markdown), `takeaways[]`, `glossaryRefs[]`. `learningRole: "learner-dossier"` ajoute des `documents[]` et des tables structurées rendues en HTML natif. `learningRole: "transfer"` signale un cas d'application différée.
- **Correction commentée** : `data/caseCorrections.json` reste une collection distincte, chargée uniquement par `/cases/:slug/correction` après l'action de révélation. Elle n'entre ni dans la recherche, ni dans la Bibliothèque, ni dans le sitemap. Cette séparation règle un ordre pédagogique, sans créer de confidentialité dans le paquet statique.
- **Diagnostic** : `data/diagnostics.json` porte des réponses qualitatives et des renvois vers des leçons ou livrables. `Parcours.entryDiagnosticId` active `/parcours/:slug/diagnostic`. Le schéma n'accepte aucun score ou total.
- **Analyse (blog)** : un fichier par slug, conforme à `blogSchema`, avec `status: "draft" | "published"` obligatoire. Seul `published` alimente les surfaces publiques. Le format comprend notamment auteur, date, catégorie, résumé, corps Markdown et tags. `books[]` et `glossaryRefs[]` sont optionnels ; leur rendu est porté par les pages du blog.

<a id="ecosystemes"></a>

### 4.5bis. Dossier d'écosystème (`data/ecosystems.json`) — « Décortiquer un écosystème »

Espace d'**analyse signée** (`/ecosystemes`), **100 % client** : tout vit dans `data/ecosystems.json` (type `EcosystemDossier` dans `client/src/content/types.ts`), même pattern que les memos / l'anti-portfolio.

- **Arbre** via `parentId` + `order` (profondeur illimitée). Un **dossier-racine** (sans `parentId`) est le **seul listé sur l'index** et **doit** porter une `these` ; un **sous-dossier** peut omettre `these`/`convictions`/`signals`/`players`/`sources` (tous optionnels). Tri des frères : `order` croissant, puis révision la plus récente d'abord.
- **Format éditorial** : thèse falsifiable + `convictions[]` **datées, à degré d'assurance explicite** (`strength` ∈ `exploratoire|moyenne|forte`, jamais implicite) + `signals[]` directionnels (`haussier|baissier|incertain`). `kind` ∈ `geographie|secteur|these`. Dates ISO `YYYY-MM-DD`. Loader : `rootEcosystems()`, `childEcosystems(id)`, `ecosystemAncestors(d)` dans `client/src/content/ecosystems.ts`. La page de détail affiche : fil d'Ariane → thèse → sections (+ figures) → convictions → signaux → acteurs → « Approfondir » (enfants) → sources.
- **Figures** (`section.figures[]`) : le renderer markdown maison ne gère ni image, ni HTML brut, ni tableau → les visuels sont des **figures structurées**, rendues en **SVG/HTML natif theme-aware** par `client/src/components/ecosystems/EcosystemFigures.tsx`, **sans aucun asset ni librairie de charting**. 5 types (union discriminée par `kind`) : `bars`, `line`, `matrix`, `quadrant`, `taxonomy`. **Un nouveau type de figure = 3 éditions synchronisées** : l'union dans `types.ts`, le `z.discriminatedUnion` dans `scripts/validate-content.mjs`, le renderer dans `EcosystemFigures.tsx`.
- **Figures** : ne pas placer de marqueurs `[[slug]]`/`{{slug}}` dans leurs textes ; le renderer ne les interprète pas et les afficherait littéralement. Un slug inexistant échoue aussi au scan du validateur. Préserver la sérialisation JSON canonique lors des modifications.
- **Validation** : `npm run validate:content` applique un Zod strict (parent existant, **absence de cycle**, racine ⇒ `these`, `glossaryRefs` + marqueurs `[[..]]` résolus). Si le glossaire change : `npm run split:content`.
- **Méthodo complète** : skill projet **`.claude/skills/ecosystemes/SKILL.md`** — à lire avant tout travail sur un dossier. Il complète la charte transverse §4.0.c pour cette collection, sans la remplacer.

<a id="livrables"></a>

### 4.5ter. Livrable autoévalué (`data/deliverables.json`)

> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client**, même pattern que les dossiers d'écosystème.

Un **livrable** décrit un artefact produit par l'apprenant. Il peut réaliser une étape `deliverable` ou `milestone` d'un parcours, ou servir de mise en situation autonome à une certification. La page `/livrables/:slug` réunit la consigne, le gabarit, la grille et les ressources. Les champs optionnels `activityKind`, `estimatedWorkMinutes`, `components`, `rubricLevels`, `roleCards`, `caseStudyId`, `correctionId` et `journal` décrivent les cycles de production plus complets.

- **Type** `Deliverable` dans `client/src/content/types.ts` ; loader `client/src/content/deliverables.ts` ; page `client/src/pages/intelligence/DeliverablePage.tsx` ; route `livrables/:slug`. Le `model.kind` ∈ `ecosystem|case|memo|lesson` est résolu vers `/ecosystemes`, `/cases`, `/memos` ou `/lessons`.
- **Câblage depuis un parcours** : `ref.kind: "deliverable"` convient aux exercices et fiches ; `ref.kind: "milestone"` reste réservé au jalon final et aux entrées historiques.
- **Suivi local** : `client/src/lib/learningWorkspace.ts` conserve un schéma versionné sous `vcpx:learning-workspace`. La lecture reste dans `vcpx:progress`. Les notes, fichiers externes déclarés, revues, appréciations et versions révisées sont donc suivis séparément.
- **Câblage depuis une certification** : renseigner `KnowledgeCertification.capstoneDeliverableId` avec l'`id` canonique du livrable. Le détail de la certification doit présenter cette ressource comme une mise en situation autoévaluée hors score ; elle ne modifie ni le barème, ni les seuils, ni le résultat local. Une leçon peut également la proposer dans `furtherReading` avec `kind: "deliverable"` et la même référence par `id`.
- **Découvrabilité** : penser au barrel `content/index.ts`, à la recherche `content/search.ts`, au libellé dans `content/labels.ts`, à `shared/routes.mjs` (OG `livrables: 'path'`) et à la collecte des routes dans `scripts/collect-routes.mjs`.
- **Validation** : `scripts/validate-content.mjs` applique un Zod strict, résout `model`, `relatedLessonIds`, `glossaryRefs`, `KnowledgeCertification.capstoneDeliverableId`, les `furtherReading` de type `deliverable` et les marqueurs `[[..]]`. Un `capstoneDeliverableId` absent est admis ; un identifiant renseigné mais introuvable est bloquant.

<a id="memos"></a>

### 4.5quater. Mémo d'investissement annoté (`data/memos.json`)

> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client**.

Un **mémo annoté** reprend un mémo d'investissement **réellement publié** et l'expose section par section, chaque passage commenté par ce que l'investisseur y fait, sur le plan de la décision. C'est la bibliothèque `/memos` (`MemoLibraryPage`) et la lecture `/memos/:slug` (`MemoPage`).

- **Type** `InvestmentMemo` dans [`client/src/content/types.ts`](../client/src/content/types.ts) ; loader [`client/src/content/memos.ts`](../client/src/content/memos.ts). `id` → `memo-*`.
- **Format** : en-tête factuel (`company`, `fund`, `author`, `date`, `stage`, `amount?`, `outcome`, `whyItMatters`) + **provenance obligatoire** (`sourceUrl`, `sourceNote`) + `context` (markdown). Le corps est `sections[]`, chaque section = `heading` + `blocks[]` ; un bloc = `excerpt` (extrait **court**, `isParaphrase: true` quand condensé) + `note` (markdown) + `tag` ∈ `these|marche|traction|equipe|risque|deal|concurrence|verdict`. Puis `lessons[]`, `glossaryRefs[]`, `relatedAntiPortfolioIds?`, `tags[]`.
- ⚠️ **Légal / éthique** : ne reprendre que des mémos dont la diffusion publique est documentée (`sourceNote`) ; garder les `excerpt` brefs, renvoyer à l'original.
- **Câblage d'une nouvelle collection** : barrel [`content/index.ts`](../client/src/content/index.ts), recherche [`content/search.ts`](../client/src/content/search.ts), SEO/sitemap [`shared/routes.mjs`](../shared/routes.mjs) et l'énumération des pages de détail dans [`scripts/collect-routes.mjs`](../scripts/collect-routes.mjs).
- **Validation** : `scripts/validate-content.mjs` applique un schéma Zod strict, vérifie les identifiants et slugs uniques, résout les références croisées et inclut `memos.json` dans le scan des marqueurs `[[..]]` / `{{..}}`.

<a id="anti-portfolio"></a>

### 4.5quinquies. Anti-portfolio (`data/antiPortfolio.json`)

> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client**.

L'**anti-portfolio** documente des **refus d'investissement** devenus coûteux, sans biais rétrospectif : on reconstitue l'information publique disponible au moment de la décision, on défend honnêtement le refus, puis on nomme le signal manqué. Index `/anti-portfolio` (`AntiPortfolioPage`), détail `/anti-portfolio/:slug` (`AntiPortfolioEntryPage`).

- **Schéma** : le fichier est un **objet-enveloppe** `{ "patterns": AntiPortfolioPattern[], "entries": AntiPortfolioEntry[] }`, exposé par [`content/antiPortfolio.ts`](../client/src/content/antiPortfolio.ts). `id` d'entrée → `ap-*`.
- **`patterns[]`** : motifs récurrents de refus ; une entrée s'y rattache par `patternIds[]`. Vérifier les identifiants dans la collection, sans recopier leur inventaire ici.
- **`entries[]`** : `company`/`title`/`subtitle`, `passes[]`, `sector`, `summary`, `quote?`, **`knownAtTheTime[]`** (info **publique et datée** disponible à l'époque), `statedReason` + `reasonIsPublic`, `missedSignal` (markdown), **`steelman`** (markdown : le meilleur argument *en faveur* du refus, ex ante — exigé, garde anti-biais), `outcome`, `costEstimate?` (toujours une estimation), `takeaways[]`, `glossaryRefs[]`, `relatedMemoIds?`, `sources[]`.
- **Câblage** identique à §4.5quater.
- **Validation** : `scripts/validate-content.mjs` valide l'objet-enveloppe et ses deux collections, les identifiants et slugs uniques, les références vers motifs et mémos, les références glossaire et les marqueurs `[[..]]` / `{{..}}`.

<a id="convictions"></a>

### 4.5sexies. Convictions (vue dérivée) & Carnet de décision

Deux surfaces de la couche Intelligence qui **ne s'éditent pas comme une collection** :

- **Convictions** (`/convictions`, `ConvictionsPage`) : **aucun fichier de données propre**. [`content/convictions.ts`](../client/src/content/convictions.ts) (`allConvictions()`) **agrège** les `convictions[]` de tous les dossiers d'écosystème (statement, `horizon`, `strength` ∈ `exploratoire|moyenne|forte`, `rationale`, + provenance). Pour ajouter ou corriger une conviction, on édite le `convictions[]` du dossier concerné dans `data/ecosystems.json` (§4.5bis) — la page se recompose, triée et filtrable.
- **Carnet de décision** (`/decisions` = présentation `DecisionsIndexPage` ; `/journal` = l'outil `DecisionJournalPage`) : ce n'est **pas du contenu éditorial**, c'est une **donnée utilisateur**, comme les notes, persistée en **`localStorage`**. Type client `DecisionJournalEntry`, calibration dans [`client/src/lib/decisionJournal.ts`](../client/src/lib/decisionJournal.ts) (testée, `decisionJournal.test.ts`). Une prédiction = énoncé falsifiable + `confidence` (50–99 %) + `reviewAt` ; résolue `correct|incorrect|void` (les `void` sont exclus du calcul de calibration). `/journal/*` appartient à `NOINDEX_ROUTE_PATTERNS` dans [`shared/routes.mjs`](../shared/routes.mjs). Un éditeur ne l'alimente pas : l'utilisateur la produit.

<a id="certifications"></a>

### 4.5septies. Certification et collections associées

L'[architecture transverse des certifications](certifications/ARCHITECTURE-CERTIFICATIONS.md) fait foi pour les catégories de titres, l'échelle VC, les cinq axes cibles, le titre professionnel invariant `VC Analyst`, le supplément contextualisé et les limites de la délivrance locale. Le [référentiel professionnel VC Analyst](certifications/REFERENTIEL-VC-ANALYST.md) porte la préparation et les preuves futures de la certification.

`Fondamentaux de l’analyse en capital-risque` et `Fondamentaux de la venture philanthropie` sont des parcours autonomes, pas des certifications. Leurs référentiels sont [ANALYST-FOUNDATIONS.md](parcours/ANALYST-FOUNDATIONS.md) et [VENTURE-PHILANTHROPIE.md](parcours/VENTURE-PHILANTHROPIE.md). L'option historique `specialty: "impact"` de `VC Analyst` ne constitue ni un alias, ni un niveau, ni un prérequis de ces parcours.

Quatre collections ont des responsabilités distinctes :

| Collection | Responsabilité |
| --- | --- |
| `data/certifications.json` | Certifications publiées, catégorie, exigences de cours et contextualisation actuellement exposée |
| `data/certificationLevels.json` | Promesse canonique des cinq niveaux et limites de chacun |
| `data/candidateCharters.json` | Versions de la charte du candidat et annexe de session future inactive |
| `data/certificationAssessments.json` | Évaluations versionnées lorsqu’une certification publiée en comporte une |

Le type `Certification` est une union discriminée `KnowledgeCertification | ProfessionalCertification`. Un `CourseRequirement` peut référencer un sous-ensemble de leçons du cours indiqué, sans doublon et **dans l'ordre canonique de `course.lessonIds`**. Le champ optionnel `KnowledgeCertification.capstoneDeliverableId` relie un `Deliverable` autonome, affiché comme mise en situation autoévaluée hors score.

Règles d'édition :

- modifier la collection propriétaire du fait, sans recopier les promesses, la charte ou l'évaluation dans `certifications.json` ;
- conserver le titre professionnel `VC Analyst` indépendant des options ; le contexte se résout dans un supplément séparé ;
- distinguer la cible documentaire à cinq axes de la transition actuelle à trois axes (`fundStage`, `dealRole`, `specialty`) ;
- conserver `specialty: "impact"` comme donnée de transition de `VC Analyst`, sans l'assimiler au parcours de venture philanthropie et sans annoncer de migration des axes ;
- préserver la compatibilité des sélections locales existantes tant que la migration des axes n'est pas décidée ;
- ne jamais présenter une progression ou un résultat local comme une délivrance professionnelle ;
- lorsqu'un `capstoneDeliverableId` est renseigné, vérifier sa résolution vers `data/deliverables.json` et maintenir explicitement le livrable hors du score de l'évaluation ;
- versionner toute modification substantielle d'une charte ou d'une évaluation au lieu d'altérer rétroactivement une tentative enregistrée ;
- vérifier les totaux, seuils par partie, tolérances numériques et références croisées avec `npm run validate:content` puis `npm run validate:content:strict`.

La production future des épreuves professionnelles suit [`PROTOCOLE-PRODUCTION-ANALYST.md`](certifications/PROTOCOLE-PRODUCTION-ANALYST.md). Le cadre humain futur reste inactif et borné dans [`GOUVERNANCE-CERTIFICATIONS.md`](certifications/GOUVERNANCE-CERTIFICATIONS.md).

<a id="simulateurs"></a>

### 4.6. Simulateur (`data/simulators.json`)

Le JSON ne décrit que la **fiche** (titre, `category`, `accent`, `description`, `relatedLessonIds`). **La logique de calcul est du code**, enregistrée par slug dans [client/src/components/simulators/index.ts](../client/src/components/simulators/index.ts). Ajouter un *nouveau* simulateur = ajouter la fiche JSON **et** brancher son composant dans ce registre.

**Exception du simulateur de note d'investissement.** Son composant React intègre un outil embarqué ; ses sources propriétaires sont dans [nouveau simu/src/](../nouveau%20simu/src/). [scripts/build-investment-memo.mjs](../scripts/build-investment-memo.mjs) assemble les trois HTML de distribution. Ne pas les éditer directement : lancer `npm run build:memo`, puis `npm run check:memo`. Cette exception concerne aussi les textes d'interface de cet outil.

### 4.7. Édition (sans CMS)

Le projet n'utilise pas de CMS. Éditer le JSON source ou le code propriétaire, avec l'exception du simulateur de note décrite au §4.6. Lancer les validations depuis la racine ; les compléter par les tests de code et de rendu lorsque la logique ou l'interface change.

<a id="validation"></a>

### 4.8. Checklist après édition de contenu

1. Vérifier forme JSON, champs admis, statut, unicité des ID/slugs et résolution des relations ; vérifier aussi les faits et leurs sources.
2. Lancer `npm run validate:content:strict` ; ajouter `npm run validate:glossary` si le glossaire change, en tenant compte de sa limite décrite au §4.2.
3. Pour les leçons ou le glossaire : `npm run split:content`, puis `npm run check:generated`. Pour le simulateur de note : `npm run build:memo`, puis `npm run check:memo`.
4. Vérifier le rendu, les liens, le statut public et les surfaces de découverte concernées. Le HMR intervient après la génération, pas à sa place.
5. Appliquer les contrôles supplémentaires proportionnés de [CLAUDE.md §7](../CLAUDE.md#7-validation-proportionnée). Ne consigner que les commandes réellement exécutées.

---

<a id="design"></a>

## 5. Guide d'édition — graphisme et interface

Le [design system](DESIGN_SYSTEM.md) porte les règles visuelles, responsive, motion et accessibilité. Les valeurs courantes appartiennent à [tokens.css](../client/src/styles/tokens.css), les classes à [global.css](../client/src/styles/global.css), l'échelle Tailwind à [tailwind.config.ts](../client/tailwind.config.ts). Partir des composants existants avant d'introduire une variante ; vérifier les modes clair/sombre, le clavier, le mobile et le mouvement réduit.

---

<a id="workflow"></a>

## 6. Workflow développeur (commandes & environnement)

Les commandes partent de la racine ; [package.json](../package.json) et [client/package.json](../client/package.json) font foi. Le [README](../README.md#démarrage-local) couvre l'installation. Effets à connaître :

| Commande | Effet |
| --- | --- |
| `npm run dev` | `predev` : `build:memo` puis `split:content` ; ensuite Vite client |
| `npm run build` | `prebuild` : `build:memo` → `split:content` → `validate:content` → `generate:sitemap` ; build TypeScript/Vite ; `postbuild` : `prerender:strict` |
| `npm run check` | `check:generated` → `validate:content:strict` → `validate:glossary` → `typecheck` → `lint` → `test` |
| `npm run check:memo` | Contrôle complémentaire sans écriture des HTML de note d'investissement |
| `npm run prerender:tolerant` | Diagnostic local explicite ; ne qualifie pas une publication |

Le build écrit des artefacts et ne remplace pas le contrôle strict du contenu. `check` ne comprend pas le script `check:memo`. Après une génération, examiner les sorties et lancer leur contrôle de parité. En lecture seule, inspecter aussi les effets des tests et du typecheck avant de les exécuter.

GitHub reste une sauvegarde du code. Le [workflow Pages](../.github/workflows/deploy-pages.yml) est manuel (`workflow_dispatch`), avec un job de build puis un job de déploiement distinct. Aucun push, workflow distant ou déploiement sans demande explicite ; la [procédure de sauvegarde](../Suivis/PROCEDURE_PUSH.md) ne vaut pas accord de publication.

<a id="hebergement"></a>

### 6.1. Prérendu et hébergement

- **Origine et base.** `VITE_SITE_URL` est requis pour sitemap et prérendu. [shared/base-url.mjs](../shared/base-url.mjs) accepte une origine seule, complétée par `VITE_BASE_URL`, ou une URL dont le chemin correspond à cette base. Aucun domaine de production n'est inventé.
- **Jeux de routes distincts.** [collect-routes.mjs](../scripts/collect-routes.mjs) fournit les routes publiques du sitemap. Le prérendu y ajoute les corrections de cas `noindex` et les redirections de `LEGACY_REDIRECTS` ; toutes les routes fonctionnelles non indexables ne sont donc pas préconstruites.
- **Prérendu strict.** [prerender.mjs](../scripts/prerender.mjs) pilote le navigateur avec Puppeteer, attend les métadonnées et écrit le HTML sous `client/dist`. Les échecs de navigateur, de route, de métadonnées, de compte ou de page 404 sont bloquants. Utiliser un exécutable Chromium explicite via `PUPPETEER_EXECUTABLE_PATH` pour les recettes locales.
- **Mouvement réduit.** Le prérendu émule `prefers-reduced-motion: reduce` ; les contenus doivent rester dans leur état final sans animation d'entrée bloquante.
- **Hébergement.** Servir les fichiers `<route>/index.html` pour les routes prérendues. Pour les URL inconnues, servir le véritable `404.html` avec statut HTTP 404, `noindex,nofollow` et sans canonical auto-référente, pas un succès SPA. L'accès direct aux autres routes fonctionnelles exige une règle d'hébergement explicite.
- **Hors ligne.** Le manifest et les icônes ne constituent pas une garantie PWA hors ligne ; aucun service worker n'assure ce fonctionnement.

Le contrat de build Pages utilise `/vc-plateform/` avec `https://iari-ctrl.github.io/vc-plateform`, sans domaine personnalisé configuré. Ces paramètres de construction ne prouvent ni une publication récente ni la conformité d'un hôte réel.

### 6.2. En-têtes avant remise en ligne

La politique ci-dessous est une **cible à adapter et vérifier sur l'artefact final**, pas une configuration HTTP appliquée par le dépôt. Elle reprend le prérequis d'hébergement `SEC-005` :

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

L'exception `style-src-attr` concerne les styles inline ; ne pas l'étendre indistinctement aux scripts. Contrôler les réponses HTTP réelles de l'accueil, d'une route prérendue, de la 404 et des outils embarqués, notamment le simulateur de note. Un hébergement ne permettant pas d'imposer et vérifier ces en-têtes ne satisfait pas ce prérequis. Ne pas les simuler par des balises HTML.

---

<a id="ux"></a>

## 7. Choix d'UX

- **Liberté responsable** : aucun mur d'authentification ni verrouillage pédagogique. Les données utilisateur restent locales au navigateur ; voir les mécanismes et limites de [persistance](#persistance).
- **Introspection disponible sans blocage** : l'onboarding `/onboarding` sert d'aiguillage court ; le cahier `/ikigai` reste le cadre de réflexion (*pourquoi* avant *quoi*) et oriente vers un profil d'apprentissage quand l'utilisateur le souhaite.
- **Comparer avant d'explorer** : l'index Parcours privilégie les rangées comparables ; la carte est facultative. Les relations recommandent des suites sans verrouiller la navigation.
- **Lecture active** : sélection de texte dans une leçon/étude/article → **surligner** ou **citer** dans le carnet (persisté localement).
- **Dictionnaire vivant** : marqueurs manuels et détection des termes éligibles dans les leçons ; ni détection universelle ni dispense de relecture (§4.1).
- **Simulateurs** : calculs côté client et explications adaptées à l'outil ; vérifier les fonctionnalités dans leur composant propriétaire plutôt que supposer un historique ou un dictionnaire interactif commun à tous (§4.6).

---

<a id="ikigai"></a>

## 8. Le cahier Ikigai (`/ikigai`)

Le cahier Ikigai est une surface d'introspection facultative, distincte de l'aiguillage court `/onboarding`. Il associe dimensions, intersections, archétypes, questions libres et test d'orientation vers un profil d'apprentissage, sans conditionner l'accès au contenu.

**Données** — tout vit dans [data/ikigai.json](../data/ikigai.json) (bundlé côté client) :

- `dimensions` / `intersections` / `presqueIkigai` : chaque entrée a une variante **Découverte** (`itemsDecouverte`, `exampleDecouverte`, `descriptionDecouverte`, `trapDecouverte`) en langage clair, et une variante **Avancé** (`items`, `example`, `description`, `trap`) avec marqueurs glossaire.
- `archetypes` : positionnement, exemples et `profileIds` en deux modes. Les recommandations de parcours vivent dans `profileParcours.json`, sans seconde liste recopiée dans Ikigai.
- `reflection` : questions libres en modes découverte et avancé, sans scoring.
- `questions` : le test scoré qui alimente `computeProfile` ; `profiles` : les profils d'apprentissage cibles (reliés aux archétypes et aux parcours via `profileParcours.json`).
- `myths` : idées reçues sur le VC, déboulonnées par `onboarding/MythCard.tsx`. Le test d'orientation est porté par `onboarding/OrientationTest.tsx`.

**Deux niveaux de lecture** (par section) :

- *Découverte* — pédagogique ; `[[terme]]` rendu en texte simple, `{{fonds}}` reste cliquable.
- *Avancé* — `[[terme]]` et `{{fonds}}` deviennent des **popovers épinglables** (définition + exemple + lien). Voir [client/src/components/ikigai/IkigaiText.tsx](../client/src/components/ikigai/IkigaiText.tsx).

**Composants** (`client/src/components/ikigai/`) : `IkigaiAtlasDiagram` (13 zones SVG, clavier + ARIA, anchors `ikigai-*`), `cahierUi` (`ModeToggle`, `SectionRule`, `ReadingLevelLegend`), `CahierSections` (les 5 sections), `IkigaiText`, `IkigaiCahierSummary` (résumé non-conclusif réutilisé dans Profil & Notes).

**Affichage des sections** : dans [CahierSections.tsx](../client/src/components/ikigai/CahierSections.tsx), les sections `03` (*quatre demi-chemins*) et `03.b` (*presque-ikigai*) partagent le même pattern éditorial : liste ouverte `divide-y`, numérotation romaine `I–IV`, titre + formule sur la même ligne, méta en `eyebrow`, puis alerte/piège. Gardez cette symétrie.

**Persistance du cahier** ([client/src/lib/ikigaiCahier.ts](../client/src/lib/ikigaiCahier.ts)) : brouillons des réponses libres en `localStorage`. L'**enregistrement explicite** « dans mon carnet » les écrit comme `Note` (`sourceType: 'ikigai-cahier'`). Le bouton « Repasser l'Ikigai » archive le profil précédent dans `ikigai-history` avant de l'écraser.

> [!IMPORTANT]
> Toute édition de `data/ikigai.json` ou `data/glossary.json` doit passer `npm run validate:content` (tous les `[[..]]`/`{{..}}` doivent résoudre). Toute édition du glossaire doit aussi passer `npm run validate:glossary`. Le diagramme et les modes respectent `prefers-reduced-motion`.

---

<a id="suivi"></a>

## 9. Gestion des risques et feuille de route

La direction produit et les priorités stratégiques durables sont documentées dans [`docs/STRATEGIE-vc-intelligence.md`](STRATEGIE-vc-intelligence.md). L'état courant, les risques et les priorités opérationnelles vivent dans [`Suivis/ETAT.md`](../Suivis/ETAT.md).

> [!WARNING]
> **Garde-fous d'édition à tenir :**
> - **Périmètre local** : avant toute modification structurante, vérifier les sources et exécuter les validations adaptées au sous-système touché.
> - **Validation** : ne jamais ajouter une collection sans schéma Zod, contrôles de références et scan de marqueurs dans `validate-content.mjs`. `memos.json` et `antiPortfolio.json` suivent désormais ce standard.
> - **Qualité éditoriale** : ne pas simuler une maturité professionnelle par des tableaux de bord vides ou des chiffres non sourcés ; distinguer faits, hypothèses et exemples méthodologiques.
> - **Découvrabilité** : toute nouvelle collection doit refaire le câblage recherche + SEO + sitemap (`content/search.ts`, `shared/routes.mjs`, `scripts/collect-routes.mjs`), sans briser les routes canoniques (`/parcours/:slug`, `/bibliotheque`) ni la redirection `/cases` → Bibliothèque. `/bibliotheque/:slug` est réservé aux redirections historiques non indexables.
> - **Langue** : garder une V1 FR cohérente ; ne pas réintroduire de routes localisées sans décision produit explicite.

---

> [!TIP]
> Pour contribuer : lire le type, le schéma et le consommateur concernés ; éditer la source propriétaire ; régénérer si nécessaire ; appliquer la [checklist](#validation). Pour l'interface, consulter le [design system](DESIGN_SYSTEM.md).
