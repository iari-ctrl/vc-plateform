> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Lot 1 Deeptech — cours « Propriété intellectuelle et transfert » — Plan d'implémentation

> **Pour l'agent :** exécuter ce plan tâche par tâche dans une nouvelle session, en RED → GREEN → REFACTOR. Ne produire aucun commit, staging, push, déploiement ni opération distante. Ne jamais prendre l'état Git comme critère de fin. L'agent ne lance pas `npm` : il demande les commandes, attend que l'utilisateur colle les sorties, puis poursuit.

**Objectif :** créer localement le cours `c-dt-pi-transfert` et ses quatre leçons publiées, avec sources juridiques récupérées et lues article par article, glossaire aligné sur les deux registres, gardes de comptage corrigés et recettes bureau/mobile.

**Architecture :** le cours est autonome dans la Bibliothèque. Il approfondit ce que `l-specialty-deeptech-trl-ip` traite en survol ; cette leçon reste dans `c-analyst-specialties` avec `optional: true` et son `assessmentId`. Aucun parcours, dossier apprenant, cas, livrable, certification ou axe n'est créé ni modifié dans cette passe.

---

## 1. État de départ vérifié (2026-07-27, après correction)

| Inventaire | Valeur | Source de la valeur |
| --- | ---: | --- |
| Cours | 29 | `validate:content` |
| Leçons indexées | 141 (120 bibliothèque + 21 parcours) | `split:lessons` |
| Corps publiés | 114 | `check:generated` |
| Termes de glossaire | 411 | `split:glossary` |
| Marqueurs `[[..]]` / `{{..}}` | 380 | `validate:content` |
| Routes publiques du sitemap | 681 | `generate:sitemap` |
| Artefacts du prérendu strict | 693 | `prerender:strict` |
| Suites | 60 fichiers / 367 tests Vitest, 58/58 Node | `npm run check` |

Gardes de comptage actuels : `client/src/content/lessons.test.ts:15` attend 114 leçons publiques ; `scripts/generated-content.test.mjs:152-156` attend `{ lessons: 141, publishedLessonBodies: 114, glossaryTerms: 411 }` ; `client/src/content/certifications.test.ts:243-244` attend 28 leçons d'axe et ne doit pas bouger.

---

## 2. À relire avant toute édition

1. `CLAUDE.md` en entier, en particulier la charte de style et la définition de fini.
2. `Suivis/ETAT.md`, passe du 2026-07-27 et ses contrôles consignés.
3. Les deux entrées du 2026-07-27 de `Suivis/JOURNAL.md` : la production du cours « preuve scientifique » **et** la correction de provenance qui a suivi.
4. La leçon publiée `l-specialty-deeptech-trl-ip` dans `data/lessons.json`, intégralement — elle fixe la frontière de recouvrement.
5. `client/src/content/deeptechEvidenceLearning.test.ts` comme modèle de contrat éditorial.
6. `scripts/validate-content.mjs` pour les schémas effectifs, et `client/src/content/serieAParcours.test.ts` pour le régime de `readMin`.

---

## 3. Défauts constatés le 2026-07-27 — à ne pas répéter

La passe précédente a livré un build et un gate verts, une recette navigateur et deux contre-revues, et contenait pourtant trois défauts trouvés ensuite en relecture. Ils définissent les gardes de cette passe.

1. **Localisateur inventé.** Une leçon citait « chapitre 3, Conclusion 3-1 » pour une page qui sert en réalité le résumé d'un rapport et ne contient nulle part cette chaîne. → Tout localisateur cité doit apparaître **littéralement** dans le document récupéré, et l'agent doit pouvoir le citer verbatim.
2. **Spécificités absentes de la source.** Une leçon ajoutait « en Amérique du Nord » et « sur environ quinze ans » à un échantillon d'étude que la notice éditeur ne qualifie pas ainsi. → Aucune précision de population, de périmètre géographique, de durée ou de volume qui ne soit pas écrite dans la source récupérée.
3. **Duplication de rendu.** Les corps portaient une section `## À retenir` reprenant `keyTakeaways`, que `client/src/pages/learn/LessonPage.tsx:242` rend déjà dans un encart du même nom. → Interdiction stricte de cette section ; le contrat de test la vérifie.

La contre-revue de provenance de cette passe contrôlait la **présence** des sources et le bornage des affirmations, non leur **soutien** proposition par proposition. Le protocole de la tâche 8 corrige ce point.

---

## 4. Décisions gelées

### Noms et routes

| Objet | ID | Slug / route |
| --- | --- | --- |
| Cours | `c-dt-pi-transfert` | `propriete-intellectuelle-transfert-deeptech` |
| Leçon 1 | `ldt-titularite-copropriete` | `titularite-copropriete-brevets` |
| Leçon 2 | `ldt-brevet-secret` | `brevet-secret-arbitrage-protection` |
| Leçon 3 | `ldt-licence-redevances` | `licence-exploitation-redevances` |
| Leçon 4 | `ldt-transfert-recherche-publique` | `transfert-technologie-recherche-publique` |

Titres de travail : cours **Propriété intellectuelle et transfert** ; leçons **Titularité et copropriété des droits**, **Brevet ou secret : instruire l'arbitrage**, **Licence d'exploitation et redevances**, **Transfert depuis la recherche publique**. Les intitulés peuvent être resserrés après lecture des sources ; les IDs et slugs restent stables.

### Ordre pédagogique

L'ordre de production annoncé dans la note de chantier plaçait brevet/secret en tête. Il est inversé ici pour une raison tirée du corpus lui-même : `l-specialty-deeptech-trl-ip` pose que « la titularité s'établit avant la protection ». Un cours qui enseignerait l'arbitrage brevet/secret avant la titularité contredirait une leçon publiée. Ordre retenu : titularité et copropriété, puis brevet ou secret, puis licence et redevances, puis transfert depuis la recherche publique.

Chaîne de prérequis : `l-specialty-deeptech-trl-ip` → `ldt-titularite-copropriete` → `ldt-brevet-secret` → `ldt-licence-redevances` → `ldt-transfert-recherche-publique`.

### Contrat de non-recouvrement

`l-specialty-deeptech-trl-ip` traite déjà, en survol : l'ordre titularité puis protection, le principe de l'article L611-7 du code de la propriété intellectuelle, la durée du brevet contre l'absence de durée du secret, l'absence d'action en contrefaçon attachée au secret, l'exception de possession personnelle antérieure et le principe de la liberté d'exploitation. Le nouveau cours **approfondit sans contredire** : régimes d'attribution et procédure, régime supplétif de la copropriété, conditions de qualification du secret des affaires, structure d'un contrat de licence et opposabilité, spécificités du transfert depuis un établissement public. Toute affirmation du nouveau cours qui contredirait la leçon publiée impose de traiter l'écart explicitement, pas de le laisser coexister.

### Invariants de données

- `durationSource: "lesson-read-minutes"` sur le cours ; `durationMin` égal à la somme exacte des quatre `readMin`.
- Leçons : `level: "avance"`, `status: "published"`, `optional: false`, `courseId: "c-dt-pi-transfert"`, `order` 1 à 4.
- Aucun `assessmentId`, aucun `practice`, aucun renvoi à un objet `cs-dt-*` inexistant.
- Aucune modification de `data/certifications.json`, des registres de parcours, cas, livrables, ni de `c-analyst-specialties`.
- Aucune édition manuelle de `data/generated/`, `client/public/sitemap.xml` ou `client/public/robots.txt`.

### Interdits éditoriaux

- Aucun taux de redevance, fourchette de valorisation, durée type de négociation ou ordre de grandeur de marché : ces chiffres n'existent pas dans une source officielle française et seraient une approximation.
- Aucun conseil juridique. Le cours enseigne à instruire un dossier et à commander une expertise ; la qualification d'un titre, d'une titularité, d'une clause ou d'une liberté d'exploitation relève d'un conseil en propriété industrielle ou d'un avocat.
- Aucune généralisation d'un régime français à un autre pays sans source dédiée. La portée géographique est déclarée dans le corps.
- Aucune section `## À retenir` dans un corps. `keyTakeaways` porte cette matière.

---

## 5. Tâche 1 — Matrice de preuves, avant le test et avant la prose

### Régime de citation

Pour chaque proposition factuelle conservée, la matrice de session porte : identifiant, proposition en une phrase, document primaire récupéré, localisateur exact **présent littéralement dans le document**, citation verbatim du passage, formulation autorisée en français, limite de portée, destination (section, quiz, glossaire).

Règles, sans exception :

- ouvrir et lire le document ; un extrait de moteur de recherche, un résumé secondaire ou une mémoire de modèle ne vaut pas source ;
- vérifier que la chaîne du localisateur figure dans le document récupéré avant de l'écrire dans une référence ;
- pour un article de code, citer la **version en vigueur** et son URL Légifrance de forme `https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI…`, comme le fait déjà `l-specialty-deeptech-trl-ip` ;
- si un document ne peut être ni récupéré ni lu, supprimer la proposition ou trouver une source officielle accessible ; ne jamais compléter par déduction ;
- aucune date, version, statut, auteur, juridiction, population ou volume qui ne soit pas écrit dans la source.

### Sources candidates

Aucune de ces références n'est vérifiée à ce stade, **à l'exception de l'article L611-7 du code de la propriété intellectuelle**, déjà récupéré et cité dans le corpus. Les numéros d'article ci-dessous sont des pistes à confirmer sur Légifrance, y compris leur existence, leur numérotation actuelle et leur rédaction en vigueur.

| Sujet | Piste à vérifier | Usage envisagé |
| --- | --- | --- |
| Inventions de salariés | code de la propriété intellectuelle, livre VI, articles autour de L611-6 et L611-7, et leur partie réglementaire | régimes d'attribution, procédure de classement, rémunération supplémentaire, juste prix, exigence d'un écrit |
| Copropriété de brevet | code de la propriété intellectuelle, livre VI, section relative à la copropriété | régime supplétif, exploitation par un copropriétaire, cession de quote-part, préemption, concession de licence |
| Cession et licence | code de la propriété intellectuelle, dispositions sur la transmission des droits et l'inscription au registre national des brevets | forme écrite, opposabilité aux tiers, licence exclusive ou non |
| Secret des affaires | code de commerce, dispositions issues de la directive (UE) 2016/943 | conditions cumulatives de qualification, mesures raisonnables de protection |
| Transfert public | code de la recherche, dispositions sur la participation des personnels de recherche à la valorisation et à la création d'entreprise | autorisation, cumul, encadrement déontologique, place de l'établissement |
| Information institutionnelle | fiches INPI, dont la fiche « Le secret » du 9 décembre 2024 déjà citée dans le corpus | vulgarisation contrôlée, moyens de preuve de possession |

Ajouter une source seulement si elle est officielle, accessible et directement citable. Une page de cabinet, un blog, un article de presse ou une base secondaire ne peut pas soutenir une proposition juridique.

**Gate :** aucune écriture dans `data/lessons.json` tant que la matrice ne couvre pas les affirmations principales de chaque leçon, les définitions de glossaire et chaque réponse correcte de quiz.

---

## 6. Tâche 2 — Arbitrer le glossaire avant de l'éditer

Le vocabulaire de propriété intellectuelle est **entièrement absent** du glossaire publié : aucune entrée ne porte titularité, copropriété, brevet, secret, licence, redevance, liberté d'exploitation ni transfert de technologie, ni comme terme, ni comme slug, ni comme alias exact. Le lot est donc à créer, pas à compléter.

Cible bornée : **6 à 8 termes**, chacun réellement employé par un marqueur de leçon. Candidats à confirmer par la matrice : titularité des droits, copropriété de brevet, invention de mission, secret des affaires, licence d'exploitation, redevance, liberté d'exploitation, transfert de technologie.

Procédure, dans cet ordre :

1. figer slugs, titres canoniques, alias, catégories et `seeAlso` **avant** le test RED ;
2. vérifier qu'aucun alias envisagé n'entre en collision avec un terme ou un alias existant — le défaut `pilote` / `proof-of-concept` de la passe précédente vient d'un alias nu trop polysémique ; proscrire les alias nus ambigus comme `licence`, `secret` ou `transfert` et préférer des alias composés ;
3. écrire d'abord `data/sources/canonical-glossary.json` avec `status: "applied"`, `action: "add"`, `sourceStatus: "source-backed"`, des `sourcePaths` contenant les URL réellement lues, un module explicite et une note datée bornant la portée ;
4. reporter les champs publiés à l'identique dans `data/glossary.json` ;
5. ne jamais éditer `data/generated/`.

**Gate :** fixer N après cet arbitrage, puis seulement recalculer le garde `glossaryTerms`. Ne pas forcer N pour atteindre un compteur.

---

## 7. Tâche 3 — RED : le contrat éditorial avant les données

**Créer** `client/src/content/deeptechIpTransferLearning.test.ts`, sur le modèle de `deeptechEvidenceLearning.test.ts`, important directement `@data/courses.json`, `@data/lessons.json`, `@data/glossary.json` et `@data/sources/canonical-glossary.json`.

Contrats couverts :

1. cours présent, ID et slug gelés, `level: "avance"`, `durationSource: "lesson-read-minutes"`, `lessonIds` exactement les quatre IDs dans l'ordre, `durationMin` égal à la somme des quatre `readMin` ;
2. quatre leçons publiées, non optionnelles, rattachées au cours, `order` 1 à 4, chaîne de prérequis exacte ;
3. aucune leçon ne porte `practice`, `assessmentId`, ni la chaîne `cs-dt-` ;
4. `readMin` de chaque leçon égal à `Math.ceil(nombreDeJetons / 180)` avec l'expression Unicode reprise de `deeptechEvidenceLearning.test.ts` ;
5. chaque corps contient `## Références`, ne contient pas `## À retenir`, et porte une formulation explicite de la limite — instruire et commander une expertise, ne pas statuer sur la qualification juridique ;
6. chaque corps contient les URL finales de sa matrice ;
7. chaque slug de glossaire retenu existe dans les deux registres avec des champs publiés identiques, `sourceStatus: "source-backed"`, des `sourcePaths` non vides et au moins un `relatedLessonIds` vers une leçon du cours ;
8. aucun alias nu ambigu introduit sur un terme existant.

Ne pas figer la prose au caractère près. Le test protège les invariants pédagogiques, la provenance et le rendu, pas la rédaction.

**Vérifier RED** — l'utilisateur lance et colle la sortie :

```bash
npm run test --workspace client -- src/content/deeptechIpTransferLearning.test.ts
```

Échec attendu parce que le cours et les leçons n'existent pas. Une erreur d'import, de syntaxe ou de fixture n'est pas un RED valable.

---

## 8. Tâche 4 — GREEN : glossaire, cours, leçons

Écrire dans l'ordre : les deux registres de glossaire, puis `data/courses.json`, puis les quatre leçons.

### Périmètre de chaque leçon

- **`ldt-titularite-copropriete`** — établir qui détient quoi avant d'apprécier la protection : statut de l'inventeur au moment de l'invention, régimes d'attribution, cas des agents publics, chaîne de cessions, copropriété et son régime supplétif, effets pratiques d'une quote-part non réglée sur une opération.
- **`ldt-brevet-secret`** — instruire l'arbitrage sans le présumer : conditions de qualification du secret des affaires, contrepartie de publication du brevet, ce que chaque voie ouvre et ferme en contentieux, critères d'instruction (facilité de rétro-ingénierie, rythme de renouvellement, capacité réelle à tenir un dispositif de confidentialité), combinaison des deux voies.
- **`ldt-licence-redevances`** — lire un contrat comme un analyste : objet et périmètre concédés, exclusivité, territoire, durée, forme écrite et opposabilité, assiette et déclenchement d'une redevance, sous-licence, amélioration, résiliation et sort des droits en cas de cessation. Aucun taux.
- **`ldt-transfert-recherche-publique`** — instruire une société issue d'un laboratoire : place de l'établissement, autorisation et encadrement des personnels de recherche, articulation entre publication scientifique et dépôt, conditions ouvertes qui deviennent des conditions suspensives d'investissement.

### Règles de rédaction

- registre institutionnel, prose argumentée, aucune tonalité promotionnelle, aucun bloc d'énumération là où une phrase suffit ;
- sections libres, sauf `## Références` en fin de corps et interdiction de `## À retenir` ;
- 3 à 4 objectifs, 4 messages clés au maximum, 3 questions de quiz au maximum par leçon ; chaque réponse correcte est justifiée par le corps et par la matrice ;
- exemples méthodologiques signalés comme tels ; aucun cas réel non sourcé ;
- marqueurs de glossaire uniquement vers des slugs créés dans la même passe ou déjà existants ;
- calculer chaque `readMin` après stabilisation du corps — compter les jetons avec l'expression du test, ne pas estimer — puis fixer `durationMin` du cours à la somme exacte.

**Vérifier GREEN ciblé :**

```bash
npm run test --workspace client -- src/content/deeptechIpTransferLearning.test.ts
```

Si le test échoue, corriger les données. N'assouplir le contrat que sur justification sourcée.

---

## 9. Tâche 5 — Gardes de comptage

À modifier :

- `client/src/content/lessons.test.ts` : 114 → 118 leçons publiques ;
- `scripts/generated-content.test.mjs` : `lessons` 141 → 145, `publishedLessonBodies` 114 → 118, `glossaryTerms` 411 → `411 + N`.

À ne pas modifier : `client/src/content/certifications.test.ts` (28 leçons d'axe), `scripts/collect-routes.test.mjs` (contrat de parité inchangé ; c'est le sitemap régénéré qui gagne des routes), `data/generated/*`, `client/public/sitemap.xml`, `client/public/robots.txt`.

Si un autre garde échoue, établir le lien causal avant toute modification. Corriger le contrat réel, jamais contourner l'assertion.

### Delta attendu

| Inventaire | Départ | Attendu |
| --- | ---: | ---: |
| Cours | 29 | 30 |
| Leçons indexées | 141 | 145 |
| Corps publiés | 114 | 118 |
| Termes | 411 | 411 + N |
| Routes du sitemap | 681 | 686 + N |
| Artefacts du prérendu | 693 | 698 + N |
| Leçons d'axe Deeptech | 28 | 28 |

Hypothèses de contrôle, pas valeurs à forcer. En cas d'écart, chercher la route ou l'entrée manquante.

---

## 10. Tâche 6 — Build puis gate

Commande unique, ordre invariable, lancée par l'utilisateur depuis la racine :

```bash
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build && npm run check
```

Pas de slash final sur `VITE_SITE_URL`. Ne jamais lancer `npm run check` seul sur un sitemap obsolète.

Attendu : `prebuild` régénère les quatre sorties, `check:generated` confirme 145 leçons, 118 corps publiés et `411 + N` termes, le prérendu strict retourne `ok: true` sans `routeFailures` ni `metadataFailures`, et le compte écrit égale le compte attendu. Recopier les valeurs réelles de la sortie ; ne rien prédire dans les suivis.

Boucle d'échec : prendre le premier échec causal et non la cascade, distinguer données, glossaire, génération, test ou route, corriger le contrat, rejouer le test ciblé, puis relancer la commande complète.

---

## 11. Tâche 7 — Recette navigateur

Après le build :

```bash
VITE_BASE_URL=/vc-plateform/ npm run preview --workspace client -- --host 127.0.0.1 --port 4174
```

À 1440 × 1000 puis 390 × 844, sur `/bibliotheque?type=course`, `/courses/propriete-intellectuelle-transfert-deeptech` et les quatre routes de leçon : cours visible avec son niveau et sa durée dérivée, quatre leçons publiées et ordonnées, aucune carte « À venir », références et quiz présents, encart « À retenir » affiché **une seule fois** et non doublé dans le corps, aucun débordement horizontal, aucune erreur console nouvelle, aucun lien hors base `/vc-plateform/`. Contrôler aussi la non-régression de `/courses/preuve-scientifique-deeptech` et de `/courses/specialisations-sectorielles-analyst`.

Un défaut trouvé ici se reproduit, se teste si le comportement est automatisable, se corrige, puis impose de rejouer `build && check` et la recette concernée. Il n'est pas consigné comme « limite ».

---

## 12. Tâche 8 — Contre-revues

### Revue A — soutien des sources, proposition par proposition

Pour **chaque** phrase du corps qui énonce un fait, une règle, une condition, une durée, une population ou un périmètre : ouvrir la source citée, retrouver le passage, vérifier que la formulation française ne dit ni plus ni moins, et vérifier que le localisateur écrit dans la référence figure littéralement dans le document. Une revue qui se contente de constater que les sources sont présentes et les affirmations bornées est insuffisante : c'est précisément ce qui a laissé passer trois défauts le 2026-07-27.

Vérifier en outre : aucun taux ni ordre de grandeur, aucune extension géographique implicite, aucune contradiction avec `l-specialty-deeptech-trl-ip`, frontière analyste/conseil explicite dans chaque leçon.

### Revue B — intégration du dépôt

Symétrie `course.lessonIds` / `lesson.courseId`, ordre, prérequis, statuts, optionalité, durées dérivées, parité des deux registres de glossaire, absence d'alias ambigu, absence de changement sur certifications, parcours, cas et livrables, gardes calculés depuis les deltas réels, routes et sitemap issus du seul build.

L'intégrateur lit les rapports, corrige les constats fondés et refait les vérifications affectées. Une auto-déclaration ne vaut pas preuve : relire les fichiers et les sorties réelles.

---

## 13. Tâche 9 — Suivis

`Suivis/ETAT.md` : remplacer la passe courante par l'état vérifié, avec les compteurs réels, les routes, les totaux de tests et les limites ouvertes. Ne pas y accumuler d'historique.

`Suivis/JOURNAL.md` : ajouter une entrée datée contenant objet et périmètre, sources récupérées avec leur localisateur et leur limite, preuve RED puis GREEN, sorties réelles du build et du gate, résultats des recettes aux deux viewports, fichiers touchés y compris les dérivés régénérés, limites ouvertes, et le rappel qu'aucun commit, push, workflow distant ni déploiement n'a été exécuté. Ne jamais réécrire une entrée antérieure.

---

## 14. Définition de fini

- [ ] matrice de preuves complète, chaque localisateur retrouvé littéralement dans le document récupéré ;
- [ ] lot de glossaire arbitré, N fixé, aucun alias ambigu, parité des deux registres ;
- [ ] test dédié vu en RED pour la bonne raison, puis en GREEN ;
- [ ] cours et quatre leçons cohérents, sourcés, sans recouvrement contradictoire avec la leçon TRL/PI ;
- [ ] `readMin` calculés et `durationMin` égal à leur somme exacte ;
- [ ] gardes 145 / 118 / `411 + N` corrigés, garde des 28 leçons d'axe intact ;
- [ ] `build && check` verts sur sortie collée par l'utilisateur, prérendu strict `ok: true` et comptes égaux ;
- [ ] recette bureau et mobile verte, encart « À retenir » non dupliqué ;
- [ ] deux contre-revues closes, la revue A conduite proposition par proposition ;
- [ ] `ETAT.md` et `JOURNAL.md` consolidés sur les valeurs réelles ;
- [ ] aucun commit, staging, push, déploiement ni opération distante.

---

## 15. Prompt de lancement

```text
Projet vc-platform. Travaille dans :
/Users/iar-witness/Documents/Projets/VC SITE/vc-platform

Exécute intégralement ce plan :
.hermes/plans/2026-07-27_142409-deeptech-pi-transfert.md

Avant toute proposition ou édition, lis CLAUDE.md, la passe du 2026-07-27 de Suivis/ETAT.md, les DEUX entrées du 2026-07-27 de Suivis/JOURNAL.md — la production du cours « preuve scientifique » et la correction de provenance qui a suivi —, la leçon publiée l-specialty-deeptech-trl-ip dans data/lessons.json, puis le plan.

Objet : créer le cours c-dt-pi-transfert et ses quatre leçons publiées, avec 6 à 8 termes de glossaire sourcés. Ordre pédagogique gelé : titularité et copropriété, brevet ou secret, licence et redevances, transfert depuis la recherche publique.

Contraintes non négociables :
- récupère et lis chaque source avant de citer ; vérifie que le localisateur écrit dans la référence figure littéralement dans le document récupéré ; n'invente ni article, ni date, ni version, ni population, ni périmètre géographique ;
- aucun taux de redevance, fourchette de valorisation ou ordre de grandeur de marché ;
- aucune section « ## À retenir » dans un corps de leçon : keyTakeaways est déjà rendu sous ce titre ;
- ne touche ni aux certifications, ni aux parcours, cas, dossiers ou livrables ; n'édite jamais data/generated/ ni client/public/sitemap.xml à la main ;
- procède en RED puis GREEN ; corrige les gardes de comptage, ne les contourne pas.

Tu ne peux pas lancer npm : donne-moi les commandes, attends que je colle les sorties, puis poursuis. La vérification finale est toujours, dans cet ordre :
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build && npm run check

Aucun état Git demandé, aucun commit, push ni déploiement. Termine par les recettes 1440×1000 et 390×844, les deux contre-revues, puis la mise à jour de Suivis/ETAT.md et Suivis/JOURNAL.md avec les sorties réelles.
```
