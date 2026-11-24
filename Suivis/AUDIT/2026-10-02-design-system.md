# Revue du design system, 2 octobre 2026

## Périmètre et méthode

Revue des 14 sections de [DESIGN_SYSTEM.md](../../docs/DESIGN_SYSTEM.md), de leurs sources et consommateurs matériels. Trois lectures indépendantes ont couvert les fondations, les animations et la lecture/formation, puis une contre-revue a examiné les corrections. Les prescriptions sont distinguées des descriptions de l'implémentation. Ce relevé est historique ; le document de design et le code restent les références maintenues.

Le dépôt contenait déjà des modifications du simulateur, du layout et des suivis. Ces changements ont été conservés. La livraison porte sur le document, son renvoi dans `AGENTS.md`, le catalogue de développement, ses tests et le présent suivi. Elle ne modifie pas les calculs de progression ni les contrats Formation.

## Couverture des sections

| Section | Sources confrontées | Résultat de la revue |
| --- | --- | --- |
| 1. Positionnement | [PRODUCT.md](../../PRODUCT.md), marque de l'accueil | Principes et marque confirmés. |
| 2. Sources | Fichiers cités, [App.tsx](../../client/src/App.tsx), configuration et dépendances client | Catalogue réservé au développement confirmé ; sources du thème, des dialogues et de la progression ajoutées. |
| 3. Couleurs | [tokens.css](../../client/src/styles/tokens.css), [tailwind.config.ts](../../client/tailwind.config.ts), [ThemeProvider.tsx](../../client/src/context/ThemeProvider.tsx) | Rôles confirmés ; persistance conditionnée à l'écriture, limites de `/opacité` et exceptions historiques précisées. |
| 4. Typographie | [global.css](../../client/src/styles/global.css), Tailwind, `SectionHeading` et pages | Familles et échelles confirmées ; restriction excessive de `clamp` corrigée ; titre HTML, corps et faces chargées précisés. |
| 5. Layout | [MainLayout.tsx](../../client/src/layouts/MainLayout.tsx), [SideNav.tsx](../../client/src/components/chrome/SideNav.tsx), [TopBar.tsx](../../client/src/components/chrome/TopBar.tsx), pages de lecture | `--radius` sans consommateur, largeurs de lecture et distinction `/home` / `/home/` corrigés ; modèles et repères mobile ajoutés. |
| 6. Composants | [primitives.tsx](../../client/src/components/ui/primitives.tsx), [cards.tsx](../../client/src/components/cards.tsx), [parcoursProgress.ts](../../client/src/lib/parcoursProgress.ts), [CertificationDetailPage.tsx](../../client/src/pages/certifications/CertificationDetailPage.tsx) | « Étapes » remplace « séances » ; progression, jalons et blocs fermés précisés ; limites des liens et dialogues explicitées. |
| 7. Lecture | [ActiveProse.tsx](../../client/src/components/reading/ActiveProse.tsx), [markdown.tsx](../../client/src/lib/markdown.tsx) | Annotation stockée dans le carnet, sans recoloration persistante ; aperçu du glossaire, liens directs et listes simples distingués. |
| 8. Atlas et ornements | [Illustrations.tsx](../../client/src/components/ornaments/Illustrations.tsx), [Ornaments.tsx](../../client/src/components/ornaments/Ornaments.tsx), [PathAtlas.tsx](../../client/src/components/explore/PathAtlas.tsx), consommateurs | Usages réels corrigés ; grain SVG et couleur du filet rectifiés ; traits de relation continus, bornage des gestes et responsabilité du conteneur `inert` précisés. |
| 9. Splash | [SplashPage.tsx](../../client/src/pages/home/SplashPage.tsx), [CompassIkigaiIntro.tsx](../../client/src/components/splash/CompassIkigaiIntro.tsx), [splash.css](../../client/src/styles/splash.css) | Boussole à la place des sceaux ; coordination WAAPI, timer React et CSS décrite. |
| 10. États | Primitives, [ErrorBoundary.tsx](../../client/src/components/ErrorBoundary.tsx), [DeliverablePage.tsx](../../client/src/pages/intelligence/DeliverablePage.tsx), lecture et dialogues | Erreur de rendu distinguée d'une erreur de sauvegarde ; statut du chargement et traitements locaux précisés. |
| 11. Animations | Intro, hero, splash, atlas, [HomeEditorialBridge.tsx](../../client/src/components/home/HomeEditorialBridge.tsx), [parcoursMorph.ts](../../client/src/lib/parcoursMorph.ts) | Sources complétées ; réduction CSS distinguée des timers, WAAPI et SMIL ; préférence à l'entrée et changement pendant l'intro précisés. |
| 12. Accessibilité | PRODUCT, layout, navigation, dialogues et erreurs | Objectif WCAG 2.2 AA confirmé comme objectif ; aucune attestation de conformité déduite du code. |
| 13. Création | [CLAUDE.md](../../CLAUDE.md), états et composants | Contrôles de contenu long, erreurs, reprise et styles calculés ajoutés, validation proportionnée conservée. |
| 14. Maintenance | Hiérarchie des autorités dans CLAUDE | Propriété des valeurs conservée ; entretien du catalogue et périmètre des exceptions précisés. |

## Corrections du catalogue

[DesignSystemShowcasePage.tsx](../../client/src/pages/system/DesignSystemShowcasePage.tsx) lisait ses échantillons depuis le CSS mais affichait des valeurs copiées, dont deux couleurs claires et trois tailles de titre devenues fausses. Les légendes lisent maintenant les styles calculés : thème actif pour les couleurs, taille/interligne/espacement du spécimen pour la typographie. La lecture attend la prochaine frame après le changement de thème et se renouvelle au redimensionnement.

Le catalogue utilise la marque Maison Sapience VC, un titre principal et un choix de thème explicite. La carte annoncée comme cliquable est un lien réel vers les parcours. L'exemple de chargement monte `PageLoader`. Les démonstrations sans action et la progression fictive sont annoncées. Les descriptions du bouton secondaire et des ornements sont corrigées ; le fond photographique suit le thème. Les classes sémantiques avec suffixe d'opacité inopérant ont été retirées des exemples concernés. Le débordement de la grille typographique à 390 px a été reproduit puis corrigé ; la largeur du cartouche a été bornée après inspection des captures.

## Limites actuelles à conserver visibles

- `ParcoursCard` et `PathAtlas` comptent les leçons lues, alors que l'index et la fiche utilisent le résumé d'étapes. Le document signale cet écart ; aucune migration métier n'a été faite pendant cette revue.
- `Button` en mode lien ne transmet pas les props restantes. Le document recommande un lien explicite quand elles sont nécessaires.
- Les utilitaires Tailwind avec `/opacité` sur les couleurs sémantiques subsistent ailleurs dans l'application. Leur correction générale exige une revue des surfaces concernées.
- La sauvegarde des annotations ne réapplique pas de surlignage coloré au texte. La documentation décrit désormais cette portée exacte.
- La recette du catalogue ne qualifie pas l'ensemble de l'application, les lecteurs d'écran ni tous les navigateurs. Les règles d'accessibilité restent à vérifier pour chaque surface.

## Vérifications

Les commandes et résultats de clôture figurent dans [ETAT.md](../ETAT.md#verification-design-system). Le cycle initial des tests du catalogue conserve trois échecs attendus avant correction : valeurs calculées absentes, tailles copiées et carte sans lien. Les tests corrigés sont dans [DesignSystemShowcasePage.dom.test.tsx](../../client/src/pages/system/DesignSystemShowcasePage.dom.test.tsx).

Les traces détaillées de cette session sont conservées temporairement dans `/tmp/vc-design-audit-20261002/` : copies initiales et empreintes, RED/GREEN, typecheck, lint, vérification des liens, recette navigateur et captures. Ce chemin temporaire n'est pas une dépendance du projet.
