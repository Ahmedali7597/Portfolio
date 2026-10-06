// Entry point: each module owns one part of the page and its event listeners.
import { initTheme } from "./theme.js";
import { initNavigation } from "./navigation.js";
import { initProjects } from "./projects.js";
import { initMotion } from "./motion.js";
import { initIntro } from "./intro.js";
import { initDeck } from "./deck.js";

initTheme();
initNavigation();
initProjects();
// Set the motion preference before the intro decides whether it should play.
initMotion();
initDeck();
initIntro();

// Native buttons support mouse, touch and keyboard; each remembers only its own letter.
document.querySelectorAll(".story-word").forEach((word) => {
  word.addEventListener("click", () => {
    word.setAttribute(
      "aria-pressed",
      String(word.getAttribute("aria-pressed") !== "true"),
    );
  });
});
// Keep the footer current without editing the HTML each January.
const year = document.getElementById("yr");
if (year) year.textContent = new Date().getFullYear();
