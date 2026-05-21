import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface VlogPost {
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  supercut_url?: string;
  youtube_id?: string;
  tags: string[];
  readingTime: string;
  content: string;
}

const VLOGS_DIR = path.join(process.cwd(), "src/content/photo-booth-owners/vlogs");

function readingTime(text: string): string {
  const words = text.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

export function getAllVlogs(): VlogPost[] {
  if (!fs.existsSync(VLOGS_DIR)) return [];

  return fs
    .readdirSync(VLOGS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(VLOGS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        excerpt: String(data.excerpt ?? ""),
        published_at: String(data.published_at ?? ""),
        supercut_url: data.supercut_url ? String(data.supercut_url) : undefined,
        youtube_id: data.youtube_id ? String(data.youtube_id) : undefined,
        tags: Array.isArray(data.tags) ? data.tags : [],
        readingTime: readingTime(content),
        content,
      };
    })
    .sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
}

export function getVlogBySlug(slug: string): VlogPost | null {
  const filePath = path.join(VLOGS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    published_at: String(data.published_at ?? ""),
    supercut_url: data.supercut_url ? String(data.supercut_url) : undefined,
    youtube_id: data.youtube_id ? String(data.youtube_id) : undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTime: readingTime(content),
    content,
  };
}
