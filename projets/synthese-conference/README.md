---
titre: Synthèse de conférence
resume: Transforme des notes brutes prises pendant une conférence en fiche de synthèse structurée. L'avis critique reste le vôtre.
type: projet
usage: synthese
ia_compatibles: [claude, chatgpt, mistral]
langue: fr
niveau: debutant
statut: recommande
version: 1.1
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [conference, notes, fiche]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Exemple (auteur fictif)"
relu_par: "Exemple (relecteur fictif)"
---

## Le problème résolu

Après une conférence, les notes sont en vrac : abréviations, idées dans le désordre, questions de la salle mêlées au propos de l'intervenant. Les mettre en forme prend du temps, et ce temps n'apporte pas de réflexion.

Ce projet automatise la mise en forme et vous laisse le jugement. L'IA trie, structure et signale ce qu'elle ne peut pas confirmer. Vous relisez et rédigez votre avis critique.

## Entrées et sorties

- **Ce que vous donnez** : vos notes brutes, collées telles quelles dans la conversation, et le titre de la conférence.
- **Ce que vous recevez** : une fiche en parties numérotées, les idées clés, les questions de la salle, et un encadré vide pour votre avis critique.

Un exemple complet se trouve dans le dossier `exemples/` : `notes-fictives.md` en entrée, `fiche-resultat.md` en sortie.

## Limites connues

- L'IA peut attribuer une idée au mauvais intervenant : relisez les attributions.
- Des notes très abrégées donnent une synthèse plus pauvre. Mieux vaut écrire une phrase complète que trois sigles.
- La fiche ne remplace pas votre avis critique, elle le prépare.
- Les chiffres ne sont jamais complétés : l'IA écrit `[À VÉRIFIER]` quand une valeur manque.

## Pour adapter ce projet

Le glossaire de `connaissance/` est un exemple fictif. Remplacez-le par le vôtre pour que l'IA comprenne vos abréviations, sans y mettre de donnée sensible.
