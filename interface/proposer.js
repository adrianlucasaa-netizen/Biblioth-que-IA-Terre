/* Formulaire « Proposer un projet » : tout se passe dans le navigateur, rien n'est envoyé.
   À la fin, le contributeur télécharge un fichier .json qu'il transmet au responsable. */
(function () {
  'use strict';

  var D = JSON.parse(document.getElementById('donnees').textContent);
  var V = D.vocab;
  var RACINE = document.getElementById('formulaire');
  var CLE_BROUILLON = 'bibliotheque-ia-brouillon';
  var MAX_ETAPES = 8;

  var AIDE_TYPE = {
    prompt: 'Un texte à coller dans une conversation avec une IA.',
    skill: 'Une compétence packagée, que certains outils savent charger.',
    projet: 'Des consignes et des documents pour un espace de travail dédié.',
    script: 'Un petit programme Python qui travaille sur des fichiers.'
  };
  var CONTENU = {
    prompt: ['Le prompt', 'Collez ici le texte du prompt, tel que l\'utilisateur le collera dans l\'IA.'],
    projet: ['Les instructions du projet', 'Collez ici les instructions à donner à l\'IA (étape par étape, avec les garde-fous).'],
    skill: ['Le contenu du skill', 'Collez ici le contenu du fichier SKILL.md. L\'en-tête (nom, description) sera ajouté si vous l\'oubliez.'],
    script: ['Le code Python', 'Collez ici le code complet. Il ne doit utiliser aucun accès réseau ni lancer de commande système.']
  };

  // ---- petits outils DOM ---------------------------------------------------
  function el(nom, attrs, enfants) {
    var n = document.createElement(nom);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'classe') { n.className = attrs[k]; }
      else if (k === 'texte') { n.textContent = attrs[k]; }
      else { n.setAttribute(k, attrs[k]); }
    });
    (enfants || []).forEach(function (e) { if (e) { n.appendChild(e); } });
    return n;
  }
  function trouver(id) { return document.getElementById(id); }
  function valeur(id) { var n = trouver(id); return n ? n.value.trim() : ''; }

  function champ(id, titre, aide, controle, requis) {
    var etiquette = el('label', { 'for': id, classe: 'champ-titre' }, [el('span', { texte: titre })]);
    if (requis) { etiquette.appendChild(el('span', { classe: 'requis', texte: ' (obligatoire)' })); }
    var enfants = [etiquette];
    if (aide) { enfants.push(el('p', { classe: 'champ-aide', id: id + '-aide', texte: aide })); controle.setAttribute('aria-describedby', id + '-aide'); }
    controle.id = id;
    enfants.push(controle);
    return el('div', { classe: 'champ' }, enfants);
  }
  function ligne(id, ph) { return el('input', { type: 'text', classe: 'saisie', placeholder: ph || '' }); }
  function zone(rows, ph, mono) { return el('textarea', { classe: 'saisie' + (mono ? ' mono' : ''), rows: String(rows), placeholder: ph || '' }); }
  function liste(vocabulaire, vide) {
    var s = el('select', { classe: 'saisie' });
    if (vide) { s.appendChild(el('option', { value: '', texte: vide })); }
    Object.keys(vocabulaire).forEach(function (k) { s.appendChild(el('option', { value: k, texte: vocabulaire[k] })); });
    return s;
  }
  function section(titre, intro, enfants) {
    return el('fieldset', { classe: 'bloc-form' }, [el('legend', { texte: titre }), intro ? el('p', { classe: 'bloc-intro', texte: intro }) : null].concat(enfants));
  }

  // ---- construction du formulaire -----------------------------------------
  var typeRadios = el('div', { classe: 'choix-type', role: 'radiogroup', 'aria-labelledby': 'type-titre' });
  Object.keys(V.type).forEach(function (k, i) {
    var radio = el('input', { type: 'radio', name: 'type', value: k, id: 'type-' + k });
    if (i === 0) { radio.defaultChecked = true; radio.checked = true; }
    typeRadios.appendChild(el('label', { classe: 'carte-choix', 'for': 'type-' + k }, [radio, el('span', { classe: 'carte-choix-nom', texte: V.type[k] }), el('span', { classe: 'carte-choix-aide', texte: AIDE_TYPE[k] })]));
  });

  var iaBoites = el('div', { classe: 'choix-ia' });
  Object.keys(V.ia).forEach(function (k) {
    iaBoites.appendChild(el('label', { classe: 'case' }, [el('input', { type: 'checkbox', name: 'ia', value: k }), el('span', { texte: V.ia[k] })]));
  });

  var etapesZone = el('div', { id: 'etapes-form' });
  var boutonAjouter = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Ajouter une étape' });

  var attestations = el('div', { classe: 'attestations' });
  Object.keys(V.controles).forEach(function (k) {
    attestations.appendChild(el('label', { classe: 'case' }, [el('input', { type: 'checkbox', name: 'controles', value: k }), el('span', { texte: V.controles[k] })]));
  });

  var contenuLabel = el('span', { id: 'contenu-titre' });
  var contenuAide = el('p', { classe: 'champ-aide', id: 'contenu-aide' });
  var contenuZone = zone(14, '', true); contenuZone.id = 'contenu'; contenuZone.setAttribute('aria-describedby', 'contenu-aide');

  var erreursZone = el('div', { id: 'erreurs', classe: 'erreurs-form', role: 'alert', hidden: 'hidden' });
  var resultat = el('div', { id: 'resultat', classe: 'resultat-form', hidden: 'hidden' });

  var formulaire = el('form', { novalidate: 'novalidate', classe: 'formulaire' }, [
    section('1. L\'essentiel', 'Quelques mots pour que les camarades comprennent de quoi il s\'agit.', [
      champ('titre', 'Titre', 'Court et parlant. Exemple : Synthèse de conférence.', ligne('titre'), true),
      champ('resume', 'Résumé', 'Une ou deux phrases : ce que fait le projet et pour qui.', zone(3), true),
      el('div', { classe: 'champ' }, [el('span', { classe: 'champ-titre', id: 'type-titre', texte: 'Type de projet' }), typeRadios]),
      el('div', { classe: 'ligne-deux' }, [
        champ('usage', 'Usage principal', '', liste(V.usage), true),
        champ('niveau', 'Niveau demandé à l\'utilisateur', '', liste(V.niveau), true)
      ]),
      el('div', { classe: 'champ' }, [el('span', { classe: 'champ-titre', id: 'ia-titre', texte: 'Fonctionne avec' }), el('p', { classe: 'champ-aide', texte: 'Cochez les IA avec lesquelles vous l\'avez testé. « Toutes les IA » si le projet est générique.' }), iaBoites]),
      el('div', { classe: 'ligne-deux' }, [
        champ('langue', 'Langue des consignes', '', liste(V.langue), true),
        champ('etiquettes', 'Mots-clés', 'Jusqu\'à 5, séparés par des virgules. Exemple : conférence, notes, fiche.', ligne('etiquettes'))
      ]),
      champ('auteur', 'Auteur', 'Votre prénom ou un pseudo. Pas de nom complet, pas de grade ni d\'unité.', ligne('auteur'), true)
    ]),
    section('2. Ce que le projet résout', 'Écrivez comme si vous l\'expliquiez à un camarade qui débute.', [
      champ('probleme', 'Le problème résolu', 'Quelle situation, qu\'est-ce qui prend du temps ou fait des erreurs aujourd\'hui ?', zone(5), true),
      champ('donne', 'Ce que l\'utilisateur donne', 'Exemple : ses notes brutes, collées telles quelles.', ligne('donne'), true),
      champ('recoit', 'Ce que l\'utilisateur reçoit', 'Exemple : une fiche structurée avec les idées clés.', ligne('recoit'), true),
      champ('limites', 'Limites connues', 'Ce que le projet ne fait pas ou fait mal. Une limite par ligne. C\'est la partie la plus utile pour les autres.', zone(4))
    ]),
    section('3. Le contenu', 'C\'est le cœur du projet : ce que les camarades vont copier.', [
      el('div', { classe: 'champ' }, [el('label', { 'for': 'contenu', classe: 'champ-titre' }, [contenuLabel, el('span', { classe: 'requis', texte: ' (obligatoire)' })]), contenuAide, contenuZone])
    ]),
    section('4. Comment ça marche, étape par étape', 'Entre 2 et ' + MAX_ETAPES + ' étapes. Pour chacune, dites qui agit : l\'utilisateur ou l\'IA. Ces étapes deviennent le schéma interactif de la fiche.', [etapesZone, boutonAjouter]),
    section('5. Exemples fictifs (recommandé)', 'Un exemple d\'entrée et le résultat attendu permettent de tester le projet en deux minutes. Entièrement inventés.', [
      champ('exemple_entree', 'Exemple d\'entrée', '', zone(5, '', true)),
      champ('exemple_sortie', 'Résultat attendu', '', zone(5, '', true))
    ]),
    section('6. Vos engagements', 'Vous certifiez avoir vérifié ces quatre points. Ils s\'affichent sur la fiche.', [attestations]),
    erreursZone,
    el('div', { classe: 'actions-form' }, [
      el('button', { type: 'submit', classe: 'bouton', texte: 'Vérifier et préparer ma proposition' }),
      el('button', { type: 'button', classe: 'bouton lien', id: 'effacer', texte: 'Tout effacer' })
    ]),
    resultat
  ]);
  RACINE.appendChild(formulaire);

  // ---- étapes ---------------------------------------------------------------
  var compteurEtapes = 0;
  function ajouterEtape(e) {
    e = e || {};
    compteurEtapes += 1;
    var n = compteurEtapes;
    var nomQui = 'qui-' + n;
    var bloc = el('div', { classe: 'etape-form', 'data-etape': String(n) });
    var radios = el('div', { classe: 'choix-qui', role: 'radiogroup', 'aria-label': 'Qui agit dans cette étape' });
    [['vous', 'L\'utilisateur'], ['ia', 'L\'IA']].forEach(function (p) {
      var r = el('input', { type: 'radio', name: nomQui, value: p[0] });
      if ((e.qui || 'vous') === p[0]) { r.checked = true; }
      radios.appendChild(el('label', { classe: 'case' }, [r, el('span', { texte: p[1] })]));
    });
    var supprimer = el('button', { type: 'button', classe: 'bouton lien', texte: 'Supprimer cette étape' });
    supprimer.addEventListener('click', function () {
      if (etapesZone.children.length > 2) { etapesZone.removeChild(bloc); renumeroter(); sauver(); }
    });
    var t = ligne('', 'Exemple : Tri et plan'); t.setAttribute('data-champ', 'titre'); t.value = e.titre || '';
    var ent = ligne('', 'Ce qui entre dans cette étape'); ent.setAttribute('data-champ', 'entree'); ent.value = e.entree || '';
    var sor = ligne('', 'Ce qui en sort'); sor.setAttribute('data-champ', 'sortie'); sor.value = e.sortie || '';
    var tx = zone(2, 'Une ou deux phrases pour expliquer l\'étape (facultatif)'); tx.setAttribute('data-champ', 'texte'); tx.value = e.texte || '';
    var ex = zone(3, 'Un court exemple fictif de cette étape (facultatif)', true); ex.setAttribute('data-champ', 'exemple'); ex.value = e.exemple || '';
    function sousChamp(titre, c) { return el('label', { classe: 'sous-champ' }, [el('span', { texte: titre }), c]); }
    bloc.appendChild(el('div', { classe: 'etape-entete' }, [el('strong', { classe: 'etape-num' }), supprimer]));
    bloc.appendChild(sousChamp('Titre de l\'étape', t));
    bloc.appendChild(el('div', { classe: 'champ' }, [el('span', { classe: 'sous-titre', texte: 'Qui agit ?' }), radios]));
    bloc.appendChild(el('div', { classe: 'ligne-deux' }, [sousChamp('Entrée', ent), sousChamp('Sortie', sor)]));
    bloc.appendChild(sousChamp('Explication', tx));
    bloc.appendChild(sousChamp('Exemple fictif', ex));
    etapesZone.appendChild(bloc);
    renumeroter();
  }
  function renumeroter() {
    var blocs = etapesZone.children;
    for (var i = 0; i < blocs.length; i++) {
      blocs[i].querySelector('.etape-num').textContent = 'Étape ' + (i + 1);
      blocs[i].querySelector('.bouton.lien').hidden = blocs.length <= 2;
    }
    boutonAjouter.disabled = blocs.length >= MAX_ETAPES;
  }
  boutonAjouter.addEventListener('click', function () {
    if (etapesZone.children.length < MAX_ETAPES) { ajouterEtape(); sauver(); }
  });

  // ---- lecture / écriture de l'état ---------------------------------------
  function typeChoisi() { var r = formulaire.querySelector('input[name=type]:checked'); return r ? r.value : 'prompt'; }
  function coches(nom) {
    return Array.prototype.map.call(formulaire.querySelectorAll('input[name=' + nom + ']:checked'), function (c) { return c.value; });
  }
  function lireEtapes() {
    return Array.prototype.map.call(etapesZone.children, function (b) {
      var r = b.querySelector('input[type=radio]:checked');
      var o = { qui: r ? r.value : '' };
      Array.prototype.forEach.call(b.querySelectorAll('[data-champ]'), function (c) { o[c.getAttribute('data-champ')] = c.value.trim(); });
      return o;
    });
  }
  function etat() {
    return {
      format: 'bibliotheque-ia-terre/proposition', version: 1,
      titre: valeur('titre'), resume: valeur('resume'), type: typeChoisi(),
      usage: valeur('usage'), niveau: valeur('niveau'), langue: valeur('langue'),
      ia_compatibles: coches('ia'), etiquettes: valeur('etiquettes'), auteur: valeur('auteur'),
      probleme: valeur('probleme'), donne: valeur('donne'), recoit: valeur('recoit'), limites: valeur('limites'),
      contenu: contenuZone.value.trim(), etapes: lireEtapes(),
      exemple_entree: valeur('exemple_entree'), exemple_sortie: valeur('exemple_sortie'),
      controles: coches('controles')
    };
  }
  function appliquer(s) {
    ['titre', 'resume', 'usage', 'niveau', 'langue', 'etiquettes', 'auteur', 'probleme', 'donne', 'recoit', 'limites', 'exemple_entree', 'exemple_sortie'].forEach(function (id) {
      if (typeof s[id] === 'string' && trouver(id)) { trouver(id).value = s[id]; }
    });
    var r = formulaire.querySelector('input[name=type][value="' + s.type + '"]'); if (r) { r.checked = true; }
    formulaire.querySelectorAll('input[name=ia]').forEach(function (c) { c.checked = (s.ia_compatibles || []).indexOf(c.value) >= 0; });
    formulaire.querySelectorAll('input[name=controles]').forEach(function (c) { c.checked = (s.controles || []).indexOf(c.value) >= 0; });
    if (typeof s.contenu === 'string') { contenuZone.value = s.contenu; }
    etapesZone.textContent = '';
    var etapes = (s.etapes && s.etapes.length) ? s.etapes : [{}, {}];
    etapes.slice(0, MAX_ETAPES).forEach(ajouterEtape);
    while (etapesZone.children.length < 2) { ajouterEtape(); }
  }
  function majContenu() {
    var t = CONTENU[typeChoisi()];
    contenuLabel.textContent = t[0];
    contenuAide.textContent = t[1];
  }

  // ---- brouillon (confort : ce navigateur seulement) ---------------------
  var minuteur = null;
  function sauver() {
    clearTimeout(minuteur);
    minuteur = setTimeout(function () {
      try { localStorage.setItem(CLE_BROUILLON, JSON.stringify(etat())); } catch (e) { /* stockage indisponible : sans importance */ }
    }, 400);
  }
  function restaurer() {
    try {
      var brut = localStorage.getItem(CLE_BROUILLON);
      if (brut) { appliquer(JSON.parse(brut)); return true; }
    } catch (e) { /* ignoré */ }
    return false;
  }

  // ---- contrôles -----------------------------------------------------------
  var MARQUAGES = /(^|[^A-Za-zÀ-ÿ])(DIFFUSION\s+RESTREINTE|CONFIDENTIEL(?:\s+D[ÉE]FENSE)?|SECRET(?:\s+D[ÉE]FENSE)?|TR[ÈE]S\s+SECRET|NON\s+PROT[ÉE]G[ÉE]|RESTRICTED|NATO\s+(?:SECRET|CONFIDENTIAL|RESTRICTED))(?![A-Za-zÀ-ÿ])/;
  var COURRIEL = /[\w.+-]+@([\w-]+(?:\.[\w-]+)+)/g;
  var TELEPHONE = /(?:^|[^\d.])((?:\+33|0033|0)[1-9](?:[ .-]?\d{2}){4})(?!\d)/;
  var IP = /(?:^|[^\d])((?:\d{1,3}\.){3}\d{1,3})(?!\d)(?!\.\d)/;
  var SECRETS = /\b(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|xox[baprs]-[A-Za-z0-9-]{10,})\b|(api[_-]?key|jeton|token|mot[_ ]de[_ ]passe|password)\s*[:=]\s*["']?[A-Za-z0-9_\-]{12,}/i;
  var CODE_RESEAU = /^\s*(?:import|from)\s+(socket|urllib|requests|http|httpx|ftplib|smtplib|telnetlib|paramiko|aiohttp|websockets?|ssl|xmlrpc)\b/m;
  var CODE_DANGER = /\b(os\.system|subprocess|eval\s*\(|exec\s*\(|__import__|pickle|ctypes)\b/;

  function textes(s) {
    var t = [['Titre', s.titre], ['Résumé', s.resume], ['Mots-clés', s.etiquettes], ['Auteur', s.auteur], ['Problème résolu', s.probleme],
      ['Ce que l\'utilisateur donne', s.donne], ['Ce que l\'utilisateur reçoit', s.recoit], ['Limites', s.limites], ['Contenu', s.contenu],
      ['Exemple d\'entrée', s.exemple_entree], ['Résultat attendu', s.exemple_sortie]];
    s.etapes.forEach(function (e, i) {
      ['titre', 'entree', 'sortie', 'texte', 'exemple'].forEach(function (c) { t.push(['Étape ' + (i + 1) + ' (' + c + ')', e[c]]); });
    });
    return t;
  }
  function verifierSensibles(s) {
    var problemes = [];
    textes(s).forEach(function (p) {
      var nom = p[0], texte = p[1] || '';
      var m;
      if ((m = MARQUAGES.exec(texte))) { problemes.push(nom + ' : mention de protection « ' + m[2] + ' ». Aucun contenu protégé n\'a sa place ici.'); }
      var c; COURRIEL.lastIndex = 0;
      while ((c = COURRIEL.exec(texte))) {
        var dom = c[1].toLowerCase();
        if (!(/(^|\.)(example\.(com|org|net)|invalid|test|example)$/.test(dom))) { problemes.push(nom + ' : adresse électronique « ' + c[0] + ' ». Utilisez nom@example.org.'); }
      }
      if ((m = TELEPHONE.exec(texte))) { problemes.push(nom + ' : numéro de téléphone « ' + m[1] + ' ».'); }
      if ((m = IP.exec(texte)) && m[1].split('.').every(function (o) { return +o <= 255; })) { problemes.push(nom + ' : adresse IP « ' + m[1] + ' ».'); }
      if (SECRETS.test(texte)) { problemes.push(nom + ' : clé, jeton ou mot de passe apparent.'); }
    });
    if (s.type === 'script') {
      if (CODE_RESEAU.test(s.contenu)) { problemes.push('Contenu : le code contacte (ou peut contacter) un service extérieur. Ce n\'est pas autorisé.'); }
      if (CODE_DANGER.test(s.contenu)) { problemes.push('Contenu : instruction non autorisée dans un script partagé (commande système, évaluation de texte…).'); }
    }
    return problemes;
  }
  function verifierChamps(s) {
    var p = [];
    [['titre', 'Le titre'], ['resume', 'Le résumé'], ['auteur', 'L\'auteur'], ['probleme', 'Le problème résolu'], ['donne', 'Ce que l\'utilisateur donne'], ['recoit', 'Ce que l\'utilisateur reçoit']].forEach(function (c) {
      if (!s[c[0]]) { p.push({ id: c[0], texte: c[1] + ' est à remplir.' }); }
    });
    if (!s.ia_compatibles.length) { p.push({ id: 'ia-titre', texte: 'Cochez au moins une IA.' }); }
    if (!s.contenu) { p.push({ id: 'contenu', texte: CONTENU[s.type][0] + ' est à remplir.' }); }
    s.etapes.forEach(function (e, i) {
      if (!e.titre || !e.entree || !e.sortie) { p.push({ id: null, texte: 'Étape ' + (i + 1) + ' : le titre, l\'entrée et la sortie sont à remplir.' }); }
    });
    if (s.controles.length < 4) { p.push({ id: null, texte: 'Les quatre engagements doivent être cochés.' }); }
    if (s.etiquettes.split(',').filter(function (x) { return x.trim(); }).length > 5) { p.push({ id: 'etiquettes', texte: '5 mots-clés au maximum.' }); }
    return p;
  }

  function nomFichier(s) {
    var base = s.titre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'projet';
    return 'proposition-' + base + '.json';
  }

  function montrerErreurs(liste) {
    erreursZone.textContent = '';
    erreursZone.appendChild(el('p', { classe: 'erreurs-titre', texte: 'À corriger avant de continuer :' }));
    var ul = el('ul');
    liste.forEach(function (e) {
      var li = el('li');
      if (e.id && trouver(e.id)) {
        var a = el('a', { href: '#' + e.id, texte: e.texte });
        a.addEventListener('click', function (ev) { ev.preventDefault(); trouver(e.id).scrollIntoView({ block: 'center' }); if (trouver(e.id).focus) { trouver(e.id).focus(); } });
        li.appendChild(a);
      } else { li.textContent = e.texte; }
      ul.appendChild(li);
    });
    erreursZone.appendChild(ul);
    erreursZone.hidden = false;
    resultat.hidden = true;
    erreursZone.scrollIntoView({ block: 'center' });
  }

  function copier(texte, bouton) {
    function ok() { var avant = bouton.textContent; bouton.textContent = 'Copié'; setTimeout(function () { bouton.textContent = avant; }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(ok, function () { secours(texte, ok); });
    } else { secours(texte, ok); }
  }
  function secours(texte, ok) {
    var t = el('textarea', { 'aria-hidden': 'true' }); t.value = texte; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); ok(); } catch (e) { /* le texte reste affiché pour copie manuelle */ }
    document.body.removeChild(t);
  }

  function montrerResultat(s) {
    var json = JSON.stringify(s, null, 2);
    var nom = nomFichier(s);
    var telecharger = el('button', { type: 'button', classe: 'bouton', texte: 'Télécharger le fichier ' + nom });
    telecharger.addEventListener('click', function () {
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = el('a', { href: url, download: nom });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });
    var copie = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Copier le contenu' });
    copie.addEventListener('click', function () { copier(json, copie); });
    resultat.textContent = '';
    resultat.appendChild(el('h2', { texte: 'Votre proposition est prête' }));
    resultat.appendChild(el('p', { texte: 'Les contrôles automatiques sont passés. Rien n\'a été envoyé : tout est resté dans votre navigateur.' }));
    resultat.appendChild(el('ol', {}, [
      el('li', { texte: 'Téléchargez le fichier ci-dessous.' }),
      el('li', { texte: D.contact }),
      el('li', { texte: 'Il sera relu, puis publié sur le site avec le statut « proposé ».' })
    ]));
    resultat.appendChild(el('div', { classe: 'actions-form' }, [telecharger, copie]));
    resultat.appendChild(el('details', { classe: 'details-json' }, [el('summary', { texte: 'Voir le contenu du fichier' }), el('pre', { classe: 'bloc-code', texte: json })]));
    resultat.hidden = false;
    erreursZone.hidden = true;
    resultat.scrollIntoView({ block: 'start' });
  }

  formulaire.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var s = etat();
    var problemes = verifierChamps(s).concat(verifierSensibles(s).map(function (t) { return { id: null, texte: t }; }));
    if (problemes.length) { montrerErreurs(problemes); return; }
    montrerResultat(s);
  });

  formulaire.addEventListener('input', sauver);
  formulaire.addEventListener('change', function (ev) {
    if (ev.target.name === 'type') { majContenu(); }
    sauver();
  });
  trouver('effacer').addEventListener('click', function () {
    if (!window.confirm('Effacer tout ce que vous avez saisi ?')) { return; }
    try { localStorage.removeItem(CLE_BROUILLON); } catch (e) { /* ignoré */ }
    formulaire.reset();
    contenuZone.value = '';
    etapesZone.textContent = '';
    ajouterEtape(); ajouterEtape();
    majContenu();
    erreursZone.hidden = true; resultat.hidden = true;
  });

  // ---- démarrage -------------------------------------------------------
  if (!restaurer()) { ajouterEtape(); ajouterEtape(); }
  majContenu();
})();
