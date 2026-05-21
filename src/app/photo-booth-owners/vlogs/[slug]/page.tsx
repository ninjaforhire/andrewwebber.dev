import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllVlogs, getVlogBySlug } from "@/lib/vlogs";
import { MDXRemote } from "next-mdx-remote/rsc";
import { SupercutEmbed } from "@/components/photo-booth-owners/SupercutEmbed";
import { YouTubeEmbed } from "@/components/photo-booth-owners/YouTubeEmbed";

export function generateStaticParams() {
  return getAllVlogs().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getVlogBySlug(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt };
}

const MDX_COMPONENTS = {
  SupercutEmbed,
  YouTubeEmbed,
};

export default async function VlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getVlogBySlug(slug);
  if (!post) notFound();

  return (
    <article className="page-x py-16 md:py-32 max-w-4xl">
      <Link
        href="/photo-booth-owners/vlogs"
        className="font-mono text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:text-data"
      >
        ← Back to deep dives
      </Link>

      <header className="mt-12">
        <div className="flex items-center gap-3 font-mono text-xs font-medium tracking-[0.3em] uppercase text-data">
          <span>{post.published_at}</span>
          <span className="text-muted-foreground">·</span>
          <span>{post.readingTime}</span>
          {(post.supercut_url || post.youtube_id) && (
            <>
              <span className="text-muted-foreground">·</span>
              <span>▶ recording</span>
            </>
          )}
        </div>
        <h1 className="crop font-extrabold text-[clamp(40px,7vw,96px)] leading-[0.95] mt-4">
          {post.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mt-6 leading-snug">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-data/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-data"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {post.supercut_url && <SupercutEmbed url={post.supercut_url} title={post.title} />}
      {post.youtube_id && <YouTubeEmbed videoId={post.youtube_id} title={post.title} />}

      <div className="prose prose-invert mt-12 md:mt-16 max-w-none prose-headings:font-sans prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 md:prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-xl md:prose-h3:text-2xl prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-data prose-a:underline prose-a:decoration-data/30 prose-strong:text-foreground prose-code:rounded prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-terminal prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-card prose-pre:overflow-x-auto">
        <MDXRemote source={post.content} components={MDX_COMPONENTS} />
      </div>
    </article>
  );
}
