# Prompts d'implémentation — parcours « Préparer ma Série A »

Issus de l'audit en lecture seule du 26 juillet 2026. Chaque prompt est autonome : il peut être collé tel quel dans une session neuve, sans le contexte de la session d'audit. Ils sont indépendants les uns des autres et peuvent être traités dans n'importe quel ordre, sauf le prompt 5 qui gagne à passer après le prompt 1.

---

## Prompt 1 — Corriger le traitement du secondaire dans la waterfall AltoSuite

```
Dans le cas AltoSuite du parcours Série A, la waterfall traite les actions
acquises en secondaire comme si elles faisaient partie du bloc préférentiel.
Corrige ce défaut de modélisation.

Constat
`client/src/lib/serieA/altosuite.ts`, fonction `calculateSerieAOffer`, transmet
`totalNewInvestorOwnershipPct` — primaire + secondaire, soit 24,39 % pour
l'Offre B — à `calculateWaterfall` (`client/src/lib/simulators/waterfall.ts`),
dont la signature suppose un bloc préférentiel unique dont la préférence porte
sur `primaryInvestmentM`, soit 9 M€.

Or la convention du scénario, dans `data/caseStudies.json` sous
`cs-serie-a-alto-sas` > `numericScenario.conventions`, dit que le secondaire
transfère des actions de fondateurs : ce sont des actions ordinaires. Les
335 365,85 actions concernées sont donc comptées dans le pourcentage qui décide
de la conversion, mais ne reçoivent rien quand l'investisseur exerce sa
préférence.

Chiffres de référence de l'Offre B, à retrouver par le calcul et non à recopier
en dur : preRoundShares 10 731 707,32 ; postShares 13 750 000 ;
primaryInvestorShares 3 018 292,68 soit 21,9512 % ; secondaryShares 335 365,85 ;
ordinaires totales 10 731 707,32 dont l'investisseur détient 3,125 %.

Résultat attendu, Offre B, préférence 1x non-participating :
- sortie 30 M€ : investisseur 9,6562 M€ / ordinaires 20,3438 M€
  (le préférentiel seul convertirait à 6,5854 M€, inférieur à la préférence de
  9 M€ : il prend la préférence, puis les 335 365,85 actions ordinaires de
  l'investisseur partagent le résidu de 21 M€ à hauteur de 3,125 %)
- sortie 60 M€ : investisseur 14,6341 M€ / ordinaires 45,3659 M€ (inchangé)
- sortie 120 M€ : investisseur 29,2683 M€ / ordinaires 90,7317 M€ (inchangé)

L'Offre A n'a pas de secondaire : ses trois scénarios doivent rester
strictement identiques à l'existant. Vérifie-le explicitement.

Contraintes
- `calculateWaterfall` est partagée avec le simulateur public
  (`client/src/components/simulators/waterfall.tsx`) et possède son propre test
  (`client/src/lib/simulators/waterfall.test.ts`). Ne casse pas son contrat :
  soit tu ajoutes un paramètre optionnel dont la valeur par défaut reproduit le
  comportement actuel, soit tu écris une fonction dédiée dans `altosuite.ts`.
  Justifie le choix retenu.
- `investorMultiple` divise par `investment`, soit 9 M€, alors que
  l'investisseur de l'Offre B a déboursé 10 M€ (9 primaire + 1 secondaire).
  Cette valeur n'est aujourd'hui affichée nulle part. Signale le point et
  propose un traitement, ne le corrige pas silencieusement.
- Les valeurs de waterfall ne sont actuellement consommées par aucune vue :
  `CaseStudyPage.tsx` n'utilise que `buildSerieAOfferExportRows`, qui ne les
  contient pas. Dis-moi si tu recommandes de les exposer dans le tableau
  exportable, sans le faire dans le même lot.

Méthode
Commence par un test RED dans `client/src/lib/serieA/altosuite.test.ts` qui
fige les trois valeurs de l'Offre B ci-dessus — le fichier actuel ne vérifie
qu'`exitValueM`, jamais un montant, ce qui explique que le défaut passe au
vert. Puis la plus petite implémentation qui le fait passer. Puis la
non-régression sur l'Offre A.

Vérification
npm run test --workspace client -- src/lib/serieA/altosuite.test.ts
npm run test --workspace client -- src/lib/simulators/waterfall.test.ts
npm run check
```

---

## Prompt 2 — Compléter la grille d'évaluation du livrable Série A

```
Le livrable `todo-attentes-serie-a` a dix composants et sept critères de
grille : trois composants ne sont évaluables par aucun critère.

Constat
Dans `data/deliverables.json`, le livrable `todo-attentes-serie-a` (autour de
la ligne 1718) déclare dix `components` : decision, preuves, financement,
process, transaction, clauses, negociation, closing, branche-sectorielle,
tour-complexe. Sa `rubric` ne compte que sept critères : decision-financement,
tracabilite-preuves, coherence-financiere, integrite-cap-table, lecture-termes,
qualite-negociation, revision.

En appariant composants et critères, `process`, `branche-sectorielle` et
`tour-complexe` ne sont couverts par aucun critère. Le cas de `process` est le
plus gênant : il est requis en budget `medium` ET `high`, et le jalon du
parcours (`data/parcours.json`, `p-serie-a`, `milestone.rubricId`) est évalué
en auto, pair et praticien. Un relecteur doit donc juger une section
« Processus et data room » sans critère, sans preuve attendue, sans erreur
fréquente et sans question de révision.

Travail attendu
Ajoute les critères manquants en respectant exactement la forme des sept
existants : `id`, `criterion`, `description`, `expectedEvidence`,
`commonError`, `revisionQuestion`. Au minimum un critère pour `process`.
Décide et justifie si `branche-sectorielle` et `tour-complexe`, réservés au
budget `high`, méritent leurs propres critères ou si un critère transverse
« approfondissements » suffit.

Le registre du parcours est borné par `docs/parcours/SERIE-A-PREUVES.md` :
la section §4 pour le processus et la data room, la §9 pour l'adaptation
sectorielle, la §10 pour les tours complexes. Les critères ne doivent
introduire aucune proposition que cette matrice ne couvre pas, ni aucun seuil
présenté comme universel.

Contraintes
- `client/src/content/serieAParcours.test.ts` vérifie l'ordre des `components`
  et des `rubricLevels`, pas la longueur de la `rubric`. Contrôle-le avant de
  patcher plutôt que de me croire sur parole.
- Vérifie où la grille est rendue (page livrable) et si l'ajout de critères
  déborde visuellement.

Vérification
npm run validate:content
npm run test --workspace client -- src/content/serieAParcours.test.ts
npm run check
```

---

## Prompt 3 — Recalculer readMin et rééquilibrer le temps de pratique

```
Les dix leçons du parcours Série A portent toutes `readMin: 8`, valeur par
défaut plutôt que mesure. Recalcule-les et rééquilibre un temps de pratique
incohérent.

Constat
Dans `data/parcours/05-preparer-sa-serie-a.lessons.json`, les dix leçons `lsa-*`
ont `readMin: 8`. Ailleurs dans le catalogue (`data/lessons.json`) la valeur
varie de 4 à 14 selon la longueur réelle du corps. Dix leçons tombant
exactement sur la même valeur signale un remplissage.

Cette valeur se propage : `data/courses.json`, cours `c-serie-a-preparation`,
porte `durationMin: 80` avec `durationSource: "lesson-read-minutes"`, et
`client/src/content/learningTime.ts` en dérive le temps de lecture affiché sur
la carte du parcours — huit leçons cœur × 8 = 64 minutes, soit environ 1 h 04
de lecture annoncée contre une dizaine d'heures de production.

Second point : `lsa-closing-board` porte `practice.estimatedMinutes: 32`,
contre 42 à 67 pour les autres leçons, alors que sa section du livrable est
l'une des plus lourdes — checklist de closing, ordre du jour du premier board,
indicateurs sur 100 jours et journal de révision, ce dernier conditionnant la
clôture fail-closed du livrable.

Travail attendu
1. Détermine la convention de `readMin` réellement appliquée dans le dépôt.
   `docs/ARCHITECTURE_EDITION.md` en parle autour de la ligne 246 ; calibre en
   comparant plusieurs leçons de `data/lessons.json` avec leur `readMin`.
   Énonce la règle retenue avant de l'appliquer.
2. Recalcule `readMin` pour les dix leçons `lsa-*` selon cette règle.
3. Mets à jour `durationMin` du cours pour qu'il égale la nouvelle somme.
4. Propose une valeur argumentée pour `practice.estimatedMinutes` de
   `lsa-closing-board`, en la comparant au nombre et au poids des exigences de
   son composant dans `data/deliverables.json`.

Contrainte bloquante
`client/src/content/serieAParcours.test.ts` fige aujourd'hui les deux valeurs :
`durationMin: 80` à la ligne 122, et `readMin: 8` dans le `toMatchObject`
appliqué aux dix leçons à la ligne 136. Le test devra donc changer. Décide s'il
doit continuer à figer des valeurs exactes ou vérifier un intervalle
plausible, et justifie — figer dix valeurs distinctes rendra le test fragile à
chaque retouche éditoriale.

Vérification
npm run split:content
npm run validate:content:strict
npm run check
```

---

## Prompt 4 — Rendre la réciprocité des simulateurs du parcours Série A

```
Les deux simulateurs utilisés comme étapes du parcours Série A ne renvoient pas
vers ses leçons.

Constat
`data/parcours.json`, parcours `p-serie-a`, utilise le simulateur `dilution` à
l'étape 7 et `waterfall` à l'étape 8, entre `lsa-modeliser-transaction`
(étape 6) et `lsa-termes-gouvernance` (étape 9).

Dans `data/simulators.json`, les `relatedLessonIds` de ces deux simulateurs
pointent vers `l-founder-instruments`, `l-stages` et `l-ts-economics`, des
leçons de niveau seed. Un apprenant avancé arrivant de
`lsa-modeliser-transaction` est donc renvoyé aux bases. Le lien est à sens
unique.

Travail attendu
Ajoute les leçons Série A pertinentes aux `relatedLessonIds` des deux
simulateurs, sans retirer les leçons existantes qui restent valables pour les
autres parcours. `lsa-modeliser-transaction` est le candidat évident pour les
deux ; évalue si `lsa-tour-complexe` a sa place sur `waterfall`.

Avant de patcher, vérifie dans `scripts/validate-content.mjs` si
`relatedLessonIds` fait l'objet d'un contrôle de référence croisée, et si une
réciprocité est attendue dans l'autre sens. Vérifie aussi comment la page
simulateur rend ces liens : au-delà de trois ou quatre entrées, la liste peut
cesser d'orienter.

Vérification
npm run validate:content
npm run check
```

---

## Prompt 5 — Exposer la ligne seed dans le contrat numérique AltoSuite

```
Le scénario chiffré du cas AltoSuite ne porte pas la ligne des investisseurs
seed, alors que le document cap table la nomme. Le tableau exportable ne peut
donc pas montrer une cap table complète.

Constat
Dans `data/caseStudies.json`, le cas `cs-serie-a-alto-sas` contient un document
`cap-table` qui détaille cinq lignes se réconciliant à 10 000 000 actions et
100 % : fondateurs 5 500 000, pool attribué 700 000, pool non attribué 500 000,
investisseurs seed 2 400 000, instruments convertibles 900 000.

Mais l'objet `numericScenario` du même cas ne porte que
`fullyDilutedSharesBefore`, `founderSharesBefore`, `currentOptionPoolShares` et
`convertibleShareEquivalents`. Les 2 400 000 actions seed n'y figurent pas, si
bien que `buildSerieAOfferExportRows` et `buildSerieAOfferMarkdownTable` dans
`client/src/lib/serieA/altosuite.ts` ne peuvent produire qu'une vue partielle :
pool, investisseur Série A et fondateurs, sans la ligne seed ni un total
vérifiable.

Or la leçon `lsa-modeliser-transaction` demande précisément de « contrôler que
les pourcentages totalisent 100 % », et son quiz 3 porte sur la réconciliation
de la cap table. L'outil fourni ne permet pas de faire ce que la leçon exige.

Travail attendu
1. Ajoute `seedInvestorShares` au `numericScenario` du cas, avec la valeur
   cohérente avec le document cap table.
2. Propage le champ dans le type `CaseStudyNumericScenario`
   (`client/src/content/types.ts`) et dans la validation de
   `scripts/validate-content.mjs`.
3. Renforce `assertScenario` dans `altosuite.ts` : les composantes nommées
   doivent se sommer exactement à `fullyDilutedSharesBefore`, sinon le scénario
   est invalide. C'est l'invariant que la leçon enseigne ; il doit être tenu par
   le code.
4. Étends le tableau exportable pour montrer une cap table avant et après tour
   ligne par ligne, avec un total contrôlable.

Contrainte
Le champ doit rester optionnel dans le type si d'autres cas utilisent
`numericScenario` sans ligne seed. Vérifie l'inventaire des cas concernés avant
de décider entre champ requis et champ optionnel.

Méthode
Test RED d'abord dans `client/src/lib/serieA/altosuite.test.ts` : la somme des
composantes doit égaler `fullyDilutedSharesBefore`, et le markdown exporté doit
contenir la ligne seed.

Vérification
npm run test --workspace client -- src/lib/serieA/altosuite.test.ts
npm run validate:content:strict
npm run check
```

---

## Prompt 6 — Deux résidus éditoriaux du parcours Série A

```
Corrige deux formulations résiduelles dans les leçons du parcours Série A,
relevées contre `docs/parcours/SERIE-A-PREUVES.md`.

Résidu 1 — un absolu non étayé
Dans `data/parcours/05-preparer-sa-serie-a.lessons.json`, leçon
`lsa-process-dataroom`, l'explication du deuxième quiz se termine par
« qu'une ouverture en bloc rend au contraire impossible à suivre ».

Le gate éditorial de la matrice interdit les absolus sur l'ouverture en bloc :
la §4 impose d'employer « peut » et proscrit « n'est jamais ouverte en bloc ».
La formulation actuelle échappe à la regex du test
(`client/src/content/serieAParcours.test.ts`, ligne 247, qui ne capture que
`n'est pas ouverte en bloc`) mais viole la règle. Remplace « impossible » par
une formulation graduée, du type « rend plus difficile à suivre ».

Résidu 2 — un quiz désaligné de son corps
Toujours dans le même fichier, leçon `lsa-decision-lever`, le corps affirme
désormais « Le premier livrable de ce parcours est donc une note de décision »,
conformément à la matrice §1 qui impose d'écrire « premier livrable de ce
parcours » et non « premier objet d'une Série A ».

Mais le premier quiz de la même leçon demande encore « Quel est le premier
objet à produire avant de bâtir la data room ? » et son explication répond de
façon générale, sans rattacher la note de décision au parcours. Aligne
l'intitulé et l'explication sur la formulation du corps, sans toucher aux trois
options ni changer la réponse correcte.

Contrainte
Ces deux corrections sont purement rédactionnelles. Ne modifie ni les sources
citées, ni les `keyTakeaways`, ni la structure des quiz. Le test exige trois
questions par leçon et au moins deux lignes de référence par corps : vérifie
que les deux invariants tiennent après patch.

Vérification
npm run split:content
npm run validate:content:strict
npm run check
```

---

## Ordre suggéré

Le prompt 6 est le plus court et sans risque, bon pour vérifier que la chaîne
split → validate → check tourne. Le prompt 1 est celui à plus fort rendement
pédagogique et demande le plus d'attention. Le prompt 5 gagne à passer après le
1, les deux touchant `altosuite.ts` et son test.

Les prompts 2, 3 et 4 sont indépendants. Le 3 est le seul à imposer une
modification de test existant, donc une décision de méthode à trancher avant
de patcher.
