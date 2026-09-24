# Conception et édition des parcours

Ce document porte les politiques transverses des parcours. Les données servies restent dans `data/parcours.json`, les relations cartographiques dans `data/parcoursRelations.json`, les aiguillages dans `data/profileParcours.json`, et les leçons dans `data/lessons.json` ou les registres `data/parcours/*.lessons.json`.

Les anciens documents de conception détaillée ont été déplacés dans `docs/archive/parcours/`. Ils expliquent certaines intentions initiales, mais ne décrivent plus l'état publié.

## Contrat actuel

- **Langue** : V1 française uniquement. Les textes sont des chaînes françaises simples ; aucune surcharge localisée n'est servie.
- **Progression** : mode souple. Les prérequis conseillent un ordre sans bloquer l'utilisateur. Une étape clé peut être signalée comme importante, jamais verrouillée implicitement.
- **Relations cartographiques** : le graphe reste éditorial et clairsemé. Une relation `peer` relie deux parcours du même niveau pédagogique ; une relation `progression` indique une suite conseillée fondée sur un prérequis, un aiguillage, des contenus partagés, des objectifs ou un référentiel maintenu. Elle ne constitue ni un verrou ni une équivalence avec un niveau de certification. Les traits ne sont rendus dans `PathAtlas` que pendant le survol, le focus ou après un premier appui tactile sur le parcours concerné ; le second appui ouvre le parcours.
- **Perspective** : investisseur par défaut. Les parcours de levée peuvent adopter la perspective `both` lorsque comprendre les deux côtés de la table est nécessaire.
- **Budget-temps** : `data/profileParcours.json.timeCalibration` est la source de vérité. `show` détermine les types d'étapes visibles et `cadence` le rythme affiché.
- **Jalons** : une production s'accompagne au minimum d'une auto-évaluation. Une revue par les pairs peut être proposée lorsqu'un livrable existe ; les quiz restent en auto-évaluation.
- **Durées dérivées** : un parcours qui déclare `time.source: "derived"` calcule la lecture depuis les leçons et la pratique depuis les contributions et livrables référencés. Les totaux ne sont pas recopiés dans `parcours.json`.
- **Productions longitudinales** : les exercices d'une leçon peuvent alimenter une section d'un livrable commun via `Lesson.practice`. Leur suivi reste distinct de la lecture et ne bloque aucune ressource.
- **Données personnelles** : les brouillons, états de production et autoévaluations restent dans un stockage local versionné. Les revues externes ne conservent ni identité du relecteur ni fichier dans l'application.

<a id="preparation-formation"></a>

## Préparation de Formation

Le [manuel d’architecture](../ARCHITECTURE_EDITION.md#preparation-formation) distingue publication, disponibilité, résolution d’étape et mode de complétion. Ne pas présenter les contrats futurs du plan de consolidation comme déjà implémentés : `roadmap` reste un ordre de construction, `steps[].status` un état de résolution, et les prérequis textuels ne remplacent pas des références stables de leçons.

- **Connaissance, orientation, production** : qualifier d’abord la promesse réelle. L’absence d’un livrable n’est pas un défaut pour un parcours de connaissance ; une orientation ne promet pas un titre professionnel. Une promesse de production exige en revanche une sortie exécutable, pas seulement un libellé de jalon. Cette grille pédagogique n’ajoute pas à elle seule un champ au schéma.
- **Jalon résolu** : `resolveStep` cherche un livrable, puis une leçon publiée pour une référence `milestone`. Un quiz final adossé à une leçon relève de la progression de lecture, pas d’un état de production homonyme.
- **Prérequis** : vérifier la séquence réellement consommée, y compris les leçons des étapes `course`. Signaler un prérequis postérieur ou absent ; ne pas ajouter, supprimer ou réordonner automatiquement du contenu sur la seule base d’un diagnostic.
- **Disponibilité des conteneurs** : distinguer une référence présente, une leçon publiée et un cours ou parcours réellement utilisable. Tester les cours vides et partiels même si le corpus courant ne contient plus de cours sans leçon publiée. Ne pas produire les leçons à venir uniquement pour satisfaire un compteur.
- **Charge** : [learningTime.ts](../../client/src/content/learningTime.ts) porte le calcul effectif. Réconcilier séparément lecture, pratique guidée, cas/simulateurs, livrables, final et facultatif ; une donnée manquante ne qualifie pas une charge nulle. Conserver la distinction entre durée déclarée et dérivée.

Un gate de préparation diagnostique ces écarts ; il ne décide pas à la place d’un éditeur du mode de complétion, des prérequis d’entrée ou d’une publication. Les migrations de données et les validations praticiennes constituent des étapes séparées. L’état de F0/S0 et les observations datées vivent dans [Suivis/ETAT.md](../../Suivis/ETAT.md#consolidation-formation).

## Nomenclature

- **Bibliothèque** : inventaire filtrable de la matière existante, librement navigable ; elle ne possède pas de regroupement métier intermédiaire.
- **Path = Parcours** : trajectoire de formation ordonnée par objectif, composant librement des ressources existantes.
- **Atomes** : cours, leçons, cas, simulateurs, diagnostics et livrables reliés aux étapes ou au parcours.

## Modifier un parcours

1. Éditer la source JSON concernée, sans modifier directement `data/generated/`.
2. Mettre à jour `data/parcoursRelations.json` lorsqu'un changement d'objectif, de prérequis ou de contenu modifie une relation justifiée ; conserver `evidence[]` et `rationale` proportionnés aux sources internes.
3. Mettre à jour `data/profileParcours.json` si l'aiguillage ou le budget-temps change.
4. Vérifier les liens vers les diagnostics, dossiers, corrections et livrables lorsqu'ils existent.
5. Exécuter `npm run validate:content:strict`. Régénérer avec `npm run split:content`, puis vérifier avec `npm run check:generated`, seulement si les sources de leçons ou de glossaire changent ; une modification de `parcours.json` seule ne change pas ces projections.
6. Exécuter les tests de contrat concernés, puis les contrôles proportionnés de [CLAUDE.md §7](../../CLAUDE.md#7-validation-proportionnée). Une modification de routes, de publication ou de rendu demande les vérifications correspondantes ; une passe documentaire seule ne justifie pas un build.

Les conventions détaillées de champs, références et slugs sont documentées dans [docs/ARCHITECTURE_EDITION.md](../ARCHITECTURE_EDITION.md). Les compteurs vérifiés et priorités ne sont pas recopiés ici : leur instantané maintenu est [Suivis/ETAT.md](../../Suivis/ETAT.md), établi depuis les sources et contrôles courants.
