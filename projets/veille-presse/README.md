---
titre: Veille de presse notée
resume: Skill qui résume des articles que vous fournissez et attribue à chaque source un indice de fiabilité de A à D, avec ses raisons.
type: skill
usage: recherche-veille
ia_compatibles: [claude]
langue: fr
niveau: intermediaire
statut: propose
version: 0.9
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [veille, presse, sources]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Exemple (auteur fictif)"
relu_par: "[pas encore relu]"
---

## Le problème résolu

Une veille de presse mélange des sources de qualité très inégale. Résumer sans distinguer un article sourcé d'une rumeur donne une fausse impression de certitude.

Ce skill résume chaque article fourni et note sa fiabilité sur une échelle simple, en expliquant la note. Il ne cherche rien sur internet : il travaille uniquement sur les textes que vous lui donnez.

## Entrées et sorties

- **Ce que vous donnez** : un à dix articles collés en texte, chacun précédé de sa source (titre du média, date).
- **Ce que vous recevez** : pour chaque article, un résumé de trois lignes, un indice de A à D avec ses raisons, et en fin de réponse une synthèse des convergences et des contradictions entre les articles.

Un exemple se trouve dans `exemples/` : `articles-fictifs.md` en entrée, `veille-attendue.md` en sortie.

## Limites connues

- L'indice est un avis argumenté, pas une mesure. Il repose sur ce que le texte laisse voir (sources citées, précision, ton), pas sur la réputation réelle du média.
- Le skill ne peut pas vérifier un fait : il signale ce qui est étayé ou non dans le texte.
- Ce skill est encore au statut « proposé » : il n'a pas été relu par un second utilisateur.
- Il suppose un outil qui sait charger un skill ; sinon, utilisez le contenu de `SKILL.md` comme prompt.

## Pour adapter ce projet

L'échelle A à D et ses critères sont dans `SKILL.md`. Adaptez-les à votre besoin sans y mettre de donnée sensible, et testez sur des articles fictifs.
