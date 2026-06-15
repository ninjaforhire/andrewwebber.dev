"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { SoundPicker } from "@/components/animation/SoundPicker";

export function MobileTopBar() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
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

  return (
    <header
      className="sticky top-0 z-40 flex h-11 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:hidden"
      aria-label="Mobile header"
    >
      <Link
        href="/"
        className="font-mono text-sm font-semibold tracking-[0.2em] text-foreground active:text-terminal"
        aria-label="Andrew Webber — Home"
      >
        AW<span className="text-terminal">_</span>
      </Link>
      <div className="flex items-center gap-1">
        <SoundPicker iconSize={16} align="right" />
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-9 w-9 items-center justify-center text-muted-foreground active:text-warm"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
