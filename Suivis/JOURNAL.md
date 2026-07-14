# JOURNAL — vc-platform

Entrées datées, append-only, **postérieures à la migration statique de juillet 2026**. Une entrée = date, objet, commandes lancées, résultats, fichiers touchés. Les compteurs courants ne vivent pas ici mais dans `ETAT.md`.

Le journal des travaux antérieurs à la migration (passes du 2026-05-30 au 2026-06-28 : portail splash, atlas navigable, glossaire, écosystèmes, IA en trois piliers, prérendu statique) reste consultable dans l'historique Git.

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
