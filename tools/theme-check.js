// node tools/theme-check.js [dir=theme] [--all] — Shopify Theme Check (official @shopify/theme-check-node).
// Default: report offenses in Signature Meubles files + files we modified; --all: whole theme.
const path = require('path');
const { themeCheckRun } = require('@shopify/theme-check-node');
const dir = path.resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'theme');
const all = process.argv.includes('--all');
const OURS = /(sm-|signature|section-sm-|config\/settings_(schema|data)|templates\/|sections\/(header|footer|overlay)-group|card-product\.liquid|product-information-blocks|main-product\.liquid|facets\.liquid|header\.liquid|main-cart\.liquid|layout\/theme\.liquid|locales\/(fr|en\.default)\.json)/;
(async () => {
  const { offenses } = await themeCheckRun(dir, undefined, () => {});
  const sev = ['error', 'warning', 'info'];
  const list = offenses.filter(o => all || OURS.test(o.uri.replace(/\\/g, '/')));
  const by = {}; for (const o of list) { const k = `${sev[o.severity] || o.severity} ${o.check}`; (by[k] = by[k] || []).push(o); }
  for (const [k, os] of Object.entries(by).sort()) { console.log(`${k} (${os.length})`); os.slice(0, 6).forEach(o => console.log(`   ${o.uri.split('/theme/').pop()}:${(o.start?.line ?? 0) + 1}  ${o.message.slice(0, 150)}`)); }
  const errs = list.filter(o => o.severity === 0).length;
  console.log(`\n${all ? 'All files' : 'Signature + modified files'}: ${list.length} offenses (${errs} errors) · whole theme: ${offenses.length} (${offenses.filter(o => o.severity === 0).length} errors)`);
})();
