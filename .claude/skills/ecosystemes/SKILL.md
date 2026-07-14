---
name: ecosystemes
description: "Playbook for researching, writing and illustrating the « Décortiquer un écosystème » dossiers (data/ecosystems.json). Read before creating/editing a dossier, adding a sub-dossier or a figure — saves re-exploring the codebase and avoids validation errors."
trigger: /ecosystemes
---

# /ecosystemes — ecosystem dossiers: methodology & guardrails

The « Décortiquer un écosystème » space (`/ecosystemes`): signed analyses, **100% client-side**, stored in `data/ecosystems.json`. This skill condenses everything needed so you **don't re-explore the code every time** and don't get rejected by validation. Read it fully before starting. (Content prose itself is written in **French** — see the style section.)

## Data model (don't re-derive it)

- Everything lives in **`data/ecosystems.json`**, typed `EcosystemDossier` in [client/src/content/types.ts]. No server table.
- **Tree** via `parentId` + `order` (unlimited depth). A **root** = no `parentId`, **the only kind listed on the index**, and **`these` is required**. A **sub-dossier**: `these`/`convictions`/`signals`/`players`/`sources` are all **optional**.
- Loader helpers: `rootEcosystems()`, `childEcosystems(id)`, `ecosystemAncestors(d)` in [client/src/content/ecosystems.ts].
- Sibling order: ascending `order`, then most-recently-revised first.
- The detail page ([client/src/pages/ecosystems/EcosystemPage.tsx]) renders, in this order: breadcrumb (ancestors) → header → **these** (if present) → **sections** (+ figures) → **convictions** → **signals** → **players** → **« Approfondir »** (children cards) → tags → **sources** → glossaryRefs → "next to dissect".
- Shapes: `Conviction { statement, horizon?, strength: exploratoire|moyenne|forte, rationale? }` · `Signal { label, direction: haussier|baissier|incertain, note }` · `Player { name, role, note }`. `kind` ∈ `geographie|secteur|these`. Dates are ISO `YYYY-MM-DD`. `accent` = hex (children usually inherit the parent's accent for cohesion).

## Figures (charts + diagrams)

- **The in-house markdown renderer ([client/src/lib/markdown.tsx]) ONLY supports**: `##`/`###`, paragraphs, `- ` lists, `1. ` lists, `**bold**`, `*italic*`, `[text](url)`, `[[slug|label]]`, `{{slug|label}}`. **NO images, NO raw HTML/SVG, NO tables.** Visuals therefore cannot be inline markdown → they are **structured figures**.
- Field: `section.figures?: EcosystemFigure[]`, rendered after the prose by [client/src/components/ecosystems/EcosystemFigures.tsx] (`EcosystemFigureView`).
- **5 kinds** (union discriminated by `kind`):
  - `bars` — horizontal bars `{label, value, valueLabel?, highlight?}` + `unit?`.
  - `line` — curve `points: {x, y, annotation?}` (≥ 2).
  - `matrix` — `columns[]` × `rows[{label, cells[{rating: none|low|mid|high, note?}]}]` (dot ratings).
  - `quadrant` — `xAxis:[low,high]`, `yAxis:[low,high]`, `items:[{label, x, y, highlight?}]` with **x,y ∈ [0,1]**.
  - `taxonomy` — `root` + `branches:[{label, note?, items[], highlight?}]`.
- Rendering: bars/matrix/taxonomy in **HTML**; line/quadrant in **SVG**. Colors are **theme-aware** via tokens (`--on-surface`, `--on-surface-variant`, `--outline-variant`, `--surface-container*`) + the dossier `accent`. No external asset, no charting lib.
- ⚠️ **PITFALL**: **never put a `[[slug]]`/`{{slug}}` marker inside figure text** (title/caption/labels/notes). The validator scans the whole JSON and would require them to resolve → failure. Figure text = plain.
- A new figure kind = 3 synchronized edits: the union in [client/src/content/types.ts], the `z.discriminatedUnion` in [scripts/validate-content.mjs], a renderer in `EcosystemFigures.tsx`.

## Editing the JSON without wasting tokens

- Both `data/ecosystems.json` **and** `data/glossary.json` are **exact round-trips** of `JSON.stringify(parsed, null, 2) + '\n'`. Verify first: `node -e "const r=require('fs').readFileSync('data/ecosystems.json','utf8');console.log(r===JSON.stringify(JSON.parse(r),null,2)+'\n')"`.
- So: **mutate via a small throwaway Node script** (`readFileSync` → `JSON.parse` → find by `id` → mutate/`splice` → `writeFileSync(JSON.stringify(arr,null,2)+'\n')`). **Zero spurious diff**, and you avoid matching long escaped strings with the Edit tool (a source of errors and round-trips).
- In strings: **ASCII apostrophes `'`** (match existing content), template literals + `\n\n` for paragraph breaks. Make the script **idempotent** (drop any prior copies before `splice`).

## Validation workflow (every time)

1. `npm run validate:content` — **strict** Zod (`.strict()` everywhere). Checks: parent exists, **no cycle**, root ⇒ `these`, **`glossaryRefs` resolve**, **every `[[slug]]`/`{{slug}}` marker resolves** against the glossary.
2. If the glossary changed: `npm run split:content` (regenerates `data/generated/glossary.index.json` + `data/generated/glossary.defs.json` used at runtime).
3. `cd client && npx tsc --noEmit -p tsconfig.app.json` then `npx eslint <changed files>`; optionally `npm run build`.
4. No headless browser here → visual check via `npm run dev` then `/ecosystemes/<slug>`.

## Glossary

- `data/glossary.json` = flat array of full terms `{id, term, slug, category, short, definition, example?, seeAlso[], relatedLessonIds[], aliases?}`.
- **Only add genuinely-missing VC terms** (the user's standing rule). `seeAlso` must point to existing slugs. `aliases` auto-link **only in lessons** (dossiers don't auto-link → explicit `[[ ]]` markers). Insert in alphabetical slug order.
- List available slugs before writing: `grep -oE '"slug": "[a-z0-9-]+"' data/glossary.json | sort -u`. Reuse existing terms before inventing.

## Research methodology (grounding the analysis)

- **Thesis first.** Every dossier carries a falsifiable thesis + **dated convictions with an explicit confidence level** (never implicit) + signals that will confirm/invalidate them. A conviction is checkable against reality → always give a `horizon`.
- **No number in a chart without grounding it via web search BEFORE drawing it** — a wrong number in a chart is glaring. It's **2026**: always look for the most recent annual reports (e.g. Rock Health year-end, Panorama France HealthTech published in February for year N-1).
- Prefer **orders of magnitude + hedging** ("de l'ordre de", "≈", "une poignée") over false precision. **One consistent source per chart** (don't mix a US-only scope with a global scope in the same bars).
- Cite **primary/institutional sources** in `sources[]` (INSEE, DREES, CNSA, HAS, ameli, Snitem, BfArM, Rock Health, France Biotech/EY, EUR-Lex…).
- **Relative dates → absolute.** **Don't duplicate** an analysis already in a sibling dossier — **cross-reference** it in prose. When a chapter gets too dense → **branch it into sub-dossiers** rather than bloating one page.

## Writing style (non-negotiable)

Content prose is **French**. See the `style-redaction-naturel` memory. In short: flowing prose, **varied sentence length** (short ones. then a long one that takes its time.), **in medias res** openings. **Ban AI tics**: formulaic enumerations ("Premier… Deuxième…"), a punchline at the end of every paragraph, over-density of colons/em-dashes/appositions, multiple bolds per section (one per big idea, or none — except catalogues), meta-discourse ("Notre lecture:"). Lessons woven into the narrative, not numbered.

**Avoid a "vibe-coded" feel — aim for a clean, professional, natural voice.** The text must read like a human analyst wrote it on purpose, not like a model filling a template. Concretely: no hollow filler or throat-clearing ("Il est important de noter que…", "Dans un monde en constante évolution…"), no buzzword padding, no inflated transitions, no symmetric three-item lists for their own sake. Every sentence must carry an idea the reader didn't already have; cut anything that only sounds smart. Make a real claim, back it, move on. The same discipline applies to **code** (figures, scripts): match the surrounding conventions, name things plainly, no decorative abstractions or throwaway hacks — write it as if it ships.

**Sober register — don't oversell (this is where drafts most often fail).** The voice is that of a competent analyst writing a memo, not a copywriter pitching. Be **correct, direct, factual, clear and elegant**, with no unnecessary heaviness. The reader should feel a knowledgeable human wrote it, not a tool reaching for effect. Specifically banned: **selling metaphors** ("le cimetière le mieux documenté", "le naufrage de", "la lanterne rouge", "le juge de paix"); **superlatives and dramatization** ("le plus pur", "spectaculaire", "étonnamment", "le détail qui change tout"); **closing aphorisms / slogans** that crown a paragraph or the article ("utile ne veut pas dire vendable…"); **editorializing adverbs** that tell the reader how to feel. State the fact, give the figure with its source, draw the consequence in plain words, stop. A claim is stronger stated flatly than dressed up — if a sentence sounds like a tagline, rewrite it as a statement. Titles and captions describe what is shown ("Qui porte la distribution, qui maîtrise l'acte"), they don't perform a thesis. Structure stays clean and fluid: short paragraphs, one idea each, easy to read top to bottom.

## Quick recipe — add an illustrated sub-dossier

1. `grep -n '"slug"' data/ecosystems.json` to locate the parent and siblings' `order`.
2. Web-search the numbers → record source + exact year.
3. Node script: `splice` the sub-dossier after the parent (`parentId` + `order`), figures included (figure text free of `[[ ]]`).
4. `[[slug]]` markers only on existing glossary slugs; `glossaryRefs` = those used. Missing VC term? add it to `glossary.json`.
5. `npm run validate:content` → `npm run split:content` (if glossary) → `tsc` → `eslint` → check `/ecosystemes/<slug>`.

## Reference files

- Data: `data/ecosystems.json`, `data/glossary.json`
- Types/loader: [client/src/content/types.ts], [client/src/content/ecosystems.ts]
- Rendering: [client/src/pages/ecosystems/EcosystemPage.tsx], [client/src/components/ecosystems/EcosystemFigures.tsx], [client/src/lib/markdown.tsx]
- Validation: [scripts/validate-content.mjs]
- Related memories: `ecosystem-dossiers-format`, `style-redaction-naturel`, `lectures-obliques-format`
