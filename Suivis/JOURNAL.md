# JOURNAL — vc-platform

Entrées datées, append-only, **postérieures à la migration statique de juillet 2026**. Une entrée = date, objet, commandes lancées, résultats, fichiers touchés. Les compteurs courants ne vivent pas ici mais dans `ETAT.md`.

Le journal des travaux antérieurs à la migration (passes du 2026-05-30 au 2026-06-28 : portail splash, atlas navigable, glossaire, écosystèmes, IA en trois piliers, prérendu statique) reste consultable dans l'historique Git.

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
