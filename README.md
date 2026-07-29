# VC Premium Experience

> Une plateforme d'intelligence VC pour analyser les écosystèmes, suivre les convictions, étudier les décisions et structurer sa progression dans le capital-risque.

Une plateforme **statique** d'intelligence VC, enrichie par une couche de formation. Elle articule trois piliers navigables : **Intelligence VC** (dossiers, convictions, analyses, décisions, méthode), **Formation** (parcours, bibliothèque filtrable, dictionnaire) et **Workspace** (tableau de bord, notes, journal de décisions). Toutes les données utilisateur (profil, notes, citations, favoris, progression) sont stockées localement dans le navigateur.

> « L'ikigai n'est pas un point fixe à atteindre. C'est un centre de gravité qui se déplace avec toi. Le capital-risque, par sa temporalité longue — 10 ans par fonds — force précisément à se demander : où sera ce centre dans une décennie ? »

---

## ✦ Documentation

- [`AGENTS.md`](AGENTS.md) est le point d'entrée portable des agents de code ; il impose à Codex, Claude Code et aux autres agents la lecture du contrat détaillé partagé [`CLAUDE.md`](CLAUDE.md).
- [`PRODUCT.md`](PRODUCT.md) fixe le contrat produit : registre, intention, anti-références, principes et cible d'accessibilité.
- `docs/` porte la documentation **de référence maintenue** : [`ARCHITECTURE_EDITION.md`](docs/ARCHITECTURE_EDITION.md), [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md), [`STRATEGIE-vc-intelligence.md`](docs/STRATEGIE-vc-intelligence.md) et [`parcours/README.md`](docs/parcours/README.md). Les documents supersédés sont isolés sous `docs/archive/`.
- [`docs/SPECKIT.md`](docs/SPECKIT.md) décrit le cycle de spécification brownfield ; la constitution et le contexte de reprise vivent sous [`.specify/memory/`](.specify/memory/), et chaque changement prospectif borné sous [`specs/`](specs/).
- `Suivis/` porte le **suivi vivant** : [`ETAT.md`](Suivis/ETAT.md) (état vérifié, compteurs, risques, priorités), [`JOURNAL.md`](Suivis/JOURNAL.md) (journal daté) et [`PROCEDURE_PUSH.md`](Suivis/PROCEDURE_PUSH.md) (procédure de sauvegarde Git ; la publication est reportée).
- En cas de doute, l'état réel se vérifie dans `client/`, `data/`, `shared/routes.mjs` et les scripts du `package.json`.

---

## ✦ Principes fondateurs

- **Liberté responsable.** Aucun chapitre n'est bloqué, aucune progression n'est imposée. On peut tout explorer en invité.
- **Intelligence d'abord, formation en soutien.** La première lecture du produit passe par les dossiers, convictions, analyses, décisions et méthodes. L'onboarding reste une entrée courte vers les espaces principaux ; le cahier Ikigai dédié reste disponible pour personnaliser les parcours.
- **Premium éditorial.** Entre école privée, memo d'investissement, knowledge base et carnet personnel — jamais un dashboard SaaS générique.
- **Style sobre et naturel.** Toute rédaction du site suit une **charte de style transverse non négociable** : prose fluide, registre d'analyste, pas de tics d'IA ni de survente. Source canonique détaillée : [`docs/ARCHITECTURE_EDITION.md` §4.0.c](docs/ARCHITECTURE_EDITION.md) ; `PRODUCT.md` porte les principes produit et le skill `.claude/skills/ecosystemes/SKILL.md` complète le contrat pour les dossiers d'écosystème.
- **V1 française assumée.** Le site sert des routes non localisées (`/`, `/home`, `/blog/...`). La traduction EN et les anciens préfixes de langue sont retirés du périmètre de lancement.

---

## ✦ Stack technique

| Couche | Technologies |
| --- | --- |
| **Front-end** | React 19 · Vite 6 · TypeScript · Tailwind CSS v3 · React Router 7 · lucide-react |
| **Stockage local** | `localStorage` pour profil, notes, favoris, progression et journal |
| **Typographie** | Newsreader (titres) · Plus Jakarta Sans (corps) · JetBrains Mono (mono) |

Les **collections éditoriales canoniques** (parcours, cours, leçons, dictionnaire, études de cas, livrables, analyses, anti-portfolio, mémos annotés, simulateurs, écosystèmes, ikigai) vivent dans les JSON sources de `/data` : fichiers plats (`data/*.json`) et collections comme `data/blog/*.json`. Le client les bundle pour fonctionner en invité, sans backend applicatif. Les assets et chunks non encore chargés restent dépendants de l'hôte statique.

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
| `npm run check:generated` | Vérifie sans écriture la parité des quatre sorties scindées avec leurs sources |
| `npm run build` | Exige `VITE_SITE_URL` ; `prebuild` (split → validate → sitemap), build client, puis `postbuild` → **prérendu statique strict** |
| `npm run prerender` | Prérend les routes publiques en HTML statique (`client/dist/<route>/index.html`) — lancé automatiquement après `build` |
| `npm run typecheck` | Vérification TypeScript du client |
| `npm run lint` | ESLint du client, des scripts, des modules partagés et des hooks ESM, sans avertissement toléré |
| `npm run test` | Tests Vitest du client et tests Node de `scripts/` et `shared/` |
| `npm run check` | Fraîcheur des générés + validation stricte + glossaire + TypeScript + lint + tests |
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
data/                     # Collections éditoriales canoniques (JSON)
  courses.json  lessons.json  glossary.json
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

Les pages s'organisent autour des trois piliers (**Intelligence VC**, **Formation**, **Workspace**) plus les transverses (Home, Splash, Onboarding, Profil, Recherche, Design System). La Formation suit un contrat explicite : **path = Parcours**, soit une trajectoire de formation ordonnée par objectif qui compose librement les ressources existantes ; `/parcours` les liste et `/parcours/:slug` conserve leur fiche intermédiaire. `/bibliotheque` inventorie et filtre les ressources sans taxonomie parallèle. Les anciennes URL `/bibliotheque/:slug` redirigent vers cet inventaire. Les cours et leçons restent sous `/courses/:slug` et `/lessons/:slug`.

**Stockage local.** Les entités utilisateur (`Profile`, `Note`, `Bookmark`, `Progress`, `DecisionEntry`) sont gérées dans le `localStorage` sous contrats `vcpx:` versionnés, validés et migrés.

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

`scripts/prerender.mjs` corrige ce point **après le build** : il sert le `client/dist` produit par Vite, pilote un Chromium headless (Puppeteer) sur chaque route publique, attend les métadonnées calculées au runtime, puis écrit le DOM rendu dans `client/dist/<route>/index.html`.

```bash
# Lancé automatiquement par le hook postbuild ; sinon, après un build client :
export VITE_BASE_URL=/vc-plateform/
export VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform
npm run build                                        # build + prérendu de toutes les routes
npm run prerender:strict -- --filter=/blog/voir-comme-un-etat --limit=1  # contrôle ciblé bloquant
npm run prerender:tolerant -- --filter=/blog/voir-comme-un-etat          # diagnostic local explicite
```

- **Mode bloquant par défaut.** Un navigateur indisponible, une route en erreur, des métadonnées absentes ou un nombre de fichiers différent du nombre attendu font échouer le prérendu. Le mode tolérant est réservé au diagnostic local et doit être demandé explicitement.
- **Liste des URLs.** Le collecteur, le sitemap et le prérendu consomment la même énumération (`scripts/collect-routes.mjs`). Les familles `NOINDEX_ROUTE_PATTERNS` de `shared/routes.mjs` en sont exclues.
- **Domaine canonique.** `VITE_SITE_URL` est obligatoire pour le sitemap et le prérendu. Son chemin doit correspondre à `VITE_BASE_URL` ; aucun domaine de production n’est déduit par défaut.
- **Page introuvable.** Le build produit un vrai `client/dist/404.html`, marqué `noindex,nofollow` et dépourvu de canonical auto-référente. L’hébergeur doit servir ce document avec un statut HTTP 404 ; copier le shell SPA comme page 404 n’est pas admis.
- **Hébergement.** Le CDN/host statique doit servir `client/dist/<route>/index.html` (clean URLs / auto-index). Les routes publiques prérendues ne dépendent donc d’aucun repli SPA. Si des liens directs vers une route fonctionnelle `noindex` doivent répondre en 200, l’hébergeur doit recevoir une règle explicite pour ces chemins connus sans transformer les URL inconnues en faux succès ; à défaut, cette garantie n’est pas revendiquée.

### En-têtes de sécurité attendus en production

Le dépôt ne simule pas des en-têtes HTTP au moyen de balises HTML. L’hébergement retenu doit permettre de définir puis de contrôler une politique de réponse comparable à la cible suivante, à adapter après validation sur l’artefact final :

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

`style-src-attr 'unsafe-inline'` correspond aux styles calculés actuellement rendus comme attributs par l’interface ; il ne doit pas être étendu à `script-src`. Un hébergement qui ne permet pas d’imposer et de vérifier ces en-têtes ne satisfait pas le prérequis `SEC-005`. La vérification porte sur les réponses HTTP publiées, notamment la page d’accueil, une route prérendue et la réponse 404.

---

## ✦ Remise en ligne future

La remise en ligne est volontairement reportée : la priorité actuelle est une base locale fiable, puis la finalisation de la formation et d'une première couche d'Intelligence VC. Les choix ci-dessous décrivent la cible future, pas le fonctionnement courant.

- **Mode de rendu — tranché.** SPA (CSR) + **prérendu statique des routes publiques au build** : OpenGraph et `canonical` par page sont présents dans le HTML statique pour le SEO et le partage social.
- Servir le `client/dist` derrière un CDN (Vercel, Netlify, GitHub Pages). L'API ayant été supprimée, le déploiement est un simple hébergement de fichiers statiques.
- **Origine canonique du workflow manuel.** Tant qu’aucun domaine personnalisé et aucun `CNAME` ne sont configurés, le workflow GitHub Pages utilise `https://iari-ctrl.github.io/vc-plateform` avec la base `/vc-plateform/` pour les assets, le routeur, le sitemap, les robots et les métadonnées.
- **Manifest uniquement.** Le site fournit un manifest et des icônes d’installation, sans service worker ni promesse de navigation hors ligne. Toute évolution vers une PWA hors ligne devra définir séparément la stratégie de cache, le fallback et les mises à jour.
