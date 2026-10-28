// Accessibility and layout audit for the built site.
// Usage: npm run build && npm run preview -- --port 4173, then: node qa/a11y/audit.mjs [baseUrl] [outDir]
// Writes report.json plus screenshots to outDir (default qa/a11y/out).
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:4173';
const out = process.argv[3] ?? 'qa/a11y/out';
await mkdir(out, { recursive: true });

const pages = [
  { name: 'home', path: '/' },
  { name: 'home-dialog', path: '/#drift', dialog: true },
  { name: 'hermes-sms', path: '/hermes-sms/' },
  { name: 'privacy', path: '/privacy/' },
  { name: 'terms', path: '/terms/' },
];
const widths = [320, 375, 768, 1440];
const report = { base, axe: [], layout: [], forcedColors: [], focus: [] };

const browser = await chromium.launch();

async function open(width, path, opts = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: opts.reducedMotion ?? 'no-preference', forcedColors: opts.forcedColors ?? 'none' });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

// Waits out smooth scrolling: resolves once scrollY holds still for several frames.
const settle = page => page.evaluate(() => new Promise(resolve => {
  let last = -1, still = 0;
  const started = performance.now();
  const step = () => {
    still = scrollY === last ? still + 1 : 0;
    last = scrollY;
    if (still >= 8 || performance.now() - started > 2500) resolve();
    else requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}));

// ---------- axe: WCAG 2.0/2.1/2.2 A and AA, plus best practices ----------
for (const p of pages) {
  for (const width of [375, 1440]) {
    const { context, page } = await open(width, p.path);
    if (p.dialog) await page.waitForSelector('dialog[open]');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    report.axe.push({
      page: p.name,
      width,
      passes: results.passes.length,
      incomplete: results.incomplete.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      violations: results.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => n.target.join(' ')) })),
    });
    await context.close();
  }
}

// ---------- Layout: horizontal scroll and clipped content at each width ----------
for (const p of pages) {
  for (const width of widths) {
    const { context, page } = await open(width, p.path);
    if (p.dialog) await page.waitForSelector('dialog[open]');
    const layout = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const hScroll = document.documentElement.scrollWidth > vw;
      const clipped = [];
      // Decorative art and stage screenshots are designed to bleed off the right edge (DESIGN.md: Layout).
      const allowedBleed = el => el.closest('.hero-visual, .stage-media, [aria-hidden="true"]');
      const visible = el => {
        const s = getComputedStyle(el);
        return s.visibility !== 'hidden' && s.display !== 'none' && el.getClientRects().length;
      };
      const scope = document.querySelector('dialog[open]') ?? document.body;
      for (const el of scope.querySelectorAll('a, button, h1, h2, h3, p, li, span, img, figcaption, summary, input')) {
        if (!visible(el) || allowedBleed(el) || el.closest('.visually-hidden, .skip-link')) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        // Content spilling past its own box (text cut by overflow or nowrap).
        const s = getComputedStyle(el);
        const selfClip = el.scrollWidth > el.clientWidth + 1 && ['hidden', 'clip'].includes(s.overflowX) && el.clientWidth > 0;
        if (r.right > vw + 1 || r.left < -1 || selfClip) {
          clipped.push({ el: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''), text: (el.textContent || el.alt || '').trim().slice(0, 40), left: Math.round(r.left), right: Math.round(r.right), vw, selfClip });
        }
      }
      return { hScroll, scrollWidth: document.documentElement.scrollWidth, vw, clipped };
    });
    await page.screenshot({ path: join(out, `${p.name}-${width}.png`), fullPage: !p.dialog });
    report.layout.push({ page: p.name, width, ...layout });
    await context.close();
  }
}

// ---------- Forced colors (Windows High Contrast): key marks must stay visible ----------
for (const width of [375, 1440]) {
  const { context, page } = await open(width, '/', { forcedColors: 'active' });
  const checks = await page.evaluate(() => {
    const rgb = c => c.match(/[\d.]+/g)?.map(Number) ?? [];
    const res = [];
    for (const el of document.querySelectorAll('.stage-title')) {
      const s = getComputedStyle(el);
      res.push({ el: 'stage-title', text: el.textContent, fill: s.webkitTextFillColor, transparent: rgb(s.webkitTextFillColor)[3] === 0 });
    }
    const bar = document.querySelector('.menu-toggle span');
    if (bar && getComputedStyle(document.querySelector('.menu-toggle')).display !== 'none') {
      const s = getComputedStyle(bar);
      const bg = getComputedStyle(document.body).backgroundColor;
      res.push({ el: 'menu-toggle bar', fill: s.backgroundColor, page: bg, invisible: s.backgroundColor === bg || rgb(s.backgroundColor)[3] === 0 });
    }
    return res;
  });
  await page.screenshot({ path: join(out, `forced-colors-${width}.png`) });
  await page.locator('.stage-1 .stage-copy').screenshot({ path: join(out, `forced-colors-stage-${width}.png`) });
  report.forcedColors.push({ width, checks });
  await context.close();
}

// ---------- Focus walk: every Tab stop must be visible and not covered (WCAG 2.4.7, 2.4.11) ----------
for (const width of [375, 1440]) {
  const { context, page } = await open(width, '/');
  const stops = [];
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    await settle(page);
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      // An inline link that wraps is tested on its first line box, not the gap between lines.
      const r = el.getClientRects()[0] ?? el.getBoundingClientRect();
      const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1);
      const cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
      const top = document.elementFromPoint(cx, cy);
      const inView = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
      const covered = !top || !(el === top || el.contains(top));
      // Row links draw their ring on the ::after overlay that covers the row (components.css .row-link).
      const ring = [getComputedStyle(el), getComputedStyle(el, '::after')].find(s => s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2);
      // Walk up for an ancestor faded out (the receding stage).
      let opacity = 1;
      for (let n = el; n; n = n.parentElement) opacity *= Number(getComputedStyle(n).opacity);
      return {
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
        tag: el.tagName.toLowerCase(),
        inView,
        coveredBy: covered && top ? top.tagName.toLowerCase() + '.' + String(top.className).split(' ')[0] : null,
        outline: Boolean(ring),
        opacity: Math.round(opacity * 100) / 100,
      };
    });
    if (!info) break;
    if (stops.length && stops[0].label === info.label && stops[0].tag === info.tag) break;
    stops.push(info);
  }
  // Shift+Tab back through the launch stages, where a pinned stage can sit under the next one.
  const back = [];
  await page.locator('#more').scrollIntoViewIfNeeded();
  await page.locator('.belt-item').first().focus();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Shift+Tab');
    await settle(page);
    back.push(await page.evaluate(() => {
      const el = document.activeElement;
      const r = el.getClientRects()[0] ?? el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      let opacity = 1;
      for (let n = el; n; n = n.parentElement) opacity *= Number(getComputedStyle(n).opacity);
      return { label: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), covered: !top || !(el === top || el.contains(top)), coveredBy: top && !(el === top || el.contains(top)) ? top.closest('article')?.className ?? top.className : null, opacity: Math.round(opacity * 100) / 100 };
    }));
  }
  report.focus.push({ width, forward: stops, backwardThroughStages: back });
  await context.close();
}

await browser.close();
await writeFile(join(out, 'report.json'), JSON.stringify(report, null, 2));

// ---------- Summary ----------
const serious = report.axe.flatMap(a => a.violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => `${a.page}@${a.width} ${v.impact} ${v.id} ${v.nodes.slice(0, 3).join(', ')}`));
const minor = report.axe.flatMap(a => a.violations.filter(v => !['serious', 'critical'].includes(v.impact)).map(v => `${a.page}@${a.width} ${v.impact} ${v.id} ${v.nodes.slice(0, 3).join(', ')}`));
console.log(`axe serious/critical: ${serious.length}`); serious.forEach(s => console.log('  ' + s));
console.log(`axe moderate/minor: ${minor.length}`); minor.forEach(s => console.log('  ' + s));
for (const l of report.layout) {
  if (l.hScroll || l.clipped.length) console.log(`layout ${l.page}@${l.width}: hScroll=${l.hScroll} (${l.scrollWidth}/${l.vw}) clipped=${JSON.stringify(l.clipped.slice(0, 6))}`);
}
console.log('layout: checked', report.layout.length, 'page/width pairs');
for (const f of report.forcedColors) console.log(`forced-colors@${f.width}:`, JSON.stringify(f.checks));
for (const f of report.focus) {
  const bad = f.forward.filter(s => !s.inView || s.coveredBy || !s.outline || s.opacity < 0.9);
  console.log(`focus@${f.width}: ${f.forward.length} stops, ${bad.length} problems`, JSON.stringify(bad));
  const badBack = f.backwardThroughStages.filter(s => s.covered || s.opacity < 0.9);
  console.log(`  shift+tab through stages: ${badBack.length} problems`, JSON.stringify(badBack));
}
