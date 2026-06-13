# Manuel d'Architecture et d'Édition — VC Intelligence Platform

Dernière mise à jour : 2026-06-12

Ce document décrit l'architecture **full-stack** du projet, la **vision produit et le positionnement stratégique**, le cycle de vie du contenu (de la source canonique JSON jusqu'à l'écran), et un **guide d'édition pas-à-pas** pour un développeur qui veut ajouter du contenu, modifier le design, ou faire évoluer le code.

> [!TIP]
> Si vous ne deviez retenir qu'une chose : **le contenu canonique vit dans `/data/*.json` à la racine du dépôt.** Le client le *bundle* (mode invité / hors-ligne) et le serveur l'utilise pour *seeder* la base. Pour 95 % des ajouts de contenu, vous éditez un JSON puis vous lancez `npm run db:seed`.

> [!IMPORTANT]
> **Positionnement stratégique (juin 2026).** Le projet est en cours de repositionnement : d'une plateforme de formation VC, il évolue vers une **VC Intelligence Platform** dont la couche formation ne représente que 10–20 % du produit final. La couche **VC Intelligence** (80–90 %) — research notes, thesis lab, atlas de marchés, cas décisionnels, tools, frameworks, workspace — est le cœur du produit. La formation reste un socle d'entrée précieux (aspirants, juniors, CVC, reconversions) mais ne doit plus dominer l'identité produit. Voir §1bis pour le détail.

---

## 1. Architecture globale et technologies

Le projet n'est pas une simple SPA : c'est un **monorepo npm workspaces** à deux paquets (`client`, `server`) partageant une source de contenu commune (`data/`). Il est conçu pour évoluer d'une plateforme éducative premium vers une **plateforme d'intelligence VC** (voir §1bis).

| Couche | Technologies |
| --- | --- |
| **Front-end** (`client/`) | React 19 · Vite 6 · TypeScript · Tailwind CSS v3 · React Router 7 · lucide-react |
| **Back-end** (`server/`) | Node 20+ · Express 4 · TypeScript · Prisma 5 · JWT (cookie httpOnly) · zod |
| **Base de données** | SQLite (prototype) — bascule vers Postgres en changeant le `datasource` Prisma |
| **Contenu** (`data/`) | JSON brut, **source de vérité partagée** client ↔ serveur |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

```
vc-premium-platform/
├── data/                      # ← SOURCE DE VÉRITÉ du contenu (JSON)
│   ├── paths.json (9 rayons)  courses.json (16)  lessons.json (51 leçons canoniques)
│   ├── lessons.index.json  lessons.bodies.json   # leçons scindées (index léger / corps lazy) — GÉNÉRÉ, ne pas éditer
│   ├── glossary.json (357)  glossary.index.json  glossary.defs.json   # glossaire scindé — GÉNÉRÉ
│   ├── caseStudies.json (4)  blog.json (8)
│   ├── simulators.json (8)  ikigai.json
│   ├── parcours.json (22)  parcours.en.json  parcoursConfig.json  profileParcours.json
│   └── parcours/              # 3 registres drop-in, 11 leçons additionnelles (*.lessons.json, ld-*/lea-*)
│   # ── À VENIR (piliers VC Intelligence) ──────────────────
│   # theses.json · atlas.json · frameworks.json · research.json (ou blog.json refondu)
├── docs/
│   ├── parcours/              # conception + rédaction des parcours (Markdown)
│   ├── AUDIT-vc-intelligence.md          # audit & plan de repositionnement (2026-06-10)
│   └── Stratégie doc et ROADMAP         # vision cible, benchmark, roadmap 10 phases
├── Suivis/                    # documents de suivi projet (Bilan, Report, Design System, ce Manuel)
├── glossary-ingestion/
│   └── canonical-glossary.json (433)  # registre durable de préparation du glossaire
│
├── client/                    # SPA React + Vite
│   └── src/
│       ├── i18n/              # routing localisé /fr /en (config · routing · guards · useLocale · LocaleSwitcher)
│       ├── content/           # types.ts + modules par collection @data + recherche locale
│       ├── context/           # Theme · Auth · UserData · UI (React Context)
│       ├── hooks/             # useApiData (API-first, repli sur le bundle)
│       ├── lib/               # api · storage · markdown · ikigai · seo · utils (safeHttpUrl)
│       ├── components/        # ui · chrome · ornaments · explore · cards · reading · ikigai · simulators · ErrorBoundary
│       ├── pages/             # pages applicatives lazy-loadées + admin/
│       └── styles/            # tokens.css (design tokens, dont --error/--success) + global.css
│
└── server/                    # API Express + Prisma
    ├── prisma/schema.prisma   # 15 modèles
    ├── prisma/seed.ts         # peuple la base depuis /data (non destructif sauf --force)
    ├── test/                  # tests d'intégration (auth · profile · isolation)
    └── src/
        ├── routes/            # auth · content · me · admin · search
        └── lib/               # db · auth (JWT) · env · content (lecture de /data) · async-handler

.github/workflows/ci.yml       # CI (validate:content → lint → build → tests client → tests serveur ; push main/master + PR)
client/vitest.config.ts        # harnais client (10 fichiers, 59 tests) ; serveur : server/test (3 fichiers, 10 tests)
i18n_architecture_FR-EN.md     # ADR + plan de migration bilingue (FR/EN)
docs/Stratégie doc et ROADMAP  # vision cible, benchmark, roadmap complète (doc directeur)
docs/AUDIT-vc-intelligence.md  # diagnostic + 10 premières tâches d'exécution
```

> [!NOTE]
> Le client lit `data/` via l'alias Vite **`@data`** (ex. `import pathsJson from '@data/paths.json'` dans `client/src/content/paths.ts`). Chaque collection a son module (`paths.ts`, `courses.ts`, `lessons.ts`, etc.) afin que Rollup découpe le contenu par chunks. Le serveur lit les mêmes fichiers via `server/src/lib/content.ts` (chemin relatif `../../../data`). **Un seul fichier édité alimente les deux côtés.**
>
> **Collections scindées (glossaire & leçons).** Pour alléger le hot path, `glossary.json` et `lessons.json` (+ `data/parcours/*.lessons.json`) sont **dérivés** par `scripts/split-glossary.mjs` et `scripts/split-lessons.mjs` (câblés dans `predev`/`prebuild` via `npm run split:content`) en deux fichiers chacun : un **index léger** (`*.index.json`, importé en eager pour popovers / recherche / liens) et un **chunk lourd lazy** (`glossary.defs.json` / `lessons.bodies.json`, corps + quiz, chargé à la demande par `loadGlossaryTerm` / `loadLesson`). **Ne jamais éditer les fichiers générés** : on édite la source (`glossary.json`, `lessons.json`, `data/parcours/*.lessons.json`), le split se relance au prochain `dev`/`build`.

---

## 1bis. Vision stratégique et architecture cible (Repositionnement)

La plateforme est en cours de transformation pour devenir une **VC Intelligence Platform**. Le modèle d'apprentissage (Learning & Development) n'est qu'une porte d'entrée ; la valeur principale réside dans les outils professionnels.

### Architecture cible en 8 piliers
1. **Intelligence / Research** (`/research`) : notes sectorielles, analyses de marché, flux de capitaux.
2. **Thesis Lab** (`/theses`) : thèses d'investissement structurées, critères de falsification, risques.
3. **Atlas** (`/atlas`) : cartographie des écosystèmes et géographies (différent de la carte des parcours d'apprentissage).
4. **Cases** (`/cases`) : cas d'investissement réels ou stylisés, orientés décision (comité, suivi, allocation).
5. **Tools** (`/simulators` → `/tools`) : simulateurs repositionnés comme supports de décision professionnels (dilution, waterfall, economics).
6. **Library** (`/library`, fusionnant `/paths` et `/bibliotheque`) : le socle de formation, relégué au second plan.
7. **Glossary** (`/glossary`) : dictionnaire vivant et connecteur universel.
8. **Workspace** (`/workspace`, ex-dashboard) : espace de production (brouillons, notes, thèses sauvegardées).

### Taxonomie de contenu (Nouveaux métadonnées)
Pour piloter ce corpus diversifié et filtrer l'affichage (ex: masquer le contenu "founder" à un investisseur), chaque nouveau contenu doit intégrer une taxonomie stricte :
- **`contentKind`** : `fundamental`, `playbook`, `research-note`, `sector-note`, `thesis`, `atlas`, `case`, `framework`, `tool`, `reference`.
- **`audience`** : `investor`, `aspiring-investor`, `junior-investor`, `cvc`, `founder-facing`, `all`.
- **`rigor`** : `intro`, `practitioner`, `desk-reference` (remplace les niveaux débutant/intermédiaire/avancé pour l'affichage public).
- **`evidenceLevel`** : `conceptual`, `analytical`, `sourced`, `decision-grade`, `maintained-intelligence`.

*Note technique : ces champs sont le **standard cible de la Phase 3** de la roadmap, pas encore le schéma généralisé des collections historiques. Le validateur actuel est strict : n'ajoutez pas ces champs dans `paths.json`, `courses.json`, `lessons.json`, `blog.json`, `caseStudies.json` ou `simulators.json` tant que les types et schémas Zod n'ont pas été migrés. La règle d'or reste **Schema-first** : aucune nouvelle collection VC Intelligence n'est ajoutée sans validation stricte.*

---

## 2. Le cycle de vie du contenu (à comprendre AVANT d'éditer)

C'est le concept central de la plateforme. Le contenu suit ce chemin :

```
data/*.json ──(client bundle @data)──────────────► fallback instantané (invité / hors-ligne)
     │
     └────(server lib/content.ts)──► prisma/seed.ts ──► SQLite ──► /api/content/* ──► useApiData
```

### 2.1. `useApiData` : « bundle d'abord, API ensuite »
Les pages de contenu n'appellent pas l'API directement : elles utilisent le hook [useApiData](client/src/hooks/useApiData.ts) :

```ts
const { data: paths } = useApiData<Path[]>('/content/paths', PATHS); // PATHS = JSON bundlé
```

- Rendu **immédiat** du contenu bundlé (`PATHS`) → l'app marche sans serveur, en invité, hors-ligne.
- Si l'API répond, ses données **remplacent** le fallback → les éditions du CMS apparaissent sur le site public.
- Si l'API est injoignable, on garde le fallback. Aucune page blanche.

> [!TIP]
> Le build client est découpé par routes et par collections de contenu : le vendor React pèse environ **232 kB** ; les collections lourdes (`lessons`, `glossary`, `ikigai`) restent dans des chunks séparés. Le glossaire et les leçons sont en outre **scindés index/contenu** : seul l'index léger est eager, les définitions/corps (`glossary.defs.json` / `lessons.bodies.json`) arrivent en chunks lazy — le chunk `lessons` eager tombe ainsi de ~176 kB à ~32 kB.

### 2.2. Conséquences pratiques (importantes)

| Vous éditez… | Ce qui se met à jour | L'action requise |
| --- | --- | --- |
| un fichier `data/*.json` | le **bundle** client (via HMR en dev) | rien pour le mode invité ; **`npm run db:seed`** pour que l'API serve la nouvelle version |
| via le **CMS `/admin`** | la **base** uniquement (pas le JSON) | apparaît tout de suite via l'API ; **n'est PAS écrit dans `data/`** |

> [!IMPORTANT]
> Le **CMS écrit dans la base, jamais dans `data/`**. Depuis 2026-06-12, **`npm run db:seed` est non destructif** pour le contenu éditable (glossaire/blog/cas) : une ligne déjà en base est préservée — vos éditions CMS survivent à un re-seed. Seuls `npm run db:seed -- --force` et `npm run db:reset` réécrivent ces lignes depuis le JSON. Pour faire l'inverse (rapatrier les éditions CMS dans les JSON sources), lancez **`npm run content:export`**. Règle d'or inchangée : le CMS sert aux retouches rapides ; **le contenu pérenne doit finir dans `data/*.json`** (via `content:export` ou édition directe), versionné, puis re-seedé.

### 2.2.c. La boucle d'édition canonique (export → commit → PR)

`data/*.json` est l'**unique source canonique** ; la base SQLite n'est qu'un **cache d'édition**. Une édition CMS n'est « finie » que lorsqu'elle est revenue dans le JSON et committée. Le rituel ferme cette boucle :

1. **Éditer** dans `/admin` (glossaire, blog, études de cas — les trois seules collections éditables, exactement celles couvertes par l'export).
2. **Exporter** : `POST /api/admin/export` (réservé admin) exécute le script `content:export` contre la base en cours et renvoie `{ log, diff, changed }` — le `diff` git de `data/` à relire. L'éditeur n'a pas besoin de terminal. En CLI : `npm run content:export`. Ajoutez `?dryRun=1` (ou `{ dryRun: true }`) pour prévisualiser sans écrire.
3. **Committer** le diff de `data/glossary.json` / `caseStudies.json` / `blog.json`, puis ouvrir une **PR**.

> [!IMPORTANT]
> **Sérialiseur canonique unique.** Le format de référence d'un fichier exporté est exactement la sortie de `JSON.stringify(payload, null, 2)` + `\n`, trié (`glossary` par `term`, `caseStudies` par `title`, `blog` par `date` puis `title`). Les `data/*.json` éditables sont normalisés à cette forme : ne les reformatez pas à la main. Toute divergence est rattrapée par l'export.

> [!IMPORTANT]
> **Garde-fou anti-drift (CI).** Le job `drift` ([.github/workflows/ci.yml](.github/workflows/ci.yml)) seed une SQLite jetable depuis `data/*.json` puis lance `content:export --dry-run` : si un fichier canonique changerait, le script sort en **code 1** et la CI échoue. C'est la preuve que **seed (JSON→DB) et export (DB→JSON) sont inverses**. Conséquence : si vous éditez en base sans exporter, ou si vous modifiez le sérialiseur, la CI vous le signale.

### 2.2.b. Cas particulier : glossaire VC
Le glossaire final consommé par l'app reste [data/glossary.json](data/glossary.json), mais son chantier éditorial passe d'abord par [glossary-ingestion/canonical-glossary.json](glossary-ingestion/canonical-glossary.json).

- `canonical-glossary.json` est le registre durable : il conserve sources, modules, décisions d'édition, aliases, `action` (`add`, `update`, `merge`, `skip`) et `status` (`draft`, `needs-review`, `approved`, `applied`).
- `data/glossary.json` ne contient que les entrées finales consommées par l'application : `id`, `term`, `slug`, `category`, `short`, `definition`, `example`, `link`, `seeAlso`, `relatedLessonIds`.
- Au 2026-06-07, le registre contient **433 entrées** et le glossaire final **357 termes**. Les audits PitchBook, SEC et Schoenherr sont couverts par entrées finales ou aliases.
- Toute variante simple doit devenir un **alias** d'un terme existant plutôt qu'une fiche autonome ; une fiche finale n'est créée que si le concept a une utilité de popover ou de navigation propre.

Pour clôturer une passe glossaire : mettez le registre à jour, injectez seulement les `add`/`update` retenus dans `data/glossary.json`, puis lancez `npm run validate:glossary`, `npm run validate:content` et `npm run build`.

### 2.3. Stockage côté serveur
Chaque type de contenu a une table Prisma avec des **colonnes indexées** (slug, titre, `searchText`…) **+ un blob `data` JSON** qui porte l'objet complet (voir [schema.prisma](server/prisma/schema.prisma)). Les routes [content.ts](server/src/routes/content.ts) renvoient simplement `JSON.parse(row.data)`. C'est un compromis SQLite : requêtable pour les listes/la recherche, et trivialement migrable.

> [!IMPORTANT]
> **Gestion des erreurs async (Express 4).** Express 4 ne transmet **pas** une promesse rejetée à l'error-handler central — une rejection dans un handler `async` (erreur Prisma, `JSON.parse` sur un blob `data` corrompu, base verrouillée) deviendrait une *unhandled rejection* qui tue le process. Tous les handlers sont donc enveloppés dans **`ah()`** (`server/src/lib/async-handler.ts`), qui `catch`-forward la rejection vers `next` → error-handler (réponse 500). **Tout nouveau handler async doit être wrappé : `router.get('/x', ah(async (req, res) => { … }))`.**

---

## 3. Logique et composants principaux

### 3.1. État & persistance (React Context — `client/src/context/`)
- **`ThemeProvider`** — clair/sombre, persistant (`localStorage`), respecte `prefers-color-scheme`.
- **`AuthProvider`** — session JWT (cookie httpOnly), expose `isAuthed`, `isAdmin`, et surtout `apiUp` / `ready` (sondage de l'API) consommés par `useApiData`. Le sondage est **répété** tant que l'API est injoignable (intervalle 15 s + événements `focus`/`online`) : une API qui démarre après le client ne laisse plus l'app bloquée en mode invité jusqu'au reload, et la session est restaurée avant de basculer `apiUp`.
- **`UserDataProvider`** — profil, notes, favoris, progression, surlignages. **Mode invité** = `localStorage` ; **connecté** = API. À la première connexion, les données invité sont **migrées** vers le serveur.
- **`UIProvider`** — palette de commande (⌘K), dialogues d'auth, états d'UI globaux.

### 3.2. Persistance invité (`client/src/lib/storage.ts`)
Toutes les clés sont préfixées `vcpx:` : `theme`, `profile`, `notes`, `bookmarks`, `progress`, `highlights`, `onboarding-seen`.

### 3.3. Pages clés (`client/src/pages/`)
L'arborescence évolue vers la cible VC Intelligence :
- **Intelligence & Outils** : `ThesisLabPage`, `AtlasPage`, `ResearchPage` (à venir). `CaseStudyPage` (détail d'une étude de cas), `SimulatorsPage` / `SimulatorPage` (outils).
- **Library (Formation)** : **`ParcoursPage`** (catalogue des parcours, `/paths`), **`ParcoursDetailPage`** (carte de voyage d'un parcours, `/paths/:slug`), **`ParcoursOrSubjectPage`** (aiguilleur `/paths/:slug`). `PathsPage` (la **Bibliothèque**, `/bibliotheque`), `PathDetailPage` (détail d'un rayon), `CourseDetailPage`, `LessonPage` (lecture active).
- **Core & Infrastructure** : `HomePage`, `OnboardingPage` (ikigai optionnel), `GlossaryPage`, `SearchPage`.
- **Workspace** : `DashboardPage` (évolue vers un workspace artifact-first), `ProfileResultPage`, `NotesPage`, `ProfilePage`.
- **CMS** : `admin/AdminPage`.

> [!IMPORTANT]
> **Rétractation et routage (Juin 2026).** La page catalogue **`/paths`** utilise un rendu interactif en accordéon pour rétracter les familles de parcours (`grid-rows-[0fr]/[1fr]`). De même pour les cours dans les rayons legacy (`PathDetailPage`).
> L'URL `/paths/:slug` est servie par un composant pivot intelligent : **`ParcoursOrSubjectPage`**. Il détermine dynamiquement si le slug demandé appartient au nouveau modèle `parcours.json` (rend `ParcoursDetailPage`) ou aux rayons legacy `paths.json` (rend `PathDetailPage`), éliminant ainsi toute collision de route tout en conservant le code-splitting via `lazy()`.

### 3.4. Routing bilingue FR/EN (`client/src/i18n/`)
La Phase 1 de l'architecture i18n (voir [i18n_architecture_FR-EN.md](i18n_architecture_FR-EN.md)) est **implémentée**. Les URLs sont préfixées par la locale : `/fr/...` et `/en/...`, et `App.tsx` monte les routes sous `/:locale`.

- **`config.ts`** — `LOCALES`, locale par défaut `fr`, détection (cookie → navigateur → `fr`), persistance. La préférence n'est écrite **qu'au clic explicite** du sélecteur (visiter un lien `/en` ne réécrit pas le choix). Contient aussi le drapeau **`EN_ENABLED`** (cf. ci-dessous).
- **`routing.tsx`** — wrappers **`Link` / `NavLink` / `useNavigate`** qui **préfixent automatiquement la locale active**, plus `localizePath` / `swapLocalePath`. Couvert par `routing.test.ts`.
- **`guards.tsx`** — `RootRedirect` (`/` → langue détectée ; **seul** redirect par détection, donc crawler-safe) et `LocaleBoundary` (valide `:locale`, redirige les liens legacy `/paths` → `/fr/paths`, pose `<html lang>` dynamiquement — **forcé à `fr` tant que `EN_ENABLED` est faux**, pour ne pas annoncer `lang="en"` sur un contenu français).
- **`useLocale.ts`** — dérive la locale de `useLocation()` (fonctionne aussi pour la CommandPalette montée au-dessus des routes par `UIProvider`).
- **`LocaleSwitcher.tsx`** — sélecteur FR/EN (vrais liens, clavier/crawl OK), branché dans **TopBar** et **SideNav** (rail + drawer mobile), mais **rendu uniquement si `EN_ENABLED` est vrai**.

> [!IMPORTANT]
> **Drapeau `EN_ENABLED` (`config.ts`).** Tant que le chrome et le contenu EN ne sont pas traduits, `EN_ENABLED = false` : le sélecteur de langue est **masqué** partout et `<html lang>` reste `fr` même sous `/en`. Le routing localisé continue de fonctionner (les URLs `/en/...` répondent), mais on n'expose pas aux utilisateurs un anglais qui retomberait en français. Pour réactiver l'anglais : passer ce drapeau à `true` une fois la Phase 2 (i18n du chrome) branchée.

> [!IMPORTANT]
> Pour tout nouveau lien interne, **importez `Link`/`NavLink`/`useNavigate` depuis `@/i18n/routing`**, pas depuis `react-router-dom`. Les sites d'appel gardent `to="/paths"` inchangé : le wrapper ajoute la locale. Les marqueurs `[[slug]]` / `{{slug}}` de `markdown.tsx` restent **inchangés** car les slugs sont **canoniques** (identiques FR/EN). Reste à faire : Phase 2 (i18n du chrome — dictionnaire maison local typé `{fr,en}` + hook `useT()`), Phase 4 (Prisma `locale` + `@@unique([slug, locale])`), Phase 5 (`hreflang`, couplée au choix de rendu).

---

## 4. Guide d'édition — ajouter / modifier du CONTENU

> Tous les types et leurs champs sont définis dans [client/src/content/types.ts](client/src/content/types.ts) (côté client) et [server/src/lib/content.ts](server/src/lib/content.ts) (`RawPath`, `RawLesson`, …). **Gardez ces deux fichiers cohérents si vous ajoutez un champ.**

### 4.0. Conventions d'`id` et de `slug`
- `slug` = identifiant d'URL (kebab-case, sans accent). Doit être **unique** par type.
- `id` = clé interne stable. Conventions observées : **parcours** (couche neuve, `parcours.json`) → `p-*` ; **rayon** de la Bibliothèque (ancien `paths.json`) → court (`discover`) ; cours → `c-*`, leçons → `l-*` (bibliothèque) / `lpl-*` (cours Power Law & Monte Carlo) / `ld-*` (registre découverte) / `lea-*` (registre entretien analyst), **glossaire → `id == slug`**, blog → `bp-<slug>`, études de cas → id propre (`cs-*`).
- Les relations se font **par `id`**, pas par slug (voir le graphe ci-dessous).

```
Path.courseIds[] ──► Course.id           Course.lessonIds[] ──► Lesson.id
Course.pathId ──► Path.id                Lesson.courseId ──► Course.id
Lesson.glossaryRefs[] ──► Glossary.slug  Glossary.relatedLessonIds[] ──► Lesson.id
CaseStudy.glossaryRefs[] ──► Glossary.slug   Simulator.relatedLessonIds[] ──► Lesson.id
```

### 4.0.b. Taxonomie et validation (standard cible Phase 3)
Le repositionnement introduit une taxonomie cible (voir §1bis) : `contentKind`, `audience`, `rigor`, `status`, et `evidenceLevel`. Elle est nécessaire avant l'expansion Research / Thesis Lab / Atlas, mais elle n'est **pas encore généralisée** aux schémas des collections historiques.
- **N'ajoutez pas ces champs aux JSON existants** tant que `client/src/content/types.ts`, `server/src/lib/content.ts` et `scripts/validate-content.mjs` n'ont pas été migrés : les schémas Zod actuels sont stricts et rejetteraient des champs inconnus.
- **Validez toujours** vos JSON locaux avec `npm run validate:content`.
- Le script `scripts/validate-content.mjs` agit comme une garde-barrière empêchant l'injection de données mal formées. Les schémas Zod assurent cette cohérence structurelle.

### 4.1. Ajouter une LEÇON (`data/lessons.json`)
La leçon est l'unité de lecture. Exemple minimal :

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
> **Pipeline d'authoring des parcours.** Pour un parcours entier, la rédaction se fait d'abord en Markdown dans [docs/parcours/](docs/parcours) (un doc de conception transverse `parcours-apprentissage-conception.md`, puis un doc par parcours, ex. `02-reussir-l-entretien-analyst.md`). Le contenu rédigé est ensuite porté en fiches de leçons **drop-in** dans `data/parcours/<parcours>.lessons.json` — un tableau d'objets au **schéma `Lesson` exact** (`data.lessons as Lesson[]`). Conventions d'`id` : `ld-*` = leçon *découverte* (parcours 01), `lea-*` = leçon *entretien analyst* (cours `c-entretien-analyst`) — choisies pour **cohabiter** avec les `l-*` sans les écraser.
>
> **État actuel du câblage (cohabitation client + serveur).** Ces fiches sont **servies au client** : `scripts/split-lessons.mjs` fusionne `data/lessons.json` **et** `data/parcours/*.lessons.json` dans l'index/bodies générés, que `content/lessons.ts` expose (`LESSONS` + `loadLesson`), donc `lessonById`/`lessonBySlug` et le lecteur les résolvent. *(L'ancien `client/src/content/parcoursLessons.ts` a été supprimé : sa concaténation est désormais reprise par le script de split.)* Côté serveur, `server/src/lib/content.ts` charge aussi `data/parcours/*.lessons.json` et `server/prisma/seed.ts` seed `content.allLessons()`. Après `npm run db:seed`, les endpoints API `/content/lessons/:slug` résolvent donc les leçons drop-in comme les leçons de `data/lessons.json`.
>
> **Si vous ajoutez un nouveau registre drop-in :** déposez simplement le fichier `data/parcours/<nom>.lessons.json` — **le serveur ET le client l'auto-chargent** (le split fait un glob sur `data/parcours/*.lessons.json`, plus aucun import manuel à ajouter). Attention aux `slug` en double : `split-lessons.mjs` échoue si deux leçons partagent un slug. Gardez ensuite les `steps` de `data/parcours.json` et les `lessonIds[]` des cours cohérents, puis lancez `npm run validate:content` et `npm run db:seed`.

#### La mini-syntaxe Markdown du `body`
Le rendu est assuré par [client/src/lib/markdown.tsx](client/src/lib/markdown.tsx). Sont supportés :

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

#### Détection automatique des termes (prose des leçons) — 2026-06-09
Le balisage manuel ne suffit plus à garantir la règle produit : **dans les cours, tout terme technique ou sigle doit avoir un popover + redirection vers le dictionnaire.** `markdown.tsx` applique donc une **détection automatique** quand `glossaryPreview` est actif (prose de leçon via `ActiveProse sourceType="lesson"`, et définitions de `GlossaryPage`).

- Un matcher est construit une fois à partir de **tous les termes + alias** du glossaire (357 termes, ~1256 clés). La **première occurrence** de chaque terme dans la page devient un popover ; les occurrences suivantes restent en texte simple (lecture propre).
- Les **marqueurs manuels** `[[..]]` / `{{..}}` restent prioritaires : leurs slugs sont pré-amorcés, donc la détection auto ne re-lie jamais un terme déjà balisé.
- Les **sigles** (VC, MOIC, B2B, DPI…) sont reconnus **en respectant la casse** : `VC`/`VCs` sont liés, `vc` en minuscule ou `VC` à l'intérieur d'un mot (`MVC`) ne le sont pas. Les phrases longues priment sur leurs sous-mots (« fonds VC » → `venture-capital-fund`). Frontières Unicode → les termes accentués restent intacts.
- **Contenu du popover** : terme + champ `short` uniquement (explication très brève). Le **panneau entier** est cliquable et redirige vers `/glossary?term=slug` (lien réel : accessible clavier, clic-milieu/nouvel onglet préservés, navigation SPA au clic gauche) — pas de ligne « Voir dans le dictionnaire » séparée.
- **Portée** : leçons (toutes via `LessonPage`) + définitions du dictionnaire. Les **études de cas / blog** restent en balisage manuel uniquement (`glossaryPreview` désactivé) : ce ne sont pas des « cours ».

### 4.2. Ajouter un TERME au dictionnaire (`glossary-ingestion/canonical-glossary.json` puis `data/glossary.json`)
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
Le dictionnaire est rendu par [GlossaryPage.tsx](client/src/pages/GlossaryPage.tsx). Les contrôles (alphabet, domaines, recherche) sont regroupés dans un bandeau **sticky** compact :

- `activeLetter` suit la section alphabétique explorée au scroll et se met aussi à jour au clic ;
- `ResizeObserver` mesure le bandeau sticky pour alimenter `--glossary-anchor-offset` ; les ancres `letter-*` et `term-*` utilisent ce scroll-margin afin de ne jamais passer sous les filtres ;
- sur mobile, alphabet et domaines sont horizontalement scrollables ; le bouton de la lettre active se recentre dans son rail ;
- tous les `scrollIntoView` respectent `prefers-reduced-motion`.

> [!TIP]
> Si vous ajoutez un nouveau filtre ou une deuxième ligne de contrôles dans `/glossary`, ne mettez pas une valeur `scroll-mt-*` fixe sur les sections : faites évoluer le calcul de `anchorOffset`, sinon les ancres seront masquées sous le bandeau sticky.

### 4.3. Ajouter un RAYON à la Bibliothèque (`data/paths.json`)
> Note de nommage : les 9 entrées de `paths.json` étaient appelées « parcours » ; depuis l'arrivée de la couche Parcours (§4.3bis), ce sont les **rayons** de la **Bibliothèque** (`/bibliotheque`). Un rayon regroupe des cours. **L'`accent` (couleur) et le `kanji` alimentent les sceaux de cire et l'en-tête du rayon.** (La carte interactive / Atlas, elle, représente désormais les **parcours** — voir §4.3bis et §5.3.)

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
> Depuis la couche Parcours, **l'Atlas (`PathAtlas.tsx`) ne représente plus les rayons mais les *parcours*** (placés par `level` sur les trois arcs `debutant` → `Terra Prima`, `intermediaire` → `Mare Analytica`, `avance` → `Haute Citadelle` ; les parcours `tous` deviennent des **îles**). Un rayon n'influe donc plus sur la carte. Voir §4.3bis et §5.3.

### 4.3bis. Ajouter un PARCOURS (`data/parcours.json`)
La couche **Parcours** est une **trajectoire par objectif** posée *au-dessus* de la bibliothèque : elle ne stocke pas de contenu, elle **référence des atomes par `id`** (zéro duplication, navigation libre native). Type : [`client/src/content/parcoursTypes.ts`](client/src/content/parcoursTypes.ts) ; loader : [`client/src/content/parcours.ts`](client/src/content/parcours.ts). Conception complète : [`docs/parcours-apprentissage-conception.md`](docs/parcours-apprentissage-conception.md).

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
> - **Le curseur temps** est implémenté par `timeFit` + le `type` des étapes : `visibleSteps(p, budget)` montre `low → coeur`, `medium → coeur+pratique`, `high → tout`. Donc taguez les étapes correctement.
> - **Résolution des `ref`** (`resolveStep` dans `content/parcours.ts`) : `lesson`/`milestone` → `lessonById` → `/lessons/:slug` ; `case` → `/cases/:slug` ; `simulator` → `/simulators/:slug` ; `glossary` → `/glossary?term=`. Un `ref` non résolu (id `todo-*`, contenu non écrit) s'affiche en **« bientôt »**, sans lien — c'est le rôle de `status: "a-produire"`.
> - **Aiguillage ikigai** : pour qu'un profil recommande ce parcours (bandeau « Ton parcours »), ajoutez-le dans [`data/profileParcours.json`](data/profileParcours.json) (`byProfile.<profil>.primary|then|express`). Les politiques transverses (gating, évaluation, i18n) sont dans [`data/parcoursConfig.json`](data/parcoursConfig.json).
> - **i18n** : tout champ texte est un `LocalizedText` (`string` = `fr`, ou `{ fr, en }`) ; les surcharges vivent dans `data/parcours.en.json`, fusionnées par `id`.

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

### 4.5. Étude de cas (`data/caseStudies.json`) & Analyse/blog (`data/blog.json`)
- **Étude de cas** : `kind` ∈ `startup|fund|deal|market`, `sections[]` (`heading` + `body` markdown), `takeaways[]`, `glossaryRefs[]`.
- **Analyse (blog)** : `category`, `author`, `date` (`YYYY-MM-DD`), `excerpt`, `body` (même markdown), `tags[]`. Le `body` accepte les liens `[[slug]]`. Deux champs **optionnels** servent le format « Lecture oblique » (analyses de livres, cf. §10.9 de `docs/STRATEGIE-vc-intelligence.md`) : `books[]` (`title`/`author`/`year?`, tableau pour les « duels de livres ») affiché sur la carte et l'en-tête de l'article, et `glossaryRefs[]` (mêmes ids que les études de cas) qui rend le bloc « Pour aller plus loin » en fin d'article. La catégorie `"Lecture oblique"` est filtrable sur `/blog`.

### 4.6. Simulateur (`data/simulators.json`)
Le JSON ne décrit que la **fiche** (titre, `category`, `accent`, `description`, `relatedLessonIds`). **La logique de calcul est du code**, dans [client/src/components/simulators/calculators.tsx](client/src/components/simulators/calculators.tsx). Ajouter un *nouveau* simulateur = ajouter la fiche JSON **et** brancher un composant calculateur (mappé par `slug`).

### 4.7. Workflow CMS (`/admin`, compte admin)
Connectez-vous avec `admin@vcpx.io` / `admin1234`. Le CMS ([AdminPage.tsx](client/src/pages/admin/AdminPage.tsx)) couvre, via [server/src/routes/admin.ts](server/src/routes/admin.ts) :

| Type | Créer | Modifier | Supprimer |
| --- | :---: | :---: | :---: |
| Dictionnaire | ✅ | ✅ | ✅ |
| Analyses (blog) | ✅ | ✅ | ✅ |
| Études de cas | — | ✅ | — |
| Parcours / cours / leçons / simulateurs | — | — | — (JSON + seed uniquement) |

Les entrées sont validées par **zod** côté serveur, le `slug` est auto-généré depuis le titre si absent, et `searchText` est recalculé. Rappel §2.2 : **ces écritures vivent en base, pas dans `data/`** — mais elles **survivent désormais à un `db:seed`** (non destructif). Pour les pérenniser dans le dépôt : `npm run content:export` → valider → committer le JSON.

### 4.8. ✅ Checklist « j'ai ajouté du contenu en JSON »
1. JSON valide ? (virgules, guillemets — un `JSON.parse` qui casse fait planter le seed).
2. `id` et `slug` **uniques** ; relations (`courseId`, `pathId`, `lessonIds`, `glossaryRefs`) pointant vers des entrées **existantes**.
3. Champs cohérents avec `types.ts` **et** `content.ts`.
4. `npm run db:seed` (ou `db:reset`) → vérifier le récap `✓ Seed complete { … }`.
5. Recharger l'app. (En invité, le HMR Vite suffit pour le bundle ; pour l'API, le seed est obligatoire.)

---

## 5. Guide d'édition — GRAPHISME, design & UI

### 5.1. Design tokens (`client/src/styles/tokens.css`)
Toute l'ambiance passe par des **variables CSS** dans `:root` (clair) et `.dark` (sombre) : `--primary` (or `#C5A85C`), `--secondary` (marine), `--tertiary` (prune), surfaces parchemin, `--radius`, etc. **Changez l'ambiance globale en éditant ces valeurs.** L'échelle typographique, les ombres `editorial-*` et les couleurs nommées Tailwind sont dans [client/tailwind.config.ts](client/tailwind.config.ts).

> [!WARNING]
> **Piège Tailwind v3 + couleurs en variable CSS.** Les modificateurs d'opacité **ne fonctionnent pas** sur une couleur-variable : `bg-[color:var(--primary)]/10` ne produit **aucun** style, et `@apply …/90` casse le build. Utilisez partout `color-mix(in srgb, var(--primary) 10%, transparent)`.

### 5.2. Le système d'illustrations « atlas d'explorateur »
Le langage visuel ludique-mais-sérieux est centralisé :
- [client/src/components/ornaments/Illustrations.tsx](client/src/components/ornaments/Illustrations.tsx) — `CompassRose`, `SeaMonster`, `MapCartouche`, `InkStamp`, `ExLibris`, `DropCap`, `Constellation`, `WaxSeal`. Tous **token-aware** (couleurs via `color-mix`).
- [client/src/components/ornaments/Ornaments.tsx](client/src/components/ornaments/Ornaments.tsx) — `Fleuron`, `FleuronDivider`, `KanjiSeal`, `GoldRule`.
- Textures CSS dans [global.css](client/src/styles/global.css) : `.map-paper`, `.contour-field` (`--contour: <accent>`), `.ink-underline`, `.sheen-host`, `.voyage-trail`.
- Keyframes dans `tailwind.config.ts` : `float` / `float-x`, `twinkle`, `draw`, `sheen`, `compass-needle` (+ `pulse-glow`, `spin-slow`, `shimmer`).

> [!CAUTION]
> Un `<svg>` imbriqué dans un autre SVG **doit fixer `height`** (et `width`), sinon il occupe 100 % du parent et se recentre. C'est le bug qui plaçait `MapCartouche` au milieu de la carte.

### 5.3. Modifier la carte interactive (Atlas — `client/src/components/explore/PathAtlas.tsx`)
La carte est **générée** depuis `PARCOURS` (data/parcours.json), pas dessinée à la main. Chaque port est un parcours ; `accent`/`kanji` retombent sur ceux de la famille (`FAMILY_META`) si absents, et la progression vient de `lessonIdsForParcours`.
- **Bandes / territoires** : objet `BANDS` (rayon `r`, arc `from`/`to`, nom de territoire). `ARC_LEVELS` choisit quels niveaux sont des arcs ; les parcours `tous` deviennent des îles via `ISLANDS` (coordonnées fixes).
- **Géométrie** : `W/H/CX/CY` (canevas), helpers `px()/py()`. Pour agrandir/aérer, augmentez les rayons et l'espacement.
- **Étiquettes** : avec 20+ ports, le nom est **masqué au repos** et révélé au survol/focus (sous le sceau : libellé de famille + `title` du parcours, et dans l'encart : famille · niveau · heures + `hook`). Les noms de territoires sont placés *à l'intérieur* des arcs (épaule haut-gauche) pour ne pas chevaucher les ports.
- **Navigation (pan/zoom)** : tout le SVG est enveloppé dans `<g transform="translate(tx ty) scale(scale)">` piloté par l'état `view`. Glisser = pan (grab) ; molette = zoom centré curseur ; pinch deux doigts ; boutons **+/−** et **recentrage** (cluster haut-gauche). Bornage via `clampView` (zoom `[0.6, 3]`). Pour régler la sensibilité molette, voir `Math.exp(-e.deltaY * 0.0015)` ; pour les limites, `MIN_SCALE`/`MAX_SCALE` et la marge de `clampView`. Un seuil de 4 px distingue le clic (navigation) du glissement.
- **Boussole Ikigai** : le groupe `.path-atlas-compass` morph en quatre cercles au survol/focus. Les couleurs viennent de `data/ikigai.json` via `IKIGAI.dimensions`, puis passent par `legibleAccent()` pour rester lisibles en sombre. Les styles CSS variables `--path-ikigai-accent` et `--path-ikigai-fill` sont injectés dans `PathAtlas.tsx`; `global.css` applique le déplacement des cercles, le `fill` translucide et `pointer-events: all`. Cette dernière règle est volontaire : elle garde la forme ouverte quand la souris est sur **n'importe quelle surface d'un cercle**, pas seulement sur le centre ou le trait.
- **Accessibilité** : chaque port est `role="link"`, `tabIndex={0}`, clavier géré ; une **liste de chips** en repli existe sous la carte (mobile / lecteurs d'écran). Le SVG porte `touch-action: none` (pan/pinch) et la molette est un listener natif non-passif.

### 5.4. Animations
Classes utilitaires Tailwind (`animate-float`, `animate-twinkle`, `animate-fade-up`, `duration-*`, `delay-*`) + le composant `Reveal` (apparition au scroll via `IntersectionObserver`). **Tout respecte `prefers-reduced-motion`** (coupé dans `tokens.css` + court-circuit dans `Reveal`).

---

## 6. Workflow développeur (commandes & environnement)

```bash
npm install            # installe client + server (workspaces)
npm run db:setup       # prisma generate + db push + seed (à faire 1×)
npm run dev            # client (Vite ~5173) + serveur (Express :4000) en parallèle

npm run db:seed        # re-seed depuis data/*.json (non destructif ; -- --force pour écraser le CMS)
npm run db:reset       # ⚠️ réinitialise la base puis re-seed --force (efface le CMS)
npm run content:export # rapatrie les éditions CMS (glossaire/blog/cas) dans les data/*.json
npm run split:content  # régénère les index/contenus scindés (glossaire + leçons)
npm run build          # build serveur (tsc) puis client (vite)
npm run lint           # eslint (client)
npm run test --workspace client  # Vitest client (i18n routing, safeHttpUrl, computeProfile, simulateurs)
npm run test --workspace server  # tests d'intégration serveur (auth, profil, isolation userId)
npm run validate:glossary # contrôle custom du glossaire final
npm run validate:content  # vérifie que tous les [[..]]/{{..}} pointent vers un slug du glossaire
```

> [!NOTE]
> Un pipeline **CI** (`.github/workflows/ci.yml`) enchaîne validation contenu → lint → build → tests client → tests serveur, sur chaque `push` `main`/`master` et chaque PR. Harnais Vitest : **client 59 tests sur 10 fichiers** (simulateurs, utils, i18n, ikigai) + **serveur 10 tests sur 3 fichiers** (auth, profil, isolation `userId`) ; à étoffer sur les routes API restantes.

- Front-end : `http://localhost:5173` · API : `http://localhost:4000/api`.
- Variables d'environnement serveur : le loader minimal lit `server/.env` si présent (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`). Un modèle existe dans `server/.env.example`. En prod : vrai `JWT_SECRET`, cookie `secure`, et `provider = "postgresql"` dans `schema.prisma`. **En production, le serveur refuse de démarrer** si `JWT_SECRET` est trop court ou figure dans la blocklist (`getJwtSecretIssue` dans `server/src/lib/auth.ts`) — prévoyez un secret long et unique.

> [!IMPORTANT]
> Après une édition **de code ou de design**, Vite recharge à chaud (HMR) si `npm run dev` tourne. Après une édition **de `data/*.json` destinée à l'API**, lancez `npm run db:seed`.

---

## 7. Choix d'UX notables (et pourquoi)

- **Liberté responsable** : aucun mur d'authentification, aucun chapitre verrouillé. Le compte ne sert qu'à *sauvegarder* — d'où l'architecture invité-d'abord (`useApiData` + `localStorage` + migration à la connexion).
- **Introspection d'abord** : l'onboarding ikigai précède le catalogue (*pourquoi* avant *quoi*) et oriente vers un profil d'apprentissage.
- **Cartographier au lieu de lister** (Atlas) : un sommaire vertical devient une carte marine explorable — on choisit son port, l'ordre conseillé n'est qu'une route pointillée.
- **Lecture active** : sélection de texte dans une leçon/étude/article → **surligner** ou **citer** dans le carnet (persisté).
- **Dictionnaire vivant** : dans les leçons, **tout terme/sigle est détecté automatiquement** (popover « terme + définition brève » cliquable → dictionnaire) en plus des marqueurs manuels `[[slug|libellé]]` ; page `/glossary` indexée. Détails en §4.1.
- **Simulateurs réels** : dilution, pre/post-money, ownership, waterfall, management fees, fund returns et Power Law/Monte Carlo — calcul temps réel côté client. Ils intègrent un bloc pédagogique explicatif, l'historique de calcul et le dictionnaire interactif.
- **CMS éditorial** : `/admin` édite dictionnaire / analyses / études et le site public reflète aussitôt les changements (via l'API).

---

## 8. Le cahier Ikigai (`/onboarding`)

L'onboarding est un **cahier d'introspection** éditorial : masthead, sections numérotées (§01 rappel → §06 test d'orientation), diagramme à 13 zones, archétypes, questions libres, conclusion. Il **conserve** le scoring existant (le test MCQ → profil d'apprentissage), l'auth optionnelle et le fonctionnement invité.

**Données** — tout vit dans [data/ikigai.json](data/ikigai.json) (bundlé côté client, *pas* seedé en base) :
- `dimensions` / `intersections` / `presqueIkigai` : chaque entrée a une variante **Découverte** (`itemsDecouverte`, `exampleDecouverte`, `descriptionDecouverte`, `trapDecouverte`) en langage clair, et une variante **Avancé** (`items`, `example`, `description`, `trap`) avec marqueurs glossaire.
- `archetypes` : les 3 archétypes incarnés (Architecte de Thèse, Bâtisseur d'Infrastructure, Opérateur-Investisseur). Chacun porte positionnement / semaine type / valeur / signaux / métriques en deux modes, plus `profileIds` (profils d'apprentissage reliés) et `recommendedPathIds`.
- `reflection` : `{ decouverte: [7], avance: [7] }` questions libres (sans scoring).
- `questions` : inchangé — le test scoré qui alimente `computeProfile`.

**Deux niveaux de lecture** (par section, jamais global uniquement) :
- *Découverte* — pédagogique ; `[[terme]]` rendu en texte simple, `{{fonds}}` reste cliquable.
- *Avancé* — `[[terme]]` et `{{fonds}}` deviennent des **popovers épinglables** (définition + exemple + lien). Voir [client/src/components/ikigai/IkigaiText.tsx](client/src/components/ikigai/IkigaiText.tsx).

**Composants** (`client/src/components/ikigai/`) : `IkigaiAtlasDiagram` (13 zones SVG, clavier + ARIA, anchors `ikigai-*`), `cahierUi` (`ModeToggle`, `SectionRule`, `ReadingLevelLegend`), `CahierSections` (les 5 sections), `IkigaiText`, `IkigaiCahierSummary` (résumé non-conclusif réutilisé dans Profil & Notes).

**Affichage des sections** : dans [CahierSections.tsx](client/src/components/ikigai/CahierSections.tsx), les sections `03` (*quatre demi-chemins*) et `03.b` (*presque-ikigai*) partagent le même pattern éditorial : liste ouverte `divide-y`, numérotation romaine `I–IV`, titre + formule sur la même ligne, méta en `eyebrow`, puis alerte/piège. Gardez cette symétrie si vous ajoutez une cinquième intersection ou un nouveau type de quasi-ikigai.

**Persistance du cahier** ([client/src/lib/ikigaiCahier.ts](client/src/lib/ikigaiCahier.ts)) : brouillons des réponses libres en `localStorage` (jamais envoyés). L'**enregistrement explicite** « dans mon carnet » les écrit comme `Note` (`sourceType: 'ikigai-cahier'`) — locales en invité, synchronisées au serveur à la connexion (migration existante). Le bouton « Repasser l'Ikigai » archive le profil précédent dans `ikigai-history` avant de l'écraser.

> [!IMPORTANT]
> Toute édition de `data/ikigai.json` ou `data/glossary.json` doit passer `npm run validate:content` (tous les `[[..]]`/`{{..}}` doivent résoudre). Toute édition du glossaire doit aussi passer `npm run validate:glossary`. Le diagramme et les modes respectent `prefers-reduced-motion` (classe `.ikigai-zone`).

---

## 9. Gestion des risques et feuille de route technique

La transition vers la **VC Intelligence Platform** repose sur un cadre d'exécution strict en 10 phases, documenté dans `docs/Stratégie doc et ROADMAP`. 

> [!WARNING]
> **Risques Techniques Majeurs :**
> - **Version Control (T1)** : Baseline Git validée le 2026-06-11 (`master` suit `origin/master`, commit initial `e5b37e0`). Avant toute modification structurante, vérifier un `git status` propre et figer un commit de référence.
> - **Divergence JSON/CMS (T2)** : L'extension du CMS est gelée pour les nouveaux piliers. L'authoring (thèses, atlas) se fait d'abord dans `/data/*.json`. Ne pas accumuler de la dette d'état dans SQLite.
> - **Validation (T3/T8)** : Ne jamais ajouter de contenu sans schéma Zod et validation pre-build (`validate-content.mjs`).
> - **Fausse Intelligence (T4)** : Ne pas simuler de tableaux de bord de données vides ou fausses. Si l'information n'est pas "decision-grade", on ne publie pas.
> - **Découvrabilité (T5/T7)** : Intégrer systématiquement les nouvelles collections (`theses`, `atlas`) dans la recherche client, la *Command Palette* et le SEO, sans briser les anciennes routes (d'où l'usage de redirects ou d'aiguilleurs de route).
> - **Dette de traduction (T6)** : Le développement de la plateforme bilingue complète (i18n) est repoussé ; la priorité est le *FR-first* avec la traduction différée sur les seuls pilotes stratégiques.

---

> [!TIP]
> Pour bien démarrer une contribution : (1) lisez `types.ts` + `content.ts` pour le type que vous touchez, (2) éditez le `data/*.json`, (3) `npm run db:seed`, (4) vérifiez en invité **et** connecté. Pour le design, partez toujours de `tokens.css` et des composants `ornaments/` plutôt que de coder des couleurs en dur.
