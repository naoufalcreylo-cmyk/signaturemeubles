// node tools/check-pages.js [port=4200] [paths...] — fetch pages from the preview, report status + Liquid errors + missing translations
const port = process.argv[2] || 4200;
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/collections/salons-et-canapes', '/collections/salons-d-angle-en-l', '/collections/lits-adultes', '/collections/chaises', '/collections/tables-a-manger',
  '/products/loren-l', '/products/soren', '/products/elvia', '/products/venora', '/cart', '/search?q=lit', '/pages/a-propos', '/pages/contact', '/collections', '/collections/matelas', '/nope', '/account/login'];
(async () => {
  for (const p of paths) {
    const r = await fetch(`http://localhost:${port}${p}`); const t = await r.text();
    const errs = [...t.matchAll(/Liquid error in ([\w-]+): ([^<]{0,160})/g)].map(m => `${m[1]}: ${m[2]}`);
    const tm = [...new Set([...t.matchAll(/translation missing: ([\w.]+)/g)].map(m => m[1]))];
    console.log(`${r.status} ${p} ${(t.length / 1024).toFixed(0)}kB${errs.length ? '\n   ERR ' + [...new Set(errs)].join('\n   ERR ') : ''}${tm.length ? '\n   T? ' + tm.join(', ') : ''}`);
  }
  const m = await (await fetch(`http://localhost:${port}/__missing`)).text(); const miss = m.split('\n').filter(x => x.startsWith('MISSING')); if (miss.length) console.log('Missing keys:', miss.length, miss.slice(0, 10).join(' | '));
  console.log('EN fallbacks:', m.split('\n').filter(x => x.startsWith('EN')).length);
})();
