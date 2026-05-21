"use client";

import { useEffect, useRef } from "react";

const GISCUS = {
  repo: "ninjaforhire/andrewwebber.dev",
  repoId: "R_kgDOSMcXvQ",
  category: "General",
  categoryId: "DIC_kwDOSMcXvc4C9j9B",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  theme: "dark",
  lang: "en",
};

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.querySelector("script[data-giscus]")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.giscus = "true";
    script.dataset.repo = GISCUS.repo;
    script.dataset.repoId = GISCUS.repoId;
    script.dataset.category = GISCUS.category;
    script.dataset.categoryId = GISCUS.categoryId;
    script.dataset.mapping = GISCUS.mapping;
    script.dataset.strict = GISCUS.strict;
    script.dataset.reactionsEnabled = GISCUS.reactionsEnabled;
    script.dataset.emitMetadata = GISCUS.emitMetadata;
    script.dataset.inputPosition = GISCUS.inputPosition;
    script.dataset.theme = GISCUS.theme;
    script.dataset.lang = GISCUS.lang;
    script.dataset.loading = "lazy";
    ref.current.appendChild(script);
  }, []);

  return (
    <section
      aria-label="Comments"
      className="mt-16 md:mt-24 border-t border-border pt-12 md:pt-16"
    >
      <h2 className="font-mono text-xs font-medium tracking-[0.3em] uppercase text-warm mb-6">
        § Comments
      </h2>
      <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl">
        Sign in with GitHub to leave a comment. All comments are public and
        backed by GitHub Discussions on this site&apos;s repo.
      </p>
      <div ref={ref} />
    </section>
  );
}
