# -*- coding: utf-8 -*-
"""Rendu Markdown minimal vers HTML, sans dépendance.

Prend en charge : titres, paragraphes, listes (une imbrication), blocs de code,
citations, tableaux, filets, gras, italique, code en ligne et liens.
Tout le texte est échappé : un fichier ne peut pas injecter de HTML dans le site.
"""
import html
import re
import unicodedata


def echapper(texte):
    return html.escape(texte, quote=True)


def slug(texte):
    t = unicodedata.normalize("NFKD", texte).encode("ascii", "ignore").decode("ascii")
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()
    return t or "section"


def inline(texte):
    gardes = []

    def garder(m):
        gardes.append("<code>%s</code>" % echapper(m.group(1)))
        return "\x00%d\x00" % (len(gardes) - 1)

    t = re.sub(r"`([^`\n]+)`", garder, texte)
    t = echapper(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)

    def lien(m):
        libelle, url = m.group(1), m.group(2)
        brut = html.unescape(url)
        if re.match(r"^(https?://\S+|#\S*|[\w./-]+)$", brut) and not brut.lower().startswith("javascript"):
            if brut.startswith("http"):
                return '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>' % (url, libelle)
            return '<a href="%s">%s</a>' % (url, libelle)
        return m.group(0)

    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", lien, t)
    t = re.sub(r"\x00(\d+)\x00", lambda m: gardes[int(m.group(1))], t)
    return t


_RE_FENCE = re.compile(r"^(```+|~~~+)\s*([\w+-]*)\s*$")
_RE_TITRE = re.compile(r"^(#{1,4})\s+(.*?)\s*#*\s*$")
_RE_ITEM = re.compile(r"^(\s*)([-*+]|\d+[.)])\s+(.*)$")
_RE_SEP_TABLE = re.compile(r"^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$")


def _debut_de_bloc(lignes, i):
    l = lignes[i]
    return bool(_RE_FENCE.match(l) or _RE_TITRE.match(l) or _RE_ITEM.match(l) or l.startswith(">")
                or re.match(r"^\s*(-{3,}|\*{3,}|_{3,})\s*$", l))


def _cellules(ligne):
    ligne = ligne.strip()
    if ligne.startswith("|"):
        ligne = ligne[1:]
    if ligne.endswith("|"):
        ligne = ligne[:-1]
    return [c.strip() for c in ligne.split("|")]


def _rendre_liste(lignes):
    """lignes : lignes consécutives appartenant à une liste. Retourne le HTML."""
    premier = _RE_ITEM.match(lignes[0])
    base = len(premier.group(1))
    ordonnee = bool(re.match(r"\d", premier.group(2)))
    items = []
    for l in lignes:
        m = _RE_ITEM.match(l)
        if m and len(m.group(1)) <= base:
            items.append({"texte": [m.group(3)], "enfants": []})
        elif items:
            if m:
                items[-1]["enfants"].append(l)
            elif l.strip():
                items[-1]["texte"].append(l.strip())
    html_items = []
    for it in items:
        contenu = inline(" ".join(it["texte"]))
        if it["enfants"]:
            contenu += _rendre_liste(it["enfants"])
        html_items.append("<li>%s</li>" % contenu)
    balise = "ol" if ordonnee else "ul"
    return "<%s>%s</%s>" % (balise, "".join(html_items), balise)


def rendre(markdown):
    lignes = markdown.replace("\r\n", "\n").split("\n")
    sortie = []
    i = 0
    while i < len(lignes):
        l = lignes[i]
        if not l.strip():
            i += 1
            continue

        m = _RE_FENCE.match(l)
        if m:
            marque, langue = m.group(1), m.group(2)
            bloc = []
            i += 1
            while i < len(lignes) and not lignes[i].startswith(marque[:3]):
                bloc.append(lignes[i])
                i += 1
            i += 1
            sortie.append('<pre><code class="langue-%s">%s</code></pre>' % (echapper(langue), echapper("\n".join(bloc))))
            continue

        m = _RE_TITRE.match(l)
        if m:
            niveau = len(m.group(1))
            sortie.append('<h%d id="%s">%s</h%d>' % (niveau, slug(m.group(2)), inline(m.group(2)), niveau))
            i += 1
            continue

        if re.match(r"^\s*(-{3,}|\*{3,}|_{3,})\s*$", l):
            sortie.append("<hr>")
            i += 1
            continue

        if l.startswith(">"):
            bloc = []
            while i < len(lignes) and lignes[i].startswith(">"):
                bloc.append(lignes[i][1:].lstrip())
                i += 1
            sortie.append("<blockquote>%s</blockquote>" % rendre("\n".join(bloc)))
            continue

        if "|" in l and i + 1 < len(lignes) and _RE_SEP_TABLE.match(lignes[i + 1]) and "|" in lignes[i + 1]:
            entete = _cellules(l)
            i += 2
            corps = []
            while i < len(lignes) and lignes[i].strip() and "|" in lignes[i]:
                corps.append(_cellules(lignes[i]))
                i += 1
            h = "<div class=\"tableau\"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>" % (
                "".join("<th>%s</th>" % inline(c) for c in entete),
                "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % inline(c) for c in ligne) for ligne in corps),
            )
            sortie.append(h)
            continue

        if _RE_ITEM.match(l):
            bloc = []
            while i < len(lignes):
                cur = lignes[i]
                if _RE_ITEM.match(cur) or (cur.strip() and cur.startswith((" ", "\t"))):
                    bloc.append(cur)
                    i += 1
                elif not cur.strip() and i + 1 < len(lignes) and (_RE_ITEM.match(lignes[i + 1]) or lignes[i + 1].startswith((" ", "\t"))):
                    i += 1
                else:
                    break
            sortie.append(_rendre_liste(bloc))
            continue

        para = [l.strip()]
        i += 1
        while i < len(lignes) and lignes[i].strip() and not _debut_de_bloc(lignes, i):
            para.append(lignes[i].strip())
            i += 1
        sortie.append("<p>%s</p>" % inline(" ".join(para)))
    return "\n".join(sortie)
