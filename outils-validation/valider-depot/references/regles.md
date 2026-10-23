# Règles d'épuration (à appliquer à la main seulement si aucun code ne peut être exécuté)

Retirer ou remplacer, dans tous les champs du dépôt :

| Élément | Traitement |
|---|---|
| Mention de protection (DIFFUSION RESTREINTE, CONFIDENTIEL DÉFENSE, SECRET, TRÈS SECRET, NON PROTÉGÉ, RESTRICTED, NATO …) | supprimer la mention |
| Nom de personne : prénom + nom (Jean Dupont, Marie de la Fontaine, DUPONT Jean). Un prénom seul reste | remplacer l'ensemble par `[personne]` |
| Adresse électronique réelle | `nom@example.org` (les domaines example.* sont laissés) |
| Numéro de téléphone | `[numéro retiré]` |
| Clé, jeton, mot de passe | `[clé retirée]`, et prévenir le validateur : elle doit être révoquée |
| Adresse IP | `192.0.2.1` |

Vocabulaires autorisés : voir `vocabulaires.json` dans ce dossier (usage, niveau, langue, ia, type).

Rappel : le résultat final ne doit plus contenir aucun de ces éléments. Sans exécution de code, ne produis pas de fichier « validé » : donne seulement une analyse écrite que le validateur relira de près.
