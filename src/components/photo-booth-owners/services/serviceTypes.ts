// Shared types + accent tokens for the terminal-IDE services explorer.
// Accents resolve to the same CSS custom properties the rest of the site uses
// (globals.css), so light/dark themes stay in lockstep without extra config.

export type AccentKey = "terminal" | "data" | "creative" | "warm" | "neutral";

export interface ServiceFile {
  name: string;
  slug: string;
  ext: string;
  price?: string;
  description: string;
}

export interface ServiceFolder {
  group: string;
  key: string;
  folder: string;
  accent: AccentKey;
  description: string;
  items: ServiceFile[];
}

// CSS-variable per accent. Used inline (style={{ color: ACCENT_VAR[a] }}) so
// Tailwind's purge never strips a dynamically-built class.
export const ACCENT_VAR: Record<AccentKey, string> = {
  terminal: "var(--terminal)",
  data: "var(--data)",
  creative: "var(--creative)",
  warm: "var(--warm)",
  neutral: "var(--foreground)",
};

// The synthetic README tab shown before the visitor opens any real file.
export const README_ID = "__readme__";

export function fileId(folderIndex: number, itemIndex: number): string {
  return `${folderIndex}:${itemIndex}`;
}
