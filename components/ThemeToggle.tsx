"use client";

import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Both icons render, and CSS shows the one for the active theme, so the first paint is already right.
export default function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <Moon className="icon-moon" size={17} strokeWidth={1.75} aria-hidden="true" />
      <Sun className="icon-sun" size={17} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
