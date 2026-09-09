// Ahmed Ali — portfolio interactions.
(() => {
  "use strict";

  // Enhance the menu only after its controls and handlers are ready.
  const navigation = document.querySelector(".navigation");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (navigation && toggle && links) {
    const menuLabel = toggle.querySelector("[data-menu-label]");
    const menuSymbol = toggle.querySelector(".menu-symbol");
    const mobile = window.matchMedia("(max-width: 760px)");

    function setMenu(open) {
      toggle.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
      menuLabel.textContent = open ? "Close" : "Menu";
      menuSymbol.textContent = open ? "−" : "+";
    }

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    links.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link || !mobile.matches) return;

      setMenu(false);
      const destination = document.querySelector(link.getAttribute("href"));
      if (destination) {
        destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target)) setMenu(false);
    });

    navigation.addEventListener("focusout", (event) => {
      if (!navigation.contains(event.relatedTarget)) setMenu(false);
    });

    mobile.addEventListener("change", () => {
      const menuHadFocus = links.contains(document.activeElement);
      const toggleHadFocus = document.activeElement === toggle;
      setMenu(false);
      if (mobile.matches && menuHadFocus) toggle.focus();
      if (!mobile.matches && toggleHadFocus) links.querySelector("a").focus();
    });

    navigation.dataset.enhanced = "true";
    toggle.hidden = false;
  }

  // Native controls handle playback, volume and fullscreen without JavaScript.
  const videos = Array.from(document.querySelectorAll("[data-video]"));
  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== video) other.pause();
      });
    });

    function showVideoError() {
      const status = video.closest("figure").querySelector(".video-status");
      if (status) status.hidden = false;
    }

    video.addEventListener("error", showVideoError);
    video.querySelectorAll("source").forEach((source) => {
      source.addEventListener("error", showVideoError);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) entry.target.pause();
        });
      },
      { threshold: 0 },
    );
    videos.forEach((video) => observer.observe(video));
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach((video) => video.pause());
  });

  const year = document.getElementById("yr");
  if (year) year.textContent = new Date().getFullYear();
})();
