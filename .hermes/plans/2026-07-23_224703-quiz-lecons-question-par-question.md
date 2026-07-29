# Quiz des leçons — plan d’implémentation

**Objectif :** afficher une seule question à la fois et faire de la sélection d’une réponse l’unique action nécessaire pour progresser.

**Périmètre :** `QuizBlock` et son test DOM. Le test d’orientation, les évaluations certificatives, les données éditoriales et la persistance restent hors périmètre.

## Étapes

1. Étendre `client/src/components/reading/QuizBlock.dom.test.tsx` pour prouver qu’un seul groupe radio est visible, qu’un choix affiche la question suivante sans bouton « Valider » ou « Suivant », puis que le dernier choix affiche le score et son retour pédagogique.
2. Exécuter le test ciblé et conserver l’échec RED attendu.
3. Adapter `client/src/components/reading/QuizBlock.tsx` avec un index courant, une progression immédiate au changement du radio, un retour annoncé et un transfert de focus vers la question suivante ou le résultat final.
4. Rejouer le test ciblé, puis `npm run typecheck`, `npm run lint` et `npm run test`.
5. Contrôler le composant dans le navigateur en bureau et mobile, sans modifier les autres flux de questionnaire.

## Critères d’acceptation

- une seule question de leçon est rendue à la fois ;
- un clic ou choix clavier enregistre la réponse et avance immédiatement ;
- aucun bouton « Valider » ou « Suivant » n’est nécessaire ;
- les radios restent nativement accessibles, le retour est annoncé et le focus reste prévisible ;
- le score final tient compte de toutes les réponses.
