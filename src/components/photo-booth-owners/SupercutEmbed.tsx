"use client";

interface SupercutEmbedProps {
  url: string;
  title?: string;
}

export function SupercutEmbed({ url, title = "Recording" }: SupercutEmbedProps) {
  if (!url) return null;

  return (
    <div className="my-8 rounded-lg border border-data/20 bg-card/30 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-data/20 font-mono text-xs text-data uppercase tracking-wider">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-data animate-pulse" />
        Supercut Recording — {title}
      </div>
      <div className="relative aspect-video">
        <iframe
          src={url}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
