# -*- coding: utf-8 -*-
"""Installe le skill « corpus-synthese-concours » sur cet ordinateur.

À lancer après avoir dézippé le dossier : double-clic sur ce fichier, ou « python installer.py ».

Ce que fait le script : il copie le fichier SKILL.md dans le dossier des skills de Claude Code
(~/.claude/skills) et/ou de Gemini CLI (~/.gemini/skills), si ces outils sont déjà installés
chez vous. Il vous demande confirmation avant chaque copie et n'écrase rien sans votre accord.
Il ne se connecte à aucun service et ne lance aucun autre programme.

Pour Claude sur le web ou l'application de bureau, il n'y a pas de dossier à remplir :
le skill s'ajoute depuis les paramètres de Claude avec le fichier .zip (voir installation.md).
"""
import shutil
import sys
from pathlib import Path

NOM = "corpus-synthese-concours"
CIBLES = [
    ("Claude Code", Path.home() / ".claude", "skills"),
    ("Gemini CLI", Path.home() / ".gemini", "skills"),
]


def question(texte):
    try:
        return input(texte + " (o/n) ").strip().lower() in ("o", "oui", "y", "yes")
    except EOFError:
        return False


def main():
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    source = Path(__file__).resolve().parent / "SKILL.md"
    if not source.is_file():
        print("SKILL.md est introuvable à côté de ce script. Dézippez le dossier complet, puis relancez.")
        return 1

    trouves = [(nom, racine, sous) for nom, racine, sous in CIBLES if racine.is_dir()]
    if not trouves:
        print("Ni Claude Code ni Gemini CLI n'ont été trouvés sur cet ordinateur.")
        print("Pour Claude sur le web ou l'application de bureau, ajoutez le skill depuis les paramètres")
        print("de Claude avec le fichier .zip (voir installation.md). Rien n'a été modifié.")
        return 0

    installes = 0
    for nom, racine, sous in trouves:
        destination = racine / sous / NOM
        if destination.exists():
            if not question("%s : le skill existe déjà dans %s. Le remplacer ?" % (nom, destination)):
                print("%s : conservé tel quel." % nom)
                continue
        elif not question("%s trouvé. Installer le skill dans %s ?" % (nom, destination)):
            print("%s : ignoré." % nom)
            continue
        destination.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(str(source), str(destination / "SKILL.md"))
        print("%s : installé dans %s" % (nom, destination))
        installes += 1

    if installes:
        print("Terminé. Le skill est disponible au prochain démarrage de l'outil (ou immédiatement pour Claude Code).")
    else:
        print("Rien n'a été installé.")
    return 0


if __name__ == "__main__":
    code = main()
    try:
        input("Appuyez sur Entrée pour fermer.")
    except EOFError:
        pass
    sys.exit(code)
