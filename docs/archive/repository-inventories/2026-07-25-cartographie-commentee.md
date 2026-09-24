> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Cartographie commentée de `vc-platform`

Inspection reprise et finalisée en lecture seule. Horodatage de référence : **2026-07-31 19:45:53 CEST**.

## Synthèse de couverture

| Mesure | Valeur |
|---|---:|
| Dossiers hors racine | 2 477 |
| Fichiers hors racine | 18 001 |
| Liens symboliques hors racine | 37 |
| Entrées hors racine | 20 515 |
| Taille logique recensée | 527 591 598 octets |
| Fichiers suivis Git | 456 |
| Fichiers non suivis non ignorés | 2 |
| Fichiers ignorés | 17 220 |

Empreinte SHA-256 de la liste ordonnée des chemins hors racine : `0d98d7dcd4ce19af25339d845132b5b8f22ff970480973d028b894083745a90e`.

## Lecture globale

**Pertinence globale du contenu propre au projet : 84/100.** Le dépôt est techniquement bien structuré et fortement documenté, avec `data/`, `client/`, `shared/` et `scripts/` correctement séparés. La réserve principale porte sur la maturité produit encore partielle, la volumétrie des suivis/plans et la présence importante d’artefacts régénérables ou historiques dans l’arbre physique.

## Barème

- **90–100** : autorité, source canonique, garde indispensable ou composant structurant.
- **75–89** : contenu actuel solide, utile à l’exécution ou à la compréhension.
- **50–74** : utile mais secondaire, prospectif, volumineux ou à rationaliser.
- **25–49** : historique, doublon, artefact technique ou dépendance externe.
- **0–24** : cache, résidu système, objet interne opaque ou sortie entièrement régénérable.

## État Git observé

```text
## master...origin/master
 M Suivis/ETAT.md
 M Suivis/JOURNAL.md
 M client/src/components/chrome/TopBar.tsx
 M client/src/pages/home/homeExperience.dom.test.tsx
?? .hermes/plans/2026-07-31_191055-consolidation-formation.md
?? docs/reviews/2026-07-31-cours-sans-lecon-publiee.md
```

Les changements ci-dessus étaient déjà présents ; la reprise n’a pas modifié le dépôt.

---

# Documentation, gouvernance et racine

## Cadre de notation

La note mesure l’**utilité documentaire actuelle pour conduire le produit vers sa cible**, et non le degré d’achèvement du produit :

- **90–100** : autorité maintenue ou garde indispensable ;
- **75–89** : document opérationnel important ;
- **50–74** : utile, mais borné, prospectif ou à rationaliser ;
- **25–49** : historique, doublon ou artefact technique ;
- **0–24** : résidu sans valeur documentaire.

Périmètre couvert : **96 fichiers** à la racine et sous `docs/`, `Suivis/`, `.hermes/`, `.claude/`, `.github/`, `.specify/` et `specs/`.

---

## Racine

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.DS_Store` | Résidu macOS ignoré ; aucune utilité. | 0 |
| `.gitignore` | Hygiène du dépôt ; pertinent, mais conserve des exclusions Prisma/serveur devenues historiques. | 65 |
| `AGENTS.md` | Point d’entrée portable vers les règles communes ; concis et correctement hiérarchisé. | 96 |
| `CLAUDE.md` | Contrat opérationnel central : architecture, édition, tests, sécurité, workflow et sources d’autorité. Solide, mais très dense et partiellement redondant avec les manuels. | 94 |
| `PRODUCT.md` | Contrat produit stable : finalité, principes, anti-références et accessibilité. Référence la plus claire pour juger la cible finale. | 98 |
| `PROMPTS-SERIE-A.md` | Paquet d’exécution issu d’un audit du 26 juillet ; largement repris ou dépassé par les plans Série A ultérieurs. À archiver hors racine. | 30 |
| `README.md` | Présentation, démarrage, architecture et déploiement. Très utile, mais quelques formulations « premium/luxe » et la citation d’ouverture s’écartent du registre institutionnel imposé ailleurs. | 82 |
| `package.json` | Contrat exécutable des commandes et gates ; autorité technique directe. | 92 |
| `package-lock.json` | Verrou de reproductibilité des dépendances ; artefact nécessaire, non documentaire. | 72 |
| `revue-mathematiques-du-vc.md` | Audit et plan très approfondi, mais la réalisation est déclarée close dans le suivi. Le document exige lui-même d’être marqué exécuté, archivé ou supprimé ; il reste à tort à la racine. | 38 |

---

## `docs/`

### Références transverses

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `docs/.DS_Store` | Résidu macOS ignoré. | 0 |
| `docs/ARCHITECTURE_EDITION.md` | Manuel maintenu de l’architecture éditoriale, des collections et du cycle de publication. Autorité majeure, malgré une volumétrie élevée. | 94 |
| `docs/DESIGN_SYSTEM.md` | Référence maintenue des tokens, composants, motion et accessibilité. Utile et structurée ; les « gaps actuels » doivent rester synchronisés avec le code. | 90 |
| `docs/SPECKIT.md` | Guide humain complet du cycle Spec Kit brownfield. Pertinent, mais l’infrastructure n’a encore produit aucune spécification réelle. | 82 |
| `docs/STRATEGIE-vc-intelligence.md` | Direction produit maintenue, courte et sans compteurs. Très bien alignée avec `PRODUCT.md` : Intelligence VC dominante, Formation en soutien, Workspace local. | 97 |

### `docs/archive/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `docs/archive/STRATEGIE-vc-intelligence-2026-07.md` | Version stratégique longue mêlant cible, état et roadmap ; correctement marquée comme archive. Utile pour l’historique, trop risquée comme lecture courante. | 48 |
| `docs/archive/parcours/01-le-vc-sans-bullshit.md` | Brouillon historique du premier parcours ; formulations familières incompatibles avec la charte actuelle. | 30 |
| `docs/archive/parcours/02-reussir-l-entretien-analyst.md` | Brouillon antérieur aux leçons publiées ; conserve quelques pistes, mais ne doit plus guider l’état produit. | 35 |
| `docs/archive/retours-sessions-correction-2026-07-22.md` | Rétrospective technique dont les règles durables ont été transférées dans `CLAUDE.md`. Archive correctement signalée. | 45 |

### `docs/certifications/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md` | Contrat transverse maintenu : titres, niveaux, axes, évaluation et transition du modèle. Essentiel pour éviter les promesses indues. | 93 |
| `docs/certifications/GOUVERNANCE-CERTIFICATIONS.md` | Invariants d’une délivrance humaine future. Correctement marqué inactif ; pertinent comme garde, pas comme procédure actuelle. | 68 |
| `docs/certifications/PROTOCOLE-PRODUCTION-ANALYST.md` | Protocole prospectif pour produire les futures épreuves Analyst. Bien borné, mais non activé. | 72 |
| `docs/certifications/REFERENTIEL-ANALYST.md` | Ancien référentiel fusionnant parcours et certification ; explicitement supplanté. | 35 |
| `docs/certifications/REFERENTIEL-VC-ANALYST.md` | Référentiel professionnel maintenu, clair sur l’absence d’évaluation et de délivrance actives. | 88 |
| `docs/certifications/REFERENTIEL-VENTURE-PHILANTHROPY.md` | Ancien contrat de certification, supplanté par le parcours. | 35 |

### `docs/certifications/venture-philanthropy/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `PLAN.md` | Plan initial de la certification désormais déclassée en parcours ; historique correctement signalé. | 38 |
| `README.md` | Index du dossier historique. Incohérence interne : il désigne encore l’ancien référentiel de certification comme « maintenu » dans ses invariants, alors que celui-ci se déclare supplanté. | 42 |
| `exploration-1-architecture-certifications.md` | Cartographie historique de l’ancien modèle de certification. | 38 |
| `exploration-2-pipeline-edition.md` | Exploration historique du pipeline éditorial ; une partie est désormais dupliquée dans `ARCHITECTURE_EDITION.md` et `CLAUDE.md`. | 42 |
| `exploration-3-inventaire-impact.md` | Inventaire daté du corpus impact ; compteurs et modèle devenus historiques. | 35 |
| `references-verifiees.md` | Corpus de sources encore potentiellement réutilisable ; notes de schéma et d’évaluation obsolètes. | 62 |

### `docs/parcours/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `docs/parcours/README.md` | Contrat transverse, bref, des parcours et de leurs relations. | 90 |
| `docs/parcours/ANALYST-FOUNDATIONS.md` | Référentiel maintenu du parcours, clairement séparé de la certification professionnelle. | 91 |
| `docs/parcours/SERIE-A-PREUVES.md` | Matrice propositionnelle et documentaire du parcours Série A ; garde éditoriale de forte valeur. | 92 |
| `docs/parcours/VENTURE-PHILANTHROPIE.md` | Référentiel maintenu du parcours et de son dossier longitudinal ; remplace proprement l’ancienne certification. | 91 |

### `docs/reviews/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `2026-07-23-relecture-praticien-parcours.md` | Dossier prêt à transmettre ; aucun praticien ne l’a encore validé. Reste directement pertinent puisque ce point est toujours P0 dans `ETAT.md`. | 84 |
| `2026-07-24-evaluation-parcours-lecons-lisible.md` | Version détaillée de l’évaluation des 24 parcours. Forte duplication avec le fichier voisin. | 52 |
| `2026-07-24-evaluation-parcours-lecons.md` | Version plus compacte de la même revue, encore citée par `ETAT.md`. Snapshot utile mais daté. | 58 |
| `2026-07-26-plan-execution-remediation.md` | Programme de remédiation dérivé de la revue. Plusieurs sujets restent pertinents, mais son statut d’exécution n’est pas consolidé dans le document. | 66 |
| `2026-07-31-cours-sans-lecon-publiee.md` | Audit courant, précis et bien borné sur les cours vides. Document non suivi par Git au moment de l’analyse. | 86 |

---

## `Suivis/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `Suivis/ETAT.md` | Autorité de l’état courant, des compteurs, risques et priorités. Indispensable, mais ne respecte plus son propre contrat d’« instantané court » : 71 Ko, nombreuses passes anciennes, résultats de tests historiques et détails déjà présents dans le journal. | 78 |
| `Suivis/JOURNAL.md` | Historique daté des livraisons et preuves. La longueur est cohérente avec son rôle append-only ; bonne traçabilité, mais coûteux à relire intégralement. | 88 |
| `Suivis/PROCEDURE_PUSH.md` | Runbook clair de sauvegarde Git, distinct de la publication. | 92 |
| `Suivis/AUDIT/AUDIT-2026-07-06.md` | Audit historique correctement marqué ; utile pour l’origine des décisions, non pour l’état courant. | 45 |

---

## `.hermes/`

### Résidu

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.hermes/.DS_Store` | Résidu macOS ignoré. | 0 |

### Plans et preuves

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `2026-07-22_134627-correction-amelioration-vc-platform.md` | Plan consolidé C1–C6 désormais clos ; matrice historique utile, mais ne devrait plus apparaître comme plan actif. | 58 |
| `2026-07-22_134627-correction-baseline.json` | Empreinte des 107 changements préexistants ; preuve historique déterministe. | 60 |
| `2026-07-23_100955-relecture-praticien-parcours-p0.md` | Préparation close, mais revue humaine toujours ouverte ; handoff encore opérationnel. | 82 |
| `2026-07-23_224703-quiz-lecons-question-par-question.md` | Plan court déjà exécuté selon `ETAT.md` et `JOURNAL.md`, sans marque de clôture dans le fichier. | 28 |
| `2026-07-23_231441-mini-analyse-stage-vc.md` | Plan du jalon désormais livré ; historique non reclassé. | 32 |
| `2026-07-24_000737-reussir-entretien-analyst.md` | Plan de finalisation déjà réalisé. | 32 |
| `2026-07-24_001520-reussir-entretien-analyst-evidence.md` | Matrice documentaire durable et encore utile pour la traçabilité des sources. | 76 |
| `2026-07-24_005000-reussir-entretien-analyst-handoff-etape-6.md` | Passation intermédiaire dépassée par la clôture du parcours. | 22 |
| `2026-07-24_212102-separer-onboarding-ikigai.md` | Plan exécuté selon le journal ; historique non marqué. | 28 |
| `2026-07-25_175557-p-serie-a.md` | Premier plan Série A, remplacé par la finalisation TDD. | 27 |
| `2026-07-25_220016-p-serie-a-finalisation-baseline.md` | Capture brute utile seulement pour attribuer les changements de cette session. | 30 |
| `2026-07-25_220016-p-serie-a-finalisation.md` | Plan de finalisation désormais déclaré clos ; bonne trace, faible utilité courante. | 42 |
| `2026-07-26_124013-serie-a-prompts-a2-a6-execution.md` | Réévaluation plus fiable des prompts racine ; certains lots peuvent rester des références, mais le statut global est ambigu. | 58 |
| `2026-07-27_115952-deeptech-preuve-scientifique.md` | Plan d’implémentation livré selon le journal ; volumineux historique de session. | 38 |
| `2026-07-27_142409-deeptech-pi-transfert-evidence.md` | Matrice de preuves proposition par proposition ; actif documentaire à préserver indépendamment du plan. | 84 |
| `2026-07-27_142409-deeptech-pi-transfert.md` | Plan d’implémentation exécuté ; historique. | 38 |
| `2026-07-29_025140-accueil-minimal-aiguillage.md` | Plan de refonte d’accueil exécuté. | 28 |
| `2026-07-31_002812-home-topbar-opacity.md` | Plan exécuté le jour même selon `ETAT.md` et `JOURNAL.md`. | 24 |
| `2026-07-31_191055-consolidation-formation.md` | Plan actif le plus structurant pour fiabiliser Formation sans prétendre la terminer. Très aligné avec la cible produit ; non suivi par Git au moment de l’analyse. | 93 |

**Jugement du dossier :** les preuves sont souvent bonnes, mais `.hermes/plans/` sert simultanément de plans actifs, archives, baselines et matrices de preuves. L’absence d’un statut ou d’un sous-dossier d’archives rend les plans exécutés artificiellement concurrents du plan actif.

---

## `.claude/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.claude/hooks/block-generated.mjs` | Garde Claude Code contre l’édition directe des générés. Utile mais volontairement fail-open et non applicable aux autres agents. | 73 |
| `.claude/hooks/validate-content.mjs` | Régénération et validation après édition JSON via Claude Code. Bon filet, mais avec effets d’écriture et couverture limitée explicitement reconnus. | 75 |
| `.claude/launch.json` | Configuration de lancement du client sur le port 5173. Commodité locale. | 45 |
| `.claude/settings.json` | Permissions et branchement des hooks. Certaines commandes autorisées sont anciennes ou contournent le parcours racine complet ; ce fichier ne doit pas être lu comme un gate qualité. | 62 |
| `.claude/settings.local.json` | Permissions locales ignorées globalement par Git ; aucune valeur de gouvernance portable. | 15 |
| `.claude/skills/ecosystemes/SKILL.md` | Playbook éditorial spécialisé, bien relié aux autorités et précis sur les limites du schéma. | 90 |

---

## `.github/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.github/workflows/deploy-pages.yml` | Workflow Pages manuel, actions épinglées, permissions séparées, gate et prérendu strict avant déploiement. Cohérent avec le statut local-first dormant. | 93 |

---

## `.specify/`

### Configuration et mémoire

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.specify/init-options.json` | Trace des options d’initialisation Spec Kit 0.14.2. | 55 |
| `.specify/integration.json` | Configuration active de l’intégration Hermes. | 62 |
| `.specify/memory/.constitution-template.json` | Empreinte technique du modèle d’origine. | 28 |
| `.specify/memory/constitution.md` | Gouvernance brownfield ratifiée : autorités, continuité, données, TDD, accessibilité et effets de bord. Solide, mais recoupe largement `CLAUDE.md`. | 90 |
| `.specify/memory/project-context.md` | Index de reprise et hiérarchie des autorités ; utile pour empêcher Spec Kit de devenir un second tracker. | 88 |

### Intégrations

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.specify/integrations/hermes-skill-contract.md` | Contrat versionné des adaptations requises dans les compétences Hermes externes au dépôt. Important, mais dépend d’un état global non garanti après mise à niveau. | 84 |
| `.specify/integrations/hermes.manifest.json` | Manifeste minimal de l’intégration Hermes, sans fichier embarqué. | 38 |
| `.specify/integrations/speckit.manifest.json` | Empreintes des fichiers Spec Kit installés ; utile pour distinguer cœur et adaptations locales. | 68 |

### Scripts Bash

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.specify/scripts/bash/common.sh` | Résolution du dépôt, sélecteur de fonctionnalité, templates et helpers ; cœur technique volumineux. | 78 |
| `.specify/scripts/bash/check-prerequisites.sh` | Contrôle préalable, avec mode `--paths-only` sans persistance. | 82 |
| `.specify/scripts/bash/create-new-feature.sh` | Création numérotée d’un dossier de spécification et gestion optionnelle des conventions de branche. | 72 |
| `.specify/scripts/bash/select-feature.sh` | Sélection explicite d’une fonctionnalité sans dépendre de Git. | 84 |
| `.specify/scripts/bash/setup-plan.sh` | Création fail-closed du plan après validation de `spec.md`. Adaptation brownfield importante. | 86 |
| `.specify/scripts/bash/setup-tasks.sh` | Résolution du modèle de tâches et inventaire des artefacts disponibles. | 80 |

### Modèles

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.specify/templates/checklist-template.md` | Checklist locale directement consommée par la compétence Hermes ; adaptée au brownfield. | 84 |
| `.specify/templates/constitution-template.md` | Modèle générique amont, désormais sans usage courant puisque la constitution est ratifiée. | 32 |
| `.specify/templates/plan-template.md` | Modèle générique amont ; options web/backend incompatibles avec le produit si utilisé directement. | 42 |
| `.specify/templates/spec-template.md` | Modèle générique amont de spécification. | 48 |
| `.specify/templates/tasks-template.md` | Modèle générique indiquant des tests optionnels ; contraire au contrat local s’il contournait la surcharge. | 40 |
| `.specify/templates/overrides/spec-template.md` | Spécification locale imposant contexte brownfield, autorités, compatibilité et traçabilité. | 89 |
| `.specify/templates/overrides/plan-template.md` | Plan local avec baseline, constitution, stratégie de preuve et contrôle des changements préexistants. | 91 |
| `.specify/templates/overrides/tasks-template.md` | Tâches locales fondées sur reconnaissance, RED/GREEN et handoff de convergence. | 91 |

### Workflow

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `.specify/workflows/speckit/workflow.yml` | Workflow de brouillon volontairement arrêté après `specify → plan → tasks`. Cohérent avec le cycle manuel. | 76 |
| `.specify/workflows/workflow-registry.json` | Registre et version du workflow local. | 58 |

**Jugement du dossier :** l’outillage est sérieux, mais représente une gouvernance importante encore **sans cas réel sous `specs/`**. La coexistence des modèles génériques et des surcharges est légitime pour les mises à niveau, mais devient dangereuse si un consommateur ignore la résolution des overrides.

---

## `specs/`

| Fichier | Rôle et jugement | Note |
|---|---|---:|
| `specs/README.md` | Contrat de classement des futurs deltas Spec Kit. Clair et correctement séparé du backlog et du suivi courant. Aucun dossier de fonctionnalité n’existe encore. | 79 |

---

## Constats transversaux

1. **La hiérarchie documentaire est globalement saine.**  
   `PRODUCT.md` fixe les principes ; `docs/STRATEGIE-vc-intelligence.md` la direction ; `ARCHITECTURE_EDITION.md` et `DESIGN_SYSTEM.md` les contrats spécialisés ; `AGENTS.md` et `CLAUDE.md` les règles d’exécution ; `ETAT.md` et `JOURNAL.md` l’état et l’historique.

2. **La cible produit est cohérente malgré l’état encore partiel.**  
   Le dépôt ne confond pas, dans ses autorités maintenues, corpus incomplet et cible finale : plateforme statique française, Intelligence VC dominante, Formation structurée mais non verrouillante, Workspace local.

3. **`Suivis/ETAT.md` est devenu un second journal.**  
   Son contrat annonce un instantané court, mais le fichier accumule plusieurs passes, des sessions closes et de nombreux résultats de tests historiques. Cette inflation affaiblit la séparation avec `JOURNAL.md`.

4. **Les documents temporaires sont insuffisamment reclassés.**  
   `PROMPTS-SERIE-A.md`, `revue-mathematiques-du-vc.md` et la majorité des plans `.hermes/` correspondent à des travaux déclarés livrés, sans marque de clôture ou déplacement vers une archive.

5. **Un doublon documentaire net existe.**  
   Les deux évaluations du 24 juillet sous `docs/reviews/` couvrent le même audit avec une similarité importante. Une version canonique et une archive suffiraient.

6. **Le dossier historique Venture Philanthropy contient une contradiction résiduelle.**  
   Son `README.md` appelle encore `REFERENTIEL-VENTURE-PHILANTHROPY.md` « maintenu », alors que ce dernier et les documents actuels renvoient vers `docs/parcours/VENTURE-PHILANTHROPIE.md`.

7. **Les certifications futures sont correctement bornées.**  
   Les documents de gouvernance et de production distinguent clairement référentiel, préparation, évaluation locale et délivrance humaine. Le risque principal est la multiplication de documents prospectifs, non une promesse active trompeuse.

8. **Spec Kit est bien cadré, mais encore infrastructurel.**  
   La constitution, les surcharges et les scripts sont élaborés ; `specs/` ne contient toutefois aucune fonctionnalité. Cette gouvernance devra prouver sa valeur sur un premier delta borné.

9. **Deux documents courants ne sont pas suivis par Git.**  
   `.hermes/plans/2026-07-31_191055-consolidation-formation.md` et `docs/reviews/2026-07-31-cours-sans-lecon-publiee.md` sont utiles et actuels, mais leur durabilité n’est pas assurée tant qu’ils restent non suivis.

## Clôture en lecture seule

- Aucun fichier créé, modifié ou supprimé.
- État Git final identique à l’état initial : les six changements préexistants sont restés inchangés.
- Aucun build, validateur ou script susceptible d’écrire n’a été exécuté.


---

# Application client

## Périmètre et méthode

- **299 fichiers propres et suivis dans `client/`**, tous lus ou inspectés :
  - `src/` : **238 fichiers**
  - `public/` : **50 fichiers**, dont **47 médias/binaires**
  - configuration à la racine de `client/` : **11 fichiers**
- Familles explicitement exclues du détail :
  - `dist/` : **929 fichiers, 76,5 Mo** — sortie générée de build/prérendu.
  - `node_modules/.vite/` et `node_modules/.tmp/` : **29 fichiers, 8,1 Mo** — caches Vitest/Vite et métadonnées TypeScript.
- Analyse **statique et visuelle**, sans exécuter les scripts susceptibles d’écrire des caches.
- La note mesure l’**utilité dans l’état actuel** et l’**alignement avec le socle cible documenté**, pas le périmètre fonctionnel futur.

Échelle : **90–100 structurant**, **80–89 solide**, **70–79 utile mais secondaire ou trop dense**, **60–69 provisoire**, **<60 sortie, cache ou portabilité faible**.

---

# 1. Racine de `client/` — **87/100**

Socle Vite/React/TypeScript cohérent, strict et adapté à un site statique. La séparation des configurations de build, test et lint est propre.

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `package.json` | Manifeste du workspace client, dépendances React 19/Vite 6, commandes build, lint et test. | 90 |
| `index.html` | Coquille HTML française, métadonnées sociales, PWA et point de montage React. | 91 |
| `vite.config.ts` | Base URL portable, alias `@`, `@data`, `@shared`, découpage du vendor React. | 92 |
| `vitest.config.ts` | Configuration Vitest isolée avec alias identiques à Vite. | 88 |
| `tailwind.config.ts` | Traduction des tokens CSS en thème Tailwind, typographie, ombres et mouvements. Étendu mais cohérent. | 86 |
| `postcss.config.js` | Chaîne minimale Tailwind + Autoprefixer. | 80 |
| `eslint.config.js` | Lint TypeScript/React et hooks, séparation navigateur/outillage. | 89 |
| `eslint.node.config.js` | Lint partagé des scripts Node du dépôt depuis le workspace client. | 86 |
| `tsconfig.json` | Projet TypeScript composite, délègue aux configurations applicative et Node. | 87 |
| `tsconfig.app.json` | TypeScript strict, sans émission, alias et import JSON. Métadonnées dirigées vers un cache ignoré. | 93 |
| `tsconfig.node.json` | Contrôle TypeScript de `vite.config.ts`. Périmètre volontairement étroit. | 82 |

---

# 2. `public/` — **83/100**

Actifs publics cohérents avec une identité éditoriale « atlas/cabinet ». Les médias de scrollytelling sont réellement consommés par des chemins construits dynamiquement. Le sitemap est généré ; `robots.txt` reste lié à l’ancienne base GitHub Pages.

## 2.1 Identité, PWA et SEO — **81/100**

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `apple-touch-icon.png` | Icône Apple 180×180. | 82 |
| `favicon.ico` | Favicon de compatibilité 64×64. | 79 |
| `favicon.svg` | Symbole de marque vectoriel, léger et lisible. | 87 |
| `pwa-192.png` | Icône PWA 192×192. | 80 |
| `pwa-512.png` | Icône PWA 512×512. | 80 |
| `site.webmanifest` | Nom, couleurs, portée relative et icônes de l’application installable. | 83 |
| `robots.txt` | Politique robots et sitemap, mais URL figée sur `/vc-plateform/`; portabilité limitée. | 58 |
| `sitemap.xml` | Projection générée des routes publiques. Utile à la publication, non source canonique. | 72 |

## 2.2 `public/og/` — **85/100**

Cartes 1200×630 homogènes, sobres et immédiatement identifiables. Le modèle visuel est cohérent avec la marque.

| Fichier | Rôle | Note |
|---|---|---:|
| `default.png` | Carte générique de la plateforme. | 88 |
| `anti-portfolio.png` | Partage des analyses d’anti-portefeuille. | 84 |
| `blog.png` | Partage des articles. | 85 |
| `case-study.png` | Partage des cas pratiques. | 85 |
| `course.png` | Partage des cours. | 85 |
| `glossary.png` | Partage des entrées de glossaire. | 84 |
| `lesson.png` | Partage des leçons. | 85 |
| `memo.png` | Partage des mémos. | 85 |
| `path.png` | Partage des parcours. | 86 |
| `simulator.png` | Partage des simulateurs. | 85 |

## 2.3 `public/splash/` — **87/100**

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `bg-claire.webp` | Panorama de lever de soleil, fond ample permettant de superposer l’interface claire. | 87 |
| `bg-sombre.webp` | Ciel nocturne et reliefs, pendant sombre distinct sans simple recoloration CSS. | 88 |

## 2.4 `public/downloads/mathematiques-vc/` — **92/100**

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `dossier-depart.xlsx` | Classeur pédagogique de huit feuilles : hypothèses, marché, unit economics, trésorerie, cap table, droits économiques et rendements. Contrat de confidentialité explicite et structure sans formules préremplies. | 92 |

## 2.5 `public/blog/exit-voice-loyalty-hirschman/` — **88/100**

Ensemble visuel institutionnel : cartographie, gouvernance et flux traduits dans une palette marine, prune et or.

| Fichier | Rôle | Note |
|---|---|---:|
| `hero.webp` | Carte panoramique reliant salle de conseil, territoires et trajectoires. | 91 |
| `triangle.webp` | Illustration de la grille exit/voice/loyalty. | 88 |
| `governance.webp` | Support des scènes sur l’illiquidité, les droits et la loyauté. | 87 |
| `flows.webp` | Support des scènes sur l’attrition et les flux organisationnels. | 87 |

## 2.6 `public/blog/la-societe-du-spectacle-leve-des-fonds/` — **86/100**

Famille visuelle plus expressive, adaptée au scrollytelling critique. Les vidéos disposent de deux codecs et d’un poster, avec repli pour mouvement réduit.

| Fichier | Rôle | Note |
|---|---|---:|
| `ouverture.webp` | Collage opposant monde vécu et représentation. | 89 |
| `paraitre.webp` | Illustration de la logique être/avoir/paraître. | 87 |
| `markup.webp` | Représentation du marquage et de la validation circulaire. | 86 |
| `spectateur.webp` | Illustration du recul entre observation et expérience directe. | 86 |
| `couper-le-son.webp` | Scène de situation construite et d’observation directe. | 86 |
| `double-poster.webp` | Repli statique de la scène entreprise/représentation. | 85 |
| `double.webm` | Boucle VP9 de la scène du double. | 84 |
| `double.mp4` | Repli H.264 de la même scène. | 84 |
| `hero-poster.webp` | Poster de la boucle d’ouverture. | 85 |
| `hero.webm` | Boucle d’ouverture VP9. | 84 |
| `hero.mp4` | Boucle d’ouverture H.264. | 84 |
| `valorisation-poster.webp` | Repli de la scène valorisation-image. | 85 |
| `valorisation.webm` | Boucle VP9 sur la valorisation. | 84 |
| `valorisation.mp4` | Repli H.264 correspondant. | 84 |
| `vedette-poster.webp` | Repli de la scène du fondateur mis en scène. | 85 |
| `vedette.webm` | Boucle VP9 de la scène. | 84 |
| `vedette.mp4` | Repli H.264 correspondant. | 84 |
| `logique-carburant.webp` | Pictogramme du capital comme ressource consommable. | 87 |
| `logique-monnaie.webp` | Pictogramme de la valorisation comme monnaie interne. | 86 |
| `logique-offre.webp` | Pictogramme de la levée poussée par l’offre de capital. | 86 |
| `logique-produit.webp` | Pictogramme du financement devenu activité centrale. | 86 |
| `logique-rituel.webp` | Pictogramme de la cadence conventionnelle des tours. | 86 |
| `logique-signal.webp` | Pictogramme de la levée comme signal. | 86 |
| `logique-theatre.webp` | Pictogramme des apparences et conditions contractuelles. | 86 |
| `logique-validation.webp` | Pictogramme de la levée comme validation sociale. | 86 |

---

# 3. `src/` — **87/100**

Architecture cohérente : routeur paresseux, contenu statique typé, logique métier pure, persistance locale versionnée et composants spécialisés. Aucun module applicatif orphelin n’a été détecté hors points d’entrée et déclarations Vite.

## 3.1 Racine de `src/` — **91/100**

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `main.tsx` | Point d’entrée React : Router avec base normalisée, thèmes, données locales, UI et aperçu responsive de développement. | 92 |
| `App.tsx` | Registre exécutable des routes, lazy loading, frontière d’erreur et redirections historiques. Élément architectural central. | 94 |
| `App.dom.test.tsx` | Contrôles DOM, accessibilité et navigation du routeur principal. | 89 |
| `vite-env.d.ts` | Déclarations de types Vite. | 80 |

---

# 4. `src/components/` — **84/100**

Composants riches et alignés avec l’identité éditoriale. Plusieurs fichiers deviennent cependant très volumineux (`TopBar`, `PathAtlas`, `HomeEditorialBridge`), ce qui augmente le coût de maintenance.

## 4.1 Composants transverses — **87/100**

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `ErrorBoundary.tsx` | Capture les erreurs de page et se réinitialise lors d’un changement de route. | 91 |
| `cards.tsx` | Cartes partagées pour parcours, leçons, cas, mémos, livrables, blog, écosystèmes et simulateurs. Large mais réellement mutualisé. | 87 |

## 4.2 `components/blog/` — **85/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `ScrollytellingPrimitives.tsx` | Primitive de scène et indicateur de progression pour articles immersifs. | 85 |

## 4.3 `components/chrome/` — **83/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `Footer.tsx` | Pied de page et navigation institutionnelle secondaire. | 82 |
| `SideNav.tsx` | Navigation latérale desktop/mobile, thèmes et couches modales. | 86 |
| `TopBar.tsx` | Barre haute, navigation, recherche et adaptation à l’accueil. Fonctionnelle mais très dense. | 76 |
| `homeBar.ts` | Contrat visuel et libellés des deux piliers de l’accueil. | 87 |
| `mobileLayers.dom.test.tsx` | Non-régression des couches mobiles de la barre et du menu. | 89 |

## 4.4 `components/dev/` — **70/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `ViewportSwitcher.tsx` | Cadre de prévisualisation responsive réservé au développement. Utile à la conception, non produit. | 70 |
| `ViewportSwitcher.dom.test.tsx` | Vérifie le comportement minimal du sélecteur. | 72 |

## 4.5 `components/ecosystems/` — **88/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `EcosystemFigures.tsx` | Rend les graphiques et schémas typés des dossiers d’écosystème. | 88 |

## 4.6 `components/explore/` — **82/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `PathAtlas.tsx` | Atlas interactif des parcours et relations, fortement identitaire mais volumineux. | 79 |
| `PathAtlas.dom.test.tsx` | Contrôle navigation, interactions et contexte utilisateur de l’atlas. | 90 |

## 4.7 `components/home/` — **82/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `HomeEditorialBridge.tsx` | Transition éditoriale entre les deux piliers intelligence et formation. Dense pour une seule surface. | 77 |
| `HomeIntro.tsx` | Séquence d’entrée de l’accueil, synchronisée avec thème et préférence de mouvement. | 86 |
| `homeIntro.dom.test.tsx` | Non-régression de la séquence et des interactions d’introduction. | 90 |

## 4.8 `components/ikigai/` — **86/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `CahierSections.tsx` | Point de réexport des sections du cahier. | 80 |
| `IkigaiAtlasDiagram.tsx` | Diagramme interactif des treize zones Ikigai. | 87 |
| `IkigaiCahierSummary.tsx` | Synthèse locale, non conclusive, des réponses du cahier. | 89 |
| `IkigaiText.tsx` | Texte enrichi de définitions de glossaire contextuelles. | 86 |
| `cahierLayout.dom.test.tsx` | Contrôle de la structure de mise en page du cahier. | 86 |
| `cahierUi.tsx` | Sélecteurs de mode, en-têtes collants et légendes de lecture. | 87 |

### `components/ikigai/cahierSections/` — **85/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `archetypes.tsx` | Présentation des archétypes et liens vers les parcours. | 86 |
| `brief.tsx` | Vue introspective condensée. | 82 |
| `dimensions.tsx` | Présentation des dimensions fondamentales. | 86 |
| `interactive.tsx` | Parcours interactif par scénarios. | 84 |
| `intersections.tsx` | Présentation des intersections Ikigai. | 85 |
| `presque.tsx` | Présentation des zones de déséquilibre. | 84 |
| `reflection.tsx` | Questions libres et persistance des réponses. | 89 |
| `scenarios.ts` | Registre des scénarios et options de réponse. | 85 |
| `shared.ts` | Deux constantes visuelles partagées ; utile mais très local. | 72 |

## 4.9 `components/ornaments/` — **80/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `Illustrations.tsx` | Bibliothèque SVG de l’univers atlas : rose des vents, sceaux, constellations, monstres marins. Forte identité, fichier large. | 81 |
| `Ornaments.tsx` | Petits ornements réutilisables : fleurons, règle dorée et sceau. | 82 |

## 4.10 `components/reading/` — **91/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `ActiveProse.tsx` | Lecture annotable : sélection, surlignage et envoi vers les notes locales. | 93 |
| `ActiveProse.dom.test.tsx` | Vérifie les interactions d’annotation. | 91 |
| `QuizBlock.tsx` | Rendu et correction locale des quiz pédagogiques. | 90 |
| `QuizBlock.dom.test.tsx` | Contrôle des réponses, retours et accessibilité du quiz. | 91 |

## 4.11 `components/simulators/` — **86/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `index.ts` | Registre slug → composant de simulateur. | 88 |
| `shared.tsx` | Champs, curseurs, statistiques et panneaux communs. | 87 |
| `dilution.tsx` | Interface du simulateur de dilution. | 87 |
| `pre-post-money.tsx` | Interface de valorisation pre/post-money. | 86 |
| `ownership.tsx` | Interface de cap table et ownership. | 87 |
| `waterfall.tsx` | Interface de waterfall de liquidation. | 87 |
| `fund-returns.tsx` | Interface de rendement de fonds. | 84 |
| `fundraising-scenario.tsx` | Interface de scénario de levée. | 84 |
| `management-fees.tsx` | Interface des frais de gestion et budget de société de gestion. | 87 |
| `power-law.tsx` | Interface Monte-Carlo de construction de portefeuille. | 89 |
| `secondaries.tsx` | Interface des secondaires et continuation funds ; complète mais dense. | 86 |
| `simulators.dom.test.tsx` | Test d’intégration DOM échantillonné de deux simulateurs. | 80 |

## 4.12 `components/splash/` — **77/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `CompassIkigaiIntro.tsx` | Animation illustrée reliant orientation et parcours depuis le portail d’entrée. | 77 |

## 4.13 `components/ui/` — **89/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `BookmarkButton.tsx` | Ajout/retrait de favoris via le contexte local. | 88 |
| `CommandPalette.tsx` | Recherche et navigation au clavier, avec chargement paresseux de l’index. | 91 |
| `ConfirmDialog.tsx` | Confirmation accessible des actions irréversibles. | 91 |
| `Logo.tsx` | Logo cliquable et cohérent avec les ornements. | 84 |
| `Modal.tsx` | Modale portal avec gestion centralisée des couches. | 91 |
| `layerStack.ts` | Focus trap, ordre des couches, fermeture Escape et restauration du focus. | 94 |
| `layers.dom.test.tsx` | Tests détaillés du focus, de l’empilement et d’axe-core. | 94 |
| `primitives.tsx` | Boutons, badges, progression, chargement, états vides et animation de révélation. | 90 |
| `primitives.dom.test.tsx` | Contrôles DOM ciblés des primitives. | 85 |
| `useAnchoredPopover.ts` | Positionnement réactif des aperçus ancrés. | 87 |

---

# 5. `src/content/` — **90/100**

Couche de composition des données particulièrement structurante. Les collections lourdes sont séparées en index eager et corps lazy. Les tests éditoriaux spécialisés sont utiles, même si certains figent des conventions très détaillées.

## 5.1 Chargeurs et registres

| Fichier | Rôle | Note |
|---|---|---:|
| `antiPortfolio.ts` | Charge et indexe anti-portefeuille et motifs associés. | 89 |
| `blog.ts` | Recompose les articles unitaires et filtre leur publication. | 91 |
| `candidateCharters.ts` | Registre des chartes candidat de certification. | 87 |
| `caseCorrections.ts` | Charge paresseusement les corrections hors graphe eager. | 93 |
| `caseStudies.ts` | Registre et index des cas pratiques. | 89 |
| `certificationAssessments.ts` | Registre des évaluations et résolution de leur état de disponibilité. | 91 |
| `certificationLevels.ts` | Registre des niveaux de certification. | 88 |
| `certifications.ts` | Résolution des cursus, options, axes et suppléments de certification. | 92 |
| `convictions.ts` | Agrège les convictions des écosystèmes et les échéances de revue. | 88 |
| `courses.ts` | Registre minimal des cours. | 89 |
| `deliverables.ts` | Sélection contextuelle des composants, modèles et critères de livrables. | 92 |
| `diagnostics.ts` | Registre des diagnostics. | 87 |
| `ecosystems.ts` | Hiérarchie des écosystèmes et métadonnées de convictions/signaux. | 91 |
| `glossary.ts` | Index eager et définitions paresseuses du glossaire. | 94 |
| `ikigai.ts` | Registre Ikigai et profils. | 86 |
| `lessons.ts` | Index public, publication, progression et chargement paresseux des corps. | 95 |
| `memos.ts` | Registre des mémos et métadonnées de tags. | 88 |
| `parcours.ts` | Résolution des étapes, familles, navigation et références des parcours. | 94 |
| `parcoursRelations.ts` | Registre des relations entre parcours. | 88 |
| `simulators.ts` | Registre des simulateurs. | 86 |
| `learningTime.ts` | Calcul des temps de lecture, pratique, livrables et parcours. | 92 |
| `search.ts` | Index de recherche locale multi-collection et pondération des résultats. | 91 |
| `searchLazy.ts` | Chargement récupérable et paresseux de la recherche. | 90 |
| `lazyResource.ts` | Chargeur JSON paresseux avec cache et possibilité de reprise après erreur. | 92 |
| `labels.ts` | Libellés communs de niveaux, types et familles. | 86 |
| `index.ts` | Barrel public des collections ; utile mais à éviter dans les chemins critiques. | 82 |

## 5.2 Modèles de types

| Fichier | Rôle | Note |
|---|---|---:|
| `types.ts` | Ontologie principale du contenu applicatif. Très structurant, mais 800 lignes concentrent beaucoup de domaines. | 88 |
| `certificationTypes.ts` | Modèle discriminé des certifications, options, rubriques et évaluations. | 90 |
| `parcoursTypes.ts` | Modèle des étapes, budgets, perspectives et relations des parcours. | 90 |

## 5.3 Tests de contenu

| Fichier | Rôle | Note |
|---|---|---:|
| `blog.test.ts` | Publication et présence des articles dans la recherche. | 86 |
| `certificationAssessments.test.ts` | Cohérence de publication des évaluations. | 88 |
| `certifications.test.ts` | Contrôle approfondi du référentiel et des compositions de certification. | 93 |
| `deeptechEvidenceLearning.test.ts` | Contrat éditorial du module deeptech fondé sur les preuves. | 88 |
| `deeptechIpTransferLearning.test.ts` | Contrat juridique et terminologique du transfert de PI deeptech. | 89 |
| `lazyResource.test.ts` | Cache et reprise du chargeur paresseux. | 90 |
| `learningRelations.test.ts` | Réciprocité cours/leçons et ordre pédagogique. | 91 |
| `lessons.test.ts` | Publication, accès public et progression. | 90 |
| `mathVentureCourse.test.ts` | Cohérence du cours de mathématiques VC, livrable, cas et classeur. | 93 |
| `parcours.test.ts` | Contrats pédagogiques et structurels des principaux parcours. | 93 |
| `parcoursRelations.test.ts` | Unicité et validité des relations entre parcours. | 89 |
| `search.test.ts` | Classement et couverture de la recherche locale. | 89 |
| `serieAParcours.test.ts` | Contrat détaillé du parcours Série A. | 92 |
| `venturePhilanthropyLearning.test.ts` | Contrat structurel du parcours de venture philanthropie. | 92 |

---

# 6. `src/context/` — **91/100**

Contexts réduits, providers séparés et persistance locale déléguée aux bibliothèques métier.

| Fichier | Rôle | Note |
|---|---|---:|
| `HomeIntroContext.ts` | État et calendrier de la séquence d’entrée de l’accueil. | 87 |
| `ThemeContext.ts` | Contrat minimal du thème. | 88 |
| `ThemeProvider.tsx` | Initialise et persiste le thème. | 91 |
| `UIContext.ts` | Contrat d’ouverture du menu et de la palette. | 88 |
| `UIProvider.tsx` | État global léger des surfaces UI. | 89 |
| `UserDataContext.ts` | Contrat typé des données utilisateur locales. | 92 |
| `UserDataProvider.tsx` | Orchestration progression, notes, favoris, profil et erreurs de stockage. | 94 |

---

# 7. `src/hooks/` — **86/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `useResumeLesson.ts` | Sélectionne la première leçon commencée mais non terminée. | 86 |

---

# 8. `src/layouts/` — **90/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `MainLayout.tsx` | Coquille commune, chrome adaptatif et déplacement du focus après navigation. | 92 |
| `MainLayout.dom.test.tsx` | Vérifie la navigation clavier et la composition du layout. | 89 |

---

# 9. `src/lib/` — **92/100**

Partie la plus solide du client : fonctions métier pures, persistance locale versionnée, migrations, import/export et tests ciblés.

## 9.1 Domaine, export et navigation

| Fichier | Rôle | Note |
|---|---|---:|
| `certificationAssessment.ts` | Cycle complet d’évaluation locale : tirage, saisie, score, tentatives, limites et sérialisation. Très complet mais volumineux. | 91 |
| `certificationAssessment.test.ts` | Batterie de tests des évaluations et migrations associées. | 94 |
| `decisionJournal.ts` | Mathématiques de calibration, score de Brier et échéances du journal. | 93 |
| `decisionJournal.test.ts` | Contrôle des calculs et seuils de calibration. | 94 |
| `downloads.ts` | Téléchargement navigateur de Markdown. | 83 |
| `ikigai.ts` | Calcul de profil, recommandations et archétypes. | 90 |
| `ikigai.test.ts` | Contrôle du scoring et des recommandations. | 91 |
| `ikigaiCahier.ts` | Contrats, migrations et accès au cahier Ikigai local. | 93 |
| `ikigaiCahier.test.ts` | Tests de persistance et migration du cahier. | 93 |
| `ikigaiColor.ts` | Calcul de luminance et choix d’accent lisible. | 88 |
| `learningExports.ts` | Produit les exports Markdown de travail et de revue. | 90 |
| `learningExports.test.ts` | Contrôle de la structure des exports. | 91 |
| `learningWorkspace.ts` | Modèle versionné des productions, diagnostics, revues et activités locales. | 94 |
| `learningWorkspace.test.ts` | Validation, limites et migrations du workspace. | 95 |
| `markdown-text.ts` | Extraction de texte brut pour extraits et métadonnées. | 86 |
| `markdown.tsx` | Rendu Markdown contrôlé, liens internes, glossaire et sécurité d’URL. | 92 |
| `navigation.ts` | Ontologie des piliers et résolution de l’élément actif. | 92 |
| `navigation.test.ts` | Contrôle des frontières et correspondances de routes. | 93 |
| `parcoursProgress.ts` | Calcul de progression et navigation contextuelle dans les étapes. | 93 |
| `parcoursProgress.test.ts` | Contrôle des cas de progression et d’étapes optionnelles. | 93 |
| `seo.ts` | Modèle de métadonnées, canonical, noindex et cartes OG par ressource. | 93 |
| `seo.test.ts` | Tests de politique SEO et des chemins de médias. | 92 |
| `usePrefersReducedMotion.ts` | Hooks robustes pour media queries et mouvement réduit. | 90 |
| `utils.ts` | Classes CSS, formatage français et validation d’URL éditoriale. | 89 |
| `utils.test.ts` | Contrôles ciblés des utilitaires. | 88 |

## 9.2 Persistance locale — **96/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `storage.ts` | Primitive namespacée de stockage, contrats, résultats typés et migrations. | 96 |
| `storage.test.ts` | Lecture, écriture et erreurs générales. | 94 |
| `storage.contract.test.ts` | Non-régression des contrats et anciennes clés. | 96 |
| `storageDomains.ts` | Schémas et limites des domaines profil, notes, favoris, progression et certifications. | 96 |
| `storageDomains.test.ts` | Validation exhaustive des domaines et limites. | 96 |
| `localDataLifecycle.ts` | Export, prévisualisation, import et suppression des données locales avec limites de taille. | 96 |
| `localDataLifecycle.test.ts` | Tests du cycle de vie complet et des échecs partiels. | 96 |

## 9.3 Série A

| Fichier | Rôle | Note |
|---|---|---:|
| `serieA/altosuite.ts` | Calculs et exports de l’offre, cap table et waterfall du cas AltoSuite. | 93 |
| `serieA/altosuite.test.ts` | Recalcul indépendant du scénario et de ses conventions. | 95 |

## 9.4 `lib/simulators/` — **91/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `dilution.ts` | Calcul pur d’une dilution par tour. | 91 |
| `dilution.test.ts` | Cas numériques de dilution. | 92 |
| `pre-post-money.ts` | Valorisation pre/post-money et ownership. | 91 |
| `ownership.ts` | Normalisation et calcul de la cap table. | 91 |
| `fundraising-scenario.ts` | Besoin de financement, runway et dilution implicite. | 89 |
| `fund-returns.ts` | MOIC et rendement brut simplifié. Très réduit mais clair. | 86 |
| `fund-returns.test.ts` | Contrôle numérique minimal. | 85 |
| `management-fees.ts` | Budget de société de gestion et couverture des salaires. | 91 |
| `management-fees.test.ts` | Cas numérique représentatif. | 91 |
| `power-law.ts` | Simulation Monte-Carlo, réserves, histogramme et percentiles. | 94 |
| `power-law.test.ts` | Contrôle déterministe des hypothèses et agrégats. | 94 |
| `secondaries.ts` | Vente secondaire et continuation fund. | 93 |
| `secondaries.test.ts` | Cas numériques détaillés des deux modèles. | 94 |
| `waterfall.ts` | Waterfall simplifiée à un bloc préférentiel. | 92 |
| `waterfall.test.ts` | Contrôle des préférences, conversion et paiements. | 94 |
| `c4-calculators.test.ts` | Contrôle transversal des quatre calculateurs fondamentaux. | 91 |

---

# 10. `src/pages/` — **84/100**

Couverture fonctionnelle déjà large malgré la phase produit embryonnaire. Les pages principales sont réellement branchées au routeur. Le principal coût est la concentration de logique et de rendu dans quelques très grands composants.

## 10.1 `pages/blog/` — **85/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `BlogPage.tsx` | Index filtré des articles publiés. | 86 |
| `BlogPostPage.tsx` | Lecture d’article, favoris, contenus liés et sélection du rendu immersif. | 89 |
| `DebordScrollytelling.tsx` | Scrollytelling complet, médias adaptatifs et mouvement réduit. Très riche, mais 633 lignes. | 83 |
| `HirschmanScrollytelling.tsx` | Scrollytelling exit/voice/loyalty, plus compact. | 87 |
| `scrollytellingMotion.dom.test.tsx` | Contrôle des replis mobile et mouvement réduit. | 91 |

## 10.2 `pages/cases/` — **88/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `CaseStudyPage.tsx` | Rendu des dossiers, tableaux, scénarios, documents et productions. | 89 |
| `CaseStudyPage.dom.test.tsx` | Contrôle du rendu principal d’un cas. | 86 |
| `CaseCorrectionPage.tsx` | Correction paresseuse, comparaison au travail local et navigation contextuelle. | 91 |
| `CaseCorrectionPage.dom.test.tsx` | Vérifie l’accès et le rendu de la correction. | 88 |

## 10.3 `pages/certifications/` — **82/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `CertificationsPage.tsx` | Catalogue des certifications publiées. | 86 |
| `CertificationLevelsPage.tsx` | Référentiel public des niveaux. | 87 |
| `CertificationDetailPage.tsx` | Détail, curriculum, options, sélection et états. Très complet mais 1 293 lignes. | 76 |
| `CertificationEvaluationPage.tsx` | Session d’évaluation locale, questions, mini-cas, score et reprise. 921 lignes. | 78 |
| `CertificationEvaluationPage.dom.test.tsx` | Contrôle des interactions critiques de l’évaluation. | 91 |

## 10.4 `pages/ecosystems/` — **88/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `EcosystemsPage.tsx` | Index des dossiers racines. | 86 |
| `EcosystemPage.tsx` | Analyse détaillée, figures, convictions, sous-dossiers et lecture active. | 91 |

## 10.5 `pages/glossary/` — **84/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `GlossaryPage.tsx` | Index alphabétique, recherche, route de détail et chargement paresseux des définitions. Très dense. | 82 |
| `glossarySearch.ts` | Correspondance normalisée terme, alias et catégorie. | 88 |
| `GlossaryPage.test.ts` | Test unitaire de recherche. | 87 |
| `GlossaryPage.lazy.dom.test.tsx` | Contrôle du chargement différé et des interactions. | 91 |

## 10.6 `pages/home/` — **84/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `SplashPage.tsx` | Portail initial, choix visuel et transition vers l’expérience. Très travaillé pour une surface d’entrée. | 82 |
| `HomePage.tsx` | Accueil éditorial des deux piliers. | 87 |
| `homeExperience.dom.test.tsx` | Batterie étendue de tests du splash, de l’accueil et des transitions. | 92 |

## 10.7 `pages/intelligence/` — **87/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `IntelligencePage.tsx` | Hub des dossiers, articles et convictions. | 89 |
| `ConvictionsPage.tsx` | Registre filtrable des convictions et échéances. | 88 |
| `DecisionsIndexPage.tsx` | Index chronologique des cas, mémos et anti-portefeuilles. | 88 |
| `MethodePage.tsx` | Présentation de la méthode et accès aux ressources de production. | 85 |
| `DeliverablesPage.tsx` | Index des livrables. | 84 |
| `DeliverablePage.tsx` | Atelier local de production, modèles, critères, révisions et export. Très riche, 567 lignes. | 91 |
| `DeliverablePage.dom.test.tsx` | Contrôle du workspace et du rendu contextuel. | 90 |
| `AntiPortfolioPage.tsx` | Index des anti-portefeuilles. | 86 |
| `AntiPortfolioEntryPage.tsx` | Analyse détaillée et rapprochement avec les mémos. | 89 |
| `MemoLibraryPage.tsx` | Bibliothèque des mémos. | 84 |
| `MemoPage.tsx` | Lecture active d’un mémo et contenus liés. | 89 |

## 10.8 `pages/learn/` — **89/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `ParcoursPage.tsx` | Catalogue et atlas des parcours avec recommandation Ikigai. | 90 |
| `ParcoursDetailPage.tsx` | Feuille de route, progression, jalons et reprise. | 92 |
| `ParcoursDiagnosticPage.tsx` | Diagnostic local rattaché au parcours. | 89 |
| `CourseDetailPage.tsx` | Cours, séquence de leçons et temps de lecture. | 89 |
| `LessonPage.tsx` | Lecteur paresseux, quiz, notes, progression et contexte de parcours. | 93 |
| `LibraryPage.tsx` | Inventaire filtrable des cours, leçons publiées et cas. Large mais central. | 89 |
| `furtherReadingHref.ts` | Résolution sûre des références internes et externes. | 90 |
| `furtherReadingHref.test.ts` | Contrôle des résolutions et URL rejetées. | 91 |
| `LessonPage.lazy.dom.test.tsx` | Chargement, interactions et cas d’indisponibilité. | 92 |
| `LibraryPage.test.tsx` | Contrôle de rendu serveur minimal. | 82 |
| `parcoursContextNavigation.dom.test.tsx` | Navigation d’une ressource dans son contexte de parcours. | 93 |
| `serieAParcours.dom.test.tsx` | Contrôle de l’enchaînement cas/livrable du parcours Série A. | 92 |

## 10.9 `pages/onboarding/` — **85/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `OnboardingPage.tsx` | Présentation sobre des usages avant orientation. | 86 |
| `MythCard.tsx` | Carte pédagogique de déconstruction d’un préjugé. | 79 |
| `OrientationTest.tsx` | Questionnaire profilé et persistance du résultat. | 88 |
| `IkigaiPage.tsx` | Cahier, test et modes de lecture pilotés par l’URL. | 90 |
| `ProfileResultPage.tsx` | Résultat et recommandations, avec reprise après rechargement. | 88 |
| `ProfilePage.tsx` | Synthèse et gestion du profil local. | 88 |
| `useIkigaiScrollPinning.ts` | Synchronisation du diagramme avec le défilement desktop/mobile. Complexe mais isolée. | 83 |
| `useOnboardingMode.ts` | Lecture/persistance du mode d’onboarding. | 84 |
| `onboardingAndIkigai.dom.test.tsx` | Contrôles transverses onboarding/Ikigai. | 87 |

## 10.10 `pages/search/` — **89/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `SearchPage.tsx` | Page de recherche avec module et résultats chargés paresseusement. | 89 |
| `SearchPage.lazy.dom.test.tsx` | Contrôle du chargement, des requêtes et résultats. | 91 |

## 10.11 `pages/simulators/` — **87/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `SimulatorsPage.tsx` | Catalogue minimal des simulateurs. | 83 |
| `SimulatorPage.tsx` | Résolution du simulateur, contexte pédagogique et ressources liées. | 90 |

## 10.12 `pages/system/` — **76/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `DesignSystemShowcasePage.tsx` | Démonstrateur DEV des composants et états visuels. Utile à la conception, non publié, très volumineux. | 72 |
| `NotFoundPage.tsx` | Page 404 avec métadonnées adaptées et retour vers le produit. | 86 |

## 10.13 `pages/workspace/` — **91/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `DashboardPage.tsx` | Tableau de bord local : reprise, parcours, favoris et activité. | 91 |
| `DecisionJournalPage.tsx` | Journal complet avec échéances, résultats, calibration et suppressions confirmées. Dense mais central. | 93 |
| `NotesPage.tsx` | Notes, citations, favoris et synthèse Ikigai. | 90 |

---

# 11. `src/styles/` — **88/100**

Tokens explicites et prise en compte du mouvement réduit. La densité des styles spécifiques au splash reflète une surface d’entrée très travaillée.

| Fichier | Rôle | Note |
|---|---|---:|
| `tokens.css` | Variables de couleurs, surfaces, typographies et modes clair/sombre. | 92 |
| `tokens.test.ts` | Vérifie la présence et la cohérence des tokens requis. | 91 |
| `global.css` | Polices locales, reset, styles éditoriaux, focus, accessibilité et utilitaires globaux. | 90 |
| `home-intro.css` | Animations et mise en page de l’introduction de l’accueil. | 85 |
| `splash.css` | Styles et transitions du portail d’entrée. Complet mais très volumineux. | 82 |

---

# 12. `src/test/` — **90/100**

| Fichier | Rôle | Note |
|---|---|---:|
| `renderApp.tsx` | Harnais commun pour rendre l’application ou une route avec ses providers. | 91 |
| `setupDom.ts` | Nettoyage DOM, mocks des API navigateur et isolation du stockage. | 90 |

---

# 13. Sorties et caches exclus

| Famille | Contenu | Utilité actuelle | Note |
|---|---|---|---:|
| `dist/` | 929 fichiers : HTML prérendus, chunks, copies d’actifs, 404 et routes matérialisées. | Preuve d’un build antérieur et livrable statique, mais non source et potentiellement périssable. | 40 |
| `node_modules/.vite/` | 27 fichiers de cache Vite/Vitest. | Accélération locale uniquement. | 10 |
| `node_modules/.tmp/` | 2 fichiers `tsbuildinfo`. | Cache incrémental TypeScript. | 15 |

---

# Appréciation d’ensemble

- **Points structurants** : séparation données/index/corps paresseux, routeur entièrement lazy, persistance locale versionnée, politique SEO centralisée, logique financière testée et bonne prise en compte du clavier et du mouvement réduit.
- **Dette principale** : plusieurs composants de page dépassent nettement une responsabilité raisonnable (`CertificationDetailPage`, `CertificationEvaluationPage`, `GlossaryPage`, `TopBar`, `PathAtlas`, `DecisionJournalPage`). Leur utilité est réelle, mais leur coût de modification progressera rapidement.
- **Cohérence cible** : le code soutient correctement les trois piliers documentés — intelligence, formation, espace personnel local — sans nécessiter de déduire le périmètre final du produit.
- **Médias** : familles cohérentes et correctement reliées aux deux scrollytellings ; double encodage vidéo et posters adaptés. Les cartes OG sont homogènes. `robots.txt` est le principal élément public insuffisamment portable.
- **Tests** : couverture statiquement visible sur les contrats critiques, notamment stockage, progression, certification, simulateurs, parcours et couches modales. Ils n’ont pas été exécutés afin de respecter strictement la lecture seule.

## Intégrité de l’intervention

- **Fichiers créés ou modifiés : aucun.**
- Le dépôt était déjà modifié avant l’analyse, notamment :
  - `client/src/components/chrome/TopBar.tsx`
  - `client/src/pages/home/homeExperience.dom.test.tsx`
  - ainsi que des fichiers hors périmètre client.
- L’état Git final conserve exactement les mêmes chemins modifiés/non suivis que l’état initial.


---

# Données, scripts et code partagé

## Résultat global

**Appréciation technique du périmètre : 86/100.**

Le socle est structuré, fortement validé et correctement relié au client. Les contrôles exécutés confirment la cohérence actuelle des données, des artefacts générés et des principales politiques de routage. Les réserves portent surtout sur la sécurité des dépendances, la gouvernance de publication de certaines collections et quelques divergences entre validateurs.

La note mesure la robustesse technique, la traçabilité, la validation et la testabilité. Elle ne constitue pas une validation factuelle de chaque proposition éditoriale.

### Contrôles exécutés en lecture seule

- `validate-content.mjs --strict` : **succès**
  - 24 parcours, 30 cours, 145 leçons, 419 termes ;
  - 19 relations de parcours ;
  - 10 cas, 12 livrables, 8 articles, 31 dossiers d’écosystème ;
  - 391 marqueurs de glossaire vérifiés.
- `validate-glossary.mjs` : **succès**, 419 termes.
- `check-generated.mjs` : **succès**
  - 145 leçons ;
  - 118 corps publiés ;
  - 419 termes.
- Tests Node ciblés garantis sans écriture dans le dépôt : **56/56 réussis**.
- `npm audit` :
  - production : **1 vulnérabilité haute et 1 modérée** ;
  - ensemble de l’arbre : **3 hautes et 1 modérée**.
- État Git final identique à l’état initial : les modifications et fichiers non suivis présents appartenaient déjà au worktree.
- `npm run check`, le build, les scripts de génération et le test d’intégration Chromium complet n’ont pas été lancés : leurs chaînes peuvent écrire des fichiers générés, un `dist`, des caches ou des artefacts publics.

---

# 1. Données

## Dossiers

| Élément | Rôle et utilité | Note |
|---|---|---:|
| `data/` | Source éditoriale centrale, directement intégrée au client statique. Schémas Zod, références croisées et marqueurs contrôlés. | **86/100** |
| `data/blog/` | Collection « un fichier par article », recomposée par le client et le collecteur de routes. Bonne isolation éditoriale. | **85/100** |
| `data/generated/` | Projections déterministes index/corps utilisées pour le chargement différé. Parité exacte confirmée. | **97/100** |
| `data/parcours/` | Registres de leçons spécialisées ajoutées à la bibliothèque canonique au moment du split. | **90/100** |
| `data/sources/` | Registre éditorial et de provenance du glossaire. Bonne intention, mais preuve externe insuffisamment obligatoire. | **70/100** |

## Collections principales

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `data/antiPortfolio.json` | 5 motifs et 9 décisions de non-investissement documentées ; liens vers mémos, glossaire et sources HTTPS. Toutes les entrées sont implicitement publiques. | **84/100** |
| `data/candidateCharters.json` | Charte candidat versionnée, active, avec couverture exacte de sept principes. Référencée par le modèle de certification. | **91/100** |
| `data/caseCorrections.json` | 3 corrections commentées liées à des dossiers apprenants et à des livrables. Routes séparées, prérendues en `noindex`. | **90/100** |
| `data/caseStudies.json` | 10 études de cas, dont dossiers apprenants, documents structurés, questions et scénario numérique. Contrôles de tables et de composition. | **89/100** |
| `data/certificationAssessments.json` | Registre prévu pour les évaluations de connaissances. Actuellement vide ; schéma détaillé mais aucune valeur produit active. | **43/100** |
| `data/certificationLevels.json` | Échelle canonique de 5 niveaux ; un niveau en construction et quatre futurs. Ordre et statut vérifiés. | **88/100** |
| `data/certifications.json` | Une certification professionnelle publiée, avec préparations, axes, variantes et grille finale totalisant 100 points. | **89/100** |
| `data/courses.json` | 30 cours et leurs séquences de leçons. Réciprocité cours/leçon, ordre et durées dérivées contrôlés lorsque déclarés. | **91/100** |
| `data/deliverables.json` | 12 productions pédagogiques : modèles, composants, rubriques, niveaux, ressources et liens avec cas/corrections. | **89/100** |
| `data/diagnostics.json` | Diagnostic d’entrée optionnel pour la venture philanthropie, cinq questions et ressources résolues. | **92/100** |
| `data/domains.json` | Deux domaines fonctionnels servant notamment aux certifications. Petit référentiel simple et strict. | **92/100** |
| `data/ecosystems.json` | 31 dossiers hiérarchiques avec sections, figures, thèses, signaux et acteurs. Seulement 7 dossiers portent des sources et 1 un `verifiedAt`. | **73/100** |
| `data/glossary.json` | 419 termes publiés, 388 avec aliases, 43 avec lien. Unicité, collisions, renvois et marqueurs vérifiés. | **92/100** |
| `data/ikigai.json` | Modèle d’introspection : 4 dimensions, 7 profils, 3 archétypes, questions et mythes. Cohérence avec l’aiguillage vérifiée. | **85/100** |
| `data/lessons.json` | Bibliothèque canonique de 124 leçons : 97 publiées, 27 à venir. Corps, quiz, prérequis et références fortement contrôlés. | **92/100** |
| `data/memos.json` | 5 mémos annotés avec URL source HTTPS obligatoire, contexte, blocs et relations anti-portfolio. | **92/100** |
| `data/parcours.json` | 24 trajectoires et 171 étapes : 165 existantes, 6 à produire. Tous les parcours sont actuellement routés sans statut de publication. | **84/100** |
| `data/parcoursRelations.json` | Graphe explicite de 19 relations : 9 pairs et 10 progressions. Contrôle des niveaux, doublons et cycles. | **93/100** |
| `data/profileParcours.json` | Aiguillage profils/archétypes vers les parcours et adaptation au temps disponible. Couverture exhaustive validée. | **92/100** |
| `data/simulators.json` | Métadonnées de 9 simulateurs et relations avec leçons/glossaire. La logique de calcul reste côté client. | **85/100** |

## Articles

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `data/blog/exit-voice-loyalty-hirschman.json` | Article publié long, avec ouvrage de référence et liens de glossaire. | **89/100** |
| `data/blog/flatland-cecite-dimensionnelle.json` | Article long conservé en brouillon ; correctement exclu des routes publiques. | **82/100** |
| `data/blog/l-art-de-formuler-les-trois-risques.json` | Article publié court et autonome. Structure valide, appareil documentaire limité. | **80/100** |
| `data/blog/la-societe-du-spectacle-leve-des-fonds.json` | Article publié long, enrichi de références et de médias associés. | **89/100** |
| `data/blog/lire-le-vc-comme-un-praticien.json` | Article publié court, principalement méthodologique. | **80/100** |
| `data/blog/ou-sera-votre-centre-de-gravite-dans-une-decennie.json` | Article publié court, lié à l’orientation personnelle. | **80/100** |
| `data/blog/pourquoi-nous-ne-bloquons-aucun-chapitre.json` | Article publié court explicitant la liberté de progression. | **80/100** |
| `data/blog/voir-comme-un-etat.json` | Article publié long, ouvrage de référence et renvois de glossaire. | **89/100** |

## Artefacts générés

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `data/generated/glossary.index.json` | Index léger des 419 termes, sans définition ni exemple ; chargé sur les chemins fréquents. | **98/100** |
| `data/generated/glossary.defs.json` | Dictionnaire différé des 419 définitions et exemples. Parité exacte confirmée. | **98/100** |
| `data/generated/lessons.index.json` | Index de 145 leçons, dont 118 publiées et 27 à venir. Fusion canonique + registres de parcours. | **98/100** |
| `data/generated/lessons.bodies.json` | Corps différés des 118 leçons publiées. Les leçons à venir sont volontairement absentes. | **98/100** |

## Registres de leçons de parcours

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `data/parcours/01-le-vc-sans-bullshit.lessons.json` | 7 leçons introductives publiées, intégrées au cours et aux projections générées. | **90/100** |
| `data/parcours/03-lever-son-fonds-lp.lessons.json` | 3 leçons publiées consacrées à la levée d’un fonds auprès des LP. | **89/100** |
| `data/parcours/04-le-standard-francais.lessons.json` | Une leçon publiée consacrée au standard français. Registre cohérent mais très étroit. | **87/100** |
| `data/parcours/05-preparer-sa-serie-a.lessons.json` | 10 leçons avancées publiées avec objectifs, pratique, quiz et références. | **93/100** |

## Registre source

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `data/sources/canonical-glossary.json` | Registre de 495 entrées : 462 appliquées, 28 à revoir, 5 brouillons. Porte décisions de fusion, aliases et provenance. 431 lignes se déclarent `source-backed`, mais seules 12 portent `sourceUrls`; le validateur permet l’absence complète du champ. | **70/100** |

---

# 2. Scripts

## Dossier

| Élément | Rôle et utilité | Note |
|---|---|---:|
| `scripts/` | Pipeline Node ESM pour validation, génération, routage, sitemap, budget média et prérendu. Couverture de tests solide mais responsabilités concentrées. | **88/100** |

## Génération de contenu

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `scripts/generated-content.mjs` | Fonctions pures de construction des quatre projections et contrôle de fraîcheur. Détecte les slugs de leçons en double, mais pas ceux du glossaire avant écrasement dans `defs`. | **90/100** |
| `scripts/generated-content.test.mjs` | Vérifie déterminisme, statuts, doublons de leçons et détection d’un artefact périmé. Écrit uniquement dans un dossier temporaire supprimé. | **95/100** |
| `scripts/check-generated.mjs` | Interface CLI strictement en lecture seule pour comparer sources et projections octet par octet. | **96/100** |
| `scripts/split-glossary.mjs` | Génère index et définitions du glossaire. Déterministe, mais script écrivant sans mode simulation propre. | **87/100** |
| `scripts/split-lessons.mjs` | Fusionne bibliothèque et registres de parcours, puis écrit index et corps. Déterministe et correctement centralisé. | **90/100** |
| `scripts/merge-aliases.mjs` | Fusionne les aliases du registre canonique vers le glossaire publié. Idempotence annoncée, mais aucune suite de tests dédiée et écriture systématique du fichier. | **72/100** |

## Validation

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `scripts/validate-content.mjs` | Validateur principal : 2 112 lignes de schémas Zod, unicité, références, cycles, quiz, URLs, tonalité et marqueurs. Très complet mais monolithique et difficile à tester par unité. | **87/100** |
| `scripts/validation-core.mjs` | Primitives pures : publication, doublons, références, cycles, tonalité, liens Markdown, relations et provenance du glossaire. | **93/100** |
| `scripts/validation-core.test.mjs` | Tests des chemins positifs et négatifs structurants, y compris publication fail-closed et URLs dangereuses. Certains tests de câblage reposent seulement sur des expressions régulières dans le source. | **91/100** |
| `scripts/glossary-validation.mjs` | Validation spécialisée : id/slug, HTTPS, renvois, marqueurs et collisions d’aliases. | **89/100** |
| `scripts/glossary-validation.test.mjs` | Fixtures positives et négatives pour le glossaire. Couverture concise et utile. | **89/100** |
| `scripts/validate-glossary.mjs` | CLI du validateur spécialisé. Ne charge que `data/lessons.json`, pas les 21 leçons des registres `data/parcours/`. | **76/100** |

## Routes, sitemap et déploiement

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `scripts/collect-routes.mjs` | Collecteur unique des routes de sitemap et de prérendu. Produit actuellement 694 routes publiques et 3 corrections `noindex`. Lecture silencieusement tolérante aux fichiers absents. | **87/100** |
| `scripts/collect-routes.test.mjs` | Vérifie publication, `noindex`, redirects, parité React Router, sitemap commité et partage du collecteur avec le prérendu. | **95/100** |
| `scripts/generate-sitemap.mjs` | Génère `sitemap.xml` et `robots.txt`, exige une origine canonique et respecte la base de déploiement. | **90/100** |
| `scripts/deploy-workflow.test.mjs` | Contrôle le workflow Pages : lancement manuel, permissions séparées, actions figées par SHA et build strict. | **92/100** |

## Prérendu

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `scripts/prerender.mjs` | Serveur statique temporaire, crawl Chromium, validation des métadonnées, HTML par route, redirects et 404. Mode strict par défaut, comptage exact et nettoyage des ressources. | **93/100** |
| `scripts/prerender.test.mjs` | Tests unitaires injectés : échec navigateur, métadonnées, path traversal, concurrence, mode tolérant et 404. | **94/100** |
| `scripts/prerender.integration.test.mjs` | Test réel CLI + Chromium + Vite, incluant routes inconnues et surfaces `noindex`. Non exécuté pendant cet audit afin de préserver strictement le dépôt. | **93/100** |

## Médias

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `scripts/media-budget.mjs` | Inventorie récursivement les médias publics, formats, poids total, vidéos et fichiers les plus lourds. | **89/100** |
| `scripts/media-budget.test.mjs` | Verrouille 47 fichiers, 14,08 Mo et les plus gros médias. Bon signal de dérive, mais snapshot exact volontairement fragile. | **85/100** |

---

# 3. Code partagé

## Dossier

| Élément | Rôle et utilité | Note |
|---|---|---:|
| `shared/` | Contrats ESM sans dépendances partagés entre Node et navigateur : URLs, publication et taxonomie de routes. | **93/100** |

## Fichiers

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `shared/base-url.mjs` | Normalise la base Vite, construit routes/assets et impose la cohérence entre origine canonique et sous-chemin. Rejette les traversées `..`. | **95/100** |
| `shared/base-url.d.mts` | Déclarations TypeScript du module ESM. Surface exacte mais synchronisation manuelle. | **87/100** |
| `shared/base-url.test.mjs` | Vérifie bases racine/sous-chemin, assets, origine canonique, conflit de base et manifest. | **95/100** |
| `shared/editorial-url.mjs` | Politique d’URL éditoriale : HTTPS externe, absence d’identifiants, contrôle des espaces/caractères, exceptions internes explicites. | **94/100** |
| `shared/editorial-url.d.mts` | Types des options et fonctions de validation d’URL. Synchronisation manuelle. | **87/100** |
| `shared/publication.mjs` | Filtre de publication fail-closed : seul `status === "published"` est public. | **93/100** |
| `shared/publication.d.mts` | Type minimal du contrat de publication. | **87/100** |
| `shared/routes.mjs` | Source centrale des routes statiques, exécutables, publiques, `noindex`, redirects et images Open Graph. Alignement React testé. | **94/100** |
| `shared/routes.d.mts` | Typage des registres et fonctions de routes. Solide, mais duplicatif par rapport au runtime JavaScript. | **88/100** |

---

# 4. Fichiers techniques racine

| Fichier | Rôle et utilité | Note |
|---|---|---:|
| `package.json` | Manifeste ESM privé, workspace `client`, Node ≥ 20 et chaîne complète génération → validation → build → prérendu. Les commandes d’écriture sont identifiables. | **90/100** |
| `package-lock.json` | Lockfile npm v3, 448 entrées, assurant la reproductibilité. Contient toutefois plusieurs versions actuellement signalées par `npm audit`. | **68/100** |
| `.gitignore` | Exclut dépendances, builds, caches, secrets locaux, couverture et journaux. Conserve des règles Prisma/serveur devenues historiques. | **76/100** |
| `AGENTS.md` | Point d’entrée portable vers le contrat commun et rappel de l’interdiction d’éditer les générés. | **95/100** |
| `CLAUDE.md` | Contrat technique et éditorial détaillé : architecture, commandes, données, routes, publication, sécurité et définition de fini. | **94/100** |
| `README.md` | Documentation d’exploitation complète et largement alignée avec le code. Certaines informations de déploiement restent prospectives. | **90/100** |
| `PRODUCT.md` | Contrat produit concis : usages, ton, principes et objectif WCAG 2.2 AA. | **91/100** |
| `.DS_Store` | Métadonnée Finder sans utilité pour le projet ; ignorée par Git mais présente à la racine locale. | **5/100** |

Les fichiers éditoriaux racine `PROMPTS-SERIE-A.md`, `revue-mathematiques-du-vc.md` et les dossiers applicatifs hors périmètre n’ont pas été notés : ils ne constituent pas des fichiers techniques racine au sens du mandat.

---

# 5. Relations structurantes

- `lessons.json` + `parcours/*.lessons.json`  
  → `generated/lessons.index.json` + `generated/lessons.bodies.json`  
  → `client/src/content/lessons.ts`, routes publiques et recherche.
- `glossary.json`  
  → `generated/glossary.index.json` + `generated/glossary.defs.json`  
  → glossaire, marqueurs inline et chargement différé.
- `sources/canonical-glossary.json`  
  → `merge-aliases.mjs`  
  → `glossary.json`.
- `courses.json` ↔ toutes les leçons : réciprocité et ordre imposés.
- `parcours.json` → leçons, cours, cas, simulateurs, livrables et jalons.
- `profileParcours.json` ↔ profils et archétypes de `ikigai.json`.
- `caseCorrections.json` → `caseStudies.json` + `deliverables.json`.
- `memos.json` ↔ `antiPortfolio.json`.
- `shared/routes.mjs`  
  → client SEO + collecteur + sitemap + prérendu.
- `shared/base-url.mjs`  
  → Vite + React + sitemap + prérendu + assets.
- `package.json` orchestre les validateurs, tests, générateurs et le prérendu.

---

# 6. Synthèse des risques

## Élevé

1. **Dépendances vulnérables dans le lockfile.**
   - `react-router` et `react-router-dom` 7.16.0 : `package-lock.json:4853-4877`.
   - `postcss` 8.5.15 : `package-lock.json:4540-4545`.
   - `brace-expansion` 5.0.6 et 1.1.15 : `package-lock.json:2333-2335`, `2830-2832`.
   - `npm audit` remonte notamment redirection ouverte, XSS/RSC, déni de service, traversal PostCSS et expansion exponentielle.
   - Plusieurs avis React Router concernent des modes RSC/SSR non employés par cette SPA, mais l’arbre reste officiellement vulnérable et des avis génériques, notamment redirection/DoS, ne peuvent pas être écartés sans analyse de portée séparée.

## Modéré

2. **Publication implicite de nombreuses collections.**  
   Le collecteur applique le filtre fail-closed aux certifications, leçons et articles, mais publie directement parcours, cours, cas, livrables, simulateurs, mémos, anti-portfolio et écosystèmes (`scripts/collect-routes.mjs:82-126`). Ces schémas ne portent généralement pas de statut. Une future entrée inachevée deviendrait donc automatiquement routable et indexable.

3. **Provenance du glossaire déclarative mais peu contraignante.**  
   431 entrées canoniques sont marquées `source-backed`, mais seules 12 exposent `sourceUrls`. Le contrôle n’échoue sur une liste vide que si le champ existe (`scripts/validation-core.mjs:224-234`). L’absence du champ n’est pas considérée comme une erreur.

4. **Divergence entre validateurs de glossaire.**  
   `validate-glossary.mjs` ne charge que `data/lessons.json` (`scripts/validate-glossary.mjs:10-14`) et ignore les 21 leçons drop-in. Le validateur principal connaît bien les 145 leçons. Une référence future du glossaire vers une leçon drop-in pourrait être rejetée par le contrôle spécialisé malgré sa validité globale.

5. **Collecteur de routes fail-soft.**  
   Les fichiers ou dossiers absents deviennent silencieusement des collections vides (`scripts/collect-routes.mjs:23-42`). Le cycle `prebuild` limite ce risque, mais l’exécution autonome du sitemap ou du prérendu peut produire un inventaire incomplet sans signaler la source manquante.

6. **Validateur principal trop concentré.**  
   `validate-content.mjs` réunit schémas et logique métier dans 2 112 lignes. La couverture actuelle est forte, mais certaines règles ne sont testées que par recherche textuelle dans le fichier, ce qui protège le câblage sans exercer la règle de bout en bout.

## Faible ou dette maîtrisée

7. **Six étapes de parcours sont explicitement `a-produire`.**  
   Elles sont autorisées pour des jalons sans ressource existante (`validate-content.mjs:1973-1975`). Il s’agit d’une dette éditoriale assumée, pas d’une incohérence technique.

8. **Synchronisation manuelle des `.d.mts`.**  
   Les quatre surfaces TypeScript reflètent des modules ESM purs. Le typecheck détectera certaines dérives d’usage, mais aucune génération automatique ne garantit leur identité avec les exports runtime.

9. **Génération du glossaire moins défensive que celle des leçons.**  
   `buildLessonArtifacts` refuse un slug dupliqué ; `buildGlossaryArtifacts` écrase silencieusement `defs[term.slug]` (`scripts/generated-content.mjs:50-66`). Le validateur principal empêche actuellement ce cas dans la chaîne normale.

10. **Scripts mutateurs sans contrôle direct dédié.**
    - `merge-aliases.mjs` n’a pas de test propre ;
    - `split-*`, sitemap et prérendu écrivent directement lorsqu’ils sont invoqués ;
    - leur sécurité dépend du respect de la chaîne documentée et du contrôle de fraîcheur.

11. **Frontière publique inhérente au produit statique.**  
    Toutes les collections livrées au navigateur sont accessibles, y compris celles uniquement marquées `noindex`. Ce fonctionnement est documenté, mais exclut toute donnée confidentielle ou personnelle sensible.

## Intégrité de l’intervention

- **Aucun fichier créé, modifié ou supprimé.**
- Les changements Git préexistants sont restés inchangés.
- Aucun blocage rencontré ; seules les commandes susceptibles d’écrire dans le dépôt ont été volontairement exclues.


---

# Arbres externes, builds, caches et méthode exhaustive

## Résultat de l’inventaire physique

Parcours exhaustif en lecture seule, sans suivre les liens symboliques et sans appliquer `.gitignore` :

| Famille | Dossiers | Fichiers | Liens | Octets logiques | Statut |
|---|---:|---:|---:|---:|---|
| `.git/` | 204 | 360 | 0 | 198 992 603 | interne Git |
| Tous les `node_modules/` | 1 477 | 16 250 | 37 | 229 723 093 | ignorés, dépendances et caches |
| `client/dist/` | 714 | 929 | 0 | 76 509 141 | build local ignoré |
| `data/generated/` | 1 | 4 | 0 | 1 496 399 | générés suivis par Git |
| `.claude/` | 4 | 6 | 0 | 14 220 | outillage |
| `.hermes/` | 3 | 20 | 0 | 387 790 | plans/outillage |
| `.specify/` | 9 | 24 | 0 | 129 217 | spécifications |
| Sources, données et autres | 65 | 408 | 0 | 20 338 228 | contenu principal |
| **Total hors racine** | **2 477** | **18 001** | **37** | **527 590 691** | **20 515 entrées** |

Le chiffre annoncé de 18 037 « fichiers » n’est donc pas reproductible tel quel sur cet instantané. En assimilant les 37 liens à des fichiers, on obtient 18 038 entrées non-dossiers. L’ensemble ordonné des chemins inspectés porte l’empreinte :

`SHA-256 2a073ab065f74f5c0642396339938912c5cb9994e209b8189bdaf46bb994a456`

### Générés et caches identifiés

- `client/dist/` : 929 fichiers, dont 707 HTML prérendus ; 76,5 Mo. Ignoré conformément à `.gitignore`.
- `data/generated/` : quatre JSON, 1 496 399 octets, volontairement suivis. `npm run check:generated` est passé : **145 leçons, 118 corps publiés, 419 termes de glossaire**.
- `client/node_modules/.vite/` : 27 fichiers, 7 953 832 octets.
- `client/node_modules/.tmp/` : deux `*.tsbuildinfo`, 158 411 octets.
- `node_modules/.vite/` : un résultat Vitest de 560 octets.
- `node_modules/.vite-temp/` et `client/node_modules/.vite-temp/` : dossiers vides.
- Aucun dossier `coverage/`, journal `*.log`, lien cassé ou type de fichier spécial détecté.
- Les nombreux `dist/`, `build/` et `out/` situés **sous les paquets tiers** sont des payloads publiés par ces paquets, pas des builds locaux du dépôt.

## Taxonomie recommandée

1. **VCS interne** : `.git/{objects,refs,logs,index,hooks,config}`.
2. **Dépendance externe** : tout chemin sous `node_modules/`, avec paquet propriétaire et version du lockfile.
3. **Cache d’outil** : `.vite`, `.tmp`, `*.tsbuildinfo`, résultats de test et répertoires temporaires, même lorsqu’ils sont sous `node_modules/`.
4. **Build local reproductible** : `client/dist/`, HTML prérendus, chunks, médias copiés.
5. **Généré canonique suivi** : `data/generated/`, relié à son générateur et à ses sources.
6. **Source interne** : code, tests, données éditoriales, documentation, configuration et assets.
7. **Outillage/prospective** : `.claude/`, `.hermes/`, `.specify/`, `specs/`.
8. **Résidu système** : `.DS_Store`, fichiers temporaires d’éditeur.
9. **Candidat non classé** : toute entrée sans producteur ou propriétaire identifié ; elle reste dans l’annexe et reçoit un signalement, jamais une exclusion.

La priorité de classification doit être contextuelle : `node_modules/x/dist/` reste un payload tiers ; seul `client/dist/` est le build applicatif.

## Méthode d’annexe exhaustive

Produire **hors du dépôt** un manifeste JSONL ou SQLite avec une ligne par chemin, dossiers compris :

- chemin relatif encodé sans perte ;
- type obtenu par `lstat` : dossier, fichier, lien ou autre ;
- taille logique et allouée, mode, propriétaire, inode, dates en nanosecondes ;
- cible du lien, sans jamais la suivre ;
- SHA-256 du contenu pour les fichiers et empreinte de la liste des enfants pour les dossiers ;
- état `tracked / ignored / untracked / git-internal` ;
- famille taxonomique, propriétaire et producteur ;
- paquet npm le plus proche, nom, version et clé du lockfile ;
- source et commande de génération pour les builds/caches ;
- description normalisée, note et signaux d’anomalie ;
- ligne d’erreur explicite pour toute entrée illisible.

Contrôles de fermeture :

- `lignes du manifeste = dossiers + fichiers + liens + autres` ;
- comparaison séparée avec `git ls-files`, fichiers ignorés et non suivis ;
- aucune liste d’exclusion ni élagage de l’arbre ;
- tri déterministe sur les octets du chemin ;
- empreintes du manifeste et de l’ensemble des chemins ;
- comptage de chaque chemin, mais taille physique unique également calculée par couple `device/inode` ;
- synthèse par famille sans faire disparaître les lignes individuelles.

### Règle de description

Format court et factuel :

> **Nature — propriétaire/origine ; rôle ; producteur ou consommateur ; cycle de vie ; état Git ; preuve ou anomalie.**

Exemples :

- Fichier tiers : « Payload de `lucide-react@…`, installé depuis `package-lock.json`, ignoré et recréable. »
- Objet Git : « Pack d’objets Git ; objets atteignables et non atteignables ; intégrité vérifiée par `git fsck`. »
- Build : « HTML prérendu de route ; produit par `scripts/prerender.mjs` après Vite ; ignoré et remplaçable. »
- Cache : « Cache Vite de pré-bundling ; local, ignoré, supprimable et régénérable. »

Une dépendance tierce reçoit donc une description individuelle structurée, mais pas une pseudo-analyse éditoriale répétée sur 16 250 fichiers.

## Notation sur 100

La note mesure la **maîtrise technique de l’artefact**, pas sa valeur éditoriale :

- **Identité et couverture — 20** : chemin, type, taille et empreinte disponibles.
- **Provenance et propriétaire — 20** : paquet, source ou générateur identifié.
- **Intégrité — 20** : contenu lisible, lien valide, arbre cohérent.
- **Politique et cycle de vie — 20** : suivi/ignore conformes, statut canonique ou jetable explicite.
- **Reproductibilité — 20** : lockfile, commande ou source permettant la reconstruction.

Une preuve absente n’est pas supposée acquise. Les dossiers sont notés selon les mêmes critères à leur propre périmètre, plutôt que par une moyenne dominée par `node_modules`.

Application indicative :

- `data/generated/` : **100/100**, parité vérifiée et contrat explicite.
- `node_modules/` : **95/100**, lockfile présent, `npm ls --all` sans problème, 37 liens valides.
- `client/dist/` : **85/100**, complet, ignoré et reproductible, mais build non réexécuté pendant cet audit.
- caches Vite/TypeScript : **90/100**, bien localisés et ignorés ; deux répertoires temporaires vides.
- `.git/` : **78/100**, structure saine mais historique très volumineux et nombreux objets pendants.

## Anomalies significatives

1. **Historique Git disproportionné.** `.git/objects` occupe 198 870 177 octets. Deux packs représentent 186,65 Mio ; un pack physique atteint 193 651 387 octets. Vingt-cinq blobs historiques sous l’ancien chemin `Supp/` cumulent **169 615 650 octets non compressés**, principalement des PNG de 6 à 10 Mo. Ils expliquent l’essentiel du poids de `.git`.
2. **Objets Git non atteignables.** `git fsck --full` retourne 219 arbres et un commit pendants. L’exécution réussit et ne signale ni corruption ni fichier garbage ; il s’agit d’un résidu de réécriture ou de travaux antérieurs, pas d’une panne.
3. **Résidus macOS jusque dans Git.** `.DS_Store` existe à la racine, dans `docs/`, `.hermes/`, `.git/` et `.git/objects/`. Leur impact est faible, mais ceux de `.git/` ne relèvent pas du mécanisme normal de `.gitignore`.
4. **Instantané de travail non propre.** Quatre fichiers suivis sont déjà modifiés et deux fichiers sont non suivis. L’état est resté identique avant et après l’inspection ; ces changements ne proviennent pas de cet audit.
5. **Aucune anomalie de dépendances confirmée.** `npm ls --all --json` : code 0, 702 occurrences, 440 triplets nom/chemin/version distincts, aucun paquet manquant, invalide ou extraneous.

**Fichiers créés ou modifiés : aucun.** Aucun build, générateur, nettoyage ou installation n’a été lancé.


---

# Annexe CSV exhaustive

Le fichier `inventaire-exhaustif.csv` contient une ligne par entrée physique, racine comprise : chemin, type, famille, état Git, taille, rôle/utilité et note sur 100. Il couvre donc aussi `.git/`, tous les `node_modules/`, `client/dist/`, caches, liens symboliques, métadonnées macOS, sources et documents.
