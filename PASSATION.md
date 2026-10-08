# Passation : transmettre la bibliothèque

Ce document s'adresse à la personne qui reprend la bibliothèque (promotion suivante). Il n'est pas publié sur le site.

## Ce qu'est le dépôt

Un dépôt Git contenant tout : les projets (`projets/`), les modèles (`modele/`), l'interface (`interface/`), les outils (`outils/`), les vocabulaires de classement (`vocabulaires.json`) et les réglages du site (`site.json`). Aucune base de données, aucun service : le site est généré en fichiers HTML.

## Reprendre en main

1. Installez Python 3.8 ou plus récent. Aucune bibliothèque à installer.
2. `python outils/valider.py` : tous les projets doivent être conformes.
3. `python outils/build.py` : le site est généré dans `site/`.
4. Ouvrez `site/index.html` dans un navigateur.

## À décider par le nouveau responsable

- **Hébergement.** Le site est statique : il se publie sur tout hébergeur de pages statiques. Le choix, l'accès en lecture et la liste des contributeurs restent à arrêter avec les personnes compétentes (sécurité des systèmes d'information notamment).
- **Licence** des projets (champ `licence`, actuellement « [à définir] »).
- **Liste des relecteurs** autorisés à relever le statut des projets.
- **Éventuelle restriction de lecture** par adresse ministérielle.

## Où modifier quoi

| Je veux changer… | Je modifie… |
|---|---|
| les catégories de classement | `vocabulaires.json` |
| le nom, l'accroche, les pieds de page | `site.json` |
| les règles | `REGLES.md` |
| l'apparence | `interface/style.css` |
| les contrôles automatiques | `outils/valider.py` |

Si vous changez un vocabulaire, relancez la vérification : les projets qui utilisent une ancienne valeur seront signalés.

## Points de vigilance

- La vérification automatique est un filtre, pas une garantie.
- Le statut est relevé par le relecteur seulement ; aucun contrôle technique ne l'impose.
- L'historique Git conserve tout ce qui a été publié, même supprimé ensuite. Ne publiez jamais une donnée réelle en vous disant que vous la retirerez après.
