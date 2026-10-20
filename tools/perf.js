// node tools/perf.js [port] — LCP, CLS, requests, transfer by type, LCP element + priority (mobile, 4G-like throttling)
// Local server: HTML/CSS/JS come from localhost, product images from cdn.shopify.com (real CDN).
const { chromium } = require('playwright-core');
const BASE = `http://localhost:${process.argv[2] || 4200}`;
const PAGES = ['/', '/collections/salons-d-angle-en-l', '/products/velart-l'];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const path of PAGES) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 70, downloadThroughput: 9e6 / 8, uploadThroughput: 3e6 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const bytes = {}; let reqs = 0;
    p.on('response', async r => { reqs++; const t = r.request().resourceType(); const len = +(r.headers()['content-length'] || 0) || (await r.body().catch(() => Buffer.alloc(0))).length; bytes[t] = (bytes[t] || 0) + len; });
    await p.addInitScript(() => { window.__cls = 0; window.__lcp = null;
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(l => { const e = l.getEntries().at(-1); window.__lcp = { t: e.startTime, el: e.element ? (e.element.tagName + '.' + [...e.element.classList].slice(0, 2).join('.')) : '', url: (e.url || '').split('/').pop().slice(0, 60), prio: e.element?.getAttribute?.('fetchpriority'), loading: e.element?.getAttribute?.('loading') }; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
    const t0 = Date.now(); await p.goto(BASE + path, { waitUntil: 'load' }); const load = Date.now() - t0; await p.waitForTimeout(2500);
    const m = await p.evaluate(() => ({ cls: +window.__cls.toFixed(3), lcp: window.__lcp, scripts: document.scripts.length, extScripts: [...document.scripts].filter(s => s.src).length, imgs: document.images.length, lazy: [...document.images].filter(i => i.loading === 'lazy').length, noDims: [...document.images].filter(i => !i.getAttribute('width') || !i.getAttribute('height')).map(i => i.src.split('/').pop().slice(0, 40)).slice(0, 5) }));
    const kb = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v / 1024) + 'kB']));
    console.log(`${path}\n  load ${load}ms · LCP ${Math.round(m.lcp?.t)}ms (${m.lcp?.el} ${m.lcp?.url} prio=${m.lcp?.prio} loading=${m.lcp?.loading}) · CLS ${m.cls}\n  requests ${reqs} · ${JSON.stringify(kb(bytes))}\n  scripts ${m.scripts} (${m.extScripts} external) · images ${m.imgs} (${m.lazy} lazy) · without width/height: ${m.noDims.length ? m.noDims.join(', ') : 'none'}`);
    await ctx.close();
  }
  await b.close();
})();
