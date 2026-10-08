# Fonctionnement

## Lecture du fichier
- qui: ia
- entrée: Le fichier CSV d'origine, en lecture seule.
- sortie: Le texte du fichier et l'encodage reconnu.

Le script essaie d'abord UTF-8 (avec ou sans BOM), puis Windows-1252. Si aucun ne convient, il s'arrête avec un message clair et n'écrit rien.

```exemple
Encodage lu       : utf-8-sig
```

## Détection du séparateur
- qui: ia
- entrée: Les vingt premières lignes non vides.
- sortie: Le séparateur : virgule, point-virgule, tabulation ou barre verticale.

Le script analyse un échantillon pour deviner le séparateur. Si l'analyse échoue, il compte les caractères de la première ligne. Vous pouvez imposer le séparateur avec `--separateur`.

```exemple
Séparateur lu     : ';'
```

## Nettoyage
- qui: ia
- entrée: Les lignes lues avec le bon séparateur.
- sortie: Des lignes sans espaces en bordure de cellule et sans ligne vide.

Chaque cellule est débarrassée de ses espaces de début et de fin. Une ligne dont toutes les cellules sont vides est retirée. Le contenu des cellules n'est jamais modifié autrement.

```exemple
"  Section A ; 32" devient "Section A,32"
```

## Contrôle par vous
- qui: vous
- entrée: Le compte rendu affiché et le fichier produit.
- sortie: Un fichier que vous avez ouvert et vérifié.

Le script signale si les lignes n'ont pas toutes le même nombre de colonnes. Ouvrez le fichier produit et vérifiez-le avant de l'utiliser. Le fichier d'origine reste intact pour comparer.

```exemple
Lignes écrites    : 3
Lignes vides      : 3 retirées
```
