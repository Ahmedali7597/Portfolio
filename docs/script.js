// Entry point: each module owns one part of the page and its event listeners.
import { initTheme } from "./scripts/theme.js?v=20260909-newswire";
import { initNavigation } from "./scripts/navigation.js?v=20260909-newswire";
import { initProjects } from "./scripts/projects.js?v=20260909-newswire";
import { initMotion } from "./scripts/motion.js?v=20260909-newswire";
import { initIntro } from "./scripts/intro.js?v=20260909-newswire";

initTheme();
initNavigation();
initProjects();
// Set the motion preference before the intro decides whether it should play.
initMotion();
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
