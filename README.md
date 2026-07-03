# VC Premium Experience

> Une plateforme d'intelligence VC pour analyser les écosystèmes, suivre les convictions, étudier les décisions et structurer sa progression dans le capital-risque.


Une plateforme **full-stack** d'intelligence VC, enrichie par une couche de formation. Elle articule désormais trois piliers navigables : **Intelligence VC** (dossiers, convictions, analyses, décisions, méthode), **Formation** (parcours, bibliothèque par rayons, dictionnaire) et **Workspace** (tableau de bord, notes, journal de décisions). Le compte reste optionnel : il sert à sauvegarder la progression, les notes, les citations, les favoris et le profil.

> « L'ikigai n'est pas un point fixe à atteindre. C'est un centre de gravité qui se déplace avec toi. Le capital-risque, par sa temporalité longue — 10 ans par fonds — force précisément à se demander : où sera ce centre dans une décennie ? »

---

## ✦ Documentation

- `docs/` porte la documentation pérenne : stratégie, décisions d'architecture, ADR i18n et documents de conception destinés à rester des références maintenues.
- `Suivis/` est un **journal de suivi — peut diverger du code** : bilans datés, audits, scoring, notes de passes successives et procédures. Chaque fichier y porte désormais un encart de statut daté avec son périmètre et les sections à arbitrer.
- En cas de doute, l'état réel se vérifie dans `client/`, `server/`, `data/`, `shared/routes.mjs` et les scripts du `package.json`.

---

## ✦ Principes fondateurs

- **Liberté responsable.** Aucun chapitre n'est bloqué, aucune progression n'est imposée. On peut tout explorer en invité.
- **Intelligence d'abord, formation en soutien.** La première lecture du produit passe par les dossiers, convictions, analyses, décisions et méthodes. L'onboarding ikigai reste disponible pour personnaliser les parcours, mais il ne porte plus seul la promesse du site.
- **Premium éditorial.** Entre école privée, memo d'investissement, knowledge base et carnet personnel — jamais un dashboard SaaS générique.
- **Style sobre et naturel.** Toute rédaction du site (leçons, glossaire, analyses, dossiers d'écosystème, parcours, simulateurs) suit une **charte de style transverse non négociable** : prose fluide, registre d'analyste, pas de tics d'IA ni de survente. Source canonique : le skill `.claude/skills/ecosystemes/SKILL.md` (section « Writing style ») + la mémoire `style-redaction-naturel` ; résumé opérationnel dans [`Suivis/Manuel_Architecture_Edition.md` §4.0.c](Suivis/Manuel_Architecture_Edition.md).
- **Le compte est optionnel et utile.** Il ne sert qu'à *sauvegarder* : progression, notes, citations, favoris, profil, synchronisés entre appareils.
- **Bilingue par conception (FR/EN).** Le routing localisé `/fr` `/en` est en place (Phase 1) ; le français reste la langue par défaut, avec repli FR pour les contenus EN non encore traduits. Le sélecteur FR/EN est **masqué** tant que l'anglais n'est pas livré (drapeau `EN_ENABLED = false` dans `client/src/i18n/config.ts`) — sous `/en`, `<html lang>` reste `fr` pour ne pas mentir aux lecteurs d'écran / crawlers. Voir [`docs/i18n_architecture_FR-EN.md`](docs/i18n_architecture_FR-EN.md).

---

## ✦ Stack technique

| Couche | Technologies |
| --- | --- |
| **Front-end** | React 19 · Vite 6 · TypeScript · Tailwind CSS v3 · React Router 7 · lucide-react |
| **Back-end** | Node · Express 4 · TypeScript · Prisma 5 · JWT (cookie httpOnly) · zod |
| **Base de données** | SQLite (prototype) — interchangeable avec Postgres en changeant le `datasource` Prisma |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

Le **contenu canonique** (parcours, cours, leçons, dictionnaire, études de cas, livrables de parcours, analyses, anti-portfolio, mémos annotés, simulateurs, ikigai) vit dans les JSON sources de `/data` : fichiers plats (`data/*.json`) et dossiers de collection comme `data/blog/*.json`. Il est **partagé** : le client le bundle pour fonctionner hors-ligne / en invité, et le serveur l'utilise pour *seeder* la base de données.

---

## ✦ Démarrage rapide

```bash
# 1. Installer toutes les dépendances (workspaces client + server)
npm install

# 2. Générer le client Prisma, créer la base SQLite et la peupler
npm run db:setup

# 3. Lancer le client (Vite) et le serveur (Express) ensemble
npm run dev
```

- Front-end : http://localhost:5173 (ou le premier port libre)
- API : http://localhost:4000/api

### Comptes de démonstration

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Administrateur (CMS) | `admin@vcpx.io` | `admin1234` |
| Apprenant | `demo@vcpx.io` | `demo1234` |

> L'app est **entièrement utilisable sans compte** : en invité, profil, notes, favoris et progression sont stockés dans le `localStorage` et **migrés automatiquement** vers le serveur à la première connexion.

### Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Client + serveur en parallèle |
| `npm run dev:client` / `npm run dev:server` | Un seul des deux |
| `npm run db:setup` | `prisma generate` + `prisma migrate deploy` + seed |
| `npm run db:seed` (`-- --force`) | (Re)peuple la base ; non destructif pour le contenu éditable sauf `--force` |
| `npm run db:reset` | Réinitialise la base puis re-seed |
| `npm run content:export` | Réexporte les éditions DB (glossaire, blog, cas) vers les JSON sources (`data/blog/<slug>.json` pour les analyses) |
| `npm run split:content` | Régénère les index/contenus scindés (`split:glossary` + `split:lessons`) |
| `npm run build` | Build serveur (tsc) puis client (vite) ; le hook `postbuild` enchaîne le **prérendu statique** |
| `npm run prerender` | Prérend les routes publiques en HTML statique (`client/dist/<route>/index.html`) — lancé automatiquement après `build` |
| `npm run test --workspace client` | Tests Vitest client (routing i18n, `safeHttpUrl`, `computeProfile`, simulateurs…) |
| `npm run test --workspace server` | Tests d'intégration serveur (auth, profil, isolation par `userId`) |
| `npm run validate:content` | Vérifie que tous les liens dictionnaire `[[..]]` / `{{..}}` du contenu résolvent |
| `npm run validate:glossary` | Contrôle custom du glossaire final (slugs uniques, `id === slug`, liens, aliases) |

> Workflow GitHub actif : `.github/workflows/deploy-pages.yml` déploie le **frontend** sur GitHub Pages à chaque push sur `master`. Il installe les dépendances, lance `split:content`, build le client avec `--base=/vc-plateform/` et `VITE_API_DISABLED=true`, puis publie `client/dist`. Il ne remplace pas une CI complète validation → lint → build root → tests client/serveur.

### État vérifié

Audit local courant (2026-06-28 ; build/prérendu complet dernier contrôle consigné le 2026-06-26) :

- Dernier `npm run build` consigné : OK, avec `split:content`, `validate:content`, `generate:sitemap`, build serveur, build client, puis `postbuild` → **prérendu statique** (573 routes FR écrites sous `client/dist/<route>/index.html`, ~70 s) ;
- `npm run validate:content` via `prebuild` : OK, 22 parcours · 9 rayons · 16 cours · 66 leçons · 374 termes · 6 études de cas · 2 livrables · 8 articles · 31 dossiers d'écosystème · 9 simulateurs ;
- `npm run validate:glossary` : OK, 374 termes ;
- `npm run lint` : OK, 0 erreur, 4 warnings structurels `react-refresh/only-export-components` sur les Context ;
- `npm run test --workspace client` : OK, 13 fichiers / 74 tests ;
- `npm run test --workspace server` : OK, 4 fichiers / 11 tests ;
- sitemap régénéré : les index `/intelligence`, `/convictions`, `/decisions`, `/methode`, `/livrables` sont publiés en FR/EN.

Recommandations d'audit résolues (lot « repo hygiene », 2026-06-12) :

- **Déploiement GitHub Pages** : le workflow réel est `.github/workflows/deploy-pages.yml` ; il déploie le frontend statique sur `gh-pages` depuis `master`, avec l'API désactivée côté bundle (`VITE_API_DISABLED=true`) pour fonctionner sans backend.
- **Crash async Express 4** : wrapper `ah()` (`server/src/lib/async-handler.ts`) appliqué à **tous** les handlers async (auth, content, me, admin, search) — une rejection est forwardée à l'error-handler central (→ 500) au lieu de tuer le process.
- **Seed non destructif** : `server/prisma/seed.ts` ne réécrit plus le contenu éditable (glossaire, blog, études de cas) ; create-if-absent par défaut, écrasement uniquement avec `npm run db:seed -- --force`. Sens inverse DB→JSON sources via `npm run content:export` (`data/blog/*.json` pour le blog).
- **Garde JWT durcie** : `getJwtSecretIssue()` vérifie une longueur minimale + une liste de valeurs interdites en production (fail-fast au démarrage).
- **`clearProfile` côté serveur** : `DELETE /me/profile` supprime profil + réponses d'onboarding ; plus de résurrection de l'ancien ikigai au reload.
- **`apiUp` re-sondé** : l'API qui démarre après le client (ou redevient joignable) est détectée — re-ping toutes les 15 s tant qu'elle est down, plus sur `window focus` / `online` ; restauration de session avant bascule de `apiUp` (`client/src/context/AuthContext.tsx`).
- **Surface réduite** : `attachUser` retiré du global (monté sur `/me`, `/admin`, `/auth/me` seulement) ; rate-limit ajouté sur `/api/search` ; sélecteur EN masqué (`EN_ENABLED=false`).

- **i18n Phase 1** : routing localisé `/fr` `/en` (`client/src/i18n/`), redirection racine crawler-safe, sélecteur FR/EN **présent mais masqué** jusqu'à la traduction du chrome et du contenu ;
- **Sécurité / qualité** : auth cookie-only, mot de passe ≥ 8 + rate-limit auth, CORS dev-only, markdown sûr (`safeHttpUrl`), Error Boundary au niveau route, tokens `--error`/`--success` ;
- **Tests** : harnais Vitest (client 13 fichiers / 74 tests · serveur 4 fichiers / 11 tests) ;
- **IA en 3 piliers (2026-06-26)** : la navigation publique est réorganisée autour d'**Intelligence VC**, **Formation** et **Workspace**. Les nouvelles pages-index `/intelligence`, `/convictions`, `/decisions`, `/methode` et `/livrables` agrègent les contenus existants sans déplacer les slugs de détail.
- **Couche Parcours branchée au client** : la **page `/paths` réunit la carte interactive (l'Atlas) et le catalogue des parcours** (trajectoires par objectif, étagères par famille, bandeau « Ton parcours » issu de l'ikigai) ; `/paths/:slug` reste l'aiguilleur parcours/rayon. La **Bibliothèque (`/bibliotheque`) présente désormais les 9 rayons thématiques comme ossature**, puis le catalogue complet des cours, lectures et cas. Loader `client/src/content/parcours.ts`, pages `ParcoursPage` / `PathDetailPage` / `ParcoursOrSubjectPage`.
- **Parcours en accès libre, avec backlog visible** : aucune progression n'est bloquée, mais 8 étapes restent marquées `a-produire` dans `data/parcours.json` et s'affichent comme « bientôt » tant qu'elles ne résolvent ni vers une leçon ni vers un livrable.
- **Contenu** : pipeline d'authoring `docs/parcours/` → `data/parcours/*.lessons.json` (3 registres drop-in actifs : Découverte VC, lever son fonds LP, standard français). Les leçons drop-in (`ld-*`, `llp-*`, `lts-*`) sont **servies côté client** : `scripts/split-lessons.mjs` les fusionne avec `data/lessons.json` dans l'index/bodies consommés par `content/lessons.ts` (cf. « Performance » ci-dessous). Elles sont aussi **seedées côté serveur** via `content.allLessons()` dans `server/src/lib/content.ts` / `server/prisma/seed.ts`, ce qui aligne le bundle client, l'API et la base locale sur 66 leçons disponibles.
- **Cours Power Law & Monte Carlo** : nouveau cours canonique `c-power-law-portfolio` dans le rayon Portfolio, avec 4 leçons (`lpl-*`) qui expliquent moyenne vs médiane, pertinence de Monte Carlo, moteur du simulateur Power Law et lecture TVPI/concentration/fund returner. Le simulateur Power Law référence maintenant ces leçons en premier.
- **Performance / bundle** : le glossaire **et** les leçons sont découpés en un index léger (eager, hot path : popovers, recherche, liens) et un chunk lourd lazy (définitions / corps de leçon), via `scripts/split-glossary.mjs` + `scripts/split-lessons.mjs` (câblés dans `predev`/`prebuild` par `npm run split:content`). Le chunk eager `lessons` passe de ~176 kB à ~32 kB ; les corps (~143 kB) ne sont chargés que par le lecteur de leçon.
- **Espace « Décortiquer un écosystème » (2026-06-13)** : `/ecosystemes` réunit des **analyses signées** sur des géographies, secteurs et thèses transverses. Dossiers vivants **arborescents** (`parentId` + `order`) avec thèse falsifiable, **convictions datées à degré d'assurance explicite** (exploratoire / moyenne / forte), signaux directionnels et **figures natives** (graphiques/schémas en SVG/HTML theme-aware, 5 types, sans asset ni librairie de charting). **100 % client** (`data/ecosystems.json`, aucune table serveur). 31 dossiers au lancement (3 racines + 28 sous-dossiers). Méthodo d'authoring : skill `.claude/skills/ecosystemes/SKILL.md`.

---

## ✦ Architecture

```
vc-premium-platform/
├── data/                     # Contenu canonique (JSON) — source de vérité partagée
│   ├── paths.json  courses.json  lessons.json  glossary.json
│   ├── generated/            # glossaire/leçons scindés (index léger + défs/corps lazy) — GÉNÉRÉ
│   ├── sources/              # registre d'ingestion du glossaire (canonical-glossary.json)
│   ├── caseStudies.json  deliverables.json  simulators.json  ikigai.json
│   ├── blog/                 # analyses : un fichier JSON par article (`<slug>.json`)
│   ├── ecosystems.json       # dossiers « Décortiquer un écosystème » (arbre parentId/order, 100% client)
│   ├── antiPortfolio.json  memos.json  # Intelligence VC : anti-portfolio (patterns + entrées) + mémos annotés — 100% client
│   #   deliverables.json     # livrables de parcours (/livrables) : brief + gabarit + grille + modèle, 100% client
│   ├── parcours.json  parcours.en.json  parcoursConfig.json  profileParcours.json
│   └── parcours/             # fiches de leçons drop-in par parcours (*.lessons.json)
│
├── docs/parcours/            # conception + rédaction des parcours (Markdown)
│
├── client/                   # SPA React + Vite
│   └── src/
│       ├── i18n/             # routing localisé /fr /en (config · routing · guards · LocaleSwitcher)
│       ├── content/          # types + modules par collection JSON + recherche locale lazy
│       ├── context/          # ThemeProvider · AuthProvider · UserDataProvider · UIProvider
│       ├── hooks/            # useApiData (API-first, fallback bundlé)
│       ├── lib/              # api · storage · markdown · ikigai · utils · seo
│       ├── components/       # ui · chrome · ornaments · cards · reading · ikigai · simulators
│       ├── pages/            # pages applicatives lazy-loadées + admin/
│       └── styles/           # tokens.css (design tokens) + global.css
│
└── server/                   # API Express + Prisma
    ├── prisma/schema.prisma  # 16 modèles (voir ci-dessous)
    ├── prisma/seed.ts        # peuple la base depuis /data
    └── src/
        ├── routes/           # auth · content · me · admin · search
        └── lib/              # db · auth (JWT) · env · content · async-handler (wrapper async Express 4)
```

Le build client est découpé par routes et par collections de contenu : le vendor React pèse environ **232 kB** ; les collections lourdes (`lessons`, `glossary`, `ikigai`) restent dans des chunks séparés. Le glossaire et les leçons sont en outre **scindés index/contenu** : seul l'index léger (`*.index.json`) est chargé sur le hot path, les définitions et les corps de leçon (`glossary.defs.json` / `lessons.bodies.json`) arrivent en chunks lazy à la demande.

### Pages (client)

Organisées autour des trois piliers, plus les pages transverses :

- **Intelligence VC** — `Intelligence` (index) · `Convictions` · `Décisions` (index) · `Méthode` · `Anti-portfolio` (+ détail d'entrée, sur `/anti-portfolio`) · `Memos` (bibliothèque + détail, sur `/memos`) · `Analyses` (blog : liste, article, scrollytelling) · `Écosystèmes` (index + dossier, sur `/ecosystemes` et `/ecosystemes/:slug`) · `Livrables` (index + détail « à produire » : brief + gabarit + grille + modèle, sur `/livrables` et `/livrables/:slug`) · `Études de cas` (détail).
- **Formation** — `Parcours` (Atlas + catalogue par familles, sur `/paths`) · `Détail parcours` (carte de voyage, sur `/paths/:slug`) · `Bibliothèque` (cours, lectures et études de cas, sur `/bibliotheque`) · `Détail rayon` · `Cours` · `Leçon` (lecture active) · `Dictionnaire` · `Simulateurs` (liste + 9 calculateurs).
- **Workspace** — `Dashboard` · `Journal de décisions` · `Notes & favoris`.
- **Transverses** — `Home` · `Splash` · `Onboarding` (ikigai + test d'orientation) · `Résultat du profil` · `Profil` · `Recherche` · `Administration (CMS)` · `Design System`.

> `/paths/:slug` route intelligemment : un slug de parcours → la carte de voyage ; tout autre slug (liens legacy des sujets) → l'ancien détail de rayon. Aucun lien existant n'est cassé.

### Modèle de données (Prisma)

`User` · `Profile` · `OnboardingAnswer` · `Note` · `Bookmark` · `Progress` · `DecisionEntry` · `LearningPath` · `Course` · `Lesson` · `Quiz` · `GlossaryTerm` · `CaseStudy` · `BlogPost` · `Simulator` · `Tag`.

Le contenu éditorial est stocké en colonnes indexées (titre, slug, catégorie, `searchText`) + un blob JSON `data` qui porte l'objet complet — un compromis pragmatique pour SQLite qui reste requêtable et facilement migrable.

### API REST (extrait)

| Méthode | Endpoint | Auth |
| --- | --- | --- |
| `POST` | `/api/auth/register` · `/login` · `/logout` | — |
| `GET` | `/api/auth/me` | cookie |
| `GET` | `/api/content/paths` · `/paths/:slug` · `/courses/:slug` · `/lessons/:slug` | public |
| `GET` | `/api/content/glossary` · `/case-studies` · `/blog` · `/simulators` · `/tags` | public |
| `GET` | `/api/search?q=` | public |
| `GET/PUT` | `/api/me/profile` · `GET/POST/DELETE /me/notes` · `/me/bookmarks` · `/me/progress` · `/me/decisions` (journal de décisions) | requise |
| `*` | `/api/admin/glossary` · `/blog` · `/case-studies` · `/stats` | admin |

---

## ✦ Système de design

Palette éditoriale de luxe — **feuille d'or doré** (`#C5A85C`), **bleu marine profond**, **prune velours** sur **parchemin**, avec un **mode sombre** complet. Tout passe par des *design tokens* CSS (`src/styles/tokens.css`) et l'échelle typographique de `tailwind.config.ts`. Animations discrètes (révélations au scroll, transitions soignées), respect de `prefers-reduced-motion`, focus visibles, navigation clavier (⌘K pour la recherche globale).

---

## ✦ Choix d'UX notables

- **Lecture active** : sélectionnez un passage dans une leçon, une étude de cas ou un article pour le **surligner** ou le **citer** directement dans votre carnet.
- **Dictionnaire vivant** : les termes du venture sont liés *inline* dans les leçons (`[[slug|libellé]]`) et renvoient au dictionnaire et aux cours associés.
- **Simulateurs réels** : dilution, pre/post-money, ownership, waterfall, fund returns (DPI/TVPI/MOIC), scénario de levée, management fees et Power Law/Monte Carlo — tous calculés côté client, en temps réel. Ils intègrent désormais des explications pédagogiques interactives, le dictionnaire vivant, et utilisent les formules standard de l'industrie.
- **CMS** : l'espace `/admin` (compte admin) crée et modifie dictionnaire, analyses et études de cas — les changements apparaissent immédiatement sur le site public.

---

## ✦ Prérendu statique (SEO & partage social)

Le site reste une SPA : `client/index.html` ne porte que des métadonnées génériques et les balises par page (`<title>`, `og:*`, `twitter:*`, `canonical`, `hreflang`) sont injectées au runtime par `usePageMeta` (`client/src/lib/seo.ts`) dans un effet React. Les scrapers de partage social (Open Graph/Twitter, LinkedIn, Slack, Discord) et nombre de crawlers **n'exécutent pas le JavaScript** : sans prérendu, tout partage retombe sur la carte générique.

`scripts/prerender.mjs` corrige ce point **après le build** : il sert le `client/dist` produit par Vite, pilote un Chromium headless (Puppeteer) sur chaque route publique, attend la fin de l'hydratation (donc `usePageMeta` exécuté, métadonnées présentes dans le `<head>`) puis écrit le DOM rendu dans `client/dist/<route>/index.html`. Un hébergeur statique sert alors un `<head>` complet (et un corps déjà rendu) aux scrapers et crawlers sans JS, pendant que la SPA continue de s'hydrater par-dessus pour les visiteurs.

```bash
# Lancé automatiquement par le hook postbuild ; sinon, après un build client :
VITE_SITE_URL=https://vcpx.io npm run build          # build + prérendu de toutes les routes
VITE_SITE_URL=https://vcpx.io npm run prerender      # prérendu seul (dist déjà construit)

# Itérer sur une route précise (vérification) :
node scripts/prerender.mjs --filter=/fr/blog/voir-comme-un-etat --limit=1
node scripts/prerender.mjs --concurrency=8            # parallélisme (défaut 6)
```

- **Liste des URLs.** Même énumération que le sitemap (`scripts/collect-routes.mjs` : pages statiques de `shared/routes.mjs` + collections dérivées de `data/`). Les `NOINDEX_SEGMENTS` de `shared/routes.mjs` sont exclus ; l'anglais n'est prérendu que si `EN_ENABLED` est activé dans `client/src/i18n/config.ts`.
- **Domaine canonique.** Builder avec `VITE_SITE_URL` (ou `SITE_URL`/`CLIENT_ORIGIN`) défini pour que `canonical`/`og:url` portent le domaine de production. À défaut, le script réécrit l'origine de crawl vers le domaine résolu (fallback `https://vcpx.io`), mais définir la variable au build reste la voie propre.
- **Hébergement.** Le CDN/host statique doit servir `client/dist/<route>/index.html` pour l'URL correspondante (clean URLs / auto-index), et conserver `client/dist/index.html` comme repli SPA pour les routes non prérendues (espace authentifié, `/` qui redirige côté client).

---

## ✦ Vers la production

- **Mode de rendu — tranché.** SPA (CSR) + **prérendu statique des routes publiques au build** (cf. section « Prérendu statique » ci-dessus) : OpenGraph/`canonical`/`hreflang` par page sont désormais présents dans le HTML statique pour le SEO et le partage social, sans migration SSG. L'app authentifiée reste en CSR.
- Remplacer `provider = "sqlite"` par `postgresql` dans `prisma/schema.prisma` et ajuster `DATABASE_URL`. Pour l'i18n, ajouter `locale` aux modèles de contenu + `@@unique([slug, locale])` (i18n Phase 4).
- Définir un vrai `JWT_SECRET` (la garde production exige déjà longueur min. + blocklist) et passer le cookie en `secure: true` derrière HTTPS ; `helmet` est déjà appliqué (`server/src/app.ts`), reste à finaliser le durcissement (CSP/HSTS, contraste de l'or).
- Servir le `client/dist` derrière un CDN ; héberger l'API séparément (Render, Fly, Railway…) ou en serverless.
```
