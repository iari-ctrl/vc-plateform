# Consolidation de Formation — plan d’implémentation

> **Pour Hermes :** utiliser une exécution par sessions bornées, avec TDD pour les contrats et un seul rédacteur pour les fichiers de données partagés. Ne pas commiter, pousser ou déployer sans demande explicite.

**Objectif :** rendre Formation structurellement cohérente, pédagogiquement exécutable et éditorialement gouvernable avant toute décision de bascule vers une base canonique.

**Architecture :** conserver JSON/Git comme source canonique pendant ce programme. Stabiliser les contrats de publication, de disponibilité, de prérequis, de complétion et de durée ; appliquer ces contrats à quelques tranches verticales représentatives ; préparer ensuite seulement la portabilité vers une base. Une « Formation consolidée » ne signifie pas que tous les contenus futurs sont produits.

**Pile technique :** React/Vite, TypeScript, JSON canonique, Zod, scripts Node, Vitest, tests Node, génération statique et prérendu strict.

---

## 0. Reprise depuis l’état courant

Ce plan reste préparatoire. Le [suivi courant](../../Suivis/ETAT.md#consolidation-formation) porte le statut d’exécution de F0/S0, les commandes réellement disponibles et les observations recalculées. La passe documentaire du 23 septembre 2026 ne livre pas le gate Formation et ne valide aucun lot applicatif.

Avant S0, lire `AGENTS.md` et `CLAUDE.md`, puis [l’état Formation](../../Suivis/ETAT.md#consolidation-formation), [les distinctions du manuel d’architecture](../../docs/ARCHITECTURE_EDITION.md#preparation-formation) et [les politiques Parcours](../../docs/parcours/README.md#preparation-formation). Recouper avec `package.json`, `client/src/content/parcoursTypes.ts`, `client/src/content/parcours.ts`, `client/src/content/learningTime.ts` et les schémas de `scripts/validate-content.mjs`.

Les compteurs et listes du §1 sont une baseline historique, pas des attentes de test ni une liste de productions à relancer. Les quantités de prérequis et de sorties résolues doivent être recalculées avec une définition explicite ; ne pas les actualiser par simple reprise des anciens nombres. Un cours vide reste une fixture nécessaire même si aucun cours du corpus courant n’est vide.

## 1. Baseline historique vérifiée le 31 juillet 2026

### Fondations déjà présentes

- `Path = Parcours` est stabilisé comme une trajectoire ordonnée composée de ressources existantes.
- La Bibliothèque est un inventaire filtrable, sans taxonomie intermédiaire concurrente.
- Les identifiants et slugs sont utilisés par les routes, relations, contenus et projections générées.
- Les leçons possèdent un statut explicite `published | upcoming` ; la publication est fermée par défaut pour les familles déjà raccordées à `shared/publication.mjs`.
- Les données apprenant restent locales, versionnées et distinctes du contenu éditorial.
- La validation stricte, les générateurs, les tests, le sitemap et le prérendu forment déjà une chaîne de publication solide.
- `p-serie-a`, `p-venture-philanthropy-foundations`, `p-stage`, `p-entretien-analyst` et le cours `c-mathematiques-vc` fournissent plusieurs exemples de tranches verticales abouties.

### État recalculé depuis les données du relevé initial

- 24 parcours, 30 cours, 145 leçons indexées, dont 118 publiées.
- Aucun step déclaré `existant` ne pointe vers une ressource absente.
- Deux étapes requises restent `a-produire` :
  - `p-meilleur-analyst` → `todo-ecrire-memo` ;
  - `p-express-entretien` → `todo-mini-case-express`.
- Quatre étapes facultatives restent `a-produire` :
  - `todo-myth-vc-mise` ;
  - `todo-cafe-reseau` ;
  - `todo-pourquoi-ce-fonds` ;
  - `todo-process-levee`.
- Six parcours possèdent actuellement une étape de sortie résolue ; dix-huit n’en possèdent pas.
- Vingt-cinq dépendances de leçons ne sont pas satisfaites avant leur consommation, dans quatorze parcours.
- Trois parcours utilisent des temps dérivés ; vingt et un conservent des temps déclarés.
- Trois cours liés aux axes optionnels de `VC Analyst` déclarent respectivement 8, 6 et 14 leçons, mais n’en exposent actuellement que 0, 0 et 1 comme publiées. Les deux cours vides restent présents dans l’inventaire et leurs durées déclarées sont nulles : leur traitement doit relever du contrat de disponibilité, pas d’une production éditoriale automatique.

Ces nombres constituent une baseline de planification datée, conservée sans réécrire le relevé initial. Ils devront être recalculés par le futur gate, sans être recopiés comme constantes de produit. Les observations plus récentes sont dans `Suivis/ETAT.md`.

### Travail local à préserver

Au relevé initial, le worktree comportait quatre modifications non liées à ce plan :

- `Suivis/ETAT.md` ;
- `Suivis/JOURNAL.md` ;
- `client/src/components/chrome/TopBar.tsx` ;
- `client/src/pages/home/homeExperience.dom.test.tsx`.

Un audit non suivi, archivé depuis sous `docs/archive/reviews/2026-07-31-cours-sans-lecon-publiee.md`, est apparu pendant la préparation du présent plan. Il constitue un snapshot daté et non une source d’état courant. Cette liste n’est donc pas un manifeste de propriété : chaque session doit relever son propre baseline et préserver tout changement qu’elle ne possède pas explicitement.

---

## 2. Définition de « Formation consolidée »

Formation est suffisamment consolidée pour ouvrir un prototype de base lorsque les conditions suivantes sont réunies.

### Contrat structurel

- Chaque entité publique de Formation possède un identifiant stable, un slug stable et un état éditorial explicite.
- Publication et disponibilité sont distinctes : un contenu peut être publié tout en étant signalé comme incomplet, mais il ne peut pas être présenté comme exécutable si une étape requise manque.
- Une ressource non explicitement publiée n’entre ni dans les routes publiques, ni dans la recherche, ni dans le sitemap, ni dans le prérendu.
- Les références entre parcours, cours, leçons, cas, simulateurs et livrables sont validées par identifiant.

### Contrat pédagogique

- Chaque parcours déclare son mode de complétion : connaissance, orientation ou production.
- Un parcours de production possède une sortie réelle : route, gabarit, grille, charge, état local et cycle de révision approprié.
- Un parcours de connaissance ne reçoit pas artificiellement un livrable ; ses objectifs, sa séquence et ses contrôles formatifs doivent suffire à sa promesse.
- Un parcours d’orientation s’achève sur un diagnostic ou un aiguillage explicite, sans résultat professionnel implicite.
- Chaque prérequis de leçon est soit rencontré plus tôt dans le parcours, soit déclaré comme prérequis d’entrée stable, soit retiré après décision pédagogique.
- Les durées sont dérivées des activités connues ou accompagnées d’une justification explicite lorsqu’elles restent déclarées.

### Contrat éditorial

- Les affirmations factuelles sont sourcées et bornées ; aucune provenance n’est inventée.
- Les contenus juridiques, fiscaux, financiers et professionnels précisent leur périmètre et leurs limites.
- Les parcours prioritaires ont été relus par les praticiens nécessaires ; une revue automatisée ne vaut pas validation métier.
- Les hypothèses, exemples fictifs et données de démonstration sont signalés.

### Contrat opérationnel

- Un gate déterministe mesure la préparation de Formation.
- Les tranches de référence passent les tests de contrat, le gate complet et une recette de l’artefact construit.
- Deux cycles éditoriaux consécutifs ont pu modifier puis republier une tranche sans rupture d’identifiant, de route ou de projection.

---

## 3. Principes de périmètre

### À faire

- Corriger d’abord les incohérences transverses qui affectent plusieurs parcours.
- Utiliser les tranches déjà abouties comme fixtures de référence plutôt que les réécrire.
- Prioriser les parcours `now` et `next`, puis les parcours servant directement le socle Analyst.
- Concevoir une sortie seulement lorsque la promesse du parcours exige une production observable.
- Maintenir la frontière stricte entre Formation ouverte et certification.

### À ne pas faire

- Ne pas affecter automatiquement un livrable à chaque parcours sans sortie résolue.
- Ne pas transformer `roadmap: later` en statut de publication implicite.
- Ne pas ajouter une base, un CMS, des comptes ou une API pendant la consolidation.
- Ne pas compléter toutes les leçons `upcoming` avant d’avoir défini leur déclencheur de production.
- Ne pas modifier directement `data/generated/`.
- Ne pas produire les quatre niveaux supérieurs de certification ni activer une délivrance professionnelle.

---

## 4. Plan par lots

## Lot F0 — Installer un gate de préparation de Formation

**Objectif :** remplacer les audits ponctuels et les anciens compteurs par un contrôle déterministe rejouable.

**Limite de S0 :** livrer le diagnostic sans modifier les données, la publication ou le modèle pédagogique. Les métadonnées de disponibilité, de complétion et de prérequis d’entrée non encore modélisées sont signalées comme telles ; elles ne permettent pas de déduire qu’un parcours est exécutable ou de production. Les fixtures de ces contrats futurs précèdent les décisions de S1 et leur implémentation en S2. La validation stricte actuelle ne remplace pas ce diagnostic.

**Modèle conseillé :** GPT-5.5 `high` pour l’inspection ; GPT-5.5 `xhigh` uniquement si les règles révèlent une contradiction d’ontologie.

**Fichiers :**

- Créer : `scripts/formation-readiness.mjs`
- Créer : `scripts/formation-readiness.test.mjs`
- Modifier : `package.json`
- Modifier si extraction nécessaire : `scripts/validation-core.mjs`
- Tester : `scripts/validation-core.test.mjs`
- Mettre à jour après vérification : `Suivis/ETAT.md` et `Suivis/JOURNAL.md`

**Travail :**

1. Écrire des fixtures RED couvrant :
   - step `existant` non résolu ;
   - étape requise `a-produire` dans un parcours déclaré exécutable ;
   - prérequis placé après la leçon ;
   - prérequis absent et non déclaré comme prérequis d’entrée ;
   - parcours de production sans sortie résolue ;
   - durée dérivée incomplète ;
   - ressource publique sans état explicite ;
   - cours présenté comme disponible alors qu’il ne possède aucune leçon publique.
2. Implémenter une CLI pure, sans écriture, produisant un résumé humain et une sortie JSON optionnelle.
3. Ne pas figer les volumes actuels comme attentes de test ; tester les invariants sur fixtures.
4. Ajouter `npm run validate:formation`.
5. Ne pas l’ajouter immédiatement à `npm run check` : le gate doit d’abord fonctionner en mode diagnostic sur le corpus courant.

**Vérification :**

```text
node --test scripts/formation-readiness.test.mjs
npm run validate:formation
npm run validate:content:strict
```

**Critère de sortie :** le rapport reproduit les incohérences actuelles sans faux positif sur les références existantes, distingue constats et arbitrages encore ouverts, et ne réemploie pas les compteurs historiques comme résultats. L’exécution du gate ne modifie ni les données, ni les projections générées, ni les autres fichiers du worktree. Consigner la livraison réelle dans `Suivis/ETAT.md` et `Suivis/JOURNAL.md` ; ne promouvoir dans les autorités que les contrats effectivement stabilisés.

---

## Lot F1 — Stabiliser publication, disponibilité et mode de complétion

**Objectif :** empêcher qu’un parcours visible soit confondu avec un parcours exécutable ou certifiant.

**Modèle conseillé :** une session de décision GPT-5.5 `xhigh`, puis une session d’exécution GPT-5.5 `high`.

**Fichiers probables :**

- `client/src/content/types.ts`
- `client/src/content/parcoursTypes.ts`
- `scripts/validate-content.mjs`
- `scripts/validation-core.mjs`
- `scripts/validation-core.test.mjs`
- `shared/publication.mjs`
- `data/parcours.json`
- `data/courses.json`
- `data/caseStudies.json`
- `data/deliverables.json`
- `data/simulators.json`
- `client/src/content/parcours.ts`
- `client/src/content/courses.ts`
- `scripts/collect-routes.mjs`
- `scripts/collect-routes.test.mjs`
- `docs/ARCHITECTURE_EDITION.md`
- `docs/parcours/README.md`

**Décisions à prendre avant écriture :**

1. Définir un état éditorial commun, compatible avec `isPublishedContent`.
2. Définir séparément la disponibilité pédagogique : exécutable, partielle ou en construction.
3. Définir le mode de complétion minimal :
   - `knowledge` ;
   - `orientation` ;
   - `production`.
4. Déterminer quelles collections Formation doivent être filtrées par le prédicat public commun.
5. Conserver `ParcoursStep.status` comme état de résolution d’étape ; ne pas lui faire porter l’état éditorial du parcours.
6. Décider séparément du traitement d’un cours sans leçon publiée dans la Bibliothèque, sa route directe, le sitemap et les badges de certification. Une durée de `0 min` ne doit pas servir seule de signal de disponibilité.

**TDD :**

1. Ajouter un test négatif : une entrée sans publication explicite n’est ni collectée ni exposée.
2. Ajouter un test négatif : un parcours `production` exécutable sans sortie résolue est invalide.
3. Ajouter un test positif : `p-serie-a` satisfait le mode production.
4. Ajouter un test positif : `p-analyst-foundations` peut rester un parcours de connaissance sans certification ni résultat local.
5. Ajouter un test négatif : un cours sans leçon publique n’est pas présenté comme disponible ni associé silencieusement à une durée nulle.
6. Migrer les données seulement après validation du contrat.

**Vérification :**

```text
node --test scripts/validation-core.test.mjs scripts/collect-routes.test.mjs
npm run test --workspace client -- src/content/parcours.test.ts src/content/search.test.ts
npm run validate:content:strict
npm run check:generated
```

**Critère de sortie :** toutes les familles publiques de Formation sont fail-closed et chaque parcours a un mode de complétion explicite, sans changement involontaire d’URL.

---

## Lot F2 — Résoudre la fermeture des prérequis

**Objectif :** corriger les dépendances absentes ou placées après leur consommation, telles que recalculées par F0 ; les vingt-cinq occurrences du relevé initial ne sont pas une cible fixe.

**Modèle conseillé :** GPT-5.5 `high` pour la cartographie ; GPT-5.5 `xhigh` pour les décisions d’ajout ou de retrait.

**Fichiers :**

- `data/parcours.json`
- `data/lessons.json`
- les registres `data/parcours/*.lessons.json` uniquement si un prérequis appartient à une leçon drop-in
- `client/src/content/parcoursTypes.ts`
- `scripts/validate-content.mjs`
- `scripts/validation-core.mjs`
- `scripts/formation-readiness.mjs`
- `client/src/content/parcours.test.ts`
- `scripts/formation-readiness.test.mjs`
- `docs/parcours/README.md`

**Approche :**

1. Ajouter un champ stable de prérequis d’entrée par identifiant de leçon, sans remplacer immédiatement les explications textuelles existantes.
2. Pour chaque incohérence, choisir explicitement :
   - réordonner la leçon ;
   - déclarer le prérequis comme acquis d’entrée ;
   - ajouter la leçon au parcours ;
   - retirer le prérequis de la leçon s’il n’est pas réellement nécessaire.
3. Les réordonnancements purement mécaniques peuvent être appliqués ensemble.
4. Les ajouts et retraits changent le contrat pédagogique : les soumettre à validation avant modification.
5. Ne pas créer de nouvelle leçon uniquement pour satisfaire mécaniquement un graphe.

**Vérification :**

```text
node --test scripts/formation-readiness.test.mjs scripts/validation-core.test.mjs
npm run test --workspace client -- src/content/parcours.test.ts
npm run validate:formation
npm run check
```

**Critère de sortie :** aucun prérequis d’une leçon consommée par un parcours exécutable n’est postérieur ou inexpliqué.

---

## Lot F3 — Arbitrer les étapes `a-produire` restantes

**Objectif :** ne conserver aucun placeholder implicite dans un parcours présenté comme exécutable.

**Modèle conseillé :** GPT-5.5 `high` pour le mémo d’arbitrage ; GPT-5.5 `xhigh` pour chaque production éditoriale complexe.

**Session de décision, sans écriture :**

- Repartir de la liste courante fournie par F0, pas des six entrées historiques du §1. Pour les étapes facultatives encore présentes, choisir entre retrait et production. Le retrait est une décision légitime si la promesse principale reste intacte.
- Pour `todo-ecrire-memo`, choisir entre :
  - produire un livrable complet ;
  - réduire la promesse de `p-meilleur-analyst` ;
  - rendre le parcours explicitement partiel ou non public.
- Pour `todo-mini-case-express`, choisir entre :
  - produire un mini-cas réellement compatible avec la promesse temporelle ;
  - retirer cette promesse ;
  - rendre le parcours non exécutable.

**En cas de production :**

- une session de spécification en lecture seule ;
- une session de sourcing et de registre de preuves ;
- une session de production ;
- une session de contre-revue et recette.

**Fichiers possibles :**

- `data/parcours.json`
- `data/deliverables.json`
- `data/caseStudies.json`
- `data/caseCorrections.json`
- `data/lessons.json`
- `client/src/content/parcours.test.ts`
- tests spécialisés à créer pour chaque tranche

**Critère de sortie :** aucun parcours exécutable ne contient d’étape requise `a-produire`; les étapes facultatives restantes sont explicitement compatibles avec l’état affiché.

---

## Lot F4 — Qualifier les parcours sans sortie résolue

**Objectif :** éviter à la fois les promesses non exécutables et la production artificielle de livrables ; utiliser l’inventaire actualisé par F0, pas le nombre de dix-huit du relevé initial.

**Modèle conseillé :** GPT-5.5 `xhigh`, une session d’arbitrage groupée ; aucune écriture pendant cette session.

**Pour chaque parcours :**

1. Lire son `goal`, son `hook`, ses `outcomes`, son `milestone` et ses steps.
2. Le classer comme :
   - connaissance ;
   - orientation ;
   - production.
3. Vérifier si le texte promet réellement un artefact, une décision ou seulement une compréhension.
4. Choisir :
   - conserver sans livrable ;
   - raccorder un livrable existant ;
   - produire un nouveau livrable ;
   - réduire la promesse ;
   - placer le parcours en construction ou en brouillon.
5. Prioriser seulement les parcours `now` et `next` dont la promesse produit est maintenue.

**Ordre conseillé après arbitrage :**

1. parcours aujourd’hui bloqués par une étape requise ;
2. parcours `now` ou `next` dont le titre promet explicitement une production ;
3. parcours servant le socle Analyst ;
4. parcours `later`, qui peuvent rester non publics ou en construction.

**Critère de sortie :** chaque parcours possède une promesse compatible avec son mode de complétion et son état de disponibilité.

---

## Lot F5 — Réconcilier les durées

**Objectif :** faire correspondre la charge affichée aux lectures, pratiques, cas, simulateurs et livrables réellement consommés.

**Dépendances :** F2, F3 et les arbitrages de F4 doivent être terminés ; sinon la séquence et les activités changeront encore.

**Modèle conseillé :** GPT-5.5 `high`.

**Fichiers :**

- `client/src/content/learningTime.ts`
- tests de `client/src/content/parcours.test.ts`
- tests spécialisés des tranches de référence
- `data/parcours.json`
- `data/caseStudies.json`
- `data/deliverables.json`
- `data/simulators.json`
- `data/lessons.json`
- `docs/parcours/README.md`

**Travail :**

1. Tester les catégories de temps : lecture, pratique guidée, consolidation, final, facultatif.
2. Vérifier que chaque activité structurée contribue une seule fois.
3. Ajouter une durée aux activités actuellement non mesurables lorsque cette durée est une promesse produit justifiée.
4. Migrer progressivement les parcours matures vers `time.source: derived`.
5. Conserver une durée déclarée uniquement lorsqu’elle correspond à une contrainte éditoriale assumée et documentée.
6. Corriger en priorité `p-analyst-foundations` et les risques de durée encore signalés dans `Suivis/ETAT.md`.

**Vérification :**

```text
npm run test --workspace client -- src/content/parcours.test.ts src/content/serieAParcours.test.ts src/content/mathVentureCourse.test.ts
npm run validate:formation
npm run check
```

**Critère de sortie :** les tranches publiées prioritaires n’affichent plus une charge incompatible avec leurs activités réelles.

---

## Lot F6 — Consolider la qualité pédagogique et les preuves

**Objectif :** traiter la qualité inégale du corpus sans produire indistinctement toutes les surfaces futures.

**Modèle conseillé :** GPT-5.5 `xhigh` pour sourcing et rédaction ; réserver GPT-5.6 à une contre-revue finale réellement transverse.

**Ordre :**

1. Faire relire `p-analyst-foundations` par un praticien VC.
2. Faire relire le parcours entretien Analyst par un praticien du recrutement VC France/Europe.
3. Faire relire Trait d’Union par les compétences finance/comptabilité, droit et safeguarding nécessaires.
4. Traiter ensuite les parcours `now` et `next` ayant une faiblesse éditoriale encore confirmée par un audit actuel.
5. Ne produire les leçons `upcoming` que si un cas, un livrable ou une épreuve identifie un manque précis.

**Règles :**

- Une session = une famille de claims et un jeu de fichiers borné.
- Récupérer et lire les sources avant rédaction.
- Conserver un registre de preuves lorsque les affirmations sont financières, juridiques ou professionnelles.
- Une validation praticienne doit être consignée comme externe ; ne jamais la simuler.
- Les limites géographiques, temporelles et institutionnelles doivent être visibles dans le contenu publié.

**Critère de sortie :** les parcours prioritaires sont factuellement défendables, pédagogiquement cohérents et explicitement bornés.

---

## Lot F7 — Geler trois contrats de référence

**Objectif :** disposer d’un échantillon stable couvrant les principaux modes de Formation.

**Tranches :**

1. `p-analyst-foundations` — parcours de connaissance, sans résultat ni certification.
2. `p-serie-a` — parcours de production avec livrable exécutable.
3. `p-venture-philanthropy-foundations` — parcours longitudinal complexe nécessitant des limites professionnelles et une validation praticienne.

**Tests existants à conserver et compléter :**

- `client/src/content/parcours.test.ts`
- `client/src/content/serieAParcours.test.ts`
- `client/src/content/mathVentureCourse.test.ts`
- `client/src/content/venturePhilanthropyLearning.test.ts`
- `client/src/content/lessons.test.ts`
- `client/src/content/search.test.ts`
- `scripts/formation-readiness.test.mjs`
- `scripts/validation-core.test.mjs`
- `scripts/collect-routes.test.mjs`

**Recette :**

- chemin direct depuis `/parcours` ;
- reprise depuis une leçon ;
- passage entre cours, cas, simulateur et livrable ;
- progression sans faux `100 %` ;
- modes de temps ;
- export local du livrable lorsque prévu ;
- absence de route publique pour les contenus non publiés ;
- desktop et mobile ;
- console vide et absence de débordement horizontal.

**Critère de sortie :** les trois modes sont prouvés par tests de contrat et par recette de l’artefact construit.

---

## Lot F8 — Clôture et passage éventuel au prototype de base

**Objectif :** établir un gate de décision, pas déclencher automatiquement une migration.

**Vérification finale :**

```text
npm run validate:formation
npm run check
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build
git diff --check
```

Après le build, relancer `npm run check` si le build régénère des sorties versionnées. Restaurer toute sortie locale liée à une origine de test si nécessaire.

**Clôture documentaire :**

- mettre à jour `docs/ARCHITECTURE_EDITION.md` et `docs/parcours/README.md` seulement pour les contrats durables ;
- mettre à jour `Suivis/ETAT.md` avec l’état final vérifié et les compteurs fournis par les validateurs ;
- ajouter une entrée matérielle à `Suivis/JOURNAL.md` ;
- ne pas réouvrir `Correction.md` ;
- ne pas commiter, pousser ou déployer sans instruction explicite.

**Porte de décision pour une base :**

Un prototype Payload/Directus peut commencer si :

- les trois contrats de référence sont verts ;
- les identifiants, statuts, relations et durées sont stabilisés ;
- le gate Formation est bloquant pour les contenus déclarés exécutables ;
- un besoin éditorial réel est observé ;
- l’import et l’export JSON déterministes sont définis ;
- le prototype ne devient pas automatiquement la source canonique.

---

## 5. Ordre de sessions recommandé

| Session | Objet | Effort | Écriture | Dépendance |
| --- | --- | --- | --- | --- |
| S0 | Gate de préparation Formation | GPT-5.5 `high` | scripts/tests, `package.json`, suivis ; sans migration de données | aucune |
| S1 | Décision publication, disponibilité, complétion | GPT-5.5 `xhigh` | non | S0 |
| S2 | Implémentation du contrat transverse | GPT-5.5 `high` | code/data/docs | S1 |
| S3 | Cartographie des prérequis actuels | GPT-5.5 `high` | non | S2 |
| S4 | Correction des prérequis approuvés | GPT-5.5 `xhigh` | data/tests | S3 |
| S5 | Arbitrage des placeholders restants | GPT-5.5 `high` | non | S2 |
| S6+ | Production ou retrait, une sortie à la fois | GPT-5.5 `xhigh` | data/tests | S5 |
| S7 | Qualification des parcours sans sortie | GPT-5.5 `xhigh` | non | S2 |
| S8 | Réconciliation des durées | GPT-5.5 `high` | code/data/tests | S4, S6, S7 |
| S9+ | Revues et corrections éditoriales prioritaires | GPT-5.5 `xhigh` | data/docs/tests | décisions produit |
| SF | Gate final, recette et suivis | GPT-5.5 `xhigh` | suivis | tous les lots retenus |

### Parallélisation autorisée

- Les revues praticiennes peuvent être organisées pendant F0–F5.
- Les recherches de sources sur deux parcours peuvent être parallèles si elles restent en lecture seule et produisent des registres séparés.
- Une piste client ne touchant pas `data/` peut être menée en parallèle d’une piste éditoriale.

### Parallélisation interdite

- Deux rédacteurs sur `data/parcours.json`.
- Deux rédacteurs sur `data/lessons.json`.
- Modification simultanée d’un contrat partagé et des données qui en dépendent.
- Production de livrables avant arbitrage du mode de complétion.

---

## 6. Prompt de lancement réutilisable

> Consolide Formation sans introduire de base de données. Commence par lire `AGENTS.md`, `CLAUDE.md`, la section Formation de `Suivis/ETAT.md`, `docs/ARCHITECTURE_EDITION.md` §2.2.c, §4.0.b–c et §4.3bis–4.4, `docs/parcours/README.md`, puis le §0 et le lot correspondant à la session demandée (S0 → F0) dans `.hermes/plans/2026-07-31_191055-consolidation-formation.md`, avec ses vérifications et critères de sortie, pas seulement le tableau des sessions. `PRODUCT.md` porte les principes produit ; lire les autres autorités spécialisées seulement si le lot les concerne.
>
> Exécute uniquement la session [Sx]. Recalcule l’état depuis les données actuelles ; ne fais pas confiance aux anciens compteurs. Préserve les modifications préexistantes du worktree et n’édite jamais `data/generated/` directement.
>
> Pour F0/S0, créer et tester le diagnostic seulement : ne pas migrer les statuts ou les données et ne pas ajouter `validate:formation` au gate global. Vérifier les commandes existantes dans `package.json` ; celles du plan désignées « créer » restent des livrables, pas des prérequis déjà disponibles.
>
> Distingue publication, disponibilité, résolution d’étape et mode de complétion. Ne crée pas un livrable uniquement parce qu’un parcours n’en possède pas : vérifie d’abord si sa promesse relève de la connaissance, de l’orientation ou de la production.
>
> Pour toute modification de code, applique RED–GREEN–REFACTOR avec tests ciblés. Pour toute modification éditoriale, récupère et lis les sources avant rédaction, distingue fait, hypothèse et exemple méthodologique, et respecte le ton institutionnel.
>
> Termine par les portes ciblées prévues dans le plan. Ne lance `npm run check` ou le build qu’après gel du jeu de fichiers. Ne commite, ne pousse et ne déploie rien. Rends le diff, les commandes réellement exécutées, leurs résultats et les limites restantes.

---

## 7. Décision synthétique

La consolidation ne consiste pas à terminer tout Formation. Elle consiste à rendre fiable le système qui permet de savoir, pour chaque parcours :

- s’il est publiable ;
- s’il est réellement exécutable ;
- ce qu’il demande comme prérequis ;
- ce qu’il fait produire ou comprendre ;
- combien de temps il mobilise ;
- quelles preuves soutiennent son contenu ;
- quelles limites ou validations externes restent ouvertes.

La priorité immédiate est donc : **gate de préparation → contrat de maturité → prérequis → placeholders requis → classification des promesses → durées → revues praticiennes**. La préparation d’une base vient ensuite, à partir de contrats stabilisés et de trois tranches de référence.