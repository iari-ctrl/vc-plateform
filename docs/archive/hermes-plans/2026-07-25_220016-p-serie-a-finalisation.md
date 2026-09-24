> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Finalisation de `p-serie-a` — plan d’implémentation TDD

> Exécuter uniquement après un `go` explicite. Le plan antérieur `.hermes/plans/2026-07-25_175557-p-serie-a.md` reste inchangé comme état historique de la première refonte.

## 1. Périmètre, baseline et décisions

### Baseline gelé

La capture brute est conservée dans :

- `.hermes/plans/2026-07-25_220016-p-serie-a-finalisation-baseline.md`

État avant toute édition d’implémentation :

- branche `master` ;
- 57 fichiers suivis modifiés, 50 fichiers non suivis, 107 entrées dans `git status --short` ;
- diff global préexistant : 3 960 insertions et 154 suppressions ;
- aucun reset, clean, checkout destructif, commit, push ou déploiement ne sera effectué ;
- les deux fichiers Série A non suivis sont préservés comme travaux en cours :
  - `client/src/content/serieAParcours.test.ts` — SHA-256 initial `c17bf8841438a8891d21eccfb3a28d0036f716d9fe5869c75e70bc9e22b41403` ;
  - `data/parcours/05-preparer-sa-serie-a.lessons.json` — SHA-256 initial `b794c944eba6e88ec417535b8eada73ba32ccda7114ccce9219ffa20676a645a`.

Le diff ciblé montre que `c-serie-a-preparation`, `todo-attentes-serie-a` et `cs-serie-a-alto-sas` sont des ajouts au worktree par rapport à `HEAD`; l’entrée `p-serie-a` modifie `time`, `timeFit` et `steps`. Les gros registres JSON seront modifiés par patch ciblé sur ces seuls enregistrements.

### Constats consolidés des quatre audits en lecture seule

1. **Charge/produit :** les 480/600 minutes ne couvrent actuellement que les leçons, leurs pratiques et six minutes de consigne finale ; le cas et les simulateurs sont exclus. `medium` masque le cas et exige néanmoins dix composants.
2. **Navigation/progression :** `CaseStudyPage` et `SimulatorPage` ignorent le contexte ; la reprise ne possède aucun état terminal pour les simulateurs ; le pourcentage, la reprise et la navigation n’emploient pas tous le même ensemble d’étapes. Les cartes de parcours, le tableau de bord et certains liens internes perdent aussi le budget ou le parcours.
3. **Numérique :** la trésorerie se réconcilie et le burn net moyen Oct.–Jan. vaut 245 k€/mois, mais le tableau n’est qu’un pont de quatre mois ; pool, conversion, secondaire et waterfall sont sous-spécifiés. Les simulateurs génériques ne représentent pas l’ensemble de ces conventions et le libellé ESOP pre-money du simulateur de dilution contredit son dénominateur post-money.
4. **Pédagogie/documentation :** les quatre cartes de rôle ne constituent pas un protocole, la complétion finale est contournable, aucune correction AltoSuite n’existe, et plusieurs sources sont employées au-delà de leur périmètre. La leçon n’explique pas non plus les effets potentiellement contraignants d’une term sheet, ni assez précisément le statut d’un « board » en SAS.

### Contrat de charge retenu

La cible 480/600 n’est pas conservée pour le **parcours complet**. Elle correspond aux sessions de leçons, pas aux activités autonomes désormais visibles.

| Catégorie, comptée une fois | `medium` | ajout `high` |
|---|---:|---:|
| Lectures des 8 leçons cœur | 64 min | — |
| Pratiques des 8 leçons cœur | 416 min | — |
| AltoSuite : lecture 12 + travail 60 | 72 min | — |
| Deux simulateurs génériques | 30 min | — |
| Jalon : consigne 6 + assemblage/revue/révision 90 | 96 min | — |
| Deux approfondissements de 60 min | — | 120 min |
| **Total** | **678 min (11 h 18)** | **798 min (13 h 18)** |

Les pratiques cœur redeviennent les huit sessions explicites de 50, 70, 60, 60, 75, 55, 70 et 40 minutes, lecture comprise : `42, 62, 52, 52, 67, 47, 62, 32` minutes de pratique. Les 90 minutes finales couvrent 30 minutes d’assemblage, 21 minutes d’autoévaluation, 15 minutes de consignation du retour et 24 minutes de révision/journal. Une revue humaine est un mode alternatif ; elle n’est ni une preuve automatique ni une activité additive imposée.

`medium` contiendra 12 étapes : huit leçons cœur, AltoSuite, deux simulateurs et le jalon. `high` contiendra ces 12 étapes plus les deux approfondissements. Le livrable exigera huit composants en `medium` et dix en `high`.

### Conventions numériques AltoSuite retenues

- Les 10 000 000 titres fully diluted avant tour incluent 900 000 convertibles traités comme équivalents ordinaires 1:1, convertis avant le top-up et la fixation du prix.
- Le pool désigne le **pool total** (700 000 attribués + réserve non attribuée) ; son top-up est pré-money.
- Offre A : pool total = 15 % post-primaire ; 7 M€ primaires ; aucun secondaire ; 28 M€ pre-money.
- Offre B : pool total = 18 % immédiatement avant le primaire ; 9 M€ primaires ; 1 M€ secondaire acheté aux fondateurs par le lead au même prix par action, après le primaire ; le secondaire ne finance pas la société et conserve la nature ordinaire des titres transférés.
- Préférence : 1x non participante, sans dividende cumulé, senior aux titres ordinaires, conversion facultative ; seuls les titres primaires Série A portent la préférence.
- Pour le waterfall pédagogique, tous les titres/options fully diluted sont réputés exercés ou attribués avant la sortie, sans produit d’exercice ; les autres titres sont ordinaires-equivalents.
- Sorties de référence : 15 M€, 40 M€ et 100 M€ ; les distributions doivent se réconcilier exactement au produit de sortie.
- Le tableau existant est nommé « pont de trésorerie sur quatre mois ». Une projection mécanique distincte part de 820 k€ fin janvier, prolonge un burn net constant de 245 k€/mois jusqu’au seuil de 0 €, et compare un closing de référence au 31 janvier à un closing retardé au 30 avril. Les 7/9 M€ primaires entrent dans la société ; le million secondaire n’y entre jamais ; frais de transaction et réduction de dépenses valent 0 dans le préréglage et restent des hypothèses modifiables.
- Runway de référence : trésorerie de fin janvier 820 k€ / burn net moyen Oct.–Jan. 245 k€ = 3,3469 mois ; le runway au début d’octobre (1,8 M€) est présenté séparément à 7,3469 mois. Ces quotients sont des extrapolations mécaniques, pas des prévisions validées.

Résultats de référence à protéger :

| Résultat | Offre A | Offre B |
|---|---:|---:|
| Pool total | 2 030 769,23 | 1 931 707,32 |
| Top-up | 830 769,23 | 731 707,32 |
| Prix/action | 2,585227 € | 2,981818 € |
| Actions primaires | 2 707 692,31 | 3 018 292,68 |
| Actions secondaires | 0 | 335 365,85 |
| Total FD post-tour | 13 538 461,54 | 13 750 000 |
| Détention Série A totale | 20 % | 24,390244 % |

Waterfalls investisseur / autres :

- A, 15 M€ : 7 M€ / 8 M€ (préférence) ; 40 M€ : 8 M€ / 32 M€ (conversion) ; 100 M€ : 20 M€ / 80 M€ (conversion).
- B, 15 M€ : 9,1875 M€ / 5,8125 M€ (préférence + secondaire ordinaire) ; 40 M€ : 9,96875 M€ / 30,03125 M€ (préférence) ; 100 M€ : 24,390244 M€ / 75,609756 M€ (conversion).

## 2. Ordre d’exécution — tranches verticales RED → GREEN

Un seul agent intégrateur écrira les JSON partagés. Chaque item ci-dessous est une tranche : test minimal, observation du RED attendu, implémentation minimale, test ciblé au vert, tests voisins, puis éventuel refactor.

### Lot 0 — Matrice de preuves avant toute réécriture éditoriale

**Créer :** `docs/parcours/SERIE-A-PREUVES.md`.

- Ouvrir chaque page/PDF exact et relever version, date, géographie, périmètre et page/section.
- Classer chaque proposition : droit applicable, modèle/pratique, donnée empirique, hypothèse, exemple méthodologique ou recommandation à faire valider.
- Point de départ déjà contrôlé : France Invest 2019, pp. 13–28 (dont data room p. 17, cap table pp. 22–25, LOI p. 25, due diligence p. 26, conditions p. 27, closing p. 28), gouvernance pp. 32–45 et modèle de LOI pp. 109–113 ; Galion Term Sheet 2019, pp. PDF 5, 6, 15, 18–19 ; Galion Board 2022, pp. 4, 6, 9, 14. Chaque reprise sera liée à sa proposition exacte et qualifiée comme modèle professionnel daté, non comme norme légale.
- Vérifier sur une source primaire les candidats Code civil 1103, 1112, 1112-2 et Code de commerce L. 227-1, L. 227-5, L. 227-6, L. 227-9, L. 228-11 et suivants, puis les règles d’augmentation de capital effectivement mobilisées. L’audit ayant rencontré un blocage Légifrance, une disposition non ouverte dans sa version en vigueur reste « à valider » et n’est pas publiée comme preuve acquise.
- Écarter toute source qui ne soutient pas la proposition. Aucun texte du produit n’est réécrit avant cette matrice.

**Dépendance :** aucune. Cette matrice précède le lot documentaire 5.

### Lot 1 — Charge, modes et livrable cohérents

**Tests RED d’abord :**

- modifier `client/src/content/serieAParcours.test.ts` pour attendre séparément `readingMinutes=64`, `guidedPracticeMinutes=416`, `caseMinutes=72`, `simulatorMinutes=30`, `finalMinutes=96`, `optionalMinutes=120`, `requiredMinutes=678`, `completeMinutes=798` ;
- y attendre exactement 12 étapes `medium`, 14 étapes `high`, AltoSuite dans les deux modes et les deux bonus uniquement en `high` ;
- y attendre huit composants cœur en `medium`, dix en `high` ;
- étendre `client/src/lib/learningExports.test.ts` pour faire échouer l’export `medium` qui contient encore les deux sections facultatives.

**Implémentation minimale :**

- `client/src/content/learningTime.ts` : catégories disjointes leçons/cas/simulateurs/final et déduplication par étape ;
- `client/src/content/deliverables.ts` : helpers uniques de sélection composants/gabarit par budget ;
- `client/src/content/types.ts`, `client/src/content/parcoursTypes.ts`, `scripts/validate-content.mjs` : métadonnées facultatives de mode, `componentId`, durées simulateur et travail final ;
- `data/parcours.json` : AltoSuite devient une étape `pratique`, charge dérivée 11,3/13,3 h ;
- `data/parcours/05-preparer-sa-serie-a.lessons.json` : durées de pratique restaurées à `42/62/52/52/67/47/62/32` ;
- `data/simulators.json` : 15 minutes par simulateur ;
- `data/deliverables.json` : 90 minutes de travail final, deux composants/sections marqués `high` uniquement ;
- `client/src/lib/learningExports.ts` et `client/src/pages/intelligence/DeliverablePage.tsx` : même filtre pour affichage et export ; accès direct sans budget = huit composants cœur affichés comme requis et deux approfondissements explicitement facultatifs.

**Voisins :** adapter les attentes de forme dans `client/src/content/parcours.test.ts` et `client/src/content/venturePhilanthropyLearning.test.ts` sans changer leurs totaux.

### Lot 2 — Navigation, progression et reprise sur un même sous-ensemble

**Tests RED d’abord :**

- `client/src/lib/learningWorkspace.test.ts` : migration v1→v2 sans perte, achèvement explicite cas/simulateur, limites et persistance ; une simple ouverture ne termine rien ;
- créer `client/src/lib/parcoursProgress.test.ts` : même liste visible pour dénominateur, reprise, précédent et suivant ; une étape `high` ne peut pas devenir la reprise `medium` ;
- créer `client/src/pages/learn/serieAParcours.dom.test.tsx` : retours/suivants depuis AltoSuite, dilution et waterfall, budget conservé, reprise après chacun des simulateurs, accès direct canonique sans contexte ; rejeter `budget=low` pour `p-serie-a` et abandonner proprement le contexte d’une étape bonus masquée en `medium` ;
- compléter `client/src/pages/learn/parcoursContextNavigation.dom.test.tsx` pour le nouveau décompte par étapes.

**Implémentation minimale :**

- `client/src/lib/learningWorkspace.ts` : contrat v2 migré, collection bornée `activities`, clé stable `parcoursId:kind:id`, action explicite d’achèvement ;
- créer `client/src/lib/parcoursProgress.ts` : état d’une étape (leçon, cours, cas, simulateur, livrable) et résumé/reprise ;
- `client/src/content/parcours.ts` : navigation générique d’une étape et validation du couple `parcours`/`budget` contre l’étape visible ;
- `client/src/pages/learn/ParcoursDetailPage.tsx` : pourcentage, statut des cartes et reprise issus du helper commun ;
- `client/src/pages/learn/LessonPage.tsx`, `client/src/pages/cases/CaseStudyPage.tsx`, `client/src/pages/simulators/SimulatorPage.tsx`, `client/src/pages/intelligence/DeliverablePage.tsx`, `client/src/pages/cases/CaseCorrectionPage.tsx` : liens contribution/précédent/suivant/retour/ressources contextualisés et boutons d’achèvement non certificatifs ;
- `client/src/components/cards.tsx`, `client/src/hooks/useResumeLesson.ts` et `client/src/pages/workspace/DashboardPage.tsx` : budget validé propagé et résumé construit avec le même ensemble d’étapes, sans inventer un premier parcours lors d’un accès direct ;
- `client/src/lib/localDataLifecycle.test.ts` : export/import du contrat v2 et migration vérifiés.

**Dépendance :** lot 1, car la visibilité `medium/high` est le référentiel de navigation.

### Lot 3 — Modèle déterministe et tableau AltoSuite dédié

Les simulateurs génériques restent des outils d’intuition ; ils ne seront pas étendus au secondaire, au pool circulaire et aux classes de titres. Leur périmètre et leur dénominateur sont toutefois corrigés. AltoSuite reçoit un tableau dédié, intégré au cas, modifiable et exportable en Markdown.

**Tests RED d’abord :**

- créer `client/src/lib/serieA/altoSuite.test.ts` pour la trésorerie, le burn, les deux runways, les deux cap tables, les pourcentages, le secondaire, les trois waterfalls et les réconciliations à 100 %/au produit de sortie ;
- compléter `client/src/lib/simulators/dilution.test.ts` pour imposer la sémantique « cible post-money hors pool existant » (70 % dans le cas discriminant 20 % investisseur + 10 % pool), et vérifier qu’elle n’est jamais présentée comme un ajout pre-money ;
- dans `client/src/content/serieAParcours.test.ts`, exiger les conventions structurées et l’absence de consigne à solution unique sans hypothèses ;
- dans `client/src/pages/learn/serieAParcours.dom.test.tsx`, exiger le préréglage AltoSuite, les tableaux sémantiques, la modification d’une hypothèse, la remise à zéro et l’export.

**Implémentation minimale :**

- `data/caseStudies.json` : ajouter à `cs-serie-a-alto-sas` un modèle numérique structuré, les conventions ci-dessus, les offres complètement spécifiées et les sorties 15/40/100 M€ ; distinguer cash primaire et secondaire fondateur ; renommer le tableau historique en pont de quatre mois et publier les dates/hypothèses de la projection de closing retardé ;
- `client/src/content/types.ts` et `scripts/validate-content.mjs` : schéma borné du modèle ;
- créer `client/src/lib/serieA/altoSuite.ts` : fonctions pures, sans arrondi interne, avec formatage seulement à l’affichage ;
- créer `client/src/components/serieA/AltoSuiteWorkbench.tsx` : préréglage, champs nécessaires, alertes de réconciliation, tableaux accessibles et export ;
- `client/src/components/simulators/dilution.tsx`, `client/src/components/simulators/waterfall.tsx` et `data/simulators.json` : remplacer « ESOP ajouté/pre-money » par « pool cible post-money hors pool existant » ; qualifier le waterfall comme modèle à une classe préférentielle contre un bloc ordinaire ;
- `client/src/pages/cases/CaseStudyPage.tsx` : intégrer le tableau à l’ancre `#tableau-alto-suite` ;
- `data/deliverables.json` et `DeliverablePage.tsx` : donner au livrable un lien contextualisé vers cet artefact et qualifier honnêtement la portée des simulateurs génériques.

**Dépendance :** lot 2 pour les liens contextualisés ; ce lot précède la correction de référence.

### Lot 4 — Négociation exécutable, correction et complétion fail-closed

**Tests RED d’abord :**

- `client/src/content/serieAParcours.test.ts` : protocole de 60 minutes inclus dans les 62 minutes de pratique (2 minutes d’ouverture/archivage), quatre rôles, informations communes/privées, séquences position initiale→contre-offre→arbitrage→observation→débrief et journal ; correction AltoSuite réellement référencée ; aucun champ `journal` sur ce livrable ;
- `client/src/lib/learningWorkspace.test.ts` : refus de passer à V1 sans référence de fichier externe, à “revu” sans tous les critères notés **et commentés** + mode + note de retour, à “révisé” sans journal ni référence de V2 exportée, et refus de complétion si une preuve manque ;
- `client/src/pages/learn/serieAParcours.dom.test.tsx` : boutons bloqués avec raison accessible, correction révélable seulement après V1, et choix `practitioner` explicitement présenté comme une intention locale et non une validation réelle.

**Implémentation minimale :**

- `data/deliverables.json` : retirer `journal`; ajouter le protocole structuré aux quatre rôles existants ; désigner finance et juridique comme observateurs/signalants sans pouvoir de décision, et rendre leurs critères explicites ;
- `client/src/content/types.ts` et `scripts/validate-content.mjs` : schéma du protocole et correspondance durée/pratique ;
- `client/src/lib/learningWorkspace.ts` : références non sensibles de V1/V2, commentaires de grille, `reviewNote`, fonction pure de readiness, transitions et complétion fail-closed ;
- `client/src/pages/intelligence/DeliverablePage.tsx` : cartes de rôle exportables séparément avec informations communes/privées et avertissement qu’il s’agit d’une séparation opérationnelle, non d’un contrôle d’accès ; champ de retour/autoévaluation, checklist de manques, libellés non certificatifs, correction contextualisée ;
- `data/caseCorrections.json` : ajouter une correction AltoSuite avec calculs réconciliés selon la convention canonique, sensibilité explicite à une convention « réserve seule », alternatives A renégociée/B renégociée/report, erreurs fréquentes et exemples de justification insuffisante/acceptable/solide, sans “bonne décision” universelle ;
- `data/deliverables.json` : renseigner `correctionId` seulement dans le même patch que la ressource existante ;
- `client/src/pages/cases/CaseStudyPage.tsx` et `CaseCorrectionPage.tsx` : ne proposer/charger que cette ressource validée et préserver le contexte.

**Dépendance :** lot 3 pour les résultats numériques et lot 2 pour le contexte.

### Lot 5 — Intégrité documentaire et juridique

**Tests RED d’abord dans `client/src/content/serieAParcours.test.ts` :**

- Galion `Fundraiser Guidelines` interdit hors d’un passage explicite sur le choix/mandat/relation avec un intermédiaire ;
- `State of European Tech` autorisé seulement dans une proposition explicitement macro-européenne ;
- UK Private Capital/NVCA qualifiés de modèles étrangers comparatifs ;
- toute source Légifrance juridique pointe un article précis, jamais le code entier ;
- la SAS distingue président/organes statutaires d’un comité ou “board” contractuel ;
- la term sheet distingue investissement non réalisé/conditions préalables et clauses potentiellement contraignantes (exclusivité, confidentialité, frais, droit/juridiction), ainsi que l’exigence générale de bonne foi pendant les négociations, sans promettre un effet juridique universel ;
- aucun seuil ARR, valorisation, dilution ou runway n’est présenté comme norme universelle.
- les absolus non établis (`échoue souvent`, `rarement`, `jamais ouverte en bloc`, `seul son conseil`, `validation board`) disparaissent ou sont qualifiés ; les « 100 premiers jours » restent un horizon d’exercice.

**Implémentation minimale :**

- réécrire seulement les passages et listes `sources` concernés dans `data/parcours/05-preparer-sa-serie-a.lessons.json` ;
- utiliser France Invest avec pages/sections vérifiées pour LOI, due diligence/data room, pacte, closing et préférences ;
- réserver Galion Fundraiser à l’intermédiaire, Atomico au contexte macro, et qualifier explicitement les modèles UK/NVCA ;
- viser les articles Légifrance effectivement vérifiés ;
- ajouter dans `lsa-termes-gouvernance` une section « Effets de la signature » fondée sur les passages exacts France Invest/Galion et soumise au caveat juridique ; distinguer organe compétent, statuts, pacte/accord contractuel et observateur/censeur ;
- reporter dans `docs/parcours/SERIE-A-PREUVES.md` les propositions non suffisamment soutenues comme hypothèses ou recommandations à faire valider, sans promouvoir artificiellement une source.

**Validation ciblée :** `npm run validate:content:strict` puis test Série A. Toute URL inaccessible ou preuve insuffisante entraîne réduction/requalification de la proposition, jamais invention.

### Lot 6 — Contrastes et qualité DOM

**Test RED d’abord :** créer `scripts/design-contrast.test.mjs`, lire les tokens réels, composer le fond à 12 % sur `--surface`, puis attendre un ratio ≥ 4,5:1 en clair et sombre pour `CŒUR`, `PRATIQUE`, `BONUS`, `RESPIRATION`.

**Implémentation minimale :**

- `client/src/styles/tokens.css` : tokens dédiés, proposés après calcul :
  - cœur `#31527A` / sombre `#A9C8EE` ;
  - pratique `#285A4D` / sombre `#8DCDB9` ;
  - bonus `#654067` / sombre `#C8A4CB` ;
  - respiration `#8B3E2D` / sombre `#F0A18A` ;
- `client/src/pages/learn/ParcoursDetailPage.tsx` : employer ces variables.

Ratios calculés sur le fond réellement mélangé, dans l’ordre cœur/pratique/bonus/respiration : clair `6,380 / 6,388 / 6,816 / 6,009`, sombre `8,721 / 8,618 / 7,347 / 7,732`. Compléter les tests DOM par H1 unique, noms accessibles, absence de débordement des nouveaux contrôles et messages `aria-live` utiles.

## 3. Génération, validation et revue gelée

Après stabilisation de chaque tranche, exécuter sur l’état final gelé, dans cet ordre :

1. tests ciblés Série A (`serieAParcours`, exports, workspace, progression, AltoSuite, DOM, contraste) ;
2. `npm run validate:content:strict` ;
3. `npm run split:content` — seule écriture autorisée dans `data/generated/` ;
4. `npm run check:generated` et inspection des deux artefacts de leçons générés ;
5. `npm run typecheck` ;
6. `npm run lint` ;
7. `npm run test` ;
8. `npm run check` ;
9. `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` ;
10. après le build, `npm run check:generated` ;
11. `git diff --check`.

Sur ce diff figé, relancer en parallèle quatre revues **strictement en lecture seule** : preuves juridiques/documentaires, recalcul AltoSuite, navigation/progression/DOM, pédagogie négociation/livrable. Une correction issue des revues invalide uniquement les preuves touchées : refaire ses tests ciblés, puis les gates larges une seule fois sur le nouvel état gelé.

## 4. Recette de l’artefact construit

Servir `client/dist` sous un répertoire temporaire contenant le segment réel `/vc-plateform/` (lien local vers `dist`) avec `python3 -m http.server`, et non `vite preview`.

Vérifier :

- bureau 1440×1000 ;
- mobile émulé 390×844 avec preuve `window.innerWidth === 390` ;
- thèmes clair et sombre ;
- `scrollWidth <= innerWidth`, un H1 identifiable et une navigation nommée ;
- aucune erreur console pertinente ;
- `medium` puis `high` sur `/vc-plateform/parcours/preparer-ma-serie-a` ;
- transitions autour d’AltoSuite, dilution, waterfall et livrable ;
- conservation de `parcours=p-serie-a&budget=medium|high` ;
- reprise après le cas puis chacun des simulateurs et exclusion des bonus cachés ;
- huit/dix composants selon le mode et export correspondant ;
- blocage de chaque complétion prématurée ; correction et retour au parcours ;
- accès direct sans contexte propre aux pages cas/simulateurs/livrable/correction.

Arrêter le serveur, supprimer le répertoire temporaire et vérifier avec `lsof` qu’aucun processus n’écoute encore sur le port de recette.

## 5. Clôture seulement après toutes les preuves vertes

- Relire le diff ciblé et comparer `git status --short` au baseline brut ; vérifier particulièrement les deux fichiers initialement non suivis et signaler tous les fichiers hors périmètre restés intacts.
- Mettre à jour `Suivis/ETAT.md` avec les durées 678/798 et l’état réellement vérifié.
- Ajouter une entrée factuelle, append-only, à `Suivis/JOURNAL.md` avec uniquement les commandes réellement exécutées et leurs résultats.
- `Correction.md` n’existe pas au baseline ; s’il apparaît comme artefact temporaire, consolider ses constats puis le supprimer.
- Ne pas commit, pousser ou déployer.

Le compte rendu final séparera corrections, conventions, charge, sources remplacées/requalifiées, tests et sorties exactes, recette navigateur, limites, besoin de revue professionnelle et état des fichiers non suivis. Le résultat sera qualifié uniquement selon les critères demandés : cohérent, honnête sur sa charge, calculable, navigable, révisable, sourcé au niveau des propositions et vérifié sur l’artefact construit.
