"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import servicesData from "@/data/services.json";
import { FileTree } from "./FileTree";
import { EditorPane } from "./EditorPane";
import { README_ID, type ServiceFolder } from "./serviceTypes";

const FOLDERS = servicesData as ServiceFolder[];
const TOTAL_FILES = FOLDERS.reduce((n, f) => n + f.items.length, 0);

// Terminal-IDE services explorer. Left rail = file tree of service "folders"
// and "files"; right pane = a faux code editor rendering the selected service's
// spec. Replaces the old restaurant-menu card grid.
export function ServicesExplorer() {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set([0]));
  const [activeId, setActiveId] = useState<string>(README_ID);
  const [mobileView, setMobileView] = useState<"tree" | "editor">("tree");

  function toggle(folderIndex: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(folderIndex)) next.delete(folderIndex);
      else next.add(folderIndex);
      return next;
    });
  }

  function select(id: string) {
    setActiveId(id);
    setMobileView("editor");
  }

  const [fi, ii] = activeId === README_ID ? [-1, -1] : activeId.split(":").map(Number);
  const folder = fi >= 0 ? FOLDERS[fi] : undefined;
  const file = folder ? folder.items[ii] : null;
  const accent = folder?.accent ?? "neutral";

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-card/40 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      {/* window title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[var(--warm)]/70" />
          <span className="h-3 w-3 rounded-full bg-[var(--terminal)]/70" />
          <span className="h-3 w-3 rounded-full bg-[var(--creative)]/70" />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          services@mighty
          <span className="text-muted-foreground/40">:</span>
          <span className="text-[var(--data)]/80">~/photo-booth-owners</span>
        </span>
      </div>

      {/* body: explorer | editor */}
      <div className="grid md:grid-cols-[minmax(230px,300px)_1fr]">
        {/* EXPLORER */}
        <div
          className={cn(
            "border-white/10 md:block md:border-r",
            mobileView === "editor" && "hidden"
          )}
        >
          <div className="border-b border-white/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Explorer
          </div>
          <FileTree
            folders={FOLDERS}
            expanded={expanded}
            activeId={activeId}
            onToggle={toggle}
            onSelect={select}
          />
        </div>

        {/* EDITOR */}
        <div className={cn("md:block", mobileView === "tree" && "hidden")}>
          <EditorPane
            file={file}
            folderName={folder?.group}
            ext={file?.ext}
            accent={accent}
            onBack={() => setMobileView("tree")}
          />
        </div>
      </div>

      {/* status bar */}
      <div className="flex items-center gap-4 border-t border-white/10 bg-white/[0.02] px-4 py-1.5 font-mono text-[10px] text-muted-foreground/60">
        <span className="text-[var(--terminal)]/70">● ready</span>
        <span>UTF-8</span>
        <span>services.json</span>
        <span className="ml-auto tabular-nums">
          {FOLDERS.length} folders · {TOTAL_FILES} files
        </span>
      </div>
    </div>
  );
}
