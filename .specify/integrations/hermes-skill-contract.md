# Contrat de compatibilité des compétences Hermes

**Version Spec Kit contrôlée** : 0.14.2  
**Intégration** : Hermes Agent  
**Portée** : commandes globales utilisées par vc-platform

Ce document conserve dans le dépôt les adaptations requises par le contexte
brownfield. Les compétences Hermes résident dans le profil actif et ne sont pas
versionnées avec le projet ; elles doivent donc être recontrôlées après toute
mise à niveau ou réinstallation.

## Clauses requises

### `/speckit-implement`

- La compétence charge directement `spec.md` en plus du plan et des tâches.
- La vérification de l'installation est en lecture seule par défaut.
- La détection d'une technologie n'autorise aucune écriture.
- Un fichier d'exclusion, de configuration ou de package ne peut être créé ou
  modifié que si `spec.md`, `plan.md` et `tasks.md` le nomment comme fichier
  possédé et si les instructions du dépôt autorisent cette portée.
- L'implémentation suit la liste de tâches résolue ; elle n'initialise ni ne
  restructure génériquement un projet brownfield.
- Les tests et contrôles imposés par la constitution, la spécification, le plan
  ou le modèle de tâches précèdent l'implémentation concernée.
- Une checklist incomplète bloque l'implémentation lorsque le dépôt l'exige ; le
  contournement générique ne peut pas prévaloir sur cette règle.

### `/speckit-tasks`

- Le modèle résolu et la constitution priment sur les exemples génériques.
- La première phase porte sur la reconnaissance et la preuve initiale dans un
  dépôt brownfield ; elle n'initialise une application que si la fonctionnalité
  le demande explicitement.
- Les tâches de test ou de validation sont obligatoires dès qu'une autorité du
  chantier les exige.
- La convergence post-implémentation reste un handoff hors de la liste de cases
  exécutée par `/speckit-implement`.

### `/speckit-plan`

- `setup-plan.sh` résout d'abord le sélecteur sans le persister.
- Le dossier de fonctionnalité et `spec.md` doivent déjà exister ; sinon le
  script échoue avant toute création de dossier, de plan ou de sélecteur.
- Un sélecteur explicite n'est persisté qu'après cette validation.

### `/speckit-analyze`

- L'analyse couvre `spec.md`, `plan.md` et `tasks.md`, mais aussi chaque artefact
  présent parmi `research.md`, `data-model.md`, `contracts/` et `quickstart.md`.
- Son contrôle préalable utilise `check-prerequisites.sh --paths-only`, donc la
  résolution d'un sélecteur explicite reste strictement sans écriture.
- Elle inventorie les décisions, invariants, schémas, migrations, scénarios et
  preuves de ces artefacts, puis contrôle leur cohérence et leur couverture par
  les tâches.
- Elle consulte les seules autorités maintenues explicitement référencées par le
  delta ; elle ne transforme pas le contrôle en audit sans borne du dépôt.

### `/speckit-converge`

- `spec.md`, `plan.md` et `tasks.md` définissent le delta borné de la
  fonctionnalité, sans remplacer les autorités maintenues du projet.
- Les artefacts présents `research.md`, `data-model.md`, `contracts/` et
  `quickstart.md`, ainsi que les autorités qu'ils référencent, complètent
  l'inventaire des obligations à vérifier.
- La convergence s'arrête si une tâche existante reste non cochée ; elle ne crée
  pas de doublon pour une implémentation interrompue.
- Un résultat propre conduit au processus de revue et de clôture autorisé par le
  dépôt. Il n'autorise jamais à lui seul branche, commit, push, pull request ou
  déploiement.

## État de l'installation active

Les quatre compétences du profil Hermes actif ont été alignées sur ces clauses
pendant l'initialisation du cadrage. Ce changement est global au profil actif ;
il reste générique et préserve les projets ne portant pas de contraintes
brownfield particulières.

## Contrôle après mise à niveau

1. Recharger les compétences `speckit-implement`, `speckit-tasks`,
   `speckit-analyze` et `speckit-converge`.
2. Vérifier la présence des clauses ci-dessus avant toute exécution.
3. Vérifier que le workflow `.specify/workflows/speckit/workflow.yml` s'arrête
   après la génération des tâches et renvoie au cycle manuel.
4. Rejouer le smoke test isolé des scripts et `git diff --check`.
5. Si une clause manque, suspendre `analyze`, `implement` ou `converge` jusqu'à sa
   réconciliation ; ne pas compenser silencieusement dans une fonctionnalité.
