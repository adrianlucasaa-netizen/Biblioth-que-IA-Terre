/* Tutoriel vidéo : ouverture dans une fenêtre, pause à la fermeture. JavaScript sans dépendance. */
(function () {
  var bouton = document.getElementById('ouvrir-tuto');
  var fenetre = document.getElementById('fenetre-tuto');
  if (!bouton || !fenetre || typeof fenetre.showModal !== 'function') { return; }
  var video = fenetre.querySelector('video');
  bouton.addEventListener('click', function () {
    fenetre.showModal();
    try { video.play(); } catch (e) { /* lecture manuelle */ }
  });
  fenetre.querySelector('.fermer-tuto').addEventListener('click', function () { fenetre.close(); });
  fenetre.addEventListener('click', function (e) { if (e.target === fenetre) { fenetre.close(); } });
  fenetre.addEventListener('close', function () { video.pause(); });
})();
