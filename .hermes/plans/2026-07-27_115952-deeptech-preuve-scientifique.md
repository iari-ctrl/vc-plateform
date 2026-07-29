# Lot 1 Deeptech — recette TRL/PI et cours « Preuve scientifique » — Plan d’implémentation

> **Pour Hermes :** exécuter ce plan tâche par tâche dans une nouvelle session. Appliquer RED → GREEN → REFACTOR pour le nouveau contrat éditorial. Ne produire aucun commit, staging, push, déploiement ni opération distante. Ne jamais prendre l’état Git comme critère de fin.

**Objectif :** fermer la recette navigateur de `l-specialty-deeptech-trl-ip`, puis créer localement le cours `c-dt-preuve-scientifique` et ses deux leçons publiées `ldt-reproductibilite` et `ldt-pilote-preuve`, avec sources lues, glossaire cohérent, routes publiques, gardes de comptage et recettes bureau/mobile.

**Architecture :** `l-specialty-deeptech-trl-ip` reste la leçon optionnelle publiée de `c-analyst-specialties`. Le nouveau cours est autonome dans la Bibliothèque ; ses deux leçons ont leur `courseId` propre et prennent la leçon TRL/PI comme point d’entrée pédagogique sans déplacement ni duplication. Aucun parcours, dossier apprenant, cas, livrable, certification ou axe n’est créé dans cette passe. Les leçons sont publiées localement afin d’exercer les routes ; la relecture praticienne reste un préalable à toute publication externe, laquelle est hors périmètre.

**Stack :** données JSON canoniques (`data/*.json`), React/Vite, Vitest, validateurs Node, génération canonique par le build, prévisualisation de `client/dist` sous `/vc-plateform/`.

---

## 1. Autorités, périmètre et décisions gelées

### À relire avant toute édition

1. `CLAUDE.md` en entier.
2. `Suivis/ETAT.md`, passe du `2026-07-27`.
3. L’entrée `2026-07-27 — Première leçon deeptech publiée : TRL et propriété intellectuelle` de `Suivis/JOURNAL.md`.
4. Le présent plan.
5. Pour les seuls contrats édités :
   - `docs/ARCHITECTURE_EDITION.md`, sections cours, leçons, glossaire, génération et routes ;
   - `client/src/content/venturePhilanthropyLearning.test.ts` comme précédent de cours à durée dérivée ;
   - `client/src/content/serieAParcours.test.ts:74-78` pour la formule de `readMin` ;
   - `scripts/validate-content.mjs` pour les schémas effectifs.

### Décisions à ne pas rouvrir

- `l-specialty-deeptech-trl-ip` reste dans `c-analyst-specialties`, avec `optional: true`, `status: "published"`, `assessmentId: "analyst-specialty-deeptech"` et `readMin: 9`.
- Le futur parcours Deeptech pourra référencer directement une leçon ; aucune leçon de spécialité n’est déplacée ou dupliquée.
- Le cours enseigne un régime de preuve pour instruire un dossier et commander une expertise. Il ne prétend ni dresser un état de l’art sectoriel ni autoriser l’Analyst à juger la science.
- Les deux nouvelles leçons sont écrites sans `practice` et sans renvoi anticipé au futur dossier `cs-dt-*`. Le rattachement au dossier interviendra dans une passe ultérieure.
- `durationSource: "lesson-read-minutes"` est obligatoire sur `c-dt-preuve-scientifique` ; `durationMin` est la somme exacte des deux `readMin`.
- Les deux leçons sont `level: "avance"`, `optional: false` et `status: "published"` dans le dépôt local.
- Aucun changement à `data/certifications.json` ni à `client/src/content/certifications.test.ts` : les deux `ldt-*` ne rejoignent pas les 28 leçons de l’axe Deeptech.
- Aucun fichier de `data/generated/`, `client/public/sitemap.xml` ou `client/public/robots.txt` n’est édité à la main. Le build les régénère.
- Aucun commit, push, workflow Pages ou déploiement.

### Noms et routes retenus

| Objet | ID | Slug / route |
| --- | --- | --- |
| Cours | `c-dt-preuve-scientifique` | `preuve-scientifique-deeptech` → `/courses/preuve-scientifique-deeptech` |
| Leçon 1 | `ldt-reproductibilite` | `reproductibilite-robustesse-deeptech` → `/lessons/reproductibilite-robustesse-deeptech` |
| Leçon 2 | `ldt-pilote-preuve` | `pilote-preuve-changement-echelle` → `/lessons/pilote-preuve-changement-echelle` |

Titres de travail :

- cours : **Instruire la preuve scientifique** ;
- leçon 1 : **Reproductibilité, incertitude et robustesse** ;
- leçon 2 : **Du banc au pilote : ce que le changement d’échelle prouve**.

Les formulations peuvent être resserrées après lecture des sources ; les IDs et slugs restent stables.

### Delta attendu avant exécution

| Inventaire | État initial | Delta attendu |
| --- | ---: | ---: |
| Cours | 28 | +1 |
| Leçons canoniques | 139 | +2 → 141 |
| Corps publiés | 112 | +2 → 114 |
| Termes de glossaire | 405 | +N, où N est le lot effectivement sourcé (cible bornée : 5 à 7) |
| Routes publiques du sitemap | 672 | +3 → 675 |
| Artefacts du prérendu strict | 684 | +3 → 687 |
| Leçons de l’axe de certification Deeptech | 28 | aucun changement |

Ces deltas sont des hypothèses de contrôle, pas des valeurs à forcer. En cas d’écart, rechercher la route ou l’entrée manquante ; ne pas adapter un garde à une valeur inexpliquée.

---

## 2. Modèle, effort et parallélisation

### Recommandation

- **Session principale : GPT-5.5, effort xhigh.** La difficulté est éditoriale, juridique au sens de la précision des sources, et intégrative ; elle ne justifie pas GPT-5.6/max par défaut.
- **Travailleurs de recherche en lecture seule : GPT-5.5, effort high** si le lanceur permet un choix par travailleur. Sinon conserver le modèle de la session.
- Réserver **GPT-5.6 ou max** uniquement à un conflit de sources non résolu, un défaut navigateur structurel, ou un échec d’intégration persistant après une première analyse causale.

### Ce qui peut être parallèle

Après la recette initiale :

1. une recherche en lecture seule « reproductibilité / métrologie » ;
2. une recherche en lecture seule « pilote / changement d’échelle ».

Les deux livrent une matrice de propositions, pages et limites. Le rédacteur principal récupère et lit lui-même chaque URL finalement citée avant toute rédaction.

Après l’implémentation, deux contre-revues peuvent être menées en parallèle :

1. intégrité des sources et portée des formulations ;
2. cohérence cours/leçons/glossaire/tests/routes.

### Ce qui doit rester séquentiel

- toute édition de `data/courses.json`, `data/lessons.json`, des deux glossaires et des gardes ;
- toute utilisation du navigateur partagé ;
- la régénération par build ;
- les mises à jour de `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Un seul intégrateur écrit les JSON partagés. Aucun travailleur ne modifie le sitemap ni `data/generated/`.

---

## 3. Tâche 1 — Fermer d’abord la recette de `l-specialty-deeptech-trl-ip`

### Prérequis

Servir l’artefact existant, et non le serveur de développement. L’utilisateur lance depuis la racine :

```bash
VITE_BASE_URL=/vc-plateform/ npm run preview --workspace client -- --host 127.0.0.1 --port 4174
```

Hermes ne lance pas `npm` dans son shell : il demande la commande, attend l’URL prête, puis conduit lui-même la recette. Chromium reste sérialisé.

### Vues à contrôler

#### Bibliothèque

Route :

```text
http://127.0.0.1:4174/vc-plateform/bibliotheque?type=lesson&q=TRL
```

À **1440 × 1000**, puis **390 × 844** :

- la leçon « Deeptech — TRL, reproductibilité et propriété intellectuelle » est présente malgré `optional: true` ;
- la carte affiche le cours de spécialisation, le niveau avancé et 9 minutes ;
- elle ne porte aucun état « À venir » ;
- son lien mène à `/vc-plateform/lessons/deeptech-trl-propriete-intellectuelle` ;
- aucun débordement horizontal (`scrollWidth === clientWidth`).

#### Cours de spécialisation

Route :

```text
http://127.0.0.1:4174/vc-plateform/courses/specialisations-sectorielles-analyst
```

Aux deux viewports :

- la leçon est listée au bon rang, cliquable, à 9 minutes et sans état « À venir » ;
- la coquille `l-specialty-deeptech-industrialization` reste distincte et « À venir » ;
- le cours conserve 17 minutes ;
- le layout ne déborde pas.

#### Page de leçon

Route directe :

```text
http://127.0.0.1:4174/vc-plateform/lessons/deeptech-trl-propriete-intellectuelle
```

Contrôler titre, progression, corps, marqueurs de glossaire, références, quiz, navigation retour, métadonnées et absence d’erreur d’exécution. La console ne doit contenir aucune erreur JavaScript nouvelle ; les ressources de la page doivent répondre sans échec. Les captures éventuelles vont dans `/tmp`, jamais dans le dépôt.

### Gate de séquence

- **Si la recette passe :** consigner les observations dans les notes de session et poursuivre.
- **Si elle échoue :** suspendre la production des deux nouvelles leçons, reproduire le défaut avec une vérification ciblée, identifier la cause, corriger par RED → GREEN, puis reprendre la recette. Ne pas masquer un défaut par une modification de données non liée.

---

## 4. Tâche 2 — Construire la matrice de preuves avant le test et la prose

### Sources candidates déjà identifiées

Leur présence dans ce plan n’autorise pas encore une citation. La session d’exécution doit ouvrir le document complet, lire les passages pertinents, relever pages/sections, date/version et limite de portée.

| Source officielle | URL à récupérer | Usage envisagé | Limite à conserver |
| --- | --- | --- | --- |
| JCGM 200:2012, Vocabulaire international de métrologie | `https://doi.org/10.59161/JCGM200-2012` | conditions de répétabilité/reproductibilité, précision et vocabulaire de mesure | terminologie métrologique ; ne pas la confondre avec la convention NASEM |
| JCGM 100:2008(F), GUM | `https://doi.org/10.59161/JCGM100-2008F` | incertitude de mesure et expression d’un résultat | ne fournit pas une doctrine générale de validité scientifique |
| NASEM, *Reproducibility and Replicability in Science* | `https://nap.nationalacademies.org/catalog/25303/reproducibility-and-replicability-in-science` | distinction entre réexécution avec mêmes données/code et nouvelle étude/données ; transparence | vocabulaire anglophone propre au rapport ; expliciter l’écart avec la métrologie |
| Commission européenne, annexe G H2020 des TRL | `https://ec.europa.eu/research/participants/data/ref/h2020/other/wp/2018-2020/annexes/h2020-wp1820-annex-g-trl_en.pdf` | laboratoire, environnement pertinent/opérationnel et démonstration de système | réutiliser uniquement les définitions lues ; ne pas transformer un TRL en score universel |
| RAND R-2569-DOE, Merrow, Phillips & Myers, 1981 | `https://www.rand.org/pubs/reports/R2569.html` puis son PDF officiel | coût et performance de premières unités de procédé ; prudence sur les extrapolations | étude de 44 installations de procédés dans l’énergie/chimie/mines ; ne pas généraliser à toute la Deeptech |

### Matrice à remplir dans les notes de la session

Pour chaque proposition factuelle conservée :

| ID | Proposition précise | Source primaire | Page/section | Formulation autorisée | Limite / population | Destination |
| --- | --- | --- | --- | --- | --- | --- |
| R-* | leçon 1 | URL | page | paraphrase contrôlée | réserve | section / quiz / glossaire |
| P-* | leçon 2 | URL | page | paraphrase contrôlée | réserve | section / quiz / glossaire |

Règles :

- aucune citation issue d’un extrait de moteur de recherche, d’un résumé secondaire ou d’une mémoire de modèle ;
- si le PDF ou la page ne peut pas être récupéré et lu, la proposition est supprimée ou une source officielle accessible est trouvée ;
- les formulations méthodologiques propres au cours sont annoncées comme « grille de travail proposée » et ne sont pas présentées comme des résultats de recherche ;
- la divergence NASEM/JCGM sur les mots « reproductibilité », « réplicabilité » et « répétabilité » doit être enseignée, pas aplatie ;
- les résultats RAND restent attribués à leur échantillon historique et sectoriel ; aucun taux ou ordre de grandeur n’est repris sans lecture de la table ou du passage correspondant.

**Gate :** aucune modification de `data/lessons.json` tant que la matrice ne couvre pas les affirmations principales, les définitions du glossaire et les réponses correctes des quiz.

---

## 5. Tâche 3 — Arbitrer le glossaire avant la rédaction finale, sans encore l’éditer

**Fichiers à inspecter seulement à ce stade :**

- `data/sources/canonical-glossary.json` ;
- `data/glossary.json` ;
- ne pas modifier `data/generated/glossary.json`.

Cette tâche fige les slugs, définitions, alias et sources que le test RED devra exiger. Les deux registres ne sont modifiés qu’en GREEN, après observation de l’échec attendu du test dédié.

### Collision existante à traiter

`proof-of-concept` possède aujourd’hui l’alias nu `pilote`, alors que sa définition assimile largement PoC et pilote. Cela contredit la leçon prévue, qui doit justement distinguer la preuve de concept d’une installation pilote et de la première unité.

Décision d’implémentation :

1. retirer l’alias nu `pilote` de `proof-of-concept` dans les deux registres ;
2. resserrer sa définition si la matrice de preuves l’exige, sans lui attribuer ce que les sources ne démontrent pas ;
3. créer un terme précis de type `pilote-industriel` avec des alias composés (`installation pilote`, `pilot plant`, éventuellement `démonstrateur pilote`) ;
4. ne pas attribuer l’alias nu `pilote` au nouveau terme : il est trop polysémique. Dans la leçon, utiliser un marqueur explicite tel que `[[pilote-industriel|pilote industriel]]`.

`scalability` décrit aujourd’hui la croissance du modèle économique. Il ne doit pas servir à baliser le changement d’échelle physique d’un procédé. Créer un terme distinct de type `changement-echelle-industriel` si ce concept est retenu par la matrice.

### Lot candidat, à confirmer par les sources

Cible bornée : **5 à 7 nouveaux termes**, pas les ~15 termes du chantier complet. Les candidats sont :

- répétabilité de mesure ;
- reproductibilité de mesure ;
- réplicabilité scientifique, si la convention NASEM est effectivement employée ;
- incertitude de mesure ;
- robustesse expérimentale, seulement si une définition suffisamment étayée est disponible ;
- pilote industriel ;
- changement d’échelle industriel.

Chaque entrée retenue doit :

- être identique sur les champs publiés dans les deux registres ;
- avoir un slug unique, des alias non conflictuels, une catégorie existante, `seeAlso` résolvable et `relatedLessonIds` vers les nouvelles leçons ;
- porter une définition, un exemple et une limite utiles à l’instruction d’un dossier, sans devenir une mini-leçon sectorielle ;
- porter dans le registre canonique `status: "applied"`, `action: "add"`, `sourceStatus: "source-backed"`, des `sourcePaths` contenant les URL officielles réellement lues, des modules Deeptech explicites et une note datée qui borne la portée ;
- être utilisée réellement par au moins un marqueur de leçon ;
- supprimer tout candidat qui ne dispose pas d’une source ou d’un usage pédagogique suffisant.

**Gate :** fixer N et recalculer le garde `glossaryTerms` seulement après cet arbitrage. Ne pas forcer N à 5 ou 7 pour atteindre un compteur.

---

## 6. Tâche 4 — RED : écrire le contrat éditorial avant les données

**Créer :** `client/src/content/deeptechEvidenceLearning.test.ts`

Le test importe directement `data/courses.json`, `data/lessons.json`, `data/glossary.json` et `data/sources/canonical-glossary.json`, afin que le cycle RED/GREEN ne dépende pas encore de `data/generated/`. L’ensemble cours + leçons + termes constitue un seul tracer vertical : commencer par un test d’intégration cohérent, pas par une pile de tests indépendants sans exécution intermédiaire.

### Contrats à couvrir

1. Le cours existe avec :
   - ID et slug gelés ;
   - `level: "avance"` ;
   - `durationSource: "lesson-read-minutes"` ;
   - `lessonIds` exactement `['ldt-reproductibilite', 'ldt-pilote-preuve']` ;
   - `durationMin` égal à la somme des deux `readMin`.
2. Les deux leçons sont publiées, non optionnelles, rattachées au cours et ordonnées 1 puis 2.
3. Chaînage exact :
   - `ldt-reproductibilite.prerequisites = ['l-specialty-deeptech-trl-ip']` ;
   - `ldt-pilote-preuve.prerequisites = ['ldt-reproductibilite']`.
4. Les deux leçons n’ont ni `practice` ni renvoi à un objet `cs-dt-*` inexistant.
5. `readMin` est calculé par `Math.ceil(nombreDeMots / 180)` avec la même expression Unicode que `serieAParcours.test.ts`.
6. Chaque leçon contient une section `## Références`, les URL finales de sa matrice et une formulation explicite de la limite de l’Analyst : instruire et commander une expertise, non statuer sur la validité scientifique.
7. Les marqueurs de glossaire attendus utilisent les slugs effectivement retenus à la tâche 3.
8. Chaque slug retenu existe dans les deux registres avec les champs publiés alignés, et l’alias nu `pilote` n’appartient plus à `proof-of-concept`.

Ne tester ni des phrases longues au caractère près ni l’ordre interne de chaque paragraphe. Le test doit protéger les invariants pédagogiques et les sources, pas figer la prose. Une fois ce tracer vert, il peut être séparé en plusieurs `it` pendant REFACTOR sans changer le comportement couvert.

### Vérifier RED

L’utilisateur lance et colle la sortie :

```bash
npm run test --workspace client -- src/content/deeptechEvidenceLearning.test.ts
```

Résultat attendu : échec propre parce que le cours et les deux leçons n’existent pas. Une erreur de syntaxe, d’import ou de fixture n’est pas un RED valable.

---

## 7. Tâche 5 — GREEN : créer le cours, les deux leçons et leurs termes

### `data/sources/canonical-glossary.json` et `data/glossary.json`

Appliquer dans la même passe l’arbitrage figé à la tâche 3 :

- retirer l’alias nu `pilote` de `proof-of-concept` dans les deux registres ;
- ajouter uniquement les N termes retenus et sourcés, avec des champs publiés identiques ;
- relier les termes aux nouvelles leçons et vérifier tous les `seeAlso` ;
- ne jamais modifier `data/generated/glossary.json` à la main.

Cette modification minimale doit rendre résolvables les marqueurs exigés par le test RED ; ne pas ajouter le reste du futur glossaire Deeptech.

### `data/courses.json`

Ajouter `c-dt-preuve-scientifique` à proximité de `c-analyst-specialties`, avec :

- titre « Instruire la preuve scientifique » ;
- sous-titre centré sur résultats, reproductibilité, incertitude et passage au pilote ;
- quatre objectifs observables au maximum ;
- niveau avancé ;
- durée dérivée des lectures ;
- les deux `lessonIds` dans l’ordre ;
- des tags sobres (`deeptech`, `preuve scientifique`, `diligence technique`, `pilote`).

Ne modifier ni la durée ni les `lessonIds` de `c-analyst-specialties`.

### `data/lessons.json` — `ldt-reproductibilite`

Contrat :

- `courseId: "c-dt-preuve-scientifique"`, `order: 1`, `level: "avance"`, `status: "published"`, `optional: false` ;
- prérequis : `l-specialty-deeptech-trl-ip` ;
- aucun `assessmentId`, aucun `practice`, aucun dossier apprenant ;
- 3 à 4 objectifs, 4 messages clés et 3 questions de quiz au maximum.

Périmètre du corps :

1. situation d’instruction d’un dossier ;
2. avertissement terminologique NASEM/JCGM ;
3. ce qu’établit un résultat isolé ;
4. artefacts à demander pour répétabilité, reproductibilité/réplication et robustesse ;
5. dispersion, incertitude et conditions de mesure ;
6. sélection des séries, écarts documentés et traçabilité ;
7. questions à transmettre à un expert et limite de l’Analyst ;
8. grille de décision proposée ;
9. références proches des propositions concernées, puis section finale `## Références`.

Ne pas transformer la leçon en cours de statistiques ni établir de seuil universel.

### `data/lessons.json` — `ldt-pilote-preuve`

Contrat :

- même cours, `order: 2`, niveau avancé, publié, non optionnel ;
- prérequis : `ldt-reproductibilite` ;
- aucun `assessmentId`, aucun `practice`, aucun dossier apprenant ;
- 3 à 4 objectifs, 4 messages clés et 3 questions de quiz au maximum.

Périmètre du corps :

1. distinguer banc, prototype, environnement pertinent, pilote et première unité sans inventer une nomenclature universelle ;
2. inventorier ce qui change : échelle, intrants réels, environnement, durée, opérateurs, intégration et instrumentation ;
3. formuler l’hypothèse de changement d’échelle et les critères d’acceptation avant l’essai ;
4. exiger données brutes, écarts, incidents et conditions opératoires, pas seulement une démonstration réussie ;
5. dire ce qu’un pilote ne démontre pas : déploiement complet, fiabilité de long terme, économie unitaire, marché, conformité ou liberté d’exploitation, sauf preuve distincte ;
6. traduire le risque résiduel en jalon, condition suspensive ou commande d’expertise ;
7. encadrer strictement l’usage de RAND à son échantillon de procédés pionniers ;
8. références proches des propositions, puis section finale `## Références`.

### Règles communes de rédaction

- style direct, professionnel et institutionnel ; aucune tonalité marketing, slogan ou dramatisation ;
- exemples purement méthodologiques signalés comme tels, ou exemples factuels sourcés ;
- aucun conseil juridique, scientifique ou technique présenté comme une expertise ;
- chaque réponse correcte du quiz est justifiée par le corps et la matrice de preuves ;
- aucun URL, date, statut ou ordre de grandeur inventé ;
- marqueurs de glossaire uniquement vers des slugs existants dans la même passe ;
- calculer chaque `readMin` après stabilisation du corps, puis fixer `course.durationMin` à la somme exacte.

### Vérifier GREEN ciblé

L’utilisateur relance :

```bash
npm run test --workspace client -- src/content/deeptechEvidenceLearning.test.ts
```

Le test doit passer avant l’ajustement des gardes globaux. Si le test échoue, corriger les données, pas assouplir le contrat sans justification sourcée.

---

## 8. Tâche 6 — Mettre à jour les gardes réels, sans toucher aux faux positifs

### Fichiers à modifier

- `client/src/content/lessons.test.ts` : 112 → 114 leçons publiques.
- `scripts/generated-content.test.mjs` :
  - `lessons` 139 → 141 ;
  - `publishedLessonBodies` 112 → 114 ;
  - `glossaryTerms` 405 → `405 + N` avec la valeur effective de la tâche 3.

### Fichiers à ne pas modifier

- `client/src/content/certifications.test.ts` : le garde des 28 leçons d’axe ne change pas.
- `scripts/collect-routes.test.mjs` : son contrat de parité ne change pas ; c’est le sitemap généré par le build qui doit gagner trois routes.
- `data/generated/*`, `client/public/sitemap.xml`, `client/public/robots.txt` : aucune édition manuelle.
- registres de parcours, cas, livrables et certifications : hors périmètre.

Si un autre garde échoue, lire son contrat et établir le lien causal avant toute modification.

---

## 9. Tâche 7 — Build canonique puis gate complet

Hermes ne lance pas `npm`. Une fois les sources, données, tests et gardes prêts, demander à l’utilisateur d’exécuter exactement, depuis la racine :

```bash
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build && npm run check
```

L’ordre ne varie pas. Le build doit précéder le gate afin de régénérer le contenu, le sitemap et les artefacts prérendus.

### Critères attendus

- `data/generated/lessons.index.json`, `lessons.bodies.json` et `glossary.json` sont régénérés par les scripts ;
- le sitemap versionné contient 675 routes si aucun autre ajout n’est intervenu ;
- le prérendu strict tente et écrit 687 artefacts, `ok: true`, sans `routeFailures` ni `metadataFailures` ;
- `check:generated` confirme 141 leçons, 114 corps publiés et `405 + N` termes ;
- contenu strict, glossaire, typecheck, lint, Vitest et tests Node sont verts.

Ne pas prédire le nombre de modules ni les totaux finaux de tests dans le journal : recopier les valeurs réelles de la sortie.

### Boucle d’échec

1. prendre le premier échec causal, pas la cascade ;
2. distinguer données canoniques, glossaire, génération, test ou route ;
3. corriger le contrat réel, jamais contourner le garde ;
4. refaire le test ciblé si pertinent ;
5. relancer ensuite la commande canonique complète `build && check` ;
6. ne jamais lancer `npm run check` seul sur un sitemap obsolète.

---

## 10. Tâche 8 — Recette navigateur de l’artefact final

Redémarrer la preview canonique après le build :

```bash
VITE_BASE_URL=/vc-plateform/ npm run preview --workspace client -- --host 127.0.0.1 --port 4174
```

### Parcours à vérifier à 1440 × 1000 puis 390 × 844

1. `/vc-plateform/bibliotheque?type=course&q=preuve%20scientifique`
   - le nouveau cours est visible avec son niveau et sa durée calculée ;
   - le lien ouvre la bonne route.
2. `/vc-plateform/courses/preuve-scientifique-deeptech`
   - deux leçons publiées, ordonnées, cliquables, avec leurs durées ;
   - aucune carte « À venir » ;
   - durée du cours égale à la somme affichée.
3. `/vc-plateform/lessons/reproductibilite-robustesse-deeptech`
   - titre, corps, sources, marqueurs de glossaire, quiz et navigation.
4. `/vc-plateform/lessons/pilote-preuve-changement-echelle`
   - mêmes contrôles ; distinction visible entre PoC, pilote et changement d’échelle.
5. Recontrôler `/vc-plateform/courses/specialisations-sectorielles-analyst` et la leçon TRL/PI afin de vérifier l’absence de régression.

Sur chaque vue :

- pas de débordement horizontal ;
- pas d’erreur JavaScript nouvelle ni de ressource en échec ;
- liens internes sous `/vc-plateform/` ;
- titres et métadonnées de route cohérents ;
- le contenu ne révèle aucun renvoi vers un objet `cs-dt-*` absent.

Un défaut trouvé ici n’est pas consigné comme « limite » sans tentative de correction. Le reproduire, ajouter un test si le comportement est automatisable, corriger, refaire `build && check`, puis la recette concernée.

---

## 11. Tâche 9 — Contre-revues et consolidation du suivi

### Deux contre-revues en lecture seule

#### Revue A — intégrité éditoriale et sources

Vérifier, proposition par proposition :

- support exact dans la page/section citée ;
- distinction NASEM/JCGM explicite ;
- aucune généralisation de RAND hors de son échantillon ;
- aucune équivalence PoC/pilote ou scalability/changement d’échelle ;
- frontière Analyst/expert explicite ;
- exemples factuels sourcés ou signalés comme méthodologiques.

#### Revue B — intégration du dépôt

Vérifier :

- symétrie `course.lessonIds` / `lesson.courseId` ;
- ordre, prérequis, statuts, optionalité et durées ;
- parité des deux glossaires ;
- absence de changement certification/parcours/dossier ;
- gardes calculés depuis les deltas réels ;
- routes et sitemap issus du build seulement.

L’intégrateur lit les rapports, corrige les constats fondés et refait les vérifications affectées. Une auto-déclaration d’un travailleur n’est pas une preuve : relire les fichiers et les sorties réelles.

### `Suivis/ETAT.md`

Après build, gate, recettes et contre-revues :

- remplacer la passe courte du 2026-07-27 par l’état vérifié le plus récent ;
- conserver la première leçon TRL/PI et ajouter la fermeture de sa recette ;
- consigner le nouveau cours, les deux leçons, N termes, les routes et les totaux réellement observés ;
- maintenir la relecture praticienne comme condition ouverte de publication externe ;
- ne pas transformer ETAT en historique.

### `Suivis/JOURNAL.md`

Ajouter une entrée matérielle datée du 2026-07-27 contenant :

- objet et portée exacte ;
- sources récupérées/lues et limites retenues ;
- preuve RED puis GREEN ciblée ;
- sortie réelle du build canonique et du gate ;
- résultats bureau/mobile des recettes ;
- fichiers touchés, y compris les dérivés régénérés ;
- limites ouvertes : relecture praticienne, dossier/cas/livrables et lots suivants ;
- rappel explicite : aucun commit, push, déploiement ou workflow distant.

Les suivis sont mis à jour après la vérification finale, conformément au contrat du projet. Ne pas créer ni utiliser `Correction.md` pour ce chantier de production.

---

## 12. Définition de fini

La passe n’est terminée que si toutes les cases sont vraies :

- [ ] recette initiale de la leçon TRL/PI passée aux deux viewports ;
- [ ] chaque URL citée récupérée et chaque passage utilisé lu ;
- [ ] matrice de preuves complète, y compris les limites ;
- [ ] collision `proof-of-concept` / `pilote` traitée sans nouvel alias ambigu ;
- [ ] test dédié vu en RED pour la bonne raison, puis en GREEN ;
- [ ] cours et deux leçons canoniques cohérents et sourcés ;
- [ ] `readMin` calculés et `durationMin` égal à leur somme ;
- [ ] gardes 141 / 114 / `405 + N` corrigés ;
- [ ] aucun changement de certification, parcours, cas, dossier ou livrable ;
- [ ] build canonique puis gate complet verts sur sortie collée par l’utilisateur ;
- [ ] sitemap et `data/generated/` issus exclusivement du build ;
- [ ] recette finale bureau/mobile verte pour cours, leçons et non-régression TRL/PI ;
- [ ] contre-revues closes ;
- [ ] `Suivis/ETAT.md` et `Suivis/JOURNAL.md` consolidés avec les résultats réels ;
- [ ] aucun commit, staging, push, déploiement ni opération distante.

---

## 13. Prompt de lancement pour la nouvelle session

```text
Projet vc-platform. Travaille dans :
/Users/iar-witness/Documents/Projets/VC SITE/vc-platform

Utilise et exécute intégralement ce plan :
.hermes/plans/2026-07-27_115952-deeptech-preuve-scientifique.md

Avant toute proposition ou édition, lis CLAUDE.md, la passe du 2026-07-27 de Suivis/ETAT.md, l’entrée Deeptech du 2026-07-27 de Suivis/JOURNAL.md, puis le plan. Commence par la recette navigateur de l-specialty-deeptech-trl-ip ; ne produis pas les deux nouvelles leçons tant que cette recette n’est pas fermée.

Exécute en RED → GREEN → REFACTOR. Tu ne peux pas lancer npm dans ton shell : donne-moi les commandes, attends que je colle les sorties, puis poursuis. La vérification finale doit toujours être, dans cet ordre :
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build && npm run check

Récupère et lis chaque URL avant de citer une proposition. N’invente ni source, ni date, ni statut, ni ordre de grandeur. Un seul intégrateur édite les JSON partagés ; tu peux paralléliser uniquement les recherches et contre-revues en lecture seule. Ne modifie jamais data/generated/ ni client/public/sitemap.xml à la main. Ne touche ni aux certifications, ni au futur parcours/dossier/cas/livrable. Aucun git status demandé, aucun commit, push ou déploiement. Termine par les recettes 1440×1000 et 390×844, puis mets à jour Suivis/ETAT.md et Suivis/JOURNAL.md avec les sorties réelles.
```
