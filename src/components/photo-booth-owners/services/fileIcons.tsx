// Monoline SVG icon set for the services explorer. No emoji anywhere.
// Every icon is a 16px stroke glyph that inherits `currentColor`, so the
// folder's accent drives its color. One glyph per group + a generic file
// glyph + the folder chevron.

interface IconProps {
  className?: string;
}

const base = "shrink-0";

function svg(children: React.ReactNode, props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`${base} ${props.className ?? ""}`}
    >
      {children}
    </svg>
  );
}

// software — angle brackets (code)
export const SoftwareIcon = (p: IconProps) =>
  svg(
    <>
      <path d="M5.5 4 2 8l3.5 4" />
      <path d="M10.5 4 14 8l-3.5 4" />
    </>,
    p
  );

// brand — layered squares (design canvas)
export const BrandIcon = (p: IconProps) =>
  svg(
    <>
      <rect x="2.5" y="2.5" width="8" height="8" rx="1" />
      <path d="M5.5 13.5H12a1.5 1.5 0 0 0 1.5-1.5V5.5" />
    </>,
    p
  );

// seo — magnifier over a bar (search + rank)
export const SeoIcon = (p: IconProps) =>
  svg(
    <>
      <circle cx="6.5" cy="6.5" r="3.5" />
      <path d="m11 11 3 3" />
    </>,
    p
  );

// security — shield
export const SecurityIcon = (p: IconProps) =>
  svg(<path d="M8 1.8 13 4v4c0 3.2-2.2 5.4-5 6.4C5.2 13.4 3 11.2 3 8V4l5-2.2Z" />, p);

// ops — terminal window with prompt
export const OpsIcon = (p: IconProps) =>
  svg(
    <>
      <rect x="1.8" y="2.8" width="12.4" height="10.4" rx="1.4" />
      <path d="m4.5 7 2 1.5-2 1.5" />
      <path d="M8.5 10.5h3" />
    </>,
    p
  );

// generic file
export const FileIcon = (p: IconProps) =>
  svg(
    <>
      <path d="M4 1.8h4.5L12 5.3V13a1.2 1.2 0 0 1-1.2 1.2H4A1.2 1.2 0 0 1 2.8 13V3A1.2 1.2 0 0 1 4 1.8Z" />
      <path d="M8.3 2v3.2H12" />
    </>,
    p
  );

// disclosure chevron (rotated via CSS when open)
export const Chevron = (p: IconProps) =>
  svg(<path d="m6 4 4 4-4 4" />, p);

const GROUP_ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  software: SoftwareIcon,
  brand: BrandIcon,
  seo: SeoIcon,
  security: SecurityIcon,
  ops: OpsIcon,
};

export function GroupIcon({ groupKey, className }: { groupKey: string; className?: string }) {
  const Icon = GROUP_ICONS[groupKey] ?? FileIcon;
  return <Icon className={className} />;
}
