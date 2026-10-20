// node tools/a11y.js [port] — axe-core WCAG 2.1 AA audit of key pages (desktop + mobile), lists violations by impact
const { chromium } = require('playwright-core'); const fs = require('fs');
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = `http://localhost:${process.argv[2] || 4200}`;
const PAGES = ['/', '/collections/salons-d-angle-en-l', '/collections/lits-adultes', '/products/soren', '/products/velart-l', '/cart', '/search?q=lit', '/pages/contact', '/pages/a-propos', '/collections'];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' }); const all = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) for (const path of PAGES) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto(BASE + path, { waitUntil: 'networkidle' });
    // scroll like a visitor so entrance animations finish before measuring contrast
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); }); await p.waitForTimeout(1200);
    await p.addScriptTag({ content: axe });
    const r = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] })).violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]?.trim()) , n: v.nodes.length })));
    for (const v of r) { const k = `${v.impact} ${v.id}`; (all[k] = all[k] || { help: v.help, where: [] }).where.push(`${w}${path} (${v.n}) ${v.nodes[0] || ''}`); }
    await p.close();
  }
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  for (const [k, v] of Object.entries(all).sort((a, b) => order[a[0].split(' ')[0]] - order[b[0].split(' ')[0]])) { console.log(`${k} — ${v.help}`); v.where.slice(0, 4).forEach(x => console.log('   ' + x.slice(0, 230))); }
  console.log(Object.keys(all).length ? `\n${Object.keys(all).length} rule(s) violated` : 'No axe violations'); await b.close();
})();
