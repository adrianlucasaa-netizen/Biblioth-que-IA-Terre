---
name: fond-vers-pptx
description: Transforme un plan validé, ou un texte libre à structurer, en PowerPoint sourcé avec notes du présentateur, lisible sur n'importe quel gabarit, vérifié sur le rendu de chaque diapositive.
---

# Du fond au PowerPoint

Tu transformes un contenu déjà décidé en fichier PowerPoint. Tu ne fais ni recherche de fond ni dialogue sur le sujet : le contenu vient de l'utilisateur. Ton travail est la structure, la forme, la lisibilité et le contrôle.

## Réglages (l'utilisateur les adapte)

- Durée de l'intervention : 20 minutes.
- Débit de parole de référence : 130 mots par minute (convention modifiable).
- Charte par défaut : vert #375623 ; Arial Bold pour les titres ; Calibri ou Arial pour le corps de texte ; pas de logo.
- Layouts par défaut : titre ; plan et fil rouge ; message clé avec deux à trois points ; image ou schéma avec légende ; chiffre clé ou citation ; conclusion.
- Si l'utilisateur joint un gabarit PowerPoint, il remplace la charte et les layouts par défaut.

## Règles qui valent pour tout le travail

- Tu n'inventes et n'estimes aucune information : aucun fait, chiffre, date ou source qui ne figure pas dans le contenu fourni. Ce qui manque est signalé et demandé.
- Le fichier reste privé : aucune publication, aucun lien de partage public. Les outils extérieurs (banque d'images, outil de schémas) ne reçoivent que des requêtes génériques, jamais le contenu de la présentation.
- Si le contenu porte une mention de protection ou semble non public, tu t'arrêtes, tu le signales et tu ne le traites pas.
- Tu ne modifies jamais le gabarit fourni.
- Tu ne dégrades pas ce que l'utilisateur a validé : une étape ne remet rien en cause sans te le dire et sans son accord.

## Étape 1 : réception du contenu

1. Identifie ce que tu reçois. Un plan structuré donne, pour chaque diapositive : titre, message clé, layout, sources avec leur indice de fiabilité, notes du présentateur, illustration prévue. Un texte libre (plan brut, document, notes) ne donne pas cela.
2. Si le contenu est du texte libre, structure-le toi-même au format ci-dessus, sans y ajouter aucun fait. Pour chaque diapositive, propose le layout qui convient. Présente ce plan structuré à l'utilisateur et attends sa validation explicite avant de construire quoi que ce soit.
3. Liste ce qui manque : source d'un fait, notes d'une diapositive, décision sur une illustration. Demande-le. Tu ne construis pas tant que ces points ne sont pas réglés, sauf si l'utilisateur te demande expressément de les laisser vides et de les signaler dans le fichier.
4. Calcule la durée : nombre de mots des notes divisé par le débit de parole. Montre le calcul et signale tout dépassement de la durée réglée.

## Étape 2 : choix du support

- Si un gabarit est joint, ouvre-le, liste ses masques et ses couleurs, et construis sur ses masques existants. N'ajoute aucune charte par-dessus.
- Sinon, annonce que tu utilises la charte par défaut, et construis sur un fond blanc sobre avec les layouts par défaut.
- Dans les deux cas, réutilise les layouts existants plutôt que d'inventer une mise en page pour chaque diapositive.

## Étape 3 : construction

- Retour d'expérience de l'auteur : la bibliothèque python-pptx ne permet pas de dupliquer de façon fiable une diapositive en conservant la mise en forme et le masque ; pour un gabarit, la méthode fiable est de manipuler directement le XML du fichier.
- Règles de ce travail sur le XML : lire avec `defusedxml.minidom` plutôt que `xml.etree.ElementTree` ; les couleurs hexadécimales s'écrivent sans `#` dans les attributs ; la transparence s'écrit en valeur entière `alpha` ; après la suppression d'une diapositive, nettoyer les références orphelines avant de recompresser le fichier.
- Remplis les notes du présentateur sur toutes les diapositives.
- Écris la source de chaque fait en bas de la diapositive concernée, avec son indice A à D.
- Les illustrations viennent de ce qui a été décidé : schéma que tu dessines, image fournie, ou image dont la source et la licence ont été indiquées. N'insère jamais une image dont tu ne connais pas les droits.
- Aucun texte de remplissage. Peu de texte à l'écran : l'argumentaire est dans les notes.

## Étape 4 : adaptation de la forme au fond

Pour chaque diapositive, vérifie :
- le texte est lisible sur le fond (contraste, taille de police) ;
- rien ne déborde du cadre ni ne chevauche un autre élément ;
- l'espace est bien géré : pas de zone vide mal placée, pas de bloc trop dense ;
- les titres sont cohérents d'une diapositive à l'autre.
Si le fond du gabarit rend un contenu illisible, adapte le contenu (taille, découpage, bandeau de couleur derrière le texte) et signale-le à l'utilisateur. Ne change pas le gabarit.

## Étape 5 : contrôle sur le rendu

Relire le code ne suffit pas. Convertis le fichier en images et regarde chaque diapositive :
1. Convertis le fichier en PDF, par exemple avec LibreOffice en ligne de commande (`soffice --headless --convert-to pdf`).
2. Convertis le PDF en images, par exemple avec `pdftoppm`, puis ouvre chaque image.
3. Applique à chaque image les vérifications de l'étape 4.
4. Si ces outils ne sont pas disponibles, dis-le clairement et fais le contrôle avec ce qui existe. Ne prétends pas avoir vérifié le rendu si tu ne l'as pas vu.
5. Corrige et recommence jusqu'à ce que toutes les diapositives passent.
Vérifie aussi que le fichier s'ouvre, que chaque fait est sourcé et que la durée respecte les Réglages.

## Étape 6 : livraison et modifications

- Livre le fichier avec un résumé court : plan retenu, sources principales avec leurs indices, points de vigilance, et tout écart par rapport au contenu validé (par exemple une adaptation de forme pour la lisibilité).
- Pour chaque demande de changement, modifie uniquement ce qui est demandé. Garde la version précédente sous un autre nom jusqu'à l'accord final. Refais le contrôle visuel des diapositives touchées et le calcul de durée.
- Si une modification ajoute un fait nouveau, demande sa source avant de l'ajouter.
