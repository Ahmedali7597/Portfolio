# Portfolio design direction

Owner and author: **Ahmed Ali**

## Reference lock

The developer's dossier combines the existing portfolio's noir identity with the
editorial hierarchy in the supplied DESIGN.md, variables.css, theme.css and
tokens.json. The noir site is the primary identity; the supplied broadside
reference contributes paper sections, serif scale and printed rules.

Preserve the dark canvas, portrait, case numbering, three projects, playable
recordings and existing contact destinations. Use editorial columns for scanning
and full-width paper-to-ink changes for section rhythm. Keep real project media
in its original color so visitors can assess the work.

## Decisions

| Decision                                                      | Source                                         | Purpose                                                                 |
| ------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| Noir `#0a090d` masthead and profile                           | Existing CSS                                   | Preserve the portfolio's original atmosphere.                           |
| Paper `#fafafa`, headline ink `#2a2722`, neutral rules        | Supplied color tokens                          | Make projects read like clearly structured articles.                    |
| Large Cormorant Garamond headlines, Inter body and navigation | Existing fonts; supplied display/body roles    | Create editorial contrast without adding a font dependency.             |
| Fine rules, flat sections, 12px action radius                 | Supplied structural and radius tokens          | Establish hierarchy without shadows or floating panels.                 |
| Static, low-opacity grain on paper                            | Existing texture primitive; user brief         | Suggest print texture without covering the content.                     |
| Tap to Trade first; two game articles below                   | Existing content; software-development focus   | Put the full-stack capstone before the game demos.                      |
| Portrait and original demo posters                            | Existing media                                 | Retain personal identity and real evidence of the work.                 |
| Native video controls and visible default content             | Simplicity requirement; accessibility guidance | Keep the portfolio usable with keyboard, touch and JavaScript disabled. |

## Deliberate adaptations

- Keep the existing noir background as a distinct token; do not redefine the
  supplied headline-ink token as the darker background.
- Keep color in the project recordings. The reference's monochrome illustration
  rule applies to its artwork, not to this portfolio's software evidence.
- Use responsive headline sizes rather than the reference's fixed 226–371px type.
  Keep body text at 16px or larger, and reserve 12px for secondary metadata.
- Use existing, available fonts instead of declaring unavailable commercial
  families that would silently fall back to sans-serif.
- Replace the invalid source value `64-96px` with a fluid section-space token.
- Use ordinary CSS in theme.css. The supplied Tailwind `@theme` block needs a
  compiler; this GitHub Pages site intentionally has no build step.
- Remove the loader, rotating typewriter, fog, marquee, magnetic targets and
  tilt effects. Noir character comes from composition and typography.

## Code map

- `docs/index.html`: semantic content, navigation, projects and contact links.
- `docs/variables.css`: primitive design values and responsive sizing.
- `docs/theme.css`: semantic paper/ink mappings and texture.
- `docs/styles.css`: layout, components, breakpoints, print and motion preferences.
- `docs/script.js`: menu state, video pausing/error feedback and copyright year.
- `tokens.json`: portable design values matching the CSS primitives.

The original anchor IDs remain available, including `#games`, `#about`, `#skills`,
`#contact` and all three `#case-*` links. No project content depends on JavaScript.
The updated website contains no telephone contact fields. Project and code credits
use Ahmed Ali; commit author and committer names use Ahmedali7597. There are no
co-author trailers.

The original capstone source URL returned HTTP 404 during public verification,
so its source action now opens an email request. Restore a public repository link
when available. Original URL:
`https://github.com/559-Capstone-Mohawk/capstone-Ahmedali7597`.
