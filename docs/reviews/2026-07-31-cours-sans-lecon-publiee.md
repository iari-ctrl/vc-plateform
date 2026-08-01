# Cours listés sans leçon publiée — constat et options

> Audit en lecture seule de l'état du worktree local au 31 juillet 2026. Aucun fichier applicatif, éditorial ou de suivi n'a été modifié. Les figures ci-dessous proviennent d'une lecture directe des sources citées, non d'une exécution de `npm run validate:content`.

## Constat

Trois cours de `data/courses.json` portent les axes optionnels de la certification `VC Analyst`. Leurs 28 leçons ne comptent qu'une seule entrée `status: "published"`.

| Cours | Leçons déclarées | Leçons publiées | `durationMin` déclaré |
| --- | ---: | ---: | ---: |
| `c-analyst-stage` | 8 | 0 | 0 |
| `c-analyst-deal-role` | 6 | 0 | 0 |
| `c-analyst-specialties` | 14 | 1 | 17 |

La leçon publiée est `l-specialty-deeptech-trl-ip` (`data/lessons.json:6186`, `readMin: 9`). Les 27 autres portent `status: "upcoming"`. Aucune des 14 options d'axe de `data/certifications.json` — 4 stades, 3 rôles, 7 spécialités, chacune exigeant deux leçons — ne dispose donc de son programme complet.

`client/src/pages/learn/LibraryPage.tsx:233` construit les cartes de cours depuis `COURSES` sans filtre de publication, alors que la ligne 235 filtre les leçons sur `status === 'published'`. Les deux traitements divergent : la Bibliothèque expose l'inventaire réel des leçons et l'inventaire déclaré des cours.

Trois conséquences observables en découlent.

**Deux cartes annoncent une durée nulle.** `courseReadingMinutes` (`client/src/content/learningTime.ts:19-22`) renvoie `course.durationMin` lorsque `durationSource` n'est pas `lesson-read-minutes`. Ce champ est absent des trois cours ; les cartes de `c-analyst-stage` et `c-analyst-deal-role` affichent « 0 min ». Celle de `c-analyst-specialties` affiche 17 min alors que 9 minutes de leçon sont réellement lisibles.

**Ces cartes portent un badge de certification.** `certificationsForCourse(...)` est filtré sur `status === 'published'` (`LibraryPage.tsx:94`). L'entrée `cert-analyst-vc` porte `status: "published"` et `availability: "in-construction"` (`data/certifications.json:9-10`). Les deux cours sans contenu affichent donc la mention « VC Analyst » à côté d'une durée nulle. Chaque champ est exact pris isolément ; leur juxtaposition ne l'est pas.

**Le compteur d'inventaire est supérieur d'un cran à la matière disponible.** `LibraryPage.tsx:380` annonce 30 cours ; 28 comportent au moins une leçon publiée.

Les deux routes concernées sont présentes dans le sitemap versionné (`client/public/sitemap.xml:181` et `:316`) et sont donc prérendues et déclarées indexables.

## Ce qui n'est pas en cause

Le rendu des leçons est correct. `LessonRow` (`client/src/components/cards.tsx:101-128`) rend une entrée `upcoming` non cliquable, opacifiée, marquée d'une puce « à venir », et masque sa durée. Sur `/courses/:slug`, la garde de `CourseDetailPage.tsx:143` supprime bien le bouton « Commencer le cours » quand aucune leçon n'est publiée. Le défaut se situe au niveau du cadrage du cours — en-tête et carte —, pas au niveau du détail de son programme : l'en-tête annonce « 8 leçons » et « 0 min de lecture » (`CourseDetailPage.tsx:64-65`) sans indiquer qu'aucune n'est lisible.

La présence même de ces trois cours n'est pas en cause non plus. Ils constituent les axes de personnalisation du référentiel `VC Analyst` décrit dans `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md` ; les retirer de `data/courses.json` romprait les 14 `requirement.courseId` de `data/certifications.json`.

## Périmètre d'une correction

Une correction de présentation reste bornée au client et ne touche ni les sources éditoriales ni la politique de routes :

- `client/src/pages/learn/LibraryPage.tsx` — condition de listage des cours et compteur associé ;
- `client/src/pages/learn/CourseDetailPage.tsx` — état explicite lorsque `publishedLessons` est vide ;
- `client/src/pages/learn/LibraryPage.test.tsx` — contrat de comptage à étendre ;
- `client/src/content/lessons.test.ts` et `scripts/generated-content.test.mjs` — gardes d'inventaire à vérifier, sans les contourner.

Une correction qui retirerait aussi les deux routes du sitemap sortirait de ce périmètre : elle toucherait `shared/routes.mjs`, `scripts/collect-routes.mjs`, le sitemap versionné et le décompte du prérendu strict, aujourd'hui à 706/706.

## Options

**A — Masquer de l'inventaire et expliciter l'état.** La Bibliothèque ne liste que les cours ayant au moins une leçon publiée ; les deux pages de cours affichent un état « programme à venir » au lieu d'un en-tête à 0 min. Coût faible, effet immédiat, réversible dès la première leçon publiée. Les deux routes restent accessibles et indexables : le contenu affiché devient explicite, mais reste mince pour un moteur de recherche.

**B — Masquer seulement.** Même filtre de Bibliothèque, sans toucher aux pages de cours. Coût minimal ; l'en-tête à 0 min subsiste pour qui arrive par URL directe ou par la page de certification.

**C — Produire un bloc.** Écrire les 6 leçons `l-role-*` de `c-analyst-deal-role`, bloc le plus petit et le plus autonome des trois. Chantier éditorial complet : sources France/Europe datées, rédaction, quiz, entrées de glossaire, régénération des fichiers dérivés, validation praticienne. Résout le fond pour un axe sur trois ; laisse `c-analyst-stage` et 13 leçons de spécialité dans le même état.

**D — Statu quo assumé.** Documenter l'écart et n'agir qu'au moment où le chantier de production Analyst est explicitement ouvert (`Suivis/ETAT.md`, priorité P1). Aucun coût immédiat ; l'inventaire continue d'annoncer deux cours vides.

## À décider

Le choix entre A, B, C et D relève d'un arbitrage produit, pas d'une contrainte technique. Une question reste ouverte quel que soit l'arbitrage retenu : les routes `/courses/analyse-selon-stade-investissement` et `/courses/role-fonds-dans-tour-investissement` doivent-elles rester indexables tant qu'elles n'exposent aucune leçon lisible. Cette question relève de la politique de routes centralisée dans `shared/routes.mjs` et mérite d'être traitée séparément.
