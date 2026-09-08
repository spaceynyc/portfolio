# Spaceynyc — Ideas in Orbit

A responsive implementation of the supplied 1672 × 941 studio mockup, using the supplied `logo.png` in both the header and footer.

## Run

```sh
npm install
npm run dev
```

The development URL is `http://127.0.0.1:5173`. For the production bundle:

```sh
npm run build
npm run preview
```

## Design and interactions

- The header, hero, work, services and footer boundaries align with the reference at its original resolution.
- Navigation, body text, project buttons, service buttons and dialogs are native HTML. The source artwork is reused in individual image regions to retain the mockup's visual fidelity.
- Bespoke display lettering uses source-traced SVG outlines with the original chrome texture. Accessible heading labels are preserved.
- Hovering over the hero cubes produces a restrained lift and cool edge glow. A separate blue halo highlights the orbital ring. The Nexus project card also gains a hover glow.
- Four original Blender service models remain stationary until their service is hovered. Rotation stops on pointer exit; the current angle is retained. Reduced-motion preferences disable rotation.
- Project cards open interactive 3D models with drag and zoom controls. The 3D project viewer loads on demand.
- The mobile hero uses the original Blender Nexus render, and the layout rearranges into stacked project cards and a two-column services grid.

## Editable Blender assets

| Source                                  | Contents                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| `blender/spaceynyc-sculptures.blend`    | Nexus chrome cubes, Orbital rings and star, Chroma flowing filaments           |
| `blender/spaceynyc-service-icons.blend` | Brand prism star, Digital orbit, Content star cluster, Experience orbital star |

All models also have `.glb` exports and transparent `.png` renders in `public/assets`.

The assets were built with the installed [Blender MCP server](https://github.com/ahujasid/blender-mcp) and its Blender 4.5 add-on, using the MCP Python client in `scripts/mcp_client.py`. Asset-building scripts are `scripts/create_assets.py` and `scripts/create_service_icons.py`. Rendering used Cycles with the local RTX 3090. `scripts/start_blender_mcp.py` starts the installed add-on in a separate Blender session.

The server has been registered as `blender` in the local Codex MCP configuration. The current session used it directly through the MCP client; future Codex sessions can load the registered integration.

## Contact and social links

No business email address, social-profile URLs or submission endpoint were supplied. The contact dialog therefore creates a downloadable project brief, with browser-side validation, and does not transmit the entered information. Social buttons open a clearly labeled coming-soon dialog. Connect real destinations before using this as a public business site.

## Verification

See `qa/interaction-report.json` and `qa/README.md`. Screenshots include the desktop reference size, mobile layout, project viewers and contact flow. Browser checks cover navigation, project models, service selection, downloads, keyboard focus, reduced motion and overflow from 320 to 1920 pixels.

## Fonts and source material

- `logo.png` and the mockup image were supplied by the user.
- Neuropol is distributed under CC0 by [Typodermic Fonts](https://typodermicfonts.com/public-domain/); the license note is in `public/assets/FONT-LICENSE.txt`.
- Inter is self-hosted as WOFF2. It is distributed under the SIL Open Font License by the [Inter project](https://github.com/rsms/inter).
- The site has no analytics, external font requests or paid-provider dependencies.
