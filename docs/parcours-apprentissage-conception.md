# Parcours d'apprentissage — note de conception

> Repenser les parcours de `vc-platform` à partir des objectifs de l'utilisateur,
> et non du contenu déjà en place. Les 9 anciens « parcours » sont traités comme
> un brouillon : on garde la **matière**, on jette le **découpage**.
>
> Livrable jumeau : `data/parcours.json` (+ type `Parcours`) — réalisé, voir §9.
> Dernière mise à jour : 2026-06-11.

---

## 0. En une page

Au départ, les 9 « parcours » étaient en réalité un **programme** (des matières rangées par difficulté). Ils répondaient à « qu'y a-t-il à apprendre ? », jamais à « **je veux ça, je suis là, j'ai ce temps — par où je commence ?** ».

La nouvelle couche est maintenant posée en trois niveaux :

| Couche | Question | Ce que c'est | Statut |
|---|---|---|---|
| **Matières** | *Qu'y a-t-il à apprendre ?* | La Bibliothèque (`/bibliotheque`) : 9 rayons, 16 cours, 51 leçons canoniques, 11 leçons drop-in, 4 cas, 8 simulateurs, 357 termes de glossaire. Libre, réutilisable. | En place, à densifier |
| **Parcours** | *Où veux-tu aller ?* | 22 trajectoires dans `data/parcours.json`, affichées sur `/paths` et `/paths/:slug`, qui composent les matières vers une destination concrète. | Câblé côté client + seed |
| **Profils** | *Qui es-tu ?* | Le test ikigai route vers `data/profileParcours.json` : profil + budget-temps + archétype → parcours recommandé. | Branché |

Un parcours se définit sur **trois axes** : **objectif × niveau × temps**. Le temps n'est pas une famille à part : c'est un **curseur** qui raccourcit ou enrichit chaque parcours — *plus* une étagère « Express » de formats courts qui se bingent en une session.

Décision d'architecture : **couche au-dessus** (les matières restent une bibliothèque libre, les parcours les composent). Cette cible est atteinte côté client : `/paths` porte les parcours, `/bibliotheque` porte les matières, et `ParcoursOrSubjectPage` préserve les anciennes URLs de rayons. Détail en §4.

État courant au 2026-06-11 :

- 22 parcours : 4 `now`, 13 `next`, 5 `later`.
- 6 familles de catalogue : Découvrir, Réussir un entretien, Lever des fonds, Monter en grade, Maîtriser un sujet, Express.
- 148 étapes au total : 138 existantes, 10 encore `a-produire`.
- Le cours canonique **Power Law & Monte Carlo** (`c-power-law-portfolio`, 4 leçons `lpl-*`) est intégré au rayon Portfolio, au parcours `p-penser-gp`, au simulateur Power Law et au glossaire.
- Les leçons de parcours suivent deux modes : certaines sont encore drop-in dans `data/parcours/*.lessons.json` (`ld-*`, `llp-*`, `lts-*`), d'autres ont été repliées dans `data/lessons.json` (`lea-*`, `lf-*`, `lpl-*`) pour devenir canoniques et seedées.

Principe directeur : **le parcours est une colonne vertébrale, pas un couloir.** Tout est accessible librement ; le parcours suggère un chemin et mémorise ta progression, il n'enferme jamais.

---

## 1. Le constat

Ce qui ne va pas dans le brouillon initial :

- **Ce sont des matières déguisées en parcours.** « Term sheets & structuration », « Fund economics », « Portfolio management » sont des *sujets*, pas des *trajectoires*. Un sujet ne dit pas à l'utilisateur quoi faire de sa semaine.
- **L'objectif est absent.** Personne ne se réveille en voulant « faire le module Fund economics ». On se réveille en voulant *réussir un entretien jeudi*, *préparer sa levée*, *enfin comprendre une term sheet*. Le contenu est rangé par logique de professeur, pas par intention d'apprenant.
- **La personnalisation tourne à vide.** Le test ikigai calcule déjà un profil + un budget-temps… pour recommander 3 *matières*. C'est une liste de lecture, pas un parcours. Le plus beau morceau du produit (l'orientation) débouche sur un cul-de-sac.
- **Le ton est uniforme et sérieux.** La matière est exigeante, littéraire, dense. Excellent pour un cours ; trop lourd comme *porte d'entrée*. Il manque un registre léger, bingeable, qui donne envie de cliquer sur « épisode suivant ».

Bonne nouvelle : rien n'était à jeter. La matière était solide et l'orientation ikigai était un atout rare. La couche ajoutée est précisément celle qui manquait : la trajectoire, rebranchée sur l'orientation.

---

## 2. Le modèle — trois couches

```
        QUI ?                    OÙ ?                       QUOI ?
   ┌───────────────┐      ┌──────────────────┐      ┌──────────────────┐
   │   PROFILS     │ ───▶ │     PARCOURS      │ ───▶ │     MATIÈRES     │
   │  (ikigai)     │aiguille│ colonne vertébrale│compose│  la bibliothèque │
   │ 6 profils     │      │ objectif+niveau   │      │ leçons · cours    │
   │ + budget-temps│      │ +temps            │      │ cas · simulateurs │
   │ + 3 archétypes│      │ jalon concret     │      │ glossaire         │
   └───────────────┘      └──────────────────┘      └──────────────────┘
        ▲                                                    │
        └──────────── navigation libre : on entre par n'importe où ───────────┘
```

**Matières — la bibliothèque.** L'atome de connaissance. Une leçon, un cours, un cas, un simulateur, une fiche glossaire. Chaque atome **se tient seul**, se trouve par la recherche, se met en favori, se lit hors de tout parcours. C'est l'ancien `paths/courses/lessons`, re-cadré : les 9 « parcours » deviennent des **matières** (ou « rayons » de la bibliothèque). Aucun contenu perdu.

**Parcours — la trajectoire.** Une séquence curatée de matières vers une **destination nommée**. Un parcours a : une **promesse** (ce que tu sauras *faire*), un **niveau d'entrée**, une **estimation de temps**, des **étapes typées**, et un **jalon** (un livrable concret : un mémo, un deck, une cap table, un mock). C'est la couche neuve.

**Profils — l'aiguilleur.** Le test d'orientation et le cahier ikigai ne *contiennent* pas de contenu : ils **routent**. Profil + budget-temps → « voici ton parcours recommandé, calibré pour toi ». Les 3 archétypes (Architecte, Bâtisseur, Opérateur-Investisseur) deviennent des **destinations longues** qui regroupent plusieurs parcours.

Trois questions, trois couches : *Qui es-tu ? → Où veux-tu aller ? → Qu'y a-t-il à apprendre ?*

---

## 3. Les trois axes de personnalisation

Un parcours est entièrement décrit par :

**① Objectif** — *le sélecteur de colonne.* Découvrir · réussir un entretien · lever des fonds · monter en grade · maîtriser un sujet. C'est lui qui choisit la **famille** et le **parcours**.

**② Niveau** — *le point d'entrée et la profondeur.* Débutant · intermédiaire · avancé. Détermine **où** tu démarres dans la colonne et **quelles** étapes de fond se déverrouillent. Un même parcours peut s'entrer à deux niveaux.

**③ Temps** — *le rythme et la densité.* Le `timeBudget` du test (low / medium / high) agit comme un **curseur** sur *chaque* parcours :

| Budget | Le curseur fait… | Cadence type |
|---|---|---|
| **Low** (<1 h/sem) | Garde les seules étapes **cœur**. Coupe les bonus. | « L'essentiel », 1 session courte / semaine |
| **Medium** (1–3 h/sem) | Cœur + 1–2 **pratiques**. | Rythme standard, 4–6 semaines |
| **High** (immersion) | Cœur + bonus + pratiques + respirations. | Immersion, tout débloqué |

**La tension « parcours express » résolue.** Le temps joue à deux endroits :
1. **Comme curseur** sur tous les parcours (il les rogne au cœur ou les déploie).
2. **Comme étagère dédiée « Express »** — des parcours *autonomes ultra-courts* (≈ 1 h, une seule session, bingeables) conçus comme **portes d'entrée**. On les finit d'un trait, on tombe amoureux, on s'engage ensuite sur un parcours long. (Détail §6.6.)

Autrement dit : *chaque parcours a une « route express »* via le curseur **et** *il existe des parcours qui ne sont qu'express*.

---

## 4. Décision d'architecture

Tu m'as demandé de trancher dans le document. Trois options :

**Option A — Remplacer les 9 par des parcours-objectifs.**
Les matières disparaissent, chaque parcours porte son propre contenu.
*Contre :* on duplique le contenu (la « dilution » sert au futur fondateur *et* au futur analyst), on perd une bibliothèque réutilisable, la navigation libre devient impossible. ❌

**Option B — Une couche au-dessus.**
Les matières restent une **bibliothèque libre** ; les parcours les **composent** par référence.
*Pour :* zéro duplication, séparation nette (contenu / trajectoire / personne), navigation libre native, passage à l'échelle (ajouter un parcours = écrire de la donnée, pas du contenu), l'orientation ikigai se rebranche proprement. ✅

**Option C — Hybride (garder les 9 + quelques parcours phares).**
*Pour :* pragmatique, livrable vite. *Contre :* conceptuellement flou à terme — « cette chose, c'est un sujet ou une trajectoire ? ». À garder comme **transition**, pas comme cible. ⚠️

### Recommandation : **Option B**, atteinte via C comme rampe de lancement.

Concrètement : on garde les 9 matières en bibliothèque, on **ne refait pas** le contenu existant, et on construit la **couche parcours** par-dessus. Cette phase hybride est maintenant en production côté client : `/paths` affiche les trajectoires par objectif, `/bibliotheque` affiche les rayons et contenus, et `/paths/:slug` est aiguillé par `ParcoursOrSubjectPage` vers la bonne page selon que le slug appartient à `parcours.json` ou à l'ancien `paths.json`.

Le catalogue ne se limite plus aux 3 phares initiaux : `data/parcours.json` contient 22 parcours, mais le principe reste le même. Un parcours = composition d'atomes ; un rayon = organisation thématique ; un cours ou une leçon = matière réutilisable.

Cela respecte ta consigne — *repenser les parcours sans tenir compte du découpage existant* — tout en ne gaspillant pas une matière déjà bonne : le **découpage** est neuf et part de l'objectif ; la **matière** est réemployée comme brique.

---

## 5. Le principe de liberté

> Le parcours est une **colonne vertébrale**, pas un **couloir**.

Traduction concrète, parce que c'est un parti pris de design, pas un slogan :

- **Tout atome est autonome.** Chaque étape pointe vers une matière joignable aussi par la recherche, le glossaire, les favoris, une autre page. On peut tout lire sans parcours.
- **On entre par n'importe où.** Au milieu d'un parcours, sur une seule étape, par un cas qui traînait. Le parcours s'adapte et mémorise.
- **Aucun verrou dur.** Pas de « termine l'étape 3 pour débloquer la 4 ». Au plus un *prérequis conseillé*, signalé en douceur.
- **Les détours sont récompensés.** Les liens latéraux (une fiche glossaire, un cas, un simulateur) sont des **œufs de Pâques**, pas des devoirs. Cliquer ailleurs n'est pas « sortir du droit chemin ».
- **Étapes typées** pour que la liberté reste lisible :
  - `cœur` — la colonne, l'indispensable.
  - `bonus` — l'approfondissement, débloqué si le temps suit.
  - `pratique` — *fais quelque chose* : un simulateur, un mock, un livrable.
  - `respiration` — léger et fun : une histoire de cas, un mythe démonté, un détour curieux.
- **La progression encourage, ne culpabilise pas.** Anneau de progression, petites séries (*streaks*) douces, « reprendre où j'en étais ». Jamais de honte, jamais de blocage.

---

## 6. Le catalogue des parcours

Six familles de catalogue + un aiguillage sur-mesure. Les matières citées en `code` existent déjà (réutilisées telles quelles) ; les étapes marquées **[à produire]** sont le contenu neuf à écrire (10 étapes restantes au 2026-06-11). Légende des étapes : `cœur` · `bonus` · `pratique` · `respiration`.

> Note sur les exemples : tu m'avais proposé prépa entretien / prépa levée / montée en grade / express / sur-mesure. J'ai gardé les cinq, et **ajouté** deux familles qui manquaient à mon sens : **Découvrir** (la porte d'entrée, sans elle on perd le curieux dès la première minute) et **Maîtriser un sujet** (les obsessions mono-thème, le contenu le plus bingeable et le plus partageable). Le sur-mesure n'est pas une étagère : c'est la table d'aiguillage `profileParcours.json`.

### 6.1 — Découvrir · *la porte d'entrée*

**発 Le VC sans bullshit** — *l'amorce express*
> *En 1 h, comprends comment l'argent passe de l'épargne aux fondateurs — et pourquoi 9 startups sur 10 doivent mourir pour que le métier marche.*
**Statut** `now` · **ID** `p-decouvrir-vc` · **Pour qui** curieux, étudiants · **Niveau** débutant · **Temps** ~1 h 20 (9 épisodes courts) · **Profil** `debutant-curieux`
**Destination** nommer les acteurs (LP/GP/BA), comprendre la loi de puissance et la grammaire des stades.
**Colonne actuelle** — `cœur` 9 startups sur 10 vont mourir (`ld-power-law`) → `cœur` C'est quoi le VC, vraiment (`ld-what-is-vc`) → `cœur` Le voyage de l'argent (`ld-money-flow`) → `cœur` Pré-seed à Série C (`ld-stages`) → `cœur` Le vrai job (`ld-vc-job`) → `cœur` Qui fait quoi (`ld-roles`) → `bonus` Un fonds naît et meurt aussi (`ld-fund-lifecycle`) → `respiration` L'Europe contre le mythe de la Valley (`cs-europe-vs-valley`).
**Jalon** quiz éclair de fin (pas de livrable).

**業 Une semaine dans la peau d'un VC** — *le métier démystifié*
> *Sourcing, screening, comité, accompagnement : à quoi ressemble vraiment la semaine, loin du mythe du « gros chèque ».*
**Pour qui** curieux, futurs candidats · **Niveau** débutant · **Temps** ~45 min · **Profils** `debutant-curieux` `futur-analyste`
**Colonne** — `cœur` Une semaine type (`l-vc-week`) → `cœur` Qui fait quoi, analyst→partner (`l-roles`) → `bonus` Comment naît un pipeline (`l-sourcing`) → `respiration` Le mythe « le VC mise » démonté **[à produire]**.

### 6.2 — Réussir un entretien · *la famille phare côté carrière*

**門 Décrocher un stage en VC** — *pour étudiants*
> *Construis la candidature ciblée + la mini-analyse de startup qui te font sortir de la pile.*
**Statut** `next` · **ID** `p-stage` · **Pour qui** étudiants (Bac+4/5), reconvertis · **Niveau** débutant · **Temps** ~3–4 h · **Profils** `futur-analyste` `debutant-curieux`
**Destination** une candidature ciblée sur un fonds + une analyse de startup auto-produite (*le* différenciateur au recrutement).
**Colonne actuelle** — `cœur` Les portes d'entrée du venture en France (`l-career-breaking-in`) → `cœur` Comprendre une thèse de fonds pour la cibler (`l-thesis-anatomy`) → `cœur` Lire une startup en 4 piliers (`l-team-market`) → `bonus` Mathématiques du VC (`c-mathematiques-vc`) → `pratique` Écrire une mini-analyse d'une boîte du portefeuille **[à produire : gabarit + exemple]** → `respiration` Le café-réseau quand on n'a pas de réseau **[à produire]** → `bonus` Les niveaux du métier (`l-career-levels`).
**Jalon** une analyse d'1 page d'une startup d'un fonds cible.

**観 Réussir l'entretien Analyst** — *le cœur de cible*
> *Passe le case study et le deal memo : une reco invest/pass claire, défendable, en temps contraint.*
**Statut** `now` · **ID** `p-entretien-analyst` · **Pour qui** candidats analyst · **Niveau** intermédiaire · **Temps** ~7 h (cœur) / ~10 h (immersion) · **Profil** `futur-analyste`
**Destination** produire un deal memo (1 page ou 4 slides) avec recommandation et risques hiérarchisés.
**Colonne actuelle** — `cœur` La carte de l'entonnoir (`lea-process`) → `cœur` La grille investisseur (`lea-grille`) → `cœur` TAM/SAM/SOM (`lea-market-sizing`) → `cœur` Startup + unit economics (`lea-read-startup`) → `cœur` Questions techniques (`lea-technical`) → `pratique` Mathématiques du VC (`c-mathematiques-vc`) → `pratique` Pre/post-money (`pre-post-money`) → `pratique` Dilution (`dilution`) → `cœur` Deal memo (`lea-deal-memo`) → `pratique` Case study (`lea-case-study`) → `cœur` Pitch me a company (`lea-pitch`) → `cœur` Fit (`lea-fit`) → `bonus` Questions à poser (`lea-reverse-questions`) → `cœur` Recherche fonds (`lea-fund-research`) → `bonus` Jour J (`lea-jour-j`) → `respiration` Power-law portfolio (`cs-power-law-portfolio`) → `pratique` mock complet (`lea-mock`).
**Jalon** deal memo + mock complet, avec grille d'auto-évaluation et revue par les pairs. *(Conseil intégré : parler à 2–3 personnes du secteur avant de conclure, comme en vraie DD.)*

**決 Réussir l'entretien Associate** — *un cran au-dessus*
> *Mène une DD complète et défends ton mémo en comité simulé. On te jugera sur le jugement, pas l'exécution.*
**Statut** `next` · **ID** `p-entretien-associate` · **Pour qui** candidats associate, analysts qui montent · **Niveau** avancé · **Temps** ~8 h · **Profils** `associate-progression` `futur-analyste`
**Colonne actuelle** — `cœur` DD en pratique (`l-dd-process`) → `cœur` Construire & défendre une thèse (`l-thesis-anatomy`, `l-defending-thesis`) → `cœur` Term sheet : éco + contrôle (`l-ts-economics`, `l-ts-control`) → `bonus` Mathématiques du VC (`c-mathematiques-vc`) → `pratique` Waterfall & liquidation pref (`waterfall`) → `respiration` Cas : le piège de la valo flatteuse (`cs-liquidation-preference`) → `pratique` Simulation de comité d'investissement **[à produire]** → `bonus` « Pourquoi ce fonds » : ta thèse perso **[à produire]**.
**Jalon** deal memo complet + passage en IC simulé.

**道 Entretien Principal / poste senior** — *penser fonds*
> *Montre que tu raisonnes à l'échelle du fonds : thèse propriétaire, construction de portefeuille, ce que tu apporterais.*
**Statut** `later` · **ID** `p-entretien-principal` · **Pour qui** candidats principal/senior · **Niveau** avancé · **Temps** ~6 h · **Profils** `principal-mindset` `associate-progression`
**Colonne actuelle** — `cœur` Portefeuille en loi de puissance (`l-reserves`, `l-triage`) → `cœur` Économie d'un fonds : fees, carry, métriques (`l-fees-carry`, `l-fund-metrics`) → `pratique` DPI/TVPI/MOIC (`fund-returns`) → `bonus` Mathématiques du VC (`c-mathematiques-vc`) → `cœur` Thèse propriétaire **[à produire]** → `bonus` Cas power-law (`cs-power-law-portfolio`).
**Jalon** note de thèse + plan de portefeuille.

### 6.3 — Lever des fonds · *côté fondateur, par série*

**種 Préparer ma pré-seed**
> *De l'idée au premier chèque : narratif, bon instrument (SAFE/BSA-AIR), combien lever (~1–1,5 M€) sans trop te diluer (~20 %).*
**Statut** `next` · **ID** `p-preseed` · **Pour qui** fondateurs au tout début · **Niveau** tous · **Temps** ~4 h · **Profil** `entrepreneur-levee`
**Colonne actuelle** — `cœur` Comprendre le VC pour mieux lever (`l-founder-narrative`) → `cœur` BSA-AIR, OC ou priced ? (`lf-instruments`) → `cœur` Lever sans se faire diluer bêtement (`lf-dilution`) → `pratique` Ton scénario de levée (`fundraising-scenario`) → `pratique` Ta dilution (`dilution`) → `respiration` Cas : la dilution d'un fondateur seed→C (`cs-dilution-journey`).
**Jalon** one-liner + mini-deck (5 slides) + fourchette montant/valo.

**募 Préparer ma seed**
> *Un deck qui tient, une cap table post-tour maîtrisée, un process de levée que tu pilotes (et pas l'inverse).*
**Statut** `now` · **ID** `p-seed` · **Pour qui** fondateurs avec traction · **Niveau** intermédiaire · **Temps** ~6 h / ~7 h 30 avec bonus · **Profil** `entrepreneur-levee`
**Destination** repères 2026 : ~2,5–3,5 M€ sur ~12–15 M€ post-money, 20–25 % de dilution.
**Colonne actuelle** — `cœur` Le narratif & la préparation (`l-founder-narrative`) → `cœur` Les erreurs mortelles de data room (`lf-dataroom`) → `cœur` Priced round vs BSA-AIR (`lf-instruments`) → `pratique` Pre/post-money (`pre-post-money`) → `pratique` Ownership & cap table (`ownership`) → `cœur` Préférence de liquidation (`lf-liquidation`) → `respiration` Cas : valo flatteuse (`cs-liquidation-preference`) → `bonus` Gérer le process : calendrier, FOMO **[à produire]**.
**Jalon** deck seed + cap table post-tour.

**階 Préparer ma Série A**
> *« La seed d'aujourd'hui ressemble à l'ancienne Série A. » ARR ~2,5 M€, board, et une term sheet qui se négocie ligne à ligne.*
**Statut** `next` · **ID** `p-serie-a` · **Pour qui** fondateurs en croissance · **Niveau** avancé · **Temps** ~8 h · **Profils** `entrepreneur-levee` `associate-progression`
**Colonne actuelle** — `cœur` Les attentes en Série A : métriques, board **[à produire]** → `cœur` Term sheet économique (`l-ts-economics`) → `cœur` Term sheet contrôle (`l-ts-control`) → `pratique` Waterfall & liquidation pref (`waterfall`) → `pratique` Dilution multi-tours (`dilution`) → `respiration` Cas : dilution seed→C (`cs-dilution-journey`) → `cœur` Négocier sans casser la relation (`l-founder-narrative`) → `cœur` Board, gouvernance et contrôle en SAS (`lf-board`).
**Jalon** négociation simulée + cap table multi-tours.

**階 Mener un tour de table** — *l'autre lecture de la levée, côté investisseur*
> *De l'autre côté de la table : comment un VC structure un tour, fixe son ownership cible, syndique et rédige la term sheet.*
**Statut** `next` · **ID** `p-mener-un-tour` · **Pour qui** analysts/associates · **Niveau** avancé · **Temps** ~5 h · **Perspective** investisseur · **Profils** `associate-progression` `principal-mindset`
**Colonne actuelle** — `cœur` Économie du tour (`l-ts-economics`) → `cœur` Pre/post-money et ownership cible (`lmv-pre-post-ownership`) → `cœur` Contrôle & gouvernance (`l-ts-control`) → `pratique` Ownership cible (`ownership`) → `cœur` Returns et liquidation preference (`lmv-returns-waterfall`) → `pratique` Liquidation pref (`waterfall`) → `cœur` Structurer par stade (`l-stages`) → `respiration` Cas : la valo flatteuse (`cs-liquidation-preference`).
**Jalon** rédiger une term sheet + cible d'ownership *(auto + pairs)*.

**募 Lever son fonds VC (LPs & Institutions)** — *le versant GP*
> *Du premier pitch à la due diligence opérationnelle : comment convaincre fonds de fonds, assureurs et family offices de financer ta thèse.*
**Statut** `now` · **ID** `p-levee-fonds-lp` · **Pour qui** aspirants GP, principals, émergents managers · **Niveau** avancé · **Temps** ~4 h 45 / ~6 h 15 avec bonus · **Profils** `associate-progression` `principal-mindset`
**Colonne actuelle** — `cœur` Qui finance les fonds (`l-actors`) → `cœur` Cycle de vie du fonds (`l-fund-lifecycle`) → `cœur` 2 & 20 (`l-fees-carry`) → `cœur` DPI/TVPI/IRR (`l-fund-metrics`) → `pratique` Management fees (`management-fees`) → `pratique` Waterfall LP (`fund-returns`) → `cœur` Pitch GP (`llp-pitch`) → `cœur` Process PPM/data room/DD LP (`llp-process`) → `cœur` Convaincre des LPs en France (`llp-france`) → `bonus` Réserves (`l-reserves`) → `respiration` VC européen et LPs publics (`cs-europe-vs-valley`).
**Jalon** pitch GP + plan de data room LP.

> **Principe (décision n°1) — la levée se lit des deux sièges.** Un fondateur apprend à *lever*, un investisseur apprend à *mener* — et chacun gagne à comprendre l'autre. Les parcours fondateur ci-dessus et ce parcours investisseur **partagent la même matière** (term sheet, cap table, dilution), cadrée selon le siège. C'est exactement l'intérêt de la couche Parcours : une matière, plusieurs trajectoires.

### 6.4 — Monter en grade · *déjà en poste, vers le cran d'après*

*Même matière que la famille entretien, cadrage différent : ici on apprend à **exercer** le rôle (jugement sur le terrain), pas à **décrocher** l'entretien (artefacts + fit). Jalons orientés livrables de poste.*

**理 Devenir un meilleur Analyst** — intermédiaire · ~5 h · `analyst-progression`
Du sourcing propre au jugement propriétaire : pattern matching, DD priorisée, un mémo qu'on lit vraiment.
**Colonne** — `cœur` `l-screening` → `cœur` `l-team-market`, `l-traction-unit-economics` → `cœur` `l-dd-process` → `pratique` écrire un mémo **[à produire : gabarit]** → `respiration` `cs-power-law-portfolio`. **Jalon** un mémo d'investissement.

**決 Passer Associate** — avancé · ~6 h · `associate-progression`
Porter ses convictions, mener une DD complète, comprendre la structuration.
**Colonne** — `cœur` `l-thesis-anatomy`, `l-defending-thesis` → `cœur` `l-dd-process` → `cœur` `l-ts-economics`, `l-ts-control` → `pratique` `waterfall` → `respiration` `cs-liquidation-preference`. **Jalon** thèse + DD défendue.

**道 Passer Principal** — avancé · ~6 h · `principal-mindset` `associate-progression`
Négo, board, follow-on, penser fonds.
**Colonne** — `cœur` `l-ts-control` → `cœur` `l-reserves`, `l-triage` → `pratique` `fund-returns` → `respiration` `cs-power-law-portfolio`. **Jalon** plan de réserves + thèse propriétaire.

**算 Penser comme un GP** — avancé · ~5 h · `principal-mindset`
Économie d'un fonds, relation LP, portefeuille en loi de puissance et lecture Monte Carlo.
**Colonne actuelle** — `cœur` `l-fees-carry` → `cœur` `l-fund-metrics` → `cœur` `l-reserves` → `cœur` `l-triage` → `cœur` `c-power-law-portfolio` (4 leçons `lpl-*`) → `pratique` `fund-returns` → `respiration` `cs-power-law-portfolio` → `bonus` `cs-europe-vs-valley`. **Jalon** mini-modèle de retour de fonds + note LP.

### 6.5 — Maîtriser un sujet · *les obsessions mono-thème (le contenu le plus bingeable)*

Courts, autonomes, partageables. Servent aussi de **briques** dans les parcours longs et de **contenu Express**.

- **契 Décoder une term sheet** (~1 h) — `l-ts-economics`, `l-ts-control` + `pratique` `waterfall` + `respiration` `cs-liquidation-preference`. **Jalon** lire une vraie TS sans trembler.
- **表 Lire un cap table sans paniquer** (~45 min) — `l-stages` + `pratique` `ownership`, `dilution` + `respiration` `cs-dilution-journey`.
- **報 Le carry, enfin clair** (~1 h) — `l-fees-carry` + `pratique` `fund-returns` + `l-fund-metrics`.
- **観 Dimensionner un marché (TAM/SAM/SOM)** (~45 min) — **[à produire]** + `l-team-market`.
- **算 Unit economics & Rule of 40** (~45 min) — `l-traction-unit-economics` **[+ à produire : Rule of 40]**.
- **冪 Construction de portefeuille en loi de puissance** (~50 min) — `c-power-law-portfolio` + simulateur Power Law/Monte Carlo + cas `cs-power-law-portfolio`. **Statut : canonique depuis 2026-06-11.**

### 6.6 — Express · *un format, pas un silo*

Étagère qui **rassemble tout ce qui se fait en une session** (≈ 1 h, bingeable, zéro engagement) : `Le VC sans bullshit` (§6.1), les cinq deep-dives (§6.5), plus deux crash-courses :

- **L'entretien VC en 1 h** — `l-roles` + `l-team-market` + mini-case **[à produire]**.
- **Lever en 1 h : l'essentiel** — `l-founder-narrative` + `l-founder-instruments` + `pratique` `fundraising-scenario`.

Rappel : *tout* parcours long a aussi sa « route express » via le curseur temps (cœur uniquement). L'étagère Express, elle, met en avant les produits **conçus** courts.

### 6.7 — Sur-mesure ikigai · *l'aiguillage, pas un parcours figé*

Le test d'orientation ne recommande plus 3 *matières* mais **un parcours calibré**. Table de routage profil → parcours (le budget-temps règle ensuite la cadence) :

| Profil ikigai | Parcours recommandé | Puis |
|---|---|---|
| `debutant-curieux` | `p-decouvrir-vc` · Le VC sans bullshit | `p-semaine-vc`, `p-cap-table` |
| `entrepreneur-levee` | `p-preseed` · Préparer ma pré-seed | `p-seed`, `p-serie-a`, `p-term-sheet` |
| `futur-analyste` | `p-stage` · Décrocher un stage en VC | `p-entretien-analyst`, `p-market-sizing` |
| `analyst-progression` | `p-meilleur-analyst` · Devenir un meilleur Analyst | `p-passer-associate`, `p-unit-economics` |
| `associate-progression` | `p-passer-associate` · Passer Associate | `p-passer-principal`, `p-mener-un-tour`, `p-term-sheet`, `p-levee-fonds-lp` |
| `principal-mindset` | `p-penser-gp` · Penser comme un GP | `p-passer-principal`, `p-carry`, `p-levee-fonds-lp` |

**Les 3 archétypes deviennent des destinations longues** (un *bundle* de parcours, l'horizon affiché par le cahier) :

- **築 Architecte de Thèse** → Penser comme un GP + Passer Principal + deep-dives thèse & carry.
- **構 Bâtisseur d'infrastructure** → Une semaine dans la peau d'un VC + Préparer ma seed *(il vend aux fonds et lève)* + Réussir l'entretien Analyst *(comprendre son client)*.
- **導 Opérateur-Investisseur** → Passer Associate + Préparer ma pré-seed *(angle business angel)* + Lire un cap table.

---

## 7. Ton & contenu — concis, fun, bingeable

La matière actuelle est exigeante et littéraire. Parfait pour un cours, trop lourd pour une *porte d'entrée*. Les parcours adoptent un **registre plus léger**, sans rien perdre en justesse.

Huit principes :

1. **La promesse d'abord.** Un parcours/épisode s'ouvre sur ce que tu sauras *faire*, jamais sur un sommaire. « À la fin, tu lis une term sheet ligne à ligne » > « Ce module couvre les clauses… ».
2. **Des épisodes, pas des chapitres.** Unités de 8–12 min, avec un *crochet de curiosité* vers la suivante. On binge une série, pas un manuel.
3. **Une idée par épisode.** Un seul modèle mental, nommé pour qu'on s'en souvienne (« le voyage de l'argent », « le piège de la valo flatteuse »).
4. **Montre, raconte, fais.** Une histoire de cas réelle + le concept + une micro-action (un simulateur, un « à ton tour »). La pratique est dans le flux, pas reléguée à la fin.
5. **Le ton du pote calé.** Tutoiement, vivant, zéro jargon gratuit (le jargon nécessaire est défini *inline* via le glossaire). Un peu d'humour, des analogies (le go, le poker, la loi de puissance).
6. **Anti-cours magistral.** Pas de murs de texte. De la respiration. Des *mythes démontés* : « Non, le VC ne “mise” pas — il construit un portefeuille qui assume la mort de la majorité. »
7. **Libre.** Chaque épisode se tient seul ; on peut binger, sauter, revenir. Le parcours suit, il ne contraint pas.
8. **Récompense la curiosité.** Les liens latéraux sont des œufs de Pâques, pas des devoirs.

**Avant / après** (même contenu, registre changé) :

> ❌ *« Ce module présente la structure de rémunération d'un fonds, communément désignée par l'expression “2 & 20”, et ses implications sur l'alignement d'intérêts entre commandités et commanditaires. »*
>
> ✅ *« “2 & 20”, c'est combien un fonds gagne — et sur ton dos ou pas. 2 % par an pour faire tourner la boutique, 20 % des gains s'il performe. En 8 minutes, tu sauras pourquoi cette ligne change tout pour un GP. »*

Le contenu de fond (la matière) peut rester exigeant ; c'est l'**emballage du parcours** (titres, promesses, intros d'épisode, transitions) qui porte ce ton.

---

## 8. UX & navigation libre

**Page Parcours (`/paths`)** — la carte interactive (`PathAtlas`) + un catalogue par familles. Chaque famille est repliable/dépliable en accordéon ; chaque carte expose la promesse, le temps, le niveau, la progression et le statut `now/next/later`. En tête, un bandeau **« Ton parcours »** (sortie du test ikigai) si un profil existe.

**Trois portes d'entrée** — (a) le test ikigai t'**aiguille** ; (b) tu **flânes** dans les étagères ; (c) tu **sautes** depuis n'importe quelle matière (« Ce cours fait partie de 3 parcours »).

**Page d'un parcours (`/paths/:slug`)** — la colonne en vertical (une « carte de voyage »), étapes typées (cœur/bonus/pratique/respiration), prérequis rendus en Markdown inline, curseur temps lié au `timeBudget`, bouton « reprendre où j'en étais », liens « dévier » assumés. Le jalon est mis en avant comme **récompense**, pas comme examen.

**Aiguillage de route** — `/paths/:slug` passe par `ParcoursOrSubjectPage` : slug de `parcours.json` → `ParcoursDetailPage`, slug de rayon legacy `paths.json` → `PathDetailPage`. Cela conserve les anciens liens tout en clarifiant la nouvelle IA.

**Bibliothèque (`/bibliotheque`)** — les matières sont rangées en cours, lectures et études de cas. Les chapitres et les cours de rayons legacy sont repliables en accordéon ; `/cases` redirige vers `/bibliotheque`, tandis que `/cases/:slug` reste la page détail d'un cas.

**Pas de verrou.** Au plus un *prérequis conseillé* en filigrane. La progression se cumule par étape et remonte au parcours, sans jamais bloquer.

**Réutilise l'existant** — l'esthétique (kanji, accents, ornements ikigai), les `Bookmark`/`Progress`/`Note` déjà au modèle, le composant `PathAtlas`, le glossaire vivant et les simulateurs. Le rayon actuel « Parcours » est devenu **« Bibliothèque »** (les matières) ; « Parcours » désigne la couche neuve.

---

## 9. Modèle de données

Livrables en place : **`data/parcours.json`**, type **`Parcours`** dans `client/src/content/parcoursTypes.ts`, loader **`client/src/content/parcours.ts`**, politiques **`data/parcoursConfig.json`** et table de routage **`data/profileParcours.json`**. Schéma (résumé) :

```ts
type LocalizedText = string | Partial<Record<'fr'|'en'|string, string>>; // string = locale par défaut (fr)

interface Parcours {
  id: string; slug: string; family: ParcoursFamily;   // decouvrir|entretien|levee|grade|maitriser|express
  title: LocalizedText; hook: LocalizedText;            // la promesse, une phrase
  kanji?: string; accent?: string;                      // on garde l'esthétique
  goal: LocalizedText; forWhom: LocalizedText[]; prerequisites?: LocalizedText[];
  perspective?: 'founder'|'investor'|'both';            // décision n°1 — défaut 'investor'
  level: Level; entryLevel: Level;                       // Level existant: debutant|intermediaire|avance|tous
  time: { coreHours: number; withBonusHours?: number; sessions?: number; cadence?: LocalizedText };
  timeFit: ('low'|'medium'|'high')[];                    // budgets adaptés
  gating?: 'soft'|'lock';                                // décision n°3 — défaut 'soft'
  recommendedForProfiles: string[];                      // ids de profils ikigai
  milestone?: ParcoursMilestone;
  steps: ParcoursStep[]; outcomes: LocalizedText[];
}
interface ParcoursMilestone {
  type: string; label: LocalizedText; description: LocalizedText;
  evaluation?: ('auto'|'peer')[];                        // décision n°2 — auto d'abord, pair ensuite
  rubricId?: string; modelAnswerId?: string;
}
interface ParcoursStep {
  order: number; type: 'coeur'|'bonus'|'pratique'|'respiration';
  ref: { kind: 'lesson'|'course'|'case'|'simulator'|'glossary'|'milestone'; id: string };
  label: LocalizedText; status: 'existant'|'a-produire';
  keystone?: boolean; prereqNote?: LocalizedText; note?: string; // décision n°3
}
```

Choix clés : (1) un parcours ne **stocke pas** de contenu, il **référence** des atomes par `id` → zéro duplication, navigation libre native ; (2) `status: 'a-produire'` rend visible le contenu neuf à écrire ; (3) `timeFit` + `type` d'étape implémentent le curseur temps ; (4) côté base, les parcours sont seedés dans `LearningPath` avec `data(JSON)` — aucune migration lourde ; (5) **i18n** (décision n°5) : tout champ visible est `LocalizedText` — une `string` reste valide (= `fr`), les surcharges vivent dans `parcours.en.json`, fusionnées par `id` ; politiques (gating, évaluation, locales, nommage) centralisées dans `parcoursConfig.json`.

Le JSON livré implémente **22 parcours** : 4 `now`, 13 `next`, 5 `later`. Les étapes sont résolues côté client par `resolveStep()` vers les routes des leçons, cours, cas, simulateurs ou glossaire. Côté serveur, `server/src/lib/content.ts` charge `data/parcours/*.lessons.json` et `server/prisma/seed.ts` utilise `content.allLessons()` : après `npm run db:seed`, les leçons drop-in sont aussi visibles par l'API.

**Authoring actuel.** Les docs de rédaction vivent dans `docs/parcours/`. Les registres actifs dans `data/parcours/*.lessons.json` sont :

- `01-le-vc-sans-bullshit.lessons.json` : 7 leçons `ld-*`, importées explicitement côté client.
- `03-lever-son-fonds-lp.lessons.json` : 3 leçons `llp-*`, auto-chargées côté serveur et importées côté client.
- `04-le-standard-francais.lessons.json` : 1 leçon `lts-*`, auto-chargée côté serveur et importée côté client.

Les contenus `lea-*` (entretien Analyst), `lf-*` (levée founder) et `lpl-*` (Power Law & Monte Carlo) vivent désormais dans `data/lessons.json` : ils sont canoniques, indexés et seedés comme les autres leçons.

---

## 10. Feuille de route — état courant / prochain / plus tard

Format Now/Next/Later dans les données ; ici on distingue ce qui est livré de ce qui reste utile.

**Livré — fondation + catalogue exploitable**
- Modèle de données `Parcours`, `parcoursTypes.ts`, loader `parcours.ts`, `profileParcours.json`, `parcoursConfig.json`.
- Page Parcours `/paths` : Atlas + familles repliables + bandeau « Ton parcours ».
- Bibliothèque `/bibliotheque` : cours, lectures et études de cas intégrés ; anciens rayons conservés.
- Route pivot `/paths/:slug` : parcours neuf ou rayon legacy sans collision.
- 22 parcours en données : 4 `now`, 13 `next`, 5 `later`.
- Parcours `now` : **Le VC sans bullshit**, **Réussir l'entretien Analyst**, **Préparer ma seed**, **Lever son fonds VC (LPs & Institutions)**.
- Cours canonique **Power Law & Monte Carlo** + intégration au parcours `p-penser-gp`, au rayon Portfolio, au simulateur Power Law et aux références de glossaire.

**Prochain — consolider avant d'étendre**
- Figer le workflow d'authoring : quand rester en drop-in, quand replier dans `data/lessons.json`, quand seed.
- Synchroniser systématiquement `parcours.steps[]`, `course.lessonIds[]`, `relatedLessonIds` du glossaire et `furtherReading`.
- Brancher `PathDetailPage` et `CourseDetailPage` sur l'API avec fallback bundle.
- Ajouter dans l'admin un signal « non versionné dans `/data` » pour éviter la divergence CMS → DB.
- Terminer les 10 étapes encore `a-produire` (principalement mini-cases, simulations d'IC, process de levée, thèse propriétaire).
- Ajouter les quiz manquants aux leçons qui en sont dépourvues.

**Plus tard — profondeur produit**
- Décider le mode de rendu (CSR actuel vs hybride SSG/ISR recommandé) avant de produire massivement du contenu SEO-dépendant.
- Étendre l'i18n au chrome puis aux contenus pilotes, sans casser les slugs canoniques.
- Génération **sur-mesure** complète depuis l'ikigai (profil × stade × temps → parcours assemblé) ; archétypes comme destinations longues.
- Progression gamifiée douce (séries, jalons, *cahier* de réalisations).
- Revue par les pairs sur les livrables (deal memo, deck) — boucle communautaire.
- Variantes **US / EMEA / Asie** après stabilisation FR-first.

**Garde-fou de capacité.** À chaque ajout au catalogue, se demander « qu'est-ce qui sort ? ». Mieux vaut 6 parcours finis et vivants que 20 ébauches. Le contenu **[à produire]** est le vrai goulot — le prioriser, pas multiplier les coquilles.

---

## 11. Décisions (suite à arbitrage)

1. **Levée : les deux côtés de la table.** On assume les deux publics (5 profils investisseur + 1 fondateur). La famille **Lever des fonds** devient **bi-perspective** : le versant *fondateur* (pré-seed / seed / Série A) **et** le versant *investisseur* (« Mener un tour de table » : ownership cible, syndication, rédaction de la term sheet — §6.3). Un investisseur doit maîtriser les deux lectures. → Champ `perspective: 'founder' | 'investor' | 'both'` au modèle ; défaut `investor` (le site est investisseur-centré), `both` pour la Levée.

2. **Jalons : auto d'abord, pairs ensuite.** Chaque jalon à livrable s'auto-évalue dès le départ (grille critériée + corrigé modèle), puis bascule en **revue par les pairs** au choix de l'apprenant. → `milestone.evaluation: ['auto', 'peer']` (+ `rubricId`, `modelAnswerId`). Les quiz restent `['auto']`.

3. **Gating : souple par défaut, verrou optionnel.** Zéro verrou dur par défaut — les prérequis sont seulement *conseillés*. Un **mode « lock »** activable (par l'apprenant, ou imposé sur un parcours technique) rétablit la séquence. Les étapes décisives pour la suite sont marquées `keystone` avec une mention « important pour la suite ». → `gating: 'soft' | 'lock'` (défaut `soft`) et `step.keystone`.

4. **Nommage (tranché, affinable).**
   - **Bibliothèque** — toute la matière, librement navigable.
   - **Rayons** — les regroupements thématiques (les ex-9 « parcours » : Découvrir le VC, Term sheets…), pour flâner par sujet.
   - **Parcours** — les trajectoires par objectif (la couche neuve).
   - Atomes : **cours, leçons, cas, simulateurs**.

5. **i18n dès le modèle.** Les champs textuels deviennent `LocalizedText` (`string` = locale par défaut `fr`, ou `{ fr, en, … }`). `parcours.json` reste FR (valide tel quel) ; les traductions vivent dans des fichiers d'surcharge par locale (`parcours.en.json`, fusionnés par `id`). Politique dans `parcoursConfig.json`. Priorité projet respectée : FR d'abord, EN ensuite, EMEA/Asie symbolique.

---

*Fin de la note. Données : `parcours.json` · `profileParcours.json` · `parcoursConfig.json` · type `Parcours` (`parcoursTypes.ts`).*
