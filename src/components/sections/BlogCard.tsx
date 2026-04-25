import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

const TAG_ACCENTS: Record<string, string> = {
  AI: "bg-terminal/10 text-terminal",
  Security: "bg-creative/10 text-creative",
  "Creative Code": "bg-data/10 text-data",
  Automation: "bg-warm/10 text-warm",
  "Photo Booths": "bg-creative/10 text-creative",
};

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-lg border border-border bg-card/30 p-5 transition-all duration-300 hover:border-warm/30 hover:glow-warm"
    >
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 className="mt-2 font-heading text-lg font-bold transition-colors group-hover:text-warm">
        {post.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
              TAG_ACCENTS[tag] ?? "bg-muted text-muted-foreground"
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
