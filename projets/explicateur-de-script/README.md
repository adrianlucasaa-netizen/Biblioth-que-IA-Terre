---
titre: Explicateur de script
resume: Explique en français, ligne par ligne et sans jargon, ce que fait un script que vous avez reçu avant que vous le lanciez, et signale ce qui est risqué.
type: prompt
usage: code-scripts
ia_compatibles: [toutes]
langue: fr
niveau: debutant
statut: propose
version: 0.8
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [explication, securite, code]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Exemple (auteur fictif)"
relu_par: "[pas encore relu]"
---

## Le problème résolu

On reçoit un script d'un collègue, on ne sait pas le lire, et on hésite à le lancer. Lancer un code que l'on ne comprend pas est un risque : il peut supprimer des fichiers ou envoyer des données.

Ce prompt explique le script avant son exécution et signale clairement les actions risquées. Il ne remplace pas un avis de votre soutien informatique.

## Entrées et sorties

- **Ce que vous donnez** : le code du script, collé dans la conversation, sans donnée sensible.
- **Ce que vous recevez** : un résumé en deux phrases, une explication par blocs, la liste des actions risquées (suppression, écriture, réseau, exécution de commandes), et un verdict : « sans risque apparent », « à vérifier » ou « ne pas lancer ».

Un exemple se trouve dans `exemples/` : `script-fictif.py` en entrée, `explication-attendue.md` en sortie.

## Limites connues

- L'IA peut passer à côté d'un comportement malveillant bien caché. « Sans risque apparent » n'est pas une garantie.
- Elle explique le code qu'on lui montre ; elle n'a pas vu les fichiers que le script ouvrira.
- Pour tout script à usage professionnel ou venant d'une source inconnue, demandez l'avis de votre soutien informatique.
- Ce prompt est au statut « proposé » : il n'a pas été relu par un second utilisateur.

## Pour adapter ce projet

Vous pouvez ajouter au prompt les actions que votre environnement juge risquées, par exemple l'écriture dans un dossier précis.
