import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { blogMDXComponents } from "@/components/blog/MDXComponents";
import { Comments } from "@/components/blog/Comments";
import { LikeButton } from "@/components/blog/LikeButton";

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
    <article className="page-x py-16 md:py-32 max-w-4xl">
      <Link
        href="/blog"
        className="font-mono text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:text-warm"
      >
        ← Back to field notes
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
        <p className="text-xl md:text-2xl text-muted-foreground mt-6 leading-snug">{post.description}</p>
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

      <div className="mt-12 md:mt-16 max-w-none">
        <MDXRemote source={post.content} components={blogMDXComponents} />
      </div>

      <div className="mt-16 md:mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          If this hit, tap the heart.
        </p>
        <LikeButton slug={slug} />
      </div>

      <Comments />
    </article>
  );
}
