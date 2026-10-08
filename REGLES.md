# Règles de publication

Ces règles s'appliquent à tout projet de la bibliothèque. Elles protègent les utilisateurs et la communauté. Le script de vérification en contrôle une partie ; le reste repose sur vous et sur le relecteur.

## Règle d'or

**Cette bibliothèque est hors du réseau sécurisé de la Défense. N'y publiez rien de réel.** Tous les exemples sont fictifs ou anonymisés au point d'être sans lien avec une situation réelle.

## Ce qui est interdit dans un projet

- Tout document ou texte portant une mention de protection, quelle qu'elle soit.
- Les noms de personnes réelles, de lieux ou d'unités réels, de matériels ou d'opérations réels.
- Les adresses électroniques, numéros de téléphone, adresses IP, mots de passe, clés ou jetons.
- Les scripts qui accèdent au réseau, lancent des commandes système ou exécutent du texte comme du code.
- Les fichiers qui ne sont pas du texte simple (formats autorisés : md, txt, py, json, csv, yaml). Taille maximale par fichier : 200 Ko.

## Les quatre contrôles à attester

Avant publication, l'auteur vérifie lui-même chacun de ces points, puis les inscrit dans le champ `controles` de la fiche. Sans les quatre, le projet n'est pas accepté.

1. **aucune-donnee-reelle** : le projet ne contient aucune information réelle.
2. **exemples-fictifs** : tous les exemples sont inventés.
3. **aucun-nom-adresse** : aucun nom réel, aucune adresse, aucun numéro.
4. **aucun-appel-reseau** : le projet n'envoie ni ne télécharge rien par lui-même.

## Ce que doit contenir une fiche

- Un titre, un résumé, et les champs de classement (type, usage, IA compatibles, langue, niveau).
- Trois sections : *Le problème résolu*, *Entrées et sorties*, *Limites connues*.
- Un fichier `fonctionnement.md` : les étapes, qui fait quoi (vous ou l'IA), avec un exemple fictif par étape.
- Un fichier `installation.md` : la marche à suivre, commune puis par IA.
- Au moins un exemple fictif d'entrée et de sortie attendue.

## Statuts

- Tout nouveau projet est **proposé**.
- Seul un relecteur, autre que l'auteur, passe un projet à **relu** puis **recommandé**, et inscrit son nom dans `relu_par`.
- L'auteur ne relève jamais lui-même le statut de son projet.

## Adaptations

Adapter un projet crée un nouveau projet. Il garde le lien vers son original (champ `filiation`), repart en statut « proposé » et doit être de nouveau attesté : les contrôles ne sont jamais hérités.

## Limites de la vérification automatique

Le script de vérification est un premier filtre. Il repère des motifs courants (adresses, numéros, mots de marquage, imports réseau). Il ne comprend pas le sens d'un texte : il ne garantit pas qu'un projet est sans risque. La relecture humaine reste obligatoire.

## Licence

La licence applicable aux projets n'est pas encore décidée. Tant qu'elle ne l'est pas, ne publiez que ce que vous avez le droit de partager.
