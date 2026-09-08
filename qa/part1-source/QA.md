# Visual and interaction checks

The desktop reference is 1672 × 941. At this viewport the implementation's measured section boundaries are:

| Section       | Top | Height |
| ------------- | --: | -----: |
| Header        |   0 |     86 |
| Hero          |  86 |    381 |
| Featured work | 467 |    272 |
| What we do    | 739 |    146 |
| Footer        | 885 |     56 |

These align with the supplied reference. The supplied logo intentionally replaces the mockup's logo, and the requested hover behavior and original Blender service icons extend the static reference.

`interaction-report.json` records the browser checks for the project viewers, navigation, dialogs, selected service, brief download, keyboard focus, reduced motion and overflow at nine widths. The run reported zero JavaScript errors and zero failed requests.

The additional hover behavior was inspected in the live Chrome preview:

- Moving onto a cube set `data-cubes-hovered` to `true`, applied a roughly 4-pixel lift and raised the cool glow opacity.
- Each service holder reports `data-model="blender"`. Only the hovered service starts its rotation loop; pointer exit stops the loop and preserves its angle.
- The ring's blue halo is independent of the cube hover state.
- The original Blender sources and seven model exports are retained in the project.

To repeat the original browser checks, start the development server and run:

```sh
python scripts/visual_qa.py
python scripts/interaction_qa.py
```

These scripts use Python Playwright with installed Chrome. The website itself requires only Node and npm.
