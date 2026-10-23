# -*- coding: utf-8 -*-
"""Outil du skill « valider-depot » (Bibliothèque IA Terre).

Deux commandes, sans aucun accès réseau et sans dépendance :

  python valider_depot.py analyser  <proposition.json>
      Lit le dépôt reçu, l'épure, et affiche en JSON ce qui a été retiré, ce qui manque et
      les valeurs autorisées. N'écrit aucun fichier.

  python valider_depot.py finaliser <proposition.json> <complements.json> --validateur PSEUDO
                                    [--auteur PSEUDO] [--notes "texte"] [--sortie DOSSIER]
      Fusionne les compléments proposés par l'IA UNIQUEMENT dans les champs vides, reprend le
      contenu du dépôt à l'identique (aux éléments épurés près), vérifie le résultat et écrit
      UN SEUL fichier, « valide-<nom>.json », à déposer sur GitHub. La fiche de validation est
      rangée dans ce fichier (bloc « validation ») et affichée à l'écran.

Le champ « contenu » (le prompt, le skill ou le code) n'est JAMAIS réécrit par l'IA : il est
copié par ce programme depuis le fichier d'origine.
"""
import argparse
import datetime
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

FORMAT = "bibliotheque-ia-terre/proposition"
ICI = Path(__file__).resolve().parent
VOCAB = json.loads((ICI.parent / "references" / "vocabulaires.json").read_text(encoding="utf-8"))

# ---------------------------------------------------------------------------
# Épuration : même logique que interface/epurer.js (voir boite-de-depot/Code.gs).
# ---------------------------------------------------------------------------
MARQUAGES = re.compile(r"(^|[^A-Za-zÀ-ÿ])(DIFFUSION\s+RESTREINTE|CONFIDENTIEL(?:\s+D[ÉE]FENSE)?|SECRET(?:\s+D[ÉE]FENSE)?|TR[ÈE]S\s+SECRET|NON\s+PROT[ÉE]G[ÉE]|RESTRICTED|NATO\s+(?:SECRET|CONFIDENTIAL|RESTRICTED))(?![A-Za-zÀ-ÿ])")
COURRIEL = re.compile(r"[\w.+-]+@([\w-]+(?:\.[\w-]+)+)", re.ASCII)
DOMAINE_FICTIF = re.compile(r"(^|\.)(example\.(com|org|net)|invalid|test|example)$")
TELEPHONE = re.compile(r"(^|[^\d.])((?:(?:\+33|0033)[ .-]?\(?0?\)?|0)[1-9](?:[ .-]?\d{2}){4})(?!\d)", re.ASCII)
IP = re.compile(r"(^|[^\d])((?:\d{1,3}\.){3}\d{1,3})(?!\d)(?!\.\d)", re.ASCII)
CLE_JETON = re.compile(r"\b(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|xox[baprs]-[A-Za-z0-9-]{10,})\b", re.ASCII)
CLE_AFFECTEE = re.compile(r"((?:api[_-]?key|jeton|token|mot[_ ]de[_ ]passe|password)\s*[:=]\s*[\"']?)([A-Za-z0-9_\-]{12,})", re.I | re.ASCII)
CODE_RESEAU = re.compile(r"^\s*(?:import|from)\s+(socket|urllib|requests|http|httpx|ftplib|smtplib|telnetlib|paramiko|aiohttp|websockets?|ssl|xmlrpc)\b", re.M)
CODE_DANGER = re.compile(r"\b(os\.system|subprocess|eval\s*\(|exec\s*\(|__import__|pickle|ctypes)\b")

GRADES_MOTS = (r"g[ée]n[ée]ral(?:\s+de\s+(?:brigade|division|corps\s+d'arm[ée]e|l'arm[ée]e))?|colonel|lieutenant[- ]colonel|chef\s+de\s+bataillon|chef\s+d'escadrons?|commandant|capitaine|sous-lieutenant|lieutenant|aspirant|adjudant-chef|adjudant|major|sergent-chef|sergent|caporal-chef|caporal|brigadier-chef|brigadier|mar[ée]chal\s+des\s+logis(?:-chef)?|m[ée]decin\s+(?:g[ée]n[ée]ral|colonel|commandant|capitaine)|ing[ée]nieur\s+g[ée]n[ée]ral")
GRADES_ABREV = "GAL|Gal|COL|Col|LCL|Lcl|CDT|Cdt|CEN|CBA|CNE|Cne|CPT|Cpt|LTN|Lt|SLT|ASP|Asp|MAJ|Maj|ADC|ADJ|Adj|SCH|SGT|Sgt|CCH|CPL|Cpl|BCH|MDL|MCH"
_SUITE = r"((?:[ \t]+[A-Za-zÀ-ÿ'’-]+){1,3})"
GRADE_MOT = re.compile(r"(^|[^A-Za-zÀ-ÿ])(" + GRADES_MOTS + r")(\.?)" + _SUITE, re.I)
GRADE_ABR = re.compile(r"(^|[^A-Za-zÀ-ÿ])(" + GRADES_ABREV + r")(\.?)" + _SUITE)
CATEGORIES = ("marquage", "grade", "courriel", "telephone", "cle", "ip")
LIBELLES = {"marquage": "mention de protection", "grade": "grade (avec le nom qui suit)", "courriel": "adresse de messagerie",
            "telephone": "numéro de téléphone", "cle": "clé ou mot de passe", "ip": "adresse IP"}


def _majuscule(m):
    return bool(re.match(r"^[A-ZÀ-ÖØ-Þ]", m))


def _retirer_grades(texte, n):
    def rempl(m):
        avant, suite = m.group(1), m.group(4)
        morceaux = re.findall(r"[ \t]+[A-Za-zÀ-ÿ'’-]+", suite)
        pris = 0
        while pris < len(morceaux) and pris < 3 and _majuscule(morceaux[pris].lstrip(" \t")):
            pris += 1
        if pris == 0:
            return m.group(0)
        n["grade"] += 1
        return avant + "[personne]" + "".join(morceaux[pris:])
    for _ in range(4):
        avant = texte
        texte = GRADE_ABR.sub(rempl, GRADE_MOT.sub(rempl, texte))
        if texte == avant:
            break
    return texte


def epurer_texte(brut):
    n = {c: 0 for c in CATEGORIES}
    t = "" if brut is None else str(brut)

    def marq(m):
        n["marquage"] += 1
        return m.group(1)
    t = MARQUAGES.sub(marq, t)
    t = _retirer_grades(t, n)

    def mail(m):
        if DOMAINE_FICTIF.search(m.group(1).lower()):
            return m.group(0)
        n["courriel"] += 1
        return "nom@example.org"
    t = COURRIEL.sub(mail, t)

    def tel(m):
        n["telephone"] += 1
        return m.group(1) + "[numéro retiré]"
    t = TELEPHONE.sub(tel, t)

    def jeton(m):
        n["cle"] += 1
        return "[clé retirée]"
    t = CLE_JETON.sub(jeton, t)

    def affectee(m):
        n["cle"] += 1
        return m.group(1) + "[clé retirée]"
    t = CLE_AFFECTEE.sub(affectee, t)

    def ip(m):
        if not all(int(o) <= 255 for o in m.group(2).split(".")):
            return m.group(0)
        n["ip"] += 1
        return m.group(1) + "192.0.2.1"
    t = IP.sub(ip, t)
    if n["marquage"]:
        t = re.sub(r"[ \t]{2,}", " ", t)
    return t, n


def _parcourir(valeur, total):
    if isinstance(valeur, str):
        t, n = epurer_texte(valeur)
        for c in CATEGORIES:
            total[c] += n[c]
        return t
    if isinstance(valeur, list):
        return [_parcourir(v, total) for v in valeur]
    if isinstance(valeur, dict):
        return {k: _parcourir(v, total) for k, v in valeur.items()}
    return valeur


def epurer_proposition(p):
    total = {c: 0 for c in CATEGORIES}
    propre = _parcourir(p, total)
    alertes = []
    if isinstance(propre, dict) and propre.get("type") == "script":
        contenu = propre.get("contenu") or ""
        if CODE_RESEAU.search(contenu):
            alertes.append("Le script contacte (ou peut contacter) un service extérieur.")
        if CODE_DANGER.search(contenu):
            alertes.append("Le script contient une instruction non autorisée (commande système, évaluation de texte…).")
    if total["cle"]:
        alertes.append("Une clé ou un mot de passe figurait dans le dépôt : prévenir l'auteur pour qu'il la révoque (elle a déjà circulé).")
    if sum(total.values()) >= 10:
        alertes.append("Épuration importante (%d retraits) : vérifier que le contenu reste utilisable et ne repose pas sur des données réelles." % sum(total.values()))
    return propre, total, alertes


# ---------------------------------------------------------------------------
# Lecture et contrôles
# ---------------------------------------------------------------------------
COMPLETABLES = ("usage", "niveau", "langue", "etiquettes", "probleme", "donne", "recoit", "limites", "etapes", "exemple_entree", "exemple_sortie")
OBLIGATOIRES_DEPOT = ("titre", "resume", "type", "auteur", "contenu")
CONTROLES_REQUIS = ("aucune-donnee-reelle", "exemples-fictifs", "aucun-nom-adresse", "aucun-appel-reseau")


def _vide(v):
    return v is None or (isinstance(v, str) and not v.strip()) or (isinstance(v, (list, dict)) and not v)


def lire(chemin):
    try:
        d = json.loads(Path(chemin).read_text(encoding="utf-8-sig"))
    except (OSError, ValueError) as e:
        sys.exit("ERREUR : impossible de lire le fichier (%s)." % e)
    if not isinstance(d, dict) or d.get("format") != FORMAT:
        sys.exit("ERREUR : ce fichier n'est pas un dépôt de la Bibliothèque IA Terre (champ « format » absent ou différent).")
    return d


def sha(texte):
    return hashlib.sha256((texte or "").encode("utf-8")).hexdigest()


def slug(texte):
    t = unicodedata.normalize("NFD", texte or "").encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:40] or "projet"


def analyser(chemin):
    d = lire(chemin)
    reception = d.pop("reception", None)
    propre, retraits, alertes = epurer_proposition(d)
    absents = [c for c in OBLIGATOIRES_DEPOT if _vide(propre.get(c))]
    problemes = []
    if propre.get("type") not in VOCAB["type"]:
        problemes.append("Type inconnu : %r (autorisés : %s)." % (propre.get("type"), ", ".join(VOCAB["type"])))
    ia = propre.get("ia_compatibles")
    if not isinstance(ia, list) or not ia or any(x not in VOCAB["ia"] for x in ia):
        problemes.append("« ia_compatibles » doit contenir au moins une IA parmi : %s." % ", ".join(VOCAB["ia"]))
    manquants = [c for c in CONTROLES_REQUIS if c not in (propre.get("controles") or [])]
    if manquants:
        problemes.append("Engagements non cochés : %s." % ", ".join(manquants))
    if "[personne]" in (propre.get("auteur") or ""):
        problemes.append("Le pseudo de l'auteur contenait un grade, un nom ou une unité : il a été remplacé par « [personne] ». Demandez-en un autre au validateur (option --auteur).")
    a_completer = [c for c in COMPLETABLES if _vide(propre.get(c))]
    etapes = propre.get("etapes")
    if isinstance(etapes, list) and len(etapes) == 1:
        problemes.append("Une seule étape est fournie : il en faut au moins deux (ou aucune). Elle sera à compléter.")
        if "etapes" not in a_completer:
            a_completer.append("etapes")
    sortie = {
        "fichier": str(chemin), "titre": propre.get("titre"), "type": propre.get("type"), "auteur": propre.get("auteur"),
        "retraits": {LIBELLES[c]: retraits[c] for c in CATEGORIES if retraits[c]}, "alertes": alertes,
        "champs_obligatoires_absents": absents, "problemes_bloquants": problemes, "champs_a_completer": a_completer,
        "valeurs_autorisees": {"usage": list(VOCAB["usage"]), "niveau": list(VOCAB["niveau"]), "langue": list(VOCAB["langue"])},
        "contenu": {"longueur": len(propre.get("contenu") or ""), "sha256": sha(propre.get("contenu"))},
        "reception_par_la_boite": reception,
    }
    print(json.dumps(sortie, ensure_ascii=False, indent=2))
    return 0


def _ligne(v):
    return isinstance(v, str) and bool(v.strip())


def verifier_complements(c, propre):
    erreurs = []
    for cle in c:
        if cle not in COMPLETABLES:
            erreurs.append("Le champ « %s » ne peut pas être complété par l'IA (autorisés : %s)." % (cle, ", ".join(COMPLETABLES)))
    for cle, vocab in (("usage", VOCAB["usage"]), ("niveau", VOCAB["niveau"]), ("langue", VOCAB["langue"])):
        if cle in c and c[cle] not in vocab:
            erreurs.append("%s : valeur %r inconnue (autorisées : %s)." % (cle, c[cle], ", ".join(vocab)))
    for cle in ("probleme", "donne", "recoit"):
        if cle in c and not _ligne(c[cle]):
            erreurs.append("%s doit être un texte non vide." % cle)
    if "etapes" in c:
        e = c["etapes"]
        if not isinstance(e, list) or len(e) < 2 or len(e) > 8:
            erreurs.append("etapes : il faut entre 2 et 8 étapes.")
        else:
            for i, x in enumerate(e, 1):
                if not isinstance(x, dict) or not all(_ligne(x.get(k)) for k in ("titre", "entree", "sortie")) or x.get("qui") not in ("vous", "ia"):
                    erreurs.append("Étape %d : titre, entree, sortie et qui (vous ou ia) sont obligatoires." % i)
    return erreurs


def finaliser(chemin, chemin_compl, validateur, auteur, notes, sortie):
    d = lire(chemin)
    d.pop("reception", None)
    propre, retraits, alertes = epurer_proposition(d)
    try:
        compl = json.loads(Path(chemin_compl).read_text(encoding="utf-8-sig"))
    except (OSError, ValueError) as e:
        sys.exit("ERREUR : compléments illisibles (%s)." % e)
    if not isinstance(compl, dict):
        sys.exit("ERREUR : le fichier de compléments doit être un objet JSON.")
    compl_propre, retraits_compl, _ = epurer_proposition(compl)

    if auteur:
        propre["auteur"] = auteur
    erreurs = []
    for c in OBLIGATOIRES_DEPOT:
        if _vide(propre.get(c)):
            erreurs.append("Le dépôt n'a pas de « %s »." % c)
    if "[personne]" in (propre.get("auteur") or ""):
        erreurs.append("Le pseudo de l'auteur est « [personne] » : indiquez un pseudo avec --auteur.")
    erreurs += verifier_complements(compl_propre, propre)

    ignores = []
    completes = []
    for cle in COMPLETABLES:
        if cle in compl_propre:
            if not _vide(propre.get(cle)) and not (cle == "etapes" and isinstance(propre.get(cle), list) and len(propre[cle]) == 1):
                ignores.append(cle)          # l'auteur l'avait renseigné : on ne touche pas
            else:
                propre[cle] = compl_propre[cle]
                completes.append(cle)
    if isinstance(propre.get("etapes"), list) and len(propre["etapes"]) == 1:
        erreurs.append("Une seule étape reste dans le fichier : fournissez au moins deux étapes dans les compléments.")
    for cle in ("usage", "niveau", "langue"):
        if propre.get(cle) not in VOCAB[cle]:
            erreurs.append("%s manquant ou inconnu : à fournir dans les compléments." % cle)
    for cle in ("probleme", "donne", "recoit"):
        if not _ligne(propre.get(cle)):
            erreurs.append("%s manquant : à fournir dans les compléments." % cle)
    if propre.get("type") not in VOCAB["type"]:
        erreurs.append("Type inconnu.")
    ia = propre.get("ia_compatibles")
    if not isinstance(ia, list) or not ia or any(x not in VOCAB["ia"] for x in ia):
        erreurs.append("ia_compatibles invalide.")
    if any(c not in (propre.get("controles") or []) for c in CONTROLES_REQUIS):
        erreurs.append("Les quatre engagements du dépôt ne sont pas tous cochés.")

    # Le contenu doit être exactement celui du dépôt, épuré : contrôle de bout en bout.
    attendu, _ = epurer_texte(d.get("contenu"))
    if propre.get("contenu") != attendu:
        erreurs.append("Le contenu a été modifié : refusé.")

    # Dernier filet : le résultat final ne doit plus rien contenir à épurer.
    _, reste, _ = epurer_proposition(propre)
    if sum(reste.values()):
        erreurs.append("Le résultat contient encore des éléments à épurer : %s." % ", ".join("%s × %d" % (LIBELLES[c], reste[c]) for c in CATEGORIES if reste[c]))

    if erreurs:
        print("VALIDATION IMPOSSIBLE :")
        for e in erreurs:
            print("  - " + e)
        return 1

    maintenant = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    propre["validation"] = {
        "par": validateur, "date": maintenant, "avec_ia": True, "champs_completes_par_ia": completes,
        "propositions_ia_ignorees": ignores,
        "retraits_automatiques": {LIBELLES[c]: retraits[c] for c in CATEGORIES if retraits[c]},
        "retraits_dans_complements_ia": {LIBELLES[c]: retraits_compl[c] for c in CATEGORIES if retraits_compl[c]},
        "alertes": alertes, "notes": notes, "contenu_sha256": sha(propre["contenu"]),
    }
    dossier = Path(sortie)
    dossier.mkdir(parents=True, exist_ok=True)
    nom = slug(propre["titre"])
    f_json = dossier / ("valide-%s.json" % nom)
    f_json.write_text(json.dumps(propre, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lignes = ["# Fiche de validation : %s" % propre["titre"], "",
              "- Type : %s · Auteur (pseudo) : %s" % (propre["type"], propre["auteur"]),
              "- Validé par : %s, le %s" % (validateur, maintenant),
              "- Mention publique : « Validé avec l'aide de l'IA, par %s »" % validateur, ""]
    lignes.append("## Éléments retirés automatiquement")
    r = [("%d × %s" % (retraits[c], LIBELLES[c])) for c in CATEGORIES if retraits[c]]
    lignes += (["- " + x for x in r] if r else ["- Aucun."])
    if any(retraits_compl.values()):
        lignes.append("- Dans les compléments de l'IA : " + ", ".join("%d × %s" % (retraits_compl[c], LIBELLES[c]) for c in CATEGORIES if retraits_compl[c]))
    lignes += ["", "## Champs complétés par l'IA"]
    lignes += (["- " + c for c in completes] if completes else ["- Aucun : l'auteur avait tout renseigné."])
    if ignores:
        lignes.append("- Propositions de l'IA ignorées (champ déjà renseigné par l'auteur) : " + ", ".join(ignores))
    lignes += ["", "## Contenu", "- Repris à l'identique du dépôt (empreinte SHA-256 : %s…)." % sha(propre["contenu"])[:16], ""]
    if alertes:
        lignes.append("## À vérifier avant publication")
        lignes += ["- " + a for a in alertes]
        lignes.append("")
    if notes:
        lignes += ["## Notes du validateur", notes, ""]
    lignes += ["## Prochaine étape", "Déposer « %s » dans le dossier validations/ du dépôt GitHub." % f_json.name, ""]
    print("VALIDATION PRÉPARÉE : un seul fichier à déposer sur GitHub")
    print("  " + str(f_json))
    print("")
    print("\n".join(lignes))
    return 0


def main():
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)
    a = s.add_parser("analyser"); a.add_argument("depot")
    f = s.add_parser("finaliser"); f.add_argument("depot"); f.add_argument("complements")
    f.add_argument("--validateur", required=True); f.add_argument("--auteur", default="")
    f.add_argument("--notes", default=""); f.add_argument("--sortie", default=".")
    x = p.parse_args()
    if x.cmd == "analyser":
        return analyser(x.depot)
    return finaliser(x.depot, x.complements, x.validateur.strip(), x.auteur.strip(), x.notes.strip(), x.sortie)


if __name__ == "__main__":
    sys.exit(main())
