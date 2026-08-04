# Quickstart — Reproduire le diagnostic sans modifier le dépôt

## 1. Préconditions

- Se placer à la racine de `vc-platform`.
- Conserver le worktree existant, même s’il est sale.
- Ne lancer aucune commande de génération, build, dev, preview, test avec cache, Git distante ou déploiement.
- Vérifier que la fonctionnalité active pointe vers `specs/001-diagnostic-architecture-technique`.

```bash
.specify/scripts/bash/check-prerequisites.sh --json --paths-only
```

**Preuve attendue** : les chemins `FEATURE_DIR`, `FEATURE_SPEC`, `IMPL_PLAN` et `TASKS` désignent le même dossier de fonctionnalité. La commande ne persiste pas le sélecteur.

## 2. Capturer la frontière du worktree

```bash
git status --short --branch
```

Conserver la liste des modifications préexistantes. Le diagnostic ne doit ni les réécrire, ni les formater, ni les supprimer.

## 3. Contrôles sûrs déjà préinspectés

```bash
node scripts/check-generated.mjs
node scripts/validate-content.mjs --strict
npm run lint
```

**Preuves attendues** : chaque commande retourne le code 0 ; `check-generated` confirme que les quatre dérivés leçons/glossaire correspondent aux sources ; le validateur strict ne signale aucune erreur ; ESLint retourne zéro avertissement.

Ces contrôles lisent le dépôt. Ils ne génèrent ni contenu, ni bundle, ni serveur et n’utilisent pas `--fix` ou `--cache`.

**Exécution du 2026-08-03** :

| Contrôle | Résultat |
| --- | --- |
| `node scripts/check-generated.mjs` | Exit 0 ; `Generated content check: OK (147 lessons, 126 published bodies, 420 glossary terms).` |
| `node scripts/validate-content.mjs --strict` | Exit 0 ; structure, références et 373 marqueurs cohérents. |
| `npm run lint` | Exit 0 ; lint client, scripts, `shared` et hooks ESM sans avertissement. |

## 4. Contrôle des routes sans génération

```bash
node --input-type=module -e "import('./scripts/collect-routes.mjs').then(({collectRoutes,collectNoindexRoutes})=>{const pub=collectRoutes();const no=collectNoindexRoutes();const p=new Set(pub.map(x=>x.path));console.log({public:pub.length,noindex:no.length,duplicates:pub.length-p.size});})"
```

**Preuve attendue** : zéro route publique dupliquée. Les volumes sont une observation du snapshot, pas un invariant à recopier dans une autorité.

**Exécution du 2026-08-03** : exit 0 ; 703 routes publiques, 3 routes noindex, 0 doublon public, 0 intersection public/noindex.

## 5. Contrôle du graphe d’imports

L’inventaire s’effectue en mémoire sur `client/src` et `shared`, en résolvant les imports relatifs, `@/` et `@shared/`, ainsi que les feuilles CSS. Le rapport doit consigner :

- cycles détectés ;
- imports locaux non résolus ;
- modules sans consommateur ;
- nœuds à forte dépendance entrante ;
- limites de l’heuristique pour les imports dynamiques et les tests.

Aucun fichier de graphe n’est écrit.

## 6. Vérifier le contrat du rapport

Avant restitution :

- [x] chaque axe demandé possède un statut (`covered`, `sampled`, `excluded` ou `blocked`) ;
- [x] chaque fait confirmé possède une preuve `path:line` ou une sortie de commande ;
- [x] faits, interprétations et recommandations sont séparés ;
- [x] chaque recommandation remonte vers au moins un constat ;
- [x] toute violation constitutionnelle est `CRITICAL` ;
- [x] toute évolution durable est marquée comme nécessitant une spécification ;
- [x] les modifications préexistantes restent identifiables ;
- [x] aucun résultat historique n’est présenté comme une validation courante.

## 7. Commandes interdites dans ce lot

- `npm run dev`, `npm run build`, `npm run preview` ;
- `npm run split:content`, `npm run generate:sitemap` ou tout script d’écriture ;
- `npm run test` et `npm run typecheck` dans cette passe, car leur configuration peut écrire des caches ou fichiers d’incrément ;
- toute commande avec `--fix`, `--update`, `--write` ou équivalent ;
- commit, staging, reset, checkout, clean, push, workflow distant ou déploiement.

## 8. Clôture

```bash
git status --short --branch
```

Comparer à la frontière initiale. Les seuls nouveaux fichiers autorisés sont les artefacts Spec Kit de `specs/001-diagnostic-architecture-technique/` et le sélecteur `.specify/feature.json`. Aucun suivi opérationnel n’est mis à jour, puisque ce lot ne livre aucune correction matérielle.

**Clôture du 2026-08-03** :

- `check-prerequisites.sh --json --paths-only` retourne `FEATURE_DIR`, `FEATURE_SPEC`, `IMPL_PLAN` et `TASKS` sous `specs/001-diagnostic-architecture-technique`.
- `tasks.md` et la checklist de restitution ne contiennent plus de case non cochée.
- Les 29 exigences `FR-*`, `SC-*` et `TR-*` de `spec.md` sont référencées par au moins une tâche.
- `git diff --check -- .specify/feature.json specs/001-diagnostic-architecture-technique` retourne exit 0 sur la vue suivie par Git ; les espaces finaux restants dans les artefacts Markdown correspondent aux retours à la ligne durs déjà présents dans les modèles.
- Statut final : les modifications préexistantes restent dans `Suivis/ETAT.md`, `Suivis/JOURNAL.md`, `client/src/components/chrome/SideNav.tsx`, `client/src/components/home/HomeEditorialBridge.tsx`, `client/src/components/ui/Logo.tsx`, `client/src/layouts/MainLayout.dom.test.tsx` et `client/src/pages/home/homeExperience.dom.test.tsx`; les seuls nouveaux chemins du lot sont `.specify/feature.json` et `specs/001-diagnostic-architecture-technique/`.
