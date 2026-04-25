import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/sections/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on AI, creative coding, security, and automation.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-8 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm">
        $ tail -f blog.log
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Thoughts on AI, creative coding, security, and automation.
      </p>

      {posts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            $ echo &quot;no posts yet&quot;
          </p>
          <p className="mt-2 text-muted-foreground">First post coming soon.</p>
        </div>
      ) : (
        <div className="mt-12 space-y-4">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
