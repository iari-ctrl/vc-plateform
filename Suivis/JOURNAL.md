# JOURNAL — vc-platform

Entrées datées, append-only, **postérieures à la migration statique de juillet 2026**. Une entrée = date, objet, commandes lancées, résultats, fichiers touchés. Les compteurs courants ne vivent pas ici mais dans `ETAT.md`.

Le journal des travaux antérieurs à la migration (passes du 2026-05-30 au 2026-06-28 : portail splash, atlas navigable, glossaire, écosystèmes, IA en trois piliers, prérendu statique) reste consultable dans l'historique Git.

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
