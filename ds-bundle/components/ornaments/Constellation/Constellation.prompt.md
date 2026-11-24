Constellation from @vcpx/design-system. Use via `window.VCPX.Constellation` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Champ d'étoiles scintillantes reliées par de fins traits de navigation — le ciel sur lequel se repère l'explorateur. Sans `stars`, un champ de quatorze étoiles par défaut est rendu.

**Contrainte à connaître :** la table des liens est codée en dur sur quatorze indices. Un champ fourni doit donc compter au moins quatorze étoiles, sans quoi le composant lève au rendu (`Cannot read properties of undefined`). Dans le doute, omettre `stars` et garder le champ par défaut.

Décoratif. Se superpose à `NightSkyBackdrop` en fond de panneau sombre ; le poser en couche absolue non interactive.

## Props

```ts
interface ConstellationProps {
className?: string;
  hue?: string;
  /**
   * Omis, un champ de quatorze étoiles par défaut est rendu.
   *
   * Fourni, il doit compter AU MOINS QUATORZE entrées : la table des liens
   * est codée en dur sur quatorze indices et le composant lève au rendu
   * en deçà. Coordonnées dans un repère de 0 à 100, `r` = rayon.
   */
  stars?: { x: number; y: number; r: number }[];
}
```
