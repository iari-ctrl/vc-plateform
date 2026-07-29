<!--
Sync Impact Report
- Version : modèle non ratifié → 1.0.0
- Principes ajoutés :
  - I. Autorités explicites et changement brownfield borné
  - II. Continuité du produit et de l'architecture
  - III. Sources canoniques, intégrité éditoriale et données publiques
  - IV. Compatibilité des données locales, routes et identifiants
  - V. Preuve RED–GREEN et vérification proportionnée
  - VI. Accessibilité et cohérence de l'expérience
  - VII. Périmètre local-first et effets de bord contrôlés
- Sections ajoutées : Contraintes du produit et des données ; Processus de
  spécification et contrôle qualité ; Gouvernance
- Modèles synchronisés :
  - ✅ .specify/templates/overrides/spec-template.md
  - ✅ .specify/templates/overrides/plan-template.md
  - ✅ .specify/templates/overrides/tasks-template.md
  - ✅ .specify/templates/checklist-template.md
  - ✅ .specify/workflows/speckit/workflow.yml (arrêt avant implémentation)
  - ✅ .specify/workflows/workflow-registry.json
- Documents de reprise ajoutés :
  - ✅ .specify/memory/project-context.md
  - ✅ .specify/integrations/hermes-skill-contract.md
  - ✅ docs/SPECKIT.md
  - ✅ specs/README.md
- Suivi différé : aucun
-->

# Constitution Spec Kit de vc-platform

## Principes fondamentaux

### I. Autorités explicites et changement brownfield borné

Toute fonctionnalité DOIT partir du comportement existant et des autorités
maintenues recensées dans `.specify/memory/project-context.md`. La spécification
DOIT distinguer l'état observé, le changement proposé, les non-objectifs, les
dépendances et les reports. Elle DOIT identifier les documents, collections et
fichiers propriétaires des faits concernés. Une divergence entre code, données
et documentation DOIT être signalée ; elle ne peut pas être résolue par une
réécriture implicite. Les changements locaux préexistants et hors périmètre
DOIVENT être préservés.

Ce principe empêche qu'une spécification prospective devienne une seconde source
de vérité ou absorbe accidentellement des travaux en cours.

### II. Continuité du produit et de l'architecture

Le produit DOIT rester une plateforme française statique d'intelligence VC,
enrichie par une formation et un workspace local, tant qu'une décision produit
explicite ne modifie pas ce contrat. Intelligence VC, Formation et Workspace
DOIVENT rester lisibles. Path et Parcours désignent la même trajectoire ordonnée
par objectif ; la Bibliothèque reste l'inventaire filtrable des ressources et ne
porte aucun rayon distinct. Aucun verrou artificiel ne doit forcer la progression.

Une fonctionnalité ne peut introduire implicitement backend applicatif, base de
données distante, authentification, préfixes de langue, traduction anglaise,
nouvelle grande surface produit ou remise en ligne. Un tel changement exige une
spécification distincte, une décision produit et l'amendement des autorités
concernées.

### III. Sources canoniques, intégrité éditoriale et données publiques

Chaque fait ou contenu structuré DOIT être modifié dans sa source propriétaire.
Les fichiers sous `data/generated/` sont strictement dérivés et NE DOIVENT JAMAIS
être édités à la main. Toute modification de source DOIT exécuter la génération
et les validateurs applicables avant clôture.

La prose destinée au produit DOIT rester correcte, sobre, factuelle et
institutionnelle. Les affirmations factuelles DOIVENT être soutenues par des
sources fiables au niveau requis ; faits, hypothèses et interprétations DOIVENT
être distingués. Aucune source, donnée, citation, licence, auteur ou validation
métier ne peut être inventé. Toute donnée livrée au navigateur est publique :
secrets, jetons, données personnelles confidentielles et informations de deal
non publiques sont interdits. La publication reste fermée par défaut lorsque la
collection possède un statut.

### IV. Compatibilité des données locales, routes et identifiants

Les données utilisateur sous contrats `vcpx:` DOIVENT rester versionnées,
validées et migrées de manière non destructive. Une évolution incompatible DOIT
prévoir sa migration, sa stratégie d'échec et la préservation des données valides
existantes. `localStorage` ne doit jamais être présenté comme confidentiel ni
comme synchronisé entre appareils.

Les URLs, slugs, identifiants, références croisées, routes publiques et noindex,
base URL, origine canonique, sitemap et prérendu DOIVENT respecter leurs contrats
partagés. Toute rupture volontaire DOIT être explicitée dans la spécification,
couverte par un plan de migration ou de redirection et vérifiée sur les
consommateurs matériels.

### V. Preuve RED–GREEN et vérification proportionnée

Toute modification de comportement ou de schéma DOIT commencer par une preuve
RED reproductible obtenue sur un état initial valide, puis appliquer le plus
petit changement GREEN et une non-régression ciblée. Le premier échec complet
DOIT être conservé et classé avant correction. Les changements documentaires et
éditoriaux DOIVENT utiliser les contrôles ciblés prescrits par `CLAUDE.md` ; ils
ne justifient pas automatiquement un build applicatif.

Les gates larges ne sont exécutés que lorsqu'ils sont proportionnés au changement
et sur un état gelé. Une fonctionnalité qui touche compilation, routes,
bundling, artefacts publics ou préparation de publication DOIT exécuter le build
strict applicable. Aucun test, build, prérendu, contrôle navigateur ou audit ne
peut être déclaré réussi sans sortie réelle.

### VI. Accessibilité et cohérence de l'expérience

Toute surface interactive DOIT viser WCAG 2.2 niveau AA, utiliser une structure
sémantique, rester opérable au clavier, exposer un focus visible et respecter
`prefers-reduced-motion`. Les tokens et primitives existants DOIVENT être
réutilisés avant d'introduire un nouveau langage visuel. Une modification de
layout, d'interaction ou de rendu DOIT être contrôlée dans un navigateur de
confiance aux dimensions desktop 1440 × 1000 et mobile 390 × 844 lorsque les deux
formats peuvent être affectés.

L'accessibilité, la lisibilité éditoriale et la cohérence des trois piliers sont
des critères d'acceptation, pas une phase de finition facultative.

### VII. Périmètre local-first et effets de bord contrôlés

Chaque plan DOIT nommer ses fichiers possédés, dépendances, critères
d'acceptation et reports avant le premier patch. Les anomalies hors périmètre
DOIVENT être signalées plutôt que corrigées implicitement. Les tâches parallèles
ne peuvent partager ni fichier, ni état mutable, ni invariant ; un seul auteur
agit sur un invariant commun à la fois.

Le travail reste local. Aucune commande Spec Kit, tâche ou implémentation ne peut
créer un commit, pousser, réécrire l'historique, lancer un workflow distant ou
déployer sans demande explicite de l'utilisateur. Une branche Git n'est pas un
prérequis du cycle Spec Kit dans ce dépôt.

La vérification générique d'installation de `/speckit-implement` est en lecture
seule par défaut. Elle NE DOIT créer ou modifier aucun fichier d'exclusion, de
configuration ou de package qui n'est pas nommé comme fichier possédé dans la
spécification, le plan et les tâches, avec autorisation explicite de ce périmètre.
Un écart découvert hors périmètre est signalé et différé ; il n'est pas corrigé
comme effet de bord de l'implémentation.

## Contraintes du produit et des données

- `AGENTS.md` et `CLAUDE.md` constituent le contrat opérationnel commun des
  agents ; la présente constitution l'applique au cycle Spec Kit sans le
  remplacer.
- `PRODUCT.md` porte les principes produit stables ;
  `docs/STRATEGIE-vc-intelligence.md` porte la direction ; `Suivis/ETAT.md`
  porte l'état vérifié et les priorités du moment.
- Le code et les données exécutables font foi sur le comportement courant. Les
  références maintenues font foi sur l'intention. Tout écart doit être qualifié.
- Les compteurs de corpus ne doivent pas être copiés dans les spécifications,
  plans, modèles ou documents stratégiques. Ils se relisent dans
  `Suivis/ETAT.md` à la date du chantier.
- Les archives et audits datés sont du contexte historique, jamais une
  spécification active.
- Le dépôt utilise Node.js 20 ou supérieur, npm workspaces, ESM, React, Vite et
  TypeScript. Une dépendance nouvelle doit être vérifiée dans les manifests,
  justifiée par le besoin et comparée à l'usage des fichiers voisins.
- Les imports des chemins critiques doivent cibler la collection précise et ne
  pas réintroduire un barrel qui charge des données sans rapport.
- La remise en ligne et les en-têtes de sécurité de l'hébergement restent hors
  périmètre tant qu'un chantier explicite ne les ouvre pas.

## Processus de spécification et contrôle qualité

1. **Reprise** — lire les instructions, la constitution, le contexte brownfield,
   l'état vérifié et les autorités du chantier ; exécuter `git status --short`.
2. **Spécification** — décrire le besoin et la valeur sans choix prématuré de
   technologie ; borner inclusions, exclusions, compatibilités et critères de
   succès.
3. **Clarification** — ne demander que les décisions qui changent matériellement
   la portée, la sécurité, l'intégrité ou l'expérience.
4. **Plan** — inspecter les définitions et consommateurs réels ; renseigner le
   contrôle constitutionnel avant et après conception ; justifier toute
   complexité.
5. **Tâches et checklists** — ordonner les preuves avant l'implémentation, nommer
   les chemins exacts et rendre chaque scénario indépendamment vérifiable. Toute
   case de checklist non résolue bloque l'analyse et l'implémentation : corriger
   d'abord les artefacts concernés, sans utiliser le contournement générique.
6. **Analyse** — contrôler la cohérence entre exigences, plan, contrats, tâches
   et constitution avant d'écrire le produit.
7. **Implémentation** — respecter RED–GREEN–REFACTOR, vérifier chaque écriture et
   préserver le travail sans rapport.
8. **Convergence et clôture** — seulement après achèvement de toutes les tâches,
   comparer les artefacts au résultat, rejouer les preuves affectées sur l'état
   final, puis promouvoir les décisions durables vers leurs autorités.

`Suivis/ETAT.md` n'est modifié que si une livraison change l'état vérifié, les
risques ou les priorités. `Suivis/JOURNAL.md` reçoit une entrée uniquement pour
une livraison matérielle et durable. Le guide humain du cycle se trouve dans
`docs/SPECKIT.md`.

Avant `tasks`, `analyze`, `implement` ou `converge`, les compétences Hermes actives DOIVENT
respecter `.specify/integrations/hermes-skill-contract.md`. Une mise à niveau qui
supprime l'une de ces clauses suspend les commandes concernées jusqu'à leur
réconciliation ; les seuls documents du dépôt ne valent pas preuve que le
contrat exécutable reste aligné.

## Gouvernance

Cette constitution régit les artefacts sous `.specify/` et `specs/`. Elle ne
peut pas contredire silencieusement `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md` ou une
référence maintenue. En cas de conflit, le travail s'arrête au point concerné :
l'écart est documenté, l'autorité propriétaire est identifiée et la décision est
obtenue avant implémentation.

Tout amendement doit :

1. exposer le besoin, les principes ou sections touchés et les artefacts à
   migrer ;
2. mettre à jour les modèles et guides dépendants dans la même livraison ;
3. appliquer une version sémantique : MAJOR pour une rupture de gouvernance,
   MINOR pour un principe ou une obligation ajoutés, PATCH pour une clarification
   sans changement de règle ;
4. renseigner la date d'amendement et le Sync Impact Report ;
5. vérifier qu'aucun jeton de modèle inexpliqué ne subsiste.

Chaque spécification, plan, liste de tâches, analyse et revue DOIT démontrer sa
conformité aux principes applicables. Une dérogation ne peut être implicite :
elle doit être bornée, motivée, comparée à une option plus simple et approuvée
comme décision produit.

**Version** : 1.0.0 | **Ratifiée** : 2026-07-24 | **Dernier amendement** : 2026-07-24
