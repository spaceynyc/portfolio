# Portfolio verification

The final production build passed **107 browser checks** with **zero JavaScript errors** and **zero failed requests**. Full results are in `portfolio-report.json`.

The checks run against `http://127.0.0.1:4173`, using the built files rather than Vite's development output.

## Coverage

- The logo matches the supplied file by SHA-256. All seven original thumbnails match the source portfolio by SHA-256.
- The SVG paths for Ideas in Orbit, Featured Work, and What We Do match the original artwork exactly.
- All 11 projects render with revised descriptions, original technology tags, and original destinations. Details open from both the carousel and project directory; Escape closes dialogs and restores focus.
- The carousel supports next/previous controls, dots, Home/End, arrow keys, and native mobile touch swiping. The last project is reachable on desktop and mobile.
- All four Blender icons rotate only on hover and stop on pointer exit. Reduced-motion mode keeps them stationary. Hero cube hover still activates its glow.
- GitHub and X social links use accessible icons. Contact points to the real email address. The ILE mention is absent from portfolio text.
- No horizontal page overflow or overlapping work/services/about sections at 320, 375, 390, 600, 768, 900, 1024, 1280, 1672, and 1920 pixels.
- Original `/hermes-sms`, `/privacy`, and `/terms` URLs resolve to the transferred static pages. Policy wording matches the original pages, allowing display capitalization differences. All three fit the mobile viewport.

## Visual artifacts

- `portfolio-1672.png`: desktop page.
- `portfolio-768.png`: tablet page.
- `portfolio-390.png`: mobile page.
- `portfolio-carousel.png`: carousel controls and initial projects.
- `portfolio-project-detail.png`: project details with the original screenshot.
- `portfolio-directory.png`: all-project directory.
- `portfolio-policy-mobile.png`: mobile policy page.

## Repeat

```sh
npm run build
npm run preview -- --port 4173
```

In another terminal:

```sh
python -X utf8 scripts/portfolio_qa.py
```

The tests require Python Playwright and installed Chrome. `policy-source.json` records the original policy text for comparison. The screenshot files show the completed production layout; older `interaction-report.json`, Part 1 screenshots, and scripts describe the original studio mockup. Pre-migration source files and their original QA notes are retained in `part1-source/`.

## Production-specific fixes

Vite's multi-page build initially reordered the shared base stylesheet after the portfolio overrides. Importing the base CSS inside each page stylesheet preserves the intended cascade in both development and production. Extensionless policy URLs receive redirects in the Vite servers, and `vercel.json` sets trailing-slash behavior for a future deployment.
