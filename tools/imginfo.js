// node tools/imginfo.js files... — natural size + edge pixel colours via Chrome canvas
const { chromium } = require('playwright-core'); const path = require('path');
const toUrl = f => 'file:///' + path.resolve(f).split(path.sep).join('/');
(async () => {
  const files = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage();
  for (const f of files) {
    await p.goto(toUrl(f));
    const r = await p.evaluate(() => {
      const i = document.querySelector('img'); const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight;
      const x = c.getContext('2d'); x.drawImage(i, 0, 0);
      const px = (a, b) => { const d = x.getImageData(a, b, 1, 1).data; return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); };
      const W = c.width, H = c.height; return { w: W, h: H, tl: px(5, 5), tr: px(W - 5, 5), bl: px(5, H - 5), b: px(W / 2, H - 5) };
    });
    console.log(path.basename(f), JSON.stringify(r));
  }
  await b.close();
})();
