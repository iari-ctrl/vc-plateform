# Spécification de fonctionnalité : Diagnostic d’architecture décisionnel

**Dossier de fonctionnalité** : `specs/001-diagnostic-architecture-technique`  
**Branche Git** : aucune  
**Créée le** : 2026-08-03  
**Statut** : Brouillon  
**Entrée** : « Produire une analyse structurée de l’architecture, des flux, des couches applicatives, des données, des conventions, de la dette et des risques ; distinguer faits observés, interprétations et recommandations ; identifier les règles candidates pour la Constitution et les évolutions exigeant une spécification distincte. »

## Contexte brownfield et périmètre *(obligatoire)*

### Comportement existant

Les autorités maintenues décrivent une plateforme française statique d’intelligence VC et de formation, alimentée par des contenus structurés, avec des données utilisateur conservées localement. Elles indiquent qu’aucun backend applicatif, aucune base distante, aucune API applicative et aucun mur d’authentification ne font partie du contrat courant. Ces affirmations documentaires doivent être confrontées au code, aux configurations, aux données et aux scripts actuels avant de devenir des faits de diagnostic.

L’architecture, les flux, les invariants et les risques sont répartis entre plusieurs autorités et surfaces d’implémentation. Le besoin est de disposer d’un diagnostic actuel, traçable et orienté décision, sans transformer une photographie du dépôt en nouvelle source de vérité durable. Le worktree local peut contenir des changements préexistants : ils doivent être observés sans être modifiés, attribués ni supprimés.

### Autorités consultées

- Demande utilisateur du 2026-08-03.
- `AGENTS.md` et `CLAUDE.md` pour le contrat opérationnel commun.
- `.specify/memory/constitution.md` et `.specify/memory/project-context.md` pour la gouvernance brownfield.
- `PRODUCT.md` et `docs/STRATEGIE-vc-intelligence.md` pour le contrat et la direction produit.
- `Suivis/ETAT.md` pour l’état vérifié et les risques à revalider, sans en faire une preuve suffisante du code courant.

### Périmètre

**Inclus** :

- cartographie de l’architecture globale et des flux principaux ;
- analyse du frontend, du statut réel du backend, du modèle de données, des interfaces assimilables à des API et de l’authentification ;
- analyse de l’organisation des dossiers, des dépendances internes, des patterns récurrents et des conventions ;
- détection des incohérences, duplications, couplages, modules obsolètes, dette technique et risques de maintenance ou d’évolution ;
- recommandations hiérarchisées, candidates de gouvernance pour une future Constitution et inventaire des évolutions qui exigent une spécification autonome ;
- registre de couverture et limites de preuve permettant de distinguer ce qui est vérifié, échantillonné, exclu ou impossible à conclure.

**Exclus** :

- toute correction ou refactorisation du code, des données, de la documentation maintenue ou de la Constitution ;
- création d’un backend, d’une API, d’une base de données, d’une authentification ou d’une nouvelle surface produit ;
- installation de dépendances, build, serveur, génération, tests avec cache ou toute commande susceptible d’écrire dans le dépôt ;
- audit de contenu proposition par proposition, validation praticienne, sécurité offensive, audit d’infrastructure distante ou publication ;
- commit, branche, staging, push, workflow distant et déploiement.

**Dépendances et reports** :

- le diagnostic dépend du snapshot local courant et des autorités maintenues à la date de l’analyse ;
- les comportements qui exigent une exécution avec effets de bord restent explicitement non vérifiés et sont reportés vers une preuve autorisée séparément ;
- toute recommandation de changement matériel doit être reformulée dans une fonctionnalité Spec Kit bornée avant implémentation ;
- une éventuelle modification de la Constitution relève d’une commande constitutionnelle explicite distincte.

### Compatibilité attendue

Le diagnostic ne modifie aucun comportement. Il doit préserver intégralement les URLs, identifiants, contenus publiés, données locales, artefacts générés et changements préexistants. Il doit évaluer les obligations de compatibilité sans déclencher de migration ni qualifier `localStorage` de stockage confidentiel ou synchronisé.

## Scénarios utilisateur et tests *(obligatoire)*

### Scénario utilisateur 1 — Comprendre le système actuel (Priorité : P1)

Un responsable produit ou technique consulte une cartographie vérifiable des couches, points d’entrée, flux de données, frontières et dépendances matérielles afin de comprendre ce qui existe réellement et ce qui n’est qu’une cible documentaire.

**Justification de la priorité** : aucune décision d’évolution ne doit partir d’une architecture supposée ou d’un document historique non revalidé.

**Test indépendant** : sélectionner chaque axe demandé et vérifier qu’il possède un statut de couverture, des faits sourcés, les limites de preuve et, lorsqu’elle est pertinente, une représentation du flux de bout en bout.

**Scénarios d’acceptation** :

1. **Étant donné** le snapshot local et les autorités maintenues, **quand** le diagnostic décrit une couche ou un flux, **alors** chaque affirmation factuelle renvoie à une preuve actuelle et les divergences documentaires sont nommées.
2. **Étant donné** une couche attendue mais absente du contrat courant, **quand** le diagnostic l’évalue, **alors** il distingue absence observée, absence documentaire et impossibilité de conclure.

---

### Scénario utilisateur 2 — Prioriser les risques et la dette (Priorité : P1)

Le mainteneur identifie les causes de dette qui augmentent le risque de régression, de couplage ou de maintenance, puis dispose d’un ordre de traitement justifié.

**Justification de la priorité** : le produit doit stabiliser ses conventions et ses flux critiques avant d’étendre ses couches.

**Test indépendant** : prendre chaque constat de sévérité haute ou critique et vérifier la présence d’une conséquence, d’une recommandation, d’une priorité, d’une dépendance et d’un critère de vérification.

**Scénarios d’acceptation** :

1. **Étant donné** plusieurs symptômes partageant une cause, **quand** le rapport les consolide, **alors** la cause est distinguée de ses manifestations et les doublons ne gonflent pas artificiellement le nombre de constats.
2. **Étant donné** une recommandation, **quand** sa priorité est examinée, **alors** elle est reliée à au moins un fait ou risque démontré et n’est pas présentée comme une correction déjà validée.

---

### Scénario utilisateur 3 — Encadrer les évolutions futures (Priorité : P2)

Le responsable du dépôt distingue les règles réellement transversales qui pourraient rejoindre la Constitution des choix propres à une fonctionnalité qui doivent rester dans une spécification séparée.

**Justification de la priorité** : une Constitution trop circonstancielle crée du couplage documentaire ; une évolution structurante sans spécification crée du risque produit et technique.

**Test indépendant** : vérifier que chaque proposition de gouvernance possède une portée, une justification, une autorité propriétaire et un verdict, et que chaque évolution structurante est associée à une raison explicite d’ouvrir une spécification autonome.

**Scénarios d’acceptation** :

1. **Étant donné** une règle candidate, **quand** elle est classée, **alors** le diagnostic distingue principe constitutionnel, convention maintenue, état courant et recommandation locale.
2. **Étant donné** une évolution vers un backend, une API, une authentification, une migration de données ou une rupture de route, **quand** elle est recommandée, **alors** elle est signalée comme nécessitant une décision produit et une spécification distincte avant toute modification.

### Cas limites

- Si le code et une autorité maintenue divergent, le diagnostic présente les deux états, qualifie l’autorité de chacun et ne résout pas implicitement le conflit.
- Si une famille volumineuse est générée, archivée, compilée ou dépendante, elle est inventoriée comme famille puis exclue ou échantillonnée avec justification ; elle ne disparaît pas du registre.
- Si un fichier change pendant l’analyse, les preuves qui en dépendent sont marquées périmées puis reprises sur le snapshot final, sans considérer le mouvement du worktree comme un défaut produit.
- Si une commande diagnostique peut écrire un cache, un artefact ou un fichier généré, elle n’est pas exécutée ; la limite de vérification est consignée.
- Si un chemin ou une configuration peut contenir un secret, le diagnostic ne révèle jamais sa valeur et ne rapporte que sa catégorie, son emplacement et son statut de suivi.
- Si un module semble obsolète sans preuve d’absence de consommateur, il est classé « candidat à confirmer » plutôt que « mort ».

## Exigences *(obligatoire)*

### Exigences fonctionnelles

- **FR-001** : Le diagnostic DOIT cartographier les couches, points d’entrée, frontières et dépendances qui structurent le système actuel.
- **FR-002** : Le diagnostic DOIT reconstruire les flux principaux depuis les sources propriétaires jusqu’aux validations, projections éventuelles, consommateurs, rendu et persistance locale.
- **FR-003** : Le diagnostic DOIT caractériser le frontend par ses routes, limites de composition, états partagés, familles de composants et modes de chargement, sans confondre présence de code et comportement exécuté.
- **FR-004** : Le diagnostic DOIT établir séparément le statut du backend, de la base distante, des interfaces assimilables à des API et de l’authentification, avec un niveau de preuve explicite pour chaque conclusion.
- **FR-005** : Le diagnostic DOIT inventorier les entités conceptuelles, relations, invariants, statuts de publication, contrats de compatibilité et obligations de migration qui gouvernent les données éditoriales et locales.
- **FR-006** : Le diagnostic DOIT évaluer l’organisation des dossiers et la direction des dépendances entre code applicatif, données, modules partagés, scripts, actifs publics, documentation et sorties dérivées.
- **FR-007** : Le diagnostic DOIT identifier les patterns récurrents utiles, les violations de conventions et les divergences entre comportement courant et autorités maintenues.
- **FR-008** : Le diagnostic DOIT rechercher les duplications, couplages forts, cycles ou dépendances transversales, ainsi que les modules potentiellement obsolètes, en distinguant preuve et suspicion.
- **FR-009** : Le diagnostic DOIT regrouper les incohérences, dettes et risques futurs par cause, portée, conséquence, sévérité et niveau de certitude.
- **FR-010** : Le diagnostic DOIT classer chaque recommandation par priorité, impact, effort relatif, dépendances et critère de vérification, sans appliquer de correction.
- **FR-011** : Le diagnostic DOIT fournir une liste distincte d’éléments candidats pour une future Constitution, avec portée, justification et autorité à modifier ; il NE DOIT PAS les intégrer automatiquement.
- **FR-012** : Le diagnostic DOIT fournir une liste distincte des évolutions qui exigent une fonctionnalité Spec Kit autonome avant toute mise en œuvre.
- **FR-013** : Chaque constat factuel DOIT citer une preuve actuelle précise ; les interprétations et recommandations DOIVENT être reliées aux constats qui les motivent.
- **FR-014** : La restitution DOIT séparer explicitement les faits observés, les interprétations et les recommandations.
- **FR-015** : La restitution DOIT inclure un registre de couverture avec, pour chaque famille pertinente, un statut parmi vérifié, échantillonné, à approfondir, exclu ou impossible à vérifier.
- **FR-016** : Les constats partageant la même cause DOIVENT être consolidés tout en conservant la traçabilité de leurs manifestations.

### Exigences transverses

- **TR-001** : L’inspection de l’implémentation et la restitution finale DOIVENT rester strictement en lecture seule ; seuls les artefacts Spec Kit préparatoires de cette fonctionnalité peuvent être créés avant l’analyse.
- **TR-002** : La Constitution et les autorités maintenues applicables DOIVENT être traitées comme contraintes ; toute contradiction avec un MUST constitutionnel est critique.
- **TR-003** : Le diagnostic DOIT préserver les changements préexistants et refermer son analyse sur un statut Git final comparé au snapshot initial.
- **TR-004** : Les valeurs secrètes, données personnelles confidentielles et informations de deal non publiques NE DOIVENT jamais apparaître dans la restitution.
- **TR-005** : Les preuves historiques, les anciens audits, les artefacts de build et les documents d’état NE DOIVENT pas être présentés comme preuve suffisante du comportement courant sans revalidation.

### Entités clés *(si la fonctionnalité manipule des données)*

- **Axe de couverture** : domaine demandé, périmètre inspecté, statut de vérification, exclusions et questions ouvertes.
- **Flux** : origine, transformations, validations, consommateurs, persistance, frontière publique et modes d’échec.
- **Constat** : identifiant stable, catégorie, sévérité, preuve, interprétation, conséquence, certitude et portée.
- **Recommandation** : constats sources, priorité, impact, effort relatif, dépendances, critère de vérification et besoin éventuel d’une spécification autonome.
- **Candidat de gouvernance** : règle proposée, portée, autorité propriétaire, justification et décision attendue.

## Critères de succès *(obligatoire)*

### Résultats mesurables

- **SC-001** : 100 % des axes explicitement demandés possèdent un statut de couverture et une conclusion bornée, y compris lorsqu’ils sont absents, exclus ou impossibles à vérifier.
- **SC-002** : 100 % des constats factuels publiés comportent au moins une référence actuelle précise vers un fichier et des lignes, ou vers une commande en lecture seule et son résultat.
- **SC-003** : 100 % des constats critiques ou élevés comportent une conséquence, une recommandation priorisée et un critère de vérification.
- **SC-004** : 100 % des recommandations sont reliées à au moins un constat ou à une obligation constitutionnelle explicite ; aucune recommandation orpheline n’est présentée comme nécessaire.
- **SC-005** : 100 % des candidats de gouvernance et des évolutions structurantes sont classés respectivement vers l’autorité propriétaire ou vers une future spécification bornée.
- **SC-006** : Le registre final ne contient aucun identifiant dupliqué et chaque constat est classé une seule fois par cause principale, avec renvois vers ses manifestations.
- **SC-007** : Le statut Git final ne montre aucune écriture attribuable au diagnostic hors des artefacts Spec Kit explicitement créés pour préparer cette analyse.
- **SC-008** : La restitution permet de retrouver séparément les faits, les interprétations et les recommandations sans devoir inférer leur nature depuis le style rédactionnel.

## Hypothèses

- Le diagnostic porte sur le snapshot local disponible au moment de l’exécution, sans chercher à reconstruire l’architecture d’une version distante ou publiée.
- Les axes « backend », « API » et « authentification » doivent être analysés même si leur absence est confirmée ; une absence est un résultat, pas une section à omettre.
- Les familles volumineuses ou dérivées sont couvertes par inventaire déterministe et échantillonnage ciblé plutôt que par lecture exhaustive.
- Les recommandations sont décisionnelles et non exécutoires ; leur présence n’autorise aucune modification.

## Traçabilité et décisions

| Élément | Référence ou décision |
| --- | --- |
| Besoin ou priorité | Demande utilisateur du 2026-08-03 ; `PRODUCT.md` § Design Principles 1 et 4 ; `docs/STRATEGIE-vc-intelligence.md` § Priorités stratégiques restantes |
| Comportement de départ | Autorités listées ci-dessus, à confronter au code, aux données, aux scripts et aux configurations actuels |
| Décision produit à promouvoir après livraison | Aucune à ce stade ; les candidats seront proposés séparément et exigeront une décision explicite |
