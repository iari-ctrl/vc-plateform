> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Rapport d'exploration 2 — Pipeline d'autorat et de validation de contenu

> [!WARNING]
> **Document historique, supplanté le 2026-07-20.** Il décrit l’architecture antérieure aux migrations des certifications `venture-philanthropy-foundations` et `analyst-foundations` vers des parcours. Ne pas l’utiliser comme état publié ; les références maintenues sont les référentiels des parcours dans `docs/parcours/` et le référentiel professionnel `docs/certifications/REFERENTIEL-VC-ANALYST.md`.

> Rapport complet produit par l'agent d'exploration « Explorer pipeline d'édition ». État du dépôt au 2026-07-20.

Plateforme statique React/Vite, **sans CMS ni base de données** : tout le contenu vit dans `data/*.json`, importé dans le bundle client via l'alias Vite `@data`. Toute édition d'un JSON source est reflétée par HMR ; la mise en ligne se fait par commit + PR. Deux collections lourdes (leçons, glossaire) sont **scindées index/contenu** par des scripts `split-*`.

Sources de vérité documentaires : `docs/ARCHITECTURE_EDITION.md` (manuel d'édition), `docs/parcours/README.md` (politiques parcours), `docs/certifications/` (architecture des titres), et le skill `.claude/skills/ecosystemes/SKILL.md` qui **fait foi pour la charte de style** (§4.0.c).

## 1. Conventions d'`id` et de `slug` par collection (§4.0 + valeurs réelles)

Règle générale : `slug` = identifiant d'URL (kebab-case, sans accent), **unique par type** ; `id` = clé interne stable. **Toutes les relations se font par `id`, jamais par slug** (sauf `glossaryRefs[]`/`seeAlso[]` qui référencent des *slugs* de glossaire).

| Collection | Fichier | Préfixe `id` | Exemples réels (`id` → `slug`) |
|---|---|---|---|
| Leçon (bibliothèque) | `data/lessons.json` | `l-`, plus `lpl-`, `lmv-`, `lea-`, `lf-` | `l-power-law` → `la-loi-de-puissance` ; `l-vc-definition` |
| Leçon drop-in (parcours) | `data/parcours/*.lessons.json` | `ld-`, `llp-`, `lts-` | `ld-power-law` ; `llp-pitch` ; `lts-standard-francais` |
| Cours | `data/courses.json` | `c-` | `c-what-is-vc` → `qu-est-ce-que-le-capital-risque` |
| Rayon (Bibliothèque) | `data/paths.json` | court, sans préfixe | `discover`, `vc-craft`, `startup-analysis` |
| Parcours | `data/parcours.json` | `p-` | `p-decouvrir-vc`, `p-entretien-analyst`, `p-term-sheet` |
| Certification | `data/certifications.json` | `cert-` | `cert-analyst-foundations` → `analyst-foundations` |
| Étude de cas | `data/caseStudies.json` | `cs-` | `cs-power-law-portfolio` ; `cs-seed-ic` |
| Livrable | `data/deliverables.json` | `todo-` (= l'`id` du milestone résolu) | `todo-ic-simulation` → `simulation-comite-investissement-seed` |
| Glossaire | `data/glossary.json` | **`id === slug`** (obligatoire, validé) | `moic` → `moic` ; `venture-capital` |
| Mémo | `data/memos.json` | `memo-` | (§4.5quater) |
| Anti-portfolio | `data/antiPortfolio.json` | `ap-` | (§4.5quinquies) |
| Blog / analyse | `data/blog/<slug>.json` | `bp-<slug>` | un fichier par article |

Graphe de relations (par `id`) :
```
Path.courseIds[] → Course.id        Course.lessonIds[] → Lesson.id
Certification requirements → Course.id + sous-ensemble ordonné de Lesson.id
Lesson.courseId → Course.id         Lesson.glossaryRefs[] → Glossary.slug
Deliverable.model{kind,id} → CaseStudy.id | EcosystemDossier.id | Memo.id | Lesson.id
ParcoursStep.ref(milestone).id → Deliverable.id
```

Point important (§4.0.b) : les schémas Zod sont **stricts** (`.strict()`) — tout champ inconnu est rejeté. N'ajoutez pas les champs de la taxonomie cible (`contentKind`, `audience`, `rigor`, `evidenceLevel`) tant que `types.ts` et le validateur ne sont pas migrés.

## 2. Schéma complet du corps d'une leçon

Point capital : **le corps d'une leçon n'est PAS un système de blocs structurés.** C'est un unique champ `body` de type **chaîne Markdown**. Les seuls tableaux structurés d'une leçon sont `quiz`, `keyTakeaways`, `glossaryRefs` et `furtherReading`.

### Schéma Zod (`scripts/validate-content.mjs`, lignes ~153-190)

```
lessonSchema = {
  id: string (non vide),
  slug: string (kebab, unique),
  courseId: string,          // doit exister dans courses.json
  order: entier ≥ 0,
  title: string,
  kicker: string,            // sur-titre (peut être "")
  readMin: nombre ≥ 0,
  summary: string (non vide),
  status: "published" | "upcoming"  (optionnel, défaut "published"),
  level, contexts{fundStages,dealRoles,sectors}, optional,
  learningOutcomes[], prerequisiteLessonIds[], assessmentId   (tous optionnels),
  body: string,              // Markdown — REQUIS si status "published"
  bodyShort: string,         // optionnel
  keyTakeaways: string[],    // REQUIS si status "published"
  glossaryRefs: string[],    // slugs du glossaire (REQUIS, peut être [])
  quiz: QuizQuestion[],      // optionnel (absence = warning, jamais bloquant)
  furtherReading: {label, kind, ref}[]   // optionnel
}
```
Note : les leçons `status: "upcoming"` sont exclues du payload `bodies` par le split (elles n'apparaissent que dans l'index).

### Mini-syntaxe Markdown du `body` (renderer maison : `client/src/lib/markdown.tsx`)

Le renderer est **volontairement minimal**. Les blocs sont séparés par une **ligne vide** (`/\n{2,}/`).

| Bloc | Syntaxe | Rendu |
|---|---|---|
| Titre 2 | `## Titre` | `<h2>` |
| Titre 3 | `### Sous-titre` | `<h3>` |
| Liste à puces | toutes les lignes commencent par `- ` | `<ul>` |
| Liste ordonnée | toutes les lignes matchent `^\d+\.\s` | `<ol>` |
| Paragraphe | tout le reste | `<p>` |

Inline :

| Syntaxe | Rendu |
|---|---|
| `**gras**` | `<strong>` |
| `*italique*` | `<em>` |
| `[texte](url)` | lien externe (nouvel onglet) |
| `[[slug]]` ou `[[slug\|libellé]]` | lien dictionnaire inline — **termes VC** |
| `{{slug}}` ou `{{slug\|libellé}}` | lien dictionnaire inline — **fonds, outils, institutions** |

**Ce qui N'EST PAS supporté** (pièges d'autorat) : pas de tableaux, pas de callouts/admonitions, pas de blocs de code (```), pas d'images, pas de citations `>`, **pas de règle horizontale** (un `---` sur sa propre ligne est rendu littéralement en paragraphe).

**Auto-détection glossaire** : dans la prose des leçons, la **première occurrence** de tout terme ou alias du glossaire devient automatiquement un popover, même sans balise. Les marqueurs manuels `[[..]]`/`{{..}}` sont prioritaires. Les sigles (VC, MOIC, DPI…) sont reconnus **en respectant la casse**. Le `slug` d'un marqueur `[[..]]` doit exister dans `glossary.json`, sinon le libellé s'affiche en texte simple (validé par `validate:content`).

### Exemple réel complet
Leçon `lts-standard-francais` (`data/parcours/04-le-standard-francais.lessons.json`) : objet complet avec en-tête, `body` Markdown long (titres `##`/`###`, listes `-`, gras/italique, marqueurs `[[liquidation-preference|Liquidation Préférentielle]]`…), `keyTakeaways` (3), `glossaryRefs` (8), `quiz` (2) et `furtherReading: []`.

## 3. Format du quiz (`client/src/components/reading/QuizBlock.tsx`)

Schéma (validateur, `.strict()`) :
```jsonc
{
  "question": "…",                       // non vide
  "options": [                            // ≥ 2 options
    { "text": "…", "correct": false },
    { "text": "…", "correct": true }
  ],
  "explanation": "…"                      // non vide, affichée après validation
}
```
Règle stricte : **exactement une** option `correct: true` par question, sinon erreur bloquante. Une leçon sans quiz ≥ 1 question génère un *soft warning* (backlog éditorial, non bloquant même en `--strict`).

Comportement UI : QCM à validation par question, feedback correct/incorrect avec explication, score final `X / N`. C'est de l'**auto-évaluation** (aucune persistance serveur).

> Note pour les leçons certifiantes : le contrôle qualité du test `certifications.test.ts` (constante `ALL_35_EDITORIAL_ORDER`) impose de fait **4 questions × 3 options** aux 35 leçons Analyst — standard maison à répliquer pour les leçons VP (cf. `references-verifiees.md`).

## 4. Fusion des drop-ins parcours (`scripts/split-lessons.mjs`)

`data/lessons.json` **et** tous les `data/parcours/*.lessons.json` (glob, tri alphabétique) sont concaténés puis scindés :
- `data/generated/lessons.index.json` — tous les champs **sauf** `body`/`bodyShort`/`keyTakeaways`/`quiz`/`furtherReading` (eager).
- `data/generated/lessons.bodies.json` — `{ [slug]: { body, keyTakeaways, bodyShort?, quiz?, furtherReading? } }` (lazy, clé = **slug**).

Conséquences :
- **Ajouter un registre drop-in = déposer `data/parcours/<nom>.lessons.json`** (`{parcoursId, courseId, lessons: [...]}`), auto-chargé. **`parcoursId` est obligatoire** (schéma `parcoursLessonsDocSchema`). → Des leçons non rattachées à un parcours **doivent** vivre dans `data/lessons.json`.
- Le script **échoue si deux leçons partagent le même `slug`**.
- Ne jamais éditer `data/generated/` (hook `block-generated.mjs`).

Le glossaire suit le même modèle via `scripts/split-glossary.mjs` : `data/glossary.json` → `generated/glossary.index.json` + `generated/glossary.defs.json`.

## 5. Workflow glossaire pas-à-pas

**a) Registre d'ingestion durable** — `data/sources/canonical-glossary.json` (443 entrées). Structure d'une entrée :
```jsonc
{
  "canonicalTerm": "Venture Capital",
  "slug": "venture-capital",
  "aliases": ["capital-risque", "VC", "VCs", …],
  "status": "applied",        // draft | needs-review | approved/applied
  "action": "update",         // add | update | merge | skip
  "modules": ["01 - VC Fundamentals", …],
  "sourcePaths": ["Graph/Glossary fr/…/Venture Capital.md"],
  "sourceStatus": "source-backed",
  "category": "Fondations",
  "short": "…", "definition": "…", "example": "…",
  "seeAlso": ["equity", "power-law", …],
  "relatedLessonIds": ["l-vc-definition"],
  "notes": "Décision éditoriale et provenance."
}
```
Sémantique de `action` : `add` = nouvelle fiche ; `update` = enrichir une fiche existante ; `merge` = ajouter les variantes en `aliases` d'une fiche existante (pas de nouvelle fiche) ; `skip` = tracé, non injecté. Règle : « toute variante simple doit devenir un **alias**, pas une fiche autonome ».

**b) Glossaire publié** — `data/glossary.json` (~374-381 termes). Champs : `id` (= `slug`), `term`, `slug`, `latin?`, `category`, `short`, `definition`, `example?`, `link?`, `seeAlso[]`, `relatedLessonIds[]`, `aliases?`. Trié par `term`.

**Procédure de clôture d'une passe glossaire :**
1. Mettre à jour le registre `data/sources/canonical-glossary.json`.
2. Injecter **seulement** les `add`/`update` retenus dans `data/glossary.json`.
3. `npm run aliases:merge` (`scripts/merge-aliases.mjs`) — fusionne les `aliases` du registre dans `glossary.json` (idempotent).
4. `npm run validate:glossary` — slugs uniques, **`id === slug`**, `seeAlso`/`relatedLessonIds` résolus, marqueurs résolus, **absence de collision d'aliases**.
5. `npm run validate:content` puis `npm run split:content`.

## 6. Hooks `.claude/` — ce qui est bloqué

`.claude/settings.json` déclare deux hooks sur `Edit|Write|MultiEdit` :
- **PreToolUse → `.claude/hooks/block-generated.mjs`** : **refuse** (exit 2) toute écriture dont le `file_path` matche `data/generated/`. Message : éditer la source puis lancer `npm run split:content`.
- **PostToolUse → `.claude/hooks/validate-content.mjs`** : après édition d'un `data/**/*.json` (hors `generated/`), relance les splits si nécessaire puis exécute **toujours** `validate-content.mjs`. Un échec renvoie la sortie à Claude (exit 2) **sans annuler l'édition**.

## 7. Politiques parcours (`docs/parcours/README.md` + §4.3bis)

- **Langue** : V1 française uniquement.
- **Progression souple** : les prérequis conseillent un ordre sans jamais verrouiller.
- **Perspective** : `investor` par défaut ; `both` pour les levées ; `founder` possible.
- **Budget-temps** : `data/profileParcours.json.timeCalibration` ; `visibleSteps(p, budget)`.
- **Jalons** : au minimum une **auto-évaluation** ; revue par les pairs possible si un livrable existe.

Un parcours (`data/parcours.json`) **ne stocke aucun contenu**. Format des `steps` et milestones :
```jsonc
"milestone": { "type": "quiz", "label": "…", "description": "…", "evaluation": ["auto"] },
"steps": [
  { "order": 1, "type": "coeur", "ref": { "kind": "lesson", "id": "l-ts-economics" }, "label": "…", "status": "existant", "keystone": true },
  { "order": 2, "type": "pratique", "ref": { "kind": "simulator", "id": "waterfall" }, "label": "…", "status": "existant" }
]
// step.type   : coeur | bonus | pratique | respiration
// ref.kind    : lesson | course | case | simulator | glossary | milestone
// step.status : "existant" | "a-produire"
```

**Livrable via un milestone** (§4.5ter) : un `step` avec `ref.kind: "milestone"` est résolu — **livrable d'abord** (`deliverableById` → `/livrables/:slug`), sinon `lessonById`. Le **`id` du livrable doit être exactement l'`id` du milestone référencé** (préfixe `todo-`). Structure d'un livrable : `id`, `slug`, `title`, `kicker`, `readMin`, `summary`, **`brief`** (Markdown), **`template[]`** (`{heading, prompt}`), **`rubric[]`** (`{criterion, check}`), **`model`** (`{kind: ecosystem|case|memo|lesson, id, note}`), `relatedLessonIds[]`, `glossaryRefs[]`, `tags`.

> Note : la contrainte « `id` livrable = `id` milestone (préfixe `todo-`) » ne vaut que pour un livrable **rattaché à un milestone de parcours**. Un livrable autonome (non référencé par un parcours) n'a **aucune** contrainte de préfixe et est de toute façon listé sur `/livrables`, routé et indexé.

## 8. Check-list de fin de travaux — séquence exacte de commandes

Scripts npm (racine) :
```
split:content           = split:glossary && split:lessons
validate:content        = node scripts/validate-content.mjs
validate:content:strict = node scripts/validate-content.mjs --strict
validate:glossary       = node scripts/validate-glossary.mjs
aliases:merge           = node scripts/merge-aliases.mjs
check   = validate:content:strict && validate:glossary && typecheck && lint && test
```

**Séquence recommandée après édition de `data/*.json` :**
1. `npm run validate:content` (déjà lancé par le hook PostToolUse).
2. Si le glossaire a changé : `npm run aliases:merge` puis `npm run validate:glossary`.
3. `npm run split:content` — régénère `data/generated/`.
4. `npm run check` — gate avant commit/PR.

`predev`/`prebuild` lancent `split:content` automatiquement. En `--strict`, les warnings deviennent bloquants ; les leçons sans quiz restent tolérées (soft warning).

## 9. Charte de style §4.0.c (résumé opérationnel — non négociable)

S'applique à **toute** prose publiée. Source canonique : « Writing style (non-negotiable) » de `.claude/skills/ecosystemes/SKILL.md` + mémoire `style-redaction-naturel`.

Registre visé : **un analyste qui rédige un mémo, pas un copywriter qui vend.**
- **Ton sobre, factuel, institutionnel.** Proscrits : sensationnalisme, promotion, dramatisation, survente, superlatifs, urgence artificielle, slogans, appels à l'adhésion, prose LLM stéréotypée.
- **Prose fluide, longueurs de phrases variées.** Ouvertures *in medias res*, sans mise en bouche.
- **Une idée par paragraphe**, énoncée puis étayée ; chaque phrase apporte une info neuve.
- **Bannir les tics d'IA** : énumérations mécaniques, punchline en fin de paragraphe, surdensité de deux-points/tirets/appositions, gras multiples, méta-discours.
- **Ne pas survendre** : pas de métaphores vendeuses, superlatifs, dramatisation, aphorismes de clôture, adverbes qui dictent au lecteur ce qu'il doit ressentir.
- **Énoncer le fait, donner le chiffre avec sa source, en tirer la conséquence en mots simples, s'arrêter.**
- **Grounding** : aucun chiffre sans source vérifiée ; préférer l'ordre de grandeur honnête à la fausse précision.

## Fichiers de référence

- `docs/ARCHITECTURE_EDITION.md` (§2 cycle de vie, §4.0 conventions, §4.0.c style, §4.1 leçons, §4.2 glossaire, §4.3bis parcours, §4.4 cours, §4.5ter livrables, §4.5septies certifications, §4.8 checklist)
- `docs/parcours/README.md`
- `client/src/lib/markdown.tsx` (renderer du `body`)
- `client/src/components/reading/QuizBlock.tsx`
- `scripts/split-lessons.mjs`, `split-glossary.mjs`, `merge-aliases.mjs`, `validate-glossary.mjs`, `validate-content.mjs` (schéma leçon/quiz lignes ~141-190)
- `.claude/settings.json`, `.claude/hooks/block-generated.mjs`, `.claude/hooks/validate-content.mjs`
- Types : `client/src/content/types.ts`, `certificationTypes.ts`, `parcoursTypes.ts`
