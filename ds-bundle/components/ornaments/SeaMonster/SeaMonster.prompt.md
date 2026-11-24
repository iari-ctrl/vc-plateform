SeaMonster from @vcpx/design-system. Use via `window.VCPX.SeaMonster` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Monstre marin des cartes anciennes — « hic sunt dracones ». Meuble un angle vide ou signale la terre inconnue, notamment sur la page 404.

À employer avec parcimonie : un seul par page.

## Props

```ts
interface SeaMonsterProps {
  size?: number;
  hue?: string;
  className?: string;
}
```
