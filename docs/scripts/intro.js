import { isMotionEnabled, startContentMotion } from "./motion.js";

export function initIntro() {
  const intro = document.querySelector(".intro");
  const replay = document.querySelector(".intro-replay");
  const skip = intro?.querySelector(".intro-skip");

  if (!intro || !skip || typeof intro.showModal !== "function") {
    startContentMotion();
    return;
  }

  let timer;
  let previousScroll = 0;
  let firstOpening = true;
  let initialAnchor = null;

  function showIntro() {
    if (intro.open) return;
    if (!isMotionEnabled()) {
      startContentMotion();
      return;
    }
    previousScroll = firstOpening ? 0 : scrollY;
    initialAnchor = firstOpening
      ? document.getElementById(location.hash.slice(1))
      : null;
    firstOpening = false;
    intro.showModal();
    timer = setTimeout(() => intro.close(), 4200);
  }

  function syncMotion() {
    if (replay) replay.disabled = !isMotionEnabled();
    if (!isMotionEnabled() && intro.open) intro.close();
  }

  skip.addEventListener("click", () => intro.close());
  intro.addEventListener("close", () => {
    clearTimeout(timer);
    requestAnimationFrame(() => {
      // Dialog focus restoration should not move the visitor's place on the page.
      if (initialAnchor) initialAnchor.scrollIntoView({ behavior: "instant" });
      else window.scrollTo({ top: previousScroll, behavior: "instant" });
      startContentMotion();
    });
  });
  replay?.addEventListener("click", showIntro);
  if (replay) replay.hidden = false;
  document.addEventListener("motionchange", syncMotion);
  syncMotion();
  showIntro();
}
