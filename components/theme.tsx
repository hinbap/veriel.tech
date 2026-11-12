"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Moon, Sun } from "@/components/icons";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

function readTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const syncStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      document.documentElement.classList.toggle("light", event.newValue === "light");
    }
  };
  window.addEventListener("storage", syncStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", syncStorage);
  };
}

/** Keep React in sync with the theme applied before paint, including other tabs. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, (): Theme => "dark");

  useLayoutEffect(() => {
    try {
      document.documentElement.classList.toggle("light", localStorage.getItem(THEME_STORAGE_KEY) === "light");
    } catch {
      // Keep the current theme when storage is unavailable.
    }
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("light", next === "light");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The toggle still works for this visit when storage is unavailable.
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle({ className }: { className?: string }) {
  const { toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between dark and light mode"
      className={cn(
        "flex cursor-pointer items-center justify-center text-muted transition-colors hover:bg-raised hover:text-ink",
        className,
      )}
    >
      <Sun size={20} className="light:hidden" />
      <Moon size={20} className="hidden light:block" />
    </button>
  );
}
