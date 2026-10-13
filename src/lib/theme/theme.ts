export type ThemeMode = "light" | "dark";

/** localStorage key. Read by the pre-paint bootstrap script in the root layout. */
export const THEME_STORAGE_KEY = "kaisora-theme";

/** Dark is the brand's home; light is the same system inverted. */
export const DEFAULT_THEME: ThemeMode = "dark";

/** Apply a theme to <html>. Client only. Every token follows from data-theme. */
export function applyTheme(mode: ThemeMode): void {
  document.documentElement.dataset.theme = mode;
}

/** Narrows an arbitrary stored string to a theme mode. */
export function parseMode(raw: string | null): ThemeMode {
  return raw === "dark" || raw === "light" ? raw : DEFAULT_THEME;
}
