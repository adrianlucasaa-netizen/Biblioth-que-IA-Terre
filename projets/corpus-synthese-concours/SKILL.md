---
name: corpus-synthese-concours
description: Constituer un corpus documentaire pour une épreuve de synthèse (6 à 9 documents réels, sommaire, mise en page paginée en DOCX/PDF) et formuler le sujet à part.
---

# Corpus de synthèse de concours

## Quand l'utiliser
L'utilisateur veut un corpus de textes réels pour entraîner ou évaluer des candidats à une épreuve de synthèse, avec une question posée en dehors du corpus.

## Résultat attendu
- Un fichier .docx et le PDF correspondant : page 1 = sommaire tenant sur une page ; chaque document commence sur une nouvelle page ; toutes les pages sont numérotées « Page X / Y » ; le sommaire indique la page de début de chaque document.
- Le sujet (une question), donné à part dans la réponse, jamais dans le fichier.
- Rien d'autre : ni méthode, ni corrigé, ni grille, ni liste de pièges, ni commentaire, sauf demande explicite.

## Déroulé et points de validation
Créer une liste de tâches reprenant les étapes ci-dessous (outil de tâches, ou à défaut en tête de `sources.md`). Deux validations par l'utilisateur sont obligatoires : après le cadrage (étape 1) et après la proposition de composition (étape 3). Ne pas extraire ni traduire de texte avant la seconde validation. Si l'utilisateur refuse une suggestion, ne pas la reproposer.

## 1. Cadrage
Poser en une seule fois les questions dont la réponse manque :
- thème (si le thème est militaire et que seul le web est disponible, le signaler et proposer un thème civil à enjeu stratégique) ;
- nombre de documents (6 à 9) ;
- volume cible en pages, sommaire compris, et taille de police acceptée (par défaut 15 à 20 pages ; une police réduite seulement si l'utilisateur la valide) ;
- langue du corpus (traduire ou non les originaux étrangers) ;
- date d'arrêt des faits (par défaut : la date du jour, vérifiée avec l'outil de date avant de qualifier un fait de récent ou d'à venir).
Puis annoncer le thème retenu en une phrase.

## 2. Recherche des sources
- Outils : recherche web et récupération de pages. Si un outil renvoie le contenu brut sans modèle intermédiaire, le préférer. Tester une fois l'accès du terminal à un site officiel (`curl -sSI <url>`) : s'il répond, télécharger le PDF officiel et l'extraire avec `pdftotext` (texte exact, sans reformulation). S'il est refusé, ne pas insister (pas de contournement par miroir ou cache) et passer par l'outil de récupération.
- Lire chaque source à son origine. Un relais, un agrégateur, un site de veille ou une page de presse n'est jamais une source : ils ont déjà fourni des chiffres faux (nombre de candidatures, écarts de prix, caractère contraignant d'un texte).
- Page vide, squelette (EUR-Lex, sites en JavaScript) ou refusée à l'outil (robots.txt) : essayer dans l'ordre la version PDF, une autre version linguistique, le communiqué ou le résumé officiel de l'institution, le diffuseur officiel de ses communiqués. Le fichier intégral de l'émetteur hébergé par un diffuseur officiel (vie-publique.fr, Office des publications de l'UE) est accepté, à condition de le dire dans le lien de l'en-tête. Si rien ne fonctionne, déclarer le document indisponible et proposer un substitut ; ne jamais le reconstituer.
- Ne jamais reprendre un résumé ou une traduction automatique produits par un tiers comme s'il s'agissait du texte officiel.
- Long document (rapport, règlement) : retenir le résumé, le communiqué ou les réponses qui l'accompagnent, ou des extraits ciblés.
- Recouper entre deux sources, dont une primaire, l'état des lieux et chaque chiffre que le sujet mobilise. Les autres chiffres restent attribués à leur émetteur. Un chiffre d'acteur contredit ou introuvable ailleurs n'est pas retiré du texte (le document resterait tronqué) : il est signalé dans les limites de la livraison, avec la divergence constatée.
- La presse peut servir à repérer un fait (état d'une loi, d'une négociation), jamais à le citer ni à le chiffrer : le fait est ensuite confirmé à la source officielle.
- Relever les échéances proches de la date d'arrêt (expiration d'une mesure, négociation en cours) : elles figurent dans la proposition de composition.
- Tenir un journal `sources.md` dans le dossier de travail : pour chaque document, URL, date de consultation, licence, passages retenus, chiffres vérifiés et leur seconde source.

## 3. Composition (proposition à faire valider)
Remplir cette grille de couverture :
1. état des lieux chiffré (situation actuelle de référence) ;
2. diagnostic général ou international ;
3. cadre juridique ou politique ;
4. bilan officiel des institutions ;
5. limites et critiques (audit, financement, acceptation sociale) ;
6. point de vue de l'acteur adverse ou concurrent ;
7. déclinaison nationale ou sectorielle.

Règles : chaque document apporte un angle distinct ; avec moins de 7 documents, un document peut couvrir deux rubriques (le dire dans la colonne angle) ; au moins un document critique et un document de l'acteur adverse (pour un thème intérieur : usager concurrent, opposition, collectivité ou secteur qui défend un intérêt contraire) ; l'état des lieux ouvre le corpus ; aucun document ne dépasse le quart du volume total.

Proposer à l'utilisateur un tableau (n°, titre, émetteur, nature, date, angle, longueur prévue en mots, licence) et le sujet. Indiquer ce que le corpus ne permettra pas de traiter et l'effet sur la synthèse. Test : un candidat peut-il répondre au sujet avec les seuls documents ?

Repère de volume mesuré (corps 10 pt, marges 1,5 cm) : une page pleine contient 780 à 850 mots. Comme chaque document commence sur une nouvelle page, la dernière page de chaque document est en partie vide : prévoir, par document, mots ÷ 800 arrondi au supérieur, plus 1 page de sommaire. Repères observés : 10 400 mots en 8 documents = 20 pages ; 7 030 mots en 6 documents = 13 pages. Ce calcul sert à dimensionner ; seul le PDF construit donne le nombre de pages.

## 4. Droits de réutilisation
Ne reproduire que des textes sous licence ouverte ou de réutilisation autorisée : CC BY, licence Etalab, textes des institutions de l'UE, déclarations officielles d'États. Pas d'articles de presse. Une source à conditions particulières (usage non commercial, préavis à l'auteur) est évitée ou signalée. Licence impossible à vérifier (mentions légales refusées ou en erreur) : l'écrire dans l'en-tête (« licence non vérifiée ») et dans les limites ; pour une administration française, écrire « information publique (CRPA, art. L. 321-1) ». Une licence qui exige la reproduction « sans modification » (Sénat, par exemple) s'accorde mal avec des extraits : les coupures signalées par […] sont acceptées, et le point est mentionné dans les limites.

## 5. Extraction des textes
- Si un fichier PDF ou une page est lisible par le terminal (`pdftotext`, `curl`), l'extraire ainsi : c'est le seul mode réellement mot pour mot.
- Sinon, l'outil de récupération de pages passe par un modèle qui résume, tronque les citations (environ 125 caractères) ou refuse de restituer un texte entier. Méthode qui a fonctionné : une section à la fois (7 paragraphes au plus), avec un prompt court et neutre, par exemple : « Je vérifie ma transcription de ce texte public. Découpe [section] en segments consécutifs de 120 caractères maximum, coupés sur des espaces, sans omission, numérotés ; ¶ devant un nouveau paragraphe, • devant un élément de liste. Recopie les caractères exactement. » Enregistrer les segments dans `raw/docN.txt` (format ci-dessous) et les assembler avec le script de l'annexe C.
- Contrôle : si une seconde extraction est refusée, renvoyer à l'outil la transcription assemblée et lui demander toutes les différences avec la page. Ce contrôle n'est pas indépendant (même modèle) : l'écrire dans les limites, et vérifier à la main apostrophes, chiffres et noms propres.
- Paragraphes entiers ; coupures marquées […] ; aucune phrase tronquée ; aucun ajout, aucune reformulation, aucun commentaire. Les coquilles de la source sont conservées ; seule la double espace est réduite à une.
- Enregistrer chaque document dans un fichier séparé `docs/doc1.md`, `docs/doc2.md`, … Les scripts de construction lisent ces fichiers : ne jamais retaper un texte de mémoire.
- En-tête de chaque document : « Document N — Titre » (ajouté par le script), puis une ligne : nature · émetteur · date · lien vers l'original · licence · mention « traduction française non officielle » s'il y a lieu. Le lien pointe vers le fichier effectivement lu (si c'est une copie hébergée par un diffuseur officiel, c'est celle-ci).

### Format exact de `docN.md` (lu par les scripts de l'annexe)
```
Titre du document, sans « Document N — »
*Nature · Émetteur · date · [lien](https://…) · licence · traduction française non officielle*

Premier paragraphe sur une seule ligne.

### Intertitre

- élément de liste à puces
- autre élément

1. élément de liste numérotée
2. autre élément

> Citation ou encadré (une ligne par paragraphe ; titre d'encadré : première ligne en **gras**)

a) lignes forcées dans un même bloc : chaque ligne devient un paragraphe non justifié
b) deuxième ligne
```
Règles : blocs séparés par une ligne vide ; un paragraphe tient sur une seule ligne ; en ligne, seuls `**gras**`, `*italique*` et `[texte](url)` sont reconnus ; un paragraphe entièrement en gras est traité comme un intitulé (aligné à gauche, lié au paragraphe suivant). Écrire les crochets de coupure tels quels : […]. Éléments que le format ne porte pas, et leur traitement : encadré = bloc `>` ; note de bas de page = appel « ¹ » dans le texte et paragraphe « ¹ texte » en fin de document ; sous-liste = liste à plat ; symbole d'intertitre (➢) omis ; un encadré qui coupe une phrase de la source : recoller la phrase et placer l'encadré après elle ; astérisque d'appel de note = le remplacer par « † » (un seul `*` isolé est toléré, deux dans un même paragraphe seraient lus comme de l'italique). Chaque adaptation de ce genre est notée dans `sources.md` et dans les limites. Si le texte vient d'un export de l'éditeur de documents, remplacer d'abord `&#91;` par `[` et retirer les barres obliques inverses devant `[` et `]`.

### Format de `docs/meta.json` (données du sommaire)
```json
{"titre": "Corpus de synthèse – <thème>",
 "note": "Les documents … sont des traductions françaises … Une coupure dans le texte est signalée par […].",
 "documents": [{"n": 1, "titre": "…", "nature": "…", "emetteur": "…", "date": "…"}]}
```
Garder les colonnes nature, émetteur et date courtes : le sommaire doit tenir sur une page.

## 6. Traduction
- Traduction fidèle, sans résumé ni adaptation.
- Glossaire unique tenu dans `glossaire.md` et appliqué à tout le corpus (exemples : règlement, projets stratégiques, repères, guichet unique, matières premières critiques).
- Nombres, dates, noms propres et sigles recopiés à l'identique ; seules les conventions d'écriture changent (6.5 trillion → 6 500 milliards ; 72% → 72 %).
- Contrôle par script : extraire la liste des nombres de l'original et de la traduction, et justifier chaque écart.
- Un original déjà en français n'est pas retouché.

## 7. Volume
- Compter les mots de chaque `docN.md` par script avant la construction ; comparer au repère de l'étape 3.
- Après la première construction, relever le nombre réel de pages.
- Si le volume s'écarte de plus de 10 % de la cible, dans un sens ou dans l'autre, le dire et proposer des retraits ou des ajouts nommés (documents entiers ou parties précises, avec leur longueur en mots ; aucun document ne doit dépasser le quart du total). Ne rien raccourcir ni ajouter sans l'accord de l'utilisateur.
- Ne jamais annoncer un nombre de pages qui n'a pas été mesuré sur le PDF.

## 8. Production des fichiers : chaîne de repli
Le livrable est un .docx et un PDF. Ne pas utiliser l'éditeur de documents intégré, qui ne gère ni les sauts de page ni la numérotation. Les deux scripts de l'annexe ont été testés sur un corpus réel de 8 documents (10 400 mots) : les copier tels quels dans `build/`, sans les réécrire ; ne modifier que les constantes si l'utilisateur demande une autre mise en page.

Commencer par vérifier les outils, en une commande :
```bash
for t in soffice pdfinfo pdftotext pdftoppm node python3; do printf "%-10s " $t; command -v $t >/dev/null && echo OK || echo ABSENT; done
node -e "require.resolve('docx',{paths:['build']})" 2>/dev/null && echo "docx OK" || echo "docx ABSENT"
for m in reportlab pypdf pypdfium2; do python3 -c "import $m" 2>/dev/null && echo "$m OK" || echo "$m ABSENT"; done
ls /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
```
Construire sous les noms `corpus.docx` et `corpus.pdf`, vérifier, puis renommer en `corpus_<thème-court>_<AAAA-MM-JJ>` (étape 10). Un outil absent s'installe d'abord (`npm install docx`, `pip install --break-system-packages reportlab pypdf pypdfium2`) ; si l'installation échoue, descendre au niveau suivant. Annoncer à l'utilisateur le niveau utilisé.

### Niveau 1 — Word par docx-js, PDF par LibreOffice (recommandé)
```bash
node build/build_corpus.js docs corpus.docx "Faits arrêtés au <date>"
python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf corpus.docx
```
Si ce script n'existe pas : `soffice --headless --convert-to pdf corpus.docx`.
Le sommaire contient des renvois automatiques vers des signets : LibreOffice et Word calculent eux-mêmes les numéros de page, sans double passe. Mise en page du script : A4, marges 1,5 cm (850 DXA, largeur utile 10 206 DXA), Arial 10 pt (rendu par Liberation Sans), titres de document 13 pt, en-têtes 8,5 pt italique, sommaire en 9 pt.

### Niveau 2 — Word sans LibreOffice
Produire le .docx du niveau 1 et le PDF par le niveau 3, à partir des mêmes fichiers. Les deux fichiers ont la même structure mais pas forcément la même pagination : le dire. À l'ouverture du .docx, Word propose de mettre à jour les champs : répondre oui pour calculer les numéros du sommaire.

### Niveau 3 — PDF direct par Python (reportlab)
```bash
python3 -I build/build_corpus_pdf.py docs corpus.pdf "Faits arrêtés au <date>"
```
Sans Node ni LibreOffice. Le script relève la page de début de chaque document pendant une première construction, la réinjecte dans le sommaire par une seconde, et s'arrête si la pagination change entre les deux. Police DejaVu Sans (accents, « », —, œ, Š, č) ; si elle est absente, chercher une autre police TrueType avec `fc-list` et changer la constante `F`. La police étant plus large qu'Arial, compter une page de plus qu'au niveau 1.

### Niveau 4 — Sans aucun outil de construction
Produire une page HTML autonome : sommaire en première page, `break-before: page` sur chaque titre de document, `@page { size: A4; margin: 1.5cm }`. L'utilisateur l'imprime en PDF depuis son navigateur en cochant « En-têtes et pieds de page », ce qui numérote les pages. Les navigateurs ne calculent pas les numéros du sommaire : la colonne page reste vide, et il faut le dire. Si l'ordinateur de l'utilisateur est relié à la session et dispose de Word ou de LibreOffice, y produire plutôt le .docx.

## 9. Vérification avant livraison
Selon les outils présents :
- Concordance du sommaire, en une commande (niveau 1) :
```bash
N=$(pdfinfo corpus.pdf|awk '/Pages/{print $2}'); echo "pages : $N"
echo "sommaire : $(pdftotext -layout -f 1 -l 1 corpus.pdf - | grep -oE '^ +[0-9]+ .* ([0-9]+)$' | awk '{print $NF}' | tr '\n' ' ')"
echo "réel     : $(for i in $(seq 1 $N); do pdftotext -f $i -l $i corpus.pdf - | grep -qE '^Document [0-9]+ —' && printf "$i "; done)"
```
  Si le nombre de numéros relevés dans le sommaire diffère du nombre de documents (une cellule passée sur deux lignes casse le motif), lire la page 1 avec `pdftotext -layout`. Sans poppler : `pypdf.PdfReader('corpus.pdf')`, nombre de pages, puis pages dont les premières lignes commencent par « Document N — ».
- Rendu visuel : `pdftoppm -jpeg -r 100 corpus.pdf p` (sinon `pypdfium2`), assembler les pages par quatre avec PIL et les lire : sommaire entier sur la page 1, chaque document en haut d'une nouvelle page, pied de page visible, aucun tableau débordant, aucun texte coupé, aucune ligne justifiée étirée. Compter les lignes de chaque page (`pdftotext -f N -l N`) : une page de moins de 5 lignes est signalée, avec un retrait ou un ajout proposé.
- Si le sommaire dépasse une page : raccourcir les cellules nature, émetteur et date, puis passer le tableau à 8,5 pt.
- Les chiffres et dates qui portent le sujet, et tout chiffre signalé dans `sources.md`, sont confrontés à la source ; les liens s'ouvrent. Dire quels chiffres n'ont pas été confrontés.
- Ce qui n'a pas pu être vérifié (rendu visuel, pagination du .docx dans Word) est dit avant la livraison, jamais présumé.

## 10. Livraison
Renommer puis envoyer `corpus_<thème-court>_<AAAA-MM-JJ>.docx` et le `.pdf`. Dans la réponse : une ligne de contexte, le sujet, le nombre de pages mesuré, le niveau de production utilisé et la liste courte des limites (documents indisponibles, traductions non officielles, sources à conditions particulières, échéances qui peuvent changer la donne).

## Interdits
- Méthode, corrigé, grille, pièges ou commentaires dans le corpus.
- Chiffre mobilisé par le sujet non recoupé.
- Texte reconstitué depuis un résumé ou une traduction de tiers.
- Article de presse reproduit.
- Nombre de pages annoncé sans mesure.
- Raccourcissement ou suppression de document sans accord.
- Réécriture des scripts de l'annexe au lieu de les copier.
## Annexe A — `build/build_corpus.js` (niveau 1)
```js
// Construit corpus.docx à partir de docN.md + meta.json (rédigés selon le format de l’étape 5).
// Usage : node build_corpus.js <dossier_docs> <sortie.docx> "<ligne de date d'arrêt>"
const fs = require("fs"), path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Footer, AlignmentType, PageNumber, HeadingLevel,
  Bookmark, PageReference, ExternalHyperlink, Table, TableRow, TableCell, WidthType,
  ShadingType, LevelFormat, BorderStyle,
} = require("docx");

const [dir, outFile, dateLine] = process.argv.slice(2);
const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));

const FONT = "Arial";            // rendu par Liberation Sans sous LibreOffice (métriques identiques)
const BODY = 20, SMALL = 17, TABLE = 18, H1 = 26, H2 = 22, TITLE = 32; // demi-points
const MARGIN = 850;               // 1,5 cm
const PAGE_W = 11906;             // A4
const USABLE = PAGE_W - 2 * MARGIN; // 10 206 DXA

// ---------- Mise en forme en ligne : **gras**, *italique*, [texte](url) ----------
function inline(text, base = {}) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\((https?:[^)\s]+)\)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    if (m[1] !== undefined) out.push(...inline(m[1], { ...base, bold: true }));
    else if (m[2] !== undefined) out.push(...inline(m[2], { ...base, italics: true }));
    else out.push(new ExternalHyperlink({ link: m[4], children: [new TextRun({ text: m[3], ...base, style: "Hyperlink" })] }));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), ...base }));
  return out;
}
// Paragraphe dont les retours à la ligne internes deviennent des sauts de ligne
function lines(text, base = {}) {
  const runs = [];
  text.split("\n").forEach((l, i) => {
    if (i > 0) runs.push(new TextRun({ break: 1 }));
    runs.push(...inline(l, base));
  });
  return runs;
}

// ---------- Numérotation des listes (une instance par liste ordonnée = renumérotation) ----------
let listInstance = 0;
const numbering = {
  config: [
    { reference: "puces", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
    { reference: "numeros", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 400, hanging: 280 } } } }] },
  ],
};

// ---------- Un document du corpus ----------
function buildDoc(n) {
  const raw = fs.readFileSync(path.join(dir, `doc${n}.md`), "utf8");
  const [titre, entete, ...rest] = raw.split("\n");
  const blocks = rest.join("\n").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const out = [
    new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true,
      children: [new Bookmark({ id: `doc${n}`, children: inline(`Document ${n} — ${titre}`) })] }),
    new Paragraph({ spacing: { after: 160 }, children: inline(entete.replace(/^\*(.*)\*$/, "$1"), { italics: true, size: SMALL }) }),
  ];
  for (const b of blocks) {
    if (b.startsWith("### ")) {
      out.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: inline(b.slice(4)) }));
    } else if (/^- /.test(b)) {
      b.split("\n").forEach(l => out.push(new Paragraph({ numbering: { reference: "puces", level: 0 }, children: inline(l.replace(/^- /, "")) })));
    } else if (/^\d+\. /.test(b)) {
      const inst = ++listInstance;
      b.split("\n").forEach(l => out.push(new Paragraph({ numbering: { reference: "numeros", level: 0, instance: inst }, children: inline(l.replace(/^\d+\. /, "")) })));
    } else if (b.startsWith(">")) {
      const paras = b.split("\n").map(l => l.replace(/^>\s?/, "")).join("\n").split(/\n\s*\n|\n(?=\S)/).filter(s => s.trim());
      paras.forEach(p => out.push(new Paragraph({ indent: { left: 567 },
        border: { left: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 8 } },
        children: inline(p.trim(), { italics: true }) })));
    } else if (b.includes("\n")) {
      // Lignes forcées (énumérations a), b), c)…) : un paragraphe par ligne, jamais justifié
      const ls = b.split("\n");
      ls.forEach((l, i) => out.push(new Paragraph({ spacing: { after: i === ls.length - 1 ? 100 : 30 }, children: inline(l) })));
    } else if (/^\*\*[^*]+\*\*( \([^)]*\))?$/.test(b)) {
      // Paragraphe entièrement en gras (intitulé) : aligné à gauche, lié au suivant
      out.push(new Paragraph({ keepNext: true, children: inline(b) }));
    } else {
      out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: inline(b) }));
    }
  }
  return out;
}

// ---------- Sommaire ----------
const COLS = [450, 3956, 1500, 2000, 1500, 800]; // somme = 10 206
const cell = (children, w, header = false) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  margins: { top: 40, bottom: 40, left: 80, right: 80 },
  shading: header ? { type: ShadingType.CLEAR, color: "auto", fill: "E7E6E6" } : undefined,
  children: [new Paragraph({ spacing: { after: 0 }, children })],
});
const t = (s, o = {}) => inline(s, { size: TABLE, ...o });
const sommaire = new Table({
  width: { size: USABLE, type: WidthType.DXA }, columnWidths: COLS,
  rows: [
    new TableRow({ tableHeader: true, children: ["N°", "Document", "Nature", "Émetteur", "Date", "Page"]
      .map((h, i) => cell(t(h, { bold: true }), COLS[i], true)) }),
    ...meta.documents.map(d => new TableRow({ cantSplit: true, children: [
      cell(t(String(d.n)), COLS[0]), cell(t(d.titre), COLS[1]), cell(t(d.nature), COLS[2]),
      cell(t(d.emetteur), COLS[3]), cell(t(d.date), COLS[4]),
      cell([new PageReference(`doc${d.n}`, { })], COLS[5]),
    ] })),
  ],
});

const doc = new Document({
  features: { updateFields: true },
  numbering,
  styles: {
    default: { document: { run: { font: FONT, size: BODY }, paragraph: { spacing: { after: 100, line: 240 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: H1, bold: true, color: "000000" }, paragraph: { spacing: { before: 0, after: 80 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: H2, bold: true, color: "000000" }, paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, footer: 425 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ size: 16, children: ["Page ", PageNumber.CURRENT, " / ", PageNumber.TOTAL_PAGES] })] })] }) },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: meta.titre, bold: true, size: TITLE })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: dateLine, italics: true, size: SMALL })] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Sommaire", bold: true, size: H1 })] }),
      sommaire,
      new Paragraph({ spacing: { before: 160 }, children: inline(meta.note, { italics: true, size: SMALL }) }),
      ...meta.documents.flatMap(d => buildDoc(d.n)),
    ],
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(outFile, b); console.log("écrit :", outFile); });
```

## Annexe B — `build/build_corpus_pdf.py` (niveau 3)
```python
"""Niveau de repli : PDF direct avec reportlab, sans Node ni LibreOffice.
Lit les mêmes docN.md + meta.json que build_corpus.js.
Usage : python3 -I build_corpus_pdf.py <dossier_docs> <sortie.pdf> "<ligne de date d'arrêt>" """
import json, re, sys, pathlib, html
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, PageBreak, Table, TableStyle, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

d, out, date_line = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3]
meta = json.load(open(d / "meta.json", encoding="utf-8"))

# Police TrueType : accents, « », —, …, œ, et caractères hors Windows-1252 (Š, č, ≈…)
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans"
pdfmetrics.registerFont(TTFont("Corps", F + ".ttf")); pdfmetrics.registerFont(TTFont("Corps-B", F + "-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Corps-I", F + "-Oblique.ttf")); pdfmetrics.registerFont(TTFont("Corps-BI", F + "-BoldOblique.ttf"))
from reportlab.lib.fonts import addMapping
for b, i, n in [(0, 0, "Corps"), (1, 0, "Corps-B"), (0, 1, "Corps-I"), (1, 1, "Corps-BI")]: addMapping("Corps", b, i, n)

S = lambda **k: ParagraphStyle("s", **{"fontName": "Corps", "fontSize": 9.5, "leading": 11.6, "spaceAfter": 4, **k})
body, left, small = S(alignment=TA_JUSTIFY), S(), S(fontSize=8, leading=10, spaceAfter=8)
h1 = S(fontSize=12.5, leading=15, spaceAfter=4); h2 = S(fontSize=10.5, leading=13, spaceBefore=6, spaceAfter=3)
quote = S(leftIndent=0.8 * cm); cellst = S(fontSize=8.5, leading=10, spaceAfter=0)
title = S(fontSize=16, leading=20, alignment=TA_CENTER)

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\[([^\]]+)\]\((https?:[^)\s]+)\)", r'<link href="\2" color="blue">\1</link>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

class NC(canvas.Canvas):  # pied de page « Page X / Y »
    def __init__(s, *a, **k): super().__init__(*a, **k); s._p = []
    def showPage(s): s._p.append(dict(s.__dict__)); s._startPage()
    def save(s):
        for st in s._p:
            s.__dict__.update(st); s.setFont("Corps", 8)
            s.drawCentredString(A4[0] / 2, 0.8 * cm, f"Page {s._pageNumber} / {len(s._p)}"); super().showPage()
        super().save()

starts = {}
class D(BaseDocTemplate):
    def afterFlowable(s, f):
        if getattr(f, "docnum", None): starts[f.docnum] = s.page

def story(pages):
    st = [Paragraph(f"<b>{inline(meta['titre'])}</b>", title), Paragraph(f"<i>{date_line}</i>", S(alignment=TA_CENTER, fontSize=8)),
          Spacer(1, 10), Paragraph("<b>Sommaire</b>", h1)]
    rows = [[Paragraph(f"<b>{h}</b>", cellst) for h in ["N°", "Document", "Nature", "Émetteur", "Date", "Page"]]]
    for m in meta["documents"]:
        rows.append([Paragraph(inline(str(x)), cellst) for x in (m["n"], m["titre"], m["nature"], m["emetteur"], m["date"], pages.get(m["n"], ""))])
    w = A4[0] - 3 * cm
    tb = Table(rows, colWidths=[w * x for x in (.055, .375, .145, .195, .15, .08)], repeatRows=1)
    tb.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), .5, colors.black), ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E7E6E6")),
                            ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    st += [tb, Spacer(1, 8), Paragraph(f"<i>{inline(meta['note'])}</i>", small)]
    for m in meta["documents"]:
        n = m["n"]; raw = (d / f"doc{n}.md").read_text(encoding="utf-8")
        titre, entete, *rest = raw.split("\n")
        h = Paragraph(f"<b>Document {n} — {inline(titre)}</b>", h1); h.docnum = n
        st += [PageBreak(), h, Paragraph(f"<i>{inline(entete.strip('*'))}</i>", small)]
        for b in [x.strip() for x in re.split(r"\n\s*\n", "\n".join(rest)) if x.strip()]:
            if b.startswith("### "): st.append(Paragraph(f"<b>{inline(b[4:])}</b>", h2))
            elif b.startswith("- ") or re.match(r"\d+\. ", b):
                num = not b.startswith("- ")
                items = [ListItem(Paragraph(inline(re.sub(r"^(- |\d+\. )", "", l)), left)) for l in b.split("\n")]
                st.append(ListFlowable(items, bulletType="1" if num else "bullet", start=1 if num else None, bulletFontName="Corps", bulletFontSize=9, leftIndent=14))
            elif b.startswith(">"):
                for p in [l.lstrip("> ").strip() for l in b.split("\n") if l.lstrip("> ").strip()]:
                    st.append(Paragraph(f"<i>{inline(p)}</i>", quote))
            elif "\n" in b: st += [Paragraph(inline(l), left) for l in b.split("\n")]
            elif re.fullmatch(r"\*\*[^*]+\*\*( \([^)]*\))?", b): st.append(Paragraph(inline(b), left))
            else: st.append(Paragraph(inline(b), body))
    return st

def build(pages):
    doc = D(out, pagesize=A4, leftMargin=1.5 * cm, rightMargin=1.5 * cm, topMargin=1.5 * cm, bottomMargin=1.5 * cm)
    doc.addPageTemplates([PageTemplate(frames=[Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height)])])
    doc.build(story(pages), canvasmaker=NC)

build({}); first = dict(starts); build(first)   # 2e passe : vrais numéros dans le sommaire
assert starts == first, "pagination instable entre les deux passes"
print("débuts de documents :", starts)
```

## Annexe C — `build/join.py` (assemblage des segments extraits)
Usage : `python3 -I build/join.py raw/docN.txt > docs/docN.body.md`, puis ajouter en tête les deux lignes d’en-tête (titre, ligne de métadonnées) et une ligne vide.
```python
"""Assemble les segments extraits (raw/docN.txt) en blocs au format docN.md.
Lignes : 'N. ¶ "texte"' (nouveau paragraphe), 'N. • "texte"' (nouvel élément de liste),
'N. "texte"' (suite du précédent), '### Intertitre', 'RAW texte' (bloc recopié tel quel, ex. [...]).
Les segments sont joints par une espace ; les éléments de liste consécutifs forment un seul bloc."""
import re, sys
blocks, cur, kind = [], None, None   # cur : liste de lignes du bloc courant
def flush():
    global cur, kind
    if cur: blocks.append("\n".join(cur))
    cur, kind = None, None
for line in open(sys.argv[1], encoding="utf-8"):
    line = line.rstrip("\n")
    if not line.strip(): continue
    if line.startswith("### "): flush(); blocks.append(line); continue
    if line.startswith("RAW "): flush(); blocks.append(line[4:]); continue
    m = re.match(r'^\s*\d+\.\s*(¶|•)?\s*"(.*)"\s*(\(\d+\))?\s*$', line)
    if not m: sys.exit(f"ligne non reconnue : {line!r}")
    mark, txt = m.group(1), m.group(2)
    if mark == "•":
        if kind != "list": flush(); cur, kind = [], "list"
        cur.append("- " + txt)
    elif mark == "¶" or cur is None:
        flush(); cur, kind = [txt], "para"
    else:
        cur[-1] += " " + txt
flush()
print("\n\n".join(blocks))
```
