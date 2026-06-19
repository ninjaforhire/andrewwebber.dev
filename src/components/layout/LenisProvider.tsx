"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
// Required Lenis stylesheet. Without it, `html.lenis { height: auto }` never
// applies, so the layout's `h-full` (height:100%) on <html> caps the scroll
// area at one viewport and the wheel/trackpad can't reach the bottom of the
// page (native scrollTo still works, which masked the bug).
import "lenis/dist/lenis.css";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
