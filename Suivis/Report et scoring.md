# Report et scoring - VC Premium Platform

> [!IMPORTANT]
> **Statut documentaire — 2026-06-28**
> - Dernière révision de fond indiquée : 2026-06-28 (§1, §2, §3, §8).
> - Périmètre : journal daté des travaux, vérifications et scoring produit.
> - Nature : **journal de suivi — historique par construction**. Les entrées datées antérieures gardent parfois leurs compteurs et diagnostics du moment ; l'état courant est celui des sections §1, §2 et de l'entrée §8 du 2026-06-28.
> - État réconcilié avec le dépôt courant : contenu **22 parcours · 9 rayons · 16 cours · 66 leçons servables · 374 termes · 6 cas · 2 livrables · 8 articles · 31 écosystèmes · 9 simulateurs**.
> - État technique courant : rendu public **CSR + prérendu statique** (`scripts/prerender.mjs` + `scripts/collect-routes.mjs`), déploiement GitHub Pages via `.github/workflows/deploy-pages.yml`, `CourseDetailPage` API-first, `PathDetailPage` encore bundle-first.
> - Vérifications courantes : `validate:content` OK, `validate:glossary` OK ; derniers contrôles complets consignés : lint OK 4 warnings, client **13 fichiers / 74 tests**, serveur **4 fichiers / 11 tests**, build/prérendu complet du 2026-06-26.

Dernière mise à jour : 2026-06-28

Objet : conserver le **journal daté** des avancées et des vérifications de `vc-premium-platform`, et le **scoring** du produit.

> **Périmètre des docs de suivi.** Ce document est le **journal + le scoring**. L'**état de synthèse, les risques, les priorités et le backlog prospectif** vivent dans [Bilan.md](Bilan.md). La **stratégie cible** est dans [docs/STRATEGIE-vc-intelligence.md](../docs/STRATEGIE-vc-intelligence.md).

---

## 1. État global observé

État courant au **2026-06-28** : `vc-premium-platform` est maintenant une plateforme d'intelligence VC en construction avancée, pas seulement une app de formation. La couche pédagogique reste solide (parcours, cours, leçons, quiz, glossaire vivant, simulateurs), mais la vitrine et l'IA publique ont été réorientées vers trois piliers : **Intelligence VC**, **Formation**, **Workspace**.

Acquis majeurs vérifiés :

- **Contenu servable** : 22 parcours, 9 rayons hérités, 16 cours, 55 leçons canoniques + 11 leçons drop-in, 374 termes, 6 études de cas, 2 livrables, 8 articles, 31 dossiers d'écosystème, 9 simulateurs, 9 entrées d'anti-portfolio et 5 mémos annotés.
- **Navigation / vitrine** : `/intelligence`, `/convictions`, `/decisions`, `/methode`, `/livrables` structurent les contenus existants sans déplacer les URLs de détail ; `/blog` devient « Analyses & notes de recherche » ; `/bibliotheque` met les rayons au premier plan.
- **Rendu public** : l'ancien arbitrage de rendu n'est plus ouvert au niveau prototype ; le mode retenu est **CSR + prérendu statique public**. `scripts/collect-routes.mjs` fournit les routes, `scripts/prerender.mjs` écrit les HTML par route après build, et `.github/workflows/deploy-pages.yml` publie le frontend statique sur GitHub Pages.
- **API / fallback** : Blog, CaseStudy, Lesson, ParcoursDetail et `CourseDetailPage` utilisent l'API avec fallback bundle ; `PathDetailPage` reste encore bundle-first pour les rayons hérités.
- **Recherche** : la recherche locale couvre aussi livrables, anti-portfolio, mémos et écosystèmes ; `/api/search` reste plus étroit et constitue une dette visible.
- **Design system** : tokens CSS, mode sombre, portail splash, `NightSkyBackdrop`, cartes éditoriales, `SideNav` off-screen + verre dépoli, `PathAtlas` manipulable, lecture active et popovers de glossaire sont documentés et cohérents avec le code courant.
- **Qualité** : `validate:content` OK, `validate:glossary` OK, lint OK avec 4 warnings structurels connus, tests client 13 fichiers / 74 tests, tests serveur 4 fichiers / 11 tests hors sandbox.

Points fragiles actuels :

- `PathDetailPage` doit être branchée sur `/content/paths/:slug` avec fallback bundle, comme `CourseDetailPage`.
- Le prérendu améliore SEO et partage social, mais les cartes sociales réelles restent à vérifier sur domaine déployé (`VITE_SITE_URL`, canonical, OG spécifiques, `hreflang`).
- Le workflow GitHub présent est un **déploiement Pages**, pas une CI complète : il build le client statique, mais ne remplace pas un pipeline validation/lint/tests complet.
- Le CMS reste à cadrer : preview éditoriale, signal de contenu non exporté vers `/data`, et boucle `content:export -> validate -> commit`.
- Le durcissement production reste partiel : `helmet` et bases serveur existent, mais CSP/HSTS stricts, cookie `secure`, CSRF et politique de rotation JWT restent à trancher avant production réelle.
- L'i18n EN est architecturée mais masquée (`EN_ENABLED=false`) tant que chrome et corpus ne sont pas livrés.

Lecture générale : la base produit est crédible pour une démo publique statique et pour poursuivre l'écriture. Le prochain palier n'est pas de « prouver le contenu », mais de verrouiller le workflow éditorial, fiabiliser la publication publique, et aligner les dernières surfaces serveur/client.

---

## 2. Scoring actuel

| Axe | Score | Commentaire |
| --- | ---: | --- |
| Vision produit | 8.6 / 10 | Positionnement désormais plus clair : intelligence VC + formation + workspace. La couche Ikigai reste différenciante, mais ne doit plus dominer la promesse publique. |
| UX globale | 8.3 / 10 | IA en trois piliers, portail premium, atlas navigable, lecture active, recherche locale complète. Restent dashboard/journal de bord, rails contextuels et reprise de lecture à densifier. |
| Design / direction artistique | 8.6 / 10 | Identité atlas/carnet solide, mode sombre photographique, splash single-stage, `SideNav` off-screen + verre dépoli, showcase interne. |
| Contenu pédagogique & intelligence | 8.3 / 10 | Très bon socle : 22 parcours, 16 cours, 66 leçons servables, 374 termes, 31 écosystèmes, 9 anti-portfolio, 5 mémos, 8 articles, 6 cas, 2 livrables, 9 simulateurs. À renforcer : cas décisionnels, livrables, cours courts. |
| Technique front-end | 8.5 / 10 | React/Vite/Tailwind propre, lazy routes, contenu scindé, pages-index intelligence, prérendu statique public, GitHub Pages frontend-only. |
| Back-end / API | 8.1 / 10 | API fonctionnelle, seed non destructif, auth cookie httpOnly, rate limits, wrapper async, `content.allLessons()`. Dette : `/api/search` plus étroit que la recherche locale, `PathDetailPage` bundle-first. |
| Qualité / tests | 8.6 / 10 | Validation contenu/glossaire OK, lint OK 4 warnings, client 13 fichiers / 74 tests, serveur 4 fichiers / 11 tests hors sandbox. Manque un workflow CI complet dans `.github/workflows`. |
| Accessibilité | 8.2 / 10 | Focus visible, modales avec focus trap/restauration, `ConfirmDialog`, loaders `role=status`, `inert` SideNav fermée, splash décoratif `aria-hidden`. À compléter par audits clavier/contraste production. |
| SEO / distribution | 6.7 / 10 | Gros progrès : prérendu statique et sitemap partagé. Risque restant : validation sur domaine réel, cartes sociales par contenu, canonical, `hreflang`, images OG spécifiques. |
| i18n / bilinguisme | 5.8 / 10 | Routing `/fr` `/en`, `LocaleSwitcher` prêt, `<html lang>` gardé honnête tant que `EN_ENABLED=false`. Reste traduction chrome/corpus et `hreflang` public validé. |
| Robustesse contenu / CMS | 7.3 / 10 | JSON source-of-truth, `content:export`, blog par fichier, validation Zod. Manquent preview CMS, signal non versionné, workflow éditorial verrouillé. |
| Performance assets | 8.4 / 10 | WebP, routes lazy, glossaire/leçons scindés, prérendu. À revoir après mesures réelles Pages et captures mobile. |

Score global produit estimé : **8.3 / 10**

Score global **vs ambition VC Intelligence** : **7.1 / 10**

Interprétation : la plateforme a franchi le cap où elle n'est plus seulement un MOOC premium. Les corrections de vitrine, de navigation et de prérendu ont réduit l'écart identifié le 2026-06-13. L'ambition VC Intelligence reste toutefois plus haute que l'état livré : il faut encore plus de cas décisionnels, de rails contextuels, de recherche serveur alignée, et une publication publique vérifiée sur domaine réel.

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

- panneau desktop `--sidebar-w` (16rem) garé hors écran quand fermé ; `MainLayout` réserve seulement la gouttière `--sidebar-rail` (4rem) pour le logo et le bouton `Menu` ;
- état fermé : panneau complet hors écran et `inert={!open}`, base quasi-opaque (`--surface` ~90 %, `blur(6px)`) utilisée comme état de transition ;
- état ouvert : verre dépoli en overlay, fond transparent, `backdrop-filter: blur(14px) saturate(165%) contrast(104%)`, bordure `outline-variant` ~52 %, ombres latérales et lisérés internes ;
- transitions animées (`background-color`, `box-shadow`, `border-color`, `backdrop-filter`, translation) + fallback `@supports not (backdrop-filter)` ;
- correctif de fond : éviter un remplissage opaque proche de `--surface`/`--background` et laisser le flou, la bordure et l'ombre porter la lisibilité.

### Portail splash (2026-06-01, modèle courant réconcilié 2026-06-28)

Statut : en place, intégré et corrigé.

Éléments observés :

- Portail single-stage dans `client/src/pages/home/SplashPage.tsx`, avec styles dédiés dans `client/src/styles/splash.css` et `CompassIkigaiIntro`.
- Système de tokens piloté par `.splash-portal[data-mode='light'|'dark']`.
- Photos claire/sombre superposées dans `.splash-photos` (`aria-hidden`) ; la bascule ne duplique pas de contenu focusable.
- Transition « Aube » via Web Animations API : opacité photo sombre, filtre photo claire, flare d'horizon et révélation des étoiles.
- Boussole animée : intro ikigai (4 cercles dorés) → compass en ~5 s, puis hoverable.
- Sceaux de cire dérivants avec parallaxe souris.
- Toggle "Choisissez votre lumière" — segment doré.
- Fonds photographiques en WebP : `bg-claire.webp` (~21 Ko, q80), `bg-sombre.webp` (~97 Ko, q83).

Corrections apportées (2026-06-01) :

- Responsive : suppression du scaling artboard 1440×900 ; le stage remplit le viewport, titre `clamp(1.6rem, 2.4vw, 2.6rem)`, règles mobile portrait et paysage court.
- Accessibilité : les couches décoratives sont `aria-hidden`, le toggle est un `radiogroup`, et il n'existe plus de second lien « Entrer » masqué.
- Thème synchronisé : le toggle pilote `useTheme()` (ThemeContext global) ; le mode choisi persiste sur `/home` et dans toute l'app.
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

- Schémas Zod stricts sur les collections JSON structurantes.
- Unicité des `id` et `slug` vérifiée.
- Toutes les relations structurantes vérifiées.
- Règle quiz : malformation = erreur bloquante ; absence = warning.
- Marqueurs `[[..]]` / `{{..}}` vérifiés.
- `npm run validate:content` : exit 0, sans warning éditorial (toutes les leçons ont désormais un quiz).

### Build, prérendu et architecture

Statut : sain, assets optimisés, prérendu public branché.

- dernier build complet/prérendu consigné le 2026-06-26 : serveur + client OK, `postbuild` → `scripts/prerender.mjs`.
- `scripts/collect-routes.mjs` alimente à la fois le sitemap et le prérendu ; inventaire courant : 573 routes publiques, sitemap FR/EN, prérendu FR tant que `EN_ENABLED=false`.
- Fonds splash : WebP uniquement dans `public/splash/` et `dist/splash/`.
- `BlogPostPage`, `CaseStudyPage`, `LessonPage`, `ParcoursDetailPage`, `CourseDetailPage` : branchées sur l'API avec fallback bundle.
- `PathDetailPage` : encore bundle-first pour les rayons hérités (endpoint `/content/paths/:slug` prêt côté serveur).
- `.github/workflows/deploy-pages.yml` déploie le frontend statique sur GitHub Pages avec `VITE_API_DISABLED=true`; il ne remplace pas encore une CI complète validation/lint/tests.

---

## 4. Suivi prospectif → centralisé dans `Bilan.md`

Les corrections prioritaires, les propositions d'enrichissement (UX / produit / contenu) et le plan d'action phasé qui figuraient ici sont désormais regroupés dans **[Bilan.md](Bilan.md)** :

- état + risques + corrections techniques minimales : §3 à §9 ;
- priorités & plan d'action : §10 (+ « Priorité selon l'objectif visé ») ;
- backlog d'enrichissements (produit / technique / contenu) : §10bis ;
- plan de vérification : §11bis.

Ce document conserve l'**état courant** (§1), le **scoring** (§2), les **acquis techniques stables** (§3) et l'**historique daté des vérifications** (§8).

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
- `scripts/export-content.mjs` : **[NOUVEAU]** export DB → JSON sources (`npm run content:export`).

Travaux du jour (2026-06-22) — **recâblage contenu blog re-vérifié** (`validate:content` OK, build client OK, typecheck serveur OK) :

- **Blog scindé en fichiers par article** : suppression de `data/blog.json` au profit de `data/blog/*.json` (8 fichiers, nommés par slug). `client/src/content/blog.ts` charge le dossier via `import.meta.glob`, `server/src/lib/content.ts` lit le dossier côté seed/API dev, et les listes sont triées par `date` décroissante puis `title`.
- **Scripts alignés** : `validate-content` valide `blog/*.json` (shape, unicité, marqueurs, concordance fichier ↔ slug), `generate-sitemap` lit le dossier, `content:export` écrit désormais un fichier par article et supprime les JSON orphelins. L'endpoint admin `/export` diff `data/blog/`.
- **Vérification DB→JSON** : `npm run content:export -- --dry-run` confirme `blog/ - 8 row(s) (unchanged)` ; l'échec local restant vient du drift `glossary.json`, indépendant du recâblage blog.
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

### 2026-06-15 — Quiz systématiques & due diligence approfondie

Commandes de vérification (branche `chore/flux-c-repo-hygiene`, en local) :

- `npm run validate:content` : **exit 0**, récap 66 leçons · 358 termes · 8 articles · 31 dossiers d'écosystème · 9 simulateurs ; **plus aucune leçon sans quiz** (le warning « 23/62 sans quiz » disparaît).
- `npm run split:content` : **OK** (55 leçons library + 11 drop-in → `lessons.index.json` / `lessons.bodies.json`).
- `cd client && npx tsc --noEmit -p tsconfig.app.json` : **exit 0**.
- `npm run build` : **exit 0**, serveur + client.

Apport éditorial :

- **Quiz posés sur les 23 leçons canoniques qui en manquaient** (2 questions chacune, une seule bonne réponse, explication ancrée sur la matière). Les 66 leçons servables ont désormais un quiz ; le cours `c-founder-raise` (7 leçons, aucun quiz auparavant) est traité en priorité.
- **Cours `c-due-diligence` étendu de 1 à 5 leçons** : `l-dd-process` + `l-dd-commercial`, `l-dd-tech-product`, `l-dd-team`, `l-dd-legal` — marché, produit/tech, équipe/références et juridique/cap table côté investisseur, reliées au glossaire, à des leçons voisines, au simulateur `ownership` et au cas `cs-liquidation-preference`. `data/lessons.json` : 51 → **55 leçons canoniques**.
- Rédaction alignée sur la **charte de style §4.0.c** du Manuel (registre d'analyste sobre, sans punchlines ni survente).

Fichiers modifiés : `data/lessons.json`, `data/courses.json` (lessonIds de `c-due-diligence`), fichiers scindés régénérés (`lessons.index.json`, `lessons.bodies.json`), `client/public/sitemap.xml`. Côté serveur/API, `npm run db:seed` reste à lancer pour aligner la base (non requis en mode invité : le bundle sert déjà les nouvelles leçons).

---

### 2026-06-26 — Réorganisation IA en 3 piliers

Commandes de vérification (local) :

- `npm run build` : **exit 0**. Le hook `prebuild` a rejoué `split:content`, `validate:content` et `generate:sitemap`. Récap contenu : 22 parcours · 9 rayons · 16 cours · 66 leçons · 374 termes · 6 cas · 2 livrables · 8 articles · 31 dossiers d'écosystème · 9 simulateurs.
- `npm run lint` : **exit 0**, 0 erreur, 4 warnings `react-refresh/only-export-components` déjà connus sur les Context.
- `npm run test --workspace client` : **exit 0**, 12 fichiers / 70 tests.

Apport produit :

- Navigation en trois piliers : **Intelligence VC**, **Formation**, **Workspace** (`SideNav`, `TopBar`, `Footer`).
- Cinq nouvelles routes indexables, sans déplacement des slugs de détail : `/intelligence`, `/convictions`, `/decisions`, `/methode`, `/livrables`.
- `client/src/content/convictions.ts` agrège les 24 convictions des dossiers d'écosystème et expose les horizons à réviser.
- `/intelligence` devient le toit de travail : dossiers récents, analyses récentes, convictions à réviser, accès décisions/méthode/convictions.
- `/convictions` rend filtrables les convictions par force et horizon ; chaque item renvoie à `/ecosystemes/:slug`.
- `/decisions` entrelace études de cas, memos et anti-portfolio avec filtres par type, en conservant les détails existants.
- `/methode` regroupe les articles de catégorie Méthode et les livrables ; `/livrables` expose les modèles avant `/livrables/:slug`.
- `/blog` devient « Analyses & notes de recherche » avec familles Lecture oblique, Notes & brèves, Cadres méthode.
- `/bibliotheque` place les 9 rayons thématiques au premier plan puis conserve le catalogue filtrable.
- Home, meta HTML statiques et fallback SEO ne présentent plus le produit comme une seule plateforme d'introspection/apprentissage.

Fichiers structurants créés : `client/src/pages/intelligence/IntelligencePage.tsx`, `ConvictionsPage.tsx`, `DecisionsIndexPage.tsx`, `MethodePage.tsx`, `DeliverablesPage.tsx`, `client/src/content/convictions.ts`.

### 2026-06-28 — Réconciliation report/scoring avec l'état courant

Commandes relancées pendant cette passe documentaire :

- `npm run validate:content` : **exit 0** — 22 parcours · 9 rayons hérités · 16 cours · 66 leçons · 374 termes · 11 leçons drop-in · 3 registres · 6 études de cas · 2 livrables · 8 articles · 31 dossiers d'écosystème · 9 simulateurs · 441 marqueurs analysés.
- `npm run validate:glossary` : **exit 0** — 374 termes, slugs uniques, `id === slug`, liens, marqueurs et aliases résolus.

Contrôles complets déjà consignés au 2026-06-28 :

- `npm run lint` : **exit 0**, 0 erreur, 4 warnings `react-refresh/only-export-components`.
- `npm run test --workspace client` : **13 fichiers / 74 tests**.
- `npm run test --workspace server` : **4 fichiers / 11 tests**, relancé hors sandbox lors du contrôle précédent car l'écoute `127.0.0.1` est bloquée dans le sandbox.
- `npm run build` : dernier contrôle complet consigné le **2026-06-26**, serveur + client OK puis `postbuild` → prérendu statique.

Apports de réconciliation :

- §1 remplacé par un état courant au lieu d'une accumulation de travaux passés.
- §2 recalibré : score produit maintenu à **8.3/10**, score vs ambition VC Intelligence remonté à **7.1/10** après IA en trois piliers et prérendu statique.
- §3 corrigé sur le modèle réel du `SideNav`, du portail splash single-stage, du prérendu et de `CourseDetailPage` API-first.
- Clarification workflow : le dépôt courant expose `.github/workflows/deploy-pages.yml` pour GitHub Pages ; aucun workflow CI complet n'est présent dans `.github/workflows` à cette date.
- Dettes courantes maintenues visibles : `PathDetailPage` bundle-first, `/api/search` plus étroit que la recherche locale, preview CMS / signal non versionné, validation SEO/OG sur domaine réel, sécurité production et i18n EN.

---

## 9. Décision de priorisation → voir `Bilan.md` §10

La liste de priorisation et le cadrage par objectif (Maintenant / démo / pré-production / valeur long terme) sont consolidés dans **[Bilan.md](Bilan.md)** §10 (« Priorités recommandées » + « Priorité selon l'objectif visé »).
