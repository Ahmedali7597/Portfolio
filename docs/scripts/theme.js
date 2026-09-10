export function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.title =
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    document.querySelector('meta[name="theme-color"]').content =
      theme === "dark" ? "#171816" : "#f0ece3";
  }
  applyTheme(
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  themeToggle.addEventListener("click", () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // The current choice still works when browser storage is unavailable.
    }
  });
  themeToggle.hidden = false;
}
