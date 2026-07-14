# VC Premium Experience

> Une plateforme d'intelligence VC pour analyser les écosystèmes, suivre les convictions, étudier les décisions et structurer sa progression dans le capital-risque.

Une plateforme **statique** d'intelligence VC, enrichie par une couche de formation. Elle articule trois piliers navigables : **Intelligence VC** (dossiers, convictions, analyses, décisions, méthode), **Formation** (parcours, bibliothèque par rayons, dictionnaire) et **Workspace** (tableau de bord, notes, journal de décisions). Toutes les données utilisateur (profil, notes, citations, favoris, progression) sont stockées localement dans le navigateur.

> « L'ikigai n'est pas un point fixe à atteindre. C'est un centre de gravité qui se déplace avec toi. Le capital-risque, par sa temporalité longue — 10 ans par fonds — force précisément à se demander : où sera ce centre dans une décennie ? »

---

## ✦ Documentation

- [`PRODUCT.md`](PRODUCT.md) fixe le contrat produit : registre, intention, anti-références, principes et cible d'accessibilité.
- `docs/` porte la documentation **de référence maintenue** : [`ARCHITECTURE_EDITION.md`](docs/ARCHITECTURE_EDITION.md), [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md), [`STRATEGIE-vc-intelligence.md`](docs/STRATEGIE-vc-intelligence.md) et [`parcours/README.md`](docs/parcours/README.md). Les documents supersédés sont isolés sous `docs/archive/`.
- `Suivis/` porte le **suivi vivant** : [`ETAT.md`](Suivis/ETAT.md) (état vérifié, compteurs, risques, priorités), [`JOURNAL.md`](Suivis/JOURNAL.md) (journal daté) et [`PROCEDURE_PUSH.md`](Suivis/PROCEDURE_PUSH.md) (procédure de sauvegarde Git ; la publication est reportée).
- En cas de doute, l'état réel se vérifie dans `client/`, `data/`, `shared/routes.mjs` et les scripts du `package.json`.

---

## ✦ Principes fondateurs

- **Liberté responsable.** Aucun chapitre n'est bloqué, aucune progression n'est imposée. On peut tout explorer en invité.
- **Intelligence d'abord, formation en soutien.** La première lecture du produit passe par les dossiers, convictions, analyses, décisions et méthodes. L'onboarding ikigai reste disponible pour personnaliser les parcours.
- **Premium éditorial.** Entre école privée, memo d'investissement, knowledge base et carnet personnel — jamais un dashboard SaaS générique.
- **Style sobre et naturel.** Toute rédaction du site suit une **charte de style transverse non négociable** : prose fluide, registre d'analyste, pas de tics d'IA ni de survente. Source canonique : le skill `.claude/skills/ecosystemes/SKILL.md` (section « Writing style ») ; résumé opérationnel dans [`docs/ARCHITECTURE_EDITION.md` §4.0.c](docs/ARCHITECTURE_EDITION.md).
- **V1 française assumée.** Le site sert des routes non localisées (`/`, `/home`, `/blog/...`). La traduction EN et les anciens préfixes de langue sont retirés du périmètre de lancement.

---

## ✦ Stack technique

| Couche | Technologies |
| --- | --- |
| **Front-end** | React 19 · Vite 6 · TypeScript · Tailwind CSS v3 · React Router 7 · lucide-react |
| **Stockage local** | `localStorage` pour profil, notes, favoris, progression et journal |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

Le **contenu canonique** (parcours, cours, leçons, dictionnaire, études de cas, livrables, analyses, anti-portfolio, mémos annotés, simulateurs, écosystèmes, ikigai) vit dans les JSON sources de `/data` : fichiers plats (`data/*.json`) et collections comme `data/blog/*.json`. Le client le bundle pour fonctionner hors-ligne / en invité, sans backend.

---

## ✦ Démarrage rapide

```bash
# 1. Installer les dépendances du client
npm install

# 2. Lancer le client (Vite)
npm run dev
```

- Front-end : http://localhost:5173 (ou le premier port libre)

> L'app est **100 % statique et locale** : profil, notes, favoris et progression sont stockés exclusivement dans le `localStorage`. Il n'y a ni API, ni base de données, ni compte distant.

### Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Client Vite (le hook `predev` relance `split:content`) |
| `npm run split:content` | Régénère les index/contenus scindés (`split:glossary` + `split:lessons`) |
| `npm run build` | `prebuild` (split → validate → sitemap), build client (vite), puis `postbuild` → **prérendu statique** |
| `npm run prerender` | Prérend les routes publiques en HTML statique (`client/dist/<route>/index.html`) — lancé automatiquement après `build` |
| `npm run typecheck` | Vérification TypeScript du client |
| `npm run lint` | ESLint client, sans avertissement toléré |
| `npm run test` | Tests Vitest du client |
| `npm run check` | Validation stricte + glossaire + TypeScript + lint + tests |
| `npm run validate:content` | Vérifie shape, références croisées et marqueurs dictionnaire `[[..]]` / `{{..}}` |
| `npm run validate:content:strict` | Idem, warnings fatals |
| `npm run validate:glossary` | Contrôle custom du glossaire final (slugs uniques, `id === slug`, liens, aliases) |
| `npm run generate:sitemap` | Régénère le sitemap |

> **Statut local-first.** Git et GitHub servent actuellement à sauvegarder le code. Un push ne publie plus le site : `.github/workflows/deploy-pages.yml` ne peut être lancé que manuellement (`workflow_dispatch`) et ne doit pas l'être avant une décision explicite de remise en ligne. Les contrôles se jouent en local avec `npm run check`, puis `npm run build` (voir [`Suivis/PROCEDURE_PUSH.md`](Suivis/PROCEDURE_PUSH.md)).

> **État vérifié, compteurs, risques et priorités** : [`Suivis/ETAT.md`](Suivis/ETAT.md).

---

## ✦ Architecture

Détail complet (arborescence, cycle de vie du contenu, pages, collections) dans [`docs/ARCHITECTURE_EDITION.md`](docs/ARCHITECTURE_EDITION.md). En bref :

```
data/                     # Contenu canonique (JSON) — source de vérité
  paths.json  courses.json  lessons.json  glossary.json
  generated/              # glossaire/leçons scindés (index léger + défs/corps lazy) — GÉNÉRÉ
  sources/                # registre d'ingestion du glossaire (canonical-glossary.json)
  caseStudies.json  deliverables.json  simulators.json  ikigai.json
  blog/                   # analyses : un fichier JSON par article (<slug>.json)
  ecosystems.json  memos.json  antiPortfolio.json   # couche Intelligence VC, 100% client
  parcours.json  profileParcours.json
  parcours/               # leçons drop-in par parcours (*.lessons.json)
docs/parcours/            # contrat maintenu de conception des parcours
docs/archive/             # historique non normatif
shared/routes.mjs         # taxonomie de routes (noindex, OG par segment)
client/                   # SPA React + Vite (content, context, lib, components, pages, styles)
```

Le build client est découpé par routes et par collections. Le vendor React est isolé ; le glossaire et les leçons sont **scindés index/contenu** : seul l'index léger est chargé sur le hot path, définitions et corps arrivent en chunks lazy.

Les pages s'organisent autour des trois piliers (**Intelligence VC**, **Formation**, **Workspace**) plus les transverses (Home, Splash, Onboarding, Profil, Recherche, Design System). La Formation suit un contrat explicite : `/parcours` liste les parcours, `/parcours/:slug` conserve leur fiche intermédiaire, `/bibliotheque` liste les rayons et `/bibliotheque/:slug` ouvre le détail d'un rayon. Les cours et leçons restent sous `/courses/:slug` et `/lessons/:slug`.

**Stockage local.** Les entités utilisateur (`Profile`, `Note`, `Bookmark`, `Progress`, `DecisionEntry`) sont gérées dans le `localStorage`.

---

## ✦ Système de design

Palette éditoriale de luxe — **feuille d'or** (`#C5A85C`), **bleu marine profond**, **prune velours** sur **parchemin**, avec un **mode sombre** complet. Tout passe par des *design tokens* CSS (`src/styles/tokens.css`) et l'échelle typographique de `tailwind.config.ts`. Animations discrètes, respect de `prefers-reduced-motion`, focus visibles, navigation clavier (⌘K pour la recherche globale). Détail complet dans [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

---

## ✦ Choix d'UX notables

- **Lecture active** : sélectionnez un passage dans une leçon, une étude de cas ou un article pour le **surligner** ou le **citer** dans votre carnet.
- **Dictionnaire vivant** : les termes du venture sont liés *inline* dans les leçons (`[[slug|libellé]]`) et renvoient au dictionnaire et aux cours associés.
- **Simulateurs réels** : dilution, pre/post-money, ownership, waterfall, fund returns (DPI/TVPI/MOIC), scénario de levée, management fees et Power Law/Monte Carlo — calculés côté client, en temps réel, avec explications pédagogiques interactives.

---

## ✦ Prérendu statique (SEO & partage social)

Le site est une SPA : les balises par page (`<title>`, `og:*`, `twitter:*`, `canonical`) sont injectées au runtime par `usePageMeta` (`client/src/lib/seo.ts`). Les scrapers de partage social et nombre de crawlers **n'exécutent pas le JavaScript** : sans prérendu, tout partage retomberait sur la carte générique.

`scripts/prerender.mjs` corrige ce point **après le build** : il sert le `client/dist` produit par Vite, pilote un Chromium headless (Puppeteer) sur chaque route publique, attend la fin de l'hydratation, puis écrit le DOM rendu dans `client/dist/<route>/index.html`.

```bash
# Lancé automatiquement par le hook postbuild ; sinon, après un build client :
VITE_SITE_URL=https://vcpx.io npm run build          # build + prérendu de toutes les routes
node scripts/prerender.mjs --filter=/blog/voir-comme-un-etat --limit=1   # itérer sur une route
```

- **Liste des URLs.** Même énumération que le sitemap (`scripts/collect-routes.mjs`). Les `NOINDEX_SEGMENTS` de `shared/routes.mjs` sont exclus.
- **Domaine canonique.** Builder avec `VITE_SITE_URL` défini pour que `canonical`/`og:url` portent le domaine de production.
- **Hébergement.** Le CDN/host statique doit servir `client/dist/<route>/index.html` (clean URLs / auto-index), et conserver `client/dist/index.html` comme repli SPA.

---

## ✦ Remise en ligne future

La remise en ligne est volontairement reportée : la priorité actuelle est une base locale fiable, puis la finalisation de la formation et d'une première couche d'Intelligence VC. Les choix ci-dessous décrivent la cible future, pas le fonctionnement courant.

- **Mode de rendu — tranché.** SPA (CSR) + **prérendu statique des routes publiques au build** : OpenGraph et `canonical` par page sont présents dans le HTML statique pour le SEO et le partage social.
- Servir le `client/dist` derrière un CDN (Vercel, Netlify, GitHub Pages). L'API ayant été supprimée, le déploiement est un simple hébergement de fichiers statiques.
