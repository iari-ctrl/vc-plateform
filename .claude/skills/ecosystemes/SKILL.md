---
name: ecosystemes
description: "Research, author, revise, structure, source, validate, or illustrate the French « Décortiquer un écosystème » dossiers while enforcing their sober institutional style. Use when working on data/ecosystems.json, the /ecosystemes routes, root or child dossiers, convictions, signals, players, sources, glossary links, or ecosystem figures."
---

# Ecosystem dossiers

Use this playbook for work on the signed, fully client-side dossiers published under `/ecosystemes`.

## Start from maintained sources

- Treat §4.0.c of [`docs/ARCHITECTURE_EDITION.md`](../../../docs/ARCHITECTURE_EDITION.md) as the canonical transverse charter and [`CLAUDE.md`](../../../CLAUDE.md) as its shared operational summary for coding agents. The rules below add ecosystem-specific constraints only. Do not rely on machine-local memories.
- Treat [`data/ecosystems.json`](../../../data/ecosystems.json) as the content source. Check the complete type in [`client/src/content/types.ts`](../../../client/src/content/types.ts) and the executable schema in [`scripts/validate-content.mjs`](../../../scripts/validate-content.mjs) before adding a field or figure kind.
- Use [`client/src/content/ecosystems.ts`](../../../client/src/content/ecosystems.ts) for tree and ordering behavior, and the page and figure renderers for implemented display behavior. If maintained documentation and code disagree, report the drift instead of guessing.

## Model decisions that matter while authoring

- Build the tree with `parentId` and `order`. A root has no `parentId`, is the only level listed on the index, and must carry `these`. A child may omit `these`, `convictions`, `signals`, `players`, and `sources`.
- Keep `sections` non-empty and `glossaryRefs` present, even when the latter is an empty array. Consult the type for the remaining required dossier fields rather than copying a stale template.
- Give each child an explicit integer `order`. Siblings sort by ascending `order`, then by descending `updatedAt`.
- Use `updatedAt` for any substantive revision. Set `verifiedAt` only after rechecking factual claims, figures, periods, scopes, and sources.
- Write new convictions as falsifiable statements with an explicit `strength` and `horizon`. The current model dates the dossier, not each conviction; describe convictions as having an evaluation horizon unless a dedicated formulation date is added. Treat references that call each conviction “dated” as documented drift until the model changes.
- Treat inline `[[slug|label]]` or `{{slug|label}}` markers and `glossaryRefs` as separate surfaces. Markers create links in prose; `glossaryRefs` selects the complementary “Pour aller plus loin” list. Do not force the two sets to match.

## Research and writing

- Apply the editorial rules below to every new or revised thesis, section, conviction, signal, player note, summary, subtitle, label, title, and caption. When editing existing prose, align the touched passage and its immediate context without initiating an unrelated rewrite.
- Write in French with the voice of a professional analyst: correct, sober, factual, direct, precise, concise, and institutional. Keep the syntax natural and the tone measured; avoid familiarity, promotional language, theatrical effects, and bureaucratic heaviness.
- Lead with the information. Do not restate the assignment, announce the plan, add throat-clearing, or append a conclusion that merely repeats the text.
- Give each paragraph one claim. State it, support it at the appropriate evidence level, draw the consequence in plain language when useful, and stop. Remove any sentence that adds tone but no information.
- Separate established facts from interpretation, hypothesis, forecast, and opinion. Qualify uncertainty, keep confidence proportional to the evidence, and never present an inference as a fact.
- Prefer complete sentences, precise verbs, short paragraphs, and naturally varied sentence lengths. Use bullets only for a genuine enumeration; keep explanations in argued prose rather than note-like fragments or bold-label lists.
- Remove formulaic LLM patterns: generic acknowledgements such as “Voici…” or “Bien sûr…”, hollow openings such as “Il est important de noter que…” or “Dans un monde en constante évolution…”, meta-discourse such as “Notre lecture :”, mechanical “Premièrement / Deuxièmement”, repeated three-part structures, paragraph-ending punchlines, rhetorical questions, attention hooks, and calls to agreement.
- Remove rhetorical and visual dressing: slogans, superlatives, artificial urgency, suspense, dramatization, selling metaphors, network-marketing rhetoric, aphoristic conclusions, editorializing adverbs, buzzword padding, and excessive bold, colons, em dashes, parentheses, or appositions.
- Keep titles and captions descriptive rather than performative. Name what is shown; do not turn a heading into a slogan or an unsupported thesis.
- Formulate the root thesis so evidence could confirm or invalidate it. Let child dossiers deepen one bounded question instead of repeating the parent or overloading one page.
- Verify identifiable facts, figures, and studies against current primary or institutional sources and cite them precisely. For quantitative claims, record both publication date and data period; use exact `YYYY-MM-DD` dates where the model expects them, and state geography, population, currency, and other material scope limits. Check calendar validity manually because the current schema only validates the date prefix.
- Prefer an honest order of magnitude to false precision. Keep one coherent methodology per quantitative series. A multi-source comparison is acceptable only when definitions, periods, scopes, and normalization are made explicit.
- Cite absolute, safe `https:` source URLs in `sources[]`; the current schema only checks that a URL string is non-empty. For a quantitative figure, also provide a concise `figure.source` that identifies the dataset or publication used.

Before saving, reread every changed passage and delete repetition, filler, unsupported intensifiers, ornamental adjectives or adverbs, and template-like transitions. If a sentence sounds like copy, a slogan, or a generic model completion, rewrite it as a precise statement supported at the appropriate evidence level.

## Figures

Attach figures through `section.figures`; prose Markdown does not render images, raw HTML/SVG, or tables. The native kinds are:

- `bars`: at least one `{ label, value, valueLabel?, highlight? }`, with `unit?`;
- `line`: at least two `{ x, y, annotation? }` points, with `unit?`;
- `matrix`: at least two columns and one row; every row must contain exactly one cell per column;
- `quadrant`: at least one item; keep every `x` and `y` within `[0,1]`;
- `taxonomy`: a root and at least one branch.

Check matrix width and quadrant bounds manually: the current Zod schema does not enforce either invariant, and the quadrant renderer silently clamps out-of-range values.

Use `title`, `caption?`, and `source?` as plain text. Never place glossary markers in figure text: valid markers would render literally, while unresolved markers fail content validation.

Keep the essential conclusion and important quantitative values available in the surrounding prose or caption. The current figure container exposes only a short image label to assistive technology, and the line renderer does not display Y-axis ticks or its unit; do not make the graphic the sole carrier of information.

Adding a figure kind requires synchronized changes to the TypeScript union, the Zod discriminated union, and `EcosystemFigureView`. Replace the dispatcher's current silent fall-through with an `assertNever`-style exhaustive guard so an omitted renderer case cannot disappear silently.

## Glossary changes

- Reuse an existing term whenever possible. Dossier prose does not auto-link aliases, so add explicit markers where a link is editorially useful.
- Add a genuinely missing term through the two-layer workflow in §4.2 of [`docs/ARCHITECTURE_EDITION.md`](../../../docs/ARCHITECTURE_EDITION.md): update `data/sources/canonical-glossary.json`, align `data/glossary.json`, merge curated aliases when relevant, validate the published collection, then regenerate the glossary split files. Manually verify register-to-published alignment because no current validator compares the two layers.
- Preserve the surrounding file order during a bounded edit. The maintained contract intends ordering by `term`, but the current file contains ordering drift; report it instead of mass-reordering opportunistically, and never sort the collection by slug.

## Edit and validate proportionately

- Edit source files only. Never hand-edit `data/generated/`. Preserve the existing `JSON.stringify(payload, null, 2) + '\n'` serialization and keep the diff limited to the intended records.
- Dossier prose or data only: run `npm run validate:content:strict`.
- Glossary touched: run `npm run aliases:merge` when curated aliases changed, then `npm run validate:glossary`, `npm run validate:content:strict`, and `npm run split:content`.
- Figure data or any visible rendering changed: run the relevant validation, start the local app, and inspect the affected route at desktop and mobile widths.
- Type, renderer, route, or new figure kind changed: run targeted tests as needed, then `npm run check`, `npm run build`, and the browser verification required by `CLAUDE.md`.

Do not treat a passing validator as evidence that claims are current or well sourced; factual verification remains an editorial responsibility.
