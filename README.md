# Ahmed Ali — Portfolio

Noir-themed portfolio. Static HTML/CSS/JS, no build step.

**Live:** https://ahmedali7597.github.io/Portfolio/

## Stack

| Layer | Tech |
|-------|------|
| Markup | Semantic HTML5 |
| Style | Vanilla CSS (custom properties, scroll-driven animations) |
| Behaviour | Vanilla JS (IntersectionObserver, typewriter, video hover-play) |
| Fonts | Cormorant Garamond · Special Elite · Inter via Google Fonts |
| Hosting | GitHub Pages — `docs/` folder on `main` |

## Local preview

```bash
cd docs
npx serve .          # or: python3 -m http.server 8080
```

Open http://localhost:3000 (serve) or http://localhost:8080 (python).

## Making changes

All source files live in `docs/`:

```
docs/
├── index.html        ← all markup
├── styles.css        ← all styles
├── script.js         ← all interactions
└── assets/
    ├── img/          ← profile photo, game posters
    └── videos/       ← game demo clips
```

Edit, commit, push to `main`. GitHub Pages updates within ~60 seconds.  
Hard-refresh the live URL (`Ctrl+Shift+R`) to clear cached assets.
