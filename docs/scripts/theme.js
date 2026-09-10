// Keep the page colors, button state and browser theme color in sync.
export function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.title =
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor)
      themeColor.content = theme === "dark" ? "#171816" : "#f0ece3";
  }
  // The small script in index.html has already restored a saved choice before first paint.
  applyTheme(
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  // Apply immediately, then remember the choice for the next visit when storage is allowed.
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
