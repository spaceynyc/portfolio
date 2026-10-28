// Keyboard-only walkthrough of the changed components, each step checked against its APG / WCAG item.
// Usage: node qa/a11y/keyboard.mjs [baseUrl] [outDir]
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:4173';
const out = process.argv[3] ?? 'qa/a11y/out';
await mkdir(out, { recursive: true });
const results = [];
const check = (component, item, pass, evidence) => results.push({ component, item, pass: Boolean(pass), evidence });

const browser = await chromium.launch();
const active = page => page.evaluate(() => {
  const el = document.activeElement;
  return { tag: el.tagName.toLowerCase(), cls: String(el.className), name: el.getAttribute('aria-label') || el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), expanded: el.getAttribute('aria-expanded') };
});
const settle = page => page.evaluate(() => new Promise(resolve => {
  let last = -1, still = 0;
  const t0 = performance.now();
  const step = () => {
    still = scrollY === last ? still + 1 : 0;
    last = scrollY;
    if (still >= 8 || performance.now() - t0 > 2500) resolve();
    else requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}));
async function tabTo(page, predicate, max = 80) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    const a = await active(page);
    if (predicate(a)) return a;
  }
  return null;
}

// ---------- 1. Phone menu: APG Disclosure (Show/Hide) + Disclosure Navigation example ----------
for (const width of [320, 375]) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const C = `Menu disclosure @${width}`;
  const order = [];
  for (let i = 0; i < 4; i++) { await page.keyboard.press('Tab'); order.push((await active(page)).name); }
  const visual = await page.$$eval('.site-header .brand, .site-header .menu-toggle, .site-header .header-cta', els => els.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left).map(e => e.getAttribute('aria-label') || e.textContent.trim()));
  check(C, 'WCAG 2.4.3: Tab order matches visual order (logo, menu, pill)', JSON.stringify(order.slice(1)) === JSON.stringify(visual), { tab: order, visual });
  const box = await page.locator('.menu-toggle').boundingBox();
  check(C, 'WCAG 1.4.10 / 2.5.8: button fully on screen, at least 24×24', box.x >= 0 && box.x + box.width <= width && box.width >= 24, box);
  await page.locator('.menu-toggle').focus();
  let a = await active(page);
  check(C, 'APG: control is a button with aria-expanded=false, stable name', a.tag === 'button' && a.expanded === 'false' && a.name === 'Menu', a);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  a = await active(page);
  const listShown = await page.locator('.main-nav-list').isVisible();
  check(C, 'APG: Enter opens; aria-expanded=true; name unchanged', a.expanded === 'true' && listShown && a.name === 'Menu', { ...a, listShown });
  await page.screenshot({ path: join(out, `kbd-menu-open-${width}.png`), clip: { x: 0, y: 0, width, height: 320 } });
  await page.keyboard.press('Tab');
  a = await active(page);
  check(C, 'APG: Tab moves into the open list (first link)', a.name === 'Work', a);
  await page.keyboard.press('Escape');
  a = await active(page);
  check(C, 'APG: Escape closes and returns focus to the button', a.cls.includes('menu-toggle') && a.expanded === 'false' && !(await page.locator('.main-nav-list').isVisible()), a);
  await page.keyboard.press('Space');
  check(C, 'APG: Space also toggles', (await active(page)).expanded === 'true');
  for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
  a = await active(page);
  const closed = (await page.locator('.menu-toggle').getAttribute('aria-expanded')) === 'false';
  check(C, 'APG example: focus leaving the nav closes it', a.cls.includes('header-cta') && closed, a);
  await page.close();
}

// ---------- 2. Belt row: block link (Inclusive Components "Cards") ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const C = 'Belt row link @1440';
  const names = await page.$$eval('.belt-name a', els => els.map(e => e.textContent.trim()));
  const titles = await page.$$eval('.belt-item', els => els.map(e => e.querySelector('h4').textContent.trim()));
  check(C, 'WCAG 2.4.4 / 2.5.3: link name is the project name only', names.length === 8 && names.every((n, i) => n === titles[i] && n.split(' ').length <= 3), names);
  const a = await tabTo(page, x => x.name === 'Zipchair Intel');
  await settle(page);
  check(C, 'Reachable with Tab (one stop per row)', a, a);
  await page.waitForTimeout(300); // let the 0.2s name color transition finish
  const ring = await page.evaluate(() => {
    const el = document.activeElement;
    const after = getComputedStyle(el, '::after');
    const row = el.closest('li').getBoundingClientRect();
    return { outline: `${after.outlineStyle} ${after.outlineWidth} ${after.outlineColor}`, rowH: Math.round(row.height), nameColor: getComputedStyle(el.closest('h4')).color };
  });
  check(C, 'WCAG 2.4.7: 2px lavender ring around the whole row; name turns lavender like hover', ring.outline.startsWith('solid 2px') && ring.nameColor === 'rgb(179, 173, 255)', ring);
  await page.evaluate(() => document.querySelector('.belt-item').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await settle(page);
  const row = await page.locator('.belt-item').first().boundingBox();
  await page.screenshot({ path: join(out, 'kbd-belt-focus.png'), clip: { x: row.x - 12, y: row.y - 12, width: row.width + 24, height: row.height + 24 } });
  const clickTarget = await page.evaluate(() => {
    const li = document.querySelector('.belt-item');
    const r = li.querySelector('.belt-thumb').getBoundingClientRect();
    return document.elementFromPoint(r.left + 5, r.top + 5)?.tagName.toLowerCase();
  });
  check(C, 'Whole row is still the click target (thumbnail hits the link overlay)', clickTarget === 'a', { elementAtThumbnail: clickTarget });

  // ---------- 3. Project dialog: APG Dialog (Modal), opened from that row ----------
  const D = 'Project dialog @1440';
  await page.keyboard.press('Enter');
  await page.waitForSelector('dialog[open]');
  let f = await active(page);
  check(D, 'APG: focus moves into the dialog (its title, tabindex=-1)', f.tag === 'h2' && f.name === 'Zipchair Intel', f);
  const stops = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    stops.push(await page.evaluate(() => Boolean(document.activeElement.closest('dialog'))));
  }
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Shift+Tab');
    stops.push(await page.evaluate(() => Boolean(document.activeElement.closest('dialog'))));
  }
  check(D, 'APG: Tab and Shift+Tab stay inside the dialog', stops.every(Boolean), stops);
  const fullSize = await page.locator('.dialog-media-link').evaluate(el => ({ name: el.textContent.replace(/\s+/g, ' ').trim(), rel: el.rel }));
  check(D, 'New-tab link says so and drops the referrer', fullSize.name.includes('opens in a new tab') && fullSize.rel.includes('noreferrer'), fullSize);
  await page.screenshot({ path: join(out, 'kbd-dialog.png') });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  f = await active(page);
  check(D, 'APG: Escape closes and focus returns to the opener', f.name === 'Zipchair Intel', f);

  // ---------- 4. Primitives: capsule, round button, text link ----------
  const P = 'Control primitives @1440';
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('.copy-email').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const status = await page.locator('.copy-status').evaluate(el => ({ role: el.getAttribute('role'), text: el.textContent }));
  check(P, 'Capsule (Copy address): Enter activates; result announced through role=status', status.role === 'status' && status.text.length > 0, status);
  const sizes = await page.$$eval('.pill, .capsule, .round-button, .text-link', els => els.filter(e => e.getClientRects().length).map(e => {
    // Layout size, not the on-screen box: a receding stage is scaled down mid-animation.
    return { cls: e.className.split(' ')[0], w: e.offsetWidth, h: e.offsetHeight, text: e.textContent.trim().slice(0, 20) };
  }));
  // The one exception is the inline legal link, which is in a sentence (2.5.8 inline exception) and not a .text-link.
  check(P, 'WCAG 2.5.8: every primitive is at least 24×24 (all 44px tall)', sizes.every(s => s.h >= 44 && s.w >= 24), { count: sizes.length, smallest: sizes.reduce((m, s) => (s.h < m.h ? s : m), sizes[0]) });
  await page.goto(base + '/#drift', { waitUntil: 'networkidle' });
  await page.waitForSelector('dialog[open]');
  await page.locator('.dialog-close').focus();
  const closeName = await active(page);
  await page.keyboard.press('Space');
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  check(P, 'Round button (Close): named, Space activates', closeName.name === 'Close', closeName);
  await page.close();
}

// ---------- 5. Launch stages + rail: focus never lands under the next stage (WCAG 2.4.11) ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const C = 'Launch stages @1440';
  const sample = () => page.evaluate(() => {
    const el = document.activeElement;
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    let opacity = 1;
    for (let n = el; n; n = n.parentElement) opacity *= Number(getComputedStyle(n).opacity);
    const current = document.querySelector('[data-rail][aria-current]');
    return { name: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), stage: el.closest('.stage')?.className.split(' ')[1], visible: Boolean(hit && (hit === el || el.contains(hit))), opacity: Math.round(opacity * 100) / 100, rail: current?.textContent.trim(), railToken: current?.getAttribute('aria-current') };
  });
  const forward = [];
  await tabTo(page, x => x.name === 'See the work');
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); await settle(page); forward.push(await sample()); }
  check(C, 'Tab forward: every stage link fully visible and opaque', forward.every(s => s.visible && s.opacity > 0.97), forward);
  const railOk = forward.filter(s => s.stage).every(s => ({ 'stage-1': 'Socionics Galaxy', 'stage-2': 'Socionics Research Lab', 'stage-3': 'Zipchair AI Assistant' })[s.stage] === s.rail && s.railToken === 'location');
  check(C, 'Rail marks the focused stage with aria-current=location', railOk, forward.map(s => [s.stage, s.rail, s.railToken]));
  const back = [];
  await page.locator('.belt-name a').first().focus();
  await settle(page);
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Shift+Tab'); await settle(page); back.push(await sample()); }
  check(C, 'Shift+Tab back: no stage link covered by the next stage', back.every(s => s.visible && s.opacity > 0.97), back);
  await page.screenshot({ path: join(out, 'kbd-stage-back.png') });
  await page.close();
}

// ---------- 6. Reduced motion: stages unpin, so the fix must not move anything ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await tabTo(page, x => x.name === 'See the work');
  await page.keyboard.press('Tab');
  const before = await page.evaluate(() => scrollY);
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => scrollY);
  check('Launch stages, reduced motion', 'No snapping when stages are not pinned', before === after, { before, after });
  await context.close();
}

await browser.close();
await writeFile(join(out, 'keyboard.json'), JSON.stringify(results, null, 2));
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.component} — ${r.item}${r.pass ? '' : '  ' + JSON.stringify(r.evidence)}`);
console.log(`${results.filter(r => r.pass).length}/${results.length} passed`);
