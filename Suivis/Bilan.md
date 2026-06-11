# Bilan - VC Premium Platform

Dernière mise à jour : 2026-06-11

Objet : état actuel synthétique de `vc-premium-platform`, avec les acquis, les limites connues et les prochaines priorités utiles pour sortir du prototype sans lancer une phase production complète.

---

## 1. Résumé exécutif

`vc-premium-platform` est une plateforme full-stack React / Express / Prisma destinée à apprendre le capital-risque avec une expérience éditoriale premium.

Le projet est aujourd'hui plus proche d'un atelier pédagogique fonctionnel que d'une simple maquette :

- le contenu canonique est centralisé dans `/data/*.json` ;
- l'app fonctionne en invité grâce au contenu bundlé ;
- l'API peut servir les contenus seedés depuis les JSON ;
- l'expérience Ikigai, le dictionnaire vivant, la lecture active, les notes, les favoris et les simulateurs sont en place ;
- les simulateurs utilisent désormais les formules standard du marché avec un bloc pédagogique interactif et des popovers ;
- tous les parcours affichent de manière systématique leurs pré-requis (liens et termes de glossaire cliquables) ;
- les garde-fous de validation contenu sont déjà sérieux ;
- le glossaire VC est maintenant enrichi, audité et couvert par un contrôle custom dédié ;
- un cours autonome **Power Law & Monte Carlo** relie désormais la théorie de portefeuille VC au simulateur Power Law ;
- le portail d'entrée (`/`) est un splash-page clair/sombre animée (boussole ikigai, parallaxe, ciel photographique) entièrement intégré et corrigé ;
- le mode sombre de la page d'accueil est rehaussé d'un ciel étoilé photographique derrière les tracés cartographiques ;
- l'**architecture bilingue FR/EN est amorcée** : la Phase 1 (routing localisé `/fr` `/en`) est implémentée dans `client/src/i18n/` ;
- un **premier harnais de tests (Vitest) et un pipeline CI** existent désormais, ainsi qu'un lot de durcissement sécurité/qualité ;
- un **pipeline d'écriture des parcours** est en place (`docs/parcours/` + `data/parcours/*.lessons.json`), avec deux parcours rédigés de bout en bout.
- le dépôt Git est initialisé et rattaché à `origin/master`, avec une baseline initiale versionnée.

La priorité n'est plus d'ajouter des features. Deux décisions d'architecture conditionnent la suite (mode de rendu CSR/SSR, modèle de contenu/authoring) ; ensuite, l'étape utile reste de rendre l'écriture, la validation et l'itération pédagogique confortables.

---

## 2. Vérifications effectuées

### 2026-05-31

| Commande | Résultat |
| --- | --- |
| `npm run validate:content` | OK, 1 warning pédagogique |
| `npm run lint` | OK, 0 erreur, 15 warnings Fast Refresh |
| `npm run build` | OK, build serveur + client |
| `git status --short` | KO, le dossier n'est pas un dépôt git |

### 2026-06-01

| Commande | Résultat |
| --- | --- |
| `npm run validate:content` | OK, avec warnings éditoriaux (~52/76 leçons sans quiz) |
| `npm run lint` | OK, 0 erreur, 15 warnings Fast Refresh |
| `npm run build` | OK, build serveur + client, assets WebP présents dans `dist/splash/` |
| `git status --short` | KO, le dossier n'est toujours pas un dépôt git |

Détail validation contenu (2026-06-01) :

- 9 parcours ;
- 12 cours ;
- 76 leçons ;
- 357 termes de glossaire ;
- 4 études de cas ;
- 4 articles ;
- 6 simulateurs ;
- 156 marqueurs `[[..]]` / `{{..}}` analysés ;
- ~52 leçons sans quiz.

Le warning principal reste éditorial : les leçons sans quiz ne cassent pas l'application, mais elles empêchent une vraie boucle pédagogique.

### 2026-06-02

| Commande | Résultat |
| --- | --- |
| `npm run validate:content` | OK, exit 0, avec warnings éditoriaux (~52/76 leçons sans quiz) |
| `npm run lint` | OK, 0 erreur, 15 warnings Fast Refresh |
| `npm run build` | OK, build serveur + client |
| Contrôles client ciblés | OK, `npm run lint --workspace client` + `npm run build --workspace client` |
| `/paths`, `/onboarding`, `/glossary` | OK, réponses HTTP 200 en dev local |
| `git status --short` | KO, le dossier n'est toujours pas un dépôt git |

Travaux du jour (front-end / interactions, sans impact contenu) :

- carte des parcours (`PathAtlas`) rendue **navigable** : préhension (grab/pan), zoom molette centré sur le curseur, pinch tactile, boutons **+/−** et **recentrage**, avec bornage du zoom et de la translation ;
- boussole de `PathAtlas` : morphing en quatre cercles Ikigai avec les mêmes couleurs que le diagramme `/onboarding`, et hover maintenu sur toute la surface des cercles ;
- barre latérale (`SideNav`) : **effet verre dépoli à l'ouverture** — le rail replié reste intégré au fond, l'expansion déclenche un panneau translucide teinté, flou, voile lumineux et ombre portée ;
- glossaire (`/glossary`) : alphabet + domaines + recherche en bandeau sticky, lettre active colorée au scroll/clic, offsets d'ancre dynamiques ;
- cahier Ikigai : la section `03.b` reprend l'affichage éditorial de `03` (liste ouverte, numérotation romaine, formule, alerte/piège).

### 2026-06-07

| Commande | Résultat |
| --- | --- |
| `npm run validate:glossary` | OK, 357 termes, slugs uniques, `id === slug`, liens, marqueurs et aliases cohérents |
| `npm run validate:content` | OK, avec warnings éditoriaux (~52/76 leçons sans quiz) |
| `npm run build` | OK, build serveur + client |
| Audit ressources glossaire | OK, 0 manquant sur les audits ciblés PitchBook / SEC / Schoenherr |

Travaux du jour (clôture glossaire VC) :

- glossaire final porté à **357 termes** dans `data/glossary.json` ;
- registre canonique porté à **433 entrées** dans `glossary-ingestion/canonical-glossary.json` ;
- tous les `add`, `update` et `merge` retenus sont `applied` ; les `skip` restent hors injection par choix éditorial ;
- les ressources PitchBook, SEC et Schoenherr ont été auditées : les termes principaux sont présents comme entrées finales ou variantes d'alias ;
- le contrôle custom `npm run validate:glossary` couvre les invariants spécifiques du glossaire : slugs uniques, `id === slug`, `seeAlso`, `relatedLessonIds`, marqueurs `[[slug|label]]` et collisions d'aliases.

Le warning sur les leçons sans quiz reste un sujet éditorial séparé : il ne bloque ni le glossaire ni le build.

### 2026-06-09

> Note : le sandbox ne peut pas monter le dossier « VC SITE » (espace dans le nom), donc `npm run build` / `npm run test` n'ont pas été relancés ici. Les commandes ci-dessous restent à exécuter en local pour valider.

Travaux du jour (trois chantiers, sur la base des conversations du projet) :

- **i18n FR/EN — Phase 1 (routing localisé) implémentée.** Nouveau module `client/src/i18n/` : `config.ts` (locales, détection cookie → navigateur → `fr`, persistance), `routing.tsx` (`Link`/`NavLink`/`useNavigate` qui préfixent la locale + `localizePath`/`swapLocalePath`), `guards.tsx` (`RootRedirect` crawler-safe, `LocaleBoundary` qui valide `:locale`, redirige les liens legacy `/paths` → `/fr/paths` et pose `<html lang>`), `useLocale.ts`, `LocaleSwitcher.tsx`, `routing.test.ts`. `App.tsx` passe sous `/:locale`, `MainLayout` devient locale-aware, sélecteur FR/EN dans TopBar + SideNav, ~27 fichiers migrés. Les marqueurs `[[slug]]`/`{{slug}}` restent inchangés (slugs canoniques). Décisions §5 de l'ADR tranchées : slugs canoniques = oui, `/` redirige vers la langue préférée, préférence persistée seulement au clic explicite du sélecteur. Amorce du corpus EN : `data/parcours.en.json`. **Phase 2 (i18n du chrome)** retenue en **dictionnaire maison local** (sans dépendance), non encore réalisée.
- **Lot de durcissement sécurité / qualité (12 correctifs).** CORS localhost limité au dev ; auth cookie-only (token retiré du body, `Bearer` retiré) ; mot de passe ≥ 8 à l'inscription + limiteur 20/15 min sur login/register ; markdown sûr (nœuds React, pas d'`innerHTML`) + garde `safeHttpUrl()` sur les liens externes ; tokens `--error`/`--success` + sweep ~9 fichiers, IA des deux navs alignée ; Error Boundary au niveau route ; graisse de police 300 inutilisée retirée ; parallaxe splash en `requestAnimationFrame` ; loader sur `/profile-result` ; quiz piloté par l'URL (`?test=1&q=N`) ; `<Routes>` imbriquées aplaties (route layout `PageShell`) ; **harnais Vitest robuste (7 fichiers, 25 tests) + étape CI** (`client/vitest.config.ts`, `.github/workflows/ci.yml`).
- **Contenu — pipeline parcours.** Conception et rédaction dans `docs/parcours/` (`parcours-apprentissage-conception.md`, `01-le-vc-sans-bullshit.md`, `02-reussir-l-entretien-analyst.md`) ; fiches de leçons drop-in dans `data/parcours/*.lessons.json`. Le parcours « Réussir l'entretien Analyst » est rédigé en **13 leçons** (cours `c-entretien-analyst`, ids `lea-*`, toutes avec `keyTakeaways`/`quiz`/`glossaryRefs`/`furtherReading`, marqueurs vérifiés). Deux premiers parcours complets de bout en bout (conception → fiche données → contenu rédigé → leçons exploitables). Nouveaux fichiers de données : `parcours.json`, `parcours.en.json`, `parcoursConfig.json`, `profileParcours.json`.
- **Dictionnaire vivant — détection automatique dans les cours.** Application de la règle produit « tout terme technique / sigle d'une leçon doit avoir un popover + redirection vers le dictionnaire ». `client/src/lib/markdown.tsx` détecte désormais automatiquement les termes du glossaire (matcher sur les 357 termes + alias, ~1256 clés) et enveloppe la **première occurrence** de chaque terme dans un popover ; les marqueurs manuels `[[..]]`/`{{..}}` restent prioritaires (pré-amorcés). Sigles reconnus **en respectant la casse** (`VC`/`VCs` oui, `vc` ou `MVC` non), phrases longues prioritaires, frontières Unicode. Popover simplifié = **terme + champ `short`**, panneau **entier cliquable** → `/glossary?term=slug` (plus de ligne « Voir dans le dictionnaire »). Portée : leçons (`LessonPage`) + définitions de `/glossary` ; études de cas / blog restent en balisage manuel. Avant le correctif : seulement 69 marqueurs posés alors que ~70 sigles non balisés apparaissaient déjà dans les 29 leçons. **Vérifs locales (workspace `client`) :** `tsc -b` OK, `eslint` 0 erreur, `vitest` 15/15, test comportemental du matcher sur données réelles OK.
- **Simulateurs et parcours (Améliorations pédagogiques).** Refonte des 8 simulateurs (Option Pool Shuffle, Step-down, 1x non-participating, Power Law/Monte Carlo, etc.) pour adopter les formules de calcul standard du marché. Intégration de blocs pédagogiques explicatifs à droite des paramètres et remplacement des infobulles natives par le composant `GlossaryPreview` avec redirections cliquables vers les articles complets. Ajout systématique du bloc "Pré-requis" sur tous les parcours (`ParcoursDetailPage`) via une extension d'`InlineMarkdown` qui parse nativement les liens locaux et le glossaire. Mise à jour massive de la base (`data/parcours.json`) pour uniformiser "Aucun pré-requis particulier" ou ajouter des listes intelligentes et balisées.


Séquencement décidé en conversation : garder le design system tokenisé, le harnais de tests/CI et l'Error Boundary (faible churn, utiles tout de suite) ; **différer** le lot 🔴 (SSR/SEO, en-têtes CSP/HSTS, garde JWT à corriger, contraste de l'or, interstitiel splash) jusqu'à ce qu'il y ait du contenu réel et un déploiement. Avant de produire en masse, trancher (a) le **mode de rendu** (CSR vs SSR/prerender) et (b) le **modèle de contenu/authoring**.

Restes connus à intégrer : les `data/parcours/*.lessons.json` sont des fiches drop-in **pas encore fusionnées** dans `data/lessons.json` / le seed ; `parcours.json` de `p-entretien-analyst` (11 étapes) reste à synchroniser avec les 13 leçons.

### 2026-06-10

| Commande | Résultat |
| --- | --- |
| `npm run build` | OK, build serveur + client complet |
| Contrôles client ciblés | OK, `npm run build --workspace client` sans erreurs |

Travaux du jour (intégration des études de cas & ergonomie de la Bibliothèque) :

- **Intégration des études de cas dans la Bibliothèque (`PathsPage.tsx`)** : regroupement des études de cas (`CASE_STUDIES`) en tant que troisième catégorie/section à part entière aux côtés de « Cours » et « Lectures ». Mappage dynamique des badges de parcours correspondants via le helper `parcoursForCase`.
- **Rétractation interactive des chapitres** : remplacement des titres de chapitres statiques par des boutons interactifs équipés d'un chevron rotatif animé et d'un conteneur Grid CSS à hauteur animée (`grid-rows-[0fr]/[1fr]`), permettant de plier/déplier chaque catégorie de façon fluide.
- **Simplification et nettoyage de la navigation** :
  - Remplacement du paramètre d'état local par une dérivation directe depuis `searchParams.get('type')` dans `PathsPage.tsx` pour l'onglet actif.
  - Ajout du helper `isLinkActive` dans `routing.tsx` pour isoler correctement les états de surbrillance active des boutons de menu en fonction des chemins localisés et des query parameters.
  - Retrait des accès directs « Études de cas » (icônes/liens) dans `SideNav.tsx`, `TopBar.tsx`, et `Footer.tsx`.
  - Retrait de l'onglet filtre spécifique « Études de cas » (les cas s'affichent par défaut dans l'onglet « Tout » en bas de la page).
  - Mise à jour de la redirection `/cases` vers `/bibliotheque` dans `App.tsx` et retrait de l'import obsolète de `CaseStudiesPage`.
  - Mise à jour du bouton retour de `CaseStudyPage.tsx` vers `/bibliotheque`.

### 2026-06-11

| Commande | Résultat |
| --- | --- |
| `npm run validate:content` | OK, avec warning éditorial restant sur 23/62 leçons canoniques sans quiz |
| `npm run test --workspace client -- power-law` | OK, 11 tests Power Law |
| `npm run lint --workspace client` | OK, 0 erreur, warnings existants uniquement |
| `npm run build --workspace client` | OK, sans erreurs TypeScript ni avertissement bundler |
| Routes locales Vite | OK, `/fr/simulators/power-law-portfolio` et `/fr/courses/construction-portefeuille-loi-puissance` répondent 200 |
| `git status --short --branch` | OK, `master...origin/master`, dépôt propre avant mise à jour documentaire |
| `git branch -vv` | OK, `master` pointe sur `e5b37e0` et suit `origin/master` |
| `git remote -v` | OK, remote `origin` configuré vers GitHub |

Travaux du jour (rétractation du catalogue parcours & restauration routage) :

- **Validation Git / baseline** : dépôt Git présent, branche `master` liée à `origin/master`, commit initial `e5b37e0 Initialisation du projet`, aucun écart local avant validation des documents de suivi.
- **Rétractation des familles de parcours sur `/paths`** (`ParcoursPage.tsx`) : transformation des en-têtes de chaque famille (« Découvrir », « Réussir un entretien », « Lever des fonds », etc.) en boutons interactifs accessibles. Ajout d'un état local `collapsedFamilies`, icône `ChevronDown` pivotant à 90°, et animation accordéon fluide via `grid-rows-[0fr]/[1fr]` sur la grille de cartes de parcours.
- **Rétractation des chapitres (cours) dans les rayons legacy** (`PathDetailPage.tsx`) : les titres de cours deviennent des boutons interactifs avec chevrons rotatifs ; le lien d'accès direct au cours est déplacé à droite pour éviter les navigations involontaires. Même animation accordéon.
- **Restauration de l'aiguillage `/paths/:slug`** (`ParcoursOrSubjectPage.tsx` + `App.tsx`) : la route `/paths/:slug` achemine désormais vers `PathDetailPage` pour les slugs de rayons legacy (ex: `analyse-de-startup`) et vers `ParcoursDetailPage` pour les slugs de nouveaux parcours (ex: `le-vc-sans-bullshit`). Les deux pages sont importées via `lazy` pour préserver le découpage des bundles.
- **Cours Power Law & Monte Carlo** : ajout de `c-power-law-portfolio` dans le rayon Portfolio, avec 4 leçons canoniques (`lpl-average-lies`, `lpl-why-monte-carlo`, `lpl-simulator-engine`, `lpl-read-results`) expliquant moyenne vs médiane, utilité de Monte Carlo, moteur déterministe du simulateur, TVPI, concentration et fund returner math.
- **Intégration pédagogique du simulateur Power Law** : le simulateur référence désormais ces 4 leçons en priorité ; `p-penser-gp`, `paths.json`, les `furtherReading` et les termes de glossaire clés pointent vers ce nouveau bloc sans dupliquer les contenus existants.

---

## 3. Architecture actuelle

Le projet est un monorepo npm workspaces :

| Couche | État |
| --- | --- |
| Client | React 19, Vite 6, TypeScript, Tailwind CSS v3, React Router |
| Serveur | Express 4, TypeScript, Prisma 5, JWT cookie httpOnly |
| Base | SQLite prototype |
| Contenu | JSON canonique dans `/data` |
| Design | tokens CSS, classes globales, composants React |

Flux de contenu :

```txt
data/*.json
  -> client/src/content/*.ts pour le fallback invité / hors-ligne
  -> server/prisma/seed.ts pour peupler SQLite
  -> /api/content/* pour les contenus servis dynamiquement
```

Cette architecture est cohérente pour un prototype avancé. Le point fragile est la divergence possible entre CMS et JSON.

---

## 4. Source de vérité contenu

État actuel :

- `/data/*.json` est la source de vérité durable.
- Le CMS `/admin` écrit en base, pas dans les JSON.
- Un `db:reset` peut donc effacer les contenus créés uniquement via le CMS.
- Les pages Blog, CaseStudy et Lesson consomment déjà l'API avec fallback bundle.
- Les pages PathDetail et CourseDetail restent encore sur le bundle statique, malgré des endpoints prêts côté serveur.
- Le barrel `client/src/content/index.ts` a été allégé : les collections JSON sont importées par modules et les gros ensembles ne sont plus tirés dans l'entrée applicative.

Risque principal :

- une correction faite dans le CMS peut être visible localement via API mais absente de `/data`, donc non pérenne.

Priorité recommandée :

- formaliser le workflow "édition CMS -> report JSON -> validation -> seed" ;
- ajouter un signal "non versionné dans `/data`" dans l'admin ;
- brancher PathDetail et CourseDetail sur l'API avec fallback.

---

## 5. État du contenu pédagogique

Forces :

- structure claire : parcours, cours, leçons, glossaire, cas, blog, simulateurs ;
- dictionnaire vivant riche ;
- marqueurs inline validés ;
- cahier Ikigai très différenciant ;
- premiers parcours déjà exploitables pour une démo.

Limites :

- 62 leçons canoniques pour 16 cours, plus les leçons drop-in servies côté client ;
- 23 leçons canoniques sans quiz ;
- peu d'études de cas ;
- blog encore mince ;
- certains parcours ressemblent davantage à un squelette qu'à un vrai curriculum.

Priorité éditoriale :

1. Densifier les deux parcours `tous` :
   - `levee-de-fonds-cote-entrepreneur` ;
   - `devenir-analyst-associate-principal`.
2. Viser 4 à 6 leçons par cours sur les zones prioritaires.
3. Ajouter quiz et takeaways systématiques.
4. Relier chaque leçon à des termes de glossaire et, quand pertinent, à un cas ou simulateur.

---

## 6. UX et parcours utilisateur

Acquis :

- navigation publique sans mur d'authentification ;
- portail d'entrée (`/`) clair/sombre avec boussole animée, parallaxe et ciel photographique ;
- onboarding Ikigai riche ;
- dashboard avec reprise, progression, suggestions, notes ;
- lecture active avec sélection, citation et surlignage ;
- favoris, notes et progression en invité ou connecté ;
- recherche locale/API ;
- atlas des parcours **navigable** (préhension, zoom molette/pinch, boutons +/−, recentrage) et identité visuelle forte ;
- boussole de l'atlas cohérente avec l'Ikigai : les quatre cercles reprennent les accents de `data/ikigai.json` et restent ouverts tant que la souris est sur une zone de cercle ;
- glossaire utilisable en lecture longue : contrôles sticky, lettre active, recherche et filtres accessibles sans remonter en haut de page ;
- barre latérale à effet verre dépoli à l'ouverture (rail replié intégré → panneau translucide flouté à l'expansion) ;
- mode sombre premium : ciel étoilé photographique en fond du hero et de la carte sur `/home`.

Points à améliorer :

- dashboard encore perfectible comme "journal de bord" ;
- sommaire automatique absent dans les leçons longues ;
- cohérence de parcours à renforcer entre leçon, quiz, cas, simulateur et prochaine étape ;
- mobile atlas : le pinch-zoom et le pan aident désormais, mais garder la liste de chips en repli comme alternative lisible ;
- SEO faible car SPA sans prérendu.

Priorité UX hors production :

- clarifier la prochaine action de l'apprenant ;
- rendre la reprise de lecture plus évidente ;
- ajouter un sommaire pédagogique aux leçons longues ;
- mieux relier les cas et simulateurs aux leçons.

---

## 7. Qualité technique

Acquis :

- `npm run validate:content` opérationnel ;
- `npm run lint` sans erreur ;
- `npm run build` passe ;
- build client découpé : `index-*.js` ≈ 100 kB, `react-vendor` ≈ 232 kB, chunks de contenu lourds (`lessons`, `glossary`) séparés ;
- accessibilité des modales et suppressions durcie ;
- `inert` sur la couche inactive du portail splash (lien invisible non focusable au clavier) ;
- API de contenu publique structurée ;
- fallback bundle robuste ;
- fonds photographiques de la splash convertis en WebP (~97 % de poids en moins).

Limites :

- harnais de tests en expansion : Vitest installé avec 25 tests sur 7 fichiers, plus la suite Power Law ciblée (11 tests) ; l'API backend n'est pas encore couverte ;
- la garde JWT côté serveur est notée comme **inopérante** (à corriger dans le lot sécurité différé) ;
- i18n Phase 1 compile côté client ; restent le chrome traduit, la base `locale` et `hreflang` ;
- warnings Fast Refresh encore présents ;
- SQLite et `db push` restent adaptés au prototype, pas à une production durable ;
- SEO / OpenGraph / prérendu non traités ;
- CSS et fontes restent le plus gros poids visible après le découpage JS ; un audit performance dédié reste utile avant publication.

Corrections techniques minimales recommandées :

1. Brancher PathDetail et CourseDetail sur l'API.
2. Ajouter des tests unitaires ciblés sur les calculateurs.
3. Ajouter une preview CMS pour articles et cas.
4. Ajouter un indicateur de contenu non versionné.
5. Garder Postgres, migrations, sécurité avancée et SSR/prérendu pour une phase ultérieure.

---

## 8. Design system

État :

- design tokens présents ;
- mode clair/sombre présent et cohérent (le toggle splash pilote désormais le thème global) ;
- classes globales utiles (`btn-*`, `premium-card`, `chip`, `eyebrow`, `prose-editorial`) ;
- composants UI déjà réutilisables ;
- identité atlas/carnet différenciante ;
- `NightSkyBackdrop` : composant réutilisable pour incruster le ciel photographique en mode sombre derrière les tracés SVG (`hidden dark:block`, `-z-10`) ;
- `glass-rail` : la barre latérale a deux états — replié quasi-opaque (intégré au fond) et ouvert en verre dépoli très translucide teinté d'un ton `--surface-container*` (≠ `--surface`/`--background`, sinon pas de contraste), avec variante mode sombre dédiée ; `data-open` piloté par `SideNav`.
- `PathAtlas` : la boussole se transforme en quatre cercles Ikigai ; les accents sont injectés depuis `data/ikigai.json` et le `fill: transparent` + `pointer-events: all` garantit une vraie zone de survol.
- `GlossaryPage` : bandeau sticky token-aware, scroll horizontal compact sur mobile, lettre active pilotée par scroll/clic et `--glossary-anchor-offset`.
- `CahierSections` : les sections `03` et `03.b` partagent désormais le même pattern éditorial en liste ouverte.

Fichier dédié créé :

- `Design_System.md`

Prochaine étape design utile :

- documenter et stabiliser les patterns admin/formulaires ;
- créer un pattern de preview éditoriale ;
- éviter de multiplier les variantes visuelles tant que les contenus ne sont pas densifiés.

---

## 9. Risques actuels

| Risque | Niveau | Commentaire |
| --- | --- | --- |
| Divergence CMS / JSON | Élevé | Le CMS ne persiste pas dans `/data` ; à étendre à la `locale` pour l'i18n |
| Mode de rendu non tranché | Élevé | CSR vs SSR/prerender à décider **avant** de produire le contenu (impacte SEO + authoring) |
| Contenu à consolider | Élevé | 62 leçons canoniques dans `data/lessons.json` ; les leçons drop-in de parcours restent à fusionner côté seed/API |
| SEO faible | Moyen | SPA sans prérendu ; `hreflang`/`canonical` i18n différés au pré-lancement |
| Tests minimaux | Moyen | Harnais Vitest + CI en place, mais calculateurs et API non couverts |
| Garde JWT inopérante | Moyen | Identifiée dans l'audit, correction dans le lot sécurité différé |
| Baseline Git récente | Faible | Dépôt initialisé et rattaché à `origin/master` ; conserver un status propre et des commits fréquents |
| Dette production | Faible à moyen | Acceptable tant que l'objectif reste atelier/prototype |

---

## 10. Priorités recommandées

### P0 - Décisions d'architecture (avant production de contenu)

- trancher le **mode de rendu** : rester CSR (SPA actuelle) ou passer à un prérendu/SSG (hybride recommandé : SSG/ISR pour l'éditorial, CSR pour l'app) ;
- figer le **modèle de contenu et le workflow d'authoring** (`data/*.json` + Prisma + CMS), en tenant compte de la `locale` ;
- valider la Phase 1 i18n en local (`npm run build`, `npm run test`) puis enchaîner la Phase 2 (chrome) ;
- produire une **tranche verticale réelle** (un parcours complet : cours → leçons → glossaire → cas) avant d'optimiser perf/SEO.

### P0 - Atelier éditorial

- formaliser les templates leçon / cours / article / cas ;
- créer une matrice éditoriale des contenus ;
- compléter les quiz des parcours prioritaires ;
- garder `/data` comme source de vérité.

### P1 - Cohérence d'apprentissage

- densifier les parcours prioritaires ;
- vérifier que chaque leçon mène naturellement à une suite ;
- relier leçons, glossaire, cas et simulateurs ;
- améliorer le dashboard comme reprise de travail.

### P2 - Garde-fous

- enrichir `validate:content` avec un score de complétude éditoriale ;
- rendre les leçons sans quiz bloquantes sur les parcours prioritaires ;
- signaler les contenus CMS non versionnés.

### P3 - Corrections techniques minimales

- API fallback pour PathDetail et CourseDetail ;
- preview CMS ;
- tests calculateurs ;
- documentation de workflow d'édition.

---

## 11. Ce qu'il ne faut pas prioriser maintenant

À ne pas lancer tant que l'atelier éditorial n'est pas fluide :

- migration Postgres complète ;
- SSR ou refonte SEO lourde ;
- refonte CMS complète ;
- nouveaux simulateurs complexes ;
- nouvelles grandes features ;
- redesign global.

Ces sujets sont légitimes, mais ils ne résolvent pas le problème immédiat : produire, relire, valider et améliorer des parcours d'apprentissage.

---

## 12. Conclusion

Le projet est sain pour un prototype avancé et très intéressant comme expérience pédagogique. L'entrée dans la plateforme (portail splash clair/sombre) et l'identité visuelle du mode sombre (ciel étoilé photographique sur l'accueil) sont maintenant au niveau de la promesse premium.

Sa valeur se joue désormais dans la discipline éditoriale :

- écrire plus régulièrement ;
- écrire dans des formats stables ;
- valider avant seed ;
- relier chaque contenu à un parcours d'apprentissage clair ;
- réduire les divergences entre CMS, base et JSON.

La bonne prochaine étape est donc un cycle court : templates, deux parcours prioritaires, quiz, validation, puis seulement les corrections techniques minimales qui rendent ce cycle confortable.
