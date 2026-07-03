# Bilan - VC Premium Platform

> [!IMPORTANT]
> **Statut documentaire — 2026-06-28**
> - Dernière révision de fond indiquée : 2026-06-28.
> - Périmètre : synthèse de l'état produit, risques, priorités et backlog prospectif.
> - Nature : **journal de suivi — peut diverger du code**. Vérifier l'état courant dans `client/`, `server/`, `data/`, `shared/routes.mjs` et `package.json`.
> - État réconcilié avec le code courant : `CourseDetailPage.tsx` est API-first via `useApiItem('/content/courses/:slug')`; la dette visible restante côté rayon concerne `PathDetailPage.tsx`, encore bundle-first.
> - Compteurs réconciliés : client **13 fichiers / 74 tests**, serveur **4 fichiers / 11 tests**, contenu **66 leçons servables** et glossaire **374 termes**.
> - Le mode de rendu public est désormais tranché : **SPA/CSR + prérendu statique des routes publiques** via `scripts/prerender.mjs`, alimenté par `scripts/collect-routes.mjs`.

Dernière mise à jour : 2026-06-28

Objet : état actuel synthétique de `vc-premium-platform`, avec les acquis, les limites connues et les prochaines priorités utiles pour sortir du prototype sans lancer une phase production complète.

> **Périmètre des docs de suivi.** Ce document porte l'**état de synthèse, les risques, les priorités et le backlog prospectif**. Le **journal daté des travaux/vérifications** et le **scoring** vivent dans [Report et scoring.md](Report%20et%20scoring.md). La **stratégie cible** (vision, piliers, roadmap) est dans [docs/STRATEGIE-vc-intelligence.md](../docs/STRATEGIE-vc-intelligence.md).

---

## 1. Résumé exécutif

`vc-premium-platform` est une plateforme full-stack React / Express / Prisma destinée à structurer une intelligence VC : analyser des écosystèmes, suivre des convictions, étudier des décisions et organiser sa montée en compétence.

Le projet est aujourd'hui plus proche d'un atelier pédagogique fonctionnel que d'une simple maquette :

- le contenu canonique est centralisé dans les JSON sources de `/data` (`data/*.json` et collections comme `data/blog/*.json`) ;
- l'app fonctionne en invité grâce au contenu bundlé ;
- l'API peut servir les contenus seedés depuis les JSON ;
- l'IA publique est réorganisée en **3 piliers** : Intelligence VC, Formation, Workspace ;
- les nouvelles pages-index `/intelligence`, `/convictions`, `/decisions`, `/methode` et `/livrables` rendent navigables les contenus existants sans déplacer les URLs de détail ;
- l'expérience Ikigai, le dictionnaire vivant, la lecture active, les notes, les favoris et les simulateurs sont en place ;
- les simulateurs utilisent désormais les formules standard du marché avec un bloc pédagogique interactif et des popovers ;
- tous les parcours affichent de manière systématique leurs pré-requis (liens et termes de glossaire cliquables) ;
- les garde-fous de validation contenu sont déjà sérieux ;
- le glossaire VC est maintenant enrichi, audité et couvert par un contrôle custom dédié ;
- un cours autonome **Power Law & Monte Carlo** relie désormais la théorie de portefeuille VC au simulateur Power Law ;
- le portail d'entrée (`/`) est un splash-page clair/sombre animée (boussole ikigai, parallaxe, ciel photographique) entièrement intégré et corrigé ;
- le mode sombre de la page d'accueil est rehaussé d'un ciel étoilé photographique derrière les tracés cartographiques ;
- l'**architecture bilingue FR/EN est amorcée** : la Phase 1 (routing localisé `/fr` `/en`) est implémentée dans `client/src/i18n/` ;
- un **harnais de tests Vitest** existe côté client et serveur, ainsi qu'un workflow GitHub Pages de déploiement frontend ;
- un **pipeline d'écriture des parcours** est en place (`docs/parcours/` + `data/parcours/*.lessons.json`), avec trois registres drop-in actifs et seedés côté serveur via `content.allLessons()`.
- un **espace d'analyse signée « Décortiquer un écosystème »** (`/ecosystemes`, 100 % client) publie des dossiers vivants arborescents avec thèse falsifiable, convictions datées à degré d'assurance explicite et **figures natives** (graphiques/schémas en SVG/HTML theme-aware, sans asset ni lib de charting) ;
- la publication publique n'est plus bloquée par le pur CSR : le build peut prérendre les routes publiques en HTML statique avec métadonnées par page ;
- le dépôt Git est initialisé et rattaché à `origin/master`, avec une baseline initiale versionnée.

La priorité n'est plus de prouver que la matière existe. Elle est maintenant de consolider la couche Intelligence, d'éviter la duplication éditoriale, et de fiabiliser la publication publique : prérendu statique déjà en place, OpenGraph à vérifier par contenu, recherche serveur à aligner sur la recherche locale.

---

## 2. Vérifications effectuées

Dernier état vérifié — **2026-06-28** (exécuté en local ; le test serveur a été relancé hors sandbox car l'écoute `127.0.0.1` est bloquée dans le sandbox) :

| Commande | Résultat |
| --- | --- |
| `npm run validate:content` | OK ; 22 parcours · 9 rayons hérités · 16 cours · 66 leçons · 374 termes · 6 cas · 2 livrables · 8 articles · 31 dossiers d'écosystème · 9 simulateurs |
| `npm run validate:glossary` | OK ; 374 termes, slugs uniques, `id === slug`, liens et aliases résolus |
| `npm run lint` | OK, 0 erreur, 4 warnings (`react-refresh` structurels) |
| `npm run test --workspace client` | OK, 13 fichiers / 74 tests |
| `npm run test --workspace server` | OK hors sandbox, 4 fichiers / 11 tests |
| `npm run build` | Dernier contrôle complet consigné le 2026-06-26 : OK, build serveur + client puis `postbuild` → prérendu statique |
| Sitemap / prérendu | 573 routes publiques indexables ; sitemap FR/EN, prérendu FR tant que `EN_ENABLED=false` |

### 2026-06-28 — Publication statique et état courant

- `scripts/collect-routes.mjs` fournit désormais la même énumération de routes au sitemap et au prérendu.
- `scripts/prerender.mjs` capture le DOM post-hydratation des routes publiques et écrit `client/dist/<route>/index.html`, ce qui donne un `<head>` statique exploitable par les crawlers et unfurlers.
- `.github/workflows/deploy-pages.yml` déploie le frontend statique sur GitHub Pages à chaque push sur `master`, avec `VITE_API_DISABLED=true`.
- La recherche locale couvre aussi livrables, anti-portfolio, mémos et écosystèmes ; `/api/search` reste plus étroit et doit être aligné.

### 2026-06-26 — IA en 3 piliers

La vitrine a été réalignée sur l'ambition VC Intelligence :

- `SideNav`, `TopBar` et `Footer` expriment trois piliers : **Intelligence VC**, **Formation**, **Workspace** ;
- `/intelligence` agrège dossiers récents, analyses récentes et convictions à réviser ;
- `/convictions` liste les convictions issues des dossiers d'écosystème avec force, horizon et lien source ;
- `/decisions` entrelace cas, mémos et anti-portfolio sans déplacer leurs URLs de détail ;
- `/methode` regroupe les articles de catégorie Méthode et les livrables ;
- `/livrables` expose les modèles existants avant les détails `/livrables/:slug` ;
- `/blog` est requalifié en « Analyses & notes de recherche » ;
- `/bibliotheque` met les 9 rayons au premier plan, puis conserve le catalogue filtrable ;
- `/dashboard` distingue reprise d'apprentissage et travail de connaissance ; `/notes` groupe les notes par source.

> **Historique daté complet** — chaque passe de vérification depuis le 2026-05-30 (commandes, résultats, fichiers touchés) : voir [Report et scoring.md](Report%20et%20scoring.md) §8. La synthèse de l'audit indépendant du 2026-06-13 (re-vérifié sur le code, hors discours des docs) reste ci-dessous.

### 2026-06-13 — Audit indépendant (synthèse ; détail dans `Report et scoring.md` §8)

Audit complet re-vérifié **sur le code**, en se défiant des docs de suivi. Constat n°1 : le produit *est* déjà une plateforme d'intelligence VC par sa matière, mais la vitrine (home `HomePage.tsx`, nav `TopBar`/`SideNav` incohérentes, dashboard progression-centric, meta/OG « introspection/apprentissage ») le présente encore comme une école. Re-scoring honnête : **~6/10 vs l'ambition VC Intelligence** (contre 8.3 mesuré comme MOOC).

Deltas factuels touchant ce Bilan :

- **Recherche** : `client/src/content/search.ts` couvre déjà écosystèmes / anti-portfolio / mémos ; seule la recherche **serveur** (`server/src/routes/search.ts`) les ignore → incohérence client/serveur (dette), pas invisibilité.
- **Contenu bundle-only** : écosystèmes / anti-portfolio / mémos n'ont **aucune table Prisma** (servis par le bundle client uniquement) — régime distinct du contenu API+fallback (leçons / glossaire / blog / cas).
- **CSR vs public-first** : risque identifié le 2026-06-13 puis partiellement traité par le prérendu statique ; reste à vérifier les cartes sociales réelles par contenu en contexte de déploiement.

Décision design retenue — **nav différenciée formation / intelligence = pattern B + C, jamais A** : une seule nav primaire à deux zones groupées (« Intelligence » en haut, « Apprendre les bases » repliable) + rail secondaire contextuel dérivé du type de contenu ; le « mode » se **déduit** de la route (jamais choisi par l'utilisateur), et **présuppose la taxonomie** `contentKind` / `audience`. Mettre la formation de côté plus tard = replier la zone basse (config, pas refonte).

État 2026-06-28 : la nav publique en trois piliers, le repositionnement des pages-index et le prérendu statique sont en place. Restent surtout : généraliser la taxonomie `contentKind` / `audience`, ajouter des rails contextuels quand le contenu le justifie, et aligner `/api/search` sur la recherche locale.

---

## 3. Architecture actuelle

Le projet est un monorepo npm workspaces :

| Couche | État |
| --- | --- |
| Client | React 19, Vite 6, TypeScript, Tailwind CSS v3, React Router |
| Serveur | Express 4, TypeScript, Prisma 5, JWT cookie httpOnly |
| Base | SQLite prototype |
| Contenu | JSON canonique dans `/data` (`data/blog/*.json` pour les analyses) |
| Design | tokens CSS, classes globales, composants React |

Flux de contenu :

```txt
data/*.json + data/blog/*.json
  -> client/src/content/*.ts pour le fallback invité / hors-ligne
  -> server/prisma/seed.ts pour peupler SQLite
  -> /api/content/* pour les contenus servis dynamiquement
```

Cette architecture est cohérente pour un prototype avancé. Le point fragile est la divergence possible entre CMS et JSON.

---

## 4. Source de vérité contenu

État actuel :

- `/data/*.json` et `/data/blog/*.json` sont la source de vérité durable.
- Le CMS `/admin` écrit en base, pas dans les JSON.
- **Le seed ne détruit plus les éditions CMS** : depuis 2026-06-12, `seed.ts` est non destructif pour le contenu éditable (glossaire/blog/cas) — create-if-absent par défaut, écrasement seulement avec `db:seed -- --force`. Un `db:reset` (qui force) reste destructif, par conception.
- **Le sens inverse est outillé** : `npm run content:export` réexporte les éditions DB vers les JSON sources, dont un fichier `data/blog/<slug>.json` par analyse, ce qui donne une boucle « éditer en CMS → exporter → valider → committer ».
- Les pages Blog, CaseStudy et Lesson consomment déjà l'API avec fallback bundle.
- `CourseDetailPage.tsx` consomme aussi l'API avec fallback bundle via `useApiItem('/content/courses/:slug')`.
- Les leçons drop-in des parcours (`data/parcours/*.lessons.json`) sont servies côté client et seedées côté serveur via `content.allLessons()`.
- Le blog n'est plus monolithique : les 8 analyses vivent dans `data/blog/*.json`, recomposées côté client/serveur et validées fichier par fichier.
- `PathDetailPage.tsx` reste encore bundle-first pour les rayons hérités, malgré l'existence de l'endpoint `/content/paths/:slug`.
- Le barrel `client/src/content/index.ts` a été allégé : les collections JSON sont importées par modules et les gros ensembles ne sont plus tirés dans l'entrée applicative.

Risque principal :

- une correction faite dans le CMS peut être visible localement via API mais absente des JSON sources si on oublie `content:export` ; le risque de perte par re-seed, lui, est levé.

Priorité recommandée :

- formaliser le workflow "édition CMS -> `content:export` -> validation -> commit -> seed" ;
- ajouter un signal "non versionné dans `/data`" dans l'admin ;
- brancher `PathDetailPage` sur l'API avec fallback ;
- aligner la recherche serveur sur les collections 100 % client lorsque ces contenus doivent être recherchables via API.

---

## 5. État du contenu pédagogique

Forces :

- structure claire : parcours, cours, leçons, glossaire, cas, blog, simulateurs, écosystèmes ;
- dictionnaire vivant riche ;
- marqueurs inline validés ;
- cahier Ikigai très différenciant ;
- premiers parcours déjà exploitables pour une démo ;
- quiz systématiques : toutes les leçons (66/66) portent désormais un quiz ;
- cours **due diligence** étoffé (5 leçons : enquête priorisée, commerciale, produit/tech, équipe, juridique/cap table) ;
- une couche d'**analyse signée** émerge (8 analyses dont 3 « lectures obliques » + 31 dossiers d'écosystème), socle de la bascule vers une VC Intelligence Platform ;
- l'Intelligence VC dispose aussi de 9 entrées d'anti-portfolio et 5 mémos annotés, consommés côté client ;
- premiers **livrables de parcours** : les milestones `a-produire` où l'apprenant produit un artefact deviennent des pages `/livrables` (brief + gabarit + grille + modèle), qui amorcent les piliers Intelligence par double emploi — 2 en ligne (Seed IC → 1ᵉʳ cas décisionnel ; thèse propriétaire → dossier d'écosystème modèle).

Limites :

- 55 leçons canoniques (+ 11 drop-in = 66 servables) pour 16 cours — couverture encore inégale, plusieurs cours à 2 leçons ;
- 6 études de cas seulement (dont 1 décisionnel) ; 8 milestones `a-produire` restent des culs-de-sac ;
- blog encore mince ;
- certains parcours ressemblent davantage à un squelette qu'à un vrai curriculum.

Priorité éditoriale :

1. Densifier les deux parcours `tous` :
   - `levee-de-fonds-cote-entrepreneur` ;
   - `devenir-analyst-associate-principal`.
2. Viser 4 à 6 leçons par cours sur les zones prioritaires (acquis : due diligence porté à 5 leçons ; restent les cours à 2 leçons).
3. Maintenir quiz et takeaways systématiques (acquis : 66/66 leçons avec quiz).
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
- recherche locale complète ; recherche API fonctionnelle mais moins large ;
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
- partage social / SEO à fiabiliser en production malgré le prérendu statique.

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
- build client découpé : `react-vendor` ≈ 232 kB, chunks de contenu lourds séparés ; le glossaire et les leçons sont **scindés index/contenu** (index léger eager + corps/défs lazy) — le chunk `lessons` eager tombe de ~176 kB à ~32 kB ;
- prérendu statique public branché en `postbuild` : `scripts/prerender.mjs` réutilise l'inventaire de `scripts/collect-routes.mjs` et écrit les HTML par route ;
- accessibilité des modales et suppressions durcie ;
- `inert` sur la couche inactive du portail splash (lien invisible non focusable au clavier) ;
- API de contenu publique structurée ;
- fallback bundle robuste ;
- `helmet` est monté côté Express, avec CORS dev-only, rate-limit auth/recherche et garde JWT production ;
- fonds photographiques de la splash convertis en WebP (~97 % de poids en moins).

Limites :

- harnais de tests : client 13 fichiers / 74 tests ; serveur 4 fichiers / 11 tests (health, auth, profil, isolation `userId`) — reste à étendre aux routes admin, notes/journal et recherche avancée ;
- la garde JWT côté serveur est **corrigée** (longueur min. + blocklist en production, fail-fast au démarrage) ;
- i18n Phase 1 compile côté client ; le sélecteur EN est **masqué** en attendant la traduction ; restent le chrome traduit, la base `locale` et `hreflang` ;
- warnings Fast Refresh encore présents (4, structurels aux Context) ;
- SQLite reste adapté au prototype, pas à une production durable ;
- SEO / OpenGraph : prérendu en place, mais validation à faire sur le domaine de production, les cartes sociales et les contenus à fort enjeu ;
- CSS et fontes restent le plus gros poids visible après le découpage JS ; un audit performance dédié reste utile avant publication.

Corrections techniques minimales recommandées :

1. Brancher `PathDetailPage` sur l'API avec fallback.
2. Aligner `/api/search` sur la recherche locale si les collections Intelligence doivent être disponibles côté serveur.
3. Ajouter une preview CMS pour articles et cas.
4. Ajouter un indicateur de contenu non versionné.
5. Finaliser le durcissement production : cookie `secure`, CSP/HSTS, CSRF, configuration domaine et validation des cartes sociales.

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
| Vitrine learning-first résiduelle | Moyen | La nav et les pages-index ont basculé en 3 piliers ; il reste à vérifier les premières impressions, les rails contextuels et les cartes sociales de contenus Intelligence |
| Divergence CMS / JSON | Élevé | Le CMS ne persiste pas dans `/data` ; à étendre à la `locale` pour l'i18n |
| Recherche serveur incomplète | Moyen | La recherche locale couvre livrables, anti-portfolio, mémos et écosystèmes ; `/api/search` ne couvre pas encore toutes ces collections |
| Contenu à consolider | Élevé | 55 leçons canoniques dans `data/lessons.json` (+ 11 drop-in) ; couverture inégale (cours à 2 leçons), 6 études de cas seulement |
| SEO / partage à fiabiliser | Moyen | Mode de rendu tranché (CSR + prérendu statique) ; reste validation sur domaine réel, cartes sociales, `VITE_SITE_URL`, `hreflang` et pages prioritaires |
| Tests partiels | Faible à moyen | Client 13 fichiers / 74 tests + serveur 4 fichiers / 11 tests ; reste à étendre la couverture API (admin, notes, journal, recherche…) |
| ~~Garde JWT inopérante~~ | Résolu | Corrigée le 2026-06-12 : longueur min. + blocklist en production, fail-fast au démarrage |
| Mode de rendu public | Résolu | Choix actuel : SPA/CSR + prérendu statique public au build, sans migration SSR/SSG |
| Baseline Git récente | Faible | Dépôt initialisé et rattaché à `origin/master` ; conserver un status propre et des commits fréquents |
| Dette production | Faible à moyen | Acceptable tant que l'objectif reste atelier/prototype |

---

## 10. Priorités recommandées

### P0 - Publication et workflow éditorial

- fiabiliser le **prérendu statique** en production : `VITE_SITE_URL`, canonical/OG, pages prioritaires et vérification unfurlers ;
- figer le **workflow d'authoring** (JSON sources `/data` + Prisma + CMS + `content:export`), en tenant compte de la future `locale` ;
- formaliser la boucle `édition CMS -> content:export -> validate:content -> validate:glossary si besoin -> commit -> seed` ;
- produire une **tranche verticale réelle** (parcours → cours → leçons → glossaire → cas/livrable) avant de lancer de nouvelles grandes surfaces produit.

> **Mise à jour 2026-06-28.** Les sujets nav / repositionnement / POC prérendu sont traités au niveau structurel. La suite utile : taxonomie `contentKind`/`audience` généralisée, rails contextuels quand ils servent la lecture, et alignement de la recherche serveur.

### P0 - Atelier éditorial

- formaliser les templates leçon / cours / article / cas ;
- **appliquer la charte de style rédactionnel transverse à toute production** : registre d'analyste sobre, prose fluide, zéro tic d'IA ni survente (source canonique : skill `.claude/skills/ecosystemes/SKILL.md` § « Writing style » + mémoire `style-redaction-naturel` ; résumé dans [Manuel_Architecture_Edition.md §4.0.c](Manuel_Architecture_Edition.md)) ;
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
- rendre le quiz obligatoire (erreur bloquante) sur les nouvelles leçons — acquis ponctuel : les 66 leçons actuelles ont toutes un quiz ;
- signaler les contenus CMS non versionnés ;
- compléter la validation pré-déploiement : cartes sociales prérendues, domaine canonique, robots/sitemap.

### P3 - Corrections techniques minimales

- API fallback pour `PathDetailPage` ;
- alignement de `/api/search` avec la recherche locale ;
- preview CMS ;
- documentation de workflow d'édition.

### Priorité selon l'objectif visé

- **Maintenant** : fiabiliser prérendu/publication + workflow d'édition, puis produire une **tranche verticale réelle** (parcours complet → cours → leçons → glossaire → cas/livrable).
- **Démo impressionnante** : dashboard + lecture active + contenu visible.
- **Pré-production** : validation SEO/OG statique + API détail `PathDetailPage` + sécurité (cookie `secure`, CSP/HSTS, CSRF) + i18n.
- **Valeur long terme** : atelier VC + CMS éditorial + densification des parcours + traductions EN.

---

## 10bis. Backlog d'enrichissements proposés

> Propositions prospectives consolidées (issues de l'ex-`implementation_plan.md` et des ex-§5/§6 de `Report et scoring.md`). Aucune n'est engagée ; à arbitrer après les décisions P0. Recoupe la roadmap de [docs/STRATEGIE-vc-intelligence.md](../docs/STRATEGIE-vc-intelligence.md).

### Produit / UX

- **Dashboard « journal de bord »** : reprise de lecture (temps restant), prochaine action recommandée, synthèse Ikigai, dernières notes/citations, progression par parcours, micro-session « 20 minutes utiles ».
- **Lecture active** : sommaire auto depuis les `##`, temps restant, barre de progression par section, concepts rencontrés, navigation prev/next plus visible, mode « mémo » (takeaways + notes), ornements `DropCap`/`FleuronDivider`/`InkStamp « Lu »`.
- **Transitions de pages** : View Transitions API (peu coûteuse) pour renforcer l'effet « livre interactif ».
- **`Reveal` au scroll** : révéler après un timeout max de sécurité, pour éviter qu'un contenu reste bloqué en `opacity-0` si l'`IntersectionObserver` ne se déclenche pas.
- **Atelier VC** : deal memo builder, cap table builder avancé, conversion SAFE / BSA-AIR, option pool shuffle, stratégie de réserves, term sheet clause par clause, waterfall multi-scénarios.
- **Dictionnaire vivant** : rail alphabétique, terme du jour, graphe de concepts reliés, filtres (catégorie / niveau / usage), « ajouter à mes notions à réviser ».
- **CMS éditorial** : états `draft` / `review` / `published`, preview avant publication, export JSON depuis la base, indicateur « non versionné dans /data », score de santé par contenu (relations, quiz, glossaire, longueur, liens).

### Technique

- **Recherche** : aligner d'abord `/api/search` sur la recherche locale (livrables, anti-portfolio, mémos, écosystèmes), puis passer le LIKE / substring à SQLite **FTS5** avec scoring simple (titre > corps) et surlignage.
- **SEO / publication statique** : consolider le prérendu existant (`scripts/prerender.mjs`) par des vérifications sur domaine réel, cartes sociales par contenu, `VITE_SITE_URL`, canonical, `hreflang` et images OG spécifiques.
- **Sécurité production (lot 🔴 différé)** : cookie `secure` selon `NODE_ENV` derrière HTTPS, CSP / HSTS, CORS strict en prod, protection CSRF (ou SameSite + token), rotation JWT glissante (`shouldRefreshToken` déjà branché). `helmet` et la garde JWT (longueur + blocklist) sont déjà en place.

### Contenu

- **Thèmes à combler** : marché secondaire & liquidité ; fund formation / relations LP / rôle BPI–EIF ; construction de portefeuille & réserves ; méthodes de valorisation (VC method, comparables, DCF, multiples) ; cap table & SAFE vs equity vs BSA-AIR ; term sheet clause par clause ; down rounds & gouvernance / board ; sorties (M&A / IPO / secondaire) ; spécificités européennes ; impact de l'IA sur le métier.
- **Études de cas à créer** : cas européen de scale-up, cas de fonds, post-mortem d'échec, down round annoté, deal memo complet. *(Acquis : `cs-seed-ic`, 1ᵉʳ cas décisionnel — comité d'investissement seed « Volta ».)*
- **Livrables de parcours à produire** : 8 milestones `a-produire` restent à transformer en livrables. Prochaine cible early-stage : le **mémo de deal seed** (`todo-ecrire-memo`). La Série A (`todo-attentes-serie-a`) est hors priorité early-stage et deviendra une leçon de référence, pas un livrable.

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

## 11bis. Plan de vérification

Checklist de non-régression à rejouer avant un seed / déploiement (héritée de l'ex-`implementation_plan.md`) :

1. **Contenu** : `npm run validate:content` exit 0 (zéro référence cassée), puis `npm run db:seed` affiche le récap attendu.
2. **Régression** : `npm run build` propre + `npm run lint`.
3. **Lecture / UX** : barre de progression, sommaire, prev/next testés sur une leçon ; Atlas utilisable au **clavier** et sur **mobile** (DevTools).
4. **SEO** : pages de contenu prérendues, balises meta + OG présentes dans le HTML servi.
5. **Thèmes** : rendu correct en **clair et sombre** (hero + carte), `prefers-reduced-motion` respecté.
6. **Portail** : splash lisible sur mobile portrait (390 px) et paysage court (640×360), toggle clair/sombre persistant sur `/home`.
7. **Tests** : suite Vitest verte côté client (calculateurs + intégrité contenu) **et** côté serveur (`npm run test --workspace server` : auth, profil, isolation `userId`).

---

## 12. Conclusion

Le projet est sain pour un prototype avancé de plateforme d'intelligence VC, avec une couche pédagogique déjà exploitable. L'entrée dans la plateforme (portail splash clair/sombre), l'identité visuelle du mode sombre et le prérendu statique des routes publiques sont maintenant au niveau d'une démo publique sérieuse.

Sa valeur se joue désormais dans la discipline éditoriale :

- écrire plus régulièrement ;
- écrire dans des formats stables ;
- valider avant seed ;
- relier chaque contenu à un parcours d'apprentissage clair ;
- réduire les divergences entre CMS, base et JSON.

La bonne prochaine étape est donc un cycle court : workflow éditorial verrouillé, une tranche verticale complète, validation contenu/glossaire/tests, puis les corrections techniques minimales qui rendent ce cycle confortable (`PathDetailPage`, recherche serveur, preview CMS, publication statique vérifiée).
