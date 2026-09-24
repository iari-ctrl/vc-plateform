# Intégrité des données locales : lot du 10 septembre 2026

Périmètre : S6-01, S6-03, S6-06, S6-21, S6-04, S6-02, S6-05 et S6-11 de [l’audit](AUDIT-UI-UX-PARCOURS.md). Les confirmations réutilisent `ConfirmDialog` ; le focus sur Annuler est activé uniquement pour ces commandes. Le sélecteur de fichier reçoit un indicateur de focus visible. Aucune fusion ni refonte des pages.

## Inventaire et formats

Le registre exécutable est dans `client/src/lib/localDataLifecycle.ts`. Les contrats existants restent propriétaires de la validation des domaines `vcpx:`.

| Données | Clés physiques | Export v2 | Import v2 | Purge |
| --- | --- | --- | --- | --- |
| Profil et préférences | `vcpx:profile`, `vcpx:theme`, `vcpx:onboarding-mode`, `vcpx:reading-depth` | Valeur brute exacte + bilan | Validation/migration puis remplacement | Suppression |
| Carnet, favoris, progression, journal | `vcpx:notes`, `vcpx:bookmarks`, `vcpx:progress`, `vcpx:decision-journal` | Valeur brute exacte + bilan | Validation/migration puis remplacement | Suppression |
| Travail de formation | `vcpx:learning-workspace` | Diagnostics, productions et activités | Contrats v0/v1 migrables vers v2 | Suppression |
| Certification | `vcpx:certification-enrollments`, `vcpx:certification-assessments` | Inscriptions et dossiers complets | Validation/migration puis remplacement | Suppression |
| Cahier et orientation | `vcpx:ikigai-cahier-answers`, `vcpx:ikigai-reading-mode`, `vcpx:ikigai-archetype`, `vcpx:ikigai-history` | Valeur brute exacte + bilan | Validation/migration puis remplacement | Suppression |
| Note d’investissement | `vcmemo.onepager.v1` | Valeur brute exacte + bilan | Contrôle du format v1 de l’atelier, sans réécriture de son format | Suppression |
| Anciennes clés produit | `onboardingMode`, `vcpx:highlights`, `vcpx:onboarding-seen` | Champ `archives` | Valeurs brutes ; l’alias d’orientation est préparé si sa clé active est absente | Suppression |
| Archives de migration | `vcpx:archive:<domaine connu>:v<entier>` | Champ `archives`, sans parser le contenu historique | Remplacement des archives du produit, valeurs brutes | Suppression |
| Copie d’opération | IndexedDB `vc-platform-local-recovery`, magasin `recovery`, entrée `pending` | Téléchargement de récupération distinct si une copie est présente | Ne remplace jamais une copie en attente | Retrait après vérification de l’opération ; retrait manuel confirmé si elle reste en attente |
| Autres clés | Par exemple `vcpx:foreign`, `vcpx:archive:foreign:v0`, clés d’autres applications | Exclues | Préservées | Préservées |
| Réglage de développement | `vc:viewport-device` | Exclu du périmètre utilisateur | Préservé | Préservé |

Les 15 enveloppes actives `vcpx:` et le format natif de la note restent inchangés. `prepareStoredRaw` est la préparation pure commune à la lecture, la migration explicite et l’import : aucun accès en écriture ni publication d’erreur durant cette préparation. Une ancienne enveloppe migrable est convertie en mémoire avant l’opération ; une version inconnue bloque tout remplacement.

Le fichier de sauvegarde passe de v1 à v2 pour ajouter la note et un inventaire explicite des archives. Le champ `payload` conserve ses clés logiques et ses valeurs brutes. Le bilan distingue absence, donnée valide, donnée migrable, copie brute et lecture impossible. Une lecture impossible omet la valeur avec `readErrors` et `complete: false`, sans la remplacer par un `null` trompeur. Un fichier incomplet ne peut pas être appliqué comme remplacement.

Les fichiers v1 historiques restent acceptés. La note et les archives absentes d’un fichier v1 sont conservées sur l’appareil ; cette restriction est affichée dans l’aperçu. Ce comportement assure la compatibilité du périmètre historique. Il ne crée pas de commande de fusion. Le fichier original reste un objet `File` téléchargeable, distinct du texte préparé. Une récupération partielle des domaines valides porte `kind: partial-recovery` et n’est pas applicable comme remplacement global.

La limite de fichier passe de 20 à 64 Mo : un export brut peut inclure les archives et l’échappement JSON des chaînes déjà sérialisées. Les limites de chaque domaine restent celles de leurs contrats ; les écritures restent soumises au quota réel du navigateur.

IndexedDB ajoute uniquement une copie temporaire de récupération. Une réservation et une relecture précèdent toute suppression dans `localStorage`. Cette séparation permet le remplacement quand le stockage actif est plein. Si la copie ne peut pas être créée et vérifiée, l’opération n’est pas appliquée. Une copie en attente ne peut pas être écrasée par une autre opération.

## Exécution et résultats

1. Lire le fichier, contrôler son format, préparer les migrations et comparer l’état présent au contenu préparé. Aucune mutation.
2. Afficher les ajouts, remplacements et suppressions par domaine. Proposer une sauvegarde préalable. Une nouvelle lecture refuse un aperçu devenu périmé.
3. Enregistrer la copie exacte, la relire, puis vérifier à nouveau l’état de départ. Libérer la capacité des seules clés produit remplacées avant d’écrire leurs nouvelles valeurs.
4. Relire chaque clé, actualiser `UserDataProvider`, `ThemeProvider` et le cache `learningWorkspace` via l’événement local, puis vérifier à nouveau. Les composants du cahier présents sur le profil sont rendus avec les nouvelles valeurs. Les pages non montées relisent leurs contrats à leur prochain montage.
5. Retirer la copie de récupération et vérifier le résultat final avant d’annoncer la réussite.
6. Sur échec après mutation, libérer les valeurs intermédiaires, tenter chaque restauration indépendamment puis comparer toutes les valeurs brutes. Annoncer une restauration uniquement si cette comparaison réussit. Sinon, nommer les domaines affectés et donner accès à la copie de récupération, également disponible après rechargement si sa persistance reste accessible.

La purge suit le même protocole. Une lecture préparatoire impossible retourne un résultat typé et laisse toutes les clés intactes. Un échec de nettoyage de la copie après mutation déclenche aussi une tentative de restauration.

## Preuves RED et non-régressions

Les premiers RED complets sont conservés localement dans `/tmp/vc-local-data-integrity/red-core.log` et `red-ui.log`.

| Constat confirmé avant correction | Cas reproductible conservé | Résultat attendu après correction |
| --- | --- | --- |
| S6-01 : restauration non vérifiée, écritures silencieuses acceptées | Panne pendant l’import ; panne persistante sur `theme` et `notes` ; écriture ignorée | Échec typé, restauration comparée par domaine, copie exacte récupérable |
| S6-03 : valeur illisible/incompatible exportée comme `null` | JSON tronqué et enveloppe v99 | Valeurs brutes conservées, bilan explicite avant téléchargement |
| S6-06 : ancienne représentation refusée | Notes sans enveloppe ; workspace v1 | Préparation sans écriture, migration partagée, original conservé |
| S6-04/S6-21 : archives, héritages et note absents de la purge | Clés historiques, archive connue et clé étrangère dans le même espace de noms | Périmètre complet du produit, clés étrangères conservées |
| S6-11 : exception de lecture hors du bloc de capture | `getItem` ou inventaire des clés indisponible | Aucun `setItem`/`removeItem`, erreur accessible et récupération proposée |
| S6-02 : état du thème et cache workspace anciens | Import puis purge avec les fournisseurs et le cache déjà initialisés | Valeurs persistées et états visibles cohérents avant confirmation |
| S6-05 : absence de bilan de remplacement | Import vide avec note locale présente | Suppression annoncée, remplacement explicite et sauvegarde préalable |

La non-régression couvre aussi : versions d’enveloppe 99, négatives, nulles ou fractionnaires ; version de sauvegarde inconnue ; données trop grandes ; conservation des archives brutes ; notes d’investissement invalides ; récupération des domaines valides ; alias historique ; aperçu périmé ; panne de copie ; panne d’actualisation ; panne de nettoyage ; restauration qui continue après plusieurs erreurs ; compte des réponses du cahier et des activités ; 100 notes avec quota calculé sur toutes les valeurs et clés.

## Recette navigateur isolée

Démarrer Vite directement, sans les hooks de génération racine :

```sh
npm run dev --workspace client -- --host 127.0.0.1 --port 5178 --strictPort
```

Dans un autre terminal, utiliser un navigateur de test dédié :

```sh
PUPPETEER_EXECUTABLE_PATH='/chemin/vers/le/navigateur-de-test' node scripts/local-data-lifecycle.browser.mjs
```

Le script refuse une origine autre que localhost ou 127.0.0.1. Il lance un contexte navigateur neuf, ne lit aucune donnée du profil utilisateur, utilise seulement des données synthétiques, puis ferme ce contexte. Les JSON, téléchargements, rapport et capture sont écrits dans un répertoire temporaire `vc-local-data-browser-*` annoncé à la fin.

Scénarios automatisés :

- Import de 100 notes avec changement du thème, du workspace et de la note ; suppression des archives absentes ; conservation des clés étrangères ; vérification après rechargement.
- Purge : inventaire, sauvegarde proposée, focus initial sur Annuler, Échap sans mutation, confirmation, thème et cache vidés, vérification après rechargement.
- Export brut, refus d’une version inconnue, récupération des domaines valides et téléchargement du fichier original vérifié octet pour octet.
- Remplissage jusqu’au quota natif par une clé étrangère synthétique. Avec 100 notes de 18 000 caractères, un import de notes de 17 900 caractères réussit et un import de notes de 19 000 caractères échoue avec restauration exacte. La clé de remplissage est conservée dans les deux cas.
- Panne qui empêche aussi la restauration : domaines nommés, copie exacte dans IndexedDB, copie encore accessible après rechargement et téléchargement vérifié octet pour octet.
- Réservation concurrente de deux copies : une seule est acceptée ; retrait vérifié. Capture à 390 × 844, absence de débordement horizontal et d’erreur JavaScript.

Complément manuel : au clavier, atteindre le sélecteur de fichier et vérifier son focus ; annuler le dialogue de choix ; choisir un fichier ; lire le bilan sans exposer les textes libres ; sauvegarder avant confirmation. Rejouer avec un lecteur d’écran sur les navigateurs visés avant qualification publique.

## Limites

La recette actuelle porte sur Chrome for Testing 151.0.7922.71, en contexte isolé. Safari, Firefox, VoiceOver, NVDA et appareils mobiles physiques restent à qualifier. Le retour de focus du dialogue système de fichier reste une vérification manuelle.

`localStorage` ne permet pas une transaction atomique entre plusieurs clés observées par d’autres onglets. Le lot vérifie l’état avant et après l’opération et refuse les aperçus périmés ; la résolution des conflits entre brouillons de plusieurs onglets (S6-09/S6-10) reste hors lot. Une interruption brutale peut laisser des valeurs intermédiaires et la copie de récupération en attente. La restauration au démarrage n’est pas automatique. Les données brutes incompatibles restent téléchargeables et demandent une récupération manuelle.

Une indisponibilité simultanée de tous les stockages interdit de garantir une récupération durable. L’interface annonce les domaines non vérifiables et garde la copie en mémoire quand elle existe ; elle n’annonce pas leur conservation.
