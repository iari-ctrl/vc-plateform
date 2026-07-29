# Spécification de fonctionnalité : [NOM DE LA FONCTIONNALITÉ]

**Dossier de fonctionnalité** : `specs/[###-nom-fonctionnalite]`  
**Branche Git** : aucune par défaut  
**Créée le** : [DATE]  
**Statut** : Brouillon  
**Entrée** : "$ARGUMENTS"

<!--
Avant de remplir ce document :
1. Lire AGENTS.md, CLAUDE.md, .specify/memory/constitution.md et
   .specify/memory/project-context.md.
2. Relire Suivis/ETAT.md et les références maintenues propres au chantier.
3. Vérifier le comportement actuel dans le dépôt sans recopier les détails
   d'implémentation dans cette spécification.
4. Décrire le QUOI et le POURQUOI. Le COMMENT appartient à plan.md.
-->

## Contexte brownfield et périmètre *(obligatoire)*

### Comportement existant

[Décrire le comportement observable qui sert de point de départ, les acteurs
concernés et la limite actuellement constatée. Distinguer un fait vérifié d'une
hypothèse ou d'une intention documentaire.]

### Autorités consultées

- [Document maintenu ou surface produit pertinente]
- [État vérifié ou règle métier pertinente]

### Périmètre

**Inclus** :

- [Résultat ou capacité inclus]

**Exclus** :

- [Non-objectif explicite]

**Dépendances et reports** :

- [Dépendance, décision externe ou travail reporté]

### Compatibilité attendue

[Préciser les URLs, identifiants, contenus publiés, données locales ou usages
existants qui doivent rester compatibles. Supprimer cette sous-section seulement
si aucune compatibilité n'est concernée.]

## Scénarios utilisateur et tests *(obligatoire)*

<!--
Classer les parcours par priorité. Chaque scénario doit former un incrément
indépendamment vérifiable et produire une valeur observable, sans imposer une
solution technique.
-->

### Scénario utilisateur 1 — [Titre bref] (Priorité : P1)

[Décrire le parcours en langage métier.]

**Justification de la priorité** : [Valeur et raison de la priorité.]

**Test indépendant** : [Action observable qui suffit à valider ce scénario.]

**Scénarios d'acceptation** :

1. **Étant donné** [état initial], **quand** [action], **alors** [résultat].
2. **Étant donné** [état initial], **quand** [action], **alors** [résultat].

---

### Scénario utilisateur 2 — [Titre bref] (Priorité : P2)

[Décrire le parcours en langage métier.]

**Justification de la priorité** : [Valeur et raison de la priorité.]

**Test indépendant** : [Action observable qui suffit à valider ce scénario.]

**Scénarios d'acceptation** :

1. **Étant donné** [état initial], **quand** [action], **alors** [résultat].

---

[Ajouter uniquement les scénarios nécessaires.]

### Cas limites

- [Condition de bord et résultat attendu]
- [Échec, indisponibilité ou donnée invalide et résultat attendu]
- [Interaction avec un état local ou un contenu historique, si pertinent]

## Exigences *(obligatoire)*

### Exigences fonctionnelles

- **FR-001** : Le produit DOIT [capacité testable].
- **FR-002** : L'utilisateur DOIT pouvoir [action testable].
- **FR-003** : Le produit NE DOIT PAS [comportement proscrit].

### Exigences transverses

[Inclure seulement les contraintes pertinentes et les rendre vérifiables :
accessibilité, intégrité éditoriale, données publiques, compatibilité locale,
publication, performance perçue ou résilience. Ne pas recopier toute la
constitution.]

- **TR-001** : [Contrainte transverse testable]

### Entités clés *(si la fonctionnalité manipule des données)*

- **[Entité]** : [Rôle métier, attributs conceptuels et relations, sans choix de
  stockage ni structure de code.]

## Critères de succès *(obligatoire)*

### Résultats mesurables

- **SC-001** : [Résultat utilisateur mesurable et indépendant de la technologie.]
- **SC-002** : [Critère de complétion, de qualité ou de temps vérifiable.]
- **SC-003** : [Absence de régression observable sur le périmètre conservé.]

## Hypothèses

- [Hypothèse raisonnable retenue pour éviter une clarification mineure]

## Traçabilité et décisions

| Élément | Référence ou décision |
| --- | --- |
| Besoin ou priorité | [Source maintenue, retour qualifié ou demande utilisateur] |
| Comportement de départ | [Preuve observable ou document d'état] |
| Décision produit à promouvoir après livraison | [Aucune ou document propriétaire] |
