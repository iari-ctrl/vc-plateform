const e={"le-capital-risque-vraiment":{body:`## Une classe d'actifs à part

Le capital-risque — *venture capital* — n'est pas du financement comme un autre. C'est l'apport de fonds propres à de jeunes entreprises non cotées, à fort potentiel et à fort risque, en échange d'une participation au capital. L'investisseur ne prête pas : il devient copropriétaire, et son sort est lié à celui de l'entreprise.

Trois caractéristiques le définissent et conditionnent tout le reste :

- **Long** : un fonds vit en moyenne dix ans. On n'investit pas pour le trimestre prochain mais pour la décennie.
- **Illiquide** : une fois investi, le capital est immobilisé. Il n'existe pas de marché quotidien pour revendre ses parts d'une startup.
- **Asymétrique** : la grande majorité des investissements échouent ou stagnent. Quelques-uns remboursent tout le reste, et davantage.

## Un métier, pas seulement de l'argent

Dire « j'ai de l'argent à placer » ne fait pas de vous un VC. Le métier consiste à **trouver** des entreprises avant les autres, à **juger** sous incertitude radicale — souvent sans chiffres fiables — à **convaincre** les meilleurs fondateurs de vous accepter à leur table, puis à **accompagner** sur le temps long.

Le capital-risque finance ce que la dette ne peut pas financer : des entreprises sans actifs tangibles, sans historique, dont la valeur repose sur une promesse. C'est précisément pour cela qu'il prend des parts plutôt que des intérêts.

## Pourquoi l'Europe, pourquoi maintenant

Né aux États-Unis après la Seconde Guerre mondiale avec [[georges-doriot|Georges Doriot]] et l'ARD, le capital-risque a mis quarante ans à trouver son équilibre en Europe. En 2026, l'écosystème européen est dense mais fragmenté : chaque marché — Paris, Londres, Berlin, Stockholm, Amsterdam — danse à son propre rythme réglementaire et culturel. Comprendre le VC, c'est d'abord comprendre cette géographie.`,keyTakeaways:["Le VC échange du capital contre des parts, pas contre des intérêts.","Trois traits le définissent : long, illiquide, asymétrique.","C'est un métier de jugement et de relation, pas seulement d'argent."],quiz:[{question:"Qu'est-ce qui distingue fondamentalement le VC d'un prêt bancaire ?",options:[{text:"Le VC prend une participation au capital plutôt que de prêter avec intérêts",correct:!0},{text:"Le VC exige toujours des garanties personnelles",correct:!1},{text:"Le VC finance uniquement des entreprises rentables",correct:!1}],explanation:"Le capital-risque apporte des fonds propres (equity) : l'investisseur devient copropriétaire et partage le risque, contrairement à un créancier."}],furtherReading:[{label:"Loi de puissance et concentration des retours",kind:"lesson",ref:"l-power-law"}]},"la-loi-de-puissance":{body:`## 10 % qui font 90 %

Dans un portefeuille de capital-risque, les retours ne se distribuent pas normalement. Ils suivent une **loi de puissance** (*power law*) : une fraction minuscule des investissements produit la quasi-totalité de la valeur. Il n'est pas rare qu'un seul deal rapporte plus que tous les autres réunis.

Cette réalité a une conséquence contre-intuitive : **le risque n'est pas de perdre, c'est de rater**. Perdre la totalité d'un investissement coûte 1×. Rater l'entreprise qui aurait fait 100× coûte, en réalité, infiniment plus.

## Conséquences pour le métier

- **On ne cherche pas à éviter l'échec, on cherche l'exceptionnel.** Un VC qui n'a aucune perte n'a probablement pas pris assez de risque.
- **Chaque investissement doit pouvoir « rendre le fonds ».** On se demande non pas « combien puis-je perdre ? » mais « si tout se passe bien, est-ce que cela peut faire 10× ou plus ? ».
- **La construction de portefeuille découle de cette loi.** On diversifie assez pour attraper l'aberration, mais on concentre ses réserves sur les gagnantes.

## Le piège du raisonnement linéaire

La plupart des erreurs d'investissement viennent d'un raisonnement linéaire appliqué à un monde exponentiel. Un dossier « raisonnable », qui promet un rendement modeste et sûr, est souvent **disqualifiant** en VC : il occupe une ligne de portefeuille sans pouvoir produire l'aberration qui justifie la classe d'actifs.`,keyTakeaways:["Les retours suivent une loi de puissance, pas une distribution normale.","Le vrai risque est de manquer l'exceptionnel, pas de perdre.","Chaque deal doit pouvoir, seul, rendre le fonds."],quiz:[{question:"Selon la loi de puissance, quel est le principal risque d'un VC ?",options:[{text:"Manquer l'investissement exceptionnel (10×–100×)",correct:!0},{text:"Avoir trop de pertes dans le portefeuille",correct:!1},{text:"Investir dans des entreprises déjà rentables",correct:!1}],explanation:"Puisque quelques deals font l'essentiel des retours, manquer ces aberrations coûte bien plus cher que perdre des investissements modestes."}],furtherReading:[{label:"Pourquoi la moyenne ment en VC",kind:"lesson",ref:"lpl-average-lies"},{label:"Power law & construction de portefeuille",kind:"simulator",ref:"power-law"}]},"le-cycle-de-vie-d-un-fonds":{body:`## Une entité fermée de dix ans

Un fonds de capital-risque est généralement structuré comme une entité fermée d'une durée de **dix ans**, souvent prolongeable d'un ou deux ans. Les investisseurs (les [[lp|Limited Partners]]) s'engagent dès le départ ; le gérant (le [[gp|General Partner]]) appelle ce capital progressivement.

## Les trois phases

1. **Période d'investissement (années 1–4/5)** : le fonds déploie sa *dry powder* dans de nouvelles entreprises. C'est la phase où l'on prend des positions.
2. **Période d'accompagnement (années 5–7)** : on cesse les nouveaux deals et l'on réserve du capital pour soutenir les meilleures lignes via des [[follow-on|follow-on]].
3. **Période de liquidation (années 8–10+)** : on organise les sorties — revente industrielle, [[secondary|secondary]] ou [[ipo|IPO]] — pour rendre le capital et les plus-values aux LPs.

## Pourquoi cela change tout

Cette temporalité impose une discipline de fer. Un GP ne peut pas se permettre d'investir tard dans une entreprise dont la sortie n'arrivera qu'après la fin du fonds. Le calendrier du fonds détermine **quand** on peut investir, **combien** on garde en réserve, et **avec quelle urgence** on pousse vers la liquidité. Le temps long du VC n'est pas un luxe : c'est une contrainte structurelle.`,keyTakeaways:["Un fonds vit ~10 ans, divisé en investir / accompagner / sortir.","Le capital est appelé progressivement, pas versé d'un coup.","Le calendrier du fonds contraint chaque décision d'investissement."],quiz:[{question:"Quelle est la durée de vie typique d'un fonds de capital-risque ?",options:[{text:"Environ dix ans, parfois prolongeable d'un ou deux ans",correct:!0},{text:"Trois ans, le temps de déployer le capital",correct:!1},{text:"Une durée indéterminée, tant que le fonds reste actif",correct:!1}],explanation:"Un fonds est une entité fermée d'environ dix ans, structurée en trois phases : investir, accompagner, sortir."},{question:"Pourquoi un GP évite-t-il d'investir tard dans une société dont la sortie n'arriverait qu'après la fin du fonds ?",options:[{text:"Parce qu'il doit rendre le capital et les plus-values aux LPs avant la liquidation",correct:!0},{text:"Parce que les sociétés financées tardivement sont toujours moins rentables",correct:!1},{text:"Parce que la dry powder est épuisée dès la première année",correct:!1}],explanation:"Le calendrier du fonds détermine quand on peut investir et avec quelle urgence on pousse vers la liquidité."}],furtherReading:[]},"qui-finance-qui":{body:`## La chaîne du capital

Dans le capital-risque, l'argent effectue un voyage en plusieurs étapes. À la source, les **Limited Partners** ([[lp|LPs]]) : fonds de pension, assureurs, family offices, fondations, et institutions publiques comme le Fonds Européen d'Investissement (EIF) ou Bpifrance. Ils confient leur capital sans gérer eux-mêmes les investissements.

Ce capital est remis à des **General Partners** ([[gp|GPs]]) qui gèrent un fonds. Les GPs prennent les décisions, sélectionnent les startups, négocient et accompagnent. Entre les deux, on trouve parfois des **fonds de fonds**, qui investissent dans plusieurs fonds pour diversifier.

## Les autres financeurs des startups

- **Business angels** : des particuliers fortunés qui investissent leur propre argent, souvent au tout début.
- **Family offices** : structures gérant le patrimoine de familles fortunées.
- **Accélérateurs et incubateurs** : petits chèques contre accompagnement intensif.
- **Venture debt** : de la dette spécialisée pour startups déjà financées en equity.

## L'alignement d'incitations

Le cœur de l'écosystème, c'est la relation LP / GP. Le GP touche des [[management-fees|management fees]] pour fonctionner, mais l'essentiel de son gain vient du [[carry|carried interest]] : une part des plus-values, qui n'arrive que si le fonds performe. C'est ce mécanisme qui aligne — imparfaitement — les intérêts du gérant et de ses investisseurs.`,keyTakeaways:["Les LPs fournissent le capital ; les GPs l'investissent et décident.","Business angels, family offices et fonds de fonds peuplent la chaîne.","Fees + carry alignent (imparfaitement) GP et LPs."],quiz:[{question:"Qui prend les décisions d'investissement dans un fonds ?",options:[{text:"Le General Partner (GP)",correct:!0},{text:"Le Limited Partner (LP)",correct:!1},{text:"Le fonds de fonds",correct:!1}],explanation:"Les LPs apportent le capital mais délèguent toute la gestion ; ce sont les GPs qui sélectionnent, décident et accompagnent."}],furtherReading:[]},"la-grammaire-des-stades":{body:`## Des étapes de risque, pas des montants

Les tours de financement portent des noms qu'on croit connaître. En réalité, ils décrivent moins des montants que des **stades de validation du risque**.

- **Pre-seed** : on valide le risque fondateur et le concept. Financé par des [[business-angel|angels]] ou micro-fonds, souvent via un [[safe|SAFE]] ou un BSA-AIR.
- **Seed** : on amorce le produit et les premiers signaux commerciaux (le MVP, les premiers clients).
- **Series A** : on démontre le [[pmf|product-market fit]] et l'on commence à passer à l'échelle.
- **Series B / C** : on finance l'expansion, l'internationalisation, la domination de marché.

## Ce qui se déplace à chaque tour

À chaque tour, trois choses bougent : la **valorisation** monte (en principe), le **risque** spécifique diminue, et la [[cap-table|cap table]] se rééquilibre. Les premiers investisseurs subissent une [[dilution|dilution]], mais sur une valeur qui — si tout va bien — croît plus vite que leur part ne diminue.

## Où commence vraiment une Series A en 2026 ?

Les seuils dérivent avec le temps et le marché. Ce qu'on appelait un seed il y a dix ans ressemble à un pre-seed aujourd'hui. La leçon : ne jamais raisonner sur le nom du tour, mais sur **ce qui a été prouvé** et **ce qui reste à prouver**.`,keyTakeaways:["Les tours décrivent des stades de risque, pas des montants fixes.","À chaque tour : valorisation ↑, risque spécifique ↓, cap table rééquilibrée.","Raisonner sur ce qui est prouvé, pas sur le nom du tour."],quiz:[{question:"Que décrivent d'abord les noms des tours (pre-seed, seed, Series A) ?",options:[{text:"Des stades de validation du risque, plus que des montants fixes",correct:!0},{text:"Des montants standardisés identiques d'une entreprise à l'autre",correct:!1},{text:"Le secteur d'activité de l'entreprise financée",correct:!1}],explanation:"Chaque tour correspond à un risque qu'on a validé : concept, premiers signaux, product-market fit, passage à l'échelle."},{question:"À chaque tour réussi, qu'arrive-t-il typiquement à la cap table des premiers investisseurs ?",options:[{text:"Ils sont dilués, mais sur une valeur qui croît en principe plus vite que leur part ne diminue",correct:!0},{text:"Leur pourcentage reste figé grâce à un mécanisme automatique",correct:!1},{text:"Ils sortent obligatoirement du capital à chaque nouveau tour",correct:!1}],explanation:"La valorisation monte, le risque spécifique baisse et la cap table se rééquilibre : la dilution porte sur une base de valeur plus élevée."}],furtherReading:[]},"une-semaine-de-vc":{body:`## Le rythme réel

Le mythe : un VC déjeune, écoute des pitchs et signe des chèques. La réalité est plus artisanale. Une semaine type alterne entre quatre activités.

- **Sourcing** : entretenir un réseau, suivre des secteurs, repérer des entreprises avant qu'elles ne soient « chaudes ».
- **Évaluation** : calls fondateurs, lectures de [[pitch-deck|decks]], appels de référence, modélisation de [[cap-table|cap tables]].
- **Écriture** : rédiger des [[deal-memo|deal memos]] pour le comité, clarifier sa propre pensée.
- **Accompagnement** : aider les sociétés du portefeuille — recrutement, intros, prochaines levées.

## Le comité d'investissement

Une fois par semaine ou par quinzaine, l'équipe se réunit en [[ic|comité d'investissement]]. C'est là que les convictions sont mises à l'épreuve. Un junior présente un mémo ; les seniors attaquent la thèse. La décision finale repose rarement sur les chiffres seuls — elle repose sur la qualité de l'argumentation et la conviction.

## La part invisible

L'essentiel du travail d'un VC ne produit rien de visible : on lit, on rencontre, on dit non des dizaines de fois pour chaque oui. La patience et la discipline de jugement comptent plus que la rapidité. C'est un métier où l'on est jugé sur dix ans, pas sur dix jours.`,keyTakeaways:["Quatre activités : sourcing, évaluation, écriture, accompagnement.","Le comité d'investissement teste les convictions, pas que les chiffres.","On dit non bien plus souvent qu'on dit oui."],quiz:[{question:"Quelles activités structurent une semaine type de VC ?",options:[{text:"Sourcing, évaluation, écriture et accompagnement",correct:!0},{text:"Uniquement des pitchs et la signature de chèques",correct:!1},{text:"Surtout de la gestion administrative et du reporting LP",correct:!1}],explanation:"L'essentiel du travail est invisible : on lit, on rencontre, on écrit des mémos et on dit non bien plus souvent qu'oui."},{question:"Sur quoi repose le plus souvent la décision en comité d'investissement ?",options:[{text:"La qualité de l'argumentation et la conviction, pas les seuls chiffres",correct:!0},{text:"Le calcul automatique d'un score de rendement attendu",correct:!1},{text:"L'ancienneté de la personne qui présente le dossier",correct:!1}],explanation:"Le comité met les convictions à l'épreuve : un junior présente le mémo, les seniors attaquent la thèse."}],furtherReading:[]},"les-roles-dans-un-fonds":{body:`## Une échelle de responsabilité et de signature

Les titres varient d'un fonds à l'autre, mais la logique reste : à mesure qu'on monte, on passe de l'**exécution** à la **décision**, et l'on acquiert progressivement le droit de signer.

- **Analyst** : sourcing, screening, recherche de marché, modélisation. Produit la matière première.
- **Associate** : mène des due diligences, rédige des mémos, suit des participations. Pivot opérationnel.
- **Principal** : peut « leader » un deal, siège à des boards, porte des convictions devant le comité.
- **Partner / GP** : décide, engage la responsabilité du fonds, lève auprès des LPs, détient le [[carry|carry]].

## La vraie ligne de fracture

La frontière la plus importante n'est pas entre analyst et associate, mais entre **ceux qui exécutent** et **ceux qui décident**. Devenir principal, c'est cesser de seulement préparer la décision pour commencer à l'assumer — y compris en cas d'échec.

## Ce qui distingue un futur partner

Un bon junior produit des analyses propres. Un futur partner développe **un jugement propriétaire** : il voit ce que les autres ne voient pas, défend des convictions impopulaires, et construit un réseau qui lui appartient. La compétence technique ouvre la porte ; le jugement et la relation décident de la trajectoire.`,keyTakeaways:["On passe de l'exécution (analyst) à la décision (partner).","La vraie fracture : préparer la décision vs l'assumer.","Le jugement propriétaire distingue un futur partner."],quiz:[{question:"Quelle est la ligne de fracture la plus importante entre les rôles d'un fonds ?",options:[{text:"Entre ceux qui exécutent et ceux qui assument la décision",correct:!0},{text:"Entre analyst et associate",correct:!1},{text:"Entre les équipes d'investissement et les équipes support",correct:!1}],explanation:"Devenir principal, c'est cesser de préparer la décision pour commencer à l'assumer, y compris en cas d'échec."},{question:"Qu'est-ce qui distingue surtout un futur partner d'un bon junior ?",options:[{text:"Un jugement propriétaire et un réseau qui lui appartiennent",correct:!0},{text:"Une plus grande vitesse d'exécution sur les modèles",correct:!1},{text:"La maîtrise exhaustive des outils de sourcing",correct:!1}],explanation:"La compétence technique ouvre la porte ; le jugement et la relation décident de la trajectoire."}],furtherReading:[]},"l-art-du-sourcing":{body:`## Le sourcing, première compétence

Un fonds ne peut financer que ce qu'il voit. Le **deal flow** — le flux de dossiers — est donc la matière première du métier. On distingue :

- **Inbound** : les dossiers qui viennent à vous (réputation, marque, réseau).
- **Outbound** : les entreprises que vous allez chercher proactivement, avant qu'elles ne lèvent.
- **Réseau** : warm intros par d'autres fondateurs, investisseurs, operators.

## Quantité contre qualité

Voir beaucoup de dossiers ne sert à rien si ce sont les mauvais. Les meilleurs fonds ne maximisent pas le volume : ils maximisent l'accès aux **meilleurs** dossiers. Or les meilleurs fondateurs ont le choix de leurs investisseurs. D'où une vérité dérangeante : **le sourcing et la réputation sont la même chose**.

## Construire un avantage de sourcing

Un avantage durable vient rarement d'un outil. Il vient d'une **thèse claire** qui attire les bons fondateurs, d'un **réseau** qu'on cultive sur des années, et d'une **réputation** d'investisseur utile et droit. Le scoring automatisé et les bases de données aident à ne rien manquer ; ils ne remplacent pas la raison pour laquelle un fondateur vous choisit.`,keyTakeaways:["Le deal flow est la matière première du métier.","Maximiser l'accès aux meilleurs dossiers, pas le volume.","Sourcing et réputation sont indissociables."],quiz:[{question:"Pourquoi dit-on que le sourcing et la réputation sont indissociables ?",options:[{text:"Les meilleurs fondateurs choisissent leurs investisseurs, donc l'accès aux bons dossiers dépend de la réputation",correct:!0},{text:"Parce qu'un bon outil de scoring suffit à attirer les meilleurs deals",correct:!1},{text:"Parce que la réputation dispense de tout travail de sourcing",correct:!1}],explanation:"Un avantage de sourcing durable vient d'une thèse claire, d'un réseau cultivé dans le temps et d'une réputation d'investisseur utile."},{question:"Que cherchent à maximiser les meilleurs fonds en matière de deal flow ?",options:[{text:"L'accès aux meilleurs dossiers, pas le volume vu",correct:!0},{text:"Le nombre total de dossiers reçus chaque mois",correct:!1},{text:"La rapidité de réponse à tous les dossiers entrants",correct:!1}],explanation:"Voir beaucoup de dossiers ne sert à rien si ce sont les mauvais ; l'enjeu est l'accès aux entreprises exceptionnelles."}],furtherReading:[]},"screening-et-filtrage":{body:`## Filtrer sans s'aveugler

Un fonds reçoit bien plus de dossiers qu'il ne peut en étudier. Le **screening** consiste à passer rapidement de centaines de dossiers à une poignée méritant un vrai temps. Le danger : un filtre trop rigide rejette précisément les aberrations qui font la loi de puissance.

## Les questions de premier filtre

- L'entreprise **correspond-elle à la thèse** et au stade du fonds ?
- Le marché peut-il être **assez grand** pour produire un fund-returner ?
- L'équipe a-t-elle une raison crédible d'être **celle qui gagne** ?
- Y a-t-il un **« pourquoi maintenant »** convaincant ?

## L'équilibre clé

Le screening efficace est asymétrique : on rejette vite ce qui ne peut clairement pas faire 10×, mais on accorde le bénéfice du doute à ce qui *pourrait* être exceptionnel, même si le dossier est rugueux. Beaucoup de licornes avaient un deck médiocre. La discipline consiste à filtrer sur le **potentiel** plus que sur la **présentation**.`,keyTakeaways:["Screening = passer de centaines de dossiers à une poignée.","Un filtre trop rigide tue les aberrations recherchées.","Filtrer sur le potentiel, pas sur la qualité du deck."],quiz:[{question:"Quel est le danger d'un filtre de screening trop rigide ?",options:[{text:"Rejeter précisément les aberrations qui font la loi de puissance",correct:!0},{text:"Laisser passer trop de dossiers en due diligence",correct:!1},{text:"Ralentir excessivement le traitement des dossiers",correct:!1}],explanation:"Beaucoup de licornes avaient un deck médiocre : la discipline consiste à filtrer sur le potentiel plus que sur la présentation."},{question:"Comment fonctionne un screening efficace ?",options:[{text:"De manière asymétrique : rejeter vite ce qui ne peut pas faire 10x, mais accorder le bénéfice du doute au potentiel exceptionnel",correct:!0},{text:"En appliquant le même seuil strict à tous les dossiers",correct:!1},{text:"En se fondant d'abord sur la qualité graphique du deck",correct:!1}],explanation:"On filtre sur ce qui peut produire un fund-returner, pas sur la qualité de la présentation."}],furtherReading:[]},"equipe-et-marche":{body:`## Au début, c'est l'équipe

Plus le stade est précoce, moins il y a de chiffres, et plus l'**équipe** pèse. On cherche : une compréhension non triviale du problème (*founder-market fit*), une capacité d'exécution démontrée, une vélocité d'apprentissage, et la rare combinaison d'**obsession** et de **lucidité**.

Les signaux faibles comptent : la clarté avec laquelle un fondateur explique son marché, la qualité des personnes qu'il a su recruter, l'honnêteté avec laquelle il parle de ses risques.

## Puis vient le marché

Un grand fondateur sur un petit marché reste contraint par la taille du marché. On évalue donc :

- **TAM / SAM / SOM** : la taille totale adressable, ce qu'on peut servir, ce qu'on peut capter.
- **La dynamique** : le marché grandit-il ? Pourquoi maintenant ([[why-now|why now]]) ?
- **La structure** : winner-take-most ou fragmenté ? Effets de réseau ?

## La synthèse

La question d'investissement la plus utile n'est pas « est-ce une bonne entreprise ? » mais « **si cette équipe a raison sur ce marché, est-ce que cela peut devenir énorme ?** ». On cherche la conjonction d'une équipe rare et d'un marché capable d'absorber une réussite démesurée.`,keyTakeaways:["Plus c'est précoce, plus l'équipe pèse dans la décision.","Évaluer le marché : TAM/SAM/SOM, dynamique, structure.","La bonne question : si l'équipe a raison, est-ce que ça peut être énorme ?"],quiz:[{question:"Au stade pre-seed, sur quoi repose principalement la décision ?",options:[{text:"L'équipe et le founder-market fit",correct:!0},{text:"L'EBITDA et la rentabilité actuelle",correct:!1},{text:"Le multiple de revenu comparable",correct:!1}],explanation:"Sans données fiables au pre-seed, c'est la qualité de l'équipe et son adéquation au marché qui portent l'essentiel du jugement."}],furtherReading:[]},"traction-et-unit-economics":{body:`## La traction n'est pas la croissance brute

La croissance impressionne ; la **rétention** révèle. Une entreprise qui acquiert vite mais perd vite ses clients remplit un seau percé. On regarde donc d'abord la **rétention nette** (NRR) et les cohortes : les clients restent-ils, et dépensent-ils plus avec le temps ?

## Les unit economics

Les [[unit-economics|unit economics]] décrivent l'économie d'une seule unité (un client, une transaction). Les indicateurs clés :

- **CAC** : coût d'acquisition d'un client.
- **LTV** : valeur générée par ce client sur sa durée de vie.
- **Ratio LTV/CAC** : au-dessus de 3, sain en général ; en dessous de 1, on perd de l'argent à chaque vente.
- **Payback** : en combien de mois récupère-t-on le coût d'acquisition ?

## Le Rule of 40 et la brûlure

Pour les entreprises plus avancées, le [[rule-of-40|Rule of 40]] résume l'arbitrage croissance/rentabilité : la somme du taux de croissance et de la marge opérationnelle devrait dépasser 40 %. On surveille aussi le [[burn-rate|burn rate]] et le [[burn-multiple|burn multiple]] : combien on brûle pour générer un euro de revenu nouveau. Une croissance achetée trop cher n'est pas de la traction — c'est un mirage financé par le cash des investisseurs.`,keyTakeaways:["La rétention révèle plus que la croissance brute.","LTV/CAC > 3 et payback court = unit economics sains.","Rule of 40 et burn multiple jugent l'efficacité de la croissance."],quiz:[{question:"Qu'est-ce qui révèle le mieux la solidité d'une traction ?",options:[{text:"La rétention nette et les cohortes, pas la croissance brute",correct:!0},{text:"Le nombre total d'inscriptions cumulées",correct:!1},{text:"Le montant levé lors du dernier tour",correct:!1}],explanation:"Une entreprise qui acquiert vite mais perd vite ses clients remplit un seau percé ; la rétention montre si le besoin est réel."},{question:"Un ratio LTV/CAC considéré comme sain se situe généralement :",options:[{text:"Au-dessus de 3",correct:!0},{text:"En dessous de 1",correct:!1},{text:"Exactement à 1",correct:!1}],explanation:"Au-dessus de 3 le modèle est généralement sain ; en dessous de 1 on perd de l'argent à chaque vente."}],furtherReading:[]},"la-due-diligence-priorisee":{body:`## Vérifier ce qui compte

La [[dd|due diligence]] est souvent mal comprise. Ce n'est pas un audit comptable destiné à tout vérifier — c'est une **enquête priorisée** sur les hypothèses qui, si elles sont fausses, font échouer l'investissement. On commence donc par formuler les **trois risques majeurs**, puis on dirige l'énergie vers eux.

## Les grands chantiers

- **Commerciale** : le marché est-il réel ? Les clients confirment-ils la valeur ? La traction est-elle organique ?
- **Technique / produit** : la technologie tient-elle ? Quelle dette technique, quelle défensibilité ?
- **Équipe** : appels de référence, dynamique des fondateurs, capacité à recruter.
- **Juridique / cap table** : [[cap-table|cap table]] propre, propriété intellectuelle, contrats clés, clauses dangereuses.

## Le piège de la sur-analyse

En VC précoce, on n'aura jamais assez de données pour être certain. La DD parfaite n'existe pas ; pire, l'excès d'analyse devient une manière élégante de ne jamais décider. Le bon praticien sait quand la DD a suffisamment **réduit l'incertitude sur les risques qui comptent**, et accepte d'investir avec un inconfort résiduel. Décider sous incertitude est le métier.`,keyTakeaways:["Formuler les trois risques majeurs avant de creuser.","Couvrir commercial, technique, équipe, juridique/cap table.","La sur-analyse est une fuite : décider sous incertitude est le métier."],quiz:[{question:"La due diligence est-elle un audit exhaustif de l'entreprise ?",options:[{text:"Non : c'est une enquête ciblée sur ce qui peut tuer l'investissement, dans un temps contraint",correct:!0},{text:"Oui, elle doit couvrir chaque aspect avec la même profondeur",correct:!1},{text:"Oui, mais uniquement sur le plan financier",correct:!1}],explanation:"La sur-analyse est une fuite : décider sous incertitude fait partie du métier."},{question:"Par quoi commence une due diligence priorisée ?",options:[{text:"Formuler les trois risques majeurs avant de creuser",correct:!0},{text:"Réclamer l'ensemble des contrats de l'entreprise",correct:!1},{text:"Modéliser le rendement attendu du fonds",correct:!1}],explanation:"On définit d'abord ce qui peut faire échouer l'investissement, puis on concentre l'effort sur ces risques."}],furtherReading:[]},"anatomie-d-une-these":{body:`## Qu'est-ce qu'une thèse ?

Une [[thesis-driven|thèse d'investissement]] n'est pas un slogan sectoriel (« nous croyons à l'IA »). C'est une **hypothèse structurée et falsifiable** sur l'avenir. Elle répond à trois questions :

1. **Où va le monde ?** Quel changement structurel est en cours ?
2. **Pourquoi maintenant ?** Qu'est-ce qui rend ce changement possible aujourd'hui et pas avant ([[why-now|why now]]) ?
3. **Pourquoi nous ?** Quel avantage avons-nous pour gagner sur ce terrain ?

## Falsifiable, donc utile

Une bonne thèse peut être **démentie**. Si aucun fait ne pourrait jamais la contredire, ce n'est pas une thèse, c'est une croyance. On écrit donc explicitement : « cette thèse est fausse si… ». Cela permet d'apprendre, de mettre à jour, et de ne pas s'accrocher par ego.

## Top-down et bottom-up

Une thèse **top-down** part d'une vision macro et cherche les entreprises qui l'incarnent. Une thèse **bottom-up** part d'observations répétées sur le terrain qui finissent par dessiner un pattern. Les meilleurs investisseurs font les deux : la macro donne la direction, le terrain donne la conviction et le timing.`,keyTakeaways:["Une thèse répond à : où va le monde, pourquoi maintenant, pourquoi nous.","Une thèse doit être falsifiable pour être utile.","Combiner top-down (direction) et bottom-up (conviction)."],quiz:[{question:"Quelle propriété rend une thèse d'investissement réellement utile ?",options:[{text:"Elle est falsifiable : on peut écrire ce qui la rendrait fausse",correct:!0},{text:"Elle s'appuie sur un secteur porteur largement reconnu",correct:!1},{text:"Elle reste assez vague pour ne jamais être contredite",correct:!1}],explanation:"Si aucun fait ne pourrait jamais la contredire, ce n'est pas une thèse mais une croyance."},{question:"Quelles questions une thèse structurée doit-elle traiter ?",options:[{text:"Où va le monde, pourquoi maintenant, pourquoi nous",correct:!0},{text:"Combien lever, à quelle valorisation, avec quel instrument",correct:!1},{text:"Quel concurrent acheter et à quel prix",correct:!1}],explanation:"La macro donne la direction (où va le monde, pourquoi maintenant) ; le terrain donne la conviction (pourquoi nous)."}],furtherReading:[]},"defendre-une-these":{body:`## Le comité n'est pas un public

En [[ic|comité d'investissement]], on ne « vend » pas un deal — on le **soumet à l'épreuve**. Les seniors cherchent les failles. Une thèse bien défendue n'est pas celle qui esquive les objections : c'est celle qui les a **déjà anticipées**.

## Le pre-mortem

Un outil puissant : imaginer que l'investissement a échoué dans cinq ans, et écrire pourquoi. Ce **pre-mortem** force à expliciter les risques que l'enthousiasme masque. On présente ensuite ces risques soi-même, avant que d'autres ne les soulèvent — c'est le signe d'un jugement mûr.

## Conviction et humilité

La meilleure posture combine **conviction** (j'ai une thèse claire et je l'assume) et **humilité épistémique** (voici ce qui me ferait changer d'avis). Un mémo qui ne présente que des arguments favorables inspire la méfiance. Un mémo qui dit « voici les trois raisons d'investir, voici les trois raisons de ne pas le faire, et voici pourquoi je penche » inspire la confiance.`,keyTakeaways:["Le comité teste la thèse ; ne pas esquiver les objections.","Le pre-mortem rend les risques explicites avant le vote.","Allier conviction assumée et humilité épistémique."],quiz:[{question:"À quoi sert un pre-mortem avant de défendre un deal ?",options:[{text:"Imaginer l'échec à cinq ans pour expliciter les risques que l'enthousiasme masque",correct:!0},{text:"Vérifier une dernière fois les calculs de cap table",correct:!1},{text:"Préparer la communication en cas de succès",correct:!1}],explanation:"On présente ensuite ces risques soi-même, avant que d'autres ne les soulèvent : c'est le signe d'un jugement mûr."},{question:"Quelle posture inspire le plus confiance en comité d'investissement ?",options:[{text:"Présenter à la fois les raisons d'investir et de ne pas le faire, puis trancher",correct:!0},{text:"Ne présenter que des arguments favorables, pour rester convaincant",correct:!1},{text:"Éviter les objections pour ne pas fragiliser le dossier",correct:!1}],explanation:"Une thèse bien défendue est celle qui a déjà anticipé les objections, en combinant conviction et humilité épistémique."}],furtherReading:[]},"les-termes-economiques":{body:`## La term sheet déplace du risque

Une [[term-sheet|term sheet]] est un document non contraignant qui fixe les conditions d'un investissement. Chaque clause **déplace du risque ou du pouvoir**. On distingue les termes *économiques* (qui touche combien) et les termes de *contrôle* (qui décide). Commençons par l'argent.

## La liquidation preference

La [[liquidation-preference|liquidation preference]] détermine qui est payé en premier lors d'une sortie. Une préférence **1× non-participating** signifie que l'investisseur récupère sa mise avant tout le monde, ou convertit en actions ordinaires si c'est plus avantageux — mais pas les deux. Une préférence **participating** (« double-dip ») lui donne sa mise *puis* sa part du reste : bien plus dure pour les fondateurs. Le multiple (1×, 2×…) amplifie l'effet.

## Anti-dilution et pool d'options

L'[[anti-dilution|anti-dilution]] protège l'investisseur si un tour futur se fait à une valorisation plus basse (*down round*). La version **weighted average** est douce et standard ; le **full ratchet** est brutal et rare. Enfin, le **pool d'options** (ESOP) réservé aux employés est souvent créé *avant* le tour, ce qui dilue les fondateurs et non les nouveaux investisseurs — un point de négociation classique.

## Le réflexe du praticien

Ne jamais lire une clause isolément. Toujours se demander : **dans tel scénario de sortie, qui touche quoi ?** Une valorisation flatteuse assortie d'une préférence participating 2× peut rapporter moins, aux fondateurs, qu'une valorisation plus basse avec des termes propres.`,keyTakeaways:["Termes économiques (qui touche quoi) vs termes de contrôle (qui décide).","Liquidation preference participating ≫ non-participating pour l'investisseur.","Toujours simuler la sortie : qui touche quoi, dans quel scénario ?"],quiz:[{question:"Une liquidation preference 1× « participating » signifie que l'investisseur :",options:[{text:"Récupère sa mise PUIS partage le reste au prorata",correct:!0},{text:"Récupère uniquement sa mise, sans plus",correct:!1},{text:"Renonce à toute priorité de paiement",correct:!1}],explanation:"Le caractère « participating » (double-dip) donne à l'investisseur sa préférence puis une part du reliquat — moins favorable aux fondateurs qu'une préférence non-participating."}],furtherReading:[{label:"Simulateur de dilution",kind:"simulator",ref:"dilution"}]},"les-termes-de-controle":{body:`## Le contrôle ne suit pas la propriété

Une erreur fréquente : croire que celui qui détient le plus d'actions décide. En réalité, les **termes de contrôle** distribuent le pouvoir indépendamment de la part. On peut détenir 15 % et disposer d'un droit de véto déterminant.

## Les leviers de contrôle

- **Composition du board** : combien de sièges pour les fondateurs, les investisseurs, les indépendants ? Le board décide des sujets majeurs.
- **Protective provisions** : liste de décisions nécessitant l'accord des investisseurs (nouvelle levée, vente, budget, embauche de dirigeants).
- **Pro-rata** : le droit (pas l'obligation) de réinvestir pour maintenir sa part aux tours suivants — précieux pour suivre les gagnantes.
- **Vesting fondateurs** : les parts des fondateurs s'acquièrent dans le temps ; un fondateur qui part tôt ne garde pas tout.

## L'équilibre sain

Un bon term sheet protège l'investisseur sans paralyser l'entreprise. Trop de droits de véto transforment chaque décision en négociation et étouffent la vélocité qui fait justement la valeur d'une startup. Les meilleurs investisseurs cherchent l'alignement durable plutôt que le contrôle maximal — parce qu'ils savent qu'ils auront besoin du fondateur motivé pendant dix ans.`,keyTakeaways:["Le contrôle se distribue indépendamment du pourcentage détenu.","Board, protective provisions, pro-rata et vesting sont les leviers clés.","Trop de contrôle paralyse la vélocité qui crée la valeur."],quiz:[{question:"Le contrôle d'une société revient-il à celui qui détient le plus d'actions ?",options:[{text:"Non : les termes de contrôle distribuent le pouvoir indépendamment du pourcentage détenu",correct:!0},{text:"Oui, l'actionnaire majoritaire décide toujours",correct:!1},{text:"Oui, sauf en cas de pacte signé après la levée",correct:!1}],explanation:"On peut détenir 15 % et disposer d'un droit de véto déterminant via le board et les protective provisions."},{question:"Qu'est-ce que le droit de pro-rata ?",options:[{text:"Le droit, non l'obligation, de réinvestir pour maintenir sa part aux tours suivants",correct:!0},{text:"L'obligation de suivre chaque tour à hauteur de sa participation",correct:!1},{text:"Le droit de revendre ses actions en priorité lors d'une sortie",correct:!1}],explanation:"Le pro-rata est précieux pour suivre les gagnantes ; ne pas l'exercer envoie un signal aux nouveaux investisseurs."}],furtherReading:[]},"reserves-et-follow-on":{body:`## La moitié invisible du fonds

Un fonds ne déploie pas tout son capital dans des premiers tickets. Il garde des **réserves** pour des [[follow-on|follow-on]] : réinvestir dans ses meilleures lignes lors des tours suivants. Souvent, 40 à 60 % du fonds est réservé à cet usage.

## Pourquoi doubler sur les gagnantes

La loi de puissance impose une discipline : on **concentre** ses réserves sur les entreprises qui sur-performent, pas sur celles qui peinent. Réinvestir dans une gagnante à un stade plus avancé réduit le risque par unité de capital, tout en augmentant l'exposition à l'aberration qui rend le fonds.

## Le pro-rata et le signaling

Exercer son [[pro-rata|pro-rata]] permet de maintenir sa part. Mais attention au **signaling risk** : si un investisseur historique ne suit pas un tour, les nouveaux investisseurs s'interrogent. Ne pas réinvestir envoie un signal — parfois injuste, toujours coûteux. La gestion des réserves est donc autant un art relationnel qu'un calcul financier.`,keyTakeaways:["40–60 % du fonds est souvent réservé au follow-on.","Concentrer les réserves sur les gagnantes, pas les retardataires.","Ne pas suivre un tour envoie un signal coûteux (signaling risk)."],quiz:[{question:"Quelle part d'un fonds est souvent gardée en réserve pour le follow-on ?",options:[{text:"Environ 40 à 60 %",correct:!0},{text:"Moins de 5 %",correct:!1},{text:"La quasi-totalité, dès le premier tour",correct:!1}],explanation:"Le fonds ne déploie pas tout son capital en premiers tickets : il réserve de quoi réinvestir dans ses meilleures lignes."},{question:"Sur quelles lignes concentre-t-on en priorité les réserves ?",options:[{text:"Sur les gagnantes qui sur-performent, pas sur les retardataires",correct:!0},{text:"Sur les lignes en difficulté, pour limiter les pertes",correct:!1},{text:"Uniformément, pour ne léser aucune participation",correct:!1}],explanation:"Réinvestir dans une gagnante à un stade plus avancé augmente l'exposition à l'aberration qui rend le fonds."}],furtherReading:[{label:"Comment le simulateur tire les portefeuilles",kind:"lesson",ref:"lpl-simulator-engine"}]},"le-triage-du-portefeuille":{body:`## Trois catégories

Avec le temps, un portefeuille se trie de lui-même en trois groupes :

- **Les stars** : peu nombreuses, elles feront l'essentiel du retour. Elles méritent capital et temps.
- **Les walking dead** : ni mortes ni gagnantes, elles consomment de l'attention sans promesse de retour démesuré.
- **Les pertes** : il faut savoir les reconnaître et tourner la page.

## Le piège de l'attention

Le biais naturel pousse à passer du temps sur les entreprises **en difficulté** — par culpabilité, par espoir, par relation. Or c'est souvent une erreur d'allocation : le temps d'un investisseur est rare, et les stars ont elles aussi besoin de soutien pour devenir énormes. La discipline consiste à **sur-investir son temps là où le potentiel est le plus grand**.

## Accepter la mort

Laisser mourir une ligne n'est pas un échec moral ; c'est la conséquence assumée de la loi de puissance. Un portefeuille sans pertes est un portefeuille qui n'a pas pris assez de risque. La maturité d'un investisseur se mesure aussi à sa capacité à dire stop avec dignité, sans s'acharner.`,keyTakeaways:["Un portefeuille se trie en stars, walking dead et pertes.","Le biais pousse à sur-investir le temps sur les sociétés en difficulté.","Accepter la mort de certaines lignes fait partie du métier."],quiz:[{question:"Quel biais menace l'allocation du temps d'un investisseur ?",options:[{text:"Passer trop de temps sur les sociétés en difficulté, par espoir ou culpabilité",correct:!0},{text:"Consacrer trop de temps aux stars du portefeuille",correct:!1},{text:"Ignorer systématiquement les walking dead",correct:!1}],explanation:"Le temps d'un investisseur est rare ; la discipline consiste à le sur-investir là où le potentiel est le plus grand."},{question:"Comment interpréter un portefeuille qui ne compte aucune perte ?",options:[{text:"Il n'a probablement pas pris assez de risque",correct:!0},{text:"Il est mieux géré que la moyenne",correct:!1},{text:"Il garantit un meilleur rendement final",correct:!1}],explanation:"Laisser mourir une ligne est la conséquence assumée de la loi de puissance, pas un échec moral."}],furtherReading:[]},"pourquoi-la-moyenne-ment-en-vc":{body:`## Le mauvais réflexe : chercher le rendement moyen

Dans beaucoup de classes d'actifs, raisonner sur la moyenne est un réflexe acceptable. Si les résultats se distribuent autour d'un centre stable, la moyenne raconte quelque chose de proche de l'expérience typique. En venture capital, c'est précisément ce qui casse.

Les retours ne suivent pas une loi normale. Ils suivent une [[power-law|loi de puissance]] : beaucoup de lignes rendent peu ou rien, quelques lignes rendent correctement, et une poignée d'outliers produit l'essentiel du retour du fonds.

C'est le fameux cas du deal qui rend le fonds. Une seule société peut rembourser tout le véhicule, parfois plusieurs fois, pendant que la majorité du portefeuille détruit du capital ou rend un multiple modeste.

## Moyenne contre médiane

La conséquence contre-intuitive est simple : **la moyenne peut mentir sur l'expérience probable**.

Imagine un fonds dont les simulations donnent un TVPI moyen de 3×. Cela semble confortable. Mais si la médiane est à 1,2×, cela veut dire qu'un scénario sur deux finit autour de 1,2× ou moins. La moyenne est tirée vers le haut par quelques tirages où une société devient énorme.

Ce n'est pas une anomalie statistique. C'est le métier. Le VC achète une exposition à une queue de distribution très épaisse. Le problème n'est donc pas seulement de savoir si la stratégie peut produire 3× en moyenne. Il faut savoir **à quelle fréquence**, **dans quels scénarios**, et **avec quelle dépendance à une ou deux positions**.

## Ce que cache un chiffre unique

Un TVPI unique donne une illusion de précision. Il ne dit pas :

- combien de scénarios rendent moins que le capital ;
- quelle part des scénarios dépasse 2× ou 3× ;
- combien le résultat dépend de la meilleure ligne ;
- si le fonds a assez d'ownership pour qu'un gros exit compte vraiment ;
- si la taille de marché rend plausible le fund returner nécessaire.

C'est pour cela que le simulateur Power Law ne cherche pas à afficher un verdict unique. Il montre la distribution entière. La question devient alors : quelle forme prend le risque ? Où est le downside ? À quel point l'upside est-il concentré ? Qu'est-ce qui change quand on bouge le nombre de lignes, l'ownership ou les réserves ?

## Le vrai message de la power law

La loi de puissance ne dit pas seulement que certains deals sont meilleurs que d'autres. Elle dit que la structure même du portefeuille doit être construite pour ne pas manquer l'extrême.

Un portefeuille trop petit peut ne jamais attraper l'outlier. Un portefeuille trop dilué peut l'attraper sans que cela compte au niveau du fonds. Un fonds qui ne garde pas de réserves peut voir sa meilleure société grossir tout en perdant l'ownership qui aurait changé le millésime.

La moyenne rassure. La distribution instruit.`,keyTakeaways:["En VC, la moyenne peut être tirée par quelques outliers et décrire un scénario que la plupart des tirages ne vivent pas.","La médiane raconte l'expérience typique ; l'écart moyenne-médiane révèle la force de la queue de distribution.","Un bon simulateur de portefeuille doit montrer dispersion, probabilités et concentration, pas seulement un TVPI unique."],quiz:[{question:"Pourquoi la moyenne peut-elle être trompeuse dans un portefeuille VC ?",options:[{text:"Parce que quelques outliers peuvent tirer la moyenne très au-dessus du scénario médian",correct:!0},{text:"Parce que tous les deals ont exactement le même multiple de sortie",correct:!1},{text:"Parce que le TVPI ne peut jamais dépasser 1×",correct:!1}],explanation:"Dans une distribution en loi de puissance, quelques très gros gagnants déplacent la moyenne. La médiane et les percentiles sont indispensables pour comprendre le risque vécu par la majorité des scénarios."}],furtherReading:[{label:"Pourquoi utiliser Monte Carlo",kind:"lesson",ref:"lpl-why-monte-carlo"},{label:"Cas : anatomie d'un portefeuille power-law",kind:"case",ref:"cs-power-law-portfolio"}]},"pourquoi-utiliser-monte-carlo-en-vc":{body:`## Le problème : un fonds n'a qu'une vie

Un GP ne peut pas lancer le même fonds 4 000 fois pour voir ce qui se passe. Dans la vraie vie, il n'y aura qu'un millésime, une séquence de deals, une conjoncture de sortie, et une poignée de décisions de follow-on.

Pourtant, quand on construit un portefeuille, on raisonne toujours sur des incertitudes répétées : combien de lignes vont échouer ? Combien vont devenir modestement correctes ? Combien auront une chance d'entrer dans la queue de distribution ? Que se passe-t-il si l'outlier arrive, mais que l'ownership à l'exit est trop faible ?

Monte Carlo sert à explorer ces questions sans prétendre connaître le futur.

## Ce que fait Monte Carlo

Une simulation Monte Carlo prend des hypothèses, puis tire au sort beaucoup de scénarios compatibles avec ces hypothèses. Ici, chaque scénario est un portefeuille complet. Chaque ligne reçoit un sort : échec, sortie modeste ou outlier power law. Le fonds agrège ensuite les retours de toutes les lignes.

Après 4 000 tirages, on ne demande pas : quel est le bon chiffre ? On demande : **quelle distribution de résultats cette stratégie produit-elle ?**

C'est la différence entre un modèle qui dit ce qui se passe en moyenne et un modèle qui montre la carte du risque.

## Pourquoi c'est pertinent en VC

Monte Carlo est particulièrement utile quand trois conditions sont réunies :

- les résultats sont très dispersés ;
- quelques événements rares dominent le total ;
- les décisions portent sur des probabilités, pas sur des certitudes.

C'est exactement le cas du venture capital. Le résultat d'un fonds dépend d'événements extrêmes : une société qui passe de 3× à 80×, une dilution évitée sur une gagnante, un follow-on placé au bon endroit. Ces événements ne se lisent pas bien dans un modèle linéaire.

La simulation permet donc de regarder le portefeuille comme un ensemble de futurs possibles. Elle rend visible la probabilité de ne pas rendre le capital, la chance de dépasser 2× ou 3×, et la dépendance du fonds à la meilleure ligne.

## Ce n'est pas une boule de cristal

La limite est essentielle : Monte Carlo ne garantit pas que les hypothèses sont vraies. Si les taux de graduation, l'alpha de la queue ou le multiple maximum sont mal calibrés, la sortie du modèle sera propre mais trompeuse.

Son utilité n'est donc pas de prédire le TVPI exact. Son utilité est de tester un raisonnement :

- si je baisse le nombre de lignes, est-ce que j'augmente trop le risque de manquer l'outlier ?
- si je monte les réserves, est-ce que je renforce vraiment les gagnants ou est-ce que je réduis trop les tickets initiaux ?
- si mon ownership à l'exit tombe à 4 %, quel exit faut-il pour rendre le fonds ?
- si le marché ne permet pas ce niveau d'exit, ma construction de portefeuille est-elle incohérente ?

Monte Carlo devient alors un outil de jugement sous incertitude. Il ne remplace pas la thèse, le sourcing ou la qualité des deals. Il force simplement la stratégie à se confronter à sa propre distribution.`,keyTakeaways:["Monte Carlo explore des milliers de scénarios plausibles ; il ne prédit pas le scénario qui arrivera.","La méthode est pertinente en VC parce que les retours sont dispersés, rares et dominés par les extrêmes.","Le bon usage consiste à tester la sensibilité d'une stratégie aux leviers contrôlables : lignes, ownership, réserves, dilution et graduation."],quiz:[{question:"Quel est le bon usage de Monte Carlo dans le simulateur Power Law ?",options:[{text:"Voir la distribution des résultats possibles et tester la sensibilité aux hypothèses",correct:!0},{text:"Prédire exactement le TVPI futur du fonds",correct:!1},{text:"Supprimer l'incertitude en remplaçant le jugement du GP",correct:!1}],explanation:"Monte Carlo ne promet pas le futur. Il rend visibles des milliers de futurs compatibles avec les hypothèses pour mieux comprendre dispersion, probabilités et dépendance aux outliers."}],furtherReading:[{label:"Comment le simulateur tire les portefeuilles",kind:"lesson",ref:"lpl-simulator-engine"},{label:"Power law & construction de portefeuille",kind:"simulator",ref:"power-law"}]},"comment-le-simulateur-power-law-tire-les-portefeuilles":{body:`## Les 9 curseurs ne sont pas décoratifs

Le simulateur part des leviers que le GP peut réellement discuter : taille du fonds, nombre de lignes, réserves follow-on, ownership initial, dilution jusqu'à l'exit, taux d'échec, sorties modestes, pente de la queue et multiple maximum.

Ces paramètres décrivent une stratégie de portefeuille simplifiée. Ils répondent à trois questions :

- combien de chances le fonds se donne-t-il d'attraper un outlier ?
- quelle part de cet outlier gardera-t-il à l'exit ?
- quelle taille d'outlier est réaliste dans le marché visé ?

Les taux d'échec, de sorties modestes et de queue jouent le rôle de graduation rates simplifiés. Ils ne modélisent pas chaque tour de financement, mais ils traduisent l'idée qu'une startup doit franchir plusieurs seuils avant de devenir une vraie candidate au fund returner.

## Le tirage par ligne

Pour chaque ligne, le simulateur tire un nombre uniforme. Ce tirage décide du sort de la société.

- Si le tirage tombe dans le taux d'échec, le multiple vaut 0×.
- S'il tombe dans la zone des sorties modestes, le multiple est tiré uniformément entre 0,3× et 3×.
- S'il tombe dans la queue power law, le multiple vient d'une distribution de Pareto tronquée.

La queue commence à 3×, puis utilise la formule : m = 3 × (1 - u)^(-1/α), plafonnée au multiple maximum.

Le paramètre α contrôle l'épaisseur de la queue. Plus α est bas, plus les outliers extrêmes deviennent fréquents et violents. Le multiple maximum évite de raconter des histoires impossibles : aucun modèle ne devrait produire des exits au-delà de ce que la taille de marché peut absorber.

## Agréger au niveau du fonds

Une fois les multiples tirés, le simulateur convertit les lignes en retour de fonds.

Le capital non réservé est divisé entre les lignes initiales. Chaque check initial reçoit le multiple de sortie, puis subit la dilution : le multiple effectif devient m × (1 - dilution). Cela modélise la perte de valeur quand le fonds ne défend pas son pro-rata ou se fait diluer sur les tours suivants.

Les réserves follow-on sont traitées différemment. Elles sont déployées dans les lignes de la queue, donc dans les gagnants, à parts égales. Le rendement appliqué est √m : un follow-on plus tardif capte moins d'upside que le check initial, mais il concentre le capital sur une ligne déjà plus prouvée. Dans ce modèle, le follow-on ne subit pas de dilution supplémentaire, car il représente un pro-rata défendu.

Si aucune ligne n'est défendable, la réserve est restituée à 1×. Autrement dit, le fonds ne prétend pas investir ses réserves dans des gagnants qui n'existent pas.

## Pourquoi le résultat est reproductible

Le générateur aléatoire est seedé. À paramètres égaux, le simulateur donne les mêmes résultats. C'est important pour un outil pédagogique : deux utilisateurs qui regardent la même stratégie doivent discuter du même résultat, et les tests automatisés doivent pouvoir vérifier que le moteur ne dérive pas.

La reproductibilité ne rend pas le futur certain. Elle rend l'expérience stable.

## Les limites à garder en tête

Le moteur est volontairement pédagogique. Il ne modélise pas les frais, le carry, le recyclage, le timing des cash-flows, la corrélation entre deals, ni les cycles de marché. Les multiples sont i.i.d. : chaque ligne est tirée indépendamment.

Ces simplifications sont acceptables tant que l'on comprend l'objet du simulateur : rendre visible la logique power law et la sensibilité de la construction de portefeuille. Pour une décision réelle d'investissement ou de levée de fonds, il faudrait compléter par un modèle de cash-flow, une thèse de marché et des hypothèses de sortie beaucoup plus contextualisées.`,keyTakeaways:["Chaque run simule un portefeuille complet ; chaque ligne devient échec, sortie modeste ou outlier Pareto.","La dilution réduit le check initial, tandis que les réserves sont concentrées sur les gagnants avec un rendement en racine carrée du multiple.","Le moteur est déterministe à paramètres égaux : c'est un outil stable pour apprendre, comparer et tester."],quiz:[{question:"Dans le simulateur, que signifie un α plus bas dans la queue Pareto ?",options:[{text:"Une queue plus épaisse, donc des outliers plus extrêmes",correct:!0},{text:"Un taux d'échec automatiquement plus élevé",correct:!1},{text:"Une suppression des sorties modestes",correct:!1}],explanation:"L'alpha contrôle la pente de la queue. Plus il est bas, plus la distribution donne du poids aux multiples extrêmes."}],furtherReading:[{label:"Lire TVPI, concentration et fund returner math",kind:"lesson",ref:"lpl-read-results"},{label:"Réserves & follow-on",kind:"lesson",ref:"l-reserves"}]},"lire-tvpi-concentration-fund-returner-math":{body:`## Commencer par la médiane, pas par la moyenne

Le premier réflexe est de comparer TVPI médian et TVPI moyen. Si la moyenne est beaucoup plus haute que la médiane, la stratégie dépend fortement de quelques scénarios extrêmes. C'est normal en VC, mais il faut le voir.

La médiane répond : dans le scénario central, que se passe-t-il ? La moyenne répond : que vaut l'espérance si l'on accepte que quelques très gros gagnants dominent tout ? Les deux chiffres sont utiles, mais ils ne racontent pas la même histoire.

## Lire les percentiles

Les percentiles donnent une lecture plus honnête du risque.

- P10 montre un cas défavorable : 10 % des simulations finissent en dessous.
- P90 montre un cas favorable : 10 % des simulations finissent au-dessus.
- L'écart P10-P90 raconte la dispersion de la stratégie.

Un fonds peut avoir une bonne moyenne et un P10 très faible. Cela signifie que l'upside existe, mais que le downside reste dur. Pour un LP, un GP ou un candidat en entretien, c'est souvent plus instructif qu'un seul multiple cible.

## Lire les probabilités de seuil

Les probabilités cumulées répondent à une question très concrète : quelle fraction des scénarios dépasse un seuil donné ?

P(TVPI ≥ 1×) mesure la probabilité de rendre au moins le capital. P(TVPI ≥ 2×) commence à ressembler à un bon fonds brut. P(TVPI ≥ 3×) entre dans le territoire d'une vraie surperformance. P(TVPI ≥ 5×) montre la puissance, mais aussi la rareté, des scénarios exceptionnels.

Ces probabilités sont utiles parce qu'elles évitent le langage flou. Dire qu'une stratégie vise 3× ne suffit pas. Il faut savoir si ce 3× apparaît dans 8 %, 25 % ou 45 % des simulations.

## Lire la concentration

La part de la meilleure ligne et la part du top 3 montrent à quel point le fonds dépend d'une ou deux positions. Une forte concentration n'est pas forcément mauvaise : c'est souvent le signe d'une vraie loi de puissance. Mais elle change la nature du risque.

Si la meilleure ligne apporte la majorité du retour total, le fonds est très sensible à l'ownership final, au follow-on et au marché de sortie de cette société. Le GP doit alors se demander s'il a réellement les droits, les réserves et la discipline pour défendre cette ligne jusqu'au bout.

## Le fund returner math

Le calcul le plus utile est souvent le plus brutal : avec l'ownership à l'exit, quelle valeur de sortie une seule société doit-elle atteindre pour rendre 1× le fonds ?

Si un fonds de 80 M€ possède 6 % à l'exit, il lui faut environ 1,33 Md€ d'exit pour récupérer 80 M€ sur une seule ligne. Si le marché visé ne peut raisonnablement pas produire ce niveau d'exit, la construction de portefeuille est incohérente : trop gros fonds, ownership trop faible, dilution trop forte, ou thèse de marché trop petite.

Ce test relie la stratégie de portefeuille au monde réel. Il empêche de se cacher derrière des multiples abstraits.

## Lire les histogrammes

Le premier histogramme montre la distribution des TVPI sur les 4 000 simulations. C'est la forme globale du fonds : combien de scénarios sont faibles, combien sont corrects, combien deviennent excellents.

Le second histogramme montre la distribution des multiples par ligne. Il permet de voir la queue : beaucoup de zéros et de modestes sorties, puis quelques multiples très élevés. Les deux vues se complètent : l'une parle du fonds, l'autre parle des deals qui le composent.

La bonne lecture n'est pas de chercher le plus beau chiffre. C'est de demander si la forme de la distribution correspond à la stratégie que le GP croit déployer.`,keyTakeaways:["Médiane, moyenne et percentiles doivent être lus ensemble pour distinguer scénario typique, espérance et dispersion.","Les probabilités de seuil transforment l'ambition de TVPI en fréquence de scénarios.","Le fund returner math teste la cohérence entre taille du fonds, ownership à l'exit et taille réaliste des exits."],quiz:[{question:"Pourquoi le fund returner math est-il un test de cohérence utile ?",options:[{text:"Il relie taille du fonds, ownership à l'exit et taille d'exit nécessaire pour rendre le fonds",correct:!0},{text:"Il garantit qu'une société sortira forcément au montant calculé",correct:!1},{text:"Il remplace l'analyse de marché et la diligence",correct:!1}],explanation:"Le calcul ne prédit rien. Il vérifie si la stratégie a besoin d'exits plausibles ou d'exits irréalistes pour fonctionner."}],furtherReading:[{label:"Power law & construction de portefeuille",kind:"simulator",ref:"power-law"},{label:"Lire les métriques d'un fonds",kind:"lesson",ref:"l-fund-metrics"}]},"fees-carry-et-waterfall":{body:`## La structure 2 & 20

Le modèle économique classique d'un fonds tient en deux nombres : **2 & 20**.

- **2 %** de [[management-fees|management fees]] par an sur le capital engagé : cela paie les salaires, les bureaux, le fonctionnement. Ce n'est pas du profit, c'est du carburant.
- **20 %** de [[carry|carried interest]] : la part des plus-values qui revient au GP — mais seulement après que les LPs ont récupéré leur mise (et souvent un rendement minimum).

## La waterfall et le hurdle

La [[waterfall|waterfall]] décrit l'ordre dans lequel l'argent d'une sortie est distribué :

1. **Retour du capital** aux LPs (ils récupèrent d'abord ce qu'ils ont investi).
2. **Hurdle / preferred return** : un rendement minimum (souvent ~8 %) avant tout carry.
3. **Catch-up** : le GP rattrape pour atteindre sa part.
4. **Split 80/20** du reste entre LPs et GP.

## Pourquoi cela compte

Cette structure explique le comportement d'un GP. Les fees assurent la survie ; le carry crée la richesse — mais uniquement si le fonds performe vraiment. C'est ce qui pousse (en théorie) le GP à viser les grands retours plutôt que la sécurité. Un GP qui vit confortablement de ses seules fees sans jamais générer de carry n'a pas fait son métier.`,keyTakeaways:["2 % de fees (carburant) + 20 % de carry (richesse conditionnelle).","La waterfall : capital → hurdle → catch-up → split 80/20.","Le carry n'arrive qu'après que les LPs sont remboursés."],quiz:[{question:"Dans la waterfall, qui est payé en premier ?",options:[{text:"Les LPs récupèrent leur capital investi",correct:!0},{text:"Le GP touche son carry de 20 %",correct:!1},{text:"Les fees de gestion sont distribuées",correct:!1}],explanation:"La waterfall protège les LPs : ils récupèrent leur capital, puis le hurdle, avant que le GP ne perçoive son carried interest."}],furtherReading:[{label:"Simulateur de fund returns",kind:"simulator",ref:"fund-returns"}]},"lire-les-metriques-d-un-fonds":{body:`## Réalisé contre latent

Les métriques d'un fonds répondent à deux questions différentes : **combien a-t-on réellement rendu ?** et **combien vaut encore le portefeuille sur le papier ?** La première question mesure la liquidité. La seconde mesure le potentiel restant, avec toute l'incertitude des valorisations privées.

- **[[dpi|DPI]]** (Distributions to Paid-In) : distributions versées aux LPs / capital appelé. C'est le cash effectivement revenu.
- **[[rvpi|RVPI]]** (Residual Value to Paid-In) : valeur résiduelle du portefeuille / capital appelé. C'est la partie encore latente.
- **[[tvpi|TVPI]]** : DPI + RVPI. C'est la valeur totale, réalisée et latente, rapportée au capital appelé.
- **[[moic|MOIC]]** : multiple brut de valeur. Il raconte le multiple, pas la vitesse.
- **[[irr|IRR]]** : rendement annualisé. Il raconte le timing des flux, donc il peut être très sensible aux sorties précoces.

## Exemple de lecture

Imaginons un fonds qui a appelé 40 M€ de capital. Il a déjà distribué 18 M€ aux LPs et conserve 70 M€ de valeur résiduelle dans le portefeuille.

1. DPI = 18 / 40 = **0,45×**. Les LPs ont récupéré moins de la moitié du capital appelé.
2. RVPI = 70 / 40 = **1,75×**. La plus grande partie de la valeur est encore latente.
3. TVPI = 0,45 + 1,75 = **2,20×**. Le fonds semble créer beaucoup de valeur, mais environ 80 % de cette valeur dépend encore de futures sorties.

La lecture correcte n'est donc pas « excellent fonds » ni « mauvais fonds ». Elle est plus précise : le potentiel est élevé, mais le risque de conversion en cash reste central. La question suivante devient : quelle est la qualité des valorisations, quel est l'âge du fonds, et combien de sociétés peuvent encore sortir à bon prix ?

## Le temps change le jugement

Deux fonds peuvent afficher le même TVPI et raconter deux histoires opposées. Un TVPI de 2,5× avec un DPI de 1,4× est déjà très dérisqué. Un TVPI de 2,5× avec un DPI de 0,1× repose presque entièrement sur de la valeur résiduelle.

L'IRR ajoute une autre couche : il récompense les distributions rapides. Un petit retour très tôt peut produire un IRR spectaculaire, alors qu'un multiple massif mais lent peut sembler moins impressionnant. C'est pour cela qu'il faut toujours replacer l'IRR dans la [[j-curve|J-curve]], l'âge du fonds et le [[vintage|vintage]].

## Grille rapide

- DPI bas + TVPI haut : valeur prometteuse, mais encore peu prouvée en cash.
- DPI qui progresse : le fonds transforme la valeur latente en distributions, ce qui réduit le risque LP.
- IRR très élevé dans un fonds jeune : signal intéressant, mais fragile tant que le DPI reste faible.
- MOIC élevé avec IRR moyen : création de valeur réelle, mais sur un temps long.

## Lire entre les chiffres

Un LP expérimenté ne regarde jamais une seule métrique. Il croise DPI pour le réel, TVPI pour le potentiel, RVPI pour la part non encore réalisée, IRR pour le timing, et vintage pour le contexte de marché. Les chiffres mentent rarement, mais isolés, ils trompent souvent.`,keyTakeaways:["DPI juge le cash rendu ; RVPI juge la valeur encore latente ; TVPI additionne les deux.","Un TVPI élevé n'est solide que si le DPI progresse et si les valorisations latentes sont crédibles.","IRR mesure le timing ; MOIC et TVPI mesurent un multiple, donc ils ne répondent pas à la même question.","Toujours replacer les métriques dans le vintage, l'âge du fonds et la phase de J-curve."],quiz:[{question:"Quelle métrique mesure le cash réellement distribué aux LPs ?",options:[{text:"Le DPI",correct:!0},{text:"Le RVPI",correct:!1},{text:"Le TVPI",correct:!1}],explanation:"Le DPI rapporte les distributions déjà versées au capital appelé. C'est la métrique du cash effectivement rendu."},{question:"Un fonds affiche 0,45× de DPI et 1,75× de RVPI. Quelle lecture est la plus juste ?",options:[{text:"La valeur est majoritairement latente, le cash rendu reste limité",correct:!0},{text:"Le fonds a déjà remboursé tout son capital appelé",correct:!1},{text:"L'IRR est nécessairement faible",correct:!1}],explanation:"Le TVPI est élevé, mais il vient surtout du RVPI. Le fonds doit encore convertir cette valeur résiduelle en distributions."},{question:"Pourquoi comparer deux IRR sans regarder le vintage et l'âge du fonds est risqué ?",options:[{text:"Parce que le timing des flux et le contexte de marché peuvent amplifier la performance apparente",correct:!0},{text:"Parce que l'IRR ignore totalement les distributions",correct:!1},{text:"Parce que le vintage remplace toujours le DPI",correct:!1}],explanation:"L'IRR dépend fortement du calendrier des flux. Il doit être lu avec l'âge du fonds, la J-curve, le vintage et les multiples."}],furtherReading:[{label:"Lire TVPI, concentration et fund returner math",kind:"lesson",ref:"lpl-read-results"},{label:"Simulateur de fund returns (DPI/TVPI/MOIC)",kind:"simulator",ref:"fund-returns"}]},"le-narratif-de-levee":{body:`## Penser comme l'autre côté de la table

Pour bien lever, un fondateur doit comprendre ce qu'un VC cherche : un dossier qui peut faire **10× ou plus**, porté par une équipe crédible, sur un marché capable d'absorber une réussite démesurée. Présenter une entreprise « solide et rentable bientôt » peut séduire une banque ; cela laisse souvent un VC indifférent.

## L'anatomie d'un bon pitch

Un [[pitch-deck|deck]] efficace raconte une histoire en quelques mouvements : le problème, pourquoi il devient urgent maintenant ([[why-now|why now]]), la solution, la preuve (traction), le marché, l'équipe, et ce que la levée permettra d'accomplir. La clarté prime sur la beauté.

## Le mémo que le VC écrira pour vous

Un fondateur avisé facilite le travail de l'investisseur : il lui donne les éléments pour défendre le deal **en interne**, devant le comité. Plus votre narratif est clair, plus le VC peut le porter avec conviction face à ses associés. Lever, ce n'est pas convaincre une personne — c'est armer un allié qui devra convaincre les autres.`,keyTakeaways:["Le VC cherche du 10×+, pas une PME rentable.","Un deck raconte : problème, why now, solution, preuve, marché, équipe.","Armer le VC pour qu'il défende votre deal en interne."],quiz:[{question:"Que cherche un VC, contrairement à une banque ?",options:[{text:"Un dossier capable de faire 10x ou plus, pas une PME rentable",correct:!0},{text:"Une entreprise déjà rentable et peu risquée",correct:!1},{text:"Des garanties personnelles du fondateur",correct:!1}],explanation:"Présenter une entreprise « solide et bientôt rentable » séduit une banque, mais laisse souvent un VC indifférent."},{question:"Que signifie « armer un allié » quand on lève des fonds ?",options:[{text:"Donner au VC les éléments pour défendre le deal en interne, devant son comité",correct:!0},{text:"Offrir des garanties juridiques supplémentaires",correct:!1},{text:"Accepter toutes les conditions de la term sheet",correct:!1}],explanation:"Lever, ce n'est pas convaincre une personne, mais armer quelqu'un qui devra convaincre ses associés."}],furtherReading:[]},"safe-priced-round-et-dilution":{body:`## SAFE ou priced round ?

Au tout début, on lève souvent via un [[safe|SAFE]] (ou son cousin français le BSA-AIR) : un instrument simple et rapide qui reporte la valorisation au tour suivant, moyennant un **cap** et/ou un **discount**. Il évite la lourdeur juridique d'un tour avec actions (*priced round*), mais empile des conversions futures qu'il faut suivre de près.

Le **priced round** fixe une valorisation et émet des actions immédiatement. Plus lourd, mais plus clair sur la [[cap-table|cap table]].

## La dilution s'accumule

À chaque tour, les fondateurs cèdent une part. Une cession de 20 % au seed, puis 20 % en Series A, puis 15 % en Series B ne fait pas 55 % : les pourcentages se **composent** sur une base qui diminue. Le danger n'est pas un tour isolé, mais l'**empilement** sur la trajectoire complète — sans compter le pool d'options ([[esop|ESOP]]) qui dilue encore.

## Négocier sans casser la relation

Une levée crée une relation de dix ans. Sur-optimiser la valorisation d'un tour peut coûter cher plus tard : une valorisation trop haute crée la menace du *down round*, et des termes trop agressifs côté fondateur peuvent éloigner les meilleurs investisseurs. L'objectif n'est pas de gagner la négociation, mais de **construire un attelage durable**.`,keyTakeaways:["SAFE/BSA-AIR : rapide, reporte la valorisation (cap + discount).","La dilution se compose sur plusieurs tours, plus l'ESOP.","Sur-optimiser un tour peut détruire de la valeur à long terme."],quiz:[{question:"Pourquoi des dilutions de 20 %, 20 % puis 15 % ne s'additionnent-elles pas à 55 % ?",options:[{text:"Les pourcentages se composent sur une base qui diminue à chaque tour",correct:!0},{text:"Parce qu'une partie de la dilution est remboursée",correct:!1},{text:"Parce que seul le dernier tour compte vraiment",correct:!1}],explanation:"Le danger n'est pas un tour isolé mais l'empilement sur toute la trajectoire, sans compter l'ESOP."},{question:"Qu'est-ce qu'un SAFE (ou son équivalent français le BSA-AIR) ?",options:[{text:"Un instrument rapide qui reporte la valorisation au tour suivant, via un cap et/ou un discount",correct:!0},{text:"Une dette assortie d'un taux d'intérêt et d'une échéance",correct:!1},{text:"Une émission immédiate d'actions à une valorisation fixée",correct:!1}],explanation:"Il évite la lourdeur d'un priced round, mais empile des conversions futures qu'il faut suivre de près."}],furtherReading:[{label:"Simulateur de dilution",kind:"simulator",ref:"dilution"}]},"pre-post-money-et-ownership":{body:`## La formule que tout le reste réutilise

En VC, beaucoup de calculs commencent par une égalité simple : **post-money = pre-money + montant investi**. La part de l'investisseur est ensuite : **montant investi / post-money**.

Exemple : une startup lève 4 M€ sur 12 M€ de [[pre-money|pre-money]]. La post-money vaut 16 M€. L'investisseur achète 4 / 16 = **25 %** de la société. Les actionnaires existants conservent 75 % de ce qu'ils détenaient avant le tour.

## Lire l'ownership cible

Un fonds ne raisonne pas seulement en ticket. Il raisonne en [[fund-returner|capacité à rendre le fonds]]. S'il investit 4 M€ et veut 15 % d'ownership, la post-money implicite est : 4 / 15 % = **26,7 M€**. La pre-money implicite est donc 22,7 M€.

Ce calcul permet de traduire une phrase floue (« on veut 12-15 % ») en valorisation réelle. En entretien, c'est souvent ce qu'on attend : passer du vocabulaire au chiffre.

## Le piège classique

Ne divise jamais le montant investi par la pre-money pour calculer la part investisseur. 4 / 12 = 33 %, mais l'investisseur ne prend pas 33 % : il prend 4 / 16 = 25 %. La base correcte est toujours la post-money.

## Réflexe entretien

Annonce la formule avant le résultat : « post = pre + investment ; ownership = investment / post ». Même si le chiffre final est simple, tu montres que ton raisonnement est propre.`,keyTakeaways:["post-money = pre-money + montant investi.","Part investisseur = montant investi / post-money.","Une ownership cible se traduit directement en valorisation implicite."],quiz:[{question:"Une startup lève 5 M€ sur 15 M€ pre-money. Quelle part prend l'investisseur ?",options:[{text:"25 %",correct:!0},{text:"33 %",correct:!1},{text:"20 %",correct:!1}],explanation:"La post-money vaut 20 M€. L'investisseur prend 5 / 20 = 25 %."}],furtherReading:[{label:"Pre-money / Post-money",kind:"simulator",ref:"pre-post-money"},{label:"Ownership & cap table",kind:"simulator",ref:"ownership"}]},"dilution-cap-table-et-option-pool":{body:`## La dilution se compose

La [[dilution|dilution]] n'est pas une addition simple. Si un fondateur possède 60 %, puis subit 20 % de dilution au seed, il tombe à 48 %. S'il subit ensuite 25 % de dilution en Série A, il ne tombe pas à 23 % : il tombe à 48 % x 75 % = **36 %**.

La formule utile est : **part après = part avant x (1 - dilution du tour)**.

## Lire une cap table sans paniquer

Une [[cap-table|cap table]] raconte qui possède quoi avant et après le tour : fondateurs, salariés, investisseurs existants, nouveaux investisseurs. Le test n'est pas de connaître chaque ligne juridique ; c'est de voir qui est dilué, qui est protégé, et si les fondateurs restent suffisamment motivés.

## L'option pool shuffle

Le piège fréquent : créer ou augmenter l'[[esop|ESOP]] en pre-money. Si un investisseur demande un pool de 10 % avant son investissement, ce pool est supporté par les actionnaires existants, pas par le nouvel investisseur. La valorisation affichée peut donc être flatteuse tout en transférant plus de dilution aux fondateurs.

Exemple simplifié : fondateur à 50 %, tour de 25 % pour l'investisseur. Sans ESOP, il finit à 37,5 %. Avec un ESOP pré-money qui dilue les existants avant le tour, il finit plus bas. En entretien, l'important est de repérer le mécanisme, puis de poser la séquence : pool d'abord, investissement ensuite.

## Le bon réflexe

Demande toujours : la cap table est-elle calculée **fully diluted** ? Le pool est-il créé pre-money ou post-money ? Ces deux mots changent le vrai prix du deal.`,keyTakeaways:["La dilution se compose : part après = part avant x (1 - dilution du tour).","Un ESOP pre-money dilue les actionnaires existants avant l'entrée du nouvel investisseur.","La question fully diluted / pre-money / post-money change le vrai prix du tour."],quiz:[{question:"Un fondateur possède 60 %, puis subit 20 % de dilution, puis 25 %. Quelle est sa part finale ?",options:[{text:"36 %",correct:!0},{text:"15 %",correct:!1},{text:"45 %",correct:!1}],explanation:"La dilution se compose : 60 % x 80 % x 75 % = 36 %."}],furtherReading:[{label:"Simulateur de dilution",kind:"simulator",ref:"dilution"},{label:"Ownership & cap table",kind:"simulator",ref:"ownership"}]},"market-sizing-tam-sam-som":{body:`## Les trois cercles

Le [[tam-sam-som|TAM/SAM/SOM]] sert à passer d'un marché théorique à une opportunité réellement adressable.

- **TAM** : toute la demande possible si le produit dominait le monde pertinent.
- **SAM** : la demande réellement servable avec le produit, le prix, la géographie et le canal actuels.
- **SOM** : la part capturable à horizon 3-5 ans.

## Pourquoi le bottom-up gagne

Un sizing top-down pur ressemble souvent à : « le marché vaut 10 Md€, donc 1 % suffit ». C'est rapide, mais paresseux. En VC early-stage, on préfère le bottom-up : nombre de clients réalistes x prix annuel x taux de pénétration.

Exemple : SaaS pour restaurants en France. 150 000 restaurants x 40 % adressables x 1 200 €/an = **72 M€ de SAM**. Si la société peut prendre 8 % en cinq ans, le SOM vaut environ **5,8 M€ d'ARR**.

## Challenger sans te perdre

Une bonne réponse donne un ordre de grandeur et montre sa sensibilité. Si le prix annuel tombe de 1 200 € à 600 €, le SAM tombe à 36 M€. Si le taux adressable est 25 % au lieu de 40 %, le SAM tombe à 45 M€. Tu ne cherches pas la précision comptable ; tu cherches la robustesse de l'opportunité.

## Phrase utile en entretien

« Je pars en bottom-up, puis je ferai une contre-vérification top-down. Mes hypothèses sont approximatives, donc je vais les rendre visibles. » Cette phrase rassure : tu n'essaies pas de deviner un chiffre magique, tu construis un raisonnement.`,keyTakeaways:["TAM = tout, SAM = servable, SOM = capturable.","Le bottom-up est le standard : clients x prix x pénétration.","Un bon sizing montre la sensibilité aux hypothèses clés."],quiz:[{question:"Une boîte cible 60 000 clients à 1 200 €/an. Quel est son SAM ?",options:[{text:"72 M€",correct:!0},{text:"5 M€",correct:!1},{text:"720 M€",correct:!1}],explanation:"60 000 x 1 200 € = 72 000 000 €, soit 72 M€ de SAM."}],furtherReading:[{label:"Dimensionner un marché en entretien",kind:"lesson",ref:"lea-market-sizing"}]},"unit-economics-cac-ltv-payback-rule-of-40":{body:`## Le test de base

Les unit economics répondent à une question simple : chaque client gagné crée-t-il plus de valeur qu'il ne coûte ? En SaaS, le noyau est : [[cac|CAC]], [[ltv|LTV]], marge brute, payback et rétention.

Un repère classique : **LTV/CAC > 3** et payback inférieur à 12-18 mois. Ce n'est pas une loi physique, mais un signal de répétabilité. Si une société achète sa croissance avec un CAC trop élevé et une rétention faible, elle remplit un seau percé.

## Ne jamais lire la croissance seule

Une croissance de 20 % par mois peut être excellente ou dangereuse. Si le [[nrr|NRR]] dépasse 100 %, la base client grossit même avant les nouveaux clients. Si le churn est élevé et que le CAC augmente, la croissance masque une fuite.

## Rule of 40

La [[rule-of-40|Rule of 40]] additionne croissance annuelle et marge opérationnelle. 60 % de croissance avec -20 % de marge donne 40 : acceptable pour une scale-up. 25 % de croissance avec -40 % de marge donne -15 : le capital est mal converti.

## Burn et runway

Le [[burn-rate|burn]] et le [[runway|runway]] traduisent l'efficacité du capital en temps. Une société peut avoir de bons ratios unitaires mais trop peu de runway pour atteindre le prochain jalon. En entretien, relie toujours les métriques au stade : les attentes seed ne sont pas celles d'une Série B.`,keyTakeaways:["LTV/CAC > 3 et payback < 12-18 mois sont des repères, pas des dogmes.","La croissance doit être lue avec la rétention, le CAC et la marge brute.","La Rule of 40 relie croissance et discipline économique."],quiz:[{question:"Une société croît de 55 % par an avec une marge opérationnelle de -10 %. Son score Rule of 40 est…",options:[{text:"45",correct:!0},{text:"65",correct:!1},{text:"-45",correct:!1}],explanation:"Rule of 40 = croissance + marge opérationnelle = 55 + (-10) = 45."}],furtherReading:[{label:"Traction & unit economics",kind:"lesson",ref:"l-traction-unit-economics"}]},"returns-moic-irr-dpi-tvpi-waterfall":{body:`## MOIC et IRR ne racontent pas la même chose

Le [[moic|MOIC]] mesure un multiple : 2x, 5x, 10x. Il ignore le temps. L'[[irr|IRR]] annualise le rendement et dépend fortement du calendrier des flux. 3x en 3 ans est très différent de 3x en 10 ans.

Raccourci utile : si on te demande de comparer deux retours, demande toujours l'horizon. Sans durée, MOIC et IRR ne sont pas comparables.

## DPI, TVPI et valeur latente

Au niveau fonds, le [[dpi|DPI]] mesure le cash déjà rendu. Le [[tvpi|TVPI]] additionne cash rendu et valeur résiduelle. Un TVPI élevé avec DPI faible peut être prometteur, mais encore fragile : la valeur n'est pas convertie en distributions.

## Waterfall et liquidation preference

La [[liquidation-preference|liquidation preference]] change la répartition à l'exit. Avec une préférence 1x non-participating, l'investisseur choisit généralement entre récupérer sa mise ou convertir en actions ordinaires si cela paie mieux. Avec des droits participating ou une seniority agressive, la [[exit-waterfall|waterfall]] peut transférer beaucoup de valeur aux investisseurs avant que les common reçoivent quelque chose.

## Exemple rapide

Un investisseur met 5 M€ pour 25 %. Exit à 12 M€. Sans préférence, il touche 3 M€. Avec une liquidation preference 1x, il touche 5 M€. À 40 M€ d'exit, sa conversion vaut 10 M€, donc il convertit. La préférence protège le downside ; elle change surtout les exits modestes.

## Le lien avec l'ownership cible

Un fonds vise une part suffisante parce qu'un gros exit doit compter au niveau du véhicule. Si le fonds fait 100 M€ et possède 5 % d'une sortie à 500 M€, il reçoit 25 M€ : très bien pour la ligne, mais pas forcément un fund returner. Les maths du VC relient toujours ticket, ownership, exit possible et taille du fonds.`,keyTakeaways:["MOIC mesure le multiple ; IRR mesure le multiple annualisé dans le temps.","DPI = cash rendu ; TVPI = cash rendu + valeur latente.","La liquidation preference change surtout les exits modestes."],quiz:[{question:"Un investisseur met 5 M€ pour 25 %. Exit à 12 M€ avec liquidation preference 1x non-participating. Que choisit-il ?",options:[{text:"Récupérer 5 M€ via la préférence",correct:!0},{text:"Convertir pour toucher 3 M€",correct:!1},{text:"Toucher 12 M€",correct:!1}],explanation:"Sa conversion vaut 25 % x 12 M€ = 3 M€. La préférence 1x lui rend 5 M€, donc elle est meilleure."}],furtherReading:[{label:"Fund returns : DPI / TVPI / MOIC",kind:"simulator",ref:"fund-returns"},{label:"Waterfall simplifiée",kind:"simulator",ref:"waterfall"}]},"les-echelons-du-venture":{body:`## Une progression de responsabilité

Entrer dans le venture, c'est entrer par l'**exécution** et progresser vers la **décision**. Les attentes par échelon :

- **Analyst** : produire de la matière fiable — recherche de marché, sourcing, modèles. On juge votre rigueur et votre curiosité.
- **Associate** : autonomie sur la DD et les mémos, suivi de participations. On juge votre jugement émergent et votre fiabilité.
- **Principal** : porter des deals, siéger à des boards, défendre des convictions. On juge votre capacité à décider et à entraîner.
- **Partner** : engager le fonds, lever auprès des LPs, détenir le [[carry|carry]]. On juge votre track record et votre réseau.

## La transition critique

La marche la plus difficile est celle du **droit de signer** : passer de « je prépare la décision » à « j'assume la décision, succès ou échec ». Beaucoup d'excellents associates n'y accèdent jamais, non par manque de technique, mais par manque de **jugement propriétaire** et de conviction assumée.

## Patience structurelle

Le métier se juge sur des cycles de dix ans. Un investissement fait aujourd'hui ne révèle son résultat que dans une décennie. La progression de carrière épouse cette lenteur : la patience n'est pas une vertu accessoire, c'est une compétence centrale.`,keyTakeaways:["On progresse de l'exécution (analyst) vers la décision (partner).","La marche clé : acquérir le droit de signer et l'assumer.","Le métier se juge sur dix ans ; la patience est une compétence."],quiz:[{question:"Quelle est la transition de carrière la plus difficile dans le venture ?",options:[{text:"Acquérir et assumer le droit de signer une décision",correct:!0},{text:"Passer du sourcing à la modélisation",correct:!1},{text:"Obtenir un premier siège d'observateur au board",correct:!1}],explanation:"Beaucoup d'excellents associates n'y accèdent jamais, faute de jugement propriétaire et de conviction assumée."},{question:"Pourquoi la patience est-elle une compétence centrale dans ce métier ?",options:[{text:"Un investissement ne révèle son résultat que sur des cycles d'environ dix ans",correct:!0},{text:"Parce que les promotions sont rares et lentes",correct:!1},{text:"Parce que les LPs imposent des reportings espacés",correct:!1}],explanation:"La progression de carrière épouse la lenteur du métier : on est jugé sur dix ans, pas sur dix jours."}],furtherReading:[]},"entrer-dans-un-fonds":{body:`## Les portes d'entrée

Il n'existe pas de voie unique vers le venture. Les profils fréquents : anciens fondateurs ou operators, consultants et banquiers (pour la rigueur analytique), experts sectoriels profonds, et profils techniques. Le point commun des bons candidats : une **compréhension réelle du métier** et un **angle propre** — une thèse, un réseau, une expertise que le fonds n'a pas.

## Se rendre visible

Le venture recrute beaucoup par réseau et réputation. Écrire publiquement (thèses, analyses), sourcer des deals utiles pour un fonds, ou aider des fondateurs : autant de moyens de **démontrer** plutôt que de revendiquer. Le scout-ing — repérer des startups pour un fonds — est une porte d'entrée classique.

## Préparer l'entretien VC

Les entretiens comportent souvent des exercices spécifiques :

- **Stock pitch / deal memo** : présenter une startup que vous financeriez, et défendre la thèse.
- **Market sizing** : estimer un marché à voix haute, en assumant ses hypothèses.
- **Cas de cap table / dilution** : raisonner sur une structure de deal.
- **« Pourquoi le venture, pourquoi nous »** : montrer que vous comprenez la thèse et la culture du fonds.

Le meilleur entraînement : penser comme un investisseur au quotidien, sur de vraies entreprises, avant même d'en être un.`,keyTakeaways:["Pas de voie unique ; ce qui compte, c'est un angle propre.","Démontrer (écrire, sourcer, scouter) plutôt que revendiquer.","Préparer deal memo, market sizing et cas de cap table."],quiz:[{question:"Qu'ont en commun les bons candidats à un poste en venture ?",options:[{text:"Une compréhension réelle du métier et un angle propre (thèse, réseau, expertise)",correct:!0},{text:"Un diplôme identique d'une grande école",correct:!1},{text:"Une expérience préalable obligatoire en fonds",correct:!1}],explanation:"Le venture recrute par réseau et réputation ; mieux vaut démontrer (écrire, sourcer, scouter) que revendiquer."},{question:"Quel exercice est typique d'un entretien VC ?",options:[{text:"Présenter un deal memo et défendre la thèse d'une startup qu'on financerait",correct:!0},{text:"Réciter les définitions du glossaire financier",correct:!1},{text:"Passer un test de personnalité standardisé",correct:!1}],explanation:"On retrouve souvent un stock pitch, un market sizing à voix haute et un cas de cap table."}],furtherReading:[]},"la-carte-de-l-entonnoir":{body:`## Les tours d'un process analyst

Un process analyst comporte trois à quatre tours.

- **Tour 1 — fit.** Le candidat doit montrer sa motivation, sa compréhension du capital-risque et sa connaissance du fonds. Une réponse précise et documentée est attendue.
- **Tour 2 — technique et analytique.** Le candidat analyse un business model, identifie les bonnes questions et raisonne en situation d'incertitude. Le raisonnement compte autant que la conclusion.
- **Tour 3 — case study.** Remis à l'avance ou traité en direct, il demande une recommandation argumentée : un avis « investir » ou « passer », accompagné de trois risques classés par importance.
- **Tour 4 — équipe et partners.** Ce tour porte sur la compatibilité culturelle, la motivation de long terme et, parfois, la rémunération.

## Trois points à connaître

- Le case study apparaît dans environ 70 % des process. Il intervient tard et détermine souvent l'issue du recrutement.
- Le fit est éliminatoire dès le premier tour. Un candidat techniquement solide mais peu motivé est écarté avant d'avoir pu démontrer ses compétences.
- L'exercice purement technique, comme un modèle Excel détaillé, est rare en early-stage. L'évaluation porte d'abord sur le jugement.

Le format du case study, une page ou quatre slides, doit être choisi avant l'entretien. Se présenter sans format défini fait perdre une vingtaine de minutes sur la forme.`,keyTakeaways:["Chaque tour a un examinateur et un critère.","Fit d'abord, cerveau d'investisseur ensuite, livrable au bout.","Le case (~70 % des process) arrive tard : prépare-le."],bodyShort:`## La structure du process

Un process analyst compte trois à quatre tours : le fit (la motivation et la connaissance du fonds), un tour technique et analytique (le jugement d'investisseur), un case study (une recommandation défendable) et un tour équipe (la conviction de long terme).

Trois points méritent l'attention. Le case study apparaît dans environ 70 % des process et intervient tard, souvent comme épreuve décisive. Le fit est éliminatoire dès le premier tour. L'exercice purement technique reste rare en early-stage, où l'évaluation porte avant tout sur le raisonnement.

Le format du case, une page ou quatre slides, se choisit avant l'entretien.`,quiz:[{question:"À quel moment arrive généralement le case study dans un process VC ?",options:[{text:"Tard, au 3e tour et au-delà",correct:!0},{text:"Dès le premier appel de screening",correct:!1},{text:"Il n'y en a jamais pour un analyst",correct:!1}],explanation:"Le case apparaît dans ~70 % des process et arrive tard : c'est souvent l'épreuve décisive."},{question:"Quelle erreur fait perdre un temps précieux le jour du case study ?",options:[{text:"Arriver sans avoir choisi son format (1-pager ou 4 slides)",correct:!0},{text:"Avoir préparé une recommandation",correct:!1},{text:"Connaître la thèse du fonds",correct:!1}],explanation:"Sans format décidé à l'avance, on perd une vingtaine de minutes sur la forme au lieu du fond."}],furtherReading:[{label:"Le deal qui divise le comité : Volta au seed",kind:"case",ref:"cs-seed-ic"}]},"la-grille-de-l-investisseur":{body:`## La grille universelle

Tout dossier s'évalue avec cinq piliers : **Équipe · Marché · Produit · Traction · Moat**, auxquels s'ajoutent le Deal et le Timing. Une seule faiblesse peut suffire à écarter un dossier.

- **Équipe.** C'est le premier facteur en early-stage. L'évaluation porte sur l'expertise du domaine, le [[founder-market-fit|founder-market fit]], la ténacité et la capacité du fondateur à trouver une solution en toutes circonstances.
- **Marché.** C'est là que la plupart des dossiers sont écartés. Il doit être venture-scale, c'est-à-dire assez grand pour rendre le fonds à lui seul ([[fund-returner|fund-returner]]), souvent au moins 1 Md€ de [[tam|TAM]]. Un marché petit, commoditisé ou en déclin conduit à un pass par défaut. Le [[why-now|why now]] doit être étayé.
- **Produit.** Il doit être nettement supérieur à l'existant, et non marginalement meilleur. Il répond à un vrai problème plutôt qu'à un simple confort.
- **Traction.** Les attentes augmentent à chaque stade. Au pré-seed, on attend des signaux ; au seed, des revenus et de la rétention ; en Série A, un [[pmf|PMF]] prouvé.
- **Moat.** Il répond à une question : qu'est-ce qui empêche un concurrent bien financé de copier ? Les sources possibles sont les effets de réseau, la donnée, la régulation, les coûts de changement et la complexité. Il doit pouvoir s'énoncer en une phrase.

## Mini-exercice corrigé : livraison de repas bio, Lyon, pré-seed

- **Équipe** : deux anciens de Deliveroo et un chef. Le founder-market fit est fort.
- **Marché** : la livraison de repas est commoditisée et a consommé beaucoup de capital. C'est un point de vigilance.
- **Produit** : le positionnement « bio et local » n'apporte qu'un écart marginal.
- **Traction** : 800 commandes par semaine et une rétention de 35 % au troisième mois. C'est correct.
- **Moat** : faible.

**Verdict : pass.** Le dossier est écarté sur le marché et le moat, pas sur l'équipe.`,keyTakeaways:["Équipe, Marché, Produit, Traction, Moat — une faiblesse peut suffire.","Le marché est le tueur n°1 des dossiers.","Déroule la grille à voix haute sur toute question."],bodyShort:`## La grille universelle

Tout dossier s'évalue avec cinq piliers : **Équipe · Marché · Produit · Traction · Moat**, auxquels s'ajoutent le Deal et le Timing. Une seule faiblesse peut suffire à écarter un dossier.

- **Équipe.** C'est le premier facteur en early-stage : [[founder-market-fit|founder-market fit]], ténacité et capacité à avancer en toutes circonstances.
- **Marché.** C'est là que la plupart des dossiers sont écartés. Il doit être assez grand pour rendre le fonds ([[fund-returner|fund-returner]]).
- **Produit.** Il doit être nettement supérieur à l'existant, pas marginalement meilleur.
- **Traction.** Les attentes augmentent à chaque stade de financement.
- **Moat.** Qu'est-ce qui empêche un concurrent bien financé de copier ?`,quiz:[{question:"En early-stage, quel facteur pèse le plus dans la décision ?",options:[{text:"L'équipe",correct:!0},{text:"Un produit déjà fini",correct:!1},{text:"La valorisation",correct:!1}],explanation:"Au pré-seed et au seed, l'évaluation porte d'abord sur l'équipe : expertise du domaine, ténacité et capacité d'exécution du fondateur."},{question:"Sur quel pilier la majorité des dossiers sont-ils écartés ?",options:[{text:"Le marché (trop petit, commoditisé ou déclinant)",correct:!0},{text:"Le design du produit",correct:!1},{text:"Le nom de la société",correct:!1}],explanation:"Le marché est le motif d'élimination le plus fréquent. Il doit être venture-scale, c'est-à-dire assez grand pour rendre le fonds."}],furtherReading:[{label:"Lire une startup : équipe & marché",kind:"lesson",ref:"l-team-market"}]},"dimensionner-un-marche":{body:`## Les trois cercles

- **[[tam|TAM]]** : toute la demande possible, sans contrainte.
- **[[sam|SAM]]** : la part servable compte tenu du produit, du prix, de la zone géographique et du go-to-market.
- **[[som|SOM]]** : la part captée de façon réaliste en trois à cinq ans.

## Deux méthodes

Le top-down part d'une donnée macro issue d'un rapport, à laquelle on applique des filtres. La méthode est rapide, mais les investisseurs s'en méfient car elle se gonfle facilement (« 1 % d'un marché de 100 Md€ »). Le bottom-up part d'un client multiplié par un volume : c'est le standard en early-stage. Le dimensionnement se mène toujours en bottom-up, puis se contre-vérifie en top-down. Une convergence des deux méthodes à ±15 % indique des hypothèses solides.

## Exemple 1 : SaaS pour restaurants, France

Environ 150 000 restaurants cibles, dont 40 % adressables, soit 60 000 établissements. À 1 200 € par an, le SAM ressort à 72 M€. À cinq ans, en captant 8 %, le SOM atteint environ 5,8 M€ d'ARR. Le contrôle top-down est cohérent avec un segment français de quelques dizaines de millions d'euros.

## Exemple 2 : application de coaching sportif B2C, Europe

50 millions d'utilisateurs cibles, dont 3 % de conversion payante, soit 1,5 million d'abonnés. À 80 € par an, le SAM ressort à 120 M€. À trois ans, en captant 5 %, le SOM atteint environ 6 M€.

## Les erreurs fréquentes

Quatre erreurs reviennent souvent : se limiter au top-down, confondre le TAM et le SAM, laisser des hypothèses implicites et omettre le why-now. Les hypothèses doivent être annoncées et l'ordre de grandeur testé : si l'ARPU est deux fois plus bas, le SAM tombe à 36 M€, et la question du caractère venture-scale se repose.`,keyTakeaways:["TAM (tout) → SAM (servable) → SOM (3-5 ans).","Mène en bottom-up, contre-vérifie en top-down.","Annonce tes hypothèses à voix haute — c'est ce qu'on évalue."],bodyShort:`## Dimensionner un marché en bottom-up

Le dimensionnement repose sur trois cercles :

- **[[tam|TAM]]** : la demande totale possible.
- **[[sam|SAM]]** : la part réellement servable avec le produit, le prix et la zone visés.
- **[[som|SOM]]** : la part captée de façon réaliste en trois à cinq ans.

La méthode de référence en early-stage est le bottom-up : on part d'un client et d'un volume, puis on contre-vérifie en top-down. Les investisseurs se méfient du top-down seul, trop facile à gonfler. Les hypothèses doivent être énoncées explicitement, car c'est sur elles que porte l'évaluation. Une fois l'ordre de grandeur posé, il faut le tester : si l'ARPU est deux fois plus bas, le marché reste-t-il venture-scale ?`,quiz:[{question:"Quelle méthode de market sizing privilégier en early-stage ?",options:[{text:"Bottom-up (et contre-vérifier en top-down)",correct:!0},{text:"Top-down uniquement",correct:!1},{text:"Aucune, on cite un rapport",correct:!1}],explanation:"Les investisseurs se méfient du top-down (facile à gonfler). Le bottom-up, ancré sur des unités réelles, est le standard."},{question:"À quelle marge la convergence bottom-up / top-down indique-t-elle des hypothèses solides ?",options:[{text:"Environ ±15 %",correct:!0},{text:"±50 %",correct:!1},{text:"Peu importe, seul le top-down compte",correct:!1}],explanation:"Quand les deux méthodes convergent à ±15 %, c'est un bon signe que les hypothèses tiennent."}],furtherReading:[{label:"Cas : un market sizing déroulé en direct",kind:"case",ref:"cs-market-sizing-live"}]},"lire-une-startup-unit-economics":{body:`## Les métriques à lire et à commenter

- **Croissance.** On la mesure en MoM en early-stage (15-20 % par mois constitue un bon niveau au seed), puis en YoY ensuite.
- **Rétention.** C'est la métrique principale : les cohortes doivent se stabiliser plutôt que tendre vers zéro. En SaaS, un [[nrr|NRR]] supérieur à 100 % signifie que la base se densifie d'elle-même.
- **Unit economics.** On examine le [[cac|CAC]], la [[ltv|LTV]], le ratio LTV/CAC (sain au-dessus de 3), le CAC payback (inférieur à 12-18 mois) et la [[gross-margin|marge brute]] (un « SaaS » à 40 % de marge n'en est pas réellement un).
- **Efficience du capital.** Elle se lit dans le [[burn-rate|burn]], le [[runway|runway]] et la [[rule-of-40|Rule of 40]], qui additionne la croissance et la marge en pourcentage pour un total attendu d'au moins 40.

## La barre par stade

| Stade | Ce qu'on attend | Repère 2026 |
|---|---|---|
| Pré-seed | Signaux de demande | waitlist, pilotes, beta actifs |
| Seed | Revenus + rétention | ~0,1-0,5 M€ d'[[arr|ARR]] |
| Série A | PMF prouvé | ~2,5 M€ d'ARR, LTV/CAC > 3 |

Une question fréquente consiste à présenter une croissance de 30 % par mois et à demander si elle suffit à investir. La réponse dépend de la rétention et du CAC : une croissance financée par une acquisition payante non rentable, assortie d'un churn élevé, équivaut à un seau percé. Les cohortes doivent être examinées avant toute conclusion.`,keyTakeaways:["Croissance ET rétention, jamais l'une sans l'autre.","LTV/CAC > 3, CAC payback < 18 mois.","La barre de traction monte à chaque stade."],bodyShort:`## Les chiffres qui comptent

- **Croissance et rétention** s'examinent ensemble, jamais l'une sans l'autre. Une croissance financée par l'acquisition payante avec un churn élevé revient à remplir un seau percé.
- **Les unit economics** doivent tenir : un ratio [[ltv|LTV]]/[[cac|CAC]] supérieur à 3, un [[cac|CAC]] payback inférieur à 12-18 mois et une [[gross-margin|marge brute]] saine.
- **L'efficience du capital** se lit dans le [[burn-rate|burn]], le [[runway|runway]] et la [[rule-of-40|Rule of 40]].

La barre de traction s'élève à chaque stade : des signaux au pré-seed, des revenus et de la rétention au seed, un [[pmf|PMF]] prouvé en Série A. Devant une croissance forte, les premières données à demander sont les cohortes de rétention et le CAC.`,quiz:[{question:"Une croissance forte mais avec un churn élevé, c'est…",options:[{text:"Un seau percé",correct:!0},{text:"Un signal suffisant pour investir",correct:!1},{text:"Sans importance au early-stage",correct:!1}],explanation:"Sans rétention, la croissance ne fait que remplir un seau percé. On regarde toujours les cohortes."},{question:"Quel repère sain attend-on pour le ratio LTV/CAC ?",options:[{text:"Supérieur à 3",correct:!0},{text:"Inférieur à 1",correct:!1},{text:"Exactement 1",correct:!1}],explanation:"LTV/CAC > 3 et un CAC payback < 12-18 mois sont les repères d'une acquisition économiquement saine."}],furtherReading:[{label:"Traction & unit economics",kind:"lesson",ref:"l-traction-unit-economics"}]},"les-questions-techniques":{body:`## Cap table et dilution

Un exemple courant : une fondatrice détient 50 % avant une Série A et lève 5 M€ sur une pre-money de 15 M€.

- Le post-money s'établit à 15 + 5 = 20 M€.
- La part de l'investisseur est de 5 / 20 = 25 %.
- La fondatrice conserve 50 % × (1 − 25 %) = 37,5 %.
- L'[[esop|option pool]] constitue un piège : créé à hauteur de 10 % en pre-money, il dilue les actionnaires existants et fait passer la fondatrice sous 37,5 %.

La formule clé est : part de l'investisseur = montant ÷ post-money. Les simulateurs \`pre-post-money\`, \`ownership\` et \`dilution\` permettent de s'exercer.

## Returns

- Le [[moic|MOIC]] mesure combien de fois la mise est multipliée. Il est simple mais ignore le temps.
- L'[[irr|IRR]] est un rendement annualisé qui intègre le temps : 3× en 3 ans vaut bien davantage que 3× en 10 ans.
- Le [[dpi|DPI]] mesure le réalisé, le [[tvpi|TVPI]] le réalisé augmenté du latent.
- En lien avec la power-law, chaque ligne doit pouvoir rendre le fonds, ce qui suppose des cibles d'ownership de 10-20 % et du [[follow-on|follow-on]].

## Term sheet, au niveau analyst

L'objectif est de comprendre, non de négocier. Les clauses à connaître sont la [[liquidation-preference|liquidation preference]] (1× non-participating est une clause saine), l'[[anti-dilution|anti-dilution]], le [[pro-rata|pro-rata]] et le [[vesting|vesting]]. Il suffit de savoir qui touche quoi.

Une question fréquente oppose un IRR de 30 % à un MOIC de 5×. La comparaison dépend de l'horizon : 5× sur 10 ans correspond à environ 17 % d'IRR, tandis que 30 % d'IRR sur 4 ans correspond à environ 2,9×. Sans la durée, les deux mesures ne se comparent pas.`,keyTakeaways:["post-money = pre + montant ; part = montant / post-money.","Méfie-toi de l'option pool shuffle.","IRR intègre le temps, MOIC non."],bodyShort:`## Les calculs qui tombent en entretien

- **Cap table et dilution.** Le post-money égale la pre-money augmentée du montant levé ; la part de l'investisseur égale le montant divisé par le post-money. L'[[esop|option pool]] shuffle mérite attention : créé en pre-money, il dilue les actionnaires existants.
- **Returns.** Le [[moic|MOIC]] indique combien de fois la mise est multipliée mais ignore le temps ; l'[[irr|IRR]] est annualisé et intègre le temps. Sans l'horizon, les deux ne se comparent pas.
- **Term sheet.** Au niveau analyst, il s'agit de comprendre la [[liquidation-preference|liquidation preference]], le [[pro-rata|pro-rata]] et le [[vesting|vesting]], c'est-à-dire de savoir qui touche quoi, sans négocier.

Aucun modèle Excel détaillé n'est attendu en early-stage, mais ces calculs doivent être maîtrisés de mémoire.`,quiz:[{question:"Un fondateur détient 50 %, lève 4 M€ sur 12 M€ pre-money. Sa part après le tour ?",options:[{text:"37,5 %",correct:!0},{text:"50 %",correct:!1},{text:"25 %",correct:!1}],explanation:"Post-money = 16 M€ ; l'investisseur prend 4/16 = 25 % ; le fondateur : 50 % × 0,75 = 37,5 %."},{question:"Pourquoi créer un option pool en pre-money pénalise-t-il la fondatrice ?",options:[{text:"Le pool dilue les actionnaires existants avant l'entrée de l'investisseur",correct:!0},{text:"Il augmente la valorisation post-money",correct:!1},{text:"Il n'a aucun effet sur la cap table",correct:!1}],explanation:"L'option pool shuffle : créé en pre-money, le pool est supporté par les actionnaires existants, ce qui dilue la fondatrice au-delà du calcul naïf."}],furtherReading:[{label:"Ownership & cap table",kind:"simulator",ref:"ownership"},{label:"Fund returns : DPI / TVPI / MOIC",kind:"simulator",ref:"fund-returns"},{label:"Pre-money / Post-money",kind:"simulator",ref:"pre-post-money"}]},"le-deal-memo":{body:`## La structure attendue

En screening, le deal memo tient en une page (400 à 600 mots). Sa structure :

1. **Recommandation** (invest ou pass), en haut, en une phrase.
2. **L'entreprise** : quoi, pour qui, quel problème.
3. **Le marché** : taille bottom-up, croissance, why-now.
4. **L'équipe** : pourquoi elle.
5. **La traction** : chiffres clés.
6. **Business model et économie** : unit economics.
7. **Les trois risques** hiérarchisés, avec leurs mitigations.
8. **Le deal** : montant, stade, valorisation, ownership.

Les correcteurs attendent une recommandation assumée, l'absence d'erreur grossière, trois risques hiérarchisés et, idéalement, la preuve d'un échange avec deux ou trois personnes du secteur.

## Exemple modèle (environ 480 mots)

**Recommandation : INVEST** (seed 800 k€, ownership ~10 %).

**Entreprise.** Atelier édite un logiciel de conformité environnementale (CSRD) pour les PME industrielles européennes ; il automatise un travail aujourd'hui réalisé à la main par des consultants.

**Marché.** Environ 50 000 PME sont concernées. En bottom-up, 50 000 × 40 % × 8 000 € par an donne environ 160 M€ de SAM, en forte croissance sous l'effet de la vague réglementaire 2024-2027. Le why-now tient à l'obligation, qui crée une demande non discrétionnaire immédiate.

**Équipe.** La CEO, ancienne directrice RSE, a vécu le problème ; le CTO vient de Pennylane. Le founder-market fit est fort.

**Traction.** 18 clients payants en 9 mois, 22 k€ de [[mrr|MRR]], une croissance de 25 % par mois et une rétention logo de 100 %.

**Économie.** SaaS, environ 80 % de marge, un ACV de 8 k€, un CAC payback d'environ 10 mois et un ratio [[ltv|LTV]]/[[cac|CAC]] proche de 4.

**Risques.** Le premier est la dépendance réglementaire (report possible de la CSRD), mitigée par l'élargissement à d'autres normes. Le deuxième est la longueur du cycle de vente auprès des PME, traitée par le canal des experts-comptables. Le troisième est la concurrence des grands éditeurs, face à laquelle la société dispose d'une fenêtre de 18 mois.

**Deal.** Seed 800 k€, pre-money d'environ 7 M€, ownership d'environ 10 %.`,keyTakeaways:["Reco en haut, jamais de suspense.","Marché en bottom-up, 3 risques hiérarchisés + mitigations.","Pas d'erreur grossière ; parle à des gens du secteur."],bodyShort:`## Le deal memo

Le deal memo tient en une page (400 à 600 mots). La structure attendue place la recommandation (invest ou pass) en haut, puis présente l'entreprise, le marché (dimensionnement bottom-up et [[why-now|why-now]]), l'équipe, la traction, les unit economics, trois risques hiérarchisés avec leurs mitigations, et enfin le deal (montant, valorisation, ownership).

Les correcteurs attendent une recommandation assumée, l'absence d'erreur grossière, trois risques hiérarchisés et, idéalement, la preuve d'un échange avec deux ou trois personnes du secteur. La recommandation figure en première ligne, en une phrase.`,quiz:[{question:"Que doit contenir la première ligne d'un deal memo ?",options:[{text:"La recommandation invest / pass",correct:!0},{text:"La biographie des fondateurs",correct:!1},{text:"Les clauses juridiques",correct:!1}],explanation:"La recommandation figure en première ligne, en une phrase : le correcteur doit identifier la position en quelques secondes."},{question:"Combien de risques un deal memo solide hiérarchise-t-il ?",options:[{text:"Trois, hiérarchisés et assortis de mitigations",correct:!0},{text:"Aucun, pour rester positif",correct:!1},{text:"Tous les risques imaginables, sans ordre",correct:!1}],explanation:"Trois risques hiérarchisés avec leurs mitigations : c'est le signe d'un jugement, pas d'une liste."}],furtherReading:[{label:"Due diligence en pratique",kind:"lesson",ref:"l-dd-process"}]},"le-case-study":{body:`## Les formats

L'exercice prend deux formes : take-home (sur quelques jours, sous forme de memo ou de deck) ou live (une à deux heures). Dans les deux cas, on remet un [[pitch-deck|deck]] ou des données et l'on attend une recommandation invest ou pass. Le livrable demandé est souvent une page ou quatre slides ; il faut choisir à l'avance le format que l'on maîtrise.

## La méthode en cinq temps

1. **Cadrer (5 min).** Identifier le stade, le ticket et la décision attendue, puis poser ses hypothèses.
2. **Dérouler la grille.** Équipe, puis marché ([[tam-sam-som|sizing]] bottom-up), produit, traction, moat et deal, avec un constat et un risque par pilier.
3. **Trancher.** Formuler une recommandation claire : les conditions en cas d'investissement, les éléments qui la feraient changer en cas de pass.
4. **Hiérarchiser trois risques** avec leurs mitigations.
5. **Présenter (live).** En cinq minutes : la recommandation d'abord, deux ou trois raisons, puis les risques.

Un élément distingue les bons candidats : avoir parlé à deux ou trois personnes du secteur, ce qui reste faisable même en 24 heures, et anticiper les contre-questions.

L'erreur déterminante consiste à ne pas trancher. Une étude sans recommandation nette échoue, même accompagnée d'une analyse brillante, car le métier consiste à décider.

## Mock

« Voici le deck d'Atelier (CSRD, seed 800 k€). 60 minutes. Rendez un 1-pager : invest ou pass, et pourquoi. » L'exercice se fait chronométré. La grille d'évaluation figure dans la leçon « Le mock complet ».`,keyTakeaways:["Cadre → grille → tranche → 3 risques → présente reco d'abord.","Décider est non-négociable.","Choisis ton format de case à l'avance."],bodyShort:`## La méthode en cinq temps

1. **Cadrer.** Identifier le stade, le ticket et la décision attendue, puis poser ses hypothèses.
2. **Dérouler la grille.** Équipe, puis marché ([[tam-sam-som|sizing]] bottom-up), produit, traction, moat et deal.
3. **Trancher.** Formuler une recommandation claire : les conditions en cas d'investissement, les éléments qui la feraient changer en cas de pass.
4. **Hiérarchiser trois risques** avec leurs mitigations.
5. **Présenter.** La recommandation d'abord, deux ou trois raisons, puis les risques.

Le format, une page ou quatre slides, se choisit avant l'épreuve. L'erreur déterminante consiste à ne pas trancher : une étude sans recommandation nette échoue, même brillante, car le métier consiste à décider.`,quiz:[{question:"Quelle est l'erreur déterminante en case study ?",options:[{text:"Ne pas trancher (pas de reco nette)",correct:!0},{text:"Rendre un livrable trop court",correct:!1},{text:"Citer un concurrent",correct:!1}],explanation:"Une analyse brillante sans recommandation claire échoue : le métier consiste à décider."},{question:"Dans une présentation live, par quoi commencer ?",options:[{text:"La recommandation, puis 2-3 raisons, puis les risques",correct:!0},{text:"L'historique détaillé de l'entreprise",correct:!1},{text:"La liste des sources consultées",correct:!1}],explanation:"On présente top-line : la reco d'abord, puis les raisons, puis les risques. Pas de suspense."}],furtherReading:[{label:"Le deal qui divise le comité : Volta au seed",kind:"case",ref:"cs-seed-ic"}]},"pitch-me-a-company":{body:`## L'enjeu

Il s'agit de présenter une startup que le fonds devrait financer. L'exercice évalue la capacité à raisonner comme un investisseur et à communiquer clairement, non la société elle-même.

## La sélection

Le choix porte sur un secteur connu, sur lequel les questions de suivi pourront être tenues, et sur une société qui correspond au fonds, à son stade et à sa [[thesis-driven|thèse]]. Présenter une Série C à un fonds seed conduit à une élimination directe.

## La structure (2-3 min)

1. **La thèse en une phrase** : « je crois X, donc Y devient inévitable ».
2. **Le problème** et le public concerné.
3. **Le produit et sa proposition de valeur** : pourquoi il est nettement supérieur à l'existant.
4. **Le marché** : bottom-up et [[why-now|why-now]].
5. **L'équipe et la traction.**
6. **Les risques** : les assumer et préciser ce qui ferait changer d'avis.

## Les questions de suivi

Plusieurs questions reviennent : ce qui ferait changer d'avis, le choix d'un concurrent plutôt qu'un autre, l'état du moat à cinq ans, la valorisation au-delà de laquelle l'investissement ne se justifierait plus. Elles se préparent.

Un exemple de trame : la thèse, « l'électrification des flottes rend le pilotage de la recharge critique » ; la société, un logiciel B2B de recharge ; le marché, le nombre de flottes multiplié par le budget énergie ; le risque, l'intégration native par les constructeurs.`,keyTakeaways:["Thèse d'abord, puis problème / produit / marché / risques.","Colle au stade et à la thèse du fonds.","Prépare 4 follow-ups — c'est là qu'on te juge vraiment."],bodyShort:`## « Pitch me a company »

L'exercice évalue la capacité à raisonner comme un investisseur, pas la société choisie. Il faut retenir un secteur que l'on connaît et une société qui correspond au stade et à la [[thesis-driven|thèse]] du fonds ; présenter une Série C à un fonds seed conduit à une élimination.

La structure, en deux à trois minutes, va de la thèse en une phrase au problème, puis au produit (nettement supérieur à l'existant), au marché (bottom-up et [[why-now|why-now]]), à l'équipe et à la traction, et enfin aux risques assumés.

L'évaluation se joue surtout dans les questions de suivi : ce qui ferait changer d'avis, le choix d'un concurrent, l'état du moat à cinq ans. Elles se préparent.`,quiz:[{question:"Une boîte à « pitcher » en entretien doit surtout…",options:[{text:"Coller au stade et à la thèse du fonds",correct:!0},{text:"Être la plus connue possible",correct:!1},{text:"Être déjà rentable",correct:!1}],explanation:"Présenter une société hors du stade ou de la thèse du fonds traduit une mauvaise compréhension de l'interlocuteur : c'est une élimination directe."},{question:"Où se joue surtout l'évaluation lors d'un « pitch me a company » ?",options:[{text:"Dans les follow-ups (ce qui ferait changer d'avis, le moat dans 5 ans…)",correct:!0},{text:"Dans la notoriété de la boîte choisie",correct:!1},{text:"Dans la longueur du pitch",correct:!1}],explanation:"Le pitch ouvre la discussion ; ce sont les questions de suivi qui révèlent la capacité à raisonner en investisseur."}],furtherReading:[{label:"Anatomie d'une thèse d'investissement",kind:"lesson",ref:"l-thesis-anatomy"}]},"le-fit-why-vc-why-fund-why-you":{body:`## Le tour qui élimine le plus

**Why VC ?** La bonne réponse exprime un enthousiasme sincère pour l'early-stage — rencontrer des fondateurs, comprendre le scaling, parier sur l'avenir — relié au parcours du candidat. Les réponses fondées sur le prestige ou un goût général pour la finance sont identifiées immédiatement.

**Why this fund ?** Une réponse solide cite la thèse du fonds, deux ou trois sociétés du portefeuille et les raisons de l'intérêt, le stade et le secteur visés, ainsi qu'un deal récent ou un article d'un partner, le tout relié à l'edge du candidat. « Vous êtes un top fonds » signale une absence de préparation et conduit à un pass.

**Why you ?** La réponse porte sur l'edge — réseau, expertise sectorielle, expérience opérationnelle, analyse déjà produite. Il vaut mieux le démontrer, par une analyse écrite, que l'affirmer. La faiblesse évoquée doit être réelle et accompagnée de sa correction.

**Comportemental, framework STAR(L).** Situation, Tâche, Action (ce que le candidat a personnellement fait), Résultat (chiffré), Learning. Quatre à cinq histoires réutilisables doivent être préparées.

**La thèse personnelle.** Un secteur, un why-now et un type de société, en trois phrases falsifiables : c'est le signal le plus fort que le candidat raisonne déjà comme le fonds.

Un exemple de réponse à « why VC » : « En stage dans une startup, j'ai observé un problème de scaling de l'intérieur. Ce point de bascule où une idée devient une entreprise m'a intéressé, et l'impossibilité de suivre plus d'une société à la fois m'a frustré. Le capital-risque permet de rencontrer de nombreux fondateurs, de parier tôt et d'aider à construire. »`,keyTakeaways:["Sincérité + spécificité battent tout.","Why this fund = leur thèse + des boîtes du portefeuille nommées.","Aie une thèse perso falsifiable en 3 phrases."],bodyShort:`## Why VC, why this fund, why you

C'est le tour le plus souvent négligé, et celui qui élimine le plus.

- **Why VC.** Un enthousiasme sincère pour l'early-stage, relié à son parcours, et non l'argument du prestige.
- **Why this fund.** La [[thesis-driven|thèse]] du fonds, deux ou trois sociétés du portefeuille commentées et un deal récent. Une réponse générique conduit à un pass.
- **Why you.** Son edge, démontré par une analyse écrite plutôt qu'affirmé.
- **Comportemental.** Le framework STAR(L), centré sur l'action personnelle et le résultat chiffré.

Disposer d'une thèse personnelle falsifiable en trois phrases est le signal le plus fort que le candidat raisonne déjà comme le fonds.`,quiz:[{question:"Une bonne réponse à « why this fund ? » contient…",options:[{text:"Leur thèse + des boîtes du portefeuille commentées",correct:!0},{text:"« vous êtes les meilleurs »",correct:!1},{text:"Le salaire attendu",correct:!1}],explanation:"Cette question vérifie le travail de préparation. Une réponse générique signale une absence de préparation et conduit à un pass."},{question:"Dans le framework STAR(L), sur quoi insister ?",options:[{text:"L'action menée personnellement et le résultat chiffré",correct:!0},{text:"Le contexte général de l'entreprise",correct:!1},{text:"Les actions de l'équipe sans préciser son rôle",correct:!1}],explanation:"L'évaluation porte sur la contribution personnelle : l'action menée et le résultat mesurable, pas le contexte."}],furtherReading:[{label:"Entrer dans le venture : les portes d'entrée",kind:"lesson",ref:"l-career-breaking-in"}]},"tes-questions-a-poser":{body:`## Les questions à poser constituent un test supplémentaire

Les questions doivent être taillées pour le fonds concerné et révéler un raisonnement d'investisseur. Elles ne sont jamais génériques ni agressives.

Quelques bonnes questions :

- « Comment prenez-vous vos décisions : consensus, conviction d'un partner, droit de veto ? »
- « Sur quelle thèse avez-vous le plus changé d'avis ces deux dernières années ? »
- « Qu'est-ce qui fait qu'un analyst réussit vraiment chez vous à douze mois ? »
- « Quel deal avez-vous raté et qui vous a le plus appris ? »
- « Sur tel secteur du portefeuille, quelle est votre thèse contrariante ? »

À l'inverse, une question générique (« quelles sont vos valeurs ? ») traduit une absence de préparation, et un interrogatoire trop direct au mauvais moment dessert le candidat. Les questions difficiles, sur le turnover ou sur le risque que représenterait ce recrutement, se gardent pour le moment où le fonds est déjà convaincu.

Il est utile de préparer trois questions par interlocuteur et de rebondir sur ses réponses. Une question qui suit la conversation vaut mieux qu'une question récitée.`,keyTakeaways:["Spécifique, réfléchi, non-agressif.","Garde les questions dures pour quand ils te veulent.","Rebondis sur la conversation plutôt que réciter."],bodyShort:`## Les questions à poser constituent un test supplémentaire

Les questions doivent être taillées pour le fonds concerné, jamais génériques ni agressives. Quelques exemples utiles :

- « Comment prenez-vous vos décisions : consensus, conviction d'un partner, droit de veto ? »
- « Sur quelle [[thesis-driven|thèse]] avez-vous le plus changé d'avis ces deux dernières années ? »
- « Qu'est-ce qui fait qu'un analyst réussit chez vous à douze mois ? »

Les questions difficiles, sur le turnover ou sur le risque que représenterait ce recrutement, se gardent pour le moment où le fonds est déjà convaincu. Mieux vaut rebondir sur ce qui vient d'être dit que réciter une liste préparée.`,quiz:[{question:"Quand poser les questions difficiles (turnover, raison de la vacance du poste) ?",options:[{text:"Lorsque le fonds est déjà convaincu",correct:!0},{text:"Dès le premier appel",correct:!1},{text:"Jamais",correct:!1}],explanation:"Les questions inconfortables se posent en position de force, pas tant que le poste n'est pas acquis."},{question:"Que vaut-il mieux faire de ses questions préparées ?",options:[{text:"Rebondir sur la conversation plutôt que les réciter",correct:!0},{text:"Les poser toutes, dans l'ordre, quoi qu'il arrive",correct:!1},{text:"Garder le silence pour ne pas déranger",correct:!1}],explanation:"Une question qui prolonge ce qui vient d'être dit vaut mieux qu'une question récitée : elle montre une écoute réelle."}],furtherReading:[{label:"Faire ses devoirs sur le fonds",kind:"lesson",ref:"lea-fund-research"}]},"faire-ses-devoirs-sur-le-fonds":{body:`## Préparer le fonds en profondeur

- **Thèse et stade.** Ce que le fonds finance, à quel stade, dans quels secteurs et pour quel ticket, à partir de son site, de Dealroom, de [[pitchbook|PitchBook]] et de ses articles.
- **Portefeuille.** Cinq ou six sociétés, dont deux ou trois que l'on peut commenter : pourquoi le pari est bon, où elles en sont.
- **Deals récents.** Les trois derniers investissements, pour disposer d'éléments d'actualité.
- **Les personnes.** Qui mène les deals, qui écrit, qui publie quoi. Leurs prises de position se lisent.

## L'élément différenciant

Arriver avec une analyse de startup produite par soi-même — une société du portefeuille décortiquée, ou une opportunité que le fonds pourrait financer — constitue l'élément différenciant au recrutement français : cela prouve que le candidat sait déjà faire le travail. Une analyse d'une page pèse davantage qu'un long CV.

## Cartographier l'écosystème français

Il s'agit d'une méthode, non d'une liste figée. On situe les fonds par stade et par thèse — pré-seed/seed, seed/Série A, growth — sur la toile de fond du capital public ({{bpifrance|Bpifrance}}, {{eif|EIF}}). Les stratégies évoluent : la thèse et le stade actuels se vérifient toujours sur le site du fonds.

Ne pas connaître deux ou trois sociétés du portefeuille est éliminatoire : cela revient à dire que le candidat n'a pas consacré trente minutes au fonds.`,keyTakeaways:["Thèse + portfolio + deals récents + les gens.","Arrive avec une analyse que TU as écrite.","Connaître le portfolio n'est pas optionnel."],bodyShort:`## Préparer le fonds en profondeur

La préparation porte sur quatre points : la thèse et le stade, le portefeuille (deux ou trois sociétés que l'on peut commenter), les deals récents et les personnes qui mènent et écrivent.

Le geste qui distingue un candidat consiste à arriver avec une analyse de startup qu'il a lui-même produite : une société du portefeuille décortiquée, ou une opportunité que le fonds pourrait financer. Au recrutement français, c'est l'élément différenciant, car il prouve que le candidat sait déjà faire le travail.

Ne pas connaître deux ou trois sociétés du portefeuille est éliminatoire : cela revient à dire que le candidat n'a pas consacré trente minutes au fonds.`,quiz:[{question:"Quel est le meilleur élément différenciant à un entretien analyst en France ?",options:[{text:"Une analyse de startup produite par soi-même",correct:!0},{text:"Un costume cher",correct:!1},{text:"Mentionner un MBA",correct:!1}],explanation:"Une analyse produite par soi-même prouve que le candidat sait déjà faire le travail : elle pèse davantage qu'un long CV."},{question:"Que prouve une analyse de startup produite par soi-même ?",options:[{text:"Que le candidat sait déjà faire le travail",correct:!0},{text:"Qu'il dispose de temps libre",correct:!1},{text:"Rien de pertinent pour le recruteur",correct:!1}],explanation:"Une analyse produite par soi-même est l'élément différenciant principal au recrutement français : elle pèse davantage qu'un long CV."}],furtherReading:[{label:"Entrer dans le venture",kind:"lesson",ref:"l-career-breaking-in"}]},"48h-jour-j-suivi":{body:`## Dans les 48 heures qui précèdent

Relire ses notes sur le fonds, sa thèse personnelle, son « pitch me a company » et ses quatre à cinq histoires STAR, puis refaire un mock case chronométré. Le format du case, une page ou des slides, se choisit à l'avance.

## Le jour de l'entretien

- **Raisonner à voix haute.** L'évaluation porte sur le raisonnement, pas seulement sur la réponse.
- **Structurer.** Annoncer « trois points : un, deux, trois » ; la clarté prime sur l'exhaustivité.
- **Trancher.** Une recommandation nette est toujours attendue.
- **Contenir la dispersion.** 60 à 90 secondes par réponse, puis proposer d'approfondir.
- **Assumer ce que l'on ignore.** « Je ne connais pas ce chiffre, mais voici comment je l'estimerais » vaut mieux qu'un bluff.

## Le suivi

Un courriel bref, envoyé en moins de 24 heures, qui apporte un élément supplémentaire : un point approfondi après coup, un article pertinent.

## Les erreurs à éviter

Les réponses génériques, l'absence de recommandation dans le case, un dimensionnement limité au top-down, une erreur de pre/post-money, la méconnaissance du portefeuille, la dispersion et le bluff sur un chiffre.`,keyTakeaways:["Pense à voix haute, structure, tranche.","60-90 s par réponse, contrôle le rambling.","Relance en 24 h en ajoutant de la valeur."],bodyShort:`## Le jour de l'entretien

- **Raisonner à voix haute**, car l'évaluation porte sur le raisonnement autant que sur la réponse.
- **Structurer** la réponse (« trois points : un, deux, trois ») et **trancher** par une recommandation nette.
- **Contenir la dispersion** : 60 à 90 secondes par réponse, puis proposer d'approfondir.
- **Assumer ce que l'on ignore** : exposer une méthode d'estimation vaut mieux que bluffer.

Dans les 48 heures qui précèdent : relire le fonds, sa thèse personnelle et ses histoires STAR, et refaire un mock case chronométré. Après l'entretien : un courriel bref, en moins de 24 heures, qui apporte un élément supplémentaire.

Les erreurs à éviter sont les réponses génériques, l'absence de recommandation dans le case, une erreur de pre/post-money et la méconnaissance du portefeuille.`,quiz:[{question:"Face à un chiffre que l'on ignore en entretien, la meilleure attitude est de…",options:[{text:"Expliquer comment l'estimer",correct:!0},{text:"Inventer un chiffre crédible",correct:!1},{text:"Changer de sujet",correct:!1}],explanation:"Exposer sa méthode d'estimation prouve le raisonnement ; bluffer un chiffre est une faute."},{question:"Quelle durée viser par réponse pour contenir la dispersion ?",options:[{text:"60 à 90 secondes, puis proposer d'approfondir",correct:!0},{text:"Au moins cinq minutes",correct:!1},{text:"Le plus court possible, en un mot",correct:!1}],explanation:"60 à 90 secondes structurées, puis une proposition d'approfondir : la clarté prime sur l'exhaustivité."}],furtherReading:[{label:"Le mock complet",kind:"lesson",ref:"lea-mock"}]},"le-mock-complet":{body:`## L'entraînement en conditions réelles

L'exercice se fait en conditions réelles, chronométré et à voix haute, idéalement enregistré. Il comporte trois manches, comme un véritable process.

**Manche 1 — Fit (15 min).** Why VC ? Why ce fonds, en en choisissant un réel ? Why you ? La thèse personnelle en trois phrases, et une histoire STAR portant sur un échec.

**Manche 2 — Case study (60 min, livrable).** « Atelier, SaaS de conformité CSRD pour PME, seed 800 k€. Rendez un 1-pager : invest ou pass, pourquoi, et vos trois risques. » Le format est imposé : une page.

**Manche 3 — Pitch et technique (15 min).** Le pitch-me-a-company, puis deux calculs : un fondateur à 50 % qui lève 4 M€ sur 12 M€ de pre-money conserve 37,5 % ; un multiple de 4× en 5 ans correspond à un IRR d'environ 32 %.

## Grille d'auto-évaluation

Le candidat est prêt lorsque tous les points suivants sont au vert :

- **Grille d'analyse** : dérouler Équipe, Marché, Produit, Traction et Moat sans hésitation.
- **Market sizing** : bottom-up, hypothèses annoncées, contre-vérification top-down.
- **Recommandation** : invest ou pass net, assorti de ses conditions.
- **Risques** : trois risques hiérarchisés avec leurs mitigations.
- **Technique** : cap table et returns justes, option pool repéré.
- **Fit** : why VC, why fund et why you spécifiques, thèse personnelle falsifiable.
- **Communication** : structurée, tranchée, sous 90 secondes, sans dispersion.

## La revue par un pair

Refaire la deuxième manche devant une personne, idéalement déjà dans le métier, à l'aide de cette grille. C'est la dernière étape : ce que l'on croit clair ne l'est qu'une fois validé par un tiers.

Le candidat est prêt lorsque tous les critères sont au vert, en conditions chronométrées, deux fois de suite dont une devant un pair, et non après une simple lecture.`,keyTakeaways:["Trois manches : fit, case study, pitch & technique.","Prêt = tout en vert, chronométré, deux fois.","La revue par les pairs est la dernière marche."],bodyShort:`## L'entraînement en conditions réelles

L'exercice se fait en conditions réelles, chronométré et à voix haute, idéalement enregistré. Il comporte trois manches, comme un véritable process :

1. **Fit (15 min)** : why VC, why ce fonds, why you, et la thèse personnelle.
2. **Case study (60 min)** : un livrable tranché, invest ou pass, avec trois risques.
3. **Pitch et technique (15 min)** : le pitch-me-a-company, un calcul de cap table et un calcul d'IRR.

Vient ensuite la revue par un pair : refaire la deuxième manche devant une personne du métier. Le candidat est prêt lorsque tous les critères sont au vert, en conditions chronométrées, deux fois de suite dont une devant un pair, et non après une simple lecture.`,quiz:[{question:"Dans la grille d'auto-évaluation, que signifie « prêt » ?",options:[{text:"Tout en vert, en conditions chronométrées, deux fois de suite, dont une devant un pair",correct:!0},{text:"Avoir lu une fois l'ensemble des fiches",correct:!1},{text:"Réussir la manche technique isolément",correct:!1}],explanation:"Ce qu'on croit clair ne l'est qu'une fois validé par un tiers, en conditions réelles et répétées."},{question:"Quelles sont les trois manches du mock complet ?",options:[{text:"Fit, case study, puis pitch et technique",correct:!0},{text:"Sourcing, modélisation, puis reporting",correct:!1},{text:"Lecture, rédaction, puis correction",correct:!1}],explanation:"Le mock reproduit un vrai process : entretien de fit, étude de cas livrable, puis pitch et questions techniques."}],furtherReading:[{label:"Anatomie d'un portefeuille en loi de puissance",kind:"case",ref:"cs-power-law-portfolio"}]},"lever-sans-se-faire-diluer":{body:`## Le grand malentendu de la valorisation

Beaucoup de fondateurs fixent leur attention sur une seule métrique : la valorisation post-money. Pourtant, ce qui détermine réellement votre richesse à la fin, c'est le pourcentage de la société que vous conservez (l'ownership) et les conditions attachées aux actions.

La règle d'or d'une levée saine en seed est de viser **entre 15 % et 25 % de dilution**. Au-delà de 25 %, vous hypothéquez votre capacité à lever les tours suivants : les investisseurs futurs verront que l'équipe fondatrice n'est plus assez incitée au succès.

## Le piège de l'option pool pre-money

C'est la technique de négociation la plus classique. L'investisseur vous propose une belle valorisation, mais exige la création d'un pool de BSPCE (options pour les salariés) de 10 % à 15 % **avant** son entrée au capital (pre-money).

Conséquence mathématique : ce sont **uniquement les fondateurs et actionnaires historiques** qui subissent cette dilution. L'investisseur, lui, achètera ses actions sur une base déjà diluée par le pool, protégeant ainsi son pourcentage post-money.

> **Le conseil pro :** Modélisez toujours la **cap table fully diluted** (en incluant tous les BSA, BSPCE, et convertibles) avant de signer. Ne négociez pas qu'une valorisation, négociez la taille exacte de l'option pool dont vous avez *réellement* besoin pour les 18 prochains mois.

## Faites-vous accompagner

N'essayez jamais de gérer votre table de capitalisation et la structuration de la levée seul sur un coin de table. **Engagez un avocat spécialisé en levée de fonds (VC) en France.** Un bon avocat coûte de l'argent, mais un mauvais montage financier vous coûtera votre entreprise. Ne prenez jamais un avocat généraliste.`,keyTakeaways:["Visez entre 15 % et 25 % de dilution par tour.","Un option pool créé en pre-money dilue uniquement les fondateurs existants.","Le recours à un avocat spécialisé VC est indispensable pour structurer le tour."],quiz:[{question:"Quelle fourchette de dilution vise une levée saine en seed ?",options:[{text:"Entre 15 % et 25 % par tour",correct:!0},{text:"Entre 40 % et 50 % par tour",correct:!1},{text:"Moins de 5 % par tour",correct:!1}],explanation:"Au-delà de 25 %, l'équipe fondatrice n'est plus assez incitée et les tours suivants deviennent plus difficiles à lever."},{question:"Qui subit la dilution d'un option pool créé en pre-money ?",options:[{text:"Uniquement les fondateurs et actionnaires historiques",correct:!0},{text:"L'ensemble des actionnaires, au prorata",correct:!1},{text:"Principalement le nouvel investisseur",correct:!1}],explanation:"L'investisseur achète ses actions sur une base déjà diluée par le pool, ce qui protège son pourcentage post-money."}]},"bsa-air-vs-oc":{body:`## Le roi de l'amorçage français : le BSA-AIR

En France, l'instrument roi pour les levées early-stage (pre-seed, bridge) est le **BSA-AIR** (Bon de Souscription d'Actions - Accord d'Investissement Rapide). C'est l'équivalent philosophique du SAFE américain, mais adapté au droit des sociétés français (souvent en SAS).

Le principe : l'investisseur vous donne de l'argent aujourd'hui, et recevra des actions plus tard, lors d'un événement de conversion (généralement la prochaine levée de fonds *priced round*). 

## Les paramètres clés à négocier

- **La décote (Discount)** : En récompense du risque pris tôt, l'investisseur bénéficie d'une réduction (généralement 15 % à 20 %) sur le prix de l'action du prochain tour.
- **Le Cap (Plafond de valorisation)** : C'est le prix maximum auquel l'investisseur convertira, même si votre startup explose. **C'est la protection de l'investisseur.**
- **Le Floor (Plancher)** : C'est la protection du fondateur, garantissant une valorisation minimale de conversion pour éviter une dilution massive si le prochain tour se fait à basse valorisation.

## BSA-AIR vs Obligation Convertible (OC)

Avant le BSA-AIR, on utilisait beaucoup les obligations convertibles (OC). L'OC est une dette : elle a un taux d'intérêt et une date d'échéance. Si la startup ne lève pas, elle doit théoriquement rembourser l'OC (ce qui met l'entreprise en faillite).

Le BSA-AIR n'est **pas une dette**. C'est une promesse de capital. Il n'y a pas d'intérêts et pas de remboursement exigible, ce qui soulage considérablement le bilan de la startup. Aujourd'hui, préférez toujours le BSA-AIR à l'OC pour vos premiers tours.

> **Avertissement :** Le mécanisme de conversion des BSA-AIR peut être mathématiquement complexe (pre-money vs post-money conversion). **L'accompagnement par un cabinet d'avocats expert en Venture Capital est absolument indispensable** pour rédiger le contrat et calculer les impacts dilutifs.`,keyTakeaways:["Le BSA-AIR n'est pas une dette, contrairement à l'OC.","Le Cap protège l'investisseur, le Floor protège le fondateur.","Ne rédigez jamais un BSA-AIR sans un avocat spécialisé."],quiz:[{question:"Quelle différence essentielle sépare le BSA-AIR de l'obligation convertible ?",options:[{text:"Le BSA-AIR n'est pas une dette : ni intérêts, ni remboursement exigible",correct:!0},{text:"Le BSA-AIR porte un taux d'intérêt plus élevé",correct:!1},{text:"L'obligation convertible ne se convertit jamais en actions",correct:!1}],explanation:"L'OC peut devoir être remboursée si la startup ne lève pas ; le BSA-AIR est une promesse de capital qui soulage le bilan."},{question:"Que protège le Cap dans un BSA-AIR ?",options:[{text:"L'investisseur : c'est le prix maximum auquel il convertira",correct:!0},{text:"Le fondateur : c'est une valorisation minimale garantie",correct:!1},{text:"Les salariés détenteurs de BSPCE",correct:!1}],explanation:"Le Cap protège l'investisseur (plafond de conversion) ; le Floor protège le fondateur (plancher de valorisation)."}]},"preference-liquidation":{body:`## La protection contre le downside

La préférence de liquidation est la clause la plus importante d'une Term Sheet après la valorisation. Elle définit qui est payé en premier lors d'une revente (exit) ou d'une liquidation de l'entreprise.

Imaginons qu'un fonds investit 2 M€ pour 20 % de la boîte. Si la boîte est revendue 5 M€, sans cette clause, le fonds toucherait 1 M€ (20 % de 5 M€) et perdrait de l'argent. La préférence de liquidation lui garantit de récupérer sa mise initiale avant que les fondateurs ne touchent le moindre euro.

## Le standard français : 1x Non-Participating

En France, le standard sain est le **1x Non-Participating** (souvent formalisé par des Actions de Préférence - ADP).

Lors d'une revente, l'investisseur a le choix entre :
1. **Récupérer 1 fois sa mise (1x)** : il prend ses 2 M€, et les fondateurs se partagent le reste.
2. **Convertir en actions ordinaires (Non-Participating)** : il prend 20 % du prix de vente total, comme tout le monde.

L'investisseur choisira l'option mathématiquement la plus avantageuse pour lui.

## Les clauses toxiques à fuir

Méfiez-vous des clauses de type **Participating** (le « double dip ») : l'investisseur récupère sa mise de 2 M€ **ET ENSUITE** prend 20 % du reste. C'est une hérésie en amorçage et cela ruine les fondateurs en cas de sortie moyenne.

> **Le rôle de votre avocat :** Les termes juridiques d'une liquidation preference dans les statuts d'une SAS sont complexes (distribution de boni, dividendes prioritaires). **Votre avocat d'affaires** est le seul garde-fou capable de s'assurer que le *legal wording* correspond exactement au *business wording* de la Term Sheet (le fameux "1x non-participating").`,keyTakeaways:["La préférence de liquidation garantit aux investisseurs de récupérer leur mise en priorité.","Le standard en France est le 1x non-participating.","Les clauses 'participating' sont toxiques pour les fondateurs en amorçage."],quiz:[{question:"Quel est le standard sain de préférence de liquidation en France ?",options:[{text:"Le 1x non-participating",correct:!0},{text:"Le 2x participating",correct:!1},{text:"L'absence totale de préférence",correct:!1}],explanation:"L'investisseur choisit alors entre récupérer 1 fois sa mise ou convertir en actions ordinaires pour prendre son pourcentage."},{question:"Pourquoi une clause « participating » est-elle défavorable aux fondateurs ?",options:[{text:"L'investisseur récupère sa mise, puis prend en plus son pourcentage du reste (double dip)",correct:!0},{text:"Elle interdit toute revente de l'entreprise",correct:!1},{text:"Elle réduit la valorisation pre-money",correct:!1}],explanation:"Ce cumul ruine les fondateurs lors d'une sortie moyenne ; il est à éviter en amorçage."}]},"board-controle-sas":{body:`## Vous n'êtes plus seul maître à bord

En France, la forme juridique reine de la startup est la SAS (Société par Actions Simplifiée). Sa force est son extrême flexibilité statutaire. C'est le **Pacte d'Actionnaires** (et non la loi) qui va définir les règles du jeu entre vous et vos investisseurs.

## Le Comité Stratégique (Board)

Dès la Série A (et parfois en Seed), les investisseurs demanderont la création d'un **Comité Stratégique**. En tant que fondateur, vous devez contrôler la majorité des sièges au début (ex: 2 fondateurs, 1 VC). 

L'investisseur principal prendra un siège (*Board Member*), et les investisseurs suiveurs demanderont souvent un rôle d'observateur (*Censeur* ou *Board Observer*), qui participe aux débats mais ne vote pas.

## Les droits de veto (Matières réservées)

C'est ici que se joue le vrai contrôle. Même avec la majorité au board, le Pacte d'Actionnaires inclura une liste de décisions (les **matières réservées**) nécessitant l'accord explicite des investisseurs (souvent une majorité qualifiée des Actions de Préférence).

Exemples de vetos classiques et acceptables :
- Changer le business model de façon drastique.
- Vendre l'entreprise ou fusionner (M&A).
- Émettre de nouvelles actions (dilution de l'investisseur).
- Emprunter au-delà d'un certain seuil.

> **La ligne rouge :** Ne laissez jamais un investisseur exiger un droit de veto sur le budget opérationnel courant, l'embauche d'un directeur (hors C-level), ou le renvoi d'un salarié. 

> **Votre avocat est votre bouclier :** La négociation du Pacte d'Actionnaires est le moment où un bon avocat VC justifie ses honoraires. Chaque mot compte pour préserver votre liberté opérationnelle tout en rassurant les investisseurs.`,keyTakeaways:["En SAS, le Pacte d'Actionnaires régit le pouvoir, pas la loi.","Le board d'amorçage doit rester contrôlé par les fondateurs.","Limitez les droits de veto aux décisions extraordinaires (fusion, vente, budget global)."],quiz:[{question:"En SAS, qu'est-ce qui régit le pouvoir entre fondateurs et investisseurs ?",options:[{text:"Le pacte d'actionnaires, plus que la loi",correct:!0},{text:"Le seul code de commerce",correct:!1},{text:"Le règlement intérieur de la société",correct:!1}],explanation:"La SAS doit sa flexibilité à ses statuts et à son pacte d'actionnaires, qui définissent les règles du jeu."},{question:"Quel droit de véto constitue une ligne rouge à refuser à un investisseur ?",options:[{text:"Un véto sur le budget opérationnel courant ou les embauches hors C-level",correct:!0},{text:"Un véto sur la vente ou la fusion de l'entreprise",correct:!1},{text:"Un véto sur l'émission de nouvelles actions",correct:!1}],explanation:"Les matières réservées doivent rester limitées aux décisions extraordinaires, pas à la gestion quotidienne."}]},"erreurs-data-room":{body:`## Qu'est-ce qu'une Data Room ?

Lorsqu'un fonds émet une Term Sheet, il conditionne son investissement à un **audit (Due Diligence)**. Pour cela, vous devez mettre à disposition une Data Room (un espace cloud sécurisé) contenant toute la vie juridique, financière et RH de l'entreprise.

## Les erreurs qui tuent les deals

1. **Cacher un cadavre dans le placard :** Un litige prud'homal, un redressement URSSAF, un cofondateur parti fâché avec des actions. L'audit le trouvera. Annoncez-le **avant** la Term Sheet.
2. **La PI (Propriété Intellectuelle) non sécurisée :** C'est le motif d'abandon n°1 en deeptech/software. Si vos développeurs, freelances ou stagiaires n'ont pas signé de clause de cession de PI en bonne et due forme au profit de la SAS, le fonds n'investira pas.
3. **L'enfer des contrats de travail :** Clauses de non-concurrence farfelues, périodes d'essai mal rompues, BSPCE promis par oral mais jamais émis par AG. C'est l'illustration d'une gestion amateur.
4. **La cap table excel erronée :** Une cap table qui ne match pas avec les procès-verbaux d'Assemblée Générale ou le registre de mouvements de titres (Cerfa).
5. **Le chaos du dossier :** Une data room non structurée, avec des fichiers nommés "Scan-290.pdf", montre un manque de rigueur qui fait fuir les investisseurs institutionnels.

> **La préparation est juridique :** Une data room propre se prépare 3 mois avant la levée. Faites réaliser un audit à blanc (*vendor due diligence*) par **vos avocats et votre expert-comptable**. Ils identifieront et "nettoieront" les erreurs juridiques ou comptables avant que les avocats du fonds VC ne mettent le nez dedans.`,keyTakeaways:["Révélez les problèmes avant que l'audit ne les découvre.","Assurez-vous que toute la PI est détenue par la société (et non par les créateurs).","Une data room bordélique fait douter de vos capacités de gestionnaire."],quiz:[{question:"Que faire d'un litige ou d'un passif connu avant la signature ?",options:[{text:"L'annoncer avant la term sheet, car l'audit le découvrira",correct:!0},{text:"L'omettre de la data room pour ne pas inquiéter le fonds",correct:!1},{text:"Attendre que le fonds le détecte pour en discuter",correct:!1}],explanation:"Révéler les problèmes en amont préserve la confiance ; les laisser découvrir fait souvent échouer le deal."},{question:"Quel est le motif d'abandon le plus fréquent en software et deeptech ?",options:[{text:"Une propriété intellectuelle non cédée à la société par les développeurs, freelances ou stagiaires",correct:!0},{text:"Un chiffre d'affaires insuffisant",correct:!1},{text:"Une équipe trop petite",correct:!1}],explanation:"Si l'actif clé n'appartient pas à la société, le fonds n'investira pas : la chaîne de cession de PI doit être complète."}]},"la-due-diligence-commerciale":{body:`## Tester la demande

La due diligence commerciale vérifie une chose : la demande existe-t-elle au prix annoncé. Le pitch décrit un marché qui veut le produit ; le terrain le confirme ou non. On va donc chercher la preuve chez les clients, dans les cohortes et chez les concurrents, plutôt que dans le récit du fondateur.

## Le marché atteignable

On reprend le dimensionnement ([[tam-sam-som|TAM/SAM/SOM]]) et on le reconstruit par le bas : nombre de clients réellement adressables multiplié par un prix réaliste. Un marché de cent milliards dont l'entreprise ne peut servir qu'une fraction marginale n'est pas un grand marché pour elle. Ce qui compte, c'est de savoir si le marché adressable peut produire une sortie à la hauteur du risque pris.

## Les appels clients

Le travail central, ce sont les appels de référence clients, y compris ceux que le fondateur n'a pas sélectionnés. On cherche pourquoi ils ont acheté, ce qui les ferait partir, s'ils paieraient davantage. Un client qui hésite avant de dire qu'il rachèterait en apprend plus qu'un témoignage publié sur le site.

## Rétention et concurrence

La traction qui compte est celle qui dure. On regarde la [[nrr|rétention nette]] et les cohortes avant la croissance brute : un produit qu'on garde signale un vrai besoin ([[pmf|product-market fit]]). Reste la question concurrentielle : qu'est-ce qui empêche un acteur mieux financé de répliquer l'offre en dix-huit mois ([[moat|barrière à l'entrée]]) ?`,keyTakeaways:["Reconstruire le marché adressable par le bas, pas en pourcentage d'un grand total.","Les appels clients non sélectionnés par le fondateur sont la source la plus fiable.","La rétention mesure la demande réelle mieux que la croissance brute."],quiz:[{question:"Comment reconstruit-on le marché en due diligence commerciale ?",options:[{text:"Par le bas : clients réellement adressables multipliés par un prix réaliste",correct:!0},{text:"En appliquant un pourcentage au marché total annoncé",correct:!1},{text:"En reprenant tel quel le chiffre du deck",correct:!1}],explanation:"Un grand marché total ne dit rien du marché que l'entreprise peut réellement servir."},{question:"Pourquoi privilégier les appels clients non sélectionnés par le fondateur ?",options:[{text:"Ils sont moins biaisés que les références choisies",correct:!0},{text:"Ils sont plus rapides à organiser",correct:!1},{text:"Ils dispensent de regarder la rétention",correct:!1}],explanation:"Les références fournies sont, par construction, les plus favorables ; le backchannel donne une image plus juste."}],furtherReading:[{label:"Traction & unit economics",kind:"lesson",ref:"l-traction-unit-economics"},{label:"Screening & filtrage",kind:"lesson",ref:"l-screening"}]},"la-due-diligence-produit-technologie":{body:`## Au-delà de la démonstration

Une démonstration prouve qu'un scénario fonctionne, pas que le produit tient en production chez de vrais clients. La due diligence produit mesure l'écart entre ce qui est montré et ce qui est livré : fonctionnalités réellement déployées, part d'intervention manuelle, dette technique accumulée.

## La défensibilité

Une technologie impressionnante mais facile à répliquer ne protège pas durablement. Un avantage qui se renforce avec l'usage — données propriétaires, effets de réseau, coûts de changement — protège mieux ([[moat|barrière à l'entrée]]). La question utile porte sur l'horizon : dans dix-huit mois, qu'est-ce qui tient encore face à un concurrent mieux financé.

## L'échelle

Un produit peut fonctionner à cent clients et se dégrader à dix mille, techniquement ou économiquement. On vérifie que la [[gross-margin|marge brute]] tient quand le volume monte. Une activité dont chaque client coûte presque autant qu'il rapporte relève du service plus que du logiciel ; ses [[unit-economics|unit economics]] doivent s'améliorer avec l'échelle, pas l'inverse.

## Les dépendances

Reste à identifier les points de défaillance unique : un seul fournisseur d'API, un modèle d'IA tiers, une brique critique non maîtrisée. Une entreprise dont la valeur dépend d'une ressource qu'un tiers peut couper ou retarifer porte un risque que le pitch mentionne rarement.`,keyTakeaways:["Mesurer l'écart entre la démonstration et ce qui est réellement déployé.","Un avantage défensif se renforce avec l'usage ; une techno réplicable ne suffit pas.","Vérifier que marge brute et unit economics tiennent à l'échelle."],quiz:[{question:"Qu'est-ce qui distingue un vrai avantage défensif d'une simple avance ?",options:[{text:"Un avantage qui se renforce avec l'usage (données, effets de réseau, coûts de changement)",correct:!0},{text:"Une technologie plus récente que celle des concurrents",correct:!1},{text:"Une équipe technique plus nombreuse",correct:!1}],explanation:"Une techno réplicable en quelques mois ne constitue pas un moat ; l'avantage doit se consolider dans le temps."},{question:"Quel signal trahit une activité présentée comme « tech » mais proche du service ?",options:[{text:"La marge brute ne tient pas et les unit economics se dégradent à l'échelle",correct:!0},{text:"Le produit dispose d'une interface soignée",correct:!1},{text:"L'entreprise emploie des ingénieurs",correct:!1}],explanation:"Si chaque client coûte presque autant qu'il rapporte, l'économie ne s'améliore pas avec le volume."}],furtherReading:[{label:"Lire une startup",kind:"course",ref:"c-startup-analysis"}]},"la-due-diligence-equipe-references":{body:`## Un pari sur des personnes

En amorçage, les chiffres sont minces et le pari porte surtout sur l'équipe. La due diligence équipe ne cherche pas un CV prestigieux mais une raison crédible que ces fondateurs réussissent sur ce marché : connaissance du problème, vitesse d'apprentissage, capacité à recruter.

## Les appels de référence

On parle aux anciens associés, employés et investisseurs, en incluant ceux qui ne figurent pas sur la liste fournie. Les questions utiles ne sont pas « est-il brillant » mais « le réembaucheriez-vous », « comment réagit-il sous tension », « pourquoi êtes-vous parti ». Les hésitations comptent autant que les réponses.

## Les signaux d'intégrité

Un doute sur l'honnêteté pèse plus lourd qu'une lacune de compétence : une compétence se recrute, un problème d'intégrité dure toute la relation. Écarts entre les déclarations et les données, ruptures répétées avec des cofondateurs, embellissements systématiques : ces signaux méritent d'être creusés avant de signer.

## L'alignement dans la durée

On vérifie enfin que l'équipe reste incitée à tenir dix ans. Le [[vesting|vesting]] des fondateurs et la répartition de la [[cap-table|cap table]] doivent garder chacun motivé ; un cofondateur parti tôt avec un bloc d'actions déjà acquises est un problème de gouvernance. Ce qu'on apprend ici alimente directement le [[deal-memo|deal memo]] présenté au comité.`,keyTakeaways:["Chercher une raison crédible que ces fondateurs gagnent sur ce marché, pas un CV.","Les références hors liste fournie sont les plus instructives.","Un doute d'intégrité pèse plus lourd qu'une lacune de compétence."],quiz:[{question:"Qu'évalue-t-on en priorité dans la due diligence équipe en amorçage ?",options:[{text:"Une raison crédible que ces fondateurs gagnent sur ce marché",correct:!0},{text:"Le prestige des diplômes et des employeurs passés",correct:!1},{text:"La taille actuelle de l'équipe",correct:!1}],explanation:"Le founder-market fit pèse plus que le CV : connaissance du problème, vitesse d'apprentissage, capacité à recruter."},{question:"Pourquoi un doute d'intégrité pèse-t-il plus lourd qu'une lacune de compétence ?",options:[{text:"Une compétence se recrute, alors qu'un problème d'honnêteté dure toute la relation",correct:!0},{text:"Parce qu'il est plus facile à mesurer",correct:!1},{text:"Parce qu'il affecte uniquement la phase de levée",correct:!1}],explanation:"La relation court sur une dizaine d'années ; un signal d'intégrité mérite d'être creusé avant de signer."}],furtherReading:[{label:"Les rôles dans un fonds",kind:"lesson",ref:"l-roles"}]},"la-due-diligence-juridique-cap-table":{body:`## La dernière vérification

Une fois la conviction faite, la due diligence juridique et financière confirme l'absence de défaut bloquant. Beaucoup de tours s'arrêtent ici, non par manque de potentiel, mais à cause d'une structure mal tenue.

## La cap table

On reconstruit la [[cap-table|cap table]] entièrement diluée — actions, BSA, BSPCE, instruments convertibles — et on la confronte aux procès-verbaux d'assemblée et au registre de mouvements de titres. Un tableur qui ne correspond pas aux actes juridiques est un signal à traiter avant tout le reste. On regarde aussi la taille de l'[[esop|ESOP]] : un pool trop petit imposera une nouvelle dilution juste après l'entrée.

## La propriété intellectuelle

C'est le motif de retrait le plus fréquent en logiciel et en deeptech. Si des développeurs, freelances ou stagiaires n'ont pas cédé leur propriété intellectuelle à la société, l'actif principal ne lui appartient pas. On vérifie les clauses de cession, l'absence de revendication d'un fondateur parti et la continuité de la chaîne de titres.

## Le wording et le carburant

La [[term-sheet|term sheet]] indique « 1x non-participating » ; les statuts doivent dire exactement la même chose. La due diligence s'assure que la [[liquidation-preference|préférence de liquidation]] et les droits de gouvernance traduisent fidèlement l'accord économique, car un écart se paie à la sortie. On confirme enfin la trésorerie : le [[runway|runway]] réel au regard du [[burn-rate|burn rate]], les dettes et les passifs (URSSAF, prud'hommes) qui réduisent le nombre de mois que le tour achète vraiment.`,keyTakeaways:["Confronter la cap table entièrement diluée aux actes juridiques, pas au seul tableur.","La PI non cédée à la société est le motif de retrait le plus fréquent en logiciel et deeptech.","Le wording des statuts doit traduire exactement l'accord économique négocié."],quiz:[{question:"À quoi confronte-t-on la cap table entièrement diluée ?",options:[{text:"Aux procès-verbaux d'assemblée et au registre de mouvements de titres",correct:!0},{text:"Au seul tableur Excel fourni par le fondateur",correct:!1},{text:"À la valorisation annoncée dans la term sheet",correct:!1}],explanation:"Un tableur qui ne correspond pas aux actes juridiques est un signal d'alerte à traiter en priorité."},{question:"Pourquoi vérifier que développeurs et freelances ont cédé leur propriété intellectuelle ?",options:[{text:"Sinon l'actif principal n'appartient pas à la société, ce qui fait échouer le deal",correct:!0},{text:"Pour calculer la marge brute",correct:!1},{text:"Pour estimer le runway restant",correct:!1}],explanation:"La PI non sécurisée est le motif de retrait le plus fréquent en logiciel et en deeptech."}],furtherReading:[{label:"Ownership & cap table (simulateur)",kind:"simulator",ref:"ownership"},{label:"Le piège de la valorisation flatteuse",kind:"case",ref:"cs-liquidation-preference"},{label:"Les 5 erreurs mortelles de data room",kind:"lesson",ref:"lf-dataroom"}]},"9-sur-10-vont-mourir":{body:`## 9 sur 10 vont mourir. C'est le plan.

Imagine un métier où tu sais, dès le départ, que la plupart de tes paris vont échouer — et où ce n'est pas un problème.

Un fonds investit dans ~30 startups. La moitié meurent (zéro). Une poignée te rendent ta mise. Et **une seule**, parfois, fait ×50 — et rapporte plus que les 29 autres réunies. C'est la **[[power-law|loi de puissance]]** : le résultat n'est pas la moyenne, c'est l'extrême. Comme une forêt où un seul arbre dépasse tous les autres de dix têtes… sauf que c'est lui qui paie la forêt entière.

## La conséquence qui retourne le cerveau

Un bon investisseur ne cherche pas d'abord à *éviter les pertes*. Il cherche à *ne pas rater LA ligne* qui justifie tout le fonds. Passer à côté du prochain Doctolib coûte bien plus cher que dix faillites à 0.

> **Mythe démonté — « le VC, c'est trop risqué. »** Mauvais angle. Ce qui compte, c'est l'**asymétrie** : tu ne peux perdre que 1× ta mise, tu peux en gagner 50. On perd souvent, petit ; on gagne rarement, énorme.`,keyTakeaways:["La moyenne ne décide rien, l'extrême décide tout.","Le vrai risque, c'est de rater l'exceptionnel, pas de perdre.","On accepte beaucoup de morts pour une licorne."],quiz:[{question:"Dans un portefeuille VC, le résultat est surtout déterminé par…",options:[{text:"La meilleure ligne",correct:!0},{text:"La moyenne des lignes",correct:!1},{text:"La pire ligne",correct:!1}],explanation:"Loi de puissance : une seule sortie exceptionnelle peut faire l'essentiel du fonds. On filtre et on réinvestit pour ne pas la rater."}],furtherReading:[{label:"Anatomie d'un portefeuille en loi de puissance",kind:"case",ref:"cs-power-law-portfolio"}]},"c-est-quoi-le-vc-vraiment":{body:`## Ni casino, ni banque

Trois choses que le venture n'est **pas** — et la seule qu'il est.

**Pas un prêt.** Une banque te prête et veut être remboursée, quoi qu'il arrive. Un VC **achète une part** de ta boîte ([[equity|equity]]) : si tu coules, il perd tout ; si tu décolles, il gagne gros. Même bateau.

**Pas un casino.** À la roulette, les probas sont figées et contre toi. Un VC **choisit**, **accompagne**, **ré-investit**. Le jugement change le résultat.

**Pas du court terme.** Il immobilise son argent 7 à 10 ans — c'est [[illiquidite|illiquide]]. On appelle ça du capital patient, et le mot n'est pas décoratif.

## En une phrase

Le venture, c'est une classe d'actifs **longue, illiquide, gouvernée par la loi de puissance** — et un métier : choisir tôt, sous incertitude, des fondateurs qui bâtiront peut-être des géants.

> **Mythe démonté — « les VCs parient sur des idées. »** Surtout au début, ils parient sur l'**équipe** : l'idée changera, les gens beaucoup moins.`,keyTakeaways:["De l'equity, pas de la dette.","Du jugement, pas du hasard.","Dix ans, pas dix mois."],quiz:[{question:"Qu'apporte un VC à une startup ?",options:[{text:"De l'equity (une part du capital)",correct:!0},{text:"Un prêt à rembourser avec intérêts",correct:!1},{text:"Une subvention sans contrepartie",correct:!1}],explanation:"Il devient copropriétaire : il gagne si la boîte prend de la valeur, il perd si elle coule. Même bateau que le fondateur."}],furtherReading:[{label:"Le VC européen contre le mythe de la Valley",kind:"case",ref:"cs-europe-vs-valley"}]},"le-voyage-de-l-argent":{body:`## De ton épargne au compte d'une startup

Suivons un billet de 100 € depuis une assurance-vie jusqu'à une jeune boîte. Il passe par trois mains.

**Main 1 — les [[lp|LPs]].** Les vrais propriétaires de l'argent : assureurs, fonds de pension, [[family-office|family offices]], [[fund-of-funds|fonds de fonds]], et l'État via {{bpifrance|Bpifrance}} ou le {{eif|Fonds européen d'investissement}}. Ton assurance-vie en fait peut-être partie sans que tu le saches. Ils acceptent de bloquer leur argent dix ans.

**Main 2 — le fonds, piloté par les [[gp|GPs]].** Les LPs ne choisissent pas les startups : ils confient l'argent à une équipe. Les GPs décident, et se rémunèrent via des [[management-fees|frais de gestion]] (~2 %/an) et une part des gains (le [[carry|carry]], ~20 %).

**Main 3 — les fondateurs.** Le fonds achète une part de la startup ; l'argent finance l'équipe et la croissance.

Et en solo : le [[business-angel|business angel]], un particulier qui investit son **propre** argent, souvent le premier à signer.

> **À garder en tête :** le GP gère l'argent **des autres** ; l'angel gère **le sien**.`,keyTakeaways:["LP = d'où vient l'argent.","GP = qui le pilote.","Angel = qui met le sien."],quiz:[{question:"Qui possède réellement l'argent d'un fonds ?",options:[{text:"Les LPs",correct:!0},{text:"Les GPs",correct:!1},{text:"Les fondateurs",correct:!1}],explanation:"Les GPs pilotent et décident, mais l'argent vient des Limited Partners (assureurs, fonds de pension, family offices, État)."},{question:"Un business angel investit…",options:[{text:"Son propre argent",correct:!0},{text:"L'argent des LPs",correct:!1},{text:"L'argent de l'État",correct:!1}],explanation:"C'est ce qui le distingue d'un GP, qui gère l'argent des autres."}],furtherReading:[{label:"Limited Partner (LP)",kind:"glossary",ref:"lp"}]},"la-grammaire-des-stades-decouverte":{body:`## Le vocabulaire qui situe une startup en trois secondes

Pré-seed, seed, Série A… Ce ne sont pas des ceintures de karaté. (Bon, un peu si.) Chaque mot dit **combien de preuves** la startup a accumulées.

- **[[pre-seed|Pré-seed]] (~1 à 1,5 M€).** Presque rien à montrer : une équipe, une intuition, un prototype. On parie sur les gens. Souvent un [[safe|SAFE]] ou un BSA-AIR.
- **[[seed|Seed]] (~2,5 à 3,5 M€, valo ~12-15 M€).** Les premiers signaux de [[traction|traction]]. On creuse l'équipe *et* les chiffres.
- **[[series-a|Série A]] (~10 à 15 M€).** La machine tourne — souvent ~2,5 M€ de revenu récurrent. On finance la mise à l'échelle.
- **Série B, C…** On accélère, les tickets s'envolent.

Fun fact qui dit tout sur l'époque : **la seed d'aujourd'hui ressemble à l'ancienne Série A.** La barre des preuves monte chaque année.

> **Mythe démonté — « lever = réussir. »** Non. Lever, c'est **céder une part** de ta boîte pour aller plus vite. C'est un moyen, pas un trophée.`,keyTakeaways:["Chaque stade = un niveau de preuve.","Plus tard = plus de preuves, moins de risque.","Lever n'est pas un trophée, c'est un moyen."],quiz:[{question:"À quel stade parie-t-on surtout sur l'équipe, faute de chiffres ?",options:[{text:"Le pré-seed",correct:!0},{text:"La Série C",correct:!1},{text:"L'IPO",correct:!1}],explanation:"Au tout début, l'équipe est presque la seule donnée fiable : pas (encore) de traction à analyser."}],furtherReading:[{label:"Simuler la dilution",kind:"simulator",ref:"dilution"},{label:"Pre-money / Post-money",kind:"simulator",ref:"pre-post-money"}]},"le-vrai-job-et-les-mythes":{body:`## Le métier, sans le vernis LinkedIn

Oublie le cliché : le type en sweat qui signe des chèques entre deux cafés. La vraie journée ressemble à autre chose.

**Le temps.** ~50 à 60 h/semaine. Pas l'enfer de la banque d'affaires (80-100 h) — les week-ends sont souvent préservés — mais pas un *lifestyle job* non plus : tu es **toujours un peu en service** (événements, dîners fondateurs, lecture le dimanche, charge mentale du portefeuille).

**Ce que tu fais vraiment** (surtout junior) : du [[deal-sourcing|sourcing]], du screening, des appels fondateurs, de la recherche marché, de la [[dd|due diligence]], des mémos. Sur ~1 000 dossiers vus dans l'année, un fonds en finance **3 à 5**.

> **La vérité qui pique :** ton métier, c'est surtout **dire non**. Bien, vite, avec respect — et sans rater la perle. Signer un chèque, c'est 1 % du temps.

## Le feedback loop le plus lent du monde

Tu sauras si tu avais raison dans… 7 à 10 ans. Aucun score quotidien. Il faut aimer décider sans confirmation immédiate, accepter de **se tromper en public**, et porter seul une conviction à laquelle personne ne croit encore.

## La texture française

Petit écosystème : **tout le monde se connaît**, ta réputation est ton actif n°1. Très parisien — mais Lyon, Station F et les régions montent. Relationnel avant d'être transactionnel : [[warm-intro|warm intros]], dîners, culture du « tu ». Toile de fond de capital public ({{bpifrance|Bpifrance}}, {{eif|Fonds européen d'investissement}}) qui n'existe pas vraiment aux États-Unis.

> **Mythe démonté — « entrer en VC, c'est une voie royale balisée. »** Faux : peu de postes, beaucoup de candidats, chemins non-linéaires. Le différenciateur : **prouver que tu penses déjà comme un investisseur** — une analyse de startup que tu as écrite toi-même vaut mille lignes de CV.`,keyTakeaways:["~50-60 h/semaine, mais « always on ».","Le métier, c'est surtout dire non — signer, c'est 1 % du temps.","En France, ta réputation est ton CV."],quiz:[{question:"Au quotidien, un VC junior passe le plus clair de son temps à…",options:[{text:"Chercher des boîtes et dire non",correct:!0},{text:"Signer des chèques",correct:!1},{text:"Siéger à des conseils d'administration",correct:!1}],explanation:"Sur ~1 000 dossiers, 3 à 5 financés : l'essentiel du métier junior, c'est sourcer et refuser bien."}],furtherReading:[{label:"Une semaine dans la vie d'un investisseur",kind:"lesson",ref:"l-vc-week"}]},"qui-fait-quoi-qui-gagne-quoi":{body:`## « Un VC », ça n'existe pas

Entre le stagiaire qui avale 40 decks par semaine et le partner qui signe le chèque, le mot « VC » recouvre cinq métiers. Une règle traverse l'échelle : **plus tu montes, moins tu exécutes et plus tu décides** — et plus ta rému dépend du [[carry|carry]].

- **[[analyst-vc|Analyst]] (0-2 ans).** Sourcing, recherche marché, pré-[[dd|DD]], data, support. Il prépare, il ne décide pas. ~45-55 k€ base, ~70-100 k€ total. Carry rare.
- **[[associate-vc|Associate]] (2-4 ans).** Mène le process : sourcing → calls fondateurs → DD → reco. ~60-90 k€ base. Carry parfois, modeste.
- **Senior Associate (3-5 ans).** Pilote la DD de bout en bout, mentore les analysts, parfois [[board-seat|board observer]]. N'existe pas dans tous les fonds.
- **[[principal-vc|Principal]] (5 ans +).** Source *et* porte des deals jusqu'au [[ic|comité]], négocie, siège au board. **Le carry devient significatif — le basculement.**
- **Partner / GP.** Décide, lève auprès des [[lp|LPs]], pilote la stratégie du fonds. Rému = surtout carry.

*Fourchettes indicatives Europe/France, très variables selon la taille du fonds (un seed fund de 30 M€ ne paie pas comme un late-stage d'1 Md€).*

## L'organisation, en une image

En bas de l'échelle, on **cherche et on exécute** ; en haut, on **décide et on lève**. Analysts et associates *préparent* la conviction ; principals et partners la *tranchent* — et l'assument devant les LPs.

> **Mythe démonté — « tout le monde touche le carry. »** Non : il ne devient une vraie source de revenu qu'à partir de **principal/partner**, après 7-10 ans, et seulement si le fonds performe. En VC, on s'enrichit *lentement*, pas *vite*.`,keyTakeaways:["Plus tu montes, plus tu décides et moins tu exécutes.","Le carry récompense la patience et le risque, pas l'ancienneté seule.","Grades et chiffres varient énormément d'un fonds à l'autre."],quiz:[{question:"Le carry (la part des plus-values) devient une vraie source de revenu à partir de…",options:[{text:"Principal / partner",correct:!0},{text:"Analyst",correct:!1},{text:"Associate",correct:!1}],explanation:"Les juniors vivent surtout du salaire + bonus ; le carry récompense la patience et le risque, après 7-10 ans et si le fonds performe."}],furtherReading:[{label:"Les échelons du métier : analyst → principal",kind:"lesson",ref:"l-career-levels"}]},"un-fonds-nait-et-meurt-aussi":{body:`## Un fonds, c'est une promesse de dix ans

Un fonds n'est pas une tirelire infinie : c'est une promesse faite à ses [[lp|LPs]]. Voici comment elle se déroule.

- **Années 1 à 3-4 — la [[investment-period|période d'investissement]].** Le fonds déploie l'argent et signe la plupart de ses premiers chèques.
- **Années 3 à 7 — le suivi ([[follow-on|follow-on]]).** Le fonds garde des réserves pour ré-investir dans ses gagnantes. On muscle les stars, pas les retardataires.
- **Années 7 à 10 — la récolte.** Les sorties (rachats, [[ipo|IPO]]) rendent l'argent aux LPs.

## La courbe en J

Au début, le fonds est dans le rouge (des frais, pas encore de sorties). Puis les gagnantes décollent et la [[j-curve|courbe en J]] remonte fort. D'où la patience obligatoire.

Conséquence maligne : tous les 2-3 ans, les GPs lèvent un **nouveau** fonds. Le venture est un métier de [[vintage|millésimes]] — comme le vin, un bon cru dépend autant du timing que du talent.

> **À retenir :** dix ans, courbe en J, millésimes. Le temps long n'est pas un défaut, c'est le modèle.`,keyTakeaways:["Un fonds vit ~10 ans : investir, suivre, récolter.","La courbe en J : le rouge précède le vert.","Le venture est un métier de millésimes."],quiz:[{question:"La « courbe en J » décrit…",options:[{text:"Le fait qu'un fonds perde de l'argent avant d'en gagner",correct:!0},{text:"La forme d'un logo de fonds",correct:!1},{text:"La croissance d'une seule startup",correct:!1}],explanation:"Frais d'abord, sorties ensuite : le rouge précède le vert. D'où la patience structurelle du métier."}],furtherReading:[{label:"Fund returns : DPI / TVPI / MOIC",kind:"simulator",ref:"fund-returns"}]},"le-pitch-gp-seduire-les-lps":{body:`## Pitcher son fonds n'est pas pitcher sa startup

Quand un fondateur pitche son projet à un VC, il vend de la croissance rapide, un produit innovant et une exécution agile. Quand un General Partner ([[gp|GP]]) pitche son fonds à un Limited Partner ([[lp|LP]]), il vend un **alignement d'intérêts sur 10 ans**, une **discipline de gestion** et un **processus de décision reproductible**.

Les LPs (fonds de fonds, assureurs, family offices) confient des millions pour diversifier leur patrimoine. Ils cherchent des gestionnaires professionnels, pas des cowboys.

## Les quatre piliers du pitch GP

1. **La thèse d'investissement (Investment Thesis).** Pourquoi ce secteur ? Pourquoi cette taille de fonds ? Pourquoi maintenant ? Une thèse trop large (« nous investissons dans la tech en Europe ») est éliminatoire. Le LP cherche un **expert chirurgical** sur un segment précis (ex: Série A en deeptech industrielle).
2. **Le Track Record.** C'est le nerf de la guerre. Les LPs veulent voir ton historique. Si c'est un premier fonds (*First-time fund*), le GP doit prouver son historique individuel (les investissements menés dans ses précédents postes, les sorties réalisées).
3. **Le Deal Flow & le réseau propriétaire.** Comment accèdes-tu aux meilleures opportunités de manière exclusive ? Si tu vois les mêmes deals que tout le monde, tu n'as pas d'avantage.
4. **La cohésion de l'équipe (Team Cohesion).** C'est le **risque n°1** pour les LPs sur les jeunes fonds : la séparation des associés au bout de 3 ans. Les LPs veulent des associés complémentaires qui ont déjà travaillé ensemble.

## L'alignement : le GP Commitment

Un LP ne signera jamais si tu ne mets pas ton propre argent sur la table. C'est le **GP Commitment**. En général, les partners doivent investir personnellement entre **1 % et 2 %** de la taille du fonds. Pour un fonds de 100 M€, cela représente 1 à 2 M€ apportés par l'équipe. C'est la preuve ultime que tu crois à ta thèse et que tu partages le risque.`,keyTakeaways:["Pitcher des LPs demande de vendre de la discipline et un processus reproductible sur 10 ans.","Les LPs évaluent en priorité la clarté de la thèse, le track record et la cohésion de l'équipe.","Le GP Commitment (1-2 % de la taille du fonds) est indispensable pour aligner les intérêts."],quiz:[{question:"Qu'est-ce que le GP Commitment ?",options:[{text:"La part de capital apportée personnellement par les gestionnaires (GPs) du fonds",correct:!0},{text:"L'engagement écrit des LPs de financer le fonds",correct:!1},{text:"Le salaire fixe garanti des partenaires",correct:!1}],explanation:"Le GP Commitment exige que les gérants investissent 1 % à 2 % de la taille du fonds avec leur propre argent, garantissant ainsi l'alignement d'intérêts avec les LPs."}],furtherReading:[]},"process-de-levee-gp-teaser-closing":{body:`## Le calendrier d'une levée GP

Lever un fonds VC prend en moyenne **12 à 18 mois**. Le process est jalonné par des documents et des étapes très codifiées.

- **Le Teaser.** Un document de 1 à 2 pages résumant la thèse, la taille cible, l'équipe et le track record. Il sert à ouvrir la porte.
- **Le Pitch Deck de fonds.** Un jeu de 20-30 slides détaillant la thèse, la construction de portefeuille (combien de lignes, montant du ticket initial, réserves de follow-on), et l'économie du fonds.
- **Le Private Placement Memorandum (PPM).** Le document juridique central (50 à 100 pages) qui décrit en détail la stratégie, les risques juridiques, et les termes du Limited Partnership Agreement ([[lpa|LPA]]).
- **La Data Room.** Un espace sécurisé contenant le modèle financier du fonds, les rapports d'audit passés, et les références de l'équipe.

## La Due Diligence LP : une enquête policière

La diligence d'un LP institutionnel est bien plus longue et formelle que celle d'un VC sur une startup. Elle s'articule autour de deux volets :

**1. Investment Due Diligence.** Analyse mathématique fine du track record (recalculer l'[[irr|IRR]] et le [[tvpi|TVPI]] brut/net de chaque deal passé, vérifier l'attribution de performance de chaque partner).
**2. Operational Due Diligence (ODD).** Audit juridique, comptable et de conformité. Les LPs vérifient comment l'argent est appelé, les signatures bancaires, les processus KYC/AML et la cybersécurité.

> **Les Reference Calls : le verdict.** Les LPs vont passer des dizaines de coups de fil. Ils appelleront les fondateurs de startups que tu as financés (pour savoir si tu es vraiment d'une aide ou une nuisance) et tes anciens collègues.

## Le premier et le dernier Closing

Un fonds n'attend pas d'avoir réuni la totalité de sa taille cible pour commencer à travailler.
- **First Close (Premier closing).** Dès que le GP a sécurisé au moins 30 à 40 % de la taille cible (ex: 30 M€ pour un fonds de 80 M€), il réalise un premier closing. Cela lui permet d'activer le fonds, d'appeler le capital et de signer ses premiers investissements.
- **Final Close (Closing final).** Le GP a généralement 12 mois après le premier closing pour atteindre sa taille cible finale et clôturer la levée.`,keyTakeaways:["Lever un fonds VC est un marathon de 12 à 18 mois structuré autour du Teaser, du Deck et du PPM.","La due diligence LP est ultra-rigoureuse : elle scrute le track record réel et mène des reference calls poussés.","Le First Close permet de lancer les investissements avant que la levée globale ne soit bouclée."],quiz:[{question:"Qu'est-ce que le First Close (premier closing) pour un fonds ?",options:[{text:"L'étape qui permet de lancer le fonds et d'investir dès qu'une partie du capital cible est sécurisée",correct:!0},{text:"La date limite de signature des contrats avec les startups",correct:!1},{text:"L'évaluation finale des performances des associés",correct:!1}],explanation:"Le First Close permet au GP d'appeler du capital et de commencer à déployer le fonds dès qu'un montant minimal (souvent 30-40 %) est sécurisé, sans attendre le closing final."}],furtherReading:[]},"trouver-convaincre-lps-france":{body:`## Le paysage des LPs en France et en Europe

En France et en Europe, le marché des Limited Partners est caractérisé par deux acteurs publics pivots très puissants et un tissu d'acteurs privés très structuré.

### 1. L'incontournable acteur public : Bpifrance
{{bpifrance|Bpifrance}} est le premier investisseur dans les fonds de capital-risque en France. À travers son activité de **fonds de fonds**, elle est présente dans la majorité des véhicules de la place.
- **Leur rôle :** Valider et labelliser ton projet. Avoir Bpifrance à ton premier closing est un signal de réputation massif (*signaling effect*) pour attirer les autres LPs.
- **Comment les convaincre :** Ils regardent de très près l'intérêt pour l'économie française, la rigueur de ton process de due diligence, et exigent souvent une contrepartie d'investissement territorial (investir un multiple de leur mise dans des startups françaises).

### 2. Le géant européen : Le Fonds Européen d'Investissement (EIF / FEI)
Le {{eif|EIF}} (Fonds Européen d'Investissement), filiale de la Banque Européenne d'Investissement (BEI), est le principal moteur du capital-risque à l'échelle européenne.
- **Leur rôle :** Agir en tant qu'investisseur ancré pour structurer le marché européen. Ils apportent des tickets très importants (parfois 20 à 40 M€) pour aider les fonds à atteindre leur taille critique.
- **Comment les convaincre :** L'EIF est extrêmement sensible à la conformité réglementaire, aux politiques de diversité de l'équipe et à l'alignement avec les priorités de la Commission Européenne (transition écologique, souveraineté numérique, deeptech). Leur processus de due diligence opérationnelle (ODD) est l'un des plus rigoureux au monde.

### 3. Les LPs institutionnels : Assureurs et Mutuelles
Des acteurs comme AXA, CNP Assurances, Allianz, ou des mutuelles (MGEN, MACIF) allouent une fraction de leurs actifs au non-coté (le *private equity* et le VC).
- **Leurs contraintes :** Ils sont soumis à la réglementation **Solvabilité II**, ce qui rend le capital-risque très coûteux pour eux en termes d'exigences de fonds propres. Ils préfèrent donc les fonds plus matures (Série A et au-delà) et les gros tickets (souvent minimum 5 à 10 M€).

### 4. Les Family Offices et Corporate Venture (CVC)
Les family offices (qui gèrent la fortune de grandes familles industrielles ou d'entrepreneurs tech à succès) et les fonds d'entreprises (CVC) sont plus agiles.
- **Comment les convaincre :** Ils cherchent souvent des **synergies stratégiques** (comprendre un marché en avance) ou du co-investissement (pouvoir investir en direct dans les startups de ton portefeuille à des conditions préférentielles).

## Astuces pour identifier et aborder les LPs

- **France Invest (Association des VCs et LPs en France) :** C'est l'annuaire de référence. Assister aux événements de France Invest est précieux pour networker directement avec les responsables des allocations d'actifs (*LPs relations*).
- **Analyser le portefeuille des concurrents :** Regarde les fonds français et européens comparables au tien et cherche les communiqués de presse de leurs closings. Les LPs institutionnels et publics y sont souvent cités.
- **Le warm networking :** Tout comme pour les startups, les LPs reçoivent des cents de dossiers. Une introduction par un GP respecté d'un autre fonds (non concurrent) ou par un entrepreneur de renom est le meilleur moyen d'obtenir un rendez-vous.

## Secrets de négociation avec un LP français ou européen

- **Le "First-time Fund" discount :** Si c'est ton premier fonds, propose un tarif préférentiel sur les frais de gestion (*management fees*) aux LPs qui s'engagent dès le premier closing (ex: 1,75 % au lieu de 2,00 %).
- **Le Co-investment Right (Droit de co-investissement) :** Accorde aux gros LPs le droit d'investir en direct, sans frais ni carry additionnels, dans tes meilleurs deals à côté du fonds. C'est l'argument ultime pour les family offices.`,keyTakeaways:["Bpifrance et l'EIF sont les deux pivots publics incontournables pour structurer et valider un fonds en Europe.","Les assureurs et mutuelles visent de gros tickets mais font face aux contraintes réglementaires de Solvabilité II.","Proposer des droits de co-investissement et des frais réduits au premier closing (founder share class) sont des leviers majeurs."],quiz:[{question:"Quel avantage recherché par les Family Offices les pousse souvent à investir dans un fonds VC ?",options:[{text:"Le droit de co-investir en direct dans les futures startups du portefeuille à côté du fonds",correct:!0},{text:"Une garantie de remboursement de leur capital par l'État",correct:!1},{text:"La possibilité de gérer eux-mêmes les investissements du fonds",correct:!1}],explanation:"Les family offices apprécient beaucoup les droits de co-investissement (co-investment rights) qui leur permettent d'investir en direct dans des startups qualifiées par le GP sans double couche de frais/carry."}],furtherReading:[]},"standard-francais-galion-france-invest":{body:`## La standardisation des levées de fonds en France

En France, pour simplifier les négociations et réduire les frais juridiques, l'écosystème s'est structuré autour de modèles de référence, principalement portés par le **Galion Project** et **France Invest**.

Ces standards s'adaptent aux spécificités du droit des sociétés français, généralement sous la forme d'une Société par Actions Simplifiée (**SAS**). Au lieu de statuts complexes et modifiés à chaque tour, c'est le **Pacte d'Actionnaires** qui régit confidentiellement les relations entre associés. Voici le décryptage clause par clause des termes incontournables.

---

## 1. Clauses Économiques et Financières

### La valorisation (Pre-Money et Post-Money)
- **La clause standard :** *« La valorisation pre-money de la Société est fixée à [X] euros sur une base pleinement diluée (fully diluted). »*
- **Le mécanisme :** La valorisation pre-money détermine le prix d'émission des actions nouvelles. Le terme « pleinement diluée » signifie que cette valorisation englobe toutes les actions existantes ainsi que tous les instruments dilutifs émis ou à émettre (comme les **BSPCE** attribués aux salariés ou un pool d'options à créer pour de futurs recrutements). Le pool d'options à créer vient donc diminuer la part des fondateurs existants *avant* l'arrivée de l'investisseur.

### La clause de répartition des produits de cession ([[liquidation-preference|Liquidation Préférentielle]])
- **La clause standard :** *« En cas de liquidation ou de vente de la Société, les titulaires d'Actions de Préférence bénéficieront d'une priorité de distribution égale à 1x leur investissement initial (non-participating). »*
- **Le mécanisme :** C'est la clause protectrice des investisseurs en cas de vente décevante. Le standard de place en France est la préférence **1x non-participating** (ou simple). Lors d'un événement de liquidité, l'investisseur choisit l'option la plus favorable : soit il récupère en priorité son investissement initial (1x), soit il convertit ses Actions de Préférence (ADP) en actions ordinaires pour se faire payer au prorata de sa détention. Les clauses « participating » (double-dip), où l'investisseur récupère sa mise *puis* sa part au prorata, sont fermement rejetées par les standards français car elles pénalisent excessivement les fondateurs.

### La clause de rattrapage ([[anti-dilution|Anti-dilution]])
- **La clause standard :** *« En cas d'émission ultérieure d'actions à un prix inférieur au prix de souscription initial, les investisseurs bénéficieront d'un ajustement de leur prix d'acquisition selon la méthode de la moyenne pondérée (weighted average). »*
- **Le mécanisme :** Si la société réalise une levée future à une valorisation plus basse (*down round*), les investisseurs actuels reçoivent gratuitement de nouvelles actions pour compenser la perte de valeur théorique de leur mise. En France, le standard impose la formule de la **moyenne pondérée** (qui prend en compte le montant levé et le nombre d'actions émises à bas prix) plutôt que le *full ratchet* (qui réajuste tout le prix au cours le plus bas, très punitif pour les fondateurs). Techniquement, cela se traduit par l'émission de bons de souscription d'actions (**BSA**) de rattrapage gratuits.

---

## 2. Clauses de Gouvernance et de Contrôle

### La composition du Comité de Direction ([[board-seat|Board]])
- **La clause standard :** *« Il sera constitué un Comité de Direction composé de [X] membres : [Y] représentants nommés par les fondateurs, [Z] nommés par les investisseurs, et [W] membres indépendants nommés d'un commun accord. »*
- **Le mécanisme :** La souplesse de la SAS permet d'organiser la gouvernance de manière sur-mesure. Au lieu d'un conseil d'administration classique, le pacte d'actionnaires crée un **Comité de Direction** (ou comité stratégique) restreint. La présence de membres indépendants est fortement préconisée pour apporter un regard extérieur neutre et débloquer les situations d'égalité.

### Les décisions importantes (Veto / Protective Provisions)
- **La clause standard :** *« Les décisions suivantes ne pourront être prises par la Société ou ses filiales sans l'accord préalable du Comité de Direction statuant à la majorité qualifiée (incluant le vote favorable d'au moins un représentant des investisseurs) : modification des statuts, émission de valeurs mobilières, emprunts majeurs, vente de la société... »*
- **Le mécanisme :** Même si les fondateurs restent majoritaires au capital et gèrent le quotidien de la startup, les investisseurs disposent de **droits de veto** sur les actes de disposition majeurs ou les changements de structure. Les standards français recommandent de limiter cette liste aux décisions purement stratégiques ou exceptionnelles pour ne pas paralyser la gestion opérationnelle journalière.

---

## 3. Clauses relatives aux Transferts de Titres (Pacte d'Actionnaires)

### Le droit de préemption
- **La clause standard :** *« Tout transfert d'actions par un actionnaire de la Société sera soumis au droit de préemption des autres actionnaires au prorata de leur participation. »*
- **Le mécanisme :** Si un associé souhaite céder ses titres à un tiers, il doit obligatoirement les proposer en priorité aux autres actionnaires actuels. En droit des sociétés français, cela évite qu'un tiers non désiré n'entre au capital d'une SAS fermée sans l'aval de la collectivité des associés.

### Les droits de sortie conjointe ([[tag-along|Tag-Along]] et [[drag-along|Drag-Along]])
- **Tag-Along (Sortie conjointe proportionnelle) :** Si un actionnaire majoritaire vend ses parts, les actionnaires minoritaires ont le droit de se joindre à la transaction et de vendre leurs actions aux mêmes conditions et au prorata de leur participation. Cela protège les minoritaires du risque de se retrouver bloqués avec un nouvel actionnaire de contrôle inconnu.
- **Drag-Along (Droit d'entraînement) :** En cas d'offre d'achat portant sur 100 % de la société (acceptée par une majorité qualifiée des associés et du Board), tous les actionnaires minoritaires sont obligés de céder leurs titres à l'acquéreur aux mêmes conditions. Cette clause est cruciale pour éviter qu'un actionnaire minoritaire récalcitrant ne bloque une vente totale de l'entreprise.

---

## 4. L'Alignement et le [[vesting|Vesting]] des Fondateurs

### L'acquisition progressive des actions
- **La clause standard :** *« Les actions détenues par les fondateurs feront l'objet d'un engagement d'acquisition progressive sur 4 ans, avec un cliff de 12 mois, puis une acquisition mensuelle de 1/36ème du solde. »*
- **Le mécanisme :** Juridiquement, les fondateurs français possèdent déjà leurs actions au moment de la levée. Pour mettre en œuvre le vesting, le Pacte d'actionnaires organise une **promesse de vente forcée** réciproque. Si un fondateur quitte la société avant le terme des 4 ans, il s'oblige à revendre ses actions « non acquises » (non vestées) à un prix prédéterminé dépendant des motifs de son départ.

### Le départ du fondateur ([[good-leaver-bad-leaver|Good Leaver / Bad Leaver]])
- **Good Leaver :** Concerne un départ justifié (maladie, invalidité, révocation injustifiée par le Board). Le fondateur sortant conserve la valeur économique de ses actions acquises et revend les actions non acquises au prix du marché.
- **Bad Leaver :** Concerne une faute grave, une fraude, ou une démission volontaire non approuvée. Le fondateur est contraint de céder ses actions non acquises (et parfois une partie de ses actions acquises) à la valeur nominale (quasiment nulle), ce qui sanctionne la rupture prématurée de son engagement.`,keyTakeaways:["En France, la term sheet se structure autour de la SAS et d'un Pacte d'Actionnaires (gouvernance souple via Comité de Direction).","La liquidation preference standard est de 1x non-participating (Galion), protégeant les fondateurs lors de l'exit.","Le vesting fondateur s'exécute juridiquement par une promesse de vente forcée d'actions en cas de départ (Good/Bad Leaver)."],quiz:[{question:"Dans le cadre du vesting des fondateurs en France, que se passe-t-il si un fondateur est qualifié de Bad Leaver lors de son départ ?",options:[{text:"Il est contraint de revendre ses actions non acquises à la valeur nominale (quasiment nulle)",correct:!0},{text:"Il conserve la totalité de ses actions sans aucune contrainte",correct:!1},{text:"La startup est dissoute automatiquement par décision de justice",correct:!1}],explanation:"La clause de Bad Leaver force le fondateur à céder ses parts non acquises à la valeur nominale, le privant de la plus-value pour protéger le reste de l'équipe et les investisseurs."},{question:"Quel est le standard de liquidation préférentielle préconisé par le Galion Project en France ?",options:[{text:"Une préférence 1x non-participating",correct:!0},{text:"Une préférence 2x participating (double-dip)",correct:!1},{text:"L'absence totale de priorité pour les investisseurs",correct:!1}],explanation:"Le standard du Galion Project impose la liquidation preference 1x non-participating, assurant un alignement sain où l'investisseur choisit de récupérer sa mise initiale OU de partager au prorata, sans cumuler les deux."}],furtherReading:[]}};export{e as default};
