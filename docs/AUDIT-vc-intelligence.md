# Audit & Repositioning Plan — VC Premium Platform → VC-First Professional Intelligence Platform

**Date:** 2026-06-10 · **Scope:** audit only, no files modified.
**Evidence base:** `/data/*.json`, `client/src` (App.tsx routes, SideNav, HomePage, content loaders), `server/src` (content.ts, admin.ts, prisma schema), `scripts/validate-*.mjs`, README.

---

## 1. Diagnosis of current positioning

What the platform *is today*: a **career-entry and orientation platform for people who want to get into VC**, with a founder-fundraising side wing — wrapped in a genuinely premium editorial shell.

Evidence:

- **Homepage promise** is introspection-first: "Commencer l'introspection", "du débutant curieux au principal en devenir", "École privée · memo d'investissement · carnet de réflexion". The hero CTA routes to ikigai onboarding, not to any intelligence surface.
- **Parcours catalogue (22 parcours, 5 families):** `decouvrir` (2) targets "Curieux, Étudiants, Reconvertis"; `entretien` (4 + "l'entretien VC en 1h") targets job applicants; `levee` (5 of 6) targets **founders** ("Préparer ma pré-seed/seed/Série A", "Mener un tour de table"); only `grade` (4) and `maitriser` (~5) speak to working investors.
- **Lessons (~76):** a strong fundamentals spine, but a large fraction serves interview prep ("Le mock complet", "Pitch me a company", "why this fund / why you") and founder mechanics ("Lever sans se faire diluer bêtement", "Les 5 erreurs mortelles de data room").
- **"Analyses" (blog):** 4 posts, categories *Réflexion / Manifeste / Méthode*. These are brand essays. The nav label "Analyses" promises market analysis the section does not deliver — the single biggest gap between label and substance.
- **Case studies:** 4, all explicitly fictional ("Fonds early-stage fictif", "Series B fictive"). Honest and pedagogically sound, but they are teaching devices, not intelligence.
- **Already investor-grade:** the 7 simulators (waterfall, DPI/TVPI/MOIC, management fees, dilution), the 357-term glossary, fund-economics/thesis/term-sheet lessons, the "Penser comme un GP" parcours, and — notably — `profileParcours.json` archetypes ("L'Architecte de Thèse", "Le Bâtisseur d'Infrastructure", "L'Opérateur-Investisseur"), which are already thesis-framed.

**Verdict:** the architecture (canonical JSON, glossary markers, validation, simulators, editorial system) can carry an intelligence platform. The *content mix and the framing* cannot, yet. Roughly 40–50% of the parcours surface serves audiences outside the target (applicants, founders). This is a repositioning problem, not a rebuild problem.

## 2. What feels too learning / beginner / founder oriented

**Learning-platform signals (structural):**
- The entire IA is organized around *progression through a curriculum*: Parcours → Bibliothèque → Leçon → Quiz. There is no destination for a professional who arrives knowing the fundamentals.
- Onboarding is mandatory-feeling self-discovery ("pourquoi le venture vous attire"). A partner at a CVC does not need to discover whether VC attracts them.
- Quizzes as the default milestone type; "niveau débutant/intermédiaire/avancé" as the primary content dimension.

**Beginner-oriented signals (editorial):**
- "Le VC sans bullshit", "Une semaine dans la peau d'un VC", "lire un cap table **sans paniquer**", "le carry **enfin clair**" — titles written for outsiders looking in. Fine content, wrong register for the stated audience.
- Homepage meta description: "plateforme éditoriale d'introspection et d'apprentissage".

**Founder-oriented signals (most off-target):**
- The whole `levee` family except "Lever son fonds (LPs & Institutions)" is "how to raise funds" — explicitly excluded by the positioning rules.
- Course "Lever des fonds, côté fondateur"; lessons on data rooms, BSA-AIR vs OC from the founder's seat.
- The `entretien` family ("Décrocher un stage en VC") serves aspirants, not professionals. Legitimate secondary audience, currently occupying primary navigation real estate.

## 3. What should evolve toward investor-grade intelligence

- **"Analyses" → a real research section.** Sector notes, market structure analysis, thesis critiques, fund-strategy commentary. The blog model (`RawBlog`) already supports it; the editorial line doesn't.
- **Case studies → decision-grade format.** Keep the fictional pedagogical ones, but the format should become: context → why now → deal dynamics → the decision and its alternatives → outcome → pattern extracted. Real, sourced cases where possible; clearly-labeled stylized cases otherwise. Never invented data presented as fact.
- **The "Atlas" metaphor is already in the codebase** (`PathAtlas.tsx`, "carte des parcours") — but it maps *the curriculum*, not *markets*. Redirect the metaphor to its natural target: a Market & Ecosystem Atlas (geographies, stages, ecosystems, capital flows as analytical essays, not fake dashboards).
- **Thesis thinking exists as lessons** ("Anatomie d'une thèse", "Défendre une thèse") and as onboarding archetypes. It should become a *destination*: a Thesis Lab where theses are built, stress-tested, and compared — the most differentiating pillar available with current assets.
- **Simulators → decision-support tools.** They're already the most investor-grade asset. Frame them as desk tools ("model a waterfall before the board meeting"), not exercises.
- **Glossary → professional reference.** 357 terms is real depth. Keep glossary markers as the connective tissue across all new pillars.
- **Fundamentals stay — rewritten with professional sharpness**, per positioning rules. "Le VC sans bullshit" can remain as an on-ramp; it should stop being the storefront.

## 4. Recommended information architecture

Current nav: Parcours · Bibliothèque · Dictionnaire · Simulateurs · Analyses | Dashboard · Notes.

Proposed primary nav (guest-visible, investor-first order):

| # | Section | Route | Status |
|---|---------|-------|--------|
| 1 | **Intelligence** (research notes + sector intelligence) | `/research` (evolves `/blog`) | Relabel + editorial reset |
| 2 | **Atlas** (markets & ecosystems) | `/atlas` | New pillar, new collection |
| 3 | **Thesis Lab** | `/theses` | New pillar, new collection |
| 4 | **Cases** | `/cases` (exists, currently redirects to bibliothèque) | Promote to first-class index |
| 5 | **Tools** (simulators) | `/simulators` | Keep, reframe copy |
| 6 | **Library** (parcours + cours + frameworks + playbooks) | `/library` (merges `/paths` + `/bibliotheque`) | Demote learning from hero to pillar |
| 7 | **Glossary** | `/glossary` | Keep |
| — | **Workspace** (dashboard + notes + bookmarks + thesis drafts) | `/workspace` | Personal layer, evolves dashboard |

Principles: learning is *inside* the platform, no longer *the* platform. The ikigai orientation survives as an optional entry experience ("find your investor profile"), reachable from Home and Library — not the forced front door. Every legacy route gets a redirect (the codebase already has the pattern: `cases` → `bibliotheque`).

## 5. Revised content taxonomy

Add a metadata layer to canonical JSON rather than restructuring files (small, reversible, validation-friendly):

- **`contentKind`**: `fundamental` · `playbook` · `atlas` · `sector-note` · `thesis` · `case` · `framework` · `tool` · `research-note` · `reference`
- **`audience`**: `investor` · `aspiring-investor` · `founder-facing` · `all` — makes the off-target content *visible and filterable* instead of deleting it
- **`rigor`**: `intro` · `practitioner` · `desk-reference` — replaces "débutant/avancé" as the public-facing dimension (keep `level` internally; don't break validation)
- **Parcours families reclassified:** `decouvrir` → *Fundamentals*; `maitriser` → *Core craft*; `grade` → *Investor development*; `entretien` → *Careers* (secondary shelf); `levee` founder-paths → either reframed as "Inside the raise — the investor's view of each stage" or tagged `founder-facing` and shelved out of primary nav. "Lever son fonds (LPs & Institutions)" moves to *Fund management* — it's GP content, the best-positioned parcours in the family.

## 6. Priority content pillars

1. **Thesis Lab** — highest differentiation, builds directly on existing lessons + archetypes; format: thesis statement, market logic, why-now, risk profile, ownership/exit logic, falsification criteria.
2. **Research / Intelligence** — relaunch of "Analyses" with 3–5 genuinely analytical pieces; this fixes the worst label/substance gap fastest.
3. **Market & Ecosystem Atlas** — start with 2–3 deeply-done ecosystem essays (e.g., the European seed market structure the existing case study already sketches), not a fake comprehensive map.
4. **Framework Library** — extract the frameworks already buried in lessons ("La grille de l'investisseur", "L'art de formuler les trois risques", market sizing, due-diligence prioritization) into standalone reference cards.
5. **Investor Playbooks** — operational sequences (running DD, reserve allocation, follow-on decisions); the `parcours` step model ("coeur/bonus/pratique") can carry these with a different skin.

Case studies and simulators are strengthened in place, not new pillars. **Sequence the pillars; do not open all five at once** — see §10 and the capacity warning in "Weak assumptions".

## 7. Key user journeys

**VC professional (associate/principal):** lands on a sector note shared by a colleague → glossary markers deepen reading → pivots to the related thesis in Thesis Lab → opens the fund-returns simulator to test the portfolio math → saves the framework card to Workspace. *Never touches onboarding or a quiz.*

**CVC / corporate investor:** arrives with a mandate question ("should we have a thesis on X?") → Atlas essay on the ecosystem → Thesis Lab worked example with explicit risk profile and exit logic → case study of a comparable deal → exports notes for an internal memo. Needs: credibility, sourcing, no startup-jargon cheerleading.

**Serious VC enthusiast:** the current happy path, preserved — optional ikigai orientation → Fundamentals parcours → graduates into Research and Cases. The enthusiast's journey now *ends inside the professional surface* instead of ending at a quiz.

**Thesis-driven reader:** subscribes mentally to one domain → reads every artifact through that lens: sector note → thesis → counter-thesis → cases that confirm/falsify → simulator to pressure-test assumptions → maintains a thesis draft in Workspace. This journey is the product's long-term identity; the cross-linking machinery (glossary refs, relatedLessonIds) already exists to support it.

## 8. Proposed hierarchy between surfaces

1. **Workspace** (hub for returning professionals: drafts, notes, reading continuity)
2. **Thesis Lab** (differentiating core)
3. **Intelligence / Research notes** (freshness and reason-to-return)
4. **Atlas** (structural backbone the theses and notes anchor to)
5. **Case studies** (evidence layer)
6. **Simulators** (decision-support layer)
7. **Library / learning paths** (development layer — important, no longer the headline)
8. **Glossary** (infrastructure — everywhere, never a destination to "complete")

Dashboard today is progression-centric (lessons done, quiz scores); Workspace inverts it to artifact-centric (what you're building and tracking).

## 9. Technical risks to respect before implementation

**T1 — No version control (critical, blocks everything).** README states no `.git` directory exists despite a `.gitignore`. No repositioning work should start before `git init` + baseline commit. This is the single highest-risk fact in the audit.

**T2 — Three sources of truth (CMS/JSON divergence).** Canonical JSON → seeds SQLite; admin CMS writes to SQLite only and never back to JSON; the client bundles JSON as guest fallback. Any CMS edit is silently destroyed by `db:reset`/`db:seed`, and guests see different content than logged-in users after any CMS edit. Every new collection (theses, atlas, frameworks) widens this fault line. Rule until resolved: **new pillar content is authored in `/data` JSON only; CMS is not extended to new collections yet.**

**T3 — Client/server lesson divergence is already live.** The 20 parcours lessons (`data/parcours/*.lessons.json`) are served client-side via the fallback bundle but are absent from the DB/API (README acknowledges). Server search and admin stats don't see them. Fix or formalize before adding more drop-in content.

**T4 — i18n surface.** `/fr` `/en` routing works, but EN coverage is a 4-entry partial (`parcours.en.json`); Prisma content models have no `locale` column (`@@unique([slug])` blocks per-locale rows — known Phase 4). Every new pillar doubles the future translation debt. Decide: FR-first with EN fallback (current behavior) is acceptable; full EN is explicitly deferred.

**T5 — Validation must lead, not follow.** `validate-content.mjs` (Zod shape + cross-refs + `[[slug|label]]` marker resolution) is the project's strongest guarantee and runs as `prebuild`. New collections that aren't added to it bypass *all* integrity checks. Schema-first: no new JSON file ships without its Zod schema, reference checks, and marker validation.

**T6 — Route/IA legacy entanglement.** `paths.json` (9 legacy paths, now "rayons") vs `parcours.json` (22 parcours) duality; `/paths/:slug` routes intelligently between both; `/cases` already redirects. Renaming nav sections requires redirect discipline and updates to sitemap/SEO meta, i18n route labels, CommandPalette, and search.

**T7 — Rendering mode.** CSR-only; SEO for intelligence content (the pillar most dependent on discoverability/sharing) is weak. Per project rules: do **not** rush SSR/SSG now, but write new pillar pages so the eventual prerender (already analyzed in README as hybrid SSG+CSR) won't require rewrites — keep data loading in the existing `useApiData`-with-fallback pattern.

**T8 — Search integration.** Server search reads denormalized `searchText` columns; client has a separate local search. New collections must be wired into both or they're invisible to ⌘K.

## 10. First 10 execution tasks (ranked by impact × dependency)

| # | Task | Why this order | Risk |
|---|------|----------------|------|
| 1 | `git init`, baseline commit, branch policy | T1; everything else needs a safety net | None |
| 2 | Resolve lesson cohabitation: merge `parcours/*.lessons.json` into the canonical pipeline (script exists: `merge-lessons`), reseed, align server search/stats | T3; fixes live divergence before adding content | Low — validation covers it |
| 3 | Repositioning copy pass: HomePage hero/CTA, SEO meta, README positioning statement — investor-first language, ikigai becomes optional entry | Highest visible impact, zero structural risk, fully reversible | Low |
| 4 | Metadata layer: add `contentKind`/`audience`/`rigor` to schemas + `validate-content.mjs`; tag existing content | Foundation for §5; makes off-target content filterable without deletion | Low — additive fields |
| 5 | IA restructure phase 1: relabel "Analyses"→Research/Intelligence, reorder SideNav investor-first, shelve `entretien`/founder-`levee` to secondary positions, add redirects | Depends on 4 (filtering by audience tag) | Medium — T6 redirect discipline |
| 6 | Define `theses.json` + `atlas.json` + `frameworks.json` schemas, validation, types, content loaders (empty or 1 seed item each) | T5 schema-first; unblocks all pillar authoring | Medium — touches validation, search, i18n fallback |
| 7 | Thesis Lab pilot: 2–3 complete thesis analyses + `/theses` index and detail pages reusing lesson/case rendering machinery | First differentiating artifact; tests the format before scaling | Medium |
| 8 | Research relaunch: 3–5 analytical pieces in the reframed blog collection; retire "Manifeste" from the public category set | Fixes worst label/substance gap; no schema work needed | Low |
| 9 | Case-study format upgrade: decision-grade template, one new sourced case, relabel fictional ones explicitly as "stylized" | Evidence layer for theses | Low |
| 10 | Workspace evolution: dashboard reframed artifact-first (thesis drafts, saved frameworks, reading continuity) | Depends on 6–7 existing | Medium |

Tasks 1–5 are a coherent "reposition without new features" release. Tasks 6–10 open the intelligence pillars.

## 11. Files/folders likely affected in implementation

- **Content:** `data/parcours.json` (family/tags), `data/lessons.json` (merge target), `data/blog.json` (categories), `data/caseStudies.json`; new: `data/theses.json`, `data/atlas.json`, `data/frameworks.json`; `data/parcours.en.json` (labels)
- **Validation:** `scripts/validate-content.mjs` (new schemas, new fields, cross-refs), `scripts/merge-lessons.cjs`
- **Client:** `src/components/chrome/SideNav.tsx`, `src/pages/HomePage.tsx`, `src/App.tsx` (routes + redirects), `src/content/*` (new collection loaders + types), `src/pages/` (ThesisLab, Atlas, Research renames), `src/pages/DashboardPage.tsx`, `src/lib/seo.ts`, `src/i18n/` (route labels), CommandPalette/search wiring
- **Server:** `src/lib/content.ts` (new loaders/types), `src/routes/content.ts` + `search.ts` (new endpoints), `prisma/schema.prisma` + `prisma/seed.ts` (new models — *only if* the API must serve them; guest-bundle-only is a valid first phase and avoids T2)
- **Docs:** `README.md`, `docs/` (this audit, pillar editorial guides)

## 12. Explicitly not prioritized yet

- **SSR/SSG migration, Postgres, production hardening** — README's hybrid analysis stands; revisit at pre-launch.
- **CMS rewrite or JSON write-back** — the right fix (CMS persists to JSON via PR-like flow) is a project of its own; until then, freeze CMS scope (T2).
- **Full EN translation** — FR-first with fallback; translate only the Thesis Lab pilot if an EN audience case appears.
- **Live market data, feeds, dashboards, integrations** — "intelligence" here means analytical rigor, not data terminals; faking data terminals would violate the no-invented-facts rule.
- **Deleting founder/interview content** — tag and shelve it; deletion buys nothing and breaks links.
- **New simulators, AI features, community features, monetization.**

---

## Weak assumptions (flagged, per request)

1. **"VC professionals want learning paths."** Unproven. Professionals may want only Research + Tools + Cases. The plan hedges by demoting, not betting on, the Library.
2. **"Intelligence is credible from a static JSON corpus."** Partially. Frameworks and thesis analysis age well; "sector intelligence" decays. Without an update cadence (even quarterly), the Intelligence pillar will read stale within a year — commit to a cadence or scope it to slow-decay structural analysis.
3. **"The ikigai onboarding survives repositioning."** It's a genuine differentiator for enthusiasts and career-developers, but it's a liability as the front door for a partner-level visitor. The plan assumes "optional entry" resolves this; verify with real users.
4. **Authoring capacity.** Five pillars × professional-grade depth × two locales is a publication, not a feature list. The single biggest threat to this plan is shipping five thin pillars instead of two deep ones. If capacity is constrained: Thesis Lab + Research only, done excellently.
5. **Fictional case studies as "intelligence."** They're honest teaching artifacts, but a CVC reader will discount them. The plan assumes at least some sourced real cases are feasible editorially; if not, the Cases pillar stays a learning asset.
