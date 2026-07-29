# Série A — plan d’exécution des prompts 2 à 6

> **Pour Hermes :** exécuter les lots ci-dessous séquentiellement, avec un seul agent rédacteur dans le worktree courant. Les recalculs et contre-revues peuvent être parallélisés en lecture seule sur un état gelé. Ne pas commit, pousser, déployer ni modifier directement `data/generated/`.

**Objectif :** achever les corrections résiduelles du parcours `p-serie-a` après le prompt 1, sans dégrader le contrat numérique AltoSuite, la cohérence pédagogique, les modes `medium/high` ni les données locales.

**Architecture :** traiter d’abord l’intégrité numérique de la cap table, puis la grille d’évaluation et les liens pédagogiques, avant de regrouper les deux changements qui partagent le registre de leçons. Les invariants sont figés par des tests RED, les JSON sources restent canoniques et les sorties scindées ne sont régénérées qu’après stabilisation du lot éditorial.

**Socle :** React 19, TypeScript, Vite/Vitest, JSON validé par Zod, contenu statique et stockage local versionné.

---

## 1. État de départ et décision sur le prompt 1

Le prompt 1 ne doit pas être rejoué.

L’état courant contient déjà :

- un paramètre optionnel `commonOwnershipPct = 0` dans `client/src/lib/simulators/waterfall.ts`, qui préserve le contrat du simulateur public ;
- le traitement du secondaire comme actions ordinaires dans `client/src/lib/serieA/altosuite.ts` ;
- un multiple brut rapporté au capital total déployé, primaire et secondaire compris ;
- un tableau de waterfall rendu dans `client/src/pages/cases/CaseStudyPage.tsx` et inclus dans l’export Markdown, alors que le prompt initial demandait seulement une recommandation sur cette exposition ;
- une non-régression explicite de l’Offre A.

Le contre-audit a toutefois identifié une dette sémantique à corriger avec le prompt 5 : la colonne et la note « Ordinaires » désignent en réalité le produit revenant aux **autres détenteurs**, puisque la part ordinaire acquise en secondaire par l’investisseur est déjà incluse dans `investorM`. Le calcul reste correct ; seul le libellé est contradictoire (`client/src/lib/serieA/altosuite.ts:143-150,178-181`, `client/src/pages/cases/CaseStudyPage.tsx:124-154`).

Vérification effectuée pendant la préparation de ce plan :

```text
npm run test --workspace client -- src/lib/serieA/altosuite.test.ts src/lib/simulators/waterfall.test.ts
→ 2 fichiers, 14 tests réussis
```

Cette preuve est ciblée. Le gate racine n’a pas été relancé pendant la passe de planification ; le lot 0 devra établir la baseline intégrée avant toute nouvelle écriture.

Le worktree est fortement modifié et plusieurs fichiers cibles sont non suivis. Chaque session doit donc relever `git status --short`, l’empreinte des fichiers qu’elle possède et le diff ciblé avant son premier patch. Aucun reset, clean, checkout destructif ou attribution d’auteur à partir du diff global.

---

## 2. Évaluation de pertinence des six prompts

| Prompt | Verdict | Priorité | Ajustement nécessaire |
|---|---|---:|---|
| 1 — Secondaire dans la waterfall | **Clos et vérifié ciblé** | P0 déjà traité | Ne plus modifier hors régression découverte. L’implémentation a aussi traité le multiple brut et l’exposition du waterfall. |
| 2 — Grille du livrable | **Pertinent, mais diagnostic à nuancer et exécution à scinder** | P1 | `process` n’a aucune couverture identifiable ; `branche-sectorielle` et `tour-complexe` ne sont que partiellement couverts par des critères généraux. Trois critères distincts restent préférables. Il faut modéliser leur rattachement et corriger la sensibilité `medium/high` avant d’exposer les deux critères avancés. |
| 3 — `readMin` et pratique closing | **Pertinent, mais ne pas exécuter tel quel** | P1 | Une formule `ceil(mots du body / 180)` est déjà codifiée pour certains corpus récents, mais pas comme contrat transverse. Les dix valeurs à 8 minutes masquent aussi une enveloppe construite de 480/600 minutes. Il faut décider explicitement de l’opt-in à la formule et recalibrer la pratique séparément. |
| 4 — Réciprocité des simulateurs | **Pertinent et borné** | P2 | La navigation contextuelle existe déjà ; le défaut concerne les liens théoriques hors parcours. Ajouter `lsa-modeliser-transaction` à `dilution` et `waterfall`, sans ajouter `lsa-tour-complexe` au waterfall simplifié. |
| 5 — Ligne seed AltoSuite | **Pertinent et prioritaire, modèle à compléter** | P0 | Le contrat numérique omet 2,4 M d’actions seed et agrège options attribuées/réserve. Produire une cap table pédagogique fully diluted réconciliée, distincte d’une cap table juridique complète et de la waterfall. |
| 6 — Résidus éditoriaux | **Pertinent et faible risque** | P1 | Corriger les deux formulations et ajouter un garde qui inspecte aussi questions et explications de quiz : le garde actuel ne parcourt que `body`, donc une regex simplement élargie resterait inefficace. |

### Décisions métier retenues

1. **Prompt 2 : trois critères, pas un critère “approfondissements”.** Processus/data room, adaptation au modèle économique et décomposition d’un tour complexe portent des preuves, des erreurs et des questions de révision différentes. Les fusionner rendrait la notation peu interprétable.
2. **Prompt 4 : `lsa-tour-complexe` n’est pas un renvoi adapté au simulateur actuel.** Le waterfall public possède un bloc préférentiel unique. Un lien vers une leçon sur la dette, les tranches et les droits renforcés créerait une promesse fonctionnelle excessive.
3. **Prompt 5 : la cap table et la waterfall restent deux contrats distincts.** Les lignes seed, options attribuées et réserve réconcilient l’actionnariat fully diluted, mais les préférences seed ne sont toujours pas modélisées dans la distribution à la sortie. Cette limite doit rester affichée.
4. **Prompt 3 : la règle à 180 mots/minute est retenue comme opt-in Série A, pas comme migration globale.** Elle existe dans `docs/certifications/venture-philanthropy/references-verifiees.md:171-175` et dans les tests récents, mais n’est suivie que par une partie du catalogue. Elle doit être inscrite dans le contrat éditorial général avant application aux dix leçons.
5. **Les enveloppes 480/600 ne sont pas préservées par compensation.** Elles résultent du couple actuel `readMin: 8` + pratiques ajustées. Lecture et pratique étant deux estimations indépendantes, chaque activité doit être recalibrée pour elle-même ; toute promesse de durée globale devra être ratifiée séparément.

---

## 3. Ordre d’exécution

### Lot 0 — Geler la baseline après le prompt 1

**Objectif :** distinguer une régression nouvelle d’un défaut préexistant avant d’ouvrir les prompts 2 à 6.

**Étapes :**

1. Relever `pwd`, branche, `git status --short` et empreintes SHA-256 des fichiers possédés par les lots suivants.
2. Rejouer les deux tests du prompt 1.
3. Exécuter `npm run check` sur l’état courant.
4. Si le gate échoue, classer chaque échec : régression du prompt 1, défaut préexistant, incohérence transversale ou problème d’environnement. Ne pas ouvrir le lot 1 avant d’avoir une baseline comprise.
5. Ne pas lancer de build à cette étape ; un seul build canonique sera produit sur l’état final gelé.

**Modèle conseillé :** GPT-5.5, effort `high`.

---

### Lot 1 — Prompt 5 révisé : cap table pédagogique AltoSuite réconciliée

**Objectif :** rendre la cap table fully diluted avant/après tour réconciliable par ligne économique, sans la qualifier de cap table juridique complète et sans rouvrir le calcul de waterfall validé au prompt 1.

**Fichiers possédés :**

- `data/caseStudies.json`
- `client/src/content/types.ts`
- `scripts/validate-content.mjs`
- `client/src/lib/serieA/altosuite.ts`
- `client/src/lib/serieA/altosuite.test.ts`
- `client/src/pages/cases/CaseStudyPage.tsx`
- `client/src/pages/cases/CaseStudyPage.dom.test.tsx`
- éventuellement `client/src/pages/learn/serieAParcours.dom.test.tsx` pour le contrat DOM intégré

**RED :**

1. Dans `altosuite.test.ts`, construire une copie invalide du scénario dont les composantes nommées ne totalisent pas `fullyDilutedSharesBefore` ; attendre un refus explicite.
2. Attendre `seedInvestorSharesBefore === 2_400_000`, `allocatedOptionSharesBefore === 700_000` et `unallocatedOptionPoolSharesBefore === 500_000`, puis la réconciliation exacte : fondateurs + options attribuées + réserve non attribuée + seed + convertibles = 10 000 000.
3. Contrôler la parité des cinq lignes entre le contrat numérique et le document `cap-table` du cas ; toute duplication restante doit avoir un test de synchronisation explicite.
4. Attendre un nouveau tableau de cap table pour chaque offre, avec total avant et total après calculés sans arrondi intermédiaire.
5. Pour l’Offre B, attendre séparément :
   - primaire Série A préférentiel ;
   - secondaire Série A acquis sur des ordinaires ;
   - baisse symétrique de la ligne fondateurs ;
   - aucune création d’actions par le secondaire.
6. Attendre dans le test DOM un tableau nommé « Cap table pédagogique fully diluted », lisible par technologie d’assistance, et la présence des cinq lignes pré-tour, des lignes Série A et du total.
7. Attendre que la colonne de waterfall auparavant appelée « Ordinaires » soit présentée comme « Autres détenteurs modélisés », sans changement des montants du prompt 1.

**Implémentation :**

1. L’inventaire courant ne contient qu’un seul `numericScenario`. Remplacer l’entrée agrégée `currentOptionPoolShares` par trois champs requis et datés : `allocatedOptionSharesBefore`, `unallocatedOptionPoolSharesBefore` et `seedInvestorSharesBefore`. Conserver `founderSharesBefore` et `convertibleShareEquivalents` ; dériver le pool courant comme somme des deux lignes options. Une société sans seed devra déclarer `0` au lieu d’omettre silencieusement une composante.
2. Étendre le schéma Zod et ajouter une vérification de somme au validateur de contenu et dans `assertScenario`. Les messages doivent nommer les cinq composantes et les totaux constatés.
3. Désigner `numericScenario` comme autorité des calculs et ajouter un test de parité avec le tableau documentaire tant que celui-ci conserve des nombres littéraux. Ne pas laisser deux sources évoluer sans garde.
4. Créer un contrat d’export distinct, par exemple `SerieACapTableExportRow` et `buildSerieACapTableExportRows`, plutôt que de surcharger `buildSerieAOfferExportRows` ou la table de waterfall.
5. Conserver séparées les lignes primaire préférentiel et secondaire ordinaire. Une ligne agrégée “investisseur Série A” masquerait précisément le défaut corrigé au prompt 1.
6. Après tour, maintenir les options attribuées inchangées et affecter le top-up à la réserve non attribuée ; seed et convertibles restent inchangés en nombre. Le secondaire diminue les fondateurs du même nombre d’actions qu’il ajoute à la ligne ordinaire de l’investisseur.
7. Ajouter le tableau au rendu HTML et à l’export Markdown avec une ligne `Total` contrôlable pour chaque offre. Arrondir uniquement au formatage.
8. Renommer dans l’UI, le Markdown et les notes la part résiduelle du waterfall en « Autres détenteurs modélisés ». Ne pas renommer le calcul interne si cela augmente inutilement le risque ; figer les résultats numériques existants.
9. Maintenir la note indiquant que les préférences seed ne sont pas modélisées dans la waterfall pédagogique. La réconciliation fully diluted ne vaut pas complétude de la séniorité à la sortie.

**Déféré explicite :** `preference` et `gouvernance` existent dans `SerieAOfferExportRow` mais ne sont pas rendues dans la comparaison UI/Markdown. Ce défaut d’exposition commerciale est distinct de la réconciliation de cap table ; ne le glisser dans ce lot qu’après décision produit explicite.

**Vérifications ciblées :**

```bash
npm run test --workspace client -- src/lib/serieA/altosuite.test.ts src/lib/simulators/waterfall.test.ts
npm run test --workspace client -- src/pages/cases/CaseStudyPage.dom.test.tsx src/pages/learn/serieAParcours.dom.test.tsx
npm run validate:content:strict
npm run typecheck
```

**Critères de sortie :** cinq lignes pré-tour réconciliées à 10 000 000, totaux avant/après exacts, secondaire sans émission ni cash société, tests du prompt 1 inchangés, libellé résiduel exact et aucune prétention sur le rang seed non modélisé.

**Modèle conseillé :** GPT-5.5, effort `xhigh`. N’utiliser GPT-5.6 que si une divergence de calcul ou de contrat transversal résiste au test réduit.

---

### Lot 2 — Prompt 2 révisé : couverture de grille traçable et compatible avec les budgets

**Objectif :** rendre chaque composant Série A évalué par un critère observable, sans demander à un utilisateur `medium` d’évaluer les deux approfondissements `high`.

**Fichiers possédés :**

- `data/deliverables.json`
- `client/src/content/types.ts`
- `client/src/content/deliverables.ts`
- `scripts/validate-content.mjs`
- `client/src/content/serieAParcours.test.ts`
- `client/src/lib/learningExports.ts`
- `client/src/lib/learningExports.test.ts`
- `client/src/pages/intelligence/DeliverablePage.tsx`
- `client/src/pages/intelligence/DeliverablePage.dom.test.tsx`

**Diagnostic corrigé :** `process` est sans critère identifiable ; `branche-sectorielle` est seulement couverte par la traçabilité générale des preuves ; `tour-complexe` est seulement couvert par l’intégrité de cap table et la lecture des termes. Ajouter trois critères autonomes afin d’évaluer la compétence propre de chaque composant, sans prétendre que les deux approfondissements étaient totalement invisibles :

- `maitrise-process-dataroom` → composant `process` ;
- `pertinence-adaptation-sectorielle` → composant `branche-sectorielle` ;
- `decomposition-tour-complexe` → composant `tour-complexe`.

Les critères doivent rester bornés par `docs/parcours/SERIE-A-PREUVES.md:55-63`, `:103-109` et `:111-117`. Ils ne doivent ni transformer l’ouverture progressive en norme, ni publier un seuil sectoriel universel, ni laisser entendre que toute dette, tranche ou clause renforcée est requise.

**RED :**

1. Dans `serieAParcours.test.ts`, attendre dix critères structurés et une couverture explicite des dix composants.
2. Attendre huit critères applicables en `medium` et dix en `high`.
3. Dans `learningExports.test.ts`, attendre que la fiche et la grille `medium` excluent les deux approfondissements, et que la version `high` les inclue.
4. Dans `DeliverablePage.dom.test.tsx`, vérifier les mêmes ensembles dans l’interface, puis l’absence de débordement horizontal à 390 px lors de la recette.

**Implémentation, en trois sous-lots RED → GREEN dans la même session :**

1. **2A — cœur `medium` :** ajouter d’abord `maitrise-process-dataroom` et son test de couverture. Aligner aussi le composant `closing` sur le gabarit et la leçon en y ajoutant les indicateurs des 100 jours, aujourd’hui absents de `components.requirements` ; le temps associé reste traité au lot 4.
2. **2B — contrat budget :** ajouter au format structuré de `DeliverableCriterion` un rattachement optionnel `componentIds`. Renseigner ce champ sur les huit critères cœur, puis étendre le schéma strict Zod et vérifier que chaque identifiant cible un composant du même livrable. Lorsqu’un livrable choisit ce mécanisme, le validateur doit signaler un composant non couvert ; les livrables historiques qui ne déclarent pas `componentIds` conservent leur contrat.
3. Centraliser dans `client/src/content/deliverables.ts` la sélection des composants, sections et critères par budget. Ne pas maintenir trois filtres légèrement différents dans la page et les deux exports.
4. Passer le budget contextualisé à `buildWorksheetMarkdown`, `buildReviewMarkdown`, `RubricReference` et à l’espace d’appréciation. Accès contextualisé : `medium` affiche les huit éléments cœur ; `high` affiche les dix. Accès direct sans budget : afficher les deux approfondissements comme facultatifs, sans les présenter comme requis pour la complétion cœur.
5. **2C — approfondissements `high` :** seulement après le GREEN de 2B, ajouter `pertinence-adaptation-sectorielle` et `decomposition-tour-complexe`, leurs `componentIds` et leurs preuves bornées. Cette séquence empêche d’exposer deux nouveaux critères avancés dans le mode `medium` défectueux.
6. Vérifier le rendu vertical des dix critères. Le composant utilise des `<details>` ; le risque principal est la longueur et la clarté, pas une table horizontale.

**Déféré explicite :** `learningWorkspace.declareComplete` considère actuellement qu’au moins une appréciation suffit (`client/src/lib/learningWorkspace.ts:389-395`). Exiger toutes les appréciations applicables modifierait le contrat de persistance et les états déjà enregistrés. Ne pas glisser cette migration dans le prompt 2 ; ouvrir un lot distinct si cette exigence produit est confirmée.

**Vérifications ciblées :**

```bash
npm run test --workspace client -- src/content/serieAParcours.test.ts src/lib/learningExports.test.ts src/pages/intelligence/DeliverablePage.dom.test.tsx
npm run validate:content:strict
npm run typecheck
npm run lint
```

**Modèle conseillé :** GPT-5.5, effort `xhigh` en raison du raccord données → types → validation → interface → exports.

---

### Lot 3 — Prompt 4 resserré : renvois des simulateurs vers la leçon de transaction

**Objectif :** compléter les liens théoriques globaux des simulateurs. En contexte `p-serie-a`, la navigation séquentielle relie déjà la leçon, `dilution` et `waterfall` ; ce lot ne corrige donc pas une absence totale de navigation et ne doit pas présenter le waterfall simplifié comme un moteur de tour complexe.

**Fichiers possédés :**

- `data/simulators.json`
- `client/src/content/serieAParcours.test.ts`
- `client/src/pages/learn/serieAParcours.dom.test.tsx`

**RED :**

1. Attendre `lsa-modeliser-transaction` dans `relatedLessonIds` de `dilution` et `waterfall`.
2. Vérifier que les références historiques seed restent présentes.
3. Vérifier l’unicité des listes et le statut publié de chaque leçon rendue ; le schéma actuel accepte les doublons et `lessonById` résout aussi des leçons non publiées.
4. Vérifier dans le DOM qu’un lien vers la leçon Série A est rendu avec son URL canonique hors parcours et conserve `parcours=p-serie-a&budget=medium` lorsqu’elle appartient au contexte actif.

**Implémentation :**

- `dilution` : conserver `l-founder-instruments`, `l-stages`, puis ajouter `lsa-modeliser-transaction` ;
- `waterfall` : conserver `l-ts-economics`, puis ajouter `lsa-modeliser-transaction` ;
- ne pas ajouter `lsa-tour-complexe` tant que le simulateur ne gère ni dette, ni tranches, ni empilement de préférences ;
- ne pas créer de réciprocité artificielle dans `Lesson.furtherReading` : le validateur impose seulement la résolution des références du simulateur, et la navigation du parcours fournit déjà le sens leçon → pratique.

**Déféré explicite :** les notes du parcours promettent de « rejouer une cap table avant et après » et de « comparer deux offres sur trois scénarios », alors que les deux simulateurs génériques ne couvrent qu’une partie de ces opérations. Les liens améliorent la découvrabilité, pas cette fidélité fonctionnelle. Un preset AltoSuite ou une reformulation des notes doit faire l’objet d’un lot produit distinct. Les formulations « Standard VC » et « extrêmement punitif » présentes dans les composants de simulateur sont également à inscrire dans cet audit éditorial séparé.

**Vérifications ciblées :**

```bash
npm run validate:content
npm run test --workspace client -- src/content/serieAParcours.test.ts src/pages/learn/serieAParcours.dom.test.tsx
```

**Modèle conseillé :** GPT-5.5, effort `high`.

---

### Lot 4 — Prompts 3 et 6 regroupés : calibration temporelle et deux corrections éditoriales

**Pourquoi les regrouper :** ils possèdent tous deux `data/parcours/05-preparer-sa-serie-a.lessons.json`, `client/src/content/serieAParcours.test.ts` et les sorties de leçons générées. Deux sessions séparées multiplieraient les conflits et les régénérations sans apporter d’isolation utile.

**Fichiers possédés :**

- `docs/ARCHITECTURE_EDITION.md`
- `data/parcours/05-preparer-sa-serie-a.lessons.json`
- `data/courses.json`
- `client/src/content/serieAParcours.test.ts`
- `client/src/pages/learn/serieAParcours.dom.test.tsx`
- `data/generated/lessons.index.json` — généré uniquement par script
- `data/generated/lessons.bodies.json` — généré uniquement par script

**Constat vérifié avec la regex déjà utilisée par les tests récents :** les dix corps Série A contiennent entre 290 et 459 mots, pour 3 434 mots au total, mais portent tous `readMin: 8`. La convention existante `ceil(mots_total_du_body / 180)` donnerait `3, 2, 2, 2, 2, 3, 2, 2, 2, 2`, soit 18 minutes pour le cœur et 22 minutes pour le cours complet. Cette règle est codifiée pour certains corpus récents, mais n’est pas un contrat transverse : les leçons historiques et les autres registres drop-in ne la suivent pas toutes.

**Phase de décision avant RED :**

1. Ratifier l’opt-in Série A à la formule existante, plutôt que d’imposer immédiatement 180 mots/minute aux corpus historiques.
2. Reprendre exactement le périmètre et la regex des tests maintenus : `body` total, références comprises, motif Unicode `\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*`.
3. Documenter dans `docs/ARCHITECTURE_EDITION.md` la formule, son périmètre et son statut opt-in. La règle est une convention produit, pas une vitesse universelle de lecture.
4. Ratifier l’abandon des enveloppes implicites de 480 minutes pour le cœur et 600 minutes pour le complet. Ne pas réaugmenter mécaniquement les pratiques pour compenser la baisse de `readMin`.
5. Produire dans le compte rendu de session une table de calibration : identifiant, nombre de mots, `readMin` dérivé et pratique estimée séparément.

**RED temporel :**

1. Remplacer l’attente globale `readMin: 8` par un calcul qui vérifie `readMin === ceil(mots du body / 180)` sur les dix leçons Série A.
2. Mettre à jour l’attente `course.durationMin` et toutes les attentes de `parcoursTimeSummary` ; le test actuel fige aussi `readingMinutes`, `requiredMinutes` et `completeMinutes`.
3. Conserver l’invariant du validateur : `durationMin === somme des readMin publiés` pour `durationSource: "lesson-read-minutes"`.
4. Attendre `course.durationMin === 22` et `readingMinutes === 18` pour le cœur, sans recopier les dix valeurs dans un second tableau magique.
5. Si `lsa-closing-board.practice.estimatedMinutes` passe à 52, attendre `requiredMinutes === 652` et `completeMinutes === 760` ; si une revue praticienne retient une autre valeur, recalculer ces totaux à partir des catégories plutôt que d’ajuster les lectures.
6. Ajouter un contrat DOM minimal qui conserve la distinction entre temps de lecture et contribution guidée dans le parcours ; la baisse à 22 minutes est visible sur plusieurs surfaces et ne doit pas être reformulée comme temps total de formation.

**Décision sur `lsa-closing-board.practice.estimatedMinutes`:**

- la pratique demande une checklist, un ordre du jour, des indicateurs à 100 jours et un journal de révision ; le composant doit avoir été aligné au lot 2 ;
- retenir **52 minutes comme estimation produit provisoire**, cohérente avec les blocs `financement` et `process`, puis la faire qualifier par une revue praticienne ; le nombre d’exigences ne constitue pas à lui seul une preuve de durée ;
- distinguer le premier jet du journal dans la pratique de leçon de sa mise à jour après autoévaluation/retour dans les 90 minutes finales, afin d’éviter le double comptage ;
- ne pas modifier les 90 minutes finales seulement pour conserver l’ancien total. Toute requalification doit être justifiée par un découpage des micro-tâches.

**Corrections du prompt 6 :**

1. Reformuler le quiz de `lsa-decision-lever` pour demander explicitement le « premier livrable de ce parcours » et rattacher l’explication à cette méthode locale, sans modifier les options ni la bonne réponse.
2. Reformuler l’explication de `lsa-process-dataroom` : une ouverture en bloc **peut rendre le suivi plus difficile** ; supprimer l’absolu « impossible à suivre ».
3. Étendre le garde éditorial de `serieAParcours.test.ts` pour sérialiser et contrôler le `body`, les questions et les explications de quiz. Le garde actuel ne parcourt que `body` ; élargir uniquement sa regex ne détecterait toujours pas ces résidus.
4. Préserver trois questions par leçon et au moins deux références HTTPS dans chaque corps.

**Ordre de vérification :**

```bash
npm run test --workspace client -- src/content/serieAParcours.test.ts
npm run split:content
npm run validate:content:strict
npm run check:generated
npm run test --workspace client -- src/content/serieAParcours.test.ts src/pages/learn/serieAParcours.dom.test.tsx
```

La première exécution doit fournir le RED du nouveau contrat avant modification des valeurs ; la seconde prouve le GREEN après régénération.

**Modèle conseillé :** GPT-5.5, effort `xhigh` pour la décision de convention et `high` pour les deux retouches. Aucun besoin de `max` si les totaux se réconcilient.

---

### Lot 5 — Intégration, contre-revues et clôture

**État gelé :** aucun fichier source ne change pendant les gates larges et les revues.

**Ordre des commandes :**

```bash
npm run split:content
npm run validate:content:strict
npm run check:generated
npm run typecheck
npm run lint
npm run test
npm run check
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build
npm run check
git diff --check
```

Le second `npm run check` est volontaire : le prebuild régénère sitemap et robots avec l’origine canonique, et le gate final doit porter sur cet état.

**Recette navigateur de l’artefact construit :**

- bureau 1 440 × 1 000 et mobile 390 × 844 ;
- modes `medium` et `high` ;
- cap table pédagogique AltoSuite avant/après avec fondateurs, options attribuées, réserve non attribuée, seed, convertibles, primaire, secondaire et totaux ;
- waterfall du prompt 1 inchangée ;
- grille à huit critères/composants en `medium`, dix en `high`, approfondissements clairement facultatifs en accès direct ;
- liens `dilution` et `waterfall` vers `lsa-modeliser-transaction` ;
- textes corrigés des deux quiz ;
- cours Série A à 22 minutes de lecture et parcours à 652/760 minutes si la pratique closing de 52 minutes est ratifiée ;
- cartes parcours, fiche cours, Bibliothèque et page leçon continuant à distinguer lecture et production ;
- absence de débordement horizontal, H1 unique, tableaux nommés, navigation clavier et console sans erreur applicative.

**Contre-revues parallèles, strictement en lecture seule :**

1. recalcul VC : cap table, transfert secondaire, préférences et limites de la waterfall ;
2. contrat full-stack : types, Zod, exports, budget `medium/high`, DOM et stockage local non régressé ;
3. pédagogie/édition : critères, temps, absence de norme universelle et conformité à `SERIE-A-PREUVES.md`.

Une modification issue d’une revue invalide la revue et les preuves touchées. Rejouer les tests ciblés concernés, puis une seule passe large sur le nouvel état gelé.

**Clôture :**

- mettre à jour `Suivis/ETAT.md` avec les temps et vérifications réellement obtenus ;
- ajouter une entrée factuelle et append-only à `Suivis/JOURNAL.md` ;
- ne pas créer ou réintroduire `Correction.md` ;
- ne pas commit, pousser, lancer de workflow distant ou déployer.

**Modèle conseillé :** GPT-5.5, effort `xhigh`. Réserver GPT-5.6 avec effort maximal à une divergence d’intégration persistante ou à la contre-revue finale si elle révèle un conflit entre modèle numérique, validation et rendu.

---

## 4. Stratégie de parallélisation

Aucun lot d’écriture ne doit être exécuté en parallèle dans le worktree courant :

- les lots 1 et 2 partagent `types.ts` et `validate-content.mjs` ;
- les lots 2, 3 et 4 partagent `serieAParcours.test.ts` ;
- les prompts 3 et 6 partagent le registre de leçons et les générés ;
- le dépôt ne possède pas de commit propre reproduisant le worktree actuel dans des worktrees isolés.

Parallélisation autorisée : inventaires, recalculs, lecture des sources, inspection DOM sans écriture et contre-revues finales sur un jeu de fichiers gelé. Un seul intégrateur applique les corrections retenues.

---

## 5. Prompts de session prêts à l’emploi

### Session 1 — Cap table AltoSuite

> Reprends le lot 1 de `.hermes/plans/2026-07-26_124013-serie-a-prompts-a2-a6-execution.md`. Le prompt 1 est déjà implémenté et ses 14 tests ciblés passent : préserve strictement ses résultats. Travaille en RED → GREEN, remplace le pool agrégé par options attribuées et réserve non attribuée, ajoute `seedInvestorSharesBefore`, réconcilie les cinq lignes à 10 000 000, crée un tableau pédagogique fully diluted distinct avant/après, sépare primaire préférentiel et secondaire ordinaire, puis corrige le libellé résiduel « Ordinaires » sans changer les calculs. Maintiens la limite sur les préférences seed non modélisées et exécute toutes les vérifications ciblées. Ne commit, ne pousse et ne déploie rien.

### Session 2 — Grille et budgets

> Reprends le lot 2 du plan Série A en suivant 2A → 2B → 2C. Ajoute d’abord le critère `process` et l’exigence des indicateurs à 100 jours dans `closing` ; rends ensuite composants, critères, interface et exports réellement sensibles à `medium/high` ; ajoute enfin les deux critères avancés. Rattache les dix critères aux dix composants et borne toute formulation par `docs/parcours/SERIE-A-PREUVES.md`. Commence chaque sous-lot par son test RED. Ne modifie pas le contrat de complétion persisté. Ne commit, ne pousse et ne déploie rien.

### Session 3 — Simulateurs

> Reprends le lot 3 du plan Série A. Le défaut porte sur les liens théoriques hors parcours, pas sur la navigation séquentielle existante. Ajoute uniquement `lsa-modeliser-transaction` aux renvois de `dilution` et `waterfall`, conserve les leçons seed, n’ajoute pas `lsa-tour-complexe` au waterfall simplifié, puis vérifie unicité, publication et URLs avec et sans contexte. Ne commit, ne pousse et ne déploie rien.

### Session 4 — Temps et résidus éditoriaux

> Reprends le lot 4 du plan Série A. Formalise l’opt-in Série A à `ceil(mots du body / 180)` avec la regex existante, documente son périmètre et ne l’impose pas aux corpus historiques. Applique les valeurs `3,2,2,2,2,3,2,2,2,2`, porte provisoirement la pratique closing à 52 minutes avec séparation premier jet/révision finale, puis dérive 22 minutes de cours, 18 minutes de lecture cœur et 652/760 minutes de parcours sans préserver artificiellement 480/600. Corrige ensuite les deux résidus rédactionnels et fais porter le garde sur le corps, les questions et les explications. Régénère uniquement par les scripts et exécute les vérifications du lot. Ne commit, ne pousse et ne déploie rien.

### Session 5 — Intégration finale

> Reprends le lot 5 du plan Série A sur un état gelé. Exécute les gates dans l’ordre indiqué, le build canonique sous `/vc-plateform/`, le gate post-build, la recette desktop/mobile et trois contre-revues parallèles en lecture seule. Après toutes les preuves vertes seulement, mets à jour `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, push, workflow distant ou déploiement.

---

## 6. Risques et points à surveiller

- **Modèle AltoSuite :** les champs explicites `*Before` sont adaptés au seul scénario actuel, moins génériques qu’un registre polymorphe de détenteurs. Ne pas transformer ce lot en refonte de toutes les cap tables.
- **Cap table réconciliée ≠ cap table juridique ni waterfall complète :** les lignes fully diluted réconcilient l’actionnariat, mais ne modélisent pas les droits seed.
- **Critères optionnels :** sans rattachement aux composants, les modes `medium/high` dériveront entre page, export et grille.
- **Temps :** 180 mots/minute est une convention produit existante mais partielle, pas une norme métier VC. Son application Série A reste explicitement opt-in.
- **Double comptage :** les pratiques de leçon et les 90 minutes du jalon final doivent rester disjointes.
- **Persistance locale :** les nouveaux identifiants de critères sont stables. Ne pas renommer les sept identifiants existants, ce qui orphelinerait les appréciations enregistrées.
- **Worktree sale :** relire le contenu exact avant chaque patch et comparer les empreintes après chaque lot. Les fichiers hors périmètre restent intacts.
