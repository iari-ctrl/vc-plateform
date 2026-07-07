# Procédure de publication (« push ») manuelle

Runbook de publication Git/GitHub depuis la racine du projet. Application **100 % statique, locale et FR-only** : pas d'API, pas de base, pas de tests serveur, pas de routes `/fr` `/en`.

> [!IMPORTANT]
> **Le seul workflow GitHub est `.github/workflows/deploy-pages.yml`** : à chaque push sur `master`, il relance `split:content`, build le client (`--base=/vc-plateform/`, `VITE_API_DISABLED=true`) et publie `client/dist` sur la branche `gh-pages`. Il **ne lance ni `validate:content`, ni `lint`, ni les tests**. Ces contrôles de cohérence ne sont donc joués **que** localement, à l'étape 4 ci-dessous : rien ne les rejoue en ligne. Un contenu invalide poussé sur `master` sera déployé tel quel.

Cette procédure vise une exécution manuelle, sans assistance, et suppose un terminal ouvert à la racine du projet (`vc-platform`).

## Ce que « publier » signifie ici

Le travail passe par trois états successifs. Il est d'abord *enregistré sur l'ordinateur* (les `commits` git) ; il n'est pas encore visible ailleurs. Il devient ensuite *en ligne* lorsqu'on l'envoie vers GitHub (le `push`). La version officielle du site est la branche `master` : ce qui s'y trouve fait référence. Publier consiste donc à amener le travail local jusqu'à `master`, en ligne, après avoir vérifié sa cohérence.

Le piège propre à ce projet : certains fichiers de `data/` sont *fabriqués automatiquement* à partir des textes (glossaire, leçons), et le plan du site (`sitemap.xml`) l'est aussi. Un working tree « propre » ne garantit pas que ces fichiers dérivés sont à jour : ils ne le sont que si l'on a relancé leur fabrication après la dernière édition. La procédure relance donc systématiquement cette fabrication avant de publier.

## Étapes

Toutes les commandes se lancent à la racine du dépôt, depuis la branche de travail.

1. **Vérifier qu'il ne reste rien d'oublié localement.**
   ```bash
   git status
   ```
   Le working tree doit être propre. S'il reste des fichiers modifiés non enregistrés, les examiner et décider de les committer ou de les abandonner avant de continuer.

2. **Rafraîchir l'état distant et confirmer que la fusion sera sans conflit.**
   ```bash
   git fetch origin
   git merge-base --is-ancestor master HEAD && echo "OK fast-forward"
   ```
   Le message `OK fast-forward` indique que `master` pourra simplement « avancer » jusqu'au travail, sans fusion compliquée. À défaut, c'est que `master` a évolué en ligne de son côté : rebaser d'abord (`git rebase origin/master` depuis la branche), puis reprendre.

3. **Re-fabriquer les fichiers générés et le plan du site.**
   ```bash
   npm run split:content
   npm run generate:sitemap
   git status --short
   ```
   Si `git status` révèle des fichiers modifiés (`data/generated/*.index.json`, `data/generated/*.bodies.json`, `data/generated/glossary.defs.json`, ou `client/public/sitemap.xml`), c'est qu'une édition n'avait pas été propagée. Les enregistrer :
   ```bash
   git add -A
   git commit -m "chore: régénère fichiers générés + sitemap"
   ```
   Si rien ne bouge, les fichiers dérivés étaient déjà à jour.

4. **Passer les contrôles de cohérence — en local, car rien ne les rejoue en ligne.**
   ```bash
   npm run validate:content:strict
   npm run lint
   npm run build
   npm run test --workspace client
   ```
   Chacune doit se terminer sans erreur (code de sortie 0). Le `lint` peut afficher des *avertissements* (`warning`) sans que ce soit bloquant ; seules les *erreurs* le sont. En cas d'échec, corriger, puis reprendre à l'étape 3. Ne pas publier tant que tout n'est pas au vert : le workflow de déploiement ne referait pas ces vérifications. Le build recrée `client/dist`, qui reste un artefact généré local et ne doit pas être traité comme source.

5. **Amener le travail dans la version officielle et l'envoyer.**
   ```bash
   git checkout master
   git merge --ff-only <nom-de-la-branche-de-travail>
   git push origin master
   ```
   `--ff-only` garantit que l'opération échoue plutôt que de créer une fusion hasardeuse si quelque chose a divergé entre-temps.

6. **Confirmer que le local et l'en-ligne sont identiques, puis que le déploiement a réussi.**
   ```bash
   git rev-list --left-right --count origin/master...master
   ```
   Le résultat attendu est `0  0`. Vérifier enfin, sur la page Actions du dépôt (https://github.com/iari-ctrl/vc-plateform/actions), que le workflow **Deploy frontend to GitHub Pages** s'est terminé au vert. Ce workflow **construit et déploie** seulement : il ne valide pas le contenu. La cohérence reposait entièrement sur l'étape 4.

## Ce que garantit chaque contrôle

- `git status` / `git fetch` : rien d'oublié localement, et la version en ligne est connue.
- `split:content` + `generate:sitemap` : les fichiers dérivés reflètent les derniers textes.
- `validate:content:strict` : la structure, les références croisées (un `pathId`, un `glossaryRef`, un marqueur `[[..]]` qui pointe dans le vide est refusé) et les marqueurs inline sont cohérents, sans tolérance.
- `lint` : la qualité du code client.
- `build` : le site se construit réellement (et relance au passage `split` + validation + prérendu).
- `test` (client) : les comportements clés (routes client, profil/ikigai, simulateurs, journal de décision) ne sont pas cassés.

## En cas de besoin d'annulation

Tant que l'étape 5 (`git push`) n'a pas été lancée, rien n'est en ligne : on peut tout reprendre librement. Après le push, revenir en arrière sur `master` suppose un `git revert` (crée un commit qui annule) ou un `git reset` suivi d'un push forcé (plus risqué) — à ne faire qu'avec précaution.
