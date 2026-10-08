---
titre: Nettoyeur de fichier CSV
resume: Script Python qui nettoie un fichier CSV (encodage, séparateur, espaces, lignes vides) et produit un fichier propre en UTF-8. Aucun accès réseau.
type: script
usage: analyse-documents-donnees
ia_compatibles: [toutes]
langue: fr
niveau: intermediaire
statut: relu
version: 1.0
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [csv, nettoyage, python]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Exemple (auteur fictif)"
relu_par: "Exemple (relecteur fictif)"
---

## Le problème résolu

Un fichier CSV venu d'un tableur arrive souvent avec un encodage inattendu, un séparateur en point-virgule, des espaces parasites et des lignes vides. Ces défauts font échouer les outils d'analyse, et les corriger à la main est long et source d'erreurs.

Ce script règle ces défauts en une commande. Il ne modifie jamais le fichier d'origine.

## Entrées et sorties

- **Ce que vous donnez** : un fichier `.csv` (UTF-8, UTF-8 avec BOM, ou Windows-1252) dont le séparateur est une virgule, un point-virgule, une tabulation ou une barre verticale.
- **Ce que vous recevez** : un nouveau fichier `<nom>_propre.csv` en UTF-8, séparé par des virgules, sans espaces en bordure de cellule ni lignes vides, et un petit compte rendu affiché à l'écran.

Un exemple se trouve dans `exemples/` : `entree-fictive.csv` et `sortie-attendue.csv`.

## Limites connues

- La détection du séparateur est une analyse des premières lignes : sur un fichier très atypique, elle peut se tromper. Utilisez alors l'option `--separateur`.
- Seuls UTF-8 et Windows-1252 sont essayés. Un autre encodage provoque une erreur claire, pas un fichier abîmé.
- Le script ne corrige ni les fautes de saisie ni les valeurs aberrantes. Il nettoie la forme, pas le fond.
- Le fichier est lu en mémoire : il convient aux fichiers de quelques dizaines de Mo, pas à des fichiers énormes.

## Pour adapter ce projet

Les réglages (encodages essayés, séparateurs reconnus) sont en tête du script `nettoyer_csv.py`. Modifiez-les sans toucher à la logique. Testez toujours sur des données fictives d'abord.
