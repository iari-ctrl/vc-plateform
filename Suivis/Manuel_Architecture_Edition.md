# Manuel d'Architecture et d'Édition — VC Intelligence Platform

> [!WARNING]
> **MISE À JOUR ARCHITECTURE STATIQUE (Juillet 2026)**
> Le projet a été migré vers une architecture **100% statique et locale**. Le backend (`server/`), l'API Express, la base Prisma/SQLite et les appels réseau correspondants (`useApiData`) ont été **définitivement supprimés**. 
> Toutes les références au backend dans ce document sont désormais obsolètes. Les données utilisateur (profil, notes, favoris, progression) sont gérées exclusivement via `localStorage`. L'application se déploie comme un site statique classique (CSR).

> [!IMPORTANT]
> **Statut documentaire — 2026-06-28**
> - Périmètre : manuel d'architecture, cycle de vie du contenu et guide d'édition.
> - Nature : **journal de suivi — peut diverger du code**. Pour les routes, scripts et compteurs, vérifier `client/src/App.tsx`, `shared/routes.mjs`, `package.json`, `data/` et `.github/workflows/ci.yml`.
> - **Réconciliation 2026-06-28** : passe complète contre le code. La couche **VC Intelligence**, jusqu'ici décrite comme « à venir », est désormais documentée comme **livrée** sous ses noms réels — `/intelligence`, `/ecosystemes`, `/convictions`, `/memos`, `/anti-portfolio`, `/decisions` + `/journal`, `/methode`, `/livrables` (§1bis, §3.3). Compteurs, conventions d'`id`, schéma des registres drop-in, scripts (`db:setup`, `content:sync`, `prerender`) et compteurs de tests ont été alignés sur le dépôt. Nouvelles sous-sections d'édition : §4.5quater (mémos annotés) et §4.5quinquies (anti-portfolio).
> - **Écarts résiduels (assumés, non bloquants)** : la **taxonomie cible Phase 3** (`contentKind`/`audience`/`rigor`/`evidenceLevel`, §1bis) n'est **pas** généralisée aux schémas Zod — ne pas l'ajouter aux JSON existants. Les noms de routes du plan stratégique initial (`/research`, `/theses`, `/atlas`, `/tools`, `/library`, `/workspace`) n'ont pas été retenus tels quels ; leur valeur a été livrée sous d'autres routes (cf. table §1bis).

Dernière mise à jour : 2026-07-03

Ce document décrit l'architecture **full-stack** du projet, la **vision produit et le positionnement stratégique**, le cycle de vie du contenu (de la source canonique JSON jusqu'à l'écran), et un **guide d'édition pas-à-pas** pour un développeur qui veut ajouter du contenu, modifier le design, ou faire évoluer le code.

> [!TIP]
> Si vous ne deviez retenir qu'une chose : **le contenu canonique vit dans les JSON sources de `/data` à la racine du dépôt** (`data/*.json`, et `data/blog/*.json` pour les analyses). Le client le *bundle* (mode invité / hors-ligne) et le serveur l'utilise pour *seeder* la base. Pour 95 % des ajouts de contenu, vous éditez un JSON puis vous lancez `npm run db:seed`.

> [!IMPORTANT]
> **Positionnement stratégique (mis à jour 2026-06-28).** D'une plateforme de formation VC, le projet est devenu une **VC Intelligence Platform**. La couche **VC Intelligence** est désormais **livrée pour l'essentiel** : hub `/intelligence`, dossiers d'écosystème `/ecosystemes`, convictions `/convictions`, mémos annotés `/memos`, anti-portfolio `/anti-portfolio`, carnet de décision `/decisions` + `/journal`, méthode `/methode`, livrables `/livrables`. La formation reste un socle d'entrée précieux (aspirants, juniors, CVC, reconversions) mais ne domine plus l'identité produit. Voir §1bis pour la cartographie « cible initiale → livré ».

---

## 1. Architecture globale et technologies

Le projet est une **Single Page Application statique** sans backend réseau, reposant entièrement sur son bundle local et le stockage du navigateur. Il est conçu pour évoluer d'une plateforme éducative premium vers une **plateforme d'intelligence VC** (voir §1bis).

| Couche | Technologies |
| --- | --- |
| **Front-end** (`client/`) | React 19 · Vite 6 · TypeScript · Tailwind CSS v3 · React Router 7 · lucide-react |
| **Stockage Utilisateur** | `localStorage` (gestion 100% locale sans API distante) |
| **Contenu** (`data/`) | JSON brut, **source de vérité partagée** client ↔ serveur |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

```
vc-premium-platform/
├── data/                      # ← SOURCE DE VÉRITÉ du contenu (JSON)
│   ├── paths.json (9 rayons)  courses.json (16)  lessons.json (55 leçons canoniques)
│   ├── glossary.json (374)
│   ├── caseStudies.json (6)  deliverables.json (2)  blog/ (8 articles, un JSON par slug)
│   ├── simulators.json (9)  ikigai.json
│   ├── parcours.json (22)  parcours.en.json  parcoursConfig.json  profileParcours.json
│   ├── parcours/              # 3 registres drop-in, 11 leçons additionnelles (*.lessons.json, ld-*/llp-*/lts-*)
│   ├── # ── couche VC Intelligence (100 % client, AUCUN seed) ──
│   ├── ecosystems.json (31 dossiers)  memos.json (5 mémos annotés)  antiPortfolio.json (5 motifs + 9 entrées)
│   ├── generated/             # GÉNÉRÉ, ne pas éditer : lessons.index/bodies.json + glossary.index/defs.json (split:content)
│   └── sources/               # registre d'ingestion durable : canonical-glossary.json (436)
├── docs/
│   ├── parcours/              # conception + rédaction des parcours (Markdown)
│   ├── i18n_architecture_FR-EN.md        # ADR + plan de migration bilingue (FR/EN)
│   └── STRATEGIE-vc-intelligence.md      # doc directeur : positionnement, architecture cible, roadmap (fusion stratégie + audit)
├── prototypes/                # maquettes splash/ornaments exploratoires (HTML/JSX, hors application)
├── Suivis/                    # documents de suivi projet (Bilan, Report, Design System, ce Manuel)
│
├── client/                    # SPA React + Vite
│   └── src/
│       ├── i18n/              # routing localisé /fr /en (config · routing · guards · useLocale · LocaleSwitcher)
│       ├── content/           # types.ts + modules par collection @data + recherche locale
│       ├── context/           # Theme · Auth · UserData · UI (React Context)
│       ├── hooks/             # useApiData (100% statique)
│       ├── lib/               # storage · markdown · ikigai · seo · utils (safeHttpUrl)
│       ├── components/        # ui · chrome · ornaments · explore · cards · reading · ikigai · simulators · ErrorBoundary
│       ├── pages/             # pages lazy-loadées, regroupées par domaine
│       └── styles/            # tokens.css (design tokens, dont --error/--success) + global.css
│
.github/workflows/ci.yml       # CI (validate:content → lint → build → tests client ; push main/master + PR)
client/vitest.config.ts        # harnais client (13 fichiers, 74 tests)
i18n_architecture_FR-EN.md     # ADR + plan de migration bilingue (FR/EN)
docs/STRATEGIE-vc-intelligence.md  # doc directeur : positionnement, architecture cible, roadmap (fusion stratégie + audit)
```

> [!NOTE]
> Le client lit `data/` via l'alias Vite **`@data`** (ex. `import pathsJson from '@data/paths.json'` dans `client/src/content/paths.ts`). Chaque collection a son module (`paths.ts`, `courses.ts`, `lessons.ts`, etc.) afin que Rollup découpe le contenu par chunks. Le serveur lit les mêmes fichiers via `server/src/lib/content.ts` (chemin relatif `../../../data`). **Un seul fichier édité alimente les deux côtés.**
>
> **Collections scindées (glossaire & leçons).** Pour alléger le hot path, `glossary.json` et `lessons.json` (+ `data/parcours/*.lessons.json`) sont **dérivés** par `scripts/split-glossary.mjs` et `scripts/split-lessons.mjs` (câblés dans `predev`/`prebuild` via `npm run split:content`) en deux fichiers chacun, écrits sous `data/generated/` : un **index léger** (`generated/*.index.json`, importé en eager pour popovers / recherche / liens) et un **chunk lourd lazy** (`generated/glossary.defs.json` / `generated/lessons.bodies.json`, corps + quiz, chargé à la demande par `loadGlossaryTerm` / `loadLesson`). **Ne jamais éditer les fichiers générés** : on édite la source (`glossary.json`, `lessons.json`, `data/parcours/*.lessons.json`), le split se relance au prochain `dev`/`build`.

---

## 1bis. Vision stratégique : cible initiale → livré (Repositionnement)

La plateforme s'est transformée pour devenir une **VC Intelligence Platform**. Le modèle d'apprentissage reste une porte d'entrée ; la valeur principale réside dans les outils de travail de l'investisseur. Le plan stratégique initial visait huit piliers sous des routes précises. La plupart ont été livrés, mais sous d'autres noms de route — la table ci-dessous fait correspondre la cible d'origine à ce qui existe aujourd'hui dans [`client/src/App.tsx`](../client/src/App.tsx).

| Pilier (cible initiale) | Route livrée | Surface |
| --- | --- | --- |
| Intelligence / Research (`/research`) | `/intelligence` + `/blog` | hub `IntelligencePage` + analyses (dont « Lectures obliques ») |
| Thesis Lab (`/theses`) | `/convictions` + `/ecosystemes` | convictions datées (vue dérivée, §4.5sexies) + thèses falsifiables portées par les dossiers d'écosystème |
| Atlas (`/atlas`) | `/ecosystemes` | « Décortiquer un écosystème » (§4.5bis), 31 dossiers arborescents |
| Cases (`/cases`) | `/cases/:slug` | études de cas décisionnelles (l'index `/cases` redirige vers la Bibliothèque) |
| Tools (`/tools`) | `/simulators` | simulateurs de décision (§4.6) — route inchangée |
| Library (`/library`) | `/paths` + `/bibliotheque` | parcours (§4.3bis) + rayons (§4.3) — non fusionnés |
| Glossary (`/glossary`) | `/glossary` | dictionnaire vivant et connecteur universel |
| Workspace (`/workspace`) | `/dashboard` + `/notes` + `/journal` | tableau de bord, carnet, **carnet de décision** (§4.5sexies) |

Surfaces livrées **hors plan initial** : `/memos` (mémos d'investissement annotés, §4.5quater), `/anti-portfolio` (ratés d'investissement documentés, §4.5quinquies), `/livrables` (artefacts de parcours, §4.5ter), `/methode` (exposé de la méthode d'analyse). Les piliers `/research`, `/theses`, `/tools`, `/library`, `/workspace` n'ont **pas** été retenus comme routes : leur valeur a été absorbée par les surfaces ci-dessus.

### Taxonomie de contenu (Nouveaux métadonnées)
Pour piloter ce corpus diversifié et filtrer l'affichage (ex: masquer le contenu "founder" à un investisseur), chaque nouveau contenu doit intégrer une taxonomie stricte :
- **`contentKind`** : `fundamental`, `playbook`, `research-note`, `sector-note`, `thesis`, `atlas`, `case`, `framework`, `tool`, `reference`.
- **`audience`** : `investor`, `aspiring-investor`, `junior-investor`, `cvc`, `founder-facing`, `all`.
- **`rigor`** : `intro`, `practitioner`, `desk-reference` (remplace les niveaux débutant/intermédiaire/avancé pour l'affichage public).
- **`evidenceLevel`** : `conceptual`, `analytical`, `sourced`, `decision-grade`, `maintained-intelligence`.

*Note technique : ces champs sont le **standard cible de la Phase 3** de la roadmap, pas encore le schéma généralisé des collections historiques. Le validateur actuel est strict : n'ajoutez pas ces champs dans `paths.json`, `courses.json`, `lessons.json`, `data/blog/*.json`, `caseStudies.json` ou `simulators.json` tant que les types et schémas Zod n'ont pas été migrés. La règle d'or visée reste **Schema-first**. Dette à solder : `memos.json` et `antiPortfolio.json` ont été livrés **avant** leurs schémas — ils sont typés en TypeScript mais ni validés par Zod ni couverts par le scan de marqueurs (§4.5quater). Toute nouvelle collection devrait, elle, embarquer son schéma `validate-content.mjs` dès l'ajout.*

---

## 2. Le cycle de vie du contenu (à comprendre AVANT d'éditer)

C'est le concept central de la plateforme. Le contenu suit ce chemin :

```
data/*.json + data/blog/*.json ──(client bundle @data/import.meta.glob)──► fallback instantané
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
| un fichier source (`data/*.json` ou `data/blog/<slug>.json`) | le **bundle** client (via HMR en dev) | rien pour le mode invité ; **`npm run db:seed`** pour que l'API serve la nouvelle version |
| via le **CMS `/admin`** | la **base** uniquement (pas le JSON) | apparaît tout de suite via l'API ; **n'est PAS écrit dans `data/`** |

> [!IMPORTANT]
> Le **CMS écrit dans la base, jamais dans `data/`**. Depuis 2026-06-12, **`npm run db:seed` est non destructif** pour le contenu éditable (glossaire/blog/cas) : une ligne déjà en base est préservée — vos éditions CMS survivent à un re-seed. Seuls `npm run db:seed -- --force` et `npm run db:reset` réécrivent ces lignes depuis le JSON. Pour faire l'inverse (rapatrier les éditions CMS dans les JSON sources), lancez **`npm run content:export`**. Règle d'or inchangée : le CMS sert aux retouches rapides ; **le contenu pérenne doit finir dans `data/*.json` ou `data/blog/*.json`** (via `content:export` ou édition directe), versionné, puis re-seedé.

### 2.2.c. La boucle d'édition canonique (export → commit → PR)

`data/*.json` et `data/blog/*.json` sont l'**unique source canonique** ; la base SQLite n'est qu'un **cache d'édition**. Une édition CMS n'est « finie » que lorsqu'elle est revenue dans le JSON et committée. Le rituel ferme cette boucle :

1. **Éditer** dans `/admin` (glossaire, blog, études de cas — les trois seules collections éditables, exactement celles couvertes par l'export).
2. **Exporter** : `POST /api/admin/export` (réservé admin) exécute le script `content:export` contre la base en cours et renvoie `{ log, diff, changed }` — le `diff` git de `data/` à relire. L'éditeur n'a pas besoin de terminal. En CLI : `npm run content:export`. Ajoutez `?dryRun=1` (ou `{ dryRun: true }`) pour prévisualiser sans écrire.
3. **Committer** le diff de `data/glossary.json` / `caseStudies.json` / `data/blog/`, puis ouvrir une **PR**.

> [!IMPORTANT]
> **Sérialiseur canonique unique.** Le format de référence d'un fichier exporté est exactement la sortie de `JSON.stringify(payload, null, 2)` + `\n`. `glossary` reste trié par `term`, `caseStudies` par `title`, et le blog est exporté dans `data/blog/<slug>.json` avec un fichier par article. Les JSON éditables sont normalisés à cette forme : ne les reformatez pas à la main. Toute divergence est rattrapée par l'export.

> [!IMPORTANT]
> **Garde-fou anti-drift (CI).** Le job `drift` ([.github/workflows/ci.yml](.github/workflows/ci.yml)) seed une SQLite jetable depuis les JSON sources puis lance `content:export --dry-run` : si un fichier canonique changerait, le script sort en **code 1** et la CI échoue. C'est la preuve que **seed (JSON→DB) et export (DB→JSON) sont inverses**. Conséquence : si vous éditez en base sans exporter, ou si vous modifiez le sérialiseur, la CI vous le signale.

### 2.2.b. Cas particulier : glossaire VC
Le glossaire final consommé par l'app reste [data/glossary.json](data/glossary.json), mais son chantier éditorial passe d'abord par [data/sources/canonical-glossary.json](data/sources/canonical-glossary.json).

- `canonical-glossary.json` est le registre durable : il conserve sources, modules, décisions d'édition, aliases, `action` (`add`, `update`, `merge`, `skip`) et `status` (`draft`, `needs-review`, `approved`, `applied`).
- `data/glossary.json` ne contient que les entrées finales consommées par l'application : `id`, `term`, `slug`, `category`, `short`, `definition`, `example`, `link`, `seeAlso`, `relatedLessonIds`.
- Le registre contient **436 entrées** et le glossaire final **374 termes**. Les audits PitchBook, SEC et Schoenherr sont couverts par entrées finales ou aliases.
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
- **`UserDataProvider`** — profil, notes, favoris, progression, surlignages, **entrées du carnet de décision** (modèle Prisma `DecisionEntry`, par `userId` ; cf. §4.5sexies). **Mode invité** = `localStorage` ; **connecté** = API. À la première connexion, les données invité sont **migrées** vers le serveur.
- **`UIProvider`** — palette de commande (⌘K), dialogues d'auth, états d'UI globaux.

### 3.2. Persistance invité (`client/src/lib/storage.ts`)
Toutes les clés sont préfixées `vcpx:` : `theme`, `profile`, `notes`, `bookmarks`, `progress`, `highlights`, `onboarding-seen`.

### 3.3. Pages clés (`client/src/pages/`)
L'arborescence est rangée par domaine (un sous-dossier par couche). La couche VC Intelligence est **livrée** :
- **Intelligence** (`pages/intelligence/`) : **`IntelligencePage`** (hub `/intelligence`), **`MethodePage`** (`/methode`), **`ConvictionsPage`** (`/convictions`, convictions agrégées), **`DecisionsIndexPage`** (`/decisions`, présentation du carnet de décision), **`MemoLibraryPage`** / **`MemoPage`** (`/memos`, mémos annotés — §4.5quater), **`AntiPortfolioPage`** / **`AntiPortfolioEntryPage`** (`/anti-portfolio` — §4.5quinquies), **`DeliverablesPage`** / **`DeliverablePage`** (`/livrables` — §4.5ter).
- **Écosystèmes** (`pages/ecosystems/`) : **`EcosystemsPage`** (index « Décortiquer un écosystème », `/ecosystemes`) et **`EcosystemPage`** (détail d'un dossier, `/ecosystemes/:slug`) — la couche Atlas / analyse signée (cf. §4.5bis).
- **Outils & cas** : `SimulatorsPage` / `SimulatorPage` (`/simulators`), `CaseStudyPage` (`/cases/:slug` ; l'index `/cases` redirige vers la Bibliothèque), `blog/BlogPage` / `BlogPostPage`.
- **Library (Formation)** : **`ParcoursPage`** (catalogue des parcours, `/paths`), **`ParcoursDetailPage`** (carte de voyage d'un parcours), **`ParcoursOrSubjectPage`** (aiguilleur `/paths/:slug`), `PathsPage` (la **Bibliothèque**, `/bibliotheque`), `PathDetailPage` (détail d'un rayon), `CourseDetailPage`, `LessonPage` (lecture active).
- **Core & Infrastructure** : **`SplashPage`** (route index `/`), `HomePage` (`/home`), `OnboardingPage` (ikigai optionnel, avec `OrientationTest` + `MythCard`), `GlossaryPage`, `SearchPage`, `system/NotFoundPage`, `system/DesignSystemShowcasePage`.
- **Workspace** (`pages/workspace/`) : `DashboardPage`, **`DecisionJournalPage`** (`/journal`, carnet de décision adossé serveur — §4.5sexies), `NotesPage`, plus `onboarding/ProfileResultPage` et `onboarding/ProfilePage`.
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
- `id` = clé interne stable. Conventions observées : **parcours** (couche neuve, `parcours.json`) → `p-*` ; **rayon** de la Bibliothèque (ancien `paths.json`) → court (`discover`) ; cours → `c-*` ; leçons de `lessons.json` → `l-*` (bibliothèque) / `lpl-*` (Power Law & Monte Carlo) / `lmv-*` / `lea-*` (entretien analyst) / `lf-*` ; leçons **drop-in** de `data/parcours/*.lessons.json` → `ld-*` (découverte), `llp-*` (lever son fonds LP), `lts-*` (standard français) ; **glossaire → `id == slug`** ; blog → `bp-<slug>` ; études de cas → `cs-*` ; **mémos** → `memo-*` (§4.5quater) ; **anti-portfolio** → `ap-*` (§4.5quinquies) ; **livrables** → l'`id` du milestone résolu (`todo-*`, cf. §4.5ter).
- Les relations se font **par `id`**, pas par slug (voir le graphe ci-dessous).

```
Path.courseIds[] ──► Course.id           Course.lessonIds[] ──► Lesson.id
Course.pathId ──► Path.id                Lesson.courseId ──► Course.id
Lesson.glossaryRefs[] ──► Glossary.slug  Glossary.relatedLessonIds[] ──► Lesson.id
CaseStudy.glossaryRefs[] ──► Glossary.slug   Simulator.relatedLessonIds[] ──► Lesson.id
Deliverable.model{kind,id} ──► CaseStudy.id | EcosystemDossier.id | Memo.id | Lesson.id
Deliverable.relatedLessonIds[] ──► Lesson.id   ParcoursStep.ref(milestone).id ──► Deliverable.id
```

### 4.0.b. Taxonomie et validation (standard cible Phase 3)
Le repositionnement introduit une taxonomie cible (voir §1bis) : `contentKind`, `audience`, `rigor`, `status`, et `evidenceLevel`. Elle est nécessaire avant l'expansion Research / Thesis Lab / Atlas, mais elle n'est **pas encore généralisée** aux schémas des collections historiques.
- **N'ajoutez pas ces champs aux JSON existants** tant que `client/src/content/types.ts`, `server/src/lib/content.ts` et `scripts/validate-content.mjs` n'ont pas été migrés : les schémas Zod actuels sont stricts et rejetteraient des champs inconnus.
- **Validez toujours** vos JSON locaux avec `npm run validate:content`.
- Le script `scripts/validate-content.mjs` agit comme une garde-barrière empêchant l'injection de données mal formées. Les schémas Zod assurent cette cohérence structurelle.

### 4.0.c. Style rédactionnel — charte transverse (non négociable)
Toute prose éditoriale publiée sur le site suit la **même** charte de style, quelle que soit la collection : leçons (`body`, `summary`, `keyTakeaways`, quiz), glossaire (`short`, `definition`, `example`), études de cas et analyses/blog (`sections`, `excerpt`, `body`), dossiers d'écosystème (`these`, sections, `convictions`, signaux, légendes de figures), parcours (`hook`, `goal`, `outcomes`, `prerequisites`), cahier ikigai et fiches de simulateurs (`description`).

> [!IMPORTANT]
> **Source canonique de la charte** : la section « Writing style (non-negotiable) » du skill [`.claude/skills/ecosystemes/SKILL.md`](../.claude/skills/ecosystemes/SKILL.md) et la mémoire `style-redaction-naturel`. Le skill est nommé d'après les écosystèmes, mais ses règles de style **s'appliquent à toute rédaction du site** — c'est le skill qui fait foi en cas de doute. Ce qui suit en est le résumé opérationnel.

Le registre visé est celui d'un analyste compétent qui rédige un mémo, pas d'un copywriter qui vend. Concrètement :

- **Prose fluide, longueurs de phrases variées.** Des phrases courtes, puis une plus longue qui prend son temps. Ouvertures *in medias res*, sans mise en bouche.
- **Une idée par paragraphe**, énoncée puis étayée. Chaque phrase apporte une information neuve ; on coupe ce qui ne fait que « sonner intelligent » (« Il est important de noter que… », « Dans un monde en constante évolution… »).
- **Bannir les tics d'IA** : énumérations mécaniques (« Premièrement… Deuxièmement… »), une punchline à la fin de chaque paragraphe, surdensité de deux-points / tirets / appositions, gras multiples par section (un seul par grande idée, ou aucun — sauf catalogues), méta-discours (« Notre lecture : »).
- **Registre sobre, ne pas survendre** (c'est là que les brouillons échouent le plus). Proscrits : métaphores vendeuses (« le cimetière le mieux documenté », « le juge de paix »), superlatifs et dramatisation (« spectaculaire », « étonnamment », « le détail qui change tout »), aphorismes de clôture qui couronnent un paragraphe ou l'article, adverbes qui dictent au lecteur ce qu'il doit ressentir.
- **Énoncer le fait, donner le chiffre avec sa source, en tirer la conséquence en mots simples, s'arrêter.** Une affirmation est plus forte à plat qu'habillée ; si une phrase sonne comme un slogan, la réécrire en constat. Les titres et légendes **décrivent ce qui est montré**, ils ne performent pas une thèse.
- **Grounding** : aucun chiffre sans source vérifiée ; préférer l'ordre de grandeur honnête (« de l'ordre de », « ≈ ») à la fausse précision.

> [!NOTE]
> La charte vise les contenus VC Intelligence et **toute nouvelle production**. Des contenus historiques (certaines leçons antérieures) gardent par endroits des tournures « école » (punchlines, gras appuyés) : on les aligne au fil des relectures, sans imposer de réécriture de masse.

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
> **Pipeline d'authoring des parcours.** Pour un parcours entier, la rédaction se fait d'abord en Markdown dans [docs/parcours/](docs/parcours) (un doc de conception transverse `parcours-apprentissage-conception.md`, puis un doc par parcours). Le contenu rédigé est ensuite porté en fiches de leçons **drop-in** dans `data/parcours/<parcours>.lessons.json`. **Attention au schéma : ces fichiers sont des objets-enveloppes** `{ "_doc": …, "parcoursId": …, "courseId": …, "lessons": Lesson[] }` — la propriété `lessons` est le tableau au schéma `Lesson` exact (le split lit `data.lessons`, pas le fichier comme un `Lesson[]` nu). Trois registres existent aujourd'hui, leurs `id` choisis pour **cohabiter** avec les `l-*` sans les écraser : `ld-*` (parcours 01 *Le VC sans bullshit*, 7), `llp-*` (parcours 03 *Lever son fonds — LP*, 3), `lts-*` (parcours 04 *Le standard français*, 1). Les leçons *entretien analyst* `lea-*`, elles, sont passées dans le canonique `data/lessons.json`.
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

- Un matcher est construit une fois à partir de **tous les termes + alias** du glossaire (374 termes, plus d'un millier de clés une fois les alias dépliés). La **première occurrence** de chaque terme dans la page devient un popover ; les occurrences suivantes restent en texte simple (lecture propre).
- Les **marqueurs manuels** `[[..]]` / `{{..}}` restent prioritaires : leurs slugs sont pré-amorcés, donc la détection auto ne re-lie jamais un terme déjà balisé.
- Les **sigles** (VC, MOIC, B2B, DPI…) sont reconnus **en respectant la casse** : `VC`/`VCs` sont liés, `vc` en minuscule ou `VC` à l'intérieur d'un mot (`MVC`) ne le sont pas. Les phrases longues priment sur leurs sous-mots (« fonds VC » → `venture-capital-fund`). Frontières Unicode → les termes accentués restent intacts.
- **Contenu du popover** : terme + champ `short` uniquement (explication très brève). Le **panneau entier** est cliquable et redirige vers `/glossary?term=slug` (lien réel : accessible clavier, clic-milieu/nouvel onglet préservés, navigation SPA au clic gauche) — pas de ligne « Voir dans le dictionnaire » séparée.
- **Portée** : leçons (toutes via `LessonPage`) + définitions du dictionnaire. Les **études de cas / blog** restent en balisage manuel uniquement (`glossaryPreview` désactivé) : ce ne sont pas des « cours ».

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
> - **Résolution des `ref`** (`resolveStep` dans `content/parcours.ts`) : `milestone` → **livrable d'abord** (`deliverableById` → `/livrables/:slug`, cf. §4.5ter), **sinon** `lessonById` → `/lessons/:slug` (préserve `lea-mock`) ; `lesson` → `/lessons/:slug` ; `case` → `/cases/:slug` ; `simulator` → `/simulators/:slug` ; `glossary` → `/glossary?term=`. Un `ref` non résolu (id `todo-*`, contenu non écrit) s'affiche en **« bientôt »**, sans lien — c'est le rôle de `status: "a-produire"`.
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

### 4.5. Étude de cas (`data/caseStudies.json`) & Analyse/blog (`data/blog/*.json`)
> Prose soumise à la **charte de style §4.0.c** (registre sobre, pas de punchlines ni de survente).

- **Étude de cas** : `kind` ∈ `startup|fund|deal|market`, `sections[]` (`heading` + `body` markdown), `takeaways[]`, `glossaryRefs[]`.
- **Analyse (blog)** : `category`, `author`, `date` (`YYYY-MM-DD`), `excerpt`, `body` (même markdown), `tags[]`. Le `body` accepte les liens `[[slug]]`. Deux champs **optionnels** servent le format « Lecture oblique » (analyses de livres, cf. §10.9 de `docs/STRATEGIE-vc-intelligence.md`) : `books[]` (`title`/`author`/`year?`, tableau pour les « duels de livres ») affiché sur la carte et l'en-tête de l'article, et `glossaryRefs[]` (mêmes ids que les études de cas) qui rend le bloc « Pour aller plus loin » en fin d'article. La catégorie `"Lecture oblique"` est filtrable sur `/blog`.

### 4.5bis. Dossier d'écosystème (`data/ecosystems.json`) — « Décortiquer un écosystème »

Espace d'**analyse signée** (`/ecosystemes`), **100 % client** : tout vit dans `data/ecosystems.json` (type `EcosystemDossier` dans `client/src/content/types.ts`), **aucune table serveur** ni seed — même pattern que les memos / l'anti-portfolio.

- **Arbre** via `parentId` + `order` (profondeur illimitée). Un **dossier-racine** (sans `parentId`) est le **seul listé sur l'index** et **doit** porter une `these` ; un **sous-dossier** peut omettre `these`/`convictions`/`signals`/`players`/`sources` (tous optionnels). Tri des frères : `order` croissant, puis révision la plus récente d'abord.
- **Format éditorial** : thèse falsifiable + `convictions[]` **datées, à degré d'assurance explicite** (`strength` ∈ `exploratoire|moyenne|forte`, jamais implicite) + `signals[]` directionnels (`haussier|baissier|incertain`) qui confirmeront/invalideront la thèse. `kind` ∈ `geographie|secteur|these`. Dates ISO `YYYY-MM-DD`. Loader : `rootEcosystems()`, `childEcosystems(id)`, `ecosystemAncestors(d)` dans `client/src/content/ecosystems.ts`. La page de détail affiche : fil d'Ariane → thèse → sections (+ figures) → convictions → signaux → acteurs → « Approfondir » (enfants) → sources.
- **Figures** (`section.figures[]`) : le renderer markdown maison ne gère ni image, ni HTML brut, ni tableau → les visuels sont des **figures structurées**, rendues en **SVG/HTML natif theme-aware** par `client/src/components/ecosystems/EcosystemFigures.tsx`, **sans aucun asset ni librairie de charting**. 5 types (union discriminée par `kind`) : `bars`, `line`, `matrix` (pastilles `none/low/mid/high`), `quadrant` (items en `x,y ∈ [0,1]`), `taxonomy`. Couleurs via tokens (`--on-surface(-variant)`, `--outline-variant`, `--surface-container*`) + `accent` du dossier. **Un nouveau type de figure = 3 éditions synchronisées** : l'union dans `types.ts`, le `z.discriminatedUnion` dans `scripts/validate-content.mjs`, le renderer dans `EcosystemFigures.tsx`.
- ⚠️ **Pièges** : (1) **jamais de marqueur `[[slug]]`/`{{slug}}` dans le texte d'une figure** (titre/légende/labels/notes) — le validateur scanne tout le JSON et exigerait leur résolution → échec ; (2) `data/ecosystems.json` est un **round-trip exact** de `JSON.stringify(…, null, 2) + '\n'` → muter via un **petit script Node** jetable plutôt qu'à la main, pour zéro diff parasite.
- **Validation** : `npm run validate:content` applique un Zod strict (parent existant, **absence de cycle**, racine ⇒ `these`, `glossaryRefs` + marqueurs `[[..]]` résolus contre le glossaire). Si le glossaire change : `npm run split:content`.
- **Méthodo complète** (recherche sourcée, rédaction, figures, validation) : skill projet **`.claude/skills/ecosystemes/SKILL.md`** — à lire avant tout travail sur un dossier. C'est aussi la **source canonique de la charte de style §4.0.c**, applicable à toute rédaction du site.

### 4.5ter. Livrable de parcours (`data/deliverables.json`)
> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client** (`useApiItem(null, …)` : aucun endpoint serveur), même pattern que les dossiers d'écosystème.

Un **livrable** réalise les étapes `milestone` où l'apprenant *produit* un artefact (autrefois des culs-de-sac `a-produire` affichés « bientôt »). C'est la page `/livrables/:slug` qui montre un **brief** (la consigne) + un **gabarit** (`template[]`, section par section) + une **grille d'auto-évaluation** (`rubric[]`) + un renvoi au **modèle** (`model`) — un artefact de la couche Intelligence déjà existant, qu'on imite (« double emploi » : le livrable complète le parcours **et** amorce un pilier).

- **Type** `Deliverable` dans `client/src/content/types.ts` ; loader `client/src/content/deliverables.ts` (`deliverableById`/`deliverableBySlug`) ; page `client/src/pages/DeliverablePage.tsx` ; route `livrables/:slug`. Le `model.kind` ∈ `ecosystem|case|memo|lesson` est résolu vers `/ecosystemes`, `/cases`, `/memos` ou `/lessons`.
- **Câblage** : `id` du livrable = l'`id` du `milestone` référencé par le step ; passer ce step de `status: "a-produire"` → `"existant"` (le `ref.kind` reste `milestone`, résolu par `resolveStep`, cf. §4.3). À penser : barrel `content/index.ts`, `search.ts` (+ `TYPE_META`/`TYPE_LABEL`), `shared/routes.mjs` (OG `livrables: 'path'`), `scripts/generate-sitemap.mjs`.
- **Validation** : `scripts/validate-content.mjs` applique un Zod strict + résout `model`, `relatedLessonIds`, `glossaryRefs` et les marqueurs `[[..]]` ; le résolveur `milestone` y est aligné sur `resolveStep` (livrable d'abord, leçon en repli).
- **En ligne (early-stage)** : `simulation-comite-investissement-seed` (modèle = Case `cs-seed-ic`) et `these-proprietaire-pre-seed-seed` (modèle = dossier `eco-ia-appliquee`). Restent 8 milestones `a-produire`.

### 4.5quater. Mémo d'investissement annoté (`data/memos.json`)
> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client** (aucun endpoint serveur, aucun seed), même pattern que les dossiers d'écosystème et les livrables.

Un **mémo annoté** reprend un mémo d'investissement **réellement publié** et l'expose section par section, chaque passage commenté par ce que l'investisseur y fait, sur le plan de la décision. C'est la bibliothèque `/memos` (`MemoLibraryPage`) et la lecture `/memos/:slug` (`MemoPage`).

- **Type** `InvestmentMemo` dans [`client/src/content/types.ts`](../client/src/content/types.ts) ; loader [`client/src/content/memos.ts`](../client/src/content/memos.ts) (`MEMOS`, `memoById`/`memoBySlug`, `MEMO_TAG_META`). `id` → `memo-*`.
- **Format** : en-tête factuel (`company`, `fund`, `author`, `date`, `stage`, `amount?`, `outcome`, `whyItMatters`) + **provenance obligatoire** (`sourceUrl` vers l'original publié, `sourceNote` qui justifie pourquoi le document est légitimement public) + `context` (markdown). Le corps est `sections[]`, chaque section = `heading` + `blocks[]` ; un bloc = `excerpt` (extrait **court** du mémo, `isParaphrase: true` quand il est condensé plutôt que cité) + `note` (markdown : la décision à l'œuvre) + `tag` ∈ `these|marche|traction|equipe|risque|deal|concurrence|verdict`. Puis `lessons[]`, `glossaryRefs[]`, `relatedAntiPortfolioIds?`, `tags[]`.
- ⚠️ **Légal / éthique** : ne reprendre que des mémos dont la diffusion publique est documentée (`sourceNote`) ; garder les `excerpt` brefs, renvoyer à l'original. La discipline d'attribution prime sur l'exhaustivité.
- **Câblage d'une nouvelle collection** (à reproduire à l'identique pour tout pilier neuf) : barrel [`content/index.ts`](../client/src/content/index.ts), recherche [`content/search.ts`](../client/src/content/search.ts) (union `type` + push d'un hit `memo`), SEO/sitemap [`shared/routes.mjs`](../shared/routes.mjs) (`OG_IMAGE_BY_SEGMENT.memos = 'memo'`, `STATIC_ROUTES /memos`) et l'énumération des pages de détail dans [`scripts/collect-routes.mjs`](../scripts/collect-routes.mjs).
- ⚠️ **Trou de validation** : `scripts/validate-content.mjs` ne porte **pas** de schéma Zod pour `memos.json`, et `memos.json` **n'est pas** dans `MARKER_FILES` — ni la forme ni les `glossaryRefs`/marqueurs `[[..]]` ne sont vérifiés par la CI. Le seul filet est le typage TypeScript (`types.ts`) au build/dev. Un `[[slug]]` cassé dans un mémo s'affichera en texte simple sans échec de build : relire à la main.

### 4.5quinquies. Anti-portfolio (`data/antiPortfolio.json`)
> Prose soumise à la **charte de style §4.0.c**. Contenu **100 % client** (aucun endpoint serveur, aucun seed).

L'**anti-portfolio** documente des **refus d'investissement** devenus coûteux, sans biais rétrospectif : on reconstitue l'information publique disponible au moment de la décision, on défend honnêtement le refus, puis on nomme le signal manqué. Index `/anti-portfolio` (`AntiPortfolioPage`), détail `/anti-portfolio/:slug` (`AntiPortfolioEntryPage`).

- **Schéma** : le fichier est un **objet-enveloppe** `{ "patterns": AntiPortfolioPattern[], "entries": AntiPortfolioEntry[] }` (types dans `types.ts`), exposé par [`content/antiPortfolio.ts`](../client/src/content/antiPortfolio.ts) (`ANTI_PORTFOLIO`, `ANTI_PORTFOLIO_PATTERNS`, `antiPortfolioById`/`BySlug`, `antiPortfolioPatternById`). `id` d'entrée → `ap-*`.
- **`patterns[]`** : les **motifs** récurrents de refus (5 aujourd'hui : `categorie-deja-jouee`, `marche-trop-petit`, `produit-jouet`, `trop-cher`, `risque-structurel`), chacun `id`/`label`/`glyph`/`accent`/`description`/`antidote`. Une entrée s'y rattache par `patternIds[]`.
- **`entries[]`** : `company`/`title`/`subtitle`, `passes[]` (`fund`, `partner?`, `year`, `stage`), `sector`, `summary`, `quote?`, **`knownAtTheTime[]`** (`date` + `fact` — uniquement de l'information **publique et datée** disponible à l'époque), `statedReason` + `reasonIsPublic`, `missedSignal` (markdown), **`steelman`** (markdown : le meilleur argument *en faveur* du refus, ex ante — exigé, c'est la garde anti-biais), `outcome`, `costEstimate?` (toujours présenté comme une estimation, jamais une fausse précision), `takeaways[]`, `glossaryRefs[]`, `relatedMemoIds?`, `sources[]`.
- **Câblage** identique à §4.5quater (barrel, search `type: 'anti-portfolio'`, `shared/routes.mjs` OG `anti-portfolio`, `collect-routes.mjs` lisant `antiPortfolio.json.entries`).
- ⚠️ **Même trou de validation** que les mémos : `antiPortfolio.json` n'a pas de schéma Zod ni d'entrée dans `MARKER_FILES`. Relire les marqueurs à la main.

### 4.5sexies. Convictions (vue dérivée) & Carnet de décision (serveur)
Deux surfaces de la couche Intelligence qui **ne s'éditent pas comme une collection** :

- **Convictions** (`/convictions`, `ConvictionsPage`) : **aucun fichier de données propre**. [`content/convictions.ts`](../client/src/content/convictions.ts) (`allConvictions()`) **agrège** les `convictions[]` de tous les dossiers d'écosystème (statement, `horizon`, `strength` ∈ `exploratoire|moyenne|forte`, `rationale`, + provenance du dossier). Pour ajouter ou corriger une conviction, on édite le `convictions[]` du dossier concerné dans `data/ecosystems.json` (§4.5bis) — la page se recompose, triée et filtrable par degré d'assurance / horizon.
- **Carnet de décision** (`/decisions` = présentation `DecisionsIndexPage` ; `/journal` = l'outil `DecisionJournalPage`) : ce n'est **pas du contenu éditorial**, c'est une **donnée utilisateur**, comme les notes. Adossé au **serveur** : modèle Prisma `DecisionEntry` (par `userId`), type client `DecisionJournalEntry`, calibration dans [`client/src/lib/decisionJournal.ts`](../client/src/lib/decisionJournal.ts) (testée, `decisionJournal.test.ts`). Une prédiction = énoncé falsifiable + `confidence` (50–99 %) + `reviewAt` ; résolue `correct|incorrect|void` (les `void` sont exclus du calcul de calibration). `/journal` est dans `NOINDEX_SEGMENTS`. Un éditeur ne l'alimente pas : l'utilisateur la produit, migrée invité→serveur à la connexion.

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
4. `npm run db:seed` (ou `db:reset`) → vérifier le récap `✓ Seed complete { … }`. **Exception : les collections 100 % client** — dossiers d'écosystème (§4.5bis), livrables (§4.5ter), mémos (§4.5quater), anti-portfolio (§4.5quinquies) et convictions (§4.5sexies) ne sont **pas** seedés ; on valide (quand un schéma existe, cf. §4.5quater) avec `npm run validate:content` puis on vérifie la page (`/ecosystemes/<slug>`, `/memos/<slug>`…) dans l'app.
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
npm run db:setup       # prisma generate + migrate deploy + seed (à faire 1×)
npm run dev            # client (Vite ~5173) + serveur (Express :4000) en parallèle

npm run db:seed        # re-seed depuis les JSON sources (non destructif ; -- --force pour écraser le CMS)
npm run db:reset       # ⚠️ réinitialise la base puis re-seed --force (efface le CMS)
npm run content:export # rapatrie les éditions CMS dans les JSON sources (blog -> data/blog/<slug>.json)
npm run content:sync   # split + validate + db:seed --force : POUSSER les JSON édités en base (prod)
npm run split:content  # régénère les index/contenus scindés (glossaire + leçons)
npm run build          # prebuild (split → validate → sitemap) · serveur (tsc) + client (vite) · postbuild = prerender (scripts/prerender.mjs)
npm run lint           # eslint (client)
npm run test --workspace client  # Vitest client (i18n routing, safeHttpUrl, computeProfile, simulateurs, decisionJournal)
npm run test --workspace server  # tests d'intégration serveur (auth, health, profil, isolation userId)
npm run validate:glossary       # contrôle custom du glossaire final
npm run validate:content        # shape + références croisées + marqueurs [[..]]/{{..}} (memos/anti-portfolio NON couverts — §4.5quater)
npm run validate:content:strict # idem mais warnings fatals (utilisé en CI)
```

> [!NOTE]
> Un pipeline **CI** (`.github/workflows/ci.yml`) enchaîne validation contenu → lint → build → tests client → tests serveur (+ un job `drift` qui vérifie que seed et export sont inverses), sur chaque `push` `main`/`master` et chaque PR. Harnais Vitest : **client 74 tests sur 13 fichiers** (simulateurs, utils, i18n, ikigai, carnet de décision) + **serveur 11 tests sur 4 fichiers** (auth, health, profil, isolation `userId`) ; à étoffer sur les routes API restantes.

- Front-end : `http://localhost:5173` · API : `http://localhost:4000/api`.
- Variables d'environnement serveur : le loader minimal lit `server/.env` si présent (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`). Un modèle existe dans `server/.env.example`. En prod : vrai `JWT_SECRET`, cookie `secure`, et `provider = "postgresql"` dans `schema.prisma`. **En production, le serveur refuse de démarrer** si `JWT_SECRET` est trop court ou figure dans la blocklist (`getJwtSecretIssue` dans `server/src/lib/auth.ts`) — prévoyez un secret long et unique.

> [!IMPORTANT]
> Après une édition **de code ou de design**, Vite recharge à chaud (HMR) si `npm run dev` tourne. Après une édition **des JSON sources destinée à l'API**, lancez `npm run db:seed`.

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
- `questions` : le test scoré qui alimente `computeProfile` ; `profiles` (7) : les profils d'apprentissage cibles de ce scoring (reliés aux archétypes et aux parcours via `profileParcours.json`).
- `myths` (3) : idées reçues sur le VC, déboulonnées dans l'onboarding par `onboarding/MythCard.tsx`. Le test d'orientation lui-même est porté par `onboarding/OrientationTest.tsx`.

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

La transition vers la **VC Intelligence Platform** repose sur un cadre d'exécution strict en 10 phases, documenté dans [`docs/STRATEGIE-vc-intelligence.md`](../docs/STRATEGIE-vc-intelligence.md). 

> [!WARNING]
> **Risques Techniques Majeurs :**
> - **Version Control (T1)** : Baseline Git validée le 2026-06-11 (`master` suit `origin/master`, commit initial `e5b37e0`). Avant toute modification structurante, vérifier un `git status` propre et figer un commit de référence.
> - **Divergence JSON/CMS (T2)** : L'extension du CMS est gelée pour les nouveaux piliers. L'authoring (thèses, atlas) se fait d'abord dans les JSON sources de `/data`. Ne pas accumuler de la dette d'état dans SQLite.
> - **Validation (T3/T8)** : Ne jamais ajouter de contenu sans schéma Zod et validation pre-build (`validate-content.mjs`).
> - **Fausse Intelligence (T4)** : Ne pas simuler de tableaux de bord de données vides ou fausses. Si l'information n'est pas "decision-grade", on ne publie pas.
> - **Découvrabilité (T5/T7)** : règle tenue — `ecosystems`, `memos`, `anti-portfolio`, `convictions` et le carnet de décision sont câblés dans la recherche client ([`content/search.ts`](../client/src/content/search.ts), union `type` + `searchLocal`), le SEO et le sitemap ([`shared/routes.mjs`](../shared/routes.mjs) : `STATIC_ROUTES`, `OG_IMAGE_BY_SEGMENT`, `NOINDEX_SEGMENTS` ; [`scripts/collect-routes.mjs`](../scripts/collect-routes.mjs) pour les pages de détail), sans briser les anciennes routes (redirect `/cases` → Bibliothèque, aiguilleur `ParcoursOrSubjectPage`). **Toute nouvelle collection doit refaire ce câblage** (cf. checklist §4.5quater).
> - **Dette de traduction (T6)** : Le développement de la plateforme bilingue complète (i18n) est repoussé ; la priorité est le *FR-first* avec la traduction différée sur les seuls pilotes stratégiques.

---

> [!TIP]
> Pour bien démarrer une contribution : (1) lisez `types.ts` + `content.ts` pour le type que vous touchez, (2) éditez le JSON source concerné (`data/blog/<slug>.json` pour une analyse), (3) `npm run db:seed`, (4) vérifiez en invité **et** connecté. Pour le design, partez toujours de `tokens.css` et des composants `ornaments/` plutôt que de coder des couleurs en dur.
