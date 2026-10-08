/* Catalogue : filtres à facettes, recherche et cartes. JavaScript sans dépendance. */
(function () {
  'use strict';

  var D = JSON.parse(document.getElementById('donnees').textContent);
  var VOC = D.vocab;
  var PROJETS = D.projets;
  var GROUPES = [
    { cle: 'type', titre: 'Type' },
    { cle: 'usage', titre: 'Usage' },
    { cle: 'ia', titre: 'Compatible avec' },
    { cle: 'niveau', titre: 'Niveau' },
    { cle: 'statut', titre: 'Statut' }
  ];
  var CLES = ['type', 'usage', 'ia', 'niveau', 'statut', 'tag', 'q'];
  var etat = { type: '', usage: '', ia: '', niveau: '', statut: '', tag: '', q: '' };
  var mobile = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
  var ouverts = { type: !mobile, usage: !mobile, ia: !mobile, niveau: false, statut: !mobile };
  var focusARendre = null;

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
      if (GROUPES.some(function (g) { return g.cle === k; }) && v && !(v in VOC[k])) { v = ''; }
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

  function basculer(cle, valeur) {
    etat[cle] = etat[cle] === valeur ? '' : valeur;
    focusARendre = { cle: cle, valeur: valeur };
    majTout();
  }

  function libelleFiltre(cle, valeur) {
    if (cle === 'tag') { return 'étiquette : ' + valeur; }
    if (cle === 'q') { return '« ' + valeur + ' »'; }
    return VOC[cle][valeur];
  }

  function dessinerFiltres() {
    var zone = document.getElementById('filtres');
    zone.textContent = '';
    GROUPES.forEach(function (g) {
      var valeurs = Object.keys(VOC[g.cle]).filter(function (v) { return !(g.cle === 'ia' && v === 'toutes'); });
      var liste = el('div', { classe: 'valeurs' });
      valeurs.forEach(function (v) {
        var n = compter(g.cle, v);
        var actif = etat[g.cle] === v;
        var b = el('button', {
          type: 'button', classe: 'valeur-filtre', 'aria-pressed': actif ? 'true' : 'false',
          'data-cle': g.cle, 'data-valeur': v
        }, [
          el('span', { texte: VOC[g.cle][v] }),
          el('span', { classe: 'nombre', texte: String(n) })
        ]);
        if (n === 0 && !actif) { b.disabled = true; }
        b.addEventListener('click', function () { basculer(g.cle, v); });
        liste.appendChild(b);
      });
      var d = el('details', { classe: 'groupe-filtre' }, [el('summary', { texte: g.titre }), liste]);
      if (ouverts[g.cle]) { d.open = true; }
      d.addEventListener('toggle', function () { ouverts[g.cle] = d.open; });
      zone.appendChild(d);
    });
  }

  function dessinerCartes(liste) {
    var zone = document.getElementById('cartes');
    zone.textContent = '';
    liste.forEach(function (p) {
      var puces = el('div', { classe: 'puces' }, p.ia.map(function (i) { return el('span', { classe: 'puce', texte: VOC.ia[i] }); }));
      var carte = el('a', { classe: 'carte', href: 'projets/' + p.id + '.html' }, [
        el('div', { classe: 'carte-tete' }, [
          el('span', { classe: 'etiquette-mono', texte: VOC.type[p.type] }),
          el('span', { classe: 'statut statut-' + p.statut, texte: VOC.statut[p.statut] })
        ]),
        el('h2', { texte: p.titre }),
        el('p', { texte: p.resume }),
        puces,
        el('div', { classe: 'carte-pied', texte: VOC.usage[p.usage] + ' · Niveau : ' + VOC.niveau[p.niveau] })
      ]);
      zone.appendChild(carte);
    });
  }

  function dessinerPucesActives() {
    var zone = document.getElementById('puces-actives');
    zone.textContent = '';
    CLES.forEach(function (k) {
      if (!etat[k] || k === 'q') { return; }
      var b = el('button', { type: 'button', classe: 'puce-active', 'aria-label': 'Retirer le filtre ' + libelleFiltre(k, etat[k]) }, [
        el('span', { texte: libelleFiltre(k, etat[k]) }), el('span', { texte: '×', 'aria-hidden': 'true' })
      ]);
      b.style.border = '0';
      b.style.cursor = 'pointer';
      b.addEventListener('click', function () { etat[k] = ''; majTout(); });
      zone.appendChild(b);
    });
  }

  function majTout() {
    var liste = PROJETS.filter(function (p) { return correspond(p, etat); });
    liste.sort(function (a, b) {
      var d = D.ordre_statut[a.statut] - D.ordre_statut[b.statut];
      return d !== 0 ? d : a.titre.localeCompare(b.titre, 'fr');
    });
    dessinerFiltres();
    dessinerCartes(liste);
    dessinerPucesActives();
    document.getElementById('compteur').textContent =
      liste.length + (liste.length > 1 ? ' projets affichés' : ' projet affiché') + ' sur ' + PROJETS.length;
    document.getElementById('vide').hidden = liste.length !== 0;
    var actifs = CLES.some(function (k) { return etat[k]; });
    document.getElementById('reinitialiser').hidden = !actifs;
    var champ = document.getElementById('recherche');
    if (champ.value !== etat.q) { champ.value = etat.q; }
    ecrireHash();
    if (focusARendre) {
      var cible = document.querySelector('.valeur-filtre[data-cle="' + focusARendre.cle + '"][data-valeur="' + focusARendre.valeur + '"]');
      if (cible && !cible.disabled) { cible.focus(); }
      focusARendre = null;
    }
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
