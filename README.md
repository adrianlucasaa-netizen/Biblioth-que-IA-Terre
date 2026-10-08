# Bibliothèque IA — TERRE

Une bibliothèque partagée de solutions d'IA (prompts, skills, projets, scripts) pour la communauté de l'armée de Terre, utilisables avec Claude, ChatGPT, Mistral, Gemini.

**Hors réseau sécurisé de la Défense : aucun contenu réel, uniquement des exemples fictifs.**

## Essayer en local

Le site est déjà généré. Ouvrez `site/index.html` dans un navigateur (double-clic). Rien à installer.

## Régénérer le site (Python 3.8 ou plus)

```
python outils/valider.py        # vérifie tous les projets
python outils/build.py          # génère le site dans site/
python outils/nouveau.py mon-projet --type prompt
python outils/nouveau.py ma-version --depuis synthese-conference
```

Sous Linux ou macOS, remplacez `python` par `python3` si besoin.

## Organisation

| Dossier ou fichier | Rôle |
|---|---|
| `projets/` | un dossier par projet, avec sa fiche `README.md` |
| `modele/` | un modèle de départ par type |
| `interface/` | gabarit, styles et scripts du site |
| `outils/` | vérification, création, génération |
| `vocabulaires.json` | catégories de classement |
| `site.json` | textes du site |
| `REGLES.md`, `DEBUTER.md`, `CONTRIBUER.md` | pages du site |
| `PASSATION.md` | transmission aux promotions suivantes |

## Statut

Version de test locale. Les sept projets sont des exemples fictifs. La licence et l'hébergement ne sont pas décidés.
