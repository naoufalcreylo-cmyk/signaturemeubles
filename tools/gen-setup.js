// node tools/gen-setup.js — Shopify setup files generated from tools/collections.js + data/catalog.json
//   catalog/setup/matrixify/Smart Collections.csv   (Matrixify « Smart Collections » sheet — deprecated but supported for single-source rules)
//   catalog/setup/matrixify/Custom Collections.csv  (« La sélection », manual)
//   catalog/setup/navigation.md                     (menus to create in Online Store > Navigation, only live entries)
//   catalog/setup/collections.md                    (manual fallback: same collections, admin conditions)
const fs = require('fs');
const { stringify } = require('./csv');
const { NAV, COLLECTIONS } = require('./collections');
const cat = JSON.parse(fs.readFileSync('data/catalog.json', 'utf8'));
const count = h => cat.collections.find(c => c.handle === h)?.product_handles.length || 0;
const FILES = 'https://cdn.shopify.com/s/files/1/0770/9242/1718/files/';
fs.mkdirSync('catalog/setup/matrixify', { recursive: true });

const live = COLLECTIONS.filter(c => count(c.handle) > 0);
const COL = { type: 'Type', tag: 'Tag' };
const smartHead = ['Handle', 'Command', 'Title', 'Body HTML', 'Sort Order', 'Template Suffix', 'Published', 'Image Src', 'Image Alt Text', 'Must Match', 'Rule: Product Column', 'Rule: Relation', 'Rule: Condition', 'Metafield: description_tag'];
const smart = [];
for (const c of live.filter(c => !c.manual)) c.rules.forEach((r, i) => smart.push({ Handle: c.handle, Command: 'MERGE', Title: c.title, 'Body HTML': c.description ? `<p>${c.description}</p>` : '', 'Sort Order': 'Manual', 'Template Suffix': '', Published: 'TRUE',
  'Image Src': c.image ? FILES + c.image : '', 'Image Alt Text': '', 'Must Match': c.disjunctive ? 'any condition' : 'all conditions', 'Rule: Product Column': COL[r.column], 'Rule: Relation': 'Equals', 'Rule: Condition': r.condition, 'Metafield: description_tag': c.description || '' }));
fs.writeFileSync('catalog/setup/matrixify/Smart Collections.csv', stringify(smartHead, smart));

const customHead = ['Handle', 'Command', 'Title', 'Body HTML', 'Sort Order', 'Published', 'Image Src', 'Image Alt Text', 'Product: Handle', 'Product: Position'];
const custom = [];
for (const c of live.filter(c => c.manual)) cat.collections.find(x => x.handle === c.handle).product_handles.forEach((h, i) => custom.push({ Handle: c.handle, Command: 'MERGE', Title: c.title, 'Body HTML': `<p>${c.description}</p>`, 'Sort Order': 'Manual', Published: 'TRUE', 'Image Src': FILES + c.image, 'Image Alt Text': '', 'Product: Handle': h, 'Product: Position': i + 1 }));
fs.writeFileSync('catalog/setup/matrixify/Custom Collections.csv', stringify(customHead, custom));

// ---- Navigation -----------------------------------------------------------------------------
const L = [];
L.push('# Menus à créer — Boutique en ligne › Navigation', '', 'Le thème lit ces menus par leur **identifiant (handle)**. Seules les entrées dont la collection contient des produits sont listées : ajoutez les autres quand les produits existent (structure complète en fin de page).', '');
L.push('## 1. `main-menu` — Menu principal (bureau)', '', '| Niveau 1 | Niveau 2 | Lien |', '|---|---|---|');
const liveNav = NAV.filter(n => count(n.handle) > 0);
for (const n of liveNav) { L.push(`| **${n.title}** | | Collection \`${n.handle}\` |`); for (const ch of n.children.filter(ch => count(ch.handle) > 0)) L.push(`| | ${ch.title} | Collection \`${ch.handle}\` (${count(ch.handle)} produits) |`); L.push(`| | Voir tout | Collection \`${n.handle}\` |`); }
L.push('', 'Les images du méga-menu sont réglées dans le thème (En-tête › blocs « Carte personnalisée », associés par le titre exact de l’entrée de niveau 1).', '');
L.push('## 2. `menu-mobile` — Menu mobile', '', 'Copie du menu principal, suivie de deux liens de niveau 1 : **À propos** (page `a-propos`) et **Contact** (page `contact`).', '');
L.push('## 3. `footer-collections` — Pied de page « Collections »', '', ...liveNav.flatMap(n => n.children.filter(ch => count(ch.handle) > 0)).map(ch => `- ${ch.title} → collection \`${ch.handle}\``), '');
L.push('## 4. `footer-informations` — Pied de page « Informations »', '', '- À propos → page `a-propos`', '- Contact → page `contact`', '- Recherche → `/search`', '');
L.push('## 5. `footer-legal` — Bas de page', '', 'Ajoutez ici les politiques **une fois rédigées** dans Paramètres › Politiques (Conditions générales de vente, Politique de confidentialité, Politique de remboursement, Politique d’expédition). Tant qu’il est vide, rien ne s’affiche.', '');
L.push('## Structure complète (à activer progressivement)', '', '| Catégorie | Sous-catégories | Produits aujourd’hui |', '|---|---|---|');
for (const n of NAV) L.push(`| ${n.title} (\`${n.handle}\`) | ${n.children.map(ch => `${ch.title} (\`${ch.handle}\`)`).join(', ')} | ${count(n.handle)} |`);
L.push('', 'Règles proposées pour les catégories vides : collections automatiques sur le **Type de produit** (ex. `Canapé`, `Fauteuil`, `Pouf`, `Table basse`, `Matelas`…) ou une étiquette dédiée, à fixer quand ces produits seront importés.');
fs.writeFileSync('catalog/setup/navigation.md', L.join('\n') + '\n');

// ---- Manual collections fallback -----------------------------------------------------------------
const M = ['# Collections — création manuelle (alternative à Matrixify)', '', 'Produits › Collections › Créer une collection. Type **Automatisée** sauf « La sélection ». Image : Contenu › Fichiers (déjà présente, nom indiqué).', '',
  '| Handle | Titre | Type | Conditions | Image (Fichiers) | Produits |', '|---|---|---|---|---|---|'];
for (const c of live) M.push(`| \`${c.handle}\` | ${c.title} | ${c.manual ? 'Manuelle' : 'Automatisée'} | ${c.manual ? 'produits : ' + cat.collections.find(x => x.handle === c.handle).product_handles.join(', ') : (c.disjunctive ? 'N’importe quelle condition : ' : '') + c.rules.map(r => `${r.column === 'type' ? 'Type de produit' : 'Étiquette'} = « ${r.condition} »`).join(' OU ')} | ${c.image || ''} | ${count(c.handle)} |`);
M.push('', 'Vérifiez que l’identifiant (handle) affiché par Shopify correspond exactement à la colonne Handle : le thème et les menus y font référence.');
fs.writeFileSync('catalog/setup/collections.md', M.join('\n') + '\n');
console.log(`Smart: ${new Set(smart.map(r => r.Handle)).size} collections (${smart.length} rows) · Custom: ${new Set(custom.map(r => r.Handle)).size} · navigation.md · collections.md`);
