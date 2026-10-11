"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { readPreference, subscribe, writePreference } from "./preferences";
import { THEME_STORAGE_KEY, applyTheme, parseMode, type ThemeMode } from "./theme";

type ThemeContextValue = {
  mode: ThemeMode;
  /** False during SSR and the hydration render, when the default is showing. */
  ready: boolean;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Exposes the theme and mirrors it onto <html>.
 *
 * The pre-paint script in the root layout owns the first frame; this provider
 * owns changes after hydration. State is read straight out of localStorage, so
 * React's idea of the theme and the stored one can never disagree.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const mode = parseMode(
    useSyncExternalStore(
      subscribe,
      () => readPreference(THEME_STORAGE_KEY),
      () => null,
    ),
  );

  /* Skipped until hydration so the default can't overwrite what the
     bootstrap correctly applied pre-paint. */
  useEffect(() => {
    if (ready) applyTheme(mode);
  }, [ready, mode]);

  const toggleMode = useCallback(() => {
    const current = parseMode(readPreference(THEME_STORAGE_KEY));
    writePreference(THEME_STORAGE_KEY, current === "dark" ? "light" : "dark");
  }, []);

  const value = useMemo(() => ({ mode, ready, toggleMode }), [mode, ready, toggleMode]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

/** Throws outside the provider — a silent default would mean a dead toggle. */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return value;
}
