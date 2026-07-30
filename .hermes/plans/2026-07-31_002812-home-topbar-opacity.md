# Opacité de la topbar /home — plan d’implémentation

> **Pour Hermes :** implémenter directement dans ce dépôt après validation du plan, sans modifier `data/generated/`.

**Objectif :** conserver la topbar transparente au-dessus du hero `/home`, puis la rendre opaque/lisible dès que le scroll dépasse le hero.

**Contexte observé :**
- La topbar `/home` est rendue par `client/src/components/chrome/TopBar.tsx`.
- Ses classes partagées viennent de `client/src/components/chrome/homeBar.ts` via `HOME_BAR_SHELL`, actuellement toujours `bg-transparent`.
- Le hero `/home` est le premier `section` de `client/src/pages/home/HomePage.tsx`, en `min-h-[100svh]`.
- Les tests existants de la home sont dans `client/src/pages/home/homeExperience.dom.test.tsx`.

## Plan concis

1. **Ajouter un contrat de test ciblé**
   - Modifier `client/src/pages/home/homeExperience.dom.test.tsx`.
   - Couvrir l’état initial : la topbar reste transparente tant que le hero n’a pas été dépassé.
   - Couvrir l’état scrollé : après un scroll simulé au-delà de la hauteur du hero, la topbar reçoit une classe opaque et ne conserve pas l’état transparent actif.

2. **Implémenter l’état de scroll dans la topbar**
   - Modifier `client/src/components/chrome/TopBar.tsx`.
   - Dans `HomeTopBar`, suivre si `window.scrollY` a dépassé le premier hero (`main section:first-of-type` ou seuil équivalent basé sur son `getBoundingClientRect().bottom + scrollY`).
   - Mettre à jour l’état au montage, au scroll et au resize.

3. **Adapter les classes de chrome**
   - Conserver `HOME_BAR_SHELL` comme base transparente.
   - Ajouter dans `TopBar.tsx` une classe conditionnelle opaque après dépassement du hero : fond de surface fortement opaque, bordure/règle lisible, éventuellement `backdrop-blur` si cohérent avec le style existant.
   - Éviter de modifier la topbar onboarding ou la navigation latérale.

4. **Valider**
   - Exécuter le test ciblé : `npm run test --workspace client -- homeExperience.dom.test.tsx`.
   - Exécuter au minimum : `npm run typecheck --workspace client`.
   - Si le changement reste local et rapide, compléter par `npm run lint --workspace client`.

## Risques / points d’attention

- Ne pas casser le handover de `HomeIntro` : les classes `home-topbar-suppressed` et `home-topbar-arriving` doivent rester prioritaires.
- Ne pas appliquer l’opacité à l’état initial au-dessus du hero.
- Le test jsdom prouvera le contrat de classes et d’événements ; une vérification navigateur sera utile si le rendu visuel reste ambigu.
