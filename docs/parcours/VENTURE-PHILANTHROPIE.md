# Référentiel de parcours — Fondamentaux de la venture philanthropie

> [!IMPORTANT]
> **Référence maintenue.** Ce document décrit le périmètre pédagogique du parcours `venture-philanthropy-foundations`. Les définitions exécutables vivent dans `data/parcours.json`, `data/courses.json`, `data/lessons.json`, `data/deliverables.json`, `data/caseStudies.json`, `data/diagnostics.json` et `data/caseCorrections.json`.

Statut au 2026-07-22 : le parcours `p-venture-philanthropy-foundations` est publié sous `/parcours/venture-philanthropy-foundations`. Il rassemble six cours, 21 leçons, un dossier longitudinal, trois exercices cumulatifs et une mise en situation autoévaluée. Il ne délivre aucun certificat, résultat, titre professionnel ou habilitation.

## Objet

La venture philanthropie est une approche de soutien à finalité sociale ou environnementale qui combine un financement adapté au besoin, un accompagnement non financier, un engagement suivi et une gestion proportionnée de l’impact. Elle peut mobiliser une subvention, une dette, des fonds propres dans une entité qui peut en émettre ou un instrument hybride. Elle ne constitue ni une forme juridique, ni un instrument financier autonome, ni une transposition du capital-risque aux associations.

Le parcours prépare à distinguer cette approche de la subvention philanthropique, du capital-risque, de l’investissement pour l’impact, de l’impact investing au sens financier et du financement catalytique, puis à analyser, structurer et suivre un soutien à une organisation d’intérêt général dans le cadre français. Il s’adresse notamment aux analystes et chargés d’investissement, aux responsables de programme et aux professionnels de la philanthropie qui contribuent à la sélection et au suivi d’organisations.

Il traite le travail préparatoire d’un dossier : triage au regard du mandat, analyse du problème et des preuves, diligences organisationnelle et financière, comparaison des instruments, recommandation, accompagnement, suivi et sortie. Il ne valide pas la décision finale d’engagement, la négociation ou la signature d’un instrument, une enquête de protection des personnes, une qualification juridique ou fiscale, ni la conduite autonome d’une relation de portefeuille.

## Composition

Les six cours sont suivis dans l’ordre ci-dessous. Les identifiants de leçons et leur ordre restent portés par `data/courses.json`. Le temps de lecture est recalculé à partir des `readMin` des leçons.

| Séquence | Cours | Lecture | Contribution guidée |
| --- | --- | ---: | ---: |
| 1 | `c-vp-mandat-triage` — Fondements, mandat et triage | 11 min | 75 min |
| 2 | `c-vp-probleme-preuves` — Problème, preuves et bénéficiaires | 15 min | 150 min |
| 3 | `c-vp-diligence-organisationnelle` — Diligence organisationnelle | 20 min | 210 min |
| 4 | `c-vp-diligence-financiere` — Diligence financière et résilience | 22 min | 390 min |
| 5 | `c-vp-structuration-financement` — Structuration du financement | 22 min | 270 min |
| 6 | `c-vp-partenariat-portefeuille` — Partenariat, recommandation, suivi et sortie | 21 min | 255 min |

Le parcours représente 111 minutes de lecture et environ 32 h 30 de production : 22 h 30 de contributions guidées, 4 h de consolidation et 6 h pour le jalon final. L’atelier portefeuille, le cas de transfert et une revue externe ajoutent jusqu’à 4 h facultatives. Ces durées sont des estimations de travail et restent distinctes des temps de lecture.

Les quiz associés aux leçons sont formatifs. Ils accompagnent l’apprentissage et n’alimentent ni score global ni résultat de parcours.

## Diagnostic et dossier longitudinal

Le diagnostic `diag-vp-entree` est facultatif, non noté et sans effet sur l’accès aux contenus. Ses cinq situations donnent un retour par thème sous les libellés « à revoir », « acquis à confirmer » et « point maîtrisé », puis renvoient vers les leçons ou fiches utiles. Aucun résultat agrégé n’est calculé.

Trait d’Union (`cs-vp-insertion-3-regions`) est le dossier apprenant commun aux 21 contributions. Il réunit des comptes, bilans, rapprochements, budgets, flux de trésorerie, fonds affectés, conventions, procès-verbaux, entretiens, données de cohortes, indicateurs, incidents et risques. Les documents incluent des contradictions qui demandent une hypothèse explicite. Ils permettent de construire une prévision à 13 semaines et un modèle à 18 mois sans divulguer de conclusion financière.

Limite de la passe du 22 juillet 2026 : ces données sont consultables sous forme de tables HTML, mais le classeur `.xlsx` recalculable reste à générer. Le paquet `@oai/artifact-tool` requis pour produire et vérifier ce fichier n’est pas disponible dans l’environnement actuel. Aucun lien vers un téléchargement inexistant n’est publié.

Les contributions des cours 1 et 2 alimentent `vp-exercice-cumulatif-probleme-preuves`, celles des cours 3 et 4 alimentent `vp-exercice-cumulatif-diligence`, et celles des cours 5 et 6 alimentent `vp-exercice-cumulatif-recommandation`. Les états de production, la note courte, la déclaration d’un fichier externe et les retours sont conservés dans `localStorage` sous la clé versionnée `vcpx:learning-workspace`.

La correction `corr-vp-trait-union` devient disponible après la déclaration d’une première version du jalon. Sa révélation est volontaire et persistée localement. Elle expose plusieurs décisions recevables, leurs hypothèses, les limites des preuves et les informations encore nécessaires. Ce mécanisme règle l’ordre pédagogique d’une application statique ; il ne constitue pas un contrôle d’accès.

## Jalon autoévalué

Le parcours se conclut par `vp-recommandation-soutien`. Le livrable demande un mémo de 2 500 mots maximum, une annexe financière recalculable, une présentation orale de 10 minutes, une réponse aux questions du comité, une décision motivée, une autoévaluation, un journal des modifications et deux ou trois prédictions datées.

La grille utilise quatre niveaux textuels : insuffisant, acceptable, solide et non observable. Ses 13 critères documentent une observation attendue, une preuve, une erreur fréquente et une question de révision. Aucun poids ni score n’est associé aux niveaux. Une revue par un pair ou un praticien peut être exportée et conduite hors plateforme.

Cette mise en situation reste autoévaluée. Elle sert à confronter le raisonnement à une recommandation modèle après production d’une réponse propre ; elle ne constitue ni une note, ni une revue humaine, ni une preuve de compétence professionnelle.

Le cas facultatif `cs-vp-energie-des-vallees` permet ensuite de transférer la méthode à une SCIC-SAS fictive du secteur de l’énergie locale. Selon les hypothèses retenues, la décision peut porter sur une garantie, un financement remboursable ou un refus.

## Sources et prudence d’usage

Chaque leçon comporte des références datées, institutionnelles ou primaires lorsque le sujet le permet. Une référence éclaire une méthode ou un repère ; elle ne remplace pas un avis appliqué au dossier. Les questions juridiques, fiscales, comptables, réglementaires, de protection des personnes ou de données doivent être vérifiées dans leur version applicable et, lorsque nécessaire, transmises au professionnel compétent.

Les exercices utilisent des données fictives ou agrégées. Aucun dossier réel de bénéficiaire, signalement nominatif ou renseignement confidentiel ne doit être ajouté pour compléter un cas.

## Maintenance

Toute évolution doit conserver l’alignement entre le parcours, les six cours, les 21 leçons, le cas et le livrable. Les données exécutables décrivent le comportement de l’application ; toute divergence avec le présent référentiel doit être corrigée dans le même changement. Le dossier `docs/archive/certifications/venture-philanthropy/` conserve les travaux de conception historiques et ne décrit plus l’état publié.
