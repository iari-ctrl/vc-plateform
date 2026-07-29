# Spécifications de fonctionnalités

Ce répertoire accueille les changements prospectifs pilotés par Spec Kit. Il ne
constitue ni un audit historique, ni un second backlog, ni une copie de l'état du
produit.

- La première commande `/speckit-specify` crée `001-<nom>/`.
- Chaque dossier porte un besoin borné et peut contenir `spec.md`, `plan.md`,
  `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `tasks.md` et des
  checklists.
- `.specify/feature.json` désigne le dossier actif pour les commandes suivantes.
- Une spécification décrit le changement visé par rapport au comportement
  existant. Les décisions stables restent dans les documents propriétaires
  recensés par `.specify/memory/project-context.md`.
- Les compteurs, risques et priorités du moment restent exclusivement dans
  `Suivis/ETAT.md`; l'historique des livraisons reste dans
  `Suivis/JOURNAL.md`.
- Aucun dossier de fonctionnalité n'autorise un commit, un push, un workflow
  distant ou un déploiement sans demande explicite.

Cycle recommandé : `specify` → `clarify` → `plan` → `checklist` → `tasks` →
`analyze` → `implement` → `converge`. Le guide complet se trouve dans
`docs/SPECKIT.md`.
