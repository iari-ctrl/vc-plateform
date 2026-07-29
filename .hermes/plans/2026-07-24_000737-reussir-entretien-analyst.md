# Finalisation du parcours « Préparer un entretien Analyst »

> **Pour Hermes :** exécuter ce plan uniquement après validation explicite. Préserver le worktree courant ; ne pas committer, pousser ni déployer.

**Objectif :** rendre `/parcours/reussir-l-entretien-analyst` factuellement traçable, pédagogiquement cohérent et exécutable jusqu’à un livrable final, sans inventer d’entreprise, de données ni de pratique de recrutement.

**Décision recommandée :** conserver les identifiants et URL des 13 leçons, mais reprendre leur contenu et simplifier le parcours. Le périmètre sera explicitement celui d’un poste d’Analyst dans un fonds VC early-stage, principalement français ou européen ; les variantes growth, sectorielles ou très quantitatives seront signalées sans prétendre les couvrir. Les conseils variables selon les fonds seront présentés comme tels ; les chiffres sans source ou sans cohorte définie seront retirés.

## Diagnostic vérifié

- Le validateur strict passe : les références et schémas sont cohérents au niveau structurel.
- Le parcours comporte 19 étapes et développe 20 leçons uniques, mais annonce 15 sessions et 7 à 10 heures sans décomposition reproductible.
- Les 13 leçons du cours totalisent 83 minutes de `readMin`, alors que `c-entretien-analyst.durationMin` annonce 420 minutes. `c-mathematiques-vc` annonce 99 minutes pour 43 minutes de leçons. La lecture connue du parcours atteint 126 minutes pour les 20 leçons uniques, plus 31 minutes de cas ; les simulateurs et le travail personnel ne sont pas estimés.
- Aucune des 13 leçons ne cite une source externe. Plusieurs fréquences, seuils et classements sont présentés comme généraux sans base vérifiable.
- Les trois cas obligatoires ou bonus sont fictifs. Le cas « Atelier » n’est pas signalé comme fictif et mêle en outre des données incompatibles : 18 clients à 8 k€ d’ACV impliquent 12 k€ de MRR, et non 22 k€.
- La référence à un « SaaS conformité CSRD pour PME » est trop large : la Commission européenne décrit le champ comme visant les entreprises dépassant certains seuils de taille et les sociétés cotées, non les PME en général.
- Le jalon `lea-mock` résout vers une leçon. `rubric-mock-analyst` n’a ni registre, ni consommateur, ni validation croisée ; la page du parcours attend pourtant une production locale. Le statut final ne peut donc pas progresser par le parcours normal.
- Sept étapes sont étiquetées « pratique », mais seules les deux simulations sont interactives. Les cas sont des articles déjà résolus, et le cours, `lea-case-study` et `lea-mock` n’offrent aucun espace de production.
- La progression ne mesure que les leçons. La navigation « suivant » suit l’ordre du cours et saute les insertions du parcours ; le mode `low` reste proposé alors que `timeFit` ne prévoit que `medium` et `high`, puis masque toutes les pratiques et le jalon.
- La progression est pertinente dans son intention — processus, analyse, calculs, note, présentation, adéquation au fonds et simulation — mais elle répète plusieurs notions déjà mieux traitées et sourcées dans `c-mathematiques-vc`.
- Le registre mélange tutoiement et vouvoiement, multiplie les anglicismes et emploie des formulations catégoriques ou promotionnelles : « ce qui tombe vraiment », « le marché est le tueur n° 1 », « le candidat fort », « différenciateur n° 1 », « éliminatoire ».

**Verdict :** contenu utile comme fiche de révision, mais **pas publiable comme parcours finalisé en l’état**. Les principaux défauts sont l’absence de traçabilité, les généralisations professionnelles, les cas inventés et le faux jalon final.

## Plan d’implémentation

### 1. Établir la matrice de preuves

Pour chaque affirmation professionnelle ou chiffrée, enregistrer une décision : `conserver et citer`, `contextualiser`, `transformer en paramètre d’exercice` ou `retirer`.

Socle prioritaire :

- DGAFP et U.S. OPM pour la structure d’un entretien et l’usage d’une grille commune, sans extrapoler aux fréquences du recrutement VC ;
- Gompers, Gornall, Kaplan et Strebulaev, NBER/JFE, pour les critères de décision des investisseurs et leurs variations selon stade, secteur et géographie ;
- INSEE, Eurostat et MIT pour les méthodes et sources de dimensionnement de marché ;
- Invest Europe, ILPA, IPEV et France Invest pour les métriques de fonds, valorisations et principes de structuration ;
- mémos publics Bessemer, dont Shopify, comme exemples datés de raisonnement — jamais comme format universel ;
- Commission européenne pour toute mention réglementaire actuelle.

Une source de benchmark ne sera utilisée qu’avec son année, sa population et sa définition. Aucun seuil SaaS, marketplace, ownership ou recrutement ne restera présenté comme une norme générale.

### 2. Réécrire les 13 leçons sans casser leurs URL

**Modifier :** `data/lessons.json`, puis régénérer les dérivés avec la commande canonique.

- adopter un registre français sobre et cohérent ; employer « Analyst » seulement lorsqu’il désigne le rôle canonique, et privilégier le vocabulaire français dans la prose ;
- remplacer les verdicts absolus par des critères observables, des limites et des questions de vérification ;
- distinguer systématiquement fait, hypothèse, calcul, pratique variable et préférence du fonds ;
- structurer chaque leçon autour d’une situation, d’une méthode, d’une mise en application exécutable, de points de contrôle, d’une production attendue et de 2 à 4 références ;
- actualiser `bodyShort`, objectifs, points clés, glossaire, quiz et lectures complémentaires ;
- retirer l’instruction d’envoyer une vidéo sur YouTube : toute captation reste facultative, locale et soumise au consentement des participants ;
- supprimer le seuil de convergence `±15 %` de `lea-market-sizing` et de son quiz ;
- corriger dans `lea-deal-memo` le décompte annoncé de 480 mots — l’exemple actuel en compte environ 214 — ainsi que l’incohérence entre 18 clients, 8 k€ d’ACV et 22 k€ de MRR ;
- retirer de `lea-reverse-questions` le conseil d’attendre une supposée « position de force » pour interroger le turnover, la vacance du poste, les attentes et les conditions de travail ; ces questions légitimes seront posées lorsqu’elles deviennent pertinentes, de manière factuelle ;
- transformer les durées, nombres de réponses et critères « au vert deux fois » en paramètres d’entraînement adaptables, et non en seuils universels de préparation ;
- ne pas faire produire une recommandation binaire lorsque les informations publiques ne la permettent pas : autoriser « à approfondir », « à suivre » ou « à écarter », avec informations manquantes.

Les leçons `lea-market-sizing`, `lea-read-startup` et `lea-technical` deviennent des applications à l’entretien et renvoient aux leçons sourcées existantes, au lieu de réintroduire des seuils génériques.

### 3. Simplifier la trajectoire

**Modifier :** `data/parcours.json` et `data/courses.json`.

Conserver une trajectoire de 13 étapes lisibles :

1. processus possible et informations à confirmer ;
2. recherche sur le fonds ;
3. grille d’analyse adaptable ;
4. lecture d’une startup ;
5. cours sourcé `c-mathematiques-vc` ;
6. note d’analyse ;
7. méthode du cas ;
8. présentation d’une entreprise ;
9. motivations et expériences ;
10. questions au fonds ;
11. préparation pratique du jour de l’entretien ;
12. protocole de simulation ;
13. livrable final.

Retirer de ce parcours les trois cas fictifs et les doublons de simulateurs ; conserver les simulateurs comme ressources des leçons techniques. Passer les durées à une source dérivée et aligner `c-entretien-analyst` comme `c-mathematiques-vc` sur la somme réelle de leurs leçons.

### 4. Remplacer le faux jalon par un livrable exécutable

**Modifier :** `data/deliverables.json` et `data/parcours.json`.

Créer un `capstone` dédié, résolu par l’architecture existante de `/livrables/:slug`, sans nouveau composant :

- choix d’une entreprise réelle et d’un fonds précis ;
- sources publiques datées et liste explicite des informations manquantes ;
- note courte avec position proportionnée aux preuves disponibles ;
- calculs et hypothèses vérifiables ;
- questions de simulation fondées sur les compétences annoncées ;
- autoévaluation qualitative, retour facultatif d’un pair, révision et déclaration locale d’achèvement ;
- modèle `memo-shopify-bessemer`, présenté comme document historique daté et non comme corrigé universel ;
- aucune donnée confidentielle, aucune obligation d’enregistrement et aucun score certificatif.

Supprimer `rubric-mock-analyst` du jalon : la grille détaillée vivra dans le livrable réellement rendu.

### 5. Rendre la trajectoire continue et honnête

**Modifier :** `client/src/pages/learn/ParcoursDetailPage.tsx`, `client/src/pages/learn/LessonPage.tsx`, `client/src/pages/learn/CourseDetailPage.tsx` et les aides de résolution concernées.

- ne proposer que les budgets déclarés dans `parcours.timeFit` ;
- transporter le contexte du parcours vers les leçons et le cours agrégé, puis proposer la prochaine étape réelle du parcours au lieu du seul frère dans le cours ;
- qualifier explicitement le pourcentage existant de « progression de lecture » tant que le livrable final n’est pas achevé ;
- faire reprendre le parcours sur la prochaine leçon non lue ou, lorsque les lectures sont terminées, sur le livrable final non achevé ;
- couvrir la navigation au sein du bloc `c-mathematiques-vc` puis son retour vers l’étape suivante.

### 6. Ajouter les preuves de non-régression

**Modifier :** `client/src/content/parcours.test.ts` et, si l’export du nouveau livrable l’exige, `client/src/lib/learningExports.test.ts`.

Vérifier :

- ordre exact, références publiées et absence des trois cas fictifs dans le parcours ;
- résolution du dernier jalon vers le nouveau livrable ;
- respect de `timeFit`, continuité de navigation et reprise sur le livrable final ;
- présence des sources publiques, du modèle Bessemer et d’une grille qualitative sans score ;
- cohérence entre `readMin`, durée du cours et durée dérivée du parcours ;
- présence de références dans les 13 leçons et absence des formulations absolues retirées ;
- export des sources, hypothèses, inconnues et révision du livrable.

### 7. Valider et clôturer

1. test ciblé RED puis GREEN ;
2. `npm run split:content` — régénération canonique, jamais d’édition directe de `data/generated/` ;
3. `npm run validate:content:strict` ;
4. `npm run check` ;
5. build canonique ;
6. recette Chromium desktop et mobile du parcours, des leçons échantillonnées et du cycle complet du livrable, avec contrôle console ;
7. vérification des URL externes retenues et contrôle ciblé du diff ;
8. mise à jour de `Suivis/ETAT.md` et `Suivis/JOURNAL.md` avec les seuls résultats observés.

Une relecture finale par un praticien récent du recrutement VC restera explicitement distincte de la vérification factuelle. Elle devra confirmer le réalisme des formats proposés sans transformer une pratique de fonds en règle générale.

## Fichiers attendus

- `data/parcours.json`
- `data/courses.json`
- `data/lessons.json`
- `data/deliverables.json`
- dérivés produits par `npm run split:content`
- `client/src/content/parcours.test.ts`
- tests ciblés de `ParcoursDetailPage`, `LessonPage` et `CourseDetailPage`
- `client/src/lib/learningExports.test.ts` si nécessaire
- `Suivis/ETAT.md`
- `Suivis/JOURNAL.md`

Aucune nouvelle dépendance ni nouveau composant métier n’est prévu. Les changements d’interface se limitent au libellé de progression, au filtrage des budgets et à la continuité de navigation.

## Exécution conseillée

**Modèle :** GPT-5.5, effort `high`, pour l’implémentation ; GPT-5.6, effort `high`, uniquement pour la contre-vérification factuelle et l’audit final de ce lot large.

**Parallélisation :** recherches et contre-lectures en parallèle, toutes en lecture seule ; un seul intégrateur écrit dans les quatre JSON partagés. Les validations indépendantes peuvent être lancées en parallèle une fois le diff figé.
