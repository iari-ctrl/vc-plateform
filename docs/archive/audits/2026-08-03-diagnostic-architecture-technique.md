# Diagnostic d’architecture technique — archive historique

> **Archive historique non normative.** Ce document conserve la substance utile d’un diagnostic rétrospectif terminé sur le snapshot local du 2026-08-03. Il ne définit aucun workflow courant, aucun mécanisme de spécification actif et aucune source d’état maintenue. Pour l’état actuel, vérifier le code, les données, `CLAUDE.md`, `PRODUCT.md`, les documents d’architecture maintenus et `Suivis/ETAT.md`.
>
> Ancienne source retirée du dépôt courant : `specs/001-diagnostic-architecture-technique/research.md`. Empreinte SHA-256 de la source avant retrait : `edc45b69125d5ee031567e0e38a292f0129a0ab022327014305468d1c37d615a`.

## Périmètre et limites du snapshot

Le diagnostic inspecté portait sur le dépôt local `vc-platform`, branche `master`, au 2026-08-03. Il distinguait les faits courants, les interprétations et les recommandations. Les fichiers de `/home` et du wordmark étaient déjà modifiés avant l’analyse ; aucune conclusion visuelle finale n’était donc tirée de ces surfaces.

Les contrôles consignés dans le diagnostic étaient non destructifs : fraîcheur des dérivés, validation stricte du contenu, inventaire des routes en mémoire, lint et graphe d’imports construit en mémoire. Aucun build, serveur, preview, génération de contenu, commit, staging, push, workflow distant ou déploiement n’était exécuté dans ce lot.

Résultats utiles du snapshot :

- dérivés de leçons et glossaire cohérents sur le snapshot inspecté ;
- validation stricte du contenu positive ;
- inventaire en mémoire : 703 routes publiques, 3 routes noindex, aucun doublon public et aucune intersection public/noindex ;
- lint positif ;
- graphe d’imports applicatifs sans cycle confirmé ;
- deux pièces `.hermes/desktop-attachments/cartographie-commentee*.md` avaient la même empreinte SHA-256, signe d’une duplication exacte.

Ces résultats sont historiques. Ils ne prouvent pas l’état du worktree courant.

## Constats durables à conserver comme contexte

### Architecture générale

Le dépôt était décrit comme une application web statique : React, Vite, TypeScript, modules partagés ESM, contenus JSON canoniques dans `data/`, dérivés déterministes dans `data/generated/`, routes et politiques SEO réparties entre React, `shared/routes.mjs` et les scripts de collecte. Cette architecture restait cohérente avec le contrat local-first du produit.

Décision durable du diagnostic : ne pas recommander de backend, d’API, d’authentification ou de synchronisation distante par défaut. Un tel changement relève d’une décision produit et d’un chantier d’architecture distinct, avec modèle de sécurité et migration.

### Flux de contenu, routes et données locales

Le flux de contenu observé était : sources JSON canoniques → validation → dérivés scindés → modules `client/src/content/*` → pages, recherche et navigation. La séparation source/dérivé était jugée saine, avec un coût de maintenance à surveiller lors de l’ajout de nouvelles collections.

Le flux de routes était protégé par plusieurs représentations : routeur React, registres partagés, collecteur, sitemap et prérendu. La duplication était explicite et testée ; l’unification n’était recommandée que si les tests révélaient une dérive récurrente.

Le principal risque technique identifié concernait le cycle export/import/purge des données locales : certains propriétaires d’état mémoire pouvaient rester obsolètes après import ou purge ; l’export remplaçait certains domaines illisibles, invalides ou non migrés par `null` ; l’import exigeait la version courante exacte malgré l’existence de migrations dans plusieurs contrats.

### Documentation et gouvernance

Le diagnostic signalait deux familles de dette documentaire :

- `Suivis/ETAT.md` tendait à accumuler de l’historique alors qu’il se présente comme un instantané court et remplaçable ;
- certains documents pouvaient confondre route ou surface présente, capacité effectivement éprouvée et cible produit.

Décision durable : séparer dette documentaire et dette applicative. Une correction documentaire ne doit pas masquer un défaut technique tant que le flux concerné n’a pas été vérifié.

### Organisation et obsolescence

Le diagnostic ne confirmait aucun module de production mort. Les éléments à traiter prudemment étaient surtout des résidus ou artefacts de travail : politique de rétention de `.hermes/`, doublons d’attachements, revue racine déjà finalisée, entrées historiques Prisma dans `.gitignore`, méthodes `storage.get/set` dépréciées encore couvertes par des tests.

## Registre synthétique conservé

| ID | Catégorie | Sévérité historique | Fait utile conservé | Orientation neutre |
| --- | --- | ---: | --- | --- |
| `ARCH-001` | Architecture | LOW | SPA statique avec contrats cross-runtime purs et routes lazy. | Conserver tant qu’aucun besoin validé ne justifie une couche serveur. |
| `FLOW-001` | Flux | LOW | Pipeline canonique → validation → dérivés → rendu. | Préserver les contrôles de fraîcheur et validation stricte. |
| `BOUND-001` | Backend/API/Auth | LOW | Aucun backend, API métier, base distante ou auth observé dans le snapshot. | Maintenir la frontière publique ; spécifier tout changement. |
| `DATA-001` | Modèle | MEDIUM | Types TypeScript et schémas Zod maintenus séparément. | Évaluer un registre ou une dérivation avant extension de collections. |
| `DATA-002` | Persistance | HIGH | Import/purge ne notifiaient pas tous les propriétaires d’état. | Ouvrir un chantier local-data dédié avant de promettre une portabilité complète. |
| `DATA-003` | Persistance | HIGH | Export pouvait produire une sauvegarde amputée en remplaçant des domaines par `null`. | Signaler explicitement les domaines illisibles et migrer avant export. |
| `DATA-004` | Compatibilité | HIGH | Import exigeait la version courante exacte malgré des migrations. | Définir une stratégie de migration d’export/import. |
| `DATA-005` | Persistance | MEDIUM | Aperçu workspace incomplet et erreur possible hors résultat structuré. | Couvrir activités et indisponibilité de stockage par tests. |
| `ROUTE-001` | Couplage | MEDIUM | Router, patterns et collecteur portent des représentations distinctes. | Conserver à court terme ; unifier seulement si la dérive est démontrée. |
| `FRONT-001` | Frontend | MEDIUM | Plusieurs pages ou composants-écrans dépassaient 600–1 200 lignes. | Décomposer par flux testable, sans refonte générale par quota. |
| `DOC-001` | Documentation | HIGH | Risque de qualifier une surface présente comme livrée sans preuve d’usage. | Distinguer état observable, capacité éprouvée et cible. |
| `DOC-002` | Documentation | MEDIUM | `ETAT.md` accumulait plus d’historique que son rôle annoncé. | Conserver l’historique dans le journal et garder l’état remplaçable. |
| `DOC-003` | Documentation | HIGH | Le suivi pouvait surdécrire le rechargement local après import/purge. | Corriger seulement après preuve technique du flux. |
| `DOC-004` | Documentation | LOW | Une revue finalisée restait à la racine avec statut ambigu. | Archiver, marquer exécutée ou supprimer après décision. |
| `ORG-001` | Organisation | MEDIUM | `.hermes/` suivait des artefacts volumineux et deux pièces jointes identiques. | Définir propriétaire, rétention et statut normatif/non normatif. |
| `DEBT-001` | Maintenance | MEDIUM | Certification : forte surface de code pour gouvernance et évaluations inactives. | Geler l’extension tant que l’avenir de cette couche n’est pas décidé. |
| `OBS-001` | Dépendances | LOW | Aucun cycle ni module applicatif orphelin confirmé. | Ne pas supprimer de module sans preuve de consommation absente. |
| `OBS-002` | Hygiène | LOW | Méthodes storage dépréciées et résidus Prisma dans `.gitignore`. | Nettoyage ciblé après vérification des consommateurs. |

## Risques ouverts et propriétaires recommandés

| Risque | Propriétaire documentaire ou technique recommandé | Condition de clôture |
| --- | --- | --- |
| Cycle export/import/purge local incomplet (`DATA-002` à `DATA-005`) | chantier technique local-data, avec preuves dans les tests et suivi dans `Suivis/ETAT.md` après livraison | registre unique des domaines, migration avant export/import, invalidation de tous les propriétaires et erreurs explicites vérifiés |
| Types/schémas de collections maintenus séparément (`DATA-001`) | documents d’architecture et scripts de validation | parité ou registre assumé, avec tests de non-régression |
| Confusion état observable / capacité éprouvée / cible (`DOC-001`) | documents maintenus concernés, notamment architecture et état courant | formulations alignées sur l’état vérifié sans effacer l’historique append-only |
| Rôle de `ETAT.md` (`DOC-002`) | `Suivis/ETAT.md` | instantané court, journal réservé à l’historique |
| Politique de rétention des artefacts `.hermes/` (`ORG-001`) | règle de dépôt ou plan de maintenance local | propriétaire, durée de rétention et statut normatif/non normatif explicites |
| Couche certification inactive (`DEBT-001`) | documentation certification et futur chantier produit | décision de conserver, simplifier ou activer avec preuves adaptées |

## Décisions de recherche conservées

- Conserver l’architecture statique comme baseline tant qu’aucune exigence validée ne requiert une couche serveur.
- Traiter la portabilité locale comme premier risque technique transverse.
- Ne déclarer aucun module de production obsolète sans preuve de consommation absente.
- Séparer dette documentaire et dette applicative.

## Usage futur de cette archive

Cette archive peut servir à retrouver les constats et décisions d’un audit historique, mais elle ne doit pas être chargée comme instruction de session courante. Toute intervention doit repartir des autorités maintenues, de l’état courant et du worktree vivant.