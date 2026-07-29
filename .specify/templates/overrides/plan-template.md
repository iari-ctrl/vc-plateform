# Plan d'implémentation : [FONCTIONNALITÉ]

**Dossier** : `specs/[###-nom-fonctionnalite]` | **Date** : [DATE] | **Spécification** : [lien]

**Entrée** : spécification dans `specs/[###-nom-fonctionnalite]/spec.md`

<!--
Ce modèle est rempli par /speckit-plan. Avant de décider : lire AGENTS.md,
CLAUDE.md, la constitution, le contexte brownfield, la spécification et les
sources réellement concernées. Vérifier package.json et les imports voisins ;
ne pas déduire la stack d'un exemple générique.
-->

## Synthèse

[Résumer le besoin prioritaire et l'approche retenue après inspection et
recherche.]

## État de référence consulté

| Surface | Faits vérifiés | Autorité ou preuve |
| --- | --- | --- |
| Produit et priorité | [État de départ] | [Document maintenu] |
| Comportement actuel | [Comportement observé] | [Code, donnée, test ou recette] |
| Changements locaux préexistants | [Conflits ou absence de conflit] | `git status --short` et diff ciblé |

**Fichiers possédés par ce chantier** : [liste bornée]  
**Fichiers explicitement hors périmètre** : [liste ou catégories]  
**Dépendances** : [dépendances internes, validation métier ou ressource externe]  
**Reports** : [travaux différés avec justification]

## Contexte technique

Les valeurs ci-dessous décrivent le socle attendu et doivent être confirmées sur
l'état courant du dépôt.

**Langage et runtime** : TypeScript/JavaScript ESM ; Node.js ≥ 20  
**Dépendances principales** : React 19, Vite 6, React Router 7, Tailwind CSS v3  
**Stockage** : JSON statique et `localStorage` sous contrats `vcpx:` ; aucun backend applicatif  
**Tests** : Vitest/jsdom côté client et `node --test` pour `scripts/` et `shared/`  
**Cible** : application web statique française, desktop et mobile  
**Type de projet** : monorepo npm avec workspace `client`  
**Objectifs de performance** : [objectifs propres à la fonctionnalité ou absence justifiée]  
**Contraintes** : base URL configurable, publication fermée par défaut, données navigateur publiques, prérendu strict si la surface est publique  
**Échelle et portée** : [routes, collections, composants et volumes effectivement concernés]

## Contrôle de la constitution

*GATE : tous les points doivent passer avant la recherche de phase 0, puis être
rejoués après la conception de phase 1.*

| Contrôle | Avant recherche | Après conception | Preuve ou justification |
| --- | --- | --- | --- |
| Sources de vérité et périmètre brownfield identifiés | [PASS/FAIL] | [PASS/FAIL] | [références] |
| Aucun changement préexistant hors périmètre n'est absorbé | [PASS/FAIL] | [PASS/FAIL] | [statut/diff] |
| Propriétaire de chaque donnée et dérivation des générés respectés | [PASS/FAIL] | [PASS/FAIL] | [chemins/commandes] |
| Architecture statique, V1 française et données locales préservées ou décision explicite | [PASS/FAIL] | [PASS/FAIL] | [décision] |
| Exigences éditoriales, preuves et frontière des données publiques couvertes | [PASS/FAIL] | [PASS/FAIL] | [contrôles] |
| Stratégie RED–GREEN et validations proportionnées définies | [PASS/FAIL] | [PASS/FAIL] | [tests/gates] |
| Accessibilité, clavier, mouvement et petits écrans couverts si l'UI change | [PASS/FAIL] | [PASS/FAIL] | [recette] |
| Vérification d'installation en lecture seule ; aucun fichier d'exclusion ou de configuration hors périmètre | [PASS/FAIL] | [PASS/FAIL] | [fichiers possédés] |
| Aucun commit, push, workflow distant ou déploiement implicite | [PASS/FAIL] | [PASS/FAIL] | [périmètre] |

Un contrôle en échec bloque le plan, sauf dérogation explicite consignée dans
« Suivi de complexité » et approuvée comme décision produit.

## Phase 0 — Recherche et décisions

Pour chaque inconnue matérielle, consigner dans `research.md` :

- **Décision** : choix retenu ;
- **Justification** : preuves locales ou externes qui le soutiennent ;
- **Alternatives examinées** : options écartées et raison ;
- **Limites** : hypothèses, incertitudes et validation encore requise.

Aucune mention `NEEDS CLARIFICATION` ne doit rester avant la phase 1.

## Phase 1 — Conception et validation

Produire uniquement les artefacts utiles :

- `data-model.md` pour les entités, validations, relations et migrations ;
- `contracts/` pour les interfaces publiques, schémas de données, routes ou
  contrats UI concernés ;
- `quickstart.md` pour les scénarios exécutables de validation de bout en bout.

Le guide `quickstart.md` décrit les prérequis, commandes réellement disponibles,
résultats attendus et critères d'arrêt. Il ne contient pas l'implémentation.

## Structure du projet

### Documentation de la fonctionnalité

```text
specs/[###-fonctionnalite]/
├── spec.md
├── plan.md
├── research.md          # si une décision doit être instruite
├── data-model.md        # si des entités ou migrations sont concernées
├── contracts/           # si une interface ou un schéma est concerné
├── quickstart.md
├── checklists/
└── tasks.md             # créé par /speckit-tasks
```

### Sources du dépôt

```text
client/
└── src/                 # application React, contenu typé, état local et tests DOM
data/                    # collections éditoriales canoniques
data/generated/          # sorties dérivées, jamais éditées à la main
shared/                  # contrats purs partagés entre Node et navigateur
scripts/                 # génération, validation, sitemap et prérendu
docs/                    # références maintenues
Suivis/                  # état vérifié et journal
specs/                   # artefacts Spec Kit par fonctionnalité
```

**Décision de structure** : [chemins réellement utilisés et raison ; supprimer
les lignes non concernées plutôt que créer de nouveaux répertoires génériques.]

## Stratégie de preuve

| Type de changement | RED attendu | GREEN ciblé | Gate final proportionné |
| --- | --- | --- | --- |
| Comportement | [test reproductible en échec] | [suite ciblée] | [typecheck/lint/test/check/build] |
| Contenu ou schéma | [fixture ou validateur en échec] | [validation ciblée] | [strict/generated/glossaire] |
| UI ou route | [test DOM ou reproduction] | [suite ciblée] | [recette desktop/mobile et build si requis] |
| Documentation | [écart précis] | [contrôle de liens, chemins ou cohérence] | [`git diff --check` ou contrôle ciblé] |

## Suivi de complexité

> Remplir uniquement si un contrôle constitutionnel est enfreint et qu'une
> dérogation explicite est requise.

| Violation | Nécessité démontrée | Alternative plus simple écartée parce que |
| --- | --- | --- |
| [violation] | [preuve] | [raison] |
