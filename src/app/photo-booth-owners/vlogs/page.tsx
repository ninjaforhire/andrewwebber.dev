import type { Metadata } from "next";
import Link from "next/link";
import { getAllVlogs } from "@/lib/vlogs";
import { VlogIndex } from "@/components/photo-booth-owners/VlogIndex";

export const metadata: Metadata = {
  title: "Deep Dives — Photo Booth Operators",
  description:
    "Build logs, walkthroughs, and operator breakdowns. Supercut recordings and YouTube sessions.",
};

export default function VlogsPage() {
  const posts = getAllVlogs();

  return (
    <div className="page-x py-16 md:py-32">
      <Link
        href="/photo-booth-owners"
        className="font-mono text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:text-data"
      >
        ← Photo Booth Operators
      </Link>

      <div className="mt-12 font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6">
        § 03 — Deep Dives
      </div>

      <h1 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-6">
        Behind the
        <br />
        <span className="text-data">build.</span>
      </h1>

      <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mt-6 mb-12 md:mb-16">
        Walkthroughs, build logs, and operator breakdowns. Supercut recordings and YouTube sessions
        — no fluff, no sponsorships.
      </p>

      <VlogIndex posts={posts} />
    </div>
  );
}
