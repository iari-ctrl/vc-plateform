# Procédure de sauvegarde Git (« push »)

Runbook de sauvegarde Git/GitHub depuis la racine du projet. Application **100 % statique, locale et FR-only** : pas d'API, pas de base, pas de tests serveur, pas de routes `/fr` `/en`.

> [!IMPORTANT]
> **Un push ne publie plus le site.** `.github/workflows/deploy-pages.yml` est limité à un déclenchement manuel (`workflow_dispatch`) et ne doit pas être exécuté pendant la phase local-first. GitHub sert actuellement de sauvegarde du code ; la remise en ligne fera l'objet d'un lot distinct.

Cette procédure vise une exécution manuelle, sans assistance, et suppose un terminal ouvert à la racine du projet (`vc-platform`).

## Ce que « sauvegarder » signifie ici

Le travail est d'abord enregistré sur l'ordinateur par des `commits` Git. Un `push` en copie ensuite l'historique sur GitHub comme sauvegarde du code, sans rendre l'application publique et sans lancer GitHub Pages. La branche `master` reste la référence du code sauvegardé ; elle n'est pas, dans cette phase, un signal de publication.

Le piège propre à ce projet : certains fichiers de `data/` sont *fabriqués automatiquement* à partir des textes (glossaire, leçons), et le plan du site (`sitemap.xml`) l'est aussi. Un working tree « propre » ne garantit pas que ces fichiers dérivés sont à jour : la procédure relance donc leur fabrication avant la sauvegarde.

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

4. **Passer les contrôles de cohérence en local.**
   ```bash
   npm run check
   npm run build
   git diff --check
   ```
   Chaque commande doit se terminer sans erreur. Le lint refuse aussi les avertissements. En cas d'échec, corriger puis reprendre à l'étape 3. Le build recrée `client/dist`, qui reste un artefact local et ne doit pas être traité comme source.

5. **Amener le travail dans la branche de sauvegarde et l'envoyer, uniquement sur demande.**
   ```bash
   git checkout master
   git merge --ff-only <nom-de-la-branche-de-travail>
   git push origin master
   ```
   `--ff-only` garantit que l'opération échoue plutôt que de créer une fusion hasardeuse si quelque chose a divergé entre-temps.

6. **Confirmer que le local et la sauvegarde distante sont identiques.**
   ```bash
   git rev-list --left-right --count origin/master...master
   ```
   Le résultat attendu est `0  0`. Aucun workflow Pages ne doit avoir démarré : son déclenchement est désormais strictement manuel.

## Ce que garantit chaque contrôle

- `git status` / `git fetch` : rien d'oublié localement, et la version en ligne est connue.
- `split:content` + `generate:sitemap` : les fichiers dérivés reflètent les derniers textes.
- `validate:content:strict` : la structure, les références croisées (un `pathId`, un `glossaryRef`, un marqueur `[[..]]` qui pointe dans le vide est refusé) et les marqueurs inline sont cohérents, sans tolérance.
- `lint` : la qualité du code client.
- `build` : le site se construit réellement (et relance au passage `split` + validation + prérendu).
- `test` : les comportements clés (routes client, profil/ikigai, persistance locale, simulateurs, journal de décision) ne sont pas cassés.

## En cas de besoin d'annulation

Tant que l'étape 5 (`git push`) n'a pas été lancée, la sauvegarde distante n'a pas changé. Après le push, préférer `git revert`, qui conserve l'historique ; éviter toute réécriture forcée de `master`.
