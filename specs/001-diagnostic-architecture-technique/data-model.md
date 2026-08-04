# Modèle de données du diagnostic

Ce document modélise les objets du rapport d’architecture. Il ne décrit ni un nouveau schéma applicatif ni une migration du produit.

## 1. Finding

Constat unitaire, stable et traçable.

| Champ | Type | Règle |
|---|---|---|
| `id` | chaîne | Préfixe de catégorie + numéro stable (`ARCH-001`, `DATA-001`, etc.). |
| `category` | enum | `architecture`, `flow`, `frontend`, `backend`, `data`, `api`, `auth`, `folders`, `debt`, `duplication`, `coupling`, `obsolete`, `convention`, `maintenance`, `governance`. |
| `severity` | enum | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`. |
| `status` | enum | `confirmed`, `partial`, `excluded`, `not-observed`. |
| `fact` | texte | Observation factuelle, sans causalité ni solution implicite. |
| `evidence` | liste | Au moins un `path:line-range` ou une commande et son résultat. |
| `interpretation` | texte optionnel | Conséquence ou hypothèse explicitement séparée du fait. |
| `affectedInvariant` | référence optionnelle | Principe constitutionnel ou autorité maintenue concernée. |
| `confidence` | enum | `high`, `medium`, `low`; `low` ne peut pas soutenir seul une priorité P0/P1. |

### Invariants

- Un `Finding` confirmé possède au moins une preuve reproductible.
- Une absence (`backend`, `API`, `auth`) doit être formulée comme « non observé dans le périmètre inspecté », puis corroborée par les manifests, points d’entrée et recherches de consommateurs.
- Une modification préexistante du worktree reste identifiable comme telle.
- Un constat constitutionnel ne peut pas être rétrogradé par une recommandation.

## 2. Flow

Chaîne principale de circulation ou de transformation.

| Champ | Type | Règle |
|---|---|---|
| `id` | chaîne | Identifiant stable (`FLOW-BOOT`, `FLOW-CONTENT`, etc.). |
| `name` | chaîne | Nom fonctionnel, pas nom de fichier seul. |
| `stages` | liste ordonnée | Chaque étape indique propriétaire, entrée, transformation et sortie. |
| `sourceOfTruth` | chemin/référence | Propriétaire canonique du fait ou de la donnée. |
| `derivedOutputs` | liste | Sorties générées, bundles, états mémoire ou stockage navigateur. |
| `failureModes` | liste | Échecs observables ou obligations de rollback/reprise. |
| `publicBoundary` | texte | Ce qui est livré au navigateur et donc public. |

### Flux obligatoires

- `FLOW-BOOT` : document → bootstrap React → providers → route → page lazy.
- `FLOW-CONTENT` : JSON canonique → validation → dérivation éventuelle → module de collection → rendu.
- `FLOW-ROUTES` : registres → collecteur → sitemap/prérendu → router/SEO.
- `FLOW-SEARCH` : indexes de collection → recherche locale/palette → navigation.
- `FLOW-LOCAL-DATA` : contrat `vcpx:` → lecture/migration → état mémoire → écriture.
- `FLOW-LIFECYCLE` : export → aperçu → import atomique/rollback → invalidation ; purge → invalidation.

## 3. Recommendation

Action proposée, jamais appliquée par ce diagnostic.

| Champ | Type | Règle |
|---|---|---|
| `id` | chaîne | `REC-###`. |
| `priority` | enum | `P0` blocage immédiat, `P1` prochain lot, `P2` consolidation planifiée, `P3` opportunité. |
| `findingIds` | liste | Au moins un constat source. |
| `action` | texte | Résultat attendu, sans sur-prescrire l’implémentation. |
| `scope` | liste | Fichiers, couches et autorités concernées. |
| `riskIfDeferred` | texte | Conséquence concrète et proportionnée. |
| `verification` | liste | Preuves attendues après correction. |
| `specRequired` | booléen | Vrai dès qu’un comportement, contrat, schéma, route, donnée ou autorité durable change. |
| `candidateOwner` | chemin optionnel | Source de vérité à mettre à jour après livraison vérifiée. |

## 4. GovernanceCandidate

Règle éventuellement destinée à une future Constitution.

| Champ | Type | Règle |
|---|---|---|
| `id` | chaîne | `GOV-###`. |
| `rule` | texte normatif | Formulation candidate en `MUST` ou `SHOULD`. |
| `rationale` | texte | Risque transversal couvert. |
| `evidenceFindingIds` | liste | Constats qui justifient la règle. |
| `scope` | enum | `constitution`, `repository-convention`, `feature-only`. |
| `decision` | enum | `candidate`, `already-covered`, `reject-as-too-specific`. |

Une règle trop liée à un module ou à une technologie reste une convention de dépôt ; elle n’est pas élevée artificiellement au rang constitutionnel.

## 5. SpecGate

Évolution qui ne doit pas être engagée sans un lot `/speckit-specify` distinct.

| Champ | Type | Règle |
|---|---|---|
| `id` | chaîne | `SPEC-GATE-###`. |
| `change` | texte | Décision ou évolution envisagée. |
| `trigger` | texte | Condition qui rend le lot nécessaire. |
| `compatibility` | liste | URL, données locales, identifiants, contenu public, accessibilité, confidentialité. |
| `dependencies` | liste | Autorités et décisions préalables. |
| `outOfScopeNow` | booléen | Toujours vrai dans ce diagnostic. |

## 6. CoverageEntry

Registre de couverture des axes et obligations.

| Champ | Type | Règle |
|---|---|---|
| `key` | chaîne | FR, SC, axe demandé ou obligation de support. |
| `status` | enum | `covered`, `sampled`, `excluded`, `blocked`. |
| `findingIds` | liste | Constats associés, si applicables. |
| `taskIds` | liste | Tâches de diagnostic associées. |
| `notes` | texte | Limite ou disposition non buildable. |

## 7. Relations

```text
Flow 1 ── n Finding
Finding n ── n Recommendation
Finding n ── n GovernanceCandidate
Recommendation 0..1 ── 1 SpecGate
CoverageEntry n ── n Finding
CoverageEntry n ── n Task
```

## 8. Cycle de vie

```text
inventorié → corroboré → classé → relié → recommandé → soumis à décision
```

Aucun état « corrigé » n’existe dans ce lot. La correction et sa vérification appartiennent à une future fonctionnalité, après approbation explicite.
