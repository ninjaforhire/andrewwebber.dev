"use client";

import { ACCENT_VAR, README_ID, type AccentKey, type ServiceFile } from "./serviceTypes";

interface EditorPaneProps {
  file: ServiceFile | null; // null → README
  folderName?: string;
  ext?: string;
  accent: AccentKey;
  onBack?: () => void; // mobile: return to tree
}

// A single "logical line" in the faux editor. Description prose is split into
// sentences so it reads like a multi-line source file instead of one blob.
type Line =
  | { kind: "comment"; text: string }
  | { kind: "key"; k: string; v: string }
  | { kind: "blank" }
  | { kind: "text"; text: string };

function splitSentences(s: string): string[] {
  return s
    .split(/(?<=[.!?])\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildLines(file: ServiceFile | null, folderName?: string): Line[] {
  if (!file) {
    return [
      { kind: "comment", text: "README.md" },
      { kind: "blank" },
      { kind: "text", text: "Services for hire, built by a 10-year photo booth operator." },
      { kind: "blank" },
      { kind: "text", text: "Browse the tree on the left. Every file is a real service" },
      { kind: "text", text: "with honest pricing. Open one to read its spec." },
      { kind: "blank" },
      { kind: "text", text: "Not listed? Ask." },
    ];
  }
  const lines: Line[] = [{ kind: "comment", text: file.name }];
  if (file.price) lines.push({ kind: "key", k: "price", v: file.price });
  if (folderName) lines.push({ kind: "key", k: "group", v: folderName });
  lines.push({ kind: "blank" });
  for (const sentence of splitSentences(file.description)) {
    lines.push({ kind: "text", text: sentence });
  }
  return lines;
}

export function EditorPane({ file, folderName, ext, accent, onBack }: EditorPaneProps) {
  const color = ACCENT_VAR[accent];
  const lines = buildLines(file, folderName);
  const tabName = file ? `${file.slug}.${ext ?? "txt"}` : "README.md";
  const cta = file ? file.slug : "custom";

  return (
    <div className="flex min-h-[420px] flex-col">
      {/* tab bar */}
      <div className="flex items-center border-b border-white/5 bg-white/[0.015]">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 border-r border-white/5 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            ‹ tree
          </button>
        )}
        <div className="flex items-center gap-2 border-r border-white/5 px-4 py-2 font-mono text-xs">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          <span className="text-foreground">{tabName}</span>
        </div>
      </div>

      {/* file body: gutter + content */}
      <div
        aria-live="polite"
        className="flex flex-1 overflow-x-auto font-mono text-[13px] leading-[1.9]"
      >
        <div
          aria-hidden
          className="select-none border-r border-white/5 py-4 pl-4 pr-3 text-right tabular-nums text-muted-foreground/40"
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <div className="min-w-0 flex-1 py-4 pl-4 pr-6">
          {lines.map((line, i) => {
            if (line.kind === "blank") return <div key={i}>&nbsp;</div>;
            if (line.kind === "comment")
              return (
                <div key={i}>
                  <span className="text-muted-foreground/60"># </span>
                  <span className="font-heading text-base font-bold text-foreground">
                    {line.text}
                  </span>
                </div>
              );
            if (line.kind === "key")
              return (
                <div key={i} className="whitespace-pre-wrap">
                  <span style={{ color }}>{line.k}</span>
                  <span className="text-muted-foreground/60">: </span>
                  <span className="text-foreground">{line.v}</span>
                </div>
              );
            return (
              <div key={i} className="whitespace-pre-wrap text-muted-foreground">
                {line.text}
              </div>
            );
          })}

          {/* CTA prompt */}
          <div className="mt-8 border-t border-white/5 pt-5">
            <a
              href="#inquiry"
              className="group inline-flex items-center gap-2 rounded-md border px-4 py-2.5 font-mono text-[13px] transition-colors"
              style={{ borderColor: color, color }}
            >
              <span className="text-muted-foreground/60">$</span>
              request --service {cta}
              <span className="translate-x-0 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export { README_ID };
