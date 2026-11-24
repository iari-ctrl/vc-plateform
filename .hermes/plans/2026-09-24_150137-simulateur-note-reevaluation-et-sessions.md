# Simulateur de note — réévaluation et plan compact

**Recontrôle : 24 septembre 2026. S1/S2 finalisés — S3 peut commencer sur demande.** S3 n’est pas engagé ; cette contre-revue ne constitue pas S4. La base et les preuves de réévaluation ci-dessous décrivent la préparation initiale, avant S1. Les livraisons S1/S2 et leur contre-revue de clôture sont consignées séparément dans `Suivis/JOURNAL.md`.

## Base et limites

Rapport historique : `/Users/iar-witness/.hermes/cache/scratch/simulateur-ui-review/analyse-ui-simulateur-note.md`, daté du 23 septembre 2026, conservé sans modification. Dépôt : `/Users/iar-witness/Documents/Projets/VC SITE/vc-platform`, branche `master`, HEAD `93908f8`.

Les neuf fichiers clés enregistrés dans `reassessment-baseline.json` ont des empreintes identiques au relevé précédent du 24 septembre : composant, template, CSS, générateur, tests du mémo, intégration React, tests DOM, page et layout. Les diffs pertinents ont été relus ; modèle, shell, tokens, contexte de thème, configurations et manifestes inspectés ne présentent pas de modification par rapport à HEAD.

Les mesures navigateur ci-dessous sont **réutilisées**, pas nouvellement exécutées. Les tests ciblés et la parité des trois HTML ont été recontrôlés une fois. Aucun nouvel audit général, build, générateur, changement de source ou mise à jour des suivis.

**Restriction immédiate :** `CLAUDE.md:88` autorise le parallèle pour les lectures/vérifications pures sur un état gelé, pas pour les écritures portant les mêmes invariants. S1/S2/S3 partagent `component.js`, `template.html`, leurs tests et les sorties générées.

## Matrice unique

« Corrigé » ferme le défaut décrit dans les états inspectés, pas toute la qualification du domaine. Propriétaire principal unique ; S4 vérifie ensuite l’ensemble.

| ID | Statut actuel | Preuve courte | Action restante | Session |
| --- | --- | --- | --- | --- |
| F01 | Corrigé — S1 | Confirmation des lignes renseignées dans les quatre listes ; annulation sans mutation/sauvegarde, focus conservé. Tests ciblés et recette Chromium verts. | Non-régression en intégration. | S4 |
| F02 | Corrigé — S1 | Copie du snapshot mémoire complet, repli sélectionnable et statut dans l’en-tête ; panne/reprise vérifiées, format inchangé. | Non-régression en intégration. | S4 |
| F03 | Corrigé | Composition centrale ; au relevé 1440 px, 812 px utiles pour la saisie. Hôte simplifié confirmé par le diff. | Conserver la largeur et éviter le retour des introductions/panneaux permanents. | S4 |
| F04 | Partiel | Autohauteur et défilement principal acquis ; à 390 × 844, premier choix vers y=617 et première zone de texte vers y=939. | Réduire l’encombrement mobile, sans nouvelle architecture de défilement. | S3 |
| F05 | Corrigé | Commandes « Sommaire » et « Aide à la relecture » explicites ; S2 distingue l’aide de « Relire la note ». | Non-régression en intégration. | S4 |
| F06 | Partiel | Sources élargies à environ 441 px/18 px au relevé desktop ; libellés/statuts encore à 8,5–10 px. | Agrandir les petits libellés et commandes, pas refaire les champs Source. | S3 |
| F07 | Corrigé — S2 | `requirements()` alimente `req()`, les états des sections et les repères « Attendu », selon le format ; notes vide/partielle/renseignée exercées. | Non-régression en intégration ; aucun verrou d’export ajouté. | S4 |
| F08 | Corrigé — S2 | Absences neutres, invalidités conservées, dépendances regroupées avec navigation ; zéro et surcharges brutes restaurées vérifiés. | Non-régression en intégration, modèle inchangé. | S4 |
| F09 | Corrigé — S2 et clôture | « Relire la note » ouvre l’aperçu incomplet ; aide et impression distinctes. Retour d’aide sous l’en-tête et étape active du sommaire tronquée corrigés ; focus visible vérifié. | Non-régression en intégration ; dialogue système non qualifié. | S4 |
| F10 | Partiel | `measure()` ajuste déjà l’A4 ; papier de 296 px à 320 px, soit environ 37,3 % ; pas de zoom explicite. | Ajouter « Ajuster » / « Taille réelle », sans seconde vue documentaire par défaut. | S3 |
| F11 | Corrigé | Synchronisation de thème dans `investment-memo.tsx:28-33` ; bascule sombre déjà exercée, papier resté clair. | Non-régression thème de l’outil/papier. | S4 |
| F12 | Corrigé — S2 | Aides résiduelles ajustées au bloc et au format, sans jugement implicite sur la qualité d’une note complète. | Conserver le registre factuel. | S4 |

Préfixes : `component.js` = `nouveau simu/src/component.js` ; `investment-memo.tsx` = `client/src/components/simulators/investment-memo.tsx`. Les lignes sont des points d’entrée à retrouver par symbole après modification.

**Après S2 : F01/F02 et F07/F08/F09/F12 corrigés dans le périmètre vérifié ; F04/F06/F10 restent partiels et réservés à S3.** Ne pas reconduire le double verdict historique « Block F01 + F02 ». La qualification d’ensemble reste réservée à S4.

## Que remettre en place ?

**Aucun retour à l’ancienne composition n’est justifié par les preuves examinées.** Ne pas restaurer la double introduction, les deux colonnes latérales permanentes, le défilement interne concurrent, le thème autonome divergent ou l’aperçu A4 non ajusté.

Le retour, le signet et les ressources liées ne sont pas à recréer : le diff de `client/src/pages/simulators/SimulatorPage.tsx` montre leur déplacement dans les commandes intégrées ; les ressources sont dans une modale. Leur présence dans le code ne remplace pas une recette exhaustive de leurs interactions.

Amélioration proposée, pas restauration d’une fonction perdue : rendre le statut d’enregistrement accessible près des commandes principales et expliciter les champs attendus. Conserver l’avertissement de confidentialité. Ne pas réintroduire une présentation longue pour apporter ces repères.

## Sessions proposées

### S1 — Protection et secours · GPT-5.5 high

**Livré le 24 septembre 2026.** 43 tests ciblés et parité des trois HTML verts ; recette Chromium et contre-revue indépendante réalisées. Gate global : 512 tests client et 118 tests Node réussis, un timeout transversal préexistant ; voir les suivis. Aucun changement de format du brouillon.

**F01/F02 ; priorité première.** Fichiers : `nouveau simu/src/component.js`, `nouveau simu/src/template.html`, `scripts/investment-memo.test.mjs` ; CSS limité aux nouveaux contrôles.

- Minimum recommandé : confirmation des suppressions de lignes renseignées ; lignes réellement vides supprimables immédiatement. Une source/date/mitigation seule compte comme saisie. L’annulation après suppression est une variante ergonomique, pas un préalable à une première correction sûre.
- Action « Copier le brouillon » fondée sur l’état en mémoire, y compris valeurs brutes et données masquées par Screening ; repli en texte sélectionnable si la copie échoue. L’export global fondé sur `localStorage` ne suffit pas à sauver des modifications non enregistrées.
- Statut d’enregistrement visible près des commandes, sans faux succès ; conserver les distinctions lecture/écriture/suppression indisponibles.

**Sortie :** tests des quatre listes, annulation de la confirmation sans perte, focus cohérent, panne d’écriture avec marqueur uniquement en mémoire récupérable, échec de copie et reprise réelle du stockage. Aucun changement de format `vcmemo.onepager.v1`.

### S2 — Progression, messages et sortie · GPT-5.5 high

**Livré le 24 septembre 2026.** Critères vérifiés : contrat unique de complétude dans les deux formats ; absence/invalidité/zéro distincts ; dépendances navigables ; aperçu de brouillon accessible avec focus visible ; aides adaptées et acquis S1 conservés. Cycles RED → correction → génération → GREEN ; 48 tests ciblés et parité des trois HTML verts. Recette Chromium : 12 scénarios vide/partiel/renseigné et intégration, puis 8 cas de restauration des surcharges après le défaut identifié en contre-revue. Correction du focus masqué sous l’en-tête et des surcharges composées d’espaces ; contre-revue finale favorable sur gel vérifié. Gate global exécuté une fois : 512 tests client et 122 tests Node réussis, un timeout transversal de 60 s ; seuls les contrôles affectés par les corrections finales sont repris. Détail et limites dans le journal ; aucun changement des calculs ni du format sauvegardé.

**F07/F08/F09/F12.** Mêmes fichiers principaux et tests que S1 ; créneau d’écriture distinct.

- Dériver états de section et champs attendus du même contrat que `req()` ; respecter les différences entre mémo complet et Screening. « Attendu pour compléter » ne doit pas devenir une interdiction d’exporter un brouillon.
- Absence initiale neutre ; nombres réellement invalides toujours signalés. Regrouper les dépendances manquantes avec accès à la section concernée, sans changer les formules.
- Dernière action « Relire la note » vers l’aperçu ; distinguer cette action de l’aide actuellement nommée « Relecture ». Clarifier « Imprimer / enregistrer en PDF » sans promettre un téléchargement automatique.
- Corriger uniquement les formulations résiduelles inadaptées.

**Sortie :** note vide/partielle/renseignée, deux formats, navigation libre, distinction absence/invalidité/zéro, compte de complétude cohérent, dernière action utilisable et focus dans la bonne vue. Conservation des données et tests financiers inchangés.

### Contre-revue de clôture S1/S2 — 24 septembre 2026

**S1/S2 finalisés — S3 peut commencer.** Deux défauts confirmés corrigés en RED/GREEN : marge de défilement des commandes Aide/Sommaire sous les barres desktop ; révélation horizontale de l’étape active à la réouverture du sommaire. Modèle, formules, format sauvegardé et intégration React inchangés. Deux tests ajoutés et trois HTML régénérés uniquement par `build:memo`.

- État final : **50/50 tests** mémo/budget média, lint ciblé et parité des trois HTML verts ; contre-revues indépendantes réconciliées, dernier delta favorable, gel final de 23 fichiers conservé.
- Nouvelles preuves Chromium : suppression/annulation et secours/panne/reprise S1 ; 12 notes dans les deux formats, 32 restaurations de surcharges, 12 configurations de navigation jusqu’à 320 px et 4 contrôles complémentaires à 1120/961 px. Focus contrôlé par cible, géométrie, hit-test et captures ; appel d’impression sans dialogue système.
- Aucun nouveau gate global ni build complet : corrections locales sans changement React ; les résultats globaux des livraisons précédentes restent historiques. Timeout transversal de prérendu, autres navigateurs et dialogue système ne bloquent pas ce passage à S3.
- Un léger débordement hérité du corps d’aide à 390 px reste dans le lot mobile S3. Ni zoom, ni refonte mobile, ni agrandissement des libellés engagé ici.

Preuves et matrice uniques : `/Users/iar-witness/.hermes/cache/scratch/memo-close-s1s2-2026-09-24/`, entrée `cloture.md`, gel `final-freeze-2.json`. Données du profil de recette retirées, navigateur et serveur arrêtés. Aucun staging, commit, push ou déploiement.

### S3 — Lisibilité, mobile et aperçu · GPT-5.5 high

**F04/F06/F10.** Fichier principal : `nouveau simu/src/parcours.css` ; modifications limitées du composant/template et de leurs tests pour le zoom et la structure.

- Agrandir les libellés/statuts actuellement à 8,5–10 px. Cible de départ : 12–13 px pour les libellés, à vérifier visuellement ; ce n’est pas un seuil universel de conformité.
- Réduire les empilements et doublons en haut du mobile, sans réduire les cibles tactiles ni restaurer deux défilements. Conserver les champs Source élargis.
- Garder l’ajustement A4 par défaut et ajouter une taille réelle, avec commandes toujours accessibles et déplacement local au document. Ne pas créer une nouvelle vue responsive complète sans nécessité démontrée.

**Sortie :** mesures à 1440/1120/820/390/320 px, saisie sans débordement global, réduction mesurée du délai d’accès visuel aux champs à 390 × 844, zoom utilisable au clavier, thème et focus préservés. Échelle et détection de dépassement à l’impression indépendantes du zoom écran.

### S4 — Intégration et clôture · GPT-5.5 high, xhigh si difficulté transverse

Dépend de S1/S2/S3 intégrées. Geler l’état, faire contre-vérifier séparément fonctionnement et rendu, puis intégrer seul les retours. Retester aussi les acquis F03/F05/F11. Mettre à jour `Suivis/ETAT.md` et ajouter une entrée à `Suivis/JOURNAL.md` uniquement après livraison vérifiée. Conserver les limites non testées, notamment impression système et lecteurs d’écran.

## Parallélisme et ordre

- **Préparation parallèle facultative :** deux lectures courtes, fonctionnement S1/S2 et rendu S3, limitées aux cas RED et aux choix encore ouverts. Ne pas refaire l’audit ni créer trois nouveaux rapports.
- **Écritures :** S1 → S2 → S3, une session autorisée à la fois. L’ordre répond aux priorités et aux conflits de fichiers ; stabiliser les libellés avant les dimensions réduit les reprises. Ce n’est pas une dépendance fonctionnelle générale entre les correctifs.
- **Intégration :** S4 après les trois lots ; contre-revues pures parallèles sur le même état gelé, navigateurs isolés. Toute correction invalide les preuves antérieures de la zone touchée.
- **Artefacts partagés :** `scripts/build-investment-memo.mjs` produit `client/public/tools/simulateur-memo.html`, `nouveau simu/embed/simulateur-memo.html` et `nouveau simu/Simulateur Note Investissement (local).html`. Jamais d’édition directe ni de génération concurrente.

## Validation et preuves

**Pendant les futurs correctifs uniquement :** RED ciblé, modification source, `npm run build:memo`, tests ciblés, `npm run check:memo`, recette Chromium et `git diff --check`. Les tests du mémo exécutent l’HTML assemblé : un GREEN sur un ancien artefact ne valide pas les sources modifiées. Ne pas lancer `npm run dev`/`npm run build` pendant une préparation en lecture seule : pré-hooks écrivants.

**Clôture d’ensemble S4 :** `npm run check` puis `npm run check:memo` (non inclus dans le premier). La contre-revue bornée S1/S2 ci-dessus suit ses contrôles proportionnés, pas ce gate d’intégration future. Pas de build complet sans nécessité de périmètre ; aucun commit, push, workflow ou déploiement.

**Réexécuté lors de la préparation initiale (historique, avant S1) :**
- `node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs` : 38 tests réussis, 0 échec.
- `npm run check:memo` : 3 artefacts conformes, sans régénération.
- Depuis `client/`, `../node_modules/.bin/vitest run src/components/simulators/simulators.dom.test.tsx --no-cache --configLoader=runner` : 8 tests réussis.

Preuves conservées dans `/Users/iar-witness/.hermes/cache/scratch/memo-reassessment-2026-09-24/` : `reassessment-baseline.json`, `geometry-complete.txt`, `interactions-result.txt`, captures antérieures ; nouveaux journaux `recheck-node-1519.txt` et `recheck-dom-1519.txt`. Aucun nouveau navigateur lancé. Pas de qualification supplémentaire Axe, lecteur d’écran, Safari/iOS/Firefox, clavier virtuel ou PDF système.

**Arrêt de la préparation initiale (historique) :** les douze IDs ont statut, preuve, action résiduelle et propriétaire ; les conflits et dépendances sont couverts. Le rapport historique, les sources, les générés et les suivis sont restés inchangés lors de cette préparation ; seul le plan a été compacté et précisé. Les livraisons et la clôture ultérieures sont consignées plus haut.
