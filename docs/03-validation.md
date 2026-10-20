# Validation — 20/10/2026

## Méthode et limite principale
Pas d’accès à la boutique Signature Meubles (aucun jeton ni compte collaborateur pour ce domaine) : **pas d’aperçu Shopify, pas d’import**. Le thème a été testé sur un **aperçu local qui exécute son Liquid réel** (`tools/preview/`, LiquidJS + objets/filtres Shopify émulés, catalogue réel, images du CDN de la boutique). Contrôle de fidélité : Hyper 1.3.3 d’origine rendu localement est identique à la démo officielle. Ce qui reste à vérifier sur Shopify : rendu exact des polices de la bibliothèque Shopify, checkout, Search & Discovery, éditeur de thème (voir `02-mise-en-ligne.md`, étape 11).

## Résultats
| Contrôle | Outil | Résultat |
|---|---|---|
| Rendu de 18 pages (accueil, collections, 4 fiches, panier, recherche, pages, 404, connexion) | `tools/check-pages.js` | 0 erreur Liquid, 0 traduction manquante |
| Shopify Theme Check (officiel) | `tools/theme-check.js` | **0 erreur** ; 10 avertissements, tous présents dans Hyper d’origine (snippets orphelins, 1 variable inutilisée) |
| Parcours d’achat réels (Chrome, bureau + mobile) | `tools/flows.js` | **22/22** : changement de variante (prix, URL, variante ajoutée), tiroir panier, compteur, quantité, page panier, suppression, panier vide, bouton « Passer la commande », filtre Dimensions, tri par prix, tiroir de filtres, recherche prédictive + résultats, lien d’évitement clavier, menu mobile + sous-menu + « Voir tout », barre d’achat mobile, aucun débordement horizontal, aucune erreur JavaScript |
| Accessibilité WCAG 2.1 AA + bonnes pratiques | axe-core, 10 pages × 2 largeurs | **0 violation** |
| Performance mobile (4G simulée, CPU ×4, serveur local non compressé) | `tools/perf.js` | LCP 1,8–2,7 s (image du héros, `fetchpriority=high`), CLS ≤ 0,009, toutes les images dimensionnées, images sous la ligne de flottaison en chargement différé |
| SEO | contrôle du HTML | 1 seul H1 par page, URL canonique, données structurées Produit uniques et valides, Organisation sans liens vides |
| Catalogue | `tools/build-catalog.js` | 73 produits · 125 variantes · 365 images · 0 erreur (voir `catalog/validation-report.md`) |
| Images référencées par le thème | contrôle croisé avec l’export | 15/15 présentes dans Contenu › Fichiers |

## Corrections apportées à Hyper (signalées par un commentaire « Signature Meubles » dans le code)
| Fichier | Correction |
|---|---|
| `assets/theme.js` | les animations d’apparition masquaient le contenu aux lecteurs d’écran (`visibility: hidden`) : opacité seule |
| `sections/main-cart.liquid` | liens « Supprimer » sans nom accessible sur la page panier |
| `snippets/card-collection.liquid` | texte alternatif redondant avec le titre visible |
| `sections/main-collection-product-grid`, `main-search`, `main-list-collections` | titre H2 masqué : hiérarchie H1 → H2 → H3 |
| `snippets/predictive-search.liquid` | deux zones de recherche portant le même nom |
| `assets/signature.css` | H1 du panier masqué quand le panier est vide |
| `sections/header.liquid` | logo vectoriel par défaut ; `sameAs` vide dans les données structurées |
| `snippets/facets.liquid` | filtres sans valeur utile masqués |
| `locales/fr.json` | 137 traductions corrigées (« Vérifier » → « Passer la commande », « Taper » → « Type », tutoiement, caractères invisibles…) |
| `snippets/card-product.liquid` | photo studio d’abord + dimensions |
| `snippets/product-information-blocks.liquid`, `sections/main-product.liquid` | blocs Caractéristiques et WhatsApp |
| `layout/theme.liquid` | feuille `signature.css`, favicon par défaut, couleur de thème |

Comparer avec l’original : `git diff --no-index theme-original theme`.
