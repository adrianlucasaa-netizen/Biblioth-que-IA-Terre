/* Catalogue : recherche, puces de type, listes de filtres et cartes. JavaScript sans dépendance.
   L'état des filtres est gardé dans l'adresse (#type=skill&usage=…) : un lien partagé rouvre la même sélection. */
(function () {
  'use strict';

  var D = JSON.parse(document.getElementById('donnees').textContent);
  var VOC = D.vocab;
  var PROJETS = D.projets;
  var LISTES = [
    { cle: 'usage', tous: 'Tous les usages' },
    { cle: 'ia', tous: 'Toutes les IA' },
    { cle: 'niveau', tous: 'Tous niveaux' },
    { cle: 'statut', tous: 'Tous statuts' }
  ];
  var CLES = ['type', 'usage', 'ia', 'niveau', 'statut', 'tag', 'q'];
  var FILTRES = ['type', 'usage', 'ia', 'niveau', 'statut'];
  var etat = { type: '', usage: '', ia: '', niveau: '', statut: '', tag: '', q: '' };

  function normaliser(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  PROJETS.forEach(function (p) {
    var morceaux = [p.titre, p.resume, VOC.type[p.type], VOC.usage[p.usage], p.etiquettes.join(' ')];
    p.ia.forEach(function (i) { morceaux.push(VOC.ia[i]); });
    p.recherche = normaliser(morceaux.join(' '));
  });

  function el(nom, attrs, enfants) {
    var n = document.createElement(nom);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'texte') { n.textContent = attrs[k]; }
      else if (k === 'classe') { n.className = attrs[k]; }
      else { n.setAttribute(k, attrs[k]); }
    });
    (enfants || []).forEach(function (c) { if (c) { n.appendChild(c); } });
    return n;
  }

  function correspond(p, e) {
    if (e.type && p.type !== e.type) { return false; }
    if (e.usage && p.usage !== e.usage) { return false; }
    if (e.niveau && p.niveau !== e.niveau) { return false; }
    if (e.statut && p.statut !== e.statut) { return false; }
    if (e.ia && p.ia.indexOf(e.ia) < 0 && p.ia.indexOf('toutes') < 0) { return false; }
    if (e.tag && p.etiquettes.indexOf(e.tag) < 0) { return false; }
    if (e.q) {
      var mots = normaliser(e.q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < mots.length; i++) {
        if (p.recherche.indexOf(mots[i]) < 0) { return false; }
      }
    }
    return true;
  }

  // Nombre de projets si l'on choisissait cette valeur, les autres filtres restant en place.
  function compter(cle, valeur) {
    var e = {};
    CLES.forEach(function (k) { e[k] = etat[k]; });
    e[cle] = valeur;
    return PROJETS.filter(function (p) { return correspond(p, e); }).length;
  }

  function lireHash() {
    var params = new URLSearchParams(location.hash.replace(/^#/, ''));
    CLES.forEach(function (k) {
      var v = params.get(k) || '';
      if (FILTRES.indexOf(k) >= 0 && v && !(v in VOC[k])) { v = ''; }
      etat[k] = v;
    });
  }

  function ecrireHash() {
    var params = new URLSearchParams();
    CLES.forEach(function (k) { if (etat[k]) { params.set(k, etat[k]); } });
    var s = params.toString();
    try {
      history.replaceState(null, '', s ? '#' + s : location.pathname + location.search);
    } catch (e) { /* certains navigateurs refusent en local : sans conséquence */ }
  }

  function dessinerPucesType() {
    var zone = document.getElementById('puces-type');
    var focus = document.activeElement && zone.contains(document.activeElement) ? document.activeElement.getAttribute('data-valeur') : null;
    zone.textContent = '';
    var valeurs = [''].concat(Object.keys(VOC.type));
    valeurs.forEach(function (v) {
      var actif = etat.type === v;
      var b = el('button', { type: 'button', classe: 'chip', 'aria-pressed': actif ? 'true' : 'false', 'data-valeur': v });
      if (v) {
        b.style.setProperty('--tc', 'var(--t-' + v + ')');
        b.appendChild(el('i', { 'aria-hidden': 'true' }));
      }
      b.appendChild(el('span', { texte: v ? VOC.type[v] : 'Tous' }));
      b.appendChild(el('span', { classe: 'chip-n', texte: String(compter('type', v)) }));
      b.addEventListener('click', function () { etat.type = v; majTout(); });
      zone.appendChild(b);
    });
    if (focus !== null) {
      var cible = zone.querySelector('[data-valeur="' + focus + '"]');
      if (cible) { cible.focus(); }
    }
  }

  function dessinerListes() {
    var zone = document.getElementById('selecteurs');
    var focus = document.activeElement && zone.contains(document.activeElement) ? document.activeElement.id : null;
    zone.textContent = '';
    LISTES.forEach(function (g) {
      var s = el('select', { id: 'filtre-' + g.cle, 'aria-label': g.tous });
      s.appendChild(el('option', { value: '', texte: g.tous }));
      Object.keys(VOC[g.cle]).forEach(function (v) {
        if (g.cle === 'ia' && v === 'toutes') { return; }
        var n = compter(g.cle, v);
        var o = el('option', { value: v, texte: VOC[g.cle][v] + ' (' + n + ')' });
        if (n === 0 && etat[g.cle] !== v) { o.disabled = true; }
        s.appendChild(o);
      });
      s.value = etat[g.cle];
      if (etat[g.cle]) { s.className = 'actif'; }
      s.addEventListener('change', function () { etat[g.cle] = s.value; majTout(); });
      zone.appendChild(s);
    });
    if (focus) {
      var cible = document.getElementById(focus);
      if (cible) { cible.focus(); }
    }
  }

  function pill(classe, texte) { return el('span', { classe: 'pill ' + classe, texte: texte }); }

  function dessinerCartes(liste) {
    var zone = document.getElementById('cartes');
    zone.textContent = '';
    liste.forEach(function (p) {
      var meta = el('span', { classe: 'meta' }, [
        el('span', { classe: 'statut statut-' + p.statut, texte: VOC.statut[p.statut] }),
        pill('plain', 'v' + p.version)
      ].concat(p.ia.map(function (i) { return pill('plain', VOC.ia[i]); })).concat([
        el('span', { classe: 'count', texte: 'Niveau : ' + VOC.niveau[p.niveau] })
      ]));
      var carte = el('a', { classe: 'tool', href: 'projets/' + p.id + '.html' }, [
        el('span', { classe: 'row' }, [pill('type', VOC.type[p.type]), pill('plain', VOC.usage[p.usage])]),
        el('span', { classe: 't', texte: p.titre }),
        el('span', { classe: 'r', texte: p.resume }),
        meta
      ]);
      carte.style.setProperty('--tc', 'var(--t-' + p.type + ')');
      zone.appendChild(carte);
    });
  }

  function libelleFiltre(cle, valeur) {
    if (cle === 'tag') { return 'Étiquette : ' + valeur; }
    return VOC[cle][valeur];
  }

  function dessinerPucesActives() {
    var zone = document.getElementById('puces-actives');
    zone.textContent = '';
    ['tag'].concat(FILTRES).forEach(function (k) {
      if (!etat[k]) { return; }
      var b = el('button', { type: 'button', classe: 'chip chip-active', 'aria-label': 'Retirer le filtre ' + libelleFiltre(k, etat[k]) }, [
        el('span', { texte: libelleFiltre(k, etat[k]) }), el('span', { texte: '×', 'aria-hidden': 'true' })
      ]);
      b.addEventListener('click', function () { etat[k] = ''; majTout(); });
      zone.appendChild(b);
    });
    var actifs = CLES.some(function (k) { return etat[k]; });
    document.getElementById('puces-actives-ligne').hidden = !actifs;
  }

  function majTout() {
    var liste = PROJETS.filter(function (p) { return correspond(p, etat); });
    liste.sort(function (a, b) {
      var d = D.ordre_statut[a.statut] - D.ordre_statut[b.statut];
      return d !== 0 ? d : a.titre.localeCompare(b.titre, 'fr');
    });
    dessinerPucesType();
    dessinerListes();
    dessinerCartes(liste);
    dessinerPucesActives();
    document.getElementById('compteur').textContent =
      liste.length + (liste.length > 1 ? ' solutions' : ' solution') + ' sur ' + PROJETS.length;
    document.getElementById('vide').hidden = liste.length !== 0;
    var champ = document.getElementById('recherche');
    if (champ.value !== etat.q) { champ.value = etat.q; }
    ecrireHash();
  }

  document.getElementById('recherche').addEventListener('input', function (e) {
    etat.q = e.target.value;
    majTout();
  });
  document.getElementById('reinitialiser').addEventListener('click', function () {
    CLES.forEach(function (k) { etat[k] = ''; });
    majTout();
  });
  window.addEventListener('hashchange', function () { lireHash(); majTout(); });

  lireHash();
  majTout();
})();
