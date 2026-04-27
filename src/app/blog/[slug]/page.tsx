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
    <article className="px-12 sm:px-16 md:px-24 py-24 md:py-32 max-w-4xl">
      <Link
        href="/blog"
        className="font-mono text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:text-warm"
      >
        ← Back to writing
      </Link>

      <header className="mt-12">
        <div className="flex items-center gap-3 font-mono text-xs font-medium tracking-[0.3em] uppercase text-warm">
          <span>{post.date}</span>
          <span className="text-muted-foreground">·</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="crop font-extrabold text-[clamp(48px,7vw,96px)] leading-[0.95] mt-4">
          {post.title}
        </h1>
        <p className="text-2xl text-muted-foreground mt-6 leading-snug">{post.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-warm/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-warm"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-invert mt-16 max-w-none prose-headings:font-sans prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-2xl prose-p:text-xl prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-data prose-a:underline prose-a:decoration-data/30 prose-strong:text-foreground prose-code:rounded prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-terminal prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-card">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
