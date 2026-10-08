# -*- coding: utf-8 -*-
"""Nettoie un fichier CSV : encodage, séparateur, espaces, lignes vides.

Usage :
    python nettoyer_csv.py fichier.csv
    python nettoyer_csv.py fichier.csv --separateur ";"
    python nettoyer_csv.py fichier.csv --sortie resultat.csv

Le fichier d'origine n'est jamais modifié. Le script n'utilise aucun accès réseau.
"""
import argparse
import csv
import io
import sys
from pathlib import Path

ENCODAGES = ("utf-8-sig", "cp1252")  # essayés dans cet ordre
SEPARATEURS = ",;\t|"  # séparateurs reconnus


def lire_texte(chemin):
    """Lit le fichier et renvoie (texte, encodage utilisé)."""
    octets = Path(chemin).read_bytes()
    for encodage in ENCODAGES:
        try:
            return octets.decode(encodage), encodage
        except UnicodeDecodeError:
            continue
    raise ValueError("Encodage non reconnu (essayés : %s)." % ", ".join(ENCODAGES))


def detecter_separateur(texte):
    """Devine le séparateur d'après les premières lignes non vides."""
    echantillon = "\n".join([l for l in texte.splitlines() if l.strip()][:20])
    if not echantillon:
        raise ValueError("Le fichier est vide.")
    try:
        return csv.Sniffer().sniff(echantillon, delimiters=SEPARATEURS).delimiter
    except csv.Error:
        # Repli : le séparateur le plus fréquent dans la première ligne.
        premiere = echantillon.splitlines()[0]
        meilleur = max(SEPARATEURS, key=premiere.count)
        if premiere.count(meilleur) == 0:
            raise ValueError("Séparateur introuvable : utilisez --separateur.")
        return meilleur


def nettoyer(texte, separateur):
    """Renvoie (lignes propres, nombre de lignes vides retirées)."""
    lignes_propres = []
    vides = 0
    for ligne in csv.reader(io.StringIO(texte, newline=""), delimiter=separateur):
        cellules = [c.strip() for c in ligne]
        if not any(cellules):
            vides += 1
            continue
        lignes_propres.append(cellules)
    return lignes_propres, vides


def ecrire(chemin, lignes):
    with open(chemin, "w", encoding="utf-8", newline="") as f:
        csv.writer(f, delimiter=",", lineterminator="\n").writerows(lignes)


def main(argv=None):
    p = argparse.ArgumentParser(description="Nettoie un fichier CSV.")
    p.add_argument("fichier", help="fichier CSV à nettoyer")
    p.add_argument("--separateur", help="force le séparateur (par défaut : détecté)")
    p.add_argument("--sortie", help="fichier de sortie (par défaut : <nom>_propre.csv)")
    args = p.parse_args(argv)

    source = Path(args.fichier)
    sortie = Path(args.sortie) if args.sortie else source.with_name(source.stem + "_propre.csv")
    if sortie.resolve() == source.resolve():
        print("Erreur : la sortie ne doit pas écraser le fichier d'origine.", file=sys.stderr)
        return 1
    try:
        texte, encodage = lire_texte(source)
        separateur = args.separateur or detecter_separateur(texte)
        if separateur == "\\t":
            separateur = "\t"
        lignes, vides = nettoyer(texte, separateur)
    except (OSError, ValueError) as erreur:
        print("Erreur : %s" % erreur, file=sys.stderr)
        return 1

    ecrire(sortie, lignes)
    largeurs = {len(l) for l in lignes}
    print("Encodage lu       : %s" % encodage)
    print("Séparateur lu     : %r" % separateur)
    print("Lignes écrites    : %d" % len(lignes))
    print("Lignes vides      : %d retirées" % vides)
    if len(largeurs) > 1:
        print("Attention : les lignes n'ont pas toutes le même nombre de colonnes (%s)."
              % ", ".join(str(n) for n in sorted(largeurs)))
    print("Fichier produit   : %s" % sortie)
    return 0


if __name__ == "__main__":
    sys.exit(main())
