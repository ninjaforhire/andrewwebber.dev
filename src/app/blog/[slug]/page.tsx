import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="relative z-10 mx-auto max-w-3xl px-8 py-24">
      <Link
        href="/blog"
        className="font-mono text-xs text-muted-foreground transition-colors hover:text-warm"
      >
        ← Back to blog
      </Link>

      <header className="mt-8">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="mt-2 font-heading text-4xl font-bold">{post.title}</h1>
        <p className="mt-2 text-muted-foreground">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-warm/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-warm"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-invert mt-12 max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-p:text-muted-foreground prose-a:text-data prose-a:underline prose-a:decoration-data/30 prose-strong:text-foreground prose-code:rounded prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-terminal prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-card">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
