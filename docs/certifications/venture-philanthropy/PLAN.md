# Plan d'implémentation — Certification « Venture Philanthropy Foundations »

> [!WARNING]
> **Plan initial historique.** Le certificat décrit ici a été déclassé en parcours le 2026-07-20. Ce document est conservé comme historique de conception ; il ne doit plus être utilisé comme spécification d'implémentation. La référence maintenue est le [référentiel du parcours](../../parcours/VENTURE-PHILANTHROPIE.md). Les collections `data/` restent les définitions exécutables.

## Bilan de l'implémentation finale

| Élément | État final |
| --- | --- |
| Nature | Certificat local de connaissances, sans titre professionnel |
| Rôle cible | Analyste ou chargé d'investissement junior exerçant sous supervision |
| Certification | `cert-vp-foundations` — publiée et ouverte |
| Contenus | 6 cours et 21 leçons ; [cartographie canonique](../REFERENTIEL-VENTURE-PHILANTHROPY.md#4-cartographie-canonique-des-contenus) |
| Compétences | 6 compétences `vp-01` à `vp-06` |
| Évaluation | 24 questions pour 48 points + 3 mini-cas pour 52 points ; seuils 70/100, 28/48 et 8 points par mini-cas |
| Mise en situation | `vp-recommandation-soutien` sur `cs-vp-insertion-3-regions`, autoévaluée et hors score |
| Limite | Aucune vérification d'identité, délivrance humaine ou validation de compétence professionnelle |

L'implémentation finale a conservé l'architecture générale du plan, mais a réorganisé les cours et plusieurs identifiants de leçons autour du flux de travail réel : mandat, problème et preuves, diligence organisationnelle, diligence financière, structuration, puis partenariat et décision. Les leçons ont été calibrées sur un format opératoire commun de 650 à 950 mots pédagogiques, avec six sections fixes, trois objectifs, quatre questions situationnelles et des sources datées. Le capstone prévu est devenu une mise en situation d'autoévaluation explicitement distincte du score local.

Une revue par un praticien reste souhaitable avant tout usage d'une production dans une décision réelle. Le référentiel maintenu précise les escalades juridiques, fiscales, comptables, de données et de protection des personnes.

## Archive — contenu du plan initial

La suite reproduit le plan ayant guidé les travaux. Ses identifiants, estimations, numéros de ligne et affirmations sur les fichiers à modifier peuvent être obsolètes. Elle conserve une valeur de traçabilité, mais toute divergence est tranchée par le référentiel maintenu et les données exécutables.

Copie durable du plan de session (fichier d'origine : `~/.claude/plans/en-t-inspirant-de-ces-streamed-quill.md`). Contexte et sources préparatoires : voir [`references-verifiees.md`](references-verifiees.md) et les trois rapports d'exploration du même dossier.

### Décisions actées (réponses utilisateur, 2026-07-20)

- **Type** : certificat de connaissances (branche `knowledge`).
- **Ampleur** : livraison complète en une vague — 6 cours, 21 leçons publiées, évaluation locale opérationnelle, glossaire enrichi.
- **Intitulé** : « Venture Philanthropy Foundations ».
- **Capstone** : inclus — livrable `/livrables` + étude de cas modèle. Pas de parcours dédié dans cette vague.

### Architecture retenue (vérifiée sur pièces)

- **Type** : `KnowledgeCertification`. Aucun changement de code client : pages, routes `/certifications/:slug` et `/certifications/:slug/evaluation`, indexation `search.ts` et prerender (`collect-routes.mjs` L83) pilotés par les données.
- **Domaine** : `venture-philanthropy` — **existe déjà** dans `data/domains.json` (slug `venture-philanthropie`), inutilisé jusqu'ici.
- **Niveaux** : `certificationLevels.json` **non modifié** (le validateur, L1231-1259, exige exactement les 6 ids VC Analyst…VC Principal ; il n'impose jamais qu'une certification publiée possède une entrée de niveau). Certification VP hors échelle = conforme.
- **Charte** : réutilise `candidate-charter@1.0.0`. `CANDIDATE_CHARTERS` reste de longueur 1.
- **Intitulé** : « Venture Philanthropy Foundations » (« VC Analyst » réservé à l'échelle professionnelle).

### Fichiers à modifier / créer (ordre d'exécution)

Tout est de l'ajout dans des collections existantes — aucune nouvelle collection, aucun module de barrel, aucun câblage de route.

1. **Glossaire** : ~16 entrées dans `data/sources/canonical-glossary.json` → entrées publiées dans `data/glossary.json` → `npm run aliases:merge` → `npm run validate:glossary`. Vérifier l'absence de doublon (grappe existante réutilisée par `[[..]]`, jamais recréée).
2. **Leçons** : ~21 leçons `lvp-*` dans `data/lessons.json` (fichier canonique — un registre drop-in exigerait un `parcoursId`, absent dans cette vague).
3. **Cours** : 6 cours `c-vp-*` dans `data/courses.json` (réciprocité `lesson.courseId` ↔ `course.lessonIds`).
4. **Certification** : `cert-vp-foundations` dans `data/certifications.json`.
5. **Évaluation** : `assessment-vp-foundations-v1` dans `data/certificationAssessments.json`.
6. **Étude de cas** : `cs-vp-insertion-3-regions` dans `data/caseStudies.json`.
7. **Capstone (livrable)** : recommandation de soutien dans `data/deliverables.json`.
8. **Test** : `client/src/content/certifications.test.ts` L507 (`CERTIFICATION_ASSESSMENTS` 1→2). Optionnel recommandé : constante `VP_EDITORIAL_ORDER` + test miroir du contrôle qualité (L238-299).
9. **Régénération** : `npm run split:content`.
10. **Docs & suivi** : `Suivis/ETAT.md` (compteurs), `Suivis/JOURNAL.md` (entrée datée), note dans `docs/certifications/`.

### Découpage pédagogique — 6 cours, 21 leçons (M1-M9)

Chaque leçon suit le gabarit d'autorat maison (cf. [`references-verifiees.md`](references-verifiees.md) §4) : `## Cadre` · `## Méthode` · `## Exemple`/`## Cas d'application` · `## Limites et points de contrôle` · `## Mise en application` · `## Références` ; 900-1400 mots ; `readMin = ceil(mots/180)` ; 3 `learningOutcomes` ; 3-5 `keyTakeaways` ; quiz de 4 questions à 3 options ; 2-4 sources datées.

- **C1 `c-vp-fondations` — « La venture philanthropie et le continuum du capital » (M1)**
  1. `lvp-continuum-capital` — Le continuum du capital : de la subvention à l'investissement.
  2. `lvp-pratiques-vp` — Les trois pratiques (tailored financing, non-financial support, impact measurement & management) et la sortie (Charter of Investors for Impact 2019).
  3. `lvp-paysage-francais` — Le paysage français : chiffres (6 040 fondations/fonds de dotation, 47,1 Md€ — Baromètre Fondation de France), acteurs (AlphaOmega, Epic, Phitrust, France Active), formes juridiques.
- **C2 `c-vp-probleme-systeme` — « Comprendre le problème et le système » (M2)**
  4. `lvp-analyse-probleme` — Analyser le problème social et cartographier le système.
  5. `lvp-theorie-changement` — La théorie du changement (Avise).
  6. `lvp-parties-prenantes` — Bénéficiaire, client, payeur, prescripteur.
- **C3 `c-vp-diligence-organisationnelle` — « La due diligence organisationnelle » (M3)**
  7. `lvp-mission-gouvernance` — Mission, gouvernance et intégrité stratégique.
  8. `lvp-equipe-operations` — Équipe, opérations et capacité d'exécution.
  9. `lvp-safeguarding-risques` — Safeguarding et risques pour les bénéficiaires.
- **C4 `c-vp-finance-resilience` — « Finance et résilience d'une organisation à impact » (M4)**
  10. `lvp-modele-financement` — Financements affectés et non affectés, concentration des financeurs.
  11. `lvp-cout-complet` — Le coût complet et le full-cost recovery.
  12. `lvp-tresorerie-reserves` — Trésorerie, réserves libres et soutenabilité.
  13. `lvp-scenario-choc` — Scénario de choc : la perte d'une subvention majeure.
- **C5 `c-vp-financement-sur-mesure` — « Le financement sur mesure » (M5, cœur technique)**
  14. `lvp-instruments-panorama` — Panorama des instruments : subvention → subvention récupérable → prêt → prêt subordonné → OC → quasi-fonds propres → equity → garantie/first-loss.
  15. `lvp-instruments-francais` — Titres associatifs, titres participatifs, prêts subordonnés (Banque des Territoires), contrats à impact (2016).
  16. `lvp-instruments-forme-juridique` — Compatibilité instrument / forme juridique / capacité de remboursement.
  17. `lvp-matrice-decision` — La matrice de décision : quel instrument pour quelle situation.
- **C6 `c-vp-accompagnement-mesure-sortie` — « Accompagnement, mesure et sortie responsable » (M6+M7+M8+M9)**
  18. `lvp-accompagnement-non-financier` — L'accompagnement non financier (M6).
  19. `lvp-mesure-impact` — Mesure d'impact : pilotage, outcomes, risques, voix des bénéficiaires, proportionnalité (Avise, SROI) (M7).
  20. `lvp-flexibilite-confiance` — Financement flexible, confiance et rapports de pouvoir (OCDE 2024 ; risques de la VP : dépendance, reporting excessif, ingérence, retrait brutal) (M8).
  21. `lvp-renouvellement-sortie` — Portefeuille, renouvellement, graduation, sortie responsable (M9).

La certification déclare **6 `coreRequirements`** (un par cours, chacun listant l'intégralité de ses leçons dans l'ordre canonique).

### Évaluation locale `assessment-vp-foundations-v1`

Contraintes dures (validateur L1307-1389, génériques) : **6 compétences exactes** ; `questionCount = 6 × questionsPerCompetency` ; questions/compétence uniforme ; `exam.points = Σ points` ; `exam.points + Σ mini-cas = 100` ; seuils ≤ totaux.

- **6 compétences** : `vp-01` continuum & cadre FR (M1) · `vp-02` problème, système & théorie du changement (M2) · `vp-03` diligence organisationnelle (M3) · `vp-04` finance & résilience (M4) · `vp-05` financement sur mesure & compatibilité juridique (M5) · `vp-06` accompagnement, mesure, flexibilité & sortie (M6-M9).
- **Examen QCM** : 6 × 4 = **24 questions**, 2 pts chacune = **48 pts**.
- **3 mini-cas chiffrés** (M4/M5), **52 pts** (18 + 18 + 16) : (A) coût complet et coût par outcome ; (B) concentration des financeurs et mois de réserve/trésorerie ; (C) capacité de remboursement d'un prêt et scénario de perte de subvention.
- **Seuils** : `totalMin: 70`, `examMin: 28`, `caseMinEach: 8`. `attemptPolicy`/`toolDeclaration` calqués sur l'existant.
- Total = 48 + 52 = **100 ✓**. `caseMinEach: 8` ≤ 16 (plus petit cas) ✓.

### Capstone

- **Étude de cas `cs-vp-insertion-3-regions`** : association d'insertion répliquant son programme dans 3 régions (résultats précoces positifs, subvention publique annuelle, 2 gros donateurs privés, réserves libres très faibles, direction solide mais surchargée, système de données fragile, filiale commerciale envisageable, besoin de financement à 3 ans). `kind` = `organisation` (vérifier le rendu du badge dans `CaseStudyPage`).
- **Livrable** (id `vp-recommandation-soutien`, slug `recommandation-de-soutien-venture-philanthropie`) : `brief`, `template` calqué sur le mémo de recommandation de soutien VP (recommandation en une phrase ; problème & système ; théorie du changement & additionalité ; diligence & gouvernance ; finance & résilience ; choix de l'instrument & compatibilité juridique ; accompagnement non financier ; mesure d'impact proportionnée ; risques, éthique & rapports de pouvoir ; renouvellement & sortie ; ce qui me ferait changer d'avis), `rubric` reprenant les **critères d'échec critiques** (produit ≠ impact ; instrument incompatible avec la forme juridique ; dette sans capacité de remboursement ; coûts complets ignorés ; reporting disproportionné ; croissance assimilée à l'impact ; absence de stratégie de sortie ; bénéficiaires traités comme unités de mesure), `model: { kind: 'case', id: 'cs-vp-insertion-3-regions', note: … }`, `relatedLessonIds`, `glossaryRefs`.

### Glossaire — entrées à créer (~16, à confronter à `glossary.json` avant écriture)

Format acronyme : titre « Expansion (SIGLE) », définition au naturel, sigle nu en alias. `id === slug`, `seeAlso` vers la grappe existante.

`theorie-du-changement` · `entreprise-solidaire-utilite-sociale-esus` · `finance-solidaire` · `contrat-a-impact` · `mesure-impact` · `social-return-on-investment-sroi` · `fonds-de-dotation` · `capital-patient` · `cout-complet` · `titre-associatif` · `titre-participatif` · `subvention-recuperable` · `financement-non-affecte` · `safeguarding` · `first-loss` · `quasi-fonds-propres`.

### Points de vigilance (vérifiés)

- Règle « 6 compétences » **générique** (L1310) → 6 compétences VP.
- Blocs codés en dur non concernés : 30/40/70-24-10 (L1391, scopé Foundations) ; classement 23/12 (L1429-1465, scopé Analyst) ; prérequis figés (L1467+, ids Analyst).
- **`certificationLevels.json` intact**.
- **Seul test cassé** : `certifications.test.ts:507`.
- Schémas `.strict()` : aucun champ hors schéma.
- Hooks : rapport de validation après édition = normal ; ne jamais écrire sous `data/generated/`.
- Style §4.0.c : sobre, sourcé, sans survente ; ne pas idéaliser la philanthropie (risques traités en M8).

### Vérification (definition of done)

1. `npm run validate:content` (auto via hook) après chaque édition JSON.
2. Glossaire modifié → `npm run aliases:merge` puis `npm run validate:glossary`.
3. `npm run split:content`.
4. `npm run check` (validate:content:strict + validate:glossary + typecheck + lint + test) — test L507 mis à jour.
5. `npm run build` — routes prerendues ajoutées (`/certifications/venture-philanthropy-foundations`, `.../evaluation`, `/cases/insertion-3-regions`, `/livrables/recommandation-de-soutien-venture-philanthropie`) ; contrôler le résumé de prerender.
6. Contrôle navigateur (Chrome DevTools MCP) desktop 1440×1000 et mobile 390×844 : fiche certification, **parcours d'évaluation complet** (QCM + 3 mini-cas, scoring, seuils), étude de cas, livrable.
7. `Suivis/ETAT.md` : certifications 2→3, cours 21→27, leçons +21, glossaire +~16, études de cas 6→7, livrables 2→3, évaluations 1→2 ; entrée datée dans `Suivis/JOURNAL.md`.
