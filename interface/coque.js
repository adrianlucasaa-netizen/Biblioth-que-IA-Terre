/* Coque commune à toutes les pages : thème clair ou sombre, page de garde de l'accueil,
   anciens liens du catalogue. JavaScript sans dépendance. */
(function () {
  'use strict';
  var racine = document.documentElement;

  // Anciens liens « index.html#type=… » : le catalogue a maintenant sa propre page.
  if (document.body.classList.contains('page-accueil') &&
      /(^#|&)(type|usage|ia|niveau|statut|tag|q)=/.test(location.hash)) {
    location.replace('catalogue.html' + location.hash);
    return;
  }

  // Thème : le choix est mémorisé dans ce navigateur (sinon, réglage du système).
  var bouton = document.getElementById('theme');
  function themeActuel() {
    var t = racine.getAttribute('data-theme');
    if (t) { return t; }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function majBouton() {
    var sombre = themeActuel() === 'dark';
    bouton.setAttribute('aria-pressed', sombre ? 'true' : 'false');
    bouton.setAttribute('aria-label', sombre ? 'Passer en thème clair' : 'Passer en thème sombre');
  }
  if (bouton) {
    bouton.addEventListener('click', function () {
      var t = themeActuel() === 'dark' ? 'light' : 'dark';
      racine.setAttribute('data-theme', t);
      try { localStorage.setItem('bib-theme', t); } catch (e) { /* navigation privée : sans conséquence */ }
      majBouton();
    });
    majBouton();
  }

  // Page de garde : affichée une fois par session, à l'ouverture de l'accueil.
  var garde = document.getElementById('garde');
  if (garde && racine.classList.contains('avec-garde')) {
    var fermer = function () {
      garde.classList.add('sortie');
      setTimeout(function () { racine.classList.remove('avec-garde'); garde.classList.remove('sortie'); }, 420);
    };
    Array.prototype.forEach.call(garde.querySelectorAll('[data-garde="accueil"]'), function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); fermer(); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && racine.classList.contains('avec-garde')) { fermer(); }
    });
    var premier = garde.querySelector('.cv-go');
    if (premier) { premier.focus(); }
  }
})();
