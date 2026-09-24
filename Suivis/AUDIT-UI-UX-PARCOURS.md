# Recommandations UI, UX et parcours de Maison Sapience VC

Priorités : P0, perte de données ou tâche bloquée ; P1, problème majeur sur un parcours principal ; P2, gêne avec contournement ; P3, finition.

## Suivi du lot d’intégrité locale, 10 septembre 2026

S6-01, S6-03, S6-06, S6-21, S6-04, S6-02, S6-05 et S6-11 sont corrigés et vérifiés localement. La validation couvre 100 notes sous quota natif dans un contexte Chrome for Testing isolé, les échecs de restauration, les versions, les données brutes, les clés étrangères et les états visibles après rechargement. Le détail des formats, des RED, des commandes et des limites est dans [RECETTE-DONNEES-LOCALES.md](RECETTE-DONNEES-LOCALES.md).

S6-07 et S6-08 reçoivent seulement les ajustements liés aux commandes de ce lot : focus visible du sélecteur, sauvegarde préalable et focus de confirmation sur Annuler. La qualification du dialogue système et des lecteurs d’écran reste ouverte. S6-09/S6-10 et les autres axes conservent leur périmètre propre. Les constats ci-dessous restent la référence initiale de l’audit.

## Ordre de traitement

- Traiter l’intégrité de l’import (A), puis valider le cycle de vie des données (B).
- Faire correspondre les libellés de gestion des données (C) au périmètre retenu dans B.
- Préparer séparément la navigation (D), la sémantique des interfaces (E), les contrastes (J), les figures (K) et les corrections éditoriales (L).
- Appliquer les éventuelles migrations de reprise, quiz et notes (F, G, H) après les garanties de B. Réutiliser dans H le contexte défini dans F.
- Valider le focus de la navigation (D) avant les barres persistantes des pages longues (I).

## A. Intégrité de l’import

- S6-01 · P0. Préparer un remplacement qui conserve une copie récupérable avant toute suppression. Garantir un import complet ou la conservation exacte de l’état antérieur, y compris sous quota réel. Vérifier la restauration ; en cas d’échec, annoncer les domaines affectés et fournir un fichier de récupération. Conditionner la validation publique à la réussite des scénarios de quota avec les 100 notes de test.

## B. Export, purge, versions et synchronisation

- S6-02 · P1. Actualiser tous les magasins locaux après import et purge, y compris le workspace et le thème. Faire correspondre les états React aux valeurs écrites avant de confirmer la fin de l’opération.
- S6-03 · P1. Fournir un bilan d’export par domaine. Proposer une copie brute de récupération pour les données illisibles ou incompatibles, ou annoncer explicitement un export incomplet avant le téléchargement et avant la purge.
- S6-04 · P1. Inclure les archives de migration détenues par le produit dans le registre de cycle de vie et dans la purge. Distinguer sauvegarde active et archives, en préservant les clés étrangères au produit.
- S6-05 · P1. Annoncer « Remplacer les données de cet appareil » dans l’aperçu d’import. Comparer les données présentes et importées, compter les ajouts, remplacements et suppressions avec des unités compréhensibles, puis proposer une sauvegarde préalable. Définir les règles de conflit avant toute option de fusion.
- S6-06 · P1. Partager les migrations entre lecture et import dans une étape préparatoire sans écriture. Accepter les anciennes versions migrables ; refuser les versions inconnues avant écriture et proposer une récupération des domaines valides en conservant le fichier original.
- S6-09 · P1. Distinguer la version enregistrée du brouillon local. Lorsqu’un autre onglet enregistre une modification, préserver la saisie en cours, annoncer le conflit et permettre de comparer les versions avant de choisir.
- S6-10 · P2. Abonner le cahier et le thème aux changements de leur domaine pour actualiser les surfaces concernées dans les autres onglets.
- S6-11 · P2. Capturer les erreurs de lecture initiales de la purge, retourner un résultat typé et afficher un message accessible avec une action de récupération. Conserver toutes les clés en cas d’échec préparatoire.
- S6-21 · P1. Inclure la note d’investissement (`vcmemo.onepager.v1`) dans l’inventaire, les contrôles de version, l’export et la purge. Si un périmètre distinct est retenu, le nommer explicitement dans les commandes et explications.

## C. Gestion quotidienne du Workspace

- S1-02 · P1. Ajouter un accès visible « Données locales » dans la navigation Workspace et près des informations de stockage. Rendre l’export et la restauration accessibles en 1 activation depuis le tableau de bord, les notes et le journal, sur bureau et mobile.
- S5-01 · P1. Présenter avant les champs libres une consigne indiquant le stockage local, l’absence de chiffrement et les catégories de données à exclure. Associer cette consigne aux champs avec `aria-describedby` et donner accès à la gestion des données.
- S5-04 · P1. Afficher les commandes de suppression au repos sur écran tactile et au focus clavier. Prévoir une zone interactive de 44 × 44 px, un focus visible et un nom comprenant le titre de l’élément concerné.
- S5-06 · P2. Traiter les échéances du journal comme des dates civiles conservées telles que saisies. Déterminer le jour courant selon le fuseau local de l’appareil, distinguer « à venir », « aujourd’hui » et « en retard », puis recalculer les statuts et compteurs au changement de jour et au retour dans l’onglet.
- S5-08 · P2. Revérifier les compteurs et la présentation des dernières notes, puis employer « éléments du carnet » ou afficher séparément notes, citations et surlignages. Présenter les notes libres sans guillemets.
- S6-07 · P1. Donner un indicateur de focus au contrôle visible du sélecteur de fichier, par `focus-within` ou par un bouton nommé. Vérifier le retour de focus après fermeture du dialogue système.
- S6-08 · P2. Placer le focus initial de la confirmation de purge sur « Annuler ». Préciser la portée et le caractère définitif de la suppression ; donner accès à l’export avant purge et aux explications de restauration ensuite.

## D. Navigation et focus

- S2-01 · P1. Fermer la navigation latérale de bureau avec Échap et restituer le focus à une commande visible, sans rouvrir le volet immédiatement.
- S2-02 · P1. Exposer le nom, le rôle et l’état du résultat actif dans la recherche globale, avec une relation programmatique au champ. Rétablir un indicateur de focus visible et faire ouvrir par Entrée le résultat annoncé.
- S2-03 · P1. Ouvrir la recherche par une activation explicite au clic ou au clavier. Proposer un mot-symbole menant à `/home` et une commande de recherche distincte ; conserver la lecture et le focus au survol.
- S2-05 · P2. Donner au groupe de choix du portail un seul arrêt Tab, une navigation entre choix par les flèches et un état sélectionné explicite.
- S2-06 · P2. Corriger le placement et l’espacement du lien d’évitement. Le rendre visible au premier Tab et conserver son accès au contenu principal.
- S2-07 · P2. Porter les cibles des boutons de navigation mobile à 44 × 44 px, sans recouvrement.
- S2-08 · P2. Donner au bouton de thème mobile un nom indiquant l’action cible ou exposer son état courant. Actualiser cette information après chaque changement.
- S7-02 · P2. Après fermeture de l’aperçu du dictionnaire avec Échap, rendre le focus au terme déclencheur sans réouverture immédiate par son gestionnaire de focus.
- S7-03 · P2. Adapter la répartition de la barre mobile et prévoir un mot-symbole compact pour garder recherche et thème visibles au zoom 200 % sur un écran de 390 × 844.
- S7-07 · P1. Réserver l’espace nécessaire sous la barre mobile lors du défilement au focus. Garder le lien actif et son indicateur entièrement visibles.

## E. Titres, sélections et transitions

- S1-05 · P2. Permettre à `SectionHeading` de produire un `h1` pour le titre principal d’une page. Vérifier la hiérarchie complète de chaque consommateur avant de modifier son niveau.
- S3-05 · P2. Rendre le jalon final du parcours comme une section `h2`, conformément à la hiérarchie de la fiche.
- S4-07 · P1. Ajouter l’état « effectué », « en cours » ou « à venir » au nom accessible des étapes. Conserver les repères visuels et utiliser au besoin un libellé visible ou `sr-only`.
- S5-12 · P1. Exposer l’état de l’option Participating et du mode LP-led/GP-led dans les simulateurs Waterfall et Secondaries. Employer une case à cocher, un interrupteur ou un bouton à état selon la commande, et un groupe de choix adapté aux modes.
- S6-23 · P2. Présenter les réponses d’orientation comme un choix unique dans un groupe nommé, avec radios natives et légende de question, ou une sémantique équivalente.
- S7-01 · P1. Après une transition dans l’orientation, la production ou le journal, placer le focus sur le nouveau titre ou le premier champ pertinent et annoncer l’étape. Conserver les saisies et un ordre de tabulation cohérent.
- S7-08 · P2. Donner aux filtres des notes et du journal un groupe nommé et un état de sélection accessible, actualisé sans déplacement de focus.

## F. Contexte et reprise des parcours

- S1-03 · P1. Proposer le maintien du contexte d’entrée des études de cas, avec Formation comme pôle actif après une arrivée depuis la bibliothèque ou un parcours. Arbitrer leur rattachement principal et tester la compréhension de cette navigation avec des utilisateurs.
- S3-02 · P1. Conserver l’URL de recherche et les filtres lors du retour d’un cours vers la bibliothèque, via l’état de navigation ou un paramètre contrôlé. Donner priorité au contexte explicite d’un parcours lorsqu’il existe.
- S3-07 · P1. Considérer une lecture contextualisée commencée comme un parcours en cours. Enregistrer et réutiliser le parcours, le budget, la date d’activité et un repère stable de lecture dans les surfaces de reprise ; préserver les champs existants lors d’une mise à jour ou d’un accès canonique. Définir la priorité entre parcours principal et dernière activité, ainsi qu’un repli explicite si le repère disparaît.
- S4-04 · P1. Propager le parcours et le budget aux liens de pratique, lectures internes, modèles, ressources, livrables et retours depuis le journal. Appliquer le mécanisme commun de contexte aux destinations concernées.
- S4-05 · P1. Ajouter aux livrables intermédiaires les commandes précédent, suivant et retour contextualisés, avec `parcoursStepNavigation`.
- S4-06 · P2. Revérifier la reprise du tableau de bord, puis définir les activités et productions à inclure. Créer un sélecteur commun couvrant lecture, activité et production enregistrée, avec un classement par date d’activité selon la règle retenue.

## G. Résultats d’apprentissage et d’orientation

- S4-01 · P1. Conserver la tentative, le score et l’état du quiz pour permettre la reprise. Présenter séparément « lecture terminée » et « quiz terminé », en gardant la navigation libre et la distinction avec une certification professionnelle.
- S4-02 · P2. Revérifier le déroulement du quiz, puis comparer avec des utilisateurs 2 variantes permettant de corriger une réponse : retour immédiat avec bouton « Continuer », ou écran de vérification avant soumission et score final.
- S6-22 · P1. Conserver les réponses d’orientation avec leur version, ou ramener la navigation à la première réponse manquante. Exiger toutes les réponses requises avant le calcul du profil et garantir la cohérence entre URL, réponses et rechargement.
- S7-05 · P1. Vérifier la présence du corps d’une leçon avant d’afficher le lecteur et sa commande de complétion. En cas d’absence, afficher une indisponibilité avec relance, préserver la progression antérieure et empêcher l’enregistrement d’un état `done:100`.

## H. Annotation, provenance et réemploi

- S4-03 · P1. Ajouter une action clavier explicite de citation ou de surlignage par paragraphe ou section, avec choix du passage, focus visible et confirmation annoncée. Vérifier que l’annotation est conservée après rechargement.
- S5-02 · P1. Enregistrer le type de source, son identifiant, son URL contextualisée et un repère stable du passage. Résoudre l’identifiant vers le titre et l’URL actuels ; pour une source absente, conserver l’extrait, nommer l’indisponibilité et proposer un retour au carnet ou le rattachement d’une autre source.
- S5-03 · P1. Comparer copie, lien et insertion pour le réemploi d’une note ou citation. Proposer ensuite « Utiliser dans… », avec choix de destination, préremplissage contrôlé, provenance conservée et relation entre la note et la décision ou production créée.
- S5-07 · P1. Ajouter une recherche plein texte locale et un tri par date ou source dans le carnet, avec commandes accessibles sur mobile. Tester la recherche d’une note connue parmi 50 éléments en au plus 3 actions.
- S6-12 · P2. Permettre l’édition des notes libres avec date de modification et un commentaire lié pour les citations. Conserver l’identifiant, la provenance et la date de création, y compris après export/import. Garder la prédiction d’origine immuable et dater tout amendement au journal.

## I. Comparaison et commandes des pages longues

- S3-03 · P1. Tester une barre compacte persistante donnant accès à la recherche, au nombre de filtres actifs et au panneau complet dans la bibliothèque. Conserver la synchronisation avec l’URL et l’annonce du nombre de résultats ; rendre les filtres accessibles au milieu et en fin de liste.
- S3-04 · P2. Revérifier les formats des cartes, puis tester des rangées communes avec un ordre stable des métadonnées pour comparer cours, leçons et cas.
- S3-06 · P2. Ajouter « Réinitialiser les filtres » dans l’état vide de la bibliothèque. Restaurer `/bibliotheque` en 1 activation et annoncer le total des résultats.
- S4-08 · P2. Tester une barre mobile compacte donnant accès au sommaire, au carnet, au favori et aux références pendant les lectures longues. Préserver la section courante et la visibilité du texte et du focus ; viser un accès aux commandes retenues en au plus 2 actions depuis 75 % de la lecture.

## J. Thème et contrastes

- S2-04 · P1. Initialiser la classe de thème et `theme-color` dans le `<head>`, avant le premier affichage de React. Tester la préférence enregistrée, la préférence système et un chargement retardé.
- S3-01 · P1. Définir des couleurs de texte atteignant 4,5:1 pour les métadonnées concernées dans chaque thème. Vérifier les composants consommateurs et conserver les accents décoratifs sur fonds, bordures et pictogrammes.
- S5-10 · P2. Assombrir les numéros du gabarit de livrable ou ajuster leur fond pour atteindre 4,5:1 dans les variantes visées. Préserver la lisibilité du thème sombre.
- S6-13 · P2. Donner au titre d’archétype une couleur de texte atteignant 4,5:1 dans le résumé. Vérifier chaque archétype en clair et sombre, en conservant sa couleur d’identité sur les ornements.

## K. Figures et tableaux

- S4-09 · P2 provisoire. Vérifier l’accès clavier et le défilement des 7 tableaux AltoSuite dans les autres navigateurs, après ouverture des accordéons. Selon les résultats, ajouter une prise de focus explicite, un nom accessible, un indicateur visible et une instruction courte de défilement ; conserver légendes et en-têtes.
- S5-11 · P2. Rendre consultables les 7 montants de financement de 2019 à 2025 et leur unité `Md$`, dans la courbe ou dans une table associée.
- S7-04 · P2. Donner aux matrices une table sémantique avec en-têtes reliés aux cellules et appréciations textuelles, ou une alternative équivalente reliée à la figure. Vérifier que chaque appréciation reste associée à sa ligne et sa colonne avec un lecteur d’écran.
- S7-09 · P2. Réserver une largeur suffisante aux légendes horizontales du quadrant, autoriser leur retour à la ligne ou séparer leurs positions. Vérifier leur lisibilité aux différentes tailles, au zoom et avec des libellés longs.

## L. Entrées, marque et exactitude éditoriale

- S1-01 · P1. Tester une entrée secondaire « Première visite » vers l’orientation depuis le portail ou l’accueil. Garder Formation et Intelligence comme premiers pôles de l’accueil, avec Workspace secondaire.
- S1-04 · P1. Appliquer Maison Sapience VC aux surfaces publiques concernées : portail, titres, métadonnées, manifeste et pied de page. Identifier les exceptions historiques ou techniques justifiées.
- S3-08 · P3. Revérifier les formulations des parcours et appliquer la charte éditoriale. Employer selon le contexte « Choisissez votre parcours », « Étape requise », « Exercice, simulateur ou livrable », « Contenu facultatif » et « Cas court ».
- S5-13 · P2. Décrire les dates réellement disponibles pour les convictions. Si une date propre est ajoutée, définir sa règle d’édition et utiliser une valeur justifiable, sans inventer d’historique.
- S5-14 · P1. Faire pointer « Document original » du mémo YouTube vers la pièce effectivement vérifiée. À défaut, nommer la destination comme contexte du procès et indiquer l’indisponibilité de l’original.
- S5-15 · P2. Décrire le simulateur pre/post-money selon ses entrées et sorties disponibles. Traiter toute extension des capacités annoncées comme une décision distincte, avec les entrées et calculs nécessaires.
- S7-06 · P2. Respecter le contrat de rendu des résumés : interpréter les notations prévues ou fournir du texte simple. Retirer les marqueurs bruts des 6 justifications et du résumé Coinbase en conservant les liens intentionnels et en modifiant les sources propriétaires.

## Comportements à conserver

- Garder les filtres de parcours et le budget dans l’URL, ainsi que l’atlas facultatif chargé à la demande.
- Conserver les radios natives du diagnostic, le retour d’état, les réponses saisies et la navigation libre entre étapes consultables.
- Préserver les liens précédent/suivant déjà contextualisés, la déclaration d’activité, les étapes de première version, retour et révision, ainsi que l’accès à la correction selon l’état prévu.
- Conserver la persistance des notes et favoris, les confirmations et compteurs après écriture réussie, le refus des fichiers invalides avant écriture et la protection des clés étrangères.
- Garder dans le journal l’hypothèse, le raisonnement, la confiance, le résultat et le lien canonique au livrable.
- Préserver les relations entre dossiers parents et enfants, les dates de mise à jour, la distinction extrait/annotation des mémos, la chronologie et les sources de l’anti-portfolio.
- Conserver les champs numériques nommés, les résultats actualisés, la validation des champs et l’aperçu défilable de la note d’investissement.
- Préserver l’annulation des dialogues, le confinement et la restitution du focus des menus et confirmations, ainsi que les possibilités de relance après chargement ou erreur.
- Respecter le mouvement réduit, conserver l’alternative fixe de l’article Debord et le mode de rendu des articles dans l’URL.

## Vérifications et essais recommandés

- Rejouer les scénarios de quota, export/import, purge, versions anciennes et inconnues, erreurs de lecture, concurrence entre 2 onglets et interruptions. Vérifier chaque domaine et les données conservées après rechargement.
- Définir les combinaisons requises pour la validation publique : VoiceOver/Safari et NVDA/Firefox, puis Safari sur iOS et Chrome sur Android matériel. Consigner les versions et les limites éventuelles.
- Compléter les contrastes sur fonds photographiques et les états de survol. Vérifier les dialogues système d’impression, leur sortie, le retour du focus et le résultat imprimé.
- Tester l’orientation, la comparaison, la reprise et le réemploi avec des utilisateurs correspondant au public retenu. Examiner la compréhension des forces et horizons de conviction, l’utilité des 3 modes d’Ikigai et l’adéquation des recommandations à la cadence disponible.
- Tester l’intérêt des transitions dossier → cas ou simulation → décision, ainsi que l’enregistrement et la comparaison de scénarios, avant de retenir ces usages.
- Reprendre la vérification d’un examen local actif lorsqu’une évaluation publiée existe.
