// node tools/flows.js [port=4200] — real shopping interactions against the local preview (Chromium, desktop + mobile)
// Variant change → price/URL, add to cart → drawer + count, qty update, remove, cart page, filters, sort, search, mobile menu, keyboard.
const { chromium } = require('playwright-core');
const BASE = `http://localhost:${process.argv[2] || 4200}`;
const results = []; const ok = (name, cond, info = '') => { results.push({ name, pass: !!cond, info }); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`); };
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const errors = []; const watch = p => { p.on('pageerror', e => errors.push(e.message)); p.on('console', m => m.type() === 'error' && !/404/.test(m.text()) && errors.push(m.text())); };
  await fetch(BASE + '/cart/clear.js', { method: 'POST' });

  // ---- Desktop PDP -------------------------------------------------------------------------
  const d = await b.newPage({ viewport: { width: 1440, height: 900 } }); watch(d);
  await d.goto(BASE + '/products/soren', { waitUntil: 'networkidle' });
  const price0 = (await d.locator('.product__info-container .price, .product__info-container .f-price').first().innerText()).trim();
  await d.getByRole('radio', { name: /160 x 200 cm/ }).first().check({ force: true }).catch(async () => { await d.locator('label:has-text("160 x 200 cm")').first().click(); });
  await d.waitForTimeout(1200);
  await d.locator('label:has-text("Avec")').first().click(); await d.waitForTimeout(1200);
  const price1 = (await d.locator('.product__info-container .price, .product__info-container .f-price').first().innerText()).trim();
  ok('Variant change updates price', price1 !== price0 && /7\s?420/.test(price1), `${price0.replace(/\s+/g, ' ')} → ${price1.replace(/\s+/g, ' ')}`);
  ok('Variant change updates URL', /variant=\d+/.test(d.url()), d.url().replace(BASE, ''));
  const vid = await d.locator('form[data-type="add-to-cart-form"] input[name="id"]').first().inputValue();
  await d.locator('.product__info-container button[name="add"]').first().click();
  await d.waitForTimeout(1500);
  const drawerOpen = await d.locator('#CartDrawer, cart-drawer').first().evaluate(e => e.hasAttribute('open') || e.classList.contains('active') || e.getAttribute('aria-hidden') === 'false' || getComputedStyle(e).visibility === 'visible').catch(() => false);
  ok('Add to cart opens the cart drawer', drawerOpen);
  const cart1 = await (await d.request.get(BASE + '/cart.js')).json();
  ok('Cart contains the selected variant', cart1.items.length === 1 && String(cart1.items[0].variant_id) === vid && cart1.items[0].variant_title === '160 x 200 cm / Avec', cart1.items[0]?.variant_title);
  const drawerText = await d.locator('#CartDrawer, cart-drawer').first().innerText().catch(() => '');
  ok('Drawer shows line item, variant and total', /SOREN/.test(drawerText) && /160 x 200 cm/.test(drawerText) && /7\s?420/.test(drawerText));
  const count = await d.locator('cart-count').first().innerText().catch(() => '');
  ok('Header cart count updated', count.trim() === '1', `count=${count.trim()}`);
  await d.screenshot({ path: 'research/shots/flow-drawer.png' });

  // qty + in drawer
  const plus = d.locator('#CartDrawer button[name="plus"], cart-drawer button[name="plus"], #CartDrawer .quantity__button:last-child').first();
  if (await plus.count()) { await plus.click(); await d.waitForTimeout(1800); }
  const cart2 = await (await d.request.get(BASE + '/cart.js')).json();
  ok('Quantity increase in drawer', cart2.items[0]?.quantity === 2 && cart2.total_price === 2 * 742000, `qty=${cart2.items[0]?.quantity} total=${cart2.total_price}`);
  await d.keyboard.press('Escape'); await d.waitForTimeout(600);

  // ---- Cart page ------------------------------------------------------------------------------
  await d.goto(BASE + '/cart', { waitUntil: 'networkidle' });
  const cartText = await d.locator('main').innerText();
  ok('Cart page lists item with total', /SOREN/.test(cartText) && /14\s?840/.test(cartText));
  const checkoutBtn = d.locator('main [name="checkout"], main button:has-text("Passer la commande"), main a:has-text("Passer la commande")').first();
  ok('Checkout button present', await checkoutBtn.count() > 0, await checkoutBtn.innerText().catch(() => ''));
  const remove = d.locator('main a.btn-remove[aria-label^="Supprimer"]:visible').first();
  if (await remove.count()) { await remove.click(); await d.waitForTimeout(1800); }
  const cart3 = await (await d.request.get(BASE + '/cart.js')).json();
  ok('Remove line item', cart3.item_count === 0, `items=${cart3.item_count}`);
  ok('Empty cart state shown', /vide/i.test(await d.locator('main').innerText()));

  // ---- Collection: filter + sort + pagination ------------------------------------------------------
  await d.goto(BASE + '/collections/lits-adultes', { waitUntil: 'networkidle' });
  const n0 = await d.locator('.product-card').count();
  await d.goto(BASE + '/collections/lits-adultes?filter.v.option.dimensions=90+x+200+cm', { waitUntil: 'networkidle' });
  const n1 = await d.locator('.product-card').count();
  ok('Dimensions filter narrows results', n1 > 0 && n1 < n0, `${n0} → ${n1}`);
  await d.goto(BASE + '/collections/salons-d-angle-en-l?sort_by=price-ascending', { waitUntil: 'networkidle' });
  const prices = await d.locator('.product-card .price, .product-card .f-price').allInnerTexts();
  const nums = prices.map(t => +t.replace(/[^\d]/g, '').slice(0, 6)).filter(Boolean);
  ok('Sort by price ascending', nums.length > 3 && nums.every((v, i) => !i || v >= nums[i - 1]), nums.slice(0, 5).join(' ≤ '));
  await d.getByRole('button', { name: /Filtrer/ }).first().click().catch(() => {}); await d.waitForTimeout(800);
  ok('Filter drawer opens', await d.locator('#FacetDrawer').evaluate(e => !e.hidden && e.getBoundingClientRect().width > 0 && /Prix/.test(e.innerText)).catch(() => false));
  await d.screenshot({ path: 'research/shots/flow-filters.png' });
  await d.keyboard.press('Escape');

  // ---- Search ----------------------------------------------------------------------------------
  await d.goto(BASE + '/', { waitUntil: 'networkidle' });
  const input = d.locator('header input[type="search"]').first(); await input.click(); await input.fill('celesto'); await d.waitForTimeout(1500);
  ok('Predictive search suggests product', /CÉLESTO/i.test(await d.locator('header.header').innerText()));
  await input.press('Enter'); await d.waitForLoadState('networkidle');
  ok('Search results page', /search/.test(d.url()) && /CÉLESTO/.test(await d.locator('main').innerText()));

  // ---- Keyboard: skip link + focus visible --------------------------------------------------------
  await d.goto(BASE + '/', { waitUntil: 'networkidle' }); await d.keyboard.press('Tab');
  const skip = await d.evaluate(() => document.activeElement?.className + '|' + document.activeElement?.textContent.trim());
  ok('First Tab focuses skip link', /skip-to-content/.test(skip), skip);

  // ---- Mobile: menu accordion + sticky ATC + add to cart ------------------------------------------------
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); watch(m);
  await m.goto(BASE + '/', { waitUntil: 'networkidle' });
  await m.locator('.menu-drawer-button').first().click(); await m.waitForTimeout(900);
  const drawerTxt = await m.locator('#MenuDrawer, menu-drawer').first().innerText().catch(() => '');
  ok('Mobile menu opens with categories + secondary links', /Salons & Canapés/.test(drawerTxt) && /Contact/.test(drawerTxt), drawerTxt.split('\n').filter(Boolean).slice(0, 8).join(' | '));
  await m.screenshot({ path: 'research/shots/flow-menu-mobile.png' });
  const sub = m.locator('#MenuDrawer summary:has-text("Salons & Canapés"), menu-drawer summary:has-text("Salons & Canapés"), #MenuDrawer button:has-text("Salons & Canapés")').first();
  if (await sub.count()) { await sub.click(); await m.waitForTimeout(800); }
  const subTxt = await m.locator('#MenuDrawer, menu-drawer').first().innerText().catch(() => '');
  ok('Mobile submenu shows children + Voir tout', /Salons d'angle en L/.test(subTxt) && /Voir tout/.test(subTxt));
  await m.screenshot({ path: 'research/shots/flow-submenu-mobile.png' });
  await m.goto(BASE + '/products/velart-l', { waitUntil: 'networkidle' });
  for (const y of [300, 600, 950]) { await m.evaluate(y => scrollTo(0, y), y); await m.waitForTimeout(400); } await m.waitForTimeout(800);
  const sticky = await m.locator('sticky-atc-bar-minimalist').first().evaluate(e => e.classList.contains('sticky-atc-bar--show') && Math.round(e.getBoundingClientRect().bottom) <= innerHeight).catch(() => false);
  ok('Mobile sticky add-to-cart bar appears after scroll', sticky, await m.evaluate(() => `scrollY=${scrollY} cls=${document.querySelector('sticky-atc-bar-minimalist')?.className}`));
  await m.screenshot({ path: 'research/shots/flow-sticky-mobile.png' });
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok('No horizontal overflow on mobile PDP', overflow <= 0, `overflow=${overflow}`);

  ok('No JavaScript errors', errors.length === 0, [...new Set(errors)].slice(0, 5).join(' || '));
  await b.close();
  const f = results.filter(r => !r.pass).length; console.log(`\n${results.length - f}/${results.length} passed`);
  require('fs').writeFileSync('research/flows.json', JSON.stringify(results, null, 1));
})();
