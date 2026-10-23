# Valider un dépôt avec l'aide de l'IA

Vous êtes validateur : vous recevez les dépôts par courriel. Vous n'avez besoin ni du dossier du projet, ni de connaître Git pour l'étape de validation : il suffit du fichier joint au courriel et du skill **valider-depot**.

## 1. Installer le skill (une seule fois)
1. Récupérez le fichier `valider-depot.zip` (dossier `outils-validation` du dépôt).
2. Dans Claude : **Paramètres**, **Capacités** (ou « Capabilities »), section **Skills**, ajouter un skill en envoyant le fichier `.zip`. Les libellés peuvent varier : c'est la rubrique des skills dans les paramètres.
3. L'exécution de code et la création de fichiers doivent être activées dans ces mêmes paramètres (sur une offre d'équipe ou d'entreprise, c'est un propriétaire du compte qui l'active).
4. Vérifiez que le skill apparaît dans la liste, et qu'il est activé.

Sur Claude Code : copiez le dossier `valider-depot` dans `~/.claude/skills/`.

## 2. Valider un dépôt (à chaque courriel)
1. Ouvrez le courriel « [Bibliothèque IA] Dépôt : … » et enregistrez le fichier joint `proposition-….json`.
2. Ouvrez une conversation Claude et glissez le fichier dedans.
3. Écrivez : **Valide ce dépôt avec le skill valider-depot.**
4. Claude présente ce qui a été retiré et ce qu'il complète, vous demande votre pseudo de validateur, puis vous remet **un seul fichier** : `valide-….json`. La fiche de validation s'affiche dans la conversation (elle est aussi rangée dans le fichier).
5. Relisez la fiche. Si quelque chose ne va pas, dites-le dans la conversation : il corrige et refait le fichier.

## 3. Déposer le résultat
Déposez ce fichier unique `valide-….json` dans le dossier `validations/` du dépôt GitHub de la bibliothèque (**Add file**, **Upload files**). Rien n'est publié avant la fusion par un administrateur.

## Ce que le skill ne fait jamais
- Il ne modifie pas le contenu du contributeur (prompt, skill, code) : il le copie tel quel, aux éléments épurés près.
- Il n'écrase pas ce que le contributeur a renseigné.
- Il ne publie rien, n'envoie rien, n'accède à aucun réseau.
- Il refuse de produire le fichier si un nom, un grade, un marquage, une adresse, un téléphone ou une clé subsiste.

Si une clé ou un mot de passe figurait dans le dépôt, il a déjà circulé par courriel : prévenez l'auteur pour qu'il la révoque.
