# JOURNAL — vc-platform

Entrées datées, append-only, **postérieures à la migration statique de juillet 2026**. Une entrée = date, objet, commandes lancées, résultats, fichiers touchés. Les compteurs courants ne vivent pas ici mais dans `ETAT.md`.

Le journal des travaux antérieurs à la migration (passes du 2026-05-30 au 2026-06-28 : portail splash, atlas navigable, glossaire, écosystèmes, IA en trois piliers, prérendu statique) reste consultable dans l'historique Git.

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
