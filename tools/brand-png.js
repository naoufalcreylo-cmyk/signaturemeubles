// node tools/brand-png.js — raster brand files from the theme SVG assets (Chrome render)
// favicon-512.png (monogram on forêt), logo-email-600.png (full logo on white), social-share-1200x628.png (logo + hero photo)
const { chromium } = require('playwright-core'); const path = require('path'); const fs = require('fs');
const A = f => 'file:///' + path.resolve('theme/assets', f).split(path.sep).join('/');
const OUT = 'catalog/setup/brand'; fs.mkdirSync(OUT, { recursive: true });
const jobs = [
  ['favicon-512.png', 512, 512, `<body style="margin:0;background:#24351b;display:grid;place-items:center;height:512px"><img src="${A('sm-logo-monogram-light.svg')}" style="width:330px"></body>`],
  ['logo-email-600.png', 600, 140, `<body style="margin:0;background:#fff;display:grid;place-items:center;height:140px"><img src="${A('sm-logo-full-dark.svg')}" style="width:540px"></body>`],
  ['social-share-1200x628.png', 1200, 628, `<body style="margin:0;width:1200px;height:628px;display:grid;grid-template-columns:520px 1fr;background:#24351b">
    <div style="display:grid;align-content:center;padding:0 56px"><img src="${A('sm-logo-full-light.svg')}" style="width:420px"></div>
    <div style="background:url(https://cdn.shopify.com/s/files/1/0770/9242/1718/files/VELART_L_01_AMBIANCE.webp?width=1000) 50% 60%/cover"></div></body>`],
];
(async () => { const b = await chromium.launch({ channel: 'chrome' });
  for (const [name, w, h, html] of jobs) { const p = await b.newPage({ viewport: { width: w, height: h } }); const tmp = path.resolve('research', `_${name}.html`); fs.writeFileSync(tmp, html); await p.goto('file:///' + tmp.split(path.sep).join('/'), { waitUntil: 'networkidle' }); await p.waitForTimeout(400); await p.screenshot({ path: `${OUT}/${name}` }); await p.close(); console.log(name); }
  for (const f of ['sm-logo-full-dark.svg', 'sm-logo-full-light.svg', 'sm-logo-monogram-dark.svg', 'sm-logo-monogram-light.svg']) fs.copyFileSync(`theme/assets/${f}`, `${OUT}/${f}`);
  await b.close(); })();
