**Langage** : Python.

**Résumé** : le script compte les lignes de tous les fichiers texte du dossier « rapports », puis supprime chacun de ces fichiers. Il affiche le total à la fin.

## Explication par blocs

- Lignes 1 à 4 : préparation. Le script charge l'outil `os` (pour parler au système de fichiers), désigne le dossier « rapports » et met un compteur à zéro.
- Lignes 6 à 11 : boucle. Pour chaque élément du dossier, si son nom finit par `.txt`, le script ouvre le fichier, compte ses lignes et les ajoute au total.
- Ligne 11 : le fichier est ensuite supprimé.
- Ligne 13 : le total est affiché.

## Actions risquées

- Ligne 11 : `os.remove(chemin)` supprime définitivement chaque fichier `.txt` du dossier. Il n'y a ni confirmation ni corbeille.

Aucun accès réseau, aucune commande système, aucune lecture de mot de passe.

## Verdict

**À vérifier.** Le script fait ce qu'il annonce, mais il détruit les fichiers qu'il compte. Lancez-le uniquement sur une copie du dossier. Le nom du script ne laisse pas deviner cette suppression. Ce verdict n'est pas une garantie.

Pour un usage professionnel, demandez l'avis de votre soutien informatique.
