# Manuel d'Architecture et d'Édition — vc-platform

> [!IMPORTANT]
> **Référence maintenue.** Ce document doit rester vrai. Il décrit l'architecture de l'application **statique**, le cycle de vie du contenu (de la source canonique JSON jusqu'à l'écran) et le guide d'édition pas-à-pas pour ajouter du contenu, modifier le design ou faire évoluer le code. Pour les routes, scripts et compteurs, la source fait foi : `client/src/App.tsx`, `shared/routes.mjs`, `package.json`, `data/`. Les compteurs courants vivent dans `Suivis/ETAT.md`, pas ici.

> [!TIP]
> Si vous ne deviez retenir qu'une chose : **le contenu canonique vit dans les JSON sources de `/data` à la racine du dépôt** (`data/*.json`, et `data/blog/*.json` pour les analyses). L'application le *bundle* directement (architecture CSR statique). Pour ajouter du contenu, vous éditez un fichier JSON : l'application le met à jour via HMR.

> [!IMPORTANT]
> **Positionnement.** D'une plateforme de formation VC, le projet est devenu une **VC Intelligence Platform**. La couche VC Intelligence est **livrée pour l'essentiel** : hub `/intelligence`, dossiers d'écosystème `/ecosystemes`, convictions `/convictions`, mémos annotés `/memos`, anti-portfolio `/anti-portfolio`, carnet de décision `/decisions` + `/journal`, méthode `/methode`, livrables `/livrables`. La formation reste un socle d'entrée précieux (aspirants, juniors, CVC, reconversions) mais ne domine plus l'identité produit. Voir §1bis pour la cartographie « cible initiale → livré ».

---

## 1. Architecture globale et technologies

Le projet est une **Single Page Application statique** sans backend réseau, reposant entièrement sur son bundle local et le stockage du navigateur.

| Couche | Technologies |
| --- | --- |
| **Front-end** (`client/`) | React 19 · Vite 6 · TypeScript · Tailwind CSS v3 · React Router 7 · lucide-react |
| **Stockage Utilisateur** | `localStorage` (gestion 100 % locale, aucune API distante) |
| **Contenu** (`data/`) | JSON brut, **source de vérité** bundlée par le client |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

```
vc-platform/
├── data/                      # ← SOURCE DE VÉRITÉ du contenu (JSON)
│   ├── paths.json  courses.json  lessons.json  glossary.json
│   ├── caseStudies.json  deliverables.json  blog/ (un JSON par slug)
│   ├── simulators.json  ikigai.json
│   ├── parcours.json  profileParcours.json
│   ├── parcours/              # registres de leçons additionnelles (*.lessons.json)
│   ├── # ── couche VC Intelligence (100 % client) ──
│   ├── ecosystems.json  memos.json  antiPortfolio.json
│   ├── generated/             # GÉNÉRÉ, ne pas éditer : lessons.index/bodies.json + glossary.index/defs.json (split:content)
│   └── sources/               # registre d'ingestion durable du glossaire
├── docs/
│   ├── parcours/              # contrat maintenu de conception des parcours
│   ├── ARCHITECTURE_EDITION.md       # ce document
│   ├── DESIGN_SYSTEM.md              # système visuel et interactionnel
│   ├── STRATEGIE-vc-intelligence.md  # direction produit maintenue
│   └── archive/                      # documents historiques non normatifs
├── PRODUCT.md                 # contrat produit : registre, intention, principes, accessibilité
├── Suivis/                    # suivi projet vivant : ETAT.md, JOURNAL.md, PROCEDURE_PUSH.md
├── shared/routes.mjs          # taxonomie de routes (noindex, OG-image par segment) — cross-runtime
├── client/                    # SPA React + Vite
│   └── src/
│       ├── content/           # types.ts + modules par collection @data + recherche locale
│       ├── context/           # Theme · UserData · UI (React Context)
│       ├── lib/               # storage · markdown · ikigai · seo · utils (safeHttpUrl)
│       ├── components/        # ui · chrome · ornaments · explore · cards · reading · ikigai · simulators · ErrorBoundary
│       ├── pages/             # pages lazy-loadées, regroupées par domaine
│       └── styles/            # tokens.css (design tokens, dont --error/--success) + global.css
└── .github/workflows/deploy-pages.yml   # déploiement GitHub Pages (build client + publication gh-pages)
```

> [!NOTE]
> Le client lit `data/` via l'alias Vite **`@data`** (ex. `import pathsJson from '@data/paths.json'` dans `client/src/content/paths.ts`). Chaque collection a son module (`paths.ts`, `courses.ts`, `lessons.ts`, etc.) afin que Rollup découpe le contenu par chunks.
>
> **Collections scindées (glossaire & leçons).** Pour alléger le hot path, `glossary.json` et `lessons.json` (+ `data/parcours/*.lessons.json`) sont **dérivés** par `scripts/split-glossary.mjs` et `scripts/split-lessons.mjs` (câblés dans `predev`/`prebuild` via `npm run split:content`) en deux fichiers chacun, écrits sous `data/generated/` : un **index léger** (`generated/*.index.json`, importé en eager pour popovers / recherche / liens) et un **chunk lourd lazy** (`generated/glossary.defs.json` / `generated/lessons.bodies.json`, corps + quiz, chargé à la demande par `loadGlossaryDefs` / `loadLesson`). **Ne jamais éditer les fichiers générés** : on édite la source, le split se relance au prochain `dev`/`build`.

---

## 1bis. Vision stratégique : cible initiale → livré

La plateforme s'est transformée pour devenir une **VC Intelligence Platform**. Le modèle d'apprentissage reste une porte d'entrée ; la valeur principale réside dans les outils de travail de l'investisseur. Le plan stratégique initial visait huit piliers sous des routes précises. La plupart ont été livrés, mais sous d'autres noms de route — la table ci-dessous fait correspondre la cible d'origine à ce qui existe aujourd'hui dans [`client/src/App.tsx`](../client/src/App.tsx).

| Pilier (cible initiale) | Route livrée | Surface |
| --- | --- | --- |
| Intelligence / Research (`/research`) | `/intelligence` + `/blog` | hub `IntelligencePage` + analyses (dont « Lectures obliques ») |
| Thesis Lab (`/theses`) | `/convictions` + `/ecosystemes` | convictions datées (vue dérivée, §4.5sexies) + thèses falsifiables portées par les dossiers d'écosystème |
| Atlas (`/atlas`) | `/ecosystemes` | « Décortiquer un écosystème » (§4.5bis), dossiers arborescents |
| Cases (`/cases`) | `/cases/:slug` | études de cas décisionnelles (l'index `/cases` redirige vers la Bibliothèque) |
| Tools (`/tools`) | `/simulators` | simulateurs de décision (§4.6) — route inchangée |
| Library (`/library`) | `/parcours` + `/bibliotheque` | parcours (§4.3bis) + rayons (§4.3) — non fusionnés |
| Glossary (`/glossary`) | `/glossary` | dictionnaire vivant et connecteur universel |
| Workspace (`/workspace`) | `/dashboard` + `/notes` + `/journal` | tableau de bord, carnet, carnet de décision (§4.5sexies) |

Surfaces livrées **hors plan initial** : `/memos` (mémos d'investissement annotés, §4.5quater), `/anti-portfolio` (ratés d'investissement documentés, §4.5quinquies), `/livrables` (artefacts de parcours, §4.5ter), `/methode` (exposé de la méthode d'analyse). Les piliers `/research`, `/theses`, `/tools`, `/library`, `/workspace` n'ont **pas** été retenus comme routes : leur valeur a été absorbée par les surfaces ci-dessus.

### Taxonomie de contenu (standard cible Phase 3)

Pour piloter ce corpus diversifié et filtrer l'affichage (ex : masquer le contenu « founder » à un investisseur), une taxonomie stricte est visée :

- **`contentKind`** : `fundamental`, `playbook`, `research-note`, `sector-note`, `thesis`, `atlas`, `case`, `framework`, `tool`, `reference`.
- **`audience`** : `investor`, `aspiring-investor`, `junior-investor`, `cvc`, `founder-facing`, `all`.
- **`rigor`** : `intro`, `practitioner`, `desk-reference`.
- **`evidenceLevel`** : `conceptual`, `analytical`, `sourced`, `decision-grade`, `maintained-intelligence`.

Ces champs sont le **standard cible de la Phase 3**, pas encore le schéma généralisé des collections historiques. Le validateur actuel est strict : **n'ajoutez pas ces champs** dans `paths.json`, `courses.json`, `lessons.json`, `data/blog/*.json`, `caseStudies.json` ou `simulators.json` tant que les types et schémas Zod n'ont pas été migrés. `memos.json` et `antiPortfolio.json` disposent désormais de schémas Zod stricts, de contrôles de références et du scan de marqueurs. Toute nouvelle collection doit embarquer les mêmes garde-fous dans `validate-content.mjs` dès son ajout.

---

## 2. Le cycle de vie du contenu (à comprendre AVANT d'éditer)

C'est le concept central de la plateforme. Le contenu suit ce chemin :

```
data/*.json + data/blog/*.json ──(client bundle @data / import.meta.glob)──► Application statique (CSR)
```

Les pages de contenu lisent directement les fichiers JSON importés depuis `@data` (alias Vite).

- Rendu **immédiat** du contenu bundlé → l'app marche en mode 100 % invité et hors-ligne.
- Toute édition dans un fichier JSON source est reflétée presque instantanément en développement via Vite HMR.

> [!TIP]
> Le build client est découpé par routes et par collections de contenu : le vendor React est isolé et les collections lourdes (`lessons`, `glossary`, `ikigai`) restent dans des chunks séparés. Le glossaire et les leçons sont en outre **scindés index/contenu** : seul l'index léger est eager, les définitions et corps (`glossary.defs.json` / `lessons.bodies.json`) arrivent en chunks lazy.

### 2.2. Conséquences pratiques

Il n'y a ni base de données ni CMS. Tout le contenu est géré statiquement.

| Vous éditez… | Ce qui se met à jour | L'action requise |
| --- | --- | --- |
| un fichier source (`data/*.json` ou `data/blog/<slug>.json`) | le **bundle** client (via HMR en dev) | Committer et ouvrir une PR pour la mise en ligne |

> [!IMPORTANT]
> **Sérialiseur canonique unique.** Le format de référence est exactement la sortie de `JSON.stringify(payload, null, 2)` + `\n`. `glossary` reste trié par `term`, `caseStudies` par `title`, et le blog vit dans `data/blog/<slug>.json` avec un fichier par article.

### 2.2.b. Cas particulier : glossaire VC

Le glossaire final consommé par l'app reste `data/glossary.json`, mais son chantier éditorial passe d'abord par `data/sources/canonical-glossary.json`.

- `canonical-glossary.json` est le registre durable : il conserve sources, modules, décisions d'édition, aliases, `action` (`add`, `update`, `merge`, `skip`) et `status` (`draft`, `needs-review`, `approved`, `applied`).
- `data/glossary.json` ne contient que les entrées finales consommées par l'application : `id`, `term`, `slug`, `category`, `short`, `definition`, `example`, `link`, `seeAlso`, `relatedLessonIds`.
- Le registre d'ingestion et le glossaire publié ont des responsabilités distinctes. Leurs volumes vérifiés vivent uniquement dans `Suivis/ETAT.md`.
- Toute variante simple doit devenir un **alias** d'un terme existant plutôt qu'une fiche autonome ; une fiche finale n'est créée que si le concept a une utilité de popover ou de navigation propre.

Pour clôturer une passe glossaire : mettez le registre à jour, injectez seulement les `add`/`update` retenus dans `data/glossary.json`, puis lancez `npm run validate:glossary`, `npm run validate:content` et `npm run build`.

---

## 3. Logique et composants principaux

### 3.1. État & persistance (React Context — `client/src/context/`)

- **`ThemeProvider`** — clair/sombre, persistant (`localStorage`), respecte `prefers-color-scheme`.
- **`UserDataProvider`** — profil, notes, favoris, progression, surlignages, entrées du carnet de décision. La persistance s'effectue exclusivement en **local** via le `localStorage`.
- **`UIProvider`** — palette de commande (⌘K), états d'UI globaux.

### 3.2. Persistance (`client/src/lib/storage.ts`)

Toutes les clés sont préfixées `vcpx:` : `theme`, `profile`, `notes`, `bookmarks`, `progress`, `highlights`, `onboarding-seen`.

### 3.3. Pages clés (`client/src/pages/`)

L'arborescence est rangée par domaine (un sous-dossier par couche). La couche VC Intelligence est **livrée** :

- **Intelligence** (`pages/intelligence/`) : **`IntelligencePage`** (hub `/intelligence`), **`MethodePage`** (`/methode`), **`ConvictionsPage`** (`/convictions`, convictions agrégées), **`DecisionsIndexPage`** (`/decisions`, présentation du carnet de décision), **`MemoLibraryPage`** / **`MemoPage`** (`/memos`, mémos annotés — §4.5quater), **`AntiPortfolioPage`** / **`AntiPortfolioEntryPage`** (`/anti-portfolio` — §4.5quinquies), **`DeliverablesPage`** / **`DeliverablePage`** (`/livrables` — §4.5ter).
- **Écosystèmes** (`pages/ecosystems/`) : **`EcosystemsPage`** (index « Décortiquer un écosystème », `/ecosystemes`) et **`EcosystemPage`** (détail d'un dossier, `/ecosystemes/:slug`) — la couche Atlas / analyse signée (cf. §4.5bis).
- **Outils & cas** : `SimulatorsPage` / `SimulatorPage` (`/simulators`), `CaseStudyPage` (`/cases/:slug` ; l'index `/cases` redirige vers la Bibliothèque), `blog/BlogPage` / `BlogPostPage`.
- **Formation** : **`ParcoursPage`** (catalogue, `/parcours`), **`ParcoursDetailPage`** (fiche intermédiaire, `/parcours/:slug`), `PathsPage` (la **Bibliothèque**, `/bibliotheque`), `PathDetailPage` (détail d'un rayon, `/bibliotheque/:slug`), `CourseDetailPage` (`/courses/:slug`) et `LessonPage` (`/lessons/:slug`, lecture active).
- **Core & Infrastructure** : **`SplashPage`** (route index `/`), `HomePage` (`/home`), `OnboardingPage` (ikigai optionnel, avec `OrientationTest` + `MythCard`), `GlossaryPage`, `SearchPage`, `system/NotFoundPage`, `system/DesignSystemShowcasePage`.
- **Workspace** (`pages/workspace/`) : `DashboardPage`, **`DecisionJournalPage`** (`/journal`, carnet de décision — §4.5sexies), `NotesPage`, plus `onboarding/ProfileResultPage` et `onboarding/ProfilePage`.

> [!IMPORTANT]
> **Rétractation et routage.** La page catalogue **`/parcours`** utilise un rendu interactif en accordéon pour rétracter les familles de parcours (`grid-rows-[0fr]/[1fr]`). Le même principe s'applique aux cours d'un rayon dans `PathDetailPage`.
> Les deux modèles ne partagent plus une route ambiguë : `parcours.json` est servi par `/parcours/:slug`, tandis que les rayons de `paths.json` sont servis par `/bibliotheque/:slug`. La fiche intermédiaire du parcours est conservée entre le catalogue et le cours.

### 3.4. Routage V1 française

La V1 est française et non localisée. `App.tsx` monte directement les routes publiques (`/`, `/home`, `/parcours`, `/bibliotheque`, `/blog/:slug`, etc.) sous `MainLayout`. Le splash reste l'accueil canonique `/` et `/home` la page d'entrée dans les trois piliers.

Conséquences opérationnelles :

- les liens internes utilisent les primitives de `react-router-dom` ou les helpers existants de l'app, sans wrapper de locale ;
- le sitemap et le prérendu émettent les chemins canoniques non préfixés ;
- les marqueurs `[[slug]]` / `{{slug}}` de `markdown.tsx` restent inchangés : les slugs demeurent canoniques.

---

## 4. Guide d'édition — ajouter / modifier du CONTENU

> Tous les types et leurs champs sont définis dans [client/src/content/types.ts](../client/src/content/types.ts). **Gardez ce fichier cohérent si vous ajoutez un champ.**

### 4.0. Conventions d'`id` et de `slug`

- `slug` = identifiant d'URL (kebab-case, sans accent). Doit être **unique** par type.
- `id` = clé interne stable. Conventions observées : **parcours** (`parcours.json`) → `p-*` ; **rayon** de la Bibliothèque (`paths.json`) → court (`discover`) ; cours → `c-*` ; leçons de `lessons.json` → `l-*` / `lpl-*` (Power Law) / `lmv-*` / `lea-*` (entretien analyst) / `lf-*` ; leçons **drop-in** de `data/parcours/*.lessons.json` → `ld-*` (découverte), `llp-*` (lever son fonds LP), `lts-*` (standard français) ; **glossaire → `id == slug`** ; blog → `bp-<slug>` ; études de cas → `cs-*` ; **mémos** → `memo-*` (§4.5quater) ; **anti-portfolio** → `ap-*` (§4.5quinquies) ; **livrables** → l'`id` du milestone résolu (`todo-*`, cf. §4.5ter).
- Les relations se font **par `id`**, pas par slug (voir le graphe ci-dessous).

```
Path.courseIds[] ──► Course.id           Course.lessonIds[] ──► Lesson.id
Course.pathId ──► Path.id                Lesson.courseId ──► Course.id
Lesson.glossaryRefs[] ──► Glossary.slug  Glossary.relatedLessonIds[] ──► Lesson.id
CaseStudy.glossaryRefs[] ──► Glossary.slug   Simulator.relatedLessonIds[] ──► Lesson.id
Deliverable.model{kind,id} ──► CaseStudy.id | EcosystemDossier.id | Memo.id | Lesson.id
Deliverable.relatedLessonIds[] ──► Lesson.id   ParcoursStep.ref(milestone).id ──► Deliverable.id
```

### 4.0.b. Taxonomie et validation

Le repositionnement introduit une taxonomie cible (voir §1bis) : `contentKind`, `audience`, `rigor`, `status`, `evidenceLevel`. Elle n'est **pas encore généralisée** aux schémas des collections historiques.

- **N'ajoutez pas ces champs aux JSON existants** tant que `client/src/content/types.ts` et `scripts/validate-content.mjs` n'ont pas été migrés : les schémas Zod actuels sont stricts et rejetteraient des champs inconnus.
- **Validez toujours** vos JSON locaux avec `npm run validate:content`.
- Le script `scripts/validate-content.mjs` agit comme garde-barrière contre l'injection de données mal formées. Les schémas Zod assurent la cohérence structurelle.

### 4.0.c. Style rédactionnel — charte transverse (non négociable)

Toute prose éditoriale publiée sur le site suit la **même** charte de style, quelle que soit la collection : leçons (`body`, `summary`, `keyTakeaways`, quiz), glossaire (`short`, `definition`, `example`), études de cas et analyses/blog (`sections`, `excerpt`, `body`), dossiers d'écosystème (`these`, sections, `convictions`, signaux, légendes de figures), parcours (`hook`, `goal`, `outcomes`, `prerequisites`), cahier ikigai et fiches de simulateurs (`description`).

> [!IMPORTANT]
> **Source canonique de la charte** : la section « Writing style (non-negotiable) » du skill [`.claude/skills/ecosystemes/SKILL.md`](../.claude/skills/ecosystemes/SKILL.md) et la mémoire `style-redaction-naturel`. Le skill est nommé d'après les écosystèmes, mais ses règles de style **s'appliquent à toute rédaction du site** — c'est lui qui fait foi en cas de doute. Ce qui suit en est le résumé opérationnel.

Le registre visé est celui d'un analyste compétent qui rédige un mémo, pas d'un copywriter qui vend. Concrètement :

- **Prose fluide, longueurs de phrases variées.** Des phrases courtes, puis une plus longue qui prend son temps. Ouvertures *in medias res*, sans mise en bouche.
- **Une idée par paragraphe**, énoncée puis étayée. Chaque phrase apporte une information neuve ; on coupe ce qui ne fait que « sonner intelligent » (« Il est important de noter que… »).
- **Bannir les tics d'IA** : énumérations mécaniques (« Premièrement… Deuxièmement… »), une punchline à la fin de chaque paragraphe, surdensité de deux-points / tirets / appositions, gras multiples par section, méta-discours (« Notre lecture : »).
- **Registre sobre, ne pas survendre** (c'est là que les brouillons échouent le plus). Proscrits : métaphores vendeuses, superlatifs et dramatisation (« spectaculaire », « étonnamment »), aphorismes de clôture, adverbes qui dictent au lecteur ce qu'il doit ressentir.
- **Énoncer le fait, donner le chiffre avec sa source, en tirer la conséquence en mots simples, s'arrêter.** Une affirmation est plus forte à plat qu'habillée. Les titres et légendes **décrivent ce qui est montré**, ils ne performent pas une thèse.
- **Grounding** : aucun chiffre sans source vérifiée ; préférer l'ordre de grandeur honnête (« de l'ordre de », « ≈ ») à la fausse précision.

> [!NOTE]
> La charte vise les contenus VC Intelligence et **toute nouvelle production**. Des contenus historiques gardent par endroits des tournures « école » : on les aligne au fil des relectures, sans imposer de réécriture de masse.

### 4.1. Ajouter une LEÇON (`data/lessons.json`)

La leçon est l'unité de lecture. Le `body`, le `summary`, les `keyTakeaways` et les `quiz` suivent la **charte de style §4.0.c**. Exemple minimal :

```jsonc
{
  "id": "l-power-law",
  "slug": "la-loi-de-puissance",
  "courseId": "c-what-is-vc",      // doit exister dans courses.json
  "order": 3,                       // ordre dans le cours
  "title": "La loi de puissance",
  "kicker": "Fondations",          // sur-titre court
  "readMin": 7,
  "summary": "Pourquoi quelques investissements remboursent tout le fonds.",
  "body": "## Un titre\n\nUn paragraphe avec un terme [[power-law|loi de puissance]] lié au dictionnaire.\n\n- point un\n- point deux",
  "keyTakeaways": ["Idée à retenir 1", "Idée à retenir 2"],
  "glossaryRefs": ["power-law", "tvpi"],   // slugs du glossaire (panneau « termes liés »)
  "quiz": [
    {
      "question": "Qu'implique la loi de puissance ?",
      "options": [
        { "text": "Tous les deals rapportent autant", "correct": false },
        { "text": "Une minorité de deals fait l'essentiel du retour", "correct": true }
      ],
      "explanation": "Quelques succès massifs dominent la performance du fonds."
    }
  ],
  "furtherReading": [
    { "label": "Simuler les retours d'un fonds", "kind": "simulator", "ref": "fund-returns" }
  ]
}
```

Puis **ajoutez l'`id` de la leçon dans `lessonIds[]` du cours** (`data/courses.json`) — c'est ce qui détermine l'ordre et l'appartenance.

> [!NOTE]
> **Pipeline d'authoring des parcours (leçons drop-in).** Les fiches de `data/parcours/*.lessons.json` sont **servies au client** : `scripts/split-lessons.mjs` fusionne `data/lessons.json` **et** `data/parcours/*.lessons.json` dans l'index/bodies générés, que `content/lessons.ts` expose (`LESSONS` + `loadLesson`) ; `lessonById`/`lessonBySlug` et le lecteur les résolvent. *(L'ancien `client/src/content/parcoursLessons.ts` a été supprimé : sa concaténation est reprise par le script de split.)*
>
> **Si vous ajoutez un nouveau registre drop-in :** déposez simplement le fichier `data/parcours/<nom>.lessons.json` — **le client l'auto-charge** (le split fait un glob sur `data/parcours/*.lessons.json`, aucun import manuel à ajouter). Attention aux `slug` en double : `split-lessons.mjs` échoue si deux leçons partagent un slug. Gardez ensuite les `steps` de `data/parcours.json` et les `lessonIds[]` des cours cohérents, puis lancez `npm run validate:content`.

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
> `[[slug|libellé]]` et `{{slug|libellé}}` sont le cœur du « dictionnaire vivant ». Le `slug` doit exister dans `glossary.json` ; sinon le libellé s'affiche en texte simple (pas d'erreur). Dans le **cahier Ikigai**, `[[..]]` n'est révélé qu'en mode *Avancé* tandis que `{{..}}` reste actif dans les deux modes (voir §7.b). Vérifiez l'intégrité de tous les marqueurs avec `npm run validate:content`.

#### Détection automatique des termes (prose des leçons)

Le balisage manuel ne suffit pas à garantir la règle produit : **dans les cours, tout terme technique ou sigle doit avoir un popover + redirection vers le dictionnaire.** `markdown.tsx` applique donc une **détection automatique** quand `glossaryPreview` est actif (prose de leçon via `ActiveProse sourceType="lesson"`, et définitions de `GlossaryPage`).

- Un matcher est construit une fois à partir de **tous les termes + alias** du glossaire (374 termes, plus d'un millier de clés une fois les alias dépliés). La **première occurrence** de chaque terme dans la page devient un popover ; les occurrences suivantes restent en texte simple.
- Les **marqueurs manuels** `[[..]]` / `{{..}}` restent prioritaires : leurs slugs sont pré-amorcés, donc la détection auto ne re-lie jamais un terme déjà balisé.
- Les **sigles** (VC, MOIC, B2B, DPI…) sont reconnus **en respectant la casse** : `VC`/`VCs` sont liés, `vc` en minuscule ou `VC` à l'intérieur d'un mot (`MVC`) ne le sont pas. Les phrases longues priment sur leurs sous-mots (« fonds VC » → `venture-capital-fund`).
- **Contenu du popover** : terme + champ `short` uniquement. Le **panneau entier** est cliquable et redirige vers `/glossary?term=slug` (lien réel : accessible clavier, clic-milieu/nouvel onglet préservés).
- **Portée** : leçons (toutes via `LessonPage`) + définitions du dictionnaire. Les **études de cas / blog** restent en balisage manuel uniquement (`glossaryPreview` désactivé).

### 4.2. Ajouter un TERME au dictionnaire (`data/sources/canonical-glossary.json` puis `data/glossary.json`)

Commencez toujours par le registre canonique :

```jsonc
{
  "canonicalTerm": "MOIC",
  "slug": "moic",
  "aliases": ["Multiple on Invested Capital"],
  "status": "applied",
  "action": "add",
  "modules": ["Ressources externes"],
  "sourcePaths": ["ressources/exemple.md"],
  "sourceStatus": "source-backed",
  "category": "Fund Economics",
  "short": "Multiple brut sur capital investi.",
  "definition": "Le MOIC rapporte la valeur totale…",
  "example": "Un fonds qui rend 3× le capital appelé affiche un MOIC de 3.0x.",
  "seeAlso": ["tvpi", "dpi"],
  "relatedLessonIds": ["l-fund-metrics"],
  "notes": "Décision éditoriale et provenance."
}
```

Décision éditoriale :

- **`add`** : créer une nouvelle fiche finale parce que le concept est autonome.
- **`update`** : enrichir une fiche existante.
- **`merge`** : ne pas créer de fiche ; ajouter les variantes utiles dans `aliases` de la fiche canonique.
- **`skip`** : conserver la trace dans le registre, sans injection finale.

Ensuite seulement, ajoutez ou mettez à jour l'entrée finale dans `data/glossary.json` :

```jsonc
{
  "id": "moic",                 // par convention, id == slug
  "term": "MOIC",
  "slug": "moic",
  "latin": "Multiple on Invested Capital",  // optionnel (affiché en italique)
  "category": "Performance",
  "short": "Multiple brut sur capital investi.",   // 1 phrase (infobulles)
  "definition": "Le MOIC rapporte la valeur totale… (texte complet)",
  "example": "Un fonds qui rend 3× le capital appelé affiche un MOIC de 3.0x.",  // optionnel
  "link": "https://exemple.com",         // optionnel — lien externe (fonds, outils, institutions)
  "seeAlso": ["tvpi", "dpi"],            // autres slugs du glossaire
  "relatedLessonIds": ["l-fund-economics"]
}
```

> [!NOTE]
> Catégories ajoutées pour le cahier Ikigai : **Fonds & VC** (Eurazeo, Partech, Alven, Serena, Daphni, Cathay Innovation, Accel, Sequoia, a16z), **Institutions** (Bpifrance, EIF), **Outils** (Affinity, Harmonic.ai, Decile Hub, PitchBook, Microsoft Presidio). Renseignez `link` pour ces entrées : il s'affiche dans la fiche du dictionnaire **et** dans les popovers `{{..}}` du cahier.

> [!IMPORTANT]
> Après chaque lot glossaire, lancez `npm run validate:glossary`. Ce contrôle custom vérifie : slugs uniques, `id === slug`, `seeAlso` résolus, `relatedLessonIds` résolus, marqueurs `[[slug|label]]` résolus dans les champs du glossaire, et absence de collisions d'aliases.

#### Comportement de la page `/glossary`

Le dictionnaire est rendu par [GlossaryPage.tsx](../client/src/pages/glossary/GlossaryPage.tsx). Les contrôles (alphabet, domaines, recherche) sont regroupés dans un bandeau **sticky** compact :

- `activeLetter` suit la section alphabétique explorée au scroll et se met aussi à jour au clic ;
- `ResizeObserver` mesure le bandeau sticky pour alimenter `--glossary-anchor-offset` ; les ancres `letter-*` et `term-*` utilisent ce scroll-margin afin de ne jamais passer sous les filtres ;
- sur mobile, alphabet et domaines sont horizontalement scrollables ;
- tous les `scrollIntoView` respectent `prefers-reduced-motion`.

### 4.3. Ajouter un RAYON à la Bibliothèque (`data/paths.json`)

> Note de nommage : les entrées de `paths.json` étaient appelées « parcours » ; depuis l'arrivée de la couche Parcours (§4.3bis), ce sont les **rayons** de la **Bibliothèque** (`/bibliotheque`). Un rayon regroupe des cours. **L'`accent` (couleur) et le `kanji` alimentent les sceaux de cire et l'en-tête du rayon.** (La carte interactive / Atlas représente désormais les **parcours** — voir §4.3bis et le Design System.)

```jsonc
{
  "id": "secondaries", "slug": "marche-secondaire", "order": 10,
  "title": "Le marché secondaire", "subtitle": "Liquidité avant l'heure",
  "level": "avance",                 // "debutant" | "intermediaire" | "avance" | "tous"
  "accent": "#3E7C6A",               // couleur hex unique → seau + bordure + texture
  "kanji": "流",                      // glyphe affiché dans le seau
  "durationHours": 4,
  "summary": "…",
  "forWhom": ["Associates", "Principals"],
  "outcomes": ["Objectif 1", "Objectif 2"],
  "courseIds": ["c-secondaries-intro"]   // ids de cours (courses.json)
}
```

> [!IMPORTANT]
> Depuis la couche Parcours, **l'Atlas (`PathAtlas.tsx`) ne représente plus les rayons mais les *parcours*** (placés par `level` sur les trois arcs `debutant` → `Terra Prima`, `intermediaire` → `Mare Analytica`, `avance` → `Haute Citadelle` ; les parcours `tous` deviennent des **îles**). Un rayon n'influe donc plus sur la carte. Voir §4.3bis.

### 4.3bis. Ajouter un PARCOURS (`data/parcours.json`)

La couche **Parcours** est une **trajectoire par objectif** posée *au-dessus* de la bibliothèque : elle ne stocke pas de contenu, elle **référence des atomes par `id`** (zéro duplication, navigation libre native). Type : [`client/src/content/parcoursTypes.ts`](../client/src/content/parcoursTypes.ts) ; loader : [`client/src/content/parcours.ts`](../client/src/content/parcours.ts). Conception complète : dossier [`docs/parcours/`](parcours/).

```jsonc
{
  "id": "p-decoder-ts", "slug": "decoder-une-term-sheet",
  "family": "maitriser",          // decouvrir|entretien|levee|grade|maitriser|express
  "roadmap": "next",              // now|next|later (poids de tri dans l'étagère)
  "title": "Décoder une term sheet",
  "hook": "La promesse en une phrase, affichée avant tout sommaire.",
  "kanji": "契", "accent": "#B0843B",
  "goal": "Ce que tu sauras faire au bout.",
  "forWhom": ["Analysts", "Associates"],
  "prerequisites": ["Avoir lu le cours [[c-intro|Intro au VC]]"], // Pré-requis interactifs (Markdown supporté)
  "perspective": "investor",      // founder|investor|both (défaut investor)
  "level": "intermediaire", "entryLevel": "intermediaire",
  "time": { "coreHours": 1, "withBonusHours": 1.5, "sessions": 4 },
  "timeFit": ["low", "medium", "high"],
  "recommendedForProfiles": ["associate-progression"],   // ids de profils ikigai
  "milestone": { "type": "quiz", "label": "…", "description": "…", "evaluation": ["auto"] },
  "steps": [
    { "order": 1, "type": "coeur", "ref": { "kind": "lesson", "id": "l-ts-economics" },
      "label": "…", "status": "existant", "keystone": true },
    { "order": 2, "type": "pratique", "ref": { "kind": "simulator", "id": "waterfall" },
      "label": "…", "status": "existant" }
    // type: coeur|bonus|pratique|respiration  ·  ref.kind: lesson|course|case|simulator|glossary|milestone
    // status: "existant" (atome présent) | "a-produire" (placeholder → affiché « bientôt »)
  ],
  "outcomes": ["Objectif 1", "Objectif 2"]
}
```

> [!IMPORTANT]
> - **Le curseur temps** est implémenté par `timeFit` + le `type` des étapes : `visibleSteps(p, budget)` montre `low → coeur`, `medium → coeur+pratique`, `high → tout`. Taguez donc les étapes correctement.
> - **Résolution des `ref`** (`resolveStep` dans `content/parcours.ts`) : `milestone` → **livrable d'abord** (`deliverableById` → `/livrables/:slug`, cf. §4.5ter), **sinon** `lessonById` → `/lessons/:slug` ; `lesson` → `/lessons/:slug` ; `case` → `/cases/:slug` ; `simulator` → `/simulators/:slug` ; `glossary` → `/glossary?term=`. Un `ref` non résolu (id `todo-*`) s'affiche en **« bientôt »**, sans lien — c'est le rôle de `status: "a-produire"`.
> - **Aiguillage ikigai** : pour qu'un profil recommande ce parcours, ajoutez-le dans [`data/profileParcours.json`](../data/profileParcours.json). Les politiques transverses (progression souple, évaluation, langue V1 FR) sont dans [`docs/parcours/README.md`](parcours/README.md).
> - **Langue** : les champs texte de parcours sont des chaînes françaises simples ; aucune surcharge EN n'est servie.

### 4.4. Ajouter un COURS (`data/courses.json`)

```jsonc
{
  "id": "c-secondaries-intro", "slug": "intro-secondaire",
  "pathId": "secondaries",           // doit exister dans paths.json
  "order": 1, "title": "Comprendre le secondaire", "subtitle": "…",
  "level": "avance", "durationMin": 40, "summary": "…",
  "tags": ["liquidité", "LP"], "lessonIds": ["l-secondaries-1", "l-secondaries-2"]
}
```

### 4.5. Étude de cas (`data/caseStudies.json`) & Analyse/blog (`data/blog/*.json`)

> Prose soumise à la **charte de style §4.0.c** (registre sobre, pas de punchlines ni de survente).

- **Étude de cas** : `kind` ∈ `startup|fund|deal|market`, `sections[]` (`heading` + `body` markdown), `takeaways[]`, `glossaryRefs[]`.
- **Analyse (blog)** : `category`, `author`, `date` (`YYYY-MM-DD`), `excerpt`, `body` (même markdown), `tags[]`. Le `body` accepte les liens `[[slug]]`. Deux champs **optionnels** servent le format « Lecture oblique » (cf. §10.9 de `STRATEGIE-vc-intelligence.md`) : `books[]` (`title`/`author`/`year?`) affiché sur la carte et l'en-tête, et `glossaryRefs[]` qui rend le bloc « Pour aller plus loin » en fin d'article. La catégorie `"Lecture oblique"` est filtrable sur `/blog`.

### 4.5bis. Dossier d'écosystème (`data/ecosystems.json`) — « Décortiquer un écosystème »

Espace d'**analyse signée** (`/ecosystemes`), **100 % client** : tout vit dans `data/ecosystems.json` (type `EcosystemDossier` dans `client/src/content/types.ts`), même pattern que les memos / l'anti-portfolio.

- **Arbre** via `parentId` + `order` (profondeur illimitée). Un **dossier-racine** (sans `parentId`) est le **seul listé sur l'index** et **doit** porter une `these` ; un **sous-dossier** peut omettre `these`/`convictions`/`signals`/`players`/`sources` (tous optionnels). Tri des frères : `order` croissant, puis révision la plus récente d'abord.
- **Format éditorial** : thèse falsifiable + `convictions[]` **datées, à degré d'assurance explicite** (`strength` ∈ `exploratoire|moyenne|forte`, jamais implicite) + `signals[]` directionnels (`haussier|baissier|incertain`). `kind` ∈ `geographie|secteur|these`. Dates ISO `YYYY-MM-DD`. Loader : `rootEcosystems()`, `childEcosystems(id)`, `ecosystemAncestors(d)` dans `client/src/content/ecosystems.ts`. La page de détail affiche : fil d'Ariane → thèse → sections (+ figures) → convictions → signaux → acteurs → « Approfondir » (enfants) → sources.
- **Figures** (`section.figures[]`) : le renderer markdown maison ne gère ni image, ni HTML brut, ni tableau → les visuels sont des **figures structurées**, rendues en **SVG/HTML natif theme-aware** par `client/src/components/ecosystems/EcosystemFigures.tsx`, **sans aucun asset ni librairie de charting**. 5 types (union discriminée par `kind`) : `bars`, `line`, `matrix`, `quadrant`, `taxonomy`. **Un nouveau type de figure = 3 éditions synchronisées** : l'union dans `types.ts`, le `z.discriminatedUnion` dans `scripts/validate-content.mjs`, le renderer dans `EcosystemFigures.tsx`.
- ⚠️ **Pièges** : (1) **jamais de marqueur `[[slug]]`/`{{slug}}` dans le texte d'une figure** — le validateur scanne tout le JSON et exigerait leur résolution → échec ; (2) `data/ecosystems.json` est un **round-trip exact** de `JSON.stringify(…, null, 2) + '\n'` → muter via un **petit script Node** jetable plutôt qu'à la main.
- **Validation** : `npm run validate:content` applique un Zod strict (parent existant, **absence de cycle**, racine ⇒ `these`, `glossaryRefs` + marqueurs `[[..]]` résolus). Si le glossaire change : `npm run split:content`.
- **Méthodo complète** : skill projet **`.claude/skills/ecosystemes/SKILL.md`** — à lire avant tout travail sur un dossier. C'est aussi la **source canonique de la charte de style §4.0.c**.

### 4.5ter. Livrable de parcours (`data/deliverables.json`)

> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client**, même pattern que les dossiers d'écosystème.

Un **livrable** réalise les étapes `milestone` où l'apprenant *produit* un artefact (autrefois des culs-de-sac `a-produire` affichés « bientôt »). C'est la page `/livrables/:slug` : un **brief** (la consigne) + un **gabarit** (`template[]`) + une **grille d'auto-évaluation** (`rubric[]`) + un renvoi au **modèle** (`model`) — un artefact de la couche Intelligence déjà existant.

- **Type** `Deliverable` dans `client/src/content/types.ts` ; loader `client/src/content/deliverables.ts` ; page `client/src/pages/intelligence/DeliverablePage.tsx` ; route `livrables/:slug`. Le `model.kind` ∈ `ecosystem|case|memo|lesson` est résolu vers `/ecosystemes`, `/cases`, `/memos` ou `/lessons`.
- **Câblage** : `id` du livrable = l'`id` du `milestone` référencé par le step ; passer ce step de `status: "a-produire"` → `"existant"` (le `ref.kind` reste `milestone`, résolu par `resolveStep`, cf. §4.3bis). À penser : barrel `content/index.ts`, recherche `content/search.ts`, libellé dans `content/labels.ts`, `shared/routes.mjs` (OG `livrables: 'path'`) et collecte des routes dans `scripts/collect-routes.mjs`.
- **Validation** : `scripts/validate-content.mjs` applique un Zod strict + résout `model`, `relatedLessonIds`, `glossaryRefs` et les marqueurs `[[..]]`.

### 4.5quater. Mémo d'investissement annoté (`data/memos.json`)

> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client**.

Un **mémo annoté** reprend un mémo d'investissement **réellement publié** et l'expose section par section, chaque passage commenté par ce que l'investisseur y fait, sur le plan de la décision. C'est la bibliothèque `/memos` (`MemoLibraryPage`) et la lecture `/memos/:slug` (`MemoPage`).

- **Type** `InvestmentMemo` dans [`client/src/content/types.ts`](../client/src/content/types.ts) ; loader [`client/src/content/memos.ts`](../client/src/content/memos.ts). `id` → `memo-*`.
- **Format** : en-tête factuel (`company`, `fund`, `author`, `date`, `stage`, `amount?`, `outcome`, `whyItMatters`) + **provenance obligatoire** (`sourceUrl`, `sourceNote`) + `context` (markdown). Le corps est `sections[]`, chaque section = `heading` + `blocks[]` ; un bloc = `excerpt` (extrait **court**, `isParaphrase: true` quand condensé) + `note` (markdown) + `tag` ∈ `these|marche|traction|equipe|risque|deal|concurrence|verdict`. Puis `lessons[]`, `glossaryRefs[]`, `relatedAntiPortfolioIds?`, `tags[]`.
- ⚠️ **Légal / éthique** : ne reprendre que des mémos dont la diffusion publique est documentée (`sourceNote`) ; garder les `excerpt` brefs, renvoyer à l'original.
- **Câblage d'une nouvelle collection** : barrel [`content/index.ts`](../client/src/content/index.ts), recherche [`content/search.ts`](../client/src/content/search.ts), SEO/sitemap [`shared/routes.mjs`](../shared/routes.mjs) et l'énumération des pages de détail dans [`scripts/collect-routes.mjs`](../scripts/collect-routes.mjs).
- **Validation** : `scripts/validate-content.mjs` applique un schéma Zod strict, vérifie les identifiants et slugs uniques, résout les références croisées et inclut `memos.json` dans le scan des marqueurs `[[..]]` / `{{..}}`.

### 4.5quinquies. Anti-portfolio (`data/antiPortfolio.json`)

> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client**.

L'**anti-portfolio** documente des **refus d'investissement** devenus coûteux, sans biais rétrospectif : on reconstitue l'information publique disponible au moment de la décision, on défend honnêtement le refus, puis on nomme le signal manqué. Index `/anti-portfolio` (`AntiPortfolioPage`), détail `/anti-portfolio/:slug` (`AntiPortfolioEntryPage`).

- **Schéma** : le fichier est un **objet-enveloppe** `{ "patterns": AntiPortfolioPattern[], "entries": AntiPortfolioEntry[] }`, exposé par [`content/antiPortfolio.ts`](../client/src/content/antiPortfolio.ts). `id` d'entrée → `ap-*`.
- **`patterns[]`** : les **motifs** récurrents de refus (5 : `categorie-deja-jouee`, `marche-trop-petit`, `produit-jouet`, `trop-cher`, `risque-structurel`). Une entrée s'y rattache par `patternIds[]`.
- **`entries[]`** : `company`/`title`/`subtitle`, `passes[]`, `sector`, `summary`, `quote?`, **`knownAtTheTime[]`** (info **publique et datée** disponible à l'époque), `statedReason` + `reasonIsPublic`, `missedSignal` (markdown), **`steelman`** (markdown : le meilleur argument *en faveur* du refus, ex ante — exigé, garde anti-biais), `outcome`, `costEstimate?` (toujours une estimation), `takeaways[]`, `glossaryRefs[]`, `relatedMemoIds?`, `sources[]`.
- **Câblage** identique à §4.5quater.
- **Validation** : `scripts/validate-content.mjs` valide l'objet-enveloppe et ses deux collections, les identifiants et slugs uniques, les références vers motifs et mémos, les références glossaire et les marqueurs `[[..]]` / `{{..}}`.

### 4.5sexies. Convictions (vue dérivée) & Carnet de décision

Deux surfaces de la couche Intelligence qui **ne s'éditent pas comme une collection** :

- **Convictions** (`/convictions`, `ConvictionsPage`) : **aucun fichier de données propre**. [`content/convictions.ts`](../client/src/content/convictions.ts) (`allConvictions()`) **agrège** les `convictions[]` de tous les dossiers d'écosystème (statement, `horizon`, `strength` ∈ `exploratoire|moyenne|forte`, `rationale`, + provenance). Pour ajouter ou corriger une conviction, on édite le `convictions[]` du dossier concerné dans `data/ecosystems.json` (§4.5bis) — la page se recompose, triée et filtrable.
- **Carnet de décision** (`/decisions` = présentation `DecisionsIndexPage` ; `/journal` = l'outil `DecisionJournalPage`) : ce n'est **pas du contenu éditorial**, c'est une **donnée utilisateur**, comme les notes, persistée en **`localStorage`**. Type client `DecisionJournalEntry`, calibration dans [`client/src/lib/decisionJournal.ts`](../client/src/lib/decisionJournal.ts) (testée, `decisionJournal.test.ts`). Une prédiction = énoncé falsifiable + `confidence` (50–99 %) + `reviewAt` ; résolue `correct|incorrect|void` (les `void` sont exclus du calcul de calibration). `/journal` est dans `NOINDEX_SEGMENTS`. Un éditeur ne l'alimente pas : l'utilisateur la produit.

### 4.6. Simulateur (`data/simulators.json`)

Le JSON ne décrit que la **fiche** (titre, `category`, `accent`, `description`, `relatedLessonIds`). **La logique de calcul est du code**, enregistrée par slug dans [client/src/components/simulators/index.ts](../client/src/components/simulators/index.ts). Ajouter un *nouveau* simulateur = ajouter la fiche JSON **et** brancher son composant dans ce registre.

### 4.7. Édition (sans CMS)

Le projet n'utilise **pas de CMS**. L'intégralité du contenu s'édite en modifiant les fichiers JSON de `/data`. Toute validation se fait via les scripts client (`npm run validate:content`, `npm run validate:glossary`).

### 4.8. ✅ Checklist « j'ai ajouté du contenu en JSON »

1. JSON valide ? (virgules, guillemets).
2. `id` et `slug` **uniques** ; relations (`courseId`, `pathId`, `lessonIds`, `glossaryRefs`) pointant vers des entrées **existantes**.
3. Champs cohérents avec `types.ts`.
4. Lancer `npm run validate:content` pour vérifier l'intégrité des liens croisés et du glossaire.
5. Vérifier la page (`/ecosystemes/<slug>`, `/memos/<slug>`…) dans l'app ; le HMR Vite rafraîchit la page instantanément.

---

## 5. Guide d'édition — GRAPHISME, design & UI

> Le système visuel complet — tokens de couleur, typographie, layout, composants, ornements atlas, motion, accessibilité — est documenté dans [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md). Ne pas le redupliquer ici. Cette section ne garde que les points d'entrée d'édition et les pièges non évidents.

**Où éditer.** L'ambiance globale passe par les variables CSS de [`client/src/styles/tokens.css`](../client/src/styles/tokens.css) (`:root` clair, `.dark` sombre : `--primary` = or `#C5A85C`, `--secondary` marine, `--tertiary` prune, surfaces parchemin, `--radius`). L'échelle typographique, les ombres `editorial-*` et les couleurs nommées Tailwind sont dans [`client/tailwind.config.ts`](../client/tailwind.config.ts). Le langage cartographique (`CompassRose`, `WaxSeal`, `MapCartouche`, `NightSkyBackdrop`, `DropCap`…) est centralisé dans [`client/src/components/ornaments/`](../client/src/components/ornaments/) ; les textures CSS (`.map-paper`, `.contour-field`, `.ink-underline`…) dans [`global.css`](../client/src/styles/global.css). La carte interactive se règle dans [`client/src/components/explore/PathAtlas.tsx`](../client/src/components/explore/PathAtlas.tsx) (elle est **générée depuis `PARCOURS`**, pas dessinée à la main).

> [!WARNING]
> **Piège Tailwind v3 + couleurs en variable CSS.** Les modificateurs d'opacité **ne fonctionnent pas** sur une couleur-variable : `bg-[color:var(--primary)]/10` ne produit **aucun** style, et `@apply …/90` casse le build. Utilisez partout `color-mix(in srgb, var(--primary) 10%, transparent)`.

> [!CAUTION]
> Un `<svg>` imbriqué dans un autre SVG **doit fixer `height`** (et `width`), sinon il occupe 100 % du parent et se recentre. C'est le bug qui plaçait `MapCartouche` au milieu de la carte.

> [!TIP]
> Un composant qui pose un `-z-*` (ex. `NightSkyBackdrop`) dans un conteneur à fond semi-opaque exige `isolate` sur le conteneur hôte, sinon le fond masque la couche en dessous.

---

## 6. Workflow développeur (commandes & environnement)

```bash
npm install            # installe le workspace client
npm run dev            # serveur Vite local (HMR) : http://localhost:5173 (predev → split:content)

npm run split:content  # régénère les index/contenus scindés (glossaire + leçons)
npm run build          # prebuild (split → validate → sitemap) · build client (vite) · postbuild = prerender (scripts/prerender.mjs)
npm run typecheck      # TypeScript client
npm run lint           # eslint client, sans avertissement toléré
npm run test           # Vitest client
npm run check          # validation stricte + glossaire + TypeScript + lint + tests
npm run validate:glossary        # contrôle custom du glossaire final
npm run validate:content         # shape + références croisées + marqueurs [[..]]/{{..}}
npm run validate:content:strict  # idem mais warnings fatals
```

> [!IMPORTANT]
> **Phase local-first.** GitHub sert actuellement de sauvegarde du code. Un push ne publie rien : `.github/workflows/deploy-pages.yml` est limité à un déclenchement manuel (`workflow_dispatch`) et ne doit pas être exécuté avant le lot de remise en ligne. Les garde-fous se jouent localement avec `npm run check`, puis `npm run build` — voir `Suivis/PROCEDURE_PUSH.md`.

> [!IMPORTANT]
> Après une édition de code, de design ou de données, Vite recharge à chaud (HMR) l'application si `npm run dev` tourne. L'architecture étant 100 % statique, un seul terminal suffit.

---

## 7. Choix d'UX notables (et pourquoi)

- **Liberté responsable** : aucun mur d'authentification, aucun chapitre verrouillé. Toutes les sauvegardes s'effectuent localement dans le `localStorage`.
- **Introspection d'abord** : l'onboarding ikigai précède le catalogue (*pourquoi* avant *quoi*) et oriente vers un profil d'apprentissage.
- **Cartographier au lieu de lister** (Atlas) : un sommaire vertical devient une carte marine explorable — on choisit son port, l'ordre conseillé n'est qu'une route pointillée.
- **Lecture active** : sélection de texte dans une leçon/étude/article → **surligner** ou **citer** dans le carnet (persisté localement).
- **Dictionnaire vivant** : dans les leçons, **tout terme/sigle est détecté automatiquement** (popover cliquable → dictionnaire) en plus des marqueurs manuels `[[slug|libellé]]` ; page `/glossary` indexée. Détails en §4.1.
- **Simulateurs réels** : dilution, pre/post-money, ownership, waterfall, management fees, fund returns et Power Law/Monte Carlo — calcul temps réel côté client, avec bloc pédagogique explicatif, historique de calcul et dictionnaire interactif.

---

## 8. Le cahier Ikigai (`/onboarding`)

L'onboarding est un **cahier d'introspection** éditorial : masthead, sections numérotées (§01 rappel → §06 test d'orientation), diagramme à 13 zones, archétypes, questions libres, conclusion. Il **conserve** le scoring existant (le test MCQ → profil d'apprentissage) et le fonctionnement invité.

**Données** — tout vit dans [data/ikigai.json](../data/ikigai.json) (bundlé côté client) :

- `dimensions` / `intersections` / `presqueIkigai` : chaque entrée a une variante **Découverte** (`itemsDecouverte`, `exampleDecouverte`, `descriptionDecouverte`, `trapDecouverte`) en langage clair, et une variante **Avancé** (`items`, `example`, `description`, `trap`) avec marqueurs glossaire.
- `archetypes` : les 3 archétypes incarnés (Architecte de Thèse, Bâtisseur d'Infrastructure, Opérateur-Investisseur). Chacun porte positionnement / semaine type / valeur / signaux / métriques en deux modes, plus `profileIds` et `recommendedPathIds`.
- `reflection` : `{ decouverte: [7], avance: [7] }` questions libres (sans scoring).
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

## 9. Gestion des risques et feuille de route

La direction produit et les priorités stratégiques durables sont documentées dans [`docs/STRATEGIE-vc-intelligence.md`](STRATEGIE-vc-intelligence.md). L'état courant, les risques et les priorités opérationnelles vivent dans [`Suivis/ETAT.md`](../Suivis/ETAT.md).

> [!WARNING]
> **Garde-fous d'édition à tenir :**
> - **Périmètre local** : avant toute modification structurante, vérifier les sources et exécuter les validations adaptées au sous-système touché.
> - **Validation** : ne jamais ajouter une collection sans schéma Zod, contrôles de références et scan de marqueurs dans `validate-content.mjs`. `memos.json` et `antiPortfolio.json` suivent désormais ce standard.
> - **Fausse intelligence** : ne pas publier de tableaux de bord vides ou de chiffres non sourcés. Si l'information n'est pas « decision-grade », on ne publie pas.
> - **Découvrabilité** : toute nouvelle collection doit refaire le câblage recherche + SEO + sitemap (`content/search.ts`, `shared/routes.mjs`, `scripts/collect-routes.mjs`), sans briser les routes canoniques (`/parcours/:slug`, `/bibliotheque/:slug`) ni le redirect `/cases` → Bibliothèque.
> - **Langue** : garder une V1 FR cohérente ; ne pas réintroduire de routes localisées sans décision produit explicite.

---

> [!TIP]
> Pour bien démarrer une contribution : (1) lisez `types.ts` pour le type que vous touchez, (2) éditez le JSON source concerné (`data/blog/<slug>.json` pour une analyse), (3) vérifiez dans l'application avec le rechargement à chaud. Pour le design, partez toujours de `tokens.css` et des composants `ornaments/` plutôt que de coder des couleurs en dur.
