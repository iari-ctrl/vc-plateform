LessonRow from @vcpx/design-system. Use via `window.VCPX.LessonRow` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Rangée de leçon dans un sommaire de cours ou de parcours. Elle doit rester dense, scannable et stable d'une rangée à l'autre.

Trois états visuels s'excluent : `done` coche la pastille, `reading` signale la lecture en cours, `upcoming` grise la rangée, la rend non cliquable et masque les durées.

À la différence des cartes, cette rangée reçoit des champs plats plutôt qu'un objet métier.

## Props

```ts
interface LessonRowProps {
  slug: string;
  href?: string;
  order: number;
  title: string;
  kicker: string;
  readMin: number;
  practiceMin?: number;
  summary?: string;
  done?: boolean;
  reading?: boolean;
  upcoming?: boolean;
}
```
