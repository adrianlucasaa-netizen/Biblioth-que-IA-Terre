# -*- coding: utf-8 -*-
"""Génère le site statique dans site/ à partir des projets.

Usage : python outils/build.py

Le site généré fonctionne par simple double-clic sur site/index.html :
aucun serveur, aucun réseau, aucune installation.
La génération refuse de continuer si un projet n'est pas valide.
"""
import json
import re
import shutil
import sys

from commun import (
    INTERFACE, PROJETS, RACINE, ErreurFiche, analyser_filiation, analyser_fonctionnement, analyser_installation,
    charger_json, charger_vocabulaires, console_utf8, fichiers_projet, historique_git, liste_dossiers_projets,
    lire_projet,
)
from rendu import echapper, inline, rendre
import valider

SITE = RACINE / "site"
ORDRE_STATUT = {"recommande": 0, "relu": 1, "propose": 2}
PAGES = [
    ("DEBUTER.md", "debuter", "Débuter"),
    ("REGLES.md", "regles", "Règles de publication"),
    ("CONTRIBUER.md", "contribuer", "Contribuer"),
]


def js_json(objet):
    s = json.dumps(objet, ensure_ascii=False)
    return s.replace("</", "<\\/").replace("<!--", "<\\!--").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def remplir(gabarit, valeurs):
    return re.sub(r"\{\{(\w+)\}\}", lambda m: valeurs.get(m.group(1), ""), gabarit)


class Constructeur:
    def __init__(self):
        self.site = charger_json("site.json")
        self.vocab = charger_vocabulaires()
        self.gabarit = (INTERFACE / "gabarit.html").read_text(encoding="utf-8")
        self.pages_docs = [(f, s, t) for f, s, t in PAGES if (RACINE / f).exists()]

    # -- coque commune ------------------------------------------------------
    def nav(self, racine, active):
        liens = [("Projets", racine + "index.html", "projets")]
        for _, slug, titre in self.pages_docs:
            liens.append((titre, racine + "pages/%s.html" % slug, slug))
        return "".join(
            '<a href="%s"%s>%s</a>' % (url, ' aria-current="page"' if cle == active else "", echapper(titre))
            for titre, url, cle in liens
        )

    def page(self, chemin_sortie, titre_page, contenu, racine, active, donnees=None, scripts=(), classe=""):
        s = self.site
        bandeau = ('<div class="bandeau">%s</div>' % echapper(s["mention"])) if s.get("mention") else ""
        valeurs = {
            "titre_page": echapper(titre_page),
            "racine": racine,
            "bandeau": bandeau,
            "nav": self.nav(racine, active),
            "nom": echapper(s["nom"]),
            "sous_nom": echapper(s["sous_nom"]),
            "contenu": contenu,
            "pied": echapper(s["pied"]),
            "pied_droite": echapper(s["pied_droite"]),
            "classe_corps": classe,
            "donnees": ('<script type="application/json" id="donnees">%s</script>' % js_json(donnees)) if donnees is not None else "",
            "scripts": "".join('<script src="%sassets/%s"></script>' % (racine, nom) for nom in scripts),
        }
        chemin_sortie.parent.mkdir(parents=True, exist_ok=True)
        chemin_sortie.write_text(remplir(self.gabarit, valeurs), encoding="utf-8")

    # -- projets ------------------------------------------------------------
    def lire_tous(self):
        dossiers = liste_dossiers_projets()
        tous_ids = {d.name for d in dossiers}
        projets, bilan = [], []
        for d in dossiers:
            try:
                p = lire_projet(d)
            except ErreurFiche as e:
                bilan.append("%s : %s" % (d.name, e))
                continue
            rapport = valider.valider_projet(p, tous_ids, self.vocab)
            for e in rapport.erreurs:
                bilan.append("%s : %s" % (d.name, e))
            projets.append(p)
        if bilan:
            print("La génération s'arrête : %d erreur(s) de validation." % len(bilan))
            for ligne in bilan:
                print("  - " + ligne)
            print("\nCorrigez-les (python outils/valider.py donne le détail), puis relancez.")
            sys.exit(1)
        return projets

    def libelle(self, categorie, valeur):
        return self.vocab[categorie].get(valeur, valeur)

    def resume_catalogue(self, p):
        m = p["meta"]
        return {
            "id": p["id"], "titre": m["titre"], "resume": m["resume"], "type": m["type"], "usage": m["usage"],
            "ia": m["ia_compatibles"], "niveau": m["niveau"], "statut": m["statut"], "version": m["version"],
            "etiquettes": m.get("etiquettes", []), "langue": m["langue"],
        }

    def construire_projet(self, p, tous):
        m, dossier = p["meta"], p["dossier"]
        pid = p["id"]
        fichiers = []
        for rel in fichiers_projet(dossier):
            texte = (dossier / rel).read_text(encoding="utf-8")
            fichiers.append({"chemin": rel.as_posix(), "taille": len(texte.encode("utf-8")), "texte": texte})
        noms = {f["chemin"] for f in fichiers}

        etapes = []
        if "fonctionnement.md" in noms:
            for e in analyser_fonctionnement((dossier / "fonctionnement.md").read_text(encoding="utf-8")):
                e["texte_html"] = inline(e["texte"]) if e["texte"] else ""
                etapes.append(e)

        installation = None
        if "installation.md" in noms:
            commun, par_ia = analyser_installation((dossier / "installation.md").read_text(encoding="utf-8"), self.vocab["ia"])
            ias = [k for k in self.vocab["ia"] if k != "toutes"] if "toutes" in m["ia_compatibles"] else list(m["ia_compatibles"])
            installation = {
                "commun_html": rendre(commun) if commun else "",
                "par_ia_html": {k: rendre(v) for k, v in par_ia.items()},
                "ias": [{"id": k, "libelle": self.libelle("ia", k)} for k in ias],
            }

        genre, ids_parents = analyser_filiation(m["filiation"])
        lignee = {
            "genre": genre, "genre_libelle": self.libelle("filiation", genre),
            "parents": [{"id": i, "titre": next(x["meta"]["titre"] for x in tous if x["id"] == i)} for i in ids_parents],
            "adaptations": [],
            "plus_recente": None,
        }
        for x in tous:
            g, ids = analyser_filiation(x["meta"]["filiation"])
            if pid in ids:
                lignee["adaptations"].append({"id": x["id"], "titre": x["meta"]["titre"], "genre": self.libelle("filiation", g)})
        nv = m.get("version_plus_recente", "aucune")
        if nv not in ("", "aucune"):
            lignee["plus_recente"] = {"id": nv, "titre": next(x["meta"]["titre"] for x in tous if x["id"] == nv)}

        historique = historique_git(dossier)

        donnees = {
            "id": pid, "titre": m["titre"], "etapes": etapes, "installation": installation,
            "fichiers": fichiers,
            "commande_dupliquer": "python outils/nouveau.py mon-projet --depuis %s" % pid,
        }

        # --- HTML du projet
        onglets = [("fiche", "Fiche")]
        if etapes:
            onglets.append(("fonctionnement", "Fonctionnement"))
        if installation:
            onglets.append(("installer", "Installer"))
        onglets.append(("fichiers", "Fichiers et versions"))
        boutons = "".join(
            '<button type="button" role="tab" id="onglet-%s" aria-controls="panneau-%s" aria-selected="%s" tabindex="%s" data-onglet="%s">%s</button>'
            % (cle, cle, "true" if i == 0 else "false", "0" if i == 0 else "-1", cle, echapper(libelle))
            for i, (cle, libelle) in enumerate(onglets)
        )

        controles = "".join(
            '<li><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>'
            '<span>%s</span></li>' % echapper(self.libelle("controles", c))
            for c in m["controles"]
        )

        def facette(titre, contenu_html):
            return '<div class="facette"><span class="etiquette-mono">%s</span>%s</div>' % (echapper(titre), contenu_html)

        ia_libelles = [self.libelle("ia", k) for k in m["ia_compatibles"]]
        etiquettes = "".join(
            '<a class="etiquette" href="../index.html#tag=%s">%s</a>' % (echapper(t), echapper(t)) for t in m.get("etiquettes", [])
        )
        filiation_html = '<span>%s</span>' % echapper(lignee["genre_libelle"])
        if lignee["parents"]:
            filiation_html = "<span>%s</span>%s" % (
                echapper(lignee["genre_libelle"]),
                "".join('<a href="%s.html">%s</a>' % (x["id"], echapper(x["titre"])) for x in lignee["parents"]),
            )
        lignee_extra = ""
        if lignee["adaptations"]:
            lignee_extra += facette("Adaptations", "".join('<a href="%s.html">%s</a>' % (x["id"], echapper(x["titre"])) for x in lignee["adaptations"]))
        if lignee["plus_recente"]:
            lignee_extra += facette("Version plus récente", '<a href="%s.html">%s</a>' % (lignee["plus_recente"]["id"], echapper(lignee["plus_recente"]["titre"])))

        aside = "".join([
            facette("Type", "<span>%s</span>" % echapper(self.libelle("type", m["type"]))),
            facette("Usage", "<span>%s</span>" % echapper(self.libelle("usage", m["usage"]))),
            facette("Compatible avec", '<div class="puces">%s</div>' % "".join('<span class="puce">%s</span>' % echapper(x) for x in ia_libelles)),
            facette("Niveau", "<span>%s</span>" % echapper(self.libelle("niveau", m["niveau"]))),
            facette("Langue", "<span>%s</span>" % echapper(self.libelle("langue", m["langue"]))),
            facette("Données", "<span>%s</span>" % echapper(self.libelle("donnees", m["donnees"]))),
            facette("Filiation", filiation_html),
            lignee_extra,
            facette("Étiquettes", '<div class="puces">%s</div>' % etiquettes) if etiquettes else "",
            facette("Licence", "<span>%s</span>" % echapper(m["licence"])),
            facette("Auteur", "<span>%s</span>" % echapper(m["auteur"])),
            facette("Relu par", "<span>%s</span>" % echapper(m["relu_par"])),
        ])

        histo = "".join(
            '<li><span class="mono accent">%s</span><span>%s</span><span class="mono doux">%s · %s</span></li>'
            % (echapper(h["hash"]), echapper(h["message"]), echapper(h["auteur"]), echapper(h["date"]))
            for h in historique
        ) or '<li><span class="doux">L\'historique apparaît une fois le projet enregistré dans Git (git commit).</span></li>'

        contenu = """
<div class="entete-projet">
  <p class="fil"><a href="../index.html">← Retour au catalogue</a></p>
  <div class="meta-ligne">
    <span class="etiquette-mono accent">%(type)s</span>
    <span class="statut statut-%(statut_cle)s">%(statut)s</span>
    <span class="mono doux">v%(version)s</span>
  </div>
  <h1>%(titre)s</h1>
  <p class="chapeau">%(resume)s</p>
</div>
<div class="barre-onglets" role="tablist" aria-label="Sections du projet">%(boutons)s</div>
<div class="corps-projet">
  <div class="principal-projet">
    <section class="panneau actif" id="panneau-fiche" role="tabpanel" aria-labelledby="onglet-fiche">
      <div class="doc">%(readme)s</div>
      <section class="encadre">
        <h2>Contrôles avant publication</h2>
        <ul class="controles">%(controles)s</ul>
      </section>
    </section>
    <section class="panneau" id="panneau-fonctionnement" role="tabpanel" aria-labelledby="onglet-fonctionnement" hidden>
      <h2>Comment ça fonctionne</h2>
      <p class="doux">Cliquez sur une étape pour voir ce qui entre, ce qui sort, et un exemple fictif.</p>
      <div id="schema"></div>
    </section>
    <section class="panneau" id="panneau-installer" role="tabpanel" aria-labelledby="onglet-installer" hidden>
      <h2>Installer avec votre IA</h2>
      <div id="installation"></div>
    </section>
    <section class="panneau" id="panneau-fichiers" role="tabpanel" aria-labelledby="onglet-fichiers" hidden>
      <h2>Fichiers du projet</h2>
      <div id="fichiers"></div>
      <h2>Historique des versions</h2>
      <ul class="historique">%(histo)s</ul>
      <h2>Adapter ce projet</h2>
      <p>Pour créer votre propre version, qui garde un lien vers l'original, lancez cette commande à la racine du dépôt :</p>
      <div class="commande"><code id="commande-dupliquer"></code><button type="button" class="bouton secondaire" id="copier-commande">Copier</button></div>
    </section>
  </div>
  <aside class="lateral-projet" aria-label="Informations sur le projet">%(aside)s</aside>
</div>
""" % {
            "type": echapper(self.libelle("type", m["type"])), "statut_cle": echapper(m["statut"]),
            "statut": echapper(self.libelle("statut", m["statut"])), "version": echapper(m["version"]),
            "titre": echapper(m["titre"]), "resume": echapper(m["resume"]), "boutons": boutons,
            "readme": rendre(p["corps"]), "controles": controles, "histo": histo, "aside": aside,
        }
        self.page(SITE / "projets" / ("%s.html" % pid), "%s — %s" % (m["titre"], self.site["nom"]), contenu, "../", "projets",
                  donnees=donnees, scripts=("projet.js",), classe="page-projet")

    # -- catalogue et pages ---------------------------------------------------
    def construire_catalogue(self, projets):
        s = self.site
        donnees = {
            "vocab": {k: self.vocab[k] for k in ("type", "usage", "ia", "niveau", "statut")},
            "ordre_statut": ORDRE_STATUT,
            "projets": [self.resume_catalogue(p) for p in projets],
        }
        contenu = """
<section class="heros">
  <h1>%s</h1>
  <p class="chapeau">%s</p>
  <div class="champ-recherche">
    <label for="recherche" class="sr-only">Rechercher un projet</label>
    <input id="recherche" type="search" placeholder="Rechercher un usage, un type, une IA, une étiquette" autocomplete="off">
  </div>
</section>
<div class="catalogue">
  <aside class="filtres" id="filtres" aria-label="Filtres"></aside>
  <section class="resultats" aria-live="polite">
    <div class="ligne-compteur"><span id="compteur" class="mono"></span><span id="puces-actives"></span><button type="button" class="bouton lien" id="reinitialiser" hidden>Effacer les filtres</button></div>
    <div id="cartes" class="grille-cartes"></div>
    <p id="vide" class="vide" hidden>Aucun projet ne correspond à ces filtres. Retirez un filtre ou élargissez la recherche.</p>
  </section>
</div>
""" % (echapper(s["accroche"]), echapper(s["introduction"]))
        self.page(SITE / "index.html", s["nom"], contenu, "", "projets", donnees=donnees, scripts=("catalogue.js",), classe="page-catalogue")

    def construire_docs(self):
        liens = {f: "%s.html" % slug for f, slug, _ in self.pages_docs}
        for fichier, slug, titre in self.pages_docs:
            corps = rendre((RACINE / fichier).read_text(encoding="utf-8"))
            for f, cible in liens.items():
                corps = corps.replace('href="%s"' % f, 'href="%s"' % cible)
            contenu = '<article class="doc doc-page">%s</article>' % corps
            self.page(SITE / "pages" / ("%s.html" % slug), "%s — %s" % (titre, self.site["nom"]), contenu, "../", slug, classe="page-doc")

    def lancer(self):
        projets = self.lire_tous()
        if SITE.exists():
            shutil.rmtree(str(SITE))
        SITE.mkdir(parents=True)
        (SITE / "assets").mkdir()
        for nom in ("style.css", "catalogue.js", "projet.js"):
            shutil.copy(str(INTERFACE / nom), str(SITE / "assets" / nom))
        projets.sort(key=lambda p: (ORDRE_STATUT.get(p["meta"]["statut"], 9), p["meta"]["titre"].lower()))
        for p in projets:
            self.construire_projet(p, projets)
        self.construire_catalogue(projets)
        self.construire_docs()
        print("Site généré : %d projet(s), %d page(s) de documentation." % (len(projets), len(self.pages_docs)))
        print("Ouvrez site/index.html dans votre navigateur (double-clic).")


if __name__ == "__main__":
    console_utf8()
    Constructeur().lancer()
