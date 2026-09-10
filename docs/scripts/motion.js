const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector(".motion-toggle");
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
    const bounds = roleHeading.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) return;
    roleWords.forEach((word) => word.classList.remove("is-outgoing"));
    roleWords[roleIndex].classList.replace("is-current", "is-outgoing");
    roleIndex = (roleIndex + 1) % roleWords.length;
    roleWords[roleIndex].classList.add("is-current");
  }, roleDelay);
}

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
  function queueScrollEffects() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
  }
  window.addEventListener("scroll", queueScrollEffects, { passive: true });
  window.addEventListener("resize", queueScrollEffects);
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

export function isMotionEnabled() {
  return document.body.dataset.motion === "on";
}

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
