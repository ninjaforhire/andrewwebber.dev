"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeOff, Sun, Moon } from "lucide-react";

export function MobileTopBar() {
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
    // Same-tab listener (storage event only fires for OTHER tabs).
    window.dispatchEvent(new Event("sound-toggle"));
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
        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          className="flex h-9 w-9 items-center justify-center text-muted-foreground active:text-terminal"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeOff size={16} />}
        </button>
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
