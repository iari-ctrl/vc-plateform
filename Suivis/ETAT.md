# ÉTAT — vc-platform

Instantané courant et remplaçable de l’état vérifié du dépôt. Le détail historique vit dans `Suivis/JOURNAL.md`; ne pas recopier ici les récits de sessions ni les longues listes de commandes.

## État actuel vérifié

Dernière passe documentaire : 2026-09-23, réconciliation des instructions agents et des autorités Formation F0/S0. `AGENTS.md` et `CLAUDE.md` sont corrigés après renouvellement de l’autorisation d’écriture. Le manuel d’architecture, le contrat Parcours et le plan distinguent l’implémentation actuelle de la cible ; les anciens compteurs restent historiques. `PRODUCT.md` a été relu et reste inchangé. Aucun comportement applicatif modifié ni nouvelle qualification de publication.

Dernière livraison d’outillage : 2026-09-23, diagnostic Formation F0/S0 et tests. `npm run validate:formation` produit un rapport humain ; `npm run validate:formation -- --json` expose les constats détaillés. Aucun raccordement du diagnostic au gate `check`, aucune migration ni modification du rendu applicatif.

Dernière passe applicative vérifiée : 2026-09-10, premier lot d’intégrité des données locales. Voir [l’inventaire et la recette](RECETTE-DONNEES-LOCALES.md).

Statut local : le worktree fortement modifié par les lots antérieurs reste préservé. La passe S0 ajoute seulement `scripts/formation-readiness.mjs`, son test, une commande dans `package.json` et les deux suivis. Les sources applicatives, données, artefacts générés et autorités documentaires préparées auparavant restent inchangés. Aucun staging, commit, push, workflow distant ni déploiement.

Statut publication : GitHub Pages demeure dormant. Le dernier contrat connu utilise `VITE_BASE_URL=/vc-plateform/` et `VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform`. La validation locale de ce lot ne constitue pas une qualification publique multi-navigateur.

Dernière livraison applicative vérifiée : 71 fichiers / 509 tests client, 30 tests Node du simulateur, typecheck et lint verts. Recette Chrome for Testing 151.0.7922.71 isolée : 100 notes, quota natif saturé, restauration, récupération après rechargement, téléchargements identiques et états visibles vérifiés. Le build canonique et la suite Node complète n’ont pas été relancés ; le timeout historique du test transversal de prérendu partagé reste non résolu.

## Compteurs courants

Inventaire confirmé par `npm run validate:content:strict` le 2026-09-23 ; projections contrôlées par `check:generated`, convictions comptées séparément dans les dossiers d’écosystème :

| Surface | État |
| --- | ---: |
| Parcours | 24 |
| Relations cartographiques auditées | 19 |
| Certifications | 1 professionnelle en construction |
| Niveaux de certification | 5 |
| Chartes candidat | 1 active |
| Évaluations de certification | 0 |
| Cours | 30 |
| Leçons indexées | 147 |
| Corps de leçons publiés générés | 126 |
| Leçons de parcours drop-in | 23 |
| Registres de leçons | 5 |
| Termes de glossaire publiés | 420 |
| Études de cas | 10 |
| Corrections commentées | 3, hors sitemap public ; artefacts `noindex` |
| Diagnostics | 1, facultatif et sans score |
| Livrables | 12 |
| Articles / analyses | 8 |
| Dossiers d’écosystème | 31 |
| Convictions dérivées | 24 |
| Mémos annotés | 5 |
| Anti-portfolio | 9 entrées + 5 motifs |
| Simulateurs | 10 |
| Marqueurs `[[...]]` / `{{...}}` analysés | 373 |

`npm run check:generated` confirme les quatre sorties dérivées sans écriture : 147 leçons, 126 corps publiés et 420 termes de glossaire. `npm run check:memo` confirme séparément les trois HTML du simulateur.

<a id="consolidation-formation"></a>

## Consolidation Formation — diagnostic F0/S0 livré

**Diagnostic F0/S0 implémenté et vérifié le 2026-09-23.** `scripts/formation-readiness.mjs` lit les sources canoniques et les leçons drop-in sans écriture ni dépendance aux splits générés. Sa suite `scripts/formation-readiness.test.mjs` couvre les huit familles de fixtures du lot. La commande `validate:formation` reste séparée de `check` : exit 0 signifie « rapport produit », pas « Formation validée » ; entrée inexploitable et arguments invalides restent des échecs. Aucun lot ultérieur du [plan actif](../.hermes/plans/2026-07-31_191055-consolidation-formation.md) n’est implémenté par cette livraison.

Relevé recalculé par le diagnostic, recoupé avec un contrôleur indépendant le 2026-09-23 :

- 24 parcours, 30 cours, 147 leçons, dont 126 publiées. Aucune référence d’étape absente ni étape pointant vers une leçon non publiée.
- 5 étapes `a-produire` : 2 de type `pratique` (`todo-ecrire-memo`, `todo-mini-case-express`) et 3 facultatives (`todo-cafe-reseau`, `todo-pourquoi-ce-fonds`, `todo-process-levee`). L’ancienne entrée `todo-myth-vc-mise` n’est plus un placeholder à produire.
- 7 parcours avec une sortie résolue, 17 sans : étape requise `existant`, de type `milestone` résolue en livrable ou leçon, ou référence `deliverable` de type `capstone`. Le diagnostic d’entrée est exclu ; aucune obligation de livrable n’est inférée.
- 28 écarts distincts de prérequis dans 15 parcours : 27 dans la séquence complète et 21 dans la séquence requise, avec recouvrement. Un écart désigne un couple leçon/prérequis par parcours à sa première consommation. Seules les leçons publiées sont consommées, par ordre d’étape puis `lesson.order` dans les cours ; un bonus ne satisfait pas implicitement la séquence requise. Les prérequis d’entrée en texte libre ne valent pas déclaration par identifiant.
- 4 parcours à durée dérivée : `p-decouvrir-vc`, `p-entretien-analyst`, `p-serie-a`, `p-venture-philanthropy-foundations`. Les 20 autres restent déclarés, sans audit de leur justification. Deux couvertures dérivées sont incomplètes : estimation de travail absente pour `cs-europe-vs-valley` et `cs-vp-insertion-3-regions` ; contribution du livrable `vp-fiche-escalade-juridique` ignorée par le calcul actuel. Aucun temps n’est inventé ni total corrigé.
- Aucun cours vide, 3 cours partiellement publiés. Les fixtures vides et partielles restent présentes ; ces nombres ne qualifient pas la disponibilité des parcours.

**Contrats encore ouverts :** le rapport sépare intégrité, métadonnées absentes et arbitrages pédagogiques. Publication des conteneurs, disponibilité, complétion et prérequis d’entrée restent à décider en S1 ; l’adaptateur de déclarations sert uniquement aux scénarios de tests, sans nouveau champ canonique. Ni `roadmap` ni `steps[].status` ne prouvent l’exécutabilité. La revue praticien reste distincte de ce contrôle technique.

**Suite sur demande :** S1, arbitrage en lecture seule des contrats de publication, disponibilité et complétion à partir de ce diagnostic. Ne pas migrer les données, corriger les prérequis ou produire les placeholders avant les décisions des lots correspondants. La réconciliation documentaire préalable reste close ; le plan et sa baseline historique ne sont pas réécrits.

## Dernières vérifications

### Diagnostic Formation F0/S0 — 2026-09-23

- `node --test scripts/formation-readiness.test.mjs` : 18/18 tests ; `node --test scripts/validation-core.test.mjs` : 15/15. Les premiers RED sont conservés hors dépôt, y compris celui du rendu humain corrigé après contre-revue.
- `npm run validate:formation`, son équivalent JSON, `npm run validate:content:strict`, `npm run lint:node`, `npm run check:generated` et `npm run check:memo` : exit 0 après la correction finale.
- `npm run test --workspace client -- src/content/parcours.test.ts src/content/serieAParcours.test.ts src/content/lessons.test.ts` : 3 fichiers / 27 tests réussis, sans modification du client.
- Contrôleur indépendant : mêmes références, séquences consommées, sorties et écarts de prérequis que le rapport ; sortie déterministe même depuis un autre répertoire. Empreintes avant/après : aucune écriture par le diagnostic ou les contrôles ; `package.json` ne diffère de la copie initiale que par `validate:formation`.
- Contre-revue indépendante : aucun défaut logique ou de sécurité bloquant ; les deux remarques mineures sur le type de référence dans le rendu humain et l’ordre de l’inventaire des cours sont traitées, avec une régression CLI dédiée. Aucun gate global, build, navigateur ou qualification métier relancé.

### Documentation et inventaire — passe antérieure à S0 du 2026-09-23

- `npm run check:generated`, `npm run check:memo`, `npm run validate:content:strict` et `npm run validate:glossary` : exit 0, sans génération.
- Avant S0 : absence des fichiers/commande F0, placeholders, durées déclarées/dérivées et cours sans leçon publiée relevés directement dans les manifests et données sources, sans création du gate.
- Liens Markdown locaux, ancres, chemins complets et commandes npm : contrôle automatisé `check_docs.py` sans erreur, avec les deux fichiers et la commande F0 explicitement classés comme futurs. `git diff --check` ciblé : exit 0.
- Contre-revue indépendante du diff cumulé des deux passes : aucune perte d’information nécessaire identifiée. L’omission du manifeste npm et des suivis dans le tableau S0 a été recoupée, corrigée et contrôlée après revue.
- Comparaisons avec les copies avant session : définition de consolidation, fixtures F0, baseline historique, charte éditoriale et règles d’exécution préservées ; `PRODUCT.md` et preuves applicatives historiques inchangés ; journal antérieur conservé octet pour octet.
- `node --test shared/base-url.test.mjs` : exit 0, 6 tests purs d’URL/base et de manifeste web. Ce contrôle ciblé confirme la correction de l’instruction origine/base.
- Aucun gate global, build ni navigateur relancé : ces contrôles documentaires et tests purs ne renouvellent pas la qualification applicative ci-dessous.

### Application — 2026-09-10

Contrôles exécutés pendant le lot du 2026-09-10 :

- `npm run test --workspace client` : exit 0, 71 fichiers / 509 tests. Les cas du cycle de vie couvrent pannes d’import/restauration, quota calculé, lecture impossible, données brutes, versions, archives, clés étrangères et confirmations DOM.
- `npm run typecheck` et `npm run lint` : exit 0.
- `node --test scripts/investment-memo.test.mjs` : exit 0, 30 tests.
- `node scripts/local-data-lifecycle.browser.mjs` avec Chrome for Testing 151.0.7922.71 explicite : exit 0. Le stockage natif est rempli avec 100 notes de 18 000 caractères et 3 435 286 caractères dans une clé étrangère synthétique. Import qui tient dans le quota : succès ; dépassement : restauration exacte ; panne persistante : copie conservée après rechargement. Les téléchargements original/récupération sont comparés octet pour octet. Aucun débordement à 390 px ni erreur JavaScript.
- `npm run check:generated` : exit 0, sorties dérivées à jour sans écriture ; `npm run check:memo` : exit 0, 3 artefacts vérifiés sans écriture.
- `git diff --check` : exit 0. Premiers RED complets et logs des contrôles dans `/tmp/vc-local-data-integrity/`. Recette et limites maintenues dans [RECETTE-DONNEES-LOCALES.md](RECETTE-DONNEES-LOCALES.md).

Échecs classés : les premiers RED concernent les défauts confirmés de ce lot. Les erreurs de fixtures, de types et de lint introduites pendant son exécution sont corrigées. Un délai dépassé du test non modifié `onboardingAndIkigai.dom.test.tsx` est apparu pendant une passe complète ; la reprise isolée (4 tests) puis la passe complète suivante sont vertes. Sa cause n’est pas établie. Le timeout historique de `scripts/prerender.integration.test.mjs`, connu avant ce lot, n’a pas été retesté.

Limites : Safari, Firefox, lecteurs d’écran, appareils physiques et dialogue système de fichier restent à qualifier. Les conflits entre brouillons de plusieurs onglets restent hors lot. Une interruption brutale peut nécessiter une récupération manuelle depuis la copie persistée ; il n’y a pas de restauration automatique au démarrage. Le dernier build canonique demeure celui du 2026-09-05.

## Décisions et invariants maintenus

- `AGENTS.md` reste le point d’entrée portable ; `.hermes.md` ne doit pas être créé.
- `CLAUDE.md` reste le contrat détaillé partagé entre Hermes, Codex, Claude Code et les autres agents. Les hooks `.claude/` restent propres à Claude Code.
- Les sources propriétaires sont les fichiers de code, configuration, scripts et données sources ; `data/generated/` reste strictement dérivé.
- `PRODUCT.md` porte les principes produit et la marque visible Maison Sapience VC. Les anciennes mentions `VC Premium Experience` relèvent d’héritages à migrer seulement sur décision dédiée.
- `docs/ARCHITECTURE_EDITION.md` §4.0.c reste la charte éditoriale transverse détaillée. `CLAUDE.md` et `AGENTS.md` n’en gardent qu’un rappel opérationnel.
- Path et Parcours désignent la même trajectoire de formation ordonnée par objectif ; la Bibliothèque reste un inventaire filtrable, sans modèle de rayon autonome.
- L’accueil met en avant Formation et Intelligence VC ; l’espace personnel/Workspace reste secondaire tant que son socle n’est pas explicitement rouvert.
- L’architecture reste statique et local-first. `localStorage` n’est pas un stockage confidentiel et ne crée pas de synchronisation multi-appareil.
- La publication reste manuelle et dormante ; un push n’est pas une release.
- Le simulateur de note est maintenu dans `nouveau simu/src/`. `npm run build:memo` produit ses trois HTML ; aucun de ces artefacts ne doit être édité à la main.
- Les archives, plans locaux et anciennes entrées de journal conservent une valeur historique, mais ne remplacent pas les autorités maintenues.
- Les seuls plans locaux actifs sont `.hermes/plans/2026-07-23_100955-relecture-praticien-parcours-p0.md` et `.hermes/plans/2026-07-31_191055-consolidation-formation.md`. Tout autre plan ou revue datée déplacé sous `docs/archive/` est non normatif.

## Décisions non tranchées

| Sujet | Statut | Prochaine preuve attendue |
| --- | --- | --- |
| Remise en ligne | Non ouverte | Décision explicite de publication, vérification du domaine, headers réels, build canonique et recette publique. |
| Domaine et marque héritée | Partiellement clarifié | Maison Sapience VC est la marque visible ; une migration complète des anciennes mentions `VC Premium Experience` exige un lot dédié. |
| Backend et espace personnel | Non ouvert | Le produit reste statique et local-first ; aucun backend ni compte utilisateur n’est engagé dans l’état courant. |
| Certification professionnelle | Non délivrable | Gouvernance, identité, preuves, soutenance, jury, registre humain et validation métier restent à définir avant tout titre professionnel. |
| Taxonomie cible Phase 3 | Documentaire | Les champs cible restent à migrer collection par collection avec types, schémas, validations et surfaces UI. |
| Routes fonctionnelles non indexables | Partiel | Les corrections de cas commentées et redirections historiques sont couvertes ; les autres familles `noindex` demandent un arbitrage d’accès direct. |
| Traçabilité source étendue | En cours | Les entrées héritées doivent être relues avant tout reclassement `source-backed`; une URL valide ne suffit pas. |
| Performance des corps de leçons | À planifier | Le chunk `lessons.bodies` doit être redécoupé seulement dans un lot performance mesuré. |
| Dette supply-chain dev | À planifier | L’avis transitoire de l’outillage doit être traité sans correction automatique du lockfile hors périmètre. |

## Fichiers d’autorité à charger de manière ciblée

- Routine agent : `AGENTS.md` puis `CLAUDE.md`.
- Principe produit ou marque : `PRODUCT.md`.
- Charte éditoriale et cycle de vie du contenu : `docs/ARCHITECTURE_EDITION.md`, surtout §4.0.c et la section de la collection concernée.
- Design visuel ou responsive : `docs/DESIGN_SYSTEM.md`.
- Parcours : `docs/parcours/README.md`, puis document spécialisé du parcours si présent.
- Certifications : `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md` et documents de référentiel concernés.
- État courant : ce fichier.
- Plans locaux actifs : `.hermes/plans/2026-07-23_100955-relecture-praticien-parcours-p0.md` pour la revue praticien P0 et `.hermes/plans/2026-07-31_191055-consolidation-formation.md` pour la consolidation Formation. Aucun autre fichier de `.hermes/plans/` ne doit être chargé comme instruction courante.
- Preuve datée : rechercher dans `Suivis/JOURNAL.md` par date, titre, chemin ou commande ; ne pas charger tout le journal.

## Risques ouverts

| Risque | Niveau | État courant |
| --- | --- | --- |
| Chrome d’accueil public obsolète | Élevé jusqu’à redéploiement | Le build local corrige `/home` et `/home/`, mais Pages peut encore servir l’ancien bundle tant que la publication n’est pas relancée manuellement. |
| Remise en ligne | Reporté | Domaine, hébergement, workflow Pages, unfurlers et publication réelle restent hors plan local. |
| Certification professionnelle | Élevé | `VC Analyst` reste non délivrable : identité, preuves, soutenance, jury et registre humain ne sont pas opérationnels. |
| Production Analyst | Élevé | Des leçons recommandées existent, mais le fonds de référence, la bible de cas et la mission M1 restent à produire dans un protocole dédié. |
| Relecture praticien des parcours | Moyen | Les dossiers de revue existent ; aucun praticien VC, venture philanthropy, finance/comptabilité, juridique ou safeguarding n’a encore qualifié les hypothèses sensibles. |
| Calibration des parcours | Moyen | Certains budgets et durées restent incohérents ou à confirmer, notamment Analyst Foundations et Trait d’Union. |
| Contenu général | Élevé | La couverture des cours et axes reste inégale malgré les cas, livrables et leçons publiés. |
| Traçabilité éditoriale | Moyen | Une part héritée du glossaire reste classée par provenance locale plutôt que soutenue par source externe ; les revues différées restent ouvertes. |
| Données locales | Moyen | Export/import et purge existent, mais les états restent propres à l’appareil ; le conflit multi-onglets reste limité. |
| Routes fonctionnelles `noindex` | Partiellement traité | Routes publiques, redirections historiques et corrections de cas commentées sont couvertes ; d’autres routes fonctionnelles exigeraient une décision dédiée pour accès direct statique. |
| En-têtes d’hébergement | Bloquant avant publication | CSP, `Referrer-Policy`, `X-Content-Type-Options` et `Permissions-Policy` sont documentés mais non vérifiés sur un hôte réel. |
| Dépendance transitive d’outillage | Moyen supply-chain | L’audit production est propre ; l’avis dev `brace-expansion` reste à traiter sans correction automatisée hors périmètre. |
| Variabilité du prérendu | Moyen build | Le mode strict a déjà bloqué des artefacts incomplets ; toute récidive doit être diagnostiquée et non masquée. |
| Chunk de leçons volumineux | Moyen performance | `lessons.bodies` croît avec les publications ; un découpage plus fin reste un chantier séparé. |
| Qualification finale du simulateur de note | Moyen livraison | Les contrôles ciblés sont verts. Le build canonique, la suite globale et la recette Chromium doivent encore être repris sur l’état courant avant sauvegarde ou publication. |

Risques clos à ne plus traiter comme actifs : divergence CMS/JSON, recherche serveur incomplète, durcissement JWT/cookie côté serveur, choix du mode de rendu, routage bilingue `/fr`/`/en`, traduction EN au lancement, fragment Markdown de l’archive Analyst.

## Priorités ordonnées

Pour la consolidation Formation, **F0/S0 est livré comme diagnostic uniquement**. La prochaine étape est l’arbitrage S1 en lecture seule, sur demande ; les priorités de fond suivantes restent distinctes.

1. **P0 — Relecture praticien.** Faire qualifier les parcours sensibles avant toute modification canonique : réalisme des formats d’entretien, charge de travail, hypothèses financières, décisions alternatives, critères de revue et limites d’escalade.
2. **P1 — Production Analyst coordonnée.** Ouvrir seulement sur plan explicite : choisir le fonds de référence, produire le squelette et le registre de preuves, construire M1, puis contrôler par blocs.
3. **P2 — Clôture technique avant sauvegarde ou publication.** Reprendre la suite globale, le build canonique et la recette Chromium du simulateur sur l’état courant ; traiter ou classer le timeout du prérendu partagé.
4. **P3 — Dette documentaire et performance.** Continuer à garder `ETAT.md` compact, déplacer l’historique vers le journal, et traiter séparément le chunk de leçons et la dette supply-chain.

À ne pas prioriser tant que l’atelier éditorial n’est pas fluide : nouveaux simulateurs complexes supplémentaires, grandes surfaces produit, redesign global, traduction EN.

## Prochaine session recommandée

Sur demande, ouvrir S1 pour décider publication, disponibilité et complétion à partir de `npm run validate:formation -- --json`, sans modifier les données ni les sélecteurs publics. Lire les autorités et le lot correspondant de manière ciblée, pas tout le manuel ni tout le journal. Avant une sauvegarde ou remise en ligne ultérieure, reprendre séparément le gate global, le build canonique et la recette Chromium du simulateur sur l’état courant.
