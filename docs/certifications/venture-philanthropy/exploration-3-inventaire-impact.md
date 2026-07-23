# Rapport d'exploration 3 — Inventaire du contenu impact / philanthropie existant

> [!WARNING]
> **Document historique, supplanté le 2026-07-20.** Il décrit l’architecture antérieure aux migrations des certifications `venture-philanthropy-foundations` et `analyst-foundations` vers des parcours. Ne pas l’utiliser comme état publié ; les références maintenues sont les référentiels des parcours dans `docs/parcours/` et le référentiel professionnel `docs/certifications/REFERENTIEL-VC-ANALYST.md`.

> Rapport complet produit par l'agent d'exploration « Explorer contenus impact existants ». État du dépôt au 2026-07-20.

## Synthèse en une phrase

Le contenu impact/philanthropie existant est **embryonnaire côté pédagogie** (2 leçons impact qui ne sont que des coquilles `upcoming` sans corps, aucun parcours dédié, aucune étude de cas, aucun livrable) mais **relativement riche côté glossaire** (une famille cohérente de ~11 entrées philanthropie/finance à impact déjà rédigées). Rien dans les mémos, simulateurs ni le blog.

## 1. Résultats de la recherche par fichier

| Fichier | Occurrences impact | Nature |
| --- | ---: | --- |
| `data/lessons.json` | 5 mentions | 2 leçons impact stub + mentions dans les leçons de due diligence (ESG ≠ mesure d'impact) |
| `data/parcours/01-le-vc-sans-bullshit.lessons.json` | 1 | uniquement « capital patient » (leçon `ld-what-is-vc`) — hors sujet impact |
| `data/parcours/03` et `04` | 0 | — |
| `data/courses.json` | 0 (mot-clé) | mais le cours `c-analyst-specialties` porte le tag `impact` |
| `data/generated/lessons.index.json` | 3 | reflet des 2 leçons stub |
| `data/glossary.json` | 36 | ~11 entrées impact/philanthropie rédigées |
| `data/sources/canonical-glossary.json` | 48 | registre source des mêmes entrées |
| `data/caseStudies.json` | 0 | aucune étude de cas impact |
| `data/deliverables.json` | 0 | aucun livrable impact |
| `data/simulators.json` | 0 | — |
| `data/memos.json` | 0 | — |
| `data/blog/*.json` | 0 | — |

## 2. Leçons liées à l'impact

Toutes vivent dans `data/lessons.json` (tableau plat de 97 objets).

### 2 leçons impact dédiées (coquilles vides)
Les deux ont `body` vide (`bodyLen: 0`), `readMin: 0`, `status: "upcoming"`, `optional: true`, `contexts.sectors: ["impact"]`, `courseId: "c-analyst-specialties"`, `assessmentId: "analyst-specialty-impact"`, `glossaryRefs: []`.

**`l-specialty-impact-intentionality`** (order 13) — slug `impact-intentionnalite-additionalite`, titre « Intentionnalité, additionalité et théorie du changement », kicker `Impact`, summary « Vérifier que l'objectif d'impact est explicite, matériel pour le modèle et relié à une théorie du changement crédible. », learningOutcomes (« Tester l'intentionnalité d'une stratégie » ; « Distinguer additionalité de l'entreprise et contribution de l'investisseur »), prerequisiteLessonIds `["l-product-analysis"]`.

**`l-specialty-impact-measurement`** (order 14) — slug `impact-materialite-indicateurs-performance`, titre « Matérialité, indicateurs et articulation avec la performance financière », summary « Sélectionner des indicateurs décisionnels et analyser les tensions ou synergies entre impact et performance financière. », learningOutcomes (« Choisir des indicateurs matériels et vérifiables » ; « Intégrer l'impact à la recommandation d'investissement »), prerequisiteLessonIds `["l-specialty-impact-intentionality"]`.

### Leçon adjacente (climat, même patron)
**`l-specialty-climate-impact`** (order 7, coquille vide) — slug `climat-potentiel-reduction-additionalite`, `contexts.sectors: ["climate"]`, `assessmentId: analyst-specialty-climate`. Additionalité sous l'angle climat, pas philanthropie.

### Mentions dans des leçons publiées (ESG ≠ impact)
- **`l-dd-process`** (courseId `c-due-diligence`, publiée) : « la matérialité financière ESG ne permet pas d'affirmer qu'une entreprise produit un impact positif ».
- Une leçon DD financière : « Leur matérialité financière ne constitue pas une mesure d'impact. »
- Un `learningOutcome` « Intégrer la matérialité ESG sans la confondre avec une mesure d'impact ».

## 3. Cours lié à l'impact

**`c-analyst-specialties`** (`data/courses.json`) — slug `specialisations-sectorielles-analyst`, titre « Spécialisations sectorielles de l'Analyst », level `intermediaire`, `durationMin: 0`, tags `["spécialisation","saas","deeptech","climat","santé","impact"]`, 14 `lessonIds` (7 spécialités × 2 leçons), dont les 2 impact en fin de liste.

**Utilisation** (grep sur tout `data/`) : uniquement dans `certifications.json` (jamais dans `parcours.json` ni `paths.json`). Le cours impact n'est référencé dans **aucun parcours ni aucun rayon** — seulement dans la certification pro.

### Rattachement en certification
- Requirement « Spécialité Impact » (`id: specialty-impact`, `courseId: c-analyst-specialties`, `lessonIds: ["l-specialty-impact-intentionality","l-specialty-impact-measurement"]`, `assessmentVariantId: "analyst-specialty-impact"`).
- Variante d'évaluation `analyst-specialty-impact` (`axis: specialty`, `optionId: impact`) : `caseAdaptation` « relier intentionnalité, additionalité, théorie du changement et indicateurs matériels à la recommandation financière ».

## 4. Entrées de glossaire pertinentes

`data/glossary.json` = **381** entrées (`id === slug`). Registre source `data/sources/canonical-glossary.json` (443 entrées). Aucune des entrées impact n'a de `relatedLessonIds` renseigné (`[]`).

Famille impact/philanthropie déjà rédigée :

| slug | Titre canonique | category | aliases |
| --- | --- | --- | --- |
| `venture-philanthropie` | **Venture philanthropie** | Stratégie | venture philanthropy, philanthropie de risque, philanthropie entrepreneuriale, philanthropie à impact, capital-risque philanthropique |
| `investissement-pour-impact` | **Investissement pour l'impact** | Stratégie | investing for impact, investir pour l'impact, investissement au service de l'impact |
| `capital-catalytique` | Capital catalytique | Deal & Structuration | catalytic capital, financement catalytique, finance catalytique |
| `subvention-catalytique` | Subvention catalytique | Deal & Structuration | catalytic grantmaking, catalytic grant, grantmaking catalytique |
| `financement-mixte` | Financement mixte | Deal & Structuration | blended finance, finance mixte, financements mixtes |
| `continuum-du-capital` | Continuum du capital | Stratégie | continuum of capital, spectre du capital |
| `beyond-grants` | Beyond grants | Stratégie | au-delà des subventions, beyond grantmaking |
| `esg-assessment` | ESG assessment | Stratégie | ESG, ESG diligence, ESG-by-Design, évaluation ESG… |
| `sfdr` | Sustainable Finance Disclosure Regulation (SFDR) | Juridique & Fiscalité | règlement SFDR, SFDR |

Ces entrées se référencent mutuellement via `seeAlso` (ex. `venture-philanthropie.seeAlso = [investissement-pour-impact, subvention-catalytique, beyond-grants, continuum-du-capital, money-plus]`). Grappe cohérente déjà en place.

**Termes attendus mais ABSENTS** : pas d'entrée « Impact investing » stricto sensu (porté par `investissement-pour-impact`) ; pas de « Théorie du changement » ; pas de « Finance solidaire » ni « ESUS » ; pas de « Capital patient » (n'existe qu'en corps de `ld-what-is-vc`) ; pas de « mesure d'impact / IMM / SROI / GIIN / IRIS / entreprise à mission / ESS ».

**Sur « Sciences de la décision »** : catégorie **sans rapport avec l'impact** (13 entrées) ; l'occurrence « outcome » vient de `biais-de-resultat` (*outcome bias*). À ne pas confondre avec les « outcomes » d'impact.

## 5. Structure d'un parcours (deux systèmes distincts)

### a) `data/parcours.json` — les 22 parcours (le vrai catalogue)
Clés : `id, slug, family, roadmap, title, hook, kanji, accent, goal, forWhom, level, entryLevel, time, timeFit, recommendedForProfiles, milestone, steps, outcomes, prerequisites`.
- `milestone` : `{ type, label, description }`.
- `steps` : `{ order, type, ref: { kind, id }, label, status }` (type ∈ coeur|bonus|pratique|respiration ; ref.kind ∈ lesson|course|simulator|case|milestone ; status ∈ existant|a-produire).

Les 22 parcours par famille (aucun « impact ») : **decouvrir** (`p-decouvrir-vc`, `p-semaine-vc`) · **entretien** (`p-stage`, `p-entretien-analyst`, `p-entretien-associate`, `p-entretien-principal`) · **levee** (`p-preseed`, `p-seed`, `p-serie-a`, `p-mener-un-tour`, `p-levee-fonds-lp`) · **grade** (`p-meilleur-analyst`, `p-passer-associate`, `p-passer-principal`, `p-penser-gp`) · **maitriser** (`p-term-sheet`, `p-cap-table`, `p-carry`, `p-market-sizing`, `p-unit-economics`) · **express** (`p-express-entretien`, `p-express-lever`).

### b) `data/parcours/*.lessons.json` — 3 registres de leçons « drop-in »
`01-le-vc-sans-bullshit.lessons.json`, `03-lever-son-fonds-lp.lessons.json`, `04-le-standard-francais.lessons.json`. Format : `{ _doc, (register), parcoursId, courseId, lessons[] }`. Préfixes : `ld-*` (parcours 01, 7 leçons), `llp-*` (parcours 03, 3 leçons), `lts-*` (parcours 04, 1 leçon). Les leçons `lea-*` (« Entretien Analyst ») vivent, elles, dans `data/lessons.json`.

## 6. Structure d'un livrable (`data/deliverables.json`)

Tableau de **2** livrables (`todo-ic-simulation`, `todo-these-proprietaire`). Clés : `id`, `slug`, `title`, `kicker` (« Livrable »), `readMin`, `summary`, `brief` (markdown, avec `[[..]]`), **`template`** (`{heading, prompt}[]`), **`rubric`** (`{criterion, check}[]`), **`model`** (`{kind: case|ecosystem, id, note}`), `relatedLessonIds`, `glossaryRefs`, `tags`.

Exemple — `todo-ic-simulation` : slug `simulation-comite-investissement-seed`, `template` de 6 sections (« La recommandation, en une phrase » / « La thèse » / « Ce qui doit être vrai » / « Les risques, et ta réponse » / « Le deal » / « Ce qui me ferait changer d'avis »), `rubric` de 5 critères, `model: { kind: "case", id: "cs-seed-ic", note: "…" }`, `relatedLessonIds: ["l-defending-thesis","l-thesis-anatomy","l-dd-process"]`.

**Lien milestones → livrables** : dans `parcours.json`, un `steps[]` de `ref.kind: "milestone"` porte l'`id` du livrable. Les milestones « a-produire » (ex. `todo-pourquoi-ce-fonds`, `todo-process-levee`, `todo-ecrire-memo`…) sont les 8 livrables restant à écrire signalés dans ETAT.md.

## 7. Structure d'une étude de cas (`data/caseStudies.json`)

Tableau de **6** études (aucune impact). Clés : `id, slug, title, subtitle, kind, company, year, readMin, summary, tags, glossaryRefs, sections, takeaways`.
- `kind` (schéma `z.string()`, valeurs actuelles `fund`|`startup`) ; `cs-seed-ic` sert de modèle-étalon au livrable IC.
- `sections` : `{ heading, body }[]` (body en prose) ; `takeaways` : chaînes.

Exemple — `cs-power-law-portfolio` : slug `anatomie-d-un-portefeuille-power-law`, `kind: "fund"`, `company: "Fonds early-stage fictif · 30 lignes"`, `year: 2026`, `readMin: 11`, tags `["power-law","fund-economics","portfolio"]`, glossaryRefs `["power-law","fund-returner","moic","tvpi","follow-on"]`, 4 `sections`, 3 `takeaways`.

Liste des 6 : `cs-power-law-portfolio`, `cs-dilution-journey`, `cs-europe-vs-valley`, `cs-seed-ic`, `cs-liquidation-preference`, `cs-market-sizing-live`.

## 8. Compteurs actuels (`Suivis/ETAT.md`, passe 2026-07-18)

| Collection | Volume |
| --- | ---: |
| Parcours (`parcours.json`) | **22** |
| Domaines (`domains.json`) | 2 (`venture-capital`, `venture-philanthropy` — ce dernier inutilisé) |
| Certifications (`certifications.json`) | **2** |
| Promesses de niveau (`certificationLevels.json`) | 6 (dont 4 sans programme) |
| Chartes candidat | 1 active |
| Évaluations de certification | 1 (Foundations, locale) |
| Rayons Bibliothèque (`paths.json`) | **9** |
| Cours (`courses.json`) | **21** |
| Leçons indexées | **108** (80 disponibles ; **28 `upcoming`, toutes optionnelles**) |
| Termes de glossaire (`glossary.json`) | **381** |
| Registre canonique | 443 |
| Études de cas (`caseStudies.json`) | **6** |
| Livrables (`deliverables.json`) | **2 en ligne + 8 milestones `a-produire`** |
| Blog | 7 publiées + 1 brouillon |
| Écosystèmes | 31 (3 racines + 28 sous-dossiers) |
| Mémos annotés | 5 |
| Anti-portfolio | 9 entrées + 5 motifs |
| Simulateurs | 9 |

## Conclusion pour la suite

**Socle réutilisable** : la grappe glossaire (venture-philanthropie, investissement-pour-impact, capital/subvention-catalytique, financement-mixte, continuum-du-capital, beyond-grants), le domaine `venture-philanthropy` déjà déclaré, le cours-cadre `c-analyst-specialties` avec ses 2 leçons-coquilles + la variante `analyst-specialty-impact`.

**Manque totalement** : les corps des leçons VP, un parcours/option impact, une étude de cas impact, un livrable impact, et plusieurs entrées de glossaire clés (théorie du changement, finance solidaire, ESUS, capital patient, mesure d'impact/IMM, SROI, fonds de dotation, coût complet…).
