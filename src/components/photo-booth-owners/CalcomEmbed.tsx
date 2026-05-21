"use client";

interface CalcomEmbedProps {
  calLink?: string;
  label: string;
  description: string;
}

export function CalcomEmbed({ calLink, label, description }: CalcomEmbedProps) {
  if (!calLink) {
    return (
      <div className="rounded-lg border border-border bg-card/30 p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
          {label}
        </p>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>
        <div className="rounded-md border border-warm/20 bg-warm/5 px-4 py-3 font-mono text-xs text-warm">
          Cal.com link coming soon. Use the inquiry form below to book.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <iframe
        src={`https://cal.com/${calLink}?embed=true`}
        className="w-full min-h-[600px] border-0"
        title={label}
      />
    </div>
  );
}
