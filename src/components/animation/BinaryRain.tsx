"use client";

import { useEffect, useRef } from "react";

const CHARS = "01";
const COLORS = ["#00ff41", "#00e5ff", "#b44aff"];

export function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const fontSize = 14;
    let columns: number;
    let drops: number[];
    let columnColors: string[];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      columns = Math.floor(canvas!.width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.random() * canvas!.height / fontSize
      );
      columnColors = Array.from(
        { length: columns },
        () => COLORS[Math.floor(Math.random() * COLORS.length)]
      );
    }

    function draw() {
      if (scrollingRef.current) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx!.fillStyle = "rgba(15, 15, 26, 0.08)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx!.fillStyle = columnColors[i];
        ctx!.globalAlpha = 0.04 + Math.random() * 0.03;
        ctx!.fillText(char, x, y);
        ctx!.globalAlpha = 1;

        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
          columnColors[i] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }

      animationId = requestAnimationFrame(draw);
    }

    function handleScroll() {
      scrollingRef.current = true;
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        scrollingRef.current = false;
      }, 150);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
