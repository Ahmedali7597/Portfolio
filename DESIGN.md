# Design notes

Ahmed's portfolio takes the form of a 1950s newspaper with a detective noir mood
and modern, responsive motion. The supplied files are references, not instructions.

## Reference lock

[Henry Codes](https://henry.codes/) supplies the scale, strong type contrast,
full-width paper/ink sections and moving editorial type. [Miranda](https://www.niccolomiranda.com/)
informs the fine rules, columns and newspaper spacing. The headlines, personal
story, case files and animated portrait are specific to Ahmed.

Refero's bundled craft and motion guidance informed the implementation. Live
Refero search was unavailable because the connected account has no subscription.

| Choice                                                                                                | Purpose                                                                                 |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Warm paper `#f0ece3`, ink `#2a2722`, monochrome photographs                                           | A printed newspaper rather than a generic portfolio grid                                |
| Cormorant Garamond masthead and stories; Anton section headlines; Inter body; Courier labels          | Traditional editorial character with clear modern hierarchy                             |
| Double rules, bylines, drop cap, project columns and a small classified notice                        | Newspaper details that carry actual portfolio content                                   |
| Charcoal paper `#171816` and cream text `#e9e4d9` in dark mode                                        | Preserve the same print identity after dark                                             |
| “Extra! Extra! Read all about it!” and a two-page newspaper unfolding                                 | A short opening sequence built from HTML and CSS                                        |
| Staggered entrances, moving newswire, rolling case titles, smooth case expansion and portrait shadows | Visible motion at arrival, while scrolling and during interaction                       |
| Seven story sentences beginning MYSTERY                                                               | A personal clue about coffee, games, true crime, puzzles, Magic and visual storytelling |
| Individual initial hover, keyboard focus and tap states                                               | Each letter can be discovered independently                                             |
| Emotional Garden voice credit directly below the recording                                            | Clearly credit Ahmed's project partner                                                  |

The intro closes automatically after 3.4 seconds, supports Skip and Escape, and
can be replayed from the footer. It is skipped when reduced motion is preferred.
A visible motion control pauses the continuous effects. Dark mode follows the
system until the visitor chooses a theme, then remembers that choice locally.

## Implementation

Plain HTML, CSS and JavaScript; no framework, animation library or build step.
CSS handles print styling and small interactions. IntersectionObserver and the
Web Animations API handle entrances without making content depend on JavaScript.
Native details, video controls and dialog keep the behavior readable and accessible.
Case expansion uses intrinsic-size transitions where supported, with native
opening as a fallback. Normal scrolling, existing links and section IDs are retained.
