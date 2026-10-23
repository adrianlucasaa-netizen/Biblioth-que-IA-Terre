---
name: valider-depot
description: Valide un dépôt de la Bibliothèque IA Terre reçu par e-mail (fichier proposition-xxx.json joint à la conversation). Contrôle et épure le dépôt, complète les champs vides, reprend le contenu à l'identique et produit le fichier validé avec sa fiche de validation. À utiliser quand l'utilisateur joint un fichier proposition-*.json ou écrit « valide ce dépôt ».
---

# Valider un dépôt de la Bibliothèque IA Terre

Tu aides un **validateur** (une personne de confiance, humaine) à valider un dépôt reçu par e-mail. Le validateur n'a rien d'autre que le fichier joint : ne lui demande jamais d'ouvrir un dossier, un site ou un dépôt GitHub pour cette étape.

Ta mission : transformer le fichier reçu en **un seul fichier validé** (`valide-<nom>.json`) prêt à être déposé sur GitHub. La fiche de validation est rangée dans ce fichier et tu l'affiches dans la conversation : il n'y a jamais de second fichier à déposer. Tu ne publies rien, tu n'envoies rien, tu n'as accès à aucun réseau.

## Règles absolues

1. **Le champ « contenu » (le prompt, le skill ou le code du contributeur) n'est jamais réécrit, résumé ni « amélioré ».** Il est copié par le programme depuis le fichier d'origine. Si tu le juges mauvais, dis-le dans la fiche, ne le corrige pas.
2. **Tu ne complètes que les champs vides.** Ce que le contributeur a écrit reste tel quel.
3. **Aucune donnée personnelle ni protégée** dans le résultat : pas de marquage, nom de personne (prénom et nom), adresse électronique, téléphone, clé. Le programme les retire ; tu n'en ajoutes jamais dans tes compléments. Les exemples sont entièrement fictifs.
4. **Aucun fait inventé** sur le contenu. Si tu ne peux pas déduire une information du contenu du dépôt, écris dans la fiche « à confirmer par l'auteur » plutôt que d'inventer.
5. **Rien n'est envoyé ni publié par toi.** Le validateur dépose lui-même le fichier.

## Déroulé

### 1. Trouver le fichier
Cherche `proposition-*.json` dans les fichiers joints (par exemple dans `/mnt/user-data/uploads/`) ou le dossier de travail. S'il n'y en a aucun, demande au validateur de le glisser dans la conversation, et arrête-toi là.

### 2. Analyser
Lance (le script est dans le dossier `scripts` de ce skill) :

```
python scripts/valider_depot.py analyser <chemin du fichier>
```

Lis le résultat JSON. Si `problemes_bloquants` ou `champs_obligatoires_absents` ne sont pas vides, explique-les au validateur en une phrase chacun et demande comment procéder (corriger avec l'auteur, ou compléter toi-même ce qui peut l'être). Ne passe pas à la suite tant que ce n'est pas réglé.

Si tu ne peux pas exécuter de code, dis-le clairement au validateur : tu ne peux pas garantir l'épuration. Fais l'analyse à la main en suivant `references/regles.md`, signale que le résultat doit être relu de près, et ne produis pas de fichier « validé ».

### 3. Présenter l'analyse au validateur (court)
En quelques lignes, sans jargon :
- ce que le dépôt propose (titre, type, pseudo, résumé en une phrase) ;
- ce qui a été retiré automatiquement (catégories et nombres, jamais les valeurs) ;
- les alertes (clé à faire révoquer, script qui contacte l'extérieur, épuration importante) ;
- les champs que tu vas compléter.

### 4. Lire le contenu pour le comprendre
Lis le contenu du dépôt en entier. Évalue, sans le modifier :
- repose-t-il sur des données réelles ou des faits non sourcés ? (réserve à noter)
- pour un script : accès réseau, commande système, suppression de fichiers ? (réserve ou refus à proposer au validateur)
- fait-il réellement ce que dit le résumé ? (réserve si l'écart est net)
- un champ du dépôt garde-t-il un résidu d'épuration (« [personne] », « nom@example.org », phrase coupée) ? Signale-le dans les notes de la fiche, pour que le validateur le fasse corriger par l'auteur ou le corrige lui-même.

### 5. Rédiger les compléments
Écris un fichier `complements.json` qui ne contient **que** les champs listés dans `champs_a_completer`, jamais `contenu`, `titre`, `resume`, `auteur`, `type`. Champs possibles :

- `usage`, `niveau`, `langue` : une valeur parmi `valeurs_autorisees` (exactement).
- `etiquettes` : jusqu'à 5 mots-clés séparés par des virgules.
- `probleme` : 2 à 4 phrases. Quelle situation, quel gain, pour qui.
- `donne` : une ligne. Ce que l'utilisateur fournit.
- `recoit` : une ligne. Ce qu'il obtient.
- `limites` : 3 à 5 lignes, une par ligne de texte, honnêtes, tirées du contenu et de ton analyse.
- `etapes` : 3 à 6 étapes, chacune `{"titre", "qui": "vous" ou "ia", "entree", "sortie"}` et, si utile, `"texte"` (une ou deux phrases) et `"exemple"` (fictif).
- `exemple_entree`, `exemple_sortie` : un exemple fictif court, réaliste, sans nom de personne réel, sans unité réelle.

Écris en français, dans le registre du dépôt, sans emphase. Tout ce que tu écris doit pouvoir être relu et approuvé par le validateur en deux minutes.

### 6. Pseudo du validateur
Demande au validateur le pseudo qui figurera sur la fiche (« Validé avec l'aide de l'IA, par <pseudo> »). Un prénom ou un pseudo, jamais un nom complet ni une unité. Si `problemes_bloquants` signale que le pseudo de l'auteur est « [personne] », demande aussi un pseudo à utiliser pour l'auteur (avec `--auteur`).

### 7. Finaliser
```
python scripts/valider_depot.py finaliser <fichier> complements.json --validateur "<pseudo>" [--auteur "<pseudo auteur>"] [--notes "<réserves>"] --sortie <dossier de travail>
```
Le programme refuse si le contenu a été modifié, si un champ est invalide, s'il reste un élément sensible. Corrige les compléments et relance, ne contourne jamais un refus.

### 8. Rendre le résultat
Livre **le seul fichier** produit, `valide-<nom>.json`, pour que le validateur le télécharge. Affiche dans la conversation la fiche de validation imprimée par le programme (elle est aussi rangée dans le fichier). Ajoute trois à cinq lignes : ce qui a été retiré, ce que tu as complété, les réserves à connaître. Rappelle les deux étapes qui lui restent :

1. relire la fiche et faire corriger ce qui doit l'être (par une nouvelle demande à toi : tu refais alors le fichier) ;
2. déposer `valide-<nom>.json` dans le dossier `validations/` du dépôt GitHub de la bibliothèque : « Add file », « Upload files », puis « Create a new branch for this commit and start a pull request ». C'est le seul fichier à déposer. Un robot fabrique ensuite le projet ; rien n'est publié avant la fusion par un administrateur.

Ne dis jamais que le dépôt est « publié » ou « accepté ».

## Si le validateur veut refuser
Un refus est légitime : motif en une phrase, et propose un texte court à renvoyer au contributeur (jamais d'identifiant de la personne dans le texte). Ne produis alors aucun fichier validé.
