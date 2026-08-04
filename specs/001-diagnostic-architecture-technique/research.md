# Recherche — Diagnostic d’architecture décisionnel

**Snapshot inspecté** : 2026-08-03, dépôt local `vc-platform`, branche `master`.  
**Statut** : artefact de support ponctuel et non normatif. Les faits courants restent propriétaires du code, des données et des documents maintenus.

## 1. Méthode et frontière

### Faits observés

- Le worktree était déjà modifié dans `Suivis/ETAT.md`, `Suivis/JOURNAL.md`, trois composants du chrome/accueil et deux contrats DOM avant la création de cette fonctionnalité. Les nouveaux artefacts sont `.specify/feature.json` et `specs/001-diagnostic-architecture-technique/**`.
- Les changements préexistants portent principalement sur le wordmark et l’animation de `/home`; ils ne sont ni attribués au diagnostic ni utilisés comme preuve d’une livraison stable.
- L’inspection a exclu `node_modules`, `client/dist`, les sorties de couverture, les caches et les archives comme preuve du comportement courant.
- Aucun build, serveur, preview, génération de contenu, test susceptible d’écrire un cache, commit, staging, push, workflow distant ou déploiement n’a été exécuté.

### Contrôles exécutés

| ID | Commande / méthode | Résultat observé |
|---|---|---|
| C-01 | `git status --short --branch` | Branche `master`; sept fichiers préexistants modifiés; sélecteur et dossier de fonctionnalité non suivis. |
| C-02 | `node scripts/check-generated.mjs` | Exit 0; 147 leçons, 126 corps publiés et 420 termes; dérivés cohérents. |
| C-03 | `node scripts/validate-content.mjs --strict` | Exit 0; structure, références et 373 marqueurs cohérents; 24 parcours, 30 cours, 147 leçons, 420 termes, 703 routes publiques issues du collecteur contrôlé séparément. |
| C-04 | collecteur `collectRoutes` / `collectNoindexRoutes` exécuté en mémoire | 703 routes publiques, 3 routes noindex, zéro doublon et zéro intersection. |
| C-05 | `npm run lint` | Exit 0 sur client, scripts, modules partagés et hooks ESM; zéro avertissement. |
| C-06 | graphe d’imports construit en mémoire pour `client/src` et `shared` | 246 modules, 930 arêtes locales, aucun cycle; les trois imports initialement non résolus étaient des feuilles CSS, résolues au second passage; aucun module applicatif non-test sans consommateur, hors déclaration Vite. |
| C-07 | SHA-256 des pièces `.hermes/desktop-attachments/cartographie-commentee*.md` | Deux fichiers suivis distincts ont le même SHA-256 `4aff5f…934bee`; duplication exacte confirmée. |

### Interprétation

Le snapshot permet une analyse statique fiable des frontières et des contrats, mais pas une recette visuelle des fichiers de `/home` actuellement modifiés. Les validations positives prouvent la cohérence structurelle courante ; elles ne prouvent ni la maturité produit, ni l’absence de défaut comportemental sur les chemins non exécutés.

### Recommandation

Conserver cette distinction dans tout rapport final : preuve courante, preuve historique, intention documentaire et interprétation doivent rester séparées.

## 2. Architecture globale observée

### Faits observés

1. `client/src/main.tsx:1-33` monte une SPA React sous `BrowserRouter`, puis `ThemeProvider`, `UserDataProvider` et `UIProvider`; `App.tsx` déclare les routes et charge les pages par `lazy`.
2. `client/vite.config.ts:1-54` configure les alias `@`, `@data`, `@shared`, la base partagée et le découpage de chunks.
3. `package.json:10-34` sépare validation, génération, build et prérendu. `predev` et `prebuild` régénèrent les dérivés ; les commandes utilisées dans cet audit contournent ces hooks d’écriture.
4. `shared/base-url.mjs` et `shared/routes.mjs:1-212` portent les contrats purs utilisés à la fois par Node et le navigateur.
5. `docs/ARCHITECTURE_EDITION.md:14-66` décrit correctement la topologie statique générale et le pipeline index/corps des collections lourdes.
6. L’application ne possède qu’un workspace npm (`client`) et reste ESM (`package.json:6-9`).

### Interprétation

L’architecture est un monolithe frontend statique organisé par couches, avec de bonnes frontières cross-runtime. Le dépôt n’est pas un monorepo de services : les scripts Node constituent l’outillage de compilation et de validation, pas un backend métier.

### Recommandation

Conserver cette architecture tant qu’aucune exigence démontrée ne requiert synchronisation distante, identité ou données confidentielles. Toute nouvelle couche serveur doit être traitée comme un changement d’architecture, non comme une extension implicite.

## 3. Flux principaux

### FLOW-BOOT — bootstrap et navigation

**Faits observés** : document statique → `main.tsx` → boundary/router/providers → `App.tsx` → page lazy → `MainLayout`. La taxonomie de navigation est centralisée dans `client/src/lib/navigation.ts:30-97`; le routage exécutable reste dans `App.tsx` et sa représentation contractuelle dans `shared/routes.mjs:61-110`.

**Interprétation** : séparation correcte entre rendu React, navigation éditoriale et politique SEO. La double représentation des routes exige cependant des tests de parité permanents.

**Recommandation** : préserver les tests `client/src/lib/routeValidation.test.ts` et `scripts/routes-contract.test.mjs`; n’unifier les registres qu’après une spécification qui démontre un gain net sans coupler Node à React.

### FLOW-CONTENT — contenu canonique vers écran

**Faits observés** :

```text
data/*.json + data/blog/*.json + data/parcours/*.lessons.json
→ scripts/validate-content.mjs
→ split des leçons/glossaire vers data/generated/
→ modules client/src/content/*
→ pages, recherche et navigation
```

- `docs/ARCHITECTURE_EDITION.md:103-142` documente ce flux.
- `client/src/content/lessons.ts:1-4` et `glossary.ts:1-4` importent un index eager et une URL de corps/définitions lazy.
- `client/src/content/lazyResource.ts:14-31` effectue le seul `fetch` applicatif observé : un asset JSON produit par Vite, avec même origine implicite.
- `scripts/check-generated.mjs:1-28` compare en mémoire les quatre dérivés aux sources.

**Interprétation** : la source canonique et les sorties dérivées sont bien distinguées. Le principal risque n’est pas la fraîcheur actuelle, qui passe, mais le nombre de registres à mettre à jour lors de l’ajout d’une nouvelle collection.

**Recommandation** : spécifier un registre déclaratif de collections avant toute généralisation de taxonomie ou ajout massif de familles.

### FLOW-ROUTES — routes, SEO, sitemap et prérendu

**Faits observés** : `App.tsx` rend; `shared/routes.mjs` classe; `scripts/collect-routes.mjs` énumère les routes concrètes; sitemap et prérendu consomment le collecteur. Le contrôle courant retourne 703 routes publiques et zéro doublon/intersection.

**Interprétation** : la duplication de connaissance est explicite et protégée, mais toute nouvelle famille doit traverser plusieurs propriétaires.

**Recommandation** : conserver le contrat actuel à court terme; envisager une description commune seulement si les tests montrent une dérive récurrente.

### FLOW-LOCAL-DATA — persistance, export, import et purge

**Faits observés** :

- `client/src/lib/storageDomains.ts:24-40` expose les contrats communs; `localDataLifecycle.ts:24-40` recompose manuellement 15 contrats pour l’export/import/purge.
- `localDataLifecycle.ts:230-239` remplace silencieusement par `null` tout domaine illisible, invalide ou d’une version différente lors de l’export.
- `localDataLifecycle.ts:120-137` exige la version courante exacte à l’import, alors que plusieurs contrats portent des migrations (`storageDomains.ts`, `learningWorkspace.ts:257-263`).
- `localDataLifecycle.ts:293-301` et `315-321` écrivent ou suppriment directement les clés; `ProfilePage.tsx:73-91` appelle ensuite seulement `reloadLocalData()`.
- `UserDataProvider.tsx:53-83` ne recharge que profil, notes, favoris, progression et journal. `ThemeProvider.tsx:13-30` conserve le thème dans son état React; `learningWorkspace.ts:266-271` met son snapshot en cache; `CertificationEvaluationPage.tsx:91-93` initialise son store une fois.
- `localDataLifecycle.ts:145-159` compte diagnostics et productions du workspace, mais pas `activities`, bien que `learningWorkspace.ts:243-248` les conserve.
- `purgeLocalData()` capture le snapshot avant son bloc `try` (`localDataLifecycle.ts:314-321`), de sorte qu’une lecture `localStorage` indisponible peut échapper au résultat structuré.

**Interprétation** : l’atomicité des écritures/rollback est bien conçue, mais le cycle de vie n’est pas atomique du point de vue des propriétaires d’état mémoire. Après import ou purge, certaines surfaces peuvent conserver un thème, un workspace, un cahier Ikigai ou une évaluation obsolète jusqu’au remount/rechargement. L’export peut produire une sauvegarde valide en apparence mais amputée, notamment si un domaine ancien n’a pas encore été migré.

**Recommandation** : classer ce sujet P0/P1 et créer une fonctionnalité dédiée avant de présenter l’export/import/purge comme garantie de portabilité. Le futur contrat doit définir un registre unique, la migration avant export/import, un résultat explicite en cas de domaine illisible et une invalidation de tous les propriétaires d’état.

## 4. Frontend

### Faits observés

- Les pages sont regroupées par domaine sous `client/src/pages`; les routes sont lazy; les helpers SEO, URL et stockage sont hors des composants.
- La navigation principale possède une taxonomie unique dans `client/src/lib/navigation.ts:30-97`, consommée par TopBar, SideNav, Footer et onboarding.
- Les données canoniques sont importées par les adaptateurs `client/src/content/*`; aucune page de production n’importe directement `@data` hors tests.
- Les tests sont répartis dans les composants, contenus, libs et pages : 67 fichiers Vitest dans `client/src`, auxquels s’ajoutent 8 tests Node sous `scripts` et 1 sous `shared`.
- Plusieurs modules concentrent de nombreuses responsabilités : `CertificationDetailPage.tsx` (1 293 lignes), `CertificationEvaluationPage.tsx` (921), `GlossaryPage.tsx` (767), `PathAtlas.tsx` (724), `TopBar.tsx` (626), `DecisionJournalPage.tsx` (602).
- Les fichiers du wordmark et de `/home` sont modifiés avant l’audit; aucune conclusion visuelle finale n’est portée sur ces surfaces.

### Interprétation

Les frontières générales sont lisibles et les tests nombreux. Le risque vient moins d’un manque de couches que de composants-écrans volumineux et d’états globaux distribués entre Context, singletons et hooks locaux.

### Recommandation

Ne pas lancer une refonte frontend générale. Spécifier par flux : cycle de vie des données locales d’abord; puis, si des changements fréquents l’exigent, décomposer les écrans de certification et les composants de navigation selon responsabilités testables.

## 5. Backend, API et authentification

### Faits observés

- `package.json` et `client/package.json` ne déclarent aucun framework serveur, ORM, client d’API ou bibliothèque d’authentification.
- Aucun dossier serveur/Prisma, fichier `.env` applicatif ou route `/api` n’est présent dans le périmètre source inspecté.
- `client/src/content/lazyResource.ts:17` contient le seul appel `fetch` applicatif observé; il charge un JSON statique généré.
- `CLAUDE.md:49-57`, `README.md:40-56` et `.specify/memory/project-context.md:51-62` définissent explicitement l’absence de backend, API, base distante et mur d’authentification, ainsi que la frontière publique.
- `scripts/prerender.mjs` crée un serveur HTTP temporaire pour inspecter `client/dist`; il n’est pas inclus dans le runtime livré.
- La recherche de primitives `RouteGuard`, `AuthProvider`, tokens, credentials ou cookies n’a révélé aucun système d’identité applicatif.

### Interprétation

L’absence de backend/API/authentification est une décision d’architecture cohérente, pas un module manquant. En revanche, `noindex`, routes workspace et profil local ne constituent aucune protection d’accès.

### Recommandation

Conserver une formulation explicite : « données publiques dans le bundle; données personnelles limitées et locales, non confidentielles ». Toute identité, synchronisation, paiement, délivrance de certification, registre humain ou donnée de deal non publique exige une spécification d’architecture et de sécurité distincte.

## 6. Modèle de données

### Faits observés

- `client/src/content/types.ts:3-800` concentre les types généraux; `certificationTypes.ts:3-260` sépare le domaine certification.
- `docs/ARCHITECTURE_EDITION.md:186-204` documente les relations par identifiants : cours/leçons, parcours/ressources, glossaire/leçons, livrables/modèles et certifications/exigences.
- `scripts/validate-content.mjs` contient 2 112 lignes et 55 fonctions/schémas de niveau module; il réexprime les structures TypeScript en schémas Zod et réalise les références croisées.
- Les modules `content/*` castent les JSON validés au build vers les types TypeScript; la validation runtime du navigateur porte principalement sur `localStorage`, pas sur chaque collection bundlée.
- Le contrôle strict courant passe sur toutes les collections et leurs références.

### Interprétation

Le modèle relationnel statique est riche et cohérent, mais le type et le schéma runtime ont deux propriétaires manuels. Le validateur central devient un point de couplage pour chaque nouvelle collection ou champ, avec un risque de dérive future malgré le gate actuel.

### Recommandation

Avant la taxonomie Phase 3 ou de nouvelles collections, spécifier soit une dérivation de types depuis les schémas, soit un registre de schémas/relations par collection avec tests de parité. Éviter une migration « big bang » sans scénario de compatibilité pour les JSON publiés.

## 7. Organisation des dossiers, dépendances et obsolescence

### Faits observés

- La structure `client` / `data` / `shared` / `scripts` / `docs` / `Suivis` correspond au manuel maintenu.
- Le graphe statique ne révèle aucun cycle et aucun module applicatif de production sans consommateur.
- Les méthodes dépréciées `storage.get` et `storage.set` n’ont aucun consommateur hors tests; elles restent exposées dans `storage.ts:233-270`.
- `.gitignore:10-13` conserve des entrées `server/prisma` et `*.db` alors qu’aucun serveur/Prisma n’est présent.
- `.hermes/` contient 24 fichiers suivis pour environ 4,3 Mo, sans politique dans `AGENTS.md` ou `CLAUDE.md`; deux pièces jointes Markdown sont des doublons binaires exacts.
- `revue-mathematiques-du-vc.md:1-15` se présente encore comme plan actif alors que `Suivis/JOURNAL.md:937-973` consigne sa finalisation.

### Interprétation

Aucun module de production ne peut être qualifié d’obsolète avec confiance. Les résidus confirmés concernent surtout la configuration et les artefacts de travail. Le suivi de leur cycle de vie est insuffisant et augmente le bruit pour les inventaires et les agents.

### Recommandation

Classer le nettoyage `.hermes`, `.gitignore`, API storage dépréciée et revue racine en maintenance P2/P3 après vérification de leurs consommateurs externes. Ne supprimer aucun module sur la seule base d’un comptage d’imports.

## 8. Dette documentaire et conventions

### Faits observés

- `Suivis/ETAT.md:3` se définit comme un instantané court, remplaçable et sans historique; les lignes 5-35 accumulent néanmoins de nombreuses passes précédentes, et le fichier dépasse largement un instantané court.
- `Suivis/ETAT.md:45` affirme que `UserDataProvider` relit « les données locales » après import/purge, alors que son implémentation ne recharge que cinq domaines et n’invalide pas les autres propriétaires d’état.
- `docs/ARCHITECTURE_EDITION.md:9-10`, `73-88` et `158-166` qualifie la couche Intelligence de « livrée pour l’essentiel » ou « livrée » en assimilant présence de routes/surfaces à livraison. `PRODUCT.md:7-13` décrit pourtant le projet comme en construction, et les données observées ne suffisent pas à établir la maturité éditoriale ou l’usage.
- Le README et le manuel conservent des références visibles à l’ancienne marque dans leurs titres/métadonnées; ce point est explicitement toléré jusqu’à une migration éditoriale dédiée et n’est pas classé comme défaut dans ce lot.

### Interprétation

Les autorités techniques sont généralement précises, mais deux dérives nuisent à la reprise : `ETAT.md` devient un second journal et certains documents confondent surface implémentée, cible stratégique et maturité réelle. Cette confusion peut conduire un agent à déduire le périmètre final du seul dépôt.

### Recommandation

Créer un lot documentaire borné pour : compacter `ETAT.md`, corriger l’affirmation sur le rechargement local, distinguer « route implémentée », « capacité éprouvée » et « cible », et statuer sur le cycle de vie de la revue racine. Ne pas intégrer ces corrections au diagnostic en lecture seule.

## 9. Complexité dormante

### Faits observés

- `data/certificationAssessments.json` contient zéro évaluation; le validateur confirme ce volume.
- `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md:162-186` précise que la délivrance humaine, le contrôle d’identité et le registre sont inactifs.
- Le frontend possède pourtant `CertificationDetailPage.tsx` (1 293 lignes), `CertificationEvaluationPage.tsx` (921) et `certificationAssessment.ts` (759), plus leurs tests et contrats de stockage.

### Interprétation

Il s’agit de complexité préparatoire, pas de code mort confirmé. Tant que la gouvernance et les évaluations restent inactives, cette surface supporte un coût de maintenance élevé sans chaîne utilisateur complète.

### Recommandation

Geler l’extension de la certification; décider dans une spécification distincte si le code existant doit être conservé, simplifié ou activé. Ne pas confondre sa présence avec une fonctionnalité certifiante livrée.

## 10. Registre synthétique des constats

| ID | Catégorie | Sévérité | Fait observé | Interprétation | Recommandation |
|---|---|---:|---|---|---|
| ARCH-001 | Architecture | LOW | SPA statique avec contrats cross-runtime purs et routes lazy. | Socle cohérent avec la phase locale. | Conserver; ne pas ajouter de service sans besoin spécifié. |
| FLOW-001 | Flux | LOW | Pipeline canonique → validation → dérivés → rendu passe les gates. | La fraîcheur courante est démontrée. | Préserver `check-generated` et validation stricte. |
| BOUND-001 | Backend/API/Auth | LOW | Aucun backend, API métier, base distante ou auth observé. | Absence intentionnelle; toute donnée livrée au client est publique. | Maintenir la frontière et spécifier tout changement. |
| DATA-001 | Modèle | MEDIUM | Types TS et schémas Zod sont maintenus séparément; validateur de 2 112 lignes. | Fort point de couplage et risque de dérive lors d’une extension. | Spécifier un registre/dérivation avant Phase 3. |
| DATA-002 | Persistance | HIGH | Import/purge brut ne notifie pas tous les propriétaires d’état. | UI potentiellement obsolète après opération de cycle de vie. | Lot P0/P1 local-data dédié. |
| DATA-003 | Persistance | HIGH | Export remplace silencieusement les domaines illisibles/non migrés par `null`. | Sauvegarde apparemment valide mais incomplète. | Retour d’erreur explicite et migration avant export. |
| DATA-004 | Compatibilité | HIGH | Import exige la version courante exacte malgré les migrations des contrats. | Anciens exports futurs non importables sans traitement spécifique. | Versionner et migrer le format d’export. |
| DATA-005 | Persistance | MEDIUM | L’aperçu workspace omet `activities`; purge capture le snapshot hors `try`. | Comptage trompeur et erreur non structurée possible. | Couvrir activités et indisponibilité en tests de contrat. |
| ROUTE-001 | Couplage | MEDIUM | Router, patterns et collecteur portent des représentations distinctes des routes. | Coût d’ajout multi-fichiers, actuellement mitigé par les tests. | Conserver à court terme; unifier seulement après preuve de dérive. |
| FRONT-001 | Frontend | MEDIUM | Plusieurs pages dépassent 600–1 200 lignes. | Responsabilités et révisions plus coûteuses. | Décomposer par flux dans des lots ciblés, pas par quota arbitraire. |
| DOC-001 | Incohérence | HIGH | Le manuel qualifie des surfaces de « livrées » à partir de leur présence. | Confusion entre code visible, maturité et cible produit. | Lot documentaire état/cible borné. |
| DOC-002 | Convention | MEDIUM | `ETAT.md` accumule un historique qu’il interdit explicitement. | Reprise plus coûteuse et double journal. | Compacter; conserver l’historique dans `JOURNAL.md`. |
| DOC-003 | Incohérence | HIGH | `ETAT.md` surdécrit le rechargement après import/purge. | Le suivi masque le défaut DATA-002. | Corriger après résolution/vérification du flux. |
| DOC-004 | Obsolescence | LOW | Une revue finalisée reste à la racine avec statut de plan actif. | Ambiguïté d’autorité. | Archiver, marquer exécutée ou supprimer après décision. |
| ORG-001 | Duplication | MEDIUM | `.hermes` suit des artefacts volumineux et deux pièces jointes identiques. | Bruit, inventaires faussés, cycle de vie implicite. | Définir une politique et dédupliquer. |
| DEBT-001 | Maintenance | MEDIUM | Certification: forte surface de code pour zéro évaluation et gouvernance inactive. | Complexité dormante. | Geler et spécifier l’avenir de cette couche. |
| OBS-001 | Dépendances | LOW | Aucun cycle ni module applicatif orphelin confirmé. | Pas de suppression générale justifiée. | Conserver l’analyse comme contrôle positif. |
| OBS-002 | Obsolescence | LOW | `storage.get/set` dépréciés ne sont utilisés qu’en tests; résidus Prisma dans `.gitignore`. | Résidu probable, sans impact runtime. | Nettoyage ciblé après vérification. |

## 11. Recommandations classées

| Priorité | Recommandation | Constats | Spec distincte |
|---|---|---|---|
| P0 | Ne pas présenter l’export/import/purge comme garantie complète tant que tous les domaines ne migrent, ne signalent les erreurs et ne s’invalident pas ensemble. | DATA-002 à DATA-005, DOC-003 | Oui |
| P1 | Produire un contrat unique de registre des domaines locaux et de notification des propriétaires d’état. | DATA-002 à DATA-004 | Oui |
| P1 | Réaligner les autorités sur la distinction état observable / capacité éprouvée / cible; réduire `ETAT.md` à un instantané. | DOC-001 à DOC-004 | Oui, lot documentaire borné |
| P2 | Spécifier l’architecture des schémas/collections avant la taxonomie Phase 3. | DATA-001, FLOW-001 | Oui |
| P2 | Décider du devenir de la couche certification inactive avant toute extension. | DEBT-001 | Oui |
| P2 | Évaluer l’unification des registres de routes seulement si les tests révèlent un coût récurrent. | ROUTE-001 | Oui si comportement/contrat change |
| P3 | Définir une politique de rétention des artefacts `.hermes`, dédupliquer les pièces et nettoyer les résidus documentaires/config. | ORG-001, DOC-004, OBS-002 | Approbation explicite; spec légère selon portée |

## 12. Candidats pour une future Constitution

| ID | Règle candidate | Statut conseillé |
|---|---|---|
| GOV-001 | Tout domaine de données utilisateur MUST être déclaré dans un registre exécutable unique consommé par migration, export, import, purge et notification d’état. | Convention transverse candidate; à élever si plusieurs fonctionnalités partagent ce risque. |
| GOV-002 | Toute opération globale de cycle de vie local MUST être atomique à la fois dans le stockage et dans les états mémoire, et MUST signaler tout domaine omis ou illisible. | Convention transverse candidate. |
| GOV-003 | La présence d’une route ou d’un composant MUST NOT être décrite comme fonctionnalité livrée sans scénario utilisateur et preuve vérifiés. | Candidat de gouvernance documentaire. |
| GOV-004 | Tout ajout de collection structurée MUST déclarer source canonique, schéma runtime, type, politique de publication, consommateurs de routes/recherche et sorties dérivées. | Candidat de convention de dépôt; possiblement constitutionnel si généralisé. |
| GOV-005 | Les artefacts d’agent suivis MUST avoir un propriétaire, une durée de rétention et une classification normative/non normative explicites. | Convention de dépôt; trop spécifique pour la Constitution actuelle. |
| GOV-006 | Backend, API métier, auth, identité et données confidentielles MUST exiger une fonctionnalité séparée avec modèle de menace et migration. | Déjà couvert en substance par la Constitution et les autorités; renforcer la formulation seulement par mise à jour explicite de Constitution. |

## 13. Évolutions exigeant `/speckit-specify`

1. **Portabilité des données locales** : registre unique, migrations d’export, invalidation et UX d’erreur.
2. **Backend / API / authentification / synchronisation distante** : architecture, sécurité, confidentialité, migration et mode dégradé.
3. **Activation d’une certification** : évaluation publiée, identité, gouvernance humaine, registre et délivrance.
4. **Taxonomie Phase 3 ou nouveau framework de collections** : compatibilité des JSON, types, schémas et consumers.
5. **Unification du routage** : ownership, génération éventuelle et compatibilité Node/React.
6. **Refonte de l’état global frontend** : Context, stores externes et reload cross-domain.
7. **Changement d’autorité durable** : Constitution, positionnement de maturité, politique de suivi ou de rétention.
8. **PWA/offline, hébergement ou en-têtes de sécurité publiés** : stratégie de cache, base URL, 404 et preuves HTTP.

## 14. Décisions de recherche

- **Décision** : conserver l’architecture statique actuelle comme baseline.  
  **Raison** : elle satisfait les objectifs locaux et les frontières de données publiques.  
  **Alternative rejetée** : recommander un backend par défaut.

- **Décision** : traiter la portabilité locale comme premier risque technique.  
  **Raison** : les chemins export/import/purge sont visibles par l’utilisateur et traversent plusieurs propriétaires d’état sans contrat commun.  
  **Alternative rejetée** : simple correction locale de `reloadLocalData`, insuffisante pour les migrations et domaines externes au provider.

- **Décision** : ne déclarer aucun module de production obsolète.  
  **Raison** : le graphe ne révèle ni cycle ni orphelin; les modules dormants ont une intention future documentée.  
  **Alternative rejetée** : supprimer selon taille ou absence de route publique.

- **Décision** : séparer dette documentaire et dette applicative.  
  **Raison** : corriger les documents avant le code pourrait masquer DATA-002; les deux doivent être reliés mais livrés avec leurs propres preuves.
