> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Dossier de conception — Certification « Venture Philanthropy Foundations »

> [!IMPORTANT]
> **Dossier historique.** Le certificat décrit ici a été déclassé en parcours le 2026-07-20. Le [référentiel du parcours](../../../parcours/VENTURE-PHILANTHROPIE.md) est désormais la référence maintenue pour le périmètre, les six cours, les 21 leçons et la mise en situation autoévaluée. Ce dossier conserve les recherches et décisions préparatoires à titre d'historique.

## Objet

Le dossier a servi à mettre en place, sur la plateforme statique vc-platform, une certification de connaissances axée sur la **venture philanthropie dans le cadre français**. La proposition initiale de spécialisation « Venture Philanthropy Analyst » de 30-40 h a été transformée en certificat local de connaissances, sans titre professionnel, centré sur les gestes d'un rôle junior exercé sous supervision.

## État historique avant déclassement

| Élément | Implémentation finale |
| --- | --- |
| Certification | `cert-vp-foundations` — `Venture Philanthropy Foundations`, alors publiée et ouverte avant son déclassement en parcours le 2026-07-20 |
| Contenus | 6 cours `c-vp-*` et 21 leçons `lvp-*` ; cartographie historique dans l'[ancien référentiel de certification](../REFERENTIEL-VENTURE-PHILANTHROPY.md#4-cartographie-canonique-des-contenus) |
| Évaluation | `assessment-vp-foundations-v1` — 24 QCM pour 48 points et 3 mini-cas pour 52 points |
| Seuils | 70/100 au total, 28/48 au QCM et 8 points minimum dans chacun des trois mini-cas |
| Mise en situation | `vp-recommandation-soutien`, adossée au cas fictif `cs-vp-insertion-3-regions`, autoévaluée et hors score |
| Portée | Certificat local de connaissances ; aucune délivrance de titre professionnel ni revue humaine intégrée |

## Décisions de cadrage actées (2026-07-20)

| Décision | Choix |
| --- | --- |
| Type de certification | Certificat de **connaissances** (`certificateType: 'knowledge'`) — évaluation locale QCM + mini-cas |
| Intitulé | **« Venture Philanthropy Foundations »** (le titre « VC Analyst » reste réservé à l'échelle professionnelle) |
| Ampleur | Livraison **complète en une vague** : 6 cours / 21 leçons publiées, évaluation opérationnelle, glossaire enrichi |
| Capstone | **Inclus hors score** : livrable `/livrables` + étude de cas modèle. Pas de parcours dédié dans cette vague |
| Rôle cible | Analyste ou chargé d'investissement junior sous supervision ; les décisions et expertises réservées restent hors périmètre |

## Contenu du dossier

| Fichier | Contenu |
| --- | --- |
| [`../REFERENTIEL-VENTURE-PHILANTHROPY.md`](../REFERENTIEL-VENTURE-PHILANTHROPY.md) | **Ancienne référence de certification, archivée** : périmètre, compétences, cartographie, évaluation, grille, sources et limites avant le déclassement. Elle est supplantée par le [référentiel maintenu du parcours](../../../parcours/VENTURE-PHILANTHROPIE.md). |
| [`PLAN.md`](PLAN.md) | Plan d'implémentation initial, désormais réalisé et supplanté. Il reste conservé pour expliquer les choix et écarts. |
| [`exploration-1-architecture-certifications.md`](exploration-1-architecture-certifications.md) | Rapport complet : modèle TypeScript, entrées existantes, rendu des pages, règles de validation, contraintes pour une nouvelle certification. |
| [`exploration-2-pipeline-edition.md`](exploration-2-pipeline-edition.md) | Rapport complet : format des leçons/quiz, conventions d'id/slug, workflow glossaire, hooks, séquence de commandes, charte de style §4.0.c. |
| [`exploration-3-inventaire-impact.md`](exploration-3-inventaire-impact.md) | Rapport complet : inventaire du contenu impact/philanthropie existant (leçons coquilles, grappe glossaire, cours-cadre), compteurs, formats confirmés. |
| [`references-verifiees.md`](references-verifiees.md) | Dossier de recherche : sources externes vérifiées en juillet 2026, schémas et notes de production. Il ne remplace pas une vérification à la date d'une décision réelle. |

## Invariants historiques de l'implémentation initiale

Les points ci-dessous décrivent les contraintes appliquées à l'ancienne certification. Ils ne constituent pas des instructions courantes. L'état maintenu est défini par les données exécutables et par le [référentiel du parcours](../../../parcours/VENTURE-PHILANTHROPIE.md).

- **`certificationLevels.json` non étendu** : aucune entrée VP n'avait été ajoutée à l'échelle VC Analyst…VC Principal.
- **Règle historique « 6 compétences »** : l'évaluation VP comptait exactement 6 compétences.
- **Arithmétique historique de l'évaluation** : `exam.points + Σ mini-cas = 100` ; `questionCount = 6 × questionsPerCompetency` ; seuils ≤ totaux.
- **Sorties générées** : `data/generated/` était déjà un répertoire dérivé, non une source éditoriale.
- **Score et mise en situation distincts** : les 24 QCM et les trois mini-cas formaient les 100 points ; le livrable de synthèse restait autoévalué.
- **Ancienne règle d'alignement** : les données exécutables et l'ancien référentiel de certification devaient évoluer ensemble. Cette règle est caduque ; aucune modification courante ne doit être reportée dans l'archive.
