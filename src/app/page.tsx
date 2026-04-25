export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-terminal">
          initializing
        </p>
        <h1 className="font-heading text-5xl font-bold tracking-tight">
          Andrew
          <br />
          <span className="text-data">Webber</span>
        </h1>
        <p className="mt-1 font-mono text-lg text-muted-foreground">
          <span className="text-creative">.dev</span>
        </p>
        <p className="mt-6 max-w-md text-sm text-muted-foreground">
          Builder / Automation Architect / Creative Coder
        </p>
        <div className="mt-8 flex gap-4 font-mono text-xs">
          <span className="text-terminal">170+ tools</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-data">377K+ LOC</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-creative">20 yrs building</span>
        </div>
      </div>
    </div>
  );
}
