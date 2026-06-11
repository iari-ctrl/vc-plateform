# Report et scoring - VC Premium Platform

Dernière mise à jour : 2026-06-11

Objet : conserver un historique lisible des avancées, corrections, points de vigilance et propositions d'enrichissement pour `vc-premium-platform`.

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

> Note de séquencement (issue des conversations) : garder design system tokenisé + tests/CI + Error Boundary (utiles tout de suite, peu de churn) ; **différer** le lot 🔴 (SSR/SEO, CSP/HSTS, garde JWT à corriger, contraste de l'or, interstitiel splash) jusqu'à un contenu réel et un déploiement. Priorité immédiate : les deux décisions d'architecture (rendu + modèle de contenu), puis une tranche verticale réelle.

Points confirmés lors du dernier audit (2026-06-10) :

- Le portail splash (`/`) est entièrement intégré, corrigé et responsive : boussole animée ikigai → compass, parallaxe, deux couches clair/sombre cross-fadées, toggle synchronisé avec le thème global.
- Le mode sombre de `/home` est rehaussé : ciel étoilé photographique en fond du hero et de la carte `PathAtlas`, conservant tous les tracés SVG existants.
- Les fonds photographiques sont en WebP (~118 Ko total contre ~3,4 Mo en PNG, soit ~97 % de réduction).
- Le cahier Ikigai reste une expérience centrale : 13 zones, deux niveaux de lecture, archétypes, réponses libres, sauvegarde locale et popovers de glossaire.
- Le glossaire a été enrichi : **357 termes** dans la base.
- `npm run validate:content` passe : 16 cours, 62 leçons canoniques, 8 simulateurs, 266 marqueurs `[[..]]` / `{{..}}` résolus dynamiquement.
- `npm run build` passe : serveur + client OK, assets WebP présents dans `dist/`.
- Le projet a un `.gitignore` qui couvre `node_modules`, `dist`, `.env`, SQLite et logs, et le dépôt Git est désormais initialisé : `master` suit `origin/master`, commit initial `e5b37e0 Initialisation du projet`.
- Le build client est désormais découpé : `index-*.js` ≈ 95 kB (28 kB gzip), `react-vendor` ≈ 232 kB (74 kB gzip), `lessons` et `glossary` séparés.

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
- ~~Aucune sécurité de durcissement.~~ **Lot partiel appliqué 2026-06-09** (auth cookie-only, mdp ≥ 8, **rate-limit fonctionnel**, CORS dev-only, `safeHttpUrl`). Reste le lot 🔴 : helmet, CSP/HSTS, **garde JWT notée inopérante à corriger**, CSRF.
- ~~Aucun test.~~ **Harnais Vitest robuste en place (25 tests sur 7 fichiers) + CI (2026-06-09).** Couvre `utils`, `ikigai`, simulateurs, et routing i18n.
- i18n Phase 1 compilée côté client ; restent le chrome traduit, la base `locale`, `hreflang` et le corpus EN.
- Fiches `data/parcours/*.lessons.json` rédigées mais **pas encore fusionnées** dans `data/lessons.json` / le seed.

---

## 2. Scoring actuel

| Axe | Score | Commentaire |
| --- | ---: | --- |
| Vision produit | 8.5 / 10 | Positionnement fort : introspection + apprentissage VC + premium éditorial. |
| UX globale | 8.1 / 10 | Portail d'entrée premium, cahier Ikigai fort, atlas navigable (pan/zoom/recentrage), `DesignSystemShowcasePage` existante pour l'interface. |
| Design / direction artistique | 8.6 / 10 | Identité atlas/carnet convaincante. Mode sombre rehaussé par ciel photographique. Portail splash à la hauteur. Barre latérale en verre dépoli. |
| Contenu pédagogique | 7.8 / 10 | Très complet : **22 parcours, 16 cours, 62 leçons canoniques (+ leçons drop-in de parcours), 4 études de cas, 8 simulateurs, 357 termes au glossaire**. Le nouveau cours Power Law/Monte Carlo renforce le chaînage théorie → simulateur. Attention : 23 leçons canoniques n'ont pas encore de quiz. |
| Technique front-end | 8.0 / 10 | Build OK (entry chunk ~100 kB, vendor React ~232 kB), lazy routes. Assets WebP. Routing i18n `/fr` `/en` en place. |
| Back-end / API | 7.5 / 10 | Architecture fonctionnelle. **Rate-limiting en place** (100 req/15min API, 20/15min auth). Reste helmet/CSP, garde JWT inopérante, CSRF. |
| Qualité / tests | 8.0 / 10 | Lint (0 erreur), validation contenu complète, **Vitest (25 tests sur 7 fichiers couvrant simulateurs/i18n/utils) + CI**. |
| Accessibilité | 8 / 10 | Focus trap + restauration modal, focus-visible inputs, aria-live toasts, role="alert" erreurs, ConfirmDialog, aria-labels simulateurs, `inert` splash. |
| SEO / distribution | 4 / 10 | Meta client-side, pas de prérendu ni d'OpenGraph par page. Mode de rendu (CSR vs SSG/SSR) à trancher avant d'agir. |
| i18n / bilinguisme | 5.5 / 10 | Architecture décidée (ADR) + Phase 1 (routing localisé) implémentée. Reste : chrome (Phase 2), base `locale` (Phase 4), `hreflang` (Phase 5), corpus EN. |
| Robustesse contenu / CMS | 7 / 10 | Validation Zod + refs complète. Pages branchées sur l'API avec fallback. CMS à étendre à la `locale`. |
| Performance assets | 8.2 / 10 | Fonds splash en WebP (~97 % de réduction). Entry JS/CSS optimisés. |

Score global estimé : **8.2 / 10**

Interprétation : très bonne base produit et éditoriale, déjà crédible pour une démo avancée et un portail premium. Avant lancement public, priorité aux garde-fous qualité, à la cohérence API/CMS et au SEO.

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

## 4. Corrections prioritaires

### P0 - Rétablir le lint — FAIT (2026-05-30)

- ESLint 9 (flat config), `typescript-eslint`, plugins hooks et react-refresh.
- Résultat : **0 erreur, 15 warnings** (HMR advisories non bloquants).

### P0 - Aligner pages détail et API — PARTIELLEMENT FAIT (2026-05-30)

- `BlogPostPage`, `CaseStudyPage`, `LessonPage` branchées.
- Restant : `PathDetailPage`, `CourseDetailPage`.

### P0 - Étendre `validate:content` — FAIT (2026-05-30)

Exit 0, avec warnings sur l'absence de quiz (environ 52 leçons sur 76 sans quiz).

### P1 - Durcir accessibilité et interactions — FAIT (2026-05-30 + 2026-06-01)

- Focus trap + restauration dans `Modal`.
- ARIA live toasts, role="alert" erreurs auth.
- `ConfirmDialog` sur suppressions.
- Corrections inputs simulateurs.
- État de sauvegarde Ikigai réinitialisé après modification.
- `inert` sur couche splash inactive (2026-06-01).

### P1 - Portail splash — FAIT (2026-06-01)

- Responsive (clamp, inset:0, règles mobile).
- Thème synchronisé (ThemeContext).
- Accessibilité (inert).
- WebP (−97 % sur les fonds).

### P1 - Mode sombre premium sur /home — FAIT (2026-06-01)

- `NightSkyBackdrop` hero + PathAtlas.
- Tracés SVG conservés.
- Mode clair inchangé.

### P1 - SEO et partage social

Problème :

- `usePageMeta` modifie le title et la meta description côté client.
- Sans prérendu, les pages de contenu restent faibles pour indexation et cartes sociales.

Actions recommandées :

- Ajouter prérendu statique des pages publiques de contenu.
- Générer meta OpenGraph par parcours, leçon, article et étude de cas.
- Ajouter canonical URL.
- Prévoir images OG génériques puis spécifiques.

### P1 - Sécurité production

Problèmes / manques :

- Cookie `secure: false` en dur pour le dev.
- Pas de `helmet`.
- (Le rate-limit a été correctement mis en place sur `/api/auth`).
- Auth par cookie sans protection CSRF dédiée sur routes mutatives.
- JWT secret par défaut possible si env absente.

Actions recommandées :

- Paramétrer `secure` selon `NODE_ENV`.
- Ajouter `helmet`, rate limit auth, politique CORS stricte en prod.
- Ajouter protection CSRF ou stratégie explicite SameSite + token.
- Refuser le démarrage prod avec secret par défaut.

---

## 5. Propositions d'enrichissement UX / produit

### Dashboard : Journal de bord

- Reprise de lecture principale avec temps restant.
- Prochaine action recommandée.
- Synthèse du cahier Ikigai.
- Dernières notes / citations.
- Progression par parcours.
- "Aujourd'hui, 20 minutes utiles" : une micro-session proposée.

### Lecture active

- Sommaire automatique depuis les titres `##`.
- Temps restant estimé.
- Barre de progression par section.
- Concepts rencontrés pendant la lecture.
- Navigation précédent/suivant plus visible.
- Mode "mémo" : résumé automatique des takeaways + notes personnelles.

### Atelier VC

- Deal memo builder.
- Cap table builder avancé.
- Conversion SAFE / BSA-AIR.
- Option pool shuffle.
- Stratégie de réserves.
- Term sheet clause par clause.
- Waterfall avec scénarios multiples.

### Dictionnaire vivant

- Rail alphabétique.
- Terme du jour.
- Graph de concepts reliés.
- Filtres par catégorie, niveau et usage.
- Bouton "Ajouter à mes notions à réviser".

### CMS éditorial

- États `draft`, `review`, `published`.
- Preview avant publication.
- Export JSON depuis la base.
- Indicateur "non versionné dans /data".
- Score de santé par contenu : relations, quiz, glossaire, longueur, liens.

---

## 6. Propositions d'enrichissement contenu

Priorité contenu :

1. Densifier les parcours `tous` :
   - `levee-de-fonds-cote-entrepreneur`
   - `devenir-analyst-associate-principal`
2. Viser 4 à 6 leçons par cours.
3. Ajouter quiz aux 23 leçons canoniques qui en manquent.
4. Ajouter cas réels européens.

Thèmes à ajouter :

- Marché secondaire et liquidité.
- Fund formation.
- Relations LP / GP.
- EIF, Bpifrance, fonds publics et écosystème européen.
- Construction de portefeuille.
- Réserves et follow-on.
- SAFE vs equity vs BSA-AIR.
- Term sheet clause par clause.
- Down rounds.
- Gouvernance et board.
- Sorties M&A / IPO / secondaire.
- Impact de l'IA sur le métier VC.
- Méthodes de valorisation : VC method, comparables, DCF, multiples.

Études de cas à créer :

- Cas européen de scale-up.
- Cas de fonds.
- Post-mortem d'échec.
- Down round annoté.
- Deal memo complet.

---

## 7. Plan d'action recommandé

### Phase 1 - Garde-fous

Statut : **FAIT (2026-05-30).**

- [x] Installer/configurer ESLint (0 erreur).
- [x] Étendre `validate:content` (Zod + refs + quiz).
- [ ] Tests unitaires sur calculateurs.

### Phase 2 - Cohérence API / CMS

Statut : **PARTIELLEMENT FAIT (2026-05-30).**

- [x] Brancher Blog, CaseStudy, Lesson sur l'API avec fallback bundle.
- [ ] Brancher Path, Course (endpoints prêts).
- [ ] Export JSON ou signal "non versionné".
- [ ] Preview CMS.

### Phase 3 - Accessibilité et UX critique

Statut : **FAIT (2026-05-30 + 2026-06-01).**

- [x] Focus trap + restauration focus dans `Modal`.
- [x] ARIA live sur les toasts admin, role="alert" sur erreurs auth.
- [x] `ConfirmDialog` sur suppressions notes et CMS.
- [x] Corrections inputs simulateurs (aria-label).
- [x] État de sauvegarde Ikigai réinitialisé après modification ou changement de mode.
- [x] `inert` sur couche splash inactive.

### Phase 3b - Portail splash et mode sombre premium

Statut : **FAIT (2026-06-01).**

- [x] Responsive splash (clamp, inset:0, mobile portrait + paysage).
- [x] Accessibilité splash (`inert` sur couche inactive).
- [x] Thème synchronisé (ThemeContext piloté par le toggle splash).
- [x] Fonds WebP (~97 % de réduction).
- [x] Ciel étoilé photographique sur hero + carte `/home` en sombre.
- [x] `NightSkyBackdrop` composant réutilisable.

### Phase 4 - SEO / performance

Statut : partiellement fait.

- Prérendu statique des pages publiques.
- OpenGraph.
- Chargement paresseux du contenu JSON : **fait pour le découpage par collection / route**.
- Audit bundle principal.
- Stratégie font-display / preloads critiques.

### Phase 5 - Expérience enrichie

Statut : à cadrer.

- Dashboard "Journal de bord".
- Lecture avec sommaire et concepts.
- Atelier VC.
- Dictionnaire vivant.
- CMS éditorial avancé.

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

## 9. Décision de priorisation

Recommandation actuelle :

1. ~~Corriger le lint.~~ FAIT.
2. ~~Étendre la validation contenu.~~ FAIT.
3. ~~Brancher les pages détail sur l'API (Blog, Case, Lesson).~~ FAIT.
4. ~~Corriger accessibilité modales / formulaires / suppressions.~~ FAIT.
5. ~~Intégrer et corriger le portail splash.~~ FAIT.
6. ~~Rehausser le mode sombre de l'accueil.~~ FAIT.
7. ~~Premier harnais de tests + CI.~~ FAIT (2026-06-09).
8. ~~Durcissement sécurité de base (auth cookie-only, rate-limit, CORS dev).~~ FAIT partiellement (2026-06-09).
9. ~~i18n Phase 1 (routing localisé).~~ FAIT (2026-06-09).
10. **Trancher le mode de rendu** (CSR vs SSG/SSR) — bloquant pour le SEO et l'authoring.
11. **Figer le modèle de contenu / authoring** (`data/*.json` + Prisma + CMS, avec `locale`).
12. Fusionner les fiches `data/parcours/*.lessons.json` dans `data/lessons.json` + seed ; synchroniser `parcours.json`.
13. Brancher Path/Course sur l'API.
14. i18n Phase 2 (chrome, dictionnaire maison local) puis corpus EN au fil de l'eau.
15. Enrichir dashboard et lecture active ; densifier les contenus.
16. Lot 🔴 différé (SSR/SEO, helmet/CSP/HSTS, **garde JWT à corriger**, contraste de l'or) — au pré-déploiement.
17. ~~Accordéon familles sur `/paths` (catalogue `ParcoursPage`).~~ **FAIT (2026-06-11).**
18. ~~Accordéon chapitres (cours) dans les rayons legacy `PathDetailPage`.~~ **FAIT (2026-06-11).**
19. ~~Aiguilleur de route `/paths/:slug` (`ParcoursOrSubjectPage`).~~ **FAIT (2026-06-11).**

Priorité stratégique :

- **Maintenant (le site n'est pas déployé, contenu de base en cours)** : trancher rendu + modèle de contenu, puis produire une tranche verticale réelle (un parcours complet). Ne pas optimiser perf/SEO/sécurité-déploiement contre des hypothèses.
- Si objectif = démo impressionnante : dashboard + lecture active + contenu visible.
- Si objectif = pré-production : décision de rendu + API détail + sécurité (lot 🔴) + SEO/i18n.
- Si objectif = valeur long terme : atelier VC + CMS éditorial + densification des parcours + traductions EN.
