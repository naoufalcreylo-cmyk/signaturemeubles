// node tools/logo-variants.js — cropped logo variants from research/logo/logo-horizontal.svg (converted from the vector PDF)
// Outputs research/logo/sm-{logo,logo-compact,monogram}-{dark,light}.svg. Path indices refer to the ORIGINAL document order,
// so filtering happens before the background rectangle is removed.
const { chromium } = require('playwright-core'); const fs = require('fs');
const src = fs.readFileSync('research/logo/logo-horizontal.svg', 'utf8');
const BG = '#24351b';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage(); await p.setContent(src);
  const boxes = await p.evaluate(bg => [...document.querySelectorAll('path')].map((el, i) => {
    const r = el.getBoundingClientRect(); const s = document.querySelector('svg').getBoundingClientRect();
    return { i, skip: !!el.closest('clipPath') || el.getAttribute('fill') === bg, x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
  }), BG);
  await b.close();
  const ink = boxes.filter(x => !x.skip);
  const union = bs => { const x0 = Math.min(...bs.map(b => b.x)), y0 = Math.min(...bs.map(b => b.y)), x1 = Math.max(...bs.map(b => b.x + b.w)), y1 = Math.max(...bs.map(b => b.y + b.h)); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };
  const all = union(ink);
  const monoRight = all.x + all.w * 0.25;
  const mono = ink.filter(b => b.x + b.w < monoRight);
  // Tagline = paths entirely below the wordmark's lower edge (wordmark letters end ~62 % down the artwork)
  const tagTop = all.y + all.h * 0.75;
  const compact = ink.filter(b => b.x + b.w < monoRight || b.y < tagTop);
  const sets = { logo: ink, 'logo-compact': compact, monogram: mono };
  for (const [name, keep] of Object.entries(sets)) {
    const ids = new Set(keep.map(k => k.i)); const box = union(keep); const pad = 14;
    for (const [tone, ink1, accent] of [['dark', '#24351b', '#a07007'], ['light', '#ffffff', '#c9a35a']]) {
      let idx = -1;
      let s = src.replace(/<path[^>]*\/>/g, m => { idx++; const bx = boxes[idx]; if (!bx) return m; if (bx.skip) return m.includes(BG) ? '' : m; return ids.has(idx) ? m : ''; });
      s = s.replace(/#ffffff/gi, '__INK__').replace(/#a07007/gi, accent).replace(/__INK__/g, ink1);
      const vb = [box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2].map(v => +v.toFixed(1));
      s = s.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/, `viewBox="${vb.join(' ')}"`).replace(/ xmlns:inkscape="[^"]+"/, '').replace(/ inkscape:[a-z]+="[^"]*"/g, '');
      const file = `research/logo/sm-${name}-${tone}.svg`; fs.writeFileSync(file, s); console.log(file, keep.length, 'paths', vb.join(' '));
    }
  }
})();
