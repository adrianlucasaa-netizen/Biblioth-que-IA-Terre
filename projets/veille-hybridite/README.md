---
titre: Veille hybridité : point de situation et carte
resume: Un projet Claude qui produit chaque lundi un point de situation sur les menaces hybrides, à partir de sources ouvertes, et l'affiche sur une carte. Zone, acteurs et sources réglables.
type: projet
usage: recherche-veille
ia_compatibles: [claude]
langue: fr
niveau: intermediaire
statut: propose
version: 0.1
donnees: sources-ouvertes
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [veille, hybridite, carte, renseignement-ouvert]
controles: [aucune-donnee-protegee, sources-citees, aucun-nom-adresse]
auteur: "Initiateur de la bibliothèque"
relu_par: "[pas encore relu]"
---

## Le problème résolu

Suivre les actions hybrides (sabotage, drones, influence, cyber, espionnage, pression économique, proxies) demande de lire beaucoup de sources chaque semaine, de séparer les faits de l'évaluation, et de ne jamais présenter une attribution plus forte que ce que disent les sources. Ce projet confie la collecte et la rédaction à Claude, selon une méthode fixe, et garde la décision à son utilisateur.

Chaque lundi matin, une tâche planifiée produit un point de situation de la semaine écoulée : conclusion en tête, jugements clés, synthèse par théâtre, événements sourcés, indicateurs à suivre, angles morts. Une carte interactive affiche les événements, avec filtres par mode d'action, acteur et théâtre.

Par défaut, la zone est l'Europe élargie, l'Afrique et le Moyen-Orient. Elle se règle, comme les acteurs, les modes d'action, les théâtres et les sources, dans un seul bloc de texte.

## Entrées et sorties

- **Ce que vous donnez** : les instructions du projet (avec vos réglages), la base de connaissances `connaissance-veille.md`, et une tâche planifiée. Aucune donnée à fournir chaque semaine.
- **Ce que vous recevez** : un point de situation hebdomadaire archivé dans le projet, un message de synthèse, et une carte mise à jour si vous l'avez créée.

Le fichier `exemples/psh-2026-S39.md` montre un point de situation complet, et `exemples/2026-S39.json` les données correspondantes pour la carte. Ce sont des faits réels issus de sources ouvertes citées, présentés comme un exemple de format.

## Limites connues

- Ce projet n'est pas un service de renseignement : il ne s'appuie que sur des sources ouvertes. Les événements, les attributions et les gravités sont des avis argumentés ; vous relisez chaque événement avant de vous en servir.
- Claude peut manquer des événements, lire une source de travers ou se tromper de lieu. Les angles morts sont déclarés dans chaque point, mais ils ne sont pas exhaustifs.
- La tâche planifiée est conçue pour tourner avec les instructions du projet. L'aide officielle de Claude ne précise pas si une tâche planifiée peut être rattachée à un projet : c'est à vérifier à la première exécution (test décrit dans `prompt-tache-planifiee.md`).
- L'archivage dans les fichiers du projet et l'écriture dans la carte dépendent des outils que Claude met à disposition de votre tâche. Si l'un manque, Claude le dit et donne le résultat dans sa réponse.
- La carte est décrite par un cahier des charges (`carte-specification.md`), pas fournie en fichier : la page construite par Claude peut différer de celle de l'auteur. Le fond de carte est intégré par Claude à la construction. Cette construction n'est pas testée par la bibliothèque.
- Le cadre conceptuel et les repères doctrinaux de `connaissance-veille.md` reprennent le cadre de travail de l'auteur ; ils n'ont pas été revérifiés un par un. Les liens du catalogue de sources ont été testés automatiquement : 26 sur 92 n'ont pas répondu au test et sont marqués « non vérifié ».
- Seul le rythme hebdomadaire a été testé. Aucune autre IA que Claude n'est prise en charge pour l'instant.
- Les événements décrits peuvent citer des responsables publics ou des personnes visées par un acte officiel public, comme dans la source citée. Vous restez responsable de ce que vous conservez ou diffusez, et de la conformité de votre usage avec les règles de votre employeur sur l'expression publique.
- Ce projet est au statut « proposé » : il n'a pas été relu par un second utilisateur.
