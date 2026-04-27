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
    <div className="px-12 sm:px-16 md:px-24 py-24 md:py-32">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-6">
        § 01 — Writing
      </div>
      <h1 className="crop font-extrabold text-[clamp(56px,10vw,140px)] leading-[0.88]">
        Thoughts &<br />
        <span className="text-warm">field notes</span>.
      </h1>
      <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mt-8">
        Notes from the workbench. AI, creative coding, security, automation.
      </p>

      {posts.length === 0 ? (
        <div className="mt-24 text-center">
          <p className="font-mono text-sm text-muted-foreground">$ echo &quot;no posts yet&quot;</p>
          <p className="mt-2 text-muted-foreground">First post coming soon.</p>
        </div>
      ) : (
        <div className="mt-16 space-y-4 max-w-4xl">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
