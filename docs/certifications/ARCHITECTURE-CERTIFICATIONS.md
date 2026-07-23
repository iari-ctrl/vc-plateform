# Architecture transverse des certifications

> [!IMPORTANT]
> **Référence maintenue.** Ce document est la source transverse pour l'ontologie des certifications, les catégories de titres, l'échelle des niveaux, les axes de contextualisation, les règles de nommage et les invariants de gouvernance. Il décrit aussi la transition provisoire entre la cible et le modèle actuellement exposé par l'application. Les compteurs et vérifications courants restent dans `Suivis/ETAT.md` ; les données et le code font foi pour le comportement effectivement implémenté.

Documents associés :

- [`../parcours/ANALYST-FOUNDATIONS.md`](../parcours/ANALYST-FOUNDATIONS.md) définit le parcours ouvert `analyst-foundations` ;
- [`REFERENTIEL-VC-ANALYST.md`](REFERENTIEL-VC-ANALYST.md) définit le périmètre professionnel et la préparation recommandée de `VC Analyst` ;
- [`GOUVERNANCE-CERTIFICATIONS.md`](GOUVERNANCE-CERTIFICATIONS.md) borne le régime humain futur, actuellement inactif ;
- [`PROTOCOLE-PRODUCTION-ANALYST.md`](PROTOCOLE-PRODUCTION-ANALYST.md) fixe la méthode de production des futures épreuves professionnelles Analyst ;
- [`../ARCHITECTURE_EDITION.md`](../ARCHITECTURE_EDITION.md) décrit le cycle d'édition des collections de données.

## 1. Objet et partage des responsabilités

Une certification atteste un résultat évalué. Elle ne se confond ni avec un parcours de formation, ni avec la consommation de cours, ni avec une progression enregistrée dans le navigateur.

Chaque fait durable possède une source principale :

| Fait | Source principale |
| --- | --- |
| Catégories, titres, axes, invariants et limites du programme | Le présent document |
| Promesse des cinq niveaux | `data/certificationLevels.json` |
| Référentiel du parcours Foundations | `docs/parcours/ANALYST-FOUNDATIONS.md` |
| Référentiel professionnel VC Analyst | `docs/certifications/REFERENTIEL-VC-ANALYST.md` |
| Charte du candidat et versions publiées | `data/candidateCharters.json` |
| Définition des évaluations locales | `data/certificationAssessments.json` |
| Certifications publiées et exigences de cours | `data/certifications.json` |
| État implémenté, compteurs et dernières vérifications | `Suivis/ETAT.md` |
| Historique des livraisons | `Suivis/JOURNAL.md` |

Une information propre à un niveau ne doit pas être recopiée dans l'architecture transverse. Le présent document peut en donner la règle ou le résumé nécessaire, puis renvoie à la source détaillée.

## 2. Ontologie pédagogique

La certification s'appuie sur le catalogue existant sans former un second catalogue :

```text
Domaine
└── Certification
    ├── promesse de niveau
    ├── exigences de cours et sous-ensembles de leçons
    ├── évaluation
    ├── mise en situation autoévaluée hors score, le cas échéant
    ├── version de la charte du candidat
    └── contexte consigné dans un supplément, le cas échéant

Cours réutilisable
└── Leçons autonomes

Parcours
└── progression de formation ouverte, distincte de la certification
```

Le domaine organise le catalogue. Le cours regroupe des leçons cohérentes et peut être mobilisé par plusieurs parcours ou certifications. Une certification référence les cours et les leçons par identifiant ; elle ne recopie pas leur prose.

Un `CourseRequirement` peut viser la totalité d'un cours ou un sous-ensemble ordonné de ses leçons. Ce sous-ensemble conserve l'ordre canonique du cours ; l'exigence certifiante ne réordonne pas le contenu source. Une leçon peut préparer plusieurs preuves sans appartenir exclusivement à une certification.

Une `KnowledgeCertification` peut relier un `Deliverable` par le champ optionnel `capstoneDeliverableId`. Ce livrable constitue une mise en situation autoévaluée distincte de l'évaluation scorée : sa complétion et sa grille n'entrent pas dans le calcul du résultat local. Le livrable peut être propre à la certification et ne dépend pas nécessairement d'un parcours.

La création d'un nouveau niveau ou d'une nouvelle certification se justifie par une responsabilité ou une preuve différente. Une variation de contexte se traite par une exigence, un cas ou un supplément, sauf si elle modifie la finalité du capital et le référentiel de compétences au point de constituer un domaine autonome.

## 3. Catégories de titres

Trois catégories éditoriales sont conservées. Elles ne prétendent pas au même niveau de qualification.

| Catégorie | Objet attesté | Preuve attendue | Situation dans le lot actuel |
| --- | --- | --- | --- |
| Certificat de connaissances | Maîtrise d'un socle défini | Examen et exercices ou mini-cas corrigés selon des règles explicites | Catégorie retenue, aucune instance publiée dans ce lot |
| Certificat de compétence | Capacité technique ciblée | Cas pratique et livrable évalué selon une grille | Catégorie retenue, aucune instance publiée dans ce lot |
| Certification professionnelle | Capacité à assumer une responsabilité professionnelle complète | Dossier de preuves, mises en situation et décision humaine selon une gouvernance formelle | `VC Analyst`, référentiel défini mais délivrance inactive |

Le modèle technique est une union discriminée à deux branches :

```text
Certification = KnowledgeCertification | ProfessionalCertification
```

`KnowledgeCertification` couvre les titres locaux fondés sur une évaluation déterministe, dont les certificats de connaissances et, à terme, les certificats de compétence compatibles avec ce régime. `ProfessionalCertification` porte les compétences, exigences et modalités propres à une responsabilité professionnelle. Une troisième catégorie éditoriale n'impose donc pas une troisième branche technique.

Une durée courte ne transforme pas un résultat de connaissances en certification professionnelle. Inversement, la complétion de contenus ne suffit jamais à établir une compétence professionnelle.

## 4. Échelle VC des niveaux et promesses

L'échelle des responsabilités VC comprend cinq niveaux :

1. `VC Analyst` ;
2. `VC Associate Foundations` ;
3. `VC Associate` ;
4. `VC Senior Associate` ;
5. `VC Principal`.

Le libellé, la catégorie, la promesse et les limites de chaque niveau vivent dans `data/certificationLevels.json`. La vue éditoriale `/certifications/niveaux` présente cette collection sur une page unique ; l'échelle ne crée pas cinq fiches de certification artificielles.

Seul `VC Analyst` dispose d'un référentiel de certification engagé dans le présent cycle. Les quatre niveaux supérieurs expriment une responsabilité cible, sans durée, seuil de réussite, cours, épreuve ni calendrier promis. Leur présence rend la progression lisible ; elle ne vaut pas engagement de production.

## 5. Titre canonique et supplément contextualisé

Le titre professionnel est invariant :

> **VC Analyst**

Le stade, le rôle du fonds, le secteur, la géographie et le mandat ne sont jamais concaténés au titre. Une sélection de contexte produit un supplément structuré, conservé et affiché séparément.

Exemple :

```text
Titre : VC Analyst

Supplément contextualisé
- Stade d'investissement : Seed
- Rôle du fonds dans le tour : Lead
- Secteur ou modèle économique : SaaS B2B
- Cadre juridique et géographique : France / Union européenne
- Mandat du fonds : non renseigné
```

Le supplément décrit les options, cours, cas ou adaptations effectivement validés. Une valeur absente est omise ou signalée comme non renseignée ; elle ne doit pas être inventée. Le parcours `analyst-foundations` n'emploie pas ce mécanisme, car il ne constitue pas un titre.

## 6. Axes de contextualisation

### 6.1 Cible à cinq axes

La cible distingue cinq dimensions qui ne doivent pas être confondues :

| Axe cible | Question traitée | Exemples |
| --- | --- | --- |
| Stade d'investissement | À quel degré de maturité l'entreprise est-elle analysée ? | Pre-seed, Seed, Série A, Growth |
| Rôle du fonds dans le tour | Quelle position le fonds occupe-t-il dans le processus ? | Lead, co-lead, follower |
| Secteur ou modèle économique | Quelles métriques, contraintes et diligences propres à l'activité s'appliquent ? | Généraliste, SaaS, deeptech, climat, santé, consumer et marketplaces |
| Cadre juridique et géographique | Dans quel environnement de droit et de marché le dossier est-il traité ? | France / Union européenne, Royaume-Uni, États-Unis / Delaware, OHADA |
| Mandat ou stratégie du fonds | Quelle finalité ou contrainte d'allocation structure la décision ? | Généraliste, impact, capital catalytique ou autre mandat explicite |

L'Impact relève du mandat ou de la stratégie du fonds. Il ne constitue pas, à lui seul, un secteur.

### 6.2 Transition provisoire à trois axes

Le modèle et l'interface conservent provisoirement les trois axes existants :

- `fundStage` — stade d'investissement ;
- `dealRole` — rôle du fonds dans le tour ;
- `specialty` — spécialité, qui regroupe encore les secteurs et l'option historique Impact.

Les sélections locales existantes et les **160 compositions** restent compatibles. Aucune migration vers cinq axes n'est engagée dans ce lot. Les axes de cadre juridique et géographique et de mandat ne sont ni ajoutés au configurateur, ni utilisés pour créer de nouvelles compositions. L'option historique `specialty: "impact"` reste lisible dans l'état actuel comme contextualisation de `VC Analyst`. Elle ne désigne pas le parcours de venture philanthropie et sa production ne vaut ni reclassement de cette option, ni migration des axes.

Cette coexistence doit toujours être formulée comme une transition : cinq axes constituent la cible documentaire ; trois axes décrivent l'état provisoire des données et de l'interface.

## 7. Décision de transition pour Analyst

L'audit des 35 leçons publiées conduit à deux ensembles distincts :

- **23 leçons** composent le parcours `analyst-foundations` ;
- **12 leçons** forment une préparation recommandée à `VC Analyst`, visible mais non bloquante.

Le détail par cours et par identifiant est maintenu dans le [référentiel du parcours](../parcours/ANALYST-FOUNDATIONS.md) et le [référentiel professionnel](REFERENTIEL-VC-ANALYST.md). Les 92 questions rattachées aux 23 leçons du parcours restent formatives. Aucune évaluation locale ne leur est associée.

Les six leçons envisagées pour les contextes Seed, fonds lead et SaaS ne constituent pas un lot de production. Elles restent candidates et ne seront rédigées que si une épreuve future révèle un manque de préparation qui ne peut pas être couvert par un contenu existant.

La charge de **40 heures** associée à `VC Analyst` est une hypothèse interne de conception. Elle n'est ni une durée publique, ni une promesse au candidat, ni un seuil. Elle devra être mesurée sur les futures épreuves avant toute publication.

## 8. Évaluation locale, accès et délivrance

Le parcours `analyst-foundations` est librement accessible. Il ne produit aucun résultat local, ne conditionne pas l'accès à la préparation recommandée ou à la fiche `VC Analyst` et ne délivre aucun titre.

L'application ne verrouille techniquement ni les leçons ni les simulateurs. Les règles de consultation propres à une épreuve relèvent de la charte et de l'interface, pas d'un blocage général du catalogue.

La délivrance d'une certification professionnelle exige une décision humaine, un contrôle d'identité et une inscription dans un registre. Ce régime est décrit uniquement comme cadre futur dans [`GOUVERNANCE-CERTIFICATIONS.md`](GOUVERNANCE-CERTIFICATIONS.md). Il est inactif : aucun résultat, score, progression ou livrable conservé localement ne crée un état certifié.

## 9. Charte du candidat

La charte du candidat est une collection canonique versionnée dans `data/candidateCharters.json`. Elle est distincte de la charte éditoriale du produit.

Chaque version couvre au minimum :

- l'authenticité du travail et l'interdiction de fabriquer des données ;
- la traçabilité des sources et la distinction entre fait, déclaration, hypothèse et inférence ;
- la déclaration des outils d'intelligence artificielle et la vérification de leurs sorties ;
- la confidentialité et l'interdiction de charger des données sensibles dans un service non autorisé ;
- la déclaration des conflits d'intérêts ;
- les erreurs critiques et leur caractère non compensable lorsqu'elles s'appliquent ;
- la responsabilité du candidat à l'égard des données conservées localement.

Le navigateur n'est pas un espace confidentiel ni une sauvegarde garantie. Le candidat reste responsable de l'autorisation des données saisies, de leur exactitude, de leur conservation et de leur éventuelle suppression.

Une annexe de session peut, à terme, figer l'identité vérifiée, la version de l'évaluation, la version de la charte et les outils déclarés. Cette annexe demeure inactive tant que la délivrance humaine n'est pas ouverte.

## 10. Gouvernance et protocole de production

La gouvernance future ne doit pas être conçue au-delà des invariants nécessaires à la crédibilité du titre. Ses limites sont fixées dans [`GOUVERNANCE-CERTIFICATIONS.md`](GOUVERNANCE-CERTIFICATIONS.md).

La production des futures épreuves `VC Analyst` suit une séquence hybride :

```text
Document du fonds
→ squelette du cas et registre de preuves
→ M1 complète
→ contrôles et production par blocs
```

Le détail des portes de contrôle est défini dans [`PROTOCOLE-PRODUCTION-ANALYST.md`](PROTOCOLE-PRODUCTION-ANALYST.md). Le protocole constitue une règle de travail ; il ne signifie pas que le fonds, la bible du cas ou M1 ont été produits.

## 11. Charte éditoriale

Les titres, promesses, consignes, cas, corrigés et textes d'interface appliquent la charte transverse de `CLAUDE.md`, de la section 4.0.c du [manuel d'édition](../ARCHITECTURE_EDITION.md) et de `.claude/skills/ecosystemes/SKILL.md` : ton correct, sobre, factuel et institutionnel ; affirmations proportionnées ; hypothèses et incertitudes signalées ; absence de dramatisation, de survente et de formulation promotionnelle.

La charte éditoriale règle la manière d'écrire. La charte du candidat règle la manière de composer et de remettre une évaluation. Elles ne doivent pas être fusionnées.

## 12. Hors périmètre du lot actuel

Restent explicitement hors périmètre :

- la migration des données et de l'interface de trois vers cinq axes ;
- la production du document du fonds, de la bible du cas et de M1 ;
- la production du cas fil rouge et des autres missions professionnelles ;
- la rédaction des six leçons candidates Seed, Lead et SaaS ;
- l'export des résultats ou livrables hors du navigateur ;
- la délivrance humaine, le contrôle d'identité et le registre d'émission ;
- l'activation de l'annexe de session de la charte ;
- les référentiels, durées, seuils, cours et épreuves détaillés des quatre niveaux supérieurs.

Toute évolution de ces limites requiert une décision explicite et une mise à jour coordonnée de la source propriétaire, du référentiel concerné, des données, du validateur et de l'état vérifié.
