# Rapport d'exploration 1 — Architecture des certifications

> [!WARNING]
> **Document historique, supplanté le 2026-07-20.** Il décrit l’architecture antérieure aux migrations des certifications `venture-philanthropy-foundations` et `analyst-foundations` vers des parcours. Ne pas l’utiliser comme état publié ; les références maintenues sont les référentiels des parcours dans `docs/parcours/` et le référentiel professionnel `docs/certifications/REFERENTIEL-VC-ANALYST.md`.

> Rapport complet produit par l'agent d'exploration « Explorer architecture certifications ». État du dépôt au 2026-07-20.

## 0. Cartographie des fichiers

**Documentation** (`docs/certifications/`)
- `ARCHITECTURE-CERTIFICATIONS.md` — source transverse (ontologie, catégories, échelle, axes, invariants)
- `REFERENTIEL-ANALYST.md` — compétences/contenus/preuves des deux niveaux Analyst
- `GOUVERNANCE-CERTIFICATIONS.md` — régime de délivrance humaine future (inactif)
- `PROTOCOLE-PRODUCTION-ANALYST.md` — méthode de production des futures épreuves

**Données** (`data/`)
- `certifications.json` — les 2 certifications publiées
- `certificationLevels.json` — les 6 promesses de niveaux
- `certificationAssessments.json` — l'évaluation locale Foundations
- `candidateCharters.json` — charte du candidat versionnée

**Modèle & loaders** (`client/src/content/`)
- `certificationTypes.ts` — tous les types TypeScript
- `certifications.ts` — loaders + helpers de résolution
- `certifications.test.ts` — tests de contrats
- `certificationLevels.ts`, `certificationAssessments.ts` — loaders des collections annexes

**Logique locale** (`client/src/lib/`)
- `certificationAssessment.ts` — scoring, tentatives, persistance localStorage
- `certificationAssessment.test.ts` — tests scoring
- `storage.ts` — helpers localStorage

**Pages** (`client/src/pages/certifications/`)
- `CertificationsPage.tsx` — liste
- `CertificationDetailPage.tsx` — fiche (deux variantes selon le type)
- `CertificationLevelsPage.tsx` — page des 6 niveaux
- `CertificationEvaluationPage.tsx` — l'évaluation interactive (quiz + mini-cas)

**Validation & routes**
- `scripts/validate-content.mjs` — validation Zod + références croisées (1729 lignes)
- `scripts/collect-routes.mjs` — génération des routes/prerender
- `shared/routes.mjs` — taxonomie de routes / sitemap / SEO
- `client/src/content/search.ts` — indexation recherche
- `client/src/App.tsx` — routing React

## 1. Invariants documentaires (contrats DOIT / NE DOIT PAS)

### Ontologie (ARCHITECTURE §2)
- Une certification atteste **un résultat évalué** ; elle **ne se confond pas** avec un parcours, la consommation de cours, ou une progression navigateur.
- Une certification **référence** cours et leçons **par identifiant** — elle **ne recopie jamais** leur prose (« pas de second catalogue »).
- Un `CourseRequirement` peut viser tout un cours OU un **sous-ensemble ordonné** de leçons, qui **conserve l'ordre canonique** du cours (ne réordonne jamais).

### Trois catégories éditoriales / deux branches techniques (§3)

| Catégorie éditoriale | Branche technique | Instance |
| --- | --- | --- |
| Certificat de connaissances | `KnowledgeCertification` | `VC Analyst Foundations` |
| Certificat de compétence | `KnowledgeCertification` (à terme) | aucune instance publiée |
| Certification professionnelle | `ProfessionalCertification` | `VC Analyst` (délivrance inactive) |

Contrat : `Certification = KnowledgeCertification | ProfessionalCertification` (union discriminée par `certificateType`). Une durée courte ne transforme pas un résultat de connaissances en certification professionnelle ; la complétion de contenus **n'établit jamais** une compétence professionnelle.

### Échelle à six niveaux (§4)
Ordre invariant : (1) `VC Analyst Foundations`, (2) `VC Analyst`, (3) `VC Associate Foundations`, (4) `VC Associate`, (5) `VC Senior Associate`, (6) `VC Principal`.
- Seuls les niveaux 1 et 2 ont un référentiel engagé.
- Les 4 niveaux supérieurs sont `status: "future"`, **sans** durée, seuil, cours, épreuve ni `certificationId`.
- L'échelle vit dans `certificationLevels.json` et s'affiche sur `/certifications/niveaux` ; elle **ne crée pas** six fiches artificielles.

### Titre professionnel invariant (§5)
- Le titre est **`VC Analyst`**, toujours. Stade, rôle, secteur, géographie, mandat **ne sont jamais concaténés** au titre.
- Une sélection de contexte produit un **supplément structuré** conservé et affiché **séparément** (`CertificationSupplement`).
- Une valeur absente est omise ou marquée « non renseignée » — **jamais inventée**.
- `VC Analyst Foundations` n'utilise **pas** ce mécanisme (socle commun).
- Le helper `certificationDisplayTitle()` retourne toujours `certification.title` en ignorant la sélection ; le validateur impose `title === "VC Analyst"` pour `cert-analyst-vc`.

### Axes de contextualisation (§6)
- **Cible = 5 axes** : stade d'investissement, rôle du fonds, secteur/modèle, cadre juridique/géographique, mandat/stratégie. L'Impact relève du **mandat**, pas d'un secteur.
- **État provisoire = 3 axes** implémentés : `fundStage`, `dealRole`, `specialty` (qui regroupe encore secteurs + Impact).
- **160 compositions** existantes (5 stades incl. « aucun » × 4 rôles incl. « aucun » × 8 spécialités incl. « aucune » = 5×4×8). Aucune migration vers 5 axes dans ce lot.

### Évaluation / délivrance (§8)
- La réussite Foundations produit un **résultat local versionné** ; elle **ne verrouille jamais** l'accès aux contenus et **ne délivre pas** le titre `VC Analyst`.
- L'application **ne verrouille techniquement** ni leçons ni simulateurs.
- La délivrance professionnelle exige décision humaine + contrôle d'identité + registre : régime **inactif** (GOUVERNANCE). Aucun état local ne crée un état certifié.

### Charte du candidat (§9)
Collection versionnée dans `candidateCharters.json`, distincte de la charte éditoriale. Couvre au minimum : authenticité, sources/traçabilité, déclaration IA, confidentialité, conflits d'intérêts, erreurs critiques, responsabilité des données locales. Le navigateur n'est ni confidentiel ni une sauvegarde garantie.

## 2. Modèle TypeScript (`certificationTypes.ts`)

### Types de base / énumérations
```
CertificateType        = 'knowledge' | 'professional'
CertificationStatus    = 'draft' | 'published'
CertificationAvailability = 'in-construction' | 'open' | 'closed'
CertificationAxisId    = 'fundStage' | 'dealRole' | 'specialty'
FundStage              = 'pre-seed' | 'seed' | 'series-a' | 'growth'
DealRole               = 'lead' | 'co-lead' | 'follower'
CertificationSpecialty = 'generalist' | 'saas' | 'deeptech' | 'climate'
                         | 'health-biotech' | 'consumer-marketplaces' | 'impact'
Level (importé)        = 'debutant' | 'intermediaire' | 'avance' | 'tous'
```

### `CertificationBase` (champs communs)
`id`, `slug`, `domainId`, `title`, `shortTitle`, `certificateType`, `status`, `availability`, `issuer`, `targetRoles: string[]`, `level: Level`, `summary`, `competencies: string[]`.

### `KnowledgeCertification extends CertificationBase`
- `certificateType: 'knowledge'`
- `coreRequirements: CourseRequirement[]`
- `assessmentId: string`
- `candidateCharterId: string`
- `candidateCharterVersion: string`

### `ProfessionalCertification extends CertificationBase`
- `certificateType: 'professional'`
- `prerequisiteCertificationId: string`
- `recommendedPreparation: CourseRequirement[]`
- `axes: { fundStage: CertificationAxis<FundStage>; dealRole: CertificationAxis<DealRole>; specialty: CertificationAxis<CertificationSpecialty> }`
- `finalAssessment: FinalAssessment`
- `eligibilityConditions: string[]`
- `criticalErrors: string[]`

### Sous-structures
- `CourseRequirement` = `{ id, courseId, title, summary, lessonIds: string[] }`
- `AxisCourseRequirement extends CourseRequirement` + `{ assessmentVariantId: string }`
- `CertificationOption<T>` = `{ id: T, label, certificateLabel, description, requirement: AxisCourseRequirement }`
- `CertificationAxis<T>` = `{ id: CertificationAxisId, label, description, options: CertificationOption<T>[] }`
- `FinalAssessment` = `{ id, type: 'case-and-oral-defense', title, description, deliverables: string[], rubricId, rubricCriteria: RubricCriterion[], optionVariants: FinalAssessmentVariant[], passingScore: number, criticalCriteriaMustPass: boolean, evaluatorTypes: ('expert'|'jury')[] }`
- `RubricCriterion` = `{ id, label, description, maxScore: number, critical: boolean }`
- `FinalAssessmentVariant` = `{ id, axis: CertificationAxisId, optionId, caseAdaptation, rubricCriteria: string[] }`
- `CertificationSelection` = `{ fundStage?, dealRole?, specialty? }` (tous optionnels)
- `CertificationSupplement` / `CertificationSupplementOption` — restitution du contexte séparée du titre
- `CertificationEnrollment` = `{ certificationId, selection, createdAt, updatedAt }`
- `ResolvedCourseRequirement` — ajoute `source: 'core'|'recommended'|keyof CertificationSelection`, `optionId?`, `assessmentVariantId?`

### Modèle d'évaluation locale (types)
- `CertificationAssessment` — le contrat complet : `exam` (avec `shuffleQuestions: true`, `consultationPolicy: 'not-recommended'`), `miniCases`, `passingRules`, `resourcePolicy`, `attemptPolicy`, `toolDeclaration`.
- `AssessmentQuestion` (QCM) : `{ id, competencyId, prompt, options: {id,label}[], correctOptionId, points, explanation }`
- `NumericAssessmentQuestion` : `{ id, prompt, unit, expectedValue: number, tolerance: {mode:'absolute'|'relative', value}, points, correction }`
- `AssessmentMiniCase` : `{ id, title, scenario, instructions, points, questions: NumericAssessmentQuestion[] }`
- `CertificationLevelPromise`, `CandidateCharter`, `CandidateCharterPrinciple` — pour les collections annexes.

## 3. Données (`data/certifications.json`) — schéma d'une entrée réelle

Le fichier contient **exactement deux entrées** : `cert-analyst-foundations` (knowledge) et `cert-analyst-vc` (professional).

### Exemple complet — entrée `knowledge` (`cert-analyst-foundations`)

```json
{
  "id": "cert-analyst-foundations",
  "slug": "analyst-foundations",
  "domainId": "venture-capital",
  "title": "VC Analyst Foundations",
  "shortTitle": "VC Analyst Foundations",
  "certificateType": "knowledge",
  "status": "published",
  "availability": "open",
  "issuer": "VC Premium Experience",
  "targetRoles": ["Candidat au métier d'Analyst", "Analyst débutant"],
  "level": "debutant",
  "summary": "Vérifier la maîtrise du socle nécessaire pour commencer le métier d'Analyst en capital-risque.",
  "competencies": [ /* 6 items */ ],
  "coreRequirements": [
    {
      "id": "foundations-fund",
      "courseId": "c-what-is-vc",
      "title": "Fondamentaux du capital-risque",
      "summary": "Classe d'actifs, loi de puissance et cycle de vie d'un fonds.",
      "lessonIds": ["l-vc-definition", "l-power-law", "l-fund-lifecycle"]
    }
    /* … 7 blocs au total, 23 leçons distinctes … */
  ],
  "assessmentId": "assessment-analyst-foundations-v1",
  "candidateCharterId": "candidate-charter",
  "candidateCharterVersion": "1.0.0"
}
```

**Les 7 blocs `coreRequirements`** (23 leçons) : `c-what-is-vc` (3), `c-ecosystem` (2), `c-vc-job` (3), `c-deal-flow` (3), `c-mathematiques-vc` (7), `c-investment-recommendation` (1 : `l-fact-hypothesis` seule), `c-professional-integrity` (4).

### Entrée `professional` (`cert-analyst-vc`) — structure

Mêmes champs de base + :
- `prerequisiteCertificationId: "cert-analyst-foundations"`
- `recommendedPreparation` : 3 blocs / 12 leçons (`c-startup-analysis` ×4, `c-due-diligence` ×6, `c-investment-recommendation` ×2 : `l-investment-recommendation`, `l-ic-defense`)
- `axes` : 3 axes contenant **14 options** (`fundStage` ×4, `dealRole` ×3, `specialty` ×7), chaque option ayant un `requirement` de type `AxisCourseRequirement` (avec `assessmentVariantId`). Les 14 options × 2 leçons = **28 leçons optionnelles** (toutes `status: "upcoming"`, `optional: true`). Exemple d'option :

```json
{
  "id": "impact",
  "label": "Impact",
  "certificateLabel": "spécialité Impact",
  "description": "Intentionnalité, additionalité, mesure.",
  "requirement": {
    "id": "specialty-impact",
    "courseId": "c-analyst-specialties",
    "title": "Spécialité Impact",
    "summary": "Intentionnalité, additionalité, théorie du changement, matérialité et indicateurs d'impact.",
    "lessonIds": ["l-specialty-impact-intentionality", "l-specialty-impact-measurement"],
    "assessmentVariantId": "analyst-specialty-impact"
  }
}
```

- `finalAssessment` : `type: "case-and-oral-defense"`, 7 `deliverables`, `rubricId: "rubric-analyst-v1"`, **6 `rubricCriteria`** dont les `maxScore` totalisent **exactement 100** (15+15+15+15+20+20), 4 critiques sur 6, **14 `optionVariants`** (une par option d'axe), `passingScore: 70`, `criticalCriteriaMustPass: true`, `evaluatorTypes: ["expert","jury"]`.
- `eligibilityConditions` (7) et `criticalErrors` (8).

### Référencement des courses/lessons
Les certifications ne portent **jamais** le texte des leçons : elles listent des `courseId` + `lessonIds`. Les évaluations locales (QCM/mini-cas) vivent dans `certificationAssessments.json`, pas dans les leçons (les 35 leçons publiées n'ont **aucun** `assessmentId` — c'est un invariant validé).

### Collection `certificationAssessments.json` (exemple mini-cas)
Une seule entrée `assessment-analyst-foundations-v1` : 6 compétences (`fd-01`…`fd-06`), **30 questions** QCM (5 par compétence, 40 pts), **3 mini-cas** numériques de 20 pts chacun. Exemple de question numérique :
```json
{
  "id": "fund-carried-interest",
  "prompt": "Quel carried interest est dû dans ce cas simplifié ?",
  "unit": "M€",
  "expectedValue": 16,
  "tolerance": { "mode": "absolute", "value": 0.01 },
  "points": 5,
  "correction": "Profit brut = 160 - 80 = 80 M€. Carried interest = 20 % × 80 = 16 M€."
}
```
`passingRules: { totalMin: 70, examMin: 24, caseMinEach: 10 }`, `attemptPolicy.submittedHistoryLimit: 5`, `toolDeclaration` avec 5 `choices` + `allowFreeText: true`.

## 4. Loaders, helpers et tests (`certifications.ts`, `certifications.test.ts`)

### Loaders / prédicats (`certifications.ts`)
- `CERTIFICATIONS`, `DOMAINS` — cast des JSON.
- `isKnowledgeCertification()` / `isProfessionalCertification()` — gardes de type sur `certificateType`.
- `certificationById()`, `certificationBySlug()`, `certificationsForDomain()` (filtre `status === 'published'`), `certificationsForCourse()` (cherche dans core/recommended **et** dans les options d'axes).

### Helpers de résolution
- `AXIS_ORDER = ['fundStage','dealRole','specialty']` — ordre canonique de résolution.
- `resolveCertificationCurriculum(cert, selection)` — base (`core` ou `recommended`) + options sélectionnées dans l'ordre des axes ; chaque item porte sa `source`.
- `lessonIdsForCertification()` — aplatit les leçons **en dédupliquant**.
- `certificationDisplayTitle()` — **retourne toujours `certification.title`** (ignore la sélection : garantit le titre invariant).
- `resolveCertificationSupplement()` — construit le supplément contextuel **séparément** du titre.
- `resolveFinalAssessment()` — n'inclut que les `optionVariants` des options sélectionnées.
- `compactCertificationSelection()` — supprime les axes vides.
- `createCertificationEnrollment()` / `upsertCertificationEnrollment()` — persistance enrollment (conserve `createdAt`).
- `resolveCertificationProgress()` — recalcule le dénominateur sans supprimer la progression historique d'une option retirée.

### Tests (`certifications.test.ts`) — contrats vérifiés
- **Classement 23/12** : Foundations = 7 blocs / 23 leçons ; préparation = 3 blocs / 12 leçons ; aucun recouvrement ; union = 35 ; 92 questions formatives Foundations + 48 préparation.
- Chaque `requirement` est un **sous-ensemble ordonné** du cours (positions croissantes, sans doublon) ; les blocs core/recommended **n'ont pas** de `assessmentVariantId`.
- **160 compositions** ; les 28 leçons optionnelles sont toutes `{status:'upcoming', optional:true}`.
- Titre `VC Analyst` conservé dans les 160 compositions ; supplément résolu séparément.
- Rubrique finale = **100 pts** ; `optionVariants` restreints aux options sélectionnées.
- 6 promesses de niveaux dans l'ordre ; les 4 supérieurs `status:'future'` sans `certificationId`/`duration`/`durationHours`/`passingScore`/`courseIds`/`courseRequirementIds`.
- 1 charte active ; 7 principes dans l'ordre ; annexe `inactive`.
- Évaluation v1 : 30 questions / 40 pts, 5 par compétence, 3 mini-cas de 20 pts, seuils `{70,24,10}`.
- **Contrôle qualité éditorial des 35 leçons** (constante figée `ALL_35_EDITORIAL_ORDER`) : chaque leçon a 3 `learningOutcomes`, un corps avec `## Cadre`, `## Méthode`, `## Exemple`/`## Cas d'application`, `## Limites et points de contrôle`, `## Mise en application`, exactement une section `## Références` ; 900-1400 mots pédagogiques ; `readMin = ceil(mots/180)` ; 3-5 `keyTakeaways` ; quiz de **4 questions** à **3 options** (1 correcte) ; 2-4 liens sources datés au format `- [libellé](url)`.

## 5. Rendu des pages

### `CertificationsPage.tsx` (liste)
Liste les certifications `status === 'published'`. Carte par certification avec badge de type, badge d'`availability`, compteur de blocs+leçons, libellé « Évaluation locale » vs « Évaluation professionnelle ». Lien « Voir les six niveaux » vers `/certifications/niveaux`.

### `CertificationDetailPage.tsx` (fiche)
Aiguillage selon `certificateType` vers `KnowledgeCertificationPage` ou `ProfessionalCertificationPage`. Navigation par **étapes** (state local) :
- **Knowledge** : 3 étapes — `Aperçu`, `Programme`, `Évaluation`.
- **Professional** : 5 étapes — `Aperçu`, `Préparation`, `Options`, `Programme`, `Évaluation`.

Sections notables : `CompetencyList`, `OptionsStep` (configurateur d'axes, enrollment localStorage `vcpx:certification-enrollments`), `ProgramLayout` (progression par leçon terminée, note explicite que la progression ne déclenche aucun résultat), `KnowledgeAssessmentStep` (stats + bouton → `/certifications/{slug}/evaluation`), `ProfessionalAssessmentStep` (livrables, grille 100 pts, aucune passation active).

### `CertificationEvaluationPage.tsx` + `certificationAssessment.ts` (l'épreuve locale)
- **Store** : `STORAGE_KEYS.certificationAssessments` (`vcpx:certification-assessments`), forme `{ schemaVersion: 1, records: { [assessmentId]: { activeAttempt?, history[], bestResult? } } }`.
- **Tentative** : `createAssessmentAttempt()` mélange **une seule fois** l'ordre des questions, fige `assessmentVersion`, `charterId`, `charterVersion`, `toolDeclaration`, `charterAccepted`.
- **Persistance** : tentative active reprise après rechargement ; historique limité aux **5 dernières** ; `bestResult` conservé même hors des 5.
- **Scoring** (`scoreAssessment`) : examen (bonne option = points), mini-cas (`numericAnswerIsCorrect` avec `parseLocalizedNumber` gérant `,`/`.` FR/EN + tolérance absolue/relative). Réussite = `totalScore≥70` **ET** `examScore≥24` **ET** chaque mini-cas `≥10` (aucune compensation).
- **Compatibilité de version** : `scoreAssessment` lève une erreur si `assessmentVersion` ne correspond pas ; les submissions incompatibles sont filtrées.

## 6. Validation (`scripts/validate-content.mjs`)

Trois tiers de report : `errors` (fatal), `warnings` (fatal en `--strict`), `softWarnings` (backlog contenu, jamais fatal).

### Schémas Zod (`.strict()` partout)
- `certificationSchema = z.discriminatedUnion('certificateType', [knowledge, professional])`.
- `courseRequirementSchema` : `lessonIds` **min 1**.
- `axisCourseRequirementSchema` = requirement + `assessmentVariantId` obligatoire.
- `certificationAxisSchema(axisId, optionIds)` : impose **couverture exacte** des optionIds attendus (`FUND_STAGE_OPTION_IDS`, `DEAL_ROLE_OPTION_IDS`, `SPECIALTY_OPTION_IDS`).
- `rubricCriterionSchema.maxScore` : entier positif `≤100`.
- Charte : les **7 principes exacts** dans un ordre imposé ; version sémantique.

### Règles de référence croisée spécifiques certifications
- `domainId` doit résoudre dans `domains.json`.
- `validateCourseRequirement()` : `courseId` existe ; chaque `lessonId` existe ; **pas de doublon** ; la leçon appartient au `courseId` ; la leçon appartient à la **séquence canonique** du cours ; le sous-ensemble **respecte l'ordre** (positions strictement croissantes).
- `id` de requirement unique dans une certification.
- Une leçon ne peut pas appartenir à plusieurs blocs de base.
- **Professional** : `prerequisiteCertificationId` → un certificat **de connaissances** ; `rubricCriteria` ids uniques ; **somme des `maxScore` = 100** ; au moins un critère `critical` si `criticalCriteriaMustPass`.
- **`optionVariants`** : correspondance bidirectionnelle stricte avec les options d'axes.
- **Cohérence leçon↔option** : chaque leçon d'une option d'axe **doit** déclarer `contexts.{fundStages|dealRoles|sectors}: [optionId]` **et** `optional: true`.

### Règles « métier » codées en dur (numéros de ligne au 2026-07-20)
- **Évaluation, génériques** (lignes 1307-1389) : **6 compétences exactes** (ligne 1310) ; `questionCount === competencies × questionsPerCompetency` ; N questions par compétence ; somme points examen == `exam.points` ; `exam.points + Σ mini-cas === 100` ; seuils ≤ totaux disponibles.
- **Évaluation, spécifique Foundations** (lignes 1391-1401, scopé `assessment-analyst-foundations-v1` uniquement) : **30/5/40**, **3 mini-cas × 20**, seuils **70/24/10**, historique **5**.
- **Classement Foundations/Analyst** (lignes 1416-1465, scopé aux deux certifs Analyst par id) : **7 blocs/23 leçons**, **3 blocs/12 leçons**, union 35 sans doublon ; chaînes de prérequis autonomes ; **aucune des 35 leçons ne doit porter `assessmentId`** ; `cert-analyst-vc.title === "VC Analyst"`.
- **Prérequis figés** (lignes 1467+) : `lmv-market-sizing←l-pipeline-crm`, `l-fact-hypothesis←lmv-returns-waterfall`, etc. + détection de cycles.
- **`certificationLevels`** (lignes 1231-1259) : exactement les 6 ids attendus, dans l'ordre ; niveaux 3-6 → `status:'future'` sans `certificationId` ; `category` du niveau == `certificateType` de la certification liée. **Aucune règle n'impose qu'une certification publiée possède une entrée de niveau.**

### Unicité (globale)
`id` et `slug` uniques dans `certifications.json` ; `finalAssessment.id`, `rubricId`, `optionVariants.id` uniques entre certifications professionnelles ; `certificationLevels` `id`+`order` uniques ; chartes uniques par `id@version` ; assessments `id` uniques.

## 7. Présence ailleurs (routes, sitemap, recherche, storage)

### Routes (`client/src/App.tsx`)
```
certifications                       → CertificationsPage
certifications/niveaux               → CertificationLevelsPage
certifications/:slug/evaluation      → CertificationEvaluationPage
certifications/:slug                 → CertificationDetailPage
```
Toutes en `lazy()`.

### Routes/Sitemap (`shared/routes.mjs` + `scripts/collect-routes.mjs`)
- `STATIC_ROUTES` : `/certifications` (priority 0.75) et `/certifications/niveaux` (0.7).
- `OG_IMAGE_BY_SEGMENT.certifications = 'path'`.
- `collect-routes.mjs` (ligne 83) **ajoute** les fiches détail `/certifications/{slug}` des certifications **publiées** au crawl/prerender. Le segment `certifications` n'est **pas** dans `NOINDEX_SEGMENTS` → indexable.

### Recherche (`client/src/content/search.ts`)
- Pages statiques indexées : `certifications` et `certification-levels`.
- Entités : chaque certification **publiée** indexée avec `type: 'certification'`, `href: /certifications/{slug}`, corps enrichi de `targetRoles`, `shortTitle`, `competencies`.

### Storage (`client/src/lib/storage.ts`)
- Préfixe `vcpx:`. Deux clés dédiées : `certification-enrollments` et `certification-assessments`.

## 8. Contraintes pour la création d'une NOUVELLE certification

1. **Type** : `KnowledgeCertification` ou `ProfessionalCertification` (pas de 3ᵉ branche). Un certificat de compétence passe par `knowledge`.
2. **Champs obligatoires** de base + spécifiques au type. `.strict()` : **aucun champ superflu**.
3. **`id`/`slug` uniques** ; `slug` en minuscules `[a-z0-9-]+` ; `domainId` doit exister dans `domains.json`.
4. **Requirements** : chaque `lessonIds` non vide, sans doublon, sous-ensemble **ordonné** de la séquence canonique ; ids uniques ; une leçon dans un seul bloc de base.
5. **Professional** : prérequis knowledge existant ; 3 axes couvrant **exactement** les option-ids VC codés en dur ; leçons d'options `{optional:true, contexts.<clé>:[optionId]}` ; `rubricCriteria` = 100 avec ≥1 critère critique.
6. **Knowledge** : `assessmentId` → un `CertificationAssessment` existant qui **référence en retour** la certification, avec **même** `candidateCharterId@version`. L'évaluation satisfait toutes les contraintes arithmétiques (points = 100, 6 compétences, questions = compétences × questionsPerCompetency).
7. **Titre** : ne jamais concaténer le contexte ; pour un niveau professionnel Analyst, `title` reste `VC Analyst`.
8. **Aucun `assessmentId` sur les leçons** rattachées à un classement certifiant Analyst (règle scopée aux 35 leçons Analyst).
9. **Niveaux** : ne pas insérer une nouvelle certification dans l'échelle des 6 (les 4 supérieurs doivent rester `future`). Une certification hors échelle est valide et listée dès `status:'published'`.
10. **Pas de nouveau catalogue** : réutiliser cours/leçons par identifiant ; ne créer une leçon qu'après constat d'un manque.
11. **Charte éditoriale** : ton sobre, factuel, institutionnel ; pas de survente.
12. Après création : mettre à jour de façon coordonnée la source propriétaire, le référentiel, les données, le validateur si besoin, et `Suivis/ETAT.md`.
