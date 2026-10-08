# Contribuer

Tout le monde peut proposer un projet, sans compte et sans installer quoi que ce soit. Chaque proposition est relue avant d'apparaître sur le site.

## Proposer un projet

1. Ouvrez la page [Proposer un projet](proposer.html).
2. Remplissez le formulaire : l'essentiel, le problème résolu, le contenu (le prompt, les instructions ou le code), les étapes de fonctionnement, un exemple fictif.
3. Cochez les quatre engagements : aucune donnée réelle, exemples fictifs, aucun nom ni adresse, aucun appel réseau.
4. Cliquez sur *Vérifier et préparer ma proposition*. Le formulaire contrôle votre texte et vous signale tout ce qui ressemble à une donnée réelle (adresse électronique, numéro de téléphone, mention de protection…).
5. Téléchargez le fichier produit et envoyez-le à la personne qui gère la bibliothèque.

Rien n'est envoyé automatiquement. Votre saisie est conservée dans votre navigateur en attendant : vous pouvez fermer la page et revenir.

## Pour le responsable : ajouter une proposition reçue

Sous Windows, glissez le fichier `proposition-xxx.json` sur `ajouter.bat`. Sinon, dans un terminal :

`python outils/importer.py proposition-xxx.json`

L'outil crée le projet complet (fiche, fonctionnement, installation, exemples), le vérifie, puis propose de le publier. Si la vérification échoue, rien n'est ajouté et les problèmes sont listés : corrigez-les avec le contributeur.

Le projet arrive avec le statut « proposé ». Il n'est relevé que par un relecteur qui n'en est pas l'auteur (voir *Faire relire un projet*).

## Faire relire un projet

Demandez à un camarade de l'essayer avec les exemples. S'il valide, il inscrit son nom dans le champ `relu_par` de la fiche et passe le statut à « relu ».

## Adapter un projet existant

`python outils/nouveau.py ma-version --depuis synthese-conference`

La copie garde le lien vers l'original. Modifiez ce que vous voulez et re-attestez les contrôles. Cette méthode demande de modifier des fichiers à la main : elle s'adresse à ceux qui connaissent Git.

## Améliorer un projet publié

Modifiez les fichiers du projet, relancez `python outils/valider.py`, augmentez le numéro de version (1.0 vers 1.1 pour un ajustement, vers 2.0 pour un changement de fonctionnement) et décrivez le changement dans le message de commit.
