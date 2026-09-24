> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Baseline brut — finalisation p-serie-a

Lecture seule. Capture réalisée avant toute édition d’implémentation ; les fichiers de plan eux-mêmes peuvent apparaître non suivis après cette capture.

```text
=== CAPTURED_AT ===
2026-07-25 22:03:16 CEST

=== BRANCH ===
master

=== STATUS_SHORT_ALL ===
M CLAUDE.md
 M README.md
 M Suivis/ETAT.md
 M Suivis/JOURNAL.md
 M client/public/sitemap.xml
 M client/src/App.tsx
 M client/src/components/cards.tsx
 M client/src/components/chrome/TopBar.tsx
 M client/src/components/explore/PathAtlas.tsx
 M client/src/components/ikigai/IkigaiCahierSummary.tsx
 M client/src/components/ikigai/cahierSections/dimensions.tsx
 M client/src/components/ikigai/cahierSections/intersections.tsx
 M client/src/components/ikigai/cahierSections/presque.tsx
 M client/src/components/ikigai/cahierUi.tsx
 M client/src/components/reading/QuizBlock.dom.test.tsx
 M client/src/components/reading/QuizBlock.tsx
 M client/src/content/certifications.test.ts
 M client/src/content/learningTime.ts
 M client/src/content/lessons.test.ts
 M client/src/content/parcours.test.ts
 M client/src/content/parcours.ts
 M client/src/content/parcoursTypes.ts
 M client/src/content/types.ts
 M client/src/content/venturePhilanthropyLearning.test.ts
 M client/src/layouts/MainLayout.tsx
 M client/src/lib/learningExports.test.ts
 M client/src/pages/cases/CaseStudyPage.tsx
 M client/src/pages/home/HomePage.tsx
 M client/src/pages/home/SplashPage.tsx
 M client/src/pages/intelligence/DeliverablePage.tsx
 M client/src/pages/learn/CourseDetailPage.tsx
 M client/src/pages/learn/LessonPage.tsx
 M client/src/pages/learn/ParcoursDetailPage.tsx
 M client/src/pages/learn/ParcoursPage.tsx
 M client/src/pages/learn/furtherReadingHref.test.ts
 M client/src/pages/learn/furtherReadingHref.ts
 M client/src/pages/onboarding/OnboardingPage.tsx
 M client/src/pages/onboarding/ProfilePage.tsx
 M client/src/pages/onboarding/ProfileResultPage.tsx
 M client/src/pages/workspace/DashboardPage.tsx
 M data/caseCorrections.json
 M data/caseStudies.json
 M data/courses.json
 M data/deliverables.json
 M data/generated/lessons.bodies.json
 M data/generated/lessons.index.json
 M data/lessons.json
 M data/parcours.json
 M docs/ARCHITECTURE_EDITION.md
 M docs/DESIGN_SYSTEM.md
 M docs/parcours/README.md
 M scripts/generated-content.test.mjs
 M scripts/media-budget.test.mjs
 M scripts/validate-content.mjs
 M scripts/validation-core.mjs
 M scripts/validation-core.test.mjs
 M shared/routes.mjs
?? .hermes/plans/2026-07-23_224703-quiz-lecons-question-par-question.md
?? .hermes/plans/2026-07-23_231441-mini-analyse-stage-vc.md
?? .hermes/plans/2026-07-24_000737-reussir-entretien-analyst.md
?? .hermes/plans/2026-07-24_001520-reussir-entretien-analyst-evidence.md
?? .hermes/plans/2026-07-24_005000-reussir-entretien-analyst-handoff-etape-6.md
?? .hermes/plans/2026-07-24_212102-separer-onboarding-ikigai.md
?? .hermes/plans/2026-07-25_175557-p-serie-a.md
?? .specify/init-options.json
?? .specify/integration.json
?? .specify/integrations/hermes-skill-contract.md
?? .specify/integrations/hermes.manifest.json
?? .specify/integrations/speckit.manifest.json
?? .specify/memory/.constitution-template.json
?? .specify/memory/constitution.md
?? .specify/memory/project-context.md
?? .specify/scripts/bash/check-prerequisites.sh
?? .specify/scripts/bash/common.sh
?? .specify/scripts/bash/create-new-feature.sh
?? .specify/scripts/bash/select-feature.sh
?? .specify/scripts/bash/setup-plan.sh
?? .specify/scripts/bash/setup-tasks.sh
?? .specify/templates/checklist-template.md
?? .specify/templates/constitution-template.md
?? .specify/templates/overrides/plan-template.md
?? .specify/templates/overrides/spec-template.md
?? .specify/templates/overrides/tasks-template.md
?? .specify/templates/plan-template.md
?? .specify/templates/spec-template.md
?? .specify/templates/tasks-template.md
?? .specify/workflows/speckit/workflow.yml
?? .specify/workflows/workflow-registry.json
?? TEASER-HIGGSFIELD.md
?? client/public/downloads/mathematiques-vc/dossier-depart.xlsx
?? client/src/components/explore/PathAtlas.dom.test.tsx
?? client/src/components/ikigai/cahierLayout.dom.test.tsx
?? client/src/content/mathVentureCourse.test.ts
?? client/src/content/parcoursRelations.test.ts
?? client/src/content/parcoursRelations.ts
?? client/src/content/serieAParcours.test.ts
?? client/src/pages/cases/CaseStudyPage.dom.test.tsx
?? client/src/pages/learn/parcoursContextNavigation.dom.test.tsx
?? client/src/pages/onboarding/IkigaiPage.tsx
?? client/src/pages/onboarding/onboardingAndIkigai.dom.test.tsx
?? data/parcours/05-preparer-sa-serie-a.lessons.json
?? data/parcoursRelations.json
?? docs/SPECKIT.md
?? docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md
?? docs/reviews/2026-07-24-evaluation-parcours-lecons.md
?? revue-mathematiques-du-vc.md
?? specs/README.md

=== DIFF_STAT ===
CLAUDE.md                                          |   27 +-
 README.md                                          |    3 +-
 Suivis/ETAT.md                                     |   69 +-
 Suivis/JOURNAL.md                                  |  370 +++++
 client/public/sitemap.xml                          |   90 ++
 client/src/App.tsx                                 |    2 +
 client/src/components/cards.tsx                    |    6 +-
 client/src/components/chrome/TopBar.tsx            |    8 +-
 client/src/components/explore/PathAtlas.tsx        |  245 ++-
 .../src/components/ikigai/IkigaiCahierSummary.tsx  |    6 +-
 .../ikigai/cahierSections/dimensions.tsx           |    2 +-
 .../ikigai/cahierSections/intersections.tsx        |    2 +-
 .../components/ikigai/cahierSections/presque.tsx   |    2 +-
 client/src/components/ikigai/cahierUi.tsx          |    4 +-
 .../src/components/reading/QuizBlock.dom.test.tsx  |   85 +-
 client/src/components/reading/QuizBlock.tsx        |  225 +--
 client/src/content/certifications.test.ts          |    3 +-
 client/src/content/learningTime.ts                 |   54 +-
 client/src/content/lessons.test.ts                 |    2 +-
 client/src/content/parcours.test.ts                |  269 +++-
 client/src/content/parcours.ts                     |  106 ++
 client/src/content/parcoursTypes.ts                |   19 +
 client/src/content/types.ts                        |    2 +-
 .../content/venturePhilanthropyLearning.test.ts    |   14 +-
 client/src/layouts/MainLayout.tsx                  |    6 +-
 client/src/lib/learningExports.test.ts             |   20 +
 client/src/pages/cases/CaseStudyPage.tsx           |   14 +-
 client/src/pages/home/HomePage.tsx                 |    2 +-
 client/src/pages/home/SplashPage.tsx               |    2 +-
 client/src/pages/intelligence/DeliverablePage.tsx  |   51 +-
 client/src/pages/learn/CourseDetailPage.tsx        |   33 +-
 client/src/pages/learn/LessonPage.tsx              |   75 +-
 client/src/pages/learn/ParcoursDetailPage.tsx      |   63 +-
 client/src/pages/learn/ParcoursPage.tsx            |    4 +-
 client/src/pages/learn/furtherReadingHref.test.ts  |   22 +
 client/src/pages/learn/furtherReadingHref.ts       |    6 +-
 client/src/pages/onboarding/OnboardingPage.tsx     |  367 ++---
 client/src/pages/onboarding/ProfilePage.tsx        |    4 +-
 client/src/pages/onboarding/ProfileResultPage.tsx  |    4 +-
 client/src/pages/workspace/DashboardPage.tsx       |    4 +-
 data/caseCorrections.json                          |  101 ++
 data/caseStudies.json                              | 1603 ++++++++++++++++++--
 data/courses.json                                  |   47 +-
 data/deliverables.json                             |  844 +++++++++++
 data/generated/lessons.bodies.json                 | 1358 ++++++++++++++---
 data/generated/lessons.index.json                  |  427 +++++-
 data/lessons.json                                  |  733 +++++----
 data/parcours.json                                 |  325 ++--
 docs/ARCHITECTURE_EDITION.md                       |   16 +-
 docs/DESIGN_SYSTEM.md                              |    7 +-
 docs/parcours/README.md                            |   12 +-
 scripts/generated-content.test.mjs                 |    4 +-
 scripts/media-budget.test.mjs                      |    5 +-
 scripts/validate-content.mjs                       |   65 +-
 scripts/validation-core.mjs                        |   60 +
 scripts/validation-core.test.mjs                   |   61 +
 shared/routes.mjs                                  |    2 +
 57 files changed, 6452 insertions(+), 1510 deletions(-)

=== TARGET_STATUS ===
M Suivis/ETAT.md
 M Suivis/JOURNAL.md
 M client/src/content/learningTime.ts
 M client/src/content/parcours.ts
 M client/src/content/parcoursTypes.ts
 M client/src/content/types.ts
 M client/src/pages/cases/CaseStudyPage.tsx
 M client/src/pages/intelligence/DeliverablePage.tsx
 M client/src/pages/learn/ParcoursDetailPage.tsx
 M data/caseCorrections.json
 M data/caseStudies.json
 M data/courses.json
 M data/deliverables.json
 M data/parcours.json
 M scripts/validate-content.mjs
 M scripts/validation-core.mjs
?? client/src/content/serieAParcours.test.ts
?? data/parcours/05-preparer-sa-serie-a.lessons.json

=== TARGET_DIFF_NUMSTAT ===
58	11	Suivis/ETAT.md
370	0	Suivis/JOURNAL.md
39	15	client/src/content/learningTime.ts
106	0	client/src/content/parcours.ts
19	0	client/src/content/parcoursTypes.ts
1	1	client/src/content/types.ts
11	3	client/src/pages/cases/CaseStudyPage.tsx
44	7	client/src/pages/intelligence/DeliverablePage.tsx
42	21	client/src/pages/learn/ParcoursDetailPage.tsx
101	0	data/caseCorrections.json
1441	162	data/caseStudies.json
39	8	data/courses.json
844	0	data/deliverables.json
173	152	data/parcours.json
55	10	scripts/validate-content.mjs
60	0	scripts/validation-core.mjs

=== UNTRACKED_FILES ===
.hermes/plans/2026-07-23_224703-quiz-lecons-question-par-question.md
.hermes/plans/2026-07-23_231441-mini-analyse-stage-vc.md
.hermes/plans/2026-07-24_000737-reussir-entretien-analyst.md
.hermes/plans/2026-07-24_001520-reussir-entretien-analyst-evidence.md
.hermes/plans/2026-07-24_005000-reussir-entretien-analyst-handoff-etape-6.md
.hermes/plans/2026-07-24_212102-separer-onboarding-ikigai.md
.hermes/plans/2026-07-25_175557-p-serie-a.md
.specify/init-options.json
.specify/integration.json
.specify/integrations/hermes-skill-contract.md
.specify/integrations/hermes.manifest.json
.specify/integrations/speckit.manifest.json
.specify/memory/.constitution-template.json
.specify/memory/constitution.md
.specify/memory/project-context.md
.specify/scripts/bash/check-prerequisites.sh
.specify/scripts/bash/common.sh
.specify/scripts/bash/create-new-feature.sh
.specify/scripts/bash/select-feature.sh
.specify/scripts/bash/setup-plan.sh
.specify/scripts/bash/setup-tasks.sh
.specify/templates/checklist-template.md
.specify/templates/constitution-template.md
.specify/templates/overrides/plan-template.md
.specify/templates/overrides/spec-template.md
.specify/templates/overrides/tasks-template.md
.specify/templates/plan-template.md
.specify/templates/spec-template.md
.specify/templates/tasks-template.md
.specify/workflows/speckit/workflow.yml
.specify/workflows/workflow-registry.json
TEASER-HIGGSFIELD.md
client/public/downloads/mathematiques-vc/dossier-depart.xlsx
client/src/components/explore/PathAtlas.dom.test.tsx
client/src/components/ikigai/cahierLayout.dom.test.tsx
client/src/content/mathVentureCourse.test.ts
client/src/content/parcoursRelations.test.ts
client/src/content/parcoursRelations.ts
client/src/content/serieAParcours.test.ts
client/src/pages/cases/CaseStudyPage.dom.test.tsx
client/src/pages/learn/parcoursContextNavigation.dom.test.tsx
client/src/pages/onboarding/IkigaiPage.tsx
client/src/pages/onboarding/onboardingAndIkigai.dom.test.tsx
data/parcours/05-preparer-sa-serie-a.lessons.json
data/parcoursRelations.json
docs/SPECKIT.md
docs/reviews/2026-07-24-evaluation-parcours-lecons-lisible.md
docs/reviews/2026-07-24-evaluation-parcours-lecons.md
revue-mathematiques-du-vc.md
specs/README.md

=== TARGET_SHA256 ===
d926c04c7eb38f58076dd782e22952943bcceb5883a667fbffe115bb8bcd0e5c  data/parcours.json
5219eb88aacc5fe8bdf7daeab6f4625a581de213158e55cbdbfa1df56b43cd0c  data/courses.json
cffd261c66251e8672daf29b8461f29731f420cd57ece82d3f6812959643dd5f  data/deliverables.json
eedf8e35139de8497a0670424e122a68d25ab811ffde83940048f7dd7c873528  data/caseStudies.json
6529b6bb6363287583f7d5f92d74d15d7d030ea873715b1be3bf2492de6eaa96  data/caseCorrections.json
be714a5d2ca80dcf35b2395b49c60f64eab305ea78f492f4d55daf195bc00dc5  data/simulators.json
1ebfd7dd75525b0aca810af6dddc5f7ebf8400fd29464e46736d921e30676ca6  data/profileParcours.json
b794c944eba6e88ec417535b8eada73ba32ccda7114ccce9219ffa20676a645a  data/parcours/05-preparer-sa-serie-a.lessons.json
c17bf8841438a8891d21eccfb3a28d0036f716d9fe5869c75e70bc9e22b41403  client/src/content/serieAParcours.test.ts
```
