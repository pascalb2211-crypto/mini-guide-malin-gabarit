/* Outils propres au guide Japon (JR Pass, détaxe, vols, taxes, fiches pratiques). Chargé après engine/tools.js. */
(function(){
  var T = window.MGT, checklist = T.checklist, chips = T.chips, backBtn = T.backBtn, esc = T.esc, yen = T.money, eur = T.eur, rate = T.rate, fget = T.fget, fset = T.fset;
  var title, body; T.onBuild(function(t, b){ title = t; body = b; });

  /* ---------------- Simulateur JR Pass ---------------- */
  var TRIPS = [
    ['Tokyo ↔ Kyoto', 14300], ['Tokyo ↔ Osaka (Shin-Osaka)', 14700], ['Kyoto → Hiroshima', 11100],
    ['Osaka (Shin-Osaka) → Hiroshima', 10700], ['Tokyo → Hiroshima', 19700]
  ];
  var PASS = { official: { 7: 50000, 14: 80000, 21: 100000 }, agency: { 7: 53000, 14: 84000, 21: 105000 } };
  function jrpass(){
    body.oninput = body.onchange = null;
    title.textContent = '🚄 Simulateur JR Pass';
    var h = '<p>Coche tes trajets longue distance : l’appli compare le total des billets à l’unité au prix du pass.</p>' +
      '<div class="card"><label>Durée du pass</label><select id="jpDur"><option value="7">7 jours</option><option value="14">14 jours</option><option value="21">21 jours</option></select>' +
      '<label>Où l’acheter ?</label><select id="jpSrc"><option value="official">Site officiel JR</option><option value="agency">Revendeur agréé (un peu plus cher)</option></select></div>' +
      '<h4>Mes trajets en Shinkansen (aller simple)</h4><div class="card">';
    TRIPS.forEach(function(t, i){ h += '<div class="row"><span>' + t[0] + '<br><small class="small">≈ ' + yen(t[1]) + ' en Nozomi, place réservée</small></span><select data-i="' + i + '"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></div>'; });
    h += '</div><label>Autres trajets JR à ajouter (en ¥ : aéroport, Nara, Miyajima, Hakone…)</label><input id="jpOther" type="number" inputmode="numeric" placeholder="0">' +
      '<div id="jpRes"></div>' +
      '<div class="card small">Prix indicatifs arrondis (billet plein tarif, place réservée, train Nozomi), relevés en novembre 2026 : ils varient de quelques centaines de yens selon la saison. ' +
      'Annoncé : le Nozomi Tokyo – Osaka passera de 14 720 ¥ à 15 420 ¥ pour les billets achetés à partir du 1er juillet 2027. ' +
      'Le JR Pass ne couvre pas les Nozomi ni les Mizuho : avec le pass tu prends Hikari ou Kodama (un peu plus lents), ou tu paies un supplément (environ 4 960 ¥ Tokyo – Kyoto ou Osaka, 6 500 ¥ Tokyo – Hiroshima). ' +
      'Le pass est réservé aux visiteurs étrangers et ne couvre ni les métros ni les compagnies privées. Les prix du pass viennent de JR Group (avril 2026).</div>';
    body.innerHTML = h;
    function calc(){
      var dur = body.querySelector('#jpDur').value, src = body.querySelector('#jpSrc').value, pass = PASS[src][dur], tot = 0;
      Array.prototype.forEach.call(body.querySelectorAll('select[data-i]'), function(s){ tot += TRIPS[+s.getAttribute('data-i')][1] * parseInt(s.value, 10); });
      tot += parseInt(body.querySelector('#jpOther').value || '0', 10) || 0;
      var d = tot - pass, r = body.querySelector('#jpRes');
      if(tot === 0){ r.innerHTML = ''; return; }
      if(d > 0) r.innerHTML = '<div class="res ok">✅ Le pass est rentable : tu économises environ ' + yen(d) + ' (' + eur(d) + ').<br><span class="small">Billets à l’unité : ' + yen(tot) + ' · pass : ' + yen(pass) + '</span></div>';
      else r.innerHTML = '<div class="res ko">❌ Pas rentable : le pass te coûterait ' + yen(-d) + ' (' + eur(-d) + ') de plus.<br><span class="small">Billets à l’unité : ' + yen(tot) + ' · pass : ' + yen(pass) + '. Achète les billets au fur et à mesure.</span></div>';
    }
    body.oninput = calc; body.onchange = calc; calc();
  }

  /* ---------------- Détaxe ---------------- */
  function detaxe(){
    title.textContent = '🛍️ Détaxe : mode d’emploi';
    body.innerHTML = '<p>Depuis le <b>1er novembre 2026</b>, tu paies le prix toutes taxes comprises en magasin, puis tu te fais rembourser la taxe de consommation (10 %) <b>au moment de quitter le Japon</b>.</p>' +
      '<div class="step"><b class="n">1</b><div><b>Au magasin</b><br>Choisis un magasin « Tax-free ». Il faut au moins <b>5 000 ¥ d’achats avant taxe</b> dans le même magasin le même jour. Montre ton passeport à la caisse.</div></div>' +
      '<div class="step"><b class="n">2</b><div><b>Garde tout ensemble</b><br>Reçus, articles et passeport jusqu’au départ. Les produits consommables n’ont plus besoin d’être scellés, mais ceux que tu utilises ou manges au Japon ne sont pas remboursés.</div></div>' +
      '<div class="step"><b class="n">3</b><div><b>À l’aéroport, avant l’enregistrement des bagages</b><br>Va à la borne « tax-free » du hall des départs internationaux, <b>dans les 90 jours</b> suivant l’achat. Garde les achats avec toi : une valise enregistrée ne peut plus être rouverte. Dans les grands aéroports (Narita, Haneda, Kansai, Chubu, Fukuoka, New Chitose, Naha), tu peux commencer sur Visit Japan Web.</div></div>' +
      '<div class="step"><b class="n">4</b><div><b>Feu vert ou rouge</b><br>Vert : c’est terminé. Rouge : présente tes achats au contrôle de la douane.</div></div>' +
      '<div class="step"><b class="n">5</b><div><b>Remboursement</b><br>La somme correspondant à la taxe t’est reversée une fois la sortie des articles confirmée. Le moyen de remboursement exact (espèces, carte) et les frais éventuels ne sont pas précisés par les sources officielles : renseigne-toi auprès du magasin.</div></div>' +
      '<h4>Pièges à éviter</h4><div class="card">• Chaque reçu est traité séparément : si un seul article manque, aucun article de ce reçu n’est remboursé.<br>• Ne termine pas la démarche au dernier moment : rien ne t’est dû si tu rates ton vol à cause de la file.<br>• Si les articles ne sortent pas du Japon, tu peux devoir rembourser la taxe, avec des pénalités.<br>• Les premiers mois du nouveau système, prévois de l’attente.</div>' +
      '<div class="small">Sources : Japan Tourism Agency (MLIT), JNTO, National Tax Agency. Vérifie les règles sur le site de l’Agence du tourisme japonaise avant de partir.</div>' +
      '<a class="btn" target="_blank" rel="noopener" href="https://www.vjw.digital.go.jp/">Visit Japan Web (site officiel)</a>';
  }

  /* ---------------- Vols depuis La Réunion ---------------- */
  function vols(){
    title.textContent = '✈️ Vols depuis La Réunion';
    body.innerHTML = '<div class="card"><b>Option 1 : via Bangkok</b><br>Air Austral relie La Réunion à Bangkok en vol direct : départ vers 20 h, arrivée vers 6 h 55 le lendemain (environ 8 h), 2 à 3 vols par semaine selon la saison. Ensuite, un vol Bangkok – Tokyo ou Osaka d’environ 6 h 30. Compte <b>21 à 28 heures</b> au total avec l’escale.</div>' +
      '<div class="card"><b>Option 2 : via Paris</b><br>Réunion – Paris (environ 11 h en direct), puis Paris – Tokyo ou Osaka (environ 14 h). Plus long, mais Paris – Japon propose plus de départs et de compagnies.</div>' +
      '<h4>Prix repérés (18 novembre 2026)</h4><div class="card">Réunion – Tokyo via Bangkok : environ <b>1 300 à 1 420 € l’aller-retour</b> sur les comparateurs, pour des départs de novembre à février. Pour les vacances scolaires, compte nettement plus.<br>Paris – Tokyo : à partir d’environ 630 € hors vacances et jusqu’à plus de 1 000 € en haute saison.<br><span class="small">Indicatif : les prix changent chaque jour.</span></div>' +
      '<h4>Conseils malins</h4><div class="card">• Compare « Réunion – Bangkok – Japon » et « Réunion – Paris – Japon », puis prends le moins cher.<br>• Avec deux billets séparés, ton bagage n’est pas enregistré jusqu’au bout : prévois une escale confortable.<br>• Pense au vol « open jaw » : arrivée à Tokyo, retour depuis Osaka.</div>' +
      '<a class="btn" target="_blank" rel="noopener sponsored" href="https://fr.trip.com/?Allianceid=9852508&SID=327644129&trip_sub3=D19106369&locale=fr-fr">Comparer les vols (Trip.com)</a>' +
      '<a class="btn" target="_blank" rel="noopener" href="https://www.air-austral.com/">Air Austral (vols directs Bangkok)</a>';
  }

  /* ---------------- Taxes de séjour ---------------- */
  function tokyoTax(p){ return p >= 15000 ? 200 : p >= 10000 ? 100 : 0; }
  function kyotoTax(p){ return p >= 100000 ? 10000 : p >= 50000 ? 4000 : p >= 20000 ? 1000 : p >= 6000 ? 400 : 200; }
  function taxes(){
    title.textContent = '🏨 Taxes de séjour';
    body.innerHTML = '<p>La taxe de séjour se paie <b>à l’hôtel</b> (parfois déjà incluse par le site de réservation), par personne et par nuit. Elle dépend du prix de la chambre <b>hors taxe de consommation</b>, divisé par le nombre de personnes.</p>' +
      '<h4>Tokyo (jusqu’au 31 mars 2027)</h4><table><tr><th>Prix / pers. / nuit</th><th>Taxe</th></tr><tr><td>moins de 10 000 ¥</td><td>0</td></tr><tr><td>10 000 à 14 999 ¥</td><td>100 ¥</td></tr><tr><td>15 000 ¥ et plus</td><td>200 ¥</td></tr></table>' +
      '<div class="small">Annoncé : à partir d’avril 2027, exonération sous 13 000 ¥ par personne et par nuit, puis 3 % du prix au-delà. À vérifier avant ton départ.</div>' +
      '<h4>Kyoto (depuis le 1er mars 2026)</h4><table><tr><th>Prix / pers. / nuit</th><th>Taxe</th></tr><tr><td>moins de 6 000 ¥</td><td>200 ¥</td></tr><tr><td>6 000 à 19 999 ¥</td><td>400 ¥</td></tr><tr><td>20 000 à 49 999 ¥</td><td>1 000 ¥</td></tr><tr><td>50 000 à 99 999 ¥</td><td>4 000 ¥</td></tr><tr><td>100 000 ¥ et plus</td><td>10 000 ¥</td></tr></table>' +
      '<p class="small">Osaka a aussi une taxe de quelques centaines de yens au maximum (rien sous 5 000 ¥ par personne et par nuit).</p>' +
      '<h4>Calcule la tienne</h4><div class="card"><label>Prix de la chambre par nuit (¥, hors taxe de consommation)</label><input id="txP" type="number" inputmode="numeric" placeholder="ex. 14000"><label>Personnes</label><input id="txN" type="number" inputmode="numeric" value="2"><label>Nuits</label><input id="txD" type="number" inputmode="numeric" value="3"><div id="txR" style="margin-top:10px"></div></div>' +
      '<h4>Taxe de départ du Japon</h4><div class="card small">Depuis le 1er juillet 2026 : <b>3 000 ¥ par personne</b> (avant : 1 000 ¥), déjà ajoutée au prix de ton billet d’avion dans la plupart des cas. Rien à payer sur place.</div>' +
      '<div class="small">À venir (vers 2028) : une autorisation en ligne « JESTA » avant le vol, payante, montant pas encore fixé.</div>' +
      '<div class="small">Sources : Tokyo Metropolitan Government, Ville de Kyoto, vérifiées en novembre 2026.</div>';
    function calc(){
      var P = parseFloat(body.querySelector('#txP').value) || 0, N = Math.max(1, parseInt(body.querySelector('#txN').value, 10) || 1), D = Math.max(1, parseInt(body.querySelector('#txD').value, 10) || 1), pp = P / N, r = body.querySelector('#txR');
      if(!P){ r.innerHTML = ''; return; }
      var t = tokyoTax(pp) * N * D, k = kyotoTax(pp) * N * D;
      r.innerHTML = 'Par personne et par nuit : ' + yen(pp) + '<br><b>Tokyo : ' + yen(t) + '</b> (' + eur(t) + ') · <b>Kyoto : ' + yen(k) + '</b> (' + eur(k) + ') pour le séjour.';
    }
    body.oninput = calc; body.onchange = null;
  }

  /* ---------------- Liens d'affiliation ---------------- */
  function affil(){
    title.textContent = 'ℹ️ À propos des liens';
    body.innerHTML = '<p>Les boutons de réservation de ce guide (Trip.com, Booking.com, Agoda, Klook, Holafly, Airalo) sont des <b>liens d’affiliation</b>.</p><p>Si tu réserves en passant par eux, Thaï Malin reçoit une petite commission, <b>sans aucun surcoût pour toi</b>. Ça aide à faire vivre le guide et à le mettre à jour.</p><p>Tu es libre de comparer ailleurs : les conseils du guide restent les mêmes.</p><p>Merci pour ta confiance ! 🙏</p>';
  }

  /* ================= FICHES PRATIQUES INTERACTIVES ================= */
  /* 1. Gares */
  function f_gares(){
    title.textContent = '🚉 Décodeur des gares';
    var ck = checklist('gares', ['Je repère le <b>nom et la couleur de ma ligne</b> sur le plan','Je vérifie le <b>numéro de quai</b> (番線) avant de monter','Je regarde le <b>numéro de sortie</b> pour mon quartier','Je prépare mon trajet sur Google Maps ou Japan Travel by NAVITIME','Je prévois <b>10 minutes de plus</b> dans les grandes gares','Je photographie le <b>nom de ma gare d’arrivée en japonais</b>'], 'réflexes acquis');
    body.innerHTML = '<p>Shinjuku, Shibuya, Tokyo, Osaka : plusieurs compagnies se partagent le même bâtiment. Voici la méthode.</p><h4>Ma checklist avant de partir</h4>' + ck.html +
      '<h4>Quelle carte de transport (IC) ?</h4><div class="small">Ma situation :</div><div class="chips" id="gT"></div><div class="small">J’arrive à :</div><div class="chips" id="gA"></div><div class="card" id="gR"></div>' +
      '<div class="card small">Une carte IC (Suica, Pasmo, ICOCA) se recharge et sert dans les trains, les métros, les bus et dans beaucoup de konbini et distributeurs. Elles fonctionnent dans tout le pays : pas besoin d’en acheter une par ville. Elle ne remplace pas le billet de Shinkansen.</div>' +
      '<div class="card small"><b>Astuce malin :</b> le nom de ta gare en japonais sur ton téléphone suffit pour demander ton chemin au personnel.</div>';
    ck.bind();
    var sel = { t: 'iph', a: 'tok' };
    function show(){ var r = '';
      if(sel.t === 'iph') r = '<b>Welcome Suica Mobile</b> (appli gratuite JR East pour iPhone) ou Suica dans Apple Wallet : tu l’actives avant le départ et tu tapes dès l’arrivée. Selon les sources 2026, la version de l’appli est valable 180 jours, sans dépôt.';
      else if(sel.a === 'tok') r = '<b>Welcome Suica</b> (carte physique pour touristes, sans dépôt, valable 28 jours) ou une Suica / Pasmo classique, aux guichets des aéroports de Narita et Haneda.';
      else r = '<b>ICOCA</b>, à l’aéroport du Kansai (environ 2 000 ¥ dont 500 ¥ de dépôt remboursable, selon les sources 2026). Elle marche aussi à Tokyo.';
      body.querySelector('#gR').innerHTML = r + '<div class="small" style="margin-top:6px">Vérifie les conditions de vente avant ton départ : elles ont changé plusieurs fois depuis 2023.</div>'; }
    chips('#gT', [['📱 iPhone',  'iph'],['🤖 Android / autre','and']], function(v){ sel.t = v; show(); });
    chips('#gA', [['Tokyo','tok'],['Osaka / Kyoto','kan']], function(v){ sel.a = v; show(); });
    backBtn();
  }

  /* 2. Distributeurs */
  function f_distrib(){
    title.textContent = '🥤 Distributeurs japonais';
    var D = [['🥫 Café en canette','ホット','Chaud (étiquette rouge)','hot'],['🍵 Thé vert','あたたかい','Chaud : « atatakai »','hot'],['🥤 Soda','つめたい','Froid (étiquette bleue) : « tsumetai »','cold'],['💧 Eau','つめたい','Froid : « tsumetai »','cold'],['🍲 Soupe / maïs','あたたかい','Chaud : surtout en hiver','hot'],['🧃 Jus','つめたい','Froid : « tsumetai »','cold']];
    var h = '<p>Il y en a dans la rue, les gares et même au milieu de nulle part. Touche une boisson pour voir ce que dit l’étiquette.</p><div class="vm"><div class="sl">';
    D.forEach(function(d, i){ h += '<button type="button" class="' + d[3] + '" data-i="' + i + '">' + d[0] + '</button>'; });
    h += '</div></div><div class="card" id="vR">Touche une boisson ci-dessus.</div>' +
      '<h4>Comment faire</h4><div class="step"><b class="n">1</b><div>Regarde le <b>prix affiché</b> sous la boisson.</div></div><div class="step"><b class="n">2</b><div>Insère les pièces ou les billets, ou pose ta carte IC si l’appareil l’accepte.</div></div><div class="step"><b class="n">3</b><div>Appuie sur le bouton sous ta boisson (il s’allume).</div></div><div class="step"><b class="n">4</b><div>Prends ta boisson en bas, puis ta monnaie.</div></div>' +
      '<div class="card"><b>Astuce malin :</b> rouge = chaud, bleu = froid. Cherche les boissons chaudes en hiver, elles sont souvent un vrai petit bonheur à 150 ou 200 ¥ environ.</div><div class="small">Prix indicatifs : ils varient selon la région et la machine.</div>';
    body.innerHTML = h;
    Array.prototype.forEach.call(body.querySelectorAll('.vm button'), function(b){ b.onclick = function(){ var d = D[+b.getAttribute('data-i')]; body.querySelector('#vR').innerHTML = '<div class="big">' + d[1] + '</div>' + d[2]; }; });
    backBtn();
  }

  /* 3. Toilettes */
  function f_toilettes(){
    title.textContent = '🚽 Toilettes japonaises';
    var K = [['おしり','Oshiri','Lavage arrière.'],['ビデ','Bidet','Lavage féminin.'],['止','Tome','Stop : arrête le jet. Appuie ici en cas de doute.'],['水勢','Suisei','Puissance du jet : + ou −.'],['音','Oto','Son : masque les bruits avec un bruit d’eau.'],['流す','Nagasu','Chasse d’eau.']];
    var h = '<p>Voici un tableau de commandes classique. Touche un bouton pour savoir à quoi il sert.</p><div class="panel">';
    K.forEach(function(k, i){ h += '<button type="button" data-i="' + i + '">' + k[0] + '</button>'; });
    h += '</div><div class="card" id="tR"><div class="small">Touche un bouton.</div></div>' +
      '<h4>Les règles</h4><div class="card">• Utilise les toilettes avec soin et ne jette aucun déchet dans la cuvette.<br>• Respecte les installations publiques.<br>• Repère la chasse d’eau avant de commencer.</div>' +
      '<div class="card"><b>Astuce malin :</b> sur certains modèles, la chasse d’eau est un bouton séparé ou un levier au mur. Ne la confonds pas avec les commandes de lavage !</div>';
    body.innerHTML = h;
    Array.prototype.forEach.call(body.querySelectorAll('.panel button'), function(b){ b.onclick = function(){ Array.prototype.forEach.call(body.querySelectorAll('.panel button'), function(x){ x.classList.remove('on'); }); b.classList.add('on'); var k = K[+b.getAttribute('data-i')]; body.querySelector('#tR').innerHTML = '<div class="big">' + k[0] + '</div><b>' + k[1] + '</b><br>' + k[2]; }; });
    backBtn();
  }

  /* 4. Consignes */
  function f_consigne(){
    title.textContent = '🧳 Consignes à bagages';
    body.innerHTML = '<p>Pratique quand tu arrives avant le check-in ou que tu profites d’une dernière journée avant le vol.</p><h4>Calcule ton budget</h4><div class="card"><div class="small">Taille du bagage :</div><div class="chips" id="cS"></div><label>Nombre de bagages</label><input id="cN" type="number" inputmode="numeric" value="1"><label>Nombre de jours (le tarif repart à zéro à minuit)</label><input id="cD" type="number" inputmode="numeric" value="1"><div id="cR" class="res ok" style="margin-top:12px"></div></div>' +
      '<div class="card small">Fourchettes par jour relevées en 2026 : petit casier 300 à 500 ¥, moyen 500 à 700 ¥, grand 700 à 1 000 ¥. Les gares de Tokyo et Osaka sont plus chères que celles de province. Les casiers gardent en général 3 jours maximum.</div>' +
      '<h4>Les solutions</h4><div class="card"><b>Coin lockers (コインロッカー)</b> : casiers automatiques, pièces ou carte IC. Cherche ce mot sur la carte.<br><br><b>Ecbo Cloak</b> : tu réserves une consigne chez un commerçant partenaire.<br><br><b>Livraison de bagages</b> : tu envoies ta valise à ton prochain hôtel (voir page 13). Compte environ 2 000 à 4 500 ¥ par valise, livrée en général le lendemain. Maximum 30 kg et 200 cm (longueur + largeur + hauteur).</div>' +
      '<h4>Avant de déposer</h4>' + (function(){ var c = checklist('consigne', ['Je vérifie les <b>dimensions</b> du casier','Je regarde le <b>tarif</b> et l’heure limite de récupération','Je garde mon <b>ticket ou mon code</b> (photo !)','Je garde mes <b>objets de valeur</b> avec moi'], 'vérifié'); body.__c = c; return c.html; })() +
      '<div class="small">Si les casiers sont pleins aux heures de pointe, essaie un autre côté de la gare ou un service réservable.</div>';
    body.__c.bind();
    var P = { s: [300,500], m: [500,700], l: [700,1000] }, sz = 's';
    function calc(){ var n = Math.max(1, parseInt(body.querySelector('#cN').value,10)||1), d = Math.max(1, parseInt(body.querySelector('#cD').value,10)||1), r = P[sz];
      var lo = r[0]*n*d, hi = r[1]*n*d; body.querySelector('#cR').innerHTML = 'Environ ' + yen(lo) + ' à ' + yen(hi) + '<br><span class="small">(' + eur(lo).replace('≈ ','') + ' à ' + eur(hi).replace('≈ ','') + ')</span>' + (d > 3 ? '<br><span class="small">Au-delà de 3 jours, vérifie la durée maximale.</span>' : ''); }
    chips('#cS', [['Petit : sac à dos','s'],['Moyen : cabine','m'],['Grand : valise','l']], function(v){ sz = v; calc(); });
    body.querySelector('#cN').oninput = calc; body.querySelector('#cD').oninput = calc; body.oninput = null;
    backBtn();
  }

  /* 5. Onsen */
  function f_onsen(){
    title.textContent = '♨️ Onsen adapté';
    var ck = checklist('onsen', ['Je me <b>lave soigneusement</b> avant d’entrer dans le bain','Je ne plonge <b>pas ma serviette</b> dans l’eau','Je respecte le <b>calme</b> des lieux','Je vérifie la <b>règle sur les tatouages</b> avant de réserver','Je bois de l’eau après le bain'], 'règles');
    body.innerHTML = '<p>Un bain alimenté par une source chaude naturelle : une étape à ne pas manquer.</p><h4>Quel type de bain ?</h4><div class="chips" id="oT"></div><div class="card" id="oR"></div>' +
      '<h4>J’ai un tatouage</h4><div class="chips" id="oTa"></div><div class="card" id="oTr"></div>' +
      '<h4>Les règles essentielles</h4>' + ck.html + '<div class="card"><b>Astuce malin :</b> cherche « Tattoo Friendly Onsen » ou « Private Onsen » avant de réserver.</div>';
    ck.bind();
    var T = { pub: '<b>Onsen public :</b> bains collectifs, séparés hommes et femmes. On entre nu, sans maillot.', rot: '<b>Rotenburo :</b> bain en extérieur, souvent avec vue. Idéal en hiver.', kas: '<b>Kashikiri :</b> bain privé que tu réserves pour ton groupe. Il contourne les règles sur les tatouages.', ryo: '<b>Ryokan avec onsen :</b> séjour traditionnel avec bains thermaux, souvent avec dîner et petit-déjeuner.' };
    chips('#oT', [['Public','pub'],['Extérieur','rot'],['Privé','kas'],['Ryokan','ryo']], function(v){ body.querySelector('#oR').innerHTML = T[v]; });
    var A = { no: 'Aucun souci côté tatouage : respecte juste les règles du bain.', sm: 'Certains établissements acceptent un petit tatouage <b>couvert par un patch étanche</b>, d’autres refusent. Ne compte pas uniquement sur le patch : confirme la règle de l’établissement avant d’y aller.', bg: 'Le plus sûr : un <b>bain privé (kashikiri)</b> ou une chambre avec bain, qui ne pose aucune question. Sinon, choisis un établissement qui annonce accueillir les tatouages. Selon les sources 2026, des villes comme Kinosaki ou Kusatsu y sont réputées accueillantes : vérifie sur place.' };
    chips('#oTa', [['Aucun','no'],['Petit','sm'],['Grand / visible','bg']], function(v){ body.querySelector('#oTr').innerHTML = A[v]; });
    backBtn();
  }

  /* 6. Manger */
  function f_manger(){
    title.textContent = '🍜 Manger comme un Japonais';
    var W = [['お弁当','Bento','Plat complet en boîte'],['おにぎり','Onigiri','Boule de riz garnie'],['安い','Yasui','Pas cher'],['おいしい','Oishii','Délicieux'],['水','Mizu','Eau'],['割引','Waribiki','Réduction']];
    var h = '<p>Bien manger sans exploser le budget, c’est possible partout.</p><h4>Où manger pas cher ?</h4><div class="chips" id="mT"></div><div class="card" id="mR"></div><h4>Les mots utiles (touche pour retourner)</h4>';
    W.forEach(function(w, i){ h += '<button type="button" class="fc" data-i="' + i + '"><div class="jp">' + w[0] + '</div><div class="fr small">Touche pour voir</div></button>'; });
    h += '<div class="card"><b>L’astuce supermarché :</b> en fin de journée, certains magasins réduisent les bentos et les plats préparés. Les horaires et les remises varient : regarde les étiquettes de réduction et compare les prix.</div>';
    body.innerHTML = h;
    var M = { ko: '<b>Konbini</b> (7-Eleven, Lawson, FamilyMart) : onigiri, sandwichs, plats chauds. Ouverts très tard, souvent 24 h sur 24.', su: '<b>Supermarchés :</b> bentos, plats préparés et produits locaux.', no: '<b>Restaurants de nouilles :</b> ramen, udon, soba. Rapide et copieux.', au: '<b>Restaurants à commande automatique :</b> tu choisis et paies sur une borne, tu donnes le ticket au comptoir. Le menu a souvent des photos.', qu: '<b>Petits restaurants de quartier :</b> menu du jour, ambiance locale.' };
    chips('#mT', [['Konbini','ko'],['Supermarché','su'],['Nouilles','no'],['Borne à tickets','au'],['Quartier','qu']], function(v){ body.querySelector('#mR').innerHTML = M[v]; });
    Array.prototype.forEach.call(body.querySelectorAll('.fc'), function(b){ var on = false; b.onclick = function(){ var w = W[+b.getAttribute('data-i')]; on = !on; b.querySelector('.fr').innerHTML = on ? '<b>' + w[1] + '</b> · ' + w[2] : 'Touche pour voir'; }; });
    backBtn();
  }

  /* 7. Japon secret */
  function f_secret(){
    title.textContent = '⛩️ Le Japon secret';
    var S = [
      ['Kanazawa','e','Jardins traditionnels, quartiers historiques, artisanat.','Environ 2 h depuis Kyoto en Thunderbird (≈ 6 500 ¥).'],
      ['Takayama','e','Maisons anciennes, marchés, ambiance de montagne.','Environ 3 à 3 h 30 depuis Kyoto, 4 à 4 h 30 depuis Tokyo.'],
      ['Koyasan','e','Temples bouddhistes et nuit dans un temple (shukubo).','Environ 1 h 30 à 2 h depuis Osaka, avec un train de montagne.'],
      ['Kurashiki','j','Canaux, maisons historiques, quartier préservé.','Depuis Osaka, Shinkansen jusqu’à Okayama puis un court train local.'],
      ['Naoshima','e','Île d’art contemporain et musées.','Depuis Okayama : train puis ferry. Compte une journée entière sur place.'],
      ['Magome et Tsumago','e','Villages d’époque sur l’ancienne route du Nakasendo.','Accès par Nakatsugawa ou Kiso-Fukushima, puis bus : compte 2 à 3 h depuis Nagoya.']];
    body.innerHTML = '<p>Un autre Japon, loin des foules. Choisis ton rythme :</p><div class="chips" id="sF"></div><div id="sL"></div><div class="card small">Ces temps sont approximatifs et varient selon les correspondances : vérifie les horaires sur Google Maps ou NAVITIME. Plusieurs lieux demandent une nuit sur place.</div><div class="card"><b>Pourquoi sortir des circuits ?</b> Une autre facette du pays, plus calme, des artisans locaux, des paysages différents.</div>';
    var ck = checklist('secret', S.map(function(s){ return '<b>' + s[0] + '</b>'; }), 'envie de voir');
    body.querySelector('#sL').parentNode.insertBefore(Object.assign(document.createElement('div'), { innerHTML: '<h4>Ma liste d’envies</h4>' + ck.html }), body.querySelector('.card.small'));
    ck.bind();
    function render(f){ var h = ''; S.forEach(function(s){ if(f === 'all' || (f === 'j' && s[1] === 'j') || (f === 'e' && s[1] === 'e')) h += '<div class="card"><b>' + s[0] + '</b><br>' + s[2] + '<br><span class="small">🚆 ' + s[3] + '</span></div>'; }); body.querySelector('#sL').innerHTML = h; }
    chips('#sF', [['Tout','all'],['Escapade rapide','j'],['Étape avec nuit','e']], render);
    backBtn();
  }

  /* 8. Insolite */
  function f_urgence(){
    title.textContent = '🆘 Urgences au Japon';
    var ck = checklist('urgence', ['<b>Copie de ton passeport</b> : une dans ton sac, une à la maison','<b>Assurance voyage</b> : numéro du contrat noté dans ton téléphone','<b>Adresse de l’hôtel</b> écrite en japonais et en capture d’écran','<b>Sorties de secours</b> repérées à ton arrivée à l’hôtel'], 'prêt');
    body.innerHTML = '<p>Appuie sur un bouton pour appeler. Les appels aux numéros d’urgence sont gratuits, même depuis un téléphone public.</p>' +
      '<a class="btn" href="tel:110">🚓 Police : 110</a>' +
      '<a class="btn" href="tel:119">🚑 Ambulance et pompiers : 119</a>' +
      '<a class="btn" href="tel:0335010110">🗣️ Police en anglais (Tokyo) : 03-3501-0110</a>' +
      '<a class="btn" href="tel:+81357986000">🇫🇷 Ambassade de France : 03-5798-6000</a>' +
      '<div class="small">Depuis l’étranger : +81 3 5798 6000. Accueil : lundi au vendredi, 9 h à 12 h 30 et 14 h à 17 h. Adresse : 4-11-44 Minami-Azabu, Minato-ku, Tokyo.</div>' +
      '<h4>Perdu ou besoin d’aide ?</h4><div class="card small">Va au <b>koban</b> (petit poste de police de quartier) le plus proche, ou demande à la réception de ton hôtel. Les Japonais rendent très souvent les objets perdus.</div>' +
      '<div class="card small"><b>Santé :</b> sans assurance, tu paies tout sur place, sans certitude d’être remboursé ensuite. Garde tous tes papiers et factures.</div>' +
      '<h4>Avant de partir</h4>' + ck.html +
      '<div class="small">Numéros vérifiés en novembre 2026. Application officielle « Japan Safe Travel » : alertes séisme et météo.</div>';
    ck.bind(); backBtn();
  }
  function f_insolite(){
    title.textContent = '🎎 Expériences insolites';
    var ck = checklist('insolite', ['<b>Gachapon</b> : distributeurs de petites capsules surprises','<b>Hôtel capsule</b> : dormir dans un espace compact et original','<b>Café à thème</b> : un lieu insolite à découvrir','<b>Atelier artisanal</b> : une activité traditionnelle','<b>Train panoramique</b> : les paysages autrement','<b>Location de kimono</b> : balade dans un quartier historique','<b>Karaoké japonais</b> : une soirée à la japonaise','<b>Salle d’arcade</b> : les immenses salles de jeux'], 'expériences testées');
    body.innerHTML = '<p>Coche ce que tu as testé et garde le compte pendant ton voyage.</p>' + ck.html + '<div class="card"><b>Astuce malin :</b> réserve à l’avance les expériences les plus demandées et vérifie les conditions d’accès, les horaires et les tarifs.</div><a class="btn" target="_blank" rel="noopener sponsored" href="https://www.klook.com/fr/?aid=129660">Voir les activités (Klook)</a>';
    ck.bind(); backBtn();
  }


  /* ---------------- Trouve mon vol (conseiller + recherche pré-remplie) ---------------- */
  function trouve(){
    title.textContent = '🔎 Trouve mon vol';
    var d0 = new Date(); d0.setMonth(d0.getMonth() + 5); var iso = function(d){ return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
    body.innerHTML = '<p>Dis-moi d’où tu pars et combien tu veux mettre : Malin te dit si c’est réaliste, comment payer moins cher, et lance la recherche déjà remplie.</p>' +
      '<div class="card"><label>Je pars de</label><select id="fvO"><option value="RUN">La Réunion (Saint-Denis)</option><option value="PAR">Paris</option><option value="OTH">Autre ville de France</option></select>' +
      '<label>J’arrive à</label><select id="fvD"><option value="TYO">Tokyo</option><option value="OSA">Osaka (Kansai)</option></select>' +
      '<label>Départ le (une date approximative suffit)</label><input id="fvDate" type="date" value="' + iso(d0) + '">' +
      '<label>Durée du séjour</label><select id="fvN"><option value="10">10 jours</option><option value="15" selected>15 jours</option><option value="21">21 jours</option></select>' +
      '<label>Voyageurs</label><select id="fvP"><option>1</option><option selected>2</option><option>3</option><option>4</option></select>' +
      '<label>Mon budget vol, aller-retour, par personne (€)</label><input id="fvB" type="number" inputmode="numeric" value="1200">' +
      '<label>Ce qui compte pour moi</label><select id="fvW"><option value="cheap">Le moins cher possible</option><option value="fast">Le plus rapide</option><option value="bkk">Passer 2 jours à Bangkok</option></select></div>' +
      '<div id="fvR"></div>';
    function season(m){ return (m === 7 || m === 8 || m === 12 || m === 1 || m === 4) ? 'haute' : 'basse'; }
    function calc(){
      var o = body.querySelector('#fvO').value, dst = body.querySelector('#fvD').value, dt = new Date(body.querySelector('#fvDate').value), n = parseInt(body.querySelector('#fvN').value, 10), px = parseInt(body.querySelector('#fvP').value, 10), bud = parseFloat(body.querySelector('#fvB').value) || 0, w = body.querySelector('#fvW').value;
      if(isNaN(dt.getTime())) return;
      var ret = new Date(dt.getTime() + n * 864e5), m = dt.getMonth() + 1, sea = season(m), h = '';
      var low, ok;
      if(o === 'RUN'){ low = 1100; ok = 1400; } else { low = 500; ok = 800; }
      var cls = bud < low ? 'ko' : (bud < ok ? 'ok' : 'ok');
      var msg = bud < low ? 'Budget très serré : peu probable hors promotion.' : (bud < ok ? 'Budget tendu mais possible, surtout hors vacances et en réservant tôt.' : 'Budget confortable pour ce trajet.');
      h += '<div class="res ' + cls + '">' + msg + '<br><span class="small">Pour ' + px + ' voyageur' + (px > 1 ? 's' : '') + ' : ' + Math.round(bud * px) + ' € au total. Repère moyen par personne : ' + (o === 'RUN' ? 'environ 1 300 à 1 400 € depuis La Réunion' : 'environ 500 à 900 € hors vacances depuis Paris, plus en haute saison') + '. Prix indicatifs, ils changent chaque jour.</span></div>';
      h += '<h4>Mon plan Malin</h4><div class="card">';
      var tips = [];
      tips.push(sea === 'haute' ? '📅 Ton départ tombe en <b>haute saison</b> : décaler de 2 à 3 semaines peut faire baisser le prix.' : '📅 Ton départ est en <b>saison plus calme</b> : bon moment pour payer moins cher.');
      tips.push('⏰ Réserve <b>5 à 9 mois à l’avance</b> : réserver 6 semaines avant est souvent le pire moment.');
      if(o === 'RUN'){ tips.push('🛫 Compare <b>Réunion – Bangkok en direct</b> (Air Austral) puis Bangkok – Japon, et <b>Réunion – Paris – Japon</b>.'); tips.push('🔗 Avec deux billets séparés, ton bagage n’est pas enregistré jusqu’au bout : garde 4 à 5 h de marge.'); }
      else tips.push('🛫 Compare les départs de <b>plusieurs aéroports</b> et les vols avec une escale, souvent moins chers.');
      if(dst === 'TYO') tips.push('🔁 Vol « open jaw » : arrive à Tokyo et repars d’Osaka (ou l’inverse) pour éviter de refaire le trajet en Shinkansen.');
      if(w === 'bkk') tips.push('🌃 Bangkok au retour : 2 nuits sur place, et une nuit près de l’aéroport avant un vol du matin.');
      if(w === 'fast') tips.push('⚡ Pour aller plus vite, filtre sur « vols directs ou 1 escale courte » : c’est souvent plus cher.');
      if(w === 'cheap') tips.push('💸 Filtre par prix croissant et regarde aussi les jours voisins : décaler d’un jour peut changer beaucoup.');
      tips.push('🧳 Vérifie si le tarif inclut un <b>bagage en soute</b> : les tarifs « Light » n’en ont pas.');
      h += tips.join('<br><br>') + '</div>';
      var from = o === 'RUN' ? 'RUN' : 'PAR', to = dst, d1 = iso(dt), d2 = iso(ret);
      var gf = 'https://www.google.com/travel/flights?q=' + encodeURIComponent('Flights from ' + from + ' to ' + to + ' on ' + d1 + ' through ' + d2 + ' economy') ;
      var ky = 'https://www.kayak.fr/flights/' + from + '-' + to + '/' + d1 + '/' + d2 + '/' + px + 'adults?sort=price_a';
      h += '<h4>Lance la recherche</h4><a class="btn" target="_blank" rel="noopener sponsored" href="https://fr.trip.com/?Allianceid=9852508&SID=327644129&trip_sub3=D19106369&locale=fr-fr">Trip.com : comparer les vols</a>' +
        '<a class="btn" style="background:#2a2f3a" target="_blank" rel="noopener" href="' + ky + '">Kayak : ' + from + ' → ' + to + ', dates remplies</a>' +
        '<a class="btn" style="background:#2a2f3a" target="_blank" rel="noopener" href="' + gf + '">Google Flights : dates remplies</a>';
      if(o === 'RUN') h += '<a class="btn" style="background:#2a2f3a" target="_blank" rel="noopener" href="https://www.kayak.fr/flights/RUN-BKK/' + d1 + '/' + d2 + '/' + px + 'adults?sort=price_a">Étape 1 : Réunion → Bangkok (direct)</a><a class="btn" style="background:#2a2f3a" target="_blank" rel="noopener" href="https://www.kayak.fr/flights/BKK-' + to + '/' + d1 + '/' + d2 + '/' + px + 'adults?sort=price_a">Étape 2 : Bangkok → ' + (to === 'TYO' ? 'Tokyo' : 'Osaka') + '</a>';
      h += '<div class="small">Les prix s’affichent sur le site du comparateur, pas ici. Les dates sont pré-remplies : ajuste-les sur place.</div>';
      body.querySelector('#fvR').innerHTML = h;
    }
    body.oninput = calc; body.onchange = calc; calc();
  }

  T.register({f_urgence: f_urgence, trouve: trouve, f_gares: f_gares, f_distrib: f_distrib, f_toilettes: f_toilettes, f_consigne: f_consigne, f_onsen: f_onsen, f_manger: f_manger, f_secret: f_secret, f_insolite: f_insolite, jrpass: jrpass, detaxe: detaxe, vols: vols, taxes: taxes, affil: affil});
})();
