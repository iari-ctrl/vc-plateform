SimulatorCard from @vcpx/design-system. Use via `window.VCPX.SimulatorCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Simulateur, avec sa catégorie et sa vignette colorée. `accent` pilote à la fois le filet supérieur et la vignette.

`description` doit dire ce que l'outil calcule et sur quoi il fait travailler, pas vendre l'expérience.

## Props

```ts
interface SimulatorCardProps {
sim: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    category: string;
    accent: string;
    description: string;
    relatedLessonIds: string[];
    glossaryRefs: string[];
  };
}
```
