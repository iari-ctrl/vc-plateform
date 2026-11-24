# Instructions du dépôt

`AGENTS.md` est le point d’entrée portable. Tout agent doit lire `CLAUDE.md`, contrat détaillé commun à Hermes, Codex, Claude Code et autres outils. Ne pas créer `.hermes.md`, qui supplanterait cette entrée dans Hermes.

Les hooks `.claude/` ne valent que pour Claude Code ; les autres agents appliquent les interdictions et validations manuellement.

## Rappels minimaux

- Préserver le worktree sale : vérifier le statut, ne pas s’attribuer les diffs existants, ne pas utiliser `stash`, `reset`, `clean` ou checkout destructif sans demande.
- Modifier les sources propriétaires ; jamais `data/generated/` ni les HTML assemblés du simulateur de note. Sources et générateurs : `CLAUDE.md` §4.
- Aucun commit, push, workflow distant ou déploiement sans demande explicite.
- Prose produit sobre, factuelle et institutionnelle. Autorités : `PRODUCT.md`, `docs/ARCHITECTURE_EDITION.md` §4.0.c, résumé dans `CLAUDE.md`; la compétence écosystèmes ne couvre que `/ecosystemes`.
- Pour une interface, lire le [mode d'emploi du design system](docs/DESIGN_SYSTEM.md#utilisation), puis les sections et sources de la surface concernée. Distinguer règles attendues, comportement implémenté et écarts connus ; le catalogue `/design-system` reste une démonstration de développement.
- Pour Formation, charger de manière ciblée [l’état courant](Suivis/ETAT.md#consolidation-formation), [les distinctions d’architecture](docs/ARCHITECTURE_EDITION.md#preparation-formation) et [les politiques Parcours](docs/parcours/README.md#preparation-formation), sans assimiler un plan préparatoire à un contrat implémenté.
