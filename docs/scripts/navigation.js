// Enhance the mobile menu while keeping ordinary section links usable without JavaScript.
export function initNavigation() {
  const navigation = document.querySelector(".navigation");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!navigation || !menuToggle || !navLinks) return;
  const mobile = window.matchMedia("(max-width: 760px)");

  // Visual state and the screen-reader announcement always change together.
  function setMenu(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "Close −" : "Menu +";
    navLinks.classList.toggle("is-open", open);
  }

  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  // Escape returns focus to the button; clicking or tabbing away simply closes the menu.
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
  // A resize can hide the focused control, so move focus to a visible navigation item.
  mobile.addEventListener("change", () => {
    const linksHadFocus = navLinks.contains(document.activeElement);
    const toggleHadFocus = document.activeElement === menuToggle;
    setMenu(false);
    if (mobile.matches && linksHadFocus) menuToggle.focus();
    if (!mobile.matches && toggleHadFocus) navLinks.querySelector("a")?.focus();
  });
  // Only collapse mobile links after all menu controls are ready.
  navigation.dataset.enhanced = "true";
  menuToggle.hidden = false;

  // Preserve incoming project links by opening the story before the browser scrolls.
  function openStory(id) {
    const target = document.getElementById(id);
    if (target?.matches("details.case")) target.open = true;
    return target;
  }

  // Selecting a mobile link closes the menu and transfers keyboard focus to its destination.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const target = openStory(link.hash.slice(1));
      if (navLinks.contains(link) && mobile.matches) {
        setMenu(false);
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }
    });
  });
  // Also handle incoming bookmarks and the browser Back/Forward buttons.
  window.addEventListener("hashchange", () =>
    openStory(location.hash.slice(1)),
  );
  openStory(location.hash.slice(1));
}
