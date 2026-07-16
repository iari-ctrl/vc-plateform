# ÉTAT — vc-platform

Instantané court et remplaçable de l'état vérifié du dépôt. Réécrit à chaque passe ; ne pas y accumuler d'historique (celui-ci vit dans `JOURNAL.md`). Les compteurs sont collés depuis la sortie de `npm run validate:content` — ne pas les recopier ailleurs.

Dernière passe : 2026-07-16. Architecture : application **100 % statique, locale et FR-only** (SPA React/Vite, routes non localisées, contenu JSON bundlé, données utilisateur en `localStorage`). Aucun backend, aucune API, aucune base, aucun espace admin ni enveloppe de localisation dormante. Les politiques de parcours sont documentées dans `docs/parcours/README.md`; la calibration temporelle réellement consommée vit dans `data/profileParcours.json`. Le splash reste canonique sur `/`. La Formation réunit les parcours sous `/parcours`, les rayons documentaires sous `/bibliotheque` et le catalogue certifiant sous `/certifications`. Le tronc commun de la certification interne Analyst en capital-risque est publié dans son intégralité : 9 cours et 35 leçons. Sa composition facultative et sa progression sont conservées localement, mais aucun état certifié ne peut être produit par la seule complétion locale.

## Compteurs de contenu

Récapitulatif du dernier `npm run validate:content:strict` (2026-07-16) :

| Collection | Volume |
| --- | ---: |
| Parcours (`parcours.json`) | 22 |
| Domaines (`domains.json`) | 2 |
| Certifications (`certifications.json`) | 1 publiée |
| Rayons de la Bibliothèque (`paths.json`) | 9 |
| Cours (`courses.json`) | 21 |
| Leçons indexées | 108 (80 disponibles : 69 canoniques + 11 drop-in ; 28 `upcoming`, toutes optionnelles) |
| Termes de glossaire (`glossary.json`) | 381 |
| Registre canonique (`sources/canonical-glossary.json`) | 443 |
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
- `npm run validate:content:strict` : exit 0 ; 22 parcours, 1 certification, 9 rayons, 21 cours, 108 leçons et 410 marqueurs contrôlés.
- `npm run validate:glossary` : exit 0, 381 termes, slugs uniques, `id === slug`, liens et aliases résolus.
- `npm ls --depth=0` : arbre de dépendances directes cohérent ; le lockfile ne contient plus l'ancien paquet `server`.
- `npm run lint` : exit 0, 0 erreur, 0 warning (`--max-warnings=0`).
- `npm run typecheck` : exit 0.
- `npm run test` : 16 fichiers / 98 tests Vitest + 4 tests Node. Les tests couvrent les 160 compositions, l'ordre exact des 35 leçons communes, les métadonnées, les prérequis, les durées, les sections, les références et les 140 questions de quiz.
- `npm run generate:sitemap` : exit 0 ; 600 routes canoniques non localisées. Flatland et les 28 leçons optionnelles `upcoming` sont exclus.
- Build client : exit 0, 1 753 modules transformés ; prérendu de 600/600 routes terminé sur le build final. Le domaine canonique reste volontairement reporté au lot de remise en ligne.
- Contrôle des artefacts prérendus : fiche de certification et 35 pages de leçons présentes ; 9 cours, 140 questions de quiz, renvois au glossaire et liens de référence retrouvés ; compteur du tronc commun à 35 disponibles et 0 à venir ; aucune leçon commune marquée « à venir ». Chrome DevTools MCP a contrôlé la fiche et une leçon de chacun des 9 cours en bureau (1 440 × 1 000) et mobile (390 × 844), ainsi que la navigation fiche → leçon → leçon suivante, un terme de glossaire, un lien EUR-Lex et la validation commentée d'un quiz. Un débordement mobile lié au titre du lien « Suivant » a été corrigé dans `LessonPage` puis contrôlé de nouveau sur les 9 leçons : aucune erreur console, requête en échec, image cassée ni largeur excédentaire. Lighthouse atteint 100 en accessibilité, bonnes pratiques et SEO sur la fiche et la leçon contrôlées.
- Statut local-first : GitHub sert de sauvegarde du code. Un push sur `master` ne déploie rien ; `.github/workflows/deploy-pages.yml` est limité à `workflow_dispatch` et ne doit pas être lancé avant une décision explicite de remise en ligne. Les contrôles restent locaux (`Suivis/PROCEDURE_PUSH.md`).

## Risques

| Risque | Niveau | Commentaire |
| --- | --- | --- |
| Remise en ligne prématurée | Élevé | La publication est volontairement reportée jusqu'à stabilisation de la base locale, finalisation de la formation et consolidation d'Intelligence VC ; le workflow Pages ne doit être lancé que manuellement |
| Certification non délivrable de bout en bout | Élevé | Le référentiel, le configurateur et les règles sont en place ; le contrôle d'identité, les livrables, la soutenance, le jury et l'émission du certificat restent à opérationnaliser hors de la complétion locale |
| Contenu certifiant à produire | Élevé | Le tronc commun est complet. Les 28 leçons optionnelles restent `upcoming` ; elles n'entrent dans le dénominateur qu'après sélection de l'orientation correspondante et empêchent alors d'en achever la composition |
| Contenu général à consolider | Élevé | Couverture inégale des cours existants, 6 études de cas seulement dont 1 décisionnel, 8 milestones `a-produire` sans livrable |
| Données limitées à un navigateur | Moyen | Le stockage est fiable et observable, mais reste propre à l'appareil ; export/import et store versionné sont reportés |
| SEO / partage social à fiabiliser | Reporté | À traiter lors de la remise en ligne : domaine réel, `VITE_SITE_URL`, cartes OpenGraph, `canonical` et unfurlers |
| Clarté des rails contextuels | Faible | La navigation partagée en trois piliers et la séparation Parcours/Bibliothèque sont en place ; les libellés devront continuer d'être vérifiés à mesure que la formation s'enrichit |

Risques disparus avec la migration statique et le recentrage V1 FR (ne plus les traiter) : divergence CMS/JSON, recherche serveur incomplète, durcissement JWT/cookie/CSP côté serveur, choix du mode de rendu, routage bilingue `/fr` `/en`, traduction EN au lancement.

## Priorités

**P0 — Contenu certifiant et atelier éditorial.** Produire puis publier progressivement les 28 leçons optionnelles de la certification Analyst, le tronc commun de 35 leçons étant désormais complet, sans relâcher la charte institutionnelle. Continuer à densifier les deux parcours prioritaires (`levee-de-fonds-cote-entrepreneur`, `devenir-analyst-associate-principal`) et transformer les milestones `a-produire` en livrables (prochaine cible : mémo de deal seed).

**P1 — Délivrance de la certification.** Produire le cas final, les livrables et les supports de soutenance ; définir le contrôle d'identité, l'engagement d'intégrité, la validation experte et le registre d'émission. Conserver comme invariant qu'aucune complétion locale ne crée seule un état certifié.

**P2 — Cohérence et garde-fous.** Vérifier que chaque leçon mène à une suite (cas, simulateur, étape suivante), maintenir les statuts, les sources et les schémas, puis enrichir `validate:content` d'un score de complétude éditoriale. La CI de publication, `VITE_SITE_URL`, les vérifications de domaine et les unfurlers restent reportés au lot de remise en ligne.

À ne pas prioriser tant que l'atelier éditorial n'est pas fluide : nouveaux simulateurs complexes, nouvelles grandes surfaces produit, redesign global, traduction EN.
