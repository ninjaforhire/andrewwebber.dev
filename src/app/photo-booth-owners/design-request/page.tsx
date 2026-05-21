import type { Metadata } from "next";
import Link from "next/link";
import { PolicyBlock } from "@/components/photo-booth-owners/PolicyBlock";
import { DesignRequestForm } from "@/components/photo-booth-owners/DesignRequestForm";

export const metadata: Metadata = {
  title: "Design Request — Photo Booth Operators",
  description:
    "Design request policy and intake form. Read the rules before submitting. 7-day notice required.",
};

export default function DesignRequestPage() {
  return (
    <div className="page-x py-16 md:py-32">
      <Link
        href="/photo-booth-owners"
        className="font-mono text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:text-warm"
      >
        ← Photo Booth Operators
      </Link>

      <div className="mt-12 font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-6">
        Design Requests
      </div>

      <h1 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-6">
        Read this
        <br />
        <span className="text-warm">before you submit.</span>
      </h1>

      <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mb-12 md:mb-16">
        These rules are not negotiable. They exist to protect the quality of the work — yours and ours.
      </p>

      <PolicyBlock />

      <div className="mt-16 md:mt-24 pt-12 border-t border-white/5">
        <h2 className="crop font-extrabold text-[clamp(36px,6vw,80px)] leading-[0.9] mb-8">
          Submit a request.
        </h2>
        <DesignRequestForm />
      </div>
    </div>
  );
}
