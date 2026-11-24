Reveal from @vcpx/design-system. Use via `window.VCPX.Reveal` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Enveloppe d'animation d'entrée : le contenu monte et apparaît une fois, à l'affichage. `delay` échelonne plusieurs révélations successives.

À réserver aux entrées de section d'une page éditoriale. Ne pas en envelopper du contenu dont la lecture est immédiatement nécessaire, ni empiler des délais au point de retarder la lecture. L'animation respecte la préférence de mouvement réduit.

## Props

```ts
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}
```
