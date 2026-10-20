# Informations à fournir / à confirmer

Rien de ce qui suit n’a été inventé : le site masque chaque module tant que l’information n’existe pas.

## Bloquant pour publier
1. **Accès à la boutique** (compte collaborateur ou jeton Theme Access) pour importer le thème et le tester en aperçu Shopify. À défaut, importer le ZIP soi-même (`02-mise-en-ligne.md`).
2. **Publication des 73 produits** sur la Boutique en ligne (tous en `Published = false`).
3. **Paiement et livraison** configurés dans Shopify, et **politiques** rédigées (CGV, confidentialité, remboursement, expédition).

## À confirmer par le propriétaire
| Sujet | Constat | Fichier |
|---|---|---|
| **Noms des salons** | L’export utilise les anciens noms (LOREN, CAIRO GM…), alors que le « Tableau salons » en donne de nouveaux (LUNÉA, VELORA GM…). 48/48 correspondances trouvées par type, dimensions et prix. **Non appliqué.** | `catalog/proposals/salons-noms-tableau.csv` |
| Conflit de nom | Le tableau nomme un salon en U « IMPERIA » alors qu’un lit s’appelle déjà « IMPÉRIA ». | idem |
| Deux lits « ADRIANO » | `adriano` (160/180) et `adriano-2` (180 seul), photos différentes : même nom pour deux modèles. | `catalog/validation-report.md` |
| VÉNORA | 220 × 110 et 200 × 100 cm au même prix (17 900 DH), comme dans le tableau. | idem |
| VERRA « 140 cm » | Diamètre ou longueur ? | idem |
| Formats de dimensions | `400 X P 220 X H 65 cm`, `250x 350 x 215 cm`… (affichés tels quels, « x » typographié « × »). | idem |
| DUCAL « 90 x 200 cm x 2 » | Classé en lits adultes comme dans l’export ; pourrait aussi relever de « Lits une place ». | idem |
| La sélection | Liste de départ proposée, à remplacer par le choix du propriétaire. | `tools/collections.js` |

## Contenus manquants (modules prêts mais masqués)
- **Numéro WhatsApp** → boutons fiche produit, bloc Services, pied de page, bouton flottant (optionnel).
- **Liens Instagram / Facebook / TikTok** (comptes créés selon le plan de communication, adresses non fournies).
- **Conditions de livraison, de montage, de retour** → blocs Services « Livraison » et « Montage » déjà préparés (désactivés), mention Livraison des Caractéristiques.
- **Magasins** : ouverture « prévue ensuite » d’après le plan de communication → ajouter des blocs « Magasin » dans la section Contact et un lien « Nos magasins » uniquement quand adresse et horaires sont confirmés.
- **Matières, finitions, entretien** par produit → métachamps `signature.*`.
- **Textes des pages** À propos et Contact.
- **Produits des autres catégories** (salons marocains, canapés, fauteuils, poufs, tables basses, buffets, consoles, meubles TV, étagères, matelas, chambre enfant, bureau, extérieur) → structure de menu prête, à activer catégorie par catégorie.
- Optionnel : poids des variantes (tarifs d’expédition au poids), suivi de stock, titres/descriptions SEO.
