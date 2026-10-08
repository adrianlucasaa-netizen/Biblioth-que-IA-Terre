---
titre: Préparation d'exposé
resume: Vous guide de l'idée au plan validé, aux diapositives synthétiques et aux notes de l'orateur pour un exposé d'environ 20 minutes.
type: projet
usage: preparation-pedagogie
ia_compatibles: [claude, mistral]
langue: fr
niveau: intermediaire
statut: recommande
version: 1.0
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [expose, diapositives, pedagogie]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Exemple (auteur fictif)"
relu_par: "Exemple (relecteur fictif)"
---

## Le problème résolu

Préparer un exposé commence souvent par des diapositives surchargées avant même d'avoir un plan. Le message se perd, et l'orateur lit ses diapositives au lieu de parler.

Ce projet impose l'ordre inverse : le message d'abord, le plan validé par vous ensuite, les diapositives et les notes à la fin. L'IA ne passe à l'étape suivante qu'avec votre accord.

## Entrées et sorties

- **Ce que vous donnez** : le sujet, le public, la durée, et vos idées en vrac. Vous pouvez ajouter des sources que vous avez vous-même lues.
- **Ce que vous recevez** : un plan en trois ou quatre parties, une liste de diapositives (titre et trois puces au plus), et des notes de l'orateur pour environ 20 minutes de parole.

Un exemple complet se trouve dans `exemples/` : `demande-fictive.md` en entrée, `plan-et-diapositives.md` en sortie.

## Limites connues

- L'IA n'invente pas de source, mais elle peut mal résumer celles que vous lui donnez : relisez-les face à l'original.
- Les durées sont indicatives : chronométrez-vous à voix haute.
- Les diapositives sont décrites en texte. La mise en page reste à faire dans votre outil de présentation.
- Sans sources fournies, les affirmations factuelles sont marquées `[SOURCE À AJOUTER]`, pas complétées.

## Pour adapter ce projet

Le fichier `connaissance/consignes-expose.md` contient des règles d'exemple (nombre de puces, durée par partie). Remplacez-les par celles de votre cadre, sans donnée sensible.
