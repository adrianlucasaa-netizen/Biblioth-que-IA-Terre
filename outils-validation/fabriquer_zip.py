# -*- coding: utf-8 -*-
"""Fabrique valider-depot.zip (le fichier à ajouter dans Claude) à partir du dossier valider-depot/.

Lancer : python outils-validation/fabriquer_zip.py
Le dossier du skill doit porter le même nom que le skill (valider-depot) : c'est une exigence de Claude.
"""
import zipfile
from pathlib import Path

ICI = Path(__file__).resolve().parent
SOURCE = ICI / "valider-depot"
CIBLE = ICI / "valider-depot.zip"

with zipfile.ZipFile(str(CIBLE), "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(SOURCE.rglob("*")):
        if f.is_file() and "__pycache__" not in f.parts and f.suffix != ".pyc":
            z.write(str(f), "valider-depot/" + f.relative_to(SOURCE).as_posix())
print("écrit :", CIBLE)
