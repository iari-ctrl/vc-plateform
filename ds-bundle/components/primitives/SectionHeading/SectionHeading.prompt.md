SectionHeading from @vcpx/design-system. Use via `window.VCPX.SectionHeading` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Le titre de section canonique : surtitre optionnel, titre, description optionnelle. C'est la forme à employer pour ouvrir toute section de page plutôt qu'un empilement de `h2` et de paragraphes composé à la main.

`as` fixe le niveau de titre réel — le choisir d'après la hiérarchie du document, pas d'après la taille voulue. L'apparence ne dépend pas du niveau.

`align="center"` est réservé aux en-têtes de page ; dans le flux d'une page, le titre reste aligné à gauche.

## Props

```ts
interface SectionHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}
```
