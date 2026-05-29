import React from "react";

/**
 * Renders a takeaway with cohesive formatting:
 *   - **bold**           -> <strong> (use for stats + arrows only — not for emphasis)
 *   - `path/like/this`   -> file path style (light blue)
 *   - `othercode`        -> generic code (terminal green)
 *   - [label](url)       -> green link
 *   - paragraph breaks on double newline
 *   - first paragraph styled as a punchy lead
 */
function isFilePath(s: string): boolean {
  // Heuristic: looks like a path or filename.
  if (s.includes("/")) return true;
  if (/\.(tsx?|jsx?|json|md|py|css|scss|svg|png|jpg|sql|toml|yml|yaml|sh|env)$/.test(s)) return true;
  return false;
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Markdown link · backtick code · bold
  const re = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const token = m[0];
    if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = /^https?:\/\//.test(href);
        nodes.push(
          <a
            key={`${keyPrefix}-l-${i++}`}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-terminal underline decoration-terminal/30 transition-colors hover:text-terminal/80 hover:decoration-terminal/60"
          >
            {label}
          </a>,
        );
      }
    } else if (token.startsWith("`")) {
      const inner = token.slice(1, -1);
      const cls = isFilePath(inner)
        ? "rounded bg-data/10 px-1 py-0.5 font-mono text-[0.85em] text-data"
        : "rounded bg-white/5 px-1 py-0.5 font-mono text-[0.85em] text-muted-foreground";
      nodes.push(
        <code key={`${keyPrefix}-c-${i++}`} className={cls}>
          {inner}
        </code>,
      );
    } else {
      nodes.push(
        <strong
          key={`${keyPrefix}-b-${i++}`}
          className="font-bold text-foreground"
        >
          {token.slice(2, -2)}
        </strong>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function FormattedTakeaway({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
      {paragraphs.map((para, idx) => (
        <p
          key={idx}
          className={
            idx === 0
              ? "text-[15px] leading-relaxed text-foreground/90"
              : "text-sm leading-relaxed text-muted-foreground"
          }
        >
          {renderInline(para, `p${idx}`)}
        </p>
      ))}
    </div>
  );
}
