# Archive — Référentiel VC Analyst Foundations et VC Analyst

> [!WARNING]
> **Document historique, supplanté le 2026-07-20.** `VC Analyst Foundations` a été requalifié en parcours sans évaluation certificative. Les références maintenues sont désormais [`docs/parcours/ANALYST-FOUNDATIONS.md`](../parcours/ANALYST-FOUNDATIONS.md) pour le parcours et [`REFERENTIEL-VC-ANALYST.md`](REFERENTIEL-VC-ANALYST.md) pour la certification professionnelle. Ce document conserve le contrat antérieur à des fins de traçabilité et ne décrit plus l’état publié.

Statut historique au 2026-07-18 : `VC Analyst Foundations` disposait d'une évaluation locale ; `VC Analyst` conservait un référentiel professionnel, une préparation recommandée et une évaluation future, mais aucun titre professionnel n'était délivré. Le fonds, la bible du cas et M1 n'étaient pas produits dans ce lot.

## 1. Deux niveaux distincts

| Niveau | Catégorie | Ce qui est attesté | Régime actuel |
| --- | --- | --- | --- |
| `VC Analyst Foundations` | Certificat de connaissances | Maîtrise du socle nécessaire pour commencer le métier | Évaluation locale déterministe et résultat conservé dans le navigateur |
| `VC Analyst` | Certification professionnelle | Production d'une analyse exploitable pour une décision | Référentiel et préparation publiés ; délivrance humaine inactive |

La réussite à Foundations est présentée comme un prérequis informatif de `VC Analyst`. Elle ne bloque ni l'accès à la fiche professionnelle, ni les cours de préparation, ni les autres contenus. Un résultat Foundations ne permet pas d'utiliser la mention « VC Analyst certifié ».

Le titre professionnel demeure `VC Analyst`, quelles que soient les options. Le contexte éventuel est décrit dans un supplément séparé conformément à l'[architecture transverse](ARCHITECTURE-CERTIFICATIONS.md#5-titre-canonique-et-supplement-contextualise).

## 2. Promesse et limites

La formulation canonique des promesses des six niveaux vit dans `data/certificationLevels.json`. Le présent référentiel développe uniquement les deux niveaux Analyst.

### 2.1 VC Analyst Foundations

Le titulaire du résultat local maîtrise le socle nécessaire pour commencer le métier : il peut expliquer l'économie d'un fonds, situer ses acteurs et ses stades, décrire le traitement d'une opportunité, exécuter les calculs fondamentaux du capital-risque et appliquer les règles d'intégrité professionnelle.

Ce niveau ne valide pas la capacité à produire seul une analyse d'investissement complète. Il ne couvre pas la conduite d'une diligence, la négociation, le closing ou la gouvernance d'une participation.

### 2.2 VC Analyst

Le niveau professionnel vise la capacité à recevoir une opportunité, la qualifier, conduire l'analyse attendue d'un Analyst, construire les modèles nécessaires, documenter les sources et produire une recommandation défendable. Le critère global reste le suivant : le travail peut être révisé par un Associate sans devoir être reconstruit.

Le niveau ne couvre pas le sourcing propriétaire, la direction d'un processus d'investissement, la négociation, le closing ou la responsabilité de board. Ces responsabilités relèvent des niveaux supérieurs.

La charge de **40 heures** est une hypothèse interne de conception pour les futures épreuves professionnelles. Elle doit être mesurée selon le [protocole de production](PROTOCOLE-PRODUCTION-ANALYST.md#5-mesure-de-la-charge) et ne constitue pas une durée publique.

## 3. Référentiel de compétences

Le référentiel est borné à six compétences de connaissances pour Foundations et huit compétences de production pour Analyst. Chaque compétence professionnelle est associée à trois à cinq critères observables.

### 3.1 Foundations — compétences FD

| ID | Compétence observable | Contenus préparatoires |
| --- | --- | --- |
| FD-01 | Expliquer l'économie d'un fonds : cycle de vie, LP/GP, frais et carried interest, loi de puissance et contribution d'un investissement au rendement global | `c-what-is-vc` |
| FD-02 | Situer les acteurs, mandats et stades de financement, puis déterminer ce qu'un fonds peut ou ne peut pas faire | `c-ecosystem` |
| FD-03 | Décrire l'organisation du travail, les rôles, la gouvernance de la décision et le suivi des participations | `c-vc-job` |
| FD-04 | Décrire l'origination, la qualification, la priorisation, la tenue d'un pipeline exploitable et la protection de ses données | `c-deal-flow` |
| FD-05 | Exécuter les calculs de base : marché, unit economics, trésorerie et runway, pre/post-money, dilution, rendement et waterfall simple | `c-mathematiques-vc` |
| FD-06 | Distinguer fait, déclaration, hypothèse et inférence ; appliquer indépendance, confidentialité et usage déclaré de l'IA | `l-fact-hypothesis` et `c-professional-integrity` |

Les preuves certificatives de ces compétences sont les 30 questions dédiées et les trois mini-cas définis au §5. Les quiz des leçons restent des exercices formatifs.

### 3.2 VC Analyst — compétences AN

| ID | Compétence professionnelle | Preuve attendue | Critères principaux |
| --- | --- | --- | --- |
| AN-01 | Qualifier une opportunité selon la stratégie du fonds | Note de screening avec décision motivée | Compatibilité avec le fonds ; décision proportionnée ; motifs explicites ; aucune donnée inventée |
| AN-02 | Évaluer l'équipe, le marché, le produit, la traction et les risques | Analyse d'entreprise sourcée | Segmentation ; preuves observables ; incertitudes signalées ; risques hiérarchisés |
| AN-03 | Modéliser le marché, la trésorerie et la table de capitalisation | Modèles vérifiables et sensibilités | Hypothèses explicites ; calculs exacts ; scénarios ; limites |
| AN-04 | Analyser valorisation, termes et scénarios de rendement | Analyse de dilution, waterfall et rendement | Ownership exact ; effets économiques restitués ; scénarios reliés au fonds ; aucune erreur matérielle |
| AN-05 | Cadrer une due diligence proportionnée aux risques | Plan de diligence et registre de risques | Priorisation ; questions décisives ; contradictions repérées ; distinction bloquant/gérable |
| AN-06 | Rédiger et défendre un mémo d'investissement | Mémo, recommandation et traitement d'objections | Structure ; recommandation proportionnée ; contre-arguments ; concision ; réponses aux objections |
| AN-07 | Suivre une participation et préparer un réinvestissement | Point de situation et avis follow-on | Écarts matériels ; runway ; réserves ; révision de la recommandation si les faits changent |
| AN-08 | Garantir indépendance, confidentialité et usage déclaré de l'IA | Registre de preuves et déclaration d'outils | Classification des affirmations ; traçabilité ; vérification de l'IA ; confidentialité |

Les futures preuves professionnelles seront construites par missions conformément au [protocole](PROTOCOLE-PRODUCTION-ANALYST.md). Cette matrice ne signifie pas que les pièces, missions ou corrigés existent déjà.

## 4. Audit des 35 leçons publiées

L'audit du 2026-07-18 aboutit à une séparation exacte : **23 leçons Foundations** et **12 leçons de préparation recommandée à Analyst**. Aucune leçon n'est supprimée du catalogue.

### 4.1 Les 23 leçons Foundations

| Bloc | Cours et leçons | Nombre | Compétence principale |
| --- | --- | ---: | --- |
| Économie d'un fonds | `c-what-is-vc` : `l-vc-definition`, `l-power-law`, `l-fund-lifecycle` | 3 | FD-01 |
| Écosystème | `c-ecosystem` : `l-actors`, `l-stages` | 2 | FD-02 |
| Métier | `c-vc-job` : `l-vc-week`, `l-roles`, `l-portfolio-monitoring` | 3 | FD-03 |
| Pipeline | `c-deal-flow` : `l-sourcing`, `l-screening`, `l-pipeline-crm` | 3 | FD-04 |
| Mathématiques VC | `c-mathematiques-vc` : `lmv-market-sizing`, `lmv-unit-economics`, `lmv-cash-flow-scenarios`, `lmv-pre-post-ownership`, `lmv-dilution-cap-table`, `lmv-valuation-economic-rights`, `lmv-returns-waterfall` | 7 | FD-05 |
| Faits et hypothèses | `c-investment-recommendation` : `l-fact-hypothesis` seule | 1 | FD-06 |
| Intégrité professionnelle | `c-professional-integrity` : `l-conflicts-conduct`, `l-confidentiality`, `l-ai-integrity`, `l-critical-errors` | 4 | FD-06 |
| **Total** |  | **23** |  |

Ces 23 leçons contiennent **92 questions**, soit quatre par leçon. Elles restent formatives et n'entrent pas dans le score de certification.

### 4.2 Les 12 leçons de préparation recommandée

| Bloc | Cours et leçons | Nombre | Compétences préparées |
| --- | --- | ---: | --- |
| Analyse d'entreprise | `c-startup-analysis` : `l-founder-analysis`, `l-team-market`, `l-product-analysis`, `l-traction-unit-economics` | 4 | AN-02 |
| Due diligence | `c-due-diligence` : `l-dd-process`, `l-dd-commercial`, `l-dd-tech-product`, `l-dd-team`, `l-dd-financial`, `l-dd-legal` | 6 | AN-05 |
| Recommandation et comité | `c-investment-recommendation` : `l-investment-recommendation`, `l-ic-defense` | 2 | AN-06 |
| **Total** |  | **12** |  |

La progression de ces blocs peut être affichée. Elle n'entre ni dans le calcul du résultat Foundations, ni dans un verrou d'accès, ni dans une condition locale de démarrage d'Analyst. Leurs quiz restent des exercices de préparation.

### 4.3 Prérequis autonomes

Les chaînes de prérequis doivent rester résolubles à l'intérieur des contenus accessibles :

- `lmv-market-sizing` vient après `l-pipeline-crm` ;
- `l-fact-hypothesis` vient après `lmv-returns-waterfall` ;
- `l-conflicts-conduct` vient après `l-fact-hypothesis` ;
- `l-investment-recommendation` dépend de la due diligence et de `l-fact-hypothesis`.

L'appartenance à une évaluation est définie dans les collections de certification. Les identifiants d'évaluation auparavant portés par les 35 leçons n'ont pas de fonction dans ce modèle.

## 5. Évaluation VC Analyst Foundations

L'évaluation versionnée dans `data/certificationAssessments.json` vaut **100 points**.

| Partie | Composition | Points |
| --- | --- | ---: |
| Examen | 30 questions nouvelles, cinq par compétence FD ; ordre mélangé et conservé pour la tentative | 40 |
| Mini-cas 1 | Économie d'un fonds | 20 |
| Mini-cas 2 | Marché, unit economics et runway | 20 |
| Mini-cas 3 | Capitalisation, dilution, waterfall et rendement | 20 |

La réussite exige simultanément :

- au moins 70/100 au total ;
- au moins 24/40 à l'examen ;
- au moins 10/20 à chacun des trois mini-cas.

La compensation entre parties ne permet pas de contourner un seuil. Un score total de 70 ou plus reste insuffisant si l'examen ou un mini-cas se situe sous son minimum.

### 5.1 Conditions de passation

L'examen est présenté sans consultation recommandée. Les leçons et simulateurs peuvent être utilisés pour les mini-cas. Ces règles sont déclaratives : l'application n'ajoute ni verrouillage technique ni chronomètre.

Les mini-cas sont auto-corrigés. Les réponses numériques acceptent les formats localisés prévus, appliquent des tolérances explicites et affichent un corrigé détaillé après soumission.

### 5.2 Tentatives et persistance

Les tentatives sont illimitées. Le stockage local conserve :

- la tentative active, y compris l'ordre mélangé des questions ;
- les cinq dernières tentatives soumises ;
- le meilleur résultat, même s'il ne figure plus parmi ces cinq tentatives ;
- la version de l'évaluation ;
- la version de la charte du candidat ;
- la déclaration d'outils.

Une tentative active reprend après rechargement. Les erreurs de stockage sont signalées et une remise à zéro demande confirmation. Ces données demeurent propres au navigateur et ne constituent ni une preuve d'identité ni un registre de délivrance.

## 6. Charte du candidat

Le candidat accepte la version applicable de la charte définie dans `data/candidateCharters.json`. Elle couvre l'authenticité, les sources, l'usage de l'IA, la confidentialité, les conflits d'intérêts, les erreurs critiques et la responsabilité des données locales.

La déclaration d'outils accompagne la tentative. Déclarer un outil n'autorise pas un usage interdit et ne transfère pas la responsabilité des sources, calculs ou réponses.

L'annexe de session destinée à une éventuelle délivrance humaine reste inactive. Le [document de gouvernance](GOUVERNANCE-CERTIFICATIONS.md) en fixe les seules bornes retenues.

## 7. Contextualisation provisoire de VC Analyst

La cible à cinq axes est décrite dans l'[architecture transverse](ARCHITECTURE-CERTIFICATIONS.md#6-axes-de-contextualisation). Le modèle actuel conserve ses trois axes, ses sélections locales et ses 160 compositions.

Le titre reste `VC Analyst`. Les options ne sont jamais concaténées au titre et sont restituées dans un supplément séparé.

Les six leçons Seed, Lead et SaaS suivantes restent candidates, sans engagement de production :

- `l-stage-seed-commercial` et `l-stage-seed-financing` ;
- `l-role-lead-dd` et `l-role-lead-closing` ;
- `l-specialty-saas-metrics` et `l-specialty-saas-gtm`.

Elles ne seront produites que si une future mission révèle un manque vérifié. Les 22 autres leçons optionnelles restent également différées. L'Impact devra rejoindre le futur axe de mandat ; aucune migration ni rédaction Impact n'intervient dans ce lot.

## 8. Évaluation professionnelle future

L'évaluation `VC Analyst` reste une architecture de preuves, non un service de délivrance actif. Elle couvre quatre dimensions :

| Dimension | Objet |
| --- | --- |
| Exactitude technique | Modèles, table de capitalisation, waterfall et métriques |
| Qualité de l'analyse | Sources, registre de preuves, raisonnement, risques et recommandation |
| Défense de la recommandation | Traitement des objections, limites et diligences restantes |
| Comportement professionnel | Indépendance, confidentialité, authenticité et usage déclaré de l'IA |

Le seuil professionnel de référence reste 70/100, avec validation obligatoire des critères critiques et absence d'erreur éliminatoire. Cette règle ne peut produire un titre dans le navigateur. Une éventuelle délivrance dépendrait du régime humain inactif décrit dans `GOUVERNANCE-CERTIFICATIONS.md`.

Le dossier professionnel futur pourra organiser les preuves autour de neuf situations : qualification, marché, analyse d'entreprise, trésorerie, capital, diligence, mémo, traitement des objections et suivi à douze mois. Ces situations indiquent la couverture attendue ; elles ne constituent pas des missions produites.

## 9. Protocole de production future

La production suivra la séquence hybride fixée dans [`PROTOCOLE-PRODUCTION-ANALYST.md`](PROTOCOLE-PRODUCTION-ANALYST.md) :

```text
Document du fonds
→ squelette du cas et registre de preuves
→ M1 complète
→ contrôles et production par blocs
```

Cette séquence conserve le référentiel de compétences en amont tout en testant rapidement une tranche verticale. Elle remplace l'engagement antérieur d'écrire d'abord une bible complète et six leçons contextuelles.

## 10. Garde-fous

- **Pas de second catalogue.** Les certifications renvoient aux contenus par identifiant.
- **Périmètre Analyst strict.** Négociation, closing, board et sourcing propriétaire relèvent des niveaux supérieurs.
- **Épreuves avant contenu nouveau.** Une leçon contextuelle n'est créée qu'après constat d'un manque.
- **Aucun verrou de catalogue.** Les prérequis sont informatifs dans l'expérience locale.
- **Résultat local distinct du titre.** Foundations ne délivre pas `VC Analyst`; la progression Analyst ne le délivre pas davantage.
- **Hypothèses signalées.** Les 40 heures restent internes jusqu'à mesure.
- **Charte éditoriale.** Toute production suit le registre correct, sobre, factuel et institutionnel du dépôt.

## 11. Hors périmètre du lot

Ne sont ni produits ni activés :

- le document du fonds ;
- la bible et les pièces du cas ;
- M1 et les autres missions professionnelles ;
- les six leçons contextuelles candidates ;
- la migration vers cinq axes ;
- l'export d'un portfolio ou des résultats ;
- la délivrance humaine, le contrôle d'identité et le registre ;
- les référentiels détaillés des niveaux Associate Foundations à Principal.

## 12. Décisions de cadrage

2026-07-18 : séparation des 35 leçons en 23 leçons Foundations et 12 leçons de préparation recommandée ; création d'un examen dédié de 30 questions ; maintien des 92 questions Foundations comme formatives ; titre `VC Analyst` invariant ; six leçons contextuelles conservées comme candidates ; charge de 40 heures requalifiée en hypothèse interne ; adoption de la séquence hybride ; gouvernance humaine et artefacts du cas maintenus hors périmètre.
