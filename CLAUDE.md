# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A full-stack VC ("venture capital") learning platform: an ikigai-style introspection onboarding, a personalized learning catalog (parcours / courses / lessons), a glossary, case studies, simulators, signed ecosystem analyses, and a blog. Editorial content is the product — most of the codebase exists to author, validate, ship, and render it.

npm **workspaces** monorepo (`client`, `server`), ESM everywhere (`"type": "module"`), Node ≥ 20.

## Commands

```bash
npm install                       # installs both workspaces
npm run db:setup                  # prisma generate + migrate deploy + seed (run once)
npm run dev                       # client (Vite :5173) + server (Express :4000) together
npm run dev:client | dev:server   # just one side

npm run build                     # prebuild hook: split:content → validate:content → generate:sitemap, then tsc(server)+vite(client)
npm run lint                      # ESLint — CLIENT ONLY (server has no lint script)
npm run validate:content          # shape + cross-references + [[glossary]] markers; non-zero exit on error
npm run validate:content:strict   # warnings become fatal (used by CI)

# tests are per-workspace — there is no root `npm test`
npm run test --workspace client   # Vitest (i18n routing, profile/ikigai, simulators, url safety…)
npm run test --workspace server   # Vitest integration (auth, profile, per-userId isolation)
npx vitest run path/to/file       # single test file (cd into the workspace, or use --root)

npm run db:seed -- --force        # re-seed AND overwrite editable content (default seed is create-if-absent)
npm run db:reset                  # wipe DB then re-seed
npm run content:export            # reverse direction: DB edits (glossary/blog/cases) → JSON sources
```

Server env (optional, read from `server/.env` by a tiny hand-rolled loader — no dotenv): `PORT`, `JWT_SECRET` (a length+denylist guard fails startup in production if weak), `CLIENT_ORIGIN`, `DATABASE_URL`. Defaults are dev-friendly; SQLite `file:./dev.db`.

## Architecture — the parts that span files

**Content-as-data is the core idea.** `/data/*.json` plus split collections such as `/data/blog/*.json` are the single canonical source of truth for editorial content. They are consumed by *both* runtimes: the **client bundles them** (so the site is fully usable offline / as a guest with no auth wall), and the **server seeds the DB from them** (`server/prisma/seed.ts`). When changing content, edit the JSON sources — not the rendered pages.

**Some `data/*.json` files are generated — never hand-edit them.** `scripts/split-*.mjs` split heavy collections into a light eager index + a lazy body chunk, committed so a fresh checkout resolves imports without a build step:
- `data/lessons.json` + `data/parcours/*.lessons.json` → `data/generated/lessons.index.json` (hot path) + `data/generated/lessons.bodies.json` (lazy reader payload)
- `data/glossary.json` → `data/generated/glossary.index.json` + `data/generated/glossary.defs.json`

Edit the sources; regenerate with `npm run split:content` (also auto-run by `predev`/`prebuild`). Note: drop-in parcours lessons (`ld-*`/`lea-*`) are folded into the index by the split and served client-side, but are **not** in canonical `lessons.json` nor seeded — so the API/DB doesn't have them and the client serves them from the bundle fallback.

Blog analyses are authored as one file per article in `data/blog/<slug>.json`; client/server loaders recompose the sorted list at runtime.

**Content validation gates the build.** `scripts/validate-content.mjs` (Zod) checks three layers: shape, cross-file references (every `pathId`/`courseId`/`lessonIds`/`glossaryRefs`/`furtherReading.ref`/etc. resolves, ids/slugs unique), and inline markers (`[[slug|label]]` / `{{slug|label}}` resolve to a glossary slug). Three tiers: errors (always fatal), warnings (fatal under `--strict`), softWarnings (acknowledged backlog, never fatal). It runs in `prebuild`, so a broken reference fails the build.

**Client data fetching: API-first with bundled fallback.** `useApiData(path, fallback)` (TanStack Query) seeds the bundled content as stale initial data — it shows instantly, then a background refetch overlays fresh DB content if the server is reachable (so CMS edits surface on the public site). It is *not* gated on server availability; `AuthContext` invalidates the `['api']` query key when the API (re)appears. An empty/null API response is ignored when the bundle has content, so an un-seeded DB never blanks a page.

**Server.** Express 4 + Prisma 5 (SQLite, swappable for Postgres via the Prisma datasource). The app is built in `server/src/app.ts` *without* `listen` (so integration tests import it directly); `index.ts` owns startup safeguards + `listen`. Every async route handler is wrapped in `ah()` (`lib/async-handler.ts`) — Express 4 doesn't catch async rejections, so an unwrapped `async` handler that throws would crash the process instead of returning 500. Editorial content is stored as indexed columns (title/slug/category/searchText) **plus** a JSON `data` blob holding the full object — pragmatic for SQLite, still queryable, easily migratable.

**Route taxonomy is centralized in `shared/routes.mjs`** — a cross-runtime module (runs in Node *and* the Vite bundle), so it is **pure data + pure functions, zero deps, no TypeScript** (types mirrored in `routes.d.mts`). It is the single source for the noindex segment list (drives both robots.txt `Disallow` and the client's automatic `noindex`) and the OG-image-by-segment map. Adding a private surface or a social card means editing here, not three places.

**i18n.** Every page lives under `/:locale` (`client/src/i18n/`). `DEFAULT_LOCALE = 'fr'`; bare `/` redirects to the detected locale; legacy unprefixed links redirect to `/fr/...`. `EN_ENABLED = false` in `i18n/config.ts` hides the FR/EN switcher until EN content ships (and `<html lang>` stays `fr` under `/en` to not mislead crawlers/screen readers).

**Path aliases** (Vite + tsconfig): `@` → `client/src`, `@data` → repo `/data`, `@shared` → `/shared`. Vite dev server proxies `/api` → `:4000`.

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

## Reference docs

Deeper context lives in `Suivis/` (French): `README.md` (founding principles, stack, verified audit state), `Manuel_Architecture_Edition.md` (authoring manual), `Design_System.md`, plus `docs/` (strategy, i18n architecture, parcours design). CI (`.github/workflows/ci.yml`) chains validate-content → lint → build → client tests → server tests on PRs and pushes to `main`/`master`.
