# Fonctionnement

## Préparation du modèle
- qui: vous
- entrée: Un modèle de courrier avec des champs entre crochets, et les informations à y mettre.
- sortie: Un message contenant le prompt, le modèle et les informations.

Les informations sont fictives ou anonymisées. Vous ne mettez jamais de nom, d'adresse ou de référence réels.

```exemple
Objet : [OBJET]
```

## Repérage des champs
- qui: ia
- entrée: Le modèle et les informations.
- sortie: La liste des champs du modèle, chacun relié à son information ou marqué manquant.

L'IA ne devine rien : un champ sans information est un champ manquant.

```exemple
[REFERENCE] : manquant
```

## Questions sur les manques
- qui: ia
- entrée: La liste des champs manquants.
- sortie: Une question par champ manquant, sans rédaction du courrier.

L'IA n'écrit pas le courrier tant qu'il reste un manque. En cas de contradiction entre deux informations, elle vous le signale.

```exemple
Quelle référence dois-je indiquer ?
```

## Rédaction du courrier
- qui: ia
- entrée: Le modèle et toutes les informations.
- sortie: Le courrier complet, avec la structure et les formules du modèle intactes.

L'IA se contente de remplir les champs, sans ajouter d'engagement. Elle termine par la phrase rappelant qu'il s'agit d'un projet.

```exemple
Je vous informe que le bureau d'accueil ouvrira de 8 h à 12 h.
```

## Relecture et envoi
- qui: vous
- entrée: Le courrier produit.
- sortie: Un courrier relu et validé, que vous envoyez vous-même.

Rien n'est envoyé par ce projet. Vous vérifiez chaque date et chaque référence avant l'envoi.

```exemple
Date d'effet vérifiée : 1er avril.
```
