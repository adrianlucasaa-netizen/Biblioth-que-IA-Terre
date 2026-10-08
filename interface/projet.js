/* Page projet : onglets, schéma de fonctionnement, installation par IA, visionneuse de fichiers. */
(function () {
  'use strict';

  var D = JSON.parse(document.getElementById('donnees').textContent);
  var SVG = 'http://www.w3.org/2000/svg';

  function el(nom, attrs, enfants) {
    var n = document.createElement(nom);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'texte') { n.textContent = attrs[k]; }
      else if (k === 'classe') { n.className = attrs[k]; }
      else if (k === 'html') { n.innerHTML = attrs[k]; }
      else { n.setAttribute(k, attrs[k]); }
    });
    (enfants || []).forEach(function (c) { if (c) { n.appendChild(c); } });
    return n;
  }

  function taille(octets) {
    if (octets < 1000) { return octets + ' o'; }
    return (octets / 1000).toFixed(1).replace('.', ',') + ' Ko';
  }

  function copier(texte, zoneRetour) {
    function dire(message) {
      zoneRetour.textContent = message;
      setTimeout(function () { zoneRetour.textContent = ''; }, 2500);
    }
    function repli() {
      var t = document.createElement('textarea');
      t.value = texte;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(t);
      dire(ok ? 'Copié.' : 'Copie impossible : sélectionnez le texte à la main.');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texte).then(function () { dire('Copié.'); }, repli);
    } else {
      repli();
    }
  }

  /* ---------- Onglets ---------- */
  var boutons = Array.prototype.slice.call(document.querySelectorAll('[data-onglet]'));
  var panneaux = {};
  boutons.forEach(function (b) { panneaux[b.getAttribute('data-onglet')] = document.getElementById('panneau-' + b.getAttribute('data-onglet')); });

  function afficher(cle, deplacerFocus) {
    if (!panneaux[cle]) { cle = 'fiche'; }
    boutons.forEach(function (b) {
      var actif = b.getAttribute('data-onglet') === cle;
      b.setAttribute('aria-selected', actif ? 'true' : 'false');
      b.tabIndex = actif ? 0 : -1;
      if (actif && deplacerFocus) { b.focus(); }
    });
    Object.keys(panneaux).forEach(function (k) {
      panneaux[k].hidden = k !== cle;
      panneaux[k].classList.toggle('actif', k === cle);
    });
    try { history.replaceState(null, '', '#' + cle); } catch (e) { /* sans conséquence */ }
  }

  boutons.forEach(function (b, i) {
    b.addEventListener('click', function () { afficher(b.getAttribute('data-onglet'), false); });
    b.addEventListener('keydown', function (e) {
      var cible = null;
      if (e.key === 'ArrowRight') { cible = boutons[(i + 1) % boutons.length]; }
      else if (e.key === 'ArrowLeft') { cible = boutons[(i - 1 + boutons.length) % boutons.length]; }
      else if (e.key === 'Home') { cible = boutons[0]; }
      else if (e.key === 'End') { cible = boutons[boutons.length - 1]; }
      if (cible) { e.preventDefault(); afficher(cible.getAttribute('data-onglet'), true); }
    });
  });
  window.addEventListener('hashchange', function () { afficher(location.hash.replace(/^#/, ''), false); });

  /* ---------- Schéma de fonctionnement ---------- */
  function dessinerSchema() {
    var zone = document.getElementById('schema');
    if (!zone || !D.etapes.length) { return; }
    var courant = 0;
    var rangee = el('div', { classe: 'etapes', role: 'group', 'aria-label': 'Étapes' });
    var detail = el('div', { classe: 'detail-etape', 'aria-live': 'polite' });
    var commandes = el('div', { classe: 'meta-ligne' });
    zone.appendChild(rangee);
    zone.appendChild(detail);
    zone.appendChild(commandes);

    function fleche() {
      var s = document.createElementNS(SVG, 'svg');
      s.setAttribute('width', '22'); s.setAttribute('height', '22'); s.setAttribute('viewBox', '0 0 22 22');
      s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '2');
      s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
      var p = document.createElementNS(SVG, 'path');
      p.setAttribute('d', 'M4 11h14M12 5l6 6-6 6');
      s.appendChild(p);
      return s;
    }

    function maj() {
      rangee.textContent = '';
      D.etapes.forEach(function (e, i) {
        var ia = e.qui === 'ia';
        var b = el('button', { type: 'button', classe: 'etape-bouton', 'aria-pressed': i === courant ? 'true' : 'false' }, [
          el('span', { classe: 'num', texte: 'Étape ' + (i + 1) }),
          el('span', { classe: 'nom', texte: e.titre }),
          el('span', { classe: 'qui ' + (ia ? 'qui-ia' : 'qui-vous'), texte: ia ? "Fait par l'IA" : 'Fait par vous' })
        ]);
        b.addEventListener('click', function () { courant = i; maj(); b.focus(); });
        var bloc = el('div', { classe: 'etape' }, [b]);
        if (i < D.etapes.length - 1) { bloc.appendChild(fleche()); }
        rangee.appendChild(bloc);
      });
      var e = D.etapes[courant];
      detail.textContent = '';
      detail.appendChild(el('h3', { texte: 'Étape ' + (courant + 1) + ' : ' + e.titre }));
      if (e.texte_html) { detail.appendChild(el('p', { html: e.texte_html })); }
      detail.appendChild(el('div', { classe: 'duo' }, [
        el('div', {}, [el('span', { classe: 'etiquette-mono', texte: 'Entrée' }), el('span', { texte: e.entree })]),
        el('div', {}, [el('span', { classe: 'etiquette-mono', texte: 'Sortie' }), el('span', { texte: e.sortie })])
      ]));
      if (e.exemple) {
        detail.appendChild(el('div', {}, [
          el('span', { classe: 'etiquette-mono', texte: 'Exemple fictif' }),
          el('pre', { classe: 'bloc-code', texte: e.exemple })
        ]));
      }
      commandes.textContent = '';
      var prec = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Étape précédente' });
      var suiv = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Étape suivante' });
      prec.disabled = courant === 0;
      suiv.disabled = courant === D.etapes.length - 1;
      prec.addEventListener('click', function () { courant--; maj(); });
      suiv.addEventListener('click', function () { courant++; maj(); });
      commandes.appendChild(prec);
      commandes.appendChild(suiv);
    }
    maj();
  }

  /* ---------- Installation ---------- */
  function dessinerInstallation() {
    var zone = document.getElementById('installation');
    if (!zone || !D.installation) { return; }
    var inst = D.installation;
    var choix = inst.ias.length ? inst.ias[0].id : '';
    var pastilles = el('div', { classe: 'pastilles', role: 'group', 'aria-label': 'Choix de l\'IA' });
    var contenu = el('div');
    zone.appendChild(el('p', { classe: 'doux', texte: "Choisissez l'outil que vous utilisez." }));
    zone.appendChild(pastilles);
    zone.appendChild(contenu);

    function maj() {
      pastilles.textContent = '';
      inst.ias.forEach(function (ia) {
        var b = el('button', { type: 'button', classe: 'pastille', 'aria-pressed': ia.id === choix ? 'true' : 'false', texte: ia.libelle });
        b.addEventListener('click', function () { choix = ia.id; maj(); b.focus(); });
        pastilles.appendChild(b);
      });
      contenu.textContent = '';
      if (inst.commun_html) {
        contenu.appendChild(el('div', { classe: 'bloc-install doc', html: '<h3>Étapes communes</h3>' + inst.commun_html }));
      }
      var libelle = '';
      inst.ias.forEach(function (ia) { if (ia.id === choix) { libelle = ia.libelle; } });
      var specifique = inst.par_ia_html[choix] || inst.par_ia_html.toutes || '';
      if (specifique) {
        contenu.appendChild(el('div', { classe: 'bloc-install doc', html: '<h3>Spécificités ' + libelle + '</h3>' + specifique }));
      } else {
        contenu.appendChild(el('p', { classe: 'doux', texte: 'Pas de consigne propre à ' + libelle + ' : suivez les étapes communes.' }));
      }
    }
    maj();
  }

  /* ---------- Fichiers ---------- */
  function dessinerFichiers() {
    var zone = document.getElementById('fichiers');
    if (!zone) { return; }
    var courant = 0;
    var liste = el('div', { classe: 'liste-fichiers' });
    var contenu = el('div', { classe: 'contenu-fichier' });
    zone.appendChild(el('div', { classe: 'visionneuse' }, [liste, contenu]));

    function maj() {
      liste.textContent = '';
      D.fichiers.forEach(function (f, i) {
        var b = el('button', { type: 'button', classe: 'fichier-bouton', 'aria-pressed': i === courant ? 'true' : 'false' }, [
          el('span', { texte: f.chemin }), el('span', { classe: 'taille', texte: taille(f.taille) })
        ]);
        b.addEventListener('click', function () { courant = i; maj(); b.focus(); });
        liste.appendChild(b);
      });
      var f = D.fichiers[courant];
      contenu.textContent = '';
      var retour = el('span', { classe: 'retour', role: 'status' });
      var copie = el('button', { type: 'button', classe: 'bouton secondaire', texte: 'Copier le contenu' });
      copie.addEventListener('click', function () { copier(f.texte, retour); });
      contenu.appendChild(el('div', { classe: 'contenu-entete' }, [
        el('span', { classe: 'mono', texte: f.chemin }), el('span', {}, [copie, retour])
      ]));
      contenu.appendChild(el('pre', { texte: f.texte }));
    }
    if (D.fichiers.length) { maj(); }
  }

  /* ---------- Commande pour adapter ---------- */
  function commande() {
    var code = document.getElementById('commande-dupliquer');
    var bouton = document.getElementById('copier-commande');
    if (!code || !bouton) { return; }
    code.textContent = D.commande_dupliquer;
    var retour = el('span', { classe: 'retour', role: 'status' });
    bouton.parentNode.appendChild(retour);
    bouton.addEventListener('click', function () { copier(D.commande_dupliquer, retour); });
  }

  dessinerSchema();
  dessinerInstallation();
  dessinerFichiers();
  commande();
  afficher(location.hash.replace(/^#/, '') || 'fiche', false);
})();
