# P0 — Relecture praticien des parcours

> **Pour Hermes :** exécuter la préparation en lecture seule par trois audits isolés, puis confier toute écriture à l’intégrateur de la session. Ne modifier aucun contenu pédagogique avant réception et qualification d’un retour praticien.

**Objectif :** produire un dossier de relecture professionnel, traçable et directement exploitable pour `analyst-foundations` et `venture-philanthropy-foundations`, avec un examen renforcé de Trait d’Union.

**État :** préparation locale finalisée ; revue humaine non encore obtenue. Le prochain acte P0 est l’envoi du dossier à un ou plusieurs praticiens compétents, puis la qualification de leurs retours dans un lot séparé.

**Architecture :** trois collecteurs en lecture seule couvrent respectivement Analyst Foundations, Venture philanthropie/Trait d’Union et le contrat transversal. L’intégrateur vérifie leurs constats contre les sources exécutables, recalcule les relations et charges déterministes, puis rédige un dossier unique. Les retours futurs d’un praticien seront intégrés dans un lot distinct.

**Socle :** Markdown maintenu, collections JSON sous `data/`, validateurs Node existants, application React/Vite statique et FR-only.

---

## 1. Contexte et décisions acquises

- C1 à C6 sont closes ; `Correction.md` ne doit pas être recréé.
- Path et Parcours désignent une même trajectoire ordonnée ; la Bibliothèque reste un inventaire filtrable.
- `p-analyst-foundations` et `p-venture-philanthropy-foundations` sont des formations ouvertes sans score global, résultat, badge, attestation, titre professionnel ni habilitation.
- `VC Analyst` reste une certification professionnelle en construction, sans évaluation active ni délivrance.
- Les données exécutables prévalent sur les archives de conception.
- La relecture praticien ne peut pas être simulée par un agent. Le présent lot prépare les preuves et les questions ; il ne prononce aucune validation professionnelle.

## 2. Périmètre maintenu

### Sources transversales

- `PRODUCT.md`
- `CLAUDE.md`
- `docs/ARCHITECTURE_EDITION.md`
- `docs/parcours/README.md`
- `Suivis/ETAT.md`

### Analyst Foundations

- `docs/parcours/ANALYST-FOUNDATIONS.md`
- `data/parcours.json` — `p-analyst-foundations`
- `data/courses.json`
- `data/lessons.json`
- `data/profileParcours.json`
- `docs/certifications/REFERENTIEL-VC-ANALYST.md`
- `docs/certifications/PROTOCOLE-PRODUCTION-ANALYST.md`

### Venture philanthropie et Trait d’Union

- `docs/parcours/VENTURE-PHILANTHROPIE.md`
- `data/parcours.json` — `p-venture-philanthropy-foundations`
- `data/courses.json`
- `data/lessons.json`
- `data/profileParcours.json`
- `data/diagnostics.json` — `diag-vp-entree`
- `data/caseStudies.json` — `cs-vp-insertion-3-regions` et `cs-vp-energie-des-vallees`
- `data/caseCorrections.json` — `corr-vp-trait-union`
- `data/deliverables.json` — exercices cumulatifs, escalade, atelier et `vp-recommandation-soutien`

## 3. Hors périmètre

- modification des données ou de la prose pédagogique publiée ;
- vérification juridique, fiscale, comptable ou safeguarding simulée ;
- recherche factuelle externe source par source ;
- production du classeur `.xlsx` ;
- production du fonds, de la bible du cas, de M1 ou des leçons Analyst candidates ;
- activation d’une certification, d’un score, d’un badge ou d’une délivrance ;
- redesign, nouvelle surface, nouveau simulateur, migration des axes ;
- commit, staging, push, workflow distant ou déploiement.

## 4. Graphe d’exécution

### Tâche 1 — Figer le baseline et les autorités

**Objectif :** conserver l’attribution des changements dans le worktree déjà modifié.

1. Capturer branche et statut sans nettoyer le dépôt.
2. Consigner les sources maintenues et les documents historiques.
3. Interdire toute écriture aux collecteurs parallèles.
4. Désigner cette session comme intégrateur unique des artefacts P0.

### Tâche 2 — Collecte parallèle en lecture seule

**Objectif :** produire trois paquets de preuves indépendants.

#### A. Analyst Foundations

- cartographier les sept séquences et 23 leçons ;
- vérifier objectifs, prérequis, statut public et limites professionnelles ;
- séparer faits confirmés, incohérences certaines et questions au praticien ;
- limiter la sortie à dix questions prioritaires.

#### B. Venture philanthropie / Trait d’Union

- cartographier les six cours, 21 leçons, diagnostic, cas, correction et livrables ;
- recalculer lecture, contributions, consolidations, jalon et options ;
- examiner les modèles à 13 semaines et 18 mois, les décisions alternatives et les 13 critères ;
- classer jusqu’à quinze questions par finance, impact, gouvernance et escalades professionnelles.

#### C. Contrat transversal

- vérifier les frontières formation ouverte / certification professionnelle ;
- contrôler absence de score, résultat ou délivrance implicite ;
- identifier les décisions produit acquises à ne pas rouvrir ;
- définir une grille de réception des futurs retours praticien.

### Tâche 3 — Vérification déterministe par l’intégrateur

**Objectif :** ne retenir aucun chiffre ou lien sur la seule déclaration d’un collecteur.

1. Extraire les deux parcours et leurs relations depuis les JSON canoniques.
2. Recalculer les nombres de séquences, leçons et minutes.
3. Vérifier toutes les références vers diagnostic, cas, correction et livrables.
4. Vérifier les statuts de publication et l’absence de relation certificative implicite.
5. Comparer les résultats aux deux référentiels maintenus.
6. Classer chaque écart comme contradiction certaine, point à clarifier ou question professionnelle.

### Tâche 4 — Dossier de relecture

**Créer :** `docs/reviews/2026-07-23-relecture-praticien-parcours.md`

Le dossier doit contenir :

1. mode d’emploi et limites de la relecture ;
2. fiche d’identité vérifiée de chaque parcours ;
3. carte de Trait d’Union et de ses pièces ;
4. tableau des constats confirmés ;
5. incohérences certaines, s’il en existe, sans correction silencieuse ;
6. questions au praticien, priorisées et formulées pour une réponse exploitable ;
7. grille de réponse : décision, justification, source ou expérience mobilisée, niveau de confiance, modification requise, responsable et date ;
8. critères de réception et règles d’intégration future ;
9. éléments explicitement hors périmètre.

Le ton reste correct, sobre, factuel et institutionnel. Le document distingue systématiquement fait, hypothèse, inférence et avis professionnel.

### Tâche 5 — Vérification et suivi

1. Contrôler par script que tous les IDs et chemins obligatoires apparaissent dans le dossier.
2. Vérifier les totaux calculés contre les sources exécutables.
3. Vérifier l’absence de formulation attribuant une validation au praticien avant retour réel.
4. Exécuter `git diff --check`.
5. Mettre à jour `Suivis/ETAT.md` comme état courant.
6. Ajouter une entrée append-only à `Suivis/JOURNAL.md` avec commandes, résultats et limites.
7. Ne lancer ni générateur ni build tant qu’aucune source produit n’est modifiée ; limiter les tests applicatifs aux deux suites de contenu directement concernées.

## 5. Résultats de la préparation

### Audits indépendants

Les trois audits en lecture seule ont été achevés puis vérifiés par l’intégrateur :

- Analyst Foundations : inventaire, prérequis, niveaux, exercices, quiz, durées et frontière avec `VC Analyst` ;
- Venture philanthropie / Trait d’Union : relations, charges, pièces, horizons financiers, correction et escalades ;
- contrat transversal : nomenclature Path/Parcours, formation ouverte, certification, publication et portée du mode `practitioner`.

### Constats déterministes intégrés

- Analyst : 7 séquences, 23 leçons publiées, 142 minutes de lecture, budget de parcours de 144 minutes, 318 minutes selon les durées des étapes et 326 minutes si la convention de 8 minutes est appliquée aux 23 mises en application ; 92 questions de quiz ; 9 leçons débutantes et 14 intermédiaires ; 7 étapes identiques dans les trois budgets et aucun aiguillage depuis un profil.
- Venture philanthropie : 21 leçons, 111 minutes de lecture de leçons, 1 350 minutes de contributions, 240 minutes de consolidation, 360 minutes de jalon et 240 minutes facultatives.
- Six points produit sont distingués de la revue professionnelle : budget Analyst incomplet ; budgets `low`, `medium` et `high` sans effet ; fiche d’escalade de 30 minutes omise ; 67 minutes de lecture requise hors leçons non agrégées ; classeur annoncé mais absent ; modèle à 18 mois arrêté en juin 2027 avant la troisième ouverture de juillet 2027.
- Trait d’Union conserve 13 catégories de pièces, 4 branches de correction et un jalon à 13 critères sans score.
- Le modèle mensuel Trait d’Union totalise 3,655 M€ d’encaissements et 6,269 M€ de décaissements, soit −2,614 M€ avant solde d’ouverture, sans raccord explicite au besoin incrémental annoncé de 1,65 M€ ; cette question reste réservée au praticien finance/comptabilité.
- Les 24 parcours ne portent pas de champ `status`. Le mode local `practitioner` est une déclaration facultative hors plateforme, sans identité ni preuve de revue. Les listes locales de signes de délivrance exclus sont inégales ; l’invariant transversal complet prévaut.

### Gate ciblée finale

La gate ci-dessous a été rejouée après réception complète du batch `deleg_9daffe67` et intégration de ses constats tardifs.

- `node /tmp/vc-platform-p0-review-check.mjs .` : exit 0 ; relations, calculs, marqueurs du dossier et cohérence plan–état–journal vérifiés.
- `npm run validate:content:strict` : exit 0 ; 24 parcours, 1 certification, 27 cours, 129 leçons, 405 termes et 428 marqueurs cohérents.
- `npm run test --workspace client -- src/content/parcours.test.ts src/content/venturePhilanthropyLearning.test.ts` : exit 0 ; 2 fichiers / 13 tests.
- `git diff --check` sur le plan, le dossier et les deux suivis : exit 0.
- Aucun fichier n’est stagé ; aucun build n’est requis puisque les sources produit et les dérivés ne sont pas modifiés.

## 6. Critères de sortie

- [x] Les deux parcours possèdent une fiche fondée sur les sources exécutables.
- [x] Tous les chiffres publiés dans le dossier ont été recalculés ou reliés à une source précise.
- [x] Trait d’Union est relié à son diagnostic, ses 21 contributions, ses exercices cumulatifs, sa correction et son jalon.
- [x] Les contradictions certaines sont séparées des questions nécessitant un jugement professionnel.
- [x] Les limites juridique, fiscale, comptable, données et safeguarding sont explicites.
- [x] Le dossier ne confond jamais parcours ouvert, autoévaluation et certification professionnelle.
- [x] Aucun contenu pédagogique ou généré n’est modifié.
- [x] Les trois paquets de preuves parallèles sont vérifiés par l’intégrateur.
- [x] `ETAT.md`, `JOURNAL.md` et le présent plan décrivent le même état.
- [x] Aucun commit, push, workflow distant ou déploiement n’est exécuté.

## 7. Phase suivante, après retour réel

Un lot distinct qualifiera chaque retour en quatre catégories : correction certaine, décision produit, avis professionnel à documenter ou absence de changement. Les sources pédagogiques ne seront modifiées qu’après cette qualification et une preuve RED ciblée lorsque le changement affecte une règle exécutable.
