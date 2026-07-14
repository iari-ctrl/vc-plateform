# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A fully static VC ("venture capital") intelligence and learning platform: an ikigai-style introspection onboarding, a personalized learning catalog (parcours / courses / lessons), a glossary, case studies, simulators, signed ecosystem analyses, and a blog. Editorial content is the product — most of the codebase exists to author, validate, ship, and render it.

npm **workspaces** monorepo (`client`), ESM everywhere (`"type": "module"`), Node ≥ 20.

## Commands

```bash
npm install                       # installs client workspace
npm run dev                       # client (Vite :5173)

npm run build                     # prebuild hook: split:content → validate:content → generate:sitemap, then vite(client)
npm run lint                      # ESLint
npm run validate:content          # shape + cross-references + [[glossary]] markers; non-zero exit on error
npm run validate:content:strict   # warnings become fatal (run locally before publishing)

# tests
npm run test --workspace client   # Vitest (profile/ikigai, simulators, url safety…)
npx vitest run path/to/file       # single test file
```

## Architecture — the parts that span files

**Content-as-data is the core idea.** `/data/*.json` plus split collections such as `/data/blog/*.json` are the single canonical source of truth for editorial content. The **client bundles them** so the site is fully usable offline / as a guest with no auth wall. When changing content, edit the JSON sources — not the rendered pages.

**Some `data/*.json` files are generated — never hand-edit them.** `scripts/split-*.mjs` split heavy collections into a light eager index + a lazy body chunk, committed so a fresh checkout resolves imports without a build step:
- `data/lessons.json` + `data/parcours/*.lessons.json` → `data/generated/lessons.index.json` (hot path) + `data/generated/lessons.bodies.json` (lazy reader payload)
- `data/glossary.json` → `data/generated/glossary.index.json` + `data/generated/glossary.defs.json`

Edit the sources; regenerate with `npm run split:content` (also auto-run by `predev`/`prebuild`). Note: drop-in parcours lessons (`ld-*`/`lea-*`) are **not** in canonical `lessons.json`; the split folds them into the generated index and the client serves them from there.

Blog analyses are authored as one file per article in `data/blog/<slug>.json`; the client loader recomposes the sorted list at runtime.

**Content validation gates the build.** `scripts/validate-content.mjs` (Zod) checks three layers: shape, cross-file references (every `pathId`/`courseId`/`lessonIds`/`glossaryRefs`/`furtherReading.ref`/etc. resolves, ids/slugs unique), and inline markers (`[[slug|label]]` / `{{slug|label}}` resolve to a glossary slug). Three tiers: errors (always fatal), warnings (fatal under `--strict`), softWarnings (acknowledged backlog, never fatal). It runs in `prebuild`, so a broken reference fails the build.

**Client data fetching: 100% static.** There is no backend, API, or database — the Express/Prisma server was removed in the July 2026 migration. The client bundles the `/data` JSON directly and renders it; user data (profile, notes, bookmarks, progress, decision journal) is stored strictly in `localStorage`. There is no auth wall and no network dependency.

**Route taxonomy is centralized in `shared/routes.mjs`** — a cross-runtime module (runs in Node *and* the Vite bundle), so it is **pure data + pure functions, zero deps, no TypeScript** (types mirrored in `routes.d.mts`). It is the single source for the noindex segment list (drives both robots.txt `Disallow` and the client's automatic `noindex`) and the OG-image-by-segment map. Adding a private surface or a social card means editing here, not three places.

**Language contract.** The current product is French-only. Routes are canonical and unprefixed (`/home`, `/parcours/...`, `/blog/...`); there is no dormant locale router or localized-text wrapper. Do not add `/fr` or `/en` prefixes without an explicit product decision and a complete routing/content migration.

**Path aliases** (Vite + tsconfig): `@` → `client/src`, `@data` → repo `/data`, `@shared` → `/shared`.

**Bundle discipline.** `client/src/content/index.ts` is a barrel of per-collection modules so Rollup can code-split each JSON collection. Eagerly-loaded surfaces (HomePage, cards, command palette, atlas) should import from the **specific** module (or `./labels` for JSON-free helpers), not the barrel, to keep collections out of the entry chunk. `searchLocal` is deliberately not re-exported (lazy-only). React/Router are pinned into a stable `react-vendor` chunk.

## Writing style is a hard constraint

This applies to **everything you write** — analyses, ecosystem dossiers, blog posts, lessons, glossary entries, parcours, and any prose response or note. It is the rule most often violated; treat it as non-negotiable, not aspirational.

**Register.** Formal, academic tone: precise vocabulary, careful syntax, no colloquialisms. No figures of speech, no suspense, no attention-grabbing hooks or punchlines.

**Level of detail.** Match length and depth to the request — do not develop more than necessary, but treat the question fully when it warrants it.

**Form.**
- Go straight to the information. No introduction announcing what you will say, no conclusion restating what you just said — unless explicitly asked for one.
- Favor argued prose. Use bullet points and tables only when genuinely necessary for clarity.
- Cite sources when relying on facts, data, or identifiable work; state precisely where the information comes from.
- Clearly distinguish established facts from interpretations, hypotheses, or opinions.
- Do not open by restating the question, and avoid transitional openers ("Here is…", "Sure…", "Voici…").

**AI tics to ban** (on top of the above): formulaic enumerations ("Premier… Deuxième…"), a punchline at the end of every paragraph, over-density of bold/colons/em-dashes/appositions, meta-discourse ("Notre lecture:"). **No overselling**: selling metaphors, superlatives, dramatization, closing aphorisms, editorializing adverbs that tell the reader how to feel. State the fact, give the figure with its source, draw the consequence in plain words, stop.

Fuller reference: the "Writing style" / "Sober register" section of `.claude/skills/ecosystemes/SKILL.md`, plus the `style-redaction-naturel` and `style-prose-analyse` memories. Read the `ecosystemes` skill before authoring or editing any ecosystem dossier — it documents the data shape, validation rules, and native figure types, and prevents re-exploring the code each time.

## Reference docs — where each fact lives

One fact lives in one place. Reference (must stay true) is separated from state (a small replaceable snapshot) and journal (append-only). When facts and docs disagree, the code wins; verify against `client/`, `data/`, `shared/routes.mjs` and `package.json`.

- `docs/ARCHITECTURE_EDITION.md` — authoring manual: content lifecycle, per-collection editing guides, id/slug conventions, the writing-style charter (§4.0.c). Read before authoring content.
- `docs/DESIGN_SYSTEM.md` — visual/interaction system: tokens, components, ornaments, motion, accessibility.
- `docs/STRATEGIE-vc-intelligence.md` — maintained product direction and remaining strategic priorities.
- `docs/parcours/README.md` — current parcours policies and authoring contract. Superseded drafts live under `docs/archive/parcours/`.
- `Suivis/ETAT.md` — current verified state: content counts (pasted from `validate:content`), latest checks, risks, priorities. The **only** place counts live.
- `Suivis/JOURNAL.md` — dated, append-only work log (post-migration only).
- `Suivis/PROCEDURE_PUSH.md` — manual publish runbook.

The optional publishing workflow is manual and invokes the root build lifecycle, including content splitting, validation, sitemap generation, Vite build and prerendering. Run `npm run check` locally before publishing (see `Suivis/PROCEDURE_PUSH.md`).

Material under `docs/archive/` and dated audits under `Suivis/AUDIT/` is historical context, never current specification. Use `ETAT.md`, `JOURNAL.md` and the maintained reference docs above.
