// NVDA screen reader pass (Windows only). Starts NVDA with speech logging, drives a visible Chromium window
// through the changed components, then pairs each step with what NVDA actually said.
// Needs NVDA installed in C:\Program Files\NVDA and the built site on :4173.
// Usage: node qa/a11y/nvda.mjs [baseUrl] [outDir]
import { chromium } from 'playwright';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:4173';
const out = resolve(process.argv[3] ?? 'qa/a11y/out');
await mkdir(out, { recursive: true });
const nvda = 'C:\\Program Files\\NVDA\\nvda.exe';
const logFile = join(out, 'nvda.log');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ps = script => spawnSync('powershell', ['-NoProfile', '-Command', script], { encoding: 'utf8' });

// Bring the Chromium window to the front: NVDA only follows the foreground window.
const foreground = () => ps(`
Add-Type @"
using System; using System.Runtime.InteropServices;
public class W {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern void keybd_event(byte k, byte s, uint f, UIntPtr e);
}
"@
$p = Get-Process | Where-Object { $_.MainWindowTitle -like '*Spaceynyc*' } | Select-Object -First 1
[W]::keybd_event(0x87, 0, 0, [UIntPtr]::Zero); [W]::keybd_event(0x87, 0, 2, [UIntPtr]::Zero)
[W]::ShowWindow($p.MainWindowHandle, 9) | Out-Null
[W]::SetForegroundWindow($p.MainWindowHandle)`).stdout.trim();
// OS-level keys, so NVDA's own browse-mode commands (arrow keys) see them.
const osKey = keys => ps(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${keys}')`);

// ---------- Start NVDA with speech (IO level) logging ----------
spawnSync('powershell', ['-NoProfile', '-Command', `Start-Process -FilePath '${nvda}' -ArgumentList '-q'`]);
await sleep(2000);
execFileSync('powershell', ['-NoProfile', '-Command', `Start-Process -FilePath '${nvda}' -ArgumentList '-m','--disable-addons','-f','"${logFile}"','-l','12'`]);
await sleep(8000);

const browser = await chromium.launch({ headless: false, args: ['--force-renderer-accessibility', '--window-position=0,0'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 860 } });
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
const page = await context.newPage();
const steps = [];
async function step(name, expect, action, wait = 1800) {
  const start = Date.now();
  await action();
  await sleep(wait);
  steps.push({ name, expect, start, end: Date.now() });
}
const press = key => () => page.keyboard.press(key);
const focus = selector => () => page.locator(selector).first().focus();

// ---------- Desktop ----------
await page.goto(base + '/', { waitUntil: 'networkidle' });
console.log('foreground:', foreground());
await sleep(4000);
await step('Focus "See the work"', 'link', focus('.hero-cta'));
await step('Tab into stage 1', 'article / Socionics Galaxy context, then link (opens in a new tab)', press('Tab'));
await step('Focus last stage link, then Tab into the rail', 'Featured projects navigation, link', async () => { await page.locator('.stage-3 .pill').focus(); await sleep(1200); await page.keyboard.press('Tab'); });
await step('Tab along the rail to the current stage', 'Zipchair AI Assistant link, current location', async () => { await page.keyboard.press('Tab'); await sleep(900); await page.keyboard.press('Tab'); });
await step('Tab to the first belt row', 'list, heading level 4, Zipchair Intel link (short name)', press('Tab'));
await step('Browse mode: Down arrow to the summary', 'A competitive-intelligence dashboard…', () => osKey('{DOWN}'));
await step('Browse mode: Down arrow to the metadata line', 'Market-intelligence dashboard, Pitch for Zipchair, Live demo (no run-together words)', () => osKey('{DOWN}'));
await step('Refocus row link, Enter opens the project dialog', 'Zipchair Intel dialog, heading level 2', async () => { await page.locator('.belt-name a, a.belt-item').first().focus(); await sleep(1200); await page.keyboard.press('Enter'); }, 2500);
await step('Tab to the primary action', 'Open the demo (opens in a new tab) link', press('Tab'));
await step('Tab to the screenshot link', 'Full size (opens in a new tab) link', press('Tab'));
await step('Tab wraps to Close', 'Close button', press('Tab'));
await step('Escape closes the dialog', 'focus back on Zipchair Intel link', press('Escape'), 2500);
await step('Shift+Tab back into the stages (x4)', 'rail links, then stage 3 links; nothing announced from a hidden stage', async () => { for (let i = 0; i < 4; i++) { await page.keyboard.press('Shift+Tab'); await sleep(900); } }, 1500);
await step('Focus Copy address', 'Copy address button', focus('.copy-email'));
await step('Enter on Copy address', 'Copied (live region)', press('Enter'));

// ---------- Phone ----------
await page.setViewportSize({ width: 375, height: 760 });
await page.goto(base + '/', { waitUntil: 'networkidle' });
foreground();
await sleep(4000);
await step('Focus the logo, Tab to the menu button', 'Menu button collapsed', async () => { await page.locator('.brand').focus(); await sleep(1200); await page.keyboard.press('Tab'); });
await step('Enter opens the menu', 'expanded', press('Enter'));
await step('Tab into the menu', 'list with 3 items, Work link', press('Tab'));
await step('Escape closes the menu', 'Menu button collapsed', press('Escape'));
await step('Tab past the menu', "Let's talk link", press('Tab'));

await browser.close();
spawnSync('powershell', ['-NoProfile', '-Command', `Start-Process -FilePath '${nvda}' -ArgumentList '-q'`]);
await sleep(3000);

// ---------- Pair each step with NVDA's speech ----------
const log = await readFile(logFile, 'utf8');
const day = new Date(steps[0].start);
const speech = [...log.matchAll(/^IO - speech\.speech\.speak \((\d\d):(\d\d):(\d\d)\.(\d+)\)[^\n]*\r?\n(Speaking .*)$/gm)].map(m => {
  const t = new Date(day);
  t.setHours(+m[1], +m[2], +m[3], +m[4].slice(0, 3).padEnd(3, '0'));
  return { t: t.getTime(), text: m[5].replace(/^Speaking /, '') };
});
const report = steps.map(s => ({ ...s, said: speech.filter(x => x.t >= s.start - 50 && x.t < s.end).map(x => x.text) }));
await writeFile(join(out, 'nvda.json'), JSON.stringify(report, null, 2));
console.log(`speech lines logged: ${speech.length}`);
for (const r of report) console.log(`\n## ${r.name}\n   expect: ${r.expect}\n   NVDA:   ${r.said.join('\n           ') || '(nothing)'}`);
