# Fonctionnement

## Préparation des articles
- qui: vous
- entrée: Un à dix articles, chacun avec sa source et sa date.
- sortie: Un texte unique où chaque article est précédé de sa source.

Vous collez les articles tels quels. Si une source ou une date manque, l'IA vous la demandera avant de commencer.

```exemple
Article 1 — Source : « Le Courrier du Val » (fictif), 3 mars
```

## Résumé
- qui: ia
- entrée: Chaque article, un par un.
- sortie: Un résumé de trois lignes au maximum par article.

L'IA ne s'appuie que sur le texte fourni. Elle ne complète jamais avec ses propres connaissances.

```exemple
Le pont de la RD 12 est fermé depuis lundi à cause de fissures.
```

## Notation de la fiabilité
- qui: ia
- entrée: Chaque article et la grille A à D.
- sortie: Un indice par article, avec une justification qui cite le texte.

Un article de moins de cinq lignes est marqué « non évaluable ». L'indice juge ce que le texte démontre, pas la réputation du média.

```exemple
Indice : D. Raisons : « une source proche du dossier » n'est pas vérifiable.
```

## Synthèse croisée
- qui: ia
- entrée: Les résumés et les indices.
- sortie: Les points de convergence et de contradiction entre les articles.

C'est ici qu'une contradiction entre deux articles apparaît clairement, avec la source qui s'appuie sur un document.

```exemple
Contradiction : quatre semaines contre plusieurs mois.
```

## Validation par vous
- qui: vous
- entrée: Les indices et la synthèse.
- sortie: Une veille que vous avez confirmée ou corrigée.

Les indices sont des avis argumentés. Vous gardez la décision finale sur la fiabilité de chaque source.

```exemple
Je ramène l'article 3 de B à C : aucune source, même si les faits sont précis.
```
