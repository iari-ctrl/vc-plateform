EcosystemCard from @vcpx/design-system. Use via `window.VCPX.EcosystemCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Dossier d'écosystème — un document vivant, d'où la date de révision affichée plutôt que la date de création.

La bande méta s'adapte : un dossier qui a des enfants annonce ses sous-dossiers via `childCount` ; sinon il annonce ses convictions et signaux ; à défaut, son nombre de parties.

`accent` colore le filet supérieur de la carte : utiliser l'accent propre au dossier.

## Props

```ts
interface EcosystemCardProps {
dossier: {
    id: string;
    slug: string;
    name: string;
    title: string;
    subtitle: string;
    kind: "geographie" | "secteur" | "these";
    accent: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    readMin: number;
    summary: string;
    tags: string[];
    sections: unknown[];
    glossaryRefs: string[];
    convictions?: unknown[];
    signals?: unknown[];
  };
  /** Non nul, la bande méta annonce les sous-dossiers plutôt que les convictions. */
  childCount?: number;
  featured?: boolean;
}
```
