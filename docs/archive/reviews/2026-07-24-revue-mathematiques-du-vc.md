> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Revue corrigée et plan d'exécution — Mathématiques du capital-risque

**Objet audité** : le cours `c-mathematiques-vc`, ses sept leçons `lmv-*`, ses usages dans sept parcours et ses relations avec les livrables, simulateurs, durées et certifications.

**Sources techniques de vérité** : `data/courses.json`, `data/lessons.json`, `data/parcours.json`, `data/deliverables.json`, `data/certifications.json`, les types de `client/src/content/`, le rendu des pages d'apprentissage et `scripts/validate-content.mjs`. Les fichiers de `data/generated/` sont des sorties ; ils ne doivent pas être modifiés directement.

**Statut du document** : plan de correction et d'exécution fondé sur l'état courant du dépôt. Il ne constitue ni une validation juridique des clauses contractuelles, ni une validation professionnelle de certification. Les chiffres du futur dossier longitudinal devront être présentés comme des hypothèses méthodologiques, sauf lorsqu'une source publique précisément vérifiée est citée.

---

## 1. Verdict et cible

Le cours est structurellement valide et publiable comme ressource de lecture. Ses calculs sont, pour l'essentiel, exacts. Il reste néanmoins au moins deux défauts de contenu à corriger : une formule générale mal définie en L5 et un cas secondaire insuffisamment spécifié en L4. Plusieurs passages exigent en outre des conventions plus explicites, notamment sur la LTV, l'horizon de trésorerie (`runway`), les plafonds de participation et le TRI.

Le déficit principal porte sur l'exécution pédagogique. Les leçons demandent déjà des calculs dans leurs sections « Mise en application », mais l'interface ne recueille, ne vérifie et ne conserve aucune réponse numérique. Les sept exercices ne sont rattachés à aucun livrable, les simulateurs ne couvrent pas tous les mécanismes enseignés et les temps de pratique ne sont pas intégrés de manière homogène dans les parcours.

| Dimension | État courant | Cible vérifiable |
|---|---|---|
| Validité structurelle | Les données et références passent la validation stricte | Maintenir un contrôle strict sans champ ni référence orpheline |
| Exactitude mathématique | Exemples majoritairement justes ; formule L5 incorrectement définie ; ambiguïté L4 | Formules, conventions, unités et arrondis vérifiés mécaniquement |
| Consommabilité publique | Sept leçons lisibles, 43 min de lecture | Lecture autonome préservée, sans verrou pédagogique |
| Exécution pédagogique | Consignes présentes, mais aucune production reliée | Une contribution guidée et contrôlable par leçon, réunie dans un dossier longitudinal |
| Continuité | Six entreprises ou niveaux d'analyse distincts | Un dossier d'entreprise cohérent pour L1 à L6, puis une sortie et un portefeuille de fonds distinct en L7 |
| Temps | Lecture clairement affichée ; pratique non calibrée | Lecture, contributions et consolidation distinguées sur chaque surface pertinente |
| Certification | Alignement thématique, aucune relation curriculaire formelle | Préparation recommandée éventuelle, distincte de l'évaluation et de la délivrance |
| Validation professionnelle | Aucune validation externe établie | Revue financière et, pour les clauses, revue juridique explicitement consignées avant toute qualification professionnelle |

La cible n'est pas de bloquer l'accès ni de transformer les quiz formatifs en examen. Elle consiste à relier lecture, calcul, contrôle, explication et révision, conformément au principe produit de liberté responsable.

### 1.1 Ce qui doit être préservé

- la structure régulière des leçons : cadre, méthode, exemple, limites, application et références ;
- les distinctions entre faits, hypothèses, conventions et limites ;
- les critères de recevabilité déjà présents dans les mises en application ;
- le caractère autonome de chaque leçon et la navigation libre ;
- la séparation entre progression locale, production pédagogique et certification ;
- les identifiants et slugs publics, sauf nécessité de migration explicitement décidée.

### 1.2 Ce qui doit changer

- corriger les deux défauts de contenu et les formulations financières ambiguës ;
- stabiliser un dossier longitudinal sans forcer les métriques de fonds dans le même objet comptable ;
- rattacher les sept contributions à un livrable exécutable ;
- ajouter une saisie numérique formative avec correction ;
- rapprocher les simulateurs des calculs après avoir complété leur périmètre ;
- rendre les prérequis conceptuels visibles sans dupliquer l'ordre des parcours ;
- réconcilier toutes les surfaces de durée ;
- expliciter le positionnement du cours par rapport aux leçons voisines.

### 1.3 Plan de correction priorisé

Le plan doit être lu comme un programme de correction, pas comme une liste d'options. Les priorités ci-dessous distinguent les erreurs à corriger, les clarifications pédagogiques à rendre visibles et les évolutions fonctionnelles nécessaires pour transformer le cours en parcours réellement exécutable.

| Priorité | Nature | Travail à conduire | Résultat attendu | Preuve de sortie |
|---|---|---|---|---|
| P0 | Correction d'erreur | Corriger la formule générale du pool en L5 | La règle publiée définit clairement `P₀`, `T₀`, `x` et `c` | Contre-calcul du complément `0,588235` et test de non-régression |
| P0 | Correction d'ambiguïté | Réécrire le cas primaire/secondaire de L4 | Montant payé, cash reçu par la société, titres émis et titres transférés se réconcilient | Table de flux et de titres totalisant correctement |
| P0 | Clarification financière | Corriger l'interprétation du plafond 2x en L6 | Le plateau, la conversion et l'écart avec une participation non plafonnée sont distingués | Tableau multi-sorties vérifié à 40, 50, 70, 80 et 100 M€ |
| P0 | Clarification pédagogique | Distinguer en L3 l'horizon jusqu'à zéro et l'horizon jusqu'au seuil de gestion | `13,71 mois` et `12 mois` ne portent plus le même sens | Libellés distincts dans le texte, le quiz et la correction |
| P1 | Clarification financière | Ajouter la sensibilité LTV actualisée sans déqualifier la formule simplifiée | La LTV reste comprise comme une approximation dépendante des conventions | Tableau à 0 %, 8 %, 10 % et 12 %, conventions explicites |
| P1 | Cohérence pédagogique | Créer un dossier longitudinal L1 à L6 et isoler les trois niveaux d'analyse de L7 | L'apprenant produit un modèle continu sans confondre société, ligne et fonds | Dossier, livrable, correction et classeur cohérents |
| P1 | Exécution pédagogique | Rattacher chaque mise en application à une section de livrable | Les sept exercices deviennent des contributions observables | Sept `practice.sectionId` résolus vers sept composants |
| P2 | Évolution fonctionnelle | Ajouter les réponses numériques formatives | L'apprenant calcule, reçoit une correction et conserve une lecture libre | Schéma strict, tests DOM, accessibilité et tolérances |
| P2 | Évolution fonctionnelle | Compléter les simulateurs avant de les intégrer dans le corps des leçons | Les simulateurs reproduisent les exemples qu'ils accompagnent | Tests des moteurs et presets alignés sur les leçons |
| P2 | Cohérence catalogue | Clarifier titre, prérequis, parcours, temps et préparation `VC Analyst` | Le cours est correctement situé dans l'offre sans promesse excessive | Tests de contenu, parcours, certification et navigation |

Ordre recommandé : verrouiller le contrat numérique, corriger les erreurs P0, créer le dossier pédagogique, rendre la pratique adressable, ajouter les questions numériques, compléter les simulateurs, puis seulement harmoniser catalogue, parcours et préparation à la certification. Cet ordre évite de construire une interface ou une navigation sur des hypothèses qui changeraient ensuite.

---

## 2. Vérification mathématique et corrections requises

### 2.1 Valeurs confirmées, avec leurs conventions

| Leçon | Valeurs confirmées | Qualification nécessaire |
|---|---|---|
| L1 — Dimensionnement | TAM 72 M€ ; SAM 28,08 M€ ; SOM 2,16 M€ ; SOM/SAM 7,69 % ; sensibilités 21,6 et 21,06 M€ | Les hypothèses de population, d'accessibilité et de prix sont des paramètres de cas, non des benchmarks de marché |
| L2 — Économie unitaire | CAC 15 000 € ; marge 1 500 €/mois ; payback 10 ou 13 mois ; LTV simplifiée 100 000 € ; LTV/CAC 6,67 ; scénario de churn à 3 % : 50 000 € et 3,33 | 66,67 mois est une espérance de durée géométrique, non un horizon certain |
| L3 — Trésorerie | burn 0,35 puis 0,40 M€ ; soldes 2,70 puis 0,30 M€ ; scénario de tension et scénario favorable exacts | 13,71 mois mesure le temps théorique jusqu'à zéro ; 12 mois le temps jusqu'au seuil de 0,60 M€ |
| L4 — Pre/post-money | post-money 16 M€ ; 25 % ; prix 2 € ; 2 millions de titres ; variante 22 M€ pre-money et 3 M€ investis : 12 % | Le secondaire doit préciser montant primaire, montant secondaire, prix, titres émis et titres transférés |
| L5 — Cap table | complément de pool 0,588235 million ; prix 1,133333 € ; émission 3,529412 millions ; pourcentages totalisant 100 % | L'exemple numérique est juste, mais la définition de la formule générale est fausse |
| L6 — Droits économiques | seuil de conversion 40 M€ ; espérances 14,625 et 12,625 M€ ; écart 2 M€ | Le seuil de 40 M€ est une valeur distribuable à la sortie, non la valorisation du tour |
| L7 — Rendements | MOIC 3,0x ; TRI 23,6935 % ; taux annualisé 20,0937 % ; DPI 0,35 ; RVPI 0,90 ; TVPI 1,25 | Le TRI suppose des périodes annuelles régulières ; des dates réelles exigeraient une convention de type XIRR |

### 2.2 P0 — corriger la formule générale du pool en L5

La leçon définit actuellement `P` comme le nombre de titres du pool après complément, puis écrit `(P + x) / (T + x) = c`. Cette rédaction compte le complément `x` deux fois. Le calcul numérique utilise en réalité le pool avant complément.

La formule doit être écrite avec des grandeurs initiales :

\[
\frac{P_0+x}{T_0+x}=c
\qquad\Longrightarrow\qquad
x=\frac{cT_0-P_0}{1-c}
\]

Avec `P₀ = 1`, `T₀ = 10` et `c = 15 %`, le complément reste `0,588235` million de titres. La correction modifie donc la définition et l'explication, pas les résultats numériques. Référence : `data/lessons.json`, leçon `lmv-dilution-cap-table`.

**Critères d'acceptation** :

- `P₀`, `T₀`, `x` et `c` sont définis avant la formule ;
- le dénominateur correspond à la base pleinement diluée retenue ;
- le résultat numérique est recalculé à partir de la formule publiée ;
- le quiz et la mise en application utilisent la même convention ;
- un test de non-régression rejette l'ancienne définition.

### 2.3 P0 — spécifier le primaire et le secondaire en L4

Le passage actuel peut être cohérent comme exemple distinct, mais il ne donne pas assez d'informations pour reconstituer l'opération. La correction intermédiaire suivante est exacte pour l'ancien cas à 2 € par titre :

> Sur un paiement total de 4 M€, 3 M€ sont investis dans la société et 1 M€ rémunère un actionnaire vendeur. La société émet 1,5 million de titres au prix de 2 € ; le vendeur transfère 0,5 million de titres existants au même prix. Le total post-opération est de 7,5 millions de titres. L'investisseur détient 2 millions de titres, soit 26,67 %, tandis que la trésorerie de la société n'augmente que de 3 M€. Assimiler le secondaire au primaire surestimerait cette trésorerie de 1 M€, soit 33,33 % par rapport au montant effectivement reçu.

Cette rédaction ne doit être publiée que si L4 reste sur le cas actuel. Si le dossier longitudinal adopte le tour de 10 M€ sur une valorisation pre-money de 30 M€, le scénario secondaire doit être recalculé après fixation définitive de la cap table. Les deux corrections ne doivent pas être appliquées indépendamment.

**Critères d'acceptation** : montant total payé, primaire, secondaire, prix par titre, titres nouveaux, titres transférés, trésorerie reçue et détention finale sont tous explicites et se réconcilient.

### 2.4 P0 — montrer correctement l'effet d'un plafond 2x en L6

À 50 M€ de sortie, la préférence participante non plafonnée produit exactement 20 M€, soit le plafond. Ce point ne montre donc aucun effet contraignant. Sous l'hypothèse d'un investissement de 10 M€, d'une détention de 25 %, d'une préférence 1x participante plafonnée à 2x et d'une conversion possible, le paiement retenu est :

\[
R(E)=\max\left(\min\left(10+25\%\times(E-10),20\right),25\%\times E\right)
\]

| Sortie | Participante non plafonnée | Paiement plafonné | Conversion | Paiement retenu |
|---:|---:|---:|---:|---:|
| 40 M€ | 17,50 M€ | 17,50 M€ | 10,00 M€ | 17,50 M€ |
| 50 M€ | 20,00 M€ | 20,00 M€ | 12,50 M€ | 20,00 M€ |
| 70 M€ | 25,00 M€ | 20,00 M€ | 17,50 M€ | 20,00 M€ |
| 80 M€ | 27,50 M€ | 20,00 M€ | 20,00 M€ | 20,00 M€ |
| 100 M€ | 32,50 M€ | 20,00 M€ | 25,00 M€ | 25,00 M€ |

La formulation à retenir est la suivante :

> Le paiement reste plafonné à 20 M€ entre 50 et 80 M€ de valeur distribuable. Au-delà de 80 M€, la conversion devient plus favorable. Le plafond continue néanmoins de réduire le paiement par rapport à une préférence participante non plafonnée : à 100 M€, l'écart est encore de 7,5 M€.

Le plafond est une contrainte relative pour le détenteur des titres préférentiels et une protection relative pour les autres catégories. Il ne doit pas être décrit comme une simple « fenêtre » sans conséquence économique.

### 2.5 P0 — distinguer les deux runways de L3

La leçon doit employer deux libellés constants :

- `4,8 / 0,35 = 13,71 mois` : temps théorique jusqu'à épuisement de la trésorerie ;
- `(4,8 - 0,60) / 0,35 = 12 mois` : temps jusqu'au seuil opérationnel minimal.

Les scénarios dynamiques doivent continuer à signaler le premier mois de franchissement du seuil, puis le solde observé. Cette distinction évite de présenter un seuil de gestion comme une faillite mécanique.

### 2.6 P1 — enrichir la LTV sans requalifier la formule simplifiée en erreur

La leçon indique déjà que `marge / churn` est une formule simplifiée et en décrit les limites. Une sensibilité actualisée constitue un enrichissement recommandé, non la correction d'un résultat faux.

Sous les conventions suivantes — churn mensuel discret de 1,5 %, première marge certaine reçue en fin de mois, horizon géométrique infini et taux annuel effectif converti en taux mensuel — on obtient :

\[
i_m=(1+i_a)^{1/12}-1
\qquad\text{et}\qquad
\mathrm{LTV}=\frac{1\,500}{0,015+i_m}
\]

| Taux annuel effectif | LTV | LTV/CAC |
|---:|---:|---:|
| 0 % | 100 000 € | 6,67x |
| 8 % | 69 982 € | 4,67x |
| 10 % | 65 291 € | 4,35x |
| 12 % | 61 253 € | 4,08x |

Ces montants changent si la marge est reçue en début de période, si le churn varie avec l'ancienneté ou si l'horizon est borné. L'actualisation est matérielle dans l'exemple, mais elle n'est pas « l'effet le plus lourd » : doubler le churn de 1,5 % à 3 % réduit la LTV simplifiée de 50 %.

### 2.7 Conventions à rendre visibles dans toutes les leçons

Chaque exemple chiffré doit préciser, selon le sujet :

- unité monétaire, nombre de titres et échelle d'affichage ;
- base de capitalisation : émise, fully diluted, avant ou après complément de pool ;
- date et calendrier des flux ;
- revenu, facturation, encaissement et traitement de la TVA ;
- brut ou net, réalisé ou non réalisé, fonds ou ligne d'investissement ;
- arrondi utilisé et contrôle de réconciliation ;
- caractère hypothétique du cas ou source exacte d'une donnée externe.

---

## 3. Cohérence avec l'architecture actuelle

Les constats d'intégration reposent notamment sur les contrats et consommateurs suivants :

| Observation | Trace dans le dépôt |
|---|---|
| Quiz de leçon limité aux options | `client/src/content/types.ts:17-21`, `client/src/components/reading/QuizBlock.tsx` |
| Pratique structurée par livrable et section | `client/src/content/types.ts:48-53`, `client/src/pages/learn/LessonPage.tsx:261-267` |
| Agrégation lecture/pratique sur la page du cours | `client/src/content/learningTime.ts:18-35`, `client/src/pages/learn/CourseDetailPage.tsx:39-67` |
| Temps de parcours dérivé ou déclaré | `client/src/content/learningTime.ts:59-107`, `client/src/content/parcoursTypes.ts` |
| Progression locale globale par livrable | `client/src/lib/learningWorkspace.ts:1-105` |
| Questions numériques de certification distinctes | `client/src/content/certificationTypes.ts`, `client/src/lib/certificationAssessment.ts` |
| Correction révélable après première version | `client/src/pages/intelligence/DeliverablePage.tsx`, `client/src/pages/cases/CaseCorrectionPage.tsx` |
| Téléchargements de cas compatibles avec une base de déploiement | `client/src/pages/cases/CaseStudyPage.tsx:102-114` |

### 3.1 Prérequis conceptuels et ordre de parcours

Le lien `lmv-market-sizing <- l-pipeline-crm` est un artefact de séquençage du parcours `p-analyst-foundations`. Il ne décrit aucune dépendance conceptuelle. Le champ `prerequisiteLessonIds` n'est pas rendu dans l'interface, tandis que l'ordre du cours et l'ordre des parcours sont déjà définis respectivement par `course.lessonIds` et `ParcoursStep.order`.

Il ne faut pas ajouter `parcoursPredecessorId`. Ce champ n'existe pas dans le type ou le schéma strict et dupliquerait l'ordre du parcours. La solution cible est :

1. retirer `l-pipeline-crm` des prérequis de L1 ;
2. conserver la séquence recommandée dans `course.lessonIds` ;
3. utiliser `prereqNote` pour une recommandation propre à un parcours ;
4. réserver `prerequisiteLessonIds` aux connaissances réellement nécessaires ;
5. afficher ces dépendances conceptuelles sur la page de leçon ;
6. ajouter au validateur la détection des cycles, auto-références et incohérences d'ordre.

Le graphe minimal proposé, à confirmer pendant la révision des objectifs, est le suivant :

| Leçon | Prérequis conceptuel proposé | Justification |
|---|---|---|
| L1 — Market sizing | aucun | Leçon autonome |
| L2 — Unit economics | aucun | Ne dépend pas du dimensionnement de marché pour être comprise |
| L3 — Trésorerie | aucun | Le modèle de cash-flow peut être étudié séparément |
| L4 — Pre/post-money | aucun | Introduction autonome au financement en fonds propres |
| L5 — Cap table | L4 | Le prix par titre et la détention post-money sont requis |
| L6 — Droits économiques | L4 | Les droits s'appliquent à une détention issue du tour ; L5 reste recommandé |
| L7 — Rendements et waterfall | L6 | La waterfall reprend les droits économiques ; les métriques de fonds gardent leur propre rappel |

L'ordre L1 à L7 reste recommandé pour le dossier longitudinal, même lorsque la dépendance conceptuelle est absente.

### 3.2 `practice` existe, mais ne suffit pas à créer un dossier suivi

Le contrat `Lesson.practice` exige un `deliverableId`, un `sectionId` et une estimation positive. La page de cours additionne déjà les contributions et affiche le livrable associé. Deux limites doivent être traitées :

- le lien de la leçon ouvre actuellement le livrable sans transmettre `sectionId` ;
- l'espace local conserve un état global par livrable, pas un état par composant.

Le dossier cible nécessite donc un lien profond vers chaque composant, un focus visible et une progression locale par section. La complétion de lecture doit rester indépendante de cette production.

Le validateur doit également refuser un `sectionId` lorsque le livrable ne déclare pas de `components`. Dans l'état courant, cette incohérence peut passer lorsque la collection de composants est absente.

### 3.3 Durées : distinguer cours et parcours

Les 43 minutes correspondent à la lecture des sept leçons. Cette valeur est correctement qualifiée sur la page du cours. `guidedPracticeMinutes` appartient au résumé des parcours dont `time.source` vaut `derived`; il ne remplace pas la durée de lecture du cours.

Le cours apparaît dans sept parcours :

| Parcours | Rôle du cours | Source de temps actuelle | Conséquence de l'ajout de `practice` |
|---|---|---|---|
| `p-stage` | bonus | déclarée | aucun recalcul automatique |
| `p-entretien-analyst` | cœur, `keystone` | dérivée | contributions ajoutées automatiquement |
| `p-entretien-associate` | bonus | déclarée | aucun recalcul automatique |
| `p-entretien-principal` | bonus | déclarée | aucun recalcul automatique |
| `p-meilleur-analyst` | pratique | déclarée | aucun recalcul automatique |
| `p-express-entretien` | bonus | déclarée | aucun recalcul automatique |
| `p-analyst-foundations` | cœur | déclarée | aucun recalcul automatique |

Après calibration des exercices, chaque parcours déclaré doit être soit recalculé manuellement, soit migré vers un temps dérivé. Cette décision doit tenir compte de son budget et du caractère cœur ou bonus du cours. Il ne faut pas supposer qu'un câblage de `practice` corrigera toutes les durées.

### 3.4 Questions numériques : deux sous-systèmes à unifier sans les confondre

Les quiz de leçon ne connaissent actuellement qu'une question à options. Les évaluations de certification possèdent déjà une représentation numérique avec unité et tolérance absolue ou relative, ainsi qu'un parseur acceptant la virgule et le point décimal. Ces capacités ne sont pas consommées par `QuizBlock`.

La cible est une union discriminée pour les quiz formatifs, avec réutilisation des primitives numériques partagées. Le contrat doit couvrir :

- valeur attendue et tolérance absolue ou relative ;
- unités `€`, `k€`, `M€`, `%` et `x`, avec facteurs d'échelle explicites ;
- arrondis et chiffres significatifs ;
- saisies vides, non finies et notation scientifique ;
- correction détaillée, pas seulement un verdict ;
- accessibilité clavier, annonces d'erreur et focus ;
- absence d'effet automatique sur la certification ou la complétion de lecture.

La variante proposée initialement, `numeric { answer, tolerance, unit }`, est insuffisante et incompatible avec le schéma strict actuel.

### 3.5 Simulateurs : navigation valide, couverture incomplète

Les cinq références se résolvent correctement vers les pages de simulateur. Leur périmètre ne couvre toutefois pas tous les calculs du cours :

| Simulateur | Couverture actuelle | Écart à traiter |
|---|---|---|
| `pre-post-money` | valorisations, part investisseur, multiple implicite | adapté à L4 dans son périmètre élémentaire |
| `ownership` | prorata de titres | ne séquence ni tour, ni secondaire, ni création de pool |
| `dilution` | dilution simplifiée par pourcentages | ne résout pas l'équation du pool cible de L5 |
| `waterfall` | préférence, multiple, participation, détention et sortie | aucun plafond de participation ni arbitrage complet de conversion |
| `fund-returns` | DPI, RVPI et TVPI | pas de MOIC par ligne, TRI ou flux datés |

Une intégration Markdown du type `[[simulator:...]]` ne doit pas être utilisée : `[[...]]` est réservé au glossaire et contrôlé comme tel. La progression recommandée est la suivante :

1. placer d'abord un lien contextuel immédiatement après le calcul concerné ;
2. compléter et tester les moteurs de calcul ;
3. définir ensuite un bloc structuré de leçon avec `simulatorId`, `presetId`, consigne et emplacement ;
4. charger le composant à la demande pour ne pas embarquer tous les simulateurs dans chaque leçon.

### 3.6 `contexts` et certification

Les 28 leçons dont les contextes sont renseignés sont actuellement des contenus `upcoming`. Aucun composant de production ne lit `lesson.contexts`. Remplir ce champ sur les sept leçons créerait donc une donnée inerte.

La certification `VC Analyst` couvre déjà les compétences de dimensionnement, trésorerie, capitalisation, valorisation et rendement. Elle ne référence toutefois pas formellement le cours dans sa préparation. Elle est encore en construction et aucune évaluation professionnelle opérationnelle n'est publiée.

Décisions cibles :

- différer `contexts` jusqu'à la définition d'un consommateur et d'un effet observable ;
- examiner l'ajout de `c-mathematiques-vc` à `recommendedPreparation` après stabilisation du cours ;
- ne pas présenter cette relation comme une condition d'éligibilité, une évaluation ou une preuve de compétence ;
- ne créer ni badge ni promesse de délivrance à partir du quiz ou du classeur autoévalué.

### 3.7 Titre, positionnement et recouvrements

Le titre canonique proposé est **« Mathématiques du capital-risque »**. Le slug `mathematiques-du-vc` reste inchangé pour préserver l'URL. Le sous-titre existant — « Marché, économie unitaire, trésorerie, valorisation et rendement » — décrit utilement le périmètre et doit être conservé.

Les labels de parcours peuvent rester contextuels ; ils n'ont pas à devenir identiques. Ils doivent néanmoins employer le titre canonique ou une forme courte cohérente sans changer le sens de l'étape.

La phrase « Ce cours calcule ce que les autres interprètent » est inexacte : plusieurs leçons voisines calculent déjà le CAC, le payback ou les multiples de fonds. Le résumé devrait indiquer :

> Ce cours rassemble et approfondit les méthodes de calcul mobilisées ponctuellement dans les autres ressources. Il met l'accent sur les conventions, les contrôles et les analyses de sensibilité.

Une matrice de recouvrement doit déterminer, pour chaque notion, la ressource canonique, le niveau de profondeur, le public et le lien de transfert. Cette consolidation doit éviter d'ajouter une troisième explication là où une leçon voisine peut renvoyer vers l'approfondissement `lmv-*`.

### 3.8 Classement du cours comme activité pratique

Dans `p-meilleur-analyst`, le cours est classé `pratique` alors qu'il ne porte actuellement aucun livrable exécutable. Deux états sont cohérents :

- avant livraison du dossier : reclasser temporairement l'étape ;
- après livraison : conserver `pratique` et relier explicitement le livrable longitudinal.

Le changement doit être atomique : le catalogue ne doit pas promettre une activité pratique que la route ne permet pas de produire.

---

## 4. Modèle pédagogique cible

### 4.1 Un dossier d'entreprise principal, pas un objet unique artificiel

Le cours utilise actuellement six entreprises ou niveaux d'analyse. La cible doit être un dossier longitudinal principal pour L1 à L6, puis une articulation explicite en L7 :

- la waterfall reprend la sortie de l'entreprise du dossier ;
- les métriques DPI, RVPI et TVPI utilisent un portefeuille de fonds distinct ;
- le scénario de TRI d'une ligne reste identifié comme une ligne d'investissement ;
- chaque changement d'unité d'analyse est annoncé dans le texte et dans le classeur.

Le cas doit être qualifié de **cas fictif méthodologique**. Ses chiffres servent à apprendre une méthode et ne constituent pas des benchmarks sectoriels. Toute donnée externe ajoutée ultérieurement doit être datée, attribuée et accompagnée de ses limites de transfert.

### 4.2 Socle chiffré à stabiliser avant réécriture

Le socle suivant permet une continuité sans prétendre reproduire une entreprise réelle :

| Bloc | Hypothèses cibles | Contrôle attendu |
|---|---|---|
| L1 | 30 000 organisations ; 18 000 accessibles ; 65 % de fit ; revenu annualisé 24 000 € ; cible 900 clients | TAM 720 M€ ; SAM 280,8 M€ ; SOM 21,6 M€ ; SOM/SAM 7,69 % |
| L2 | revenu mensuel moyen 2 000 € ; marge brute 75 % ; CAC 15 000 € ; installation 4 500 € ; churn mensuel 1,5 % | payback 10 ou 13 mois ; LTV simplifiée et sensibilité actualisée avec conventions visibles |
| L3 | base clients et revenu issus de L2 ; calendrier de facturation et de recouvrement séparé ; trésorerie initiale et scénarios existants | revenu, facturation et encaissement se réconcilient sans être assimilés |
| L4 | tour de 10 M€ sur 30 M€ pre-money ; secondaire traité comme variante explicite | post-money 40 M€ ; détention économique 25 % ; flux primaire et secondaire séparés |
| L5 | 10 millions de titres avant complément, dont 1 million de pool ; cible de pool 15 % avant investissement | complément 0,588235 ; prix 2,833333 € ; émission 3,529412 ; total des pourcentages 100 % |
| L6 | investissement de 10 M€ et détention de 25 % ; préférence 1x ; participation et plafond traités séparément | seuil de conversion à 40 M€ de valeur distribuable ; tableau multi-sorties réconcilié |
| L7 | sortie de l'entreprise pour la waterfall ; flux datés d'une ligne ; portefeuille séparé pour DPI/RVPI/TVPI | conservation de la valeur distribuée ; VAN du TRI proche de zéro ; DPI + RVPI = TVPI |

L4 doit introduire la relation `10 / 40 = 25 %` au niveau des valorisations, puis annoncer que le prix exact par titre dépend de la base pleinement diluée et du pool traité en L5. Il ne faut pas présenter `30 M€ / 10 millions = 3 €` comme le prix définitif si le complément de pool fait partie des termes du même tour.

Le ratio `40 / 6 = 6,67x` peut être conservé comme exercice de discussion uniquement s'il est nommé `equity value post-money / ARR`, daté au même point du scénario et distingué d'un multiple `EV/ARR`. Le terme « réaliste » doit être retiré faute de comparables définis et datés.

### 4.3 Production attendue par leçon

| Leçon | Contribution au dossier | Contrôle intégré | Soutien interactif cible |
|---|---|---|---|
| L1 | tableau TAM/SAM/SOM, sources et sensibilités | unités, dénominateurs, SOM dérivé de la capacité | calculateur de sensibilités ou lien contextuel |
| L2 | modèle CAC, marge, payback, LTV et sensibilités | cohérence des périodes et du calendrier des marges | question numérique et tableau de sensibilité |
| L3 | prévision mensuelle de trésorerie à trois scénarios | solde d'ouverture + encaissements − décaissements = solde de clôture | contrôle du seuil et du mois de franchissement |
| L4 | valorisation, primaire, secondaire et détention | trésorerie reçue distincte du paiement total | `pre-post-money` puis scénario ownership |
| L5 | cap table fully diluted avant et après tour | somme à 100 %, conservation des titres et pool cible | simulateur de pool étendu |
| L6 | matrice de droits et paiements par scénario de sortie | conservation de la valeur distribuée et arbitrage de conversion | waterfall avec plafond et conversion |
| L7 | MOIC, TRI, waterfall et métriques de fonds | VAN proche de zéro ; DPI + RVPI = TVPI ; unités d'analyse séparées | flux datés et métriques de fonds étendues |

Chaque contribution suit le même cycle : données → calcul → contrôle → interprétation → révision. Le corrigé doit montrer les étapes et les conventions, pas seulement une valeur finale.

### 4.4 Dossier, livrable et classeur

L'architecture existante permet de constituer un ensemble cohérent :

- un nouveau cas `cs-mathematiques-vc-dossier`, avec `learningRole: "learner-dossier"`, dans `data/caseStudies.json` ;
- un livrable `math-vc-dossier`, avec `activityKind: "cumulative-exercise"`, dans `data/deliverables.json` ;
- sept `components`, un par leçon ;
- une correction commentée `corr-mathematiques-vc-dossier` dans `data/caseCorrections.json`, révélable après une première version ;
- un classeur initial dans `client/public/downloads/mathematiques-vc/`, sans formules ni conclusion préremplie ;
- les sept champs `Lesson.practice` pointant vers les composants correspondants.

Les identifiants de composants proposés sont `market-sizing`, `unit-economics`, `cash-flow`, `pre-post-ownership`, `cap-table`, `economic-rights` et `returns`. Ils doivent être utilisés sans variante dans le livrable, les pratiques, les tests et les ancres de navigation.

Le classeur doit contenir des onglets séparés pour les hypothèses, le marché, les unités économiques, la trésorerie, la cap table, les droits et les rendements. Un dictionnaire des unités et un identifiant de version sont obligatoires. Les cellules d'entrée doivent être distinguées des sorties attendues sans révéler les formules.

La correction commentée doit expliquer les réconciliations, variantes acceptables et erreurs fréquentes. Un classeur corrigé placé directement dans `public/` ne peut pas être considéré comme réellement masqué ; la révélation pédagogique doit donc passer par la page de correction, sauf décision explicite d'assumer un corrigé publiquement accessible.

La consigne doit interdire l'import de données CRM, financières, juridiques ou personnelles confidentielles. L'espace local enregistre un état et une note ; il ne téléverse ni ne conserve le classeur.

### 4.5 Charge de travail provisoire

Le budget initial suivant sert à planifier l'interface ; il devra être recalibré par une exécution chronométrée du dossier :

| Leçon | Contribution provisoire |
|---|---:|
| L1 | 45 min |
| L2 | 45 min |
| L3 | 60 min |
| L4 | 45 min |
| L5 | 75 min |
| L6 | 60 min |
| L7 | 75 min |
| Consolidation finale | 45 min |

Les contributions totalisent 405 minutes. Avec 43 minutes de lecture et 45 minutes de consolidation, la charge complète provisoire est de 493 minutes, soit 8 h 13. Ce total n'est pas une mesure observée : il doit rester qualifié de prévision jusqu'à une exécution chronométrée et une revue de la difficulté.

Le cours doit continuer à afficher `43 min de lecture`. Les autres surfaces doivent montrer séparément les contributions guidées et la consolidation. Une carte de bibliothèque ne doit plus afficher un nombre nu lorsque la ressource possède une pratique structurée.

### 4.6 Difficulté et autonomie

La régularité de la structure est conservée, mais la difficulté doit être rendue visible :

- L1 à L3 : fondamentaux de modèle et cohérence des périodes ;
- L4 : passage de la valeur aux titres ;
- L5 : réconciliation fully diluted et pool pre-money ;
- L6 : scénarios contractuels et fonctions de paiement ;
- L7 : flux datés et changement d'unité d'analyse.

Chaque leçon doit fournir un rappel local suffisant pour une lecture directe. Le dossier longitudinal approfondit la progression ; il ne devient pas un verrou d'accès.

### 4.7 Évaluation formative

Chaque leçon conserve ses QCM conceptuels et ajoute au moins une saisie numérique liée au dossier. La réponse numérique comprend :

- la valeur attendue et l'unité ;
- une tolérance adaptée à l'arrondi ;
- une solution en étapes ;
- un contrôle indépendant ;
- une explication de l'erreur la plus probable.

La validation d'un quiz reste locale et formative. Elle ne bloque ni la lecture suivante, ni le livrable, ni une certification. Les états « leçon lue », « calcul tenté » et « contribution produite » restent distincts.

---

## 5. Plan d'exécution

### Principes d'exécution

- Les hypothèses du dossier sont gelées avant toute réécriture des sept leçons.
- Une seule personne ou un seul agent modifie les invariants partagés (`data/lessons.json`, types et validateur) à un instant donné.
- Les revues financières, pédagogiques et techniques restent en lecture seule jusqu'à la consolidation.
- Chaque changement de comportement commence par un cas de non-régression reproductible.
- Les sources canoniques sont modifiées, puis les sorties de `data/generated/` sont régénérées avec les scripts du dépôt.
- Une phase n'est close que lorsque ses critères d'acceptation et ses validations ciblées passent.
- Aucun commit, push ou déploiement ne fait partie de ce plan sans demande séparée.

### Dépendances de mise en œuvre

| Lot | Dépend de | Pourquoi cette dépendance compte | Sortie minimale |
|---|---|---|---|
| Corrections P0 | Phase 0 | Les corrections L4, L5 et L6 dépendent des bases de titres, des flux et du traitement du plafond | Leçons corrigées et contre-calculées |
| Dossier longitudinal | Corrections P0 | Le cas apprenant ne doit pas figer une formule ou une convention encore instable | Cas, livrable, correction et classeur cohérents |
| Pratique adressable | Dossier longitudinal | Les liens profonds et états par composant exigent des `sectionId` définitifs | Sept pratiques navigables et persistées localement |
| Questions numériques | Corrections P0 et primitives numériques partagées | Les réponses attendues, unités et tolérances doivent correspondre aux conventions publiées | Sept calculs formatifs corrigés |
| Simulateurs | Corrections P0 et socle du dossier | Un simulateur intégré doit reproduire le calcul voisin, pas un scénario approchant | Moteurs testés et presets alignés |
| Catalogue et parcours | Dossier, pratiques et temps calibrés | Les durées, labels et promesses de parcours dépendent de l'expérience réellement livrée | Parcours réconciliés et prérequis visibles |
| Vérification finale | Tous les lots précédents | Les contrôles complets n'ont de sens que sur un état gelé | Contrôles techniques, navigation et revue éditoriale clôturés |

### Phase 0 — figer le contrat du dossier

**Objectif** : empêcher que les sept leçons, le classeur et les simulateurs soient recalculés sur des hypothèses concurrentes.

**Décisions à consigner dans ce document avant implémentation** :

1. titre canonique, maintien du slug et réservation des identifiants `cs-mathematiques-vc-dossier`, `math-vc-dossier` et `corr-mathematiques-vc-dossier` ;
2. hypothèses L1 à L7, unités, dates et arrondis ;
3. distinction revenu, facturation et encaissement ;
4. cap table de départ, base fully diluted et traitement du pool ;
5. variante primaire/secondaire ;
6. termes de préférence et convention de plafond ;
7. séparation société, ligne d'investissement et portefeuille de fonds ;
8. graphe minimal de prérequis ;
9. estimations provisoires de contribution ;
10. relation envisagée avec `VC Analyst`.

**Travail** :

- recalculer tous les résultats du socle dans un script déterministe temporaire ;
- établir une matrice `hypothèse → formule → résultat → leçon → contrôle` ;
- classer chaque source externe comme directe, contextuelle ou non confirmée pour la proposition concernée ;
- faire relire la cap table et la waterfall par un second relecteur financier ;
- préparer, sans la revendiquer comme obtenue, une revue juridique des descriptions de clauses.

**Critère de sortie** : aucune même grandeur ne porte deux valeurs ou deux unités incompatibles entre la matrice, le dossier, les leçons et les scénarios de simulateur.

### Phase 1 — corriger l'exactitude éditoriale

**Fichiers principaux** :

- `data/lessons.json` ;
- `client/src/content/lessons.test.ts` ou un nouveau `client/src/content/mathVentureCourse.test.ts` ;
- `scripts/validate-content.mjs` uniquement pour les nouveaux invariants structurels.

**Ordre** :

1. écrire les tests de non-régression pour la définition du pool, les runways, le secondaire et le plafond ;
2. vérifier qu'ils échouent sur les formulations ou invariants actuels ;
3. corriger L3, L4, L5 et L6 ;
4. ajouter la sensibilité LTV de L2 avec toutes ses conventions ;
5. recalculer les quiz concernés ;
6. vérifier toutes les références et formulations de portée.

**Critères d'acceptation** :

- aucune formule n'emploie une variable avec deux significations ;
- chaque flux primaire ou secondaire est réconcilié ;
- le tableau de plafond distingue participation non plafonnée, plateau et conversion ;
- runway jusqu'à zéro et runway jusqu'au seuil portent des libellés différents ;
- la LTV actualisée ne se présente pas comme un résultat universel ;
- « Cadre d'analyse » est conservé en L6, car cette leçon ne porte pas uniquement sur un calcul.

**Validation ciblée** :

```text
npm exec --workspace client -- vitest run src/content/lessons.test.ts src/content/mathVentureCourse.test.ts
npm run validate:content:strict
```

Le second chemin ne doit être inclus dans la commande que si le nouveau fichier est créé.

### Phase 2 — créer le dossier longitudinal et sa correction

**Fichiers** :

- `data/caseStudies.json` : dossier apprenant, explicitement fictif et méthodologique ;
- `data/deliverables.json` : livrable cumulatif à sept composants ;
- `data/caseCorrections.json` : correction commentée révélée après première version ;
- `client/public/downloads/mathematiques-vc/dossier-depart.xlsx` : classeur sans formules ;
- `data/lessons.json` : sept références `practice` et réécriture du cas ;
- `data/courses.json` : titre, sous-titre et résumé ;
- `client/src/content/mathVentureCourse.test.ts` : contrat du dossier.

**Ordre** :

1. ajouter un test exigeant sept leçons publiées, sept composants uniques et sept pratiques résolues ;
2. créer le cas apprenant sans conclusion travaillée ;
3. créer le livrable, son gabarit, sa grille et ses composants ;
4. créer le classeur avec dictionnaire d'unités et identifiant de version ;
5. créer la correction commentée et les sorties de contrôle ;
6. rattacher chaque leçon à sa section ;
7. réécrire les exemples L1 à L7 sur le socle figé ;
8. vérifier que chaque leçon reste compréhensible en accès direct.

**Critères d'acceptation** :

- le dossier apprenant ne contient ni formule préremplie ni conclusion travaillée ;
- le classeur s'ouvre, contient les onglets annoncés et ne contient aucune formule ;
- chaque cellule ou colonne possède une unité non ambiguë ;
- les sept `sectionId` correspondent exactement aux sept `components` ;
- la correction n'est proposée dans l'interface qu'après déclaration d'une première version ;
- tous les chiffres fictifs sont qualifiés comme hypothèses méthodologiques ;
- aucune donnée confidentielle n'est demandée ou conservée dans l'application ;
- chaque leçon possède un contrôle indépendant de son résultat principal.

**Parallélisation possible** : après gel du socle, la production du classeur et la rédaction de la consigne peuvent avancer en parallèle sur des fichiers distincts. La réécriture de `data/lessons.json` reste centralisée.

### Phase 3 — rendre la pratique adressable et réconcilier les temps

**Fichiers** :

- `client/src/pages/learn/LessonPage.tsx` ;
- `client/src/pages/intelligence/DeliverablePage.tsx` ;
- `client/src/lib/learningWorkspace.ts` et `client/src/lib/learningWorkspace.test.ts` ;
- `client/src/content/types.ts` ;
- `client/src/content/learningTime.ts` et un test ciblé de résumé de temps ;
- `client/src/pages/learn/CourseDetailPage.tsx` ;
- `client/src/pages/learn/LibraryPage.tsx` et `LibraryPage.test.tsx` ;
- `data/parcours.json` et, si la politique de budget change, `data/profileParcours.json` ;
- tests DOM à créer pour le lien profond du livrable et le résumé de cours.

**Ordre** :

1. ajouter un test d'ouverture du livrable sur le composant transmis par `sectionId` ;
2. transmettre ce composant depuis la leçon par paramètre ou fragment validé ;
3. rendre le composant ciblé visible, focalisé et annoncé ;
4. étendre l'état local versionné à une progression par composant, avec migration depuis la version précédente ;
5. créer un résumé partagé `lecture / contributions / consolidation / total` ;
6. l'utiliser sur la page du cours et sur les cartes de bibliothèque concernées ;
7. recalculer ou migrer explicitement les sept parcours selon leur contrat de temps ;
8. ajouter le livrable comme étape lorsque sa consolidation doit compter dans un parcours dérivé.

**Critères d'acceptation** :

- le CTA d'une leçon ouvre la bonne section du livrable ;
- les états des sept composants survivent à un rechargement local ;
- une ancienne entrée de stockage reste lisible ou est migrée sans perte silencieuse ;
- la lecture reste déclarable indépendamment de la production ;
- `p-entretien-analyst` compte automatiquement les contributions ;
- les six parcours à temps déclaré ont une décision documentée et des totaux réconciliés ;
- `p-meilleur-analyst` ne reste `pratique` que si le livrable est effectivement accessible ;
- `p-express-entretien` ne promet pas le dossier complet dans un budget d'une heure ;
- aucune durée n'est présentée comme mesurée tant que la calibration n'a pas été réalisée.

### Phase 4 — ajouter les réponses numériques formatives

**Fichiers** :

- `client/src/content/types.ts` ;
- `client/src/content/certificationTypes.ts` si les types numériques communs en sont extraits ;
- `client/src/lib/certificationAssessment.ts` et ses tests ;
- nouveau module pur proposé : `client/src/lib/numericAnswer.ts` ;
- `scripts/validate-content.mjs` ;
- `client/src/components/reading/QuizBlock.tsx` et `QuizBlock.dom.test.tsx` ;
- `data/lessons.json` ;
- `client/src/pages/learn/LessonPage.tsx` seulement si le contrat de rendu l'exige.

**Ordre** :

1. extraire les primitives de parsing et de tolérance sans changer les évaluations de certification ;
2. faire passer les tests existants de certification sur le module partagé ;
3. définir une union `choice | numeric` compatible avec les anciens QCM ;
4. étendre le schéma strict et ajouter des fixtures invalides ;
5. développer le rendu numérique accessible ;
6. ajouter une question numérique et sa correction à chaque leçon ;
7. vérifier les unités, échelles et tolérances sur les sept cas.

**Critères d'acceptation** :

- `1,5`, `1.5`, les pourcentages et les facteurs d'échelle autorisés sont traités de manière déterministe ;
- une valeur non finie, vide ou dans une unité non admise n'est pas notée comme correcte ;
- la tolérance relative et la tolérance absolue ont des tests distincts ;
- la correction explique la méthode et l'arrondi ;
- clavier, focus et annonces de résultat respectent WCAG 2.2 AA ;
- aucune réponse formative n'affecte une certification ou ne verrouille la suite.

Cette phase et la phase 3 touchent `types.ts` et potentiellement `LessonPage.tsx`. Elles doivent être intégrées en série, ou avec une propriété de fichiers explicitement séparée puis une consolidation unique.

### Phase 5 — compléter les simulateurs puis les rapprocher des exemples

#### Phase 5A — moteurs de calcul

**Fichiers principaux** :

- `client/src/lib/simulators/dilution.ts` et `dilution.test.ts` ;
- `client/src/lib/simulators/waterfall.ts` et `waterfall.test.ts` ;
- `client/src/lib/simulators/fund-returns.ts` et `fund-returns.test.ts` ;
- composants correspondants dans `client/src/components/simulators/`.

**Travail** :

- ajouter le calcul d'un complément de pool sur base fully diluted ;
- ajouter plafond de participation, plateau et conversion à la waterfall ;
- ajouter MOIC et flux datés au périmètre pertinent, sans confondre métriques de fonds et rendement d'une ligne ;
- créer pour chaque moteur un preset reproduisant exactement l'exemple de la leçon ;
- tester valeurs limites, sorties négatives ou nulles, somme des distributions et arrondis.

**Critère de sortie** : chaque simulateur reproduit les valeurs publiées de sa leçon et indique les conventions qu'il ne traite pas.

Les trois moteurs peuvent être développés en parallèle, car leurs fichiers sont distincts. Les types partagés et le registre restent sous la responsabilité d'un intégrateur unique.

#### Phase 5B — activité structurée dans la leçon

**Fichiers probables** :

- `client/src/content/types.ts` ;
- `scripts/validate-content.mjs` ;
- `scripts/split-lessons.mjs` ;
- `client/src/components/simulators/index.ts` ou un registre paresseux dédié ;
- `client/src/pages/learn/LessonPage.tsx` ;
- tests DOM et tests du split ;
- `data/lessons.json`.

**Travail** : définir un champ structuré de type activité avec identifiant de simulateur, preset, consigne et emplacement après un intertitre. Le validateur doit refuser les identifiants et presets inconnus. Le split doit conserver ce champ dans le payload de lecture approprié. Le composant est chargé à la demande et possède un lien vers la page complète du simulateur.

**Critères d'acceptation** :

- aucun détournement de la syntaxe de glossaire ;
- aucun simulateur inconnu ne passe la validation ;
- le preset affiché correspond au calcul voisin ;
- le rendu reste utilisable sans JavaScript interactif grâce à une explication et un lien de repli ;
- le chargement d'une leçon n'importe pas tous les simulateurs ;
- le bloc est vérifié sur desktop et mobile.

### Phase 6 — intégrer le cours au catalogue, aux parcours et à la préparation

**Fichiers** :

- `data/courses.json` ;
- `data/parcours.json` ;
- `data/certifications.json`, uniquement si l'arbitrage de préparation est positif ;
- `docs/certifications/REFERENTIEL-VC-ANALYST.md` si la préparation change ;
- `client/src/content/parcours.test.ts` ;
- `client/src/content/certifications.test.ts` ;
- `client/src/pages/learn/LessonPage.tsx` pour l'affichage des vrais prérequis ;
- `scripts/validate-content.mjs` pour le graphe pédagogique.

**Travail** :

1. appliquer le titre canonique sans changer le slug ;
2. conserver les labels de parcours utiles et harmoniser seulement le nom de la ressource ;
3. retirer le faux prérequis `l-pipeline-crm` ;
4. appliquer le graphe conceptuel validé ;
5. afficher les prérequis réels sans les rendre bloquants ;
6. valider cycles et auto-références ;
7. intégrer le livrable aux parcours qui promettent la pratique ;
8. décider si le cours rejoint `recommendedPreparation` de `VC Analyst` ;
9. laisser `contexts` vide tant qu'aucun consommateur n'est livré ;
10. vérifier la matrice de recouvrement et ajouter des renvois plutôt que dupliquer les explications.

**Critères d'acceptation** :

- accès direct, cours et parcours produisent une navigation cohérente ;
- les prérequis affichés sont conceptuels et non bloquants ;
- aucun nouveau champ de séquençage ne duplique `order` ;
- les sept parcours conservent une charge compatible avec leur promesse ;
- un rattachement à `VC Analyst` apparaît comme préparation recommandée seulement ;
- aucune évaluation professionnelle ni délivrance n'est suggérée ;
- les contenus voisins renvoient vers la ressource canonique sans perdre leur perspective propre.

### Phase 7 — vérification finale et clôture

**Contrôles techniques bloquants, sur un état gelé** :

```text
npm run validate:content:strict
npm run split:content
npm run check:generated
npm run typecheck
npm run lint
npm run test
npm run build
git diff --check
```

Le contrôle complet `npm run check` peut ensuite confirmer l'ensemble après régénération. Les résultats de chaque commande doivent être conservés séparément ; une réussite tardive ne doit pas masquer un échec antérieur.

**Vérifications fonctionnelles** :

- page du cours à 1 440 × 1 000 et 390 × 844 ;
- une leçon avec saisie numérique, erreur, correction et navigation clavier ;
- une leçon ouvrant exactement son composant de livrable ;
- reprise locale après rechargement ;
- révélation volontaire de la correction après première version ;
- bloc de simulateur avec preset et lien de repli ;
- affichage des temps sur cours, bibliothèque et sept parcours ;
- navigation de fin de cours dans au moins `p-entretien-analyst` et `p-analyst-foundations` ;
- téléchargement et ouverture du classeur initial ;
- absence de formule dans le classeur initial et absence de donnée sensible.

**Revues éditoriales** :

- contre-calcul indépendant de la matrice complète ;
- revue des unités, bases et dates ;
- revue financière du tour, du pool, de la waterfall et des métriques de fonds ;
- revue juridique externe des descriptions de clauses avant toute qualification professionnelle ;
- lecture pédagogique chronométrée du dossier pour remplacer les estimations provisoires ;
- vérification proposition par proposition des sources externes.

**Clôture documentaire** : après validation finale seulement, mettre à jour `Suivis/ETAT.md` si l'état ou les risques ont changé, puis ajouter une entrée factuelle à `Suivis/JOURNAL.md`. Le présent document doit alors être marqué comme exécuté, archivé ou supprimé selon la politique retenue ; il ne doit pas devenir un second tracker courant.

---

## 6. Matrice de validation

| Invariant | Preuve attendue |
|---|---|
| Sept leçons publiées dans l'ordre canonique | test de contenu et validation stricte |
| Formule du pool définie avec `P₀` et `T₀` | test éditorial ciblé et contre-calcul |
| Tous les pourcentages de cap table totalisent 100 % | test numérique avec tolérance flottante |
| Primaire + secondaire réconciliés | contrôle des flux et des titres |
| Somme des paiements de waterfall égale à la valeur distribuable | tests du moteur sur plusieurs sorties |
| VAN du TRI proche de zéro | test des flux datés et convention publiée |
| DPI + RVPI = TVPI | test du moteur et correction du dossier |
| Sept pratiques résolues vers sept composants | validateur et test de contenu |
| Sept questions numériques corrigées | schéma, tests DOM et inventaire |
| Lien profond vers la bonne section | test DOM de navigation |
| État local par composant rétrocompatible | tests de migration du stockage |
| Lecture, pratique et consolidation séparées | tests du résumé de temps et des parcours |
| Aucun contenu de correction dans le dossier apprenant | test de contrat du cas |
| Simulateurs alignés sur les exemples | presets et tests de non-régression |
| Prérequis sans cycle et non bloquants | validateur de graphe et test DOM |
| Préparation distincte de la certification | tests des relations de certification |
| Classeur ouvrable, versionné et sans formules | inspection déterministe de l'artefact |
| Aucune promesse non soutenue par une source | revue éditoriale proposition par proposition |

---

## 7. Risques et décisions à ne pas différer

| Risque | Mesure de maîtrise |
|---|---|
| Réécrire sept leçons avant de figer le cas | phase 0 obligatoire et matrice chiffrée unique |
| Présenter revenu et encaissement comme identiques | calendrier explicite de facturation et de recouvrement |
| Mélanger société, ligne et fonds | onglets, titres et contrôles séparés |
| Dupliquer l'ontologie des parcours | utiliser `order` et `prereqNote`, sans nouveau prédécesseur |
| Gonfler artificiellement les durées | qualifier les estimations et les remplacer après chronométrage |
| Perdre les états locaux lors d'une migration | version de schéma, migration testée et repli sûr |
| Révéler involontairement un corrigé | correction rendue après première version ; pas de fichier corrigé prétendument masqué dans `public/` |
| Intégrer un simulateur incomplet | tests contre les exemples avant toute insertion dans la leçon |
| Confondre quiz et certification | états, types et textes distincts |
| Introduire des benchmarks non sourcés | qualifier le cas de méthodologique et vérifier chaque source externe |
| Altérer des changements préexistants | diff borné, hashes des fichiers possédés et revue finale fichier par fichier |
| Modifier directement les données générées | éditer les sources puis lancer `split:content` |

### Hors périmètre tant qu'un besoin n'est pas démontré

- peupler `contexts` sans consommateur ;
- verrouiller les leçons ou exiger le livrable pour continuer ;
- téléverser ou analyser le classeur dans l'application ;
- présenter le cas fictif comme un benchmark de marché ;
- créer une nouvelle certification ou un badge ;
- renommer le slug public ;
- ajouter une syntaxe Markdown concurrente du glossaire.

---

## 8. Organisation des sessions et choix de modèle

| Session | Travail | Modèle et effort recommandés | Parallélisation |
|---|---|---|---|
| 1 | gel du socle, formule L5, secondaire, LTV, cap et waterfall | GPT-5.5, effort `xhigh` | deux contre-revues en lecture seule ; un seul rédacteur |
| 2 | cas apprenant, livrable, correction et classeur | GPT-5.5, effort `high` | classeur et consigne en parallèle après gel des chiffres |
| 3 | pratiques, liens profonds, stockage local et temps | GPT-5.5, effort `high` | tests et inspection en parallèle ; intégration sérialisée |
| 4 | questions numériques et accessibilité | GPT-5.5, effort `high` | peu de parallélisation, car types, validateur et rendu sont partagés |
| 5 | moteurs de simulateurs | GPT-5.5, effort `xhigh` | dilution, waterfall et rendements en parallèle ; registre intégré ensuite |
| 6 | parcours, prérequis, recouvrements et préparation `VC Analyst` | GPT-5.5, effort `high` | revue éditoriale et revue d'architecture en parallèle |
| 7 | audit complet, navigateur et clôture | GPT-5.5, effort `xhigh` | contrôles indépendants sur état gelé |

GPT-5.6 ou un effort maximal ne se justifie que si l'intégration révèle une contradiction persistante entre données, stockage, navigation, certification et simulateurs, ou pour une contre-revue finale à enjeu élevé. Il ne doit pas être utilisé par défaut pour les éditions de contenu et les composants isolés.

---

## 9. Définition de terminé

Le chantier est terminé lorsque les conditions suivantes sont simultanément remplies :

- les corrections mathématiques et les conventions sont publiées et contre-calculées ;
- le dossier L1 à L6 et les trois unités d'analyse de L7 sont cohérents ;
- chaque leçon reste autonome et contribue à une production commune ;
- chaque leçon comporte une saisie numérique formative avec correction ;
- les sept contributions sont adressables, persistées localement et non bloquantes ;
- les temps sont séparés, réconciliés et qualifiés sur les surfaces pertinentes ;
- les simulateurs reproduisent les scénarios qu'ils accompagnent ;
- les prérequis réels sont visibles, acycliques et distincts de l'ordre des parcours ;
- le cours est correctement positionné dans ses sept parcours ;
- toute relation à `VC Analyst` reste une préparation recommandée et documentée ;
- les sources soutiennent les propositions auxquelles elles sont associées ;
- les contrôles techniques bloquants, les tests DOM, les vérifications sur bureau et mobile et l'ouverture du classeur passent ;
- les revues externes sont soit obtenues et consignées, soit explicitement laissées ouvertes sans revendiquer leur validation ;
- `Suivis/ETAT.md` et `Suivis/JOURNAL.md` reflètent l'état final vérifié, sans transformer cette revue en tracker permanent.
