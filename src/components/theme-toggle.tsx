"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("theme-change", callback);

  return () => {
    window.removeEventListener("theme-change", callback);
  };
};

const getSnapshot = () => {
  return localStorage.getItem("theme") === "dark";
};

const getServerSnapshot = () => {
  return false;
};

export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function toggleTheme() {
    const newIsDark = !isDark;

    document.documentElement.classList.toggle("dark", newIsDark);

    localStorage.setItem("theme", newIsDark ? "dark" : "light");

    window.dispatchEvent(new Event("theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {isDark ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  );
}