import Link from "next/link";
import { cn } from "@/lib/utils";
import type { VlogPost } from "@/lib/vlogs";

const TAG_ACCENTS: Record<string, string> = {
  AI: "bg-terminal/10 text-terminal",
  Automation: "bg-warm/10 text-warm",
  Ops: "bg-terminal/10 text-terminal",
  SEO: "bg-data/10 text-data",
  Marketing: "bg-warm/10 text-warm",
  Strategy: "bg-creative/10 text-creative",
  Security: "bg-creative/10 text-creative",
  Design: "bg-creative/10 text-creative",
};

export function VlogCard({ post }: { post: VlogPost }) {
  const hasMedia = post.supercut_url || post.youtube_id;

  return (
    <Link
      href={`/photo-booth-owners/vlogs/${post.slug}`}
      className="group block rounded-lg border border-border bg-card/30 p-5 transition-all duration-300 hover:border-data/30 hover:glow-data"
    >
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{post.published_at}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
        {hasMedia && (
          <>
            <span>·</span>
            <span className="text-data">▶ recording</span>
          </>
        )}
      </div>
      <h3 className="mt-2 font-heading text-lg font-bold leading-snug transition-colors group-hover:text-data">
        {post.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
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
