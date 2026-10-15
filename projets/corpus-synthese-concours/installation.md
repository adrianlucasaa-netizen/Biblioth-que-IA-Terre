## Étapes communes

Cliquez sur « Télécharger le projet (.zip) » en haut de l'onglet « Fichiers du projet » ou de l'onglet « Installer ». Le fichier contient le dossier `corpus-synthese-concours`, avec `SKILL.md` et un script d'installation automatique.

Le skill est un texte long (environ 430 lignes, scripts compris). Il fonctionne aussi sans installation : copiez le contenu de `SKILL.md` (sans les deux lignes `---` du haut) au début d'une conversation, puis donnez votre thème.

## Claude

Il y a deux cas, selon l'endroit où vous utilisez Claude.

**Claude sur le web ou application de bureau : ne dézippez pas.**

1. Activez l'exécution de code et la création de fichiers : « Settings », « Capabilities », « Code execution and file creation ». C'est ce qui permet à Claude de construire le fichier Word et le PDF. L'aide de Claude indique que les skills personnalisés exigent aussi l'exécution de code.
2. Dans Claude, ouvrez « Customize », puis « Skills », et ajoutez le fichier `.zip` tel quel. L'aide de Claude ne donne pas le nom exact du bouton d'ajout : cherchez l'option d'envoi d'un fichier dans cette page.
3. Activez le skill « corpus-synthese-concours » dans la même page.
4. Ouvrez une conversation et donnez votre thème. Claude utilise le skill de lui-même, ou vous le demandez : « Utilise le skill corpus-synthese-concours. »

**Claude Code : installation automatique après dézippage.**

1. Dézippez le fichier, puis ouvrez le dossier `corpus-synthese-concours`.
2. Lancez `installer.py` : double-clic, ou `python installer.py` dans un terminal. Le script cherche Claude Code (et Gemini CLI) sur votre ordinateur, vous demande confirmation, puis copie `SKILL.md` au bon endroit. Il ne se connecte à rien et n'écrase rien sans votre accord.
3. Dans Claude Code, le skill est disponible tout de suite.

Le skill vérifie lui-même, au début de la construction, les outils présents (LibreOffice, Node, Python et leurs bibliothèques) et en installe au besoin. Il a besoin d'un accès au web pour chercher les documents.

Les noms des menus changent selon les versions de Claude. En cas de doute, consultez l'aide officielle : [créer des skills personnalisés](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) et [créer et modifier des fichiers avec Claude](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude).
