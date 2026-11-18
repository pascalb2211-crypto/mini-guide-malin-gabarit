/* Guide de ville interactif (Mini Guide Malin) : moteur + données dans data/<ville>.json */
(function(){
  var CSS = '#cgWrap{position:fixed;inset:0;z-index:100004;background:#0f1115;display:none;flex-direction:column;font-family:"Segoe UI",Arial,sans-serif;color:#fff}#cgWrap.on{display:flex}' +
  '#cgTop{display:flex;align-items:center;justify-content:space-between;padding:max(12px,env(safe-area-inset-top)) 16px 6px;gap:10px;font-weight:800;font-size:18px}#cgX{background:#ffffff1f;border:0;color:#fff;border-radius:999px;padding:8px 14px;font-weight:700;font-size:14px}' +
  '#cgTabs{display:flex;gap:8px;overflow-x:auto;padding:6px 16px 10px;scrollbar-width:none}#cgTabs::-webkit-scrollbar{display:none}#cgTabs button{flex:none;border:1px solid #ffffff33;background:#242424;color:#fff;border-radius:999px;padding:9px 15px;font-size:14px;font-weight:700}#cgTabs button.on{background:#d35400;border-color:#d35400}' +
  '#cgBody{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:4px 16px calc(28px + env(safe-area-inset-bottom));font-size:15px;line-height:1.5}' +
  '@keyframes cgIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes cgGrow{from{height:0}to{height:100%}}@keyframes cgPop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}' +
  '#cgBody .a{opacity:0;animation:cgIn .45s ease forwards}#cgBody .hero{background:linear-gradient(135deg,#7a2e00,#d35400);border-radius:18px;padding:18px;margin:6px 0 12px}#cgBody .hero b{font-size:20px}' +
  '#cgBody .card{background:#1a1d24;border:1px solid #ffffff22;border-radius:14px;padding:12px 14px;margin:10px 0}#cgBody .row{display:flex;gap:12px;align-items:flex-start}#cgBody .ic{font-size:26px;flex:none;animation:cgPop .5s ease both}#cgBody .small{font-size:12.5px;opacity:.7}' +
  '#cgBody h4{color:#f0955a;margin:16px 0 6px;font-size:16px}#cgBody .chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}#cgBody .chip{border:1px solid #ffffff33;background:#242424;color:#fff;border-radius:999px;padding:9px 14px;font-size:14px;font-weight:600}#cgBody .chip.on{background:#d35400;border-color:#d35400}' +
  '#cgBody .site{border-left:4px solid #d35400}#cgBody .site.done{border-left-color:#2e8b57;background:#12361f}#cgBody .tag{display:inline-block;background:#ffffff1a;border-radius:8px;padding:2px 8px;font-size:12px;margin:4px 6px 0 0}#cgBody .tip{background:#3a2a10;border-radius:10px;padding:8px 10px;margin-top:8px;font-size:13.5px}' +
  '#cgBody .tl{position:relative;margin:12px 0 12px 14px;padding-left:22px}#cgBody .tl:before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:3px;background:#d35400;border-radius:3px;animation:cgGrow 1.1s ease both}' +
  '#cgBody .st{position:relative;margin:0 0 16px}#cgBody .st:before{content:"";position:absolute;left:-30px;top:5px;width:13px;height:13px;border-radius:50%;background:#f0955a;border:3px solid #0f1115}#cgBody .st .t{color:#f0955a;font-weight:800;font-size:14px}' +
  '#cgBody input{width:100%;padding:11px;border-radius:10px;border:1px solid #ffffff33;background:#242424;color:#fff;font-size:16px}#cgBody .res{border-radius:14px;padding:14px;margin:12px 0;font-weight:700}#cgBody .ok{background:#12361f;border:1px solid #2e8b57}#cgBody .ko{background:#3a1717;border:1px solid #c0392b}' +
  '#cgBody .bar{height:8px;border-radius:99px;background:#ffffff22;overflow:hidden;margin:8px 0}#cgBody .bar b{display:block;height:100%;background:#f0955a;width:0;transition:width .5s}' +
  '#cgBody a.btn{display:block;text-align:center;text-decoration:none;color:#fff;font-weight:700;border-radius:999px;padding:12px;margin:10px 0;background:linear-gradient(135deg,#d35400,#f0955a)}#cgBody button.site{width:100%;text-align:left;color:#fff;font-size:15px}';
  var wrap, titleEl, tabsEl, bodyEl, D = null, cache = {};
  function build(){ if(wrap) return; var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    wrap = document.createElement('div'); wrap.id = 'cgWrap'; wrap.innerHTML = '<div id="cgTop"><span id="cgT"></span><button id="cgX" type="button">Fermer ✕</button></div><div id="cgTabs"></div><div id="cgBody"></div>';
    document.body.appendChild(wrap); titleEl = wrap.querySelector('#cgT'); tabsEl = wrap.querySelector('#cgTabs'); bodyEl = wrap.querySelector('#cgBody');
    wrap.querySelector('#cgX').onclick = function(){ wrap.classList.remove('on'); document.documentElement.style.overflow = ''; }; }
  function jp(n){ return Math.round(n / MGT.rate()); }
  function yen(n){ return MGT.money(n); }
  function stag(){ var els = bodyEl.querySelectorAll('.a'); for(var i = 0; i < els.length; i++) els[i].style.animationDelay = (i * 70) + 'ms'; }
  function store(k, v){ try{ if(v === undefined) return JSON.parse(localStorage.getItem('tm-cg-' + k) || '{}'); localStorage.setItem('tm-cg-' + k, JSON.stringify(v)); }catch(e){ return {}; } }
  function chips(sel, opts, cb){ var box = bodyEl.querySelector(sel); box.innerHTML = ''; opts.forEach(function(o, i){ var b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (i === 0 ? ' on' : ''); b.textContent = o[0]; b.onclick = function(){ Array.prototype.forEach.call(box.children, function(c){ c.classList.remove('on'); }); b.classList.add('on'); cb(o[1]); }; box.appendChild(b); }); cb(opts[0][1]); }

  var TABS = [['ess','L’essentiel'],['voir','À voir'],['iti','Itinéraire'],['pra','Pratique'],['ast','Astuces'],['res','Réserver']];
  function R(id){ bodyEl.scrollTop = 0; Array.prototype.forEach.call(tabsEl.children, function(b){ b.classList.toggle('on', b.getAttribute('data-id') === id); }); if(D.tabs){ var tt = D.tabs.filter(function(t){ return t.id === id; })[0]; blocksView(tt); } else VIEW[id](); stag(); }
  var VIEW = {
    ess: function(){ var h = '<div class="hero a"><b>' + D.emoji + ' ' + D.name + '</b><br>' + D.tagline + '</div>'; D.essential.forEach(function(e){ h += '<div class="card row a"><span class="ic">' + e.i + '</span><div><b>' + e.t + '</b><br>' + e.d + '</div></div>'; });
      h += '<div class="small a">Infos vérifiées en ' + D.checked + '. Prix et horaires peuvent changer : vérifie avant de partir.</div>'; bodyEl.innerHTML = h; },
    voir: function(){ var all = 0; D.sites.forEach(function(c){ all += c.items.length; });
      var h = '<p class="a">Touche un lieu pour le marquer comme vu.</p><div class="bar a"><b id="cgPb"></b></div><div class="small a" id="cgPn"></div>';
      D.sites.forEach(function(c, ci){ h += '<h4 class="a">' + c.c + '</h4>'; c.items.forEach(function(s, si){ var k = ci + '_' + si; h += '<button type="button" class="card site a" data-k="' + k + '"><b>' + s.n + '</b><br><span class="tag">💴 ' + s.p + '</span><span class="tag">🕗 ' + s.h + '</span><br>' + s.d + '<div class="tip">💡 ' + s.tip + '</div></button>'; }); });
      bodyEl.innerHTML = h;
      function paint(){ var d = store('voir-' + D.id), n = 0; Array.prototype.forEach.call(bodyEl.querySelectorAll('.site'), function(b){ var on = !!d[b.getAttribute('data-k')]; b.classList.toggle('done', on); if(on) n++; }); bodyEl.querySelector('#cgPb').style.width = (100 * n / all) + '%'; bodyEl.querySelector('#cgPn').textContent = n + ' / ' + all + ' lieux vus'; }
      Array.prototype.forEach.call(bodyEl.querySelectorAll('.site'), function(b){ b.onclick = function(){ var d = store('voir-' + D.id), k = b.getAttribute('data-k'); if(d[k]) delete d[k]; else d[k] = 1; store('voir-' + D.id, d); paint(); }; }); paint(); },
    iti: function(){ var ks = Object.keys(D.days); bodyEl.innerHTML = '<p class="a">Combien de jours as-tu ?</p><div class="chips a" id="cgD"></div><div id="cgI"></div><div class="small a">Un rythme tranquille : adapte-le à ta forme et à la météo.</div>';
      chips('#cgD', ks.map(function(k){ return ['Jour ' + k, k]; }), function(k){ var h = '<div class="tl">'; D.days[k].forEach(function(s){ h += '<div class="st a"><div class="t">' + s.t + '</div><b>' + s.n + '</b><br><span class="small">' + s.d + '</span></div>'; }); bodyEl.querySelector('#cgI').innerHTML = h + '</div>'; stag(); }); },
    pra: function(){ var h = '<h4 class="a">🏨 Où dormir</h4>'; D.stay.forEach(function(e){ h += '<div class="card row a"><span class="ic">' + e.i + '</span><div><b>' + e.t + '</b><br>' + e.d + '</div></div>'; });
      h += '<h4 class="a">🍜 Manger</h4>'; D.eat.forEach(function(e){ h += '<div class="card row a"><span class="ic">' + e.i + '</span><div><b>' + e.t + '</b><br>' + e.d + '</div></div>'; });
      h += '<h4 class="a">🚌 Se déplacer</h4>' + (D.calc ? '<div class="card a"><b>Combien de trajets aujourd’hui ?</b><input id="cgR" type="number" inputmode="numeric" value="4"><div id="cgRes"></div></div>' : '');
      D.move.forEach(function(m){ h += '<div class="card a">' + m + '</div>'; });
      if(D.tax) h += '<div class="card a"><b>Taxe de séjour</b><br>Calcule la tienne dans Outils → Taxes de séjour.</div>';
      bodyEl.innerHTML = h;
      function calc(){ var n = Math.max(0, parseInt(bodyEl.querySelector('#cgR').value, 10) || 0), p = n * D.calc.ride, c = D.calc.pass, r = bodyEl.querySelector('#cgRes');
        r.innerHTML = n ? (p === c ? '<div class="res ok">Équivalent : ' + n + ' × ' + yen(D.calc.ride) + ' = ' + yen(p) + ', comme le pass (' + yen(c) + ').</div>' : p > c ? '<div class="res ok">✅ ' + D.calc.passName + ' (' + yen(c) + ') est rentable : tu économises ' + yen(p - c) + ' (≈ ' + jp(p - c) + ' €).</div>' : '<div class="res ko">Paie au trajet : ' + n + ' × ' + yen(D.calc.ride) + ' = ' + yen(p) + ', moins que le pass (' + yen(c) + ').</div>') + '<div class="small">Ajoute les trajets en métro pour affiner : le pass les couvre aussi.</div>' : ''; }
      if(D.calc){ bodyEl.querySelector('#cgR').oninput = calc; calc(); } },
    ast: function(){ var h = ''; D.tips.forEach(function(e){ h += '<div class="card row a"><span class="ic">' + e.i + '</span><div><b>' + e.t + '</b><br>' + e.d + '</div></div>'; }); bodyEl.innerHTML = h; },
    res: function(){ var h = '<p class="a">Ces liens sont des liens d’affiliation : sans surcoût pour toi, ils aident à faire vivre le guide.</p>'; D.book.forEach(function(b){ h += '<a class="btn a" target="_blank" rel="noopener sponsored" href="' + b[1] + '">' + b[0] + '</a>'; }); bodyEl.innerHTML = h; }
  };

  function blocksView(tab){
    var h = '';
    tab.b.forEach(function(b, bi){
      if(b.k === 'cards') b.items.forEach(function(e){ h += '<div class="card row a"><span class="ic">' + e.i + '</span><div><b>' + e.t + '</b><br>' + e.d + '</div></div>'; });
      else if(b.k === 'check'){ h += '<div class="bar a"><b id="cgCb' + bi + '"></b></div><div class="small a" id="cgCn' + bi + '"></div>'; b.items.forEach(function(t, i){ h += '<button type="button" class="card site a" data-b="' + bi + '" data-i="' + i + '"><span>' + t + '</span></button>'; }); }
      else if(b.k === 'sum'){ h += '<h4 class="a">' + b.title + '</h4><div class="card a">'; b.fields.forEach(function(f, i){ h += '<div class="small" style="margin-top:8px">' + f[0] + '</div><input class="cgSum" type="number" inputmode="decimal" value="' + f[1] + '">'; }); h += '<div id="cgSumR" class="res ok"></div></div>'; }
      else if(b.k === 'clock'){ h += '<h4 class="a">Convertisseur d’heure</h4><div class="card a"><div class="small">Il est (heure de La Réunion) :</div><input id="cgClk" type="time" value="20:00"><div id="cgClkR" style="margin-top:10px"></div></div>'; }
      else if(b.k === 'btn'){ h += '<button type="button" class="btn a cgBtn" data-t="' + b.tool + '" style="width:100%;border:0;font-size:15px;border-radius:999px;padding:13px;color:#fff;font-weight:700;background:linear-gradient(135deg,#d35400,#f0955a)">' + b.label + '</button>'; }
      else if(b.k === 'links'){ h += '<p class="a">Ces liens sont des liens d’affiliation : sans surcoût pour toi, ils aident à faire vivre le guide.</p>'; D.book.forEach(function(x){ h += '<a class="btn a" target="_blank" rel="noopener sponsored" href="' + x[1] + '">' + x[0] + '</a>'; }); }
    });
    bodyEl.innerHTML = h;
    Array.prototype.forEach.call(bodyEl.querySelectorAll('.cgBtn'), function(x){ x.onclick = function(){ if(window.MGTools) MGTools.open(x.getAttribute('data-t')); }; });
    tab.b.forEach(function(b, bi){
      if(b.k === 'check'){ var key = 'chk-' + D.id + '-' + b.key;
        function paint(){ var d = store(key), n = 0; Array.prototype.forEach.call(bodyEl.querySelectorAll('.site[data-b="' + bi + '"]'), function(x){ var on = !!d[x.getAttribute('data-i')]; x.classList.toggle('done', on); if(on) n++; }); bodyEl.querySelector('#cgCb' + bi).style.width = (100 * n / b.items.length) + '%'; bodyEl.querySelector('#cgCn' + bi).textContent = n + ' / ' + b.items.length + ' ' + b.label; }
        Array.prototype.forEach.call(bodyEl.querySelectorAll('.site[data-b="' + bi + '"]'), function(x){ x.onclick = function(){ var d = store(key), i = x.getAttribute('data-i'); if(d[i]) delete d[i]; else d[i] = 1; store(key, d); paint(); }; }); paint(); }
      if(b.k === 'sum'){ var ins = bodyEl.querySelectorAll('.cgSum'); function s(){ var t = 0; Array.prototype.forEach.call(ins, function(i){ t += parseFloat(i.value) || 0; }); bodyEl.querySelector('#cgSumR').innerHTML = 'Total : ' + Math.round(t) + ' € <span class="small">(environ ' + Math.round(t * (parseFloat(localStorage.getItem('tm-jpy-rate')) || 175)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ¥)</span>'; } Array.prototype.forEach.call(ins, function(i){ i.oninput = s; }); s(); }
      if(b.k === 'clock'){ var c = bodyEl.querySelector('#cgClk'); function k(){ var v = (c.value || '00:00').split(':'), m = (+v[0]) * 60 + (+v[1]); function f(o){ var t = ((m + o * 60) % 1440 + 1440) % 1440, d = (m + o * 60) >= 1440 ? ' (lendemain)' : ((m + o * 60) < 0 ? ' (veille)' : ''); return ('0' + Math.floor(t / 60)).slice(-2) + ' h ' + ('0' + t % 60).slice(-2) + d; } bodyEl.querySelector('#cgClkR').innerHTML = '🇷🇪 La Réunion : <b>' + f(0) + '</b><br>🇹🇭 Bangkok : <b>' + f(3) + '</b><br>🇯🇵 Japon : <b>' + f(5) + '</b>'; } c.oninput = k; k(); }
    });
  }
  function show(id, tab){ D = cache[id]; D.id = id; titleEl.textContent = D.emoji + ' ' + D.name; tabsEl.innerHTML = ''; var tl = D.tabs ? D.tabs.map(function(t){ return [t.id, t.n]; }) : TABS; tl.forEach(function(t){ var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-id', t[0]); b.textContent = t[1]; b.onclick = function(){ R(t[0]); }; tabsEl.appendChild(b); }); wrap.classList.add('on'); document.documentElement.style.overflow = 'hidden'; R(tab || tl[0][0]); }
  window.CityGuide = { open: function(id, tab){ build(); if(cache[id]){ show(id, tab); return; }
    fetch('data/' + id + '.json').then(function(r){ return r.json(); }).then(function(j){ cache[id] = j; show(id, tab); }).catch(function(){ build(); titleEl.textContent = 'Guide indisponible'; bodyEl.innerHTML = '<p>Impossible de charger ce guide hors ligne pour l’instant. Ouvre l’appli une fois avec du réseau.</p>'; wrap.classList.add('on'); }); } };
})();
