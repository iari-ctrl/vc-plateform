# Procédure de publication (« push ») manuelle

Cette procédure explique comment envoyer en ligne (sur GitHub) le travail enregistré
localement, en s'assurant qu'aucune mise à jour n'a été oubliée. Elle vise une exécution
manuelle, sans assistance, et suppose seulement un terminal ouvert à la racine du projet
(`vc-platform`).

## Ce que « publier » signifie ici

Le travail passe par trois états successifs. Il est d'abord *enregistré sur l'ordinateur*
(les `commits` git) ; il n'est pas encore visible ailleurs. Il devient ensuite *en ligne*
lorsqu'on l'envoie vers GitHub (le `push`). La version officielle du site est la branche
`master` : ce qui s'y trouve fait référence. Publier consiste donc à amener le travail
local jusqu'à `master`, en ligne, après avoir vérifié sa cohérence.

Le piège propre à ce projet : certains fichiers de `data/` sont *fabriqués automatiquement*
à partir des textes (glossaire, leçons), et le plan du site (`sitemap.xml`) l'est aussi.
Un working tree « propre » ne garantit pas que ces fichiers dérivés sont à jour : ils ne le
sont que si l'on a relancé leur fabrication après la dernière édition. La procédure relance
donc systématiquement cette fabrication avant de publier.

## Étapes

Toutes les commandes se lancent à la racine du dépôt, depuis la branche de travail.

1. **Vérifier qu'il ne reste rien d'oublié localement.**
   ```bash
   git status
   ```
   Le working tree doit être propre. S'il reste des fichiers modifiés non enregistrés,
   les examiner et décider de les committer ou de les abandonner avant de continuer.

2. **Rafraîchir l'état distant et confirmer que la fusion sera sans conflit.**
   ```bash
   git fetch origin
   git merge-base --is-ancestor master HEAD && echo "OK fast-forward"
   ```
   Le message `OK fast-forward` indique que `master` pourra simplement « avancer » jusqu'au
   travail, sans fusion compliquée. À défaut, c'est que `master` a évolué en ligne de son
   côté : rebaser d'abord (`git rebase origin/master` depuis la branche), puis reprendre.

3. **Re-fabriquer les fichiers générés et le plan du site.**
   ```bash
   npm run split:content
   npm run generate:sitemap
   git status --short
   ```
   Si `git status` révèle des fichiers modifiés (`data/*.index.json`, `*.bodies.json`,
   `glossary.defs.json`, ou `client/public/sitemap.xml`), c'est qu'une édition n'avait pas
   été propagée. Les enregistrer :
   ```bash
   git add -A
   git commit -m "chore: régénère fichiers générés + sitemap"
   ```
   Si rien ne bouge, les fichiers dérivés étaient déjà à jour.

4. **Passer les contrôles de cohérence (les mêmes que la vérification automatique en ligne).**
   ```bash
   npm run validate:content:strict
   npm run lint
   npm run build
   npm run test --workspace client
   npm run test --workspace server
   ```
   Chacune doit se terminer sans erreur (code de sortie 0). Le `lint` peut afficher des
   *avertissements* (`warning`) sans que ce soit bloquant ; seules les *erreurs* le sont.
   En cas d'échec, corriger, puis reprendre à l'étape 3. Ne pas publier tant que tout n'est
   pas au vert.

5. **Amener le travail dans la version officielle et l'envoyer.**
   ```bash
   git checkout master
   git merge --ff-only <nom-de-la-branche-de-travail>
   git push origin master
   ```
   `--ff-only` garantit que l'opération échoue plutôt que de créer une fusion hasardeuse si
   quelque chose a divergé entre-temps.

6. **Confirmer que le local et l'en-ligne sont identiques.**
   ```bash
   git rev-list --left-right --count origin/master...master
   ```
   Le résultat attendu est `0  0`. Vérifier enfin que la vérification automatique est au vert
   sur la page Actions du dépôt : https://github.com/iari-ctrl/vc-plateform/actions

## Ce que garantit chaque contrôle

- `git status` / `git fetch` : rien d'oublié localement, et la version en ligne est connue.
- `split:content` + `generate:sitemap` : les fichiers dérivés reflètent les derniers textes.
- `validate:content:strict` : la structure, les références croisées (un `pathId`, un
  `glossaryRef`, un marqueur `[[..]]` qui pointe dans le vide est refusé) et les marqueurs
  inline sont cohérents, sans tolérance.
- `lint` : la qualité du code client.
- `build` : le site se construit réellement (et relance au passage `split` + validation).
- `test` (client et serveur) : les comportements clés (routage i18n, profil/ikigai,
  simulateurs, authentification, isolation par utilisateur) ne sont pas cassés.

## Le job « drift » de la vérification en ligne

La vérification automatique comporte un second contrôle, dit *drift*, qui peuple une base
jetable depuis `data/*.json` puis la ré-exporte, et exige que le résultat soit identique aux
fichiers `data/glossary.json`, `caseStudies.json` et `blog.json`. C'est la preuve que seed
(JSON→DB) et export (DB→JSON) sont inverses : l'ordre canonique attendu est celui que produit
l'export (glossaire trié par `term`, cas par `title`, blog par `date` décroissante puis
`title`).

Ce contrôle a été **résolu** : les fichiers sources ont été réalignés sur la forme produite
par l'export (réordonnancement pur, sans changement de contenu — voir le commit
`chore(content): normalise l'ordre canonique`).

**Pour éviter qu'il ne réapparaisse** : après toute édition manuelle de `glossary.json`,
`caseStudies.json` ou `blog.json` (ajout d'un terme, d'un cas, d'un article), relancer
`npm run content:export` pour réimposer l'ordre canonique, puis committer le résultat. Une
édition via le CMS suivie de `content:export` ne pose pas ce problème. Reproduire le contrôle
en local, sans toucher à la base de développement :
```bash
DATABASE_URL="file:/tmp/drift-check.db" npm run db:setup --workspace server
DATABASE_URL="file:/tmp/drift-check.db" npm run content:export -- --dry-run
```

## En cas de besoin d'annulation

Tant que l'étape 5 (`git push`) n'a pas été lancée, rien n'est en ligne : on peut tout
reprendre librement. Après le push, revenir en arrière sur `master` suppose un `git revert`
(crée un commit qui annule) ou un `git reset` suivi d'un push forcé (plus risqué) — à ne
faire qu'avec précaution.
