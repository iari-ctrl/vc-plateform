InkStamp from @vcpx/design-system. Use via `window.VCPX.InkStamp` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Tampon encreur officiel, légèrement incliné, sur un fond hachuré imitant le grain du papier. Marque un statut — accès libre, archive, version.

`rotate` règle l'inclinaison en degrés ; rester sous dix degrés pour que le tampon reste lisible.

## Props

```ts
interface InkStampProps {
  label?: string;
  date?: string;
  hue?: string;
  rotate?: number;
  className?: string;
}
```
