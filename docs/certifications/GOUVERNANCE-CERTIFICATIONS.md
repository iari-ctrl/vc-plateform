# Gouvernance future des certifications professionnelles

> [!CAUTION]
> **Cadre inactif.** Ce document conserve uniquement les invariants nécessaires à une éventuelle délivrance humaine future. Il ne décrit ni un service ouvert, ni une procédure actuellement disponible, ni un calendrier de mise en œuvre.

La [source transverse](ARCHITECTURE-CERTIFICATIONS.md) distingue les résultats locaux des titres professionnels. Dans l'état actuel, aucun score, progression, livrable ou résultat enregistré dans le navigateur ne délivre le titre `VC Analyst`.

## 1. Invariants d'une délivrance future

Une décision de délivrance professionnelle ne pourrait intervenir que si les conditions suivantes étaient réunies :

- l'identité du candidat est vérifiée selon une procédure approuvée ;
- la version du référentiel, de l'évaluation et de la charte du candidat est figée pour la session ;
- le candidat accepte la charte applicable et déclare les outils utilisés ;
- les preuves obligatoires sont remises dans un format permettant leur revue ;
- un évaluateur qualifié ou un jury applique une grille versionnée ;
- toute erreur critique applicable est traitée comme non compensable ;
- la décision, sa date, son périmètre et les versions utilisées sont inscrits dans un registre d'émission ;
- le titre canonique et son éventuel supplément contextualisé sont produits séparément.

Ces invariants ne préjugent ni de l'organisation du jury, ni du fournisseur de contrôle d'identité, ni du support technique, ni des délais de recours.

## 2. Séparation des rôles

Le candidat demeure responsable de l'authenticité des travaux, des sources, des calculs, de la confidentialité et des outils déclarés. L'évaluateur apprécie les preuves au regard du référentiel ; il ne corrige pas le dossier à la place du candidat. L'autorité de délivrance constate la décision et tient le registre ; elle ne déduit jamais le titre d'une seule progression locale.

Une même personne peut cumuler des rôles dans un dispositif futur de petite taille uniquement si les conflits sont déclarés et si la décision reste traçable. Aucun modèle d'organisation plus précis n'est arrêté à ce stade.

## 3. Erreurs critiques

Une erreur critique n'est pas compensée par le total des autres critères. Le référentiel du niveau détermine la liste applicable. Elle peut notamment couvrir :

- des données ou sources fabriquées ou falsifiées ;
- une erreur matérielle de table de capitalisation ou de calcul financier qui modifie la décision ;
- une confusion non signalée entre fait, déclaration, hypothèse et inférence ;
- une violation de confidentialité ;
- un plagiat ;
- un usage d'intelligence artificielle non déclaré ou non vérifié ;
- une recommandation incompatible avec les éléments présentés ;
- un risque juridique ou financier critique omis malgré les informations disponibles.

Les modalités de remédiation, de nouvelle présentation et de recours ne sont pas définies dans le présent lot.

## 4. Versions et trace minimale

Une session future devrait au minimum conserver :

- l'identifiant du candidat vérifié ;
- l'identifiant de la certification ;
- les versions du référentiel, de l'évaluation et de la charte ;
- la déclaration d'outils ;
- les preuves remises et leur empreinte ou référence stable ;
- la décision, la date et l'identité de l'autorité de validation ;
- les mentions structurées du supplément contextualisé, le cas échéant.

Cette trace ne doit pas être simulée dans `localStorage`. Les obligations de sécurité, de protection des données, de conservation et d'accès devront être définies avant toute activation.

## 5. Annexe de session inactive

`data/candidateCharters.json` peut conserver le schéma d'une annexe de session future afin de versionner les champs nécessaires sans les rendre actifs. Tant que la gouvernance humaine n'est pas ouverte :

- aucune annexe n'est présentée comme un contrat de session effectif ;
- aucune identité n'est collectée pour délivrer un titre ;
- aucun registre d'émission n'est créé ;
- aucune promesse de correction, de jury ou de recours n'est publiée.

## 6. Conditions préalables à une activation

L'activation demanderait une décision produit explicite, une base juridique et opérationnelle documentée, des responsabilités nommées, un stockage adapté, une procédure de sécurité, une politique de conservation et un test à blanc de la chaîne complète. Ces travaux restent hors périmètre.
