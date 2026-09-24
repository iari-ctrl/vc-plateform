# Simulateur de note d’investissement — maintenance et intégration

## Source unique à modifier

Le dossier [`../src/`](../src/) porte les sources. Ne pas modifier les HTML de distribution à la main.

| Fichier | Responsabilité |
| --- | --- |
| [`model.mjs`](../src/model.mjs) | Parsing numérique strict, contraintes, dépendances de calcul, cohérence des overrides. Module pur, importable et sans dépendance. |
| [`component.js`](../src/component.js) | Logique de l’atelier : état, modes, complétude, checklist, messages et synthèse. Classe `Component` exécutée par le runtime embarqué. |
| [`template.html`](../src/template.html) | Structure et styles de l’atelier, champs, descriptions accessibles et paramètres `data-props`. Le marqueur `__MEMO_LOGIC__` reçoit le modèle et le composant. |
| [`bundle-shell.html`](../src/bundle-shell.html) | Chargeur, runtime et polices hérités de l’export initial. Ressources conservées, sans copie de la logique métier ; ne pas en faire une seconde source du simulateur. |

Le script [`../../scripts/build-investment-memo.mjs`](../../scripts/build-investment-memo.mjs) assemble ces fichiers avec les API standard de Node. Il retire uniquement les déclarations `export` du modèle pur pour l’intégrer au script existant. Aucune nouvelle chaîne de compilation ni dépendance n’est nécessaire.

Depuis la racine du dépôt :

```sh
npm run build:memo
npm run check:memo
node --test scripts/investment-memo.test.mjs scripts/media-budget.test.mjs
npm run test --workspace client -- src/components/simulators/simulators.dom.test.tsx
```

`build:memo` produit automatiquement trois artefacts identiques :
- `client/public/tools/simulateur-memo.html` : fichier servi par vc-platform ;
- `nouveau simu/embed/simulateur-memo.html` : distribution autonome ;
- `nouveau simu/Simulateur Note Investissement (local).html` : ancien point d’entrée local conservé.

`check:memo` vérifie leur fraîcheur sans écriture. Les tests exécutent la logique extraite du **fichier servi**, vérifient sa parité avec le modèle importable et la reproductibilité des trois sorties. `npm run dev` et `npm run build` à la racine régénèrent le simulateur ; les commandes directes du workspace client ne le font pas. `npm run test` contrôle aussi la parité sans régénérer silencieusement.

## Contrat numérique et pédagogique

- Tous les montants sont en **M€**. Signe initial facultatif ; décimale avec virgule ou point ; groupes de milliers de trois chiffres séparés par espace ordinaire, insécable ou fine insécable. Exemples : `20`, `2,5`, `1 234,56`, `1234.56`. Espaces extérieurs ignorés. Unités, exposants, séparateurs mixtes et fragments tels que `20abc`, `1 2` ou `1.234,56` sont refusés.
- Pre-money et sortie : valeurs positives ou nulles. Levée, ticket et fonds : strictement positifs. Ticket inclus dans la levée, donc inférieur ou égal à celle-ci. Dilution cumulée : de 0 à 100 %, bornes incluses. Aucune hypothèse de dilution n’est préremplie pour une nouvelle note.
- Tour primaire simple : post-money = pre-money + levée ; participation = ticket / post-money ; part résiduelle = participation × (1 − dilution) ; produit de sortie = valeur des fonds propres à la sortie × part résiduelle ; multiple = produit / ticket ; fraction du fonds = produit / taille du fonds.
- Chaque résultat reste indisponible tant qu’une de ses dépendances est absente ou invalide. Une sortie nulle et une dilution de 100 % produisent bien des retours nuls, pas des champs manquants. Les résultats non finis sont indisponibles.
- Les overrides ne créent pas un second scénario : ils doivent satisfaire les bornes et correspondre au calcul issu des hypothèses. Tolérance numérique : `1e-9 × max(1, abs(résultat))`. Le résultat non arrondi du modèle est conservé. Une saisie manuelle invalide ou incompatible ne retombe pas silencieusement sur le calcul ; elle bloque les résultats dépendants. « Recalculer » retire le remplacement. Un champ manuel vidé reste éditable pendant la session.
- Le screening ne lit que les données numériques de l’opération. Ses six critères portent sur la recommandation, l’opération, la thèse, sa réfutation, trois faits sourcés et datés, et la question bloquante. Les hypothèses de sortie, jugements, risques et overrides du mémo complet sont conservés, mais ne valident aucun de ces critères.
- La complétude indique uniquement la présence des champs requis et la validité numérique. Elle ne mesure ni la véracité des faits ni la qualité du raisonnement.
- La synthèse utilise les mêmes résultats que les champs, avec leurs unités et les indisponibilités explicites. Les résultats sont bruts, hors frais, fiscalité et préférences de liquidation. Pas d’IRR, waterfall ou moteur multiscénario.

Référence pédagogique : pre-money 20, levée 5, ticket 2, dilution 30 %, sortie 500, fonds 100 → **8 % ; 5,6 % ; 28 M€ ; 14× ; 0,28×**.

## Intégration et limites locales

La route `/simulators/simulateur-note-investissement` utilise [`InvestmentMemoSim`](../../client/src/components/simulators/investment-memo.tsx). Le lien pleine page et l’iframe passent par `publicAssetUrl(...)` pour respecter le chemin de base ; conserver cette résolution plutôt que coder `/tools/...` en dur. Sous le breakpoint `sm`, l’iframe mesure `82svh` avec un minimum de `42rem` ; à partir de `sm`, elle mesure `900px` avec un minimum de `78vh`. La pleine page reste préférable pour l’impression.

Une seule note est sauvegardée sous `vcmemo.onepager.v1`, dans le `localStorage` de l’origine courante. Les changements de mode ne suppriment aucun champ. Aucun envoi des notes ni backend n’est ajouté. Ce stockage n’est ni confidentiel ni synchronisé entre appareils ; ne pas y saisir de données sensibles. Effacer les données du site supprime la note. L’export PDF utilise l’impression du navigateur.

Un échec de sauvegarde affiche une alerte et conserve la saisie en mémoire ; un effacement échoué ne recharge pas la page. Les événements `storage` propagent la note entre instances de la même origine. Tant qu’un brouillon local n’a pas pu être sauvegardé, ces événements, y compris un effacement distant, ne le remplacent pas. Une sauvegarde locale réussie enregistre ce brouillon et réactive la synchronisation. Cette protection donne priorité au brouillon local pendant la panne ; elle permet une reprise séquentielle, pas une fusion garantie d’éditions simultanées.

Recette : utiliser **Chromium explicitement**, jamais le navigateur Google Chrome par défaut de l’outillage. Pour Puppeteer, renseigner `PUPPETEER_EXECUTABLE_PATH` avec l’exécutable réel de Chromium avant les tests ou le build. Vérifier la route et le fichier autonome sous le même `VITE_BASE_URL` que le build, les erreurs locales, les cinq résultats de référence, les overrides, les changements de mode et l’aperçu. Sous `60rem`, le formulaire passe en une colonne et les rails sont repliables ; l’aperçu conserve une page A4 dans une région défilable au clavier. Depuis le bas d’une section longue, vérifier aussi que le titre suivant et la commande d’un rail refermé reviennent visiblement dans le viewport. Le runtime hérité est conservé ; la recette ne constitue pas une qualification exhaustive de l’impression PDF.
