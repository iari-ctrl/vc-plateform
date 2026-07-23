# Dossier de relecture praticien — parcours Foundations

> **Statut au 2026-07-23 : préparation à la revue.** Aucun praticien n’a encore examiné ni validé ce dossier. Les éléments ci-dessous décrivent l’état local vérifié, les points qui appellent un jugement professionnel et les règles de traitement d’un futur retour.

## 1. Objet et mode d’emploi

La relecture porte sur deux formations ouvertes :

- `p-analyst-foundations` — Fondamentaux de l’analyse en capital-risque ;
- `p-venture-philanthropy-foundations` — Fondamentaux de la venture philanthropie.

Elle doit apprécier la proportionnalité du périmètre, l’ordre pédagogique, les hypothèses de travail, les décisions proposées et les limites d’escalade. Elle ne vise ni à délivrer une certification, ni à rendre un avis appliqué à un dossier réel.

Pour chaque question, le praticien est invité à préciser :

1. sa décision : conserver, corriger, compléter, retirer ou faire qualifier ;
2. sa justification ;
3. la source, la pratique ou le cadre professionnel mobilisé ;
4. son niveau de confiance ;
5. la modification éventuellement requise ;
6. les limites de son avis.

Les données exécutables prévalent sur les documents de conception historiques. Les principaux contrats maintenus sont `PRODUCT.md`, `docs/parcours/README.md`, `docs/parcours/ANALYST-FOUNDATIONS.md` et `docs/parcours/VENTURE-PHILANTHROPIE.md`.

## 2. Invariants à ne pas rouvrir pendant la revue

| Invariant | État vérifié | Preuve maintenue |
| --- | --- | --- |
| Path et Parcours désignent une même trajectoire ordonnée. | Confirmé | `docs/parcours/README.md`, § Nomenclature |
| La progression conseille un ordre sans verrouiller les contenus. | Confirmé | `PRODUCT.md`, principes 2 et 6 ; `docs/parcours/README.md`, § Contrat actuel |
| Les deux parcours Foundations sont des formations ouvertes. | Confirmé | `docs/parcours/ANALYST-FOUNDATIONS.md:6-12` ; `docs/parcours/VENTURE-PHILANTHROPIE.md:6-14` |
| Aucun score global, résultat, badge, attestation, titre professionnel ou habilitation n’est délivré. | Confirmé | Référentiels maintenus et données exécutables ; aucune évaluation de certification active |
| `VC Analyst` reste une certification distincte, publiée comme « en construction ». | Confirmé | `docs/certifications/REFERENTIEL-VC-ANALYST.md:3-12` |
| Les brouillons, autoévaluations et déclarations de revue restent locaux et facultatifs. | Confirmé | `docs/parcours/README.md:13-16` |
| Une revue externe ne devient pas une preuve de compétence professionnelle. | Confirmé | `docs/parcours/VENTURE-PHILANTHROPIE.md:45-51` |
| Le choix local `practitioner` déclare un mode de retour hors plateforme ; il ne conserve ni identité, ni preuve de la revue. | Confirmé | `client/src/pages/intelligence/DeliverablePage.tsx:386-397` |

La revue ne doit donc pas proposer de verrou de progression, de score synthétique ni de mécanisme de délivrance.

Les 24 parcours n’ont pas de champ de statut comparable au prédicat fail-closed des leçons ou certifications. Le caractère ouvert des deux parcours Foundations est porté par leurs référentiels et leur présence dans le catalogue exécutable. Cette asymétrie de contrat relève d’un éventuel chantier de publication, pas du jugement du praticien ; le présent lot ne crée pas de nouveau statut.

Les deux référentiels n’énumèrent pas exactement les mêmes signes de délivrance exclus : Analyst omet le mot « attestation », tandis que Venture philanthropie omet « badge » et « attestation ». Le présent dossier applique l’invariant transversal complet — aucun score global, résultat, certificat, badge, attestation, titre ou habilitation — sans modifier les référentiels dans ce lot.

## 3. Analyst Foundations

### 3.1 Fiche d’identité vérifiée

| Élément | État observé |
| --- | --- |
| ID et route | `p-analyst-foundations` · `/parcours/analyst-foundations` |
| Niveau | Débutant |
| Répartition des leçons | 9 leçons `debutant`, 14 leçons `intermediaire` |
| Composition | 7 séquences, 6 cours et la leçon autonome `l-fact-hypothesis` |
| Leçons | 23 leçons uniques, toutes publiées |
| Lecture brute | 142 minutes, somme des `readMin` des 23 leçons |
| Budget en tête du parcours | `coreHours: 2.4`, soit 144 minutes après conversion applicative |
| Durées des étapes | 318 minutes en additionnant les six `durationMin` de cours et la lecture de la leçon autonome |
| Applications | 23 sections « Mise en application », sans champ `practice`, cas, livrable ni jalon propre au parcours |
| Quiz | 92 questions formatives, soit 4 par leçon ; aucun résultat de parcours |
| Calibration temporelle | 7 étapes visibles en modes `low`, `medium` et `high`, car elles sont toutes de type `coeur` |
| Aiguillage | `recommendedForProfiles` vide et aucune recommandation depuis `profileParcours.json` |
| Certification liée | Aucune ; `VC Analyst` reste un cadre professionnel distinct |

Le décalage de deux minutes entre la somme brute des leçons et `coreHours: 2.4` relève de l’arrondi. L’écart principal est plus large : les durées des six cours appliquent la convention maintenue `readMin + 8 minutes` par leçon, alors que le budget du parcours reste voisin de la seule lecture. Ces cours totalisent 311 minutes ; avec les 7 minutes de `l-fact-hypothesis`, les étapes affichent 318 minutes. Si les 8 minutes d’application sont aussi comptées pour cette leçon autonome, le minimum cohérent avec la convention existante atteint 326 minutes. Le budget de 144 minutes sous-déclare donc les applications demandées et doit être réconcilié dans un lot produit distinct.

### 3.2 Ordre exécuté

1. `c-what-is-vc` — 3 leçons ;
2. `c-ecosystem` — 2 leçons ;
3. `c-vc-job` — 3 leçons ;
4. `c-deal-flow` — 3 leçons ;
5. `c-mathematiques-vc` — 7 leçons ;
6. `l-fact-hypothesis` — 1 leçon ;
7. `c-professional-integrity` — 4 leçons.

Les prérequis des 23 leçons restent internes à cet ensemble. `l-fact-hypothesis` intervient après les calculs fondamentaux et précède les quatre leçons d’intégrité professionnelle. La préparation recommandée de `VC Analyst` comprend douze autres leçons publiées et non bloquantes ; elle ne fait pas partie de ce parcours.

### 3.3 Constats établis

| Constat | Qualification | Preuve |
| --- | --- | --- |
| Les sept séquences et les 23 leçons sont alignées entre référentiel et JSON. | Confirmé | `docs/parcours/ANALYST-FOUNDATIONS.md:14-29` ; test `Parcours Analyst Foundations` |
| Le cours de recommandation ne contribue que par `l-fact-hypothesis`. | Confirmé | `data/parcours.json`, `p-analyst-foundations` |
| Le parcours est classé débutant alors que 14 de ses 23 leçons portent le niveau intermédiaire. | Point à apprécier | `data/parcours.json` et `data/lessons.json` |
| Aucun cas, livrable ou jalon autonome n’est attaché au parcours, mais chaque leçon contient une mise en application non structurée. | Confirmé | Référentiel, § Cas pratique et livrable ; 23 sections dans `data/lessons.json` |
| Le parcours ne contient aucun identifiant d’évaluation. | Confirmé | `client/src/content/parcours.test.ts:213-232` |
| La déclaration « leçon lue » reste indépendante du quiz et de la mise en application. | Confirmé | `client/src/pages/learn/LessonPage.tsx:240-284` |
| La capacité à conduire seul une diligence ou à produire une recommandation exploitable n’est pas revendiquée. | Confirmé | `docs/parcours/ANALYST-FOUNDATIONS.md:8-12` |
| Le budget de 2,4 h couvre approximativement la lecture, mais pas les 23 applications pourtant intégrées aux durées des cours. | Incohérence technique certaine | `data/parcours.json`; `data/courses.json`; `client/src/content/certifications.test.ts:192-203` |
| Le sélecteur de charge ne change aucune étape du parcours : les trois budgets exposent les mêmes 7 séquences. | Incohérence fonctionnelle certaine | `data/parcours.json`; `data/profileParcours.json:55-58`; `client/src/content/parcours.ts:36-40` |
| Aucun profil d’aiguillage, y compris `futur-analyste`, ne recommande ce parcours pourtant destiné aux candidats et Analysts débutants. | Décision produit à instruire | `data/parcours.json`; `data/profileParcours.json:3-39` |

Aucune incohérence pédagogique certaine n’est prononcée sans retour professionnel. La décision d’utiliser des applications intégrées plutôt qu’un cas longitudinal reste éditoriale ; leur omission du budget du parcours est, elle, un écart de comptage établi.

### 3.4 Questions au praticien

1. Les sept séquences couvrent-elles un socle débutant cohérent sans attribuer à l’apprenant une autonomie supérieure à celle d’un Analyst encadré ?
2. La place relative des sept leçons de mathématiques est-elle proportionnée au reste du socle, notamment au screening, au pipeline et à l’analyse qualitative ?
3. `l-fact-hypothesis` doit-elle rester après l’ensemble des calculs ou intervenir plus tôt pour structurer la lecture des données dès le sourcing ?
4. Les quatre leçons d’intégrité professionnelle couvrent-elles les limites nécessaires sur confidentialité, conflits, données et usage déclaré de l’IA ?
5. Les formulations relatives aux calculs, usages de place et responsabilités distinguent-elles suffisamment méthode pédagogique et pratique professionnelle contextualisée ?
6. Les 23 mises en application intégrées suffisent-elles pour un parcours « Fondamentaux », ou leur portée, leur durée et leurs critères devraient-ils être davantage structurés sans créer une évaluation implicite ?
7. Les prérequis internes et l’ordre des 23 leçons correspondent-ils aux dépendances observées dans le travail réel d’un Analyst débutant ?
8. La frontière entre les 23 leçons Foundations et les douze leçons de préparation recommandée à `VC Analyst` est-elle compréhensible et professionnellement pertinente ?
9. Le niveau « débutant », les 14 leçons classées intermédiaires et une charge minimale de 318 à 326 minutes selon la convention d’application sont-ils cohérents avec le public annoncé ?
10. Quelles formulations ou notions exigent une vérification périodique parce qu’elles dépendent d’une pratique de place, d’un mandat ou d’un cadre applicable ?

## 4. Venture philanthropie et Trait d’Union

### 4.1 Fiche d’identité vérifiée

| Élément | État observé |
| --- | --- |
| ID et route | `p-venture-philanthropy-foundations` · `/parcours/venture-philanthropy-foundations` |
| Niveau | Intermédiaire |
| Composition | 14 étapes : 12 requises et 2 bonus |
| Cours et leçons | 6 cours, 21 leçons uniques, toutes publiées |
| Diagnostic | `diag-vp-entree`, facultatif, 5 situations, sans résultat agrégé |
| Dossier longitudinal | `cs-vp-insertion-3-regions` — Trait d’Union |
| Contributions guidées | 21 contributions, 1 350 minutes |
| Consolidations | 3 exercices cumulatifs, 240 minutes |
| Jalon | `vp-recommandation-soutien`, 360 minutes, 13 critères sans score |
| Options | Atelier financeur 60 min, cas de transfert 120 min, revue externe 60 min |
| Correction | `corr-vp-trait-union`, révélation volontaire après première version déclarée |

### 4.2 Charge recalculée

| Composante | Minutes | Traitement actuel |
| --- | ---: | --- |
| Lecture des 21 leçons | 111 | Incluse dans `readingMinutes` |
| Contributions guidées des leçons | 1 350 | Incluse dans la production |
| Trois consolidations | 240 | Incluse dans la production |
| Jalon final | 360 | Inclus dans la production |
| Fiche d’escalade `vp-fiche-escalade-juridique` | 30 | **Étape cœur non incluse dans le résumé de production** |
| Atelier financeur | 60 | Optionnel |
| Cas Énergie des Vallées | 120 | Optionnel |
| Revue externe | 60 | Optionnelle |

Les 1 350 minutes de contributions guidées se répartissent ainsi :

| Bloc | Minutes |
| --- | ---: |
| Mandat et triage | 75 |
| Problème et preuves | 150 |
| Diligence organisationnelle | 210 |
| Diligence financière | 390 |
| Structuration du financement | 270 |
| Partenariat, suivi et sortie | 255 |

La documentation annonce 32 h 30 de production, soit 1 950 minutes : contributions, consolidations et jalon. Ce calcul est exact pour ces trois catégories. La fiche d’escalade est cependant une étape `coeur` dotée de `estimatedWorkMinutes: 30`, alors que `parcoursTimeSummary` ne comptabilise qu’un exercice cumulatif, un capstone ou une étape bonus (`client/src/content/learningTime.ts:60-73`). Cette demi-heure constitue une incohérence certaine du résumé de charge. Elle doit être corrigée dans un lot technique séparé après décision sur le traitement attendu des worksheets.

Les 111 minutes correspondent uniquement aux leçons. Les étapes requises ajoutent 67 minutes de `readMin` sur le dossier et les consignes du parcours, soit 178 minutes si ces lectures sont additionnées. La correction révélée et les étapes bonus restent hors de ce second total. L’interface n’agrège actuellement que les 111 minutes des leçons ; il faut donc décider si ce libellé doit expliciter son périmètre ou inclure l’ensemble des lectures requises. Cette question de comptage ne préjuge pas du temps que le praticien jugera réaliste.

### 4.3 Carte de Trait d’Union

Le dossier `cs-vp-insertion-3-regions` est une association fictive sollicitant 1,2 M€ sur trois ans pour une réplication dans trois régions. Il contient treize catégories de pièces :

1. comptes de résultat ;
2. bilans ;
3. balance et rapprochement bancaire ;
4. échéancier de trésorerie à treize semaines ;
5. budget mensuel à dix-huit mois ;
6. fonds affectés ou dédiés ;
7. conventions et lettres de cofinancement ;
8. procès-verbaux du conseil ;
9. organisation et équipe ;
10. entretiens anonymisés ;
11. cohortes ;
12. dictionnaire des indicateurs ;
13. incidents et risques.

Les montants financiers sont fictifs et exprimés en milliers d’euros. Les éléments structurants donnés à l’apprenant comprennent notamment :

- 2,40 M€ de ressources et 2,36 M€ de charges en 2025 ;
- 390 k€ en banque, 250 k€ de fonds affectés ou dédiés et 210 k€ de réserves libres ;
- un besoin incrémental déclaré de 1,65 M€ sur trois ans ;
- une demande de 1,2 M€, 450 k€ de cofinancements supposés et 150 k€ d’accompagnement ;
- des dates de versement et d’ouverture contradictoires ;
- des encaissements non tous signés ;
- un rapprochement bancaire incomplet ;
- 960 entrées dans l’export contre 982 dans le tableau présenté au conseil ;
- 710 personnes jointes à six mois, sans analyse des non-répondants ni comparaison ;
- des signaux de safeguarding, de données et de conflits sans clôture complète documentée.

L’échéancier possède quatorze lignes de flux et permet d’établir un horizon de treize semaines sous hypothèses explicites. Son calcul nominal ouvre à 390 k€, ajoute 625 k€ d’encaissements, retranche 692 k€ de décaissements et clôt à 323 k€, avec un point bas de 228 k€ le 30 janvier. Lorsque les trois encaissements insuffisamment sécurisés de 180 k€, 60 k€ et 240 k€ sont retirés à titre de stress, la clôture devient −157 k€. Ces chiffres décrivent le tableau ; ils ne constituent pas une recommandation.

Le budget mensuel comporte dix-huit lignes, de janvier 2026 à juin 2027, mais sa propre note place la troisième ouverture en juillet 2027. Le modèle s’arrête donc avant l’événement qu’il est censé éclairer. Il totalise 3,655 M€ d’encaissements et 6,269 M€ de décaissements, soit un flux net nominal de −2,614 M€ ; avec un solde d’ouverture illustratif de 390 k€, la clôture serait de −2,224 M€. Le dossier n’explicite pas le raccord entre ce déficit brut, le besoin incrémental annoncé de 1,65 M€, la demande de 1,2 M€ et les 450 k€ de cofinancement supposés. Cette absence de réconciliation est une question financière structurante, pas une erreur déclarée sans revue du périmètre des flux.

Le texte du cas affirme aussi que « les tables et le classeur » permettent les calculs. Or `cs-vp-insertion-3-regions` ne contient aucun téléchargement et aucun fichier `.xlsx` n’est présent dans `client/public`. Le classeur annoncé est absent. Le produire reste hors du présent lot, mais le dossier de revue doit signaler cette limite au praticien plutôt que supposer l’artefact disponible.

### 4.4 Décisions alternatives exposées après production

`corr-vp-trait-union` présente quatre branches proposées sous conditions :

1. soutien phasé sur une première ouverture ;
2. report avec travaux préparatoires bornés ;
3. refus motivé de la demande actuelle ;
4. composante remboursable conditionnelle et limitée.

Chaque branche explicite hypothèses, arbitrages, limites des preuves et informations manquantes. La correction ne désigne pas une réponse unique et ne doit pas être accessible avant la déclaration volontaire d’une première version du jalon.

### 4.5 Questions au praticien

#### Finance et instruments

1. Les tables seules, sans le classeur annoncé, suffisent-elles à conduire une revue professionnelle des hypothèses et des contrôles, ou faut-il différer cette partie jusqu’à production d’un modèle recalculable ?
2. Quel solde d’ouverture doit être retenu après traitement du relevé à 372 k€, du virement de 30 k€, des chèques non débités de −12 k€ et du compte secondaire de 8 k€, puis comment isoler les 250 k€ de fonds affectés ?
3. Quel périmètre de flux explique le déficit brut de 2,614 M€ par rapport au besoin incrémental de 1,65 M€, et comment prolonger puis réconcilier le modèle au-delà de la troisième ouverture de juillet 2027 ?
4. Les quatre branches de décision couvrent-elles un éventail réaliste et proportionné, sans présenter une composante remboursable comme disponible avant qualification de l’entité, des flux et du contrat ?
5. Les 240 minutes de consolidation et les 30 minutes de fiche d’escalade représentent-elles un travail réellement additionnel aux contributions guidées, sans double comptage, et la charge demeure-t-elle réaliste pour le niveau intermédiaire annoncé ?

#### Impact et personnes concernées

6. Le dossier distingue-t-il correctement résultat observé, contribution, causalité et attribution lorsque 510 résultats positifs représentent 71,8 % des 710 personnes suivies, mais 53,1 % des 960 entrées, avec 250 personnes sans suivi exploitable ?
7. Les modalités proposées pour associer les personnes concernées couvrent-elles accessibilité, frais, restitution, droit de réponse et réclamation de manière proportionnée ?
8. Les indicateurs et seuils de remédiation permettent-ils une décision de suivi sans transformer la mesure en reporting excessif ou en contrôle du financeur ?

#### Gouvernance et capacité d’exécution

9. Les pièces permettent-elles d’apprécier les pouvoirs, délégations, conflits et autorisations nécessaires sans demander à l’apprenant de produire lui-même une qualification juridique ?
10. Les hypothèses de réplication rendent-elles visibles les contraintes de supervision, le turnover, les systèmes de données et l’absence initiale de direction des opérations ?
11. Le plan d’accompagnement et la stratégie de transition limitent-ils suffisamment la dépendance à l’égard du financeur et les effets d’une sortie sur les personnes accompagnées ?

#### Escalades professionnelles

12. Quels sujets relatifs à la forme associative, aux instruments remboursables, à la fiscalité et aux fonds affectés doivent obligatoirement être transmis à un juriste, fiscaliste ou expert-comptable avant recommandation ?
13. La fiche `vp-fiche-escalade-juridique` délimite-t-elle correctement identification, protection de l’information et transmission, sans inciter l’apprenant à conduire une enquête ou à rendre un avis ?
14. Les signaux de safeguarding, de fraude, de données personnelles ou de conflit d’intérêts sont-ils présentés avec des mesures conservatoires et des autorités de saisine adaptées, sans collecte individuelle injustifiée ?
15. Les sujets d’aides publiques, de sanctions ou de lutte contre le blanchiment sont-ils proportionnés au cas, ou certains devraient-ils être réservés à une ressource de référence plutôt qu’au parcours principal ?

## 5. Points à traiter avant toute modification pédagogique

| Point | Qualification P0 | Responsable de la décision |
| --- | --- | --- |
| Budget Analyst de 144 minutes contre 318 à 326 minutes selon les durées et applications maintenues | Incohérence technique certaine | Produit / ingénierie pédagogique |
| Modes `low`, `medium` et `high` sans effet sur les 7 étapes Analyst | Incohérence fonctionnelle certaine | Produit |
| Analyst Foundations absent de l’aiguillage des profils | Décision produit | Produit / ingénierie pédagogique |
| Fiche d’escalade de 30 minutes absente du résumé de production | Incohérence technique certaine | Produit / ingénierie pédagogique |
| 67 minutes de lecture requises hors leçons, absentes du compteur de lecture | Clarification de périmètre | Produit / ingénierie pédagogique |
| Classeur annoncé dans Trait d’Union mais absent des données et fichiers publics | Incohérence documentaire certaine | Produit / outillage pédagogique |
| Modèle à 18 mois arrêté avant la troisième ouverture de juillet 2027 | Incohérence de scénario certaine | Produit / ingénierie pédagogique |
| Déficit brut de 2,614 M€ non réconcilié avec le besoin incrémental de 1,65 M€ | Question professionnelle structurante | Praticien finance / comptabilité |
| Pertinence de l’ordre et de la pondération des séquences Analyst | Question professionnelle | Praticien VC |
| Réalisme des hypothèses et décisions de Trait d’Union | Question professionnelle | Praticien venture philanthropie / impact |
| Qualification d’un instrument ou d’une obligation | Avis spécialisé requis | Professionnel compétent selon le sujet |
| Exactitude factuelle externe des références datées | Différée dans ce lot | Revue éditoriale source par source |
| Production du classeur recalculable | Hors périmètre P0 | Lot outillage distinct |

## 6. Grille de réponse — Retour du praticien

Une ligne doit être créée par point examiné.

| Champ | Contenu attendu |
| --- | --- |
| Identifiant | `AF-PR-xx` ou `VP-PR-xx` |
| Parcours et objet | Séquence, leçon, pièce, hypothèse, décision ou critère concerné |
| Décision | Conserver · corriger · compléter · retirer · faire qualifier |
| Justification | Raisonnement professionnel concis |
| Appui | Source, pratique observée, cadre ou expérience mobilisée |
| Confiance | Élevée · moyenne · faible |
| Nature | Fait vérifiable · pratique de place · jugement · hypothèse |
| Modification requise | Formulation ou règle à modifier, sans éditer directement la source |
| Responsable de traitement | Personne ou fonction chargée de qualifier puis d’intégrer le retour |
| Échéance de traitement | Date cible ou motif d’absence d’échéance |
| Escalade | Juridique · fiscale · comptable · safeguarding · données · aucune |
| Limites | Périmètre non couvert par l’avis |
| Relecteur et date | Conservés hors plateforme ; ne pas importer de donnée personnelle dans le produit |

## 7. Critères de réception d’un retour

Un retour est exploitable lorsqu’il :

- identifie précisément l’objet concerné ;
- distingue erreur factuelle, préférence, pratique de place et décision produit ;
- donne une justification proportionnée ;
- précise ses limites et les escalades nécessaires ;
- ne transforme pas une formation ouverte en certification implicite ;
- ne demande aucune donnée réelle de bénéficiaire ou information confidentielle ;
- permet de déterminer si une modification de source est nécessaire.

Après réception, chaque ligne sera classée dans un lot distinct :

1. correction certaine ;
2. décision produit ;
3. avis professionnel à documenter ;
4. absence de changement.

Aucune source pédagogique ne doit être modifiée directement à partir d’un commentaire informel ou non attribuable à un objet précis.

## 8. Hors périmètre

Le présent dossier ne couvre pas :

- la délivrance de `VC Analyst`, l’identité, le jury ou le registre humain ;
- le document du fonds, la bible du cas, M1 ou les leçons Analyst candidates ;
- un avis juridique, fiscal, comptable, réglementaire ou safeguarding ;
- une vérification externe exhaustive des références ;
- la production du classeur `.xlsx` ;
- la remise en ligne, les en-têtes d’hébergement ou les unfurlers ;
- un redesign, une traduction, une nouvelle surface ou un nouveau simulateur.

Ce dossier reste une préparation structurée à une revue humaine. Il ne constitue ni cette revue, ni une validation professionnelle des parcours.
