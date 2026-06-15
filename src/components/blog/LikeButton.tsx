"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  slug: string;
}

const STORAGE_KEY = (slug: string) => `blog:like:${slug}`;
const COUNT_KEY = (slug: string) => `blog:likes:${slug}`;

export function LikeButton({ slug }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setLiked(localStorage.getItem(STORAGE_KEY(slug)) === "1");
    const raw = localStorage.getItem(COUNT_KEY(slug));
    setCount(raw ? parseInt(raw, 10) || 0 : 0);
  }, [slug]);

  const toggle = () => {
    const nextLiked = !liked;
    const nextCount = Math.max(0, count + (nextLiked ? 1 : -1));
    setLiked(nextLiked);
    setCount(nextCount);
    localStorage.setItem(STORAGE_KEY(slug), nextLiked ? "1" : "0");
    localStorage.setItem(COUNT_KEY(slug), String(nextCount));
  };

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-mono text-muted-foreground">
        <Heart size={16} aria-hidden /> <span className="opacity-50">—</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      onClick={toggle}
      className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-mono uppercase tracking-wider transition-all duration-200 ${
        liked
          ? "border-warm/40 bg-warm/10 text-warm"
          : "border-border bg-card text-muted-foreground hover:border-warm/40 hover:text-warm"
      }`}
    >
      <Heart
        size={16}
        className={`transition-transform ${liked ? "fill-warm scale-110" : "group-hover:scale-110"}`}
      />
      <span className="tabular-nums">{count}</span>
      <span className="hidden sm:inline">
        {liked ? "Liked" : "Like"}
      </span>
    </button>
  );
}
