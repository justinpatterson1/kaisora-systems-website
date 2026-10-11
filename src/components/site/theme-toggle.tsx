"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "@/lib/theme/theme-provider";

/** Light/dark switch. The label names the state it switches to. */
export function ThemeToggle() {
  const { mode, ready, toggleMode } = useTheme();
  const next = mode === "dark" ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="theme-toggle"
      aria-label={ready ? `Switch to ${next.toLowerCase()} mode` : "Switch theme"}
    >
      {mode === "dark" ? <SunIcon /> : <MoonIcon />}
      {ready ? `${next} mode` : "Theme"}
    </button>
  );
}
