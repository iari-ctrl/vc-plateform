Chip from @vcpx/design-system. Use via `window.VCPX.Chip` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Marqueur court : étiquette, catégorie, état bref. Rendu dans un `span`.

**Ce n'est pas un contrôle.** Un filtre cliquable exige un `button` portant la classe `.chip`, un libellé et un état tel que `aria-pressed`. Utiliser `Chip` pour un filtre produit une cible non accessible au clavier.

## Props

```ts
interface ChipProps {
  children: React.ReactNode;
  className?: string;
}
```
