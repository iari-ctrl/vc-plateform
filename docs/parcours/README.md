# Conception et édition des parcours

Ce document porte les politiques transverses des parcours. Les données servies restent dans `data/parcours.json`, les aiguillages dans `data/profileParcours.json`, et les leçons dans `data/lessons.json` ou les registres `data/parcours/*.lessons.json`.

Les anciens documents de conception détaillée ont été déplacés dans `docs/archive/parcours/`. Ils expliquent certaines intentions initiales, mais ne décrivent plus l'état publié.

## Contrat actuel

- **Langue** : V1 française uniquement. Les textes sont des chaînes françaises simples ; aucune surcharge localisée n'est servie.
- **Progression** : mode souple. Les prérequis conseillent un ordre sans bloquer l'utilisateur. Une étape clé peut être signalée comme importante, jamais verrouillée implicitement.
- **Perspective** : investisseur par défaut. Les parcours de levée peuvent adopter la perspective `both` lorsque comprendre les deux côtés de la table est nécessaire.
- **Budget-temps** : `data/profileParcours.json.timeCalibration` est la source de vérité. `show` détermine les types d'étapes visibles et `cadence` le rythme affiché.
- **Jalons** : une production s'accompagne au minimum d'une auto-évaluation. Une revue par les pairs peut être proposée lorsqu'un livrable existe ; les quiz restent en auto-évaluation.

## Nomenclature

- **Bibliothèque** : toute la matière, librement navigable.
- **Rayons** : regroupements thématiques pour explorer un sujet.
- **Parcours** : trajectoires ordonnées par objectif.
- **Atomes** : cours, leçons, cas, simulateurs et livrables reliés aux étapes.

## Modifier un parcours

1. Éditer la source JSON concernée, sans modifier directement `data/generated/`.
2. Mettre à jour `data/profileParcours.json` si l'aiguillage ou le budget-temps change.
3. Exécuter `npm run validate:content:strict` puis `npm run split:content`.
4. Exécuter `npm run typecheck` et les tests avant de considérer la modification comme terminée.

Les conventions détaillées de champs, références et slugs sont documentées dans `docs/ARCHITECTURE_EDITION.md`. Les compteurs et priorités ne sont pas recopiés ici : leur seule source est `Suivis/ETAT.md`.
