AntiPortfolioEntryCard from @vcpx/design-system. Use via `window.VCPX.AntiPortfolioEntryCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Occasion manquée documentée : les fonds qui ont passé, le motif, ce que l'entreprise est devenue.

`passes` doit contenir au moins une entrée — la carte en lit l'année. `patternIds` ne rend un glyphe que pour les motifs présents au registre ; un identifiant inconnu est ignoré silencieusement.

Quand `quote` est renseignée, la citation publique remplace le résumé dans la carte. Ne la renseigner que si la citation est réellement publique et attribuable.

Même exigence de sobriété que `MemoCard` : un échec documenté s'expose sans ironie ni dramatisation.

## Props

```ts
interface AntiPortfolioEntryCardProps {
entry: {
    id: string;
    slug: string;
    company: string;
    title: string;
    subtitle: string;
    /** Au moins une entrée : la carte lit `passes[0].year`. */
    passes: { fund: string; partner?: string; year: number; stage: string }[];
    sector: string;
    /** Ids de motifs ; seuls ceux du registre rendent un glyphe. */
    patternIds: string[];
    readMin: number;
    summary: string;
    /** Présente, la citation remplace le résumé sur la carte. */
    quote?: { text: string; author: string; source: string };
    knownAtTheTime: { date: string; fact: string }[];
    statedReason: string;
    reasonIsPublic: boolean;
    missedSignal: string;
    steelman: string;
    outcome: string;
    takeaways: string[];
    glossaryRefs: string[];
    sources: { label: string; url: string }[];
  };
}
```
