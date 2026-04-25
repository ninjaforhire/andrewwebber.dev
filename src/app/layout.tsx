import type { Metadata } from "next";
import { mono, heading, body } from "@/lib/fonts";
import { NavRail } from "@/components/layout/NavRail";
import { InquiryPill } from "@/components/layout/InquiryPill";
import { LenisProvider } from "@/components/layout/LenisProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Andrew Webber — Builder / Automation Architect",
    template: "%s | andrewwebber.dev",
  },
  description:
    "170+ AI tools. 377K+ lines of code. Builder, automation architect, and creative coder from Fort Worth, TX.",
  metadataBase: new URL("https://andrewwebber.dev"),
  openGraph: {
    title: "Andrew Webber — Builder / Automation Architect",
    description:
      "170+ AI tools. 377K+ lines of code. Builder, automation architect, and creative coder from Fort Worth, TX.",
    url: "https://andrewwebber.dev",
    siteName: "andrewwebber.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Webber — Builder / Automation Architect",
    description:
      "170+ AI tools. 377K+ lines of code. Builder, automation architect, and creative coder from Fort Worth, TX.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${heading.variable} ${body.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <LenisProvider>
          <NavRail />
          <main className="ml-16">{children}</main>
          <InquiryPill />
        </LenisProvider>
      </body>
    </html>
  );
}
