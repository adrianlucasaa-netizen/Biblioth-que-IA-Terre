import os

dossier = "rapports"
total = 0

for nom in os.listdir(dossier):
    if nom.endswith(".txt"):
        chemin = os.path.join(dossier, nom)
        with open(chemin, encoding="utf-8") as f:
            total += len(f.readlines())
        os.remove(chemin)

print("Lignes comptées :", total)
