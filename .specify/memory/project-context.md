# Contexte brownfield — vc-platform

**Réconcilié le** : 2026-07-24  
**Rôle** : index de reprise pour Spec Kit, sans duplication des sources de vérité.

> [!IMPORTANT]
> Ce document oriente la lecture. Il ne remplace ni l'implémentation, ni les
> documents maintenus, ni l'état vérifié. En cas d'écart, appliquer la hiérarchie
> ci-dessous et signaler la dérive au lieu de la résoudre implicitement.

## 1. Lecture obligatoire avant toute spécification

1. Lire `AGENTS.md`, puis le contrat détaillé commun `CLAUDE.md`.
2. Lire `PRODUCT.md` pour les principes produit stables.
3. Lire `docs/STRATEGIE-vc-intelligence.md` pour la cible et les priorités.
4. Lire `Suivis/ETAT.md` pour l'état vérifié, les risques et les priorités
   opérationnelles du moment.
5. Lire les références maintenues propres au chantier, puis vérifier le
   comportement réel dans le code, les données et les scripts concernés.
6. Consulter `Suivis/JOURNAL.md` uniquement pour reconstituer une décision ou une
   validation passée. Les documents sous `docs/archive/` et `Suivis/AUDIT/` sont
   historiques et non normatifs.

## 2. Hiérarchie des autorités

| Question | Autorité à consulter |
| --- | --- |
| Comportement actuellement implémenté | `client/`, `data/`, `shared/`, `scripts/`, `package.json` |
| Principes produit stables | `PRODUCT.md` |
| Direction et priorités stratégiques | `docs/STRATEGIE-vc-intelligence.md` |
| État vérifié, risques, compteurs et priorités immédiates | `Suivis/ETAT.md` |
| Architecture éditoriale et cycle des contenus | `docs/ARCHITECTURE_EDITION.md` |
| Système visuel, interactions et accessibilité | `docs/DESIGN_SYSTEM.md` |
| Ontologie et règles des parcours | `CLAUDE.md` et `docs/parcours/README.md` |
| Certifications | `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md` |
| Historique des travaux | `Suivis/JOURNAL.md` |

Une spécification sous `specs/` décrit un changement prospectif borné. Elle ne
redéfinit pas silencieusement une autorité maintenue. Toute décision durable issue
d'une fonctionnalité doit être reportée dans le document propriétaire du fait au
moment de la clôture.

## 3. Socle produit et technique actuel

- VC Premium Experience est une plateforme française d'intelligence du
  capital-risque enrichie par une formation. Elle articule Intelligence VC,
  Formation et Workspace.
- Path et Parcours désignent la même trajectoire ordonnée par objectif. La
  Bibliothèque est l'inventaire filtrable des ressources existantes et ne porte
  aucun modèle distinct de rayon.
- Le produit est une application web statique, sans backend applicatif, base de
  données distante, mur d'authentification ni route localisée. Les routes
  canoniques sont françaises et non préfixées.
- Les collections éditoriales structurées ont leur source dans `data/`. Les
  fichiers sous `data/generated/` sont dérivés et ne sont jamais édités à la
  main.
- Les données utilisateur restent dans le navigateur sous contrats `vcpx:`
  versionnés, validés et migrés. `localStorage` n'est pas un stockage
  confidentiel.
- Toute donnée livrée au navigateur ou placée sous `client/public/` est publique.
  Aucun secret, jeton, donnée personnelle confidentielle ou information de deal
  non publique ne peut y être incorporé.
- Les routes publiques, l'origine canonique, la base de déploiement, le sitemap
  et le prérendu suivent les contrats partagés décrits dans `CLAUDE.md`.
- La cible d'accessibilité est WCAG 2.2 niveau AA. Les interactions au clavier,
  le focus visible, la réduction du mouvement et les petits écrans font partie
  des critères de conception.
- Le travail est local-first. Git distant sert de sauvegarde ; commit, push,
  workflow distant et déploiement exigent une demande explicite.

## 4. Reprendre l'avancée courante

Ce document ne conserve aucune photographie des travaux terminés, des compteurs,
des risques ou des priorités. La date de réconciliation en tête atteste seulement
que l'index et la hiérarchie ont été contrôlés à cette date.

Au début de chaque fonctionnalité :

1. lire dans `Suivis/ETAT.md` l'instantané, le plan de correction, les compteurs
   et les dernières vérifications pertinents ;
2. inspecter le comportement réel dans le code, les données et les scripts
   propriétaires du périmètre ;
3. consulter `Suivis/JOURNAL.md` seulement pour retrouver l'origine d'une décision
   ou d'une preuve passée ;
4. relire `docs/STRATEGIE-vc-intelligence.md` et `PRODUCT.md` pour les priorités et
   limites durables applicables au chantier.

## 5. Priorités et limites

Les priorités ne sont pas recopiées ici. Une spécification doit citer l'autorité
maintenue et la date de lecture qui justifient sa priorité. Tout sujet qui n'est
pas explicitement ouvert par ces autorités reste hors du delta de fonctionnalité
et nécessite une décision séparée ; un artefact Spec Kit ne peut pas l'introduire
par défaut.

## 6. Protocole brownfield par fonctionnalité

Avant de créer ou modifier une spécification :

1. relire l'état et les autorités pertinentes à la date de la session ;
2. exécuter `git status --short` et séparer les changements préexistants du
   périmètre de la fonctionnalité ;
3. décrire le comportement existant, le changement visé, les non-objectifs, les
   dépendances, les risques et les reports explicites ;
4. identifier les fichiers ou collections propriétaires des faits concernés ;
5. définir des critères d'acceptation observables sans choisir prématurément
   l'implémentation ;
6. prévoir la compatibilité avec les URLs, identifiants, contenus publiés et
   données locales existants ;
7. ne planifier une mise à jour de `Suivis/ETAT.md` et `Suivis/JOURNAL.md` qu'à la
   clôture d'une livraison matérielle et vérifiée.

Le dépôt peut rester volontairement sale entre plusieurs chantiers locaux. Une
spécification n'autorise jamais la suppression, la reformulation ou le
reformatage de changements qui ne lui appartiennent pas.

## 7. Activation Spec Kit

- Aucune fonctionnalité n'est active dans l'état initial. La première commande
  `/speckit-specify` crée `specs/001-...` et le sélecteur local
  `.specify/feature.json`.
- Le workflow enregistré `speckit` ne produit que le brouillon `specify → plan →
  tasks`, puis s'arrête avant toute implémentation. Le cycle manuel de
  `docs/SPECKIT.md` reste obligatoire.
- Les compétences globales `tasks`, `analyze`, `implement` et `converge` doivent
  satisfaire `.specify/integrations/hermes-skill-contract.md` avant usage.
- Chaque fonctionnalité est un delta prospectif. L'état existant reste décrit par
  les autorités de la section 2.
