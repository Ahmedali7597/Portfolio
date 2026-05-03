/* ─────────────────────────────────────────────
   AHMED ALI · NOIR PORTFOLIO · interactions
   ───────────────────────────────────────────── */
(() => {
  "use strict";

  // ───── Loader ─────
  document.body.classList.add("is-loading");
  const loader = document.getElementById("loader");
  const loaderType = document.getElementById("loaderType");
  const loaderBar  = document.getElementById("loaderBar");
  const loaderPct  = document.getElementById("loaderPct");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const loaderPhrases = [
    "Decoding fingerprints",
    "Cross-referencing aliases",
    "Loading the case file",
    "Lighting the desk lamp"
  ];
  if (loaderType && !reduceMotion) {
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      if (!loader || loader.classList.contains("is-done")) return;
      const phrase = loaderPhrases[pi];
      if (!deleting) {
        ci++;
        loaderType.textContent = phrase.slice(0, ci);
        if (ci === phrase.length) { deleting = true; setTimeout(tick, 700); return; }
      } else {
        ci--;
        loaderType.textContent = phrase.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % loaderPhrases.length; }
      }
      setTimeout(tick, deleting ? 22 : 38 + Math.random() * 50);
    };
    setTimeout(tick, 250);
  } else if (loaderType) {
    loaderType.textContent = "Opening the case file";
  }

  const dismissLoader = () => {
    if (!loader) return;
    if (loaderBar) loaderBar.style.width = "100%";
    if (loaderPct) loaderPct.textContent = "100%";
    setTimeout(() => {
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      setTimeout(() => { loader && loader.remove(); }, 900);
    }, 360);
  };

  // Animate progress bar with subtle stutters, then resolve when ready
  if (loaderBar && loaderPct && !reduceMotion) {
    let p = 0;
    const step = () => {
      if (!loader || loader.classList.contains("is-done")) return;
      const target = Math.min(p + (Math.random() * 9 + 2), 92);
      p = target;
      loaderBar.style.width = p.toFixed(0) + "%";
      loaderPct.textContent = (p < 10 ? "0" : "") + p.toFixed(0) + "%";
      if (p < 92) setTimeout(step, 110 + Math.random() * 220);
    };
    step();
  }

  const minLoaderTime = reduceMotion ? 300 : 1700;
  const startedAt = performance.now();
  const resolveLoader = () => {
    const elapsed = performance.now() - startedAt;
    setTimeout(dismissLoader, Math.max(0, minLoaderTime - elapsed));
  };
  if (document.readyState === "complete") resolveLoader();
  else window.addEventListener("load", resolveLoader);
  // safety net
  setTimeout(() => { if (loader && !loader.classList.contains("is-done")) dismissLoader(); }, 6000);

  // ───── Year ─────
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // ───── Magnetic hover ─────
  if (window.matchMedia("(hover:hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  // ───── Tilt cards ─────
  if (window.matchMedia("(hover:hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".tilt").forEach((el) => {
      const frame = el.querySelector(".case-frame") || el;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        frame.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
      });
      el.addEventListener("mouseleave", () => { frame.style.transform = ""; });
    });
  }

  // ───── Scroll reveal ─────
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ───── Nav scroll state ─────
  const nav = document.getElementById("nav");
  const setNav = () => {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", setNav, { passive: true });
  setNav();

  // ───── Mobile nav ─────
  const toggle = document.getElementById("navToggle");
  const links  = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.classList.remove("open");
        links.classList.remove("open");
      });
    });
  }

  // ───── Typewriter (rotating noir taglines) ─────
  const target = document.getElementById("typed");
  if (target) {
    const lines = [
      "Software developer. Game maker. Storyteller.",
      "Artist by trade. Dev by profession. Mysterious by choice.",
      "Hamilton, Ontario. Somewhere between code and a case file.",
      "Late grind. Sharp mind. Every line by design."
    ];
    let li = 0, ci = 0, deleting = false;
    const tick = () => {
      const line = lines[li];
      if (!deleting) {
        ci++;
        target.textContent = line.slice(0, ci);
        if (ci === line.length) { deleting = true; setTimeout(tick, 2400); return; }
      } else {
        ci--;
        target.textContent = line.slice(0, ci);
        if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
      }
      setTimeout(tick, deleting ? 22 : 48 + Math.random() * 60);
    };
    setTimeout(tick, 1400);
  }

  // ───── Video hover-play & manual play button ─────
  document.querySelectorAll("[data-video]").forEach((vid) => {
    const wrap = vid.closest(".case-frame");
    if (!wrap) return;
    let manual = false;

    wrap.addEventListener("mouseenter", () => {
      if (!manual) vid.play().catch(() => {});
    });
    wrap.addEventListener("mouseleave", () => {
      if (!manual) { vid.pause(); vid.currentTime = 0; }
    });

    const btn = wrap.querySelector("[data-play]");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (vid.paused) { vid.play().catch(() => {}); manual = true; btn.classList.add("is-playing"); btn.querySelector("span").textContent = "Pause"; }
        else { vid.pause(); manual = false; btn.classList.remove("is-playing"); btn.querySelector("span").textContent = "Play demo"; }
      });
    }

    // pause when offscreen
    const v_io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !vid.paused) {
        vid.pause();
        if (btn) { btn.classList.remove("is-playing"); btn.querySelector("span").textContent = "Play demo"; }
        manual = false;
      }
    }, { threshold: 0.1 });
    v_io.observe(vid);
  });
})();
