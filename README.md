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

- The supplied logo and original SVG lettering for **Ideas in Orbit**, **Featured Work**, and **What We Do** are preserved. **A Brighter Tomorrow. Together.** remains in the hero and footer.
- All 11 original projects appear in a carousel: three cards on desktop, two on tablet, and one on mobile. Arrows, pagination, keyboard navigation, and native touch swiping are supported. The carousel does not autoplay.
- The seven original project thumbnails are copied byte-for-byte. Four projects without screenshots use graphic covers. Project dialogs include the revised descriptions, technology tags, original live/source links, and full-size screenshots. Projects without public destinations link to an email inquiry.
- Hero cubes lift and glow on hover, with a soft blue halo around the ring. Four custom Blender service models rotate only while hovered, at approximately one turn every 17.5 seconds. Reduced-motion preferences disable rotation.
- Biography, philosophy, project descriptions, and capability copy have been rewritten for the new visual identity. The ILE mention is removed.
- Contact uses `mailto:srich7x@gmail.com`. GitHub and X links use icons with accessible labels. There is no contact form or simulated submission.
- `/hermes-sms/`, `/privacy/`, and `/terms/` preserve the original policy copy. Their extensionless URLs redirect to the corresponding pages in development and preview. `vercel.json` enables trailing-slash routes for a future Vercel deployment.

## Editing

- `index.html`: page structure, hero, biography, philosophy, capabilities, and contact.
- `src/portfolio-data.js`: project content and links, plus the technology list.
- `src/main.js`: project/service dialogs, social source links, and mobile navigation.
- `src/carousel.js`: carousel navigation and responsive pagination.
- `src/portfolio.css`: portfolio layout, importing the original `src/style.css` first to preserve cascade order in production.
- `src/lettering.js` and `src/assets/*.svg`: the original display artwork.
- `public/screenshots/`: original project thumbnails.
- `hermes-sms/`, `privacy/`, `terms/`: static policy pages; `src/policies.css` supplies their presentation.

The source content came from `spaceynyc/portfolio`, commit `261f0cb83ce3d80083436d30afbca40664836d31`. The import scripts in `scripts/` are one-time migration utilities: rerunning the project importer replaces edited descriptions with the original copy. The pre-migration layout files are retained in `qa/part1-source/`.

## Blender sources

| File | Contents |
| --- | --- |
| `blender/spaceynyc-sculptures.blend` | Chrome cubes, orbital rings, star, and flowing filaments |
| `blender/spaceynyc-service-icons.blend` | Four service models used in the portfolio |

Models have `.glb` exports and transparent `.png` renders in `public/assets`. They were created with the installed [Blender MCP server](https://github.com/ahujasid/blender-mcp) and Blender 4.5 add-on. `scripts/mcp_client.py` provides the MCP Python client; asset construction scripts are retained alongside it. Older sculpture models remain available as source assets.

## Verification

After building and starting the production preview:

```sh
python -X utf8 scripts/portfolio_qa.py
```

This uses Python Playwright with the installed Chrome browser. Results and screenshots are written to `qa/`; see `qa/README.md`. The site itself requires only Node and npm. Earlier Part 1 test scripts and results are historical and describe the original studio mockup.

## Fonts and source material

- The user supplied the logo and mockup.
- Neuropol is distributed under CC0 by [Typodermic Fonts](https://typodermicfonts.com/public-domain/); the license note is in `public/assets/FONT-LICENSE.txt`.
- Inter is self-hosted as WOFF2 under the SIL Open Font License from the [Inter project](https://github.com/rsms/inter).
- No analytics, external font requests, or paid-provider dependencies are used.
