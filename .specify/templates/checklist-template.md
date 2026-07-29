# Checklist [TYPE] : [NOM DE LA FONCTIONNALITÉ]

**Objet** : [qualité des exigences contrôlée]  
**Créée le** : [DATE]  
**Fonctionnalité** : [lien vers spec.md]

**Note** : cette checklist est générée par `/speckit-checklist`. Elle évalue la
complétude, la clarté, la cohérence et la mesurabilité des exigences ; elle ne
remplace ni les tests, ni la recette de l'implémentation.

<!--
  Les éléments ci-dessous sont des exemples. La commande doit les remplacer par
  des questions propres à la fonctionnalité, issues de spec.md et, si présents,
  de plan.md et tasks.md. Chaque question doit porter sur la qualité des
  exigences et conserver une référence de traçabilité.
-->

## Cadrage brownfield

- [ ] CHK001 Le comportement existant et le changement proposé sont-ils distingués ? [Clarté, Spec §Contexte]
- [ ] CHK002 Les autorités maintenues qui gouvernent le besoin sont-elles citées ? [Traçabilité, Spec §Contexte]
- [ ] CHK003 Le périmètre, les non-objectifs, les dépendances et les reports sont-ils explicites ? [Complétude, Spec §Périmètre]
- [ ] CHK004 La protection des changements préexistants hors périmètre est-elle formulée ? [Gap]

## Exigences et risques

- [ ] CHK005 Chaque exigence est-elle mesurable et rattachée à un scénario ? [Gap, Mesurabilité]
- [ ] CHK006 Les règles de compatibilité des identifiants, URL, contenus ou données locales concernés sont-elles définies ? [Gap]
- [ ] CHK007 Les cas limites, erreurs et indisponibilités ont-ils des résultats attendus explicites ? [Couverture]
- [ ] CHK008 Les exigences de preuve éditoriale et de frontière des données publiques sont-elles couvertes lorsqu'elles sont pertinentes ? [Gap]

## Conformité au projet

- [ ] CHK009 La source propriétaire de chaque donnée et le statut des sorties générées sont-ils précisés ? [Gap, Traçabilité]
- [ ] CHK010 Tout écart à l'architecture statique, à la V1 française ou à la persistance locale fait-il l'objet d'une décision explicite ? [Cohérence]
- [ ] CHK011 Les exigences d'accessibilité, de clavier, de mouvement réduit et de petits écrans sont-elles définies pour les surfaces concernées ? [Gap, Couverture]
- [ ] CHK012 Les preuves RED–GREEN et les gates proportionnés attendus sont-ils documentés ? [Gap, Complétude]
- [ ] CHK013 Les effets de bord Git, distants et de déploiement sont-ils explicitement exclus ou autorisés ? [Clarté, Spec §Périmètre]

## Notes

- Cocher uniquement une question à laquelle les artefacts répondent : `[x]`.
- Ajouter une référence `[Spec §…]`, `[Gap]`, `[Ambiguity]`, `[Conflict]` ou
  `[Assumption]` à chaque élément généré.
- Reporter les écarts dans la spécification ou le plan, pas uniquement ici.
