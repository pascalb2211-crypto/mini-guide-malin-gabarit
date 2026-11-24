#!/usr/bin/env python3
"""Mini Guide Malin — générateur.
Usage :  python3 build.py japon            -> dist/japon/
         python3 build.py japon --out ../mini-guide-japon-thaimalin
         python3 build.py nouveau-guide --check   (vérifie seulement)
Un guide = un dossier guides/<slug>/ : guide.json + images/pageN.webp + zones.json + data/*.json (+ guide.js, map.js facultatifs).
Le moteur (engine/) est commun à tous les guides : on ne le modifie qu'une fois pour tous."""
import json, os, re, shutil, sys, glob
ROOT = os.path.dirname(os.path.abspath(__file__))
def rd(p): return open(p, encoding='utf-8').read()
def wr(p, s): os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'w', encoding='utf-8').write(s)
def h(s):  # HTML : caractères non ASCII en entités, comme les guides existants
    out = []
    for ch in str(s):
        if ch in '&<>"\'': out.append({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'}[ch])
        elif ord(ch) > 126: out.append('&#x%X;' % ord(ch))
        else: out.append(ch)
    return ''.join(out)

def main():
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    if not a: sys.exit(__doc__)
    slug = a[0]; check = '--check' in sys.argv
    out = os.path.join(ROOT, 'dist', slug)
    if '--out' in sys.argv: out = os.path.abspath(sys.argv[sys.argv.index('--out') + 1])
    gd = os.path.join(ROOT, 'guides', slug)
    cfg = json.load(open(os.path.join(gd, 'guide.json'), encoding='utf-8'))
    cat = json.load(open(os.path.join(ROOT, 'catalogue.json'), encoding='utf-8'))
    pages = cfg['pages']; N = len(pages); first = cfg.get('firstPage', 1)
    errors = []
    for i in range(1, N + 1):
        if not os.path.exists(os.path.join(gd, 'images', 'page%d.webp' % i)): errors.append('image manquante : images/page%d.webp' % i)
    zp = os.path.join(gd, 'zones.json')
    if os.path.exists(zp):
        z = json.load(open(zp, encoding='utf-8'))
        for k, zs in z.items():
            if not k.isdigit() or int(k) > N: errors.append('zones.json : page %s inconnue' % k)
            for zz in zs:
                if len(zz) > 4:
                    for lab, url in zz[4]:
                        m = re.match(r'tool:city_([a-z0-9_]+)', url)
                        if m and not os.path.exists(os.path.join(gd, 'data', m.group(1) + '.json')): errors.append('zones.json page %s : data/%s.json introuvable' % (k, m.group(1)))
    for e in errors: print('ERREUR', e)
    if errors: sys.exit(1)
    if check: print('OK : %d pages, aucune erreur' % N); return
    if os.path.isdir(out):
        for f in os.listdir(out):
            if f in ('.git', 'CNAME'): continue
            p = os.path.join(out, f); shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    os.makedirs(out, exist_ok=True)
    # moteur + fichiers du guide
    for f in ('gate.js', 'pwa.js', 'city.js', 'tools.js'): shutil.copy(os.path.join(ROOT, 'engine', f), os.path.join(out, f))
    extra = []
    for f in ('guide.js', 'map.js'):
        if os.path.exists(os.path.join(gd, f)): shutil.copy(os.path.join(gd, f), os.path.join(out, f)); extra.append(f)
    for d in ('data', 'images'):
        if os.path.isdir(os.path.join(gd, d)): shutil.copytree(os.path.join(gd, d), os.path.join(out, d))
    if os.path.exists(zp): shutil.copy(zp, os.path.join(out, 'zones.json'))
    icons = os.path.join(gd, 'icons')
    if os.path.isdir(icons): shutil.copytree(icons, os.path.join(out, 'icons'))
    else: make_icons(os.path.join(gd, 'images', 'page%d.webp' % first), os.path.join(out, 'icons'))
    # config.js
    keys = ['slug','name','shortName','pwPrefix','currency','phrases','phrasesLabel','translateTo','mapLabel','mapPage','hasMap','toolsMenu','fiches','weatherLabel']
    mg = {k: cfg[k] for k in keys if k in cfg}
    mg['catalog'] = cat['guides']; mg['catalogUrl'] = cat.get('catalogUrl', '')
    # liens affiliés : liens-affilies.json (partenaires actifs, filtrés par pays du guide)
    bk = cfg.get('booking', {}).get('code', '')
    ap = os.path.join(ROOT, 'liens-affilies.json')
    if os.path.exists(ap):
        aff = []
        for x in json.load(open(ap, encoding='utf-8')).get('partenaires', []):
            if not x.get('actif') or not x.get('url'): continue
            if x.get('pays') and bk not in x['pays']: continue
            aff.append([x['emoji'] + ' ' + x['titre'], x['sous_titre'], x['url'].replace('{BK}', bk)])
        mg['affiliates'] = aff
        mg['affMap'] = {x['id']: x['url'].replace('{BK}', bk) for x in json.load(open(ap, encoding='utf-8')).get('partenaires', []) if x.get('actif') and x.get('url') and (not x.get('pays') or bk in x['pays'])}
    wr(os.path.join(out, 'config.js'), '/* Généré par build.py à partir de guides/%s/guide.json et liens-affilies.json : ne pas modifier ici. */\nwindow.MG = %s;\nMG.aff = function(u){ if(typeof u !== "string" || u.indexOf("aff:") !== 0) return u; return (MG.affMap && MG.affMap[u.slice(4)]) || ""; };\n' % (slug, json.dumps(mg, ensure_ascii=False, separators=(',', ':'))))
    # pages
    head = rd(os.path.join(ROOT, 'engine', 'page-head.html'))
    toc = ';'.join('%d|%s' % (i + 1, p['title']) for i, p in enumerate(pages))
    cur = (cfg.get('currency') or {}).get('code', '')
    pwa = '<script src="pwa.js" data-nav="pages" data-booking="%s" data-booking-page="%s" data-toc="%s" data-weather="%s" data-first="%d" data-total="%d" data-name="%s" data-slug="%s" data-cur="%s"></script>' % (
        h(cfg.get('booking', {}).get('code', '')), cfg.get('booking', {}).get('page', 0), h(toc), h(cfg.get('weather', '')), first, N, h(cfg['name']), h(slug), cur)
    for i, p in enumerate(pages, 1):
        title = '%s — Page %d' % (cfg['name'], i)
        m = p.get('map')
        nav = []
        mapbtn = ('<button type="button" class="hotspot btn-prev" onclick="MGMap.open(%s)" style="font-family:inherit;cursor:pointer%s">%s</button>' % (m['arg'], ';min-width:0;flex:0 0 auto;padding:0 14px' if m.get('hot') else '', h(m['label']))) if m else ''
        if m and not m.get('hot'): nav.append(mapbtn)
        if i > 1: nav.append('<a href="page%d.html" class="hotspot btn-prev">%s</a>' % (i - 1, h('← Précédent')))
        if m and m.get('hot'): nav.append(mapbtn)
        if i < N: nav.append('<a href="page%d.html" class="hotspot btn-next">%s</a>' % (i + 1, h(p.get('nextLabel', 'Suivant →'))))
        else: nav.append('<a href="page%d.html" class="hotspot btn-restart">%s</a>' % (first, h('Retour à la couverture')))
        hot = ''
        extra_html = ('\n' + p['html']) if p.get('html') else ''
        if m and m.get('hot'): hot = '\n  <button type="button" id="mapBtn" aria-label="%s" style="position:absolute;%s;background:transparent;border:0;cursor:pointer"></button>' % (h(m.get('aria', 'Ouvrir la carte')), m['hot'])
        scripts = ['config.js', 'gate.js'] + (['map.js'] if m and 'map.js' in extra else []) + ['tools.js'] + (['guide.js'] if 'guide.js' in extra else []) + ['city.js']
        body = '<body>\n\n<div class="page">\n  <img src="images/page%d.webp" alt="%s">%s\n</div>\n<div class="navbar">\n  %s\n</div>\n\n%s\n%s\n%s</body>\n</html>\n' % (
            i, h(p.get('alt', p['title'])), hot + extra_html, '\n  '.join(nav), '\n'.join('<script src="%s"></script>' % s for s in scripts), pwa,
            ('<script>document.getElementById("mapBtn").addEventListener("click",function(){MGMap.open(%s);});</script>\n' % m['arg']) if m and m.get('hot') else '')
        wr(os.path.join(out, 'page%d.html' % i), head.replace('</style>', (p.get('css', '') + '\n</style>') if p.get('css') else '</style>', 1).replace('{{TITLE}}', h(title)).replace('{{SHORT}}', h(cfg['shortName'])) + body)
    wr(os.path.join(out, 'index.html'), '<!DOCTYPE html>\n<html lang="fr">\n<head>\n<meta charset="UTF-8">\n<meta http-equiv="refresh" content="0; url=page%d.html">\n<title>%s</title>\n</head>\n<body>\n<p>Redirection vers <a href="page%d.html">%s</a>...</p>\n</body>\n</html>\n' % (first, h(cfg['name']), first, h(cfg['name'])))
    wr(os.path.join(out, 'manifest.json'), json.dumps({"id": "./", "name": cfg['name'], "short_name": cfg['shortName'], "start_url": "./index.html", "scope": "./", "display": "standalone", "orientation": "portrait", "background_color": "#0f1115", "theme_color": "#0f1115", "lang": cfg.get('lang', 'fr'), "icons": [
        {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"}, {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}, {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}, ensure_ascii=False, indent=2))
    # service worker
    core = ['./', 'index.html', 'config.js', 'gate.js', 'pwa.js', 'tools.js', 'city.js'] + extra
    core += sorted('data/' + os.path.basename(f) for f in glob.glob(os.path.join(gd, 'data', '*.json')))
    core += ['zones.json', 'manifest.json'] + ['page%d.html' % i for i in range(1, N + 1)] + ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png']
    imgs = ['images/page%d.webp' % i for i in range(1, N + 1)]
    sw = rd(os.path.join(ROOT, 'engine', 'service-worker.tpl.js'))
    sw = sw.replace('{{CACHE}}', '%s-v%s' % (cfg['cacheName'], cfg['version'])).replace('{{CACHEPREFIX}}', cfg['cacheName']).replace('{{CORE}}', json.dumps(core, indent=2)).replace('{{IMAGES}}', json.dumps(imgs, indent=2))
    wr(os.path.join(out, 'service-worker.js'), sw)
    print('Guide « %s » généré : %d pages -> %s' % (cfg['name'], N, out))

def make_icons(cover, dest):
    from PIL import Image
    os.makedirs(dest, exist_ok=True)
    im = Image.open(cover).convert('RGB'); w, hh = im.size; s = min(w, hh)
    sq = im.crop(((w - s) // 2, 0, (w - s) // 2 + s, s))
    for name, size in (('icon-192.png', 192), ('icon-512.png', 512), ('apple-touch-icon.png', 180), ('favicon-32.png', 32)): sq.resize((size, size)).save(os.path.join(dest, name))
    mk = Image.new('RGB', (512, 512), (15, 17, 21)); inner = sq.resize((384, 384)); mk.paste(inner, (64, 64)); mk.save(os.path.join(dest, 'icon-maskable-512.png'))

if __name__ == '__main__': main()
