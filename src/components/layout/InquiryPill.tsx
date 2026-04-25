"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function InquiryPill() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {expanded && (
        <div className="mb-3 w-72 rounded-lg border border-border bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-terminal">
              Get in Touch
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Have a project in mind? Book a consultation or drop me a line.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="/about#contact"
              className="rounded-md bg-terminal/10 px-3 py-2 text-center font-mono text-xs text-terminal transition-colors hover:bg-terminal/20"
            >
              Contact Form →
            </a>
            <a
              href="/work#consultation"
              className="rounded-md bg-data/10 px-3 py-2 text-center font-mono text-xs text-data transition-colors hover:bg-data/20"
            >
              Book Consultation →
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider shadow-lg transition-all duration-200",
          expanded
            ? "border-terminal/30 bg-terminal/10 text-terminal"
            : "border-border bg-card text-muted-foreground hover:border-terminal/30 hover:text-terminal"
        )}
      >
        <MessageSquare size={14} />
        <span className="hidden sm:inline">Get in Touch</span>
      </button>
    </div>
  );
}
