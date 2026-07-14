# ÉTAT — vc-platform

Instantané court et remplaçable de l'état vérifié du dépôt. Réécrit à chaque passe ; ne pas y accumuler d'historique (celui-ci vit dans `JOURNAL.md`). Les compteurs sont collés depuis la sortie de `npm run validate:content` — ne pas les recopier ailleurs.

Dernière passe : 2026-07-14. Architecture : application **100 % statique, locale et FR-only** (SPA React/Vite, routes non localisées, contenu JSON bundlé, données utilisateur en `localStorage`). Aucun backend, aucune API, aucune base : le serveur Express/Prisma et les tests serveur ont été supprimés lors de la migration de juillet 2026. La persistance locale signale désormais ses échecs et ne met l'état React à jour qu'après une écriture réussie. Le routage `/fr` `/en`, le fichier `data/parcours.en.json` et l'ADR i18n ont été retirés du périmètre V1.

## Compteurs de contenu

Récapitulatif du dernier `npm run validate:content:strict` (2026-07-14) :

| Collection | Volume |
| --- | ---: |
| Parcours (`parcours.json`) | 22 |
| Rayons de la Bibliothèque (`paths.json`) | 9 |
| Cours (`courses.json`) | 16 |
| Leçons servables | 66 (55 canoniques + 11 drop-in) |
| Termes de glossaire (`glossary.json`) | 374 |
| Registre canonique (`sources/canonical-glossary.json`) | 436 |
| Études de cas (`caseStudies.json`) | 6 |
| Livrables (`deliverables.json`) | 2 en ligne, 8 milestones `a-produire` restants |
| Analyses / blog (`data/blog/*.json`) | 7 publiées + 1 brouillon |
| Dossiers d'écosystème (`ecosystems.json`) | 31 (3 racines + 28 sous-dossiers) |
| Convictions (dérivées des dossiers) | 24 |
| Mémos annotés (`memos.json`) | 5 |
| Anti-portfolio (`antiPortfolio.json`) | 9 entrées + 5 motifs |
| Simulateurs (`simulators.json`) | 9 |

## Dernières vérifications

Contrôles consignés (voir `JOURNAL.md` pour les commandes datées) :

- `npm run validate:content` : exit 0.
- `npm run validate:content:strict` : exit 0.
- `npm run validate:glossary` : exit 0, 374 termes, slugs uniques, `id === slug`, liens et aliases résolus.
- `npm ci` : exit 0 depuis le lockfile ; `zod@3.25.76` est déclaré à la racine.
- `npm run lint` : exit 0, 0 erreur, 0 warning (`--max-warnings=0`).
- `npm run typecheck` : exit 0.
- `npm run test` : 12 fichiers / 67 tests Vitest + 1 test Node.
- `npm run generate:sitemap` : exit 0 ; 572 routes canoniques non localisées, Flatland exclu.
- `npm run build` : exit 0 ; build client (1 745 modules) puis prérendu de 572/572 routes. Le domaine canonique reste volontairement reporté au lot de remise en ligne.
- Statut local-first : GitHub sert de sauvegarde du code. Un push sur `master` ne déploie rien ; `.github/workflows/deploy-pages.yml` est limité à `workflow_dispatch` et ne doit pas être lancé avant une décision explicite de remise en ligne. Les contrôles restent locaux (`Suivis/PROCEDURE_PUSH.md`).

## Risques

| Risque | Niveau | Commentaire |
| --- | --- | --- |
| Remise en ligne prématurée | Élevé | La publication est volontairement reportée jusqu'à stabilisation de la base locale, finalisation de la formation et consolidation d'Intelligence VC ; le workflow Pages ne doit être lancé que manuellement |
| Contenu à consolider | Élevé | Couverture inégale des cours (plusieurs à 2 leçons), 6 études de cas seulement dont 1 décisionnel, 8 milestones `a-produire` sans livrable |
| Données limitées à un navigateur | Moyen | Le stockage est fiable et observable, mais reste propre à l'appareil ; export/import et store versionné sont reportés |
| SEO / partage social à fiabiliser | Reporté | À traiter lors de la remise en ligne : domaine réel, `VITE_SITE_URL`, cartes OpenGraph, `canonical` et unfurlers |
| Vitrine héritée de la formation | Faible à moyen | La nav publique est passée en trois piliers ; reste à vérifier les premières impressions et les rails contextuels |

Risques disparus avec la migration statique et le recentrage V1 FR (ne plus les traiter) : divergence CMS/JSON, recherche serveur incomplète, durcissement JWT/cookie/CSP côté serveur, choix du mode de rendu, routage bilingue `/fr` `/en`, traduction EN au lancement.

## Priorités

**P0 — Atelier éditorial.** Appliquer la charte de style transverse à toute production (registre d'analyste sobre, sans tic d'IA ni survente ; source : `.claude/skills/ecosystemes/SKILL.md`, résumé dans `docs/ARCHITECTURE_EDITION.md` §4.0.c). Densifier les deux parcours prioritaires (`levee-de-fonds-cote-entrepreneur`, `devenir-analyst-associate-principal`). Viser 4 à 6 leçons par cours sur les zones prioritaires. Transformer les milestones `a-produire` en livrables (prochaine cible : mémo de deal seed).

**P1 — Cohérence d'apprentissage.** Vérifier que chaque leçon mène à une suite (cas, simulateur, étape suivante) ; relier leçons, glossaire, cas et simulateurs. Ajouter un sommaire automatique aux leçons longues. La CI de publication, `VITE_SITE_URL`, les vérifications de domaine et les unfurlers sont reportés au lot de remise en ligne.

**P2 — Garde-fous éditoriaux.** Maintenir les statuts brouillon/publié, la vérification des sources et les schémas `memos` / `antiPortfolio`. Enrichir ensuite `validate:content` d'un score de complétude éditoriale.

À ne pas prioriser tant que l'atelier éditorial n'est pas fluide : nouveaux simulateurs complexes, nouvelles grandes surfaces produit, redesign global, traduction EN.
