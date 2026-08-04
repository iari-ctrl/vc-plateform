# Plan d’implémentation : Diagnostic d’architecture décisionnel

**Feature** : `001-diagnostic-architecture-technique`  
**Spécification** : [spec.md](./spec.md)  
**Date** : 2026-08-03

## Résumé

Le lot produit un diagnostic ponctuel, vérifiable et non normatif de l’architecture locale de `vc-platform`. Il décrit l’état observable, les flux principaux, les frontières frontend/backend/API/authentification, le modèle de données, la persistance locale, l’organisation du dépôt et les risques de maintenance. Il sépare systématiquement faits, interprétations et recommandations, puis classe les règles candidates pour une future Constitution et les évolutions qui exigent une spécification distincte.

Le lot ne modifie aucun comportement applicatif, aucune donnée canonique, aucun document d’autorité, aucun suivi opérationnel et aucun artefact généré. Son résultat sert de dossier de décision ; il ne devient pas une nouvelle source de vérité sur l’état courant.

## Contexte technique

**Langages et formats** : TypeScript/TSX, JavaScript ESM, JSON, Markdown, YAML.  
**Frontend** : React 19, React Router 7, Vite 6, Tailwind CSS 3.  
**Runtime applicatif** : navigateur ; SPA statique prérendue lors du pipeline de build.  
**Backend applicatif** : aucun dans l’état observé ; les serveurs présents relèvent de l’outillage local de build/prérendu.  
**Données éditoriales** : JSON sous `data/`, avec sorties déterministes sous `data/generated/`.  
**Données utilisateur** : `localStorage`, contrats `vcpx:` versionnés et validés côté client.  
**Interfaces réseau applicatives** : chargement des assets et chunks statiques ; aucune API métier distante observée.  
**Validation existante** : ESLint, TypeScript, Vitest/jsdom, tests Node, validateurs Zod, contrôle de fraîcheur des dérivés, contrats de routes et prérendu.  
**Cible de l’analyse** : dépôt local courant, y compris les modifications préexistantes, sans les absorber ni les corriger.  
**Contraintes** : lecture seule du code et des autorités ; aucune commande susceptible de régénérer, construire, tester avec cache, démarrer un serveur, modifier Git ou contacter le réseau. Seuls les artefacts Spec Kit propres à ce lot sont écrits pendant les phases `specify → plan → tasks`.

## Contrôle de Constitution

### Gate initial

| Principe | Statut | Justification |
|---|---|---|
| I. Autorités explicites et changement brownfield borné | PASS | `spec.md` définit un diagnostic ponctuel, ses autorités consultées, ses non-objectifs, ses reports et ses fichiers possédés ; toute correction applicative identifiée est renvoyée vers une spécification distincte. |
| II. Continuité du produit et de l'architecture | PASS | Le lot ne crée ni backend, ni API, ni authentification, ni grande surface produit ; il vérifie ces frontières comme faits observables et signale tout changement futur comme `SpecGate`. |
| III. Sources canoniques, intégrité éditoriale et données publiques | PASS / N/A | Aucune source éditoriale ni donnée générée n’est modifiée. Les contrôles `check-generated` et `validate-content --strict` sont exécutés sans écriture et les secrets ne sont pas exposés. |
| IV. Compatibilité des données locales, routes et identifiants | PASS | Le diagnostic ne change aucun contrat `vcpx:`, URL, slug, identifiant ou route ; les risques de cycle de vie local et de routage sont seulement classés en recommandations. |
| V. Preuve RED–GREEN et vérification proportionnée | PASS | Le lot ne modifie aucun comportement ; il vérifie sa traçabilité par des commandes de lecture seule proportionnées (`check-generated`, validation stricte, collecteur de routes, lint, contrôles de couverture). |
| VI. Accessibilité et cohérence de l'expérience | PASS / N/A | Aucun rendu n’est modifié. Les recommandations futures sur le frontend restent soumises aux contrats WCAG 2.2 AA et aux preuves DOM adaptées. |
| VII. Périmètre local-first et effets de bord contrôlés | PASS | Les fichiers possédés sont limités à `specs/001-diagnostic-architecture-technique/**` et `.specify/feature.json`; aucune branche, commit, push, workflow distant ou déploiement n’est autorisé. |

### Gate après conception

Le modèle de diagnostic et le contrat de rapport maintiennent les mêmes bornes : aucun état applicatif, URL, identifiant public, schéma de contenu ou contrat de stockage n’est changé. Les écarts nécessitant une correction deviennent des `SpecGate` et ne sont pas exécutés dans ce lot.

## Structure du projet

### Artefacts de cette fonctionnalité

```text
specs/001-diagnostic-architecture-technique/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── diagnostic-report.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Structure applicative observée

```text
vc-platform/
├── client/                 # SPA React, pages, composants, contextes et stockage navigateur
├── data/                   # sources éditoriales JSON et dérivés générés
├── shared/                 # contrats ESM purs partagés navigateur/Node
├── scripts/                # validation, génération, sitemap et prérendu
├── docs/                   # autorités produit, architecture et conception
├── Suivis/                 # état vérifié et journal de livraison
├── .specify/               # Constitution, contexte brownfield, scripts et modèles Spec Kit
└── specs/                  # changements prospectifs bornés
```

**Décision de structure** : aucune nouvelle couche applicative. Tous les livrables du diagnostic restent sous le dossier de fonctionnalité. Les autorités maintenues ne seront proposées à la modification qu’après décision explicite et dans un lot ultérieur.

## Phase 0 — Recherche et réduction des inconnues

1. Établir un inventaire déterministe des modules, dépendances locales, points d’entrée, routes, collections et contrats de stockage.
2. Tracer les flux principaux : bootstrap, navigation, contenu canonique, dérivés, recherche, sitemap/prérendu, persistance locale, export/import/purge.
3. Vérifier les frontières négatives : absence de backend applicatif, base distante, API métier et authentification ; distinguer cette absence d’un oubli.
4. Relever les écarts entre code, documents d’autorité et état vérifié, sans utiliser l’historique comme preuve du comportement courant.
5. Exécuter uniquement les contrôles sans écriture inspectés et consigner leurs résultats.
6. Classer les constats par preuve, portée, sévérité, risque futur et besoin éventuel de spécification.

**Sortie** : [research.md](./research.md).

## Phase 1 — Modèle, contrat et validation du diagnostic

1. Formaliser les entités `Finding`, `Flow`, `Recommendation`, `GovernanceCandidate`, `SpecGate` et `CoverageEntry`.
2. Définir le contrat Markdown du rapport : séparation faits/interprétations/recommandations, preuves `path:line`, niveaux de sévérité, priorités et métriques.
3. Définir un quickstart reproductible qui n’écrit ni source, ni cache, ni sortie générée.
4. Vérifier que chaque axe demandé possède un statut et que chaque recommandation remonte vers au moins un constat.

**Sorties** : [data-model.md](./data-model.md), [contracts/diagnostic-report.md](./contracts/diagnostic-report.md), [quickstart.md](./quickstart.md).

## Phase 2 — Tâches et analyse de cohérence

1. Générer `tasks.md` à partir de la spécification, du plan et des obligations de support.
2. Exécuter `/speckit-analyze` en lecture seule sur tous les artefacts.
3. Signaler tout conflit constitutionnel, manque de couverture ou décision non traçable avant toute implémentation.
4. Restituer les recommandations, candidats de Constitution et lots nécessitant `/speckit-specify`.

## Stratégie de validation

- Contrôle du sélecteur et des chemins avec `check-prerequisites.sh --json --paths-only`.
- Validation stricte des données sans régénération.
- Contrôle de fraîcheur des dérivés sans écriture.
- Lint sans cache explicite.
- Analyse statique en mémoire du graphe d’imports.
- Comparaison du statut Git avant/après pour détecter toute écriture hors périmètre.
- Relecture mécanique de la couverture FR/SC/obligations avant `/speckit-analyze`.

Les commandes de build, dev, split/génération, tests susceptibles de créer un cache, preview, commit, push et déploiement restent exclues de ce lot.

## Gestion de complexité

| Écart justifié | Pourquoi nécessaire | Alternative rejetée |
|---|---|---|
| Diagnostic transversal couvrant plusieurs couches | Le besoin porte sur les frontières et couplages entre code, données, scripts et autorités ; une lecture limitée à un sous-dossier masquerait les incohérences de contrat. | Transformer immédiatement chaque constat en correction : rejeté, car cela violerait le caractère non destructif et mélangerait des évolutions indépendantes. |
| Artefact Spec Kit de diagnostic non normatif | Il fournit la traçabilité nécessaire pour décider des futurs lots sans devenir une photographie maintenue de l’état. | Copier le diagnostic dans `Suivis/ETAT.md` : rejeté, car ce suivi doit rester court et ne recevoir que des livraisons matérielles vérifiées. |

## Fichiers possédés et exclusions

**Possédés par ce lot** : uniquement `specs/001-diagnostic-architecture-technique/**` et le sélecteur local `.specify/feature.json` créé par le workflow.  
**Préexistants et protégés** : toutes les modifications déjà présentes dans `Suivis/` et `client/src/`, notamment les travaux en cours sur le chrome, le wordmark et `/home`.  
**Exclus** : application, données, scripts, configuration, documentation d’autorité, suivis, Git, réseau et déploiement.
