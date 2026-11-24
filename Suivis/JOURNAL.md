# JOURNAL — vc-platform

Entrées datées, append-only, **postérieures à la migration statique de juillet 2026**. Une entrée = date, objet, commandes lancées, résultats, fichiers touchés. Les compteurs courants ne vivent pas ici mais dans `ETAT.md`.

Le journal des travaux antérieurs à la migration (passes du 2026-05-30 au 2026-06-28 : portail splash, atlas navigable, glossaire, écosystèmes, IA en trois piliers, prérendu statique) reste consultable dans l'historique Git.

---

## 2026-09-02 — Intégration du simulateur de note d’investissement

Objet : inclure le dossier local `nouveau simu` dans le site comme nouveau simulateur, sans ouvrir de backend, de publication distante ni de redesign global.

Travaux :

- copie du bundle autonome `nouveau simu/embed/simulateur-memo.html` vers `client/public/tools/simulateur-memo.html` ; taille vérifiée 994 449 octets, SHA-256 `4acea45edf9c8b8443e95a8be5ffe0e174fed7d9320be508ca8ddb37f7ccab7b` ;
- ajout de la fiche `investment-memo` dans `data/simulators.json` avec le slug public `/simulators/simulateur-note-investissement`, un temps indicatif de 30 minutes, les leçons liées `l-investment-recommendation`, `l-ic-defense`, `l-fact-hypothesis` et les termes de glossaire existants `venture-capital`, `deal-flow`, `term-sheet` ;
- ajout du composant `client/src/components/simulators/investment-memo.tsx`, qui encadre l’outil dans les surfaces, cartes, boutons, textes et contraintes local-first du design system, puis expose l’iframe et un lien pleine page basés sur `publicAssetUrl(...)` pour respecter le `VITE_BASE_URL` ;
- raccordement du composant dans `client/src/components/simulators/index.ts` et couverture DOM dans `client/src/components/simulators/simulators.dom.test.tsx` ;
- régénération du sitemap canonique Pages dormant : `client/public/sitemap.xml` contient désormais `https://iari-ctrl.github.io/vc-plateform/simulators/simulateur-note-investissement`.

Vérifications :

- `npm run test --workspace client -- src/components/simulators/simulators.dom.test.tsx` — exit 0, 1 fichier / 3 tests ;
- `npm run validate:content` — exit 0, 10 simulateurs, structure et références cohérentes ;
- `npm run typecheck` — exit 0 ;
- `npm run lint --workspace client -- src/components/simulators/investment-memo.tsx src/components/simulators/index.ts src/components/simulators/simulators.dom.test.tsx` — exit 0 ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run generate:sitemap` — exit 0, 704 routes ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` — exit 0 ; prérendu strict `716/716`, `ok: true` ;
- `npm run validate:content:strict` — exit 0, contenu strict valide avec 10 simulateurs ;
- preview locale Vite : `client/dist/tools/simulateur-memo.html` répond 200 ; le HTML prérendu de `/simulators/simulateur-note-investissement` contient le titre, l’iframe, le lien pleine page et l’URL `/vc-plateform/tools/simulateur-memo.html`.

Limite : la recette visuelle interactive Chromium n’a pas été exécutée, car aucun Chromium local n’a été trouvé et le harness navigateur disponible demandait Google Chrome. La vérification Chrome n’a pas été poursuivie.

Aucun commit, staging, stash, reset, clean, checkout destructif, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-08-08 — Clôture du fragment Markdown de l’archive Analyst

Objet : corriger le lien interne résiduel de l’archive Analyst sans modifier les autorités maintenues, les données produit, les artefacts générés ni le profil Hermes `default`.

Constat reproduit : `docs/archive/certifications/REFERENTIEL-ANALYST.md:20` pointait vers `ARCHITECTURE-CERTIFICATIONS.md#5-titre-canonique-et-supplement-contextualise`, alors que le titre maintenu `## 5. Titre canonique et supplément contextualisé` conserve les accents dans son ancre Markdown.

Travaux :

- correction séquentielle du fragment vers `#5-titre-canonique-et-supplément-contextualisé` dans `docs/archive/certifications/REFERENTIEL-ANALYST.md` ;
- inspection du seul JSON d’archive identifié, `docs/archive/hermes-plans/2026-07-22_134627-correction-baseline.json` : `_archiveNotice` était déjà présent, donc aucun ajout JSON n’a été nécessaire ;
- aucune modification de mémoire ou de profil `default`, faute de décision explicite demandant cette écriture.

Vérifications : fragments comparés mécaniquement au titre cible, résultat `match=True` ; `_archiveNotice` relu dans le JSON d’archive ; `git diff --check -- docs/archive/certifications/REFERENTIEL-ANALYST.md docs/archive/hermes-plans/2026-07-22_134627-correction-baseline.json` : exit 0. Le build applicatif et les tests npm complets n’ont pas été relancés, la portée étant strictement documentaire et archivistique.

Aucun contenu produit, donnée métier, artefact généré, commit, staging, stash, reset, clean, checkout destructif, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-08-08 — Correction post-contre-revue de l’autorité Venture Philanthropy archivée

Objet : lever la contradiction d’autorité détectée après la clôture provisoire du reclassement documentaire, sans modifier les données, le parcours maintenu ni les autres archives hors périmètre.

Constat reproduit : malgré leurs bannières non normatives, `docs/archive/certifications/venture-philanthropy/README.md` qualifiait encore l’ancien référentiel de « référence maintenue » et demandait d’y reporter les évolutions courantes ; `docs/archive/certifications/REFERENTIEL-VENTURE-PHILANTHROPY.md` conservait une section « Maintenance et sources de vérité » qui se désignait elle-même comme autorité.

Travaux :

- le `README` distingue désormais l’état historique avant déclassement, qualifie l’ancien référentiel de certification d’archive supplantée et reformule ses invariants comme contraintes historiques non applicables aux évolutions courantes ;
- l’ancien référentiel remplace sa section de maintenance par un relevé des anciennes sources de vérité, au passé, et désigne explicitement `docs/parcours/VENTURE-PHILANTHROPIE.md` ainsi que les données exécutables comme autorités courantes ;
- aucune donnée, documentation maintenue du parcours, autre certification ni archive hors Venture Philanthropy n’a été modifiée par cette correction.

Vérifications : 14 liens locaux ciblés résolus ; aucune occurrence résiduelle des formulations contradictoires recherchées dans les deux documents ; diff exact contrôlé depuis des copies `/tmp` des fichiers non suivis ; `git diff --check` global : exit 0. Le fragment sans accents de `docs/archive/certifications/REFERENTIEL-ANALYST.md:20`, révélé par la même contre-revue, reste un défaut distinct et n’a pas été corrigé dans cette passe.

Aucun test applicatif, build, générateur, staging, commit, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-08-08 — Reclassement des pièces jointes, plans et référentiels historiques

Objet : réduire la confusion d’autorité et les lectures accidentelles en retirant du répertoire actif les pièces jointes, plans, prompts, revues et référentiels historiques, sans modifier les sources produit ni supprimer de preuve unique non préservée.

Prévol : racine `/Users/iar-witness/Documents/Projets/VC SITE/vc-platform`, branche `master`, HEAD `24009d4772d1f4a29f484d467f101580cc6d22d8`, worktree sale préexistant. Empreinte normalisée initiale conservée dans `/tmp/vc-platform-doc-cleanup-baseline-1786205734.json`, SHA-256 `6f3482e9b8f8ecd57053519fa60c7adcfaf9ae6c055a8489d0a38fe9289a6552`. Plusieurs processus Claude/Node/Vite étaient ouverts dans le dépôt ; les fichiers candidats ont été hashés avant écriture et aucun changement externe n’a été détecté sur le périmètre entre l’inventaire et les déplacements.

Travaux :

- pièces jointes Hermes : doublon binaire confirmé entre `cartographie-commentee.md` et `cartographie-commentee-2.md` (`4aff5f2145…`) ; conservation d’une seule cartographie sous `docs/archive/repository-inventories/2026-07-25-cartographie-commentee.md`, suppression du doublon et de `inventaire-exhaustif.csv` ;
- plans Hermes : `.hermes/plans/` ne contient plus que `2026-07-23_100955-relecture-praticien-parcours-p0.md` et `2026-07-31_191055-consolidation-formation.md` ; treize plans ou matrices de preuve sont archivés sous `docs/archive/hermes-plans/`, sept plans courts entièrement clos sont supprimés ;
- artefacts racine : `revue-mathematiques-du-vc.md` est archivé sous `docs/archive/reviews/2026-07-24-revue-mathematiques-du-vc.md` ; `PROMPTS-SERIE-A.md` est supprimé comme paquet de prompts exécuté et supplanté ;
- revues : `docs/reviews/2026-07-23-relecture-praticien-parcours.md` reste actif ; la restitution canonique du 24 juillet est `docs/archive/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md`; la version tabulaire du 24 juillet est supprimée ; le plan de remédiation du 26 juillet et le snapshot du 31 juillet sont archivés non normativement ;
- certifications historiques : les deux référentiels supplantés et le dossier `venture-philanthropy/` sont déplacés sous `docs/archive/certifications/`, avec liens relatifs corrigés vers les référentiels maintenus ;
- liens maintenus corrigés dans `docs/parcours/ANALYST-FOUNDATIONS.md`, `docs/parcours/VENTURE-PHILANTHROPIE.md`, `docs/certifications/PROTOCOLE-PRODUCTION-ANALYST.md`, `client/src/content/deeptechIpTransferLearning.test.ts`, `.hermes/plans/2026-07-31_191055-consolidation-formation.md` et `docs/archive/retours-sessions-correction-2026-07-22.md`.

Vérifications :

- inventaire : 3 pièces jointes, 22 fichiers `.hermes/plans/` en comptant le baseline JSON, 2 artefacts racine, 5 revues et 8 documents de certification historiques ; tous les candidats supprimés ou déplacés étaient suivis par Git et présents dans l’historique ;
- contrôle de liens Markdown locaux : exit 0, aucun lien local cassé hors placeholders littéraux documentés ; contrôle des autorités maintenues : 0 référence active vers les anciens chemins supprimés ou déplacés ;
- `git diff --check` sur le périmètre documentaire avant mise à jour des suivis : exit 0.

Résultat physique : environ 3,63 Mio retirés du worktree courant par suppressions nettes. Les tokens indiqués ne sont que des ordres de grandeur de lecture évitable : environ 926 k tokens potentiels retirés physiquement, et `.hermes/plans/` passe d’environ 103 k tokens potentiels à environ 9 k tokens potentiels. Aucun gain fixe de contexte ou de coût n’est revendiqué, car un fichier non lu ne consomme aucun token.

Aucun contenu produit, donnée métier, artefact généré, commit, staging, stash, reset, clean, checkout destructif, push, workflow distant, build complet ou déploiement n’a été exécuté.

---

## 2026-08-08 — Compaction des autorités et du suivi courant

Objet : réduire le contexte documentaire de routine sans perdre les invariants propres au dépôt, les préférences utilisateur, les décisions produit durables ni les preuves historiques.

Matrice d’autorité appliquée : préférences utilisateur conservées dans le profil `vc-platform` ; principes produit et marque visible promus dans `PRODUCT.md` ; charte éditoriale détaillée maintenue dans `docs/ARCHITECTURE_EDITION.md` ; rappel opérationnel condensé dans `CLAUDE.md` ; point d’entrée portable réduit dans `AGENTS.md` ; état courant compacté dans `Suivis/ETAT.md` ; preuves datées conservées dans ce journal ; règles spécialisées gardées dans `.claude/skills/ecosystemes/SKILL.md` ; faits volatils non déplacés vers la mémoire globale.

Travaux :

- `AGENTS.md` ramené au rôle d’entrée portable et de rappel minimal ; `.hermes.md` reste absent.
- `CLAUDE.md` condensé autour des autorités, commandes actuelles, séparation sources/générés, local-first, limites publiques, ontologie, sécurité du worktree et publication dormante.
- `Suivis/ETAT.md` réécrit comme instantané courant : état vérifié, compteurs, risques ouverts, décisions non tranchées, priorités et prochaine session.
- `.claude/skills/ecosystemes/SKILL.md` recentré sur les procédures propres aux dossiers d’écosystème, avec pointeurs vers les autorités transverses.
- `PRODUCT.md` reçoit uniquement les décisions durables encore uniques : marque visible Maison Sapience VC et maintien secondaire de l’espace personnel tant que son socle n’est pas ouvert.
- Profil Hermes dédié `vc-platform` : `MEMORY.md` réduit aux faits encore utiles ; `USER.md` inchangé.

Résultat physique : `AGENTS.md` 1 660 → 911 caractères ; `CLAUDE.md` 23 137 → 11 995 ; `Suivis/ETAT.md` 95 556 → 12 158 ; compétence écosystèmes 9 602 → 6 713 ; `PRODUCT.md` 3 105 → 3 742 ; mémoire profil 1 744 → 185. `Suivis/JOURNAL.md` conserve les entrées historiques et reçoit seulement la présente synthèse.

Vérifications :

- `hermes prompt-size --json` depuis la racine : contexte projet 3 591 o avant, 2 796 o après ; profil courant `default` mesuré avec modèle `gpt-5.6-sol` hérité.
- `hermes --profile vc-platform prompt-size --json` : système 25 465 → 23 108 o, mémoire 2 079 → 517 o, contexte projet 3 957 → 3 162 o, outils 45 941 o inchangés.
- Contrôle mécanique : invariants requis présents, liens Markdown relatifs résolus, aucune référence active à l’intégration retirée dans le lot séparé recréée dans les documents ciblés, aucun motif de secret dans le diff documentaire.
- `npm run check` : exit 0 — générés OK, contenu strict OK, glossaire OK, typecheck OK, lint OK, 69 fichiers / 471 tests Vitest et 59/59 tests Node.
- `git diff --check` final : exit 0.

Aucun commit, staging, stash, reset, clean, checkout destructif, push, workflow distant, build complet ou déploiement n’a été exécuté.

---

## 2026-08-08 — Réalignement du sitemap sur le contrat Pages dormant

Objet : corriger la divergence d'origine de `client/public/sitemap.xml` sans décider d'un nouveau domaine de publication ni modifier le statut local-first du produit.

Contrat retenu :

- `CLAUDE.md` et `README.md` maintiennent la publication en sommeil et décrivent le workflow Pages manuel sans `CNAME` ; sa cible déjà configurée est `https://iari-ctrl.github.io/vc-plateform`, montée sous `/vc-plateform/` ;
- `.github/workflows/deploy-pages.yml` dérive la même paire depuis le propriétaire et le nom du dépôt ; `shared/base-url.mjs` n'invente aucune origine et exige la concordance du chemin ; `scripts/generate-sitemap.mjs` requiert explicitement `VITE_SITE_URL` ;
- cette cible qualifie les artefacts SEO d'un éventuel build manuel futur. Elle ne constitue ni une remise en ligne, ni une décision de domaine personnalisé, ni un changement de stratégie de publication.

Travaux :

- reproduction initiale : le contrôle collecteur–sitemap passe 13 tests sur 14 et échoue sur l'origine `https://iar-witness.github.io`, tandis que le contrat versionné attend `https://iari-ctrl.github.io` ;
- régénération par `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run generate:sitemap` : 703 routes ;
- l'inventaire SHA-256 de tous les fichiers suivis et non suivis non ignorés, pris immédiatement avant et après la commande, ne relève que les deux sorties attendues du générateur : `client/public/sitemap.xml` et `client/public/robots.txt` ; après régénération, ces deux fichiers correspondent de nouveau à leur version canonique dans `HEAD` ;
- aucun fichier de configuration, aucune route et aucun script n'ont été modifiés. Le suivi présent sépare explicitement ce correctif SEO/publication du retrait de Specify / Spec Kit consigné dans l'entrée suivante.

Vérifications :

- contrôle ciblé `node --test --test-concurrency=1 scripts/collect-routes.test.mjs` : GREEN, 14/14 ; les 703 URL portent toutes l'origine `https://iari-ctrl.github.io` et restent sous `/vc-plateform/` ;
- `npm run check:generated` : exit 0, 147 leçons, 126 corps publiés et 420 termes ; `npm run test:node` : exit 0, 59/59 ;
- `npm run check` : exit 0, validation stricte et glossaire valides, typecheck et lint sans erreur, 69 fichiers / 471 tests Vitest et 59 tests Node ;
- build canonique avec les mêmes variables : exit 0 ; le prérendu strict écrit 715/715 artefacts, sans échec de route ou de métadonnée, avec `ok: true` ;
- `git diff --check` final : exit 0. Aucun commit, staging, push, déclenchement de workflow distant ou déploiement n'a été exécuté.

---

## 2026-08-08 — Retrait de l'intégration Specify / Spec Kit

Objet : supprimer du worktree courant l'intégration Specify / Spec Kit et ses artefacts propres, sans perdre le contenu historique utile du diagnostic d'architecture technique et sans modifier le profil Hermes global `default`.

Prévol et inventaire :

- racine vérifiée : `/Users/iar-witness/Documents/Projets/VC SITE/vc-platform` ; branche `master` ; HEAD `24009d4772d1f4a29f484d467f101580cc6d22d8` ; remote `https://github.com/iari-ctrl/vc-plateform.git` ;
- empreinte initiale normalisée enregistrée avant suppression dans `/tmp/vc-platform-speckit-baseline-20260808T125008.json` : 479 fichiers suivis, 7 fichiers non suivis non ignorés, SHA-256 global `277dc0749d304c9e8c3efb34c0d5b43eff5294029a2364206f14a57672f8272c` ; une seconde empreinte courante après migration est conservée dans `/tmp/vc-platform-manifest-current.tsv` ;
- processus concurrents : un serveur Vite (`node .../node_modules/.bin/vite`) était ouvert dans le dépôt ; aucun fichier du périmètre `.specify/`, `specs/`, `docs/SPECKIT.md`, `README.md`, `CLAUDE.md`, `Suivis/ETAT.md` ou `Suivis/JOURNAL.md` n'a changé entre l'empreinte ciblée et la suppression ; le processus n'a pas été arrêté ;
- recherche initiale, casse ignorée, sur fichiers suivis et non suivis non ignorés, hors dépendances/builds/caches : références actives dans `.specify/`, `specs/`, `docs/SPECKIT.md`, `README.md`, `CLAUDE.md` et `Suivis/ETAT.md`; références historiques ou archivées dans `Suivis/JOURNAL.md`, `.hermes/desktop-attachments/`, `.hermes/plans/` ; aucune référence active trouvée dans `package.json`, `.claude/settings*.json`, `.claude/hooks/`, `.github/workflows/` ou `scripts/` ;
- `specs/` ne contenait que `specs/README.md` et `specs/001-diagnostic-architecture-technique/**` ; `tasks.md` contenait 26 tâches cochées et 0 tâche ouverte.

Travaux :

- migration du contenu durable de `specs/001-diagnostic-architecture-technique/research.md` vers `docs/archive/audits/2026-08-03-diagnostic-architecture-technique.md`, avec bannière historique non normative, limites de snapshot, synthèse des constats durables, registre compact des risques et SHA-256 de la source `edc45b69125d5ee031567e0e38a292f0129a0ab022327014305468d1c37d615a` ;
- suppression de `docs/SPECKIT.md` ;
- suppression intégrale de `.specify/` : `.specify/feature.json`, `.specify/init-options.json`, `.specify/integration.json`, `.specify/integrations/hermes-skill-contract.md`, `.specify/integrations/hermes.manifest.json`, `.specify/integrations/speckit.manifest.json`, `.specify/memory/.constitution-template.json`, `.specify/memory/constitution.md`, `.specify/memory/project-context.md`, `.specify/scripts/bash/check-prerequisites.sh`, `.specify/scripts/bash/common.sh`, `.specify/scripts/bash/create-new-feature.sh`, `.specify/scripts/bash/select-feature.sh`, `.specify/scripts/bash/setup-plan.sh`, `.specify/scripts/bash/setup-tasks.sh`, `.specify/templates/checklist-template.md`, `.specify/templates/constitution-template.md`, `.specify/templates/overrides/plan-template.md`, `.specify/templates/overrides/spec-template.md`, `.specify/templates/overrides/tasks-template.md`, `.specify/templates/plan-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `.specify/workflows/speckit/workflow.yml`, `.specify/workflows/workflow-registry.json` ;
- suppression intégrale de `specs/` : `specs/README.md`, `specs/001-diagnostic-architecture-technique/checklists/requirements.md`, `specs/001-diagnostic-architecture-technique/contracts/diagnostic-report.md`, `specs/001-diagnostic-architecture-technique/data-model.md`, `specs/001-diagnostic-architecture-technique/plan.md`, `specs/001-diagnostic-architecture-technique/quickstart.md`, `specs/001-diagnostic-architecture-technique/research.md`, `specs/001-diagnostic-architecture-technique/spec.md`, `specs/001-diagnostic-architecture-technique/tasks.md` ;
- retrait des références actives dans `README.md` et `CLAUDE.md` ; `AGENTS.md`, `PRODUCT.md`, `.github/workflows/`, `.claude/settings*.json`, `.claude/hooks/` et `package.json` ne portaient pas de référence active à retirer ;
- mise à jour de `Suivis/ETAT.md` pour retirer Specify / Spec Kit de l'état courant et rétablir le processus local simple : autorités maintenues, état courant, journal append-only et plans locaux bornés si nécessaire.

Profil Hermes du projet :

- le profil dédié `vc-platform` existe ; seules ses configurations ont été modifiées ;
- compétences désactivées dans ce profil : `brownfield-spec-kit`, `speckit-analyze`, `speckit-checklist`, `speckit-clarify`, `speckit-constitution`, `speckit-converge`, `speckit-implement`, `speckit-plan`, `speckit-specify`, `speckit-tasks`, `speckit-taskstoissues` ;
- vérification : `hermes --profile vc-platform skills list --enabled-only` ne retourne aucune ligne `speckit` ni `brownfield-spec-kit` ; `hermes --profile vc-platform prompt-size --json` retourne `skills_index.bytes = 3273` et aucune entrée `speckit` / `brownfield-spec-kit` dans `skills_breakdown` ;
- le profil `default` n'a pas été modifié : SHA-256 de `/Users/iar-witness/.hermes/config.yaml` inchangé à `fac925ca2bc97d4355177f5f5bbcdb371eeec52991eb4982522ce836eae70fcb` ; aucune compétence globale n'a été désinstallée.

Recherches finales et liens :

- existence : `.specify/ = absent`, `specs/ = absent`, `docs/SPECKIT.md = absent` ;
- occurrences actives finales sur fichiers suivis et non suivis non ignorés, hors `.git`, dépendances, builds et caches : 0 fichier, 0 occurrence ;
- liens ou chemins actifs vers `docs/SPECKIT.md`, `.specify`, `specs/` ou `specs/001-diagnostic-architecture-technique` : 0 ;
- mentions historiques conservées : `Suivis/JOURNAL.md` (entrée append-only du 2026-07-24), `.hermes/desktop-attachments/cartographie-commentee*.md`, `.hermes/desktop-attachments/inventaire-exhaustif.csv`, `.hermes/plans/2026-07-25_220016-p-serie-a-finalisation-baseline.md` et `docs/archive/audits/2026-08-03-diagnostic-architecture-technique.md`. Elles sont conservées parce qu'elles documentent des snapshots ou archives non normatifs, non le workflow courant.

Vérifications :

- `npm run check` : exit 1 ; les sous-commandes `check:generated`, `validate:content:strict`, `validate:glossary`, `typecheck`, `lint` et les tests Vitest passent. Détails : `Generated content check: OK (147 lessons, 126 published bodies, 420 glossary terms)`, validation stricte OK, glossaire OK, 69 fichiers / 471 tests Vitest réussis. La suite Node passe 58/59 tests puis échoue sur le défaut préexistant de `scripts/collect-routes.test.mjs:173` : `client/public/sitemap.xml` porte `https://iar-witness.github.io` alors que le test attend `https://iari-ctrl.github.io` ; cet écart était déjà consigné hors périmètre dans l'état du 2026-08-08 ;
- inspection du diff : 35 suppressions ciblées pour l'infrastructure et les artefacts Specify / Spec Kit, modifications bornées de `README.md`, `CLAUDE.md`, `Suivis/ETAT.md`, ajout de l'archive historique ; les autres fichiers déjà modifiés ou non suivis du worktree sont préservés hors périmètre ;
- `git diff --check` final après écriture de la présente entrée : exit 0, aucune sortie.

Aucun commit, staging, stash, reset, clean, checkout destructif, push, workflow distant ou déploiement n'a été exécuté.

---

## 2026-08-08 — Profil Hermes dédié `vc-platform`

Objet : isoler un profil Hermes pour le développement local du dépôt et réduire son coût fixe sans modifier le profil `default`.

Travaux : création du profil `vc-platform` par clonage supporté depuis `default`, sans le rendre globalement actif ; définition de `terminal.cwd` sur `/Users/iar-witness/Documents/Projets/VC SITE/vc-platform` ; réglage de l’effort sur `high` ; activation de `agent.coding_context: focus` ; désactivation locale de `tts` et `cronjob` ; retrait local du MCP `chrome-devtools`. Le changement manuel de lot règle ensuite le modèle du profil sur `gpt-5.5`, avec effort maintenu à `high`. La sélection des compétences est locale au profil : 44 compétences de développement, revue, debugging, intégrité éditoriale, persistance locale, QA DOM, analyse d’interface, recherche sourcée, Git local et administration Hermes restent activées ; 59 compétences hors projet sont désactivées, sans désinstallation du profil `default`.

Vérifications : `hermes profile list`, `hermes profile create --help`, `hermes tools --help`, `hermes skills config --help`, `hermes mcp --help`, `hermes config set --help`, `hermes tools list`, `hermes mcp list`, `hermes skills list`, `hermes memory status`, `hermes prompt-size`, puis une session neuve `hermes --profile vc-platform --reasoning high chat -q ...` ont été exécutés. Après le changement manuel de modèle, les commandes `hermes --profile vc-platform config get model`, `hermes --profile vc-platform config get agent.reasoning_effort`, `hermes --profile vc-platform config get terminal.cwd`, `hermes config get model`, `hermes config get agent.reasoning_effort`, `TERMINAL_CWD=/Users/iar-witness/Documents/Projets/VC SITE/vc-platform hermes --profile vc-platform prompt-size` et `git status --porcelain=v2 -z | shasum -a 256` confirment `vc-platform = gpt-5.5`, effort `high`, cwd racine du dépôt, profil `default` inchangé (`gpt-5.6-sol`, effort `ultra`) et empreinte Git stable. Le diagnostic confirme le cwd et la racine Git attendus, la lecture fichier, le navigateur natif, la vision après rasterisation, la délégation, l’absence de `cronjob`, `text_to_speech` et MCP Chrome DevTools, ainsi que l’absence d’instructions injectées depuis `~/.codex`, `~/.claude` ou le dépôt Hermes. Mesure fixe : `default` 32 934 o système + 55 072 o outils = 88 006 o estimés ; `vc-platform` 26 482 o système + 45 941 o outils = 72 423 o estimés. L’avertissement CLI indiquant que `agent.reasoning_effort` n’est pas une clé reconnue est classé non bloquant : la valeur est bien relue à `high` et le diagnostic explicite a été lancé avec `--reasoning high`. Les empreintes du profil `default` (`config.yaml`, `.env`, `SOUL.md`, mémoires et compétences) sont inchangées. Le statut Git normalisé du dépôt est resté stable jusqu’à la clôture documentaire. Le Lot 1 est clos sans point bloquant résiduel.

Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

## 2026-08-08 — Nettoyage concis du hero `/home`

Objet : retirer du hero d’accueil les éléments décoratifs ou discursifs non nécessaires pour une cible d’investisseurs pressés : halo autour de la boussole, animation associée et citation ikigai.

Travaux :

- `HomePage.tsx` : suppression du span `.home-hero-halo`, de la constante `HERO_INTENT_NOTE`, de l’import `Fleuron` devenu inutile et de la section « Note d’intention » sous le pont éditorial. La boussole `home-compass` reste rendue et non cliquable.
- `home-hero.css` : retrait des styles du halo, de la variante sombre, des keyframes `home-hero-bleed` / `home-hero-breathe`, et des références au halo dans la pause hors viewport et le contrat `prefers-reduced-motion`.
- `homeExperience.dom.test.tsx` : le contrat `/home` interdit désormais la citation ikigai et le halo tout en conservant la boussole et les deux sections restantes du `main`.

Vérifications :

- RED ciblé : `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` échoue d’abord avec 2 tests en échec, sur la citation encore présente et le span `.home-hero-halo` encore rendu.
- GREEN ciblé : même commande, exit 0, 30/30 tests.
- `npm run typecheck` : exit 0. `npm run lint` : exit 0.
- `npm run test` : Vitest client vert, 69 fichiers / 471 tests ; suite Node bloquée hors périmètre, 58/59 tests, sur `collect-routes.test.mjs:178` qui attend `https://iari-ctrl.github.io` alors que le `client/public/sitemap.xml` déjà modifié dans le worktree porte `https://iar-witness.github.io`.
- Recette Vite Dev sur `http://127.0.0.1:5173/home` : boussole présente, aucun `.home-hero-halo`, aucune citation ikigai, aucune « Note d’intention », 2 sections dans `main`, `scrollWidth === clientWidth` (1269/1269), console vide. Le serveur Vite Dev a été arrêté.

Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

## 2026-08-07 — `/parcours` distillé : une destination, un niveau, une action

Objet : la page proposait deux navigations concurrentes des mêmes 24 parcours et l'écrivait elle-même (« Le catalogue ci-dessous mène aux mêmes parcours, sans la carte »), six accordéons dont l'état n'était ni partageable ni conservé, et masquait les faits qui décident du choix. La famille seule est un axe faible : le rayon `maitriser` contenait un explicatif de 45 min et un socle de 35 h. Anatomie et sort de la carte arbitrés avec l'utilisateur (rangées denses ; carte montée à la demande ; curation `roadmap` conservée).

Travaux :

- **Trois zones au lieu de cinq blocs.** Une zone « où en suis-je ? » à trois états exclusifs (reprise, recommandation, test d'orientation) remplace l'ancien bandeau *et* le bandeau d'appel de pied de page. Deux filtres synchronisés à l'URL (`?family=`, `?budget=`). Une liste de rangées groupées par destination sous un simple filet.
- **Suppressions** : les six accordéons et leur plomberie `inert`/aria, le paragraphe explicatif de la carte, l'ancre `#familles` et son bouton, le bandeau CTA final, le compteur « 24 parcours · 6 familles », la seconde instance de `CompassRose` (paire `hidden`/`sm:block` que le §11 du design system interdit explicitement), la variante `catalogue` de `ParcoursCard` et `parcoursByFamily`, devenue morte.
- **Un seul calcul de progression.** `client/src/lib/parcoursResume.ts` applique `buildParcoursProgressSummary` au catalogue en une passe mémoïsée et en tire la règle de reprise, à la place des trois ratios « leçons lues » concurrents. La récence est calculable via `LearningWorkspaceState` (`activities[].parcoursId`, `productions[].updatedAt`) et sert de couche intermédiaire entre le parcours déclaré du profil et le plus avancé.
- **Filtrage et tri** dans `client/src/lib/parcoursIndex.ts`, logique pure. Le tri conserve `roadmap` en clé primaire, départagée par `requiredMinutes` puis `slug` — l'ancien tri n'avait aucun départage malgré sa docstring. Le tri par minutes vit hors de `content/parcours.ts` : `content/learningTime.ts` en importe déjà `resolveStep`, l'import inverse fermerait un cycle.
- **Continuité du niveau.** Un niveau explicitement choisi suit le lecteur dans chaque lien de rangée, et `ParcoursDetailPage` l'utilise déjà comme curseur d'étapes. Le défaut implicite n'est jamais propagé, faute de quoi il écraserait le budget du profil.
- **`PathAtlas` chargé à la demande** : `import()` manuel (et non `React.lazy`, qui imposerait une frame de repli au démarrage de l'enveloppe), préchargé au survol et au focus, monté replié puis basculé à la frame suivante pour préserver le recul de la planche, et jamais démonté ensuite. Affordance devenue un bouton libellé. La carte sort du chunk de la page : `PathAtlas` pèse désormais 27,4 ko + 1,6 ko de CSS à part, `ParcoursPage` tombe à 12,3 ko. Le HTML prérendu de `/parcours` ne contient plus aucun nœud de la carte.
- **Corrections** : la page n'avait pas de `<h1>` ; la ligne « Jalon » était conditionnée à la présence d'une *étape* `milestone` alors que 14 parcours en déclarent un sans étape — la rangée lit désormais l'objet `milestone` (20 parcours signalés au lieu de 10) et ne montre un *état* que là où une production est traçable ; le couple `inert` + `aria-hidden`, interdit par le §12, est ramené à `inert` seul.
- Documentation alignée dans la même livraison : `docs/DESIGN_SYSTEM.md` (§6 cartes, §6 progression, §8 carte, §11 rose, §14 dette des filtres), `docs/ARCHITECTURE_EDITION.md:170` (qui décrivait encore l'accordéon), en-tête de `client/src/styles/parcours-atlas.css`.

Vérifications :

- `npm run typecheck` : exit 0. `npm run lint` : exit 0.
- `npm run test --workspace client` : exit 0, 69 fichiers / 471 tests, dont 27 nouveaux sur `parcoursIndex` et `parcoursResume`. `PathAtlas.dom.test.tsx` inchangé et vert — il monte le composant directement, jamais la page.
- `npm run check` : un échec, **préexistant et hors périmètre** — `collect-routes.test.mjs:178` attend l'origine `https://iari-ctrl.github.io` alors que le `client/public/sitemap.xml` du worktree a été régénéré avant cette session avec `https://iar-witness.github.io`. Fichier non touché ici.
- `npm run build` + prérendu strict : `{"expected":715,"attempted":715,"written":715,"routeFailures":[],"metadataFailures":[],"issues":[],"ok":true}`.
- Passe navigateur (Chrome DevTools), clair et sombre, large et étroit : les trois états de la zone haute (froid, recommandé, reprise à « 3/7 étapes » avec l'étape nommée) ; chemin de clic des filtres — « Réussir un entretien » écrit `?family=entretien` (4 parcours, un seul rayon), « Essentiel » ajoute `&budget=low` (1 parcours), « Complet » **supprime** le paramètre en conservant `aria-pressed="true"`, et le retour arrière restaure le réglage précédent ; `?family=grade&budget=low` rend l'état vide et sa réinitialisation ; ouverture de la carte. Recul de la planche mesuré au style calculé : 2,2 → 1,69 → 1,15 → 1,03 → 1,0 sur les 420 ms prévus. Ordre de tabulation : bouton carte → CTA de reprise → 7 pilules destination → 3 pilules niveau → une seule halte par rangée. Aucun débordement horizontal.
- Morph et continuité du niveau vérifiés de bout en bout : depuis `?budget=low`, un clic sur une rangée atterrit sur `/parcours/le-vc-sans-bullshit?budget=low` avec le curseur d'étapes du détail déjà sur « Essentiel », et **exactement un** élément portant un `view-transition-name` au départ comme à l'arrivée — y compris dans le cas de collision où la zone de reprise affiche le même parcours que la rangée cliquée.

Un défaut trouvé et corrigé pendant cette passe : `openParcours` reconstruisait `/parcours/${slug}` et ignorait le `href`, ce qui annulait la propagation du niveau sur le chemin de clic principal (elle ne survivait qu'aux clics modifiés). `useParcoursMorph` accepte désormais une destination optionnelle ; le site d'appel de `PathAtlas` est inchangé.

Restent ouverts, signalés et non traités : le même défaut de jalon subsiste dans la variante `recommendation` de `ParcoursCard` (toucherait le tableau de bord et le résultat de profil) ; `venture-philanthropy-foundations` déclare `low` dans son `timeFit` pour 2 120 min, seul enregistrement `low` au-dessus de 240 min ; `p.time.sessions` contredit la durée calculée sur les parcours `derived` (9 séances pour 13 min), d'où l'affichage du nombre d'étapes à sa place ; la pilule de filtre reste dupliquée en ligne dans une dizaine de fichiers.

---

## 2026-08-06 — La planche des parcours s'encre à l'ouverture

Objet : donner à `/parcours` un moment d'entrée écrit sans toucher à ses décisions produit. La carte reste repliée par défaut — le catalogue mène aux mêmes parcours sans elle — mais son ouverture devient un geste, et ouvrir un parcours emporte son sceau jusqu'à l'en-tête de la fiche. Direction retenue avec l'utilisateur parmi trois : « la planche s'encre », contre un cadran de filtrage (qui aurait ajouté un contrôle produit inexistant) et une amplification du survol des cartes.

Travaux :

- Nouveau `client/src/styles/parcours-atlas.css`. À partir de `--atlas-t0` (400 ms, le panneau ayant atteint sa hauteur vers 190 ms et la planche fini de reculer vers 420 ms) : un front d'encre s'élargit depuis la barre pendant 950 ms, précédé d'une ligne humide dorée qui s'efface en arrivant ; la rose des vents éclot au centre ; les 24 sceaux se tamponnent avec 30 ms d'écart, ordonnés par distance à la barre, donc du cœur vers le large ; le cartouche sèche ; les léviathans diffusent en dernier. Même contrat que `home-hero.css` : chaque animation part d'un `from` et remplit en `both`, l'état au repos est l'état final.
- `PathAtlas.tsx` : masque de luminance à bord fondu porté par les `<defs>` — le graticule est pointillé, un tracé élément par élément l'aurait rendu plein — et rang d'encrage `--ink-i` par port. La classe d'état `atlas-ink` est portée par le `<svg>` et non par le groupe pan/zoom, faute de quoi le masque, qui vit dans les `<defs>`, n'était jamais atteint. La transition du groupe pan/zoom passe de 800 à 420 ms pour que le recul de la planche précède l'encrage au lieu de le concurrencer ; l'enveloppe `max-height` passe de 800 à 560 ms ici et dans `ParcoursPage`.
- Nouveau `client/src/lib/parcoursMorph.ts` : `useParcoursMorph` pilote `document.startViewTransition` à la main. L'application tourne sur `BrowserRouter` ; l'option `viewTransition` de React Router, qui exige un routeur de données, n'y déclenche rien — vérifié, l'API n'était jamais appelée. Seul l'élément activé porte un `view-transition-name`, un même nom présent deux fois annulant la transition. Sans l'API ou en mouvement réduit, navigation ordinaire.
- `cards.tsx`, `Ornaments.tsx`, `ParcoursDetailPage.tsx` : la carte du catalogue prend en charge le clic gauche simple (les clics modifiés restent au navigateur) et son sceau rejoint celui de l'en-tête de destination. Règles `::view-transition-*` ajoutées à `global.css`, avec coupure explicite en mouvement réduit — ces pseudo-éléments échappent à la règle `*` de `tokens.css`.
- Depuis la carte, un port SVG n'est pas capturable par l'API — Chrome ne crée aucun groupe nommé pour un élément SVG, constaté sur la liste des pseudo-éléments. Le sceau est donc confié le temps de la transition à un calque simple posé exactement sur lui et monté en portail sur `body`, le sceau dessiné s'effaçant.

Vérifications :

- `npm run typecheck` : exit 0. `npm run lint` : exit 0.
- `npm run check` : 67 fichiers / 444 tests client verts ; **1 test node en échec**, `collect-routes` « the committed sitemap XML contains exactly the collected routes ». Hors périmètre : `client/public/sitemap.xml` et `client/public/robots.txt` ont été régénérés dans le worktree avec l'origine de cette machine (`https://iar-witness.github.io/vc-platform`) alors que le test épingle l'origine committée (`https://iari-ctrl.github.io/vc-plateform`, coquille comprise). Aucun de ces fichiers n'appartient à cette passe ; ils sont laissés en l'état.
- `VITE_BASE_URL=/vc-platform/ VITE_SITE_URL=https://iar-witness.github.io/vc-platform npm run build` : exit 0, prérendu strict `{"expected":715,"attempted":715,"written":715,"routeFailures":[],"metadataFailures":[],"issues":[],"ok":true}`. Cette exécution reprend la preuve laissée ouverte par l'entrée précédente, dont le build échouait sur `PathAtlas.tsx` en cours de modification.
- Puppeteer, clair et sombre, 1440 × 1000 et 390 × 844 : séquence gelée image par image via l'API Web Animations. Trois défauts corrigés en un lot après la première ronde — le front n'était pas animé (sélecteur hors portée), sa courbe était mal formée (second point de contrôle en retrait, arrivée au bord en 160 ms au lieu de 950), et la cascade des sceaux sur l'amorti exponentiel de la maison se lisait comme une apparition simultanée. Mouvement réduit simulé : front au repos, ligne humide invisible, 24 sceaux et cartouche opaques dès l'ouverture. Aucune erreur console sur les quatre passes.
- Passe finale : replier puis rouvrir rejoue bien la séquence (classe `atlas-ink` retirée au repli, front revenu à 56 px à 520 ms de la seconde ouverture) ; après encrage, le survol reprend la main sur l'opacité laissée par `fill-mode: both` (port survolé à 1,00, voisin atténué à 0,26, relations montées). Une correction : le calque volant mesurait le cercle de découpe du parchemin (53 px) et non le sceau (39 px), soit un décollage 36 % trop grand — un marqueur `data-port-seal` cible désormais le bon cercle.

Signalé, non corrigé, hors périmètre : au repos, les sceaux des ports recouvrent partiellement les noms de territoires de la carte (« Mare Analytica », « Haute Citadelle », « Terra Prima » tronqués), état antérieur à cette passe.

---

## 2026-08-06 — Le hero de `/home` s'encre au lieu d'apparaître

Objet : donner au hero de l'accueil un moment d'entrée écrit plutôt qu'un fondu-montée générique, sans sortir du langage cartographique ni de l'enveloppe temporelle de la séquence d'entrée. Direction retenue avec l'utilisateur parmi quatre : « la carte s'encre », CSS pur, boussole réveillée après le tracé, enveloppe d'entrée inchangée.

Travaux :

- Nouveau `client/src/styles/home-hero.css` : la rose des vents se trace (bezel, graduations, branches, lettres cardinales), les deux lignes du titre sont écrites sous un masque de plume qui balaie de gauche à droite — encre floue qui se fixe —, la légende se pose. Séquence de ~940 ms depuis `--home-hero-t0`, donc close avant le démontage du rideau (3 900 ms). L'ancien `.home-intro-hero` / `home-intro-hero-in` est retiré de `home-intro.css`.
- `HomePage.tsx` : le hero possède désormais sa propre révélation sur les deux chemins d'arrivée (`--home-hero-t0` = 0 en navigation interne, reliquat de `HOME_INTRO_HERO_DELAY` depuis le portail) ; `Reveal` n'y sert plus. Un `IntersectionObserver` publie `data-home-hero-live` et met en pause les trois boucles d'ambiance (aiguille, halo, ciel) hors champ.
- `Illustrations.tsx` : `CompassRose` expose des points d'accroche inertes (`compass-ring`, `compass-tick`, `compass-points`, `compass-points-minor`, `compass-letters`, `compass-pin`) et `pathLength="1"` sur cercles et graduations, sans changer son rendu sur les quatre autres pages qui l'utilisent.
- Deux corrections issues de la vérification navigateur : le halo de contours (`.contour-field`) se noyait sous la trame `map-paper` en clair et concurrençait le bezel en sombre — remplacé par une nappe dorée ; et le masque du titre n'exploitait que 59 % de sa course, ce qui jouait le balayage en ~140 ms et le faisait lire comme un flash — géométrie recalculée (`mask-size: 1/a`) et courbe de plume moins exponentielle.
- Le hero ne monte plus qu'une rose, redimensionnée en CSS : les deux instances `hidden`/`sm:block` rejouaient leur tracé au franchissement du point de rupture, avec 2,6 s d'absence sur le chemin rideau.
- `docs/DESIGN_SYSTEM.md` §11 : liste des animations mise à jour et section « Hero de `/home` » ajoutée.

Vérifications :

- `npm run typecheck` : exit 0.
- `npm run test --workspace client -- homeExperience.dom.test.tsx homeIntro.dom.test.tsx` : exit 0, 2 fichiers / 35 tests.
- `npm run check` : exit 0 — contenu strict valide, lint 0 erreur, 67 fichiers / 444 tests client, 59 tests node.
- `VITE_BASE_URL=/vc-platform/ VITE_SITE_URL=https://iar-witness.github.io/vc-platform npm run build` : exit 0, prérendu strict `{"expected":715,"attempted":715,"written":715,"routeFailures":[],"metadataFailures":[],"issues":[],"ok":true}`. Cette preuve porte sur l'état gelé contenant toute la passe **sauf** l'ajout final d'`animation-fill-mode: backwards` sur l'aiguille (une ligne CSS, hors périmètre de `tsc`, d'ESLint et des tests DOM, vérifiée en navigateur : la transformation pendant le délai est identique au premier frame de la boucle).
- Le build relancé après cette ligne échoue sur `client/src/components/explore/PathAtlas.tsx` (`Port` sans `inkRank`), fichier non touché par cette passe et modifié en parallèle dans le worktree pendant la session. Défaut hors périmètre, signalé et non corrigé ; la preuve de prérendu devra être reprise sur un état gelé une fois ce travail terminé.
- Chrome DevTools, clair et sombre, 1440 × 1000 et 390 × 844 : séquence scrubée image par image, aucun débordement horizontal, boucles d'ambiance effectivement en pause hors champ. Mouvement réduit simulé : l'état au repos est identique à l'état final, aucun contenu masqué. Le HTML prérendu de `/home` porte `--home-hero-t0: 0ms` et le titre en clair.

---

## 2026-08-06 — Passe de clarté rédactionnelle sur `/parcours`

Objet : lever les ambiguïtés de libellés du catalogue des parcours et unifier la forme d'adresse de la surface. Décision utilisateur : `/parcours` passe au **vouvoiement** (la page tutoyait, la carte vouvoyait) ; les 24 `hook` de `data/parcours.json` restent au tutoiement, écart assumé et non traité dans cette passe.

Travaux :

- `ParcoursPage.tsx` : eyebrow, titre, description, bannière « Votre parcours », encart d'orientation et `usePageMeta` passés au vouvoiement. La description remplace la double métaphore (« colonne vertébrale, pas un couloir », « le temps n'est qu'un curseur ») par l'énoncé factuel du mécanisme, à longueur constante.
- Déduplication des consignes de la carte : le paragraphe d'introduction ne répète plus les instructions d'interaction, désormais portées par la seule légende de `PathAtlas` ; la mention « navigation libre », énoncée trois fois sur la page, ne l'est plus qu'une.
- États rendus exacts : la bannière affiche « Reprendre » quand une leçon du parcours recommandé est déjà déclarée lue (même règle que `ParcoursCard`, qui l'appliquait déjà) ; le `<title>` SVG de la carte annonçait « cliquez une terre », affordance inexistante — seuls les sceaux sont activables.
- Libellés opaques : « Phare » → « Parcours phare » ; « Les deux sièges » / « Les deux sièges de la table » unifiés en « Fondateur & investisseur » (carte et page de détail) ; durée nue « ≈ 4 h » → « ≈ 4 h au total » ; nom accessible de l'anneau de progression aligné sur le texte visible.
- Registre : `FAMILY_META` purgé de « sans bullshit », « bingeable », « zéro engagement » et des taglines non descriptives (`maitriser`, `express`).
- `data/profileParcours.json` : cadence `high` « Immersion, tout débloqué » → « Immersion, toutes les étapes incluses ». La formule impliquait un verrouillage de contenu que le produit n'applique pas (PRODUCT.md, principe 2) ; le mécanisme filtre des étapes, il n'en déverrouille aucune.
- « Rétracter la carte » → « Masquer la carte » ; « Voir les familles » → « Voir tous les parcours » (avec flèche descendante, la cible étant une ancre en bas de page) ; « Passer le test » → « Passer le test d'orientation » (aligné sur `IkigaiPage`) ; « Flâner dans la bibliothèque » → « Explorer la bibliothèque ».

Vérifications :

- `npm run validate:content` — exit 0, 24 parcours, 373 marqueurs analysés ;
- `npm run typecheck` — exit 0 ;
- `npm run lint` — exit 0 ;
- `npm run test` — exit 0, 67 fichiers / 444 tests client et 59 tests Node ;
- passe navigateur locale (Chrome DevTools) en 1440×1000 et 390×844 : en-tête, carte dépliée et repliée, famille « Lever des fonds », encart d'orientation ; aucun débordement horizontal en 390 px.

Portée collatérale : `cards.tsx` étant partagé, les libellés « Parcours phare », « Fondateur & investisseur », la durée « au total » et le nom accessible de l'anneau valent aussi pour `/dashboard` et la page de résultat de profil.

## 2026-08-04 — Chargement différé des définitions du glossaire

Objet : empêcher une simple visite de `/glossary` de télécharger immédiatement `data/generated/glossary.defs.json`; charger les définitions au premier slug actif ou au premier dépliage d’entrée.

Travaux :

- l’état des définitions démarre en `idle` au lieu de `loading` ;
- `loadGlossaryDefs()` ne s’exécute plus tant qu’aucune entrée détaillée n’est requise ;
- un slug actif (`?term=` ou route de détail) ou un dépliage manuel déclenche le chargement ;
- le cache local des définitions et la reprise après erreur par `Réessayer` sont conservés.

Contrat RED–GREEN :

- le test DOM ciblé rend `/glossary` sans `?term`, exige que l’entrée visible soit présente et que `loadGlossaryDefs` n’ait pas été appelé, puis ouvre l’entrée et attend la définition chargée ;
- premier lancement ciblé : `npm run test --workspace client -- src/pages/glossary/GlossaryPage.lazy.dom.test.tsx -t "simple visite"` échoue sur l’ancien appel immédiat à `loadGlossaryDefs` ;
- après correction, le ciblé passe ; le test de reprise après erreur sur slug actif passe aussi.

Vérifications finales :

- `npm run test --workspace client -- src/pages/glossary/GlossaryPage.lazy.dom.test.tsx` — exit 0, 9/9 ;
- `npm run typecheck --workspace client` — exit 0 ;
- `npm run lint --workspace client` — exit 0 ;
- recette Vite Dev sur `http://127.0.0.1:5173/glossary` : au chargement initial, aucune requête fetch de `glossary.defs.json` n’est émise ; seule la résolution d’URL Vite `glossary.defs.json?import&url` est présente ;
- après ouverture de l’entrée `a16z`, une nouvelle requête `glossary.defs.json` apparaît, la définition se rend, `scrollWidth === clientWidth` et la console ne contient ni erreur ni avertissement ;
- le serveur Vite Dev ouvert sur 5173 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/pages/glossary/GlossaryPage.tsx`, `client/src/pages/glossary/GlossaryPage.lazy.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-04 — Animation continue et note longue sur l’accueil

Objet : appliquer la confirmation produit sur `/home` après le recentrage éditorial : restaurer l’animation continue sans délai des carrés d’arche, remettre l’ancienne note d’intention longue, et retirer seulement le cercle visuel du bouton clair/sombre sans changer sa position ni son accessibilité.

Travaux :

- `AnimatedMarker` conserve les chemins et origines existants mais repasse `animateMotion` et `animateTransform` en `repeatCount="indefinite"` ;
- les animations restent synchronisées à `begin="0s"`, sans réintroduire le départ différé à `1s` ;
- les animations continues ne portent plus `fill="freeze"` ;
- la note d’intention longue précédente est restaurée dans la section dédiée sous le hero ;
- le bouton de thème conserve son bouton fixe 44 × 44, son `aria-label` dynamique et ses positions mobile/desktop, tandis que l’enveloppe de l’icône perd le cercle, la bordure, le fond translucide et le blur.

Contrat RED–GREEN :

- le test DOM ciblé exige désormais la note longue exacte, 8 `animateMotion[repeatCount="indefinite"]`, 8 `animateTransform[repeatCount="indefinite"]`, aucun `animateMotion[begin="1s"]`, aucun `fill="freeze"` sur les motions, et l’absence des classes de cercle/bordure/fond/blur sur l’enveloppe de l’icône du toggle ;
- premier lancement ciblé : `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx -t "fait démarrer simultanément|place le changement|conserve la copie"` échoue sur l’ancienne note condensée, les animations finies et le cercle du toggle ;
- après correction, le même filtre passe, puis le fichier complet passe 30/30.

Vérifications finales :

- `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` — exit 0, 30/30 ;
- `npm run typecheck --workspace client` — exit 0 ;
- `npm run lint --workspace client` — exit 0 ;
- `git diff --check` — exit 0 ;
- recette Vite Dev sur `http://127.0.0.1:5174/home` à 1 440 × 1 000 clair : `scrollWidth === clientWidth` (1 429/1 429), note longue visible, 8 motions `repeatCount="indefinite"`, aucun `fill="freeze"`, aucun lien `/dashboard`, enveloppe du toggle sans classes de cercle ;
- même viewport en sombre après bascule du thème : `color-scheme: dark`, `scrollWidth === clientWidth`, `aria-label="Activer le mode clair"`, aucun lien `/dashboard` ;
- émulation tactile 390 × 844 sombre : `innerWidth = clientWidth = scrollWidth = 390`, topbar limitée au wordmark/recherche, barre basse `Formation` / `Intelligence VC`, bouton thème 44 × 44 et enveloppe d’icône sans cercle ;
- même viewport en clair après bascule du thème : `scrollWidth === clientWidth`, `aria-label="Activer le mode sombre"`, deux pôles toujours disponibles ;
- console navigateur : aucun message d’erreur ou avertissement applicatif, seulement les messages debug Vite et l’information React DevTools ;
- le serveur Vite Dev ouvert sur 5174 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/pages/home/HomePage.tsx`, `client/src/components/home/HomeEditorialBridge.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Contrat ID/slug des références internes `furtherReading`

Objet : supprimer l’ambiguïté ID/slug dans les références internes `furtherReading`, corriger les liens de simulateurs rendus depuis les leçons et aligner le validateur de contenu sur le même contrat que le renderer.

Travaux :

- ajout de `shared/further-reading-contract.mjs` et de sa déclaration TypeScript pour centraliser les types internes, la construction des registres de cibles et la résolution des routes canoniques ;
- `client/src/pages/learn/furtherReadingHref.ts` consomme ce contrat partagé, résout les références internes par ID et construit les URL depuis les slugs canoniques des cibles ;
- les références inconnues ne produisent plus de routes de repli fabriquées depuis `ref` ;
- `scripts/validation-core.mjs` réutilise le contrat partagé pour contrôler `furtherReading` par ID uniquement ;
- `scripts/validate-content.mjs` câble les registres de cibles internes réels et conserve les validations existantes de parcours, cas, simulateurs et liens externes ;
- `client/src/content/types.ts` importe le type partagé `FurtherReadingKind`.

Contrat RED–GREEN :

- `client/src/pages/learn/furtherReadingHref.test.ts` couvre la résolution `power-law` → `/simulators/power-law-portfolio`, l’absence de fallback pour une référence inconnue et la couverture des six types internes ;
- `scripts/validation-core.test.mjs` exige que la validation accepte les IDs internes, rejette les slugs lorsque `id !== slug` et couvre les six types internes ;
- premier lancement ciblé : `npm run test --workspace client -- src/pages/learn/furtherReadingHref.test.ts` retourne exit 1 sur l’ancien comportement ;
- premier lancement ciblé : `node --test scripts/validation-core.test.mjs` retourne exit 1 sur l’ancienne validation ID-ou-slug ;
- après correction, les deux ciblés passent : `furtherReadingHref.test.ts` 8/8 et `validation-core.test.mjs` exit 0.

Vérifications finales :

- `npm run validate:content:strict` — exit 0 : 24 parcours, 30 cours, 147 leçons, 420 termes, 10 études de cas, 12 livrables, 9 simulateurs, 373 marqueurs, contenu valide en mode strict ;
- `npm run check` — exit 0 : `check:generated`, contenu strict, glossaire, TypeScript, ESLint, 67 fichiers / 443 tests Vitest et 59/59 tests Node ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` — exit 0 : 1 797 modules transformés, sitemap de 703 routes, prérendu strict 715/715 avec `ok: true` ;
- `npm run check` post-build — exit 0 : générés à jour, contenu strict, glossaire, TypeScript, ESLint, 67 fichiers / 443 tests Vitest et 59/59 tests Node ;
- recette Vite Preview de l’artefact construit sur `http://127.0.0.1:4178/vc-plateform/lessons/pourquoi-utiliser-monte-carlo-en-vc/` : le panneau de références expose `Power law & construction de portefeuille` vers `/vc-plateform/simulators/power-law-portfolio` ;
- recette Vite Preview sur `/lessons/lire-tvpi-concentration-fund-returner-math/` : le même lien `Power law & construction de portefeuille` pointe vers `/vc-plateform/simulators/power-law-portfolio` ;
- recette Vite Preview sur `/lessons/pre-post-money-et-ownership/` : `Pre-money / Post-money` pointe vers `/vc-plateform/simulators/valorisation-pre-post-money` et `Ownership et cap table` vers `/vc-plateform/simulators/ownership` ;
- console navigateur vide pendant la recette ;
- le serveur Vite Preview ouvert sur 4178 a été arrêté ;
- `npm run check:generated && git diff --check` — exit 0.

Fichiers touchés par cette correction : `shared/further-reading-contract.mjs`, `shared/further-reading-contract.d.mts`, `client/src/content/types.ts`, `client/src/pages/learn/furtherReadingHref.ts`, `client/src/pages/learn/furtherReadingHref.test.ts`, `scripts/validation-core.mjs`, `scripts/validation-core.test.mjs`, `scripts/validate-content.mjs`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Recentrage de l’accueil sur Formation et Intelligence VC

Objet : recentrer `/home` sur les deux pôles publics `Formation` et `Intelligence VC`, supprimer l’action cachée vers `/dashboard`, retirer la copie dupliquée, condenser la note d’intention et remplacer l’animation continue des arches par un mouvement fini, sans modifier le hero, le wordmark, les deux barres mobiles ni la géométrie des arches.

Travaux :

- la boussole du hero reste rendue mais n’est plus un lien ni une action vers `/dashboard` ;
- le pont éditorial expose `Formation` et `Intelligence VC` comme liens directs vers `/parcours` et `/intelligence` ;
- la copie centrale qui répétait le paragraphe du hero est retirée du pont ;
- les microtextes du pont sont resserrés et la note d’intention est condensée ;
- le footer reçoit une variante compacte pour `/home`, limitée au logo, à une phrase d’orientation et aux deux liens de pôles ;
- les marqueurs des arches conservent leurs chemins et leur départ simultané à `0s`, mais `animateMotion` et `animateTransform` passent à `repeatCount="1"` avec `fill="freeze"`.

Contrat RED–GREEN :

- le contrat DOM de `/home` interdit le lien `Ouvrir le tableau de bord` et tout `a[href="/dashboard"]` dans l’accueil ;
- il exige les liens de pont `Formation` → `/parcours` et `Intelligence VC` → `/intelligence`, l’absence de `Workspace`, l’absence de la copie hero dupliquée dans le pont et le footer compact ;
- il exige que les 8 `animateMotion` démarrent à `0s`, ne soient plus `indefinite`, portent `repeatCount="1"` et `fill="freeze"`, tout en conservant les chemins `desktop-left`, `desktop-right`, `mobile-left` et `mobile-right` ;
- premier lancement ciblé : `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx -t "conserve la boussole|insère après le hero|fait démarrer simultanément|conserve la copie"` échoue sur l’ancien lien `/dashboard`, l’ancien titre de pont et les animations continues ;
- après correction, le même filtre passe, puis le fichier complet passe 30/30.

Vérifications finales :

- `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` — exit 0, 30/30 ;
- `npm run typecheck --workspace client` — exit 0 ;
- `npm run lint --workspace client` — exit 0 ;
- recette Vite Dev sur `http://127.0.0.1:5174/home` à 1 440 × 1 000 clair : `scrollWidth === clientWidth` (1 429/1 429), aucun lien `/dashboard`, liens de pont `/parcours` et `/intelligence`, footer compact `Formation` puis `Intelligence VC` ;
- même viewport en sombre après bascule du thème : `color-scheme: dark`, `scrollWidth === clientWidth` et aucun lien `/dashboard` ;
- émulation tactile 390 × 844 sombre : `innerWidth = clientWidth = scrollWidth = 390`, topbar limitée au wordmark/recherche, barre basse `Formation` / `Intelligence VC`, aucun lien `/dashboard` ;
- même viewport en clair après bascule du thème : `scrollWidth === clientWidth` et les deux pôles restent disponibles ;
- console navigateur : aucun message d’erreur ou avertissement applicatif, seulement les messages debug Vite et l’information React DevTools ;
- le serveur Vite Dev ouvert sur 5174 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/pages/home/HomePage.tsx`, `client/src/components/home/HomeEditorialBridge.tsx`, `client/src/components/chrome/Footer.tsx`, `client/src/layouts/MainLayout.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Départ simultané des carrés sur les arches de l’accueil

Objet : corriger l’animation du pont éditorial de `/home` pour que les marqueurs carrés démarrent en même temps tout en partant de côtés distincts, en reprenant le principe observé sur The Footprint Firm sans copier ses assets ni son code.

Travaux :

- `AnimatedMarker` ne reçoit plus de délai de départ ;
- chaque `animateMotion` et chaque `animateTransform` démarre explicitement à `0s` ;
- la logique qui masquait les marqueurs différés par `opacity="0"` puis les révélait à `1s` est retirée ;
- les chemins existants `desktop-left`, `desktop-right`, `mobile-left` et `mobile-right` conservent leurs origines opposées ou distinctes.

Contrat RED–GREEN :

- le test DOM du pont éditorial exige désormais 8 animations de mouvement à `begin="0s"`, aucun `animateMotion[begin="1s"]`, aucun groupe `g[opacity="0"]`, et vérifie la présence des chemins desktop gauche/droite et mobile haut/bas ;
- un premier lancement ciblé a signalé que le test devait attendre le rendu asynchrone de la section ; l’attente du titre H2 a été ajoutée ;
- le lancement ciblé suivant échoue sur l’ancien comportement avec 4 animations différées à `begin="1s"` ;
- après correction, le test ciblé passe.

Vérifications finales :

- `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx -t "fait démarrer simultanément"` — exit 0 ;
- `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` — exit 0, 30/30 ;
- `npm run typecheck --workspace client` — exit 0 ;
- `npm run lint --workspace client` — exit 0 ;
- recette Vite Dev sur `http://127.0.0.1:5174/home` en aperçu desktop 1 280 × 633 : un seul SVG desktop rendu, motions `desktop-left` et `desktop-right`, 8 motions `begin="0s"` dans la section, aucun départ `1s`, aucun `g[opacity="0"]`, aucun débordement horizontal, console vide ;
- recette Vite Dev en aperçu mobile 388 × 842 : deux SVG compacts rendus, motions `mobile-left` et `mobile-right`, aucun départ différé, aucun débordement horizontal ;
- le serveur Vite Dev ouvert sur 5174 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/components/home/HomeEditorialBridge.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Logo Maison Sapience VC dans le chrome hors accueil

Objet : remplacer le wordmark `VC Premium Experience` visible dans le chrome des pages hors `/home` par le seul logo typographique `Maison Sapience VC`, sans rond doré, fleuron ni autre élément graphique adjacent, et sans modifier le chrome dédié de l’accueil.

Travaux :

- `Logo` ne rend plus le fleuron, le rond doré ni aucun pictogramme de marque ;
- le composant affiche uniquement `Maison` et `Sapience VC` en `font-headline`, avec l’accent typographique sur `Sapience VC` ;
- les noms accessibles deviennent `Maison Sapience VC` en mode complet et `Maison Sapience VC — accueil` en mode compact ;
- le commentaire de `SideNav` est réaligné sur ce nom de marque ;
- le chrome `/home`, qui utilise son propre titre central, n’est pas modifié.

Contrat RED–GREEN :

- un test DOM `MainLayout` couvre une route hors accueil, interdit `VC Premium`, `Experience` et le fleuron `❦` dans les liens de logo, puis exige les liens de logo `Maison Sapience VC` et `Maison Sapience VC — accueil` vers `/home` ;
- le premier lancement ciblé échoue sur l’ancien rendu avec deux occurrences visibles de `VC Premium` ;
- après durcissement du test, le lancement ciblé échoue aussi sur le fleuron résiduel dans les liens de logo ;
- après correction, `npm run test --workspace client -- src/layouts/MainLayout.dom.test.tsx` passe 3/3.

Vérifications finales :

- `npm run typecheck` — exit 0 ;
- `npm run lint` — exit 0 ;
- `npm run test` — exit 0, 67 fichiers / 441 tests Vitest et 58/58 tests Node ;
- recette Vite Dev sur `http://localhost:5173/certifications` en aperçu mobile : topbar hors accueil avec le seul wordmark texte `Maison Sapience VC`, sans rond doré, fleuron ou symbole de marque, aucune occurrence `VC Premium`/`Premium Experience` dans le header, `scrollWidth === clientWidth`, aucune erreur JavaScript ;
- le serveur Vite Dev ouvert sur 5173 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/components/ui/Logo.tsx`, `client/src/components/chrome/SideNav.tsx`, `client/src/layouts/MainLayout.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Flèche Formation avant le libellé sur l’accueil

Objet : placer la flèche du menu `Formation` avant son libellé sur `/home`, en desktop comme dans la barre basse mobile, sans modifier le positionnement du menu `Intelligence VC`.

Travaux :

- `HomePillarMenu` rend désormais l’icône avant le libellé pour le pôle gauche `Formation`, quel que soit le mode d’affichage ;
- `Intelligence VC` conserve l’ordre libellé puis flèche à droite ;
- la logique d’ouverture, fermeture, survol, focus, toucher et panneaux n’est pas modifiée.

Contrat RED–GREEN :

- le test DOM desktop exige maintenant l’ordre visuel `svg, span` pour `Formation` et `span, svg` pour `Intelligence VC`, en complément du contrat mobile déjà ajouté ;
- premier lancement ciblé desktop : `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx -t "limite la barre supérieure"` échoue avec 1 test en échec, l’ancien premier enfant de `Formation` étant `span` ;
- après correction, les ciblés desktop et mobile passent, puis le fichier complet `homeExperience.dom.test.tsx` passe 30/30.

Vérifications finales :

- `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` — exit 0, 30/30 ;
- `npm run typecheck --workspace client` — exit 0 ;
- `npm run lint --workspace client` — exit 0 ;
- recette Vite Dev sur `http://127.0.0.1:5174/home` à 1 440 × 900 : `Formation` rend `svg, span` avec la flèche à gauche du libellé, `Intelligence VC` rend `span, svg`, `scrollWidth === clientWidth` ;
- même recette en émulation mobile tactile 390 × 844 : largeur réelle 390 px, mêmes ordres `svg, span` et `span, svg`, `scrollWidth === clientWidth` et console vide ;
- le serveur Vite Dev ouvert sur le port 5174 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/components/chrome/TopBar.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Flèche d’ouverture à gauche sur le glossaire mobile

Objet : placer la flèche d’ouverture des entrées à gauche des mots sur mobile seulement, avec un léger décalage du contenu, sans modifier la disposition desktop.

Travaux :

- la grille mobile des lignes de glossaire passe de `minmax(0,1fr) 2.75rem` à `2.75rem minmax(0,1fr)` ;
- le titre, la catégorie et le résumé commencent désormais en deuxième colonne sous `md`, après la cible de flèche de 44 px ;
- le contrôle d’ouverture porte un repère DOM ciblé et reste à droite à partir de `md` grâce aux classes de grille desktop existantes ;
- aucune logique de recherche, filtrage, synchronisation URL ou chargement différé n’a été modifiée.

Contrat RED–GREEN :

- le test DOM ciblé exige la flèche en première colonne mobile, le terme et le résumé en deuxième colonne, et le maintien de la grille desktop à douze colonnes ; le premier lancement échoue sur l’ancienne grille mobile avec flèche à droite ;
- après correction, le test ciblé filtré puis `npm run test --workspace client -- src/pages/glossary/GlossaryPage.lazy.dom.test.tsx` passent, avec 8/8 tests pour le fichier.

Vérifications finales :

- `npm run typecheck` — exit 0 ;
- `npm run lint` — exit 0 ;
- `npm run check` — exit 0 : générés à jour, contenu strict, glossaire, TypeScript, ESLint, 67 fichiers / 440 tests Vitest et 58/58 tests Node ;
- premier `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : le build Vite passe, puis le prérendu strict échoue sur un timeout Chromium transitoire de `/glossary/presidio` ; le prérendu relancé avec les mêmes variables passe ensuite 715/715 ;
- second build canonique complet avec les mêmes variables — exit 0, 1 796 modules transformés, sitemap de 703 routes et prérendu strict 715/715 avec `ok: true` ;
- `npm run check:generated && git diff --check && git status --short` — exit 0 ; seuls les fichiers déjà modifiés du glossaire et les suivis apparaissent modifiés ;
- recette Vite Preview sur `/vc-plateform/glossary?term=daphni` : à 390 × 844, largeur réelle 390 px, `gridTemplateColumns` vaut `44px 294px`, la flèche est à gauche du titre, le titre et le résumé commencent à 76 px, `scrollWidth === clientWidth` et aucun message console ; à 1 440 × 1 000, le contrôle reste à droite du résumé et aucun débordement horizontal n’est constaté ;
- le serveur Preview ouvert sur le port 4174 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/pages/glossary/GlossaryPage.tsx`, `client/src/pages/glossary/GlossaryPage.lazy.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Suppression des initiales répétées dans le dictionnaire

Objet : retirer la pastille qui répétait la première lettre devant chaque terme, sans modifier les repères alphabétiques de section ni le fonctionnement des définitions.

Travaux :

- la pastille décorative `aria-hidden` est retirée de chaque entrée ; l’attribut `data-glossary-initial`, utilisé par le suivi de section, reste en place ;
- la grille mobile passe de `2.75rem minmax(0,1fr) 2.75rem` à `minmax(0,1fr) 2.75rem` : titre, catégorie et résumé occupent la première colonne, tandis que le contrôle d’ouverture conserve une cible de 44 × 44 px dans la seconde ;
- la grille desktop à douze colonnes est conservée et le retrait gauche de la définition développée est supprimé afin de réaligner son contenu après le retrait de la pastille ;
- la navigation alphabétique et la grande lettre du groupe courant ne sont pas modifiées.

Contrat RED–GREEN :

- le test DOM ciblé exige l’absence de l’initiale répétée, la nouvelle grille mobile et l’alignement du titre et du résumé ; le premier lancement échoue sur l’ancienne grille à trois colonnes ;
- après la correction, `npm run test --workspace client -- src/pages/glossary/GlossaryPage.lazy.dom.test.tsx` passe 8/8.

Vérifications finales :

- `npm run typecheck`, `npm run lint`, `npm run test` et `npm run check` — exit 0 ; la suite complète couvre 67 fichiers / 440 tests Vitest et 58/58 tests Node ;
- build canonique sous `VITE_BASE_URL=/vc-plateform/` et `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform` — exit 0, 1 796 modules transformés, sitemap de 703 routes et prérendu strict 715/715 avec `ok: true` ;
- `npm run check:generated` après build — exit 0, avec 147 leçons, 126 corps publiés et 420 termes ;
- recette de l’artefact sur `/vc-plateform/glossary?term=daphni` à 1 440 × 1 000 et 390 × 844 : pastille absente, repère `D` conservé, grille desktop et ligne mobile alignées, contrôle mobile de 44 × 44 px, définition développée alignée à 20 px avec le titre et le résumé, `scrollWidth === clientWidth` et console vide ;
- le serveur Vite Preview ouvert sur le port 4174 a été arrêté et le port est libre.

Fichiers touchés par cette correction : `client/src/pages/glossary/GlossaryPage.tsx`, `client/src/pages/glossary/GlossaryPage.lazy.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Aucun commit, staging, push, workflow distant ou déploiement.

---

## 2026-08-03 — Adaptation mobile et durcissement du glossaire

Objet : améliorer la lisibilité, la maniabilité tactile et la recherche du glossaire sur mobile, sans transformer l’interface en tableau de bord générique ni modifier son identité éditoriale desktop.

Travaux :

- le hero mobile est raccourci, le titre conserve `capital-risque.` sur une même unité typographique et les espacements desktop restent définis par les breakpoints existants ;
- sous `lg`, le rail des domaines est remplacé par un `select` nommé et étiqueté ; le rail éditorial est conservé sur desktop ; les lettres disposent de cibles tactiles de 44 px ;
- les résultats deviennent des lignes d’index compactes sur mobile et les définitions développées restent visuellement attachées à leur entrée ; la copie détaillée passe à 16 px et l’exemple à 14 px sur mobile, puis reviennent respectivement à 14 px et 12 px à partir de `md` ;
- la recherche normalise les diacritiques du terme et de ses alias, de sorte que `accelerateur` trouve « Accélérateur » ; son contrôle d’effacement neutralise les décorations natives WebKit, restaure le focus et rétablit le contexte de filtrage qui précédait la recherche ;
- ce contexte couvre le mode alphabétique ou tous les termes, la première lettre et la deuxième lettre. Une sélection explicite de domaine, un saut de lettre ou un lien « Voir aussi » invalide le snapshot de recherche afin que l’action la plus récente reste autoritaire ; l’ouverture ou la fermeture d’une définition ne le modifie pas ;
- une région `status` annonce le nombre de résultats et l’ouverture ou fermeture d’une définition reste synchronisée avec le paramètre `?term=`.

Contrat RED–GREEN et contre-revue initiale :

- les tests de recherche sans accents, sélecteur mobile, cibles alphabétiques, hero compact, lignes d’index, compteur accessible, typographie responsive, restauration de filtre, focus et synchronisation URL ont été ajoutés par boucles ciblées RED–GREEN ;
- une première contre-revue indépendante a refusé le diff initial : l’effacement forçait le filtre alphabétique sans restaurer le mode antérieur, la copie agrandie sur mobile modifiait aussi le desktop et les interactions du sélecteur, de l’effacement et de l’URL n’étaient pas suffisamment exercées ;
- ces trois points ont été corrigés. Une auto-relecture supplémentaire a ajouté le cas de la deuxième lettre et la contre-revue finale a fait verrouiller l’ouverture puis la fermeture d’un terme pendant une recherche : le contexte est restauré après effacement, tandis que la validité reste contrôlée par `availableSecondLetters`.

Vérifications finales :

- tests ciblés du glossaire — exit 0, 2 fichiers / 12 tests ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run check` — exit 0 : générés à jour, contenu strict, glossaire, TypeScript et ESLint valides, 67 fichiers / 440 tests Vitest et 58/58 tests Node ;
- build canonique avec les mêmes variables — exit 0, 1 796 modules transformés, sitemap de 703 routes et prérendu strict 715/715 avec `ok: true` ;
- `git diff --check` — exit 0, sans sortie ; scan statique des lignes ajoutées sans secret, exécution dynamique dangereuse, HTML non sûr ni log de débogage ;
- recette réelle à 320 × 568, 390 × 844 et 1 440 × 1 000, en clair et sombre selon les scénarios : recherche sans accents, restauration A puis 420 entrées, sélecteur Acteurs/Tous domaines, état sticky, entrée développée, focus après effacement, typographie desktop 14 px/12 px, absence de débordement et console vide ;
- artefact final servi avec le contrat de base complet sur `/vc-plateform/glossary/` à 390 × 844 : titre et métadonnées de la définition actifs, deux entrées sous `0`, définition chargée, sélecteur « Tous domaines », aucun débordement ni message console. La variante sans slash de Vite Preview sert son fallback racine ; l’artefact prérendu canonique avec slash est conforme.
- contre-revue indépendante finale du diff V4 applicable `/tmp/vc-glossary-review-final-v4.diff`, SHA-256 `d7f2339ea4f6b35bc611c8d7a5b3e7d39fa8260d0aa50c5e78addcc71d0be5f2` — `passed: true`, aucune préoccupation de sécurité, aucune erreur logique, aucune suggestion. Le relecteur confirme notamment la restauration de `activeLetter`, `activeSecondLetter` et `isLetterFilterActive`, la non-invalidation dans `toggleTerm`, les invalidations restantes dans `selectCategory`, `jumpToLetter` et `revealSlug`, les tailles desktop préservées, le masquage WebKit du champ `search` et la couverture des tests.

Fichiers applicatifs touchés : `client/src/pages/glossary/GlossaryPage.tsx`, `client/src/pages/glossary/glossarySearch.ts`, `client/src/pages/glossary/GlossaryPage.test.ts` et `client/src/pages/glossary/GlossaryPage.lazy.dom.test.tsx`. Suivis mis à jour : `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture locale : aucun staging, commit, push, workflow distant ou déploiement. Les serveurs de recette ouverts par cette passe sur 5174 et 4174 sont arrêtés ; les deux ports sont libres. Le processus préexistant sur 5173 n’a pas été interrompu.

---

## 2026-08-02 — Stabilisation du chrome de `/home` après redirection GitHub Pages

Objet : reproduire et corriger la substitution intermittente du chrome propre à l’accueil par la navigation standard après actualisation sur GitHub Pages, sous la base `/vc-plateform/`, sans commit, push ni déploiement.

Diagnostic :

- `https://iari-ctrl.github.io/vc-plateform/home` répond `301` vers `https://iari-ctrl.github.io/vc-plateform/home/`, qui répond `200` ;
- le document HTML public prérendu contient une occurrence de `Rechercher depuis Maison Sapience VC`, aucune occurrence de `id="desktop-nav"` et aucun `aria-label="Menu"` : le défaut n’est pas produit par le HTML prérendu ;
- après hydratation du bundle public, à 1 440 × 1 000 comme à 390 × 844, `Maison Sapience VC` disparaît, `#desktop-nav` est présent, les boutons `Menu` et `Ouvrir la navigation` sont montés, et la navigation basse mobile est absente ;
- `BrowserRouter` retire correctement le basename `/vc-plateform`, mais conserve le slash final dans le pathname applicatif. Les comparaisons strictes à `/home` dans `MainLayout` et `TopBar` sélectionnaient donc respectivement le `SideNav` et la topbar standard pour `/home/` ;
- le prérendu navigue vers la route sans slash avant d’écrire `client/dist/home/index.html`. Il capturait par conséquent le bon chrome, puis l’ancien JavaScript déployé le remplaçait au chargement sous l’URL canonique avec slash.

Travaux et contrat RED–GREEN :

- une copie détachée de `HEAD` a reçu uniquement le test de régression. `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` y retourne exit 1, avec 26 tests réussis et 1 échec sur 27 : `/home/` affiche `VC Premium Experience` au lieu du bouton `Rechercher depuis Maison Sapience VC` ;
- `MainLayout.tsx` et `TopBar.tsx` retirent désormais les slashs finaux avant de classifier la route, avec conservation explicite de `/` pour le portail ;
- `homeExperience.dom.test.tsx` paramètre `/home` et `/home/` en mode large puis compact. Pour chaque variante, il exige le bouton `Maison Sapience VC`, interdit `Menu`, `Ouvrir la navigation` et `#desktop-nav`, puis vérifie sur mobile la navigation `Pôles de l’accueil` avec `Formation` et `Intelligence VC` ;
- la recette mobile a aussi vérifié la cible visible du contrôle de thème. `HomePage.tsx` place sa cible mobile en `z-[80]`, au-dessus de la topbar `z-[75]`, tout en conservant `md:z-[70]` sur desktop ; le test DOM contrôle cet ordre de pile.

Vérifications finales :

- `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` — exit 0, 30/30 ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run check` — exit 0 avant et après build : générés à jour, validations strictes, glossaire, TypeScript et ESLint sans erreur, 67 fichiers / 432 tests Vitest et 58/58 tests Node ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` — exit 0, 1 796 modules transformés, sitemap de 703 routes et prérendu strict 715/715 avec `ok: true` ;
- `client/dist/home/index.html` existe sous le dossier `client/dist/home/`, référence `/vc-plateform/assets/index-DW2UvCeW.js`, contient une occurrence du contrôle `Maison Sapience VC`, aucune sidebar standard et aucun bouton `Menu` ;
- Vite Preview, demandé sur 4173 puis servi sur 4174 car 4173 était déjà occupé, a été contrôlé par chargement direct de `/vc-plateform/home` et `/vc-plateform/home/` à 1 440 × 1 000 et 390 × 844. Les quatre scénarios répondent `200`, affichent exactement un contrôle `Maison Sapience VC`, n’exposent ni `#desktop-nav`, ni `Menu`, ni `Ouvrir la navigation`, conservent `scrollWidth === clientWidth` et ne produisent aucune erreur console, erreur de page ou requête échouée ;
- sur mobile, les deux scénarios rendent `Formation` et `Intelligence VC` dans la navigation basse. Le centre visible du contrôle de thème appartient au bouton `Activer le mode clair` et un tap réel sur `/home/` bascule la classe racine de `dark` vers le mode clair ;
- le serveur 4174 de cette passe et les scripts, rapports et captures temporaires ont été supprimés. Le serveur préexistant sur 4173 n’a pas été interrompu. Le build ne laisse aucune modification suivie sous `client/dist`, `client/public` ou `data/generated`, et `git diff --check` reste sans sortie.
- contre-revue indépendante du diff code gelé, empreinte SHA-256 `c1874a8c84fac27ef6a7c8de0dcad77b0342caa969f81d4c10eb744f2ef2e5ba` : `passed: true`, aucune préoccupation de sécurité ni erreur logique. La centralisation future du normaliseur et des contrats supplémentaires pour `/onboarding/` sont classées comme suggestions non bloquantes hors du défaut demandé.

Fichiers touchés : `client/src/layouts/MainLayout.tsx`, `client/src/components/chrome/TopBar.tsx`, `client/src/pages/home/HomePage.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

État de publication : le build local est corrigé, mais le site public hydrate toujours avec le bundle antérieur. `.github/workflows/deploy-pages.yml` reste exclusivement manuel (`workflow_dispatch`) et son job de déploiement n’est autorisé que depuis `master`. Aucun staging, commit, push, lancement de workflow ou déploiement n’a été exécuté.

---

## 2026-08-01 — Correction V1c de la liste de calculs SaaS Metrics

Objet : corriger le résiduel bloquant relevé par la contre-revue V1b de `l-specialty-saas-metrics`, sans élargir le périmètre du lot, modifier les documents de certification ni lancer une opération distante.

Constat repris : la Partie A demandait encore de recalculer l’ARR récurrent vérifié en plus des six calculs autorisés. Le test V1b vérifiait la présence de ces six calculs, mais pas l’exclusivité de leur liste.

Travaux et preuve RED–GREEN :

- baseline V1c conservée hors dépôt dans `~/.hermes/cache/vc-platform/analyst-seed-lead-saas-v1c-baseline/`, avec copie et empreinte des fichiers bornés avant écriture ;
- `client/src/content/analystSeedLeadSaas.test.ts` isole la Partie A, contrôle sa phrase de calcul exacte et y interdit ARR, logo/customer churn et LTV ;
- RED ciblé conservé dans `~/.hermes/cache/vc-platform/analyst-seed-lead-saas-v1c-red.log` : `npm run test --workspace client -- src/content/analystSeedLeadSaas.test.ts` retourne exit 1, avec 1 test en échec et 10 réussis sur 11 ; l’échec oppose explicitement la liste attendue à la liste contenant encore ARR ;
- correction minimale de `data/lessons.json` : retrait de l’ARR de la seule consigne de Partie A. Le retraitement `1,2 M€ - 120 k€ = 1,08 M€` reste expliqué dans le corps de la leçon ; le pont agrégé, ses calculs, la Partie B et l’inventaire des champs manquants restent inchangés ;
- `npm run split:content` reporte uniquement ce changement de corps dans `data/generated/lessons.bodies.json` ; la comparaison avec la baseline confirme que `data/generated/lessons.index.json`, `data/courses.json` et `client/public/sitemap.xml` restent identiques ;
- GREEN ciblé : la même commande retourne exit 0, 11/11.

Recalculs indépendants : `l-specialty-saas-metrics` contient 1 121 mots avant références et 1 249 mots au total ; `readMin = ceil(1 249 / 200) = 7`. La durée dérivée de `c-analyst-specialties` reste `23`. Les résultats restent gross revenue loss rate `12 %`, GRR `88 %`, NRR `106 %`, CAC `6 000 €`, marge brute mensuelle `550 €` et payback `12 mois`.

Vérifications finales :

- `npm run validate:glossary` — exit 0, 420 termes ;
- `npm run validate:content:strict` — exit 0, 24 parcours, 1 certification, 30 cours, 147 leçons, 420 termes et 373 marqueurs ;
- `npm run check:generated` — exit 0, 147 leçons, 126 corps publiés et 420 termes ;
- `npm run check` — exit 0, 67 fichiers / 426 tests Vitest et 58/58 tests Node ;
- `git diff --check` — exit 0, sans sortie ;
- build canonique `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` — exit 0, 1 796 modules transformés, sitemap 703 routes et prérendu strict 715/715 avec `ok: true` ;
- gates post-build `npm run check:generated`, `npm run validate:content:strict`, `npm run check` et `git diff --check` — exit 0.

Fichiers modifiés par V1c : `client/src/content/analystSeedLeadSaas.test.ts`, `data/lessons.json`, `data/generated/lessons.bodies.json`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Les autres changements visibles du worktree restent préexistants ou relèvent d’autres lots.

Clôture locale : aucun staging, commit, push, workflow distant, déploiement ou V2.

---

## 2026-08-01 — Correction V1b du cas SaaS Metrics agrégé

Objet : fermer le dernier écart bloquant relevé par la contre-revue V1 du lot pédagogique `Analyst Seed × Lead × SaaS`, limité à `l-specialty-saas-metrics`, sans modifier les documents de certification, sans V2 et sans opération distante.

Défaut initial : le cas annonçait un « export mensuel fictif par client » alors que les données disponibles formaient seulement un pont agrégé de cohorte. Les calculs ARR, gross revenue loss rate, GRR, NRR, CAC, marge brute mensuelle et payback étaient possibles, mais le logo/customer churn et la LTV n’étaient pas calculables numériquement faute de logos T0/perdus, revenus par client, période, churn retenu et convention de durée de vie.

Travaux :

- renforcement préalable de `client/src/content/analystSeedLeadSaas.test.ts` : le nouveau contrat vérifie le tableau Markdown du pont agrégé, l’absence de présentation mensongère comme export client, les seules métriques numériques calculables, le classement de logo churn et LTV comme non calculables, l’inventaire des champs manquants et l’interdiction d’inventer une valeur ;
- RED ciblé conservé hors dépôt dans `~/.hermes/cache/vc-platform/analyst-seed-lead-saas-v1b-red.log` : `npm run test --workspace client -- src/content/analystSeedLeadSaas.test.ts` retourne exit 1, 11 tests exécutés, 2 tests en échec pour le défaut sémantique attendu ;
- correction minimale de `data/lessons.json` : le cas est désormais un pont agrégé de cohorte avec période, devise, date d’extraction, revenu T0 `1 000 k€`, churn revenu `50 k€`, contractions `70 k€`, expansions `180 k€`, nouveaux clients après T0 `90 k€` exclus de la NRR et réactivations `20 k€` traitées séparément ;
- reformulation de l’activité en Partie A — calculs exécutables et Partie B — contrôle de données et méthode. Logo/customer churn et LTV ne sont plus demandés comme calculs numériques depuis le pont ; l’exercice demande de documenter le schéma de collecte client et les champs nécessaires, sans inventer de valeur ;
- conservation des acquis : cas fictif explicite, définitions prudentes, absence de seuil universel, références ChartMogul et Paddle, frontière Analyst, IDs/slugs/routes/statuts et corrections Seed Financing/SaaS GTM inchangés.

Recalculs indépendants : `l-specialty-saas-metrics` contient 1 124 mots avant références et 1 252 mots au total ; `readMin = ceil(1 252 / 200) = 7`. La durée dérivée du cours `c-analyst-specialties` reste `23`, donc `data/courses.json` n’est pas modifié.

Vérifications et build :

- GREEN ciblé : `npm run test --workspace client -- src/content/analystSeedLeadSaas.test.ts` — exit 0, 11/11 ;
- `npm run validate:glossary` — exit 0, 420 termes ;
- `npm run validate:content:strict` — exit 0, 24 parcours, 1 certification, 30 cours, 147 leçons, 420 termes, 373 marqueurs ;
- `npm run split:content` — exit 0, 420 termes et 147 leçons régénérés ;
- `npm run check:generated` — exit 0, 147 leçons, 126 corps publiés, 420 termes ;
- `npm run check` — exit 0, 67 fichiers / 426 tests Vitest et 58/58 tests Node ;
- `git diff --check` — exit 0, sans sortie ;
- build canonique `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` — exit 0, 1 796 modules transformés, sitemap 703 routes, postbuild exécuté, prérendu strict 715/715 avec `ok: true` ;
- gates post-build : `npm run check:generated`, `npm run validate:content:strict`, `npm run check` et `git diff --check` — exit 0.

Contrôles post-build : les dérivés de `l-specialty-saas-metrics` correspondent aux sources canoniques ; les six routes `/lessons/seed-validation-commerciale-retention`, `/lessons/seed-ownership-runway-financement`, `/lessons/lead-plan-due-diligence-term-sheet`, `/lessons/lead-syndication-gouvernance-closing`, `/lessons/saas-arr-retention-unit-economics` et `/lessons/saas-repetabilite-go-to-market` sont présentes dans le sitemap ; `docs/certifications/REFERENTIEL-VC-ANALYST.md` et `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md` conservent leurs empreintes de début de passe.

Fichiers réellement modifiés par cette passe : `client/src/content/analystSeedLeadSaas.test.ts`, `data/lessons.json`, `data/generated/lessons.bodies.json`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Les autres modifications visibles du worktree sont préexistantes ou liées à des lots distincts et ne sont pas attribuées à cette correction.

Clôture locale : aucun staging, commit, push, workflow distant, déploiement ou V2. La zone de staging est restée vide.

---

## 2026-08-01 — Correction V1 du lot « Analyst Seed × Lead × SaaS »

Objet : corriger le lot pédagogique optionnel `Seed × Lead × SaaS` sur les manquements de provenance, finance et calculs, sans modifier les documents de certification ni lancer de V2.

Travaux et preuve RED–GREEN :

- les consignes dépôt, architecture éditoriale, référentiels de certification, test ciblé existant, six leçons et livrables de recherche `~/.hermes/cache/vc-platform/source-research/seed-lead-saas/` ont été lus ; les empreintes de départ demandées correspondaient aux fichiers de contenu/tests/référentiels/contrat avant modification ; le worktree était déjà non propre et les modifications hors lot sont restées distinctes ;
- `client/src/content/analystSeedLeadSaas.test.ts` a été complété avant correction avec des contrôles sémantiques ciblés. Première sortie RED conservée dans `~/.hermes/cache/vc-platform/analyst-seed-lead-saas-red.log` : 11 tests exécutés, 9 échecs attendus sur sources SaaS, marquage fictif, runway, métriques SaaS, exercices, LVR/QLVR, GRR et références mutables ;
- `data/lessons.json` publie et corrige les six leçons `l-stage-seed-commercial`, `l-stage-seed-financing`, `l-role-lead-dd`, `l-role-lead-closing`, `l-specialty-saas-metrics` et `l-specialty-saas-gtm` : cas fictifs explicites, exercices exécutables ou reformulés, frontière Analyst maintenue comme transposition professionnelle prudente, références requalifiées avec portée et limites ;
- Seed Financing distingue primaire et secondaire, calcule `post-money = 7,6 M€ + 2,4 M€ = 10,0 M€`, ownership primaire `24 %`, runway mécanique `2,75 M€ / 90 k€ = 30,555… mois`, arrondie à `30,6 mois`, et sépare runway mécanique, runway à seuil et fenêtre utile avant prochain tour ;
- SaaS Metrics rend reproductibles `1,2 M€ - 120 k€ = 1,08 M€`, GRR `88 %`, NRR `106 %`, CAC `6 000 €`, onboarding `600 €`, marge brute mensuelle `550 €` et payback `12 mois`, sans seuil universel ;
- SaaS GTM aligne `qualified-lead-velocity-rate` sur la source Geckoboard « Lead Velocity Rate (LVR) », garde QLVR comme alias local, calcule LVR `25 %`, MQL→SQL `75 %`, SQL→won `60 %`, cycle médian `53 jours` et panier signé moyen `20 k€` ;
- `data/glossary.json` et `data/sources/canonical-glossary.json` sont alignés, avec création de `grr` et reformulation des entrées ARR, annualized run rate, NRR, CAC, CAC payback, gross margin, LTV, churn et LVR ;
- `data/courses.json` est ajusté aux durées dérivées : `c-analyst-stage` 12 min, `c-analyst-deal-role` 12 min, `c-analyst-specialties` 23 min ; les dérivés `data/generated/*` sont produits par `npm run split:content` ; `client/public/sitemap.xml` est régénéré par `generate:sitemap` avec l’origine canonique documentée ;
- les tests de comptage devenus obsolètes par la publication des six leçons et l’ajout de `grr` sont réalignés dans `client/src/content/certifications.test.ts`, `client/src/content/lessons.test.ts` et `scripts/generated-content.test.mjs` ; les fichiers de certification sous `docs/certifications/` n’ont pas été modifiés par cette passe.

Vérifications finales :

- `npm run test --workspace client -- src/content/analystSeedLeadSaas.test.ts` : exit 0 — 11/11 ;
- `npm run validate:glossary` : exit 0 — 420 termes ;
- `npm run validate:content:strict` : exit 0 — 24 parcours, 1 certification, 30 cours, 147 leçons, 420 termes, 373 marqueurs ;
- `npm run split:content` : exit 0 — 420 termes et 147 leçons régénérés vers `data/generated/*` ;
- `npm run check:generated` : exit 0 — 147 leçons, 126 corps publiés, 420 termes ;
- recalcul indépendant : readMin `6, 6, 6, 6, 7, 7`, durées de cours `12, 12, 23`, runway `30,555…`, ownership `24 %`, ARR `1,08 M€`, GRR `88 %`, NRR `106 %`, payback `12 mois`, LVR `25 %` ;
- `npm run check` a d’abord échoué sur les tests de comptage et le sitemap versionné devenus obsolètes ; après réalignement et régénération canonique, `npm run check` retourne exit 0 — 67 fichiers / 426 tests Vitest et 58/58 tests Node ;
- `git diff --check` : exit 0, sans sortie ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 796 modules transformés, sitemap 703 routes, prérendu strict 715/715 avec `ok: true` ;
- contrôle post-build `npm run check:generated` : exit 0 ; empreintes finales relevées pour les fichiers possédés.

Fichiers touchés par cette correction : `client/src/content/analystSeedLeadSaas.test.ts`, `data/lessons.json`, `data/courses.json`, `data/glossary.json`, `data/sources/canonical-glossary.json`, les dérivés `data/generated/lessons.*.json` et `data/generated/glossary.*.json`, `client/public/sitemap.xml`, `client/src/content/certifications.test.ts`, `client/src/content/lessons.test.ts`, `scripts/generated-content.test.mjs`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture locale : aucun manquement V1 n’est laissé ouvert. Aucun commit, staging, push, workflow distant, déploiement ou lancement V2 n’a été exécuté. La contre-revue V1 indépendante doit être lancée dans une session séparée.

---

## 2026-08-01 — Reprise sourcée du parcours « Comprendre le capital-risque »

Objet : reprendre `p-decouvrir-vc` / `c-decouvrir-vc` sans créer de cours, en conservant les sept leçons `ld-*`, leurs slugs et routes, le drop-in concurrent `lsv-vc-mise`, et le cas Europe comme respiration hors lot.

Travaux et preuve RED–GREEN :

- baseline du worktree sale repris avant réécriture ; les modifications préexistantes restent distinctes et aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté ;
- deux tests RED ciblés ont été ajoutés : `client/src/content/decouvrirVcParcours.test.ts` pour l’inventaire, les sources, l’ordre et le quiz ; `client/src/pages/learn/decouvrirVcParcours.dom.test.tsx` pour le rendu du jalon, la progression et l’exécution du quiz ;
- une matrice documentaire locale a été constituée dans `~/.hermes/cache/vc-platform/source-research/p-decouvrir-vc/evidence-matrix.md`, avec proposition, source exacte, portée et limite ; les sources retenues incluent France Invest, ILPA, EUR-Lex/EuVECA, Invest Europe, NBER et travaux académiques accessibles ;
- `data/parcours/01-le-vc-sans-bullshit.lessons.json` a été réécrit comme registre court et institutionnel : les sept IDs `ld-*` sont conservés, `ld-decouvrir-vc-quiz` ajoute huit questions cumulatives, et chaque leçon factuelle porte au moins deux sources HTTPS qualifiées ;
- `data/courses.json` et `data/parcours.json` sont alignés sur la durée dérivée et les neuf étapes : sept leçons, respiration `cs-europe-vs-valley`, puis milestone `ld-decouvrir-vc-quiz` ; le cas Europe n’a pas été réécrit ;
- `client/src/pages/learn/ParcoursDetailPage.tsx` distingue désormais un milestone résolu vers une leçon d’un livrable de production, et `client/src/content/parcours.ts` reconnaît la navigation de parcours depuis ce milestone-leçon ; le compteur de quiz est rendu sous la forme `Question 1/8`.

Corrections de clôture après contre-revue finale :

- un test DOM RED a reproduit l’état contradictoire créé par une production homonyme persistée sous `ld-decouvrir-vc-quiz` ; `StepRow` et `hasLearningActivity` ne consultent plus `workspace.productions` lorsqu’une étape se résout vers `lessonId`, puis le scénario passe avec une progression `0 / 9`, aucun badge « commencé » et `Lecture non commencée` ;
- les sept leçons et le quiz attribuent désormais les propositions au plus près dans la prose, en distinguant guide professionnel français, règlement européen de portée spécifique, enquêtes académiques principalement américaines, principes internationaux non contraignants et doctrine française de fin de vie des fonds ;
- `ld-power-law`, sa question cumulative et l’entrée de glossaire `power-law` qualifient la « loi de puissance » comme raccourci sectoriel : les études NBER retenues documentent asymétrie et concentration dans des échantillons bornés, non une loi mathématique universelle ;
- `pre-seed` est signalé comme convention éditoriale, la répartition Analyst/Associate/seniors comme convention de cours, le LPAC ILPA est distingué du comité d’investissement et LP/GP sont présentés comme fonctions économiques plutôt que comme formes juridiques françaises universelles ;
- la référence Invest Europe directement téléchargeable, bloquée en HTTP 403 lors de la vérification finale, n’est pas conservée : la leçon sur les stades s’appuie sur le guide France Invest pour sa taxonomie publiée et sur NBER w22587, avec sa population majoritairement américaine explicitée, uniquement pour constater que les pratiques varient selon la maturité.

Vérifications finales :

- `npm run test --workspace client -- src/content/decouvrirVcParcours.test.ts src/pages/learn/decouvrirVcParcours.dom.test.tsx --reporter=verbose --no-color` : exit 0 — 2 fichiers / 11 tests ;
- récupération des sept URL uniques finales France Invest, EUR-Lex/EuVECA, NBER w8066, NBER w27690, NBER w22587, ILPA et AMF : 7/7 réponses HTTP 200 ;
- `npm run validate:content:strict` : exit 0 — 24 parcours, 30 cours, 147 leçons, 419 termes, 23 leçons de parcours drop-in, 361 marqueurs ;
- `npm run check` : exit 0 — `check:generated` à 147 leçons / 120 corps publiés / 419 termes, contenu strict, glossaire, TypeScript, ESLint, 66 fichiers / 415 tests Vitest et 58/58 tests Node ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 796 modules transformés, sitemap 696 routes et prérendu strict 708/708 avec `ok: true` ;
- contrôle post-build `npm run check:generated && npm run validate:content:strict && npm run validate:glossary` : exit 0 ; `git diff --check` sans sortie ;
- recette de l’artefact construit via Vite Preview sous `/vc-plateform/` : HEAD 200 sur le parcours, le quiz, le cas Europe et le sitemap ; desktop parcours avec 9 étapes, jalon `Lecture non commencée` et console vide ; mobile 390 × 844 avec topbar mobile, 9 étapes, cas Europe inchangé, CTA « Ouvrir le quiz final », page quiz `Question 1/8`, navigation précédente vers « Un fonds naît et meurt aussi » et console DevTools vide ; route sitemap contenant `/lessons/quiz-comprendre-le-capital-risque` et HTML prérendu présent.

Fichiers touchés par cette correction : `data/parcours/01-le-vc-sans-bullshit.lessons.json`, `data/courses.json`, `data/parcours.json`, `data/glossary.json`, `data/sources/canonical-glossary.json`, les dérivés `data/generated/lessons.*.json` et `data/generated/glossary.*.json`, `client/public/sitemap.xml`, `client/src/content/parcours.ts`, `client/src/pages/learn/ParcoursDetailPage.tsx`, `client/src/components/reading/QuizBlock.tsx`, `client/src/content/lessons.test.ts`, `client/src/content/decouvrirVcParcours.test.ts`, `client/src/pages/learn/decouvrirVcParcours.dom.test.tsx`, `scripts/generated-content.test.mjs`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture locale : les deux réserves de la première contre-revue indépendante ont été corrigées, puis les tests, le check, le build canonique et les validations post-build ont été rejoués avec succès. La contre-revue de confirmation conclut `passed: true`, sans défaut logique, de sécurité, de source ou de portée et sans suggestion résiduelle. Aucune publication distante n’a été effectuée.

---

## 2026-07-31 — Production de la respiration finale du parcours « Une semaine dans la peau d’un VC »

Objet : remplacer l’étape finale `a-produire` « Respiration — Mythe démonté : « le VC mise » » par une leçon publiée, consultable depuis le parcours et cohérente avec les cours d’introduction au métier VC.

Travaux et correction :

- le parcours `p-semaine-vc` a été retracé depuis `data/parcours.json`, les cours `c-decouvrir-vc` et `c-vc-job`, les leçons existantes et les résolveurs de parcours côté client, afin de corriger la donnée canonique plutôt que le rendu ;
- un registre drop-in dédié `data/parcours/02-une-semaine-vc.lessons.json` publie la leçon `lsv-vc-mise`, slug `mythe-vc-mise`, format `Respiration`, durée 4 minutes, deux quiz, trois points clés, termes liés et références ;
- le contenu explique pourquoi le mot « mise » est réducteur : allocation de capital sous incertitude, mandat de fonds, thèse, comité, diligence, construction de portefeuille, suivi, réinvestissements et responsabilité durable ;
- la section française qualifie le cadre sans survente : société de gestion, contraintes AMF selon le véhicule, rôle des investisseurs institutionnels, densité relationnelle, co-investissements, Bpifrance et programmes européens comme contexte de marché plutôt que suppression du risque ;
- l’étape finale du parcours pointe désormais vers la leçon publiée avec `courseId: c-decouvrir-vc`, au lieu du jalon `todo-myth-vc-mise`; le cours `c-decouvrir-vc` intègre cette respiration dans sa liste de leçons et sa durée passe à 23 minutes.

Vérifications finales :

- `npm run split:content && npm run validate:content` : exit 0 — 146 leçons, dont 22 drop-in de parcours, 419 termes et 397 marqueurs analysés ;
- premier `npm run check` : échec attendu après l’ajout initial, car la leçon n’était pas rattachée au cours référencé et le sitemap versionné n’était pas encore régénéré ; correction du rattachement et relance avec origine canonique ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run generate:sitemap && npm run test:node` : exit 0 ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build && npm run check` : exit 0 — sitemap de 695 routes, 1 796 modules transformés, prérendu strict 707/707 avec `ok: true`, puis `check:generated` à 146 leçons / 119 corps publiés / 419 termes, validations strictes, glossaire, TypeScript, ESLint, 64 fichiers / 404 tests Vitest et 58/58 tests Node ;
- recette Vite : `http://localhost:5173/parcours/une-semaine-dans-la-peau-d-un-vc` affiche la dernière carte en lien `RESPIRATION Mythe démonté : « le VC mise »`; `http://localhost:5173/lessons/mythe-vc-mise?parcours=p-semaine-vc&budget=high` affiche la leçon, les références, le quiz, les termes liés et la navigation de parcours ; console sans message ni erreur.

Fichiers touchés par cette correction : `data/parcours.json`, `data/courses.json`, `data/parcours/02-une-semaine-vc.lessons.json`, `data/generated/lessons.index.json`, `data/generated/lessons.bodies.json`, `client/public/sitemap.xml`, `client/src/content/lessons.test.ts`, `scripts/generated-content.test.mjs`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : contenu produit et route vérifiée localement. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté pendant cette passe.

---

## 2026-07-31 — Opacité de la topbar après le hero

Objet : vérifier puis corriger le comportement de la topbar de `/home`, transparente au-dessus du hero et opaque une fois son bord inférieur dépassé.

Constat et correction :

- le suivi de `pastHero` compare correctement le bas du premier hero au bas du header fixe, au montage puis sur `scroll` et `resize`, avec nettoyage symétrique des listeners ;
- la première recette réelle a révélé un défaut non couvert par le test initial : l’ajout conditionnel de `border-b` portait la hauteur extérieure du header de 54 à 55 px sur desktop et de 40,5 à 41,5 px sur mobile ; `backdrop-blur-md`, sans effet utile derrière un fond opaque, introduisait en outre un contexte de rendu superflu autour des descendants positionnés ;
- le contrat DOM a été durci classe par classe. Il a échoué comme attendu sur `border-b`, puis passe après réduction de l’état scrollé au seul fond opaque `bg-[color:var(--surface)]` ; le séparateur inset de `HOME_BAR_SHELL` reste actif et la géométrie ne varie plus au franchissement du seuil.
- une revue antérieure arrivée après la clôture a révélé que les deux tests de surface dépendaient du chargement préalable de la route : exécutés seuls, ils obtenaient un hero nul. Ils attendent désormais explicitement le sélecteur de production `#main > section:first-of-type`, simulent une topbar de 54 px, couvrent `hero.bottom = 55` (transparent), `54` (opaque via `resize`) puis le retour à `55` (transparent via `scroll`), et vérifient séparément les classes interdites ainsi que la couleur exacte du séparateur.

Vérifications finales :

- test ciblé `homeExperience.dom.test.tsx` : RED 24/25 sur la bordure conditionnelle, puis GREEN 25/25 ;
- exécution filtrée des deux tests de surface : RED 0/2 avec `hero` nul avant durcissement, puis GREEN 2/2 de manière autonome ; fichier complet toujours vert à 25/25 et ESLint ciblé sans sortie ;
- `npm run check` : exit 0, avec contenus générés à jour, validations strictes, glossaire, TypeScript, ESLint, 64 fichiers / 404 tests Vitest et 58/58 tests Node ;
- le premier `npm run build` sans environnement canonique échoue conformément au contrat fail-closed sur l’absence de `VITE_SITE_URL`. La relance `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` passe : 1 796 modules, sitemap de 694 routes et prérendu strict 706/706 avec `ok: true` ;
- une première tentative avec Vite Preview a confirmé qu’un serveur non configuré pour le préfixe canonique ne constitue pas une preuve valide : les assets sous `/vc-plateform/assets/` retournaient 404. Un serveur temporaire de recette, limité à l’artefact et au préfixe `/vc-plateform`, a ensuite servi la route propre sans redirection ;
- recette de l’artefact construit à 1 280 × 800 et 390 × 844, en clair et sombre : fond transparent au-dessus du hero, fond opaque `rgb(253, 252, 247)` ou `rgb(13, 14, 18)` après le seuil, séparateur inset conservé, hauteurs stables à 54 et 40,5 px, `scrollWidth === clientWidth`, aucune erreur console, erreur de page, requête échouée ou variation de chemin ;
- contre-revue indépendante sur les empreintes courantes de `TopBar.tsx` et `homeExperience.dom.test.tsx` : aucune erreur bloquante ; test ciblé et ESLint ciblé verts ;
- serveur et script temporaires supprimés, ports 4174 et 4175 libérés, sorties générées inchangées et `git diff --check` sans sortie.

Fichiers touchés : `client/src/components/chrome/TopBar.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : correction locale vérifiée. Aucun nouveau commit, staging, push, workflow distant ou déploiement n’a été exécuté pendant cette passe.

---

## 2026-07-30 — Correction de la géométrie des arcs éditoriaux

Objet : reprendre `HomeEditorialBridge` à partir des deux captures de référence fournies : deux larges arches chevauchées sur desktop ; une arche supérieure et une arche inférieure composant un ovale ouvert autour du bloc central sous 1 024 px.

Travaux et preuve RED–GREEN :

- un premier contrat DOM a échoué comme attendu sur l’ancien `viewBox` desktop `0 0 1000 318`, puis passe avec un canevas 5,85:1, deux demi-ellipses de ratio mesuré ≈ 3,17:1, une tangente verticale aux extrémités et un chevauchement central de 8 % ;
- un second contrat a échoué sur les deux anciennes courbes mobiles orientées vers le haut, puis passe avec une demi-ellipse supérieure et une demi-ellipse inférieure parcourues en sens opposés autour du bloc `Maison Sapience VC` ;
- un troisième passage RED a verrouillé le resserrement de la composition mobile. Les marges entre l’arche supérieure, le bloc central et l’arche inférieure passent respectivement à `mt-8`, `mt-3` et `mt-3`, avec `mt-7` avant la copie Intelligence VC ;
- les positions statiques des marqueurs sont alignées sur les nouveaux points terminaux. La direction vers le centre, le décalage de 1 s, l’invisibilité préalable du marqueur différé et le rendu sous mouvement réduit sont conservés.

Vérifications finales :

- test ciblé : trois cycles RED–GREEN observés, puis 24/24 tests verts ;
- `npm run typecheck`, `npm run lint`, `npm run test` et `npm run check` : exit 0 ; suite complète à 64 fichiers / 403 tests Vitest et 58/58 tests Node ;
- `VITE_SITE_URL=http://localhost:4173 npm run build` : exit 0, 1 796 modules, sitemap de 694 routes et prérendu strict 706/706 avec `ok: true` ;
- recette de l’artefact construit à 1 440 × 900 clair/sombre, 1 024 × 768 sombre, 768 × 1 024 clair, 390 × 844 sombre et 375 × 812 clair, plus mouvement réduit à 390 × 844 : aucun débordement horizontal, avertissement ou erreur console, erreur de page ou échec réseau ;
- desktop : ratio mesuré ≈ 3,2:1 par arche, chevauchement de 96 px à 1 440 px et 76,8 px à 1 024 px ; mobile/tablette : l’ovale ouvert est constitué de deux demi-ellipses distinctes, avec un ratio d’enveloppe ≈ 1,3 à 768 px et ≈ 1 à 390 px ; les marqueurs restent lisibles en clair, sombre et mouvement réduit ;
- la dernière copie conserve 23,77 px à 390 × 844 et 23,73 px à 375 × 812 au-dessus de la navigation fixe ; preview arrêté, port 4173 libre, `robots.txt` et `sitemap.xml` restaurés.

Fichiers touchés : `client/src/components/home/HomeEditorialBridge.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : correction locale vérifiée. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-30 — Clôture de la section éditoriale animée de l’accueil

Objet : clore l’implémentation de `HomeEditorialBridge` sous le hero de `/home`, nettoyer les artefacts de recette et reproduire les validations automatiques et visuelles sur l’artefact construit.

Travaux et preuve RED–GREEN :

- les quatre scripts temporaires `.tmp-vc-home-bridge-*.mjs` ont été relus puis supprimés ; le preview résiduel sur 4173 a été arrêté avant les validations ;
- la première recette réelle a mis en évidence deux variantes du même défaut : le marqueur Intelligence différé restait visible à l’origine du SVG pendant sa seconde d’attente sur desktop, et les arcs empilés lançaient leurs deux marqueurs sans décalage ;
- un test DOM a d’abord échoué avec 7 animations immédiates au lieu de 4. Il exige désormais quatre départs à `0s`, quatre départs à `1s` et une opacité nulle jusqu’au déclenchement de chaque marqueur différé ;
- `HomeEditorialBridge.tsx` associe le délai au marqueur Intelligence sur les variantes desktop et empilées. Une animation d’opacité le maintient invisible avant `begin="1s"`, puis le mouvement et l’échelle suivent le même cycle de 4 s ; le rendu statique en mouvement réduit reste inchangé.

Vérifications finales :

- test ciblé `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` : RED attendu 21/22, puis GREEN 22/22 ;
- `npm run typecheck` et `npm run lint` : exit 0 ;
- le premier `npm run test` complet a correctement signalé la dérive locale de `robots.txt`/`sitemap.xml` produite par un build précédent avec une origine locale. Après restauration des sorties versionnées, la répétition passe : 64 fichiers / 401 tests Vitest et 58/58 tests Node ;
- `npm run check` : exit 0, contenu généré à jour, validations strictes, glossaire, TypeScript, ESLint et tests verts ;
- `VITE_SITE_URL=http://localhost:4173 npm run build` : exit 0, 1 796 modules transformés, sitemap de 694 routes et prérendu strict 706/706 avec `ok: true`, sans échec de route, métadonnée ou infrastructure ;
- preview de l’artefact à 1 440 × 900 clair/sombre, 1 024 × 768 sombre, 768 × 1 024 clair, 390 × 844 sombre et 375 × 812 clair, plus `prefers-reduced-motion` à 390 × 844 : aucun débordement horizontal, erreur console, erreur de page ou requête échouée. Les arcs desktop partent de côtés opposés et terminent croisés au centre ; les marqueurs sont carrés et de couleurs distinctes ; les mesures à 1 450 puis 2 450 ms confirment Formation vers la droite et Intelligence VC vers la gauche. Le marqueur différé est invisible à 450 ms et visible à 1 450 ms ;
- la navigation mobile reste fixe et ne masque pas la dernière copie : marge mesurée de 79,77 px à 390 × 844 et 79,73 px à 375 × 812. En mouvement réduit, aucune animation SMIL n’est montée et les deux marqueurs statiques restent visibles ;
- serveur de preview arrêté, port 4173 libre, scripts temporaires absents et sorties `robots.txt`/`sitemap.xml` restaurées après le build local.

Fichiers touchés par cette clôture : `client/src/components/home/HomeEditorialBridge.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : implémentation locale vérifiée. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-30 — Superposition des menus de l’accueil

Objet : placer les menus déroulants `Formation` et `Intelligence VC` au premier plan sur `/home`, de sorte que le changement de thème et la barre dev-only `Aperçu responsive` ne restent pas visibles au-dessus des panneaux.

Travaux et preuve RED–GREEN :

- `homeExperience.dom.test.tsx` ajoute un contrat de pile : header d’accueil au-dessus de la barre dev-only, panneau de pôle au-dessus du contrôle de thème et suppression de l’ancien `z-50` du panneau. Le premier lancement ciblé échoue sur le panneau encore en `z-50` ;
- `TopBar.tsx` remonte la racine de la barre `/home` à `z-[75]` et le panneau à `z-[85]`. Cette correction est nécessaire parce que le panneau reste descendant du stacking context du header ;
- `homeBar.ts` remonte de même la navigation basse mobile à `z-[75]`, afin que les panneaux ouverts depuis cette racine passent aussi devant le contrôle de thème ;
- `ViewportSwitcher.tsx` expose `data-device` sur la barre de prévisualisation. En mode desktop, sa pile descend à `z-index: 65`, derrière le chrome produit ; en mode tablette/mobile encadré, son z-index élevé est conservé pour rester utilisable au-dessus de la scène iframe ;
- `ViewportSwitcher.dom.test.tsx` verrouille ce contrat dev-only.

Vérifications finales :

- RED ciblé `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` : exit 1 attendu, 1 échec sur le contrat de pile ;
- RED ciblé `npm run test --workspace client -- src/components/dev/ViewportSwitcher.dom.test.tsx` : exit 1 attendu, absence initiale de `data-device` et du z-index desktop abaissé ;
- répétitions ciblées vertes : `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx` retourne 19/19 ; `npm run test --workspace client -- src/components/dev/ViewportSwitcher.dom.test.tsx` retourne 1/1 ;
- `npm run typecheck` et `npm run lint` retournent exit 0 ;
- `npm run test` retourne exit 0 : 64 fichiers / 398 tests Vitest et 58/58 tests Node ;
- recette navigateur Vite `http://127.0.0.1:5174/home` à 1 280 × 633 : panneau Formation ouvert, `z` mesurés header 75, panneau 85, thème 70, `Aperçu responsive` 65 ; `elementFromPoint` en bas à gauche retourne le panneau, non le bouton de thème. Panneau Intelligence VC ouvert, `elementFromPoint` au centre de la barre `Aperçu responsive` retourne le panneau, non la barre dev-only. Console sans erreur JavaScript ; serveur arrêté et port 5174 libre ;
- `git diff --check -- client/src/components/chrome/TopBar.tsx client/src/components/chrome/homeBar.ts client/src/components/dev/ViewportSwitcher.tsx client/src/components/dev/ViewportSwitcher.dom.test.tsx client/src/pages/home/homeExperience.dom.test.tsx` ne produit aucune sortie.

Fichiers touchés par cette correction : `client/src/components/chrome/TopBar.tsx`, `client/src/components/chrome/homeBar.ts`, `client/src/components/dev/ViewportSwitcher.tsx`, `client/src/components/dev/ViewportSwitcher.dom.test.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : correction locale vérifiée. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-30 — Réduction des barres de navigation de l’accueil sous 768 px

Objet : réduire de 25 % la hauteur cumulée du header et de la navigation basse de `/home` aux largeurs inférieures à 768 px, avec un plafond de 10 % de la hauteur du viewport, sans modifier le chrome desktop.

Contrat et travaux :

- `tokens.test.ts` a d’abord exigé un media query `max-width: 767px`, deux tokens égaux à `min(2.53125rem, 5svh)`, une réduction de 25 % par rapport à 54 px et une somme plafonnée à 10svh ; le RED ciblé échoue sur l’absence de cette surcharge ;
- `tokens.css` centralise ensuite ces deux hauteurs compactes. Les boutons de la marque et des pôles remplissent la hauteur disponible sous 768 px, tandis que les classes `md:h-auto md:min-h-11` conservent les cibles desktop existantes ;
- la première recette réelle a mesuré 40,5 px pour le header et 41,5 px pour la barre basse : sa bordure ajoutait un pixel au budget. Elle a aussi montré que le cercle visible de 44 px du contrôle de thème dépassait le trait inférieur du header ;
- un second RED DOM a verrouillé la hauteur extérieure de la navigation, l’inclusion de sa bordure et la séparation entre cible et cercle visible du thème. `HOME_MOBILE_NAV_SHELL` utilise désormais une boîte fixe incluant la bordure, les contrôles occupent la hauteur utile restante et le contrôle de thème conserve sa cible de 44 × 44 px autour d’un cercle visuel de 32 px contenu dans le header ;
- `docs/DESIGN_SYSTEM.md` consigne les tokens, le breakpoint, le budget vertical et le contrat de la cible de thème.

Vérifications finales :

- répétition ciblée : `npm run test --workspace client -- src/styles/tokens.test.ts src/pages/home/homeExperience.dom.test.tsx` retourne exit 0, 2 fichiers / 21 tests ;
- build canonique `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0, 1 795 modules transformés, sitemap de 694 routes et prérendu strict 706/706 avec `ok: true` ;
- `npm run check` post-build : exit 0, contenu généré à jour, validations strictes, glossaire, TypeScript et ESLint sans erreur, 63 fichiers / 396 tests Vitest et 58/58 tests Node ;
- recette à 390 × 844 tactile : header 40,5 px, navigation basse 40,5 px, total 81 px, réduction exacte de 25 % par rapport à 108 px et occupation de 9,597 % du viewport ; cercle de thème contenu dans le header, panneau Formation borné de 40,5 à 803,5 px, aucun débordement horizontal ni message console ;
- recette à 390 × 667 tactile : total mesuré 66,688 px pour un plafond de 66,7 px, soit 9,998 % ; cercle de thème contenu dans le header et aucun débordement horizontal ;
- recette à 1 440 × 1 000 : header conservé à 54 px, trois commandes desktop, aucune navigation basse, contrôle de thème à 28 px des bords gauche et inférieur, aucun débordement horizontal ;
- serveurs temporaires arrêtés, fichier de recette supprimé et ports 4173 et 4174 libres.

Fichiers touchés par cette correction : `client/src/styles/tokens.css`, `client/src/styles/tokens.test.ts`, `client/src/components/chrome/homeBar.ts`, `client/src/components/chrome/TopBar.tsx`, `client/src/pages/home/HomePage.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `docs/DESIGN_SYSTEM.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : correction locale vérifiée. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-30 — Rectification du contrôle de thème sur desktop

Objet : appliquer la correction de contrat suivant la recette initiale : le contrôle de thème doit rester en bas à gauche sur desktop ; seul son placement mobile passe en haut à gauche.

Travaux et preuve RED–GREEN :

- le contrat DOM a été réécrit avant la production pour exiger `top-1 left-3` sur mobile, puis `md:bottom-7 md:left-7 md:top-auto` à partir de 768 px ; le premier lancement ciblé échoue avec 1 test sur 18, car le composant portait encore sa position sous le header ;
- `HomePage.tsx` remplace la position desktop haute par une position fixe à 28 px des bords gauche et inférieur, sans modifier la cible de 44 px, l’opacité réduite ni la position mobile ;
- la répétition ciblée passe ensuite avec 18/18 tests.

Vérifications finales :

- `npm run check` post-build et `git diff --check` : exit 0 ; 63 fichiers / 395 tests Vitest, 58/58 tests Node, TypeScript et ESLint sans erreur ;
- build canonique : exit 0 ; 1 795 modules transformés, sitemap de 694 routes et prérendu strict 706/706 avec `ok: true` ;
- recette de l’artefact : à 390 × 844, le contrôle reste fixé à `left: 12 px; top: 4 px` pendant le défilement ; à 1 440 × 1 000, il reste fixé à `left: 28 px; bottom: 28 px`, avant et après défilement. Aucun débordement horizontal ni message console ;
- serveur temporaire arrêté, fichier de recette supprimé et ports 4173, 4174 et 5174 libres.

Fichiers touchés par cette rectification : `client/src/pages/home/HomePage.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : correction locale vérifiée. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-30 — Navigation basse responsive de l’accueil

Objet : rapprocher l’accueil du comportement mobile observé sur The Footprint Firm : conserver uniquement la marque en haut aux petites largeurs, déplacer `Formation` et `Intelligence VC` dans une navigation persistante au bas du viewport, et rendre le changement de thème moins saillant en haut de l’écran, sans modifier le contrat desktop.

Référence et décisions :

- la référence a été inspectée à 390 × 844 : marque seule dans l’en-tête, deux accès latéraux dans une barre fixe basse, séparateur central et panneau déployé au-dessus de cette barre ; son DOM confirme une bascule au breakpoint `md` ;
- le contrat local adopte donc `max-width: 767px` pour la variante compacte ; à partir de 768 px, `Formation`, `Maison Sapience VC` et `Intelligence VC` restent dans la barre supérieure existante ;
- le contrôle clair/sombre conserve une cible de 44 × 44 px, mais passe en haut à gauche avec une opacité de 0,6 au repos et 1 au survol ou au focus : dans la barre visuelle sur mobile, puis sous l’en-tête sur desktop pour ne pas concurrencer `Formation`.

Travaux :

- `HomeTopBar` monte une seule variante selon `matchMedia` : titre central seul et navigation `Pôles de l’accueil` fixe en bas sur petites largeurs, ou barre à trois commandes sur desktop. La navigation basse reste hors du landmark `header`, tient compte de la safe area et conserve l’ouverture au toucher, au clavier et à la souris ;
- les panneaux mobiles occupent exactement l’espace entre la barre haute et la navigation basse. Un premier essai avec `backdrop-filter` sur la navigation créait un contenant pour ses descendants `position: fixed` et repoussait le panneau sous le viewport ; le contrat a été reproduit en échec, puis corrigé en retirant ce filtre et en renforçant légèrement l’opacité de fond ;
- le clic extérieur considère désormais la navigation basse comme une surface interne, ce qui permet au second appui tactile de refermer le panneau ;
- le rideau d’entrée n’affiche plus ses deux pôles latéraux sur la variante compacte, de sorte que l’assemblage temporaire et la barre finale portent le même contrat visuel ;
- `MainLayout` réserve au bas de `/home` la hauteur de la navigation mobile afin que le contenu final ne soit pas masqué ; `--home-mobile-nav-h` centralise cette géométrie.

Contrat RED–GREEN :

- `homeExperience.dom.test.tsx` a d’abord échoué sur l’absence de navigation basse, la position antérieure du bouton de thème et le maintien des trois commandes dans le header ; après implémentation, il vérifie le breakpoint compact, la séparation sémantique header/navigation, la réserve basse, le panneau borné entre les deux barres et le second appui tactile ;
- un second RED a reproduit la présence de `backdrop-blur-md` sur l’ancêtre du panneau fixe ; le correctif supprime ce nouveau contenant de positionnement ;
- `homeIntro.dom.test.tsx` vérifie en plus que la copie temporaire n’affiche que la marque aux petites largeurs ; la répétition ciblée finale couvre 2 fichiers / 23 tests verts.

Vérifications finales :

- `npm run check` post-build et `git diff --check` : exit 0 ; contenu généré à jour, validations strictes, glossaire, TypeScript et ESLint sans erreur, 63 fichiers / 395 tests Vitest et 58/58 tests Node ;
- build canonique `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 ; 1 795 modules transformés, sitemap de 694 routes et prérendu strict 706/706 avec `ok: true`, sans échec de route ou de métadonnée ;
- recette de l’artefact sous `/vc-plateform/home` : à 390 × 844 tactile, le header ne contient que la recherche par la marque, la navigation basse mesure 390 × 55 px et reste fixe après 1 935,5 px de défilement, comme le contrôle de thème ; le panneau Formation occupe `top: 54` à `bottom: 790`, se pose au-dessus de la barre, expose ses quatre liens et se referme au second appui tactile. Aucun débordement horizontal ni message console ;
- à 1 440 × 1 000, la navigation basse est absente, les trois commandes desktop restent dans le header, le contrôle de thème est placé à 28 × 70 px sous la barre et aucun débordement horizontal ni message console n’est relevé ;
- les serveurs temporaires ont été arrêtés, leurs fichiers supprimés et les ports 4173, 4174 et 5174 vérifiés libres.

Fichiers touchés par cette passe : `client/src/components/chrome/homeBar.ts`, `client/src/components/chrome/TopBar.tsx`, `client/src/components/home/HomeIntro.tsx`, `client/src/components/home/homeIntro.dom.test.tsx`, `client/src/layouts/MainLayout.tsx`, `client/src/pages/home/HomePage.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `client/src/styles/tokens.css`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : correction locale vérifiée. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-29 — Séquence d’entrée de l’accueil et agrandissement de la marque

Objet : agrandir la marque centrale de la barre `/home` et remplacer l’apparition immédiate de l’accueil par une séquence d’entrée, en transposant la structure observée sur The Footprint Firm — un en-tête qui s’assemble au centre puis se pose en haut de page — sans reprendre sa marque, ses textes, sa palette ni ses assets.

Travaux :

- `client/src/components/chrome/homeBar.ts` centralise la géométrie et la typographie de la barre d’accueil ainsi que les deux piliers `Formation` et `Intelligence VC` ; la barre fixe et la copie temporaire lisent les mêmes constantes, ce qui est la condition du relais sans saut ;
- marque centrale portée de `0,74 / 0,95 rem` à `0,82 rem` en mobile, `1,06 rem` à partir de `sm` et `1,18 rem` à partir de `lg`, avec le tracking resserré aux petites largeurs pour absorber la largeur supplémentaire ; `Sapience VC` conserve son poids 600 ;
- `client/src/components/home/HomeIntro.tsx` monte le rideau et publie sa phase par `HomeIntroContext` : la barre fixe s’efface pendant la séquence puis revient en fondu, `HomePage` retarde la révélation de son hero ;
- chronologie portée par `client/src/styles/home-intro.css` — voile seul jusqu’à 0,5 s, marque de 0,6 à 1,2 s, ligne fine étirée du centre de 1,4 à 1,9 s, pôles latéraux de 1,8 à 2,2 s, montée de `50svh − hauteur_barre / 2` de 2,4 à 3,2 s, révélation du titre de 3,0 à 3,8 s, fondu croisé avec la barre réelle de 3,6 à 3,8 s, démontage à 3,9 s ;
- voile différencié par mode : en clair la photographie du splash se dissout pendant la montée, de 2,4 à 3,2 s, pour que le fond et l’en-tête arrivent d’un même geste ; en sombre le voile reprend `bg-sombre.webp`, l’image que `NightSkyBackdrop` affiche déjà, de sorte que sa disparition ne modifie rien à l’écran ;
- déclenchement borné : la séquence joue au premier rendu sur `/home` et à l’arrivée depuis le portail, jamais lorsque l’accueil est rejoint depuis l’intérieur de l’application ; elle est entièrement neutralisée sous `prefers-reduced-motion` ;
- le rideau est `aria-hidden` et ne contient aucun élément focusable ; la barre fixe est retirée par `visibility`, donc hors ordre de tabulation et hors arbre accessible pendant la séquence ;
- `scripts/prerender.mjs` émule `prefers-reduced-motion: reduce` avant chaque navigation. Sans cette garde, le HTML statique de `/home` aurait figé le voile et une barre invisible ; l’artefact porte désormais la mise en page stabilisée.

Contrat ajouté :

- `client/src/components/home/homeIntro.dom.test.tsx` couvre le déclenchement à l’arrivée directe, l’assemblage de l’en-tête temporaire, son exclusion de l’arbre accessible, l’identité typographique entre la copie et la barre réelle, et l’absence de séquence lorsque `/home` est rejointe depuis une autre route.

Vérifications :

- **aucune commande n’a été exécutée dans cette session.** Le dossier du dépôt n’était pas accessible depuis l’environnement d’exécution : ni `npm run check`, ni `npm run test`, ni le build canonique, ni le prérendu strict, ni de recette navigateur n’ont pu être lancés ;
- la revue a donc été statique : types, imports, règles ESLint applicables, comportement de `tailwind-merge` sur les classes fusionnées, et confrontation aux attentes des contrats existants `homeExperience.dom.test.tsx` et `MainLayout.dom.test.tsx` ;
- restent à exécuter avant toute clôture : `npm run test --workspace client -- src/components/home/homeIntro.dom.test.tsx src/pages/home/homeExperience.dom.test.tsx`, puis `npm run check`, puis le build canonique avec son résumé de prérendu strict, puis une recette `/home` en 1 440 × 1 000 et 390 × 844, thèmes clair et sombre.

Fichiers touchés : `client/src/components/chrome/homeBar.ts`, `client/src/components/chrome/TopBar.tsx`, `client/src/components/home/HomeIntro.tsx`, `client/src/components/home/homeIntro.dom.test.tsx`, `client/src/context/HomeIntroContext.ts`, `client/src/layouts/MainLayout.tsx`, `client/src/pages/home/HomePage.tsx`, `client/src/styles/home-intro.css`, `scripts/prerender.mjs`, `docs/DESIGN_SYSTEM.md`, `README.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : livraison **non vérifiée**, consignée comme telle dans `ETAT.md` sous forme de risque bloquant avant clôture. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-29 — Refonte minimale et interactive de l’accueil

Objet : remplacer l’accueil éditorial dense par un hero plein écran servant d’aiguillage entre Formation et Intelligence VC, en adaptant les principes structurels observés sur The Footprint Firm sans reprendre sa marque, ses textes, sa palette ni ses assets.

Travaux :

- barre fixe propre à `/home`, limitée à `Formation`, `Maison Sapience VC` et `Intelligence VC` ; le `TopBar` standard reste utilisé sur `/onboarding` et le `SideNav` sur les autres routes ;
- panneaux alimentés par `NAVIGATION_PILLARS`, demi-largeur sur desktop et pleine largeur sur mobile, avec ouverture au survol ou au focus, délai de grâce de 180 ms, alternance au toucher, fermeture extérieure, changement de route et `Escape` avec restitution du focus ;
- titre central relié à la `CommandPalette` existante au survol, au clic et au clavier, sans ouverture au simple focus ; `Sapience VC` est isolé en léger gras et le titre est agrandi pour rendre la marque plus visible ;
- recherche de l’accueil rendue comme barre glass premium sous le titre, sans texte d’aide au repos ; la fermeture se fonde sur une zone tolérante titre-corridor-barre et non sur un `pointerleave` immédiat de la surface ;
- hero unique conservant `Documenter le raisonnement. Affûter le jugement.`, son paragraphe, `CompassRose`, `NightSkyBackdrop` et le sélecteur clair/sombre ; retrait des sections basses redondantes et du footer sur l’accueil ;
- extension du contexte UI avec `searchOpen`, uniquement pour coordonner la fermeture et le réarmement du déclencheur central ; noms accessibles latéraux neutralisés sur `Formation` et `Intelligence VC`, l’état restant porté par `aria-expanded` et `aria-controls`.

Contrat RED–GREEN et contre-revue :

- création de `client/src/pages/home/homeExperience.dom.test.tsx`, dont les douze tests couvrent structure, contenus propres aux deux pôles, hover, focus, toucher, délai résiduel, clic souris, activation pointeur abandonnée, `Escape` global, recherche glass, zone titre-corridor-barre, réarmement, titre central et hero ; adaptation du test du tiroir mobile standard à `/onboarding` ;
- une première contre-revue indépendante a signalé trois erreurs logiques : `Escape` inopérant lorsque le focus restait hors du panneau, survol de recherche non réarmé après une sortie pendant la modale et clic souris refermant immédiatement un panneau ouvert au hover ; chacune a été reproduite par un test en échec, corrigée puis vérifiée ;
- la recette de l’artefact a révélé que la modale pouvait masquer le titre sans lui livrer de `mouseleave`. Un quatrième scénario RED suit donc la position physique du pointeur pendant l’ouverture : fermeture sous pointeur resté dans la zone sans réouverture, mais nouveau hover actif après sortie réelle ;
- une vérification supplémentaire a remplacé les libellés d’action statiques « Ouvrir » par les noms neutres visibles des deux boutons, afin de conserver une annonce cohérente lorsque le toucher ferme au second appui.
- une seconde contre-revue a isolé un état pointeur résiduel après `pointerdown` suivi d’un relâchement hors du bouton : le `pointerId` et le type sont désormais conservés jusqu’au clic normal ou purgés après le `pointerup` écouté au niveau du document ; le timer et le listener sont nettoyés au démontage. Le scénario a été reproduit RED puis validé GREEN, et le test tactile inclut explicitement `pointerup` avant `click`. La frame de réarmement de recherche est également annulée au démontage.
- la contre-revue indépendante finale retourne `passed: true`, sans problème de sécurité ni erreur logique. Ses deux suggestions non bloquantes sont de rendre encore plus explicites les tests du pointeur stationnaire après fermeture de la recherche et les chemins `pointercancel`, sortie de fenêtre et démontage ; les comportements principaux correspondants sont déjà couverts par la recette réelle, les nettoyages du composant et le contrat DOM actuel.

Vérifications finales :

- `npm run typecheck`, `npm run lint` et `npm run test` : exit 0 ; 62 fichiers / 381 tests Vitest et 58/58 tests Node ;
- répétition ciblée de `homeExperience.dom.test.tsx` : 20/20 exécutions réussies après la correction de la course pointeur/focus ;
- `npm run check:generated` : exit 0 ; 145 leçons, 118 corps publiés et 419 termes ;
- `VITE_SITE_URL=http://127.0.0.1:4173 npm run build` : exit 0 ; 1 791 modules transformés, sitemap de 694 routes et prérendu strict 706/706, `ok: true`, sans échec de route ou de métadonnée ; `sitemap.xml` et `robots.txt` ont ensuite été restaurés à leur origine canonique ;
- recette de l’artefact construit : desktop 1 440 × 1 000 et mobile tactile 390 × 844, thèmes clair et sombre, panneaux Formation et Intelligence VC, recherche, focus, `Escape`, clic extérieur, clic souris après hover, activation pointeur abandonnée suivie d’un retour au clavier, second appui tactile, réarmement de recherche, absence de débordement horizontal et console sans erreur applicative ;
- scan des lignes ajoutées : aucun secret en dur, `eval`, HTML non sûr, code de débogage, `TODO` ou `FIXME` ; `git diff --check` retourne exit 0 ; port 4173 fermé.
- ajustements finaux après retours visuels : `npm run test --workspace client -- src/pages/home/homeExperience.dom.test.tsx`, `npm run typecheck --workspace client` et `npm run lint --workspace client` retournent exit 0 ; recette Vite locale sur `/home` confirmant la barre glass sans message d’aide, le maintien dans le corridor titre-barre, la fermeture hors zone, le titre agrandi et `Sapience VC` en poids 600 ; port 5174 fermé après recette.

Fichiers touchés : `client/src/components/chrome/TopBar.tsx`, `client/src/components/chrome/mobileLayers.dom.test.tsx`, `client/src/components/ui/CommandPalette.tsx`, `client/src/components/ui/Modal.tsx`, `client/src/context/UIContext.ts`, `client/src/context/UIProvider.tsx`, `client/src/layouts/MainLayout.tsx`, `client/src/pages/home/HomePage.tsx`, `client/src/pages/home/homeExperience.dom.test.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. Le plan local `.hermes/plans/2026-07-29_025140-accueil-minimal-aiguillage.md` reste non suivi.

Clôture : réalisation locale vérifiée et contre-revue indépendante finale validée. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-27 — Correction de provenance et de rendu des deux leçons deeptech

Objet : revue en lecture des deux leçons publiées le jour même, récupération de chaque source citée, puis correction des écarts constatés. Aucun objet nouveau, aucune route, aucun compteur modifié.

Trois écarts corrigés, aucun contourné :

- localisateur NASEM inventé. `ldt-reproductibilite` citait « chapitre 3, Conclusion 3-1 ». La récupération de `https://www.nationalacademies.org/read/25303/chapter/3` montre que cette URL sert le résumé du rapport et ne contient pas la chaîne « Conclusion 3-1 ». Le fond restait exact : le résumé porte une section `DEFINITIONS` donnant « obtaining consistent results using the same input data; computational steps, methods, and code; and conditions of analysis » et « obtaining consistent results across studies aimed at answering the same scientific question, each of which has obtained its own data ». Le localisateur devient « résumé, section Definitions » ;
- deux spécificités RAND non soutenues. `ldt-pilote-preuve` affirmait « en Amérique du Nord » et « sur environ quinze ans ». La notice éditeur `https://www.rand.org/pubs/reports/R2569.html` n'énonce ni l'une ni l'autre ; elle établit « Detailed proprietary information on 44 process plants built by 34 oil, chemical, and mineral companies sustain the quantitative analysis ». Le PDF officiel est un fac-similé sans texte extractible, donc rien de plus n'est vérifiable par cette voie. Le paragraphe et la référence sont réécrits sur l'échantillon réellement documenté ; l'initiale « E. » attribuée à Kenneth Phillips, absente de la notice, est retirée ;
- bloc « À retenir » dupliqué à l'écran. `LessonPage.tsx:242` rend déjà `keyTakeaways` dans un encart intitulé « À retenir ». Les deux leçons ajoutaient une section `## À retenir` dont les quatre points reprenaient les quatre `keyTakeaways`, produisant deux fois le même titre et la même matière sur la page. Aucune autre leçon du corpus n'employait ce titre. Les deux sections sont supprimées et `client/src/content/deeptechEvidenceLearning.test.ts` interdit désormais `## À retenir` dans le corps des leçons du cours.

Le marqueur `[[scalability|scalability]]` est par ailleurs remplacé par `[[scalability|scalabilité du modèle économique]]`, le libellé antérieur reproduisant le slug.

Vérifications :

- `readMin` recalculé avec le régime exact du contrat — 618 jetons pour `ldt-reproductibilite` et 628 pour `ldt-pilote-preuve`, soit 4 et 4 minutes inchangées ; `c-dt-preuve-scientifique` conserve `durationMin: 8` et aucun garde de comptage ne bouge ;
- sources revérifiées avant correction : les DOI `10.59161/JCGM200-2012` et `10.59161/JCGM100-2008F` résolvent vers les notices BIPM correspondantes ; le VIM en ligne confirme que 2.20 à 2.25 couvrent condition de répétabilité, répétabilité de mesure, condition et fidélité intermédiaires, condition de reproductibilité et reproductibilité de mesure, et que 2.20 énonce bien « même procédure de mesure, mêmes opérateurs, même système de mesure, mêmes conditions de fonctionnement et même lieu, ainsi que des mesurages répétés […] pendant une courte période de temps » ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build && npm run check` retourne exit 0. Le `prebuild` régénère 411 termes et 141 leçons (120 bibliothèque + 21 parcours), valide 380 marqueurs et écrit un sitemap de 681 routes ; le client transforme 1 791 modules ; le `postbuild` prérend 693/693 avec `{"mode":"strict","expected":693,"attempted":693,"written":693,"routeFailures":[],"metadataFailures":[],"browserError":null,"infrastructureError":null,"notFoundWritten":true,"notFoundFailure":null,"issues":[],"ok":true}` ;
- le gate confirme 141 leçons, 114 corps publiés et 411 termes, contenu strict, glossaire, TypeScript, ESLint, 60 fichiers / 367 tests Vitest et 58/58 tests Node. Le chunk `lessons.bodies` s'établit à 880,64 kB avant gzip et 238,08 kB gzip.

Limite de la contre-revue antérieure : la revue de provenance de la passe précédente contrôlait la présence des sources et le bornage des affirmations, non le soutien proposition par proposition dans la page citée. C'est ce qui a laissé passer un localisateur inexistant et deux spécificités absentes de la source.

Limites de cette passe : la recette navigateur des deux pages de leçon doit être refaite sur l'artefact corrigé, les corps ayant changé ; la recette antérieure n'avait pas relevé la duplication du bloc « À retenir ». Aucun praticien n'a relu le contenu.

Fichiers touchés : `data/lessons.json`, `client/src/content/deeptechEvidenceLearning.test.ts`, `data/generated/lessons.index.json` et `data/generated/lessons.bodies.json` régénérés par le build, `client/public/sitemap.xml` et `client/public/robots.txt` réécrits à l'identique par le `prebuild`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : aucun commit, staging, push, workflow distant ou déploiement n'a été exécuté.

---

## 2026-07-27 — Deeptech : preuve scientifique, reproductibilité et pilote

Objet : exécuter intégralement le plan `.hermes/plans/2026-07-27_115952-deeptech-preuve-scientifique.md` après recette initiale obligatoire de `l-specialty-deeptech-trl-ip`, en ajoutant un cours deeptech publié, deux leçons sourcées et les termes de glossaire associés, sans créer de parcours, certification, cas, dossier ou livrable.

Travaux :

- conservation de la leçon `l-specialty-deeptech-trl-ip` dans `c-analyst-specialties` ; aucune duplication ni déplacement de cette première brique ;
- création du cours `c-dt-preuve-scientifique` / `preuve-scientifique-deeptech`, niveau `avance`, durée dérivée `lesson-read-minutes`, 2 leçons et 8 minutes ;
- création des leçons publiées `ldt-reproductibilite` / `reproductibilite-robustesse-deeptech` et `ldt-pilote-preuve` / `pilote-preuve-changement-echelle`, chacune à 4 minutes, avec quiz, points clés, références et limites explicites du rôle de l'Analyst ;
- ajout de six termes source-backed, synchronisés dans `data/sources/canonical-glossary.json` et `data/glossary.json` : `repetabilite-mesure`, `reproductibilite-mesure`, `replicabilite-scientifique`, `incertitude-mesure`, `pilote-industriel`, `changement-echelle-industriel` ;
- retrait de l'alias ambigu `pilote` de `proof-of-concept`, sans rattacher `ldt-pilote-preuve` à `scalability` ;
- ajout du test vertical `client/src/content/deeptechEvidenceLearning.test.ts` et mise à jour des gardes de comptage réels : 114 leçons publiques, 141 leçons générées, 114 corps publiés et 411 termes.

Sources inspectées et utilisées :

- JCGM 200:2012, Vocabulaire international de métrologie, DOI `https://doi.org/10.59161/JCGM200-2012` — répétabilité, reproductibilité et conditions de mesure ;
- JCGM 100:2008(F), Guide pour l'expression de l'incertitude de mesure, DOI `https://doi.org/10.59161/JCGM100-2008F` — incertitude et caractère incomplet d'un résultat sans expression de l'incertitude ;
- National Academies, *Reproducibility and Replicability in Science*, chapitre 3, `https://www.nationalacademies.org/read/25303/chapter/3` — distinction reproductibilité computationnelle / réplicabilité scientifique ;
- Commission européenne, Horizon 2020, annexe G TRL, `https://ec.europa.eu/research/participants/data/ref/h2020/other/wp/2018-2020/annexes/h2020-wp1820-annex-g-trl_en.pdf` — TRL 4 à 7 et environnements de preuve ;
- RAND R-2569-DOE, `https://www.rand.org/pubs/reports/R2569.html` — 44 installations pionnières de procédés en Amérique du Nord, utilisé comme alerte méthodologique bornée et non comme benchmark universel.

Vérifications :

- RED ciblé : `npm run test --workspace client -- src/content/deeptechEvidenceLearning.test.ts` retourne exit 1 avant implémentation, sur l'absence du cours et sur l'alias `pilote` encore présent dans `proof-of-concept` ;
- GREEN ciblé : la même commande retourne exit 0 — 2 tests ;
- dérivés et validations ciblées : `npm run split:content && npm run test --workspace client -- src/content/deeptechEvidenceLearning.test.ts src/content/lessons.test.ts && npm run validate:glossary && npm run validate:content` retourne exit 0 — 411 termes, 141 leçons, 114 corps publiés, 380 marqueurs et cinq tests ciblés verts ;
- build canonique : `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform/ npm run build` retourne exit 0 — 1 791 modules transformés, sitemap 681 routes, prérendu strict 693/693, résumé `ok: true`, aucun échec de route ou de métadonnée ;
- gate post-build : `npm run check` retourne exit 0 — fraîcheur des générés, contenu strict, glossaire, TypeScript, ESLint, 60 fichiers / 367 tests Vitest et 58/58 tests Node ;
- `git diff --check` ciblé sur les fichiers touchés retourne exit 0.

Recette navigateur finale sous `http://127.0.0.1:4174/vc-plateform/` :

- desktop 1 440 × 1 000 : le nouveau cours affiche le titre, 2 leçons, 8 minutes, les deux cartes publiées et aucun débordement horizontal ; les deux leçons affichent références, quiz, points clés et limites d'expertise ; console vide ;
- mobile tactile 390 × 844 : le cours affiche les deux leçons `en cours`, 4 minutes chacune, sans état `à venir` ni débordement horizontal ; la zone références de la première leçon reste lisible ; console vide ;
- non-régression TRL/PI : `/bibliotheque?type=lesson&q=TRL` expose une seule carte vers `deeptech-trl-propriete-intellectuelle`, `9 min`, `AVANCÉ`, sans `à venir` ; le cours `specialisations-sectorielles-analyst` conserve `14 leçons`, `17 min`, TRL/PI au rang 05, et l'entrée 06 industrialisation reste distincte et `à venir`.

Contre-revues finales en lecture seule :

- revue provenance éditoriale : 6/6 contrôles passent — sources de chaque leçon présentes, claims bornés, absence de certification/cas/dossier, rôle de l'Analyst limité à l'instruction et à la préparation d'expertise ;
- revue intégration/publication : 6/6 contrôles passent — parité glossaire canonique/public, `sourceStatus: source-backed`, alias ambigu supprimé, `scalability` non réaffecté, nouvelles routes au sitemap et origine canonique Pages restaurée.

Fichiers touchés : `data/courses.json`, `data/lessons.json`, `data/glossary.json`, `data/sources/canonical-glossary.json`, `data/generated/*`, `client/src/content/deeptechEvidenceLearning.test.ts`, `client/src/content/lessons.test.ts`, `scripts/generated-content.test.mjs`, `client/public/sitemap.xml`, `client/public/robots.txt`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : lot deeptech preuve scientifique livré localement et vérifié. Aucun commit, staging, push, workflow distant ou déploiement n'a été exécuté.

---

## 2026-07-27 — Publication de la leçon deeptech TRL et propriété intellectuelle

Objet : produire la première brique du chantier deeptech en remplissant la coquille `l-specialty-deeptech-trl-ip`, sans créer de parcours ni de cours nouveau, et sans déplacer la leçon hors de `c-analyst-specialties`.

Décision de conception : une étape de parcours accepte `kind: "lesson"` autant que `kind: "course"` — `p-analyst-foundations` référence déjà `l-fact-hypothesis`, qui appartient à un cours absent de ses étapes. Un futur parcours deeptech pourra donc référencer cette leçon directement, sans la retirer du cours de spécialisations ni dupliquer sa matière. La leçon conserve `optional: true` et `assessmentId: analyst-specialty-deeptech` : elle sert simultanément la Bibliothèque, le cours et l'axe de certification.

Travaux :

- rédaction du corps en six sections — cadre, méthode, cas d'application, limites et points de contrôle, mise en application, références — avec 5 points clés, 4 questions de quiz, 4 renvois de glossaire (`technology-readiness-level`, `proof-of-concept`, `deep-tech-metrics`, `dd`) et 2 renvois de lecture ; `id`, `slug`, `courseId`, `order`, `kicker`, `summary` et le prérequis `l-dd-tech-product` sont inchangés ;
- `readMin` porté à 9 selon la convention `ceil(mots / 180)` ; `durationMin` de `c-analyst-specialties` porté de 0 à 17 selon la convention `readMin + 8` appliquée à l'unique leçon désormais publiée ;
- mise à jour de trois gardes de comptage, corrigés et non contournés : 111 → 112 leçons publiques, `publishedLessonBodies` 111 → 112, et le garde des 28 leçons d'axe qui conserve `optional: true` pour toutes et n'impose `upcoming` qu'aux leçons non produites, via une liste explicite ;
- régénération du sitemap après l'échec attendu de la parité collecteur / fichier versionné.

Sources vérifiées par récupération avant rédaction :

- annexe G des programmes de travail européens — définitions officielles des neuf niveaux TRL, de « basic principles observed » à « actual system proven in operational environment » ;
- article L611-7 du code de la propriété intellectuelle, version en vigueur depuis le 1er janvier 2020 — mission inventive, droit d'attribution, rémunération supplémentaire, juste prix, exigence d'un écrit à peine de nullité et application aux agents publics ;
- fiche INPI « Le secret » du 9 décembre 2024 — durée du brevet limitée à vingt ans sauf exception contre durée indéterminée du secret, absence de droit exclusif et d'action en contrefaçon, exception de possession personnelle antérieure, moyens de preuve de possession ;
- fiche INPI sur les moyens de protection de la propriété intellectuelle, déjà employée par `l-dd-tech-product`.

Vérifications :

- `npm run check` sans build a d'abord échoué sur trois assertions successives : `lessons.test.ts` (111 attendu, 112 obtenu), puis `generated-content.test.mjs`, puis `collect-routes.test.mjs` sur la parité du sitemap versionné, avec un écart d'exactement une route publique — `/lessons/deeptech-trl-propriete-intellectuelle` présente au collecteur et absente du fichier ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run generate:sitemap` puis `npm run check` : exit 0 — générés à jour, contenu strict, glossaire, TypeScript, ESLint, 59 fichiers / 365 tests Vitest et 58/58 tests Node ;
- comptage direct du fichier versionné : 672 occurrences de `<loc>`, contre 671 avant la passe ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — `prebuild` régénère 405 termes et 139 leçons, valide 372 marqueurs et écrit 672 routes au sitemap ; le client transforme 1 791 modules ; `postbuild` prérend 684/684 avec `ok: true`, `routeFailures` et `metadataFailures` vides et la 404 dédiée écrite. Les 684 artefacts se décomposent en 672 pages publiques, 9 redirections historiques non indexables et 3 corrections de cas commentées ;
- `npm run check` après le build : exit 0 — `check:generated` confirme 139 leçons, 112 corps publiés et 405 termes ; contenu strict, glossaire, TypeScript, ESLint, 59 fichiers / 365 tests Vitest et 58/58 tests Node ;
- le chunk `lessons.bodies` passe à 864,74 kB avant gzip et 233,80 kB gzip, contre 770,90 et 210,77 au dernier build consigné.

Limites de cette passe : aucune recette navigateur n'a été conduite sur le rendu de la leçon, notamment l'affichage d'une leçon `optional: true` publiée dans la Bibliothèque et dans le cours de spécialisations ; aucun praticien n'a relu le contenu, conformément à la décision de faire de la relecture une condition de publication et non de production.

Fichiers touchés : `data/lessons.json`, `data/courses.json`, `client/src/content/lessons.test.ts`, `client/src/content/certifications.test.ts`, `scripts/generated-content.test.mjs`, `client/public/sitemap.xml` et `client/public/robots.txt` régénérés, `data/generated/lessons.index.json` et `data/generated/lessons.bodies.json` régénérés, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : première brique du lot 1 deeptech livrée localement. Aucun commit, staging, push, workflow distant ou déploiement n'a été exécuté.

---

## 2026-07-26 — Clôture complémentaire du lot 5 Série A

Objet : reprendre la finalisation interrompue du lot 5 sur l’artefact déjà construit, terminer la recette navigateur, exécuter les trois contre-revues finales en lecture seule, rejouer le gate de clôture et consolider les suivis, sans commit, staging, push, workflow distant ni déploiement.

Travaux :

- reprise de l’état courant sur `master`, avec worktree fortement modifié et nombreux fichiers non suivis déjà présents ; aucune attribution globale du diff n’a été faite ;
- poursuite de la recette sur le serveur statique canonique `http://127.0.0.1:4174/vc-plateform`, qui sert `client/dist` avec le préfixe `/vc-plateform/` ; le preview Vite sur 4173 est resté identifié comme non prioritaire pour cette recette ;
- nettoyage de la clé locale `vcpx:learning-workspace` créée pendant un essai d’interaction du livrable ; la clé préexistante `vcpx:progress` a été conservée ;
- mise à jour de `Suivis/ETAT.md` et du présent journal après clôture vérifiée.

Recette navigateur de l’artefact construit :

- desktop émulé 1 440 × 1 000 : `/parcours/preparer-ma-serie-a?budget=medium` expose un seul `h1`, un seul `main`, `18 min de lecture`, `10 h 34 de production`, les liens simulateurs avec `parcours=p-serie-a&budget=medium`, le mode `Complet` disponible et aucun débordement horizontal du document ; le skip link clavier place le focus sur `#main` ;
- cas AltoSuite : cap table fully diluted, tableau de comparaison et waterfall rendus avec captions et en-têtes `scope`; les lignes séparent fondateurs, options attribuées, réserve non attribuée, investisseurs seed, convertibles, primaire Série A préférentiel et secondaire Série A ordinaire ;
- livrable Série A : en `medium`, 8 composants et 8 critères visibles ; en `high`, les 10 composants et les 10 critères sont visibles, avec les deux approfondissements contextualisés ; les boutons d’export de fiche, autoévaluation et grille externe apparaissent après progression locale du cycle de production ;
- simulateurs dilution et waterfall : liens de retour, précédent/suivant et leçon « Modéliser la transaction et la cap table » conservent `parcours=p-serie-a&budget=medium`; `lsa-tour-complexe` n’est pas rattachée aux simulateurs ; le tableau dilution est sémantique et localement défilable ;
- mobile tactile 390 × 844 : parcours, cas, livrable `medium`, simulateur dilution et simulateur waterfall restent à `scrollWidth === clientWidth === 390`; les grands tableaux débordent seulement dans des wrappers `overflow-x: auto` ; aucune erreur ni avertissement applicatif n’a été relevé dans la console.

Contre-revues finales en lecture seule :

- modèle VC : recalcul indépendant de la cap table pré-tour à 10 000 000 actions, offres A/B, top-up option pool, primaire, secondaire, détention fondateurs post-tour et waterfalls. Les produits de sortie bouclent pour 30/60/120 M€ ; Offre B traite le secondaire comme ordinaire et ne l’ajoute pas au bloc préférentiel ; les préférences seed restent hors modèle pédagogique ;
- contrat budgets/exports/DOM/persistance : `medium` conserve 12 étapes et exclut `lsa-branche-sectorielle` / `lsa-tour-complexe`; `high` conserve 14 étapes ; les composants, critères et sections exportées suivent le même sous-ensemble ; les simulateurs rattachent `lsa-modeliser-transaction`; le stockage de production utilise `vcpx:learning-workspace`, enveloppe versionnée et progression monotone ;
- pédagogie/temps/édition : les dix leçons Série A vérifient `readMin = ceil(mots / 180)`, la pratique closing vaut 52 minutes, chaque leçon contient 3 quiz et au moins 2 références HTTPS, et le contrôle éditorial ne trouve pas les formulations explicitement proscrites.

Vérifications finales :

- `npm run check && git diff --check` : exit 0 — générés à jour, contenu strict, glossaire, TypeScript, ESLint, 59 fichiers / 365 tests Vitest, 58/58 tests Node ; `git diff --check` ne produit aucune sortie ;
- contrôle des ports après arrêt des serveurs de recette : 4173 et 4174 libres.

Fichiers touchés par cette clôture : `Suivis/ETAT.md` et `Suivis/JOURNAL.md` uniquement. Les autres changements du worktree restent ceux déjà présents dans la session de finalisation et les travaux antérieurs.

Clôture : lot 5 finalisé localement. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-26 — Finalisation locale du parcours Série A

Objet : reprendre l’état courant de `p-serie-a`, finaliser le dernier lot sans rouvrir les lots précédents, vérifier le build canonique et contrôler l’artefact construit sous `/vc-plateform/`, sans commit, staging, push, workflow distant ni déploiement.

Travaux :

- reprise prudente : contrôle du répertoire courant, de la branche `master`, du worktree, des fichiers non suivis, des ports applicatifs et de l’absence de `Correction.md` ;
- confirmation courte des lots déjà stabilisés par les contrats existants : intégrité documentaire Série A dans `client/src/content/serieAParcours.test.ts`, contraste dans `client/src/styles/tokens.test.ts`, suite DOM et gates complets ;
- reproduction en recette statique d’un défaut restant : l’accès direct à `/vc-plateform/cases/altosuite-sas-dossier-serie-a/correction` répondait 404 avec un simple serveur statique ;
- ajout d’un contrat RED puis GREEN pour distinguer routes publiques et artefacts non indexables : `collectNoindexRoutes()` émet les corrections commentées de cas pour le prérendu, sans les ajouter au sitemap ;
- adaptation du prérendu strict pour rendre ces artefacts avec `requireNoindex` et sans canonical ;
- consolidation de `Suivis/ETAT.md` et du présent journal après vérification finale. `Correction.md` était absent et n’a donc pas été supprimé.

Preuves RED puis GREEN :

- RED : `node --test scripts/collect-routes.test.mjs` retourne exit 1, `SyntaxError: The requested module './collect-routes.mjs' does not provide an export named 'collectNoindexRoutes'` ;
- GREEN ciblé : `node --test scripts/collect-routes.test.mjs` retourne exit 0 — 14/14 tests Node ;
- le contrat vérifie que `/cases/altosuite-sas-dossier-serie-a/correction` est un artefact `noindex` de prérendu et reste absent des routes publiques de sitemap.

Vérifications finales :

- `npm run split:content` : exit 0 — 405 termes et 139 leçons régénérés ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 791 modules transformés, sitemap 671 routes publiques, prérendu strict 683/683, résumé `ok: true` ;
- `npm run check` post-build : exit 0 — générés à jour, contenu strict, glossaire, TypeScript, ESLint, 59 fichiers / 351 tests Vitest et 57/57 tests Node ;
- accès directs statiques : cas AltoSuite, simulateurs dilution/waterfall, livrable Série A et correction AltoSuite répondent tous 200 sous `/vc-plateform/` ; la correction est `robots=noindex,nofollow` et sans canonical ;
- recette navigateur de l’artefact : mobile émulé 390 × 844 avec `window.innerWidth === 390`, absence de débordement horizontal, H1 unique, navigation nommée, thèmes clair et sombre, modes `medium`/`high`, contexte `parcours=p-serie-a&budget=…` conservé, progression après cas/dilution/waterfall et blocage du jalon final prématuré ; desktop 1 440 × 1 000 sans débordement et mode complet visible ; console sans erreur ;
- serveur temporaire arrêté, répertoire temporaire supprimé et port de recette vérifié libre.
- revue indépendante ciblée du diff : verdict `passed: true`, aucun risque sécurité, aucune erreur logique bloquante ; seules deux suggestions non bloquantes ont été relevées.

Fichiers principaux touchés : `scripts/collect-routes.mjs`, `scripts/collect-routes.test.mjs`, `scripts/prerender.mjs`, `client/public/sitemap.xml`, les artefacts prérendus sous `client/dist`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Clôture : finalisation locale vérifiée. Le remote Git reste uniquement une sauvegarde ; aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-25 — Contre-revue consolidée de l’évaluation des parcours

Objet : confronter le rapport transversal livré à quatre évaluations indépendantes en lecture seule, puis corriger les notes et remarques lorsque leur barème d’exécutabilité ou leurs preuves étaient plus précis.

Travaux :

- consolidation de quatre contre-revues portant chacune sur six parcours ; leur expansion recouvre exactement les 181 occurrences déjà inventoriées ;
- recalibrage des 24 notes de parcours sur l’exécutabilité de la trajectoire complète ; pour les 90 leçons distinctes, normalisation de l’avancée et de la qualité à la médiane basse des contre-évaluations, avec une pertinence conservée par contexte ;
- remplacement des 181 remarques de leçon par les observations circonstanciées des contre-revues et enrichissement des 24 remarques et propositions de parcours ;
- ajout des constats transversaux vérifiés : 18 jalons descriptifs sans livrable résolu, 25 prérequis absents ou placés après leur leçon dans 14 parcours, 13 variantes courtes toutes limitées aux leçons `lea-*`, et progression calculée sur les leçons lues sans imposer cas, simulateurs ou productions ;
- vérification arithmétique de `cs-dilution-journey` : les dilutions successives de 22 %, 20 %, 16 % et 14 % laissent 45,07776 %, et non ≈28 %.

Vérifications :

- contrôle de parité final : 24 sections, 24 synthèses concordantes, 181 lignes ordonnées, 181 remarques non vides et 90 leçons distinctes dont les notes d’avancée et de qualité restent stables entre parcours ;
- absence de dérive des huit sources et consommateurs principaux pendant la consolidation, contrôlée par SHA-256 ;
- empreinte finale du rapport : `ac8d237f1b4183456abd10815395083e21e844a7d86273bfaeb092df1415933e` ;
- `git diff --check -- docs/reviews/2026-07-24-evaluation-parcours-lecons.md Suivis/ETAT.md Suivis/JOURNAL.md` : exit 0 ;
- aucun gate npm ni build relancé : la contre-revue ne modifie ni code applicatif, ni données produit, ni artefact généré.

Fichiers touchés : `docs/reviews/2026-07-24-evaluation-parcours-lecons.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, staging, push, workflow distant ou déploiement n'a été exécuté.

---

## 2026-07-24 — Évaluation transversale des parcours et des leçons

Objet : établir, sur l'état local courant, une notation homogène de l'avancée, de la pertinence et de la qualité de chaque parcours et de chaque leçon qu'il contient, avec une remarque par élément et une proposition d'amélioration par parcours, sans modifier les contenus pédagogiques.

Travaux :

- rapprochement de `data/parcours.json`, `data/courses.json`, `data/lessons.json` et `data/parcours/*.lessons.json`, puis contrôle des cas, simulateurs, livrables, statuts de production et résolutions frontend ;
- définition d'un barème commun de 0 à 5 séparant disponibilité et application observable, adéquation au but du parcours, précision, traçabilité, sobriété éditoriale et exploitabilité pédagogique ;
- création de `docs/reviews/2026-07-24-evaluation-parcours-lecons.md`, avec une synthèse des 24 parcours, un tableau détaillé par parcours, 181 lignes correspondant aux occurrences de 90 leçons publiées et une proposition prioritaire pour chaque parcours ;
- identification de trois étapes requises et quatre étapes facultatives `a-produire`, de cinq parcours portant une étape résolue vers un livrable, des écarts de durée liés au dossier mathématique et des contenus juridiques ou chiffrés à resourcer ;
- conservation des priorités produit existantes : le rapport constitue une aide à la décision et ne vaut ni validation juridique ou financière, ni validation par un praticien.

Vérifications :

- probe Python de parité : 24 sections sur 24, 181 lignes sur 181 dans l'ordre exact des parcours et des cours, 24 statuts de feuille de route concordants, aucun identifiant de leçon manquant ou supplémentaire ;
- contrôle d'inventaire : 24 parcours, 165 étapes, 90 leçons distinctes référencées, toutes publiées, dont 58 comportent au moins une URL HTTPS explicite ;
- `git diff --check -- docs/reviews/2026-07-24-evaluation-parcours-lecons.md Suivis/ETAT.md Suivis/JOURNAL.md` : exit 0 ;
- aucun gate npm ni build relancé : cette passe ajoute une revue et les deux suivis, sans modifier code applicatif, données produit ni artefact généré.

Fichiers touchés : `docs/reviews/2026-07-24-evaluation-parcours-lecons.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, staging, push, workflow distant ou déploiement n'a été exécuté.

---

## 2026-07-24 — Initialisation du cadrage Spec Kit

Objet : rendre Spec Kit utilisable dans le dépôt brownfield actuel, avec un contexte de reprise qui renvoie vers les autorités existantes au lieu de les dupliquer, sans créer de fonctionnalité active, branche, commit, staging, push, workflow distant ni déploiement.

Travaux :

- initialisation de l'infrastructure officielle Spec Kit 0.14.2 pour l'intégration Hermes Agent, avec scripts Bash, numérotation séquentielle et sans extension Git ;
- ratification de `.specify/memory/constitution.md` en version 1.0.0 autour de sept principes : autorités brownfield, continuité produit, sources canoniques, compatibilité, preuve RED–GREEN, accessibilité et effets de bord local-first ;
- création de `.specify/memory/project-context.md`, index de reprise qui distingue comportement implémenté, principes produit, stratégie, état vérifié, références maintenues et historique, sans recopier de photographie des travaux, compteurs, risques ou priorités ;
- création de surcharges locales pour les modèles de spécification, plan et tâches sous `.specify/templates/overrides/`, puis adaptation ciblée de `.specify/templates/checklist-template.md`, lu directement par la compétence Hermes 0.14.2 ;
- création de `docs/SPECKIT.md`, `specs/README.md` et `.specify/integrations/hermes-skill-contract.md`, puis référencement du workflow dans `README.md` et `CLAUDE.md` ;
- adaptation du workflow groupé en `SDD Draft Artifacts` v1.0.1 : il produit les brouillons `specify → plan → tasks`, puis s'arrête sur un handoff vers le cycle manuel avant toute implémentation ;
- alignement des compétences globales du profil actif : `speckit-implement` charge la spécification, bloque les checklists non résolues selon la constitution, inspecte l'installation en lecture seule par défaut et n'initialise pas génériquement le brownfield ; `speckit-tasks` suit le modèle résolu et les exigences de preuve ; `speckit-analyze` résout le contexte sans écriture et contrôle les artefacts de support ; `speckit-converge` exige toutes les tâches cochées, contrôle les artefacts et autorités du delta borné et n'autorise aucune opération Git ou distante ;
- séparation de la convergence et de l'implémentation dans le modèle de tâches : `converge` est un handoff hors checklist, toute tâche ajoutée déclenche une nouvelle passe `implement`, les autorités durables ne sont promues qu'après convergence propre et les suivis restent conditionnels ;
- durcissement de `setup-plan.sh` : résolution initiale sans persistance, exigence d'un dossier et d'un `spec.md` existants avant toute écriture, puis persistance du sélecteur seulement après validation ;
- ajout de `.specify/scripts/bash/select-feature.sh`, helper borné qui valide un dossier `specs/<numéro>-<nom>` et son `spec.md`, puis modifie uniquement le sélecteur local ;
- conservation d'un dépôt sans fonctionnalité active : le premier dossier `specs/001-<nom>/` sera créé par une future commande `/speckit-specify` portant un besoin borné.

Vérifications :

- contrôle structurel final : exit 0 — scripts Bash, JSON, YAML, liens, constitution, contrat des compétences, workflow et manifeste contrôlés ; deux divergences au manifeste, le modèle canonique de checklist et `setup-plan.sh`, sont adaptées et documentées ;
- `specify self check` : `Up to date: 0.14.2` ; `specify check` : exit 0 avec Hermes Agent disponible ; `specify workflow info speckit` : workflow local v1.0.1 résolu en six étapes jusqu'au handoff manuel ;
- premier smoke test isolé de `setup-plan.sh` et `setup-tasks.sh` : exit 1, classé comme erreur de harnais parce que le processus était lancé depuis la racine réelle et résolvait donc le projet courant sans `feature.json` ;
- test bout en bout corrigé avec `SPECIFY_INIT_DIR` et le sélecteur officiel `feature_directory` : exit 0 — création de `specs/001-smoke`, copie des modèles locaux de plan et de tâches, disponibilité de la checklist, branche temporaire maintenue sur `master` et zéro commit ;
- test isolé du changement de fonctionnalité : exit 0 — sélection de `specs/001-first`, rejet d'un dossier inexistant sans altération du sélecteur, branche temporaire `master` et zéro commit ;
- test fail-closed final : exit 0 — fonctionnalité sans spécification rejetée sans dossier, plan ni sélecteur ; résolution d'analyse `--paths-only` sans persistance ; plan valide créé ensuite avec branche `master` et zéro commit ;
- contre-revues en lecture seule : les contradictions génériques des compétences globales, la portée initialement trop étroite d'`analyze` et `converge`, le traitement des checklists, la politique conditionnelle des suivis et l'ancienne convergence auto-référentielle ont été identifiés, corrigés puis couverts par les contrôles structurels finaux ;
- `git diff --check -- .specify docs/SPECKIT.md specs/README.md README.md CLAUDE.md Suivis/ETAT.md Suivis/JOURNAL.md` : exit 0.

Aucun test npm ni build n'a été relancé : cette livraison ne modifie ni code applicatif, ni collection éditoriale, ni route, ni artefact public. Les derniers gates applicatifs restent ceux consignés dans `Suivis/ETAT.md`.

Fichiers propres à cette intervention : `.specify/`, `docs/SPECKIT.md`, `specs/README.md`, les ajouts ciblés de `README.md` et `CLAUDE.md`, puis la consolidation de `Suivis/ETAT.md` et de ce journal. Les adaptations de `~/.hermes/skills/speckit-{tasks,analyze,implement,converge}/SKILL.md` vivent dans le profil actif et sont reproduites dans le contrat versionné du dépôt.

Clôture : l'infrastructure, la gouvernance, le contexte de reprise et les modèles brownfield sont vérifiés. Le dépôt est prêt à ouvrir sa première fonctionnalité avec `/speckit-specify`.

---

## 2026-07-24 — Finalisation du parcours Mathématiques du capital-risque

Objet : appliquer et finaliser localement les corrections proposées dans `revue-mathematiques-du-vc.md` pour le cours partagé `c-mathematiques-vc`, avec un ton professionnel, pédagogique et sans promesse de certification ou de modèle professionnel, sans commit, staging, push, workflow distant ni déploiement.

Travaux :

- corrections P0 dans `data/lessons.json` : formule de complément de pool avec `P₀`, `T₀`, `x` et `c`, distinction primaire/secondaire et cash réellement reçu, runway jusqu’à zéro versus seuil opérationnel minimal, commentaire du plafond 2x et conversion au-delà du plateau ;
- renommage sobre du cours en « Mathématiques du capital-risque » et résumé centré sur conventions, contrôles et sensibilités ;
- création du dossier apprenant fictif `cs-mathematiques-vc-dossier`, avec rôle `learner-dossier`, pièces documentaires minimales requises par le validateur et avertissements explicites sur le caractère méthodologique et non confidentiel du cas ;
- création du livrable cumulatif `math-vc-dossier`, avec sept composants : marché, unit economics, trésorerie, pre/post ownership, cap table, droits économiques et rendements ;
- création de la correction commentée `corr-mathematiques-vc-dossier`, révélable après le livrable, centrée sur conventions, contrôles, variantes recevables et erreurs fréquentes ;
- création du classeur de départ `client/public/downloads/mathematiques-vc/dossier-depart.xlsx`, volontairement sans formule, avec huit onglets de travail et cellules d’entrée identifiées ;
- rattachement des sept leçons du cours au livrable par `practice.deliverableId`, `practice.sectionId` et durées guidées `[45, 45, 60, 45, 75, 60, 75]`, soit 405 minutes ;
- conservation du prérequis strict `l-pipeline-crm` pour `lmv-market-sizing`, imposé par le contrat de certification ;
- correction de `parcoursTimeSummary` pour ne compter une pratique guidée dans un parcours que si le livrable associé appartient réellement à ce parcours. Cette règle évite de gonfler `p-entretien-analyst`, qui réutilise le cours de mathématiques sans utiliser le nouveau livrable longitudinal ;
- mise à jour du sitemap public et du budget média déterministe pour intégrer les deux nouvelles routes publiques et le fichier `xlsx`.

Preuves RED puis GREEN :

- `client/src/content/mathVentureCourse.test.ts` a d’abord échoué sur le contrat longitudinal, faute de titre, dossier, livrable, correction, pratiques et classeur ; après création des données et régénération, il passe avec 5 tests ;
- le premier `npm run validate:content:strict` a révélé deux contrats réels : `lmv-market-sizing` doit garder `l-pipeline-crm`, et tout `learner-dossier` doit porter les 13 catégories documentaires requises. Les données et le test ont été alignés sur ces contrats ;
- le premier `npm run check` a révélé deux effets d’intégration : les pratiques du cours partagé gonflaient `p-entretien-analyst`, et un test Venture Philanthropy supposait que tous les livrables cumulatifs du dépôt étaient VP. La logique de durée et le test ont été corrigés ;
- le deuxième `npm run check` a révélé les artefacts dérivés à mettre à jour : sitemap public et budget média. Le sitemap a été régénéré avec `VITE_BASE_URL=/vc-plateform/` et `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform`, puis le budget média a été recalibré.

Vérifications finales :

- `npm run validate:content:strict` : exit 0 — 24 parcours, 27 cours, 129 leçons, 405 termes, 9 études de cas, 2 corrections commentées, 11 livrables et 369 marqueurs cohérents ;
- `npm run check:generated` : exit 0 — 129 leçons, 101 corps publiés et 405 termes synchronisés ;
- `npm run test --workspace client -- src/content/parcours.test.ts src/content/venturePhilanthropyLearning.test.ts src/content/mathVentureCourse.test.ts` : exit 0 — 3 fichiers / 25 tests ;
- `npm run check` post-build : exit 0 — 51 fichiers / 323 tests Vitest et 56/56 tests Node ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 789 modules transformés, sitemap 658 routes, prérendu strict 667/667 et résumé `ok: true` ;
- vérification du classeur : fichier présent, 12 426 octets, onglets `00_Legende`, `01_Hypotheses`, `02_Marche`, `03_UnitEconomics`, `04_Tresorerie`, `05_CapTable`, `06_DroitsEconomiques`, `07_Rendements`, aucune formule ;
- `git diff --check` : exit 0.

Fichiers principaux touchés : `data/courses.json`, `data/lessons.json`, `data/caseStudies.json`, `data/caseCorrections.json`, `data/deliverables.json`, `data/generated/lessons.index.json`, `data/generated/lessons.bodies.json`, `client/src/content/mathVentureCourse.test.ts`, `client/src/content/learningTime.ts`, `client/src/content/venturePhilanthropyLearning.test.ts`, `scripts/media-budget.test.mjs`, `client/public/downloads/mathematiques-vc/dossier-depart.xlsx`, `client/public/sitemap.xml`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Limites : le classeur est un support pédagogique sans formules, pas un modèle financier professionnel. Les simulateurs n’ont pas été étendus pour gérer toutes les clauses complexes de waterfall. Les quiz numériques dans les leçons restent hors périmètre tant qu’un rendu, un type, un validateur et des tests dédiés ne sont pas créés.

Clôture : implémentation locale, tests, validation stricte, build canonique et prérendu sont terminés. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-24 — Séparation Onboarding / Ikigai

Objet : appliquer le plan `.hermes/plans/2026-07-24_212102-separer-onboarding-ikigai.md` en séparant l’ancien onboarding introspectif du nouvel onboarding produit, sans commit, staging, push, workflow distant ni déploiement.

Travaux :

- création de `client/src/pages/onboarding/IkigaiPage.tsx` à partir de l’expérience actuelle : cahier, modes de lecture, test, brouillons locaux et pinning Ikigai conservés ;
- refonte de `client/src/pages/onboarding/OnboardingPage.tsx` en entrée courte, pratique et non bloquante vers Intelligence VC, Formation, Workspace, avec accès facultatif au cahier et au test ;
- ajout de la route `/ikigai`, conservation de `/onboarding`, redirection des anciens liens `/onboarding?test=1...` vers `/ikigai` avec paramètres préservés ;
- alignement des liens d’intention dans la navigation, le splash, l’accueil, le dashboard, l’atlas de parcours, les pages profil/résultat et le résumé Ikigai ;
- mise à jour de `shared/routes.mjs`, du sitemap public, de `CLAUDE.md`, `README.md` et `docs/ARCHITECTURE_EDITION.md`.

Preuves RED puis GREEN :

- `client/src/pages/onboarding/onboardingAndIkigai.dom.test.tsx` a été écrit avant modification ; premier lancement ciblé : exit 1 attendu, l’ancien `/onboarding` exposant encore le cahier ;
- après séparation : `npm run test --workspace client -- src/pages/onboarding/onboardingAndIkigai.dom.test.tsx` retourne exit 0 — 1 fichier / 4 tests. Le contrat couvre le nouvel onboarding, le cahier `/ikigai`, l’accès direct `/ikigai?test=1` et la redirection legacy.

Vérifications finales :

- `npm run typecheck` : exit 0 ;
- `npm run lint` : exit 0 ;
- `npm run test --workspace client -- src/components/ikigai/cahierLayout.dom.test.tsx` : exit 0 — 1 fichier / 2 tests ;
- `npm run test` : exit 0 — 50 fichiers / 318 tests Vitest et 56/56 tests Node ;
- `npm run check` après build : exit 0 — générés à jour, contenu strict, glossaire, TypeScript, ESLint, 50 fichiers / 318 tests Vitest et 56/56 tests Node ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 789 modules transformés, sitemap 656 routes publiques, prérendu strict 665/665, résumé `ok: true` ;
- `git diff --check` : exit 0.

Recette navigateur sous Vite :

- desktop 1 440 × 1 000 : `/onboarding` expose le titre « Choisissez votre point de départ. », trois cartes de navigation, les liens `/ikigai` et `/ikigai?test=1`, aucun débordement horizontal ; `/ikigai` expose le cahier et son titre Ikigai, aucun débordement ; `/ikigai?test=1` ouvre la question 1/9 ;
- compatibilité : `/onboarding?test=1&q=2` redirige vers `/ikigai?test=1&q=2` et affiche la question 3/9 ;
- mobile tactile 390 × 844 : `/onboarding`, `/ikigai` et `/ikigai?test=1` restent sans débordement horizontal ; le thème clair a été contrôlé sur `/onboarding`, puis le thème sombre restauré ;
- console : aucun blocage JavaScript ; seul demeure l’avertissement préexistant sur sept champs sans `id` ou `name`.

Clôture : implémentation et validation locale terminées. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-24 — Campagne documentaire spécialisée pour l’entretien Analyst

Objet : remplacer, dans les six leçons encore dépendantes de DGAFP/OPM du parcours `p-entretien-analyst`, les références généralistes par des sources VC, PE et private markets contextualisées, puis faire contre-revoir et valider l’état régénéré sans modifier les 13 IDs ou URLs, sans commit, staging, push, workflow distant ni déploiement.

Recherche et rôle des sources :

- France Invest fournit une rubrique métier française — signalée « en cours de construction » — et le témoignage particulier de la DRH de 123 Investment Managers ; ses métadonnées WordPress indiquent une publication en 2023 et une modification en 2025. Le témoignage n’est pas une norme de recrutement sectorielle ;
- l’enquête 2025 Venture Forward/NVCA/Deloitte décrit 250 sociétés de capital-risque participantes basées aux États-Unis, plus de 4 700 salariés à temps plein basés aux États-Unis et 601 Md$ d’actifs sous gestion. Elle distingue types de postes et canaux de vivier, mais ne décrit pas la succession des entretiens ou la fréquence des cas ;
- le syllabus 2025 de CFA Institute sert de taxonomie de compétences private markets ; il ne constitue pas une grille de recrutement et ses contenus LBO, dette de take-private ou fiscalité ne sont pas transposés par défaut au seed ;
- UK Private Capital documente une formation britannique fondée sur des cas PE/VC ; ILPA DDQ 2.0 décrit la diligence d’un LP sur un GP ; Diversity VC propose un dispositif d’évaluation de maturité et de certification du fonds. Aucun de ces cadres n’est traité comme barème candidat ;
- Gompers et al. apporte des axes d’analyse de startups dans une enquête VC américaine ; GoingVC fournit des guides candidats commerciaux à audience internationale produits par un organisme établi aux États-Unis. GoingVC ne publie ni échantillon ni géographie des pratiques décrites.

Transposition dans les six leçons :

- `lea-process` relie les formats possibles aux activités observables et refuse tout tunnel universel ;
- `lea-grille` part du travail d’investissement et sépare faits, interprétations et diligence ;
- `lea-case-study` borne la trame en cinq parties à l’exercice du parcours et distingue early-stage, growth, buyout et LBO ;
- `lea-fit` relie les réponses au rôle, au mandat et à des preuves, sans hiérarchie universelle ni test de personnalité ;
- `lea-reverse-questions` transpose seulement des rubriques générales du DDQ et exclut les demandes détaillées ou nominatives ;
- `lea-jour-j` présente le cas d’une heure, le cas sans préparation et le cas préparé à l’avance comme exemples, jamais comme standards.

Contre-revues intégrées :

- l’audit France Invest/Venture Forward/GoingVC a corrigé dates, séquence, tâches attribuées, échantillon, canaux, géographie et traduction de *on the spot* ;
- l’audit CFA/UK Private Capital a confirmé les compétences citées et borné les éléments buyout/LBO ;
- l’audit ILPA/Diversity VC a restitué les catégories complètes du DDQ, ses vingt rubriques, sa finalité LP-GP et la nature exacte de The Standard ;
- la revue éditoriale générale a conduit à contrôler aussi résumés, points clés, quiz, explications, options et libellés, à référencer France Invest dans `lea-grille`, à corriger deux distracteurs et à retirer les formulations générales restantes.

Preuves RED puis GREEN :

- `client/src/content/parcours.test.ts` a été renforcé avant les dernières corrections : absence des sources généralistes dans tous les champs publiés, URL spécialisées par leçon, libellés qualifiés par origine/géographie, segment et type, limites GoingVC et interdiction des affirmations invalidées ;
- premier lancement ciblé après ce durcissement : exit 1 attendu ;
- après correction de `data/lessons.json` : même commande, 13/13 tests, exit 0 ;
- le premier `npm run check` a ensuite révélé un unique avertissement ESLint sur une variable de test devenue inutilisée ; la variable a été retirée avant relance complète.

Vérifications finales sur l’état régénéré :

- `npm run split:lessons` : exit 0 — 129 leçons, dont 118 bibliothèque et 11 parcours ;
- `npm run check:generated` : exit 0 — 129 leçons, 101 corps publiés et 405 termes synchronisés ;
- `npm run validate:content:strict` : exit 0 — 24 parcours, 19 relations, 27 cours, 129 leçons, 10 livrables et 369 marqueurs ;
- contrôle HTTP des 11 URL spécialisées finales : toutes répondent en `200` ou `206` ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 788 modules transformés, sitemap de 655 routes et prérendu strict 664/664 ;
- second `npm run check`, après le build : exit 0 — générés, contenu strict, glossaire, TypeScript, ESLint, 48 fichiers / 312 tests Vitest et 56/56 tests Node ;
- `git diff --check`, après consolidation de la matrice et des suivis : exit 0.

Fichiers propres à cette campagne : `data/lessons.json`, `data/generated/lessons.index.json`, `data/generated/lessons.bodies.json`, `client/src/content/parcours.test.ts` et `.hermes/plans/2026-07-24_001520-reussir-entretien-analyst-evidence.md`. `Suivis/ETAT.md` et ce journal ont été consolidés après les gates.

Limite : la traçabilité documentaire et les validations locales sont closes. Une revue par un praticien du recrutement VC early-stage France/Europe reste nécessaire pour valider le réalisme métier, le niveau attendu et la charge du mock final.

Clôture : aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-24 — Finalisation vérifiée du parcours entretien Analyst

Objet : finaliser localement `p-entretien-analyst` / `reussir-l-entretien-analyst` après audit éditorial, pédagogique, technique et visuel, sans modifier les IDs ni les URLs des 13 leçons, sans commit, push, workflow distant ni déploiement.

Travaux de contenu et de pédagogie :

- réécriture sourcée des versions approfondies et courtes des 13 leçons de `c-entretien-analyst` ; retrait ou contextualisation des fréquences, seuils, durées et pratiques de recrutement présentés sans preuve comme universels ; correction du calcul 18 clients × 8 k€ d’ACV = 144 k€ d’ARR = 12 k€ de MRR ;
- recomposition du parcours en 13 étapes : quatre leçons de méthode, `c-mathematiques-vc`, deal memo, case study, recherche sur le fonds, pitch, fit, deux bonus puis jalon final ; retrait de `cs-market-sizing-live`, `cs-seed-ic` et `cs-power-law-portfolio` ;
- correction de `c-mathematiques-vc` à 43 minutes avec `durationSource: "lesson-read-minutes"` et qualification de l’étape en `coeur`, non en pratique déclarée sans activité structurée ;
- transformation de `lea-mock` en livrable exécutable sur une société réelle et un fonds réel : six rubriques, sources publiques datées, faits/hypothèses/inconnues séparés, note courte, simulation, grille qualitative, retour facultatif et révision ; la vidéo reste facultative, locale et consentie ;
- contextualisation du mémo Shopify–Bessemer comme exemple historique de densité et de logique de preuve, sans valeur de format universel ;
- correction du contrat de persistance : le navigateur conserve la note courte et les états ; la production complète reste dans un fichier local ou un export. Les déclarations n’ont aucun effet de validation externe ou de certification.

Travaux de durée, navigation et sécurité :

- `parcoursTimeSummary` inclut désormais les temps de lecture des consignes de livrables. Pour l’entretien Analyst : 110 minutes de lectures/consignes, 150 minutes de production, 54 minutes facultatives, soit 260 minutes requises et 314 minutes en Complet ;
- transport explicite de `?parcours=` et `?budget=` entre parcours, cours, leçons et livrable ; le contexte n’est accepté que si le parcours contient réellement la ressource. La page du parcours conserve le budget dans l’URL ; les retours et les leçons préparatoires du jalon le conservent également ;
- navigation précédente/suivante calculée sur les étapes visibles : Standard masque les deux bonus, les exclut du dénominateur de progression et mène du fit directement au jalon. Une leçon dont l’ID est homonyme d’un `milestone` n’est plus confondue avec ce jalon ;
- suppression du fallback implicite de `LessonPage` vers le premier parcours candidat, qui pouvait attribuer les leçons de mathématiques au parcours Stage ;
- fermeture de `FurtherReading.kind` dans TypeScript et Zod, filtrage HTTPS partagé, absence de lien `#` pour une URL externe refusée et annonce accessible de l’ouverture dans un nouvel onglet ; les ressources externes du livrable passent également par `safeHttpUrl`.

Contre-revues et preuves RED puis GREEN :

- quatre audits indépendants en lecture seule ont relevé deux blocages principaux : `bodyShort` obsolètes affichés par défaut et perte du contexte dans `c-mathematiques-vc`. Les deux ont été reproduits, corrigés et couverts ;
- les constats secondaires retenus ont conduit à compter les 6 minutes du brief, enseigner la recherche fonds avant le pitch et le fit, sauter les bonus en Standard, corriger la progression visible, préciser le stockage local, durcir les liens externes et conserver le contexte des leçons préparatoires du jalon ;
- `parcours.test.ts` a été exécuté en RED sur l’ordre, la durée du brief, la qualification de l’étape et la collision milestone/leçon, puis en GREEN avec 12 tests ;
- `parcoursContextNavigation.dom.test.tsx` a été exécuté en RED sur le budget, la progression et les liens préparatoires du jalon, puis en GREEN avec 6 tests ;
- `furtherReadingHref.test.ts` a été exécuté en RED sur les protocoles refusés rendus comme `#`, puis en GREEN avec 6 tests ;
- la première suite complète a révélé deux attentes transversales périmées : `certifications.test.ts` ajoutait encore 8 minutes à tout cours, même avec `durationSource: "lesson-read-minutes"`, et `venturePhilanthropyLearning.test.ts` omettait encore les lectures de consignes. Les contrats ont été alignés sur la sémantique désormais explicite avant relance complète.

Vérifications finales sur l’état consolidé :

- `npm run test` : exit 0 — 48 fichiers / 311 tests Vitest et 56/56 tests Node ;
- `npm run lint` : exit 0 — client, scripts, modules partagés et hooks ESM, sans avertissement ;
- `npm run typecheck --workspace client` : exit 0 ;
- `npm run validate:content:strict` : exit 0 — 24 parcours, 19 relations, 27 cours, 129 leçons, 10 livrables et 369 marqueurs cohérents ;
- `npm run check:generated` : exit 0 — 129 leçons, 101 corps publiés et 405 termes synchronisés ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 788 modules transformés, sitemap de 655 routes publiques et prérendu strict 664/664, résumé `ok: true` ;
- `git diff --check` : exit 0.

Recette navigateur :

- desktop : page du parcours en Complet puis Standard, 13 étapes, ordre recherche → pitch → fit, temps 1 h 50 + 2 h 30, 54 minutes facultatives, cours partagé à 43 minutes, sortie de la dernière leçon de mathématiques vers le deal memo et sortie du fit Standard vers le jalon ;
- livrable : retour contextualisé, consignes 6 + 150 minutes, six sections, source Shopify, grille qualitative, démarrage local, note courte, case de fichier hors plateforme, export et transition de première version ;
- mobile tactile émulé 390 × 844 : parcours et livrable sans débordement horizontal ni élément hors largeur ; les bonus sont absents en Standard, les liens conservent le budget et la console ne contient aucune erreur applicative. La barre flottante observée appartient au composant strictement `DEV` `ViewportSwitcher` et n’est pas livrée par le build de production ;
- serveur Vite arrêté après la recette.

Limite : cette clôture valide la cohérence documentaire, la structure, l’exécution locale et le rendu. Elle ne remplace pas une revue par un praticien du recrutement VC early-stage France/Europe, qui reste la prochaine vérification métier.

Clôture : implémentation, contre-revue, recette et gates locaux terminés. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-23 — Mini-analyse de startup pour le parcours stage VC

Objet : remplacer le placeholder `todo-mini-analyse-gabarit` de `/parcours/decrocher-un-stage-en-vc` par un livrable final vérifiable, concis et réutilisable, sans inventer de données.

Condition prise en compte : le contenu factuel doit provenir de sources sûres. L’exemple retenu est donc un mémo public Shopify publié par Bessemer Venture Partners ; le livrable demande explicitement des sources publiques datées et interdit les chiffres non citables.

Travaux :

- ajout du livrable `todo-mini-analyse-gabarit` dans `data/deliverables.json` avec gabarit en six rubriques, note cible 350–500 mots, grille qualitative, export local et lien vers le modèle `memo-shopify-bessemer` ;
- résolution du jalon dans `data/parcours.json` vers `/livrables/mini-analyse-startup-candidature-vc`, avec formulation plus sobre du parcours et du jalon final ;
- bornage du validateur `capstone` : invariants communs pour tous les jalons finaux, exigences spécifiques conservées pour `vp-recommandation-soutien` ;
- ajout de tests de non-régression dans `client/src/content/parcours.test.ts` et `client/src/lib/learningExports.test.ts` ;
- régénération du sitemap canonique à 654 routes ;
- mise à jour des suivis `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Preuves RED puis GREEN :

- RED ciblé : `npm run test --workspace client -- src/content/parcours.test.ts` retourne exit 1 avant création du livrable, car le jalon `todo-mini-analyse-gabarit` ne résout pas un livrable existant ;
- GREEN ciblé : `npm run test --workspace client -- src/content/parcours.test.ts src/content/venturePhilanthropyLearning.test.ts src/lib/learningExports.test.ts` retourne exit 0 — 3 fichiers / 17 tests ;
- test d’export ajouté : la fiche Markdown contient le titre, les sources publiques, les faits déterminants et la note locale ; l’autoévaluation exportée restitue les niveaux qualitatifs sans score global.

Vérifications finales :

- source externe : `curl` sur `https://www.bvp.com/memos/shopify` retourne exit 0, 62 374 octets, avec `Shopify`, `Bessemer`, `Alex Ferrara` et `Memo` présents dans la page récupérée ;
- `npm run validate:content:strict` : exit 0 — 24 parcours, 27 cours, 129 leçons, 405 termes, 9 livrables, 5 mémos annotés et 430 marqueurs contrôlés ;
- `npm run check` : exit 0 — fraîcheur des générés, validation stricte, glossaire, TypeScript, ESLint, 47 fichiers / 295 tests Vitest et 56/56 tests Node ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 788 modules transformés, sitemap 654 routes et prérendu strict 663/663, résumé `ok: true` ;
- recette Preview : `/parcours/decrocher-un-stage-en-vc` affiche le jalon final et ouvre `/livrables/mini-analyse-startup-candidature-vc`; desktop et mobile émulé 390 × 844 affichent le gabarit, l’exemple Shopify–Bessemer, la source externe, les leçons préparatoires, les termes liés, la grille qualitative, l’export de fiche, l’export d’autoévaluation et le cycle local jusqu’à la déclaration finale. Aucune erreur console observée ; l’état de recette local a ensuite été retiré du `localStorage` de test.

Clôture : implémentation et validation locale terminées. Aucun commit, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-23 — Quiz de leçon question par question

Objet : rendre les quiz formatifs des leçons moins chargés visuellement, avec une seule question visible et un passage immédiat au choix d’une réponse.

Travaux :

- plan court consigné dans `.hermes/plans/2026-07-23_224703-quiz-lecons-question-par-question.md` avant modification du code ;
- remplacement du rendu multi-question de `QuizBlock` par un flux séquentiel : boutons de réponse, progression, focus transféré vers la question suivante puis vers le score final ;
- retrait du besoin de bouton « Valider » ou « Suivant » dans le quiz ;
- conservation d’un score annoncé et d’un corrigé détaillé replié à la fin du quiz.

Preuves RED puis GREEN :

- `npm run test --workspace client -- src/components/reading/QuizBlock.dom.test.tsx` retourne d’abord exit 1 : la seconde question est déjà présente et les options restent des radios ;
- la même commande retourne ensuite exit 0 — 1 fichier / 2 tests, couvrant l’affichage d’une question unique, l’avancement au choix, l’absence de bouton intermédiaire, le score final, le corrigé et le parcours clavier.

Vérifications finales :

- `npm run typecheck` : exit 0 ;
- `npm run lint` : exit 0 ;
- `npm run test` : exit 0 — 47 fichiers / 293 tests Vitest et 56/56 tests Node ;
- `git diff --check -- client/src/components/reading/QuizBlock.tsx client/src/components/reading/QuizBlock.dom.test.tsx .hermes/plans/2026-07-23_224703-quiz-lecons-question-par-question.md` : exit 0 ;
- recette Chromium sous Vite sur `/lessons/le-capital-risque-vraiment` : en viewport large puis en mobile émulé 390 × 844, un choix affiche la question suivante, une seule question reste présente, le score final reçoit le focus, aucun bouton « Valider » ou « Suivant » n’apparaît dans le quiz, le document mobile reste sans débordement horizontal, la console ne contient que les messages Vite/React DevTools et les requêtes répondent en 200/304. Le serveur Vite a été arrêté.

Clôture : implémentation et validation locale terminées. Aucun commit, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-23 — Cartographie relationnelle contextuelle des parcours

Objet : rendre explicites les rapprochements éditoriaux entre les 24 parcours sans déduire un graphe du seul niveau, conserver les positions fixes de l’atlas et exposer les relations uniquement pendant une interaction souris, clavier ou tactile.

Travaux :

- création de `data/parcoursRelations.json`, registre canonique clairsemé de 19 relations avec type, preuves et justification ; la première sélection de 25 arêtes a été réduite après audit plutôt que de forcer chaque parcours à avoir un voisin ;
- distinction de deux contrats : `peer`, complément de même niveau représenté par un trait fin pointillé sans flèche, et `progression`, suite conseillée représentée par un trait continu orienté ; aucune relation ne constitue un prérequis bloquant ni une équivalence avec un palier professionnel ;
- ajout des types et de l’accès client dans `parcoursTypes.ts` et `parcoursRelations.ts`, puis branchement du registre dans la validation stricte du contenu ;
- ajout d’un validateur pur pour les extrémités absentes, boucles, types et preuves, niveaux incompatibles, doublons directs ou inversés et cycles de progression ;
- ajout dans `PathAtlas` d’un calque SVG contextuel placé derrière les sceaux, d’un cartouche textuel accessible et d’états séparés pour le survol, le focus et la sélection tactile ; aucun trait n’est monté au repos ;
- premier appui tactile : affichage du voisinage incident ; second appui sur le même sceau ou la même puce : ouverture du parcours. La souris et le clavier conservent l’ouverture directe ;
- correction du placement radial des libellés actifs pour maintenir leurs deux lignes hors des sceaux ; sur petit écran, le cartouche quitte le calque absolu et suit la carte dans le flux afin de ne plus être rogné ni masquer les relations ;
- durcissement post-revue : l’identifiant du marqueur de progression est dérivé de `useId()` pour cloisonner plusieurs atlas montés simultanément, et le test du registre fixe explicitement l’inventaire éditorial approuvé à 19 relations ;
- mise à jour des textes de `/parcours`, du manuel éditorial, du design system et de la politique des parcours.

Preuves RED puis GREEN :

- les tests Node ont d’abord échoué en l’absence de validation des extrémités, auto-relations, niveaux, doublons et cycles, puis sont devenus verts après ajout de `validateParcoursRelations` et du branchement canonique ;
- les tests DOM ont reproduit l’absence du rendu relationnel, puis le conflit où une sortie de survol supprimait un focus encore actif, l’échec du premier appui tactile, le contact des libellés avec les sceaux et enfin le cartouche mobile rogné ; chaque défaut a reçu une correction ciblée avant le passage au vert ;
- `PathAtlas.dom.test.tsx` couvre finalement 8 scénarios : voisinage au survol, équivalence focus et relations entrantes, coexistence focus/survol, dégagement des libellés, disposition mobile du cartouche, double appui tactile sur puce comme sur sceau SVG et unicité du marqueur entre deux instances ; le dernier scénario a échoué avec un seul identifiant avant de passer au vert ;
- la contre-vérification éditoriale finale approuve les 19 relations et ne relève aucune relation forte manquante. Les revues indépendantes du composant n’ont détecté aucun problème de sécurité ; leurs trois bloquants successifs — focus/survol, rognage de deux libellés puis cartouche mobile — ont été reproduits et corrigés. Les recommandations sur l’identifiant du marqueur, l’inventaire exact et les commentaires mentionnant l’activation tactile sont appliquées.

Vérifications finales :

- `npm run check` après le durcissement post-revue : exit 0 — générés à jour, validation stricte de 19 relations, glossaire, TypeScript, ESLint, 47 fichiers / 292 tests Vitest et 56/56 tests Node ;
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 788 modules transformés, sitemap de 653 routes et prérendu strict 662/662, résumé `ok: true` ;
- recette desktop de l’artefact : à 1 280 px, 24 sceaux, aucun trait au repos, quatre relations incidentes pour « Comprendre le capital-risque » — deux latérales et deux progressions —, cartouche accessible et focus restauré après survol temporaire. À 1 440 × 1 000, une sonde parcourt les 24 sceaux : aucun libellé actif ne sort du SVG ni ne recouvre son sceau ; « Comprendre le capital-risque » reste entre x=354,28 et x=503,08, « Fondamentaux de l’analyse en capital-risque » entre x=912,27 et x=1 138,72, pour un SVG compris entre x=179,5 et x=1 313,5. Le marqueur généré est correctement référencé et aucun débordement horizontal n’apparaît ;
- recette tactile à 390 × 844 : le premier appui conserve `/parcours`, affiche quatre relations et un cartouche entièrement visible sous la carte ; le second ouvre `/parcours/le-vc-sans-bullshit`. Aucun message console, aucune requête en échec et aucun débordement horizontal ;
- `git diff --check` passe après consolidation des suivis ; le serveur Preview final est arrêté et le port 4173 est libre.

Clôture : l’implémentation et sa validation locale sont terminées. Aucun commit, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-23 — P0 : préparation de la relecture praticien des parcours

Objet : reprendre le travail après la clôture de C1–C6, préparer la relecture des deux parcours Foundations sans modifier les contenus pédagogiques et sans simuler une validation professionnelle.

Travaux :

- création du plan `.hermes/plans/2026-07-23_100955-relecture-praticien-parcours-p0.md` et du dossier `docs/reviews/2026-07-23-relecture-praticien-parcours.md` ;
- trois audits parallèles en lecture seule : Analyst Foundations, Venture philanthropie/Trait d’Union et contrat transversal de publication, formation ouverte et certification ;
- reproduction de chaque constat retenu contre `data/*.json`, les référentiels, les pages applicatives et les tests ciblés ;
- aucun contenu pédagogique, artefact généré ou fichier produit modifié.

Résultats établis :

- Analyst Foundations : 7 séquences, 23 leçons publiées, 142 minutes de lecture, 23 mises en application, 92 questions de quiz, 9 leçons débutantes et 14 intermédiaires ;
- budget Analyst de 144 minutes, contre 318 minutes selon les six durées de cours et la leçon autonome, ou 326 minutes si la convention de 8 minutes s’applique aux 23 exercices ;
- les budgets `low`, `medium` et `high` exposent toutes les 7 étapes Analyst, toutes classées `coeur` ; aucun profil d’aiguillage ne recommande `p-analyst-foundations` ;
- Venture philanthropie : 21 leçons, 111 minutes de lecture de leçons, 1 350 minutes de contributions, 240 minutes de consolidation, 360 minutes de jalon et 240 minutes facultatives ;
- fiche cœur `vp-fiche-escalade-juridique` de 30 minutes omise par `parcoursTimeSummary` et 67 minutes de lecture requise hors leçons non agrégées ;
- Trait d’Union : 13 catégories de pièces, 4 branches de correction et un jalon à 13 critères sans score ; classeur annoncé mais absent ; modèle mensuel arrêté en juin 2027 avant la troisième ouverture de juillet 2027 ;
- le tableau mensuel totalise 3,655 M€ d’encaissements et 6,269 M€ de décaissements, soit −2,614 M€ avant solde d’ouverture, sans raccord explicite au besoin incrémental annoncé de 1,65 M€ ;
- les 24 parcours n’ont pas de champ `status` ; le mode local `practitioner` déclare seulement un retour facultatif hors plateforme, sans identité, preuve ni effet certificatif ; les listes d’exclusions locales sont inégales et l’invariant transversal complet prévaut.

Vérifications :

- gate rejouée après réception complète du batch parallèle `deleg_9daffe67` et consolidation des constats tardifs ;
- `node /tmp/vc-platform-p0-review-check.mjs .` : exit 0, relations, chiffres et marqueurs du dossier vérifiés ;
- `npm run validate:content:strict` : exit 0 — 24 parcours, 1 certification, 27 cours, 129 leçons, 405 termes et 428 marqueurs cohérents ;
- `npm run test --workspace client -- src/content/parcours.test.ts src/content/venturePhilanthropyLearning.test.ts` : exit 0 — 2 fichiers / 13 tests ;
- `git diff --check` sur le plan, le dossier et les deux suivis : exit 0.

Clôture : la préparation P0 est terminée, mais la revue professionnelle reste à obtenir. Le prochain acte est l’envoi du dossier aux praticiens puis la qualification de leurs retours dans un lot distinct. Aucun commit, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-23 — Contre-vérification C6 : sitemap canonique et gate post-build

Objet : rejouer indépendamment tous les critères C6 sur l’état courant, sans commit, push, workflow distant ni déploiement.

Constat RED et cause racine :

- les contrôles ciblés de génération passent : `generated-content.test.mjs` 3/3, `check:generated` avec 129 leçons, 101 corps publiés et 405 termes, `split:content` avec empreintes avant/après identiques ; la matrice passe avec 91 identifiants uniques et le probe documentaire aligné passe ;
- le premier `npm run check` de cette contre-vérification échoue néanmoins sur 1 des 53 tests Node, `the committed sitemap XML contains exactly the collected routes` : origine observée `https://example.test`, origine attendue `https://iari-ctrl.github.io` ; les 45 fichiers / 280 tests Vitest et les 52 autres tests Node sont verts ;
- la cause est l’ordre de clôture initial : le gate avait été exécuté avant le build C6, puis le build avec une origine de fixture avait régénéré `client/public/sitemap.xml` et `robots.txt` sans contrôle post-build. Le générateur fonctionne conformément à son contrat ; la commande de preuve était incorrecte.

Correction minimale et preuves GREEN :

- régénération de sitemap et robots avec `VITE_BASE_URL=/vc-plateform/` et `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform` ; le test ciblé passe de 0/1 à 1/1 ;
- correction du plan C6 : origine canonique dans la commande de build et ordre `build` puis gate final ; aucune logique produit n’est modifiée ;
- build canonique : exit 0 — 1 786 modules transformés, sitemap de 653 routes, prérendu strict 662/662, 404 dédiée, résumé `ok: true` ;
- `npm run check` sur l’état post-build : exit 0 — fraîcheur des générés, contenu strict, glossaire, TypeScript, lint, 45 fichiers / 280 tests Vitest et 53/53 tests Node ;
- matrice finale : 91 identifiants uniques, aucun manque ni doublon, décompte 62/20/6/3/0 inchangé ; documentation, autorités, archive et retrait de `Correction.md` concordants ;
- recette de l’artefact : `/home` à 390 × 844 sans débordement, un seul `main`, aucune ressource hors base, tiroir mobile avec dialogue nommé, inertie, verrouillage du scroll, Escape et restauration du focus ; `/simulators/ownership` sans débordement du document, caption, quatre en-têtes de colonne, cinq en-têtes de ligne et défilement local ; Debord à 1 440 × 1 000 sous mouvement réduit avant rendu, neuf scènes visibles, une seule active, transform `none`, transition `0s`, aucune vidéo ; aucune erreur ou alerte console ; canonical et `og:url` sous l’origine canonique ;
- serveur Preview arrêté et port 4173 libéré. Le premier échec du probe documentaire de contre-vérification provenait uniquement d’une assertion externe trop littérale sur l’affichage arborescent du README ; le probe corrigé passe sans modification produit.

Clôture : `git diff --check` passe, l’index Git reste vide, `Correction.md` reste absent et l’archive de session reste présente. Aucun commit, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-23 — C6 : clôture locale vérifiée et consolidation des 91 identifiants

Objet : fermer le cycle local C1–C6 sur un état gelé, ajouter un contrôle indépendant de fraîcheur des contenus générés, aligner la documentation maintenue, consolider chaque identifiant de l’audit temporaire puis retirer `Correction.md`, sans commit, push, workflow distant ni déploiement.

Périmètre :

- code et tests : `scripts/generated-content.mjs`, `scripts/check-generated.mjs`, `scripts/generated-content.test.mjs`, `scripts/split-lessons.mjs`, `scripts/split-glossary.mjs` et `package.json` ;
- documentation : `CLAUDE.md`, `README.md`, `docs/ARCHITECTURE_EDITION.md`, plan C6, `Suivis/ETAT.md` et le présent journal ;
- retrait final : `Correction.md`, audit temporaire non suivi, empreinte SHA-256 pré-retrait `01e8bfcf0cf9fb2bb56265b48ce96bf8f905bdf9183faa4cc538bba77d941d46`.

Travaux :

- extraction d’une dérivation pure et partagée des index/corps de leçons et du glossaire ; les deux scripts `split:*` consomment désormais cette source unique sans modifier leur sortie ;
- ajout de `npm run check:generated`, contrôle strictement en lecture seule des quatre fichiers de `data/generated/`, placé en tête du gate `npm run check` ;
- ajout d’une suite Node qui vérifie la dérivation, détecte une sortie volontairement périmée dans un dépôt temporaire sans la réécrire et contrôle la parité du worktree courant ;
- documentation harmonisée : la commande racine `test` couvre `scripts/*.test.mjs` et `shared/*.test.mjs`, le lint couvre client, scripts, modules partagés et hooks ESM, et le gate décrit explicitement la fraîcheur des générés ainsi que la portée limitée des hooks Claude Code ;
- matrice finale ajoutée au plan avec une ligne, une décision et un chemin de preuve pour chacun des 91 identifiants ; retrait de `Correction.md` après validation automatique de cette matrice.

Preuves RED puis GREEN :

- RED générés : `node --test scripts/generated-content.test.mjs` retourne exit 1 avant création du module partagé, avec `ERR_MODULE_NOT_FOUND` sur `scripts/generated-content.mjs` ;
- GREEN générés : la même commande retourne exit 0 — 3/3 tests ;
- RED documentaire : le probe Node de portée de `npm run test` retourne exit 1 avec `CLAUDE.md must document both Node test families` ; GREEN : exit 0, `documentation-test-scope: OK` ;
- RED matrice : le validateur temporaire retourne exit 1 avec `C6 final matrix markers are missing` ; GREEN : exit 0 — 91 identifiants uniques, aucun manque ou doublon, décompte exact 62 `clos`, 20 `portée bornée`, 6 `décision produit`, 3 `différé hors plan local`, 0 `réouvert` ;
- `npm run split:content` retourne exit 0 et conserve à l’identique les empreintes des quatre générés : 129 leçons, dont 101 corps publiés, et 405 termes.

Vérifications finales sur le code gelé :

- lint ciblé des scripts C6 : exit 0 après retrait d’une variable inutilisée détectée avant le gate général ;
- `npm run check` exécuté une seule fois : exit 0 — fraîcheur des générés, validation stricte de 129 leçons et 405 termes, glossaire, TypeScript, ESLint, 45 fichiers / 280 tests Vitest et 53 tests Node ;
- `git diff --check` : exit 0 ;
- build conditionnel prévu par C6 : `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://example.test/vc-plateform npm run build` : exit 0 — 1 786 modules transformés, sitemap de 653 routes publiques, prérendu strict 662/662, 404 dédiée, résumé `ok: true` ;
- recette de l’artefact avec une seule instance Vite Preview : `/home` et `/simulators/ownership` à 390 × 844 sans débordement horizontal, un seul `main`, dialogue mobile nommé avec inertie, verrouillage du scroll, Escape et restauration du focus, tableau ownership avec caption, en-têtes et défilement local ; Debord à 1 440 × 1 000 avec réduction du mouvement active avant rendu, neuf scènes statiques visibles, une seule active, aucune transformation ni erreur console ; serveur arrêté et port 4173 libéré.

Clôture : le plan et `ETAT.md` décrivent le même état ; l’archive `docs/archive/retours-sessions-correction-2026-07-22.md` reste présente ; aucune donnée canonique, composant produit ou logique métier n’a été modifié par C6. Aucun commit, staging, push, workflow distant ou déploiement n’a été exécuté.

---

## 2026-07-23 — C5 : mouvement réduit et budget média local

Objet : fermer les écarts C5 sur le mouvement réduit, le montage des branches média de scrollytelling et le suivi local du budget de `client/public`, sans hydratation React, réencodage général, recherche de droits, build, commit, push, workflow distant ni déploiement.

Travaux :

- `usePrefersReducedMotion` s’appuie désormais sur un hook de media query qui lit `window.matchMedia` de manière paresseuse et synchrone au premier rendu, puis conserve l’abonnement aux changements de préférence.
- Les scrollytellings Debord et Hirschman montent conditionnellement la branche média desktop ou mobile selon `(min-width: 1024px)`, au lieu de conserver les deux variantes dans le DOM avec `display:none`.
- Sous réduction du mouvement, les vidéos de scènes Debord ne sont pas montées et les classes de transition/parallaxe des scènes touchées sont retirées dès le rendu initial.
- Les vidéos de scènes inactives gardent `preload="none"`; les images et vidéos touchées portent leurs dimensions intrinsèques disponibles sans réencodage.
- Ajout de `scripts/media-budget.mjs` et `scripts/media-budget.test.mjs` pour figer localement l’inventaire média public : nombre, poids total, poids vidéo, formats et plus gros fichiers.
- Ajout du test DOM vertical `client/src/pages/blog/scrollytellingMotion.dom.test.tsx` couvrant les deux scrollytellings, les deux viewports et la préférence de mouvement réduit.

Preuves RED puis GREEN :

- RED DOM ciblé : `npm run test --workspace client -- src/pages/blog/scrollytellingMotion.dom.test.tsx` retourne exit 1 avant ajout des dimensions intrinsèques, avec 4 tests en échec sur `expect(element).toHaveAttribute("width")` pour Debord desktop, Debord mobile, Hirschman desktop et Hirschman mobile.
- RED budget média : `node --test scripts/media-budget.test.mjs` retourne exit 1 avant création du collecteur local, le test important un module de budget inexistant.
- GREEN DOM ciblé : `npm run test --workspace client -- src/pages/blog/scrollytellingMotion.dom.test.tsx` retourne exit 0 — 1 fichier / 10 tests.
- GREEN budget média : `node --test scripts/media-budget.test.mjs` retourne exit 0 — 1 test Node.
- Inventaire : `node scripts/media-budget.mjs` retourne exit 0 — 46 ressources suivies sous `client/public`, 14 071 235 octets au total, dont 9 458 888 octets vidéo ; formats `ico`, `mp4`, `png`, `svg`, `webm`, `webp`.

Vérifications finales :

- `npm run typecheck` : exit 0.
- `npm run lint` : exit 0, ESLint avec `--max-warnings=0` sur le client, `scripts/`, `shared` et `.claude/hooks/`.
- `npm run test` : exit 0 — 45 fichiers / 280 tests Vitest, plus 50 tests Node du gate racine.
- Revue navigateur sous Vite, sans build : `/blog/la-societe-du-spectacle-leve-des-fonds?view=scrolly` contrôlé en mobile émulé 390 × 844 et desktop 1 440 × 1 000 sans débordement horizontal. À 390 px, aucune branche média desktop de scrollytelling, 8 figures mobiles, vidéos de scène en `preload="none"` et aucun autoplay de figure ; à 1 440 px, une branche desktop et aucune figure mobile. Sous `prefers-reduced-motion: reduce` avant rendu : aucune vidéo de scrollytelling, aucune classe de transition/parallaxe, aucune requête média scrollytelling et aucune erreur console applicative.

Fichiers principaux touchés : `client/src/lib/usePrefersReducedMotion.ts`, `client/src/pages/blog/DebordScrollytelling.tsx`, `client/src/pages/blog/HirschmanScrollytelling.tsx`, `client/src/pages/blog/scrollytellingMotion.dom.test.tsx`, `scripts/media-budget.mjs`, `scripts/media-budget.test.mjs`, `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, `Suivis/ETAT.md` et le présent journal.

Aucun build complet, commit, push, workflow distant ni déploiement.

---

## 2026-07-23 — C4 : champs, calculateurs, tableaux et interactions pédagogiques

Objet : fermer les écarts C4 sur les simulateurs, la lecture active, les quiz et la déclaration préalable, sans migration générale du design system ni persistance des réponses de quiz.

Travaux :

- Extraction des calculateurs pre/post-money, ownership et scénario de levée sous `client/src/lib/simulators/`, puis durcissement du calcul de dilution contre les entrées négatives ou non finies.
- Raccordement des simulateurs concernés aux calculateurs purs. Les champs numériques portent désormais un label associé, une aide, l’unité, un bornage minimal et les attributs nécessaires aux erreurs ou états disabled/read-only.
- Rendu sémantique et localement défilable des tableaux dilution et ownership : caption, en-têtes de colonne, en-têtes de ligne, `min-w-*` local et conteneur `overflow-x-auto`. La ligne d’édition ownership se replie sans élargir le document.
- Conversion du quiz en groupes radio natifs nommés, validation explicite, verrouillage après validation et annonces `role="status"` pour les résultats et le score.
- La lecture active expose la zone annotable comme région focalisable, affiche une toolbar nommée après sélection clavier, ferme la sélection avec Escape, restaure le focus et rend perceptible un échec local de `addNote`.
- Les boutons touchés prennent `type="button"` par défaut ou explicite ; les styles `btn-*` neutralisent translation et ombre en état disabled.
- La déclaration préalable d’évaluation de certification utilise une validation applicative `noValidate`, une alerte globale et des erreurs reliées aux champs par `aria-invalid`/`aria-describedby`.

Preuves RED puis GREEN :

- RED ciblé : `npm run test --workspace client -- src/pages/certifications/CertificationEvaluationPage.dom.test.tsx` retourne exit 1 avant correction. L’échec reproduit l’absence d’alerte et de descriptions d’erreur programmatiques sur la déclaration préalable.
- GREEN ciblé : la même commande retourne exit 0 — 1 fichier / 1 test.
- C4 ciblé gelé : `npm run test --workspace client -- src/lib/simulators/c4-calculators.test.ts src/components/simulators/simulators.dom.test.tsx src/components/reading/QuizBlock.dom.test.tsx src/components/reading/ActiveProse.dom.test.tsx src/components/ui/primitives.dom.test.tsx src/pages/certifications/CertificationEvaluationPage.dom.test.tsx` : exit 0 — 6 fichiers / 13 tests.

Vérifications finales :

- `npm run typecheck` : exit 0.
- `npm run lint` : exit 0, ESLint avec `--max-warnings=0` sur le client, `scripts/`, `shared/` et `.claude/hooks/`.
- `npm run test` : exit 0 — 44 fichiers / 270 tests Vitest, plus 49 tests Node du gate racine.
- Revue navigateur sous Vite, sans build : `simulators/dilution` et `simulators/ownership` à 320/390 px sans débordement du document ; les tableaux restent localement défilables. Sur `lessons/le-capital-risque-vraiment`, la sélection clavier affiche la toolbar de lecture active, Escape la ferme et restaure le focus ; un quiz sélectionné puis validé annonce le résultat. Aucune erreur console n’a été relevée.

Fichiers principaux touchés : `client/src/lib/simulators/dilution.ts`, `client/src/lib/simulators/pre-post-money.ts`, `client/src/lib/simulators/ownership.ts`, `client/src/lib/simulators/fundraising-scenario.ts`, `client/src/lib/simulators/c4-calculators.test.ts`, `client/src/components/simulators/`, `client/src/components/reading/QuizBlock.tsx`, `client/src/components/reading/QuizBlock.dom.test.tsx`, `client/src/components/reading/ActiveProse.tsx`, `client/src/components/reading/ActiveProse.dom.test.tsx`, `client/src/components/ui/primitives.tsx`, `client/src/components/ui/primitives.dom.test.tsx`, `client/src/styles/global.css`, `client/src/pages/certifications/CertificationEvaluationPage.tsx`, `client/src/pages/certifications/CertificationEvaluationPage.dom.test.tsx`, `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, `Suivis/ETAT.md` et le présent journal.

Aucun build complet, commit, push, workflow distant ni déploiement.

---

## 2026-07-23 — C3 : progression publique et résilience des chargements différés

Objet : calculer l’expérience d’apprentissage sur les seules leçons publiées et rendre les chargements différés récupérables après rejet, sans supprimer les entrées historiques de stockage ni ouvrir un système global de chunks de route.

Travaux :

- Ajout dans `client/src/content/lessons.ts` d’un catalogue public canonique (`PUBLIC_LESSONS`), de prédicats/lookups publics, d’un helper `publishedLessonsForCourse` et d’un résumé de progression public qui ignore les leçons `upcoming` et les entrées historiques sans supprimer le stockage local.
- `DashboardPage`, `useResumeLesson`, `parcours.ts` et `learningTime.ts` consomment ces helpers pour les dénominateurs, suggestions, reprises, liens de parcours et durées dérivées.
- Création de `client/src/content/lazyResource.ts` et `client/src/content/searchLazy.ts` : une promesse rejetée est retirée du cache, la tentative suivante utilise une URL distincte ou un importeur de module alternatif, et les ressources JSON différées passent par un chargement récupérable côté navigateur.
- `LessonPage`, `GlossaryPage`, `SearchPage`, `CommandPalette`, le sélecteur de liens du journal, le popover Ikigai et la correction commentée distinguent chargement, erreur, absence et contenu disponible selon leur surface. Les erreurs prises en charge sont annoncées par `role="alert"` et proposent `Réessayer` quand une reprise locale est disponible.
- Le setup DOM de test expose les méthodes de défilement nécessaires aux contrôles jsdom du glossaire, sans changer l’environnement Vitest par défaut.

Preuves RED puis GREEN :

- RED ciblé initial : après ajout des tests C3 et avant correction, `npm run test --workspace client -- src/content/lessons.test.ts src/content/lazyResource.test.ts src/pages/learn/LessonPage.lazy.dom.test.tsx src/pages/search/SearchPage.lazy.dom.test.tsx src/pages/glossary/GlossaryPage.lazy.dom.test.tsx` retourne exit 1. Les échecs couvrent `PUBLIC_LESSONS` indéfini, `publicLessonById is not a function`, helper `lazyResource` absent, pages sans alerte/reprise et rejets non capturés.
- Un contrôle navigateur intermédiaire a reproduit un cache empoisonné de dynamic import : `/search` chargé en ligne, recherche `capital` soumise hors ligne, alerte visible ; après retour en ligne, un premier retry restait en erreur tant que la reprise réutilisait la même URL.
- GREEN ciblé final : la commande ciblée C3 retourne exit 0 — 5 fichiers / 9 tests. Elle couvre progression publique, purge de promesse rejetée, cache-buster de reprise, leçon, glossaire et recherche.
- Revue navigateur finale sous Vite : `/search` chargé en ligne, réseau `Offline`, soumission `capital` → alerte `La recherche n’a pas pu être chargée.` ; réseau rétabli, clic `Réessayer` → résultats visibles, dont `Capital call`. La console ne contient que les erreurs réseau attendues de l’état hors ligne.

Vérifications finales :

- `npm run test --workspace client -- src/content/lessons.test.ts src/content/lazyResource.test.ts src/pages/learn/LessonPage.lazy.dom.test.tsx src/pages/search/SearchPage.lazy.dom.test.tsx src/pages/glossary/GlossaryPage.lazy.dom.test.tsx` : exit 0 — 5 fichiers / 9 tests.
- `npm run typecheck` : exit 0.
- `npm run lint` : exit 0, ESLint avec `--max-warnings=0` sur le client, `scripts/`, `shared` et `.claude/hooks/`.
- `npm run test` : exit 0 — 39 fichiers / 259 tests Vitest, plus 49 tests Node du gate racine.

Fichiers principaux touchés : `client/src/content/lessons.ts`, `client/src/content/lessons.test.ts`, `client/src/content/lazyResource.ts`, `client/src/content/lazyResource.test.ts`, `client/src/content/searchLazy.ts`, `client/src/content/glossary.ts`, `client/src/content/caseCorrections.ts`, `client/src/content/parcours.ts`, `client/src/content/learningTime.ts`, `client/src/hooks/useResumeLesson.ts`, `client/src/pages/workspace/DashboardPage.tsx`, `client/src/pages/workspace/DecisionJournalPage.tsx`, `client/src/pages/learn/LessonPage.tsx`, `client/src/pages/learn/LessonPage.lazy.dom.test.tsx`, `client/src/pages/glossary/GlossaryPage.tsx`, `client/src/pages/glossary/GlossaryPage.lazy.dom.test.tsx`, `client/src/pages/search/SearchPage.tsx`, `client/src/pages/search/SearchPage.lazy.dom.test.tsx`, `client/src/components/ui/CommandPalette.tsx`, `client/src/components/ikigai/IkigaiText.tsx`, `client/src/pages/cases/CaseCorrectionPage.tsx`, `client/src/lib/markdown.tsx`, `client/src/test/setupDom.ts`, `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, `Suivis/ETAT.md` et le présent journal.

Aucun build complet, commit, push, workflow distant ni déploiement.

---

## 2026-07-23 — C2 : navigation mobile et gestion des couches

Objet : unifier le comportement observable des couches interactives — modales, confirmation, palette de commandes, tiroir mobile de la TopBar et tiroir mobile de la SideNav — sans supprimer les interactions métier existantes.

Travaux :

- Création de `client/src/components/ui/layerStack.ts`, contrat commun de pile de couches : pose/restauration de `inert`, verrouillage/restauration de `document.body.style.overflow`, focus initial, piège Tab/Shift+Tab, fermeture Escape limitée à la couche supérieure, restauration du focus seulement vers un élément encore connecté et focalisable.
- `Modal` consomme ce contrat, conserve son backdrop, son bouton de fermeture optionnel et ses transitions, avec repli `motion-reduce`.
- `ConfirmDialog` utilise des IDs React uniques pour le titre et la description, transmet `aria-labelledby` et `aria-describedby`, puis place le focus initial sur l’action de confirmation.
- `CommandPalette` utilise désormais `Modal` au lieu d’un portal et d’un verrou de scroll séparés. Les interactions de recherche, navigation clavier interne, sélection et fermeture par navigation sont conservées.
- Les tiroirs mobiles de `TopBar` et `SideNav` sont rendus en portal et exposés comme dialogues modaux nommés, avec `aria-controls`, `aria-haspopup="dialog"`, focus initial, Escape, inertie et scroll gérés par le contrat commun.
- Ajout des tests jsdom ciblés `client/src/components/ui/layers.dom.test.tsx` et `client/src/components/chrome/mobileLayers.dom.test.tsx`. Vitest reste en environnement `node` par défaut ; jsdom est déclaré uniquement dans ces fichiers DOM.

Preuves RED puis GREEN :

- RED contrôlé hors worktree courant : une copie temporaire a repris les tests C2 actuels avec les fichiers de production C2 remis à leur version pré-correction. `npm run test --workspace client -- src/components/ui/layers.dom.test.tsx src/components/chrome/mobileLayers.dom.test.tsx` a retourné exit 1 avec 5 tests en échec : fond non inerté (`AssertionError: expected null not to be null`), IDs fixes de confirmation (`AssertionError: expected 1 to be 2`), contrat palette non respecté et tiroirs mobiles introuvables comme `role="dialog"` nommés `Navigation mobile` / `Navigation mobile latérale`.
- GREEN ciblé : la même commande sur le worktree corrigé retourne exit 0 — 2 fichiers / 5 tests DOM réussis. Elle couvre couches imbriquées, focus initial, Tab/Shift+Tab, Escape, inertie du fond, verrouillage/restauration du scroll, restauration du focus, IDs uniques, palette et deux tiroirs mobiles.
- Le contrôle axe ciblé de la palette passe sans violation, en conservant l’exclusion `color-contrast` propre aux tests jsdom sans canvas.

Vérifications finales :

- `npm run test --workspace client -- src/components/ui/layers.dom.test.tsx src/components/chrome/mobileLayers.dom.test.tsx` : exit 0 — 2 fichiers / 5 tests.
- `npm run typecheck` : exit 0.
- `npm run lint` : exit 0, ESLint avec `--max-warnings=0` sur le client, `scripts/`, `shared/` et `.claude/hooks/`.
- `npm run test` : exit 0 — 34 fichiers / 250 tests Vitest, plus tests Node du gate racine.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript, lint et tests complets verts.
- Revue Chromium sous Vite à 390 × 844 : palette `/home`, tiroir TopBar `/home` et tiroir SideNav `/dashboard`. Pour chaque couche contrôlée : nom accessible présent, focus initial dans la couche, fond inerté, body verrouillé, Tab/Shift+Tab confinés, Escape ferme et restaure le focus vers le déclencheur. Après fermeture : `rootInert: false`, `bodyOverflow: ""`, `duplicateIds: 0`. Aucun message console applicatif, hors debug Vite.

Fichiers principaux touchés : `client/src/components/ui/layerStack.ts`, `client/src/components/ui/Modal.tsx`, `client/src/components/ui/ConfirmDialog.tsx`, `client/src/components/ui/CommandPalette.tsx`, `client/src/components/ui/layers.dom.test.tsx`, `client/src/components/chrome/TopBar.tsx`, `client/src/components/chrome/SideNav.tsx`, `client/src/components/chrome/mobileLayers.dom.test.tsx`, `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, `Suivis/ETAT.md` et le présent journal.

Aucun build complet, commit, push, workflow distant ni déploiement.

---

## 2026-07-23 — C1 : socle DOM, structure de page et dashboard responsive

Objet : rendre les tests React/accessibilité exécutables sans changer l’environnement Node par défaut, fermer les écarts de landmarks et de titres de route, puis corriger le débordement mobile démontré du tableau de bord.

Travaux :

- Ajout de dépendances directes et compatibles pour les tests DOM : `jsdom`, Testing Library React, `user-event`, `jest-dom`, `axe-core` et `@vitest/coverage-v8`. Le script `test:coverage` produit un rapport V8 sans seuil global.
- Création d’un setup DOM ciblé sous `client/src/test/`, avec shims explicites pour `matchMedia`, `IntersectionObserver`, `ResizeObserver` et `scrollTo`. Les tests DOM portent l’environnement jsdom par fichier ; `client/vitest.config.ts` conserve `node` par défaut.
- Ajout de tests DOM pour le rendu de route, le nom accessible de la recherche, une interaction clavier, un contrôle axe ciblé, le focus du `main` après changement de route, le fallback lazy perceptible et l’unicité du landmark `main` sur un échantillon de routes.
- `PageFallback` réutilise `PageLoader` avec un libellé visible. `SectionHeading` accepte un élément de titre configurable et les routes échantillonnées `/search` et `/intelligence` exposent un `h1` utile.
- Suppression des `<main>` imbriqués dans les pages routées concernées : diagnostic de parcours, correction commentée, certifications, niveaux, détails et évaluation de certification, ainsi que le showcase de design system.
- Correction du responsive critique de `/dashboard` : pistes grid `minmax(0,1fr)`, `min-w-0` sur les colonnes et cartes pertinentes, repli local des éléments contraints et clipping local du décor de `ParcoursCard`, sans `overflow-x-hidden` global.

Preuves RED puis GREEN :

- Le premier lancement ciblé des tests DOM a échoué faute de `jsdom`. Après installation des dépendances, les tests ont reproduit les échecs attendus : `SectionHeading` restait en `h2`, les routes échantillonnées rendaient deux `main`, le fallback lazy n’était pas exporté et `/search` n’avait pas de `h1`.
- La revue Chromium de `/dashboard` à largeur mobile a reproduit le défaut : document à 557 px pour un viewport émulé ensuite à 390 px, avec une piste intrinsèque à 541 px. Après correction, `documentElement.scrollWidth === clientWidth === 390` en mobile émulé.

Vérifications finales :

- `npm run test --workspace client -- src/App.dom.test.tsx src/components/ui/primitives.dom.test.tsx src/layouts/MainLayout.dom.test.tsx` : exit 0 — 3 fichiers / 9 tests DOM réussis.
- `npm run typecheck` : exit 0.
- `npm run lint` : exit 0.
- `npm run test` : exit 0 — 32 fichiers / 245 tests Vitest et 49 tests Node réussis.
- `npm run test:coverage --workspace client -- --coverage.reporter=text` : exit 0 — 32 fichiers / 245 tests Vitest réussis ; couverture agrégée 63,85 % statements, 56,21 % branches, 60,06 % functions et 68,24 % lines, sans seuil bloquant.
- `npm run check` : exit 0 — validations strictes de contenu et glossaire, TypeScript, ESLint, 32 fichiers / 245 tests Vitest et 49 tests Node réussis.
- Revue Chromium sous Vite de `/dashboard` : desktop 1 440 × 1 000 et mobile émulé 390 × 844 sans débordement horizontal ni erreur console ; un seul `main` et un `h1` observés sur desktop.

Fichiers principaux touchés : `client/package.json`, `package-lock.json`, `client/src/App.tsx`, `client/src/App.dom.test.tsx`, `client/src/test/`, `client/src/components/ui/primitives.tsx`, `client/src/components/ui/primitives.dom.test.tsx`, `client/src/layouts/MainLayout.dom.test.tsx`, `client/src/pages/search/SearchPage.tsx`, `client/src/pages/intelligence/IntelligencePage.tsx`, `client/src/pages/workspace/DashboardPage.tsx`, `client/src/components/cards.tsx`, `client/src/pages/learn/ParcoursDiagnosticPage.tsx`, `client/src/pages/cases/CaseCorrectionPage.tsx`, `client/src/pages/certifications/` et `client/src/pages/system/DesignSystemShowcasePage.tsx`, puis `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, `Suivis/ETAT.md` et le présent journal.

Aucun commit, push, build, workflow distant ni déploiement.

---

## 2026-07-22 — Unification Path/Parcours et consolidation de la Bibliothèque

Objet : réserver `path` à Parcours, retirer la taxonomie documentaire redondante des rayons, rendre le contrat `CLAUDE.md` commun à Codex et Claude Code, puis réaligner l’architecture maintenue et les sorties statiques.

Décision :

- **Path = Parcours = trajectoire de formation ordonnée par objectif, composant librement des ressources existantes.**
- La Bibliothèque n’est plus une seconde collection métier. Elle inventorie et filtre les cours, les leçons explicitement publiées et les études de cas déjà présents.
- Les neuf anciennes URL `/bibliotheque/:slug` restent accessibles sous forme de redirections statiques `noindex` vers `/bibliotheque`, sans retourner dans le sitemap.

Travaux :

- Suppression de `data/paths.json`, du type `Path`, du loader `content/paths.ts`, de `PathsPage`, de `PathDetailPage` et de leurs helpers cours/leçons. `LibraryPage` remplace l’ancien index et expose les 27 cours, 101 leçons publiées et 8 études de cas avec les filtres existants.
- Retrait des recommandations Ikigai `recommendedPathIds`, qui pointaient vers les anciens rayons. `profileParcours.json` reste l’unique source des recommandations de Parcours.
- Ajout d’un registre borné de neuf redirections historiques dans `shared/routes.mjs`. Le collecteur ne publie plus les détails de rayon ; le prérendu écrit des documents statiques de redirection compatibles avec `VITE_BASE_URL`.
- `AGENTS.md` désigne explicitement `CLAUDE.md` comme contrat détaillé commun à Codex, Claude Code et aux autres agents. Les hooks `.claude` sont documentés comme une aide propre à Claude Code et non comme une garantie transversale.
- Révision de `docs/ARCHITECTURE_EDITION.md` : suppression des rayons et du compteur de glossaire recopié, correction des prérequis de build, de la portée des hooks, du stockage versionné, de la publication locale, du gate `published`, du périmètre de `data/`, des commandes de test et de l’autorité éditoriale. README, stratégie, documentation des parcours, architecture des certifications et procédure de sauvegarde ont été réalignés.
- La charte transverse détaillée est désormais portée par `docs/ARCHITECTURE_EDITION.md` §4.0.c ; `PRODUCT.md` porte les principes, `CLAUDE.md` le résumé opérationnel partagé, et le skill d’écosystème les seules contraintes propres à cette collection.

Preuves RED puis GREEN :

- Les tests de routes et de prérendu ont d’abord échoué faute de registre de redirection, de génération statique et de retrait des anciennes routes publiques. Après implémentation et régénération du sitemap, les 23 tests ciblés ont réussi.
- La première revue navigateur a signalé cinq champs de filtre sans `name`. Les cinq contrôles ont été nommés, puis le gate complet, le build et la revue navigateur ont été relancés.
- La contre-revue indépendante n’a trouvé aucun bloquant, mais a montré que le filtre de niveau des leçons utilisait toujours le niveau de leur cours. Un test de rendu a échoué avec `l-sourcing` absente du filtre débutant et `l-portfolio-monitoring` présente à tort ; `lesson.level` est désormais prioritaire, avec le niveau du cours comme repli, et le test est passé avant la relance des gates complets. Son unique point mineur concernait la référence documentaire à l’ancien `NOINDEX_SEGMENTS` ; cette mention a été remplacée par le contrat courant `NOINDEX_ROUTE_PATTERNS`.

Vérifications finales :

- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript et lint sans avertissement ; 29 fichiers / 236 tests Vitest et 49 tests Node réussis.
- `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform VITE_BASE_URL=/vc-plateform/ npm run build` : exit 0 — 1 775 modules transformés, sitemap de 653 routes publiques, prérendu strict 662/662 comprenant 653 pages publiques et neuf redirections historiques, aucune erreur de route ou de métadonnée, 404 dédiée écrite.
- Contrôle direct de `client/dist` : neuf documents de redirection avec `robots=noindex`, cible `/vc-plateform/bibliotheque`, aucun ancien chemin dans le sitemap.
- Revue de l’artefact sur desktop et mobile 390 × 844 : aucun débordement ni erreur console. Le filtre « Leçons » produit `?type=lesson` et 101 résultats. Une ancienne URL de rayon répond en 200 statique puis redirige vers la Bibliothèque. Lighthouse snapshot mobile : accessibilité 100, bonnes pratiques 100, SEO 100 et navigation agentique 100.

Fichiers principaux touchés : `AGENTS.md`, `CLAUDE.md`, `README.md`, `.claude/skills/ecosystemes/SKILL.md`, `docs/ARCHITECTURE_EDITION.md`, `docs/STRATEGIE-vc-intelligence.md`, `docs/parcours/README.md`, `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md`, `data/ikigai.json`, suppression de `data/paths.json`, `client/src/App.tsx`, `client/src/content/`, `client/src/pages/learn/LibraryPage.tsx`, `client/src/pages/learn/LibraryPage.test.tsx`, suppression des anciennes pages Path, `shared/routes.mjs`, `scripts/collect-routes.mjs`, `scripts/prerender.mjs`, `scripts/validate-content.mjs`, leurs tests, le sitemap, `Suivis/ETAT.md` et le présent journal.

Aucun commit, push, workflow distant ni déploiement.

---

## 2026-07-22 — Transfert des règles transversales dans `CLAUDE.md`

Objet : rendre les apprentissages réutilisables par toutes les futures sessions sans conserver dans le plan C1–C6 un second protocole général concurrent.

Travaux :

- Ajout sous `CLAUDE.md`, section « Session workflow », d’une synthèse transverse : contrat des travaux non triviaux, attribution dans un worktree mobile, traçage jusqu’aux consommateurs, TDD et fixtures ciblées, classification des échecs, gel des revues, sérialisation des ressources partagées, contrôle propositionnel des sources et preuves de clôture exactes.
- Réduction de la section 3 du plan actif à sept conventions propres au cycle C1–C6 : chargement ciblé des fiches et identifiants, usage de la baseline des 107 changements, traitement terminal des 91 constats, stratégie de gates, mise à jour des suivis et exclusion des opérations distantes.
- Suppression du « Protocole commun à C1–C6 », désormais couvert par `CLAUDE.md`, et renumérotation des sections restantes du plan.
- Réalignement de `Suivis/ETAT.md` et du bandeau de `docs/archive/retours-sessions-correction-2026-07-22.md` vers la nouvelle répartition des responsabilités.

Vérifications :

- Aucun ancien titre ou bloc transversal retiré ne subsiste dans le plan ; les règles transférées sont présentes dans `CLAUDE.md:72-102`.
- Le plan passe de 431 à 342 lignes et de 31 793 à 25 429 octets tout en conservant les six fiches C1–C6.
- Matrice d’audit inchangée : 91 identifiants dans `Correction.md`, 91 dans le plan, aucun manquant ni inattendu.
- Le corps historique de l’archive conserve son empreinte SHA-256 `4d5c2838a3454c6e0b0d15629299d7030c5738317f65a349372df9ebe96d39dd`.
- Aucun espace final détecté dans les documents concernés ; `git diff --check -- CLAUDE.md Suivis/ETAT.md Suivis/JOURNAL.md` était vert avant l’ajout de la présente entrée.
- Aucun test applicatif, build, générateur, commit, push, workflow distant ou déploiement n’a été exécuté.

Fichiers touchés : `CLAUDE.md`, `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, `Suivis/ETAT.md`, `Suivis/JOURNAL.md` et `docs/archive/retours-sessions-correction-2026-07-22.md`. `Correction.md` n’a pas été modifié.

---

## 2026-07-22 — Consolidation du plan restant et archivage des retours de session

Objet : remplacer le découpage historique S7–S17 par un plan local plus court, intégrer les règles durables issues des retours de S1–S6 et clarifier le rôle temporaire de l’audit ainsi que le rôle de sauvegarde du dépôt distant.

Travaux :

- Réécriture de `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md` autour de six sessions C1–C6 estimées à 18–24 heures : socle DOM, couches de navigation, progression et chargements différés, champs et interactions pédagogiques, mouvement/médias, puis clôture locale.
- Intégration au plan des règles durables de cadrage, attribution du worktree, TDD, classification des échecs, gel des revues, délégation bornée, économie de contexte et clôture documentaire.
- Consolidation dans le plan d’une matrice froide couvrant les 91 identifiants de `Correction.md`. L’audit reste disponible localement pour les recherches ciblées, ne doit plus recevoir de compte rendu de session et sera retiré après la consolidation finale de C6.
- Archivage sans réécriture du corps de `better .md` sous `docs/archive/retours-sessions-correction-2026-07-22.md`, avec un bandeau indiquant que le document n’est plus une lecture ordinaire de session.
- Réalignement de `Suivis/ETAT.md` : C1 devient la prochaine session ; Git distant est explicitement limité à la sauvegarde ; publication, hébergement et domaine restent hors du plan local.

Vérifications :

- Comparaison automatisée des identifiants : 91 dans l’audit, 91 dans le plan, aucun manquant et aucun inattendu.
- Contrôle de l’archive : le corps historique conserve son empreinte SHA-256 `4d5c2838a3454c6e0b0d15629299d7030c5738317f65a349372df9ebe96d39dd` ; l’ancien chemin `better .md` n’existe plus.
- Le plan actif compte 431 lignes et 31 793 octets, contre 783 lignes et 55 717 octets auparavant ; aucun espace final n’a été détecté dans le plan, l’archive ou `ETAT.md`.
- `git diff --check -- Suivis/ETAT.md Suivis/JOURNAL.md` : exit 0 avant l’ajout de la présente entrée.
- Aucun test applicatif, build, générateur, commit, push, workflow distant ou déploiement n’a été exécuté ; la passe est documentaire.

Fichiers touchés : `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, `docs/archive/retours-sessions-correction-2026-07-22.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`. `Correction.md` n’a pas été modifié.

---

## 2026-07-22 — S6 : publication et confiance éditoriale

Objet : fermer les surfaces publiques par défaut, centraliser la politique des URL éditoriales, rendre les validateurs testables et réconcilier le glossaire publié avec son registre de provenance sans présenter une source locale comme une preuve externe.

Travaux :

- Création de `shared/publication.mjs` : seul `status === 'published'` rend un contenu public. Le blog, les certifications, le lookup des évaluations et le collecteur de routes utilisent ce gate commun ; les leçons ne chargent leur corps que lorsqu’elles sont explicitement publiées.
- Les statuts sont obligatoires dans les types et schémas des leçons, articles, certifications et évaluations. Les 90 leçons canoniques publiées, les 28 leçons `upcoming`, les 11 leçons drop-in publiées, les sept articles publiés et l’article brouillon portent tous un statut explicite.
- Création de `shared/editorial-url.mjs` et raccordement de `safeHttpUrl` ainsi que des schémas éditoriaux. Les liens externes sont limités à HTTPS ; les chemins internes et fragments ne sont admis que sur option ; les protocoles exécutables, URL protocol-relative, credentials, blancs internes, contrôles et antislashs sont refusés.
- Création de `scripts/validation-core.mjs` : fonctions pures pour statuts, doublons, références, cycles, URLs Markdown, denylist éditoriale ciblée, publication des évaluations et cohérence du registre canonique. `scripts/glossary-validation.mjs` porte les contrôles purs propres au glossaire et `validate-glossary.mjs` reste le wrapper CLI.
- `validate-content.mjs` applique la politique URL aux champs structurés, y compris `memos[].sourceUrl`, et aux liens Markdown des collections éditoriales. `MemoPage` repasse aussi la source par `safeHttpUrl` avant de rendre le lien. Le validateur vérifie la publication fermée, la cohérence du registre et recherche récursivement les formulations explicitement proscrites par S6 dans les cours, parcours et leçons.
- Le registre canonique contient désormais 481 entrées : aucune entrée `applied` ne reste `unsourced` et aucun des 405 slugs publiés n’est absent. Il distingue 417 entrées `source-backed`, 48 entrées `legacy-final-glossary` et 16 entrées `editorial`.
- Une contre-revue source par source a corrigé les deux URL SEC devenues obsolètes, remplacé les pages générales ILPA et NVCA par des ressources directement pertinentes et déclassé quatorze entrées dont la source était trop générale, partielle ou inaccessible pour soutenir la définition. Ces entrées restent explicitement classées `editorial`, sans `sourceUrls`, plutôt que d’être promues artificiellement en `source-backed`. L’audit juridique a aussi annulé les fusions de `Dividend Rights`, `Voting Rights` et `Subscription Price` vers des notions plus étroites ; les trois aliases publics incorrects ont été retirés et les entrées sont revenues à `needs-review`. Les formulations de `bootstrap`, `equity-value`, `portfolio-approach` et `continuation-fund` ont été resserrées sur les propositions réellement couvertes. Une ancienne URL CFA en 404 avait déjà été remplacée par la ressource de valorisation NYU Stern.
- Les formulations ciblées par `EDIT-004` ont été neutralisées dans les titres, accroches et résumés concernés, sans lancer une réécriture éditoriale globale. Une source HTTP historique de l’anti-portfolio a été remplacée par un document Stanford en HTTPS.
- Le modèle d’évaluation exige un statut explicite. Une définition brouillon ou absente et une charte non active produisent l’état institutionnel « Évaluation indisponible » ; une certification inconnue reste une 404. Le dépôt conserve zéro évaluation publiée et `VC Analyst` reste une certification professionnelle en construction.

Preuves RED puis GREEN :

- Les tests du noyau ont d’abord échoué faute de modules partagés, puis couvrent la publication fail-closed, les URL HTTPS, les exceptions internes, les protocoles dangereux, doublons, références, cycles, warnings stricts, liens Markdown, évaluations et dérive canonique.
- Les tests du glossaire ont d’abord échoué avant l’extraction de `validateGlossaryData`, puis couvrent fixture cohérente, doublons, références inconnues, collision d’alias et URL non HTTPS.
- Les tests de certification ont d’abord échoué avant la sélection exclusive des évaluations publiées et la résolution explicite des états inconnus, non pris en charge, indisponibles et disponibles.
- Une relance ciblée des routes a détecté que le sitemap avait été régénéré avec une origine de vérification non canonique. Aucun déploiement n’avait été lancé ; le build a été relancé avec le contrat Pages maintenu, puis la parité collecteur–sitemap est revenue au vert.

Vérifications :

- `node --test scripts/validation-core.test.mjs scripts/glossary-validation.test.mjs scripts/collect-routes.test.mjs` : 25/25 tests réussis.
- `npm run test --workspace client -- src/content/search.test.ts src/content/certifications.test.ts src/content/certificationAssessments.test.ts src/content/blog.test.ts src/lib/utils.test.ts src/lib/certificationAssessment.test.ts` : 6 fichiers / 42 tests réussis.
- `npm run validate:content:strict` : exit 0 — 24 parcours, 1 certification, 5 niveaux, 1 charte, 0 évaluation, 27 cours, 129 leçons, 405 termes et 428 marqueurs contrôlés.
- `npm run validate:glossary` : exit 0 — 405 termes, slugs, liens HTTPS, relations, marqueurs et alias cohérents.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript et lint réussis ; 28 fichiers / 235 tests Vitest et 47 tests Node réussis.
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 778 modules transformés, sitemap de 662 routes et prérendu strict 662/662, sans erreur de route ni de métadonnée, avec 404 dédiée. L’avertissement Vite déjà suivi sur `lessons.bodies` demeure.
- `git diff --check` : exit 0 après la réconciliation documentaire finale.

Fichiers principaux touchés : `shared/editorial-url.mjs`, `shared/editorial-url.d.mts`, `shared/publication.mjs`, `shared/publication.d.mts`, `scripts/validation-core.mjs`, `scripts/validation-core.test.mjs`, `scripts/glossary-validation.mjs`, `scripts/glossary-validation.test.mjs`, `scripts/validate-content.mjs`, `scripts/validate-glossary.mjs`, `scripts/collect-routes.mjs`, `scripts/split-lessons.mjs`, `client/src/lib/utils.ts`, `client/src/lib/utils.test.ts`, `client/src/content/blog.ts`, `client/src/content/lessons.ts`, `client/src/content/certifications.ts`, `client/src/content/certificationAssessments.ts`, `client/src/content/certificationAssessments.test.ts`, `client/src/content/types.ts`, `client/src/content/certificationTypes.ts`, `client/src/pages/certifications/CertificationEvaluationPage.tsx`, les sources de statut et corrections éditoriales ciblées sous `data/`, `data/sources/canonical-glossary.json`, les fichiers générés, `client/public/sitemap.xml`, `Correction.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — S5 : cycle de vie des données locales

Objet : compléter le contrat local-first par une gestion explicite du cycle de vie des données utilisateur : export, aperçu d’import, import atomique, purge des clés produit, notice de confidentialité locale et rechargement après mutation externe.

Travaux :

- Création de `client/src/lib/localDataLifecycle.ts`, fondé sur les contrats existants de `storageDomains`, du workspace d’apprentissage, des évaluations de certification et du cahier Ikigai. Le module exporte toutes les clés produit connues, ignore les clés étrangères, vérifie la taille du fichier, la version d’export, l’origine, la date, l’ensemble des clés et la validité métier de chaque enveloppe.
- Ajout d’un aperçu d’import qui ne renvoie pas les textes libres ; il expose seulement les domaines présents, la version de stockage et le nombre d’éléments utiles.
- L’import écrit les clés produit de façon groupée avec snapshot préalable et tentative de rollback en cas d’échec de suppression ou d’écriture. La purge supprime les clés `vcpx:*` connues et conserve les autres clés du navigateur.
- `UserDataProvider` expose `reloadLocalData` et écoute les événements `storage` pour le profil, les notes, les favoris, la progression et le journal. Les imports et purges peuvent donc relire l’état React sans rechargement complet, et les mutations d’un second onglet sont visibles sur ces domaines.
- `ProfilePage` ajoute une section « Données locales » : notice de confidentialité, export JSON, sélection d’un import, aperçu sans contenu libre, action d’import, purge confirmée et messages d’état. Le texte précise que ces données ne sont pas chiffrées par la plateforme et ne doivent pas contenir de secret, jeton, donnée réglementée ou information professionnelle confidentielle.
- Les vérifications ont révélé des gates fail-closed déjà présents mais incomplets dans le worktree courant. Les leçons et articles publiés ont reçu un statut explicite `published`, les évaluations de certification ont reçu un statut de publication dans le type, le lookup ne retourne plus d’évaluation non publiée, et la route d’évaluation d’une certification connue sans évaluation publiée affiche un état indisponible `noindex` plutôt qu’une 404.
- La règle ESLint `no-control-regex` a été satisfaite dans la validation d’URL éditoriale sans relâcher la politique : les caractères de contrôle, blancs internes, antislashs et URL non HTTPS restent rejetés sauf exceptions internes ou fragments explicitement autorisés.

Preuves RED puis GREEN :

- `client/src/lib/localDataLifecycle.test.ts` a d’abord échoué faute de module de cycle de vie local, puis couvre l’export des seules clés produit, l’aperçu sans fuite de texte libre, le rejet des versions ou clés inconnues, la limite de taille, les données métier invalides, le rollback d’import et la purge sélective.
- Un échec intermédiaire du test de prévisualisation a corrigé le comptage métier d’un profil : un objet portant `profileType` compte comme un profil, non comme plusieurs champs bruts.
- Le build a d’abord échoué sans `VITE_SITE_URL`, conformément au contrat S2/S3 qui refuse d’inventer une origine canonique. La relance avec `VITE_BASE_URL=/vc-plateform/` et `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform` a ensuite exercé le build de publication.
- Les gates généraux ont ensuite exposé trois incohérences préexistantes au périmètre local : test d’évaluation basé sur des exports absents, publication fail-closed sans statut explicite sur 34 leçons source, 11 leçons de parcours et sept articles publiés, et test d’intégration qui attendait encore une 404 pour une évaluation connue mais indisponible. Ces écarts ont été corrigés et relancés en GREEN.

Vérifications :

- `npm run test --workspace client -- src/lib/localDataLifecycle.test.ts src/lib/storage.contract.test.ts src/lib/storageDomains.test.ts src/lib/learningWorkspace.test.ts src/lib/certificationAssessment.test.ts src/lib/ikigaiCahier.test.ts` : exit 0.
- `npm run test --workspace client -- src/content/certificationAssessments.test.ts src/lib/certificationAssessment.test.ts src/lib/localDataLifecycle.test.ts` : 3 fichiers / 18 tests réussis.
- `node --test --test-concurrency=1 scripts/prerender.integration.test.mjs scripts/collect-routes.test.mjs` : 14/14 tests réussis.
- `npm run typecheck` et `npm run lint` : exit 0.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript, lint, 28 fichiers / 235 tests Vitest et 43 tests Node réussis.
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 778 modules transformés, sitemap de 662 routes, prérendu strict 662/662, aucune erreur de route ou de métadonnée, 404 dédiée écrite. Vite conserve l’avertissement déjà suivi sur le chunk `lessons.bodies`.
- Revue navigateur locale de `/profile` sous Vite : notice et boutons visibles, purge confirmée par dialogue, suppression des clés `vcpx:*`, conservation d’une clé étrangère, message de succès, absence d’erreur console. Une mutation du profil depuis un second onglet a été répercutée dans le premier onglet via l’événement `storage`.
- `git diff --check` : exit 0.

Fichiers principaux touchés : `client/src/lib/localDataLifecycle.ts`, `client/src/lib/localDataLifecycle.test.ts`, `client/src/lib/learningWorkspace.ts`, `client/src/context/UserDataContext.ts`, `client/src/context/UserDataProvider.tsx`, `client/src/pages/onboarding/ProfilePage.tsx`, `client/src/content/certificationAssessments.ts`, `client/src/content/certificationAssessments.test.ts`, `client/src/content/certificationTypes.ts`, `client/src/pages/certifications/CertificationEvaluationPage.tsx`, `client/src/lib/certificationAssessment.test.ts`, `shared/editorial-url.mjs`, `scripts/prerender.integration.test.mjs`, `data/lessons.json`, `data/parcours/*.lessons.json`, `data/blog/*.json`, `client/public/sitemap.xml`, `Correction.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — S4 : persistance versionnée et gestion d’état

Objet : fournir un contrat commun de persistance locale, migrer les principaux domaines métier sans perte et empêcher qu’une écriture échouée ne soit présentée comme appliquée dans l’état de l’application.

Travaux :

- Introduction du namespace `vcpx:` et d’enveloppes portant `storageVersion`. Les lectures valident la structure runtime, appliquent les migrations séquentielles connues et utilisent un fallback sûr pour les données absentes, illisibles, invalides, surdimensionnées ou inaccessibles.
- Une représentation historique compatible est archivée avant migration. La clé historique n’est retirée qu’après réussite de l’écriture namespacée. Une version future incompatible est signalée et conservée intégralement ; l’application courante refuse de la réinitialiser ou de l’écraser.
- Centralisation des erreurs de quota, disponibilité, sérialisation, lecture, validation, version et limite. L’alerte globale existante reste utilisée.
- Création des contrats métier pour le thème, le profil, les notes, les signets, la progression, le journal de décision, le mode d’onboarding, les inscriptions aux certifications et la profondeur de lecture. Les identifiants, textes, cartes et collections ont des limites explicites.
- Migration de `UserDataProvider`, du thème, de l’onboarding, des préférences de lecture, des inscriptions, de l’espace d’apprentissage, du cahier ikigai et des évaluations de certification. `commitOnStorageSuccess` centralise l’invariant : la transition d’état métier n’est exécutée qu’après une opération persistante réussie.
- Versionnement et validation des stores d’apprentissage, d’évaluation et du cahier ikigai. Les collections sont bornées et les anciennes clés ikigai/onboarding compatibles sont migrées sans suppression anticipée.
- Conservation des soumissions liées à d’anciennes versions d’évaluation ou de charte. Elles sont regroupées par contexte, restent accessibles au code métier et sont présentées séparément dans la page d’évaluation, avec date, score et meilleur résultat du contexte.
- Le meilleur résultat d’un ancien contexte reste conservé lors d’un changement de version même s’il avait quitté l’historique borné du contexte actif. La validation runtime refuse les scores négatifs, les points hors bornes, les seuils incohérents et les agrégats impossibles.
- Les liens persistés des signets et du journal sont limités aux chemins internes sûrs ; les schémas exécutables, les URL protocol-relative, les antislashs et les caractères de contrôle sont refusés à la lecture comme à l’écriture.
- Le formulaire de réflexion ikigai persiste chaque modification avant de l’appliquer à son état local ; une écriture refusée conserve la valeur précédente. La longueur des réponses est également bornée dans l’interface.

Preuves RED puis GREEN :

- Les tests du contrat commun ont d’abord échoué avant l’introduction des enveloppes, migrations, erreurs structurées, protections de version future et de migration interrompue ; ils réussissent après implémentation.
- Les tests des contrats métier, des limites de l’espace d’apprentissage, du store d’évaluation et du cahier ikigai ont chacun été exécutés en échec avant leur implémentation puis en succès.
- Un test supplémentaire a reproduit l’absence de garde d’état centralisée avant l’ajout de `commitOnStorageSuccess`.
- La consultation des anciennes versions d’évaluation a été ajoutée après un test RED sur `historicalAssessmentContexts`, puis validée en GREEN.
- À la suite d’une première revue indépendante, la matrice a été complétée pour les neuf contrats majeurs : valeur versionnée, représentation historique non versionnée, JSON invalide, version future, indisponibilité en lecture et écriture, forme runtime invalide et limites de texte ou de collection applicables.

Vérifications :

- Tests S4 ciblés : 6 fichiers / 108 tests réussis.
- `npm run typecheck` et `npm run lint` : exit 0.
- `npm run test` : 26 fichiers / 223 tests Vitest puis 33 tests Node, tous réussis.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript, lint et suites complètes réussis.
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 775 modules transformés, 662/662 routes prérendues en mode strict, aucune erreur de route ou de métadonnée et 404 dédiée écrite.
- `git diff --check` : exit 0 avant la mise à jour documentaire finale.
- Contrôle du manifeste de baseline : aucune différence inattendue hors du périmètre S4 et des sessions antérieures déjà consignées ; aucun fichier manquant inattendu ni suppression restaurée.
- Scan statique du périmètre : aucun secret codé en dur, `eval`, HTML non sûr ou primitive d’exécution shell détecté.
- Contre-revue indépendante finale : `passed: true`, sans préoccupation de sécurité, erreur logique ni écart de spécification. Elle a relancé les tests ciblés du store d’évaluation et des contrats métier, un typecheck complet et le lint des quatre fichiers concernés.

Fichiers principaux touchés : `client/src/lib/storage.ts`, `client/src/lib/storage.contract.test.ts`, `client/src/lib/storageDomains.ts`, `client/src/lib/storageDomains.test.ts`, `client/src/lib/learningWorkspace.ts`, `client/src/lib/learningWorkspace.test.ts`, `client/src/lib/certificationAssessment.ts`, `client/src/lib/certificationAssessment.test.ts`, `client/src/lib/ikigaiCahier.ts`, `client/src/lib/ikigaiCahier.test.ts`, `client/src/context/UserDataProvider.tsx`, `client/src/context/ThemeProvider.tsx`, `client/src/pages/onboarding/useOnboardingMode.ts`, `client/src/pages/onboarding/OnboardingPage.tsx`, `client/src/components/ikigai/cahierSections/reflection.tsx`, `client/src/pages/certifications/CertificationDetailPage.tsx`, `client/src/pages/certifications/CertificationEvaluationPage.tsx`, `client/src/pages/learn/LessonPage.tsx`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — Contre-revue et consolidation de S3

Objet : traiter les défauts révélés après la première clôture de S3 et compléter les preuves d’intégration du prérendu, de la 404 et de la parité des routes.

Constats de la revue indépendante :

- L’échec de `browser.newPage()` pouvait faire rejeter `Promise.all` avant la terminaison des autres workers. Le résumé pouvait alors être retourné, puis encore muté par une écriture tardive.
- Une page de détail introuvable exécutait son propre hook SEO avant de rendre `NotFoundPage`. Selon l’ordre des effets React, le parent pouvait restaurer une canonical et retirer `noindex` après la 404.
- Les comparaisons entre collecteur, sitemap et prérendu dérivaient de la même source et ne suffisaient pas à détecter seules une divergence avec React Router ou avec le fichier sitemap versionné.
- Les scénarios stricts demandaient une preuve d’intégration par la CLI avec Chromium indisponible puis disponible, ainsi qu’un contrôle du head React réel.

Corrections :

- Les workers du prérendu sont tous attendus avec `Promise.allSettled`. Les échecs d’initialisation et de fermeture d’une page sont intégrés au résumé, et le navigateur comme le serveur ne sont fermés qu’après la fin des workers.
- Les chemins de sortie du prérendu sont résolus et confinés sous le répertoire de distribution ; les requêtes statiques mal formées ou tentant une traversée ne peuvent plus sortir de cette racine.
- `useResourcePageMeta` unifie la politique du head entre les quinze pages de détail concernées et leur branche `NotFoundPage`. Une ressource absente force `Terra Incognita`, `noindex,nofollow`, le type `website` et l’absence de canonical ou d’`og:url`. Toute route couverte par la politique partagée `noindex` est également privée de ces deux URL.
- Les tests confrontent le registre exécutable aux chemins déclarés dans `App.tsx`, puis le sitemap XML versionné aux 662 chemins du collecteur.
- Une intégration lance un Chromium réel, pilote la CLI stricte sur une distribution isolée, contrôle la route rendue et `404.html`, puis vérifie dans React une page de détail inconnue, le diagnostic, l’évaluation et la correction. L’échec avec un exécutable Chromium inexistant reste testé séparément.
- Les tests Node sont sérialisés afin de ne pas lancer plusieurs instances Chromium concurrentes dans le même gate.

Preuves RED puis GREEN :

- Le test de concurrence a d’abord observé le retour du prérendu avant libération du worker encore actif ; il réussit après l’attente complète des workers.
- Le test SEO a d’abord observé la canonical conservée par un modèle parent obsolète et sur une route `noindex` ; les deux cas réussissent après centralisation de la politique.
- Le test d’intégration CLI a d’abord échoué faute de distribution isolable, puis a réussi avec l’option de répertoire dédiée et un Chromium réel.

Vérifications :

- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript et lint réussis ; 26 fichiers / 162 tests Vitest et 33 tests Node.
- `node --test scripts/prerender.integration.test.mjs` : 2/2 tests réussis, couvrant Chromium absent puis la CLI et le rendu React avec un navigateur réel.
- Une première relance complète du build a été bloquée à 657/662 sur cinq métadonnées de cours. Le lot des 27 routes de cours a ensuite réussi en concurrence 1 puis en concurrence 6 ; la relance complète finale a transformé 1 775 modules et prérendu 662/662 routes sans erreur.
- Audit final : 662 fichiers HTML de route, 662 canonical distincts, 662 `og:url` cohérentes, 662 URL de sitemap, 404 `noindex,nofollow` sans URL canonique, aucune origine interdite et zéro anomalie.
- `git diff --check` : exit 0.

Fichiers principaux touchés : `scripts/prerender.mjs`, `scripts/prerender.test.mjs`, `scripts/prerender.integration.test.mjs`, `scripts/collect-routes.test.mjs`, `client/src/lib/seo.ts`, `client/src/lib/seo.test.ts`, les quinze pages de détail qui peuvent rendre `NotFoundPage`, `package.json`, `Correction.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — S3 : prérendu strict, indexabilité et workflow Pages

Objet : rendre la production statique bloquante sur les erreurs, aligner les routes publiées avec leur politique d’indexation et réduire les privilèges de la publication manuelle.

Travaux :

- Ajout d’un registre partagé et testable des familles de routes publiques et des familles `noindex`. Le collecteur exclut désormais le diagnostic, les corrections, les évaluations et les espaces fonctionnels ; le sitemap et le prérendu consomment exactement son résultat.
- Remplacement des exclusions `robots.txt` par une politique de crawl ouverte sans publication au sitemap, afin que les pages fonctionnelles puissent exposer leur directive `noindex` sans contradiction.
- Refactorisation de `scripts/prerender.mjs` en fonctions importables et injectables. Le mode strict est le défaut du cycle `build`, vérifie le lancement de Chromium, la navigation, le contenu rendu, les métadonnées, le nombre de sorties et l’écriture d’une 404 dédiée. Le mode tolérant reste une commande explicitement distincte de diagnostic.
- Extraction d’un modèle SEO testable. Les pages inconnues et fonctionnelles sont `noindex`; la 404 et le diagnostic ne reçoivent plus de canonical ni d’`og:url` automatiques.
- Génération de `dist/404.html` depuis une vraie route inconnue, avec contenu rendu, `robots=noindex,nofollow` et sans canonical. Aucun duplicat du shell racine n’est utilisé comme faux document 404.
- Extension du lint racine aux scripts Node, aux modules partagés et aux hooks ESM. Deux ensembles inutilisés du validateur ont été retirés sans modifier les contrôles exécutés.
- Durcissement du workflow Pages : déclenchement uniquement manuel, permissions vides par défaut, checkout sans credentials persistants, actions épinglées par SHA, job de build en lecture seule et job de déploiement séparé. Aucun workflow n’a été lancé.
- Documentation du contrat d’hébergement statique, de la commande tolérante et de la cible d’en-têtes CSP, `Referrer-Policy`, `X-Content-Type-Options` et `Permissions-Policy`. Ces en-têtes restent un gate à contrôler sur l’hébergement réel avant toute publication ; une réponse 200 aux liens directs vers les routes fonctionnelles `noindex` requiert également une règle d’hôte explicite.

Preuves RED puis GREEN :

- `scripts/prerender.test.mjs` a d’abord échoué avant l’export des contrats, puis ses 7 tests ont réussi après l’implémentation du résumé strict et de la 404.
- `scripts/collect-routes.test.mjs` a d’abord révélé le diagnostic publié et l’absence de registre commun, puis ses 9 tests ont réussi après l’exclusion partagée et les contrôles de parité.
- `client/src/lib/seo.test.ts` a d’abord échoué faute de modèle testable, puis ses 2 tests ont réussi avec la politique canonical/noindex explicite.
- `scripts/deploy-workflow.test.mjs` a d’abord échoué sur le cycle de build permissif, les références d’actions et le périmètre du lint, puis ses 5 tests ont réussi après durcissement.

Vérifications :

- `npm ci` : exit 0, 302 paquets installés depuis le lockfile ; aucun fichier suivi n’a été modifié par l’installation.
- `npm run check` : exit 0 — validation stricte et glossaire réussis, TypeScript et lint sans erreur ; 22 fichiers / 124 tests Vitest et 27 tests Node.
- `npm run lint`, `npm run typecheck`, `npm run test:node` et `npm run test --workspace client`, également exécutés séparément : exit 0.
- Build Vite temporaire sous la base `/` : exit 0 ; prérendu strict ciblé de `/home` : 1/1 écriture et 404 dédiée. Les assets restent sous `/assets/` et la canonical sous l’origine de test.
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build` : exit 0 — 1 774 modules transformés et prérendu strict de 662/662 routes, sans erreur de route, de métadonnée ou de comptage. Vite conserve un avertissement de taille sur le chunk `lessons.bodies`, suivi comme risque de performance distinct.
- Échec négatif contrôlé : avec un exécutable Chromium volontairement inexistant, `prerender:strict` retourne un exit 1 et le résumé `browser-unavailable`. La relance ciblée de `/home` avec le navigateur disponible écrit 1/1 route.
- Audit statique : 662 fichiers `index.html`, 662 canonical uniques, 662 `og:url` cohérentes et 662 URL uniques dans le sitemap ; aucune origine interdite, aucun chemin hors `/vc-plateform/`, aucune intersection avec les familles `noindex`, aucun artefact de diagnostic et aucune duplication entre `index.html` et `404.html`.
- Contrôle d’hébergement statique local : `/vc-plateform/home` répond en 200 ; une URL inconnue répond en 404 avec `Terra Incognita`, `robots=noindex,nofollow`, sans canonical ni `og:url`. Chromium ne relève aucune erreur console et les ressources répondent en 200.
- Validation YAML du workflow, scan statique ciblé de 18 fichiers sans secret codé en dur ni primitive d’exécution dangereuse, et `git diff --check` : exit 0.
- `npm audit --omit=dev --audit-level=high` : exit 0, aucune vulnérabilité de production. L’audit incluant l’outillage retourne un exit 1 pour un avis élevé sur `brace-expansion`, dépendance transitive d’ESLint/TypeScript ; le correctif de lockfile, hors périmètre S3, reste ouvert avant la recette finale.

Fichiers principaux touchés : `shared/routes.mjs`, `shared/routes.d.mts`, `scripts/collect-routes.mjs`, `scripts/collect-routes.test.mjs`, `scripts/generate-sitemap.mjs`, `scripts/prerender.mjs`, `scripts/prerender.test.mjs`, `scripts/deploy-workflow.test.mjs`, `scripts/validate-content.mjs`, `client/src/lib/seo.ts`, `client/src/lib/seo.test.ts`, `client/src/pages/system/NotFoundPage.tsx`, `client/src/pages/learn/ParcoursDiagnosticPage.tsx`, `client/src/pages/certifications/CertificationEvaluationPage.tsx`, `client/src/pages/cases/CaseCorrectionPage.tsx`, `client/eslint.node.config.js`, `client/public/robots.txt`, `client/public/sitemap.xml`, `.github/workflows/deploy-pages.yml`, `package.json`, `README.md`, `CLAUDE.md`, `Correction.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — Réconciliation documentaire après S2

Objet : vérifier que l’audit historique, l’état courant et le journal daté décrivent sans contradiction l’avancement réel de S1 et S2.

Travaux :

- Classification explicite de `Correction.md` comme instantané historique dans ses sections 1 à 11, avec suivi post-audit dans la section 12.
- Ajout d’une table de statut pour `PRE-003`, `DEPLOY-001`, `DEPLOY-003` et `DEPLOY-004`, tous traités par S2 dans le worktree courant sous réserve de la recette finale S17.
- Consignation dans `Correction.md` des 11 tests Node, des liens issus des données, de l’audit des 663 artefacts et des deux revues indépendantes.
- Clarification dans `ETAT.md` de la hiérarchie documentaire et du risque d’archivage : `Correction.md` est à jour mais reste non suivi par Git.
- Conservation de S3 comme prochaine session et de la décision globale de publication en NO-GO.

Vérifications :

- Lecture croisée de `Correction.md`, `Suivis/ETAT.md`, `Suivis/JOURNAL.md`, du plan de correction, du contrat de base URL, du manifest, du workflow et du gate racine.
- `node --test scripts/*.test.mjs shared/*.test.mjs` : 11/11 tests réussis.
- Les seules occurrences de `/vc-platform/` ou `example.test` dans les sources exécutables contrôlées sont des fixtures génériques de `shared/base-url.test.mjs` ; aucune occurrence active de `https://vcpx.io` n’a été trouvée.
- Aucun code produit, contenu éditorial ou artefact généré n’a été modifié pendant cette réconciliation documentaire.

Fichiers touchés : `Correction.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — Unification de la base publique, des assets et du manifest

Objet : rendre le client, les assets publics et les sorties SEO cohérents à la racine comme sous le sous-chemin GitHub Pages, sans inventer d’origine de production.

Travaux :

- Création du contrat cross-runtime `shared/base-url.mjs`, accompagné de ses déclarations TypeScript et de six tests : normalisation de `VITE_BASE_URL`, `basename`, routes dures, assets publics, origine canonique et manifest relatif.
- Alignement de Vite, React Router, de la navigation de repli, des téléchargements locaux et des liens internes rendus hors `Link` sur cette base unique.
- Migration des favicons, images Open Graph génériques, fonds du splash, décor nocturne et médias des deux analyses scrollytelling vers des URL compatibles avec un sous-chemin.
- Passage du manifest à des références relatives pour `start_url`, `scope` et les deux icônes. Le produit reste en mode manifest-only : aucun service worker ni fonctionnement hors ligne n’est annoncé.
- Suppression du fallback `https://vcpx.io` des scripts. Le sitemap et le prérendu exigent désormais `VITE_SITE_URL` et refusent un chemin canonique incompatible avec `VITE_BASE_URL`.
- Choix explicite de l’URL Pages `https://iari-ctrl.github.io/vc-plateform` avec la base `/vc-plateform/` dans le workflow manuel. Aucun domaine personnalisé ni fichier `CNAME` n’est configuré.
- Régénération de `robots.txt` et du sitemap avec 663 routes sous l’origine Pages. Les `Disallow` suivent également le sous-chemin.
- Intégration des tests du contrat partagé au gate Node racine.

Fichiers principaux touchés : `shared/base-url.mjs`, `shared/base-url.d.mts`, `shared/base-url.test.mjs`, `client/vite.config.ts`, `client/src/main.tsx`, `client/index.html`, `client/public/site.webmanifest`, `client/public/robots.txt`, `client/public/sitemap.xml`, `client/src/lib/seo.ts`, `client/src/lib/markdown.tsx`, `client/src/styles/splash.css`, `client/src/pages/home/SplashPage.tsx`, `client/src/pages/blog/DebordScrollytelling.tsx`, `client/src/pages/blog/HirschmanScrollytelling.tsx`, `client/src/pages/intelligence/DeliverablePage.tsx`, `client/src/pages/cases/CaseStudyPage.tsx`, `client/src/components/ErrorBoundary.tsx`, `client/src/components/ornaments/Illustrations.tsx`, `scripts/generate-sitemap.mjs`, `scripts/prerender.mjs`, `.github/workflows/deploy-pages.yml`, `package.json`, `README.md`, `CLAUDE.md` et `docs/ARCHITECTURE_EDITION.md`.

Vérifications :

- Preuves RED puis GREEN sur le helper partagé et le contrat manifest ; `node --test shared/base-url.test.mjs` : 6/6 tests réussis.
- `npm run check` : exit 0 — validation stricte et glossaire réussis, TypeScript et lint sans erreur ; 21 fichiers / 122 tests Vitest et 11 tests Node.
- Builds Vite sous `/` et `/vc-plateform/` : exit 0. Le build de publication a prérendu 663/663 pages.
- Audit des 663 HTML et du sitemap : 663 canonical distincts, 663 `og:url` identiques aux canonical, 663 URL de sitemap uniques, manifest résolu sous la base et aucun chemin interne hors `/vc-plateform/`.
- Contrôles HTTP sous `/vc-plateform/` : HTML, manifest et asset WebP servis en 200 avec les types MIME attendus.
- Chromium en bureau et mobile : splash, accueil, deux analyses scrollytelling et livrable vérifiés ; canonical, Open Graph, médias, liens de ressources et popover glossaire suivent la base, sans image cassée ni erreur console.
- Revue indépendante : aucune erreur logique ou de sécurité relevée dans le périmètre S2. Le prérendu fail-open et l’épinglage des actions GitHub restent affectés à S3.
- `git diff --check` : exit 0.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — Formalisation du plan de correction et clôture de S1

Objet : transformer les 91 constats de `Correction.md` en un plan exécutable, tout en séparant les travaux de la mission des 107 changements déjà présents dans le worktree.

Travaux :

- Relecture de `Correction.md`, des règles du dépôt, des scripts de qualité et des principaux contrats de déploiement, de persistance, de contenu et d’accessibilité.
- Réconciliation des 91 identifiants de l’audit : constats clos, mécanismes déjà partiels, écarts ouverts, décisions produit et contrôles de non-régression.
- Création de `.hermes/plans/2026-07-22_134627-correction-baseline.json`, manifest en lecture seule des 107 entrées préexistantes avec statut et empreinte SHA-256 lorsque le fichier existe.
- Création de `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`, plan de 17 sessions de 3 à 4 heures couvrant dépendances, cycles RED–GREEN–REFACTOR, gates et critères de sortie.
- Conservation de `Correction.md` comme audit historique ; ajout d’un suivi opérationnel daté plutôt que réécriture des preuves de son instantané.

Vérifications :

- 17 sections de session détectées dans le plan.
- 91/91 identifiants de `Correction.md` présents dans la matrice, sans identifiant manquant ni supplémentaire.
- 107/107 entrées enregistrées dans le snapshot initial ; aucune n’avait changé à la clôture de S1.
- SHA-256 du plan : `90ba9c3cd4d5c1957835e85a1f46d9958b7d2189da1f167188963f635ca7969a`.
- SHA-256 du snapshot : `225249e9779ab257bcbf9d0c6fc8128862ab941ab095f494af731028142460b6`.
- Aucun build ni correctif produit n’a été exécuté au titre de S1. Les builds et modifications de base publique consignés dans l’entrée précédente relèvent de S2, intervenue ensuite.

Fichiers de planification créés : `.hermes/plans/2026-07-22_134627-correction-baseline.json` et `.hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md`. Fichiers de suivi alignés lors de la présente consignation : `Correction.md`, `Suivis/ETAT.md` et `Suivis/JOURNAL.md`.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-22 — Cycle de production du parcours Venture philanthropie

Objet : relier les 21 leçons à un dossier longitudinal, permettre une première version, un retour, une révision et un transfert, puis corriger les durées et les contrats du parcours.

Travaux :

- Correction des durées dérivées des six cours à 11, 15, 20, 22, 22 et 21 minutes, soit 111 minutes de lecture. Les 21 contributions guidées représentent 22 h 30 ; les trois consolidations 4 h ; le jalon 6 h ; les activités facultatives 4 h.
- Ajout du diagnostic d’entrée `diag-vp-entree`, facultatif et sans score, avec cinq restitutions individuelles et des renvois vers les ressources utiles.
- Transformation de Trait d’Union en dossier apprenant de 13 pièces structurées. Les tables couvrent les données nécessaires à une prévision de trésorerie à 13 semaines et à un modèle mensuel à 18 mois. Les conclusions financières sont réservées à `corr-vp-trait-union`.
- Création des trois exercices cumulatifs, de la fiche d’escalade juridique, de l’atelier portefeuille et du cas de transfert Énergie des Vallées. Chaque leçon contribue à une section identifiée du même dossier.
- Extension du jalon final à huit composants, 13 critères observables, quatre niveaux textuels et cinq cartes de rôle. Les fiches de travail et de revue s’exportent en Markdown. Aucun niveau n’est agrégé en score.
- Ajout du stockage versionné `vcpx:learning-workspace` pour le diagnostic, les notes, la déclaration d’un fichier externe, les étapes de production, les appréciations, le journal des modifications, la révélation de la correction et la déclaration finale explicite.
- Ajout des routes `/parcours/:slug/diagnostic` et `/cases/:slug/correction`. La seconde porte `noindex`; sa collection reste hors Bibliothèque, recherche, sitemap et prérendu, puis se charge à la demande après révélation volontaire.
- Séparation de la progression de lecture et de l’état du jalon. Les ressources restent librement accessibles et l’ordre demeure conseillé.
- Mise à jour des contrats TypeScript, des schémas Zod, des tests, du référentiel de parcours, de la documentation d’architecture, du design system, de la stratégie produit et du présent suivi.

Le classeur `.xlsx` recalculable n’a pas été généré. Le paquet requis `@oai/artifact-tool` est absent de l’environnement et aucun outil de chargement de dépendances n’est disponible. Les liens vers un fichier inexistant ont été retirés ; les données sources et les tables restent présentes dans le dossier apprenant.

Fichiers principaux touchés : `data/courses.json`, `data/lessons.json`, `data/parcours.json`, `data/caseStudies.json`, `data/deliverables.json`, `data/diagnostics.json`, `data/caseCorrections.json`, `client/src/lib/learningWorkspace.ts`, `client/src/pages/learn/ParcoursDetailPage.tsx`, `client/src/pages/learn/ParcoursDiagnosticPage.tsx`, `client/src/pages/cases/CaseStudyPage.tsx`, `client/src/pages/cases/CaseCorrectionPage.tsx`, `client/src/pages/intelligence/DeliverablePage.tsx`, `client/src/pages/workspace/DecisionJournalPage.tsx`, `scripts/validate-content.mjs`, `scripts/collect-routes.mjs`, `docs/parcours/VENTURE-PHILANTHROPIE.md`, `docs/parcours/README.md`, `docs/STRATEGIE-vc-intelligence.md`, `docs/ARCHITECTURE_EDITION.md`, `docs/DESIGN_SYSTEM.md`, `PRODUCT.md` et les index dérivés.

Vérifications :

- `npm run split:content`, `npm run validate:content:strict`, `npm run validate:glossary`, `npm run typecheck` et `npm run lint` : exit 0.
- `npm run test` : 21 fichiers / 122 tests Vitest et 5 tests Node, tous réussis.
- Build client : exit 0, 1 773 modules transformés. Le postbuild a fermé ponctuellement sa connexion Chromium après 650 routes ; la relance de `npm run prerender` a écrit 663/663 pages.
- Chromium à 1 440 × 1 000 et 390 × 844 : parcours, diagnostic, dossier, jalon, correction et journal contrôlés ; persistance après rechargement, navigation clavier, noms accessibles et absence de débordement horizontal vérifiés.
- `git diff --check` : exit 0.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-20 — Corrections prioritaires et cadrage du parcours Venture philanthropie

Objet : corriger les incohérences éditoriales et financières du parcours `/parcours/venture-philanthropy-foundations`, puis expliciter la venture philanthropie et ses différences avec les approches voisines.

Travaux :

- Remplacement de la mention d’un « score local de la certification » dans le livrable final : la mise en situation est désormais explicitement autoévaluée et ne produit ni score, ni résultat, ni attestation.
- Explicitation de l’écart entre le coût de réplication de 1,65 M€ et l’engagement maximal de 1,20 M€. Le solde de 450 k€ doit être couvert par des cofinancements documentés et signés avant la seconde tranche, ou par une réduction du périmètre et un report des ouvertures correspondantes.
- Création de cinq entrées de glossaire adaptées aux associations et aux partenariats de financement : gouvernance associative, convention de financement, trésorerie mobilisable, sortie de partenariat et droits d’information du financeur. Les renvois hérités du capital-risque ont été remplacés dans les 21 leçons du parcours ; le registre canonique et le glossaire publié restent alignés.
- Correction de la référence CNIL vers le guide destiné aux associations publié le 10 novembre 2021.
- Renforcement de la méthode de trésorerie dans les exercices concernés : tableau obligatoire du solde bancaire, des restrictions contractuelles, des emplois financés, de leurs échéances et de la trésorerie effectivement mobilisable ; les restrictions et décaissements ne sont plus soustraits deux fois.
- Réécriture de la première leçon et mise à jour du parcours, du premier cours, du glossaire et du référentiel maintenu. La venture philanthropie est définie comme une approche de soutien combinant financement adapté, accompagnement non financier, engagement dans la durée et gestion de l’impact ; elle est distinguée de la subvention philanthropique, du capital-risque, de l’investissement pour l’impact au sens large, de l’`impact investing` au sens financier, du financement catalytique et du financement non affecté.
- Conservation de l’architecture existante : six cours et 21 leçons, sans ajout de leçon ni mécanisme certificatif. Régénération des index de leçons et des définitions du glossaire.

Fichiers touchés : `data/deliverables.json`, `data/caseStudies.json`, `data/courses.json`, `data/lessons.json`, `data/parcours.json`, `data/glossary.json`, `data/sources/canonical-glossary.json`, `docs/parcours/VENTURE-PHILANTHROPIE.md`, les quatre fichiers dérivés correspondants sous `data/generated/` et `client/public/sitemap.xml`.

Vérifications :

- `npm run split:content` : exit 0 — index générés à jour.
- `npm run generate:sitemap` : exit 0 — 656 routes canoniques, dont les cinq nouvelles fiches de glossaire ; le domaine canonique reste à définir avant production.
- `npm run validate:content:strict` : exit 0 — 24 parcours, 1 certification, 27 cours, 129 leçons, 405 termes et 438 marqueurs résolus.
- `npm run validate:glossary` : exit 0 — 405 termes, slugs, identifiants, renvois, leçons, marqueurs et aliases cohérents.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript et lint sans erreur ni avertissement ; 18 fichiers / 107 tests Vitest et 4 tests Node.
- Contrôles ciblés : cohérence des définitions publiées et canoniques, durée du premier cours, contrat de longueur de la leçon d’ouverture et fraîcheur des fichiers générés. Les changements étant exclusivement éditoriaux, aucune nouvelle revue visuelle n’était requise.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-20 — Migration de VC Analyst Foundations vers un parcours

Objet : requalifier `analyst-foundations` en parcours de formation ouvert, sans modifier les 23 leçons publiées ni la préparation recommandée de la certification professionnelle `VC Analyst`.

Travaux :

- Création du parcours `p-analyst-foundations` sous `/parcours/analyst-foundations`, avec ses sept séquences dans l’ordre existant : six cours et la leçon autonome sur la distinction entre fait et hypothèse.
- Retrait de `cert-analyst-foundations`, de son évaluation et du prérequis qui y renvoyait. Aucun certificat, badge, résultat local, question ou mini-cas certificatif n’est conservé pour ce parcours. Aucun cas pratique ni livrable autonome n’était rattaché à Foundations.
- Ajout des redirections des anciennes fiches et évaluations vers le nouveau parcours. La recherche, la Bibliothèque, le sitemap et le prérendu publient désormais l’URL du parcours.
- Transfert des contrats pédagogiques utiles vers les tests de parcours : ordre des séquences, couverture des 23 leçons, accès des cours depuis la Bibliothèque et absence de dépendance certificative.
- Mise à jour des référentiels actifs ; l’ancien référentiel Foundations est conservé comme archive explicitement signalée.

Vérifications :

- `npm run split:content`, `npm run generate:sitemap` et `npm run check` : exit 0 — 24 parcours, 1 certification, 5 niveaux, 0 évaluation ; 18 fichiers / 107 tests Vitest et 4 tests Node.
- Build racine : 1 763 modules transformés ; le prérendu autorisé a rendu 651/651 routes. Le prérendu ciblé de `/parcours/analyst-foundations` : exit 0.
- Navigateur headless local : fiche parcours, deux redirections, présence des six cours associés dans la Bibliothèque et résultat de recherche vers `/parcours/analyst-foundations` contrôlés à 1 440 × 1 000.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-20 — Migration de Venture Philanthropy Foundations vers un parcours

Objet : requalifier le certificat local `venture-philanthropy-foundations` en parcours de formation ouvert, sans retirer les six cours, les 21 leçons, le cas ni le livrable associés.

Travaux :

- Création du parcours `p-venture-philanthropy-foundations` sous `/parcours/venture-philanthropy-foundations`, dans la famille « Maîtriser ». Les six cours restent ordonnés comme précédemment et le livrable `vp-recommandation-soutien` devient le jalon autoévalué.
- Retrait de `cert-vp-foundations` et de `assessment-vp-foundations-v1`. Les questions et mini-cas ne sont plus exposés comme évaluation certificative ; le cas fictif et le livrable restent accessibles depuis le parcours.
- Ajout de redirections des anciennes URLs de fiche et d’évaluation vers le nouveau parcours. La recherche, la sitemap et le prérendu publient désormais la seule URL `/parcours/...`.
- Extension de la Bibliothèque aux cours hors rayon mobilisés par un parcours, et neutralisation du libellé « Parcours professionnels » sur les fiches de cours.
- Requalification de la documentation maintenue vers `docs/parcours/VENTURE-PHILANTHROPIE.md`. Les documents de certification antérieurs sont explicitement marqués comme historiques.

Vérifications :

- `npm run validate:content:strict` : exit 0 — 23 parcours, 2 certifications, 1 évaluation, 27 cours, 129 leçons, 400 termes et 421 marqueurs résolus.
- `npm run split:content` et `npm run generate:sitemap` : exit 0 — 651 routes canoniques ; l’ancienne URL de certification n’est plus publiée.
- `npm run check` : exit 0 — 19 fichiers / 115 tests Vitest et 4 tests Node.
- Build racine : 1 763 modules transformés. Le postbuild a d’abord rencontré l’interdiction du bac à sable d’écouter sur `127.0.0.1:4317` ; la relance autorisée de `npm run prerender` a écrit 651/651 pages statiques.
- Aucun navigateur n’était disponible pour la revue visuelle bureau/mobile. La fiche parcours et le catalogue prérendus ont été contrôlés statiquement.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-20 — Certification Venture Philanthropy Foundations

Objet : transformer le dossier préparatoire Venture Philanthropy en un certificat local de connaissances complet, centré sur les tâches d'un analyste junior sous supervision et distinct d'un titre professionnel.

Travaux :

- Audit du plan initial et réorganisation des contenus selon le flux de travail réel : mandat et triage, problème et preuves, diligence organisationnelle, diligence financière, structuration du financement, puis partenariat, recommandation et cycle de portefeuille.
- Publication de `Venture Philanthropy Foundations` avec 6 compétences, 6 cours et 21 leçons. Chaque leçon traite une situation professionnelle, une méthode, un cas corrigé, des points de contrôle et une production attendue ; elle comporte trois objectifs, quatre questions situationnelles et deux à quatre sources datées.
- Ajout de l'évaluation `assessment-vp-foundations-v1` : 24 QCM pour 48 points et trois mini-cas financiers pour 52 points. Les seuils cumulatifs sont 70/100 au total, 28/48 au QCM et 8 points dans chacun des cas.
- Création du cas fictif `cs-vp-insertion-3-regions` et du livrable `vp-recommandation-soutien`. La mise en situation demande un mémo décisionnel et une annexe financière ; elle est autoévaluée, hors score et ne constitue pas une preuve de compétence professionnelle.
- Ajout de 19 termes au glossaire canonique et rattachement de 8 termes existants aux nouvelles leçons. Les définitions distinguent les notions économiques ou contractuelles des qualifications juridiques françaises et signalent les vérifications compétentes nécessaires.
- Généralisation des écrans de catalogue, de fiche et d'évaluation à plusieurs domaines et plusieurs contrats de points. Ajout de la résolution d'un livrable dans les lectures complémentaires et du libellé de cas « Organisation à impact ».
- Création du référentiel maintenu `docs/certifications/REFERENTIEL-VENTURE-PHILANTHROPY.md`. Le plan initial est conservé comme archive supplantée ; l'architecture transverse documente le capstone hors score et la portée du certificat de connaissances.
- Régénération des index de leçons, des définitions du glossaire et du sitemap. Mise à jour de `Suivis/ETAT.md` avec les compteurs effectivement produits par les validateurs.

Vérifications :

- `npm run validate:content:strict` : exit 0 — 22 parcours, 3 certifications, 27 cours, 129 leçons, 400 termes, 2 évaluations, 7 cas, 3 livrables et 421 marqueurs résolus.
- `npm run validate:glossary` : exit 0 — 400 termes, slugs, identifiants, renvois, leçons et aliases cohérents.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript et lint sans erreur ni avertissement ; 18 fichiers / 117 tests Vitest et 4 tests Node.
- Build client : 1 763 modules transformés. Le postbuild a d'abord rencontré l'interdiction du bac à sable d'écouter sur `127.0.0.1:4317` ; la relance autorisée de `npm run prerender` a écrit 651/651 routes.
- Contrôle statique du HTML prérendu : catalogue, fiche par défaut, étude de cas, livrable et leçon finale présents avec leurs contenus et liens attendus. Le navigateur intégré n'était pas disponible ; aucune vérification visuelle bureau/mobile n'est revendiquée pour cette passe.

Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-18 — Séparation Foundations / Analyst et évaluation locale

Objet : distinguer le certificat de connaissances `VC Analyst Foundations` de la certification professionnelle `VC Analyst`, classer les 35 leçons publiées entre les deux niveaux et livrer une évaluation Foundations locale sans engager la production des futures épreuves professionnelles.

Travaux :

- Déplacement de l'ancienne note racine vers `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md`, puis séparation du référentiel Analyst, des invariants de gouvernance et du protocole de production. La cible à cinq axes, le titre professionnel invariant et le supplément contextualisé sont documentés ; les trois axes techniques et les 160 compositions actuelles sont conservés.
- Passage de `Certification` à l'union discriminée `KnowledgeCertification | ProfessionalCertification`. Publication de Foundations avec 7 exigences de cours, 6 compétences et 23 leçons ; reclassement des 12 autres leçons dans 3 blocs de préparation Analyst recommandés et non bloquants. Retrait des `assessmentId` inertes et correction des quatre chaînes de prérequis attendues.
- Ajout des trois collections canoniques versionnées : six promesses de niveau, charte du candidat à sept principes avec annexe de session inactive, et évaluation Foundations. Les quatre niveaux supérieurs ne portent ni durée, ni seuil, ni cours engagé.
- Création de l'évaluation dédiée : 30 QCM nouveaux, cinq par compétence et 40 points, plus trois mini-cas numériques de 20 points. Les seuils 70/100, 24/40 et 10/20 par cas sont cumulatifs. Les conventions économiques, unités, tolérances et corrections sont explicites.
- Ajout du moteur local : mélange unique conservé, reprise après rechargement, nombres localisés, bornes flottantes robustes, historique des cinq derniers essais, meilleur résultat isolé par versions, déclaration d'outils et charte enregistrées, lecture défensive du stockage et remise à zéro confirmée.
- Adaptation du catalogue, des deux fiches, de la recherche et de la vue `/certifications/niveaux`. La route `/certifications/:slug/evaluation` reste hors sitemap et prérendu. Le détail Foundations suit Aperçu → Programme → Évaluation ; le détail Analyst distingue prérequis, préparation, options et évaluation professionnelle.
- Revue indépendante des questions et des mini-cas : clarification du carried interest et de la préférence 1x, remplacement des items trop proches des quiz formatifs, puis seconde vérification des clés et calculs. Revue du moteur suivie de corrections sur les tolérances, les migrations de version, les statuts de correction, les seuils visibles et le transfert de focus.
- Régénération des index et corps de leçons. Mise à jour de `CLAUDE.md`, `docs/ARCHITECTURE_EDITION.md`, `docs/DESIGN_SYSTEM.md`, `Suivis/ETAT.md` et du présent journal.

Vérifications :

- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript et lint sans erreur ni warning ; 17 fichiers / 110 tests Vitest et 4 tests Node.
- Tests dédiés : classement exact 23/12 sans doublon, sous-séquences de cours, autonomie des prérequis, 160 compositions, titre/supplément, 30 + 12 réponses, seuils non compensables, tolérances, versions, reprise, historique, meilleur résultat, stockage corrompu ou indisponible et remise à zéro.
- Build racine : 1 762 modules transformés. Le prérendu a écrit 601 routes avant une expiration transitoire sur `/glossary/market-concentration` ; la reprise ciblée a rendu la route manquante, portant le résultat final à 602/602.
- Navigateur headless local : catalogue, deux fiches et six niveaux sans débordement ni erreur en 1 440 × 1 000 et 390 × 844 ; thèmes sombre/clair et activation clavier contrôlés. Parcours complet Foundations vérifié jusqu'au résultat 100/100, reprise 42/42, 42 corrections et effacement ; préparation Analyst 3 blocs/12 leçons et options Seed–Lead–SaaS persistées avec titre invariant.

Aucun fonds de référence, bible de cas ou mission M1 produit. Aucun commit, push, déploiement ni lancement du workflow Pages.

---

## 2026-07-16 — Finalisation du tronc commun Analyst en capital-risque

Objet : publier l'intégralité du tronc commun de la certification Analyst en capital-risque dans un registre sérieux, sobre et institutionnel, sans modifier les trois axes optionnels.

Travaux :

- Conservation des 9 cours communs et passage de 30 à 35 leçons. Ajout du suivi de portefeuille, du modèle de trésorerie et des scénarios de financement, de la valeur économique des termes d'investissement, de la due diligence financière et des conflits d'intérêts.
- Réécriture des 30 leçons existantes et publication des 9 fiches communes auparavant `upcoming`. Chaque leçon comprend un cadre, une méthode, un exemple ou calcul, des limites et points de contrôle, une mise en application avec critères de réussite, 2 à 4 références datées, 3 objectifs, 3 à 5 acquis clés et 4 questions à réponse unique.
- Normalisation des titres, sous-titres, résumés, tags et durées des cours. Les temps de lecture sont calculés à 180 mots par minute et chaque durée de cours ajoute 8 minutes d'exercice et de quiz par leçon.
- Mise en place d'une chaîne globale de prérequis et alignement des `assessmentId`, niveaux, contextes et statuts. Les identifiants et slugs existants sont conservés ; les 5 nouveaux identifiants sont `l-portfolio-monitoring`, `lmv-cash-flow-scenarios`, `lmv-valuation-economic-rights`, `l-dd-financial` et `l-conflicts-conduct`.
- Qualification explicite des seuils comme hypothèses contextuelles ; distinction entre valorisation de transaction, juste valeur et valeur économique des titres ; qualification des modèles NVCA comme américains et des documents France Invest ou Galion comme pratiques de place.
- Actualisation des liens institutionnels INPI, ANC, OCDE, CNIL, EUR-Lex, EIF, Insee et ESMA après une seconde revue et un contrôle automatisé des 51 URL distinctes. Les 28 leçons optionnelles et les 160 compositions facultatives restent inchangées.
- Extension des tests de certification : ordre exact, réciprocité cours/leçons, métadonnées, prérequis, durées, structure éditoriale, sources, quiz et maintien des options. Adaptation du test de routes pour tenir compte de la publication du pipeline CRM.
- Correction de la navigation précédente/suivante des leçons : la grille mobile utilise désormais une piste contrainte et ses liens peuvent se réduire sans imposer la largeur d'un titre long au document.
- Régénération des fichiers scindés, du sitemap et des 600 pages prérendues par les scripts du projet.

Vérifications :

- Audit éditorial : 35/35 leçons entre 900 et 1 400 mots hors références ; 35/35 publiées ; 3 objectifs et 4 quiz valides par leçon ; 2 à 4 sources datées ; aucune formulation promotionnelle détectée par le contrôle ciblé. Sur 51 URL distinctes, 49 ont répondu directement au contrôle automatisé ; les pages OCDE et OEB, bloquées par leur serveur pour ce client, ont été ouvertes et vérifiées séparément.
- Exemples de market sizing, unit economics, trésorerie, pre/post-money, dilution, cap table, préférences, MOIC, TRI, DPI/RVPI/TVPI et waterfall recalculés et réconciliés.
- `npm run check` : exit 0 — 108 leçons, 381 termes et 410 marqueurs ; TypeScript et lint sans erreur ni warning ; 16 fichiers / 98 tests Vitest et 4 tests Node.
- Build client : exit 0 — 1 753 modules transformés. Le postbuild a rencontré `listen EPERM` dans le bac à sable ; `npm run prerender` relancé avec l'autorisation du serveur local a rendu 600/600 routes.
- Contrôle statique des pages prérendues : fiche de certification et 35 leçons, 140 questions, renvois au glossaire, liens externes, titres et compteurs 35 disponibles / 0 à venir.
- Chrome DevTools MCP : fiche et une leçon de chacun des 9 cours vérifiées en bureau (1 440 × 1 000) et mobile tactile (390 × 844) ; navigation fiche → leçon → leçon suivante, ouverture d'un terme de glossaire, ouverture d'une référence EUR-Lex et retour explicatif du quiz contrôlés. Après correction du lien « Suivant », les 9 leçons présentent une largeur document de 390 px sur une vue de 390 px. Aucune erreur console, requête en échec ou image cassée. Lighthouse : 100 en accessibilité, bonnes pratiques et SEO sur la fiche et la leçon auditées.

Aucun déploiement, push ni lancement du workflow Pages.

---

## 2026-07-15 — Certification professionnelle Analyst en capital-risque

Objet : publier une première certification interne configurable, fondée sur un tronc commun et trois axes facultatifs, sans assimiler la complétion locale à une certification délivrée.

Travaux :

- Ajout des domaines Capital-risque et Venture philanthropie ; seule la certification professionnelle Analyst en capital-risque est publiée à ce stade.
- Modélisation du tronc commun de 9 cours et des axes Stade (4 options), Rôle du fonds (3) et Spécialité (7, dont Impact). Le résolveur couvre les 160 compositions avec « Aucune option » sur chaque axe, n'ajoute que les blocs choisis et omet les axes absents de l'intitulé.
- Migration cours–catalogue vers des relations plusieurs-à-plusieurs : retrait de `Course.pathId`, ordre porté par `Path.courseIds` et par les exigences de certification, relations inverses exposées sur les fiches cours.
- Extension des leçons avec statut, niveau, contextes, caractère optionnel, acquis visés, prérequis et évaluation. Les 37 contenus non encore rédigés sont marqués `upcoming`, affichés « (à venir) » et laissés sans lien de lecture.
- Ajout du catalogue `/certifications` et de la fiche `/certifications/analyste-en-capital-risque` : configurateur sans option par défaut, prévisualisation immédiate, curriculum calculé, récapitulatif, modification et progression limitée à la composition active.
- Persistance dans `certification-enrollments` des seules options renseignées ; une modification recalcule les exigences actives tout en conservant l'historique des leçons déjà suivies.
- Formalisation de l'évaluation finale, de ses 14 variantes, du seuil de 70/100, des critères critiques, erreurs éliminatoires et conditions d'identité, d'intégrité et de validation experte. Aucun état « certifié » automatique n'a été introduit.
- Intégration à la navigation Formation, à la recherche, aux métadonnées, au sitemap et au prérendu. Le collecteur de routes exclut désormais explicitement les leçons `upcoming`, après détection de 37 routes inaccessibles lors de la passe de suivi.
- Correction des contrastes de la fiche et du catalogue, ainsi que du nom accessible du logo, à la suite des audits Lighthouse.

Vérifications :

- `npm run check` : exit 0 — contenu strict (22 parcours, 1 certification, 9 rayons, 21 cours, 103 leçons, 381 termes et 441 marqueurs), glossaire, TypeScript et lint sans warning ; 16 fichiers / 97 tests Vitest et 4 tests Node.
- Les tests de certification parcourent les 160 compositions et vérifient tronc commun, options, ordre, absence de doublon, intitulés partiels, variante Impact, persistance et conservation de la progression historique. Le collecteur confirme 37 leçons `upcoming` et 0 route publique correspondante.
- Build client : exit 0 — 1 753 modules transformés. Le postbuild a rencontré `listen EPERM` dans le bac à sable ; `npm run prerender` relancé avec l'autorisation du serveur local a rendu 586/586 routes.
- Chrome DevTools MCP : catalogue et fiche vérifiés en bureau/mobile, clair/sombre et mouvement réduit ; composition vide puis Pre-seed + Lead + Impact, clavier, modification et persistance contrôlés ; aucune erreur ou alerte console, requête en échec, image cassée ni leçon à venir cliquable.
- Lighthouse sur le catalogue mobile et la fiche mobile/desktop : 100 en Accessibilité, Bonnes pratiques et SEO.

Aucun déploiement, push ni lancement du workflow Pages.

---

## 2026-07-15 — Glossaire de la finance à impact

Objet : ajouter au dictionnaire les notions demandées autour de la venture philanthropie, du capital catalytique et du financement mixte, avec leurs formulations françaises et anglaises usuelles.

Travaux :

- Ajout de 7 fiches publiées : Venture philanthropie, Investissement pour l’impact, Subvention catalytique, Capital catalytique, Beyond grants, Continuum du capital et Financement mixte.
- Conservation de Venture philanthropie et Beyond grants comme termes canoniques ; ajout de philanthropie de risque, venture philanthropy, au-delà des subventions et des autres formulations anglaises comme aliases recherchables.
- Définitions, exemples et maillage rédigés dans le registre éditorial puis injectés dans le glossaire final ; sources Impact Europe, OCDE et Investisseurs & Partenaires consignées dans le registre canonique.
- Régénération des chunks index/définitions du glossaire et du sitemap ; compteurs portés à 381 termes publiés, 443 entrées canoniques et 579 routes publiques.

Vérifications :

- `npm run check` : exit 0 — contenu strict, 381 termes de glossaire, TypeScript, lint sans warning, 13 fichiers / 75 tests Vitest et 2 tests Node.
- Build client : exit 0 — 1 747 modules transformés. Le postbuild a d’abord rencontré `listen EPERM` dans le bac à sable ; `npm run prerender` relancé avec l’autorisation du serveur local a rendu 579/579 routes.
- Chrome DevTools MCP : 7 routes détaillées rendues ; 9 recherches par aliases français/anglais résolues vers le bon terme ; vue étroite sans débordement horizontal ; aucune erreur ou alerte console et aucune requête réseau en échec.

---

## 2026-07-14 — Assainissement local et retrait des reliquats de versions

Objet : supprimer les débris recréables et les abstractions devenues fausses, consolider les doublons de maintenance et remettre la documentation active en accord avec l'application locale.

Travaux :

- Suppression du build, des caches Vite, des métadonnées Finder, du réglage VS Code vide et du lanceur macOS abandonné ; le build a été recréé uniquement pour validation puis retiré.
- Retrait des anciennes branches de chargement API, des résidus admin/auth, des commentaires serveur et des exports sans consommateur.
- Suppression de `parcoursConfig.json`, de `LocalizedText`/`t()` et du script npm `dev:client` ; `profileParcours.json.timeCalibration` pilote désormais réellement le filtrage des étapes.
- Nettoyage du lockfile de l'ancien paquet `server`, correction du manifeste PWA et passage de la publication manuelle par le cycle de build racine avec base préfixable.
- Mutualisation de `ParcoursCard`, des libellés de recherche et de cas, du comportement de popover et des primitives de scrollytelling ; la recherche reste chargée paresseusement.
- Ajout d'un identifiant et d'un nom au champ de recherche du dictionnaire après signalement de Chrome DevTools.
- Fusion des deux audits du 6 juillet, archivage des brouillons de parcours et de la stratégie historique longue, création des documents maintenus `docs/parcours/README.md` et `docs/STRATEGIE-vc-intelligence.md`.
- Correction des chemins et contrats devenus faux dans README, CLAUDE, architecture, design system et skill écosystèmes.

Vérifications :

- `npm run check` : exit 0 — contenu strict, glossaire, TypeScript, lint sans warning, 13 fichiers / 75 tests Vitest et 2 tests Node.
- Build client : exit 0 — 1 747 modules, chunk de recherche lazy, aucune alerte de mélange import statique/dynamique.
- `npm run prerender` : 572/572 routes publiques rendues sur le build final.
- Liens Markdown actifs, JSON de réglages et recherches de reliquats contrôlés ; aucun doublon exact de source ou asset introduit.
- Revue manuelle Chrome DevTools en bureau et mobile (390 × 844) sur Parcours, Dashboard, leçon/popovers, dictionnaire, recherche/palette et scrollytellings Debord/Hirschman : aucun débordement, média cassé, 404 ou erreur console après correction du champ du dictionnaire.

---

## 2026-07-14 — Contrat produit, routage Formation et navigation partagée

Objet : clarifier la base produit et le flux d'apprentissage sans supprimer d'étape, avant de reprendre l'approfondissement éditorial de la formation.

Travaux :

- Ajout de `PRODUCT.md` : intention, public interne de construction, personnalité, principes produit et niveau d'accessibilité visé.
- Renommage public de `/paths` en `/parcours` avec conservation de la fiche intermédiaire `/parcours/:slug` ; le splash `/` et `/home` restent inchangés.
- Séparation des rayons documentaires sous `/bibliotheque/:slug`, sans suppression de contenu ; sitemap et collecte des routes adaptés.
- Navigation TopBar, SideNav et Footer centralisée autour de trois piliers : Intelligence VC, Formation et Workspace.
- Flux Formation fiabilisé : retour au cours après la dernière leçon, états de recherche explicites, filtres Bibliothèque sérialisés dans l'URL et disclosures accessibles au clavier.
- Documentation d'architecture, design system et stratégie alignée sur le nouveau contrat de routes.

Vérifications :

- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript, lint 0 warning, 13 fichiers / 74 tests Vitest et 2 tests Node.
- `npm run build` : build client réussi ; un premier prérendu a été bloqué par l'interdiction sandbox d'écouter sur `127.0.0.1:4317`, puis la relance autorisée a terminé avec 572/572 routes prérendues.
- Chrome DevTools : flux `/` → `/home` → `/parcours` → `/parcours/:slug` → `/courses/:slug` → `/lessons/:slug` vérifié sur desktop et mobile ; Bibliothèque, historique des filtres, recherche et 404 `/paths` contrôlés ; console sans erreur ni warning.
- Lighthouse navigation sur `/parcours` : Accessibilité 100, Bonnes pratiques 100, SEO 100.
- `git diff --check` : exit 0.

Aucun déploiement, push ou lancement du workflow Pages.

---

## 2026-07-14 — Fiabilisation local-first, formation et Intelligence VC

Objet : consolider la base locale avant toute remise en ligne, fermer les incohérences de formation prioritaires et ajouter les garde-fous éditoriaux minimums.

Travaux :

- Persistance typée (`StorageResult` / `StorageFailure`), registre observable, alerte globale accessible et mutations React appliquées uniquement après écriture réussie.
- Consommateurs notes, journal, citations, favoris, orientation, cahier et progression adaptés aux échecs ; promesses de compte/synchronisation remplacées par un message explicite « uniquement sur cet appareil ».
- Aiguillage `investor-relations`, archétype `architecte`, compteurs d'orientation dérivés des 9 questions, cours fondateur à 7 leçons et suivi de navigation corrigé.
- Validation étendue aux profils, archétypes, relations cours-leçons, ordres, `memos` et `antiPortfolio`.
- Statut brouillon/publié pour les analyses ; Flatland masqué de toutes les surfaces publiques. Dossier Rock Health corrigé et daté de sa vérification.
- Workflow Pages rendu exclusivement manuel ; Git/GitHub documentés comme sauvegarde du code pendant la phase local-first.

Vérifications :

- `npm ci` : exit 0.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript, lint 0 warning, 12 fichiers / 67 tests Vitest et 1 test Node.
- `npm run build` : exit 0 — sitemap 572 routes, build client 1 745 modules, prérendu 572/572.
- `git diff --check` : exit 0.
- Contrôle navigateur intégré indisponible dans l'environnement ; aucune validation visuelle manuelle n'est revendiquée.

Aucun push ni lancement du workflow Pages.

---

## 2026-07-07 — Recentrage V1 FR et remise à jour du suivi

Objet : aligner les documents de suivi sur la décision V1 française, routes non localisées et architecture statique sans backend.

Travaux :

- Retrait de la promesse bilingue dans les documents actifs : V1 FR-only, pas de routes `/fr` `/en`, pas de `hreflang` EN, pas de traduction au lancement.
- Mise à jour de `ETAT.md` : compteurs issus de `validate:content:strict`, lint réel, tests réels, sitemap 573 routes non localisées, build non relancé pour ne pas recréer `client/dist` après nettoyage.
- Mise à jour de `PROCEDURE_PUSH.md` : publication statique FR-only, tests décrits autour des routes client actuelles, rappel que `client/dist` est un artefact généré.
- Barrage / annotation des éléments résolus dans les deux audits du 2026-07-06 (`AUDIT-2026-07-06 codex.md` et `AUDIT-2026-07-06.md`).

Vérifications :

- `npm run generate:sitemap` : exit 0, 573 routes, aucune URL localisée.
- `npm run validate:content` : exit 0.
- `npm run validate:content:strict` : exit 0.
- `npx tsc -b --pretty false` depuis `client/` : exit 0.
- `npm run test --workspace client` : exit 0, 9 fichiers / 52 tests.
- `npm run lint` : exit 0, 0 erreur, 27 warnings.

Reste ouvert : corriger le workflow GitHub Pages pour lancer les garde-fous avant publication, réduire les warnings lint, fermer le trou de validation `memos` / `antiPortfolio`, traiter ou masquer les jalons `a-produire`, sourcer les dossiers faibles.

---

## 2026-07-06 — Réorganisation de la documentation de suivi

Objet : séparer référence, état, journal et archive ; supprimer les contradictions héritées de la migration et les compteurs dupliqués.

Travaux :

- Création de `Suivis/ETAT.md` (instantané des compteurs, vérifications, risques et priorités post-migration) et de ce `JOURNAL.md`.
- Déplacement des documents de référence vers `docs/` : `Manuel_Architecture_Edition.md` → `docs/ARCHITECTURE_EDITION.md` (purgé de toute référence backend : CMS/admin, Prisma, `db:setup`, `ci.yml` ; §5 dédupliqué vers le Design System ; paragraphes corrompus du §4.1 réparés) ; `Design_System.md` → `docs/DESIGN_SYSTEM.md` (retrait des gaps « admin »).
- Correction de `Suivis/Procedure_Push_Manuel.md` → `Suivis/PROCEDURE_PUSH.md` : la mention d'une « vérification automatique en ligne » est corrigée (le seul workflow est `deploy-pages.yml`, un déploiement Pages sans validation/lint/tests).
- Corrections factuelles de `CLAUDE.md` et `README.md` : pointeur mort `Suivis/README.md`, ligne « API-first (Removed) », description d'une CI `ci.yml` inexistante, commande `content:export` (script mort référençant Prisma), mention d'un build serveur inexistant.
- Les fichiers pré-migration `Bilan.md` et `Report et scoring.md` sont supprimés (état historique complet dans l'historique Git).

Vérifications : réorganisation documentaire uniquement, aucun fichier de code ni de contenu (`data/`, `client/`) modifié. Les références croisées entre documents ont été revérifiées après déplacement.

---

## 2026-09-05 — Fiabilité du simulateur de note d’investissement

Objet : correction ciblée de `/simulators/simulateur-note-investissement`, sans nouveau moteur financier, backend, refonte générale ni publication. Branche `master`, worktree sale préservé. Les trois HTML d’entrée étaient identiques (994 449 octets, SHA-256 `4acea45edf9c8b8443e95a8be5ffe0e174fed7d9320be508ca8ddb37f7ccab7b`).

Travaux :
- extraction de la source unique sous `nouveau simu/src/` : `model.mjs` pour le modèle pur, `component.js` pour la logique de l’atelier, `template.html` pour le rendu et `bundle-shell.html` pour les ressources/runtime hérités ; assemblage Node standard dans `scripts/build-investment-memo.mjs`, sans dépendance nouvelle ;
- `npm run build:memo` génère les trois HTML existants, dont `client/public/tools/simulateur-memo.html` ; `check:memo` et les tests vérifient leur parité sans écriture. Génération raccordée aux hooks racine predev/prebuild. Contrat et sources à modifier documentés dans `nouveau simu/embed/README.md` ;
- nombres français analysés intégralement, contraintes par champ, levée obligatoire dans la post-money, ticket inclus dans le tour, dilution bornée, sortie nulle autorisée, dépendances indépendantes et erreurs locales accessibles ;
- screening : six critères liés aux champs accessibles, sans contribution des hypothèses et overrides du mémo complet ; état complet conservé lors des changements de mode. Complétude limitée à la présence des champs et à la validité numérique ;
- overrides invalides, incohérents ou sans hypothèses bloqués sans fallback silencieux ; activation sans arrondi caché, saisie vide encore éditable et restauration explicite. Pour changer le scénario, modifier les hypothèses. Synthèse et aperçu partagent les résultats et affichent aussi les 100 M€ du fonds ; méthode courte sur tour primaire, fonds propres, dilution cumulée et résultats bruts ;
- tests dans `scripts/investment-memo.test.mjs` et ajout ciblé dans `simulators.dom.test.tsx`. Budget statique `scripts/media-budget.test.mjs` réconcilié avec l’artefact HTML déjà présent : 48 fichiers, dont le mémo généré ; budget hors mémo inchangé à 14 083 661 octets. Wrapper React, registre et collections éditoriales non modifiés.

Preuves RED → GREEN : `node --test scripts/investment-memo.test.mjs` a reproduit `20abc → 20`, une post-money de 20 malgré une levée vide, des bornes non contrôlées, le fallback silencieux d’override invalide, l’arrondi d’activation `4.938268 → 4.9`, seulement 2 critères screening cochables sur 6, les nombres invalides comptés dans la complétude et l’absence des produits de sortie/fonds dans la synthèse. Les tests DOM ont reproduit l’absence de champs reliés à leurs explications. Les sorties RED intégrales sont conservées localement sous `/tmp/vc-memo-reliability/red-*.log` ; le harness a été corrigé séparément lorsqu’un échec venait de l’URL jsdom ou des matchers d’un document sans fenêtre.

Validations finales :
- `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs` : exit 0, 12 tests ;
- `npm run test --workspace client -- src/components/simulators/simulators.dom.test.tsx` : exit 0, 4 tests ;
- `npm run typecheck`, `npm run lint`, `npx eslint --config client/eslint.node.config.js 'nouveau simu/src/model.mjs' --max-warnings=0`, `node --check 'nouveau simu/src/component.js'` : exit 0 ;
- build canonique avec `PUPPETEER_EXECUTABLE_PATH=/tmp/vc-memo-chromium/chromium/mac_arm-1692818/chrome-mac/Chromium.app/Contents/MacOS/Chromium`, `VITE_BASE_URL=/vc-plateform/`, `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform` : exit 0, prérendu strict 716/716, `ok: true` ;
- `npm run check:memo` et `npm run check:generated` après build : exit 0 ; empreintes des quatre fichiers `data/generated/`, sitemap et robots inchangées ;
- recette Chromium réelle via `/tmp/vc-memo-reliability/browser-qa.mjs`, build servi à `http://127.0.0.1:4178/vc-plateform/simulators/simulateur-note-investissement` et fichier autonome : parsing, erreurs, dépendances, dilution hors bornes, sortie nulle, overrides, changement de mode, conservation et aperçu vérifiés. Référence rendue : **8 % ; 5,6 % ; 28 M€ ; 14× ; 0,28×**. Aucune erreur JavaScript observée. Pleine page : largeur et scrollWidth de 1440 px. Rapport et captures dans `/tmp/vc-memo-reliability/` ;
- `npm run test` avec Chromium explicite : 69 fichiers / 473 tests client verts, 69 tests Node réussis et 1 annulé après timeout de 60 s. La reprise isolée `node --test scripts/prerender.integration.test.mjs` reproduit le timeout du test de connexion navigateur partagée. Ce gate reste non vert ; il ne remet pas en cause le build strict et la recette ciblée réussis, mais sa cause n’est pas établie dans ce lot.

Écart de procédure : le premier `npm run test` a lancé le test transversal avec le défaut Puppeteer, identifié ensuite comme Google Chrome for Testing. Cet écart à la consigne Chromium a été déclaré ; ce passage n’est pas retenu comme preuve navigateur. Les builds et recettes ciblées utilisent explicitement Chromium. Le premier téléchargement de Chromium avec un buildId littéral `latest` a échoué en 404 ; la résolution de révision via `resolveBuildId` a permis son installation temporaire sans modifier le projet.

Limites : runtime embarqué conservé, pas d’audit général, pas de refonte mobile, ni qualification exhaustive de l’export PDF. Aucun fichier `data/generated/` édité directement ; aucun staging, commit, push, workflow distant ou déploiement.

---

## 2026-09-08 — Réconciliation du suivi après intégration finale du simulateur de note

Objet : remettre les documents de suivi en accord avec l’état courant du simulateur `/simulators/simulateur-note-investissement`. Cette passe est documentaire : elle ne modifie ni le code, ni les données, ni les artefacts générés.

État consigné :

- `data/simulators.json` déclare le simulateur sous l’identifiant `investment-memo`; `client/src/components/simulators/index.ts` l’enregistre et `InvestmentMemoSim` charge l’HTML public avec `publicAssetUrl(...)`, dans une iframe et par un lien pleine page. Le wrapper place l’atelier avant tout préambule, utilise une hauteur responsive et laisse l’en-tête hôte se contracter à largeur étroite.
- La source reste `nouveau simu/src/model.mjs`, `component.js`, `template.html` et `bundle-shell.html`. `npm run build:memo` produit `client/public/tools/simulateur-memo.html` et les deux distributions sous `nouveau simu/`; `check:memo` les compare sans écriture.
- La reprise locale normalise les collections persistées et les étapes invalides. Une panne de `localStorage` laisse le brouillon ouvert, affiche une alerte et empêche un effacement de simuler une réussite. Les événements `storage` synchronisent les instances de même origine ; un brouillon non sauvegardé garde la priorité jusqu’à la prochaine écriture réussie.
- Les rails se replient en vue compacte et retirent leur contenu du parcours clavier. Les changements de section, de vue, la fermeture d’un rail et la suppression d’une ligne replacent le focus sur une cible visible. Les sélecteurs exposent leurs états, l’aperçu A4 est une région nommée utilisable au clavier et les tons secondaires clairs respectent le seuil AA couvert par les tests.
- `Suivis/PROCEDURE_PUSH.md` régénère désormais les trois HTML avant sauvegarde, impose la base et l’origine canoniques au build et contrôle les sorties dérivées après celui-ci.

Vérifications exécutées le 2026-09-08 :

- `npm run check:memo` : exit 0, 3 artefacts vérifiés.
- `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs` : exit 0, 31 tests.
- `npm run test --workspace client -- src/components/simulators/simulators.dom.test.tsx` : exit 0, 1 fichier / 5 tests.
- `npm run typecheck` et `npm run lint` : exit 0.
- `npx eslint --config client/eslint.node.config.js 'nouveau simu/src/model.mjs' --max-warnings=0` et `node --check 'nouveau simu/src/component.js'` : exit 0.
- `npm run validate:content:strict` : exit 0, 24 parcours, 1 certification, 5 niveaux, 30 cours, 147 leçons, 420 termes, 10 études de cas, 12 livrables, 8 articles, 31 dossiers d’écosystème, 10 simulateurs et 373 marqueurs analysés.
- `npm run check:generated` : exit 0, 147 leçons, 126 corps publiés et 420 termes de glossaire.

Le build canonique, la suite globale et la recette Chromium n’ont pas été relancés dans cette passe documentaire. Leur dernière preuve date du 2026-09-05 et précède les derniers ajustements du wrapper, de la persistance et du focus. Le timeout connu de `scripts/prerender.integration.test.mjs` reste ouvert. Aucun staging, commit, push, workflow distant ou déploiement.

---

## 2026-09-10 — Premier lot d’intégrité des données locales

Objet : exécution des priorités S6-01, S6-03, S6-06, S6-21, S6-04, S6-02, S6-05 et S6-11 de `Suivis/AUDIT-UI-UX-PARCOURS.md`. Lecture d’`AGENTS.md`, `CLAUDE.md`, `PRODUCT.md` et de l’audit ; statut Git et empreintes des fichiers concernés conservés sous `/tmp/vc-local-data-integrity/`. Le worktree sale antérieur est préservé. Aucun fichier de données générées, source du simulateur, contenu éditorial ni configuration de publication n’a été modifié.

Corrections :

- `localDataLifecycle.ts` prépare et valide l’opération, compare l’aperçu à l’état courant, enregistre et relit une copie de récupération avant mutation, libère la capacité des seules clés remplacées, puis vérifie les valeurs écrites. Toute panne après mutation déclenche une restauration indépendante de chaque domaine puis une comparaison des valeurs brutes. Les restaurations non vérifiables donnent les domaines affectés et la copie exacte.
- `localDataRecovery.ts` conserve une copie temporaire dans IndexedDB, hors du quota de `localStorage`. La réservation ne peut pas écraser une copie en attente. Le succès exige aussi le retrait vérifié de cette copie ; un échec à ce stade déclenche une restauration. Une copie persistante d’opération interrompue reste téléchargeable après rechargement.
- L’export v2 ajoute `vcmemo.onepager.v1` et les archives de migration, dont `onboardingMode`, `vcpx:highlights` et `vcpx:onboarding-seen`. Les archives sont reconnues par leurs domaines exacts. Les clés étrangères, même sous `vcpx:`, restent exclues. Les valeurs illisibles sont conservées brutes ; les lectures impossibles sont identifiées sans `null` de substitution. Le téléchargement est précédé d’un bilan par domaine.
- Les formats actifs `vcpx:` et celui de l’atelier restent inchangés. Le fichier d’export passe à v2 pour décrire le nouveau périmètre ; la limite de fichier passe à 64 Mo pour permettre les archives et l’échappement des valeurs brutes, sans augmenter les limites par domaine. Les sauvegardes v1 historiques restent importables et préservent explicitement la note et les archives absentes. `prepareStoredRaw` partage les migrations avec la lecture, sans écriture préparatoire. Le fichier original reste un `File` distinct, téléchargeable. Les versions inconnues bloquent tout remplacement ; les domaines valides peuvent être téléchargés séparément pour récupération.
- `ProfilePage` utilise `LocalDataPanel`, qui annonce le remplacement de l’appareil, les ajouts/remplacements/suppressions et propose une sauvegarde préalable. Le protocole publie son état vérifié vers `UserDataProvider`, `ThemeProvider` et `learningWorkspace` avant confirmation. Les erreurs préparatoires de purge et de lecture de fichier sont capturées. Les confirmations réutilisent `ConfirmDialog` avec focus sur Annuler pour ces commandes ; le sélecteur de fichier reçoit un focus visible.

Preuves RED → GREEN : `src/lib/localDataIntegrity.test.ts` reproduit d’abord 6 défauts sur le code courant : export d’une valeur illisible sous forme de `null`, ancien format migrable refusé, note/archives/héritages non purgés, exception préparatoire de purge, restauration incomplète non signalée, écriture ignorée annoncée réussie. `ProfilePage.localData.dom.test.tsx` reproduit ensuite l’absence de confirmation explicite, de bilan de remplacement et de copie brute. Sorties initiales complètes : `/tmp/vc-local-data-integrity/red-core.log` et `red-ui.log`. Les non-régressions conservent les cas, ajoutent les pannes de lecture/copie/nettoyage/actualisation, les migrations workspace, la conservation du fichier, les clés étrangères, les aperçus périmés et 100 notes avec quota calculé sur le volume des données et des clés.

Validations finales :

- `npm run test --workspace client` : exit 0, 71 fichiers / 509 tests.
- `npm run typecheck` et `npm run lint` : exit 0.
- `node --test scripts/investment-memo.test.mjs` : exit 0, 30 tests.
- `npm run check:generated` et `npm run check:memo` : exit 0, contrôles sans écriture.
- Vite lancé directement par `npm run dev --workspace client -- --host 127.0.0.1 --port 5178 --strictPort`, sans hook racine de génération.
- `PUPPETEER_EXECUTABLE_PATH='/Users/iar-witness/.cache/puppeteer/chrome/mac_arm-151.0.7922.71/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' node scripts/local-data-lifecycle.browser.mjs` : exit 0, Chrome/151.0.7922.71, contexte neuf fermé en fin de recette. Import/purge, thème, cache workspace, 100 notes, note d’investissement, archives et clés étrangères vérifiés après rechargement. Avec 100 notes de 18 000 caractères et 3 435 286 caractères de remplissage étranger au quota natif, des notes de 17 900 caractères sont importées ; des notes de 19 000 caractères provoquent une restauration exacte. La panne persistante laisse une copie exacte après rechargement. Téléchargements de l’original et de la récupération comparés octet pour octet. Réservation de deux copies concurrentes : une seule acceptée. Focus Annuler/Échap et largeur 390 px vérifiés ; aucune erreur JavaScript.
- Rapport et capture du dernier passage : `/var/folders/94/3wqg8w_11d312wnkj5cw9hb40000gn/T/vc-local-data-browser-oidNf4/`. Logs, premiers RED et sauvegardes des fichiers initiaux : `/tmp/vc-local-data-integrity/`.
- `git diff --check` : exit 0. Journal antérieur conservé intégralement ; inventaire des fichiers modifiés comparé au statut initial.

Classement des échecs : les RED initiaux sont les défauts en périmètre, désormais couverts. Des erreurs dans les nouvelles fixtures, un indicateur de migration perdu dans l’aperçu préparé, un typage de matcher et les déclarations de globales du script navigateur ont été corrigés pendant le lot. La première recette attendait un thème clair après purge sans fixer la préférence système ; sa fixture impose désormais une préférence claire. Un timeout du test existant `onboardingAndIkigai.dom.test.tsx` est apparu sur une passe complète, puis la reprise isolée (4 tests) et la passe complète suivante sont vertes ; sa cause reste indéterminée. Le timeout antérieur du test Node de prérendu partagé, documenté avant ce lot, reste ouvert et n’a pas été relancé.

Limites : qualification publique Safari/Firefox, lecteurs d’écran et appareils physiques non effectuée. Les conflits entre brouillons de plusieurs onglets restent hors lot ; les contrôles ne rendent pas `localStorage` atomique entre onglets. Une interruption brutale peut nécessiter une récupération manuelle depuis la copie persistée, sans restauration automatique au démarrage. Aucun build complet, staging, commit, push, workflow distant ni déploiement. L’inventaire, les choix de format et la recette reproductible sont maintenus dans `Suivis/RECETTE-DONNEES-LOCALES.md` ; `Suivis/ETAT.md` et l’audit sont actualisés.

---

## 2026-09-22 — Réconciliation du README, de l’architecture et du design system

Lot documentaire, fondé sur les manifests, schémas, générateurs et consommateurs du worktree courant. Deux lectures indépendantes ont complété la vérification des collections éditoriales et du design system ; leurs écarts ont été recoupés avant correction.

- `README.md` : 167 → 54 lignes ; marque actuelle, démarrage, contrôles utiles, index documentaire et limites locales. Les procédures détaillées renvoient à leur propriétaire.
- `docs/ARCHITECTURE_EDITION.md` : accès par section ; distinction source/projection, statuts publics, ordre des leçons et certifications, aliases, portée réelle des placeholders et validateurs, sources du simulateur de note, persistance, build et hébergement. Les exemples JSON partiels ou non résolus sont remplacés par des procédures liées aux schémas.
- `docs/DESIGN_SYSTEM.md` : principes conservés, paramètres renvoyés au code ; marque, chrome d’accueil, emplacement et chargement de l’atlas, motion et objectif d’accessibilité corrigés. Les valeurs recopiées et le backlog non normatif ne définissent plus le contrat.

Contrôles exécutés : script local `check_docs.py` (liens, ancres, chemins et scripts npm) sans erreur après correction de deux renvois ; `npm run check:generated`, `npm run check:memo`, `npm run validate:content:strict`, `npm run validate:glossary` et `git diff --check` ciblé : exit 0. Les empreintes des fichiers suivis et non suivis ont été comparées au manifeste initial ; seul le périmètre documentaire et de suivi a changé. Le journal antérieur est conservé.

Limites conservées : `validate:glossary` ne résout pas les leçons drop-in, contrairement au validateur général ; aucune correction de code dans ce lot. Les anciens candidats de design (primitives de formulaire, filtres partagés, sommaire de leçon, présentation du journal de bord, accents de parcours) restent des suggestions non arbitrées, pas un nouveau plan. Le prolongement du ciel d’accueil jusqu’à l’atlas est retiré, l’atlas vivant sur `/parcours`.

Aucun build, test applicatif, recette navigateur, staging, commit, push, workflow distant ou déploiement. La validation documentaire ne renouvelle ni la recette applicative du 2026-09-10 ni le build du 2026-09-05.

---

## 2026-09-23 — Actualisation documentaire préparatoire à Formation F0/S0

Périmètre : vérifier les instructions agents et les autorités ciblées par le plan `.hermes/plans/2026-07-31_191055-consolidation-formation.md`, sans exécuter son lot F0. Le statut et les empreintes des fichiers suivis/non suivis ont été relevés avant toute écriture. Le diff de session est distinct des modifications antérieures du worktree.

- `docs/ARCHITECTURE_EDITION.md` : distinction publication/disponibilité/résolution/complétion, absence actuelle de métadonnées communes, diagnostic sans migration, jalon résolu en livrable ou leçon, diagnostic d’entrée séparé et contributions des durées renvoyées à leur propriétaire.
- `docs/parcours/README.md` : grille pédagogique sans ajout de champs, contrôle des prérequis, conteneurs vides/partiels, charge et génération conditionnelle aux sources effectivement modifiées.
- Plan Formation : baseline de juillet conservée comme historique ; objectifs et prompt de reprise ne figent plus ses quantités. S0 reste un diagnostic pur, distinct des décisions S1/S2 et du gate global.
- `Suivis/ETAT.md` : F0 explicitement non implémenté et relevé actuel — 147 leçons dont 126 publiées, 5 placeholders (2 pratiques, 3 facultatifs), 4 parcours à durée dérivée, 20 à durée déclarée, aucun cours sans leçon publiée. Les dépendances et sorties résolues de juillet ne sont pas requalifiées.

**Portion bloquée :** la confirmation d’écriture d’`AGENTS.md` et `CLAUDE.md` a expiré. Le patch protégé n’a rien écrit ; aucun nouvel essai ni contournement. Les corrections à appliquer sont conservées dans l’état courant : génération du simulateur de note, contrôle `check:memo` séparé, périmètre réel du stockage, normalisation de l’origine/base et accès ciblé aux autorités Formation. Ces deux fichiers et `PRODUCT.md` restent inchangés ; la demande complète de réconciliation des instructions n’est pas close.

Contrôles exécutés :

- `npm run check:generated` : exit 0, 147 leçons / 126 corps publiés / 420 termes ; `npm run check:memo` : exit 0, 3 HTML vérifiés.
- `npm run validate:content:strict` et `npm run validate:glossary` : exit 0, sans génération. Convictions recalculées séparément : 24.
- `python /Users/iar-witness/.hermes/cache/scratch/formation-doc-refresh-2026-09-23/check_docs.py` : exit 0, liens locaux/ancres, chemins complets, champs JSON cités et commandes npm contrôlés ; fichiers et commande F0 absents explicitement attendus. Le premier passage signalait à tort `data/profileParcours.json.timeCalibration` comme chemin de fichier : le contrôleur a été corrigé pour vérifier ce champ JSON, sans changer le produit.
- `git diff --check` ciblé sur les documents examinés : exit 0. Empreintes comparées au manifeste initial ; seuls architecture, contrat Parcours, plan Formation et les deux suivis changent. Préfixe du journal antérieur conservé octet pour octet.
- Contre-revue indépendante en lecture seule : aucun écart concret sur les six critères examinés ; constats recoupés avec les contrôles du parent. Elle ne qualifie ni les prérequis, ni les sorties résolues, ni une livraison applicative.

Aucun code, donnée source, généré ou manifeste modifié. Aucun build, test applicatif, navigateur, staging, commit, push, workflow distant ou déploiement. La prochaine action documentaire exige une confirmation d’écriture des deux fichiers protégés ; F0/S0 reste ensuite à implémenter sur demande.

---

## 2026-09-23 — Clôture des instructions agents et contre-revue cumulée F0/S0

Après renouvellement de l’autorisation, `AGENTS.md` et `CLAUDE.md` sont corrigés : protection des HTML assemblés du simulateur, hooks `build:memo`/`split:content`, contrôle `check:memo` distinct de `check`, périmètre réel de la persistance locale et récupération IndexedDB, contrat origine/base et accès ciblé aux autorités Formation. La distinction entre publication, disponibilité, résolution et complétion ne prête pas aux parcours de métadonnées encore absentes.

La contre-revue indépendante a examiné les modifications cumulées des deux passes, notamment les 30 blocs de remplacement du candidat, à partir des copies avant session plutôt que du diff global. Aucun écart matériel dans les instructions corrigées, aucune information nécessaire supprimée ni autorité indispensable omise n’ont été identifiés. Une incohérence mineure a été confirmée : la ligne S0 ne citait que scripts/tests, malgré `package.json` et les suivis exigés par F0. Le tableau et la liste des fichiers sont alignés, sans autoriser de migration des données. Le prompt demande aussi de lire le lot correspondant (S0 → F0), ses vérifications et ses critères de sortie. Cette correction tardive a été vérifiée directement après réception de la revue.

Contrôles exécutés :

- `npm run check:generated`, `npm run check:memo`, `npm run validate:content:strict` et `npm run validate:glossary` : exit 0, sans génération ; inventaire inchangé.
- `node --test shared/base-url.test.mjs` : exit 0, 6 tests, aucun échec.
- Contrôles ponctuels hors dépôt `check_docs.py` et `check_preservation.py` : exit 0 ; liens, ancres, chemins, commandes, cohérence du périmètre S0 et préservation des invariants vérifiés. `git diff --check` ciblé : exit 0. Le contrôle sur copies inclut aussi les documents non suivis ; le code 1 normal de `git diff --no-index` pour un contenu différent est distingué d’une erreur de whitespace.
- Comparaison des empreintes des fichiers suivis/non suivis : seuls les sept documents autorisés ont changé sur les deux passes. `PRODUCT.md` reste identique ; aucune source applicative, donnée ni projection modifiée. Préfixes du journal antérieur aux deux passes, baseline chiffrée du plan, définition de consolidation, fixtures F0, charte éditoriale et règles d’exécution conservés.

`Suivis/ETAT.md` ne conserve plus le blocage d’écriture comme sujet ouvert. La réconciliation documentaire est close ; F0/S0 reste non implémenté. Les prérequis, sorties résolues et charges pédagogiques n’ont pas été recalculés exhaustivement. Aucun gate global, build, navigateur, staging, commit, push, workflow distant ou déploiement. Les preuves applicatives historiques ne sont pas redatées par cette passe.

---

## 2026-09-23 — Diagnostic Formation F0/S0, sans migration

Périmètre : lot F0 et session S0 du plan de consolidation, après lecture d’`AGENTS.md`, `CLAUDE.md`, de l’état Formation, du §0, des huit fixtures, vérifications et critères de sortie. Baseline relevée sur `master` : 128 entrées suivies déjà modifiées ou supprimées et 25 entrées non suivies. Copies des fichiers possédés et empreintes du worktree conservées avant écriture ; aucun diff antérieur attribué à cette session.

Livraison :

- Création de `scripts/formation-readiness.mjs` : diagnostic pur sur sources canoniques et leçons drop-in, résumé humain et option `--json`, sans génération. Les constats n’altèrent pas le code de sortie : exit 0 signifie seulement « diagnostic exécuté » ; entrées inexploitables et arguments invalides échouent explicitement.
- Création de `scripts/formation-readiness.test.mjs` : 18 tests, couvrant les huit familles F0, tous les types de références actuels, la priorité livrable/leçon des milestones, les slugs de glossaire admis par le résolveur, l’ordre des cours, les prérequis requis/facultatifs, les contributions temporelles, les entrées ambiguës et l’absence d’écriture. Les scénarios de futurs contrats utilisent un adaptateur de fixtures, pas de nouveaux champs canoniques.
- `package.json` : ajout de `validate:formation` uniquement. La chaîne `check` est inchangée ; les tests de fixtures rejoignent naturellement le glob Node existant, sans transformer les constats du corpus en gate bloquant.
- Aucun changement de `validation-core.mjs`, des propriétaires TypeScript, des sources éditoriales ou des projections générées. Publication, disponibilité, complétion et décisions pédagogiques ne sont pas migrées.

Résultats recalculés : 24 parcours, 30 cours, 147 leçons dont 126 publiées ; aucune référence d’étape absente ni leçon non publiée ciblée ; 2 placeholders requis et 3 facultatifs ; 7 parcours avec sortie résolue et 17 sans. Une sortie est ici une étape requise existante résolue en milestone-livrable, milestone-leçon ou deliverable capstone, hors diagnostic d’entrée ; elle ne prouve pas à elle seule la complétion. Les 28 couples distincts leçon/prérequis non satisfaits concernent 15 parcours : 27 dans la séquence complète, 21 dans la séquence requise, avec recouvrement. La première consommation est calculée sur les étapes ordonnées puis les leçons publiées d’un cours par `courseId` et `order` ; une étape facultative ne vaut pas prérequis implicite d’entrée.

Quatre parcours ont une durée dérivée, vingt une durée déclarée non auditée. Deux couvertures dérivées sont incomplètes : `estimatedWorkMinutes` manque sur `cs-europe-vs-valley` et `cs-vp-insertion-3-regions` ; `vp-fiche-escalade-juridique` est résolu mais ignoré par les branches actuelles de `learningTime.ts`. Aucun total ni contenu corrigé. Aucun cours vide ; trois sont partiellement publiés. Le rapport sépare les constats d’intégrité, les métadonnées non modélisées et les arbitrages ; aucun compteur historique n’est réutilisé comme attente du corpus dans les tests.

Vérification après la correction finale :

- `node --test scripts/formation-readiness.test.mjs` : exit 0, 18/18 ; `node --test scripts/validation-core.test.mjs` : exit 0, 15/15.
- `npm run validate:formation` et `node scripts/formation-readiness.mjs --json` : exit 0. Recalcul indépendant des références, séquences, sorties et prérequis : accord exhaustif ; sortie identique lors d’une seconde exécution depuis un autre répertoire.
- `npm run validate:content:strict`, `npm run lint:node`, `npm run check:generated` et `npm run check:memo` : exit 0, sans génération.
- Tests client ciblés `parcours.test.ts`, `serieAParcours.test.ts` et `lessons.test.ts` : 3 fichiers / 27 tests réussis.
- Empreintes avant/après les commandes : aucun fichier du worktree modifié par le diagnostic ou les contrôles. Comparaison du manifeste npm à sa copie initiale : ajout exclusif de `validate:formation`, sans changement de `check`.

Contre-revue indépendante sur snapshot gelé : aucun défaut logique ou de sécurité bloquant. Ses deux remarques mineures sont traitées : `refKind: 'lesson'` explicite pour les incohérences cours/leçons, et commentaire distinguant l’inventaire en ordre source de la séquence consommée triée. Le rendu `undefined:missing` a d’abord été reproduit par un RED CLI, puis corrigé ; les contrôles ont été rejoués. Les premiers RED complets et les rapports restent hors dépôt dans `/Users/iar-witness/.hermes/cache/scratch/formation-s0-2026-09-23/`.

F0/S0 livre un diagnostic, pas une Formation consolidée. Les contrats transverses relèvent ensuite de S1, en lecture seule et sur demande ; les corrections de données, la production des placeholders et les revues praticiennes restent séparées. Aucun gate global, build, navigateur, staging, commit, push, workflow distant ou déploiement. Les preuves applicatives historiques ne sont pas redatées.

---

## 2026-09-24 — Présentation Parcours du simulateur de note d’investissement

Objet : intégrer la variante validée `02-parcours.html` et son `brand-spec.md`, conservés hors dépôt, sur `/simulators/simulateur-note-investissement`, sans reprendre le comparateur, les données ou le stockage du prototype. Worktree propre au contrôle initial sur `master` ; un seul rédacteur du code.

Livraison :

- `client/src/pages/simulators/SimulatorPage.tsx` et `client/src/components/simulators/investment-memo.tsx` réunissent le moteur et les actions réelles de la plateforme dans son bandeau. Le favori et le retour restent fonctionnels, les ressources existantes sont accessibles dans la modale commune, et la pleine page reste une option. `client/src/layouts/MainLayout.tsx` conserve la navigation Maison Sapience VC et retire le pied de page général uniquement de cet espace de travail.
- Les sources `nouveau simu/src/template.html`, `component.js` et la nouvelle feuille `parcours.css` installent le sommaire horizontal, la rédaction large, la relecture initialement fermée, le sélecteur mobile et l’aperçu A4 adapté à la largeur. Les thèmes utilisent les tokens existants ; le papier imprimable garde sa palette claire. Le focus est restitué et révélé dans la page hôte après redimensionnement. Le retour d’impression au grand écran rétablit le sommaire.
- `scripts/build-investment-memo.mjs` embarque les tokens et les fontes d’interface locales, puis régénère les trois artefacts habituels. Aucun HTML assemblé édité à la main. `model.mjs`, les dix blocs, les champs/listes, les calculs et validations, les modes/langues et la clé `vcmemo.onepager.v1` sont conservés.
- Régressions dans `simulators.dom.test.tsx` et `scripts/investment-memo.test.mjs` : montage des actions, disparition du double en-tête, restauration des brouillons, relecture/clavier, focus visible, retour du grand écran et mesure intrinsèque du dépassement A4. Le classement du budget média inclut désormais le bundle enrichi avec ses fontes ; les attentes sur le reste de l’inventaire ne changent pas.

Vérifications :

- `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs` : exit 0, 34 tests simulateur et 1 test média. RED observés avant correction pour le focus sous la fenêtre et le retour au grand écran.
- Suite client complète exécutée par `npm run check` : 71 fichiers / 510 tests réussis. `npm run check:memo`, `npm run typecheck` et `npm run lint` : exit 0 après les dernières modifications ; les trois artefacts sont identiques et reproductibles.
- `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform PUPPETEER_EXECUTABLE_PATH=<Chromium local> npm run build` : exit 0, prérendu strict 716/716, `ok: true`. La fraîcheur des contenus et la validation stricte passent sans changement éditorial.
- `PUPPETEER_EXECUTABLE_PATH=<Chromium local> npm run check` : sortie 1 à cause du test transversal `strict CLI and React use one real Chromium for routes, 404 and noindex metadata`, annulé après 60 s ; 110 tests Node réussis, aucun autre échec. Le timeout déjà documenté est reproduit avec `node --test scripts/prerender.integration.test.mjs` sous le même Chromium ; il n’est pas corrigé hors périmètre.
- Recette Playwright sur Chromium 156.0.8073.0 et le build à `http://127.0.0.1:4173/vc-plateform/simulators/simulateur-note-investissement` : 1440, 820, 390 et 320 px, palettes claire/sombre, dix blocs, saisie et listes, calculs, erreur numérique, modes complet/screening, FR/EN, progression, sauvegarde/rechargement. Navigation depuis un bloc long, Tab/Échap et focus non masqué vérifiés ; favori, ressources, retour aux simulateurs, route avec slash final et pleine page synchronisée exercés.
- Export embarqué : appel de l’impression native et événement `beforeprint` observés. PDF réellement produits par Chromium depuis le moteur autonome : A4 complet et screening d’une page chacun ; cas de dépassement de trois pages, avertissement affiché et fin du texte retrouvée après extraction. Aucune commande d’interface dans le texte des PDF. Le parcours du dialogue d’impression système reste hors automatisation.
- Captures, PDF et rapports de recette restent hors dépôt, dans le scratch Hermes. Avertissement console préexistant `t.activityCount` conservé ; aucune nouvelle erreur JavaScript observée. Données de recette retirées du seul profil isolé et serveurs temporaires arrêtés.

`Suivis/ETAT.md` actualisé après vérification. Aucun staging, commit, push, workflow distant ni déploiement ; aucune modification des autres simulateurs, des données éditoriales ou des contrats Formation.

---

## 2026-09-24 — Corrections après contre-revue du simulateur Parcours

Après autorisation explicite, les propositions sont confrontées à `PRODUCT.md`, aux sources et à la maquette. La relecture indépendante des formulations conserve « création de valeur » et la distinction entre thèse et prix ; l’avertissement de risques décrit les lignes ajoutées, sans prétendre compter les risques renseignés. Le worktree d’intégration déjà modifié est préservé.

Corrections :

- `nouveau simu/src/component.js` distingue l’état initial, le brouillon effectivement enregistré et les échecs de lecture, d’écriture ou de suppression. La mention de confidentialité reste indépendante du résultat. Les consignes accusatoires ou absolues sont remplacées par des indications précises ; le calcul, les champs et la clé/structure `vcmemo.onepager.v1` ne changent pas.
- `template.html` sépare la commande Relecture du taux de complétude, nomme explicitement le Sommaire et annonce l’ouverture/fermeture des deux panneaux ; le compteur suit les dix ou cinq blocs du mode actif.
- `parcours.css` et `client/src/components/simulators/investment-memo.tsx` rendent l’en-tête et les blocs persistants au-dessus de 60 rem dans le défilement réel de l’hôte, avec hauteur d’en-tête mesurée et compensation du focus. Le mobile conserve le flux normal. Les tests couvrent aussi le nettoyage des abonnements au démontage. Les trois HTML sont régénérés uniquement par `build:memo`.

Vérifications de cette correction :

- RED puis GREEN observés pour la confirmation d’enregistrement, les noms/états des commandes, la synchronisation de défilement, la hauteur réelle de l’en-tête et le focus sous les barres persistantes.
- `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs` : 38/38. Les deux suites DOM ciblées avec `--no-cache --configLoader=runner` : 14/14. `npm run typecheck`, `npm run lint`, `npm run check:memo` et `git diff --check` : exit 0.
- Build canonique avec `VITE_BASE_URL=/vc-plateform/`, `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform` et `PUPPETEER_EXECUTABLE_PATH` vers Chromium : exit 0, prérendu strict 716/716, sans échec de route ou de métadonnées.
- `npm run check` exécuté après le build : contrôles de contenu, typage, lint et 71 fichiers / 512 tests client verts ; 113 tests Node réussis sur 114. Le test `strict CLI and React use one real Chromium for routes, 404 and noindex metadata` est de nouveau annulé après 60 s, comme avant cette correction. La parité du simulateur est contrôlée séparément après ce gate rouge.
- Recette sur le build servi sous `/vc-plateform/` à `127.0.0.1:4189` : largeur de document sans débordement en 1440, 1120, 820, 390 et 320 px ; champs longs, navigation depuis le bas, focus non masqué, fermeture de relecture par Échap, thèmes clair/sombre. Succès, échec d’écriture injecté et récupération/rechargement vérifiés avec conservation de la saisie ; favoris, ressources et synchronisation pleine page exercés. Screening : cinq blocs, retour au complet : dix.
- Export : appel de `window.print` vérifié, puis PDF réellement produit en média print par Chromium ; une page au format A4, titre et saisie présents, commandes d’édition absentes à l’extraction. Le dialogue d’impression du système n’est pas automatisé. Aucune erreur ni aucun avertissement de console sur la page de recette finale.

Contre-vérification indépendante : aucun blocage de sécurité ou de logique identifié ; empreintes des six fichiers examinés inchangées au retour du verdict. Après cet avis, recette complétée en 960, 961, 1023, 1024, 1048 et 1049 px, avec en-tête sur plusieurs lignes, sommaire fermé puis rouvert et focus visible ; navigation clavier en pleine page également vérifiée depuis un bloc long, avec contrôle de la cible réellement présente sous le pointeur. Le test DOM d’attente de redimensionnement sur plusieurs trames reste une suggestion de couverture non bloquante, sans modification supplémentaire des sources.

Captures, PDF et logs restent hors dépôt dans le scratch Hermes. Les clés de recette sont retirées du profil isolé et leur absence relue. Aucun staging, commit, push, workflow distant ni déploiement ; aucune correction du test transversal hors périmètre.

---

## 2026-09-24 — Simulateur de note : S1, protection et secours (F01/F02)

Exécution du seul lot S1 demandé dans `.hermes/plans/2026-09-24_150137-simulateur-note-reevaluation-et-sessions.md`, en préservant le worktree déjà modifié. Les lots S2/S3/S4 ne sont pas engagés.

- `nouveau simu/src/component.js` : confirmation avant suppression d’une ligne renseignée dans Faits, Convictions, Questions ou Risques, y compris source/date/mitigation seule et choix non par défaut ; aucune mutation ni sauvegarde à l’annulation, focus conservé. Les lignes vides restent supprimables immédiatement.
- Copie JSON depuis le snapshot courant en mémoire, sans lecture ni écriture du stockage : valeurs brutes, champs masqués et préférences conservés, même après panne d’enregistrement. Copie en cours et copie devenue périmée distinguées ; aucune confusion avec le statut d’enregistrement. La clé et la structure `vcmemo.onepager.v1` ne changent pas.
- `template.html` et `parcours.css` : statut, confidentialité et action de copie près des commandes, en saisie et aperçu ; si la copie échoue, texte en lecture seule étiqueté, sélectionné et focalisé, avec fermeture ramenant au bouton. Le secours est exclu de l’autohauteur des champs éditables et du chrome imprimé. Aucun import automatique ajouté.
- `scripts/investment-memo.test.mjs` : couverture des quatre listes, annulation sans perte, copie mémoire complète, panne/reprise, presse-papiers absent/refusé, focus et copie périmée. Les trois HTML sont régénérés uniquement par `npm run build:memo` ; aucun changement du générateur dans ce lot.

Vérifications :

- RED ciblés conservés dans le scratch, puis GREEN : `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs`, 43/43. `npm run check:memo` : trois artefacts conformes. `git diff --check` : exit 0.
- `npm run check` : contenu, typage, lint et 71 fichiers / 512 tests client verts ; 118 tests Node réussis, un annulé. Le test transversal `strict CLI and React use one real Chromium for routes, 404 and noindex metadata` dépasse à nouveau son délai de 60 s, défaut déjà documenté avant S1 et laissé hors périmètre. Aucun nouveau build complet pour ce lot.
- Recette Chromium en intégration et pleine page : confirmation/annulation, copie réelle du marqueur uniquement en mémoire, conservation des valeurs brutes et données Screening, repli sélectionnable et retour du focus, reprise effective du stockage puis rechargement, maintien de la saisie non enregistrée face aux événements d’une autre fenêtre. Repli contrôlé visuellement sur mobile, dont 320 px en thème sombre, sans débordement global observé.
- Contre-revue indépendante en lecture seule : aucun défaut concret identifié ; 43 tests réussis et comparaison ancien/nouveau composant confirmant la même clé et les mêmes octets JSON sauvegardés pour le scénario testé. La revue n’a pas fait de recette navigateur ; celle-ci a été réalisée séparément par l’intégrateur.

`Suivis/ETAT.md` et le statut du plan sont actualisés. Preuves et captures conservées hors dépôt dans `~/.hermes/cache/scratch/memo-s1/`. Brouillon de recette supprimé du profil Chromium isolé, absence relue et navigateur fermé. Pas de qualification supplémentaire Safari/Firefox, lecteur d’écran ou dialogue système d’impression. Aucun staging, commit, push, workflow distant ni déploiement.

---

## 2026-09-24 — Simulateur de note : S2, progression, messages et sortie (F07/F08/F09/F12)

Exécution du seul lot S2 de `.hermes/plans/2026-09-24_150137-simulateur-note-reevaluation-et-sessions.md`. Base des fichiers et statut Git relevés avant écriture ; worktree antérieur préservé. Un seul agent écrit, contre-revues indépendantes en lecture seule après gel, en parallèle des recettes Chromium. S3/S4 non engagés.

- `nouveau simu/src/component.js` : contrat `requirements()` partagé avec `req()`, états textuels des sections et repères des champs attendus selon Mémo complet/Screening. Absences neutres, invalidités conservées et dépendances manquantes regroupées avec accès au bloc ; zéro reste soumis aux bornes du modèle inchangé.
- `nouveau simu/src/template.html` : repères et états visibles, aide à la relecture distincte de « Relire la note ». L’action finale ouvre et focalise l’aperçu de tout brouillon, sans exiger sa complétude. « Imprimer / enregistrer en PDF » décrit l’impression, sans promettre de téléchargement automatique. Aides résiduelles ajustées au bloc et au format, sans refonte.
- `nouveau simu/src/parcours.css` : ajouts limités à l’aide d’impression et à la marge de défilement de l’aperçu sous l’en-tête desktop. La recette a révélé un focus masqué en pleine page ; compensation corrigée et visibilité contrôlée ensuite par géométrie, hit-test et capture.
- Première contre-revue : défaut F08 confirmé après restauration d’une surcharge composée d’espaces, active pour le modèle mais invisible dans les dépendances et la complétude. Correction par `overrideActive()`, commune aux exigences et à l’édition ; valeurs brutes conservées. Non-régression pour les quatre surcharges avec espace, tabulation, retour à la ligne, zéro numérique et booléen faux ; passage Screening/complet et recalcul couverts.
- Suppression protégée, copie mémoire/repli et statuts S1 préservés. Modèle financier identique à la base et à HEAD ; aucun changement de `vcmemo.onepager.v1`. Les trois HTML sont produits uniquement par `npm run build:memo` ; ni générateur ni intégration React modifiés par S2.

Vérifications :

- Critères : cohérence progression/repères, neutralité initiale et distinction absence/invalidité/zéro, dépendances navigables, relecture non bloquée avec focus visible, aides adaptées et conservation S1. Cycles RED ciblés puis génération et GREEN, y compris la régression issue de la contre-revue ; traces complètes conservées.
- État final : `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs` : 48/48. ESLint ciblé sur `scripts/investment-memo.test.mjs` avec configuration Node et zéro avertissement : exit 0. `npm run check:memo` après génération : trois artefacts conformes.
- `npm run check` exécuté une seule fois : contenu, typecheck, lint et 71 fichiers / 512 tests client verts ; 122 tests Node réussis, un annulé. Le test `strict CLI and React use one real Chromium for routes, 404 and noindex metadata` (`scripts/prerender.integration.test.mjs`) atteint le timeout préexistant de 60 s. Aucune correction transverse, aucun nouveau build complet. Le script enveloppe a ensuite buté sur la variable zsh réservée `status` ; le journal du gate est complet et `check:memo` a été lancé séparément. Après corrections finales, seuls tests ciblés, lint affecté, génération/parité et scénarios concernés sont repris, pas le gate global.
- Chromium : six cas en pleine page (vide/partiel/renseigné × deux formats) et six cas d’intégration (trois largeurs 1440/390/320 px × deux formats). Contrôle des comptes, navigation libre, dépendances, bornes du zéro, invalidité, aide/Échap, activation clavier de l’action finale, focus visible et retour à la saisie. L’appel d’impression est vérifié sans ouvrir le dialogue natif. Huit cas supplémentaires : chacune des quatre surcharges saisie avec un espace, enregistrée puis rechargée aux largeurs 1440 et 390 px ; champ éditable, complétude 3/4, dépendance visible, ignorance en Screening et recalcul effectif.
- Contre-revue finale favorable : aucun défaut logique ou de sécurité restant identifié ; huit empreintes du gel identiques avant/après, confirmées par l’intégrateur. Sources et artefacts inchangés depuis cette revue. `git diff --check` et chemins de clôture contrôlés ; plan et `ETAT.md` actualisés en une passe, journal antérieur conservé.

Preuves hors dépôt : `~/.hermes/cache/scratch/memo-s2-2026-09-24/` (base, RED/GREEN, journaux du gate, gel et diff S2, scripts/résultats/captures Chromium). Brouillon de recette retiré du profil isolé avec absence relue, navigateur fermé, serveurs arrêtés. Limites : S3/S4, timeout transversal, dialogue système d’impression, lecteurs d’écran et autres navigateurs non qualifiés par ce lot. Aucun staging, commit, push, workflow distant ni déploiement.

---

## 2026-09-24 — Simulateur de note : contre-revue de clôture S1/S2

**S1/S2 finalisés — S3 peut commencer sur demande.** Périmètre F01/F02/F07/F08/F09/F12 ; S3 non engagé, cette passe ne constitue pas S4. Base et copies des fichiers prises avant écriture ; branche `master`, worktree sale antérieur préservé. Les anciennes preuves S1/S2 sont distinguées des nouvelles exécutions.

- Deux défauts de focus reproduits puis corrigés : après Échap, la commande Aide restait sous les barres collantes en pleine page ; à la réouverture du sommaire, la dernière étape active restait tronquée horizontalement. `parcours.css` ajoute la réserve de défilement aux commandes Aide/Sommaire ; `component.js` révèle l’étape active par `scrollIntoView({block:'nearest',inline:'nearest'})` à l’ouverture du seul sommaire. RED navigateur et tests conservés, GREEN vérifiés après génération. Deux tests de régression ajoutés.
- Modèle financier, formules, `vcmemo.onepager.v1`, template, générateur et intégration React inchangés par cette passe. Les trois HTML sont régénérés uniquement par `build:memo`. Le diff propre à la session est séparé du diff antérieur.
- Recette Chromium 156.0.8073.0, profil isolé, un serveur local : 7 cas natifs de suppression/annulation couvrant les quatre listes et leurs champs secondaires/choix, 4 suppressions vides ; copie réelle depuis la mémoire non enregistrée, repli absent/refusé, pending/périmée, lecture/écriture/suppression indisponibles et reprise relue. Pour S2 : 12 notes vide/partielle/renseignée dans les deux formats et intégrations, 32 restaurations de surcharges (quatre champs × huit valeurs), dépendances regroupées navigables, 12 configurations de navigation pleine page/iframe à 1440/390/320 px. Quatre contrôles supplémentaires à 1120/961 px couvrent les chemins de focus corrigés. Cible active, géométrie, hit-test et captures concordent ; l’appel `window.print` est contrôlé sans qualifier le dialogue système.
- Trois retours indépendants reçus et réconciliés : revue initiale sans défaut logique supplémentaire, conditionnée au focus vertical ; revue suivante avec réserve horizontale confirmée par le parent ; contre-vérification du dernier delta favorable. Le dernier gel `final-freeze-2.json` comporte 23 empreintes, identiques avant/après la revue et à la clôture. Les trois HTML ont le même SHA-256 : `5f87d3721bdb8dcd178cab10187b795f87709ef3ed34cac4c9660fa035576460`.
- État final : `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs` exécuté une fois, **50 réussis, 0 échec, 0 annulé** ; ESLint ciblé avec zéro avertissement : exit 0 ; `npm run check:memo` : trois artefacts conformes. Pas de nouvelle suite globale, de tests DOM/typecheck ni de build complet : changements locaux sans modification React ; les preuves globales antérieures restent historiques, notamment le timeout transversal de prérendu de 60 s. Aucun correctif hors périmètre.

Plan et `ETAT.md` actualisés en une passe ; anciennes entrées du journal préservées. Preuves et matrice dans `~/.hermes/cache/scratch/memo-close-s1s2-2026-09-24/` (`cloture.md`, base, RED, gels, `session-source.diff`, résultats structurés et captures). Les chemins, le diff et la conservation des changements antérieurs sont contrôlés à la clôture. Données retirées du seul profil de recette avec absence relue, navigateur fermé ; serveur 4186 arrêté et port vérifié fermé.

Limites non bloquantes pour S3 : léger débordement hérité du corps d’aide à 390 px, qualification multi-navigateur/lecteur d’écran/clavier virtuel et dialogue système d’impression non réalisés. Aucun zoom, refonte mobile ou agrandissement général des libellés engagé. Aucun staging, commit, push, workflow distant ni déploiement.


---

## 2026-10-02 — Revue et correction du design system

Revue demandée de la véracité de `docs/DESIGN_SYSTEM.md` et amélioration des repères pour les interventions suivantes. État Git et empreintes relevés au départ ; changements antérieurs du simulateur, du layout et des suivis conservés. Trois lectures indépendantes sans écriture, intégration unique puis contre-revue.

- Les 14 sections ont été confrontées aux sources et consommateurs. Corrections : paramètres de layout effectivement utilisés, largeurs de lecture, comptage des étapes et limites des cartes/atlas, jalons, blocs de certification, annotations, aperçus du glossaire, usages des ornements, traits relationnels et coordination des animations. Les règles attendues et comportements implémentés sont explicitement distingués.
- Ajout du mode d’emploi, des modèles de pages, des repères d’espacement/mobile et des limites des primitives. `AGENTS.md` renvoie au mode d’emploi avant une intervention sur l’interface. Le relevé `Suivis/AUDIT/2026-10-02-design-system.md` conserve la couverture des sections et les écarts applicatifs existants.
- Le catalogue de développement remplace les légendes de couleurs et de tailles copiées par des lectures de styles calculés. Bascule de thème explicite, marque courante, carte avec lien réel, exemple `PageLoader`, prose technique rectifiée et exemples de démonstration annoncés. La recette a reproduit un débordement de la grille typographique à 390 px ; colonne bornée puis vérification aux trois largeurs. Le cartouche a été borné après inspection visuelle.
- Cycle ciblé : 3 tests DOM rouges avant correction puis 3/3 verts à la clôture. Typecheck global et ESLint ciblé page/test : exit 0. Recette Chromium : 36 contrôles de section, 3 largeurs × 2 thèmes, styles et légendes concordants, progression au clavier, focus du lien, fond sombre conditionnel, sans erreur JavaScript ni débordement global relevés. Liens/ancres documentaires et `git diff --check` contrôlés.
- Les premières tentatives de recette ont rencontré un lancement Chromium bloqué dans le bac à sable, puis deux erreurs du script de contrôle du focus (focus programmatique après clic et syntaxe de combinaison de touches). Relance avec navigateur isolé autorisée et script corrigé ; ces incidents ne sont pas comptés comme défauts applicatifs. Les premières traces, dont le véritable échec de débordement mobile, sont conservées dans `/tmp/vc-design-audit-20261002/`.

Pas de modification des calculs métier Formation ni de correction générale des dettes de composants signalées. Pas de build complet ni de gate global pour ce lot documentaire et catalogue de développement ; aucune attestation WCAG, lecteur d’écran ou multi-navigateur. Aucun staging, commit, push, workflow distant ou déploiement.


---

<a id="simulateurs-2026-11-18"></a>

## 2026-11-18 · Vérification et intégration du correctif des simulateurs

Le patch transmis porte sur 9 calculateurs et le simulateur de note. Son SHA-256 correspond à celui de la transmission (`35104c357404df79dbf55066733dd9e744c633ebf3151b73e70cabbc321e0d73`). Le contrôle d’application sur le worktree a réussi. Sur une copie de cet état, les tests du correctif ont reproduit 20 échecs côté client et 1 écrasement de brouillon. Le patch brut a ensuite obtenu 63/65 sur les simulateurs et 50/50 sur le mémo. Deux tests existants attendaient encore zéro pour une division par un capital versé nul.

- **Capital et levée.** À 1 M€ de pre-money et 19 M€ levés, les investisseurs détiennent 95 % et le nouvel ESOP peut recevoir jusqu’à 5 %. Avec 1 M€ de pre-money et 5 M€ levés, la limite proposée à 2 décimales est 16,66 %. L’ajout du tour suivant reprend la post-money de 6 M€ même pendant la correction du champ ESOP. Une mise nulle laisse le multiple de sortie indéfini. Une levée de 10 à 12,5 k€ reste lisible et une levée nulle laisse la valorisation indéterminée. [Convention de calcul du pool, Cooley GO](https://www.cooleygo.com/negotiating-option-pool/)
- **Fonds.** Pour 100 M€ versés, 60 M€ distribués et 180 M€ de valeur résiduelle, le simulateur donne 0,6× de DPI, 1,8× de RVPI et 2,4× de TVPI. Le MOIC brut demande les flux d’investissement du portefeuille. Les 2 liens de leçon reprennent les indicateurs effectivement calculés. Dans le cas de cession LP-led testé, l’acheteur verse 48 M€ au vendeur. Le DPI du fonds reste identique. Le seuil de comparaison est indéfini pour une NAV cédée nulle. Le simulateur de frais annonce le déficit annuel de récolte de 300 k€ et reconnaît l’égalité entre frais et salaires à 70 k€. [Multiples du fonds, ILPA](https://ilpa.org/resources-tools/private-equity-101/private-equity-glossary/) · [Définition du MOIC brut, ILPA](https://ilpa.org/wp-content/uploads/2025/02/ILPA-Template-FAQs-2024.pdf)
- **Mémo.** Dans 2 onglets de Chromium autonome 160.0.8170.0 (révision 1748020), un dépassement réel du quota a laissé un brouillon en mémoire dans B. L’import d’une sauvegarde v2 via le profil dans A a restauré la note enregistrée. La saisie suivante dans B a annoncé le conflit. Le contenu enregistré restait identique à celui du fichier importé. Après refus du presse-papiers, le texte JSON sélectionné dans B contenait le brouillon et sa dernière modification.
- **Validation locale.** Les 9 calculateurs ont passé 18 scénarios navigateur à 390 × 844 et 1 365 × 900 sous Chrome for Testing 150. Les 3 HTML ont été régénérés avec `npm run build:memo` et vérifiés avec `npm run check:memo`. Les projections de leçons ont été régénérées avec `npm run split:lessons`. La dernière exécution de `npm run check` a réussi avec 535 tests client et 128 tests Node. Une première exécution en bac à sable avait bloqué les 2 tests Node de prérendu. Un essai intermédiaire avait dépassé le délai d’un test Ikigai, qui a ensuite réussi en isolation et dans la suite complète.

Les résultats portent sur l’intégration locale du 18 novembre. Les traces de vérification sont dans `/private/tmp/vc-sim-verif-YwuV37`, le relevé des 18 scénarios dans `/private/tmp/vc-simulateurs-recette.defAAg` et les 4 captures du mémo dans `/private/tmp/vc-memo-ab-20261118-zDxIK7xz`.

<a id="catalogue-simulateurs-2026-11-18"></a>

## 2026-11-18 · Catalogue et première saisie des simulateurs

Le catalogue groupe les rangées par décision. À 390 × 844, le premier écran présente 5 outils entiers, contre une carte entière auparavant. À 1 440 × 900, les 10 noms et leurs résultats sont visibles. Chaque rangée est un lien vers la fiche existante.

| Choix au catalogue | Saisie et résultat observés dans Chromium |
| --- | --- |
| Pre-money / Post-money, part du nouvel investisseur sur un tour | 8 M€ avant le tour et 2 M€ levés donnent 20 % et une post-money de 10 M€. Les 2 montants ont été changés puis ressaisis. |
| Simulateur de dilution, part des fondateurs après chaque tour | Seed à 6 M€ avant le tour, levée de 1,5 M€, création de 10 points de pool. Série A à 18 M€, levée de 6 M€, création de 5 points. Après retrait de la série B de l’exemple, les fondateurs détiennent 49 %. |
| Scénario de levée, montant à lever pour la durée souhaitée | Une trésorerie de 200 k€ et des dépenses de 120 k€/mois pendant 18 mois donnent un besoin de 1,96 M€, ou 2,45 M€ avec la marge de 25 %. |
| Fund returns, distributions et valeur encore en portefeuille | Pour 100 M€ versés, 60 M€ distribués et 180 M€ résiduels, DPI 0,6×, RVPI 1,8× et TVPI 2,4×. |
| Note d’investissement, recommandation pour le comité | « Investir » et une justification font passer la rubrique à « Renseigné · 2/2 ». L’aperçu reprend les 2 champs et la réouverture restaure le brouillon. |

Les 9 calculateurs montrent leur premier champ aux 2 formats. Le retour au catalogue restitue le focus à la rangée ouverte. L’entrée par le parcours Série A, la conservation du budget et le retour au parcours ont été vérifiés. À 390 × 844, le premier choix de la note est entièrement visible. À 320 × 667, il faut faire défiler la page.

Les 2 tests ajoutés ont d’abord échoué sur le catalogue initial et les curseurs. La validation finale passe avec `npm run check` (537 tests client, 128 tests Node) et `npm run check:memo` (3 HTML conformes aux sources). La recette navigateur vérifie les destinations, les saisies et les résultats. Le taux de premier clic correct et le temps de recherche d’un outil restent à mesurer auprès de participants.

<a id="power-law-2026-11-18"></a>

## 2026-11-18 · Réinvestissements du simulateur Power law

Les deux politiques fixent les tickets avant le tirage des sorties et partagent les mêmes tours, prix et cessions. Le fonds appelle uniquement les montants investis. La leçon du moteur décrit les hypothèses commerciales et le calcul du TVPI. Le repère rétrospectif utilise les mêmes prix et plafonds.

Avec 80 M€ engagés, 25 sociétés et 32 M€ de réserves, le suivi de tous les tours ouverts investit en moyenne 28,13 M€ de réserves et donne un TVPI médian de 0,81×. Le suivi conditionné à l’objectif investit 14,39 M€ et donne 0,87×. Chromium a restitué ces résultats à 390 × 844 et 1 440 × 900, y compris après un passage à 0 % de réserves. Les vérifications ont couvert le changement de politique détaillée, la référence rétrospective et l’ouverture de la leçon depuis le simulateur.

Avant la modification du moteur, 4 tests ciblés ont échoué, dont le cas de perte totale qui renvoyait 0,40×. Le test de permutation confirme désormais que l’échange de deux sorties change les rendements et conserve les tickets des deux politiques. Les projections de leçons ont été régénérées avec `npm run split:lessons`. Le premier `npm run check` a rencontré deux restrictions du bac à sable lors du prérendu. Le contrôle complet avec accès à Chromium et au serveur local a réussi avec 541 tests client et 128 tests Node.
