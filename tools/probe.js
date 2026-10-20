// node tools/probe.js <url> <selector> [width] — box, visibility, opacity chain of matching elements
const { chromium } = require('playwright-core');
(async () => { const [url, sel, w = '1440'] = process.argv.slice(2); const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  const r = await p.$$eval(sel, els => els.map(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); let o = e, chain = []; while (o && o !== document.body) { const cs = getComputedStyle(o); if (cs.opacity !== '1' || cs.visibility !== 'visible' || cs.display === 'none') chain.push(`${o.tagName.toLowerCase()}.${[...o.classList].join('.')}: op=${cs.opacity} vis=${cs.visibility} disp=${cs.display}`); o = o.parentElement; }
    return { tag: e.tagName, cls: e.className, y: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width), bg: s.backgroundColor, color: s.color, chain }; }));
  console.log(JSON.stringify(r, null, 1)); await b.close(); })();
