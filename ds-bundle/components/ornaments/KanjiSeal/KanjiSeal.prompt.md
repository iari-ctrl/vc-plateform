KanjiSeal from @vcpx/design-system. Use via `window.VCPX.KanjiSeal` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Sceau plat portant un kanji : le repère visuel d'un parcours. `accent` et `kanji` sont requis — les prendre sur le parcours lui-même, qui porte les deux.

`morphName` nomme la transition de vue permettant d'emporter le même sceau d'une carte vers la page qu'elle ouvre ; un nom doit être unique dans la page.

À distinguer de `WaxSeal`, qui imite l'épaisseur de la cire.

## Props

```ts
interface KanjiSealProps {
  kanji: string;
  accent: string;
  size?: number;
  className?: string;
  /** View-transition name, so the same seal can be carried from a catalogue card into the page it opens. A name must be uniqu */
  morphName?: string;
}
```
