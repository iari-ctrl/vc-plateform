BlogCard from @vcpx/design-system. Use via `window.VCPX.BlogCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Article de blog. `featured` agrandit titre et résumé pour la mise en avant d'un index — un seul article mis en avant par page.

`books` affiche les ouvrages analysés sous le titre, pour la catégorie des lectures. `status` fait partie du contrat mais la carte ne filtre pas : c'est à l'appelant de ne passer que des articles publiés.

## Props

```ts
interface BlogCardProps {
post: {
    id: string;
    slug: string;
    status: "draft" | "published";
    title: string;
    subtitle: string;
    author: string;
    date: string;
    readMin: number;
    category: string;
    excerpt: string;
    tags: string[];
    body: string;
    books?: { title: string; author: string; year?: number }[];
  };
  /** Agrandit le titre et le résumé pour une mise en avant d'index. */
  featured?: boolean;
}
```
