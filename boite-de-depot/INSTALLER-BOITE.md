# Installer la boîte de dépôt (à faire une seule fois)

Durée : environ 10 minutes. À faire **avec la nouvelle adresse Google dédiée au projet**, jamais avec une adresse personnelle : le script reçoit le droit de créer des fichiers dans le Drive de ce compte, qui ne doit donc contenir rien d'autre.

## 1. Créer le script
1. Connectez-vous à Google avec l'adresse dédiée, puis ouvrez **script.google.com**.
2. Cliquez sur **Nouveau projet**. Nommez-le « Boîte de dépôt » (en haut à gauche).
3. Dans l'éditeur, sélectionnez tout le texte du fichier `Code.gs` et supprimez-le.
4. Ouvrez le fichier `boite-de-depot\Code.gs` de votre dossier, copiez tout son contenu et collez-le dans l'éditeur. Cliquez sur l'icône **Enregistrer**.

## 2. Préparer la boîte
1. Dans la barre du haut, choisissez la fonction **installer** dans la liste déroulante, puis cliquez sur **Exécuter**.
2. Google demande une autorisation : **Examiner les autorisations**, choisissez le compte dédié, puis (écran « Google n'a pas validé cette application ») **Paramètres avancés**, **Accéder à Boîte de dépôt**, **Autoriser**. Ce message est normal pour un script que l'on a écrit soi-même.
3. En bas, le « Journal d'exécution » affiche le dossier créé et la liste des validateurs.

## 3. Dire qui reçoit les dépôts
1. Roue crantée **Paramètres du projet** (à gauche), tout en bas : **Propriétés du script**, **Modifier les propriétés du script**.
2. La propriété `VALIDATEURS` existe déjà. Remplacez sa valeur par l'adresse qui doit recevoir les dépôts. Plusieurs adresses : séparez-les par des virgules, sans autre signe.
3. Plus tard, pour passer à l'adresse commune des validateurs : modifiez cette même valeur. Il n'y a rien d'autre à changer, ni dans le script ni sur le site.

## 4. Publier la boîte
1. Bouton bleu **Déployer**, **Nouveau déploiement**.
2. Roue crantée à côté de « Sélectionner le type » : **Application Web**.
3. « Exécuter en tant que » : **Moi**. « Qui a accès » : l'option la plus ouverte, celle qui n'exige aucun compte Google (c'est ce qui permet de déposer sans compte).
4. **Déployer**. Copiez l'**URL de l'application Web** (elle finit par `/exec`) et envoyez-la.

## 5. Vérifier
Choisissez la fonction **tester** puis **Exécuter** : un faux dépôt est traité, vous recevez un courriel avec le fichier joint, dans lequel le marquage, le grade, le courriel, le téléphone et la clé du faux dépôt ont été retirés.

## Plus tard
- Si vous modifiez le code : **Déployer**, **Gérer les déploiements**, crayon, version **Nouvelle version**, **Déployer**. L'URL ne change pas.
- Activez la validation en deux étapes sur ce compte et ne réutilisez aucun mot de passe.
- Limites techniques du script : 30 dépôts par heure, 200 Ko par dépôt. Au-delà, le formulaire demande de télécharger le fichier.
