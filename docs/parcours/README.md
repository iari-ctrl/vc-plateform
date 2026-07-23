# Conception et édition des parcours

Ce document porte les politiques transverses des parcours. Les données servies restent dans `data/parcours.json`, les aiguillages dans `data/profileParcours.json`, et les leçons dans `data/lessons.json` ou les registres `data/parcours/*.lessons.json`.

Les anciens documents de conception détaillée ont été déplacés dans `docs/archive/parcours/`. Ils expliquent certaines intentions initiales, mais ne décrivent plus l'état publié.

## Contrat actuel

- **Langue** : V1 française uniquement. Les textes sont des chaînes françaises simples ; aucune surcharge localisée n'est servie.
- **Progression** : mode souple. Les prérequis conseillent un ordre sans bloquer l'utilisateur. Une étape clé peut être signalée comme importante, jamais verrouillée implicitement.
- **Perspective** : investisseur par défaut. Les parcours de levée peuvent adopter la perspective `both` lorsque comprendre les deux côtés de la table est nécessaire.
- **Budget-temps** : `data/profileParcours.json.timeCalibration` est la source de vérité. `show` détermine les types d'étapes visibles et `cadence` le rythme affiché.
- **Jalons** : une production s'accompagne au minimum d'une auto-évaluation. Une revue par les pairs peut être proposée lorsqu'un livrable existe ; les quiz restent en auto-évaluation.
- **Durées dérivées** : un parcours qui déclare `time.source: "derived"` calcule la lecture depuis les leçons et la pratique depuis les contributions et livrables référencés. Les totaux ne sont pas recopiés dans `parcours.json`.
- **Productions longitudinales** : les exercices d'une leçon peuvent alimenter une section d'un livrable commun via `Lesson.practice`. Leur suivi reste distinct de la lecture et ne bloque aucune ressource.
- **Données personnelles** : les brouillons, états de production et autoévaluations restent dans un stockage local versionné. Les revues externes ne conservent ni identité du relecteur ni fichier dans l'application.

## Nomenclature

- **Bibliothèque** : inventaire filtrable de la matière existante, librement navigable ; elle ne possède pas de regroupement métier intermédiaire.
- **Path = Parcours** : trajectoire de formation ordonnée par objectif, composant librement des ressources existantes.
- **Atomes** : cours, leçons, cas, simulateurs, diagnostics et livrables reliés aux étapes ou au parcours.

## Modifier un parcours

1. Éditer la source JSON concernée, sans modifier directement `data/generated/`.
2. Mettre à jour `data/profileParcours.json` si l'aiguillage ou le budget-temps change.
3. Vérifier les liens vers les diagnostics, dossiers, corrections et livrables lorsqu'ils existent.
4. Exécuter `npm run validate:content:strict` puis `npm run split:content`.
5. Exécuter `npm run typecheck` et les tests avant de considérer la modification comme terminée.

Les conventions détaillées de champs, références et slugs sont documentées dans `docs/ARCHITECTURE_EDITION.md`. Les compteurs et priorités ne sont pas recopiés ici : leur seule source est `Suivis/ETAT.md`.
