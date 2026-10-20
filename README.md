# Signature Meubles — thème Shopify (base Hyper 1.3.3 par FoxEcom)

Boutique en ligne de **Signature Meubles** (Maroc) : thème Shopify OS 2.0 construit sur **Hyper 1.3.3** (fourni : `Downloads/hyper-shopify-theme-v1.3.3.zip`), entièrement en français, prix en dirhams via le format monétaire de la boutique.

| Dossier | Contenu |
|---|---|
| `theme/` | **Le thème à importer** (Hyper modifié). `signature-meubles-theme.zip` = le même dossier zippé. |
| `theme-original/` | Hyper 1.3.3 intact, pour comparer (`git diff --no-index theme-original theme`). |
| `catalog/` | Validation de l’export produits, propositions (noms des salons), fichiers de configuration Shopify (collections, menus, logos). |
| `docs/` | Direction artistique, mise en ligne pas à pas, validation, informations à fournir. |
| `deliverables/screenshots/` | Captures bureau et mobile. |
| `tools/` | Générateurs et outils de contrôle (aperçu local, tests, accessibilité, performance). |

## Ce qui a été fait
- **Système de marque** dans les réglages du thème : 15 palettes (Ivoire, Lin = fond des photos studio, Sable, Forêt = vert du logo, Charbon), Jost Light (titres) + DM Sans (texte), angles droits, boutons en capitales espacées.
- **Logo vectoriel** extrait du PDF fourni : versions claire/foncée, compacte/complète, monogramme, favicon (`theme/assets/sm-*`, `catalog/setup/brand/`).
- **8 sections sur mesure** (préfixe « SM · », toutes éditables dans l’éditeur de thème) : Hero, Index des pièces, Guide des formes (L/U), Composer la pièce, Présentation, Services, Contact, WhatsApp flottant.
- **Fiche produit** : blocs « SM · Caractéristiques » (options + métachamps `signature.*`) et « SM · Conseil WhatsApp » (masqué sans numéro), barre d’achat mobile, recommandations.
- **Cartes produit** : photo studio d’abord, ambiance au survol, type et dimensions lus dans les variantes.
- **Corrections** : 137 traductions françaises de Hyper corrigées, filtres inutiles masqués, accessibilité (animations, liens sans nom, hiérarchie des titres, contraste), données structurées.
- Tout le contenu de démonstration Hyper (promesses de livraison, remises, avis, newsletter « -10 % ») a été retiré.

## Aperçu local (sans accès boutique)
```
npm install
node tools/build-catalog.js          # export CSV → data/catalog.json + rapport
node --watch-path=tools tools/preview/server.js 4200   # http://localhost:4200
```
Le serveur exécute **le vrai Liquid du thème** (LiquidJS + objets et filtres Shopify émulés), avec le catalogue réel et les images du CDN Shopify de la boutique. Il émule le panier Ajax, le rendu de sections, la recherche prédictive, les filtres et la pagination. **Le paiement n’est pas émulé** et l’aperçu ne remplace pas un test sur la boutique (voir `docs/02-mise-en-ligne.md`).

## Régénérer
| Commande | Effet |
|---|---|
| `node tools/gen-settings.js` | Réglages globaux (couleurs, polices…) → `config/settings_data.json` |
| `node tools/gen-templates.js` | Modèles JSON + groupes de sections depuis `tools/site.js` (**écrase** les modifications faites dans l’éditeur) |
| `node tools/fix-fr.js` | Corrections françaises + chaînes `sm.*` |
| `node tools/gen-setup.js` | Fichiers Matrixify + `navigation.md` |
| `node tools/check-pages.js` · `tools/flows.js` · `tools/a11y.js` · `tools/perf.js` · `tools/theme-check.js` | Contrôles |
| `tar.exe -a -c -f signature-meubles-theme.zip -C theme assets config layout locales sections snippets templates` | ZIP importable |

## GitHub et démo Vercel
- Branche `source` : ce projet complet. Branche `main` : le thème à la racine (intégration GitHub de Shopify, qui ignore les autres fichiers) **+ la démo Vercel** (`api/index.js`, `vercel.json`, `tools/preview/`, `data/catalog.json`).
- La démo Vercel exécute l'aperçu local en fonction serverless : panier par visiteur (cookie), pages en `noindex`, paiement non émulé. Ce n'est pas la boutique.
- Mettre à jour `main` : `git worktree add ../main-wt main` puis `bash tools/sync-main.sh ../main-wt` et `git -C ../main-wt push origin main`. Rapatrier d'abord dans `theme/` les éventuelles modifications faites dans l'éditeur Shopify.
