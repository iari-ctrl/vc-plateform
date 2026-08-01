# Axe Analyst Seed × Lead × SaaS — plan d’implémentation

> **Pour Hermes :** exécuter ce plan avec une orchestration multi-agent plate, puis une intégration et une clôture centralisées. Les agents de recherche et de revue restent en lecture seule ; un seul agent écrit les données canoniques.

**Objectif :** publier les six leçons déjà modélisées qui rendent la configuration Analyst `Seed × Lead × SaaS` entièrement lisible, sans activer l’évaluation professionnelle ni produire M1.

**Architecture :** quatre travaux indépendants peuvent avancer lors de la première vague : trois recherches de sources aux périmètres disjoints et un contrat de test RED dans un nouveau fichier. Après consolidation des résultats, un seul rédacteur intègre les six leçons dans `data/lessons.json` et les durées des trois cours ; les fichiers générés, compteurs, documents de suivi et vérifications finales restent la propriété exclusive de la session pilote.

**Socle technique :** JSON canonique, registres de glossaire, TypeScript/Vitest, validation Zod, split des leçons, sitemap et prérendu strict Vite.

---

## 1. Synthèse du problème

Les six entrées existent déjà, sont reliées aux trois cours et à la certification, mais restent `upcoming` avec `readMin: 0` et sans corps :

- Seed : `l-stage-seed-commercial`, `l-stage-seed-financing` ;
- Lead : `l-role-lead-dd`, `l-role-lead-closing` ;
- SaaS : `l-specialty-saas-metrics`, `l-specialty-saas-gtm`.

Le lot doit conserver les identifiants, slugs, cours, ordres, contextes, prérequis, `optional: true` et `assessmentId`. Il ne crée ni cours, parcours, cas, livrable, mission M1, schéma, composant ou route manuelle. La certification demeure `in-construction` et le titre reste `VC Analyst` ; les options restent un supplément distinct.

Décisions d’architecture à figer par la session pilote, sans les soumettre à plusieurs agents :

1. même contrat éditorial pour les six leçons : 900–1 400 mots pédagogiques hors références, sections `Cadre`, `Méthode`, `Exemple` ou `Cas d’application`, `Limites et points de contrôle`, `Mise en application`, puis une unique section `Références` ;
2. `readMin = ceil(nombre total de mots du body / 180)` ; 3 à 5 acquis clés ; 4 questions de quiz, 3 choix et une seule bonne réponse ;
3. deux à quatre sources exactes par leçon, inspectées proposition par proposition ; chiffres, seuils et pratiques géographiques explicitement bornés ; exemples synthétiques signalés comme méthodologiques, jamais comme benchmarks ;
4. les leçons Lead décrivent la contribution de l’Analyst dans un fonds lead — préparation, coordination documentaire et suivi — sans lui attribuer la direction du processus, la négociation, le closing ou la responsabilité de board, exclus par le référentiel ;
5. les trois cours passent à `durationSource: "lesson-read-minutes"` et leur `durationMin` est recalculé depuis toutes leurs leçons publiées ;
6. les entrées de glossaire existantes sont réutilisées ; tout manque réellement nécessaire est décidé une fois au point de synchronisation et ajouté dans les deux registres, jamais par plusieurs agents.

Baseline observée le 2026-08-01 : 147 leçons indexées, 120 corps publiés et une configuration Seed–Lead–SaaS de 18 leçons uniques, dont 12 de préparation générale et 6 contextuelles. À périmètre inchangé, le lot ajoute 6 corps et 6 routes publiques ; les valeurs absolues doivent néanmoins être recalculées après gel du worktree.

Le worktree est déjà sale, notamment sur `data/courses.json`, les dérivés, les tests d’inventaire et `Suivis/`. La session d’exécution doit préserver ces changements, enregistrer les empreintes des fichiers critiques et interdire tout autre writer pendant l’intégration.

## 2. Dépendances entre tâches

| Étape | Dépend de | Sortie minimale |
| --- | --- | --- |
| P0 — Rebaseline et contrat central | état courant du dépôt | portée, fichiers propriétaires, empreintes, critères acceptés |
| P1 — Recherches Seed / Lead / SaaS | P0 | trois matrices de preuves disjointes |
| P1 — Test vertical RED | P0 | nouveau test ciblé, échec reproduit sur les six `upcoming` |
| P2 — Consolidation éditoriale | résultats officiels complets de P1 | sources retenues, conventions, glossaire et interfaces entre leçons |
| P3 — Rédaction canonique | P2 + RED conservé | six leçons publiées et trois durées de cours cohérentes |
| P4 — Alignement documentaire | P3 gelé | référentiel et architecture transverse à jour |
| P5 — Contre-revues | P3 + P4 gelés | audit de provenance et audit d’intégration, tous deux sans écriture |
| P6 — Corrections et intégration | résultats officiels complets de P5 | état final gelé, dérivés régénérés, gardes de compteurs alignés |
| P7 — Vérification et suivi | P6 | build, gate, recette, `ETAT.md` et `JOURNAL.md` à jour |

Aucun agent ne doit commencer P3 depuis un transcript partiel. La session pilote attend les quatre résultats officiels de P1, reproduit les constats retenus, puis publie un contrat de rédaction unique.

## 3. Tâches parallélisables

### Vague 1 — quatre agents au maximum

- **R1 — Recherche Seed**, lecture seule du dépôt, sortie dédiée `seed.md`.
- **R2 — Recherche Lead**, lecture seule du dépôt, sortie dédiée `lead.md`.
- **R3 — Recherche SaaS**, lecture seule du dépôt, sortie dédiée `saas.md`.
- **T1 — Contrat RED**, seul writer de `client/src/content/analystSeedLeadSaas.test.ts`.

Frontières anti-duplication : R1 traite la maturité des preuves et le financement seed ; R2 traite le rôle du fonds lead et la frontière de responsabilité de l’Analyst ; R3 traite les définitions et conventions SaaS. Les intersections sont seulement signalées dans une rubrique « interface avec les autres axes », sans être rédigées deux fois.

### Vague 2 — après gel des sources et de la documentation

- **V1 — Audit provenance, finance et périmètre**, lecture seule.
- **V2 — Audit intégration, publication et documentation**, lecture seule.

Ces deux revues peuvent être simultanées : V1 vérifie les propositions et calculs ; V2 vérifie les relations, statuts, durées, tests et limites de périmètre. Elles ne corrigent rien elles-mêmes.

## 4. Tâches séquentielles

1. **Session pilote :** relire `AGENTS.md`, `CLAUDE.md`, les deux documents maintenus de certification, le manuel d’édition, les six fiches et leurs prérequis ; enregistrer branche, statut, diff et SHA-256 des fichiers critiques. Suspendre l’exécution si un autre writer touche `data/lessons.json`, `data/courses.json`, le glossaire, les dérivés ou `Suivis/`.
2. **Session pilote :** figer les décisions ci-dessus et lancer la vague 1 dans un seul fan-out.
3. **Session pilote :** attendre les quatre résultats officiels ; vérifier les sources retenues ; résoudre les recouvrements Seed/SaaS et Seed/Lead ; approuver une liste fermée de termes de glossaire.
4. **Rédacteur canonique unique :** patcher exactement les six objets dans `data/lessons.json`, puis les trois objets de `data/courses.json`. S’il existe des lacunes de glossaire approuvées, mettre à jour `data/sources/canonical-glossary.json` et `data/glossary.json` dans la même passe. Ne pas générer les dérivés.
5. **Rédacteur documentaire unique :** mettre à jour uniquement `docs/certifications/REFERENTIEL-VC-ANALYST.md` et `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md`. Ne pas modifier l’archive `REFERENTIEL-ANALYST.md` ni la revue datée `docs/reviews/2026-07-31-cours-sans-lecon-publiee.md`.
6. **Session pilote :** relire les diffs, durcir si nécessaire le test vertical avec les URL et conventions finalement retenues, puis lancer V1 et V2 en lecture seule sur des empreintes gelées.
7. **Session pilote ou rédacteur canonique rappelé :** reproduire et corriger séquentiellement chaque constat accepté. Toute correction invalide la revue et les tests du fichier concerné.
8. **Session pilote, propriétaire exclusif des sorties transverses :** régénérer `data/generated/*`, mettre à jour les gardes d’inventaire existantes, générer le sitemap avec l’origine canonique, exécuter le build, le gate, la recette, puis seulement actualiser `Suivis/ETAT.md` et ajouter l’entrée de `Suivis/JOURNAL.md`.

## 5. Prompts individuels pour chaque agent

### Prompt R1 — Recherche Seed

```text
Tu travailles en lecture seule sur /Users/iar-witness/Documents/Projets/VC SITE/vc-platform.
Lis d’abord AGENTS.md et CLAUDE.md, puis les fiches l-stage-seed-commercial et l-stage-seed-financing dans data/lessons.json, leurs prérequis l-traction-unit-economics et lmv-pre-post-ownership, et docs/certifications/REFERENTIEL-VC-ANALYST.md.

Objectif : construire la matrice de preuves pour deux leçons Seed, sans rédiger ni modifier le produit. Couvre : qualité des premiers revenus, validation commerciale, usage répété et rétention avec peu d’historique ; ownership, montant du tour, burn/runway, jalons et dilution jusqu’au tour suivant. N’invente aucun benchmark universel et ne transforme pas une pratique américaine en norme française ou européenne. Tout exemple numérique doit être sourcé ou explicitement proposé comme exercice méthodologique fictif.

Frontière : ne définis pas en détail ARR/NRR/GRR/CAC/LTV ni le processus d’un fonds lead ; indique seulement les interfaces nécessaires avec les lots SaaS et Lead.

Pour chaque proposition, fournis : leçon/section visée, formulation proposée, source exacte HTTPS, date/version, géographie et population, support direct/partiel/non confirmé, limite d’usage, calcul ou convention à vérifier. Ajoute une liste des termes de glossaire existants à réutiliser et des lacunes possibles, sans éditer le glossaire.

Écris uniquement ~/.hermes/cache/vc-platform/source-research/seed-lead-saas/seed.md. Termine par les points de recouvrement à arbitrer par la session pilote. Réponds en français, registre sobre et factuel.
```

### Prompt R2 — Recherche Lead

```text
Tu travailles en lecture seule sur /Users/iar-witness/Documents/Projets/VC SITE/vc-platform.
Lis AGENTS.md, CLAUDE.md, l-role-lead-dd, l-role-lead-closing, leurs prérequis, l-dd-process, l-dd-legal, docs/certifications/REFERENTIEL-VC-ANALYST.md et docs/certifications/ARCHITECTURE-CERTIFICATIONS.md.

Objectif : construire la matrice de preuves pour « Plan de due diligence et préparation de la term sheet » et « Syndication, gouvernance et préparation du closing ». La ligne rouge est impérative : le référentiel exclut pour l’Analyst la direction du processus, la négociation, le closing et la responsabilité de board. Décris donc les travaux de préparation, registre, coordination documentaire, suivi des responsabilités et remontée des blocages sous supervision d’un niveau supérieur.

Privilégie les sources primaires ou professionnelles précises, en qualifiant leur caractère juridique, contractuel, indicatif ou non contraignant et leur portée France/Europe/internationale. Ne fournis pas de conseil juridique. Ne traite ni les métriques SaaS ni les critères propres au stade seed, sauf interface explicitement signalée.

Pour chaque proposition, fournis : leçon/section, formulation, source HTTPS exacte, date/version, juridiction ou population, support direct/partiel/non confirmé, limite, et frontière de responsabilité Analyst/Associate/Partner/conseils. Inventorie les termes de glossaire existants et les lacunes éventuelles sans les modifier.

Écris uniquement ~/.hermes/cache/vc-platform/source-research/seed-lead-saas/lead.md. Termine par une liste de formulations à proscrire parce qu’elles attribueraient à l’Analyst une responsabilité excessive. Réponds en français.
```

### Prompt R3 — Recherche SaaS

```text
Tu travailles en lecture seule sur /Users/iar-witness/Documents/Projets/VC SITE/vc-platform.
Lis AGENTS.md, CLAUDE.md, l-specialty-saas-metrics, l-specialty-saas-gtm, lmv-unit-economics, l-traction-unit-economics et les entrées de glossaire SaaS existantes.

Objectif : construire la matrice de preuves pour ARR, NRR, GRR, churn, CAC, LTV, marge brute, payback, cohortes, concentration et répétabilité du go-to-market. Pour chaque métrique, fixe numérateur, dénominateur, période, population, traitement des expansions/contractions/réactivations et cas où la métrique devient trompeuse. Pour le GTM, traite canal, segment, cycle, conversion, vélocité, pricing et capacité d’expansion sans imposer de seuil universel.

Frontière : ne traite pas le montant d’un tour seed, la trajectoire de dilution ni l’organisation du closing ; signale seulement les interfaces. Distingue clairement définitions comptables, conventions opératoires et benchmarks issus d’échantillons privés. Vérifie la date et la mutabilité des pages web.

Pour chaque proposition, fournis : leçon/section, définition ou méthode, formule, source HTTPS exacte, date/version, échantillon/géographie, support direct/partiel/non confirmé, limite et test de cohérence. Inventorie les termes de glossaire existants et les lacunes éventuelles sans les modifier.

Écris uniquement ~/.hermes/cache/vc-platform/source-research/seed-lead-saas/saas.md. Termine par une table des interfaces avec Seed. Réponds en français.
```

### Prompt T1 — Contrat de test RED

```text
Tu es l’unique propriétaire de client/src/content/analystSeedLeadSaas.test.ts dans /Users/iar-witness/Documents/Projets/VC SITE/vc-platform. Lis AGENTS.md et CLAUDE.md. Ne modifie aucun autre fichier, notamment data/, les tests existants, les dérivés ou Suivis/.

Crée un test Vitest vertical qui importe les sources canoniques et verrouille : les six IDs exacts ; leur rattachement, ordre, contextes, optional=true, prérequis et assessmentId ; status=published ; les six sections éditoriales ; 900–1 400 mots pédagogiques avant Références ; readMin=ceil(total des mots/180) ; 3–5 keyTakeaways ; 4 questions de trois choix avec une réponse exacte et explication ; absence d’une section body « ## À retenir » ; 2–4 liens HTTPS datés dans une section Références unique ; glossaryRefs non vide ; les trois cours en durée dérivée ; la composition Seed–Lead–SaaS reliée exactement aux six leçons.

N’impose pas encore des URL précises : elles seront ajoutées après la consolidation des matrices. Lance uniquement ce fichier et conserve la sortie RED montrant que les fiches sont encore upcoming. Un échec pour erreur de compilation du test n’est pas un RED valide : corrige le test jusqu’à obtenir un échec de comportement. Signale le seul chemin créé et la commande exacte.
```

### Prompt E1 — Rédacteur canonique unique

```text
Tu es le seul writer des données canoniques du lot dans /Users/iar-witness/Documents/Projets/VC SITE/vc-platform. Lis AGENTS.md, CLAUDE.md, docs/ARCHITECTURE_EDITION.md §4.0.c/§4.1, le contrat consolidé de la session pilote et les trois matrices approuvées.

Fichiers autorisés : data/lessons.json, data/courses.json et, uniquement si la session pilote a approuvé des lacunes précises, data/glossary.json avec data/sources/canonical-glossary.json. Tout autre fichier est interdit. Ne touche jamais data/generated/.

Remplace exactement les six fiches upcoming Seed, Lead et SaaS par des leçons publiées complètes. Préserve IDs, slugs, courseId, order, kicker, contexts, optional, prerequisiteLessonIds et assessmentId. Aligne les learningOutcomes sans élargir le périmètre. Applique le contrat commun de longueur, sections, quiz, acquis clés, readMin et sources. Les chiffres sont sourcés ou explicitement méthodologiques ; les formules SaaS et financement sont cohérentes et recalculables. Dans les leçons Lead, borne explicitement le rôle de l’Analyst.

Réutilise le glossaire ; si de nouvelles entrées ont été approuvées, garde les deux registres synchronisés et une provenance source-backed réellement inspectée. Mets les trois cours en durationSource=lesson-read-minutes et calcule durationMin depuis toutes leurs leçons publiées, y compris la leçon deeptech déjà publiée dans c-analyst-specialties.

Patch les régions ciblées sans réécrire aveuglément le fichier de 950 kB. Vérifie le round-trip JSON, npm run validate:content:strict et, si le glossaire change, npm run validate:glossary. Ne régénère rien et ne mets aucun compteur à jour. Rends la liste exacte des fichiers modifiés, les commandes et les limites restantes.
```

### Prompt D1 — Alignement documentaire

```text
Tu es l’unique writer de docs/certifications/REFERENTIEL-VC-ANALYST.md et docs/certifications/ARCHITECTURE-CERTIFICATIONS.md. Lis AGENTS.md, CLAUDE.md et l’état canonique final des six leçons. Ne modifie aucun autre fichier.

Mets les références maintenues en cohérence : les six leçons Seed–Lead–SaaS sont désormais publiées comme première configuration contextuelle complète ; les autres options restent progressives ; le titre VC Analyst, le supplément séparé, les trois axes et les 160 compositions restent inchangés ; la certification reste en construction ; document du fonds, bible, M1, évaluation, identité, jury et délivrance restent hors périmètre. Retire la rédaction de ces six leçons des listes « hors périmètre » devenues obsolètes.

Ne modifie ni l’archive REFERENTIEL-ANALYST.md ni les revues datées. N’annonce aucune validation praticienne ni activation qui n’a pas eu lieu. Exécute un contrôle ciblé des liens/chemins et git diff --check sur les deux fichiers, puis rends le diff fonctionnel en quelques points.
```

### Prompt V1 — Contre-revue provenance et calculs

```text
Travaille en lecture seule sur l’empreinte gelée communiquée pour /Users/iar-witness/Documents/Projets/VC SITE/vc-platform. Ne modifie aucun fichier.

Audite les six leçons proposition par proposition : ouvre chaque source exacte, vérifie date/version, géographie, population et soutien réel ; recalcule chaque exemple de rétention, ARR, NRR/GRR, CAC/LTV/payback, burn/runway, ownership et dilution ; contrôle les conventions de période, cohorte, marge et flux. Vérifie que les exemples synthétiques sont signalés et qu’aucun benchmark n’est universalisé. Pour Lead, vérifie que l’Analyst prépare et documente sans être présenté comme négociateur, responsable du closing ou du board.

Classe chaque constat : bloquant, important, mineur ou non retenu. Pour chaque constat retenu, cite ID de leçon, extrait, source ou calcul reproductible et correction minimale. Produis un rapport uniquement en sortie de session ; aucune correction directe et aucune affirmation de validation praticienne.
```

### Prompt V2 — Contre-revue intégration et publication

```text
Travaille en lecture seule sur l’empreinte gelée communiquée pour /Users/iar-witness/Documents/Projets/VC SITE/vc-platform. Lis AGENTS.md et CLAUDE.md. Ne modifie aucun fichier et ne régénère rien.

Vérifie : six IDs/slugs inchangés et publiés ; 21 autres leçons optionnelles encore upcoming ; optional=true et chaînes de prérequis intactes ; sélection Seed–Lead–SaaS de 18 leçons uniques, 18 disponibles et 0 à venir après génération ; durées des trois cours égales à la somme des leçons publiées ; glossaire cohérent dans les deux registres ; test vertical pertinent ; absence de changement de schéma, UI, route manuelle, cas, parcours, livrable ou activation de certification ; documents maintenus alignés et archives historiques laissées intactes.

Inspecte aussi le diff par rapport à la baseline sale et signale toute perte de changement préexistant ou tout fichier hors scope. Exécute seulement des contrôles read-only adaptés. Rends les constats avec chemin, preuve et sévérité ; ne corrige rien.
```

### Prompt de la session pilote / intégration finale

```text
Tu pilotes l’exécution complète du plan .hermes/plans/2026-08-01_104039-axe-analyst-seed-lead-saas.md. Tu es l’unique décideur d’architecture et l’unique propriétaire des fichiers générés, gardes de compteurs, sitemap, Suivis/ETAT.md et Suivis/JOURNAL.md.

Avant tout writer, rebaseline le worktree sale et gèle les empreintes. Lance la vague 1 en parallèle, attends ses résultats officiels complets, reproduis les preuves retenues, puis publie un contrat unique. Sérialise les writers E1 et D1. Lance V1 et V2 uniquement sur un état gelé, attends les deux résultats officiels, reproduis chaque constat retenu et corrige séquentiellement.

Après la dernière correction canonique, régénère une seule fois les dérivés, mets à jour les gardes d’inventaire depuis les sorties réelles, construis avec l’origine/base canoniques, exécute le gate post-build et recette l’artefact. Mets ETAT et JOURNAL à jour seulement après toutes les preuves finales. Préserve chaque changement préexistant. Aucun commit, staging, push, workflow distant ou déploiement.
```

## 6. Modèle et effort recommandés pour chaque agent

| Agent | Modèle | Effort | Motif |
| --- | --- | --- | --- |
| Session pilote | GPT-5.5 | xhigh | arbitrages, worktree sale, intégration transverse |
| R1 Seed | GPT-5.5 | high | recherche ciblée et conventions financières |
| R2 Lead | GPT-5.5 | high | sources juridiques/professionnelles et borne de rôle |
| R3 SaaS | GPT-5.5 | high | définitions, formules et comparabilité des métriques |
| T1 Test RED | GPT-5.5 | high | contrat vertical précis, code borné |
| E1 Rédaction canonique | GPT-5.5 | xhigh | cohérence de six leçons dans un fichier partagé critique |
| D1 Documentation | GPT-5.5 | high | alignement normatif borné à deux fichiers |
| V1 Audit provenance/calculs | GPT-5.6 | max | unique dépense forte justifiée par six leçons financières et une frontière juridique |
| V2 Audit intégration | GPT-5.5 | high | contrôle structurel et publication sans nouvelle architecture |

Architecture plate, profondeur 1. Concurrence maximale recommandée : 4 pendant la vague 1, puis 2 pendant la vague 2. Si la délégation Hermes impose un modèle unique aux enfants, exécuter la vague 1 sous GPT-5.5/high et réserver V1 à une session autonome séparée sous GPT-5.6/max.

## 7. Points de synchronisation

1. **S0 — Baseline gelée :** statut, fichiers non suivis, diffs et empreintes consignés ; aucun autre writer actif.
2. **S1 — Fin officielle de la vague 1 :** quatre résultats reçus ; le RED est comportemental ; chaque source retenue a été ouverte par la session pilote.
3. **S2 — Contrat éditorial unique :** plan section par section, conventions chiffrées, interfaces et liste fermée de glossaire approuvés avant E1.
4. **S3 — Données gelées :** E1 terminé ; la session pilote relit les quatre fichiers canoniques possibles et vérifie qu’aucun changement préexistant n’a disparu.
5. **S4 — Documentation gelée :** D1 terminé ; les deux références maintenues décrivent le même état que les données.
6. **S5 — Contre-revues officielles :** V1 et V2 reçues en totalité, constats reproduits, corrections acceptées ou rejetées avec motif. Toute empreinte changée invalide la revue correspondante.
7. **S6 — Barrière d’intégration :** plus aucun writer ; génération et gardes globales appartiennent exclusivement à la session pilote.
8. **S7 — Clôture :** build, gate post-build, recette et diff final verts ; seulement alors mise à jour de `ETAT.md` et `JOURNAL.md`.

## 8. Vérifications finales à centraliser dans une seule session

Ordre obligatoire sur l’état final gelé :

1. `npm run split:content` ; relever les comptes réels, puis aligner `client/src/content/lessons.test.ts`, `scripts/generated-content.test.mjs` et la liste publiée de `client/src/content/certifications.test.ts` sans écraser leurs diffs préexistants.
2. Test ciblé :
   ```bash
   npm run test --workspace client -- \
     src/content/analystSeedLeadSaas.test.ts \
     src/content/certifications.test.ts \
     src/content/lessons.test.ts
   ```
3. `npm run validate:content:strict` et `npm run validate:glossary`.
4. Build canonique, qui régénère sitemap et prérendu :
   ```bash
   VITE_BASE_URL=/vc-plateform/ \
   VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform \
   npm run build
   ```
5. `npm run check` **après** le build ; conserver séparément les exit codes et le résumé strict `ok: true`.
6. Vérifications statiques : six routes de leçon présentes dans le sitemap et dans `client/dist`, aucune route ajoutée pour les 21 options encore `upcoming`, durées de cours dérivées exactes, sélection Seed–Lead–SaaS à 18/18 disponibles et 0 à venir.
7. Recette base-aware de l’artefact : les trois pages de cours, les six routes de leçon, la Bibliothèque et `/certifications/analyste-en-capital-risque`. Contrôler au minimum une leçon de chaque axe en 1 440 × 1 000 et 390 × 844, références, quiz, termes liés, navigation et console vide.
8. Relecture finale des sources et calculs après toute correction tardive ; `git diff --check`, diff borné, statut et empreintes finales.
9. Mettre à jour `Suivis/ETAT.md` avec les comptes réellement produits et remplacer le risque « six leçons à produire » par l’état exact ; ajouter une entrée append-only à `Suivis/JOURNAL.md` avec uniquement les commandes réellement exécutées.
10. Signaler séparément : livraison technique/éditoriale, absence éventuelle de validation praticienne externe, changements préexistants préservés et actions non effectuées. Aucun commit, push, workflow ou déploiement.
