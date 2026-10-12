# Fonctionnement

## Réglage de la veille
- qui: vous
- entrée: Le bloc « Réglages » des instructions du projet.
- sortie: Une zone, des acteurs, des modes d'action et des sources choisis.

Vous modifiez une seule zone de texte. Les réglages par défaut couvrent l'Europe élargie, l'Afrique et le Moyen-Orient, tous acteurs et tous modes d'action.

```exemple
Théâtres actifs : NORD, EST, SAHEL (au lieu des onze théâtres par défaut).
```

## Collecte des événements
- qui: ia
- entrée: Les réglages, la période de la semaine écoulée et le point de situation précédent.
- sortie: Une liste d'événements datés, chacun avec au moins une source ouverte et son lien.

L'IA cherche d'abord dans les sources primaires. Elle ouvre chaque source avant de la citer. Ce qu'elle ne peut pas lire va dans les angles morts.

```exemple
E1 : incendie d'une station sol Starlink en Pologne, le 23/09/2026, deux sources citées.
```

## Analyse de chaque événement
- qui: ia
- entrée: Les sources retenues pour chaque événement.
- sortie: Pour chaque événement, un fait, une évaluation, un niveau d'attribution, une gravité et des coordonnées.

Le fait et l'évaluation restent séparés. L'IA n'écrit jamais une attribution plus forte que ses sources et n'écrit aucun chiffre qui ne figure pas dans une source.

```exemple
Attribution : possible. Les ministres décrivent un schéma général, sans imputer l'incident à un service nommé.
```

## Point de situation
- qui: ia
- entrée: Les événements analysés.
- sortie: Un point de situation avec conclusion en tête, jugements clés, synthèse par théâtre, tendances, indicateurs à suivre et angles morts.

Le point est contrôlé avant d'être rendu : sources, attributions, chiffres, codes. Il est archivé dans le projet et envoyé à la carte si elle est branchée.

```exemple
BLUF : semaine dense sur le flanc Est et en Europe du Nord, avec cinq événements de gravité 2.
```

## Lecture sur la carte
- qui: vous
- entrée: Le point de situation et la carte de la période.
- sortie: Une lecture, des filtres et des fiches événement consultés, et vos corrections éventuelles.

Vous choisissez la période, filtrez par mode, acteur ou théâtre et ouvrez chaque fiche. L'IA ne décide pas à votre place : vous relisez chaque attribution avant de vous en servir.

```exemple
Je filtre sur le mode Drones : cinq événements, dont trois de gravité 1.
```
