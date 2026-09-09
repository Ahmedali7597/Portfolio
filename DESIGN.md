# Design notes

An editorial portfolio with a detective noir identity. The supplied reference
files are design references; the current brief calls for expressive motion.

## Reference lock

The primary reference is [Henry Codes](https://henry.codes/): oversized condensed
type, contrasting serif text, full-width paper/ink sections, moving type and a
numbered project index. Preserve that scale and contrast, without copying its
headlines, artwork, source code or commercial fonts.

Borrow only the tight newspaper rules and editorial spacing from
[Miranda](https://www.niccolomiranda.com/). Case numbering, the portrait and
moving venetian-blind shadows belong to Ahmed's detective noir direction.

| Decision                                            | Source                        | Role                                                         |
| --------------------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| Paper `#fafafa` and ink `#2a2722`                   | Supplied Henry tokens         | Main canvas, text and full-width inversions                  |
| Noir `#0a090d`                                      | Existing portfolio            | Portrait backdrop and footer                                 |
| Anton / Cormorant Garamond / Inter                  | Henry's three type roles      | Condensed mastheads / editorial titles / readable body text  |
| Small case numbers and fine rules                   | User's noir brief; Miranda    | Organize real projects as case files                         |
| Portrait and original game recordings               | Existing portfolio            | Real personal and project evidence; keep recordings in color |
| Headline entrances, scrolling type, opening cases   | Henry; Refero motion guidance | Establish hierarchy and show interaction feedback            |
| Motion toggle and reduced-motion support            | Refero craft guidance         | Keep all content usable without animation                    |
| Native details, video controls and normal scrolling | Simple-code requirement       | Keyboard/touch support without a framework                   |

No build step, animation library, scroll hijacking or custom cursor. Motion uses
CSS and the Web Animations API; content remains readable if JavaScript fails.
Keep the existing project links, contact destinations and incoming section IDs.
