---
titre: Corpus de synthèse de concours
resume: Un skill qui constitue un corpus de 6 à 9 documents réels sous licence ouverte pour une épreuve de synthèse, avec sommaire paginé en DOCX et PDF, et formule le sujet à part.
type: skill
usage: preparation-pedagogie
ia_compatibles: [claude]
langue: fr
niveau: intermediaire
statut: propose
version: 0.1
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [concours, synthese, corpus, docx]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Initiateur de la bibliothèque"
relu_par: "[pas encore relu]"
---

## Le problème résolu

Pour entraîner des candidats à une épreuve de synthèse, il faut un corpus de documents réels, courts, aux angles distincts, mis en page comme à l'épreuve, avec une question posée en dehors du corpus. Le constituer à la main prend du temps. Le confier à une IA sans méthode donne des textes reformulés, des chiffres faux repris d'un relais, des pages non numérotées ou un sommaire qui ne correspond pas.

Ce skill impose une méthode. Il cadre le besoin avec vous, cherche les sources à leur origine, vous propose une composition avant d'extraire le moindre texte, vérifie les droits de réutilisation, extrait les textes sans les reformuler, les traduit si besoin avec un glossaire unique, puis construit un fichier Word et son PDF : un sommaire sur la première page, chaque document sur une nouvelle page, les pages numérotées « Page X / Y ». Le sujet est donné à part dans la réponse, jamais dans le fichier. Deux validations de votre part sont obligatoires.

## Entrées et sorties

- **Ce que vous donnez** : un thème, et, si vous voulez, le nombre de documents (6 à 9), le volume en pages, la langue du corpus et la date d'arrêt des faits. Le skill vous pose les questions dont la réponse manque.
- **Ce que vous recevez** : un fichier `.docx` et le `.pdf` correspondant, le sujet (une question) dans la réponse, le nombre de pages mesuré sur le PDF et la liste courte des limites (document indisponible, traduction non officielle, licence non vérifiée, échéance qui peut changer la donne).

Deux exemples fictifs se trouvent dans `exemples/` : le cadrage (`cadrage-exemple.md`) et la proposition de composition soumise à validation (`composition-exemple.md`). Ce sont des exemples de format : un vrai corpus est constitué de vrais documents, que la bibliothèque ne contient pas.

## Limites connues

- Le skill demande à Claude de chercher sur le web, de télécharger des documents officiels et d'installer des outils (`npm`, `pip`). Les scripts de construction des annexes, eux, n'appellent aucun service extérieur. Sans accès au web, le skill ne peut pas fonctionner.
- Le skill indique que ses deux scripts ont été testés sur un corpus réel de 8 documents (10 400 mots). La bibliothèque ne l'a pas retesté.
- Les licences des textes réutilisés restent votre responsabilité. Le skill privilégie les licences ouvertes et signale celles qu'il ne peut pas vérifier, mais il ne remplace pas une vérification juridique. Ne déposez jamais un corpus constitué dans la bibliothèque.
- Le contrôle d'un texte extrait par un second passage n'est pas indépendant lorsqu'il vient du même modèle. Le skill le dit dans les limites de la livraison ; apostrophes, chiffres et noms propres sont à vérifier à la main.
- Les pages d'un `.docx` dépendent du logiciel qui l'ouvre. Le skill ne garantit le nombre de pages que pour le PDF construit.
- Le chemin du script `soffice.py` cité par le skill est propre à l'environnement de Claude. S'il n'existe pas, le skill indique la commande de repli.
- Seul Claude est pris en charge. Rien n'a été testé avec une autre IA.
- Ce skill est au statut « proposé » : il n'a pas été relu par un second utilisateur.
