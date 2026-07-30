# Accueil minimal à aiguillage binaire — Plan d’implémentation

> **For Hermes:** exécuter ce plan sur un état figé, avec un seul rédacteur, sans commit, push ni déploiement.

**Objectif :** remplacer l’accueil-vitrine par une page de quatre sections qui conduit d’abord vers **Intelligence VC** ou **Formation**, dans un registre éditorial minimal inspiré du rythme de The Footprint Firm sans reprendre sa palette ni ses figures.

**Architecture :** réécriture exclusive de `client/src/pages/home/HomePage.tsx`. Les champs célestes existants restent le seul décor (`map-paper` en clair, `NightSkyBackdrop variant="hero"` en sombre, `grain` dans les deux modes) ; la hiérarchie, les séparateurs et l’espace vertical portent le reste de la composition.

**Stack :** React 19, React Router, Tailwind CSS, collections typées locales.

---

## 1. Verrouiller le contrat avant l’édition

- Relever `git status` et ne toucher qu’au fichier possédé.
- Conserver `usePageMeta` et `useResumeLesson`.
- Dériver les deux destinations de `NAVIGATION_PILLARS` (`intelligence`, `formation`) ; exclure `workspace` de la page.
- Utiliser `BLOG.slice(0, 3)` pour la liste datée : `BLOG` est déjà publié et trié, tandis que `SIMULATORS` ne possède aucun champ de date. Réserver `SIMULATORS` à un lien de clôture vers un outil précis, sans inventer de date éditoriale.

## 2. Réécrire `HomePage.tsx` en quatre sections

1. **Hero** — h1 déclaratif sans traitement partiel, paragraphe contenu, pastille conditionnelle « Reprendre : … » ; conserver `isolate`, `map-paper`, `grain` et `NightSkyBackdrop`, supprimer tout gradient local et toute figure.
2. **Aiguillage** — deux volets égaux et entièrement cliquables, grands mais sans carte, ombre ni dégradé ; libellés verbatim, contexte bref, lien texte avec chevron, `aria-label` explicite et focus `--primary` visible.
3. **Publié récemment** — titre en phrase complète, trois lignes éditoriales issues de `BLOG` avec titre, `<time>`, `excerpt` sur une ligne et séparateurs `border-outline-variant` ; aucun composant de carte ni `SectionHeading`.
4. **Clôture** — afficher une seule fois et verbatim : « Tous les contenus sont accessibles sans compte. Notes, favoris et progression restent sur cet appareil. » Puis un unique lien texte vers un simulateur existant, destination distincte des deux volets.

Copie directrice proposée :
- h1 : « Cette plateforme relie l’intelligence du capital-risque à une formation structurée. »
- paragraphe : « Analyses, outils et parcours permettent d’examiner les écosystèmes, les décisions d’investissement et leurs conséquences. »

Appliquer `py-28 sm:py-32`, `font-headline text-display-sm tracking-tight` aux titres de section, `max-w-2xl text-surface-variant` au corps et des délais `Reveal` de `0` ou `60` ms seulement.

## 3. Contrôler le contrat source

- Exactement quatre `<section>`.
- Imports d’ornements limités à `NightSkyBackdrop`; absence de `PARCOURS`, cartes, `SectionHeading` et figures supprimées.
- Aucune occurrence de `btn-foil`, `sheen-host`, `ink-underline`, `premium-card` ou `gradient` dans le fichier ; présence de `map-paper`, `grain` et `isolate`.
- Une seule occurrence du texte relatif au stockage local ; aucune paire destination/libellé répétée.
- Les liens en `--primary` restent AA avec les tokens actuels : contraste mesuré à 5,27:1 en clair et 9,94:1 en sombre sur le fond principal.

## 4. Vérifier sur état figé

1. `npm run typecheck`
2. `npm run lint`
3. `VITE_SITE_URL=http://127.0.0.1:4173 npm run build` — ne pas lancer séparément `split:*` ou `validate:content`; vérifier ensuite qu’aucun fichier généré n’a dérivé.
4. Recette du build à **1440×1000** et **390×844**, en clair puis sombre : quatre sections, fonds attendus, volets égaux/empilés, focus clavier, noms accessibles, absence de débordement, console propre.
5. Émuler `prefers-reduced-motion: reduce` et vérifier que le contenu reste immédiatement perceptible.
6. `git diff --check`, contrôle du diff limité au fichier possédé, arrêt du serveur et contrôle final de `git status`.

## 5. Rapport de clôture

- Rapporter les commandes réellement exécutées et les observations des quatre recettes.
- Signaler, sans les modifier, la dérive de `docs/DESIGN_SYSTEM.md` §8 et de `PRODUCT.md` autour du « carnet d’explorateur » / de l’« atlas cartographique » ; proposer une phase documentaire dédiée.
- Ne pas modifier `Suivis/ETAT.md`, `Suivis/JOURNAL.md`, `data/**`, le chrome, les styles globaux ni les ornements.

## Configuration d’exécution recommandée

- **Modèle : GPT-5.5, effort high.** Le périmètre est strict, mono-fichier et bien spécifié ; `xhigh`, `max` ou GPT-5.6 ne se justifient qu’en cas de défaut transversal découvert pendant la recette.
- **Parallélisation : aucune écriture parallèle.** Un seul agent implémente ; une relecture source en lecture seule peut suivre l’état figé, puis la recette navigateur reste sérialisée sur un seul serveur/Chromium.
