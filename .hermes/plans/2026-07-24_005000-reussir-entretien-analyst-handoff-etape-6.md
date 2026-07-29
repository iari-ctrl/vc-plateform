# Passation compacte — `reussir-l-entretien-analyst` avant étape 6

Date : 2026-07-24 00:50 locale environ
Runtime utilisé : `gpt-5.5` via `openai-codex`
Périmètre : étapes 1 à 5 du plan, plus continuité UI minimale jusqu’au jalon/livrable.

## Résultat atteint

Les étapes 1 à 5 sont implémentées et vérifiées localement.

- Matrice de preuves créée : `.hermes/plans/2026-07-24_001520-reussir-entretien-analyst-evidence.md`.
- Les 13 leçons de `c-entretien-analyst` ont été réécrites en conservant leurs IDs et URLs.
- Chaque leçon cible a au moins une source externe en `furtherReading`.
- Les formulations absolues/non sourcées ont été retirées ou contextualisées : `70 %`, `±15 %`, `éliminatoire`, `différenciateur n° 1`, posture de `position de force`.
- Le parcours `p-entretien-analyst` est recomposé en 13 étapes.
- `c-mathematiques-vc` est réutilisé dans le parcours comme étape pratique de révision technique.
- Les trois cas fictifs ne sont plus dans le parcours : `cs-market-sizing-live`, `cs-seed-ic`, `cs-power-law-portfolio`.
- `lea-mock` résout désormais vers un livrable local exécutable, pas seulement vers une leçon descriptive.
- Le memo Shopify de Bessemer est utilisé comme exemple historique sourcé, jamais comme format universel.
- La navigation de leçon tient compte de l’ordre du parcours : après `lea-read-startup`, l’utilisateur va vers `c-mathematiques-vc`; après `lea-jour-j`, il va vers le livrable final.
- `ParcoursDetailPage` ne propose plus les budgets non compatibles avec `timeFit`.

## Fichiers principalement modifiés par ce passage

Contenu :

- `data/lessons.json`
- `data/courses.json`
- `data/parcours.json`
- `data/deliverables.json`
- `data/generated/lessons.index.json`
- `data/generated/lessons.bodies.json`

Support lecture/navigation/validation :

- `client/src/content/types.ts` — `FurtherReading.kind` accepte `external`.
- `client/src/pages/learn/furtherReadingHref.ts` — résolution directe des URLs externes.
- `client/src/pages/learn/furtherReadingHref.test.ts` — test URL externe.
- `scripts/validate-content.mjs` — validation des `furtherReading.kind === external` et URL HTTPS.
- `client/src/content/parcours.ts` — helper `parcoursNavigationForLesson`.
- `client/src/content/parcours.test.ts` — tests parcours entretien, livrable final, sources, navigation.
- `client/src/pages/learn/LessonPage.tsx` — CTA suivant/précédent basé sur la navigation de parcours quand applicable.
- `client/src/pages/learn/ParcoursDetailPage.tsx` — budgets filtrés selon `timeFit`.
- `client/public/sitemap.xml` — régénéré par le build avec `VITE_SITE_URL`.

Documents de travail :

- `.hermes/plans/2026-07-24_000737-reussir-entretien-analyst.md`
- `.hermes/plans/2026-07-24_001520-reussir-entretien-analyst-evidence.md`
- `.hermes/plans/2026-07-24_005000-reussir-entretien-analyst-handoff-etape-6.md`

## État cible des données

Parcours `p-entretien-analyst` :

1. `lesson:lea-process`
2. `lesson:lea-grille`
3. `lesson:lea-market-sizing`
4. `lesson:lea-read-startup`
5. `course:c-mathematiques-vc`
6. `lesson:lea-deal-memo`
7. `lesson:lea-case-study`
8. `lesson:lea-pitch`
9. `lesson:lea-fit`
10. `lesson:lea-reverse-questions`
11. `lesson:lea-fund-research`
12. `lesson:lea-jour-j`
13. `milestone:lea-mock`

Autres invariants vérifiés :

- `p-entretien-analyst.time = { source: 'derived', sessions: 8, cadence: 'Sur 2 à 4 semaines' }`
- `p-entretien-analyst.timeFit = ['medium', 'high']`
- `c-entretien-analyst.durationMin = 83`
- `c-entretien-analyst.durationSource = 'lesson-read-minutes'`
- Somme des `readMin` des 13 leçons : `83`
- Livrable `lea-mock` : slug `mock-entretien-analyst`, `activityKind: capstone`, `estimatedWorkMinutes: 150`, `evaluation: ['auto', 'peer']`
- Template du livrable final : choix fonds/société/sources ; thèse/recommandation ; faits/hypothèses ; marché/modèle/cap table ; risques/diligence ; simulation orale/révision.

## Sources externes utilisées / bornes d’usage

Sources retenues :

- OPM — Structured Interviews : référence méthodologique générale, pas norme VC.
- DGAFP 2021 — Structurer la fonction recrutement : référence méthodologique générale, pas norme VC.
- NBER/Gompers et al. — décision VC : critères d’investissement, pas critères de recrutement.
- Bessemer Shopify memo : exemple historique public et sourcé, pas format universel.
- Bessemer memos publics : exemples de densité de raisonnement.
- ILPA reporting template : normalisation reporting private capital, transposition prudente.
- YC SAFE documents : exemple de mécanique documentaire US, pas droit applicable universel.
- Commission européenne CSRD : contrainte selon seuils/calendrier, pas contrainte générale pour toutes les PME.

## Validations réellement exécutées

Succès :

```bash
npm run test --workspace client -- src/content/parcours.test.ts
# 10 tests passed

npm run test --workspace client -- src/pages/learn/furtherReadingHref.test.ts
# 2 tests passed

npm run test --workspace client -- src/content/parcours.test.ts src/pages/learn/furtherReadingHref.test.ts
# 12 tests passed

npm run typecheck --workspace client
# tsc -b OK

npm run validate:content:strict
# Contenu valide strict

npm run lint
# client + node ESLint OK

npm run check:generated
# Generated content check OK

git diff --check
# OK

VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build
# build Vite OK + prerender strict 664/664 OK
```

Échec explicable et non bloquant :

```bash
npm run build
# échec attendu : VITE_SITE_URL requis par scripts/generate-sitemap.mjs
```

Le build complet passe avec les variables documentées dans `README.md` et `CLAUDE.md`.

## État Git important

Le worktree contient beaucoup de modifications locales préexistantes ou hors périmètre. Ne pas supposer que tout vient de cette passe.

`git status --short` observé après implémentation incluait notamment :

- `Suivis/ETAT.md`, `Suivis/JOURNAL.md`
- plusieurs fichiers UI/test hors périmètre (`PathAtlas`, `QuizBlock`, etc.)
- docs (`docs/ARCHITECTURE_EDITION.md`, `docs/DESIGN_SYSTEM.md`, `docs/parcours/README.md`)
- `scripts/validation-core*`
- nouveaux fichiers `data/parcoursRelations.json`, `client/src/content/parcoursRelations*`
- plans `.hermes/plans/*`

Pour l’étape 6, commencer par :

```bash
git status --short
git diff --stat
```

Puis isoler la revue sur les fichiers listés dans “Fichiers principalement modifiés par ce passage”.

## Étape 6 recommandée pour modèle supérieur

Objectif : audit éditorial, métier, cohérence rendu et non-régression avant éventuelle consolidation.

Prompt recommandé :

> Tu reprends le projet local `vc-platform`. Audit en français, sans commit/push/deploy. Le parcours cible est `p-entretien-analyst` / slug `reussir-l-entretien-analyst`. Les étapes 1 à 5 viennent d’être implémentées : 13 leçons réécrites, parcours recomposé en 13 étapes, `c-mathematiques-vc` réutilisé, cas fictifs retirés, livrable `lea-mock` créé, sources externes ajoutées, navigation de parcours corrigée. Vérifie la qualité métier/éditoriale et la cohérence de rendu avant consolidation. Ne réécris pas tout : signale les corrections nécessaires, puis applique uniquement les corrections justifiées. Préserve IDs/URLs, ne commite pas.

Sous-tâches étape 6 :

1. Relire les 13 leçons pour détecter : suraffirmation, source mal utilisée, formulation marketing, incohérence métier, redondance forte avec cours Analyst existants.
2. Vérifier le livrable `lea-mock` : exécutable localement, pas de promesse externe, pas de vidéo imposée, confidentialité claire, grille suffisante.
3. Vérifier la recomposition du parcours : ordre pédagogique, durée, `timeFit`, liens vers `c-mathematiques-vc`, absence des trois cas fictifs.
4. Vérifier UI/navigation : depuis `lea-read-startup` vers maths VC, depuis `lea-jour-j` vers livrable final, affichage des sources externes, affichage des budgets.
5. Relancer au minimum : tests ciblés, typecheck, validation stricte, lint, build avec `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform`.
6. Si tout est accepté, mettre à jour `Suivis/ETAT.md` et `Suivis/JOURNAL.md` selon la convention projet. Ne pas utiliser `Correction.md` comme tracker final.

Modèle conseillé : modèle supérieur / effort élevé ou très élevé, car l’étape porte sur cohérence globale, audit éditorial factuel et intégration UI/contenu.
