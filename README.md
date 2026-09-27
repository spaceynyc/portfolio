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

- The hero pairs the chrome **Ideas in Orbit** lettering (live SVG text in Neuropol) with a real project: the Socionics Galaxy screenshot melts into the page, and a chrome orbit ring with three project-colored bodies passes around it. The intro names Steven and the two kinds of work he builds, and says he is open to freelance projects and full-time roles.
- **Launch sequence:** Socionics Galaxy, Socionics Research Lab, and Zipchair AI Assistant each get a full screen. The screen shows a large screenshot, what the project is, its honest status (live, code on GitHub, pitch for Zipchair), a plain-language story, and links. On large screens the stages pin, and each new one rises over the last like a planet's limb while the previous one recedes (CSS scroll-driven animation). An orbit rail marks the current stage. On phones, short windows, and reduced motion, the stages stack normally.
- **The belt:** the other eight projects are listed in two groups, "Agents that see and act" and "Worlds and tools". Each has a thumbnail or drawn cover, a one-line summary, and a status. They are plain `#hash` links that open a project dialog. Opening one adds a history entry, so the browser's Back button closes the dialog. Old share links (`#projects`, `#agents`, …) scroll to the matching section.
- The stages, the rail, and the belt are rendered into `index.html` at build time from `src/portfolio-data.js` (the `render-work` plugin in `vite.config.js`), so the work reads without JavaScript. The about section's project counts come from the same data.
- Contact uses `mailto:srich7x@gmail.com`, with a copy-address button for visitors without a mail app. GitHub and X links carry visible labels in the contact section.
- `/hermes-sms/`, `/privacy/`, and `/terms/` preserve the original policy copy. Their extensionless URLs redirect to the corresponding pages in development and preview. `vercel.json` enables trailing-slash routes on Vercel.

## Editing

- `index.html`: hero, section shells, about, contact, footer, and the shared SVG icon sprite.
- `src/portfolio-data.js`: project content, including `kind`, `status`, `featured`, `group`, and the featured `story` and `alt` text.
- `src/render-work.js`: markup for the launch stages, rail, and belt, shared by the build plugin and the dialog script.
- `src/main.js`: project dialogs and history, the launch rail, copy-email, and mobile navigation.
- `src/covers.js`: drawn covers for projects without screenshots.
- `src/base.css`: design tokens (color, type scale, spacing), fonts, reset, and shared controls; imported by `src/site.css` (portfolio) and `src/policies.css` (policy pages).
- `hermes-sms/`, `privacy/`, `terms/`: static policy pages.

Type uses a fixed 16px root with fluid `clamp()` sizes for display text; nothing on the page renders below 12px. Colors come from the tokens in `src/base.css`.

The source content came from `spaceynyc/portfolio`, commit `261f0cb83ce3d80083436d30afbca40664836d31`. The import scripts in `scripts/` are one-time migration utilities: rerunning the project importer replaces edited descriptions with the original copy. The pre-migration layout files are retained in `qa/part1-source/`.

## Blender sources

| File | Contents |
| --- | --- |
| `blender/spaceynyc-sculptures.blend` | Chrome cubes, orbital rings, star, and flowing filaments |
| `blender/spaceynyc-service-icons.blend` | Four service models (no longer on the page) |

The chrome-cube hero and the four 3D service icons were retired in the launch-sequence redesign; their exported files remain in git history. The models were created with the installed [Blender MCP server](https://github.com/ahujasid/blender-mcp) and Blender 4.5 add-on. `scripts/mcp_client.py` provides the MCP Python client; asset construction scripts are retained alongside it. The sculpture models live only in the `.blend` source.

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
