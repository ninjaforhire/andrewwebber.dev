import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects, tools, and consultation services.",
};

export default function WorkPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-data">
        $ ls ~/projects
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold">Work</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Projects + Services — coming soon
      </p>
    </div>
  );
}
