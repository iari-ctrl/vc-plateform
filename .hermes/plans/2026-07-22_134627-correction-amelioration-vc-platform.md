# Plan consolidé de correction locale de VC Platform — après S6

> **Statut au 22 juillet 2026 :** S1 à S6 sont closes dans le worktree courant. Le présent document remplace le découpage initial en dix-sept sessions par six sessions restantes, bornées et orientées vers la fiabilité locale.

**Objectif :** corriger les écarts locaux encore démontrés, consolider les décisions issues de `Correction.md`, améliorer le protocole des sessions, puis retirer `Correction.md` du dépôt lorsque chaque constat possède une décision et une preuve finales.

**Architecture conservée :** application React/Vite statique, française et local-first ; données éditoriales embarquées ; données utilisateur dans `localStorage` ; aucun backend, aucune API, aucun compte distant.

**Stack :** React 19, React Router 7, TypeScript, Vite 6, Tailwind CSS 3, Vitest, scripts Node ESM, Puppeteer et données JSON locales.

**Charge restante indicative :** six sessions séquentielles, environ 18 à 24 heures techniques. Les recherches humaines de sources ou de droits, si elles sont ultérieurement demandées, ne sont pas incluses.

---

## 1. Décisions de cadrage

### 1.1 Travail local

1. Le dépôt local et son worktree sont les sources de l’état de travail.
2. Le dépôt Git distant sert uniquement de sauvegarde. Il n’est ni la source de vérité du produit ni une cible de publication dans le présent plan.
3. Aucun commit, staging, push, déploiement, déclenchement de workflow Pages ou action sur l’hébergement ne fait partie d’une session sans instruction explicite de l’utilisateur.
4. Les contrôles de domaine public, d’en-têtes HTTP, d’unfurlers, de CDN et d’hébergement réel sont hors du plan local. Ils ne peuvent pas bloquer sa clôture.
5. Le projet local s’appelle `vc-platform`. La base technique actuellement prise en charge reste `/vc-plateform/`. Ces deux noms ne doivent pas être interchangés.
6. Lorsqu’un build local régénère les artefacts publics versionnés, employer l’origine canonique explicitement partagée par `README.md` et le workflow manuel Pages. Réserver les origines de fixture telles que `https://example.test` aux tests isolés qui écrivent hors du worktree.

### 1.2 Rôle des documents

- **`Correction.md`** est l’audit temporaire des dysfonctionnements. Il sert à retrouver un constat par identifiant, pas à piloter l’avancement quotidien. Ne plus lui ajouter de compte rendu de session. Après consolidation des 91 identifiants et validation finale, le retirer du dépôt.
- **`Suivis/ETAT.md`** reste l’état courant court et remplaçable.
- **`Suivis/JOURNAL.md`** reste l’historique append-only des changements et preuves effectivement produits.
- **Le présent plan** porte le périmètre, l’ordre, les critères de sortie et la matrice froide des identifiants.
- **`.hermes/plans/2026-07-22_134627-correction-baseline.json`** demeure un instantané immuable des 107 changements antérieurs à la mission. Il aide à attribuer les changements ; il ne décrit pas l’état courant.
- **`docs/archive/retours-sessions-correction-2026-07-22.md`** conserve la rétrospective anciennement nommée `better .md`. Ses règles transversales sont maintenues dans `CLAUDE.md` et les conventions propres à C1–C6 restent ci-dessous ; l’archive ne doit plus être chargée par défaut.

### 1.3 Autorités maintenues

- Le code, les données canoniques et les tests décrivent le comportement réel.
- `AGENTS.md` et `CLAUDE.md` décrivent les règles de travail.
- `PRODUCT.md` et les références maintenues citées dans `CLAUDE.md` décrivent le contrat produit et éditorial.
- Une assertion historique de l’audit ou du journal ne remplace jamais une vérification du worktree courant.

---

## 2. État acquis avant les sessions restantes

| Phase | État local | Résultat à préserver |
|---|---|---|
| S1 | close | Baseline des 107 changements préexistants et matrice initiale des 91 identifiants. |
| S2 | close | Contrat partagé de base URL, assets et manifest-only. |
| S3 | close | Prérendu strict bloquant, politique noindex, 404 dédiée et workflow manuel séparé. |
| S4 | close | Registre de persistance versionné, validation runtime, migrations et limites. |
| S5 | close | Export/import local, purge, notice de confidentialité et propagation multi-onglets bornée. |
| S6 | close | Publication fail-closed des données, URL éditoriales sûres et validateurs centraux testés. |

La dernière preuve générale consignée après S6 est verte, mais elle n’est pas une garantie sur les modifications ultérieures. Chaque session restante doit établir ses propres preuves ciblées ; le gate complet n’est rejoué qu’après gel de son périmètre ou lors de la clôture finale.

---

## 3. Conventions propres au cycle C1–C6

Les règles transversales d’exécution vivent dans `CLAUDE.md`, section « Session workflow ». Le présent plan ne conserve que les conventions nécessaires à ce cycle de correction :

1. Exécuter une fiche C1–C6 par session bornée. C4 peut être divisée en C4a/C4b avant écriture si ses deux familles d’interactions ne peuvent pas partager un même état gelé.
2. À l’ouverture, charger uniquement la fiche active, ses identifiants dans `Correction.md`, l’état courant et la dernière preuve utile du journal.
3. Utiliser la baseline JSON des 107 changements uniquement pour l’attribution ; compléter par les empreintes des fichiers possédés et l’inventaire séparé des fichiers non suivis.
4. Ne jamais alimenter `Correction.md`. C6 consolide les 91 identifiants dans la matrice finale puis retire l’audit après validation.
5. Pendant C1–C5, privilégier les preuves ciblées indiquées dans chaque fiche. Le gate général unique et le build local conditionnel appartiennent à C6, sauf incohérence transversale bloquante.
6. À la clôture d’une fiche, mettre à jour `ETAT.md` et ajouter une entrée courte à `JOURNAL.md` après les preuves finales ; modifier ce plan seulement si le périmètre, la décision ou le statut de la fiche change.
7. Le dépôt distant reste une sauvegarde. Aucune opération Git distante, publication ou vérification d’hébergement ne fait partie de C1–C6.

---

## 4. Matrice froide des identifiants de l’audit

Cette section évite de charger `Correction.md` en entier. Une session ne consulte dans l’audit que les identifiants de son lot.

### 4.1 Décisions déjà acquises ou à préserver en non-régression

| Origine | Identifiants |
|---|---|
| S1 | `PRE-002`, `PRE-007`, `ARC-001`, `ARC-004`, `ARC-005`, `ARC-007`, `DATA-005`, `NAV-004`, `NAV-005`, `NAV-006`, `NAV-007` |
| S2 | `PRE-003`, `DEPLOY-001`, `DEPLOY-003`, `DEPLOY-004` |
| S3 | `ARC-003`, `CFG-001`, `NAV-001`, `NAV-002`, `SEO-001`, `SEO-002`, `SEO-003`, `DEPLOY-002`, `SEC-001` ; contrat local de `SEC-005` |
| S4 | `RUN-003`, `STORE-001`, `STORE-002`, `STORE-003`, `STORE-005`, `STORE-008`, `STORE-009`, `STATE-001`, `STATE-002`, `SEC-003` |
| S5 | `PRE-008`, `STORE-004`, `SEC-002` ; portée bornée de `STORE-006` et `STATE-003` |
| S6 | `PRE-004`, `PRE-005`, `DATA-001`, `DATA-002`, `DATA-003`, `DATA-004`, `RUN-004`, `STORE-007`, `EDIT-001`, `SEC-004`, `TEST-002` ; portée partielle de `EDIT-002`, `EDIT-003`, `EDIT-004` |
| Arbitrage produit | `UI-006` ne déclenche aucune correction automatique. |

### 4.2 Identifiants actifs et décision cible

| Session consolidée | Identifiants principaux | Décision cible |
|---|---|---|
| C1 | `TEST-001`, partie utile de `TEST-003`, `A11Y-003`, `A11Y-004`, `A11Y-007`, `RWD-001` | Socle DOM minimal, structure de page et responsive critique. Aucun seuil global arbitraire. |
| C2 | `A11Y-001`, `A11Y-002`, `NAV-003` | Contrat commun des couches, tiroirs et palette. |
| C3 | `PRE-001`, `ARC-002`, `RUN-001` ; non-régression `RUN-002`, `PRE-005`, `DATA-004`, `STORE-004` | Reprise des chargements différés et calculs fondés sur le catalogue public. |
| C4 | `RUN-005`, `A11Y-005`, `A11Y-006`, `A11Y-008`, `A11Y-009`, `RWD-002`, `RWD-003`, `UI-001`, `UI-002`, `UI-003`, `UI-004`, `UI-005` | Calculs, champs, tableaux et interactions pédagogiques ; migration UI limitée aux surfaces touchées. |
| C5 | `MOTION-001`, `PERF-001`, `RES-001` | Mouvement réduit dès le premier rendu, branche média unique et budget local de non-régression. |
| C6 | `PRE-006`, `PRE-009`, `ARC-006`, `ARC-008`, `RULE-001`, `RULE-002`, résidus `EDIT-002`, `EDIT-003`, `EDIT-004` | Parité documentaire locale, fraîcheur des sorties et consolidation finale de l’audit. |

### 4.3 Éléments hors du plan local

- `PERF-002` devient une décision d’architecture documentée : ne pas remplacer `createRoot` par `hydrateRoot` sans chantier déterministe distinct.
- `RES-002` devient un gate de diffusion publique : la recherche de droits n’est pas requise pour la consolidation locale, mais toute future publication devra disposer d’un statut exploitable ou retirer le média concerné.
- La vérification externe de `SEC-005`, des en-têtes, du domaine, des unfurlers et de l’hébergement est différée jusqu’à une demande explicite de remise en ligne.
- `TEST-003` autorise un rapport de couverture si utile ; les seuils progressifs ne bloquent pas le présent plan sans baseline mesurée et décision explicite.

Avant le retrait de `Correction.md`, C6 doit vérifier par script que les 91 identifiants appartiennent exactement à une catégorie finale : `clos`, `portée bornée`, `décision produit`, `différé hors plan local` ou `réouvert`.

---

## 5. Sessions restantes

## C1 — Socle DOM, structure de page et dashboard responsive

**Priorité : P1 — estimation 3 à 4 h — état : close le 2026-07-23**
**Modèle conseillé :** GPT-5.5, effort élevé. Pas de délégation par défaut.

**Objectif :** rendre les tests React/accessibilité exécutables sans modifier l’environnement Node des suites métier, puis fermer les écarts structurels les plus sûrs.

**Fichiers probables :**
- `client/package.json`, `package-lock.json` ;
- `client/vitest.config.ts` ;
- nouveaux helpers sous `client/src/test/` ;
- `client/src/layouts/MainLayout.tsx` ;
- `client/src/App.tsx` ;
- `client/src/components/ui/primitives.tsx` ;
- pages routées contenant encore un `<main>` ;
- `client/src/pages/intelligence/IntelligencePage.tsx` ;
- `client/src/pages/workspace/DashboardPage.tsx`.

**Étapes :**
1. RED : rendre un composant avec routeur, nom accessible, interaction clavier et contrôle axe ciblé.
2. Ajouter des versions directes et compatibles de jsdom, Testing Library React, user-event, jest-dom et axe ; ne pas compter sur les dépendances optionnelles du lockfile.
3. Conserver `node` par défaut et appliquer jsdom uniquement aux tests DOM.
4. Fournir setup et nettoyages minimaux ; les shims ne doivent pas transformer une API absente en succès silencieux.
5. RED/GREEN : une route rend exactement un landmark `main`, le changement de route préserve le contrat de focus existant et le fallback expose un texte perceptible.
6. Rendre le niveau de `SectionHeading` configurable et garantir un `h1` utile sur les routes échantillonnées.
7. Corriger les contraintes `min-w-0`, repli et troncature nécessaires du dashboard ; ne pas masquer un débordement au niveau du document.
8. Produire un premier rapport de couverture seulement si son ajout reste mécanique ; ne définir aucun seuil global bloquant.

**Preuves minimales :** test DOM vertical, tests structure/fallback, contrôle dashboard à 390 px, `npm run test`, `npm run typecheck` et `npm run lint`. Aucun build complet.

**Critère de sortie :** infrastructure DOM stable, suites Node préservées, un seul landmark principal, fallback annoncé et dashboard sans débordement horizontal démontré.

---

## C2 — Navigation mobile et gestion des couches

**Priorité : P1 — estimation 3 à 4 h — dépend de C1 — état : terminé le 2026-07-23**
**Modèle conseillé :** GPT-5.5, effort très élevé. Une revue accessibilité en lecture seule peut être demandée sur l’état gelé.

**Objectif :** unifier les invariants de focus, inertie, Escape et verrouillage du scroll pour les dialogues, la palette et les deux tiroirs mobiles.

**Fichiers probables :**
- `client/src/components/ui/Modal.tsx` ;
- `client/src/components/ui/ConfirmDialog.tsx` ;
- `client/src/components/ui/CommandPalette.tsx` ;
- `client/src/components/chrome/SideNav.tsx` ;
- `client/src/components/chrome/TopBar.tsx` ;
- éventuel utilitaire de pile de couches sous `client/src/components/ui/` ;
- tests DOM/user-event associés.

**Étapes :**
1. Inventorier les comportements déjà corrects de `Modal` et écrire les tests avant toute extraction.
2. RED : deux couches successives ou imbriquées conservent l’inertie et le verrou du body jusqu’à la fermeture de la dernière.
3. RED : seule la couche supérieure traite Escape ; Tab et Shift+Tab restent dans la couche active.
4. Restaurer le focus uniquement vers un élément encore connecté et focalisable.
5. Utiliser des IDs uniques pour titres et descriptions.
6. Faire consommer le même contrat par `CommandPalette`, `SideNav` mobile et `TopBar` mobile, sans supprimer leurs interactions métier.
7. Respecter la réduction du mouvement pour les transitions de couches.

**Preuves minimales :** tests user-event des couches imbriquées, contrôle axe ciblé et parcours clavier réel sur palette et tiroirs. Pas de build.

**Critère de sortie :** aucune couche ne laisse le fond actif, le body verrouillé ou le focus perdu ; les deux navigations mobiles et la palette suivent le même contrat observable.

**Ledger de clôture C2 — 2026-07-23 :**

| Constat | Fichier cible | Preuve RED observée | Correction GREEN | Vérification |
| --- | --- | --- | --- | --- |
| Les couches n’avaient pas de contrat commun pour l’inertie du fond, le verrouillage du scroll et la pile de couches imbriquées. | `client/src/components/ui/Modal.tsx`, nouvel utilitaire `client/src/components/ui/layerStack.ts` | Dans une copie temporaire avec les fichiers de production pré-C2, `npm run test --workspace client -- src/components/ui/layers.dom.test.tsx src/components/chrome/mobileLayers.dom.test.tsx` retourne `CONTROLLED_RED_EXIT=1` ; le test imbriqué échoue notamment sur `AssertionError: expected null not to be null`. | `useLayerBehavior` maintient une pile de couches, pose/restaure `inert`, verrouille/restaure `document.body.style.overflow`, limite Escape et Tab à la couche supérieure et restaure le focus seulement vers un élément encore connecté et focalisable. `Modal` consomme ce contrat. | Commande ciblée finale : exit 0, 2 fichiers / 5 tests. Contrôle Chromium mobile : fond inerté et body verrouillé pendant les couches, état restauré après Escape. |
| Les confirmations pouvaient exposer des IDs fixes non uniques. | `client/src/components/ui/ConfirmDialog.tsx` | Même RED contrôlé : `AssertionError: expected 1 to be 2 // Object.is equality` sur deux confirmations montées. | `ConfirmDialog` utilise `useId()` pour le titre et la description, transmet `aria-labelledby` / `aria-describedby` à `Modal` et délègue le focus initial au bouton de confirmation via `initialFocusRef`. | Test `expose des identifiants accessibles uniques pour plusieurs confirmations montées` vert ; scan Chromium `duplicateIds: 0`. |
| La palette de commandes gérait son portal, Escape et `body.style.overflow` séparément, sans inertie ni focus trap partagé. | `client/src/components/ui/CommandPalette.tsx` | Même RED contrôlé : le test de contrat palette échoue, avec focus reçu hors attente et absence du contrat d’inertie. | La palette consomme `Modal`, garde ses interactions métier de recherche/navigation, reçoit un titre accessible unique, un focus initial sur le champ de recherche et laisse Escape/Tab/scroll au contrat commun. | Test palette vert, contrôle axe ciblé sans violation hors `color-contrast` désactivé sous jsdom ; Chromium `/home` 390 × 844 : dialog `Recherche globale`, focus champ, `rootInert: true`, `bodyOverflow: "hidden"`, Tab/Shift+Tab confinés, Escape restaure le bouton. |
| Les tiroirs mobiles ne se présentaient pas comme des dialogues modaux et ne consommaient pas les invariants communs. | `client/src/components/chrome/TopBar.tsx`, `client/src/components/chrome/SideNav.tsx` | Même RED contrôlé : Testing Library ne trouve pas `role="dialog"` nommé `Navigation mobile` ni `Navigation mobile latérale`. | Les deux tiroirs sont rendus en portal, portent `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-controls`/`aria-haspopup="dialog"` côté bouton, et consomment `useLayerBehavior` sans retirer les liens de navigation ni les actions recherche/thème. | Test paramétré des deux tiroirs vert ; Chromium `/home` et `/dashboard` 390 × 844 : focus initial sur le dialogue, Tab/Shift+Tab restent dans les liens, Escape ferme et restaure le bouton Menu, fond et scroll restaurés. |

**Commandes de clôture :**

- RED contrôlé hors worktree courant : copie temporaire avec fichiers de production pré-C2, commande ciblée ci-dessus, exit 1 avec 5 tests en échec.
- `npm run test --workspace client -- src/components/ui/layers.dom.test.tsx src/components/chrome/mobileLayers.dom.test.tsx` : exit 0 — 2 fichiers / 5 tests.
- `npm run typecheck` : exit 0.
- `npm run lint` : exit 0.
- `npm run test` : exit 0 — 34 fichiers / 250 tests Vitest et tests Node associés.
- `npm run check` : exit 0 — validation stricte, glossaire, TypeScript, lint, 34 fichiers / 250 tests Vitest et tests Node associés.
- Revue Chromium sous Vite, mobile 390 × 844 : palette `/home`, tiroir TopBar `/home` et tiroir SideNav `/dashboard` contrôlés au clavier ; aucune erreur console applicative, seulement le message debug Vite de connexion.
- Aucun build, commit, push, workflow distant ou déploiement.

---

## C3 — Progression publique et résilience des chargements différés

**Priorité : P1 — estimation 3 à 4 h — dépend de C1 — état : close le 2026-07-23**
**Modèle conseillé :** GPT-5.5, effort élevé. Exécution séquentielle.

**Objectif :** calculer l’expérience d’apprentissage sur les 101 leçons publiées et rendre les ressources différées récupérables après rejet.

**Fichiers probables :**
- `client/src/content/lessons.ts` et `glossary.ts` ;
- `client/src/pages/workspace/DashboardPage.tsx` ;
- `client/src/hooks/useResumeLesson.ts` ;
- `client/src/pages/learn/LessonPage.tsx` ;
- `client/src/pages/glossary/GlossaryPage.tsx` ;
- `client/src/pages/search/SearchPage.tsx` ;
- `client/src/components/ui/CommandPalette.tsx` ;
- `client/src/pages/workspace/DecisionJournalPage.tsx` ;
- `client/src/components/ikigai/IkigaiText.tsx` ;
- `client/src/pages/cases/CaseCorrectionPage.tsx` ;
- tests de contenu, hooks et composants concernés.

**Étapes :**
1. RED : une fixture mêlant contenu `published`, `upcoming`, supprimé et progression historique calcule son pourcentage sur le seul catalogue public.
2. Exposer un prédicat ou une collection publique canonique ; éviter les filtres concurrents dans l’interface.
3. Filtrer numérateur, dénominateur, suggestions et reprise sans supprimer les entrées historiques du stockage.
4. RED : premier import différé rejeté, état d’erreur annoncé, clic `Réessayer`, second chargement réussi.
5. Retirer du cache applicatif toute promesse rejetée et distinguer chargement, erreur, absence et contenu disponible.
6. Couvrir leçons, glossaire, recherche, palette, journal et popover Ikigai ; garder `ErrorBoundary` en non-régression et ne pas reconstruire un système global de chunks de route.
7. Limiter les imports barrel seulement dans les chemins différés effectivement touchés.

**Preuves minimales :** tests de progression publique, tests rejet/reprise par famille, contrôle navigateur hors ligne puis retour en ligne sur un échantillon. Pas de build complet.

**Critère de sortie :** aucun contenu non public n’entre dans le calcul ou les liens ; aucun rejet pris en charge ne laisse un loader permanent ou un cache empoisonné.

**Ledger de clôture C3 — 2026-07-23 :**

| Constat | Fichier cible | Preuve RED observée | Correction GREEN | Vérification |
| --- | --- | --- | --- | --- |
| Les calculs de progression et de reprise pouvaient compter le catalogue complet, les leçons `upcoming` ou des entrées historiques qui ne correspondent plus à une leçon publiée. | `client/src/content/lessons.ts`, `client/src/pages/workspace/DashboardPage.tsx`, `client/src/hooks/useResumeLesson.ts`, `client/src/content/parcours.ts`, `client/src/content/learningTime.ts` | Test C3 ajouté avant correction : `PUBLIC_LESSONS`, `isPublishedLesson`, `publicLessonById`, `publishedLessonsForCourse` et `publicProgressSummary` étaient absents ; `npm run test --workspace client -- src/content/lessons.test.ts ...` retournait exit 1 avec `PUBLIC_LESSONS` indéfini et `publicLessonById is not a function`. | Ajout d’une collection publique canonique de 101 leçons publiées, de lookups publics et d’un résumé de progression qui filtre numérateur et dénominateur sans supprimer le stockage historique. Dashboard, reprise de leçon, parcours et temps dérivés consomment ces helpers. | Tests ciblés C3 finaux : exit 0, 5 fichiers / 9 tests ; suite complète finale : 39 fichiers / 259 tests Vitest et 49 tests Node. |
| Les chargements différés de leçon, glossaire, recherche, palette, journal, popover Ikigai et correction de cas n’exposaient pas tous une branche d’erreur ni une reprise observable. | `client/src/content/lazyResource.ts`, `client/src/content/searchLazy.ts`, `client/src/content/lessons.ts`, `client/src/content/glossary.ts`, `client/src/content/caseCorrections.ts`, `client/src/pages/learn/LessonPage.tsx`, `client/src/pages/glossary/GlossaryPage.tsx`, `client/src/pages/search/SearchPage.tsx`, `client/src/components/ui/CommandPalette.tsx`, `client/src/pages/workspace/DecisionJournalPage.tsx`, `client/src/components/ikigai/IkigaiText.tsx`, `client/src/pages/cases/CaseCorrectionPage.tsx` | Tests DOM C3 ajoutés avant correction : absence de `role="alert"`, loaders persistants, rejets non capturés et helper `lazyResource` inexistant ; le premier ciblé retournait exit 1. | Ajout d’un loader récupérable qui purge la promesse rejetée, incrémente une tentative, utilise un cache-buster pour les URLs et des importeurs de module alternatifs pour la recherche. Les pages leçon, glossaire et recherche distinguent chargement, erreur, absence et contenu disponible, avec bouton `Réessayer`; palette, journal, popover Ikigai et correction de cas consomment le même chargement récupérable ou exposent une reprise locale. | Ciblé GREEN : `npm run test --workspace client -- src/content/lessons.test.ts src/content/lazyResource.test.ts src/pages/learn/LessonPage.lazy.dom.test.tsx src/pages/search/SearchPage.lazy.dom.test.tsx src/pages/glossary/GlossaryPage.lazy.dom.test.tsx` : exit 0 — 5 fichiers / 9 tests. |
| Un contrôle navigateur réel a montré qu’un échec de dynamic import peut rester empoisonné dans la carte de modules du navigateur si la reprise réutilise exactement la même URL. | `client/src/content/searchLazy.ts`, `client/src/content/lazyResource.ts` | Sous Vite, `/search` chargé en ligne puis recherche `capital` lancée hors ligne affichait l’alerte attendue ; après retour en ligne, un premier retry restait en erreur avec `net::ERR_INTERNET_DISCONNECTED`, révélant la nécessité d’une URL distincte. | Les tentatives suivantes utilisent `?retry=N` pour les ressources JSON et des importeurs alternatifs `./search.ts?retry=N` pour le module de recherche. | Contrôle navigateur final sous Vite : `/search` chargé en ligne, réseau `Offline`, soumission `capital` → alerte `La recherche n’a pas pu être chargée.` ; réseau rétabli, clic `Réessayer` → résultats visibles, dont `Capital call`. La console ne contient que les erreurs réseau attendues de l’état hors ligne. |

**Commandes de clôture :**

- RED ciblé initial : commande C3 ci-dessus, exit 1 — helpers publics absents, helper de lazy resource absent, pages sans alerte/reprise et rejets non capturés.
- `npm run test --workspace client -- src/content/lessons.test.ts src/content/lazyResource.test.ts src/pages/learn/LessonPage.lazy.dom.test.tsx src/pages/search/SearchPage.lazy.dom.test.tsx src/pages/glossary/GlossaryPage.lazy.dom.test.tsx` : exit 0 — 5 fichiers / 9 tests.
- `npm run typecheck` : exit 0.
- `npm run lint` : exit 0.
- `npm run test` : exit 0 — 39 fichiers / 259 tests Vitest, plus 49 tests Node.
- Revue navigateur locale sous Vite : recherche différée hors ligne puis retour en ligne sur `/search?q=capital`, reprise réussie après `Réessayer`.
- Aucun build complet, commit, push, workflow distant ou déploiement.

---

## C4 — Champs, calculateurs, tableaux et interactions pédagogiques

**Priorité : P2 — estimation 4 à 5 h — dépend de C1 et C3 — état : terminé le 2026-07-23**
**Modèle conseillé :** GPT-5.5, effort élevé ou très élevé. Scinder en C4a/C4b avant écriture si le périmètre ne peut pas être gelé comme un seul lot.

**Objectif :** fermer les écarts démontrés des simulateurs et de la lecture active sans migration générale du design system ni nouveau schéma de persistance des quiz.

**Fichiers probables :**
- `client/src/components/simulators/shared.tsx` ;
- `client/src/components/simulators/dilution.tsx`, `ownership.tsx`, `pre-post-money.tsx`, `fundraising-scenario.tsx` ;
- `client/src/lib/simulators/` et tests ;
- `client/src/components/reading/QuizBlock.tsx` ;
- `client/src/components/reading/ActiveProse.tsx` ;
- `client/src/components/ui/primitives.tsx` ;
- `client/src/styles/global.css` ;
- `client/src/pages/certifications/CertificationEvaluationPage.tsx` seulement pour un contrat sur fixture ou une surface réellement active.

**Étapes :**
1. Tracer les calculateurs existants ; extraire seulement pre/post-money, ownership et scénario de levée encore inline.
2. RED : zéro, négatif, non fini, grande valeur, arrondi et cohérence des totaux.
3. Ajouter aux champs actifs label, aide, unité, erreur, `aria-invalid`, `aria-describedby`, disabled et read-only selon leur besoin réel.
4. Rendre les tableaux dilution/ownership sémantiques et localement défilables ; corriger la ligne ownership à 320/390 px.
5. RED/GREEN : quiz sous forme de groupes natifs nommés, navigation clavier, sélection exposée, verrouillage après validation et résultat annoncé sans relire toute la page.
6. Rendre la sélection de texte accessible au clavier, gérer Escape et conserver un focus prévisible.
7. Vérifier le résultat d’`addNote` et rendre l’échec perceptible.
8. Durcir seulement les boutons touchés : `type="button"` par défaut, loading nommé, disabled sans translation/ombre. Ne pas migrer tous les boutons natifs.
9. Ne pas persister les réponses de quiz dans ce lot.

**Preuves minimales :** tests unitaires des calculateurs, tests DOM/user-event/axe, zoom 200 %, 320/390 px et parcours clavier de lecture. Gate racine seulement après gel si plusieurs sous-systèmes ont changé.

**Preuves produites :**
- RED ciblé : `npm run test --workspace client -- src/pages/certifications/CertificationEvaluationPage.dom.test.tsx` retourne exit 1 avant correction, faute d’alerte et de liens programmatiques d’erreur sur la déclaration préalable.
- GREEN ciblé : la même commande retourne exit 0 — 1 fichier / 1 test.
- C4 ciblé gelé : `npm run test --workspace client -- src/lib/simulators/c4-calculators.test.ts src/components/simulators/simulators.dom.test.tsx src/components/reading/QuizBlock.dom.test.tsx src/components/reading/ActiveProse.dom.test.tsx src/components/ui/primitives.dom.test.tsx src/pages/certifications/CertificationEvaluationPage.dom.test.tsx` retourne exit 0 — 6 fichiers / 13 tests.
- Gate racine après gel : `npm run typecheck`, `npm run lint` et `npm run test` retournent exit 0 ; la suite finale couvre 44 fichiers / 270 tests Vitest et 49 tests Node.
- Revue navigateur sous Vite, sans build : simulateurs dilution et ownership à 320/390 px sans débordement du document ; tableaux localement défilables ; lecture active à 320 px avec sélection clavier, toolbar nommée, Escape et focus prévisible ; quiz validé avec résultat annoncé ; aucune erreur console relevée.

**Critère de sortie :** calculs testables hors React, erreurs programmatiques cohérentes, tableaux sans débordement du document et interactions pédagogiques utilisables au clavier.

---

## C5 — Mouvement réduit et budget média local

**Priorité : P2 — estimation 3 à 4 h — dépend de C1 — état : terminé le 2026-07-23**
**Modèle conseillé :** GPT-5.5, effort élevé. Recherche de droits et hébergement exclus.

**Objectif :** supprimer les démarrages de mouvement non sollicités et empêcher le montage simultané de variantes média inutiles, sans ouvrir un chantier d’hydratation ou de réencodage général.

**Baseline locale :** 46 ressources sous `client/public` en incluant `favicon.ico`, pour 14 071 235 octets ; la vidéo représente 9 458 888 octets.

**Fichiers probables :**
- `client/src/lib/usePrefersReducedMotion.ts` ;
- `client/src/pages/blog/DebordScrollytelling.tsx` ;
- `client/src/pages/blog/HirschmanScrollytelling.tsx` ;
- éventuel script local de budget média et son test ;
- documentation uniquement si le contrat `createRoot`/prérendu est décrit de manière inexacte.

**Étapes :**
1. RED : avec `prefers-reduced-motion: reduce` avant le premier rendu, aucune vidéo autoplay ni parallaxe n’est montée.
2. Initialiser la préférence de manière paresseuse et synchrone, puis conserver l’abonnement.
3. RED : à 390 px et 1 440 px, une seule branche média correspondant au viewport existe dans le DOM.
4. Ne pas compter sur `display:none` pour éviter le chargement ; utiliser un montage conditionnel et `preload="none"` pour les vidéos inactives.
5. Ajouter un inventaire déterministe de non-régression : nombre, poids total, formats et plus gros fichiers.
6. Ajouter dimensions intrinsèques aux ressources touchées lorsque l’information est disponible sans réencodage.
7. Documenter honnêtement l’absence d’hydratation si le prérendu parle encore d’`hydrate`, sans basculer vers `hydrateRoot`.

**Exclusions :** conversion générale AVIF/WebP, réencodage de toutes les vidéos, recherche juridique de droits, registre public de provenance, SSR/SSG et hydratation React.

**Preuves minimales :** tests reduced-motion, inspection DOM/réseau à 390 et 1 440 px, budget média stable et contrôle visuel ciblé.

**Preuves produites :**
- RED ciblé DOM : `npm run test --workspace client -- src/pages/blog/scrollytellingMotion.dom.test.tsx` retourne exit 1 avant ajout des dimensions intrinsèques, avec 4 tests en échec sur `expect(element).toHaveAttribute("width")` pour les branches Debord/Hirschman desktop et mobile.
- RED budget média : `node --test scripts/media-budget.test.mjs` retourne exit 1 avant création du collecteur local, le test important un module de budget inexistant.
- GREEN ciblé DOM : `npm run test --workspace client -- src/pages/blog/scrollytellingMotion.dom.test.tsx` retourne exit 0 — 1 fichier / 10 tests. Le contrat couvre réduction du mouvement dès le premier rendu, branche média unique à 390/1 440 px, absence d’autoplay dans les scènes mobiles et dimensions intrinsèques des médias rendus.
- GREEN budget média : `node --test scripts/media-budget.test.mjs` retourne exit 0 — 1 test Node. Le collecteur stabilise 46 ressources sous `client/public`, 14 071 235 octets au total, 9 458 888 octets vidéo et les formats `ico`, `mp4`, `png`, `svg`, `webm`, `webp`.
- Revue navigateur sous Vite, sans build : `/blog/la-societe-du-spectacle-leve-des-fonds?view=scrolly` vérifié en mobile émulé 390 × 844 et desktop 1 440 × 1 000. À 390 px, aucune branche média desktop du scrollytelling n’est montée, 8 figures mobiles sont présentes, les vidéos de scène portent `preload="none"` et aucun autoplay de figure n’est présent ; à 1 440 px, une branche desktop est montée et aucune figure mobile ne l’est. Sous `prefers-reduced-motion: reduce` avant le rendu : aucune vidéo de scrollytelling n’est montée, aucune classe de transition/parallaxe n’est présente, aucune requête média scrollytelling n’est relevée et la console ne contient pas d’erreur applicative.
- Gate racine après gel, sans build : `npm run typecheck`, `npm run lint` et `npm run test` retournent exit 0 ; la suite finale couvre 45 fichiers / 280 tests Vitest et 50 tests Node.

**Critère de sortie :** aucune vidéo ne démarre sous réduction du mouvement, une seule branche utile est montée et une hausse future du budget média est détectable localement.

---

## C6 — Clôture locale, consolidation de l’audit et retrait de `Correction.md`

**Priorité : P3 — estimation 2 à 3 h — dépend de C1 à C5 — état : close le 2026-07-23**
**Modèle conseillé :** GPT-5.5, effort élevé. Orchestration principalement mécanique ; revue indépendante seulement si le diff final touche sécurité, persistance ou calculs.

**Objectif :** fermer le plan local sur un état gelé, consolider les 91 décisions et retirer l’audit temporaire sans transformer Git distant ou l’hébergement en gate produit.

**Étapes :**
1. Vérifier qu’aucun processus, build, serveur, délégation ou revue attendue n’est actif.
2. Capturer l’état Git et comparer les fichiers attribués au baseline et aux journaux de session.
3. Si du code, des routes, des données publiées, des métadonnées ou des assets ont changé, exécuter un seul build local :
   `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build`.
4. N’exécuter un build racine supplémentaire que si le contrat de base URL, le routeur ou le prérendu a changé depuis la dernière preuve double-base.
5. Exécuter une seule fois `npm run check` sur l’état gelé **après** les éventuelles écritures de génération du build.
6. Exécuter `git diff --check` et corriger uniquement les erreurs introduites par les sessions de correction.
7. Dédupliquer les validations : `npm run check` agrège déjà validation stricte, glossaire, typecheck, lint et tests ; `npm run build` agrège déjà génération, compilation et prérendu.
8. Réaliser une recette navigateur pilotée par le diff : une seule instance serveur, rôles et noms accessibles, viewport mobile/bureau seulement lorsque les deux layouts sont touchés.
9. Produire dans le présent plan la matrice finale des 91 identifiants avec décision et chemin de preuve ; vérifier automatiquement l’absence d’identifiant manquant ou en double.
10. Mettre à jour `ETAT.md` et ajouter une entrée courte à `JOURNAL.md`. Ne pas réécrire les entrées historiques.
11. Vérifier que les règles transversales sont maintenues dans `CLAUDE.md`, que les conventions propres à C1–C6 restent dans la section 3 et que l’archive des retours existe.
12. Après validation de la consolidation, retirer `Correction.md` du dépôt. Aucun commit ou push n’est implicite dans ce retrait.

**Critère de sortie :** gate local vert, build conditionnel vert, portée expliquée, 91 identifiants consolidés, suivis alignés, `better .md` archivé, `Correction.md` retiré après validation et aucune opération distante effectuée.

### Ledger de clôture C6 — 2026-07-23

**Périmètre gelé :** fraîcheur des quatre sorties générées, parité documentaire des commandes et autorités, matrice finale des identifiants, suivis et retrait de l’audit temporaire. Aucun composant produit, donnée canonique ni comportement métier n’a été ouvert par C6.

**Preuves RED puis GREEN :**

- RED générés : `node --test scripts/generated-content.test.mjs` retourne exit 1 avant création du module partagé, avec `ERR_MODULE_NOT_FOUND` sur `scripts/generated-content.mjs`.
- GREEN générés : la même commande retourne exit 0, 3/3 tests réussis. Le test démontre la dérivation déterministe, la détection d’une sortie volontairement périmée dans une fixture temporaire sans réécriture et la parité du dépôt courant.
- RED documentation : le probe Node de portée de `npm run test` retourne exit 1 avec `CLAUDE.md must document both Node test families`.
- GREEN documentation : le même probe retourne exit 0 avec `documentation-test-scope: OK` après alignement de `CLAUDE.md`, `README.md` et `docs/ARCHITECTURE_EDITION.md`.
- RED matrice : `node /tmp/vc-platform-c6-matrix-check.mjs .hermes/plans/2026-07-22_134627-correction-amelioration-vc-platform.md` retourne exit 1 avec `C6 final matrix markers are missing` avant la présente consolidation.
- GREEN matrice : la même commande retourne exit 0 après consolidation avec 91 identifiants uniques, aucun manque ni doublon, et les décomptes 62/20/6/3/0 attendus.

**Contrôles sur l’état gelé avant consolidation documentaire :**

- `npm run split:content` retourne exit 0 ; les empreintes SHA-256 des quatre générés sont strictement identiques avant et après la commande.
- `npm run check` retourne exit 0 : contrôle de fraîcheur, validation stricte de 129 leçons et 405 termes, glossaire, TypeScript, ESLint, 45 fichiers et 280 tests Vitest, puis 53 tests Node.
- `git diff --check` retourne exit 0.
- Le build conditionnel final, `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build`, retourne exit 0 : 1 786 modules transformés, 653 routes dans le sitemap et prérendu strict 662/662, 404 dédiée, résumé `ok: true`.
- Recette de l’artefact avec une seule instance Vite Preview : à 390 × 844, `/home` et `/simulators/ownership` n’ont aucun débordement horizontal, exposent un seul `main`, le tiroir mobile applique dialogue nommé, inertie, verrouillage du scroll, Escape et restauration du focus, et le tableau ownership possède caption, en-têtes et défilement local ; à 1 440 × 1 000 avec réduction du mouvement active avant rendu, les neuf scènes Debord restent visibles, sans transformation, avec une seule scène active. Aucune erreur ou alerte console applicative n’a été relevée. Le serveur a ensuite été arrêté et le port 4173 libéré.
- Empreintes pré-consolidation : plan `b00e07e33e728e92eaf764e4dcf7e605397066d16ea51900de88e577913e63d8`, audit `01e8bfcf0cf9fb2bb56265b48ce96bf8f905bdf9183faa4cc538bba77d941d46`, état `221ab358ab979e5d31d41169bb7d4579c8aca759a4aa38eef557496ce1a6e689`, journal `5fd91e4fded8a386d337069a582a4abd467a75828b3de45c998e44c8c0a0e59d`.

**Contre-vérification du 2026-07-23 :** le gate relancé après le premier build a reproduit un échec sur `scripts/collect-routes.test.mjs` : le sitemap versionné portait encore l’origine de fixture `https://example.test`, alors que le contrat courant et le workflow manuel fixent `https://iari-ctrl.github.io`. La cause était l’ordre initial `check` puis build de fixture : `generate:sitemap` réécrit volontairement les fichiers publics pendant `prebuild`, sans contrôle ultérieur. La commande ci-dessus utilise désormais l’origine canonique. Après régénération, le test ciblé passe 1/1 ; le build canonique passe 662/662 ; puis `npm run check`, exécuté sur l’état post-build, passe avec 45 fichiers / 280 tests Vitest et 53/53 tests Node. La recette navigateur post-build confirme aussi les canonical et `og:url` sous l’origine canonique.

### Matrice finale des 91 identifiants

Les décisions portent sur le plan local. `clos` signifie que le défaut précis est corrigé ou que l’hypothèse a été invalidée par une preuve actuelle ; `portée bornée` conserve explicitement une limite ; `décision produit` fixe un arbitrage sans chantier implicite ; `différé hors plan local` requiert une action humaine ou une publication ultérieure. Aucun identifiant n’est réouvert à la clôture locale.

<!-- C6-MATRIX:START -->
| Identifiant | Décision finale | Chemin de preuve |
|---|---|---|
| `PRE-001` | clos | C3 : `client/src/content/lazyResource.test.ts` et tests DOM de reprise des leçons, du glossaire et de la recherche. |
| `PRE-002` | clos | Inventaire C6 sans fichier `Directives` et hiérarchie explicite au § 1.2 du présent plan. |
| `PRE-003` | clos | S2 : `shared/base-url.test.mjs`, contrat d’origine explicite et build C6 sous `/vc-plateform/`. |
| `PRE-004` | clos | S6 : `client/src/content/certificationAssessments.test.ts` et état d’évaluation indisponible testé en DOM. |
| `PRE-005` | clos | S6/C3 : `shared/publication.mjs`, `scripts/collect-routes.test.mjs` et catalogue public de 101 leçons. |
| `PRE-006` | clos | C6 : `package.json`, `CLAUDE.md`, `README.md` et probe `documentation-test-scope: OK`. |
| `PRE-007` | décision produit | `.github/workflows/deploy-pages.yml` reste manuel par `workflow_dispatch`; le distant n’est pas une cible active. |
| `PRE-008` | portée bornée | S5 : notice et cycle de vie local dans `ProfilePage.tsx` et `localDataLifecycle.test.ts`; aucune valeur de configuration locale n’a été lue. |
| `PRE-009` | clos | C6 : autorités alignées dans `AGENTS.md`, `CLAUDE.md`, `README.md` et `docs/ARCHITECTURE_EDITION.md`. |
| `ARC-001` | clos | Absence du document ambigu `Directives`; statut des documents défini au § 1.2 du présent plan. |
| `ARC-002` | portée bornée | C3 : imports directs limités aux chemins différés touchés; aucune migration globale du barrel n’est revendiquée. |
| `ARC-003` | clos | S3 : `shared/routes.mjs`, `scripts/collect-routes.test.mjs` et parité exacte avec le sitemap versionné. |
| `ARC-004` | clos | Alias concordants dans `client/tsconfig.app.json`, `client/vite.config.ts` et `client/vitest.config.ts`; typecheck C6 vert. |
| `ARC-005` | portée bornée | Aucun cycle reproductible n’est établi; le typecheck et le build C6 sont verts, sans prétendre à un audit exhaustif de graphe. |
| `ARC-006` | clos | C6 : portée commune des tests documentée dans `CLAUDE.md`, `README.md` et le manuel d’édition. |
| `ARC-007` | décision produit | Workflow Pages unique et manuel; aucune automatisation de publication n’est ouverte par le plan local. |
| `ARC-008` | clos | Hiérarchie éditoriale commune maintenue dans `AGENTS.md`, `CLAUDE.md`, `README.md` et `docs/ARCHITECTURE_EDITION.md`. |
| `DATA-001` | clos | S3/C6 : `collect-routes.test.mjs`, sitemap de 653 routes publiques et prérendu de 662 sorties avec neuf redirections. |
| `DATA-002` | décision produit | `data/certificationAssessments.json` reste vide; branches futures testées et certification présentée comme indisponible, non simulée. |
| `DATA-003` | portée bornée | `validate-content.mjs` bloque les schémas avant build; la suppression systématique de tous les casts locaux n’est pas revendiquée. |
| `DATA-004` | clos | `shared/publication.mjs` et `validation-core.test.mjs` imposent des statuts explicites et une exposition fermée par défaut. |
| `DATA-005` | clos | `scripts/collect-routes.test.mjs` couvre les anciennes routes et les neuf redirections vers `/bibliotheque`. |
| `RUN-001` | clos | C3 : cache de promesse rejetée purgé, alerte et action `Réessayer` couvertes par tests unitaires et DOM. |
| `RUN-002` | clos | `ErrorBoundary.tsx` conserve son repli et utilise la base publique; non-régression couverte par les tests d’application et de base URL. |
| `RUN-003` | clos | S4 : `useOnboardingMode.ts` consomme le stockage commun versionné avec fallback; tests de stockage verts. |
| `RUN-004` | clos | S6 : certification connue sans évaluation publiée rend un état indisponible, distinct d’une 404. |
| `RUN-005` | clos | C4 : calculateurs purs sous `client/src/lib/simulators/` et `c4-calculators.test.ts`, bornes non finies et négatives incluses. |
| `STORE-001` | clos | S4 : `storageDomains.test.ts` valide runtime les neuf domaines métier. |
| `STORE-002` | clos | S4 : `storage.contract.test.ts` couvre enveloppes versionnées, migrations et versions futures. |
| `STORE-003` | clos | S4 : clé onboarding intégrée à `STORAGE_KEYS` et au helper commun. |
| `STORE-004` | clos | S5 : export, import atomique et purge sélective couverts par `localDataLifecycle.test.ts`. |
| `STORE-005` | portée bornée | Les collections persistées principales sont bornées et testées dans `storageDomains.test.ts`; aucune limite universelle de toute prose n’est revendiquée. |
| `STORE-006` | portée bornée | S5 : événement `storage` et rechargement des domaines partagés; aucune fusion concurrente globale ni compare-and-swap n’est promis. |
| `STORE-007` | clos | Statut d’évaluation explicite et lookup publié couverts par `certificationAssessments.test.ts`. |
| `STORE-008` | clos | Historique et meilleur résultat d’anciennes versions couverts par `certificationAssessment.test.ts`. |
| `STORE-009` | clos | Suites `storage.contract`, `storageDomains`, `learningWorkspace`, `certificationAssessment`, `ikigaiCahier` et cycle local dans le gate. |
| `NAV-001` | clos | `collect-routes.test.mjs` prouve l’absence des familles `noindex` du sitemap et du prérendu. |
| `NAV-002` | portée bornée | 404 locale dédiée, `noindex,nofollow`, sans canonical ni `og:url`, couverte par les tests de prérendu; statut de l’hôte réel différé. |
| `NAV-003` | clos | C2/C6 : `mobileLayers.dom.test.tsx` et recette mobile de l’artefact pour Escape, inertie et restauration du focus. |
| `NAV-004` | clos | `collect-routes.test.mjs` vérifie les redirections historiques et leur exclusion des routes indexables. |
| `NAV-005` | portée bornée | `MainLayout.dom.test.tsx` et recettes navigateur confirment focus et navigation sur l’échantillon; aucune exhaustivité inter-route n’est revendiquée. |
| `NAV-006` | clos | C5 : `scrollytellingMotion.dom.test.tsx` couvre variantes mobile/bureau et conservation de la vue scrolly. |
| `NAV-007` | clos | Gates fail-closed de publication et tests du collecteur excluent brouillons, contenus `upcoming` et évaluations non publiées. |
| `UI-001` | clos | C4 : styles `btn-*` neutralisent translation et ombre disabled; `primitives.dom.test.tsx` couvre l’état. |
| `UI-002` | portée bornée | C4 a durci les actions touchées sans migration générale de tous les boutons natifs; portée consignée dans `JOURNAL.md`. |
| `UI-003` | portée bornée | Contrat des champs actifs consolidé dans `components/simulators/shared.tsx` et la déclaration de certification; pas de refonte globale des formulaires. |
| `UI-004` | portée bornée | C4 limite les ajustements typographiques aux surfaces touchées; aucune normalisation générale des métadonnées arbitraires n’est revendiquée. |
| `UI-005` | portée bornée | Les composants touchés suivent les tokens utiles, tandis que l’autonomie visuelle des scrollytellings n’a pas fait l’objet d’une migration générale. |
| `UI-006` | décision produit | Le hero de `/home` reste une mise en scène éditoriale assumée; aucun défaut fonctionnel n’a été établi. |
| `RWD-001` | clos | C1 : tests DOM et recette `/dashboard` à 390 × 844 avec `scrollWidth === clientWidth`. |
| `RWD-002` | clos | C4 : tableaux dilution et ownership localement défilables sans débordement du document, tests DOM et recette 320/390 px. |
| `RWD-003` | clos | C4 : ligne ownership repliable et contrôle navigateur à 320/390 px. |
| `A11Y-001` | clos | C2 : palette sur contrat modal partagé, focus trap, inertie, Escape et restauration testés. |
| `A11Y-002` | clos | C2/C6 : deux tiroirs mobiles rendus comme dialogues modaux nommés et vérifiés au clavier. |
| `A11Y-003` | clos | C1 : `App.dom.test.tsx` vérifie un seul landmark `main` sur les routes échantillonnées. |
| `A11Y-004` | clos | C1 : niveau configurable de `SectionHeading` et `h1` de route couverts en DOM. |
| `A11Y-005` | clos | C4 : quiz en groupes radio nommés, validation et résultat annoncés dans `QuizBlock.dom.test.tsx`. |
| `A11Y-006` | clos | C4 : sélection clavier, toolbar nommée, Escape et focus testés dans `ActiveProse.dom.test.tsx`. |
| `A11Y-007` | clos | C1 : fallback lazy avec texte perceptible couvert par `App.dom.test.tsx`. |
| `A11Y-008` | clos | C4/C6 : caption, scopes de colonnes et lignes, et défilement local des tableaux vérifiés en DOM et navigateur. |
| `A11Y-009` | clos | C4 : `aria-invalid`, `aria-describedby`, alerte globale et erreurs de champs testés sur la déclaration préalable. |
| `CFG-001` | clos | `npm run lint` couvre client, `scripts`, `shared` et hooks ESM avec zéro avertissement; gate C6 vert. |
| `RULE-001` | clos | Autorités communes nommées dans `AGENTS.md`, `CLAUDE.md`, `README.md` et `docs/ARCHITECTURE_EDITION.md`. |
| `RULE-002` | clos | C6 : `check:generated`, module de dérivation partagé et `generated-content.test.mjs` rendent la parité indépendante des hooks. |
| `RES-001` | portée bornée | C5 : dimensions des médias touchés, branche unique, `preload="none"` et budget déterministe; aucun réencodage AVIF/WebP général. |
| `RES-002` | différé hors plan local | Statut de droits requis avant toute diffusion future selon les §§ 4.3 et 6; aucune recherche juridique locale n’est simulée. |
| `SEC-001` | clos | Workflow Pages à actions épinglées, checkout sans credentials persistants et séparation build/déploiement, testé par `deploy-workflow.test.mjs`. |
| `SEC-002` | clos | S5 : notice locale, interdiction des secrets, export/import et purge sur `ProfilePage.tsx`, couverts par tests et recette. |
| `SEC-003` | clos | Contrats versionnés et validateurs runtime des stores majeurs dans `storage.ts` et `storageDomains.ts`. |
| `SEC-004` | clos | `shared/editorial-url.mjs`, validateurs et rendu des mémos rejettent les protocoles dangereux; suites ciblées vertes. |
| `SEC-005` | différé hors plan local | Politique d’en-têtes documentée dans `README.md`; réponses CSP et autres en-têtes à vérifier seulement sur un hébergement autorisé. |
| `TEST-001` | portée bornée | C1–C5 : infrastructure jsdom/Testing Library/axe et tests DOM critiques dans le gate; aucune conformité navigateur exhaustive n’est revendiquée. |
| `TEST-002` | clos | `validation-core.test.mjs` et `glossary-validation.test.mjs` couvrent fixtures valides, invalides, strictes, références et cycles. |
| `TEST-003` | portée bornée | `test:coverage` fournit une baseline V8; aucun seuil global arbitraire n’est bloquant sans décision progressive. |
| `STATE-001` | clos | `storage.contract.test.ts` et `storageDomains.test.ts` couvrent données anciennes, corrompues, mal typées et versions futures. |
| `STATE-002` | clos | Mode onboarding préfixé et validé par le contrat commun, sans accès direct non protégé. |
| `STATE-003` | portée bornée | `UserDataProvider` recharge après import, purge et événement `storage`; résolution de conflits simultanés non revendiquée. |
| `EDIT-001` | clos | Contrat `status === published` commun, types obligatoires et tests du blog fail-closed. |
| `EDIT-002` | portée bornée | Registre canonique aligné avec 405 slugs publiés et zéro `applied/unsourced`; 48 provenances locales et 16 définitions éditoriales restent qualifiées. |
| `EDIT-003` | différé hors plan local | Vérification factuelle datée source par source reportée; aucun `verifiedAt` n’est ajouté mécaniquement. |
| `EDIT-004` | portée bornée | Denylist ciblée bloquante dans `validation-core.test.mjs` et occurrences visées révisées; revue générale future non simulée. |
| `SEO-001` | clos | Registre de routes et collecteur excluent le diagnostic `noindex`; intersection sitemap/noindex vide dans les tests. |
| `SEO-002` | clos | `robots.txt` ne masque plus les directives `noindex`; tests du collecteur et de publication verts. |
| `SEO-003` | portée bornée | Artefact 404 sans canonical et avec `noindex,nofollow` vérifié localement; comportement HTTP du futur hôte reste hors plan. |
| `MOTION-001` | clos | C5 : lecture synchrone de `matchMedia` au premier rendu et test reduced-motion avant montage. |
| `PERF-001` | clos | C5 : une seule branche scrollytelling montée par viewport, vidéos inactives en `preload="none"`, tests DOM et recette réseau. |
| `PERF-002` | décision produit | Le client conserve `createRoot`; aucune migration `hydrateRoot` sans chantier déterministe distinct, conformément au § 4.3. |
| `DEPLOY-001` | clos | S2/C6 : contrat de base partagé, manifest relatif, assets sous `/vc-plateform/` et build d’artefact contrôlé. |
| `DEPLOY-002` | clos | Prérendu strict bloque Chromium absent, métadonnées manquantes, routes en échec et écarts de comptage; build C6 662/662. |
| `DEPLOY-003` | portée bornée | Origine unique explicitée dans le workflow et le contrat de build; domaine et canonical publics à revérifier seulement lors d’une remise en ligne. |
| `DEPLOY-004` | décision produit | Mode manifest-only documenté sans promesse PWA ni service worker; aucune fonctionnalité hors ligne n’est revendiquée. |
<!-- C6-MATRIX:END -->

**Décompte final vérifié :** 62 `clos`, 20 `portée bornée`, 6 `décision produit`, 3 `différé hors plan local`, 0 `réouvert`.

---

## 6. Travaux explicitement différés

Ces sujets ne bloquent pas la consolidation locale :

- publication ou déploiement du site ;
- choix ou validation d’un domaine public ;
- exécution distante du workflow Pages ;
- contrôle des en-têtes HTTP, unfurlers et comportement d’un hébergeur ;
- registre public de droits et provenance des médias ;
- hydratation React, SSR ou SSG ;
- conversion générale AVIF/WebP ou réencodage global des vidéos ;
- seuils globaux de couverture ;
- migration complète vers les primitives du design system ;
- persistance des réponses de quiz ;
- PWA hors ligne, traduction anglaise et redesign global ;
- nouvelles grandes surfaces produit ou nouveaux simulateurs complexes.

Une future remise en ligne exigera un plan distinct, déclenché par une décision explicite. Elle ne doit pas être anticipée dans les sessions C1 à C6.

---

## 7. Définition globale de terminé

- [x] C1 à C5 possèdent chacune leurs preuves ciblées et leur entrée de journal.
- [x] Le gate final `npm run check` passe sur l’état gelé.
- [x] Le build local conditionnel et la recette pilotée par le diff passent lorsqu’ils sont requis.
- [x] Les 91 identifiants de l’audit possèdent exactement une décision finale et une preuve ou un report explicite.
- [x] Aucun contenu non public n’entre dans la progression, les suggestions ou les routes de lecture.
- [x] Les parcours critiques modifiés restent utilisables au clavier et sans débordement du document.
- [x] Les erreurs différées prises en charge ne laissent aucun loader permanent.
- [x] Le mouvement réduit est respecté dès le premier rendu et une seule branche média utile est montée.
- [x] Toute prose modifiée respecte le registre sobre, factuel et institutionnel du dépôt.
- [x] `ETAT.md`, `JOURNAL.md` et le présent plan décrivent le même état local.
- [x] L’archive des retours de sessions existe et n’est plus une lecture obligatoire.
- [x] `Correction.md` est retiré après consolidation et validation de ses 91 décisions.
- [x] Aucun changement étranger n’a été restauré, reformatté ou attribué aux sessions.
- [x] Aucun commit, push, workflow distant ou déploiement n’a été exécuté sans instruction explicite.
