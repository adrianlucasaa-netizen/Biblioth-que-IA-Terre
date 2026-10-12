# Carte de situation : cahier des charges

La carte est une page web que Claude publie pour vous (un « artefact »), et qui lit la collection `weeks` écrite par la tâche planifiée. Ce fichier est le cahier des charges : l'IA construit la page à partir de lui. Il décrit la carte de l'auteur, dont la logique tient en environ 23 Ko ; la géométrie du fond de carte, elle, est générée à la construction.

---

## Texte à coller pour demander la carte

Dans une conversation de votre projet Claude, collez :

> Construis la carte de situation décrite dans `carte-specification.md` et publie-la comme artefact. Elle doit lire la collection `weeks` de sa propre base de données, en lecture pour les lecteurs et en écriture réservée à moi. Charge d'abord tes consignes sur les artefacts et leurs capacités. Charge le fond de carte et vérifie que la page s'affiche avec l'exemple `exemples/2026-S39.json` que je t'ai fourni, que tu enregistreras comme premier document de la collection. Dis-moi ensuite l'adresse de la page et comment j'ai pu la tester. Signale tout point de la spécification que tu n'as pas pu respecter.

Puis copiez l'adresse de la page dans le bloc « Réglages » (ligne « Carte ») des instructions du projet.

---

## Données

- Collection `weeks`, un document par période, identifiant `AAAA-Sww`. Format : `connaissance-veille.md`, partie 4.
- Droits : lecture pour toute personne qui ouvre la page ; écriture réservée au propriétaire. Configuration utilisée par l'auteur : une règle de base de données sur la racine, `read: view`, `write: admin`. L'IA doit confirmer la syntaxe exacte avec ses consignes sur les capacités des artefacts.
- La page se met à jour seule quand un nouveau document est écrit (abonnement à la collection).
- Sans accès à la base (page ouverte hors de claude.ai, ou lecture impossible) : message clair à la place des données, sans erreur muette.
- Texte affiché pour la durée d'une analyse : « Période ». Le mot « semaine » n'apparaît pas dans l'interface.

## Mise en page, de haut en bas

1. **Bandeau** : petit titre de contexte (« Veille hybridité · » suivi de la zone), titre « Carte hybride », sélecteur de période (liste des identifiants, le plus récent d'abord), bouton « 4 périodes » (affiche aussi les trois périodes précédentes, estompées), et le texte « du JJ/MM/AAAA au JJ/MM/AAAA · N év. ».
2. **Carte** : fond de pays, graticule léger, repères d'événements, boutons de zoom (+, −, recentrer), cachet en bas à gauche (« SITUATION AAAA-Sww · RÉDIGÉ LE JJ/MM/AAAA »). Sans donnée : encadré « Aucun point de situation » qui explique que les événements apparaissent après chaque point de situation.
3. **Légende** : cercle plein = événement ; anneau épais = attribution officielle ; anneau fin = forte ; anneau pointillé = possible ; pas d'anneau = non attribué ; taille du cercle = gravité 1, 2, 3.
4. **Filtres** : trois rangées de pastilles (Mode, Acteur, Théâtre), qui ne listent que les valeurs présentes dans les événements affichés, chacune avec son nombre. Un clic masque ou réaffiche la valeur. Les pastilles de mode portent la couleur du mode.
5. **Deux panneaux côte à côte** (empilés sur téléphone) : *Fiche événement* à gauche, *Point de situation* à droite.
6. **Registre des événements** : tableau (Id, date, lieu, mode, acteur, attribution, gravité, titre), défilant horizontalement sur petit écran.

## Fond de carte

- Pays du monde en géométrie simplifiée, **intégrée dans la page** (pas de téléchargement à l'ouverture). L'IA l'obtient dans son espace de travail (par exemple le paquet `world-atlas` du registre npm, converti en GeoJSON), la réduit à la zone, la simplifie, et l'intègre. Le nom du pays s'affiche en info-bulle.
- Projection azimutale équivalente de Lambert, centrée sur le milieu de la zone. Réglage de l'auteur : rotation `[-20, -36]`, cadrage ajusté sur les points (longitude, latitude) `[-14,4] [56,4] [-12,70] [50,70] [20,71] [20,2]`, marge de 8 pixels. Pour une autre zone, l'IA adapte la rotation et les points de cadrage aux théâtres actifs.
- La carte se redessine à chaque redimensionnement de fenêtre. Hauteur : 64 % de la hauteur de fenêtre, entre 340 et 620 pixels.

## Repères d'événements

- Un cercle par événement ayant des coordonnées valides. Rayon selon la gravité : 5, 7,5 et 10,5 pixels (divisé par la racine du zoom pour rester lisible). Couleur selon le mode d'action principal.
- Épaisseur et trait de l'anneau selon l'attribution (légende ci-dessus).
- Événements superposés : décalage en spirale d'environ 7 pixels pour qu'ils restent cliquables.
- Gravité haute dessinée au-dessus ; événements d'une période précédente (mode « 4 périodes ») estompés à 45 %.
- Zoom et déplacement à la souris ou au doigt, de 1 à 14 fois.
- Un événement sans coordonnées valides n'est pas dessiné, mais **il reste dans le registre** (cas à tester).
- Clavier : chaque repère se focalise avec Tab et s'ouvre avec Entrée ou Espace.

## Couleurs des modes d'action

Clair : INF #6d3fc9, ING #b0279f, CYB #007f9e, SAB #c62828, SEA #1f50b8, ESP #8a5a00, DRO #d9590b, GNS #00806f, MIG #4f8a10, ECO #a88400, PRX #7a1030, VIO #d1306e.
Sombre : INF #a98bf0, ING #e27bd3, CYB #45c3dd, SAB #f2645c, SEA #6f9cf2, ESP #d9a54a, DRO #ff9550, GNS #3fcfb6, MIG #9bd25a, ECO #e8c84a, PRX #e0587f, VIO #ff7fb0.
Gravité : 3 rouge, 2 orange, 1 gris. Thème clair et thème sombre, selon le réglage du système, avec un fond explicite dans les deux cas.

## Fiche événement

Titre « Eid · titre ». Étiquettes : mode principal, modes secondaires, gravité, attribution. Liste : lieu et pays (avec la mention « localisation au niveau pays » ou « position indicative de zone » selon la précision), date (avec « révélé le … » si elle diffère), acteur et entité, théâtre, période. Puis trois blocs : *Fait*, *Évaluation* (en italique), *Sources* (liens qui s'ouvrent dans un nouvel onglet, uniquement s'ils commencent par `http`). Sur téléphone, le choix d'un événement fait défiler jusqu'à la fiche.

## Point de situation

Titre « Point de situation · Id ». Conclusion (BLUF) en évidence, puis : jugements clés, synthèse par théâtre (code en police à chasse fixe), tendances et convergences, tendances du mois si présentes, à surveiller, angles morts.

## Sécurité du texte

Tout texte venant des données est échappé avant d'être inséré dans la page. Un lien n'est cliquable que s'il commence par `http://` ou `https://`.

## Polices et bibliothèques

D3 (version 7.8.5 ou plus récente, depuis cdnjs) pour la carte. Polices Barlow Condensed (titres), IBM Plex Sans (texte), IBM Plex Mono (chiffres et codes). La page reste lisible avec les polices du système si elles ne se chargent pas.

## À contrôler avant de dire « terminé »

- Le premier document enregistré est l'exemple `exemples/2026-S39.json` : huit repères sur la carte, huit lignes au registre.
- Le sélecteur de période, le bouton « 4 périodes », les trois rangées de filtres, le zoom, le clavier et le recentrage fonctionnent.
- Aucun texte de la page ne dit « semaine » (sauf dans les identifiants).
- Captures vérifiées en largeur d'ordinateur et de téléphone, en thème clair et sombre.
- Un document sans événement s'affiche sans erreur ; un événement sans coordonnées reste dans le registre.
