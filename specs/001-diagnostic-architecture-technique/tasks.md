---
description: "Tâches du diagnostic d’architecture décisionnel de vc-platform"
---

# Tâches : Diagnostic d’architecture décisionnel

**Entrées** : documents de `specs/001-diagnostic-architecture-technique/`  
**Prérequis** : `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/diagnostic-report.md` et `quickstart.md`

**Tests et contrôles** : cette fonctionnalité est un diagnostic documentaire et statique. Elle ne modifie aucun comportement applicatif. Les contrôles portent sur la traçabilité, la couverture, la cohérence constitutionnelle, les commandes sans écriture autorisées par `quickstart.md` et la stabilité du worktree.

**Organisation** : les tâches sont regroupées par scénario utilisateur. Aucune tâche n’autorise une correction du code, des données, des autorités maintenues ou de la Constitution. Toute remédiation matérielle devient une fonctionnalité Spec Kit distincte.

## Format obligatoire : `[ID] [P?] [Scénario?] Description avec chemin`

- `T001`, `T002`, etc. suivent l’ordre d’exécution.
- `[P]` indique une tâche réellement parallélisable sur un autre fichier et sans invariant partagé incomplet.
- `[US1]`, `[US2]`, `[US3]` relient les tâches aux scénarios de `spec.md`.
- Aucune tâche ne crée de commit, push, workflow distant ou déploiement.

## Phase 1 — Reconnaissance et preuve initiale

**Objectif** : figer le périmètre possédé, identifier les changements préexistants et obtenir des preuves reproductibles sans modifier l’application.

- [x] T001 Couvrir TR-001, TR-003 et TR-005 en consignant le snapshot Git, les fichiers possédés, les changements préexistants, les exclusions et la hiérarchie des preuves dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T002 [P] Exécuter uniquement les contrôles sans écriture C-02 à C-05 et consigner commandes, codes de sortie et résultats dans `specs/001-diagnostic-architecture-technique/quickstart.md`
- [x] T003 Construire en mémoire l’inventaire des modules et le graphe d’imports, puis consigner cycles, imports non résolus, orphelins et hotspots dans `specs/001-diagnostic-architecture-technique/research.md`

**Point de contrôle** : aucun fichier hors `specs/001-diagnostic-architecture-technique/**` et `.specify/feature.json` n’est attribué au lot; aucune preuve historique n’est présentée comme résultat courant.

---

## Phase 2 — Fondations partagées

**Objectif** : établir le modèle et le contrat communs qui rendent les trois scénarios indépendamment vérifiables.

- [x] T004 [P] Formaliser `Finding`, `Flow`, `Recommendation`, `GovernanceCandidate`, `SpecGate`, `CoverageEntry` et leurs invariants dans `specs/001-diagnostic-architecture-technique/data-model.md`
- [x] T005 [P] Formaliser les sections, preuves, sévérités, priorités, métriques et clauses de non-exécution dans `specs/001-diagnostic-architecture-technique/contracts/diagnostic-report.md`
- [x] T006 Vérifier les sept principes constitutionnels, les autorités maintenues, les fichiers possédés et les reports dans `specs/001-diagnostic-architecture-technique/plan.md`

**Point de contrôle** : faits, interprétations et recommandations possèdent des champs distincts; tout changement durable peut être routé vers une autorité ou un `SpecGate`.

---

## Phase 3 — Scénario utilisateur 1 : Comprendre le système actuel (Priorité : P1)

**Objectif** : fournir une cartographie vérifiable des couches, flux, frontières, données et dépendances actuelles.  
**Test indépendant** : chaque axe de FR-001 à FR-008 possède un statut, une conclusion bornée, une preuve actuelle et une limite explicite; backend, API et authentification restent présents comme résultats négatifs.

### Contrôles du scénario 1

- [x] T007 [US1] Couvrir FR-001, FR-003 et FR-006 en vérifiant les preuves des points d’entrée, providers, routes lazy, contrats cross-runtime et structure de dossiers dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T008 [US1] Couvrir FR-002 en traçant `FLOW-BOOT`, `FLOW-CONTENT`, `FLOW-ROUTES`, `FLOW-SEARCH`, `FLOW-LOCAL-DATA` et `FLOW-LIFECYCLE` de leur source propriétaire à leurs consommateurs dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T009 [US1] Couvrir FR-004 et TR-004 en corroborant séparément le statut du frontend, du backend, de la base distante, de l’API et de l’authentification sans révéler de donnée sensible dans `specs/001-diagnostic-architecture-technique/research.md`

### Production du scénario 1

- [x] T010 [US1] Couvrir FR-005 en cartographiant les entités éditoriales et locales, relations, publication, compatibilité et migrations à partir de `client/src/content/`, `client/src/lib/storageDomains.ts`, `data/` et `docs/ARCHITECTURE_EDITION.md` dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T011 [US1] Couvrir FR-015 en classant chaque famille demandée comme vérifiée, échantillonnée, à approfondir, exclue ou impossible à conclure dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T012 [US1] Contrôler le scénario US1 contre FR-001 à FR-008, FR-013 à FR-016 et SC-001/SC-002/SC-006/SC-008 dans `specs/001-diagnostic-architecture-technique/spec.md` et `specs/001-diagnostic-architecture-technique/contracts/diagnostic-report.md`

**Point de contrôle** : la cartographie est utilisable sans les scénarios US2 et US3 et ne déduit jamais la maturité produit de la seule présence de fichiers ou routes.

---

## Phase 4 — Scénario utilisateur 2 : Prioriser les risques et la dette (Priorité : P1)

**Objectif** : consolider les incohérences, duplications, couplages, obsolescences et risques de maintenance par cause démontrée.  
**Test indépendant** : chaque constat HIGH/CRITICAL possède preuve, conséquence, recommandation, priorité, dépendance, besoin de spécification et critère de vérification.

### Contrôles du scénario 2

- [x] T013 [US2] Reproduire statiquement les chemins export/import/purge, migrations et invalidations de tous les propriétaires d’état local dans `client/src/lib/localDataLifecycle.ts`, `client/src/context/` et `client/src/lib/learningWorkspace.ts`, puis consigner les preuves dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T014 [US2] Analyser les représentations distribuées des routes, collections, schémas et contrats de stockage ainsi que les modules volumineux, dépréciés ou dormants dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T015 [US2] Comparer les affirmations d’état de `Suivis/ETAT.md`, `docs/ARCHITECTURE_EDITION.md` et `revue-mathematiques-du-vc.md` au code et aux données propriétaires, puis consigner les dérives sans les corriger dans `specs/001-diagnostic-architecture-technique/research.md`

### Production du scénario 2

- [x] T016 [US2] Couvrir FR-009 en consolidant les symptômes par cause principale, en attribuant sévérité et confiance, puis en reliant chaque recommandation à ses constats dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T017 [US2] Classer les recommandations P0 à P3 avec portée, risque différé, dépendances, preuve attendue et indicateur `specRequired` dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T018 [US2] Contrôler le scénario US2 contre FR-007 à FR-010, FR-013/FR-014/FR-016 et SC-003/SC-004/SC-006 dans `specs/001-diagnostic-architecture-technique/spec.md` et `specs/001-diagnostic-architecture-technique/contracts/diagnostic-report.md`

**Point de contrôle** : aucune taille de fichier ou absence de consommateur heuristique ne suffit seule à qualifier un module d’obsolète; les preuves positives sont conservées avec les risques.

---

## Phase 5 — Scénario utilisateur 3 : Encadrer les évolutions futures (Priorité : P2)

**Objectif** : distinguer principes transversaux, conventions de dépôt, décisions locales et évolutions nécessitant une spécification autonome.  
**Test indépendant** : chaque candidat de gouvernance possède règle, justification, preuves, portée et verdict; chaque évolution structurante possède un `SpecGate` avec compatibilités et dépendances.

### Contrôles du scénario 3

- [x] T019 [US3] Extraire les MUST/SHOULD applicables de `.specify/memory/constitution.md` et classer les constats qui les touchent dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T020 [US3] Distinguer les règles déjà couvertes, les candidats constitutionnels, les conventions de dépôt et les recommandations trop spécifiques dans `specs/001-diagnostic-architecture-technique/research.md`

### Production du scénario 3

- [x] T021 [US3] Définir les `SpecGate` pour portabilité locale, backend/API/auth, certification, taxonomie, routage, état frontend, autorités et hébergement dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T022 [US3] Contrôler le scénario US3 contre FR-011/FR-012, TR-002, SC-004/SC-005 et le contrat de gouvernance dans `specs/001-diagnostic-architecture-technique/contracts/diagnostic-report.md`

**Point de contrôle** : aucune Constitution, autorité maintenue ou implémentation n’est modifiée; les propositions restent soumises à décision explicite.

---

## Phase finale — Intégration et validation du diagnostic

- [x] T023 Vérifier la couverture de chaque FR, SC, obligation de support et scénario par au moins une tâche dans `specs/001-diagnostic-architecture-technique/tasks.md`
- [x] T024 Rejouer `check-prerequisites.sh --json --paths-only`, les contrôles sûrs de `specs/001-diagnostic-architecture-technique/quickstart.md` et `git diff --check` sur les artefacts possédés
- [x] T025 Vérifier les identifiants uniques, les liens internes, les preuves `path:line`, la limite de 50 constats et la séparation faits/interprétations/recommandations dans `specs/001-diagnostic-architecture-technique/research.md`
- [x] T026 Couvrir SC-007 en gelant le statut Git final et en confirmant l’absence d’écriture hors périmètre dans `specs/001-diagnostic-architecture-technique/quickstart.md`

## Handoff d’analyse et de convergence — hors liste d’implémentation

Cette séquence n’est pas une tâche exécutée par `/speckit-implement` :

1. lorsque les artefacts et `tasks.md` sont complets, exécuter `/speckit-analyze` en lecture seule sur l’état gelé ;
2. si l’analyse relève un conflit constitutionnel ou un manque de couverture, corriger uniquement les artefacts Spec Kit après approbation, puis relancer `/speckit-analyze` ;
3. ne lancer aucune remédiation du code depuis ce lot; ouvrir une fonctionnalité distincte pour chaque `SpecGate` approuvé ;
4. n’exécuter `/speckit-converge` qu’après une future implémentation matérielle; ne mettre à jour `Suivis/ETAT.md` ou `Suivis/JOURNAL.md` qu’après une livraison durable et vérifiée ;
5. ne créer aucune branche, pull request, commit, action distante ou publication sans demande explicite.

## Dépendances et ordre d’exécution

```text
Phase 1 → Phase 2 → US1 ─┬→ US2 → Phase finale
                         └→ US3 → Phase finale
```

- US1 fournit la cartographie de référence utilisée par US2 et US3.
- Après US1, US2 et US3 peuvent avancer en parallèle uniquement si deux exécutants ne modifient pas simultanément `research.md`; dans le fichier unique retenu, leurs écritures sont sérialisées.
- T002 peut avancer en parallèle de T003 après T001, car `quickstart.md` et `research.md` sont distincts.
- T004 et T005 sont parallélisables; T006 attend leur cohérence finale.
- La phase finale utilise un snapshot gelé. Toute modification ultérieure invalide les preuves touchées.

## Exemples de parallélisation

### Reconnaissance

```text
Exécutant A : T002 — contrôles sans écriture dans quickstart.md
Exécutant B : T003 — graphe d’imports dans research.md
```

### Fondations

```text
Exécutant A : T004 — data-model.md
Exécutant B : T005 — contracts/diagnostic-report.md
Puis intégrateur : T006 — Constitution et cohérence
```

Les tâches US1, US2 et US3 ciblent principalement `research.md`; elles ne portent donc pas `[P]` malgré la séparation conceptuelle de leurs axes.

## Stratégie d’exécution

1. **MVP** : phases 1 et 2 puis US1, qui livre une cartographie vérifiable sans recommandation de changement.
2. **Incrément de décision** : US2, qui priorise les risques et la dette.
3. **Incrément de gouvernance** : US3, qui prépare les futures spécifications et règles candidates.
4. **Clôture** : validations finales puis `/speckit-analyze` en lecture seule.
5. Toute anomalie hors périmètre est signalée; elle n’est jamais corrigée implicitement.

## Notes

- Ne jamais éditer `data/generated/`, l’application, les données, les autorités ou les suivis dans ce lot.
- Une absence est un résultat seulement après corroboration; une recherche textuelle unique n’est pas une preuve d’architecture.
- Les fichiers préexistants modifiés restent protégés, même si leur contenu est cité.
- Les cases cochées reflètent uniquement un travail réellement exécuté et vérifié.
