"use client";

import { cn } from "@/lib/utils";
import { ACCENT_VAR, fileId, type ServiceFolder } from "./serviceTypes";
import { Chevron, FileIcon, GroupIcon } from "./fileIcons";

interface FileTreeProps {
  folders: ServiceFolder[];
  expanded: Set<number>;
  activeId: string;
  onToggle: (folderIndex: number) => void;
  onSelect: (id: string) => void;
}

// Left-rail EXPLORER. Folders (groups) disclose their files (services).
// Keyboard: Up/Down move focus across visible rows, Left/Right collapse or
// expand a focused folder, Enter/Space activate (native <button> behavior).
export function FileTree({ folders, expanded, activeId, onToggle, onSelect }: FileTreeProps) {
  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const key = e.key;
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(key)) return;
    const rows = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-row]")
    );
    const idx = rows.indexOf(document.activeElement as HTMLButtonElement);
    if (key === "ArrowDown" || key === "ArrowUp") {
      e.preventDefault();
      const next = key === "ArrowDown" ? idx + 1 : idx - 1;
      rows[(next + rows.length) % rows.length]?.focus();
      return;
    }
    // Right/Left only act on folder rows.
    const el = rows[idx];
    if (!el || el.dataset.type !== "folder") return;
    const fi = Number(el.dataset.folder);
    const isOpen = expanded.has(fi);
    if (key === "ArrowRight" && !isOpen) {
      e.preventDefault();
      onToggle(fi);
    } else if (key === "ArrowLeft" && isOpen) {
      e.preventDefault();
      onToggle(fi);
    }
  }

  return (
    <div
      role="tree"
      aria-label="Services"
      onKeyDown={handleKey}
      className="py-2 font-mono text-[13px] leading-none"
    >
      {folders.map((folder, fi) => {
        const open = expanded.has(fi);
        const color = ACCENT_VAR[folder.accent];
        return (
          <div key={folder.key} role="treeitem" aria-expanded={open} aria-selected={false}>
            <button
              data-row
              data-type="folder"
              data-folder={fi}
              onClick={() => onToggle(fi)}
              className="group flex w-full items-center gap-1.5 px-3 py-2 text-left transition-colors hover:bg-white/[0.04] focus:bg-white/[0.06] focus:outline-none"
            >
              <Chevron
                className={cn(
                  "text-muted-foreground transition-transform duration-200",
                  open && "rotate-90"
                )}
              />
              <span style={{ color }} className="flex items-center">
                <GroupIcon groupKey={folder.key} />
              </span>
              <span className="ml-1 truncate font-medium" style={{ color }}>
                {folder.folder}
              </span>
              <span className="ml-auto tabular-nums text-[11px] text-muted-foreground">
                {folder.items.length}
              </span>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <ul role="group">
                  {folder.items.map((item, ii) => {
                    const id = fileId(fi, ii);
                    const active = id === activeId;
                    return (
                      <li key={item.slug} role="none">
                        <button
                          data-row
                          data-type="file"
                          role="treeitem"
                          aria-selected={active}
                          onClick={() => onSelect(id)}
                          className={cn(
                            "relative flex w-full items-center gap-2 py-1.5 pl-9 pr-3 text-left transition-colors focus:outline-none",
                            active
                              ? "bg-white/[0.06] text-foreground"
                              : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground focus:bg-white/[0.05]"
                          )}
                        >
                          {active && (
                            <span
                              className="absolute inset-y-0 left-0 w-[2px]"
                              style={{ background: color }}
                            />
                          )}
                          <FileIcon className="text-muted-foreground/70" />
                          <span className="truncate">
                            {item.slug}
                            <span className="text-muted-foreground/50">.{item.ext}</span>
                          </span>
                          {item.price && (
                            <span
                              className="ml-auto shrink-0 tabular-nums text-[11px]"
                              style={{ color }}
                            >
                              {item.price.replace(/ rush$/i, "")}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
