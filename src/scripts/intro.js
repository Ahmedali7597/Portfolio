import {
  isMotionEnabled,
  startContentMotion,
} from "./motion.js";

// Manage the opening dialog, its timeout and replay without delaying the actual page load.
export function initIntro() {
  const intro = document.querySelector(".intro");
  const replay = document.querySelector(".intro-replay");

  // A page without the opening still starts its scroll reveals.
  if (!intro) {
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
    // First arrival respects a project bookmark; replay remembers the reader's current position.
    previousScroll = firstOpening ? 0 : scrollY;
    initialAnchor = firstOpening
      ? document.getElementById(location.hash.slice(1))
      : null;
    firstOpening = false;
    intro.showModal();
    // This includes the unfold animation and a short reading pause before revealing the page.
    timer = setTimeout(() => intro.close(), 4200);
  }

  // A system preference change can happen while the dialog is already open.
  function syncMotion() {
    if (replay) replay.disabled = !isMotionEnabled();
    if (!isMotionEnabled() && intro.open) intro.close();
  }

  // Any click, tap, scroll, swipe or key turns the page early, so the opening never gets in the way.
  // The Skip button sits inside the dialog, so its click is handled here too.
  const dismiss = () => intro.open && intro.close();
  intro.addEventListener("click", dismiss);
  intro.addEventListener("wheel", dismiss, { passive: true });
  intro.addEventListener("touchmove", dismiss, { passive: true });
  intro.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") dismiss();
  });
  // Every way out (Skip, Escape, any input or the timeout) ends in the same native close event.
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
