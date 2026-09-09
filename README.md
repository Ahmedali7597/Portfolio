# Ahmed Ali — Portfolio

**Author: Ahmed Ali**

A software-development portfolio combining a noir detective identity with
editorial typography, paper sections and case-file project articles.

[Live portfolio](https://ahmedali7597.github.io/Portfolio/)

## Run locally

No installation or build step is required. From the repository root:

```bash
python3 -m http.server 8080 --directory docs
```

Open `http://localhost:8080`. Opening `docs/index.html` directly also works.
An internet connection is needed for Google Fonts and external destinations;
system font fallbacks keep the local page readable offline.

## Source organization

| File                 | Responsibility                                               |
| -------------------- | ------------------------------------------------------------ |
| `docs/index.html`    | Semantic page content, project articles and contact links    |
| `docs/variables.css` | Primitive colors, typography, spacing and sizing             |
| `docs/theme.css`     | Semantic ink/paper themes and static texture                 |
| `docs/styles.css`    | Shared layout, components, responsive and print styles       |
| `docs/script.js`     | Mobile menu, video pausing/error feedback and copyright year |
| `docs/assets/`       | Portrait, original project posters and demo recordings       |
| `tokens.json`        | Portable design tokens matching the CSS values               |
| `DESIGN.md`          | Reference decisions and rationale                            |

The stylesheets load in the order shown above. Edit content in HTML, shared
values in `variables.css`, theme roles in `theme.css`, and layout in `styles.css`.
Keep `tokens.json` aligned when changing primitive values. No framework, CSS
compiler, package manager or runtime data fetch is needed.

## Behavior and accessibility

- Content and navigation remain available when JavaScript is disabled.
- The mobile menu exposes its expanded state and supports Escape, outside clicks
  and keyboard focus leaving the navigation.
- Native video controls support playback, sound and fullscreen. Videos do not
  autoplay and do not preload their recordings on page load.
- With JavaScript, playing one video pauses the other; videos also pause when
  fully offscreen or the page becomes hidden.
- Skip navigation, visible keyboard focus, reduced-motion preferences, responsive
  columns and a print stylesheet are included.
- Existing section and case anchors are preserved for incoming links.

## Publish on GitHub Pages

The existing Pages source is the `docs/` directory on `main`. Review and commit
the changes using your own Git identity, then push to the existing repository.
The redesign does not require a change to the Pages configuration.

Project and code credits use **Ahmed Ali**. Commit author and committer names use
the GitHub username **Ahmedali7597**, with no co-author credits. The live site
updates after changes are pushed to the existing Pages source.

## Validation notes

HTML structure, local assets, incoming anchors, CSS syntax and token consistency,
JavaScript syntax, menu and video behavior, text contrast, phone removal and
author attribution were checked. Layout and media playback still need a visual
review in a browser; the interaction checks used a DOM environment.

The original Tap to Trade repository URL returned HTTP 404 to public visitors.
Its primary action now requests source access by email. The Emotional Garden
source link was publicly reachable.
