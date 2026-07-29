# Séparation Onboarding / Ikigai — Plan d’implémentation

> **For Hermes:** exécuter ce plan en TDD, sans commit ni push.

**Objectif :** déplacer l’expérience actuelle vers `/ikigai` et créer sur `/onboarding` une entrée courte, claire et orientée vers la navigation.

**Architecture :** `/onboarding` devient une page sans état qui présente les trois piliers du produit et propose facultativement le cahier Ikigai. `/ikigai` conserve le cahier, ses modes, ses réponses locales et son test d’orientation. Les anciens liens explicites vers le test sont redirigés vers `/ikigai?test=1`.

**Stack :** React, React Router, Tailwind, Vitest/jsdom.

---

## 1. Verrouiller le nouveau contrat de routes en TDD

**Créer :** `client/src/pages/onboarding/onboardingAndIkigai.dom.test.tsx`

- Vérifier que `/onboarding` affiche un titre de bienvenue et des liens accessibles vers `/intelligence`, `/parcours`, `/dashboard`, `/home` et `/ikigai`.
- Vérifier que `/onboarding` n’affiche plus le cahier ni le test.
- Vérifier que `/ikigai` affiche le cahier actuel.
- Vérifier que `/ikigai?test=1` affiche la première question du test.
- Vérifier la compatibilité d’un ancien favori `/onboarding?test=1&q=…`, redirigé vers `/ikigai` en conservant les paramètres.

Commande RED puis GREEN :
`npm run test --workspace client -- src/pages/onboarding/onboardingAndIkigai.dom.test.tsx`

## 2. Séparer les deux pages

**Créer/renommer :**
- `client/src/pages/onboarding/IkigaiPage.tsx` — contenu actuel de `OnboardingPage.tsx`, sans changement fonctionnel.
- `client/src/pages/onboarding/OnboardingPage.tsx` — nouvelle page concise.

**Modifier :**
- `client/src/App.tsx` — charger les deux pages sur `/onboarding` et `/ikigai`.
- `client/src/layouts/MainLayout.tsx` — utiliser la navigation haute sur le nouvel onboarding, afin que les destinations soient immédiatement visibles.
- `client/src/pages/home/SplashPage.tsx` — faire entrer le visiteur par `/onboarding` plutôt que directement par `/home`.
- `client/src/components/ikigai/cahierUi.tsx` et la copie Ikigai — remplacer les libellés internes « onboarding » par « cahier Ikigai » lorsque cela décrit le mode de lecture.

**Contenu de `/onboarding` :**
- titre : « Choisissez votre point de départ » ;
- une phrase expliquant Intelligence VC, Formation et Workspace ;
- trois cartes de navigation, dérivées autant que possible de `NAVIGATION_PILLARS` ;
- une invitation distincte et facultative vers `/ikigai` ;
- un accès secondaire à `/home` pour voir la vue d’ensemble ;
- aucun formulaire, stockage ou progression artificielle.

## 3. Requalifier les liens existants

**Vers `/ikigai` :**
- `client/src/components/ikigai/IkigaiCahierSummary.tsx`
- `client/src/components/explore/PathAtlas.tsx`
- le CTA Ikigai de `client/src/components/chrome/TopBar.tsx`
- le CTA secondaire de `client/src/pages/home/HomePage.tsx`

**Vers `/ikigai?test=1` lorsqu’un test est explicitement demandé :**
- `client/src/pages/workspace/DashboardPage.tsx`
- `client/src/pages/onboarding/ProfilePage.tsx`
- `client/src/pages/onboarding/ProfileResultPage.tsx`
- `client/src/pages/learn/ParcoursPage.tsx`

Les libellés devront distinguer « Ouvrir le cahier Ikigai » de « Faire le test d’orientation ».

## 4. Aligner le contrat public et la documentation

**Modifier :**
- `shared/routes.mjs` — ajouter `/ikigai` aux routes statiques et exécutables ; conserver `/onboarding` comme entrée publique.
- `README.md`, `CLAUDE.md`, `docs/ARCHITECTURE_EDITION.md` — documenter la séparation entre onboarding produit et cahier Ikigai.
- `Suivis/ETAT.md` et `Suivis/JOURNAL.md` — uniquement après validation finale.

**Régénérer, sans éditer directement :**
- `client/public/sitemap.xml` via `npm run generate:sitemap`.

## 5. Vérifier

1. Test DOM ciblé GREEN.
2. Inspection navigateur :
   - `/onboarding`, `/ikigai`, `/ikigai?test=1` ;
   - desktop 1440 px et mobile 390 px ;
   - thème clair et sombre ;
   - navigation clavier et absence de débordement.
3. `npm run typecheck`
4. `npm run lint`
5. `npm run test`
6. `npm run check`
7. `git diff --check`

## Risques maîtrisés

- Préserver intégralement les réponses, profils et préférences Ikigai existants : aucune migration de stockage dans cette étape.
- Préserver les anciens favoris de test grâce à la redirection des paramètres de `/onboarding?test=1`.
- Les fichiers `PathAtlas.tsx`, `sitemap.xml`, `CLAUDE.md`, `docs/ARCHITECTURE_EDITION.md`, `ETAT.md` et `JOURNAL.md` sont déjà modifiés : appliquer uniquement des changements ciblés et relire leurs diffs avant toute écriture.
- La réécriture éditoriale approfondie du cahier, du scoring et des archétypes reste hors de cette première séparation structurelle.
