# Parcours d'apprentissage — note de conception

> Repenser les parcours de `vc-platform` à partir des objectifs de l'utilisateur,
> et non du contenu déjà en place. Les 9 « parcours » actuels sont traités comme
> un brouillon : on garde la **matière**, on jette le **découpage**.
>
> Livrable jumeau : `data/parcours.json` (+ type `Parcours`) — voir §9.
> Date : juin 2026.

---

## 0. En une page

Aujourd'hui, les 9 « parcours » sont en réalité un **programme** (des matières rangées par difficulté). Ils répondent à « qu'y a-t-il à apprendre ? », jamais à « **je veux ça, je suis là, j'ai ce temps — par où je commence ?** ».

La proposition tient en trois couches :

| Couche | Question | Ce que c'est | Statut |
|---|---|---|---|
| **Matières** | *Qu'y a-t-il à apprendre ?* | La bibliothèque : leçons, cours, cas, simulateurs, glossaire. Libre, réutilisable. | Existe déjà (à re-cadrer) |
| **Parcours** | *Où veux-tu aller ?* | Une colonne vertébrale qui compose des matières vers une destination concrète (décrocher un stage, lever sa seed…). | **À créer** |
| **Profils** | *Qui es-tu ?* | Le test d'orientation ikigai (6 profils + budget-temps + 3 archétypes) qui **aiguille** vers le bon parcours. | Existe déjà (à brancher) |

Un parcours se définit sur **trois axes** : **objectif × niveau × temps**. Le temps n'est pas une famille à part : c'est un **curseur** qui raccourcit ou enrichit chaque parcours — *plus* une étagère « Express » de formats courts qui se bingent en une session.

Décision d'architecture : **couche au-dessus** (les matières restent une bibliothèque libre, les parcours les composent). On y arrive en douceur via une phase hybride (3 parcours phares d'abord). Détail en §4.

Principe directeur : **le parcours est une colonne vertébrale, pas un couloir.** Tout est accessible librement ; le parcours suggère un chemin et mémorise ta progression, il n'enferme jamais.

---

## 1. Le constat

Ce qui ne va pas dans le brouillon actuel :

- **Ce sont des matières déguisées en parcours.** « Term sheets & structuration », « Fund economics », « Portfolio management » sont des *sujets*, pas des *trajectoires*. Un sujet ne dit pas à l'utilisateur quoi faire de sa semaine.
- **L'objectif est absent.** Personne ne se réveille en voulant « faire le module Fund economics ». On se réveille en voulant *réussir un entretien jeudi*, *préparer sa levée*, *enfin comprendre une term sheet*. Le contenu est rangé par logique de professeur, pas par intention d'apprenant.
- **La personnalisation tourne à vide.** Le test ikigai calcule déjà un profil + un budget-temps… pour recommander 3 *matières*. C'est une liste de lecture, pas un parcours. Le plus beau morceau du produit (l'orientation) débouche sur un cul-de-sac.
- **Le ton est uniforme et sérieux.** La matière est exigeante, littéraire, dense. Excellent pour un cours ; trop lourd comme *porte d'entrée*. Il manque un registre léger, bingeable, qui donne envie de cliquer sur « épisode suivant ».

Bonne nouvelle : rien n'est à jeter. La matière est solide et l'orientation ikigai est un atout rare. Il faut **ajouter la couche qui manque** — la trajectoire — et **rebrancher** l'orientation dessus.

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

**Matières — la bibliothèque.** L'atome de connaissance. Une leçon, un cours, un cas, un simulateur, une fiche glossaire. Chaque atome **se tient seul**, se trouve par la recherche, se met en favori, se lit hors de tout parcours. C'est l'actuel `paths/courses/lessons`, re-cadré : les 9 « parcours » deviennent des **matières** (ou « rayons » de la bibliothèque). Aucun contenu perdu.

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

Concrètement : on garde les 9 matières en bibliothèque, on **ne refait pas** le contenu existant, et on construit la **couche parcours** par-dessus. On démarre hybride (3 parcours phares en §10 « Now ») pour livrer de la valeur tout de suite, puis on étend le catalogue sans jamais retoucher les matières.

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

Sept familles. Les matières citées en `code` existent déjà (réutilisées telles quelles) ; les étapes marquées **[à produire]** sont le contenu neuf à écrire (peu nombreux, ciblés). Légende des étapes : `cœur` · `bonus` · `pratique` · `respiration`.

> Note sur les exemples : tu m'avais proposé prépa entretien / prépa levée / montée en grade / express / sur-mesure. J'ai gardé les cinq, et **ajouté** deux familles qui manquaient à mon sens : **Découvrir** (la porte d'entrée, sans elle on perd le curieux dès la première minute) et **Maîtriser un sujet** (les obsessions mono-thème, le contenu le plus bingeable et le plus partageable).

### 6.1 — Découvrir · *la porte d'entrée*

**発 Le VC sans bullshit** — *l'amorce express*
> *En 1 h, comprends comment l'argent passe de l'épargne aux fondateurs — et pourquoi 9 startups sur 10 doivent mourir pour que le métier marche.*
**Pour qui** curieux, étudiants · **Niveau** débutant · **Temps** ~1 h (7 épisodes × ~8 min) · **Profil** `debutant-curieux`
**Destination** nommer les acteurs (LP/GP/BA), comprendre la loi de puissance et la grammaire des stades.
**Colonne** — `respiration` Pourquoi 9 sur 10 doivent mourir (`l-power-law`) → `cœur` C'est quoi le VC, vraiment (`l-vc-definition`) → `cœur` Le voyage de l'argent (`l-actors`) → `cœur` Pré-seed à Série C (`l-stages`) → `respiration` Cas : l'Europe contre le mythe de la Valley (`cs-europe-vs-valley`) → `bonus` Le cycle de vie d'un fonds (`l-fund-lifecycle`).
**Jalon** quiz éclair de fin (pas de livrable).

**業 Une semaine dans la peau d'un VC** — *le métier démystifié*
> *Sourcing, screening, comité, accompagnement : à quoi ressemble vraiment la semaine, loin du mythe du « gros chèque ».*
**Pour qui** curieux, futurs candidats · **Niveau** débutant · **Temps** ~45 min · **Profils** `debutant-curieux` `futur-analyste`
**Colonne** — `cœur` Une semaine type (`l-vc-week`) → `cœur` Qui fait quoi, analyst→partner (`l-roles`) → `bonus` Comment naît un pipeline (`l-sourcing`) → `respiration` Le mythe « le VC mise » démonté **[à produire]**.

### 6.2 — Réussir un entretien · *la famille phare côté carrière*

**門 Décrocher un stage en VC** — *pour étudiants*
> *Construis la candidature ciblée + la mini-analyse de startup qui te font sortir de la pile.*
**Pour qui** étudiants (Bac+4/5), reconvertis · **Niveau** débutant · **Temps** ~3–4 h · **Profils** `futur-analyste` `debutant-curieux`
**Destination** une candidature ciblée sur un fonds + une analyse de startup auto-produite (*le* différenciateur au recrutement).
**Colonne** — `cœur` Les portes d'entrée du venture en France (`l-career-breaking-in`) → `cœur` Comprendre une thèse de fonds pour la cibler (`l-thesis-anatomy`) → `cœur` Lire une startup en 4 piliers (`l-team-market`) → `pratique` Écrire une mini-analyse d'une boîte du portefeuille **[à produire : gabarit + exemple]** → `respiration` Le café-réseau quand on n'a pas de réseau **[à produire]** → `bonus` Les niveaux du métier (`l-career-levels`).
**Jalon** une analyse d'1 page d'une startup d'un fonds cible.

**観 Réussir l'entretien Analyst** — *le cœur de cible*
> *Passe le case study et le deal memo : une reco invest/pass claire, défendable, en temps contraint.*
**Pour qui** candidats analyst · **Niveau** intermédiaire · **Temps** ~6–8 h (cœur) / ~10 h (immersion) · **Profil** `futur-analyste`
**Destination** produire un deal memo (1 page ou 4 slides) avec recommandation et risques hiérarchisés.
**Colonne** — `cœur` Sourcing & screening (`l-sourcing`, `l-screening`) → `cœur` Lire une startup : équipe, marché, traction (`l-team-market`, `l-traction-unit-economics`) → `cœur` Dimensionner un marché : TAM/SAM, top-down & bottom-up **[à produire]** → `pratique` Pre/post-money & dilution (`pre-post-money`, `dilution`) → `cœur` Le deal memo : structure d'une reco **[à produire : gabarit]** → `pratique` **Mock case chronométré [à produire : sujet + grille]** → `respiration` Cas : portefeuille power-law (`cs-power-law-portfolio`) → `bonus` DD priorisée (`l-dd-process`).
**Jalon** un deal memo + reco invest/pass. *(Conseil intégré : parler à 2–3 personnes du secteur avant de conclure, comme en vraie DD.)*

**決 Réussir l'entretien Associate** — *un cran au-dessus*
> *Mène une DD complète et défends ton mémo en comité simulé. On te jugera sur le jugement, pas l'exécution.*
**Pour qui** candidats associate, analysts qui montent · **Niveau** avancé · **Temps** ~8 h · **Profils** `associate-progression` `futur-analyste`
**Colonne** — `cœur` DD en pratique (`l-dd-process`) → `cœur` Construire & défendre une thèse (`l-thesis-anatomy`, `l-defending-thesis`) → `cœur` Anatomie d'une term sheet : éco + contrôle (`l-ts-economics`, `l-ts-control`) → `pratique` Waterfall & liquidation pref (`waterfall`) → `respiration` Cas : le piège de la valo flatteuse (`cs-liquidation-preference`) → `pratique` **Simulation de comité d'investissement [à produire]** → `bonus` « Pourquoi ce fonds » : ta thèse perso **[à produire]**.
**Jalon** deal memo complet + passage en IC simulé.

**道 Entretien Principal / poste senior** — *penser fonds*
> *Montre que tu raisonnes à l'échelle du fonds : thèse propriétaire, construction de portefeuille, ce que tu apporterais.*
**Pour qui** candidats principal/senior · **Niveau** avancé · **Temps** ~6 h · **Profils** `principal-mindset` `associate-progression`
**Colonne** — `cœur` Portefeuille en loi de puissance (`l-reserves`, `l-triage`) → `cœur` Économie d'un fonds : fees, carry, métriques (`l-fees-carry`, `l-fund-metrics`) → `pratique` DPI/TVPI/MOIC (`fund-returns`) → `cœur` Thèse propriétaire **[à produire]** → `bonus` Cas power-law (`cs-power-law-portfolio`).
**Jalon** note de thèse + plan de portefeuille.

### 6.3 — Lever des fonds · *côté fondateur, par série*

**種 Préparer ma pré-seed**
> *De l'idée au premier chèque : narratif, bon instrument (SAFE/BSA-AIR), combien lever (~1–1,5 M€) sans trop te diluer (~20 %).*
**Pour qui** fondateurs au tout début · **Niveau** tous · **Temps** ~4 h · **Profil** `entrepreneur-levee`
**Colonne** — `cœur` Comprendre le VC pour mieux lever (`l-founder-narrative`) → `cœur` SAFE, BSA-AIR ou priced ? (`l-founder-instruments`) → `cœur` Combien lever & quelle dilution, benchmarks 2026 (`l-stages`) **[+ à produire : repères chiffrés]** → `pratique` Ton scénario de levée (`fundraising-scenario`) → `pratique` Ta dilution (`dilution`) → `respiration` Cas : la dilution d'un fondateur seed→C (`cs-dilution-journey`).
**Jalon** one-liner + mini-deck (5 slides) + fourchette montant/valo.

**募 Préparer ma seed**
> *Un deck qui tient, une cap table post-tour maîtrisée, un process de levée que tu pilotes (et pas l'inverse).*
**Pour qui** fondateurs avec traction · **Niveau** intermédiaire · **Temps** ~6 h · **Profil** `entrepreneur-levee`
**Destination** repères 2026 : ~2,5–3,5 M€ sur ~12–15 M€ post-money, 20–25 % de dilution.
**Colonne** — `cœur` Le narratif & le data room (`l-founder-narrative`) **[+ à produire : data room]** → `cœur` Les métriques attendues en seed **[à produire]** → `cœur` Priced round vs SAFE à ce stade (`l-founder-instruments`) → `pratique` Pre/post-money & ownership (`pre-post-money`, `ownership`) → `cœur` Lire la term sheet qu'on te présente (`l-ts-economics`, `l-ts-control`) → `respiration` Cas : valo flatteuse (`cs-liquidation-preference`) → `bonus` Gérer le process : calendrier, FOMO **[à produire]**.
**Jalon** deck seed + cap table post-tour.

**階 Préparer ma Série A**
> *« La seed d'aujourd'hui ressemble à l'ancienne Série A. » ARR ~2,5 M€, board, et une term sheet qui se négocie ligne à ligne.*
**Pour qui** fondateurs en croissance · **Niveau** avancé · **Temps** ~8 h · **Profils** `entrepreneur-levee` `associate-progression`
**Colonne** — `cœur` Les attentes en Série A : métriques, board **[à produire]** → `cœur` Term sheet : économie vs contrôle, ligne à ligne (`l-ts-economics`, `l-ts-control`) → `pratique` Waterfall & liquidation pref (`waterfall`) → `pratique` Dilution multi-tours (`dilution`) → `respiration` Cas : dilution seed→C (`cs-dilution-journey`) → `cœur` Négocier sans casser la relation (`l-founder-narrative`) **[+ à produire : tactiques de négo]** → `bonus` Construire son board **[à produire]**.
**Jalon** négociation simulée + cap table multi-tours.

**階 Mener un tour de table** — *l'autre lecture de la levée, côté investisseur*
> *De l'autre côté de la table : comment un VC structure un tour, fixe son ownership cible, syndique et rédige la term sheet.*
**Pour qui** analysts/associates · **Niveau** avancé · **Temps** ~5 h · **Perspective** investisseur · **Profils** `associate-progression` `principal-mindset`
**Colonne** — `cœur` Économie du tour (`l-ts-economics`) → `cœur` Contrôle & gouvernance (`l-ts-control`) → `pratique` Ownership cible (`ownership`) → `pratique` Liquidation pref (`waterfall`) → `cœur` Structurer par stade (`l-stages`) → `respiration` Cas : la valo flatteuse (`cs-liquidation-preference`).
**Jalon** rédiger une term sheet + cible d'ownership *(auto + pairs)*.

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
Économie d'un fonds, relation LP, portefeuille en loi de puissance.
**Colonne** — `cœur` `l-fees-carry`, `l-fund-metrics` → `cœur` `l-reserves`, `l-triage` → `pratique` `fund-returns` → `respiration` `cs-power-law-portfolio` → `bonus` `cs-europe-vs-valley`. **Jalon** mini-modèle de retour de fonds + note LP.

### 6.5 — Maîtriser un sujet · *les obsessions mono-thème (le contenu le plus bingeable)*

Courts, autonomes, partageables. Servent aussi de **briques** dans les parcours longs et de **contenu Express**.

- **契 Décoder une term sheet** (~1 h) — `l-ts-economics`, `l-ts-control` + `pratique` `waterfall` + `respiration` `cs-liquidation-preference`. **Jalon** lire une vraie TS sans trembler.
- **表 Lire un cap table sans paniquer** (~45 min) — `l-stages` + `pratique` `ownership`, `dilution` + `respiration` `cs-dilution-journey`.
- **報 Le carry, enfin clair** (~1 h) — `l-fees-carry` + `pratique` `fund-returns` + `l-fund-metrics`.
- **観 Dimensionner un marché (TAM/SAM/SOM)** (~45 min) — **[à produire]** + `l-team-market`.
- **算 Unit economics & Rule of 40** (~45 min) — `l-traction-unit-economics` **[+ à produire : Rule of 40]**.

### 6.6 — Express · *un format, pas un silo*

Étagère qui **rassemble tout ce qui se fait en une session** (≈ 1 h, bingeable, zéro engagement) : `Le VC sans bullshit` (§6.1), les cinq deep-dives (§6.5), plus deux crash-courses :

- **L'entretien VC en 1 h** — `l-roles` + `l-team-market` + mini-case **[à produire]**.
- **Lever en 1 h : l'essentiel** — `l-founder-narrative` + `l-founder-instruments` + `pratique` `fundraising-scenario`.

Rappel : *tout* parcours long a aussi sa « route express » via le curseur temps (cœur uniquement). L'étagère Express, elle, met en avant les produits **conçus** courts.

### 6.7 — Sur-mesure ikigai · *l'aiguillage, pas un parcours figé*

Le test d'orientation ne recommande plus 3 *matières* mais **un parcours calibré**. Table de routage profil → parcours (le budget-temps règle ensuite la cadence) :

| Profil ikigai | Parcours recommandé | Puis |
|---|---|---|
| `debutant-curieux` | Le VC sans bullshit | Une semaine dans la peau d'un VC |
| `entrepreneur-levee` | Préparer ma pré-seed / seed *(selon stade)* | Décoder une term sheet |
| `futur-analyste` | Décrocher un stage en VC | Réussir l'entretien Analyst |
| `analyst-progression` | Devenir un meilleur Analyst | Passer Associate |
| `associate-progression` | Passer Associate | Passer Principal |
| `principal-mindset` | Penser comme un GP | Passer Principal |

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

**Page Parcours** — des étagères façon Netflix, une par famille (Découvrir, Réussir un entretien, Lever des fonds, Monter en grade, Maîtriser, Express). Chaque carte : promesse en une ligne, temps, niveau, anneau de progression. En tête, un bandeau **« Ton parcours »** (sortie du test ikigai) si un profil existe.

**Trois portes d'entrée** — (a) le test ikigai t'**aiguille** ; (b) tu **flânes** dans les étagères ; (c) tu **sautes** depuis n'importe quelle matière (« Ce cours fait partie de 3 parcours »).

**Page d'un parcours** — la colonne en vertical (une « carte de voyage »), étapes typées (cœur/bonus/pratique/respiration). Un **curseur temps** (lié à ton `timeBudget`) plie/déplie les bonus. Un bouton « reprendre où j'en étais ». Des liens « dévier » assumés. Le jalon est mis en avant comme **récompense**, pas comme examen.

**Pas de verrou.** Au plus un *prérequis conseillé* en filigrane. La progression se cumule par étape et remonte au parcours, sans jamais bloquer.

**Réutilise l'existant** — l'esthétique (kanji, accents, ornements ikigai), les `Bookmark`/`Progress`/`Note` déjà au modèle, le composant `PathAtlas`. Le rayon actuel « Parcours » devient **« Bibliothèque »** (les matières) ; « Parcours » désigne la couche neuve.

---

## 9. Modèle de données

Livrable jumeau : **`data/parcours.json`** + le type **`Parcours`** (à ajouter à `client/src/content/types.ts`) + la **table de routage** `data/profileParcours.json`. Schéma (résumé) :

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

Choix clés : (1) un parcours ne **stocke pas** de contenu, il **référence** des atomes par `id` → zéro duplication, navigation libre native ; (2) `status: 'a-produire'` rend visible le contenu neuf à écrire ; (3) `timeFit` + `type` d'étape implémentent le curseur temps ; (4) côté base, une table `Parcours { id, slug, family, data(JSON), order }` calquée sur `LearningPath` existante — aucune migration lourde ; (5) **i18n** (décision n°5) : tout champ visible est `LocalizedText` — une `string` reste valide (= `fr`), les surcharges vivent dans `parcours.en.json`, fusionnées par `id` ; politiques (gating, évaluation, locales, nommage) centralisées dans `parcoursConfig.json`.

Le JSON livré implémente intégralement les parcours **Now + Next** (avec IDs réels) et esquisse les **Later**.

---

## 10. Feuille de route — Now / Next / Later

Format Now/Next/Later (engagement décroissant, pas de fausses dates).

**Now — la fondation + 3 phares** *(prouver la valeur, réutiliser un maximum)*
- Modèle de données `Parcours` + page Parcours (étagères) + re-cadrage « Bibliothèque ».
- Brancher la sortie du test ikigai → parcours recommandé (table §6.7).
- **3 parcours phares**, presque 100 % matière existante : **Le VC sans bullshit** (découverte), **Réussir l'entretien Analyst** (intention n°1 côté carrière), **Préparer ma seed** (intention n°1 côté fondateur).
- *Pourquoi ces trois :* portée maximale (les trois grandes intentions du site), effort minimal (composition d'atomes déjà écrits — seuls le mock case, le gabarit memo et 2–3 repères chiffrés sont neufs).

**Next — compléter les familles + la pratique**
- Familles entretien (stage, associate, principal) et levée (pré-seed, Série A) complètes.
- Les 5 deep-dives **Maîtriser** + l'étagère **Express**.
- Curseur temps (cœur/bonus) et jalons interactifs (mock case, deal memo, simulation d'IC, cap table).
- Refonte du ton (intros d'épisode, promesses, mythes démontés) sur les parcours Now.

**Later — sur-mesure & profondeur**
- Génération **sur-mesure** complète depuis l'ikigai (profil × stade × temps → parcours assemblé) ; archétypes comme destinations longues.
- Famille **Monter en grade** complète + livrables de poste.
- Progression gamifiée douce (séries, jalons, *cahier* de réalisations).
- Variantes **US / EMEA / Asie** (symboliques, conformément à la priorité projet).
- Revue par les pairs sur les livrables (deal memo, deck) — boucle communautaire.

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
