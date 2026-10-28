// WCAG contrast for every text and control-boundary color pair the site uses. Token values are read from
// src/base.css, so a token change is re-checked automatically. Usage: node qa/a11y/contrast.mjs
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../../src/base.css', import.meta.url), 'utf8');
const token = name => {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1].trim();
};
const parse = value => {
  if (value.startsWith('#')) {
    const h = value.slice(1);
    return { rgb: [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)), a: 1 };
  }
  const [r, g, b, a = 1] = value.match(/[\d.]+/g).map(Number);
  return { rgb: [r, g, b], a };
};
const over = (top, bottom) => ({ rgb: top.rgb.map((c, i) => c * top.a + bottom.rgb[i] * (1 - top.a)), a: 1 });
const lum = ({ rgb }) => {
  const [r, g, b] = rgb.map(c => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (fg, bg) => {
  const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const T = name => parse(token(name));
const bg = T('bg');
const surfaces = {
  'bg': bg,
  'bg-raised': T('bg-raised'),
  'surface': T('surface'),
  'hero lift #0c0e10': parse('#0c0e10'),
  'accent-soft over bg (capsule/round hover)': over(T('accent-soft'), bg),
  'pill hover #171529': parse('#171529'),
};
const rows = [];
const add = (fg, fgName, bgc, bgName, use, min = 4.5) => rows.push({ pair: `${fgName} on ${bgName}`, use, ratio: ratio(fg, bgc), min });

// Text: the ink ramp and the accent on every surface they appear on.
for (const [s, sc] of Object.entries(surfaces)) {
  for (const t of ['ink', 'ink-2', 'ink-3', 'accent']) add(T(t), t, sc, s, 'text');
}
add(bg, 'bg', T('ink'), 'ink', 'skip link');
add(parse('#ffffff'), '#fff', T('accent-deep'), 'accent-deep', 'text selection');
add(T('ink'), 'ink', over(parse('rgb(8 9 16 / 0.85)'), parse('#ffffff')), 'media badge over a white screenshot', 'dialog "Full size" badge');
// Policy pages: Hermes SMS opt-in callout on its 6% mint wash.
const mintWash = over(parse('rgb(114 247 184 / 0.06)'), bg);
add(parse('#72f7b8'), '#72f7b8', mintWash, 'opt-in wash', 'opt-in label');
add(parse('#d7e9f8'), '#d7e9f8', mintWash, 'opt-in wash', 'opt-in lead');
add(T('ink-2'), 'ink-2', mintWash, 'opt-in wash', 'opt-in body');
// Non-text (WCAG 1.4.11, 3:1): control boundaries and the focus ring.
for (const s of ['bg', 'bg-raised']) {
  add(T('control'), 'control', surfaces[s], s, 'capsule / round-button rim', 3);
  add(T('accent'), 'accent', surfaces[s], s, 'focus ring', 3);
  add(parse('#d9d8ea'), 'pill rim #d9d8ea', surfaces[s], s, 'pill rim', 3);
}

let fails = 0;
for (const r of rows) {
  const pass = r.ratio >= r.min;
  if (!pass) fails++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${r.ratio.toFixed(2).padStart(5)}:1 (min ${r.min})  ${r.pair}  [${r.use}]`);
}
console.log(`${rows.length - fails}/${rows.length} pairs pass`);
process.exitCode = fails ? 1 : 0;
