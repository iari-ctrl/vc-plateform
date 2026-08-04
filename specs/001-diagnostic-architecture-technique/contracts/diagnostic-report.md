# Contrat de rapport — Diagnostic d’architecture

## 1. Objet

Le rapport est une interface de décision en Markdown. Il doit être compréhensible sans lire les artefacts bruts, tout en permettant de reproduire chaque constat. Il ne modifie aucun fichier et ne devient pas une source d’état maintenue.

## 2. Sections obligatoires

1. **Périmètre, date et état du worktree**
2. **Méthode et limites**
3. **Architecture globale observée**
4. **Flux principaux et flux de données**
5. **Frontend**
6. **Backend, API et authentification**
7. **Modèle de données et persistance locale**
8. **Organisation des dossiers et dépendances**
9. **Dette, duplication, couplage, obsolescence et conventions**
10. **Incohérences et risques futurs**
11. **Tableau des constats**
12. **Recommandations priorisées**
13. **Candidats pour une future Constitution**
14. **Évolutions nécessitant `/speckit-specify`**
15. **Métriques, couverture et limites résiduelles**

## 3. Séparation sémantique obligatoire

Pour chaque axe ou constat, le rapport distingue explicitement :

- **Fait observé** : ce que le code, les données, un document d’autorité ou une commande établit ;
- **Interprétation** : conséquence, risque ou hypothèse issue de ces faits ;
- **Recommandation** : action proposée, non exécutée.

Une recommandation ne peut pas être présentée comme un fait. Une intention documentaire ne peut pas être présentée comme comportement implémenté sans vérification du code.

## 4. Preuves

- Une preuve de fichier utilise `chemin:ligne` ou `chemin:lignes-début-fin`.
- Une preuve de commande nomme la commande, le code de sortie et le résultat utile.
- L’historique de `Suivis/JOURNAL.md` explique une décision passée mais ne prouve pas le comportement courant.
- Une absence de backend, API ou authentification est corroborée par plusieurs contrôles négatifs ; elle n’est jamais déduite d’un seul fichier manquant.
- Les fichiers modifiés avant le diagnostic sont signalés lorsque le constat les concerne.

## 5. Tableau principal

| Champ | Obligatoire | Contenu |
|---|---|---|
| `ID` | oui | Identifiant stable du constat. |
| `Catégorie` | oui | Catégorie du modèle `Finding`. |
| `Sévérité` | oui | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`. |
| `Fait observé` | oui | Formulation factuelle courte. |
| `Preuve` | oui | Une ou plusieurs localisations. |
| `Interprétation` | oui sauf absence de conséquence | Risque ou effet. |
| `Recommandation` | oui | Action proposée ou disposition explicite « conserver ». |
| `Spec requise` | oui | `oui`, `non`, ou `décision constitutionnelle distincte`. |

Le tableau est limité à 50 lignes. Les constats supplémentaires sont agrégés par cause racine.

## 6. Sévérité et priorité

La **sévérité** qualifie le constat :

- `CRITICAL` : violation d’un MUST constitutionnel, artefact cœur manquant ou fonctionnalité de base sans couverture ;
- `HIGH` : contradiction, risque de perte de données, frontière de sécurité ambiguë ou critère non testable ;
- `MEDIUM` : couplage, dérive documentaire, dette non bloquante ou obligation non couverte ;
- `LOW` : hygiène, redondance mineure ou amélioration locale.

La **priorité** qualifie l’action :

- `P0` : bloquer l’évolution concernée jusqu’à décision/correction ;
- `P1` : prochain lot borné ;
- `P2` : consolidation planifiée ;
- `P3` : opportunité sans urgence.

Sévérité et priorité ne sont pas interchangeables.

## 7. Candidats de Constitution

Chaque candidat indique : formulation normative, risque transversal, preuves, portée et statut (`candidate`, `already-covered`, `too-specific`). Un correctif propre à un module ne devient pas une règle constitutionnelle.

## 8. Portes de spécification

Le rapport marque `Spec requise: oui` pour toute évolution de :

- backend, base distante, API métier, identité ou authentification ;
- route publique, base de déploiement ou politique d’indexation ;
- schéma éditorial, collection canonique ou pipeline généré ;
- contrat `vcpx:`, version d’export/import ou migration ;
- architecture de navigation, provider ou état global ;
- autorité maintenue ou Constitution ;
- politique de confidentialité, accessibilité ou sécurité.

## 9. Métriques minimales

- exigences FR et SC inventoriées ;
- tâches inventoriées ;
- obligations des artefacts de support ;
- couverture exigences/obligations ;
- constats par sévérité et catégorie ;
- tâches non mappées ;
- contrôles exécutés et contrôles volontairement exclus.

## 10. Clause de non-exécution

Le rapport peut proposer des modifications, mais ne les applique pas. Toute remédiation nécessite une approbation explicite et, lorsqu’un contrat durable change, une fonctionnalité Spec Kit distincte.
