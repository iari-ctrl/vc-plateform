# Évaluation transversale des parcours et de leurs leçons

> État du worktree local au 24 juillet 2026. Cette revue interne mesure la maturité éditoriale et pédagogique observable ; elle ne remplace ni une validation juridique, financière ou safeguarding, ni une validation par un praticien VC ou venture philanthropy.

## Méthode et barème

Les leçons référencées par un cours sont développées dans chaque parcours afin d’évaluer la séquence réellement présentée à l’apprenant. **Avancée** mesure la disponibilité, la complétude et l’existence d’une application observable ; **pertinence** mesure l’adéquation au but et à la place dans le parcours ; **qualité** mesure la précision, la traçabilité, la sobriété éditoriale et l’exploitabilité pédagogique. L’avancée et la qualité d’une même leçon sont stables entre parcours ; sa pertinence peut varier selon le contexte.

La synthèse a ensuite été contre-relue par quatre audits indépendants en lecture seule, répartis sur six parcours chacun. Leur expansion totalise exactement les mêmes 181 occurrences. Les notes globales ont été recalibrées sur l’exécutabilité de l’ensemble du parcours ; pour une leçon réutilisée, l’avancée et la qualité sont normalisées à la médiane basse des contre-évaluations, tandis que la pertinence reste propre à son parcours.

**Échelle de notation**

- **0** — Absent ou non résolu
- **1** — Non publiable sans refonte
- **2** — Partiellement utilisable après corrections substantielles
- **3** — Utilisable mais incomplet ou inégal
- **4** — Complet dans son périmètre avec réserves limitées
- **5** — Mature et vérifié dans le périmètre technique ou éditorial observé

## Inventaire contrôlé

- **Parcours : 24**
  Tous les objets de `data/parcours.json` sont couverts ci-dessous.
- **Étapes : 165**
  Leçons, cours, cas, simulateurs, livrables et jalons inclus.
- **Occurrences de leçons après expansion des cours : 181**
  Une même leçon peut être réutilisée dans plusieurs parcours.
- **Leçons distinctes référencées : 90**
  Les 90 portent toutes `status: published`.
- **Leçons comportant au moins une URL HTTPS explicite : 58 / 90**
  Indicateur de traçabilité seulement ; la présence d’un lien ne prouve pas sa pertinence.
- **Étapes requises `a-produire` : 3**
  `todo-attentes-serie-a`, `todo-ecrire-memo`, `todo-mini-case-express`.
- **Étapes facultatives `a-produire` : 4**
  Quatre respirations ou bonus non bloquants.
- **Parcours avec une étape résolue vers un livrable : 5**
  Les autres peuvent proposer des cas ou simulateurs, mais pas de livrable de parcours résolu.

## Ce qui n'est pas encore en place

### Étapes de parcours à produire

Sept étapes portent `status: a-produire` dans `data/parcours.json`. L'interface leur applique la mention « bientôt » lorsque leur référence n'est pas résolue (`client/src/pages/learn/ParcoursDetailPage.tsx:343`). Elles se répartissent sur sept parcours distincts, aucun n'en cumulant plusieurs. Cette liste développe les deux entrées correspondantes de l'inventaire ci-dessus ; le détail par parcours reprend chacune sous « Étapes hors leçons ou non résolues ».

- **`p-serie-a` — Préparer ma Série A** — `todo-attentes-serie-a` · Cœur · **Requise**
  L'étape cœur manque et le jalon « négociation simulée + cap table multi-tours » n'a ni livrable, ni grille, ni révision.
- **`p-meilleur-analyst` — Devenir un meilleur Analyst** — `todo-ecrire-memo` · Pratique · **Requise**
  L'objectif final dépend d'un placeholder sans route, grille ni workflow.
- **`p-express-entretien` — L'entretien VC en 1 h** — `todo-mini-case-express` · Pratique · **Requise**
  Le mini-case, seule pratique spécifique à l'entretien, reste non résolu.
- **`p-semaine-vc` — Une semaine dans la peau d'un VC** — `todo-myth-vc-mise` · Respiration · **Facultative**
  La mise en situation facultative reste non résolue : à produire ou à retirer.
- **`p-stage` — Décrocher un stage en VC** — `todo-cafe-reseau` · Respiration · **Facultative**
  La respiration réseau manque : à produire ou à supprimer.
- **`p-entretien-associate` — Réussir l'entretien Associate** — `todo-pourquoi-ce-fonds` · Bonus · **Facultative**
  Le bonus manque : à produire ou à retirer.
- **`p-seed` — Préparer ma seed** — `todo-process-levee` · Bonus · **Facultative**
  Le bonus est resté à l'état de placeholder : à produire ou à retirer.

### Trajectoire de certification, hors périmètre audité

Une certification est fonctionnellement une trajectoire ordonnée vers un objectif, au même titre qu'un parcours. Le dépôt la modélise toutefois comme une entité distincte, dans `data/certifications.json` et sous les routes `/certifications`, alors que la revue ci-dessus porte sur les 24 objets de `data/parcours.json`. Les six cours de préparation référencés par la certification — `c-startup-analysis`, `c-due-diligence`, `c-investment-recommendation`, `c-analyst-stage`, `c-analyst-deal-role`, `c-analyst-specialties` — existent dans `data/courses.json` mais ne sont référencés par aucun parcours : ils n'ont donc reçu aucune note d'avancée, de pertinence ou de qualité dans cette passe. Les états ci-dessous sont relevés dans la donnée, non évalués.

- **`cert-analyst-vc` — VC Analyst** — Certification professionnelle, `status: published` · `availability: in-construction`
  Seule certification du dépôt. L'interface affiche « En construction » (`CertificationDetailPage.tsx:223`). Ses six cours de préparation existent, mais la trajectoire elle-même n'a pas été auditée.
- **`analyst` — VC Analyst** — Niveau de l'échelle · `status: in-construction`
  Seul niveau engagé des cinq déclarés dans `data/certificationLevels.json`.
- **`associate-foundations`, `associate`, `senior-associate`, `principal`** — Niveaux de l'échelle · `status: future`
  Quatre niveaux déclarés à l'état futur.

## Constats transversaux issus de la contre-revue

- **Jalon descriptif sans livrable résolu** — 18 parcours
  Le résultat annoncé n’a ni route de production, ni grille, ni état de réalisation observable.
- **Prérequis absent ou placé après la leçon** — 25 occurrences dans 14 parcours
  La séquence rend certaines leçons dépendantes d’un acquis non préparé, malgré plusieurs mentions « aucun prérequis ».
- **Progression limitée aux leçons lues** — Tous les parcours
  Les cas, simulateurs et productions peuvent rester inachevés lorsque l’indicateur de lecture atteint 100 %.
- **Variante courte effectivement disponible** — 13 leçons, toutes `lea-*`
  Hors parcours Entretien Analyst, la préférence courte retombe généralement sur le corps intégral.
- **Cas de dilution incohérent** — `cs-dilution-journey`
  Les dilutions successives de 22 %, 20 %, 16 % et 14 % laissent 45,08 %, non ≈28 % ; ce cas affecte notamment pré-seed, Série A et cap table.
- **Charge mathématique latente** — 7 leçons, 405 minutes de contributions
  Les parcours qui réutilisent `c-mathematiques-vc` n’intègrent pas automatiquement cette charge ni le livrable `math-vc-dossier` à leur durée.

## Synthèse des 24 parcours

**`p-decouvrir-vc` — Comprendre le capital-risque** — Maintenant · 7 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5

Les sept leçons sont disponibles, mais six restent brèves, peu sourcées et rédigées dans un registre souvent promotionnel. Le bilan annoncé n'est pas matérialisé par une étape finale distincte.

*Priorité :* Remplacer les six leçons fragiles par les modules canoniques équivalents ou les réécrire avec sources datées, formulations qualifiées et un bilan final réellement résolu.

**`p-semaine-vc` — Une semaine dans la peau d'un VC** — Ensuite · 3 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 4/5 · **1 facultative à produire**

Les trois leçons sont publiées et substantielles, mais leur niveau dépasse une découverte courte, deux prérequis sont absents et la mise en situation facultative reste non résolue.

*Priorité :* Fournir une version essentielle, corriger les prérequis exacts et produire ou retirer `todo-myth-vc-mise`.

**`p-stage` — Décrocher un stage en VC** — Ensuite · 11 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 3/5 · **1 facultative à produire**

Le jalon de mini-analyse est résolu et sourcé. Les trois leçons de carrière et de thèse restent courtes, la respiration réseau manque et le bonus mathématique ouvre jusqu'à 405 minutes de pratique guidée.

*Priorité :* Renforcer les modules carrière et thèse avec preuves et exercices, supprimer ou produire `todo-cafe-reseau`, et annoncer séparément la charge du dossier mathématique facultatif.

**`p-entretien-analyst` — Réussir l'entretien Analyst** — Maintenant · 18 leçons · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5

Le parcours le plus abouti : séquence resourcée, variantes courte et approfondie, bonus explicites et mock final de 150 minutes. La pratique mathématique liée aux leçons n'entre toutefois pas dans le temps dérivé du parcours.

*Priorité :* Faire valider les formats par un praticien du recrutement VC France/Europe et décider explicitement si les 405 minutes du dossier mathématique sont hors parcours, facultatives ou intégrées au budget.

**`p-entretien-associate` — Réussir l'entretien Associate** — Ensuite · 12 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 3/5 · **1 facultative à produire**

Le cas, le simulateur et le jalon IC sont résolus. Le bonus `todo-pourquoi-ce-fonds` manque et plusieurs leçons centrales sur les termes restent trop générales ou insuffisamment qualifiées.

*Priorité :* Produire ou retirer le bonus, resourcer les attentes Associate et les clauses de term sheet, puis compléter le jalon IC par une grille et une charge de travail explicites.

**`p-entretien-principal` — Entretien Principal / poste senior** — Plus tard · 11 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 3/5

Toutes les étapes sont résolues et le jalon de thèse existe, mais l'ensemble privilégie les mécaniques financières et couvre peu le leadership d'investissement, le portefeuille, les boards et la relation LP.

*Priorité :* Ajouter un bloc Principal sur conviction propriétaire, allocation, gouvernance et leadership, puis faire du dossier mathématique un complément clairement facultatif.

**`p-preseed` — Préparer ma pré-seed** — Ensuite · 3 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5

Les leçons et simulateurs sont accessibles, mais le one-liner et le mini-deck promis ne sont pas produits. Le cas final annonce ≈28 % de détention après des dilutions qui laissent 45,08 %.

*Priorité :* Créer un livrable one-liner plus mini-deck, puis corriger le cas de dilution et qualifier les prescriptions juridiques.

**`p-seed` — Préparer ma seed** — Maintenant · 4 leçons · Avancée 3/5 · Pertinence 2/5 · Qualité 2/5 · **1 facultative à produire**

Les ressources sont accessibles, mais le deck seed, la cap table et leur grille ne sont pas exécutables. Le contenu reste peu contextualisé au stade seed et le bonus `todo-process-levee` manque.

*Priorité :* Créer le livrable deck plus cap table, contextualiser les instruments au stade seed et produire ou retirer le bonus.

**`p-serie-a` — Préparer ma Série A** — Ensuite · 4 leçons · Avancée 1/5 · Pertinence 2/5 · Qualité 2/5 · **1 requise à produire**

L'étape cœur `todo-attentes-serie-a` manque. Le parcours réutilise ensuite des contenus génériques et juridiques fragiles sans atelier de négociation correspondant au jalon annoncé.

*Priorité :* Produire d'abord les attentes Série A, puis un atelier de négociation term sheet et gouvernance fondé sur un cas documenté et des sources juridiques qualifiées.

**`p-mener-un-tour` — Mener un tour de table** — Ensuite · 5 leçons · Avancée 3/5 · Pertinence 2/5 · Qualité 3/5

Les étapes sont accessibles, mais aucune production ne matérialise la syndication, la term sheet ou la cible d’ownership. Deux prérequis sont absents et une leçon débutante clôt un parcours avancé.

*Priorité :* Ajouter une production finale de syndication, term sheet et ownership, puis remettre les prérequis avant les waterfalls.

**`p-levee-fonds-lp` — Lever son fonds VC (LPs & Institutions)** — Maintenant · 8 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5

Les fondations sur le cycle et les métriques sont utiles, mais les trois leçons LP sont très prescriptives, peu sourcées et parfois promotionnelles. Le deck de fonds annoncé n'est pas un livrable.

*Priorité :* Réécrire le bloc LP dans un registre institutionnel avec sources France/Europe, distinguer pratiques variables et obligations, puis créer un deck ou mémo LP avec grille de revue.

**`p-meilleur-analyst` — Devenir un meilleur Analyst** — Plus tard · 11 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 4/5 · **1 requise à produire**

Les onze leçons sont publiées et plusieurs sont mûres, mais le mémo final `todo-ecrire-memo` manque, quatre prérequis ne sont pas satisfaits et la charge mathématique élargit fortement la séquence.

*Priorité :* Produire le mémo complet, corriger les prérequis et recalculer la durée avant de resserrer le parcours.

**`p-passer-associate` — Passer Associate** — Plus tard · 5 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5

Quatre des cinq leçons sont très brèves, sans source ni exercice, et aucune production ne matérialise la thèse et la diligence défendues annoncées.

*Priorité :* Créer une production finale de thèse et diligence défendue, puis réécrire les quatre fiches courtes au niveau avancé.

**`p-passer-principal` — Passer Principal** — Plus tard · 3 leçons · Avancée 2/5 · Pertinence 3/5 · Qualité 2/5

Trois leçons courtes couvrent contrôle, réserves et triage, sans modèle, décision documentée ni pratique de gouvernance. Le plan de réserves et la thèse annoncés ne sont pas exécutables.

*Priorité :* Créer un livrable chiffré de réserves et de thèse, puis approfondir gouvernance, leadership de deal et critères de décision.

**`p-penser-gp` — Penser comme un GP** — Ensuite · 8 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 3/5

La construction de portefeuille est bien représentée par quatre leçons et un simulateur. Les économies de fonds restent simplifiées et le mini-modèle plus la note LP annoncés ne sont pas matérialisés.

*Priorité :* Ajouter un modèle de fonds et une note LP exportables, puis sourcer les pratiques de frais, waterfall, réserves, construction et communication LP.

**`p-term-sheet` — Décoder une term sheet** — Ensuite · 3 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5

Le périmètre économique et de contrôle est pertinent, mais les trois leçons présentent des standards juridiques français comme uniformes et sans références attachées. L'annotation finale n'est pas un livrable.

*Priorité :* Refondre le parcours autour d'un document public ou d'un cas pédagogique daté, ajouter les limites de juridiction et de conseil, puis créer une term sheet annotée persistante.

**`p-cap-table` — Lire un cap table sans paniquer** — Ensuite · 3 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 3/5

Les deux leçons mathématiques sont mûres, mais la cap table annoncée n’est pas conservée, `l-stages` est périphérique et son prérequis manque. Le cas final publie ≈28 % au lieu de 45,08 %.

*Priorité :* Créer une cap table produite et réconciliée, corriger le cas de dilution et rattacher explicitement la pratique mathématique.

**`p-carry` — Le carry, enfin clair** — Ensuite · 3 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 3/5

La leçon de waterfall et celle sur les métriques sont solides, mais l'introduction 2 et 20 généralise excessivement les structures de frais et de hurdle. Aucun relevé LP n'est réellement produit.

*Priorité :* Remplacer les normes universelles par plusieurs architectures de waterfall, puis ajouter un relevé LP calculé et commenté comme livrable.

**`p-market-sizing` — Dimensionner un marché (TAM/SAM/SOM)** — Ensuite · 2 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 4/5

Les deux leçons sont directement utiles et la pratique guidée de 45 minutes existe dans le dossier mathématique. Elle n'est ni intégrée à la séquence ni comptée dans le budget de 45 minutes.

*Priorité :* Raccorder la composante market sizing du dossier au parcours, porter la durée réelle et conserver hypothèses, fourchette et contrôles de sens dans un livrable.

**`p-unit-economics` — Unit economics & Rule of 40** — Plus tard · 2 leçons · Avancée 3/5 · Pertinence 3/5 · Qualité 4/5

Les calculs d’unit economics sont solides, mais la Rule of 40 annoncée n’est ni calculée ni appliquée. Les deux leçons se recouvrent et un prérequis manque.

*Priorité :* Ajouter un cas Rule of 40 avec conventions et sensibilités, puis réconcilier les deux leçons, le prérequis et la durée.

**`p-express-entretien` — L'entretien VC en 1 h** — Ensuite · 9 leçons · Avancée 3/5 · Pertinence 2/5 · Qualité 3/5 · **1 requise à produire**

Le mini-case, seule pratique spécifique à l’entretien, reste non résolu. Le mode complet ajoute 405 minutes de pratique mathématique à une promesse d’une heure.

*Priorité :* Produire un mini-case chronométré et remplacer le cours mathématique intégral par les seules opérations réellement testées.

**`p-express-lever` — Lever en 1 h : l'essentiel** — Ensuite · 2 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5

La séquence courte répond au besoin et le simulateur fournit une action concrète. Les deux leçons emploient toutefois des conseils juridiques et des seuils de dilution présentés comme universels.

*Priorité :* Réécrire les deux leçons avec sources françaises datées, scénarios comparés, limites de juridiction et formulations non prescriptives.

**`p-venture-philanthropy-foundations` — Fondamentaux de la venture philanthropie** — Maintenant · 21 leçons · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5

Les 21 leçons, les pratiques guidées, les consolidations et le jalon forment un dispositif très avancé. La cohérence financière du cas, l'horizon du modèle, le raccord de trésorerie et les limites juridiques ou safeguarding restent à valider.

*Priorité :* Corriger et faire valider le scénario financier Trait d'Union, fournir un classeur recalculable, aligner les temps dérivés et organiser une revue praticien venture philanthropy, finance, droit et safeguarding.

**`p-analyst-foundations` — Fondamentaux de l’analyse en capital-risque** — Maintenant · 23 leçons · Avancée 3/5 · Pertinence 4/5 · Qualité 4/5

Les 23 leçons forment un corpus solide, mais les cartes de pratique pointent vers `math-vc-dossier` alors que le contrat maintenu indique qu’aucun livrable autonome n’est rattaché au parcours. Les charges affichées n’intègrent pas cette pratique.

*Priorité :* Décider si `math-vc-dossier` est requis, facultatif ou hors parcours, puis aligner les cartes de pratique, les durées et la documentation maintenue.

## Ordre de traitement proposé

- **P0 — `p-serie-a`, `p-meilleur-analyst`, `p-express-entretien`**
  Une étape cœur ou pratique nécessaire au résultat annoncé reste `a-produire`.
- **P0 — `p-term-sheet`, `p-express-lever`, `p-preseed`, `p-seed`, `p-serie-a`, `p-levee-fonds-lp`, `p-decouvrir-vc`**
  Présence de normes, chiffres, conseils juridiques ou formulations promotionnelles insuffisamment sourcés ou qualifiés.
- **P1 — Parcours promettant un résultat sans livrable résolu**
  Transformer, lorsque le résultat doit être conservé ou relu, la promesse de jalon en production observable et exportable.
- **P0 — `cs-dilution-journey` dans pré-seed, Série A et cap table**
  Corriger le résultat ≈28 % ou les données d’entrée ; les quatre dilutions publiées laissent 45,08 %.
- **P1 — 14 parcours avec 25 prérequis non satisfaits**
  Ajouter, déplacer ou retirer les prérequis afin que chaque dépendance précède sa leçon.
- **P1 — Parcours réutilisant `c-mathematiques-vc`**
  Décider si les 405 minutes de pratique guidée sont requises, facultatives ou hors parcours, puis aligner séquence et durée.
- **P1 — Entretien Analyst, Analyst Foundations et Venture philanthropie**
  Conserver les dispositifs actuels, mais obtenir les validations praticiennes déjà identifiées avant de les présenter comme normes professionnelles.

## Détail par parcours

### `p-decouvrir-vc` — Comprendre le capital-risque

Avancée 3/5 · Pertinence 4/5 · Qualité 2/5

Les sept leçons directes `ld-*`, publiées depuis `data/parcours/01-le-vc-sans-bullshit.lessons.json`, totalisent 35 minutes ; le cas final porte le complet à 43 minutes, contre 1,5 h déclarée dans `data/parcours.json#p-decouvrir-vc`. Le contenu est accessible, mais sans source explicite ni exercice. Les chiffres de tickets, valorisations, rémunérations, charge de travail et cycles de fonds sont peu étayés. Le ton recourt souvent au tutoiement, aux slogans et métaphores (« vérité qui pique », « perle », vin, karaté), en écart avec la charte. Le « Quiz éclair » annoncé n’est pas une étape exécutable.

**Proposition d'amélioration.** Reprendre les sept fiches comme un ensemble : définition avant loi de puissance, sources proposition par proposition, chiffres contextualisés, ton institutionnel, puis quiz final réellement accessible et durées réconciliées.

**Étapes hors leçons ou non résolues**

- `cs-europe-vs-valley` — Les spécificités du capital-risque européen (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `ld-power-law` — Comprendre la loi de puissance** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 3/5
  Explication prudente, mais placée avant la définition du VC ; aucune source ni pratique, et le quiz réintroduit une formulation plus absolue que le corps.
- **Étape 2 · `ld-what-is-vc` — C'est quoi le VC, vraiment ?** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Orientation utile, mais simplifiée et familière ; le quiz confond capital apporté et equity reçue, avec plusieurs généralités non sourcées.
- **Étape 3 · `ld-money-flow` — Le voyage de l'argent** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Chaîne LP–GP–entreprise claire ; « vrais propriétaires », exposition de l’assurance-vie et modèle ≈2 %/≈20 % sont généralisés sans source ni cadre juridique.
- **Étape 4 · `ld-stages` — La grammaire des stades** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Vocabulaire pertinent, mais tickets, valorisations et revenus par stade sont précis, périssables et non sourcés ; métaphores hors charte.
- **Étape 5 · `ld-vc-job` — Le vrai job (et les mythes qui vont avec)** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Couvre le quotidien, mais 50–60 h, 1 000 dossiers/3–5 financés, week-ends et géographie du métier sont non sourcés ou trop absolus ; aucune pratique.
- **Étape 6 · `ld-roles` — Qui fait quoi (et qui gagne quoi)** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Hiérarchie lisible, mais pouvoirs, ancienneté, salaires et carry sont présentés comme plus uniformes qu’ils ne le sont ; redondance avec `l-roles`.
- **Étape 7 · `ld-fund-lifecycle` — Un fonds naît et meurt aussi** — Bonus · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5
  Structure mémorisable, mais calendrier des phases et nouvelle levée tous les 2–3 ans non sourcés et trop normatifs ; quiz sans exercice.

### `p-semaine-vc` — Une semaine dans la peau d'un VC

Avancée 3/5 · Pertinence 3/5 · Qualité 4/5

Trois leçons directes publiées, 19 minutes déclarées, environ 3 000 mots, douze questions de quiz et trois exercices longs en prose. Les contenus sont rigoureux et mieux sourcés que les `ld-*`, mais relèvent davantage d’une formation opérationnelle Analyst que d’une découverte courte. Les exercices n’ont ni champ `practice`, ni estimation, ni livrable suivi. Les prérequis exacts sont incomplets : `l-vc-week` demande `l-stages`, absent ; `l-sourcing` demande `l-portfolio-monitoring`, absent. `ld-stages` ne remplace pas `l-stages`.

**Proposition d'amélioration.** Fournir une version essentielle compatible avec une session courte, corriger les prérequis exacts et conserver les corps actuels comme approfondissement ; résoudre ou retirer l’étape anti-mythe.

**Étapes hors leçons ou non résolues**

- `todo-myth-vc-mise` (Respiration, à produire)

**Leçons du parcours**

- **Étape 1 · `l-vc-week` — Organisation du travail et traitement d'une opportunité** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Processus, priorisation, limites, exercice et références solides ; prérequis `l-stages` absent, 969 mots et exercice incompatibles avec 6 minutes.
- **Étape 2 · `l-roles` — Rôles, responsabilités et gouvernance de la décision** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Responsabilités, délégations et contrôles bien traités ; niveau gouvernance/RACI/conformité supérieur à une découverte, sans livrable suivi.
- **Étape 3 · `l-sourcing` — Origination et organisation du sourcing** — Bonus · Avancée 4/5 · Pertinence 3/5 · Qualité 4/5
  Méthode et biais bien développés ; prérequis `l-portfolio-monitoring` absent et exercice de trente sociétés sur six semaines disproportionné pour un bonus débutant.

### `p-stage` — Décrocher un stage en VC

Avancée 3/5 · Pertinence 3/5 · Qualité 3/5

Le parcours développe onze occurrences : trois leçons directes, les sept leçons de `course:c-mathematiques-vc`, puis `l-career-levels`. Toutes n’ont qu’un `body`. Le bloc mathématique est mature mais intermédiaire, surdimensionné pour le niveau débutant et représente 405 minutes de pratique guidée, alors que le bonus déclaré n’ajoute qu’une heure. `l-team-market` et `lmv-market-sizing` ont des prérequis absents (`l-founder-analysis`, `l-pipeline-crm`). Les leçons carrière sont brèves, peu sourcées et sans exercice structuré.

**Proposition d'amélioration.** Construire une séquence stage exécutable — ciblage, prise de contact, candidature, mini-analyse, retour —, livrer `todo-cafe-reseau`, puis réduire le bonus mathématique aux calculs réellement attendus en recrutement junior.

**Étapes hors leçons ou non résolues**

- `todo-mini-analyse-gabarit` — Écrire une mini-analyse de startup (Pratique, résolu)
- `todo-cafe-reseau` (Respiration, à produire)

**Leçons du parcours**

- **Étape 1 · `l-career-breaking-in` — Entrer dans un fonds** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Pertinente pour candidater, mais environ 210 mots, deux quiz, aucune source ni pratique ; généralités non étayées sur réseau, scouting et candidats.
- **Étape 2 · `l-thesis-anatomy` — Anatomie d'une thèse** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Introduction utile mais très courte, sans source, exemple appliqué ou livrable ; slogan « Falsifiable ou rien » hors registre.
- **Étape 3 · `l-team-market` — Analyse du marché, de la concurrence et de la chaîne de valeur** — Cœur · Avancée 4/5 · Pertinence 3/5 · Qualité 4/5
  Contenu profond, référencé et exercé ; niveau intermédiaire et prérequis `l-founder-analysis` absent, plus large que la mini-analyse promise.
- **Étape 4 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Méthode, sensibilités, sources, quiz et pratique de 45 min ; utile, mais prérequis `l-pipeline-crm` absent et densité élevée.
- **Étape 4 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Bonus · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Calculs reproductibles et pratique de 45 min ; pertinence moyenne pour une candidature de stage généraliste.
- **Étape 4 · `lmv-cash-flow-scenarios` — Modèle de trésorerie, runway et scénarios de financement** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Scénarios cohérents et exercice de 60 min ; trop spécialisée et non préparée par le noyau.
- **Étape 4 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Calculs clairs, cas primaire/secondaire, quiz et pratique de 45 min ; profondeur supérieure au niveau annoncé.
- **Étape 4 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Séquençage et contrôles solides, pratique de 75 min ; charge excessive pour le bonus déclaré.
- **Étape 4 · `lmv-valuation-economic-rights` — Valorisation de transaction et principaux termes économiques** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Distinction prix/valeur/droits robuste et pratique de 60 min ; niveau juridique et financier peu proportionné au stage.
- **Étape 4 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Bonus · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Calculs et réconciliations cohérents, pratique de 75 min ; avancé et éloigné de la candidature ciblée.
- **Étape 7 · `l-career-levels` — Les échelons du venture** — Bonus · Avancée 2/5 · Pertinence 2/5 · Qualité 2/5
  Très brève, sans sources ni pratique ; hiérarchie simplifiée et jugements non étayés, faible apport pour décrocher un stage.

### `p-entretien-analyst` — Réussir l'entretien Analyst

Avancée 4/5 · Pertinence 4/5 · Qualité 4/5

Dix-huit occurrences : onze leçons directes `lea-*` et les sept `lmv-*`. Chaque `lea-*` possède `bodyShort` et `body` ; la version courte est rendue par défaut. Les mathématiques n’ont qu’un corps long. Le parcours est cohérent et le livrable final prévoit note, oral, retour et révision. Ses limites sont l’absence de pratique structurée intermédiaire, les doublons `lea-market-sizing`/`lmv-market-sizing` et `lea-read-startup`/`lmv-unit-economics`, et des versions courtes parfois insuffisantes pour atteindre l’objectif de production. Les 405 minutes de pratique `math-vc-dossier` ne sont pas comptées dans le temps dérivé, ce livrable n’étant pas une étape (`learningTime.ts:59-75`).

**Proposition d'amélioration.** Faire contribuer les étapes `lea-*` au livrable final — grille, market sizing, métriques, recherche fonds, pitch et memo — puis supprimer les doublons et intégrer toute pratique conservée au calcul de charge.

**Étapes hors leçons ou non résolues**

- `lea-mock` — Mock d'entretien Analyst VC (Pratique, résolu)

**Leçons du parcours**

- **Étape 1 · `lea-process` — Cartographier le processus sans le figer** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Variantes cohérentes, sources et périmètres explicites ; aucune cartographie à produire et précautions méthodologiques répétitives.
- **Étape 2 · `lea-grille` — Construire une grille d'investisseur** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 4/5
  Exemple fait/interprétation/diligence utile ; le titre promet une construction, mais aucun gabarit ni exercice ne matérialise la grille.
- **Étape 3 · `lea-market-sizing` — Dimensionner un marché avec hypothèses traçables** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 3/5
  Version courte très condensée, corps sans exemple chiffré ni exercice ; sources indirectes et forte redondance avec l’étape suivante.
- **Étape 4 · `lea-read-startup` — Lire une startup avec des métriques contextualisées** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 3/5
  Prudence correcte sur les benchmarks, mais aucun calcul travaillé ; références CSRD/ILPA seulement indirectes pour ARR, CAC, LTV et NRR.
- **Étape 5 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Cœur · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Exécutable et sourcée, mais répète l’étape 3, exige `l-pipeline-crm` absent et sa pratique de 45 min n’est pas comptée.
- **Étape 5 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Très pertinente, calculs reproductibles, quatre quiz et pratique de 45 min ; chevauche partiellement `lea-read-startup`.
- **Étape 5 · `lmv-cash-flow-scenarios` — Modèle de trésorerie, runway et scénarios de financement** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Scénarios et contrôles solides ; profondeur supérieure à certains entretiens généralistes, pratique de 60 min non comptée.
- **Étape 5 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Exemples adaptés aux calculs d’entretien, quiz et pratique de 45 min.
- **Étape 5 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Leçon mature, dilution composée, contrôles, quiz et pratique de 75 min ; prérequis interne respecté.
- **Étape 5 · `lmv-valuation-economic-rights` — Valorisation de transaction et principaux termes économiques** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Très complète et prudente ; IFRS/IPEV et certaines clauses dépassent le niveau de plusieurs candidats Analyst.
- **Étape 5 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Calculs cohérents et pratique de 75 min ; dense et non reliée au livrable du parcours.
- **Étape 6 · `lea-deal-memo` — Écrire un deal memo proportionné aux preuves** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Structure, calcul simple et prudence éditoriale solides ; aucune production attachée malgré l’objectif d’écrire une note.
- **Étape 7 · `lea-case-study` — Traiter un case study comme une diligence courte** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 4/5
  Méthode pertinente et sources délimitées ; aucun dossier à traiter ni critère de remise à cette étape.
- **Étape 8 · `lea-fund-research` — Préparer sa recherche sur le fonds sans surinterpréter** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 3/5
  Sortie concrète annoncée, mais sans fiche de travail ni persistance ; sources incomplètement alignées sur toutes les recommandations.
- **Étape 9 · `lea-pitch` — Pitcher une société en fonction du fonds** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 4/5
  Trame claire et sobre ; exercice oral seulement narratif, sans enregistrement, grille ou retour.
- **Étape 10 · `lea-fit` — Construire un fit professionnel vérifiable** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 4/5
  Sources et limites qualifiées ; aucune activité structurée pour produire ou réviser les trois réponses « why ».
- **Étape 11 · `lea-reverse-questions` — Poser des questions utiles au recruteur** — Bonus · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Actionnable et prudent ; cadrage de l’adaptation ILPA plus développé que l’entraînement effectif.
- **Étape 12 · `lea-jour-j` — Préparer la période autour de l'entretien** — Bonus · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Checklist opérationnelle et cohérente dans les deux variantes ; absence de livrable acceptable pour une étape de consolidation.

### `p-entretien-associate` — Réussir l'entretien Associate

Avancée 3/5 · Pertinence 4/5 · Qualité 3/5

Douze occurrences : cinq leçons directes et les sept `lmv-*`, toutes avec un corps unique. Le noyau associe une due diligence substantielle à quatre fiches de 151–223 mots, sans sources ni production structurée. `l-dd-process` déclare `lmv-returns-waterfall` comme prérequis, mais celle-ci arrive ensuite en bonus. Le jalon final simule un IC mais ne produit pas le « deal memo complet + IC » annoncé. Plusieurs formulations (« On te jugera », « Falsifiable ou rien », « brutal », « meilleurs investisseurs ») sont trop familières ou absolues.

**Proposition d'amélioration.** Organiser le parcours autour d’un dossier continu — plan de DD, deal memo, objections, comité, retour et révision — et placer les prérequis quantitatifs avant `l-dd-process`; résoudre ou retirer `todo-pourquoi-ce-fonds`.

**Étapes hors leçons ou non résolues**

- `waterfall` — Waterfall simplifiée (Pratique, résolu)
- `cs-liquidation-preference` — Effets des clauses de préférence sur la valeur fondatrice (Respiration, résolu)
- `todo-ic-simulation` — Simulation de comité d'investissement (seed) (Pratique, résolu)
- `todo-pourquoi-ce-fonds` (Bonus, à produire)

**Leçons du parcours**

- **Étape 1 · `l-dd-process` — Plan de due diligence fondé sur les risques** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Contenu complet, prudent, référencé, avec exercice et quiz ; pratique non structurée et prérequis `lmv-returns-waterfall` placé après.
- **Étape 2 · `l-thesis-anatomy` — Anatomie d'une thèse** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Pertinente mais trop courte pour le niveau avancé, sans source ni production ; slogan et jugement sur les « meilleurs investisseurs ».
- **Étape 3 · `l-defending-thesis` — Défendre une thèse** — Cœur · Avancée 2/5 · Pertinence 5/5 · Qualité 2/5
  Directement alignée sur l’IC, mais 151 mots, quiz de restitution et aucun entraînement oral ou feedback.
- **Étape 4 · `l-ts-economics` — Les termes économiques** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5
  Utile mais très condensée ; « standard », « douce », « brutal et rare » généralisés sans juridiction ni source, sans waterfall produite.
- **Étape 5 · `l-ts-control` — Les termes de contrôle** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5
  Sujet pertinent, mais aucune lecture de clause ; généralités non sourcées sur vélocité, horizon et « meilleurs investisseurs ».
- **Étape 6 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Méthode, sources, quiz et pratique solides ; prérequis `l-pipeline-crm` absent et niveau intermédiaire.
- **Étape 6 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Formules et limites robustes ; bon support de DD, mais davantage révision quantitative que simulation Associate.
- **Étape 6 · `lmv-cash-flow-scenarios` — Modèle de trésorerie, runway et scénarios de financement** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Scénarios cohérents et production réelle ; peu contextualisée à la défense en comité.
- **Étape 6 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Exemples exacts et pratique utile ; redondance partielle avec la séquence term sheet.
- **Étape 6 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Équation du pool, contrôles, quiz et production ; exécutable mais toujours de niveau déclaré intermédiaire.
- **Étape 6 · `lmv-valuation-economic-rights` — Valorisation de transaction et principaux termes économiques** — Bonus · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  La plus directement utile aux termes économiques ; scénarios, limites juridiques et pratique, sans validation juridique externe.
- **Étape 6 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Calculs contrôlés, flux datés et pratique ; devrait précéder `l-dd-process` et chevauche `l-ts-economics`.

### `p-entretien-principal` — Entretien Principal / poste senior

Avancée 3/5 · Pertinence 3/5 · Qualité 3/5

Onze occurrences : quatre leçons directes et les sept `lmv-*`, toutes avec un corps unique. Le livrable final `todo-these-proprietaire` est substantiel, mais aucune leçon du noyau n’enseigne réellement la construction d’une thèse propriétaire. Trois des quatre leçons directes font moins de 200 mots, sans sources ni exercice. Le bloc mathématique porte surtout sur société et transaction plutôt que sur stratégie de fonds. La charge minimale connue atteint environ 504 minutes — 80 de lecture, 405 de pratiques `lmv-*`, 11 pour le cas et 8 pour la consigne finale, hors simulateur et production — contre 480 minutes déclarées. Le ton contient des formulations trop absolues : « doubler sur les gagnantes », « accepter la mort », « n’a pas fait son métier », « IRR spectaculaire ».

**Proposition d'amélioration.** Remplacer le noyau introductif par une séquence avancée sur thèse propriétaire, construction de portefeuille, réserves, scénarios de rendement du fonds et défense du plan ; faire contribuer chaque leçon au livrable final et recalibrer la durée.

**Étapes hors leçons ou non résolues**

- `fund-returns` — Fund returns : DPI / TVPI / MOIC (Pratique, résolu)
- `todo-these-proprietaire` — Écrire une thèse propriétaire (pre-seed / seed) (Cœur, résolu)
- `cs-power-law-portfolio` — Anatomie d'un portefeuille en loi de puissance (Bonus, résolu)

**Leçons du parcours**

- **Étape 1 · `l-reserves` — Réserves & follow-on** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Sujet central, mais 152 mots, sans modèle ni exercice ; fourchette 40–60 % non sourcée et ton prescriptif.
- **Étape 2 · `l-triage` — Le triage du portefeuille** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5
  Sujet pertinent, traitement binaire en 169 mots, sans grille ni arbitrage concret ; « accepter la mort » hors registre.
- **Étape 3 · `l-fees-carry` — Fees, carry & waterfall** — Cœur · Avancée 2/5 · Pertinence 3/5 · Qualité 2/5
  195 mots, un quiz, aucune source ; 2/20, hurdle de 8 % et waterfall présentés comme quasi universels, avec jugement éditorial sur le GP.
- **Étape 4 · `l-fund-metrics` — Lire les métriques d'un fonds** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 3/5
  Exemple exact et bonne distinction réalisé/latent ; pas de source ni exercice comparatif, niveau encore introductif et redondant avec `lmv-returns-waterfall`.
- **Étape 6 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Mûre et exécutable, mais analyse de deal éloignée du résultat « thèse + portefeuille » ; prérequis `l-pipeline-crm` absent.
- **Étape 6 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Solide et pratiquée ; compétence plutôt Analyst/Associate que distinctive d’un Principal.
- **Étape 6 · `lmv-cash-flow-scenarios` — Modèle de trésorerie, runway et scénarios de financement** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Calculs cohérents, mais travail de DD société plutôt que stratégie senior de fonds.
- **Étape 6 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Contenu complet, centré transaction et cap table ; prépare peu le plan de portefeuille promis.
- **Étape 6 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Production robuste, mais objet inadéquat comme bloc majeur d’un entretien senior.
- **Étape 6 · `lmv-valuation-economic-rights` — Valorisation de transaction et principaux termes économiques** — Bonus · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Utile au jugement transactionnel senior, mais lien seulement indirect avec la thèse propriétaire.
- **Étape 6 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Seule leçon bonus fortement reliée aux rendements ; calculs et pratique solides, mais sans synthèse au niveau portefeuille.

### `p-preseed` — Préparer ma pré-seed

Avancée 3/5 · Pertinence 3/5 · Qualité 2/5

Les six étapes sont résolues (`data/parcours.json:804-908`), mais la production promise — one-liner et mini-deck — n’existe ni comme étape ni comme livrable suivi. Les trois leçons représentent 21 minutes et le cas 10 minutes, très loin des 4 h essentielles/5 h complètes déclarées sans travail pratique estimé. Le cas final contient une incohérence arithmétique certaine.

**Proposition d'amélioration.** Créer un livrable exécutable « one-liner + mini-deck cinq slides », avec gabarit, critères, première version et révision, puis y rattacher les exercices de narratif, d’instrument et de dilution.

**Étapes hors leçons ou non résolues**

- `fundraising-scenario` — Scénario de levée (Pratique, résolu)
- `dilution` — Simulateur de dilution (Pratique, résolu)
- `cs-dilution-journey` — La dilution d'un fondateur, du seed à la Series C (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-founder-narrative` — Le narratif de levée** — Cœur · Avancée 2/5 · Pertinence 3/5 · Qualité 2/5
  Introduction pertinente mais trop courte, sans exercice de one-liner, avec « 10×+ », opposition banque/VC et « armer un allié » non sourcés et trop catégoriques (`data/lessons.json:2097-2156`).
- **Étape 2 · `lf-instruments` — Le BSA-AIR vs l'Obligation Convertible** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5
  Les deux instruments sont décrits, mais sans vraie grille SAFE/BSA-AIR/priced round et avec des prescriptions absolues telles que « roi » ou « préférez toujours » (`data/lessons.json:4022-4077`).
- **Étape 3 · `lf-dilution` — Lever sans se faire diluer bêtement** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Sujet central, mais titre non institutionnel, règle universalisée de 15–25 %, injonctions juridiques non sourcées et absence d’exemple calculé ou d’exercice (`data/lessons.json:3963-4019`).

### `p-seed` — Préparer ma seed

Avancée 3/5 · Pertinence 2/5 · Qualité 2/5

Sept étapes sont résolues et le bonus `todo-process-levee` reste un placeholder (`data/parcours.json:911-1039`). Le deck seed, la cap table post-tour et `rubric-deck-seed` ne correspondent à aucune production accessible. Les quatre leçons représentent 25 minutes et le cas 9 minutes face à 6 h essentielles/7,5 h complètes déclarées.

**Proposition d'amélioration.** Créer le livrable `deck seed + cap table post-tour`, relié à une grille réellement consommée, puis restructurer le parcours autour de traction, preuves, deck, modèle de tour, data room, revue et révision.

**Étapes hors leçons ou non résolues**

- `pre-post-money` — Pre-money / Post-money (Pratique, résolu)
- `ownership` — Ownership & cap table (Pratique, résolu)
- `cs-liquidation-preference` — Effets des clauses de préférence sur la valeur fondatrice (Respiration, résolu)
- `todo-process-levee` (Bonus, à produire)

**Leçons du parcours**

- **Étape 1 · `l-founder-narrative` — Le narratif de levée** — Cœur · Avancée 2/5 · Pertinence 3/5 · Qualité 2/5
  Réutilisée sans adaptation seed, elle n’aborde ni traction attendue, ni preuves, ni construction détaillée du deck, et conserve plusieurs affirmations absolues non sourcées.
- **Étape 2 · `lf-dataroom` — Cinq erreurs fréquentes de data room** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 3/5
  Leçon la plus sobre du parcours, mais limitée à un inventaire sans source ni checklist produite, avec une règle de révélation plus catégorique dans le quiz que dans le corps (`data/lessons.json:4197-4252`).
- **Étape 3 · `lf-instruments` — Le BSA-AIR vs l'Obligation Convertible** — Cœur · Avancée 3/5 · Pertinence 2/5 · Qualité 2/5
  Contenu orienté pré-seed/bridge qui ne répond pas vraiment à « priced round vs BSA-AIR au stade seed », avec prescriptions universelles non sourcées.
- **Étape 6 · `lf-liquidation` — Comprendre la préférence de liquidation** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Exemple 1× utile, mais « clause la plus importante », « hérésie », « ruine » et « seul garde-fou » dramatisent des normes non sourcées (`data/lessons.json:4080-4136`).

### `p-serie-a` — Préparer ma Série A

Avancée 1/5 · Pertinence 2/5 · Qualité 2/5

Le parcours avancé annonce 8 h essentielles/10 h complètes, mais ne contient que quatre leçons, soit 32 minutes, deux simulateurs, un cas de 10 minutes et un placeholder cœur bloquant (`data/parcours.json:1042-1200`). Le jalon « négociation simulée + cap table multi-tours » n’a ni livrable, ni grille, ni révision. Le hook avance notamment ARR ≈ 2,5 M€ sans source.

**Proposition d'amélioration.** Remplacer `todo-attentes-serie-a` par une séquence exécutable et sourcée : attentes Série A contextualisées, term sheet française clause par clause, cap table multi-tours, négociation scénarisée, livrable, autoévaluation et révision.

**Étapes hors leçons ou non résolues**

- `todo-attentes-serie-a` (Cœur, à produire)
- `waterfall` — Waterfall simplifiée (Pratique, résolu)
- `dilution` — Simulateur de dilution (Pratique, résolu)
- `cs-dilution-journey` — La dilution d'un fondateur, du seed à la Series C (Respiration, résolu)

**Leçons du parcours**

- **Étape 2 · `l-ts-economics` — Les termes économiques** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Introduction utilisable mais courte, non sourcée et sans exercice ; « standard », « rare », « douce » ou « brutale » ne sont pas contextualisés.
- **Étape 3 · `l-ts-control` — Les termes de contrôle** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Board, veto, pro-rata et vesting sont identifiés, mais en profondeur insuffisante pour un niveau avancé, sans mise en situation ni sources.
- **Étape 7 · `l-founder-narrative` — Le narratif de levée** — Cœur · Avancée 2/5 · Pertinence 2/5 · Qualité 2/5
  Leçon générique de pitch qui ne traite pas l’objectif d’étape « négocier sans casser la relation », avec ton promotionnel et absence d’exercice.
- **Étape 8 · `lf-board` — Le board, la gouvernance et le contrôle en SAS** — Cœur · Avancée 2/5 · Pertinence 3/5 · Qualité 1/5
  Sujet pertinent, mais absolus juridiques non sourcés sur pacte, majorité fondatrice et veto, sans réserve sur statuts, droit applicable ou conseil, et redondance avec `l-ts-control`.

### `p-mener-un-tour` — Mener un tour de table

Avancée 3/5 · Pertinence 2/5 · Qualité 3/5

Toutes les étapes existent (`data/parcours.json:1203-1303`), mais le parcours ne produit ni syndication, ni term sheet, ni négociation de lead, malgré son jalon. Les cinq leçons, le cas et les deux pratiques structurées donnent 165 minutes connues avant simulateurs, contre 360 minutes affichées. Deux prérequis sont violés : `lmv-returns-waterfall` exige `lmv-valuation-economic-rights`, absente ; `l-stages` exige `l-actors`, absente, alors que le parcours annonce aucun prérequis.

**Proposition d'amélioration.** Ajouter une production finale où l’apprenant définit l’ownership cible, construit le syndicat et rédige/défend une term sheet sur dossier, avec hypothèses, grille, retour et révision ; remettre ensuite les prérequis avant les waterfalls.

**Étapes hors leçons ou non résolues**

- `ownership` — Ownership & cap table (Pratique, résolu)
- `waterfall` — Waterfall simplifiée (Pratique, résolu)
- `cs-liquidation-preference` — Effets des clauses de préférence sur la valeur fondatrice (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-ts-economics` — Les termes économiques** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Bonne orientation, mais trop sommaire pour mener un tour avancé, sans analyse de scénarios, exercice ou source.
- **Étape 2 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Contenu précis, exemples cohérents, quatre quiz et pratique de 45 minutes ; les trois références enregistrées n’ont pas été vérifiées extérieurement.
- **Étape 3 · `l-ts-control` — Les termes de contrôle** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Thèmes appropriés mais profondeur, sourcing et mise en situation insuffisants pour négocier la gouvernance d’un tour.
- **Étape 5 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Cœur · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Calculs solides et pratique de 75 minutes, mais une large partie sur DPI/RVPI/TVPI détourne de l’objectif société et le prérequis déclaré manque.
- **Étape 7 · `l-stages` — Stades de financement et continuité du capital** — Cœur · Avancée 4/5 · Pertinence 2/5 · Qualité 4/5
  Leçon substantielle, prudente, référencée et dotée d’un exercice, mais débutante, placée en fin de parcours avancé et sans `l-actors`.

### `p-levee-fonds-lp` — Lever son fonds VC (LPs & Institutions)

Avancée 3/5 · Pertinence 3/5 · Qualité 2/5

Les 11 étapes sont résolues (`data/parcours.json:1306-1469`) : huit leçons, deux simulateurs et un cas. Les leçons totalisent 59 minutes et le cas 8 minutes, sans décomposition reproduisant 4,7 h essentielles/6,2 h complètes. `l-actors` précède son prérequis `l-fund-lifecycle`, lequel exige `l-power-law`, absente, malgré « Aucun pré-requis particulier ». Le pitch deck/PPM et la note de thèse promis n’existent pas comme production.

**Proposition d'amélioration.** Créer un livrable longitudinal LP avec brief, canevas de deck/PPM, note de thèse, exigences de sources, grille, première version, retour, révision et export.

**Étapes hors leçons ou non résolues**

- `management-fees` — Frais de gestion & budget de fonds (Pratique, résolu)
- `fund-returns` — Fund returns : DPI / TVPI / MOIC (Pratique, résolu)
- `cs-europe-vs-valley` — Les spécificités du capital-risque européen (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-actors` — Acteurs, mandats et chaîne d'allocation du capital** — Cœur · Avancée 4/5 · Pertinence 3/5 · Qualité 4/5
  Structurée, nuancée, référencée, avec exercice et quatre quiz, mais débutante et placée avant son prérequis `l-fund-lifecycle`.
- **Étape 2 · `l-fund-lifecycle` — Cycle de vie et économie d'un fonds** — Cœur · Avancée 4/5 · Pertinence 3/5 · Qualité 4/5
  Contenu complet avec calculs, exercice, quiz et références, mais niveau débutant et prérequis `l-power-law` absent.
- **Étape 3 · `l-fees-carry` — Fees, carry & waterfall** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Micro-leçon non sourcée et sans exercice, présentant « 2 & 20 », hurdle et ordre de waterfall comme quasi universels.
- **Étape 4 · `l-fund-metrics` — Lire les métriques d'un fonds** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 3/5
  Formules et exemple utilisables avec trois quiz, mais sans source, production ou véritable exercice d’interprétation.
- **Étape 7 · `llp-pitch` — Le pitch GP : séduire les Limited Partners** — Cœur · Avancée 2/5 · Pertinence 5/5 · Qualité 2/5
  Très alignée mais courte, non sourcée et sans activité, avec des absolus sur le risque d’équipe et le GP commitment à 1–2 %.
- **Étape 8 · `llp-process` — Le process de levée : du teaser au closing** — Cœur · Avancée 2/5 · Pertinence 5/5 · Qualité 2/5
  Séquence documentaire pertinente, mais repères chiffrés non sourcés, sans checklist de data room ni production de PPM.
- **Étape 9 · `llp-france` — Trouver et convaincre des LPs en France** — Cœur · Avancée 2/5 · Pertinence 5/5 · Qualité 1/5
  Sujet central, mais affirmations institutionnelles, réglementaires, de tickets et de négociation non sourcées, mouvantes et formulées comme recettes.
- **Étape 10 · `l-reserves` — Réserves & follow-on** — Bonus · Avancée 2/5 · Pertinence 3/5 · Qualité 2/5
  Approfondissement bref et redondant avec `l-fund-lifecycle`, sans source ni exercice, trop catégorique sur 40–60 % de réserves et les « gagnantes ».

### `p-meilleur-analyst` — Devenir un meilleur Analyst

Avancée 3/5 · Pertinence 3/5 · Qualité 4/5

Les 11 leçons sont publiées et plusieurs sont mûres, notamment le cours mathématique. L’objectif final dépend toutefois de `milestone:todo-ecrire-memo`, placeholder sans route, grille ni workflow. La charge connue atteint déjà 67 min de lecture + 405 min de contributions, contre environ 5 h/6 h affichées, avant même le mémo.

**Proposition d'amélioration.** Produire `todo-ecrire-memo` comme livrable complet : dossier d’entrée, gabarit, grille, première version, retour, révision et autoévaluation ; recalculer ensuite la durée et resserrer la séquence.

**Étapes hors leçons ou non résolues**

- `todo-ecrire-memo` (Pratique, à produire)
- `cs-power-law-portfolio` — Anatomie d'un portefeuille en loi de puissance (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-screening` — Qualification initiale et compatibilité avec la stratégie du fonds** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Sources, quiz et exercice solides, mais niveau débutant, prérequis `l-sourcing` omis et *pattern matching* peu travaillé.
- **Étape 2 · `l-team-market` — Analyse du marché, de la concurrence et de la chaîne de valeur** — Cœur · Avancée 4/5 · Pertinence 3/5 · Qualité 4/5
  Analyse de marché complète et sourcée, mais traite peu l’équipe malgré le libellé et omet `l-founder-analysis`.
- **Étape 3 · `l-traction-unit-economics` — Traction, qualité du revenu et lecture des unit economics** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Réconciliation, sensibilités et exercice utiles, sans jeu de données suivi et avec forte redondance avec `lmv-unit-economics`.
- **Étape 4 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Pratique · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Calculs, sensibilités, sources, quiz et contribution de 45 min mûrs, mais `l-pipeline-crm` manque en amont.
- **Étape 4 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Pratique · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Exécutable dans le dossier longitudinal, précis et scénarisé, mais répète largement l’étape précédente sur les unit economics.
- **Étape 4 · `lmv-cash-flow-scenarios` — Modèle de trésorerie, runway et scénarios de financement** — Pratique · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Modèle dynamique, trois scénarios, contrôles et pratique de 60 min solides, au prix d’un élargissement marqué du parcours.
- **Étape 4 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Pratique · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Primaire, secondaire et contrôles de titres sont précis, mais relèvent davantage de la structuration spécialisée.
- **Étape 4 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Pratique · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Pool, dilution composée et contrôle à 100 % sont exécutables, mais dépassent le cœur généraliste annoncé.
- **Étape 4 · `lmv-valuation-economic-rights` — Valorisation de transaction et principaux termes économiques** — Pratique · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Prix, juste valeur, droits et waterfall sont très aboutis, mais trop avancés pour la trajectoire intermédiaire centrale.
- **Étape 4 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Pratique · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  MOIC, TRI, DPI/RVPI/TVPI et waterfall sont sourcés et exercés ; le TRI de 23,69 % se réconcilie à 23,6935 %.
- **Étape 5 · `l-dd-process` — Plan de due diligence fondé sur les risques** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Due diligence par les risques, sourcée et praticable, mais registre produit seulement en prose et non suivi.

### `p-passer-associate` — Passer Associate

Avancée 3/5 · Pertinence 3/5 · Qualité 2/5

Les cinq leçons sont publiées, mais quatre sont des fiches de 165–234 mots, sans source ni exercice. La promesse « Thèse + DD défendue » n’est représentée par aucune étape ou production ; le parcours affiche 6 h/7 h pour 39 min de lecture en `medium`, puis 9 min de cas en `high`.

**Proposition d'amélioration.** Créer une production finale de thèse et DD défendue, puis réécrire `l-thesis-anatomy`, `l-defending-thesis`, `l-ts-economics` et `l-ts-control` avec sources, dossier, objections, scénarios, grille et niveau avancé.

**Étapes hors leçons ou non résolues**

- `waterfall` — Waterfall simplifiée (Pratique, résolu)
- `cs-liquidation-preference` — Effets des clauses de préférence sur la valeur fondatrice (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-thesis-anatomy` — Anatomie d'une thèse** — Cœur · Avancée 2/5 · Pertinence 3/5 · Qualité 2/5
  Introduction utile à la falsifiabilité, mais 181 mots, deux quiz, aucune source, exercice ou production ; « Falsifiable ou rien » est trop péremptoire.
- **Étape 2 · `l-defending-thesis` — Défendre une thèse** — Cœur · Avancée 2/5 · Pertinence 3/5 · Qualité 2/5
  Pre-mortem et humilité pertinents, mais aucun scénario de comité, objection, source ou grille pour entraîner une défense.
- **Étape 3 · `l-dd-process` — Plan de due diligence fondé sur les risques** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Seule leçon approfondie et sourcée, mais `lmv-returns-waterfall` manque et « DD complète » surpromet une lecture isolée.
- **Étape 4 · `l-ts-economics` — Les termes économiques** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Préférence, anti-dilution et pool sont listés sans calcul ni exercice ; « douce et standard » et « brutal et rare » sont non sourcés.
- **Étape 5 · `l-ts-control` — Les termes de contrôle** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Board, veto, pro rata et vesting sont évoqués sans juridiction, scénario ou pratique ; « les meilleurs investisseurs » est promotionnel.

### `p-passer-principal` — Passer Principal

Avancée 2/5 · Pertinence 3/5 · Qualité 2/5

Trois leçons courtes seulement couvrent gouvernance, réserves et triage ; le jalon « Plan de réserves + thèse » n’est ni une étape ni un livrable. La charge connue est de 23 min de leçons, 34 min avec le cas, contre 6 h/7 h annoncées.

**Proposition d'amélioration.** Câbler un livrable chiffré : modèle de réserves, politique de follow-on, cas de board, thèse, critères, autoévaluation et révision ; approfondir ensuite gouvernance et sources.

**Étapes hors leçons ou non résolues**

- `fund-returns` — Fund returns : DPI / TVPI / MOIC (Pratique, résolu)
- `cs-power-law-portfolio` — Anatomie d'un portefeuille en loi de puissance (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-ts-control` — Les termes de contrôle** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Fiche introductive de 187 mots, deux quiz, aucune source ni situation de board ; les règles dépendent pourtant du contexte juridique.
- **Étape 2 · `l-reserves` — Réserves & follow-on** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Sujet central mais réduit à 156 mots sans allocation ; « 40–60 % » et « toujours coûteux » ne sont pas sourcés.
- **Étape 3 · `l-triage` — Le triage du portefeuille** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Taxonomie mémorisable mais binaire, sans critères ou exercice ; « walking dead » et « accepter la mort » dégradent le ton.

### `p-penser-gp` — Penser comme un GP

Avancée 3/5 · Pertinence 4/5 · Qualité 3/5

Le bloc Monte Carlo est substantiel, mais l’objectif « relation LP » est presque absent : `l-fees-carry` et `l-fund-metrics` sont directes et n’apportent pas `llp-pitch`, `llp-process` ou `llp-france`. Le jalon « Mini-modèle de fonds + note LP » n’est pas exécutable. Lecture connue : 85 min, 104 min avec les cas, contre 6 h/7,5 h annoncées.

**Proposition d'amélioration.** Créer un livrable réunissant hypothèses, portefeuille simulé, sensibilité, waterfall nette et note LP ; ajouter une vraie séquence LP et rendre le simulateur `power-law` explicitement pratiqué.

**Étapes hors leçons ou non résolues**

- `fund-returns` — Fund returns : DPI / TVPI / MOIC (Pratique, résolu)
- `cs-power-law-portfolio` — Anatomie d'un portefeuille en loi de puissance (Respiration, résolu)
- `cs-europe-vs-valley` — Les spécificités du capital-risque européen (Bonus, résolu)

**Leçons du parcours**

- **Étape 1 · `l-fees-carry` — Fees, carry & waterfall** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Bonne orientation, mais « 2 & 20 », hurdle à 8 % et waterfall unique sont non sourcés et sans variantes de structure.
- **Étape 2 · `l-fund-metrics` — Lire les métriques d'un fonds** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 3/5
  Définitions et exemple chiffré cohérents, mais ambiguïté du MOIC fonds, aucune source et aucun calcul à livrer.
- **Étape 3 · `l-reserves` — Réserves & follow-on** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Pertinente pour un GP, mais doctrine « gagnantes uniquement », 40–60 % et signaling absolu sont non sourcés.
- **Étape 4 · `l-triage` — Le triage du portefeuille** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 2/5
  Cohérente avec l’allocation, mais trop binaire pour un public avancé et dépourvue de critères ou dossier de décision.
- **Étape 5 · `lpl-average-lies` — Pourquoi la moyenne ment en VC** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 3/5
  Bonne introduction moyenne/médiane/concentration, mais exemple hypothétique, ton dramatique et quiz de simple reconnaissance.
- **Étape 5 · `lpl-why-monte-carlo` — Pourquoi utiliser Monte Carlo** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 3/5
  Objectif, limites et sensibilités clairs, mais distributions non calibrées par une source et aucun scénario comparatif exigé.
- **Étape 5 · `lpl-simulator-engine` — Comment le simulateur tire les portefeuilles** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Documentation détaillée, mais « les 9 curseurs ne sont pas décoratifs » est faux pour le TVPI : `ownershipPct` n’alimente pas les retours simulés.
- **Étape 5 · `lpl-read-results` — Lire TVPI, concentration et fund returner math** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 3/5
  Percentiles, seuils et fund-returner sont bien expliqués, mais « bon fonds » à 2× et « vraie surperformance » à 3× sont non sourcés.

### `p-term-sheet` — Décoder une term sheet

Avancée 3/5 · Pertinence 4/5 · Qualité 2/5

Les trois leçons et les deux ressources complémentaires sont accessibles, dans une séquence logique économie → contrôle → pratique française → simulation → cas. Le contenu reste toutefois non sourcé, sans exercice chiffré ni term sheet annotée. Plusieurs pratiques contractuelles variables sont formulées comme des standards généraux, notamment dans `lts-standard-francais`. Le ton de l’accroche et des contenus — « sans trembler », « vraie TS », « brutal », « bien plus dure », « meilleurs investisseurs » — s’écarte du registre sobre et institutionnel imposé par `docs/ARCHITECTURE_EDITION.md:214-232`.

**Proposition d'amélioration.** Fournir une term sheet française annotée et sourcée, avec scénarios chiffrés, grille de lecture et production révisable ; faire relire les qualifications juridiques et supprimer les généralisations non étayées.

**Étapes hors leçons ou non résolues**

- `waterfall` — Waterfall simplifiée (Pratique, résolu)
- `cs-liquidation-preference` — Effets des clauses de préférence sur la valeur fondatrice (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-ts-economics` — Les termes économiques** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Synthèse courte avec quiz, mais sans source ni exercice chiffré et avec des jugements catégoriques sur l’anti-dilution et les « termes propres ».
- **Étape 2 · `l-ts-control` — Les termes de contrôle** — Cœur · Avancée 3/5 · Pertinence 4/5 · Qualité 2/5
  Vue d’ensemble utilisable et deux quiz, mais aucune pratique de matrice de veto ou de négociation et plusieurs généralisations non sourcées.
- **Étape 3 · `lts-standard-francais` — La Term Sheet clause par clause (Standard Français)** — Cœur · Avancée 3/5 · Pertinence 5/5 · Qualité 2/5
  Contenu substantiel, mais sans source ni exercice ; certaines pratiques de SAS, liquidation, anti-dilution et good/bad leaver exigent contextualisation et revue juridique.

### `p-cap-table` — Lire un cap table sans paniquer

Avancée 3/5 · Pertinence 3/5 · Qualité 3/5

Les deux leçons mathématiques `lmv-*` sont mûres, sourcées, calculées et assorties de pratiques structurées. Le parcours reste incomplet comme trajectoire : `l-stages` est périphérique au calcul de cap table et son prérequis `l-actors` est absent ; le jalon « Construire une cap table » n’est ni une étape ni un livrable propre au parcours. Le cas final contient une incohérence arithmétique certaine : les dilutions successives de 22 %, 20 %, 16 % et 14 % laissent **45,08 %**, non « ≈ 28 % » (`data/caseStudies.json`, `cs-dilution-journey`).

**Proposition d'amélioration.** Transformer le jalon en cap table réellement produite, réconciliée et autoévaluée ; corriger le scénario final et rattacher explicitement les contributions `math-vc-dossier` à cette production.

**Étapes hors leçons ou non résolues**

- `ownership` — Ownership & cap table (Pratique, résolu)
- `dilution` — Simulateur de dilution (Pratique, résolu)
- `cs-dilution-journey` — La dilution d'un fondateur, du seed à la Series C (Respiration, résolu)

**Leçons du parcours**

- **Étape 1 · `l-stages` — Stades de financement et continuité du capital** — Cœur · Avancée 4/5 · Pertinence 2/5 · Qualité 4/5
  Leçon structurée, sourcée, avec exercice et quatre quiz, mais centrée sur stades, risques et runway ; son prérequis `l-actors` manque.
- **Étape 2 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Définitions, méthodes, exemples réconciliés, limites, trois références, quatre quiz et contribution de 45 minutes ; calculs cohérents.
- **Étape 3 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Méthode séquencée, pool et dilution recalculables, références, quatre quiz et contribution de 75 minutes ; contenu directement exécutable.

### `p-carry` — Le carry, enfin clair

Avancée 3/5 · Pertinence 4/5 · Qualité 3/5

Le parcours juxtapose une introduction simplifiée non sourcée, une leçon mathématique approfondie et une seconde synthèse largement redondante. `lmv-returns-waterfall` dépend de `lmv-valuation-economic-rights`, absent malgré « Aucun pré-requis ». Le jalon « Lire un relevé de fonds » n’est pas matérialisé. La charge annoncée est également incohérente : 28 minutes de lecture plus 75 minutes de pratique structurée, avant même le simulateur, dépassent déjà les 1 h 15 déclarées.

**Proposition d'amélioration.** Construire une séquence non redondante : cadre sourcé des frais et du carry, calculs, simulateur, puis véritable relevé de fonds autoévalué ; dériver le temps des activités rendues.

**Étapes hors leçons ou non résolues**

- `fund-returns` — Fund returns : DPI / TVPI / MOIC (Pratique, résolu)

**Leçons du parcours**

- **Étape 1 · `l-fees-carry` — Fees, carry & waterfall** — Cœur · Avancée 2/5 · Pertinence 5/5 · Qualité 2/5
  Introduction avec quiz, mais sans source ni exercice ; conventions de 2 %, hurdle et waterfall trop générales, avec un ton familier ou sentencieux.
- **Étape 2 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Leçon sourcée, précise, calculée, avec quatre quiz, simulateurs et 75 minutes de production ; prérequis absent et détour ponctuel vers les préférences de titres.
- **Étape 4 · `l-fund-metrics` — Lire les métriques d'un fonds** — Cœur · Avancée 3/5 · Pertinence 3/5 · Qualité 3/5
  Synthèse claire mais non sourcée, sans livrable et redondante ; « spectaculaire » et « les chiffres mentent rarement » contreviennent à la charte.

### `p-market-sizing` — Dimensionner un marché (TAM/SAM/SOM)

Avancée 3/5 · Pertinence 4/5 · Qualité 4/5

Les deux leçons sont approfondies et bien séquencées, mais la promesse « Sizer un marché » n’est pas exécutée par le parcours : aucun cas ou livrable final n’existe. Les trois budgets rendent exactement les mêmes étapes. La charge visible — 12 minutes de lecture, 45 minutes de contribution structurée, puis un exercice d’une page non estimé — n’est pas correctement représentée par les 45/60 minutes annoncées. Les prérequis `l-pipeline-crm` et `l-founder-analysis` sont absents malgré « Aucun pré-requis ».

**Proposition d'amélioration.** Ajouter un cas ou livrable résolu exigeant TAM/SAM/SOM, contre-vérification, sensibilités et `why now`, avec autoévaluation, révision et charge suivie.

**Étapes hors leçons ou non résolues :** aucune.

**Leçons du parcours**

- **Étape 1 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Méthodes, sources, sensibilités, exemples transparents, calculs corrects, trois références, quatre quiz et contribution de 45 minutes ; prérequis CRM non préparé.
- **Étape 2 · `l-team-market` — Analyse du marché, de la concurrence et de la chaîne de valeur** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Complément pertinent sur concurrence, chaîne de valeur et `why now`, mais exercice fictif non structuré, non estimé et non suivi ; sources peu reliées proposition par proposition.

### `p-unit-economics` — Unit economics & Rule of 40

Avancée 3/5 · Pertinence 3/5 · Qualité 4/5

CAC, marge, payback, LTV, cohortes et sensibilités sont bien traités, calculés et sourcés. En revanche, la Rule of 40 annoncée dans le titre, le but, l’accroche et le jalon n’est ni calculée ni appliquée : elle reste une mention contextuelle. Les deux leçons se recouvrent fortement. `l-traction-unit-economics` exige `l-product-analysis`, absent malgré « Aucun pré-requis particulier ». Les trois budgets affichent les mêmes deux étapes et le jalon « Diagnostiquer une boîte » n’est pas exécutable.

**Proposition d'amélioration.** Ajouter un cas ou livrable consacré à la Rule of 40 avec formule, conventions de croissance et de marge, sensibilités et critères de recevabilité ; réconcilier ensuite temps, prérequis et modes.

**Étapes hors leçons ou non résolues :** aucune.

**Leçons du parcours**

- **Étape 1 · `l-traction-unit-economics` — Traction, qualité du revenu et lecture des unit economics** — Cœur · Avancée 4/5 · Pertinence 3/5 · Qualité 4/5
  Leçon précise et calculée, avec exercice en prose et quatre quiz, mais sans pratique structurée, sans Rule of 40 appliquée et avec prérequis absent.
- **Étape 2 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Leçon mûre avec pratique structurée de 45 minutes et sensibilités LTV/churn, mais redondante et sans formule, cas ou source spécifique pour la Rule of 40.

### `p-express-entretien` — L'entretien VC en 1 h

Avancée 3/5 · Pertinence 2/5 · Qualité 3/5

Le parcours est lisible, mais son mode par défaut combine 55 min de lecture avec 405 min de contributions mathématiques ; le mini-case reste un placeholder alors que les métadonnées annoncent une heure et « sans livrable ».

**Proposition d'amélioration.** Produire un mini-case d’entretien chronométré et évalué ; remplacer le cours mathématique intégral par une sélection d’opérations réellement testées, ou annoncer honnêtement la charge longue.

**Étapes hors leçons ou non résolues**

- `todo-mini-case-express` (Pratique, à produire)

**Leçons du parcours**

- **Étape 1 · `l-roles` — Rôles, responsabilités et gouvernance de la décision** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Sobre, sourcée, exercice RACI et quiz utiles, mais `l-vc-week` manque et l’entretien est peu contextualisé.
- **Étape 2 · `l-team-market` — Analyse du marché, de la concurrence et de la chaîne de valeur** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Bonne grille de lecture rapide et sourcée, mais traite peu l’équipe et omet `l-founder-analysis`.
- **Étape 3 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Très adapté à un case technique, avec calculs, sources, quiz et contribution de 45 min, déjà peu « express ».
- **Étape 3 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  CAC, marge, payback et LTV sont précis et praticables, mais la contribution de 45 min consomme presque toute la promesse.
- **Étape 3 · `lmv-cash-flow-scenarios` — Modèle de trésorerie, runway et scénarios de financement** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Modèle rigoureux, mais niveau et exercice de 60 min disproportionnés pour un aperçu débutant.
- **Étape 3 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Bonus · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Calculs directement utiles en entretien technique, mais ajoutent 45 min de production.
- **Étape 3 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Bonus · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Solide et recalculable, mais intermédiaire et assortie de 75 min de pratique.
- **Étape 3 · `lmv-valuation-economic-rights` — Valorisation de transaction et principaux termes économiques** — Bonus · Avancée 5/5 · Pertinence 2/5 · Qualité 4/5
  Contenu très abouti mais trop avancé et spécialisé pour une préparation d’une heure.
- **Étape 3 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Bonus · Avancée 5/5 · Pertinence 3/5 · Qualité 4/5
  Exact et exécutable, mais 75 min de contribution transforment l’aperçu en module approfondi.

### `p-express-lever` — Lever en 1 h : l'essentiel

Avancée 3/5 · Pertinence 4/5 · Qualité 2/5

Les trois étapes sont résolues (`data/parcours.json:2435-2508`) : deux leçons totalisant 17 minutes puis `fundraising-scenario`, sans durée déclarée pour la simulation. L’heure affichée n’est donc pas reproductible. Le parcours assume « sans livrable », mais la promesse de préparation rapide au choix d’un instrument dépasse la profondeur réelle.

**Proposition d'amélioration.** Structurer une séance de 60 minutes explicite : canevas de narratif, courte grille de choix d’instrument, scénario chiffré exportable et checklist de premier rendez-vous.

**Étapes hors leçons ou non résolues**

- `fundraising-scenario` — Scénario de levée (Pratique, résolu)

**Leçons du parcours**

- **Étape 1 · `l-founder-narrative` — Le narratif de levée** — Cœur · Avancée 2/5 · Pertinence 5/5 · Qualité 2/5
  Bonne entrée mais seulement 174 mots, sans source ni exercice, avec généralisations « 10×+ », opposition banque/VC et métaphore « armer un allié ».
- **Étape 2 · `l-founder-instruments` — SAFE, priced round & dilution** — Cœur · Avancée 2/5 · Pertinence 4/5 · Qualité 2/5
  Distingue brièvement SAFE/BSA-AIR et tour en actions, mais sans grille de choix, calcul pratique, conditions de conversion ou distinction juridique suffisante.

### `p-venture-philanthropy-foundations` — Fondamentaux de la venture philanthropie

Avancée 4/5 · Pertinence 4/5 · Qualité 4/5

Les 6 cours développent **21 leçons uniques**, toutes publiées, ordonnées et dotées d’un `body`, de quatre quiz, de trois ou quatre références et d’une contribution structurée. Les prérequis forment une chaîne interne antérieure à chaque cible. Le ton est généralement sobre et distingue correctement faits, hypothèses, inférences, données fictives et limites professionnelles. Le classeur recalculable annoncé pour Trait d’Union est absent, l’horizon du modèle précède la décision qu’il doit éclairer, le déficit brut de 2,614 M€ n’est pas réconcilié avec le besoin incrémental de 1,65 M€, et aucun praticien n’a encore validé le parcours.

**Proposition d'amélioration.** Corriger d’abord l’exécutabilité de Trait d’Union — classeur, horizon du modèle, réconciliation financière et compteurs de charge — puis soumettre le dossier actuel à des praticiens distincts en venture philanthropie/impact, finance-comptabilité et droit/safeguarding, sans transformer leurs retours en certification implicite.

**Étapes hors leçons ou non résolues**

- `cs-vp-insertion-3-regions` — Dossier apprenant : Trait d’Union (Cœur, résolu)
- `vp-exercice-cumulatif-probleme-preuves` — Exercice cumulatif : problème, preuves et personnes concernées (Pratique, résolu)
- `vp-fiche-escalade-juridique` — Fiche d’escalade juridique et conformité (Cœur, résolu)
- `vp-exercice-cumulatif-diligence` — Exercice cumulatif : diligence organisationnelle et financière (Pratique, résolu)
- `vp-exercice-cumulatif-recommandation` — Exercice cumulatif : recommandation, financement et sortie (Pratique, résolu)
- `vp-atelier-perspective-financeur` — Atelier facultatif : perspective du financeur et du portefeuille (Bonus, résolu)
- `vp-recommandation-soutien` — Recommandation de soutien en venture philanthropie (Pratique, résolu)
- `cs-vp-energie-des-vallees` — Cas de transfert : Énergie des Vallées (Bonus, résolu)

**Leçons du parcours**

- **Étape 2 · `lvp-mandat-triage` — Définir l’approche et cadrer le mandat** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Cadre praticable pour distinguer VP, subvention, VC et impact investing ; frontières métier encore à confirmer.
- **Étape 2 · `lvp-screening-additionalite` — Qualifier, différer ou refuser un dossier** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Triage complet, prudent sur les risques critiques, avec production, correction et quiz exploitables.
- **Étape 3 · `lvp-analyse-probleme` — Cartographier le problème et le système** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Passage efficace du récit au problème borné, à la carte de système et aux questions de diligence.
- **Étape 3 · `lvp-theorie-changement` — Construire et challenger une théorie du changement** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Chaîne causale, hypothèses, explications concurrentes et effets indésirables traités avec profondeur.
- **Étape 3 · `lvp-entretiens-beneficiaires` — Préparer les entretiens et intégrer la voix des bénéficiaires** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Protocole substantiel, mais à confirmer par les compétences éthiques, RGPD et safeguarding.
- **Étape 5 · `lvp-plan-diligence` — Construire le plan de diligence et le registre de preuves** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Registre de preuves, règles de clôture et priorisation rendent la diligence exécutable.
- **Étape 5 · `lvp-mission-gouvernance` — Analyser la mission, la gouvernance et les conflits** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Statuts, pratique, conflits et pouvoir du financeur bien cadrés ; qualification juridique correctement escaladée.
- **Étape 5 · `lvp-equipe-operations` — Évaluer l’équipe, les opérations et la capacité de réplication** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Réplication traitée comme hypothèse à tester, avec capacité, dépendance clé et critères de passage.
- **Étape 5 · `lvp-safeguarding-risques` — Traiter le safeguarding, les risques et les critères d’arrêt** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Frontières de rôle et critères d’arrêt solides ; revue spécialisée indispensable avant usage professionnel.
- **Étape 7 · `lvp-comptes-cout-complet` — Reconstituer les comptes et le coût complet** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Réconciliation et coût complet bien expliqués, mais exercice dépendant d’un classeur absent et d’une validation comptable.
- **Étape 7 · `lvp-tresorerie-reserves` — Analyser la trésorerie, les réserves et la concentration** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Liquidité et doubles comptes précis ; fonds affectés, réserves et engagements restent à qualifier.
- **Étape 7 · `lvp-previsions-scenarios` — Construire une prévision et des scénarios** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Modélisation causale pertinente, mais horizon Trait d’Union arrêté avant l’événement décisionnel.
- **Étape 7 · `lvp-atelier-choc` — Atelier : reconstituer la situation et tester un choc** — Cœur · Avancée 4/5 · Pertinence 4/5 · Qualité 4/5
  Atelier cohérent et contrôlable, mais production du classeur externe non fournie.
- **Étape 9 · `lvp-arbre-instruments` — Choisir l’instrument à partir du besoin** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Séparation claire des usages, entités et flux ; véhicules et « droit vérifié » ne valent pas avis juridique.
- **Étape 9 · `lvp-compatibilite-remboursement` — Vérifier la compatibilité et la capacité de remboursement** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Contrôles et scénarios substantiels ; affirmations juridiques à revalider à la date de décision.
- **Étape 9 · `lvp-termes-financement` — Structurer le montant, les tranches et les conditions** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Tranches, conditions, données et remèdes structurés ; clauses opposables réservées aux professionnels.
- **Étape 9 · `lvp-atelier-structuration` — Atelier : rédiger une note d’options et des termes principaux** — Cœur · Avancée 5/5 · Pertinence 4/5 · Qualité 4/5
  Bonne intégration des usages, entités et solutions de repli, limitée par les qualifications non validées.
- **Étape 10 · `lvp-accompagnement-pouvoir` — Construire l’accompagnement sans créer de dépendance** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Traitement particulièrement abouti du consentement, de la charge interne, du transfert de capacité et de la sortie.
- **Étape 10 · `lvp-mesure-impact` — Piloter une mesure d’impact proportionnée** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Mesure proportionnée, biais, causalité et décisions reliés sans reporting décoratif.
- **Étape 10 · `lvp-suivi-sortie` — Suivre, remédier, renouveler ou sortir** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Remédiation, renouvellement, suspension et sortie forment un état décisionnel clair.
- **Étape 10 · `lvp-recommandation-comite` — Rédiger la recommandation et la défendre en comité** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 5/5
  Note, contreargument, registre de preuves et critères de changement d’avis préparent bien le jalon sans valider humainement la recommandation.

### `p-analyst-foundations` — Fondamentaux de l’analyse en capital-risque

Avancée 3/5 · Pertinence 4/5 · Qualité 4/5

Les sept séquences et 23 leçons sont publiées, cohérentes et bien ordonnées. La lecture totalise 142 min, proche des 2,4 h déclarées, mais sept leçons affichent 405 min de contributions vers `math-vc-dossier`, estimé à 450 min ; `docs/parcours/ANALYST-FOUNDATIONS.md` affirme pourtant qu’aucun livrable autonome n’est rattaché au parcours.

**Proposition d'amélioration.** Décider si `math-vc-dossier` est requis, facultatif ou hors parcours ; l’exposer et le compter dans les deux premiers cas, sinon contextualiser ou retirer les cartes de pratique, puis aligner la documentation maintenue.

**Étapes hors leçons ou non résolues :** aucune.

**Leçons du parcours**

- **Étape 1 · `l-vc-definition` — Définition et périmètre du capital-risque** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Définition prudente, trois sources, qualification et quiz solides, mais production non suivie.
- **Étape 1 · `l-power-law` — Asymétrie des rendements et logique de portefeuille** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 5/5
  Concentration correctement qualifiée, trois références académiques et exercice de portefeuille substantiel.
- **Étape 1 · `l-fund-lifecycle` — Cycle de vie et économie d'un fonds** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Engagements, réserves et métriques sont bien reliés dans un exercice décennal, sans support de remise.
- **Étape 2 · `l-actors` — Acteurs, mandats et chaîne d'allocation du capital** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Cartographie précise des acteurs, droits et responsabilités, avec matrice exploitable et sources.
- **Étape 2 · `l-stages` — Stades de financement et continuité du capital** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Évite les seuils universels et propose une matrice preuves–risques–jalons avec scénarios de runway.
- **Étape 3 · `l-vc-week` — Organisation du travail et traitement d'une opportunité** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Bonne introduction au traitement traçable d’une opportunité, mais planification et passation ne sont pas persistées.
- **Étape 3 · `l-roles` — Rôles, responsabilités et gouvernance de la décision** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Distingue correctement titres et délégations, avec exercice RACI et contrôles de gouvernance.
- **Étape 3 · `l-portfolio-monitoring` — Suivi de portefeuille, reporting et décisions de réinvestissement** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Reporting, thèse de suivi et réinvestissement forment une application professionnelle cohérente et sourcée.
- **Étape 4 · `l-sourcing` — Origination et organisation du sourcing** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Traite le sourcing comme couverture du mandat avec biais, données et conformité, pas comme volume de contacts.
- **Étape 4 · `l-screening` — Qualification initiale et compatibilité avec la stratégie du fonds** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Grille non automatique, faits et hypothèses séparés, cas limites relus ; exercice toutefois entièrement externe.
- **Étape 4 · `l-pipeline-crm` — Gestion du pipeline, qualité du CRM et protection des données** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Modèle de données, transitions, sécurité et automatisation sont bien articulés et sourcés.
- **Étape 5 · `lmv-market-sizing` — Dimensionnement de marché : méthodes, sources et sensibilités** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  TAM/SAM/SOM, sensibilités et capacité commerciale sont recalculables, avec contribution structurée de 45 min.
- **Étape 5 · `lmv-unit-economics` — Calcul et réconciliation des unit economics** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  CAC, marge, payback et LTV sont conventionnés, scénarisés et guidés dans une contribution de 45 min.
- **Étape 5 · `lmv-cash-flow-scenarios` — Modèle de trésorerie, runway et scénarios de financement** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Flux mensuels, liquidité et trois scénarios sont cohérents, avec production structurée de 60 min.
- **Étape 5 · `lmv-pre-post-ownership` — Valorisation pre-money, post-money et ownership** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Primaire, secondaire, prix par titre et détention sont précisément réconciliés dans une pratique de 45 min.
- **Étape 5 · `lmv-dilution-cap-table` — Table de capitalisation, dilution et instruments dilutifs** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Pool pre-money, facteurs de dilution et cap table sont exacts et guidés pendant 75 min.
- **Étape 5 · `lmv-valuation-economic-rights` — Valorisation de transaction et principaux termes économiques** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  Prix, juste valeur, préférences et sorties sont clairement séparés, avec exercice de 60 min.
- **Étape 5 · `lmv-returns-waterfall` — MOIC, TRI, waterfall et scénarios de rendement** — Cœur · Avancée 5/5 · Pertinence 5/5 · Qualité 4/5
  MOIC, TRI, DPI/RVPI/TVPI et waterfalls sont exacts et soutenus par une contribution de 75 min.
- **Étape 6 · `l-fact-hypothesis` — Hiérarchie des sources et qualification des assertions** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 5/5
  Excellent pivot vers l’intégrité : cinq statuts d’assertion, quatre sources et réécriture propositionnelle.
- **Étape 7 · `l-conflicts-conduct` — Indépendance, conflits d'intérêts et règles de conduite** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Prévention, gouvernance et traçabilité des conflits sont bien bornées, sans réduire le contrôle à la divulgation.
- **Étape 7 · `l-confidentiality` — Confidentialité, données personnelles et information sensible** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Minimisation, pseudonymisation, incidents et secret d’affaires sont correctement traités dans un exercice concret.
- **Étape 7 · `l-ai-integrity` — Usage déclaré, encadré et vérifié de l'intelligence artificielle** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Autorisation, minimisation, vérification et déclaration méthodologique composent une pratique claire mais non suivie.
- **Étape 7 · `l-critical-errors` — Contrôles qualité, erreurs critiques et critères éliminatoires** — Cœur · Avancée 4/5 · Pertinence 5/5 · Qualité 4/5
  Contrôle indépendant et correction post-comité clôturent logiquement le parcours par un audit exigeant.

## Limites de la revue

- Les quatre contre-revues ont été conduites en lecture seule puis consolidées dans le présent document ; leurs notes divergentes ont été normalisées selon la méthode ci-dessus.
- Les notes décrivent l’état local courant, y compris les modifications non commitées présentes au moment de l’inventaire.
- Les liens et références ont été comptés et rapprochés des contenus, mais aucune campagne externe complète de validation des sources n’a été conduite dans cette passe.
- Les cas, simulateurs et livrables ont été pris en compte dans la note du parcours et dans la ligne « Étapes hors leçons », mais ne reçoivent pas de note individuelle puisque la demande porte sur les leçons.
- Une note de 5 en avancée indique une complétude observable dans le dépôt ; elle ne vaut ni validation métier, ni certification, ni garantie d’exactitude professionnelle.
