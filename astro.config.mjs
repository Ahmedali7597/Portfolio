// GitHub Pages serves this repository at /Portfolio/.
// After renaming the repo to ahmedali7597.github.io, delete `base` and the site moves to the root URL.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ahmedali7597.github.io",
  base: "/Portfolio/",
});
