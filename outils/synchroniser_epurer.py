#!/usr/bin/env python3
"""Recopie le bloc « Epurer » de boite-de-depot/Code.gs dans interface/epurer.js.

Le même code tourne ainsi dans le formulaire (navigateur) et dans la boîte de dépôt
(Google Apps Script). Lancer après toute modification du bloc, ou avec --verifier
pour contrôler que les deux copies sont identiques (utilisé par build.py).
"""
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SOURCE = RACINE / "boite-de-depot" / "Code.gs"
CIBLE = RACINE / "interface" / "epurer.js"
DEBUT, FIN = "// ===== EPURER:DEBUT", "// ===== EPURER:FIN ====="
ENTETE = ("/* Fichier généré par outils/synchroniser_epurer.py : ne pas modifier à la main.\n"
          "   Source : boite-de-depot/Code.gs (bloc EPURER). */\n")


def bloc():
    texte = SOURCE.read_text(encoding="utf-8").replace("\r\n", "\n")
    i = texte.index(DEBUT)
    i = texte.index("\n", i) + 1
    j = texte.index(FIN)
    return ENTETE + texte[i:j]


if __name__ == "__main__":
    attendu = bloc()
    if "--verifier" in sys.argv:
        actuel = CIBLE.read_text(encoding="utf-8").replace("\r\n", "\n") if CIBLE.exists() else ""
        if actuel != attendu:
            print("interface/epurer.js n'est pas à jour : lancez python outils/synchroniser_epurer.py")
            sys.exit(1)
        print("epurer.js à jour")
    else:
        CIBLE.write_text(attendu, encoding="utf-8", newline="\n")
        print("interface/epurer.js écrit")
