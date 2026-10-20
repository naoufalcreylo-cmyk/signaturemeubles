// node tools/build-catalog.js [export.csv]
// Reads the Shopify product export (source of truth), validates it and writes:
//   data/catalog.json  — Shopify-shaped products + computed collections (used by the local preview)
//   catalog/validation-report.md — findings for the merchant (nothing is changed in the CSV)
const fs = require('fs'); const path = require('path');
const { toObjects } = require('./csv');
const { COLLECTIONS } = require('./collections');

const SRC = process.argv[2] || 'catalog/source/products_export_1 (7).csv';
const { head, rows } = toObjects(fs.readFileSync(SRC, 'utf8'));
const report = []; const say = (lvl, msg) => report.push({ lvl, msg });

const REQUIRED = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published', 'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Price', 'Variant Compare At Price', 'Image Src', 'Image Position', 'Image Alt Text', 'Status'];
const missingCols = REQUIRED.filter(c => !head.includes(c));
if (missingCols.length) say('error', `Colonnes manquantes : ${missingCols.join(', ')}`);

const byHandle = new Map();
for (const r of rows) { if (!byHandle.has(r.Handle)) byHandle.set(r.Handle, []); byHandle.get(r.Handle).push(r); }

let idSeq = 8800000000000; const cents = v => Math.round(parseFloat(v) * 100);
const products = []; const skus = new Map();
for (const [handle, rs] of byHandle) {
  const p0 = rs[0];
  if (!p0.Title) say('error', `${handle} : la première ligne n'a pas de titre`);
  const optNames = [p0['Option1 Name'], p0['Option2 Name'], p0['Option3 Name']].filter(Boolean);
  const variants = rs.filter(r => r['Variant SKU'] || r['Variant Price']).map(r => {
    const v = { id: ++idSeq, sku: r['Variant SKU'], price: cents(r['Variant Price']), compare_at_price: r['Variant Compare At Price'] ? cents(r['Variant Compare At Price']) : null,
      option1: r['Option1 Value'] || null, option2: r['Option2 Value'] || null, option3: r['Option3 Value'] || null,
      inventory_management: r['Variant Inventory Tracker'] || null, inventory_policy: r['Variant Inventory Policy'], inventory_quantity: +r['Variant Inventory Qty'] || 0, grams: +r['Variant Grams'] || 0,
      image_src: r['Variant Image'] || null };
    v.title = [v.option1, v.option2, v.option3].filter(Boolean).join(' / ');
    // Untracked inventory (empty tracker) sells regardless of quantity — that is how Shopify computes `available`
    v.available = !v.inventory_management || v.inventory_quantity > 0 || v.inventory_policy === 'continue';
    if (skus.has(v.sku)) say('error', `SKU en double ${v.sku} (${handle} et ${skus.get(v.sku)})`); skus.set(v.sku, handle);
    if (!(v.price > 0)) say('error', `${handle} ${v.sku} : prix invalide « ${r['Variant Price']} »`);
    if (v.compare_at_price && v.compare_at_price <= v.price) say('warn', `${handle} ${v.sku} : prix barré ≤ prix`);
    return v;
  });
  // Option values that only appear on later rows (Shopify export keeps Option1 Value on each variant row)
  const images = rs.filter(r => r['Image Src']).map(r => ({ src: r['Image Src'], position: +r['Image Position'], alt: r['Image Alt Text'], width: 1254, height: 1254 }))
    .sort((a, b) => a.position - b.position);
  images.forEach((im, i) => { if (im.position !== i + 1) say('error', `${handle} : positions d'image non continues (${images.map(x => x.position).join(',')})`); if (!/^https:\/\/cdn\.shopify\.com\//.test(im.src)) say('error', `${handle} : URL d'image non hébergée sur Shopify ${im.src}`); if (!im.alt) say('warn', `${handle} : image ${im.position} sans texte alternatif`); });
  if (!images.length) say('error', `${handle} : aucune image`);
  const options = optNames.map((name, i) => ({ name, position: i + 1, values: [...new Set(variants.map(v => v['option' + (i + 1)]).filter(Boolean))] }));
  const tags = p0.Tags.split(',').map(t => t.trim()).filter(Boolean);
  const dims = (p0['Body (HTML)'].match(/Dimensions[^:]*:\s*([^<]+)/) || [])[1]?.replace(/\.$/, '').trim() || null;
  const p = { id: ++idSeq, handle, title: p0.Title, body_html: p0['Body (HTML)'], vendor: p0.Vendor, product_type: p0.Type, tags,
    published: p0.Published === 'true', status: p0.Status, options, variants, images, dimensions: dims,
    seo_title: p0['SEO Title'], seo_description: p0['SEO Description'] };
  p.price = Math.min(...variants.map(v => v.price)); p.price_max = Math.max(...variants.map(v => v.price));
  p.available = variants.some(v => v.available);
  products.push(p);
}

// ---- Findings -----------------------------------------------------------------------------------
const unpublished = products.filter(p => !p.published);
if (unpublished.length) say('warn', `${unpublished.length}/${products.length} produits ont « Published = false » : ils ne sont pas visibles sur la boutique en ligne tant qu'ils ne sont pas publiés sur le canal Online Store.`);
const untracked = products.filter(p => p.variants.every(v => !v.inventory_management));
if (untracked.length) say('info', `${untracked.length} produits n'ont pas de suivi de stock (Inventory Tracker vide) : Shopify les considère toujours disponibles. Activez le suivi si le stock doit limiter les ventes.`);
if (products.every(p => p.variants.every(v => v.grams === 0))) say('info', 'Tous les poids sont à 0 : les tarifs d\'expédition basés sur le poids ne fonctionneront pas.');
if (products.every(p => !p.seo_title && !p.seo_description)) say('info', 'Aucun titre/description SEO : Shopify utilisera le titre et la description du produit.');
if (products.every(p => p.variants.every(v => !v.compare_at_price))) say('info', 'Aucun prix barré dans le catalogue : la boutique n\'affiche donc aucune promotion.');

const byTitle = {}; products.forEach(p => (byTitle[p.title] = byTitle[p.title] || []).push(p));
for (const [t, ps] of Object.entries(byTitle)) if (ps.length > 1) {
  const types = new Set(ps.map(p => p.product_type));
  if (types.size < ps.length) say('warn', `Titre identique « ${t} » pour ${ps.map(p => p.handle).join(' et ')} (même type, ${ps.map(p => p.dimensions).join(' / ')}) — risque de confusion pour les clients.`);
  else say('info', `Titre « ${t} » partagé par ${ps.map(p => `${p.handle} (${p.product_type})`).join(', ')} — le type est affiché sur les cartes pour les distinguer.`);
}
for (const p of products) {
  if (p.dimensions && !/^(Ø )?\d+( x \d+)*( cm)?( x 2)?( ; .+)?$/.test(p.dimensions)) say('info', `${p.handle} : format de dimensions non standard « ${p.dimensions} »`);
  const base = (p.images[0]?.src.match(/files\/([A-Za-z_-]+?)_?0?1/) || [])[1];
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  if (base && !norm(base).startsWith(norm(p.title).slice(0, 4))) say('info', `${p.handle} « ${p.title} » : images nommées ${base}_… (ancien nom de modèle) — conservées telles quelles.`);
}
const venora = products.find(p => p.handle === 'venora');
if (venora) { const pr = venora.variants.map(v => v.price); if (new Set(pr).size < pr.length) say('warn', `venora : deux tailles au même prix (${venora.variants.map(v => v.option1 + ' = ' + v.price / 100).join(', ')}) — identique au tableau, à confirmer.`); }

// ---- Collections (computed with the same rules as the Shopify smart collections) -----------------------
const collections = COLLECTIONS.map(c => ({ ...c, product_handles: c.order ? c.order.filter(h => products.some(p => p.handle === h)) : products.filter(p => c.match(p)).map(p => p.handle) }));
const empty = collections.filter(c => !c.product_handles.length); if (empty.length) say('info', `${empty.length} collections du menu sont vides pour l'instant et restent masquées : ${empty.map(c => c.title).join(', ')}.`);

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/catalog.json', JSON.stringify({ source: path.basename(SRC), products, collections: collections.map(({ match, order, ...c }) => c) }, null, 1));

const lv = { error: 'Erreur', warn: 'À vérifier', info: 'Info' };
const md = [`# Validation du catalogue`, '', `Source : \`${path.basename(SRC)}\` — ${rows.length} lignes, ${products.length} produits, ${products.reduce((a, p) => a + p.variants.length, 0)} variantes, ${products.reduce((a, p) => a + p.images.length, 0)} images.`, '',
  `Colonnes : ${head.length} (format d'export Shopify ${missingCols.length ? 'incomplet' : 'complet'}).`, '',
  '| Niveau | Constat |', '|---|---|', ...['error', 'warn', 'info'].flatMap(l => report.filter(r => r.lvl === l).map(r => `| ${lv[l]} | ${r.msg.replace(/\|/g, '\\|')} |`)), '',
  '## Répartition par collection', '', '| Collection | Produits |', '|---|---|', ...collections.map(c => `| ${c.title} (\`${c.handle}\`) | ${c.product_handles.length} |`)];
fs.mkdirSync('catalog', { recursive: true }); fs.writeFileSync('catalog/validation-report.md', md.join('\n') + '\n');
console.log(`${products.length} produits · ${report.filter(r => r.lvl === 'error').length} erreurs · ${report.filter(r => r.lvl === 'warn').length} à vérifier`);
collections.forEach(c => console.log(`  ${c.handle}: ${c.product_handles.length}`));
