# Design notes

Ahmed's portfolio is a personal newspaper with a 1950s print identity and modern
motion. The introductory publication is **The Daily Mystery**, with Ahmed Ali as
its author. The main masthead remains Ahmed's name. Detective language and
venetian-blind shadows are limited to the opening portrait and rotating role.

## Reference lock

The existing [Henry Codes](https://henry.codes/) reference supplies the large
type and moving editorial rhythm. [Miranda](https://www.niccolomiranda.com/)
informs the rules and newspaper spacing. The June 10, 1950
[Evening Star front page](https://www.loc.gov/resource/sn83045462/1950-06-10/ed-1/?sp=1)
provides a period reference for the dateline, bylines and dense text columns.
Its archive text was available; the image endpoint was unavailable.

Refero's bundled typography and motion guidance informs the implementation.
Live Refero search is unavailable on the connected account.

| Decision                                                                               | Source and purpose                                                |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Light newsprint on a first visit                                                       | User request; dark mode remains an explicit, remembered choice    |
| The Daily Mystery masthead with Ahmed's byline                                         | User's fictional newspaper identity, confined to the intro        |
| Blackletter nameplate, four narrow text columns, datelines and bordered advertisements | 1950s newspaper brief and period structure; all copy is original  |
| Tap to Trade, Emotional Garden and Cosmic Perfection advertisements                    | User request; advertisements appear only in the opening spread    |
| Developer, Detective, Author, Game developer, Filmmaker                                | User's rotating role idea; one visible phrase every 3.2 seconds   |
| Stories, the personal column, at the press and letters                                 | User's newspaper wording for the main portfolio sections          |
| Paper surfaces throughout the main page; noir portrait at the top                      | User's request to reserve the detective treatment for the opening |
| Independent MYSTERY initials and the partner's voice credit                            | Earlier user requests, retained                                   |

## Implementation

Plain HTML, CSS and JavaScript with no framework or build step. The miniature
newspaper is real HTML text arranged in columns and scaled with its container.
Its two halves unfold, then the page becomes available after 4.2 seconds.
Skip, Escape and replay remain available. Reduced motion skips the intro.

The role changes with a short CSS transition. The timer starts after the intro,
pauses with the motion control or a hidden browser tab, and does not advance
while the headline is off screen. Screen readers receive a stable role description.

Native details and video controls retain the project interactions. Original
project links and section IDs remain valid. Dark mode stores an explicit choice
locally; system dark mode no longer changes the initial edition.

## Code organization

The entry script starts five focused modules: theme, navigation, projects, motion
and intro. Each module owns its listeners and local state. The intro listens for
motion changes so the pause control and reduced-motion preference stay consistent.
Opening-spread styles and shared motion rules have their own stylesheets; the main
stylesheet covers page layout and responsive rules. Browser storage failures leave
the theme usable, missing controls are tolerated, and native project content stays
readable if enhancements cannot load.

## Finding your way through the code

| File                         | What to edit here                                                              |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `docs/index.html`            | Page copy, project stories, links, the MYSTERY quote and the opening newspaper |
| `docs/variables.css`         | Shared colors, font families, spacing and animation timings                    |
| `docs/theme.css`             | Light and dark versions of the paper and ink surfaces                          |
| `docs/styles.css`            | Page layout, component styling, responsive breakpoints and print rules         |
| `docs/intro.css`             | The miniature newspaper, columns, advertisements and unfolding animation       |
| `docs/motion.css`            | Continuous scrolling, small decorative animations and pause rules              |
| `docs/script.js`             | Startup order, individual letter buttons and the footer year                   |
| `docs/scripts/theme.js`      | Theme switching and remembering the visitor's choice                           |
| `docs/scripts/navigation.js` | Mobile menu, keyboard focus and links to project stories                       |
| `docs/scripts/projects.js`   | Video playback cleanup, error notices and printing open stories                |
| `docs/scripts/motion.js`     | Rotating roles, scroll reveals, reading progress and portrait movement         |
| `docs/scripts/intro.js`      | Opening, skipping, closing and replaying the introductory newspaper            |

The newswire contains two identical groups. Each group is at least as wide as
its visible window, with the short items spaced across it. The animation moves
by one group, so the second copy meets the first at the loop boundary. Hover
and the motion control pause its existing timeline instead of restarting it.
Keep both groups identical when changing their text.

`tokens.json` is the portable version of the design values. Update it alongside
`variables.css` when changing a shared token. When changing module imports,
use the same version suffix everywhere so the intro and entry point load one
shared instance of the motion module.
