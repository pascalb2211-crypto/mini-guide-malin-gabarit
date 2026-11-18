/* Outils Mini Guide Malin Japon : simulateur JR Pass, détaxe, vols depuis La Réunion, taxes de séjour, liens d'affiliation.
   Données vérifiées le 18 novembre 2026 (sources : JR Group / JR Central / Ekitan, Japan Tourism Agency & JNTO, Air Austral, villes de Tokyo et Kyoto). */
(function(){
  var CSS = '#jtWrap{position:fixed;inset:0;z-index:100005;background:#0f1115;display:none;flex-direction:column;font-family:"Segoe UI",Arial,sans-serif;color:#fff}#jtWrap.on{display:flex}' +
    '#jtTop{display:flex;align-items:center;justify-content:space-between;padding:max(12px,env(safe-area-inset-top)) 16px 10px;font-weight:800;font-size:17px;gap:10px}#jtX{background:#ffffff1f;border:0;color:#fff;border-radius:999px;padding:8px 14px;font-weight:700;font-size:14px;flex:none}' +
    '#jtBody{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:0 16px calc(24px + env(safe-area-inset-bottom));font-size:15px;line-height:1.5}' +
    '#jtBody h4{color:#f0955a;margin:18px 0 6px;font-size:16px}#jtBody p{margin:6px 0}#jtBody .card{background:#1a1d24;border:1px solid #ffffff22;border-radius:14px;padding:12px 14px;margin:10px 0}' +
    '#jtBody .small{font-size:12.5px;opacity:.7}#jtBody .step{display:flex;gap:12px;margin:12px 0}#jtBody .step b.n{flex:none;width:28px;height:28px;border-radius:50%;background:#d35400;display:flex;align-items:center;justify-content:center;font-size:14px}' +
    '#jtBody table{width:100%;border-collapse:collapse;margin:8px 0}#jtBody td,#jtBody th{padding:7px 6px;border-bottom:1px solid #ffffff22;text-align:left;font-size:14px}#jtBody th{color:#f0955a}' +
    '#jtBody label{display:block;font-size:13px;opacity:.8;margin:10px 0 4px}#jtBody input,#jtBody select{width:100%;padding:11px;border-radius:10px;border:1px solid #ffffff33;background:#242424;color:#fff;font-size:16px}' +
    '#jtBody .row{display:flex;align-items:center;gap:10px;margin:8px 0}#jtBody .row span{flex:1}#jtBody .row select{width:76px;flex:none}' +
    '#jtBody .res{border-radius:14px;padding:14px;margin:14px 0;font-weight:700;font-size:16px}#jtBody .ok{background:#12361f;border:1px solid #2e8b57}#jtBody .ko{background:#3a1717;border:1px solid #c0392b}' +
    '#jtBody a.btn{display:block;text-align:center;text-decoration:none;color:#fff;font-weight:700;border-radius:999px;padding:12px;margin:10px 0;background:linear-gradient(135deg,#d35400,#f0955a)}';
  var wrap, title, body;
  function build(){
    if(wrap) return;
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    wrap = document.createElement('div'); wrap.id = 'jtWrap';
    wrap.innerHTML = '<div id="jtTop"><span id="jtTitle"></span><button id="jtX" type="button">Fermer ✕</button></div><div id="jtBody"></div>';
    document.body.appendChild(wrap); title = wrap.querySelector('#jtTitle'); body = wrap.querySelector('#jtBody');
    wrap.querySelector('#jtX').addEventListener('click', close);
  }
  function close(){ wrap.classList.remove('on'); document.documentElement.style.overflow = ''; }
  CSS += '#jtBody .chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}#jtBody .chip{border:1px solid #ffffff33;background:#242424;color:#fff;border-radius:999px;padding:9px 14px;font-size:14px;font-weight:600}#jtBody .chip.on{background:#d35400;border-color:#d35400}' +
    '#jtBody .fl{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:#1a1d24;border:1px solid #ffffff22;border-radius:14px;color:#fff;padding:14px;margin:8px 0;font-size:16px;font-weight:700}#jtBody .fl small{display:block;font-weight:400;opacity:.65;font-size:12.5px}#jtBody .fl .e{font-size:26px}' +
    '#jtBody .ck{display:flex;gap:12px;align-items:flex-start;padding:11px 12px;margin:7px 0;border-radius:12px;background:#1a1d24;border:1px solid #ffffff22;width:100%;color:#fff;text-align:left;font-size:15px}#jtBody .ck i{flex:none;width:24px;height:24px;border-radius:7px;border:2px solid #ffffff66;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:15px}#jtBody .ck.on{border-color:#2e8b57;background:#12361f}#jtBody .ck.on i{background:#2e8b57;border-color:#2e8b57}' +
    '#jtBody .bar{height:8px;border-radius:99px;background:#ffffff22;overflow:hidden;margin:8px 0}#jtBody .bar b{display:block;height:100%;background:#f0955a;width:0}' +
    '#jtBody .panel{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#e8e8e8;border-radius:16px;padding:14px;margin:12px 0}#jtBody .panel button{background:#fff;border:2px solid #999;border-radius:12px;padding:14px 6px;font-size:20px;font-weight:800;color:#222}#jtBody .panel button.on{border-color:#d35400;background:#ffe9d9}' +
    '#jtBody .big{font-size:34px;font-weight:800;text-align:center;margin:6px 0}#jtBody .fc{background:#1a1d24;border:1px solid #ffffff22;border-radius:14px;padding:16px;margin:8px 0;width:100%;color:#fff;text-align:center}#jtBody .fc .jp{font-size:28px;font-weight:800}#jtBody .fc .fr{font-size:15px;opacity:.9;margin-top:6px}' +
    '#jtBody .vm{background:#1a1d24;border:3px solid #555;border-radius:16px;padding:12px;margin:12px 0}#jtBody .vm .sl{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}#jtBody .vm button{border:0;border-radius:10px;padding:12px 4px;color:#fff;font-weight:700;font-size:13px;line-height:1.3}#jtBody .hot{background:#b22a1e}#jtBody .cold{background:#1f5fa8}' +
    '#jtBody .back{background:none;border:0;color:#f0955a;font-size:15px;font-weight:700;padding:6px 0;margin-bottom:4px}';
  function rate(){ var C = (window.MG && MG.currency) || {}; try{ var r = parseFloat(localStorage.getItem(C.rateKey || "tm-rate")); if(r >= (C.min || 0) && r <= (C.max || 1e9) && r > 0) return r; }catch(e){} return C.fallback || 1; }
  function money(n){ var C = (window.MG && MG.currency) || {}; return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + (C.symbol || ''); }
  function eur(n){ return '≈ ' + Math.round(n / rate()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €'; }
  var FK = 'tm-' + ((window.MG && MG.slug) || 'mg') + '-fiches';
  function fget(){ try{ return JSON.parse(localStorage.getItem(FK) || '{}'); }catch(e){ return {}; } }
  function fset(o){ try{ localStorage.setItem(FK, JSON.stringify(o)); }catch(e){} }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function backBtn(){ var b = document.createElement('button'); b.className = 'back'; b.type = 'button'; b.textContent = '← Toutes les fiches'; b.onclick = function(){ window.MGTools.open('fiches'); }; body.insertBefore(b, body.firstChild); }
  function checklist(key, items, label){
    var st = fget(), done = st[key] || {}, html = '<div class="bar"><b id="cb_' + key + '"></b></div><div class="small" id="cn_' + key + '"></div>';
    items.forEach(function(t, i){ html += '<button type="button" class="ck" data-k="' + key + '" data-i="' + i + '"><i></i><span>' + t + '</span></button>'; });
    return { html: html, bind: function(){
      function paint(){ var d = fget()[key] || {}, n = 0; Array.prototype.forEach.call(body.querySelectorAll('.ck[data-k="' + key + '"]'), function(b){ var on = !!d[b.getAttribute('data-i')]; b.classList.toggle('on', on); b.firstChild.textContent = on ? '✓' : ''; if(on) n++; });
        body.querySelector('#cb_' + key).style.width = (100 * n / items.length) + '%'; body.querySelector('#cn_' + key).textContent = n + ' / ' + items.length + ' ' + (label || 'fait'); }
      Array.prototype.forEach.call(body.querySelectorAll('.ck[data-k="' + key + '"]'), function(b){ b.onclick = function(){ var s = fget(); s[key] = s[key] || {}; var i = b.getAttribute('data-i'); if(s[key][i]) delete s[key][i]; else s[key][i] = 1; fset(s); paint(); }; });
      paint(); } };
  }
  function chips(id, opts, cb, first){
    var box = body.querySelector(id); box.innerHTML = '';
    opts.forEach(function(o, i){ var b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (i === (first || 0) ? ' on' : ''); b.textContent = o[0]; b.onclick = function(){ Array.prototype.forEach.call(box.children, function(c){ c.classList.remove('on'); }); b.classList.add('on'); cb(o[1], i); }; box.appendChild(b); });
    cb(opts[first || 0][1], first || 0);
  }

  function fiches(){
    title.textContent = '📘 Fiches pratiques';
    var L = (window.MG && MG.fiches) || [];
    body.innerHTML = '<p>Appuie sur une fiche. Les cases cochées sont gardées sur ton téléphone.</p>';
    L.forEach(function(x){ var b = document.createElement('button'); b.type = 'button'; b.className = 'fl'; b.innerHTML = '<span class="e">' + x[1] + '</span><span>' + x[2] + '<small>' + x[3] + '</small></span>'; b.onclick = function(){ window.MGTools.open(x[0]); }; body.appendChild(b); });
  }

  var TOOLS = {};
  var hooks = [];
  window.MGT = { get title(){ return title; }, get body(){ return body; }, build: build, close: close, rate: rate, money: money, eur: eur, fget: fget, fset: fset, esc: esc, backBtn: backBtn, checklist: checklist, chips: chips,
    onBuild: function(f){ hooks.push(f); if(wrap) f(title, body); }, register: function(o){ for(var k in o) TOOLS[k] = o[k]; } };
  var _build = build; build = function(){ var first = !wrap; _build(); if(first) hooks.forEach(function(f){ f(title, body); }); };
  window.MGTools = { open: function(n){ if(n.indexOf('app_') === 0){ if(window.MGApp && MGApp[n.slice(4)]) MGApp[n.slice(4)](); return; } if(n.indexOf('city_') === 0){ if(window.CityGuide){ var pr = n.slice(5).split('@'); CityGuide.open(pr[0], pr[1]); } return; } build(); body.oninput = body.onchange = null; if(n === 'fiches'){ fiches(); } else { if(!TOOLS[n]) return; TOOLS[n](); } wrap.classList.add('on'); body.scrollTop = 0; document.documentElement.style.overflow = 'hidden'; } };
})();

/* Icône 💱 après chaque prix dans la monnaie du guide -> ouvre le convertisseur */
(function(){
  var css = document.createElement('style');
  css.textContent = '.yl{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;margin:0 2px 0 4px;border-radius:50%;background:#d3540033;border:1px solid #d35400;font-size:11px;line-height:1;cursor:pointer;vertical-align:middle;text-decoration:none;-webkit-tap-highlight-color:transparent}.yl:active{transform:scale(.9)}';
  document.head.appendChild(css);
  var C = (window.MG && MG.currency) || {}; if(!C.symbol) return;
  function rxEsc(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var CUR = '(?:' + rxEsc(C.symbol) + (C.words ? '|' + C.words : '') + ')';
  var NUM = '\\d[\\d\\u202f\\u00a0 ]*\\d|\\d';
  var RX = new RegExp('(' + NUM + ')(\\s*(?:à|–|-)\\s*(?:' + NUM + '))?\\s*' + CUR, 'g');
  var SKIP = /^(BUTTON|INPUT|SELECT|OPTION|TEXTAREA|SCRIPT|STYLE|A)$/;
  function scan(root){
    if(!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [], n;
    while((n = w.nextNode())){
      var p = n.parentNode; if(!p || SKIP.test(p.nodeName) || (p.closest && p.closest('.yl,button,select,a'))) continue;
      RX.lastIndex = 0; var mm = RX.exec(n.nodeValue); if(!mm) continue;
      var ns = n.nextSibling; if(ns && ns.className === 'yl' && mm.index + mm[0].length === n.nodeValue.length && !RX.exec(n.nodeValue)) continue;
      list.push(n);
    }
    list.forEach(function(t){
      var s = t.nodeValue, f = document.createDocumentFragment(), last = 0, m; RX.lastIndex = 0;
      while((m = RX.exec(s))){
        var end = m.index + m[0].length;
        f.appendChild(document.createTextNode(s.slice(last, end)));
        var b = document.createElement('span'); b.className = 'yl'; b.setAttribute('role', 'button'); b.setAttribute('aria-label', 'Convertir en euros'); b.textContent = '💱';
        b.setAttribute('data-y', m[1].replace(/[^\d]/g, ''));
        f.appendChild(b); last = end;
      }
      f.appendChild(document.createTextNode(s.slice(last)));
      t.parentNode.replaceChild(f, t);
    });
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.yl'); if(!b) return;
    e.preventDefault(); e.stopPropagation();
    if(window.MGApp) MGApp.converter(parseFloat(b.getAttribute('data-y')) || 0);
  }, true);
  var busy = false, tm = 0;
  function run(){ busy = true; try{ scan(document.getElementById('jtWrap')); scan(document.getElementById('cgWrap')); }catch(e){} busy = false; }
  new MutationObserver(function(){ if(busy) return; clearTimeout(tm); tm = setTimeout(run, 30); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
