# Fonctionnement

## Notes brutes
- qui: vous
- entrée: Vos notes de conférence, avec leurs fautes et leurs abréviations.
- sortie: Un texte unique, prêt à être transmis à l'IA.

Vous collez vos notes telles quelles. Aucun nettoyage n'est nécessaire avant de commencer.

```exemple
interv. 1 : 3 axes (cadre, moyens, délais)
retex ex. fictif, cf. slide 12
Q salle : et la LOG ?
chiffres à revoir
```

## Tri et plan
- qui: ia
- entrée: Vos notes, plus la consigne « plan en trois parties maximum ».
- sortie: Un plan hiérarchisé. Les notes inclassables sont listées à part, sans être interprétées.

L'IA regroupe les idées par thème, sépare le propos de l'intervenant des questions de la salle, et propose un plan. Elle attend votre validation avant de rédiger.

```exemple
1. Cadre
2. Moyens
3. Délais
Non classé : « chiffres à revoir »
```

## Rédaction de la fiche
- qui: ia
- entrée: Le plan validé et vos notes.
- sortie: Une fiche structurée avec idées clés, questions de la salle et un encadré vide pour l'avis critique.

L'IA rédige chaque partie en phrases courtes. Quand une information manque, elle écrit `[À VÉRIFIER]` au lieu de la deviner.

```exemple
## 3. Délais
Un compte rendu court est produit chaque semaine.
Chiffres : [À VÉRIFIER]

## Avis critique
[À rédiger par l'utilisateur]
```

## Relecture et avis
- qui: vous
- entrée: La fiche produite par l'IA.
- sortie: Une fiche relue, que vous pouvez partager.

Vous vérifiez les points marqués, corrigez les attributions et rédigez votre avis critique. La fiche n'est finale qu'après cette étape.

```exemple
[À VÉRIFIER] : vérifié dans le support de la conférence
Avis critique : rédigé
```
