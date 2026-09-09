// Small enhancements; the page also works without JavaScript.
"use strict";

// Use the system theme until the visitor makes a choice.
const themeToggle = document.querySelector(".theme-toggle");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let chosenTheme = document.documentElement.dataset.theme || null;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.title =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#171816" : "#f0ece3";
}
applyTheme(chosenTheme || (systemTheme.matches ? "dark" : "light"));
themeToggle.addEventListener("click", () => {
  chosenTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(chosenTheme);
  try {
    localStorage.setItem("portfolio-theme", chosenTheme);
  } catch {}
});
systemTheme.addEventListener("change", () => {
  if (!chosenTheme) applyTheme(systemTheme.matches ? "dark" : "light");
});
themeToggle.hidden = false;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector(".motion-toggle");
const introReplay = document.querySelector(".intro-replay");
const activeReveals = new Set();
let motionPaused = false;

function updateMotion() {
  const enabled = !reducedMotion.matches && !motionPaused;
  document.body.dataset.motion = enabled ? "on" : "off";
  motionToggle.disabled = reducedMotion.matches;
  introReplay.disabled = !enabled;
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
let revealsStarted = false;
function startReveals() {
  if (revealsStarted) return;
  revealsStarted = true;
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

          const kind = entry.target.dataset.reveal;
          const headline = kind === "headline";
          const animation = entry.target.animate(
            [
              {
                opacity: 0,
                transform: headline
                  ? "translateY(90%) rotate(3deg)"
                  : kind === "case"
                    ? "translateX(-30px)"
                    : "translateY(36px)",
              },
              { opacity: 1, transform: "translateY(0) rotate(0)" },
            ],
            {
              duration,
              easing,
              delay: Number(entry.target.dataset.delay || 0),
              fill: "backwards",
            },
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

// Each opening word controls only its own initial.
document.querySelectorAll(".story-word").forEach((word) => {
  word.addEventListener("click", () => {
    const highlighted = word.getAttribute("aria-pressed") !== "true";
    word.setAttribute("aria-pressed", String(highlighted));
  });
});

// A single animation frame handles reading progress and gentle photograph drift.
const siteHeader = document.querySelector(".site-header");
const portrait = document.querySelector(".portrait");
const photo = document.querySelector(".portrait-image");
let scrollFrame = 0;

function updateScrollEffects() {
  scrollFrame = 0;
  const pageHeight = document.documentElement.scrollHeight - innerHeight;
  siteHeader.style.setProperty(
    "--reading-progress",
    pageHeight > 0 ? scrollY / pageHeight : 0,
  );
  const drift =
    document.body.dataset.motion === "on" ? Math.min(scrollY * 0.035, 22) : 0;
  photo.style.setProperty("--photo-drift", drift + "px");
}
function queueScrollEffects() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
}
window.addEventListener("scroll", queueScrollEffects, { passive: true });
window.addEventListener("resize", queueScrollEffects);
updateScrollEffects();

// The portrait responds to a mouse, while touch keeps its natural scrolling.
portrait.addEventListener("pointermove", (event) => {
  if (document.body.dataset.motion !== "on" || event.pointerType !== "mouse")
    return;
  const bounds = portrait.getBoundingClientRect();
  photo.style.setProperty(
    "--tilt-x",
    (0.5 - (event.clientY - bounds.top) / bounds.height) * 5 + "deg",
  );
  photo.style.setProperty(
    "--tilt-y",
    ((event.clientX - bounds.left) / bounds.width - 0.5) * 5 + "deg",
  );
});
portrait.addEventListener("pointerleave", () => {
  photo.style.setProperty("--tilt-x", "0deg");
  photo.style.setProperty("--tilt-y", "0deg");
});

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

// A short front-page opening, with native dialog focus handling and an immediate exit.
const intro = document.querySelector(".intro");
let introTimer;
let introScroll = 0;
let firstIntro = true;
let introAnchor = null;

function showIntro() {
  if (
    document.body.dataset.motion !== "on" ||
    typeof intro.showModal !== "function"
  ) {
    startReveals();
    return;
  }
  introScroll = firstIntro ? 0 : scrollY;
  introAnchor = firstIntro
    ? document.getElementById(location.hash.slice(1))
    : null;
  firstIntro = false;
  intro.showModal();
  introTimer = setTimeout(() => intro.close(), 3400);
}
intro
  .querySelector(".intro-skip")
  .addEventListener("click", () => intro.close());
intro.addEventListener("close", () => {
  clearTimeout(introTimer);
  requestAnimationFrame(() => {
    // Native dialog focus restoration must not move the opening page.
    if (introAnchor) introAnchor.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: introScroll, behavior: "instant" });
    startReveals();
  });
});
introReplay.addEventListener("click", showIntro);
introReplay.hidden = false;
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches && intro.open) intro.close();
});
showIntro();
