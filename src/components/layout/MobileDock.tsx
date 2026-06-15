"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Briefcase, Handshake, Compass, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", href: "/", icon: Home, accent: "terminal" },
  { label: "Work", href: "/work", icon: Briefcase, accent: "data" },
  { label: "Engage", href: "/engagements", icon: Handshake, accent: "warm" },
  { label: "Journey", href: "/journey", icon: Compass, accent: "creative" },
  { label: "Notes", href: "/blog", icon: FileText, accent: "warm" },
  { label: "About", href: "/about", icon: User, accent: "terminal" },
] as const;

const DOT: Record<string, string> = {
  terminal: "bg-terminal shadow-[0_0_10px_rgba(0,255,65,0.7)]",
  data: "bg-data shadow-[0_0_10px_rgba(0,229,255,0.7)]",
  creative: "bg-creative shadow-[0_0_10px_rgba(180,74,255,0.7)]",
  warm: "bg-warm shadow-[0_0_10px_rgba(255,176,0,0.7)]",
};

const TEXT: Record<string, string> = {
  terminal: "text-terminal",
  data: "text-data",
  creative: "text-creative",
  warm: "text-warm",
};

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#222233] bg-[#0f0f1a]/85 backdrop-blur-xl safe-bottom md:hidden"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-6">
        {ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex justify-center">
              <motion.div whileTap={{ scale: 0.92 }} className="w-full">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 touch-target py-2",
                    isActive
                      ? TEXT[item.accent]
                      : "text-muted-foreground active:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 h-1 w-1 rounded-full transition-opacity",
                      isActive ? DOT[item.accent] : "opacity-0"
                    )}
                    aria-hidden
                  />
                  <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
