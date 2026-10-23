/**
 * Boîte de dépôt de la Bibliothèque IA Terre.
 *
 * Ce script reçoit une proposition envoyée par le formulaire du site, retire ce qui
 * ne doit pas circuler (marquages, grades, adresses électroniques, téléphones, clés),
 * l'enregistre dans un dossier Drive PRIVÉ et prévient les validateurs par courriel,
 * fichier joint. Il ne publie rien : la publication se fait après validation humaine.
 *
 * Il ne lit aucun autre fichier du compte, ne répond à personne d'autre qu'à
 * l'émetteur du dépôt (simple accusé « reçu »), et n'expose aucune liste de dépôts.
 */

// ===== EPURER:DEBUT (ce bloc est recopié tel quel dans interface/epurer.js) =====
var Epurer = (function () {
  var MARQUAGES = /(^|[^A-Za-zÀ-ÿ])(DIFFUSION\s+RESTREINTE|CONFIDENTIEL(?:\s+D[ÉE]FENSE)?|SECRET(?:\s+D[ÉE]FENSE)?|TR[ÈE]S\s+SECRET|NON\s+PROT[ÉE]G[ÉE]|RESTRICTED|NATO\s+(?:SECRET|CONFIDENTIAL|RESTRICTED))(?![A-Za-zÀ-ÿ])/g;
  var COURRIEL = /[\w.+-]+@([\w-]+(?:\.[\w-]+)+)/g;
  var DOMAINE_FICTIF = /(^|\.)(example\.(com|org|net)|invalid|test|example)$/;
  var TELEPHONE = /(^|[^\d.])((?:(?:\+33|0033)[ .-]?\(?0?\)?|0)[1-9](?:[ .-]?\d{2}){4})(?!\d)/g;
  var IP = /(^|[^\d])((?:\d{1,3}\.){3}\d{1,3})(?!\d)(?!\.\d)/g;
  var CLE_JETON = /\b(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g;
  var CLE_AFFECTEE = /((?:api[_-]?key|jeton|token|mot[_ ]de[_ ]passe|password)\s*[:=]\s*["']?)([A-Za-z0-9_\-]{12,})/gi;
  var CODE_RESEAU = /^\s*(?:import|from)\s+(socket|urllib|requests|http|httpx|ftplib|smtplib|telnetlib|paramiko|aiohttp|websockets?|ssl|xmlrpc)\b/m;
  var CODE_DANGER = /\b(os\.system|subprocess|eval\s*\(|exec\s*\(|__import__|pickle|ctypes)\b/;

  // Grades en toutes lettres (insensible à la casse) et abréviations (casse exacte).
  var GRADES_MOTS = "g[ée]n[ée]ral(?:\\s+de\\s+(?:brigade|division|corps\\s+d'arm[ée]e|l'arm[ée]e))?|colonel|lieutenant[- ]colonel|chef\\s+de\\s+bataillon|chef\\s+d'escadrons?|commandant|capitaine|sous-lieutenant|lieutenant|aspirant|adjudant-chef|adjudant|major|sergent-chef|sergent|caporal-chef|caporal|brigadier-chef|brigadier|mar[ée]chal\\s+des\\s+logis(?:-chef)?|m[ée]decin\\s+(?:g[ée]n[ée]ral|colonel|commandant|capitaine)|ing[ée]nieur\\s+g[ée]n[ée]ral";
  var GRADES_ABREV = "GAL|Gal|COL|Col|LCL|Lcl|CDT|Cdt|CEN|CBA|CNE|Cne|CPT|Cpt|LTN|Lt|SLT|ASP|Asp|MAJ|Maj|ADC|ADJ|Adj|SCH|SGT|Sgt|CCH|CPL|Cpl|BCH|MDL|MCH";
  var GRADE_MOT = new RegExp("(^|[^A-Za-zÀ-ÿ])(" + GRADES_MOTS + ")(\\.?)((?:[ \\t]+[A-Za-zÀ-ÿ'’-]+){1,3})", "gi");
  var GRADE_ABR = new RegExp("(^|[^A-Za-zÀ-ÿ])(" + GRADES_ABREV + ")(\\.?)((?:[ \\t]+[A-Za-zÀ-ÿ'’-]+){1,3})", "g");

  function majuscule(m) { return /^[A-ZÀ-ÖØ-Þ]/.test(m); }

  // Remplace « grade Nom Prénom » par « [personne] » ; ne touche pas « le capitaine a décidé ».
  function retirerGrades(texte, n) {
    function rempl(match, avant, grade, point, suite) {
      var morceaux = suite.match(/[ \t]+[A-Za-zÀ-ÿ'’-]+/g) || [];
      var pris = 0;
      while (pris < morceaux.length && pris < 3 && majuscule(morceaux[pris].replace(/^[ \t]+/, ''))) { pris++; }
      if (pris === 0) { return match; }
      n.grade++;
      var reste = morceaux.slice(pris).join('');
      return avant + '[personne]' + reste;
    }
    // Plusieurs passes : un grade peut se trouver dans le texte déjà consommé par la précédente.
    var avant;
    for (var i = 0; i < 4; i++) {
      avant = texte;
      texte = texte.replace(GRADE_MOT, rempl).replace(GRADE_ABR, rempl);
      if (texte === avant) { break; }
    }
    return texte;
  }

  function texte(brut) {
    var n = { marquage: 0, grade: 0, courriel: 0, telephone: 0, cle: 0, ip: 0 };
    var t = String(brut == null ? '' : brut);
    t = t.replace(MARQUAGES, function (m, avant) { n.marquage++; return avant; });
    t = retirerGrades(t, n);
    t = t.replace(COURRIEL, function (m, dom) {
      if (DOMAINE_FICTIF.test(dom.toLowerCase())) { return m; }
      n.courriel++; return 'nom@example.org';
    });
    t = t.replace(TELEPHONE, function (m, avant) { n.telephone++; return avant + '[numéro retiré]'; });
    t = t.replace(CLE_JETON, function () { n.cle++; return '[clé retirée]'; });
    t = t.replace(CLE_AFFECTEE, function (m, debut) { n.cle++; return debut + '[clé retirée]'; });
    t = t.replace(IP, function (m, avant, ip) {
      if (!ip.split('.').every(function (o) { return +o <= 255; })) { return m; }
      n.ip++; return avant + '192.0.2.1';
    });
    // Un marquage retiré ne doit pas laisser une ligne vide en tête ni des espaces doubles.
    if (n.marquage) { t = t.replace(/[ \t]{2,}/g, ' '); }
    return { texte: t, retraits: n };
  }

  function somme(a, b) { for (var k in b) { a[k] = (a[k] || 0) + b[k]; } }

  function parcourir(valeur, total) {
    if (typeof valeur === 'string') { var r = texte(valeur); somme(total, r.retraits); return r.texte; }
    if (Array.isArray(valeur)) { return valeur.map(function (v) { return parcourir(v, total); }); }
    if (valeur && typeof valeur === 'object') {
      var o = {}; Object.keys(valeur).forEach(function (k) { o[k] = parcourir(valeur[k], total); }); return o;
    }
    return valeur;
  }

  // Renvoie la proposition épurée, le décompte des retraits (jamais les valeurs retirées)
  // et des alertes à l'intention du validateur.
  function proposition(p) {
    var total = { marquage: 0, grade: 0, courriel: 0, telephone: 0, cle: 0, ip: 0 };
    var propre = parcourir(p, total);
    var alertes = [];
    if (propre && propre.type === 'script') {
      if (CODE_RESEAU.test(propre.contenu || '')) { alertes.push('Le script contacte (ou peut contacter) un service extérieur.'); }
      if (CODE_DANGER.test(propre.contenu || '')) { alertes.push('Le script contient une instruction non autorisée (commande système, évaluation de texte…).'); }
    }
    if (total.cle) { alertes.push('Une clé ou un mot de passe figurait dans le dépôt : prévenir l\'auteur pour qu\'il la révoque (elle a déjà circulé).'); }
    var nbTotal = 0; for (var k in total) { nbTotal += total[k]; }
    if (nbTotal >= 10) { alertes.push('Épuration importante (' + nbTotal + ' retraits) : vérifier que le contenu reste utilisable et ne repose pas sur des données réelles.'); }
    return { proposition: propre, retraits: total, alertes: alertes };
  }

  return { texte: texte, proposition: proposition };
})();
// ===== EPURER:FIN =====

var LIBELLES = { marquage: 'marquage', grade: 'grade (et nom associé)', courriel: 'adresse électronique', telephone: 'numéro de téléphone', cle: 'clé ou mot de passe', ip: 'adresse IP' };
var MAX_OCTETS = 200000;      // taille maximale d'un dépôt
var MAX_PAR_HEURE = 30;       // dépôts acceptés par heure, tous émetteurs confondus
var FORMAT = 'bibliotheque-ia-terre/proposition';

/** À lancer UNE fois à la main (menu « Exécuter »), pour autoriser le script et préparer le dossier. */
function installer() {
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('DOSSIER_ID')) {
    var dossier = DriveApp.createFolder('Bibliothèque IA - dépôts (privé)');
    props.setProperty('DOSSIER_ID', dossier.getId());
  }
  if (!props.getProperty('VALIDATEURS')) {
    props.setProperty('VALIDATEURS', Session.getEffectiveUser().getEmail());
  }
  Logger.log('Dossier : ' + DriveApp.getFolderById(props.getProperty('DOSSIER_ID')).getUrl());
  Logger.log('Validateurs : ' + props.getProperty('VALIDATEURS'));
  Logger.log('Quota de courriels restant aujourd\'hui : ' + MailApp.getRemainingDailyQuota());
}

/** Test sans site : fabrique un faux dépôt contenant volontairement un marquage, un grade, etc. */
function tester() {
  var faux = {
    format: FORMAT, titre: 'Essai de la boîte', resume: 'Essai. NON PROTÉGÉ', type: 'prompt',
    auteur: 'Capitaine Dupont', probleme: 'Joindre jean.dupont@exemple.fr ou 06 12 34 56 78.',
    donne: 'x', recoit: 'y', contenu: 'clé : api_key = abcdefghijklmnop1234', ia_compatibles: ['claude'],
    controles: ['aucune-donnee-reelle', 'exemples-fictifs', 'aucun-nom-adresse', 'aucun-appel-reseau']
  };
  var r = traiter_({ p: faux, contact: '' });
  Logger.log(JSON.stringify(r));
}

function doGet() {
  return ContentService.createTextOutput('Boîte de dépôt de la Bibliothèque IA Terre : en service.');
}

function doPost(e) {
  var rep;
  try {
    var brut = (e && e.postData && e.postData.contents) || '';
    if (brut.length > MAX_OCTETS) { rep = { ok: false, erreur: 'Dépôt trop volumineux.' }; }
    else { rep = traiter_(JSON.parse(brut)); }
  } catch (err) {
    rep = { ok: false, erreur: 'Dépôt illisible.' };
  }
  return ContentService.createTextOutput(JSON.stringify(rep)).setMimeType(ContentService.MimeType.JSON);
}

function limiteAtteinte_() {
  var verrou = LockService.getScriptLock();
  verrou.waitLock(10000);
  try {
    var cache = CacheService.getScriptCache();
    var cle = 'n' + Utilities.formatDate(new Date(), 'Europe/Paris', 'yyyyMMddHH');
    var n = parseInt(cache.get(cle) || '0', 10) + 1;
    cache.put(cle, String(n), 3700);
    return n > MAX_PAR_HEURE;
  } finally { verrou.releaseLock(); }
}

function nomFichier_(titre) {
  var base = String(titre || 'projet').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'projet';
  return 'proposition-' + base + '-' + Utilities.formatDate(new Date(), 'Europe/Paris', 'yyyyMMdd-HHmmss') + '.json';
}

function traiter_(enveloppe) {
  var p = enveloppe && enveloppe.p;
  if (enveloppe && enveloppe.piege) { return { ok: true }; }            // champ-piège rempli : on fait semblant
  if (!p || p.format !== FORMAT || typeof p.titre !== 'string' || !p.titre.trim()) {
    return { ok: false, erreur: 'Ce n\'est pas une proposition de la bibliothèque.' };
  }
  if (limiteAtteinte_()) { return { ok: false, erreur: 'Trop de dépôts en ce moment. Réessayez dans une heure ou envoyez le fichier par courriel.' }; }

  var props = PropertiesService.getScriptProperties();
  var epure = Epurer.proposition(p);
  var json = JSON.stringify(epure.proposition, null, 2);
  var nom = nomFichier_(p.titre);

  var dossierId = props.getProperty('DOSSIER_ID');
  if (!dossierId) { return { ok: false, erreur: 'Boîte non installée.' }; }
  DriveApp.getFolderById(dossierId).createFile(nom, json, 'application/json');

  var retraits = Object.keys(epure.retraits).filter(function (k) { return epure.retraits[k]; })
    .map(function (k) { return '- ' + epure.retraits[k] + ' × ' + LIBELLES[k]; });
  var contact = String(enveloppe.contact || '').slice(0, 200);
  var q = epure.proposition;
  var corps = [
    'Nouveau dépôt reçu dans la boîte de la Bibliothèque IA Terre.',
    '',
    'Titre : ' + q.titre,
    'Type : ' + q.type + ' · Pseudo : ' + (q.auteur || '(non renseigné)'),
    'IA indiquées : ' + (Array.isArray(q.ia_compatibles) ? q.ia_compatibles.join(', ') : ''),
    'Résumé : ' + (q.resume || ''),
    contact ? 'Contact laissé par l\'auteur (à ne pas publier) : ' + contact : 'Aucun contact laissé.',
    '',
    retraits.length ? 'Éléments retirés automatiquement (valeurs non conservées) :\n' + retraits.join('\n') : 'Aucun élément à retirer.',
    epure.alertes.length ? '\nÀ VÉRIFIER :\n- ' + epure.alertes.join('\n- ') : '',
    '',
    'Fichier joint : ' + nom,
    'Pour valider : donnez ce fichier au skill de validation de la bibliothèque.',
    'Rien n\'est publié tant que le dépôt n\'a pas été validé.'
  ].join('\n');

  var dest = (props.getProperty('VALIDATEURS') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var envoye = false;
  if (dest.length && MailApp.getRemainingDailyQuota() > 0) {
    MailApp.sendEmail({
      to: dest.join(','), subject: '[Bibliothèque IA] Dépôt : ' + q.titre + ' (' + q.type + ')',
      body: corps, name: 'Bibliothèque IA Terre - dépôts',
      attachments: [Utilities.newBlob(json, 'application/json', nom)]
    });
    envoye = true;
  }
  return { ok: true, prevenu: envoye, retraits: epure.retraits };
}
