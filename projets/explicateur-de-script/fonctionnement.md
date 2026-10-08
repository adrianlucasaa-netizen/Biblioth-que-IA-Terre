# Fonctionnement

## Dépôt du script
- qui: vous
- entrée: Le code du script que vous avez reçu.
- sortie: Un message contenant le prompt puis le code.

Vous collez le code tel quel, sans y ajouter de donnée sensible. Vous ne lancez rien.

```exemple
os.remove(chemin)
```

## Résumé
- qui: ia
- entrée: Le code.
- sortie: Le langage reconnu et un résumé en deux phrases.

L'IA lit tout le code avant d'expliquer. Si le langage ne lui paraît pas certain, elle le dit.

```exemple
Python : compte les lignes de fichiers texte puis les supprime.
```

## Explication par blocs
- qui: ia
- entrée: Le code.
- sortie: Une explication dans l'ordre, avec les numéros de ligne, en mots simples.

Chaque terme technique est défini. Si une ligne échappe à l'IA, elle écrit « partie non comprise ».

```exemple
Lignes 6 à 11 : boucle sur les fichiers du dossier.
```

## Repérage des risques
- qui: ia
- entrée: Le code.
- sortie: La liste des actions risquées avec les lignes concernées, puis un verdict.

Le verdict est « sans risque apparent », « à vérifier » ou « ne pas lancer ». Un code illisible ou obscurci donne toujours « ne pas lancer ».

```exemple
Ligne 11 : suppression définitive de fichiers. Verdict : à vérifier.
```

## Décision par vous
- qui: vous
- entrée: L'explication et le verdict.
- sortie: Une décision : lancer sur une copie, demander un avis, ou ne pas lancer.

Pour un usage professionnel, demandez l'avis de votre soutien informatique avant de lancer.

```exemple
Je lance sur une copie du dossier, jamais sur l'original.
```
