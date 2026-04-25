import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind the code. Andrew Webber — Fort Worth, TX.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-creative">
        $ cat about.txt
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold">About</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Story + Education + Contact — coming soon
      </p>
    </div>
  );
}
