# Plan d'exécution — remédiation des parcours et leçons

> Dérivé de `docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md` (état du worktree au 24 juillet 2026). Ce document est un plan de travail prospectif, pas un instantané d'état : il ne remplace ni `Suivis/ETAT.md`, ni les documents de référence maintenus. Les priorités reprennent le classement établi le 26 juillet 2026.

## Comment lire ce document

Chaque partie fournit quatre choses : un **prompt autoportant** (une session démarre sans contexte, le prompt doit donc désigner ses propres autorités et son propre périmètre), les **fichiers possédés**, les **garde-fous spécifiques** qui s'ajoutent au socle commun, et un **nombre de sessions** avec son critère de sortie.

Le nombre de sessions est un ordre de grandeur fondé sur trois critères : le nombre de fichiers possédés, la nature du travail (mécanique ou éditorial — les deux ne se relisent pas de la même façon), et le besoin de figer l'état avant une porte large. Il ne dépend pas d'une vélocité mesurée, qui n'existe pas dans le dépôt.

---

## Socle commun de garde-fous

À rappeler dans chaque session. Les prompts ci-dessous y renvoient par la mention « socle commun ».

**Invariants du dépôt**

- Ne jamais éditer `data/generated/`. Régénérer par `npm run split:content` après modification de `data/lessons.json`, `data/parcours/*.lessons.json` ou `data/glossary.json`.
- Ne jamais commiter, pousser ni déployer. La publication est manuelle (`Suivis/PROCEDURE_PUSH.md`) et dormante.
- Les `id` et `slug` sont stables. Un renommage casse `glossaryRefs`, `lessonIds`, `courseId`, les routes et le sitemap.
- Une entrée de glossaire se travaille d'abord dans `data/sources/canonical-glossary.json`, puis dans `data/glossary.json`, puis `npm run aliases:merge`, `npm run validate:glossary`, `npm run validate:content`, puis régénération.
- Un audit, une revue ou un diagnostic est en lecture seule. Signaler les trouvailles hors périmètre, ne pas les corriger.
- Préserver les modifications non liées présentes dans le worktree. `git status` au début, avant la première écriture et avant clôture.
- Ne pas modifier `Suivis/ETAT.md` sauf si la livraison change son état vérifié, ses comptes, ses risques ou ses priorités. N'ajouter à `Suivis/JOURNAL.md` que pour une livraison durable et matérielle.

**Charte éditoriale** — `docs/ARCHITECTURE_EDITION.md` §4.0.c, autorité canonique pour toute prose publiée.

- Registre sobre, factuel, institutionnel. Proscrits : tutoiement, slogans, punchlines de fin de paragraphe, métaphores vendeuses, superlatifs, dramatisation, adverbes qui dictent au lecteur ce qu'il doit ressentir, méta-discours (« Notre lecture : »), énumérations formulaires (« Premièrement… Deuxièmement… »).
- Distinguer explicitement fait établi, interprétation, hypothèse et opinion.
- **Ne jamais inventer une source, une licence, un auteur, une date de vérification ou un statut de publication.** Une URL syntaxiquement valide n'est pas une preuve éditoriale : vérifier le support proposition par proposition.
- Pour toute pratique contractuelle, réglementaire ou fiscale : préciser la juridiction, dater l'affirmation, indiquer que le contenu ne vaut pas conseil juridique.

**Hygiène de session**

- Une session possède un jeu de fichiers borné et se termine sur une porte ciblée verte. Si elle se termine rouge, ne pas enchaîner : diagnostiquer d'abord.
- Ne jamais mélanger une décision et son implémentation dans la même session.
- Ne jamais mélanger travail mécanique et travail éditorial dans la même session : les standards de relecture diffèrent.
- Un seul rédacteur par invariant partagé. Deux sessions ne touchent jamais le même fichier en parallèle.
- Avant une porte large (`npm run check`, `npm run build`), figer le jeu de fichiers. Une édition postérieure invalide la preuve.

**Portes à exécuter selon la nature du changement**

| Nature | Commandes |
|---|---|
| Contenu JSON isolé | `npm run validate:content` + `npm run split:content` + `npm run check:generated` |
| Contenu transverse ou multi-collections | `npm run check` |
| Code client | tests ciblés + `npm run typecheck` + `npm run lint` |
| Routage, bundling, artefacts publics | `npm run build` (avec `VITE_SITE_URL`) |
| Rendu, mise en page, interaction | passe navigateur locale, desktop 1440×1000 et mobile 390×844 |

---

## P0 — Décisions de cadrage

### P0.1 — Mémo d'arbitrage (3 décisions)

**Objectif.** Produire les options chiffrées des trois décisions qui conditionnent le chiffrage de tout le reste. Aucune production, aucune modification de contenu.

**Fichiers possédés.** Aucun en écriture. Sortie : un mémo dans la réponse, ou `docs/reviews/2026-07-XX-arbitrages-cadrage.md` si l'utilisateur le demande.

```
Session en LECTURE SEULE. Tu ne modifies aucun fichier.

Lis d'abord CLAUDE.md, puis docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md.

Produis un mémo d'arbitrage sur trois décisions, chacune avec ses options,
leurs conséquences chiffrées et une recommandation argumentée. Ne tranche pas
à ma place : présente les options.

DÉCISION 1 — Statut de `math-vc-dossier`.
Les sept leçons `lmv-*` portent 405 minutes de contributions structurées vers
ce livrable. Recense précisément : quels parcours réutilisent `c-mathematiques-vc`
ou des leçons `lmv-*`, quelle durée chacun déclare dans data/parcours.json, et
quel serait l'écart si les 405 minutes étaient intégrées. Vérifie ce
qu'affirme docs/parcours/ANALYST-FOUNDATIONS.md sur le rattachement d'un
livrable autonome, et signale la contradiction avec les cartes de pratique
réellement présentes dans les leçons.
Options à instruire : (a) requis et compté, (b) facultatif et annoncé
séparément, (c) hors parcours avec retrait des cartes de pratique.

DÉCISION 2 — Sort des quatre étapes `a-produire` facultatives :
`todo-myth-vc-mise` (p-semaine-vc), `todo-cafe-reseau` (p-stage),
`todo-pourquoi-ce-fonds` (p-entretien-associate), `todo-process-levee` (p-seed).
Pour chacune : ce que la promesse du parcours perdrait au retrait, et ce que
coûterait la production. Le retrait est une option légitime et immédiate.

DÉCISION 3 — Les six cours de préparation référencés par `cert-analyst-vc`
(c-startup-analysis, c-due-diligence, c-investment-recommendation,
c-analyst-stage, c-analyst-deal-role, c-analyst-specialties) existent dans
data/courses.json mais ne sont référencés par aucun parcours. Décris leur
état réel (leçons référencées, statut, complétude) et instruis :
(a) les absorber dans des parcours existants, (b) les laisser rattachés à la
seule certification, (c) les geler explicitement.

Pour chaque décision, termine par : ce qui est débloqué, ce qui reste bloqué,
et quelles autres parties du plan de remédiation en dépendent.
```

**Garde-fous spécifiques.** Lecture seule stricte — la tentation de « corriger au passage » un placeholder est le risque principal. Le mémo ne tranche pas : il instruit. Ne pas modifier `Suivis/ETAT.md`.

**Sessions : 1.** Critère de sortie : les trois décisions sont documentées avec options et conséquences, et l'utilisateur a tranché.

### P0.2 — Application de la décision 2

**Objectif.** Retirer ou produire les quatre placeholders facultatifs, selon l'arbitrage rendu.

**Fichiers possédés.** `data/parcours.json` uniquement (cas retrait).

```
Applique la décision suivante : [COLLER LA DÉCISION P0.1 #2 ICI].

Périmètre strict : les quatre étapes `a-produire` facultatives
`todo-myth-vc-mise`, `todo-cafe-reseau`, `todo-pourquoi-ce-fonds`,
`todo-process-levee` dans data/parcours.json.

Hors périmètre explicite : les trois étapes requises `todo-attentes-serie-a`,
`todo-ecrire-memo`, `todo-mini-case-express`. Tu n'y touches pas.

En cas de retrait : supprime l'étape, vérifie qu'aucune autre étape ou
métadonnée du parcours ne la référence, et contrôle que la durée déclarée
du parcours reste cohérente avec les étapes restantes. Signale l'écart sans
le corriger — la réconciliation des durées est une tâche distincte (P3.5).

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run validate:content puis npm run split:content puis
npm run check:generated. Rends-moi le diff et le résultat de chaque commande.
```

**Garde-fous spécifiques.** Ne pas déborder sur les trois placeholders requis. Ne pas « en profiter » pour réconcilier les durées : cette tâche a sa propre session et son propre prérequis (décision 1).

**Sessions : 1.** Critère de sortie : `validate:content` vert, `check:generated` sans écart, aucune étape orpheline.

---

## P1 — Contenus faux actuellement rendus

### P1.1 — `cs-dilution-journey` et le TRI de `lmv-returns-waterfall`

**Objectif.** Corriger deux erreurs arithmétiques publiées.

**Fichiers possédés.** `data/caseStudies.json`, `data/lessons.json` (entrée `lmv-returns-waterfall` uniquement).

```
Corrige deux erreurs arithmétiques.

ERREUR 1 — `cs-dilution-journey` dans data/caseStudies.json.
Le cas applique des dilutions successives de 22 %, 20 %, 16 % et 14 % puis
annonce une détention finale « ≈ 28 % ». Le calcul correct donne 45,08 %.

Il y a deux corrections possibles et elles ne sont PAS équivalentes :
  (a) corriger le résultat affiché : 28 % devient 45,08 %
  (b) corriger les données d'entrée : les quatre dilutions deviennent
      cohérentes avec une sortie ≈ 28 %

Avant de choisir, lis l'intégralité du cas et détermine laquelle des deux
sert son intention pédagogique — le titre annonce « du seed à la Series C »
et le propos porte sur la dilution du fondateur. Expose ton raisonnement,
propose la correction, et attends ma validation avant d'écrire.

Ce cas est réutilisé par p-preseed, p-serie-a et p-cap-table. Vérifie qu'aucun
de ces trois parcours, ni aucune leçon, ne cite le chiffre erroné ailleurs.

ERREUR 2 — `lmv-returns-waterfall` dans data/lessons.json.
Le TRI publié est 23,69 % ; la réconciliation exacte donne 23,6935 %.
Vérifie le calcul avant de corriger, et applique la convention d'arrondi
déjà utilisée dans les autres leçons `lmv-*` plutôt que d'en introduire une.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run validate:content, npm run split:content,
npm run check:generated.
```

**Garde-fous spécifiques.** L'arbitrage (a)/(b) sur la dilution est éditorial, pas technique : il ne se tranche pas en silence. Ne pas introduire de nouvelle convention d'arrondi.

**Sessions : 1.** Critère de sortie : les deux chiffres sont recalculables et aucun autre contenu ne cite l'ancienne valeur.

### P1.2 — `lpl-simulator-engine`

**Objectif.** La leçon affirme que « les 9 curseurs ne sont pas décoratifs ». C'est faux pour le TVPI : `ownershipPct` n'alimente pas les retours simulés. Vérifier dans le code, puis corriger la documentation — ou le moteur.

**Fichiers possédés.** La leçon `lpl-simulator-engine`, et en lecture le moteur du simulateur `power-law` dans `client/src`.

```
Étape 1 — INVESTIGATION, en lecture seule.

La leçon `lpl-simulator-engine` affirme que « les 9 curseurs ne sont pas
décoratifs ». La revue docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md
signale que c'est faux pour le TVPI : `ownershipPct` n'alimenterait pas les
retours simulés.

Trace le comportement réel depuis la définition du paramètre jusqu'à son
consommateur, dans le code du simulateur power-law sous client/src. Une
recherche textuelle est un point de départ, pas une preuve : suis le flux
d'exécution. Pour chacun des 9 curseurs, dis s'il influence effectivement
le TVPI, un autre indicateur, ou rien.

Ne modifie rien. Rends-moi le tableau des 9 curseurs et leur effet réel.

Étape 2 — après ma validation seulement.

Deux corrections possibles, à instruire avant d'écrire :
  (a) corriger la leçon pour décrire le comportement réel
  (b) corriger le moteur pour que `ownershipPct` alimente le TVPI comme
      la leçon le promet

Si (b), c'est un changement de comportement : cas RED reproductible,
implémentation GREEN minimale, non-régression ciblée, puis passe navigateur
locale (desktop 1440×1000 et mobile 390×844).

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).
```

**Garde-fous spécifiques.** L'investigation précède strictement l'écriture. Le choix documentation/moteur est un arbitrage produit. Si le moteur change, c'est un changement de comportement : la discipline RED/GREEN et la passe navigateur s'appliquent.

**Sessions : 1** si la correction porte sur la leçon, **2** si elle porte sur le moteur.

### P1.3 — Trait d'Union (venture philanthropie)

**Objectif.** Réconcilier le déficit brut de 2,614 M€ avec le besoin incrémental de 1,65 M€, et déplacer l'horizon du modèle avant l'événement décisionnel qu'il doit éclairer.

**Fichiers possédés.** `cs-vp-insertion-3-regions`, et les leçons `lvp-comptes-cout-complet`, `lvp-tresorerie-reserves`, `lvp-previsions-scenarios`, `lvp-atelier-choc`.

```
Session sur le cas `cs-vp-insertion-3-regions` (Trait d'Union) et les leçons
financières du parcours p-venture-philanthropy-foundations.

Contexte : docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md
relève deux incohérences dans le dossier apprenant.
  1. Un déficit brut de 2,614 M€ non réconcilié avec un besoin incrémental
     de 1,65 M€. L'écart n'est ni expliqué ni traçable.
  2. L'horizon du modèle de prévision s'arrête AVANT l'événement décisionnel
     qu'il est censé éclairer, ce qui rend l'exercice `lvp-previsions-scenarios`
     et l'atelier `lvp-atelier-choc` logiquement incomplets.

Étape 1, en lecture seule : reconstruis la chaîne de chiffres du dossier —
comptes, coût complet, trésorerie, besoin de financement — et identifie
précisément où l'écart de 964 k€ apparaît. Dis si c'est une erreur de calcul,
un périmètre différent entre les deux montants (brut vs incrémental), ou une
donnée manquante. Ne corrige rien avant de me l'avoir montré.

Étape 2, après validation : corrige la cohérence financière et prolonge
l'horizon du modèle jusqu'au-delà de l'événement décisionnel. Toute
hypothèse ajoutée doit être explicitement étiquetée comme hypothèse
pédagogique et non comme donnée réelle — le dossier est fictif et doit le
rester visiblement.

Ce parcours porte des contenus juridiques et safeguarding. Tu ne produis
aucune qualification juridique nouvelle et tu ne transformes aucune
formulation prudente en affirmation. Les escalades vers un professionnel
déjà présentes dans les leçons sont conservées telles quelles.

Le classeur recalculable annoncé est HORS PÉRIMÈTRE de cette session (voir P4).

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run validate:content, npm run split:content,
npm run check:generated.
```

**Garde-fous spécifiques.** Le parcours est le mieux noté du dépôt (4/4/4) : le risque est de dégrader en corrigeant. Les données restent fictives et étiquetées comme telles. Aucune qualification juridique ou safeguarding nouvelle. Le classeur est exclu.

**Sessions : 2.** Une d'investigation et de reconstruction de la chaîne financière, une de correction. Critère de sortie : chaque montant du dossier est recalculable depuis les données publiées.

---

## P2 — Qualification juridique et réécritures à fort réemploi

### P2.1 — Passe de qualification (5 leçons)

**Objectif.** Retirer les absolus et ajouter les réserves de juridiction sur les leçons qui énoncent des pratiques contractuelles ou réglementaires variables comme des règles. Travail mécanique, sans réécriture.

**Périmètre réduit à 5 leçons, pas 8.** `l-ts-economics`, `l-ts-control` et `lf-instruments` sont exclus ici : ils sont réécrits intégralement en P2.2 et P2.3, où leur qualification est traitée. Les qualifier deux fois est du travail perdu.

**Fichiers possédés.** `lf-board` et `llp-france` (dans `data/parcours/*.lessons.json`), `lts-standard-francais`, `lf-liquidation`, `lf-dilution`.

```
Passe de QUALIFICATION sur cinq leçons. Ce n'est PAS une réécriture.

Leçons concernées :
  - `lf-board` (qualité 1/5) — absolus non sourcés sur pacte d'associés,
    majorité fondatrice et veto, sans réserve sur statuts ni droit applicable
  - `llp-france` (qualité 1/5) — affirmations institutionnelles, réglementaires,
    de tickets et de négociation énoncées comme des recettes
  - `lts-standard-francais` — pratiques SAS, liquidation, anti-dilution et
    good/bad leaver présentées comme uniformes
  - `lf-liquidation` — « clause la plus importante », « hérésie », « ruine »,
    « seul garde-fou »
  - `lf-dilution` — règle 15-25 % universalisée, injonctions juridiques

Ce que tu fais, et rien d'autre :
  1. Requalifier chaque affirmation absolue en affirmation située
     (« fréquent en France en 2026 » plutôt que « standard »), OU la retirer
     si tu ne peux pas la situer avec une source vérifiée.
  2. Ajouter, une fois par leçon, une réserve explicite : variabilité selon
     les statuts et le droit applicable, contenu ne valant pas conseil juridique.
  3. Retirer la dramatisation et les jugements de valeur contraires à la
     charte §4.0.c de docs/ARCHITECTURE_EDITION.md.

Ce que tu NE fais PAS :
  - restructurer la leçon, changer son plan, allonger le corps
  - ajouter des exercices, des quiz, des livrables
  - ajouter une source que tu n'as pas vérifiée proposition par proposition

Si une affirmation ne peut être ni sourcée ni située honnêtement, retire-la
et signale-le-moi : c'est une réécriture, elle relève d'une autre session.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run validate:content, npm run split:content,
npm run check:generated. Rends-moi la liste des affirmations retirées.
```

**Garde-fous spécifiques.** Le risque dominant est le glissement vers la réécriture — qui collisionnerait avec P2.2 sur les mêmes fichiers. Une affirmation non sourçable se retire, elle ne se « corrige » pas par une source approximative. Ne jamais inventer de source.

**Sessions : 2.** Trois leçons puis deux, ou par fichier possédé. Critère de sortie : aucune affirmation juridique non située ne subsiste dans les cinq leçons.

### P2.2 — `l-ts-control` et `l-ts-economics`

**Objectif.** Réécrire les deux leçons à plus fort réemploi du dépôt : 11 occurrences à elles deux, sur 6 et 5 parcours.

**Fichiers possédés.** `data/lessons.json`, entrées `l-ts-control` et `l-ts-economics`. **Une leçon par session.**

```
Réécriture complète de la leçon `l-ts-control` [OU `l-ts-economics`] dans
data/lessons.json.

Avant d'écrire une ligne :
  1. Lis docs/ARCHITECTURE_EDITION.md §4.0.c (charte de style) et la section
     de docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md
     consacrée à cette leçon.
  2. Cette leçon est réutilisée par SIX parcours : p-serie-a, p-mener-un-tour,
     p-passer-associate, p-passer-principal, p-term-sheet, p-entretien-associate.
     [Pour l-ts-economics : CINQ — p-entretien-associate, p-serie-a,
     p-mener-un-tour, p-passer-associate, p-term-sheet.]
     Lis l'objectif d'étape de la leçon dans CHACUN de ces parcours. La
     réécriture doit servir le niveau le plus exigeant sans devenir illisible
     pour le plus accessible. Dis-moi comment tu arbitres avant d'écrire.

Défauts à corriger, relevés par la revue :
  - aucune lecture de clause réelle, aucune mise en situation
  - « standard », « douce », « brutal et rare », « les meilleurs
    investisseurs » : généralisations non sourcées et jugements de valeur
  - aucune juridiction précisée, aucune source attachée
  - aucun exercice ni calcul

Exigences de la réécriture :
  - registre sobre et institutionnel, aucun tutoiement, aucune punchline
  - chaque pratique contractuelle est située (juridiction, période) ou retirée
  - sources vérifiées proposition par proposition — pas d'URL décorative,
    pas de source inventée, pas de date de consultation fabriquée
  - au moins un exercice ou un calcul travaillé, cohérent avec le champ
    `practice` si la collection en prévoit un
  - réserve explicite : ne vaut pas conseil juridique
  - `id`, `slug` et `courseId` INCHANGÉS

Si la réécriture change la durée de lecture, mets à jour la durée de la leçon
mais NE touche PAS aux durées déclarées des six parcours : leur réconciliation
est une tâche distincte (P3.5).

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run validate:content, npm run split:content,
npm run check:generated, puis npm run check.
```

**Garde-fous spécifiques.** Une leçon par session : le fichier est partagé, deux sessions parallèles se marchent dessus. L'arbitrage de niveau entre parcours consommateurs doit être explicité avant l'écriture, pas découvert après. `id`/`slug` intouchables. Les durées de parcours ne bougent pas ici.

**Sessions : 2** (une par leçon). Critère de sortie : `npm run check` vert, chaque affirmation contractuelle située et sourcée.

### P2.3 — Les sept autres réécritures à fort réemploi

**Objectif.** `l-fees-carry`, `l-reserves` (4 parcours chacune), `l-thesis-anatomy` (3), `l-triage` (3), `l-defending-thesis` (2), `l-founder-narrative` (4), `lf-instruments` (2). Ensemble : 22 occurrences.

**Fichiers possédés.** `data/lessons.json` et les registres `data/parcours/*.lessons.json` concernés.

```
Réécriture complète de [LEÇON] dans [FICHIER].

Structure identique à P2.2 : lis la charte §4.0.c, lis la fiche de la leçon
dans docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md, lis
l'objectif d'étape dans CHAQUE parcours qui la réutilise, arbitre le niveau
et montre-moi ton arbitrage avant d'écrire.

Défauts propres à chaque leçon, à corriger :

`l-fees-carry` (4 parcours) — « 2 & 20 », hurdle à 8 % et un ordre de
  waterfall unique présentés comme quasi universels ; jugement éditorial sur
  le GP ; aucune source ; aucun exercice. Substituer plusieurs architectures
  de waterfall aux normes présentées comme uniques.

`l-reserves` (4 parcours) — 152 mots ; fourchette 40-60 % non sourcée ;
  doctrine « gagnantes uniquement » ; « toujours coûteux » ; aucun modèle
  d'allocation, aucun exercice.

`l-thesis-anatomy` (3 parcours) — 181 mots ; « Falsifiable ou rien » ;
  jugement sur « les meilleurs investisseurs » ; aucune source, aucun
  exemple appliqué, aucune production. Le niveau attendu diffère fortement
  entre p-stage (débutant) et p-entretien-associate / p-passer-associate
  (avancé) : traite ce point explicitement.

`l-triage` (3 parcours) — traitement binaire en 169 mots ; « walking dead »,
  « accepter la mort » hors registre ; aucun critère d'arbitrage, aucune
  grille, aucun dossier de décision.

`l-defending-thesis` (2 parcours) — 151 mots ; quiz de simple restitution ;
  aucun scénario de comité, aucune objection travaillée, aucun entraînement
  oral ni retour.

`l-founder-narrative` (4 parcours) — ~174 mots ; « 10×+ », opposition
  banque/VC et « armer un allié » non sourcés et catégoriques ; aucun
  exercice de one-liner. Elle est réutilisée SANS adaptation en pré-seed,
  seed, Série A et express-lever : dis-moi si une leçon unique peut servir
  les quatre stades ou s'il faut spécialiser.

`lf-instruments` (2 parcours) — pas de véritable grille de comparaison
  SAFE / BSA-AIR / obligation convertible / priced round ; « roi »,
  « préférez toujours » ; contenu orienté pré-seed alors que p-seed en
  attend un traitement au stade seed. Traite explicitement ce décalage.

Exigences communes : registre sobre, affirmations situées et datées,
sources vérifiées proposition par proposition, au moins un exercice ou
calcul travaillé, `id`/`slug`/`courseId` inchangés, durées de parcours
non modifiées.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run validate:content, npm run split:content,
npm run check:generated, puis npm run check.
```

**Garde-fous spécifiques.** Deux leçons soulèvent une question de conception avant écriture — `l-founder-narrative` (une leçon pour quatre stades) et `lf-instruments` (pré-seed vs seed). Si la réponse est « spécialiser », c'est une création de leçon, donc un périmètre différent : la trancher avant, pas pendant.

**Sessions : 6.** `l-fees-carry` et `l-reserves` séparément (sourcing d'économie de fonds), `l-thesis-anatomy` + `l-defending-thesis` ensemble (même chaîne pédagogique), `l-triage` seule, `l-founder-narrative` seule, `lf-instruments` seule.

### P2.4 — `p-decouvrir-vc`

**Objectif.** Six des sept fiches `ld-*` sont à qualité 2/5. Le parcours d'entrée est le plus faible du dépôt en registre. La voie économique est la substitution par les modules canoniques, pas la réécriture — mais elle change le niveau, donc elle se conçoit avant de s'exécuter.

**Fichiers possédés.** `data/parcours/01-le-vc-sans-bullshit.lessons.json`, `data/parcours.json` (entrée `p-decouvrir-vc`).

```
SESSION 1 — CONCEPTION, en lecture seule.

Le parcours p-decouvrir-vc est noté avancée 3 / pertinence 4 / qualité 2.
Six de ses sept fiches `ld-*` sont à qualité 2/5 : ld-what-is-vc,
ld-money-flow, ld-stages, ld-vc-job, ld-roles, ld-fund-lifecycle.
Défauts communs : tutoiement, slogans et métaphores (vin, karaté, « vérité
qui pique », « perle »), chiffres périssables non sourcés (tickets, salaires,
50-60 h, 1 000 dossiers / 3-5 financés), quiz sans exercice. 35 minutes de
contenu réel contre 1,5 h déclarée.

Il existe dans data/lessons.json des modules canoniques équivalents notés
4 à 5 en qualité : l-vc-definition, l-power-law, l-actors, l-stages, l-roles,
l-fund-lifecycle.

Instruis trois options, sans rien modifier :
  (a) substitution — remplacer les `ld-*` par les modules canoniques
  (b) réécriture — garder le format court et le réécrire à la charte
  (c) hybride — substituer certaines fiches, réécrire les autres

Pour chaque option, chiffre : durée de lecture résultante, écart avec la
promesse « 1,5 h découverte », niveau de difficulté résultant, et prérequis
introduits ou résolus. Le point critique est que les modules canoniques sont
substantiels et de niveau supérieur : dis franchement si la substitution
détruit la fonction d'onboarding du parcours.

Ce parcours est la porte d'entrée du produit et son objectif est de donner
envie d'apprendre. Traite cette contrainte comme un critère, pas comme un
ornement.

Rends-moi une recommandation argumentée. Je tranche ensuite.

SESSIONS 2 et 3 — EXÉCUTION, après arbitrage.
Applique l'option retenue. Si substitution : vérifier les prérequis de
chaque module canonique importé, et que le quiz final annoncé devienne une
étape réellement exécutable. Si réécriture : charte §4.0.c, chiffres sourcés
ou retirés, registre institutionnel, aucun tutoiement.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).
Porte de sortie : npm run check.
```

**Garde-fous spécifiques.** La conception précède l'exécution et se valide. La substitution introduit des prérequis nouveaux (les modules canoniques en ont) : les tracer. Le « Quiz éclair » annoncé mais non exécutable doit être traité, pas oublié.

**Sessions : 1 de conception + 2 à 3 d'exécution.**

### P2.5 — Indicateur de progression (piste parallèle)

**Objectif.** La progression atteint 100 % alors que cas, simulateurs et productions restent inachevés. Seul défaut touchant les 24 parcours, et seul correctif purement applicatif.

**Fichiers possédés.** `client/src` — calcul de progression et composants de rendu associés.

```
Changement de comportement applicatif. Aucune modification de contenu JSON.

Constat : docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md
relève que l'indicateur de progression est limité aux leçons lues. Les cas,
simulateurs, pratiques et livrables peuvent rester inachevés alors que
l'indicateur affiche 100 %. Cela concerne les 24 parcours.

Étape 1, lecture seule : trace le calcul de progression depuis sa définition
jusqu'à chaque consommateur et jusqu'au rendu. Recense les types d'étapes
existants (leçon, cours, cas, simulateur, livrable, jalon) et dis lesquels
alimentent aujourd'hui l'indicateur. Vérifie aussi le contrat de persistance
`vcpx:` dans localStorage : une étape non-leçon a-t-elle un état d'achèvement
stockable, ou faut-il en créer un ?

Ne modifie rien. Montre-moi le modèle actuel et les options.

Étape 2, après validation : implémente.
  - cas RED reproductible d'abord : un parcours dont toutes les leçons sont
    lues et dont une pratique est inachevée ne doit pas afficher 100 %
  - implémentation GREEN minimale
  - non-régression ciblée
  - si le contrat `vcpx:` change, une migration versionnée est obligatoire
    et les données existantes des utilisateurs doivent survivre
  - passe navigateur locale : desktop 1440×1000 et mobile 390×844

Cette session ne touche à AUCUN fichier de data/. Elle peut donc tourner en
parallèle des sessions éditoriales.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : tests ciblés, npm run typecheck, npm run lint, puis
npm run build.
```

**Garde-fous spécifiques.** C'est la seule piste réellement parallélisable : elle ne touche aucun fichier de `data/`. Le contrat `vcpx:` est versionné — toute évolution exige une migration, jamais une rupture silencieuse. Passe navigateur obligatoire.

**Sessions : 2.** Une d'investigation, une d'implémentation.

---

## P3 — Déblocage et cohérence structurelle

### P3.1 à P3.3 — Les trois placeholders requis

**Objectif.** Produire `todo-attentes-serie-a` (cœur de `p-serie-a`, avancée 1/5), `todo-ecrire-memo` (objectif final de `p-meilleur-analyst`), `todo-mini-case-express` (seule pratique d'entretien de `p-express-entretien`).

**Dépendances.** `todo-attentes-serie-a` attend P2.2 (`l-ts-economics` et `l-ts-control` sont réutilisés par `p-serie-a`). `todo-mini-case-express` attend la décision 1 (le mode complet ajoute aujourd'hui 405 minutes à une promesse d'une heure).

```
Production d'une étape aujourd'hui `a-produire` : [ID DE L'ÉTAPE].

Avant de produire, en lecture :
  - la fiche du parcours dans
    docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md
  - l'entrée du parcours dans data/parcours.json : promesse, jalon annoncé,
    durée déclarée, place de l'étape dans la séquence
  - docs/ARCHITECTURE_EDITION.md pour la collection cible et la charte §4.0.c
  - le contrat de docs/parcours/README.md

Détermine d'abord CE QUE L'ÉTAPE DOIT ÊTRE dans l'ontologie du dépôt : une
leçon, un cas, un livrable, un simulateur ? La revue la décrit comme
[Cœur / Pratique] mais l'objet exact n'est pas tranché. Le mauvais choix
d'entité coûte plus cher que le contenu lui-même. Montre-moi ta décision
et sa justification avant de produire.

Exigences de production :
  - l'étape doit être RÉSOLUE : une route, un objet réel, un état
    d'achèvement observable. Pas une mention « bientôt ».
  - elle doit servir le jalon annoncé par le parcours. Si le jalon promet
    une grille, une révision ou un retour, ils font partie de la livraison.
  - registre sobre, sources vérifiées proposition par proposition, aucune
    source inventée
  - charge de travail explicite et cohérente avec la durée du parcours ;
    si elle ne l'est pas, signale l'écart sans réconcilier les durées ici

Spécificités :
  `todo-attentes-serie-a` — le jalon promet « négociation simulée + cap table
    multi-tours ». Il n'a aujourd'hui ni livrable, ni grille, ni révision.
    Le hook du parcours avance un ARR ≈ 2,5 M€ sans source : soit tu le
    sources, soit tu le retires.
  `todo-ecrire-memo` — livrable complet attendu : dossier d'entrée, gabarit,
    grille, première version, retour, révision, autoévaluation.
  `todo-mini-case-express` — mini-case chronométré et évalué, compatible avec
    une promesse d'une heure. Applique ici la décision prise sur
    `math-vc-dossier` : [COLLER LA DÉCISION 1].

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run check.
```

**Garde-fous spécifiques.** Le choix de l'entité (leçon, cas, livrable) est structurant et se valide avant production. Une étape « produite » mais non résolue ne clôt pas la tâche. Ne pas réconcilier les durées ici.

**Sessions : 3 pour `todo-attentes-serie-a`, 3 pour `todo-ecrire-memo`, 2 pour `todo-mini-case-express`.** Dont, à chaque fois, une session de conception validée avant production.

### P3.4 — Les 25 prérequis

**Objectif.** Rétablir la cohérence des dépendances dans 14 parcours. Travail largement mécanique.

**Fichiers possédés.** `data/parcours.json`, et les champs `prerequisites` des leçons concernées.

```
Correction des prérequis non satisfaits. Travail structurel, pas éditorial :
tu ne réécris aucun contenu de leçon.

docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md relève 25
prérequis non satisfaits dans 14 parcours, malgré plusieurs mentions
« aucun prérequis » dans les métadonnées.

Étape 1 : construis la carte réelle. Pour chaque parcours, liste ses étapes
dans l'ordre, et pour chaque leçon son champ de prérequis. Marque chaque
prérequis comme : satisfait avant la leçon, satisfait mais placé après,
ou absent du parcours. Ne te fie pas à la revue : recalcule depuis les
données. Rends-moi la carte avant toute écriture.

Les cas les plus fréquents signalés :
  - `l-pipeline-crm` requis par `lmv-market-sizing` — absent de 6 parcours
  - `l-founder-analysis` requis par `l-team-market` — absent de 4 parcours
  - `lmv-returns-waterfall` requis par `l-dd-process` mais placé APRÈS
  - `l-actors` requis par `l-stages` — absent de 2 parcours
  - `l-power-law` requis par `l-fund-lifecycle`, `l-sourcing` requis par
    `l-screening`, `l-product-analysis` requis par `l-traction-unit-economics`,
    `l-vc-week` requis par `l-roles`, `l-portfolio-monitoring` requis par
    `l-sourcing`

Étape 2 : pour chaque cas, trois corrections possibles — réordonner l'étape,
ajouter la leçon manquante au parcours, ou retirer le prérequis s'il n'est
pas réellement nécessaire dans ce contexte. Le réordonnancement est le moins
coûteux ; l'ajout d'une leçon change la durée et le niveau du parcours.
Propose ta correction par cas et attends validation pour ceux qui ajoutent
ou retirent une étape. Les simples réordonnancements, applique-les.

Corrige aussi les métadonnées « aucun prérequis » devenues fausses.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run check.
```

**Garde-fous spécifiques.** Recalculer la carte depuis les données plutôt que de faire confiance à la revue. Distinguer les trois corrections : le réordonnancement est mécanique, l'ajout ou le retrait d'étape est une décision de parcours.

**Sessions : 2.** Une de cartographie, une de correction.

### P3.5 — Réconciliation des durées

**Dépendance stricte.** Attend la décision 1 sur `math-vc-dossier` et l'achèvement de P2 (les réécritures changent les durées de lecture).

```
Réconciliation des durées déclarées avec la charge réelle.

Applique d'abord la décision rendue sur `math-vc-dossier` :
[COLLER LA DÉCISION 1].

Pour les 24 parcours de data/parcours.json, calcule la charge réelle :
lecture des leçons, contributions structurées, cas, simulateurs, exercices,
livrables. Compare aux durées déclarées par mode (essentiel / medium /
complet) et rends-moi le tableau des écarts avant correction.

Écarts déjà signalés par la revue, à confirmer par le calcul :
  p-passer-principal 34 min réelles contre 6-7 h annoncées ;
  p-penser-gp 104 min contre 6-7,5 h ; p-passer-associate 48 min contre
  6-7 h ; p-preseed 31 min contre 4-5 h ; p-decouvrir-vc 43 min contre 1,5 h ;
  p-entretien-principal ~504 min contre 480 déclarées ;
  p-express-entretien 55 min de lecture plus 405 min de contributions
  contre une promesse d'une heure.

Vérifie comment learningTime.ts dérive le temps et si les étapes non-leçons
y contribuent — la revue signale qu'un livrable non constitué en étape n'est
pas compté (learningTime.ts:59-75).

Deux corrections possibles par parcours : ajuster la durée déclarée, ou
ajuster le contenu pour tenir la promesse. La seconde est une refonte de
parcours et sort de cette session : signale ces cas, ne les traite pas.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).

Porte de sortie : npm run check.
```

**Sessions : 1**, à condition que la décision 1 soit rendue et P2 achevé. Sinon les durées bougeront à nouveau.

---

## P4 — Livrables promis

18 parcours annoncent un résultat sans livrable résolu. C'est le plus gros volume de production nette du plan et il ne se planifie pas utilement à ce stade : chaque livrable est une conception à part entière, et les décisions P0 comme les réécritures P2 en changent le contenu.

**Ordre recommandé.** D'abord les quatre parcours où le livrable *est* la promesse : `p-preseed` (one-liner + mini-deck), `p-seed` (deck + cap table post-tour + grille), `p-cap-table` (cap table produite et réconciliée), `p-unit-economics` (Rule of 40, annoncée dans le titre et jamais calculée). Ensuite les autres, puis le classeur recalculable Trait d'Union.

**Gabarit de prompt.**

```
Conception puis production du livrable de [PARCOURS].

Session 1, lecture seule. Lis la fiche du parcours dans
docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md, son entrée
dans data/parcours.json, et docs/ARCHITECTURE_EDITION.md pour la collection
cible. Réponds à :
  - que promet exactement le jalon, dans ses termes actuels ?
  - quelle entité du dépôt porte ce livrable (cas, pratique, livrable) ?
  - quelles étapes existantes doivent y contribuer, et lesquelles sont
    aujourd'hui décoratives ?
  - quel gabarit, quelle grille d'évaluation, quel cycle version/retour/révision ?
  - quelle charge de travail, et quel écart avec la durée déclarée ?
Rends-moi une spécification. Ne produis rien.

Sessions suivantes, après validation : produis le livrable, sa grille et son
raccordement aux étapes contributrices. Un livrable est résolu quand il a une
route, un état d'achèvement observable et une grille réellement consommée —
pas quand un intitulé existe.

Respecte le socle commun de garde-fous
(docs/reviews/2026-07-26-plan-execution-remediation.md).
Porte de sortie : npm run check.
```

**Sessions : 2 à 4 par livrable**, soit un ordre de grandeur de 40 à 50 sessions pour les 18 parcours. À rechiffrer après P0 et P2.

---

## P5 — Finition

À traiter en fin de programme, chaque item sur un état figé.

| Objet | Sessions | Note |
|---|---|---|
| Doublons — `lea-market-sizing`/`lmv-market-sizing`, `lea-read-startup`/`lmv-unit-economics`, `ld-roles`/`l-roles`, `l-traction-unit-economics`/`lmv-unit-economics`, `l-fund-metrics`/`lmv-returns-waterfall` | 2 | Décider fusion, spécialisation ou retrait avant d'éditer |
| Variantes courtes — 13 leçons seulement disposent d'un `bodyShort`, toutes `lea-*` | 3-4 | Volume proportionnel au nombre de leçons retenues |
| Validations praticiennes — recrutement VC France/Europe, finance-comptabilité, droit, safeguarding | — | Hors dépôt. N'a de sens qu'après P2, sinon on fait valider des textes destinés à être réécrits |
| Trajectoire de certification | — | Dépend de la décision 3. À ne pas ouvrir avant P4 |

---

## Volumétrie

| Phase | Sessions | Nature |
|---|---|---|
| P0 — décisions | 2 | Arbitrage, application mécanique |
| P1 — faits faux | 4 à 5 | Correction, une investigation de code |
| P2 — qualification et réécritures | 15 à 16 | Éditorial lourd, plus une piste applicative parallèle |
| P3 — déblocage et structure | 11 | Production nette et travail structurel |
| **Sous-total P0-P3** | **32 à 34** | **Amène le dépôt d'incohérent à cohérent** |
| P4 — livrables | 40 à 50 | Production nette, à rechiffrer après P0 et P2 |
| P5 — finition | ~8 | Sur état figé |

Les 32 à 34 premières sessions corrigent 26 leçons à qualité ≤ 2/5, 4 erreurs factuelles, 25 prérequis et 3 étapes bloquantes. Le reste est un programme de production de livrables, dont le périmètre dépend directement des arbitrages P0.

**Parallélisation.** Une seule piste est réellement parallélisable : P2.5, qui ne touche aucun fichier de `data/`. Tout le reste partage `data/lessons.json`, `data/parcours.json` ou `data/parcours/*.lessons.json` et doit rester sérialisé — un seul rédacteur par invariant partagé.

## Limites de ce plan

- Les nombres de sessions sont des ordres de grandeur dérivés du périmètre et de la nature du travail, non d'une vélocité observée.
- Le plan reprend les constats de la revue du 24 juillet 2026 sans les revérifier dans les données. Plusieurs prompts imposent d'ailleurs à la session de recalculer depuis les fichiers plutôt que de faire confiance à la revue.
- P4 et P5 sont dimensionnés à titre indicatif. Leur périmètre réel dépend des arbitrages P0.
- Ce document est un plan prospectif. Il ne modifie ni `Suivis/ETAT.md`, ni `Suivis/JOURNAL.md`, ni aucune documentation de référence maintenue.
