# Références vérifiées — Certification Venture Philanthropy

> [!WARNING]
> **Document historique, supplanté le 2026-07-20.** Les références externes restent consultables, mais les notes de schéma et d’évaluation décrivent l’architecture antérieure aux migrations des certifications `venture-philanthropy-foundations` et `analyst-foundations` vers des parcours. Les références maintenues sont les référentiels des parcours dans `docs/parcours/` et le référentiel professionnel `docs/certifications/REFERENTIEL-VC-ANALYST.md`.

> Dossier de références consolidé pour l'implémentation : sources documentaires externes (à citer dans les leçons), schémas de données exacts, numéros de ligne du validateur, et gabarit d'autorat exemplaire. Numéros de ligne relevés dans `scripts/validate-content.mjs` et `client/src/content/certifications.test.ts` au 2026-07-20 — à revérifier si les fichiers ont bougé.

## 1. Sources externes vérifiées

**Date de vérification commune : 20 juillet 2026.** Prochaine revue générale : **20 juillet 2027**. Une revue anticipée est requise avant le **15 décembre 2026** pour les développements relatifs à l'agrément ESUS, aux fonds de dotation, à la fiscalité du mécénat et aux instruments financiers, ainsi qu'avant toute révision de leçon qui figerait un seuil ou une condition juridique. Toutes les URL retenues ci-dessous étaient accessibles à la date de vérification. Les pages de présentation d'acteurs privés restent des sources de cas, non des preuves normatives ou indépendantes.

À citer dans la section `## Références` des leçons au format `- [titre, institution, année](url)`, avec le périmètre utile indiqué dans la prose.

### 1.1. Venture philanthropie, financement adapté et sortie

- [**Investing for Impact Toolkit**, Impact Europe, 2020](https://www.impacteurope.net/insights/investing-impact-toolkit) — périmètre : doctrine professionnelle de l'investissement pour l'impact. Le cadre retient trois pratiques centrales : financement adapté, accompagnement non financier, mesure et gestion de l'impact. Il s'agit d'un référentiel volontaire, non d'une norme juridique.
- [**Charter of Investors for Impact**, Impact Europe, 2019](https://www.impacteurope.net/insights/charter-investors-impact-0) — périmètre : dix principes volontaires, incluant place des bénéficiaires, engagement de long terme, prise de risque, accompagnement, collaboration et éthique. Ne pas la résumer à trois principes.
- [**VP in a Nutshell — Tailored Financing**, Impact Europe, 2018](https://www.impacteurope.net/insights/vp-nutshell-short-guide-tailored-financing) — périmètre : choix économique du financement selon le besoin, la maturité et les flux. Le guide ne dispense pas de vérifier le véhicule juridique applicable en France.
- [**VP in a Nutshell — Exit**, Impact Europe, 2018](https://www.impacteurope.net/insights/vp-nutshell-short-guide-exit) — périmètre : préparation de la fin de relation en tenant compte de l'impact, de la viabilité financière et de la résilience organisationnelle. La sortie est un processus distinct, pas une quatrième pratique centrale.

### 1.2. Financement flexible et données de secteur

- [**No strings attached? Making sense of flexible financing in philanthropy**, OCDE, 2024](https://www.oecd.org/en/publications/no-strings-attached-making-sense-of-flexible-financing-in-philanthropy_0264b47f-en.html) — périmètre : plus de 180 donateurs privés dans 32 pays et historiques de 20 grandes fondations. La source analyse avantages, coûts et risques du financement flexible ; elle ne permet pas d'enseigner que le financement non affecté est toujours préférable.
- [**Private Philanthropy for Development, Third Edition**, OCDE, 2026](https://www.oecd.org/en/publications/private-philanthropy-for-development-third-edition_98e676c0-en/full-report/philanthropy-a-strategic-development-partner_ff995417.html) — périmètre : échantillon de philanthropie pour le développement, 2020-2023, montants en dollars constants 2023. Les quelque 40 milliards de dollars affectés et 6,5 milliards flexibles proviennent de cette édition, et non du rapport OCDE 2024 ; ils ne décrivent ni toute la philanthropie mondiale ni le seul marché français.
- [**Baromètre de la philanthropie 2026**, Observatoire Philanthropie & Société de la Fondation de France, 2026](https://www.fondationdefrance.org/images/pdf/fdf_barometre_edition-2026_.pdf) — périmètre : fondations et fonds de dotation en France. Données à retenir : 6 040 structures actives en 2025, +3 % sur un an et +59 % en dix ans. Les actifs, ressources et dépenses 2024 sont des estimations fondées sur 587 comptes couvrant directement ou par fondations abritantes 2 181 entités. Ne pas attribuer ce baromètre à France générosités ni écrire « +3 % par an » ou « doublement en dix ans ».

### 1.3. Cadre français et européen des structures et instruments

- [**Article 140 de la loi du 4 août 2008**, Légifrance, version en vigueur depuis le 27 juin 2026](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000054334469) — périmètre : définition, création, ressources et contrôle du fonds de dotation. La forme juridique ne rend pas automatiquement chaque don éligible à une réduction fiscale.
- [**Associations reconnues d'utilité publique et fondations**, Service-Public.fr, consultation 2026](https://www.service-public.fr/particuliers/vosdroits/N31028) — périmètre : présentation administrative des principales formes françaises. À utiliser pour orienter, puis revenir aux textes en vigueur pour décider.
- [**Agrément Entreprise solidaire d'utilité sociale**, ministère de l'Économie, 17 juin 2026](https://www.economie.gouv.fr/entreprises/les-aides-et-financements-pour-developper-son-entreprise/economie-sociale-et-solidaire) — périmètre : conditions et effets de l'agrément ESUS. ESUS est un agrément, pas une forme juridique, une certification d'impact, une éligibilité fiscale au mécénat ou une autorisation générale d'utiliser tout instrument. Les présomptions annoncées pour certaines catégories ne prennent effet qu'au 1er janvier 2027.
- [**Liste nationale des agréments ESUS**, Direction générale du Trésor, mise à jour consultée 2026](https://www.tresor.economie.gouv.fr/banque-assurance-finance/finance-sociale-et-solidaire/liste-nationale-agrements-esus) — périmètre : vérification administrative des agréments et placements assimilés publiés. La liste ne remplace pas la vérification des autres conditions d'une opération.
- [**Obligations émises par les associations — articles L. 213-8 à L. 213-21**, Code monétaire et financier, version en vigueur au 20 juillet 2026](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000006184578/) — périmètre : conditions d'émission et régime des titres associatifs. Une association n'a pas de capital social ; un titre associatif reste une créance de dernier rang et son émission est encadrée.
- [**Article L. 213-32**, Code monétaire et financier, version consultée 2026](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037668260) — périmètre : catégories autorisées à émettre des titres participatifs. Cet instrument n'est pas génériquement accessible à toute association ou structure ESS.
- [**Article L. 511-6**, Code monétaire et financier, version en vigueur consultée 2026](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049423674) — périmètre : exceptions encadrées à l'interdiction relative aux opérations habituelles de crédit. Vérifier séparément la capacité du bénéficiaire et l'habilitation du financeur ; l'objet philanthropique ne crée pas une autorisation générale de prêt.
- [**Financement de l'économie inclusive**, Banque des Territoires, consultation 2026](https://www.banquedesterritoires.fr/produits-services/investissement/financement-economie-inclusive) — périmètre : exemples opérationnels de correspondance entre formes et instruments. Cette offre illustre une pratique d'investisseur ; elle ne remplace pas le Code monétaire et financier ni une revue juridique.
- [**Règlement (UE) n° 346/2013 relatif aux fonds d'entrepreneuriat social européens**, EUR-Lex, texte consolidé au 9 janvier 2024](https://eur-lex.europa.eu/eli/reg/2013/346/2024-01-09/eng) — périmètre : conditions d'utilisation de la désignation EuSEF par des gestionnaires et règles de commercialisation de fonds. EuSEF n'est pas un agrément de l'entreprise financée.
- [**Rescrit fiscal**, Direction générale des Finances publiques, consultation 2026](https://www.impots.gouv.fr/professionnel/le-rescrit-fiscal) — périmètre : sécurisation d'une situation fiscale décrite avec précision. L'éligibilité au mécénat dépend de l'activité et des conditions réelles ; ni la forme associative, ni ESS, ni ESUS ne la rendent automatique.

### 1.4. Contrats à impact, mesure, données et protection des personnes

- [**Contrat à impact**, ministère de l'Économie, dispositif lancé en 2016, page consultée 2026](https://www.economie.gouv.fr/contrat-impact) — périmètre : modèle français de préfinancement et paiement selon des résultats évalués. Le montage peut associer opérateur, investisseurs, payeur public, évaluateur et structeur ; ne pas le réduire systématiquement à trois parties.
- [**Les soutiens publics à l'économie sociale et solidaire**, Cour des comptes, 2025](https://www.ccomptes.fr/sites/default/files/2025-09/20250918-Soutiens-publics-a-economie-sociale-et-solidaire.pdf) — périmètre : évaluation critique des dispositifs publics, dont les contrats à impact. À mobiliser pour leurs coûts de structuration, leur complexité, leurs contraintes d'évaluation et le risque d'exclusion des petites structures.
- [**Principes méthodologiques de l'évaluation d'impact social**, Avise, consultation 2026](https://www.avise.org/ressources/comment-evaluer-son-impact-principes-methodologiques) — périmètre : préparation et choix d'une démarche d'évaluation. Une théorie du changement est une hypothèse causale à éprouver ; il n'existe pas de méthode idéale indépendante de l'usage et des moyens.
- [**IRIS+**, Global Impact Investing Network, consultation 2026](https://iris.thegiin.org/introduction/) — périmètre : système et catalogue de métriques pour la mesure et la gestion de l'impact. IRIS+ n'est pas une méthode de l'Avise, une certification ni une preuve de causalité.
- [**Évaluer l'impact social avec l'approche SROI**, Avise, consultation 2026](https://www.avise.org/ressources/evaluer-limpact-social-avec-lapproche-sroi-application-au-secteur-de-liae) — périmètre : approche de monétarisation et retour d'expérience. Un ratio SROI dépend des proxys, du contrefactuel, de l'attribution et de la durée ; il ne doit pas servir de classement universel isolé.
- [**Guide de sensibilisation au RGPD pour les associations**, CNIL, 2018](https://www.cnil.fr/sites/default/files/atoms/files/cnil-guide_association.pdf) et [**Analyse d'impact relative à la protection des données**, CNIL, consultation 2026](https://www.cnil.fr/fr/RGPD-analyse-impact-protection-des-donnees-aipd) — périmètre : finalité, base légale, minimisation, sécurité, droits et traitements à risque élevé. Une exigence de reporting ne crée jamais à elle seule une base juridique.
- [**Safeguarding Policy**, UNICEF, 2025](https://www.unicef.org/documents/safeguarding-policy) — périmètre : cadre opérationnel de prévention, signalement et réponse aux atteintes. Cette politique institutionnelle ne constitue pas un régime légal français unique ; les obligations dépendent du public et du secteur.
- [**Rapport sur la gouvernance des associations**, Haut Conseil à la vie associative, 2026](https://associations.gouv.fr/sites/default/files/2026-02/HCVA%20-%20Rapport%20gouvernance%2020260210_0.pdf) — périmètre : participation, transparence, responsabilité des dirigeants et représentation des parties prenantes. Les droits du financeur doivent rester proportionnés et ne pas se substituer aux organes statutaires.

### 1.5. Sources de cas et limites d'interprétation

- [**Méthode de venture philanthropy**, Fondation AlphaOmega, consultation 2026](https://www.alphaomegafondation.com/notre-methode-la-venture-philanthropy) — périmètre : description par l'acteur de son propre modèle. L'« effet de levier de 4 » est une valorisation déclarée — financement, accompagnement, cofinancement et mécénat de compétences — et non une mesure indépendante ou un ratio transférable.
- [**Présentation de Phitrust**, Phitrust, consultation 2026](https://phitrust.com/accueil/nous-connaitre/) — périmètre : qualifications déclarées d'un acteur et de ses véhicules. EuSEF, agrément ESUS et label Finansol ont des natures distinctes ; les citer séparément et les dater.

**Source devenue inaccessible : aucune parmi les URL retenues lors du contrôle du 20 juillet 2026.** Les anciennes références réduites à un nom de domaine, l'attribution du Baromètre à France générosités et l'attribution d'IRIS+ à l'Avise sont retirées comme sources insuffisamment précises ou factuellement incorrectes.

## 2. Schémas de données exacts (Zod `.strict()`)

Extraits fidèles de `scripts/validate-content.mjs`. `.strict()` = aucun champ hors liste.

### Leçon (`lessonSchema`, ~L153-190)
```
id, slug, courseId, order(≥0), title, kicker(string), readMin(≥0), summary(non vide),
status? ("published"|"upcoming", défaut "published"),
level?, contexts?{fundStages?,dealRoles?,sectors?}, optional?,
learningOutcomes?[], prerequisiteLessonIds?[], assessmentId?,
body?(REQUIS si published), bodyShort?, keyTakeaways?(REQUIS si published),
glossaryRefs[](REQUIS, peut être []), quiz?[], furtherReading?[{label,kind,ref}]
```
`contexts.sectors` n'accepte que les `SPECIALTY_OPTION_IDS` (generalist|saas|deeptech|climate|health-biotech|consumer-marketplaces|impact) — **ne pas** y mettre une valeur VP. Les leçons VP n'ont pas besoin de `contexts` (le laisser absent).

### Quiz (`quizQuestionSchema`, ~L141-145)
```
question(non vide), options[{text(non vide), correct(bool)}] (min 2), explanation(non vide)
```
Règle : **exactement une** option `correct: true`.

### Cours (`courseSchema`, ~L129-139)
```
id, slug, title, subtitle(string), level, durationMin(≥0), summary(non vide), tags[], lessonIds[]
```

### Certification de connaissances (`knowledgeCertificationSchema`, ~L347-353)
```
Base: id, slug, domainId, title, shortTitle, status(draft|published),
availability(in-construction|open|closed), issuer, targetRoles[](min 1), level,
summary, competencies[](min 1)
+ certificateType: "knowledge", coreRequirements[](min 1), assessmentId,
  candidateCharterId, candidateCharterVersion, capstoneDeliverableId?(string)
```
`CourseRequirement` : `{ id, courseId, title, summary, lessonIds[](min 1) }`.

### Évaluation locale (`certificationAssessmentSchema`, ~L461-502)
```
id, version(semver), certificationId, candidateCharterId, candidateCharterVersion,
title, description, competencies[{id,label}](min 1),
exam{ title, instructions, points(int+), questionCount(int+), questionsPerCompetency(int+),
      shuffleQuestions:true, consultationPolicy:"not-recommended",
      questions[{id,competencyId,prompt,options[{id,label}](min2),correctOptionId,points(int+),explanation}] },
miniCases[{id,title,scenario,instructions,points(int+),
           questions[{id,prompt,unit,expectedValue,tolerance{mode,value(+)},points(int+),correction}]}](min 1),
passingRules{ totalMin(≥0), examMin(≥0), caseMinEach(≥0) },
resourcePolicy{ exam, miniCases },
attemptPolicy{ unlimited:true, timer:false, technicalLocking:false, persistActiveAttempt:true,
               submittedHistoryLimit(int+), preserveBestResult:true, shuffleOncePerAttempt:true },
toolDeclaration{ required:true, prompt, choices[](min 1), allowFreeText:true }
```

### Étude de cas (`caseStudySchema`, ~L545-559)
```
id, slug, title, subtitle(string), kind(string — libre), company(string), year(int),
readMin(≥0), summary(non vide), tags[], glossaryRefs[],
sections[{heading(non vide), body(non vide)}](min 1), takeaways[]
```

### Livrable (`deliverableSchema`, ~L564-582)
```
id, slug, title, kicker?, readMin(≥0), summary(non vide), brief(non vide),
template[{heading, prompt}](min 1), rubric[{criterion, check}](min 1),
model?{ kind: "ecosystem"|"case"|"memo"|"lesson", id, note(string) },
relatedLessonIds?[], glossaryRefs?[], tags?[]
```
Résolveurs `model.kind` : `ecosystem`→ecosystems, `case`→caseStudies (id + refs), `memo`→memos (id+slug), `lesson`→lessons.

### Glossaire (`glossarySchema`, ~L530-543)
```
id, term, slug, aliases?[], latin?, category(string), short(string), definition(non vide),
example?, link?, seeAlso[], relatedLessonIds[]
```
Contrainte custom : **`id === slug`**. `seeAlso` = slugs de glossaire. Aliases jamais en fiche autonome.

## 3. Contraintes de validation à surveiller (numéros de ligne)

| Règle | Ligne | Portée | Impact VP |
| --- | ---: | --- | --- |
| `domainId` doit résoudre | 1092 | toute certification | OK — `venture-philanthropy` existe |
| **6 compétences exactes** dans une évaluation | 1310-1311 | **générique, toute évaluation** | **L'évaluation VP doit avoir exactement 6 compétences** |
| `questionCount = compétences × questionsPerCompetency` | 1321 | générique | 24 = 6 × 4 |
| N questions par compétence uniforme | 1327-1335 | générique | 4 par compétence |
| Σ points questions = `exam.points` | 1353-1358 | générique | 24 × 2 = 48 |
| `exam.points + Σ mini-cas = 100` | 1378 | générique | 48 + 52 = 100 |
| seuils ≤ totaux | 1384-1389 | générique | 70/28/8 ✓ |
| 30/40 + 3×20 + 70/24/10 + histo 5 | 1391-1401 | **scopé `assessment-analyst-foundations-v1`** | non concerné |
| Classement 23/12, 35 leçons, titre VC Analyst | 1416-1465 | **scopé certifs Analyst (par id)** | non concerné |
| Prérequis figés Analyst + cycles | 1467-1500 | scopé ids Analyst (+ cycles globaux) | non concerné (pas de cycle VP) |
| `certificationLevels` = 6 ids en ordre | 1231-1259 | global | **ne pas ajouter d'entrée VP** |
| model livrable résout | 1571-1572 | tout livrable | `kind:'case'`→ cas VP |
| `capstoneDeliverableId` résout | validateur de certification | certificat de connaissances | `vp-recommandation-soutien`→ livrable VP |

**Tests livrés** : `client/src/content/certifications.test.ts` contrôle la cartographie des 6 cours et 21 leçons, le format éditorial propre aux leçons VP, les 24 questions, les trois mini-cas et les seuils. `client/src/pages/learn/furtherReadingHref.test.ts` contrôle la résolution du livrable depuis la leçon finale. Les contrôles Analyst existants restent distincts.

**Rendu du cas** : la valeur `kind: "organisation"` est traduite par le libellé public « Organisation à impact » dans `client/src/content/labels.ts`.

## 4. Gabarit d'autorat des leçons Venture Philanthropy

Le contrat ci-dessous est celui des 21 leçons `lvp-*` publiées. Il privilégie un geste de travail et une production vérifiable. Le format Analyst historique de 900 à 1 400 mots reste régi par son propre contrôle et ne doit pas être appliqué aux leçons VP.

**Structure du `body`** (sections `##` séparées par une ligne vide) :
1. `## Situation professionnelle` — pose la décision, le risque ou le livrable à traiter.
2. `## Méthode de travail` — fournit une procédure ordonnée, des données d'entrée et des règles d'escalade.
3. `## Cas d'application` — applique la méthode à un dossier fictif et comporte des **éléments de correction** explicites.
4. `## Points de contrôle` — identifie les erreurs, limites de preuve et situations qui imposent une pause ou une revue compétente.
5. `## Production attendue` — demande un artefact utilisable et en précise les critères de qualité.
6. `## Références` — 2 à 4 liens sources datés, chacun sur une ligne `- [libellé](url)` contenant une année.

**Métadonnées associées** :
- `learningOutcomes` : **exactement 3**.
- `keyTakeaways` : **3 à 5**.
- `quiz` : **exactement 4 questions**, chacune **3 options**, 1 correcte, `explanation` non vide. Éviter de répéter la position de la bonne réponse plus de 2 fois de suite.
- Longueur pédagogique (hors `## Références`) : **650 à 950 mots**.
- `readMin = ceil(mots_total / 180)`.
- `glossaryRefs` : slugs pointant la grappe VP (existante + nouvelle).

Le test ne mesure pas seulement la présence des titres : il vérifie aussi la plage de mots, le temps de lecture, la correction, les sources datées et la structure 4 × 3 du quiz. Toute évolution du format doit être répercutée dans le référentiel maintenu et dans le test au cours du même changement.

## 5. Renderer Markdown — rappel des limites (`client/src/lib/markdown.tsx`)

Supporté : `##`, `###`, listes `-`, listes `1.`, `**gras**`, `*italique*`, `[texte](url)`, `[[slug|libellé]]`, `{{slug|libellé}}`. **Non supporté** : tableaux, callouts, blocs de code, images, citations `>`, règle horizontale `---`. Rédiger les mini-cas et matrices de décision en **prose et listes**, pas en tableaux Markdown.
