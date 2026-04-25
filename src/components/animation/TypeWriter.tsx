"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypeWriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  cursor?: boolean;
}

export function TypeWriter({
  text,
  className,
  speed = 50,
  delay = 0,
  onComplete,
  cursor = true,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setTimeout(() => setStarted(true), delay);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, started]);

  useEffect(() => {
    if (!started || done) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, done, onComplete]);

  return (
    <span ref={ref} className={cn("", className)}>
      {displayed}
      {cursor && !done && <span className="animate-pulse text-terminal">█</span>}
      {cursor && done && <span className="text-terminal/30">█</span>}
    </span>
  );
}
