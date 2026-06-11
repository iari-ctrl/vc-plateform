# Analyse & Plan d'Amélioration — VC Premium Platform

Dernière mise à jour : 2026-06-11

J'ai parcouru l'ensemble du dépôt : monorepo full-stack (client React 19 / Vite, serveur Express + Prisma + SQLite, contenu canonique JSON partagé). Le produit a une **identité forte** — premium éditorial, métaphore ikigai, et un **langage cartographique « atlas d'explorateur »** (boussole, sceaux de cire, carte interactive des parcours, monstres marins, 404 *Terra Incognita*) qui rend la navigation vivante sans trahir le sérieux. Le portail d'entrée clair/sombre, le mode sombre photographique de l'accueil, le cahier Ikigai et le glossaire sont maintenant à la hauteur de cette promesse.

Cette base est saine et cohérente. Les axes ci-dessous visent à la **durcir** (technique), la **fluidifier** (front-end), l'**enrichir visuellement** (UX/UI) et surtout à **étoffer le contenu** (formation + blog), qui est aujourd'hui un squelette de grande qualité mais encore mince.

> **État actuel du contenu :** 9 rayons · 22 parcours · 16 cours · 62 leçons canoniques (+ leçons drop-in de parcours côté client) · 357 termes de dictionnaire · 4 études de cas · 4 analyses · 8 simulateurs.

---

## 1. Technique : architecture, back-end, qualité

Le point le plus structurant est le **triangle JSON ↔ base ↔ CMS** : robuste mais avec des angles morts.

* **Intégrité du contenu (priorité haute).** `npm run validate:content` est opérationnel : schémas Zod stricts sur les JSON, unicité des ids/slugs, toutes les relations croisées, marqueurs `[[..]]`/`{{..}}` — exit 0. Warning éditorial courant : 23/62 leçons canoniques sans quiz. ✅ FAIT.
* **Glossaire VC enrichi et audité.** Le glossaire final contient désormais 357 termes, pilotés par un registre canonique de 433 entrées (`add`/`update`/`merge` appliqués, `skip` conservés hors injection). Les audits des ressources PitchBook, SEC et Schoenherr sont couverts : les termes principaux sont présents comme entrées finales ou alias. Le contrôle custom `npm run validate:glossary` vérifie slugs uniques, `id === slug`, `seeAlso`, `relatedLessonIds`, marqueurs `[[slug|label]]` et collisions d'aliases. ✅ FAIT (2026-06-07).
* **Divergence CMS ↔ JSON.** Le CMS écrit **uniquement en base** ; un `db:reset` re-seed depuis `data/` et **efface** les entrées créées via l'admin. **Proposition :** soit un bouton admin « Exporter vers JSON », soit afficher un bandeau « cette entrée n'est pas encore versionnée ». *(À faire)*
* **Recherche.** `searchText` est dénormalisé (bien), mais la recherche reste un LIKE/substring sans ranking ni tolérance aux fautes. **Proposition :** SQLite **FTS5**, scoring simple (titre > corps), surlignage des correspondances. *(À faire)*
* **Migrations.** Le projet utilise `prisma db push` (sans historique). OK pour le proto ; **passer à `prisma migrate`** avant la prod. *(Phase 5)*
* **Sécurité.** Cookie JWT httpOnly : bien. Lot partiel appliqué (2026-06-09) : auth cookie-only (token hors body, `Bearer` retiré), mot de passe ≥ 8 à l'inscription, rate-limiter 20/15 min sur login/register, CORS localhost limité au dev, garde `safeHttpUrl()` + markdown sans `innerHTML`. **Reste pour la prod (lot 🔴 différé) :** `secure: true` derrière HTTPS, helmet, en-têtes CSP/HSTS, protection CSRF, et **corriger la garde JWT notée inopérante**. *(Phase 6)*
* **Tests (harnais en place).** Vitest couvre 25 tests sur 7 fichiers (i18n, utils, ikigai, simulateurs) + une suite ciblée Power Law de 11 tests ; étape CI (`client/vitest.config.ts`, `.github/workflows/ci.yml`). **Reste, par ordre de rentabilité :** élargir les calculateurs non couverts et ajouter quelques tests d'**API**. *(À faire)*
* **i18n FR/EN — Phase 1 implémentée (2026-06-09).** Module `client/src/i18n/` (config/routing/guards/useLocale/LocaleSwitcher + `routing.test.ts`), `App.tsx` sous `/:locale`, redirection racine crawler-safe, sélecteur FR/EN (TopBar + SideNav), ~27 fichiers migrés ; marqueurs `[[..]]`/`{{..}}` inchangés (slugs canoniques). Amorce corpus EN : `data/parcours.en.json`. **Reste :** Phase 2 (i18n du chrome, dictionnaire maison local retenu), Phase 4 (base `locale` + clé composite), Phase 5 (`hreflang` — couplé au rendu). Voir `i18n_architecture_FR-EN.md`. *(À faire)*
* **Taille du bundle.** Le découpage par routes et collections est maintenant effectif : `index-*.js` ≈ **95 kB (28 kB gzip)**, `react-vendor` ≈ **232 kB (74 kB gzip)**, `lessons` ≈ **49 kB** et `glossary` ≈ **40 kB** en chunks séparés. **Reste :** audit CSS/fonts, preloads critiques et stratégie de prérendu. *(Phase 4)*
* **Assets.** Fonds photographiques de la splash désormais en WebP (~118 Ko total vs ~3,4 Mo en PNG — **✅ FAIT 2026-06-01**). Aucun PNG résiduel dans `public/splash/`.

## 2. Front-end : performance, SEO, lecture

* **Mode de rendu — décision d'architecture ouverte (analyse faite 2026-06-09).** Le projet est en **CSR pur** (SPA Vite + React 19, SEO via `usePageMeta` côté client). Analyse comparée CSR/SSR menée : recommandation **hybride** — SSG/ISR pour la partie éditoriale (candidats Astro si l'éditorial domine, Next.js pour tout unifier sous React), CSR conservé pour l'app authentifiée. À **trancher avant de produire le contenu en masse** (impacte le SEO *et* la façon d'écrire/charger le contenu). Le lot SEO concret (prérendu, OpenGraph par page, `hreflang`) suit cette décision et reste **différé au pré-lancement**. *(Décision à prendre)*
* **Lecture active (LessonPage / BlogPostPage).** L'API renvoie déjà `prev`/`next` et la structure existe — **barre de progression de lecture** (scroll), **temps restant**, **sommaire** auto depuis les `##`, bouton « marquer comme lu » bien visible, navigation prev/next soignée. *(À faire)*
* **Transitions de pages.** La **View Transitions API** (peu coûteuse) renforcerait l'effet « livre interactif ». *(À faire)*
* **`Reveal` au scroll.** Le contenu démarre en `opacity-0` jusqu'à l'`IntersectionObserver`. **Proposition :** révéler après un timeout max de sécurité. *(À faire)*
* **Mobile / Atlas.** La carte `PathAtlas` est désormais **navigable** : pan (grab), zoom molette centré curseur, **pinch tactile**, boutons +/− et recentrage, avec bornage zoom/translation et seuil clic-vs-drag (4 px) — modèle calqué sur `VC PortfolioJourney/map.html`. ✅ FAIT (2026-06-02). **Reste :** sur très petit écran, garder la liste de chips en repli ; un bottom-sheet dédié pour l'encart de détail mobile reste souhaitable. *(À faire)*
* **Glossaire.** `/glossary` dispose maintenant d'un bandeau sticky compact (alphabet + domaines + recherche), avec lettre active suivie au scroll/clic, offsets d'ancre dynamiques et respect de `prefers-reduced-motion`. ✅ FAIT (2026-06-02). **Reste :** éventuellement ajouter un raccourci clavier ou un indicateur de nombre de résultats par filtre.
* **Dictionnaire vivant automatique dans les cours.** Règle produit appliquée : tout terme technique / sigle d'une leçon a un popover (terme + définition brève) cliquable redirigeant vers le dictionnaire. `client/src/lib/markdown.tsx` détecte automatiquement les termes du glossaire (matcher sur 357 termes + alias) et lie la **première occurrence** de chacun ; les marqueurs manuels `[[..]]`/`{{..}}` restent prioritaires. Sigles matchés en respectant la casse, popover réduit à `term + short`, panneau entier cliquable → `/glossary?term=slug`. Portée : leçons + définitions `/glossary` (études de cas / blog restent manuels). ✅ FAIT (2026-06-09). **Reste :** option pour désactiver l'auto-détection à l'intérieur du dictionnaire (auto-lien d'un terme vers sa propre fiche) si jugé redondant.

## 3. Design UX/UI : étendre l'« atlas d'explorateur »

Le système cartographique irrigue désormais l'entrée (portail splash animé), l'accueil en mode sombre (ciel étoilé photographique sur hero + carte), et toute la navigation. Les tracés cartographiques (constellation SVG, sceaux, routes pointillées, rose des vents) restent lisibles au-dessus de la photo en mode sombre grâce à `NightSkyBackdrop` et ses voiles de lisibilité. La carte `PathAtlas` est désormais **manipulable comme une vraie carte** (pan, zoom molette/pinch, +/−, recentrage), sa boussole se transforme en quatre cercles Ikigai avec les mêmes accents que `/onboarding`, et la barre latérale `SideNav` adopte un **verre dépoli à l'ouverture** (✅ 2026-06-02). Le cahier Ikigai est aussi plus homogène : la section `03.b` reprend l'affichage éditorial ouvert de la section `03`.

Reste à étendre :

* **Dashboard = « Journal de bord ».** Reprise de lecture en 1 clic (temps restant), 3 suggestions selon le profil, anneaux de progression, dernières notes — habillé en carnet d'explorateur. *(À faire)*
* **Lecture des leçons.** `DropCap` illuminée sur le premier paragraphe, `FleuronDivider` entre sections, `InkStamp` « Lu » sur les leçons terminées. *(À faire)*
* **Études de cas = dossiers annotés.** Cartouche, tampon de date (`InkStamp`), mise en page « archive ». *(À faire)*
* **Accessibilité (A11y).** L'audit `inert` sur la splash est fait ✅. Reste : contraste or-sur-parchemin pour les petits textes, ARIA sur les **inputs de simulateurs** (fait ✅), ordre de focus sur l'Atlas (tabIndex/clavier déjà en place). *(Vérification en continu)*

## 4. Contenu : formation & blog (le plus gros levier de valeur)

La structure est en plein essor, avec **62 leçons canoniques / 16 cours** dans `data/lessons.json` (plus des leçons de parcours drop-in servies côté client). C'est ici que se gagne la crédibilité « école privée ».

* **Pipeline d'authoring en place (2026-06-09).** La conception et la rédaction des parcours passent désormais par `docs/parcours/` (`parcours-apprentissage-conception.md`, puis un doc par parcours) et produisent des fiches de leçons **drop-in** dans `data/parcours/*.lessons.json` (schéma `Lesson` exact). Deux premiers parcours sont rédigés de bout en bout ; « Réussir l'entretien Analyst » compte **13 leçons** (cours `c-entretien-analyst`, ids `lea-*`, toutes avec `keyTakeaways`/`quiz`/`glossaryRefs`/`furtherReading`, marqueurs vérifiés). **Reste à faire :** fusionner ces fiches dans `data/lessons.json` + seed, et synchroniser `parcours.json` (`p-entretien-analyst` : 11 étapes ↔ 13 leçons).
* **Cours Power Law & Monte Carlo (2026-06-11).** `c-power-law-portfolio` est canonique dans Portfolio avec 4 leçons `lpl-*`. Il explique moyenne vs médiane en VC, pourquoi Monte Carlo rend visible une distribution de scénarios, le moteur déterministe du simulateur, puis la lecture TVPI/concentration/fund returner. Le simulateur Power Law, `p-penser-gp`, les `furtherReading` et le glossaire pointent vers ce bloc. ✅ FAIT.
* **Densifier la formation.** Viser **4–6 leçons par cours** et **≥ 2 cours par parcours**. Prioriser les deux parcours `tous`.
* **Combler les angles morts thématiques :** marché secondaire & liquidité ; fund formation / relations LP / rôle BPI–EIF ; construction de portefeuille & réserves ; méthodes de valorisation ; cap table & SAFE vs equity ; term sheet clause par clause ; down rounds & gouvernance/board ; sorties (M&A/IPO/secondaire) ; spécificités européennes ; impact de l'IA.
* **Cohérence pédagogique.** Chaque leçon doit avoir `keyTakeaways` + `quiz`, et chaque `[[slug]]` doit exister dans le dictionnaire.
* **Blog / Analyses (4 articles).** Calendrier éditorial : manifeste (déjà lié ✅), deal teardowns, « thèse du mois », notes écosystème européen, guides de carrière.
* **Études de cas (4).** Ajouter un cas européen, un cas de fonds, un post-mortem d'échec et un down round annoté.
* **Simulateurs.** Les 8 simulateurs existants sont reliés à des blocs pédagogiques. Prochains ajouts utiles : constructeur de cap table, conversion SAFE/BSA-AIR, clauses de term sheet avec scénarios multiples.

---

> [!IMPORTANT]
> ## Bilan des priorités au 2026-06-01
>
> **FAIT — Phases 1-3 + 3b :**
> - Lint (0 erreur) ✅
> - `validate:content` (Zod + refs + quiz) ✅
> - API pour Blog / CaseStudy / LessonPage ✅
> - Accessibilité modales / formulaires / suppressions / splash ✅
> - Portail splash : responsive, inert, ThemeContext, WebP ✅
> - Mode sombre premium : `NightSkyBackdrop` hero + PathAtlas ✅
> - Découpage bundle : vendor React stable + collections JSON hors entry chunk ✅
>
> **FAIT — Interactions front (2026-06-02) :**
> - Carte `PathAtlas` navigable : pan (grab), zoom molette centré curseur, pinch, boutons +/−, recentrage, bornage zoom/translation ✅
> - Boussole `PathAtlas` : morphing Ikigai coloré avec les accents de `data/ikigai.json`, hover maintenu sur toute la surface des cercles ✅
> - Barre latérale `SideNav` : verre dépoli à l'ouverture (`.glass-rail[data-open]`, teinte `--surface-container`) ✅
> - Glossaire : alphabet + filtres + recherche sticky, lettre active colorée au scroll/clic, offsets d'ancre dynamiques ✅
> - Cahier Ikigai : section `03.b` alignée visuellement sur la section `03` (liste éditoriale, numérotation romaine, alerte/piège) ✅
>
> **FAIT — Clôture glossaire VC (2026-06-07) :**
> - Registre canonique : 433 entrées, dont 296 `add|applied`, 61 `update|applied`, 46 `merge|applied`, 30 `skip` conservés hors injection ✅
> - Glossaire final : 357 termes, audits PitchBook / SEC / Schoenherr intégrés ou couverts par alias ✅
> - `npm run validate:glossary` ajouté au workflow : unicité, `id === slug`, liens, marqueurs et aliases ✅
>
> **FAIT — i18n, sécurité & tests (2026-06-09) :**
> - i18n Phase 1 (routing localisé `/fr` `/en`) : module `client/src/i18n/`, `App.tsx` sous `/:locale`, redirection racine crawler-safe, sélecteur FR/EN (TopBar + SideNav), ~27 fichiers migrés ✅
> - Lot durcissement sécurité/qualité (12 correctifs) : CORS dev-only, auth cookie-only, mdp ≥ 8 + rate-limit auth, markdown sûr + `safeHttpUrl()`, tokens `--error`/`--success`, Error Boundary route, micro-opts splash/quiz/profile-result ✅
> - Harnais Vitest robuste (25 tests sur 7 fichiers) + étape CI ✅
> - Pipeline parcours : `docs/parcours/` + `data/parcours/*.lessons.json`, 2 parcours rédigés (dont 13 leçons « entretien Analyst ») ✅
> - Simulateurs réels : intégration des formules professionnelles, blocs pédagogiques dédiés et glossaire interactif inline ✅
> - Pré-requis de parcours : nouveau champ `prerequisites` (Markdown inline) rendu dynamiquement et peuplé pour tous les parcours ✅
>
> **FAIT — Power Law & Monte Carlo (2026-06-11) :**
> - Cours canonique `c-power-law-portfolio` + 4 leçons `lpl-*` dans Portfolio ✅
> - Simulateur Power Law relié en priorité à ces leçons ; glossaire et lectures liées mis à jour ✅
> - Vérifications : `validate:content`, test Power Law, lint client, build client et routes locales 200 ✅
>
> **À DÉCIDER (avant production de contenu) :**
> - **Mode de rendu** : CSR vs SSR/prerender (hybride SSG/ISR recommandé) — voir §2
> - **Modèle de contenu / authoring** : figer `data/*.json` + Prisma + CMS, en intégrant la `locale`
>
> **À FAIRE — Phases 2/4/5 :**
> - A — Crédibilité contenu : fusionner les fiches parcours dans `lessons.json` + seed, densifier formation + blog + études de cas
> - B — Solidité technique / mise en prod : décision de rendu puis SEO/prérendu, sécurité auth (lot 🔴 : helmet/CSP/HSTS, garde JWT à corriger), Postgres + migrations, brancher Path/Course sur l'API, base `locale` (i18n Phase 4)
> - C — Plaisir d'usage : dashboard journal de bord, transitions de pages, progression de lecture
> - D — i18n : Phase 2 (chrome, dictionnaire maison local), Phase 5 (`hreflang`, couplé au rendu), corpus EN au fil de l'eau

## Plan d'action proposé (prochaines phases)

### Phase 0 — Décisions d'architecture (bloquant pour la production de contenu)
#### [DONE] Version Control / baseline Git : dépôt initialisé et vérifié le 2026-06-11 ; `master` suit `origin/master`, commit initial `e5b37e0`.
#### [DECIDE] Mode de rendu : CSR (actuel) vs prérendu/SSG (hybride recommandé). Conditionne SEO + authoring.
#### [DECIDE] Modèle de contenu / workflow d'authoring (`data/*.json` + Prisma + CMS), avec `locale`.
#### [VERIFY] Valider la Phase 1 i18n en local : `npm run build` + `npm run test --workspace client`.

### Phase i18n — Bilinguisme FR/EN (voir `i18n_architecture_FR-EN.md`)
#### [DONE] Phase 1 — routing localisé `/fr` `/en` (`client/src/i18n/`, `App.tsx` sous `/:locale`, redirection racine, sélecteur).
#### [ADD] Phase 2 — i18n du chrome (dictionnaire maison local typé `{fr,en}` + hook `useT()`), page par page.
#### [MODIFY] Phase 4 — Prisma `locale` + `@@unique([slug, locale])`, `seed.ts` itère les langues, routes `content.ts` par `locale`.
#### [ADD] Phase 5 — `hreflang`/`canonical`/`lang` dans le head (couplé au choix de rendu) + corpus EN au fil de l'eau.

### Phase 2 (suite) — Cohérence API / CMS
#### [MODIFY] `client/src/pages/PathDetailPage.tsx` / `CourseDetailPage.tsx` — brancher sur `useApiItem` avec fallback bundle (endpoints `/content/paths/:slug` et `/content/courses/:slug` déjà prêts côté serveur).
#### [ADD] Signal « non versionné dans /data » dans l'AdminPage.
#### [ADD] Preview CMS pour articles et études de cas.

### Phase 4 — Front-end : SEO & performance
#### [ADD] Prérendu statique (vite-plugin-ssg ou react-snap) + images OpenGraph.
#### [MODIFY] `client/src/lib/seo.ts` — canonical URL, meta OG.
#### [DONE] `client/src/content/index.ts` / `client/vite.config.ts` — collections JSON séparées par modules, vendor React isolé dans `react-vendor`, entry chunk réduit.
#### [ADD] Audit CSS/fonts et preloads critiques.
#### [MODIFY] `client/src/App.tsx` — View Transitions sur les changements de route.

### Phase 5 — Extension cartographique (Dashboard/lecture)
#### [MODIFY] `client/src/pages/DashboardPage.tsx` — refonte « journal de bord ».
#### [MODIFY] `client/src/pages/LessonPage.tsx` — sommaire auto `##`, barre de progression, DropCap, FleuronDivider.
#### [MODIFY] `client/src/pages/CaseStudyPage.tsx` — habillage « dossier annoté ».

### Phase 6 — Mise en production
#### [MODIFY] `server/prisma/schema.prisma` — `provider = "postgresql"` + `prisma migrate`.
#### [MODIFY] `server/src/*` — helmet, rate-limit `/auth`, cookie `secure`, CSRF.

## Plan de vérification
1. **Contenu** : `npm run validate:content` passe (zéro référence cassée), puis `npm run db:seed` affiche le récap attendu.
2. **Régression** : `npm run build` propre + `npm run lint`.
3. **Lecture/UX** : barre de progression, sommaire, prev/next testés sur une leçon ; Atlas utilisable au **clavier** et sur **mobile** (DevTools).
4. **SEO** : pages de contenu prérendues, balises meta + OG présentes dans le HTML servi.
5. **Thèmes** : rendu correct en **clair et sombre** (hero + carte), `prefers-reduced-motion` respecté.
6. **Portail** : splash lisible sur mobile portrait (390 px) et paysage court (640×360), toggle clair/sombre persistant sur `/home`.
7. **Tests** : suite Vitest verte (calculateurs + intégrité contenu).
