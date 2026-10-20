// node tools/add-product-blocks.js — registers the Signature Meubles block types in sections/main-product.liquid (idempotent)
const fs = require('fs');
const F = 'theme/sections/main-product.liquid';
let src = fs.readFileSync(F, 'utf8');
const re = /({%-?\s*schema\s*-?%})([\s\S]*?)({%-?\s*endschema\s*-?%})/;
const schema = JSON.parse(src.match(re)[2]);
const blocks = [
  { type: 'sm_specs', name: 'SM · Caractéristiques', limit: 1, settings: [
    { type: 'text', id: 'heading', label: 'Titre', default: 'Caractéristiques' },
    { type: 'checkbox', id: 'show_type', label: 'Afficher la catégorie', default: true },
    { type: 'checkbox', id: 'show_options', label: 'Afficher les options (dimensions, rangement…)', default: true },
    { type: 'paragraph', content: 'Matière, finition, entretien et livraison s’affichent depuis les métachamps produit signature.matiere, signature.finition, signature.entretien et signature.livraison, uniquement s’ils sont remplis.' },
    { type: 'richtext', id: 'delivery_text', label: 'Livraison (texte commun à tous les produits)', info: 'Laissez vide tant que les conditions ne sont pas confirmées.' },
    { type: 'checkbox', id: 'show_ttc_note', label: 'Mention « Prix affichés TTC »', default: true }
  ] },
  { type: 'sm_whatsapp', name: 'SM · Conseil WhatsApp', limit: 1, settings: [
    { type: 'paragraph', content: 'Visible uniquement si un numéro est renseigné dans Paramètres du thème > Signature Meubles.' },
    { type: 'text', id: 'label', label: 'Libellé', default: 'Demander conseil sur WhatsApp' }
  ] },
];
for (const b of blocks) { const i = schema.blocks.findIndex(x => x.type === b.type); if (i >= 0) schema.blocks[i] = b; else schema.blocks.splice(schema.blocks.findIndex(x => x.type === 'custom_liquid'), 0, b); }
src = src.replace(re, `$1\n${JSON.stringify(schema, null, 2)}\n$3`);
fs.writeFileSync(F, src); console.log('main-product blocks:', schema.blocks.map(b => b.type).join(', '));
