# Spaceynyc — Ideas in Orbit

Portfolio of Steven Richardson (Space), live at [spaceynyc.dev](https://spaceynyc.dev).

Built with [Astro](https://astro.build) and React islands. Static output, deployed on Vercel.

## Run

```sh
npm install
npm run dev       # http://127.0.0.1:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
```

## Structure

- `src/pages/index.astro` — the home page: hero, work index, lab, services, about, contact.
- `src/pages/work/[slug].astro` — one page per project, generated from the `work` content collection.
- `src/content/work/*.md` — project content. Frontmatter holds title, number, year, kind, tech, colour, links and screenshot; the body is the story.
- `src/pages/hermes-sms/`, `privacy/`, `terms/` — SMS-compliance pages. Their copy backs a carrier-registered program; edit with care and keep the wording intact.
- `src/components/` — Astro components for each section plus header, footer, icons and lettering.
- `src/islands/` — the only client-side JavaScript:
  - `HeroSculpture.tsx` — the chrome cube sculpture, orbit ring and sparkles, rendered live with React Three Fiber. Falls back to a poster without WebGL and freezes under reduced motion.
  - `ServiceIcons.tsx` — the four Blender service sculptures in one shared canvas; they rotate while hovered.
  - `LabShader.tsx` — the fragment shader behind the Lab section. Pauses off-screen.
- `src/lettering/` — the original traced "Ideas in Orbit", "Featured Work" and "What We Do" lettering, refilled with a shared chrome gradient.
- `src/styles/tokens.css` — colours, type scale, spacing and fonts. `global.css` holds base styles, buttons and the scroll-driven reveal animation.
- `public/assets/` — self-hosted fonts (Neuropol, CC0; Inter, OFL), logo, sculpture models and posters. `public/screenshots/` — project thumbnails.
- `blender/` — source files for the sculptures. Not deployed.

## Notes

- Routes use trailing slashes (`trailingSlash: 'always'` in `astro.config.mjs`, mirrored by `vercel.json`).
- Motion respects `prefers-reduced-motion`: the sculpture holds still, the shader renders once, the marquee stops.
- No analytics, no external font or script requests.
