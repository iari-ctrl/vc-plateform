# Stratégie VC Intelligence Platform

Document directeur maintenu. Il décrit la cible et les arbitrages durables, sans recopier l'état du corpus ni les travaux terminés. L'état vérifié et les priorités opérationnelles vivent dans `Suivis/ETAT.md`; la version stratégique longue de juillet 2026 est archivée dans `docs/archive/STRATEGIE-vc-intelligence-2026-07.md`.

## Positionnement

VC Premium Experience est une plateforme française d'intelligence VC enrichie par une couche de formation. Sa promesse est d'aider à comprendre les écosystèmes, construire des thèses, étudier des décisions et structurer un raisonnement d'investisseur.

La formation est une rampe d'accès, pas l'identité dominante. La cible reste une répartition où l'intelligence, les outils et le workspace portent l'essentiel de la valeur, tandis que les parcours accélèrent la montée en compétence.

Le produit ne doit devenir ni un simple MOOC, ni un blog startup, ni un faux terminal de données. Il ne doit pas simuler une profondeur professionnelle par des dashboards ou des chiffres non sourcés.

## Publics et usages

- professionnels du venture et du CVC qui structurent une thèse ou une décision ;
- analystes et investisseurs en progression qui cherchent méthodes, cas et outils ;
- profils sérieux en entrée dans le métier qui utilisent la formation comme rampe d'accès ;
- lecteurs orientés thèse qui explorent marchés, signaux et convictions.

Les parcours clés relient toujours plusieurs piliers : découvrir une matière, l'appliquer à un cas ou un simulateur, puis conserver une note, une décision ou un livrable dans le workspace.

## Architecture produit

### Intelligence VC

Research, analyses, atlas d'écosystèmes, convictions, mémos annotés, anti-portfolio, cas décisionnels et méthode. Chaque contenu doit produire une idée falsifiable, une preuve ou un cadre de décision réutilisable.

### Formation

Path et Parcours désignent la même trajectoire de formation ordonnée par objectif, composant librement les ressources existantes. La Bibliothèque en fournit l'inventaire filtrable ; cours, leçons et dictionnaire restent librement accessibles. Aucun verrou artificiel n'impose la progression.

### Workspace

Notes, citations, favoris, progression, états de production, autoévaluations et journal de décisions sont stockés localement. Les parcours peuvent ainsi relier une lecture à un dossier, une première version, un retour et une version révisée.

## Principes éditoriaux

- Écrire comme un analyste : une idée par paragraphe, faits sourcés, conséquence explicite, aucune survente.
- Distinguer fait, hypothèse et conviction ; dater ce qui peut changer.
- Préférer une thèse falsifiable à une synthèse exhaustive mais neutre.
- Relier les contenus existants avant de créer une nouvelle collection.
- Réserver le scrollytelling aux formats longs où la mise en scène améliore réellement la compréhension.
- Garder les contenus publics par défaut ; ne fermer un contenu que pour une raison produit explicite.

## Priorités stratégiques restantes

1. Approfondir les piliers Intelligence avec des cas, mémos et convictions suffisamment étayés pour être cités et réutilisés.
2. Étendre aux parcours prioritaires le cycle de production testé sur la venture philanthropie : dossier, première version, retour, révision et transfert.
3. Renforcer les passages entre lecture, outil, cas et journal de décisions.
4. Stabiliser la taxonomie et la qualité éditoriale avant d'élargir les collections.
5. Mesurer l'usage par la profondeur de lecture et la création d'artefacts, pas uniquement par les pages vues.

## Garde-fous

- `data/` porte les sources des collections éditoriales structurées et `data/generated/` reste strictement dérivé ; les textes d'interface et instructions exécutables appartiennent à `client/src`.
- Le produit reste statique et V1 française tant qu'une décision explicite ne change pas ce contrat.
- Aucun nombre de corpus ne vit ici : consulter `Suivis/ETAT.md`.
- Les conventions techniques et éditoriales détaillées vivent dans `docs/ARCHITECTURE_EDITION.md`.
- Les décisions produit stables vivent dans `PRODUCT.md`; l'historique ne doit pas redevenir une spécification active.

## Indicateurs utiles

- retours sur les contenus d'intelligence et réutilisation de leurs cadres ;
- notes, citations, décisions et livrables créés par session active ;
- passage d'un contenu vers un cas, un outil ou un artefact de workspace ;
- progression des parcours sans dégrader la liberté d'exploration ;
- reprise des productions et passage d'une première version à une version révisée ;
- fraîcheur des convictions, sources et dossiers datés.
