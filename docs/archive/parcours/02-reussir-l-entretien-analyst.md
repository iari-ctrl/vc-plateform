# Parcours 02 — Réussir l'entretien Analyst

> **Archive historique — document non exécutable.** Ce brouillon précède les modules `lea-*` aujourd'hui publiés. Il est conservé pour ses pistes éditoriales uniques, mais ne doit pas servir à déduire l'état du parcours.

> **Famille** Réussir un entretien · **Niveau** intermédiaire · **Temps** ~7 h (cœur) / ~10 h (immersion) · **Profil** le Futur analyste
> **La promesse :** finis ce parcours et tu arrives à l'entretien avec une grille d'investisseur, un deal memo modèle dans la tête, un market sizing que tu sais dérouler au tableau, une thèse perso, et zéro question qui te prend par surprise.
>
> *Objectif assumé : couvrir **chaque** étape réelle de l'entonnoir, du screening au case final. Un candidat qui valide ce parcours et fait ses devoirs sur le fonds ne doit plus rien découvrir le jour J.*
>
> Brouillon de contenu à valider. Ton : coach, direct, tutoiement, frameworks + exemples travaillés + checklists. Jargon défini via glossaire `[[…]]`.

---

## Le plan

Cinq actes + un mock final. Les actes I-II construisent le **cerveau d'investisseur** ; III-IV produisent les **livrables et les réponses** ; V prépare le **terrain** ; le mock valide le tout.

| # | Module | Acte | Type | ~min | Ce que ça débloque | Jalon / pratique |
|---|---|---|---|---|---|---|
| 1.1 | La carte de l'entonnoir | I — Comprendre le jeu | cœur | 20 | Savoir ce que teste chaque tour | — |
| 1.2 | La grille de l'investisseur | I | cœur | 40 | Team/Market/Product/Traction/Moat | Mini-évals |
| 2.1 | Dimensionner un marché (TAM/SAM/SOM) | II — Les muscles analytiques | cœur | 50 | Sizer au tableau, bottom-up | 2 exemples chiffrés |
| 2.2 | Lire une startup + unit economics | II | cœur | 50 | Métriques qui comptent par stade | Simulateurs |
| 2.3 | Les questions techniques | II | cœur | 50 | Cap table, dilution, returns, termes | Simulateurs |
| 3.1 | Le deal memo | III — Les livrables | cœur | 50 | Structure + memo modèle complet | Deal memo |
| 3.2 | Le case study | III | cœur | 60 | Attaquer, présenter, défendre | **Mock case chronométré** |
| 3.3 | « Pitch me a company » | III | cœur | 40 | Thèse + follow-ups | Pitch préparé |
| 4.1 | Le fit : why VC / why this fund / why you | IV — Convaincre | cœur | 45 | Réponses-types + ta thèse perso | Réponses écrites |
| 4.2 | Tes questions à poser | IV | bonus | 20 | Reverse questions qui impressionnent | Banque de questions |
| 5.1 | Faire ses devoirs sur le fonds | V — Le terrain | cœur | 40 | Recherche fonds + analyse auto-produite | Analyse d'une boîte du portefeuille |
| 5.2 | Les 48 h, le jour J, le suivi | V | bonus | 25 | Logistique, erreurs fatales, follow-up | Checklist |
| 6 | **Mock complet** | VI — Le jalon | pratique | 90+ | Case + memo + fit, en conditions | **Auto-éval (grille) puis pairs** |

**Atomes existants réutilisés :** `l-sourcing`, `l-screening`, `l-team-market`, `l-traction-unit-economics`, `l-dd-process`, `l-ts-economics`, le cas `cs-power-law-portfolio`, les simulateurs `pre-post-money`, `dilution`, `ownership`, `fund-returns`. **Contenu neuf à produire :** market sizing (2.1), deal memo modèle (3.1), mock case (3.2/6), pitch (3.3), fit (4.1), reverse questions (4.2), recherche fonds FR (5.1). Détail en annexe.

---

## Acte I — Comprendre le jeu

### Module 1.1 — La carte de l'entonnoir
*Tu ne peux pas gagner un jeu dont tu ignores les règles.*

Un process analyst tient en **3 à 4 tours**. Chacun teste une chose précise — sache laquelle, et tu arrêtes de jouer la mauvaise partition au mauvais moment.

| Tour | Qui | Ce qu'on teste vraiment | Ton job |
|---|---|---|---|
| **1. Screening / call RH ou junior** | Hiring manager, parfois un associate | Le **fit** : pourquoi le VC, pourquoi ce fonds, ta motivation est-elle solide ou opportuniste | Montrer une motivation informée, pas générique |
| **2. Technique / analytique** | Associate / principal | Ta **tête d'investisseur** : sais-tu juger un business model, poser les bonnes questions, raisonner sous incertitude | Penser à voix haute, structurer, hiérarchiser |
| **3. Case study** *(take-home ou live, souvent 3ᵉ tour et +)* | Associate(s) | Ta capacité à **produire** une reco défendable (deal memo / deck) | Une reco claire invest/pass + 3 risques |
| **4. Équipe / partners** | Le reste de l'équipe, parfois le partner | La **culture et la conviction** : es-tu agréable à côtoyer, sérieux sur le long terme ; négociation salaire | Être toi, poser de bonnes questions, confirmer le fit |

Trois repères qui changent tout :

- **Le case apparaît dans ~70 % des process** et arrive **tard** (3ᵉ tour +). Si tu passes les tours 1-2, prépare-le sérieusement : c'est souvent là que ça se joue.
- **Le fit gate dès le tour 1.** Un excellent analyste technique qui répond « le VC parce que c'est prestigieux » est éliminé avant même de montrer son talent.
- **Le technique pur (modélisation lourde) est rare** en VC early-stage : peu de données financières. On teste le **jugement** et la **structure de pensée**, pas Excel.

> **Erreur fatale n°1 :** arriver au case study sans avoir préparé un format (1-pager **ou** 4 slides). Tu perds 20 minutes à choisir la forme au lieu de réfléchir au fond.

**À retenir :** chaque tour a un examinateur et un critère. Fit d'abord, cerveau d'investisseur ensuite, livrable au bout, culture pour finir.

---

### Module 1.2 — La grille de l'investisseur
*La seule grille que tu réutiliseras à chaque question, chaque case, chaque pitch.*

Tout, en entretien VC, se lit avec la même grille. Mémorise-la : **Équipe · Marché · Produit · Traction · Moat** (+ Deal & Timing). Un dossier peut être tué par **une seule** faiblesse, même si tout le reste brille.

**1. L'équipe** — *le facteur n°1 au début.*
Au pré-seed/seed, on parie d'abord sur les gens. On cherche : l'**expertise du domaine** (a déjà vécu le problème → courbe d'apprentissage compressée), le **founder-market fit**, la **grit** (résilience), et surtout l'**agency** — ce sentiment que « quoi qu'il arrive, ce fondateur trouvera un moyen ». C'est le signal le plus puissant du early-stage.

**2. Le marché** — *là où meurent la plupart des dossiers.*
On cherche un marché **venture-scale** : assez grand pour produire un [[fund-returner|fund-returner]] (souvent ≥ 1 Md€ de [[tam-sam-som|TAM]], idéalement plus). Un marché petit, commoditisé ou en déclin = pass par défaut, **même avec une équipe forte**. Le « [[why-now|why now]] » compte : pourquoi ce marché bascule maintenant (techno, régulation, comportement) ?

**3. Le produit** — *10× mieux, pas 10 % mieux.*
Le standard : une solution qui apporte **dramatiquement** plus de valeur que le statu quo (perf, coût, ou les deux). « Vitamine » sympa ≠ « antidouleur » dont on ne peut plus se passer.

**4. La traction** — *la preuve que le problème est réel.*
La barre **monte à chaque stade** : pré-seed = signaux (waitlist, beta actifs, pilotes), seed = premiers revenus / rétention, Série A = [[pmf|product-market fit]] prouvé (~2,5 M€ d'[[arr|ARR]]). Regarde la **croissance ET la rétention** (une croissance avec churn élevé est un seau percé).

**5. Le moat / la défensibilité** — *« qu'est-ce qui empêche un concurrent bien financé de copier ? »*
Réponses possibles : effets de réseau, donnée propriétaire, avantage réglementaire, coûts de changement, complexité technique. Les meilleurs fondateurs nomment leur moat **en une phrase** et expliquent comment il **se renforce** avec chaque client.

**+ Deal & Timing** — valorisation raisonnable, [[cap-table|cap table]] saine (fondateurs encore motivés), montant cohérent avec le stade, et le fameux « pourquoi lever maintenant ».

> **Comment t'en servir en entretien :** face à *n'importe quelle* boîte (« pitch me a company », case, « que penses-tu de X ? »), déroule la grille à voix haute. Tu parais structuré, exhaustif, et tu ne sèches jamais.

**Mini-exercice (corrigé) — une boîte de livraison de repas bio à Lyon, pré-seed.**
- Équipe : 2 ex-Deliveroo + 1 chef → **founder-market fit fort**. ✅
- Marché : food delivery FR, grand mais **commoditisé et brûlé en capital** → drapeau orange. ⚠️
- Produit : « bio + local » → différenciation réelle ? marginale → ⚠️
- Traction : 800 commandes/sem, rétention M3 35 % → correct au stade.
- Moat : faible (réplicable) → ⚠️
- **Verdict :** *pass* — équipe solide, mais marché commoditisé + moat faible = peu de chances de fund-returner. *(Note : exactement le raisonnement attendu — tu tues sur le marché/moat, pas sur l'équipe.)*

**À retenir :** Équipe, Marché, Produit, Traction, Moat. Une faiblesse peut suffire. Le marché est le tueur n°1.

---

## Acte II — Les muscles analytiques

### Module 2.1 — Dimensionner un marché (TAM / SAM / SOM)
*La compétence la plus souvent testée en direct. Sache la dérouler au tableau, sans filet.*

**Les trois cercles.**
- **[[tam-sam-som|TAM]] (Total Addressable Market)** — toute la demande possible si tu vendais à 100 % du marché. Vue « blue sky », théorique.
- **SAM (Serviceable Addressable Market)** — la part du TAM que tu peux **réellement servir** avec ton produit, ton prix, ta géo, ton go-to-market.
- **SOM (Serviceable Obtainable Market)** — ce que tu peux **capturer en 3-5 ans**, vu ta concurrence et ta capacité d'acquisition.

**Deux méthodes — et laquelle privilégier.**
- **Top-down :** partir d'un chiffre macro (rapport de marché) et filtrer (géo, segment, prix). Rapide, mais **les investisseurs s'en méfient** : trop facile à gonfler (« 1 % d'un marché de 100 Md€ »).
- **Bottom-up :** partir de l'unité de base (1 client, 1 contrat) et multiplier. **C'est le standard early-stage. Mène toujours en bottom-up**, et utilise le top-down comme contre-vérification. Si les deux convergent à ±15 %, tes hypothèses tiennent.

**Exemple travaillé n°1 — SaaS de gestion pour restaurants, France.**
*Bottom-up :*
- Nombre de restaurants cibles en France : ~150 000 (segment indépendants + petites chaînes).
- Taux adressable réaliste (digitalisés, taille suffisante) : ~40 % → **60 000**.
- Prix moyen : ~1 200 €/an.
- **SAM = 60 000 × 1 200 € = 72 M€/an.**
- SOM à 5 ans (part réaliste ~8 %) : **~5,8 M€ d'ARR.**
*Top-down de contrôle :* marché européen du restaurant-tech ~plusieurs Md€ ; part France ~15 % ; segment SMB ~moitié → ordre de grandeur cohérent avec un SAM FR de dizaines de M€. ✅ Les deux convergent → crédible.

**Exemple travaillé n°2 — appli B2C de coaching sportif, Europe.**
*Bottom-up :* 50 M d'utilisateurs cibles (Europe, urbains, 18-45, actifs) × taux de conversion payant réaliste 3 % = 1,5 M d'abonnés × 80 €/an = **120 M€ SAM**. SOM 3 ans (~5 %) = ~6 M€.

**Les pièges qui te grillent.**
- Top-down seul (« 1 % de X »). → *fais bottom-up.*
- Confondre TAM et SAM (annoncer le TAM blue-sky comme si c'était atteignable).
- Hypothèses sorties du chapeau → **annonce-les explicitement** (« je suppose 150 000 restaurants, ~40 % adressables, 1 200 € ARPU »). L'examinateur teste ton raisonnement, pas la précision au mille près.
- Oublier le « why now » : un marché peut être grand mais pas encore prêt.

> **Au tableau :** dis tes hypothèses à voix haute, écris la formule, donne un ordre de grandeur, puis **challenge-toi** (« si l'ARPU est 2× plus bas, le SAM tombe à 36 M€ — encore venture-scale ? limite »). C'est ça, penser comme un investisseur.

**À retenir :** TAM (tout) → SAM (servable) → SOM (3-5 ans). Mène en bottom-up, contre-vérifie en top-down, annonce tes hypothèses.

---

### Module 2.2 — Lire une startup en 4 piliers + unit economics
*Du déclaratif au chiffré : ce qu'on regarde, et les métriques qui comptent par stade.*

La lecture en 4 piliers (équipe, marché, produit, traction) du module 1.2, appliquée **avec des chiffres**. Les métriques que tu dois pouvoir lire et commenter :

- **Croissance** : MoM (month-over-month) au early-stage, YoY ensuite. 15-20 %/mois est fort en seed.
- **Rétention** : la métrique reine. Rétention par cohorte ; un produit « antidouleur » a des courbes qui se stabilisent (et non qui tendent vers zéro). Pour le SaaS, regarde le [[nrr|NRR]] (>100 % = la base se densifie seule).
- **Unit economics** : [[cac|CAC]] (coût d'acquisition), [[ltv|LTV]] (valeur vie client), ratio **LTV/CAC** (>3 sain), **CAC payback** (<12-18 mois). Marge brute ([[gross-margin|gross margin]]) — un « SaaS » à 40 % de marge n'en est pas vraiment un.
- **Efficience du capital** : [[burn-rate|burn]], [[runway|runway]], et la **[[rule-of-40|Rule of 40]]** (croissance % + marge % ≥ 40) pour les boîtes plus mûres.

**La barre par stade — à connaître par cœur :**

| Stade | Ce qu'on attend | Repère 2026 |
|---|---|---|
| Pré-seed | Signaux de demande | Waitlist, pilotes, beta actifs |
| Seed | Premiers revenus + rétention | ~0,1-0,5 M€ ARR, cohortes qui tiennent |
| Série A | PMF prouvé, croissance | ~2,5 M€ ARR médian, LTV/CAC > 3 |

> **Question piège classique :** « cette boîte croît de 30 %/mois, tu fonces ? » — Mauvaise réponse : « oui, énorme ! ». Bonne réponse : « ça dépend de la **rétention** et du **CAC** : une croissance dopée par du paid non rentable avec du churn élevé, c'est un seau percé. Montre-moi les cohortes. »

**À retenir :** croissance **et** rétention, jamais l'une sans l'autre. LTV/CAC > 3, payback < 18 mois, et la barre de traction monte à chaque stade.

---

### Module 2.3 — Les questions techniques
*Pas de gros modèle, mais ces calculs-là tombent. Sache-les de tête.*

**Cap table & dilution — le calcul incontournable.**
Exemple type d'entretien : *« Une fondatrice détient 50 % avant une Série A. Elle lève 5 M€ sur une pre-money de 15 M€. Que devient sa part ? »*
- Post-money = pre-money + montant = 15 + 5 = **20 M€**.
- Part cédée à l'investisseur = 5 / 20 = **25 %**.
- La fondatrice est diluée de 25 % relatifs : 50 % × (1 − 25 %) = **37,5 %**.
- **Piège de l'[[esop|option pool]] :** s'il faut créer/étendre un pool de 10 % en pre-money (« option pool shuffle »), la dilution est portée par les **actionnaires existants** — la fondatrice tombe plus bas que 37,5 %. Sache repérer ce tour de passe-passe.

**Pre/post-money en une ligne :** part de l'investisseur = montant ÷ post-money. [[dilution|Dilution]] des anciens = montant ÷ post-money. Entraîne-toi sur les simulateurs `pre-post-money`, `ownership` et `dilution`.

**Returns — le langage des fonds.**
- **[[moic|MOIC]]** = combien de fois la mise (3× = tu rends 3 fois). Simple, mais **ignore le temps**.
- **[[irr|IRR]]** = rendement annualisé, **tient compte du temps**. 3× en 3 ans ≫ 3× en 10 ans. En VC, l'IRR est la mesure reine car les retours s'étalent sur des années.
- **[[dpi|DPI]]** (cash rendu / appelé, le réalisé), **[[tvpi|TVPI]]** (total, réalisé + latent). Un LP regarde d'abord le DPI.
- **Lien power-law :** chaque ligne doit pouvoir « rendre le fonds ». D'où les **ownership targets** (un fonds vise souvent 10-20 % pour que sa part d'un gros exit compte) et la stratégie de [[follow-on|follow-on]].

**Term sheet — niveau analyst (juste les concepts) :**
[[liquidation-preference|liquidation preference]] (1× non-participating = standard sain ; participating = l'investisseur touche deux fois), [[anti-dilution|anti-dilution]] (full ratchet vs weighted average), [[pro-rata|pro-rata]], [[esop|pool d'options]], [[vesting|vesting]]. Tu n'as pas à négocier — juste à **comprendre qui touche quoi**. *(Approfondi dans le deep-dive « Décoder une term sheet ».)*

> **Question piège :** « préfères-tu 30 % d'IRR ou un MOIC de 5× ? » — Réponse d'investisseur : « ça dépend de l'**horizon**. 5× sur 10 ans ≈ 17 % d'IRR ; 30 % d'IRR sur 4 ans ≈ 2,9×. Sans la durée, on ne peut pas comparer. »

**À retenir :** post-money = pre + montant ; part = montant/post-money ; méfie-toi de l'option pool ; IRR intègre le temps, MOIC non.

---

## Acte III — Les livrables

### Module 3.1 — Le deal memo
*Le document roi. Si tu n'en maîtrises qu'un, c'est celui-là.*

Le [[deal-memo|deal memo]] est la synthèse écrite d'une reco d'investissement. En screening, **une page suffit (400-600 mots)** ; plus tard, il s'étoffe et se chiffre. En entretien, on te demande souvent de le produire sur une boîte donnée.

**La structure attendue (dans cet ordre) :**
1. **Recommandation** — *invest / pass*, en une phrase, **en haut**. Pas de suspense.
2. **L'entreprise** — que fait-elle, pour qui, quel problème (positioning en une phrase).
3. **Le marché** — taille (TAM/SAM bottom-up), croissance, why now.
4. **L'équipe** — pourquoi **eux** (founder-market fit, track record).
5. **La traction** — chiffres clés, croissance, rétention.
6. **Le business model & l'économie** — comment ils gagnent de l'argent, unit economics.
7. **Les risques** — les **3** qui comptent, hiérarchisés, avec mitigations.
8. **Le deal** — montant, stade, valorisation, ownership visé.

**Ce que les correcteurs veulent vraiment voir** (et ce qui te démarque) :
- Une **reco claire**, assumée — pas un « ça dépend » mou.
- **Pas d'erreur grossière** (un marché 100× trop grand, une confusion pre/post-money te disqualifient).
- Les **3 risques** identifiés et **hiérarchisés** : montre que tu sais où le dossier peut casser.
- Idéalement, la preuve que tu as **parlé à 2-3 personnes** du secteur (comme en vraie [[dd|DD]]). Une citation d'expert vaut dix lignes d'analyse.

> **Exemple travaillé — deal memo modèle (fictif, ~480 mots).**
>
> **Recommandation : INVEST** (ticket seed 800 k€, ownership cible ~10 %).
>
> **Entreprise.** *Atelier* édite un logiciel de conformité environnementale (CSRD) pour les PME industrielles européennes. Il automatise la collecte de données et la production des rapports réglementaires, aujourd'hui faite à la main par des consultants.
>
> **Marché.** ~50 000 PME industrielles européennes nouvellement soumises à la CSRD. Bottom-up : 50 000 × ~40 % adressables × 8 000 €/an ≈ **160 M€ SAM**, en croissance forte (vague réglementaire 2024-2027). *Why now :* l'obligation réglementaire crée une demande non-discrétionnaire **maintenant**.
>
> **Équipe.** CEO ex-directrice RSE dans l'industrie (a vécu le problème), CTO ex-Pennylane. **Founder-market fit fort.**
>
> **Traction.** 18 clients payants en 9 mois, 22 k€ de [[mrr|MRR]], +25 %/mois, rétention logo 100 % (aucun départ). Pilotes avec 2 ETI.
>
> **Économie.** SaaS, ~80 % de marge brute, ACV 8 k€, CAC payback ~10 mois, LTV/CAC ~4. Sain.
>
> **Risques (hiérarchisés).** (1) *Dépendance réglementaire* — un report de la CSRD casserait l'urgence → mitigé par l'élargissement à d'autres normes. (2) *Cycle de vente PME long* → mitigé par le canal expert-comptable. (3) *Concurrence des grands éditeurs* (SAP, Pennylane) → fenêtre de 18 mois pour s'imposer sur le segment PME.
>
> **Deal.** Seed 800 k€, pre-money ~7 M€, ownership ~10 %. Cohérent avec le stade et la traction.
>
> *Pourquoi ça marche : reco en haut, marché chiffré en bottom-up, 3 risques hiérarchisés avec mitigations, un why-now béton. C'est le standard à viser.*

**À retenir :** reco en haut, marché en bottom-up, **3 risques hiérarchisés**, pas d'erreur grossière, et parle à des gens du secteur.

---

### Module 3.2 — Le case study
*L'épreuve reine. Voici comment l'attaquer sans paniquer.*

**Les formats.** Take-home (quelques jours, tu rends un memo ou un deck) **ou** live (1-2 h sur place). On te donne en général un [[pitch-deck|pitch deck]], un memo ou un jeu de données, et on attend une reco **invest/pass** argumentée. Tu auras souvent le choix : **1-pager OU 4 slides** — décide **à l'avance** lequel tu maîtrises.

**La méthode en 5 temps (à appliquer mécaniquement) :**
1. **Cadrer (5 min).** Reformule : quel stade, quel ticket, quelle décision ? Pose tes hypothèses.
2. **Dérouler la grille (le gros du temps).** Équipe → Marché (sizing bottom-up) → Produit → Traction → Moat → Deal. Pour chaque pilier : un constat + un risque.
3. **Trancher.** Reco claire. Si « invest », à quelles **conditions** ; si « pass », ce qui te ferait **changer d'avis**.
4. **Hiérarchiser 3 risques** + mitigations.
5. **Présenter (si live).** 5 min top-line : reco d'abord, puis les 2-3 raisons, puis les risques. Pas de suspense, pas de blabla.

**Ce qui te distingue :** parler à 2-3 personnes du secteur (même en take-home, en 24 h c'est faisable), et **anticiper les contre-questions** (« et si le marché est plus petit ? », « pourquoi pas le concurrent X ? »).

> **Erreur fatale n°2 :** ne pas trancher. Un case sans reco nette = échec, même avec une analyse brillante. On embauche des gens qui **décident**.

**Le mock (jalon).** Sujet type : *« Voici le deck d'Atelier (CSRD SaaS, seed 800 k€). Tu as 60 minutes. Rends un 1-pager : invest ou pass, et pourquoi. »* — Chronomètre-toi pour de vrai. Grille d'auto-évaluation en Acte VI.

**À retenir :** cadre → grille → tranche → 3 risques → présente reco d'abord. Décider est non-négociable.

---

### Module 3.3 — « Pitch me a company »
*La question signature. Prépare-la, ne l'improvise jamais.*

On te demande de présenter **une startup que le fonds devrait financer**. L'enjeu n'est pas la boîte : c'est de montrer que **tu penses comme un investisseur** et que tu **communiques clair**.

**Les règles de sélection :**
- Choisis un secteur **que tu connais** (tu tiendras les follow-ups).
- Choisis une boîte qui **colle au fonds** : son **stade** et sa **thèse**. Pitcher une Série C à un fonds seed = élimination directe.
- Évite les évidences déjà ultra-couvertes, sauf angle original.

**La structure (2-3 min) :**
1. **Le thesis en une phrase** (« je crois que X, donc Y devient inévitable »).
2. **Problème** + pour qui (positioning clair).
3. **Produit / UVP** — pourquoi 10× mieux.
4. **Marché** — taille bottom-up + why now.
5. **Équipe & traction** — pourquoi eux, quelles preuves.
6. **Risques** — assume-les (ça prouve la maturité), + ce qui te ferait changer d'avis.

**Prépare les follow-ups** (c'est là qu'on sépare le par-cœur du vrai investisseur) :
- « Qu'est-ce qui te ferait changer d'avis ? »
- « Pourquoi pas le concurrent X ? »
- « C'est quoi le moat dans 5 ans ? »
- « À quelle valo tu n'investirais plus ? »

> **Exemple travaillé (squelette).** *Thesis :* « L'électrification du parc auto rend la gestion de recharge des flottes critique → un logiciel vertical va capter cette dépense. » → *Boîte :* startup FR de pilotage de recharge B2B. → *Marché :* bottom-up sur le nb de flottes × budget énergie. → *Risques :* dépendance aux constructeurs, standardisation. → *Ce qui me ferait passer :* si les constructeurs intègrent ça nativement.

**À retenir :** thèse d'abord, colle au stade/thèse du fonds, assume les risques, prépare 4 follow-ups.

---

## Acte IV — Convaincre

### Module 4.1 — Le fit : why VC / why this fund / why you
*Le tour qu'on néglige et qui élimine le plus de candidats. Prépare-le par écrit.*

**« Why venture capital ? »** — la question que **tout le monde** entend. Elle sert à éliminer les opportunistes.
- ✅ *Ce qui marche :* l'enthousiasme sincère pour le **early-stage** (rencontrer des fondateurs, comprendre comment une boîte va scaler, parier sur l'avenir), le goût d'apprendre vite sur des secteurs variés, l'envie d'aider à construire. Relie-le à **ton parcours** (une expérience concrète qui t'a mis au contact des startups).
- ❌ *Ce qui te grille :* « c'est prestigieux », « j'aime la finance », « je veux investir mon argent ». Trop vague, ou la mauvaise motivation → tu fizzles, et ils le savent.

**« Why this fund ? »** — la question qui **prouve que tu as fait tes devoirs** (cf. module 5.1).
- ✅ Cite leur **thèse**, 2-3 **boîtes du portefeuille** que tu admires et pourquoi, leur **stade** et **secteur** de prédilection, un **deal récent** ou un article d'un partner. Relie à **ton edge** : « vous êtes forts sur la healthtech, mon background biologie + data colle exactement. »
- ❌ « Vous êtes un top fonds. » → générique = pas préparé = pass.

**« Why you ? » / forces & faiblesses.**
- Ton **edge** : qu'apportes-tu qu'un autre candidat n'a pas ? (un réseau, une expertise sectorielle, une expérience opérateur, une capacité d'analyse prouvée). Idéalement, **montre** plutôt que dis : une analyse de startup que tu as écrite (cf. 5.1).
- Faiblesse : une vraie, avec ce que tu fais pour la corriger. Pas de « je suis trop perfectionniste ».

**Le comportemental — framework STAR(L).** Situation, Tâche, **Action** (ce que **tu** as fait), **Résultat** (chiffré), **Learning** (ce que tu en tires). Prépare 4-5 histoires réutilisables (un conflit, un échec, une initiative, une analyse, un leadership).

**Ta thèse d'investissement perso.** Attends-toi à : « quel secteur t'enthousiasme et où investirais-tu ? » Aie **une thèse à toi**, falsifiable, en 3 phrases (un secteur + un why-now + un type de boîte). C'est le plus fort signal de « cette personne pense déjà comme nous ».

> **Réponse modèle « why VC » (squelette) :** « En stage chez [startup], j'ai vu de l'intérieur comment [problème de scaling]. J'ai adoré être au point de bascule où une idée devient une entreprise — et frustré de ne voir qu'**une** boîte à la fois. Le VC me met du bon côté : rencontrer des dizaines de fondateurs, parier tôt, aider à construire, sur le temps long. »

**À retenir :** sincérité + spécificité. Why VC (early-stage, pas prestige), Why this fund (thèse + portfolio nommé), Why you (ton edge, montré). Aie ta thèse perso.

---

### Module 4.2 — Tes questions à poser
*Tes questions parlent autant que tes réponses. Elles montrent comment tu penses.* — bonus

Pose des questions **taillées pour ce fonds**, qui révèlent un cerveau d'investisseur — jamais génériques, jamais agressives.

**De bonnes questions (exemples) :**
- « Comment prenez-vous vos décisions d'investissement — consensus, conviction d'un seul partner, droit de veto ? »
- « Sur quelle thèse avez-vous le plus changé d'avis ces deux dernières années ? »
- « Qu'est-ce qui fait qu'un analyst réussit vraiment chez vous à 12 mois ? »
- « Quel deal avez-vous raté et qui vous a le plus appris ? »
- « Sur [secteur de leur portefeuille], quelle est la thèse contrariante que vous portez ? »

**À éviter :**
- Générique (« c'est quoi vos valeurs ? ») → signale zéro préparation.
- Interrogatoire agressif au mauvais moment. Les questions dures (turnover, pourquoi le poste est vacant, « quel risque vous prenez en m'embauchant ? ») se gardent pour **quand ils te veulent déjà**, pas au premier tour.

> **Astuce :** prépare 3 questions par interlocuteur, et **adapte** en direct à ce qu'il a dit. Une question qui rebondit sur la conversation > une question récitée.

**À retenir :** spécifique, réfléchi, non-agressif. Tes questions sont un test de plus — réussis-le.

---

## Acte V — Le terrain

### Module 5.1 — Faire ses devoirs sur le fonds
*Le différenciateur n°1 au recrutement français : montrer que tu penses déjà comme un investisseur.*

**Recherche le fonds à fond** (avant chaque tour) :
- **Thèse & stade :** que financent-ils, à quel stade, quels secteurs, quel ticket ? (site, [[pitchbook|PitchBook]]/Dealroom, leurs articles).
- **Portfolio :** 5-6 boîtes, dont 2-3 que tu peux commenter intelligemment (pourquoi c'était un bon pari, où en sont-elles).
- **Deals récents :** leurs 3 derniers investissements annoncés → de quoi parler d'actualité.
- **Les gens :** qui mène les deals, qui écrit, qui tweete quoi. Lis leurs prises de position.

**Le geste qui fait la différence (validé côté France) :** arrive avec une **analyse de startup auto-produite** — une boîte de leur portefeuille décortiquée, **ou** une opportunité sectorielle qu'ils pourraient financer. C'est *le* différenciateur au recrutement : ça prouve que tu sais déjà faire le job. Une analyse d'une page vaut mille lignes de CV.

**Cartographier l'écosystème FR (méthode, pas liste figée).** Sache situer les fonds par **stade** et **thèse** — pré-seed/seed (ex. : Kima, Frst, Breega, Elaia, Galion…), seed/Série A (ex. : Partech, Alven, Daphni, Serena, Singular…), growth (ex. : Eurazeo, Cathay, Partech Growth…), avec la toile de fond du capital public ([[bpifrance|Bpifrance]], [[eif|EIF]]). *Caveat : les stratégies bougent — vérifie toujours la thèse et le stade actuels sur le site du fonds avant l'entretien.*

> **Erreur fatale n°3 :** ne pas connaître 2-3 boîtes du portefeuille. C'est éliminatoire — ça dit « je n'ai pas pris 30 minutes pour vous ».

**À retenir :** thèse + portfolio + deals récents + les gens. Et surtout : arrive avec une analyse que **tu** as écrite.

---

### Module 5.2 — Les 48 h, le jour J, le suivi
*La logistique qui évite les autogoals.* — bonus

**48 h avant :** relis tes notes sur le fonds, ta thèse perso, ton « pitch me a company », tes 4-5 histoires STAR, et refais **un** mock case chronométré. Prépare ton format de case (1-pager **ou** slides).

**Le jour J :**
- **Pense à voix haute** sur les cas — on évalue ton raisonnement, pas juste ta réponse.
- **Structure** tout (« trois points : un, deux, trois »). La clarté > l'exhaustivité.
- **Tranche.** Une reco nette, toujours.
- **Contrôle le rambling :** réponds en 60-90 s, puis « tu veux que je creuse ? ». Le rambling est un tueur silencieux.
- **Assume ce que tu ne sais pas :** « je ne connais pas ce chiffre, mais voilà comment je l'estimerais. » Bien mieux que bluffer.

**Le suivi :** un email de remerciement court dans les 24 h, qui **ajoute** quelque chose (un point que tu as creusé après coup, un article pertinent). Ça referme bien.

**Le mémo des erreurs fatales (récap) :** réponses génériques · pas de reco dans le case · top-down-only sur le sizing · erreur grossière (pre/post-money) · ne pas connaître le portfolio · rambling · bluffer un chiffre.

**À retenir :** prépare la logistique, pense à voix haute, tranche, contrôle le temps de parole, relance en 24 h.

---

## Acte VI — Le mock complet (jalon)
*La répétition générale. Si tu coches tout en vert, tu es prêt.*

Fais-le **en conditions réelles**, chronométré, à voix haute (enregistre-toi). Trois manches, comme un vrai process.

**Manche 1 — Fit (15 min, à voix haute).** Réponds, sans notes, à : *Why VC ? · Why ce fonds [choisis-en un vrai] ? · Why you ? · Ta thèse d'investissement perso (3 phrases). · Une histoire STAR d'échec.*

**Manche 2 — Case study (60 min, livrable).** *Brief : « Atelier, SaaS de conformité CSRD pour PME industrielles, lève une seed de 800 k€. Voici le pitch (résumé du module 3.1). Rends un 1-pager : invest ou pass, pourquoi, et tes 3 risques. »* Chronomètre. Format imposé : 1 page.

**Manche 3 — Pitch & technique (15 min, à voix haute).** *Pitch-me-a-company* (ta boîte préparée) + 2 questions techniques : (a) *« fondateur 50 %, lève 4 M€ sur 12 M€ pre-money — sa part ? »* (réponse : post 16, cédé 25 %, fondateur 37,5 %), (b) *« 4× en 5 ans, c'est quel IRR en gros ? »* (≈ 32 %).

### Grille d'auto-évaluation — *« prêt » = tout en vert*

| Critère | 🟢 Prêt | 🔴 À retravailler |
|---|---|---|
| **Grille d'analyse** | Tu déroules Équipe/Marché/Produit/Traction/Moat sans y penser | Tu oublies un pilier, tu pars dans le désordre |
| **Market sizing** | Bottom-up, hypothèses annoncées, contre-vérif top-down | Top-down seul, chiffre sorti du chapeau |
| **Recommandation** | Invest/pass net, conditions ou « ce qui me ferait changer d'avis » | « Ça dépend » mou, pas de décision |
| **Risques** | 3 risques hiérarchisés + mitigations | Liste fourre-tout, aucun classement |
| **Technique** | Cap table & returns justes, option pool repéré | Erreur pre/post-money, confusion IRR/MOIC |
| **Fit** | Why VC/fund/you spécifiques, thèse perso falsifiable | Réponses génériques, pas de thèse |
| **Communication** | Structuré, tranché, < 90 s/réponse, pas de rambling | Décousu, trop long, pas de top-line |

**Puis : la revue par les pairs.** Refais la Manche 2 devant quelqu'un (idéalement déjà dans le métier) et demande-lui d'utiliser cette grille. C'est la dernière marche : ce que tu crois clair ne l'est qu'une fois validé par un tiers.

> **Le seuil « 100 % » :** tu n'es pas prêt parce que tu as *lu* le parcours — tu es prêt quand tu coches **tout en vert en conditions chronométrées, deux fois de suite, dont une devant un pair.** C'est ça, le jalon.

---

## Annexe (pour la conversion en données)

**Atomes existants réutilisés :** `l-sourcing`, `l-screening` (contexte sourcing/screening, module 1.1-1.2), `l-team-market`, `l-traction-unit-economics` (module 2.2), `l-dd-process` (modules 3.1-3.2), `l-ts-economics` (module 2.3), cas `cs-power-law-portfolio` (module 2.3, returns/power-law), simulateurs `pre-post-money`, `ownership`, `dilution`, `fund-returns` (modules 2.3 / 6).

**Contenu neuf à produire (atomes `a-produire`) :**
- `todo-market-sizing` — Dimensionner un marché (2.1) — *réutilisable par le deep-dive « Dimensionner un marché »*.
- `todo-deal-memo-gabarit` — Deal memo + exemple modèle (3.1).
- `todo-mock-case-analyst` — Case study : méthode + sujet + grille (3.2 & 6).
- `todo-pitch-me-company` — « Pitch me a company » (3.3).
- `todo-fit-analyst` — Fit : why VC/fund/you + thèse perso (4.1).
- `todo-reverse-questions` — Questions à poser (4.2).
- `todo-recherche-fonds-fr` — Faire ses devoirs + cartographie FR (5.1).
- `todo-jour-j-checklist` — 48 h / jour J / suivi (5.2).

**Sync `parcours.json` (à reconstruire si tu valides) :** la fiche actuelle de `p-entretien-analyst` (11 étapes) est plus pauvre que ce plan (13 modules). Étapes proposées — 1 `coeur` `todo-process-map` *(à produire, 1.1)* · 2 `coeur` `l-team-market` *(grille, 1.2)* · 3 `coeur` `todo-market-sizing` · 4 `coeur` `l-traction-unit-economics` *(2.2)* · 5 `coeur` `todo-tech-questions` (ou `pre-post-money` + `dilution` + `ownership` en `pratique`, `cs-power-law-portfolio` en `respiration`) · 6 `coeur` `todo-deal-memo-gabarit` · 7 `pratique` `todo-mock-case-analyst` · 8 `coeur` `todo-pitch-me-company` · 9 `coeur` `todo-fit-analyst` · 10 `bonus` `todo-reverse-questions` · 11 `coeur` `todo-recherche-fonds-fr` · 12 `bonus` `todo-jour-j-checklist`. Jalon (milestone) = deal memo + mock, `evaluation: ["auto","peer"]`, `rubricId: "rubric-mock-analyst"`.

**Termes glossaire touchés :** tam-sam-som, why-now, pmf, arr, mrr, nrr, cac, ltv, gross-margin, burn-rate, runway, rule-of-40, fund-returner, cap-table, dilution, pre-money, esop, moic, irr, dpi, tvpi, follow-on, liquidation-preference, anti-dilution, pro-rata, vesting, deal-memo, pitch-deck, dd, pitchbook, bpifrance, eif. *(« STAR » est un framework d'entretien générique, pas un terme glossaire — laissé en texte.)*

**Jalon :** mock complet (3 manches) — `evaluation: ["auto","peer"]`, grille `rubric-mock-analyst`.

---

*Sources (recherche) : process & questions — Mergers & Inquisitions, GoingVC, Leland ; case & deal memo — M&I, VC Lab, Visible.vc ; market sizing — Data-Mania, Waveup ; technique — M&I, beehiiv (cap table) ; évaluation startup — Forum VC, Substack « 6 T's » ; reverse questions — Reforge. Repères chiffrés 2025-2026 (Carta, Dealroom).*
