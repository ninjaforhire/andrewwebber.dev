"use client";

export function DesignRequestForm() {
  return (
    <div className="max-w-2xl rounded-lg border border-border bg-card/30 p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
        Design Request Form
      </p>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Read the policy above before submitting. Incomplete briefs are not accepted.
      </p>

      <div className="space-y-4 opacity-60 pointer-events-none select-none">
        {["Your Name", "Business Name", "Email", "Event Date", "Service Requested"].map((label) => (
          <div key={label}>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {label}
            </label>
            <div className="w-full h-10 rounded-md border border-border bg-muted/20" />
          </div>
        ))}
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Creative Direction
          </label>
          <div className="w-full h-24 rounded-md border border-border bg-muted/20" />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Brand Kit / Assets
          </label>
          <div className="w-full h-10 rounded-md border border-border bg-muted/20" />
        </div>
      </div>

      <div className="mt-6 rounded-md border border-warm/20 bg-warm/5 px-4 py-3 font-mono text-xs text-warm">
        Form wiring coming soon. Email andrew@mightyphotobooths.com with subject "Design Request" to
        submit now.
      </div>
    </div>
  );
}
