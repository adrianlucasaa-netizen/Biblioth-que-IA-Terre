---
titre: Préparation de séance : du sujet au PowerPoint
resume: Un projet Claude qui prépare une présentation avec vous : sujet, fond sourcé construit par dialogue, validation du plan et des illustrations, puis fichier PowerPoint.
type: projet
usage: preparation-pedagogie
ia_compatibles: [claude]
langue: fr
niveau: debutant
statut: propose
version: 0.1
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [presentation, powerpoint, preparation, pedagogie]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Initiateur de la bibliothèque"
relu_par: "[pas encore relu]"
---

## Le problème résolu

Préparer une présentation sérieuse prend du temps : cadrer le sujet, trouver des sources fiables, bâtir un plan, choisir des illustrations, puis mettre en forme sans perdre en lisibilité. Les assistants IA font souvent tout d'un bloc, avec des chiffres non sourcés et des diapositives chargées.

Ce projet impose une méthode en cinq étapes, avec votre validation entre chacune : énoncé du sujet, dialogue pour établir le fond, validation du fond et des illustrations, création du PowerPoint, validation et modifications. Chaque fait est sourcé et noté de A à D. La forme s'adapte au fond de votre gabarit, ou à la charte EDG-T par défaut, et le projet vérifie le rendu de chaque diapositive.

La durée, le public, le débit de parole, la charte et les layouts se règlent dans un seul bloc de texte.

## Entrées et sorties

- **Ce que vous donnez** : votre sujet et le type d'intervention (conférence, retour d'expérience, vulgarisation). Facultatif : des documents à exploiter, votre gabarit PowerPoint.
- **Ce que vous recevez** : à l'étape 3, un plan diapositive par diapositive avec les illustrations prévues et un calcul de durée ; à la fin, un fichier `.pptx` avec notes du présentateur et sources en bas de diapositive, plus un résumé des points de vigilance.

Deux exemples fictifs se trouvent dans `exemples/` : `demande-exemple.md` (le premier message et la réponse de l'étape 1) et `fond-valide-exemple.md` (le plan présenté à l'étape 3).

## Limites connues

- Ce projet ne fournit pas de gabarit PowerPoint. La bibliothèque n'accepte pas les fichiers `.pptx`, et la charte EDG-T par défaut est décrite en texte (couleur, polices) sans logo. Vous joignez votre gabarit si vous en avez un.
- Les six layouts par défaut sont génériques : ce ne sont pas les layouts nommés de la charte officielle.
- Le débit de 130 mots par minute est une convention de départ, pas une mesure. Le calcul de durée donne un ordre de grandeur de la parole : il ne remplace pas une répétition à voix haute.
- Les sources sont notées par l'IA, selon une grille (A à D, ancienneté, recoupement, proximité de la source primaire). La note reste un avis argumenté : vous gardez la décision sur chaque source.
- La qualité visuelle dépend de votre gabarit et de la version de Claude. Le projet vérifie chaque diapositive sur son rendu en image, mais cette vérification n'a pas été testée sur tous les gabarits.
- Ce projet n'a pas encore été testé de bout en bout. Il est écrit pour Claude, avec la création de fichiers activée et une recherche web qu'il utilise de façon ciblée. Aucune autre IA n'est prise en charge pour l'instant.
- Ne fournissez jamais de document protégé ou non public : l'IA s'arrête dans ce cas, mais la responsabilité du contenu transmis reste la vôtre.
- Ce projet est au statut « proposé » : il n'a pas été relu par un second utilisateur.
