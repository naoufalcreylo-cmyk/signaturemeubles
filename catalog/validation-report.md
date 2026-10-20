# Validation du catalogue

Source : `products_export_1 (7).csv` — 384 lignes, 73 produits, 125 variantes, 365 images.

Colonnes : 47 (format d'export Shopify complet).

| Niveau | Constat |
|---|---|
| À vérifier | 73/73 produits ont « Published = false » : ils ne sont pas visibles sur la boutique en ligne tant qu'ils ne sont pas publiés sur le canal Online Store. |
| À vérifier | Titre identique « ADRIANO » pour adriano-2 et adriano (même type, 180 x 200 cm / 160 x 200 cm ; 180 x 200 cm) — risque de confusion pour les clients. |
| À vérifier | venora : deux tailles au même prix (220 x 110 cm = 17900, 200 x 100 cm = 17900, 240 x 120 cm = 21320) — identique au tableau, à confirmer. |
| Info | 73 produits n'ont pas de suivi de stock (Inventory Tracker vide) : Shopify les considère toujours disponibles. Activez le suivi si le stock doit limiter les ventes. |
| Info | Tous les poids sont à 0 : les tarifs d'expédition basés sur le poids ne fonctionneront pas. |
| Info | Aucun titre/description SEO : Shopify utilisera le titre et la description du produit. |
| Info | Aucun prix barré dans le catalogue : la boutique n'affiche donc aucune promotion. |
| Info | Titre « FREEMAN » partagé par freeman-u (Salon en U), freeman-l (Salon en L) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « MILANO » partagé par milano-u (Salon en U), milano-l (Salon en L) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « OLIKA PM » partagé par olika-pm-l (Salon en L), olika-pm-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « SKY GM » partagé par sky-gm-l (Salon en L), sky-gm-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « NOLITA GM » partagé par nolita-gm-l (Salon en L), nolita-gm-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « KRIS » partagé par kris-l (Salon en L), kris-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « NOLITA PM » partagé par nolita-pm-l (Salon en L), nolita-pm-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « BELLAGIO » partagé par bellagio-l (Salon en L), bellagio-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « BERING » partagé par bering-l (Salon en L), bering-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | Titre « ELITE » partagé par elite-l (Salon en L), elite-u (Salon en U) — le type est affiché sur les cartes pour les distinguer. |
| Info | olika-gm-l : format de dimensions non standard « 400 X P 220 X H 65 cm » |
| Info | olika-pm-u : format de dimensions non standard « 420 X P 220 X H 65 cm » |
| Info | milo-l : format de dimensions non standard « 360 x 185 x H65 cm » |
| Info | elya-l : format de dimensions non standard « 350 x 350 H65 cm » |
| Info | kris-u : format de dimensions non standard « 250x 350 x 215 cm » |
| Info | karlo « KARLO » : images nommées ELVIS_… (ancien nom de modèle) — conservées telles quelles. |
| Info | soren « SOREN » : images nommées SIAMESE_… (ancien nom de modèle) — conservées telles quelles. |
| Info | orion « ORION » : images nommées JUPITER_… (ancien nom de modèle) — conservées telles quelles. |
| Info | celesto « CÉLESTO » : images nommées MURANO_… (ancien nom de modèle) — conservées telles quelles. |
| Info | valentino « VALENTINO » : images nommées ROBERTO_… (ancien nom de modèle) — conservées telles quelles. |
| Info | ducal « DUCAL » : images nommées MOHA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | prestigia « PRESTIGIA » : images nommées HARMONY_… (ancien nom de modèle) — conservées telles quelles. |
| Info | ondea « ONDÉA » : images nommées WAYVE_… (ancien nom de modèle) — conservées telles quelles. |
| Info | adriano-2 « ADRIANO » : images nommées MATEO_… (ancien nom de modèle) — conservées telles quelles. |
| Info | adriano « ADRIANO » : images nommées NAYA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | almera « ALMÉRA » : images nommées SERENA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | maestia « MAÉSTIA » : images nommées PERLA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | eloria « ÉLORIA » : images nommées AMENDA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | nevio « NÉVIO » : images nommées ARENA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | lorena « LORÉNA » : images nommées VELORA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | imperia « IMPÉRIA » : images nommées BIANCA_… (ancien nom de modèle) — conservées telles quelles. |
| Info | 25 collections du menu sont vides pour l'instant et restent masquées : Salons marocains, Canapés, Fauteuils, Poufs, Tables basses, Buffets, Consoles, Meubles TV, Étagères, Matelas, Chambre enfant, Lits une place, Chevets, Bureaux enfants, Commodes, Mobilier de bureau, Bureaux, Fauteuils de direction, Chaises visiteurs, Mobilier d'extérieur, Salons de jardin, Tables d'extérieur, Chaises d'extérieur, Parasols, Transats. |

## Répartition par collection

| Collection | Produits |
|---|---|
| Salons & Canapés (`salons-et-canapes`) | 48 |
| Salons d'angle en L (`salons-d-angle-en-l`) | 35 |
| Salons en U (`salons-en-u`) | 13 |
| Salons marocains (`salons-marocains`) | 0 |
| Canapés (`canapes`) | 0 |
| Fauteuils (`fauteuils`) | 0 |
| Poufs (`poufs`) | 0 |
| Séjour & Salle à manger (`sejour-et-salle-a-manger`) | 9 |
| Tables basses (`tables-basses`) | 0 |
| Tables à manger (`tables-a-manger`) | 5 |
| Chaises (`chaises`) | 4 |
| Buffets (`buffets`) | 0 |
| Consoles (`consoles`) | 0 |
| Meubles TV (`meubles-tv`) | 0 |
| Étagères (`etageres`) | 0 |
| Chambre adulte (`chambre-adulte`) | 16 |
| Lits adultes (`lits-adultes`) | 16 |
| Matelas (`matelas`) | 0 |
| Chambre enfant (`chambre-enfant`) | 0 |
| Lits une place (`lits-une-place`) | 0 |
| Chevets (`chevets`) | 0 |
| Bureaux enfants (`bureaux-enfants`) | 0 |
| Commodes (`commodes`) | 0 |
| Mobilier de bureau (`mobilier-de-bureau`) | 0 |
| Bureaux (`bureaux`) | 0 |
| Fauteuils de direction (`fauteuils-de-direction`) | 0 |
| Chaises visiteurs (`chaises-visiteurs`) | 0 |
| Mobilier d'extérieur (`mobilier-d-exterieur`) | 0 |
| Salons de jardin (`salons-de-jardin`) | 0 |
| Tables d'extérieur (`tables-d-exterieur`) | 0 |
| Chaises d'extérieur (`chaises-d-exterieur`) | 0 |
| Parasols (`parasols`) | 0 |
| Transats (`transats`) | 0 |
| La sélection (`la-selection`) | 8 |
