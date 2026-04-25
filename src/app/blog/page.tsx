import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on AI, creative coding, security, and automation.",
};

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm">
        $ tail -f blog.log
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold">Blog</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Posts about AI, security, creative code — coming soon
      </p>
    </div>
  );
}
