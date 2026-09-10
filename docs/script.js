import { initTheme } from "./scripts/theme.js";
import { initNavigation } from "./scripts/navigation.js";
import { initProjects } from "./scripts/projects.js";
import { initMotion } from "./scripts/motion.js";
import { initIntro } from "./scripts/intro.js";

initTheme();
initNavigation();
initProjects();
initMotion();
initIntro();

document.querySelectorAll(".story-word").forEach((word) => {
  word.addEventListener("click", () => {
    word.setAttribute(
      "aria-pressed",
      String(word.getAttribute("aria-pressed") !== "true"),
    );
  });
});
const year = document.getElementById("yr");
if (year) year.textContent = new Date().getFullYear();
