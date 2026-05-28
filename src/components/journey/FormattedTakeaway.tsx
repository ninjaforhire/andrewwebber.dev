import React from "react";

/**
 * Renders a takeaway with light markdown:
 *   - **bold** -> <strong>
 *   - `code` -> <code>
 *   - paragraph breaks on double newline (\n\n)
 *   - first paragraph styled as a punchy lead (larger, brighter)
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i++}`}
          className="rounded bg-white/5 px-1 py-0.5 font-mono text-[0.85em] text-terminal"
        >
          {token.slice(1, -1)}
        </code>
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
