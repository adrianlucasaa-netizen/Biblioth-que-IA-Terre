# Contribuer

Pour l'instant, les contributeurs sont un petit groupe de camarades choisis. La lecture est ouverte à tous. Cette page explique comment ajouter ou améliorer un projet.

## Ajouter un projet

1. Créez le dossier à partir d'un modèle :
   `python outils/nouveau.py mon-projet --type prompt`
   (types : prompt, skill, projet, script)
2. Ouvrez `projets/mon-projet/README.md` et remplacez tous les textes « À remplacer ».
3. Écrivez `fonctionnement.md` et `installation.md`, puis ajoutez vos exemples fictifs.
4. Relisez les règles de publication, vérifiez chaque contrôle, puis ajoutez-les à la ligne `controles`.
5. Vérifiez : `python outils/valider.py mon-projet`
6. Regardez le rendu : `python outils/build.py`, puis ouvrez `site/index.html`.
7. Enregistrez : `git add projets/mon-projet` puis `git commit -m "Ajout : mon projet"`.

## Adapter un projet existant

`python outils/nouveau.py ma-version --depuis synthese-conference`

La copie garde le lien vers l'original. Modifiez ce que vous voulez, et re-attestez les contrôles.

## Proposer une amélioration

Modifiez le projet, relancez la vérification, et décrivez le changement dans le message de commit. Augmentez le numéro de version : 1.0 vers 1.1 pour un ajustement, vers 2.0 pour un changement de fonctionnement.

## Faire relire un projet

Demandez à un camarade de l'essayer avec les exemples. S'il valide, il inscrit son nom dans `relu_par` et passe le statut à « relu ».
