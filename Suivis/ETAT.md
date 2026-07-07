# ÉTAT — vc-platform

Instantané court et remplaçable de l'état vérifié du dépôt. Réécrit à chaque passe ; ne pas y accumuler d'historique (celui-ci vit dans `JOURNAL.md`). Les compteurs sont collés depuis la sortie de `npm run validate:content` — ne pas les recopier ailleurs.

Dernière passe : 2026-07-07. Architecture : application **100 % statique, locale et FR-only** (SPA React/Vite, routes non localisées, contenu JSON bundlé, données utilisateur en `localStorage`). Aucun backend, aucune API, aucune base : le serveur Express/Prisma et les tests serveur ont été supprimés lors de la migration de juillet 2026. Le routage `/fr` `/en`, le fichier `data/parcours.en.json` et l'ADR i18n ont été retirés du périmètre V1.

## Compteurs de contenu

Récapitulatif du dernier `npm run validate:content:strict` (2026-07-07) :

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
| Analyses / blog (`data/blog/*.json`) | 8 |
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
- `npm run lint` : exit 0, 0 erreur, 27 warnings (imports inutilisés + 3 warnings structurels `react-refresh/only-export-components`).
- `npx tsc -b --pretty false` depuis `client/` : exit 0.
- `npm run test --workspace client` : 9 fichiers / 52 tests.
- `npm run generate:sitemap` : exit 0 ; 573 routes canoniques non localisées, sans `hreflang` ni URLs `/fr` `/en`.
- `npm run build` : non relancé dans la passe du 2026-07-07 afin de ne pas recréer `client/dist` après nettoyage. À lancer juste avant publication via `Suivis/PROCEDURE_PUSH.md`.
- Déploiement : `.github/workflows/deploy-pages.yml` publie le frontend sur GitHub Pages à chaque push sur `master` (`split:content` + build client `--base=/vc-plateform/` + `VITE_API_DISABLED=true`, publication sur `gh-pages`). Ce workflow **ne fait ni validation, ni lint, ni tests** : ces contrôles se lancent en local avant publication (`Suivis/PROCEDURE_PUSH.md`).

## Risques

| Risque | Niveau | Commentaire |
| --- | --- | --- |
| Déploiement incomplet | Élevé | Le workflow GitHub Pages lance le build client workspace, pas le build racine complet : validation stricte, lint, tests, sitemap frais et prérendu racine restent à garantir en CI |
| Contenu à consolider | Élevé | Couverture inégale des cours (plusieurs à 2 leçons), 6 études de cas seulement dont 1 décisionnel, 8 milestones `a-produire` sans livrable |
| SEO / partage social à fiabiliser | Moyen | `shared/routes.mjs` est branché côté client pour `noindex` et OG par segment ; reste à valider sur le domaine réel les cartes OpenGraph par contenu, `canonical` et `VITE_SITE_URL` |
| Trou de validation `memos` / `antiPortfolio` | Moyen | Ces deux collections n'ont pas de schéma Zod dans `validate-content.mjs` ni d'entrée dans `MARKER_FILES` : un marqueur `[[..]]` cassé passe le build. Relecture manuelle nécessaire |
| Vitrine héritée de la formation | Faible à moyen | La nav publique est passée en trois piliers ; reste à vérifier les premières impressions et les rails contextuels |

Risques disparus avec la migration statique et le recentrage V1 FR (ne plus les traiter) : divergence CMS/JSON, recherche serveur incomplète, durcissement JWT/cookie/CSP côté serveur, choix du mode de rendu, routage bilingue `/fr` `/en`, traduction EN au lancement.

## Priorités

**P0 — Atelier éditorial.** Appliquer la charte de style transverse à toute production (registre d'analyste sobre, sans tic d'IA ni survente ; source : `.claude/skills/ecosystemes/SKILL.md`, résumé dans `docs/ARCHITECTURE_EDITION.md` §4.0.c). Densifier les deux parcours prioritaires (`levee-de-fonds-cote-entrepreneur`, `devenir-analyst-associate-principal`). Viser 4 à 6 leçons par cours sur les zones prioritaires. Transformer les milestones `a-produire` en livrables (prochaine cible : mémo de deal seed).

**P1 — Cohérence d'apprentissage et publication.** Vérifier que chaque leçon mène à une suite (cas, simulateur, étape suivante) ; relier leçons, glossaire, cas et simulateurs. Ajouter un sommaire automatique aux leçons longues. Fiabiliser la publication : workflow CI, build racine, `VITE_SITE_URL`, `canonical`/OG par contenu, pages prioritaires, vérification des unfurlers.

**P2 — Garde-fous.** Ajouter les schémas Zod manquants pour `memos.json` et `antiPortfolio.json` (forme + scan de marqueurs). Enrichir `validate:content` d'un score de complétude éditoriale.

À ne pas prioriser tant que l'atelier éditorial n'est pas fluide : nouveaux simulateurs complexes, nouvelles grandes surfaces produit, redesign global, traduction EN.
