"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = "Video" }: YouTubeEmbedProps) {
  if (!videoId) return null;

  return (
    <div className="my-8 rounded-lg border border-warm/20 bg-card/30 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-warm/20 font-mono text-xs text-warm uppercase tracking-wider">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-warm" />
        YouTube — {title}
      </div>
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}
