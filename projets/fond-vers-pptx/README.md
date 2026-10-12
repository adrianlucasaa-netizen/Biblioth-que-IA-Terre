---
titre: Du fond au PowerPoint : skill de mise en forme
resume: Un skill qui transforme un plan validé, ou un texte libre à structurer, en PowerPoint sourcé avec notes, lisible sur n'importe quel gabarit, vérifié sur le rendu de chaque diapositive.
type: skill
usage: preparation-pedagogie
ia_compatibles: [claude]
langue: fr
niveau: intermediaire
statut: propose
version: 0.1
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [presentation, powerpoint, mise-en-forme, gabarit]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Initiateur de la bibliothèque"
relu_par: "[pas encore relu]"
---

## Le problème résolu

Quand le contenu d'une présentation est décidé, il reste à le mettre en forme : choisir les layouts, remplir les notes, placer les sources, rendre chaque diapositive lisible sur le fond du gabarit, et vérifier le résultat. Faite d'un bloc par une IA, cette étape donne souvent des diapositives chargées, des textes qui débordent et des sources oubliées.

Ce skill ne fait que cette étape. Il reçoit un plan déjà validé, ou un texte libre qu'il structure lui-même et qu'il vous fait valider avant de construire. Il liste ce qui manque (une source, une illustration), construit le fichier sur votre gabarit ou sur la charte par défaut, adapte la forme au fond, puis convertit le fichier en images pour regarder chaque diapositive avant de vous le livrer.

Il est indépendant : il s'utilise seul, avec le plan d'un autre projet ou fait à la main. Le projet « Préparation de séance » est la méthode complète en cinq étapes, dont celle-ci est la quatrième.

## Entrées et sorties

- **Ce que vous donnez** : un plan structuré (diapositive par diapositive : titre, message clé, layout, sources avec indice de fiabilité, notes, illustration prévue) ou un texte libre. Facultatif : votre gabarit PowerPoint, la durée et le public.
- **Ce que vous recevez** : d'abord un plan structuré avec la liste de ce qui manque et un calcul de durée ; après votre accord, un fichier `.pptx` avec notes du présentateur et sources en bas de diapositive, plus un résumé des points de vigilance.

Deux exemples fictifs se trouvent dans `exemples/` : `texte-libre-exemple.md` (l'entrée) et `plan-structure-exemple.md` (le plan que le skill présente avant de construire).

## Limites connues

- Ce skill ne cherche pas d'informations et ne dialogue pas sur le fond. Il met en forme un contenu fourni, sans y ajouter aucun fait.
- Il n'a pas encore été testé de bout en bout : ni la construction du fichier, ni le contrôle visuel sur différents gabarits.
- Le contrôle visuel demande que Claude dispose d'outils de conversion de fichiers (LibreOffice et `pdftoppm` sont cités dans le skill). S'ils manquent, il le dit et ne prétend pas avoir vérifié le rendu.
- Les consignes sur le travail du XML d'un gabarit viennent de l'expérience de l'auteur. Elles n'ont pas été revérifiées par la bibliothèque.
- Le fichier du skill s'appelle `SKILL.md`, comme l'exige la bibliothèque. L'aide de Claude écrit `skill.md` en minuscules : si l'envoi du `.zip` est refusé, c'est un point à vérifier en premier.
- Le script `installer.py` ne couvre que Claude Code et Gemini CLI, si l'un des deux est installé. Il n'y a pas de dossier à remplir pour Claude sur le web ou l'application de bureau : il faut ajouter le `.zip` depuis les paramètres de Claude.
- Seul Claude est pris en charge. D'après l'aide officielle de ChatGPT, les skills y sont proposés aux formules Business, Enterprise, Healthcare et Edu, mais l'aide ne précise ni le format des fichiers acceptés ni la création de fichiers PowerPoint. L'aide de Gemini CLI décrit un dossier de skills, mais celle de l'application Gemini grand public n'en parle pas. Rien de cela n'a été testé.
- Les layouts par défaut sont génériques, pas ceux d'une charte officielle. Le débit de 130 mots par minute est une convention de départ.
- Ne fournissez jamais de contenu protégé ou non public : le skill s'arrête dans ce cas, mais la responsabilité du contenu transmis reste la vôtre.
- Ce skill est au statut « proposé » : il n'a pas été relu par un second utilisateur.
