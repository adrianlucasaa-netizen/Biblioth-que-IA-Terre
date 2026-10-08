# Fonctionnement

## Anonymiser
- qui: vous
- entrée: Votre note de service.
- sortie: Un texte sans nom, adresse ni information réelle.

Avant de coller quoi que ce soit, vous retirez ou remplacez tout élément réel. Cette étape est la vôtre : l'IA ne peut pas savoir ce qui est sensible chez vous.

```exemple
« le colonel Untel » devient « le chef de détachement »
```

## Lecture complète
- qui: ia
- entrée: Le prompt, puis votre texte.
- sortie: Aucune réponse encore : l'IA lit la note en entier avant de commenter.

L'IA lit d'abord le tout pour juger l'ensemble, pas phrase par phrase. Elle s'arrête si elle repère une donnée qui ressemble à du réel.

```exemple
Texte reçu : 12 lignes. Aucune donnée sensible repérée.
```

## Tableau de remarques
- qui: ia
- entrée: Le texte lu.
- sortie: Un verdict d'une phrase, un tableau de remarques citées, la liste des points non jugés.

Chaque remarque cite le passage exact. Les remarques qui dépendent d'un contexte inconnu vont dans les points non jugés.

```exemple
| 3 | Clarté | « mis en place par les équipes concernées » | Ni équipe, ni lieu, ni heure. | Nommer l'équipe. |
```

## Correction par vous
- qui: vous
- entrée: Le tableau de remarques.
- sortie: Une note corrigée par vos soins.

Vous décidez de chaque remarque : certaines viennent d'un manque de contexte de l'IA. La rédaction finale reste la vôtre.

```exemple
Remarque 8 écartée : la formule d'appel est imposée chez nous.
```
