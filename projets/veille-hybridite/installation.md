## Étapes communes

Ce projet est écrit pour Claude, et pour Claude seulement. Il demande un compte Claude qui donne accès aux projets et aux tâches planifiées (d'après l'aide officielle, les tâches planifiées sont proposées aux formules Pro, Max, Team et Enterprise). Comptez une dizaine de minutes.

Dans la fiche de ce projet, l'onglet des fichiers affiche chaque fichier avec un bouton « Copier le contenu ». Il n'y a rien à télécharger ni à décompresser : vous copiez, vous collez.

## Claude

1. **Créer le projet.** Dans Claude, ouvrez « Projects », puis « New Project » (ou « Nouveau projet »). Donnez-lui le nom « Veille hybridité ».
2. **Coller les instructions.** Dans le projet, cliquez sur « Set project instructions » (« Définir les instructions du projet »). Dans la fiche de la bibliothèque, ouvrez `instructions.md`, cliquez sur « Copier le contenu », collez dans Claude, puis enregistrez. Si vous voulez restreindre la zone ou les acteurs, modifiez maintenant le bloc « Réglages », en haut du texte. Vous pourrez y revenir plus tard.
3. **Ajouter la base de connaissances.** Dans la zone des fichiers du projet, cliquez sur « + ». Ajoutez `connaissance-veille.md` : copiez son contenu depuis la fiche et, si Claude ne propose pas d'ajouter du texte directement, enregistrez-le d'abord dans un fichier nommé `connaissance-veille.md` avec le Bloc-notes, puis ajoutez ce fichier.
4. **Créer la carte (facultatif, recommandé).** Dans une conversation du projet, collez le texte qui se trouve en tête de `carte-specification.md` (partie « Texte à coller »). Ajoutez en pièce jointe la spécification et `exemples/2026-S39.json`. Claude construit la page et vous donne son adresse. Collez cette adresse dans la ligne « Carte » des Réglages (étape 2).
5. **Planifier le point de situation.** Dans une conversation du projet, collez le texte de `prompt-tache-planifiee.md` (partie « Texte à coller »). Claude vous propose un nom, un horaire et une consigne ; vérifiez-les et validez avec « Schedule » (« Planifier »). La liste des tâches se trouve sous « Scheduled » dans le menu de gauche.
6. **Tester une fois à la main.** Lancez la tâche depuis la liste « Scheduled » sans attendre le lundi. Contrôlez le résultat avec la liste de `prompt-tache-planifiee.md` (partie « Premier lancement : test »).

Pour changer de zone, de période ou de sources plus tard : modifiez seulement le bloc « Réglages » dans les instructions du projet (étape 2).

Les noms des menus changent selon les versions de Claude. En cas de doute, consultez l'aide officielle : [créer et gérer des projets](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) et [planifier des tâches récurrentes](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork).
