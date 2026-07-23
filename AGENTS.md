# Instructions du dépôt

`CLAUDE.md` est, malgré son nom historique, le contrat détaillé commun à **tous** les agents de code. Codex, Claude Code et tout autre agent doivent le consulter avant toute intervention ; `AGENTS.md` constitue le point d’entrée portable qui rend cette obligation explicite.

Les hooks sous `.claude/` sont propres à Claude Code. Codex et les autres agents ne doivent jamais les considérer comme une garantie : ils appliquent manuellement les mêmes interdictions, notamment l’absence d’édition directe de `data/generated/`, puis exécutent les validations adaptées.

## Règle éditoriale transverse

Toute prose destinée au produit — leçons, analyses, dossiers, articles, glossaire, parcours, certifications, textes d’interface et documentation destinée à la publication — adopte un ton correct, sobre, factuel et institutionnel. Cette règle s’applique à chaque nouvelle section et à toute révision.

Sont proscrits les formulations sensationnelles ou promotionnelles, la dramatisation, la survente, les superlatifs, l’urgence artificielle, les slogans et les appels à l’adhésion, ainsi que les tournures assimilables au marketing de réseau ou à une prose LLM stéréotypée. Les affirmations doivent rester précises, étayées et proportionnées aux éléments disponibles ; les hypothèses et incertitudes doivent être signalées.

Les principes produit vivent dans `PRODUCT.md`. La charte éditoriale transverse détaillée est maintenue dans `docs/ARCHITECTURE_EDITION.md` (§ 4.0.c) ; `CLAUDE.md` en fournit le résumé opérationnel commun aux agents. `.claude/skills/ecosystemes/SKILL.md` complète ce contrat pour les seuls dossiers d’écosystème.
