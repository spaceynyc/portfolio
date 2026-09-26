# Spaceynyc — Ideas in Orbit

Steven Richardson’s personal portfolio, bringing the projects from [spaceynyc.dev](https://spaceynyc.dev) into the supplied chrome-and-orbit design.

## Run

```sh
npm install
npm run dev
```

Development: `http://127.0.0.1:5173`.

```sh
npm run build
npm run preview -- --port 4173
```

Production preview: `http://127.0.0.1:4173`. The static output is in `dist/`. The production domain is [spaceynyc.dev](https://spaceynyc.dev), connected to the `spaceynyc/portfolio` GitHub repository through Vercel.

## Content and interactions

- The logo and the chrome **Ideas in Orbit** hero lettering (live SVG text in Neuropol) lead the page. Section headings are live text set in Neuropol with the same chrome gradient. The copy is written in Steven's own voice.
- All 11 projects appear in a carousel: three cards on desktop, two on tablet, one on phones. The cards form a single Tab stop; arrow keys, Home and End move between them. Arrows, page dots (desktop), a live counter, and native touch swiping are supported. There is no autoplay.
- Project screenshots are served as art-directed 16:9 crops (`public/thumbs/*.webp`) on cards and 16:10 images in dialogs, linking to the original full-resolution captures in `public/screenshots/`. The four projects without screenshots get drawn covers (`src/covers.js`).
- Dialogs open for a project, the full project list, or a service. Each has a shareable URL hash (`#drift`, `#projects`, `#agents`), puts the live/source links under the title, and offers **All projects** to step back to the list it came from.
- Hovering a hero cube lifts the sculpture and lights it; the four Blender service models rotate while hovered. three.js loads only when the services section approaches the viewport. Reduced-motion preferences keep the glow but drop the lift, sway, rotation, and smooth scrolling.
- Contact uses `mailto:srich7x@gmail.com`, with a copy-address button for visitors without a mail app. GitHub and X links carry visible labels in the contact section.
- `/hermes-sms/`, `/privacy/`, and `/terms/` preserve the original policy copy. Their extensionless URLs redirect to the corresponding pages in development and preview. `vercel.json` enables trailing-slash routes on Vercel.

## Editing

- `index.html`: page structure, hero, services, about, contact, footer, and the shared SVG icon sprite.
- `src/portfolio-data.js`: project content, one-line summaries, links, images, and the technology list.
- `src/main.js`: project/service dialogs, deep links, copy-email, and mobile navigation.
- `src/carousel.js`: carousel navigation, roving focus, and responsive pagination.
- `src/hero-motion.js`: cube hover hit-testing and lift.
- `src/covers.js`: drawn covers for projects without screenshots.
- `src/base.css`: design tokens (color, type scale, spacing), fonts, reset, and shared controls; imported by `src/site.css` (portfolio) and `src/policies.css` (policy pages).
- `hermes-sms/`, `privacy/`, `terms/`: static policy pages.

Type uses a fixed 16px root with fluid `clamp()` sizes for display text; nothing on the page renders below 12px. Colors come from the tokens in `src/base.css`.

The source content came from `spaceynyc/portfolio`, commit `261f0cb83ce3d80083436d30afbca40664836d31`. The import scripts in `scripts/` are one-time migration utilities: rerunning the project importer replaces edited descriptions with the original copy. The pre-migration layout files are retained in `qa/part1-source/`.

## Blender sources

| File | Contents |
| --- | --- |
| `blender/spaceynyc-sculptures.blend` | Chrome cubes, orbital rings, star, and flowing filaments |
| `blender/spaceynyc-service-icons.blend` | Four service models used in the portfolio |

The four service models ship as `public/assets/*-icon.glb` with `.webp` posters. The hero image (`public/assets/hero-cubes.webp`) is the chrome-cube artwork from the original mockup, cut out with its header band masked away. They were created with the installed [Blender MCP server](https://github.com/ahujasid/blender-mcp) and Blender 4.5 add-on. `scripts/mcp_client.py` provides the MCP Python client; asset construction scripts are retained alongside it. The sculpture models live only in the `.blend` source.

## Verification

After building and starting the production preview:

```sh
python -X utf8 scripts/portfolio_qa.py
```

This uses Python Playwright with the installed Chrome browser. Results and screenshots are written to `qa/`; see `qa/README.md`. The site itself requires only Node and npm. Earlier Part 1 test scripts and results are historical and describe the original studio mockup.

## Fonts and source material

- The user supplied the logo and mockup.
- Neuropol is distributed under CC0 by [Typodermic Fonts](https://typodermicfonts.com/public-domain/); the license note is in `public/assets/FONT-LICENSE.txt`.
- Sora (body text) is self-hosted as a Latin variable WOFF2 (weights 100–800) under the SIL Open Font License from the [Sora project](https://github.com/sora-xor/sora-font); the license is in `public/assets/SORA-LICENSE.txt`. Neuropol is served as WOFF2.
- No analytics, external font requests, or paid-provider dependencies are used.
