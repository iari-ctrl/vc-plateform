WaxSeal from @vcpx/design-system. Use via `window.VCPX.WaxSeal` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Sceau de cire : un dégradé radial imitant l'épaisseur de la cire, portant un glyphe. `glyph` accepte un nœud React, `accent` est requis.

À distinguer de `KanjiSeal`, plat, qui sert de repère de parcours. Le sceau de cire marque plutôt l'achèvement ou la distinction.

## Props

```ts
interface WaxSealProps {
  glyph: React.ReactNode;
  accent: string;
  size?: number;
  className?: string;
}
```
