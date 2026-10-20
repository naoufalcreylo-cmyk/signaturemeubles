# Mise en ligne — étapes exactes

> Aucun accès à la boutique Signature Meubles n’était disponible : **rien n’a été importé ni publié**. Le thème a été validé sur un aperçu local qui exécute son Liquid réel (voir `03-validation.md`). Les étapes ci-dessous se font dans l’admin Shopify, dans cet ordre.

## 1. Importer le thème (non publié)
Boutique en ligne › Thèmes › **Ajouter un thème › Importer un fichier ZIP** › `signature-meubles-theme.zip`. Le thème arrive **non publié** : ne le publiez qu’après l’étape 11.

## 2. Langue et monnaie
- Paramètres › Langues : **Français** comme langue par défaut (le thème lit `locales/fr.json`).
- Paramètres › Général › Devise de la boutique : **MAD**. Dans « Modifier le formatage », vérifiez par exemple `{{amount_no_decimals_with_space_separator}} DH` (affichage « 20 990 DH »). Le thème n’écrit jamais de prix en dur : il suit ce format.

## 3. Publier les produits sur la boutique en ligne
Les 73 produits de l’export ont `Published = false`. Produits › tout sélectionner › **Inclure dans les canaux de vente › Boutique en ligne**. N’utilisez pas un réimport CSV pour cela (risque d’écraser des champs).
Optionnel : activer le suivi de stock (aujourd’hui non suivi : Shopify considère tout disponible).

## 4. Collections (9 à la mise en ligne)
- **Avec Matrixify** (formule gratuite suffisante pour 9 collections) : importer `catalog/setup/matrixify/Smart Collections.csv` puis `Custom Collections.csv` (anciennes feuilles Smart/Custom Collections, toujours acceptées pour des règles simples ; vérifier le résultat de l’import).
- **Sinon, à la main** : `catalog/setup/collections.md` (handles, conditions, image déjà dans Contenu › Fichiers).
- Les **handles doivent être identiques** : le thème et les menus y font référence.
- « La sélection » est une collection **manuelle** : sa liste de départ (VELART, SKY GM U, LOFT, BELLAGIO U, CÉLESTO, VÉNORA, ALBA, ONDÉA) est une proposition à remplacer par le choix du propriétaire.

## 5. Pages
Boutique en ligne › Pages :
| Titre | Handle | Modèle | Contenu |
|---|---|---|---|
| À propos | `a-propos` | `page.about` | texte rédigé par le propriétaire (le modèle ajoute déjà la présentation de la marque et l’index des pièces) |
| Contact | `contact` | `page.contact` | une phrase d’introduction (le formulaire Shopify est déjà en place) |

## 6. Menus
Boutique en ligne › Navigation : suivre `catalog/setup/navigation.md` (`main-menu`, `menu-mobile`, `footer-collections`, `footer-informations`, `footer-legal`). Seules les catégories qui ont des produits y figurent ; la structure complète demandée y est décrite pour l’ajouter au fil des imports.

## 7. Search & Discovery (application Shopify gratuite)
- **Filtres** : Prix, Type de produit, option de variante **Dimensions**. Le thème masque automatiquement un filtre qui n’aide pas (ex. « Disponibilité » quand tout est en stock, « Dimensions » sur les salons où chaque taille est unique).
- **Produits complémentaires** (bloc « À associer » de la fiche produit) : à renseigner uniquement pour de vraies associations, par ex. une table → les chaises qui l’accompagnent. Le bloc reste invisible tant que rien n’est défini.

## 8. Réglages du thème (Personnaliser › Paramètres du thème)
- **Signature Meubles** : numéro WhatsApp (chiffres, indicatif pays, ex. `2126…`). Sans numéro, tous les boutons WhatsApp restent masqués.
- **Réseaux sociaux** : liens Instagram, Facebook, TikTok (les comptes existent d’après le plan de communication, les adresses n’ont pas été fournies).
- Logo et favicon : déjà intégrés au thème (SVG vectoriel + monogramme). Le favicon `catalog/setup/brand/favicon-512.png` peut aussi être chargé dans « Logo › Favicon ».
- Paramètres › Marque : logo `catalog/setup/brand/logo-email-600.png` (e-mails), image de partage `social-share-1200x628.png`.

## 9. Métachamps produit (facultatif mais recommandé)
Paramètres › Données personnalisées › Produits › Ajouter une définition :
| Nom | Espace de noms et clé | Type |
|---|---|---|
| Matière | `signature.matiere` | Texte sur une ligne |
| Finition | `signature.finition` | Texte sur une ligne |
| Entretien | `signature.entretien` | Texte multiligne |
| Livraison | `signature.livraison` | Texte multiligne |
Ils s’affichent dans « Caractéristiques » seulement s’ils sont remplis. Une mention de livraison commune peut aussi être saisie dans le bloc « SM · Caractéristiques » du modèle produit, **une fois les conditions confirmées**.

## 10. Politiques, paiement, expédition
- Paramètres › Politiques : conditions de vente, confidentialité, remboursement, expédition ; puis ajoutez-les au menu `footer-legal`.
- Paiements et tarifs d’expédition : à configurer dans Shopify (le thème ne les modifie pas et n’affiche aucun mode de paiement ni seuil de livraison non configuré). Les poids des variantes sont à 0 : à renseigner si les tarifs dépendent du poids.

## 11. Recette sur la boutique (avant publication) — via « Aperçu » du thème
1. Accueil bureau + mobile : héros, index des pièces (nombres et prix « à partir de »), sélection, guide L/U, « Composez votre table ».
2. Méga-menu (survol) et menu mobile.
3. Collection : filtres, tri, pagination, état vide (ex. une collection sans produit).
4. Fiche produit SOREN : changer Dimensions / Rangement → prix, URL, bouton ; ajouter au panier → tiroir ; modifier la quantité ; supprimer.
5. Panier → **Passer la commande** → checkout Shopify (paiement test si disponible).
6. Recherche « celesto » (suggestions + page de résultats), formulaire de contact.
7. Avec un numéro WhatsApp renseigné : bouton de la fiche produit (message avec nom, variante et lien).

Puis **Publier** le thème.

## 12. Si les noms de salons du « Tableau salons » sont confirmés
`catalog/proposals/salons-noms-tableau.csv` : correspondance 48/48 (type + dimensions + prix). Renommer via l’éditeur groupé (colonne Titre) **sans changer les handles** (les adresses restent valides). Mettre ensuite à jour les légendes « En photo : … » du méga-menu (En-tête › blocs) et le texte alternatif du héros. La légende du héros et les cartes se mettent à jour seules.
