// Navigation tree + smart-collection rules — single source for the preview, the Matrixify setup files and docs.
// Rules use only fields present in the CSV (Type / Tags). `rules` follow Shopify smart collection syntax.
const T = type => ({ rules: [{ column: 'type', relation: 'equals', condition: type }], match: p => p.product_type === type });
const TAG = tag => ({ rules: [{ column: 'tag', relation: 'equals', condition: tag }], match: p => p.tags.includes(tag) });
const ANY = (...rs) => ({ disjunctive: true, rules: rs.flatMap(r => r.rules), match: p => rs.some(r => r.match(p)) });
const EMPTY = { rules: [], match: () => false, manual: true }; // no reliable CSV signal yet: create when products exist

const NAV = [
  { title: 'Salons & Canapés', handle: 'salons-et-canapes', ...ANY(T('Salon en L'), T('Salon en U')), children: [
    { title: "Salons d'angle en L", handle: 'salons-d-angle-en-l', ...T('Salon en L') },
    { title: 'Salons en U', handle: 'salons-en-u', ...T('Salon en U') },
    { title: 'Salons marocains', handle: 'salons-marocains', ...EMPTY },
    { title: 'Canapés', handle: 'canapes', ...EMPTY },
    { title: 'Fauteuils', handle: 'fauteuils', ...EMPTY },
    { title: 'Poufs', handle: 'poufs', ...EMPTY }] },
  { title: 'Séjour & Salle à manger', handle: 'sejour-et-salle-a-manger', ...ANY(T('Table à manger'), T('Chaise')), children: [
    { title: 'Tables basses', handle: 'tables-basses', ...EMPTY },
    { title: 'Tables à manger', handle: 'tables-a-manger', ...T('Table à manger') },
    { title: 'Chaises', handle: 'chaises', ...T('Chaise') },
    { title: 'Buffets', handle: 'buffets', ...EMPTY },
    { title: 'Consoles', handle: 'consoles', ...EMPTY },
    { title: 'Meubles TV', handle: 'meubles-tv', ...EMPTY },
    { title: 'Étagères', handle: 'etageres', ...EMPTY }] },
  { title: 'Chambre adulte', handle: 'chambre-adulte', ...T('Lit'), children: [
    { title: 'Lits adultes', handle: 'lits-adultes', ...T('Lit') },
    { title: 'Matelas', handle: 'matelas', ...EMPTY }] },
  { title: 'Chambre enfant', handle: 'chambre-enfant', ...EMPTY, children: [
    { title: 'Lits une place', handle: 'lits-une-place', ...EMPTY },
    { title: 'Chevets', handle: 'chevets', ...EMPTY },
    { title: 'Bureaux enfants', handle: 'bureaux-enfants', ...EMPTY },
    { title: 'Commodes', handle: 'commodes', ...EMPTY }] },
  { title: 'Mobilier de bureau', handle: 'mobilier-de-bureau', ...EMPTY, children: [
    { title: 'Bureaux', handle: 'bureaux', ...EMPTY },
    { title: 'Fauteuils de direction', handle: 'fauteuils-de-direction', ...EMPTY },
    { title: 'Chaises visiteurs', handle: 'chaises-visiteurs', ...EMPTY }] },
  { title: "Mobilier d'extérieur", handle: 'mobilier-d-exterieur', ...EMPTY, children: [
    { title: 'Salons de jardin', handle: 'salons-de-jardin', ...EMPTY },
    { title: "Tables d'extérieur", handle: 'tables-d-exterieur', ...EMPTY },
    { title: "Chaises d'extérieur", handle: 'chaises-d-exterieur', ...EMPTY },
    { title: 'Parasols', handle: 'parasols', ...EMPTY },
    { title: 'Transats', handle: 'transats', ...EMPTY }] },
];
// Manual, merchant-curated collection for the homepage « Sélection » (starting proposal, to edit in Shopify admin)
const SELECTION = ['velart-l', 'sky-gm-u', 'loft-l', 'bellagio-u', 'celesto', 'venora', 'alba', 'ondea'];
const EXTRA = [{ title: 'La sélection', handle: 'la-selection', parent: null, manual: true, rules: [], handles: SELECTION, match: p => SELECTION.includes(p.handle), order: SELECTION }];
const COLLECTIONS0 = NAV.flatMap(n => [{ ...n, parent: null, children: undefined }, ...n.children.map(c => ({ ...c, parent: n.handle }))])
  .map(({ children, ...c }) => c);
const COLLECTIONS = [...COLLECTIONS0, ...EXTRA];
module.exports = { NAV, COLLECTIONS, SELECTION };

// Collection presentation (image = existing Shopify Files image, description = factual, no counts so it never goes stale)
const PRESENTATION = {
  'salons-et-canapes': ['SKY_GM_U_01_AMBIANCE.webp', 'Salons d’angle et salons en U pour le séjour, présentés avec leurs dimensions et leurs prix TTC.'],
  'salons-d-angle-en-l': ['FREEMAN_L_01_AMBIANCE.webp', 'Des salons d’angle qui s’installent contre deux murs et dégagent le centre de la pièce. Comparez les dimensions de chaque modèle avant de choisir.'],
  'salons-en-u': ['BELLAGIO_U_01_AMBIANCE.webp', 'Des salons en U pour réunir toute la famille autour de la table basse. Vérifiez les trois côtés avant de choisir.'],
  'sejour-et-salle-a-manger': ['venora-01-ambiance.webp', 'Tables à manger et chaises pour composer votre salle à manger.'],
  'tables-a-manger': ['elysee-01-ambiance.webp', 'Tables rondes et rectangulaires, proposées en plusieurs dimensions selon les modèles.'],
  'chaises': ['alba-01-ambiance.webp', 'Chaises de salle à manger à associer à votre table.'],
  'chambre-adulte': ['MURANO_01_AMBIANCE.webp', 'Des lits du 90 × 200 au 200 × 200 cm, certains disponibles avec ou sans rangement.'],
  'lits-adultes': ['ELVIS_01_AMBIANCE.webp', 'Des lits du 90 × 200 au 200 × 200 cm, certains disponibles avec ou sans rangement. Chaque fiche détaille les tailles et leurs prix.'],
  'la-selection': ['VELART_L_01_AMBIANCE.webp', 'Une sélection de modèles choisis par Signature Meubles.'],
};
for (const c of COLLECTIONS) if (PRESENTATION[c.handle]) [c.image, c.description] = PRESENTATION[c.handle];
