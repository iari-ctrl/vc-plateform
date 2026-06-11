# VC Premium Experience

> Une plateforme d’intelligence VC comprendre le capital-risque, tester son alignement avec le métier,pour apprendre, analyser, cartographier et affiner son jugement d’investissement. 


Une plateforme **full-stack** d'initiation, d'apprentissage et d'approfondissement du capital-risque. Elle commence par une **expérience d'introspection** inspirée de l'ikigai, puis recommande un parcours d'apprentissage personnalisé — sans jamais imposer de mur d'authentification ni verrouiller le moindre chapitre.

> « L'ikigai n'est pas un point fixe à atteindre. C'est un centre de gravité qui se déplace avec toi. Le capital-risque, par sa temporalité longue — 10 ans par fonds — force précisément à se demander : où sera ce centre dans une décennie ? »

---

## ✦ Principes fondateurs

- **Liberté responsable.** Aucun chapitre n'est bloqué, aucune progression n'est imposée. On peut tout explorer en invité.
- **Introspection d'abord.** L'onboarding est un véritable **cahier d'introspection** ikigai (diagramme à 13 zones, deux niveaux de lecture *Découverte / Avancé*, trois archétypes, sept questions libres) qui précède le catalogue : *pourquoi* avant *quoi*. Il conserve le test d'orientation scoré et le profil d'apprentissage.
- **Premium éditorial.** Entre école privée, memo d'investissement, knowledge base et carnet personnel — jamais un dashboard SaaS générique.
- **Le compte est optionnel et utile.** Il ne sert qu'à *sauvegarder* : progression, notes, citations, favoris, profil, synchronisés entre appareils.
- **Bilingue par conception (FR/EN).** Le routing localisé `/fr` `/en` est en place (Phase 1) ; le français reste la langue par défaut, avec repli FR pour les contenus EN non encore traduits. Voir [`i18n_architecture_FR-EN.md`](i18n_architecture_FR-EN.md).

---

## ✦ Stack technique

| Couche | Technologies |
| --- | --- |
| **Front-end** | React 19 · Vite 6 · TypeScript · Tailwind CSS v3 · React Router 7 · lucide-react |
| **Back-end** | Node · Express 4 · TypeScript · Prisma 5 · JWT (cookie httpOnly) · zod |
| **Base de données** | SQLite (prototype) — interchangeable avec Postgres en changeant le `datasource` Prisma |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

Le **contenu canonique** (parcours, cours, leçons, dictionnaire, études de cas, analyses, simulateurs, ikigai) vit dans `/data/*.json`. Il est **partagé** : le client le bundle pour fonctionner hors-ligne / en invité, et le serveur l'utilise pour *seeder* la base de données.

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
| `npm run db:setup` | `prisma generate` + `db push` + seed |
| `npm run db:reset` | Réinitialise la base puis re-seed |
| `npm run build` | Build serveur (tsc) puis client (vite) |
| `npm run test --workspace client` | Tests Vitest (routing i18n, `safeHttpUrl`, `computeProfile`) |
| `npm run validate:content` | Vérifie que tous les liens dictionnaire `[[..]]` / `{{..}}` du contenu résolvent |
| `npm run validate:glossary` | Contrôle custom du glossaire final (slugs uniques, `id === slug`, liens, aliases) |

> Une **CI** (`.github/workflows/ci.yml`) enchaîne lint + build + tests à chaque push.

### État vérifié

Audit local courant (juin 2026) :

- `npm run validate:content` : OK, avec warnings éditoriaux (23/62 leçons canon `data/lessons.json` sans quiz) ;
- `npm run lint` : OK, 0 erreur, 15 warnings Fast Refresh ;
- `npm run build` : OK, build serveur + client ;
- pas de dossier `.git` dans `vc-premium-platform` à cette date, malgré un `.gitignore` présent.

Évolutions depuis (2026-06-09) — **à valider en local**, le sandbox d'outillage ne pouvant pas monter le dossier « VC SITE » (espace dans le nom) :

- **i18n Phase 1** : routing localisé `/fr` `/en` (`client/src/i18n/`), redirection racine crawler-safe, sélecteur FR/EN ;
- **Sécurité / qualité** : auth cookie-only, mot de passe ≥ 8 + rate-limit auth, CORS dev-only, markdown sûr (`safeHttpUrl`), Error Boundary au niveau route, tokens `--error`/`--success` ;
- **Tests** : harnais Vitest robuste (7 fichiers, 25 tests) + CI ;
- **Couche Parcours branchée au client** : la **page `/paths` réunit la carte interactive (l'Atlas) et le catalogue des parcours** (trajectoires par objectif, étagères par famille, bandeau « Ton parcours » issu de l'ikigai) ; `/paths/:slug` est la « carte de voyage » d'un parcours (étapes typées cœur/bonus/pratique/respiration, curseur temps, jalon, bloc interactif de pré-requis liés au glossaire). La **Bibliothèque (`/bibliotheque`) présente les cours**, rangés par rayon (les 9 anciens *paths* deviennent ces rayons thématiques). Loader `client/src/content/parcours.ts`, pages `ParcoursPage` / `ParcoursDetailPage` / `ParcoursOrSubjectPage`. Voir [`docs/parcours-apprentissage-conception.md`](docs/parcours-apprentissage-conception.md).
- **Contenu** : pipeline d'authoring `docs/parcours/` → `data/parcours/*.lessons.json` (2 parcours rédigés, dont le registre « entretien Analyst »). Les leçons drop-in (`ld-*`/`lea-*`) sont **servies côté client** par cohabitation (concaténées dans `LESSONS` via `content/lessons.ts`) et les 2 parcours phares pointent dessus. **Pas encore** fusionnées dans `data/lessons.json` ni seedées en base : côté **API/DB** elles restent absentes — le client les sert via le fallback bundle, donc `npm run db:seed` reste à faire pour aligner le serveur.
- **Cours Power Law & Monte Carlo** : nouveau cours canonique `c-power-law-portfolio` dans le rayon Portfolio, avec 4 leçons (`lpl-*`) qui expliquent moyenne vs médiane, pertinence de Monte Carlo, moteur du simulateur Power Law et lecture TVPI/concentration/fund returner. Le simulateur Power Law référence maintenant ces leçons en premier.

---

## ✦ Architecture

```
vc-premium-platform/
├── data/                     # Contenu canonique (JSON) — source de vérité partagée
│   ├── paths.json  courses.json  lessons.json  glossary.json
│   ├── caseStudies.json  blog.json  simulators.json  ikigai.json
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
    ├── prisma/schema.prisma  # 15 modèles (voir ci-dessous)
    ├── prisma/seed.ts        # peuple la base depuis /data
    └── src/
        ├── routes/           # auth · content · me · admin · search
        └── lib/              # db · auth (JWT) · env · content
```

Le build client est découpé par routes et par collections de contenu : l'entrée applicative pèse environ **100 kB** et le vendor React environ **232 kB** ; les collections lourdes (`lessons`, `glossary`, `ikigai`) restent dans des chunks séparés.

### Pages (client)

`Home` · `Onboarding` (ikigai) · `Résultat du profil` · `Dashboard` · `Parcours` (Atlas + catalogue par familles, sur `/paths`) · `Détail parcours` (carte de voyage, sur `/paths/:slug`) · `Bibliothèque` (les cours, lectures et études de cas, sur `/bibliotheque`) · `Détail rayon` · `Cours` · `Leçon` (lecture active) · `Dictionnaire` · `Études de cas` (détail) · `Simulateurs` (liste + 8 calculateurs) · `Analyses` (blog liste + article) · `Notes & favoris` · `Profil` · `Recherche` · `Administration (CMS)`.

> `/paths/:slug` route intelligemment : un slug de parcours → la carte de voyage ; tout autre slug (liens legacy des sujets) → l'ancien détail de rayon. Aucun lien existant n'est cassé.

### Modèle de données (Prisma)

`User` · `Profile` · `OnboardingAnswer` · `Note` · `Bookmark` · `Progress` · `LearningPath` · `Course` · `Lesson` · `Quiz` · `GlossaryTerm` · `CaseStudy` · `BlogPost` · `Simulator` · `Tag`.

Le contenu éditorial est stocké en colonnes indexées (titre, slug, catégorie, `searchText`) + un blob JSON `data` qui porte l'objet complet — un compromis pragmatique pour SQLite qui reste requêtable et facilement migrable.

### API REST (extrait)

| Méthode | Endpoint | Auth |
| --- | --- | --- |
| `POST` | `/api/auth/register` · `/login` · `/logout` | — |
| `GET` | `/api/auth/me` | cookie |
| `GET` | `/api/content/paths` · `/paths/:slug` · `/courses/:slug` · `/lessons/:slug` | public |
| `GET` | `/api/content/glossary` · `/case-studies` · `/blog` · `/simulators` · `/tags` | public |
| `GET` | `/api/search?q=` | public |
| `GET/PUT` | `/api/me/profile` · `GET/POST/DELETE /me/notes` · `/me/bookmarks` · `/me/progress` | requise |
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

## ✦ Vers la production

- **Décision d'architecture préalable :** trancher le **mode de rendu** (CSR actuel vs prérendu/SSG). Analyse menée : hybride recommandé — SSG/ISR pour l'éditorial (SEO, partage social), CSR pour l'app authentifiée. Le SEO concret (prérendu, OpenGraph par page, `hreflang` i18n) en découle et reste différé au pré-lancement.
- Remplacer `provider = "sqlite"` par `postgresql` dans `prisma/schema.prisma` et ajuster `DATABASE_URL`. Pour l'i18n, ajouter `locale` aux modèles de contenu + `@@unique([slug, locale])` (i18n Phase 4).
- Définir un vrai `JWT_SECRET` et passer le cookie en `secure: true` derrière HTTPS ; finaliser le durcissement (helmet, CSP/HSTS, **corriger la garde JWT**, contraste de l'or).
- Servir le `client/dist` derrière un CDN ; héberger l'API séparément (Render, Fly, Railway…) ou en serverless.
```
