---
name: ecosystemes
description: "Research, author, revise, structure, source, validate, or illustrate the French « Décortiquer un écosystème » dossiers while enforcing their sober institutional style. Use when working on data/ecosystems.json, the /ecosystemes routes, root or child dossiers, convictions, signals, players, sources, glossary links, or ecosystem figures."
---

# Ecosystem dossiers

Use this playbook only for the signed, fully client-side dossiers published under `/ecosystemes`. It adds collection-specific rules; it is not the global repository contract.

## Maintained authorities

- Transverse editorial charter: [`docs/ARCHITECTURE_EDITION.md` §4.0.c](../../../docs/ARCHITECTURE_EDITION.md). Apply it to every touched dossier passage.
- Shared agent contract: [`CLAUDE.md`](../../../CLAUDE.md). It owns repository workflow, validation proportionality, generated-file rules and remote-operation limits.
- Source of ecosystem content: [`data/ecosystems.json`](../../../data/ecosystems.json).
- Types and schema: [`client/src/content/types.ts`](../../../client/src/content/types.ts) and [`scripts/validate-content.mjs`](../../../scripts/validate-content.mjs).
- Tree/order behavior: [`client/src/content/ecosystems.ts`](../../../client/src/content/ecosystems.ts), plus the relevant page and figure renderers.

If code, data and maintained documentation disagree, report the drift instead of guessing or copying a stale template. Do not rely on machine-local memories.

## Data model decisions

- Build the tree with `parentId` and `order`. A root has no `parentId`, is the only level listed on the index and must carry `these`.
- A child may omit `these`, `convictions`, `signals`, `players` and `sources`, but `sections` stay non-empty and `glossaryRefs` stays present, even as `[]`.
- Give each child an explicit integer `order`. Siblings sort by ascending `order`, then by descending `updatedAt`.
- Use `updatedAt` for any substantive revision. Set `verifiedAt` only after rechecking factual claims, figures, periods, scopes and sources.
- Write convictions as falsifiable statements with an explicit `strength` and `horizon`. The current model dates the dossier, not each conviction; call the date an evaluation horizon unless the data model changes.
- Treat inline markers and `glossaryRefs` as separate editorial surfaces: markers link prose terms; `glossaryRefs` selects the complementary list. Do not force the two sets to match.

## Research and writing specifics

The transverse charter already bans promotional, dramatic, slogan-like and LLM-stereotyped prose. For ecosystem dossiers, add these constraints:

- Formulate the root thesis so evidence could confirm or invalidate it.
- Let each child dossier deepen one bounded question rather than repeating the parent dossier.
- Separate observed facts, interpretation, hypothesis, forecast and opinion. Keep confidence proportional to evidence.
- Verify identifiable facts, figures, studies and institutional claims against current primary or institutional sources before setting `verifiedAt`.
- For quantitative claims, record publication date, data period, geography, population, currency and other material scope limits. Check date validity manually; the schema only validates the prefix.
- Prefer an honest order of magnitude to false precision. A multi-source comparison is acceptable only when definitions, periods, scopes and normalization are explicit.
- Cite absolute safe `https:` URLs in `sources[]`. The current schema is not sufficient evidence review.

Before saving, reread each changed passage and remove repetition, filler, unsupported intensifiers and generic transitions. A sentence that adds tone but no information should be deleted or rewritten as a precise claim.

## Figures

Attach figures through `section.figures`; prose Markdown does not render images, raw HTML/SVG or tables. Native kinds:

- `bars`: at least one `{ label, value, valueLabel?, highlight? }`, with `unit?`;
- `line`: at least two `{ x, y, annotation? }` points, with `unit?`;
- `matrix`: at least two columns and one row; every row must contain exactly one cell per column;
- `quadrant`: at least one item; keep every `x` and `y` within `[0,1]`;
- `taxonomy`: a root and at least one branch.

Check matrix width and quadrant bounds manually: the current Zod schema does not enforce both invariants, and the quadrant renderer silently clamps out-of-range values.

Use `title`, `caption?` and `source?` as plain text. Never place glossary markers in figure text: valid markers render literally, unresolved markers fail validation.

Keep the essential conclusion and important values available in surrounding prose or caption. The figure container exposes only a short image label to assistive technology, and the line renderer does not display Y-axis ticks or unit.

Adding a figure kind requires synchronized changes to the TypeScript union, the Zod discriminated union and `EcosystemFigureView`. Add an exhaustive guard so an omitted renderer case cannot disappear silently.

## Glossary changes

- Reuse existing terms whenever possible. Dossier prose does not auto-link aliases; add explicit markers only where a link is editorially useful.
- Add a missing term through the two-layer workflow in [`docs/ARCHITECTURE_EDITION.md` §4.2](../../../docs/ARCHITECTURE_EDITION.md): update `data/sources/canonical-glossary.json`, align `data/glossary.json`, merge approved aliases if relevant, validate the published collection, then regenerate split files.
- Manually verify register-to-published alignment because no current validator compares every aspect of the two layers.
- Preserve local order during bounded edits. The maintained target is ordering by `term`, but existing drift is not a reason for opportunistic mass reordering; never sort by slug.

## Edit and validate proportionately

- Edit source files only. Never hand-edit `data/generated/`. Preserve the existing `JSON.stringify(payload, null, 2) + '\n'` serialization and keep the diff limited to intended records.
- Dossier prose or data only: run `npm run validate:content:strict`.
- Glossary touched: run `npm run aliases:merge` when curated aliases changed, then `npm run validate:glossary`, `npm run validate:content:strict` and `npm run split:content`.
- Figure data or visible rendering changed: run validation, start the local app and inspect the affected route at desktop and mobile widths.
- Type, renderer, route or new figure kind changed: run targeted tests, then the broader gate and browser verification required by `CLAUDE.md`.

A passing validator proves structure, not factual support or editorial quality. Evidence review remains part of the dossier work.
