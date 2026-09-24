# Procédure de sauvegarde Git (« push »)

Runbook de sauvegarde Git/GitHub depuis la racine du projet. Application **100 % statique, locale et FR-only** : pas d'API, pas de base, pas de tests serveur, pas de routes `/fr` `/en`.

> [!IMPORTANT]
> **Un push ne publie plus le site.** `.github/workflows/deploy-pages.yml` est limité à un déclenchement manuel (`workflow_dispatch`) et ne doit pas être exécuté pendant la phase local-first. GitHub sert actuellement de sauvegarde du code ; la remise en ligne fera l'objet d'un lot distinct.

Cette procédure vise une exécution manuelle, sans assistance, et suppose un terminal ouvert à la racine du projet (`vc-platform`).

## Ce que « sauvegarder » signifie ici

Le travail est d'abord enregistré sur l'ordinateur par des `commits` Git. Un `push` en copie ensuite l'historique sur GitHub comme sauvegarde du code, sans rendre l'application publique et sans lancer GitHub Pages. La branche `master` reste la référence du code sauvegardé ; elle n'est pas, dans cette phase, un signal de publication.

Le piège propre à ce projet : certains fichiers de `data/` sont *fabriqués automatiquement* à partir des textes (glossaire, leçons), les trois HTML du simulateur de note sont assemblés depuis `nouveau simu/src/`, et le plan du site (`sitemap.xml`) est lui aussi généré. Un working tree « propre » ne garantit pas que ces fichiers dérivés sont à jour : la procédure relance donc leur fabrication avant la sauvegarde.

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
   git merge-base --is-ancestor origin/master HEAD && echo "OK fast-forward"
   ```
   Le message `OK fast-forward` indique que la référence distante `origin/master`, fraîchement actualisée, est bien un ancêtre du travail courant et que `master` pourra avancer sans fusion compliquée. À défaut, la branche distante a évolué de son côté : rebaser d'abord (`git rebase origin/master` depuis la branche), puis reprendre.

3. **Re-fabriquer les fichiers générés et le plan du site.**
   ```bash
   npm run build:memo
   npm run split:content
   npm run generate:sitemap
   git status --short
   ```
   Si `git status` révèle des fichiers modifiés (`data/generated/`, `client/public/sitemap.xml`, `client/public/tools/simulateur-memo.html` ou les deux distributions sous `nouveau simu/`), une édition n’avait pas été propagée. Examiner ces sorties, puis les enregistrer :
   ```bash
   git add -A
   git commit -m "chore: régénère fichiers générés + sitemap"
   ```
   Si rien ne bouge, les fichiers dérivés étaient déjà à jour.

4. **Passer les contrôles de cohérence en local.**
   ```bash
   PUPPETEER_EXECUTABLE_PATH="/chemin/absolu/vers/Chromium" npm run check
   PUPPETEER_EXECUTABLE_PATH="/chemin/absolu/vers/Chromium" \
     VITE_BASE_URL=/vc-plateform/ \
     VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform \
     npm run build
   npm run check:memo
   npm run check:generated
   git diff --check
   ```
   Remplacer le chemin d’exemple par l’exécutable Chromium réellement utilisé. Chaque commande doit se terminer sans erreur. Le lint refuse aussi les avertissements. En cas d'échec, corriger puis reprendre à l'étape 3. Le build recrée `client/dist`, qui reste un artefact local et ne doit pas être traité comme source. Les deux contrôles placés après le build confirment qu’il n’a laissé aucune sortie dérivée obsolète.

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
- `build:memo` : les trois HTML du simulateur reflètent `nouveau simu/src/`.
- `split:content` + `generate:sitemap` : les index, corps publiés, définitions et routes reflètent les dernières sources.
- `check:memo` + `check:generated` : les sorties dérivées sont encore à jour après le build, sans réécriture silencieuse.
- `validate:content:strict` : la structure, les références des étapes de parcours, les exigences cours/leçons des certifications, les contextes et variantes certifiantes, les `glossaryRef` et les marqueurs `[[..]]` sont cohérents, sans référence vide ni doublon toléré.
- `lint` : le code client, les scripts, les modules partagés et les hooks contrôlés ne produisent ni erreur ni avertissement.
- `build` : le site se construit avec la base et l’origine de publication, puis passe le prérendu strict.
- `test` : les comportements clés (routes client, composition et persistance des certifications, profil/ikigai, simulateurs, journal de décision) restent couverts ; les contenus `upcoming` restent exclus du sitemap et du prérendu.

## En cas de besoin d'annulation

Tant que l'étape 5 (`git push`) n'a pas été lancée, la sauvegarde distante n'a pas changé. Après le push, préférer `git revert`, qui conserve l'historique ; éviter toute réécriture forcée de `master`.
