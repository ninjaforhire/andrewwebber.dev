import { VlogCard } from "./VlogCard";
import type { VlogPost } from "@/lib/vlogs";

export function VlogIndex({ posts }: { posts: VlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-mono text-sm text-muted-foreground">$ echo &quot;first recording coming soon&quot;</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {posts.map((post) => (
        <VlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
