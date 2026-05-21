import type { ComponentPropsWithoutRef } from "react";

type Props<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

export const blogMDXComponents = {
  h2: (props: Props<"h2">) => (
    <h2
      className="mt-16 md:mt-24 mb-6 md:mb-8 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-[1.15]"
      {...props}
    />
  ),
  h3: (props: Props<"h3">) => (
    <h3
      className="mt-12 md:mt-16 mb-4 md:mb-6 text-xl md:text-2xl font-extrabold tracking-tight text-warm leading-snug"
      {...props}
    />
  ),
  h4: (props: Props<"h4">) => (
    <h4
      className="mt-10 mb-3 text-lg md:text-xl font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: Props<"p">) => (
    <p
      className="my-7 md:my-8 text-lg md:text-xl leading-[1.8] text-muted-foreground"
      {...props}
    />
  ),
  ul: (props: Props<"ul">) => (
    <ul
      className="my-7 md:my-8 list-disc pl-6 md:pl-8 space-y-3 text-lg md:text-xl leading-[1.7] text-muted-foreground marker:text-warm"
      {...props}
    />
  ),
  ol: (props: Props<"ol">) => (
    <ol
      className="my-7 md:my-8 list-decimal pl-6 md:pl-8 space-y-3 text-lg md:text-xl leading-[1.7] text-muted-foreground marker:text-warm marker:font-mono"
      {...props}
    />
  ),
  li: (props: Props<"li">) => <li className="pl-2" {...props} />,
  blockquote: (props: Props<"blockquote">) => (
    <blockquote
      className="my-12 md:my-16 border-l-4 border-warm bg-warm/5 py-5 pl-6 pr-4 md:pl-8 text-xl md:text-2xl font-medium leading-snug text-foreground not-italic [&>p]:m-0 [&>p]:text-foreground [&>p]:text-xl md:[&>p]:text-2xl [&>p]:font-medium [&>p]:leading-snug"
      {...props}
    />
  ),
  a: (props: Props<"a">) => (
    <a
      className="text-data underline decoration-data/40 underline-offset-4 transition-colors hover:decoration-data"
      {...props}
    />
  ),
  strong: (props: Props<"strong">) => (
    <strong className="text-foreground font-semibold" {...props} />
  ),
  em: (props: Props<"em">) => (
    <em className="text-foreground font-medium not-italic" {...props} />
  ),
  code: (props: Props<"code">) => (
    <code
      className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.92em] text-terminal"
      {...props}
    />
  ),
  pre: (props: Props<"pre">) => (
    <pre
      className="my-8 rounded-lg border border-border bg-card overflow-x-auto p-4 text-sm font-mono leading-relaxed"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 md:my-16 border-border" />,
};
