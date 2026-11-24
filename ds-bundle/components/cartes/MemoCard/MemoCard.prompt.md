MemoCard from @vcpx/design-system. Use via `window.VCPX.MemoCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Note d'investissement annotée. L'en-tête porte le fonds, l'étape et la date ; le titre est le **nom de l'entreprise**, pas celui du document.

`whyItMatters` est le texte mis en avant : y mettre ce qu'un praticien doit retenir, pas un résumé neutre du mémo.

**Règle du design system :** cette carte doit se lire comme une pièce d'intelligence VC, pas comme une carte marketing. Pas de survente, pas de promesse.

## Props

```ts
interface MemoCardProps {
memo: {
    id: string;
    slug: string;
    company: string;
    title: string;
    fund: string;
    author: string;
    date: string;
    stage: string;
    amount?: string;
    outcome: string;
    whyItMatters: string;
    sourceUrl: string;
    sourceNote: string;
    readMin: number;
    summary: string;
    context: string;
    sections: unknown[];
    lessons: string[];
    glossaryRefs: string[];
    tags: string[];
  };
}
```
