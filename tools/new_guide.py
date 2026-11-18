#!/usr/bin/env python3
"""Crée un nouveau guide à partir du modèle.
   python3 tools/new_guide.py songkran "Mini Guide Malin · Songkran" "Malin Songkran" SONGKRAN
Crée guides/songkran/ avec des images provisoires (à remplacer par les tiennes, mêmes noms : page1.webp, page2.webp…)."""
import json, os, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if len(sys.argv) < 5: sys.exit(__doc__)
slug, name, short, prefix = sys.argv[1:5]
dst = os.path.join(ROOT, 'guides', slug)
if os.path.exists(dst): sys.exit('Le dossier guides/%s existe déjà.' % slug)
shutil.copytree(os.path.join(ROOT, 'guides', '_modele'), dst)
p = os.path.join(dst, 'guide.json'); c = json.load(open(p, encoding='utf-8'))
c.update({'slug': slug, 'name': name, 'shortName': short, 'pwPrefix': prefix.upper(), 'cacheName': 'tm-mg-' + slug})
json.dump(c, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
from PIL import Image, ImageDraw
for i, pg in enumerate(c['pages'], 1):
    im = Image.new('RGB', (1024, 1536), (26, 29, 36)); d = ImageDraw.Draw(im)
    d.rectangle((40, 40, 984, 1496), outline=(211, 84, 0), width=6)
    d.text((512, 740), 'PAGE %d' % i, fill=(240, 149, 90), anchor='mm', font_size=90)
    d.text((512, 840), pg['title'], fill=(255, 255, 255), anchor='mm', font_size=48)
    im.save(os.path.join(dst, 'images', 'page%d.webp' % i), 'WEBP', quality=80)
print('Guide créé : guides/%s/\nSuite : remplace les images, complète guide.json, puis  python3 build.py %s' % (slug, slug))
