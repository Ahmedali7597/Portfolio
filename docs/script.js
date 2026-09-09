// Small enhancements; the page also works without JavaScript.
"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector(".motion-toggle");
const activeReveals = new Set();
let motionPaused = false;

function updateMotion() {
  const enabled = !reducedMotion.matches && !motionPaused;
  document.body.dataset.motion = enabled ? "on" : "off";
  motionToggle.disabled = reducedMotion.matches;
  motionToggle.setAttribute("aria-pressed", String(!enabled));
  motionToggle.textContent = reducedMotion.matches
    ? "Reduced motion"
    : enabled
      ? "Pause motion"
      : "Resume motion";
  if (!enabled) activeReveals.forEach((animation) => animation.cancel());
}

motionToggle.addEventListener("click", () => {
  motionPaused = !motionPaused;
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);
updateMotion();
motionToggle.hidden = false;

// Animate elements only as they enter view; never hide content behind a JS class.
if ("IntersectionObserver" in window && Element.prototype.animate) {
  const styles = getComputedStyle(document.documentElement);
  const duration = parseFloat(styles.getPropertyValue("--duration-reveal"));
  const easing = styles.getPropertyValue("--ease-out").trim();
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        if (document.body.dataset.motion !== "on") return;

        const headline = entry.target.dataset.reveal === "headline";
        const animation = entry.target.animate(
          [
            {
              opacity: 0,
              transform: headline
                ? "translateY(90%) rotate(3deg)"
                : "translateY(28px)",
            },
            { opacity: 1, transform: "translateY(0) rotate(0)" },
          ],
          { duration, easing },
        );
        activeReveals.add(animation);
        animation.onfinish = animation.oncancel = () =>
          activeReveals.delete(animation);
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll("[data-reveal]")
    .forEach((item) => revealObserver.observe(item));
}

// Keep the mobile menu usable with touch, keyboard and outside clicks.
const navigation = document.querySelector(".navigation");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const mobile = window.matchMedia("(max-width: 760px)");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "Close −" : "Menu +";
  navLinks.classList.toggle("is-open", open);
}

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!navigation.contains(event.target)) setMenu(false);
});
navigation.addEventListener("focusout", (event) => {
  if (!navigation.contains(event.relatedTarget)) setMenu(false);
});
mobile.addEventListener("change", () => {
  const linksHadFocus = navLinks.contains(document.activeElement);
  const toggleHadFocus = document.activeElement === menuToggle;
  setMenu(false);
  if (mobile.matches && linksHadFocus) menuToggle.focus();
  if (!mobile.matches && toggleHadFocus) navLinks.querySelector("a").focus();
});
navigation.dataset.enhanced = "true";
menuToggle.hidden = false;

// Open case files before following their original incoming links.
function openCase(id) {
  const target = document.getElementById(id);
  if (target?.matches("details.case")) target.open = true;
  return target;
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = openCase(link.hash.slice(1));
    if (navLinks.contains(link) && mobile.matches) {
      setMenu(false);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }
  });
});
window.addEventListener("hashchange", () => openCase(location.hash.slice(1)));
openCase(location.hash.slice(1));

// Native controls handle playback; only pause recordings when they are out of use.
const videos = [...document.querySelectorAll("[data-video]")];
videos.forEach((video) => {
  video.addEventListener("play", () => {
    videos.forEach((other) => {
      if (other !== video) other.pause();
    });
  });
  function showVideoError() {
    video.closest("figure").querySelector(".video-status").hidden = false;
  }
  video.addEventListener("error", showVideoError);
  video
    .querySelectorAll("source")
    .forEach((source) => source.addEventListener("error", showVideoError));
});
const cases = [...document.querySelectorAll("details.case")];
cases.forEach((item) =>
  item.addEventListener("toggle", () => {
    if (!item.open)
      item.querySelectorAll("video").forEach((video) => video.pause());
  }),
);
if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) entry.target.pause();
    });
  });
  videos.forEach((video) => videoObserver.observe(video));
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) videos.forEach((video) => video.pause());
});

// The hidden initials also have a touch/keyboard control.
const personalNote = document.querySelector(".personal-note");
const clueToggle = document.querySelector(".clue-toggle");
clueToggle.addEventListener("click", () => {
  const revealed = personalNote.classList.toggle("is-revealed");
  clueToggle.setAttribute("aria-pressed", String(revealed));
  clueToggle.textContent = revealed ? "Hide initials −" : "Reveal initials +";
});
clueToggle.hidden = false;

// Include closed case files in printouts, then restore the visitor's choices.
let printState = [];
window.addEventListener("beforeprint", () => {
  printState = cases.map((item) => item.open);
  cases.forEach((item) => {
    item.open = true;
  });
});
window.addEventListener("afterprint", () => {
  cases.forEach((item, index) => {
    item.open = printState[index];
  });
});
document.getElementById("yr").textContent = new Date().getFullYear();
