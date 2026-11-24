# Mini Guide Malin · Gabarit

Un seul moteur pour tous les mini-guides (appli installable, hors-ligne, outils interactifs, guides de villes). Chaque guide = un dossier avec ses images et ses textes. **Tu fournis les images, le reste se génère.**

## Organisation

```
engine/        Le moteur commun (mot de passe, appli, outils, guides de villes). Modifié une fois, utile à tous les guides.
guides/
  japon/       Un guide : guide.json, images/, zones.json, data/*.json, guide.js (outils propres), map.js (carte)
  _modele/     Point de départ pour un nouveau guide
catalogue.json La liste de TOUS les guides (affichée en fin de chaque guide : « D'autres guides »)
build.py       Le générateur : transforme un dossier de guide en site prêt à publier
tools/new_guide.py   Crée un nouveau guide à partir du modèle
```

## Créer un nouveau guide (ex. Songkran)

1. `python3 tools/new_guide.py songkran "Mini Guide Malin · Songkran" "Malin Songkran" SONGKRAN`
2. Copie tes images dans `guides/songkran/images/` : `page1.webp`, `page2.webp`… (1024 × 1536, mêmes noms, une par page).
3. Ouvre `guides/songkran/guide.json` et complète :
   - `pages` : une ligne par page (`title` = nom dans le sommaire, `alt` = description de l'image)
   - `currency` : monnaie du pays (voir plus bas), ou `null`
   - `weather` : villes pour la météo, `"Bangkok:13.75,100.50;Chiang Mai:18.79,98.98"`
   - `fiches` et `toolsMenu` : les fiches et outils proposés
   - `booking`, `phrases`, etc. : facultatifs
4. Ajoute le guide dans `catalogue.json` (une ligne : identifiant, emoji, titre, description, couleur).
5. `python3 build.py songkran --check` vérifie qu'il ne manque rien, puis `python3 build.py songkran --out ../mini-guide-songkran-thaimalin` génère le site dans le dépôt du guide.

### Monnaie (convertisseur et icône 💱 après chaque prix)

```json
"currency": {"code":"THB","symbol":"฿","name":"Bahts","words":"bahts?\\b|baht","rateKey":"tm-thb-rate","fallback":38,"min":10,"max":100}
```
`fallback` = taux de secours (1 € = … monnaie locale). Le taux du jour se met à jour tout seul quand le téléphone est en ligne.

## Guides de villes et fiches pratiques

Ce sont de simples fichiers texte : `guides/<guide>/data/<ville>.json`. Copie `guides/_modele/data/exemple.json`, change les textes, c'est tout. Pour qu'une page de ton guide ouvre une fiche d'un simple tap, ajoute dans `zones.json` un lien `tool:city_<nom du fichier>` sur la carte voulue (ex. `tool:city_exemple`, ou avec onglet : `tool:city_exemple@pra`). Un badge « 👆 Fiche » apparaît tout seul sur la carte.

Outils plus spéciaux (simulateurs, calculs) : fichier `guides/<guide>/guide.js`, voir `guides/japon/guide.js` pour des exemples.

## Mettre à jour

| Je veux… | Je modifie… |
|---|---|
| Corriger un prix, un texte de ville | `guides/<guide>/data/<ville>.json` |
| Remplacer une image de page | `guides/<guide>/images/pageN.webp` (même nom) |
| Ajouter une page | l'image + une ligne dans `pages` de `guide.json` |
| Ajouter un guide dans la liste « D'autres guides » (tous les guides) | `catalogue.json` |
| Ajouter / activer / retirer un partenaire affilié (**tous** les guides) | `liens-affilies.json` |
| Améliorer un outil pour **tous** les guides | `engine/` |
| Forcer la mise à jour sur les téléphones | augmenter `version` dans `guide.json` |

Après chaque modification : `python3 build.py <guide> --out <dépôt du guide>`, puis publier ce dépôt (commit + push). Les téléphones récupèrent la nouvelle version à la prochaine ouverture avec internet.

## Liens affiliés (un seul fichier pour tous les guides)

`liens-affilies.json` liste tous les partenaires (Trip.com, Booking, Klook, Airalo, Holafly, SafetyWing, GoWabi, puis Hotels.com, Simbye, Viator, Bangkok Airways dès qu'ils t'acceptent).

- **Activer un partenaire accepté** : colle son lien dans `url`, mets `"actif": true`. Tant qu'il est à `false` (ou sans lien), il n'apparaît nulle part.
- `{BK}` dans un lien = code pays Booking du guide (`booking.code` dans `guide.json`). `"pays": ["th"]` réserve un partenaire à certains guides.
- Le bouton **🧳 Réserver** de chaque guide lit cette liste.
- Dans les textes d'un guide (`zones.json`, `data/<ville>.json` → `book`), écris `aff:<id>` au lieu du lien (ex. `["🏨 Hôtels", "aff:booking"]`) : le lien est repris du fichier, et masqué si le partenaire est inactif. Les liens écrits en dur continuent de marcher (guide Japon inchangé).
- Après modification : `python3 build.py <guide> --out <dépôt du guide>`, publier, augmenter `version` dans `guide.json`.
- Règles : mentionner l'affiliation (« liens partenaires, sans surcoût pour toi »), pas de publicité payante sur la marque Simbye, n'utiliser que les codes fournis par le partenaire.

## Mot de passe

Format `PRÉFIXE-MM-AAAA` (ex. `JAPON-11-2026`), le préfixe vient de `pwPrefix` dans `guide.json`.

## Avant de publier : à vérifier

- `python3 build.py <guide> --check` : aucune erreur
- Ouvrir le guide sur téléphone : mot de passe, 3 ou 4 pages, un outil, une fiche de ville
- Prix et dates : mettre « vérifié en [mois année] » dans les fiches
