/* Formulaire « Proposer un projet ». Tout se prépare dans le navigateur ; rien n'est envoyé
   tant que le contributeur n'a pas cliqué sur « Envoyer ». Les marquages, grades, adresses,
   téléphones et clés sont retirés automatiquement (epurer.js) au lieu de bloquer le dépôt. */
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
    etiquette.appendChild(requis ? el('span', { classe: 'requis', texte: ' (obligatoire)' }) : el('span', { classe: 'facultatif', texte: ' (facultatif)' }));
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

  var piege = el('input', { type: 'text', id: 'site-web', name: 'site-web', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
  piege.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';

  var formulaire = el('form', { novalidate: 'novalidate', classe: 'formulaire' }, [
    section('1. L\'essentiel (obligatoire)', 'Cinq informations suffisent. Tout le reste est facultatif : la personne qui relira votre dépôt le complétera avec l\'aide de l\'IA.', [
      champ('titre', 'Titre', 'Court et parlant. Exemple : Synthèse de conférence.', ligne('titre'), true),
      champ('auteur', 'Pseudo ou prénom', 'Pas de nom complet, pas de grade ni d\'unité (ils seraient retirés).', ligne('auteur'), true),
      champ('resume', 'Résumé', 'Deux ou trois phrases : ce que fait le projet et pour qui.', zone(3), true),
      el('div', { classe: 'champ' }, [el('span', { classe: 'champ-titre', id: 'type-titre', texte: 'Type de projet' }), typeRadios]),
      el('div', { classe: 'champ' }, [el('span', { classe: 'champ-titre', id: 'ia-titre' }, [el('span', { texte: 'Testé avec' }), el('span', { classe: 'requis', texte: ' (obligatoire)' })]), el('p', { classe: 'champ-aide', texte: 'Cochez les IA avec lesquelles vous l\'avez testé. « Toutes les IA » si le projet est générique.' }), iaBoites])
    ]),
    section('2. Le contenu (obligatoire)', 'C\'est le cœur du projet : ce que les camarades vont copier.', [
      el('div', { classe: 'champ' }, [el('label', { 'for': 'contenu', classe: 'champ-titre' }, [contenuLabel, el('span', { classe: 'requis', texte: ' (obligatoire)' })]), contenuAide, contenuZone])
    ]),
    section('3. Vos engagements (obligatoire)', 'Vous certifiez avoir vérifié ces quatre points. Ils s\'affichent sur la fiche.', [attestations]),
    section('4. Pour compléter la fiche (facultatif)', 'Vous pouvez tout laisser vide. Ce que vous renseignez ici sera repris tel quel ; le reste sera proposé par la personne qui relit.', [
      el('div', { classe: 'ligne-deux' }, [
        champ('usage', 'Usage principal', '', liste(V.usage, '— à compléter par la relecture —')),
        champ('niveau', 'Niveau demandé à l\'utilisateur', '', liste(V.niveau, '— à compléter par la relecture —'))
      ]),
      el('div', { classe: 'ligne-deux' }, [
        champ('langue', 'Langue des consignes', '', liste(V.langue, '— à compléter par la relecture —')),
        champ('etiquettes', 'Mots-clés', 'Jusqu\'à 5, séparés par des virgules.', ligne('etiquettes'))
      ]),
      champ('probleme', 'Le problème résolu', 'Quelle situation, qu\'est-ce qui prend du temps ou fait des erreurs aujourd\'hui ?', zone(4)),
      champ('donne', 'Ce que l\'utilisateur donne', 'Exemple : ses notes brutes, collées telles quelles.', ligne('donne')),
      champ('recoit', 'Ce que l\'utilisateur reçoit', 'Exemple : une fiche structurée avec les idées clés.', ligne('recoit')),
      champ('limites', 'Limites connues', 'Ce que le projet ne fait pas ou fait mal. Une limite par ligne.', zone(3))
    ]),
    section('5. Comment ça marche, étape par étape (facultatif)', 'Vous pouvez laisser cette partie vide. Si vous la remplissez, comptez au moins 2 étapes (maximum ' + MAX_ETAPES + '). Pour chacune, dites qui agit : l\'utilisateur ou l\'IA. Une étape laissée entièrement vide est ignorée.', [etapesZone, boutonAjouter]),
    section('6. Exemples fictifs (facultatif, mais recommandé)', 'Un exemple d\'entrée et le résultat attendu permettent de tester le projet en deux minutes. Entièrement inventés.', [
      champ('exemple_entree', 'Exemple d\'entrée', '', zone(4, '', true)),
      champ('exemple_sortie', 'Résultat attendu', '', zone(4, '', true))
    ]),
    section('7. Contact (facultatif)', 'Une adresse pour que la personne qui relit puisse vous poser une question. Elle n\'est jamais publiée ni écrite dans la fiche.', [
      champ('contact', 'Votre adresse de messagerie', '', ligne('contact'))
    ]),
    piege,
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
    ['titre', 'resume', 'usage', 'niveau', 'langue', 'etiquettes', 'auteur', 'probleme', 'donne', 'recoit', 'limites', 'exemple_entree', 'exemple_sortie', 'contact'].forEach(function (id) {
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
  function etapeRemplie(e) {
    return !!(e.titre || e.entree || e.sortie || e.texte || e.exemple);
  }
  function verifierChamps(s) {
    var p = [];
    [['titre', 'Le titre'], ['auteur', 'Le pseudo ou prénom'], ['resume', 'Le résumé']].forEach(function (c) {
      if (!s[c[0]]) { p.push({ id: c[0], texte: c[1] + ' est à remplir.' }); }
    });
    if (!s.ia_compatibles.length) { p.push({ id: 'ia-titre', texte: 'Cochez au moins une IA.' }); }
    if (!s.contenu) { p.push({ id: 'contenu', texte: CONTENU[s.type][0] + ' est à remplir.' }); }
    // Partie 4 facultative : les étapes entièrement vides ont déjà été écartées.
    // Si l'on en remplit, chacune doit être complète, et il en faut au moins deux.
    s.etapes.forEach(function (e) {
      if (!e.titre || !e.entree || !e.sortie) { p.push({ id: null, texte: 'Étape ' + e.n + ' : le titre, l\'entrée et la sortie sont à remplir (ou videz entièrement l\'étape pour l\'ignorer).' }); }
    });
    if (s.etapes.length === 1) { p.push({ id: null, texte: 'Une seule étape est remplie : il en faut au moins deux pour le schéma. Ajoutez-en une, ou videz celle-ci pour passer cette partie.' }); }
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

  var LIBELLES_RETRAITS = { marquage: 'mention de protection', grade: 'grade (avec le nom qui suit)', courriel: 'adresse de messagerie', telephone: 'numéro de téléphone', cle: 'clé ou mot de passe', ip: 'adresse IP' };

  function phraseRetraits(retraits) {
    var l = Object.keys(LIBELLES_RETRAITS).filter(function (k) { return retraits[k]; }).map(function (k) { return retraits[k] + ' × ' + LIBELLES_RETRAITS[k]; });
    return l.length ? l : null;
  }

  function telecharger(json, nom) {
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: nom });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  // ---- écran plein cadre : chargement, puis réponse claire ---------------------
  var ecran = el('div', { id: 'ecran-envoi', classe: 'ecran-envoi', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ecran-titre', hidden: 'hidden' });
  document.body.appendChild(ecran);

  function montrerEcran(contenu) {
    ecran.textContent = '';
    ecran.appendChild(el('div', { classe: 'ecran-envoi-carte' }, contenu));
    ecran.hidden = false;
    var t = trouver('ecran-titre'); if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
  }
  function fermerEcran() { ecran.hidden = true; ecran.textContent = ''; }

  function ecranChargement() {
    montrerEcran([
      el('div', { classe: 'roue', 'aria-hidden': 'true' }),
      el('h2', { id: 'ecran-titre', texte: 'Envoi en cours…' }),
      el('p', { texte: 'Ne fermez pas cette page. Cela prend quelques secondes.' })
    ]);
  }

  function ecranSucces(titre) {
    try { localStorage.removeItem(CLE_BROUILLON); } catch (e) { /* ignoré */ }
    var accueil = el('a', { href: '../index.html', classe: 'bouton', texte: 'Retourner à l\'accueil' });
    var autre = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Proposer un autre projet' });
    autre.addEventListener('click', function () { reinitialiser(); fermerEcran(); window.scrollTo(0, 0); });
    montrerEcran([
      el('div', { classe: 'pastille pastille-ok', 'aria-hidden': 'true', texte: '✓' }),
      el('h2', { id: 'ecran-titre', texte: 'Votre proposition a été envoyée' }),
      el('p', { classe: 'ecran-gros', texte: '« ' + titre + ' » est bien arrivée. Merci !' }),
      el('p', { texte: 'Une personne de l\'équipe va la relire. Rien n\'est publié avant cette relecture.' }),
      el('div', { classe: 'actions-form' }, [accueil, autre])
    ]);
  }

  function ecranEchec(message, relancer, fichier) {
    var reessayer = el('button', { type: 'button', classe: 'bouton', texte: 'Réessayer' });
    reessayer.addEventListener('click', relancer);
    var tele = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Télécharger le fichier' });
    tele.addEventListener('click', fichier);
    var retour = el('button', { type: 'button', classe: 'bouton lien', texte: 'Revenir à ma proposition' });
    retour.addEventListener('click', fermerEcran);
    montrerEcran([
      el('div', { classe: 'pastille pastille-ko', 'aria-hidden': 'true', texte: '!' }),
      el('h2', { id: 'ecran-titre', texte: 'L\'envoi n\'a pas abouti' }),
      el('p', { classe: 'ecran-gros', texte: 'Votre proposition n\'est pas considérée comme envoyée.' }),
      el('p', { texte: message }),
      el('div', { classe: 'actions-form' }, [reessayer, tele, retour])
    ]);
  }

  function envoyer(s, contact, json, nom) {
    ecranChargement();
    var corps = JSON.stringify({ p: s, contact: contact, piege: valeur('site-web') });
    var termine = false;
    function echec(msg) {
      if (termine) { return; } termine = true;
      ecranEchec(msg, function () { envoyer(s, contact, json, nom); }, function () { telecharger(json, nom); });
    }
    var minuteurEnvoi = setTimeout(function () {
      echec('La réponse met trop de temps à arriver. Réessayez, ou téléchargez le fichier pour l\'envoyer autrement. ' + D.contact);
    }, 45000);
    fetch(D.boite, { method: 'POST', body: corps })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(minuteurEnvoi);
        if (termine) { return; }
        if (j && j.ok) { termine = true; ecranSucces(s.titre); }
        else { echec((j && j.erreur ? j.erreur + ' ' : '') + 'Réessayez dans un moment, ou téléchargez le fichier. ' + D.contact); }
      })
      .catch(function () {
        clearTimeout(minuteurEnvoi);
        echec('La réception n\'a pas pu être confirmée (réseau ou filtrage). Réessayez, ou téléchargez le fichier pour l\'envoyer autrement. ' + D.contact);
      });
  }

  function reinitialiser() {
    try { localStorage.removeItem(CLE_BROUILLON); } catch (e) { /* ignoré */ }
    formulaire.reset();
    contenuZone.value = '';
    etapesZone.textContent = '';
    ajouterEtape(); ajouterEtape();
    majContenu();
    erreursZone.hidden = true; resultat.hidden = true;
  }

  function montrerResultat(s, retraits, alertes, contact) {
    var json = JSON.stringify(s, null, 2);
    var nom = nomFichier(s);
    resultat.textContent = '';
    resultat.appendChild(el('h2', { texte: 'Votre proposition est prête' }));
    resultat.appendChild(el('p', { texte: 'Rien n\'a encore été envoyé. Voici exactement ce qui partira si vous cliquez sur « Envoyer » :' }));
    resultat.appendChild(el('details', { classe: 'details-json' }, [el('summary', { texte: 'Voir le contenu du fichier' }), el('pre', { classe: 'bloc-code', texte: json })]));

    var r = phraseRetraits(retraits);
    if (r) {
      var ul = el('ul'); r.forEach(function (t) { ul.appendChild(el('li', { texte: t })); });
      resultat.appendChild(el('div', { classe: 'avis-regle' }, [el('p', { texte: 'Pour que le dépôt reste utilisable par tous, ces éléments ont été retirés automatiquement du fichier (votre brouillon, lui, n\'a pas été modifié) :' }), ul]));
    }
    alertes.forEach(function (t) { resultat.appendChild(el('p', { classe: 'avis-regle', texte: 'À savoir : ' + t })); });

    var actions = el('div', { classe: 'actions-form' });
    if (D.boite) {
      var envoi = el('button', { type: 'button', classe: 'bouton', texte: 'Envoyer ma proposition' });
      envoi.addEventListener('click', function () { envoyer(s, contact, json, nom); });
      actions.appendChild(envoi);
    }
    var tele = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Télécharger le fichier ' + nom });
    tele.addEventListener('click', function () { telecharger(json, nom); });
    var copie = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Copier le contenu' });
    copie.addEventListener('click', function () { copier(json, copie); });
    actions.appendChild(tele); actions.appendChild(copie);
    resultat.appendChild(actions);
    resultat.appendChild(el('p', { classe: 'champ-aide', texte: D.boite ? 'Si l\'envoi échoue : ' + D.contact : D.contact }));
    resultat.hidden = false;
    erreursZone.hidden = true;
    resultat.scrollIntoView({ block: 'start' });
  }

  formulaire.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var brut = etat();
    brut.etapes = brut.etapes.map(function (e, i) { e.n = i + 1; return e; }).filter(etapeRemplie);
    var problemes = verifierChamps(brut);
    if (problemes.length) { montrerErreurs(problemes); return; }
    brut.etapes.forEach(function (e) { delete e.n; });
    var contact = valeur('contact');
    var ep = Epurer.proposition(brut);
    montrerResultat(ep.proposition, ep.retraits, ep.alertes, contact);
  });

  formulaire.addEventListener('input', sauver);
  formulaire.addEventListener('change', function (ev) {
    if (ev.target.name === 'type') { majContenu(); }
    sauver();
  });
  trouver('effacer').addEventListener('click', function () {
    if (!window.confirm('Effacer tout ce que vous avez saisi ?')) { return; }
    reinitialiser();
  });

  // ---- démarrage -------------------------------------------------------
  if (!restaurer()) { ajouterEtape(); ajouterEtape(); }
  majContenu();
})();
