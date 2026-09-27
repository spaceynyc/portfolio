---
name: spaceynyc.dev
description: Ideas in Orbit. Steven Richardson's work as planets, the page as their orbit.
colors:
  void: "#050607"
  void-raised: "#090a0f"
  panel: "#0c0d14"
  hairline: "#25252f"
  hairline-strong: "#3d3c4a"
  control-rim: "#8d8b9e"
  ink: "#ecebf5"
  ink-2: "#c4c3d1"
  ink-3: "#9e9cb0"
  orbit-lavender: "#b3adff"
  orbit-glow: "#8b84ff"
  orbit-deep: "#5c50b3"
  orbit-haze: "rgb(139 132 255 / 0.14)"
  pill-rim: "#d9d8ea"
  pill-hover-fill: "#171529"
typography:
  display:
    fontFamily: "Neuropol, Arial Narrow, sans-serif"
    fontSize: "3.6rem"
    fontWeight: 400
    lineHeight: 1
  headline-chrome:
    fontFamily: "Neuropol, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 2vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Neuropol, Arial Narrow, sans-serif"
    fontSize: "clamp(1.5rem, 1.05rem + 1.6vw, 2.35rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.01em"
  title-dialog:
    fontFamily: "Neuropol, Arial Narrow, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "Sora, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.6
  lede:
    fontFamily: "Sora, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Sora, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Sora, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label-control:
    fontFamily: "Sora, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.03em"
  caption:
    fontFamily: "Sora, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  capsule: "999px"
  dialog: "18px"
  window: "14px"
  frame: "10px"
  thumb: "8px"
  inset: "6px"
spacing:
  gutter: "clamp(1.25rem, 5vw, 5.5rem)"
  section-y: "clamp(3rem, 5.5vw, 5rem)"
  header-h: "5.25rem"
  header-h-phone: "4.5rem"
  target: "2.75rem"
components:
  pill:
    textColor: "{colors.ink}"
    typography: "{typography.label-control}"
    rounded: "{rounded.capsule}"
    padding: "0 1.25rem 0 1.4rem"
    height: "2.75rem"
  pill-hover:
    backgroundColor: "{colors.pill-hover-fill}"
    textColor: "{colors.ink}"
  pill-large:
    typography: "{typography.body}"
    rounded: "{rounded.capsule}"
    padding: "0 1.5rem 0 1.9rem"
    height: "3.5rem"
  capsule-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "0 1rem"
    height: "2.75rem"
  capsule-ghost-hover:
    backgroundColor: "{colors.orbit-haze}"
    textColor: "{colors.ink}"
  round-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "50%"
    size: "2.75rem"
  round-button-hover:
    backgroundColor: "{colors.orbit-haze}"
  text-link:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    height: "2.75rem"
  text-link-hover:
    textColor: "{colors.ink}"
  stage-window:
    backgroundColor: "{colors.void-raised}"
    rounded: "{rounded.window}"
  belt-thumb:
    backgroundColor: "{colors.void-raised}"
    rounded: "{rounded.thumb}"
    width: "7.5rem"
  dialog:
    backgroundColor: "{colors.void-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
    width: "min(56rem, calc(100vw - 2rem))"
---

# Design System: spaceynyc.dev

## Overview

**Creative North Star: "Ideas in Orbit"**

The work is the planet and the page is its orbit. Everything sits on near-black space, and the brightest things on screen are the projects themselves: real screenshots used as windows onto each world, bleeding off the right edge, with the page's own chrome kept thin around them. A single lavender orbit ring is the house color. Each project brings its own color as a small lit body, a sphere with a white highlight, that marks it wherever it appears: on the hero ring, beside its metadata, on the sticky rail, in the belt, and on the lit rim of its stage.

The system is dark, quiet, and specific. Chrome lettering in Neuropol is reserved for a few ceremonial moments (the hero line and the three featured stage titles). Everything else is Sora in a three-step ink ramp on the void. Controls are chrome-rimmed capsules. Depth comes from overlap and darkness rather than floating cards: stages slide over one another and recede, windows cast a short, heavy shadow, and sections are separated by hairlines rather than boxes.

Density is generous for the featured three (one full viewport each on desktop) and compact for the rest: the remaining eight sit in a two-column list with small thumbnails, grouped into agents and worlds.

**Key Characteristics:**
- Near-black void (#050607) with slightly lifted panels, no gradients behind content.
- One accent, the orbit lavender; project colors appear only as small lit bodies and rim light.
- Neuropol for display and headings, chrome only on the hero line and stage titles; Sora for everything else.
- Chrome-rimmed capsule controls with an inset highlight, never a glow halo.
- Real screenshots as windows, bleeding off the right edge on wide screens.
- Hairline-divided sections; lists instead of card grids.

## Colors

A void-and-ink palette with one lavender accent, plus per-project colors that are data, not palette.

### Primary
- **Orbit Lavender** (orbit-lavender): the accent. Focus rings (2px outline, 3px offset), the availability dot, the hover color of a belt project name, the copy-confirmation text, link underline on hover, and the bright stops of the orbit ring.
- **Orbit Glow** (orbit-glow): the faded ends of the orbit ring gradient and the base of the lavender haze.
- **Orbit Deep** (orbit-deep): text selection background, with white text.
- **Orbit Haze** (orbit-haze): the hover fill of ghost capsules and round buttons, and the 3px ring around the availability dot.

### Neutral
- **Void** (void): page background and the stage background. Also the `theme-color`.
- **Raised Void** (void-raised): dialog surface, image wells behind screenshots and thumbnails, the mobile menu sheet, cover backgrounds.
- **Panel** (panel): the one step up from raised, used for the dialog's media frame and policy blockquotes.
- **Hairline** (hairline): section dividers, list row rules, thumbnail borders.
- **Strong Hairline** (hairline-strong): window borders (stages, dialog, dialog media), the rail's orbit line, resting link underlines.
- **Control Rim** (control-rim): the 1px border of secondary capsules and round buttons.
- **Ink** (ink), **Ink 2** (ink-2), **Ink 3** (ink-3): the text ramp, all at least 7:1 on the void. Ink for headings, titles, and ledes; Ink 2 for reading copy and navigation at rest; Ink 3 for metadata, stack lines, and captions.
- **Pill Rim** (pill-rim) and **Pill Hover Fill** (pill-hover-fill): the primary capsule's chrome rim and its hover fill. They are literal values in the pill rule, not custom properties.

### Project colors
Each project carries its own color in the data (`--project-color`, set inline): galaxy pink #ff6b9d, lab orange #ffa64d, Zipchair blue #3b82f6, and others. They are rendered only as small radial-gradient bodies (white highlight at 35% 30%, the color at 45%, the color mixed 35% with black at the edge), as the 55% rim line and 45% rim glow on a stage's top edge, and as the stroke and a 16% radial wash in drawn covers.

### Named Rules
**The One Accent Rule.** Lavender is the only interface accent. Project colors never color text, buttons, or backgrounds; they live in bodies, rims, and covers.

**The Ink Ramp Rule.** Text uses Ink, Ink 2, or Ink 3 on the void and nothing dimmer. Hierarchy is carried by step, not by opacity.

## Typography

**Display Font:** Neuropol (with Arial Narrow, sans-serif)
**Body Font:** Sora, variable 100 to 800 (with system-ui, -apple-system, Segoe UI, sans-serif)

**Character:** Neuropol is the brand's wide, geometric sci-fi face, bound to the chrome wordmark; Sora is a round, even humanist grotesk that keeps long plain-spoken copy calm. The pairing is ceremony above, conversation below.

### Hierarchy
- **Display** (Neuropol 400, an SVG line sized to min(100%, 36rem) wide, so glyphs top out near 3.6rem; each word fitted to width with textLength, uppercase): the IDEAS IN ORBIT hero line only, filled with the chrome gradient and a 0.6 light stroke.
- **Headline, chrome** (Neuropol 400, clamp(2rem, 1.25rem + 2vw, 3rem), 1.04, 0.01em, uppercase): the three featured stage titles, with the chrome gradient clipped to text.
- **Headline** (Neuropol 400, clamp(1.5rem, 1.05rem + 1.6vw, 2.35rem), 1.1, 0.01em, uppercase, solid Ink, balanced): section headings in main.
- **Dialog title** (Neuropol 400, clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem), 1.2, solid Ink, set in the project's own casing): project titles in the detail dialog; the policy page h1 uses the same treatment at clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem).
- **Title** (Sora 500, 1.125rem): belt group headings and the about side heading. Belt project names use Sora 500 at 1.0625rem.
- **Lede** (Sora 400, clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem), 1.5 to 1.65): hero intro, stage summaries, dialog summaries, contact copy. Max 32 to 34rem.
- **Body** (Sora 400, 1rem, 1.6 base, 1.7 to 1.75 for long reading): about copy (1.0625rem), stage story (0.9375rem, 1.7), dialog text. Max 34 to 44rem.
- **Label** (Sora 400, 0.875rem): navigation, metadata, text links, stack lines. **Control label** (Sora 500, 0.875rem, 0.03em) inside capsules.
- **Caption** (Sora 400, 0.75rem): belt metadata, legal line, the dialog's media badge.

### Named Rules
**The Chrome Ceremony Rule.** Chrome-filled Neuropol appears only on the hero line and the three featured stage titles. Every other Neuropol heading is solid Ink.

**The Step-Below Rule.** Section headings and dialog titles sit one size step below the chrome stage titles (2.35rem and 2.25rem maximum against 3rem).

**The Sora Everywhere Else Rule.** All body, interface, metadata, and control text is Sora. Neuropol never sets a sentence.

## Layout

A full-bleed single column with a fluid side gutter (gutter token) and fluid section padding (section-y token). Content does not sit in a centered max-width container; it runs from the left gutter, with prose measures capped per element (33 to 44rem) and media allowed to run off the right edge.

- **Header:** 5.25rem tall (4.5rem on phones), logo left, three text links offset from it, the primary capsule pushed right. Below 720px the links collapse into a raised sheet under the header with 3.25rem rows.
- **Hero:** copy at left (max 35rem); the galaxy screenshot sits absolutely at right, min(64vw, 70rem) wide at 16:10, bleeding 3vw off the edge, blended with `lighten` and a radial mask so its black melts into the void. Below 1100px it stacks under the copy.
- **Launch sequence:** one stage per featured project. From 900px the stage is a two-column grid (minmax(20rem, 0.8fr) copy, 1.5fr media, media second). From 1024px wide and 700px tall with motion allowed, each stage is sticky at a full 100svh, the screenshot runs off the right edge (height min(70svh, 46rem)), and a sticky orbit rail (5rem, fading from transparent into the void) sits at the bottom.
- **Belt:** two equal columns (one below 900px); each row is a 7.5rem thumbnail, text, and an arrow (5.5rem thumbnail, no arrow, on phones).
- **About / Contact:** asymmetric two-column grids (1.1fr / 1fr and 1.4fr / 1fr), stacking below 1100px.
- **Rhythm:** hairline top borders separate every section. Interactive targets are at least 2.75rem tall.

## Elevation & Depth

Depth is darkness and overlap, not floating surfaces. Surfaces are flat at rest; there is no ambient card shadow. Three devices carry depth: stages physically slide over one another while the outgoing one recedes (scale 0.88, opacity 0.18, up 4%); screenshots and the dialog cast a short, heavy, tightly spread shadow straight down, like an object lit from above; and a stage's top edge is lit from behind by its project color.

### Shadow Vocabulary
- **Window drop** (`box-shadow: 0 22px 14px -16px rgb(0 0 0 / 0.9)`): stage screenshots.
- **Dialog drop** (`box-shadow: 0 20px 14px -14px rgb(0 0 0 / 0.95)`): the detail dialog.
- **Sheet drop** (`box-shadow: 0 20px 30px -10px rgb(0 0 0 / 0.85)`): the phone menu sheet.
- **Limb light** (`box-shadow: 0 -28px 40px -30px color-mix(in srgb, var(--project-color) 45%, transparent)`): the lit rim above each stage.
- **Chrome rim** (`box-shadow: inset 1px 1px 2px rgb(236 235 255 / 0.35)`): the primary capsule, brightening to `inset 1px 1px 3px rgb(255 255 255 / 0.55)` on hover.

### Named Rules
**The Black Shadow Rule.** Drop shadows are pure black, short, and pulled in by a negative spread. Colored light belongs to the orbit world itself (a project's rim and body, the stars, the faint lavender haze on the chrome hero line), never under a control or a surface.

## Shapes

Two silhouettes dominate: the capsule (every control) and the planetary limb (each stage's top edge is an ellipse, `border-radius: 50% 50% 0 0 / clamp(1.25rem, 3vw, 3rem)`). Windows are softly rounded rectangles: 18px for the dialog, 14px for stage screenshots (squared on the right where they bleed off the edge), 10px for dialog media, 8px for thumbnails, 6px for a cover inside a frame. Circles mark projects (bodies, 0.55 to 0.7rem) and the round icon button. Borders are always 1px.

## Components

### Buttons
Chrome-rimmed and tactile; one filled look for every primary action.
- **Shape:** full capsule (999px), at least 2.75rem tall.
- **Primary pill:** Ink text in Sora 500 at 0.875rem with 0.03em tracking, a 1px pale chrome rim, a smoky 110deg gradient fill, and an inset top-left highlight. An icon (arrow, outbound arrow, or star) trails the label at 1.25rem.
- **Hover / Active:** fill darkens to the violet-black hover fill, rim turns white, the inset highlight brightens, and the pill lifts 2px over 0.35s on the ease-out curve; it returns to rest on press. Reduced motion removes the lift.
- **Large pill:** the contact action, 3.5rem tall at body size.
- **Ghost capsule:** transparent with a Control Rim border and Ink 2 text; hover fills with the lavender haze and brightens text to Ink.
- **Round button:** 2.75rem circle with a Control Rim border, used to close the dialog; hover fills with haze and turns the rim lavender.
- **Text link:** Ink 2 label with an optional leading icon, brightening to Ink on hover.

### Cards / Containers
The system has no card grid. Containers are windows and rows.
- **Stage window:** screenshot on the raised void inside a 1px strong hairline, 14px corners, the window drop shadow. The image crop is data-driven (`--frame-origin`, `--frame-scale`).
- **Belt row:** hairline-ruled list row. Thumbnail 16:9 at 8px corners, then name (with its project body), summary in Ink 2, metadata caption in Ink 3, and a trailing arrow. Hover turns the name lavender, nudges the arrow 3px right, and scales the thumbnail image to 1.04.
- **Drawn cover:** for projects without a public screenshot, a line drawing stroked in the project color at 1.2 over the raised void with a 16% project-color wash.

### Navigation
- **Header links:** Sora 0.875rem in Ink 2, Ink on hover, no underline or indicator.
- **Phone menu:** a two-bar toggle that crosses into an X; the sheet drops under the header on the raised void with hairline-ruled 3.25rem rows at 1.125rem in Ink.
- **Orbit rail:** the featured three as bodies on a thin orbit line that fades out after the last one. Labels are Ink 3, becoming Ink when hovered or current; the current body scales to 1.7.

### Project Body
The signature mark: a small sphere drawn with a radial gradient from a white highlight through the project color to its shadowed edge. It precedes every project's metadata line (stage, belt, dialog) and stands for the project on the rail and the hero ring.

### Detail Dialog
Raised void, 1px strong hairline, 18px corners, dialog drop shadow, over a backdrop of `rgb(2 3 7 / 0.82)` with a 10px blur. A sticky top bar fades from the raised void to transparent and holds the round close button. Title in solid-ink Neuropol, then the project body with its metadata, the summary as a lede, actions, media in a 10px frame, and body text.

## Do's and Don'ts

### Do:
- **Do** keep every page on the void (#050607) and lift only to the raised void or panel for windows, sheets, and the dialog.
- **Do** mark every project with its own lit body before its metadata, and keep its color out of text and controls.
- **Do** use the chrome capsule for every primary action and the ghost capsule or round button for secondary controls, all at least 2.75rem tall.
- **Do** show real screenshots as bordered windows and let them run off the right edge on wide screens.
- **Do** set section and dialog headings in solid-ink Neuropol, one step below the chrome stage titles.
- **Do** focus with a 2px lavender outline at a 3px offset.
- **Do** separate sections with 1px hairlines instead of boxes.

### Don't:
- **Don't** put chrome fill on any heading other than the hero line and the featured stage titles.
- **Don't** put a glow halo around a capsule; its light is the inset rim (a glowing star icon inside it is part of the orbit world, not a halo).
- **Don't** introduce a second accent color, or color interface text with a project color.
- **Don't** lay work out as a paged card carousel or a grid of equal cards; featured work gets stages, the rest gets a list.
- **Don't** set sentences, metadata, or controls in Neuropol.
- **Don't** use colored or diffuse ambient shadows under surfaces.
