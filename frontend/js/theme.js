const THEME_KEY = "courseswap-theme";
const DEFAULT_THEME = "dark";

const getStoredTheme = () => {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === "light" || theme === "dark" ? theme : DEFAULT_THEME;
};

const updateThemeButtons = (theme) => {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const isDark = theme === "dark";
    button.textContent = isDark ? "Modo claro" : "Modo oscuro";
    button.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    button.setAttribute("aria-pressed", String(isDark));
  });
};

export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeButtons(theme);
};

export const initTheme = () => {
  applyTheme(getStoredTheme());

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-bs-theme");
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  });
};
