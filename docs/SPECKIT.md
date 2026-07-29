# Utiliser Spec Kit dans vc-platform

Spec Kit est initialisé pour l'intégration Hermes Agent avec les scripts Bash de
la version 0.14.2. Les fonctionnalités sont numérotées séquentiellement et aucune
extension Git n'est activée : créer une spécification ne crée ni branche, ni
commit, ni push.

## Documents de cadrage

| Document | Responsabilité |
| --- | --- |
| `.specify/memory/constitution.md` | Principes non négociables et gouvernance des spécifications |
| `.specify/memory/project-context.md` | Ordre de lecture et reprise brownfield de l'état actuel |
| `.specify/templates/overrides/` | Modèles locaux de spécification, plan et tâches, prioritaires sur le cœur |
| `.specify/templates/checklist-template.md` | Modèle de checklist lu directement par la compétence Hermes actuelle |
| `.specify/integrations/hermes-skill-contract.md` | Clauses de compatibilité des compétences globales Hermes |
| `specs/README.md` | Règles de classement et cycle de vie des fonctionnalités |
| `specs/<numéro>-<nom>/` | Spécification, plan, recherches, contrats, guide de validation et tâches d'une fonctionnalité |

Les adaptations de `spec`, `plan` et `tasks` vivent sous
`.specify/templates/overrides/`. La compétence `/speckit-checklist` 0.14.2 lit
encore le modèle canonique directement : ce seul fichier du cœur est donc adapté
au dépôt et doit être réconcilié explicitement lors d'une mise à niveau.

## Démarrer une fonctionnalité

La constitution est déjà ratifiée. La première commande utile est donc :

```text
/speckit-specify Décrire l'objectif utilisateur et la valeur attendue. Partir du comportement existant et des autorités indiquées dans .specify/memory/project-context.md. Conserver [invariants]. Inclure [périmètre]. Exclure [non-objectifs]. Considérer la fonctionnalité réussie lorsque [résultats observables].
```

Cette commande crée `specs/001-<nom>/spec.md`, son contrôle de qualité et
`.specify/feature.json`, qui désigne la fonctionnalité active. Elle ne doit pas
servir à résumer tout le produit : chaque dossier décrit un delta prospectif et
borné.

### Parcours complet recommandé

Le cycle manuel Hermes ci-dessous est le contrat d'usage du dépôt. Le workflow
groupé sous `.specify/workflows/speckit/` est adapté localement : il s'arrête après
la génération des tâches et renvoie explicitement aux étapes manuelles de
contrôle, analyse, implémentation, convergence et clôture décrites ici.

1. `/speckit-specify` — formaliser le besoin, le périmètre et les résultats.
2. `/speckit-clarify` — résoudre les décisions de portée réellement ambiguës.
3. `/speckit-plan` — établir l'approche technique après inspection du dépôt.
4. `/speckit-checklist` — contrôler les exigences propres au chantier.
5. `/speckit-tasks` — produire des tâches ordonnées, testables et assignables.
6. `/speckit-analyze` — vérifier la cohérence entre spécification, plan et tâches.
7. `/speckit-implement` — exécuter le périmètre autorisé.
8. `/speckit-converge` — comparer l'implémentation aux artefacts et ajouter les
   écarts restants aux tâches.

Une checklist ne se clôt pas en cochant formellement ses cases : chaque écart
impose de corriger la spécification, le plan, les contrats ou les tâches
concernés, puis de vérifier la case. Toute case non résolue bloque `analyze` et
`implement` dans ce dépôt ; le contournement générique proposé par la compétence
n'est pas autorisé.

La convergence est une boucle d'orchestration après `/speckit-implement`, jamais
une case du `tasks.md` que cette même commande doit exécuter. Si elle ajoute des
tâches, relancer `implement`, puis `converge`, jusqu'à un résultat propre.

Pour une modification documentaire ou technique très bornée, les étapes
`clarify`, `checklist` et `analyze` peuvent être omises si aucune ambiguïté ni
risque transverse ne le justifie. Les contrôles de la constitution restent
applicables.

## Changer de fonctionnalité active

Spec Kit résout la fonctionnalité à partir de `.specify/feature.json`, et non de
la branche Git. Pour reprendre un dossier existant, demander à Hermes d'exécuter
depuis la racine :

```bash
.specify/scripts/bash/select-feature.sh --json specs/<numéro>-<nom>
```

Le helper vérifie le format du chemin, l'existence du dossier et de `spec.md`,
puis modifie uniquement `.specify/feature.json`. Il ne crée ni branche ni commit.
Vérifier sa sortie avant `plan`, `tasks`, `analyze`, `implement` ou `converge`.

`feature.json` est un sélecteur de travail. Il ne remplace ni le statut écrit
dans `spec.md`, ni `Suivis/ETAT.md`.

## Règles de session

- Relire `AGENTS.md`, `CLAUDE.md`, la constitution, le contexte brownfield et les
  références propres au chantier avant le premier patch.
- Rejouer `git status --short` avant la première écriture et avant la clôture.
- Traiter la vérification générique d'installation de `/speckit-implement` en
  lecture seule. Ne modifier aucun ignore, manifest ou fichier de configuration
  qui n'est pas explicitement possédé et autorisé par la fonctionnalité.
- Définir le périmètre possédé, les dépendances, les critères d'acceptation et
  les reports explicites dans la spécification ou le plan.
- Ne jamais éditer directement `data/generated/`.
- Pour un changement de comportement, établir une preuve RED reproductible avant
  l'implémentation GREEN. Pour la documentation et le contenu, exécuter les
  validations ciblées prévues par `CLAUDE.md`.
- Inclure dans `analyze` et `converge` les artefacts présents `research.md`,
  `data-model.md`, `contracts/` et `quickstart.md`, ainsi que les seules autorités
  maintenues qu'ils référencent pour le delta borné.
- Ne jamais présenter un test, un build, une recette, une revue ou un compte
  comme exécuté sans sortie réelle.
- Ne pas committer, pousser, lancer un workflow distant ou déployer sans demande
  explicite.

## Clôture d'une fonctionnalité

Une fonctionnalité n'est close que lorsque ses critères sont vérifiés sur l'état
final, que `tasks.md` reflète le travail réellement terminé et que
`/speckit-converge` ne relève plus d'écart bloquant. Si la livraison modifie une
décision durable, son état vérifié ou les priorités, reporter le résultat dans
les autorités concernées, puis mettre à jour `Suivis/ETAT.md` et ajouter une
entrée datée à `Suivis/JOURNAL.md`.

Dans ce dépôt local-first, un résultat « converged » conduit à la revue locale et
à la mise à jour des suivis. Il n'autorise pas l'ouverture d'une pull request, un
push ou un déploiement sans demande explicite.

## Maintenance de l'outillage

L'exécution des compétences Hermes ne nécessite pas une installation persistante
de la CLI. Pour mettre à jour l'infrastructure, installer la CLI officielle dans
un environnement isolé, contrôler d'abord la mise à niveau, conserver les
surcharges locales et réconcilier les adaptations du modèle de checklist, du
workflow de brouillon et du contrat des compétences Hermes :

```bash
# Si uv est disponible
uv tool install 'specify-cli==0.14.2'
specify self check
specify self upgrade --dry-run

# Sinon, environnement Python isolé compatible PEP 668
python3 -m venv /tmp/specify-cli-venv
/tmp/specify-cli-venv/bin/python -m pip install 'specify-cli==0.14.2'
/tmp/specify-cli-venv/bin/specify self check
/tmp/specify-cli-venv/bin/specify self upgrade --dry-run
```

Les divergences de `.specify/templates/checklist-template.md` et
`.specify/scripts/bash/setup-plan.sh` avec leurs empreintes d'installation sont
intentionnelles : la première aligne la checklist réellement consommée, la
seconde rend la planification fail-closed avant toute écriture. Le workflow et
son registre portent la source `project-local` et doivent conserver leur arrêt
avant implémentation. Ne pas écraser ces adaptations sans reporter le cadrage
brownfield et le handoff manuel. Recontrôler aussi les clauses de
`.specify/integrations/hermes-skill-contract.md`, car les compétences vivent hors
du dépôt.

Une mise à niveau de `.specify/` est une intervention d'outillage distincte d'une
évolution fonctionnelle sous `specs/`. Elle doit être vérifiée séparément.
