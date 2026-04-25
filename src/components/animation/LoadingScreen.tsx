"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const BOOT_LINES = [
  { text: "Loading environment...", delay: 200 },
  { text: "Setting up WebGL context...", delay: 400 },
  { text: "Compiling shaders...", delay: 300 },
  { text: "Mounting portfolio...", delay: 500 },
  { text: "> Almost there...", delay: 600 },
];

const WELCOME_LINES = [
  { label: "NAME", value: "Andrew Webber" },
  { label: "ROLE", value: "Builder / Automation Architect" },
  { label: "FIELD", value: "AI Agents / Creative Code / Security" },
  { label: "LINK", value: "andrewwebber.dev" },
  { label: "FROM", value: "Fort Worth, TX" },
];

export function LoadingScreen() {
  const [phase, setPhase] = useState<"boot" | "welcome" | "transition" | "done">("boot");
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [welcomeLines, setWelcomeLines] = useState(0);
  const [glitching, setGlitching] = useState(false);

  const finishLoading = useCallback(() => {
    setGlitching(true);
    setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("loaded", "true");
    }, 500);
  }, []);

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem("loaded") === "true") {
      setPhase("done");
    }
  }, []);

  // Boot sequence
  useEffect(() => {
    if (phase !== "boot") return;

    let totalDelay = 0;
    BOOT_LINES.forEach((line, i) => {
      totalDelay += line.delay;
      setTimeout(() => {
        setVisibleLines(i + 1);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, totalDelay);
    });

    setTimeout(() => setPhase("welcome"), totalDelay + 400);
  }, [phase]);

  // Welcome sequence
  useEffect(() => {
    if (phase !== "welcome") return;

    WELCOME_LINES.forEach((_, i) => {
      setTimeout(() => setWelcomeLines(i + 1), (i + 1) * 150);
    });

    setTimeout(() => {
      setPhase("transition");
      finishLoading();
    }, WELCOME_LINES.length * 150 + 1200);
  }, [phase, finishLoading]);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-start bg-background p-8 font-mono text-sm transition-opacity duration-300",
        glitching && "animate-glitch opacity-0"
      )}
    >
      <div className="w-full max-w-xl">
        {/* Boot phase */}
        {(phase === "boot" || phase === "welcome" || phase === "transition") && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              LOADING
            </p>
            <div className="mb-4 h-px w-48 bg-border" />

            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <p
                key={i}
                className={cn(
                  "leading-relaxed",
                  i === visibleLines - 1 ? "text-data" : "text-muted-foreground"
                )}
              >
                {line.text}
              </p>
            ))}

            {visibleLines > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Assets : <span className="text-terminal">{progress}%</span>
                </p>
                <div className="mt-1 h-1 w-48 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-terminal to-data transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Welcome phase */}
        {(phase === "welcome" || phase === "transition") && (
          <div className="mt-8">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              WELCOME
            </p>
            <div className="mb-4 h-px w-48 bg-border" />

            {WELCOME_LINES.slice(0, welcomeLines).map((line, i) => (
              <p key={i} className="leading-relaxed">
                <span className="inline-block w-16 text-muted-foreground">
                  {line.label}
                </span>
                <span className="text-muted-foreground"> : </span>
                <span
                  className={cn(
                    line.label === "LINK" ? "text-data" : "text-foreground"
                  )}
                >
                  {line.value}
                </span>
              </p>
            ))}

            {phase === "transition" && (
              <div className="mt-6">
                <p className="text-creative">Transitioning to scene...</p>
                <p className="mt-1 animate-pulse text-terminal">█</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
