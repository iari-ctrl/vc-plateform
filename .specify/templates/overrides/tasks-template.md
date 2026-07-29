---
description: "Tâches d'implémentation brownfield pour vc-platform"
---

# Tâches : [NOM DE LA FONCTIONNALITÉ]

**Entrées** : documents de `specs/[###-nom-fonctionnalite]/`  
**Prérequis** : `spec.md` et `plan.md` ; selon le chantier `research.md`,
`data-model.md`, `contracts/` et `quickstart.md`

**Tests** : toute modification de comportement ou de schéma exige une preuve RED
avant l'implémentation. Une modification documentaire ou éditoriale exige le
contrôle ciblé défini par le plan. Les exemples ci-dessous doivent être remplacés
par des tâches propres à la fonctionnalité.

**Organisation** : les tâches sont regroupées par scénario utilisateur. Une
tâche parallèle ne peut partager ni fichier, ni état mutable, ni invariant avec
une autre tâche en cours.

## Format obligatoire : `[ID] [P?] [Scénario?] Description avec chemin`

- `T001`, `T002`, etc. suivent l'ordre d'exécution.
- `[P]` indique une tâche réellement parallélisable.
- `[US1]`, `[US2]`, etc. relient une tâche au scénario correspondant.
- Chaque tâche nomme les chemins précis qu'elle peut modifier ou contrôler.
- Aucune tâche ne crée de commit, push, workflow distant ou déploiement sans
  autorisation explicite.

<!--
Les tâches d'exemple doivent toutes être remplacées. Ne pas initialiser une
nouvelle application, une base de données ou une authentification : le dépôt est
brownfield, statique et sans backend applicatif.

La vérification d'installation est en lecture seule. Ne pas créer ou modifier un
fichier d'exclusion, de configuration ou de package — notamment `.gitignore`,
`.eslintignore`, `.prettierignore`, `.npmignore` ou les règles ESLint — sauf si ce
fichier est explicitement possédé par la fonctionnalité et autorisé dans le plan.
-->

## Phase 1 — Reconnaissance et preuve initiale

**Objectif** : figer le périmètre possédé et obtenir une preuve reproductible
avant toute correction.

- [ ] T001 Consigner l'état Git, les fichiers possédés, les changements préexistants et les reports dans `specs/[###-nom-fonctionnalite]/plan.md`
- [ ] T002 [P] Vérifier les autorités et le comportement de départ référencés dans `specs/[###-nom-fonctionnalite]/spec.md`
- [ ] T003 Établir la preuve RED ou le contrôle d'écart défini dans `specs/[###-nom-fonctionnalite]/quickstart.md`

**Point de contrôle** : le premier échec complet est conservé et classé ; aucun
fichier hors périmètre n'est attribué à la fonctionnalité.

---

## Phase 2 — Fondations partagées *(uniquement si nécessaires)*

**Objectif** : traiter les prérequis qui bloquent tous les scénarios sans créer
d'infrastructure générique.

- [ ] T004 [P] [Remplacer par un prérequis partagé avec son chemin exact]
- [ ] T005 [Remplacer par le contrat, la migration ou le validateur commun requis avec son chemin exact]

**Point de contrôle** : chaque fondation est couverte par un test ou validateur et
reste compatible avec les données, identifiants et routes existants.

---

## Phase 3 — Scénario utilisateur 1 : [Titre] (Priorité : P1)

**Objectif** : [valeur livrée]  
**Test indépendant** : [preuve observable]

### Tests ou contrôles du scénario 1

- [ ] T006 [P] [US1] Ajouter ou préciser le test RED dans `[chemin-du-test]`
- [ ] T007 [P] [US1] Ajouter la fixture intrinsèquement valide dans `[chemin-de-la-fixture]`

### Implémentation du scénario 1

- [ ] T008 [US1] Implémenter le plus petit changement GREEN dans `[chemin-source]`
- [ ] T009 [US1] Mettre à jour la source propriétaire du contenu ou du contrat dans `[chemin-canonique]`
- [ ] T010 [US1] Vérifier le scénario indépendant avec `[commande ou quickstart.md]`

**Point de contrôle** : le scénario P1 est utilisable et vérifiable sans dépendre
d'un scénario moins prioritaire.

---

## Phase 4 — Scénario utilisateur 2 : [Titre] (Priorité : P2)

**Objectif** : [valeur livrée]  
**Test indépendant** : [preuve observable]

### Tests ou contrôles du scénario 2

- [ ] T011 [P] [US2] Ajouter le test RED dans `[chemin-du-test]`

### Implémentation du scénario 2

- [ ] T012 [US2] Implémenter le changement dans `[chemin-source]`
- [ ] T013 [US2] Vérifier le scénario indépendant avec `[commande ou quickstart.md]`

**Point de contrôle** : les scénarios P1 et P2 passent séparément et ensemble.

---

[Ajouter uniquement les phases correspondant aux scénarios de `spec.md`.]

## Phase finale — Intégration, documentation et validation

- [ ] TXXX Rejouer les tests ciblés et conserver les sorties dans `specs/[###-nom-fonctionnalite]/quickstart.md`
- [ ] TXXX Exécuter les gates proportionnés définis dans `specs/[###-nom-fonctionnalite]/plan.md`
- [ ] TXXX [P] Contrôler les liens, chemins et espaces avec `git diff --check` sur les fichiers possédés
- [ ] TXXX Vérifier le rendu desktop 1440×1000 et mobile 390×844 si l'interface change, puis consigner le résultat dans `specs/[###-nom-fonctionnalite]/quickstart.md`

## Handoff de convergence — hors liste d'implémentation

Cette séquence n'est pas une tâche exécutée par `/speckit-implement` :

1. lorsque toutes les tâches ci-dessus sont cochées, exécuter
   `/speckit-converge` sur l'état gelé ;
2. si la convergence ajoute des tâches, relancer `/speckit-implement`, puis
   `/speckit-converge` ;
3. seulement après un résultat « converged », promouvoir les décisions durables
   vers leurs autorités ; mettre à jour `Suivis/ETAT.md` uniquement si l'état
   vérifié, les risques ou les priorités changent, et ajouter une entrée à
   `Suivis/JOURNAL.md` uniquement pour une livraison matérielle et durable ;
   rejouer ensuite les contrôles documentaires touchés ;
4. ne créer aucune branche, pull request, commit, action distante ou publication
   sans demande explicite.

## Dépendances et ordre d'exécution

- La phase 1 précède toute écriture de production.
- La phase 2 n'existe que si un prérequis bloque plusieurs scénarios.
- Les scénarios peuvent être parallélisés après les fondations uniquement si
  leurs fichiers et invariants sont disjoints.
- Les tests ou contrôles RED précèdent leur implémentation GREEN.
- La validation utilise un état gelé. Toute modification ultérieure invalide les
  preuves touchées et impose leur rejeu ciblé.

## Stratégie d'implémentation

1. Livrer et vérifier P1 comme incrément minimal.
2. Ajouter les scénarios suivants dans l'ordre de priorité sans casser les
   scénarios déjà validés.
3. Exécuter les gates larges une seule fois sur l'état final gelé lorsqu'ils sont
   requis par `CLAUDE.md`.
4. Signaler les anomalies hors périmètre au lieu de les corriger implicitement.

## Notes

- Ne jamais éditer `data/generated/` directement ; modifier la source puis
  régénérer avec la commande prévue.
- Une URL valide n'est pas une preuve éditoriale. Vérifier la proposition qu'elle
  soutient.
- Les tests sont parallélisables seulement s'ils ne partagent ni serveur, ni port,
  ni instance Chromium.
- Les cases cochées reflètent uniquement un travail réellement exécuté et
  vérifié.
