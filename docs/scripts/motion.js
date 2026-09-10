// One motion setting coordinates CSS loops, JavaScript reveals, portrait effects and the intro.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector(".motion-toggle");
// Track only unfinished reveal animations so Pause can cancel them without hiding content.
const activeReveals = new Set();
let motionPaused = false;
let revealsStarted = false;

// One role at a time, using a small CSS transition between printed headlines.
const roleWords = [...document.querySelectorAll(".role-word")];
const roleHeading = document.querySelector(".role-heading");
const roleDelay =
  Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--duration-role-hold",
    ),
  ) || 3200;
let roleIndex = 0;
let roleTimer;

// Recreate one timer when visibility or motion changes; pause it while the tab is hidden.
function syncRoleRotation() {
  clearInterval(roleTimer);
  if (!roleHeading || roleWords.length < 2) return;
  if (
    !revealsStarted ||
    document.hidden ||
    document.body.dataset.motion !== "on"
  )
    return;
  roleTimer = setInterval(() => {
    // Preserve the current word while this headline is outside the viewport.
    const bounds = roleHeading.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) return;
    roleWords.forEach((word) => word.classList.remove("is-outgoing"));
    roleWords[roleIndex].classList.replace("is-current", "is-outgoing");
    roleIndex = (roleIndex + 1) % roleWords.length;
    roleWords[roleIndex].classList.add("is-current");
  }, roleDelay);
}

// The operating-system preference takes priority over the page's Pause/Resume control.
function updateMotion() {
  const enabled = !reducedMotion.matches && !motionPaused;
  document.body.dataset.motion = enabled ? "on" : "off";
  if (motionToggle) {
    motionToggle.disabled = reducedMotion.matches;
    motionToggle.setAttribute("aria-pressed", String(!enabled));
    motionToggle.textContent = reducedMotion.matches
      ? "Reduced motion"
      : enabled
        ? "Pause motion"
        : "Resume motion";
  }
  if (!enabled) activeReveals.forEach((animation) => animation.cancel());
  syncRoleRotation();
  // The intro and scroll effects subscribe to this event instead of sharing their own state.
  document.dispatchEvent(new Event("motionchange"));
}

// Animate elements only as they enter view; never hide content behind a JS class.
export function startContentMotion() {
  if (revealsStarted) return;
  revealsStarted = true;
  syncRoleRotation();
  if ("IntersectionObserver" in window && Element.prototype.animate) {
    const styles = getComputedStyle(document.documentElement);
    const duration =
      Number.parseFloat(styles.getPropertyValue("--duration-reveal")) || 850;
    const easing = styles.getPropertyValue("--ease-out").trim() || "ease-out";
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // Each item reveals once, including items reached while motion is paused.
          revealObserver.unobserve(entry.target);
          if (document.body.dataset.motion !== "on") return;

          // Headline and project entrances differ slightly; all other elements rise into place.
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

// Reading progress is always available; photo drift and tilt run only when motion is enabled.
function initScrollEffects() {
  const siteHeader = document.querySelector(".site-header");
  const portrait = document.querySelector(".portrait");
  const photo = document.querySelector(".portrait-image");
  if (!siteHeader || !portrait || !photo) return;
  let scrollFrame = 0;

  function updateScrollEffects() {
    scrollFrame = 0;
    const pageHeight = document.documentElement.scrollHeight - innerHeight;
    siteHeader.style.setProperty(
      "--reading-progress",
      pageHeight > 0 ? Math.max(0, Math.min(1, scrollY / pageHeight)) : 0,
    );
    const drift =
      document.body.dataset.motion === "on" ? Math.min(scrollY * 0.035, 22) : 0;
    photo.style.setProperty("--photo-drift", drift + "px");
  }
  // Scroll events can arrive faster than frames, so combine them into one visual update.
  function queueScrollEffects() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
  }
  window.addEventListener("scroll", queueScrollEffects, { passive: true });
  window.addEventListener("resize", queueScrollEffects);
  // Details toggle does not bubble; capture it so a longer story updates the reading progress.
  document.addEventListener("toggle", queueScrollEffects, true);
  document.addEventListener("motionchange", queueScrollEffects);
  updateScrollEffects();

  // The portrait responds to a mouse, while touch keeps its natural scrolling.
  portrait.addEventListener("pointermove", (event) => {
    if (document.body.dataset.motion !== "on" || event.pointerType !== "mouse")
      return;
    const bounds = portrait.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
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
}

// Shared with the intro, which must skip its opening when motion is disabled.
export function isMotionEnabled() {
  return document.body.dataset.motion === "on";
}

// Connect the user control, system preference and tab visibility to the shared motion state.
export function initMotion() {
  motionToggle?.addEventListener("click", () => {
    motionPaused = !motionPaused;
    updateMotion();
  });
  reducedMotion.addEventListener("change", updateMotion);
  document.addEventListener("visibilitychange", syncRoleRotation);
  updateMotion();
  if (motionToggle) motionToggle.hidden = false;
  initScrollEffects();
}
