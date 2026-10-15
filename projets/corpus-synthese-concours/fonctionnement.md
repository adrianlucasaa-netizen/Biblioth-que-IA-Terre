# Fonctionnement

## Cadrage
- qui: vous
- entrée: Votre thème, et le nombre de documents, le volume, la langue et la date d'arrêt que vous souhaitez.
- sortie: Un thème retenu en une phrase, que vous validez.

Le skill pose en une seule fois les questions dont la réponse manque. Si le thème est militaire et que seul le web est disponible, il le signale et propose un thème civil à enjeu stratégique.

```exemple
Thème retenu : le défi de la gestion des déchets sur un archipel fictif. 6 documents, 15 pages, en français.
```

## Recherche des sources
- qui: ia
- entrée: Le thème validé.
- sortie: Un journal des sources avec, pour chaque document, son lien, sa date de consultation, sa licence et les chiffres recoupés.

Chaque source est lue à son origine : un relais, un agrégateur ou un article de presse n'est jamais une source. Chaque chiffre que le sujet mobilise est recoupé avec une seconde source dont une primaire.

```exemple
Document 4 : rapport officiel fictif, consulté le jour même, licence ouverte fictive, chiffres recoupés avec le document 1.
```

## Composition
- qui: vous
- entrée: Un tableau de documents (titre, émetteur, nature, date, angle, longueur, licence) et le sujet proposé.
- sortie: Votre accord ou vos corrections, avant toute extraction.

Chaque document apporte un angle distinct, avec au moins un document critique et un document de l'acteur adverse. Le skill indique ce que le corpus ne permettra pas de traiter. Aucun texte n'est extrait avant votre accord.

```exemple
Je valide la composition, mais je remplace le document 5 par un texte d'une organisation de consommateurs fictive.
```

## Extraction et traduction
- qui: ia
- entrée: La composition validée.
- sortie: Un fichier par document, avec les textes mot pour mot, sans reformulation, et une traduction fidèle si elle est demandée.

Le texte est extrait en paragraphes entiers, avec des coupures signalées par […]. Une traduction suit un glossaire unique, et un contrôle par script compare les nombres de l'original et de la traduction.

```exemple
Document 3 : 1 500 mots extraits sans reformulation, deux coupures signalées par […].
```

## Construction du corpus
- qui: ia
- entrée: Les fichiers des documents et le tableau du sommaire.
- sortie: Un fichier Word et son PDF, avec un sommaire sur la première page et des pages numérotées.

Si un outil manque, le skill descend d'un niveau parmi quatre chaînes de repli et vous dit lequel il a utilisé. Il ne modifie pas ses scripts de construction : il les copie tels quels.

```exemple
Niveau 1 : Word par docx-js, PDF par LibreOffice. 14 pages mesurées sur le PDF.
```

## Vérification et livraison
- qui: ia
- entrée: Le corpus construit.
- sortie: Les deux fichiers, le sujet à part dans la réponse, le nombre de pages mesuré et les limites.

Le skill compare le sommaire aux pages réelles, regarde le rendu de chaque page et confronte les chiffres du sujet à leur source. Ce qu'il n'a pas pu vérifier est dit avant la livraison. Le fichier ne contient ni méthode, ni corrigé, ni commentaire.

```exemple
Sujet : dans quelle mesure la politique de gestion des déchets de l'archipel répond-elle à ses objectifs ?
```
