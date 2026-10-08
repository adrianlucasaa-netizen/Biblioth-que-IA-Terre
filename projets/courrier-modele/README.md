---
titre: Courrier à partir d'un modèle
resume: Remplit un modèle de courrier administratif à partir de quelques informations fictives ou anonymisées, et signale tout champ manquant au lieu de l'inventer.
type: prompt
usage: automatisation-administrative
ia_compatibles: [toutes]
langue: fr
niveau: debutant
statut: propose
version: 0.7
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [courrier, modele, administratif]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Exemple (auteur fictif)"
relu_par: "[pas encore relu]"
---

## Le problème résolu

Les courriers administratifs suivent une trame répétitive. Les rédiger de zéro à chaque fois fait perdre du temps et introduit des oublis : une date, une référence, une formule.

Ce prompt remplit un modèle que vous fournissez. Il pose des questions sur les champs manquants et ne rédige le courrier qu'une fois qu'ils sont tous renseignés.

## Entrées et sorties

- **Ce que vous donnez** : un modèle de courrier avec des champs entre crochets (par exemple `[DATE]`), puis les informations pour les remplir.
- **Ce que vous recevez** : d'abord la liste des champs manquants s'il y en a, puis le courrier complet, prêt à être relu.

Un exemple se trouve dans `exemples/` : `modele-et-infos.md` en entrée, `courrier-attendu.md` en sortie.

## Limites connues

- Le courrier produit est un projet : vous le relisez et vous le validez avant tout envoi. Rien n'est envoyé par ce projet.
- L'IA ne connaît pas les règles de rédaction ni les formules de votre structure, sauf si le modèle les contient.
- Elle ne vérifie ni les références ni les dates que vous lui donnez.
- Ce prompt est au statut « proposé » : il n'a pas été relu par un second utilisateur.

## Pour adapter ce projet

Gardez vos propres modèles dans un fichier à part, avec des champs entre crochets, et ne mettez dans ce dépôt que des modèles fictifs.
