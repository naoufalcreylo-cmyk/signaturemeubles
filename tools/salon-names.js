// node tools/salon-names.js — matches the 48 salons of the export with « Tableau salons (1).pdf » by type + dimensions + price.
// Writes catalog/proposals/salons-noms-tableau.csv (proposal only — nothing is changed in Shopify or in the export).
const fs = require('fs'); const { execFileSync } = require('child_process');
const { stringify } = require('./csv');
const cat = JSON.parse(fs.readFileSync('data/catalog.json', 'utf8'));
const raw = execFileSync('pdftotext', ['-raw', 'C:/Users/HP/Downloads/Tableau salons (1).pdf', '-'], { encoding: 'latin1' });
const text = raw.replace(/\r/g, ''); // pdftotext emits Latin-1 on this system
// raw layout: "NAME Salon en L|U <dims> [cm] <price> DH" possibly wrapped across lines → join and tokenise on "DH"
const joined = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
const rows = []; const re = /([A-ZÀ-Ý][A-ZÀ-Ý' -]*?(?:\s(?:PM|GM|MM|X|LIMIT|SCRAPER|MÉRIDIENNE))*)\s+(Salon en [LU])\s+([\dxX PH ]+?)\s*(?:cm)?\s+([\d ]{4,7})\s?DH/g;
let m; while ((m = re.exec(joined))) rows.push({ name: m[1].trim().replace(/^.*?(?:Prix TTC|DH)\s*/, '').replace(/^TTC\s+/, ''), type: m[2], dims: m[3].replace(/\s+/g, ' ').trim(), price: +m[4].replace(/\s/g, '') });
const norm = d => d.toLowerCase().replace(/[^\dxph]/g, '').replace(/x/g, 'x');
const out = []; const used = new Set();
for (const p of cat.products.filter(p => /^Salon/.test(p.product_type))) {
  const cand = rows.filter((r, i) => !used.has(i) && r.type === p.product_type && r.price * 100 === p.price && norm(r.dims) === norm(p.dimensions || ''));
  const idx = rows.indexOf(cand[0]); if (idx >= 0) used.add(idx);
  out.push({ Handle: p.handle, 'Titre actuel (export)': p.title, 'Type': p.product_type, 'Dimensions': p.dimensions, 'Prix (DH)': p.price / 100,
    'Nom proposé (Tableau salons)': cand[0]?.name || '', 'Correspondance': cand.length === 1 ? 'type + dimensions + prix' : cand.length > 1 ? 'AMBIGUË' : 'AUCUNE', 'Images (nom de fichier)': p.images[0].src.split('/files/')[1].split('_01')[0] });
}
fs.mkdirSync('catalog/proposals', { recursive: true });
fs.writeFileSync('catalog/proposals/salons-noms-tableau.csv', stringify(Object.keys(out[0]), out));
const ok = out.filter(o => o.Correspondance === 'type + dimensions + prix').length;
console.log(`${rows.length} lignes lues dans le tableau · ${ok}/${out.length} salons appariés sans ambiguïté`);
out.filter(o => o.Correspondance !== 'type + dimensions + prix').forEach(o => console.log('  ?', o.Handle, o['Titre actuel (export)'], o.Dimensions, o['Prix (DH)'], o.Correspondance));
