# Report et scoring - VC Premium Platform

Dernière mise à jour : 2026-06-13

Objet : conserver le **journal daté** des avancées et des vérifications de `vc-premium-platform`, et le **scoring** du produit.

> **Périmètre des docs de suivi.** Ce document est le **journal + le scoring**. L'**état de synthèse, les risques, les priorités et le backlog prospectif** vivent dans [Bilan.md](Bilan.md). La **stratégie cible** est dans [docs/STRATEGIE-vc-intelligence.md](../docs/STRATEGIE-vc-intelligence.md).

---

## 1. État global observé

La nouvelle version de `vc-premium-platform` est nettement plus mature que la version précédente. Le produit a une identité forte autour du cahier Ikigai, du glossaire vivant et d'une expérience éditoriale premium. La plateforme n'est plus seulement un catalogue de contenus VC : elle est un outil d'introspection, de lecture active et d'apprentissage personnalisé avec un portail d'entrée à hauteur de la promesse.

Travaux d'interaction front (2026-06-02) :

- La carte `PathAtlas` est devenue **manipulable comme une vraie carte** : préhension (grab/pan), zoom molette centré sur le curseur, pinch tactile, boutons **+/−** et **recentrage**, avec bornage du zoom (`[0.6, 3]`) et de la translation, et un seuil de 4 px qui distingue le clic (navigation) du glissement (pan). Modèle de référence : `VC PortfolioJourney/map.html`.
- La barre latérale `SideNav` affiche un **effet verre dépoli à l'ouverture** : repliée, elle reste intégrée au fond ; ouverte, elle devient un panneau très translucide teinté d'un ton conteneur (`--surface-container-lowest`/`-low`, ~34–38 %), flou modéré (`blur(14px)`) qui laisse transparaître la page, double dégradé voile + teinte or/prune, arête brillante, ombre portée multi-couches et variante mode sombre dédiée. Leçon clé : `--surface` est égal à `--background` (pas de contraste) — teinter le verre avec un ton `--surface-container*`.
- `npm run validate:content` exit 0, `npm run lint` 0 erreur / 15 warnings, `npm run build` OK : aucune régression.

Travaux récents (2026-06-09) — **non recompilés ici** (le sandbox ne peut pas monter le dossier « VC SITE », espace dans le nom) :

- **i18n FR/EN — Phase 1 (routing localisé)** : nouveau module `client/src/i18n/` (`config`, `routing`, `guards`, `useLocale`, `LocaleSwitcher`, `routing.test.ts`), `App.tsx` sous `/:locale`, redirection racine crawler-safe, redirection des liens legacy `/paths` → `/fr/paths`, `<html lang>` dynamique, sélecteur FR/EN (TopBar + SideNav), ~27 fichiers migrés. Slugs canoniques → marqueurs `[[..]]`/`{{..}}` inchangés. Amorce corpus EN : `data/parcours.en.json`. ADR : `i18n_architecture_FR-EN.md`.
- **Lot de durcissement sécurité / qualité (12 correctifs)** : CORS localhost dev-only ; auth cookie-only (token hors body, `Bearer` retiré) ; mot de passe ≥ 8 + limiteur 20/15 min sur login/register ; markdown sûr (nœuds React, pas d'`innerHTML`) + garde `safeHttpUrl()` ; tokens `--error`/`--success` + sweep ~9 fichiers, IA des deux navs alignée ; Error Boundary au niveau route ; graisse 300 retirée ; parallaxe splash en `requestAnimationFrame` ; loader `/profile-result` ; quiz piloté par l'URL (`?test=1&q=N`) ; `<Routes>` aplaties (layout `PageShell`) ; **premier harnais Vitest (3 tests) + CI** (`client/vitest.config.ts`, `.github/workflows/ci.yml`).
- **Analyse CSR vs SSR** : décision de **mode de rendu** ouverte ; recommandation hybride (SSG/ISR pour l'éditorial, CSR pour l'app). À trancher avant la production de contenu.
- **Pipeline parcours** : `docs/parcours/` (conception + rédaction) → `data/parcours/*.lessons.json` (fiches drop-in). « Réussir l'entretien Analyst » rédigé en 13 leçons (`c-entretien-analyst`, ids `lea-*`). Reste à fusionner dans `data/lessons.json` + seed et à synchroniser `parcours.json`.
- **Simulateurs & Pédagogie** : Mise à jour des calculateurs (formules professionnelles standard), ajout d'un panneau pédagogique complet intégrant l'historique de simulation et des popovers interactifs de glossaire (`InlineMarkdown`).
- **Parcours & Pré-requis** : Ajout systématique du bloc "Pour qui / Pré-requis / Ce que tu sauras faire" sur les parcours d'apprentissage, avec intégration d'un rendu Markdown inline pour lier d'autres leçons ou des termes du dictionnaire.

Travaux du jour (2026-06-10) — **compilés et validés** :

- **Rétractation de chapitres Bibliothèque** : Intégration de boutons interactifs à la place des titres de catégories statiques dans `PathsPage.tsx` avec chevrons animés en rotation. Enveloppement des contenus dans des grilles Grid CSS à hauteur dynamique via `grid-rows-[0fr]/[1fr]` pour un repliage fluide.
- **Intégration d'Études de cas** : Intégration directe des Études de cas (`CASE_STUDIES`) en tant que catégorie à part entière sur la page de la Bibliothèque (`/bibliotheque` / `PathsPage.tsx`).
- **Unification de la navigation** :
  - Remplacement de l'état local par `useSearchParams` (`type = searchParams.get('type')`) pour synchroniser dynamiquement l'URL et l'onglet sélectionné.
  - Ajout du helper `isLinkActive` dans `routing.tsx` pour isoler finement la surbrillance active des liens de navigation selon la locale et les paramètres de requête URL.
  - Retrait des raccourcis « Études de cas » des menus `SideNav`, `TopBar` et `Footer`.
  - Retrait de l'onglet filtre spécifique « Études de cas » (les cas s'affichent par défaut sous forme de section autonome dans la bibliothèque).
  - Mise à jour du bouton retour de `CaseStudyPage.tsx` vers `/bibliotheque`.
  - Redirection de `/cases` vers `/bibliotheque` dans `App.tsx` et nettoyage de l'import obsolète.

Travaux du jour (2026-06-11) — **compilés et validés** (`npm run build --workspace client` : OK) :

- **Rétractation des familles sur la page catalogue `/paths`** (`ParcoursPage.tsx`) : les en-têtes de familles de parcours (« Découvrir », « Réussir un entretien », « Lever des fonds », etc.) sont devenus des boutons interactifs accessibles. État local `collapsedFamilies`, icône `ChevronDown` pivotant à 90°, accordión fluide via `grid-rows-[0fr]/[1fr]`.
- **Rétractation des cours dans les rayons legacy** (`PathDetailPage.tsx`) : même pattern accordéon appliqué aux cours listés dans un rayon (slug legacy). Le lien direct vers le cours est repositionné à droite du titre pour dissocier le collapse de la navigation.
- **Aiguilleur de route `/paths/:slug`** : création de `ParcoursOrSubjectPage.tsx`, composant pivot importé en lazy qui détecte dynamiquement si le slug appartient à `parcours.json` (nouveau modèle) ou à `paths.json` (rayons legacy), et rend le bon composant de détail (`ParcoursDetailPage` ou `PathDetailPage`). Route `App.tsx` mise à jour en conséquence.
- **Cours autonome Power Law & Monte Carlo** : ajout de `c-power-law-portfolio` dans le rayon Portfolio avec 4 leçons canoniques (`lpl-average-lies`, `lpl-why-monte-carlo`, `lpl-simulator-engine`, `lpl-read-results`). La séquence explique moyenne vs médiane, intérêt de Monte Carlo comme outil de jugement sous incertitude, moteur déterministe du simulateur Power Law, lecture TVPI/concentration/fund returner. Le simulateur Power Law référence ces leçons en premier ; le parcours `p-penser-gp` les expose comme étape de cœur.
- **Liens pédagogiques enrichis** : mise à jour des `furtherReading` de `l-power-law`, `l-reserves`, `l-fund-metrics`, des `relatedLessonIds` glossaire (`power-law`, `fund-returner`, `portfolio-construction`, `reserve-funds`, `follow-on`, `tvpi`, `moic`) et résolution des liens `course`/`case`/`glossary` dans `LessonPage`.

Travaux du jour (2026-06-12) — **compilés et validés** (branche `chore/flux-c-repo-hygiene`) :

- **CI réparée** : `ci.yml` écoute `push` sur `main`/`master` (était `main` seul → tout le garde-fou était inopérant hors PR sur ce dépôt `master`). Pipeline : validation contenu → lint → build → tests client → tests serveur.
- **Robustesse serveur (Express 4)** : wrapper async `ah()` (`server/src/lib/async-handler.ts`) sur **tous** les handlers — une rejection (Prisma, JSON corrompu, DB verrouillée) part à l'error-handler central (→ 500) au lieu de tuer le process Node.
- **Seed non destructif** : `seed.ts` préserve le contenu éditable (glossaire/blog/cas) sauf `db:seed -- --force` ; `npm run content:export` réexporte les éditions DB → JSON. Comptes de démo gatés hors prod.
- **Garde JWT corrigée** : longueur min. + blocklist en production, fail-fast au démarrage (`getJwtSecretIssue`).
- **`DELETE /me/profile`** : `clearProfile` supprime profil + onboarding côté serveur ; **`apiUp` re-sondé** (intervalle 15 s + `focus`/`online`) ; `attachUser` retiré du global ; rate-limit `/api/search` ; sélecteur EN masqué (`EN_ENABLED=false`).
- **Perf bundle** : split des leçons (`lessons.index`/`lessons.bodies`, scripts `split-lessons.mjs` + `split:content`) — chunk eager `lessons` de **~176 kB à ~32 kB**, corps en lazy.
- **Tests serveur (nouveaux)** : 10 tests d'intégration (auth, profil, isolation `userId`).
- **Format éditorial « Lecture oblique »** (§10.9 de la stratégie) : analyses de livres livrées dans le blog — catégorie filtrable sur `/blog`, champs `BlogPost.books[]` / `glossaryRefs[]` (type + Zod + rendu `BlogCard`/`BlogPostPage`), 2 articles d'amorce seedés en squelettes (Flatland → anti-portfolio ; Hirschman *Exit, Voice, Loyalty*). `blog.json` : 4 → **6 articles**. Corps à rédiger.
- Vérifs : `validate:content` OK, `lint` 0 erreur / **4 warnings**, `build` OK, **client 59 tests + serveur 10 tests** verts.

Travaux du jour (2026-06-13) — **validés** (`validate:content` OK, `db:seed` OK) :

- **Premier article « Lecture oblique » entièrement rédigé** : `bp-voir-comme-un-etat` (*Seeing Like a State*, J. C. Scott, 1998) — 10 idées transposées au VC / détection de talents, ~3 280 mots / 16 min, marqueurs `[[..]]` glossaire, renvoi anti-portfolio (Airbnb, eBay), `glossaryRefs` ×5. Article « à la une » de `/blog` ; **gabarit éditorial** pour rédiger Flatland et Hirschman. `blog.json` : 6 → **7 articles**.
- **Deuxième « Lecture oblique » rédigée** : `bp-societe-du-spectacle` (*La Société du spectacle*, Debord, 1967) — 11 idées, ~3 530 mots / 18 min, parallèles contexte actuel (IA, méga-tours, structures post-2021) et **taxonomie de 8 logiques de levée** (carburant / signal / validation / monnaie / rituel / offre / théâtre / produit). Renvois : étude de cas « valorisation flatteuse », anti-portfolio, diptyque avec Scott. `blog.json` : 7 → **8 articles** ; `validate:content` + `db:seed` OK.
- **Troisième « Lecture oblique » rédigée** : `bp-exit-voice-loyalty` (*Exit, Voice, and Loyalty*, Hirschman, 1970) — le squelette devient un article complet de 9 idées, ~2 870 mots / 14 min : VC = classe d'actifs « voice », entrepreneuriat comme exit (Shockley→Fairchild, Zoom/anti-portfolio), attrition/diligence, churn muet, loyauté lucide vs captive, LPs/re-up, paradoxe de l'exit facile. Triptyque Scott/Debord/Hirschman. Seed via suppression ciblée + re-seed (DB préservée). **Reste 1 squelette : Flatland.**

> Note de séquencement (issue des conversations) : garder design system tokenisé + tests/CI + Error Boundary (utiles tout de suite, peu de churn) ; **différer** le lot 🔴 restant (SSR/SEO, CSP/HSTS, contraste de l'or, interstitiel splash) jusqu'à un contenu réel et un déploiement — la garde JWT, elle, est désormais corrigée. Priorité immédiate : les deux décisions d'architecture (rendu + modèle de contenu), puis une tranche verticale réelle.

Points confirmés lors du dernier audit (2026-06-10) :

- Le portail splash (`/`) est entièrement intégré, corrigé et responsive : boussole animée ikigai → compass, parallaxe, deux couches clair/sombre cross-fadées, toggle synchronisé avec le thème global.
- Le mode sombre de `/home` est rehaussé : ciel étoilé photographique en fond du hero et de la carte `PathAtlas`, conservant tous les tracés SVG existants.
- Les fonds photographiques sont en WebP (~118 Ko total contre ~3,4 Mo en PNG, soit ~97 % de réduction).
- Le cahier Ikigai reste une expérience centrale : 13 zones, deux niveaux de lecture, archétypes, réponses libres, sauvegarde locale et popovers de glossaire.
- Le glossaire a été enrichi : **357 termes** dans la base.
- `npm run validate:content` passe : 16 cours, 62 leçons canoniques, 8 simulateurs, 266 marqueurs `[[..]]` / `{{..}}` résolus dynamiquement.
- `npm run build` passe : serveur + client OK, assets WebP présents dans `dist/`.
- Le projet a un `.gitignore` qui couvre `node_modules`, `dist`, `.env`, SQLite et logs, et le dépôt Git est désormais initialisé : `master` suit `origin/master`, commit initial `e5b37e0 Initialisation du projet`.
- Le build client est désormais découpé : `react-vendor` ≈ 232 kB (74 kB gzip) ; le glossaire et les leçons sont **scindés index/contenu** (index léger eager + corps/défs lazy), le chunk `lessons` eager tombant de ~176 kB à ~32 kB.

Points bloquants ou fragiles :

- ~~`npm run lint` échoue car `eslint` n'est pas installé dans le workspace client.~~ **Corrigé 2026-05-30.**
- ~~Les pages détail utilisent encore souvent le contenu bundlé local, alors que les listes utilisent l'API.~~ **Corrigé 2026-05-30 pour Blog, CaseStudy, Lesson.**
- ~~Le script `validate:content` ne couvre pas encore toutes les relations de contenu.~~ **Corrigé 2026-05-30.**
- ~~L'accessibilité des modales, formulaires, simulateurs et suppressions doit être durcie.~~ **Corrigé 2026-05-30.**
- ~~Le portail splash écrase tout à ~27 % sur mobile (artboard 1440×900 mis à l'échelle).~~ **Corrigé 2026-06-01 — mise en page fluid.**
- ~~La couche inactive du splash garde ses liens focusables au clavier malgré `aria-hidden`.~~ **Corrigé 2026-06-01 — `inert`.**
- ~~Le toggle clair/sombre du splash est déconnecté du thème global.~~ **Corrigé 2026-06-01 — pilote `ThemeContext`.**
- ~~Les fonds photographiques de la splash sont des PNG volumineux (~3,4 Mo).~~ **Corrigé 2026-06-01 — WebP ~97 % plus léger.**
- SEO et partage social restent faibles car l'app est une SPA (CSR) sans prérendu. **Décision de rendu ouverte** (CSR vs SSG/SSR) à trancher avant production ; l'émission SEO/`hreflang` en découle. *(Différé pré-lancement.)*
- Path/CourseDetailPage restent sur le bundle statique. *(Reste à brancher, endpoints déjà prêts.)*
- ~~Aucune sécurité de durcissement.~~ **Lot 2026-06-09** (auth cookie-only, mdp ≥ 8, rate-limit, CORS dev-only, `safeHttpUrl`) **+ lot 2026-06-12** (garde JWT corrigée, `attachUser` scoping, rate-limit `/search`, wrapper async `ah()`, comptes démo hors prod). Reste le lot 🔴 : helmet, CSP/HSTS, cookie `secure`, CSRF, rotation JWT.
- ~~Aucun test.~~ **Harnais Vitest : client 10 fichiers / 59 tests + serveur 3 fichiers / 10 tests (auth/profil/isolation `userId`) + CI.** Reste à étendre la couverture API (admin, notes, journal).
- i18n Phase 1 compilée côté client ; le **sélecteur EN est masqué** (`EN_ENABLED=false`) en attendant la traduction ; restent le chrome traduit, la base `locale`, `hreflang` et le corpus EN.
- Fiches `data/parcours/*.lessons.json` rédigées mais **pas encore fusionnées** dans `data/lessons.json` / le seed.

---

## 2. Scoring actuel

| Axe | Score | Commentaire |
| --- | ---: | --- |
| Vision produit | 8.5 / 10 | Positionnement fort : introspection + apprentissage VC + premium éditorial. |
| UX globale | 8.1 / 10 | Portail d'entrée premium, cahier Ikigai fort, atlas navigable (pan/zoom/recentrage), `DesignSystemShowcasePage` existante pour l'interface. |
| Design / direction artistique | 8.6 / 10 | Identité atlas/carnet convaincante. Mode sombre rehaussé par ciel photographique. Portail splash à la hauteur. Barre latérale en verre dépoli. |
| Contenu pédagogique | 7.8 / 10 | Très complet : **22 parcours, 16 cours, 62 leçons canoniques (+ leçons drop-in de parcours), 4 études de cas, 8 simulateurs, 357 termes au glossaire**. Le nouveau cours Power Law/Monte Carlo renforce le chaînage théorie → simulateur. Attention : 23 leçons canoniques n'ont pas encore de quiz. |
| Technique front-end | 8.2 / 10 | Build OK (vendor React ~232 kB), lazy routes. Glossaire + leçons scindés index/contenu (chunk `lessons` eager 176→32 kB). Assets WebP. Routing i18n `/fr` `/en` en place. |
| Back-end / API | 8.0 / 10 | Architecture fonctionnelle. Rate-limiting (auth + `/search`), **garde JWT corrigée**, **wrapper async `ah()`** (plus de crash sur rejection), `attachUser` scoping. Reste helmet/CSP, cookie `secure`, CSRF. |
| Qualité / tests | 8.4 / 10 | Lint (0 erreur, 4 warnings), validation contenu complète, **Vitest client (59 tests) + serveur (10 tests : auth/profil/isolation) + CI**. |
| Accessibilité | 8 / 10 | Focus trap + restauration modal, focus-visible inputs, aria-live toasts, role="alert" erreurs, ConfirmDialog, aria-labels simulateurs, `inert` splash. |
| SEO / distribution | 4 / 10 | Meta client-side, pas de prérendu ni d'OpenGraph par page. Mode de rendu (CSR vs SSG/SSR) à trancher avant d'agir. |
| i18n / bilinguisme | 5.5 / 10 | Architecture décidée (ADR) + Phase 1 (routing localisé) implémentée ; sélecteur EN **masqué** (`EN_ENABLED=false`) tant que le contenu n'est pas traduit. Reste : chrome (Phase 2), base `locale` (Phase 4), `hreflang` (Phase 5), corpus EN. |
| Robustesse contenu / CMS | 7 / 10 | Validation Zod + refs complète. Pages branchées sur l'API avec fallback. CMS à étendre à la `locale`. |
| Performance assets | 8.2 / 10 | Fonds splash en WebP (~97 % de réduction). Entry JS/CSS optimisés. |

Score global estimé : **8.3 / 10**

Interprétation : très bonne base produit et éditoriale, déjà crédible pour une démo avancée et un portail premium. Avant lancement public, priorité aux garde-fous qualité, à la cohérence API/CMS et au SEO.

> **Révision 2026-06-13 — re-scoring honnête vs l'ambition affichée (VC Intelligence).** Le tableau ci-dessus note le produit *comme une plateforme de formation premium* — un yardstick qui flatte. Mesuré contre la cible « VC Intelligence Platform » (`docs/STRATEGIE-vc-intelligence.md`) et **après lecture directe du contenu** (cf. §8, entrée « Audit indépendant ») :

| Axe | vs MOOC premium | vs ambition VC Intelligence |
| --- | ---: | ---: |
| Clarté du positionnement | 8.5 | **4** — home/nav/meta disent encore « apprentissage » |
| UX / UI | 8.1 | **6.5** — 2 portes (splash + home), double nav incohérente, densité faible pour un pro |
| Crédibilité VC — substance | — | **8** — contenu lu : decision-grade, sourcé, point de vue assumé |
| Crédibilité VC — 1re impression | — | **4.5** — ikigai / « test d'orientation » / vocab scolaire la sabotent avant lecture |
| Potentiel premium | — | **7** |
| Architecture technique | 8.0 | **7** — CSR vs stratégie public-first = vrai risque |
| Profondeur contenu | 7.8 | **8** — forte et sourcée ; mais 0 Research note / 0 Thesis au format cible |
| Scalabilité | — | **6** — SQLite + blob JSON + contenu bundle-only + CSR |
| Différenciation | — | **6.5** — vrais différenciateurs (angle FR, anti-portfolio, journal) mais enterrés |
| Potentiel business | — | **5.5** — 0 capture email / RSS / monétisation |

> Score global **vs ambition : ~6 / 10** (contre 8.3 mesuré comme MOOC). **L'écart entre les deux chiffres EST le diagnostic** : le danger n'est pas l'échec mais de continuer à se mesurer au mauvais produit.

---

## 3. Avancées déjà mises en place

### Interactions front : carte navigable + barre latérale en verre (2026-06-02)

Statut : en place.

Carte `PathAtlas` (`client/src/components/explore/PathAtlas.tsx`) :

- contenu SVG enveloppé dans un groupe `<g transform="translate(tx ty) scale(scale)">` piloté par un état `view` ;
- pan (grab) souris/tactile via pointer events, déplacement converti client → coordonnées viewBox ;
- zoom molette **centré sur le curseur** (le point survolé reste fixe) + pinch deux doigts ;
- cluster de boutons **+ / − / recentrage** (style éditorial, haut-gauche) ;
- bornage du zoom `[0.6, 3]` et de la translation (`clampView`), `touch-action: none`, molette en listener natif non-passif ;
- seuil de 4 px clic-vs-drag : un glissement ne navigue jamais ; survol/encart/focus clavier/liste de chips conservés.

Barre latérale `SideNav` (`.glass-rail` dans `global.css`, attribut `data-open`) :

- état replié quasi-opaque (`--surface` ~90 %, `blur(6px)`, intégré au fond, rien derrière le rail) ;
- état ouvert en verre dépoli très translucide teinté `--surface-container-lowest` ~38 % (clair) / `--surface-container-low` ~34 % (sombre), `backdrop-filter: blur(14px) saturate(165%) contrast(104%)` — flou modéré qui laisse transparaître aplats et grandes formes ; double dégradé (voile `--surface-bright` + teinte or/prune), arête gauche brillante, ombre portée multi-couches avec lisérés internes ;
- variante dédiée `.dark .glass-rail[data-open]` (accents `--primary`/`--secondary`/`--tertiary`, ombres renforcées) ;
- transitions animées (`background-color`, `background-image`, `box-shadow`, `border-color`, `backdrop-filter`) + fallback `@supports not (backdrop-filter)` ;
- correctif de fond : `--surface` == `--background`, donc le verre doit être teinté avec un ton `--surface-container*` distinct pour être perceptible.

### Portail splash (2026-06-01)

Statut : en place, intégré et corrigé.

Éléments observés :

- Portail `SplashDuo` (variante « Clair · Sombre ») porté depuis le dossier `splash/` vers `pages/SplashPage.tsx` et `components/splash/CompassIkigaiIntro.tsx`.
- Deux couches cross-fadées : lumière (atlas, parchemin, ciel d'aube) et sombre (constellation, ciel étoilé).
- Boussole animée : intro ikigai (4 cercles dorés) → compass en ~5 s, puis hoverable.
- Sceaux de cire dérivants avec parallaxe souris.
- Toggle "Choisissez votre lumière" — segment doré doré.
- Fonds photographiques en WebP : `bg-claire.webp` (~21 Ko, q80), `bg-sombre.webp` (~97 Ko, q83).

Corrections apportées (2026-06-01) :

- Responsive : suppression du scaling artboard 1440×900 ; le stage remplit le viewport, titre `clamp(1.6rem, 2.4vw, 2.6rem)`, règles mobile portrait et paysage court.
- Accessibilité : `inert={!active}` sur la couche inactive — le lien « Entrer » caché n'est plus focusable au clavier.
- Thème synchronisé : le toggle pilote `useTheme()` (ThemeContext global) ; le mode choisi persist sur `/home` et dans toute l'app.
- PNG supprimés.

### Mode sombre sur /home (2026-06-01)

Statut : en place.

Éléments :

- Nouveau composant `NightSkyBackdrop` dans `ornaments/Illustrations.tsx` : photo + voile de lisibilité, `hidden dark:block`, `-z-10`.
- Variants `hero` (fondu vertical) et `panel` (vignette radiale).
- Appliqué au hero de `HomePage` et au conteneur de `PathAtlas`.
- `isolate` ajouté aux deux conteneurs hôtes.
- Constellation SVG dessinée atténuée en sombre (`dark:opacity-40`) pour laisser respirer la photo.
- Mode clair inchangé : parchemin `map-paper` conservé.

### Cahier Ikigai

Statut : en place, très positif.

Éléments observés :

- Diagramme Ikigai à 13 zones.
- Sections Dimensions, Intersections, Presque-Ikigai, Archétypes et Questions libres.
- Modes de lecture `Découverte` et `Avancé`.
- Popovers de glossaire dans les textes Ikigai.
- Réponses libres stockées localement.
- Sauvegarde volontaire dans le carnet.
- Historique des profils précédents.
- Connexion entre archétypes et parcours recommandés.

### Validation de contenu

Statut : en place.

- Schémas Zod stricts sur les 8 fichiers JSON.
- Unicité des `id` et `slug` vérifiée.
- Toutes les relations structurantes vérifiées.
- Règle quiz : malformation = erreur bloquante ; absence = warning.
- Marqueurs `[[..]]` / `{{..}}` vérifiés.
- `npm run validate:content` : exit 0 avec warning éditorial courant (23/62 leçons canoniques sans quiz).

### Build et architecture

Statut : sain, assets optimisés, entry chunk réduit.

- `npm run build` passe.
- Build client observé : `index-*.js` ≈ 100 kB, `react-vendor` ≈ 232 kB, chunks spécifiques volumineux (glossaire ~279 kB).
- Fonds splash : WebP uniquement dans `public/splash/` et `dist/splash/`.
- `BlogPostPage`, `CaseStudyPage`, `LessonPage` : branchées sur l'API avec fallback bundle.
- `PathDetailPage`, `CourseDetailPage` : encore sur bundle (endpoints prêts côté serveur).

---

## 4. Suivi prospectif → centralisé dans `Bilan.md`

Les corrections prioritaires, les propositions d'enrichissement (UX / produit / contenu) et le plan d'action phasé qui figuraient ici sont désormais regroupés dans **[Bilan.md](Bilan.md)** :

- état + risques + corrections techniques minimales : §3 à §9 ;
- priorités & plan d'action : §10 (+ « Priorité selon l'objectif visé ») ;
- backlog d'enrichissements (produit / technique / contenu) : §10bis ;
- plan de vérification : §11bis.

Ce document conserve le **scoring** (§2), le **journal daté des avancées** (§1, §3) et l'**historique des vérifications** (§8).

---

## 8. Historique des vérifications

### 2026-05-30 — Audit initial

Commandes lancées :

- `npm run validate:content` : OK. (Termes et marqueurs validés).
- `npm run build` : OK. Bundle alors observé ~498 kB avant découpage actuel.
- `npm run lint` : KO. `eslint: command not found`.
- `npm run dev` : client OK, serveur sur port 4000 existant.

Contrôle supplémentaire :

- Relations contenu testées via script ad hoc — OK.
- Absence de quiz dans plusieurs leçons détectée.

### 2026-05-30 — Corrections prioritaires (phases 1-3)

Commandes de vérification post-corrections :

- `tsc -b` (client) : exit 0.
- `npm run lint` : **0 erreur, 15 warnings** (HMR advisories).
- `npm run validate:content` : **exit 0**, warnings sur les leçons sans quiz.
- `npm run build` : **exit 0**, bundle alors observé ~500 kB avant découpage actuel.

### 2026-06-01 — Portail splash et mode sombre premium

Commandes de vérification :

- `tsc -b` (client) : **exit 0**.
- `eslint` (SplashPage, HomePage, PathAtlas, Illustrations) : **exit 0**.
- `npm run build` : **exit 0**, `dist/splash/` contient `bg-claire.webp` + `bg-sombre.webp` uniquement.

### 2026-06-01 — Audit documentaire courant

Commandes de vérification :

- `npm run validate:content` : **exit 0**, warnings (leçons sans quiz).
- `npm run lint` : **exit 0**, 0 erreur, 15 warnings Fast Refresh.
- `npm run build` : **exit 0**, entry client ≈ 100 kB, vendor React ≈ 232 kB.
- `git status --short --branch` : OK depuis validation du 2026-06-11, dépôt Git initialisé et branche `master` suivie par `origin/master`.

Fichiers modifiés / créés :

- `client/src/pages/SplashPage.tsx` : responsive (stage inset:0), `inert` sur couche inactive, toggle → ThemeContext, suppression helpers scaling/localStorage.
- `client/src/styles/splash.css` : stage `position:absolute;inset:0`, titre `clamp(1.6rem,2.4vw,2.6rem)`, max-width 18ch, media portrait ≤760px, media paysage ≤600px, URLs `.png` → `.webp`.
- `client/src/components/ornaments/Illustrations.tsx` : ajout `NightSkyBackdrop`.
- `client/src/pages/HomePage.tsx` : import `NightSkyBackdrop`, hero `isolate`, `NightSkyBackdrop variant="hero"`, constellation `dark:opacity-40`.
- `client/src/components/explore/PathAtlas.tsx` : import `NightSkyBackdrop`, conteneur `isolate`, `NightSkyBackdrop variant="panel"`.
- `client/public/splash/bg-claire.webp` : créé (q80, ~21 Ko).
- `client/public/splash/bg-sombre.webp` : créé (q83, ~97 Ko).
- `client/public/splash/bg-claire.png` : **supprimé**.
- `client/public/splash/bg-sombre.png` : **supprimé**.

### 2026-06-02 — Interactions front (carte navigable, verre dépoli, glossaire sticky)

Commandes de vérification :

- `npm run validate:content` : **exit 0**.
- `npm run lint` : **0 erreur, 15 warnings** (Fast Refresh).
- `npm run build` : **exit 0**.
- `/paths`, `/onboarding`, `/glossary` : **HTTP 200** en dev local.

Apport : `PathAtlas` navigable (pan, zoom molette / pinch, +/−, recentrage), boussole morphing Ikigai ; `SideNav` en verre dépoli à l'ouverture ; bandeau glossaire sticky (alphabet / domaines / recherche, lettre active) ; cahier Ikigai section `03.b` alignée sur `03`. (Détail dans §3 « Interactions front ».)

### 2026-06-07 — Clôture du glossaire VC

Commandes de vérification :

- `npm run validate:glossary` : **OK** — 357 termes, slugs uniques, `id === slug`, `seeAlso` / `relatedLessonIds`, marqueurs `[[slug|label]]`, collisions d'aliases.
- `npm run validate:content` : **exit 0**, warnings éditoriaux (leçons sans quiz).
- `npm run build` : **exit 0**, serveur + client.

Apport : glossaire final porté à **357 termes** (`data/glossary.json`) ; registre canonique à **433 entrées** (`glossary-ingestion/canonical-glossary.json`) — tous les `add` / `update` / `merge` retenus `applied`, `skip` hors injection ; audits PitchBook / SEC / Schoenherr couverts (entrées finales ou alias) ; contrôle custom `validate:glossary` câblé au workflow.

### 2026-06-10 — Intégration études de cas & navigation bibliothèque

Commandes de vérification :

- `npm run build --workspace client` : **exit 0**, sans erreur.
- `npm run build` : **exit 0**, build serveur + client complet.

Fichiers créés / modifiés :

- `client/src/pages/PathsPage.tsx` : accordéon sur les catégories, intégration `CASE_STUDIES`, `useSearchParams`.
- `client/src/i18n/routing.tsx` : ajout `isLinkActive`.
- `client/src/components/nav/SideNav.tsx`, `TopBar.tsx`, `Footer.tsx` : retrait des raccourcis « Études de cas ».
- `client/src/App.tsx` : redirection `/cases` → `/bibliotheque`, retrait import `CaseStudiesPage`.
- `client/src/pages/CaseStudyPage.tsx` : bouton retour vers `/bibliotheque`.

### 2026-06-11 — Accordéon parcours & aiguilleur de route

Commandes de vérification :

- `npm run build --workspace client` : **exit 0**, sans erreur TypeScript ni avertissement bundler.

Fichiers créés / modifiés :

- `client/src/pages/ParcoursPage.tsx` : accordéon sur les familles de parcours (`collapsedFamilies`, `ChevronDown`, `grid-rows-[0fr]/[1fr]`).
- `client/src/pages/PathDetailPage.tsx` : accordéon sur les cours d'un rayon legacy (`openCourses`, chevron, grille CSS).
- `client/src/pages/ParcoursOrSubjectPage.tsx` : **[NOUVEAU]** aiguilleur lazy détectant si un slug appartient à `parcours.json` ou `paths.json`, et rendant la page de détail correspondante.
- `client/src/App.tsx` : route `/paths/:slug` remplace `PathDetailPage` par `ParcoursOrSubjectPage` (import lazy).

### 2026-06-11 — Cours Power Law & Monte Carlo

Commandes de vérification :

- `npm run validate:content` : **exit 0**, contenu valide ; warning éditorial restant sur 23/62 leçons canoniques sans quiz.
- `npm run test --workspace client -- power-law` : **exit 0**, 11 tests Power Law passés.
- `npm run lint --workspace client` : **exit 0**, 0 erreur, warnings existants uniquement.
- `npm run build --workspace client` : **exit 0**, build client OK.
- Contrôle local de routes : `/fr/simulators/power-law-portfolio` et `/fr/courses/construction-portefeuille-loi-puissance` répondent en HTTP 200 via Vite.

Fichiers créés / modifiés :

- `data/courses.json` : ajout du cours canonique `c-power-law-portfolio`.
- `data/lessons.json` : ajout de 4 leçons `lpl-*` avec quiz, takeaways, glossaire et lectures liées.
- `data/paths.json` : rayon Portfolio enrichi avec le nouveau cours et l'objectif Monte Carlo.
- `data/parcours.json` : parcours `p-penser-gp` enrichi avec l'étape de cœur `c-power-law-portfolio`.
- `data/simulators.json` : simulateur Power Law relié en priorité aux 4 nouvelles leçons.
- `data/glossary.json` : références croisées mises à jour pour les termes Power Law / fund returner / portfolio construction / reserves / TVPI / MOIC.
- `client/src/pages/LessonPage.tsx`, `client/src/content/caseStudies.ts`, `scripts/validate-content.mjs` : résolution propre des `furtherReading` vers cours, cas et glossaire.

### 2026-06-12 — Repo hygiene & suite des recommandations d'audit

Commandes de vérification (branche `chore/flux-c-repo-hygiene`, exécutées en local) :

- `npm run validate:content` : **exit 0**, 1 warning éditorial (23/62 leçons sans quiz).
- `npm run lint` : **exit 0**, 0 erreur, **4 warnings** (`react-refresh` structurels).
- `npm run build` : **exit 0**, serveur + client.
- `npm run test --workspace client` : **10 fichiers / 59 tests** verts.
- `npm run test --workspace server` : **3 fichiers / 10 tests** verts (auth, profil, isolation `userId`).

Fichiers créés / modifiés :

- `.github/workflows/ci.yml` : `push` sur `main`/`master` (+ tests serveur dans le pipeline).
- `server/src/lib/async-handler.ts` : **[NOUVEAU]** wrapper `ah()` appliqué à tous les handlers (auth, content, me, admin, search).
- `server/prisma/seed.ts` : seed non destructif (`seedEditable`, `--force`), comptes démo gatés hors prod.
- `scripts/export-content.mjs` : **[NOUVEAU]** export DB → JSON (`npm run content:export`).
- `server/src/lib/auth.ts` : `getJwtSecretIssue()` (longueur + blocklist) ; `shouldRefreshToken` (rotation glissante) ; `attachUser` scoping.
- `server/src/app.ts` : `attachUser` monté sur `/me`/`/admin`/`/auth/me` ; rate-limit `/api/search`.
- `server/src/routes/me.ts` : `DELETE /me/profile` (profil + onboarding).
- `client/src/context/AuthContext.tsx` : `apiUp` re-sondé (intervalle 15 s + `focus`/`online`, restauration de session avant bascule).
- `client/src/context/UserDataContext.tsx` : `clearProfile` appelle `DELETE /me/profile`.
- `client/src/i18n/config.ts` + `SideNav`/`TopBar` : sélecteur EN masqué (`EN_ENABLED=false`).
- `scripts/split-lessons.mjs` : **[NOUVEAU]** split leçons (`lessons.index.json` / `lessons.bodies.json`) ; `content/lessons.ts` lazy ; `content/parcoursLessons.ts` supprimé ; `package.json` (`split:content`).
- `server/test/*` : **[NOUVEAU]** `auth.test.ts`, `profile.test.ts`, `isolation.test.ts`, `global-setup.ts`.
- Lint : `Briefcase` (SideNav) + prop morte `onToggleCollapse` (PathAtlas) retirés.


Fichiers créés / modifiés (repères) :

- `client/src/i18n/` : `config.ts`, `routing.tsx` (+ `routing.test.ts`), `guards.tsx`, `useLocale.ts`, `LocaleSwitcher.tsx`.
- `client/src/App.tsx` : routes sous `/:locale`, `RootRedirect` + `LocaleBoundary`, `<Routes>` aplaties (layout `PageShell`).
- Chrome : `TopBar`, `SideNav` (sélecteur FR/EN) ; ~27 fichiers migrés vers les wrappers `Link`/`NavLink`.
- Sécurité : `server/src/index.ts` (CORS dev-only, rate-limit), `server/src/lib/auth.ts` + `routes/auth.ts` (cookie-only, mdp ≥ 8), `client/src/lib/utils.ts` (`safeHttpUrl`), `GlossaryPage`, `IkigaiText`.
- Design tokens : `tokens.css` (`--error`/`--success`), `tailwind.config.ts` + sweep ~9 fichiers.
- Robustesse : `client/src/components/ErrorBoundary.tsx`.
- Tests / CI : **25 tests dans 7 fichiers** (couvrant i18n, simulateurs, `utils`, `ikigai`), `.github/workflows/ci.yml`.
- Contenu : `docs/parcours/*.md`, `data/parcours/01-le-vc-sans-bullshit.lessons.json`, `data/parcours/02-reussir-l-entretien-analyst.lessons.json` (13 leçons), `data/parcours.json`, `parcours.en.json`, `parcoursConfig.json`, `profileParcours.json`.
- Docs : `i18n_architecture_FR-EN.md` (ADR bilingue).

---

### 2026-06-13 — Espace « Décortiquer un écosystème » (dossiers, figures, skill)

Commande de vérification (branche `chore/flux-c-repo-hygiene`, en local) :

- `npm run validate:content` : **exit 0**, récap 62 leçons · 358 termes · 8 articles · **31 dossiers d'écosystème** · 9 simulateurs ; 1 lacune éditoriale non bloquante (23/62 leçons sans quiz).

Apport produit :

- **Nouvel espace `/ecosystemes`** (index + détail), distinct du blog, **100 % client** (`data/ecosystems.json`, type `EcosystemDossier`, **aucune table serveur**) — même pattern que les memos / l'anti-portfolio.
- **Dossiers vivants arborescents** (`parentId` + `order`, profondeur illimitée) : un dossier-racine porte une **thèse falsifiable** + des **convictions datées à degré d'assurance explicite** (exploratoire / moyenne / forte) + des **signaux directionnels** ; un sous-dossier approfondit un point. 31 dossiers au total (3 racines + 28 sous-dossiers), 66 sections, 24 convictions.
- **Figures natives theme-aware** (8 au total, 5 types : `bars`, `line`, `matrix`, `quadrant`, `taxonomy`) rendues en SVG/HTML **sans asset ni librairie de charting**.

Fichiers créés / modifiés (repères) :

- Données : `data/ecosystems.json` (**[NOUVEAU]**), `data/glossary.json` (terme `moat` ajouté, `split:content` rejoué).
- Client : `client/src/pages/EcosystemsPage.tsx` + `EcosystemPage.tsx`, `client/src/content/ecosystems.ts` (loader : `rootEcosystems`, `childEcosystems`, `ecosystemAncestors`), `client/src/components/ecosystems/EcosystemFigures.tsx` (**[NOUVEAU]**, `EcosystemFigureView`), `client/src/content/types.ts` (types `EcosystemDossier` / `EcosystemFigure`), `client/src/App.tsx` (routes `ecosystemes` / `ecosystemes/:slug`, lazy).
- Validation : `scripts/validate-content.mjs` (Zod strict : parent existant, absence de cycle, racine ⇒ thèse, `glossaryRefs`/marqueurs résolus, `discriminatedUnion` des figures).
- Authoring : skill projet `.claude/skills/ecosystemes/SKILL.md` (**[NOUVEAU]** — méthodo recherche / rédaction / figures / validation).

> Lecture stratégique : ce lot fait avancer concrètement le **Pilier 5 — Atlas** et le format « Décortiquer un écosystème » de la stratégie (voir `docs/STRATEGIE-vc-intelligence.md` §10.5 et §10.9), c'est-à-dire la couche **VC Intelligence** plutôt que la couche formation.

---

### 2026-06-13 — Audit indépendant (re-vérifié sur le code, hors discours des docs)

Audit complet demandé (positionnement, UX/UI, parcours, contenu, fonctionnalités, technique, benchmark, scoring). **Consigne explicite : ne pas se fier aux docs de stratégie/scoring** (potentiellement périmés ou auto-complaisants) → tout re-vérifié sur le code exécuté et les données brutes.

**Constat central (faits de code, pas de doc).** Le produit *est déjà* une plateforme d'intelligence VC par sa matière, mais sa vitrine se présente encore comme une école :

- Home (`client/src/pages/HomePage.tsx`) : CTA principal = « Commencer l'introspection » (ikigai), 3 étapes formation. Inchangée vs Phase 2 de la stratégie.
- Nav du haut (`client/src/components/chrome/TopBar.tsx`) : Parcours / Bibliothèque / Dictionnaire / Simulateurs / Analyses — **aucune entrée « Intelligence »**. Incohérence : `SideNav.tsx` expose en plus Anti-portfolio / Memos / Écosystèmes / Journal → les surfaces intelligence **n'existent pas dans la nav de la home** (`MainLayout` rend TopBar sur `/home`, SideNav ailleurs).
- Dashboard (`client/src/pages/DashboardPage.tsx`) : anneau de progression « X/Y leçons » + « Reprendre la lecture » — toujours progression-centric.
- Meta/OG par défaut (`client/index.html`, `client/src/lib/seo.ts`) : « plateforme d'introspection et d'apprentissage » = la carte sociale que voit un VC à qui on partage un lien.

**Preuve doc-indépendante de l'ambition réelle = les données elles-mêmes** (prose lue, pas crue) :

- Anti-portfolio (9) : structure decision-grade (`knownAtTheTime` daté, `missedSignal`, `steelman`, `costEstimate`, `sources` réelles). Ex. Airbnb : chronologie du connaissable, signal manqué formulé (dimensionner le produit vs le comportement débloqué), steelman crise 2008, sources Chesky/Wilson/BVP.
- Écosystèmes (31, 3 racines) : thèse contrarian falsifiable, convictions datées à assurance explicite, sources institutionnelles FR (INSEE/DREES/CNSA/Libault). Ex. *Silver économie* : « une étiquette, pas un marché ».
- Memos (5) : memos réels annotés (Sequoia/Bessemer/a16z), sourcés.

→ Personne ne produit ça pour un MOOC. **Le problème n'est ni le contenu ni la technique : c'est l'emballage (vitrine + nav + meta).**

**Comptes vérifiés sur `data/` (docs exacts) :** 358 termes · 31 écosystèmes (3 racines) · 9 anti-portfolio (+5 patterns) · 5 memos · 8 articles · 4 cas · 9 simulateurs · 51 leçons canoniques · 22 parcours · 16 cours.

**Corrections apportées à mes propres affirmations d'audit (intégrité) :**

- ❌ « anti-portfolio / memos / écosystèmes pas cherchables » → **faux**. `client/src/content/search.ts` les couvre (types `anti-portfolio` / `memo` / `ecosystem`). Seule la recherche **serveur** (`server/src/routes/search.ts`) les ignore → incohérence client/serveur, pas invisibilité. Rétrogradé de P1 à dette.
- 🔧 « ~260 Ko qui plombent le bundle » → nuancé : `import json from '@data/...'` mais module de recherche lazy + chunk par route lazy → poids sur la route concernée / la 1re recherche, pas sur le chargement initial.
- ✅ Confirmés sur le code : CSR pur (seul `react()` dans `client/vite.config.ts`, aucun prérendu) ; eco/anti-portfolio/memos **bundle-only** (aucune table Prisma) ; home/nav/dashboard/meta toujours « apprentissage ».

**Recalibrage (précision utilisateur).** Site en construction ; formation développée en premier *par séquencement assumé* : on la boucle, puis on la met de côté pour basculer sur la couche VC intelligence. → Le qualificatif « manque de courage » est retiré. Réserve maintenue : **finir la formation ≠ la laisser parler au nom du produit** ; on peut séquencer le *contenu* sans séquencer la *vitrine* (home / meta / 1re impression).

**Risque le plus coûteux maintenant que le contenu est jugé bon : CSR vs stratégie « public-first ».** Les unfurlers sociaux (LinkedIn/X/Slack) n'exécutent pas le JS → tout lien intelligence partagé affiche la carte par défaut « introspection/apprentissage ». Le prérendu éditorial (déjà §4 P1 « SEO ») **monte en criticité**.

**Décision de design retenue avec l'utilisateur — nav différenciée formation vs intelligence.** Idée utilisateur : sidebar/contenu différents selon la zone parcourue. Verdict : bon instinct, **un seul piège** = deux modes étanches (switch « Formation ⇄ Intelligence ») qui casseraient la pollinisation croisée (leçon → cas, dossier → fondamental), cœur du différenciateur. **Pattern retenu = B + C, jamais A :**

- **B — une seule nav primaire, deux zones groupées** : « Intelligence » en haut (Atlas / Cas & Memos / Analyses / Outils / Dictionnaire), « Apprendre les bases » en bas (repliable), « Espace » (Notes / Journal). La hiérarchie visuelle dit le 80/20 sans cloisonner. **Mettre la formation de côté plus tard = replier la zone basse (config, pas refonte).**
- **C — rail secondaire contextuel dérivé du type de contenu** : sur leçon/parcours → sommaire cours + progression + suivant + quiz ; sur dossier/cas/memo → dossiers reliés + sources + convictions + « ce qui me ferait changer d'avis » + enregistrer dans l'Espace.
- **3 conditions :** (1) le « mode » se **déduit** de la route/du contenu, jamais d'un état choisi par l'utilisateur (deep-links + futur partage le rendraient faux) ; (2) **présuppose la taxonomie** `contentKind` / `audience` dans les JSON (sinon hardcode de slugs → divergence) ; (3) entrée à froid penche Intelligence, formation à un clic.

**Scoring revu — voir §2, bloc « Révision 2026-06-13 » (global vs ambition : ~6/10 contre 8.3 vs MOOC).**

**Priorités issues de cet audit (ordre recommandé) :**

1. **Taxonomie** `contentKind` / `audience` dans les JSON + `scripts/validate-content.mjs` (socle de la nav à zones, des rails contextuels et du futur filtrage de vitrine).
2. **Nav primaire B** (deux zones groupées) + unifier `TopBar` / `SideNav`.
3. **Repositionner la home + meta/OG par défaut** (vitrine ≠ école), même pendant que la formation se termine.
4. **Rails contextuels C** au fil de l'étoffage de la couche intelligence.
5. **POC prérendu éditorial** (débloque le partage social du bon contenu).
6. Aligner la **recherche serveur** sur le client (eco / anti-portfolio / memos) — dette, pas P1.

---

## 9. Décision de priorisation → voir `Bilan.md` §10

La liste de priorisation et le cadrage par objectif (Maintenant / démo / pré-production / valeur long terme) sont consolidés dans **[Bilan.md](Bilan.md)** §10 (« Priorités recommandées » + « Priorité selon l'objectif visé »).
