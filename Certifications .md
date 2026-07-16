

L’intention du projet "certification" peut être formulée ainsi :

> **Construire un catalogue institutionnel de formations professionnelles, organisé en parcours certifiants, composés de cours réutilisables et de leçons modulaires, avec des adaptations ciblées selon le niveau, le poste et le contexte d’exercice.**

Il ne s’agit donc ni de créer une multitude d’« écoles », ni de dupliquer les formations pour chaque type de fonds.

---

# 1. Architecture pédagogique retenue

La structure centrale doit rester simple :

```text
Domaine
└── Parcours certifiant
    └── Cours
        └── Leçons
            ├── Études de cas
            ├── Exercices
            └── Évaluations
```

Le **domaine** sert uniquement à organiser le catalogue. Il ne constitue pas une couche pédagogique supplémentaire.

Exemples de domaines :

* Capital-risque ;
* Gestion et fonctionnement des fonds ;
* Allocation institutionnelle ;
* Venture philanthropie ;
* Financement des entreprises.

## Le parcours

Le parcours répond à un objectif professionnel clairement défini :

* exercer comme Analyst ;
* évoluer vers Associate ;
* exercer comme Principal ;
* mener un tour d’investissement ;
* gérer les opérations d’un fonds ;
* sélectionner des fonds en tant que LP ;
* analyser et financer une organisation dans le cadre de la venture philanthropie.

Le parcours conduit à une certification déterminée.

## Le cours

Le cours correspond à une compétence professionnelle cohérente :

* Analyse d’une opportunité d’investissement ;
* Due diligence ;
* Structuration d’un investissement ;
* Gestion de portefeuille ;
* Économie d’un fonds ;
* Mesure et gestion de l’impact.

Un cours peut être utilisé dans plusieurs parcours.

Le champ unique `pathId` actuellement présent dans les cours ne convient donc pas à cette relation plusieurs-à-plusieurs. Il faudrait supprimer cette dépendance ou la remplacer par une relation gérée depuis les parcours. 

## La leçon

La leçon est l’unité la plus précise. Elle porte notamment :

* le niveau ;
* les objectifs pédagogiques ;
* le caractère obligatoire ou optionnel ;
* le contexte d’application ;
* les prérequis ;
* l’activité d’évaluation associée.

Un même cours peut ainsi contenir des leçons fondamentales, intermédiaires et avancées.

---

# 2. Règle de décision pour éviter la prolifération des parcours

La distinction suivante doit devenir une règle éditoriale.

| Situation                                                                           | Réponse pédagogique                            |
| ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| Une notion supplémentaire est nécessaire                                            | Ajouter une leçon                              |
| Plusieurs notions liées doivent être approfondies                                   | Ajouter un cours                               |
| La compétence varie selon le stade, le secteur ou le modèle du fonds                | Ajouter des leçons, cas ou cours optionnels    |
| Le métier, la responsabilité finale ou le livrable change                           | Créer un nouveau parcours                      |
| Le niveau augmente, mais l’objectif professionnel reste identique                   | Approfondir les cours, les cas et l’évaluation |
| Le contexte modifie profondément la finalité du capital et les critères de réussite | Créer un parcours autonome                     |

Cette règle justifie l’autonomie de la venture philanthropie, mais évite de créer séparément :

* un parcours Associate pre-seed ;
* un parcours Associate seed ;
* un parcours Associate growth ;
* un parcours Associate lead ;
* un parcours Associate follower.

Ces différences doivent principalement être traitées par des options au sein du parcours Associate.

---

# 3. Adaptation aux différents types de fonds

Le parcours principal définit les compétences propres au poste. Le contexte du fonds détermine les contenus optionnels à sélectionner.

## Exemple : parcours certifiant Associate

### Tronc commun obligatoire

* construction d’une thèse ;
* sourcing ;
* analyse des fondateurs ;
* due diligence ;
* modélisation ;
* structuration ;
* comité d’investissement ;
* exécution ;
* suivi de portefeuille.

### Orientation pre-seed

* évaluation d’une équipe sans historique ;
* analyse qualitative du produit ;
* signaux précoces de product-market fit ;
* BSA AIR, SAFE et instruments convertibles ;
* préparation du prochain tour ;
* gestion d’une information très limitée.

### Orientation seed avec rôle de lead

* définition du plan de due diligence ;
* détermination de l’ownership cible ;
* négociation de la term sheet ;
* syndication ;
* coordination des conseils ;
* gouvernance ;
* préparation du closing.

### Orientation fonds à volume élevé

* gestion structurée du pipeline ;
* scoring ;
* qualité du CRM ;
* automatisation ;
* critères de rejet ;
* rapidité de décision ;
* analyse statistique du portefeuille.

### Orientation growth

* qualité du chiffre d’affaires ;
* analyse des cohorts ;
* prévisions financières ;
* scénarios ;
* valorisation ;
* structure de capital ;
* dette ;
* secondaries ;
* préparation des sorties.

Le certificat peut ensuite préciser l’orientation suivie :

> **Certification Associate en capital-risque — orientation Seed, rôle de lead**

Le diplôme principal reste le même. Le supplément au certificat indique les cours, options et cas spécialisés validés.

---

# 4. Venture philanthropie : un domaine autonome

La venture philanthropie doit être autonome sur quatre plans :

1. **son positionnement dans le catalogue ;**
2. **ses parcours professionnels ;**
3. **ses référentiels de compétences ;**
4. **ses certifications.**

Elle peut néanmoins partager certains cours avec le capital-risque :

* gouvernance ;
* due diligence organisationnelle ;
* accompagnement des dirigeants ;
* gestion de portefeuille ;
* analyse financière ;
* gestion des risques.

Les leçons, études de cas et évaluations doivent cependant être adaptées à ses objectifs propres.

## Parcours essentiels

### 1. Fondamentaux de la venture philanthropie

Public :

* professionnels en découverte ;
* membres de fondations ;
* family offices ;
* acteurs de l’impact ;
* futurs chargés de programme.

Cours principaux :

* Fondements de la venture philanthropie ;
* Continuum des instruments de financement ;
* Typologie des organisations financées ;
* Théorie du changement ;
* Principes de mesure de l’impact ;
* Accompagnement non financier.

Certification :

> **Certificat de connaissances fondamentales en venture philanthropie**

---

### 2. Analyse et financement d’une organisation à impact

Public :

* Analysts ;
* Program Officers ;
* Grant Officers ;
* Investment Associates.

Cours principaux :

* Analyse d’un problème social ou environnemental ;
* Analyse d’une organisation à impact ;
* Due diligence organisationnelle ;
* Analyse financière des structures à impact ;
* Théorie du changement ;
* Mesure et gestion de l’impact ;
* Sélection d’un instrument de financement ;
* Rédaction d’une recommandation.

Certification :

> **Certification professionnelle en analyse et financement d’organisations à impact**

---

### 3. Structuration et gestion d’un portefeuille de venture philanthropie

Public :

* Associates ;
* Investment Managers ;
* Program Managers ;
* responsables de portefeuille.

Cours principaux :

* Construction d’une stratégie d’intervention ;
* Grants et financements non affectés ;
* Recoverable grants ;
* dette concessionnelle ;
* garanties ;
* financement fondé sur des jalons ;
* capacity building ;
* gestion pluriannuelle ;
* suivi d’un portefeuille ;
* stratégie de transition ou de sortie ;
* gouvernance de la relation financeur–organisation.

Certification :

> **Certification professionnelle en structuration et gestion de programmes de venture philanthropie**

---

### 4. Capital catalytique et stratégies de changement systémique

Public :

* Directors ;
* responsables d’investissement ;
* dirigeants de fondations ;
* family offices ;
* responsables de blended finance.

Cours principaux :

* capital catalytique ;
* additionalité ;
* first-loss ;
* garanties ;
* structures de financement mixte ;
* mobilisation d’autres capitaux ;
* gouvernance multi-investisseurs ;
* changement systémique ;
* allocation stratégique ;
* gestion des risques ;
* mesure de la contribution du financeur.

Certification :

> **Certification avancée en capital catalytique et stratégies de changement systémique**

---

# 5. Certification : la complétion ne suffit pas

La validation de tous les contenus obligatoires doit ouvrir l’accès à l’évaluation finale. Elle ne doit pas déclencher automatiquement la certification.

Le processus devrait être :

```text
Complétion des contenus obligatoires
        ↓
Validation des évaluations de cours
        ↓
Remise des livrables obligatoires
        ↓
Évaluation finale du parcours
        ↓
Jury ou validation experte
        ↓
Certification
```

## Conditions minimales

Chaque certification devrait exiger :

* la complétion de 100 % des contenus obligatoires ;
* la réussite des évaluations intermédiaires ;
* la remise de tous les livrables requis ;
* une note minimale à l’évaluation finale ;
* l’absence d’erreur éliminatoire ;
* une validation de l’identité du candidat ;
* le respect des règles de confidentialité et d’intégrité académique.

## Erreurs éliminatoires possibles

* données inventées ;
* sources falsifiées ;
* erreur matérielle de cap table ;
* confusion entre fait et hypothèse ;
* divulgation d’informations confidentielles ;
* plagiat ;
* usage non déclaré ou non vérifié de contenus produits par IA ;
* recommandation incompatible avec les données présentées ;
* erreur juridique ou financière critique non identifiée.

---

# 6. Trois catégories de certifications

Tous les parcours peuvent être certifiants sans prétendre au même niveau de qualification.

## Certificat de connaissances

Pour les parcours fondamentaux ou de découverte.

Exemples :

* Fondamentaux du capital-risque ;
* Fondamentaux de la venture philanthropie ;
* Économie générale d’un fonds.

Évaluation :

* examen de connaissances ;
* analyse courte ;
* seuil de réussite déterminé.

## Certificat de compétence

Pour une capacité technique ciblée.

Exemples :

* Analyse et construction d’une table de capitalisation ;
* Lecture et analyse d’une term sheet ;
* Dimensionnement d’un marché ;
* Construction d’un modèle de fonds ;
* Mesure et gestion de l’impact.

Évaluation :

* cas pratique ;
* livrable ;
* correction selon une grille formalisée.

## Certification professionnelle

Pour les parcours liés à un poste ou à une responsabilité complète.

Exemples :

* Analyst en capital-risque ;
* Associate en capital-risque ;
* Principal en capital-risque ;
* Responsable des opérations d’un fonds ;
* Analyste de fonds côté LP ;
* Responsable de programme en venture philanthropie.

Évaluation :

* dossier complet ;
* étude de cas ;
* soutenance orale ;
* simulation professionnelle ;
* évaluation par un jury qualifié.

Cette distinction protège la crédibilité du projet. Un parcours d’une heure peut produire un certificat évalué, mais il ne doit pas être présenté comme équivalent à une certification professionnelle Analyst.

---

# 7. Évaluation finale par niveau

## Analyst

Évaluation finale :

* analyse d’une entreprise ;
* market sizing ;
* modèle de trésorerie ;
* table de capitalisation ;
* recommandation d’investissement ;
* memo ;
* soutenance devant un comité simulé.

## Associate

Évaluation finale :

* construction d’un plan de due diligence ;
* analyse des fondateurs ;
* appels clients ou experts simulés ;
* modèle financier ;
* structuration ;
* term sheet ;
* memo complet ;
* défense devant un comité ;
* négociation simulée.

## Principal

Évaluation finale :

* thèse propriétaire ;
* stratégie de sourcing ;
* décision d’investissement ;
* construction de portefeuille ;
* plan de réserves ;
* simulation de comité ;
* simulation de board ;
* arbitrage de follow-on ;
* situation de crise ;
* présentation à des LP.

## Venture philanthropie

Évaluation finale selon le niveau :

* analyse d’une organisation ;
* théorie du changement ;
* choix de l’instrument ;
* plan de financement ;
* cadre de mesure de l’impact ;
* stratégie d’accompagnement ;
* arbitrage de portefeuille ;
* soutenance devant un comité de financement.

---

# 8. Ton institutionnel : règle applicable à tous les contenus

Le ton institutionnel doit être appliqué à :

* titres de parcours ;
* titres de cours ;
* titres de leçons ;
* descriptions ;
* accroches ;
* études de cas ;
* exercices ;
* certifications ;
* pages commerciales ;
* interfaces.

Le projet contient actuellement des intitulés tels que « Le VC sans bullshit » et une accroche centrée sur la mort de neuf start-up sur dix.  Ce positionnement doit être remplacé.

## Exemples de normalisation

| Intitulé actuel                           | Intitulé recommandé                                               |
| ----------------------------------------- | ----------------------------------------------------------------- |
| Le VC sans bullshit                       | Fondamentaux du capital-risque                                    |
| Une semaine dans la peau d’un VC          | Organisation du travail dans un fonds de capital-risque           |
| Réussir l’entretien Analyst               | Préparation au recrutement d’un Analyst en capital-risque         |
| Lire une cap table sans paniquer          | Analyse et construction d’une table de capitalisation             |
| Le carry, enfin clair                     | Carried interest et économie d’un fonds                           |
| La valo flatteuse qui appauvrit           | Étude de cas : valorisation et préférences de liquidation         |
| Le café-réseau quand on n’a pas de réseau | Développement d’un réseau professionnel dans le capital-risque    |
| 9 startups sur 10 vont mourir             | Loi de puissance et distribution des rendements                   |
| Le vrai job et les mythes                 | Fonctions et responsabilités des professionnels du capital-risque |

Le ton peut rester accessible, mais jamais familier, provocateur ou promotionnel.

---

# 9. Modèle de données recommandé

Le parcours doit décider quels éléments d’un cours sont obligatoires ou optionnels.

```json
{
  "id": "path-associate-vc",
  "title": "Certification professionnelle Associate en capital-risque",
  "domainId": "venture-capital",
  "certificateType": "professional",
  "targetRoles": ["associate"],
  "requiredCourses": [
    {
      "courseId": "course-due-diligence",
      "requiredLessonIds": [
        "dd-objectives",
        "dd-commercial",
        "dd-team",
        "dd-product",
        "dd-legal",
        "dd-synthesis"
      ],
      "optionalLessonGroups": [
        {
          "id": "fund-stage-orientation",
          "minimumRequired": 1,
          "lessonIds": [
            "dd-preseed",
            "dd-seed",
            "dd-growth"
          ]
        }
      ],
      "assessmentVariantId": "associate-dd"
    }
  ],
  "finalAssessment": {
    "id": "associate-capstone",
    "type": "case-and-oral-defense",
    "rubricId": "rubric-associate",
    "passingScore": 70,
    "criticalCriteriaMustPass": true,
    "evaluatorTypes": ["expert", "jury"]
  }
}
```

La leçon doit porter ses propres métadonnées :

```json
{
  "id": "dd-growth",
  "title": "Due diligence d’une entreprise en phase de croissance",
  "level": "advanced",
  "contexts": {
    "fundStages": ["growth", "late-stage"],
    "dealRoles": ["lead", "co-lead"],
    "sectors": ["general"]
  },
  "optional": true,
  "learningOutcomes": [
    "Évaluer la qualité du chiffre d’affaires",
    "Analyser les cohorts et les prévisions",
    "Identifier les besoins de financement futurs"
  ]
}
```

---

# Décision de conception désormais stabilisée

Le projet repose donc sur les principes suivants :

1. **La venture philanthropie constitue un domaine autonome.**
2. **Chaque parcours conduit à une certification évaluée.**
3. **Toutes les dénominations et communications adoptent un ton institutionnel.**
4. **Les cours sont réutilisables entre plusieurs parcours.**
5. **Les leçons portent le niveau et le contexte d’application.**
6. **Les différences entre fonds sont traitées par des options, des cas et des évaluations adaptées.**
7. **Un nouveau parcours n’est créé que lorsque l’objectif professionnel ou la responsabilité finale change.**
8. **La certification atteste une compétence démontrée, et non la simple consommation de contenus.**

**certifications internes délivrées par la plateforme**