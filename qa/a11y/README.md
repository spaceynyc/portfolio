# Accessibility checks

Three scripts check the built site. Build and serve it first:

```sh
npm run build
npm run preview -- --port 4173
```

Then, in another terminal:

```sh
npm run qa:a11y
```

That runs, in order:

- `contrast.mjs`: WCAG contrast for every text and control-rim color pair, read from the tokens in `src/base.css`.
- `audit.mjs`: four checks, with screenshots and `report.json` written to `qa/a11y/out/`.
  - axe-core (WCAG 2.0 through 2.2 A/AA plus best practices) on the home page, an open project dialog, and the three policy pages, at 375 and 1440px.
  - Horizontal scroll and clipped content at 320, 375, 768 and 1440px.
  - Forced-colors (high contrast) rendering.
  - A Tab walk that flags any focus stop that is hidden, faded, or covered (WCAG 2.4.7 and 2.4.11).
- `keyboard.mjs`: a keyboard-only walkthrough of the changed components against their APG checklists (disclosure menu, block-link rows, modal dialog, launch stages), saved to `out/keyboard.json`.

`nvda.mjs` is a separate, Windows-only screen reader pass. It needs NVDA installed in `C:\Program Files\NVDA`. It starts NVDA with speech logging and drives a visible Chromium window through the same components. It then writes `out/nvda.json`, which pairs each step with what NVDA actually said. Keep the mouse and keyboard still while it runs: NVDA only follows the window in front.

```sh
node qa/a11y/nvda.mjs
```

The tests need Playwright's Chromium (`npx playwright install chromium`). Lighthouse is not a project dependency; to compare against `main`, run `npx lighthouse@12` on both builds with `CHROME_PATH` pointed at that Chromium.

## License ledger

The site ships no third-party code from this work. Ideas and layouts were borrowed; code and assets were not.

| Asset | Original source | SPDX | OK for a commercial portfolio |
|---|---|---|---|
| Neuropol.woff2 (display font) | https://typodermicfonts.com/public-domain/ (Ray Larabie). The font's own name table reads "Neuropol-Regular, Version 3.100, Released in 2024 under CC0", with embedding unrestricted (fsType 0). It is not the commercial Neuropol X or Nova. | CC0-1.0 | Yes |
| Sora-latin.woff2 (body font) | https://github.com/sora-xor/sora-font (OFL.txt in the repo; the license ships as `public/assets/SORA-LICENSE.txt`) | OFL-1.1 | Yes |
| "Cards" block-link pattern (idea only) | https://inclusive-components.design/cards/ (Heydon Pickering) | None stated (article) | Yes, as an idea; no code copied |
| "Menus & Menu Buttons" disclosure nav (idea only) | https://inclusive-components.design/menus-menu-buttons/ (Heydon Pickering) | None stated (article) | Yes, as an idea; no code copied |
| Web Interface Guidelines (idea only: never let sticky layers cover focus) | https://vercel.com/design/guidelines, repo https://github.com/vercel-labs/web-interface-guidelines | MIT | Yes |
| WAI-ARIA APG patterns (Disclosure, Dialog Modal) | https://www.w3.org/WAI/ARIA/apg/ | W3C-20150513 | Yes; patterns followed, no code copied |
| playwright 1.56.1 (dev only, not shipped) | https://github.com/microsoft/playwright | Apache-2.0 | Yes |
| @axe-core/playwright 4.11.0, axe-core 4.11.4 (dev only, unmodified) | https://github.com/dequelabs/axe-core-npm | MPL-2.0 | Yes |
| lighthouse 12.8.2 (run ad hoc, not a dependency) | https://github.com/GoogleChrome/lighthouse | Apache-2.0 | Yes |

The inline SVG icons in `index.html` predate this work. Their origin isn't recorded in the repo; the GitHub mark resembles Feather Icons (MIT), but that is unconfirmed.
