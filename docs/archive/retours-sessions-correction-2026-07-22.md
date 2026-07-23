# Retours d’expérience — session de correction

> **Archive historique — 22 juillet 2026.** Cette rétrospective rassemble les difficultés et apprentissages de S1 à S6. Les règles transversales sont maintenues dans `CLAUDE.md`, section « Session workflow », et les conventions propres au cycle C1–C6 dans `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md` ; le présent fichier ne fait plus partie des lectures ordinaires de session.

## Ce qui aurait pu rendre la session plus fluide

### 1. Mettre à jour les suivis dès la création du plan

Le plan, le snapshot, `Suivis/ETAT.md`, `Suivis/JOURNAL.md` et `Correction.md` auraient dû être traités comme un seul lot de livraison. Cela aurait évité la dissociation entre la matérialisation du plan et son inscription dans le suivi du projet.

### 2. Clarifier plus tôt le résultat attendu

Le périmètre pouvait être annoncé immédiatement : matérialiser le plan, figer le snapshot S1 et mettre à jour les suivis, sans commencer S2. Une formulation explicite du type : « je clôture S1 et je n’engage pas les corrections » aurait réduit l’ambiguïté.

### 3. Gérer plus strictement le worktree mobile

Le dépôt a évolué pendant la session. Il aurait été utile d’appliquer un protocole explicite de worktree mobile : recontrôler son état au début, avant chaque écriture et juste avant la clôture, puis signaler toute modification concurrente séparément. Lorsqu’un espace de travail isolé n’est pas praticable parce qu’une phase dépend de changements non encore consolidés, il faut au minimum attribuer explicitement les fichiers entre chantiers, geler ceux de la phase active et suspendre les modifications parallèles sur ce périmètre.

### 4. Séparer plus nettement les niveaux documentaires

Les rôles auraient dû être posés plus tôt :

- `Correction.md` : audit historique et addenda datés ;
- `Suivis/ETAT.md` : état courant court et remplaçable ;
- `Suivis/JOURNAL.md` : historique append-only ;
- `.hermes/plans/` : plan d’exécution.

### 5. Rendre le plan principal plus compact

Le plan détaillé est complet, mais trop long pour un usage quotidien. Une version principale plus courte, appuyée par une matrice d’identifiants séparée et éventuellement des fiches par session, aurait été plus lisible.

### 6. Ajouter un outil de comparaison du snapshot

Un script réutilisable pour comparer le worktree courant au snapshot S1 aurait simplifié les contrôles : fichiers préexistants inchangés, nouveaux fichiers de mission, sorties générées attendues et écarts non attribués.

### 7. Aligner plus tôt les noms de base et d’URL

Le nom local du projet et la base de déploiement ne sont pas interchangeables. Il fallait expliciter immédiatement la différence entre `vc-platform` en local et la base Pages réellement utilisée.

### 8. Réduire les vérifications redondantes

Plusieurs contrôles ont été refaits manuellement. Une commande de validation unique, synthétique et reproductible aurait réduit la répétition et facilité la clôture.

### 9. Procédé conseillé pour les prochaines sessions

Le flux le plus fluide serait :

1. ouvrir une session Hermes dédiée à la phase et lui donner un titre explicite ;
2. relire `ETAT.md`, la dernière entrée du journal, l’addendum de `Correction.md`, la section active du plan et les instructions du dépôt ;
3. comparer le worktree au snapshot S1 et signaler immédiatement les fichiers non suivis ou les mouvements concurrents ;
4. annoncer le contrat de phase : périmètre, exclusions, fichiers principaux, critères de sortie et matrice racine/sous-chemin lorsque le déploiement est concerné ;
5. inventorier les consommateurs réels du comportement, y compris les renderers génériques et les valeurs provenant des données ;
6. exécuter les cycles RED → GREEN en raccordant tout nouveau test au gate racine dès sa création ;
7. utiliser des tests, builds et prérendus ciblés pendant l’implémentation ;
8. geler le code de la phase avant la revue indépendante et ne plus lancer de build complet tant que des modifications sont encore probables ;
9. attendre le résultat de la revue, corriger les seuls constats bloquants et rejouer les contrôles ciblés ;
10. exécuter un unique gate complet, un unique build final et l’audit automatisé des artefacts après le gel du code ;
11. mettre à jour dans la même passe le plan, `ETAT.md`, `JOURNAL.md` et l’addendum de `Correction.md` ;
12. refaire la comparaison au snapshot, vérifier `git diff --check`, attendre la fin des tâches asynchrones et seulement ensuite produire le bilan final.

### 10. Enseignement principal

La leçon de fond est la suivante : chaque phase doit posséder un contrat explicite, une session dédiée, un point de gel avant revue et une preuve finale unique. Planification, état, journal et audit doivent rester alignés dans le même lot, avec une vérification du worktree mobile et de l’archivage documentaire juste avant la clôture.

## Apprentissages complémentaires après S2

### 11. Utiliser une session distincte par phase

Une même session convient pour l’investigation, les cycles TDD, les corrections et la vérification d’une phase. En revanche, une nouvelle session doit être ouverte à la frontière entre S1, S2, S3 et les phases suivantes. Cette séparation réduit la contamination par les hypothèses anciennes, limite les effets de compaction et oblige à relire l’état réel du dépôt. Le projet et le répertoire Git restent les mêmes ; un worktree distinct n’est nécessaire qu’en cas de travaux parallèles.

### 12. Définir la matrice d’acceptation avant les modifications

Pour un contrat transversal comme la base publique, les critères doivent être posés avant le premier patch. La matrice minimale doit couvrir, à la racine et sous le sous-chemin réel : Vite, React Router, assets publics, manifest, liens issus des données, canonical, Open Graph, sitemap, robots et prérendu. Une telle matrice évite de découvrir tardivement une famille de consommateurs. Chaque critère doit aussi distinguer cinq états : RED reproduit, correctif appliqué, validation locale réussie, revue obtenue et validation de publication. Un gate local vert ne doit pas être confondu avec une revue acceptée ou une recette d’hébergement.

Chaque ligne doit relier explicitement l’exigence, son implémentation, un test négatif, une preuve indépendante et son statut de clôture. Cette traçabilité évite qu’une exigence soit considérée comme couverte parce qu’un composant voisin ou un artefact issu du même pipeline est vert.

### 13. Inventorier les sorties rendues, pas seulement les chaînes sources

Une recherche limitée aux chemins d’assets explicites ne suffit pas. Les renderers génériques peuvent produire des liens racine depuis des fichiers JSON, même lorsque Vite et React Router sont correctement configurés. L’inventaire doit donc inclure les `<a href={...}>`, les navigations dures, les téléchargements, les fragments, les URL externes et les liens qui n’apparaissent qu’après interaction. Un build réussi ne prouve pas que les liens rendus respectent le `basename`.

### 14. Tester les décisions d’intégration pendant la phase RED

Les helpers purs doivent être complétés par des tests des consommateurs. Pour les ressources, il faut couvrir au minimum : route interne, route avec query string, ancre, URL externe, fichier local et format local non encore utilisé comme `zip` ou `pptx`. Le raccordement au gate racine doit faire partie du premier passage au vert, et non d’une correction issue de la revue finale.

### 15. Geler le code avant la revue indépendante

La revue doit porter sur un état que l’on considère prêt à livrer. Lancer une délégation ou un build complet alors que des modifications restent probables entraîne des résultats décalés et des relances coûteuses. Aucun patch ne devrait être appliqué pendant un build final ; toute modification postérieure au gel doit rouvrir explicitement la vérification concernée.

### 16. Réserver le build complet à la clôture

Pendant l’implémentation, les tests unitaires, le typecheck, le lint, les builds client et les prérendus filtrés fournissent une boucle rapide. Le prérendu de l’ensemble public — 663 routes dans l’instantané S2, puis 662 après S3 — doit être planifié une seule fois après le gel du code, suivi d’un audit des sorties. Si le mode strict bloque cette exécution, l’échec doit être conservé, diagnostiqué sur le sous-ensemble concerné, puis suivi d’une nouvelle exécution complète après résolution ou caractérisation. Cette discipline réduit les répétitions sans transformer une relance réussie en effacement de la première anomalie.

### 17. Automatiser l’audit des artefacts de publication

Le contrôle final doit devenir un script reproductible plutôt qu’un probe ad hoc. Il doit comparer le nombre de HTML, les canonical distincts, les `og:url`, le sitemap, les chemins `href/src/poster`, les anciennes origines, la résolution du manifest et les chemins hors base. Ce contrôle complète le comparateur de snapshot du worktree : l’un protège l’attribution des changements, l’autre protège le contrat de publication.

### 18. Attendre les résultats asynchrones avant le bilan

Une revue déléguée lancée en fin de phase doit être terminée et intégrée avant la réponse finale. Consulter partiellement un transcript puis recevoir le résultat après le bilan crée une chronologie confuse et peut produire deux conclusions successives. La règle de clôture doit inclure l’absence de tâche ou de processus encore actif. Si la revue retourne un avis non conforme, la phase repasse explicitement à l’état ouvert. Après correction, il faut distinguer « validations locales redevenues vertes » de « seconde décision indépendante obtenue » ; en l’absence de nouvelle revue, cette limite doit apparaître dans le bilan et les suivis.

Toute délégation doit donc correspondre à une tâche de suivi explicite et bloquante. La tâche principale de vérification ne peut être close tant que chaque délégation attendue n’a pas livré un résultat complet, été déclarée obsolète pour un état identifié ou reçu une décision de report documentée.

### 19. Archiver les documents et les preuves de clôture

Un document à jour mais non suivi par Git n’est pas une preuve durable. Le statut de `Correction.md`, des plans, des snapshots et des éventuels rapports d’audit doit être vérifié avant la clôture. L’absence d’autorisation de commit n’empêche pas de signaler immédiatement le risque et de distinguer « contenu à jour » de « contenu archivé ».

### 20. Produire des sorties de vérification courtes et structurées

Les commandes finales doivent retourner des résumés déterministes : compteurs, différences de sets, nombre d’erreurs et statut global. Une sortie JSON concise ou un rapport enregistré évite de relire de longs logs, facilite les comparaisons entre phases et permet de citer exactement la preuve dans `JOURNAL.md` et `ETAT.md`. Pour chaque gate important, il faut conserver la commande exacte, le statut de sortie, l’horodatage, le résumé et le chemin du journal complet. Cette preuve doit survivre à la compaction d’une session afin qu’un diagnostic précis ne dépende pas de la mémoire conversationnelle.

## Apprentissages complémentaires après S3

### 21. Tester la frontière de processus, pas seulement les fonctions injectées

Un moteur de prérendu testable par injection peut rester défectueux lorsqu’il est exécuté par sa vraie CLI. La matrice RED doit donc couvrir le processus enfant, la propagation du statut de sortie, Chromium indisponible puis disponible, la création et la fermeture des pages, l’écriture d’une route et de `404.html`, ainsi que le head produit par React. Les pages inconnues doivent inclure une route wildcard et une route de détail syntaxiquement valide dont la ressource n’existe pas.

### 22. Ne pas bloquer le processus qui fournit une dépendance au processus enfant

Le test d’intégration a révélé un interblocage de conception : le processus parent hébergeait la connexion WebSocket du navigateur, puis lançait la CLI avec `spawnSync`. Tant que l’enfant attendait le navigateur, le parent bloqué ne pouvait plus servir cette connexion. Lorsqu’un enfant dépend d’un service ou d’une boucle d’événements maintenue par le parent, il faut utiliser `spawn` de façon asynchrone, collecter `stdout` et `stderr`, imposer un timeout et arrêter explicitement l’enfant sur dépassement.

### 23. Tester les échecs d’infrastructure au milieu d’un travail concurrent

Un test où Chromium est entièrement absent ne couvre pas l’échec de `browser.newPage()` après le démarrage d’autres workers. Il faut provoquer cette panne pendant qu’une autre route est encore active, puis vérifier que tous les workers sont attendus, que le serveur et le navigateur ne sont fermés qu’ensuite, que le résumé est un snapshot stable et qu’aucune écriture ne survient après le retour. `Promise.allSettled` répond à l’attente collective, mais la preuve doit porter sur le comportement observable, pas seulement sur le choix de l’API.

### 24. Instrumenter les échecs transitoires du prérendu sans les masquer

Une relance S3 a été bloquée à 657/662 sur cinq métadonnées de cours ; les 27 routes de cours ont ensuite réussi en concurrence 1 puis 6, et le build complet final a réussi sans autre correction. Ce résultat confirme l’utilité du mode strict, mais ne permet pas d’établir la cause de la première anomalie. Pour chaque échec, le rapport devrait conserver la route, le worker, les durées, les erreurs console, les requêtes échouées, le titre, `robots`, la canonical et `og:url` observés. Une nouvelle tentative sur une page neuve peut aider au diagnostic, à condition de signaler l’échec initial et de ne jamais convertir silencieusement une sortie incomplète en succès.

### 25. Centraliser le cycle de vie des navigateurs et serveurs temporaires

Les serveurs locaux, processus CLI et navigateurs doivent être enregistrés par un gestionnaire unique et fermés dans un bloc de nettoyage commun, y compris sur timeout ou assertion échouée. La clôture doit vérifier les ports concernés et l’absence de processus restant. Les notifications de disponibilité doivent être désactivées ou fermées avec leur processus afin d’éviter des alertes tardives après un arrêt déjà effectué.

### 26. Sérialiser les intégrations qui partagent des ressources lourdes

Plusieurs fichiers de tests lançant simultanément Chromium et des serveurs locaux augmentent la variabilité sans améliorer la couverture. Une seule intégration peut partager un navigateur, utiliser des distributions et des ports isolés, puis exécuter les scénarios dans un ordre déterministe. Le gate Node peut être sérialisé pour ces tests, tandis que les suites unitaires sans ressource partagée restent rapides et indépendantes.

### 27. Appliquer une temporalité explicite aux documents de suivi

La documentation ne doit pas être réécrite avant le dernier gate de la phase. `ETAT.md` reçoit l’état courant, `JOURNAL.md` conserve les instantanés successifs sans corriger rétroactivement leurs anciens compteurs, et l’addendum de `Correction.md` réconcilie les constats, les corrections et les limites encore ouvertes. Ainsi, les résultats initiaux de 124 tests Vitest et 27 tests Node restent une preuve historique, tandis que la contre-revue consigne séparément les résultats ultérieurs de 162 et 33 tests.

### 28. Budgéter le contexte et les appels d’outils comme une ressource de la phase

Les recherches, lectures et vérifications indépendantes doivent être regroupées lorsqu’elles peuvent être exécutées en parallèle. Les sorties volumineuses doivent être réduites en résumés enregistrés, et les diagnostics intermédiaires importants doivent être conservés hors du contexte conversationnel. Cette discipline limite les pertes liées à la compaction et évite d’atteindre la limite d’itérations avant la mise à jour documentaire ou le contrôle final.

## Apprentissages complémentaires après S4

### 29. Identifier explicitement l’état examiné par chaque revue

Une revue asynchrone ne doit pas être décrite seulement par son objectif et son heure de lancement. Elle doit être rattachée à un état précis des fichiers examinés : périmètre, compteur de tests, horodatage de gel et, si nécessaire, empreintes locales des fichiers principaux. Aucun de ces fichiers ne doit être modifié avant la réponse. Si une correction intervient malgré tout, la revue en cours devient immédiatement obsolète et ne peut plus contribuer à la décision de clôture ; son éventuelle notification tardive doit être classée comme historique, sans rouvrir automatiquement la phase.

Il faut éviter d’exploiter un transcript partiel pour corriger le code pendant que le même agent continue sa revue. Cette pratique mélange deux états du worktree et garantit presque l’arrivée ultérieure d’un diagnostic chronologiquement dépassé.

### 30. Paralléliser les revues par classe de risque sur un même état figé

Une revue générale unique tend à découvrir les défauts successivement. Pour une phase transversale, deux revues indépendantes peuvent être lancées en parallèle sur le même état gelé :

- une revue « contrat, migrations et sécurité » couvrant corruption, versions futures, quotas, limites, entrées persistées et sinks sensibles ;
- une revue « état et parcours produit » couvrant transitions après échec, historiques bornés, réinitialisations et consultation des données anciennes.

Cette parallélisation ne doit pas diviser arbitrairement les fichiers : chaque agent doit suivre un invariant de bout en bout, de la donnée persistée jusqu’au consommateur. Les constats sont ensuite consolidés en un seul lot de corrections, suivi au plus d’une contre-revue ciblée.

### 31. Distinguer validation structurelle et validation sémantique

Une donnée JSON peut respecter tous les types attendus tout en restant impossible au regard du métier. La matrice de validation doit donc comporter deux niveaux explicites :

- **structurel** : présence des champs, types, tableaux, objets, versions et tailles ;
- **sémantique** : bornes numériques, relations entre champs, sommes agrégées, seuils atteignables, unicité des identifiants et cohérence des états dérivés.

Pour une évaluation, vérifier seulement que `totalScore`, `maxScore` et `awardedPoints` sont finis ne suffit pas. Il faut aussi imposer des valeurs non négatives, `awardedPoints ≤ maxPoints`, l’égalité des agrégats avec leurs composants, des seuils compatibles avec les maxima et la cohérence des booléens `passed`. Cette distinction doit être formulée avant le premier test RED.

### 32. Construire des fixtures intrinsèquement valides et vérifier chaque résultat d’écriture

Une fixture de référence ne doit jamais contourner les règles de production. Les définitions d’évaluation utilisées pendant S4 comportaient initialement 20 points disponibles pour des seuils de 70 et 50 ; un reset pouvait donc échouer alors que le test poursuivait ses assertions sur l’état calculé en mémoire.

Les prochaines suites doivent utiliser des fabriques telles que `createValidFixture`, puis dériver chaque cas invalide par une seule mutation ciblée. Toute opération retournant un résultat structuré — écriture, suppression, reset, migration ou import — doit faire l’objet d’une assertion immédiate sur son statut avant d’utiliser la valeur `next`. Cette discipline empêche qu’un test vert masque un échec de persistance.

### 33. Tester les données importantes conservées hors des collections bornées

Lorsqu’une collection est élaguée mais qu’un élément important est conservé séparément — meilleur résultat, dernier état valide, checkpoint ou brouillon actif — les lecteurs historiques doivent agréger ces deux sources. Il ne suffit pas de tester la réinjection de cet élément lors de la prochaine écriture.

La matrice doit vérifier au minimum :

- le changement de version avant toute nouvelle soumission ;
- l’élément important absent de la collection bornée mais présent dans son champ dédié ;
- la consultation immédiate de l’ancien contexte ;
- l’absence de doublon lorsque l’élément existe encore dans la collection ;
- la conservation après reset et nouvelle soumission.

Cet apprentissage dépasse les certifications : il s’applique à tout store qui sépare historique borné et état de référence.

### 34. Suivre les données persistées jusqu’aux sinks de rendu

`localStorage` doit être traité comme une entrée non fiable, même lorsque l’application est entièrement locale. La validation ne doit pas s’arrêter à la forme des objets : il faut rechercher où chaque valeur est rendue ou exécutée. Les champs utilisés comme `href`, URL de média, identifiant de route, nom de fichier ou contenu HTML nécessitent des règles propres au sink.

Pour les liens internes persistés, une chaîne non vide n’est pas un contrat suffisant. Les chemins protocol-relative, les antislashs, les caractères de contrôle et les schémas `javascript:`, `data:` ou équivalents doivent être refusés avant rendu. L’inventaire de phase doit donc associer chaque champ persistant à ses consommateurs et à sa politique de sécurité.

### 35. Définir avant la revue ce qui est bloquant et ce qui est différé

Une amélioration prévue dans une session ultérieure ne doit ni devenir artificiellement un blocage de la phase courante, ni disparaître du suivi. Pour S4, l’absence de Testing Library et de `jsdom` appartenait à S7 ; l’invariant d’absence de mutation après échec pouvait être démontré par le helper testé et l’inspection de tous ses consommateurs. La règle d’acceptation aurait dû être écrite avant la revue.

Chaque point différé doit comporter : session cible, raison du report, preuve disponible dans la phase courante et condition qui le transformerait en blocage. Cette frontière évite à la fois l’élargissement opportuniste du périmètre et la fermeture prématurée d’un risque réel.

### 36. Employer une terminologie de clôture non ambiguë

« Toutes les tâches sont terminées » doit toujours être qualifié par son périmètre. La formulation attendue est : « toutes les tâches de S4 sont terminées ; le plan global de dix-sept sessions reste en cours ». Le même principe s’applique aux validations : « tests locaux verts », « revue indépendante acceptée » et « publication validée » sont trois états distincts.

Une phase ne doit être annoncée close qu’après : absence de tâche active, absence de revue encore en vol sur son périmètre, intégration de tous les constats applicables, gate final réussi et mise à jour cohérente des documents.

### 37. Préparer S5 avec une orchestration explicite

La prochaine session peut appliquer le dispositif suivant :

1. **Session principale — raisonnement élevé :** extraire les critères S5, établir les invariants d’export/import atomique, de purge, de confidentialité et de synchronisation multi-onglets, puis écrire la matrice RED avant le code.
2. **Implémentation — raisonnement élevé :** travailler par invariant avec tests ciblés, sans lancer prématurément le build complet.
3. **Revues parallèles sur état figé :** une revue sécurité/confidentialité/import et une revue atomicité/purge/conflits, chacune avec un périmètre et un état identifiés.
4. **Correction consolidée :** traiter les constats bloquants en un seul lot et ne demander qu’une contre-revue ciblée si le code a changé.
5. **Clôture mécanique :** exécuter une seule fois les tests S5, le gate racine, le build, le prérendu, le contrôle de baseline et les vérifications de format.
6. **Clôture documentaire :** mettre à jour ensemble `Suivis/ETAT.md`, `Suivis/JOURNAL.md` et l’addendum de `Correction.md`, puis confirmer explicitement que S5 — et non le plan global — est terminée.

Le principe directeur issu de S4 est qu’une preuve n’est valable que pour un état identifié du code. Les revues, tests, compteurs et documents doivent tous se rattacher à ce même état avant qu’une décision de clôture soit formulée.

## Apprentissages complémentaires après S5

### 38. Classifier chaque échec de gate avant de modifier le code

Un gate général peut révéler un défaut sans rapport causal avec la phase active. Avant tout correctif, chaque échec doit être classé dans l’une des catégories suivantes :

- régression introduite par la phase active ;
- défaut préexistant dans le worktree ;
- incohérence transversale qui bloque la vérification générale ;
- travail d’une session ultérieure rendu visible prématurément ;
- contrainte d’environnement ou commande incorrecte.

La décision doit ensuite être explicite : corriger dans la phase courante parce que le gate ne peut pas être clôturé autrement, ou reporter avec une preuve, un risque et une session cible. Pendant S5, les statuts de publication, l’état d’évaluation indisponible et la validation éditoriale appartenaient principalement à S6, mais bloquaient les gates généraux. Ils devaient être qualifiés immédiatement comme anticipation limitée de S6, sans laisser entendre que S6 était close.

### 39. Conserver la première sortie complète d’un échec

La première occurrence est souvent la meilleure preuve. Une sortie résumée à un statut et quelques lignes oblige à reconstituer ensuite l’erreur à partir des fichiers susceptibles d’être concernés. Chaque commande structurante doit donc écrire son flux complet dans un journal dès sa première exécution, avant toute relance :

```bash
npm run typecheck 2>&1 | tee .hermes/logs/s5-typecheck.log
npm run check 2>&1 | tee .hermes/logs/s5-check.log
```

Le résumé de clôture peut rester court, mais il doit référencer ce journal. Une relance verte complète l’historique ; elle ne remplace pas la première anomalie ni son diagnostic.

### 40. Utiliser une fiche de commandes canoniques par phase

Les commandes exploratoires ne doivent pas précéder les contrats déjà établis par les sessions antérieures. Pour S5, la fiche de phase devait rappeler dès l’ouverture :

- serveur UI : `npm run dev --workspace client -- --host 127.0.0.1` ;
- build de publication : `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` ;
- ordre attendu des générations, validations, tests et prérendu ;
- commandes ciblées propres au cycle de vie local.

Cela évite de lancer un serveur au mauvais niveau du workspace ou un build voué à échouer faute d’origine canonique. Un échec produit volontairement pour tester le fail-closed doit être annoncé comme tel ; il ne doit pas être confondu avec une régression.

### 41. Préserver la forme des collections éditoriales lors des migrations en masse

L’ajout d’un champ à plusieurs objets JSON ne justifie pas une résérialisation aveugle de collections déjà modifiées. Même lorsque la valeur sémantique est conservée, une réécriture globale peut produire un diff illisible, masquer des changements concurrents et compliquer l’attribution.

Avant une migration en masse, il faut :

1. mesurer la forme et les écarts existants des fichiers concernés ;
2. utiliser une insertion ciblée ou le formateur canonique du dépôt ;
3. contrôler séparément les changements de valeurs et les changements de présentation ;
4. régénérer les index et artefacts dérivés avec les scripts maintenus ;
5. vérifier que seuls les champs attendus ont été ajoutés ou modifiés.

Dans les grands registres comportant de nombreux blocs similaires, les corrections doivent utiliser des patches courts ancrés sur un identifiant unique plutôt qu’un remplacement global ambigu. Lorsqu’un alias ou une relation est supprimé, le contrôle doit porter à la fois sur la source canonique et sur chaque index généré afin d’exclure un artefact obsolète.

### 42. Rendre la recette navigateur déterministe et sémantique

Une interaction basée sur l’indice d’un bouton dans le DOM est fragile. La revue doit employer les rôles, noms accessibles, titres de dialogue et libellés métier stables. Pour une page comme `/profile`, la séquence doit être préparée avant le lancement du serveur : état initial, action, assertion visible, assertion de stockage, nettoyage.

Une seule instance du serveur client suffit. La procédure recommandée est :

1. lancer le workspace client et vérifier son URL ;
2. ouvrir la route cible ;
3. localiser les commandes par leur nom accessible ;
4. exécuter une seule séquence par scénario ;
5. inspecter les erreurs console et l’état local après chaque mutation ;
6. terminer tous les scénarios avant d’arrêter et de fermer le processus.

Des sélecteurs de test stables peuvent être ajoutés lorsqu’aucun contrat accessible ne permet une interaction fiable, mais ils ne doivent pas remplacer les libellés et rôles corrects.

### 43. Ne pas confondre propagation multi-onglets et résolution de conflits

Écouter l’événement `storage` puis relire les données permet à un onglet d’observer une mutation effectuée ailleurs. Cette synchronisation visuelle ne garantit pas qu’une écriture simultanée ne sera pas perdue. Deux onglets peuvent lire la même version, produire deux états divergents et laisser la dernière écriture remplacer la première.

La documentation et les critères de clôture doivent donc distinguer :

- **propagation** : un changement déjà persisté est reflété dans les autres onglets ;
- **détection de conflit** : une écriture sait que sa base est obsolète ;
- **résolution** : révision, fusion par identifiant, rejet ou arbitrage explicite ;
- **garantie anti-perte** : invariant démontré par des tests concurrents.

S5 ferme la propagation pour les principaux domaines utilisateur, mais ne doit pas revendiquer les trois niveaux suivants.

### 44. Qualifier l’atomicité possible avec `localStorage`

`localStorage` ne fournit ni transaction multi-clés ni rollback garanti. Un import peut prendre un snapshot, appliquer les mutations et tenter de restaurer l’état antérieur en cas d’échec, mais la restauration peut elle-même échouer si le stockage devient indisponible ou si le quota est atteint.

Le terme « import atomique » doit donc être accompagné de son contrat réel : validation complète avant écriture, aucune mutation métier avant validation, snapshot préalable, rollback au mieux, rapport précis des clés non restaurées et état React rechargé depuis ce qui est effectivement persisté. Les tests doivent couvrir l’échec pendant l’application et pendant la restauration, pas seulement le succès et le premier échec d’écriture.

### 45. Concevoir l’aperçu d’import comme une frontière de confidentialité

Un aperçu est une fonctionnalité de lecture de données non fiables. Il ne doit ni restituer les notes et réponses libres, ni construire un résumé à partir de leur contenu. Les seules informations nécessaires sont généralement : version d’export, date, domaines présents, nombre d’éléments et éventuels avertissements de compatibilité.

Cette contrainte doit être testée avec des marqueurs sensibles placés dans chaque domaine libre. L’assertion porte à la fois sur l’objet de prévisualisation et sur le texte rendu dans l’interface. Une valeur absente de l’écran mais encore présente dans une structure transmise au composant ne constitue pas une protection suffisante.

### 46. Préparer la migration du corpus avant d’activer un gate fail-closed

Passer de « statut absent = publié » à « seul `published` est public » est une modification de données autant qu’une modification de code. Si le gate est activé avant la migration du corpus, les routes, le sitemap et le prérendu peuvent perdre silencieusement des contenus auparavant publics.

La séquence correcte est :

1. inventorier les valeurs absentes, valides et invalides ;
2. décider explicitement le statut de chaque entrée existante ;
3. migrer les sources canoniques ;
4. régénérer les index, le sitemap et les autres artefacts ;
5. comparer l’ensemble des routes avant et après ;
6. activer le gate fail-closed et ses tests négatifs.

La stabilité du nombre total de routes ne suffit pas : l’égalité chemin par chemin doit être contrôlée afin qu’une disparition et une apparition compensatrices ne s’annulent pas dans le compteur.

La réciproque est également vraie : la parité entre le collecteur, le sitemap et le prérendu ne prouve pas que le corpus attendu est complet lorsque les trois sorties dépendent du même collecteur. Un invariant externe, tel qu’un total public attendu explicitement figé, doit compléter la comparaison exacte des ensembles.

### 47. Maintenir un registre temporaire des décisions de phase

Les décisions intermédiaires importantes ne doivent pas dépendre de la mémoire conversationnelle. Un fichier temporaire de session peut enregistrer, sous forme concise :

- périmètre strict et exclusions ;
- anomalies découvertes et classification ;
- décision de correction ou de report ;
- commandes exécutées et chemins des logs ;
- preuves navigateur ;
- limites encore ouvertes ;
- éléments à reporter dans `ETAT.md`, `JOURNAL.md` et `Correction.md`.

Ce registre n’est pas un quatrième document de suivi durable. Il sert de source de rédaction, puis peut être supprimé après la mise à jour cohérente des trois documents maintenus.

### 48. Réserver explicitement la capacité de clôture

La documentation et le contrôle final ne doivent pas dépendre des appels d’outils restant après l’investigation. La phase doit réserver dès le départ une capacité minimale pour :

1. mettre à jour les trois documents ;
2. rechercher les formulations devenues obsolètes ;
3. vérifier les formats et les processus restants ;
4. produire le bilan final.

Lorsque ce budget est atteint, aucune exploration non bloquante ne doit être engagée. Après le premier gate général vert et le build final vert, la priorité passe immédiatement à la clôture documentaire.

### 49. Vérifier séparément les fichiers suivis et non suivis

Les comparaisons de diff ordinaires ne présentent pas toujours les fichiers non suivis. Un rapport de statistiques peut donc omettre précisément un document critique comme `Correction.md`, même si son contenu est à jour. La clôture doit combiner l’inventaire des chemins, la lecture des documents critiques et les contrôles de format, sans déduire l’absence de changement de l’absence d’un fichier dans un diff.

La leçon principale issue de S5 est la suivante : un gate vert ne suffit pas à définir le périmètre réellement traité. Chaque échec doit être attribué, chaque anticipation d’une session ultérieure doit être déclarée, et les garanties locales — rollback, synchronisation, confidentialité — doivent être formulées au niveau exact démontré par les tests et la recette.

## Apprentissages complémentaires après S6

Les principes déjà établis sur la matrice d’acceptation, le gel avant revue, l’attente des tâches asynchrones, la conservation des journaux, la mise à jour documentaire finale et les patches ciblés ne sont pas répétés ci-dessous. S6 ajoute surtout des enseignements sur la validation éditoriale, les sources et les décisions sémantiques.

### 50. Distinguer la sûreté technique d’une URL de la qualité de sa source

Une URL HTTPS valide démontre seulement qu’elle respecte la politique de navigation. Elle ne prouve ni que la page est active, ni qu’elle est suffisamment précise, ni qu’elle soutient la définition associée. Les contrôles doivent donc séparer deux gates :

- **sûreté technique** : schéma autorisé, absence de credentials, de caractères de contrôle, de chemin protocol-relative et de protocole exécutable ;
- **qualité éditoriale** : autorité de la source, disponibilité, correspondance avec le terme et couverture effective des propositions publiées.

Une entrée doit rester `editorial` tant que le second gate n’est pas établi. Une meilleure page trouvée sur le même site ne rend pas rétroactivement l’ancienne URL probante : la référence enregistrée doit être remplacée explicitement.

### 51. Auditer les sources proposition par proposition et resserrer le texte

Une source peut confirmer le noyau d’une définition sans couvrir ses exemples, ses bornes, ses conséquences ou ses généralisations. Le verdict doit préciser les propositions confirmées, faiblement étayées et non confirmées, plutôt que qualifier globalement une page de « pertinente ».

Lorsque seule une partie du texte est couverte, deux options sont légitimes : ajouter une source directe pour la proposition résiduelle ou resserrer la formulation sur ce que démontre la référence existante. Accumuler des liens généraux ne remplace pas cette décision éditoriale.

### 52. Traiter les fusions et aliases comme des migrations sémantiques

La proximité lexicale ne suffit pas pour fusionner deux concepts. Avant d’ajouter un alias, il faut vérifier que les termes sont substituables dans le contexte publié et qu’aucun rapport de généralité, de composant ou de mécanisme particulier ne les distingue.

Une fusion trop large peut déformer la recherche, les popovers et les relations du glossaire sans produire d’erreur de schéma. En cas de doute, l’entrée doit revenir à `needs-review`, l’alias incorrect doit être retiré des données publiées et des artefacts générés, et une définition dédiée doit être exigée avant publication.

### 53. Séparer le statut de provenance du statut de workflow

`sourceStatus` décrit la nature de l’étayage ; `status` décrit l’avancement éditorial ou la publication. Une entrée peut donc être `editorial` et `applied`, ou `editorial` et `needs-review`, selon que son contenu est suffisamment stabilisé pour le produit.

Les synthèses doivent présenter séparément les compteurs de classification et le périmètre réellement audité. Dire qu’un registre contient des entrées `source-backed` ne signifie pas que chacune a été revérifiée pendant la phase courante.

### 54. Étendre l’inventaire source-vers-sink à toutes les données éditoriales

Les règles déjà posées pour les valeurs persistées s’appliquent aussi aux collections éditoriales statiques. Tout champ susceptible d’alimenter un `href`, une URL de média, un téléchargement ou une navigation doit être suivi depuis la donnée jusqu’au rendu :

```text
champ de données → schéma → transformation → composant → sink de rendu
```

Le schéma constitue le premier gate ; un helper appliqué juste avant le rendu apporte une défense en profondeur. L’inventaire initial doit couvrir les consommateurs effectifs, et pas seulement les champs dont le nom contient `url` ou `href`.

### 55. Transformer les décisions d’audit éditorial en tests de régression

Les tests ne doivent pas se limiter aux fonctions et aux schémas. Une décision éditoriale structurante peut être figée par un test de données : source institutionnelle attendue, statut prudent, absence d’un alias conceptuellement incorrect ou conservation d’un compteur public explicite.

Ces assertions doivent rester réservées aux décisions stables et justifiées. Elles empêchent qu’une régénération, une fusion automatique ou une migration ultérieure réintroduise silencieusement une conclusion déjà invalidée par l’audit.

### 56. Imposer un contrat de restitution aux audits délégués

Un audit de sources doit recevoir un format de sortie déterministe avant son lancement. Pour chaque terme, le rapport doit au minimum fournir : URL actuelle, état d’accès, propositions couvertes, limites, verdict `confirmed` / `weak` / `not-confirmed`, `sourceStatus` recommandé, éventuelle URL de remplacement et modification éditoriale proposée.

Les audits spécialisés peuvent être exécutés en parallèle sur un état figé, mais leur consolidation doit précéder la contre-revue finale. Cette dernière doit examiner l’état obtenu après intégration des constats, et non un état intermédiaire dont les résultats deviendraient obsolètes pendant leur production.
