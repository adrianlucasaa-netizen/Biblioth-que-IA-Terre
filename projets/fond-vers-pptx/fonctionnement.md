# Fonctionnement

## Contenu à transformer
- qui: vous
- entrée: Un plan structuré, ou un texte libre (notes, plan brut, document), et éventuellement un gabarit PowerPoint.
- sortie: Le contenu que l'IA doit transformer en présentation.

Vous n'avez pas besoin d'avoir un plan parfait : l'IA sait structurer un texte libre. Elle n'invente aucun fait et ne fait aucune recherche.

```exemple
Intervention de 2 minutes sur l'utilité des listes de contrôle dans un poste de commandement fictif.
```

## Structuration et questions
- qui: ia
- entrée: Votre contenu.
- sortie: Un plan diapositive par diapositive, la liste de ce qui manque et un calcul de durée.

Pour chaque diapositive, l'IA propose un layout, des notes du présentateur et la source de chaque fait. Elle liste ce qui manque et ne construit rien avant votre validation.

```exemple
Diapositive 3 : source manquante pour « 2 oublis au lieu de 7 ».
```

## Validation du plan
- qui: vous
- entrée: Le plan structuré et la liste de ce qui manque.
- sortie: Votre accord, ou vos corrections et les informations demandées.

Vous répondez aux points manquants (une source, une illustration) ou vous demandez expressément de les laisser vides et signalés.

```exemple
Source de la diapositive 3 : compte rendu fictif de l'exercice, indice A (fictif).
```

## Construction et contrôle
- qui: ia
- entrée: Le plan validé, la charte par défaut ou votre gabarit.
- sortie: Un fichier .pptx avec notes et sources en bas de diapositive.

L'IA construit le fichier, adapte la forme au fond (lisibilité, clarté, espace), le convertit en images et regarde chaque diapositive. Elle corrige avant de vous livrer.

```exemple
Diapositive 2 : texte réduit de moitié pour rester lisible sur le fond du gabarit.
```

## Livraison et modifications
- qui: vous
- entrée: Le fichier livré avec son résumé.
- sortie: Un fichier final, ou des modifications ciblées.

Le résumé donne le plan, les sources, les points de vigilance et les écarts. Chaque modification ne touche que ce que vous avez demandé, et la version précédente est conservée.

```exemple
Je demande d'allonger les notes de la diapositive 4.
```
