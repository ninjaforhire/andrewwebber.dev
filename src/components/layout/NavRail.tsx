"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Volume2, VolumeOff, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "HOME", href: "/", accent: "terminal" },
  { label: "PROJECTS", href: "/work", accent: "data" },
  { label: "DOSSIER", href: "/about", accent: "creative" },
  { label: "FIELD NOTES", href: "/blog", accent: "warm" },
] as const;

const ACCENT_COLORS: Record<string, string> = {
  terminal: "text-terminal",
  data: "text-data",
  creative: "text-creative",
  warm: "text-warm",
};

export function NavRail() {
  const pathname = usePathname();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedSound = localStorage.getItem("sound");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    if (savedSound === "true") setSoundEnabled(true);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("sound", String(next));
  }

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-full w-16 flex-col items-center justify-between border-r border-border bg-background/80 py-8 backdrop-blur-md">
      {/* Nav items */}
      <div className="flex flex-col items-center gap-6">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative font-mono text-[10px] font-medium uppercase tracking-[0.25em] transition-colors duration-200",
                "[writing-mode:vertical-rl] rotate-180",
                isActive
                  ? ACCENT_COLORS[item.accent]
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {isActive && (
                <span
                  className={cn(
                    "absolute -right-[1.45rem] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full",
                    item.accent === "terminal" && "bg-terminal",
                    item.accent === "data" && "bg-data",
                    item.accent === "creative" && "bg-creative",
                    item.accent === "warm" && "bg-warm"
                  )}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={toggleSound}
          className="text-muted-foreground transition-colors hover:text-terminal"
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeOff size={14} />}
        </button>
        <button
          onClick={toggleTheme}
          className="text-muted-foreground transition-colors hover:text-warm"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </nav>
  );
}
