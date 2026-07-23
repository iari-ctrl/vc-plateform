# Protocole de production — VC Analyst

> [!IMPORTANT]
> **Règle de travail.** Ce protocole encadre la production future des épreuves professionnelles Analyst. Il n'autorise pas la production du fonds, de la bible du cas ou de M1 dans le lot actuel.

Le protocole combine une conception à rebours par compétences et preuves avec une production verticale par situation professionnelle. Le [référentiel Analyst](REFERENTIEL-ANALYST.md) fixe les compétences ; le présent document fixe l'ordre de production et les contrôles.

## 1. Principes

- partir de la responsabilité et de la preuve attendue, jamais d'un volume de cours à remplir ;
- réutiliser les leçons, cas, simulateurs et mémos existants par identifiant ;
- valider un squelette avant toute prose longue ;
- produire une unité bornée à la fois ;
- distinguer structure, rédaction, vérification factuelle et validation éditoriale ;
- traiter les variantes comme des écarts au socle commun ;
- ne créer une leçon que si une épreuve révèle un manque de préparation vérifié ;
- enregistrer chaque décision de cadrage dans la source maintenue concernée.

## 2. Séquence hybride

La séquence obligatoire est :

```text
1. Document du fonds
2. Squelette du cas et registre de preuves
3. M1 complète et contrôlée de bout en bout
4. Production et contrôles par blocs
```

Cette séquence remplace l'approche consistant à écrire une bible complète avant d'avoir testé une première mission. Le squelette préserve la cohérence du cas ; M1 vérifie le dispositif sur une tranche courte ; les blocs suivants densifient ensuite les informations seulement lorsqu'elles sont nécessaires.

### 2.1 Document du fonds

Le document du fonds fixe uniquement les paramètres nécessaires aux décisions du cas : stratégie, taille, stade, tickets, ownership cible, réserves, rythme de déploiement, gouvernance de la décision et limites du mandat. Chaque paramètre doit avoir une conséquence possible dans une mission.

Porte de contrôle : les informations sont cohérentes entre elles, suffisantes pour qualifier une opportunité et exemptes de détails sans usage pédagogique identifié.

### 2.2 Squelette du cas et registre de preuves

Le squelette décrit la chronologie, les acteurs, les jeux de données attendus, les contradictions prévues, les informations révélées à chaque étape et les dépendances entre missions. Il n'est pas une bible rédigée.

Le registre de preuves définit dès ce stade la classification commune : fait vérifié, déclaration, hypothèse, inférence et incertitude. Il associe chaque affirmation matérielle à une source, une date, un périmètre et un statut de contrôle.

Porte de contrôle : chaque compétence Analyst possède au moins une preuve prévue ; aucune mission ne dépend d'une information révélée plus tard ; les données nécessaires peuvent être produites sans contradiction involontaire.

### 2.3 M1 complète

M1 constitue la première tranche testable : situation, pièces, consigne, gabarit, registre de preuves, grille, corrigé et contrôles. Elle est relue avant toute extension du cas.

Porte de contrôle : un candidat dispose de toutes les informations nécessaires ; le livrable est réaliste ; la grille distingue les niveaux de qualité ; le corrigé applique la même information que la consigne ; aucune compétence ou erreur critique n'est évaluée implicitement.

La présente documentation ne produit ni la situation, ni les pièces, ni le corrigé de M1.

### 2.4 Production par blocs

Après validation de M1, les missions suivantes sont regroupées en blocs cohérents pour limiter les incohérences :

| Bloc de contrôle | Objets examinés |
| --- | --- |
| Analyse | Marché, équipe, produit, traction et registre de preuves |
| Modélisation | Trésorerie, structure de capital, dilution, waterfall et rendement |
| Diligence et recommandation | Questions prioritaires, risques, mémo et traitement des objections |
| Suivi | Écarts au plan, runway, réserves et recommandation de réinvestissement |

Ces blocs sont des portes de contrôle, pas des cours ni des titres. Leur découpage pourra être ajusté avant production si le référentiel montre une dépendance différente, sans modifier les compétences attendues.

## 3. Contrôles applicables à chaque unité

Chaque mission, pièce, grille ou corrigé passe successivement par quatre contrôles.

### Structure

- compétence et preuve identifiées ;
- entrées et sortie attendue bornées ;
- prérequis affichés mais non bloquants ;
- longueur maximale fixée ;
- renvois aux contenus existants par identifiant.

### Vérification technique et factuelle

- calculs reproduits dans un environnement déterministe ;
- définitions, périodes, unités et arrondis explicites ;
- cohérence entre documents du cas ;
- cadre juridique ou pratique de place correctement qualifié ;
- sources datées et vérifiables, ou origine fictive clairement signalée.

### Évaluation

- trois à cinq critères observables par compétence ;
- barème réconcilié avec le total attendu ;
- erreurs critiques séparées du score ;
- corrigé compatible avec plusieurs raisonnements recevables lorsque la situation comporte une incertitude ;
- absence d'information nécessaire uniquement présente dans le corrigé.

### Validation éditoriale

- ton correct, sobre, factuel et institutionnel ;
- distinction entre fait, hypothèse et interprétation ;
- consignes sans ambiguïté inutile ;
- absence de promesse professionnelle non délivrable ;
- cohérence terminologique avec l'architecture transverse.

Un bloc n'est étendu qu'après résolution des écarts matériels relevés par ces contrôles.

## 4. Leçons contextuelles candidates

Les leçons suivantes restent candidates :

- Seed : `l-stage-seed-commercial`, `l-stage-seed-financing` ;
- fonds lead : `l-role-lead-dd`, `l-role-lead-closing` ;
- SaaS : `l-specialty-saas-metrics`, `l-specialty-saas-gtm`.

Leur existence dans le registre ne vaut pas décision de rédaction. Une leçon n'est produite que si un contrôle de mission établit simultanément qu'une préparation manque, qu'aucun contenu existant ne la couvre et que la compétence relève bien du niveau Analyst. Les options Lead doivent rester dans une posture d'analyse ; la conduite de la négociation ou du closing relève des niveaux supérieurs.

## 5. Mesure de la charge

Les **40 heures** constituent une hypothèse interne de conception pour l'ensemble des futures productions Analyst. La mesure doit distinguer :

- lecture et compréhension des pièces ;
- recherche et vérification ;
- calcul et modélisation ;
- rédaction du livrable ;
- contrôle et révision.

La durée observée, sa dispersion et les causes d'écart sont consignées lors des tests à blanc. Aucune durée ne doit être publiée avant cette mesure. Une durée constatée ne modifie pas à elle seule le référentiel de compétences.

## 6. Hors périmètre actuel

Le protocole ne produit pas et n'engage pas :

- le document du fonds ;
- la bible ou les pièces du cas ;
- M1 ou une autre mission ;
- les six leçons candidates ;
- un export de portfolio ;
- une délivrance humaine ou un registre ;
- une migration des axes de contextualisation.
